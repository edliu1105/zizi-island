# -*- coding: utf-8 -*-
"""The R3 review, finding by finding (fast mode, the games' own generators and the stroke judge):
 R3-01 找部件: 2000 questions at levels 3-5 - no wrong option holds the part (or a shape a child would take for it)
 R3-03 a hook may be left off: every 钩 stroke without its hook passes, as does the whole stroke; a straight line for a
       stroke with a real turn and a mirrored 撇 / 捺 / 点 still fail (the R2-02 matrix, again)
 R3-04 写字, the first meeting: the character's line is said once before "看我写一遍" (not twice in a row)
 R3-05 组词: 2000 questions at levels 2-5 - no wrong option makes a word with the first character (the app's own list
       and the common ones: 雨水, 小狗, 大人 ...)
 R3-06 停车场 portrait: the three cars do not overlap
usage: python tests/test_r3.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, Log

log = Log('r3')
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate("() => { Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; }); Store.save(); }")
    r = page.evaluate("""() => {
      const bad = [], G = { world: 'huluwa2', W: ISL.huluwa2, rng: RNG(31), bags: {} };
      for (let lv = 3; lv <= 5; lv++) for (let i = 0; i < 2000; i++) {
        const qq = QPart.gen(G, { level: lv, rng: G.rng }), has = PART_IN[qq.comp] + (PART_ALSO[qq.comp] || '');
        qq.opts.forEach(k => { if (k !== qq.answer && has.includes(k)) bad.push(qq.comp + ':' + k); });
        if (!PART_IN[qq.comp].includes(qq.answer)) bad.push('answer ' + qq.comp + qq.answer);
      }
      return Array.from(new Set(bad));
    }""")
    log.check(not r, 'R3-01 找部件: 6000 questions, no wrong option holds the part %s' % r[:10])
    r = page.evaluate("""() => {
      const S = 1024, nohook = [], whole = [], line = [], mirror = [];
      Object.keys(STROKE_NAMES).forEach(ch => { const st = Hanzi.strokes(ch); st.forEach((s, i) => {
        const m = s.med, others = st.slice(i + 1).map(o => o.med), o = { hook: /钩/.test(s.name) };
        if (!Geo.judge(m, m, S, others, o).ok) whole.push(ch + (i + 1));
        if (o.hook && !Geo.judge(Geo.resample(Geo.unhook(m), 30), m, S, others, o).ok) nohook.push(ch + (i + 1) + s.name);
        const b = Geo.bulge(Geo.resample(o.hook ? Geo.unhook(m) : m, 32));     /* a 竖钩 turns only in its hook - now optional */
        if (Math.max(b.pos, b.neg) >= 0.2 && !b.closed && Geo.judge(Geo.resample([m[0], m[m.length - 1]], 20), m, S, others, o).ok) line.push(ch + (i + 1) + s.name);
        if (/^(撇|捺|点)$/.test(s.name) && Math.abs(m[m.length - 1][0] - m[0][0]) > 0.06 * S) { const x0 = m[0][0]; if (Geo.judge(m.map(([x, y]) => [2 * x0 - x, y]), m, S, others, o).ok) mirror.push(ch + (i + 1)); }
      }); });
      const hooks = Object.keys(STROKE_NAMES).reduce((n, ch) => n + STROKE_NAMES[ch].split(' ').filter(x => x.includes('钩')).length, 0);
      return { hooks, nohook, whole, line, mirror };
    }""")
    log.check(r['hooks'] >= 25 and not r['nohook'], 'R3-03 all %d hook strokes pass without their hook %s' % (r['hooks'], r['nohook']))
    log.check(not r['whole'], 'R3-03 every whole stroke still passes %s' % r['whole'][:10])
    log.check(not r['line'] and not r['mirror'], 'R3-03 a straight line for a turning stroke, a mirrored 撇/捺/点: still never taken %s %s' % (r['line'][:8], r['mirror'][:8]))
    page.evaluate("Voice.say = ((f) => function (t, o) { (window.__said = window.__said || []).push(t); return f.call(this, t, o); })(Voice.say)")
    for isl, game, lang in (('huluwa', 'huluwa:write', 'zh'), ('peppa', 'peppa:abc', 'en')):
        page.evaluate("() => { Store.s.met = {}; Store.save(); window.__said = []; }")
        page.evaluate("([i, g]) => window.__go(i, g, 1, {seed: 5})", [isl, game]); wait_phase(page, timeout=30000); page.wait_for_timeout(200)
        k = page.evaluate("Session.st.q.answer"); line = page.evaluate("(k) => ITEM[k].line", k)
        said = [x for x in page.evaluate("window.__said") if x]
        before = said[:said.index('看我写一遍')] if '看我写一遍' in said else said
        met = page.evaluate("(k) => !!Store.s.met[k]", k)
        log.check(met and before.count(line) == 1 and '看我写一遍' in said, 'R3-04 %s first meeting of %s: "%s" once before the brush %s' % (game, k, line, before))
        page.evaluate("gesture('home')"); page.wait_for_timeout(200)
    r = page.evaluate("""() => {
      const bad = [], G = { world: 'pj', W: ISL.pj, rng: RNG(17), bags: {} };
      for (let lv = 2; lv <= 5; lv++) for (let i = 0; i < 2000; i++) {
        const qq = QWord2.gen(G, { level: lv, rng: G.rng });
        qq.opts.forEach(k => { if (k === qq.answer) return; if (WORDS2_LIST.some(w => w[0] === qq.a && w[1] === k) || (WORD_ALSO[qq.a] || '').includes(k)) bad.push(qq.a + k); });
      }
      return Array.from(new Set(bad));
    }""")
    log.check(not r, 'R3-05 组词: 8000 questions, no wrong option makes a word with the first character %s' % r[:10])
    page.context.close()
    pg = new_page(br, base, 820, 1180); enter(pg); pg.wait_for_function("!!Hanzi.data", timeout=15000)
    for seed in (2, 3, 4):
        pg.evaluate("(s) => window.__go('robot', 'robot:find', 2, {seed: s})", seed); wait_phase(pg, timeout=30000); pg.wait_for_timeout(1300)
        ov = pg.evaluate("""() => { const c = Session.st.cards.map(e => e.getBoundingClientRect()), out = [];
          for (let a = 0; a < c.length; a++) for (let b = a + 1; b < c.length; b++) { const ix = Math.min(c[a].right, c[b].right) - Math.max(c[a].left, c[b].left), iy = Math.min(c[a].bottom, c[b].bottom) - Math.max(c[a].top, c[b].top); if (ix > 0 && iy > 0) out.push([a, b, Math.round(ix)]); }
          return { n: c.length, w: Math.round(c[0].width), out }; }""")
        log.check(ov['n'] >= 3 and not ov['out'], 'R3-06 P 停车场 seed %d: %d cars, none overlapping %s' % (seed, ov['n'], ov))
        pg.evaluate("gesture('home')"); pg.wait_for_timeout(200)
    pg.context.close()
    br.close()
sys.exit(0 if log.close() else 1)
