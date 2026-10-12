# -*- coding: utf-8 -*-
"""Independent review PT1 (explain setting 关/自动/一步一步 + 教一教). Not part of the app.
usage: python tests/review_pt1.py <part> [args]
parts: panel | sweep <W>x<H> <level> | real | interrupt | off | teach | key"""
import os, sys, json, time, faulthandler
faulthandler.dump_traceback_later(420, exit=True)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, q, step, answer_question, wait_next_question, Log

PART = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs', 'pt1')
os.makedirs(OUT, exist_ok=True)
log = Log('pt1_' + PART + ('_' + sys.argv[2] if len(sys.argv) > 2 else ''))
OPEN = "() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); ISL[id].letters.forEach(l => { Store.s.met[l.l] = true; }); }); Store.save(); }"

AUDIT = r"""() => {
  const st = Session.st, G = Session.G; if (!st) return null;
  const b = document.querySelector('.stepbtn'), s = document.querySelector('.stepskip');
  const R = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom) }; };
  if (!b) return { nobtn: true, phase: st.phase };
  const br = R(b), sr = s ? R(s) : null, vis = getComputedStyle(b).visibility;
  const hit = document.elementFromPoint(br.x + br.w / 2, br.y + br.h / 2); const top = !!hit && (hit === b || b.contains(hit));
  const hs = s ? document.elementFromPoint(sr.x + sr.w / 2, sr.y + sr.h / 2) : null; const stop = !!hs && (hs === s || s.contains(hs));
  const vis_actor = Object.values(G.actors || {}).filter(a => a.root && a.root.isConnected && a.x > 0 && a.x < Stage.W).map(a => a.root);
  const obs = [].concat(st.cards || [], st.rights || [], st.lefts || [], st.tileEls || [], st.lamps || [], st.taskEl ? [st.taskEl] : [], st.w && st.w.el ? [st.w.el] : []).filter(e => e && e.isConnected).map(e => ['opt', R(e)])
    .concat(vis_actor.map(e => ['actor', R(e)]))
    .concat(Array.from(Stage.el.querySelectorAll('.exring,[data-ex]')).map(e => ['ex', R(e)]))
    .concat([['home', R(document.querySelector('#home'))], ['avatar', R(document.querySelector('#avatar'))], ['tray', R(document.querySelector('#tray'))]])
    .concat(document.querySelector('#teachb') ? [['teach', R(document.querySelector('#teachb'))]] : []);
  const inter = (A, B) => Math.max(0, Math.min(A.r, B.r) - Math.max(A.x, B.x)) * Math.max(0, Math.min(A.b, B.b) - Math.max(A.y, B.y));
  const ov = [];
  obs.forEach(([k, r]) => { if (r.w <= 0 || r.h <= 0) return; const a = inter(br, r), a2 = sr ? inter(sr, r) : 0; if (a > 0 || a2 > 0) ov.push([k, a, a2]); });
  return { btn: br, skip: sr, vis, top, stop, ov, vw: innerWidth, vh: innerHeight, stepN: st.stepN, phase: st.phase, waiting: !!st.stepWaiting };
}"""

SAID = "(i) => window.__speechLog.slice(i).filter(e => e.ch === 'narr' && e.ev === 'speak').map(e => e.text + (e.tag ? '[' + e.tag + ']' : ''))"


def set_ex(page, mode):
    page.evaluate("(m) => { Store.s.settings.ex = m; Store.save(); }", mode)


def wrong_once(page):
    cur = wait_phase(page, timeout=30000)
    strat = 'wrong'
    if cur['kind'] == 'write':
        step(page, 'wrong'); strat = 'right'
    gen, snap = answer_question(page, strat, timeout=30000)
    return gen, cur


def wait_step_or_next(page, gen, timeout=25000):
    page.wait_for_function("(g) => { const q = window.__q; return !q || q.gen !== g || q.stepWaiting; }", arg=gen, timeout=timeout, polling=20)
    cur = q(page)
    return cur if cur and cur['gen'] == gen else None


def step_loop(page, gen, shot=None, max_steps=14, check_idle=False):
    """taps 下一步 with the real mouse until the next question; returns the list of beats"""
    beats, problems = [], []
    mark = page.evaluate("window.__speechLog.length")
    for i in range(max_steps):
        cur = wait_step_or_next(page, gen)
        if cur is None:
            break
        a = page.evaluate(AUDIT)
        said = page.evaluate(SAID, mark)
        mark = page.evaluate("window.__speechLog.length")
        beats.append({'said': said, 'btn': a and a.get('btn'), 'ov': a and a.get('ov'), 'ex': cur.get('ex')})
        if not a or a.get('nobtn'):
            problems.append('no button'); break
        b = a['btn']
        if a['vis'] == 'hidden': problems.append('button hidden while waiting')
        if min(b['w'], b['h']) < 88: problems.append('button %dx%d' % (b['w'], b['h']))
        if b['x'] < 0 or b['y'] < 0 or b['r'] > a['vw'] or b['b'] > a['vh']: problems.append('button off screen %s' % b)
        if not a['top']: problems.append('button under something')
        if a['skip'] and not a['stop']: problems.append('skip under something')
        bad_ov = [o for o in a['ov'] if o[0] in ('opt', 'ex', 'home', 'avatar', 'tray', 'teach') and (o[1] > 100 or o[2] > 100)]
        if bad_ov: problems.append('overlap %s' % bad_ov)
        act_ov = [o for o in a['ov'] if o[0] == 'actor' and o[1] > 2500]
        if act_ov: problems.append('over an actor %s' % act_ov)
        if shot and i < 3:
            page.screenshot(path=os.path.join(OUT, '%s_s%d.jpg' % (shot, i + 1)), type='jpeg', quality=55)
        if check_idle and i == 0:
            page.wait_for_timeout(2500)
            c2 = q(page)
            if not (c2 and c2['gen'] == gen and c2['stepWaiting']): problems.append('went on by itself')
            r = page.evaluate("gesture('skip')")
            page.evaluate("__gesture('tap', { id: 'card0' })")
            page.mouse.click(a['vw'] / 2, a['vh'] * 0.45)         # a child's tap on the stage (the #ff overlay)
            page.wait_for_timeout(300)
            c3 = q(page)
            if not (c3 and c3['gen'] == gen and c3['stepWaiting']): problems.append('a skip-tap moved it on')
        page.mouse.click(b['x'] + b['w'] / 2, b['y'] + b['h'] / 2)
        page.wait_for_timeout(40)
    else:
        problems.append('more than %d beats' % max_steps)
    return beats, problems


