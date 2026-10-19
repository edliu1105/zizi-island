# -*- coding: utf-8 -*-
"""how often the step buttons land on 十格灯's green ✓ (done) button at L4/L5 (scattered lamps), three sizes, six seeds"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, q, step, answer_question, wait_next_question
OPEN = "() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }"
AUD = """() => { const b = document.querySelector('.stepbtn'), s = document.querySelector('.stepskip'), d = Session.st.doneEl; if (!b || !d) return null;
  const R = e => e.getBoundingClientRect(); const I = (A, B) => Math.max(0, Math.min(A.right, B.right) - Math.max(A.left, B.left)) * Math.max(0, Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top));
  return [Math.round(I(R(b), R(d))), Math.round(I(R(s), R(d))), Math.round(R(d).width)]; }"""
out = []
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    for vw, vh in ((1180, 820), (820, 1180), (1024, 768)):
        page = new_page(br, base, vw, vh); enter(page); page.evaluate(OPEN); page.evaluate("Store.s.settings.ex = 'step'; Store.save()")
        for lv in (4, 5):
            for seed in range(1, 7):
                page.evaluate("([l, s]) => window.__go('thor3', 'thor3:quiz', l, { seed: s })", [lv, seed]); wait_phase(page, timeout=30000)
                gen, snap = answer_question(page, 'wrong', timeout=30000)
                hits = []
                for i in range(6):
                    page.wait_for_function("(g) => { const q = window.__q; return !q || q.gen !== g || q.stepWaiting; }", arg=gen, timeout=25000, polling=20)
                    c = q(page)
                    if not c or c['gen'] != gen: break
                    a = page.evaluate(AUD); hits.append(a)
                    if a and (a[0] > 0 or a[1] > 0) and not os.path.exists('tests/logs/pt2/done_%dx%d_L%d.jpg' % (vw, vh, lv)):
                        page.screenshot(path='tests/logs/pt2/done_%dx%d_L%d.jpg' % (vw, vh, lv), type='jpeg', quality=50)
                    b = page.evaluate("() => { const r = document.querySelector('.stepbtn').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }")
                    page.mouse.click(b[0], b[1]); page.wait_for_timeout(40)
                wait_next_question(page, gen, timeout=30000)
                out.append(((vw, vh), lv, seed, hits))
                page.evaluate("gesture('home')"); page.wait_for_timeout(50)
        page.context.close()
    br.close()
n = sum(1 for o in out if any(h and (h[0] > 0 or h[1] > 0) for h in o[3]))
for o in out: print(o)
print('runs with the done button under 下一步/跳过:', n, '/', len(out))
