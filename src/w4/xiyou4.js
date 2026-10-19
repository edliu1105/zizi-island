/* ================================================================ 神笔海 ④ 西游记 · 水帘洞 (xiyou4): 对 雪 虫 鱼 草 (docs/W4-DESIGN.md §6 ④)
   认字 「摘！」摘桃找词 (find-the-word) · 写字 虫 对 (W4X.Write) · 英文 「闪！」火眼金睛 (flash-then-find) ·
   挑战 「归！」送字回家 (sort-by-meaning). Built like the template src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  /* lines said through a variable (tools/voice_lines.py records them): 送字回家 L4's word 小鸟 is in KIND4_WORDS only */
  W4X.lines(['这是小鸟']);
  /* the stage box of an element as it is seen (a card being dragged, a piece inside another element) */
  const vbox = e => { const r = e.getBoundingClientRect(), s = Stage.s || 1, a = Stage.toStage(r.left, r.top); return { x: a.x, y: a.y, w: r.width / s, h: r.height / s }; };
  /* a card let go over its target keeps the finger's offset: it becomes its real place (then it can fly on from there) */
  const settle = e => { if (!e || !e.style.transform) return; const b = box(e), v = vbox(e); e.style.transform = ''; e.getAnimations().forEach(a => a.cancel()); place(e, v.x + v.w / 2 - b.w / 2, v.y + v.h / 2 - b.h / 2); };
  const unmove = e => { if (!e) return; e.style.transform = ''; e.getAnimations().forEach(a => a.cancel()); };
  const R = (G, a) => G.rng.shuffle(a.slice());

  /* ---------------------------------------------------------------- ④-1 认字 「摘！」 摘桃找词 (a word of two characters)
     Five peaches hang in the tree before 水帘洞, each with a word of two characters (level 5: three). Tap the peach with the word
     asked - or drag it into the basket. Right: both characters right and in their order. The island's character still to pass
     comes first (needPick), then a word with it (WORDS_ZH4, only words all of whose characters the child knows, §5.3).
     Levels: 1 the word's picture on the task card (only words with a picture), the others share no character with it; 2 heard
     only; 3 others with one character the same (金鱼 / 大鱼 / 小鱼); 4 the same characters the other way round (天上 / 上天,
     草地 / 地草) too; 5 three characters (小金鱼 / 大金鱼 / 金小鱼). A random peach is right 1 time in 5. */
  const ZH = () => W4D.wordsZh.concat(W4D.wordsZh3);
  const zhPic = w => { const x = ZH().find(v => v[0] === w); return x && x[1] && W4X.hasPic(x[1]) ? x[1] : null; };
  const isWord = w => ZH().some(v => v[0] === w);
  const shares = (a, b) => Array.from(a).some(c => b.includes(c));
  const sameSet = (a, b) => a !== b && a.length === b.length && Array.from(a).sort().join('') === Array.from(b).sort().join('');
  const PW = 158;
  const PEACHES = () => (L() ? [[176, 200], [344, 370], [512, 200], [680, 370], [848, 200]] : [[130, 330], [241, 520], [352, 330], [463, 520], [574, 330]]);
  const BASKET = () => (L() ? [412, 505, 200, 170] : [247, 676, 210, 180]);
  const PEACH_ICON = '<svg viewBox="0 0 60 60" width="100%" height="100%"><path d="M30 16C40 6 54 10 54 26C54 42 42 54 30 54C18 54 6 42 6 26C6 10 20 6 30 16Z" fill="#FFB38A" stroke="#2B2118" stroke-width="3.5"/><path d="M30 18C26 30 28 42 32 52" fill="none" stroke="#E8735B" stroke-width="3" stroke-linecap="round"/><path d="M30 16C30 10 34 5 39 4" fill="none" stroke="#7A5230" stroke-width="3.5" stroke-linecap="round"/><path d="M33 9C40 2 50 4 52 10C45 14 38 13 33 9Z" fill="#5CC46E" stroke="#2B2118" stroke-width="2.5"/></svg>';
  const Peach = {
    rule: 'find-the-word', verb: '摘！', intro: '摘对的桃子！', props: ['peach', 'basket'],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), knows = w => Array.from(w).every(c => kn.includes(c));
      const two = W4D.wordsZh.map(v => v[0]).filter(knows), three = W4D.wordsZh3.map(v => v[0]).filter(knows);
      const mine = poolOf(G, 'zh', false), list = lv >= 5 && three.length ? three : two;
      let ask = lv <= 1 ? list.filter(zhPic) : list;
      if (lv >= 4) { const diff = ask.filter(w => new Set(w).size === w.length); if (diff.length) ask = diff; }      /* 爷爷 has no other order */
      const holders = l => mine.filter(k => l.some(w => w.includes(k)));
      const own = holders(ask).length ? holders(ask) : holders(list);
      let X, word;
      if (own.length) {
        X = W4X.pick(G, own);
        const c = ask.filter(w => w.includes(X));
        word = bagFrom(G, 'fw' + lv + X, c.length ? c : list.filter(w => w.includes(X)));
      } else { word = bagFrom(G, 'fw' + lv, ask.length ? ask : list); X = Array.from(word).find(c => mine.includes(c)) || word[0]; }
      const others = [], add = w => { if (others.length < 4 && w && w !== word && !others.includes(w)) others.push(w); };
      const share = two.filter(w => shares(w, word)), apart = two.filter(w => !shares(w, word));
      if (word.length === 3) {
        const a = Array.from(word);
        R(G, three.filter(w => w !== word && Array.from(w).filter((c, i) => c === a[i]).length === 2)).slice(0, 1).forEach(add);   /* one character not the same: 大金鱼 */
        R(G, [[1, 0, 2], [0, 2, 1]].map(p => p.map(j => a[j]).join(''))).slice(0, 2).forEach(add);                                   /* the order changed: 金小鱼 */
        R(G, three.filter(w => shares(w, word))).forEach(add);
        R(G, three).forEach(add);
      } else if (lv >= 4) { add(Array.from(word).reverse().join('')); R(G, share).slice(0, 1).forEach(add); R(G, apart).forEach(add); }
      else if (lv === 3) { R(G, share).slice(0, 2).forEach(add); R(G, apart).forEach(add); }
      else R(G, apart).forEach(add);
      R(G, two).forEach(add);
      const opts = W4X.put(G, others, word);
      return { k: [word, opts.join('')], answer: word, item: X, opts, pic: lv <= 1 && zhPic(word) ? 1 : 0, three: word.length === 3 ? 1 : 0,
        share: others.filter(w => shares(w, word)).length, rev: others.some(w => sameSet(w, word)) ? 1 : 0 };
    },
    /* tests/w4_levels.js: the picture gone, characters the same, the order turned round, three characters */
    hard(q) { return (1 - q.pic) * 1.5 + Math.min(2, q.share) + q.rev * 1.5 + q.three * 3; },
    itemOf(st) { return st.q.item; },
    /* the other characters of this island in the word read right count too (like 读一读) */
    itemsOf(st) { const mine = poolOf(st.G, 'zh', false); return Array.from(new Set(st.q.answer)).filter(c => c !== st.q.item && mine.includes(c)); },
    label(w) {
      const s = w.length > 2 ? 42 : 60, d = el('div', '');
      Object.assign(d.style, { position: 'absolute', left: '50%', top: '58%', transform: 'translate(-50%,-50%)', display: 'flex', background: 'rgba(255,252,240,.95)', borderRadius: '18px', padding: '2px 6px', boxShadow: '0 0 0 3px #2B2118', pointerEvents: 'none' });
      Array.from(w).forEach(c => d.appendChild(Glyph.zh(c, s)));
      return d;
    },
    async present(st) {
      const q = st.q;
      await ZX.meet(st, q.item);
      if (!Session.alive(st)) return;
      const b = st.basket = ZX.thing(st, 200, 170, 5, 'item'); ZX.pic('assets/props/basket.png', b);
      st.opts = q.opts.slice();
      st.cards = q.opts.map((w, i) => {
        const d = ZX.thing(st, PW, PW, 6, 'item'); ZX.pic('assets/props/peach.png', d); d.appendChild(this.label(w));
        K.reg(st, 'card' + i, d, { drag: true, drops: () => [{ id: 'basket', rect: () => box(st.basket) }] });
        K.pop(st, d, 70 * i);
        return d;
      });
      this.place(st);
      const pic = zhPic(q.answer);
      st.taskEl = K.task(st, [q.pic && pic ? [OBJURL(pic), 'q'] : ['speaker', 'q']]);
      K.say(st, '摘' + q.answer + '！');
    },
    place(st) {
      if (!st.cards) return;
      const P = PEACHES();
      st.cards.forEach((d, i) => { if (!d._in) place(d, P[i][0] - PW / 2, P[i][1] - PW / 2, PW, PW); });
      const B = BASKET(); place(st.basket, B[0], B[1], B[2], B[3]);
      (st.cards || []).forEach(d => { if (d._in) this.inBasket(st, d); });
    },
    inBasket(st, d) { const B = box(st.basket); place(d, B.x + B.w / 2 - PW / 2, B.y + B.h * 0.42 - PW / 2, PW, PW); d.style.transform = 'scale(.62)'; },
    onGesture(st, name, p) {
      if (st.submitted) return false;
      const i = K.cardIndex(p.id);
      if (i < 0 || !(name === 'tap' || (name === 'drop' && p.to === 'basket'))) return false;
      if (name === 'drop') settle(st.cards[i]);
      st.tapped = i; Sfx.tap();
      Session.submit(st, st.opts[i]);
      return 'ok';
    },
    /* the peach goes into the basket, the word is said */
    async reveal(st) {
      const i = st.opts.indexOf(st.q.answer), d = st.cards[i], B = box(st.basket);
      settle(d);
      await K.flyTo(st, d, B.x + B.w / 2 - PW / 2, B.y + B.h * 0.42 - PW / 2, 380, 60, 0.62);
      if (!Session.alive(st)) return;
      d._in = true; Sfx.place(); K.hop(st, st.basket, 16);
      Fx.burst(B.x + B.w / 2, B.y + 30, { n: 14, dist: 90 });
      const wk = st.G.actors.wukong; if (wk) wk.react();
      Voice.say(st.q.answer, { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the word he picked ("这是地上"); a jumbled one (地草) is read character by character */
    async feedback(st, ans) {
      const e = st.cards[st.tapped]; if (e) { unmove(e); this.place(st); K.wiggle(st, e); }
      if (isWord(ans)) Voice.say(W4X.thisIs(ans), { tag: 'wrong' }); else Array.from(ans).forEach(c => Voice.say(c, { tag: 'wrong' }));
      await st.scope.wait(900);
    },
    /* explain: 1 his peach in blue (its picture when the word has one); 2 the two words side by side, character by character:
       the same ones gold, the others blue (a beat); 3 the right peach in gold with its picture: "这是天上" */
    async explain(st, ans) {
      const q = st.q, eC = st.cards[st.tapped], eR = st.cards[st.opts.indexOf(q.answer)], pc = zhPic(ans), pr = zhPic(q.answer);
      W4X.exChosen(st, eC, pc ? W4X.pic(pc, 86) : null);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => this.compare(st, ans, q.answer), 900);
      await W4X.exRight(st, eR, q.answer, [W4X.thisIs(q.answer)], pr ? W4X.pic(pr, 86) : false);
    },
    compare(st, a, b) {
      const s = a.length > 2 || b.length > 2 ? 58 : 66, d = ZX.thing(st, 10, 10, 61, 'item'); d.dataset.ex = 'compare';
      Object.assign(d.style, { width: 'auto', height: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 18px', background: '#FFFDF4', borderRadius: '22px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.2)', pointerEvents: 'none' });
      [a, b].forEach(w => {
        const row = el('div', '', d); Object.assign(row.style, { display: 'flex', gap: '6px' });
        Array.from(w).forEach((c, i) => {
          const same = c === (w === a ? b : a)[i], cell = el('div', '', row);
          Object.assign(cell.style, { width: s + 'px', height: s + 'px', borderRadius: '12px', background: same ? '#FFF1BF' : '#E1ECFA', boxShadow: '0 0 0 3px ' + (same ? EX_GOLD : EX_BLUE) });
          cell.appendChild(Glyph.zh(c, s, same ? '#8A5A00' : '#2E5E9E'));
        });
      });
      const n = Math.max(a.length, b.length), w = n * s + (n - 1) * 6 + 36, B = box(st.basket);
      place(d, Stage.W / 2 - w / 2, L() ? B.y - 20 : B.y - 10); d.style.width = d.style.height = 'auto';
      K.pop(st, d);
    },
    /* the 2nd hint (real help): the word's picture on the task card; a word without one shows its first character there.
       Level 1 has the picture already: nothing more to give (no star lost) */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 18), 90 * i)); return; }
      if (st.hintDone || !st.taskEl) return; st.hintDone = true;
      if (st.q.pic) { st.noHelp = true; return; }
      const it = st.taskEl.querySelector('.it'), pic = zhPic(st.q.answer); if (!it) return;
      let nd;
      if (pic) { nd = img(OBJURL(pic), ''); nd.style.height = '54px'; }
      else { nd = el('div', ''); Object.assign(nd.style, { width: '54px', height: '54px', borderRadius: '12px', background: '#FFF1BF', boxShadow: '0 0 0 3px ' + EX_GOLD }); nd.appendChild(Glyph.zh(st.q.answer[0], 50)); }
      it.replaceChild(nd, it.firstChild); Sfx.sparkle();
      st.scope.anim(nd, [{ transform: 'scale(.3)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 420, easing: EASE.pop });
    },
    next(st, strat) {
      if (!st.cards) return null;
      const i = strat === 'wrong' ? st.opts.findIndex(w => w !== st.q.answer) : st.opts.indexOf(st.q.answer);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    cleanup(st) { (st.cards || []).forEach(d => { d._in = false; }); },
    snap(st) { return { opts: st.opts || null }; },
    iconNode() { const d = el('div'); d.innerHTML = PEACH_ICON; Object.assign(d.style, { width: '78%', height: '78%' }); return d; },
  };

  /* ---------------------------------------------------------------- ④-3 英文 「闪！」 火眼金睛 (a sight word, looked at once)
     Wukong's eyes light up; the golden screen shows an English word for a moment, then a cloud covers it; five word cards come.
     Tap the one that was shown - it is never said before (a word to look at); a right tap says it and a short sentence with it.
     Levels: 1 shown 3 s, the others unlike it (another length, another first letter); 2 2.5 s, the others as long as it; 3 the
     others include words one letter apart (in / it / is, can / cat, me / we); 4 2 s, two words at once (I see) - five pairs; 5
     1.5 s, two words, the same pair the other way round (see I) among them. A random card is right 1 time in 5. */
  const lc = w => (w === 'I' ? 'I' : w.toLowerCase());
  const SIGHT = () => W4D.sight;
  const EPOOL = () => Array.from(new Set(W4D.sight.concat(W4D.words.map(v => v[0]))));
  const oneOff = (a, b) => a.length === b.length && a !== b && Array.from(a).filter((c, i) => c !== b[i]).length === 1;
  const toks = t => t.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean).map(lc);
  const PAIRS = () => {
    if (PAIRS.v) return PAIRS.v;
    const P = EPOOL(), out = [], seen = new Set();
    W4D.esent.forEach(([t]) => { const w = toks(t); for (let i = 0; i + 1 < w.length; i++) { const p = w[i] + ' ' + w[i + 1]; if (P.includes(w[i]) && P.includes(w[i + 1]) && w[i] !== w[i + 1] && !seen.has(p)) { seen.add(p); out.push([p, t]); } } });
    return (PAIRS.v = out);
  };
  const sentOf = (G, w) => { const s = W4D.esent.map(v => v[0]).filter(t => toks(t).includes(w)); return s.length ? G.rng.pick(s) : null; };
  const SCR_W = 420, SCR_H = 200;
  const SCREEN_SVG = '<svg viewBox="0 0 420 200" width="100%" height="100%"><rect x="6" y="22" width="408" height="172" rx="32" fill="#F5B324" stroke="#2B2118" stroke-width="7"/><rect x="28" y="42" width="364" height="132" rx="20" fill="#1F4E58" stroke="#2B2118" stroke-width="5"/>'
    + '<g stroke="#2B2118" stroke-width="4"><path d="M118 26C112 10 126 2 134 10C136 2 152 2 150 14C160 8 168 18 158 26Z" fill="#E8414B"/><path d="M262 26C256 10 270 2 278 10C280 2 296 2 294 14C304 8 312 18 302 26Z" fill="#E8414B"/>'
    + '<ellipse cx="138" cy="28" rx="26" ry="12" fill="#fff"/><ellipse cx="282" cy="28" rx="26" ry="12" fill="#fff"/></g><circle cx="138" cy="28" r="8" fill="#FFB400"/><circle cx="282" cy="28" r="8" fill="#FFB400"/><circle cx="138" cy="28" r="3.5" fill="#2B2118"/><circle cx="282" cy="28" r="3.5" fill="#2B2118"/></svg>';
  const CLOUD_SVG = '<svg viewBox="0 0 400 150" width="100%" height="100%"><path d="M58 140C22 140 6 114 16 92C24 74 44 68 60 74C64 44 94 26 124 34C140 12 174 6 202 22C224 6 260 10 276 36C304 26 338 44 342 74C370 74 392 96 386 118C382 134 366 140 348 140Z" fill="#fff" stroke="#2B2118" stroke-width="6" stroke-linejoin="round"/><path d="M110 112C150 122 250 122 300 108" fill="none" stroke="#C9DDF0" stroke-width="8" stroke-linecap="round"/></svg>';
  /* a word or two as glyphs, as big as fits */
  const enNode = (txt, h, maxW, color) => {
    const ws = txt.split(' '), d = el('div', ''); Object.assign(d.style, { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none' });
    let gs = ws.map(w => Glyph.word(w, h, color)), gap = Math.round(h * 0.42), wd = gs.reduce((a, g) => a + (+g.getAttribute('width')), 0) + gap * (gs.length - 1);
    if (wd > maxW) { const k = maxW / wd; h = Math.floor(h * k); gap = Math.round(h * 0.42); gs = ws.map(w => Glyph.word(w, h, color)); }
    d.style.gap = gap + 'px'; gs.forEach(g => d.appendChild(g));
    return d;
  };
  const Flash = {
    rule: 'flash-then-find', kind0: 'en', verb: '闪！', intro: '火眼金睛看一眼！', softHint: false, props: [],
    gen(G, o) {
      const lv = o.level, P = EPOOL(), last = (G.asked || []).slice(-1)[0];
      if (lv <= 3) {
        let ts = SIGHT().filter(w => w !== last && (lv === 1 || (w.length >= 2 && w.length <= 4)));
        if (lv === 3) ts = ts.filter(w => P.some(x => oneOff(w, x)));
        const t = bagFrom(G, 'fl' + lv, ts), others = [], add = x => { if (others.length < 4 && x !== t && !others.includes(x)) others.push(x); };
        if (lv === 1) R(G, P.filter(x => x.length !== t.length && x[0].toLowerCase() !== t[0].toLowerCase())).forEach(add);
        else {
          if (lv === 3) R(G, P.filter(x => oneOff(t, x))).slice(0, 2).forEach(add);
          R(G, P.filter(x => x.length === t.length && !oneOff(t, x))).forEach(add);
          R(G, P.filter(x => x.length === t.length)).forEach(add);
        }
        R(G, P).forEach(add);
        const opts = W4X.put(G, others, t);
        return { k: [t, opts.join(',')], answer: t, item: t, opts, show: [3000, 3000, 2500, 2500][lv], two: 0, rev: 0, said: sentOf(G, t),
          same: others.filter(x => x.length === t.length).length >= 4 ? 1 : 0, off: others.filter(x => oneOff(t, x)).length };
      }
      const pr = bagFrom(G, 'fp', PAIRS().filter(p => p[0] !== last)), [a, b] = pr[0].split(' '), t = pr[0], others = [];
      const add = x => { if (others.length < 4 && x !== t && !others.includes(x)) others.push(x); };
      if (lv >= 5) add(b + ' ' + a);
      const swap = (w, j) => R(G, P.filter(x => x !== w && x !== (j ? a : b) && (x.length === w.length || Math.abs(x.length - w.length) <= 1)));
      const ch = R(G, [0, 1, 0, 1, 0, 1]);
      ch.forEach((j, n) => { const x = swap(j ? b : a, j)[n]; if (x) add(j ? a + ' ' + x : x + ' ' + b); });
      R(G, PAIRS().map(p => p[0])).forEach(add);
      const opts = W4X.put(G, others, t);
      return { k: [t, opts.join(',')], answer: t, item: t, opts, show: lv >= 5 ? 1500 : 2000, two: 1, rev: others.includes(b + ' ' + a) ? 1 : 0, said: pr[1], same: 1, off: 0 };
    },
    itemOf() { return null; },
    /* tests/w4_levels.js: less time, as long as it, a letter apart, two words, the pair turned round */
    hard(q) { return (3000 - q.show) / 500 + q.same + Math.min(2, q.off) * 1.5 + q.two * 3 + q.rev * 1.5; },
    async present(st) {
      const q = st.q;
      st.shown = false;
      const s = st.screen = ZX.thing(st, SCR_W, SCR_H, 5, 'item'); s.innerHTML = SCREEN_SVG;
      const w = st.wordEl = ZX.thing(st, 340, 110, 6, 'item'); Object.assign(w.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', visibility: 'hidden' });
      w.appendChild(enNode(q.answer, 92, 320, '#FFF4C8'));
      const c = st.cloud = ZX.thing(st, 380, 150, 7, 'item'); c.innerHTML = CLOUD_SVG; c.style.visibility = 'hidden';
      this.cards(st);                                   /* the five cards are there from the start, hidden until the cloud covers the word */
      this.place(st);
      K.pop(st, s);
      K.say(st, '看好了！');
      this.flash(st);
    },
    /* the word shows for its time (the tests' 'wait' cuts it short), the cloud covers it, then the five cards come */
    async flash(st) {
      const q = st.q, wk = st.G.actors.wukong;
      await this.hold(st, fast() ? 300 : 700);
      if (!Session.alive(st) || st.frozen) return;
      if (wk) wk.react('eyes');
      st.wordEl.style.visibility = ''; Sfx.sparkle(); st.shown = true;
      st.scope.anim(st.wordEl, [{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 260, easing: EASE.pop });
      await this.hold(st, q.show);
      if (!Session.alive(st) || st.frozen) return;
      await this.cover(st);
      if (!Session.alive(st) || st.frozen) return;
      st.cardsOn = true;
      st.cards.forEach((d, i) => { d.style.visibility = ''; st.scope.anim(d, [{ transform: 'scale(0) rotate(-8deg)' }, { transform: 'scale(1)' }], { duration: 320, delay: 60 * i, easing: EASE.pop, fill: 'backwards' }); });
      K.say(st, '刚才是哪个？');
    },
    async cover(st) {
      const c = st.cloud; c.style.visibility = ''; Sfx.whoosh(0.3);
      await st.scope.anim(c, [{ transform: 'translateY(-60px) scale(.7)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1 }], { duration: 360, easing: EASE.pop, fill: 'none' });
      st.covered = true;
    },
    cards(st) {
      const q = st.q, two = q.two, cw = this.cw(st);
      st.opts = q.opts.slice();
      st.cards = q.opts.map((t, i) => {
        const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; st.els.push(d);
        d.appendChild(enNode(t, two ? 60 : 68, cw[0] - 30)); d.style.visibility = 'hidden';
        K.reg(st, 'card' + i, d, {});
        return d;
      });
      this.place(st);
    },
    hold(st, ms) { return new Promise(res => { st.skip = res; W4X.tick(st, ms).then(res); }); },
    /* card sizes: one word / two words, landscape / portrait */
    cw(st) { const two = st.q.two; return L() ? (two ? [284, 104] : [164, 118]) : (two ? [300, 104] : [196, 124]); },
    spots(st) {
      const two = st.q.two, [w, h] = this.cw(st), g = 18;
      if (L()) return two ? [[512 - w - g, 366], [512, 366], [512 + w + g, 366], [512 - (w + g) / 2, 366 + h + g], [512 + (w + g) / 2, 366 + h + g]] : [0, 1, 2, 3, 4].map(i => [512 + (i - 2) * (w + 14), 420]);
      return two ? [[352 - (w + g) / 2, 470], [352 + (w + g) / 2, 470], [352 - (w + g) / 2, 470 + h + g], [352 + (w + g) / 2, 470 + h + g], [352, 470 + 2 * (h + g)]]
        : [[352 - w - g, 500], [352, 500], [352 + w + g, 500], [352 - (w + g) / 2, 500 + h + g], [352 + (w + g) / 2, 500 + h + g]];
    },
    place(st) {
      if (!st.screen) return;
      const sx = L() ? 512 - SCR_W / 2 : 352 - SCR_W / 2, sy = L() ? 84 : 176;
      place(st.screen, sx, sy, SCR_W, SCR_H);
      place(st.wordEl, sx + 40, sy + 54, 340, 110);
      place(st.cloud, sx + 20, sy + 34, 380, 150);
      if (st.cards) { const [w, h] = this.cw(st), S = this.spots(st); st.cards.forEach((d, i) => place(d, Math.round(S[i][0] - w / 2), Math.round(S[i][1] - h / 2), w, h)); }
      if (st.diffEl) this.placeDiff(st);
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 96 : 84, L() ? 698 : 1016, L() ? 200 : 150); },
    onGesture(st, name, p) {
      if (st.submitted) return false;
      if (name === 'wait') { if (st.skip) st.skip(); return 'free'; }
      if (name !== 'tap' || !st.cardsOn) return false;
      const i = K.cardIndex(p.id); if (i < 0) return false;
      st.tapped = i; Sfx.tap(); st.frozen = true;
      Session.submit(st, st.opts[i]);
      return 'ok';
    },
    /* the word is said, then a short sentence with it ("see! I see a cat."); two words: their sentence */
    async reveal(st) {
      const q = st.q, e = st.cards[st.opts.indexOf(q.answer)];
      K.hop(st, e, 30); Sfx.reveal();
      this.uncover(st);
      const wk = st.G.actors.wukong; if (wk) wk.react('eyes');
      if (!q.two) Voice.say(q.answer + '!', { tag: 'summary' });
      if (q.said) Voice.say(q.said, { tag: 'summary' });
      this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    uncover(st) { if (st.cloud && st.covered) { st.covered = false; st.scope.anim(st.cloud, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-50px) scale(.8)', opacity: 0 }], { duration: 360, fill: 'forwards' }); } },
    /* the factual line: the word(s) he picked, said */
    wrongLine() { return null; },
    async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); String(ans).split(' ').forEach(w => Voice.say(w, { tag: 'wrong' })); await st.scope.wait(900); },
    /* explain: 1 his card in blue; 2 the cloud goes, the word is back - and under it his word, the letters that differ blue (a
       beat); 3 the right card in gold, said */
    async explain(st, ans) {
      const q = st.q, eC = st.cards[st.tapped], eR = st.cards[st.opts.indexOf(q.answer)];
      W4X.exChosen(st, eC, null);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => { this.uncover(st); st.wordEl.style.visibility = ''; this.diff(st, ans); }, 900);
      await W4X.exRight(st, eR, null, q.answer.split(' '), false);
    },
    /* his word under the screen, its letters that are not the shown word's (place by place) in blue */
    diff(st, ans) {
      const t = st.q.answer.split(' '), a = String(ans).split(' '), d = st.diffEl = ZX.thing(st, 10, 10, 61, 'item'); d.dataset.ex = 'diff';
      Object.assign(d.style, { display: 'flex', gap: '26px', alignItems: 'flex-end', padding: '6px 16px', background: '#FFFDF4', borderRadius: '16px', boxShadow: '0 0 0 4px ' + EX_BLUE, pointerEvents: 'none' });
      a.forEach((w, j) => { const r = t[j] || ''; d.appendChild(Glyph.wordC(w, st.q.two ? 44 : 50, Array.from(w).map((c, i) => (c === r[i] ? INK : EX_BLUE)))); });
      this.placeDiff(st); K.pop(st, d);
    },
    /* under the screen (one word, landscape), beside it (two words, landscape), over it (portrait): never on a card */
    placeDiff(st) {
      const d = st.diffEl, s = box(st.screen); d.style.width = d.style.height = 'auto';
      const r = d.getBoundingClientRect(), k = Stage.s || 1, w = r.width / k, h = r.height / k;
      let x = s.x + s.w / 2 - w / 2, y = s.y + s.h + 4;
      if (!L()) y = s.y - h - 6;
      else if (st.q.two) { x = s.x + s.w + 12; y = s.y + s.h / 2 - h / 2; if (x + w > Stage.W - 8) x = s.x - w - 12; }
      place(d, Math.round(x), Math.round(y)); d.style.width = d.style.height = 'auto';
    },
    /* the 2nd hint (real help): the cloud parts and the word shows again for half a second */
    async gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone || !st.covered) return; st.hintDone = true;
      st.cloud.style.visibility = 'hidden'; Sfx.sparkle();
      await W4X.tick(st, 500);
      if (Session.alive(st) && !st.submitted) st.cloud.style.visibility = '';
    },
    next(st, strat) {
      if (!st.cardsOn) return W4X.WAIT;
      const i = strat === 'wrong' ? st.opts.findIndex(w => w !== st.q.answer) : st.opts.indexOf(st.q.answer);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    find(st, id) { return id === 'wait' ? st.screen : (st.map && st.map[id]) || null; },
    workEls(st) { return st.cardsOn ? st.cards : []; },
    cleanup(st) { st.frozen = true; },
    snap(st) { return { opts: st.cardsOn ? st.opts : null, shown: !!st.shown }; },
    iconNode() { const d = el('div'); d.innerHTML = '<svg viewBox="0 0 60 60" width="100%" height="100%"><rect x="4" y="14" width="52" height="36" rx="9" fill="#F5B324" stroke="#2B2118" stroke-width="3.5"/><rect x="10" y="20" width="40" height="24" rx="5" fill="#1F4E58"/><ellipse cx="21" cy="11" rx="7" ry="4" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><ellipse cx="39" cy="11" rx="7" ry="4" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><circle cx="21" cy="11" r="2.4" fill="#FFB400"/><circle cx="39" cy="11" r="2.4" fill="#FFB400"/></svg>'; Object.assign(d.style, { width: '80%', height: '80%' }); d.appendChild(enNode('see', 16, 30, '#FFF4C8')).style.cssText = 'position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);display:flex'; d.style.position = 'relative'; return d; },
  };

  /* ---------------------------------------------------------------- ④-4 挑战 「归！」 送字回家 (sort by meaning)
     Five little houses, a big round sign over each door: the sky (a cloud), the ground (a hill and grass), animals (a puppy),
     the body (a hand and an eye), doing (a running boy), the family (three heads: only once the child knows a family character). A card
     in the middle (read, not said: a tap says it and that question earns no star). Drag it into its house, or tap the house.
     Every character has one kind (KIND4); the disputable ones are not asked. Levels: 1 the card's picture beside it; 2 the
     character alone; 3 a character with a look-alike of another kind (日/目, 手/牛, 田/日): read it carefully; 4 a word of two
     characters (金鱼 -> animals, 雪山 -> the ground); 5 two cards, each to its house (both right). Random: 1 in 5 (5: 1 in 20). */
  const KZ = { sky: '天上', ground: '地上', animal: '动物', body: '身体', action: '动作', family: '家人' };
  const KEYS = Object.keys(KZ);
  const kindOf = c => KEYS.find(k => (W4D.kind[KZ[k]] || '').includes(c)) || null;
  const kindOfWord = w => { const x = W4D.kindWords.find(v => v[0] === w); return x ? KEYS.find(k => KZ[k] === x[1]) : kindOf(w); };
  const kindLine = k => W4D.kindLine[KZ[k]];
  const charPic = c => { const o = ITEM[c] && ITEM[c].obj; return o && (o[0] === '@' || W4X.hasPic(o)) ? o : null; };
  const itemPic = t => (t.length === 1 ? charPic(t) : zhPic(t));
  /* the signs on the doors (W4R1N-08): >= 100 px, pictures a 4-year-old names at once - the sky (a cloud in the blue) and the
     ground (a hill on the grass) drawn; animals = a puppy's face, the body = a hand and an eye, doing = the running boy (the
     app's own pictures); the family = three heads (only once a family character is known) */
  const KIND_ICON = {
    sky: '<circle cx="30" cy="30" r="27" fill="#BFE6FF"/><path d="M15 41C9 41 7 35 10 31C12 28 16 27 19 29C20 22 26 18 32 19C38 19 42 23 43 28C48 27 53 31 52 36C52 39 49 41 46 41Z" fill="#fff" stroke="#2B2118" stroke-width="2.6" stroke-linejoin="round"/>',
    ground: '<circle cx="30" cy="30" r="27" fill="#E4F4D2"/><path d="M9 44L24 17L33 31L39 23L52 44Z" fill="#9AA4B0" stroke="#2B2118" stroke-width="2.6" stroke-linejoin="round"/><path d="M19 26L24 17L29 25Z" fill="#fff"/><path d="M3 44C14 37 46 37 57 44V58H3Z" fill="#5CC46E" stroke="#2B2118" stroke-width="2.6"/>',
    family: '<circle cx="30" cy="30" r="27" fill="#FFF1C4"/><g fill="#2B2118"><circle cx="18" cy="20" r="6"/><path d="M9 47C9 31 27 31 27 47Z"/><circle cx="42" cy="20" r="6"/><path d="M33 47C33 31 51 31 51 47Z"/><circle cx="30" cy="32" r="4.5"/><path d="M23.5 49C23.5 38 36.5 38 36.5 49Z"/></g>',
  };
  const SIGN_BG = { sky: '#BFE6FF', ground: '#E4F4D2', animal: '#FFE9CC', body: '#FFE3EA', action: '#E8E2FF', family: '#FFF1C4' };
  /* a round sign: size in px, or null to fill its parent */
  const signNode = (k, size) => {
    const d = el('div', ''), wh = size ? size + 'px' : '100%';
    Object.assign(d.style, { position: 'relative', width: wh, height: wh, borderRadius: '50%', overflow: 'hidden', background: SIGN_BG[k], pointerEvents: 'none', flex: 'none' });
    const pic = (o, css) => { const i = img(OBJURL(o), '', d); Object.assign(i.style, { position: 'absolute', objectFit: 'contain', pointerEvents: 'none' }, css); return i; };
    if (KIND_ICON[k]) d.innerHTML = '<svg viewBox="3 3 54 54" width="100%" height="100%" style="display:block">' + KIND_ICON[k] + '</svg>';
    else if (k === 'animal') pic('dog', { width: '128%', height: '160%', left: '-14%', top: '4%', objectFit: 'cover', objectPosition: '50% 0' });
    else if (k === 'body') { pic('hand', { width: '60%', height: '60%', left: '6%', top: '34%' }); pic('eye', { width: '58%', height: '58%', left: '38%', top: '10%' }); }
    else if (k === 'action') pic('run', { width: '88%', height: '88%', left: '6%', top: '6%' });
    const rim = el('div', '', d); Object.assign(rim.style, { position: 'absolute', inset: '0', borderRadius: '50%', boxShadow: 'inset 0 0 0 ' + (size && size < 70 ? 3 : 5) + 'px #2B2118', pointerEvents: 'none' });
    return d;
  };
  const HOUSE_COL = { sky: ['#4FA3E8', '#EAF6FF'], ground: ['#3FAE4A', '#F1F8E4'], animal: ['#C8743A', '#FFF3E2'], body: ['#E86A8E', '#FFF0F4'], action: ['#7A5CD6', '#F2EEFF'], family: ['#F59A23', '#FFF7E2'] };
  /* a house: roof, wall, a little door - and the big sign over the door (62 % of the house's width: >= 105 px) */
  const house = (d, k) => {
    d.innerHTML = '<svg viewBox="0 0 170 210" width="100%" height="100%" style="position:absolute;inset:0"><path d="M6 86L85 8L164 86Z" fill="' + HOUSE_COL[k][0] + '" stroke="#2B2118" stroke-width="6" stroke-linejoin="round"/>'
      + '<rect x="16" y="78" width="138" height="126" rx="10" fill="' + HOUSE_COL[k][1] + '" stroke="#2B2118" stroke-width="6"/><path d="M68 204V190C68 178 102 178 102 190V204Z" fill="#B07A45" stroke="#2B2118" stroke-width="5"/></svg>';
    const w = el('div', '', d); Object.assign(w.style, { position: 'absolute', left: '50%', top: '57%', width: '62%', aspectRatio: '1', transform: 'translate(-50%,-50%)', pointerEvents: 'none' });
    w.appendChild(signNode(k, null));
    return d;
  };
  const HW = () => (L() ? 168 : 180), HH = () => Math.round(HW() * 210 / 170);
  const HOUSES = () => (L() ? [0, 1, 2, 3, 4].map(i => [512 + (i - 2) * 182, 388]) : [[130, 530], [352, 530], [574, 530], [241, 776], [463, 776]]);
  const Sort = {
    rule: 'sort-by-meaning', kind0: 'quiz', verb: '归！', intro: '送字回家！', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), mine = poolOf(G, 'zh', false), chars = kn.filter(c => kindOf(c));
      const fam = chars.some(c => kindOf(c) === 'family');
      const lookOther = c => (LOOK[c] || '').split('').filter(x => kn.includes(x) && kindOf(x) && kindOf(x) !== kindOf(c) && !(HOLDS[c] || '').includes(x));
      let items, kinds;
      const words = lv === 4 ? W4D.kindWords.map(v => v[0]).filter(w => Array.from(w).every(c => kn.includes(c))) : [];
      if (words.length) {
        const own = mine.filter(k => words.some(w => w.includes(k)));
        const X = own.length ? W4X.pick(G, own) : null, c = X ? words.filter(w => w.includes(X)) : words;
        const w = bagFrom(G, 'kw' + (X || ''), c);
        items = [w]; kinds = [kindOfWord(w)];
      } else {
        let pool = lv <= 1 ? chars.filter(charPic) : lv === 3 ? chars.filter(c => lookOther(c).length) : chars;
        if (!pool.length) pool = chars;
        const X = W4X.pick(G, pool);
        items = [X];
        if (lv >= 5) { const Y = G.rng.pick(pool.filter(c => c !== X && kindOf(c) !== kindOf(X)).concat(chars.filter(c => c !== X && kindOf(c) !== kindOf(X))).slice(0, 12)); items.push(Y); }
        kinds = items.map(kindOf);
      }
      const avail = KEYS.filter(k => k !== 'family' || fam || kinds.includes(k));
      const others = R(G, avail.filter(k => !kinds.includes(k))).slice(0, 5 - kinds.length);
      const opts = W4X.put(G, others.concat(kinds.slice(1)), kinds[0]), two = kinds.length > 1;
      const first = Array.from(items[0]).find(c => mine.includes(c)) || Array.from(items[0]).find(c => kindOf(c)) || items[0][0];
      return { k: [items.join(','), opts.join(',')], items, kinds, answer: two ? 'all' : kinds[0], seq: two ? kinds.slice() : null, item: first, opts,
        pic: lv <= 1 && itemPic(items[0]) ? 1 : 0, look: items[0].length === 1 && lookOther(items[0]).length ? 1 : 0, word: items[0].length > 1 ? 1 : 0, two: two ? 1 : 0 };
    },
    /* tests/w4_levels.js: the picture gone, a look-alike of another kind, a word, two cards */
    hard(q) { return (1 - q.pic) * 1.5 + q.look * 1.5 + q.word * 2 + q.two * 4; },
    itemOf(st) { return W4X.own(st, st.q.item); },
    itemsOf(st) { const mine = poolOf(st.G, 'zh', false), q = st.q; return Array.from(new Set(q.items.join(''))).filter(c => c !== q.item && (q.items.length > 1 ? kindOf(c) : mine.includes(c))); },
    readCard(st, t, j) {
      const d = ZX.thing(st, 10, 10, 8, 'card'); d.style.flexDirection = 'row'; d.style.gap = '0px';
      Array.from(t).forEach(c => d.appendChild(Glyph.zh(c, t.length > 1 ? 92 : 112)));
      d._w = t.length > 1 ? 220 : 150; d._h = t.length > 1 ? 140 : 150;
      K.reg(st, j ? 'read1' : 'read', d, { drag: true, drops: () => st.cards.map((c, i) => ({ id: 'card' + i, rect: () => box(c) })) });
      K.pop(st, d, 120 * j);
      return d;
    },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.done = [];
      st.opts = q.opts.slice();
      st.cards = q.opts.map((k, i) => { const d = house(ZX.thing(st, HW(), HH(), 5, 'item'), k); K.reg(st, 'card' + i, d, {}); K.pop(st, d, 60 * i); return d; });
      st.reads = q.items.map((t, j) => this.readCard(st, t, j));
      st.readEl = st.reads[0]; st.readText = q.items[0];
      if (q.pic) st.pics = [this.picCard(st, 0)];
      this.place(st); this.mark(st);
      K.say(st, q.two ? '送它们回家！' : '送它回家！');
    },
    picCard(st, j) {
      const p = itemPic(st.q.items[j]); if (!p) return null;
      const d = ZX.thing(st, 120, 120, 7, 'card'); d.classList.add('pic'); d.style.pointerEvents = 'none'; d.appendChild(W4X.pic(p, 100)); d._j = j; K.pop(st, d, 150);
      return d;
    },
    readSpot(st, j) { const n = st.reads.length, x = (L() ? 512 : 352) + (n > 1 ? (j ? 1 : -1) * (L() ? 120 : 110) : 0); return [x, L() ? 180 : 290]; },
    place(st) {
      if (!st.cards) return;
      const H = HOUSES(), w = HW(), h = HH();
      st.cards.forEach((d, i) => place(d, H[i][0] - w / 2, H[i][1] - h / 2, w, h));
      st.reads.forEach((d, j) => { if (st.done.includes(j)) { this.atHouse(st, j); return; } const [x, y] = this.readSpot(st, j); place(d, x - d._w / 2, y - d._h / 2, d._w, d._h); });
      (st.pics || []).forEach(p => { if (!p) return; const r = box(st.reads[p._j]); place(p, r.x + r.w + 16, r.y + r.h / 2 - 60, 120, 120); });
    },
    /* a card that is home sits small on its house's roof */
    atHouse(st, j) { const d = st.reads[j], hb = box(st.cards[st.opts.indexOf(st.q.kinds[j])]); place(d, hb.x + hb.w / 2 - d._w / 2, hb.y - d._h * 0.5, d._w, d._h); d.style.transform = 'scale(.5)'; },
    mark(st) { st.reads.forEach((d, j) => { d.style.boxShadow = st.reads.length > 1 && j === st.ix && !st.done.includes(j) ? '0 0 0 5px #2B2118, 0 0 0 11px #FFE14A' : ''; }); },
    decor(G) { ZBase.decor.call(this, G); },
    onGesture(st, name, p) {
      if (st.submitted || st.busy) return false;
      const rj = p.id === 'read' ? 0 : p.id === 'read1' ? 1 : -1;
      if (name === 'tap' && rj >= 0) { if (st.done.includes(rj)) return false; st.readEl = st.reads[rj]; st.readText = st.q.items[rj]; W4X.peek(st); return 'ok'; }
      let j = st.ix, i = -1;
      if (name === 'drop' && rj >= 0) { if (st.done.includes(rj)) return false; j = rj; i = K.cardIndex(p.to); settle(st.reads[j]); }
      else if (name === 'tap') i = K.cardIndex(p.id);
      if (i < 0) return false;
      const q = st.q, want = q.kinds[j];
      st.tapped = i; st.cur = j; Sfx.tap();
      if (st.opts[i] !== want) { Session.submit(st, st.opts[i]); return 'ok'; }
      st.done.push(j);
      if (st.done.length < q.items.length) {             /* the first of two goes home; the other one is next */
        st.busy = true; st.ix = q.items.findIndex((_, x) => !st.done.includes(x)); this.mark(st);
        this.goHome(st, j).then(() => { st.busy = false; });
        Sfx.place(); return 'ok';
      }
      Session.submit(st, q.two ? 'all' : want);
      return 'ok';
    },
    async goHome(st, j) {
      const d = st.reads[j], hb = box(st.cards[st.opts.indexOf(st.q.kinds[j])]);
      settle(d); d.style.boxShadow = '';
      (st.pics || []).forEach(p => { if (p && p._j === j) p.style.visibility = 'hidden'; });
      await K.flyTo(st, d, hb.x + hb.w / 2 - d._w / 2, hb.y - d._h * 0.5, 360, 50, 0.5);
      K.hop(st, st.cards[st.opts.indexOf(st.q.kinds[j])], 14);
    },
    async reveal(st) {
      const q = st.q, j = st.cur || 0, e = st.cards[st.opts.indexOf(q.kinds[j])];
      await this.goHome(st, j);
      if (!Session.alive(st)) return;
      Sfx.reveal(); const b = box(e); Fx.burst(b.x + b.w / 2, b.y + 40, { n: 14, dist: 90 });
      const wk = st.G.actors.wukong; if (wk) wk.react();
      Voice.say(kindLine(q.kinds[j]), { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    wrongLine(st) { return W4X.thisIs(st.q.items[st.cur || 0]); },
    async feedback(st) {
      unmove(st.reads[st.cur || 0]); this.place(st); K.wiggle(st, st.cards[st.tapped]);
      Voice.say(this.wrongLine(st), { tag: 'wrong' });
      await st.scope.wait(900);
    },
    /* explain: 1 the house he chose in blue - the card is back out of its door, its picture beside it ("这是牙" was just said);
       2 the card's picture and the right door's sign side by side (a beat); 3 the right house in gold: "这是身体" */
    async explain(st) {
      const q = st.q, j = st.cur || 0, want = q.kinds[j], eC = st.cards[st.tapped], eR = st.cards[st.opts.indexOf(want)], card = st.reads[j], pic = itemPic(q.items[j]);
      (st.pics || []).forEach(p => { if (p) p.style.visibility = 'hidden'; });
      st.reads.forEach((r, x) => { if (x !== j && !st.done.includes(x)) r.style.visibility = 'hidden'; });      /* level 5: the other card steps aside */
      W4X.exChosen(st, eC, null);
      const d = this.pair(st, card, pic);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => this.pairAdd(st, d, want), 850);
      await W4X.exRight(st, eR, want, [kindLine(want)], false);
    },
    /* beside the card, on its free side: first the card's picture (blue), then -> the right door's sign (the panel goes gold) */
    pair(st, card, pic) {
      const c = box(card), busy = (st.cards || []).concat((st.reads || []).filter(r => r !== card && r.style.visibility !== 'hidden')).map(e => vbox(e)).concat(Array.from(Stage.el.querySelectorAll('[data-ex]')).map(e => vbox(e)), [{ x: 0, y: 0, w: 250, h: 108 }, { x: Stage.W - 236, y: 0, w: 236, h: 84 }]);
      const free = r => r.x >= 8 && r.y >= 8 && r.x + r.w <= Stage.W - 8 && r.y + r.h <= Stage.H - 8 && busy.every(b => r.x + r.w + 6 <= b.x || b.x + b.w + 6 <= r.x || r.y + r.h + 6 <= b.y || b.y + b.h + 6 <= r.y);
      let at = null, s = 84;
      for (const size of [84, 64, 52]) {
        const W = 2 * size + 40 + 48, H = size + 18, g = 18;
        at = [[c.x - W - g, c.y + c.h / 2 - H / 2], [c.x + c.w + g, c.y + c.h / 2 - H / 2], [c.x + c.w / 2 - W / 2, c.y + c.h + g], [c.x + c.w / 2 - W / 2, c.y - H - g]].map(([x, y]) => ({ x, y, w: W, h: H })).find(free);
        if (at) { s = size; break; }
      }
      const d = ZX.thing(st, 10, 10, 61, 'item'); d.dataset.ex = 'pic-chosen'; d._s = s;
      Object.assign(d.style, { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: '#FFFDF4', borderRadius: '20px', boxShadow: '0 0 0 4px ' + EX_BLUE + ', 0 6px 0 rgba(43,33,24,.2)', pointerEvents: 'none' });
      if (pic) d.appendChild(W4X.pic(pic, s)); else d.appendChild(Glyph.zh(st.q.items[st.cur || 0][0], s));
      if (!at) at = { x: clamp(c.x + c.w / 2 - (2 * s + 88) / 2, 8, Stage.W - 2 * s - 96), y: c.y + c.h + 12 };
      const left = at.x + at.w <= c.x;               /* left of the card: the picture stays next to the card, the sign comes on the far side */
      d._left = left; place(d, left ? at.x + at.w - s - 28 : at.x, at.y); d.style.width = d.style.height = 'auto';
      st.stepDirty = true; K.pop(st, d);
      return d;
    },
    pairAdd(st, d, want) {
      const s = d._s, eq = el('div', ''); eq.innerHTML = '<svg viewBox="0 0 40 40" width="40" height="40"><path d="M8 20H32M24 12L32 20L24 28" fill="none" stroke="#B07800" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const ic = signNode(want, s);
      if (d._left) { eq.firstChild.style.transform = 'scaleX(-1)'; d.insertBefore(eq, d.firstChild); d.insertBefore(ic, d.firstChild); place(d, parseFloat(d.style.left) - s - 50 - 10, parseFloat(d.style.top)); d.style.width = d.style.height = 'auto'; }
      else { d.appendChild(eq); d.appendChild(ic); }
      d.dataset.ex = 'pair'; d.style.boxShadow = '0 0 0 4px ' + EX_GOLD + ', 0 6px 0 rgba(43,33,24,.2)';
      st.scope.anim(ic, [{ transform: 'scale(.3)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 320, easing: EASE.pop });
    },
    /* the 2nd hint (real help): the card's picture beside it; level 1 has it already, a card without a picture gets none */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone || !st.reads) return; st.hintDone = true;
      if (st.q.pic) { st.noHelp = true; return; }
      const p = this.picCard(st, st.ix || 0); if (!p) { st.noHelp = true; return; }
      (st.pics = st.pics || []).push(p); this.place(st); Sfx.sparkle();
    },
    next(st, strat) {
      if (!st.cards || st.busy) return null;
      const q = st.q, want = q.kinds[st.ix || 0], i = strat === 'wrong' ? st.opts.findIndex(k => !q.kinds.includes(k)) : st.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).concat((st.reads || []).filter((_, j) => !(st.done || []).includes(j))); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() { const d = house(el('div'), 'animal'); Object.assign(d.style, { position: 'relative', width: '64%', height: '79%' }); return d; },
  };

  w4Island('xiyou4', [Peach, Flash, Sort]);
})();
