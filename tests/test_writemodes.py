# -*- coding: utf-8 -*-
"""The writing modes (docs/WRITE-MODES.md, client 2026-10-18: "writing is always the same - use the characters he knows to
teach new ones"):
 01 the families: every pair of STROKE_FAMILIES (tools/content.py) whose characters are in the app is literally true on the
    stroke data (tools/write_pairs.py), and the app carries exactly those (WFAM in assets/js/wm.js)
 02 in the app: a grow pair's kept strokes have A's stroke names in A's order; a part's are A's then C's; every line said is in
    the voice bank and within 8 characters
 03 every mode with a real pointer (mouse moves through the app's input) at three sizes: the child writes exactly the strokes
    the mode leaves him, the brush writes the others, the character is finished clean, and every stroke of it is inked
 04 the order is the standard's: in every mode, a stroke written before its turn (a later one of his, or one the brush writes)
    is not taken - a slip, the same stroke still to write; then the character is finished
 05 rotation: the first time trace (with the aha when a known character grows into it), the tracing fallback trace, and a
    learned character goes through all its modes, never the same twice in a row; letters only trace / fill / relay / fade;
    a real session of five writes uses at least three modes
 06 everywhere: the treasure book's rewrite, teach mode, a review slot, the step-by-step explanation after a slip in a mode
 07 screenshots of every mode at every size (ready / writing), and the aha of 加一笔 and 部件拼字 at real speed, frame by
    frame: tests/logs/writemodes/
usage: python tests/test_writemodes.py"""
import os, sys, math, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'tools'))
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, Log
import write_pairs

log = Log('writemodes')
SHOTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs', 'writemodes')
os.makedirs(SHOTS, exist_ok=True)
FORCE = """([g, k]) => { const G = GAMES[g]; if (!G.__gen0) G.__gen0 = G.gen; G.gen = () => ({ k: [k, Math.random()], answer: k }); }"""
UNFORCE = """(g) => { const G = GAMES[g]; if (G.__gen0) { G.gen = G.__gen0; delete G.__gen0; } }"""
SIZES = (('L', 1180, 820), ('P', 820, 1180), ('S', 1024, 768))
# mode, character, game, the characters he knows (written before), how many strokes he writes
CASES = [('grow', '大', 'ultra:write', '人'), ('part', '明', 'ultra2:write', '日'), ('look', '目', 'peppa:write', '日'),
         ('fill', '田', 'paw:write', ''), ('relay', '鸟', 'xiyou:write', ''), ('fade', '木', 'bluey:write', ''),
         ('trace', '日', 'bluey:write', '口'), ('fill', 'E', 'bluey:abc', ''), ('relay', 'A', 'peppa:abc', ''), ('fade', 'T', 'xiyou:abc', ''),
         ('fill', '妈', 'widow3:write', ''), ('grow', '天', 'ultra4:write', '大')]          # 彩虹海's W3Write, 神笔海's W4X.Write

# 01 the families, checked on the stroke data
fam = write_pairs.families()
log.check(not fam['bad'], '01 every pair of STROKE_FAMILIES in the app is literally true on the stroke data (%d grow, %d part; pending %s) %s' % (len(fam['grow']), len(fam['part']), fam['pending'], fam['bad']))


def draw(page, pts, wob=0):
    dense = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        L = math.hypot(x1 - x0, y1 - y0); n = max(1, int(L / 6))
        nx, ny = (-(y1 - y0) / L, (x1 - x0) / L) if L else (0, 0)
        for m in range(n):
            t = m / n; w = wob * math.sin(len(dense) * 0.35)
            dense.append((x0 + (x1 - x0) * t + nx * w, y0 + (y1 - y0) * t + ny * w))
    dense.append(tuple(pts[-1]))
    page.mouse.move(*dense[0]); page.mouse.down()
    for x, y in dense[1:]:
        page.mouse.move(x, y)
    page.mouse.up()


TURN = """() => { const st = window.__tr; if (!st || st.submitted || Session.st !== st) return 'end'; const w = st.w;
  if (!w || w.done || w.paused || !w.armed || !['ready', 'input', 'act'].includes(st.phase)) return 'wait';
  return { k: w.k, pts: w.expected().map(([x, y]) => { const s = Stage.toScreen(x, y); return [s.x, s.y]; }) }; }"""
