# -*- coding: utf-8 -*-
"""World 3, phase 2 (彩虹海): the five hero islands (绿巨人 · 雷神 · 黑豹 · 黑寡妇 · 鹰眼) and their 20 games (fast mode).
 01 every new game at levels 1-5: a right answer earns its star, a wrong one earns nothing and the next question is a new one
    (and the next right one earns its star again); the levels rise (more options / harder forms)
 02 real mouse input on the right answer, both orientations (taps; the hammer flicked; the torch dragged; Panther slid)
 03 every tap target >= 88 px, on screen and really on top (3 x 3 samples), levels 1-5, landscape and portrait
 04 no repeated play logic: the 15 new plays each have their own rule and none shares its play code with any other game
 05 the writing: only the island's 2 characters + exactly one old friend (the most due character written before)
 06 a tap on the read card / the secret word says it - and that question earns no star
 07 the new books use only characters learned by then; the new 读一读 sentences only appear once their characters are known
 08 progression: island n+1 opens only after island n's flag (4 ✓ + its characters passed); the seventh flag -> 彩虹海's own
    festival and finale (finale_w3); no "soon" islands any more; the parent's red dot
 09 every sentence said has a recording; no page errors
usage: python tests/test_w3new.py"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, q, step, answer_question, wait_next_question, Log

log = Log('w3new')
NEW = ['hulk3', 'thor3', 'panther3', 'widow3', 'hawk3']
OPEN = "() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); }); Store.save(); }"
AUDIT = """() => {
  const out = [];
  const els = Array.from(Stage.el.querySelectorAll('[data-gid]')).filter(e => !e.dataset.gid.startsWith('char:'));
  els.forEach(e => {
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


def go(page, isl, g, lv, seed):
    page.evaluate("([i, g]) => { Store.w(i).gstars[g] = 0; Store.save(); }", [isl, g])
    page.evaluate("([i, g, l, s]) => window.__go(i, g, l, { seed: s })", [isl, g, lv, seed])
    return wait_phase(page, timeout=30000)


def answer(page, strat):
    """one question with a strategy; writing 'wrong' = one slip, then every stroke right (the character is finished)"""
    cur = wait_phase(page, timeout=20000)
    gen = cur['gen']
    if cur['kind'] == 'write' and strat == 'wrong':
        step(page, 'wrong')
        strat = 'right'
    g2, snap = answer_question(page, strat, timeout=20000)
    return gen, cur


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate(OPEN)
    games = page.evaluate("%s.flatMap(i => ISL[i].games.map(g => [i, g]))" % json.dumps(NEW))
    log.check(len(games) == 20 and all(g.split(':')[1] in ('find', 'write', 'en', 'quiz') for _, g in games), '20 new games, the four slots on every island %s' % [g for _, g in games])

    # 01 right / wrong / right at every level
    bad, lvinfo = [], {}
    for isl, g in games:
        for lv in range(1, 6):
            try:
                cur = go(page, isl, g, lv, 11 + lv)
                s0 = stars(page)
                gen1, c1 = answer(page, 'right'); wait_next_question(page, gen1)
                s1 = stars(page)
                gen2, c2 = answer(page, 'wrong'); wait_next_question(page, gen2)
                s2 = stars(page)
                gen3, c3 = answer(page, 'right'); wait_next_question(page, gen3)
                s3 = stars(page)
                k1, k2, k3 = (json.dumps(c['q'].get('k')) for c in (c1, c2, c3))
                ok = s1 == s0 + 1 and s2 == s1 and s3 == s2 + 1 and k1 != k2 and k2 != k3 and gen2 != gen3
                if not ok:
                    bad.append((g, lv, [s0, s1, s2, s3], k1, k2, k3))
                q0 = cur['q']
                lvinfo.setdefault(g, {})[lv] = len(q0.get('opts') or []) + (q0.get('copies') or 0) + (10 if q0.get('pivot') or len(q0.get('seq') or []) > 1 or q0.get('noun') or q0.get('scatter') else 0)
            except Exception as e:
                bad.append((g, lv, 'ERR', str(e)[:140]))
            page.evaluate("gesture('home')"); page.wait_for_timeout(120)
    log.check(not bad, '01 every game, levels 1-5: right -> a star; wrong -> nothing and a NEW question; right again -> a star %s' % bad[:6])
    flat = [g for g, v in lvinfo.items() if not g.endswith(':write') and g not in ('thor3:quiz', 'widow3:quiz') and not (v.get(5, 0) > v.get(1, 0))]
    log.check(not flat, '01 the levels rise (level 5 harder than level 1: more options, more copies, two steps, phrases, scattered) %s' % {g: lvinfo[g] for g in flat})
    r = page.evaluate("""() => { const G = { world: 'thor3', W: ISL.thor3, rng: RNG(3), bags: {}, needPass: [], ws: Store.w('thor3') }, a = new Set(), b = new Set();
      for (let i = 0; i < 40; i++) { a.add(GAMES['thor3:quiz'].gen(G, { level: 1 }).answer); b.add(GAMES['thor3:quiz'].gen(G, { level: 4 }).answer); } return [Array.from(a).sort().join(''), Array.from(b).sort().join('')]; }""")
    log.check(set(r[0]) == set('六七八九十') and set(r[1]) > set(r[0]), '01 十格灯: levels 1-2 the island\'s numbers, from level 3 every number known (1-10) %s' % r)
    r = page.evaluate("""() => { const G = { world: 'widow3', W: ISL.widow3, rng: RNG(3), bags: {}, needPass: [], ws: Store.w('widow3') }, one = [], five = [];
      for (let i = 0; i < 40; i++) { one.push(GAMES['widow3:quiz'].gen(G, { level: 1 })); five.push(GAMES['widow3:quiz'].gen(G, { level: 5 })); }
      return [one.filter(q => q.pivot || q.fam === 'bluey').length, five.filter(q => q.pivot).length, five.filter(q => q.fam === 'bluey').length]; }""")
    log.check(r[0] == 0 and r[1] > 0 and r[2] > 0, '01 全家福: level 1 the words in one family photo; level 5 a second family and "他的姐姐" %s' % r)

    # 02 real mouse input
    for ori, vw, vh in (('L', 1180, 820), ('P', 820, 1180)):
        pg = new_page(br, base, vw, vh); enter(pg); pg.wait_for_function("!!Hanzi.data", timeout=15000); pg.evaluate(OPEN)
        probs = []
        for isl, g in games:
            if g.endswith(':write'):
                continue
            try:
                go(pg, isl, g, 3, 5)
                pg.wait_for_timeout(350)
                s0 = stars(pg)
                gen = q(pg)['gen']
                for _ in range(14):
                    cur = q(pg)
                    if not cur or cur['gen'] != gen or cur['submitted']:
                        break
                    if cur['phase'] not in ('ready', 'input', 'act'):
                        pg.wait_for_timeout(60); continue
                    s = pg.evaluate("window.__next('right')")
                    if not s:
                        break
                    at = s['at']
                    if s['g'] == 'tap':
                        pg.mouse.click(at['x'], at['y'])
                    else:                       # a drag (torch) or a flick (hammer): pointer down, move towards, up
                        to = s['to']
                        pg.mouse.move(at['x'], at['y']); pg.mouse.down()
                        for k in range(1, 11):
                            f = k / 10 * (0.45 if g == 'thor3:find' else 1)
                            pg.mouse.move(at['x'] + (to['x'] - at['x']) * f, at['y'] + (to['y'] - at['y']) * f)
                        pg.mouse.up()
                    pg.wait_for_timeout(250)
                wait_next_question(pg, gen, timeout=20000)
                if stars(pg) != s0 + 1:
                    probs.append((g, 'no star', s0, stars(pg)))
            except Exception as e:
                probs.append((g, 'ERR', str(e)[:120]))
            pg.evaluate("gesture('home')"); pg.wait_for_timeout(150)
        # Panther slid along the stones and let go on the right one
        try:
            go(pg, 'panther3', 'panther3:find', 3, 9); pg.wait_for_timeout(350)
            s0 = stars(pg); gen = q(pg)['gen']
            pt = pg.evaluate("""() => { const st = Session.st, a = st.G.actors.panther.root.getBoundingClientRect(), c = st.cards[st.opts.indexOf(st.q.answer)].getBoundingClientRect();
              return { ax: a.left + a.width / 2, ay: a.top + a.height * 0.6, cx: c.left + c.width / 2, cy: c.top + c.height / 2 }; }""")
            pg.mouse.move(pt['ax'], pt['ay']); pg.mouse.down()
            for k in range(1, 16):
                pg.mouse.move(pt['ax'] + (pt['cx'] - pt['ax']) * k / 15, pt['ay'] + (pt['cy'] - pt['ay']) * k / 15)
            pg.mouse.up()
            wait_next_question(pg, gen, timeout=20000)
            if stars(pg) != s0 + 1:
                probs.append(('panther slide', 'no star'))
        except Exception as e:
            probs.append(('panther slide', 'ERR', str(e)[:120]))
        pg.evaluate("gesture('home')")
        log.check(not probs, '02 %s: real mouse input on the right answer of all 15 tap / flick / drag / slide plays earns the star %s' % (ori, probs[:6]))
        log.check(not pg.errors, '02 %s no page errors %s' % (ori, pg.errors[:3]))
        pg.context.close()

    # 03 layout
    for ori, vw, vh in (('L', 1180, 820), ('P', 820, 1180), ('L2', 1024, 768), ('P2', 768, 1024)):
        pg = new_page(br, base, vw, vh); enter(pg); pg.wait_for_function("!!Hanzi.data", timeout=15000); pg.evaluate(OPEN)
        probs = []
        for isl, g in games:
            for lv in (range(1, 6) if ori in ('L', 'P') else (1, 5)):
                try:
                    go(pg, isl, g, lv, 3 + lv)
                except Exception:
                    probs.append((g, lv, 'no question')); continue
                pg.wait_for_timeout(450)
                a = pg.evaluate(AUDIT)
                for t in a['t']:
                    small = min(t['w'], t['h']) < 88 and t['id'] != 'paper'
                    off = t['x'] < -2 or t['y'] < -2 or t['r'] > a['vw'] + 2 or t['b'] > a['vh'] + 2
                    if small or off or t['cov'] > 0:
                        probs.append((g, lv, t['id'], t['w'], t['h'], 'off' if off else '', 'covered %d%%' % t['cov'] if t['cov'] else ''))
                pg.evaluate("gesture('home')"); pg.wait_for_timeout(80)
        log.check(not probs, '03 %s: 20 games x levels: every target on screen, >= 88 px, on top %s' % (ori, probs[:10]))
        pg.context.close()

    # 04 no repeated play logic
    r = page.evaluate("""() => {
      const NEWG = %s.flatMap(i => ISL[i].games).filter(g => !g.endsWith(':write'));
      const KEYS = ['gen', 'present', 'targets', 'onGesture', 'evaluate', 'win', 'next'], base = [FindBase, ZBase, EnBase, GameBase, WriteBase, ReadBase];
      const own = (g, k) => { const f = GAMES[g][k]; return typeof f === 'function' && !base.some(b => b[k] === f) ? f : null; };
      const rules = NEWG.map(g => GAMES[g].rule), dupRule = rules.filter((x, i) => !x || rules.indexOf(x) !== i);
      const others = Object.keys(GAMES).filter(g => !NEWG.includes(g));
      const shared = [];
      NEWG.forEach(g => KEYS.forEach(k => { const f = own(g, k); if (!f) return; const s = String(f);
        Object.keys(GAMES).forEach(h => { if (h === g) return; const o = GAMES[h][k]; if (typeof o === 'function' && (o === f || String(o) === s)) shared.push(g + '.' + k + '=' + h); }); }));
      /* every new play defines its own question or its own way to answer */
      const thin = NEWG.filter(g => !['gen', 'present', 'targets', 'onGesture'].some(k => own(g, k)));
      const oldRules = others.map(g => GAMES[g].rule).filter(Boolean);
      return { n: NEWG.length, rules, dupRule, shared, thin, oldRules };
    }""" % json.dumps(NEW))
    log.check(r['n'] == 15 and not r['dupRule'] and not r['shared'] and not r['thin'] and not r['oldRules'], '04 15 new plays, 15 rules of their own %s; no play code shared with any other game %s %s' % (r['rules'], r['shared'][:6], r['dupRule'] + r['thin']))

    # 05 the writing: the island's two + one old friend
    res = {}
    for isl in NEW:
        page.evaluate("""(i) => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); });
          const d = DAY(); ['山', '火', '车'].forEach((k, j) => { Store.s.learned[k] = { w: 1, p: 0 }; const m = Mem.touch(k); m.b = 2; m.due = d + 3 - j; });
          Store.s.learned['是'] = { w: 1, p: 0 }; Store.save(); }""", isl)
        page.evaluate("(i) => window.__go(i, i + ':write', 2, { seed: 4 })", isl)
        asked = []
        for k in range(5):
            try:
                gen, cur = answer(page, 'right')
                asked.append(cur['answer'])
                if k < 4:
                    wait_next_question(page, gen)
            except Exception as e:
                asked.append('ERR'); break
        page.wait_for_function("!Session.G", timeout=30000)
        res[isl] = ''.join(asked)
    writable = page.evaluate("(() => { const o = {}; %s.forEach(i => { o[i] = ISL[i].chars.map(c => c.c).filter(k => !NOWRITE.includes(k)).join(''); }); return o; })()" % json.dumps(NEW))
    okw = all(len(writable[i]) == 2 and len(res[i]) == 5 and res[i].count('车') == 1 and all(c in writable[i] + '车' for c in res[i]) and set(writable[i]) <= set(res[i]) for i in NEW)
    log.check(okw, '05 each island writes only its 2 characters %s + exactly one old friend (车: the most due one written before) %s' % (writable, res))

    # 06 reading cards: a tap says it, no star for that question
    probs = []
    for isl, g in (('thor3', 'thor3:quiz'), ('panther3', 'panther3:quiz'), ('widow3', 'widow3:quiz'), ('hawk3', 'hawk3:quiz'), ('widow3', 'widow3:en')):
        page.evaluate(OPEN)
        go(page, isl, g, 3, 6); page.wait_for_timeout(300)
        s0 = stars(page)
        gid = 'word' if g.endswith(':en') else 'read'
        b = page.evaluate("(id) => { const e = Session.st.map[id].getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2]; }", gid)
        page.evaluate("() => { window.__said3 = []; Voice.sayNow = ((f) => function (t, o) { window.__said3.push(t); return f.call(this, t, o); })(Voice.sayNow); }")
        page.mouse.click(b[0], b[1]); page.wait_for_timeout(250)
        said = page.evaluate("window.__said3.slice()")
        gen, snap = answer_question(page, 'right'); wait_next_question(page, gen)
        if not said or stars(page) != s0 or not snap.get('peeked', True):
            probs.append((g, said, s0, stars(page)))
        page.evaluate("gesture('home')"); page.wait_for_timeout(150)
    log.check(not probs, '06 a real tap on the read card / the secret word says it, and that question earns no star %s' % probs)

    # 07 books and sentences
    r = page.evaluate("""() => {
      Store.reset(); const out = [], at = id => ALL_ISL().indexOf(id);
      BOOKS.forEach(b => { const taught = ALL_ISL().slice(0, at(b.after) + 1).flatMap(id => ISL[id].chars.map(c => c.c));
        const txt = b.title + b.pages.map(p => p[0]).join(''), miss = Array.from(txt).filter(c => !/[。！？，]/.test(c) && !taught.includes(c));
        if (miss.length || b.pages.length !== 6 || b.pages.some(p => Array.from(p[0]).length > 8)) out.push(b.id + ':' + miss.join('')); });
      const G = { world: 'thor3', W: ISL.thor3, rng: RNG(2), bags: {} }, kn = knownZh(G);
      const shown = READ.filter(r => Array.from(r[0]).every(c => /[。！？，]/.test(c) || kn.includes(c))).map(r => r[0]);
      return { bad: out, n: BOOKS.length, newBooks: BOOKS.filter(b => %s.includes(b.after)).map(b => b.id + ' ' + b.title), atThor: shown.filter(t => /[一二三四五六七八九十]/.test(t)), early: shown.filter(t => /[红黄蓝绿白爸妈哥姐弟吃喝看走来]/.test(t)) };
    }""" % json.dumps(NEW))
    log.check(not r['bad'] and len(r['newBooks']) >= 2 and r['atThor'] and not r['early'], '07 the books (%d, new: %s) use only characters learned by then, 6 pages of <= 8; 读一读 at 雷神云岛 has the number sentences %s and none with characters still to come %s %s' % (r['n'], r['newBooks'], r['atThor'], r['early'], r['bad']))

    # 08 progression and the ending
    r = page.evaluate("""() => {
      Store.reset(); const out = {}, done = id => { const ws = Store.w(id); ws.unlocked = true; ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); };
      const pass = id => ISL[id].chars.forEach(c => { const m = Mem.touch(c.c); m.pass = ['a', 'b']; m.b = Math.max(1, m.b); });
      ORDER.w1.concat(ORDER.w2, ['xiyou2', 'robot2']).forEach(id => { done(id); Store.w(id).pok = true; });
      Prog.check(false); out.first = [Store.w('hulk3').unlocked, Store.w('thor3').unlocked];
      done('hulk3'); Prog.check(false); out.gamesOnly = Store.w('thor3').unlocked;
      pass('hulk3'); Prog.check(false); out.passed = Store.w('thor3').unlocked && !Store.w('panther3').unlocked;
      const seq = [];
      ['thor3', 'panther3', 'widow3', 'hawk3'].forEach((id, i, a) => { done(id); pass(id); Prog.check(false); seq.push(a[i + 1] ? Store.w(a[i + 1]).unlocked : Store.s.fin.w3); });
      out.seq = seq; out.order = ORDER.w3.join(','); out.partial = !!WORLDS_INFO.w3.partial; out.info = WORLDS_INFO.w3; out.dot = Supply.low();
      Store.s.flags = ALL_ISL().filter(id => ['hawk3'].indexOf(id) < 0 && flagged(id)); Store.s.fin.w1 = 'seen'; Store.s.fin.w2 = 'seen'; Store.s.gate2 = Store.s.gate3 = Store.s.w2seen = Store.s.w3seen = true; Store.save();
      return out; }""")
    log.check(r['first'] == [True, False] and r['gamesOnly'] is False and r['passed'] and r['seq'] == [True, True, True, 'due'] and not r['partial'],
              '08 islands open one after another, only after the flag (4 ✓ + characters passed); the seventh -> the festival is due %s' % r)
    log.check(r['order'] == 'xiyou2,robot2,hulk3,thor3,panther3,widow3,hawk3' and r['info'].get('finale') == 'finale_w3' and r['info'].get('fest') == 'fest3' and r['dot'], '08 彩虹海 has 7 islands, its own festival island and finale; the red dot (last installed world) %s' % r['info'])
    page.evaluate("() => { MapView.useSet('w3'); MapView.closePanel(true); Screens.show('map'); MapView.update(); MapView.after(10); }")
    try:
        page.wait_for_function("Screens.cur === 'finale'", timeout=40000)
        fin = page.evaluate("() => ({ bg: getComputedStyle(document.querySelector('#finale .fbg')).backgroundImage, crowd: document.querySelectorAll('#finale .crowd img').length, soon: Object.keys(MapView.isl).filter(k => /^soon/.test(k)).length, fest: !!MapView.isl.fest, flags: Store.s.flags.includes('hawk3'), dot: document.querySelector('#gear').classList.contains('dot') })")
    except Exception as e:
        fin = {'err': str(e)[:100]}
    log.check('finale_w3' in fin.get('bg', '') and fin.get('crowd', 0) >= 15 and fin.get('soon') == 0 and fin.get('fest') and fin.get('flags') and fin.get('dot'),
              '08 the last flag on the map -> 彩虹海\'s finale (its own scene, everyone of the sea); no "soon" islands; the red dot %s' % fin)
    page.evaluate("gesture('home')")
    miss = page.evaluate("Array.from(window.__vmiss || [])")
    log.check(not miss, '09 every sentence said has a recording %s' % miss[:10])
    log.check(not page.errors, '09 no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
