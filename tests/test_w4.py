# -*- coding: utf-8 -*-
"""World 4 · 神笔海 (docs/W4-DESIGN.md §11.5): the live islands' games (fast mode unless said).
 00 each island has its four games (find / write / en / quiz) once its file is in; the lazy file came
 01 every game at levels 1-5: a right answer earns its star, a wrong one earns nothing, is explained (a gold ring on the right
    one) and the next question is a new one; a right one after it earns its star again
 02 levels (tests/w4_levels.js): 300 questions a level, the play's own hard(q) rises at every step; five options (or more) and
    exactly one right one - or the two-ask form
 03 real mouse clicks on the right answer at level 3, landscape and portrait (a play whose options come and go is waited for)
 04 every tap target >= 88 px, on screen and really on top (3 x 3 samples): 1180x820, 820x1180, 1024x768, levels 1 / 3 / 5
 05 the rules: every play has its own rule, none the same as another play anywhere in the app, no play code shared
 06 writing: only the island's two characters + exactly one old friend (one the child really wrote before)
 07 a "read, not said" card: a tap says it, and that question earns no star
 08 a save that has passed only 晨光海 (§5.3): the questions of 神笔海 show only characters it knows - 晨光海's, 神笔海's up to
    this island, and those in its memory; never 星光海 / 彩虹海 characters it has not met
 09 the explain step at real speed lasts about 2-5 s; in 一步一步 mode it stops at each beat and goes on with 下一步; in 教一教
    the level is lower and no star is given
 10 the books of the live islands: 自己读 / 一起读 worked out from the known characters; the scrolls are always read together;
    读一读's new sentences only once all their characters are known
 11 every sentence said has a recording (<= 8 characters); no page errors
 12 review questions (old characters due) come into the games and play through
 13 a multi-step question right on its first step(s) and then wrong: explained, no star, no error (auto and 一步一步)
usage: python tests/test_w4.py            W4_ONLY=ultra4 python tests/test_w4.py  (one island)   W4_PARTS=01,04 (some parts)"""
import os, sys, json, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, q, step, answer_question, wait_next_question, Log

HERE = os.path.dirname(os.path.abspath(__file__))
log = Log('w4' + ('_' + os.environ['W4_ONLY'].replace(',', '_') if os.environ.get('W4_ONLY') else ''))
PARTS = os.environ.get('W4_PARTS', '00,01,02,03,04,05,06,07,08,09,10,12,13,11').split(',')
OPEN = "() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); }); Store.save(); }"
AUDIT = """() => {
  const out = [];
  Array.from(Stage.el.querySelectorAll('[data-gid]')).filter(e => !e.dataset.gid.startsWith('char:')).forEach(e => {
    const r = e.getBoundingClientRect(); if (r.width < 2 || getComputedStyle(e).visibility === 'hidden') return;
    let cov = 0, n = 0;
    for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) {
      const x = r.left + r.width * (0.1 + 0.2 * i), y = r.top + r.height * (0.1 + 0.2 * j); n++;
      const h = document.elementFromPoint(x, y), o = h && h.closest('[data-gid]');
      if (!(o === e || (h && e.contains(h)))) cov++;
    }
    out.push({ id: e.dataset.gid, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), cov: Math.round(100 * cov / n) });
  });
  return { vw: innerWidth, vh: innerHeight, t: out };
}"""


def stars(page):
    return page.evaluate("Session.G ? Session.G.stars : -1")


def go(page, isl, g, lv, seed, opt=None):
    page.evaluate("([i, g]) => { Store.w(i).gstars[g] = 0; Store.save(); }", [isl, g])
    o = dict(seed=seed); o.update(opt or {})
    page.evaluate("([i, g, l, o]) => window.__go(i, g, l, o)", [isl, g, lv, o])
    return wait_phase(page, timeout=30000)


