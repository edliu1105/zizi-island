/* ================================================================ WRITING (田字格 for a character, 四线三格 for a letter)
   The child writes each stroke with a finger; on release the stroke is judged against the stroke it should be:
   where it starts (the green dot), its direction, its shape (mean distance to the stroke's centre line), its length -
   and that it is THIS stroke and not a later one (order). Right: the ink sweeps along the real stroke and its name is said
   (横 / 竖 / 撇 ...). Not right: the trail fades and one factual line says what to do (start at the green dot / follow the
   arrow / this stroke first). Tolerances are made for a 4-year-old's finger; direction and order are what is taught.
   Scaffolding by level: 1 the brush shows every stroke first, dot + arrow + outline; 2 dot + outline (arrow after a slip);
   3 outline only; 4 a faint outline; 5 the empty grid (from memory; a slip shows that stroke).
   Character data: Make Me a Hanzi (Arphic Public License, assets/data/LICENSE-hanzi.txt) - outlines + centre lines. */
const STROKE_NAMES = {
  人: '撇 捺', 口: '竖 横折 横', 目: '竖 横折 横 横 横', 手: '撇 横 横 竖钩', 日: '竖 横折 横 横', 月: '撇 横折钩 横 横', 云: '横 横 撇折 点', 木: '横 竖 撇 捺',
  山: '竖 竖折 竖', 水: '竖钩 横撇 撇 捺', 火: '点 撇 撇 捺', 石: '横 撇 竖 横折 横', 田: '竖 横折 横 竖 横', 禾: '撇 横 竖 撇 捺', 米: '点 撇 横 竖 撇 捺', 瓜: '撇 撇 竖提 点 捺',
  牛: '撇 横 横 竖', 羊: '点 撇 横 横 横 竖', 马: '横折 竖折折钩 横', 鸟: '撇 横折钩 点 竖折折钩 横', 大: '横 撇 捺', 小: '竖钩 撇 点', 上: '竖 横 横', 下: '横 竖 点',
  车: '横 撇折 横 竖', 门: '点 竖 横折钩', 灯: '点 撇 撇 点 横 竖钩', 伞: '撇 捺 点 撇 横 竖', 书: '横折 横折钩 竖 点', 本: '横 竖 撇 捺 横', 尺: '横折 横 撇 捺', 包: '撇 横折钩 横折 横 竖弯钩',
  床: '点 横 撇 横 竖 撇 捺', 衣: '点 横 撇 竖提 撇 捺', 巾: '竖 横折钩 竖', 杯: '横 竖 撇 点 横 撇 竖 点', 风: '撇 横折斜钩 撇 点', 雨: '横 竖 横折钩 竖 点 点 点 点', 电: '竖 横折 横 横 竖弯钩', 光: '竖 点 撇 横 撇 竖弯钩',
  从: '撇 点 撇 捺', 休: '撇 竖 横 竖 撇 捺', 林: '横 竖 撇 点 横 竖 撇 捺', 明: '竖 横折 横 横 撇 横折钩 横 横', 花: '横 竖 竖 撇 竖 撇 竖弯钩', 叶: '竖 横折 横 横 竖', 果: '竖 横折 横 横 横 竖 撇 捺', 竹: '撇 横 竖 撇 横 竖钩',
  龙: '横 撇 竖弯钩 撇 点', 兔: '撇 横撇 竖 横折 横 撇 竖弯钩 点', 狗: '撇 弯钩 撇 撇 横折钩 竖 横折 横', 鸡: '横撇 点 撇 横折钩 点 竖折折钩 横', 饭: '撇 横钩 竖提 撇 撇 横撇 捺', 汤: '点 点 提 横折折折钩 撇 撇', 肉: '竖 横折钩 撇 点 撇 点', 勺: '撇 横折钩 点',
};
const Hanzi = {
  data: null, p: null,
  load() {
    if (this.data) return Promise.resolve(this.data);
    if (!this.p) this.p = fetch('assets/data/hanzi.json').then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.json(); }).then(d => (this.data = d)).catch(e => { this.p = null; throw e; });
    return this.p;
  },
  /* strokes in svg space (y down, 1024 box): outline path (drawn in the flipped group), centre line, name */
  strokes(ch) {
    const d = this.data && this.data[ch]; if (!d) return null;
    const names = (STROKE_NAMES[ch] || '').split(' ');
    return d.s.map((o, i) => ({ outline: o, med: d.m[i].map(([x, y]) => [x, 900 - y]), name: names[i] || '' }));
  },
};

