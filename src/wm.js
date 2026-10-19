/* ================================================================ 字字岛 · the writing modes (docs/WRITE-MODES.md)
   The client (2026-10-18): writing is boring - always the same, trace a new character from its first stroke to its last. Use
   the characters he already knows to teach new ones, so he sees the connection and keeps it; vary it, and teach every character
   from its best angle. Every writing question goes through here (any island's 写字 / 写字母, the old friend, a review slot,
   the treasure book, teach mode), in one of:
     trace  描      the first time always, and in the tracing fallback: the brush writes it, he traces all of it (as before);
                    when a character he knows grows into it, he sees that first ("人加一横变成大！")
     grow   加一笔   人 in ink slides into its place in 大, the new 横 lights up; then he writes the 横 at its turn in the order
                    (大: 横 first) and the brush writes 人's strokes at theirs - the order stays the standard's (GF 0023-2020)
     part   部件拼字  日 + 月 = 明: the brush writes the part he knows (at its turn), he writes the other part
     look   像不像   日 and 目 side by side (both written by him before); he writes the one asked; then the difference lights up
     fill   补缺笔   the character with a stroke missing (two from level 4): he writes it; from level 3 the gap is the only cue
     relay  接龙     "你一笔，我一笔！": he writes the 1st, 3rd, 5th ... stroke, the brush the others
     fade   描仿写   three rounds on one paper: trace (outline, dot, arrow) -> only the start dots -> from memory (the first dot)
   Which one: the first time trace; then the mode not used for the longest time for this character (zzi.wm in this browser, the
   last seven), never the one the question before used if there is another. Letters: trace, fill, relay, fade. The families
   (WFAM) are tools/write_pairs.py's: STROKE_FAMILIES of tools/content.py, each one checked on the stroke data.
   Lazily loaded (assets/js/wm.js, tools/build.py); WriteBase (src/games.js) and Writer (src/writer.js) do the writing. */
