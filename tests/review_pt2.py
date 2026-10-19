# -*- coding: utf-8 -*-
"""Independent review PT2 (explain setting 关/自动/一步一步 + 教一教, round 2). Not part of the app.
usage: python tests/review_pt2.py <part> [args]
parts: panel | hold | rot | count | clock | write | sweep <W>x<H> <level> [a|b] | teach | key | offauto | misc"""
import os, sys, json, time, faulthandler
faulthandler.dump_traceback_later(560, exit=True)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, q, step, answer_question, wait_next_question, Log

PART = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs', 'pt2')
os.makedirs(OUT, exist_ok=True)
log = Log('pt2_' + PART + ('_' + '_'.join(sys.argv[2:]) if len(sys.argv) > 2 else ''))
OPEN = "() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); ISL[id].letters.forEach(l => { Store.s.met[l.l] = true; }); }); Store.save(); }"

# An INDEPENDENT audit of the two step buttons: their rects, whether a finger on them really lands on them, and what lies
# under them (the buttons and the #ff overlay hidden for a moment, 3 x 3 samples): options ([data-gid]), explanation marks,
# chrome, actors, the writing paper, the task card; plus rect overlaps with the same things.
AUDIT = r"""() => {
  const st = Session.st, G = Session.G; if (!st) return null;
  const b = document.querySelector('.stepbtn'), s = document.querySelector('.stepskip');
  const R = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom) }; };
  if (!b) return { nobtn: true, phase: st.phase, waiting: !!st.stepWaiting };
  const br = R(b), sr = s ? R(s) : null, vis = getComputedStyle(b).visibility;
  const hit = document.elementFromPoint(br.x + br.w / 2, br.y + br.h / 2); const top = !!hit && (hit === b || b.contains(hit));
  const hs = s ? document.elementFromPoint(sr.x + sr.w / 2, sr.y + sr.h / 2) : null; const stop = !!hs && (hs === s || s.contains(hs));
  const actors = Object.values(G.actors || {}).map(a => a.root).filter(Boolean);
  const cls = e => {
    for (let x = e; x && x !== document.body; x = x.parentElement) {
      if (x === b || x === s) return 'self';
      if (x.id === 'ff') return 'ff';
      if (x.id === 'home' || x.id === 'avatar' || x.id === 'tray' || x.id === 'teachb') return 'chrome:' + x.id;
      if (x.classList.contains('exring') || x.dataset.ex || x.classList.contains('objpop')) return 'ex';
      if (st.w && st.w.el && (x === st.w.el || st.w.el.contains(x))) return 'paper';
      if (st.taskEl && (x === st.taskEl || st.taskEl.contains(x))) return 'task';
      if (x.dataset.gid) return 'opt:' + x.dataset.gid;
      if (actors.includes(x)) return 'actor';
      if (x === Stage.el) return 'stage';
      if (x.id === 'gbg' || x.id === 'game') return 'bg';
    }
    return 'other:' + (e.tagName + '.' + (e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className || '')).slice(0, 40);
  };
  const ff = document.querySelector('#ff');
  const saved = [b.style.visibility, s && s.style.visibility, ff.style.visibility];
  b.style.visibility = 'hidden'; if (s) s.style.visibility = 'hidden'; ff.style.visibility = 'hidden';
  const under = r => { const o = {}; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const e = document.elementFromPoint(r.x + r.w * (0.2 + 0.3 * i), r.y + r.h * (0.2 + 0.3 * j)); const k = e ? cls(e) : 'none'; o[k] = (o[k] || 0) + 1; } return o; };
  const ub = under(br), us = sr ? under(sr) : {};
  b.style.visibility = saved[0]; if (s) s.style.visibility = saved[1] || ''; ff.style.visibility = saved[2] || '';
  /* rect overlaps */
  const obs = [].concat(Array.from(Stage.el.querySelectorAll('[data-gid]')).filter(e => !e.dataset.gid.startsWith('char:')).map(e => ['opt', R(e)]),
    Array.from(Stage.el.querySelectorAll('.exring,[data-ex],.objpop')).map(e => ['ex', R(e)]),
    actors.filter(a => a.isConnected).map(e => ['actor', R(e)]),
    st.w && st.w.el ? [['paper', R(st.w.el)]] : [], st.taskEl ? [['task', R(st.taskEl)]] : [],
    [['home', R(document.querySelector('#home'))], ['avatar', R(document.querySelector('#avatar'))], ['tray', R(document.querySelector('#tray'))]],
    document.querySelector('#teachb') ? [['teach', R(document.querySelector('#teachb'))]] : []);
  const inter = (A, B) => Math.max(0, Math.min(A.r, B.r) - Math.max(A.x, B.x)) * Math.max(0, Math.min(A.b, B.b) - Math.max(A.y, B.y));
  const ov = [];
  obs.forEach(([k, r]) => { if (r.w <= 0 || r.h <= 0) return; const a = inter(br, r), a2 = sr ? inter(sr, r) : 0; if (a > 0 || a2 > 0) ov.push([k, a, a2]); });
  const marks = Stage.el.querySelectorAll('.exring,[data-ex],.objpop').length;
  return { btn: br, skip: sr, vis, top, stop, ub, us, ov, marks, vw: innerWidth, vh: innerHeight, stepN: st.stepN, phase: st.phase, waiting: !!st.stepWaiting, teach: !!document.querySelector('#teachb') };
}"""
SAID = "(i) => window.__speechLog.slice(i).filter(e => e.ch === 'narr' && e.ev === 'speak').map(e => e.text + (e.tag ? '[' + e.tag + ']' : ''))"
HIDE = """() => { Object.defineProperty(document, 'hidden', { get: () => true, configurable: true }); Object.defineProperty(document, 'visibilityState', { get: () => 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }"""
SHOW = """() => { Object.defineProperty(document, 'hidden', { get: () => false, configurable: true }); Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }"""


def set_ex(page, mode):
    page.evaluate("(m) => { Store.s.settings.ex = m; Store.save(); }", mode)


def wrong_once(page, timeout=30000):
    cur = wait_phase(page, timeout=timeout)
    strat = 'wrong'
    if cur['kind'] == 'write':
        step(page, 'wrong'); strat = 'right'
    gen, snap = answer_question(page, strat, timeout=timeout)
    return gen, cur


def wait_step_or_next(page, gen, timeout=25000):
    page.wait_for_function("(g) => { const q = window.__q; return !q || q.gen !== g || q.stepWaiting; }", arg=gen, timeout=timeout, polling=20)
    cur = q(page)
    return cur if cur and cur['gen'] == gen else None


def judge(a, problems, strict_other=False):
    """the checks on one waiting beat"""
    b = a['btn']
    if a['vis'] == 'hidden': problems.append('button hidden while waiting')
    if min(b['w'], b['h']) < 88: problems.append('button %dx%d' % (b['w'], b['h']))
    if b['x'] < 0 or b['y'] < 0 or b['r'] > a['vw'] or b['b'] > a['vh']: problems.append('button off screen %s' % b)
    if a['skip'] and (a['skip']['x'] < 0 or a['skip']['y'] < 0 or a['skip']['r'] > a['vw'] or a['skip']['b'] > a['vh']): problems.append('skip off screen %s' % a['skip'])
    if not a['top']: problems.append('button under something')
    if a['skip'] and not a['stop']: problems.append('skip under something')
    bad_ov = [o for o in a['ov'] if o[0] in ('opt', 'ex', 'home', 'avatar', 'tray', 'teach', 'paper', 'task') and (o[1] > 100 or o[2] > 100)]
    if bad_ov: problems.append('overlap %s' % bad_ov)
    act_ov = [o for o in a['ov'] if o[0] == 'actor' and o[1] > 2500]
    if act_ov: problems.append('over an actor %s' % act_ov)
    bad_u = {k: v for k, v in list(a['ub'].items()) + [('skip:' + k, v) for k, v in a['us'].items()] if any(k.split('skip:')[-1].startswith(p) for p in ('opt', 'ex', 'chrome', 'paper', 'task'))}
    if bad_u: problems.append('under the button: %s' % bad_u)
    if strict_other:
        oth = {k: v for k, v in a['ub'].items() if k.startswith('other')}
        if oth: problems.append('other things under: %s' % oth)


def step_loop(page, gen, shot=None, max_steps=14, shots=2, check_idle=False, click=True):
    """taps 下一步 with the real mouse until the next question; returns beats + problems"""
    beats, problems = [], []
    mark = page.evaluate("window.__speechLog.length")
    marks0 = page.evaluate("Stage.el.querySelectorAll('.exring,[data-ex],.objpop').length")
    for i in range(max_steps):
        cur = wait_step_or_next(page, gen)
        if cur is None:
            break
        a = page.evaluate(AUDIT)
        said = page.evaluate(SAID, mark)
        mark = page.evaluate("window.__speechLog.length")
        if not a or a.get('nobtn'):
            problems.append('no button'); break
        new_marks = a['marks'] - marks0; marks0 = a['marks']
        beats.append({'said': said, 'btn': a['btn'], 'skip': a['skip'], 'ov': a['ov'], 'ub': a['ub'], 'us': a['us'], 'newmarks': new_marks, 'ex': cur.get('ex')})
        if not said and new_marks <= 0 and i > 0: problems.append('empty beat %d' % (i + 1))
        judge(a, problems)
        if shot and i < shots:
            page.screenshot(path=os.path.join(OUT, '%s_s%d.jpg' % (shot, i + 1)), type='jpeg', quality=50)
        if check_idle and i == 0:
            page.wait_for_timeout(2500)
            c2 = q(page)
            if not (c2 and c2['gen'] == gen and c2['stepWaiting']): problems.append('went on by itself')
            page.evaluate("gesture('skip')")
            page.evaluate("__gesture('tap', { id: 'card0' })")
            page.mouse.click(a['vw'] / 2, a['vh'] * 0.45)
            page.wait_for_timeout(300)
            c3 = q(page)
            if not (c3 and c3['gen'] == gen and c3['stepWaiting']): problems.append('a skip-tap moved it on')
        if not click: return beats, problems, []
        b = a['btn']
        page.mouse.click(b['x'] + b['w'] / 2, b['y'] + b['h'] / 2)
        page.wait_for_timeout(40)
    else:
        problems.append('more than %d beats' % max_steps)
    # jumps of the button between beats
    jumps = [round(((beats[i]['btn']['x'] - beats[i - 1]['btn']['x']) ** 2 + (beats[i]['btn']['y'] - beats[i - 1]['btn']['y']) ** 2) ** 0.5) for i in range(1, len(beats))]
    return beats, problems, jumps if len(beats) > 1 else []