/* ---------------------------------------------------------------- geometry of strokes */
const Geo = {
  len(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; },
  resample(p, n) {
    if (p.length < 2) return Array.from({ length: n }, () => p[0] || [0, 0]);
    const L = this.len(p), out = [p[0]], step = L / (n - 1);
    let acc = 0, i = 1, prev = p[0];
    while (out.length < n - 1 && i < p.length) {
      const d = Math.hypot(p[i][0] - prev[0], p[i][1] - prev[1]);
      if (acc + d >= step && d > 0) { const t = (step - acc) / d; const q = [prev[0] + (p[i][0] - prev[0]) * t, prev[1] + (p[i][1] - prev[1]) * t]; out.push(q); prev = q; acc = 0; }
      else { acc += d; prev = p[i]; i++; }
    }
    while (out.length < n) out.push(p[p.length - 1]);
    return out;
  },
  mean(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += Math.hypot(a[i][0] - b[i][0], a[i][1] - b[i][1]); return s / a.length; },
  /* a drawn stroke against the stroke it should be (both in the frame's units; S = the frame's size) */
  judge(drawn, want, S, others) {
    const L = this.len(want), Ld = this.len(drawn), short = L < 0.16 * S;
    const d0 = drawn[0], d1 = drawn[drawn.length - 1], w0 = want[0], w1 = want[want.length - 1];
    const ds = Math.hypot(d0[0] - w0[0], d0[1] - w0[1]), dsRev = Math.hypot(d0[0] - w1[0], d0[1] - w1[1]);
    const A = this.resample(drawn, 24), B = this.resample(want, 24), m = this.mean(A, B), mRev = this.mean(A, B.slice().reverse());
    /* the drawn stroke is clearly nearer one of the strokes still to come (a dot of 雨 for the one beside it): order */
    const closer = (others || []).some(o => { const d = this.mean(A, this.resample(o, 24)); return d < m * 0.75 && d < 0.15 * S; });
    if (short) {                                     /* a dot-sized stroke: where, and roughly which way */
      const c = drawn.reduce((a, q) => [a[0] + q[0] / drawn.length, a[1] + q[1] / drawn.length], [0, 0]);
      const wc = [(w0[0] + w1[0]) / 2, (w0[1] + w1[1]) / 2], near = Math.hypot(c[0] - wc[0], c[1] - wc[1]) < 0.17 * S;
      const vd = [d1[0] - d0[0], d1[1] - d0[1]], vw = [w1[0] - w0[0], w1[1] - w0[1]];
      const dirOk = Ld < 0.05 * S || vd[0] * vw[0] + vd[1] * vw[1] > 0;
      if (near && dirOk && Ld < 0.45 * S && !closer) return { ok: true };
      return { ok: false, why: closer ? 'order' : near && !dirOk ? 'back' : 'start' };
    }
    /* the shape tolerance grows with the stroke (a long stroke may wander more), within 8 % .. 17 % of the frame */
    const tol = Math.min(0.17 * S, Math.max(0.08 * S, 0.38 * L)), ratio = Ld / L;
    if (m < tol && ds < 0.22 * S && ratio > 0.45 && ratio < 3 && !closer) return { ok: true };
    if (mRev < tol && dsRev < 0.22 * S) return { ok: false, why: 'back' };          /* the right line, the wrong way */
    if (closer || this.which(drawn, others, S)) return { ok: false, why: 'order' };
    if (ds >= 0.22 * S) return { ok: false, why: 'start' };
    return { ok: false, why: 'shape' };
  },
  /* the drawn stroke is (a good match of) a later stroke: the order is what went wrong */
  which(drawn, others, S) {
    if (!others) return null;
    const A = this.resample(drawn, 24);
    return others.some(o => this.mean(A, this.resample(o, 24)) < 0.15 * S) ? 'order' : null;
  },
};

