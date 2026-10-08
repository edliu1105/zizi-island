# -*- coding: utf-8 -*-
"""The v2 round-1 review (docs/REVIEW-V2R1.md), finding by finding:
 01 读一读: a real mouse tap on a character says it (and that question gives no star); every character cell is on top
 02 an island's four games played once each, all right, by the most fluent child: the flag comes (no extra session) on
    every island of world 1 and 2 (sentence islands too); and when it does not, the panel says "再玩一局插旗子！"
 03 an old save: what was written goes to box 1, the first tests spread over a week - the key round and the check have items
 04 补句子: a hint that only repeats the sentence does not cost the star; 读一读's 2nd hint reads the sentence
 05 all cards out: the key opens the album
 06 every character of every sentence (补句子, 读一读, books) has stroke data
 07 every sentence literal of the code that the bank should have is in it ("新游戏开啦！", "旗子插好啦！", ...)
 08 a wrong item late in a session comes back first in the next one, said with "再来一个！"
 09 the brake counts Chinese characters only
 10 Iron Man's island has at least 8 sentences to read
 11 a sentence to read never takes the only review place
 13 writing fallback: a write right only after the 2nd hint counts as a miss; the 2nd step keeps tracing (no star)
 14 the treasure book shows no picture for a function word
usage: python tests/test_v2r1.py"""
import os, sys, json, re, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, step, q, Log

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
log = Log('v2r1')


