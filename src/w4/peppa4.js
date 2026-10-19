/* ================================================================ 神笔海 ② 佩奇 · 小医院 (peppa4): 耳 足 头 牙 心 (docs/W4-DESIGN.md §6 ②)
   认字 「摸！」按顺序摸一摸 (two-in-order) · 写字 耳 头 (W4X.Write) · 英文 「找！」谁不是一家 (odd-one-out) ·
   挑战 「笔！」笔顺小老师 (which-stroke-first). The shape of src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  W4X.lines(['每排找一个！']);

  /* ---------------------------------------------------------------- ②-1 认字 「摸！」 按顺序摸一摸 (heard order + reading)
     Peppa the little doctor; five big character cards; a steel tray above them. The characters are said one after another
     ("耳，头"): touch them in that order - each right touch lights its card and its picture flies into the tray (no star for a
     step); the whole order right is the answer; a card out of turn (or another one) ends it. Levels: 1 two of the island's
     characters, the pictures in order on the task card; 2 heard only, said twice; 3 look-alikes (耳/目, 足/走/是, 心/小) and an
     old character among the others; 4 three characters (an old one may be asked), two old ones about; 5 three, said only
     once, three old ones about. A random order is right 1 time in 20 (two) / 60 (three). */
  const TRAY = n => 70 + 118 * n;                  /* the tray's width for n pictures (stage px; 124 high) */
  const trayHTML = n => {
    const w = TRAY(n);
    let s = '<svg viewBox="0 0 ' + w + ' 124" width="100%" height="100%"><path d="M16 30Q16 12 36 12H' + (w - 36) + 'Q' + (w - 16) + ' 12 ' + (w - 16) + ' 30L' + (w - 30) + ' 98Q' + (w - 34) + ' 116 ' + (w - 54) + ' 116H54Q34 116 30 98Z" fill="#D5E1EB" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M40 25H' + (w - 40) + '" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>';
    for (let i = 0; i < n; i++) s += '<circle cx="' + (94 + 118 * i) + '" cy="66" r="42" fill="#EEF4F8" stroke="#8FA3B5" stroke-width="4" stroke-dasharray="10 8"/>';
    return s + '</svg>';
  };
  const lookOf = k => LOOK[k] || '';
  const Touch = {
    rule: 'two-in-order', verb: '摸！', intro: '按顺序摸一摸！', props: [],
    gen(G, o) {
      const lv = o.level, pool = poolOf(G, 'zh', false), n = lv >= 4 ? 3 : 2;
      const first = W4X.pick(G, pool), opts = W4X.opts(G, lv, first, 5), seq = [first];
      /* the rest of the order from the cards: levels 1-3 the island's own, from level 4 an old one too - never a look-alike of
         one asked (that one stays the trap among the others) */
      const like = k => seq.some(s => lookOf(s).includes(k) || lookOf(k).includes(s));
      const add = k => { if (seq.length < n && !seq.includes(k) && !like(k)) seq.push(k); };
      G.rng.shuffle(opts.filter(k => k !== first && (lv >= 4 || pool.includes(k)))).forEach(add);
      G.rng.shuffle(opts.filter(k => k !== first)).forEach(k => { if (seq.length < n && !seq.includes(k)) seq.push(k); });
      return { k: [seq.join(''), opts.join('')], answer: 'all', seq, opts, item: first, n: seq.length, pic: lv <= 1 ? 1 : 0, once: lv >= 5 ? 1 : 0,
        look: opts.filter(k => !seq.includes(k) && seq.some(s => lookOf(s).includes(k) || lookOf(k).includes(s))).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: the pictures gone, look-alikes, old characters, three in the order, said only once */
    hard(q) { return (1 - q.pic) + q.look + q.rev * 0.8 + (q.n - 2) * 2.5 + q.once * 1.5; },
    /* the memory: a wrong order counts against the character that was due when it went wrong */
    itemOf(st) { const s = st.q.seq; return s[st.ok === false ? Math.min(st.ix || 0, s.length - 1) : 0]; },
    itemsOf(st) { return st.q.seq.slice(1); },
    async present(st) {
      const q = st.q;
      for (const k of q.seq) { await ZX.meet(st, k); if (!Session.alive(st)) return; }
      st.ix = 0; st.done = []; st.pics = [];
      st.tray = ZX.thing(st, TRAY(q.n), 124, 5, 'item'); st.tray.innerHTML = trayHTML(q.n);
      K.cards(st, q.opts.map(k => Glyph.zh(k, 104)), q.opts.slice(), Object.assign({ size: 150, gap: 24 }, this.cardSpot()));
      this.place(st);
      K.pop(st, st.tray);
      st.taskEl = K.task(st, q.pic ? q.seq.map(k => [OBJURL(ITEM[k].obj)]) : [['speaker']]);
      st.lead = q.seq.slice(0, -1); st.prompt = q.seq[q.seq.length - 1];      /* the hints and the avatar say the whole order again */
      this.sayOrder(st);
    },
    /* the order, one recorded character after another (no combined sentence); twice, level 5 once. Not awaited: the cards can be
       touched while it is said (a touch hushes it) */
    async sayOrder(st) {
      try {
        const q = st.q;
        for (let t = 0; t < (q.once ? 1 : 2); t++) {
          if (t) { await st.scope.guard(Voice.afterSay(450)); if (!Session.alive(st) || st.ix || st.submitted) return; }
          q.seq.forEach(k => Voice.say(k, { tag: 'prompt' }));
        }
      } catch (e) { /* a prompt never ends a question */ }
    },
    cardSpot() { return L() ? { cx: 572, cy: 455 } : { cx: 352, cy: 770, cols: 3 }; },
    trayAt(st) { const w = TRAY(st.q.n); return { x: (L() ? 572 : 352) - w / 2, y: L() ? 118 : 250, w, h: 124 }; },
    slotAt(st, j) { const t = this.trayAt(st); return { x: t.x + 94 + 118 * j - 44, y: t.y + 66 - 44, w: 88, h: 88 }; },
    place(st) {
      if (!st.tray) return;
      const t = this.trayAt(st); place(st.tray, t.x, t.y, t.w, t.h);
      K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot()));
      st.pics.forEach((p, j) => { if (p && p._in) { const s = this.slotAt(st, j); place(p, s.x, s.y, s.w, s.h); } });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* the place in the order on a touched card: a little numbered badge on its corner */
    badge(st, i, j) {
      const c = st.cards[i]; if (!c) return;
      (c._badge || { remove() {} }).remove();
      const b = c._badge = el('div', '', c); b.textContent = String(j + 1);
      Object.assign(b.style, { position: 'absolute', left: '-14px', top: '-14px', width: '40px', height: '40px', borderRadius: '50%', background: '#FF8DB3', color: '#fff', font: '900 26px system-ui,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 3px #2B2118', pointerEvents: 'none' });
      K.pop(st, b);
    },
    /* a card's picture flies from it into the next place of the tray */
    toTray(st, i, j) {
      const c = box(st.cards[i]), s = this.slotAt(st, j), f = ZX.thing(st, s.w, s.h, 41, 'objpop');
      ZX.pic(OBJURL(ITEM[st.opts[i]].obj), f); place(f, c.x + c.w / 2 - s.w / 2, c.y + c.h / 2 - s.h / 2, s.w, s.h);
      if (st.pics[j]) st.pics[j].remove();
      st.pics[j] = f;
      return K.flyTo(st, f, s.x, s.y, 420, 70, 1).then(() => { f._in = true; });
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || st.done.includes(i)) return false;      /* a card touched already: nothing */
      const q = st.q, k = st.opts[i];
      st.tapped = i; Sfx.tap();
      if (k !== q.seq[st.ix]) { Session.submit(st, k); return 'ok'; }
      st.done.push(i); st.ix++; st.cards[i].classList.add('hi'); K.hop(st, st.cards[i], 20); Sfx.place();
      this.badge(st, i, st.ix - 1); this.toTray(st, i, st.ix - 1);
      if (st.ix >= q.seq.length) Session.submit(st, 'all');
      return 'ok';
    },
    async reveal(st) {
      const a = st.G.actors[this.chars[0]]; if (a) a.react('hop');
      Sfx.reveal(); K.hop(st, st.tray, 16);
      st.pics.forEach((p, j) => st.scope.timeout(() => K.hop(st, p, 28), 150 * j));
      st.q.seq.forEach(k => Voice.say(k, { tag: 'summary' }));
      this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 the card touched out of turn in blue with its picture ("这是目" was just said); 2 Peppa touches them in order, one
       by one: each card in gold, its picture into the tray, the character said */
    async explain(st, ans) {
      const q = st.q, a = st.G.actors[this.chars[0]];
      W4X.exChosen(st, st.cards[st.tapped], ans);
      await EX.wait(st, 800);
      st.pics.forEach(p => p && p.remove()); st.pics = []; st.cards.forEach(c => { c.classList.remove('hi'); if (c._badge) { c._badge.remove(); c._badge = null; } });
      for (let j = 0; j < q.seq.length; j++) {
        const i = st.opts.indexOf(q.seq[j]);
        if (a) a.react('hop');
        EX.ring(st, st.cards[i], 'right'); K.hop(st, st.cards[i], 20);
        this.badge(st, i, j); this.toTray(st, i, j);
        await EX.say(st, [q.seq[j]]);
        await EX.wait(st, 250);
      }
    },
    /* the 2nd hint (real help, no star after it): the card to touch next hops a little */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 18), 110 * i)); return; }
      const i = st.opts.indexOf(st.q.seq[st.ix || 0]); if (i < 0) return;
      K.hop(st, st.cards[i], 16); st.scope.timeout(() => K.hop(st, st.cards[i], 10), 420);
    },
    next(st, strat) {
      if (!st.cards || !st.done) return null;
      const want = st.q.seq[st.ix || 0], i = strat === 'wrong' ? st.opts.findIndex((k, j) => k !== want && !st.done.includes(j)) : st.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).filter((c, i) => !(st.done || []).includes(i)); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() {
      return W4X.svgIcon('<rect x="4" y="12" width="22" height="28" rx="6" fill="#fff" stroke="#2B2118" stroke-width="3"/><text x="15" y="33" text-anchor="middle" font-size="18" font-weight="900" fill="#E8414B" font-family="system-ui,sans-serif">1</text>'
        + '<path d="M28 26H33M31 22L35 26L31 30" fill="none" stroke="#2B2118" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
        + '<rect x="36" y="12" width="22" height="28" rx="6" fill="#fff" stroke="#2B2118" stroke-width="3"/><text x="47" y="33" text-anchor="middle" font-size="18" font-weight="900" fill="#2E6FD8" font-family="system-ui,sans-serif">2</text>'
        + '<path d="M10 50Q30 58 52 50" fill="none" stroke="#FF8DB3" stroke-width="4" stroke-linecap="round"/>');
    },
  };

  /* ---------------------------------------------------------------- ②-3 英文 「找！」 谁不是一家 (the written word family)
     Five word cards, four of one family (the same tail: bug rug mug jug) and one that is not (hen); the words are read, not
     said. Tap the one that is not of the family. Levels: 1 a picture on every card, the odd one differs in vowel and end; 2 no
     pictures; 3 the odd one has the family's vowel, another end (bun); 4 the family's last letter, another vowel (bag); 5 two
     rows, one odd one in each (one of each kind) - both found. George reads them for whoever taps his speaker: that question
     earns no star. A random tap is right 1 time in 5 (two rows: 1 in 25). */
  const EASYW = 'big dig hop pop men ten fun run hit sit bit fit hot pot dot not wet pet sad dad bad mad bag tag rag wag lip hip tip zip red fed hug tug pin win tin bin fog hog jog cut hut nut';
  let FAMS = null;
  const fams = () => {
    if (FAMS) return FAMS;
    const pic = {};
    W4D.words.concat(WORDS3).forEach(([w, o]) => { if (/^[a-z]{3}$/.test(w) && !pic[w] && W4X.hasPic(o)) pic[w] = o; });
    const all = Array.from(new Set(Object.keys(pic).concat(EASYW.split(' ')))).filter(w => /^[a-z]{3}$/.test(w) && W4D.dict.includes(w));
    const by = {}; all.forEach(w => (by[w.slice(1)] = by[w.slice(1)] || []).push(w));
    return (FAMS = { pic, all, by });
  };
  /* the odd one's kind: both letters of the tail differ / only the end (same vowel) / only the vowel (same end) */
  const oddOk = { both: (w, r) => w[1] !== r[0] && w[2] !== r[1], vowel: (w, r) => w[1] === r[0] && w[2] !== r[1], end: (w, r) => w[1] !== r[0] && w[2] === r[1] };
  const GOLDT = '#E39B00';
  const OddOne = {
    rule: 'odd-one-out', kind0: 'en', verb: '找！', intro: '谁不是一家？', props: [],
    row(G, F, kind, pic, used) {
      const words = (pic ? F.all.filter(w => F.pic[w]) : F.all).filter(w => !used.has(w));
      const odds = r => words.filter(w => w.slice(1) !== r && oddOk[kind](w, r));
      const ok = Object.keys(F.by).filter(r => F.by[r].filter(w => words.includes(w)).length >= 4 && odds(r).length && !used.has('-' + r));
      const r = bagFrom(G, 'fam' + kind + (pic ? 'p' : ''), ok), fam = G.rng.shuffle(F.by[r].filter(w => words.includes(w))).slice(0, 4), odd = G.rng.pick(odds(r));
      fam.concat([odd, '-' + r]).forEach(w => used.add(w));
      return { rime: r, fam, odd, kind, opts: W4X.put(G, fam, odd) };
    },
    gen(G, o) {
      const lv = o.level, F = fams(), used = new Set(), pic = lv <= 1;
      const kinds = lv >= 5 ? G.rng.shuffle(['vowel', 'end']) : [lv <= 2 ? 'both' : lv === 3 ? 'vowel' : 'end'];
      const rows = kinds.map(kind => this.row(G, F, kind, pic, used)), two = rows.length > 1;
      return { k: rows.map(r => r.opts.join(',')), rows, opts: [].concat(...rows.map(r => r.opts)), answer: two ? 'all' : rows[0].odd, seq: two ? rows.map(r => r.odd) : null,
        pic: pic ? 1 : 0, two: two ? 1 : 0, vow: rows.filter(r => r.kind === 'vowel').length, end: rows.filter(r => r.kind === 'end').length };
    },
    itemOf() { return null; },
    hard(q) { return (1 - q.pic) + q.vow * 1.5 + q.end * 2 + q.two * 3; },
    build(G) { ZBase.build.call(this, G); if (!G.actors.george) K.actor(G, 'george', 170); },
    decor(G) { this.chars.forEach(id => hideActor(G.actors[id])); const g = G.actors.george; if (g) showActor(g, L() ? 84 : 84, L() ? 698 : 1016, L() ? 170 : 140); },
    wordNode(st, w, cols) { const h = st.q.pic ? 44 : st.q.two ? 50 : 60; return cols ? Glyph.wordC(w, h, cols) : Glyph.word(w, h); },
    async present(st) {
      const q = st.q, F = fams();
      st.found = q.rows.map(() => false); st.row = 0;
      if (q.two) st.panels = q.rows.map(() => { const d = ZX.thing(st, 10, 10, 3, 'item'); Object.assign(d.style, { background: 'rgba(255,253,244,.55)', borderRadius: '30px', boxShadow: '0 0 0 4px rgba(43,33,24,.18)' }); return d; });
      const nodes = q.opts.map(w => {
        const d = el('div', ''); Object.assign(d.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', pointerEvents: 'none' });
        if (q.pic) d.appendChild(W4X.pic(F.pic[w], 80));
        const g = el('div', '', d); g.style.lineHeight = '0'; g.appendChild(this.wordNode(st, w)); d._g = g;
        return d;
      });
      K.cards(st, nodes, q.opts.slice(), Object.assign({ size: q.two ? 124 : 150 }, this.cardSpot(st)));
      /* George's speaker: a tap reads the words to the child (then this question earns no star) */
      const r = st.readEl = el('div', 'card', Stage.el); r.style.position = 'absolute'; st.els.push(r);
      r.innerHTML = ICONS.speaker; Object.assign(r.firstChild.style, { width: '62%', height: '62%' }); r.style.background = '#FFF6D8';
      const tl = el('div', '', r); tl.innerHTML = '<svg viewBox="0 0 30 24" width="30" height="24"><path d="M2 0L28 0L10 22Z" fill="#FFF6D8" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><path d="M3 0H27" stroke="#FFF6D8" stroke-width="5"/></svg>';
      Object.assign(tl.style, { position: 'absolute', left: '34px', bottom: '-22px', width: '30px', height: '24px', pointerEvents: 'none' });      /* George's speech bubble */
      K.reg(st, 'read', r, {});
      this.place(st);
      K.pop(st, r, 200);
      K.say(st, '谁不是一家？');
      if (q.two) Voice.say('每排找一个！', { tag: 'prompt' });
    },
    cardSpot(st) {
      const two = st && st.q && st.q.two;
      if (two) return L() ? { cx: 590, cy: 380, cols: 5, gap: 18, rowGap: 70 } : { cx: 352, cy: 560, cols: 5, gap: 12, rowGap: 70 };
      return L() ? { cx: 588, cy: 420, gap: 22 } : { cx: 352, cy: 620, cols: 3, gap: 26 };
    },
    place(st) {
      if (!st.readEl) return;
      K.cardsPlace(st, this.cardSpot(st));
      place(st.readEl, L() ? 34 : 34, L() ? 400 : 770, 100, 100);
      (st.panels || []).forEach((d, r) => {
        const a = box(st.cards[r * 5]), b = box(st.cards[r * 5 + 4]);
        place(d, a.x - 14, a.y - 14, b.x + b.w - a.x + 28, a.h + 28);
      });
    },
    /* the word on card i again, its tail (letters 2 and 3) in a colour - or plain */
    tail(st, i, color) {
      const c = st.cards[i], g = c && c.firstChild && c.firstChild._g; if (!g) return;
      const w = st.opts[i]; g.innerHTML = ''; g.appendChild(this.wordNode(st, w, color ? [INK, color, color] : null));
    },
    /* a tap on George's speaker: the words one after another (never more than the voice queue holds) - no star now */
    async readOut(st) {
      st.peeked = true; st.noStar = true;
      const my = (st.readN = (st.readN || 0) + 1);
      K.hop(st, st.readEl, 12);
      const g = st.G.actors.george; if (g) g.react('hop');
      try {
        for (let i = 0; i < st.opts.length; i++) {
          if (!Session.alive(st) || st.readN !== my || st.submitted) return;
          K.hop(st, st.cards[i], 14);
          (i ? Voice.say : Voice.sayNow).call(Voice, st.opts[i], { tag: 'peek' });
          await st.scope.guard(Voice.afterSay(120));
        }
      } catch (e) { /* reading out never ends a question */ }
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      if (p.id === 'read') { this.readOut(st); return 'ok'; }
      const i = K.cardIndex(p.id); if (i < 0) return false;
      const q = st.q, r = Math.floor(i / 5); if (st.found[r]) return false;
      const w = st.opts[i];
      st.tapped = i; st.row = r; Sfx.tap();
      if (w !== q.rows[r].odd) { Session.submit(st, w); return 'ok'; }
      st.found[r] = true; st.cards[i].classList.add('hi'); K.hop(st, st.cards[i], 20);
      if (st.found.every(Boolean)) Session.submit(st, q.two ? 'all' : w); else { Sfx.place(); const g = st.G.actors.george; if (g) g.hop(); }
      return 'ok';
    },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      q.rows.forEach(row => { K.hop(st, st.cards[st.opts.indexOf(row.odd)], 30); row.fam.forEach(w => this.tail(st, st.opts.indexOf(w), GOLDT)); });
      const g = st.G.actors.george; if (g) g.cheer();
      q.rows.forEach(row => Voice.say(row.odd + '!', { tag: 'summary' }));
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the word he tapped, said */
    wrongLine(st, ans) { return ans; },
    /* explain: 1 his card in blue, said - its tail and a neighbour's in gold, the same ("rug, bug"); 2 the whole family's tails in
       gold (a beat); 3 the odd one in a gold ring, said ("hen") */
    async explain(st, ans) {
      const q = st.q, row = q.rows[st.row || 0], iC = st.tapped;
      const fi = row.fam.map(w => st.opts.indexOf(w)).filter(i => i !== iC), iM = fi.slice().sort((a, b) => Math.abs(a - iC) - Math.abs(b - iC))[0];
      EX.ring(st, st.cards[iC], 'chosen');
      this.tail(st, iC, GOLDT); if (iM != null) this.tail(st, iM, GOLDT);
      await EX.say(st, [ans, st.opts[iM]]);
      await EX.wait(st, 250);
      await W4X.exBeat(st, () => { fi.forEach((i, j) => { this.tail(st, i, GOLDT); st.scope.timeout(() => K.hop(st, st.cards[i], 14), 90 * j); }); }, 650);
      await W4X.exRight(st, st.cards[st.opts.indexOf(row.odd)], row.odd, [row.odd], false);
    },
    /* the 2nd hint (real help, no star after it): the tails of the family light up together for a moment */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 80 * i)); return; }
      const lit = []; st.q.rows.forEach((row, r) => { if (!st.found[r]) row.fam.forEach(w => lit.push(st.opts.indexOf(w))); });
      lit.forEach(i => this.tail(st, i, GOLDT));
      st.scope.timeout(() => { if (!st.submitted) lit.forEach(i => this.tail(st, i, null)); }, 1700);
    },
    next(st, strat) {
      if (!st.cards || !st.found) return null;
      const r = st.found.indexOf(false); if (r < 0) return null;
      const row = st.q.rows[r], i = strat === 'wrong' ? st.opts.indexOf(row.fam[0]) : st.opts.indexOf(row.odd);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).filter((c, i) => st.found && !st.found[Math.floor(i / 5)]); },
    snap(st) { return { opts: st.opts || null, found: (st.found || []).filter(Boolean).length, peeked: !!st.peeked }; },
    iconNode() {
      const d = el('div'); Object.assign(d.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '0' });
      d.appendChild(Glyph.wordC('rug', 26, [INK, GOLDT, GOLDT])); d.appendChild(Glyph.wordC('hen', 26, ['#9A8F80', '#9A8F80', '#9A8F80']));
      return W4X.icon(d);
    },
  };

  /* ---------------------------------------------------------------- ②-4 挑战 「笔！」 笔顺小老师 (which of two strokes first)
     Two 田字格 (landscape side by side, portrait one above the other), a character the child knows in each, grey, with two of its
     strokes in orange and blue. Under each, two buttons: the orange stroke and the blue one, each in its place. For each
     character tap the stroke written FIRST. Two answers only - so it asks two at once (both right: 1 time in 4 by chance). The
     pairs and their rules are listed by hand (tools/content.py ORDER_PAIRS, GF 0023-2020; the program never guesses a rule).
     Levels: 1 先横后竖 / 从上到下, the two strokes next to each other; 2 + 先撇后捺 / 从左到右; 3 + 先中间后两边 / 先外后内;
     4 + 先进去后关门 and strokes apart (the ones between grey); 5 two strokes of one kind (川's two 竖, 雪's dots): only where they
     are tells. 2nd hint (real help): the brush writes up to the first of the two and waits on it. */
  const ORANGE = '#F28C1E', BLUE = '#2F7FE0', GREYS = '#C6BDAF', FAINT = '#ECE5D8';
  const Strokes = {
    rule: 'which-stroke-first', kind0: 'quiz', verb: '笔！', intro: '先写哪一笔？', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), P = W4D.orderPairs.filter(p => kn.includes(p[0])), top = P.filter(p => p[4] === lv), upto = P.filter(p => p[4] <= lv);
      const A = bagFrom(G, 'pr' + lv, top.length ? top : upto);
      const rest = (lv >= 5 && top.length > 1 ? top : upto).filter(p => p[0] !== A[0]), other = rest.filter(p => p[3] !== A[3]);
      const B = G.rng.pick(other.length ? other : rest.length ? rest : P.filter(p => p[0] !== A[0]));
      const two = G.rng.shuffle([A, B]);
      const pairs = two.map(p => { const fl = PICK(G, 'fl', [0, 1]); return { c: p[0], f: p[1], o: p[2], r: W4D.orderRules.indexOf(p[3]), lv: p[4], col: fl ? [p[2], p[1]] : [p[1], p[2]] }; });
      return { k: pairs.map(p => p.c + p.f + '-' + p.o + ':' + p.col[0]), pairs, answer: 'all', seq: pairs.map(p => p.f), opts: null, asks: pairs.map(p => ({ opts: p.col.slice(), answer: p.f })),
        far: pairs.filter(p => p.o - p.f > 1).length, lvs: pairs.reduce((s, p) => s + p.lv, 0) };
    },
    itemOf() { return null; },
    hard(q) { return q.lvs + q.far * 0.5; },
    async present(st) {
      const q = st.q;
      st.got = q.pairs.map(() => false); st.ask = 0;
      st.grids = q.pairs.map(p => this.grid(st, p));
      const nodes = [], vals = [];
      q.pairs.forEach((p, j) => p.col.forEach((s, c) => { nodes.push(this.strokeNode(p.c, s - 1, c ? BLUE : ORANGE)); vals.push(j + ':' + s); }));
      K.cards(st, nodes, vals, { size: 120 });
      st.cards.forEach((c, i) => { c.style.borderColor = i & 1 ? BLUE : ORANGE; });
      this.place(st);
      st.grids.forEach((g, j) => K.pop(st, g, 120 * j));
      K.say(st, '先写哪一笔？');
    },
    /* a 田字格 with the character in grey, the two strokes in orange and blue */
    grid(st, p) {
      const d = ZX.thing(st, 240, 240, 6, 'item');
      Object.assign(d.style, { background: '#FFFDF6', borderRadius: '10px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.2)' });
      const s = svg('svg', { viewBox: '0 0 1024 1024', width: '100%', height: '100%' }, d);
      svg('rect', { x: 10, y: 10, width: 1004, height: 1004, fill: 'none', stroke: '#E8414B', 'stroke-width': 14 }, s);
      ['M512 20V1004', 'M20 512H1004', 'M20 20L1004 1004', 'M1004 20L20 1004'].forEach((dd, i) => svg('path', { d: dd, stroke: '#E8414B', 'stroke-width': i < 2 ? 6 : 4, 'stroke-dasharray': i < 2 ? '28 20' : '14 24', opacity: i < 2 ? 0.55 : 0.3, fill: 'none' }, s));
      const g = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s), data = Hanzi.data && Hanzi.data[p.c];
      d._paths = data ? data.s.map((o, i) => svg('path', { d: o, fill: i === p.col[0] - 1 ? ORANGE : i === p.col[1] - 1 ? BLUE : GREYS }, g)) : [];
      return d;
    },
    /* a button: the character's other strokes faint, this one in its colour, where it is in the character */
    strokeNode(ch, i, color) {
      const s = svg('svg', { viewBox: '0 0 1024 1024', width: '88%', height: '88%' }), g = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s), data = Hanzi.data && Hanzi.data[ch];
      if (data) data.s.forEach((o, k) => svg('path', { d: o, fill: k === i ? color : FAINT }, g));
      s.style.pointerEvents = 'none';
      return s;
    },
    spot(j) {
      if (L()) { const cx = j ? 742 : 330; return { g: [cx - 125, 112, 250], b: [[cx - 130, 404], [cx + 10, 404]], bs: 120 }; }
      const y = j ? 548 : 168; return { g: [86, y, 250], b: [[392, y + 65], [536, y + 65]], bs: 120 };
    },
    place(st) {
      if (!st.grids) return;
      st.q.pairs.forEach((p, j) => {
        const S = this.spot(j); place(st.grids[j], S.g[0], S.g[1], S.g[2], S.g[2]);
        [0, 1].forEach(c => { const e = st.cards[2 * j + c]; if (e) place(e, S.b[c][0], S.b[c][1], S.bs, S.bs); });
      });
      if (st.writer) { const b = box(st.grids[st.writer.j]); st.writer.W.place(b.x + b.w / 2, b.y + b.h / 2, b.w); }
    },
    cardSpot() { return {}; },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || i > 3) return false;
      const j = i >> 1, pr = st.q.pairs[j]; if (st.got[j]) return false;
      st.tapped = i; st.ask = j; Sfx.tap();
      if (pr.col[i & 1] !== pr.f) { Session.submit(st, 'later'); return 'ok'; }
      st.got[j] = true; st.cards[i].classList.add('hi'); st.cards[i ^ 1].classList.add('dim'); K.hop(st, st.cards[i], 18); Sfx.place();
      const path = st.grids[j]._paths[pr.f - 1]; if (path) st.scope.anim(path, [{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], { duration: 500 });
      if (st.got.every(Boolean)) Session.submit(st, 'all');
      return 'ok';
    },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      q.pairs.forEach((pr, j) => K.hop(st, st.grids[j], 22));
      const a = st.G.actors[this.chars[0]]; if (a) a.react('hop');
      Array.from(new Set(q.pairs.map(p => p.r))).forEach(r => Voice.say(W4D.orderRules[r], { tag: 'summary' }));
      this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    wrongLine() { return '这一笔后写'; },
    /* a Writer without a grid over a 田字格 (the brush of the explanation and of the 2nd hint) */
    pen(st, j) {
      if (st.writer && st.writer.j === j) return st.writer.W;
      const b = box(st.grids[j]), W = new Writer(st, { kind: 'zh', glyph: st.q.pairs[j].c, level: 1, x: b.x + b.w / 2, y: b.y + b.h / 2, size: b.w, bare: true, z: 36 });
      st.writer = { j, W };
      return W;
    },
    /* explain: 1 the stroke he chose in blue ("这一笔后写" was just said); 2 the brush writes the character to the later of the two,
       stopping at each, the right button in gold: "先写这一笔"; 3 the rule ("先横后竖") */
    async explain(st) {
      const q = st.q, j = st.ask || 0, pr = q.pairs[j], iR = 2 * j + pr.col.indexOf(pr.f);
      W4X.exChosen(st, st.cards[st.tapped], null);
      await EX.wait(st, 450);
      if (st.writer && st.writer.W.el) { st.writer.W.el.remove(); st.writer = null; }
      if (st.hintBrush) st.hintBrush.remove();
      const W = this.pen(st, j), last = Math.max(pr.f, pr.o);
      (st.grids[j]._paths || []).forEach(p => p.setAttribute('opacity', 0.3));
      await W4X.exBeat(st, async () => {
        for (let i = 0; i < last; i++) {
          if (i === pr.f - 1 || i === pr.o - 1) { await this.brush(st, W, i, i === pr.col[0] - 1 ? ORANGE : BLUE); await EX.tick(st, 160); }
          else { W.ink(i, INK, 80); await EX.tick(st, 90); }
        }
      }, 100);
      EX.ring(st, st.cards[iR], 'right'); K.hop(st, st.cards[iR], 18);
      await EX.say(st, ['先写这一笔', W4D.orderRules[pr.r]]);
      await EX.wait(st, 250);
    },
    /* the brush writes one stroke (its ink sweeps along the stroke's centre line, the brush tip with it) */
    async brush(st, W, i, color) {
      const sk = W.strokes[i]; if (!sk) return;
      const dur = clamp(sk.L / W.S * 800, 260, 520), bs = W.box.w * 0.24, br = ZX.thing(st, bs, bs, 37, 'objpop');
      ZX.pic('assets/props/brush.png', br);
      const pts = Geo.resample(sk.med, 10).map(q => W.toStage(q)), at = q => ({ left: (q.x - bs * 0.18) + 'px', top: (q.y - bs * 0.92) + 'px' });
      place(br, pts[0].x - bs * 0.18, pts[0].y - bs * 0.92, bs, bs);
      W.ink(i, color, dur); Sfx.nz(0, dur / 1000, 1400, 900, 0.6, 0.05);
      await st.scope.anim(br, pts.map(at), { duration: dur, easing: 'linear', fill: 'forwards' });
      br.remove();
    },
    /* the 2nd hint (real help, no star after it): on the first character not done, the brush writes the strokes before the two
       and rests at the start of the one written first */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 100 * i)); return; }
      if (st.hintDone) return; st.hintDone = true;
      const j = st.got.indexOf(false); if (j < 0) return;
      const pr = st.q.pairs[j], W = this.pen(st, j);
      for (let i = 0; i < pr.f - 1; i++) W.ink(i, INK, 220);
      const sk = W.strokes[pr.f - 1]; if (!sk) return;
      const p0 = W.toStage(sk.med[0]), bs = W.box.w * 0.24, br = ZX.thing(st, bs, bs, 37, 'objpop'); ZX.pic('assets/props/brush.png', br);
      place(br, p0.x - bs * 0.18, p0.y - bs * 0.92, bs, bs); st.hintBrush = br;
      st.scope.anim(br, [{ transform: 'translateY(-24px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 400 });
    },
    next(st, strat) {
      if (!st.cards || !st.got) return null;
      const j = st.got.indexOf(false); if (j < 0) return null;
      const pr = st.q.pairs[j], c = pr.col.indexOf(pr.f);
      return { g: 'tap', p: { id: 'card' + (2 * j + (strat === 'wrong' ? 1 - c : c)) } };
    },
    workEls(st) { return (st.cards || []).filter((c, i) => st.got && !st.got[i >> 1]); },
    snap(st) { return { opts: st.opts || null, got: (st.got || []).filter(Boolean).length }; },
    iconNode() {
      return W4X.svgIcon('<rect x="6" y="6" width="48" height="48" rx="4" fill="#FFFDF6" stroke="#E8414B" stroke-width="3"/><path d="M30 8V52M8 30H52" stroke="#E8414B" stroke-width="1.5" stroke-dasharray="4 3" opacity=".6"/>'
        + '<path d="M14 28H46" stroke="' + ORANGE + '" stroke-width="7" stroke-linecap="round"/><path d="M30 14V48" stroke="' + BLUE + '" stroke-width="7" stroke-linecap="round"/>');
    },
  };

  w4Island('peppa4', [Touch, OddOne, Strokes]);
})();
