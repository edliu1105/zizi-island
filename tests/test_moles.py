# -*- coding: utf-8 -*-
"""地鼠钻出来 (神笔海 ①-1; client 2026-11-10: "I hit it, but it never passes"). At real speed, with the real mouse:
 01 a hit is the finger coming down: the answer is in before the finger goes up - and it earns its star
 02 a mole on its way down, still seen, is hit: it is caught (up again), right, a star
 03 waiting for the right mole never costs the star: however long it took to come up (longer than the 2nd hint's time), no
    2nd hint was given and the first hit earns the star
 04 stuck is: the right mole went down twice without a tap. Not before, then the 2nd hint (its hole lights up before it
    comes) - and the hit after it earns no star (the rule: no star after real help)
 05 a mole that is down (not seen) cannot be hit; an empty hole does nothing
usage: python tests/test_moles.py"""
import os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, Log

log = Log('moles')
POLL = """() => { const st = Session.st; if (!st || Screens.cur !== 'game') return { map: Screens.cur !== 'game' };
    if (!['ready','act','input'].includes(st.phase) || st.submitted || !st.cards) return { gen: st.gen, busy: 1 };
    if (!st.__t0) st.__t0 = performance.now();
    const ai = st.opts.indexOf(st.q.answer), up = !!st.up[ai]; let c = null, since = 0;
    if (up) { if (!st.__up) { st.__up = performance.now(); if (!st.__first) st.__first = Math.round(performance.now() - st.__t0); } since = performance.now() - st.__up;
      const r = st.cards[ai].getBoundingClientRect(); c = [r.left + r.width / 2, r.top + r.height * 0.45]; } else st.__up = 0;
    return { gen: st.gen, ai, c, since, first: st.__first || 0, missed: st.missed, assists: st.assists.slice(), stars: Prog.stars('ultra4', st.G.id), flash: !!st.flashNext }; }"""
STARS = "Prog.stars('ultra4', ISL.ultra4.games[0])"


def start(br, base, lv, seed, hint_scale=None):
    page = new_page(br, base, 1180, 820, fast=False, hint_scale=hint_scale, sw='block'); enter(page); page.wait_for_timeout(1200)
    page.evaluate("([lv, seed]) => window.__go('ultra4', ISL.ultra4.games[0], lv, {seed})", [lv, seed])
    page.wait_for_function("Screens.cur === 'game' && Session.st && Session.st.cards", timeout=60000)
    return page


def right_up(page, timeout=40, skip=False, last=None):
    """wait until the right mole of a question (not `last`) has been up for 250 ms; skip: the moles' pauses are cut short"""
    t = time.time() + timeout
    while time.time() < t:
        s = page.evaluate(POLL)
        if s.get('map'):
            return None
        if not s.get('busy') and s['gen'] != last and s.get('c') and s['since'] >= 250:
            return s
        if skip and not s.get('busy') and not s.get('c'):
            page.evaluate("Session.st && Session.st.skip && Session.st.skip()")
        page.wait_for_timeout(30)
    return None