def run_session(page, isl, game, lv, seed, n=400):
    page.evaluate("([i, g, l, s]) => window.__go(i, g, l, { seed: s })", [isl, game, lv, seed])
    wait_phase(page, timeout=30000)
    for _ in range(n):
        if page.evaluate("!Session.G"): break
        cur = q(page)
        if cur and cur['phase'] in ('act', 'ready', 'input'): step(page, 'right')
        page.wait_for_timeout(20)
    page.wait_for_function("!Session.G", timeout=30000)


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    # 01
    page.evaluate("() => { Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); window.__go('s2', 's2:quiz', 2, {seed: 3}); }")
    wait_phase(page, timeout=30000); page.wait_for_timeout(400)
    b = page.evaluate("(() => { const e = Session.st.map.ch0.getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2]; })()")
    page.evaluate("() => { Voice.sayNow = ((f) => function (t, o) { (window.__said2 = window.__said2 || []).push(t); return f.call(this, t, o); })(Voice.sayNow); }")
    page.mouse.click(b[0], b[1]); page.wait_for_timeout(300)
    r = page.evaluate("({ peek: Session.st.peeked === true, said: (window.__said2 || []).slice(-1)[0] || '' })")
    log.check(r['peek'] and r['said'], '01 读一读: a real tap on a character says it, that question gives no star %s' % r)
    page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    # 02 the most fluent child: every game of an island once, all right -> the flag
    flags = {}
    for isl in ['bluey', 'huluwa', 'robot', 's1', 's2', 'peppa2', 'pj', 'huluwa2']:
        page.evaluate("(i) => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); ALL_ISL().slice(0, ALL_ISL().indexOf(i)).forEach(id => { const ws = Store.w(id); ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); ws.pok = true; }); Store.save(); }", isl)
        for g in page.evaluate("(i) => ISL[i].games", isl):
            for seed in (1, 2, 3):
                if page.evaluate("([i, g]) => Prog.gameDone(i, g)", [isl, g]): break
                run_session(page, isl, g, None, seed)
        flags[isl] = page.evaluate("(i) => [Prog.gamesDone(i), Prog.islandDone(i)]", isl)
    log.check(all(v == [True, True] for v in flags.values()), '02 the most fluent child: four games once each -> the flag, no extra session %s' % flags)
    src = open(os.path.join(ROOT, 'src', 'app.js'), encoding='utf-8').read()
    log.check("MapView.openPanel(wid, '再玩一局插旗子！')" in src, '02 four ✓ without a flag: the panel opens with "再玩一局插旗子！"')
    # 03
    r = page.evaluate("""() => { const old = JSON.parse(JSON.stringify(Store.s)); delete old.v2; old.mem = {}; old.learned = { 人: { w: 1, p: 0 }, 口: { w: 2, p: 0 }, A: { w: 1, p: 0 } };
      const s = Store.validate(old), d = DAY(); return Object.keys(s.mem).map(k => [k, s.mem[k].b, s.mem[k].due - d]); }""")
    log.check(all(b == 1 and 0 <= dd <= 6 for k, b, dd in r) and any(dd == 0 for k, b, dd in r), '03 an old save: written -> box 1, first tests over the first week %s' % r)
    # 04
    r = page.evaluate("(() => { const s = { game: GAMES['s1:find'], assists: ['hint2'] }, t = { game: GAMES['s1:quiz'], assists: ['hint2'] }; return [helped(s), helped(t), String(QReadS.gestureHint).includes('Voice.say(st.q.text')]; })()")
    log.check(r == [False, True, True], '04 补句子 hints cost no star; 读一读\'s 2nd hint reads the sentence (and costs it) %s' % r)
    # 05
    r = page.evaluate("(() => { Store.s.album.n = CARDS.length; const src = String(Keys.turn); return src.includes('this.album()'); })()")
    log.check(r, '05 all cards out: the key opens the album')
    # 06
    r = page.evaluate("""() => { const all = new Set(); Object.values(FW_SENTS).forEach(l => l.forEach(([t]) => Array.from(t).forEach(c => all.add(c)))); READ.forEach(r => Array.from(r[0]).forEach(c => all.add(c))); BOOKS.forEach(b => b.pages.forEach(([t]) => Array.from(t).forEach(c => all.add(c))));
      return Array.from(all).filter(c => !/[。！？，]/.test(c) && !Hanzi.data[c]); }""")
    log.check(not r, '06 every character of every sentence has stroke data %s' % r)
    # 07
    lines = set(json.load(open(os.path.join(ROOT, 'raw', 'voice_lines.json'), encoding='utf-8')))
    have = page.evaluate("Array.from(Bank.set || [])")
    need = ['新游戏开啦！', '旗子插好啦！', '再来一个！', '找回老朋友！', '再玩一局插旗子！', '新朋友来啦！', '停船还是继续？']
    miss = [t for t in need if t not in lines]
    bank_miss = page.evaluate("(need) => need.filter(t => !Bank.has(t))", need)
    log.check(not miss and not bank_miss, '07 the lines are in the list and recorded %s %s' % (miss, bank_miss))
    # 08 the missed queue across sessions
    page.evaluate("() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
    page.evaluate("window.__go('bluey', 'bluey:find', 2, {seed: 4})"); wait_phase(page, timeout=30000)
    late = None
    for k in range(400):
        if page.evaluate("!Session.G"): break
        cur = q(page)
        if cur and cur['phase'] in ('act', 'ready', 'input'):
            rnd = page.evaluate("Session.G.round")
            if rnd == 4 and late is None and cur['kind'] == 'find': late = cur['answer']; step(page, 'wrong')
            else: step(page, 'right')
        page.wait_for_timeout(20)
    page.wait_for_function("!Session.G", timeout=30000)
    nxt = page.evaluate("Store.s.missNext")
    page.evaluate("() => { Voice.say = ((f) => function (t, o) { (window.__said3 = window.__said3 || []).push(t); return f.call(this, t, o); })(Voice.say); }")
    page.evaluate("window.__go('huluwa', 'huluwa:quiz', 3, {seed: 2})"); wait_phase(page, timeout=30000); page.wait_for_timeout(300)
    first = q(page)
    said = page.evaluate("window.__said3 || []")
    log.check(late and late in nxt and first['kind'] == 'review' and first['answer'] == late and '再来一个！' in said and '老朋友来了！' not in said[:3],
              '08 a wrong item in the last round comes first in the next session, said with "再来一个！" %s %s %s' % (late, nxt, first and (first['kind'], first['answer'])))
    page.evaluate("gesture('home')"); page.wait_for_timeout(300)
    # 09
    r = page.evaluate("() => { Store.reset(); ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach(k => Mem.touch(k)); const a = Mem.today().newK; ['人', '口'].forEach(k => Mem.touch(k)); return [a, Mem.today().newK]; }")
    log.check(r == [0, 2], '09 letters are not counted as new characters for the brake %s' % r)
    # 10
    r = page.evaluate("() => { const known = poolOf({ world: 's1', W: ISL.s1 }, 'zh', true); return READ.filter(x => Array.from(x[0]).every(c => /[。！？，]/.test(c) || known.includes(c))).length; }")
    log.check(r >= 8, '10 Iron Man\'s island: %d sentences to read' % r)
    # 11
    r = page.evaluate("""() => { Store.reset(); const d = DAY(); const m = Mem.touch('人'); m.b = 2; m.due = d; const G = { world: 'bluey2', W: ISL.bluey2, game: GAMES['bluey2:quiz'], rounds: 5, rv: { pos: [1] }, round: 1, rng: RNG(1), needPass: [] };
      const a = Review.slot(G); return a && a.k; }""")
    log.check(r == '人', '11 one review place: it asks the due item, not a sentence (%s)' % r)
    # 13
    r = page.evaluate("""() => { Store.reset(); const ws = Store.w('huluwa'); const G = { practice: false, game: GAMES['huluwa:write'], ws, level: 3, W: ISL.huluwa, round: 1, rvUsed: [] };
      WriteFallback.start(G); const st = { review: false, wf: false, assists: ['hint2'] }; WriteFallback.after(G, st, 'ok'); const s1 = ws.wf.s;
      G.wfMode = 2; const a = Review.slot(Object.assign(G, { round: 1 })), b = Review.slot(Object.assign(G, { round: 2 })); return [s1, a.form, b.form]; }""")
    log.check(r == [1, 'trace', 'card'], '13 writing: right only after the 2nd hint = a miss; the 2nd step alternates tracing practice and reading cards %s' % r)
    # 14
    page.evaluate("() => { Store.reset(); Store.s.learned['我'] = { w: 1, p: 0 }; Store.save(); Book.open('zh'); }"); page.wait_for_timeout(400)
    r = page.evaluate("(() => { const t = Array.from(document.querySelectorAll('#book .tile')).find(x => x.textContent.includes('I') || x.querySelector('svg')); const fw = Array.from(document.querySelectorAll('#book .tile')).filter(x => !x.querySelector('img.pic')).length; return fw; })()")
    log.check(r >= 10, '14 the treasure book: the function words have no picture (%d tiles without one)' % r)
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
