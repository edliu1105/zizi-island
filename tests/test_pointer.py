# -*- coding: utf-8 -*-
"""Real pointers (mouse moves through the app's own input pipeline), both orientations:
 - writing: characters and letters written stroke by stroke along their strokes (a steady and a wobbly hand) finish
 - writing a stroke backwards is caught (a slip), the character still finishes afterwards
 - the find games: a click on the right target is taken (nothing covers it)
usage: python tests/test_pointer.py"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, Log

log = Log('pointer')
FORCE = """([g, k]) => { const G = GAMES[g]; if (!G.__gen0) G.__gen0 = G.gen; G.gen = () => ({ k: [k, Math.random()], answer: k }); }"""
UNFORCE = """(g) => { const G = GAMES[g]; if (G.__gen0) { G.gen = G.__gen0; delete G.__gen0; } }"""


def draw(page, pts, wob):
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


def expected_screen(page, rev=False):
    return page.evaluate("(rev) => { const w = Session.st && Session.st.w; if (!w || w.done) return null; return w.expected(rev).map(([x, y]) => { const s = Stage.toScreen(x, y); return [s.x, s.y]; }); }", rev)


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    for ori, vw, vh in (('L', 1180, 820), ('P', 820, 1180)):
        page = new_page(br, base, vw, vh)
        enter(page)
        for g, ks in (('peppa:write', '人口手'), ('huluwa:write', '山水火'), ('xiyou:write', '马鸟'), ('robot:write', '灯伞'), ('pj:write', '雨电'), ('robot2:write', '汤'), ('hulk3:write', '一二'), ('thor3:write', '八十'), ('panther3:write', '白红'), ('widow3:write', '妈弟'), ('hawk3:write', '走来'), ('peppa:abc', 'ABC'), ('bluey:abc', 'G'), ('ultra:abc', 'W'), ('peppa2:abc', 'abd'), ('pj:abc', 'jk'), ('xiyou2:abc', 'u')):
            for wob in (0, 7):
                bad = []
                for k in ks:
                    page.evaluate(FORCE, [g, k])
                    isl = g.split(':')[0]
                    page.evaluate("([i, g]) => window.__go(i, g, 3, {seed: 2})", [isl, g])
                    wait_phase(page, timeout=30000); page.wait_for_timeout(100)
                    page.evaluate("() => { window.__tr = Session.st; }")
                    for _ in range(12):
                        pts = expected_screen(page)
                        if not pts:
                            break
                        draw(page, pts, wob); page.wait_for_timeout(40)
                    r = page.evaluate("() => { const st = window.__tr; return { done: st.w.done, k: st.w.k, n: st.w.strokes.length, slips: st.w.slips }; }")
                    if not r['done'] or r['slips']:
                        bad.append((k, r))
                    page.evaluate("gesture('home')"); page.wait_for_timeout(150)
                    page.evaluate(UNFORCE, g)
                log.check(not bad, '%s %s %s hand: %s written to the end with no slip %s' % (ori, g, 'wobbly' if wob else 'steady', ks, bad))
        # backwards = a slip; then the right way finishes it
        page.evaluate(FORCE, ['peppa:write', '口'])
        page.evaluate("window.__go('peppa', 'peppa:write', 3, {seed: 2})"); wait_phase(page, timeout=30000); page.wait_for_timeout(100)
        page.evaluate("() => { window.__tr = Session.st; }")
        draw(page, expected_screen(page, True), 0); page.wait_for_timeout(60)
        slip = page.evaluate("window.__tr.w.slips")
        for _ in range(12):
            pts = expected_screen(page)
            if not pts:
                break
            draw(page, pts, 0); page.wait_for_timeout(40)
        r = page.evaluate("({ done: window.__tr.w.done, slips: window.__tr.w.slips })")
        log.check(slip == 1 and r['done'], '%s a stroke written backwards is a slip, the character is then finished %s' % (ori, r))
        page.evaluate("gesture('home')"); page.evaluate(UNFORCE, 'peppa:write'); page.wait_for_timeout(150)
        # the find games: a real click on the right one
        for isl in page.evaluate("ORDER.w1.concat(ORDER.w2)"):
            g = isl + ':find'
            page.evaluate("([i, g]) => window.__go(i, g, 3, {seed: 4})", [isl, g])
            wait_phase(page, timeout=30000); page.wait_for_timeout(250)
            s = page.evaluate("window.__next('right')")
            gen = page.evaluate("window.__q.gen")
            if s['g'] == 'tap':
                page.mouse.click(s['at']['x'], s['at']['y'])
            else:
                page.mouse.move(s['at']['x'], s['at']['y']); page.mouse.down()
                for t in range(1, 15):
                    page.mouse.move(s['at']['x'] + (s['to']['x'] - s['at']['x']) * t / 14, s['at']['y'] + (s['to']['y'] - s['at']['y']) * t / 14)
                page.mouse.up()
            page.wait_for_timeout(200)
            sub = page.evaluate("([gen]) => { const q = window.__q; return !q || q.gen !== gen || q.submitted; }", [gen])
            ok = page.evaluate("Session.st ? Session.st.ok !== false : true")
            log.check(sub and ok, '%s %s: a real %s on the right one is taken' % (ori, g, s['g']))
            page.evaluate("gesture('home')"); page.wait_for_timeout(150)
        log.check(not page.errors, '%s no page errors %s' % (ori, page.errors[:3]))
        page.context.close()
    br.close()
sys.exit(0 if log.close() else 1)
