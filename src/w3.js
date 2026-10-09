/* ================================================================ 字字岛 · world 3, phase 2 (彩虹海, docs/PLAN-v2.md A.2):
   five hero islands after 天宫 and 能量站 - numbers (Hulk 一..五, Thor 六..十), colours (Black Panther), family (Black Widow),
   actions (Hawkeye). Every island has the four slots of the others: 认字, 写字 (2 of its characters + one old friend, A.4),
   英文 (words now: all 52 letters are done) and 挑战. Client rule: no play repeats a play used anywhere else in the app
   ("不允许跨世界复用玩法") - so the 15 plays here each have a rule of their own (see `rule` on each; tests/test_w3new.py
   checks that no two games share their play logic). Stars as everywhere: only the child's own first try. */

const COLORS = { 红: '#E8413A', 黄: '#FFD23C', 蓝: '#2E6FD8', 绿: '#3FAE4A', 白: '#FFFFFF' };
const INKS = { 红: '#D63B2F', 黄: '#E2A300', 蓝: '#2E6FD8', 绿: '#2F9E44', 白: '#FFFFFF' };       /* the same colours as ink on a sign */
const NUMS = '一二三四五六七八九十', COLS = '红黄蓝绿白', ACTS = '吃喝看走来';
const numOf = k => NUMS.indexOf(k) + 1;
const W3X = {
  /* the characters of one group the child can be asked about here (this island and the islands before it) */
  known(G, set) { return poolOf(G, 'zh', true).filter(k => set.includes(k)); },
  /* the island's characters still to pass first (V2R1-02) - at most twice a session, never twice in a row (W3R1-02) */
  pick(G, pool, bag) { return needPick(G, pool, bag); },
  /* the answer into a list of others at a place from a position bag (never always first) */
  put(G, others, x) { const n = others.length + 1, p = PICK(G, 'pos' + n, Array.from({ length: n }, (_, i) => i)), out = G.rng.shuffle(others); out.splice(Math.min(p, out.length), 0, x); return out; },
  /* a card to READ: the glyphs of a character / word / phrase, never said first. A tap says it - and that question then
     earns no star (the rule of 读一读, A.3), nor counts for the memory */
  readCard(st, text, h) {
    const d = ZX.thing(st, 10, 10, 7, 'item'); d.style.width = d.style.height = 'auto';
    const row = Sent.node(text, h, -1); d.appendChild(row);
    K.reg(st, 'read', d, {});
    st.readEl = d; st.readText = text;
    return d;
  },
  placeRead(st, cx, y) { const d = st.readEl; if (!d) return; const w = d.firstChild.getBoundingClientRect().width / (Stage.scale || Stage.s || 1); place(d, Math.round(cx - w / 2), y); d.style.width = 'auto'; d.style.height = 'auto'; },
  peek(st) {
    st.peeked = true; st.noStar = true;
    st.readText.split('，').forEach((x, i) => { const it = x.length === 1 ? ITEM[x] : null; (i ? Voice.say : Voice.sayNow).call(Voice, it ? it.line : x, { tag: 'peek' }); });
    K.hop(st, st.readEl, 12);
  },
  /* the written character's memory only when it was read without hearing it */
  own(st, k) { return st.noStar ? null : k; },
  /* the old friend of world 3's writing (A.4): the most due character written before, from an earlier island */
  oldFriend(G) {
    const at = ALL_ISL().indexOf(G.world), mine = G.W.chars.map(c => c.c);
    const due = k => { const m = Mem.get(k); return m && m.b > 0 ? m.due : 1e9; };
    const cand = ITEMS.filter(x => x.kind === 'zh' && x.isl && ALL_ISL().indexOf(x.isl) < at && !mine.includes(x.k) && !NOWRITE.includes(x.k) && Store.s.learned[x.k] && Store.s.learned[x.k].w > 0).map(x => x.k);
    cand.sort((a, b) => due(a) - due(b));
    return cand[0] || null;
  },
  words() { return WORDS3.map(w => w[0]); },
  clear() { return WORDS3.filter(w => w[2]).map(w => w[0]); },
  obj(w) { const x = WORDS3.find(v => v[0] === w); return x ? x[1] : w; },
  pic(w, size) { const i = img(OBJURL(this.obj(w)), ''); Object.assign(i.style, { width: size + 'px', height: size + 'px', objectFit: 'contain', pointerEvents: 'none' }); return i; },
  /* a few pictures drawn here (exact colours, no new art needed): the paint shapes, pots, lamps, the bow, the hammer */
  svgShape(kind, fill) {
    const P = {
      balloon: '<path d="M60 8C33 8 16 30 16 54C16 80 38 100 60 104C82 100 104 80 104 54C104 30 87 8 60 8Z" fill="F" stroke="#2B2118" stroke-width="5"/><path d="M53 104L67 104L63 112L57 112Z" fill="F" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M60 112C56 120 66 124 60 132" fill="none" stroke="#2B2118" stroke-width="3"/><path d="M36 40C40 30 48 24 56 22" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>',
      衣: '<path d="M38 14L22 22L6 44L22 56L30 46L30 112L90 112L90 46L98 56L114 44L98 22L82 14C78 26 70 32 60 32C50 32 42 26 38 14Z" fill="F" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>',
      云: '<path d="M30 92C14 92 6 80 8 68C10 56 22 50 34 52C36 32 54 20 72 24C86 12 108 18 112 38C126 42 120 92 104 92Z" fill="F" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>',
      叶: '<path d="M18 104C18 54 50 16 104 14C106 66 74 104 18 104Z" fill="F" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/><path d="M22 100C46 72 70 48 96 24" fill="none" stroke="#2B2118" stroke-width="4" stroke-linecap="round"/>',
      花: '<g stroke="#2B2118" stroke-width="5"><circle cx="60" cy="30" r="20" fill="F"/><circle cx="88" cy="52" r="20" fill="F"/><circle cx="78" cy="86" r="20" fill="F"/><circle cx="42" cy="86" r="20" fill="F"/><circle cx="32" cy="52" r="20" fill="F"/><circle cx="60" cy="60" r="15" fill="#FFC93C"/></g>',
    }[kind] || '';
    const d = el('div', ''); d.innerHTML = '<svg viewBox="0 0 120 136" width="100%" height="100%">' + P.replace(/fill="F"/g, 'fill="' + fill + '"') + '</svg>';
    Object.assign(d.style, { width: '100%', height: '100%', pointerEvents: 'none' });
    return d;
  },
  pot(c) { const d = el('div', ''); d.innerHTML = '<svg viewBox="0 0 100 100" width="88%" height="88%"><path d="M16 34H84L78 88C77 92 74 94 70 94H30C26 94 23 92 22 88Z" fill="#6E7B91" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/><path d="M30 44L32 84" stroke="#A9B4C6" stroke-width="5" stroke-linecap="round"/><path d="M12 30C12 20 88 20 88 30C88 42 12 42 12 30Z" fill="' + c + '" stroke="#2B2118" stroke-width="5"/><path d="M54 36C54 52 66 50 66 66C66 74 56 74 56 66C56 58 46 56 46 40Z" fill="' + c + '" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M26 27C34 24 44 23 52 23" stroke="#2B2118" stroke-width="3" stroke-linecap="round" opacity=".25"/></svg>'; Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', pointerEvents: 'none' }); return d; },
  bulb(on, style) { const c = ['#FFE14A', '#FFB03C', '#8FE8FF'][style || 0]; return '<svg viewBox="0 0 60 60" width="86%" height="86%"><circle cx="30" cy="26" r="19" fill="' + (on ? c : '#D9D4CA') + '" stroke="#2B2118" stroke-width="4"/>' + (on ? '<circle cx="30" cy="26" r="26" fill="none" stroke="' + c + '" stroke-width="4" opacity=".55"/>' : '') + '<rect x="22" y="44" width="16" height="10" rx="3" fill="#8A8F99" stroke="#2B2118" stroke-width="3"/></svg>'; },
  hammer: '<svg viewBox="0 0 80 80" width="80%" height="80%"><rect x="35" y="30" width="10" height="44" rx="4" fill="#9A6433" stroke="#2B2118" stroke-width="4"/><rect x="12" y="8" width="56" height="28" rx="7" fill="#AEB7C4" stroke="#2B2118" stroke-width="4.5"/><path d="M20 16H60" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/></svg>',
  bow: '<svg viewBox="0 0 80 80" width="82%" height="82%"><path d="M22 8C52 18 52 62 22 72" fill="none" stroke="#8E6CFF" stroke-width="7" stroke-linecap="round"/><path d="M22 8L22 72" stroke="#2B2118" stroke-width="2.5"/><path d="M14 40H66" stroke="#2B2118" stroke-width="5" stroke-linecap="round"/><path d="M62 31L76 40L62 49Z" fill="#E8413A" stroke="#2B2118" stroke-width="3.5" stroke-linejoin="round"/></svg>',
};

/* the base of the challenges with a card to read: a tap on the card says it (no star for that question), else the cards */
const ReadBase = { onGesture(st, name, p) { if (name === 'tap' && p.id === 'read' && !st.submitted) { W3X.peek(st); return 'ok'; } return ZBase.onGesture.call(this, st, name, p); } };

/* ================================================================ 认字 (find the character): five new rules */

/* 绿巨人 · 砸石头 - "find every one": the asked character is on several rocks of the wall; smash ALL of them (each right rock
   breaks, a rock with another character ends the try). A row of little rocks at the top shows how many there are. */
const PlaySmash = {
  rule: 'find-every-copy', intro: '砸碎石头！', props: ['boulder'],
  gen(G, o) { const q = FindBase.gen.call(this, G, o); q.copies = [0, 2, 2, 3, 3, 4][o.level]; q.k = q.k.concat([q.copies]); return q; },
  async present(st) {
    const q = st.q, G = st.G;
    await ZX.meet(st, q.answer);
    if (!Session.alive(st)) return;
    const copies = q.copies || 2, vals = G.rng.shuffle(q.opts.filter(k => k !== q.answer).concat(Array(copies).fill(q.answer)));
    st.vals = st.opts = vals; st.need = copies; st.got = 0; st.smashed = [];
    st.cards = vals.map((k, i) => {
      const d = ZX.thing(st, 150, 140, 6, 'item'); ZX.pic('assets/props/boulder.png', d);
      const s = ZX.sign(k, 86); Object.assign(s.style, { left: '21%', top: '16%', background: '#F4F1EA' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 50 * i);
      return d;
    });
    st.cellsL = K.cells(G.rng, vals.length, 4, 2, 0.3); st.cellsP = K.cells(G.rng, vals.length, 3, 3, 0.3);
    const t = st.tally = ZX.thing(st, copies * 50, 50, 7, 'item'); Object.assign(t.style, { display: 'flex', gap: '6px', pointerEvents: 'none' });
    for (let i = 0; i < copies; i++) { const r = img('assets/props/boulder.png', '', t); Object.assign(r.style, { width: '44px', height: '44px', filter: 'grayscale(1) opacity(.45)' }); }
    this.place(st);
    st.taskEl = K.task(st, [st.level <= 1 ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
    K.say(st, '砸碎所有的' + q.answer + '！');
  },
  place(st) {
    if (!st.cards) return;
    const L = K.L(), r = L ? { x: 190, y: 120, w: 660, h: 400 } : { x: 40, y: 260, w: 624, h: 570 }, cells = L ? st.cellsL : st.cellsP;
    st.cards.forEach((d, i) => { const [u, v] = cells[i]; place(d, r.x + u * r.w - 75, r.y + v * r.h - 70, 150, 140); });
    if (st.tally) place(st.tally, L ? 568 : 352 - st.need * 25, L ? 26 : 196, st.need * 50, 50);
  },
  decor(G) { const L = K.L(), a = G.actors.hulk; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L ? 84 : 90, L ? 698 : 1016, L ? 180 : 150); },
  onGesture(st, name, p) {
    if (name !== 'tap' || st.submitted) return false;
    const i = K.cardIndex(p.id); if (i < 0 || st.smashed.includes(i)) return false;
    if (st.vals[i] !== st.q.answer) { st.tapped = i; Sfx.tap(); Session.submit(st, st.vals[i]); return 'ok'; }
    st.smashed.push(i); st.got++;
    const e = st.cards[i], b = box(e), slot = st.tally && st.tally.children[st.got - 1];
    Sfx.thud(); Fx.burst(b.x + b.w / 2, b.y + b.h / 2, { n: 16, colors: ['#9AA0A8', '#C9CDD2', '#6E737B'], dist: 110, fall: true });
    if (slot) slot.style.filter = '';
    const h = st.G.actors.hulk; if (h) h.react('smash');
    st.scope.anim(e, [{ transform: 'scale(1) rotate(0)', opacity: 1 }, { transform: 'scale(1.15) rotate(-6deg)', opacity: 1, offset: 0.3 }, { transform: 'scale(.3) rotate(20deg)', opacity: 0 }], { duration: 380, fill: 'forwards' }).then(() => { if (!st.scope.dead) e.style.visibility = 'hidden'; });
    st.lastAt = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    if (st.got >= st.need) Session.submit(st, st.q.answer);
    return 'ok';
  },
  async reveal(st) {
    const at = st.lastAt || { x: Stage.W / 2, y: Stage.H / 2 };
    if (st.tally) K.hop(st, st.tally, 20);
    await ZX.alive(st, st.q.answer, at.x, at.y, 170);
    sayItem(st.q.answer); this.cheerAll(st);
    await st.scope.guard(Voice.afterSay(200));
  },
  nope(st, i) { const e = st.cards[i]; if (e) st.scope.anim(e, [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 300 }); },
  next(st, strat) {
    if (!st.vals) return null;
    const i = strat === 'wrong' ? st.vals.findIndex(v => v !== st.q.answer) : st.vals.findIndex((v, j) => v === st.q.answer && !st.smashed.includes(j));
    return i < 0 ? null : { g: 'tap', p: { id: 'card' + i } };
  },
  workEls(st) { return (st.cards || []).filter((c, i) => !(st.smashed || []).includes(i)); },
  snap(st) { return { opts: st.vals || null, got: st.got || 0, need: st.need || 0 }; },
};

/* 雷神 · 甩锤子 - "throw it": the storm clouds stand round Thor in a fan; flick the hammer TOWARDS the right cloud (the
   direction chooses, nothing is tapped) - its lightning breaks the cloud open. A tap on a cloud or the hammer only says how. */
const PlayHammer = {
  rule: 'flick-towards', intro: '甩锤子劈乌云！', props: ['stormcloud'], maxN: 4,
  gen(G, o) { const q = FindBase.gen.call(this, G, o); q.moving = o.level >= 5 ? 1 : 0; return q; },     /* level 5: the clouds drift */
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 180, 130, 6, 'item'); ZX.pic('assets/props/stormcloud.png', d);
      const s = ZX.sign(k, 70); Object.assign(s.style, { left: 'calc(50% - 35px)', top: '26%', background: '#F2F6FF' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 70 * i);
      if (st.level >= 5) Loops.run(d, [{ transform: 'translateX(0)' }, { transform: 'translateX(' + (i % 2 ? -30 : 30) + 'px)' }, { transform: 'translateX(0)' }], { duration: 2600 + 300 * i, easing: 'ease-in-out' });
      else Loops.run(d, [{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 1800 + 230 * i });
      return d;
    });
    const h = st.hammer = ZX.thing(st, 124, 124, 9, 'item'); h.innerHTML = W3X.hammer;
    Object.assign(h.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,.92)', boxShadow: '0 0 0 4px #2B2118, 0 0 0 10px rgba(127,228,255,.8)' });
    K.reg(st, 'hammer', h, { flick: (p, c) => this.aim(st, c), follow: true });        /* it moves with the finger, flies on letting go */
    Loops.run(h, [{ transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(-6deg)' }], { duration: 1600 });
  },
  /* the clouds nearest the flick's direction first (Input takes the first within 35 degrees) */
  aim(st, c) {
    const out = st.cards.map((e, i) => ({ id: 'card' + i, center: () => center(e) }));
    if (!c || !c.path || c.path.length < 2) return out;
    const a = c.path[c.path.length - 1], ang = Math.atan2(a.y - c.y0, a.x - c.x0);
    const d = e => { const cc = e.center(); let x = Math.atan2(cc.y - c.y0, cc.x - c.x0) - ang; while (x > Math.PI) x -= 2 * Math.PI; while (x < -Math.PI) x += 2 * Math.PI; return Math.abs(x); };
    return out.sort((p, q) => d(p) - d(q));
  },
  geo() { return K.L() ? { cx: 512, cy: 590, R: 330, a0: -165, a1: -15, w: 190, h: 140 } : { cx: 352, cy: 900, R: 330, a0: -145, a1: -35, w: 150, h: 112 }; },
  place(st) {
    if (!st.cards) return;
    const g = this.geo(), n = st.cards.length;
    st.cards.forEach((d, i) => { const a = (g.a0 + (g.a1 - g.a0) * (n === 1 ? 0.5 : i / (n - 1))) * Math.PI / 180; place(d, g.cx + g.R * Math.cos(a) - g.w / 2, g.cy + g.R * Math.sin(a) - g.h / 2, g.w, g.h); });
    if (st.hammer) { st.hammer.style.transform = ''; place(st.hammer, g.cx - 62, g.cy - 62, 124, 124); }
  },
  decor(G) { const L = K.L(), a = G.actors.thor; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L ? 360 : 190, L ? 704 : 1020, L ? 210 : 170); },
  onGesture(st, name, p) {
    if (st.submitted) return false;
    if (name === 'drop' && p.id === 'hammer') { const i = K.cardIndex(p.to); if (i < 0) return false; st.hammer.getAnimations().forEach(a => a.cancel()); st.hammer.style.transform = ''; st.tapped = i; Session.submit(st, st.opts[i]); return 'ok'; }
    if (name === 'tap' && (p.id === 'hammer' || K.cardIndex(p.id) >= 0)) {          /* how to play, never which one */
      if (st.hammer) K.wiggle(st, st.hammer);
      if (!st.toldHow || Clock.t() - st.toldHow > 4000) { st.toldHow = Clock.t(); Voice.sayNow('把锤子甩出去！', { tag: 'how' }); }
      return 'free';
    }
    return false;
  },
  async fly(st, i, back) {
    const h = st.hammer, b = box(st.cards[i]), hb = box(h);
    h.getAnimations().forEach(a => a.cancel());
    Sfx.whoosh(0.4);
    const dx = b.x + b.w / 2 - (hb.x + hb.w / 2), dy = b.y + b.h / 2 - (hb.y + hb.h / 2);
    await st.scope.anim(h, [{ transform: 'translate(0,0) rotate(0)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(540deg)' }], { duration: 420, easing: EASE.glide, fill: 'forwards' });
    if (back) await st.scope.anim(h, [{ transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(540deg)' }, { transform: 'translate(0,0) rotate(0)' }], { duration: 420, easing: EASE.glide, fill: 'forwards' });
  },
  async win(st, i) {
    const e = st.cards[i], b = box(e);
    await this.fly(st, i, false);
    const a = st.G.actors.thor; if (a) a.react('zap');
    Sfx.zap(); Fx.bolt(b.x + b.w / 2, b.y + b.h); Fx.burst(b.x + b.w / 2, b.y + b.h / 2, { n: 24, colors: ['#FFE14A', '#FFFFFF', '#7FE4FF'], dist: 140 });
    await st.scope.anim(e, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.4)', opacity: 0 }], { duration: 380, fill: 'forwards' });
    await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y + b.h / 2, 160);
  },
  nope(st, i) { this.fly(st, i, true); },
  next(st, strat) { if (!st.cards) return null; const i = strat === 'wrong' ? st.opts.findIndex(v => v !== st.q.answer) : st.opts.indexOf(st.q.answer); return { g: 'drop', p: { id: 'hammer', to: 'card' + i }, to: center(st.cards[i]) }; },
  workEls(st) { return st.hammer ? [st.hammer] : []; },
  gestureHint(st) {
    FindBase.gestureHint.call(this, st);
    if (st.hammer) st.scope.anim(st.hammer, [{ transform: 'translateY(0)' }, { transform: 'translateY(-60px) rotate(30deg)' }, { transform: 'translateY(0)' }], { duration: 700, easing: EASE.glide });
  },
};

/* 黑豹 · 跳石头 - "the colours lie": Panther leaps onto the stone with the right character. Levels 1-2 plain signs (the first
   sessions: colours are being learned); 3 the signs are painted, never in their own colour; 4 the characters themselves are
   inked in a colour that is never their own (红 written in blue ...); 5 both - read the character, not the colour (W3R1-07).
   Drag Panther along the stones and let go, or tap a stone. */
const PlayLeap = {
  rule: 'misleading-ink', intro: '黑豹跳石头！', props: ['platform'],
  gen(G, o) { const q = FindBase.gen.call(this, G, o); q.stroop = [0, 0, 0, 1, 2, 3][o.level]; return q; },
  targets(st) {
    const G = st.G, lv = st.level, n = st.opts.length, pal = Object.keys(INKS);
    /* a colour for every option that is never its own (a derangement over the colour characters) */
    let ink = null;
    for (let t = 0; t < 40 && !ink; t++) { const c = st.opts.map(() => G.rng.pick(pal)); if (st.opts.every((k, i) => c[i] !== k) && new Set(c).size >= Math.min(n, 4)) ink = c; }
    ink = ink || st.opts.map((k, i) => pal[(pal.indexOf(k) + 1 + i) % 5]);
    st.ink = ink;
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 140, 170, 6, 'item'); ZX.pic('assets/props/platform.png', d).style.top = '22%';
      const c = ink[i], c2 = pal.find(x => x !== k && x !== c && x !== '白') || c, s = el('div', 'sign');
      const paint = lv === 3 ? c : lv >= 5 ? c2 : null, inkC = lv >= 4 ? c : null;      /* never the character's own colour */
      Object.assign(s.style, { position: 'absolute', width: '96px', height: '96px', left: 'calc(50% - 48px)', top: '-2%', background: inkC === '白' ? '#3B3B4A' : paint ? this.tint(paint) : '#FFF8EC' });
      s.appendChild(Glyph.zh(k, 78, inkC ? INKS[inkC] : INK));
      d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 70 * i);
      return d;
    });
  },
  tint(c) { return { 红: '#FFC9C4', 黄: '#FFF0A8', 蓝: '#C4DAFF', 绿: '#C8F0C8', 白: '#FFFFFF' }[c] || '#FFF8EC'; },
  place(st) {
    if (!st.cards) return;
    const L = K.L(), n = st.cards.length, r = L ? { x: 250, y: 400, w: 700, h: 0 } : { x: 40, y: 730, w: 624, h: 0 }, w = L ? 140 : Math.min(140, Math.floor(r.w / n) - 16), h = Math.round(w * 170 / 140);
    st.cards.forEach((d, i) => { const x = r.x + r.w * (i + 0.5) / n; place(d, x - w / 2, r.y - h / 2 + (i % 2 ? 26 : -10), w, h); });
    this.home(st);
  },
  home(st) { const a = st.G.actors.panther; if (a && !st.leapt) { const L = K.L(); a.at(L ? 140 : 110, L ? 520 : 560); } },
  decor(G) { const L = K.L(), a = G.actors.panther; this.chars.forEach(id => hideActor(G.actors[id])); if (a) { showActor(a, L ? 140 : 110, L ? 520 : 560, L ? 200 : 170); } },
  bindRunner(st) {
    const a = st.G.actors.panther; if (!a) return;
    K.reg(st, 'runner', a.root, { slide: st.cards.map((c, i) => ({ id: 'card' + i, rect: () => box(c) })) });
  },
  async present(st) { await FindBase.present.call(this, st); if (Session.alive(st)) this.bindRunner(st); },
  onGesture(st, name, p) {
    if (st.submitted) return false;
    const a = st.G.actors.panther;
    if (name === 'pass' && p.id === 'runner') { const i = K.cardIndex(p.at); if (i >= 0 && a) { const b = box(st.cards[i]); a.at(b.x + b.w / 2, b.y + b.h * 0.25); Sfx.hop(); } return 'free'; }
    if (name === 'pick' && p.id === 'runner') { const i = K.cardIndex(p.at); if (i < 0) return false; st.tapped = i; Session.submit(st, st.opts[i]); return 'ok'; }
    if (name === 'tap' && p.id === 'runner') { if (a) a.react('pounce'); return 'free'; }
    return ZBase.onGesture.call(this, st, name, p);
  },
  async win(st, i) {
    const e = st.cards[i], b = box(e), a = st.G.actors.panther;
    st.leapt = true;
    if (a) { await a.moveTo(b.x + b.w / 2, b.y + b.h * 0.25, 480, 140); a.react('pounce'); }
    Sfx.splash(); Fx.burst(b.x + b.w / 2, b.y + b.h, { n: 16, colors: ['#7FD3FF', '#4FB3FF', '#FFFFFF'], dist: 90, fall: true });
    await ZX.alive(st, st.q.answer, b.x + b.w / 2 + (b.x > Stage.W / 2 ? -150 : 150), b.y - 40, 150);
  },
  nope(st, i) {
    const e = st.cards[i]; if (e) st.scope.anim(e, [{ transform: 'translateY(0)' }, { transform: 'translateY(14px)' }, { transform: 'translateY(0)' }], { duration: 420 });
    Sfx.splash(); this.home(st);
  },
  cleanup(st) { st.leapt = false; },
};

/* 黑寡妇 · 手电筒 - "find it in the dark": the room is dark, the characters hang on the walls; only what the torch lights can
   be seen (level 1 dim, level 5 black). Drag the torch onto the right one and let go - or tap a card: the torch goes there,
   a tap on a lit card chooses it. */
const PlayTorch = {
  rule: 'search-in-the-dark', intro: '打开手电筒找！', props: ['torch'],
  gen(G, o) { const q = FindBase.gen.call(this, G, o); q.dark = this.dark(o.level); return q; },
  dark(lv) { return [0, 0.55, 0.74, 0.88, 0.92, 0.95][lv] || 0.9; },
  rad(lv) { return [0, 150, 140, 130, 125, 115][lv] || 125; },
  targets(st) {
    st.cards = st.opts.map((k, i) => { const d = ZX.thing(st, 140, 140, 6, 'item'); const s = ZX.sign(k, 120); Object.assign(s.style, { left: '7%', top: '7%' }); d.appendChild(s); K.reg(st, 'card' + i, d, {}); return d; });
    st.cellsL = K.cells(st.G.rng, st.opts.length, 3, 2, 0.4); st.cellsP = K.cells(st.G.rng, st.opts.length, 2, 3, 0.4);
    const v = st.veil = ZX.thing(st, Stage.W, Stage.H, 25, 'item'); v.style.pointerEvents = 'none';
    const t = st.torch = ZX.thing(st, 120, 120, 28, 'item'); ZX.pic('assets/props/torch.png', t);
    Object.assign(t.style, { borderRadius: '50%', background: 'rgba(255,248,214,.9)', boxShadow: '0 0 0 4px #2B2118' });
    K.reg(st, 'torch', t, { drag: true, drops: () => st.cards.map((c, i) => ({ id: 'card' + i, rect: () => box(c) })), onDragMove: p => this.light(st, p.x, p.y) });
  },
  light(st, x, y) {
    st.lx = x; st.ly = y;
    const R = this.rad(st.level), A = this.dark(st.level);
    if (st.veil) st.veil.style.background = 'radial-gradient(circle at ' + Math.round(x) + 'px ' + Math.round(y) + 'px, rgba(10,12,34,0) 0, rgba(10,12,34,0) ' + R + 'px, rgba(10,12,34,' + A + ') ' + (R + 46) + 'px)';
  },
  lit(st, i) { const c = center(st.cards[i]); return st.lx != null && Math.hypot(c.x - st.lx, c.y - st.ly) < this.rad(st.level) * 0.75; },
  home(st) { const L = K.L(), x = L ? 512 : 352, y = L ? 616 : 920; if (st.torch) { st.torch.style.transform = ''; place(st.torch, x - 60, y - 60, 120, 120); } return { x, y: y - 40 }; },
  place(st) {
    if (!st.cards) return;
    const L = K.L(), r = L ? { x: 170, y: 120, w: 690, h: 390 } : { x: 60, y: 240, w: 584, h: 560 }, cells = L ? st.cellsL : st.cellsP;
    st.cards.forEach((d, i) => { const [u, v] = cells[i]; place(d, r.x + u * r.w - 70, r.y + v * r.h - 70, 140, 140); });
    place(st.veil, 0, 0, Stage.W, Stage.H);
    const h = this.home(st); this.light(st, h.x, h.y);
  },
  onGesture(st, name, p) {
    if (st.submitted) return false;
    if (name === 'drop' && p.id === 'torch') { const i = K.cardIndex(p.to); if (i < 0) return false; st.tapped = i; Session.submit(st, st.opts[i]); return 'ok'; }
    if (name === 'tap' && p.id === 'torch') return 'free';
    const i = name === 'tap' ? K.cardIndex(p.id) : -1; if (i < 0) return false;
    if (!this.lit(st, i)) { const c = center(st.cards[i]); this.light(st, c.x, c.y); Sfx.sparkle(); return 'free'; }       /* the torch goes there first */
    st.tapped = i; Sfx.tap(); Session.submit(st, st.opts[i]);
    return 'ok';
  },
  async win(st, i) {
    const e = st.cards[i], b = box(e);
    if (st.veil) st.scope.anim(st.veil, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
    K.hop(st, e, 30); Sfx.reveal();
    const a = st.G.actors.widow; if (a) a.react('flip');
    await ZX.alive(st, st.q.answer, b.x + b.w / 2 + (b.x > Stage.W / 2 ? -150 : 150), b.y + b.h / 2, 150);
  },
  nope(st) { const h = this.home(st); this.light(st, h.x, h.y); },
  next(st, strat) {
    if (!st.cards) return null;
    const i = strat === 'wrong' ? st.opts.findIndex(v => v !== st.q.answer) : st.opts.indexOf(st.q.answer);
    return this.lit(st, i) ? { g: 'tap', p: { id: 'card' + i } } : { g: 'drop', p: { id: 'torch', to: 'card' + i }, to: center(st.cards[i]) };
  },
  workEls(st) { return st.torch ? [st.torch] : []; },
  /* the 2nd hint: the light sweeps the whole room once (every card, the same) */
  gestureHint(st) {
    FindBase.gestureHint.call(this, st);
    if (!st.cards || st.sweeping) return; st.sweeping = true;
    const L = K.L(), y = L ? 300 : 520, x0 = 80, x1 = Stage.W - 80, t0 = now(), dur = T(1600) || 1;
    const step = () => { if (st.scope.dead) return; const k = Math.min(1, (now() - t0) / dur); this.light(st, x0 + (x1 - x0) * k, y); if (k < 1) requestAnimationFrame(step); else { st.sweeping = false; const h = this.home(st); this.light(st, h.x, h.y); } };
    step();
  },
};

/* 鹰眼 · 射箭 - "aim, then shoot": tap a target to aim at it (the line shows where the arrow will go; aim again as often as
   you like), then press the bow to shoot. Only the shot counts. */
const PlayAim = {
  rule: 'aim-then-shoot', intro: '瞄准，射箭！', props: ['target'],
  targets(st) {
    st.aim = null;
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 150, 180, 6, 'item'); ZX.pic('assets/props/target.png', d);
      const s = ZX.sign(k, 74); Object.assign(s.style, { left: 'calc(50% - 37px)', top: '16%', borderRadius: '50%' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 70 * i);
      return d;
    });
    const f = st.fire = ZX.thing(st, 130, 130, 30, 'item'); f.innerHTML = W3X.bow;
    Object.assign(f.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 4px #2B2118, 0 0 0 10px rgba(142,108,255,.6)' });
    K.reg(st, 'fire', f, {});
    st.aimSvg = K.lines(st);
  },
  place(st) {
    if (!st.cards) return;
    const L = K.L(), n = st.cards.length, r = L ? { x: 270, y: 250, w: 700 } : { x: 30, y: 430, w: 644 }, w = L ? 150 : Math.min(150, Math.floor(r.w / n) - 14), h = Math.round(w * 1.2);
    st.cards.forEach((d, i) => place(d, r.x + r.w * (i + 0.5) / n - w / 2, r.y - h / 2 + (i % 2 ? 40 : 0), w, h));
    place(st.fire, L ? 250 : 287, L ? 500 : 730, 130, 130);
    this.drawAim(st);
  },
  decor(G) { const L = K.L(), a = G.actors.hawkeye; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L ? 110 : 120, L ? 700 : 1016, L ? 230 : 180); },
  drawAim(st) {
    const s = st.aimSvg; if (!s) return; s.innerHTML = '';
    st.cards.forEach((c, i) => c.classList.toggle('hi', i === st.aim));
    if (st.aim == null) return;
    const a = center(st.fire), b = center(st.cards[st.aim]);
    svg('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#8E6CFF', 'stroke-width': 7, 'stroke-dasharray': '4 16', 'stroke-linecap': 'round' }, s);
  },
  onGesture(st, name, p) {
    if (name !== 'tap' || st.submitted) return false;
    if (p.id === 'fire') {
      if (st.aim == null) { K.wiggle(st, st.fire); Voice.sayNow('先瞄准一个靶子！', { tag: 'how' }); return 'free'; }
      st.tapped = st.aim; Session.submit(st, st.opts[st.aim]); return 'ok';
    }
    const i = K.cardIndex(p.id); if (i < 0) return false;
    st.aim = i; Sfx.tap(); this.drawAim(st);
    const a = st.G.actors.hawkeye; if (a) a.lookAt(center(st.cards[i]).x, center(st.cards[i]).y);
    return 'ok';
  },
  async shoot(st, i) {
    const a = center(st.fire), b = center(st.cards[i]);
    const s = K.lines(st), g = svg('g', {}, s);
    svg('path', { d: 'M-40 0H30', stroke: '#2B2118', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    svg('path', { d: 'M26 -10L46 0L26 10Z', fill: '#E8413A', stroke: '#2B2118', 'stroke-width': 3 }, g);
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    Sfx.whoosh(0.3); const h = st.G.actors.hawkeye; if (h) h.react('aim');
    await st.scope.anim(g, [{ transform: 'translate(' + a.x + 'px,' + a.y + 'px) rotate(' + ang + 'deg)' }, { transform: 'translate(' + b.x + 'px,' + b.y + 'px) rotate(' + ang + 'deg)' }], { duration: 360, easing: EASE.glide, fill: 'forwards' });
    return g;
  },
  async win(st, i) { const e = st.cards[i], b = box(e); await this.shoot(st, i); Sfx.thud(); K.hop(st, e, 24); Fx.burst(b.x + b.w / 2, b.y + b.h * 0.4, { n: 18, dist: 110 }); await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y - 50, 140); },
  nope(st, i) { this.shoot(st, i).then(g => { if (g && !st.scope.dead) st.scope.anim(g, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(60px)' }], { duration: 400, fill: 'forwards' }); }); st.aim = null; this.drawAim(st); },
  next(st, strat) {
    if (!st.cards) return null;
    const want = strat === 'wrong' ? st.opts.findIndex(v => v !== st.q.answer) : st.opts.indexOf(st.q.answer);
    return st.aim === want ? { g: 'tap', p: { id: 'fire' } } : { g: 'tap', p: { id: 'card' + want } };
  },
  workEls(st) { return (st.cards || []).concat(st.fire ? [st.fire] : []); },
  gestureHint(st) { FindBase.gestureHint.call(this, st); if (st.fire) K.hop(st, st.fire, 20); Voice.say('先瞄准，再射箭！', { tag: 'prompt' }); },
  cleanup(st) { st.aim = null; },
};

/* ================================================================ 英文: words now (CVC words with a picture and a recording,
   docs/PLAN-v2.md A.5). The base: picture cards / letter cards, the word said by the American voice. */
const EnBase = {
  kind0: 'en', verb: 'ABC', boost: 0,
  itemOf() { return null; },
  picCards(st, words, opt) { return K.cards(st, words.map(w => W3X.pic(w, (opt.size || 160) * 0.84)), words, Object.assign({ cls: 'pic' }, opt)); },
  letterCards(st, letters, opt) { return K.cards(st, letters.map(l => Glyph.en(l, (opt.size || 150) * 0.7)), letters, opt); },
  bigPic(st, w, size) { const d = ZX.thing(st, size, size, 6, 'card'); d.classList.add('pic'); d.appendChild(W3X.pic(w, size * 0.84)); K.pop(st, d); return d; },
  async feedback(st, ans) { const e = st.cards && st.cards[st.tapped]; if (e) K.wiggle(st, e); if (this.wrongLine) this.wrongLine(st, ans); await st.scope.wait(900); },
  onGesture(st, name, p) { if (name !== 'tap' || st.picked) return false; const i = K.cardIndex(p.id); if (i < 0) return false; st.picked = true; st.tapped = i; Sfx.tap(); Session.submit(st, st.opts[i]); return 'ok'; },
};

/* the 2nd hint of the English games (W3R1-03): the question once more, slowly, its pieces lit one by one. That only says the
   question again, so it costs no star (softHint) - except where the question itself never said the word (level 5): there
   saying it IS help (st.realHelp) */
const EnHint = {
  async again(st, lines, els) {
    if (st.hintDone) return; st.hintDone = true;
    try {
      for (let i = 0; i < lines.length; i++) { if (!Session.alive(st)) return; if (els && els[i]) K.hop(st, els[i], 22); Voice.say(lines[i], { tag: 'hint2' }); await st.scope.guard(Voice.afterSay(80)); }
    } catch (e) { /* a hint never ends a question */ }
  },
};
/* the challenges with a card to read: the 2nd hint is the reminder of 读一读 - "you can tap it to hear it" - never the word
   itself; a reminder costs no star (W3R1-03, V2R2-04) */
const ReadHint = { softHint: true, gestureHint(st) { if (st.hintDone || !st.readEl) return; st.hintDone = true; K.hop(st, st.readEl, 16); Voice.say('可以点字听听！', { tag: 'prompt' }); } };

/* 绿巨人 · 押韵 - "which one rhymes": the word, then each picture is named; tap the one that sounds like it at the end
   (cat - bat). Levels (W3R1-01): 1 three pictures; 2 one of them STARTS like the word (cat - cup: the same start is no rhyme);
   3 four pictures; 4 two more share its vowel (cat - bag: only the whole ending tells); 5 five pictures. */
const ERhyme = {
  rule: 'rhyme', intro: '押韵找朋友！', softHint: true,
  gen(G, o) {
    const lv = o.level, words = W3X.words(), rime = w => w.slice(1), fam = {};
    words.forEach(w => (fam[rime(w)] = fam[rime(w)] || []).push(w));
    const n = [0, 3, 3, 4, 4, 5][lv], allit = lv >= 2, vow = [0, 0, 0, 0, 2, 3][lv];
    const noR = T => words.filter(x => rime(x) !== rime(T));
    const ok = T => fam[rime(T)].length >= 2 && (!allit || noR(T).some(x => x[0] === T[0])) && noR(T).filter(x => x[1] === T[1] && x[0] !== T[0]).length >= vow;
    const T = bagFrom(G, 'w', words.filter(ok)), R = G.rng.pick(fam[rime(T)].filter(w => w !== T));
    const objs = new Set([W3X.obj(T), W3X.obj(R)]), others = [];
    const add = x => { if (others.length < n - 1 && !others.includes(x) && !objs.has(W3X.obj(x))) { objs.add(W3X.obj(x)); others.push(x); return true; } return false; };
    let a = 0, v = 0;
    if (allit) G.rng.shuffle(noR(T).filter(x => x[0] === T[0])).some(x => add(x) && ++a);
    G.rng.shuffle(noR(T).filter(x => x[1] === T[1] && x[0] !== T[0])).forEach(x => { if (v < vow && add(x)) v++; });
    G.rng.shuffle(noR(T).filter(x => x[1] !== T[1] && x[0] !== T[0])).forEach(add);
    return { k: [T, R, others.join()], target: T, answer: R, opts: W3X.put(G, others, R), allit: a, vow: v };
  },
  async present(st) {
    const q = st.q;
    st.top = this.bigPic(st, q.target, 160);
    this.picCards(st, q.opts, Object.assign({ size: 150, gap: 26 }, this.cardSpot()));
    this.place(st);
    st.lead = [q.target]; st.prompt = '谁和它押韵？';
    Voice.say(q.target, { tag: 'prompt' }); Voice.say('谁和它押韵？', { tag: 'prompt' });
    await st.scope.guard(Voice.afterSay(150));
    for (let i = 0; i < q.opts.length; i++) {           /* every picture named, one by one (the child need not know the word) */
      if (!Session.alive(st)) return;
      K.hop(st, st.cards[i], 26); Voice.say(q.opts[i], { tag: 'prompt' });
      await st.scope.guard(Voice.afterSay(120));
    }
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 400 } : { cx: 352, cy: 700 }; },
  place(st) { const L = K.L(); if (st.top) place(st.top, L ? 480 : 272, L ? 80 : 230, 160, 160); K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot())); },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 30); K.hop(st, st.top, 30); Sfx.reveal(); Voice.say(st.q.target, { tag: 'summary' }); Voice.say(st.q.answer, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  wrongLine(st, ans) { Voice.say(ans, { tag: 'wrong' }); Voice.say(st.q.target, { tag: 'wrong' }); },
  gestureHint(st) { EnHint.again(st, [st.q.target].concat(st.q.opts), [st.top].concat(st.cards || [])); },
  iconNode() { return Glyph.word('hat', 44); },
};

/* 雷神 · 补元音 - "the middle sound": c _ t under the picture; which vowel goes in the gap? Levels: 2, 3, 4, 5 vowels to choose
   from; level 5 the word is not said - the child names the picture (only pictures called by that very word). */
const VOWELS = 'aeiou';
const EVowel = {
  rule: 'missing-vowel', intro: '补上中间的字母！', softHint: true,
  gen(G, o) {
    const lv = o.level, n = [0, 2, 3, 4, 5, 5][lv], quiet = lv >= 5;
    const w = bagFrom(G, 'w', quiet ? W3X.clear() : W3X.words()), v = w[1];
    const others = G.rng.shuffle(VOWELS.split('').filter(x => x !== v)).slice(0, n - 1);
    return { k: [w, others.join(''), quiet], word: w, answer: v, opts: W3X.put(G, others, v), quiet: quiet ? 1 : 0 };
  },
  itemOf(st) { return st.q.answer; },
  async present(st) {
    const q = st.q;
    st.top = this.bigPic(st, q.word, 190);
    st.slots = q.word.split('').map((c, i) => { const d = ZX.thing(st, 110, 110, 6, 'card'); if (i === 1) { Object.assign(d.style, { border: '5px dashed #2B2118', background: 'rgba(255,255,255,.7)' }); } else d.appendChild(Glyph.en(c, 84)); K.pop(st, d, 60 * i); return d; });
    this.letterCards(st, q.opts, Object.assign({ size: 140, gap: 26 }, this.cardSpot()));
    this.place(st);
    st.prompt = '缺了哪个字母？';
    if (!q.quiet) { st.lead = q.word; Voice.say(q.word, { tag: 'prompt' }); }
    Voice.say('缺了哪个字母？', { tag: 'prompt' });
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 540 } : { cx: 352, cy: 830 }; },
  place(st) {
    if (!st.top) return;
    const L = K.L();
    place(st.top, L ? 230 : 257, L ? 110 : 200, 190, 190);
    st.slots.forEach((d, i) => { if (!d._in) place(d, (L ? 680 : 352) - 178 + i * 126, L ? 150 : 430, 110, 110); });
    K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot()));
  },
  async reveal(st) {
    const e = st.cards[st.opts.indexOf(st.q.answer)], s = box(st.slots[1]), b = box(e);
    await K.flyTo(st, e, s.x + (s.w - b.w) / 2, s.y + (s.h - b.h) / 2, 380, 50, s.w / b.w);
    const a = st.G.actors.thor; if (a) a.react('zap');
    Sfx.reveal(); K.hop(st, st.top, 30); Voice.say(st.q.word, { tag: 'summary' }); this.cheerAll(st);
    await st.scope.guard(Voice.afterSay(200));
  },
  wrongLine(st, ans) { if (ITEM[ans.toUpperCase()]) Voice.say(ITEM[ans.toUpperCase()].say, { tag: 'wrong' }); },
  gestureHint(st) { if (st.q.quiet && !st.hintDone) st.realHelp = true; EnHint.again(st, [st.q.word, '缺了哪个字母？'], [st.top, st.slots && st.slots[1]]); },
  iconNode() { const d = el('div'); d.style.display = 'flex'; d.style.alignItems = 'center'; d.appendChild(Glyph.en('c', 34)); const b = el('div', '', d); Object.assign(b.style, { width: '22px', height: '30px', border: '3px dashed #2B2118', borderRadius: '6px', margin: '0 3px' }); d.appendChild(Glyph.en('t', 34)); return d; },
};

