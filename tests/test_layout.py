# -*- coding: utf-8 -*-
"""Layout of every game at levels 1, 3 and 5 (3 / 4 / 5 options), both orientations, three seeds: every tap target is
on screen, at least 88 px on its short side (iPad CSS px), and really on top where a finger lands (3 x 3 samples);
the writing paper is not covered by anyone. usage: python tests/test_layout.py"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, Log

log = Log('layout')
AUDIT = """() => {
  const st = Session.st, out = [];
  const els = Array.from(Stage.el.querySelectorAll('[data-gid]')).filter(e => !e.dataset.gid.startsWith('char:'));
  els.forEach(e => {
    const r = e.getBoundingClientRect(); if (r.width < 2 || getComputedStyle(e).visibility === 'hidden') return;
    let cov = 0, n = 0;
    for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) {
      const x = r.left + r.width * (0.1 + 0.2 * i), y = r.top + r.height * (0.1 + 0.2 * j); n++;
      const h = document.elementFromPoint(x, y), o = h && h.closest('[data-gid]');
      if (!(o === e || (h && e.contains(h)))) cov++;
    }
    out.push({ id: e.dataset.gid, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), cov: Math.round(100 * cov / n) });
  });
  return { vw: innerWidth, vh: innerHeight, t: out };
}"""
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    SIZES = (('L', 1180, 820), ('P', 820, 1180), ('L2', 1024, 768), ('P2', 768, 1024))
    for ori, vw, vh in [s for s in SIZES if len(sys.argv) < 2 or s[0] in sys.argv[1].split(',')]:
        page = new_page(br, base, vw, vh)
        enter(page)
        games = page.evaluate("ORDER.w1.concat(ORDER.w2).flatMap(i => ISL[i].games.map(g => [i, g]))")
        problems = []
        for isl, g in games:
            for lv in (1, 3, 5):
                for seed in (1, 2, 3):
                    page.evaluate("([i, g, l, s]) => window.__go(i, g, l, {seed: s})", [isl, g, lv, seed])
                    try:
                        wait_phase(page, timeout=30000)
                    except Exception:
                        problems.append((g, lv, seed, 'no question')); continue
                    page.wait_for_timeout(450)
                    a = page.evaluate(AUDIT)
                    for t in a['t']:
                        small = min(t['w'], t['h']) < 88 and t['id'] != 'paper'
                        off = t['x'] < -2 or t['y'] < -2 or t['r'] > a['vw'] + 2 or t['b'] > a['vh'] + 2
                        if small or off or t['cov'] > 0:
                            problems.append((g, lv, seed, t['id'], t['w'], t['h'], 'off' if off else '', 'covered %d%%' % t['cov'] if t['cov'] else ''))
                    page.evaluate("gesture('home')"); page.wait_for_timeout(80)
                    if lv == 1 and seed > 1:
                        break
        log.check(not problems, '%s: %d games x 3 levels: every target on screen, >= 88 px, uncovered %s' % (ori, len(games), problems[:12]))
        log.check(not page.errors, '%s no page errors %s' % (ori, page.errors[:3]))
        page.context.close()
    br.close()
sys.exit(0 if log.close() else 1)
