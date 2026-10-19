/* ================================================================ 神笔海 ⑨ 变形金刚 · 汽车人工厂 (robot4): 变 能 工 厂 路 (docs/W4-DESIGN.md §12.5)
   认字 「跟！」变成车，跟住它 (track-after-transform) · 写字 工 厂 (W4X.Write + wx: the toolbox's wrench, the factory's gear) ·
   英文 「装！」拼出一句话 (build-the-sentence, W4X.slots) · 挑战 「变！」加一笔，变一变 (add-one-stroke).
   The shape of src/w4/ultra4.js (src/w4/README.md, the ⑧ ⑨ section). Never st.step (the engine's 一步一步 flag). */
(() => {
  const L = () => K.L();
  W4X.lines(['变形！', '这个词在后面', '这个词用不上', '加一笔，变成什么？', '减一笔，变成什么？']);

  /* ---------------------------------------------------------------- ⑨-1 认字 「跟！」 变成车，跟住它 (find, then track)
     Five little robots (six at level 5), a character on every chest: "找变！" - he finds it while they stand. Then "变形！": they
     all turn into little cars (the signs go away), the cars swap places, and "变在哪辆车里？" - a tap on a car turns it back into
     its robot. Right: the car of the robot that held X. Levels: 1 the picture on the task card, the robots stand 4 s, the cars do
     not move; 2 heard only, 3.5 s, one slow swap; 3 look-alikes (工/土/王, 变/亦, 路/跳) and an old character, two swaps; 4 three
     swaps, every car the same colour; 5 six robots, four swaps. A random tap is right 1 time in 5 (6). The cars swap one over
     the parked row and one under it: a car never runs over another one. */
  const BOTCOL = ['#E8414B', '#2E86DE', '#3FAE4A', '#F28C1E', '#8E6CFF', '#16A3A3'];
  const robotSVG = c => '<svg viewBox="0 0 120 170" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">'
    + '<path d="M60 4V16" stroke="#2B2118" stroke-width="4"/><circle cx="60" cy="5" r="5" fill="#FFE14A" stroke="#2B2118" stroke-width="2.5"/>'
    + '<rect x="28" y="14" width="64" height="46" rx="12" fill="' + c + '" stroke="#2B2118" stroke-width="4"/>'
    + '<circle cx="46" cy="35" r="8" fill="#fff" stroke="#2B2118" stroke-width="3"/><circle cx="74" cy="35" r="8" fill="#fff" stroke="#2B2118" stroke-width="3"/><circle cx="47" cy="36" r="3.5" fill="#2B2118"/><circle cx="75" cy="36" r="3.5" fill="#2B2118"/>'
    + '<rect x="48" y="47" width="24" height="5" rx="2.5" fill="#2B2118"/><rect x="52" y="58" width="16" height="8" fill="#9AA7B8" stroke="#2B2118" stroke-width="3"/>'
    + '<rect x="3" y="70" width="14" height="44" rx="7" fill="' + c + '" stroke="#2B2118" stroke-width="4"/><rect x="103" y="70" width="14" height="44" rx="7" fill="' + c + '" stroke="#2B2118" stroke-width="4"/>'
    + '<rect x="32" y="124" width="20" height="32" rx="6" fill="#9AA7B8" stroke="#2B2118" stroke-width="4"/><rect x="68" y="124" width="20" height="32" rx="6" fill="#9AA7B8" stroke="#2B2118" stroke-width="4"/>'
    + '<rect x="16" y="64" width="88" height="64" rx="14" fill="' + c + '" stroke="#2B2118" stroke-width="4"/>'
    + '<rect x="25" y="154" width="31" height="13" rx="5" fill="' + c + '" stroke="#2B2118" stroke-width="3"/><rect x="64" y="154" width="31" height="13" rx="5" fill="' + c + '" stroke="#2B2118" stroke-width="3"/></svg>';
  const carSVG = c => '<svg viewBox="0 0 140 96" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">'
    + '<path d="M8 72V54Q8 40 22 38L40 36L54 16Q58 10 66 10H98Q106 10 110 18L122 36Q134 38 134 52V72Z" fill="' + c + '" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<path d="M47 36L59 19H76V36Z" fill="#CFE8FF" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><path d="M82 19H96Q100 19 102 23L110 36H82Z" fill="#CFE8FF" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/>'
    + '<circle class="lamp" cx="125" cy="50" r="6" fill="#FFE14A" stroke="#2B2118" stroke-width="2.5"/><rect x="10" y="48" width="10" height="7" rx="3" fill="#FF8A7A" stroke="#2B2118" stroke-width="2"/>'
    + '<circle cx="38" cy="74" r="15" fill="#2B2118"/><circle cx="38" cy="74" r="6" fill="#BFC6D0"/><circle cx="104" cy="74" r="15" fill="#2B2118"/><circle cx="104" cy="74" r="6" fill="#BFC6D0"/></svg>';
  const Track = {
    rule: 'track-after-transform', verb: '跟！', intro: '看好，跟住它！', props: [],
    gen(G, o) {
      const lv = o.level, pool = poolOf(G, 'zh', false), n = lv >= 5 ? 6 : 5, answer = W4X.pick(G, pool), opts = W4X.opts(G, lv, answer, n);
      const nsw = [0, 0, 1, 2, 3, 4][lv], swaps = [], lk = LOOK[answer] || '';
      let at = opts.indexOf(answer);                          /* the slot of X's car (the cars start where their robots stood) */
      for (let k = 0; k < nsw; k++) {                         /* X's car swaps in the first one and in most of the others */
        const a = k === 0 || G.rng() < 0.65 ? at : G.rng.int(0, n - 1), prev = swaps[k - 1] || [];
        let b;
        do { b = G.rng.int(0, n - 2); if (b >= a) b++; } while (prev.includes(a) && prev.includes(b));      /* never straight back */
        swaps.push([a, b]);
        if (a === at) at = b; else if (b === at) at = a;
      }
      return { k: [answer, opts.join(''), swaps.map(s => s.join('')).join()], answer, opts, swaps, n, nsw, pic: lv <= 1 ? 1 : 0, same: lv >= 4 ? 1 : 0,
        stand: [0, 4000, 3500, 3500, 3200, 3000][lv], swapMs: [0, 0, 1400, 1050, 950, 850][lv],
        look: opts.filter(k => k !== answer && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: the picture gone, look-alikes, old characters, more swaps, one colour, a sixth car */
    hard(q) { return (1 - q.pic) + q.look + q.rev * 0.8 + q.nsw * 1.2 + q.same * 1.5 + (q.n - 5) * 1.5; },
    geo(st) {
      const n = st.q.n, Lx = L();
      const cw = Lx ? (n > 5 ? 128 : 140) : (n > 5 ? 104 : 120), gap = Lx ? (n > 5 ? 18 : 24) : (n > 5 ? 10 : 14), cx = Lx ? 590 : 352;
      const x0 = cx - (n * cw + (n - 1) * gap) / 2, park = Lx ? 470 : 700, ch = 92, rw = Math.min(cw - 6, 120), rh = Math.round(rw * 170 / 120);
      return { n, cw, gap, x0, park, ch, rw, rh, up: park - ch - 124, down: park + 26, sx: s => x0 + s * (cw + gap) + cw / 2 };
    },
    async present(st) {
      const q = st.q;
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      st.opts = q.opts.slice(); st.slotOf = q.opts.map((_, i) => i); st.isCar = q.opts.map(() => false); st.asking = false;
      st.lines = ZX.thing(st, 10, 10, 3, 'item'); st.lines.style.pointerEvents = 'none';
      st.cards = st.bots = q.opts.map((k, i) => {
        const d = el('div', '', Stage.el); Object.assign(d.style, { position: 'absolute', zIndex: 8 }); st.els.push(d);
        const r = d._robot = el('div', '', d); Object.assign(r.style, { position: 'absolute', inset: 0, pointerEvents: 'none' }); r.innerHTML = robotSVG(BOTCOL[i % BOTCOL.length]);
        const sg = el('div', '', r); Object.assign(sg.style, { position: 'absolute', left: '24%', bottom: '25.5%', width: '52%', aspectRatio: '1', borderRadius: '50%', background: '#FFFDF4', boxShadow: '0 0 0 3px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        const g = Glyph.zh(k, 60); g.setAttribute('width', '80%'); g.setAttribute('height', '80%'); sg.appendChild(g);
        const c = d._car = el('div', '', d); Object.assign(c.style, { position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }); c.innerHTML = carSVG(q.same ? '#2E86DE' : BOTCOL[i % BOTCOL.length]);
        d._lamp = c.querySelector('.lamp');
        K.pop(st, d, 80 * i);
        return d;
      });
      this.place(st);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
      K.say(st, '找' + q.answer + '！');
      this.run(st);
    },
    /* the bots where they are now: a robot standing on its line, or a car parked on it */
    botRect(st, i, s) { const G = this.geo(st), x = G.sx(s == null ? st.slotOf[i] : s); return st.isCar[i] ? { x: x - (G.cw - 4) / 2, y: G.park - G.ch, w: G.cw - 4, h: G.ch } : { x: x - G.rw / 2, y: G.park - G.rh, w: G.rw, h: G.rh }; },
    place(st) {
      if (!st.bots) return;
      const G = this.geo(st);
      st.bots.forEach((d, i) => { const r = this.botRect(st, i); place(d, Math.round(r.x), Math.round(r.y), Math.round(r.w), Math.round(r.h)); });
      const w = G.n * G.cw + (G.n - 1) * G.gap + G.gap; place(st.lines, Math.round(G.x0 - G.gap / 2), G.park - 104, Math.round(w), 118);
      let s = '<svg viewBox="0 0 ' + Math.round(w) + ' 118" width="100%" height="100%">';
      for (let k = 0; k <= G.n; k++) { const x = k * (G.cw + G.gap); s += '<path d="M' + x + ' 8V108" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>'; }
      st.lines.innerHTML = s + '<path d="M0 108H' + Math.round(w) + '" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/></svg>';
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* a pause the tests' 'wait' gesture may cut short */
    hold(st, ms) { return new Promise(res => { st.skip = res; W4X.tick(st, ms).then(res); }); },
    /* robot <-> car, in place (the sign goes away with the robot) */
    morph(st, i, car, ms) {
      const d = st.bots[i]; if (!d || st.isCar[i] === car) return Promise.resolve();
      st.isCar[i] = car; const r = this.botRect(st, i); place(d, Math.round(r.x), Math.round(r.y), Math.round(r.w), Math.round(r.h));
      const a = car ? d._robot : d._car, b = car ? d._car : d._robot;
      a.style.opacity = 0; b.style.opacity = 1;
      st.scope.anim(b, [{ transform: 'scale(.4,.2)', opacity: 0 }, { transform: 'scale(1.1)', opacity: 1, offset: 0.7 }, { transform: 'scale(1)', opacity: 1 }], { duration: ms == null ? 360 : ms, easing: EASE.pop, fill: 'none' });
      return st.scope.wait(ms == null ? 360 : ms);
    },
    /* two cars change places: one over the row, one under it */
    async swap(st, a, b, ms) {
      const G = this.geo(st), ia = st.slotOf.indexOf(a), ib = st.slotOf.indexOf(b); if (ia < 0 || ib < 0) return;
      const ra = this.botRect(st, ia, a), rb = this.botRect(st, ib, b), go = (i, pts) => st.scope.anim(st.bots[i], pts.map(([x, y]) => ({ left: x + 'px', top: y + 'px' })), { duration: ms, easing: 'ease-in-out' });
      st.slotOf[ia] = b; st.slotOf[ib] = a;
      Sfx.whoosh(0.3);
      st.bots[ia].style.zIndex = 9; st.bots[ib].style.zIndex = 9;
      await Promise.all([go(ia, [[ra.x, ra.y], [ra.x, G.up], [rb.x, G.up], [rb.x, rb.y]]), go(ib, [[rb.x, rb.y], [rb.x, G.down], [ra.x, G.down], [ra.x, ra.y]])]);
      if (!Session.alive(st)) return;
      [ia, ib].forEach(i => { st.bots[i].getAnimations().forEach(x => x.cancel()); st.bots[i].style.zIndex = 8; const r = this.botRect(st, i); place(st.bots[i], Math.round(r.x), Math.round(r.y), Math.round(r.w), Math.round(r.h)); });
    },
    /* the show: they stand (find X), turn into cars, drive and swap - then the question (not awaited: the hints and the tests'
       'wait' gesture go on meanwhile) */
    async run(st) {
      try {
        const q = st.q;
        await this.hold(st, q.stand);
        if (!Session.alive(st)) return;
        const op = st.G.actors[this.chars[0]]; if (op) op.react('hop');
        Voice.say('变形！', { tag: 'prompt' }); Sfx.zap();
        st.bots.forEach((d, i) => this.morph(st, i, true));
        await this.hold(st, 800);
        for (const [a, b] of q.swaps) { if (!Session.alive(st)) return; await this.swap(st, a, b, q.swapMs); await this.hold(st, 180); }
        if (!Session.alive(st) || st.submitted) return;
        st.asking = true; st.bots.forEach((d, i) => K.reg(st, 'card' + i, d, {}));
        Hints.reset(st);
        K.say(st, `${q.answer}在哪辆车里？`);
      } catch (e) { /* the show never ends a question */ }
    },
    onGesture(st, name, p) {
      if (st.submitted) return false;
      if (name === 'wait') { if (st.skip) st.skip(); return 'free'; }
      if (name !== 'tap' || !st.asking) return false;
      const i = K.cardIndex(p.id); if (i < 0 || i >= st.bots.length) return false;
      st.tapped = i; Sfx.tap(); this.morph(st, i, false);                  /* the car turns back into its robot: the sign shows */
      Session.submit(st, st.opts[i]);
      return 'ok';
    },
    async reveal(st) {
      const i = st.opts.indexOf(st.q.answer), d = st.bots[i], r = box(d);
      Sfx.reveal(); K.hop(st, d, 30);
      const op = st.G.actors[this.chars[0]]; if (op) op.react('hop');
      await ZX.alive(st, st.q.answer, r.x + r.w / 2, Math.max(140, r.y - 70), 140);
      sayItem(st.q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 his car is a robot again, in blue with its picture ("这是工" was just said); 2 the swaps once more, quickly, X's
       car with a gold edge all the way (a beat); 3 X's car turns back into its robot, gold, "这个是变" */
    async explain(st, ans) {
      const q = st.q, iC = st.tapped, iR = st.opts.indexOf(q.answer);
      const ring = EX.ring(st, st.bots[iC], 'chosen'), pic = EX.picOver(st, st.bots[iC], ans, 'chosen');
      await EX.wait(st, 700);
      [ring, pic].forEach(e => e && e.remove());
      await W4X.exBeat(st, async () => {
        st.bots.forEach((d, i) => { st.slotOf[i] = i; st.isCar[i] = false; this.morph(st, i, true, 0); });
        this.place(st);
        st.bots[iR].style.filter = 'drop-shadow(0 0 3px ' + EX_GOLD + ') drop-shadow(0 0 3px ' + EX_GOLD + ') drop-shadow(0 0 8px rgba(255,190,40,.9))';
        await EX.tick(st, 250);
        for (const [a, b] of q.swaps) { await this.swap(st, a, b, 380); await EX.tick(st, 60); }
      }, 250);
      st.bots[iR].style.filter = '';
      await this.morph(st, iR, false);
      await W4X.exRight(st, st.bots[iR], q.answer, [W4X.thatIs(q.answer)]);
    },
    /* the 2nd hint (real help, no star after it): X's car blinks its headlight (before the swaps: its robot glows) */
    gestureHint(st, reteach) {
      if (!st.bots) return;
      if (reteach) { st.bots.forEach((d, i) => st.scope.timeout(() => K.hop(st, d, 16), 100 * i)); return; }
      const d = st.bots[st.opts.indexOf(st.q.answer)];
      if (d._lamp) st.scope.anim(d._lamp, [{ fill: '#FFE14A' }, { fill: '#FFFFFF' }, { fill: '#FFE14A' }], { duration: 500, iterations: 3, fill: 'none' });
      st.scope.anim(d, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 12px #FFE14A) drop-shadow(0 0 4px #fff)' }, { filter: 'none' }], { duration: 500, iterations: 3, fill: 'none' });
    },
    next(st, strat) {
      if (!st.bots) return null;
      if (!st.asking) return W4X.WAIT;
      const ai = st.opts.indexOf(st.q.answer), i = strat === 'wrong' ? (ai + 1) % st.bots.length : ai;
      return { g: 'tap', p: { id: 'card' + i } };
    },
    find(st, id) { return id === 'wait' ? st.lines : (st.map && st.map[id]) || null; },
    workEls(st) { return st.asking ? st.bots : []; },
    snap(st) { return { opts: st.opts || null, asking: !!st.asking }; },
    iconNode() { return W4X.svgIcon('<g transform="translate(2 4) scale(.4)">' + robotSVG('#E8414B').replace(/<\/?svg[^>]*>/g, '') + '</g><path d="M50 22H58M54 18L58 22L54 26" stroke="#2B2118" stroke-width="3" fill="none" stroke-linecap="round"/><g transform="translate(60 36) scale(.36)">' + carSVG('#2E86DE').replace(/<\/?svg[^>]*>/g, '') + '</g>', '0 0 112 72'); },
  };

  /* ---------------------------------------------------------------- ⑨-3 英文 「装！」 拼出一句话 (word order, a whole sentence)
     A picture; under it a robot's body with empty part slots (the end mark is the last cell, fixed); below, the words of a
     sentence on cards, mixed up - read, not said (HOLD a card to hear it: that question earns no star). Tap a card: it flies into
     the next empty slot (tap it in a slot: back down), or drag it to a slot. All slots full: the order is the answer. Levels:
     1 three words, the first one with its capital (where it starts); 2 three or four words; 3 four words, all lower case (but I);
     4 five words; 5 five words and one card that belongs nowhere (six cards, five slots). A build: random cards are right 1 time
     in 6 (3 words), 24, 120, 720. Sentences: ESENT9 (one possible order, known words only). */
  const WRD = t => t.match(/[A-Za-z]+/g) || [];
  let S9 = null;
  const sents9 = () => S9 || (S9 = W4D.esent9.map(([t, sc, extra]) => ({ t, sc, extra, w: WRD(t), end: (/[.!?]\s*$/.exec(t) || ['.'])[0].trim() })));
  const OK9 = [null, s => s.w.length === 3, s => s.w.length <= 4, s => s.w.length === 4, s => s.w.length === 5, s => s.w.length === 5 && !!s.extra];
  const Build = {
    rule: 'build-the-sentence', kind0: 'en', verb: '装！', intro: '拼出一句话！', props: [],
    gen(G, o) {
      const lv = o.level, all = sents9(), ok = all.filter(OK9[lv]), P = ok.length ? ok : all, t = bagFrom(G, 's9' + lv, P.map(s => s.t)), s = P.find(x => x.t === t);
      const lower = lv >= 3, show = w => (lower && w !== 'I' ? w.toLowerCase() : w), words = s.w.map(show), extra = lv >= 5 && s.extra ? show(s.extra) : null;
      const pool = words.concat(extra ? [extra] : []), n = words.length;
      let order;
      do { order = G.rng.shuffle(pool.map((_, i) => i)); } while (order.slice(0, n).every((c, j) => c === j) && pool.length > 1);     /* never already right */
      const cards = order.map(i => pool[i]), want = words.map((_, j) => order.indexOf(j)), fact = m => (m <= 1 ? 1 : m * fact(m - 1));
      return { k: [s.t, cards.join(' ')], text: s.t, words, cards, want, extra: extra ? order.indexOf(n) : -1, scene: s.sc, end: s.end, answer: 'ok', opts: null, build: 1,
        chance: 1 / (fact(pool.length) / fact(pool.length - n)), n, lower: lower ? 1 : 0, ext: extra ? 1 : 0 };
    },
    itemOf() { return null; },
    hard(q) { return (q.n - 3) + q.lower + q.ext * 1.5; },
    /* sizes that fit: the slots in one row (with the end mark), the cards in one row (two when they must) */
    fit(st) {
      const Lx = L(), q = st.q, maxS = Lx ? 900 : 640, maxT = Lx ? 800 : 660, gap = 14, endW = 46;
      let h = Lx ? 50 : 46, ws, sw, rows = 1;
      for (; ; h -= 2) {
        ws = st.w100.map(w => Math.max(96, Math.round(w * h / 100) + 30)); sw = Math.max(...ws);
        const tw = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1), slotsW = q.n * sw + (q.n - 1) * gap + endW + gap;
        if (slotsW <= maxS && tw <= maxT) break;
        if (h <= 34) { rows = tw > maxT ? 2 : 1; break; }
      }
      return { h, ws, sw, ch: 96, gap, endW, rows };
    },
    async present(st) {
      const q = st.q;
      st.peeked = false;
      st.picEl = ZX.thing(st, 170, 170, 5, 'card'); st.picEl.classList.add('pic'); st.picEl.style.pointerEvents = 'none'; st.picEl.appendChild(Scene.node(q.scene, 140));
      st.frame = ZX.thing(st, 10, 10, 4, 'item'); st.frame.style.pointerEvents = 'none';
      st.slotEls = q.words.map(() => { const d = ZX.thing(st, 10, 10, 6, 'item'); Object.assign(d.style, { border: '5px dashed rgba(43,33,24,.55)', borderRadius: '18px', background: 'rgba(255,255,255,.55)', boxSizing: 'border-box', pointerEvents: 'none' }); return d; });
      st.endEl = ZX.thing(st, 10, 10, 6, 'item'); Object.assign(st.endEl.style, { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', font: '900 64px system-ui,sans-serif', color: INK, pointerEvents: 'none', lineHeight: '1' }); st.endEl.textContent = q.end;
      st.w100 = q.cards.map(w => Number(Glyph.word(w, 100).getAttribute('width')));
      st.fitN = null;
      const cards = q.cards.map(w => { const c = ZX.thing(st, 10, 10, 12, 'card'); c.style.background = '#FFF6D8'; c._w = w; return c; });
      st.S = W4X.slots(st, { cards, n: q.n, slot: s => this.slotRect(st, s), tray: i => this.trayRect(st, i),
        full: order => this.full(st, order), hear: i => this.hear(st, i), look: (i, s) => { cards[i].style.background = s >= 0 ? '#FFFFFF' : '#FFF6D8'; } });
      st.opts = q.cards.slice();
      this.place(st);
      K.pop(st, st.picEl); K.pop(st, st.frame, 100);
      K.say(st, '拼出一句话！');
    },
    geom(st) {
      const Lx = L(), F = this.fit(st), q = st.q, n = q.n, slotsW = n * F.sw + (n - 1) * F.gap + F.gap + F.endW, sy = Lx ? 340 : 404, cx = Lx ? 540 : 352;
      return Object.assign(F, { Lx, cx, sy, x0: cx - slotsW / 2, slotsW, ty: Lx ? 514 : 640, tcx: Lx ? 600 : 352 });
    },
    slotRect(st, s) { const g = this.geom(st); return { x: Math.round(g.x0 + s * (g.sw + g.gap)), y: g.sy, w: g.sw, h: g.ch }; },
    trayRect(st, i) {
      const g = this.geom(st), m = st.q.cards.length, per = g.rows > 1 ? Math.ceil(m / 2) : m, row = Math.floor(i / per), idx = i - row * per, inRow = Math.min(per, m - row * per);
      const ids = Array.from({ length: inRow }, (_, j) => row * per + j), tw = ids.reduce((a, j) => a + g.ws[j], 0) + g.gap * (inRow - 1);
      let x = g.tcx - tw / 2; for (let j = 0; j < idx; j++) x += g.ws[ids[j]] + g.gap;
      return { x: Math.round(x), y: g.ty + row * (g.ch + 18), w: g.ws[i], h: g.ch };
    },
    place(st) {
      if (!st.S) return;
      const g = this.geom(st), q = st.q;
      if (st.fitN !== g.h) {               /* the words at this size */
        st.fitN = g.h;
        st.S.cards.forEach((c, i) => { c.innerHTML = ''; const gl = Glyph.word(c._w, g.h); gl.style.pointerEvents = 'none'; c.appendChild(gl); });
      }
      place(st.picEl, Math.round(g.cx - 80), g.Lx ? 92 : 144, 160, 160);
      st.slotEls.forEach((d, s) => place(d, Math.round(g.x0 + s * (g.sw + g.gap)), g.sy, g.sw, g.ch));
      place(st.endEl, Math.round(g.x0 + q.n * (g.sw + g.gap)), g.sy, g.endW, g.ch - 14);
      /* the robot: its body round the slots, a head on top, two legs */
      const fx = g.x0 - 22, fy = g.sy - 70, fw = g.slotsW + 44, fh = g.ch + 110;
      place(st.frame, Math.round(fx), Math.round(fy), Math.round(fw), Math.round(fh));
      const hx = fw / 2;
      st.frame.innerHTML = '<svg viewBox="0 0 ' + Math.round(fw) + ' ' + Math.round(fh) + '" width="100%" height="100%" style="overflow:visible">'
        + '<rect x="' + (hx - 52) + '" y="2" width="104" height="58" rx="16" fill="#9AA7B8" stroke="#2B2118" stroke-width="5"/><circle cx="' + (hx - 22) + '" cy="30" r="10" fill="#FFF" stroke="#2B2118" stroke-width="4"/><circle cx="' + (hx + 22) + '" cy="30" r="10" fill="#FFF" stroke="#2B2118" stroke-width="4"/>'
        + '<g class="eyes"><circle cx="' + (hx - 22) + '" cy="31" r="4" fill="#2B2118"/><circle cx="' + (hx + 22) + '" cy="31" r="4" fill="#2B2118"/></g>'
        + '<rect x="4" y="56" width="' + (fw - 8) + '" height="' + (g.ch + 24) + '" rx="26" fill="#C9D3DF" stroke="#2B2118" stroke-width="5"/>'
        + '<circle cx="20" cy="72" r="5" fill="#8A96A8"/><circle cx="' + (fw - 20) + '" cy="72" r="5" fill="#8A96A8"/><circle cx="20" cy="' + (g.ch + 64) + '" r="5" fill="#8A96A8"/><circle cx="' + (fw - 20) + '" cy="' + (g.ch + 64) + '" r="5" fill="#8A96A8"/>'
        + '<rect x="' + (hx - 70) + '" y="' + (g.ch + 80) + '" width="34" height="26" rx="8" fill="#9AA7B8" stroke="#2B2118" stroke-width="5"/><rect x="' + (hx + 36) + '" y="' + (g.ch + 80) + '" width="34" height="26" rx="8" fill="#9AA7B8" stroke="#2B2118" stroke-width="5"/></svg>';
      st.S.layout();
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* HOLD a card: it is said - and this question earns no star ("卡不念") */
    hear(st, i) { st.peeked = true; st.noStar = true; Voice.sayNow(st.q.cards[i], { tag: 'peek' }); },
    full(st, order) {
      const q = st.q, bad = order.findIndex((c, s) => c !== q.want[s]);
      st.order = order.slice();
      if (bad < 0) { Session.submit(st, 'ok'); return; }
      st.badSlot = bad; st.tapped = order[bad]; Session.submit(st, 'bad');
    },
    /* right: every slot holds the card of its word (the order made, checked once more) */
    evaluate(st, ans) { const w = st.q.want; return ans === 'ok' && !!st.order && st.order.length === w.length && st.order.every((c, s) => c === w[s]); },
    onGesture(st, name, p) { if (!st.S) return false; return st.S.gesture(name, p); },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      const eyes = st.frame.querySelector('.eyes'); if (eyes) eyes.setAttribute('fill', '#FFE14A');
      st.scope.anim(st.frame, [{ transform: 'translateY(0)' }, { transform: 'translateY(-26px)' }, { transform: 'translateY(0)' }], { duration: 500 });
      st.S.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 18), 70 * i));
      const a = st.G.actors[this.chars[0]]; if (a) a.cheer();
      const b = box(st.frame), car = ZX.thing(st, 120, 82, 30, 'objpop'); car.innerHTML = carSVG('#FFC93C'); place(car, b.x + b.w / 2 - 60, b.y + b.h - 70, 120, 82);
      st.scope.anim(car, [{ transform: 'translateX(0) scale(.2)', opacity: 0 }, { transform: 'translateX(0) scale(1)', opacity: 1, offset: 0.3 }, { transform: 'translateX(' + (Stage.W - b.x) + 'px) scale(1)', opacity: 1 }], { duration: 1400, easing: 'ease-in', fill: 'forwards' });
      Voice.say(q.text, { tag: 'summary' });
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the first card in a wrong place belongs further on (or, level 5's extra card, nowhere) */
    wrongLine(st) { return st.tapped === st.q.extra ? '这个词用不上' : '这个词在后面'; },
    /* explain: 1 the first card out of place in blue (its line was just said); 2 the cards go to their places one by one (a beat);
       3 the robot stands up in gold and the sentence is read */
    async explain(st) {
      const q = st.q, S = st.S;
      const ring = EX.ring(st, S.cards[st.tapped], 'chosen');
      await EX.wait(st, 600);
      if (ring) ring.remove();
      await W4X.exBeat(st, async () => {
        const wrong = S.cards.map((c, i) => i).filter(i => S.where[i] >= 0 && S.where[i] !== q.want.indexOf(i));
        await Promise.all(wrong.map(i => S.back(i, 200)));
        for (let s = 0; s < q.n; s++) if (S.at[s] !== q.want[s]) await S.put(q.want[s], s, 220);
      }, 200);
      const eyes = st.frame.querySelector('.eyes'); if (eyes) eyes.setAttribute('fill', '#FFE14A');
      EX.outline(st, st.frame); K.hop(st, st.frame, 18);                 /* the robot itself in gold (the cards are in it: no ring round them all) */
      await EX.say(st, [q.text]);
      await EX.wait(st, 250);
    },
    /* the 2nd hint (real help, no star after it): the card of the first word that is not in its place yet lights up */
    gestureHint(st, reteach) {
      if (!st.S) return;
      const S = st.S;
      if (reteach) { S.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 14), 90 * i)); return; }
      const s = S.at.findIndex((k, j) => k !== st.q.want[j]); if (s < 0) return;
      const c = S.cards[st.q.want[s]]; c.classList.add('glow'); K.hop(st, c, 18); st.scope.timeout(() => c.classList.remove('glow'), 1600);
    },
    next(st, strat) { return st.S ? st.S.next(st.q.want, strat) : null; },
    workEls(st) { return st.S ? st.S.cards : []; },
    snap(st) { return { opts: st.opts || null, at: st.S ? st.S.at.slice() : null, peeked: !!st.peeked }; },
    iconNode() { const d = el('div'); Object.assign(d.style, { display: 'flex', gap: '3px', alignItems: 'center' }); ['I', 'can', 'run'].forEach(w => { const c = el('div', '', d); Object.assign(c.style, { background: '#FFF6D8', borderRadius: '6px', boxShadow: '0 0 0 2px #2B2118', padding: '2px 3px', lineHeight: '0' }); c.appendChild(Glyph.word(w, 20)); }); return W4X.icon(d); },
  };

  /* ---------------------------------------------------------------- ⑨-4 挑战 「变！」 加一笔，变一变 (one stroke more = another character)
     A changing machine: A at its door, a "+" lamp blinking (which stroke is not shown); five boxes come out, a character in each.
     Which one is A with ONE stroke more? (W4D.add1: the writing modes' families, proved on the stroke data; W4D.near1 holds every
     pair that is - or could be taken for - one stroke apart, and none of them is ever a wrong box: exactly one right box.) Only
     characters the child knows. Levels: 1 the others nothing like A; 2 A itself and A minus a stroke among them; 3 the other way:
     B given, "减一笔" - which is B with a stroke less; 4 characters two or three strokes longer than A among them; 5 two machines,
     two characters, one box each (both right). A random tap is right 1 time in 5 (two: 1 in 20). */
  const SC = k => (STROKE_NAMES[k] || '').split(' ').filter(Boolean).length;
  const near = (a, b) => W4D.near1.includes(a + b);
  const Add = {
    rule: 'add-one-stroke', kind0: 'quiz', verb: '变！', intro: '加一笔，变一变！', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), rev = lv === 3, two = lv >= 5;
      const P = W4D.add1.filter(x => kn.includes(x.a) && kn.includes(x.b));
      const key = x => x.a + x.b, k1 = bagFrom(G, 'ad' + lv, P.map(key)), p1 = P.find(x => key(x) === k1);
      const pairs = [p1];
      if (two) { const ok = P.filter(x => x.a !== p1.a && x.b !== p1.b && x.a !== p1.b && x.b !== p1.a && !near(p1.a, x.b) && !near(x.a, p1.b)); pairs.push(ok.length ? G.rng.pick(ok) : P.find(x => x !== p1) || p1); }
      const shown = pairs.map(x => (rev ? x.b : x.a)), right = pairs.map(x => (rev ? x.a : x.b));
      /* a box may never be another right one: not B' with A + stroke = B' (nor A' with A' + stroke = B the other way) */
      const fine = k => !right.includes(k) && pairs.every(x => (rev ? !near(k, x.b) : !near(x.a, k)));
      const others = [], got = { self: 0, minus: 0, more: 0 };
      const add = (k, tag) => { if (others.length < 5 - right.length && !others.includes(k) && kn.includes(k) && ITEM[k] && fine(k)) { others.push(k); if (tag) got[tag]++; } };
      const like = k => pairs.some(x => [x.a, x.b].some(c => (LOOK[c] || '').includes(k) || (LOOK[k] || '').includes(c)));
      const unlike = k => !like(k) && !pairs.some(x => near(k, x.a) || near(x.a, k) || near(k, x.b) || near(x.b, k)) && right.every(r => Math.abs(SC(k) - SC(r)) >= 2);
      if (lv === 2 || lv >= 4) shown.forEach(a => add(a, 'self'));                                       /* A itself */
      if (lv === 2) shown.forEach(a => G.rng.shuffle(kn.filter(k => near(k, a))).forEach(k => add(k, 'minus')));      /* A minus a stroke */
      if (rev) { shown.forEach(b => add(b, 'self')); shown.forEach(b => G.rng.shuffle(kn.filter(k => near(b, k))).forEach(k => add(k, 'minus'))); }     /* B itself, B plus a stroke */
      if (lv >= 4) shown.forEach(a => G.rng.shuffle(kn.filter(k => [2, 3].includes(SC(k) - SC(a)))).sort((x, y) => (like(y) ? 1 : 0) - (like(x) ? 1 : 0)).slice(0, 2).forEach(k => add(k, 'more')));
      G.rng.shuffle(kn.filter(unlike)).forEach(k => add(k));
      G.rng.shuffle(kn).forEach(k => add(k));
      const opts = W4X.put(G, others.concat(right.slice(1)), right[0]);
      return { k: [pairs.map(key).join(','), opts.join('')], pairs: pairs.map(x => ({ a: x.a, b: x.b, add: x.add })), shown, right, rev: rev ? 1 : 0, two: two ? 1 : 0,
        answer: two ? 'all' : right[0], seq: two ? right.slice() : null, opts, item: right[0], self: got.self, minus: got.minus, more: got.more };
    },
    itemOf(st) { return st.q.right[0]; },
    itemsOf(st) { return st.q.right.slice(1); },
    hard(q) { return q.self * 0.6 + q.minus * 0.6 + q.rev * 1.6 + q.more * 1.4 + q.two * 4; },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.done = [];
      st.mach = q.shown.map((k, j) => {
        const m = ZX.thing(st, 10, 10, 5, 'item'); m.style.pointerEvents = 'none';
        m.innerHTML = '<svg viewBox="0 0 300 260" width="100%" height="100%" preserveAspectRatio="none"><rect x="6" y="40" width="288" height="200" rx="30" fill="#3A6FD0" stroke="#2B2118" stroke-width="7"/><rect x="230" y="96" width="58" height="88" rx="14" fill="#2B4E96" stroke="#2B2118" stroke-width="5"/><path d="M246 140H274M262 128L274 140L262 152" stroke="#FFE14A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="224" r="8" fill="#FFE14A"/><circle cx="266" cy="224" r="8" fill="#FFE14A"/></svg>';
        const plate = m._plate = el('div', '', m); Object.assign(plate.style, { position: 'absolute', left: '7%', top: '24%', width: '66%', height: '64%', background: '#FFFDF6', borderRadius: '18px', boxShadow: '0 0 0 5px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        const g = m._glyph = Glyph.zh(k, 100); g.setAttribute('width', '86%'); g.setAttribute('height', '86%'); plate.appendChild(g);
        const lamp = m._lamp = el('div', '', m); Object.assign(lamp.style, { position: 'absolute', left: '36%', top: '-4%', width: '22%', aspectRatio: '1', borderRadius: '50%', background: '#FFE14A', boxShadow: '0 0 0 5px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 40px system-ui,sans-serif', color: INK });
        lamp.innerHTML = '<svg viewBox="0 0 40 40" width="70%" height="70%"><path d="M8 20H32' + (q.rev ? '' : 'M20 8V32') + '" stroke="#2B2118" stroke-width="7" stroke-linecap="round"/></svg>';
        st.scope.anim(lamp, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 14px #FFD23C) brightness(1.15)' }, { filter: 'none' }], { duration: 1000, iterations: Infinity });
        K.pop(st, m, 120 * j);
        return m;
      });
      K.cards(st, q.opts.map(k => Glyph.zh(k, 96)), q.opts.slice(), Object.assign({ size: 128, gap: 22 }, this.cardSpot()));
      st.cards.forEach(c => { c.style.background = '#F7E3B5'; c.style.borderColor = '#B07A3A'; });
      this.place(st); this.mark(st);
      K.say(st, q.rev ? '减一笔，变成什么？' : '加一笔，变成什么？');
    },
    cardSpot() { return L() ? { cx: 772, cy: 330, cols: 3, gap: 22 } : { cx: 352, cy: 700, cols: 3, gap: 24 }; },
    machRect(st, j) {
      const n = st.mach.length;
      if (L()) return n > 1 ? { x: 150, y: j ? 372 : 116, w: 340, h: 236 } : { x: 120, y: 150, w: 410, h: 330 };
      return n > 1 ? { x: j ? 364 : 20, y: 150, w: 320, h: 260 } : { x: 170, y: 150, w: 364, h: 300 };
    },
    place(st) {
      if (!st.mach) return;
      st.mach.forEach((m, j) => { const r = this.machRect(st, j); place(m, r.x, r.y, r.w, r.h); });
      K.cardsPlace(st, this.cardSpot());
      (st.done || []).forEach(([j, d]) => { const r = this.machRect(st, j); place(d, r.x + r.w - 92, r.y + r.h - 78, 88, 88); });
      if (st.pen) this.penPlace(st);
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* two machines: the one to answer now has a gold edge */
    mark(st) { if (st.mach.length < 2) return; st.mach.forEach((m, j) => { m.style.filter = j === st.ix ? 'drop-shadow(0 0 0 #000) drop-shadow(0 0 10px #FFD23C)' : 'saturate(.7) brightness(.95)'; }); },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0) return false;
      const q = st.q, want = q.right[st.ix];
      if ((st.done || []).some(d => d[2] === i)) return false;
      st.tapped = i; Sfx.tap();
      if (st.opts[i] !== want) { Session.submit(st, st.opts[i]); return 'ok'; }
      if (st.ix + 1 < q.right.length) {                 /* the first machine done: its character comes out at its side */
        const r = this.machRect(st, st.ix), d = ZX.thing(st, 88, 88, 8, 'card'); d.style.pointerEvents = 'none'; d.style.background = '#FFF3C4'; d.appendChild(Glyph.zh(want, 68));
        st.done.push([st.ix, d, i]); place(d, r.x + r.w - 92, r.y + r.h - 78, 88, 88); K.pop(st, d); K.hop(st, st.cards[i], 16); Sfx.place();
        st.ix++; this.mark(st);
        return 'ok';
      }
      Session.submit(st, q.two ? 'all' : want);
      return 'ok';
    },
    /* a Writer without a grid over machine j's plate, writing B (the explanation, the 2nd hint) */
    pen(st, j) {
      if (st.pen && st.pen.j === j) return st.pen.W;
      if (st.pen) st.pen.W.el.remove();
      const pr = st.q.pairs[j], W = new Writer(st, { kind: 'zh', glyph: pr.b, level: 1, x: 0, y: 0, size: 100, bare: true, z: 36 });
      st.pen = { j, W }; this.penPlace(st);
      return W;
    },
    penPlace(st) { const m = st.mach[st.pen.j], b = m._plate.getBoundingClientRect(), a = Stage.toStage(b.left + b.width / 2, b.top + b.height / 2), s = Math.min(b.width, b.height) / (Stage.s || 1) * 0.86; st.pen.W.place(a.x, a.y, s); },
    async brush(st, W, i, color) {
      const sk = W.strokes[i]; if (!sk) return;
      const dur = clamp(sk.L / W.S * 800, 280, 560), bs = W.box.w * 0.26, br = ZX.thing(st, bs, bs, 37, 'objpop');
      ZX.pic('assets/props/brush.png', br);
      const pts = Geo.resample(sk.med, 10).map(q => W.toStage(q)), at = q => ({ left: (q.x - bs * 0.18) + 'px', top: (q.y - bs * 0.92) + 'px' });
      place(br, pts[0].x - bs * 0.18, pts[0].y - bs * 0.92, bs, bs);
      W.ink(i, color, dur); Sfx.nz(0, dur / 1000, 1400, 900, 0.6, 0.05);
      await st.scope.anim(br, pts.map(at), { duration: dur, easing: 'linear', fill: 'forwards' });
      br.remove();
    },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      q.right.forEach(k => K.hop(st, st.cards[st.opts.indexOf(k)], 28));
      st.mach.forEach(m => st.scope.anim(m, [{ transform: 'scale(1)' }, { transform: 'scale(1.06,.94)' }, { transform: 'scale(1)' }], { duration: 360 }));
      const a = st.G.actors[this.chars[0]]; if (a) a.react('hop');
      q.pairs.forEach(x => Voice.say(q.rev ? x.b + '减一笔是' + x.a : x.a + '加一笔是' + x.b, { tag: 'summary' }));
      this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 his box in blue with its picture ("这是田" was just said); 2 on the machine the brush writes the stroke in gold - A
       becomes B (the other way: the stroke goes - B becomes A) - a beat; 3 the right box in gold: "日加一笔是目" / "天减一笔是大" */
    async explain(st, ans) {
      const q = st.q, j = Math.min(st.ix, q.pairs.length - 1), pr = q.pairs[j], k = q.right[j], iR = st.opts.indexOf(k), m = st.mach[j];
      W4X.exChosen(st, st.cards[st.tapped], ans);
      await EX.wait(st, 650);
      if (st.hintEl) st.hintEl.remove();
      const W = this.pen(st, j);
      await W4X.exBeat(st, async () => {
        st.scope.anim(m._glyph, [{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });
        W.strokes.forEach((s, i) => { if (i !== pr.add) W.ink(i, INK, 120); });
        await EX.tick(st, 280);
        if (q.rev) { W.ink(pr.add, EX_GOLD, 120); await EX.tick(st, 500); const p = W.gDone.lastChild; if (p) await st.scope.anim(p, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }); }
        else await this.brush(st, W, pr.add, EX_GOLD);
      }, 300);
      await W4X.exRight(st, st.cards[iR], k, [q.rev ? pr.b + '减一笔是' + pr.a : pr.a + '加一笔是' + pr.b]);
    },
    /* the 2nd hint (real help, no star after it): A takes B's shape and a dashed line shows where the stroke goes (the other way:
       the stroke to take away is dashed) */
    gestureHint(st, reteach) {
      if (!st.mach) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone) return; st.hintDone = true;
      const j = st.ix, pr = st.q.pairs[j], W = this.pen(st, j), m = st.mach[j];
      m._glyph.style.opacity = 0;
      W.strokes.forEach((s, i) => { if (i !== pr.add) W.ink(i, INK, 200); });
      const sk = W.strokes[pr.add]; if (!sk) return;
      st.hintEl = svg('path', { d: W.dOf(sk.med), fill: 'none', stroke: '#E8862B', 'stroke-width': 64, 'stroke-linecap': 'round', 'stroke-dasharray': '60 50', opacity: 0.9 }, W.gCue);
      W.gCue.style.opacity = 1;
    },
    next(st, strat) {
      if (!st.cards || !st.mach) return null;
      const want = st.q.right[st.ix], used = (st.done || []).map(d => d[2]);
      const i = strat === 'wrong' ? st.opts.findIndex((k, x) => k !== want && !used.includes(x)) : st.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() {
      const d = el('div'); Object.assign(d.style, { display: 'flex', alignItems: 'center', gap: '2px' });
      d.appendChild(Glyph.zh('口', 30)); const p = el('div', '', d); p.textContent = '+'; Object.assign(p.style, { font: '900 22px system-ui,sans-serif', color: '#E8414B' }); d.appendChild(Glyph.zh('日', 30));
      return W4X.icon(d);
    },
  };

  /* ---------------------------------------------------------------- ⑨-2 写字 工 厂 (W4X.Write as it is): the finishing shows of
     §12.5 laid over it - 工: the toolbox's wrench turns; 厂: the factory's gear turns */
  const GEAR = '<svg viewBox="0 0 60 60" width="100%" height="100%"><path d="M30 4l5 8 9-3 1 9 9 2-4 8 6 7-8 4 1 9-9-1-4 8-6-7-8 4-3-9-9-2 4-8-5-7 8-4-1-9 9 1 4-8z" fill="#FFC93C" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><circle cx="30" cy="30" r="8" fill="#fff" stroke="#2B2118" stroke-width="3"/></svg>';
  const WRENCH = '<svg viewBox="0 0 60 60" width="100%" height="100%"><path d="M40 6a12 12 0 0 0-11 16L8 43a5 5 0 0 0 7 7l21-21a12 12 0 0 0 16-11l-8 5-6-6 5-8a12 12 0 0 0-3-3z" fill="#BFC6D0" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/></svg>';
  const WX = {
    async reveal(st) {
      await WriteBase.reveal.call(this, st);
      const k = st.q.answer, p = st.alivePic; if (!p || !p.isConnected || (k !== '工' && k !== '厂')) return;
      const b = box(p), s = Math.round(b.w * 0.42), d = ZX.thing(st, s, s, 33, 'objpop'); d.innerHTML = k === '工' ? WRENCH : GEAR;
      place(d, Math.round(b.x + b.w * (k === '工' ? 0.52 : 0.6)), Math.round(b.y + b.h * (k === '工' ? 0.1 : 0.04)), s, s);
      Sfx.zap();
      await st.scope.anim(d, [{ transform: 'rotate(0) scale(.3)', opacity: 0 }, { transform: 'rotate(180deg) scale(1)', opacity: 1, offset: 0.4 }, { transform: 'rotate(' + (k === '工' ? 360 : 540) + 'deg) scale(1)', opacity: 1 }], { duration: 1100, easing: EASE.glide });
    },
  };

  w4Island('robot4', [Track, Build, Add, WX]);
})();
