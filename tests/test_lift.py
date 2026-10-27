# -*- coding: utf-8 -*-
"""误触 (client 2026-10-26: "the finger came off for a moment and it said he wrote it wrong"; "the paper shrinks when the pen
touches it"). With the real mouse through the app's input and the real waiting time for the finger to come back:
 01 the writing paper does not shrink under the finger (no press scale): the ink stays where it is written
 02 a tap first (the finger landing, a touch too small to be a stroke), then the stroke: taken, no slip
 03 the finger comes off in the middle of a stroke and goes on from there: the two pieces are one stroke, no slip
 04 the finger comes off near the end (the first piece is already right) and finishes it: one stroke taken, not two, no slip
 05 a really wrong stroke (backwards) is still a slip - after the short wait
 06 a wrong piece and then the right stroke at once: one slip, the right one taken (joining never hurts)
 07 the system cuts the touch (pointercancel): what was written counts and goes on; cut alone it is no slip
 08 a palm resting on the paper does not block the finger that writes
usage: python tests/test_lift.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, Log

log = Log('lift')
LIFT = 600
FORCE = """([g, k]) => { const G = GAMES[g]; if (!G.__gen0) G.__gen0 = G.gen; G.gen = () => ({ k: [k, Math.random()], answer: k }); }"""


def dense(pts, step=6):
    out = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(1, int(((x1 - x0) ** 2 + (y1 - y0) ** 2) ** 0.5 / step))
        out += [(x0 + (x1 - x0) * m / n, y0 + (y1 - y0) * m / n) for m in range(n)]
    return out + [tuple(pts[-1])]


def draw(page, pts, up=True):
    d = dense(pts)
    page.mouse.move(*d[0]); page.mouse.down()
    for x, y in d[1:]:
        page.mouse.move(x, y)
    if up:
        page.mouse.up()


def exp(page, rev=False):
    return page.evaluate("(rev) => { const w = Session.st && Session.st.w; if (!w || w.done) return null; return w.expected(rev).map(([x, y]) => { const s = Stage.toScreen(x, y); return [s.x, s.y]; }); }", rev)


def state(page):
    return page.evaluate("() => { const w = Session.st.w; return { k: w.k, slips: w.slips, pend: !!w.pend }; }")


def fresh(page, k='口', g='peppa:write'):
    page.evaluate(FORCE, [g, k])
    page.evaluate("([i, g]) => window.__go(i, g, 3, {seed: 2})", [g.split(':')[0], g])
    wait_phase(page, timeout=30000)
    page.wait_for_timeout(150)


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820, extra_init='window.__liftMs = %d;' % LIFT)
    enter(page)
    page.evaluate("() => { window.__wmode = 'trace'; }")
    said = "Voice.sayNow = ((f) => function (t, o) { (window.__slip = window.__slip || []).push([t, o && o.tag]); return f.call(this, t, o); })(Voice.sayNow); 0"
    page.evaluate(said)
    # 01 the paper under the finger
    fresh(page)
    pts = exp(page)
    b0 = page.evaluate("() => { const r = Session.st.w.el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }")
    page.mouse.move(*pts[0]); page.mouse.down(); page.mouse.move(pts[1][0], pts[1][1]); page.wait_for_timeout(250)
    b1 = page.evaluate("() => { const r = Session.st.w.el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height, getComputedStyle(Session.st.w.el).transform]; }")
    for x, y in dense(pts)[1:]:
        page.mouse.move(x, y)
    page.mouse.up(); page.wait_for_timeout(100)
    log.check(all(abs(a - b) < 0.5 for a, b in zip(b0, b1[:4])) and b1[4] in ('none', ''), '01 the paper keeps its size and place while the finger writes %s -> %s' % (b0, b1))
    log.check(state(page)['k'] == 1 and state(page)['slips'] == 0, '01 the stroke written on it is taken %s' % state(page))
    # 02 a tap, then the stroke
    fresh(page)
    pts = exp(page)
    page.mouse.click(pts[0][0] + 3, pts[0][1] + 2); page.wait_for_timeout(120)
    draw(page, pts); page.wait_for_timeout(100)
    s = state(page); page.wait_for_timeout(LIFT + 200); s2 = state(page)
    log.check(s['k'] == 1 and s2['slips'] == 0, '02 a tap first, then the stroke: taken, no slip %s %s' % (s, s2))
    # 03 off in the middle, on from there (横折 of 口: the 横, a lift at the corner, the 折)
    fresh(page)
    draw(page, exp(page)); page.wait_for_timeout(80)                  # 竖
    pts = exp(page)                                                    # 横折
    draw(page, pts[:7]); page.wait_for_timeout(180)
    mid = state(page)
    draw(page, pts[6:]); page.wait_for_timeout(LIFT + 200)
    s = state(page)
    log.check(mid['pend'] and mid['slips'] == 0 and s['k'] == 2 and s['slips'] == 0, '03 横折 in two pieces (lift at the corner): one stroke, no slip (waiting %s, then %s)' % (mid, s))
    # 04 off near the end: the first piece is right already, the rest goes on from it
    fresh(page, '人')
    pts = exp(page)                                                    # 撇
    draw(page, pts[:12]); page.wait_for_timeout(120)
    a = state(page)
    draw(page, pts[11:]); page.wait_for_timeout(LIFT + 200)
    s = state(page)
    log.check(s['k'] == 1 and s['slips'] == 0, '04 撇 lifted near its end and finished: one stroke (k %s -> %s), no slip' % (a['k'], s))
    # 05 a really wrong stroke is still a slip, after the wait
    fresh(page)
    page.evaluate("window.__slip = []")
    draw(page, exp(page, True)); page.wait_for_timeout(100)
    early = state(page)
    page.wait_for_timeout(LIFT + 250)
    s = state(page); sl = page.evaluate("(window.__slip || []).filter(x => x[1] === 'slip').map(x => x[0])")
    log.check(early['slips'] == 0 and s['slips'] == 1 and s['k'] == 0 and sl, '05 a backwards stroke: a slip after the wait %s -> %s %s' % (early, s, sl))
    # 06 wrong, then right at once (the right one starts where the backwards one ended)
    fresh(page)
    draw(page, exp(page, True)); page.wait_for_timeout(120)
    draw(page, exp(page)); page.wait_for_timeout(LIFT + 200)
    s = state(page)
    log.check(s['slips'] == 1 and s['k'] == 1, '06 a backwards stroke then the right one: one slip, the right one taken %s' % s)
    # 07 the system cuts the touch: it counts and goes on; cut alone is no slip
    fresh(page)
    pts = exp(page)
    draw(page, pts[:7], up=False)
    page.evaluate("window.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1, bubbles: true }))")
    page.mouse.up(); page.wait_for_timeout(150)
    draw(page, pts[6:]); page.wait_for_timeout(LIFT + 200)
    s = state(page)
    log.check(s['k'] == 1 and s['slips'] == 0, '07 cut in the middle and written on: one stroke, no slip %s' % s)
    pts = exp(page)
    draw(page, pts[:6], up=False)
    page.evaluate("window.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1, bubbles: true }))")
    page.mouse.up(); page.wait_for_timeout(LIFT + 250)
    s = state(page)
    log.check(s['k'] == 1 and s['slips'] == 0, '07 cut and nothing more: no slip, the same stroke still to write %s' % s)
    # 08 a palm resting on the paper
    fresh(page)
    pts = exp(page)
    c = page.evaluate("() => { const r = Session.st.w.el.getBoundingClientRect(); return [r.x + r.width * 0.85, r.y + r.height * 0.9]; }")
    page.evaluate("([x, y]) => document.elementFromPoint(x, y).dispatchEvent(new PointerEvent('pointerdown', { pointerId: 7, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, isPrimary: false }))", c)
    draw(page, pts); page.wait_for_timeout(100)
    page.evaluate("([x, y]) => window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 7, pointerType: 'touch', clientX: x, clientY: y, bubbles: true }))", c)
    page.wait_for_timeout(LIFT + 200)
    s = state(page)
    log.check(s['k'] == 1 and s['slips'] == 0, '08 a palm resting on the paper: the finger still writes, no slip %s' % s)
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
