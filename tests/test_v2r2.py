# -*- coding: utf-8 -*-
"""The v2 round-2 review (docs/REVIEW-V2R2.md), finding by finding:
 01 a review / missed card never costs the island's characters still to pass their turn: on 10 islands, 认字 with the
    first answer wrong - every character still to pass is asked in the session; and the four games played once each
    with one wrong answer per game -> the flag on (nearly) every island
 02 the flag's card is gone before the next island opens (real time): no card over the cloud
 03 a function word's 2nd hint on a review card says its sentence; no picture (了 is not a fire)
 04 读一读: the automatic 2nd hint is a free reminder ("可以点字听听！", the star stays); a tapped character costs it
 05 every Glyph.zh literal in the code has stroke data; the 读一读 button has an icon
 06 是 (9 strokes) is never written: not in 写字 on the sentence island, nor as a review to write, nor traced
 07 a key round keeps the missed items for the next game
 08 all cards out: a flag says "卡册满啦！"
 09 the chest opens the album first (no question, no 'quit' signal); its own button starts the key round
 10 tracing practice records only 'traced' (no pass, no box)
 11 the tests read only what ships (no raw/)
usage: python tests/test_v2r2.py"""
import os, sys, json, re, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, step, q, answer_question, Log

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
log = Log('v2r2')
OPEN = "() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }"