/* 黑豹 · 首字母 - "the first sound": the picture and its word (said, not written); which letter does it start with? Levels:
   1 three letters, 2 four, 3 the one that looks alike is there too (b / d, p / q, m / n), 4 five, 5 the word is not said. */
const EFirst = {
  rule: 'first-letter', intro: '第一个字母是谁？', softHint: true,
  gen(G, o) {
    const lv = o.level, n = [0, 3, 4, 4, 5, 5][lv], look = lv >= 3, quiet = lv >= 5;
    const lk = w => (LOOKEN[w[0]] || '').split('').filter(x => /[a-z]/.test(x) && ITEM[x]);
    let words = quiet ? W3X.clear() : W3X.words(); if (look) words = words.filter(w => lk(w).length);
    const w = bagFrom(G, 'w', words), a = w[0], others = [];
    const add = x => { if (others.length < n - 1 && x !== a && !others.includes(x) && ITEM[x] && (look || !lk(w).includes(x))) others.push(x); };
    if (look) lk(w).forEach(add);
    G.rng.shuffle(W3X.words().map(x => x[0])).forEach(add);
    G.rng.shuffle('abcdefghijklmnoprstuvwxyz'.split('')).forEach(add);
    return { k: [w, others.join(''), quiet], word: w, answer: a, opts: W3X.put(G, others, a), look: others.filter(x => lk(w).includes(x)).length, quiet: quiet ? 1 : 0 };
  },
  itemOf(st) { return st.q.answer; },
  async present(st) {
    const q = st.q;
    st.top = this.bigPic(st, q.word, 230);
    this.letterCards(st, q.opts, Object.assign({ size: 140, gap: 26 }, this.cardSpot()));
    this.place(st);
    st.prompt = '第一个字母是？';
    if (!q.quiet) { st.lead = q.word; Voice.say(q.word, { tag: 'prompt' }); }
    Voice.say('第一个字母是？', { tag: 'prompt' });
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 530 } : { cx: 352, cy: 800 }; },
  place(st) { const L = K.L(); if (st.top) place(st.top, L ? 445 : 237, L ? 110 : 250, 230, 230); K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot())); },
  async reveal(st) {
    const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 30); K.hop(st, st.top, 20); Sfx.reveal();
    const a = st.G.actors.panther; if (a) a.react('pounce');
    Voice.say(ITEM[st.q.answer.toUpperCase()].say, { tag: 'summary' }); Voice.say(st.q.word, { tag: 'summary' }); this.cheerAll(st);
    await st.scope.guard(Voice.afterSay(200));
  },
  wrongLine(st, ans) { if (ITEM[ans.toUpperCase()]) Voice.say(ITEM[ans.toUpperCase()].say, { tag: 'wrong' }); },
  gestureHint(st) { if (st.q.quiet && !st.hintDone) st.realHelp = true; EnHint.again(st, [st.q.word, '第一个字母是？'], [st.top]); },
  iconNode() { const d = el('div'); d.style.display = 'flex'; d.appendChild(Glyph.en('b', 44)); d.appendChild(Glyph.en('d', 44)); return d; },
};

