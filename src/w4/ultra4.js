/* ================================================================ 神笔海 ① 奥特曼 · 天地岛 (ultra4): 天 地 金 土 川 (docs/W4-DESIGN.md §6 ①)
   认字 「打！」地鼠钻出来 (one-at-a-time) · 写字 天 土 (W4X.Write) · 英文 「变！」变身换字母 (change-one-letter) ·
   挑战 「古！」古字变今字 (ancient-to-modern). THE TEMPLATE of the island files: see src/w4/README.md. */
(() => {
  const L = () => K.L();

  /* ---------------------------------------------------------------- ①-1 认字 「打！」 地鼠钻出来 (go / no-go)
     Five holes; one mole at a time (L4 two, L5 three) comes up holding a sign and goes down again. Tap the one holding X while it
     is up; an empty hole does nothing; a mole with another character is this question's answer (wrong). Not tapping: the moles
     keep coming, X once a round (a bag; levels 1-2: in the first three of a round). Levels: 1 the picture on the task card, up
     3 s, the island's characters; 2 heard only, 2.6 s; 3 look-alikes + one old character, 2.4 s; 4 two moles at a time, two old
     characters; 5 three at a time, three old, 2 s. A random tap is right 1 time in 5. */
  const MOLE_SVG = '<svg viewBox="0 0 120 110" width="100%" height="100%"><ellipse cx="60" cy="74" rx="40" ry="34" fill="#8B5E3C" stroke="#2B2118" stroke-width="5"/><ellipse cx="60" cy="84" rx="24" ry="20" fill="#C99A6B"/>'
    + '<circle cx="46" cy="62" r="6" fill="#2B2118"/><circle cx="74" cy="62" r="6" fill="#2B2118"/><circle cx="48" cy="60" r="2" fill="#fff"/><circle cx="76" cy="60" r="2" fill="#fff"/>'
    + '<ellipse cx="60" cy="74" rx="9" ry="7" fill="#FF8DB3" stroke="#2B2118" stroke-width="3"/><path d="M22 52C14 44 18 34 26 38M98 52C106 44 102 34 94 38" fill="#C99A6B" stroke="#2B2118" stroke-width="4" stroke-linecap="round"/></svg>';
  const HOLES = () => (L() ? [[230, 600], [400, 600], [570, 600], [740, 600], [910, 600]] : [[150, 610], [352, 610], [554, 610], [251, 880], [453, 880]]);
  const MW = 150, MH = 196;
  const Moles = {
    rule: 'one-at-a-time', kind0: 'find', verb: '打！', intro: '地鼠钻出来！', props: ['mole'],
    gen(G, o) {
      const lv = o.level, pool = poolOf(G, 'zh', false), answer = W4X.pick(G, pool), opts = W4X.opts(G, lv, answer, 5), lk = LOOK[answer] || '';
      return { k: [answer, opts.join('')], answer, opts, pic: lv <= 1 ? 1 : 0, many: [1, 1, 1, 1, 2, 3][lv], show: [3000, 3000, 2600, 2400, 2400, 2000][lv], early: lv <= 2 ? 1 : 0,
        look: opts.filter(k => k !== answer && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: what makes a level harder - the picture gone, less time, look-alikes, old characters, more at once */
    hard(q) { return (1 - q.pic) + (3000 - q.show) / 200 + q.look + q.rev * 1.5 + (q.many - 1) * 2; },
    async present(st) {
      const q = st.q, lv = st.level;
      /* a review question in this frame (kind0 'find') comes as { k, answer, opts } only: the level's own settings then */
      if (q.many == null) Object.assign(q, { pic: lv <= 1 ? 1 : 0, many: [1, 1, 1, 1, 2, 3][lv] || 1, show: [3000, 3000, 2600, 2400, 2400, 2000][lv] || 2600, early: lv <= 2 ? 1 : 0 });
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      st.opts = q.opts.slice(); st.up = st.opts.map(() => false); st.at = st.opts.map(() => -1);
      /* the holes: the dark back, a box the mole rises in (it clips it below the rim), the front of the rim on top */
      st.holes = HOLES().map(() => {
        const back = ZX.thing(st, 176, 64, 4, 'item'); back.innerHTML = '<svg viewBox="0 0 176 64" width="100%" height="100%"><ellipse cx="88" cy="32" rx="84" ry="28" fill="#A0703F" stroke="#2B2118" stroke-width="5"/><ellipse cx="88" cy="32" rx="66" ry="18" fill="#3A2614"/></svg>'; back.style.pointerEvents = 'none';
        const box = ZX.thing(st, MW, MH, 5, 'item'); Object.assign(box.style, { overflow: 'hidden', pointerEvents: 'none' });
        const lip = ZX.thing(st, 176, 40, 7, 'item'); lip.innerHTML = '<svg viewBox="0 0 176 40" width="100%" height="100%"><path d="M4 4C10 30 166 30 172 4C172 22 140 38 88 38C36 38 4 22 4 4Z" fill="#A0703F" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/></svg>'; lip.style.pointerEvents = 'none';
        return { back, box, lip };
      });
      st.cards = st.opts.map((k, i) => {
        const d = el('div', 'item'); Object.assign(d.style, { position: 'absolute', left: '0px', top: '0px', width: MW + 'px', height: MH + 'px', visibility: 'hidden', pointerEvents: 'auto' });
        const m = el('div', '', d); Object.assign(m.style, { position: 'absolute', left: '8px', bottom: '-6px', width: (MW - 16) + 'px', height: '122px', pointerEvents: 'none' });
        const im = img('assets/props/mole.png', '', m); Object.assign(im.style, { width: '100%', height: '100%', objectFit: 'contain' }); im.onerror = () => { m.innerHTML = MOLE_SVG; };
        const s = ZX.sign(k, 96); Object.assign(s.style, { left: 'calc(50% - 48px)', top: '2px', background: '#FFF8EC' }); d.appendChild(s);
        K.reg(st, 'card' + i, d, {});
        return d;
      });
      this.place(st);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
      K.say(st, '打' + q.answer + '！');
      this.cycle(st);
    },
    place(st) {
      if (!st.holes) return;
      HOLES().forEach(([x, y], h) => { const H = st.holes[h]; place(H.back, x - 88, y - 32, 176, 64); place(H.box, x - MW / 2, y - MH, MW, MH); place(H.lip, x - 88, y - 6, 176, 40); });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 86 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* one mole up in a hole / down again (it rises inside the hole's box: below the rim it is clipped away) */
    up(st, i, h) {
      const d = st.cards[i]; if (!d || st.up[i]) return;
      st.holes[h].box.appendChild(d); st.up[i] = true; st.at[i] = h; d.style.visibility = '';
      st.scope.anim(d, [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 220, easing: EASE.out, commit: true });
    },
    async down(st, i) {
      const d = st.cards[i]; if (!d || !st.up[i]) return;
      st.up[i] = false;
      await st.scope.anim(d, [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], { duration: 200, easing: EASE.drop, fill: 'forwards' });
      if (!st.up[i]) { d.style.visibility = 'hidden'; d.getAnimations().forEach(a => a.cancel()); }
    },
    /* the moles keep coming until the answer is in: a bag of the five, X once a round */
    async cycle(st) {
      const q = st.q, G = st.G, ai = st.opts.indexOf(q.answer);
      let bag = [];
      const refill = () => { bag = G.rng.shuffle(st.opts.map((_, i) => i)); if (q.early && bag.indexOf(ai) > 2) { bag.splice(bag.indexOf(ai), 1); bag.splice(G.rng.int(0, 2), 0, ai); } };
      await this.hold(st, 900);
      while (Session.alive(st) && !st.submitted && !st.frozen) {
        const pick = [];
        while (pick.length < q.many) { if (!bag.length) refill(); const i = bag.shift(); if (!pick.includes(i)) pick.push(i); }
        const holes = G.rng.shuffle([0, 1, 2, 3, 4]);
        if (st.flashNext && pick.includes(ai)) {      /* the 2nd hint: X's hole flashes gold before X comes up */
          st.flashNext = false; const H = st.holes[holes[pick.indexOf(ai)]].back;
          st.scope.anim(H, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 10px #FFB400) drop-shadow(0 0 18px #FFE14A)' }, { filter: 'none' }], { duration: 700 });
          await this.hold(st, 520);
        }
        pick.forEach((i, j) => this.up(st, i, holes[j]));
        await this.hold(st, q.show);
        if (!Session.alive(st) || st.submitted || st.frozen) return;
        pick.forEach(i => this.down(st, i));
        await this.hold(st, 420);
      }
    },
    /* a pause the tests' 'wait' gesture may cut short */
    hold(st, ms) { return new Promise(res => { st.skip = res; W4X.tick(st, ms).then(res); }); },
    onGesture(st, name, p) {
      if (st.submitted) return false;
      if (name === 'wait') { if (st.skip) st.skip(); return 'free'; }
      if (name !== 'tap') return false;
      const i = K.cardIndex(p.id); if (i < 0 || !st.up[i]) return false;       /* an empty hole: nothing */
      st.frozen = true; st.tapped = i; Sfx.tap(); Session.submit(st, st.opts[i]);
      return 'ok';
    },
    async reveal(st) {
      const i = st.opts.indexOf(st.q.answer), d = st.cards[i], r = d.getBoundingClientRect(), a = Stage.toStage(r.left + r.width / 2, r.top);
      K.hop(st, d, 30); Sfx.thud();
      const ul = st.G.actors.ultraman; if (ul) ul.react('thrust');
      await ZX.alive(st, st.q.answer, a.x, Math.max(120, a.y - 60), 150);
      await this.down(st, i);
      const h = HOLES()[st.at[i] < 0 ? 0 : st.at[i]], star = ZX.thing(st, 80, 80, 8, 'objpop'); ZX.pic('assets/props/ui_star.png', star); place(star, h[0] - 40, h[1] - 60, 80, 80);
      st.scope.anim(star, [{ transform: 'translateY(30px) scale(.2)', opacity: 0 }, { transform: 'translateY(-30px) scale(1.2)', opacity: 1 }, { transform: 'translateY(-20px) scale(1)', opacity: 1 }], { duration: 520, easing: EASE.pop });
      Fx.burst(h[0], h[1] - 40, { n: 14, dist: 90 });
      sayItem(st.q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); Voice.say(W4X.thisIs(ans), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain: 1 his mole stays up, blue, its own picture ("这是地" was just said); 2 all five come up and stay (a beat); 3 X in gold
       with its picture, "这个是天" */
    async explain(st, ans) {
      const iC = st.tapped, iR = st.opts.indexOf(st.q.answer);
      W4X.exChosen(st, st.cards[iC], ans);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => { const used = st.at.filter((h, i) => st.up[i]), free = [0, 1, 2, 3, 4].filter(h => !used.includes(h)); st.opts.forEach((k, i) => { if (!st.up[i]) this.up(st, i, free.shift()); }); }, 650);
      await W4X.exRight(st, st.cards[iR], st.q.answer, [W4X.thatIs(st.q.answer)]);
    },
    gestureHint(st, reteach) {
      if (reteach) { st.cards.forEach((c, i) => { if (st.up[i]) K.hop(st, c, 20); }); return; }
      st.flashNext = true;                         /* real help: X's hole lights before it comes (no star after it) */
      const i = st.opts.indexOf(st.q.answer);
      if (st.up[i]) { st.flashNext = false; st.scope.anim(st.holes[st.at[i]].back, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 10px #FFB400) drop-shadow(0 0 18px #FFE14A)' }, { filter: 'none' }], { duration: 700 }); }
    },
    next(st, strat) {
      if (!st.up) return null;
      const ai = st.opts.indexOf(st.q.answer), i = strat === 'wrong' ? st.opts.findIndex((k, j) => j !== ai && st.up[j]) : (st.up[ai] ? ai : -1);
      if (i < 0) return W4X.WAIT;
      const r = st.cards[i].getBoundingClientRect(), c = Stage.toStage(r.left + r.width / 2, r.top + r.height / 2);      /* a mole sits in its hole's box: where it really is */
      return { g: 'tap', p: { id: 'card' + i }, x: c.x, y: c.y };
    },
    find(st, id) { return id === 'wait' ? st.holes && st.holes[2].back : (st.map && st.map[id]) || null; },
    workEls(st) { return (st.cards || []).filter((c, i) => st.up && st.up[i]); },
    exPrep(st) { st.frozen = true; },
    cleanup(st) { st.frozen = true; },
    snap(st) { return { opts: st.opts || null, up: (st.up || []).filter(Boolean).length, many: st.q.many, show: st.q.show }; },
    iconNode() { const d = el('div'); d.innerHTML = MOLE_SVG; Object.assign(d.style, { width: '80%', height: '80%' }); return d; },
  };

  /* ---------------------------------------------------------------- ①-3 英文 「变！」 变身换字母 (phoneme substitution)
     The changing machine shows a word (cat) and, beside it, the picture of the word to make (hat). Change one letter: level 1
     only the first box changes (tap a letter); from level 2 tap the box to change, then a letter (the question asks both: which
     box AND which letter - a random pair is right 1 time in 15). Levels: 1 -at words, both words said; 2 -at and -an, only the
     word to make said, the box to change is the first; 3 more families (-ap -ug -ig) and look-alike letters among the five
     (b/d, p/q, m/n, h/n); 4 the box to change may be any (cat -> cap); 5 two changes in a row (man -> map -> mop), both right. */
  const DICT = W4D.dict;                     /* real CVC words (tools/content.py DICT4): a made word is said if it is one */
  const FAM = { 1: ['at'], 2: ['at', 'an'], 3: ['at', 'an', 'ap', 'ug', 'ig'] };
  const PAIRS4 = [['cat', 'cap'], ['cap', 'cup'], ['map', 'mop'], ['mop', 'top'], ['bat', 'bag'], ['man', 'map'], ['map', 'mat'], ['run', 'rug'], ['bug', 'bun'], ['rug', 'mug']];
  const CHAINS5 = [['man', 'map', 'mop'], ['cat', 'cap', 'cup'], ['bun', 'bug', 'rug'], ['mat', 'map', 'mop'], ['rat', 'mat', 'map']];
  const LOOKL = { b: 'd', d: 'b', p: 'q', q: 'p', m: 'n', n: 'mh', h: 'n', u: 'n' };
  const CONS = 'bcdfghjklmnprstvwz';
  const picOf = w => { const x = W4D.words.find(v => v[0] === w) || WORDS3.find(v => v[0] === w); return x ? x[1] : null; };
  /* the words whose picture is shown as the word to make: only pictures named by that very word (W4X.picWords, W4R1N-10) */
  const CLEAR = () => W4X.picWords(W4D.words.concat(WORDS3)).map(v => v[0]);
  const W4WORDS = () => Array.from(new Set(CLEAR()));
  const diffAt = (a, b) => [0, 1, 2].filter(i => a[i] !== b[i]);
  const Change = {
    rule: 'change-one-letter', kind0: 'en', verb: '变！', intro: '变身换字母！', softHint: true, props: [],
    /* one step: the letters to choose from (the right one + four), every one making a word we can say or no word at all */
    letters(G, from, to, slot, look) {
      const want = to[slot], vow = 'aeiou'.includes(want), pool = vow ? 'aeiou' : CONS, others = [];
      const add = c => { if (others.length < 4 && c !== want && c !== from[slot] && !others.includes(c)) others.push(c); };
      if (look) (LOOKL[want] || '').split('').forEach(add);
      G.rng.shuffle(pool.split('')).forEach(add);
      if (vow) G.rng.shuffle(CONS.split('')).forEach(add);
      return W4X.put(G, others, want);
    },
    gen(G, o) {
      const lv = o.level, words = W4WORDS(), last = (G.asked || []).slice(-1)[0];
      let steps;
      if (lv <= 3) {
        const fam = FAM[lv], cand = words.filter(w => fam.includes(w.slice(1)));
        const tos = cand.filter(w => w !== last && cand.some(x => x !== w && x.slice(1) === w.slice(1)));
        const to = bagFrom(G, 'to' + lv, tos.length ? tos : cand), from = G.rng.pick(cand.filter(x => x !== to && x.slice(1) === to.slice(1)));
        steps = [{ from, to, slot: 0 }];
      } else if (lv === 4) {
        const ok = PAIRS4.filter(([a, b]) => CLEAR().includes(b) && b !== last), [from, to] = bagFrom(G, 'p4', ok.length ? ok : PAIRS4);
        steps = [{ from, to, slot: diffAt(from, to)[0] }];
      } else {
        const ok = CHAINS5.filter(c => c.slice(1).every(w => CLEAR().includes(w)) && c[2] !== last), c = bagFrom(G, 'c5', ok.length ? ok : CHAINS5);
        steps = [{ from: c[0], to: c[1], slot: diffAt(c[0], c[1])[0] }, { from: c[1], to: c[2], slot: diffAt(c[1], c[2])[0] }];
      }
      steps.forEach(s => { s.opts = this.letters(G, s.from, s.to, s.slot, lv >= 3); });
      const two = steps.length > 1, pickSlot = lv >= 2 ? 1 : 0;
      return { k: steps.map(s => s.from + '>' + s.to + ':' + s.opts.join('')), steps, word: steps[steps.length - 1].to, item: steps[steps.length - 1].to,
        answer: two ? 'all' : steps[0].to[steps[0].slot], seq: two ? steps.map(s => s.to[s.slot]) : null, opts: steps[0].opts,
        pickSlot, saidFrom: lv <= 1 ? 1 : 0, look: steps[0].opts.filter(c => (LOOKL[steps[0].to[steps[0].slot]] || '').includes(c)).length, anySlot: lv >= 4 ? 1 : 0, two: two ? 1 : 0, fams: (FAM[Math.min(3, lv)] || []).length };
    },
    itemOf() { return null; },
    hard(q) { return q.pickSlot * 2 + (1 - q.saidFrom) + q.look + q.anySlot * 2 + q.two * 4 + q.fams * 0.3; },
    async present(st) {
      const q = st.q;
      st.si = 0; st.slot = q.pickSlot ? -1 : 0; st.word = q.steps[0].from;
      const m = st.machine = ZX.thing(st, 480, 210, 5, 'item'); m.style.pointerEvents = 'none';
      m.innerHTML = '<svg viewBox="0 0 480 210" width="100%" height="100%"><rect x="6" y="20" width="468" height="184" rx="34" fill="#E23B3B" stroke="#2B2118" stroke-width="7"/><rect x="26" y="40" width="428" height="144" rx="24" fill="#C9D6E6" stroke="#2B2118" stroke-width="5"/>'
        + '<rect x="200" y="2" width="80" height="26" rx="10" fill="#4FA3E8" stroke="#2B2118" stroke-width="5"/><circle cx="240" cy="15" r="7" fill="#FFE14A" stroke="#2B2118" stroke-width="3"/><circle cx="34" cy="190" r="8" fill="#FFE14A"/><circle cx="446" cy="190" r="8" fill="#FFE14A"/></svg>';
      st.slots = [0, 1, 2].map(i => { const d = ZX.thing(st, 116, 116, 6, 'card'); d.style.background = '#fff'; if (q.pickSlot) K.reg(st, 'slot' + i, d, {}); else if (i > 0) d.style.opacity = 0.55; return d; });
      this.showWord(st);
      st.picEl = ZX.thing(st, 180, 180, 6, 'card'); st.picEl.classList.add('pic'); st.picEl.appendChild(W4X.pic(picOf(q.steps[0].to), 150));
      this.letterCards(st);
      this.place(st);
      K.pop(st, m); K.pop(st, st.picEl, 120);
      this.markSlot(st);
      const s = q.steps[0];
      st.prompt = s.to;
      if (q.saidFrom) { st.lead = s.from; Voice.say(s.from, { tag: 'prompt' }); }
      Voice.say(s.to, { tag: 'prompt' });
    },
    letterCards(st) {
      if (st.cards) st.cards.forEach(c => c.remove());
      const s = st.q.steps[st.si];
      K.cards(st, s.opts.map(c => Glyph.en(c, 92)), s.opts.slice(), Object.assign({ size: 130, gap: 24 }, this.cardSpot()));
    },
    showWord(st) { st.slots.forEach((d, i) => { d.innerHTML = ''; d.appendChild(Glyph.en(st.word[i], 84)); }); },
    markSlot(st) { st.slots.forEach((d, i) => { d.style.boxShadow = i === st.slot ? '0 0 0 5px #2B2118, 0 0 0 12px #FFE14A' : ''; }); },
    cardSpot() { return L() ? { cx: 560, cy: 540 } : { cx: 352, cy: 800, cols: 3 }; },
    place(st) {
      if (!st.machine) return;
      const Lx = L(), mx = Lx ? 200 : 112, my = Lx ? 96 : 300;
      place(st.machine, mx, my, 480, 210);
      st.slots.forEach((d, i) => { if (!d._lift) place(d, mx + 240 - 58 + (i - 1) * 132, my + 66, 116, 116); });
      place(st.picEl, Lx ? 730 : 262, Lx ? 112 : 104, 180, 180);
      K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot()));
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 86 : 80, L() ? 698 : 1016, L() ? 200 : 140); },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted || st.busy) return false;
      const m = /^slot(\d)$/.exec(p.id || '');
      if (m) { st.slot = Number(m[1]); this.markSlot(st); Sfx.tap(); K.hop(st, st.slots[st.slot], 18); return 'ok'; }
      const i = K.cardIndex(p.id); if (i < 0) return false;
      if (st.slot < 0) { st.slots.forEach(d => K.wiggle(st, d)); Voice.sayNow('先点一格！', { tag: 'how' }); return 'free'; }
      st.tapped = i; Sfx.tap();
      this.change(st, st.slot, st.opts[i]);
      return 'ok';
    },
    /* the letter flies into the box, the machine hums, the word changes and is said */
    async change(st, slot, c) {
      const q = st.q, s = q.steps[st.si], card = st.cards[st.opts.indexOf(c)], box = st.slots[slot];
      st.busy = true;
      const b = box.getBoundingClientRect(), r = card.getBoundingClientRect(), A = Stage.toStage(b.left, b.top), B = Stage.toStage(r.left, r.top);
      await K.flyTo(st, card, A.x + (b.width - r.width) / 2 / (Stage.s || 1), A.y + (b.height - r.height) / 2 / (Stage.s || 1), 320, 40, 1);
      if (!Session.alive(st)) return;
      card.style.visibility = 'hidden';
      st.word = st.word.slice(0, slot) + c + st.word.slice(slot + 1); this.showWord(st);
      Sfx.zap(); st.scope.anim(st.machine, [{ transform: 'scale(1)' }, { transform: 'scale(1.04,.96)' }, { transform: 'scale(1)' }], { duration: 300 });
      void B;
      if (st.word !== s.to) { st.made = st.word; Session.submit(st, st.word); return; }
      if (st.si + 1 < q.steps.length) {                  /* the first change of two: said, and the next picture */
        Voice.say(st.word, { tag: 'prompt' }); K.hop(st, st.picEl, 20);
        await st.scope.guard(Voice.afterSay(150));
        if (!Session.alive(st)) return;
        st.si++; st.slot = -1; this.markSlot(st);
        st.picEl.innerHTML = ''; st.picEl.appendChild(W4X.pic(picOf(q.steps[st.si].to), 150)); K.pop(st, st.picEl);
        this.letterCards(st); this.place(st);
        st.prompt = q.steps[st.si].to; Voice.say(st.prompt, { tag: 'prompt' });
        st.busy = false;
        return;
      }
      Session.submit(st, 'ok');
    },
    evaluate(st, ans) { return ans === 'ok'; },
    async reveal(st) {
      K.hop(st, st.picEl, 34); Sfx.reveal(); st.slots.forEach((d, i) => st.scope.timeout(() => K.hop(st, d, 20), 90 * i));
      const ul = st.G.actors.ultraman; if (ul) ul.react('thrust');
      Voice.say(st.q.word + '!', { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the word he made, said - or, made no word, "这个不是词" */
    async feedback(st) { const w = st.made; if (DICT.includes(w)) Voice.say(w, { tag: 'wrong' }); else Voice.say('这个不是词', { tag: 'wrong' }); await st.scope.wait(700); },
    /* explain: 1 the made word in blue (said; its picture when we have one); 2 the box to change and the right letter in gold:
       "换这一个"; 3 the machine makes the right word, said, its picture hops */
    async explain(st) {
      const q = st.q, s = q.steps[st.si], w = st.made, pic = DICT.includes(w) && picOf(w);
      st.cards.forEach(c => { c.style.visibility = ''; c.style.transform = ''; c.getAnimations().forEach(a => a.cancel()); });
      K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot()));      /* the letter he chose back in its row */
      EX.ring(st, st.machine, 'chosen', 4); if (st.cards[st.tapped]) EX.ring(st, st.cards[st.tapped], 'chosen');
      if (pic && W4X.hasPic(pic)) EX.picOver(st, st.machine, W4X.pic(pic, 88), 'chosen', 100);
      await EX.wait(st, 650);
      st.word = s.from; this.showWord(st); st.slot = s.slot; this.markSlot(st);
      const ci = st.opts.indexOf(s.to[s.slot]), card = st.cards[ci];
      EX.ring(st, st.slots[s.slot], 'right', 6); if (card) { EX.ring(st, card, 'right'); K.hop(st, card, 20); }
      await EX.say(st, ['换这一个']);
      await EX.wait(st, 300);
      if (card) {
        const b = st.slots[s.slot].getBoundingClientRect(), r = card.getBoundingClientRect(), A = Stage.toStage(b.left, b.top);
        await K.flyTo(st, card, A.x + (b.width - r.width) / 2 / (Stage.s || 1), A.y + (b.height - r.height) / 2 / (Stage.s || 1), 320, 40, 1);
        card.style.visibility = 'hidden';
      }
      st.word = s.to; this.showWord(st); Sfx.zap(); K.hop(st, st.picEl, 24);
      st.stepDirty = true;
      await EX.say(st, [s.to + '!']);
      await EX.wait(st, 250);
    },
    gestureHint(st, reteach) {
      if (reteach) { st.slots.forEach(d => K.hop(st, d, 16)); return; }
      if (st.hintDone) return; st.hintDone = true;          /* only the question again, slowly (softHint: the star stays) */
      K.hop(st, st.picEl, 22); Voice.say(st.q.steps[st.si].to, { tag: 'hint2' });
    },
    next(st, strat) {
      if (!st.cards || st.busy) return null;
      const s = st.q.steps[st.si], right = strat !== 'wrong';
      if (st.q.pickSlot && st.slot < 0) return { g: 'tap', p: { id: 'slot' + (right ? s.slot : (s.slot + 1) % 3) } };
      const i = right ? st.opts.indexOf(s.to[s.slot]) : st.opts.findIndex(c => c !== s.to[s.slot]);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).concat(st.q.pickSlot ? st.slots || [] : []); },
    snap(st) { return { opts: st.opts || null, si: st.si || 0, slot: st.slot, word: st.word || '' }; },
    iconNode() { const d = el('div'); d.style.display = 'flex'; d.style.alignItems = 'center'; d.appendChild(Glyph.word('cat', 30)); const a = el('div', '', d); a.innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M3 10H15M11 5L16 10L11 15" fill="none" stroke="#E23B3B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'; d.appendChild(Glyph.word('hat', 30)); return d; },
  };

  /* ---------------------------------------------------------------- ①-4 挑战 「古！」 古字变今字 (ancient form -> today's character)
     An ancient form (甲骨文 / 金文 style, src/w4/ancient.js) inked on an open scroll; which of five of today's characters did it
     become? Only characters the child knows (§5.3) are asked. Levels: 1 the thing's picture beside the ancient form, the others
     unlike in meaning and shape; 2 the ancient form alone; 3 look-alikes of today's character among the others (日/目/田, 人/大/天,
     土/上, 川/三); 4 the others of the same kind, their ancient forms alike too (牛: 羊 马 鸟 鱼); 5 two ancient forms side by side,
     a character for each (both right). The ancient form is not said (a picture to read); its 2nd hint draws today's first strokes
     over it (real help: no star). */
  const GROUP = ['牛羊马鸟鱼虫龙兔', '口目手耳足心牙头', '日月山水火川雨土田天地', '禾木米竹草', '人大天女子小'];
  const groupOf = k => GROUP.find(g => g.includes(k)) || '';
  const PICONLY = '马牙女竹';            /* forms a child may not see unaided: asked only with the picture beside them (level 1) */
  const ANC = (k, size, color) => {
    const f = W4X.ANCIENT && W4X.ANCIENT[k]; if (!f) return null;
    const s = svg('svg', { viewBox: '0 0 100 100', width: size, height: size }); s.style.overflow = 'visible';
    f.d.forEach(d => svg('path', { d, fill: 'none', stroke: color || '#2B2118', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s));
    return s;
  };
  const Ancient = {
    rule: 'ancient-to-modern', kind0: 'quiz', verb: '古！', intro: '古字变今字！', props: ['scroll'],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), has = k => !!(W4X.ANCIENT && W4X.ANCIENT[k]) && !!ITEM[k] && !!ITEM[k].obj;
      const ask = kn.filter(k => has(k) && (lv <= 1 || !PICONLY.includes(k))), two = lv >= 5;
      const first = W4X.pick(G, ask, 'anc');      /* the island's characters still to pass first (天 土 川) */
      const seq = [first];
      if (two) seq.push(G.rng.pick(ask.filter(k => k !== first && groupOf(k) !== groupOf(first)) .concat(ask.filter(k => k !== first)).slice(0, 8)));
      const lk = k => (LOOK[k] || '').split('').filter(x => kn.includes(x) && !(HOLDS[k] || '').includes(x));
      const others = [], add = x => { if (others.length < 5 - seq.length && !seq.includes(x) && !others.includes(x) && kn.includes(x) && !seq.some(s => (HOLDS[s] || '').includes(x))) others.push(x); };
      if (lv === 3 || lv === 5) seq.forEach(s => G.rng.shuffle(lk(s)).forEach(add));
      if (lv === 4) seq.forEach(s => G.rng.shuffle(groupOf(s).split('')).forEach(add));
      const unlike = x => !seq.some(s => groupOf(s) === groupOf(x) || lk(s).includes(x));
      G.rng.shuffle(kn.filter(unlike)).forEach(add);
      G.rng.shuffle(kn).forEach(add);
      const opts = W4X.put(G, others.concat(seq.slice(1)), first);
      return { k: [seq.join(''), opts.join('')], seq, answer: two ? 'all' : first, item: first, opts, pic: lv <= 1 ? 1 : 0, two: two ? 1 : 0,
        look: opts.filter(x => !seq.includes(x) && seq.some(s => lk(s).includes(x))).length, same: opts.filter(x => !seq.includes(x) && seq.some(s => groupOf(s) === groupOf(x))).length };
    },
    itemOf(st) { return W4X.own(st, st.q.seq[0]); },
    itemsOf(st) { return st.q.seq.slice(1); },
    hard(q) { return (1 - q.pic) * 2 + q.look * 1.5 + q.same * 1.2 + q.two * 5; },
    async present(st) {
      const q = st.q;
      st.ai = 0;
      st.scrolls = q.seq.map((k, i) => {
        const d = ZX.thing(st, 250, 250, 5, 'item'); d.style.pointerEvents = 'none';
        const bgp = img('assets/props/scroll.png', '', d); Object.assign(bgp.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' });
        const f = el('div', '', d); Object.assign(f.style, { position: 'absolute', left: '22%', top: '20%', width: '56%', height: '56%' }); f.appendChild(ANC(k, '100%'));
        d._f = f; K.pop(st, d, 100 * i);
        return d;
      });
      if (q.pic) { st.picEl = ZX.thing(st, 150, 150, 6, 'card'); st.picEl.classList.add('pic'); st.picEl.appendChild(W4X.pic(ITEM[q.seq[0]].obj, 128)); K.pop(st, st.picEl, 200); }
      K.cards(st, q.opts.map(k => Glyph.zh(k, 100)), q.opts, Object.assign({ size: 140, gap: 26 }, this.cardSpot()));
      this.place(st);
      K.say(st, '这是哪个字？');
    },
    cardSpot() { return L() ? { cx: 560, cy: 555 } : { cx: 352, cy: 790, cols: 3 }; },
    place(st) {
      if (!st.scrolls) return;
      const Lx = L(), n = st.scrolls.length, S = n > 1 ? 230 : 250;
      st.scrolls.forEach((d, i) => { const cx = (Lx ? 520 : 352) + (n > 1 ? (i ? 1 : -1) * (Lx ? 150 : 132) : 0); place(d, cx - S / 2, Lx ? 96 : 210, S, S); });
      if (st.picEl) place(st.picEl, Lx ? 690 : 500, Lx ? 146 : 470, 150, 150);
      K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot()));
      (st.done || []).forEach(([ci, si]) => { const c = st.cards[ci], s = st.scrolls[si]; if (c && s) { const b = box(s); place(c, b.x + b.w / 2 - 55, b.y + b.h - 20, 110, 110); } });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 86 : 80, L() ? 698 : 1016, L() ? 200 : 140); },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || (st.done || []).some(d => d[0] === i)) return false;
      const q = st.q, want = q.seq[st.ai];
      st.tapped = i; Sfx.tap();
      if (q.opts[i] !== want) { Session.submit(st, q.opts[i]); return 'ok'; }
      if (st.ai + 1 < q.seq.length) {                    /* the first of two: it goes under its scroll */
        (st.done = st.done || []).push([i, st.ai]); st.ai++;
        const s = box(st.scrolls[0]), c = st.cards[i]; K.flyTo(st, c, s.x + s.w / 2 - 55, s.y + s.h - 20, 320, 30, 1).then(() => { if (!st.scope.dead) { c.style.width = c.style.height = '110px'; c.style.transform = ''; } });
        Sfx.place(); return 'ok';
      }
      Session.submit(st, q.two ? 'all' : want);
      return 'ok';
    },
    async reveal(st) {
      const q = st.q, k = q.seq[q.seq.length - 1], e = st.cards[q.opts.indexOf(k)];
      K.hop(st, e, 30); Sfx.reveal();
      for (let i = 0; i < st.scrolls.length; i++) { const f = st.scrolls[i]._f; st.scope.anim(f, [{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], { duration: 600 }); }
      const ul = st.G.actors.ultraman; if (ul) ul.react('thrust');
      q.seq.forEach(x => Voice.say(ITEM[x].line, { tag: 'summary' })); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); Voice.say(W4X.thisIs(ans), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain: 1 the chosen card in blue with its own ancient form (and its picture); 2 the scroll's ancient form fades and today's
       character writes itself stroke by stroke over it - "古字变今字" (字从画里来); 3 the right card in gold with its picture */
    async explain(st, ans) {
      const q = st.q, si = Math.min(st.ai || 0, q.seq.length - 1), want = q.seq[si], eC = st.cards[st.tapped], eR = st.cards[q.opts.indexOf(want)], sc = st.scrolls[si];
      if (eC) { EX.ring(st, eC, 'chosen'); const f = ANC(ans, 84, EX_BLUE); EX.picOver(st, eC, f || ans, 'chosen'); }
      await EX.wait(st, 700);
      if (sc) {
        const b = box(sc), cx = b.x + b.w / 2, cy = b.y + b.h * 0.48;
        st.scope.anim(sc._f, [{ opacity: 1 }, { opacity: 0.18 }], { duration: 700, fill: 'forwards' });
        const W = new Writer(st, { kind: 'zh', glyph: want, level: 1, x: cx, y: cy, size: b.w * 0.62, bare: true, z: 36 });
        Voice.say('古字变今字', { tag: 'explain' });
        await W.demo(st, null, true, '#E8414B');
        st.stepDirty = true;
        await EX.wait(st, 300);
      }
      await W4X.exRight(st, eR, want, [W4X.thatIs(want)]);
    },
    /* the 2nd hint (real help): today's first strokes appear faintly over the ancient form */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 18), 100 * i)); return; }
      if (st.hintDone || !st.scrolls) return; st.hintDone = true;
      const want = st.q.seq[st.ai || 0], sc = st.scrolls[st.ai || 0], d = Hanzi.data && Hanzi.data[want]; if (!d || !sc) return;
      const s = svg('svg', { viewBox: '0 0 1024 1024', width: '100%', height: '100%' }), g = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s);
      d.s.slice(0, Math.min(2, d.s.length - 1)).forEach(o => svg('path', { d: o, fill: '#E8414B', opacity: 0.75 }, g));
      const o = el('div', '', sc); Object.assign(o.style, { position: 'absolute', left: '22%', top: '20%', width: '56%', height: '56%', pointerEvents: 'none' }); o.appendChild(s);
      st.scope.anim(o, [{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
    },
    next(st, strat) {
      if (!st.cards) return null;
      const want = st.q.seq[st.ai || 0], used = (st.done || []).map(d => d[0]);
      const i = strat === 'wrong' ? st.q.opts.findIndex((k, j) => k !== want && !used.includes(j)) : st.q.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    snap(st) { return { opts: st.opts || null, step: st.ai || 0 }; },
    iconNode() { const d = el('div'); Object.assign(d.style, { width: '74%', height: '74%' }); d.appendChild(ANC('山', '100%') || Glyph.zh('山', 56)); return d; },
  };

  w4Island('ultra4', [Moles, Change, Ancient]);
})();
