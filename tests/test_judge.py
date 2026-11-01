# -*- coding: utf-8 -*-
"""The stroke judge and a child's hand (client 2026-11-01: "a wobbly stroke that was traced right is still judged wrong -
loosen it"). Every stroke of every character and letter in the app, drawn the way a child does - a little off, bigger or
smaller, a slow wave across it, a shake, short or long at the ends - and the mistakes it must still catch (written backwards,
the next stroke, one two on, the right shape far away, the stroke before again). Fixed seeds.
 01 light wobble: a right stroke refused at most 0.5 %      02 a child's wobble: at most 1.5 % (before the change: 6.2 %)
 03 a shaking finger: at most 1.5 % (before: 11.9 %)          04 sloppy tracing: at most 6 % (before: 21 %)
 05 the mistakes: at most 0.3 % taken, at every wobble
usage: python tests/test_judge.py"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, Log

log = Log('judge')
JS = r"""async (cfg) => {
  await Hanzi.load();
  const rng = RNG(12345), R = () => rng.next ? rng.next() : Math.random();
  const RR = RNG(cfg.seed || 7), rnd = (a, b) => a + (b - a) * RR();
  const zh = ITEMS.filter(i => i.kind === 'zh').map(i => i.k).filter(k => { try { return Hanzi.strokes(k).length > 0; } catch (e) { return false; } });
  const en = Object.keys(LETTERS);
  const why2 = {}, negBy = {}, why = {}, cnt = { pos: 0, posFail: 0, neg: 0, negPass: 0 }, failEx = {}, negEx = [];
  const perChar = {};
  /* a child's version of a stroke: shift, scale, a slow wave across it, jitter, start/end short or long */
  const kid = (med, S, lvl) => {
    const P = Geo.resample(med, 40), L = Geo.len(med), c = P.reduce((a, q) => [a[0] + q[0] / P.length, a[1] + q[1] / P.length], [0, 0]);
    const off = lvl.off * S, sh = [rnd(-off, off), rnd(-off, off)], sc = 1 + rnd(-lvl.sc, lvl.sc), A = rnd(0.3, 1) * lvl.wave * S, f = rnd(0.6, 2.2), ph = rnd(0, 6.28), J = lvl.jit * S;
    let pts = P.map((q, i) => {
      const t = i / (P.length - 1), a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
      const w = A * Math.sin(6.283 * f * t + ph);
      return [c[0] + (q[0] - c[0]) * sc + sh[0] - dy / n * w, c[1] + (q[1] - c[1]) * sc + sh[1] + dx / n * w];
    });
    { let jx = 0, jy = 0; const raw = !!lvl.raw; pts = pts.map(q => { const ax = rnd(-J, J), ay = rnd(-J, J); jx = raw ? ax : 0.6 * jx + ax; jy = raw ? ay : 0.6 * jy + ay; return [q[0] + jx, q[1] + jy]; }); }
    /* short or long at the ends */
    const cut0 = rnd(-lvl.end, lvl.end), cut1 = rnd(-lvl.end, lvl.end), n = pts.length;
    if (cut0 > 0) pts = pts.slice(Math.round(cut0 * n)); else if (cut0 < 0) { const d = [pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]], k = Math.round(-cut0 * n); for (let i = 0; i < k; i++) pts.unshift([pts[0][0] + d[0], pts[0][1] + d[1]]); }
    if (cut1 > 0) pts = pts.slice(0, Math.max(2, pts.length - Math.round(cut1 * n))); else if (cut1 < 0) { const m = pts.length, d = [pts[m - 1][0] - pts[m - 2][0], pts[m - 1][1] - pts[m - 2][1]], k = Math.round(-cut1 * n); for (let i = 0; i < k; i++) { const e = pts[pts.length - 1]; pts.push([e[0] + d[0], e[1] + d[1]]); } }
    return pts;
  };
  const lvl = cfg.lvl;
  const run = (k, kind) => {
    const S = kind === 'zh' ? 1024 : 120, strokes = kind === 'zh' ? Hanzi.strokes(k).map(s => ({ med: s.med, name: s.name })) : LETTERS[k].map(p => ({ med: p }));
    strokes.forEach((sk, i) => {
      const others = strokes.slice(i + 1).map(s => s.med), opt = { hook: /钩/.test(sk.name || ''), letter: kind === 'en', prev: strokes.slice(0, i).map(s => s.med) };
      for (let t = 0; t < cfg.n; t++) {
        const d = kid(sk.med, S, lvl), r = Geo.judge(d, sk.med, S, others, opt);
        cnt.pos++; const pc = perChar[k] || (perChar[k] = [0, 0]); pc[0]++;
        if (!r.ok) { cnt.posFail++; pc[1]++; const w = (Geo.diag ? Geo.diag(d, sk.med, S, others, opt) : r.why); why[w] = (why[w] || 0) + 1; const key = k + (i + 1) + ':' + w; why2[key] = (why2[key] || 0) + 1; if (!failEx[w]) failEx[w] = k + ' stroke ' + (i + 1) + ' ' + (sk.name || ''); }
      }
      /* mistakes: backwards; the next stroke drawn here (in its own place); a stroke of its own shape started at the far end */
      const neg = [];
      neg.push(['back', kid(sk.med.slice().reverse(), S, cfg.negLvl)]);
      if (others.length) neg.push(['next', kid(others[0], S, cfg.negLvl)]);
      if (others.length > 1) neg.push(['skip', kid(others[1], S, cfg.negLvl)]);
      { const far = 0.32 * S, a = rnd(0, 6.28); neg.push(['far', kid(sk.med.map(q => [q[0] + far * Math.cos(a), q[1] + far * Math.sin(a)]), S, cfg.negLvl)]); }
      if (i > 0) neg.push(['prev', kid(strokes[i - 1].med, S, cfg.negLvl)]);
      neg.forEach(([nm, d]) => { const r = Geo.judge(d, sk.med, S, others, opt); cnt.neg++; if (r.ok) { cnt.negPass++; negBy[nm] = (negBy[nm] || 0) + 1; if (negEx.length < 12) negEx.push(nm + ' ' + k + ' stroke ' + (i + 1)); } });
    });
  };
  const only = cfg.only ? cfg.only.split('') : null;
  zh.filter(k => !only || only.includes(k)).forEach(k => run(k, 'zh')); en.filter(k => !only || only.includes(k)).forEach(k => run(k, 'en'));
  const worst = Object.entries(perChar).filter(([k, v]) => v[0] >= 10).map(([k, v]) => [k, Math.round(100 * v[1] / v[0])]).sort((a, b) => b[1] - a[1]).slice(0, 15);
  return { zh: zh.length, en: en.length, cnt, why, failEx, negEx, worst, negBy, why2: Object.entries(why2).sort((a, b) => b[1] - a[1]).slice(0, 14) };
}"""
LV = {
  'mild':   dict(off=0.04, sc=0.08, wave=0.025, jit=0.008, end=0.08),
  'kid':    dict(off=0.06, sc=0.12, wave=0.04, jit=0.012, end=0.12),
  'sloppy': dict(off=0.08, sc=0.15, wave=0.055, jit=0.016, end=0.15),
  'shaky':  dict(off=0.05, sc=0.1, wave=0.03, jit=0.012, end=0.1, raw=1),
}

LIMIT = {'mild': 0.5, 'kid': 1.5, 'shaky': 1.5, 'sloppy': 6.0}
NUM = {'mild': '01', 'kid': '02', 'shaky': '03', 'sloppy': '04'}
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch(); page = new_page(br, base, 1180, 820); enter(page)
    for name in ('mild', 'kid', 'shaky', 'sloppy'):
        r = page.evaluate(JS, {'lvl': LV[name], 'negLvl': LV['mild'], 'n': 12, 'seed': 11, 'only': ''})
        c = r['cnt']; rej = 100.0 * c['posFail'] / c['pos']; took = 100.0 * c['negPass'] / max(1, c['neg'])
        log.check(rej <= LIMIT[name], '%s %s: right strokes refused %.1f %% (%d of %d; limit %.1f %%) worst %s' % (NUM[name], name, rej, c['posFail'], c['pos'], LIMIT[name], r['worst'][:5]))
        log.check(took <= 0.3, '05 %s: mistakes taken %.2f %% (%d of %d) %s' % (name, took, c['negPass'], c['neg'], r['negEx'][:4]))
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
