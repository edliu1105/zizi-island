# -*- coding: utf-8 -*-
"""The R2 review, finding by finding (fast mode, the games' own generators and the stroke judge):
 R2-01 哪个写对了: at every level at least 8 different glyphs over 300 questions; every variant is one the table allows,
       none twice, the right one exactly once
 R2-02 the judge: a straight line instead of a stroke with a real turn (横折, the arch of n, the bowl of R, Z) fails; a 撇
       / 捺 / 点 written the mirror way fails; every right stroke and a slowly wobbling one still pass
 R2-03 拼单词: the faint letters are there for the whole first session; a wrong tile says its letter and the word
 R2-04 认字: a look-alike option is a character already learned, and never one that holds the answer (明 for 月)
 R2-05 认字 from level 2: the task card shows a speaker (the task is heard)
 R2-06 写字 after a slip: "再写一个！" (not "再试一次！") - a new character comes
 R2-07 缺了一笔: four stroke cards stay clear of the friend on the stage
usage: python tests/test_r2.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, step, q, Log

log = Log('r2')
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate("() => { Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
    r = page.evaluate("""() => {
      const out = {};
      for (const isl of ['ultra', 'robot2']) for (let lv = 1; lv <= 5; lv++) {
        const G = { world: isl, W: ISL[isl], rng: RNG(11 + lv), bags: {} }, glyphs = new Set(), bad = [];
        for (let i = 0; i < 300; i++) {
          const qq = QMirror.gen(G, { level: lv, rng: G.rng }), ok = Mirror.wrongs(qq.glyph);
          glyphs.add(qq.glyph);
          if (qq.opts.filter(o => o === 'ok').length !== 1 || new Set(qq.opts).size !== qq.opts.length || qq.opts.some(o => o !== 'ok' && !ok.includes(o))) bad.push(qq.glyph + qq.opts.join());
        }
        out[isl + lv] = [glyphs.size, bad.slice(0, 3), Array.from(glyphs).join('')];
      }
      return out;
    }""")
    log.check(all(v[0] >= 8 and not v[1] for k, v in r.items() if k.startswith('ultra')) and all(not v[1] for v in r.values()), 'R2-01 哪个写对了: >= 8 different glyphs at every level, every variant allowed %s' % r)
    r = page.evaluate("""() => {
      const bad = [], passBad = [], S = 1024;
      Object.keys(STROKE_NAMES).forEach(ch => { const st = Hanzi.strokes(ch); st.forEach((s, i) => {
        const m = s.med, others = st.slice(i + 1).map(o => o.med), b = Geo.bulge(Geo.resample(m, 32));
        if (!Geo.judge(m, m, S, others).ok) passBad.push(ch + (i + 1));
        const A = Math.min(30, Geo.len(m) * 0.08), wob = Geo.resample(m, 30).map(([x, y], k) => [x + Math.sin(k * 0.45) * A, y + Math.cos(k * 0.45) * A]);
        if (!Geo.judge(wob, m, S, others).ok) passBad.push(ch + (i + 1) + '~');
        if (Math.max(b.pos, b.neg) >= 0.2 && !b.closed) { const line = [m[0], m[m.length - 1]]; if (Geo.judge(Geo.resample(line, 20), m, S, others).ok) bad.push(ch + (i + 1) + s.name + ' as a line'); }
        if (/^(撇|捺|点)$/.test(s.name) && Math.abs(m[m.length - 1][0] - m[0][0]) > 0.06 * S) { const x0 = m[0][0], mir = m.map(([x, y]) => [2 * x0 - x, y]); if (Geo.judge(mir, m, S, others).ok) bad.push(ch + (i + 1) + s.name + ' mirrored'); }
      }); });
      'RhnmZBDPSU'.split('').forEach(ch => LETTERS[ch].forEach((m, i) => { const b = Geo.bulge(Geo.resample(m, 32)), others = LETTERS[ch].slice(i + 1); if (!Geo.judge(m, m, 120, others).ok) passBad.push(ch + (i + 1)); if (Math.max(b.pos, b.neg) >= 0.2 && !b.closed && Geo.judge(Geo.resample([m[0], m[m.length - 1]], 20), m, 120, others).ok) bad.push(ch + (i + 1) + ' as a line'); }));
      return { bad, passBad };
    }""")
    log.check(not r['bad'], 'R2-02 a straight line for a turning stroke, a mirrored 撇/捺/点: never taken %s' % r['bad'][:12])
    log.check(not r['passBad'], 'R2-02 every right stroke (and a slowly wobbling one) still passes %s' % r['passBad'][:12])
    page.evaluate("() => { Store.w('peppa2').gstars['peppa2:quiz'] = 0; Store.save(); window.__go('peppa2', 'peppa2:quiz', 3, {seed: 4}); }"); wait_phase(page, timeout=30000); page.wait_for_timeout(300)
    h = page.evaluate("Session.st.q.hint && Session.st.slots.every(s => !!s.querySelector('svg'))")
    page.evaluate("gesture('home')"); page.wait_for_timeout(200)
    page.evaluate("() => { Store.w('peppa2').gstars['peppa2:quiz'] = 5; Store.save(); window.__go('peppa2', 'peppa2:quiz', 3, {seed: 4}); }"); wait_phase(page, timeout=30000); page.wait_for_timeout(300)
    h2 = page.evaluate("Session.st.q.hint")
    page.evaluate("gesture('home')"); page.wait_for_timeout(200)
    log.check(h and not h2, 'R2-03 拼单词 at level 3: faint letters in the first session (before 5 stars), none after')
    r = page.evaluate("""() => {
      const bad = [];
      ALL_ISL().forEach(isl => { for (let lv = 3; lv <= 5; lv++) { const G = { world: isl, W: ISL[isl], rng: RNG(lv), bags: {} }, known = poolOf(G, 'zh', true);
        for (let i = 0; i < 200; i++) { const qq = FindBase.gen.call(GAMES[isl + ':find'], G, { level: lv, rng: G.rng });
          qq.opts.forEach(k => { if (!known.includes(k)) bad.push(isl + ' L' + lv + ' ' + qq.answer + ':' + k); if ((HOLDS[qq.answer] || '').includes(k)) bad.push(isl + ' holds ' + qq.answer + ':' + k); }); } } });
      return Array.from(new Set(bad));
    }""")
    log.check(not r, 'R2-04 认字 L3-5: every option already learned, none holding the answer (14 islands x 600 questions) %s' % r[:10])
    page.evaluate("window.__go('bluey', 'bluey:find', 2, {seed: 3})"); wait_phase(page, timeout=30000); page.wait_for_timeout(300)
    sp = page.evaluate("Session.st.taskEl.innerHTML.includes('M16.5 8.5') || Session.st.taskEl.innerHTML.includes('M4 9h4')")
    log.check(sp, 'R2-05 认字 L2: the task card shows a speaker')
    page.evaluate("gesture('home')"); page.wait_for_timeout(200)
    page.evaluate("Voice.say = ((f) => function (t, o) { (window.__said = window.__said || []).push(t); if (!t) (window.__nulls = window.__nulls || []).push((new Error()).stack.split(String.fromCharCode(10)).slice(2, 4).join(' | ')); return f.call(this, t, o); })(Voice.say)")
    page.evaluate("window.__go('peppa', 'peppa:write', 3, {seed: 3})"); wait_phase(page, timeout=30000)
    gen = q(page)['gen']; step(page, 'wrong')
    for _ in range(30):
        cur = q(page)
        if not cur or cur['gen'] != gen or cur['submitted']:
            break
        if cur['phase'] in ('act', 'ready', 'input'):
            step(page, 'right')
        page.wait_for_timeout(20)
    page.wait_for_function("([g]) => window.__q && window.__q.gen !== g", arg=[gen], timeout=30000)
    said = [x for x in page.evaluate("window.__said || []") if x]
    print('NULLS', page.evaluate("(window.__nulls || []).slice(0, 3)"))
    log.check('再写一个！' in said and '再试一次！' not in said, 'R2-06 写字 after a slip: "再写一个！" %s' % [x for x in said if '再' in x])
    page.evaluate("gesture('home')"); page.wait_for_timeout(200)
    page.context.close()
    for ori, vw, vh in (('L', 1180, 820), ('P', 820, 1180)):
        pg = new_page(br, base, vw, vh); enter(pg); pg.wait_for_function("!!Hanzi.data", timeout=15000)
        pg.evaluate("window.__go('huluwa', 'huluwa:quiz', 5, {seed: 2})"); wait_phase(pg, timeout=30000); pg.wait_for_timeout(500)
        ov = pg.evaluate("""() => { const st = Session.st, out = []; Object.values(st.G.actors).forEach(a => { const ab = a.root.getBoundingClientRect(); if (ab.right < 0 || ab.left > innerWidth) return; st.cards.forEach((c, i) => { const cb = c.getBoundingClientRect(); const ix = Math.min(ab.right, cb.right) - Math.max(ab.left, cb.left), iy = Math.min(ab.bottom, cb.bottom) - Math.max(ab.top, cb.top); if (ix > 4 && iy > 4) out.push(a.id + ' x card' + i); }); }); return { n: st.cards.length, out }; }""")
        log.check(ov['n'] == 4 and not ov['out'], 'R2-07 %s 缺了一笔 with four cards: no friend under a card %s' % (ori, ov))
        pg.context.close()
    br.close()
sys.exit(0 if log.close() else 1)