def fresh(br, base, vw=1180, vh=820, fast=True, **kw):
    page = new_page(br, base, vw, vh, fast=fast, **kw)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate(OPEN)
    return page


def start_wrong(page, isl, g, lv, seed):
    page.evaluate("([i, g, l, s]) => window.__go(i, g, l, { seed: s })", [isl, g, lv, seed]); wait_phase(page, timeout=30000)
    gen, cur = wrong_once(page); c = wait_step_or_next(page, gen); return gen, c


def mid(r): return (r['x'] + r['w'] / 2, r['y'] + r['h'] / 2)


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()

    # ------------------------------------------------------------------ the parent panel at three sizes, by real gestures
    if PART == 'panel':
        for vw, vh, tag in ((1180, 820, 'L'), (820, 1180, 'P'), (1024, 768, 'L2')):
            page = fresh(br, base, vw, vh)
            g = page.evaluate("() => { const r = document.querySelector('#gear').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width, r.height]; }")
            page.mouse.click(g[0], g[1]); page.wait_for_timeout(200)
            toast = page.evaluate("document.querySelector('#toast').textContent")
            opened = page.evaluate("document.querySelector('#parent').classList.contains('on')")
            log.check(not opened and '按住' in toast, '%s short tap on the gear: no panel, toast "%s"' % (tag, toast))
            page.mouse.move(g[0], g[1]); page.mouse.down(); page.wait_for_timeout(900); page.mouse.up(); page.wait_for_timeout(100)
            log.check(not page.evaluate("document.querySelector('#parent').classList.contains('on')"), '%s a 0.9 s press does not open the panel' % tag)
            page.mouse.move(g[0], g[1]); page.mouse.down(); page.wait_for_timeout(1900); page.mouse.up()
            opened = page.evaluate("document.querySelector('#parent').classList.contains('on')")
            log.check(opened, '%s a long press opens the parent panel' % tag)
            page.screenshot(path=os.path.join(OUT, 'panel_%s.jpg' % tag), type='jpeg', quality=60)
            r = page.evaluate("""() => { const bs = Array.from(document.querySelectorAll('#parent [data-ex]')).map(b => { const r = b.getBoundingClientRect(); return [b.textContent, b.classList.contains('sel'), Math.round(r.width), Math.round(r.height)]; });
              const t = Array.from(document.querySelectorAll('#parent h3')).map(h => h.textContent); const mut = Array.from(document.querySelectorAll('#parent .mut')).map(d => d.textContent).filter(x => /讲解|教一教|先让孩子|跳过/.test(x)); return { bs, t, mut }; }""")
            log.w('   explain buttons ' + json.dumps(r['bs'], ensure_ascii=False) + ' headings ' + json.dumps(r['t'][:3], ensure_ascii=False))
            for m in r['mut']: log.w('   text: ' + m)
            log.check([b[0] for b in r['bs']] == ['关', '自动', '一步一步'] and [b[1] for b in r['bs']] == [False, True, False], '%s 关 / 自动 (default) / 一步一步' % tag)
            log.check(all(b[3] >= 44 for b in r['bs']), '%s panel buttons tall enough for a parent finger (%s)' % (tag, [b[2:] for b in r['bs']]))
            if tag == 'L':
                page.click('#parent [data-ex="step"]'); page.wait_for_timeout(100)
                page.reload(); page.wait_for_function('window.__ready === true', timeout=20000)
                log.check(page.evaluate("exMode()") == 'step', 'L 一步一步 saved and survives a reload')
                page.evaluate("Store.s.settings.ex = 'bogus'; Store.save()"); page.reload(); page.wait_for_function('window.__ready === true', timeout=20000)
                log.check(page.evaluate("exMode()") == 'auto', 'L a broken value falls back to 自动')
                page.evaluate("Store.s.teach = { isl: 'nope', game: 'x', drop: 7 }; Store.save()"); page.reload(); page.wait_for_function('window.__ready === true', timeout=20000)
                log.check(page.evaluate("Teach.on") is None and page.evaluate("Store.s.teach") is None, 'L a broken 教一教 preset in the save is dropped on load')
                page.evaluate("Store.s.teach = { isl: 'peppa', game: 'peppa:find', drop: 2 }; Store.save()"); page.reload(); page.wait_for_function('window.__ready === true', timeout=20000)
                log.check(page.evaluate("JSON.stringify(Teach.on)") == '{"isl":"peppa","game":"peppa:find","drop":2}', 'L a valid preset is kept on load')
                page.evaluate("Teach.on = null")
                enter(page)
                page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 3 })"); wait_phase(page, timeout=30000)
                gv = page.evaluate("() => { const g = document.querySelector('#gear'); const r = g.getBoundingClientRect(); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { inMap: !!g.closest('#map'), hitGear: !!h && (h === g || g.contains(h)), rect: [r.left, r.top, r.width] }; }")
                log.check(gv['inMap'] and not gv['hitGear'], 'L during a game the gear cannot be hit %s' % gv)
                log.check(not page.errors, 'L no page errors %s' % page.errors[:3])
            page.context.close()

    # ------------------------------------------------------------------ hold-to-skip: a tap does nothing, 1 s does; mouse and touch
    if PART == 'hold':
        page = fresh(br, base, 1180, 820)
        set_ex(page, 'step')
        gen, c = start_wrong(page, 'peppa', 'peppa:find', 2, 11)
        a = page.evaluate(AUDIT); sk = a['skip']
        log.w('   skip button %s, 下一步 %s' % (sk, a['btn']))
        log.check(sk and sk['w'] >= 88 and sk['h'] >= 44, 'the skip button is %dx%d (a parent target: >= 88 wide)' % (sk['w'], sk['h']))
        x, y = mid(sk)
        # a child's quick tap
        page.mouse.click(x, y); page.wait_for_timeout(400)
        c2 = q(page); log.check(c2 and c2['gen'] == gen and c2['stepWaiting'] and c2['stepN'] == 0, 'a quick tap on 跳过 does nothing %s' % str(c2 and (c2['stepN'], c2['stepWaiting'])))
        # three quick taps
        for i in range(3): page.mouse.click(x, y); page.wait_for_timeout(120)
        page.wait_for_timeout(300)
        c2 = q(page); log.check(c2 and c2['gen'] == gen and c2['stepWaiting'], 'three quick taps on 跳过 do nothing')
        # a 0.6 s press, released: nothing, and the bar resets
        page.mouse.move(x, y); page.mouse.down(); page.wait_for_timeout(600); page.mouse.up(); page.wait_for_timeout(500)
        c2 = q(page); bar = page.evaluate("() => { const i = document.querySelector('.stepskip i'); return i ? getComputedStyle(i).transform : null; }")
        log.check(c2 and c2['gen'] == gen and c2['stepWaiting'], 'a 0.6 s press released: still waiting; bar transform after release: %s' % bar)
        log.check(bar in ('matrix(0, 0, 0, 1, 0, 0)', 'none') or (bar or '').startswith('matrix(0,'), 'the fill bar goes back to empty after a short press (%s)' % bar)
        # press and slide off the button (a child drags): nothing
        page.mouse.move(x, y); page.mouse.down(); page.wait_for_timeout(300); page.mouse.move(x + 200, y + 100, steps=5); page.wait_for_timeout(900); page.mouse.up(); page.wait_for_timeout(300)
        c2 = q(page)
        log.w('   OBS press 跳过 then slide the finger away and keep holding 1.2 s: waiting=%s gen same=%s' % (c2 and c2['stepWaiting'], c2 and c2['gen'] == gen))
        if c2 and c2['gen'] != gen:
            gen, c = start_wrong(page, 'peppa', 'peppa:find', 2, 12); a = page.evaluate(AUDIT); sk = a['skip']; x, y = mid(sk)
        # a full 1.1 s press with the mouse: the next question
        page.mouse.move(x, y); page.mouse.down(); page.wait_for_timeout(1100); page.mouse.up()
        t0 = time.time()
        try:
            wait_next_question(page, gen, timeout=8000); dt = time.time() - t0
            said = page.evaluate("window.__speechLog.slice(-5).filter(e => e.ch === 'narr' && e.ev === 'speak').map(e => e.text)")
            log.check(True, 'a 1.1 s press on 跳过 (mouse): the next question in %.1f s, said %s' % (dt, said))
        except Exception as e:
            log.fail('a 1.1 s mouse press did not skip: ' + str(e)[:100])
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # touch (CDP): a tap, a 0.5 s touch, a 1.1 s touch
        cdp = page.context.new_cdp_session(page)
        cdp.send('Emulation.setTouchEmulationEnabled', {'enabled': True, 'maxTouchPoints': 2})
        gen, c = start_wrong(page, 'bluey', 'bluey:find', 2, 13)
        a = page.evaluate(AUDIT); sk = a['skip']; x, y = mid(sk)
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]}); page.wait_for_timeout(80)
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); page.wait_for_timeout(400)
        c2 = q(page); log.check(c2 and c2['gen'] == gen and c2['stepWaiting'], 'touch: a quick tap on 跳过 does nothing')
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]}); page.wait_for_timeout(500)
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); page.wait_for_timeout(700)
        c2 = q(page); log.check(c2 and c2['gen'] == gen and c2['stepWaiting'], 'touch: a 0.5 s touch released does nothing')
        # the child's finger on 下一步 while the parent holds 跳过 (two fingers): the parent's hold still counts?
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]}); page.wait_for_timeout(1150)
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        t0 = time.time()
        try:
            wait_next_question(page, gen, timeout=8000); log.check(True, 'touch: a 1.1 s touch on 跳过 skips (%.1f s)' % (time.time() - t0))
        except Exception as e:
            log.fail('touch: a 1.1 s touch did not skip ' + str(e)[:80])
        # the big button by touch
        gen, c = start_wrong(page, 'bluey', 'bluey:find', 2, 14)
        a = page.evaluate(AUDIT); bx, by = mid(a['btn'])
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': bx, 'y': by}]}); page.wait_for_timeout(60)
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); page.wait_for_timeout(300)
        c2 = q(page); log.check(c2 and (c2['gen'] != gen or c2['stepN'] == 1), 'touch: a tap on ▶ 下一步 moves on (stepN=%s)' % (c2 and c2['stepN']))
        # hold 跳过 while NOT waiting (the beat still animating, real speed): it still skips
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        page.evaluate("window.__fast = 0")
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 15 })"); wait_phase(page, timeout=60000)
        gen, cur = wrong_once(page, timeout=60000)
        page.wait_for_function("(g) => { const q = window.__q; return q && q.gen === g && q.phase === 'explain'; }", arg=gen, timeout=30000)
        page.wait_for_timeout(150)
        a = page.evaluate(AUDIT)
        if a and not a.get('nobtn') and a['skip']:
            x, y = mid(a['skip']); vis = a['vis']
            page.mouse.move(x, y); page.mouse.down(); page.wait_for_timeout(1100); page.mouse.up()
            t0 = time.time()
            try:
                wait_next_question(page, gen, timeout=10000); log.check(True, 'real speed: 跳过 held while the beat was still playing (▶ %s): next question in %.1f s' % (vis, time.time() - t0))
            except Exception as e:
                log.fail('real speed: 跳过 held during the animation did not skip ' + str(e)[:80])
        else:
            log.warn('real speed: no skip button seen right after explain began %s' % a)
        page.evaluate("window.__fast = 1"); page.evaluate("gesture('home')")
        log.check(not page.errors, 'hold: no page errors %s' % page.errors[:3])

    # ------------------------------------------------------------------ rotation while waiting / while a beat plays (PT1-P1)
    if PART == 'rot':
        page = fresh(br, base, 1180, 820)
        set_ex(page, 'step')
        cases = [('peppa', 'peppa:find', 2, 9), ('hulk3', 'hulk3:quiz', 2, 9), ('peppa', 'peppa:write', 2, 9), ('s1', 's1:quiz', 2, 9), ('huluwa', 'huluwa:quiz', 3, 9), ('thor3', 'thor3:quiz', 2, 9), ('xiyou', 'xiyou:quiz', 3, 9), ('peppa2', 'peppa2:quiz', 3, 9)]
        for isl, g, lv, seed in cases:
            for (w0, h0, w1, h1, tag) in ((1180, 820, 820, 1180, 'L->P'), (820, 1180, 1180, 820, 'P->L'), (1180, 820, 1024, 768, 'L->L2')):
                page.set_viewport_size({'width': w0, 'height': h0}); page.wait_for_timeout(300)
                try:
                    gen, c = start_wrong(page, isl, g, lv, seed)
                    a0 = page.evaluate(AUDIT)
                    page.set_viewport_size({'width': w1, 'height': h1}); page.wait_for_timeout(700)
                    a1 = page.evaluate(AUDIT)
                    probs = []
                    if not a1 or a1.get('nobtn'): probs.append('no button')
                    else: judge(a1, probs)
                    if g in ('peppa:find', 'peppa:write') : page.screenshot(path=os.path.join(OUT, 'rot_%s_%s.jpg' % (g.replace(':', '-'), tag.replace('->', ''))), type='jpeg', quality=50)
                    if a1 and not a1.get('nobtn'):
                        page.mouse.click(*mid(a1['btn'])); page.wait_for_timeout(300)
                    moved = page.evaluate("(g) => { const q = window.__q; return !q || q.gen !== g || q.stepN > 0; }", gen)
                    if not moved: probs.append('STUCK: a tap on the button after the turn does not move on')
                    # the rest of the beats in the new orientation
                    beats, p2, jumps = step_loop(page, gen)
                    wait_next_question(page, gen, timeout=30000)
                    log.check(not probs and not p2, '%s %s while waiting: button %s -> %s, then %d more beats %s %s' % (g, tag, a0 and a0['btn'], a1 and a1.get('btn'), len(beats), probs, p2))
                except Exception as e:
                    log.fail('%s %s ERR %s' % (g, tag, str(e)[:160]))
                page.evaluate("gesture('home')"); page.wait_for_timeout(150)
        # rotate DURING the beat (before the button shows), at real speed: the button must appear inside the new screen
        page.set_viewport_size({'width': 1180, 'height': 820}); page.wait_for_timeout(300)
        page.evaluate("window.__fast = 0")
        for isl, g, lv in (('peppa', 'peppa:find', 2), ('hulk3', 'hulk3:quiz', 2)):
            page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 21 })", [isl, g, lv]); wait_phase(page, timeout=60000)
            gen, cur = wrong_once(page, timeout=60000)
            page.set_viewport_size({'width': 820, 'height': 1180})        # turned while the feedback line still plays
            c = wait_step_or_next(page, gen, timeout=40000)
            a = page.evaluate(AUDIT); probs = []
            if not a or a.get('nobtn'): probs.append('no button')
            else: judge(a, probs)
            page.screenshot(path=os.path.join(OUT, 'rot_during_%s.jpg' % g.replace(':', '-')), type='jpeg', quality=50)
            log.check(not probs, '%s turned L->P during the feedback, before the first beat: the button appears inside the portrait screen %s %s' % (g, a and a.get('btn'), probs))
            # and turn back while a later beat is animating
            page.mouse.click(*mid(a['btn']))
            page.wait_for_timeout(200)
            page.set_viewport_size({'width': 1180, 'height': 820})
            c = wait_step_or_next(page, gen, timeout=40000)
            if c:
                a = page.evaluate(AUDIT); probs = []
                if not a or a.get('nobtn'): probs.append('no button')
                else: judge(a, probs)
                log.check(not probs, '%s turned P->L during the 2nd beat: button %s %s' % (g, a and a.get('btn'), probs))
                beats, p2, jumps = step_loop(page, gen)
            wait_next_question(page, gen, timeout=40000)
            page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        page.evaluate("window.__fast = 1")
        # rotate while the parent holds 跳过
        page.set_viewport_size({'width': 1180, 'height': 820}); page.wait_for_timeout(300)
        gen, c = start_wrong(page, 'bluey', 'bluey:find', 2, 22)
        a = page.evaluate(AUDIT); x, y = mid(a['skip'])
        page.mouse.move(x, y); page.mouse.down(); page.wait_for_timeout(300)
        page.set_viewport_size({'width': 820, 'height': 1180}); page.wait_for_timeout(900); page.mouse.up(); page.wait_for_timeout(300)
        c2 = q(page)
        log.w('   OBS 跳过 held, the iPad turned during the hold: next question=%s (waiting=%s)' % (c2 is None or c2['gen'] != gen, c2 and c2['stepWaiting']))
        if c2 and c2['gen'] == gen:
            a = page.evaluate(AUDIT); probs = []; judge(a, probs)
            log.check(not probs and a['top'], 'after that the buttons are usable in portrait %s %s' % (a['btn'], probs))
            beats, p2, jumps = step_loop(page, gen); wait_next_question(page, gen, timeout=30000)
        page.evaluate("gesture('home')")
        page.set_viewport_size({'width': 1180, 'height': 820})
        log.check(not page.errors, 'rot: no page errors %s' % page.errors[:3])

    # ------------------------------------------------------------------ the counting runs (PT1-P2) at real speed
    if PART == 'count':
        page = fresh(br, base, 1180, 820, fast=False)
        page.evaluate("window.__fast = 0")
        page.evaluate("() => { window.__cnt = []; const f = Sfx.count; Sfx.count = function (n) { window.__cnt.push([n, Math.round(performance.now())]); return f.apply(Sfx, arguments); }; }")
        for mode in ('step', 'auto'):
            set_ex(page, mode)
            for isl, g, lv in (('hulk3', 'hulk3:quiz', 2), ('thor3', 'thor3:quiz', 2), ('bluey', 'bluey:quiz', 2), ('hulk3', 'hulk3:quiz', 4)):
                try:
                    page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 5 })", [isl, g, lv]); wait_phase(page, timeout=60000)
                    page.evaluate("window.__cnt.length = 0")
                    t0 = time.time()
                    gen, cur = wrong_once(page, timeout=60000)
                    times, beats = [], []
                    mark = page.evaluate("window.__speechLog.length")
                    hops = None
                    if mode == 'step':
                        for i in range(12):
                            c = wait_step_or_next(page, gen, timeout=40000)
                            if c is None: break
                            times.append(round(time.time() - t0, 1))
                            beats.append(page.evaluate(SAID, mark)); mark = page.evaluate("window.__speechLog.length")
                            page.wait_for_timeout(1200)
                            a = page.evaluate(AUDIT)
                            if not (a and a['waiting']): beats.append('NOT WAITING'); break
                            page.mouse.click(*mid(a['btn']))
                    wait_next_question(page, gen, timeout=60000)
                    cnt = page.evaluate("window.__cnt")
                    gaps = [cnt[i + 1][1] - cnt[i][1] for i in range(len(cnt) - 1)]
                    log.w('   %s %s L%d: %d beats at %s s, said %s; count notes %s gaps %s' % (mode, g, lv, len(times), times, json.dumps(beats, ensure_ascii=False), [c[0] for c in cnt], gaps))
                    if mode == 'step':
                        log.check(len(times) >= 2 and 'NOT WAITING' not in beats, '%s step: every beat waits' % g)
                    if cnt and len(cnt) > 1:
                        log.check(min(gaps) >= 120 and max(gaps) <= 400, '%s %s: the counting notes come evenly, one run (gaps %s)' % (g, mode, gaps))
                except Exception as e:
                    log.fail('%s %s ERR %s' % (mode, g, str(e)[:200]))
                page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        log.check(not page.errors, 'count: no page errors %s' % page.errors[:3])

    # ------------------------------------------------------------------ the 3-minute rule (PT1-P3) at real speed
    if PART == 'clock':
        page = fresh(br, base, 1180, 820, fast=False)
        page.evaluate("window.__fast = 0")
        set_ex(page, 'step')
        # A: 200 s pass WHILE the parent is at a 下一步 wait -> the game still asks all 5 questions
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 17 })"); wait_phase(page, timeout=60000)
        gen, cur = wrong_once(page, timeout=60000)
        c = wait_step_or_next(page, gen, timeout=40000)
        page.evaluate("Clock.lost -= 200000")      # the parent talked for 200 s at this beat
        page.wait_for_timeout(1500)
        beats, probs, jumps = step_loop(page, gen)
        wait_next_question(page, gen, timeout=40000)
        exw = page.evaluate("Session.G.exWait")
        rounds = 1
        for i in range(6):
            cur = q(page)
            if not cur: break
            rounds += 1
            gen, snap = answer_question(page, 'right', timeout=60000)
            try: wait_next_question(page, gen, timeout=30000)
            except Exception: break
        try: page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=40000)
        except Exception: pass
        mapon = page.evaluate("document.querySelector('#map').classList.contains('on') && !window.__q")
        log.check(rounds >= 5 and mapon, 'A: 200 s spent at a 下一步 wait do not count: %d questions asked (exWait=%s ms), back on map=%s' % (rounds, exw, mapon))
        # B: the same 200 s pass while the child dawdles on a question (not a wait) -> the old rule still ends it after 3
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 18 })"); wait_phase(page, timeout=60000)
        page.evaluate("Clock.lost -= 200000")
        rounds = 0
        for i in range(6):
            cur = q(page)
            if not cur: break
            rounds += 1
            gen, snap = answer_question(page, 'right', timeout=60000)
            try: wait_next_question(page, gen, timeout=30000)
            except Exception: break
        try: page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=40000)
        except Exception: pass
        log.w('   OBS B: 200 s of ordinary dawdling (no explanation) still ends the game after %d questions (the old rule, unchanged)' % rounds)
        # C: in 自动 the explanation's own time (a few seconds) still counts - fine; just report exWait stays 0
        set_ex(page, 'auto')
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 19 })"); wait_phase(page, timeout=60000)
        gen, cur = wrong_once(page, timeout=60000); wait_next_question(page, gen, timeout=40000)
        log.w('   OBS C: 自动 exWait=%s' % page.evaluate("Session.G.exWait"))
        page.evaluate("gesture('home')")
        log.check(not page.errors, 'clock: no page errors %s' % page.errors[:3])

    # ------------------------------------------------------------------ writing in two meaningful beats (PT1-P4)
    if PART == 'write':
        page = fresh(br, base, 1180, 820)
        set_ex(page, 'step')
        res = []
        for isl, g, lv in (('peppa', 'peppa:write', 2), ('peppa', 'peppa:abc', 2), ('peppa2', 'peppa2:abc', 2), ('ultra2', 'ultra2:write', 3), ('hulk3', 'hulk3:write', 2)):
            page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 7 })", [isl, g, lv]); wait_phase(page, timeout=30000)
            gen, cur = wrong_once(page)
            dots = []
            beats, probs, jumps = [], [], []
            mark = page.evaluate("window.__speechLog.length")
            for i in range(8):
                c = wait_step_or_next(page, gen)
                if c is None: break
                a = page.evaluate(AUDIT)
                said = page.evaluate(SAID, mark); mark = page.evaluate("window.__speechLog.length")
                d = page.evaluate("""() => { const d = Stage.el.querySelector('[data-ex="stroke"]'); if (!d) return null; const r = d.getBoundingClientRect(); const p = Session.st.w.el.getBoundingClientRect(); return { w: Math.round(r.width), inPaper: r.left >= p.left - 30 && r.right <= p.right + 30 && r.top >= p.top - 30 && r.bottom <= p.bottom + 30 }; }""")
                dots.append(d)
                beats.append(said); judge(a, probs)
                if i < 3: page.screenshot(path=os.path.join(OUT, 'write_%s_s%d.jpg' % (g.replace(':', '-'), i + 1)), type='jpeg', quality=50)
                page.mouse.click(*mid(a['btn'])); page.wait_for_timeout(40)
            wait_next_question(page, gen, timeout=30000)
            res.append((g, beats, dots))
            log.w('   %s: %d beats, said %s, stroke dot per beat %s' % (g, len(beats), json.dumps(beats, ensure_ascii=False), dots))
            ok = len(beats) >= 2 and any('再看一看' in x for x in beats[0]) and any('看，是这样' in x for x in beats[1]) and dots[0] and dots[0]['inPaper'] and not dots[1]
            log.check(ok and not probs, '%s: beat 1 = the paper + the gold dot where the stroke starts + 再看一看, beat 2 = the brush writes it (dot gone) %s' % (g, probs))
            page.evaluate("gesture('home')"); page.wait_for_timeout(100)
        # two slipped strokes -> four beats?
        page.evaluate("window.__go('peppa', 'peppa:write', 3, { seed: 8 })"); wait_phase(page, timeout=30000)
        cur = q(page)
        step(page, 'wrong'); page.wait_for_timeout(100); step(page, 'wrong')
        gen, snap = answer_question(page, 'right', timeout=30000)
        beats, probs, jumps = step_loop(page, gen, shot='write2')
        wait_next_question(page, gen, timeout=30000)
        log.w('   two slipped strokes: %d beats %s' % (len(beats), json.dumps([b['said'] for b in beats], ensure_ascii=False)))
        log.check(not probs, 'two slipped strokes: beats fine %s' % probs)
        page.evaluate("gesture('home')")
        # real speed: the two beats really stop, their timing
        page.evaluate("window.__fast = 0")
        page.evaluate("window.__go('peppa', 'peppa:write', 2, { seed: 7 })"); wait_phase(page, timeout=60000)
        gen, cur = wrong_once(page, timeout=60000)
        t0 = time.time(); times = []; mark = page.evaluate("window.__speechLog.length"); said = []
        for i in range(6):
            c = wait_step_or_next(page, gen, timeout=40000)
            if c is None: break
            times.append(round(time.time() - t0, 1)); said.append(page.evaluate(SAID, mark)); mark = page.evaluate("window.__speechLog.length")
            page.wait_for_timeout(1500)
            a = page.evaluate(AUDIT)
            if not a['waiting']: said.append('NOT WAITING'); break
            page.mouse.click(*mid(a['btn']))
        wait_next_question(page, gen, timeout=40000)
        log.check(len(times) == 2 and 'NOT WAITING' not in said, 'real speed 写字: %d beats at %s s, said %s' % (len(times), times, json.dumps(said, ensure_ascii=False)))
        page.evaluate("window.__fast = 1"); page.evaluate("gesture('home')")
        log.check(not page.errors, 'write: no page errors %s' % page.errors[:3])

    # ------------------------------------------------------------------ every game wrong once in 一步一步 at a size and level
    if PART == 'sweep':
        vw, vh = [int(x) for x in sys.argv[2].split('x')]
        lv = int(sys.argv[3]) if len(sys.argv) > 3 else 2
        half = sys.argv[4] if len(sys.argv) > 4 else ''
        page = fresh(br, base, vw, vh)
        set_ex(page, 'step')
        games = page.evaluate("ALL_ISL().flatMap(i => ISL[i].games.map(g => [i, g, GAMES[g].kind0]))")
        if half == 'a': games = games[:42]
        if half == 'b': games = games[42:]
        if os.environ.get('PT2_GAMES'):
            games = [x for x in games if any(x[1].startswith(k) for k in os.environ['PT2_GAMES'].split(','))]
        res, bad, few, jumpy, others = {}, [], [], [], {}
        for isl, g, kind in games:
            tag = '%s_L%d_%dx%d' % (g.replace(':', '-'), lv, vw, vh)
            try:
                page.evaluate("([i, g]) => { Store.w(i).gstars[g] = 0; Store.save(); }", [isl, g])
                page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 31 + l })", [isl, g, lv])
                wait_phase(page, timeout=30000)
                s0 = page.evaluate("Session.G.stars")
                gen, cur = wrong_once(page)
                beats, problems, jumps = step_loop(page, gen, shot=tag if os.environ.get('PT2_SHOTS', '1') == '1' else None, check_idle=(g in ('peppa:find', 'huluwa:quiz', 's1:quiz', 'hulk3:en', 'thor3:quiz', 'peppa:write')))
                wait_next_question(page, gen, timeout=30000)
                page.wait_for_function("window.__q && ['ready','act','input'].includes(window.__q.phase)", timeout=30000)
                rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
                s1 = page.evaluate("Session.G.stars")
                if s1 != s0: problems.append('a star after a wrong answer')
                if not rec or not rec['ex'] or not rec['ex']['right']: problems.append('no gold ring in step mode')
                n = len(beats)
                oth = {}
                for b in beats:
                    for k, v in b['ub'].items():
                        if k.startswith('other'): oth[k] = oth.get(k, 0) + v
                if oth: others[g] = oth
                res[g] = {'kind': kind, 'beats': n, 'said': [b['said'] for b in beats], 'btn': [b['btn'] for b in beats], 'skip': beats[0]['skip'] if beats else None, 'ov': [b['ov'] for b in beats], 'ub': [b['ub'] for b in beats], 'us': [b['us'] for b in beats], 'jumps': jumps, 'ms': rec and rec['ms'], 'problems': problems}
                if problems: bad.append((g, lv, problems))
                if n < 2: few.append((g, n))
                if any(j > 60 for j in jumps): jumpy.append((g, jumps))
            except Exception as e:
                bad.append((g, lv, 'ERR ' + str(e)[:160]))
            page.evaluate("gesture('home')"); page.wait_for_timeout(60)
            left = page.evaluate("document.querySelectorAll('.stepbtn,.stepskip').length")
            if left: bad.append((g, lv, 'step buttons left behind after home'))
        with open(os.path.join(OUT, 'sweep_%dx%d_L%d%s.json' % (vw, vh, lv, half)), 'w', encoding='utf-8') as f:
            json.dump(res, f, ensure_ascii=False, indent=1)
        log.w('   beats per game: ' + json.dumps({k: v['beats'] for k, v in res.items()}, ensure_ascii=False))
        log.w('   button jumps > 60 px between beats: %d games %s' % (len(jumpy), json.dumps(jumpy)))
        log.w('   other things under the button (decor?): ' + json.dumps(others, ensure_ascii=False)[:1500])
        log.check(not bad, 'sweep %dx%d L%d: %d games wrong once in 一步一步: every beat waits for 下一步 (>= 88 px, on screen, on top, nothing important under it), no star, gold ring %s' % (vw, vh, lv, len(games), json.dumps(bad[:14], ensure_ascii=False)))
        log.check(not few, 'sweep %dx%d L%d: at least two beats everywhere %s' % (vw, vh, lv, few))
        log.check(not page.errors, 'sweep no page errors %s' % page.errors[:3])

    # ------------------------------------------------------------------ 教一教
    if PART == 'teach':
        page = fresh(br, base, 1180, 820)
        SNAP = """() => { const s = JSON.parse(JSON.stringify(Store.s)); delete s.lastG; delete s.lastDay; delete s.teach; for (const d in s.days) { delete s.days[d].ms; } return s; }"""
        def diff(a, b, path=''):
            out = []
            if isinstance(a, dict) and isinstance(b, dict):
                for k in set(a) | set(b):
                    if k not in a or k not in b: out.append(path + '/' + str(k) + ' added/removed')
                    else: out += diff(a[k], b[k], path + '/' + str(k))
            elif a != b: out.append('%s: %s -> %s' % (path, json.dumps(a, ensure_ascii=False)[:60], json.dumps(b, ensure_ascii=False)[:60]))
            return out
        page.evaluate("""() => { const w = Store.w('peppa'); w.gstars['peppa:find'] = 12; w.gstars['peppa:write'] = 7; w.gstars['peppa:quiz'] = 3; w.stars = 22; w.played = ['peppa:find', 'peppa:write', 'peppa:quiz']; Store.s.lastG = null; Store.save(); }""")
        # the child plays 认字 (one question), home
        page.evaluate("window.__go('peppa', 'peppa:find', 0, { seed: 21 })"); wait_phase(page, timeout=30000)
        lv0 = q(page)['level']
        gen, snap = answer_question(page, 'right'); wait_next_question(page, gen)
        page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        before = page.evaluate(SNAP)
        # the parent: long press the gear, tap 降一级来教, close
        g = page.evaluate("() => { const r = document.querySelector('#gear').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }")
        page.mouse.move(g[0], g[1]); page.mouse.down(); page.wait_for_timeout(1900); page.mouse.up()
        log.check(page.evaluate("document.querySelector('#parent').classList.contains('on')"), 'the gear long press opens the panel')
        r = page.evaluate("""() => ({ line: Array.from(document.querySelectorAll('#parent div')).map(d => d.textContent).find(x => x.startsWith('最近玩的') || x.startsWith('已设好')), bs: Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => { const r = b.getBoundingClientRect(); return [b.textContent, b.disabled, b.classList.contains('sel'), Math.round(r.width), Math.round(r.height)]; }) })""")
        log.w('   panel: ' + json.dumps(r, ensure_ascii=False))
        log.check(r['line'] and '佩奇' in r['line'] and ('第 %d 级' % lv0) in r['line'] and r['bs'][2][2], 'the panel names the last game and its level, 关 selected')
        bt = page.evaluate("() => { const b = document.querySelector('#parent [data-teach=\"1\"]'); const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }")
        page.mouse.click(bt[0], bt[1]); page.wait_for_timeout(150)
        r2 = page.evaluate("""() => ({ line: Array.from(document.querySelectorAll('#parent div')).map(d => d.textContent).find(x => x.startsWith('最近玩的') || x.startsWith('已设好')), bs: Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => b.classList.contains('sel')), on: Teach.on, saved: JSON.parse(localStorage.getItem('zzi.v1')).teach })""")
        log.w('   after 降一级: ' + json.dumps(r2, ensure_ascii=False))
        log.check(r2['bs'] == [True, False, False] and r2['on'] and r2['on']['drop'] == 1 and r2['saved'] and r2['saved']['drop'] == 1 and '已打开' in r2['line'], '降一级来教 selected, saved to localStorage, the line says so')
        page.screenshot(path=os.path.join(OUT, 'teach_panel_on.jpg'), type='jpeg', quality=60)
        page.click('#parent .pbtn.x'); page.wait_for_timeout(200)
        # P7: a reload (iPad) keeps it; the panel shows it
        page.reload(); page.wait_for_function('window.__ready === true', timeout=20000)
        on = page.evaluate("Teach.on")
        log.check(on and on['game'] == 'peppa:find' and on['drop'] == 1, 'P7: the preset survives a reload %s' % json.dumps(on))
        enter(page)
        page.evaluate("Parent.open()")
        r3 = page.evaluate("""() => ({ line: Array.from(document.querySelectorAll('#parent div')).map(d => d.textContent).find(x => x.startsWith('最近玩的') || x.startsWith('已设好')), bs: Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => b.classList.contains('sel')) })""")
        log.check(r3['bs'] == [True, False, False] and '已打开' in (r3['line'] or ''), 'after the reload the panel still shows 降一级 selected: %s' % r3['line'])
        page.evaluate("Parent.close()")
        before = page.evaluate(SNAP)      # after the reload (a reload drops the volatile ws.lastKey)
        # the child opens the island panel and taps the game (real taps on the map)
        page.evaluate("MapView.openPanel('peppa')"); page.wait_for_timeout(400)
        hit = page.evaluate("""() => { const b = Array.from(document.querySelectorAll('#map [data-gid]')).find(e => e.dataset.gid === 'game:peppa:find' || e.dataset.gid === 'peppa:find'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, b.dataset.gid]; }""")
        log.w('   island panel game button: %s' % hit)
        if hit: page.mouse.click(hit[0], hit[1])
        else: page.evaluate("() => { MapView.closePanel(true); Session.start('peppa', 'peppa:find'); }")
        wait_phase(page, timeout=30000)
        c = q(page)
        badge = page.evaluate("""() => { const b = document.querySelector('#teachb'); if (!b) return null; const r = b.getBoundingClientRect(); const t = document.querySelector('#tray').getBoundingClientRect(); const h = document.querySelector('#home').getBoundingClientRect(); const ov = (A, B) => Math.max(0, Math.min(A.right, B.right) - Math.max(A.left, B.left)) * Math.max(0, Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top)); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), text: b.textContent, color: getComputedStyle(b).backgroundColor, overTray: ov(r, t), overHome: ov(r, h), onTop: e === b, tray: [Math.round(t.left), Math.round(t.top), Math.round(t.right), Math.round(t.bottom)] }; }""")
        log.w('   badge ' + json.dumps(badge))
        log.check(c['teach'] == 1 and c['level'] == max(1, lv0 - 1), 'teach: the game runs one level lower (L%d -> L%d) teach=%s' % (lv0, c['level'], c['teach']))
        log.check(badge and badge['text'] == '教' and badge['overTray'] == 0 and badge['overHome'] == 0 and badge['w'] >= 48, 'the 教 badge: purple, beside the stars, visible')
        page.screenshot(path=os.path.join(OUT, 'teach_game_L.jpg'), type='jpeg', quality=60)
        kinds = []
        for i in range(6):
            cur = q(page)
            if not cur: break
            kinds.append((cur['kind'], cur['level'], cur['teach'], cur.get('retest')))
            gen, snap = answer_question(page, 'wrong' if i in (1, 3) else 'right', timeout=30000)
            try: wait_next_question(page, gen, timeout=20000)
            except Exception: break
        page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=30000)
        after = page.evaluate(SNAP)
        d = diff(before, after)
        log.w('   questions in teach: ' + json.dumps(kinds, ensure_ascii=False))
        log.check(all(k[0] == 'find' and k[2] == 1 and k[1] == max(1, lv0 - 1) for k in kinds) and len(kinds) == 5, 'teach: five island questions at the lowered level, no review card, no miss card')
        log.check(not d, 'teach: after a whole game (3 right, 2 wrong) the save is unchanged (stars, level, played, Mem, learned, missNext, days.q, visits) %s' % d[:8])
        st = page.evaluate("[Teach.on, !!document.querySelector('#teachb'), Prog.level('peppa', 'peppa:find'), Store.w('peppa').gstars['peppa:find'], JSON.parse(localStorage.getItem('zzi.v1')).teach]")
        log.check(st[0] is None and not st[1] and st[2] == lv0 and st[3] == 13 and st[4] is None, 'back on the map: 教一教 off (also in the save), badge gone, level and stars as before (12 + the one normal star) %s' % st)
        # the panel afterwards: 关 selected, the game named at its real level
        page.evaluate("Parent.open()")
        r4 = page.evaluate("""() => ({ line: Array.from(document.querySelectorAll('#parent div')).map(d => d.textContent).find(x => x.startsWith('最近玩的') || x.startsWith('已设好')), bs: Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => b.classList.contains('sel')) })""")
        page.evaluate("Parent.close()")
        log.check(r4['bs'] == [False, False, True] and ('第 %d 级' % lv0) in r4['line'], 'the panel after: 关 selected, real level shown: %s' % r4['line'])
        # home in the middle of a teach game also ends it
        page.evaluate("Teach.on = { isl: 'peppa', game: 'peppa:find', drop: 1 }")
        page.evaluate("() => { Session.start('peppa', 'peppa:find', { seed: 30 }); }"); wait_phase(page, timeout=30000)
        c = q(page); page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        log.check(c['teach'] == 1 and page.evaluate("Teach.on") is None and page.evaluate("JSON.parse(localStorage.getItem('zzi.v1')).teach") is None, 'home in the middle of a teach game ends it (saved too)')
        # armed for A, the child plays B then A
        page.evaluate("Teach.on = { isl: 'peppa', game: 'peppa:find', drop: 1 }")
        page.evaluate("() => { Session.start('peppa', 'peppa:quiz', { seed: 31 }); }"); wait_phase(page, timeout=30000)
        cB = q(page); bB = page.evaluate("!!document.querySelector('#teachb')")
        gen, snap = answer_question(page, 'right', timeout=30000); wait_next_question(page, gen, timeout=20000)
        page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        still = page.evaluate("Teach.on")
        page.evaluate("Parent.open()")
        r5 = page.evaluate("""() => Array.from(document.querySelectorAll('#parent div')).map(d => d.textContent).find(x => x.startsWith('最近玩的') || x.startsWith('已设好'))""")
        page.evaluate("Parent.close()")
        log.check(cB['teach'] == 0 and not bB and still and still['game'] == 'peppa:find', 'armed for 认字, the child plays 挑战: normal (teach=0, no badge), 认字 stays armed %s' % json.dumps(still))
        log.w('   OBS the panel now (last played 挑战, preset 认字): "%s"' % r5)
        page.evaluate("() => { Session.start('peppa', 'peppa:find', { seed: 32 }); }"); wait_phase(page, timeout=30000)
        cA = q(page); page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        log.check(cA['teach'] == 1 and cA['level'] == lv0 - 1, 'then 认字: taught (L%d)' % cA['level'])
        # level 2 / level 1 buttons
        page.evaluate("() => { Store.w('peppa').gstars['peppa:find'] = 5; Store.save(); Parent.open(); }")
        bs = page.evaluate("Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => [b.textContent, b.disabled])")
        page.evaluate("Parent.close(); Store.w('peppa').gstars['peppa:find'] = 0; Store.save(); Parent.open();")
        bs1 = page.evaluate("Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => [b.textContent, b.disabled])")
        note = page.evaluate("Array.from(document.querySelectorAll('#parent .mut')).map(d => d.textContent).find(x => /第 1 级/.test(x)) || ''")
        page.evaluate("Parent.close()")
        log.check(bs[0][1] is False and bs[1][1] is True and bs1[0][1] is True and bs1[1][1] is True and '不能再降' in note, 'L2: only 降一级; L1: both disabled with a note %s %s' % (bs, bs1))
        # writing game taught: nothing recorded
        page.evaluate("() => { Store.w('peppa').gstars['peppa:write'] = 7; Store.s.learned = {}; Store.save(); Store.s.lastG = ['peppa', 'peppa:write']; Teach.on = { isl: 'peppa', game: 'peppa:write', drop: 1 }; }")
        before = page.evaluate(SNAP)
        page.evaluate("() => { Session.start('peppa', 'peppa:write', { seed: 23 }); }"); wait_phase(page, timeout=30000)
        c = q(page)
        for i in range(5):
            cur = q(page)
            if not cur: break
            if i == 0: step(page, 'wrong')
            gen, snap = answer_question(page, 'right', timeout=40000)
            try: wait_next_question(page, gen, timeout=30000)
            except Exception: break
        page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=40000)
        after = page.evaluate(SNAP); d = diff(before, after)
        log.check(c['teach'] == 1 and c['kind'] == 'write' and not d, 'teach on 写字 (L%d): a whole game leaves the save untouched %s' % (c['level'], d[:6]))
        # the key round while armed
        page.evaluate("() => { Store.s.lastG = ['peppa', 'peppa:find']; Teach.on = { isl: 'peppa', game: 'peppa:find', drop: 1 }; }")
        page.evaluate("() => { Session.start('peppa', 'peppa:find', { key: true, keyItems: ['人', '口'] }); }"); wait_phase(page, timeout=30000)
        c = q(page); page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        log.check(c['teach'] == 0 and c['kind'] == 'review' and page.evaluate("Teach.on") is not None, 'the key round is never a teach game (teach=%s) and leaves the preset armed' % c['teach'])
        # a ✓ game (L5) taught two levels down
        page.evaluate("() => { Store.w('peppa').gstars['peppa:find'] = 25; Store.save(); Teach.on = { isl: 'peppa', game: 'peppa:find', drop: 2 }; }")
        before = page.evaluate(SNAP)
        page.evaluate("() => { Session.start('peppa', 'peppa:find', { seed: 25 }); }"); wait_phase(page, timeout=30000)
        c = q(page)
        for i in range(5):
            cur = q(page)
            if not cur: break
            gen, snap = answer_question(page, 'right', timeout=30000)
            try: wait_next_question(page, gen, timeout=20000)
            except Exception: break
        page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=30000)
        after = page.evaluate(SNAP); d = diff(before, after)
        log.check(c['level'] == 3 and c['teach'] == 2 and not d, 'a ✓ game (L5) taught two levels down runs at L%d and changes nothing %s' % (c['level'], d[:4]))
        # the first-ever game of an island taught: played[] untouched -> the next game must not open
        page.evaluate("() => { const w = Store.w('bluey'); w.gstars = {}; w.played = []; w.stars = 0; Store.save(); Store.s.lastG = ['bluey', 'bluey:find']; Teach.on = { isl: 'bluey', game: 'bluey:find', drop: 1 }; }")
        page.evaluate("Store.s.all = false; Store.save()")
        op0 = page.evaluate("Prog.gameOpen('bluey', 'bluey:write')")
        page.evaluate("() => { Session.start('bluey', 'bluey:find', { seed: 26 }); }"); wait_phase(page, timeout=30000)
        c = q(page)
        log.w('   OBS bluey:find at 0 stars taught 降一级: level %d (base L1 cannot drop; teach=%s)' % (c['level'], c['teach']))
        for i in range(5):
            cur = q(page)
            if not cur: break
            gen, snap = answer_question(page, 'right', timeout=30000)
            try: wait_next_question(page, gen, timeout=20000)
            except Exception: break
        page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=30000)
        op1 = page.evaluate("[Prog.gameOpen('bluey', 'bluey:write'), Store.w('bluey').played, Store.w('bluey').gstars, Store.w('bluey').visits]")
        log.check(op1[0] == op0 and not op1[1] and not op1[2], 'a taught game opens no new game and records no play %s -> %s' % (op0, op1))
        page.evaluate("Store.s.all = true; Store.save()")
        # export / import keeps the preset? (observation)
        page.evaluate("Teach.on = { isl: 'peppa', game: 'peppa:find', drop: 1 }")
        exp = page.evaluate("Report.export()")
        page.evaluate("Teach.on = null")
        page.evaluate("(t) => Report.import(t)", exp)
        log.w('   OBS export/import carries the 教一教 preset: %s' % json.dumps(page.evaluate("Teach.on")))
        page.evaluate("Teach.on = null")
        page.context.close()
        # the badge + 一步一步 at the other two sizes; the step button must not cover the badge
        for vw, vh, tag in ((820, 1180, 'P'), (1024, 768, 'L2'), (1180, 820, 'L')):
            page = fresh(br, base, vw, vh)
            set_ex(page, 'step')
            for isl, g, lv, stars in (('hulk3', 'hulk3:quiz', None, 10), ('peppa', 'peppa:find', None, 12), ('s1', 's1:quiz', None, 10)):
                page.evaluate("([i, g, s]) => { Store.w(i).gstars[g] = s; Store.save(); Store.s.lastG = [i, g]; Teach.on = { isl: i, game: g, drop: 1 }; }", [isl, g, stars])
                page.evaluate("([i, g]) => { Session.start(i, g, { seed: 26 }); }", [isl, g]); wait_phase(page, timeout=30000)
                c = q(page)
                badge = page.evaluate("""() => { const b = document.querySelector('#teachb'); if (!b) return null; const r = b.getBoundingClientRect(); const t = document.querySelector('#tray').getBoundingClientRect(); const ov = (A, B) => Math.max(0, Math.min(A.right, B.right) - Math.max(A.left, B.left)) * Math.max(0, Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top)); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), overTray: ov(r, t), onTop: h === b }; }""")
                gen, cur = wrong_once(page)
                beats, problems, jumps = step_loop(page, gen, shot='teach_step_%s_%s' % (tag, g.replace(':', '-')))
                wait_next_question(page, gen, timeout=30000)
                tov = [o for b in beats for o in b['ov'] if o[0] == 'teach' and (o[1] > 0 or o[2] > 0)]
                log.check(c['teach'] == 1 and badge and badge['overTray'] == 0 and not problems and not tov, '%s teach + 一步一步 on %s: L%d, badge %s, beats %d, badge never under the step buttons %s %s' % (tag, g, c['level'], badge, len(beats), problems, tov))
                page.evaluate("gesture('home')"); page.wait_for_timeout(100)
            log.check(not page.errors, '%s no page errors %s' % (tag, page.errors[:3]))
            page.context.close()

    # ------------------------------------------------------------------ key round, review cards, the missed card in 一步一步
    if PART == 'key':
        page = fresh(br, base, 1180, 820)
        set_ex(page, 'step')
        bad, out = [], []
        for isl, items in (('hulk3', ['人', 'A', '我']), ('peppa2', ['是', 'M']), ('s1', ['不', 'B'])):
            g0 = page.evaluate("window.__qn || 0")
            page.evaluate("([i, items]) => { Session.start(i, i + ':find', { key: true, keyItems: items }); }", [isl, items])
            wait_phase(page, timeout=30000, gen=g0)
            for k in items:
                try:
                    gen, cur = wrong_once(page)
                    beats, problems, jumps = step_loop(page, gen, shot='key_%s_%s' % (isl, k))
                    page.wait_for_function("(g) => !window.__q || window.__q.gen !== g", arg=gen, timeout=30000)
                    rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
                    out.append((isl, k, cur['kind'], len(beats), [b['said'] for b in beats], jumps))
                    if cur['kind'] != 'review' or len(beats) < 2 or problems or not rec or not rec['ex'] or not rec['ex']['right']: bad.append((isl, k, cur['kind'], len(beats), problems))
                except Exception as e:
                    bad.append((isl, k, 'ERR ' + str(e)[:100])); break
            try: page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=30000)
            except Exception: page.evaluate("gesture('home')")
            page.wait_for_timeout(300)
        log.w('   key: ' + json.dumps(out, ensure_ascii=False))
        log.check(not bad, 'the key round in 一步一步: every review card stops at each beat, gold ring %s' % bad[:4])
        log.w('   keys got: %s' % page.evaluate("Store.s.key.got"))
        # a wrong answer -> the missed card two questions later
        page.evaluate("window.__go('bluey', 'bluey:find', 2, { seed: 41 })"); wait_phase(page, timeout=30000)
        gen, cur = wrong_once(page); beats, problems, jumps = step_loop(page, gen); wait_next_question(page, gen, timeout=30000)
        kinds = []
        for i in range(4):
            cur = wait_phase(page, timeout=30000)
            kinds.append(cur['kind'])
            if cur['kind'] == 'review':
                gen, cur2 = wrong_once(page); beats2, problems2, j2 = step_loop(page, gen, shot='miss_card'); wait_next_question(page, gen, timeout=30000)
                log.check(len(beats2) >= 2 and not problems2, 'the missed-item card (再来一个) in 一步一步: %d beats %s %s' % (len(beats2), [b['said'] for b in beats2], problems2))
                break
            gen, snap = answer_question(page, 'right'); wait_next_question(page, gen, timeout=30000)
        log.w('   kinds after the wrong answer: %s' % kinds)
        page.evaluate("gesture('home')")
        # a scheduled review card (Mem due) inside a normal game, wrong, in step mode
        page.evaluate("""() => { Store.s.learned = {}; ['人','口','目'].forEach(k => { Mem.answer(k, 'ok', 'x1'); }); for (const k in Store.s.mem) { Store.s.mem[k].due = DAY() - 1; Store.s.mem[k].b = 2; } Store.save(); }""")
        page.evaluate("window.__go('bluey', 'bluey:find', 2, { seed: 42 })"); wait_phase(page, timeout=30000)
        got = None
        for i in range(5):
            cur = wait_phase(page, timeout=30000)
            if cur['kind'] == 'review' and not got:
                gen, cur2 = wrong_once(page); beats3, problems3, j3 = step_loop(page, gen, shot='review_card'); wait_next_question(page, gen, timeout=30000)
                got = (len(beats3), [b['said'] for b in beats3], problems3)
                continue
            gen, snap = answer_question(page, 'right');
            try: wait_next_question(page, gen, timeout=30000)
            except Exception: break
        log.check(got and got[0] >= 2 and not got[2], 'a due review card inside a game, wrong, in 一步一步: %s' % str(got))
        page.evaluate("gesture('home')")
        log.check(not page.errors, 'key no page errors %s' % page.errors[:3])

    # ------------------------------------------------------------------ 关 and 自动 did not regress
    if PART == 'offauto':
        page = fresh(br, base, 1180, 820)
        set_ex(page, 'off')
        bad, res = [], []
        for isl, g, lv in (('peppa', 'peppa:find', 2), ('huluwa', 'huluwa:quiz', 3), ('s1', 's1:quiz', 2), ('hulk3', 'hulk3:en', 3), ('widow3', 'widow3:quiz', 2), ('robot2', 'robot2:quiz', 3), ('peppa', 'peppa:write', 2), ('s2', 's2:quiz', 2), ('thor3', 'thor3:quiz', 2), ('xiyou', 'xiyou:quiz', 3), ('ultra', 'ultra:quiz', 2)):
            page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 5 })", [isl, g, lv]); wait_phase(page, timeout=30000)
            s0 = page.evaluate("Session.G.stars")
            mark = page.evaluate("window.__speechLog.length")
            gen, cur = wrong_once(page)
            t0 = time.time()
            wait_next_question(page, gen, timeout=30000)
            dt = time.time() - t0
            rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
            said = page.evaluate(SAID, mark)
            rings = page.evaluate("document.querySelectorAll('.exring,[data-ex],.stepbtn,.stepskip').length")
            s1 = page.evaluate("Session.G.stars")
            res.append((g, round(dt, 1), said, rec and rec['ex'], rec and rec['ms']))
            if not rec or rec['ex'] or rec['ms'] > 300 or s1 != s0 or not any('[again]' in x for x in said) or rings or any('错' in x for x in said):
                bad.append((g, said, rec and rec['ex'], rec and rec['ms'], s1 - s0, rings))
            page.evaluate("gesture('home')"); page.wait_for_timeout(100)
        log.w('   关: ' + json.dumps(res, ensure_ascii=False))
        log.check(not bad, '关: the factual line, then the closing line, a new question; no rings, no star, no step buttons %s' % bad[:4])
        set_ex(page, 'auto')
        bad, res = [], []
        for isl, g, lv in (('peppa', 'peppa:find', 2), ('huluwa', 'huluwa:quiz', 3), ('hulk3', 'hulk3:en', 3), ('thor3', 'thor3:quiz', 2), ('peppa', 'peppa:write', 2), ('bluey', 'bluey:quiz', 2), ('ultra', 'ultra:quiz', 2), ('s1', 's1:quiz', 2)):
            page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 5 })", [isl, g, lv]); wait_phase(page, timeout=30000)
            s0 = page.evaluate("Session.G.stars"); mark = page.evaluate("window.__speechLog.length")
            gen, cur = wrong_once(page)
            # a tap skips it in 自动
            wait_next_question(page, gen, timeout=30000)
            rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
            left = page.evaluate("document.querySelectorAll('.stepbtn,.stepskip').length")
            said = page.evaluate(SAID, mark); s1 = page.evaluate("Session.G.stars")
            res.append((g, said, rec and rec['ex']))
            if not rec or not rec['ex'] or not rec['ex']['right'] or left or s1 != s0 or any('错' in x for x in said): bad.append((g, rec and rec['ex'], left, said))
            page.evaluate("gesture('home')"); page.wait_for_timeout(100)
        log.w('   自动: ' + json.dumps(res, ensure_ascii=False)[:1500])
        log.check(not bad, '自动: gold ring, no step buttons, no star %s' % bad)
        # 自动 at real speed: a tap skips; the explanation 2-5 s
        page.evaluate("window.__fast = 0")
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 8 })"); wait_phase(page, timeout=60000)
        gen, cur = wrong_once(page, timeout=60000); t0 = time.time(); wait_next_question(page, gen, timeout=30000); dt = time.time() - t0
        rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
        log.check(rec and 1500 <= rec['ms'] <= 6000, '自动 at real speed: explanation %s ms, %.1f s to the next question' % (rec and rec['ms'], dt))
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 9 })"); wait_phase(page, timeout=60000)
        gen, cur = wrong_once(page, timeout=60000)
        page.wait_for_function("(g) => { const q = window.__q; return q && q.gen === g && q.phase === 'explain'; }", arg=gen, timeout=30000)
        page.wait_for_timeout(400); page.mouse.click(590, 410)
        t0 = time.time(); wait_next_question(page, gen, timeout=30000); dt = time.time() - t0
        log.check(dt < 3.5, '自动 at real speed: a tap on the stage skips the explanation (%.1f s)' % dt)
        page.evaluate("window.__fast = 1"); page.evaluate("gesture('home')")
        log.check(not page.errors, 'offauto no page errors %s' % page.errors[:3])

    # ------------------------------------------------------------------ interruptions: background, home, child taps, relisten, no speech
    if PART == 'misc':
        page = fresh(br, base, 1180, 820)
        set_ex(page, 'step')
        # background while waiting
        gen, c = start_wrong(page, 'peppa', 'peppa:find', 2, 13)
        page.evaluate(HIDE); page.wait_for_timeout(600)
        paused = page.evaluate("Session.G.scope.paused")
        page.evaluate(SHOW); page.wait_for_timeout(300)
        a = page.evaluate(AUDIT); page.mouse.click(*mid(a['btn'])); page.wait_for_timeout(400)
        c2 = q(page)
        log.check(paused and c2 and (c2['gen'] != gen or c2['stepN'] >= 1), 'background and back while waiting: paused=%s, a tap moves on %s' % (paused, c2 and (c2['gen'] == gen, c2['stepN'])))
        beats, problems, jumps = step_loop(page, gen); wait_next_question(page, gen, timeout=20000)
        log.check(not problems, 'after the background the rest of the beats work %s' % problems)
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # background during a beat's animation (real speed), back: the button appears, works
        page.evaluate("window.__fast = 0")
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 14 })"); wait_phase(page, timeout=60000)
        gen, cur = wrong_once(page, timeout=60000)
        page.wait_for_function("(g) => { const q = window.__q; return q && q.gen === g && q.phase === 'explain'; }", arg=gen, timeout=30000)
        page.evaluate(HIDE); page.wait_for_timeout(1500); page.evaluate(SHOW)
        c = wait_step_or_next(page, gen, timeout=40000)
        a = page.evaluate(AUDIT); probs = []; judge(a, probs)
        page.mouse.click(*mid(a['btn'])); page.wait_for_timeout(300)
        c2 = q(page)
        log.check(not probs and c2 and (c2['gen'] != gen or c2['stepN'] >= 1), 'real speed: background during the beat, back: the button comes and works %s' % probs)
        while True:
            c = wait_step_or_next(page, gen, timeout=40000)
            if c is None: break
            a = page.evaluate(AUDIT); page.mouse.click(*mid(a['btn'])); page.wait_for_timeout(100)
        wait_next_question(page, gen, timeout=40000)
        page.evaluate("window.__fast = 1"); page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # home while waiting: nothing left
        gen, c = start_wrong(page, 'peppa', 'peppa:find', 2, 15)
        page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        left = page.evaluate("[document.querySelectorAll('.stepbtn,.stepskip').length, document.querySelector('#map').classList.contains('on'), window.__q]")
        log.check(left[0] == 0 and left[1] and left[2] is None, 'home while waiting: map, no buttons left %s' % left[:2])
        # home while 跳过 is held
        gen, c = start_wrong(page, 'bluey', 'bluey:find', 2, 16)
        a = page.evaluate(AUDIT); x, y = mid(a['skip'])
        page.mouse.move(x, y); page.mouse.down(); page.wait_for_timeout(300)
        page.evaluate("gesture('home')"); page.wait_for_timeout(900); page.mouse.up(); page.wait_for_timeout(300)
        left = page.evaluate("[document.querySelectorAll('.stepbtn,.stepskip').length, document.querySelector('#map').classList.contains('on'), window.__q, !!Session.G]")
        log.check(left[0] == 0 and left[1] and left[2] is None and not left[3], 'home while 跳过 is held: clean map, no game %s' % left)
        page.evaluate("window.__go('bluey', 'bluey:find', 2, { seed: 4 })"); wait_phase(page, timeout=30000)
        log.check(page.evaluate("document.querySelectorAll('.stepbtn,.stepskip').length") == 0, 'the next game starts without step buttons')
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # the child: cards, stage, host, skip gesture, double taps on the button
        gen, c = start_wrong(page, 'peppa', 'peppa:find', 2, 16)
        n0 = page.evaluate("window.__q.stepN")
        for js in ("__gesture('tap', { id: 'card1' })", "__gesture('skip')"):
            page.evaluate(js); page.wait_for_timeout(150)
        page.mouse.click(590, 410); page.wait_for_timeout(150)
        for i in range(5): page.mouse.click(300 + i * 100, 300); page.wait_for_timeout(60)
        page.wait_for_timeout(1200)
        c2 = q(page)
        log.check(c2 and c2['gen'] == gen and c2['stepWaiting'] and c2['stepN'] == n0, 'the child taps cards / stage / skip: still waiting at the same beat %s' % str(c2 and (c2['stepN'], c2['stepWaiting'])))
        # the host: relisten interrupts the explanation line? (observation)
        mark = page.evaluate("window.__speechLog.length")
        page.evaluate("gesture('relisten')"); page.wait_for_timeout(300)
        hs = page.evaluate("(i) => window.__speechLog.slice(i).map(e => [e.text, e.tag, e.ev])", mark)
        log.w('   OBS a tap on the host while waiting: ' + json.dumps(hs, ensure_ascii=False))
        # a double tap on 下一步 (fast mode): how many beats does it skip?
        a = page.evaluate(AUDIT); x, y = mid(a['btn'])
        page.mouse.click(x, y); page.wait_for_timeout(30); page.mouse.click(x, y); page.wait_for_timeout(400)
        c3 = q(page)
        log.w('   OBS a double tap on ▶ (fast mode) landed at stepN=%s (from %s)' % (c3 and c3['stepN'], n0))
        beats, problems, jumps = step_loop(page, gen); wait_next_question(page, gen, timeout=20000)
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # does the hint system wake during a long wait? (25 s idle, real speed)
        page.evaluate("window.__fast = 0")
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 17 })"); wait_phase(page, timeout=60000)
        gen, cur = wrong_once(page, timeout=60000)
        c = wait_step_or_next(page, gen, timeout=40000)
        mark = page.evaluate("window.__speechLog.length")
        page.wait_for_timeout(26000)
        c2 = q(page); said = page.evaluate(SAID, mark); hand = page.evaluate("!!(Hand.el && Hand.el.isConnected)")
        log.check(c2 and c2['gen'] == gen and c2['stepWaiting'] and not said, '26 s idle at a wait (real speed): still waiting, nothing said %s, hand shown=%s' % (said, hand))
        a = page.evaluate(AUDIT); page.mouse.click(*mid(a['btn']))
        while True:
            c = wait_step_or_next(page, gen, timeout=40000)
            if c is None: break
            a = page.evaluate(AUDIT); page.mouse.click(*mid(a['btn'])); page.wait_for_timeout(100)
        wait_next_question(page, gen, timeout=40000)
        page.evaluate("window.__fast = 1"); page.evaluate("gesture('home')")
        log.check(not page.errors, 'misc no page errors %s' % page.errors[:3])
        page.context.close()
        # no speech engine at all (an iPad with voices broken): step mode still stops and goes on (recordings play)
        page = fresh(br, base, 1180, 820, no_speech=True)
        set_ex(page, 'step')
        gen, c = start_wrong(page, 'peppa', 'peppa:find', 2, 18)
        beats, problems, jumps = step_loop(page, gen); wait_next_question(page, gen, timeout=20000)
        log.check(len(beats) >= 2 and not problems, 'no speechSynthesis: %d beats, fine %s' % (len(beats), problems))
        # no recordings (device engine path) either
        page.context.close()
        page = fresh(br, base, 1180, 820, bank=False)
        set_ex(page, 'step')
        gen, c = start_wrong(page, 'peppa', 'peppa:find', 2, 18)
        beats, problems, jumps = step_loop(page, gen); wait_next_question(page, gen, timeout=20000)
        log.check(len(beats) >= 2 and not problems, 'device engine (no recordings): %d beats, fine %s' % (len(beats), problems))
        log.check(not page.errors, 'misc2 no page errors %s' % page.errors[:3])

    if PART == 'clock2':
        page = fresh(br, base, 1180, 820, fast=False)
        page.evaluate("window.__fast = 0")
        set_ex(page, 'auto')
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 18 })"); wait_phase(page, timeout=60000)
        rounds = 0
        for i in range(6):
            cur = q(page)
            if not cur: break
            rounds += 1
            gen, snap = answer_question(page, 'right', timeout=60000)
            if i == 0:
                page.wait_for_function("(g) => { const q = window.__q; return !q || q.gen !== g || q.phase === 'praise'; }", arg=gen, timeout=30000)
                page.evaluate("Clock.lost -= 200000")       # 200 s passed in the middle of the game, no explanation
            try: wait_next_question(page, gen, timeout=30000)
            except Exception: break
        try: page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=40000)
        except Exception: pass
        mapon = page.evaluate("document.querySelector('#map').classList.contains('on') && !window.__q")
        log.check(rounds == 3 and mapon, 'regression: an ordinary game past 3 minutes (no explanation wait) still ends after %d questions (map=%s)' % (rounds, mapon))
        log.check(not page.errors, 'clock2: no page errors %s' % page.errors[:3])

    br.close()
sys.exit(0 if log.close() else 1)
