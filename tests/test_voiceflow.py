# -*- coding: utf-8 -*-
"""At real speed: the first question of every game (with its first-meeting "字从画里来" where it comes) - no sentence is
dropped by the voice queue (it keeps the newest three), the question itself is said, and nothing said lacks a
recording. usage: python tests/test_voiceflow.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, Log
log = Log('voiceflow')
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820, fast=False); enter(page); page.wait_for_timeout(2500)
    games = page.evaluate("ORDER.w1.concat(ORDER.w2).flatMap(i => ISL[i].games.map(g => [i, g]))")
    for isl, g in games:
        page.evaluate("window.__speechLog.length = 0")
        page.evaluate("([i, g]) => window.__go(i, g, 0, {seed: 5})", [isl, g])
        try:
            page.wait_for_function("window.__q && ['ready','act','input'].includes(window.__q.phase)", timeout=60000)
        except Exception:
            pass
        page.wait_for_timeout(6000)
        ev = page.evaluate("window.__speechLog.filter(e => e.ch === 'narr').map(e => [e.text, e.ev])")
        dropped = [t for t, e in ev if e in ('dropped', 'skip')]
        prompt = page.evaluate("Session.st && Session.st.prompt")
        spoken = [t for t, e in ev if e in ('speak', 'end')]
        log.check(not dropped and (prompt in spoken or not prompt), '%s: nothing dropped, the question "%s" is said %s' % (g, prompt, dropped))
        page.evaluate("gesture('home')"); page.wait_for_timeout(600)
    miss = page.evaluate("Array.from(window.__vmiss || [])")
    log.check(not miss, 'every sentence has a recording %s' % miss[:8])
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
