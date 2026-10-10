# -*- coding: utf-8 -*-
"""Screenshots for docs/OPTIONS-EXPLAIN-SPEC.md: every kind of choice game with its five options, and its explain step after a
wrong answer (at real speed, when the gold ring is up), landscape 1180x820 and portrait 820x1180 -> tests/logs/opt/
(<ori>_<game>_q.png, <ori>_<game>_x.png) and contact sheets (tests/logs/opt/sheet_<ori>_<n>.png, six games a sheet).
usage: python tests/shots_options.py [L,P] [game,game]"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, q
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs', 'opt')
os.makedirs(OUT, exist_ok=True)
OPEN = "() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); ISL[id].letters.forEach(l => { Store.s.met[l.l] = true; }); }); Store.save(); }"
GAMES = [('peppa', 'peppa:find', 2), ('bluey', 'bluey:find', 1), ('huluwa', 'huluwa:find', 3), ('paw', 'paw:find', 2), ('xiyou', 'xiyou:find', 3), ('ultra', 'ultra:find', 4),
         ('robot', 'robot:find', 5), ('peppa', 'peppa:quiz', 2), ('bluey', 'bluey:quiz', 2), ('huluwa', 'huluwa:quiz', 3), ('paw', 'paw:quiz', 2), ('xiyou', 'xiyou:quiz', 1),
         ('ultra', 'ultra:quiz', 3), ('robot', 'robot:quiz', 2), ('peppa', 'peppa:write', 2), ('s1', 's1:find', 2), ('s1', 's1:quiz', 2), ('s2', 's2:quiz', 3),
         ('peppa2', 'peppa2:find', 2), ('bluey2', 'bluey2:find', 2), ('pj', 'pj:find', 3), ('ultra2', 'ultra2:find', 3), ('huluwa2', 'huluwa2:find', 3), ('peppa2', 'peppa2:quiz', 2),
         ('bluey2', 'bluey2:quiz', 2), ('pj', 'pj:quiz', 3), ('ultra2', 'ultra2:quiz', 2), ('huluwa2', 'huluwa2:quiz', 3), ('xiyou2', 'xiyou2:find', 3), ('robot2', 'robot2:find', 3),
         ('xiyou2', 'xiyou2:quiz', 2), ('robot2', 'robot2:quiz', 3), ('hulk3', 'hulk3:find', 2), ('hulk3', 'hulk3:en', 3), ('hulk3', 'hulk3:quiz', 1), ('thor3', 'thor3:find', 3),
         ('thor3', 'thor3:en', 1), ('thor3', 'thor3:quiz', 2), ('panther3', 'panther3:find', 4), ('panther3', 'panther3:en', 2), ('panther3', 'panther3:quiz', 1), ('widow3', 'widow3:find', 2),
         ('widow3', 'widow3:en', 3), ('widow3', 'widow3:quiz', 1), ('hawk3', 'hawk3:find', 3), ('hawk3', 'hawk3:en', 2), ('hawk3', 'hawk3:quiz', 1), ('key', 'review', 2)]
ORIS = sys.argv[1].split(',') if len(sys.argv) > 1 else ['L', 'P']
ONLY = sys.argv[2].split(',') if len(sys.argv) > 2 else None


def sheet(files, path, cols=4):
    ims = [Image.open(f) for f in files]
    w, h = ims[0].size; s = 0.5
    W, H = int(w * s), int(h * s)
    out = Image.new('RGB', (cols * W, ((len(ims) + cols - 1) // cols) * H), 'white')
    for i, im in enumerate(ims):
        out.paste(im.convert('RGB').resize((W, H)), ((i % cols) * W, (i // cols) * H))
    out.save(path)


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    for ori in ORIS:
        vw, vh = (1180, 820) if ori == 'L' else (820, 1180)
        page = new_page(br, base, vw, vh)
        enter(page)
        page.wait_for_function("!!Hanzi.data", timeout=15000)
        page.evaluate(OPEN)
        made = []
        for isl, g, lv in GAMES:
            if ONLY and g not in ONLY:
                continue
            name = g.replace(':', '_')
            try:
                page.evaluate("window.__fast = 1")
                if isl == 'key':
                    page.evaluate("() => { Session.start('hulk3', 'hulk3:find', { key: true, keyItems: ['人', 'b', '我'] }); }")
                else:
                    page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 6 })", [isl, g, lv])
                wait_phase(page, timeout=30000)
                page.wait_for_timeout(700)
                page.screenshot(path=os.path.join(OUT, '%s_%s_q.png' % (ori, name)))
                page.evaluate("window.__fast = 0")
                cur = q(page)
                if cur['kind'] == 'write':
                    s = page.evaluate("window.__next('wrong')"); page.evaluate("([g, p]) => window.__gesture(g, p)", [s['g'], s['p']])
                    for _ in range(20):
                        cur2 = q(page)
                        if not cur2 or cur2['submitted'] or cur2['gen'] != cur['gen']:
                            break
                        s = page.evaluate("window.__next('right')")
                        if s:
                            page.evaluate("([g, p]) => window.__gesture(g, p)", [s['g'], s['p']])
                        page.wait_for_timeout(250)
                else:
                    for _ in range(16):
                        cur2 = q(page)
                        if not cur2 or cur2['submitted'] or cur2['gen'] != cur['gen']:
                            break
                        s = page.evaluate("window.__next('wrong')")
                        if s:
                            page.evaluate("([g, p]) => window.__gesture(g, p)", [s['g'], s['p']])
                        page.wait_for_timeout(300)
                page.wait_for_function("!!document.querySelector('.exring.right')", timeout=30000)
                page.wait_for_timeout(1100)
                page.screenshot(path=os.path.join(OUT, '%s_%s_x.png' % (ori, name)))
                made.append(name)
            except Exception as e:
                print('FAIL', ori, g, str(e)[:160], flush=True)
            page.evaluate("window.__fast = 1")
            page.evaluate("gesture('home')"); page.wait_for_timeout(250)
        print(ori, 'shots', len(made), 'errors', page.errors[:3], flush=True)
        for k in range(0, len(made), 6):
            files = []
            for n in made[k:k + 6]:
                files += [os.path.join(OUT, '%s_%s_q.png' % (ori, n)), os.path.join(OUT, '%s_%s_x.png' % (ori, n))]
            sheet(files, os.path.join(OUT, 'sheet_%s_%02d.png' % (ori, k // 6)), cols=4)
        page.context.close()
    br.close()
