# -*- coding: utf-8 -*-
"""Quick local smoke: the page boots, the map shows, and every game of every island plays a few questions right
(through window.__next / __gesture), both orientations; screenshots of each game's first question -> tests/logs/shots/
usage: python tests/smoke_local.py [islands,comma] [L|P]"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, step, q

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs', 'shots')
os.makedirs(OUT, exist_ok=True)
ONLY = sys.argv[1].split(',') if len(sys.argv) > 1 and sys.argv[1] else None
ORI = sys.argv[2] if len(sys.argv) > 2 else 'L'

with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    vw, vh = (1180, 820) if ORI == 'L' else (820, 1180)
    page = new_page(br, base, vw, vh)
    enter(page)
    page.wait_for_timeout(800)
    page.screenshot(path=os.path.join(OUT, '%s_map.png' % ORI))
    isl = page.evaluate('ORDER.w1.concat(ORDER.w2)')
    bad = []
    for i in isl:
        if ONLY and i not in ONLY:
            continue
        for g in page.evaluate('(i) => ISL[i].games', i):
            try:
                page.evaluate('([i, g]) => window.__go(i, g, 2, {seed: 7})', [i, g])
                st = wait_phase(page, timeout=25000)
                page.wait_for_timeout(300)
                page.screenshot(path=os.path.join(OUT, '%s_%s.png' % (ORI, g.replace(':', '_'))))
                ok = 0
                for k in range(60):
                    cur = q(page)
                    if not cur:
                        break
                    if cur['phase'] not in ('act', 'ready', 'input'):
                        page.wait_for_timeout(60)
                        continue
                    r = step(page, 'right')
                    if r is None:
                        page.wait_for_timeout(60)
                    ok += 1
                    if ok > 25:
                        break
                stars = page.evaluate('([i, g]) => Prog.stars(i, g)', [i, g])
                print(g, 'steps', ok, 'stars', stars, 'errors', page.errors[-2:])
                if page.errors:
                    bad.append((g, page.errors[-3:])); page.errors.clear()
            except Exception as e:
                print('FAIL', g, str(e)[:200], page.errors[-3:])
                bad.append((g, str(e)[:120])); page.errors.clear()
            page.evaluate("gesture('home')")
            page.wait_for_timeout(300)
    print('BAD', bad)
    br.close()