/* 黑寡妇 · 密码单词 - "read the secret word": the word is written, never said; tap the picture it names. A tap on the word
   says it - that question then earns no star (as 读一读). Levels: 1 three pictures of quite different words; 2 one of them
   differs in one letter; 3 both do (cat · hat · bat); 4 four pictures; 5 five. */
const ESecret = {
  rule: 'read-word-silently', intro: '读密码单词！', softHint: true,
  gen(G, o) {
    const lv = o.level, n = [0, 3, 3, 3, 4, 5][lv], want = [0, 0, 1, 2, 2, 2][lv], words = W3X.words();
    const d1 = (a, b) => a.split('').filter((c, i) => c !== b[i]).length === 1, nb = w => words.filter(x => d1(w, x) && W3X.obj(x) !== W3X.obj(w));
    const w = bagFrom(G, 'w', words.filter(x => nb(x).length >= want)), objs = new Set([W3X.obj(w)]), others = [];
    const add = x => { if (others.length < n - 1 && x !== w && !others.includes(x) && !objs.has(W3X.obj(x))) { objs.add(W3X.obj(x)); others.push(x); } };
    G.rng.shuffle(nb(w)).slice(0, want).forEach(add);
    const share = x => x.split('').some((c, i) => c === w[i]), rest = G.rng.shuffle(words.filter(x => !d1(w, x)));
    (lv >= 4 ? rest.filter(share).concat(rest.filter(x => !share(x))) : rest.filter(x => !share(x)).concat(rest.filter(share))).forEach(add);
    return { k: [w, others.join()], answer: w, opts: W3X.put(G, others, w), near: others.filter(x => d1(w, x)).length };
  },
  async present(st) {
    const q = st.q;
    st.peeked = false;
    const note = st.note = ZX.thing(st, 330, 150, 7, 'card'); note.style.background = '#FFF6D8'; note.appendChild(Glyph.word(q.answer, 92));
    K.reg(st, 'word', note, {}); K.pop(st, note);
    this.picCards(st, q.opts, Object.assign({ size: 170, gap: 26 }, this.cardSpot()));
    this.place(st);
    st.prompt = '读单词，找图！'; Voice.say('读单词，找图！', { tag: 'prompt' });
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 400 } : { cx: 352, cy: 700 }; },
  place(st) { const L = K.L(); if (st.note) place(st.note, (L ? 560 : 352) - 165, L ? 100 : 250, 330, 150); K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot())); },
  onGesture(st, name, p) {
    if (name === 'tap' && p.id === 'word' && !st.submitted) { st.peeked = true; st.noStar = true; Voice.sayNow(st.q.answer, { tag: 'peek' }); K.hop(st, st.note, 12); return 'ok'; }
    return EnBase.onGesture.call(this, st, name, p);
  },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 30); K.hop(st, st.note, 20); Sfx.reveal(); Voice.say(st.q.answer, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  wrongLine(st, ans) { Voice.say(ans, { tag: 'wrong' }); },
  gestureHint(st) { if (st.hintDone || !st.note) return; st.hintDone = true; K.hop(st, st.note, 16); Voice.say('可以点单词听听！', { tag: 'prompt' }); },
  iconNode() { return Glyph.word('map', 44); },
};

