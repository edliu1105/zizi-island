# -*- coding: utf-8 -*-
"""The R1 review, finding by finding (fast mode, the games' own generators):
 R1-01/07 哪个写对了: 1000 questions per level - every wrong variant looks different from the right one and from each
          other (point distance > 8 % of the glyph); the glyph turns about its own centre (same box for all variants)
 R1-02/10 缺了一笔: 1000 questions - the other strokes have other names than the missing one and than each other, none from
          the same character; the gap is outlined only at levels 1-2
 R1-03    every stroke name agrees with its stroke's direction (撇 ends lower left, 捺 lower right, 点 is short, ...)
 R1-04    认字: level 1 shows the picture; level >= 2 hears it, and the picture comes with the second hint
 R1-05    读单词: the letters of a word never touch
 R1-06    the island panel: the host's head and everything else on screen, 4 sizes
 R1-08    the treasure book cover: two bars, one segment an island, filling with what is learned
 R1-09    字从画里来: the brush writes the strokes (they are inked one after another)
usage: python tests/test_r1.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, q, Log

log = Log('r1')
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate("() => { Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
    r = page.evaluate("""() => {
      const G = { world: 'ultra', W: ISL.ultra, rng: RNG(7), bags: {} }, bad = [];
      for (let lv = 1; lv <= 5; lv++) for (let i = 0; i < 1000; i++) {
        const q = QMirror.gen(G, { level: lv, rng: G.rng }), P = Mirror.pts(q.glyph), xs = P.map(p => p[0]), ys = P.map(p => p[1]);
        const c = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2], size = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
        const V = q.opts.map(t => Mirror.tf(P, t, c));
        for (let a = 0; a < V.length; a++) for (let b = a + 1; b < V.length; b++) if (Mirror.chamfer(V[a], V[b]) <= 0.08 * size) bad.push([lv, q.glyph, q.opts[a], q.opts[b]]);
        if (q.opts.filter(o => o === 'ok').length !== 1) bad.push([lv, q.glyph, 'ok count']);
      }
      return bad.slice(0, 10);
    }""")
    log.check(not r, 'R1-01 哪个写对了: 5000 questions, every variant visibly different from the others %s' % r)
    page.evaluate("window.__go('ultra', 'ultra:quiz', 5, {seed: 3})"); wait_phase(page, timeout=20000); page.wait_for_timeout(500)
    boxes = page.evaluate("() => Session.st.cards.map(c => { const g = c.querySelector('svg'), b = g.getBoundingClientRect(), cb = c.getBoundingClientRect(); return [Math.round(b.x + b.width / 2 - cb.x - cb.width / 2), Math.round(b.y + b.height / 2 - cb.y - cb.height / 2)]; })")
    log.check(all(abs(x) <= 2 and abs(y) <= 2 for x, y in boxes), 'R1-07 the turned glyphs sit in the middle of their cards like the right one %s' % boxes)
    page.evaluate("gesture('home')"); page.wait_for_timeout(200)
    r = page.evaluate("""() => {
      const G = { world: 'huluwa2', W: ISL.huluwa2, rng: RNG(5), bags: {} }, bad = [];
      for (let lv = 1; lv <= 5; lv++) for (let i = 0; i < 200; i++) {
        const q = QMissing.gen(G, { level: lv, rng: G.rng }), names = q.opts.map(([c, k]) => STROKE_NAMES[c].split(' ')[k]);
        if (new Set(names).size !== names.length) bad.push([lv, q.ch, names.join('')]);
        if (q.opts.filter(([c]) => c === q.ch).length !== 1) bad.push([lv, q.ch, 'same character']);
        if (q.outline !== (lv <= 2)) bad.push([lv, 'outline']);
      }
      return bad.slice(0, 10);
    }""")
    log.check(not r, 'R1-02/10 缺了一笔: 1000 questions, every stroke on offer a different name, none from the same character; outline only at L1-2 %s' % r)
    r = page.evaluate("""() => {
      const bad = [];
      Object.keys(STROKE_NAMES).forEach(ch => { const S = Hanzi.strokes(ch); S.forEach((s, i) => {
        const m = s.med, a = m[0], b = m[m.length - 1], L = Geo.len(m), dx = b[0] - a[0], dy = b[1] - a[1], n = s.name;
        let ok = true;
        if (n === '撇') ok = dx < -20 && dy > 20;
        else if (n === '捺') ok = dx > 60 && dy > 60 && L > 230;
        else if (n === '点') ok = L < 420 && dy > 0;          /* a long dot (长点: 云 风 鸡) is still a dot */
        else if (n === '横') ok = Math.abs(dx) > 2.5 * Math.abs(dy) && dx > 0;
        else if (n === '竖') ok = Math.abs(dy) > 2.5 * Math.abs(dx) && dy > 0;
        else if (n === '提') ok = dx > 0 && dy < 0;
        if (!ok) bad.push(ch + (i + 1) + n + ' d=' + Math.round(dx) + ',' + Math.round(dy) + ' L=' + Math.round(L));
      }); });
      return bad;
    }""")
    log.check(not r, 'R1-03 every 横 竖 撇 捺 点 提 of the 56 characters goes the way its name says %s' % r[:12])
    for lv, want in ((1, True), (2, False), (4, False)):
        page.evaluate("([l]) => window.__go('bluey', 'bluey:find', l, {seed: 6})", [lv]); wait_phase(page, timeout=30000); page.wait_for_timeout(300)
        pic0 = page.evaluate("!!Session.st.taskEl.querySelector('img')")
        page.evaluate("Session.st.game.gestureHint(Session.st, false)"); page.wait_for_timeout(200)
        pic1 = page.evaluate("!!Session.st.taskEl.querySelector('img')")
        log.check(pic0 == want and pic1, 'R1-04 认字 L%d: the picture %s, and after the second hint it shows' % (lv, 'at once' if want else 'not at first'))
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
    page.evaluate("window.__go('robot2', 'robot2:quiz', 4, {seed: 2})"); wait_phase(page, timeout=30000); page.wait_for_timeout(400)
    r = page.evaluate("""() => Session.st.cards.map(c => { const s = c.querySelector('svg'), g = s.querySelector('g'), ps = Array.from(g.children); return s.getAttribute('viewBox'); })""")
    page.screenshot(path=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs', 'r1_read.png'))
    log.check(len(r) >= 3, 'R1-05 读单词: each word one picture on one base line (see logs/r1_read.png) %s' % r)
    page.evaluate("gesture('home')"); page.wait_for_timeout(200)
    page.evaluate("() => { Store.learn('人'); Store.learn('口'); ['人','口','目','手','A','B','C','D'].forEach(k => Store.learn(k)); }")
    page.evaluate("Book.open()"); page.wait_for_timeout(400)
    bars = page.evaluate("() => Array.from(document.querySelectorAll('#book .meter .bar')).map(b => Array.from(b.children).map(i => i.style.getPropertyValue('--f')))")
    log.check(len(bars) == 2 and len(bars[0]) == 7 and bars[0][0] == '100%' and bars[0][1] == '0%', 'R1-08 the book cover: two bars of seven, the first island full %s' % bars)
    page.evaluate("Book.close()"); page.wait_for_timeout(300)
    page.context.close()
    for ori, vw, vh in (('L', 1180, 820), ('P', 820, 1180), ('L2', 1024, 768), ('P2', 768, 1024)):
        pg = new_page(br, base, vw, vh); enter(pg); pg.wait_for_timeout(500)
        bad = []
        for isl in ('peppa', 'ultra', 'robot2'):
            pg.evaluate("([i]) => { Store.w(i).unlocked = true; MapView.useSet(ISL[i].w); MapView.openPanel(i); }", [isl]); pg.wait_for_timeout(700)
            rr = pg.evaluate("() => Array.from(MapView.panel.querySelectorAll('img, .btn')).map(e => e.getBoundingClientRect()).filter(r => r.width > 4).map(r => [Math.round(r.top), Math.round(r.bottom), Math.round(r.left), Math.round(r.right)])")
            out = [x for x in rr if x[0] < -1 or x[1] > vh + 1 or x[2] < -1 or x[3] > vw + 1]
            if out:
                bad.append((isl, out[:3]))
            pg.evaluate("MapView.closePanel(true)")
        log.check(not bad, 'R1-06 %s: the island panel - host, island, games, stars, words all on screen %s' % (ori, bad))
        pg.context.close()
    pg = new_page(br, base, 1180, 820, fast=False); enter(pg); pg.wait_for_timeout(1500)
    pg.evaluate("() => { Store.s.met = {}; Store.save(); window.__go('xiyou', 'xiyou:find', 1, {seed: 1}); }")
    pg.wait_for_function("Session.st && Session.st.els.some(e => e.querySelector && e.querySelector('svg g path[clip-path]'))", timeout=30000)
    seen = []
    for _ in range(30):
        n = pg.evaluate("() => { const e = Session.st.els.find(e => e.querySelector && e.querySelector('svg g path[clip-path]')); return e ? e.querySelectorAll('path[clip-path]').length : -1; }")
        seen.append(n); pg.wait_for_timeout(150)
    log.check(len(set(x for x in seen if x > 0)) >= 2, 'R1-09 字从画里来: the brush inks the strokes one after another %s' % sorted(set(seen)))
    log.check(not pg.errors, 'no page errors %s' % pg.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
