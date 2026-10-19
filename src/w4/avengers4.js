/* ================================================================ 神笔海 ⑧ 复仇者 · 英雄训练场 (avengers4): 好 力 出 王 高 (docs/W4-DESIGN.md §12)
   认字 「圈！」句子里圈字 (char-in-sentence) · 写字 好 力 (W4X.Write + the finishing shows, `wx`) · 英文 「拍！」拍拍节拍
   (count-the-beats) · 挑战 「排！」故事排排队 (story-order, W4X.slots). Built like the template src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  /* lines said through a variable (tools/voice_lines.py records them) */
  W4X.lines(['拍了一下', '拍了两下', '拍了三下', '拍了四下', '拍了五下', '拍了六下', '一拍', '两拍', '三拍', '四拍', '先是这一句']);
  const PUNCT = /[。！？，：、]/;
  const cjk = s => Array.from(s).filter(c => !PUNCT.test(c));
  const charPic = c => { const o = ITEM[c] && ITEM[c].obj; return o && (o[0] === '@' || W4X.hasPic(o)) ? o : null; };
  const vbox = e => { const r = e.getBoundingClientRect(), s = Stage.s || 1, a = Stage.toStage(r.left, r.top); return { x: a.x, y: a.y, w: r.width / s, h: r.height / s }; };
  const R = (G, a) => G.rng.shuffle(a.slice());
  const glyphRow = (t, h) => {
    const d = el('div', ''); Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Math.round(h * 0.04) + 'px', pointerEvents: 'none' });
    Array.from(t).forEach(c => { if (PUNCT.test(c)) { const p = el('span', '', d); p.textContent = c; Object.assign(p.style, { font: '900 ' + Math.round(h * 0.7) + 'px system-ui,sans-serif', color: INK, lineHeight: 1 }); } else d.appendChild(Glyph.zh(c, h)); });
    return d;
  };

  /* ---------------------------------------------------------------- ⑧-1 认字 「圈！」 句子里圈字 (a character inside a sentence)
     Iron Man's big screen shows a sentence (SENT8), a character a cell; "圈王！" - tap that character in it: a gold circle goes
     round it. Every cell is an option (5 to 8, only one is X). Levels: 1 X's picture on the task card, five characters, no
     look-alike of X in the sentence; 2 heard only, 5-6 characters; 3 a look-alike of X in the sentence (王: 土 三, 出: 山); 4 seven
     or eight characters on two lines; 5 X inside a word of two (大王, 出门, 高山), look-alikes too. kind0 'find': a review question
     (an old character due) comes in this frame as { k, answer, opts } only - it is asked in a sentence that holds it once
     (SENT8, then 读一读's), or, with none known, in the row of its five options. A random tap is right 1 time in 5 or less. */
  const lookIn = (X, s) => cjk(s).some(c => c !== X && (LOOK[X] || '').includes(c));
  const once = (X, s) => cjk(s).filter(c => c === X).length === 1;
  const TIERS = {
    1: [(X, r, n, lk) => n === 5 && !lk, (X, r, n, lk) => n <= 6 && !lk, (X, r, n, lk) => !lk, () => true],
    2: [(X, r, n) => n >= 5 && n <= 6, (X, r, n) => n <= 6, () => true],
    3: [(X, r, n, lk) => lk && n <= 6, (X, r, n, lk) => lk, () => true],
    4: [(X, r, n) => n >= 7, (X, r, n) => n >= 6, () => true],
    5: [(X, r, n, lk) => n >= 7 && r[0] === X && !!r[2] && lk, (X, r, n) => n >= 7 && r[0] === X && !!r[2], (X, r) => r[0] === X && !!r[2], (X, r, n) => n >= 7, () => true],
  };
  const SCREEN_RIM = '0 0 0 6px #B71C1C, 0 0 0 12px #F5B324, 0 12px 0 12px rgba(43,33,24,.18)';
  const Circle = {
    rule: 'char-in-sentence', kind0: 'find', verb: '圈！', intro: '句子里找字！', props: [],
    gen(G, o) {
      const lv = o.level, mine = poolOf(G, 'zh', false);
      const rows = W4D.sent8.filter(r => W4X.knowsAll(G, r[1]) && new Set(cjk(r[1])).size >= 5);
      const cands = (X, t) => rows.filter(r => once(X, r[1]) && t(X, r, cjk(r[1]).length, lookIn(X, r[1])));
      let X = null, list = [];
      for (const t of TIERS[lv]) { const pool = mine.filter(k => cands(k, t).length); if (pool.length) { X = W4X.pick(G, pool); list = cands(X, t); break; } }
      if (!X) { X = W4X.pick(G, mine); list = rows.filter(r => once(X, r[1])); }
      const r = list.length ? bagFrom(G, 's8' + X, list) : null;
      return r ? this.make(G, X, r[1], r[0] === X ? r[2] : '', lv) : this.make(G, X, null, '', lv, W4X.opts(G, lv, X, 5));
    },
    /* the question for X in a sentence (or, a review with no sentence known, in its option row) */
    make(G, X, sent, word, lv, row) {
      const cells = sent ? cjk(sent) : row, distinct = Array.from(new Set(cells)), others = distinct.filter(c => c !== X);
      const n = cells.length, look = sent ? (lookIn(X, sent) ? 1 : 0) : 0;
      return { k: [X, sent || row.join('')], answer: X, item: X, sent: sent || null, row: sent ? null : row, opts: W4X.put(G, others, X), n, look,
        pic: lv <= 1 && charPic(X) ? 1 : 0, lines: lv >= 4 ? 2 : 1, word: lv >= 5 && word && sent && sent.includes(word) ? word : '' };
    },
    /* tests/w4_levels.js: the picture gone, a look-alike, longer, two lines, X inside a word */
    hard(q) { return (1 - q.pic) * 1.5 + q.look * 1.5 + (q.n - 5) * 0.5 + (q.lines - 1) * 1.5 + (q.word ? 1.5 : 0); },
    itemOf(st) { return st.q.answer; },
    /* a review question (an old character due): a sentence that holds it once and is known all through */
    review(st) {
      const G = st.G, q = st.q, X = q.answer, ok = s => W4X.knowsAll(G, s) && once(X, s) && new Set(cjk(s)).size >= 5 && cjk(s).length <= 8;
      const pool = W4D.sent8.map(r => r[1]).concat(READ.map(r => r[0])).filter(ok);
      const s = pool.length ? G.rng.pick(pool) : null, m = this.make(G, X, s, '', Math.max(2, st.level), s ? null : (q.opts || [X]).slice());
      Object.assign(q, { sent: m.sent, row: m.row, n: m.n, look: m.look, pic: 0, lines: m.n > 8 ? 2 : 1, word: '' });
    },
    async present(st) {
      const q = st.q;
      if (q.n == null) this.review(st);
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      const toks = Array.from(q.sent || q.row.join('')).map(c => ({ c, p: !!q.sent && PUNCT.test(c) }));
      st.screen = ZX.thing(st, 10, 10, 4, 'item'); Object.assign(st.screen.style, { borderRadius: '26px', background: 'linear-gradient(#F4FAFF,#D6E8F8)', boxShadow: SCREEN_RIM, pointerEvents: 'none' });
      st.toks = toks; st.opts = []; st.cards = [];
      toks.forEach(t => {
        if (t.p) { t.el = ZX.thing(st, 30, 60, 6, 'item'); t.el.appendChild(glyphRow(t.c, 60)); t.el.style.pointerEvents = 'none'; return; }
        const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; st.els.push(d); d.appendChild(Glyph.zh(t.c, 76));
        t.el = d; t.i = st.cards.length; K.reg(st, 'card' + t.i, d, {}); st.cards.push(d); st.opts.push(t.c);
      });
      this.place(st);
      st.cards.forEach((d, i) => K.pop(st, d, 40 * i)); K.pop(st, st.screen);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(charPic(q.answer)), 'q'] : ['speaker', 'q']]);
      K.say(st, '圈' + q.answer + '！');
    },
    /* the lines: one (landscape <= 8, portrait <= 6 cells) or two (levels 4-5, or longer); a break after a comma near the middle */
    lines(st) {
      const toks = st.toks, n = st.cards.length, M = L() ? 8 : 6, two = st.q.lines > 1 || n > M;
      if (!two) return [toks];
      let best = -1, bd = 1e9;
      toks.forEach((t, j) => { if (t.p && j < toks.length - 1) { const before = toks.slice(0, j + 1).filter(x => !x.p).length, d = Math.abs(before - n / 2); if (before <= M && n - before <= M && d < bd) { bd = d; best = j + 1; } } });
      if (best < 0) { let c = 0; best = toks.findIndex(t => !t.p && ++c > Math.ceil(n / 2)); }
      return [toks.slice(0, best), toks.slice(best)];
    },
    place(st) {
      if (!st.toks) return;
      const rows = this.lines(st), PW = L() ? 30 : 24, g = L() ? 8 : 6, maxW = (L() ? Stage.W - 140 : Stage.W - 64);
      /* cells as big as the widest line allows (100 / 92), never below 88 */
      const fit = rows.map(row => { const nc = row.filter(t => !t.p).length, np = row.length - nc; return Math.floor((maxW - np * PW - g * (row.length - 1)) / Math.max(1, nc)); });
      const CW = Math.max(88, Math.min(L() ? 100 : 92, ...fit)), RH = CW + 16;
      const cy = L() ? 300 : (rows.length > 1 ? 340 : 330), y0 = cy - (rows.length * RH - 16) / 2;
      let x0 = 1e9, x1 = -1e9;
      rows.forEach((row, ri) => {
        const w = row.reduce((a, t) => a + (t.p ? PW : CW), 0) + g * (row.length - 1);
        let x = (L() ? 512 : 352) - w / 2; x0 = Math.min(x0, x); x1 = Math.max(x1, x + w);
        row.forEach(t => { const tw = t.p ? PW : CW; if (t.p) place(t.el, x, y0 + ri * RH + CW - 64, PW, 60); else { place(t.el, x, y0 + ri * RH, CW, CW); const gl = t.el.firstChild; if (gl) { gl.setAttribute('width', Math.round(CW * 0.76)); gl.setAttribute('height', Math.round(CW * 0.76)); } } t.row = ri; x += tw + g; });
      });
      const pad = L() ? 30 : 18;
      place(st.screen, x0 - pad, y0 - 26, x1 - x0 + 2 * pad, rows.length * RH - 16 + 52);
      if (st.ring) this.ringAt(st);
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || i >= st.cards.length) return false;
      st.tapped = i; Sfx.tap();
      Session.submit(st, st.opts[i]);
      return 'ok';
    },
    /* the gold circle drawn round the character found */
    ringAt(st) { const b = box(st.cards[st.opts.indexOf(st.q.answer)]); place(st.ring, b.x - 22, b.y - 18, b.w + 44, b.h + 36); },
    async reveal(st) {
      const q = st.q, e = st.cards[st.opts.indexOf(q.answer)];
      const r = st.ring = ZX.thing(st, 10, 10, 16, 'item'); r.style.pointerEvents = 'none';
      r.innerHTML = '<svg viewBox="0 0 140 140" width="100%" height="100%" preserveAspectRatio="none"><ellipse cx="70" cy="70" rx="64" ry="62" fill="none" stroke="' + EX_GOLD + '" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>';
      this.ringAt(st);
      Sfx.sparkle(); K.hop(st, e, 22);
      await st.scope.anim(r.querySelector('ellipse'), [{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], { duration: 520, easing: EASE.out, fill: 'forwards' });
      const sp = st.G.actors.spiderman; if (sp) sp.react();
      sayItem(q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 his cell in blue with its picture ("这是土" was just said); 2 the sentence read from the start, each character
       lighting up as it is read (a beat - this sentence's own recording); 3 X in gold with its picture: "这个是王" */
    async explain(st, ans) {
      const q = st.q, eC = st.cards[st.tapped], eR = st.cards[st.opts.indexOf(q.answer)];
      W4X.exChosen(st, eC, ans);
      await EX.wait(st, 650);
      await W4X.exBeat(st, async () => {
        if (q.sent) Voice.say(q.sent, { tag: 'explain' });
        const each = Math.min(300, Math.max(180, 2000 / st.cards.length));
        for (const c of st.cards) { if (st.scope.dead) return; c.style.background = '#FFF1BF'; await EX.tick(st, each); c.style.background = ''; }
        await st.scope.guard(Voice.afterSay(60));
      }, 150);
      await W4X.exRight(st, eR, q.answer, [W4X.thatIs(q.answer)]);
    },
    /* the 2nd hint (real help): X's line (two lines) or X's half of the sentence (one line) lights up - the star goes */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 14), 60 * i)); return; }
      const q = st.q, toks = st.toks, tx = toks.find(t => !t.p && t.c === q.answer), rows = this.lines(st);
      let grp;
      if (rows.length > 1) grp = toks.filter(t => !t.p && t.row === tx.row);
      else { const cells = toks.filter(t => !t.p), half = Math.ceil(cells.length / 2); grp = tx.i < half ? cells.slice(0, half) : cells.slice(half); }
      K.flash(st, grp.map(t => t.el)); Sfx.sparkle();
    },
    next(st, strat) {
      if (!st.cards || !st.cards.length) return null;
      const i = strat === 'wrong' ? st.opts.findIndex(c => c !== st.q.answer) : st.opts.indexOf(st.q.answer);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    snap(st) { return { opts: st.opts || null, sent: st.q.sent || null }; },
    iconNode() { const d = el('div'); Object.assign(d.style, { position: 'relative', display: 'flex', gap: '2px' }); ['王', '坐', '下'].forEach((c, i) => { const b = el('div', '', d); Object.assign(b.style, { width: '26px', height: '26px', borderRadius: '6px', background: '#fff', boxShadow: '0 0 0 2px #2B2118' + (i ? '' : ', 0 0 0 5px ' + EX_GOLD) }); b.appendChild(Glyph.zh(c, 26)); }); return d; },
  };

  /* ---------------------------------------------------------------- ⑧-3 英文 「拍！」 拍拍节拍 (how many beats has a word)
     Jenny says a word (its picture on top); beat the drum once a beat, then press 好了. A tap on the last lit dot takes a beat
     back (a change of mind is no answer). Two words a question (the two-ask form: 1-4 beats each, random beating 1 in 16).
     Levels: 1 words of 1-2 beats, said slowly, twice; 2 1-3 beats, slowly; 3 1-3 beats, at normal speed, once; 4 1-4 beats; 5
     two-word phrases (big banana = 4) - the picture shows the colour or the size. The 2nd hint says it slowly again (only the
     question again: softHint, the star stays). Hulk claps along. */
  const nBeats = s => s.split('-').length;
  const COUNT = ['', '一', '两', '三', '四', '五', '六'];
  const beatLine = n => ['拍了', COUNT[n], '下'].join('');           /* 拍了两下 (listed in W4X.lines above) */
  const DRUM_SVG = '<svg viewBox="0 0 250 210" width="100%" height="100%"><path d="M22 70V160C22 190 228 190 228 160V70" fill="#D63B2F" stroke="#2B2118" stroke-width="7"/>'
    + '<path d="M22 100C22 128 228 128 228 100M22 130C22 158 228 158 228 130" fill="none" stroke="#F5B324" stroke-width="7"/><g stroke="#2B2118" stroke-width="5"><path d="M48 92L66 176M108 104L108 186M168 104L168 186M202 92L184 176" stroke="#F5B324" stroke-width="5"/></g>'
    + '<ellipse cx="125" cy="70" rx="103" ry="36" fill="#FFF6E0" stroke="#2B2118" stroke-width="7"/><ellipse cx="125" cy="70" rx="70" ry="22" fill="none" stroke="#E8D9B5" stroke-width="4"/></svg>';
  const STICKS = '<svg viewBox="0 0 120 70" width="100%" height="100%"><path d="M8 62L70 16M112 62L50 16" stroke="#9A6433" stroke-width="9" stroke-linecap="round"/><circle cx="72" cy="14" r="10" fill="#F5B324" stroke="#2B2118" stroke-width="4"/><circle cx="48" cy="14" r="10" fill="#F5B324" stroke="#2B2118" stroke-width="4"/></svg>';
  const DOT = 88, MAXDOTS = 6;
  const Beats = {
    rule: 'count-the-beats', kind0: 'en', verb: '拍！', intro: '拍拍节拍！', softHint: true, props: [],
    gen(G, o) {
      const lv = o.level, items = [];
      if (lv >= 5) {
        const P = W4D.beats8ph;
        while (items.length < 2) { const p = bagFrom(G, 'bp', P); if (!items.some(x => x.t === p[0])) items.push({ t: p[0], n: nBeats(p[1]), scene: p[2] }); }
      } else {
        const maxB = [0, 2, 3, 3, 4][lv], W = W4D.beats8.filter(w => W4X.hasPic(w[1]));
        while (items.length < 2) {
          const n = bagFrom(G, 'bn' + lv, Array.from({ length: maxB }, (_, i) => i + 1)), pool = W.filter(w => nBeats(w[2]) === n && !items.some(x => x.t === w[0]));
          const w = bagFrom(G, 'bw' + n, pool.length ? pool : W.filter(x => !items.some(y => y.t === x[0])));
          items.push({ t: w[0], n: nBeats(w[2]), pic: w[1] });
        }
      }
      const seq = items.map(x => x.n);
      return { k: items.map(x => x.t), items, answer: 'all', seq, opts: null, asks: seq.map(n => ({ opts: [1, 2, 3, 4], answer: n })), chance: 1 / 16,
        slow: lv <= 2 ? 1 : 0, twice: lv <= 1 ? 1 : 0, phrase: lv >= 5 ? 1 : 0, item: null };
    },
    /* tests/w4_levels.js: more beats, normal speed, said once, two words */
    hard(q) { return (q.seq[0] + q.seq[1]) / 2 * 0.8 + (1 - q.slow) + (1 - q.twice) * 0.5 + q.phrase; },
    itemOf() { return null; },
    evaluate(st, ans) { return ans === 'all'; },
    build(G) { ZBase.build.call(this, G); if (!G.actors.hulk) K.actor(G, 'hulk', 180); },          /* Hulk claps along (§12.5) */
    decor(G) {
      const Lx = L(), s = G.actors[this.chars[0]], h = G.actors.hulk;
      Object.keys(G.actors).forEach(id => hideActor(G.actors[id]));
      if (s) showActor(s, Lx ? 86 : 76, Lx ? 698 : 1016, Lx ? 190 : 150);
      if (h) showActor(h, Lx ? 262 : 230, Lx ? 698 : 1016, Lx ? 200 : 160);
    },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.taps = 0; st.got = [];
      st.pics = q.items.map((it, j) => {
        const d = ZX.thing(st, 160, 160, 6, 'card'); d.classList.add('pic'); d.style.pointerEvents = 'none';
        d.appendChild(it.scene ? Scene.node(it.scene, 140) : W4X.pic(it.pic, 140));
        const m = el('div', '', d); Object.assign(m.style, { position: 'absolute', left: '50%', bottom: '-30px', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }); d._mini = m;
        K.pop(st, d, 100 * j); return d;
      });
      st.dotsEl = ZX.thing(st, 10, DOT, 7, 'item'); st.dotsEl.style.pointerEvents = 'none'; st.dotsEl.dataset.ex = 'beats';
      st.dots = Array.from({ length: MAXDOTS }, (_, i) => { const d = ZX.thing(st, DOT, DOT, 8, 'item'); d.innerHTML = '<div style="position:absolute;left:14px;top:14px;width:60px;height:60px;border-radius:50%;box-sizing:border-box"></div>'; K.reg(st, 'dot' + i, d, {}); return d; });
      st.drum = ZX.thing(st, 250, 210, 6, 'item'); st.drum.innerHTML = DRUM_SVG; K.reg(st, 'drum', st.drum, {});
      const sk = el('div', '', st.drum); Object.assign(sk.style, { position: 'absolute', left: '30%', top: '-24%', width: '40%', height: '30%', pointerEvents: 'none' }); sk.innerHTML = STICKS;
      st.done = ZX.thing(st, 120, 120, 6, 'item'); K.reg(st, 'done', st.done, {});
      st.done.innerHTML = '<svg viewBox="0 0 120 120" width="100%" height="100%"><circle cx="60" cy="60" r="54" fill="#46C27A" stroke="#2B2118" stroke-width="7"/><path d="M34 62L52 80L88 40" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      this.showDots(st); this.mark(st); this.place(st);
      K.pop(st, st.drum); K.pop(st, st.done, 150);
      Voice.say('听，拍几下？', { tag: 'prompt' });
      this.sayWord(st);
    },
    word(st) { return st.q.items[st.ix].t; },
    sayWord(st, slow) {
      const q = st.q, t = (slow || q.slow ? '~' : '') + this.word(st);
      st.prompt = t;
      Voice.say(t, { tag: 'prompt' }); if (q.twice) Voice.say(t, { tag: 'prompt' });
    },
    mark(st) { st.pics.forEach((d, j) => { d.style.boxShadow = j === st.ix ? '0 0 0 5px #2B2118, 0 0 0 11px #FFE14A' : ''; d.style.opacity = j === st.ix || st.got.includes(j) ? '1' : '.6'; }); },
    /* the dots: one lit a beat; four always shown (five, six when beaten more) */
    showDots(st, n, color) {
      n = n == null ? st.taps : n;
      const shown = Math.max(4, Math.min(MAXDOTS, n));
      st.dots.forEach((d, i) => {
        d.style.visibility = i < shown ? '' : 'hidden';
        Object.assign(d.firstChild.style, i < n ? { background: color || '#FFC93C', boxShadow: '0 0 0 5px #2B2118, 0 0 14px 4px rgba(255,201,60,.8)' } : { background: 'rgba(255,255,255,.55)', boxShadow: 'inset 0 0 0 5px rgba(43,33,24,.45)' });
      });
      st.shownDots = shown; this.placeDots(st);
    },
    placeDots(st) {
      const n = st.shownDots || 4, g = 12, W = n * DOT + (n - 1) * g, cx = L() ? 512 : 352, y = L() ? 232 : 368;
      st.dots.forEach((d, i) => place(d, Math.round(cx - W / 2 + i * (DOT + g)), y, DOT, DOT));
      place(st.dotsEl, Math.round(cx - W / 2), y, W, DOT);
    },
    place(st) {
      if (!st.drum) return;
      const Lx = L();
      st.pics.forEach((d, j) => place(d, (Lx ? 512 : 352) + (j ? 1 : -1) * 96 - 80, Lx ? 28 : 150, 160, 160));
      this.placeDots(st);
      place(st.drum, (Lx ? 512 : 352) - 125, Lx ? 382 : 520, 250, 210);
      place(st.done, Lx ? 790 : 530, Lx ? 430 : 790, 120, 120);
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted || st.busy) return false;
      const q = st.q;
      if (p.id === 'drum') {
        if (st.taps >= MAXDOTS) { K.wiggle(st, st.drum); return 'free'; }
        st.taps++; this.showDots(st); Sfx.thud();
        st.scope.anim(st.drum, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.06,.92)' }, { transform: 'scale(1,1)' }], { duration: 180, fill: 'none' });
        const h = st.G.actors.hulk; if (h) h.hop();
        return 'ok';
      }
      const m = /^dot(\d)$/.exec(p.id || '');
      if (m) { if (Number(m[1]) !== st.taps - 1) return false; st.taps--; this.showDots(st); Sfx.back(); return 'free'; }      /* a change of mind: no answer */
      if (p.id !== 'done') return false;
      if (!st.taps) { K.hop(st, st.drum, 16); return 'free'; }                       /* nothing beaten yet: the drum shows where */
      Sfx.tap();
      if (st.taps !== q.seq[st.ix]) { st.made = st.taps; Session.submit(st, st.taps); return 'ok'; }
      if (st.ix + 1 < q.items.length) {                     /* the first word right: its dots go under its picture, the second word comes */
        st.got.push(st.ix); this.mini(st, st.ix, st.taps);
        st.ix++; st.taps = 0; this.showDots(st); this.mark(st);
        st.busy = true; Sfx.place();
        st.scope.timeout(() => { st.busy = false; if (Session.alive(st) && !st.submitted) this.sayWord(st); }, 350);
        return 'ok';
      }
      Session.submit(st, 'all');
      return 'ok';
    },
    mini(st, j, n) { const m = st.pics[j]._mini; m.innerHTML = ''; for (let i = 0; i < n; i++) { const b = el('div', '', m); Object.assign(b.style, { width: '18px', height: '18px', borderRadius: '50%', background: '#FFC93C', boxShadow: '0 0 0 3px #2B2118' }); } },
    async reveal(st) {
      this.mini(st, st.ix, st.taps); st.got.push(st.ix); this.mark(st);
      Sfx.reveal(); K.hop(st, st.drum, 20); st.dots.forEach((d, i) => { if (i < st.taps) st.scope.timeout(() => K.hop(st, d, 16), 90 * i); });
      const h = st.G.actors.hulk; if (h) h.react();
      Voice.say(this.word(st), { tag: 'summary' }); this.cheerAll(st);      /* every beat word is recorded as it is (not with '!') */
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: how many he beat - "拍了两下" */
    async feedback(st, ans) { K.wiggle(st, st.drum); Voice.say(beatLine(ans), { tag: 'wrong' }); await st.scope.wait(800); },
    /* explain: 1 his dots in blue; 2 the word said slowly, a dot lighting up a beat and Hulk clapping (a beat); 3 the right
       number of dots in gold: "三拍" */
    async explain(st) {
      const q = st.q, n = q.seq[st.ix], w = this.word(st), h = st.G.actors.hulk;
      EX.ring(st, st.dotsEl, 'chosen');
      await EX.wait(st, 650);
      await W4X.exBeat(st, async () => {
        this.showDots(st, 0);
        Voice.say('~' + w, { tag: 'explain' });
        for (let i = 1; i <= n; i++) { await EX.tick(st, i === 1 ? 250 : 420); if (st.scope.dead) return; this.showDots(st, i); Sfx.thud(); if (h) h.hop(); }
        await st.scope.guard(Voice.afterSay(60));
      }, 200);
      this.showDots(st, n);
      await W4X.exRight(st, st.dotsEl, null, [COUNT[n] + '拍'], false);
    },
    /* the 2nd hint: the word once more, slowly (only the question again - softHint: the star stays) */
    gestureHint(st, reteach) {
      if (reteach) { K.hop(st, st.drum, 18); st.scope.timeout(() => K.hop(st, st.done, 18), 400); return; }
      K.hop(st, st.pics[st.ix], 18); this.sayWord(st, true);
    },
    next(st, strat) {
      if (!st.drum || st.busy) return null;
      const need = st.q.seq[st.ix], want = strat === 'wrong' ? (need === 1 ? 2 : need - 1) : need;
      if (st.taps < want) return { g: 'tap', p: { id: 'drum' } };
      if (st.taps > want) return { g: 'tap', p: { id: 'dot' + (st.taps - 1) } };
      return { g: 'tap', p: { id: 'done' } };
    },
    workEls(st) { return st.drum ? [st.drum, st.done] : []; },
    snap(st) { return { ix: st.ix || 0, taps: st.taps || 0 }; },
    iconNode() { const d = el('div'); d.innerHTML = DRUM_SVG; Object.assign(d.style, { width: '82%', height: '70%' }); return d; },
  };

  /* ---------------------------------------------------------------- ⑧-4 挑战 「排！」 故事排排队 (put a little story in order)
     The mission board has slots ①②③(④); below, the story's sentence cards, shuffled (read, not said: HOLD a card to hear it -
     that question earns no star). Tap a card: it flies into the next empty slot (tap it there: back down); or drag it into any
     slot. Every slot full: judged - the order must be the story's (STORY8: exactly one order is possible). Levels: 1 three
     sentences, a little picture by every slot in the right order (put them as the pictures go); 2 three, no pictures, the link
     is plain (开门 -> 出门 -> 去田里); 3 three, the link has to be thought (下雪 -> 山上白了); 4 four sentences; 5 four, thought
     out. Random: 1 in 6 (four: 1 in 24). */
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  const BADGE = ['①', '②', '③', '④'];
  const CARD_W = 340, CARD_H = 96, BADGE_W = 96;
  const Story = {
    rule: 'story-order', kind0: 'quiz', verb: '排！', intro: '故事排排队！', props: [],
    gen(G, o) {
      const lv = o.level, known = s => s.s.every(t => W4X.knowsAll(G, t));
      let n = lv >= 4 ? 4 : 3, all = W4D.story8.map((s, i) => Object.assign({ i }, s)).filter(s => s.s.length === n && known(s));
      if (!all.length) { n = 3; all = W4D.story8.map((s, i) => Object.assign({ i }, s)).filter(s => s.s.length === 3 && known(s)); }
      const want = lv === 3 || lv === 5 ? 1 : 0, tier = all.filter(s => s.think === want), list = tier.length ? tier : all;
      const s = bagFrom(G, 'st' + lv, list);
      let perm = R(G, s.s.map((_, j) => j));
      for (let t = 0; t < 6 && perm.every((v, j) => v === j); t++) perm = R(G, perm);
      if (perm.every((v, j) => v === j)) perm.push(perm.shift());                    /* never already in order */
      const seq = s.s.map((_, j) => perm.indexOf(j)), mine = poolOf(G, 'zh', false), item = Array.from(s.s.join('')).find(c => mine.includes(c)) || null;
      return { k: [s.i, perm.join('')], story: s.i, s: s.s.slice(), pics: s.pic, perm, seq, answer: seq.join(','), build: 1, opts: null, chance: 1 / fact(n), words: s.s.slice(),
        n, think: s.think, pic: lv <= 1 ? 1 : 0, item };
    },
    /* tests/w4_levels.js: the pictures gone, a link to think out, four sentences */
    hard(q) { return (1 - q.pic) * 1.5 + q.think * 1.5 + (q.n - 3) * 2; },
    itemOf(st) { return st.q.item ? W4X.own(st, st.q.item) : null; },
    itemsOf(st) { const mine = poolOf(st.G, 'zh', false); return Array.from(new Set(st.q.s.join(''))).filter(c => c !== st.q.item && mine.includes(c)); },
    async present(st) {
      const q = st.q, n = q.n;
      st.board = ZX.thing(st, 10, 10, 3, 'item'); Object.assign(st.board.style, { borderRadius: '24px', background: 'rgba(240,247,255,.92)', boxShadow: '0 0 0 6px #2E6FD8, 0 0 0 12px #D63B2F, 0 10px 0 12px rgba(43,33,24,.18)', pointerEvents: 'none' });
      st.slotEls = q.s.map((_, s) => {
        const b = ZX.thing(st, BADGE_W, CARD_H, 5, 'item'); b.style.pointerEvents = 'none';
        Object.assign(b.style, { borderRadius: '18px', background: '#FFE9A8', boxShadow: '0 0 0 4px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        if (q.pic) b.appendChild(Scene.node(q.pics[s], 84)); else { const t = el('div', '', b); t.textContent = BADGE[s]; Object.assign(t.style, { font: '900 56px system-ui,sans-serif', color: INK, lineHeight: 1 }); }
        const z = ZX.thing(st, CARD_W, CARD_H, 4, 'item'); z.style.pointerEvents = 'none';
        Object.assign(z.style, { borderRadius: '18px', border: '5px dashed rgba(43,33,24,.55)', boxSizing: 'border-box', background: 'rgba(255,255,255,.45)' });
        return { b, z };
      });
      const cards = q.perm.map(j => { const d = ZX.thing(st, CARD_W, CARD_H, 12, 'card'); d.appendChild(glyphRow(q.s[j], 40)); d._t = q.s[j]; return d; });
      st.slots = W4X.slots(st, {
        cards, n,
        slot: s => this.slotRect(st, s), tray: i => this.trayRect(st, i),
        full: order => { if (Session.alive(st)) Session.submit(st, order.join(',')); },
        hear: i => { st.peeked = true; st.noStar = true; Voice.sayNow(cards[i]._t, { tag: 'peek' }); },
        look: (i, s) => { cards[i].style.boxShadow = s >= 0 ? '0 0 0 4px #2B2118, 0 0 0 9px #FFC93C' : ''; },
      });
      this.place(st);
      cards.forEach((d, i) => K.pop(st, d, 80 * i));
      K.say(st, '按顺序排好！');
    },
    rows(st) { const n = st.q.n; return L() ? { y0: n > 3 ? 100 : 140, gap: 12 } : { y0: n > 3 ? 120 : 150, gap: 12 }; },
    slotRect(st, s) { const r = this.rows(st), y = r.y0 + s * (CARD_H + r.gap); return L() ? { x: 640, y, w: CARD_W, h: CARD_H } : { x: 234, y, w: CARD_W, h: CARD_H }; },
    trayRect(st, i) { const r = this.rows(st), n = st.q.n; if (L()) return { x: 174, y: r.y0 + i * (CARD_H + r.gap), w: CARD_W, h: CARD_H }; const y0 = r.y0 + n * (CARD_H + r.gap) + 34; return { x: 182, y: y0 + i * (CARD_H + r.gap), w: CARD_W, h: CARD_H }; },
    place(st) {
      if (!st.slots) return;
      const n = st.q.n;
      st.slotEls.forEach((e, s) => { const r = this.slotRect(st, s); place(e.z, r.x, r.y, r.w, r.h); place(e.b, r.x - BADGE_W - 8, r.y, BADGE_W, CARD_H); });
      const a = this.slotRect(st, 0), z = this.slotRect(st, n - 1);
      place(st.board, a.x - BADGE_W - 26, a.y - 18, CARD_W + BADGE_W + 44, z.y + z.h - a.y + 36);
      st.slots.layout();
    },
    /* Spider-Man on the left; Hulk on the right, a little smaller - under the board of four */
    decor(G) {
      const Lx = L(), a = G.actors[this.chars[0]], b = G.actors[this.chars[1]];
      this.chars.forEach(id => hideActor(G.actors[id]));
      if (a) showActor(a, Lx ? 90 : 76, Lx ? 698 : 1016, Lx ? 190 : 150);
      if (b) showActor(b, Lx ? 950 : 630, Lx ? 698 : 1016, Lx ? 140 : 150);
    },
    onGesture(st, name, p) { if (st.submitted) return false; return st.slots ? st.slots.gesture(name, p) : false; },
    async reveal(st) {
      const q = st.q;
      Sfx.reveal();
      const sp = st.G.actors.spiderman; if (sp) sp.react();
      this.cheerAll(st);
      for (let s = 0; s < q.n; s++) { K.hop(st, st.slots.cards[q.seq[s]], 16); Voice.say(q.s[s], { tag: 'summary' }); await st.scope.guard(Voice.afterSay(60)); }
    },
    /* the factual line: the first card out of place belongs further on - "这一句在后面" */
    async feedback(st) { const at = st.slots.at, s = at.findIndex((i, j) => i !== st.q.seq[j]), i = at[s]; if (i >= 0) K.wiggle(st, st.slots.cards[i]); Voice.say('这一句在后面', { tag: 'wrong' }); await st.scope.wait(800); },
    /* explain: 1 the first card out of place in blue; 2 every card to its right slot, then the story read a sentence a beat, each
       with its little picture; 3 the first card in gold: "先是这一句" (a story of four: the gold ring comes with its first sentence,
       no line more - the explanation stays within 5 s) */
    async explain(st) {
      const q = st.q, S = st.slots, s0 = S.at.findIndex((i, j) => i !== q.seq[j]), eC = S.cards[S.at[s0]];
      if (eC) EX.ring(st, eC, 'chosen');
      await EX.wait(st, 300);
      Stage.el.querySelectorAll('.exring.chosen').forEach(r => r.remove());          /* the cards move: the ring would mark an empty place */
      S.at.fill(-1); S.where.fill(-1); q.seq.forEach((i, s) => { S.at[s] = i; S.where[i] = s; });
      await Promise.all(q.seq.map((i, s) => S.go(i, this.slotRect(st, s), 200)));
      for (let s = 0; s < q.n; s++) {
        const c = S.cards[q.seq[s]], b = st.slotEls[s].b;
        b.innerHTML = ''; b.appendChild(Scene.node(q.pics[s], 84)); K.pop(st, b);
        c.style.background = '#FFF1BF';
        if (!s && q.n > 3) { EX.ring(st, c, 'right'); K.hop(st, c, 16); }      /* four sentences: the first one's gold ring comes with it (the whole story in 5 s) */
        if (st.step) await EX.say(st, [q.s[s]]);                          /* 一步一步: a sentence a beat */
        else { Voice.say(q.s[s], { tag: 'explain' }); await st.scope.guard(Voice.afterSay(40)); }      /* auto: the story told without gaps (2-5 s) */
        st.stepDirty = true;
        await EX.wait(st, 0);
        c.style.background = '';
      }
      if (q.n <= 3) { const e1 = S.cards[q.seq[0]]; EX.ring(st, e1, 'right'); K.hop(st, e1, 16); await EX.say(st, ['先是这一句']); }
      await EX.wait(st, 80);
    },
    /* the 2nd hint (real help): the first sentence's card lights up - the star goes */
    gestureHint(st, reteach) {
      if (reteach) { st.slots.cards.forEach((c, i) => { if (st.slots.where[i] < 0) st.scope.timeout(() => K.hop(st, c, 14), 90 * i); }); return; }
      const c = st.slots.cards[st.q.seq[0]]; K.flash(st, [c]); K.hop(st, c, 18); Sfx.sparkle();
    },
    next(st, strat) { return st.slots ? st.slots.next(st.q.seq, strat) : null; },
    workEls(st) { return st.slots ? st.slots.cards : []; },
    snap(st) { return { at: st.slots ? st.slots.order() : null }; },
    iconNode() { const d = el('div'); Object.assign(d.style, { display: 'flex', flexDirection: 'column', gap: '3px' }); ['①', '②', '③'].forEach(t => { const r = el('div', '', d); Object.assign(r.style, { width: '54px', height: '15px', borderRadius: '5px', background: '#fff', boxShadow: '0 0 0 2px #2B2118', font: '900 12px system-ui', lineHeight: '15px', paddingLeft: '3px' }); r.textContent = t; }); return d; },
  };

  /* ---------------------------------------------------------------- ⑧-2 写字 好 力: the finishing shows (§12.5, over W4X.Write)
     好: 女 and 子 stand apart, then come together (女加子变成好！) and the thumbs-up sticker hops; 力: Hulk flexes */
  const WX = {
    async reveal(st) {
      await WriteBase.reveal.call(this, st);
      if (!Session.alive(st) || !st.w) return;
      const k = st.q.answer, c = st.w.center(), pic = st.alivePic;
      if (k === '好') {
        const sz = L() ? 120 : 130, parts = ['女', '子'].map((p, j) => { const d = ZX.thing(st, sz, sz, 40, 'card'); d.appendChild(Glyph.zh(p, sz * 0.82)); d.style.pointerEvents = 'none'; place(d, c.x - sz / 2 + (j ? 1 : -1) * (sz + 40), c.y + (L() ? 90 : 120) - sz / 2, sz, sz); K.pop(st, d, 120 * j); return d; });
        Voice.say('女加子变成好！', { tag: 'summary' });
        await st.scope.wait(650);
        await Promise.all(parts.map((d, j) => st.scope.anim(d, [{ transform: 'translateX(0) scale(1)', opacity: 1 }, { transform: 'translateX(' + ((j ? -1 : 1) * (sz / 2 + 20)) + 'px) scale(.9)', opacity: 1, offset: 0.7 }, { transform: 'translateX(' + ((j ? -1 : 1) * (sz / 2 + 40)) + 'px) scale(.4)', opacity: 0 }], { duration: 600, easing: EASE.glide, fill: 'forwards' })));
        Sfx.sparkle(); Fx.burst(c.x, c.y + (L() ? 90 : 120), { n: 16, dist: 100 });
        if (pic) { K.hop(st, pic, 40); st.scope.timeout(() => K.hop(st, pic, 26), 320); }
        await st.scope.guard(Voice.afterSay(150));
      } else if (k === '力' && pic) {
        Sfx.boing();
        await st.scope.anim(pic, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.16,.88)' }, { transform: 'scale(.92,1.12)' }, { transform: 'scale(1.14,.92)' }, { transform: 'scale(1,1)' }], { duration: 900, easing: EASE.glide, fill: 'none' });
        const b = box(pic); Fx.burst(b.x + b.w / 2, b.y + b.h / 2, { n: 14, dist: 110 });
      }
    },
  };

  w4Island('avengers4', [Circle, Beats, Story, WX]);
})();