/* 鹰眼 · 我看见 (I spy) - "something beginning with ...": a letter is said and shown; which picture's word starts with it?
   The pictures are not named (only words a 4-year-old calls by that very name). Levels: 1 three pictures; 2 four; 3 another
   picture has the letter at its end or inside (b: web); 4 five pictures; 5 one starts with a letter that looks alike (b / d). */
const ESpy = {
  rule: 'i-spy-first-letter', intro: '我看见……', softHint: true,
  gen(G, o) {
    const lv = o.level, clear = W3X.clear(), n = [0, 3, 4, 4, 5, 5][lv], trap = lv >= 3, look = lv >= 5, lk = L => (LOOKEN[L] || '').split('');
    const okL = L => clear.some(x => x[0] === L) && (!trap || clear.some(x => x[0] !== L && x.includes(L))) && (!look || clear.some(x => lk(L).includes(x[0])));
    const L = bagFrom(G, 'l', Array.from(new Set(clear.map(w => w[0]))).filter(okL)), w = G.rng.pick(clear.filter(x => x[0] === L));
    const others = [], used = new Set([L]), add = x => { if (others.length < n - 1 && !used.has(x[0])) { used.add(x[0]); others.push(x); return true; } return false; };
    const traps = trap ? clear.filter(x => x[0] !== L && x.includes(L)) : [], isT = x => x.includes(L), isK = x => lk(L).includes(x[0]);
    if (look) { const both = traps.filter(isK); if (both.length) add(G.rng.pick(both)); }          /* bed for d: ends with d, starts like it */
    if (trap && !others.some(isT)) G.rng.shuffle(traps).some(add);
    if (look && !others.some(isK)) G.rng.shuffle(clear.filter(isK)).some(add);
    G.rng.shuffle(clear.filter(x => x[0] !== L && !isT(x) && !isK(x))).forEach(add);
    return { k: [L, w, others.join()], letter: L, answer: w, opts: W3X.put(G, others, w), trap: others.some(isT) ? 1 : 0, look: others.some(isK) ? 1 : 0 };
  },
  itemOf(st) { return st.q.letter; },
  async present(st) {
    const q = st.q;
    const big = st.top = ZX.thing(st, 160, 160, 6, 'card'); big.appendChild(Glyph.en(q.letter, 124)); K.pop(st, big);
    this.picCards(st, q.opts, Object.assign({ size: 150, gap: 24 }, this.cardSpot()));
    this.place(st);
    st.lead = '谁的第一个字母是'; st.prompt = ITEM[q.letter.toUpperCase()].say;
    Voice.say('谁的第一个字母是', { tag: 'prompt' }); Voice.say(st.prompt, { tag: 'prompt' });
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 410 } : { cx: 352, cy: 720 }; },
  place(st) { const L = K.L(); if (st.top) place(st.top, L ? 480 : 272, L ? 90 : 250, 160, 160); K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot())); },
  async reveal(st) {
    const e = st.cards[st.opts.indexOf(st.q.answer)], b = box(e); K.hop(st, e, 30); Sfx.reveal();
    const a = st.G.actors.hawkeye; if (a) a.react('aim');
    Fx.burst(b.x + b.w / 2, b.y + b.h / 2, { n: 14, dist: 90 });
    Voice.say(st.q.answer, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200));
  },
  wrongLine(st, ans) { Voice.say(ans, { tag: 'wrong' }); },
  gestureHint(st) { EnHint.again(st, ['谁的第一个字母是', st.prompt], [null, st.top]); },
  iconNode() { const d = el('div'); d.innerHTML = ICONS.eye; const s = d.firstChild; s.setAttribute('width', 60); s.setAttribute('height', 60); return d; },
};

