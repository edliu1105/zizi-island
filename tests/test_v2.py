# -*- coding: utf-8 -*-
"""字字岛 v2 (docs/PLAN-v2.md), rule by rule (fast mode):
 V-01 an old save: what was written becomes "seen" (box 0), islands with four ✓ keep their flag (pok), stars kept
 V-02 memory: a new item's first own try -> box 1 due tomorrow; a due try -> one box up (once a day); not due -> no move;
      wrong or after the 2nd hint -> two boxes down (not below 1), due tomorrow
 V-03 review slots: none when nothing is due; 1 (<= 3 due), 2 (more), 3 while braking; never an item that is not due
 V-04 the pass condition: four ✓ alone is not a flag; every character right in two different sessions is
 V-05 the missed queue: a wrong item comes back two questions later as a review card
 V-06 stars: none after the 2nd hint; none in the key round; none for a 读一读 question where a character was tapped
 V-07 the sentence islands: 补句子 shows a sentence of its function word with the word missing; 读一读 only ever shows
      sentences of taught characters; the abc game there brings back due capitals
 V-08 the daily key: once a day; its round asks due items; the key turns the next card of one fixed order (no chance);
      nothing due -> the key at once; a flag also turns a card
 V-09 the writing fallback: three characters without a star -> the tracing level; three more -> reading cards; the next
      island writes for real again; the parent switch makes the writing game reading cards
 V-10 the story books open after their sentence island; every page <= 8 characters, all taught before
 V-11 the parent check only lowers; the report names the important numbers; export -> import gives the same save
 V-12 the third sea: opens after the second; its gate gold after the second finale; islands to come under cloud; no
      festival for a partial sea; the red dot on the gear
usage: python tests/test_v2.py"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, step, q, Log

log = Log('v2')


def play(page, isl, game, level=2, seed=5, strat='right', n=300, opt=None, finish=True):
    o = dict(seed=seed); o.update(opt or {})
    page.evaluate("([i, g, l, o]) => window.__go(i, g, l, o)", [isl, game, level, o]); wait_phase(page, timeout=30000)
    kinds = []
    for _ in range(n):
        cur = q(page)
        if not cur:
            break
        kinds.append((cur['kind'], cur['answer']))
        step(page, strat if not callable(strat) else strat(cur))
        page.wait_for_timeout(20)
    if finish:
        page.wait_for_function("!Session.G", timeout=30000)
    else:
        page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    return kinds


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    # V-01
    r = page.evaluate("""() => {
      const old = { v: 1, worlds: {}, learned: { 人: { w: 2, p: 0 }, A: { w: 1, p: 0 } }, met: { 人: true }, flags: ['peppa'], fin: { w1: '', w2: '' }, gate2: false, w2seen: false, mapSet: 'w1', settings: { en: true }, all: false };
      ORDER.w1.concat(ORDER.w2, ORDER.w3).forEach(id => { old.worlds[id] = { unlocked: id === 'peppa' || id === 'bluey', gstars: {}, played: [], visits: 0, sessions: 0, stars: 0, story: 0 }; });
      ISL.peppa.games.forEach(g => { old.worlds.peppa.gstars[g] = 5; }); old.worlds.bluey.gstars['bluey:find'] = 3;
      const s = Store.validate(JSON.parse(JSON.stringify(old)));
      return { m: s.mem['人'], mA: s.mem.A, pok: !!s.worlds.peppa.pok, pokB: !!s.worlds.bluey.pok, stars: s.worlds.bluey.gstars['bluey:find'], flags: s.flags, v2: s.v2 };
    }""")
    log.check(r['m'] and r['m']['b'] == 1 and r['mA']['b'] == 1 and r['pok'] and not r['pokB'] and r['stars'] == 3 and r['flags'] == ['peppa'] and r['v2'] == 1,
              'V-01 an old save: written -> box 1 (learning, first tests over a week), four ✓ keeps its flag, stars kept %s' % r)
    # V-02
    r = page.evaluate("""() => {
      Store.reset(); const d = DAY(), out = [];
      Mem.answer('人', 'ok', 'a'); let m = Mem.get('人'); out.push([m.b, m.due - d]);
      Mem.answer('人', 'ok', 'b'); m = Mem.get('人'); out.push([m.b, m.due - d]);                 /* not due: no move */
      m.due = d; m.up = d - 1; Mem.answer('人', 'ok', 'c'); m = Mem.get('人'); out.push([m.b, m.due - d]);   /* due: up to 2, +3 */
      m.due = d; Mem.answer('人', 'ok', 'd'); m = Mem.get('人'); out.push([m.b, m.due - d]);      /* again today: no second move */
      m.b = 5; m.due = d - 3; Mem.answer('人', 'wrong', 'e'); m = Mem.get('人'); out.push([m.b, m.due - d]);
      m.b = 2; Mem.answer('人', 'help', 'f'); m = Mem.get('人'); out.push([m.b, m.due - d]);
      return out;
    }""")
    log.check(r == [[1, 1], [1, 1], [2, 3], [2, 0], [3, 1], [1, 1]], 'V-02 memory: new -> box 1 (+1 day); due -> up one (+3); not due / twice a day -> no move; wrong or helped -> two down, tomorrow %s' % r)
    # V-03
    r = page.evaluate("""() => {
      Store.reset(); const d = DAY(), G = { practice: false, key: false }, out = [];
      out.push(Review.plan(G).pos.length);
      ['人', '口'].forEach(k => { const m = Mem.touch(k); m.b = 2; m.due = d; }); out.push(Review.plan(G).pos.length);
      ['目', '手', '日', '月'].forEach(k => { const m = Mem.touch(k); m.b = 2; m.due = d; }); out.push(Review.plan(G).pos.length);
      Object.keys(ITEM).filter(k => ITEM[k].isl && ITEM[k].kind === 'zh').slice(0, 16).forEach(k => { const m = Mem.touch(k); m.b = 2; m.due = d - 2; }); out.push(Review.plan(G).pos.length);
      return out;
    }""")
    log.check(r == [0, 1, 2, 3], 'V-03 review slots by what is due: 0, 1, 2, and 3 while braking %s' % r)
    page.evaluate("() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
    page.evaluate("() => { const d = DAY(); ['人', '口', '目'].forEach(k => { const m = Mem.touch(k); m.b = 3; m.due = d; }); Store.save(); }")
    kinds = play(page, 'huluwa', 'huluwa:quiz', 3, seed=11)
    rv = [a for k, a in kinds if k == 'review']
    log.check(len(set(rv)) >= 1 and set(rv) <= {'人', '口', '目'}, 'V-03 a challenge session asks due items as review cards, never one not due %s' % sorted(set(rv)))
    # V-04
    r = page.evaluate("""() => {
      const W = ISL.paw, ws = Store.w('paw'); delete ws.pok; W.games.forEach(g => { ws.gstars[g] = 5; });
      const a = Prog.islandDone('paw');
      W.chars.forEach(c => { Mem.answer(c.c, 'ok', 's1'); }); const b = Prog.islandDone('paw');
      W.chars.forEach(c => { Mem.answer(c.c, 'ok', 's2'); }); const c2 = Prog.islandDone('paw');
      return [a, b, c2];
    }""")
    log.check(r == [False, False, True], 'V-04 four ✓ alone is no flag; every character right in two sessions is %s' % r)
    # V-05 missed queue: a wrong answer in 认字 -> the same item as a review card two questions later
    page.evaluate("() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
    first = {'done': False, 'k': None}
    def strat(cur):
        if not first['done'] and cur['kind'] == 'find':
            first['done'] = True; first['k'] = cur['answer']; return 'wrong'
        return 'right'
    kinds = play(page, 'bluey', 'bluey:find', 2, seed=4, strat=strat)
    log.check(first['k'] is not None and ('review', first['k']) in kinds, 'V-05 a wrong item comes back later as a review card (%s) %s' % (first['k'], kinds[:14]))
    # V-06 stars
    page.evaluate("() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
    page.evaluate("window.__go('peppa', 'peppa:find', 2, {seed: 3})"); wait_phase(page, timeout=30000)
    page.evaluate("() => { const st = Session.st; Hints.mark(st, 'hint2'); }")
    step(page, 'right'); page.wait_for_timeout(400)
    s1 = page.evaluate("Store.w('peppa').gstars['peppa:find'] || 0")
    page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    page.evaluate("window.__go('s1', 's1:quiz', 2, {seed: 3})"); wait_phase(page, timeout=30000)
    page.evaluate("() => { const st = Session.st; const id = Object.keys(st.map).find(x => /^ch\\d+$/.test(x)); window.__gesture('tap', { id }); }")
    page.wait_for_timeout(100); step(page, 'right'); page.wait_for_timeout(400)
    s2 = page.evaluate("Store.w('s1').gstars['s1:quiz'] || 0")
    page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    s0 = page.evaluate("Object.values(Store.s.worlds).reduce((a, w) => a + Object.values(w.gstars).reduce((x, y) => x + y, 0), 0)")
    page.evaluate("() => { const d = DAY(); ['人', '口'].forEach(k => { const m = Mem.touch(k); m.b = 2; m.due = d; }); Store.s.key.day = -1; Store.save(); }")
    page.evaluate("Keys.start()"); wait_phase(page, timeout=30000)
    for _ in range(200):
        if page.evaluate("!Session.G"): break
        cur = q(page)
        if cur and cur['phase'] in ('ready', 'input', 'act'): step(page, 'right')
        page.wait_for_timeout(40)
    page.wait_for_function("!Session.G", timeout=20000)
    s3 = page.evaluate("Object.values(Store.s.worlds).reduce((a, w) => a + Object.values(w.gstars).reduce((x, y) => x + y, 0), 0)")
    s3 -= s0
    log.check(s1 == 0 and s2 == 0 and s3 == 0, 'V-06 no star after the 2nd hint (%d), after a tapped character in 读一读 (%d), in the key round (%d)' % (s1, s2, s3))
    # V-08 the key: once a day, fixed card order, nothing due -> at once, a flag turns a card
    r = page.evaluate("""() => {
      const out = { avail: Keys.avail(), n: Store.s.album.n };
      Store.s.key.day = -1; Store.s.mem = {}; Store.save(); Keys.start(); out.free = Store.s.album.n; out.avail2 = Keys.avail();
      Keys.turn('flag'); out.flag = Store.s.album.n;
      out.order = CARDS.slice(0, 3); out.len = CARDS.length; out.uniq = new Set(CARDS).size;
      document.querySelectorAll('body > div').forEach(d => { if (d.style.zIndex === '70') d.remove(); });
      return out;
    }""")
    log.check(not r['avail'] and r['n'] == 1 and r['free'] == 2 and not r['avail2'] and r['flag'] == 3 and r['len'] == 36 and r['uniq'] == 36,
              'V-08 the key: once a day (card 1 after the key round), nothing due -> at once (2), a flag turns one (3); 36 cards in one order %s' % r)
    # V-07 the sentence islands
    r = page.evaluate("""() => {
      const out = { fill: [], read: [], bad: [] };
      for (const id of ['s1', 's2']) {
        const G = { world: id, W: ISL[id], rng: RNG(9), bags: {}, needPass: [] };
        for (let i = 0; i < 200; i++) { const qq = QFill.gen(G, { level: 3, rng: G.rng }); if (!FW_SENTS[qq.answer].some(s => s[0] === qq.text) || qq.text[qq.blank] !== qq.answer || qq.opts.filter(o => o === qq.answer).length !== 1) out.bad.push(qq.text); }
        const known = poolOf(G, 'zh', true);
        for (let i = 0; i < 200; i++) { G.knownZh = known; const r = QReadS.gen(G, { level: 2, rng: G.rng }); if (!Array.from(r.text).every(c => /[。！？，]/.test(c) || known.includes(c))) out.bad.push(id + ':' + r.text); out.read.push(r.text); }
      }
      out.read = Array.from(new Set(out.read));
      return out;
    }""")
    log.check(not r['bad'] and len(r['read']) >= 5, 'V-07 补句子: its sentence, the word missing, once among the options; 读一读: only taught characters (%d sentences) %s' % (len(r['read']), r['bad'][:4]))
    page.evaluate("() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); const d = DAY(); const m = Mem.touch('Q'); m.b = 3; m.due = d - 4; Store.save(); }")
    kinds = play(page, 's1', 's1:abc', 2, seed=3, n=4, finish=False)
    log.check(kinds and kinds[0][1] == 'Q', 'V-07 the sentence island\'s abc game brings back the most due capital first (%s)' % kinds[:2])
    # V-09 the writing fallback
    r = page.evaluate("""() => {
      Store.reset(); const ws = Store.w('huluwa'); const G = { practice: false, game: GAMES['huluwa:write'], ws, level: 3, W: ISL.huluwa };
      WriteFallback.start(G); const out = [G.level];
      const st = { review: false, wf: false };
      for (let i = 0; i < 3; i++) WriteFallback.after(G, st, 'wrong'); out.push(G.level, ws.wf.m);
      for (let i = 0; i < 3; i++) WriteFallback.after(G, st, 'wrong'); out.push(G.wfMode, ws.wf.m);
      const G2 = { practice: false, game: GAMES['paw:write'], ws: Store.w('paw'), level: 3, W: ISL.paw }; WriteFallback.start(G2); out.push(G2.level, G2.wfMode);
      Store.s.settings.wgate = true; const G3 = { practice: false, game: GAMES['paw:write'], ws: Store.w('paw'), level: 3, W: ISL.paw }; WriteFallback.start(G3); out.push(G3.wfMode); Store.s.settings.wgate = false;
      return out;
    }""")
    log.check(r == [3, 1, 1, 2, 2, 3, 0, 2], 'V-09 writing: 3 misses -> tracing (L1), 3 more -> reading cards; the next island writes for real; the parent switch -> reading cards %s' % r)
    kinds = play(page, 'huluwa', 'huluwa:write', 3, seed=3, n=12, finish=False)
    log.check(kinds and all(k in ('review', 'write') for k, a in kinds) and any(k == 'review' for k, a in kinds) and all(a in '山水火石' for k, a in kinds), 'V-09 in that mode the writing game asks its own characters as reading cards (tracing practice between them) %s' % kinds[:6])
    # V-10 books
    r = page.evaluate("""() => {
      Store.reset(); const a = Books.open().length; ISL.s1.games.forEach(g => { Store.w('s1').gstars[g] = 5; }); Store.w('s1').pok = true; const b = Books.open().map(x => x.id);
      const bad = [];
      BOOKS.forEach(bk => { const idx = ALL_ISL().indexOf(bk.after), taught = ALL_ISL().slice(0, idx + 1).flatMap(id => ISL[id].chars.map(c => c.c));
        bk.pages.forEach(([t]) => { const cs = Array.from(t).filter(c => !/[。！？，]/.test(c)); if (cs.length > 8 || !cs.every(c => taught.includes(c))) bad.push(bk.id + ':' + t); }); });
      return { a, b, bad };
    }""")
    log.check(r['a'] == 0 and r['b'] == ['b1'] and not r['bad'], 'V-10 story books open after their sentence island; every page <= 8 taught characters %s' % r)
    # V-11 the parent
    r = page.evaluate("""() => {
      Store.reset(); const d = DAY(); const m = Mem.touch('山'); m.b = 5; m.due = d + 20;
      Mem.parentNo('山'); const after = [Mem.get('山').b, Mem.get('山').due - d];
      const t = Report.text(); const ex = Report.export(); const before = JSON.stringify(Store.s); Store.reset(); Report.import(ex);
      return { after, has: ['认识', '学习中', '保持率', '老忘的', '时长'].every(w => t.includes(w)), same: JSON.stringify(Store.s) === before };
    }""")
    log.check(r['after'] == [1, 1] and r['has'] and r['same'], 'V-11 the parent check lowers to box 1 (tomorrow); the report names the numbers; export -> import is the same save %s' % r)
    # V-12 the third sea
    page.evaluate("() => { Store.reset(); Store.save(); }")
    r = page.evaluate("""() => {
      const out = [Prog.worldOpen('w3')];
      ORDER.w1.concat(ORDER.w2).forEach(id => { const ws = Store.w(id); ws.unlocked = true; ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); ws.pok = true; });
      Prog.check(false); out.push(Prog.worldOpen('w3'), Store.w('xiyou2').unlocked, Store.s.fin.w2);
      ORDER.w3.forEach(id => { const ws = Store.w(id); ws.unlocked = true; ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); ws.pok = true; });
      Prog.check(false); out.push(Store.s.fin.w3, Supply.low());
      return out;
    }""")
    log.check(r == [False, True, True, 'due', 'due', True], 'V-12 the third sea opens after the second (its first island too); all seven islands of it flagged -> its festival is due; the red dot %s' % r)
    page.evaluate("() => { Store.s.fin.w2 = 'seen'; Store.s.fin.w1 = 'seen'; Store.s.gate2 = true; Store.s.flags = ALL_ISL().filter(flagged); Store.save(); MapView.useSet('w2'); MapView.update(); MapView.after(10); }")
    page.wait_for_function("Store.s.gate3 && MapView.isl.gate.d.classList.contains('sky')", timeout=30000)
    log.check(True, 'V-12 after the second finale the gate turns gold')
    page.wait_for_timeout(800); page.evaluate("MapView.tapIsland('gate')")
    page.wait_for_function("MapView.set === 'w3' && !MapView.sailing", timeout=20000)
    r = page.evaluate("() => ({ soon: Object.keys(MapView.isl).filter(k => /^soon/.test(k)).length, fest: !!MapView.isl.fest, dot: document.querySelector('#gear').classList.contains('dot') })")
    log.check(r == {'soon': 0, 'fest': True, 'dot': True}, 'V-12 through the gate: the rainbow sea, complete (no islands to come, its own festival island), the red dot %s' % r)
    miss = page.evaluate("Array.from(window.__vmiss || [])")
    log.check(not miss, 'every sentence said has a recording %s' % miss[:10])
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