def next_q(page, gen, timeout=25):
    """the star (if any) is in when the next question is there, or the map"""
    t = time.time() + timeout
    while time.time() < t:
        s = page.evaluate("() => ({ gen: Session.st ? Session.st.gen : -1, map: Screens.cur !== 'game' })")
        if s['map'] or s['gen'] != gen:
            return
        page.wait_for_timeout(100)


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()

    # 01 the finger coming down is the hit
    page = start(br, base, 1, 21)
    s = right_up(page)
    if not s:
        log.fail('01 the right mole never came up')
    else:
        page.mouse.move(*s['c']); page.mouse.down()
        page.wait_for_timeout(60)
        a = page.evaluate("() => ({ gen: Session.st.gen, sub: !!Session.st.submitted })")
        page.wait_for_timeout(700); page.mouse.up()            # a slow finger: it stays down while the mole would go
        next_q(page, s['gen'])
        log.check(a['gen'] == s['gen'] and a['sub'] and page.evaluate(STARS) == s['stars'] + 1,
                  '01 the answer is in with the finger still down, and the star is earned (in %s, stars %d -> %d)' % (a['sub'], s['stars'], page.evaluate(STARS)))

        # 02 hit on its way down
        s2 = right_up(page, last=s['gen'])
        if not s2:
            log.fail('02 the right mole of the next question never came up')
        else:
            page.evaluate("Session.st.skip()")                 # its time is up: it goes down now
            pt = None
            for _ in range(200):
                pt = page.evaluate("""() => { const st = Session.st, ai = st.opts.indexOf(st.q.answer), d = st.cards[ai];
                    if (st.up[ai] || !st.seen[ai]) return null;
                    const an = d.getAnimations(); if (!an.length) return null;
                    an.forEach(a => { a.pause(); a.currentTime = 90; });                 /* held half way down */
                    const r = d.getBoundingClientRect(), b = d.parentNode.getBoundingClientRect();
                    return { x: r.left + r.width / 2, y: (Math.max(r.top, b.top) + b.bottom) / 2, top: r.top - b.top, h: b.height }; }""")
                if pt:
                    break
                page.wait_for_timeout(10)
            if not pt:
                log.fail('02 the mole was not caught going down by the test')
            else:
                page.mouse.move(pt['x'], pt['y']); page.mouse.down(); page.wait_for_timeout(60)
                a = page.evaluate("() => { const st = Session.st, ai = st.opts.indexOf(st.q.answer); return { gen: st.gen, sub: !!st.submitted, up: !!st.up[ai], ans: st.opts[st.tapped] === st.q.answer }; }")
                page.mouse.up()
                next_q(page, s2['gen'])
                log.check(a['gen'] == s2['gen'] and a['sub'] and a['up'] and a['ans'] and page.evaluate(STARS) == s2['stars'] + 1,
                          '02 a mole half way down (%d of %d px) is hit: caught, up again, right, a star %s (stars %d -> %d)' % (pt['top'], pt['h'], a, s2['stars'], page.evaluate(STARS)))
    page.context.close()

    # 03 waiting never costs the star (hints 6.7 times faster: the 2nd hint's time is 1.5 s, level 3: X may be the 5th mole)
    page = start(br, base, 3, 23, hint_scale=0.15)
    waited, bad, last = [], [], None
    for n in range(7):
        s = right_up(page, last=last)
        if not s:
            break
        page.mouse.move(*s['c']); page.mouse.down(); page.wait_for_timeout(50); page.mouse.up()
        page.wait_for_timeout(100)
        a = page.evaluate("() => ({ gen: Session.st.gen, sub: !!Session.st.submitted, assists: Session.st.assists.slice() })")
        next_q(page, s['gen']); last = s['gen']
        got = page.evaluate(STARS) - s['stars']
        if s['first'] >= 2500:                                 # he waited longer than the 2nd hint's time (1.5 s) and the 3rd's
            waited.append(round(s['first'] / 1000, 1))
            if not a['sub'] or got != 1 or any(x.startswith(('hint2', 'hint3')) for x in a['assists']):
                bad.append((s['first'], a['assists'], got))
        if page.evaluate(STARS) >= 5:
            break
    log.check(len(waited) >= 2 and not bad, '03 %d right moles came up after %s s of waiting (the 2nd hint at 1.5 s): none got the 2nd hint, each hit earned its star %s' % (len(waited), waited, bad))
    page.context.close()

    # 04 stuck = the right mole went down twice without a tap: then the help, and no star after it
    page = start(br, base, 1, 25, hint_scale=0.15)
    s = right_up(page)
    early, t_end = None, time.time() + 60
    while s and time.time() < t_end:                           # let it go by twice (the pauses cut short)
        st = page.evaluate(POLL)
        if st.get('map') or st.get('busy'):
            page.wait_for_timeout(40); continue
        if st['missed'] == 1 and early is None:
            page.wait_for_timeout(2600)                        # once missed, and well past the hint times: still no 2nd hint
            st = page.evaluate(POLL); early = [x for x in st['assists'] if x.startswith(('hint2', 'hint3'))]
        if st['missed'] >= 2:
            break
        page.evaluate("Session.st && Session.st.skip && Session.st.skip()")
        page.wait_for_timeout(120)
    hint2 = False
    for _ in range(60):                                        # now the 2nd hint comes
        st = page.evaluate(POLL)
        if any(x.startswith('hint2') for x in st.get('assists', [])):
            hint2 = True
            break
        page.wait_for_timeout(100)
    log.check(early == [] and hint2, '04a missed once: no 2nd hint yet %s; missed twice: the 2nd hint comes (%s)' % (early, hint2))
    s = right_up(page, timeout=40, skip=True)
    if not s:
        log.fail('04b the right mole did not come again')
    else:
        page.mouse.move(*s['c']); page.mouse.down(); page.wait_for_timeout(50); page.mouse.up()
        page.wait_for_timeout(100)
        a = page.evaluate("() => ({ sub: !!Session.st.submitted, ok: Session.st.opts[Session.st.tapped] === Session.st.q.answer })")
        next_q(page, s['gen'])
        log.check(a['sub'] and a['ok'] and page.evaluate(STARS) == s['stars'], '04b the hit after the help is right and earns no star (stars %d -> %d)' % (s['stars'], page.evaluate(STARS)))

    # 05 a mole that is down cannot be hit
    s = right_up(page, last=s['gen'] if s else None)
    if not s:
        log.fail('05 no question')
    else:
        r = page.evaluate("""() => { const st = Session.st, i = st.up.findIndex((u, k) => !u && !st.seen[k]); const d = st.cards[i];
            return { r: window.__gesture('tap', { id: 'card' + i }), sub: !!st.submitted, hidden: d.isConnected ? getComputedStyle(d).visibility : 'not on the page' }; }""")
        log.check(r['r'] == 'ignored' and not r['sub'] and r['hidden'] in ('hidden', 'not on the page'), '05 a mole that is down is not seen and cannot be hit %s' % r)
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