/* ---------------------------------------------------------------- the writing frame */
let WSEQ = 0;
const INK = '#2B2118', HILITE = '#FFB35C';
class Writer {
  /* opt: { kind: 'zh' | 'en', glyph, level, x, y, size (zh: square side; en: height), onDone(clean), say: true } */
  constructor(st, opt) {
    this.st = st; this.opt = opt; this.kind = opt.kind; this.glyph = opt.glyph; this.level = opt.level || 1;
    this.id = ++WSEQ; this.k = 0; this.slips = 0; this.slipK = -1; this.done = false; this.paused = false;
    if (this.kind === 'zh') {
      this.S = 1024;
      this.strokes = Hanzi.strokes(opt.glyph).map(s => ({ med: s.med, outline: s.outline, name: s.name }));
      this.vb = [0, 0, 1024, 1024];
    } else {
      this.S = 120;
      const b = letterBox(opt.glyph), w = Math.max(70, b.x1 - b.x0 + 40), cx = (b.x0 + b.x1) / 2;
      this.strokes = LETTERS[opt.glyph].map(p => ({ med: p }));
      this.vb = [cx - w / 2, -14, w, 148];
    }
    this.build();
  }
  build() {
    const st = this.st, opt = this.opt, zh = this.kind === 'zh';
    const pap = this.el = el('div', opt.bare ? '' : 'paper ' + (zh ? 'tzg' : 'sxg'), Stage.el);
    pap.style.position = 'absolute'; pap.style.zIndex = opt.z || 12;
    st.els.push(pap);
    const s = this.svg = svg('svg', { viewBox: this.vb.join(' '), width: '100%', height: '100%' }, pap);
    s.style.overflow = 'visible';
    const defs = svg('defs', {}, s);
    /* the grid (none on a bare frame: the brush writing over a picture) */
    const g0 = svg('g', {}, s);
    if (opt.bare) { /* nothing */ } else if (zh) {
      svg('rect', { x: 8, y: 8, width: 1008, height: 1008, fill: 'none', stroke: '#E8414B', 'stroke-width': 12 }, g0);
      [['M512 20V1004'], ['M20 512H1004'], ['M20 20L1004 1004'], ['M1004 20L20 1004']].forEach(([d], i) => svg('path', { d, stroke: '#E8414B', 'stroke-width': i < 2 ? 5 : 3, 'stroke-dasharray': i < 2 ? '26 18' : '14 22', opacity: i < 2 ? 0.55 : 0.28, fill: 'none' }, g0));
    } else {
      const [x0, , w] = this.vb;
      [0, 40, 80, 120].forEach((y, i) => svg('line', { x1: x0 + 2, x2: x0 + w - 2, y1: y, y2: y, stroke: i === 2 ? '#E8414B' : '#6BB9F2', 'stroke-width': i === 2 ? 1.6 : 1.2, opacity: i === 2 ? 0.75 : 0.7 }, g0));
    }
    /* the glyph layers: guide (outline), done strokes, highlight, cues, trail */
    const flip = zh ? { transform: 'translate(0,900) scale(1,-1)' } : {};
    this.gGuide = svg('g', flip, s);
    this.gDone = svg('g', {}, s);
    this.gHi = svg('g', flip, s);
    this.gCue = svg('g', {}, s);
    this.gTrail = svg('g', {}, s);
    this.strokes.forEach((sk, i) => {
      if (zh) {
        sk.guide = svg('path', { d: sk.outline, fill: '#E3DACB' }, this.gGuide);
        const cp = svg('clipPath', { id: 'cp' + this.id + '_' + i }, defs);
        svg('path', { d: sk.outline, transform: 'translate(0,900) scale(1,-1)' }, cp);
      } else {
        sk.guide = svg('path', { d: this.dOf(sk.med), fill: 'none', stroke: '#E3DACB', 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, this.gGuide);
      }
      sk.L = Geo.len(sk.med);
    });
    this.setGuide();
    this.place();
    if (opt.bare) { this.gGuide.style.display = 'none'; return; }
    const self = this;
    K.reg(st, 'paper', pap, { draw: { start: p => self.dStart(p), move: p => self.dMove(p), end: () => {}, cancel: () => self.clearTrail() }, tap: false });
    this.cue();
  }
  dOf(pts) { return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(''); }
  /* the outline: how much of it shows at this level */
  setGuide() {
    const lv = this.level, op = this.free ? 1 : lv >= 5 ? 0 : lv === 4 ? 0.32 : 1;
    this.gGuide.style.opacity = op;
  }
  place(x, y, size) {
    const o = this.opt;
    if (x != null) { o.x = x; o.y = y; o.size = size; }
    const h = o.size, w = this.kind === 'zh' ? h : h * this.vb[2] / this.vb[3];
    this.box = { x: o.x - w / 2, y: o.y - h / 2, w, h };
    place(this.el, this.box.x, this.box.y, w, h);
  }
  /* stage point -> frame units */
  toG(p) { const b = this.box, v = this.vb; return [v[0] + (p.x - b.x) / b.w * v[2], v[1] + (p.y - b.y) / b.h * v[3]]; }
  toStage(q) { const b = this.box, v = this.vb; return { x: b.x + (q[0] - v[0]) / v[2] * b.w, y: b.y + (q[1] - v[1]) / v[3] * b.h }; }
  /* the cues for the stroke to write now: its highlight, the green start dot (numbered), the arrow */
  cue(force) {
    this.gHi.innerHTML = ''; this.gCue.innerHTML = '';
    const sk = this.strokes[this.k]; if (!sk || this.done) return;
    const lv = this.free ? 1 : this.level, zh = this.kind === 'zh', S = this.S;
    if (lv <= 3 || force) {
      if (zh) svg('path', { d: sk.outline, fill: HILITE, stroke: '#E8862B', 'stroke-width': 10 }, this.gHi);
      else svg('path', { d: this.dOf(sk.med), fill: 'none', stroke: HILITE, 'stroke-width': 11.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, this.gHi);
      this.gHi.animate([{ opacity: 1 }, { opacity: 0.55 }, { opacity: 1 }], { duration: 1400, iterations: Infinity });      /* the stroke to write now: clearly orange, breathing */
    }
    if (lv <= 2 || force || this.slipK === this.k) {
      const p0 = sk.med[0], r = zh ? 46 : 6.5;
      svg('circle', { cx: p0[0], cy: p0[1], r, fill: '#5CC46E', stroke: INK, 'stroke-width': zh ? 9 : 1.4 }, this.gCue);
      const t = svg('text', { x: p0[0], y: p0[1] + r * 0.36, 'text-anchor': 'middle', 'font-size': r * 1.05, 'font-weight': 900, fill: '#fff', 'font-family': 'system-ui, sans-serif' }, this.gCue);
      t.textContent = String(this.k + 1);
    }
    if (lv === 1 || force || this.slipK === this.k) {
      /* the arrow: the centre line, a little inside, marching dashes and a head at the end */
      const m = sk.med, sw = zh ? 16 : 2.2;
      const a = svg('path', { d: this.dOf(m), fill: 'none', stroke: '#2E6FD8', 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': zh ? '34 30' : '5 4.5', opacity: 0.9 }, this.gCue);
      a.animate([{ strokeDashoffset: zh ? 64 : 9.5 }, { strokeDashoffset: 0 }], { duration: 600, iterations: Infinity });
      const e = m[m.length - 1], q = m[Math.max(0, m.length - 3)], ang = Math.atan2(e[1] - q[1], e[0] - q[0]), hs = zh ? 58 : 7;
      const pts = [[e[0] + Math.cos(ang) * hs * 0.5, e[1] + Math.sin(ang) * hs * 0.5], [e[0] + Math.cos(ang + 2.5) * hs, e[1] + Math.sin(ang + 2.5) * hs], [e[0] + Math.cos(ang - 2.5) * hs, e[1] + Math.sin(ang - 2.5) * hs]];
      svg('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z', fill: '#2E6FD8', stroke: INK, 'stroke-width': zh ? 6 : 0.8, 'stroke-linejoin': 'round' }, this.gCue);
    }
  }
  /* the ink of a finished stroke sweeps along its centre line */
  ink(i, color, dur) {
    const sk = this.strokes[i], zh = this.kind === 'zh';
    let p;
    if (zh) {
      p = svg('path', { d: this.dOf(sk.med), fill: 'none', stroke: color || INK, 'stroke-width': 150, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'clip-path': 'url(#cp' + this.id + '_' + i + ')' }, this.gDone);
    } else {
      p = svg('path', { d: this.dOf(sk.med), fill: 'none', stroke: color || INK, 'stroke-width': 9.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, this.gDone);
    }
    const L = sk.L + (zh ? 160 : 10);
    p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    const a = p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: T(dur || 300) + 1, easing: 'cubic-bezier(.3,.1,.3,1)', fill: 'forwards' });
    a.onfinish = () => { p.style.strokeDashoffset = 0; };
    return p;
  }
  /* the brush shows strokes (all from k on, or just one), in the highlight colour, then they fade */
  async demo(st, only, keep, color) {
    const sc = st.scope, ids = only != null ? [only] : this.strokes.map((_, i) => i).filter(i => i >= this.k);
    this.paused = true; this.gCue.style.opacity = 0;
    const brush = img('assets/props/brush.png', '', Stage.el); brush.style.position = 'absolute'; brush.style.zIndex = 30; brush.style.pointerEvents = 'none';
    const bs = this.box.w * (this.kind === 'zh' ? 0.24 : 0.5);
    st.els.push(brush);
    const shown = [];
    for (const i of ids) {
      if (st.scope.dead) return;
      const sk = this.strokes[i], dur = Math.max(420, Math.min(900, sk.L / this.S * 1400));
      shown.push(this.ink(i, color || '#FF9F43', dur));
      Sfx.nz(0, dur / 1000, 1400, 900, 0.6, 0.05);
      /* the brush tip follows the centre line */
      const pts = Geo.resample(sk.med, 10).map(q => this.toStage(q));
      const kf = pts.map(q => ({ left: (q.x - bs * 0.18) + 'px', top: (q.y - bs * 0.92) + 'px' }));
      place(brush, pts[0].x - bs * 0.18, pts[0].y - bs * 0.92, bs, bs);
      await sc.anim(brush, kf, { duration: dur, easing: 'linear', fill: 'forwards' });
      await sc.wait(160);
    }
    brush.remove();
    if (keep) { this.paused = false; return; }
    await sc.wait(250);
    shown.forEach(p => p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T(300) + 1, fill: 'forwards' }).onfinish = () => p.remove());
    await sc.wait(320);
    this.paused = false; this.gCue.style.opacity = 1;
  }
  /* the finger writes */
  dStart(p) { if (this.done || this.paused || !this.armed) return; this.clearTrail(); this.trail = [this.toG(p)]; this.trailEl = svg('path', { d: '', fill: 'none', stroke: '#2E6FD8', 'stroke-width': this.kind === 'zh' ? 54 : 7.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.85 }, this.gTrail); this.trailDraw(); }
  dMove(p) { if (!this.trail) return; const q = this.toG(p), l = this.trail[this.trail.length - 1]; if (Math.hypot(q[0] - l[0], q[1] - l[1]) < this.S * 0.008) return; this.trail.push(q); this.trailDraw(); }
  trailDraw() { if (this.trailEl) this.trailEl.setAttribute('d', this.trail.length > 1 ? this.dOf(this.trail) : 'M' + this.trail[0][0] + ' ' + this.trail[0][1] + 'l0.1 0'); }
  clearTrail() { if (this.trailEl) { const t = this.trailEl; this.trailEl = null; t.animate([{ opacity: 0.85 }, { opacity: 0 }], { duration: T(260) + 1, fill: 'forwards' }).onfinish = () => t.remove(); } this.trail = null; }
  /* a stroke in stage points (the gesture): judged; returns { ok, why, done } */
  stroke(pts) {
    if (this.done || this.paused || !this.armed) return null;
    const drawn = pts.map(p => this.toG(Array.isArray(p) ? { x: p[0], y: p[1] } : p));
    if (!this.trail) { this.trail = drawn; this.trailEl = svg('path', { d: this.dOf(drawn), fill: 'none', stroke: '#2E6FD8', 'stroke-width': this.kind === 'zh' ? 54 : 7.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.85 }, this.gTrail); }
    const sk = this.strokes[this.k];
    const res = Geo.judge(drawn.length ? drawn : [[0, 0]], sk.med, this.S, this.strokes.slice(this.k + 1).map(s => s.med));
    if (this.trailEl) { const t = this.trailEl; this.trailEl = null; t.animate([{ opacity: 0.85 }, { opacity: 0 }], { duration: T(res.ok ? 160 : 420) + 1, fill: 'forwards' }).onfinish = () => t.remove(); }
    this.trail = null;
    if (res.ok) {
      this.ink(this.k, INK, 260);
      this.k++;
      if (this.k >= this.strokes.length) { this.done = true; this.gHi.innerHTML = ''; this.gCue.innerHTML = ''; res.done = true; }
      else this.cue();
    } else {
      this.slips++; this.slipK = this.k;
      this.cue(true);
    }
    res.name = sk.name;
    return res;
  }
  /* for tests and the helper: the stroke to write now, in stage points (reversed = written the wrong way) */
  expected(rev) { const sk = this.strokes[this.k]; if (!sk) return null; const m = Geo.resample(sk.med, 14).map(q => this.toStage(q)); return (rev ? m.reverse() : m).map(p => [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10]); }
  center() { return { x: this.box.x + this.box.w / 2, y: this.box.y + this.box.h / 2 }; }
}
/* the factual line for a slip (never "wrong") */
const SLIP = { start: '从绿点开始写', back: '跟着箭头写', order: '先写这一笔', shape: '跟着箭头写' };
