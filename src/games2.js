/* ================================================================ 字字岛 · world 2 (星光海): new plays for finding a character,
   new reasoning tests (spelling, upper / lower case, words of two characters, characters made of two, parts, reading) */

/* 佩奇 · 装书包: drag the right card into the school bag */
const PlayBag = {
  intro: '装进书包！', props: ['satchel'],
  targets(st) {
    const bag = st.bag = ZX.thing(st, 260, 260, 5, 'item'); ZX.pic('assets/props/satchel.png', bag);
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 140, 140, 8, 'card'); d.appendChild(Glyph.zh(k, 108));
      K.reg(st, 'card' + i, d, { drag: true, drops: () => [{ id: 'bag', rect: () => box(st.bag) }] });
      K.pop(st, d, 70 * i);
      return d;
    });
  },
  place(st) {
    const L = K.L(), n = st.cards.length;
    place(st.bag, L ? 382 : 222, L ? 110 : 250, 260, 260);
    const r = L ? { x: 120, y: 450, w: 784, h: 170 } : { x: 40, y: 620, w: 624, h: n > 3 ? 300 : 170 };
    spots(n, r, L ? n : (n > 3 ? Math.ceil(n / 2) : n)).forEach((p, i) => place(st.cards[i], p.x - 70, p.y - 70, 140, 140));
  },
  onGesture(st, name, p) {
    if (name !== 'drop' || st.picked || p.to !== 'bag') return false;
    const i = K.cardIndex(p.id); if (i < 0) return false;
    st.picked = true; st.tapped = i; Sfx.place();
    Session.submit(st, st.opts[i]);
    return 'ok';
  },
  next(st, strat) { const i = strat === 'wrong' ? st.opts.findIndex(v => v !== st.q.answer) : st.opts.indexOf(st.q.answer); return { g: 'drop', p: { id: 'card' + i, to: 'bag' }, to: center(st.bag) }; },
  nope(st, i) { const e = st.cards[i]; e.style.transform = ''; },
  async win(st, i) {
    const e = st.cards[i], b = box(st.bag);
    await K.flyTo(st, e, b.x + b.w / 2 - 70, b.y + b.h * 0.2, 360, 40, 0.5);
    await st.scope.anim(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    K.hop(st, st.bag, 30); Sfx.boing();
    await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y - 40, 150);
  },
};
/* Bluey · 找一找: the cards lie around the bedroom - find the right one */
const PlaySeek = {
  intro: '在房间里找一找！', props: [],
  targets(st) {
    const rot = [-12, 9, -6, 14, -9];
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 128, 128, 6, 'card'); d.appendChild(Glyph.zh(k, 100)); d.style.transform = 'rotate(' + rot[i % 5] + 'deg)';
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 90 * i);
      return d;
    });
    st.cells = K.cells(st.G.rng, st.opts.length, 3, 2, 0.5);
  },
  place(st) {
    const L = K.L(), r = L ? { x: 150, y: 110, w: 724, h: 470 } : { x: 50, y: 230, w: 604, h: 620 };
    st.cards.forEach((d, i) => { const [u, v] = st.cells[i]; place(d, r.x + u * r.w - 64, r.y + v * r.h - 64, 128, 128); });
  },
  async win(st, i) { const e = st.cards[i], b = box(e); e.style.transform = ''; K.hop(st, e, 40); Sfx.reveal(); await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y - 60, 150); },
};
/* 睡衣小英雄 · 点亮星星: the right star lights up and joins the picture of stars */
const PlayStars = {
  intro: '点亮星星！', props: [],
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 150, 150, 6, 'item'); ZX.pic('assets/obj/star.png', d).style.filter = 'saturate(.35) brightness(.8)';
      const s = ZX.sign(k, 84); Object.assign(s.style, { left: '22%', top: '26%', borderRadius: '50%' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 90 * i);
      Loops.run(d, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 1500 + i * 220 });
      return d;
    });
    st.cells = K.cells(st.G.rng, st.opts.length, 3, 2, 0.45);
  },
  place(st) {
    const L = K.L(), r = L ? { x: 140, y: 100, w: 744, h: 440 } : { x: 50, y: 220, w: 604, h: 560 };
    st.cards.forEach((d, i) => { const [u, v] = st.cells[i]; place(d, r.x + u * r.w - 75, r.y + v * r.h - 75, 150, 150); });
  },
  async win(st, i) {
    const e = st.cards[i], b = box(e), G = st.G;
    e.querySelector('img').style.filter = 'drop-shadow(0 0 22px #FFE14A)';
    Sfx.sparkle(); Fx.burst(b.x + b.w / 2, b.y + b.h / 2, { n: 20, colors: ['#FFE14A', '#FFFFFF'], dist: 130 });
    const sky = G.sky || (G.sky = []); sky.push({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
    if (sky.length > 1) { const s = K.lines(st); sky.slice(1).forEach((p, j) => svg('line', { x1: sky[j].x, y1: sky[j].y, x2: p.x, y2: p.y, stroke: '#FFE14A', 'stroke-width': 5, 'stroke-dasharray': '4 10', 'stroke-linecap': 'round' }, s)); }
    await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y + b.h + 50, 130);
  },
};
/* 赛罗 · 合体字: find the character - then watch its two parts join */
const PARTS2 = { 从: ['人', '人'], 休: ['人', '木'], 林: ['木', '木'], 明: ['日', '月'] };
const PlayFuse = {
  intro: '合体字出发！', props: [],
  targets(st) { st.cards = st.opts.map((k, i) => { const d = ZX.thing(st, 150, 150, 6, 'card'); d.appendChild(Glyph.zh(k, 118)); K.reg(st, 'card' + i, d, {}); K.pop(st, d, 80 * i); return d; }); },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 260, y: 160, w: 680, h: n > 3 ? 360 : 200 } : { x: 60, y: 300, w: 584, h: n > 3 ? 440 : 240 };
    spots(n, r, L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 3 ? 2 : n)).forEach((p, i) => place(st.cards[i], p.x - 75, p.y - 75, 150, 150));
  },
  decor(G) { const L = K.L(), a = G.actors.zero; if (a) showActor(a, L ? 120 : 600, L ? 690 : 1016, L ? 290 : 200); },
  async win(st, i) {
    const k = st.q.answer, e = st.cards[i], b = box(e), parts = PARTS2[k];
    K.hop(st, e, 30); Sfx.zap();
    if (parts) {
      const ds = parts.map((p, j) => { const d = ZX.thing(st, 100, 100, 31, 'card'); d.appendChild(Glyph.zh(p, 80, '#2E6FD8')); place(d, b.x + b.w / 2 - 50 + (j ? 130 : -130), b.y - 140, 100, 100); return d; });
      await Promise.all(ds.map(d => st.scope.anim(d, [{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300, easing: EASE.pop })));
      await st.scope.wait(350);
      await Promise.all(ds.map((d, j) => st.scope.anim(d, [{ transform: 'translateX(0)' }, { transform: 'translateX(' + (j ? -130 : 130) + 'px) scale(.6)', opacity: 0.2 }], { duration: 420, easing: EASE.glide, fill: 'forwards' })));
      Fx.burst(b.x + b.w / 2, b.y - 90, { n: 22, colors: ['#7FE4FF', '#FFFFFF', '#FFE14A'], dist: 120 }); Sfx.reveal();
    }
    await ZX.alive(st, k, b.x + b.w / 2, b.y + b.h / 2, 150);
  },
};
/* 葫芦娃 · 浇花: drag the watering can to the right pot - its plant grows */
const PlayWater = {
  intro: '给对的花盆浇水！', props: ['flowerpot', 'can'],
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 170, 190, 6, 'item'); ZX.pic('assets/props/flowerpot.png', d).style.top = '22%';
      const s = ZX.sign(k, 84); Object.assign(s.style, { left: '25%', top: '52%' }); d.appendChild(s);
      K.pop(st, d, 80 * i);
      return d;
    });
    const can = st.can = ZX.thing(st, 150, 150, 9, 'item'); ZX.pic('assets/props/can.png', can);
    K.reg(st, 'can', can, { drag: true, drops: () => st.cards.map((c, i) => ({ id: 'pot' + i, rect: () => box(c) })) });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 260, y: 360, w: 700, h: n > 3 ? 300 : 180 } : { x: 50, y: 520, w: 604, h: n > 3 ? 420 : 220 };
    spots(n, r, L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 3 ? 2 : n)).forEach((p, i) => place(st.cards[i], p.x - 85, p.y - 95, 170, 190));
    place(st.can, L ? 60 : 280, L ? 140 : 260, 150, 150);
  },
  onGesture(st, name, p) {
    if (name !== 'drop' || st.picked || p.id !== 'can') return false;
    const m = /^pot(\d)$/.exec(p.to || ''); if (!m) return false;
    const i = Number(m[1]); st.picked = true; st.tapped = i; Sfx.splash();
    Session.submit(st, st.opts[i]);
    return 'ok';
  },
  next(st, strat) { const i = strat === 'wrong' ? st.opts.findIndex(v => v !== st.q.answer) : st.opts.indexOf(st.q.answer); return { g: 'drop', p: { id: 'can', to: 'pot' + i }, to: center(st.cards[i]) }; },
  workEls(st) { return st.can ? [st.can] : []; },
  async win(st, i) {
    const e = st.cards[i], b = box(e); st.can.style.transform = '';
    place(st.can, b.x + b.w * 0.5, b.y - 120, 150, 150);
    Fx.burst(b.x + b.w / 2, b.y + 20, { n: 16, colors: ['#7FD3FF', '#4FB3FF', '#FFFFFF'], dist: 60, fall: true }); Sfx.splash();
    await st.scope.wait(400);
    await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y - 30, 150);
  },
  nope(st) { st.can.style.transform = ''; },
};
/* 西游 · 筋斗云: Wukong jumps on the cloud with the right character */
const PlayCloud = {
  intro: '跳上对的云！', props: ['jindou'],
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 200, 150, 6, 'item'); ZX.pic('assets/props/jindou.png', d);
      const s = ZX.sign(k, 86); Object.assign(s.style, { left: '28%', top: '18%', borderRadius: '50%' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 90 * i);
      Loops.run(d, [{ transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }, { transform: 'translateY(0)' }], { duration: 2000 + i * 300 });
      return d;
    });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 260, y: 120, w: 680, h: n > 3 ? 380 : 260 } : { x: 50, y: 260, w: 604, h: n > 3 ? 480 : 300 };
    spots(n, r, L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 3 ? 2 : n)).forEach((p, i) => place(st.cards[i], p.x - 100, p.y - 75, 200, 150));
  },
  async win(st, i) {
    const e = st.cards[i], b = box(e), a = st.G.actors.wukong;
    if (a) { await a.moveTo(b.x + b.w / 2, b.y + b.h * 0.45, 520, 160); a.react('flip'); }
    Sfx.whoosh(0.5);
    await st.scope.wait(300);
    await ZX.alive(st, st.q.answer, b.x + b.w / 2 + (b.x > Stage.W / 2 ? -170 : 170), b.y + b.h / 2, 140);
  },
};
/* 大黄蜂 · 送能量: drag the energy cube to the robot holding the right character */
const PlayEnergy = {
  intro: '送能量给机器人！', props: ['cube'],
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 150, 200, 6, 'item'); ZX.pic('assets/chars/' + (i % 2 ? 'optimus' : 'bumblebee') + '.png', d);
      const s = ZX.sign(k, 84); Object.assign(s.style, { left: '22%', top: '-22%' }); d.appendChild(s);
      K.pop(st, d, 80 * i);
      return d;
    });
    const cube = st.cube = ZX.thing(st, 120, 120, 9, 'item'); ZX.pic('assets/props/cube.png', cube);
    Loops.run(cube, [{ filter: 'drop-shadow(0 0 6px #7FE4FF)' }, { filter: 'drop-shadow(0 0 20px #7FE4FF)' }, { filter: 'drop-shadow(0 0 6px #7FE4FF)' }], { duration: 1200 });
    K.reg(st, 'cube', cube, { drag: true, drops: () => st.cards.map((c, i) => ({ id: 'bot' + i, rect: () => box(c) })) });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 250, y: 280, w: 720, h: n > 3 ? 380 : 260 } : { x: 50, y: 470, w: 604, h: n > 3 ? 460 : 260 };
    spots(n, r, L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 3 ? 2 : n)).forEach((p, i) => place(st.cards[i], p.x - 75, p.y - 80, 150, 200));
    place(st.cube, L ? 70 : 290, L ? 150 : 260, 120, 120);
  },
  onGesture(st, name, p) {
    if (name !== 'drop' || st.picked || p.id !== 'cube') return false;
    const m = /^bot(\d)$/.exec(p.to || ''); if (!m) return false;
    const i = Number(m[1]); st.picked = true; st.tapped = i; Sfx.zap();
    Session.submit(st, st.opts[i]);
    return 'ok';
  },
  next(st, strat) { const i = strat === 'wrong' ? st.opts.findIndex(v => v !== st.q.answer) : st.opts.indexOf(st.q.answer); return { g: 'drop', p: { id: 'cube', to: 'bot' + i }, to: center(st.cards[i]) }; },
  workEls(st) { return st.cube ? [st.cube] : []; },
  nope(st) { st.cube.style.transform = ''; },
  async win(st, i) {
    const e = st.cards[i], b = box(e); st.cube.style.visibility = 'hidden';
    e.style.filter = 'drop-shadow(0 0 24px #7FE4FF)'; K.hop(st, e, 40); Sfx.reveal();
    Fx.burst(b.x + b.w / 2, b.y + b.h / 2, { n: 20, colors: ['#7FE4FF', '#FFFFFF', '#FFC93C'], dist: 130 });
    await ZX.alive(st, st.q.answer, b.x + b.w / 2 + (b.x > Stage.W / 2 ? -160 : 160), b.y + b.h / 2, 140);
  },
};

