# -*- coding: utf-8 -*-
"""Stroke order against the authorities, for every letter and every character the app teaches (docs/DESIGN.md 笔顺标准).
The table is tests/data/stroke_order.json: letters = Zaner-Bloser manuscript (US), characters = 《通用规范汉字笔顺规范》
GF 0023-2020, each entry with its source. The app (the built index.html) is checked against it:
 01 every character the app teaches or writes has an entry - a new level's new character without one FAILS, and the
    entry to check against the standard is printed (fill it in only after checking it against GF 0023-2020's 跟随式)
 02 every character: as many strokes as the standard; each stroke's name (STROKE_NAMES) of the class of its digit
    (1 横提 2 竖 3 撇 4 点捺 5 折); each stroke of the data going the way its class goes; each stroke starting where the
    table says (this pins the order of strokes of one class: the two 撇 of 火, the four dots of 雨)
 03 the 52 letters: each letter's strokes, in order, go the way Zaner-Bloser says (path) and start where it says
 04 the judge (as the writing frame calls it): every stroke written its way passes; written backwards it does not; a later
    stroke written instead is never taken - for every letter and every character
 05 the ways the app used to teach the 17 letters that were changed (and the Chinese-school ways: a lifted a, a bar-first
    T ...) cannot finish the letter
usage: python tests/test_strokes.py"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, Log

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass
HERE = os.path.dirname(os.path.abspath(__file__))
TABLE = json.load(open(os.path.join(HERE, 'data', 'stroke_order.json'), encoding='utf-8'))
log = Log('strokes')

# how a stroke goes, in a handwriting book's words: straight parts by direction, curves by the way they turn as seen
# (screen y down: ccw = counter-clockwise, cw = clockwise), a dot; and where it starts (3 x 3 over the letter's box)
ANALYSIS = r"""
window.__strokeWords = (p) => {
  const L = Geo.len(p);
  if (L < 8) return ['dot'];
  const segs = [];
  for (let i = 1; i < p.length; i++) { const dx = p[i][0] - p[i - 1][0], dy = p[i][1] - p[i - 1][1], l = Math.hypot(dx, dy); if (l > 1e-6) segs.push({ a: p[i - 1], b: p[i], l, h: Math.atan2(dy, dx) * 180 / Math.PI }); }
  const wrap = d => ((d + 540) % 360) - 180;
  const runs = []; let cur = null;              /* split at corners (> 35 deg at one point); a run is straight or turns one way */
  segs.forEach((s, i) => {
    const t = i ? wrap(s.h - segs[i - 1].h) : 0, kind = Math.abs(t) > 35 ? 'corner' : Math.abs(t) > 0.8 ? (t > 0 ? 'cw' : 'ccw') : 'straight';
    if (!cur || kind === 'corner' || (kind !== 'straight' && cur.kind !== 'straight' && cur.kind !== kind) || (kind === 'straight' && cur.kind !== 'straight') || (kind !== 'straight' && cur.kind === 'straight' && cur.segs.length > 1)) {
      if (cur) runs.push(cur);
      cur = { kind: kind === 'corner' ? 'straight' : kind, segs: [s], turn: 0 };
    } else { if (cur.kind === 'straight' && kind !== 'straight') cur.kind = kind; cur.segs.push(s); cur.turn += t; }
  });
  if (cur) runs.push(cur);
  const dir = (a, b) => {
    const h = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    if (h > -22.5 && h <= 22.5) return 'right'; if (h > 22.5 && h < 82) return 'downright'; if (h >= 82 && h <= 98) return 'down';
    if (h > 98 && h < 157.5) return 'downleft'; if (h >= 157.5 || h <= -157.5) return 'left'; if (h > -157.5 && h < -98) return 'upleft';
    if (h >= -98 && h <= -82) return 'up'; return 'upright';
  };
  let out = runs.map(r => {
    const len = r.segs.reduce((s, x) => s + x.l, 0), a = r.segs[0].a, b = r.segs[r.segs.length - 1].b;
    return { word: r.kind !== 'straight' && Math.abs(r.turn) >= 25 ? (r.turn < 0 ? 'ccw' : 'cw') : dir(a, b), len };
  }).filter(r => r.len >= 5 || runs.length === 1);
  /* a short straight piece between two curves is where the curve turns over (the middle of S): not a part of its own */
  out = out.filter((r, i) => !(i > 0 && i < out.length - 1 && r.len < 0.25 * L && /cw/.test(out[i - 1].word) && /cw/.test(out[i + 1].word) && !/cw/.test(r.word)));
  return out.map(r => r.word).filter((w, i, a) => i === 0 || w !== a[i - 1]);
};
window.__cell = (q, box) => {
  const f = (v, a, b) => Math.max(0, Math.min(2, Math.floor(3 * (v - a) / Math.max(1e-6, b - a) - 1e-9)));
  return 'TMB'[f(q[1], box.y0, box.y1)] + 'LCR'[f(q[0], box.x0, box.x1)];
};
window.__letterInfo = (S) => {
  const P = S.flat(), xs = P.map(p => p[0]), ys = P.map(p => p[1]);
  const box = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  return S.map(p => ({ path: window.__strokeWords(p), start: window.__cell(p[0], box) }));
};
"""

# the ways the 17 changed letters were taught before (the Chinese school way, and LWT's G): none may finish the letter
OLD = r"""() => {
  const { line, arc, join } = LG;
  return {
    G: [join(arc(36, 40, 28, 40, -40, -335), line(61.4, 56.9, 62, 44)), line(40, 44, 62, 44)],
    I: [line(30, 0, 30, 80)],
    J: [join(line(46, 0, 46, 60), arc(28, 60, 18, 20, 0, 180))],
    N: [line(10, 0, 10, 80), line(10, 0, 54, 80), line(54, 0, 54, 80)],
    T: [line(6, 0, 60, 0), line(33, 0, 33, 80)],
    Y: [line(8, 0, 32, 40), line(56, 0, 32, 40), line(32, 40, 32, 80)],
    a: [arc(32, 60, 16, 20, -20, -340), line(48, 40, 48, 80)],
    b: [line(12, 0, 12, 80), join(line(12, 60, 12, 60), arc(30, 60, 18, 20, 180, 540))],
    d: [arc(30, 60, 18, 20, -10, -350), line(48, 0, 48, 80)],
    g: [arc(30, 60, 16, 20, -20, -340), join(line(46, 40, 46, 104), arc(32, 104, 14, 14, 0, 160))],
    h: [line(12, 0, 12, 80), join(arc(30, 58, 18, 18, 180, 360), line(48, 58, 48, 80))],
    m: [line(8, 40, 8, 80), join(arc(18, 52, 10, 12, 180, 360), line(28, 52, 28, 80)), join(arc(38, 52, 10, 12, 180, 360), line(48, 52, 48, 80))],
    n: [line(12, 40, 12, 80), join(arc(30, 56, 18, 16, 180, 360), line(48, 56, 48, 80))],
    p: [line(12, 40, 12, 120), arc(30, 60, 18, 20, 180, 540)],
    q: [arc(30, 60, 18, 20, -10, -350), line(48, 40, 48, 120)],
    r: [line(14, 40, 14, 80), arc(32, 58, 18, 16, 180, 290)],
    u: [join(line(12, 40, 12, 64), arc(30, 64, 18, 16, 180, 0), line(48, 64, 48, 40)), line(48, 40, 48, 80)],
  };
}"""
CLASS = {'横': '1', '提': '1', '竖': '2', '竖钩': '2', '撇': '3', '点': '4', '捺': '4'}

with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate("() => {" + ANALYSIS + "}")
    app = page.evaluate("""() => ({
      taught: ITEMS.filter(it => it.kind === 'zh').map(it => it.k),
      words2: WORDS2_LIST.flatMap(w => [w[0], w[1]]),
      data: Object.keys(Hanzi.data), names: STROKE_NAMES,
      meds: Object.fromEntries(Object.keys(Hanzi.data).map(ch => [ch, Hanzi.strokes(ch).map(s => s.med)])),
      letters: Object.fromEntries(Object.keys(LETTERS).map(ch => [ch, window.__letterInfo(LETTERS[ch])])),
    })""")
    HZ, LT = TABLE['hanzi'], TABLE['letters']

    # 01 every character has an entry
    chars = list(dict.fromkeys(app['taught'] + app['words2'] + app['data'] + list(app['names'].keys())))
    missing = [c for c in chars if c not in HZ]
    for c in missing:
        m = app['meds'].get(c)
        log.w('DRAFT (check against GF 0023-2020 first) %s: %s' % (c, json.dumps({'gf': '?', 'page': '?', 'names': app['names'].get(c, '?'), 'starts': [[round(s[0][0]), round(s[0][1])] for s in m] if m else '?', 'status': 'OK'}, ensure_ascii=False)))
    log.check(not missing, '01 every character the app teaches or writes (%d) has its entry in the GF 0023-2020 table %s' % (len(chars), ''.join(missing)))
    log.check(set(app['taught']) <= set(app['data']), '01 every character taught has stroke data %s' % ''.join(sorted(set(app['taught']) - set(app['data']))))

    # 02 every character against its entry
    bad = {'count': [], 'names': [], 'way': [], 'start': []}
    for c in chars:
        e, m = HZ.get(c), app['meds'].get(c)
        if not e or not m:
            continue
        gf, names = e['gf'], app['names'].get(c, '').split()
        if len(m) != len(gf) or len(names) != len(gf):
            bad['count'].append('%s %d/%d/%d' % (c, len(m), len(names), len(gf))); continue
        cls = ''.join(CLASS.get(n, '5') for n in names)
        if cls != gf or names != e['names'].split():
            bad['names'].append('%s %s=%s (%s)' % (c, ' '.join(names), cls, gf))
        for i, (s, d) in enumerate(zip(m, gf)):
            dx, dy = s[-1][0] - s[0][0], s[-1][1] - s[0][1]          # y down
            ok = {'1': dx > 0 and dy < 0.6 * dx, '2': dy > 0 and abs(dx) < dy, '3': dx < 0 and dy > 0, '4': dy > 0 and dx > -0.35 * dy}.get(d, True)
            if d == '5':                                               # a 折 turns: its centre line leaves the line from start to end
                ch_ = max(1.0, (dx * dx + dy * dy) ** 0.5)
                ok = max(abs((q[0] - s[0][0]) * dy - (q[1] - s[0][1]) * dx) / ch_ for q in s) > 20
            if not ok:
                bad['way'].append('%s%d(%s)' % (c, i + 1, d))
            st = e['starts'][i]
            if abs(s[0][0] - st[0]) > 40 or abs(s[0][1] - st[1]) > 40:
                bad['start'].append('%s%d' % (c, i + 1))
    log.check(not bad['count'], '02 every character has as many strokes (data, names) as GF 0023-2020 %s' % bad['count'])
    log.check(not bad['names'], '02 every stroke name is of the class its GF 0023-2020 digit says (横提 竖 撇 点捺 折) %s' % bad['names'][:10])
    log.check(not bad['way'], '02 every stroke of the data goes the way its class goes (横 right, 竖 down, 撇 down-left, 点捺 down-right, 折 turns) %s' % bad['way'][:10])
    log.check(not bad['start'], '02 every stroke starts where the table says (the order of strokes of one class, as in the standard\'s 跟随式) %s' % bad['start'][:10])

    # 03 the 52 letters
    want = set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
    log.check(set(app['letters']) == want and set(LT) == want, '03 the table and the app have the 52 letters (A-Z, a-z)')
    lbad = []
    for ch in sorted(want):
        a, e = app['letters'].get(ch), LT.get(ch)
        if not a or not e:
            continue
        got = [(s['path'], s['start']) for s in a]
        exp = [(s['path'], s['start']) for s in e['strokes']]
        if got != exp:
            lbad.append('%s app %s / Zaner-Bloser %s' % (ch, got, exp))
    for b in lbad:
        log.w('   ' + b)
    log.check(not lbad, '03 every letter: its strokes, in order, go the way Zaner-Bloser says and start where it says (%d letters) %s' % (len(want), [b.split(' ')[0] for b in lbad]))
    n_strokes = sum(len(LT[c]['strokes']) for c in LT)
    log.ok('03 (%d letter strokes; Zaner-Bloser: %s)' % (n_strokes, TABLE['letters_authority']['url']))

    # 04 the judge, as the writing frame calls it
    r = page.evaluate("""() => {
      const out = { self: [], back: [], later: [], n: 0 };
      const run = (key, S, size, opt) => S.forEach((m, i) => {
        const o = S.slice(i + 1), op = opt(i); out.n++;
        if (!Geo.judge(m, m, size, o, op).ok) out.self.push(key + (i + 1));
        if (Geo.len(m) > 0.06 * size && Geo.judge(m.slice().reverse(), m, size, o, op).ok) out.back.push(key + (i + 1));
        o.forEach((x, j) => { if (Geo.judge(x, m, size, o, op).ok) out.later.push(key + (i + 1) + '<-' + (i + j + 2)); });
      });
      Object.keys(LETTERS).forEach(ch => run(ch, LETTERS[ch], 120, () => ({ end: true })));
      Object.keys(Hanzi.data).forEach(ch => { const S = Hanzi.strokes(ch); run(ch, S.map(s => s.med), 1024, i => ({ hook: /钩/.test(S[i].name) })); });
      return out;
    }""")
    log.check(not r['self'], '04 the judge: every stroke of every letter and character written its way passes (%d strokes) %s' % (r['n'], r['self'][:10]))
    log.check(not r['back'], '04 the judge: no stroke written backwards passes %s' % r['back'][:10])
    log.check(not r['later'], '04 the judge: a later stroke written instead of this one is never taken (order) %s' % r['later'][:10])

    # 05 the old ways of the changed letters cannot finish the letter
    r = page.evaluate("""(OLD) => {
      const old = (eval(OLD))(), out = {};
      Object.entries(old).forEach(([ch, strokes]) => {
        const S = LETTERS[ch]; let k = 0, slips = 0;
        for (const d of strokes) { if (k >= S.length) break; const res = Geo.judge(d, S[k], 120, S.slice(k + 1), { end: true }); if (res.ok) k++; else slips++; }
        out[ch] = k >= S.length && !slips ? 'FINISHED' : 'stops at stroke ' + (k + 1) + ', ' + slips + ' slip(s)';
      });
      return out;
    }""", OLD)
    fin = [c for c, v in r.items() if v == 'FINISHED']
    log.check(len(r) == 17 and not fin, '05 written the old way (lifting in a b d g h m n p q r u, T bar first, N in three, Y in three, G bar right, I / J without lines) none of the 17 letters is finished %s' % (fin or r))
    page.context.close()
    br.close()
sys.exit(0 if log.close() else 1)