LATER = """() => { const st = window.__tr, w = st.w; if (!w || w.done || w.paused || !w.armed) return null;
  const j = w.strokes.findIndex((s, i) => i > w.k); if (j < 0) return null;
  return { k: w.k, j, given: w.given.has(j), pts: Geo.resample(w.strokes[j].med, 14).map(q => { const p = w.toStage(q), s = Stage.toScreen(p.x, p.y); return [s.x, s.y]; }) }; }"""


def write_out(page, wob=0, shot=None, limit=60):
    """the child writes whatever is his turn, until the question is over; the strokes he drew"""
    n = 0
    for _ in range(limit * 6):
        r = page.evaluate(TURN)
        if r == 'end':
            return n
        if r == 'wait':
            page.wait_for_timeout(90); continue
        draw(page, r['pts'], wob); n += 1
        if shot and n == 1:
            page.wait_for_timeout(250); page.screenshot(path=shot)
        page.wait_for_timeout(40)
        if n > limit:
            break
    return n


def start(page, mode, k, game, known, learned=True, level=3, opt=None):
    isl = game.split(':')[0]
    page.evaluate("""([k, known, learned]) => { localStorage.removeItem('zzi.wm');
        known.split('').forEach(c => { if (ITEM[c]) { Store.learn(c, 'w'); Store.s.met[c] = true; } });
        Store.s.met[k] = true; if (learned) Store.learn(k, 'w'); else delete Store.s.learned[k]; Store.save(); }""", [k, known, learned])
    page.evaluate("(m) => { window.__wmode = m; }", mode)
    page.evaluate(FORCE, [game, k])
    page.evaluate("([i, g, l, o]) => window.__go(i, g, l, Object.assign({ seed: 2 }, o || {}))", [isl, game, level, opt or {}])
    wait_phase(page, phases=('ready',), timeout=60000)
    page.evaluate("() => { window.__tr = Session.st; }")


def info(page):
    return page.evaluate("""() => { const st = window.__tr, w = st.w; return { mode: st.wm && st.wm.mode, slips: st.slips0 || 0, n: w.strokes.length,
        given: Array.from(w.given), ok2: st.ok2, inked: w.gDone.querySelectorAll('path').length, e: st.wm && st.wm.e ? st.wm.e.a + st.wm.e.b : '',
        miss: st.wm && st.wm.miss || null, pass: st.wm && st.wm.pass }; }""")


def home(page, game):
    page.evaluate("gesture('home')"); page.wait_for_timeout(250)
    page.evaluate(UNFORCE, game)
    page.evaluate("() => { window.__wmode = null; }")