Object.assign(WM, {
  F: WFAM,
  ORDER: ['grow', 'part', 'look', 'fill', 'relay', 'fade', 'trace'],
  FADE: [{ guide: 1, hi: true, dot: 'cur', arrow: true }, { guide: 0, hi: false, dot: 'all', arrow: false }, { guide: 0, hi: false, dot: 'first', arrow: false }],
  FADE_SAY: ['描一描！', '照着写！', '自己写！'],
  hist() { try { const h = JSON.parse(localStorage.getItem('zzi.wm') || '{}'); return h && typeof h === 'object' ? h : {}; } catch (e) { return {}; } },
  note(k, m) { const h = this.hist(); h[k] = (Array.isArray(h[k]) ? h[k] : []).concat(m).slice(-7); try { localStorage.setItem('zzi.wm', JSON.stringify(h)); } catch (e) { /* private mode */ } },
  known(c) { return !!ITEM[c] && learned(c); },
  /* written by his own hand (the write record) - 像不像's other card is one he has written, never a read-only one (W4R2-06) */
  wrote(c) { return !!ITEM[c] && !!(Store.s.learned[c] && Store.s.learned[c].w > 0); },
  count(k) { return isEn(k) ? (LETTERS[k] || []).length : Hanzi.data && Hanzi.data[k] ? Hanzi.data[k].m.length : 0; },
  /* what can be done with k now: a family only with characters of the app that he has written */
  options(k) {
    const zh = !isEn(k), n = this.count(k), o = { trace: true };
    if (zh) {
      const g = this.F.grow.filter(e => e.b === k && this.known(e.a)); if (g.length) o.grow = g;
      const p = this.F.part.filter(e => e.b === k && ITEM[e.a] && ITEM[e.c] && (this.known(e.a) || this.known(e.c))); if (p.length) o.part = p;
      const l = this.F.grow.filter(e => this.wrote(e.a) && this.wrote(e.b) && (e.a === k || e.b === k)); if (l.length) o.look = l;
    }
    if (n >= (zh ? 3 : 2)) o.fill = true;
    if (n >= 3) o.relay = true;
    if (n >= 2 && n <= (zh ? 8 : 4)) o.fade = true;
    return o;
  },
  pick(st) {
    const G = st.G, k = st.q.answer, o = this.options(k), f = window.__wmode, rng = G.rng;
    let mode;
    if (f) mode = o[f] ? f : 'trace';                                   /* tests: one mode asked for */
    else if (st.tracing || G.wfMode >= 1 || !learned(k)) mode = 'trace';
    else {
      const h = this.hist()[k] || [], av = this.ORDER.filter(m => o[m]), not = av.filter(m => m !== G.wmLast), c = not.length ? not : av;
      mode = c.reduce((a, m) => (h.lastIndexOf(m) < h.lastIndexOf(a) ? m : a), c[0]);       /* the one not used for the longest */
    }
    const m = { mode };
    if (mode === 'grow' || mode === 'look') m.e = rng.pick(o[mode]);
    if (mode === 'part') { m.e = rng.pick(o.part); const a = this.known(m.e.a), c = this.known(m.e.c); m.give = a && c ? (rng() < 0.5 ? 'a' : 'c') : a ? 'a' : 'c'; }
    if (mode === 'trace' && !learned(k)) { if (o.grow) m.aha = rng.pick(o.grow); else if (o.part) { m.aha = rng.pick(o.part); m.give = this.known(m.aha.a) ? 'a' : 'c'; } }
    return m;
  },
  range(a, b) { return Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i); },
  async present(game, st, met) {
    const G = st.G, k = st.q.answer, m = st.wm = this.pick(st), n = this.count(k), lv = G.practice ? 1 : st.level, sc = st.scope;
    G.wmLast = m.mode; this.note(k, m.mode);
    (window.__wmLog || (window.__wmLog = [])).push({ k, mode: m.mode, e: m.e ? [m.e.a, m.e.b, m.e.c || ''].join('') : m.aha ? 'aha' : '', gen: st.gen });
    const say = async line => { Voice.say(line, { tag: 'prompt' }); await sc.guard(Voice.afterSay(150)); };
    const line = async () => { if (!met) { Voice.say(ITEM[k].line, { tag: 'prompt' }); await sc.guard(Voice.afterSay(150)); } };
    if (m.mode === 'trace') {
      game.setup(st);
      if (m.aha) { this.veil(st.w); await line(); if (!Session.alive(st)) return; await this.ahaOf(st, m.aha, m.give, true); met = true; }
      if (!Session.alive(st)) return;
      await game.lead(st, met);
    } else if (m.mode === 'grow') {
      game.setup(st, { given: m.e.keep, ghost: true }); this.veil(st.w);
      await line(); if (!Session.alive(st)) return;
      await this.ahaOf(st, m.e, null, true);
    } else if (m.mode === 'part') {
      const e = m.e, A = m.give === 'a', idx = A ? this.range(0, e.cut) : this.range(e.cut, n);
      game.setup(st, { given: idx, ghost: true }); this.veil(st.w);
      await line(); if (!Session.alive(st)) return;
      await this.ahaOf(st, e, m.give, lv <= 3);
    } else if (m.mode === 'look') {
      game.setup(st, { noPic: true });
      this.cards(st, m.e);
      await game.lead(st, met);
      m.after = async () => { await this.difference(st, m.e); return false; };
    } else if (m.mode === 'fill') {
      const miss = G.rng.shuffle(this.range(0, n)).slice(0, lv >= 4 && n >= 4 ? 2 : 1).sort((a, b) => a - b);
      const cues = lv <= 1 ? null : lv === 2 ? { guide: 0, hi: false, dot: 'cur', arrow: false } : { guide: 0, hi: false, dot: false, arrow: false };
      game.setup(st, { given: this.range(0, n).filter(i => !miss.includes(i)), ghost: true, cues });
      m.miss = miss;
      await line(); if (!Session.alive(st)) return;
      await say(miss.length > 1 ? '少了两笔！' : '少了一笔！');
    } else if (m.mode === 'relay') {
      game.setup(st, { given: this.range(0, n).filter(i => i % 2), ghost: true });
      await line(); if (!Session.alive(st)) return;
      await say('你一笔，我一笔！');
    } else if (m.mode === 'fade') {
      m.pass = 0;
      game.setup(st, { cues: this.FADE[0] });
      await line(); if (!Session.alive(st)) return;
      await say(this.FADE_SAY[0]);
      m.after = async () => this.nextPass(game, st);
    }
    if (!Session.alive(st)) return;
    await game.arm(st);
  },
  /* nothing of the new character shows before the aha (its ghost and his stroke's highlight would give it away) */
  veil(W) { [W.gGhost, W.gGuide, W.gHi, W.gCue].forEach(g => { g.style.visibility = 'hidden'; }); },
  /* 描仿写: the next round on a fresh paper - only the start dots, then from memory */
  async nextPass(game, st) {
    const m = st.wm, sc = st.scope, old = st.w;
    if (m.pass >= 2) return false;
    m.pass++;
    await sc.wait(350);
    if (!Session.alive(st)) return true;
    await sc.anim(old.el, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' });
    if (typeof Input !== 'undefined' && Input.unbind) Input.unbind(old.el);
    old.el.remove();
    game.setup(st, { cues: this.FADE[m.pass] });
    Voice.say(this.FADE_SAY[m.pass], { tag: 'prompt' });
    await sc.guard(Voice.afterSay(120));
    if (!Session.alive(st)) return true;
    await game.arm(st);
    return true;
  },
  /* the aha (加一笔 / 部件拼字, and the first meeting of a character a known one grows into): the character he knows, as itself
     (its own glyph, in ink), slides into its place in the new one; the strokes it does not have light up (lit), the line says
     it; then the paper is his again - the known part a ghost the brush will write at its turn */
  async ahaOf(st, e, give, lit) {
    const W = st.w, n = W.strokes.length;
    if (e.keep) return this.aha(st, e.a, e.keep, e.say, e.add, lit);
    const A = (give || 'a') === 'a', idx = A ? this.range(0, e.cut) : this.range(e.cut, n);
    return this.aha(st, A ? e.a : e.c, idx, e.say, this.range(0, n).filter(i => !idx.includes(i)), lit);
  },
  async aha(st, A, idx, line, newIdx, lit) {
    const W = st.w, sc = st.scope, d = Hanzi.data[A];
    if (!d || W.kind !== 'zh') { Voice.say(line, { tag: 'prompt' }); await sc.guard(Voice.afterSay(200)); return; }
    const flip = 'translate(0,900) scale(1,-1)';
    const box = P => { const xs = P.flat().map(p => p[0]), ys = P.flat().map(p => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys); return { x0, y0, w: Math.max(80, Math.max(...xs) - x0), h: Math.max(80, Math.max(...ys) - y0) }; };
    const a = box(Hanzi.strokes(A).map(s => s.med)), b = box(idx.map(i => W.strokes[i].med)), sx = b.w / a.w, sy = b.h / a.h;
    const hide = [W.gGhost, W.gGuide, W.gHi, W.gCue];
    hide.forEach(g => { g.style.visibility = 'hidden'; });
    const mv = svg('g', {}, W.gFx), inner = svg('g', { transform: flip }, mv);
    d.s.forEach(o => svg('path', { d: o, fill: INK }, inner));
    mv.dataset.wm = 'known';
    await sc.anim(mv, [{ opacity: 0 }, { opacity: 1 }], { duration: 320 });
    await sc.wait(500);
    for (let i = 1; i <= 16; i++) {
      const t = 0.5 - Math.cos(Math.PI * i / 16) / 2;
      mv.setAttribute('transform', 'translate(' + (t * (b.x0 - a.x0 * sx)).toFixed(1) + ' ' + (t * (b.y0 - a.y0 * sy)).toFixed(1) + ') scale(' + (1 + t * (sx - 1)).toFixed(3) + ' ' + (1 + t * (sy - 1)).toFixed(3) + ')');
      await sc.wait(35);
    }
    /* now it is that part of the new character: its strokes there in their own shape, and the new ones light up */
    const kept = svg('g', { transform: flip }, W.gFx); idx.forEach(i => svg('path', { d: W.strokes[i].outline, fill: INK }, kept));
    sc.anim(kept, [{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
    await sc.anim(mv, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' });
    mv.remove();
    let hi = null;
    if (lit) {
      hi = svg('g', { transform: flip }, W.gFx); hi.dataset.wm = 'new';
      newIdx.forEach(i => svg('path', { d: W.strokes[i].outline, fill: HILITE, stroke: '#E8862B', 'stroke-width': 10 }, hi));
      sc.anim(hi, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }], { duration: 1800 });
    }
    Sfx.sparkle();
    Voice.say(line, { tag: 'prompt' });
    await sc.guard(Voice.afterSay(400));
    await sc.wait(250);
    /* the paper is his: the known part a ghost again (the brush writes it in its turn), his strokes as his level shows them */
    await Promise.all([kept, hi].filter(Boolean).map(g => sc.anim(g, [{ opacity: 1 }, { opacity: 0 }], { duration: 280, fill: 'forwards' })));
    kept.remove(); if (hi) hi.remove();
    hide.forEach(g => { g.style.visibility = ''; });
  },
  /* 像不像: the two of a family on cards (the one he writes in gold), the smaller first */
  cards(st, e) {
    const k = st.q.answer;
    st.wmCards = [e.a, e.b].map(c => {
      const d = ZX.thing(st, 10, 10, 9, 'item');
      Object.assign(d.style, { background: '#FFFDF7', borderRadius: '22px', boxShadow: '0 0 0 ' + (c === k ? '6px #FFB400' : '4px #B9AC98') + ', 0 8px 0 rgba(43,33,24,.22)' });
      d.dataset.wm = c === k ? 'card-ask' : 'card-other'; d.dataset.ch = c;
      const s = svg('svg', { viewBox: '0 0 1024 1024', width: '100%', height: '100%' }, d), g = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s);
      d._new = [];
      Hanzi.data[c].s.forEach((o, i) => { const p = svg('path', { d: o, fill: INK }, g); if (c === e.b && e.add.includes(i)) d._new.push(p); });
      K.pop(st, d);
      return d;
    });
    st.wmPlace = () => {
      const L = K.L(), sz = L ? 176 : 168, P = L ? [[214, 250], [214, 470]] : [[196, 236], [404, 236]];
      st.wmCards.forEach((d, i) => place(d, P[i][0] - sz / 2, P[i][1] - sz / 2, sz, sz));
    };
    st.wmPlace();
  },
  /* after 像不像: what the bigger one has more lights up on its card, and is said ("目比日多一横") */
  async difference(st, e) {
    const sc = st.scope, d = st.wmCards && st.wmCards[1]; if (!d) return;
    d._new.forEach(p => { p.setAttribute('fill', '#FF9F43'); p.setAttribute('stroke', '#E8862B'); p.setAttribute('stroke-width', 14); });
    d.dataset.lit = '1';
    sc.anim(d, [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 600, easing: EASE.pop });
    Sfx.sparkle();
    Voice.say(e.diff, { tag: 'prompt' });
    await sc.guard(Voice.afterSay(300));
  },
});