/* ================================================================ 挑战: what the new characters MEAN */

/* 绿巨人 · 数一数 - things on a board; how many? tap the character. Levels: 1 three numbers to choose, the things in rows;
   2 four; 3 scattered, and one more / one fewer among the choices; 4 five; 5 two groups - how many in all? */
const COUNTABLE = ['apple', 'ball', 'star', 'fish', 'duck', 'cat', 'strawberry', 'banana', 'car', 'bird'];
const QCount = {
  kind0: 'count', verb: '数！', intro: '数一数！', rule: 'count-to-character', props: [], softHint: true,
  gen(G, o) {
    const lv = o.level, pool = W3X.known(G, NUMS), answer = W3X.pick(G, pool), n = numOf(answer), m = Math.min(pool.length, [0, 3, 4, 4, 5, 5][lv]);
    const near = pool.filter(k => Math.abs(numOf(k) - n) === 1), far = pool.filter(k => k !== answer && !near.includes(k));
    const others = (lv >= 3 ? G.rng.shuffle(near).concat(G.rng.shuffle(far)) : G.rng.shuffle(far).concat(G.rng.shuffle(near))).slice(0, m - 1);
    const thing = PICK(G, 'thing', COUNTABLE), scatter = lv >= 3, groups = lv >= 5 && n >= 2, a = groups ? G.rng.int(1, n - 1) : n;
    const cells = groups ? K.cells(G.rng, a, 2, 3, 0.4).map(([u, v]) => [u * 0.42, v]).concat(K.cells(G.rng, n - a, 2, 3, 0.4).map(([u, v]) => [0.58 + u * 0.42, v])) : scatter ? K.cells(G.rng, n, 4, 3, 0.5) : null;
    return { k: [answer, thing, others.join(''), a], answer, n, thing, scatter: scatter ? 1 : 0, groups: groups ? 1 : 0, cells, opts: W3X.put(G, others, answer), near: others.filter(k => near.includes(k)).length };
  },
  async present(st) {
    const q = st.q;
    const b = st.board = ZX.thing(st, 440, 300, 6, 'item'); Object.assign(b.style, { background: 'rgba(255,255,255,.93)', borderRadius: '28px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.22)' });
    if (q.groups) { const dv = el('div', '', b); Object.assign(dv.style, { position: 'absolute', left: 'calc(50% - 3px)', top: '12%', width: '6px', height: '76%', borderRadius: '3px', background: 'rgba(43,33,24,.18)' }); }
    st.things = Array.from({ length: q.n }, () => { const i = img(OBJURL(q.thing), '', b); Object.assign(i.style, { position: 'absolute', objectFit: 'contain' }); return i; });
    K.cards(st, q.opts.map(k => Glyph.zh(k, 104)), q.opts, Object.assign({ size: 140, gap: 26 }, this.cardSpot()));
    this.place(st); K.pop(st, b);
    K.say(st, q.groups ? '一共有几个？' : '有几个？');
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 560 } : { cx: 352, cy: 800 }; },
  place(st) {
    if (!st.board) return;
    const L = K.L(), W = L ? 460 : 520, H = L ? 320 : 380, q = st.q;
    place(st.board, (L ? 560 : 352) - W / 2, L ? 110 : 240, W, H);
    const rows = q.n > 5 ? [5, q.n - 5] : q.n <= 3 ? [q.n] : q.n === 4 ? [2, 2] : [3, 2], s = Math.min(110, W / 5.6, H / (rows.length + 0.8));
    let k = 0;
    if (!q.cells) rows.forEach((c, r) => { for (let i = 0; i < c; i++) { const t = st.things[k++]; Object.assign(t.style, { width: s + 'px', height: s + 'px', left: (W / 2 + (i - (c - 1) / 2) * s * 1.15 - s / 2) + 'px', top: (H / 2 + (r - (rows.length - 1) / 2) * s * 1.15 - s / 2) + 'px' }); } });
    else { const z = Math.min(q.groups ? 78 : 86, W / 5, H / 3.6); st.things.forEach((t, i) => { const [u, v] = q.cells[i]; Object.assign(t.style, { width: z + 'px', height: z + 'px', left: (u * (W - 20) + 10 - z / 2) + 'px', top: (v * (H - 20) + 10 - z / 2) + 'px' }); }); }
    K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot()));
  },
  async reveal(st) {
    const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 30);
    for (let i = 0; i < st.things.length; i++) { if (st.ff || st.scope.dead) break; Sfx.count(i + 1); st.scope.anim(st.things[i], [{ transform: 'scale(1)' }, { transform: 'scale(1.35) translateY(-10px)' }, { transform: 'scale(1)' }], { duration: 260 }); await st.scope.wait(170); }
    const a = st.G.actors.hulk; if (a) a.react('smash');
    sayItem(st.q.answer); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200));
  },
  async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); if (ITEM[ans]) Voice.say(ITEM[ans].line, { tag: 'wrong' }); await st.scope.wait(900); },
  /* the 2nd hint: the question again and the board lit (no counting aloud - that would be the answer) */
  gestureHint(st) { if (st.hintDone || !st.board) return; st.hintDone = true; K.hop(st, st.board, 14); Voice.say(st.q.groups ? '一共有几个？' : '有几个？', { tag: 'prompt' }); },
  iconNode() { const d = el('div'); d.style.display = 'flex'; d.style.alignItems = 'center'; d.appendChild(Glyph.zh('三', 46)); const i = img(OBJURL('num3'), '', d); i.style.width = i.style.height = '40px'; return d; },
};

