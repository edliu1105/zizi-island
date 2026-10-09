# -*- coding: utf-8 -*-
"""The live site, Chromium and WebKit (the iPad engine): the page and its assets load, the map shows, a find game and a
writing game play through a question (also four games of the rainbow sea's hero islands), the treasure book opens; Chromium: the service worker precaches every asset.
usage: python tests/smoke_live.py [url]"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import new_page, enter, wait_phase, step, q, Log
URL = sys.argv[1] if len(sys.argv) > 1 else 'https://edliu1105.github.io/zizi-island/'
log = Log('smoke_live')
with sync_playwright() as p:
    for eng in ('chromium', 'webkit'):
        br = getattr(p, eng).launch()
        page = new_page(br, URL, 1180, 820, sw='allow' if eng == 'chromium' else 'block')
        enter(page); page.wait_for_timeout(1500)
        log.check(page.evaluate("MapView.built && Screens.cur === 'map'"), '%s: the map' % eng)
        for isl, g in (('peppa', 'peppa:find'), ('peppa', 'peppa:write'), ('bluey', 'bluey:abc'), ('robot', 'robot:quiz'), ('hulk3', 'hulk3:find'), ('thor3', 'thor3:quiz'), ('widow3', 'widow3:en'), ('hawk3', 'hawk3:find')):
            page.evaluate("([i, g]) => window.__go(i, g, 2, {seed: 9})", [isl, g])
            wait_phase(page, timeout=40000)
            gen = q(page)['gen']
            for _ in range(20):
                cur = q(page)
                if not cur or cur['gen'] != gen or cur['submitted']:
                    break
                if cur['phase'] not in ('act', 'ready', 'input'):
                    page.wait_for_timeout(30); continue
                step(page, 'right'); page.wait_for_timeout(30)
            page.wait_for_function("([g]) => !window.__q || window.__q.gen !== g", arg=[gen], timeout=40000)
            log.check(page.evaluate("([i, g]) => Prog.stars(i, g)", [isl, g]) == 1, '%s: %s - one question right, one star' % (eng, g))
            page.evaluate("gesture('home')"); page.wait_for_timeout(300)
        page.evaluate("Book.open()"); page.wait_for_timeout(600)
        log.check(page.evaluate("document.querySelectorAll('#book .tile').length") > 50, '%s: the treasure book' % eng)
        if eng == 'chromium':
            ok = False
            for _ in range(90):
                n = page.evaluate("""async () => { for (const k of await caches.keys()) { if (!k.startsWith('zzi-assets-')) continue; const m = await (await caches.open(k)).match('./__zzi_meta.json'); if (m) return Object.keys(await m.json()).length; } return 0; }""")
                if n:
                    ok = True; break
                page.wait_for_timeout(2000)
            log.check(ok, 'chromium: the service worker precached every asset (%s)' % n)
        log.check(not page.errors, '%s: no errors %s' % (eng, page.errors[:4]))
        br.close()
sys.exit(0 if log.close() else 1)
