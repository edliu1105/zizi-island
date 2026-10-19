/* ================================================================ 神笔海 ⑤ 葫芦娃 · 葫芦洞 (huluwa4): 多 少 开 关 去 (docs/W4-DESIGN.md §6 ⑤)
   认字 「关！」只留一盏灯 (all-but-one) · 写字 开 关 (W4X.Write) · 英文 「配！」中英对对碰 (word-to-character) ·
   挑战 「跷！」跷跷板 (opposite-balance). Built like the template src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  /* lines said through a variable (tools/voice_lines.py records them): the lamps' questions and the explanation's line for
     each of the island's characters */
  W4X.lines(['只留多！', '只留少！', '只留开！', '只留关！', '只留去！',
    '留多和少！', '留多和开！', '留多和关！', '留多和去！', '留少和开！', '留少和关！', '留少和去！', '留开和关！', '留开和去！', '留关和去！',
    '它就是多', '它就是少', '它就是开', '它就是关', '它就是去']);
  const vbox = e => { const r = e.getBoundingClientRect(), s = Stage.s || 1, a = Stage.toStage(r.left, r.top); return { x: a.x, y: a.y, w: r.width / s, h: r.height / s }; };
  const settle = e => { if (!e || !e.style.transform) return; const b = box(e), v = vbox(e); e.style.transform = ''; e.getAnimations().forEach(a => a.cancel()); place(e, v.x + v.w / 2 - b.w / 2, v.y + v.h / 2 - b.h / 2); };
  const unmove = e => { if (!e) return; e.style.transform = ''; e.getAnimations().forEach(a => a.cancel()); };
  const R = (G, a) => G.rng.shuffle(a.slice());
  const charPic = c => { const o = ITEM[c] && ITEM[c].obj; return o && (o[0] === '@' || W4X.hasPic(o)) ? o : null; };
  /* a card of glyphs (characters or English words) */
  const glyphs = (t, h) => { const d = el('div', ''); Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Math.round(h * 0.3) + 'px', pointerEvents: 'none' });
    if (/[A-Za-z]/.test(t)) t.split(' ').forEach(w => d.appendChild(Glyph.word(w, h))); else Array.from(t).forEach(c => d.appendChild(Glyph.zh(c, h))); return d; };
  /* a free spot for an explanation panel (never on a target, a ring's element or the corner buttons) */
  const freeSpot = (st, w, h, cands, avoid) => {
    const busy = (avoid || []).map(e => vbox(e)).concat(Array.from(Stage.el.querySelectorAll('[data-ex]')).map(e => vbox(e)), [{ x: 0, y: 0, w: 250, h: 108 }, { x: Stage.W - 236, y: 0, w: 236, h: 84 }]);
    const ok = r => r.x >= 8 && r.y >= 8 && r.x + r.w <= Stage.W - 8 && r.y + r.h <= Stage.H - 8 && busy.every(b => r.x + r.w + 6 <= b.x || b.x + b.w + 6 <= r.x || r.y + r.h + 6 <= b.y || b.y + b.h + 6 <= r.y);
    return cands.map(([x, y]) => ({ x, y, w, h })).find(ok) || null;
  };
  const panel = (st, nodes, border) => {
    const d = ZX.thing(st, 10, 10, 61, 'item'); d.dataset.ex = 'pair';
    Object.assign(d.style, { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: '#FFFDF4', borderRadius: '20px', boxShadow: '0 0 0 4px ' + (border || EX_GOLD) + ', 0 6px 0 rgba(43,33,24,.2)', pointerEvents: 'none' });
    nodes.forEach((n, i) => { if (i) { const a = el('div', '', d); a.innerHTML = '<svg viewBox="0 0 40 40" width="38" height="38"><path d="M6 20H34M13 12L5 20L13 28M27 12L35 20L27 28" fill="none" stroke="#B07800" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'; } d.appendChild(n); });
    d.style.width = d.style.height = 'auto';         /* its own size (measured before it is placed) */
    return d;
  };
  const picNode = (o, s) => (o ? W4X.pic(o, s) : null);

  /* ---------------------------------------------------------------- ⑤-1 认字 「关！」 只留一盏灯 (every lamp that is NOT X off)
     Five gourd lamps glow in the cave, a character on each. A tap turns a lamp off; turn off every lamp that is not X and leave
     X alight. Turning X off ends the question at once. Every tap is a "this is not X" judgement - each lamp has to be read.
     Levels: 1 X's picture on the task card; 2 heard only; 3 look-alikes (开/关/天, 少/小, 去/云) and an old character; 4 two lamps
     to leave ("留开和关！", three to turn off; two old characters); 5 six lamps, three old characters. Turning lamps off at random
     leaves the right ones alight 1 time in 5 (level 4: 1 in 10, level 5: 1 in 6). */
  const GOURD = 'M75 30C59 30 50 41 50 54C50 65 56 73 62 79C31 89 14 112 14 139C14 176 42 204 75 204C108 204 136 176 136 139C136 112 119 89 88 79C94 73 100 65 100 54C100 41 91 30 75 30Z';
  const lampSvg = on => '<svg viewBox="0 0 150 210" width="100%" height="100%"><path d="M75 0V20" stroke="#5B3A1E" stroke-width="5"/>'
    + '<path d="' + GOURD + '" fill="' + (on ? '#FFD45A' : '#8E877C') + '" stroke="#2B2118" stroke-width="6"/>'
    + '<ellipse cx="75" cy="146" rx="46" ry="44" fill="' + (on ? '#FFF2B0' : '#A39C90') + '"/><ellipse cx="66" cy="50" rx="8" ry="10" fill="' + (on ? '#FFF2B0' : '#A39C90') + '"/>'
    + '<rect x="60" y="16" width="30" height="16" rx="6" fill="#A0522D" stroke="#2B2118" stroke-width="4"/><path d="M90 22C102 12 116 16 118 24C108 30 98 28 90 22Z" fill="#46C27A" stroke="#2B2118" stroke-width="3"/></svg>';
  const LAMP = n => (L() ? (n > 5 ? [136, 196] : [150, 210]) : (n > 5 ? [150, 210] : [160, 224]));
  const LAMPS = n => {
    if (L()) { const [w] = LAMP(n), g = n > 5 ? 16 : 18; return Array.from({ length: n }, (_, i) => [512 + (i - (n - 1) / 2) * (w + g), 342]); }      /* room above for the explanation's pictures */
    return n > 5 ? [[140, 420], [352, 420], [564, 420], [140, 680], [352, 680], [564, 680]] : [[140, 420], [352, 420], [564, 420], [246, 680], [458, 680]];
  };
  const LAMP_ICON = '<svg viewBox="0 0 150 210" width="100%" height="100%"><path d="' + GOURD + '" fill="#FFD45A" stroke="#2B2118" stroke-width="8"/><ellipse cx="75" cy="146" rx="46" ry="44" fill="#FFF2B0"/><rect x="60" y="16" width="30" height="16" rx="6" fill="#A0522D" stroke="#2B2118" stroke-width="5"/></svg>';
  const Lamps = {
    rule: 'all-but-one', verb: '关！', intro: '关灯，只留它！', props: [],
    gen(G, o) {
      const lv = o.level, n = lv >= 5 ? 6 : 5, pool = poolOf(G, 'zh', false), X = W4X.pick(G, pool), opts = W4X.opts(G, lv, X, n);
      let keep = [X];
      if (lv === 4) {                                   /* two to leave alight: an island character already among the five, else one put in */
        const Y = opts.find(k => k !== X && pool.includes(k)) || G.rng.pick(pool.filter(k => k !== X));
        if (!opts.includes(Y)) opts[opts.findIndex(k => k !== X)] = Y;
        keep = [X, Y];                                  /* X first: its place comes from the position bag (balanced) */
      }
      const lk = keep.flatMap(k => (LOOK[k] || '').split(''));
      return { k: [keep.join(''), opts.join('')], answer: keep.length > 1 ? 'all' : X, seq: keep.length > 1 ? keep.slice() : null, item: X, keep, opts, n, pic: lv <= 1 ? 1 : 0,
        look: opts.filter(k => !keep.includes(k) && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: the picture gone, look-alikes, old characters, two to leave, six lamps */
    hard(q) { return (1 - q.pic) + q.look * 0.8 + q.rev * 0.8 + (q.keep.length - 1) * 2 + (q.n - 5) * 2; },
    itemOf(st) { return st.q.item; },
    itemsOf(st) { return st.q.keep.filter(k => k !== st.q.item); },
    /* right: every lamp that is not X is off (the answer is the state of the lamps, not one lamp) */
    evaluate(st, ans) { return ans === 'only-x-alight'; },
    async present(st) {
      const q = st.q;
      for (const k of q.keep) { await ZX.meet(st, k); if (!Session.alive(st)) return; }
      st.opts = q.opts.slice(); st.on = st.opts.map(() => true);
      st.lamps = st.cards = q.opts.map((k, i) => { const d = ZX.thing(st, 150, 210, 6, 'item'); this.draw(st, d, k, true); K.reg(st, 'card' + i, d, {}); K.pop(st, d, 60 * i); return d; });
      this.place(st);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(charPic(q.item) || ITEM[q.item].obj), 'q'] : ['speaker', 'q']]);
      const two = poolOf(st.G, 'zh', false).filter(k => q.keep.includes(k));       /* said in the island's order: 留开和关！ */
      K.say(st, q.keep.length > 1 ? '留' + two[0] + '和' + two[1] + '！' : '只留' + q.item + '！');
    },
    draw(st, d, k, on) {
      d.innerHTML = lampSvg(on);
      const g = el('div', '', d); Object.assign(g.style, { position: 'absolute', left: '50%', top: '69%', transform: 'translate(-50%,-50%)', width: '62%', height: '44%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' });
      const s = Glyph.zh(k, 100, on ? INK : '#5E584F'); s.setAttribute('width', '100%'); s.setAttribute('height', '100%'); g.appendChild(s);
      d.style.filter = on ? 'drop-shadow(0 0 14px rgba(255,200,60,.95)) drop-shadow(0 0 4px rgba(255,236,150,.9))' : 'none';
    },
    setOn(st, i, on) { st.on[i] = on; this.draw(st, st.lamps[i], st.opts[i], on); },
    place(st) {
      if (!st.lamps) return;
      const n = st.lamps.length, [w, h] = LAMP(n), P = LAMPS(n);
      st.lamps.forEach((d, i) => place(d, P[i][0] - w / 2, P[i][1] - h / 2, w, h));
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || !st.on || !st.on[i]) return false;
      const q = st.q;
      this.setOn(st, i, false); Sfx.tap();
      st.scope.anim(st.lamps[i], [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0)' }], { duration: 360, fill: 'none' });
      if (q.keep.includes(st.opts[i])) { st.tapped = i; Session.submit(st, st.opts[i]); return 'ok'; }
      if (st.opts.every((k, j) => q.keep.includes(k) || !st.on[j])) Session.submit(st, 'only-x-alight');
      return 'ok';
    },
    /* the lamp(s) left alight shine, the thing comes out of it */
    async reveal(st) {
      const q = st.q, i = st.opts.indexOf(q.keep[0]), e = st.lamps[i], b = box(e);
      q.keep.forEach(k => { const d = st.lamps[st.opts.indexOf(k)]; K.hop(st, d, 26); st.scope.anim(d, [{ filter: d.style.filter }, { filter: 'drop-shadow(0 0 30px rgba(255,214,90,1)) drop-shadow(0 0 8px #fff)' }, { filter: d.style.filter }], { duration: 700 }); });
      Sfx.reveal();
      const h = st.G.actors.gourd2; if (h) h.react();
      await ZX.alive(st, q.item, b.x + b.w / 2, Math.max(120, b.y - 50), 140);
      q.keep.forEach(k => sayItem(k)); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the lamp he turned off - "这个是开" */
    async feedback(st, ans) { const e = st.lamps[st.tapped]; if (e) K.wiggle(st, e); Voice.say(W4X.thatIs(ans), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain (the one he turned off is the right one: no blue ring for it): 1 it lights again, gold, its picture: "它就是开";
       2 the others still alight in blue, each with its picture, go off one by one: "这些要关掉"; 3 only X is alight (a beat) */
    async explain(st, ans) {
      const q = st.q, i = st.tapped, e = st.lamps[i];
      this.setOn(st, i, true);
      await W4X.exRight(st, e, ans, ['它就是' + ans]);
      const rest = st.opts.map((k, j) => j).filter(j => st.on[j] && !q.keep.includes(st.opts[j]));
      rest.forEach(j => { EX.ring(st, st.lamps[j], 'chosen'); EX.picOver(st, st.lamps[j], st.opts[j], 'chosen', 80); });
      await EX.say(st, ['这些要关掉']);
      for (const j of rest) { this.setOn(st, j, false); Sfx.tap(); await EX.tick(st, 110); }
      await W4X.exBeat(st, () => { q.keep.forEach(k => { const j = st.opts.indexOf(k); if (!st.on[j]) this.setOn(st, j, true); if (j !== i) EX.outline(st, st.lamps[j]); }); }, 450);
    },
    /* the 2nd hint (real help): X's light flickers - the star goes */
    gestureHint(st, reteach) {
      if (reteach) { (st.lamps || []).forEach((c, i) => { if (st.on[i]) st.scope.timeout(() => K.hop(st, c, 16), 90 * i); }); return; }
      st.q.keep.forEach(k => { const d = st.lamps[st.opts.indexOf(k)]; if (!d) return; st.scope.anim(d, [{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-8deg) scale(1.08)' }, { transform: 'rotate(7deg) scale(1.08)' }, { transform: 'rotate(-4deg) scale(1.04)' }, { transform: 'rotate(0) scale(1)' }], { duration: 900, fill: 'none' }); });
      Sfx.sparkle();
    },
    next(st, strat) {
      if (!st.lamps) return null;
      const keep = st.q.keep, i = strat === 'wrong' ? st.opts.indexOf(keep[0]) : st.opts.findIndex((k, j) => st.on[j] && !keep.includes(k));
      return i >= 0 ? { g: 'tap', p: { id: 'card' + i } } : null;
    },
    workEls(st) { return (st.lamps || []).filter((_, i) => st.on && st.on[i]); },
    snap(st) { return { opts: st.opts || null, on: (st.on || []).filter(Boolean).length }; },
    iconNode() { const d = el('div'); d.innerHTML = LAMP_ICON; Object.assign(d.style, { width: '62%', height: '80%', filter: 'drop-shadow(0 0 6px rgba(255,200,60,.9))' }); return d; },
  };

  /* ---------------------------------------------------------------- ⑤-3 英文 「配！」 中英对对碰 (an English word = a character)
     An English word on the left (read, not said: a tap says it and that question earns no star), five characters on the right,
     a little wooden bridge between them. Tap the character that means the same - or drag the English card onto it: they meet
     on the bridge. BRIDGE4: both sides known (a child of 晨光海 only has big little up down go here). Levels: 1 the English card
     with its picture, the others unrelated; 2 the word alone; 3 the opposite among the others (big -> 小 too, up -> 下), or a
     number / colour of the same row; 4 the other way round: a character, five English words; 5 two English words, a character
     for each (both right). A random tap is right 1 time in 5 (5: 1 in 20). */
  const BR = () => W4D.bridge;
  const isIt = zh => ['就是', zh].join('');          /* "就是大": one recorded line a pair (BRIDGE4, tools/voice_lines.py) */
  const SAMECL = ['一二三四五六七八九十', '红黄蓝绿白'];
  const oppOf = c => { const p = W4D.opp.find(x => x.includes(c)); return p ? p.replace(c, '') : null; };
  const brPic = en => { const p = BR().find(x => x[0] === en); return p && p[2] && W4X.hasPic(p[2]) ? p[2] : null; };
  const confOf = (c, kn) => { const o = oppOf(c), out = []; if (o) out.push(o); SAMECL.forEach(g => { if (g.includes(c)) Array.from(g).forEach(x => { if (x !== c) out.push(x); }); }); (LOOK[c] || '').split('').forEach(x => out.push(x)); return out.filter(x => kn.includes(x) && !(HOLDS[c] || '').includes(x)); };
  const BRIDGE_SVG = '<svg viewBox="0 0 200 90" width="100%" height="100%"><path d="M4 70C40 18 160 18 196 70" fill="none" stroke="#7A4A22" stroke-width="16" stroke-linecap="round"/><path d="M4 70C40 18 160 18 196 70" fill="none" stroke="#C8874A" stroke-width="9" stroke-linecap="round" stroke-dasharray="14 5"/>'
    + '<path d="M12 46C46 0 154 0 188 46" fill="none" stroke="#7A4A22" stroke-width="5" stroke-linecap="round"/><g stroke="#7A4A22" stroke-width="5" stroke-linecap="round"><path d="M40 45V24M70 34V12M100 30V8M130 34V12M160 45V24"/></g></svg>';
  const Match = {
    rule: 'word-to-character', kind0: 'en', verb: '配！', intro: '英文配汉字！', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), pairs = BR().filter(p => kn.includes(p[1]));
      let pool = lv <= 1 ? pairs.filter(p => brPic(p[0])) : pairs; if (!pool.length) pool = pairs;
      const X = W4X.pick(G, pool.map(p => p[1])), P = pool.find(p => p[1] === X);
      if (lv === 4) {                                     /* the other way round: the character given, five English words */
        const others = [], add = w => { if (others.length < 4 && w !== P[0] && !others.includes(w)) others.push(w); };
        const op = oppOf(X), opEn = op && BR().find(p => p[1] === op);
        if (opEn) add(opEn[0]);
        BR().filter(p => SAMECL.some(g => g.includes(X) && g.includes(p[1]))).forEach(p => add(p[0]));
        R(G, BR().map(p => p[0])).forEach(add);
        const opts = W4X.put(G, others, P[0]);
        return { k: [X, opts.join(',')], given: [X], answer: P[0], item: X, opts, rev: 1, two: 0, pic: 0, conf: others.some(w => { const p = BR().find(x => x[0] === w); return p && confOf(X, BR().map(x => x[1])).includes(p[1]); }) ? 1 : 0 };
      }
      const two = lv >= 5;
      let Q = null;
      if (two) { const cand = pool.filter(p => p[1] !== X && p[1] !== oppOf(X)); Q = cand.length ? G.rng.pick(cand) : pool.find(p => p[1] !== X); }
      const ans = [X].concat(Q ? [Q[1]] : []), others = [], add = c => { if (others.length < 5 - ans.length && !ans.includes(c) && !others.includes(c) && kn.includes(c)) others.push(c); };
      const conf = ans.flatMap(c => confOf(c, kn));
      if (lv >= 3) R(G, conf).slice(0, 1).forEach(add);
      R(G, pairs.map(p => p[1]).filter(c => !conf.includes(c))).forEach(add);
      R(G, kn.filter(c => !conf.includes(c))).forEach(add);
      R(G, kn).forEach(add);
      const opts = W4X.put(G, others.concat(ans.slice(1)), X);
      return { k: [P[0] + (Q ? ',' + Q[0] : ''), opts.join('')], given: [P[0]].concat(Q ? [Q[0]] : []), zh: ans, answer: two ? 'all' : X, seq: two ? ans.slice() : null, item: X, opts,
        rev: 0, two: two ? 1 : 0, pic: lv <= 1 && brPic(P[0]) ? 1 : 0, conf: others.some(c => conf.includes(c)) ? 1 : 0 };
    },
    /* tests/w4_levels.js: the picture gone, a confusable among the others, the other way round, two at once */
    hard(q) { return (1 - q.pic) * 1.5 + q.conf * 1.5 + q.rev * 3 + q.two * 4; },
    itemOf(st) { return W4X.own(st, st.q.item); },
    itemsOf(st) { return (st.q.zh || []).slice(1); },
    enOf(st, j) { const q = st.q; return q.rev ? q.answer : q.given[j]; },
    zhOf(st, j) { const q = st.q; return q.rev ? q.given[0] : q.zh[j]; },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.done = [];
      st.bridge = ZX.thing(st, 200, 90, 4, 'item'); st.bridge.innerHTML = BRIDGE_SVG;
      st.reads = q.given.map((t, j) => {
        const d = ZX.thing(st, 10, 10, 8, 'card'); d.style.flexDirection = 'row'; d.style.gap = '12px';
        d.appendChild(glyphs(t, q.rev ? 104 : 64));
        if (q.pic && !j) { const p = brPic(t); if (p) d.appendChild(W4X.pic(p, 96)); }
        d._t = t;
        K.reg(st, j ? 'read1' : 'read', d, { drag: true, drops: () => st.cards.map((c, i) => ({ id: 'card' + i, rect: () => box(c) })) });
        K.pop(st, d, 120 * j);
        return d;
      });
      st.readEl = st.reads[0]; st.readText = q.given[0];
      st.opts = q.opts.slice();
      st.cards = q.opts.map((t, i) => { const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; st.els.push(d); d.appendChild(glyphs(t, q.rev ? 54 : 100)); K.reg(st, 'card' + i, d, {}); st.scope.anim(d, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, delay: 60 * i, easing: EASE.pop, fill: 'backwards' }); return d; });
      this.place(st); this.mark(st);
      K.say(st, q.rev ? '它是哪个词？' : q.two ? '它们是哪个字？' : '它是哪个字？');
    },
    /* sizes: the given card(s), the options */
    sizes(st) {
      const q = st.q;
      return { gw: q.rev ? 150 : q.pic ? 300 : q.two ? 200 : 230, gh: q.two ? 120 : 150, ow: q.rev ? (L() ? 196 : 200) : 140, oh: q.rev ? 112 : 140 };
    },
    place(st) {
      if (!st.cards) return;
      const q = st.q, S = this.sizes(st), n = st.reads.length, g = 18;
      let gx, gy, bx, by, bw, ocx, ocy;
      if (L()) {
        gx = q.pic ? 180 : 165; gy = 340; ocx = q.rev ? 704 : 690; ocy = 372;      /* room above the options for a picture */
        const cols = 3, gridW = cols * S.ow + (cols - 1) * g, left = ocx - gridW / 2, right = gx + S.gw / 2;
        bw = Math.max(80, left - right - 16); bx = right + 8; by = gy - 20;
      } else {
        gx = 352; gy = 250; ocx = 352; ocy = q.rev ? 700 : 690; bw = 240; bx = 352 - 120; by = gy + S.gh / 2 + (n > 1 ? 4 : 18);
      }
      st.reads.forEach((d, j) => {
        if (st.done.includes(j)) return;
        const x = L() ? gx : gx + (n > 1 ? (j ? 1 : -1) * 120 : 0), y = L() ? gy + (n > 1 ? (j ? 1 : -1) * 92 : 0) : gy;
        place(d, Math.round(x - S.gw / 2), Math.round(y - S.gh / 2), S.gw, S.gh);
      });
      place(st.bridge, Math.round(bx), Math.round(by), Math.round(bw), Math.round(bw * 0.42));
      const rows = [[0, 1, 2], [3, 4]], H = 2 * S.oh + g;
      st.cards.forEach((d, i) => {
        if (d._matched) return;
        const r = i < 3 ? 0 : 1, inRow = rows[r].length, k = rows[r].indexOf(i), W = inRow * S.ow + (inRow - 1) * g;
        place(d, Math.round(ocx - W / 2 + k * (S.ow + g)), Math.round(ocy - H / 2 + r * (S.oh + g)), S.ow, S.oh);
      });
      (st.matchedAt || []).forEach(([i, j]) => this.atRead(st, i, j));
    },
    /* a character matched to the first of two English words sits beside it, small */
    atRead(st, i, j) { const c = st.cards[i], r = box(st.reads[j]); place(c, L() ? r.x + r.w + 10 : r.x + r.w / 2 - 50, L() ? r.y + r.h / 2 - 50 : r.y + r.h + 8, 100, 100); },
    mark(st) { st.reads.forEach((d, j) => { d.style.boxShadow = st.reads.length > 1 && j === st.ix && !st.done.includes(j) ? '0 0 0 5px #2B2118, 0 0 0 11px #FFE14A' : ''; }); },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 86 : 80, L() ? 698 : 1016, L() ? 190 : 150); },
    peek(st, j) {
      const t = st.q.given[j];
      st.readEl = st.reads[j]; st.readText = t;
      if (/[A-Za-z]/.test(t)) { st.peeked = true; st.noStar = true; Voice.sayNow(t, { tag: 'peek' }); K.hop(st, st.reads[j], 12); }
      else W4X.peek(st);
    },
    onGesture(st, name, p) {
      if (st.submitted || st.busy) return false;
      const rj = p.id === 'read' ? 0 : p.id === 'read1' ? 1 : -1;
      if (name === 'tap' && rj >= 0) { if (st.done.includes(rj)) return false; this.peek(st, rj); return 'ok'; }
      let j = st.ix, i = -1;
      if (name === 'drop' && rj >= 0) { if (st.done.includes(rj)) return false; j = rj; i = K.cardIndex(p.to); settle(st.reads[j]); }
      else if (name === 'tap') i = K.cardIndex(p.id);
      if (i < 0 || st.cards[i]._matched) return false;
      const q = st.q, want = q.rev ? q.answer : q.zh[j];
      st.tapped = i; st.cur = j; Sfx.tap();
      if (st.opts[i] !== want) { Session.submit(st, st.opts[i]); return 'ok'; }
      st.done.push(j);
      if (st.done.length < st.reads.length) {               /* the first of two: the character goes beside its word */
        st.busy = true; st.ix = st.reads.findIndex((_, x) => !st.done.includes(x)); this.mark(st);
        const c = st.cards[i]; c._matched = true; (st.matchedAt = st.matchedAt || []).push([i, j]);
        const r = box(st.reads[j]); unmove(st.reads[j]); this.place(st);
        K.flyTo(st, c, L() ? r.x + r.w + 10 : r.x + r.w / 2 - 50, L() ? r.y + r.h / 2 - 50 : r.y + r.h + 8, 340, 40, 1).then(() => { if (!st.scope.dead) { c.style.width = c.style.height = '100px'; c.firstChild.style.transform = 'scale(.7)'; st.busy = false; } });
        Voice.say(this.enOf(st, j), { tag: 'prompt' }); Sfx.place();
        return 'ok';
      }
      Session.submit(st, q.two ? 'all' : want);
      return 'ok';
    },
    /* the two cards meet on the bridge (碰！); the English word is said and "就是大" */
    async reveal(st) {
      const q = st.q, j = st.cur || 0, r = st.reads[j], c = st.cards[st.opts.indexOf(q.rev ? q.answer : q.zh[j])], b = box(st.bridge);
      settle(r);
      const mx = b.x + b.w / 2, my = b.y + b.h * 0.25, rb = box(r), cb = box(c);
      await Promise.all([K.flyTo(st, r, mx - rb.w - 2, my - rb.h / 2, 380, 40, 1), K.flyTo(st, c, mx + 2, my - cb.h / 2, 380, 40, 1)]);
      if (!Session.alive(st)) return;
      Sfx.thud(); Fx.burst(mx, my, { n: 16, dist: 100 });
      st.scope.anim(r, [{ transform: 'translateX(0)' }, { transform: 'translateX(-14px)' }, { transform: 'translateX(0)' }], { duration: 260, fill: 'none' });
      st.scope.anim(c, [{ transform: 'translateX(0)' }, { transform: 'translateX(14px)' }, { transform: 'translateX(0)' }], { duration: 260, fill: 'none' });
      const h = st.G.actors.gourd2; if (h) h.react();
      Voice.say(this.enOf(st, j), { tag: 'summary' }); Voice.say(isIt(this.zhOf(st, j)), { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: what he picked ("这是小"; the other way round: the English word, said) */
    async feedback(st, ans) {
      const r = st.reads[st.cur || 0]; unmove(r); this.place(st);
      const e = st.cards[st.tapped]; if (e) K.wiggle(st, e);
      Voice.say(/[A-Za-z]/.test(ans) ? ans : W4X.thisIs(ans), { tag: 'wrong' });
      await st.scope.wait(900);
    },
    /* explain: 1 his card in blue with its picture; 2 the English word said, its picture and the right character's picture side by
       side (a beat); 3 the right card in gold: the English word, "就是大" */
    async explain(st, ans) {
      const q = st.q, j = st.cur || 0, en = this.enOf(st, j), zh = this.zhOf(st, j), want = q.rev ? q.answer : zh;
      const eC = st.cards[st.tapped], eR = st.cards[st.opts.indexOf(want)];
      st.reads.forEach((r, x) => { if (x !== j && !st.done.includes(x)) r.style.visibility = 'hidden'; });
      const pc = /[A-Za-z]/.test(ans) ? brPic(ans) : charPic(ans);
      W4X.exChosen(st, eC, pc ? W4X.pic(pc, 84) : null);
      await EX.wait(st, 650);
      await EX.say(st, [en]);
      await W4X.exBeat(st, () => this.pair(st, en, zh), 800);
      await W4X.exRight(st, eR, want, [en, isIt(zh)], false);
    },
    /* the English word's picture <-> the character's picture (or the word <-> the character), over the bridge */
    pair(st, en, zh) {
      const pe = brPic(en), pz = charPic(zh), s = 76;
      const d = panel(st, [pe ? picNode(pe, s) : glyphs(en, 52), pz ? picNode(pz, s) : Glyph.zh(zh, s)]);
      const r = vbox(d), b = box(st.bridge), w = r.w, h = r.h;
      const g = box(st.reads[st.cur || 0]), ob = st.cards.filter(c => !c._matched).map(c => box(c)), oy = Math.max(...ob.map(c => c.y + c.h)), ox = (Math.min(...ob.map(c => c.x)) + Math.max(...ob.map(c => c.x + c.w))) / 2;
      const at = freeSpot(st, w, h, [[b.x + b.w / 2 - w / 2, b.y - h - 10], [b.x + b.w / 2 - w / 2, b.y + b.h + 10], [b.x + b.w / 2 - w / 2, b.y + b.h / 2 - h / 2],
        [g.x + g.w / 2 - w / 2, g.y + g.h + 14], [ox - w / 2, oy + 14], [Stage.W / 2 - w / 2, 110]], st.cards.concat(st.reads.filter(x => x.style.visibility !== 'hidden')));
      place(d, at ? at.x : clamp(b.x + b.w / 2 - w / 2, 8, Stage.W - w - 8), at ? at.y : Math.max(110, b.y - h - 10)); d.style.width = d.style.height = 'auto';
      K.pop(st, d);
    },
    /* the 2nd hint (real help): the picture beside the given card; level 1 has it already, a word without one gets none */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone || !st.reads) return; st.hintDone = true;
      const j = st.ix || 0, t = st.q.given[j], p = st.q.rev ? charPic(t) : brPic(t);
      if (st.q.pic || !p) { st.noHelp = true; return; }
      const r = box(st.reads[j]), d = ZX.thing(st, 104, 104, 9, 'card'); d.classList.add('pic'); d.style.pointerEvents = 'none'; d.appendChild(W4X.pic(p, 90));
      place(d, L() ? r.x + r.w / 2 - 52 : r.x + r.w + 12, L() ? r.y - 112 : r.y + r.h / 2 - 52, 104, 104); K.pop(st, d); Sfx.sparkle();
    },
    next(st, strat) {
      if (!st.cards || st.busy) return null;
      const q = st.q, j = st.ix || 0, want = q.rev ? q.answer : q.zh[j];
      const i = strat === 'wrong' ? st.opts.findIndex((t, x) => t !== want && !(q.zh || []).includes(t) && !st.cards[x]._matched) : st.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).filter(c => !c._matched).concat((st.reads || []).filter((_, j) => !(st.done || []).includes(j))); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() { const d = el('div'); Object.assign(d.style, { display: 'flex', alignItems: 'center', gap: '4px' }); d.appendChild(Glyph.word('big', 28)); const a = el('div', '', d); a.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18"><path d="M3 10H17M7 6L3 10L7 14M13 6L17 10L13 14" fill="none" stroke="#46C27A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'; d.appendChild(Glyph.zh('大', 34)); return d; },
  };

  /* ---------------------------------------------------------------- ⑤-4 挑战 「跷！」 跷跷板 (the opposite balances it)
     A seesaw on the grass: a card on its low end (read, not said: a tap says it - no star for that question), the other end
     empty and up in the air. Put the opposite on it (drag a card onto the empty seat, or tap it: it flies there) - right, and the
     seesaw comes level and the pair is said ("多，少！"). OPP4: both characters known (a child of 晨光海 only: 大小 上下 多少
     开关 天地). Levels: 1 the card's picture, the others unrelated; 2 the card alone; 3 others of the same kind that are not its
     opposite (上: 左 前 中 / 天 地); 4 a look-alike of the answer too (少: 小, 开: 天, 去: 云); 5 words (开门 -> 关门, 上山 ->
     下山), else level 4. A random card is right 1 time in 5. */
  const CLS = ['上下左右前后中', '大小多少', '开关来去走坐站飞', '天地日月山川土'];
  const sameOf = c => { const g = CLS.find(x => x.includes(c)); return g ? Array.from(g).filter(x => x !== c) : []; };
  const zhPic = w => { const x = W4D.wordsZh.find(v => v[0] === w); return x && x[1] && W4X.hasPic(x[1]) ? x[1] : null; };
  const itemPic = t => (t.length === 1 ? charPic(t) : zhPic(t));
  const pairLine = (a, b) => { const p = W4D.opp.find(x => x === a + b || x === b + a), w = W4D.oppWords.find(x => (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a)); const [s, t] = p ? Array.from(p) : w || [a, b]; return s + '，' + t + '！'; };
  const TILT = -11;
  const SEESAW = () => (L() ? { cx: 512, cy: 392, len: 640 } : { cx: 352, cy: 452, len: 600 });
  const Seesaw = {
    rule: 'opposite-balance', kind0: 'quiz', verb: '跷！', intro: '跷跷板，反过来！', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), knows = w => Array.from(w).every(c => kn.includes(c));
      const words = lv >= 5 ? W4D.oppWords.filter(p => knows(p[0]) && knows(p[1])) : [];
      if (words.length) {
        const flat = words.flatMap(p => [[p[0], p[1]], [p[1], p[0]]]), [qw, aw] = bagFrom(G, 'ow', flat);
        const pool2 = W4D.wordsZh.map(v => v[0]).filter(w => knows(w) && w !== qw && w !== aw);
        const others = [], add = w => { if (others.length < 4 && !others.includes(w)) others.push(w); };
        R(G, pool2.filter(w => Array.from(w).some(c => aw.includes(c)))).slice(0, 2).forEach(add);
        R(G, pool2.filter(w => Array.from(w).some(c => qw.includes(c)))).slice(0, 1).forEach(add);
        R(G, pool2).forEach(add);
        const opts = W4X.put(G, others, aw);
        return { k: [qw, opts.join('')], ask: qw, answer: aw, item: Array.from(qw).find(c => poolOf(G, 'zh', false).includes(c)) || qw[0], opts, pic: 0, word: 1,
          same: Math.min(2, others.filter(w => Array.from(w).some(c => aw.includes(c))).length), look: 0 };
      }
      const pairs = W4D.opp.filter(p => knows(p)), chars = Array.from(new Set(pairs.join('')));
      const pool = lv <= 1 ? chars.filter(charPic) : chars;
      const X = W4X.pick(G, pool.length ? pool : chars), A = oppOf(X);
      const bad = x => x === X || x === A || (HOLDS[A] || '').includes(x) || (HOLDS[X] || '').includes(x);
      const same = sameOf(X).concat(sameOf(A)).filter(x => kn.includes(x) && !bad(x));
      const look = (LOOK[A] || '').split('').filter(x => kn.includes(x) && !bad(x));
      const others = [], add = x => { if (others.length < 4 && !bad(x) && !others.includes(x) && kn.includes(x)) others.push(x); };
      if (lv >= 4) R(G, look).slice(0, 1).forEach(add);
      if (lv >= 3) R(G, same).slice(0, 2).forEach(add);
      const far = kn.filter(x => !same.includes(x) && !look.includes(x) && !(LOOK[X] || '').includes(x));
      R(G, far).forEach(add);
      R(G, kn).forEach(add);
      const opts = W4X.put(G, others, A);
      return { k: [X, opts.join('')], ask: X, answer: A, item: X, opts, pic: lv <= 1 && charPic(X) ? 1 : 0, word: 0,
        same: Math.min(2, others.filter(x => same.includes(x)).length), look: others.filter(x => look.includes(x)).length ? 1 : 0 };
    },
    /* tests/w4_levels.js: the picture gone, others of the same kind, a look-alike of the answer, words */
    hard(q) { return (1 - q.pic) * 1.5 + q.same + q.look * 1.5 + q.word * 4; },
    itemOf(st) { return W4X.own(st, st.q.item); },
    itemsOf(st) { const q = st.q; return q.answer.length === 1 ? [q.answer] : Array.from(q.answer).filter(c => poolOf(st.G, 'zh', false).includes(c)); },
    async present(st) {
      const q = st.q, S = SEESAW();
      st.base = ZX.thing(st, 120, 110, 4, 'item'); st.base.innerHTML = '<svg viewBox="0 0 120 110" width="100%" height="100%"><path d="M60 8L112 104H8Z" fill="#A0522D" stroke="#2B2118" stroke-width="7" stroke-linejoin="round"/><circle cx="60" cy="22" r="10" fill="#F5B324" stroke="#2B2118" stroke-width="5"/></svg>';
      const beam = st.beam = ZX.thing(st, S.len, 200, 6, 'item'); beam.style.transformOrigin = '50% 92%'; beam.style.pointerEvents = 'none';
      const plank = el('div', '', beam); Object.assign(plank.style, { position: 'absolute', left: '0px', right: '0px', bottom: '8px', height: '30px', borderRadius: '15px', background: 'linear-gradient(#5CC46E,#3E9E52)', boxShadow: '0 0 0 5px #2B2118' });
      const cw = q.word ? 190 : q.pic ? 250 : 136, ch = q.word ? 130 : 136;
      const card = st.askEl = el('div', 'card', beam); Object.assign(card.style, { position: 'absolute', left: '14px', bottom: '42px', width: cw + 'px', height: ch + 'px', flexDirection: 'row', gap: '10px', pointerEvents: 'auto' });
      card.appendChild(glyphs(q.ask, q.word ? 80 : 104));
      if (q.pic) card.appendChild(W4X.pic(charPic(q.ask), 100));
      K.reg(st, 'read', card, {}); st.readEl = card; st.readText = q.ask;
      const slot = st.slot = el('div', '', beam); Object.assign(slot.style, { position: 'absolute', right: '14px', bottom: '42px', width: (q.word ? 190 : 136) + 'px', height: ch + 'px', borderRadius: '24px', border: '6px dashed #2B2118', background: 'rgba(255,248,214,.75)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' });
      beam.style.transform = 'rotate(' + TILT + 'deg)';
      st.opts = q.opts.slice();
      st.cards = q.opts.map((t, i) => {
        const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; st.els.push(d); d.appendChild(glyphs(t, q.word ? 64 : 92));
        K.reg(st, 'card' + i, d, { drag: true, drops: () => [{ id: 'slot', rect: () => vbox(st.slot) }] });
        st.scope.anim(d, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, delay: 60 * i, easing: EASE.pop, fill: 'backwards' });
        return d;
      });
      this.place(st);
      K.say(st, '反过来是哪个？');
    },
    osize(st) { return st.q.word ? [150, 112] : (L() ? [124, 124] : [132, 132]); },
    place(st) {
      if (!st.beam) return;
      const S = SEESAW(), [w, h] = this.osize(st), g = L() ? 16 : 20;
      place(st.base, S.cx - 60, S.cy - 14, 120, 110);
      place(st.beam, S.cx - S.len / 2, S.cy - 184, S.len, 200);
      if (L()) { const W = 5 * w + 4 * g; st.cards.forEach((d, i) => { if (!d._seated) place(d, Math.round(512 - W / 2 + i * (w + g)), 600 - h / 2, w, h); }); }
      else st.cards.forEach((d, i) => { if (d._seated) return; const r = i < 3 ? 0 : 1, n = r ? 2 : 3, k = r ? i - 3 : i, W = n * w + (n - 1) * g; place(d, Math.round(352 - W / 2 + k * (w + g)), Math.round(650 + r * (h + g)), w, h); });
    },
    decor(G) {
      const Lx = L(), a = G.actors[this.chars[0]], b = G.actors[this.chars[1]];
      this.chars.forEach(id => hideActor(G.actors[id]));
      if (a) showActor(a, Lx ? 86 : 76, Lx ? 698 : 1016, Lx ? 190 : 150);
      if (b) showActor(b, Lx ? 944 : 630, Lx ? 698 : 1016, Lx ? 180 : 150);
    },
    onGesture(st, name, p) {
      if (st.submitted || st.busy) return false;
      if (name === 'tap' && p.id === 'read') { W4X.peek(st); return 'ok'; }
      const i = K.cardIndex(p.id);
      if (i < 0 || !(name === 'tap' || (name === 'drop' && p.to === 'slot'))) return false;
      st.tapped = i; Sfx.tap(); st.busy = true;
      this.seat(st, i, name === 'drop').then(() => { if (Session.alive(st)) Session.submit(st, st.opts[i]); });
      return 'ok';
    },
    /* the card flies onto the empty seat (and stays there: a copy inside the seat, so it moves with the seesaw) */
    async seat(st, i, dropped) {
      const c = st.cards[i], v = vbox(st.slot), b = box(c);
      if (dropped) settle(c);
      await K.flyTo(st, c, v.x + v.w / 2 - b.w / 2, v.y + v.h / 2 - b.h / 2, dropped ? 160 : 340, dropped ? 0 : 50, 1);
      if (st.scope.dead) return;
      c.style.visibility = 'hidden'; c._seated = true;
      st.slot.innerHTML = ''; st.slot.style.border = '5px solid #2B2118'; st.slot.style.background = '#FFFDF6'; st.slot.appendChild(glyphs(st.opts[i], st.q.word ? 80 : 104));
      Sfx.place();
    },
    async level(st) { await st.scope.anim(st.beam, [{ transform: 'rotate(' + TILT + 'deg)' }, { transform: 'rotate(2deg)' }, { transform: 'rotate(0deg)' }], { duration: 700, easing: EASE.glide, commit: true }); },
    /* the seesaw comes level, both cards hop, the pair is said */
    async reveal(st) {
      await this.level(st);
      if (!Session.alive(st)) return;
      Sfx.reveal(); K.hop(st, st.askEl, 22); K.hop(st, st.slot, 22);
      const v = vbox(st.beam); Fx.burst(v.x + v.w / 2, v.y + v.h * 0.5, { n: 16, dist: 120 });
      const h = st.G.actors.gourd2; if (h) h.react();
      Voice.say(pairLine(st.q.ask, st.q.answer), { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: what he put on ("这是小"); the seesaw wobbles but does not come level */
    async feedback(st, ans) {
      st.scope.anim(st.beam, [{ transform: 'rotate(' + TILT + 'deg)' }, { transform: 'rotate(' + (TILT + 4) + 'deg)' }, { transform: 'rotate(' + TILT + 'deg)' }], { duration: 500, fill: 'none' });
      Voice.say(W4X.thisIs(ans), { tag: 'wrong' });
      await st.scope.wait(900);
    },
    /* explain: 1 the card he put on slides back to its row, in blue with its picture; 2 the asked card's picture and the right
       one's side by side (a beat); 3 the right card in gold flies onto the seat, the seesaw comes level: "多，少！" */
    async explain(st, ans) {
      const q = st.q, i = st.tapped, eC = st.cards[i], eR = st.cards[st.opts.indexOf(q.answer)];
      st.slot.innerHTML = ''; Object.assign(st.slot.style, { border: '6px dashed #2B2118', background: 'rgba(255,248,214,.75)' });
      eC._seated = false; eC.style.visibility = ''; unmove(eC); this.place(st); st.busy = false;
      const pc = itemPic(ans); W4X.exChosen(st, eC, pc ? W4X.pic(pc, 84) : null);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => this.pair(st), 800);
      EX.ring(st, eR, 'right'); st.stepDirty = true;
      await this.seat(st, st.opts.indexOf(q.answer), false);
      eR.style.visibility = ''; eR._seated = false; this.place(st);
      await this.level(st);
      await EX.say(st, [pairLine(q.ask, q.answer)]);
      await EX.wait(st, 300);
    },
    /* the asked card's picture <-> the answer's picture, above the seesaw */
    pair(st) {
      const q = st.q, pa = itemPic(q.ask), pb = itemPic(q.answer), s = 76;
      const d = panel(st, [pa ? picNode(pa, s) : glyphs(q.ask, 60), pb ? picNode(pb, s) : glyphs(q.answer, 60)]);
      const r = vbox(d), w = r.w, h = r.h, v = vbox(st.beam);
      const at = freeSpot(st, w, h, [[v.x + v.w / 2 - w / 2, v.y - 6], [v.x + v.w / 2 - w / 2, v.y + 20], [v.x + v.w / 2 - w / 2, 112]], st.cards.concat([st.askEl, st.slot]));
      place(d, at ? at.x : v.x + v.w / 2 - w / 2, at ? at.y : Math.max(110, v.y - 6)); d.style.width = d.style.height = 'auto';
      K.pop(st, d);
    },
    /* the 2nd hint (real help): the asked card's picture appears; level 1 has it, a word without one gets none */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone || !st.askEl) return; st.hintDone = true;
      const p = itemPic(st.q.ask); if (st.q.pic || !p) { st.noHelp = true; return; }
      const d = W4X.pic(p, 96); Object.assign(d.style, { position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', width: '96px', height: '96px' });
      st.askEl.appendChild(d); K.pop(st, d); Sfx.sparkle();
    },
    next(st, strat) {
      if (!st.cards || st.busy) return null;
      const i = strat === 'wrong' ? st.opts.findIndex(t => t !== st.q.answer) : st.opts.indexOf(st.q.answer);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    cleanup(st) { (st.cards || []).forEach(c => { c._seated = false; }); },
    snap(st) { return { opts: st.opts || null }; },
    iconNode() { const d = el('div'); d.innerHTML = '<svg viewBox="0 0 60 60" width="100%" height="100%"><path d="M30 34L40 52H20Z" fill="#A0522D" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><g transform="rotate(-14 30 34)"><rect x="4" y="30" width="52" height="7" rx="3.5" fill="#5CC46E" stroke="#2B2118" stroke-width="2.5"/><rect x="6" y="16" width="13" height="13" rx="3" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><rect x="41" y="16" width="13" height="13" rx="3" fill="#fff" stroke="#2B2118" stroke-width="2.5"/></g></svg>'; Object.assign(d.style, { width: '82%', height: '82%' }); return d; },
  };

  w4Island('huluwa4', [Lamps, Match, Seesaw]);
})();