/* 雷神 · 十格灯 - "make that many": a number is shown (read, not said); light exactly that many lamps (a tap lights a lamp,
   another tap puts it out), then press ✓. The answer is built, not chosen. Levels (W3R1-01): 1 the island's numbers and the
   first row already lit (add the rest); 2 the island's numbers; 3 any number 1-10; 4 the lamps scattered, no frame to count
   by; 5 some lamps already lit at random - make it exactly that many. */
const QFrame = Object.assign({}, ReadHint, {
  kind0: 'frame', verb: '点灯！', intro: '点灯！', rule: 'build-the-number', props: [],
  gen(G, o) {
    const lv = o.level, own = poolOf(G, 'zh', false).filter(k => NUMS.includes(k)), all = W3X.known(G, NUMS);
    const answer = W3X.pick(G, lv >= 3 ? all : own, lv >= 3 ? 'all' : 'ans'), n = numOf(answer);
    const help = lv <= 1 && n > 5 ? 5 : 0, scatter = lv >= 4, mess = lv >= 5;
    let pre = help ? [0, 1, 2, 3, 4] : [];
    if (mess) { let k; do { k = G.rng.int(1, 9); } while (k === n); pre = G.rng.shuffle(Array.from({ length: 10 }, (_, i) => i)).slice(0, k); }
    const cells = scatter ? K.cells(G.rng, 10, 5, 3, 0.45) : null;
    const style = G.rng.int(0, 2);       /* the lamps' colour: the same number twice in a session is still another question (W3R1-02) */
    return { k: [answer, help, pre.join(','), cells ? cells.map(c => c.map(v => v.toFixed(2)).join(':')).join(';') : 'frame', style], answer, n, help, pre, cells, style, range: lv >= 3 ? 1 : 0, scatter: scatter ? 1 : 0, mess: mess ? 1 : 0 };
  },
  itemOf(st) { return W3X.own(st, st.q.answer); },
  async present(st) {
    const q = st.q;
    st.on = Array.from({ length: 10 }, (_, i) => q.pre.includes(i)); st.peeked = false;
    W3X.readCard(st, q.answer, 150); K.pop(st, st.readEl);
    st.lamps = st.on.map((on, i) => { const d = ZX.thing(st, 100, 100, 6, 'card'); d.innerHTML = W3X.bulb(on, q.style); K.reg(st, 'L' + i, d, {}); K.pop(st, d, 30 * i); return d; });
    st.doneEl = K.done(st, 'check', 0, 0, 120); K.reg(st, 'done', st.doneEl, {});
    this.place(st);
    K.say(st, '点亮这么多灯！');
  },
  place(st) {
    if (!st.lamps) return;
    const L = K.L(), s = 100, q = st.q;
    if (q.cells) { const r = L ? { x: 320, y: 100, w: 560, h: 420 } : { x: 40, y: 360, w: 624, h: 400 }; st.lamps.forEach((d, i) => { const [u, v] = q.cells[i]; place(d, r.x + u * r.w - s / 2, r.y + v * r.h - s / 2, s, s); }); }
    else { const g = 18, x0 = L ? 360 : 352 - (5 * s + 4 * g) / 2, y0 = L ? 170 : 430; st.lamps.forEach((d, i) => place(d, x0 + (i % 5) * (s + g), y0 + Math.floor(i / 5) * (s + g), s, s)); }
    W3X.placeRead(st, L ? 190 : 352, L ? 200 : 210);
    st.doneEl._done = { size: 120, x: L ? (q.cells ? 890 : 780) : 292, y: L ? (q.cells ? 540 : 440) : (q.cells ? 790 : 720) }; K.placeDone(st.doneEl);
  },
  decor(G) { const L = K.L(), a = G.actors.thor; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L ? 110 : 110, L ? 700 : 1016, L ? 200 : 160); },
  onGesture(st, name, p) {
    if (name !== 'tap' || st.submitted) return false;
    if (p.id === 'read') { W3X.peek(st); return 'ok'; }
    if (p.id === 'done') {
      const n = st.on.filter(Boolean).length;
      if (!n) { K.wiggle(st, st.doneEl); Voice.sayNow('先点亮灯！', { tag: 'how' }); return 'free'; }
      Session.submit(st, n); return 'ok';
    }
    const m = /^L(\d)$/.exec(p.id || ''); if (!m) return false;
    const i = Number(m[1]); st.on[i] = !st.on[i]; st.lamps[i].innerHTML = W3X.bulb(st.on[i], st.q.style);
    if (st.on[i]) Sfx.count(st.on.filter(Boolean).length); else Sfx.back();
    return 'ok';
  },
  evaluate(st, ans) { return ans === st.q.n; },
  async reveal(st) {
    const lit = st.lamps.filter((_, i) => st.on[i]);
    for (let i = 0; i < lit.length; i++) { if (st.ff || st.scope.dead) break; st.scope.anim(lit[i], [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 240 }); Sfx.count(i + 1); await st.scope.wait(150); }
    const a = st.G.actors.thor; if (a) a.react('zap');
    sayItem(st.q.answer); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200));
  },
  async feedback(st, ans) { if (st.doneEl) K.wiggle(st, st.doneEl); Voice.say('亮了' + CNQ(ans) + '盏灯', { tag: 'wrong' }); await st.scope.wait(900); },
  next(st, strat) {
    if (!st.lamps) return null;
    const want = strat === 'wrong' ? (st.q.n === 10 ? 9 : st.q.n + 1) : st.q.n, n = st.on.filter(Boolean).length;
    if (n < want) return { g: 'tap', p: { id: 'L' + st.on.findIndex(v => !v) } };
    if (n > want) return { g: 'tap', p: { id: 'L' + st.on.findIndex(v => v) } };
    return { g: 'tap', p: { id: 'done' } };
  },
  workEls(st) { return st.lamps || []; },
  snap(st) { return { lit: st.on ? st.on.filter(Boolean).length : 0, n: st.q.n, peeked: !!st.peeked }; },
  iconNode() { const d = el('div'); d.innerHTML = W3X.bulb(true); return d; },
});