def play(page, isl, game, lv, seed, wrong_first=False, n=600):
    """one session, polled like a child (demos and celebrations pass by themselves); the first own question answered
    wrong if asked; returns the answers of the game's own questions (not review cards)"""
    page.evaluate("([i, g, l, s]) => window.__go(i, g, l, { seed: s })", [isl, game, lv, seed])
    asked, last, strat, owe, tries = [], None, 'right', wrong_first, 0
    for _ in range(n):
        if page.evaluate("!Session.G"): break
        cur = q(page)
        if cur and cur['phase'] in ('act', 'ready', 'input') and not cur['submitted']:
            if cur['gen'] != last:
                last = cur['gen']; own = cur['kind'] not in ('review', 'reads') and not cur.get('demo')
                if own: asked.append(cur['answer'])
                strat = 'wrong' if owe and own and not cur.get('guided') else 'right'
                if strat == 'wrong': owe = False
                tries = 0
            tries += 1
            if strat == 'wrong' and tries > 6: strat = 'right'          # tracing never takes a wrong stroke: the child then traces it
            step(page, strat)
        page.wait_for_timeout(20)
    if not page.evaluate("!Session.G"):
        print('STUCK', isl, game, seed, json.dumps(q(page), ensure_ascii=False)[:300], page.evaluate("Session.G && [Session.G.round, Session.G.rounds, Session.G.finishing]"))
    page.wait_for_function("!Session.G", timeout=30000)
    return asked


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    # 01a: a review card in the session (two due items), the first answer wrong: every character still to pass is asked
    isls = ['bluey', 'huluwa', 'paw', 'xiyou', 'ultra', 'robot', 's1', 's2', 'peppa2', 'bluey2']
    skipped = {}
    for isl in isls:
        page.evaluate(OPEN)
        page.evaluate("(i) => { const d = DAY(); ALL_ISL().slice(0, ALL_ISL().indexOf(i)).forEach(id => { const ws = Store.w(id); ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); ws.pok = true; }); ['人', '口', '大'].forEach(k => { if (ISL[i].chars.every(c => c.c !== k)) { const m = Mem.touch(k); m.b = 2; m.due = d; } }); Store.save(); }", isl)
        g = page.evaluate("(i) => ISL[i].games[0]", isl)
        need = page.evaluate("(i) => ISL[i].chars.map(c => c.c)", isl)
        asked = play(page, isl, g, None, 5, wrong_first=True)
        rounds = page.evaluate("(g) => (GAMES[g] && GAMES[g].rounds) || 5", g)
        miss = [k for k in need if k not in asked]
        if miss and len(need) <= rounds: skipped[isl] = (need, asked, miss)
    log.check(not skipped, '01 the first answer wrong and a review card in the session: every character still to pass is asked (10 islands) %s' % skipped)
    # 01b: the four games once each, the first answer of each wrong -> the flag
    flags = {}
    for isl in isls:
        page.evaluate(OPEN)
        page.evaluate("(i) => { ALL_ISL().slice(0, ALL_ISL().indexOf(i)).forEach(id => { const ws = Store.w(id); ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); ws.pok = true; }); Store.save(); }", isl)
        for g in page.evaluate("(i) => ISL[i].games", isl):
            for seed in (1, 2, 3):
                if page.evaluate("([i, g]) => Prog.gameDone(i, g)", [isl, g]): break
                play(page, isl, g, None, seed, wrong_first=(seed == 1))
        flags[isl] = page.evaluate("(i) => Prog.islandDone(i)", isl)
    nf = [k for k, v in flags.items() if not v]
    log.check(len(nf) <= 1, '01 one wrong answer per game, each game played until its ✓: the flag comes without an extra session on %d of %d islands %s' % (len(isls) - len(nf), len(isls), nf))
    # 03
    page.evaluate(OPEN)
    page.evaluate("() => { Voice.say = ((f) => function (t, o) { (window.__s3 = window.__s3 || []).push(t); return f.call(this, t, o); })(Voice.say); }")
    page.evaluate("() => { const d = DAY(); Store.s.met['了'] = 1; const m = Mem.touch('了'); m.b = 2; m.due = d; Store.save(); window.__go('paw', 'paw:find', 2, { seed: 3, key: true, keyItems: ['了'] }); }")
    wait_phase(page, timeout=30000); page.wait_for_timeout(300)
    r = page.evaluate("() => { window.__s3 = []; const st = Session.st, before = st.taskEl.querySelector('.it').innerHTML; st.game.gestureHint(st); return { kind: st.kind, same: st.taskEl.querySelector('.it').innerHTML === before, said: window.__s3.slice(), want: FW_SENTS['了'][0][0] }; }")
    page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    log.check(r['kind'] == 'review' and r['same'] and r['want'] in r['said'], '03 a function word\'s 2nd hint on a review card: its sentence is said, no picture %s' % r)
    # 04
    page.evaluate(OPEN)
    page.evaluate("window.__go('s2', 's2:quiz', 2, { seed: 3 })"); wait_phase(page, timeout=30000); page.wait_for_timeout(300)
    r = page.evaluate("() => { window.__s3 = []; const st = Session.st; Hints.mark(st, 'hint2'); st.game.gestureHint(st); return { helped: helped(st), said: window.__s3.slice(), text: st.q.text }; }")
    page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    log.check(r['helped'] is False and '可以点字听听！' in r['said'] and r['text'] not in r['said'], '04 读一读: the automatic 2nd hint is a reminder - the star stays, the sentence is not read for the child %s' % r)
    # 05
    data = json.load(open(os.path.join(ROOT, 'assets', 'data', 'hanzi.json'), encoding='utf-8'))
    lits = set()
    for f in glob.glob(os.path.join(ROOT, 'src', '*.js')):
        lits |= set(re.findall(r"Glyph\.zh\('(.)'", open(f, encoding='utf-8').read()))
    nodata = sorted(c for c in lits if c not in data)
    page.evaluate(OPEN)
    icon = page.evaluate("() => { const n = GAMES['s1:quiz'].icon(); return n.querySelectorAll('svg path, svg circle, img').length; }")
    log.check(not nodata and icon > 0, '05 every Glyph.zh literal has stroke data %s; the 读一读 icon draws (%d shapes)' % (nodata, icon))
    # 06
    r = page.evaluate("""() => { const G = { world: 's1', W: ISL.s1, ws: Store.w('s1'), game: GAMES['s1:write'], rng: RNG(5), bags: {}, needPass: ISL.s1.chars.map(c => c.c) }, got = new Set();
      for (let i = 0; i < 200; i++) got.add(GAMES['s1:write'].gen(G, { level: 2, rng: G.rng }).answer);
      const fits = Review.fits({ game: GAMES['s2:write'] }, '是');
      const G2 = { world: 's1', W: ISL.s1, ws: Store.w('s1'), game: GAMES['s1:write'], rng: RNG(2), wfMode: 2, rvUsed: [], round: 0 }, tr = [];
      for (let r = 0; r < 12; r++) { G2.round = r; const s = Review.slot(G2); if (s.form === 'trace') tr.push(s.k); }
      return { written: Array.from(got).sort(), fits, traced: tr.includes('是') }; }""")
    log.check('是' not in r['written'] and len(r['written']) == 4 and r['fits'] is False and not r['traced'], '06 是 (9 strokes) is read, never written or traced %s' % r)
    # 07
    page.evaluate(OPEN)
    page.evaluate("() => { const d = DAY(); const m = Mem.touch('人'); m.b = 2; m.due = d; Store.s.missNext = ['日']; Store.s.key.day = -1; Store.s.lastDay = d; Store.save(); Keys.start(); }")
    wait_phase(page, timeout=30000)
    for _ in range(10):
        if page.evaluate("!Session.G"): break
        try: answer_question(page, 'right')
        except Exception: break
    page.wait_for_function("!Session.G", timeout=30000)
    r = page.evaluate("Store.s.missNext")
    log.check(r == ['日'], '07 a key round keeps the missed items for the next game %s' % r)
    # 08
    page.evaluate("() => { window.__s3 = []; Store.s.album.n = CARDS.length; Store.save(); Keys.turn('flag'); }")
    r = page.evaluate("window.__s3.slice()")
    log.check('卡册满啦！' in r, '08 all cards out: a flag says "卡册满啦！" %s' % r)
    # 09 a real tap on the chest
    page.evaluate(OPEN)
    page.evaluate("() => { const d = DAY(); const m = Mem.touch('人'); m.b = 2; m.due = d; Store.s.key.day = -1; Store.s.lastDay = d; Store.save(); MapView.update(); }")
    page.wait_for_timeout(300)
    b = page.evaluate("(() => { const e = document.querySelector('#chestbtn'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()")
    if b: page.mouse.click(b[0], b[1]); page.wait_for_timeout(500)
    r = page.evaluate("({ album: !!document.querySelector('#album'), session: !!Session.G, keyGo: Mem.today().keyGo || 0 })")
    go = page.evaluate("(() => { const a = document.querySelector('#album'); if (!a) return null; const bs = Array.from(a.querySelectorAll('button')).filter(x => x.querySelector('img[src*=chest]')); if (!bs.length) return null; const r = bs[0].getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()")
    if go: page.mouse.click(go[0], go[1]); page.wait_for_timeout(600)
    r2 = page.evaluate("({ session: !!Session.G, key: !!(Session.G && Session.G.key) })")
    if r2['session']: page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    log.check(b and r == {'album': True, 'session': False, 'keyGo': 0} and r2 == {'session': True, 'key': True}, '09 the chest opens the album first (no question, no quit signal), its chest button starts the key round %s %s' % (r, r2))
    # 10
    page.evaluate(OPEN)
    r = page.evaluate("""() => { const G = { practice: false, world: 's1', W: ISL.s1, ws: Store.w('s1'), game: GAMES['s1:write'], sid: 'x', miss: [], round: 0 };
      const st = { game: GAMES['s1:write'], q: { answer: '我' }, tracing: true, noStar: true, wf: true, assists: [] };
      Session.remember(G, st, 'ok'); return { mem: !!Mem.get('我'), traced: Store.s.stat.traced }; }""")
    log.check(r == {'mem': False, 'traced': 1}, '10 tracing practice records only "traced" (no pass, no box) %s' % r)
    # 11
    raw = [os.path.basename(f) for f in glob.glob(os.path.join(ROOT, 'tests', '*.py')) if re.search(r"['\"]raw['\"]", open(f, encoding='utf-8').read())]
    log.check(not raw, '11 no test reads the build-side raw/ folder %s' % raw)
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    page.context.close()
    # 02 real time: the flag's card is gone before the next island's cloud flies
    page = new_page(br, base, 1180, 820, fast=False)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate("""() => { Store.reset(); const ws = Store.w('peppa'); ISL.peppa.games.forEach(g => { ws.gstars[g] = 5; }); ws.pok = true; ws.unlocked = true; Store.w('bluey').justOpened = true; Store.save();
      window.__cover = []; const oa = Element.prototype.animate;
      Element.prototype.animate = function (k, o) { try { if (MapView.isl && MapView.isl.bluey && this === MapView.isl.bluey.cloud) window.__cover.push(Array.from(document.body.children).some(e => e.style && e.style.zIndex === '70' && e.isConnected)); } catch (e) {} return oa.call(this, k, o); };
      MapView.enter(); }""")
    page.wait_for_function("window.__cover.length > 0", timeout=30000)
    r = page.evaluate("({ cover: window.__cover, flags: Store.s.flags, n: Store.s.album.n })")
    log.check(r['cover'] and not any(r['cover']) and 'peppa' in r['flags'] and r['n'] == 1, '02 the flag\'s card is gone before the next island\'s cloud flies (real time) %s' % r)
    br.close()
sys.exit(0 if log.close() else 1)