/* ---------------------------------------------------------------- world 2 reasoning tests */
/* 佩奇 · 拼单词: the letters of the word in order (a wrong letter ends the try) */
const QSpell = {
  kind0: 'spell', verb: '拼！', intro: '拼一拼！', props: ['tile'],
  gen(G, o) {
    const lv = o.level, w = PICK(G, 'w', CVC_WORDS.map(x => x[0])), extra = lv >= 4 ? 2 : 1;
    const letters = w.split(''), pool = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !letters.includes(c));
    const tiles = G.rng.shuffle(letters.concat(G.rng.shuffle(pool).slice(0, extra)));
    return { k: [w, tiles.join('')], word: w, tiles, answer: w, hint: lv <= 2 };
  },
  async present(st) {
    const q = st.q, obj = CVC_OBJ[q.word];
    st.got = 0; st.used = [];
    const pic = st.pic = ZX.thing(st, 180, 180, 6, 'objpop'); ZX.pic('assets/obj/' + obj + '.png', pic); K.pop(st, pic);
    st.slots = q.word.split('').map((c, i) => { const d = ZX.thing(st, 110, 110, 6, 'card'); if (q.hint) { const g = Glyph.en(c, 84, 'rgba(43,33,24,.18)'); d.appendChild(g); } return d; });
    st.tileEls = q.tiles.map((c, i) => { const d = ZX.thing(st, 110, 110, 8, 'item'); ZX.pic('assets/props/tile.png', d); const g = Glyph.en(c, 80); Object.assign(g.style, { position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)' }); d.appendChild(g); K.reg(st, 'T' + i, d, {}); K.pop(st, d, 60 * i); return d; });
    this.place(st);
    st.prompt = q.word; st.lead = '拼一拼';
    Voice.say('拼一拼', { tag: 'prompt' }); Voice.say(q.word, { tag: 'prompt' });
  },
  place(st) {
    if (!st.slots) return;
    const L = K.L(), n = st.slots.length, sw = 110, g = 16, tot = n * sw + (n - 1) * g;
    place(st.pic, L ? 120 : 262, L ? 150 : 180, 180, 180);
    st.slots.forEach((d, i) => place(d, (L ? 600 : 352) - tot / 2 + i * (sw + g), L ? 190 : 420, sw, sw));
    const m = st.tileEls.length, tt = m * sw + (m - 1) * 20;
    st.tileEls.forEach((d, i) => { if (d._in) return; place(d, Stage.W / 2 - tt / 2 + i * (sw + 20), L ? 470 : 700, sw, sw); });
  },
  onGesture(st, name, p) {
    if (name !== 'tap' || st.submitted) return false;
    const m = /^T(\d)$/.exec(p.id || ''); if (!m) return false;
    const i = Number(m[1]); if (st.used.includes(i)) return false;
    const c = st.q.tiles[i], want = st.q.word[st.got];
    if (c !== want) { st.tapped = i; Session.submit(st, 'bad'); return 'ok'; }
    st.used.push(i); const d = st.tileEls[i], s = st.slots[st.got]; d._in = true;
    const sb = box(s); K.flyTo(st, d, sb.x, sb.y, 260); Sfx.place(); Voice.sayNow(ITEM[c.toUpperCase()].say, { tag: 'letter' });
    st.got++;
    if (st.got >= st.q.word.length) Session.submit(st, st.q.word);
    return 'ok';
  },
  async reveal(st) { Sfx.reveal(); K.hop(st, st.pic, 40); Voice.say(st.q.word, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  async feedback(st) { const d = st.tileEls[st.tapped]; if (d) K.wiggle(st, d); Voice.say(ITEM[st.q.tiles[st.tapped].toUpperCase()].say, { tag: 'wrong' }); await st.scope.wait(900); },
  next(st, strat) { if (st.got >= st.q.word.length) return null; const want = st.q.word[st.got]; const i = strat === 'wrong' ? st.q.tiles.findIndex((c, j) => c !== want && !st.used.includes(j)) : st.q.tiles.findIndex((c, j) => c === want && !st.used.includes(j)); return { g: 'tap', p: { id: 'T' + i } }; },
  workEls(st) { return st.tileEls || []; },
  snap(st) { return { got: st.got || 0 }; },
  iconNode() { const d = el('div'); d.style.display = 'flex'; 'cat'.split('').forEach(c => d.appendChild(Glyph.en(c, 36))); return d; },
};
/* Bluey · 大小写找朋友: which small letter belongs to this big one? */
const QCase = {
  kind0: 'case', verb: '配！', intro: '大小写找朋友！', props: [],
  gen(G, o) {
    const lv = o.level, answer = PICK(G, 'ans', poolOf(G, 'lo', lv >= 3)), n = lv <= 2 ? 3 : 4;
    return { k: [answer, n], answer, big: answer.toUpperCase(), opts: optsFor(G, 'lo', Math.max(3, lv), n, answer) };
  },
  async present(st) {
    const q = st.q;
    const big = st.big = ZX.thing(st, 200, 200, 6, 'card'); big.appendChild(Glyph.en(q.big, 170)); K.pop(st, big);
    K.cards(st, q.opts.map(k => Glyph.en(k, 110)), q.opts, Object.assign({ size: 150, gap: 28 }, this.cardSpot()));
    this.place(st);
    st.prompt = '小写在哪里？'; st.lead = ITEM[q.big].say;
    Voice.say(ITEM[q.big].say, { tag: 'prompt' }); Voice.say('小写在哪里？', { tag: 'prompt' });
  },
  cardSpot() { return K.L() ? { cx: 600, cy: 520 } : { cx: 352, cy: 760 }; },
  place(st) { if (!st.big) return; const L = K.L(); place(st.big, L ? 500 : 252, L ? 120 : 260, 200, 200); K.cardsPlace(st, Object.assign({ gap: 28 }, this.cardSpot())); },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)], bb = box(st.big); await K.flyTo(st, e, bb.x + bb.w + 20, bb.y + 25, 360, 40); Sfx.reveal(); Voice.say(ITEM[st.q.answer].line, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); if (ITEM[ans]) Voice.say(ITEM[ans.toUpperCase()].say, { tag: 'wrong' }); await st.scope.wait(900); },
  iconNode() { const d = el('div'); d.style.display = 'flex'; d.appendChild(Glyph.en('A', 44)); d.appendChild(Glyph.en('a', 44)); return d; },
};
/* 睡衣小英雄 · 组词: 火 + ? = 火车 - which character is missing? */
const QWord2 = {
  kind0: 'word', verb: '组！', intro: '两个字变一个词！', props: [],
  gen(G, o) {
    const lv = o.level, ok = WORDS2_LIST.filter(w => ITEM[w[0]] && ITEM[w[1]]);
    const w = PICK(G, 'w', ok.map(x => x[0] + x[1])), [a, b] = w.split('');
    const pool = poolOf(G, 'zh', true).filter(k => k !== b && k !== a), n = lv <= 2 ? 3 : 4;
    const others = G.rng.shuffle(pool).slice(0, n - 1);
    const pos = PICK(G, 'pos' + n, Array.from({ length: n }, (_, i) => i)); others.splice(pos, 0, b);
    return { k: [w, others.join('')], word: w, a, answer: b, opts: others };
  },
  async present(st) {
    const q = st.q, obj = WORDS2_OBJ[q.word];
    const pic = st.pic = ZX.thing(st, 170, 170, 6, 'objpop'); ZX.pic('assets/obj/' + obj + '.png', pic); K.pop(st, pic);
    st.first = ZX.thing(st, 140, 140, 6, 'card'); st.first.appendChild(Glyph.zh(q.a, 110));
    st.blank = ZX.thing(st, 140, 140, 6, 'card'); st.blank.style.border = '5px dashed #2B2118'; st.blank.style.background = 'rgba(255,255,255,.6)'; const qm = el('div', '', st.blank); qm.innerHTML = ICONS.q; qm.style.width = qm.style.height = '60px';
    K.cards(st, q.opts.map(k => Glyph.zh(k, 108)), q.opts, Object.assign({ size: 140, gap: 26 }, this.cardSpot()));
    this.place(st);
    K.say(st, q.word + '缺哪个字？');
  },
  cardSpot() { return K.L() ? { cx: 512, cy: 540 } : { cx: 352, cy: 780 }; },
  place(st) {
    if (!st.pic) return;
    const L = K.L();
    place(st.pic, L ? 190 : 267, L ? 160 : 160, 170, 170);
    place(st.first, L ? 420 : 200, L ? 175 : 380, 140, 140);
    place(st.blank, L ? 580 : 364, L ? 175 : 380, 140, 140);
    K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot()));
  },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)], bb = box(st.blank); await K.flyTo(st, e, bb.x, bb.y, 360, 50); st.blank.style.visibility = 'hidden'; Sfx.reveal(); Voice.say(st.q.word + '！', { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  iconNode() { const d = el('div'); d.style.display = 'flex'; d.appendChild(Glyph.zh('火', 40)); d.appendChild(Glyph.zh('车', 40)); return d; },
};
/* 赛罗 · 合体字: 木 + 木 = ?   (later: 明 = 日 + ?) */
const QFuse = {
  kind0: 'fuse', verb: '合体！', intro: '两个字合成一个！', props: [],
  gen(G, o) {
    const lv = o.level, list = Object.keys(PARTS2), k = PICK(G, 'k', list), [a, b] = PARTS2[k], rev = lv >= 3 && G.rng.chance(0.5);
    let answer, opts;
    if (!rev) { answer = k; opts = G.rng.shuffle(list.filter(x => x !== k)).slice(0, lv <= 2 ? 2 : 3); }
    else { answer = b; opts = G.rng.shuffle(['人', '木', '日', '月', '口', '大'].filter(x => x !== b && x !== a)).slice(0, 3); }
    const n = opts.length + 1, pos = PICK(G, 'pos' + n, Array.from({ length: n }, (_, i) => i)); opts.splice(pos, 0, answer);
    return { k: [k, rev], whole: k, a, b, rev, answer, opts };
  },
  async present(st) {
    const q = st.q, L = K.L();
    const row = st.row = ZX.thing(st, 520, 150, 6, 'item'); Object.assign(row.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' });
    const card = (k, blank) => { const c = el('div', 'card', row); Object.assign(c.style, { position: 'relative', width: '130px', height: '130px' }); if (blank) { c.style.border = '5px dashed #2B2118'; const qm = el('div', '', c); qm.innerHTML = ICONS.q; qm.style.width = qm.style.height = '56px'; } else c.appendChild(Glyph.zh(k, 104)); return c; };
    const sym = t => { const s = el('div', '', row); s.textContent = t; Object.assign(s.style, { font: '900 64px/1 system-ui', color: '#fff', webkitTextStroke: '10px #2B2118', paintOrder: 'stroke fill' }); };
    if (!q.rev) { card(q.a); sym('+'); card(q.b); sym('='); st.blank = card(null, true); }
    else { card(q.whole); sym('='); card(q.a); sym('+'); st.blank = card(null, true); }
    K.cards(st, q.opts.map(k => Glyph.zh(k, 108)), q.opts, Object.assign({ size: 140, gap: 26 }, this.cardSpot()));
    this.place(st);
    K.say(st, q.rev ? q.whole + '是' + q.a + '加什么？' : q.a + '加' + q.b + '是什么？');
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 520 } : { cx: 352, cy: 760 }; },
  place(st) { if (!st.row) return; const L = K.L(); place(st.row, L ? 300 : 92, L ? 170 : 340, L ? 660 : 520, 150); K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot())); },
  decor(G) { const L = K.L(), a = G.actors.zero; if (a) showActor(a, L ? 120 : 610, L ? 690 : 1016, L ? 290 : 190); },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 30); Sfx.zap(); Fx.burst(Stage.W / 2, 240, { n: 20, colors: ['#7FE4FF', '#FFFFFF'], dist: 130 }); sayItem(st.q.whole); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  iconNode() { const d = el('div'); d.style.display = 'flex'; d.appendChild(Glyph.zh('日', 36)); d.appendChild(Glyph.zh('月', 36)); return d; },
};
/* 葫芦娃 · 找部件: which character has 木 inside? */
const PART_IN = { 木: '林休本果杯床', 口: '叶狗', 日: '明', 月: '明', 人: '从', 火: '灯', 田: '果' };
const QPart = {
  kind0: 'part', verb: '找！', intro: '找藏起来的部件！', props: [],
  gen(G, o) {
    const lv = o.level, known = poolOf(G, 'zh', true);
    const comps = Object.keys(PART_IN).filter(c => ITEM[c] && PART_IN[c].split('').some(k => known.includes(k)));
    const comp = PICK(G, 'c', comps), withIt = PART_IN[comp].split('').filter(k => known.includes(k));
    const answer = G.rng.pick(withIt), n = lv <= 2 ? 3 : 4;
    const others = G.rng.shuffle(known.filter(k => !PART_IN[comp].includes(k) && k !== comp)).slice(0, n - 1);
    const pos = PICK(G, 'pos' + n, Array.from({ length: n }, (_, i) => i)); others.splice(pos, 0, answer);
    return { k: [comp, answer, others.join('')], comp, answer, opts: others };
  },
  async present(st) {
    const q = st.q;
    const c = st.compEl = ZX.thing(st, 150, 150, 6, 'card'); c.appendChild(Glyph.zh(q.comp, 116, '#2E6FD8')); K.pop(st, c);
    K.cards(st, q.opts.map(k => Glyph.zh(k, 108)), q.opts, Object.assign({ size: 145, gap: 26 }, this.cardSpot()));
    this.place(st);
    K.say(st, '哪个字里有' + q.comp + '？');
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 500 } : { cx: 352, cy: 740 }; },
  place(st) { if (!st.compEl) return; const L = K.L(); place(st.compEl, L ? 485 : 277, L ? 140 : 300, 150, 150); K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot())); },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 30); e.classList.add('hi'); Sfx.reveal(); sayItem(st.q.answer); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  iconNode() { const d = el('div'); d.appendChild(Glyph.zh('林', 56, '#46C27A')); return d; },
};
/* 大黄蜂 · 读单词: which word did you hear? */
const QRead = {
  kind0: 'read', verb: '读！', intro: '听一听，读一读！', props: [],
  gen(G, o) {
    const lv = o.level, w = PICK(G, 'w', CVC_WORDS.map(x => x[0])), n = lv <= 2 ? 3 : 4;
    const sim = CVC_WORDS.map(x => x[0]).filter(x => x !== w).sort((a, b) => (b.split('').filter(c => w.includes(c)).length - a.split('').filter(c => w.includes(c)).length) || (G.rng() - 0.5));
    const others = (lv >= 3 ? sim.slice(0, n - 1) : G.rng.shuffle(sim).slice(0, n - 1));
    const pos = PICK(G, 'pos' + n, Array.from({ length: n }, (_, i) => i)); others.splice(pos, 0, w);
    return { k: [w, others.join()], answer: w, opts: others };
  },
  async present(st) {
    const q = st.q;
    K.cards(st, q.opts.map(w => { const d = el('div'); Object.assign(d.style, { display: 'flex', marginTop: '-10px' }); w.split('').forEach(c => { const g = Glyph.en(c, 86); g.style.margin = '0 -9px'; d.appendChild(g); }); return d; }), q.opts, Object.assign({ size: 190, gap: 24 }, this.cardSpot()));
    K.task(st, [['speaker', 'q']]);
    st.prompt = q.answer; st.lead = '听一听';
    Voice.say('听一听', { tag: 'prompt' }); Voice.say(q.answer, { tag: 'prompt' });
  },
  cardSpot() { return K.L() ? { cx: 512, cy: 400 } : { cx: 352, cy: 560 }; },
  place(st) { K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot())); },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)], b = box(e); K.hop(st, e, 30); Sfx.reveal(); const d = ZX.thing(st, 150, 150, 32, 'objpop'); ZX.pic('assets/obj/' + CVC_OBJ[st.q.answer] + '.png', d); place(d, b.x + b.w / 2 - 75, b.y - 170, 150, 150); K.pop(st, d); Voice.say(st.q.answer, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); Voice.say(ans, { tag: 'wrong' }); await st.scope.wait(900); },
  iconNode() { const d = el('div'); d.style.display = 'flex'; 'dog'.split('').forEach(c => d.appendChild(Glyph.en(c, 36))); return d; },
};