/* 黑豹 · 涂颜色 - "paint it": a colour character is shown (read, not said); dip into the right pot: the picture takes the
   paint. Levels: 1 three pots; 2 four; 3 five; 4 a phrase (红衣 · 白云 · 绿叶 · 黄花); 5 two phrases - paint both, in order. */
const PAINT_NOUN = ['衣', '云', '叶', '花'];
const QPaint = Object.assign({}, ReadHint, {
  kind0: 'paint', verb: '涂！', intro: '涂颜色！', rule: 'read-colour-paint', props: [],
  gen(G, o) {
    const lv = o.level, pool = W3X.known(G, COLS), m = Math.min(pool.length, [0, 3, 4, 5, 5, 5][lv]), nouns = PAINT_NOUN.filter(x => poolOf(G, 'zh', true).includes(x));
    const answer = W3X.pick(G, pool), two = lv >= 5 && pool.length > 1 && nouns.length > 1;
    const n1 = lv >= 4 && nouns.length ? G.rng.pick(nouns) : null, c2 = two ? G.rng.pick(pool.filter(k => k !== answer)) : null, n2 = two ? G.rng.pick(nouns.filter(x => x !== n1)) : null;
    const seq = two ? [answer, c2] : [answer], others = G.rng.shuffle(pool.filter(k => !seq.includes(k))).slice(0, m - seq.length);
    const opts = W3X.put(G, others.concat(seq.slice(1)), answer);
    return { k: [seq.join(''), n1, n2, opts.join('')], answer: two ? 'all' : answer, item: answer, seq, nouns: two ? [n1, n2] : [n1], text: two ? answer + n1 + '，' + c2 + n2 : answer + (n1 || ''), opts, noun: n1 ? 1 : 0, two: two ? 1 : 0 };
  },
  itemOf(st) { return W3X.own(st, st.q.item); },
  itemsOf(st) { return st.q.seq.slice(1); },
  async present(st) {
    const q = st.q;
    st.peeked = false; st.step = 0;
    W3X.readCard(st, q.text, q.two ? 100 : 120); K.pop(st, st.readEl);
    st.shapes = q.nouns.map((nn, i) => { const sh = ZX.thing(st, 220, 250, 6, 'item'); sh._kind = nn || 'balloon'; sh.appendChild(W3X.svgShape(sh._kind, '#E9E4DA')); K.pop(st, sh, 120 + 80 * i); return sh; });
    st.shape = st.shapes[0];
    K.cards(st, q.opts.map(k => W3X.pot(COLORS[k])), q.opts, Object.assign({ size: 140, gap: 26 }, this.cardSpot()));
    this.place(st);
    K.say(st, '涂上这个颜色！');
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 570 } : { cx: 352, cy: 840 }; },
  place(st) {
    if (!st.shapes) return;
    const L = K.L();
    if (st.q.two) { W3X.placeRead(st, L ? 560 : 352, L ? 40 : 190); st.shapes.forEach((sh, i) => place(sh, L ? 330 + i * 270 : 110 + i * 264, L ? 175 : 350, 220, 250)); }
    else { W3X.placeRead(st, L ? 330 : 352, L ? 180 : 190); place(st.shape, L ? 560 : 227, L ? 90 : 360, 250, 280); }
    K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot()));
  },
  paint(st, i, c) { const sh = st.shapes[i]; sh.innerHTML = ''; sh.appendChild(W3X.svgShape(sh._kind, COLORS[c])); st.scope.anim(sh, [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 420, easing: EASE.pop }); },
  onGesture(st, name, p) {
    if (name !== 'tap' || st.submitted) return false;
    if (p.id === 'read') { W3X.peek(st); return 'ok'; }
    const i = K.cardIndex(p.id); if (i < 0) return false;
    const q = st.q, want = q.seq[st.step];
    if (q.opts[i] !== want) { st.tapped = i; Sfx.tap(); Session.submit(st, 'bad:' + q.opts[i]); return 'ok'; }
    if (q.two) { this.paint(st, st.step, want); Sfx.splash(); K.hop(st, st.cards[i], 20); }
    st.step++;
    if (st.step >= q.seq.length) Session.submit(st, q.answer);
    return 'ok';
  },
  async reveal(st) {
    const q = st.q, e = st.cards[q.opts.indexOf(q.seq[q.seq.length - 1])]; K.hop(st, e, 30);
    if (!q.two) this.paint(st, 0, q.seq[0]);
    Sfx.reveal(); const a = st.G.actors.panther; if (a) a.react('pounce');
    if (q.two) q.text.split('，').forEach(t => Voice.say(t + '！', { tag: 'summary' })); else if (q.noun) Voice.say(q.text + '！', { tag: 'summary' }); else sayItem(q.seq[0]);
    this.cheerAll(st); await st.scope.guard(Voice.afterSay(200));
  },
  async feedback(st) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); Voice.say('这是' + st.q.opts[st.tapped] + '色', { tag: 'wrong' }); await st.scope.wait(900); },
  next(st, strat) {
    if (!st.cards) return null;
    const want = st.q.seq[st.step || 0], i = strat === 'wrong' ? st.q.opts.findIndex(k => k !== want) : st.q.opts.indexOf(want);
    return { g: 'tap', p: { id: 'card' + i } };
  },
  snap(st) { return { opts: st.opts || null, step: st.step || 0, peeked: !!st.peeked }; },
  iconNode() { return W3X.pot('#E8413A'); },
});

/* 黑寡妇 · 全家福 - "who is it": a family photo; the word is shown, read, not said - tap the person. Levels: 1 a word (爸爸,
   妈妈, 哥哥, 姐姐, 弟弟) in one family's photo; 2 someone from another family is in the photo too; 3 "他的姐姐": the one
   pointed at is the "他"; 4 the one from another family has that name too (Bluey is a 姐姐 as well - but not his);
   5 two words and nobody pointed at: "弟弟的姐姐". */