def expect_child(i):
    n = len(i['given'])
    if i['mode'] == 'fade':
        return 3 * i['n']
    return i['n'] - n


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    # 02 the families in the app, and the lines
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.wait_for_function("WM.load().then(v => v)", timeout=15000)
    app = page.evaluate("""() => ({ fam: WFAM, names: STROKE_NAMES, bank: Bank.set ? null : 'nobank' })""")
    want = {'grow': [{k: x[k] for k in ('a', 'b', 'keep', 'add', 'say', 'diff')} for x in fam['grow']], 'part': [{k: x[k] for k in ('b', 'a', 'c', 'cut', 'say')} for x in fam['part']]}
    log.check(app['fam'] == want, '01 the app carries exactly the checked families (WFAM: %d grow, %d part) - rebuild if not' % (len(app['fam']['grow']), len(app['fam']['part'])))
    bad = []
    for e in app['fam']['grow']:
        nb, na = app['names'][e['b']].split(), app['names'][e['a']].split()
        if [nb[i] for i in e['keep']] != na or sorted(e['keep'] + e['add']) != list(range(len(nb))):
            bad.append(e['a'] + e['b'])
    for e in app['fam']['part']:
        nb, na, nc = app['names'][e['b']].split(), app['names'][e['a']].split(), app['names'][e['c']].split()
        if len(nb) != len(na) + len(nc) or any(x != y and (x, y) not in (('捺', '点'), ('横', '提')) for x, y in zip(na + nc, nb)):
            bad.append(e['b'])
    log.check(not bad, "02 a grow pair's kept strokes are A's, by name, in A's order; a part's are A's then C's %s" % bad)
    lines = sorted(write_pairs.lines() | {'你一笔，我一笔！', '少了一笔！', '少了两笔！', '描一描！', '照着写！', '自己写！'})
    page.wait_for_function("Bank.set && Bank.set.size > 100", timeout=15000)
    nob = page.evaluate("(L) => L.filter(t => !Bank.set.has(Bank.key(t)))", lines)
    log.check(not nob and all(len(t) <= 8 for t in lines), '02 every line of the modes (%d) is recorded in the voice bank and within 8 characters %s' % (len(lines), nob[:6]))
    page.context.close()

    # 03 / 07 every mode, real pointer, three sizes
    for ori, vw, vh in SIZES:
        page = new_page(br, base, vw, vh)
        enter(page)
        page.wait_for_function("!!Hanzi.data", timeout=15000)
        page.evaluate("() => { Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
        for mode, k, game, known in CASES:
            start(page, mode, k, game, known, learned=mode != 'trace')
            page.screenshot(path=os.path.join(SHOTS, '%s_%s_%s_ready.png' % (mode, k, ori)))
            i0 = info(page)
            n = write_out(page, wob=0 if ori != 'P' else 5, shot=os.path.join(SHOTS, '%s_%s_%s_writing.png' % (mode, k, ori)))
            page.wait_for_timeout(300)
            i = info(page)
            ok = i['mode'] == mode and i['slips'] == 0 and i['ok2'] is True and n == expect_child(i) and i['inked'] >= i['n']
            if mode == 'grow':
                ok = ok and i['e'] == known + k
            if mode == 'trace':
                ok = ok and page.evaluate("() => (window.__wmLog || []).some(x => x.gen === window.__tr.gen && x.e === 'aha')")
            log.check(ok, '03 %s %s %s (%s): he wrote %d strokes (the mode leaves him %d), the brush the others, finished clean %s' % (ori, mode, k, game, n, expect_child(i), i))
            home(page, game)
        log.check(not page.errors, '03 %s no page errors %s' % (ori, page.errors[:3]))
        page.context.close()

    # 04 the order: a stroke before its turn is not taken, in every mode
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate("() => { Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
    for mode, k, game, known in CASES:
        start(page, mode, k, game, known, learned=mode != 'trace')
        bad = None
        for _ in range(40):                          # his first turn
            r = page.evaluate(LATER)
            if r:
                break
            page.wait_for_timeout(90)
        if r:
            draw(page, r['pts'])
            page.wait_for_timeout(120)
            after = page.evaluate("() => { const w = window.__tr.w; return { k: w.k, slips: w.slips }; }")
            bad = after['k'] != r['k'] or after['slips'] != 1
            write_out(page)
            fin = page.evaluate("() => { const st = window.__tr; return { submitted: st.submitted, ok2: st.ok2 }; }")
            log.check(not bad and fin['submitted'] and fin['ok2'] is False, '04 %s %s: stroke %d written before stroke %d (%s) is not taken (a slip, still stroke %d), then the character is finished (no star) %s %s' % (
                mode, k, r['j'] + 1, r['k'] + 1, 'the brush\'s' if r['given'] else 'his', r['k'] + 1, after, fin))
        else:
            log.fail('04 %s %s: no turn of his with a later stroke' % (mode, k))
        home(page, game)
    log.check(not page.errors, '04 no page errors %s' % page.errors[:3])

    # 05 rotation
    r = page.evaluate("""() => {
      localStorage.removeItem('zzi.wm'); const out = {};
      const run = (k, n, wf) => { const G = { rng: RNG(5), wfMode: wf || 0, wmLast: null }, seq = [];
        for (let i = 0; i < n; i++) { const m = WM.pick({ G, q: { answer: k } }); WM.note(k, m.mode); G.wmLast = m.mode; seq.push(m.mode + (m.aha ? '+aha' : '')); } return seq; };
      ['人', '大', '日', '目', '明', '木', '田', 'E', 'b', '天'].forEach(c => { if (ITEM[c]) Store.learn(c, 'w'); });
      out.big = run('大', 9); out.opt = Object.keys(WM.options('大'));
      out.ming = run('明', 9); out.mopt = Object.keys(WM.options('明'));
      out.E = run('E', 6); out.b = run('b', 6);
      out.wf = run('日', 3, 1);
      delete Store.s.learned['目']; out.first = run('目', 1); Store.learn('目', 'w');
      delete Store.s.learned['手']; out.firstNo = run('手', 1);
      return out; }""")
    def cyc(seq, opt):
        s = [x.split('+')[0] for x in seq]
        return all(a != b for a, b in zip(s, s[1:])) and set(s[:len(opt)]) == set(opt)
    log.check(cyc(r['big'], r['opt']) and cyc(r['ming'], r['mopt']), '05 a learned character goes through every mode it has before one comes again, never the same twice in a row: 大 %s, 明 %s' % (r['big'], r['ming']))
    log.check(set(x for x in r['E'] + r['b']) <= {'trace', 'fill', 'relay', 'fade'} and len(set(r['E'])) >= 3, '05 letters only trace / fill / relay / fade: E %s, b %s' % (r['E'], r['b']))
    log.check(r['wf'] == ['trace'] * 3, '05 the tracing fallback always traces %s' % r['wf'])
    log.check(r['first'] == ['trace+aha'] and r['firstNo'] == ['trace'], '05 the first time: trace - with the aha when a known character grows into it (日 -> 目), without when none does (手) %s %s' % (r['first'], r['firstNo']))
    page.context.close()

    # 05 a real session: five writes of an island whose characters are all learned use at least three modes
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate("() => { Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); '人口目手日月云木'.split('').forEach(c => { Store.learn(c, 'w'); Store.s.met[c] = true; Mem.answer(c, 'ok', 'x1'); Mem.answer(c, 'ok', 'x2'); }); Store.save(); window.__wmLog = []; }")
    page.evaluate("() => window.__go('peppa', 'peppa:write', 3, { seed: 7 })")
    for q in range(8):
        try:
            wait_phase(page, phases=('ready',), timeout=30000)
        except Exception:
            break
        page.evaluate("() => { window.__tr = Session.st; }")
        write_out(page)
        page.wait_for_timeout(200)
    seq = page.evaluate("() => (window.__wmLog || []).map(x => x.mode)")
    log.check(len(seq) >= 4 and len(set(seq)) >= 3 and all(a != b for a, b in zip(seq, seq[1:])), '05 a session of the peppa island (all learned): %s - at least three modes, never the same twice in a row' % seq)
    home(page, 'peppa:write')

    # 06 everywhere: the treasure book, teach mode, a review slot, the step-by-step explanation
    page.evaluate("() => { window.__wmLog = []; window.__wmode = 'grow'; Practice.start(ITEM['大']); }")
    wait_phase(page, phases=('ready',), timeout=30000)
    page.evaluate("() => { window.__tr = Session.st; }")
    n = write_out(page)
    i = info(page)
    log.check(i['mode'] == 'grow' and n == 1 and page.evaluate("() => window.__tr.submitted"), "06 the treasure book's rewrite of 大 in 加一笔: he writes the 横, it is finished %s" % i)
    page.screenshot(path=os.path.join(SHOTS, 'book_grow_大.png'))
    home(page, 'ultra:write')
    page.evaluate("() => { Teach.on = { isl: 'ultra2', game: 'ultra2:write', drop: 1 }; }")
    start(page, 'part', '明', 'ultra2:write', '日', level=4)
    teach = page.evaluate("() => !!Session.G.teach")
    write_out(page)
    i = info(page)
    log.check(teach and i['mode'] == 'part' and i['slips'] == 0 and page.evaluate("() => window.__tr.submitted"), '06 teach mode (教一教): 明 in 部件拼字 is written and finished %s' % i)
    home(page, 'ultra2:write')
    page.evaluate("() => { Teach.on = null; }")
    # a review slot of a write game: the old friend comes in a mode too
    page.evaluate("""() => { window.__wmLog = []; window.__wmode = 'relay'; const rs = Review.slot; Review.slot = function (G) { if (G.round === 0) return { k: '鸟', form: 'write' }; return rs.call(this, G); }; window.__rs = rs; }""")
    page.evaluate("() => { Store.learn('鸟', 'w'); window.__go('peppa', 'peppa:write', 3, { seed: 3 }); }")
    wait_phase(page, phases=('ready',), timeout=30000)
    page.evaluate("() => { window.__tr = Session.st; }")
    rv = page.evaluate("() => ({ review: !!Session.st.review, k: Session.st.q.answer })")
    write_out(page)
    i = info(page)
    log.check(rv['review'] and rv['k'] == '鸟' and i['mode'] == 'relay' and i['slips'] == 0, '06 a review slot (老朋友 鸟) is written in a mode (接龙) %s %s' % (rv, i))
    page.evaluate("() => { Review.slot = window.__rs; }")
    home(page, 'peppa:write')
    # the step-by-step explanation after a slip in a mode: 下一步 until it ends, the next question comes
    page.evaluate("() => { Store.s.settings.ex = 'step'; Store.save(); }")
    start(page, 'grow', '大', 'ultra:write', '人')
    r = None
    for _ in range(40):
        r = page.evaluate(LATER)
        if r:
            break
        page.wait_for_timeout(90)
    draw(page, r['pts']); page.wait_for_timeout(150)
    write_out(page)
    gen = page.evaluate("() => window.__tr.gen")
    for _ in range(40):
        b = page.query_selector('[data-gid=stepnext]')
        if b and b.is_visible():
            b.click(force=True); page.wait_for_timeout(250)
        elif page.evaluate("(g) => !!Session.st && Session.st.gen !== g", gen):
            break
        else:
            page.wait_for_timeout(200)
    nxt = page.evaluate("(g) => !!Session.st && Session.st.gen !== g", gen)
    log.check(nxt, '06 one step at a time (一步一步) after a slip in 加一笔: ▶ 下一步 through the explanation, then the next question')
    page.evaluate("() => { Store.s.settings.ex = 'auto'; Store.save(); }")
    home(page, 'ultra:write')
    log.check(not page.errors, '06 no page errors %s' % page.errors[:3])
    page.context.close()

    # 07 the aha at real speed (not the tests' fast mode): 人 slides into 大, 日 into 明 - frame by frame on one sheet
    from PIL import Image
    import io as _io
    page = new_page(br, base, 1180, 820, fast=False)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate("() => { Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
    for mode, k, game, known in (('grow', '大', 'ultra:write', '人'), ('part', '明', 'ultra2:write', '日')):
        isl = game.split(':')[0]
        page.evaluate("""([k, known]) => { localStorage.removeItem('zzi.wm'); (known + k).split('').forEach(c => { Store.learn(c, 'w'); Store.s.met[c] = true; }); Store.save(); }""", [k, known])
        page.evaluate("(m) => { window.__wmode = m; }", mode)
        page.evaluate(FORCE, [game, k])
        page.evaluate("([i, g]) => window.__go(i, g, 3, { seed: 2 })", [isl, game])
        frames, seen = [], set()
        for _ in range(60):
            page.wait_for_timeout(260)
            st = page.evaluate("() => { const st = Session.st; if (!st || !st.w) return null; return { known: !!st.w.el.querySelector('[data-wm=known]'), lit: !!st.w.el.querySelector('[data-wm=new]'), phase: st.phase }; }")
            if not st:
                continue
            b = page.evaluate("() => { const r = Session.st.w.el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }")
            frames.append(page.screenshot(clip={'x': b[0] - 8, 'y': b[1] - 8, 'width': b[2] + 16, 'height': b[3] + 16}))
            seen |= {x for x in ('known', 'lit') if st[x]}
            if st['phase'] == 'ready':
                break
        ims = [Image.open(_io.BytesIO(f)).convert('RGB').resize((260, 260)) for f in frames[:24]]
        sh = Image.new('RGB', (260 * 8, 260 * ((len(ims) + 7) // 8)), 'white')
        for j, im in enumerate(ims):
            sh.paste(im, ((j % 8) * 260, (j // 8) * 260))
        sh.save(os.path.join(SHOTS, 'aha_%s_%s.png' % (mode, k)))
        log.check(seen == {'known', 'lit'}, '07 the aha of %s at real speed: %s as itself, sliding into %s, then the new strokes lit (%d frames: aha_%s_%s.png)' % (mode, known, k, len(frames), mode, k))
        home(page, game)
    log.check(not page.errors, '07 no page errors %s' % page.errors[:3])
    page.context.close()
    br.close()
sys.exit(0 if log.close() else 1)