def drive(page, strat, max_steps=60):
    """answer the current question with a strategy: the play's next(); 'wait' (nothing to tap yet) is sent as a gesture too
    (a play whose options come and go skips to the next ones)"""
    cur = wait_phase(page, timeout=30000)
    gen = cur['gen']
    if cur['kind'] == 'write' and strat == 'wrong':
        step(page, 'wrong'); strat = 'right'
    for _ in range(max_steps):
        c = q(page)
        if not c or c['gen'] != gen or c['submitted']:
            break
        if c['phase'] not in ('act', 'ready', 'input'):
            page.wait_for_timeout(30); continue
        r = page.evaluate("(st) => { const s = window.__next(st); if (!s) return null; return [s.g, window.__gesture(s.g, s.p)]; }", strat)
        page.wait_for_timeout(40 if r and r[0] == 'wait' else 10)
    return gen, cur


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate(OPEN)
    only = [x for x in os.environ.get('W4_ONLY', '').split(',') if x] or page.evaluate("ORDER.w4.slice()")
    page.evaluate("(o) => { window.__W4ONLY = o; }", only)
    loaded = page.evaluate("W4Lazy.load()")
    games = page.evaluate("(o) => o.filter(i => ORDER.w4.includes(i)).flatMap(i => ISL[i].games.map(g => [i, g]))", only)
    if '00' in PARTS:
        have = page.evaluate("(o) => o.map(i => [i, ISL[i] ? ISL[i].games.filter(g => GAMES[g]).length : 0])", only)
        log.check(loaded and only and all(n == 4 for _, n in have), '00 the lazy file came; every island asked has its four games %s' % have)

    # 01 right / wrong / right at every level
    if '01' in PARTS:
        bad = []
        for isl, g in games:
            for lv in range(1, 6):
                try:
                    go(page, isl, g, lv, 11 + lv)
                    s0 = stars(page)
                    gen1, c1 = drive(page, 'right'); wait_next_question(page, gen1, timeout=30000)
                    s1 = stars(page)
                    gen2, c2 = drive(page, 'wrong'); wait_next_question(page, gen2, timeout=30000)
                    s2 = stars(page)
                    rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen2)
                    gen3, c3 = drive(page, 'right'); wait_next_question(page, gen3, timeout=30000)
                    s3 = stars(page)
                    k1, k2, k3 = (json.dumps(c['q'].get('k')) for c in (c1, c2, c3))
                    if not (s1 == s0 + 1 and s2 == s1 and s3 == s2 + 1 and k1 != k2 and k2 != k3):
                        bad.append((g, lv, [s0, s1, s2, s3], k1[:40], k2[:40], k3[:40]))
                    if not rec or not rec.get('ex') or not rec['ex'].get('right'):
                        bad.append((g, lv, 'no gold ring in the explanation', rec and rec.get('ex')))
                    elif rec['opts'] and rec['answer'] in rec['opts'] and not any('card%d' % i in rec['ex']['right'] for i, v in enumerate(rec['opts']) if v == rec['answer']):
                        bad.append((g, lv, 'the gold ring is not on the right option', rec['ex'], rec['answer'], rec['opts']))
                except Exception as e:
                    bad.append((g, lv, 'ERR', str(e)[:160]))
                page.evaluate("gesture('home')"); page.wait_for_timeout(120)
        log.check(not bad, '01 %d games x levels 1-5: right -> a star; wrong -> no star, explained (gold on the right one), a NEW question; right -> a star %s' % (len(games), bad[:6]))

    # 02 the levels rise; five options or the two-ask form
    if '02' in PARTS:
        lv = page.evaluate(open(os.path.join(HERE, 'w4_levels.js'), encoding='utf-8').read())
        flat = {g: v['lv'] for g, v in lv.items() if not v['ok']}
        optp = {g: v['opts'] for g, v in lv.items() if v['opts']}
        want = len([g for _, g in games if not g.endswith(':write')])
        log.check(len(lv) == want and not flat, '02 every play harder at every level L1 -> L5 (mean hard(q) of 300 questions a level) %s' % (flat or {g: v['lv'] for g, v in lv.items()}))
        log.check(not optp, '02 five options or more, none twice, exactly one right (or the two-ask form) %s' % optp)

    # 03 real mouse input
    if '03' in PARTS:
        for ori, vw, vh in (('L', 1180, 820), ('P', 820, 1180)):
            pg = new_page(br, base, vw, vh); enter(pg); pg.wait_for_function("!!Hanzi.data", timeout=15000); pg.evaluate(OPEN); pg.evaluate("W4Lazy.load()")
            probs = []
            for isl, g in games:
                if g.endswith(':write'):
                    continue
                try:
                    go(pg, isl, g, 3, 5); pg.wait_for_timeout(350)
                    s0 = stars(pg); gen = q(pg)['gen']
                    for _ in range(60):
                        cur = q(pg)
                        if not cur or cur['gen'] != gen or cur['submitted']:
                            break
                        if cur['phase'] not in ('ready', 'input', 'act'):
                            pg.wait_for_timeout(60); continue
                        s = pg.evaluate("window.__next('right')")
                        if not s:
                            pg.wait_for_timeout(60); continue
                        if s['g'] == 'wait':
                            pg.wait_for_timeout(250); continue          # real time: the play shows its next ones by itself
                        at = s['at']
                        if s['g'] == 'tap':
                            pg.mouse.click(at['x'], at['y'])
                        else:
                            to = s['to']; pg.mouse.move(at['x'], at['y']); pg.mouse.down()
                            for k in range(1, 13):
                                pg.mouse.move(at['x'] + (to['x'] - at['x']) * k / 12, at['y'] + (to['y'] - at['y']) * k / 12)
                            pg.mouse.up()
                        pg.wait_for_timeout(300)
                    wait_next_question(pg, gen, timeout=30000)
                    if stars(pg) != s0 + 1:
                        probs.append((g, 'no star', s0, stars(pg)))
                except Exception as e:
                    probs.append((g, 'ERR', str(e)[:120]))
                pg.evaluate("gesture('home')"); pg.wait_for_timeout(150)
            log.check(not probs, '03 %s: real mouse input on the right answer of every play earns the star %s' % (ori, probs[:6]))
            log.check(not pg.errors, '03 %s no page errors %s' % (ori, pg.errors[:3]))
            pg.context.close()

    # 04 layout
    if '04' in PARTS:
        for ori, vw, vh in (('L', 1180, 820), ('P', 820, 1180), ('L2', 1024, 768)):
            pg = new_page(br, base, vw, vh); enter(pg); pg.wait_for_function("!!Hanzi.data", timeout=15000); pg.evaluate(OPEN); pg.evaluate("W4Lazy.load()")
            probs = []
            for isl, g in games:
                for lv in (1, 3, 5):
                    try:
                        go(pg, isl, g, lv, 3 + lv)
                    except Exception:
                        probs.append((g, lv, 'no question')); continue
                    for t_ in (500, 1400):                       # twice: a play whose options come and go is seen at two moments
                        pg.wait_for_timeout(t_)
                        a = pg.evaluate(AUDIT)
                        for t in a['t']:
                            small = min(t['w'], t['h']) < 88 and t['id'] != 'paper'
                            off = t['x'] < -2 or t['y'] < -2 or t['r'] > a['vw'] + 2 or t['b'] > a['vh'] + 2
                            if small or off or t['cov'] > 0:
                                probs.append((g, lv, t['id'], t['w'], t['h'], 'off' if off else '', 'covered %d%%' % t['cov'] if t['cov'] else ''))
                    pg.evaluate("gesture('home')"); pg.wait_for_timeout(80)
            log.check(not probs, '04 %s %dx%d: every target on screen, >= 88 px, on top (levels 1/3/5) %s' % (ori, vw, vh, probs[:10]))
            log.check(not pg.errors, '04 %s no page errors %s' % (ori, pg.errors[:3]))
            pg.context.close()

    # 05 rules of their own, no shared play code
    if '05' in PARTS:
        r = page.evaluate("""(o) => {
          const NEWG = o.filter(i => ORDER.w4.includes(i)).flatMap(i => ISL[i].games).filter(g => !g.endsWith(':write') && GAMES[g]);
          const ALLW4 = ORDER.w4.flatMap(i => ISL[i].games).filter(g => !g.endsWith(':write') && GAMES[g]);
          const KEYS = ['gen', 'present', 'targets', 'onGesture', 'evaluate', 'win', 'next', 'explain'], base = [FindBase, ZBase, EnBase, GameBase, WriteBase, ReadBase, W4X.Base];
          const own = (g, k) => { const f = GAMES[g][k]; return typeof f === 'function' && !base.some(b => b[k] === f) ? f : null; };
          const rules = ALLW4.map(g => GAMES[g].rule), dup = rules.filter((x, i) => !x || rules.indexOf(x) !== i);
          const oldRules = Object.keys(GAMES).filter(g => !ALLW4.includes(g)).map(g => GAMES[g].rule).filter(Boolean), clash = rules.filter(x => oldRules.includes(x));
          const shared = [];
          NEWG.forEach(g => KEYS.forEach(k => { const f = own(g, k); if (!f) return; const s = String(f);
            Object.keys(GAMES).forEach(h => { if (h === g) return; const x = GAMES[h][k]; if (typeof x === 'function' && (x === f || String(x) === s)) shared.push(g + '.' + k + '=' + h); }); }));
          const thin = NEWG.filter(g => !['gen', 'present', 'onGesture'].some(k => own(g, k)));
          return { n: NEWG.length, rules: NEWG.map(g => GAMES[g].rule), dup, clash, shared, thin };
        }""", only)
        log.check(r['n'] == 3 * len(only) and not r['dup'] and not r['clash'] and not r['shared'] and not r['thin'],
                  '05 %d plays, each its own rule %s - unique in 神笔海 and in the app %s; no play code shared %s %s' % (r['n'], r['rules'], r['dup'] + r['clash'], r['shared'][:6], r['thin']))

    # 06 writing: the island's two + one old friend really written before
    if '06' in PARTS:
        res, okw = {}, True
        for isl in only:
            page.evaluate("""(i) => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); });
              const d = DAY(); ['山', '火', '车'].forEach((k, j) => { Store.s.learned[k] = { w: 1, p: 0 }; const m = Mem.touch(k); m.b = 2; m.due = d + 3 - j; });
              ['红', '吃'].forEach(k => { const m = Mem.touch(k); m.b = 2; m.due = d - 9; }); Store.save(); }""", isl)      # seen, never written: no old friend
            page.evaluate("(i) => window.__go(i, i + ':write', 2, { seed: 4 })", isl)
            asked = []
            for k in range(5):
                try:
                    gen, cur = drive(page, 'right'); asked.append(cur['answer'])
                    if k < 4:
                        wait_next_question(page, gen, timeout=30000)
                except Exception:
                    asked.append('ERR'); break
            page.wait_for_function("!Session.G", timeout=30000)
            w2 = page.evaluate("(i) => ISL[i].chars.map(c => c.c).filter(k => !NOWRITE.includes(k)).join('')", isl)
            res[isl] = (w2, ''.join(asked))
            okw = okw and len(w2) == 2 and len(asked) == 5 and asked.count('车') == 1 and all(c in w2 + '车' for c in asked) and set(w2) <= set(asked)
        log.check(okw, '06 each island writes only its two characters + exactly one old friend (车: the most due one really written) %s' % res)

    # 07 read cards: a tap says it, no star
    if '07' in PARTS:
        probs, seen = [], []
        for isl, g in games:
            if g.endswith(':write'):
                continue
            for lv in (2, 4):
                page.evaluate(OPEN)
                go(page, isl, g, lv, 6); page.wait_for_timeout(300)
                has = page.evaluate("!!(Session.st && Session.st.readEl && Session.st.map.read)")
                if not has:
                    page.evaluate("gesture('home')"); page.wait_for_timeout(100); continue
                seen.append('%s L%d' % (g, lv))
                s0 = stars(page)
                b = page.evaluate("() => { const e = Session.st.map.read.getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2]; }")
                page.evaluate("() => { window.__said4 = []; if (!Voice.__s4) { Voice.__s4 = 1; Voice.sayNow = ((f) => function (t, o) { window.__said4.push(t); return f.call(this, t, o); })(Voice.sayNow); } }")
                page.mouse.click(b[0], b[1]); page.wait_for_timeout(250)
                said = page.evaluate("window.__said4.slice()")
                gen, cur = drive(page, 'right'); wait_next_question(page, gen, timeout=30000)
                if not said or stars(page) != s0:
                    probs.append((g, lv, said, s0, stars(page)))
                page.evaluate("gesture('home')"); page.wait_for_timeout(150)
        log.check(not probs, '07 a real tap on a "read, not said" card says it and that question earns no star (%s) %s' % (', '.join(seen) or 'no read cards in these plays', probs))

    # 08 a save that passed only 晨光海: only characters it knows
    if '08' in PARTS:
        r = page.evaluate("""(o) => {
          Store.reset(); const d = DAY();
          ORDER.w1.forEach(id => { const ws = Store.w(id); ws.unlocked = true; ws.pok = true; ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); ISL[id].chars.forEach(c => { const m = Mem.touch(c.c); m.pass = ['a', 'b']; m.b = 2; m.due = d + 3; }); });
          Store.s.flags = ORDER.w1.slice(); Prog.check(false); Store.save();
          const bad = [], cjk = s => Array.from(JSON.stringify(s)).filter(c => /[\\u4e00-\\u9fff]/.test(c));
          o.filter(i => ORDER.w4.includes(i)).forEach(isl => {
            const at = ORDER.w4.indexOf(isl), ok = new Set(ORDER.w1.concat(ORDER.w4.slice(0, at + 1)).flatMap(id => ISL[id].chars.map(c => c.c)));
            ISL[isl].games.forEach(id => { const game = GAMES[id]; if (!game) return;
              for (let lv = 1; lv <= 5; lv++) { const G = { world: isl, W: ISL[isl], id, rng: RNG(40 + lv), bags: {}, needPass: [], asked: [], ws: { lastKey: '' }, game, level: lv, round: 0 };
                for (let i = 0; i < 120; i++) { let qq; try { qq = game.gen(G, { level: lv, rng: G.rng }); } catch (e) { bad.push(id + ' L' + lv + ' ' + e.message); break; }
                  G.asked.push(qq.item || null); const x = cjk(qq).filter(c => !ok.has(c)); if (x.length) { bad.push(id + ' L' + lv + ' ' + Array.from(new Set(x)).join('')); break; } } } });
          });
          return { open: W4X.open(), bad: Array.from(new Set(bad)).slice(0, 10) };
        }""", only)
        log.check(r['open'] and not r['bad'], '08 只过了晨光海的存档: 神笔海 is open and its questions show only 晨光海 / 神笔海 characters it knows %s' % r)

    # 09 the explanation: real speed, step by step, 教一教
    if '09' in PARTS:
        page.evaluate(OPEN)
        res, bad = [], []
        page.evaluate("window.__fast = 0")
        for isl, g in games:
            if g.endswith(':write'):
                continue
            try:
                go(page, isl, g, 2, 5)
                page.evaluate("window.__speechLog.length = 0")
                gen, cur = drive(page, 'wrong')
                page.wait_for_function("(gen) => (window.__exLog || []).some(e => e.gen === gen)", arg=gen, timeout=40000)
                t = page.evaluate("(gen) => window.__exLog.filter(e => e.gen === gen).pop().ms", gen)
                ev = page.evaluate("window.__speechLog.filter(e => e.ch === 'narr').map(e => [e.text, e.ev, e.tag])")
                said = [x[0] for x in ev if x[1] == 'speak' and x[2] == 'explain']
                drop = [x for x in ev if x[1] in ('dropped', 'skip')]
                res.append((g, round(t / 1000, 1)))
                if not (1.5 <= t / 1000 <= 6.0) or not said or drop:
                    bad.append((g, round(t / 1000, 1), said, drop[:2]))
            except Exception as e:
                bad.append((g, 'ERR', str(e)[:120]))
            page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        page.evaluate("window.__fast = 1")
        log.check(not bad, '09 at real speed each explanation lasts about 2-5 s and its lines are said %s %s' % (res, bad))
        # step by step: every beat waits for 下一步
        page.evaluate("() => { Store.s.settings.ex = 'step'; Store.save(); }")
        bad = []
        for isl, g in games:
            if g.endswith(':write'):
                continue
            try:
                go(page, isl, g, 3, 7)
                gen, cur = drive(page, 'wrong')
                beats = 0
                for _ in range(40):
                    page.wait_for_timeout(120)
                    c = q(page)
                    if not c or c['gen'] != gen:
                        break
                    if c.get('stepWaiting'):
                        beats += 1
                        page.evaluate("() => { const b = document.querySelector('.stepbtn'); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 9 })); b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 9, clientX: b.getBoundingClientRect().left + 5, clientY: b.getBoundingClientRect().top + 5 })); }")
                wait_next_question(page, gen, timeout=30000)
                if beats < 2:
                    bad.append((g, 'beats', beats))
            except Exception as e:
                bad.append((g, 'ERR', str(e)[:120]))
            page.evaluate("gesture('home')"); page.wait_for_timeout(150)
        page.evaluate("() => { Store.s.settings.ex = 'auto'; Store.save(); }")
        log.check(not bad, '09 一步一步: every explanation stops at two beats or more and goes on with 下一步 %s' % bad)
        bad = []
        for isl, g in games[:4]:
            page.evaluate("([i, g]) => { Store.w(i).gstars[g] = 5; Store.save(); Teach.on = { isl: i, game: g, drop: 2 }; }", [isl, g])
            page.evaluate("([i, g]) => { Session.start(i, g, { seed: 3 }); }", [isl, g])      # (not awaited: the session runs on)
            try:
                cur = wait_phase(page, timeout=30000)
                want = page.evaluate("([i, g]) => Math.max(1, Prog.level(i, g) - 2)", [isl, g])
                gen, c = drive(page, 'right'); wait_next_question(page, gen, timeout=30000)
                if cur['level'] != want or cur['teach'] != 2 or stars(page) != 0:
                    bad.append((g, cur['level'], want, cur['teach'], stars(page)))
            except Exception as e:
                bad.append((g, 'ERR', str(e)[:100]))
            page.evaluate("gesture('home')"); page.wait_for_timeout(150)
        log.check(not bad, '09 教一教: two levels lower, the 教 badge, no star %s' % bad)

    # 10 books, scrolls, 读一读
    if '10' in PARTS:
        r = page.evaluate("""(o) => {
          Store.reset(); Store.s.all = true; const out = {};
          const w4b = BOOKS.filter(b => ISL[b.after] && ISL[b.after].w === 'w4');
          out.books = w4b.map(b => b.id + ':' + Books.self(b));
          w4b.forEach(b => Array.from(b.title + b.pages.map(p => p[0]).join('')).forEach(c => { if (ITEM[c]) { Store.s.learned[c] = { w: 1, p: 0 }; const m = Mem.touch(c); m.pass = ['a', 'b']; m.b = 2; } }));
          out.after = w4b.map(b => b.id + ':' + Books.self(b));
          out.scrolls = W4X.scrollItems().map(s => s.scroll.id + ':' + s.kind);
          Store.reset(); const G = { world: o[0], W: ISL[o[0]], rng: RNG(2), bags: {} }, kn = knownZh(G);
          out.read = READ.filter(r => Array.from(r[0]).every(c => /[。！？，]/.test(c) || kn.includes(c))).map(r => r[0]).filter(t => W4D.read.some(x => x[0] === t));
          out.readOk = out.read.every(t => Array.from(t).every(c => /[。！？，]/.test(c) || kn.includes(c)));
          out.n4 = W4D.read.length; out.inREAD = W4D.read.every(r => READ.some(x => x[0] === r[0]));
          return out; }""", only)
        allself = all(x.endswith(':true') for x in r['after'] if not x.startswith('b10'))
        log.check(r['inREAD'] and r['readOk'] and allself and all(x.endswith('儿歌卷') or x.endswith('古诗卷') for x in r['scrolls']),
                  '10 books 自己读 once every character is known (%s -> %s; 一家人 keeps 们 家: 一起读), scrolls read together %s; 读一读 has the %d new sentences, shown only when known %s' % (r['books'], r['after'], r['scrolls'], r['n4'], r['read']))
        page.evaluate(OPEN)
        page.evaluate("() => { MapView.closePanel(true); Books.shelf(); }"); page.wait_for_timeout(300)
        sh = page.evaluate("() => { const t = Array.from(document.querySelectorAll('#shelf [data-shelf]')).map(e => { const r = e.getBoundingClientRect(); return [e.dataset.shelf, Math.round(r.width), Math.round(r.height), r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight]; }); return t; }")
        sid = [x[0] for x in sh if x[0] in page.evaluate("W4D.scrolls.map(s => s.id)")]
        if sid:
            page.evaluate("(id) => { document.getElementById('shelf').remove(); W4X.showScroll(id); }", sid[0]); page.wait_for_timeout(300)
            sc = page.evaluate("() => ({ cells: document.querySelectorAll('#scroll4 [data-ch]').length, grey: Array.from(document.querySelectorAll('#scroll4 [data-ch] path')).some(p => p.getAttribute('fill') === '#BDB3A0') })")
            page.evaluate("() => { const s = document.getElementById('scroll4'); if (s) s.remove(); }")
        else:
            sc = {'cells': -1}
            page.evaluate("() => { const s = document.getElementById('shelf'); if (s) s.remove(); }")
        log.check(all(x[1] >= 120 and x[3] for x in sh) and (not sid or sc['cells'] > 0), '10 the shelf: every book and scroll on the screen at once, >= 120 px %s; a scroll opens with its characters (not yet known ones grey) %s' % (len(sh), sc))

    # 12 review questions inside the island's games: old characters due, the island's own passed -> review slots come (the engine's
    #    card, or a bare { k, answer, opts } question in a kind0 'find' play's own frame) and play like any question
    if '12' in PARTS:
        probs, seen = [], {}
        for isl, g in games:
            if g.endswith(':write'):
                continue
            page.evaluate("""(i) => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); });
              const d = DAY(); ['人', '口', '山', '水', '大'].forEach(k => { const m = Mem.touch(k); m.b = 2; m.due = d - 1; m.pass = ['x', 'y']; Store.s.learned[k] = { w: 1, p: 0 }; });
              ISL[i].chars.forEach(c => { const m = Mem.touch(c.c); m.pass = ['x', 'y']; m.b = 1; m.due = d + 5; }); Store.save(); }""", isl)
            page.evaluate("([i, g]) => window.__go(i, g, 3, { seed: 5 })", [isl, g])
            kinds = []
            try:
                for k in range(5):
                    cur = wait_phase(page, timeout=30000)
                    kinds.append(cur['kind'] + (':rv' if cur['q'].get('k') and isinstance(cur['q']['k'], list) and cur['q']['k'] and cur['q']['k'][0] == 'rv' else ''))
                    gen, c2 = drive(page, 'right')
                    if k < 4:
                        wait_next_question(page, gen, timeout=30000)
            except Exception as e:
                kinds.append('ERR ' + str(e)[:80])
            seen[g] = kinds
            if any(x.startswith('ERR') for x in kinds) or len(kinds) < 5:
                probs.append((g, kinds))
            page.evaluate("gesture('home')"); page.wait_for_timeout(150)
        log.check(not probs and any(any(x in ('review', 'review:rv', 'reads') or x.endswith(':rv') for x in v) for v in seen.values()),
                  '12 review questions come into the games and play through (sessions of five) %s %s' % (probs[:3], seen))

    # 13 multi-step questions (two asks, two changes, words in order ...): right on the first step(s), then wrong - in auto mode and
    #    in 一步一步 mode the explanation runs (a gold ring), the question ends as a wrong one, never as an error
    if '13' in PARTS:
        probs, tried = [], []
        for mode in ('auto', 'step'):
            page.evaluate("(m) => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); }); Store.s.settings.ex = m; Store.save(); }", mode)
            page.errors.clear()
            for isl, g in games:
                if g.endswith(':write'):
                    continue
                for lv in (4, 5):
                    for k in (1, 2):
                        try:
                            cur = go(page, isl, g, lv, 31 + lv + k)
                            gen = cur['gen']; n = 0
                            for _ in range(80):                    # k real steps of the right answer (a 'wait' is not a step)
                                c = q(page)
                                if not c or c['gen'] != gen or c['submitted'] or n >= k:
                                    break
                                if c['phase'] not in ('act', 'ready', 'input'):
                                    page.wait_for_timeout(30); continue
                                r = page.evaluate("() => { const s = window.__next('right'); if (!s) return null; return [s.g, window.__gesture(s.g, s.p)]; }")
                                if r and r[0] != 'wait' and r[1] == 'ok':
                                    n += 1
                                page.wait_for_timeout(40)
                            c = q(page)
                            if not c or c['gen'] != gen or c['submitted']:
                                page.evaluate("gesture('home')"); page.wait_for_timeout(100); continue      # one step was the whole answer
                            tried.append('%s L%d %s k%d' % (g, lv, mode, k))
                            drive(page, 'wrong')
                            for _ in range(60):                    # 一步一步: the parent taps 下一步 until it is over
                                c = q(page)
                                if not c or c['gen'] != gen:
                                    break
                                if c.get('stepWaiting'):
                                    page.evaluate("() => { const b = document.querySelector('.stepbtn'); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 9 })); b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 9, clientX: b.getBoundingClientRect().left + 5, clientY: b.getBoundingClientRect().top + 5 })); }")
                                page.wait_for_timeout(120)
                            wait_next_question(page, gen, timeout=30000)
                            rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
                            if not rec or not (rec.get('ex') or {}).get('right') or stars(page) != 0:
                                probs.append((g, lv, mode, k, 'explain', rec and rec.get('ex'), stars(page)))
                        except Exception as e:
                            probs.append((g, lv, mode, k, 'ERR', str(e)[:100]))
                        page.evaluate("gesture('home')"); page.wait_for_timeout(120)
            errs = [e for e in page.errors if 'question error' in e or 'TypeError' in e]
            if errs:
                probs.append((mode, 'errors', errs[:2]))
        page.evaluate("() => { Store.s.settings.ex = 'auto'; Store.save(); }")
        log.check(not probs, '13 multi-step questions right on the first step(s) then wrong: explained, no star, no error - auto and 一步一步 (%d cases: %s) %s' % (len(tried), ', '.join(tried[:12]), probs[:6]))

    if '11' in PARTS:
        miss = page.evaluate("Array.from(window.__vmiss || [])")
        log.check(not miss, '11 every sentence said has a recording %s' % miss[:12])
        log.check(not page.errors, '11 no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