const FAMS = {
  pig: { who: ['daddy_pig', 'mummy_pig', 'peppa', 'george'], kin: { daddy_pig: '爸爸', mummy_pig: '妈妈', peppa: '姐姐', george: '弟弟' } },
  gourd: { who: ['grandpa', 'gourd1', 'gourd7'], kin: { grandpa: '爷爷', gourd1: '哥哥', gourd7: '弟弟' } },
  bluey: { who: ['bandit', 'chilli', 'bluey', 'bingo'], kin: { bandit: '爸爸', chilli: '妈妈', bluey: '姐姐', bingo: '妹妹' } },
};
const KIN_OF = id => { for (const f in FAMS) if (FAMS[f].kin[id]) return FAMS[f].kin[id]; return ''; };
const FAM_Q = [
  { fam: 'pig', text: '爸爸', ans: 'daddy_pig' }, { fam: 'pig', text: '妈妈', ans: 'mummy_pig' }, { fam: 'pig', text: '姐姐', ans: 'peppa' }, { fam: 'pig', text: '弟弟', ans: 'george' },
  { fam: 'gourd', text: '哥哥', ans: 'gourd1' }, { fam: 'gourd', text: '弟弟', ans: 'gourd7' },
  { fam: 'bluey', text: '爸爸', ans: 'bandit' }, { fam: 'bluey', text: '妈妈', ans: 'chilli' }, { fam: 'bluey', text: '姐姐', ans: 'bluey' },
  { fam: 'pig', text: '他的姐姐', ans: 'peppa', pivot: 'george', rel: 1 }, { fam: 'pig', text: '他的妈妈', ans: 'mummy_pig', pivot: 'george', rel: 1 },
  { fam: 'pig', text: '他的爸爸', ans: 'daddy_pig', pivot: 'george', rel: 1 }, { fam: 'gourd', text: '他的哥哥', ans: 'gourd1', pivot: 'gourd7', rel: 1 },
  { fam: 'gourd', text: '他的弟弟', ans: 'gourd7', pivot: 'gourd1', rel: 1 },
  { fam: 'pig', text: '弟弟的姐姐', ans: 'peppa', rel: 2 }, { fam: 'pig', text: '弟弟的妈妈', ans: 'mummy_pig', rel: 2 }, { fam: 'pig', text: '弟弟的爸爸', ans: 'daddy_pig', rel: 2 },
  { fam: 'pig', text: '姐姐的弟弟', ans: 'george', rel: 2 }, { fam: 'gourd', text: '弟弟的哥哥', ans: 'gourd1', rel: 2 }, { fam: 'gourd', text: '哥哥的弟弟', ans: 'gourd7', rel: 2 },
];
const QFamily = Object.assign({}, ReadHint, {
  kind0: 'family', verb: '找！', intro: '全家福！', rule: 'read-kin-word-find-person', props: [],
  gen(G, o) {
    const lv = o.level, rel = [0, 0, 0, 1, 1, 2][lv], out = lv >= 2, trap = lv >= 4, known = poolOf(G, 'zh', true);
    const can = FAM_Q.filter(x => (x.rel || 0) === rel && Array.from(x.text).every(c => known.includes(c)));
    const kc = needPick(G, Array.from(new Set(can.map(x => x.text.slice(-1)))), 'kin'), x = G.rng.pick(can.filter(y => y.text.slice(-1) === kc));
    const fam = FAMS[x.fam], last2 = x.text.slice(-2), first2 = rel === 2 ? x.text.slice(0, 2) : null;
    const others = Object.keys(FAMS).filter(f => f !== x.fam).flatMap(f => FAMS[f].who);
    let o2 = null, isTrap = 0;
    if (out) {
      const traps = trap ? others.filter(id => KIN_OF(id) === last2 && KIN_OF(id) !== first2) : [];
      const safe = others.filter(id => KIN_OF(id) !== last2 && KIN_OF(id) !== first2);
      if (traps.length) { o2 = G.rng.pick(traps); isTrap = 1; } else o2 = G.rng.pick(safe);
    }
    const who = G.rng.shuffle(fam.who.concat(o2 ? [o2] : []));
    return { k: [x.text, x.fam, who.join()], text: x.text, fam: x.fam, pivot: x.pivot || null, answer: x.ans, item: kc, opts: who, rel, extra: o2 ? 1 : 0, trap: isTrap };
  },
  itemOf(st) { return W3X.own(st, st.q.item); },
  async present(st) {
    const q = st.q;
    st.peeked = false;
    W3X.readCard(st, q.text, q.text.length > 4 ? 92 : 104); K.pop(st, st.readEl);
    K.cards(st, q.opts.map(id => { const i = img(OBJURL('@' + id), ''); Object.assign(i.style, { width: '86%', height: '86%', objectFit: 'contain', pointerEvents: 'none' }); return i; }), q.opts, Object.assign({ size: 170, gap: 26, cls: 'pic' }, this.cardSpot()));
    st.cards.forEach(c => { c.style.background = '#FFF6E2'; });
    if (q.pivot) { const c = st.cards[q.opts.indexOf(q.pivot)]; c.style.boxShadow = '0 0 0 5px #2B2118, 0 0 0 13px #FF9F43'; st.pin = ZX.thing(st, 60, 60, 41, 'item'); st.pin.innerHTML = '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M20 38L6 14H34Z" fill="#FF9F43" stroke="#2B2118" stroke-width="3.5" stroke-linejoin="round"/></svg>'; Loops.run(st.pin, [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }], { duration: 900 }); }
    this.place(st);
    K.say(st, '找一找，是谁？');
  },
  cardSpot() { return K.L() ? { cx: 512, cy: 400 } : { cx: 352, cy: 640 }; },
  place(st) {
    if (!st.readEl) return;
    const L = K.L();
    W3X.placeRead(st, L ? 512 : 352, L ? 110 : 260);
    K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot()));
    if (st.pin && st.q.pivot) { const b = box(st.cards[st.q.opts.indexOf(st.q.pivot)]); place(st.pin, b.x + b.w / 2 - 30, b.y - 66, 60, 60); }
  },
  decor(G) { const L = K.L(); this.chars.forEach((id, i) => { const a = G.actors[id]; if (!a) return; if (i === 0) showActor(a, L ? 90 : 90, L ? 700 : 1016, L ? 180 : 150); else hideActor(a); }); },
  onGesture: ReadBase.onGesture,
  async reveal(st) {
    const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 34); e.classList.add('hi'); Sfx.reveal();
    if (st.q.rel) Voice.say(st.q.text + '！', { tag: 'summary' }); else sayItem(st.q.item);
    this.cheerAll(st); await st.scope.guard(Voice.afterSay(200));
  },
  async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); const k = KIN_OF(ans); if (k) Voice.say('这是' + k, { tag: 'wrong' }); await st.scope.wait(900); },
  iconNode() { const d = el('div'); d.style.display = 'flex'; d.appendChild(Glyph.zh('爸', 34)); d.appendChild(Glyph.zh('妈', 34)); return d; },
});

/* 鹰眼 · 照着做 - "do as it says": the command is written (吃 · 喝 · 看 · 走 · 来), read, not said; tap the picture of doing it.
   Levels: 1 three pictures; 2 four; 3 five; 4 two commands, in their order (看，走); 5 three. */
const QDo = Object.assign({}, ReadHint, {
  kind0: 'do', verb: '做！', intro: '照着做！', rule: 'read-command-act', props: [],
  gen(G, o) {
    const lv = o.level, pool = W3X.known(G, ACTS), m = Math.min(pool.length, [0, 3, 4, 5, 5, 5][lv]), len = Math.min(m, [0, 1, 1, 1, 2, 3][lv]);
    const first = W3X.pick(G, pool), seq = [first];
    while (seq.length < len) seq.push(G.rng.pick(pool.filter(k => !seq.includes(k))));
    const others = G.rng.shuffle(pool.filter(k => !seq.includes(k))).slice(0, m - seq.length);
    const opts = G.rng.shuffle(others.concat(seq.slice(1))); opts.splice(PICK(G, 'pos' + m, Array.from({ length: m }, (_, i) => i)) % (opts.length + 1), 0, first);
    return { k: [seq.join(''), opts.join('')], seq, answer: seq.length > 1 ? 'all' : first, item: first, opts, len: seq.length };
  },
  itemOf(st) { return W3X.own(st, st.q.seq[0]); },
  itemsOf(st) { return st.q.seq.slice(1); },
  async present(st) {
    const q = st.q;
    st.step = 0; st.peeked = false;
    W3X.readCard(st, q.seq.join('，'), q.seq.length > 2 ? 96 : 110); K.pop(st, st.readEl);
    K.cards(st, q.opts.map(k => { const i = img(OBJURL(ITEM[k].obj), ''); Object.assign(i.style, { width: '88%', height: '88%', objectFit: 'contain', pointerEvents: 'none' }); return i; }), q.opts, Object.assign({ size: 160, gap: 24, cls: 'pic' }, this.cardSpot()));
    this.place(st);
    K.say(st, '照着做！');
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 440 } : { cx: 352, cy: 680 }; },
  place(st) { const L = K.L(); W3X.placeRead(st, L ? 560 : 352, L ? 120 : 270); K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot())); },
  onGesture(st, name, p) {
    if (name !== 'tap' || st.submitted) return false;
    if (p.id === 'read') { W3X.peek(st); return 'ok'; }
    const i = K.cardIndex(p.id); if (i < 0) return false;
    const q = st.q;
    if (q.opts[i] !== q.seq[st.step]) { st.tapped = i; Session.submit(st, 'bad:' + q.opts[i]); return 'ok'; }
    st.step++; Sfx.place(); K.hop(st, st.cards[i], 26); st.cards[i].classList.add('hi');
    const a = st.G.actors.hawkeye; if (a) a.react('aim');
    if (st.step >= q.seq.length) Session.submit(st, q.answer);
    return 'ok';
  },
  async reveal(st) { Sfx.reveal(); st.q.seq.forEach(k => Voice.say(ITEM[k].line, { tag: 'summary' })); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  async feedback(st) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); const k = st.q.opts[st.tapped]; if (ITEM[k]) Voice.say(ITEM[k].line, { tag: 'wrong' }); await st.scope.wait(900); },
  next(st, strat) {
    if (!st.cards) return null;
    const want = st.q.seq[st.step || 0], i = strat === 'wrong' ? st.q.opts.findIndex(k => k !== want) : st.q.opts.indexOf(want);
    return { g: 'tap', p: { id: 'card' + i } };
  },
  snap(st) { return { opts: st.opts || null, step: st.step || 0, peeked: !!st.peeked }; },
  iconNode() { const d = el('div'); d.style.display = 'flex'; d.appendChild(Glyph.zh('走', 50)); return d; },
});

/* ================================================================ world 3's writing: the island's two characters (the other
   three are read: NOWRITE) and, once a session, an old friend - the most due character written on an earlier island (A.4) */
const W3Write = {
  ownReview: true,
  gen(G, o) {
    if (!G.practice && G.round === 2 && !G.ofDone) { const k = W3X.oldFriend(G); G.ofDone = true; if (k) return { k: [k, 'old'], answer: k, old: true }; }
    return WriteBase.gen.call(this, G, o);
  },
};

/* ---------------------------------------------------------------- the five islands' four games */
const W3PLAYS = { hulk3: [PlaySmash, ERhyme, QCount], thor3: [PlayHammer, EVowel, QFrame], panther3: [PlayLeap, EFirst, QPaint], widow3: [PlayTorch, ESecret, QFamily], hawk3: [PlayAim, ESpy, QDo] };
const CASTS3 = { hulk3: ['hulk', 'ironman'], thor3: ['thor', 'captain'], panther3: ['panther', 'miles'], widow3: ['widow', 'spiderman'], hawk3: ['hawkeye', 'widow'] };
Object.keys(W3PLAYS).forEach(id => {
  const W = ISL[id]; if (!W) return;
  const cast = CASTS3[id], host = cast[0], [find, en, quiz] = W3PLAYS[id], wr = W.chars.map(c => c.c).filter(k => !NOWRITE.includes(k));
  findGame(find, { id: id + ':find', world: id, bg: id + '_find', chars: cast, host, title: '认字', iconNode: () => Glyph.zh(W.chars[0].c, 60) });
  writeGame(Object.assign({}, W3Write, { id: id + ':write', world: id, lang: 'zh', bg: id + '_write', chars: cast.slice(0, 1), host, title: '写字', intro: '写一写！', iconNode: () => Glyph.zh(wr[0], 60, '#E8414B'), decor: writeDecor }));
  zGame(Object.assign({}, EnBase, en), { id: id + ':en', world: id, bg: id + '_abc', chars: cast.slice(0, 1), host, title: '英文' });
  zGame(quiz, { id: id + ':quiz', world: id, bg: id + '_quiz', chars: cast, host, title: '挑战', boost: 1 });
  W.games = [id + ':find', id + ':write', id + ':en', id + ':quiz'];
});