/* ---------------------------------------------------------------- every island's four games */
const PLAYS = { peppa: PlayPuddle, bluey: PlayBalloon, huluwa: PlayGourd, paw: PlayMound, xiyou: PlayBush, ultra: PlayBeam, robot: PlayPark,
  peppa2: PlayBag, bluey2: PlaySeek, pj: PlayStars, ultra2: PlayFuse, huluwa2: PlayWater, xiyou2: PlayCloud, robot2: PlayEnergy };
const QUIZ = { peppa: QMemory, bluey: QOrder, huluwa: QMissing, paw: QHear, xiyou: QConnect, ultra: QMirror, robot: QListen,
  peppa2: QSpell, bluey2: QCase, pj: QWord2, ultra2: QFuse, huluwa2: QPart, xiyou2: Object.assign({}, QOrder, { lower: true, intro: '小写字母排队！' }), robot2: QRead };
const CASTS = { peppa: ['peppa', 'george'], bluey: ['bluey', 'bingo'], huluwa: ['gourd1', 'grandpa'], paw: ['chase', 'rubble'], xiyou: ['wukong', 'bajie'], ultra: ['ultraman'], robot: ['optimus', 'bumblebee'],
  peppa2: ['peppa', 'george'], bluey2: ['bluey', 'bingo'], pj: ['catboy', 'owlette'], ultra2: ['zero'], huluwa2: ['gourd7', 'gourd2'], xiyou2: ['wukong', 'dragon_horse'], robot2: ['bumblebee'] };
