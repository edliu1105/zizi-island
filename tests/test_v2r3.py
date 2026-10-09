# -*- coding: utf-8 -*-
"""The v2 final review round (docs/REVIEW-V2R3.md, 9/10 APPROVE): the remaining items, fixed before delivery
 01 是 (read, never written) is learned once it passes: not grey, not locked, counted
 02 the writing fallback's 2nd step starts at once (the round ends when it is reached)
 03 the key round shortens itself after two quits in three days (no parent panel needed)
 04 at most two missed items carried over (rounds 1 and 3)
 05 the day's first "找回老朋友！" waits while a flag or a new island is still to be shown
 06 the key round asks the characters first, letters after
 07 "再玩一局插旗子！" comes before "停船还是继续？"; the check's "结束" is >= 88 px; the report has a version
usage: python tests/test_v2r3.py"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, q, Log

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
log = Log('v2r3')
OPEN = "() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }"

with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate(OPEN)
    # 01
    r = page.evaluate("() => { const a = learned('是'); const m = Mem.touch('是'); m.b = 1; m.pass = ['s1', 's2']; return [a, Mem.passed('是'), learned('是'), learned('我')]; }")
    log.check(r == [False, True, True, False], '01 是 is learned once it passes (it is never written); 我 still needs writing %s' % r)
    # 02
    src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()      # the built page holds every source (W3R1-10: no src/ needed)
    r = page.evaluate("""() => { const G = { practice: false, game: GAMES['bluey:write'], ws: Store.w('bluey'), level: 1 }; G.ws.wf = { s: 2, m: 1 }; WriteFallback.after(G, { review: false, wf: false, assists: [] }, 'wrong'); return [G.ws.wf.m, G.wfMode]; }""")
    log.check(r == [2, 2] and "if (res === 'wrong' && G.wfMode === 2 && !st.review) return 'ok';" in src, '02 the fallback reaches its 2nd step and the round ends there (the next round is a card) %s' % r)
    # 03 + 06
    page.evaluate(OPEN)
    r = page.evaluate("""() => { const d = DAY(); Store.s.days[d] = Object.assign(Mem.today(), { keyGo: 2, keyEnd: 0 }); ['A', 'B', '人', 'C', '口', '日', '月'].forEach((k, i) => { const m = Mem.touch(k); m.b = 2; m.due = d - 7 + i; }); Store.s.key.day = -1; Store.s.lastDay = d; Store.save();
      Keys.start(); return { short: Store.s.key.short }; }""")
    wait_phase(page, timeout=30000); r['items'] = page.evaluate("Session.G ? Session.G.keyItems.slice() : null")
    page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    log.check(r['short'] is True and r['items'] == ['人', '口', '日'], '03 two quits in three days: the key round shortens itself to 3; 06 the characters first %s' % r)
    # 04
    page.evaluate(OPEN)
    page.evaluate("() => { Store.s.missNext = ['日', '月', '云']; Store.save(); }")
    r = page.evaluate("Store.validate(JSON.parse(JSON.stringify(Store.s))).missNext")
    page.evaluate("window.__go('huluwa', 'huluwa:find', 2, { seed: 3 })"); wait_phase(page, timeout=30000)
    m = page.evaluate("Session.G.miss.map(x => [x.k, x.at])")
    page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    log.check(m == [['日', 1], ['月', 3]], '04 at most two missed items carried over, at rounds 1 and 3 %s' % m)
    # 05
    page.evaluate(OPEN)
    r = page.evaluate("""() => { Store.s.key.day = -1; const ws = Store.w('peppa'); ISL.peppa.games.forEach(g => { ws.gstars[g] = 5; }); ws.pok = true; Store.s.flags = []; Store.save();
      const pending = MapView.ids().some(o => flagged(o) && !Store.s.flags.includes(o)); window.__f = window.fast; window.fast = () => false; MapV2.hello(); window.fast = window.__f; return { pending, hello: Mem.today().hello || 0 }; }""")
    log.check(r == {'pending': True, 'hello': 0}, '05 a flag still to plant: no "找回老朋友！" yet (it comes next time) %s' % r)
    # 07
    src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()      # the built page holds every source (W3R1-10: no src/ needed)
    order = src.index("MapView.openPanel(wid, '再玩一局插旗子！')") < src.index("StopGo.maybe()) return;")
    page.evaluate(OPEN)
    rep = page.evaluate("Report.text().split('\\n')[0]")
    page.evaluate("() => { const m = Mem.touch('人'); m.b = 1; m.due = DAY() + 1; Store.save(); }")
    page.evaluate("() => ParentV2.check()")
    page.wait_for_timeout(300)
    btn = page.evaluate("""() => { const e = Array.from(document.querySelectorAll('button')).find(x => x.textContent === '结束'); if (!e) return 'no end'; const r = e.getBoundingClientRect(); return Math.round(Math.min(r.width, r.height)); }""")
    log.check(order and '版本 ）' not in rep and btn and btn != 'no end' and btn >= 88, '07 the panel line before the stop/go ritual; the report has a version (%s); the check\'s "结束" %s px' % (rep[-30:], btn))
    # the client's rule (2026-10-08): each question by itself - the wrong one earns nothing, the next one answered right earns its star
    from harness import answer_question, step
    out = {}
    for isl, g in (('bluey', 'bluey:find'), ('bluey', 'bluey:write'), ('s1', 's1:find')):
        page.evaluate(OPEN)
        page.evaluate("([i, g]) => window.__go(i, g, 2, { seed: 5, noDemo: true })", [isl, g])
        a = wait_phase(page, timeout=30000); s0 = page.evaluate("Session.G.stars")
        if a['kind'] == 'write': step(page, 'wrong'); page.wait_for_timeout(300); answer_question(page, 'right')      # one stroke wrong, then the character finished
        else: answer_question(page, 'wrong')
        b = wait_phase(page, gen=a['gen'], timeout=30000); s1 = page.evaluate("Session.G.stars")
        answer_question(page, 'right'); wait_phase(page, gen=b['gen'], timeout=30000); s2 = page.evaluate("Session.G.stars")
        out[g] = [s1 - s0, s2 - s1, b['kind']]
        page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    log.check(all(v[:2] == [0, 1] for v in out.values()), 'client rule: a wrong answer earns nothing, the next question answered right earns its star (认字, 写字, 补句子) %s' % out)
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
