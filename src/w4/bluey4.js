/* ================================================================ 神笔海 ⑦ Bluey · 大家庭 (bluey4): 爷 奶 妹 女 子 (docs/W4-DESIGN.md §6 ⑦)
   认字 「牵！」顺着线找一找 (follow-the-line) · 写字 女 子 (W4X.Write) · 英文 「摆！」照句子摆一摆 (read-and-place) · 挑战 「读！」
   哪句说得通 (sensible-ending). 爷 is 葫芦爷爷 and 妹 is Bingo (the client's own pictures, never redrawn); 奶 is the new grandma.
   Built on the template of src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  W4X.lines(['谁拉爷风筝？', '谁拉奶风筝？', '谁拉妹风筝？', '谁拉女风筝？', '谁拉子风筝？', '点拉线的人！', '把它拖过去！']);
  const GOLD = '#FFB400';

  /* ---------------------------------------------------------------- ⑦-1 认字 「牵！」 顺着线找一找
     Five kites in the sky, a character on each; five of the family on the grass below - Bluey, Bingo, Bandit, Chilli and 葫芦爷爷
     (the client's pictures) - each holding a string. The strings run from the kites down to the hands and cross. Tap the one who
     holds X's kite (a tap on a kite only says how: "点拉线的人！"). Levels: 1 the strings run straight down, the picture on the
     task card; 2 heard only, X's string crosses one other; 3 every string crosses another, look-alikes and an old character on
     the kites; 4 every string bends twice and they cross more; 5 every string the same colour (1-4: five colours). A random tap
     is right 1 time in 5. Its 2nd hint lights the top of X's string (real help: no star). */
  const HOLD = ['bluey', 'bingo', 'bandit', 'chilli', 'grandpa'];
  const LINE_C = ['#E8554A', '#2E6FD8', '#3FAE4A', '#F59A4A', '#8E6CFF'], SAME_C = '#7A5A3A', KITE_C = ['#FFD23C', '#7BC8F6', '#FF8DB3', '#9BE07A', '#FFB37A'];
  const inversions = kp => { let n = 0; for (let i = 0; i < kp.length; i++) for (let j = i + 1; j < kp.length; j++) if (kp[i] > kp[j]) n++; return n; };
  const crossOf = (kp, i) => kp.filter((x, j) => (j < i && x > kp[i]) || (j > i && x < kp[i])).length;
  /* which kite each holder's string comes from (kp[holder] = kite place) */
  function strings(G, lv, a) {
    const id = [0, 1, 2, 3, 4];
    if (lv <= 1) return id;
    if (lv === 2) { const b = a === 4 ? 3 : a === 0 ? 1 : G.rng() < 0.5 ? a - 1 : a + 1, kp = id.slice(); kp[a] = b; kp[b] = a; return kp; }
    for (let t = 0; t < 600; t++) {
      const kp = G.rng.shuffle(id.slice()), n = inversions(kp);
      if (kp.every((x, i) => crossOf(kp, i) >= 1) && (lv === 3 ? n >= 3 && n <= 5 : n >= 6)) return kp;
    }
    return lv === 3 ? [1, 0, 3, 4, 2] : [3, 4, 1, 0, 2];
  }
  /* the five characters of a level (W4X.opts), every one known to this child (§5.3): 女 cannot have 奶 妹 beside it (they hold it),
     and with too few left the engine's options fall back on any character - those are swapped for known ones */
  function known5(G, lv, answer) {
    const kn = W4X.known(G), holds = HOLDS[answer] || '', o = W4X.opts(G, lv, answer, 5);
    const spare = G.rng.shuffle(kn.filter(k => k !== answer && !o.includes(k) && !holds.includes(k) && ITEM[k] && ITEM[k].kind === 'zh' && !ITEM[k].fw));
    return o.map(k => (k === answer || kn.includes(k) ? k : spare.shift() || k));
  }
  const KITE_SVG = c => '<svg viewBox="0 0 100 130" width="100%" height="100%"><path d="M50 104C46 112 56 116 50 124" fill="none" stroke="#2B2118" stroke-width="3"/><path d="M44 110L50 114L44 118ZM56 116L50 120L56 124Z" fill="#E8554A" stroke="#2B2118" stroke-width="2"/>'
    + '<path d="M50 4L95 50L50 104L5 50Z" fill="' + c + '" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/><path d="M50 4V104M5 50H95" stroke="#2B2118" stroke-width="2.5" opacity=".35"/></svg>';
  /* a string: from the kite's tail to the hand - a soft curve, or (levels 4-5) one that bends twice */
  function curve(P) {
    if (P.length === 2) { const [a, b] = P, d = b[1] - a[1]; return 'M' + a[0] + ' ' + a[1] + 'C' + a[0] + ' ' + (a[1] + d * 0.45) + ' ' + b[0] + ' ' + (b[1] - d * 0.45) + ' ' + b[0] + ' ' + b[1]; }
    let s = 'M' + P[0][0] + ' ' + P[0][1];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || P[i + 1];
      s += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0] + ' ' + p2[1];
    }
    return s;
  }
  const Kites = {
    rule: 'follow-the-line', verb: '牵！', intro: '顺着线找一找！', props: [],
    gen(G, o) {
      const lv = o.level, pool = poolOf(G, 'zh', false), answer = W4X.pick(G, pool), opts = known5(G, lv, answer), a = opts.indexOf(answer), lk = LOOK[answer] || '';
      const kp = strings(G, lv, a), wig = lv >= 4 ? opts.map(() => [G.rng.int(34, 62) * (G.rng() < 0.5 ? -1 : 1), G.rng.int(34, 62) * (G.rng() < 0.5 ? -1 : 1)]) : null;
      return { k: [answer, opts.join(''), kp.join('')], answer, opts, kp, wig, who: G.rng.shuffle(HOLD.slice()), pic: lv <= 1 ? 1 : 0, same: lv >= 5 ? 1 : 0,
        cross: inversions(kp), mine: crossOf(kp, a), look: opts.filter(k => k !== answer && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* the picture gone, crossings (X's own counts double), look-alikes and old characters, strings that bend, one colour for all */
    hard(q) { return (1 - q.pic) + q.cross * 0.3 + q.mine * 0.3 + q.look * 0.5 + q.rev * 0.4 + (q.wig ? 2 : 0) + q.same * 2; },
    geo() {
      return L() ? { kx: 512, ky: 112, kw: 124, kh: 150, kd: 176, hy: 506, hw: 150, hh: 178, hd: 176 }
        : { kx: 352, ky: 232, kw: 112, kh: 136, kd: 134, hy: 756, hw: 126, hh: 170, hd: 134 };
    },
    async present(st) {
      const q = st.q;
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      st.opts = q.opts.slice();
      const kites = []; q.kp.forEach((j, i) => { kites[j] = q.opts[i]; });
      st.kiteCh = kites;
      const ly = st.lineSvg = svg('svg', { width: Stage.W, height: Stage.H }); Object.assign(ly.style, { position: 'absolute', left: '0px', top: '0px', zIndex: 41, pointerEvents: 'none', overflow: 'visible' }); Stage.el.appendChild(ly); st.els.push(ly);
      st.lines = q.opts.map((k, i) => { const g = svg('g', {}, ly), c = q.same ? SAME_C : LINE_C[i]; return { g, under: svg('path', { fill: 'none', stroke: '#2B2118', 'stroke-width': 9, 'stroke-linecap': 'round' }, g), top: svg('path', { fill: 'none', stroke: c, 'stroke-width': 5, 'stroke-linecap': 'round' }, g), dot: svg('circle', { r: 7, fill: c, stroke: '#2B2118', 'stroke-width': 3 }, g) }; });
      st.kites = kites.map((k, j) => {
        const d = ZX.thing(st, 120, 150, 7, 'item'); d.innerHTML = KITE_SVG(KITE_C[j]);
        const c = el('div', '', d); Object.assign(c.style, { position: 'absolute', left: '22%', top: '15%', width: '56%', height: '46%', borderRadius: '50%', background: '#FFFDF6', boxShadow: '0 0 0 3px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        c.appendChild(Glyph.zh(k, 52)); d._c = c;
        K.reg(st, 'kite' + j, d, {}); K.pop(st, d, 60 * j);
        return d;
      });
      st.cards = q.who.map((id, i) => {
        const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; Object.assign(d.style, { background: 'rgba(255,253,246,.72)' });
        const im = img('assets/chars/' + id + '.png', '', d); Object.assign(im.style, { width: '88%', height: '88%', objectFit: 'contain', pointerEvents: 'none' });
        st.els.push(d); K.reg(st, 'card' + i, d, {}); K.pop(st, d, 300 + 60 * i);
        return d;
      });
      this.place(st);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
      K.say(st, '谁拉' + q.answer + '风筝？');
    },
    /* the points a string passes: the kite's tail, (two bends), the hand */
    pts(st, i, rev) {
      const g = this.geo(), q = st.q, j = q.kp[i], a = [g.kx + (j - 2) * g.kd, g.ky + g.kh - 4], b = [g.kx + (i - 2) * g.hd, g.hy + 6];
      let P = [a, b];
      if (q.wig) { const d = b[1] - a[1]; P = [a, [Math.round(a[0] + (b[0] - a[0]) / 3 + q.wig[i][0]), Math.round(a[1] + d / 3)], [Math.round(a[0] + 2 * (b[0] - a[0]) / 3 + q.wig[i][1]), Math.round(a[1] + 2 * d / 3)], b]; }
      return rev ? P.slice().reverse() : P;
    },
    place(st) {
      if (!st.kites) return;
      const g = this.geo();
      st.kites.forEach((d, j) => place(d, Math.round(g.kx + (j - 2) * g.kd - g.kw / 2), g.ky, g.kw, g.kh));
      st.cards.forEach((d, i) => place(d, Math.round(g.kx + (i - 2) * g.hd - g.hw / 2), g.hy, g.hw, g.hh));
      st.lines.forEach((l, i) => { const P = this.pts(st, i), dd = curve(P); l.under.setAttribute('d', dd); l.top.setAttribute('d', dd); l.dot.setAttribute('cx', P[P.length - 1][0]); l.dot.setAttribute('cy', P[P.length - 1][1]); });
      (st.traces || []).forEach(t => t.redo());
    },
    decor(G) { this.chars.forEach(id => hideActor(G.actors[id])); },
    /* a string lit along its length: gold from the kite down, or blue from the hand up; frac: only its first part */
    trace(st, i, color, up, frac, ms) {
      const p = svg('path', { fill: 'none', stroke: color, 'stroke-width': 11, 'stroke-linecap': 'round', opacity: 0.95 }, st.lineSvg);
      const t = { redo: () => { p.setAttribute('d', curve(this.pts(st, i, up))); const n = p.getTotalLength(); p.style.strokeDasharray = (n * (frac || 1)) + ' ' + (n + 20); } };
      t.redo(); (st.traces = st.traces || []).push(t);
      const n = p.getTotalLength();
      st.scope.anim(p, [{ strokeDashoffset: n * (frac || 1) }, { strokeDashoffset: 0 }], { duration: ms || 700, easing: EASE.glide });
      return p;
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      if (/^kite\d$/.test(p.id || '')) { K.wiggle(st, st.map[p.id]); if (!st.toldHow || Clock.t() - st.toldHow > 4000) { st.toldHow = Clock.t(); Voice.sayNow('点拉线的人！', { tag: 'how' }); } return 'free'; }
      const i = K.cardIndex(p.id); if (i < 0) return false;
      st.tapped = i; Sfx.tap(); Session.submit(st, st.opts[i]);
      return 'ok';
    },
    async reveal(st) {
      const q = st.q, i = q.opts.indexOf(q.answer), kt = st.kites[q.kp[i]], b = box(kt);
      this.trace(st, i, GOLD, false, 1, 500);
      K.hop(st, st.cards[i], 26); Sfx.reveal();
      st.scope.anim(kt, [{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(-26px) rotate(-8deg)' }, { transform: 'translateY(0) rotate(0)' }], { duration: 700, fill: 'none' });
      await ZX.alive(st, q.answer, clamp(b.x + b.w / 2 + (b.x > Stage.W / 2 ? -150 : 150), 90, Stage.W - 90), b.y + b.h / 2 + 30, 140);
      sayItem(q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 the one he tapped in blue, his string lit from his hand up to its kite, that kite's picture ("这是女" was just
       said); 2 X's string lit gold from its kite down (a beat); 3 the one holding it in gold with X's picture: "这个是爷" */
    async explain(st, ans) {
      const q = st.q, iC = st.tapped, iR = q.opts.indexOf(q.answer);
      EX.ring(st, st.cards[iC], 'chosen');
      this.trace(st, iC, EX_BLUE, true, 1, 500);
      await EX.wait(st, 420);
      EX.picOver(st, st.kites[q.kp[iC]], ans, 'chosen', 92);
      await EX.wait(st, 420);
      await W4X.exBeat(st, () => { this.trace(st, iR, GOLD, false, 1, 650); EX.outline(st, st.kites[q.kp[iR]]); }, 750);
      await W4X.exRight(st, st.cards[iR], q.answer, [W4X.thatIs(q.answer)]);
    },
    /* the 2nd hint (real help): the top part of X's string lights up */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone) return; st.hintDone = true;
      this.trace(st, st.q.opts.indexOf(st.q.answer), GOLD, false, 0.45, 900);
    },
    next(st, strat) {
      if (!st.cards || st.submitted) return null;
      const r = st.opts.indexOf(st.q.answer), i = strat === 'wrong' ? (r + 1 + (st.gen || 0) % 4) % 5 : r;
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    snap(st) { return { opts: st.opts || null, kp: st.q.kp }; },
    iconNode() { const d = el('div'); d.innerHTML = KITE_SVG('#7BC8F6').replace('</svg>', '<path d="M50 104C60 120 30 126 44 140" fill="none" stroke="#E8554A" stroke-width="4"/></svg>'); Object.assign(d.style, { width: '62%', height: '72%' }); return d; },
  };

  /* ---------------------------------------------------------------- English sentences as glyphs (the app's own letters) */
  const PUNCT = { '.': '<circle cx="14" cy="72" r="9"/>', '!': '<rect x="7" y="4" width="14" height="50" rx="7"/><circle cx="14" cy="72" r="9"/>',
    '?': '<path d="M4 22C4 8 34 2 38 20C41 34 22 36 21 52" fill="none" stroke="#2B2118" stroke-width="10" stroke-linecap="round"/><circle cx="21" cy="72" r="8"/>', ',': '<path d="M14 64C24 66 22 84 10 92" fill="none" stroke="#2B2118" stroke-width="9" stroke-linecap="round"/>' };
  const mark = (c, h) => { const w = c === '?' ? 46 : 30, s = svg('svg', { viewBox: '0 -8 ' + w + ' 136', width: Math.round(h * w / 136), height: h, class: 'gly' }); s.innerHTML = '<g fill="#2B2118">' + PUNCT[c] + '</g>'; return s; };
  function wordsRow(text, h) {
    const row = el('div', ''); Object.assign(row.style, { display: 'flex', alignItems: 'flex-end', gap: Math.round(h * 0.3) + 'px', pointerEvents: 'none' });
    let w = 0; row.words = [];
    text.split(' ').forEach((tok, j) => {
      const m = /^([A-Za-z]+)([.,!?]?)$/.exec(tok) || [tok, tok, ''], wd = el('div', '', row); Object.assign(wd.style, { display: 'flex', alignItems: 'flex-end', position: 'relative' });
      const g = Glyph.word(m[1], h); wd.appendChild(g); w += Number(g.getAttribute('width')) + (j ? Math.round(h * 0.3) : 0);
      if (m[2]) { const p = mark(m[2], h); wd.appendChild(p); w += Number(p.getAttribute('width')); }
      row.words.push(wd);
    });
    row.w = w;
    return row;
  }

  /* ---------------------------------------------------------------- ⑦-3 英文 「摆！」 照句子摆一摆
     Bluey's living room: a bed, an open box and a mat (drawn here, side view: there is room under the bed and inside the box).
     A sentence card (not said: a tap says it, and that question earns no star) - "The cat is on the bed." Drag the thing the
     sentence names to the place it says: in the box, on the bed / the box / the mat, under the bed, by (beside) one of them.
     Levels: 1 on and in only, two things - the sentence's noun shows its little picture; 2 under too, two things, no picture
     (read the noun); 3 by too, three things; 4 the mat as well, five things, eight places; 5 two sentences, two things to place
     (both right). A random drag is right 1 time in 6 at level 1 (two things x three places), 1 in 8, 1 in 18, 1 in 40, at level
     5 about 1 in 800. Its 2nd hint shows the noun's picture under it (real help: no star; at level 1 it is there already). */
  const SPOTS = { 1: ['on:bed', 'in:box', 'on:box'], 2: ['on:bed', 'in:box', 'on:box', 'under:bed'], 3: ['on:bed', 'in:box', 'on:box', 'under:bed', 'by:bed', 'by:box'] };
  SPOTS[4] = SPOTS[5] = SPOTS[3].concat(['on:mat', 'by:mat']);
  const NTHINGS = [0, 2, 2, 3, 5, 5];
  const sentOf = (w, s) => { const [rel, f] = s.split(':'); return 'The ' + w + ' is ' + rel + ' the ' + f + '.'; };
  const BED_SVG = '<svg viewBox="0 0 300 220" width="100%" height="100%" preserveAspectRatio="none"><rect x="4" y="20" width="26" height="200" rx="8" fill="#B5793F" stroke="#2B2118" stroke-width="5"/><rect x="270" y="64" width="26" height="156" rx="8" fill="#B5793F" stroke="#2B2118" stroke-width="5"/>'
    + '<rect x="26" y="88" width="248" height="36" rx="12" fill="#FFFDF6" stroke="#2B2118" stroke-width="5"/><path d="M96 82H264C270 82 274 86 274 92V118C274 124 270 128 264 128H96Z" fill="#6BB9F2" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>'
    + '<rect x="36" y="66" width="56" height="28" rx="12" fill="#FFFFFF" stroke="#2B2118" stroke-width="4"/><rect x="20" y="122" width="262" height="14" rx="5" fill="#9A6433" stroke="#2B2118" stroke-width="4"/>'
    + '<path d="M120 100H250M120 112H250" stroke="#4FA3E8" stroke-width="3"/></svg>';
  const BOX_BACK = '<svg viewBox="0 0 160 130" width="100%" height="100%" preserveAspectRatio="none"><path d="M14 52L4 14L58 18L62 56Z" fill="#E3AE68" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M146 52L156 14L102 18L98 56Z" fill="#E3AE68" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<path d="M12 44H148L152 60H8Z" fill="#7A4E22" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/></svg>';
  const BOX_FRONT = '<svg viewBox="0 0 160 130" width="100%" height="100%" preserveAspectRatio="none"><rect x="8" y="56" width="144" height="72" rx="6" fill="#D99A50" stroke="#2B2118" stroke-width="5"/><rect x="66" y="56" width="28" height="72" fill="#F2D49B" opacity=".8"/><path d="M8 56H152" stroke="#2B2118" stroke-width="5"/></svg>';
  const MAT_SVG = '<svg viewBox="0 0 180 34" width="100%" height="100%" preserveAspectRatio="none"><path d="M18 3H178L162 31H2Z" fill="#5CC46E" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M30 8H168M22 16H160M14 24H152" stroke="#3E9E4E" stroke-width="3"/></svg>';
  const Place = {
    rule: 'read-and-place', kind0: 'en', verb: '摆！', intro: '读一读，摆一摆！', props: [],
    gen(G, o) {
      const lv = o.level, spots = SPOTS[lv], words = W4D.placeThings.map(t => t[0]), two = lv >= 5;
      const w1 = bagFrom(G, 'pw', words), s1 = bagFrom(G, 'ps' + lv, spots), want = [[w1, s1]];
      if (two) { const w2 = G.rng.pick(words.filter(w => w !== w1)), s2 = G.rng.pick(spots.filter(s => s !== s1 && s.split(':')[1] !== s1.split(':')[1])); want.push([w2, s2]); }
      const tray = W4X.put(G, G.rng.shuffle(words.filter(w => !want.some(x => x[0] === w))).slice(0, NTHINGS[lv] - want.length).concat(want.slice(1).map(x => x[0])), w1);
      const n = tray.length * spots.length, chance = two ? (2 / n) * (1 / ((tray.length - 1) * spots.length)) : 1 / n;
      return { k: [want.map(x => x.join('@')).join('+'), tray.join('')], answer: 'ok', build: 1, chance: +chance.toFixed(5), want, tray, spots, mat: lv >= 4 ? 1 : 0, pic: lv <= 1 ? 1 : 0, two: two ? 1 : 0,
        text: want.map(x => sentOf(x[0], x[1])) };
    },
    itemOf() { return null; },
    /* the noun's picture gone, more things to choose from, more places (under, by, the mat), two sentences */
    hard(q) { return (1 - q.pic) + q.tray.length * 0.6 + q.spots.length * 0.3 + q.mat + q.two * 3; },
    /* the room: where the bed, the box and the mat stand (floor F), for this orientation */
    room(st) {
      const mat = st.q.mat;
      if (L()) {
        const F = 516, x0 = mat ? 24 : 150, bed = { x: x0, y: F - 206, w: 280, h: 206 }, box = { x: x0 + 400, y: F - 130, w: 160, h: 130 };
        return { F1: F, F2: F, bed, box, mat: mat ? { x: box.x + 280, y: F - 34, w: 180, h: 34 } : null };
      }
      const F1 = 560, F2 = 790, bed = { x: 70, y: F1 - 206, w: 280, h: 206 }, box = { x: mat ? 40 : 200, y: F2 - 130, w: 160, h: 130 };
      return { F1, F2, bed, box, mat: mat ? { x: box.x + 270, y: F2 - 34, w: 170, h: 34 } : null };
    },
    zone(R, s) {
      const b = R.bed, x = R.box, m = R.mat;
      return { 'on:bed': { x: b.x + 50, y: b.y - 60, w: b.w - 80, h: 130 }, 'under:bed': { x: b.x + 40, y: b.y + 128, w: b.w - 80, h: R.F1 - b.y - 128 }, 'by:bed': { x: b.x + b.w + 5, y: R.F1 - 120, w: 110, h: 120 },
        'in:box': { x: x.x + 10, y: x.y + 40, w: x.w - 20, h: x.h - 40 }, 'on:box': { x: x.x, y: x.y - 100, w: x.w, h: 130 }, 'by:box': { x: x.x + x.w + 5, y: R.F2 - 120, w: 110, h: 120 },
        'on:mat': m && { x: m.x, y: R.F2 - 120, w: m.w, h: 120 }, 'by:mat': m && { x: m.x + m.w + 5, y: R.F2 - 120, w: 100, h: 120 } }[s];
    },
    /* where a thing put there stands: its box (size S) and whether the box's front hides its lower part */
    seat(R, s, S) {
      const b = R.bed, x = R.box, m = R.mat, at = (cx, bottom, z) => ({ x: Math.round(cx - S / 2), y: Math.round(bottom - S), w: S, h: S, z: z || 12 });
      return { 'on:bed': at(b.x + b.w * 0.6, b.y + 84), 'under:bed': at(b.x + b.w / 2, R.F1 - 2), 'by:bed': at(b.x + b.w + 60, R.F1),
        'in:box': at(x.x + x.w / 2, x.y + 98, 7), 'on:box': at(x.x + x.w / 2, x.y + 54), 'by:box': at(x.x + x.w + 60, R.F2),
        'on:mat': m && at(m.x + m.w / 2, R.F2 - 12), 'by:mat': m && at(m.x + m.w + 55, R.F2) }[s];
    },
    async present(st) {
      const q = st.q;
      st.put = {}; st.done = []; st.noHelp = !!q.pic;      /* level 1: the noun's picture is there already - the 2nd hint adds nothing */
      st.bed = ZX.thing(st, 280, 206, 4, 'item'); st.bed.innerHTML = BED_SVG;
      st.boxB = ZX.thing(st, 160, 130, 5, 'item'); st.boxB.innerHTML = BOX_BACK;
      st.boxF = ZX.thing(st, 160, 130, 9, 'item'); st.boxF.innerHTML = BOX_FRONT;
      if (q.mat) { st.matEl = ZX.thing(st, 180, 34, 4, 'item'); const mi = img(OBJURL('mat'), '', st.matEl); Object.assign(mi.style, { width: '100%', height: '100%', objectFit: 'fill' }); mi.onerror = () => { st.matEl.innerHTML = MAT_SVG; }; }
      [st.bed, st.boxB, st.boxF, st.matEl].forEach(e => { if (e) e.style.pointerEvents = 'none'; });
      /* the sentence card: one or two sentences, read (a tap says them) */
      const card = st.readEl = ZX.thing(st, 10, 10, 7, 'item'), maxW = L() ? 760 : 660;
      Object.assign(card.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '50px', background: 'rgba(255,255,255,.96)', borderRadius: '22px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25)', padding: '12px 18px 50px' });      /* room under the noun for its little picture (level 1, the hint) */
      let h = q.two ? 46 : 60; q.text.forEach(t => { const pr = wordsRow(t, 100); h = Math.min(h, Math.floor(100 * (maxW - 40) / pr.w)); });
      st.rows = q.text.map(t => { const r = wordsRow(t, h); card.appendChild(r); return r; });
      st.nounPics = st.rows.map((r, i) => {
        const p = W4X.pic(W4D.placeThings.find(t => t[0] === q.want[i][0])[1], 46); Object.assign(p.style, { position: 'absolute', left: '50%', top: '100%', marginLeft: '-23px', marginTop: '2px', visibility: q.pic ? '' : 'hidden' });
        r.words[1].appendChild(p); return p;
      });
      card._w = Math.max(...st.rows.map(r => r.w)) + 36; card._h = q.text.length * h + (q.text.length - 1) * 50 + 62;
      K.reg(st, 'read', card, {}); st.readText = q.text.join(' ');
      st.things = q.tray.map((w, i) => {
        const d = ZX.thing(st, 104, 104, 12, 'item'); Object.assign(d.style, { borderRadius: '24px', background: 'rgba(255,253,246,.85)', boxShadow: '0 0 0 3px rgba(43,33,24,.5)' });
        d.appendChild(W4X.pic(W4D.placeThings.find(t => t[0] === w)[1], 88)); d.firstChild.style.margin = '8px';
        K.reg(st, 'thing' + i, d, { drag: true, drops: () => q.spots.map(s => ({ id: s, rect: () => this.zone(this.room(st), s) })) });
        K.pop(st, d, 300 + 70 * i);
        return d;
      });
      st.rights = st.things.slice();
      this.place(st);
      K.pop(st, card);
      st.prompt = '读一读，摆一摆！';
    },
    traySlot(st, i) {
      const n = st.things.length, Lx = L(), gap = 26, w = n * 104 + (n - 1) * gap, x0 = (Lx ? 560 : 352) - w / 2;
      return { x: Math.round(x0 + i * (104 + gap)), y: Lx ? 566 : 866, w: 104, h: 104 };
    },
    place(st) {
      if (!st.things) return;
      const R = this.room(st), Lx = L();
      place(st.bed, R.bed.x, R.bed.y, R.bed.w, R.bed.h); place(st.boxB, R.box.x, R.box.y, R.box.w, R.box.h); place(st.boxF, R.box.x, R.box.y, R.box.w, R.box.h);
      if (st.matEl) place(st.matEl, R.mat.x, R.mat.y, R.mat.w, R.mat.h);
      const c = st.readEl; place(c, Math.round((Lx ? 512 : 352) - c._w / 2), Lx ? 92 : 132, c._w, c._h);
      st.things.forEach((d, i) => {
        d.style.transform = ''; const s = st.put[i];
        if (s) { const b = this.seat(R, s, s === 'under:bed' ? 74 : 86); place(d, b.x, b.y, b.w, b.h); d.style.zIndex = b.z; }
        else { const b = this.traySlot(st, i); place(d, b.x, b.y, b.w, b.h); d.style.zIndex = 12; }
        this.look(d, !!s);
      });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 96 : 600, L() ? 698 : 560, L() ? 170 : 150); },
    /* a thing put somewhere (it stays there: what he made can be seen) */
    putAt(st, i, s, ms) {
      st.put[i] = s;
      const d = st.things[i], R = this.room(st), b = this.seat(R, s, s === 'under:bed' ? 74 : 86), o = box(d);
      d.getAnimations().forEach(a => a.cancel());
      const t = d.style.transform, m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(t || ''), ox = o.x + (m ? Number(m[1]) : 0), oy = o.y + (m ? Number(m[2]) : 0);
      d.style.transform = ''; place(d, b.x, b.y, b.w, b.h); d.style.zIndex = b.z; this.look(d, true);
      return st.scope.anim(d, [{ transform: 'translate(' + (ox - b.x) + 'px,' + (oy - b.y) + 'px)' }, { transform: 'translate(0,0)' }], { duration: ms || 220, easing: EASE.glide, fill: 'none' });
    },
    /* in the tray a thing sits on a little light tile; put in the room it stands there by itself */
    look(d, put) { Object.assign(d.style, put ? { background: 'none', boxShadow: 'none' } : { background: 'rgba(255,253,246,.85)', boxShadow: '0 0 0 3px rgba(43,33,24,.5)' }); const p = d.firstChild; if (p) { p.style.margin = put ? '0' : '8px'; p.style.width = p.style.height = put ? '100%' : '88px'; } },
    peekCard(st) {
      st.peeked = true; st.noStar = true;
      st.q.text.forEach((t, i) => (i ? Voice.say : Voice.sayNow).call(Voice, t, { tag: 'peek' })); K.hop(st, st.readEl, 12);
    },
    onGesture(st, name, p) {
      if (st.submitted || !st.things) return false;
      if (name === 'tap' && p.id === 'read') { this.peekCard(st); return 'ok'; }
      const m = /^thing(\d)$/.exec(p.id || ''); if (!m) return false;
      const i = Number(m[1]), w = st.q.tray[i];
      if (st.done.includes(i)) return false;
      if (name === 'tap') { K.hop(st, st.things[i], 16); if (!st.toldHow || Clock.t() - st.toldHow > 4000) { st.toldHow = Clock.t(); Voice.sayNow('把它拖过去！', { tag: 'how' }); } return 'free'; }
      if (name !== 'drop' || !st.q.spots.includes(p.to)) return false;
      Sfx.place(); this.putAt(st, i, p.to);
      const k = st.q.want.findIndex((x, j) => !st.done.some(d => st.doneW && st.doneW[d] === j) && x[0] === w && x[1] === p.to);
      if (k < 0) { st.tapped = i; st.made = sentOf(w, p.to); Session.submit(st, 'bad:' + w + ':' + p.to); return 'ok'; }
      st.done.push(i); (st.doneW = st.doneW || {})[i] = k;
      if (st.map[p.id] && st.map[p.id]._spec) st.map[p.id]._spec.disabled = true;
      K.hop(st, st.things[i], 14);
      if (st.done.length === st.q.want.length) Session.submit(st, 'ok');
      return 'ok';
    },
    async reveal(st) {
      Sfx.reveal(); st.done.forEach((i, j) => st.scope.timeout(() => K.hop(st, st.things[i], 24), 160 * j));
      const a = st.G.actors.bluey; if (a) a.react();
      st.q.text.forEach(t => Voice.say(t, { tag: 'summary' })); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: what he made, said - "The dog is on the bed." */
    async feedback(st) { K.wiggle(st, st.things[st.tapped]); Voice.say(st.made, { tag: 'wrong' }); await st.scope.wait(700); },
    /* explain: 1 the thing he put, blue (its sentence was just said); 2 the right thing goes slowly to the right place (a beat);
       3 it in gold, the right sentence said */
    async explain(st) {
      const q = st.q, iC = st.tapped, k = q.want.findIndex((x, j) => !Object.values(st.doneW || {}).includes(j)), [w, s] = q.want[k < 0 ? 0 : k], iR = q.tray.indexOf(w);
      EX.ring(st, st.things[iC], 'chosen');
      await EX.wait(st, 700);
      await W4X.exBeat(st, async () => {
        $$('.exring.chosen', Stage.el).forEach(r => r.remove());
        if (iC !== iR) { delete st.put[iC]; const b = this.traySlot(st, iC), d = st.things[iC]; d.style.zIndex = 12; await K.flyTo(st, d, b.x, b.y, 420, 20, 1); place(d, b.x, b.y, 104, 104); this.look(d, false); }
        await this.putAt(st, iR, s, 900);
      }, 250);
      await W4X.exRight(st, st.things[iR], null, [sentOf(w, s)], false);
    },
    /* the 2nd hint (real help): the noun's little picture under it */
    gestureHint(st, reteach) {
      if (!st.things) return;
      if (reteach) { const i = st.things.findIndex((d, j) => !st.done.includes(j)); if (i >= 0) st.scope.anim(st.things[i], [{ transform: 'translate(0,0)' }, { transform: 'translate(0,-60px)' }, { transform: 'translate(0,0)' }], { duration: 800, fill: 'none' }); return; }
      st.nounPics.forEach(p => { p.style.visibility = ''; K.pop(st, p); });
    },
    next(st, strat) {
      if (!st.things || st.submitted) return null;
      const q = st.q, k = q.want.findIndex((x, j) => !Object.values(st.doneW || {}).includes(j)); if (k < 0) return null;
      const [w, s] = q.want[k], i = q.tray.indexOf(w), to = strat === 'wrong' ? q.spots.find(x => !q.want.some(y => y[1] === x)) : s, z = this.zone(this.room(st), to);
      return { g: 'drop', p: { id: 'thing' + i, to }, to: { x: z.x + z.w / 2, y: z.y + z.h / 2 } };
    },
    workEls(st) { return (st.things || []).filter((d, i) => !st.done.includes(i)); },
    snap(st) { return { put: st.put || null, done: st.done || null, want: st.q.want }; },
    iconNode() { return W4X.svgIcon('<rect x="4" y="30" width="34" height="24" rx="4" fill="#D99A50" stroke="#2B2118" stroke-width="3"/><path d="M8 30L4 18L18 20L20 30ZM34 30L38 18L24 20L22 30Z" fill="#E3AE68" stroke="#2B2118" stroke-width="2.5"/><circle cx="21" cy="22" r="7" fill="#FF8A3C" stroke="#2B2118" stroke-width="2.5"/><path d="M44 18L56 30L44 42" fill="none" stroke="#2B2118" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'); },
  };

  /* ---------------------------------------------------------------- ⑦-4 挑战 「读！」 哪句说得通
     The first half of a sentence on a card (not said: a tap says it, and that question earns no star) and a dashed blank after
     it; five second halves below (tools/content.py SENSE4: one makes sense, four are impossible and funny). Drag one into the
     blank or tap it. Only sentences whose every character this child knows are asked. Levels: 1 the first half with its
     picture, a two-character second half; 2 no picture; 3 second halves of three characters (去水中。); 4 a first half of three
     characters or more (爷爷坐 / 小鸟飞); 5 two first halves, one after the other, each with its own five cards (two asks: a
     shared set of five would let a second sensible sentence count as wrong - 鸟在水中, 马去水中). A random tap is right 1 time in
     5 (level 5: 1 in 25). Its 2nd hint shows the first half's picture (real help; at level 1 it is there already: noHelp). */
  const han = t => Array.from(t).filter(c => /[一-鿿]/.test(c)).length;
  const placeOf = t => { const c = Array.from(t).find(x => W4D.endPic[x]); return c ? W4D.endPic[c] : null; };
  const scene = (subj, end) => { const o = placeOf(end); return o ? [[o, 0.5, 0.62, 0.72], [subj, 0.5, 0.38, 0.46]] : [[subj, 0.5, 0.55, 0.78]]; };
  const Sense = {
    rule: 'sensible-ending', kind0: 'quiz', verb: '读！', intro: '哪句说得通？', props: [],
    gen(G, o) {
      const lv = o.level, S = W4D.sense, ok = S.map((s, i) => i).filter(i => W4X.knowsAll(G, S[i].pre + S[i].ok + S[i].no.join('')));
      const cls = i => (han(S[i].pre) >= 3 ? 4 : han(S[i].ok) >= 3 ? 3 : 1), last = (G.asked || []).slice(-1)[0];
      const of = c => ok.filter(i => (c <= 2 ? cls(i) === 1 || (ok.filter(j => cls(j) === 1).length < 5 && cls(i) === 3) : cls(i) === c));
      const pickOne = (c, not) => { let L1 = of(c).filter(i => !not.includes(i) && S[i].pre + S[i].ok !== last); if (!L1.length) L1 = ok.filter(i => !not.includes(i)); if (!L1.length) L1 = ok; return bagFrom(G, 'sn' + c, L1); };
      if (lv >= 5) {
        const a = pickOne(G.rng.pick([1, 3, 4]), []), b = pickOne(G.rng.pick([1, 3, 4]), [a]);
        const halves = [a, b].map(i => ({ pre: S[i].pre, ok: S[i].ok, subj: S[i].subj, opts: W4X.put(G, S[i].no.slice(), S[i].ok) }));
        return { k: [halves.map(h => h.pre + h.ok).join('+'), halves.map(h => h.opts.join('')).join('+')], answer: 'all', seq: halves.map(h => h.ok), asks: halves.map(h => ({ opts: h.opts, answer: h.ok })),
          halves, item: S[a].pre + S[a].ok, pic: 0, two: 1, eLen: Math.max(han(S[a].ok), han(S[b].ok)), pLen: Math.max(han(S[a].pre), han(S[b].pre)) };
      }
      const i = pickOne(lv <= 2 ? 1 : lv, []), s = S[i], opts = W4X.put(G, s.no.slice(), s.ok);
      return { k: [s.pre, opts.join('')], answer: s.ok, opts, halves: [{ pre: s.pre, ok: s.ok, subj: s.subj, opts }], item: s.pre + s.ok, pic: lv <= 1 ? 1 : 0, two: 0, eLen: han(s.ok), pLen: han(s.pre) };
    },
    itemOf() { return null; },
    /* the picture gone, longer second halves, longer first halves, two at once */
    hard(q) { return (1 - q.pic) + (q.eLen >= 3 ? 1.2 : 0) + (q.pLen >= 3 ? 2.4 : 0) + q.two * 4 + (q.eLen + q.pLen) * 0.05; },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.noHelp = !!q.pic;
      st.halfEls = q.halves.map((h, i) => {
        const card = ZX.thing(st, 10, 10, 7, 'item'); card.style.width = card.style.height = 'auto';
        const row = Sent.node(h.pre, 74, -1); card.appendChild(row);
        const blank = ZX.thing(st, 150, 100, 6, 'item'); Object.assign(blank.style, { border: '5px dashed #2B2118', borderRadius: '18px', background: 'rgba(255,247,214,.92)', pointerEvents: 'none' });
        const pic = ZX.thing(st, 120, 120, 6, 'card'); pic.style.pointerEvents = 'none'; pic.appendChild(W4X.pic(h.subj, 104)); pic.style.visibility = q.pic ? '' : 'hidden';
        K.pop(st, card, 100 * i); K.pop(st, blank, 100 * i + 80);
        return { card, blank, pic };
      });
      this.readFor(st);
      this.cardsFor(st);
      this.place(st);
      st.prompt = '哪句说得通？';
    },
    /* the first half asked now is the read card ("read": a tap says it - no star for this question) */
    readFor(st) {
      st.halfEls.forEach((h, i) => { if (h.card._spec) Input.unbind(h.card); h.card.style.opacity = i === st.ix || i < st.ix ? 1 : 0.55; });
      const h = st.halfEls[st.ix]; K.reg(st, 'read', h.card, {}); st.readEl = h.card; st.readText = st.q.halves[st.ix].pre;
    },
    cardsFor(st) {
      (st.cards || []).forEach(c => { if (!c._in) c.remove(); else Input.unbind(c); });
      const hv = st.q.halves[st.ix], H = 62;
      st.cards = hv.opts.map((t, i) => {
        const c = el('div', 'card', Stage.el); c.style.position = 'absolute'; st.els.push(c);
        const r = Sent.node(t, H, -1); Object.assign(r.style, { background: 'none', boxShadow: 'none', padding: '0' }); c.appendChild(r);
        K.reg(st, 'card' + i, c, { drag: true, drops: () => [{ id: 'blank', rect: () => box(st.halfEls[st.ix].blank) }] });
        K.pop(st, c, 60 * i);
        return c;
      });
      st.cardW = Math.max(150, Math.max(...st.cards.map(c => c.firstChild.offsetWidth)) + 34);
      st.opts = hv.opts.slice();
    },
    rowY(st, i) { const Lx = L(), two = st.q.two; return Lx ? (two ? 96 + i * 124 : 112) : (two ? 150 + i * 140 : 170); },
    place(st) {
      if (!st.halfEls) return;
      const Lx = L(), two = st.q.two;
      st.halfEls.forEach((h, i) => {
        const y = this.rowY(st, i), w = h.card.firstChild.offsetWidth, ht = h.card.firstChild.offsetHeight, bw = Math.max(150, st.cardW || 150);
        const pw = h.pic.style.visibility === 'hidden' && !st.q.pic ? 0 : 136, total = pw + w + 16 + bw, x0 = Math.round((Lx ? 560 : 352) - total / 2);
        place(h.pic, x0, y + (ht - 120) / 2, 120, 120);
        place(h.card, x0 + pw, y); h.card.style.width = h.card.style.height = 'auto';
        place(h.blank, x0 + pw + w + 16, y + (ht - 100) / 2, bw, 100);
        h.blankAt = { x: x0 + pw + w + 16, y: y + (ht - 100) / 2 };
        if (h.filled) place(h.filled, h.blankAt.x, h.blankAt.y, bw, 100);
      });
      const n = st.cards.length, cols = Lx ? 3 : 2, cw = st.cardW, ch = 100, gap = 24, y0 = Lx ? (two ? 370 : 300) : (two ? 470 : 420);
      let k = 0;
      st.cards.forEach((c, i) => {
        if (c._in) return;
        const r = Math.floor(k / cols), inRow = Math.min(cols, n - r * cols), x = (Lx ? 560 : 352) - (inRow * cw + (inRow - 1) * gap) / 2 + (k % cols) * (cw + gap);
        c.style.transform = ''; place(c, Math.round(x), y0 + r * (ch + gap + 6), cw, ch); k++;
      });
    },
    decor(G) { const a = G.actors.bluey; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 96 : 600, L() ? 698 : 1012, L() ? 180 : 160); },
    /* an ending goes into the blank */
    fill(st, i) {
      const c = st.cards[i], h = st.halfEls[st.ix]; c._in = true; h.filled = c; c.style.transform = ''; c.style.zIndex = 41;
      place(c, h.blankAt.x, h.blankAt.y, st.cardW, 100); K.pop(st, c);
    },
    onGesture(st, name, p) {
      if (st.submitted || !st.cards || st.busy) return false;
      if (name === 'tap' && p.id === 'read') { W4X.peek(st); return 'ok'; }
      if ((name !== 'tap' && name !== 'drop') || (name === 'drop' && p.to !== 'blank')) return false;
      const i = K.cardIndex(p.id); if (i < 0 || st.cards[i]._in) return false;
      const q = st.q, hv = q.halves[st.ix];
      st.tapped = i; Sfx.place(); this.fill(st, i);
      if (st.opts[i] !== hv.ok) { st.made = hv.pre + st.opts[i]; Session.submit(st, st.opts[i]); return 'ok'; }
      if (st.ix + 1 < q.halves.length) {                  /* the first of two: the next first half and its own five cards */
        st.ix++; st.busy = true;                          /* nothing to tap until the new five are in */
        st.scope.timeout(() => { if (st.submitted || st.scope.dead) return; this.readFor(st); this.cardsFor(st); this.place(st); st.busy = false; }, 420);
        return 'ok';
      }
      Session.submit(st, q.two ? 'all' : hv.ok);
      return 'ok';
    },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      st.halfEls.forEach((h, i) => { if (h.filled) K.hop(st, h.filled, 22); h.pic.innerHTML = ''; h.pic.appendChild(Scene.node(scene(q.halves[i].subj, q.halves[i].ok), 112)); h.pic.style.visibility = ''; K.pop(st, h.pic); });
      this.place(st);
      const a = st.G.actors.bluey; if (a) a.react();
      q.halves.forEach(h => Voice.say(h.pre + h.ok, { tag: 'summary' })); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the sentence he made, asked back - "鱼在天上？" */
    async feedback(st) { Voice.say(st.made.replace('。', '？'), { tag: 'wrong' }); await st.scope.wait(700); },
    /* explain: 1 his sentence in blue with its funny picture; 2 the right ending goes into the blank, the right picture (a beat);
       3 the right card in gold: "鱼在水中。" */
    async explain(st) {
      const q = st.q, hv = q.halves[st.ix], h = st.halfEls[st.ix], iC = st.tapped, iR = st.opts.indexOf(hv.ok), cC = st.cards[iC], cR = st.cards[iR];
      h.pic.innerHTML = ''; h.pic.appendChild(Scene.node(scene(hv.subj, st.opts[iC]), 112)); h.pic.style.visibility = ''; h.pic.style.boxShadow = '0 0 0 5px ' + EX_BLUE; this.place(st); K.pop(st, h.pic);
      EX.ring(st, cC, 'chosen');
      await EX.wait(st, 750);
      await W4X.exBeat(st, async () => {
        $$('.exring.chosen', Stage.el).forEach(r => r.remove());
        cC._in = false; h.filled = null; this.place(st);
        const b = h.blankAt; cR.style.zIndex = 41; await K.flyTo(st, cR, b.x, b.y, 520, 30, 1); cR._in = true; h.filled = cR; place(cR, b.x, b.y, st.cardW, 100);
        h.pic.innerHTML = ''; h.pic.appendChild(Scene.node(scene(hv.subj, hv.ok), 112)); h.pic.style.boxShadow = ''; K.pop(st, h.pic);
      }, 450);
      await W4X.exRight(st, cR, null, [hv.pre + hv.ok], false);
    },
    /* the 2nd hint (real help, levels 2-5): the first half's picture */
    gestureHint(st, reteach) {
      if (!st.halfEls) return;
      if (reteach) { (st.cards || []).forEach((c, i) => { if (!c._in) st.scope.timeout(() => K.hop(st, c, 16), 90 * i); }); return; }
      const h = st.halfEls[st.ix]; if (h.pic.style.visibility === 'hidden') { h.pic.style.visibility = ''; this.place(st); K.pop(st, h.pic); }
    },
    next(st, strat) {
      if (!st.cards || st.submitted || st.busy) return null;
      const hv = st.q.halves[st.ix], r = st.opts.indexOf(hv.ok), i = strat === 'wrong' ? st.opts.findIndex((t, j) => j !== r && !st.cards[j]._in) : r;
      if (i < 0 || !st.cards[i] || st.cards[i]._in) return null;
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).filter(c => !c._in); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() { const d = el('div'); d.style.display = 'flex'; d.style.alignItems = 'center'; d.appendChild(Glyph.zh('鱼', 34)); const b = el('div', '', d); Object.assign(b.style, { width: '30px', height: '24px', border: '3px dashed #2B2118', borderRadius: '6px', marginLeft: '3px' }); return d; },
  };

  w4Island('bluey4', [Kites, Place, Sense]);
})();