def fresh(br, base, vw=1180, vh=820, fast=True):
    page = new_page(br, base, vw, vh, fast=fast)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate(OPEN)
    return page


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()

    if PART == 'panel':
        for vw, vh, tag in ((1180, 820, 'L'), (820, 1180, 'P'), (1024, 768, 'L2')):
            page = fresh(br, base, vw, vh)
            # the gear: a short tap only toasts, a long press opens the panel
            g = page.evaluate("() => { const r = document.querySelector('#gear').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width, r.height]; }")
            log.check(g[2] >= 88 and g[3] >= 88, '%s gear %dx%d' % (tag, g[2], g[3]))
            page.mouse.click(g[0], g[1])
            page.wait_for_timeout(200)
            toast = page.evaluate("document.querySelector('#toast').textContent")
            opened = page.evaluate("document.querySelector('#parent').classList.contains('on')")
            log.check(not opened and '按住' in toast, '%s a short tap on the gear: no panel, toast "%s"' % (tag, toast))
            page.mouse.move(g[0], g[1]); page.mouse.down(); page.wait_for_timeout(1900); page.mouse.up()
            opened = page.evaluate("document.querySelector('#parent').classList.contains('on')")
            log.check(opened, '%s a long press opens the parent panel' % tag)
            page.screenshot(path=os.path.join(OUT, 'panel_%s.jpg' % tag), type='jpeg', quality=60)
            r = page.evaluate("""() => { const bs = Array.from(document.querySelectorAll('#parent [data-ex]')).map(b => { const r = b.getBoundingClientRect(); return [b.textContent, b.classList.contains('sel'), Math.round(r.width), Math.round(r.height), Math.round(r.top)]; });
              const t = Array.from(document.querySelectorAll('#parent h3')).map(h => h.textContent); const tw = Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => [b.textContent, b.disabled, b.classList.contains('sel')]);
              const mut = Array.from(document.querySelectorAll('#parent .mut')).map(d => d.textContent).filter(x => /讲解|教一教|先让孩子/.test(x)); return { bs, t, tw, mut }; }""")
            log.w('   explain buttons ' + json.dumps(r['bs'], ensure_ascii=False) + ' headings ' + json.dumps(r['t'][:4], ensure_ascii=False))
            log.w('   teach buttons ' + json.dumps(r['tw'], ensure_ascii=False) + ' notes ' + json.dumps(r['mut'], ensure_ascii=False)[:700])
            log.check([b[0] for b in r['bs']] == ['关', '自动', '一步一步'] and [b[1] for b in r['bs']] == [False, True, False], '%s explain setting: 关 / 自动 (selected by default) / 一步一步' % tag)
            log.check(r['t'][0] == '答错后的讲解' and r['t'][1].startswith('教一教'), '%s the two new sections come first in the panel' % tag)
            log.check(not r['tw'] and any('先让孩子' in m for m in r['mut']), '%s no game played yet: 教一教 says so, no buttons' % tag)
            if tag == 'L':
                page.click('#parent [data-ex="step"]')
                page.wait_for_timeout(100)
                sel = page.evaluate("Array.from(document.querySelectorAll('#parent [data-ex]')).map(b => b.classList.contains('sel'))")
                log.check(sel == [False, False, True] and page.evaluate("Store.s.settings.ex") == 'step', 'L tapping 一步一步 selects it and saves it')
                page.reload(); page.wait_for_function('window.__ready === true', timeout=20000)
                log.check(page.evaluate("Store.s.settings.ex") == 'step' and page.evaluate("exMode()") == 'step', 'L the setting survives a reload')
                page.evaluate("Store.s.settings.ex = 'bogus'; Store.save()"); page.reload(); page.wait_for_function('window.__ready === true', timeout=20000)
                log.check(page.evaluate("exMode()") == 'auto', 'L a broken value falls back to 自动')
                # the gear is a map thing: not reachable while a game is on
                enter(page)
                page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 3 })"); wait_phase(page, timeout=30000)
                gv = page.evaluate("() => { const g = document.querySelector('#gear'); const r = g.getBoundingClientRect(); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { w: r.width, inMap: !!g.closest('#map'), mapOn: document.querySelector('#map').classList.contains('on'), hitGear: !!h && (h === g || g.contains(h)) }; }")
                log.check(gv['inMap'] and not gv['hitGear'], 'L during a game the gear cannot be hit %s' % gv)
                log.check(not page.errors, 'L no page errors %s' % page.errors[:3])
            page.context.close()

    if PART == 'sweep':
        vw, vh = [int(x) for x in sys.argv[2].split('x')]
        lv = int(sys.argv[3]) if len(sys.argv) > 3 else 2
        page = fresh(br, base, vw, vh)
        set_ex(page, 'step')
        games = page.evaluate("ALL_ISL().flatMap(i => ISL[i].games.map(g => [i, g, GAMES[g].kind0]))")
        if os.environ.get('PT1_GAMES'):
            games = [x for x in games if any(x[1].startswith(k) for k in os.environ['PT1_GAMES'].split(','))]
        res, bad, few = {}, [], []
        for isl, g, kind in games:
            tag = '%s_L%d_%dx%d' % (g.replace(':', '-'), lv, vw, vh)
            try:
                page.evaluate("([i, g]) => { Store.w(i).gstars[g] = 0; Store.save(); }", [isl, g])
                page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 31 + l })", [isl, g, lv])
                wait_phase(page, timeout=30000)
                s0 = page.evaluate("Session.G.stars")
                gen, cur = wrong_once(page)
                beats, problems = step_loop(page, gen, shot=tag if os.environ.get('PT1_SHOTS', '1') == '1' else None, check_idle=(g in ('peppa:find', 'huluwa:quiz', 's1:quiz', 'hulk3:en', 'thor3:quiz', 'widow3:quiz', 'peppa:write')))
                wait_next_question(page, gen, timeout=30000)
                page.wait_for_function("window.__q && ['ready','act','input'].includes(window.__q.phase)", timeout=30000)
                rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
                s1 = page.evaluate("Session.G.stars")
                if s1 != s0: problems.append('a star after a wrong answer')
                if not rec or not rec['ex'] or not rec['ex']['right']: problems.append('no gold ring in step mode')
                n = len(beats)
                res[g] = {'beats': n, 'said': [b['said'] for b in beats], 'btn': beats[0]['btn'] if beats else None, 'ov': [b['ov'] for b in beats], 'ms': rec and rec['ms']}
                if problems: bad.append((g, lv, problems))
                if n < 2: few.append((g, n))
            except Exception as e:
                bad.append((g, lv, 'ERR ' + str(e)[:160]))
            page.evaluate("gesture('home')"); page.wait_for_timeout(60)
            left = page.evaluate("document.querySelectorAll('.stepbtn,.stepskip').length")
            if left: bad.append((g, lv, 'step buttons left behind after home'))
        with open(os.path.join(OUT, 'sweep_%dx%d_L%d.json' % (vw, vh, lv)), 'w', encoding='utf-8') as f:
            json.dump(res, f, ensure_ascii=False, indent=1)
        log.w('   beats per game: ' + json.dumps({k: v['beats'] for k, v in res.items()}, ensure_ascii=False))
        log.check(not bad, 'sweep %dx%d L%d: %d games wrong once in 一步一步: every beat waits for 下一步 (>= 88 px, on screen, on top, not over options / marks / chrome), no star, gold ring %s' % (vw, vh, lv, len(games), bad[:12]))
        log.check(not few, 'sweep %dx%d L%d: at least two beats everywhere %s' % (vw, vh, lv, few))
        log.check(not page.errors, 'sweep no page errors %s' % page.errors[:3])

    if PART == 'real':
        page = fresh(br, base, 1180, 820, fast=False)
        page.evaluate("window.__fast = 0")
        set_ex(page, 'step')
        page.evaluate("() => { window.__cnt = []; const f = Sfx.count; Sfx.count = function (n) { window.__cnt.push([n, Math.round(performance.now())]); return f.apply(Sfx, arguments); }; }")
        for isl, g, lv in (('peppa', 'peppa:find', 2), ('huluwa', 'huluwa:quiz', 3), ('ultra', 'ultra:quiz', 2), ('hulk3', 'hulk3:quiz', 2), ('thor3', 'thor3:quiz', 2), ('bluey', 'bluey:quiz', 2), ('s1', 's1:quiz', 2), ('peppa', 'peppa:write', 2)):
            try:
                page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 5 })", [isl, g, lv])
                wait_phase(page, timeout=60000)
                page.evaluate("window.__cnt.length = 0")
                t0 = time.time()
                gen, cur = wrong_once(page)
                times, beats = [], []
                mark = page.evaluate("window.__speechLog.length")
                for i in range(12):
                    c = wait_step_or_next(page, gen, timeout=40000)
                    if c is None: break
                    times.append(round(time.time() - t0, 1))
                    beats.append(page.evaluate(SAID, mark)); mark = page.evaluate("window.__speechLog.length")
                    page.wait_for_timeout(1500)        # the parent talks
                    a = page.evaluate(AUDIT)
                    if not (a and a['waiting']): beats.append('NOT WAITING'); break
                    page.mouse.click(a['btn']['x'] + a['btn']['w'] / 2, a['btn']['y'] + a['btn']['h'] / 2)
                wait_next_question(page, gen, timeout=40000)
                cnt = page.evaluate("window.__cnt")
                gaps = [cnt[i + 1][1] - cnt[i][1] for i in range(len(cnt) - 1)]
                log.w('   %s L%d real speed: %d beats at %s s, said %s; count notes gaps %s' % (g, lv, len(times), times, json.dumps(beats, ensure_ascii=False), gaps))
                log.check(len(times) >= 2 and 'NOT WAITING' not in beats, '%s real speed: every beat waits' % g)
                if cnt:
                    log.check(gaps and min(gaps) >= 120, '%s the counting notes come one after another in step mode (gaps %s)' % (g, gaps))
            except Exception as e:
                log.fail('%s ERR %s' % (g, str(e)[:200]))
            page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        # the 3-minute rule at real speed: a game past 3 minutes (the parent explained slowly) ends early?
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 17 })"); wait_phase(page, timeout=60000)
        page.evaluate("Clock.lost -= 200000")
        rounds = 0
        for i in range(6):
            cur = q(page)
            if not cur: break
            rounds += 1
            gen, snap = answer_question(page, 'right', timeout=60000)
            try: wait_next_question(page, gen, timeout=20000)
            except Exception: break
        try: page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=20000)
        except Exception: pass
        mapon = page.evaluate("document.querySelector('#map').classList.contains('on') && !window.__q")
        log.w('   OBS real speed: a session already past 3 minutes ends after %d questions (back on map=%s)' % (rounds, mapon))
        page.evaluate("window.__fast = 1")
        # the same two counting games in 自动 for comparison
        set_ex(page, 'auto')
        for isl, g, lv in (('hulk3', 'hulk3:quiz', 2), ('thor3', 'thor3:quiz', 2)):
            page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 5 })", [isl, g, lv]); wait_phase(page, timeout=60000)
            page.evaluate("window.__cnt.length = 0")
            gen, cur = wrong_once(page); wait_next_question(page, gen, timeout=40000)
            cnt = page.evaluate("window.__cnt"); gaps = [cnt[i + 1][1] - cnt[i][1] for i in range(len(cnt) - 1)]
            log.w('   %s 自动 count gaps %s' % (g, gaps))
            page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        log.check(not page.errors, 'real no page errors %s' % page.errors[:3])

    if PART == 'interrupt':
        page = fresh(br, base, 1180, 820)
        set_ex(page, 'step')
        def start(isl='peppa', g='peppa:find', lv=2, seed=9):
            page.evaluate("([i, g, l, s]) => window.__go(i, g, l, { seed: s })", [isl, g, lv, seed]); wait_phase(page, timeout=30000)
            gen, cur = wrong_once(page); c = wait_step_or_next(page, gen); return gen, c
        # 1 rotate while waiting
        gen, c = start()
        a0 = page.evaluate(AUDIT)
        page.set_viewport_size({'width': 820, 'height': 1180}); page.wait_for_timeout(700)
        a1 = page.evaluate(AUDIT)
        page.screenshot(path=os.path.join(OUT, 'rotate_wait.jpg'), type='jpeg', quality=55)
        ok1 = a1 and not a1.get('nobtn') and a1['btn']['r'] <= 820 and a1['btn']['b'] <= 1180 and a1['btn']['x'] >= 0 and a1['top']
        log.check(ok1, 'rotate L->P while waiting: the button is still on screen and on top (before %s, after %s)' % (a0 and a0['btn'], a1 and a1['btn']))
        if a1 and not a1.get('nobtn'):
            page.mouse.click(a1['btn']['x'] + a1['btn']['w'] / 2, a1['btn']['y'] + a1['btn']['h'] / 2)
        page.wait_for_timeout(300)
        c2 = q(page)
        moved = page.evaluate("(g) => { const q = window.__q; return !q || q.gen !== g || !q.stepWaiting || q.stepN > 0; }", gen)
        log.check(moved, 'rotate: a tap on the (possibly moved) button still moves on %s' % str(c2 and (c2['stepN'], c2['stepWaiting'])))
        if not moved:      # stuck: is there any way on besides home? the skip button, a tap anywhere
            sk = page.evaluate("() => { const s = document.querySelector('.stepskip'); const r = s.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; }")
            for i in range(6): page.mouse.click(100 + i * 120, 600)
            page.wait_for_timeout(400)
            c3 = q(page)
            log.w('   STUCK after L->P: 跳过 at %s (viewport 820 wide); taps on the stage: stepN=%s waiting=%s' % (sk, c3 and c3['stepN'], c3 and c3['stepWaiting']))
            page.set_viewport_size({'width': 1180, 'height': 820}); page.wait_for_timeout(600)
            a2 = page.evaluate(AUDIT); page.mouse.click(a2['btn']['x'] + a2['btn']['w'] / 2, a2['btn']['y'] + a2['btn']['h'] / 2); page.wait_for_timeout(300)
            c4 = q(page)
            log.w('   rotating back to L: button %s, a tap then moves on: %s' % (a2['btn'], str(c4 and (c4['gen'] != gen or c4['stepN'] > 0))))
            page.set_viewport_size({'width': 820, 'height': 1180}); page.wait_for_timeout(600)
        page.set_viewport_size({'width': 1180, 'height': 820}); page.wait_for_timeout(500)
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # 跳过 on a fresh question (no rotation): the next question comes
        gen, c = start(seed=11)
        sk = page.evaluate("() => { const s = document.querySelector('.stepskip'); if (!s) return null; const r = s.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width, r.height]; }")
        if sk: page.mouse.click(sk[0], sk[1])
        t0 = time.time()
        try:
            wait_next_question(page, gen, timeout=8000); dt = time.time() - t0
            said = page.evaluate("window.__speechLog.slice(-6).filter(e => e.ch === 'narr' && e.ev === 'speak').map(e => e.text)")
            log.check(sk and dt < 6, '跳过 (%s px): the next question comes in %.1f s, said %s' % (sk and [round(sk[2]), round(sk[3])], dt, said))
        except Exception as e:
            log.fail('跳过 did not move on: ' + str(e)[:100])
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # 1b rotate P->L while waiting (the button placed in portrait)
        page.set_viewport_size({'width': 820, 'height': 1180}); page.wait_for_timeout(400)
        gen, c = start(seed=12)
        a0 = page.evaluate(AUDIT)
        page.set_viewport_size({'width': 1180, 'height': 820}); page.wait_for_timeout(700)
        a1 = page.evaluate(AUDIT)
        page.screenshot(path=os.path.join(OUT, 'rotate_wait_PL.jpg'), type='jpeg', quality=55)
        ok1 = a1 and not a1.get('nobtn') and a1['btn']['r'] <= 1180 and a1['btn']['b'] <= 820 and a1['top'] and not [o for o in a1['ov'] if o[0] == 'opt' and o[1] > 100]
        log.check(ok1, 'rotate P->L while waiting: button on screen, on top, not over an option (before %s, after %s ov %s)' % (a0 and a0['btn'], a1 and a1['btn'], a1 and a1['ov']))
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # 2 background while waiting
        gen, c = start(seed=13)
        page.evaluate("""() => { Object.defineProperty(document, 'hidden', { get: () => true, configurable: true }); Object.defineProperty(document, 'visibilityState', { get: () => 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }""")
        page.wait_for_timeout(600)
        paused = page.evaluate("Session.G.scope.paused")
        page.evaluate("""() => { Object.defineProperty(document, 'hidden', { get: () => false, configurable: true }); Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }""")
        page.wait_for_timeout(300)
        a = page.evaluate(AUDIT)
        page.mouse.click(a['btn']['x'] + a['btn']['w'] / 2, a['btn']['y'] + a['btn']['h'] / 2)
        page.wait_for_timeout(400)
        c2 = q(page)
        log.check(paused and c2 and (c2['gen'] != gen or c2['stepN'] >= 1), 'background and back while waiting: paused=%s, then a tap moves on %s' % (paused, c2 and (c2['gen'] == gen, c2['stepN'])))
        beats, problems = step_loop(page, gen)
        wait_next_question(page, gen, timeout=20000)
        log.check(not problems, 'after the background the rest of the beats work %s' % problems)
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # 2b background DURING a tap-resolve: tap, hide at once, show
        gen, c = start(seed=14)
        a = page.evaluate(AUDIT)
        page.evaluate("""() => { const b = document.querySelector('.stepbtn'); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, clientX: 5, clientY: 5 })); b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1, clientX: 5, clientY: 5 }));
          Object.defineProperty(document, 'hidden', { get: () => true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }""")
        page.wait_for_timeout(500)
        page.evaluate("""() => { Object.defineProperty(document, 'hidden', { get: () => false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }""")
        beats, problems = step_loop(page, gen)
        try:
            wait_next_question(page, gen, timeout=20000); log.check(not problems, 'tap then background at once: the flow goes on after return %s' % problems)
        except Exception as e:
            log.fail('tap then background: stuck ' + str(e)[:80])
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # 3 home while waiting: nothing left behind
        gen, c = start(seed=15)
        page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        left = page.evaluate("[document.querySelectorAll('.stepbtn,.stepskip').length, document.querySelector('#map').classList.contains('on'), window.__q]")
        log.check(left[0] == 0 and left[1] and left[2] is None, 'home while waiting: map, no buttons left %s' % left[:2])
        page.evaluate("window.__go('bluey', 'bluey:find', 2, { seed: 4 })"); wait_phase(page, timeout=30000)
        left = page.evaluate("document.querySelectorAll('.stepbtn,.stepskip').length")
        log.check(left == 0, 'the next game starts without step buttons')
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # 4 the child: taps on cards, the stage, the host, 'skip' do not move it on; a long idle does not either (checked in sweep); hints do not fire
        gen, c = start(seed=16)
        n0 = page.evaluate("window.__q.stepN")
        for js in ("__gesture('tap', { id: 'card1' })", "__gesture('skip')", "gesture('relisten')"):
            page.evaluate(js); page.wait_for_timeout(150)
        page.mouse.click(590, 410); page.wait_for_timeout(150)
        for i in range(5): page.mouse.click(300 + i * 100, 300); page.wait_for_timeout(60)
        page.wait_for_timeout(1200)
        c2 = q(page)
        log.check(c2 and c2['gen'] == gen and c2['stepWaiting'] and c2['stepN'] == n0, 'the child taps cards / stage / host / skip: still waiting at the same beat %s' % str(c2 and (c2['stepN'], c2['stepWaiting'], c2['phase'])))
        hs = page.evaluate("window.__speechLog.slice(-4).map(e => [e.text, e.tag, e.ev])")
        log.w('   last speech after the child taps: ' + json.dumps(hs, ensure_ascii=False))
        beats, problems = step_loop(page, gen); wait_next_question(page, gen, timeout=20000)
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # 5 a long session: the 3-minute rule - does 一步一步 cut the game short? (Clock is faked forward)
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 17 })"); wait_phase(page, timeout=30000)
        page.evaluate("Clock.lost -= 200000")       # the parent talked for 200 s
        rounds = 0
        for i in range(6):
            cur = q(page)
            if not cur: break
            rounds += 1
            gen, snap = answer_question(page, 'right', timeout=30000)
            try: wait_next_question(page, gen, timeout=15000)
            except Exception: break
        mapon = page.evaluate("document.querySelector('#map').classList.contains('on') && !window.__q")
        log.w('   OBS a session that passed 3 minutes (a parent explaining slowly) ends after %d questions (map=%s)' % (rounds, mapon))
        page.wait_for_timeout(500)
        log.check(not page.errors, 'interrupt no page errors %s' % page.errors[:3])

    if PART == 'off':
        page = fresh(br, base, 1180, 820)
        set_ex(page, 'off')
        bad, res = [], []
        for isl, g, lv in (('peppa', 'peppa:find', 2), ('huluwa', 'huluwa:quiz', 3), ('s1', 's1:quiz', 2), ('hulk3', 'hulk3:en', 3), ('widow3', 'widow3:quiz', 2), ('robot2', 'robot2:quiz', 3), ('peppa', 'peppa:write', 2), ('s2', 's2:quiz', 2), ('thor3', 'thor3:quiz', 2)):
            page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 5 })", [isl, g, lv]); wait_phase(page, timeout=30000)
            s0 = page.evaluate("Session.G.stars")
            mark = page.evaluate("window.__speechLog.length")
            gen, cur = wrong_once(page)
            t0 = time.time()
            wait_next_question(page, gen, timeout=30000)
            dt = time.time() - t0
            rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
            said = page.evaluate(SAID, mark)
            rings = page.evaluate("document.querySelectorAll('.exring,[data-ex]').length")
            s1 = page.evaluate("Session.G.stars")
            res.append((g, round(dt, 1), said, rec and rec['ex'], rec and rec['ms']))
            if not rec or rec['ex'] or rec['ms'] > 300 or s1 != s0 or not any('[again]' in x for x in said) or rings:
                bad.append((g, said, rec and rec['ex'], rec and rec['ms'], s1 - s0, rings))
            page.evaluate("gesture('home')"); page.wait_for_timeout(100)
        log.w('   关: ' + json.dumps(res, ensure_ascii=False))
        log.check(not bad, '关: the factual line, then the closing line, a new question; no rings, no star %s' % bad[:4])
        # off at real speed: how long from the wrong tap to the new question
        page.evaluate("window.__fast = 0")
        page.evaluate("window.__go('peppa', 'peppa:find', 2, { seed: 8 })"); wait_phase(page, timeout=60000)
        gen, cur = wrong_once(page); t0 = time.time(); wait_next_question(page, gen, timeout=30000); dt = time.time() - t0
        log.w('   关 at real speed: %.1f s from the wrong tap to the next question' % dt)
        page.evaluate("window.__fast = 1"); page.evaluate("gesture('home')")
        # auto unchanged: a few games with rings and 2-5 s (test_options 03/05 do the rest)
        set_ex(page, 'auto')
        bad = []
        for isl, g, lv in (('peppa', 'peppa:find', 2), ('huluwa', 'huluwa:quiz', 3), ('hulk3', 'hulk3:en', 3)):
            page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 5 })", [isl, g, lv]); wait_phase(page, timeout=30000)
            gen, cur = wrong_once(page); wait_next_question(page, gen, timeout=30000)
            rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
            left = page.evaluate("document.querySelectorAll('.stepbtn,.stepskip').length")
            if not rec or not rec['ex'] or not rec['ex']['right'] or left: bad.append((g, rec and rec['ex'], left))
            page.evaluate("gesture('home')"); page.wait_for_timeout(100)
        log.check(not bad, '自动: gold ring, no step buttons %s' % bad)
        log.check(not page.errors, 'off no page errors %s' % page.errors[:3])

    if PART == 'teach':
        page = fresh(br, base, 1180, 820)
        SNAP = """() => { const s = JSON.parse(JSON.stringify(Store.s)); delete s.lastG; delete s.lastDay; for (const d in s.days) { delete s.days[d].ms; } return s; }"""
        def diff(a, b, path=''):
            out = []
            if isinstance(a, dict) and isinstance(b, dict):
                for k in set(a) | set(b):
                    if k not in a or k not in b: out.append(path + '/' + str(k) + ' added/removed')
                    else: out += diff(a[k], b[k], path + '/' + str(k))
            elif a != b: out.append('%s: %s -> %s' % (path, json.dumps(a, ensure_ascii=False)[:60], json.dumps(b, ensure_ascii=False)[:60]))
            return out
        # a save with some history: peppa:find has 12 stars (L3), peppa:write 7 stars, some memory
        page.evaluate("""() => { const w = Store.w('peppa'); w.gstars['peppa:find'] = 12; w.gstars['peppa:write'] = 7; w.stars = 19; w.played = ['peppa:find', 'peppa:write']; Store.s.lastG = null; Store.save(); }""")
        # the panel before any game: nothing to teach
        page.evaluate("Parent.open()")
        txt = page.evaluate("Array.from(document.querySelectorAll('#parent .mut')).map(d => d.textContent).find(x => /先让孩子/.test(x)) || ''")
        log.check('先让孩子' in txt, 'no last game: the panel asks to play one first')
        page.evaluate("Parent.close()")
        # the child plays 认字 normally (one question), goes home
        page.evaluate("window.__go('peppa', 'peppa:find', 0, { seed: 21 })"); wait_phase(page, timeout=30000)
        lv0 = q(page)['level']
        gen, snap = answer_question(page, 'right'); wait_next_question(page, gen)
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        before = page.evaluate(SNAP)
        # the parent opens the panel and picks 降一级
        page.evaluate("Parent.open()")
        r = page.evaluate("""() => ({ line: Array.from(document.querySelectorAll('#parent div')).map(d => d.textContent).find(x => x.startsWith('最近玩的')), bs: Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => [b.textContent, b.disabled, b.classList.contains('sel')]) })""")
        log.w('   panel: ' + json.dumps(r, ensure_ascii=False))
        log.check(r['line'] and '佩奇' in r['line'] and ('第 %d 级' % lv0) in r['line'] and r['bs'][0][0].startswith('降一级来教') and not r['bs'][0][1] and r['bs'][2][2], 'the panel names the last game and its level, 关 selected')
        page.screenshot(path=os.path.join(OUT, 'teach_panel_before.jpg'), type='jpeg', quality=60)
        page.click('#parent [data-teach="1"]'); page.wait_for_timeout(100)
        r2 = page.evaluate("""() => ({ line: Array.from(document.querySelectorAll('#parent div')).map(d => d.textContent).find(x => x.startsWith('最近玩的')), bs: Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => b.classList.contains('sel')), on: Teach.on })""")
        log.check(r2['bs'] == [True, False, False] and r2['on'] and r2['on']['drop'] == 1 and '已打开' in r2['line'], '降一级来教 selected: %s' % json.dumps(r2, ensure_ascii=False))
        page.screenshot(path=os.path.join(OUT, 'teach_panel_on.jpg'), type='jpeg', quality=60)
        page.evaluate("Parent.close()")
        # the child plays the same game through the island panel
        page.evaluate("() => { MapView.openPanel('peppa'); }"); page.wait_for_timeout(300)
        hit = page.evaluate("""() => { const b = Array.from(document.querySelectorAll('#map button, #map [data-gid]')).find(e => (e.dataset.gid || '') === 'game:peppa:find' || /认字|找/.test(e.textContent) && e.closest('.panel,#ipanel,#isl')); return b ? b.dataset.gid || b.className : null; }""")
        page.evaluate("() => { MapView.closePanel(true); Session.start('peppa', 'peppa:find'); }")
        wait_phase(page, timeout=30000)
        c = q(page)
        badge = page.evaluate("""() => { const b = document.querySelector('#teachb'); if (!b) return null; const r = b.getBoundingClientRect(); const t = document.querySelector('#tray').getBoundingClientRect(); const h = document.querySelector('#home').getBoundingClientRect(); const ov = (A, B) => Math.max(0, Math.min(A.right, B.right) - Math.max(A.left, B.left)) * Math.max(0, Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top)); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), text: b.textContent, color: getComputedStyle(b).backgroundColor, overTray: ov(r, t), overHome: ov(r, h), tray: [Math.round(t.left), Math.round(t.top), Math.round(t.right), Math.round(t.bottom)] }; }""")
        log.w('   badge ' + json.dumps(badge))
        log.check(c['teach'] == 1 and c['level'] == max(1, lv0 - 1), 'teach: the game runs one level lower (L%d -> L%d) teach=%s' % (lv0, c['level'], c['teach']))
        log.check(badge and badge['text'] == '教' and badge['overTray'] == 0 and badge['overHome'] == 0, 'the 教 badge is on, purple, beside the stars, not over them')
        page.screenshot(path=os.path.join(OUT, 'teach_game_L.jpg'), type='jpeg', quality=60)
        # all five right, one wrong in between: nothing counts
        kinds = []
        for i in range(6):
            cur = q(page)
            if not cur: break
            kinds.append((cur['kind'], cur['level'], cur['teach'], cur.get('retest')))
            gen, snap = answer_question(page, 'wrong' if i == 1 else 'right', timeout=30000)
            try: wait_next_question(page, gen, timeout=20000)
            except Exception: break
        page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=30000)
        after = page.evaluate(SNAP)
        d = diff(before, after)
        log.w('   questions in teach: ' + json.dumps(kinds, ensure_ascii=False))
        log.check(all(k[0] in ('find',) and k[2] == 1 for k in kinds) and len(kinds) == 5, 'teach: five island questions at the lowered level, no review card, no miss card %s' % kinds)
        log.check(not d, 'teach: after a whole game (4 right, 1 wrong) the save is unchanged: stars, level, played, Mem, learned, missNext, days.q %s' % d[:8])
        st = page.evaluate("[Teach.on, !!document.querySelector('#teachb'), Prog.level('peppa', 'peppa:find'), Store.w('peppa').gstars['peppa:find']]")
        log.check(st[0] is None and not st[1] and st[2] == lv0 and st[3] == 12, 'back on the map: 教一教 is off, badge gone, level and stars as before %s' % st)
        # the next normal game: normal level, no badge, stars count again
        page.evaluate("() => { Session.start('peppa', 'peppa:find', { seed: 22 }); }"); wait_phase(page, timeout=30000)
        c = q(page); b = page.evaluate("!!document.querySelector('#teachb')")
        gen, snap = answer_question(page, 'right'); wait_next_question(page, gen)
        s = page.evaluate("Store.w('peppa').gstars['peppa:find']")
        log.check(c['teach'] == 0 and c['level'] == lv0 and not b and s == 13, 'the game after: normal level %d, no badge, a star counts (%d)' % (c['level'], s))
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        # 降两级 on a game at L2 -> disabled; at L1 both disabled
        page.evaluate("() => { Store.w('peppa').gstars['peppa:find'] = 5; Store.save(); Parent.open(); }")
        bs = page.evaluate("Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => [b.textContent, b.disabled])")
        page.evaluate("Parent.close(); Store.w('peppa').gstars['peppa:find'] = 0; Store.save(); Parent.open();")
        bs1 = page.evaluate("Array.from(document.querySelectorAll('#parent [data-teach]')).map(b => [b.textContent, b.disabled])")
        note = page.evaluate("Array.from(document.querySelectorAll('#parent .mut')).map(d => d.textContent).find(x => /第 1 级/.test(x)) || ''")
        page.evaluate("Parent.close()")
        log.check(bs[0][1] is False and bs[1][1] is True and bs1[0][1] is True and bs1[1][1] is True and '不能再降' in note, 'L2: only 降一级; L1: both disabled with a note %s %s' % (bs, bs1))
        # teach on a writing game: no learned(), no Mem, no fallback; a wrong stroke recorded nowhere
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
        log.check(c['teach'] == 1 and c['kind'] == 'write' and not d, 'teach on 写字 (L%d): a whole game leaves the save untouched (no learned, no Mem, no 描红 fallback) %s' % (c['level'], d[:6]))
        # teach armed for game A, the child plays game B: B is normal; A still armed (observation)
        page.evaluate("() => { Store.s.lastG = ['peppa', 'peppa:find']; Teach.on = { isl: 'peppa', game: 'peppa:find', drop: 1 }; }")
        page.evaluate("() => { Session.start('peppa', 'peppa:quiz', { seed: 24 }); }"); wait_phase(page, timeout=30000)
        c = q(page); page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        still = page.evaluate("Teach.on")
        log.w('   OBS teach armed for 认字, the child plays 挑战 instead: 挑战 teach=%s; after leaving it Teach.on=%s' % (c['teach'], json.dumps(still)))
        # the key round while teach is armed for the same island's find game
        page.evaluate("() => { Session.start('peppa', 'peppa:find', { key: true, keyItems: ['人', '口'] }); }"); wait_phase(page, timeout=30000)
        c = q(page); page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        log.check(c['teach'] == 0 and c['kind'] == 'review', 'the key round is never a teach game (teach=%s)' % c['teach'])
        # a done game (✓, 25 stars, L5) taught two levels down: no fullTray, no change
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
        # a reload ends it
        page.evaluate("Teach.on = { isl: 'peppa', game: 'peppa:find', drop: 1 }")
        page.reload(); page.wait_for_function('window.__ready === true', timeout=20000)
        log.check(page.evaluate("Teach.on") is None, 'OBS a reload ends 教一教 (not saved)')
        # the badge at the other two sizes, with 一步一步 on as well
        page.context.close()
        for vw, vh, tag in ((820, 1180, 'P'), (1024, 768, 'L2')):
            page = fresh(br, base, vw, vh)
            set_ex(page, 'step')
            page.evaluate("() => { Store.w('hulk3').gstars['hulk3:quiz'] = 10; Store.save(); Store.s.lastG = ['hulk3', 'hulk3:quiz']; Teach.on = { isl: 'hulk3', game: 'hulk3:quiz', drop: 1 }; }")
            page.evaluate("() => { Session.start('hulk3', 'hulk3:quiz', { seed: 26 }); }"); wait_phase(page, timeout=30000)
            c = q(page)
            badge = page.evaluate("""() => { const b = document.querySelector('#teachb'); if (!b) return null; const r = b.getBoundingClientRect(); const t = document.querySelector('#tray').getBoundingClientRect(); const ov = (A, B) => Math.max(0, Math.min(A.right, B.right) - Math.max(A.left, B.left)) * Math.max(0, Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top)); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), overTray: ov(r, t), under: h && (h.id || h.className || h.tagName) }; }""")
            gen, cur = wrong_once(page)
            beats, problems = step_loop(page, gen, shot='teach_step_' + tag)
            wait_next_question(page, gen, timeout=30000)
            log.check(c['teach'] == 1 and c['level'] == 2 and badge and badge['overTray'] == 0 and not problems, '%s teach + 一步一步 on 数一数: L%d, badge %s, beats %d %s' % (tag, c['level'], badge, len(beats), problems))
            page.evaluate("gesture('home')")
            log.check(not page.errors, '%s no page errors %s' % (tag, page.errors[:3]))
            page.context.close()

    if PART == 'key':
        # the key round and the review cards inside a game, in 一步一步; the missed-item card
        page = fresh(br, base, 1180, 820)
        set_ex(page, 'step')
        bad, out = [], []
        for isl, items in (('hulk3', ['人', 'A', '我']), ('peppa2', ['是', 'M'])):
            g0 = page.evaluate("window.__qn || 0")
            page.evaluate("([i, items]) => { Session.start(i, i + ':find', { key: true, keyItems: items }); }", [isl, items])
            wait_phase(page, timeout=30000, gen=g0)
            for k in items:
                try:
                    gen, cur = wrong_once(page)
                    beats, problems = step_loop(page, gen, shot='key_%s_%s' % (isl, k))
                    page.wait_for_function("(g) => !window.__q || window.__q.gen !== g", arg=gen, timeout=30000)
                    rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
                    out.append((isl, k, cur['kind'], len(beats), [b['said'] for b in beats]))
                    if cur['kind'] != 'review' or len(beats) < 2 or problems or not rec or not rec['ex'] or not rec['ex']['right']: bad.append((isl, k, cur['kind'], len(beats), problems))
                except Exception as e:
                    bad.append((isl, k, 'ERR ' + str(e)[:100])); break
            try:
                page.wait_for_function("document.querySelector('#map').classList.contains('on') && !window.__q", timeout=30000)
            except Exception:
                page.evaluate("gesture('home')")
            page.wait_for_timeout(300)
        log.w('   key: ' + json.dumps(out, ensure_ascii=False))
        log.check(not bad, 'the key round in 一步一步: every review card (character, letter, function word) stops at each beat, gold ring %s' % bad[:4])
        got = page.evaluate("Store.s.key.got")
        log.w('   keys got after the two key rounds: %s' % got)
        # a wrong answer in a normal game -> the missed card two questions later, in step mode
        page.evaluate("window.__go('bluey', 'bluey:find', 2, { seed: 41 })"); wait_phase(page, timeout=30000)
        gen, cur = wrong_once(page); beats, problems = step_loop(page, gen); wait_next_question(page, gen, timeout=30000)
        kinds = []
        for i in range(4):
            cur = wait_phase(page, timeout=30000)
            kinds.append(cur['kind'])
            if cur['kind'] == 'review':
                gen, cur2 = wrong_once(page); beats2, problems2 = step_loop(page, gen, shot='miss_card'); wait_next_question(page, gen, timeout=30000)
                log.check(len(beats2) >= 2 and not problems2, 'the missed-item card (再来一个) in 一步一步: %d beats %s %s' % (len(beats2), [b['said'] for b in beats2], problems2))
                break
            gen, snap = answer_question(page, 'right'); wait_next_question(page, gen, timeout=30000)
        log.w('   kinds after the wrong answer: %s' % kinds)
        page.evaluate("gesture('home')")
        log.check(not page.errors, 'key no page errors %s' % page.errors[:3])

    br.close()
sys.exit(0 if log.close() else 1)
