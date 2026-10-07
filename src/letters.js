/* ================================================================ LETTERS (四线三格: the four lines at y = 0 / 40 / 80 / 120)
   Every letter as its strokes in writing order (the Chinese primary-school English handwriting standard), each stroke a
   polyline in letter units: capitals stand on line 3 (y 80) and reach line 1 (y 0); small letters sit in the middle
   space (40-80), ascenders reach line 1, descenders line 4 (120). Curves are real ellipse arcs or Catmull-Rom splines.
   A stroke the size of a dot (i, j) is written with a tap or a tiny stroke. */
const LG = {
  line: (x0, y0, x1, y1) => { const out = [], n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 4)); for (let k = 0; k <= n; k++) out.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]); return out; },
  /* ellipse arc from angle a0 to a1 (degrees; 0 = right, 90 = down: increasing = clockwise on screen) */
  arc: (cx, cy, rx, ry, a0, a1) => { const out = [], n = Math.max(6, Math.round(Math.abs(a1 - a0) / 8)); for (let k = 0; k <= n; k++) { const a = (a0 + (a1 - a0) * k / n) * Math.PI / 180; out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return out; },
  /* Catmull-Rom spline through the control points */
  curve: pts => { const out = [], P = [pts[0]].concat(pts, [pts[pts.length - 1]]); for (let i = 1; i < P.length - 2; i++) { for (let t = 0; t < 1; t += 0.125) { const t2 = t * t, t3 = t2 * t; out.push([0, 1].map(j => 0.5 * ((2 * P[i][j]) + (-P[i - 1][j] + P[i + 1][j]) * t + (2 * P[i - 1][j] - 5 * P[i][j] + 4 * P[i + 1][j] - P[i + 2][j]) * t2 + (-P[i - 1][j] + 3 * P[i][j] - 3 * P[i + 1][j] + P[i + 2][j]) * t3))); } } out.push(pts[pts.length - 1]); return out; },
  join: (...segs) => segs.reduce((a, s) => a.concat(a.length && s.length && Math.hypot(a[a.length - 1][0] - s[0][0], a[a.length - 1][1] - s[0][1]) < 0.5 ? s.slice(1) : s), []),
  dot: (x, y) => [[x, y - 2.5], [x, y + 2.5]],
};
const LETTERS = (() => {
  const { line, arc, curve, join, dot } = LG;
  return {
    A: [line(32, 0, 7, 80), line(32, 0, 57, 80), line(17, 50, 47, 50)],
    B: [line(10, 0, 10, 80), join(line(10, 0, 32, 0), arc(32, 19, 18, 19, -90, 90), line(32, 38, 10, 38), line(10, 38, 36, 38), arc(36, 59, 21, 21, -90, 90), line(36, 80, 10, 80))],
    C: [arc(36, 40, 28, 40, -40, -320)],
    D: [line(10, 0, 10, 80), join(line(10, 0, 26, 0), arc(26, 40, 30, 40, -90, 90), line(26, 80, 10, 80))],
    E: [line(10, 0, 10, 80), line(10, 0, 52, 0), line(10, 40, 46, 40), line(10, 80, 52, 80)],
    F: [line(10, 0, 10, 80), line(10, 0, 52, 0), line(10, 40, 46, 40)],
    G: [join(arc(36, 40, 28, 40, -40, -335), line(61.4, 56.9, 62, 44)), line(40, 44, 62, 44)],
    H: [line(10, 0, 10, 80), line(54, 0, 54, 80), line(10, 40, 54, 40)],
    I: [line(30, 0, 30, 80)],
    J: [join(line(46, 0, 46, 60), arc(28, 60, 18, 20, 0, 180))],
    K: [line(10, 0, 10, 80), join(line(54, 0, 12, 44), line(12, 44, 56, 80))],
    L: [join(line(10, 0, 10, 80), line(10, 80, 52, 80))],
    M: [line(8, 0, 8, 80), join(line(8, 0, 35, 62), line(35, 62, 62, 0), line(62, 0, 62, 80))],
    N: [line(10, 0, 10, 80), line(10, 0, 54, 80), line(54, 0, 54, 80)],
    O: [arc(34, 40, 28, 40, -90, -450)],
    P: [line(10, 0, 10, 80), join(line(10, 0, 30, 0), arc(30, 21, 21, 21, -90, 90), line(30, 42, 10, 42))],
    Q: [arc(34, 40, 28, 40, -90, -450), line(38, 58, 62, 86)],
    R: [line(10, 0, 10, 80), join(line(10, 0, 30, 0), arc(30, 21, 21, 21, -90, 90), line(30, 42, 12, 42), line(12, 42, 56, 80))],
    S: [curve([[56, 12], [46, 2], [32, 0], [17, 4], [10, 16], [14, 29], [30, 37], [46, 45], [57, 57], [56, 71], [44, 80], [26, 80], [12, 74], [6, 64]])],
    T: [line(6, 0, 60, 0), line(33, 0, 33, 80)],
    U: [join(line(10, 0, 10, 56), arc(34, 56, 24, 24, 180, 0), line(58, 56, 58, 0))],
    V: [join(line(6, 0, 32, 80), line(32, 80, 58, 0))],
    W: [join(line(4, 0, 18, 80), line(18, 80, 34, 22), line(34, 22, 50, 80), line(50, 80, 64, 0))],
    X: [line(8, 0, 56, 80), line(56, 0, 8, 80)],
    Y: [line(8, 0, 32, 40), line(56, 0, 32, 40), line(32, 40, 32, 80)],
    Z: [join(line(8, 0, 56, 0), line(56, 0, 8, 80), line(8, 80, 58, 80))],
    a: [arc(32, 60, 16, 20, -20, -340), line(48, 40, 48, 80)],
    b: [line(12, 0, 12, 80), join(line(12, 60, 12, 60), arc(30, 60, 18, 20, 180, 540))],
    c: [arc(32, 60, 18, 20, -40, -320)],
    d: [arc(30, 60, 18, 20, -10, -350), line(48, 0, 48, 80)],
    e: [join(line(14, 60, 50, 60), arc(32, 60, 18, 20, 0, -315))],
    f: [join(arc(40, 12, 12, 10, -10, -180), line(28, 12, 28, 80)), line(16, 40, 46, 40)],
    g: [arc(30, 60, 16, 20, -20, -340), join(line(46, 40, 46, 104), arc(32, 104, 14, 14, 0, 160))],
    h: [line(12, 0, 12, 80), join(arc(30, 58, 18, 18, 180, 360), line(48, 58, 48, 80))],
    i: [line(30, 40, 30, 80), dot(30, 22)],
    j: [join(line(36, 40, 36, 104), arc(22, 104, 14, 14, 0, 160)), dot(36, 22)],
    k: [line(12, 0, 12, 80), join(line(46, 40, 14, 62), line(14, 62, 48, 80))],
    l: [line(30, 0, 30, 80)],
    m: [line(8, 40, 8, 80), join(arc(18, 52, 10, 12, 180, 360), line(28, 52, 28, 80)), join(arc(38, 52, 10, 12, 180, 360), line(48, 52, 48, 80))],
    n: [line(12, 40, 12, 80), join(arc(30, 56, 18, 16, 180, 360), line(48, 56, 48, 80))],
    o: [arc(32, 60, 18, 20, -90, -450)],
    p: [line(12, 40, 12, 120), arc(30, 60, 18, 20, 180, 540)],
    q: [arc(30, 60, 18, 20, -10, -350), line(48, 40, 48, 120)],
    r: [line(14, 40, 14, 80), arc(32, 58, 18, 16, 180, 290)],
    s: [curve([[46, 45], [38, 40], [28, 40], [18, 44], [16, 52], [24, 58], [36, 62], [46, 68], [44, 77], [32, 80], [20, 80], [12, 75]])],
    t: [join(line(28, 10, 28, 70), arc(38, 70, 10, 10, 180, 90)), line(16, 40, 44, 40)],
    u: [join(line(12, 40, 12, 64), arc(30, 64, 18, 16, 180, 0), line(48, 64, 48, 40)), line(48, 40, 48, 80)],
    v: [join(line(10, 40, 30, 80), line(30, 80, 50, 40))],
    w: [join(line(4, 40, 16, 80), line(16, 80, 28, 52), line(28, 52, 40, 80), line(40, 80, 52, 40))],
    x: [line(12, 40, 48, 80), line(48, 40, 12, 80)],
    y: [line(10, 40, 30, 80), line(50, 40, 18, 120)],
    z: [join(line(10, 40, 48, 40), line(48, 40, 10, 80), line(10, 80, 50, 80))],
  };
})();
/* the letter's extent (for centring in its writing frame) */
function letterBox(ch) {
  const pts = LETTERS[ch].flat(); const xs = pts.map(p => p[0]);
  return { x0: Math.min(...xs), x1: Math.max(...xs) };
}
