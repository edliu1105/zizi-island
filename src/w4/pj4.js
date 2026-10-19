/* ================================================================ 神笔海 ③ 睡衣小英雄 · 月光乐园 (pj4): 坐 站 飞 说 听 (docs/W4-DESIGN.md §6 ③)
   认字 「转！」转转木马 (turn-to-the-mark) · 写字 坐 飞 (W4X.Write) · 英文 「指！」跟读指一指 (point-as-read) ·
   挑战 「用！」用什么来做 (verb-to-body-part). The shape of src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  const mod = (a, n) => ((a % n) + n) % n;

  /* ---------------------------------------------------------------- ③-1 认字 「转！」 转转木马 (the target turns, the mark stays)
     A carousel (seen from the front and a little above): five wooden horses (six at level 5), a character on every horse's
     chest. The golden mark on the ground in front is where one gets on. Turn the carousel - drag it left / right, or the big
     arrow buttons one horse at a time - until the horse of X is at the mark, then press 上车！: the horse at the mark is the
     answer (turning is no answer). Levels: 1 the picture on the task card, X one horse from the mark; 2 heard only, X anywhere;
     3 look-alikes (坐/生, 站/立, 飞/风, 听/吃) and an old character; 4 the signs of the horses at the back are turned away (only the
     three in front can be read: turn to see them), two old characters; 5 six horses, the back ones turned away, two old ones.
     A random press is right 1 time in 5 (6). */
  const HCOL = ['#FF9EC4', '#7FD8C0', '#B7A2F2', '#FFC285', '#86C6F4', '#FFE074'];
  const horseSVG = c => '<svg viewBox="0 0 150 180" width="100%" height="100%" style="overflow:visible">'
    + '<rect x="71" y="0" width="8" height="180" rx="3" fill="#F2C14E" stroke="#2B2118" stroke-width="3"/>'
    + '<path d="M34 100C16 96 8 112 14 130C20 118 28 112 36 110Z" fill="#FFF5C8" stroke="#2B2118" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<path d="M46 124L34 156M60 128L56 160" stroke="#2B2118" stroke-width="15" stroke-linecap="round"/><path d="M46 124L34 156M60 128L56 160" stroke="' + c + '" stroke-width="8" stroke-linecap="round"/>'
    + '<path d="M96 124L116 140L104 156M86 128L90 162" fill="none" stroke="#2B2118" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="M96 124L116 140L104 156M86 128L90 162" fill="none" stroke="' + c + '" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<ellipse cx="72" cy="114" rx="48" ry="25" fill="' + c + '" stroke="#2B2118" stroke-width="4"/>'
    + '<path d="M96 108C98 88 104 72 112 60L130 68C124 82 120 98 116 112Z" fill="' + c + '" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<path d="M106 54C114 40 140 42 144 58C146 68 138 76 126 74L112 72Z" fill="' + c + '" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<path d="M112 52L114 38L124 48Z" fill="' + c + '" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><circle cx="130" cy="57" r="3.5" fill="#2B2118"/>'
    + '<path d="M108 50C98 60 96 76 92 88" fill="none" stroke="#FFF5C8" stroke-width="9" stroke-linecap="round"/>'
    + '<path d="M54 92H88C90 100 84 106 72 106C60 106 52 100 54 92Z" fill="#E8414B" stroke="#2B2118" stroke-width="3"/>'
    + '<circle class="lamp" cx="75" cy="9" r="9" fill="#FFE14A" stroke="#2B2118" stroke-width="3"/></svg>';
  const ARROW = d => '<svg viewBox="0 0 60 60" width="74%" height="74%"><path d="' + (d < 0 ? 'M46 22C36 12 18 14 12 30' : 'M14 22C24 12 42 14 48 30') + '" fill="none" stroke="#2B2118" stroke-width="7" stroke-linecap="round"/>'
    + '<path d="' + (d < 0 ? 'M4 22L12 36L22 24Z' : 'M56 22L48 36L38 24Z') + '" fill="#2B2118" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><circle cx="30" cy="44" r="7" fill="#FFE14A" stroke="#2B2118" stroke-width="3"/></svg>';
  const Carousel = {
    rule: 'turn-to-the-mark', verb: '转！', intro: '转到它就上车！', props: [],
    gen(G, o) {
      const lv = o.level, pool = poolOf(G, 'zh', false), n = lv >= 5 ? 6 : 5, answer = W4X.pick(G, pool);
      const opts = W4X.opts(G, Math.min(lv, 4), answer, n), ai = opts.indexOf(answer), lk = LOOK[answer] || '';
      /* the horse at the mark when it starts: level 1 one horse beside X; then any but X */
      const start = lv <= 1 ? mod(ai + (G.rng() < 0.5 ? 1 : -1), n) : G.rng.pick(opts.map((_, i) => i).filter(i => i !== ai));
      const dist = Math.min(mod(ai - start, n), mod(start - ai, n));
      return { k: [answer, opts.join(''), start], answer, opts, start, n, pic: lv <= 1 ? 1 : 0, hide: lv >= 4 ? 1 : 0, dist,
        look: opts.filter(k => k !== answer && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: the picture gone, look-alikes, old characters, the back signs turned away, six horses, how far to turn */
    hard(q) { return (1 - q.pic) + q.look + q.rev * 0.8 + q.hide * 2 + (q.n - 5) * 1.5 + q.dist * 0.3; },
    geo() {
      return L() ? { cx: 512, cy: 395, Rx: 300, Ry: 130, w: 170, h: 204, wheel: [150, 88, 710, 516], canopy: [92, 144], spot: 534, left: [26, 320], right: [888, 320], go: [866, 560, 140, 120] }
        : { cx: 352, cy: 490, Rx: 212, Ry: 130, w: 170, h: 204, wheel: [40, 186, 624, 518], canopy: [194, 236], spot: 628, left: [100, 728], right: [494, 728], go: [520, 872, 150, 120] };
    },
    async present(st) {
      const q = st.q;
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      st.opts = q.opts.slice(); st.rot = st.rotV = q.start; st.spinN = 0;
      const wh = st.wheel = ZX.thing(st, 10, 10, 10, 'item');
      K.reg(st, 'wheel', wh, { stretch: { axis: 'x', unit: 120 } }); Object.assign(wh.style, { transform: 'none', filter: 'none' });     /* a press does not shrink the whole carousel */
      st.base = el('div', '', wh); st.col = el('div', '', wh); st.roof = el('div', '', wh); st.spot = el('div', '', wh);
      [st.base, st.col, st.roof, st.spot].forEach(e => { Object.assign(e.style, { position: 'absolute', pointerEvents: 'none' }); });
      st.spot.innerHTML = '<svg viewBox="0 0 120 70" width="100%" height="100%"><ellipse cx="60" cy="50" rx="56" ry="16" fill="#FFE14A" opacity=".45"/><path d="M60 6L86 40H70V56H50V40H34Z" fill="#FFC93C" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/></svg>';
      st.scope.anim(st.spot, [{ filter: 'drop-shadow(0 0 4px #FFE14A)' }, { filter: 'drop-shadow(0 0 16px #FFD23C)' }, { filter: 'drop-shadow(0 0 4px #FFE14A)' }], { duration: 1400, iterations: Infinity });
      st.horses = st.opts.map((k, i) => this.horse(st, k, i));
      st.cards = st.horses;                     /* the options (the explain step rings them) - not tap targets: the wheel is */
      const btn = (id, html, cls) => { const b = el('div', 'card ' + (cls || ''), Stage.el); b.style.position = 'absolute'; b.innerHTML = html; st.els.push(b); K.reg(st, id, b, {}); return b; };
      st.btnL = btn('left', ARROW(-1)); st.btnR = btn('right', ARROW(1));
      st.go = btn('go', ''); st.go.style.background = '#FFD23C'; st.go.style.flexDirection = 'row';
      ['上', '车'].forEach(c => st.go.appendChild(Glyph.zh(c, 56)));
      this.place(st);
      [st.btnL, st.btnR, st.go].forEach((b, i) => K.pop(st, b, 100 * i));
      st.taskEl = K.task(st, [q.pic ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
      K.say(st, '哪个是' + q.answer + '？');
    },
    /* a horse: the wooden horse on its pole, the sign on its chest (its front: the character; its back: plain) */
    horse(st, k, i) {
      const d = el('div', '', st.wheel); d.style.position = 'absolute'; d.innerHTML = horseSVG(HCOL[i % HCOL.length]);
      const pole = d._pole = el('div', '', d); Object.assign(pole.style, { position: 'absolute', left: '47.3%', width: '5.4%', background: '#F2C14E', boxShadow: 'inset 0 0 0 2px #2B2118', pointerEvents: 'none' });
      const sg = d._sign = el('div', '', d);
      Object.assign(sg.style, { position: 'absolute', left: '30%', top: '45%', width: '46.7%', height: '38.9%', borderRadius: '50%', background: '#FFFDF4', boxShadow: '0 0 0 3px #2B2118, 0 0 0 7px #F2C14E', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' });
      const g = d._glyph = Glyph.zh(k, 60); g.setAttribute('width', '80%'); g.setAttribute('height', '80%'); sg.appendChild(g);
      d._lamp = d.querySelector('.lamp');
      return d;
    },
    /* the horses where the turn (st.rotV, in horses) puts them: around the ellipse, nearer ones bigger and in front */
    lay(st) {
      if (!st.horses) return;
      const G = this.geo(), n = st.horses.length, [wx, wy] = G.wheel;
      st.horses.forEach((d, i) => {
        let a = (i - st.rotV) * 2 * Math.PI / n; a = Math.atan2(Math.sin(a), Math.cos(a));
        const c = Math.cos(a), s = 0.6 + 0.4 * (1 + c) / 2, w = G.w * s, h = G.h * s, x = G.cx + G.Rx * Math.sin(a), fy = G.cy + G.Ry * c;
        place(d, Math.round(x - w / 2 - wx), Math.round(fy - h - wy), Math.round(w), Math.round(h));
        d.style.zIndex = String(Math.round(100 + 50 * c));
        d.style.filter = c < -0.2 ? 'brightness(.9)' : '';
        const top = fy - h, ph = Math.max(0, top - G.canopy[1] + 4);
        Object.assign(d._pole.style, { top: (-ph / h * 100) + '%', height: (ph / h * 100) + '%' });
        const back = st.q.hide && Math.abs(a) > 1.75;      /* turned away: only the three in front can be read */
        if (back !== d._back) { d._back = back; d._glyph.style.visibility = back ? 'hidden' : ''; d._sign.style.background = back ? 'repeating-linear-gradient(45deg,#E9DCC3 0 8px,#F7EEDC 8px 16px)' : '#FFFDF4'; }
      });
    },
    place(st) {
      if (!st.wheel) return;
      const G = this.geo(), [wx, wy, ww, wh] = G.wheel, P = (e, x, y, w, h) => place(e, Math.round(x - wx), Math.round(y - wy), Math.round(w), Math.round(h));
      place(st.wheel, wx, wy, ww, wh);
      const bw = 2 * (G.Rx + 50), bh = 2 * (G.Ry + 30) + 28, ey = (bh - 28) / 2, ery = ey - 4;
      P(st.base, G.cx - bw / 2, G.cy - G.Ry - 30 + 6, bw, bh); st.base.style.zIndex = 1;
      let stripes = ''; for (let i = 1; i < 12; i++) { const x = bw / 2 + (bw / 2 - 4) * Math.cos(Math.PI * i / 12), y = ey + ery * Math.sin(Math.PI * i / 12); stripes += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'V' + (y + 28).toFixed(1) + '" stroke="#FFF2D0" stroke-width="7"/>'; }
      st.base.innerHTML = '<svg viewBox="0 0 ' + bw + ' ' + bh + '" width="100%" height="100%"><path d="M4 ' + ey + 'A' + (bw / 2 - 4) + ' ' + ery + ' 0 0 0 ' + (bw - 4) + ' ' + ey + 'V' + (ey + 28) + 'A' + (bw / 2 - 4) + ' ' + ery + ' 0 0 1 4 ' + (ey + 28) + 'Z" fill="#C2364B" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>' + stripes
        + '<ellipse cx="' + bw / 2 + '" cy="' + ey + '" rx="' + (bw / 2 - 4) + '" ry="' + ery + '" fill="#F8E2B8" stroke="#2B2118" stroke-width="5"/>'
        + '<ellipse cx="' + bw / 2 + '" cy="' + ey + '" rx="' + (bw / 2 - 40) + '" ry="' + (ery - 22) + '" fill="none" stroke="#E7C98E" stroke-width="6" stroke-dasharray="18 14"/></svg>';
      P(st.col, G.cx - 15, G.canopy[1] - 6, 30, G.cy - G.canopy[1] + 6); Object.assign(st.col.style, { zIndex: 100, background: 'linear-gradient(90deg,#D9A62E,#FFE08A,#D9A62E)', boxShadow: 'inset 0 0 0 3px #2B2118', borderRadius: '6px' });
      const rw = 2 * G.Rx + 140, rh = G.canopy[1] - G.canopy[0] + 22;
      P(st.roof, G.cx - rw / 2, G.canopy[0], rw, rh); st.roof.style.zIndex = 200;
      let sc = ''; const k = 9; for (let i = 0; i < k; i++) sc += '<path d="M' + (8 + i * (rw - 16) / k) + ' ' + (rh - 26) + 'Q' + (8 + (i + 0.5) * (rw - 16) / k) + ' ' + (rh + 2) + ' ' + (8 + (i + 1) * (rw - 16) / k) + ' ' + (rh - 26) + 'Z" fill="' + (i % 2 ? '#FFF2D0' : '#E8414B') + '" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>';
      st.roof.innerHTML = '<svg viewBox="0 0 ' + rw + ' ' + rh + '" width="100%" height="100%" style="overflow:visible"><path d="M' + (rw / 2) + ' 2L' + (rw - 8) + ' ' + (rh - 26) + 'H8Z" fill="#3A5CC0" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>' + sc
        + '<circle cx="' + rw / 2 + '" cy="4" r="9" fill="#FFE14A" stroke="#2B2118" stroke-width="3"/></svg>';
      P(st.spot, G.cx - 55, G.spot, 110, 64); st.spot.style.zIndex = 300;
      place(st.btnL, G.left[0], G.left[1], 110, 110); place(st.btnR, G.right[0], G.right[1], 110, 110);
      place(st.go, G.go[0], G.go[1], G.go[2], G.go[3]);
      this.lay(st);
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    front(st) { return mod(Math.round(st.rot), st.horses.length); },
    /* the carousel turns to st.rot (whole horses): a short glide, a newer turn takes over from where it is */
    spin(st, ms) {
      const from = st.rotV, to = st.rot, my = ++st.spinN, t0 = now(), dur = fast() || st.ff ? 0 : ms;
      return new Promise(res => {
        const step = () => {
          if (st.scope.dead) return;
          if (st.spinN !== my) { res(); return; }
          const k = dur ? Math.min(1, (now() - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
          st.rotV = from + (to - from) * e; this.lay(st);
          if (k < 1) requestAnimationFrame(step); else res();
        };
        step();
      });
    },
    turn(st, d) { st.rot += d; Sfx.tap(); return this.spin(st, 260); },
    onGesture(st, name, p) {
      if (st.submitted || !st.horses) return false;
      if (name === 'stretch' && p.id === 'wheel') { if (p.delta) this.turn(st, -p.delta); return 'ok'; }     /* a drag to the right turns them right */
      if (name !== 'tap') return false;
      if (p.id === 'left') { this.turn(st, 1); return 'ok'; }
      if (p.id === 'right') { this.turn(st, -1); return 'ok'; }
      if (p.id === 'go') { const i = this.front(st); st.tapped = i; K.hop(st, st.go, 14); Session.submit(st, st.opts[i]); return 'ok'; }
      return false;
    },
    async reveal(st) {
      const i = st.opts.indexOf(st.q.answer), h = st.horses[i], r = h.getBoundingClientRect(), a = Stage.toStage(r.left + r.width / 2, r.top);
      Sfx.reveal(); st.scope.anim(h, [{ transform: 'translateY(0)' }, { transform: 'translateY(-26px)' }, { transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }, { transform: 'translateY(0)' }], { duration: 800 });
      const cb = st.G.actors[this.chars[0]]; if (cb) cb.react('hop');
      await ZX.alive(st, st.q.answer, a.x, Math.max(140, a.y - 70), 140);
      sayItem(st.q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 the horse at the mark in blue with its picture ("这是说" was just said); 2 the carousel turns by itself until X is
       at the mark (a beat); 3 X in gold with its picture, "这个是坐" */
    async explain(st, ans) {
      const iC = st.tapped, iR = st.opts.indexOf(st.q.answer);
      const ring = EX.ring(st, st.horses[iC], 'chosen'), pic = EX.picOver(st, st.horses[iC], ans, 'chosen');
      await EX.wait(st, 700);
      [ring, pic].forEach(e => { if (e) st.scope.anim(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' }); });
      await W4X.exBeat(st, async () => {
        const n = st.horses.length, f = this.front(st), d = mod(iR - f, n), steps = d <= n / 2 ? d : d - n;
        st.rot += steps; await this.spin(st, 330 * Math.abs(steps));
      }, 300);
      await W4X.exRight(st, st.horses[iR], st.q.answer, [W4X.thatIs(st.q.answer)]);
    },
    /* the 2nd hint (real help, no star after it): the lamp on X's pole flashes */
    gestureHint(st, reteach) {
      if (!st.horses) return;
      if (reteach) { [st.btnL, st.btnR, st.go].forEach((b, i) => st.scope.timeout(() => K.hop(st, b, 18), 160 * i)); return; }
      const h = st.horses[st.opts.indexOf(st.q.answer)];
      if (h._lamp) h._lamp.setAttribute('fill', '#FFF7B0');
      st.scope.anim(h, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 12px #FFB400) drop-shadow(0 0 22px #FFE14A)' }, { filter: 'none' }], { duration: 700, iterations: 3, fill: 'none' });
    },
    next(st, strat) {
      if (!st.horses) return null;
      const n = st.horses.length, ai = st.opts.indexOf(st.q.answer), f = this.front(st);
      if (strat === 'wrong') return { g: 'tap', p: { id: f !== ai ? 'go' : 'left' } };
      if (f === ai) return { g: 'tap', p: { id: 'go' } };
      return { g: 'tap', p: { id: mod(ai - f, n) <= n / 2 ? 'left' : 'right' } };
    },
    workEls(st) { return [st.btnL, st.btnR, st.go].filter(Boolean); },
    cleanup(st) { st.spinN = (st.spinN || 0) + 1; },
    snap(st) { return { opts: st.opts || null, front: st.horses ? this.front(st) : -1 }; },
    iconNode() {
      return W4X.svgIcon('<path d="M30 4L56 18H4Z" fill="#3A5CC0" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><rect x="28" y="18" width="4" height="30" fill="#F2C14E"/>'
        + '<ellipse cx="30" cy="50" rx="26" ry="7" fill="#F8E2B8" stroke="#2B2118" stroke-width="3"/><circle cx="16" cy="36" r="7" fill="#FF9EC4" stroke="#2B2118" stroke-width="2.5"/><circle cx="44" cy="36" r="7" fill="#7FD8C0" stroke="#2B2118" stroke-width="2.5"/>'
        + '<path d="M30 56L36 60H24Z" fill="#FFC93C" stroke="#2B2118" stroke-width="2"/>', '0 0 60 64');
    },
  };

  /* ---------------------------------------------------------------- ③-3 英文 「指！」 跟读指一指 (one word, one sound: concept of word)
     A short sentence in big words (a picture of it above). Catboy reads it one word at a time and waits: tap the word he just
     said - a little moon lights under it and he reads the next one. All the words in turn is the answer; a wrong word ends it.
     Sentences from ESENT4, every word known (3 words or more). Levels: 1 three words; 2 three or four; 3 four or five with
     look-alike words in them (it / is / in, can / cat, pig / big); 4 a word comes twice (Go, dog, go!) - the second one is the
     one read second; 5 five or six words, read faster. A build: random taps get a 3-word sentence right 1 time in 6 (and
     1 in 27 tapping anywhere). */
  const WORDS = t => t.match(/[A-Za-z]+/g) || [];
  const lw = w => w.toLowerCase();
  const alike = (a, b) => {
    a = lw(a); b = lw(b); if (a === b) return false;
    if (a.length === b.length) return a.split('').filter((c, i) => c !== b[i]).length === 1;
    const [s, l] = a.length < b.length ? [a, b] : [b, a];
    return l.length - s.length === 1 && l.startsWith(s) && s !== 'i';
  };
  const MOON = '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M25 4A16 16 0 1 0 37 27A13 13 0 1 1 25 4Z" fill="#FFE14A" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/></svg>';
  let SENTS = null;
  const sents = () => SENTS || (SENTS = W4D.esent.map(([t, sc]) => {
    const w = WORDS(t), l = w.map(lw);
    return { t, sc, w, n: w.length, rep: new Set(l).size < l.length ? 1 : 0, look: w.some((a, i) => w.some((b, j) => j > i && alike(a, b))) ? 1 : 0 };
  }).filter(s => s.n >= 3));
  const LEVEL_OK = [null, s => s.n === 3 && !s.rep, s => s.n <= 4 && !s.rep, s => s.n >= 4 && s.n <= 5 && s.look && !s.rep, s => s.rep, s => s.n >= 5];
  const Point = {
    rule: 'point-as-read', kind0: 'en', verb: '指！', intro: '跟着读，指一指！', props: [],
    gen(G, o) {
      const lv = o.level, all = sents(), ok = all.filter(LEVEL_OK[lv]), P = ok.length ? ok : all;
      const t = bagFrom(G, 'pt' + lv, P.map(s => s.t)), s = P.find(x => x.t === t);
      return { k: [s.t], text: s.t, words: s.w.slice(), scene: s.sc, answer: 'all', opts: null, build: 1, n: s.n, rep: s.rep, look: s.look, fast: lv >= 5 ? 1 : 0 };
    },
    itemOf() { return null; },
    hard(q) { return (q.n - 3) * 0.8 + q.look * 0.8 + q.rep * 2.5 + q.fast * 2; },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.moons = []; st.lastOk = -1;
      st.picEl = ZX.thing(st, 210, 210, 5, 'card'); st.picEl.classList.add('pic'); st.picEl.style.pointerEvents = 'none';
      st.picEl.appendChild(Scene.node(q.scene, 186));
      st.cards = q.words.map((w, i) => {
        const c = el('div', 'card', Stage.el); c.style.position = 'absolute'; c.style.flexDirection = 'row';
        const g = Glyph.word(w, 62); c.appendChild(g);
        const punct = this.punctAfter(q.text, q.words, i);
        if (punct) { const p = el('span', '', c); p.textContent = punct; Object.assign(p.style, { font: '900 44px system-ui,sans-serif', color: INK, marginLeft: '2px', alignSelf: 'flex-end', marginBottom: '20px', pointerEvents: 'none' }); }
        c._w = Math.max(96, Number(g.getAttribute('width')) + 40 + (punct ? 16 : 0));
        st.els.push(c); K.reg(st, 'card' + i, c, {});
        st.scope.anim(c, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, delay: 60 * i, easing: EASE.pop, fill: 'backwards' });
        return c;
      });
      st.opts = q.words.slice();
      this.place(st);
      K.pop(st, st.picEl);
      this.readNext(st, 300);
    },
    /* the punctuation after word i in the sentence (shown, not a word to point at) */
    punctAfter(t, words, i) {
      let at = 0; for (let j = 0; j <= i; j++) at = t.indexOf(words[j], at) + words[j].length;
      const m = /^[,.!?]+/.exec(t.slice(at)); return m ? m[0] : '';
    },
    /* the words in rows (a big gap between words), each with room for its moon below */
    rows(st) {
      const maxW = L() ? 820 : 600, gap = L() ? 34 : 26, total = st.cards.reduce((s, c) => s + c._w + gap, -gap);
      /* as few rows as fit, as even as can be (never one word left alone on a row) */
      for (let r = Math.max(1, Math.ceil(total / maxW)); ; r++) {
        const aim = total / r, out = [[]];
        let w = 0;
        st.cards.forEach((c, i) => { const cw = c._w; if (w && (w + gap + cw > maxW || (w + gap + cw / 2 > aim && out.length < r))) { out.push([]); w = 0; } out[out.length - 1].push(i); w += (w ? gap : 0) + cw; });
        if (out.length <= r || r > 4) return { rows: out, gap };
      }
    },
    place(st) {
      if (!st.picEl) return;
      const Lx = L(), cx = Lx ? 572 : 352, H = 112, pitch = H + 56, { rows, gap } = this.rows(st), cy = Lx ? 450 : 620, top = cy - (rows.length * pitch - 56) / 2;
      place(st.picEl, cx - 105, Lx ? 88 : 150, 210, 210);
      rows.forEach((r, k) => {
        const tw = r.reduce((s, i) => s + st.cards[i]._w, 0) + gap * (r.length - 1);
        let x = cx - tw / 2;
        r.forEach(i => { place(st.cards[i], Math.round(x), Math.round(top + k * pitch), st.cards[i]._w, H); x += st.cards[i]._w + gap; });
      });
      st.moons.forEach((m, i) => { if (m) this.moonAt(st, m, i); });
    },
    moonAt(st, m, i) { const b = box(st.cards[i]); place(m, b.x + b.w / 2 - 22, b.y + b.h + 6, 44, 44); },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* Catboy reads the word due now (not awaited: the child may point while he speaks) */
    async readNext(st, delay) {
      try {
        if (delay) await st.scope.wait(delay);
        if (!Session.alive(st) || st.submitted) return;
        const w = st.q.words[st.ix]; if (!w) return;
        st.prompt = w; st.lead = null;
        const a = st.G.actors[this.chars[0]]; if (a && !fast()) a.glance(0.6);
        Voice.say(w, { tag: 'prompt' });
      } catch (e) { /* reading never ends a question */ }
    },
    moon(st, i) {
      const m = ZX.thing(st, 44, 44, 41, 'objpop'); m.innerHTML = MOON; st.moons[i] = m; this.moonAt(st, m, i);
      st.scope.anim(m, [{ transform: 'scale(0) rotate(-40deg)' }, { transform: 'scale(1.25) rotate(8deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 360, easing: EASE.pop });
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || i >= st.q.n) return false;
      if (i === st.lastOk && now() - st.lastAt0 < 500) return false;           /* the same finger twice in a row: one tap */
      st.tapped = i; Sfx.tap();
      if (i !== st.ix) { Session.submit(st, st.opts[i]); return 'ok'; }
      st.lastOk = i; st.lastAt0 = now();
      this.moon(st, i); K.hop(st, st.cards[i], 14); st.ix++;
      if (st.ix >= st.q.n) { Session.submit(st, 'all'); return 'ok'; }
      this.readNext(st, st.q.fast ? 120 : 550);
      return 'ok';
    },
    async reveal(st) {
      Sfx.reveal();
      st.moons.forEach((m, i) => st.scope.timeout(() => K.hop(st, m, 18), 110 * i));
      const a = st.G.actors[this.chars[0]]; if (a) a.cheer();
      Voice.say(st.q.text, { tag: 'summary' });
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the word he pointed at, said */
    wrongLine(st) { return st.opts[st.tapped]; },
    /* explain: 1 the word he pointed at in blue ("cat" was just said); 2 the word read just then in gold, said ("can"); 3 the whole
       sentence from the start, a little moon hopping under every word (a beat) */
    async explain(st) {
      const q = st.q, iC = st.tapped, iR = Math.min(st.ix, q.n - 1);
      EX.ring(st, st.cards[iC], 'chosen');
      await EX.wait(st, 600);
      EX.ring(st, st.cards[iR], 'right'); K.hop(st, st.cards[iR], 18);
      await EX.say(st, [q.words[iR]]);
      await EX.wait(st, 200);
      await W4X.exBeat(st, async () => {
        const m = ZX.thing(st, 44, 44, 63, 'objpop'); m.innerHTML = MOON; this.moonAt(st, m, 0);
        Voice.say(q.text, { tag: 'explain' });
        for (let i = 0; i < q.n; i++) {
          const b = box(st.cards[i]); place(m, b.x + b.w / 2 - 22, b.y + b.h + 6, 44, 44);
          st.scope.anim(m, [{ transform: 'translateY(0)' }, { transform: 'translateY(-16px)' }, { transform: 'translateY(0)' }], { duration: 260 });
          await EX.tick(st, 300);
        }
        await st.scope.guard(Voice.afterSay(200));
      }, 200);
    },
    /* the 2nd hint (real help, no star after it): the word read just now flashes */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 14), 90 * i)); return; }
      const c = st.cards[st.ix]; if (!c) return;
      c.classList.add('glow'); K.hop(st, c, 16); st.scope.timeout(() => c.classList.remove('glow'), 1500);
    },
    next(st, strat) {
      if (!st.cards || st.submitted) return null;
      const n = st.q.n, i = strat === 'wrong' ? (st.ix + 1) % n : st.ix;
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).slice(st.ix || 0); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() {
      const d = el('div'); Object.assign(d.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '0' });
      d.appendChild(Glyph.word('see', 44));
      const m = el('div', '', d); m.innerHTML = MOON; Object.assign(m.style, { width: '24px', height: '24px', marginTop: '2px' });
      return W4X.icon(d);
    },
  };

  /* ---------------------------------------------------------------- ③-4 挑战 「用！」 用什么来做 (the action and the part of the body)
     An action card at the top (听 - read, not said: a tap says it, and that question earns no star); five body cards below. Which
     part of the body does it mostly use? (BODY4: 听-耳 说-口 站-足 看-目 吃-口 喝-口 走-足; both characters known.) Levels: 1 the
     action card with the boy doing it, the others not body parts at all; 2 no picture, the others the other body parts (口 目 手
     耳 足); 3 头 牙 心 come in among them; 4 two action cards, one part each (both right); 5 two actions done with the SAME part
     (说 and 吃: 口 twice) where the child knows such a pair, else two parts with all of 头 牙 心 about. A random tap is right
     1 time in 5 (two: 1 in 25). */
  const BODY = '口目手耳足头牙心', BASIC = '口目手耳足', MORE = '头牙心', ACTS = '坐站飞说听吃喝看走来去';
  W4X.lines(['用什么来做？']);
  const Body = {
    rule: 'verb-to-body-part', kind0: 'quiz', verb: '用！', intro: '用什么来做？', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), B = W4D.body.filter(([a, b]) => kn.includes(a) && kn.includes(b)), acts = B.map(x => x[0]), partOf = a => B.find(x => x[0] === a)[1];
      const pairsSame = lv >= 5 ? acts.filter(a => acts.some(b => b !== a && partOf(b) === partOf(a))) : [];
      const first = pairsSame.length ? bagFrom(G, 'same', pairsSame) : W4X.pick(G, acts, 'act');
      const seq = [first];
      if (lv >= 4) {
        const same = acts.filter(a => a !== first && partOf(a) === partOf(first)), diff = acts.filter(a => a !== first && partOf(a) !== partOf(first));
        seq.push(G.rng.pick(lv >= 5 && same.length ? same : diff.length ? diff : acts.filter(a => a !== first)));
      }
      const parts = seq.map(partOf), others = [];
      /* the body characters are the spec's own set (口 耳 目 手 足, then 头 牙 心); any other one never holds an answer (足 holds 口) */
      const add = k => { if (others.length < 5 - new Set(parts).size && !parts.includes(k) && !others.includes(k) && kn.includes(k) && (BODY.includes(k) || !parts.some(p => (HOLDS[p] || '').includes(k)))) others.push(k); };
      if (lv <= 1) G.rng.shuffle(kn.filter(k => !BODY.includes(k) && !ACTS.includes(k) && !parts.some(p => (LOOK[p] || '').includes(k)))).forEach(add);     /* unlike in meaning and in shape */
      else {
        const sw = [0, 0, 0, G.rng.int(1, 2), 2, 3][lv];
        G.rng.shuffle(MORE.split('')).slice(0, sw).forEach(add);
        G.rng.shuffle(BASIC.split('')).forEach(add);
        G.rng.shuffle(MORE.split('')).forEach(add);
      }
      G.rng.shuffle(kn.filter(k => !ACTS.includes(k))).forEach(add);
      const rest = parts.length > 1 && parts[1] !== parts[0] ? others.concat([parts[1]]) : others;
      const opts = W4X.put(G, rest, parts[0]), two = seq.length > 1;
      return { k: [seq.join(''), opts.join('')], acts: seq, parts, item: first, opts, answer: two ? 'all' : parts[0], seq: two ? parts.slice() : null,
        pic: lv <= 1 ? 1 : 0, body: lv >= 2 ? 1 : 0, sw: opts.filter(k => MORE.includes(k) && !parts.includes(k)).length, two: two ? 1 : 0, same: two && parts[0] === parts[1] ? 1 : 0 };
    },
    /* the action read (not heard) is the memory's evidence */
    itemOf(st) { return W4X.own(st, st.q.acts[0]); },
    itemsOf(st) { return st.q.acts.slice(1); },
    hard(q) { return (1 - q.pic) + q.body + q.sw * 0.6 + q.two * 2.5 + q.same * 2; },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.peeked = false; st.done = [];
      st.acts = q.acts.map((a, j) => {
        const d = ZX.thing(st, 10, 10, 7, 'item'); d.style.width = d.style.height = 'auto';
        d.appendChild(Sent.node(a, 120, -1));
        K.reg(st, j ? 'read2' : 'read', d, {});
        return d;
      });
      st.readEl = st.acts[0]; st.readText = q.acts[0];
      if (q.pic) { st.picEl = ZX.thing(st, 150, 150, 6, 'card'); st.picEl.classList.add('pic'); st.picEl.style.pointerEvents = 'none'; st.picEl.appendChild(W4X.pic(this.actPic(q.acts[0]), 128)); }
      K.cards(st, q.opts.map(k => Glyph.zh(k, 100)), q.opts.slice(), Object.assign({ size: 150, gap: 24 }, this.cardSpot()));
      st.think = ZX.thing(st, 86, 70, 6, 'item');
      st.think.innerHTML = '<svg viewBox="0 0 86 70" width="100%" height="100%"><circle cx="12" cy="62" r="5" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><circle cx="22" cy="50" r="7" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><path d="M30 40C20 40 18 24 30 22C30 8 52 4 58 14C70 8 84 18 78 30C86 40 74 50 64 46C58 54 40 52 38 44C34 46 30 44 30 40Z" fill="#fff" stroke="#2B2118" stroke-width="3"/><text x="52" y="38" text-anchor="middle" font-size="24" font-weight="900" fill="#3A5CC0" font-family="system-ui,sans-serif">?</text></svg>';
      this.place(st);
      st.acts.forEach((d, j) => K.pop(st, d, 120 * j));
      if (st.picEl) K.pop(st, st.picEl, 200);
      this.mark(st);
      K.say(st, '用什么来做？');
    },
    actPic(a) { const x = W4D.body.find(b => b[0] === a); return x ? x[2] : null; },
    cardSpot() { return L() ? { cx: 572, cy: 496 } : { cx: 352, cy: 770, cols: 3 }; },
    place(st) {
      if (!st.acts) return;
      const Lx = L(), n = st.acts.length, sc = Stage.s || 1;
      st.acts.forEach((d, j) => {
        const w = d.firstChild.getBoundingClientRect().width / sc, cx = (Lx ? 572 : 352) + (n > 1 ? (j ? 1 : -1) * (Lx ? 150 : 130) : 0) - (st.picEl ? (Lx ? 90 : 80) : 0);
        place(d, Math.round(cx - w / 2), Lx ? 120 : 220); d.style.width = d.style.height = 'auto';
      });
      if (st.picEl) { const b = st.acts[0], w = b.firstChild.getBoundingClientRect().width / sc; place(st.picEl, box(b).x + w + 30, Lx ? 120 : 220, 150, 150); }
      K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot()));
      place(st.think, Lx ? 30 : 30, Lx ? 410 : 776, 86, 70);
      (st.done || []).forEach(([j, i, m]) => { if (m) this.underAct(st, j, m); });
      if (st.hintEl) { const u = this.spotBy(st, st.ix, 120, 120); place(st.hintEl, u.x, u.y, 120, 120); }
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* two actions: the one to answer now has a gold edge */
    mark(st) { if (st.acts.length < 2) return; st.acts.forEach((d, j) => { d.firstChild.style.boxShadow = j === st.ix ? '0 0 0 4px #2B2118, 0 0 0 10px #FFD23C, 0 8px 0 rgba(43,33,24,.25)' : '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25)'; }); },
    underAct(st, j, m) { const b = st.acts[j].firstChild.getBoundingClientRect(), a = Stage.toStage(b.left + b.width / 2, b.bottom); place(m, a.x - 40, a.y + 8, 80, 80); },
    peek(st, j) {
      st.peeked = true; st.noStar = true;
      const k = st.q.acts[j]; Voice.sayNow(ITEM[k] ? ITEM[k].line : k, { tag: 'peek' }); K.hop(st, st.acts[j], 12);
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      if (p.id === 'read' || p.id === 'read2') { this.peek(st, p.id === 'read' ? 0 : 1); return 'ok'; }
      const i = K.cardIndex(p.id); if (i < 0) return false;
      const q = st.q, want = q.parts[st.ix];
      st.tapped = i; Sfx.tap();
      if (st.opts[i] !== want) { Session.submit(st, st.opts[i]); return 'ok'; }
      if (st.ix + 1 < q.acts.length) {                /* the first of two: a little copy of the part goes under its action */
        const m = ZX.thing(st, 80, 80, 8, 'card'); m.style.pointerEvents = 'none'; m.appendChild(Glyph.zh(want, 60)); m.style.background = '#FFF3C4';
        st.done.push([st.ix, i, m]); this.underAct(st, st.ix, m); K.pop(st, m); K.hop(st, st.cards[i], 16); Sfx.place();
        st.ix++; this.mark(st);
        return 'ok';
      }
      Session.submit(st, q.acts.length > 1 ? 'all' : want);
      return 'ok';
    },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      q.parts.forEach(k => K.hop(st, st.cards[st.opts.indexOf(k)], 28));
      const a = st.G.actors[this.chars[0]]; if (a) a.react('hop');
      q.acts.forEach((x, j) => Voice.say(x + '用' + q.parts[j], { tag: 'summary' }));
      this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 his card in blue with its picture ("这是足" was just said); 2 the action's picture beside its card, and the part it
       uses glowing beside it (a beat); 3 the right card in gold: "听用耳" */
    async explain(st, ans) {
      const q = st.q, j = Math.min(st.ix, q.acts.length - 1), act = q.acts[j], part = q.parts[j], iR = st.opts.indexOf(part);
      W4X.exChosen(st, st.cards[st.tapped], ans);
      await EX.wait(st, 650);
      if (st.hintEl) st.hintEl.remove();
      await W4X.exBeat(st, () => {
        const u = this.spotBy(st, j, 214, 112);
        const ap = ZX.thing(st, 112, 112, 61, 'objpop'); ap.appendChild(W4X.pic(this.actPic(act), 100)); Object.assign(ap.style, { background: '#fff', borderRadius: '20px', boxShadow: '0 0 0 4px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        place(ap, u.x, u.y, 112, 112); K.pop(st, ap);
        const pp = ZX.thing(st, 96, 96, 61, 'objpop'); pp.appendChild(W4X.pic(ITEM[part].obj, 92)); place(pp, u.x + 118, u.y + 8, 96, 96);
        st.scope.anim(pp, [{ transform: 'scale(0)', filter: 'none' }, { transform: 'scale(1.15)', filter: 'drop-shadow(0 0 14px #FFB400)' }, { transform: 'scale(1)', filter: 'drop-shadow(0 0 10px #FFD23C)' }], { duration: 520, delay: 250, fill: 'both' });
      }, 700);
      await W4X.exRight(st, st.cards[iR], part, [act + '用' + part], false);
    },
    /* the 2nd hint (real help, no star after it): the boy doing the action appears beside its card (level 1 has it already) */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.q.pic) { st.noHelp = true; return; }
      if (st.hintEl) return;
      const j = st.ix, u = this.spotBy(st, j, 120, 120);
      const d = st.hintEl = ZX.thing(st, 120, 120, 6, 'card'); d.classList.add('pic'); d.style.pointerEvents = 'none'; d.appendChild(W4X.pic(this.actPic(st.q.acts[j]), 104));
      place(d, u.x, u.y, 120, 120); K.pop(st, d);
    },
    /* room for a w x h group beside action card j (landscape: left of the first, right of the second) or under it (portrait) */
    spotBy(st, j, w, h) {
      const b = st.acts[j].firstChild.getBoundingClientRect(), p = Stage.toStage(b.left, b.top), q2 = Stage.toStage(b.right, b.bottom);
      if (!L()) return { x: clamp((p.x + q2.x) / 2 - w / 2, 8, Stage.W - w - 8), y: q2.y + 10 };
      const y = (p.y + q2.y) / 2 - h / 2, left = p.x - 18 - w, right = q2.x + 18;
      return { x: (j === 0 && left >= 8) || right + w > Stage.W - 8 ? Math.max(8, left) : right, y };
    },
    next(st, strat) {
      if (!st.cards || !st.acts) return null;
      const want = st.q.parts[st.ix], i = strat === 'wrong' ? st.opts.findIndex(k => k !== want) : st.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0, peeked: !!st.peeked }; },
    iconNode() { const d = el('div'); d.style.display = 'flex'; d.style.alignItems = 'center'; d.appendChild(Glyph.zh('听', 36)); const a = el('div', '', d); a.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18"><path d="M3 10H15M11 5L16 10L11 15" fill="none" stroke="#3A5CC0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'; d.appendChild(Glyph.zh('耳', 36)); return W4X.icon(d); },
  };

  w4Island('pj4', [Carousel, Point, Body]);
})();