ALL_ISL().forEach(id => {
  const W = ISL[id], cast = CASTS[id], host = cast[0], w2 = W.w === 'w2', first = W.chars[0].c, firstL = W.letters[0].l;
  findGame(PLAYS[id], { id: id + ':find', world: id, bg: id + '_find', chars: cast, host, title: '认字', iconNode: () => Glyph.zh(first, 60) });
  writeGame({ id: id + ':write', world: id, lang: 'zh', bg: id + '_write', chars: cast.slice(0, 1), host, title: '写字', intro: '写一写！', iconNode: () => { const d = el('div'); d.style.position = 'relative'; d.appendChild(Glyph.zh(first, 60, '#E8414B')); return d; }, decor: writeDecor });
  writeGame({ id: id + ':abc', world: id, lang: w2 ? 'lo' : 'up', bg: id + '_abc', chars: cast.slice(0, 1), host, title: '写字母', verb: 'ABC', intro: '写字母啦！', iconNode: () => Glyph.en(firstL, 60, '#2E6FD8'), decor: writeDecor });
  zGame(QUIZ[id], { id: id + ':quiz', world: id, bg: id + '_quiz', chars: cast, host, title: '挑战', boost: 1 });
  W.games = [id + ':find', id + ':write', id + ':abc', id + ':quiz'];
});
function writeDecor(G) { const L = K.L(), a = G.actors[this.chars[0]]; if (a) showActor(a, L ? 96 : 600, L ? 698 : 330, L ? 190 : 140); }
/* practice (the treasure book): any learned character / letter, written freely */
['zh', 'up', 'lo'].forEach(kind => writeGame({ id: 'practice:' + kind, world: '', lang: kind === 'zh' ? 'zh' : kind, bg: '', chars: [], host: 'peppa', title: '练字', intro: '练一练！', verb: '练！',
  gen(G) { return { k: [G.item.k], answer: G.item.k }; }, bgOf: G => G.world + '_write' }));
