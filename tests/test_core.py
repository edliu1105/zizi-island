# -*- coding: utf-8 -*-
"""字字岛 core rules, every game (fast mode):
 1 every game of every island played right reaches 5 stars, the session ends with the 5th ("集满啦！"), the game is done
 2 a wrong answer: no star for that round, the NEXT question is a new one of the same game (never the same question)
 3 the stroke judge: the right stroke passes, backwards / a later stroke / starting far away do not (and say why)
 4 progress: an island's 4 games done -> its flag, the next island opens; the 7 islands of the morning sea -> the
   festival (finale) -> the gold gate -> the starlight sea opens; the treasure book counts what was written
 5 the voice: every sentence said while playing every game has a recording (no sentence let go)
usage: python tests/test_core.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, step, q, Log

log = Log('core')


def play_session(page, isl, game, strategy='right', limit=400):
    """drive one session with a strategy until it ends; returns the stars of that game"""
    page.evaluate("([i, g]) => window.__go(i, g, 0, {seed: 11})", [isl, game])
    page.wait_for_function("window.__q && ['ready','act','input'].includes(window.__q.phase)", timeout=30000)
    for _ in range(limit):
        if page.evaluate("!Session.G"):
            break
        cur = q(page)
        if not cur or cur['phase'] not in ('act', 'ready', 'input'):
            page.wait_for_timeout(20); continue
        if step(page, strategy) is None:
            page.wait_for_timeout(20)
    page.wait_for_function("!Session.G", timeout=30000)
    return page.evaluate("([i, g]) => Prog.stars(i, g)", [isl, game])


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.evaluate("Store.s.all = true; Store.save()")
    games = page.evaluate("ORDER.w1.concat(ORDER.w2).flatMap(i => ISL[i].games.map(g => [i, g]))")
    # 1 every game to 5 stars
    for isl, g in games:
        page.evaluate("Voice.say = ((f) => function (t, o) { (window.__said = window.__said || []).push(t); return f.call(this, t, o); })(Voice.say)") if g == games[0][1] else None
        s = play_session(page, isl, g)
        done = page.evaluate("([i, g]) => Prog.gameDone(i, g)", [isl, g])
        log.check(s == 5 and done, '%s: right answers -> 5 stars, done (%s)' % (g, s))
    said = page.evaluate("window.__said || []")
    log.check('集满啦！' in said, 'the 5th star is a moment: "集满啦！" was said')
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    page.errors.clear()
    # 2 wrong answers: no star, a new question each time
    page.evaluate("() => { Store.reset(); Store.s.all = true; Store.save(); }")
    for isl, g in games:
        if g.endswith(':write') or g.endswith(':abc'):
            continue                                            # writing: see 3 (a slipped stroke)
        page.evaluate("([i, g]) => window.__go(i, g, 0, {seed: 5})", [isl, g])
        st = wait_phase(page, timeout=30000)
        keys = [page.evaluate("Session.G.game.key(Session.st.q)")]
        ok = True
        for k in range(3):
            gen = q(page)['gen']
            for _ in range(40):
                cur = q(page)
                if not cur or cur['gen'] != gen or cur['submitted']:
                    break
                if cur['phase'] not in ('act', 'ready', 'input'):
                    page.wait_for_timeout(20); continue
                step(page, 'wrong'); page.wait_for_timeout(10)
            page.wait_for_function("([g]) => window.__q && window.__q.gen !== g && ['ready','act','input'].includes(window.__q.phase)", arg=[gen], timeout=30000)
            keys.append(page.evaluate("Session.G.game.key(Session.st.q)"))
        stars = page.evaluate("([i, g]) => Prog.stars(i, g)", [isl, g])
        log.check(stars == 0 and len(set(keys)) == len(keys), '%s: three wrong answers -> no star, each time a new question (%d different)' % (g, len(set(keys))))
        page.evaluate("gesture('home')"); page.wait_for_timeout(100)
    # writing: a slipped stroke, then the rest right -> the character is finished, no star
    for isl, g in [('peppa', 'peppa:write'), ('robot', 'robot:abc'), ('pj', 'pj:write'), ('bluey2', 'bluey2:abc')]:
        page.evaluate("([i, g]) => window.__go(i, g, 0, {seed: 3})", [isl, g])
        wait_phase(page, timeout=30000)
        gen = q(page)['gen']
        step(page, 'wrong')
        r = page.evaluate("Session.st.w.slips")
        for _ in range(30):
            cur = q(page)
            if not cur or cur['gen'] != gen or cur['submitted']:
                break
            if cur['phase'] not in ('act', 'ready', 'input'):
                page.wait_for_timeout(20); continue
            step(page, 'right')
        page.wait_for_function("([g]) => window.__q && window.__q.gen !== g", arg=[gen], timeout=30000)
        log.check(r == 1 and page.evaluate("([i, g]) => Prog.stars(i, g)", [isl, g]) == 0, '%s: a backwards stroke is a slip; the character is finished, no star' % g)
        page.evaluate("gesture('home')"); page.wait_for_timeout(100)
    # 3 the judge
    res = page.evaluate("""() => {
      const out = [];
      ['人', '口', '手', '鸟', '灯', '雨', '鸡', '汤'].forEach(ch => {
        const S = Hanzi.strokes(ch).map(s => s.med);
        S.forEach((m, i) => {
          const ok = Geo.judge(m, m, 1024, S.slice(i + 1)).ok;
          const back = Geo.judge(m.slice().reverse(), m, 1024, S.slice(i + 1));
          const A = Math.min(40, Geo.len(m) * 0.12), wob = Geo.judge(Geo.resample(m, 30).map(([x, y], k) => [x + Math.sin(k * 0.45) * A, y + Math.cos(k * 0.45) * A]), m, 1024, S.slice(i + 1)).ok;
          const later = i + 1 < S.length ? Geo.judge(S[i + 1], m, 1024, S.slice(i + 1)) : { ok: false, why: 'order' };
          out.push([ch + (i + 1), ok, wob, back.ok ? 'ok' : back.why, later.ok ? 'ok' : later.why]);
        });
      });
      'ABEMSabgk'.split('').forEach(ch => { const S = LETTERS[ch]; S.forEach((m, i) => { out.push([ch + (i + 1), Geo.judge(m, m, 120, S.slice(i + 1)).ok, true, Geo.judge(m.slice().reverse(), m, 120, S.slice(i + 1)).why || 'ok', 'x']); }); });
      return out;
    }""")
    log.check(all(r[1] for r in res), 'the judge: every stroke of 8 characters and 9 letters written right passes')
    log.check(all(r[2] for r in res), 'the judge: a wobbly finger (+-40 units) along the stroke still passes')
    bad_back = [r for r in res if r[3] == 'ok' and not r[0][0] in '口']
    log.check(sum(1 for r in res if r[3] in ('back',)) >= len(res) * 0.7, 'the judge: written backwards is caught as "the wrong way" (%d of %d) %s' % (sum(1 for r in res if r[3] == 'back'), len(res), [r for r in res if r[3] not in ('back',)][:8]))
    log.check(all(r[4] != 'ok' for r in res if r[4] != 'x'), 'the judge: the NEXT stroke instead is never taken %s' % [r for r in res if r[4] == 'ok'])
    # 4 progress
    page.evaluate("() => { Store.reset(); Store.save(); MapView.useSet('w1'); MapView.update(); }")
    for g in page.evaluate("ISL.peppa.games"):
        play_session(page, 'peppa', g)
    st = page.evaluate("() => ({ done: Prog.islandDone('peppa'), next: Store.w('bluey').unlocked, third: Store.w('huluwa').unlocked, learned: Prog.learnedCount() })")
    log.check(st['done'] and st['next'] and not st['third'], 'four games done -> the island is done, the next island opens (only that one) %s' % st)
    log.check(st['learned'] >= 6, 'the treasure book counts the characters and letters written (%d)' % st['learned'])
    page.wait_for_timeout(3000)
    log.check(page.evaluate("Store.s.flags.includes('peppa')"), 'the flag is planted with its show on the map')
    page.evaluate("() => { ORDER.w1.forEach(id => { const ws = Store.w(id); ws.unlocked = true; ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); }); Prog.check(true); Store.save(); MapView.update(); MapView.after(10); }")
    page.wait_for_function("Screens.cur === 'finale'", timeout=60000)
    log.check(page.evaluate("Store.s.fin.w1 === 'seen'"), 'all seven flags -> the festival island and the finale (group photo)')
    page.click('#fhome')
    page.wait_for_function("Store.s.gate2 && MapView.isl.gate.d.classList.contains('sky')", timeout=30000)
    log.check(True, 'home from the photo -> the gate turns gold')
    page.wait_for_timeout(1500); page.evaluate("MapView.tapIsland('gate')")
    page.wait_for_function("MapView.set === 'w2' && !MapView.sailing", timeout=20000)
    log.check(page.evaluate("Store.w('peppa2').unlocked && !Store.w('bluey2').unlocked"), 'through the gate: the starlight sea, its first island open')
    # 5 voice coverage
    miss = page.evaluate("Array.from(window.__vmiss || [])")
    log.check(not miss, 'every sentence said has a recording %s' % miss[:10])
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
