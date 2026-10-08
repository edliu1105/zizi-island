/* ================================================================ 字字岛 · the app layer (data, save, progress, session,
   map, the treasure book + practice, parent, finale, entry). The engine below the line is 点点岛's. */
/* ---------------------------------------------------------------- the client's characters + the new ones */
const CHARS = {
  peppa: ['佩奇', 'hop'], george: ['乔治', 'dino'], daddy_pig: ['猪爸爸', 'belly'], mummy_pig: ['猪妈妈', 'twirl'],
  bluey: ['布鲁伊', 'dance'], bingo: ['宾果', 'spin'], bandit: ['爸爸', 'silly'], chilli: ['妈妈', 'laugh'],
  gourd1: ['大娃', 'lift'], gourd2: ['二娃', 'eyes'], gourd3: ['三娃', 'steel'], gourd4: ['四娃', 'fire'], gourd5: ['五娃', 'water'], gourd6: ['六娃', 'vanish'], gourd7: ['七娃', 'glow'], grandpa: ['爷爷', 'nod'],
  ryder: ['莱德', 'thumbs'], chase: ['阿奇', 'salute'], marshall: ['毛毛', 'tumble'], skye: ['天天', 'flip'], rocky: ['灰灰', 'wag'], zuma: ['路马', 'splash'], rubble: ['小砾', 'stomp'],
  wukong: ['悟空', 'flip'], bajie: ['八戒', 'belly'], shaseng: ['沙僧', 'nod'], tangseng: ['师父', 'bow'], dragon_horse: ['白龙马', 'rear'],
  catboy: ['猫小子', 'pounce'], owlette: ['猫头鹰女', 'flip'], gekko: ['壁虎侠', 'hop'],
  ultraman: ['奥特曼', 'thrust'], zero: ['赛罗', 'thrust'], optimus: ['擎天柱', 'stomp'], bumblebee: ['大黄蜂', 'hop'], kaiju1: ['小怪兽', 'hop'], kaiju2: ['小怪兽', 'hop'],
};
const PRAISE = ['真棒！', '对啦！', '你真厉害！', '好样的！', '太棒啦！', '一点不错！', '你答对啦！', '认得真准！'];
const CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
const CNQ = n => (n === 2 ? '两' : CN[n] || String(n));
const UI = { doneBtn(icon, size) { const b = el('div', 'done'); size = size || 110; b.style.width = size + 'px'; b.style.height = size + 'px'; b.innerHTML = ICONS[icon] || ICONS.check; return b; } };

/* ---------------------------------------------------------------- the glyphs as pictures (the same shapes as when written) */
const Glyph = {
  /* a character from its outlines (楷体 of the stroke data) */
  zh(ch, size, color) {
    const s = svg('svg', { viewBox: '0 0 1024 1024', width: size, height: size, class: 'gly' });
    const d = Hanzi.data && Hanzi.data[ch];
    const g = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s);
    if (d) d.s.forEach(o => svg('path', { d: o, fill: color || INK }, g));
    return s;
  },
  /* a letter from its strokes (round ends), optionally on its four lines */
  en(ch, h, color, lines) {
    const b = letterBox(ch), w = Math.max(64, b.x1 - b.x0 + 26), cx = (b.x0 + b.x1) / 2, top = /[a-z]/.test(ch) ? (/[gjpqy]/.test(ch) ? 0 : 0) : 0;
    const vb = [cx - w / 2, -10 + top, w, 140];
    const s = svg('svg', { viewBox: vb.join(' '), width: Math.round(h * vb[2] / vb[3]), height: h, class: 'gly' });
    if (lines) [0, 40, 80, 120].forEach((y, i) => svg('line', { x1: vb[0], x2: vb[0] + vb[2], y1: y, y2: y, stroke: i === 2 ? '#E8414B' : '#6BB9F2', 'stroke-width': 1.2, opacity: 0.6 }, s));
    LETTERS[ch].forEach(p => svg('path', { d: p.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(''), fill: 'none', stroke: color || INK, 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s));
    return s;
  },
  any(g, size, color) { return /^[A-Za-z]$/.test(g) ? this.en(g, size, color) : this.zh(g, size, color); },
  /* a word: its letters on one shared base line, each as wide as it is (never touching) */
  word(w, h, color) {
    let x = 0; const g = svg('g', {});
    w.split('').forEach(c => { const b = letterBox(c), dx = x - b.x0; LETTERS[c].forEach(p => svg('path', { d: p.map((q, i) => (i ? 'L' : 'M') + (q[0] + dx).toFixed(1) + ' ' + q[1].toFixed(1)).join(''), fill: 'none', stroke: color || INK, 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g)); x += b.x1 - b.x0 + 18; });
    const W = x - 18 + 26, s = svg('svg', { viewBox: '-13 -8 ' + W + ' 136', width: Math.round(h * W / 136), height: h, class: 'gly' });
    s.appendChild(g);
    return s;
  },
  /* a glyph in a square around its own extent (a CSS turn / mirror then happens about the glyph's own centre) */
  fit(g, size, color) {
    const en = /^[A-Za-z]$/.test(g);
    const P = en ? LETTERS[g].flat() : Hanzi.data[g].m.flat().map(([x, y]) => [x, 900 - y]);
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]), pad = en ? 12 : 110;
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2, S = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) + 2 * pad;
    const s = svg('svg', { viewBox: [cx - S / 2, cy - S / 2, S, S].map(v => v.toFixed(1)).join(' '), width: size, height: size, class: 'gly' });
    if (en) LETTERS[g].forEach(p => svg('path', { d: p.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(''), fill: 'none', stroke: color || INK, 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s));
    else { const gg = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s); Hanzi.data[g].s.forEach(o => svg('path', { d: o, fill: color || INK }, gg)); }
    return s;
  },
  obj(id) { const i = img('assets/obj/' + id + '.png', ''); Object.assign(i.style, { width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }); return i; },
};

/* ---------------------------------------------------------------- storage (versioned, corruption tolerant) */
const KEY = 'zzi.v1', VER = 1;
const ALL_ISL = () => ORDER.w1.concat(ORDER.w2, ORDER.w3 || []);
function defIsl(id) { return { unlocked: id === ORDER.w1[0], gstars: {}, played: [], visits: 0, sessions: 0, stars: 0, story: 0 }; }
function defState() { const w = {}; ALL_ISL().forEach(id => { w[id] = defIsl(id); }); return { v: VER, worlds: w, learned: {}, met: {}, flags: [], fin: { w1: '', w2: '', w3: '' }, gate2: false, w2seen: false, gate3: false, w3seen: false, mapSet: 'w1', settings: { en: true, mins: 15, wgate: false }, all: false,
    mem: {}, ev: [], days: {}, key: { day: -1, got: 0, short: false }, album: { n: 0, src: [] }, stat: { clean: 0, wfDown: 0 }, flagDays: [], lastDay: 0, checks: [], v2: 1 }; }
const Store = {
  s: null,
  load() {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (!raw) { this.s = defState(); return this.s; }
    try { this.s = this.validate(JSON.parse(raw)); }
    catch (e) { try { localStorage.setItem('zzi.corrupt', String(raw).slice(0, 20000)); } catch (e2) {} this.s = defState(); this.save(); }
    return this.s;
  },
  validate(o) {
    if (!o || typeof o !== 'object' || o.v !== VER || !o.worlds) throw new Error('bad state');
    const d = defState(), num = (v, def, a, b) => (typeof v === 'number' && isFinite(v) ? clamp(Math.round(v), a, b) : def);
    ALL_ISL().forEach(id => {
      const w = o.worlds[id] || {}, t = d.worlds[id];
      t.unlocked = id === ORDER.w1[0] || w.unlocked === true;
      if (w.justOpened === true) t.justOpened = true;
      t.gstars = {}; ISL[id].games.forEach(g => { if (w.gstars && typeof w.gstars[g] === 'number') t.gstars[g] = num(w.gstars[g], 0, 0, 1e6); });
      t.played = Array.isArray(w.played) ? w.played.filter(g => ISL[id].games.includes(g)) : [];
      t.visits = num(w.visits, 0, 0, 1e6); t.sessions = num(w.sessions, 0, 0, 1e6); t.stars = num(w.stars, 0, 0, 1e6); t.story = num(w.story, 0, 0, 3);
      if (w.pok === true) t.pok = true;
      if (w.wf && typeof w.wf === 'object') t.wf = { s: num(w.wf.s, 0, 0, 99), m: num(w.wf.m, 0, 0, 2) };
    });
    if (o.learned && typeof o.learned === 'object') for (const k in o.learned) if (ITEM[k]) { const x = o.learned[k] || {}; d.learned[k] = { w: num(x.w, 0, 0, 1e6), p: num(x.p, 0, 0, 1e6) }; }
    if (o.met && typeof o.met === 'object') for (const k in o.met) if (ITEM[k] && o.met[k] === true) d.met[k] = true;
    d.flags = Array.isArray(o.flags) ? o.flags.filter(x => !!ISL[x]) : [];
    ['w1', 'w2', 'w3'].forEach(w => { const f = o.fin && o.fin[w]; d.fin[w] = f === 'due' || f === 'seen' ? f : ''; });
    d.gate2 = o.gate2 === true; d.w2seen = o.w2seen === true; d.gate3 = o.gate3 === true; d.w3seen = o.w3seen === true; d.mapSet = ['w2', 'w3'].includes(o.mapSet) ? o.mapSet : 'w1'; d.all = o.all === true;
    if (o.settings && typeof o.settings === 'object') { d.settings.en = o.settings.en !== false; if ([0, 10, 15, 20, 30].includes(o.settings.mins)) d.settings.mins = o.settings.mins; d.settings.wgate = o.settings.wgate === true; }
    /* v2 memory (docs/PLAN-v2.md): per item {b box, due, last, up, seen, pass, n, ok}; kept only for real items */
    if (o.mem && typeof o.mem === 'object') for (const k in o.mem) if (ITEM[k] && o.mem[k] && typeof o.mem[k] === 'object') { const m = o.mem[k]; d.mem[k] = { b: num(m.b, 0, 0, 7), due: num(m.due, 0, 0, 1e7), last: num(m.last, 0, 0, 1e7), up: num(m.up, -1, -1, 1e7), seen: num(m.seen, 0, 0, 1e7), pass: Array.isArray(m.pass) ? m.pass.filter(x => typeof x === 'string').slice(-4) : [], n: num(m.n, 0, 0, 1e6), ok: num(m.ok, 0, 0, 1e6) }; if (typeof m.evd === 'number') d.mem[k].evd = m.evd; }
    if (Array.isArray(o.ev)) d.ev = o.ev.filter(x => Array.isArray(x) && x.length === 3 && x.every(v => typeof v === 'number')).slice(-400);
    if (o.days && typeof o.days === 'object') for (const k in o.days) { const x = o.days[k]; if (/^\d+$/.test(k) && x && typeof x === 'object') d.days[k] = { ms: num(x.ms, 0, 0, 1e9), newK: num(x.newK, 0, 0, 1e4), q: num(x.q, 0, 0, 1e6), keyGo: num(x.keyGo, 0, 0, 99), keyEnd: num(x.keyEnd, 0, 0, 99), asked: x.asked ? 1 : 0 }; }
    if (o.key && typeof o.key === 'object') d.key = { day: num(o.key.day, -1, -1, 1e7), got: num(o.key.got, 0, 0, 1e6), short: o.key.short === true };
    if (o.album && typeof o.album === 'object') d.album = { n: num(o.album.n, 0, 0, 1000), src: Array.isArray(o.album.src) ? o.album.src.filter(x => typeof x === 'string').slice(-1000) : [] };
    if (o.stat && typeof o.stat === 'object') d.stat = { clean: num(o.stat.clean, 0, 0, 1e6), wfDown: num(o.stat.wfDown, 0, 0, 1e6) };
    if (Array.isArray(o.flagDays)) d.flagDays = o.flagDays.filter(x => typeof x === 'number').slice(-200);
    d.lastDay = num(o.lastDay, 0, 0, 1e7);
    if (Array.isArray(o.checks)) d.checks = o.checks.filter(x => x && typeof x === 'object' && typeof x.day === 'number').slice(-60);
    /* once, for a save from before v2: what was written becomes "seen" (never "known"); islands whose four games were
       already done keep their flag (the pass condition is not asked of them) */
    if (o.v2 !== 1) {
      for (const k in d.learned) if (d.learned[k].w > 0 && !d.mem[k]) d.mem[k] = { b: 0, due: 0, last: 0, up: -1, seen: 0, pass: [], n: 0, ok: 0 };
      ALL_ISL().forEach(id => { if (ISL[id].games.every(g => (d.worlds[id].gstars[g] || 0) >= 5)) d.worlds[id].pok = true; });
    }
    return d;
  },
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.s)); } catch (e) { /* private mode: keep playing in memory */ } },
  w(id) { return this.s.worlds[id]; },
  reset() { this.s = defState(); this.save(); },
  /* a character / letter written (w) or practised (p) */
  learn(k, field) { const x = this.s.learned[k] || (this.s.learned[k] = { w: 0, p: 0 }); x[field || 'w']++; this.save(); },
};
const learned = k => !!(Store.s.learned[k] && Store.s.learned[k].w > 0);

/* ---------------------------------------------------------------- progress: 5 stars a game, 4 games an island, 7 islands a world */
const Prog = {
  stars(i, g) { const ws = Store.w(i); return (ws.gstars && ws.gstars[g]) || 0; },
  gameDone(i, g) { return this.stars(i, g) >= 5; },
  gameOpen(i, g) { const gs = ISL[i].games, k = gs.indexOf(g); return Store.s.all || k <= 0 || this.gameDone(i, gs[k - 1]) || this.gameDone(i, g) || Store.w(i).played.includes(g) || this.stars(i, g) > 0; },
  /* 4 ✓ and every character of the island 过关: its own first try in two different sessions (A.10) */
  gamesDone(i) { return ISL[i].games.every(g => this.gameDone(i, g)); },
  islandDone(i) { return this.gamesDone(i) && (Store.w(i).pok || ISL[i].chars.every(c => Mem.passed(c.c))); },
  worldDone(w) { return ORDER[w].every(i => this.islandDone(i)); },
  worldOpen(w) { return w === 'w1' || Store.s.all || (w === 'w2' ? this.worldDone('w1') : this.worldDone('w2')); },
  /* the difficulty now: the island's start + its game's boost + one step for every 5 stars earned in it */
  level(i, g) { return clamp(ISL[i].base + ((GAMES[g] && GAMES[g].boost) || 0) + Math.floor(this.stars(i, g) / 5), 1, 5); },
  learnedCount() { return Object.keys(Store.s.learned).filter(k => learned(k)).length; },
  /* opens what is due (show: the map plays the cloud show for a new island) */
  check(show) {
    let any = false;
    ['w1', 'w2', 'w3'].forEach(w => {
      if (!this.worldOpen(w)) return;
      ORDER[w].forEach((id, k) => {
        const ws = Store.w(id); if (ws.unlocked) return;
        if (Store.s.all || ORDER[w].slice(0, k).every(x => this.islandDone(x))) { ws.unlocked = true; if (show) ws.justOpened = true; any = true; }
      });
      if (this.worldDone(w) && !Store.s.fin[w] && !WORLDS_INFO[w].partial) { Store.s.fin[w] = 'due'; any = true; }
    });
    if (any) Store.save();
  },
};
const flagged = id => Prog.islandDone(id);
const FLAG_HTML = id => {
  const W = ISL[id], two = W.w === 'w2', ink = '#2B2118';
  const cloth = two ? '<path d="M2 3H58L47 21L58 39H2Z" fill="' + W.color + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><path d="M3.5 4.5H10V37.5H3.5Z" fill="' + W.color2 + '"/>'
    : '<path d="M2 3Q30 -2 58 5Q54 21 58 37Q30 44 2 39Z" fill="' + W.color + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><path d="M3.5 31Q30 36 56.5 30.5L57 35.6Q30 42.4 3.5 37.7Z" fill="' + W.color2 + '"/>';
  return '<div class="cloth"><svg viewBox="0 0 60 42">' + cloth + '</svg><img src="assets/thumbs/' + W.host + '.png" alt=""></div>'
    + (two ? '<svg class="finial" viewBox="0 0 24 24"><path d="M12 1.5L15 8.6L22.6 9.3L16.8 14.3L18.6 21.8L12 17.8L5.4 21.8L7.2 14.3L1.4 9.3L9 8.6Z" fill="#FFC93C" stroke="' + ink + '" stroke-width="2.2" stroke-linejoin="round"/></svg>' : '');
};

/* ---------------------------------------------------------------- session (点点岛's, with this app's rules) */
const HS = () => (window.__hintScale || 1);
const Clock = {
  lost: 0, hiddenAt: 0,
  t() { const n = now(); return n - this.lost - (this.hiddenAt ? n - this.hiddenAt : 0); },
  hide() { if (!this.hiddenAt) this.hiddenAt = now(); },
  show() { if (this.hiddenAt) { this.lost += now() - this.hiddenAt; this.hiddenAt = 0; } },
};
/* the 2nd hint (the picture / the brush shows this stroke) was given: the answer is no longer the child's own (A.12) */
const helped = st => (st.assists || []).some(a => /^hint[23]/.test(a));
const Session = {
  G: null, st: null, qn: 0,
  alive(st) { return !!st && this.st === st && !st.scope.dead && this.G === st.G && !st.G.dead; },
  host(G) { const h = G && G.actors && G.actors[G.game.host || G.W.host]; return h && !h.dead && h.x > 0 && h.x < Stage.W ? h : null; },
  async start(islandId, gameId, opt) {
    opt = opt || {};
    if (this.G) this.teardown(this.G);
    const W = ISL[islandId], ws = Store.w(islandId), game = GAMES[gameId];
    try { await Hanzi.load(); } catch (e) { /* offline without it: the writing games say so */ }
    const seed = opt.seed || (Number((location.search.match(/seed=(\d+)/) || [])[1]) || 0) || ((Date.now() ^ (ws.sessions * 2654435761)) >>> 0);
    const G = this.G = {
      world: islandId, W, ws, id: gameId, game, scope: new Scope(APP), rng: RNG(seed), seed, practice: !!opt.practice, item: opt.item || null,
      level: opt.level ? clamp(opt.level, 1, 5) : (opt.key ? 2 : Prog.level(islandId, gameId)), actors: {}, els: {}, round: 0, rounds: opt.practice ? 1 : opt.key ? opt.keyItems.length : 5,
      key: !!opt.key, keyItems: opt.keyItems || null, sid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), miss: [],
      t0: Clock.t(), stars: 0, streak: 0, bags: {}, dead: false, errors: 0,
    };
    G.bg = game.bgOf ? game.bgOf(G) : game.bg;
    if (!G.practice && !G.key) { ws.visits++; ws.sessions++; Store.save(); }
    G.needPass = G.practice || G.key ? [] : W.chars.map(c => c.c).filter(k => !Mem.passed(k));
    G.rv = Review.plan(G);
    WriteFallback.start(G);
    { const gl = W.games, k = gl.indexOf(gameId); G.nx = k >= 0 ? gl[k + 1] || null : null; G.nxWas = G.nx ? Prog.gameOpen(islandId, G.nx) : true; }
    G.wasDone = Prog.gameDone(islandId, gameId);
    Voice.enter('game');
    MapView.closePanel(true);
    await Loader.run(G);
    if (G.dead || this.G !== G) return;
    this.mount(G);
    Screens.show('game');
    await this.intro(G);
    if (G.dead) return;
    for (G.round = 0; G.round < G.rounds && !G.dead; G.round++) {
      if (G.round >= 3 && Clock.t() - G.t0 > 180000 && !fast() && !G.key) break;
      const r = await this.round(G);
      if (r === 'stop' || G.full) break;
    }
    if (!G.dead) await this.finish(G);
  },
  mount(G) {
    const W = G.W;
    document.documentElement.style.setProperty('--world', W.color);
    const gm = $('#game'); gm.className = gm.className.replace(/\bw-\S+/g, '').trim(); gm.classList.add('w-' + W.skin);
    Stage.bg.style.backgroundImage = 'url(assets/bgthumb/' + G.bg + '.jpg)';
    const full = new Image(); full.onload = () => { if (this.G === G) Stage.bg.style.backgroundImage = 'url(assets/bg/' + G.bg + '.jpg)'; }; full.src = 'assets/bg/' + G.bg + '.jpg';
    Stage.el.innerHTML = ''; Hand.el = null;
    Stage.fit(true);
    $('#avatar img').src = 'assets/thumbs/' + (G.game.host || W.host) + '.png';
    $('#avatar').style.background = W.color;
    const tray = $('#tray'); tray.innerHTML = '';
    tray.style.display = G.practice || G.key ? 'none' : '';
    G.trayBase = Prog.gameDone(G.world, G.id) ? 0 : Math.min(4, Prog.stars(G.world, G.id));
    for (let i = 0; i < 5; i++) el('i', i < G.trayBase ? 'on' : '', tray);
    Stage.onRelayout = () => {
      Input.abort();
      if (this.G !== G || G.dead) return;
      G.game.layout(G);
      const st = this.st;
      if (st && st.G === G && !st.scope.dead) { K.relayoutChrome(st); if (G.game.relayoutQ) G.game.relayoutQ(st); }
    };
    G.game.build(G);
    G.game.layout(G);
    Sfx.ambient(W.amb);
    Object.values(G.actors).forEach(a => { if (!a.root.dataset.gid) Input.bind(a.root, { id: 'char:' + a.id }); });
  },
  async intro(G) {
    const g = G.game, sc = G.scope;
    const b = el('div', 'banner', $('#fx'));
    b.textContent = g.verb;
    Sfx.whoosh(0.3); Sfx.mar(784, 0.05, 0.5, 0.4); Sfx.mar(1175, 0.16, 0.45, 0.5);
    const a = b.animate([{ transform: 'translate(-50%,-50%) scale(.2) rotate(-12deg)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1.08) rotate(3deg)', opacity: 1, offset: 0.3 }, { transform: 'translate(-50%,-50%) scale(1) rotate(0)', opacity: 1, offset: 0.75 }, { transform: 'translate(-50%,-60%) scale(.7)', opacity: 0 }], { duration: T(800) + 1, easing: EASE.out, fill: 'forwards' });
    a.onfinish = () => b.remove();
    sc.add(() => b.remove());
    const story = G.practice ? { line: null } : Story.intro(G);
    Voice.say(story.line || g.intro, { tag: 'intro', owner: G });
    await sc.wait(700);
    if (story.play) await sc.guard(story.play());
  },
  newQ(G, opt) {
    opt = opt || {};
    const g = G.game, ws = G.ws, level = G.level;
    const q = this.genQ(G, level);
    ws.lastKey = g.key(q);
    const st = {
      gen: ++this.qn, id: 'q' + this.qn, G, game: g, q, kind: g.kind0, level, phase: 'setup', hinted: false, guided: false, demo: false, retest: !!opt.retest,
      err: opt.err || 0, scope: new Scope(G.scope), els: [], map: {}, ops: 0, childOps: 0, assists: [],
      submitted: false, idleFrom: Clock.t(), hintLv: 0, nextAuto: 0, ff: false, childTook: false,
    };
    st.answerP = new Promise((res, rej) => { st.answerRes = res; st.answerRej = rej; });
    this.st = st;
    window.__qn = st.gen;
    return st;
  },
  /* a question never the previous one again, nor one already asked in this session if there is another */
  genQ(G, level) {
    const g = G.game, ws = G.ws, seen = G.seenKeys || (G.seenKeys = new Set());
    let q = null, again = null;
    for (let i = 0; i < 60; i++) {
      q = g.gen(G, { level, rng: G.rng });
      const k = g.key(q);
      if (k === ws.lastKey && i < 59) continue;
      if (seen.has(k)) { if (!again) again = q; continue; }
      seen.add(k); return q;
    }
    return again || q;
  },
  async round(G) {
    let err = 0;
    while (!G.dead) {
      /* client rule: after a wrong answer a NEW question of the same kind and level; the round's star is gone */
      /* a review question in its slot (never as the replacement after a wrong answer) */
      const rv = err ? null : Review.slot(G);
      const st = rv ? Review.newQ(G, rv) : this.newQ(G, { retest: err > 0, err });
      const res = await this.runQ(G, st);
      if (res === 'dead') return 'dead';
      if (res === 'error') { if (++G.errors >= 3) return 'stop'; continue; }
      this.remember(G, st, res);
      if (!G.key && !G.ws.played.includes(G.id)) { G.ws.played.push(G.id); Store.save(); }
      /* a star: the child's own first try - not after the 2nd hint, not in the key round, not when a character was tapped
         to be heard in 读一读 (A.12) */
      if (res === 'ok') { if (!err && !G.practice && !G.key && !st.noStar && !helped(st)) await this.reward(G, st); return 'ok'; }
      if (G.practice || G.key) return 'ok';
      err++;
    }
    return 'dead';
  },
  /* the memory of the item asked about; the missed queue; the writing fallback */
  remember(G, st, res) {
    if (G.practice) return;
    Mem.today().q++;
    const g = st.game, k = g.itemOf ? g.itemOf(st) : (ITEM[st.q.answer] ? st.q.answer : null);
    if (k && (res === 'ok' || res === 'wrong')) Mem.answer(k, res === 'ok' ? (helped(st) ? 'help' : 'ok') : 'wrong', G.sid);
    if (k && res === 'wrong' && g.kind0 !== 'write' && !G.key) G.miss.push({ k, at: G.round + 2 });
    WriteFallback.after(G, st, res);
  },
  async runQ(G, st) {
    const g = st.game, my = st;
    try {
      st.phase = 'setup';
      await g.present(st);
      if (!this.alive(my)) return 'dead';
      if (st.phase === 'setup') st.phase = 'ready';
      Hints.arm(st);
      const ans = await st.answerP;
      Hints.disarm(st);
      if (!this.alive(my)) return 'dead';
      st.phase = 'judging';
      const ok = !!g.evaluate(st, ans);
      st.ok = ok;
      this.ffOn(st);
      if (ok) {
        G.streak++;
        st.phase = 'reveal';
        await g.reveal(st);
        if (!this.alive(my)) return 'dead';
        st.phase = 'praise';
        Sfx.correct();
        if (!st.ff && !st.noPraise) Voice.say(this.praise(G), { tag: 'praise' });
        this.cheer(G, st);
        this.streakFx(G, st);
        await st.scope.guard(Promise.race([Voice.afterSay(120), st.scope.wait(DUR.praise)]));
        await st.scope.wait(DUR.celebrate - DUR.praise - DUR.star);
        if (!this.alive(my)) return 'dead';
        this.ffOff();
        this.endQ(st);
        return 'ok';
      }
      G.streak = 0;
      st.phase = 'correcting';
      await g.feedback(st, ans);                 /* says what is wrong (never "you are wrong", never the answer) */
      if (!this.alive(my)) return 'dead';
      if (!G.practice) Voice.say(g.again || AGAIN[(G.again = (G.again || 0) + 1) % AGAIN.length], { tag: 'again' });      /* writing: 再写一个！ (a new character comes, R2-06) */
      await st.scope.guard(Voice.afterSay(200));
      if (!this.alive(my)) return 'dead';
      this.ffOff();
      this.endQ(st);
      return 'wrong';
    } catch (e) {
      if (this.alive(my)) { console.error('question error', G.id, 'L' + st.level, e); st.failed = true; this.ffOff(); this.endQ(st); return 'error'; }
      return 'dead';
    }
  },
  endQ(st) {
    st.phase = 'done';
    Hand.kill();
    try { st.game.cleanup(st); } catch (e) { console.error('cleanup error', e); }
    (st.bound || []).forEach(e => { if (!e._spec) return; Input.unbind(e); if (e._actorId) Input.bind(e, { id: 'char:' + e._actorId }); });
    st.els.forEach(e => e.remove());
    st.scope.dispose();
  },
  crash(e) {
    const st = this.st;
    if (st && this.alive(st) && !st.submitted && st.answerRej) { st.submitted = true; st.answerRej(e); return true; }
    console.error('async error', e);
    return false;
  },
  submit(st, value) {
    if (!st || st.submitted || this.st !== st) return false;
    st.submitted = true; st.answer = value;
    Voice.hush('submit');
    st.answerRes(value);
    return true;
  },
  praise(G) {
    const pool = PRAISE.concat(G.game.praise || []);
    let p; do { p = pool[Math.floor(Math.random() * pool.length)]; } while (p === this.lastPraise && pool.length > 1);
    this.lastPraise = p; return p;
  },
  async reward(G, st) {
    G.stars++; G.ws.stars++;
    { const gs = G.ws.gstars || (G.ws.gstars = {}); gs[G.id] = (gs[G.id] || 0) + 1; }
    Store.save();
    const slots = $$('#tray i');
    const slot = slots[Math.min((G.trayBase || 0) + G.stars, slots.length) - 1];
    if (!slot) return;
    const sr = slot.getBoundingClientRect();
    const star = img('assets/props/ui_star.png', '', $('#fx'));
    const c = Stage.toScreen(Stage.W / 2, Stage.H / 2);
    Object.assign(star.style, { position: 'absolute', width: '72px', height: '72px', left: (c.x - 36) + 'px', top: (c.y - 36) + 'px' });
    Sfx.star();
    const a = star.animate([{ transform: 'scale(.2) rotate(-40deg)', opacity: 0 }, { transform: 'scale(1.3) rotate(0)', opacity: 1, offset: 0.35 }, { transform: 'translate(' + (sr.left + sr.width / 2 - c.x) + 'px,' + (sr.top + sr.height / 2 - c.y) + 'px) scale(.55)', opacity: 1 }], { duration: T(DUR.star) + 1, easing: EASE.glide, fill: 'forwards' });
    await G.scope.guard(new Promise(r => { a.onfinish = r; setTimeout(r, T(DUR.star + 100) + 50); }));
    star.remove();
    slot.classList.add('on');
    slot.animate([{ transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: T(260) + 1, easing: EASE.pop });
    if (!G.wasDone && !G.full && Prog.gameDone(G.world, G.id)) { G.full = true; await this.fullTray(G); }
  },
  async fullTray(G) {
    const slots = $$('#tray i'), tray = $('#tray');
    slots.forEach((s, i) => { s.classList.add('on'); s.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.45) rotate(18deg)' }, { transform: 'scale(1)' }], { duration: T(420) + 1, delay: T(90 * i), easing: EASE.pop }); });
    tray.animate([{ boxShadow: '0 0 0 0 rgba(255,201,60,0)' }, { boxShadow: '0 0 0 10px rgba(255,201,60,.9), 0 0 36px 14px rgba(255,214,90,.85)' }, { boxShadow: '0 0 0 0 rgba(255,201,60,0)' }], { duration: T(1500) + 1, easing: 'ease-in-out' });
    Sfx.fanfare(); Fx.confetti(50);
    Object.values(G.actors).forEach((a, i) => G.scope.timeout(() => a.cheer(), 200 + i * 110));
    Voice.say('集满啦！', { tag: 'praise' });
    await G.scope.guard(Promise.race([Voice.afterSay(150), G.scope.wait(2400)]));
    await G.scope.wait(500);
  },
  cheer(G, st) {
    if (fast()) return;
    const at = st.lastAt || { x: Stage.W / 2, y: Stage.H / 2 };
    const host = G.actors[G.game.host || G.W.host];
    const list = Object.values(G.actors).filter(a => a.x > -200 && a.x < Stage.W + 200).sort((a, b) => Math.abs(a.x - at.x) - Math.abs(b.x - at.x));
    list.forEach((a, i) => { a.lookAt(at.x, at.y); st.scope.timeout(() => { if (a === host) a.react(); else a.hop(); }, 260 + i * 110); });
  },
  streakFx(G, st) {
    if (G.streak === 3) { Object.values(G.actors).forEach((a, i) => st.scope.timeout(() => a.cheer(), 900 + i * 60)); Fx.confetti(30, st.scope); }
    if (G.streak === 5) { Fx.confetti(60, st.scope); Fx.burst(Stage.W / 2, Stage.H * 0.3, { n: 24, dist: 200 }); Sfx.fanfare(); }
  },
  ffOn() { $('#ff').classList.add('on'); },
  ffOff() { $('#ff').classList.remove('on'); },
  fastForward() {
    const G = this.G; if (!G || G.dead) return;
    if (G.finishing) { if (!G.ffDone) { G.ffDone = true; Voice.hush('ff'); G.scope.fastForward(); } return; }
    const st = this.st;
    if (!st || st.scope.dead || st.ff || !['reveal', 'praise', 'correcting'].includes(st.phase)) return;
    st.ff = true;
    Voice.hush('ff', 'summary');
    st.scope.fastForward();
  },
  relisten() {
    const st = this.st; if (!this.G) return;
    Sfx.touch();
    if (st && !st.scope.dead && ['ready', 'input', 'act'].includes(st.phase)) { Hints.mark(st, 'relisten'); Hints.reset(st); }
    const text = (st && st.prompt) || this.G.game.intro;
    const leads = st && st.lead && st.prompt ? [].concat(st.lead) : [], tail = st && st.tail ? [].concat(st.tail) : [];
    if (Voice.silent) Voice.retry(text);
    else if (leads.length) { Voice.sayNow(leads[0], { tag: 'relisten' }); leads.slice(1).forEach(l => Voice.say(l, { tag: 'relisten' })); Voice.say(text, { tag: 'relisten' }); }
    else { Voice.sayNow(text, { tag: 'relisten' }); tail.forEach(l => Voice.say(l, { tag: 'relisten' })); }
    const a = $('#avatar'); a.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: T(300) + 1 });
  },
  reteach() {
    const st = this.st; if (!st || st.scope.dead || !['ready', 'input', 'act'].includes(st.phase)) return;
    if (st.game.gestureHint) { Hints.mark(st, 'reteach'); st.game.gestureHint(st, true); }
  },
  async finish(G) {
    if (G.dead || this.G !== G) return;
    G.finishing = true;
    if (!G.practice) { Mem.today().ms += Math.max(0, Clock.t() - G.t0); Store.s.lastDay = DAY(); Store.save(); }
    this.ffOn();
    const sc = G.scope;
    if (!G.practice) {
      Sfx.complete(); Fx.confetti(40);
      Object.values(G.actors).forEach((a, i) => sc.timeout(() => a.cheer(), i * 110));
      Voice.say(G.game.bye || '玩得真开心！', { tag: 'bye', owner: G });
      await sc.wait(DUR.finish);
    } else await sc.wait(G.practiceWait || 600);
    if (G.dead || this.G !== G) return;
    this.ffOff();
    if (G.practice) { this.teardown(G); Book.open(G.item && G.item.tab, G.item && G.item.k); return; }
    if (G.key) { Mem.today().keyEnd++; this.teardown(G); Screens.show('map'); Voice.enter('map'); MapView.update(); Keys.grant('key'); return; }
    const wid = G.world, stars = G.stars;
    let newGame = null;
    if (G.nx && !G.nxWas && Prog.gameOpen(wid, G.nx)) newGame = G.nx;
    Prog.check(true);
    Store.save();
    this.teardown(G);
    Screens.show('map');
    Voice.enter('map');
    MapView.useSet(G.W.w);
    MapView.update();
    await MapView.celebrate(wid, stars);
    if (Screens.cur === 'map' && !this.G && StopGo.maybe()) return;
    if (newGame && Screens.cur === 'map' && !this.G) MapView.openPanel(wid, '新游戏开啦！');
  },
  teardown(G) {
    G = G || this.G; if (!G) return;
    G.dead = true;
    if (this.G !== G) { G.scope.dispose(); return; }
    Input.abort();
    if (this.st) { Hints.disarm(this.st); try { G.game.cleanup(this.st); } catch (e) {} }
    this.st = null;
    G.scope.dispose();
    Voice.hush('leave');
    Sfx.ambientStop();
    Hand.kill();
    Stage.el.innerHTML = ''; Hand.el = null;
    Stage.bg.style.backgroundImage = '';
    $('#fx').innerHTML = '';
    this.ffOff();
    Loops.sweep();
    Stage.onRelayout = null;
    this.G = null;
  },
  home() {
    Sfx.touch();
    if (Screens.cur === 'finale') { Finale.stop(); Screens.show('map'); Voice.enter('map'); MapView.update(); MapView.after(T(500)); return; }
    if (!this.G) return;
    const G = this.G, wid = G.world, opened = G.nx && !G.nxWas && Prog.gameOpen(wid, G.nx);
    if (G.practice) { this.teardown(G); Book.open(G.item && G.item.tab, G.item && G.item.k); return; }
    Mem.today().ms += Math.max(0, Clock.t() - G.t0); Store.s.lastDay = DAY(); Store.save();
    Prog.check(true);
    this.teardown(this.G);
    Screens.show('map');
    Voice.enter('map');
    MapView.useSet(G.W.w);
    MapView.update();
    if (opened) MapView.openPanel(wid, '新游戏开啦！');
    else MapView.after(T(400));
  },
};

/* ---------------------------------------------------------------- the map: two seas, seven islands each, the festival island, the gate */
const MAPPOS = {
  land: { 0: [10, 38], 1: [29, 18], 2: [50, 15.5], 3: [71, 18], 4: [87, 38], 5: [76, 71], 6: [50, 74], fest: [24, 71], gate: [50, 46] },
  port: { 0: [19, 16], 1: [50, 13], 2: [81, 16], 3: [81, 47], 4: [77, 80], 5: [49, 83], 6: [21, 80], fest: [19, 47], gate: [50, 48] },
};
const MapView = {
  isl: {}, built: false, panel: null, set: 'w1',
  ids() { return ORDER[this.set].slice(); },
  useSet(n) {
    if (n !== 'w1' && !Prog.worldOpen(n)) n = 'w1';
    if (this.set === n && this.built) { this.tint(); return; }
    this.set = n; if (Store.s) { Store.s.mapSet = n; Store.save(); }
    if (this.built) { this.closePanel(true); $('#islands').innerHTML = ''; this.isl = {}; this.built = false; Loops.sweep(); this.build(); }
    this.tint();
  },
  tint() { $('#mapbg').style.backgroundImage = 'url(assets/bg/' + WORLDS_INFO[this.set].map + '.jpg)'; },
  build() {
    if (this.built) return;
    this.built = true;
    this.tint();
    const root = $('#islands'), WI = WORLDS_INFO[this.set];
    const soon = WI.partial ? Array.from({ length: Math.max(0, 7 - this.ids().length) }, (_, i) => 'soon' + i) : [];
    this.ids().concat(soon, WI.partial ? ['gate'] : ['fest', 'gate']).forEach(id => {
      const sp = id === 'fest' || id === 'gate' || /^soon/.test(id);
      const d = el('div', 'isl', root);
      const glow = el('div', '', d); Object.assign(glow.style, { position: 'absolute', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,247,190,.95), rgba(255,247,190,0) 68%)', opacity: 0 });
      const land = img('assets/isl/' + (id === 'fest' ? WI.fest : id === 'gate' ? WI.gate : /^soon/.test(id) ? 'fest2' : id) + '.png', 'land', d);
      if (/^soon/.test(id)) { land.style.filter = 'grayscale(1) brightness(1.4) opacity(.35)'; d.classList.add('locked', 'soon'); }
      const hero = img(sp ? 'assets/props/ui_star.png' : 'assets/chars/' + ISL[id].host + '.png', 'hero', d);
      const cloud = el('div', 'cloudcover', d);
      cloud.innerHTML = '<svg viewBox="0 0 200 120" width="100%" height="100%"><path d="M40 100C18 100 8 86 10 72C12 58 26 50 40 52C42 30 62 16 84 20C98 6 124 6 138 20C160 18 178 34 176 54C192 58 198 72 194 84C190 96 178 102 166 100Z" fill="#FFFFFF" stroke="#2B2118" stroke-width="5" stroke-linejoin="round" opacity=".96"/><path d="M60 64C68 60 76 60 84 64M110 58C118 54 126 54 134 58" stroke="#B9C7D6" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
      const lan = el('div', 'lantern', d); for (let i = 0; i < 10; i++) el('i', '', lan);
      const big = el('div', 'bigstars', d);
      const flag = el('div', 'flagpole gone', d);
      if (!sp) flag.innerHTML = FLAG_HTML(id);
      const deco = el('div', 'deco', d);
      const hit = el('div', 'hit', d);
      tapify(hit, () => this.tapIsland(id));
      this.isl[id] = { d, glow, land, hero, cloud, lan, big, flag, hit, deco };
      if (sp) { lan.remove(); big.remove(); flag.remove(); }
      if (/^soon/.test(id)) { hero.src = 'assets/props/ui_star.png'; }
      if (id === 'gate') d.classList.add('gate');
    });
    this.layout();
    this.update();
    this.idle();
  },
  pos(id) { const P = (window.innerHeight > window.innerWidth * 1.02) ? MAPPOS.port : MAPPOS.land; if (/^soon/.test(id)) return P[ORDER[this.set].length + Number(id.slice(4))]; return id === 'fest' || id === 'gate' ? P[id] : P[ORDER[this.set].indexOf(id)]; },
  layout() {
    if (!this.built) return;
    const vw = window.innerWidth, vh = window.innerHeight, port = vh > vw * 1.02;
    const S = Math.round(Math.min(vw, vh) * (port ? 0.27 : 0.25));
    const pts = [];
    Object.keys(this.isl).forEach(id => {
      const I = this.isl[id], [px, py] = this.pos(id), x = vw * px / 100, y = vh * py / 100, sp = id === 'fest' || id === 'gate', s = id === 'fest' ? S * 0.9 : id === 'gate' ? S * 0.8 : S;
      Object.assign(I.d.style, { left: x + 'px', top: y + 'px' });
      Object.assign(I.land.style, { width: s + 'px' });
      Object.assign(I.glow.style, { width: s * 1.5 + 'px', height: s * 1.5 + 'px', left: -s * 0.75 + 'px', top: -s * 0.75 + 'px' });
      Object.assign(I.hero.style, { height: (sp ? s * 0.28 : s * 0.46) + 'px', left: (sp ? -s * 0.14 : s * 0.02) + 'px', top: (sp ? -s * 0.62 : -s * 0.5) + 'px' });
      if (id === 'gate') Object.assign(I.cloud.style, { width: s * 1.1 + 'px', height: s * 0.68 + 'px', top: '50%' });
      else Object.assign(I.cloud.style, { width: s * 0.86 + 'px', height: s * 0.54 + 'px', top: '62%' });
      Object.assign(I.hit.style, { width: s * 0.95 + 'px', height: s * 0.95 + 'px', left: -s * 0.475 + 'px', top: -s * 0.5 + 'px' });
      Object.assign(I.deco.style, { left: (-s * 0.46) + 'px', top: (s * 0.02) + 'px', height: (s * 0.24) + 'px' });
      if (I.lan.isConnected) { I.lan.style.left = '0px'; I.lan.style.top = (s * 0.36) + 'px'; I.big.style.left = '0px'; I.big.style.top = (s * 0.36 + 64) + 'px'; I.flag.style.left = (s * 0.3) + 'px'; I.flag.style.top = Math.max(-s * 0.55, 24 - y) + 'px'; }
      if (id !== 'gate') pts.push([x, y]);
    });
    const sv = $('#mapsvg'); sv.innerHTML = '';
    sv.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    let dpath = '';
    pts.forEach(([x, y], i) => { if (!i) dpath = 'M' + x + ' ' + y; else { const [px, py] = pts[i - 1]; const mx = (px + x) / 2, my = (py + y) / 2 - 30; dpath += ' Q' + mx + ' ' + my + ' ' + x + ' ' + y; } });
    svg('path', { d: dpath, fill: 'none', stroke: 'rgba(255,255,255,.85)', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-dasharray': '2 26' }, sv);
    if (this.panel) this.closePanel(true);
  },
  /* the gate: on the first sea it opens to the second (gold), on the second it goes back - or on to the third once that
     sea is open (gold); on the third it goes home to the first */
  gateOpen() { return this.set === 'w1' ? Prog.worldOpen('w2') && Store.s.gate2 : true; },
  gateTo() { return this.set === 'w1' ? 'w2' : this.set === 'w2' ? (Prog.worldOpen('w3') && Store.s.gate3 ? 'w3' : 'w1') : 'w1'; },
  recommend() {
    const w = this.set;
    if (Prog.worldDone(w)) return WORLDS_INFO[w].partial ? null : (w === 'w1' && Store.s.fin.w1 === 'seen' && !Prog.worldDone('w2')) || (w === 'w2' && Store.s.fin.w2 === 'seen' && Prog.worldOpen('w3')) ? 'gate' : 'fest';
    const open = ORDER[w].filter(id => Store.w(id).unlocked);
    return open.find(id => !Prog.islandDone(id)) || open[open.length - 1];
  },
  update() {
    if (!this.built) { this.build(); return; }
    const rec = this.recommend();
    this.ids().forEach(id => {
      const I = this.isl[id], ws = Store.w(id);
      I.d.classList.toggle('locked', !ws.unlocked || !!ws.justOpened);
      I.hero.style.opacity = ws.unlocked && !ws.justOpened ? 1 : 0;
      const lamps = $$('i', I.lan), ones = ws.stars % 10;
      lamps.forEach((l, i) => l.classList.toggle('on', i < ones));
      const tens = Math.floor(ws.stars / 10);
      if (I.big.childElementCount !== Math.min(tens, 6)) { I.big.innerHTML = ''; for (let i = 0; i < Math.min(tens, 6); i++) img('assets/props/ui_star.png', '', I.big); }
      I.flag.classList.toggle('gone', !(Store.s.flags.includes(id) && flagged(id)));
      Story.mapDeco(I, ws);
      I.glow.style.opacity = id === rec ? 1 : 0;
      I.lan.style.opacity = ws.unlocked ? 1 : 0.35;
    });
    const Gt = this.isl.gate, gOpen = this.gateOpen();
    if (Gt) { Gt.d.classList.toggle('locked', !gOpen); Gt.d.classList.toggle('sky', (this.set === 'w1' && gOpen) || (this.set === 'w2' && this.gateTo() === 'w3')); Gt.hero.style.opacity = gOpen ? 0 : 1; Gt.glow.style.opacity = rec === 'gate' ? 1 : 0; }
    MapV2.update();
    const F = this.isl.fest;
    if (F) { F.d.classList.toggle('locked', Store.s.fin[this.set] !== 'seen'); F.glow.style.opacity = rec === 'fest' ? 1 : 0; }
    $('.cnt', $('#bookbtn')).textContent = Prog.learnedCount();
    this.tint();
  },
  idle() {
    Object.keys(this.isl).forEach((id, i) => {
      const h = this.isl[id].hero;
      h.animate([{ transform: 'translateY(0) rotate(-2deg)' }, { transform: 'translateY(-6px) rotate(2deg)' }, { transform: 'translateY(0) rotate(-2deg)' }], { duration: 2600 + i * 170, iterations: Infinity, easing: 'ease-in-out' });
    });
  },
  tapIsland(id) {
    if (/^soon/.test(id)) { this.isl[id].cloud.animate([{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-56%,-50%)' }, { transform: 'translate(-44%,-50%)' }, { transform: 'translate(-50%,-50%)' }], { duration: T(420) + 1 }); Voice.sayNow('新岛快来啦！', { tag: 'map' }); return; }
    if (id === 'gate' || id === 'fest') {
      const I = this.isl[id], fin = Store.s.fin[this.set];
      if (id === 'gate') {
        if (this.set === 'w2' && Prog.worldOpen('w3') && !Store.s.gate3) { const live = this.liveTok(); this.specials(live).then(shown => { if (!shown && live() && !Store.s.gate3) { Store.s.gate3 = true; Store.save(); this.sail(); } }); return; }
        if (this.set !== 'w1') { this.sail(); return; }
        if (Prog.worldOpen('w2')) {
          if (!Store.s.gate2) { const live = this.liveTok(); this.specials(live).then(shown => { if (!shown && live() && !Store.s.gate2) { Store.s.gate2 = true; Store.save(); this.sail(); } }); return; }
          this.sail(); return;
        }
      } else if (fin) {
        if (fin === 'seen') { Finale.play(this.set); return; }
        this.specials(this.liveTok()); return;
      }
      I.cloud.animate([{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-56%,-50%)' }, { transform: 'translate(-44%,-50%)' }, { transform: 'translate(-50%,-50%)' }], { duration: T(420) + 1 });
      I.hero.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3) rotate(20deg)' }, { transform: 'scale(1)' }], { duration: T(500) + 1 });
      Voice.sayNow(id === 'gate' ? '这里有惊喜哦！' : '大家都在等你！', { tag: 'map' });
      const r = this.recommend(); if (r && r !== id) setTimeout(() => this.pointAt(r), T(600));
      return;
    }
    const ws = Store.w(id);
    if (!ws.unlocked) {
      const I = this.isl[id];
      I.cloud.animate([{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-56%,-50%)' }, { transform: 'translate(-44%,-50%)' }, { transform: 'translate(-50%,-50%)' }], { duration: T(420) + 1 });
      Voice.sayNow('先去这里玩吧！', { tag: 'map' });
      const r = this.recommend(); if (r) this.pointAt(r);
      return;
    }
    this.openPanel(id);
  },
  pointAt(id) {
    const I = this.isl[id]; if (!I) return;
    const r = I.land.getBoundingClientRect();
    const h = el('div', '', $('#map')); h.innerHTML = ICONS.hand;
    Object.assign(h.style, { position: 'absolute', width: '90px', height: '90px', left: (r.left + r.width / 2 - 20) + 'px', top: (r.top + r.height * 0.55) + 'px', zIndex: 20, pointerEvents: 'none' });
    const a = h.animate([{ transform: 'translateY(30px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1, offset: 0.2 }, { transform: 'translateY(-12px)', offset: 0.45 }, { transform: 'translateY(0)', offset: 0.7 }, { transform: 'translateY(0)', opacity: 0 }], { duration: T(1800) + 1 });
    a.onfinish = () => h.remove();
  },
  /* the island panel: its four games (5 small stars under each), its flag, and its words - grey until written */
  openPanel(id, line) {
    this.closePanel(true);
    const W = ISL[id];
    Voice.sayNow(line || W.hi, { tag: line ? 'unlock' : 'map' });
    const p = this.panel = el('div', '', $('#map'));
    Object.assign(p.style, { position: 'absolute', inset: 0, zIndex: 30, background: this.set === 'w2' ? 'rgba(14,22,64,.74)' : 'rgba(12,44,74,.6)' });
    tapify(p, () => this.closePanel(), { silent: true });
    const vw = window.innerWidth, vh = window.innerHeight, port = vh > vw * 1.02;
    /* the whole panel (host, island, games, stars, words) fits the screen and is centred: no head cut by the top (R1-06) */
    let S = Math.min(vw, vh);
    const tall = s => 0.48 * s + 0.16 * s + Math.max(112, Math.round(s * 0.15)) / 2 + 34 + Math.round(Math.min(84, s * 0.1));
    if (tall(S) > vh - 32) S *= (vh - 32) / tall(S);
    const cx = vw / 2, cy = 16 + 0.48 * S + Math.max(0, (vh - 32 - tall(S)) / 2);
    const land = img('assets/isl/' + id + '.png', '', p);
    Object.assign(land.style, { position: 'absolute', width: S * 0.4 + 'px', left: (cx - S * 0.2) + 'px', top: (cy - S * 0.38) + 'px', pointerEvents: 'none' });
    land.animate([{ transform: 'scale(.5)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: T(360) + 1, easing: EASE.pop });
    const heroA = img('assets/chars/' + W.host + '.png', '', p);
    Object.assign(heroA.style, { position: 'absolute', height: S * 0.25 + 'px', left: (cx - S * 0.04) + 'px', top: (cy - S * 0.48) + 'px', pointerEvents: 'none' });
    Loops.run(heroA, [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }], { duration: 1400 });
    const rec = W.games.find(g => Prog.gameOpen(id, g) && !Prog.gameDone(id, g)) || (Prog.gamesDone(id) && !flagged(id) ? W.games[0] : W.games.filter(g => Prog.gameOpen(id, g)).slice(-1)[0]);
    const M = Math.max(112, Math.round(S * 0.15)), gap = Math.round(M * 0.26), FS = Math.round(M * 0.72);
    const games = W.games.filter(g => GAMES[g]), x0 = cx - (games.length * (M + gap) + FS) / 2, y = cy + S * 0.16;
    games.forEach((g, i) => {
      const x = x0 + i * (M + gap) + M / 2;
      const m = el('div', 'btn', p);
      m.dataset.game = g;
      Object.assign(m.style, { width: M + 'px', height: M + 'px', left: (x - M / 2) + 'px', top: (y - M / 2) + 'px', overflow: 'hidden', background: '#fff' });
      const th = img('assets/bgthumb/' + GAMES[g].bg + '.jpg', '', m);
      Object.assign(th.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' });
      const ic = el('div', '', m); ic.appendChild(GAMES[g].icon());
      Object.assign(ic.style, { position: 'absolute', width: '64%', height: '64%', left: '18%', top: '18%', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 4px 0 rgba(43,33,24,.3))' });
      if (g === rec) { m.style.boxShadow = '0 0 0 4px #2B2118, 0 0 0 12px rgba(255,236,140,.95), 0 12px 30px rgba(255,210,60,.8)'; Loops.run(m, [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 1200, iterations: Infinity }); }
      m.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: T(320) + 1, delay: T(80 * i), easing: EASE.pop, fill: 'backwards' });
      const locked = !Prog.gameOpen(id, g);
      if (locked) {
        th.style.filter = ic.style.filter = 'grayscale(1) brightness(.75)';
        const lk = el('span', '', m); lk.innerHTML = '<svg viewBox="0 0 40 40" width="100%" height="100%"><rect x="9" y="18" width="22" height="17" rx="4" fill="#FFC93C" stroke="#2B2118" stroke-width="3"/><path d="M13 18V13a7 7 0 0 1 14 0v5" fill="none" stroke="#2B2118" stroke-width="3.5"/></svg>';
        Object.assign(lk.style, { position: 'absolute', width: '46%', height: '46%', right: '-6%', bottom: '-6%' });
      } else if (Prog.gameDone(id, g)) {
        const ok = el('span', '', m); ok.innerHTML = ICONS.check; Object.assign(ok.style, { position: 'absolute', width: '38%', height: '38%', right: '-4%', bottom: '-4%', background: '#5CC46E', borderRadius: '50%', boxShadow: '0 0 0 3px #2B2118' });
      }
      if (!locked) {
        const n = Prog.gameDone(id, g) ? 5 : Math.min(5, Prog.stars(id, g)), sz = Math.round(M / 5.6);
        const row = el('div', 'gstars', p); row.dataset.n = n;
        Object.assign(row.style, { position: 'absolute', left: (x - M / 2) + 'px', top: (y + M / 2 + 8) + 'px', width: M + 'px', display: 'flex', justifyContent: 'center', gap: '1px', pointerEvents: 'none' });
        for (let k = 0; k < 5; k++) { const s = img('assets/props/ui_star.png', '', row); Object.assign(s.style, { width: sz + 'px', height: sz + 'px', filter: k < n ? 'drop-shadow(0 2px 0 rgba(43,33,24,.35))' : 'grayscale(1) brightness(1.6) opacity(.55)' }); }
      }
      tapify(m, () => {
        if (locked) { m.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }], { duration: T(360) + 1 }); Voice.sayNow('先集满五颗星！', { tag: 'map' }); return; }
        this.closePanel(true); Session.start(id, g);
      });
    });
    const has = flagged(id), fs = el('div', 'btn', p);
    Object.assign(fs.style, { width: FS + 'px', height: FS + 'px', left: (x0 + games.length * (M + gap)) + 'px', top: (y - FS / 2) + 'px', background: has ? '#FFF3C4' : 'rgba(255,255,255,.55)', boxShadow: has ? '0 0 0 4px #2B2118, 0 0 0 10px rgba(255,201,60,.9)' : '0 0 0 4px rgba(43,33,24,.45)', border: has ? '' : '3px dashed rgba(43,33,24,.35)', overflow: 'visible' });
    const fp = el('div', 'flagpole', fs); fp.innerHTML = FLAG_HTML(id);
    Object.assign(fp.style, { left: (FS * 0.28) + 'px', top: (FS * 0.5 - 30) + 'px', height: '64px', filter: has ? '' : 'grayscale(1) opacity(.45)' });
    tapify(fs, () => { fs.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: T(400) + 1 }); Voice.sayNow(has ? '旗子插好啦！' : Prog.gamesDone(id) ? '再玩一局插旗子！' : '集满星星有旗子！', { tag: 'map' }); });
    /* the island's words: grey until written once; a tap says them */
    const items = W.chars.map(c => c.c).concat(W.letters.map(l => l.l)), WS = Math.round(Math.min(84, S * 0.1)), wg = 10;
    const wrow = el('div', '', p), tw = items.length * (WS + wg) - wg;
    Object.assign(wrow.style, { position: 'absolute', left: (cx - tw / 2) + 'px', top: (y + M / 2 + 34) + 'px', width: tw + 'px', display: 'flex', gap: wg + 'px' });
    items.forEach((k, i) => {
      const t = el('div', 'btn', wrow); Object.assign(t.style, { position: 'relative', width: WS + 'px', height: WS + 'px', borderRadius: '18px', background: learned(k) ? '#fff' : 'rgba(255,255,255,.45)' });
      const gg = Glyph.any(k, WS * 0.78, learned(k) ? INK : 'rgba(43,33,24,.3)'); t.appendChild(gg);
      t.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: T(260) + 1, delay: T(300 + 40 * i), easing: EASE.pop, fill: 'backwards' });
      tapify(t, () => { const it = ITEM[k]; Voice.sayNow(it.line, { tag: 'map' }); if (it.en && Store.s.settings.en) Voice.say(it.en, { tag: 'map' }); t.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: T(300) + 1 }); });
    });
  },
  closePanel(instant) {
    const p = this.panel; if (!p) return;
    this.panel = null;
    if (instant || fast()) { p.remove(); Loops.sweep(); return; }
    const a = p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }); a.onfinish = () => { p.remove(); Loops.sweep(); };
  },
  enter() { this.useSet(Store.s.mapSet || 'w1'); this.update(); this.after(T(900)); MapV2.hello(); },
  after(ms) {
    const live = this.liveTok();
    setTimeout(async () => { if (!live() || await this.specials(live) || !live()) return; const r = this.recommend(); if (r) this.pointAt(r); }, ms);
  },
  liveTok() { const tok = this.celebTok = (this.celebTok || 0) + 1; return () => this.celebTok === tok && Screens.cur === 'map' && !Session.G; },
  async specials(live) {
    for (const id of this.ids().filter(o => flagged(o) && !Store.s.flags.includes(o))) {
      if (!live()) return true;
      Store.s.flags.push(id); Store.save();
      await this.plantFlag(id);
    }
    for (const o of this.ids().filter(o => Store.w(o).justOpened)) {
      if (!live()) return true;
      delete Store.w(o).justOpened; Store.save();
      const J = this.isl[o];
      J.d.classList.remove('locked');
      J.cloud.animate([{ opacity: 1, transform: 'translate(-50%,-50%)' }, { opacity: 0, transform: 'translate(-50%,-90%) scale(1.4)' }], { duration: T(900) + 1, fill: 'forwards' });
      J.hero.style.opacity = 1;
      J.hero.animate([{ transform: 'translateY(24px) scale(.2)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1 }], { duration: T(520) + 1, delay: T(380), easing: EASE.pop, fill: 'backwards' });
      Sfx.fanfare(); Voice.say('新小岛开啦！', { tag: 'unlock' });
      await new Promise(r => setTimeout(r, T(1000)));
      this.update();
    }
    if (!live()) return true;
    const w = this.set;
    if (Store.s.fin[w] === 'due' && this.isl.fest) {
      Store.s.fin[w] = 'seen'; Store.save();
      await this.openShow('fest', '庆典开始啦！');
      if (live()) this.pointAt('fest');
      await new Promise(r => setTimeout(r, T(2200)));
      if (live()) Finale.play(w);
      return true;
    }
    if (w === 'w2' && Prog.worldOpen('w3') && !Store.s.gate3 && Store.s.fin.w2 !== 'due' && this.isl.gate) {
      Store.s.gate3 = true; Store.save();
      this.isl.gate.d.classList.add('sky');
      await this.openShow('gate', '惊喜来啦！');
      if (live()) this.pointAt('gate');
      return true;
    }
    if (w === 'w1' && Prog.worldOpen('w2') && !Store.s.gate2 && Store.s.fin.w1 !== 'due' && this.isl.gate) {
      Store.s.gate2 = true; Store.save();
      this.isl.gate.d.classList.add('sky');
      await this.openShow('gate', '惊喜来啦！');
      if (live()) this.pointAt('gate');
      return true;
    }
    return false;
  },
  async plantFlag(id) {
    const I = this.isl[id]; this.update();
    I.flag.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1.12)', offset: 0.7 }, { transform: 'scaleY(1)' }], { duration: T(560) + 1, easing: EASE.pop });
    $('.cloth', I.flag).animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: T(420) + 1, delay: T(380), easing: EASE.pop, fill: 'backwards' });
    const r = I.flag.getBoundingClientRect();
    Sfx.fanfare(); Fx.burst(r.left + 30, r.top + 16, { screen: true, n: 16 });
    const n = Store.s.flags.length;
    Voice.say(n === 1 ? '插上旗子啦！' : CNQ(n) + '面旗子啦！', { tag: 'unlock' });
    await new Promise(r2 => setTimeout(r2, T(1500)));
    Store.s.flagDays.push(DAY()); Store.save();
    if (!fast()) { Keys.turn('flag'); await new Promise(r2 => setTimeout(r2, T(2600))); } else Keys.turn('flag');
  },
  async openShow(id, line) {
    const J = this.isl[id];
    J.d.classList.remove('locked');
    J.cloud.animate([{ opacity: 1, transform: 'translate(-50%,-50%)' }, { opacity: 0, transform: 'translate(-50%,-90%) scale(1.4)' }], { duration: T(900) + 1, fill: 'forwards' });
    J.land.animate([{ transform: 'translate(-50%,-50%) scale(.2)' }, { transform: 'translate(-50%,-50%) scale(1)' }], { duration: T(700) + 1, easing: EASE.pop });
    Sfx.fanfare(); Voice.say(line, { tag: 'unlock' });
    await new Promise(r => setTimeout(r, T(1300)));
    this.update();
  },
  async sail() {
    if (this.sailing) return;
    this.sailing = true; this.liveTok(); this.closePanel(true);
    const to = this.gateTo(), first = (to === 'w2' && !Store.s.w2seen) || (to === 'w3' && !Store.s.w3seen);
    Sfx.reveal();
    this.isl.gate.land.animate([{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: 'translate(-50%,-50%) scale(1.35) rotate(-4deg)' }], { duration: T(560) + 1, easing: EASE.pop, fill: 'forwards' });
    const ov = el('div', '', $('#map'));
    Object.assign(ov.style, { position: 'absolute', inset: 0, zIndex: 40, background: 'radial-gradient(circle at 50% 48%, #FFFFFF 0%, #E3D4FF 30%, #8E6CFF 75%, #4B2F9E 100%)' });
    const wait = (a, ms) => new Promise(r => { a.onfinish = r; setTimeout(r, ms); });
    await wait(ov.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T(560) + 1, fill: 'forwards' }), T(560) + 80);
    if (to === 'w2') { Store.s.w2seen = true; Store.s.gate2 = true; Prog.check(false); Store.save(); }
    if (to === 'w3') { Store.s.w3seen = true; Store.s.gate3 = true; Prog.check(false); Store.save(); }
    this.useSet(to); this.update();
    Object.keys(this.isl).forEach((id, i) => this.isl[id].d.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: T(420) + 1, delay: T(240 + 70 * i), easing: EASE.pop, fill: 'backwards' }));
    await wait(ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T(520) + 1, fill: 'forwards' }), T(520) + 80);
    ov.remove(); this.sailing = false;
    if (Screens.cur !== 'map' || Session.G) return;
    if (first) { Sfx.fanfare(); Fx.confetti(30); }
    Voice.sayNow(first ? (to === 'w3' ? '彩虹海到啦！' : '星光海到啦！') : to === 'w2' ? '去星光海！' : to === 'w3' ? '去彩虹海！' : '回到晨光海！', { tag: 'map' });
    this.after(T(1000));
  },
  /* stars fly into the island's lantern (ten lamps; ten make one big star) */
  async celebrate(wid, n) {
    this.useSet(ISL[wid].w);
    this.build();
    const tok = this.celebTok = (this.celebTok || 0) + 1;
    const live = () => this.celebTok === tok && Screens.cur === 'map' && !Session.G;
    let skip = false, fly = null;
    const onTap = () => { skip = true; if (fly) try { fly.finish(); } catch (e) {} };
    $('#map').addEventListener('pointerdown', onTap, { capture: true, once: true });
    const ws = Store.w(wid), I = this.isl[wid];
    if (!I) { this.update(); return; }
    const before = ws.stars - n;
    const lamps = $$('i', I.lan);
    lamps.forEach((l, i) => l.classList.toggle('on', before > 0 && i < before % 10));
    const bigN = Math.floor(before / 10);
    I.big.innerHTML = ''; for (let i = 0; i < Math.min(bigN, 6); i++) img('assets/props/ui_star.png', '', I.big);
    await new Promise(r => setTimeout(r, T(150)));
    let cur = before;
    for (let i = 0; i < n; i++) {
      if (!live()) return;
      if (skip) break;
      cur++;
      const slot = lamps[(cur - 1) % 10], sr = slot.getBoundingClientRect();
      const star = img('assets/props/ui_star.png', '', $('#fx'));
      const sx = window.innerWidth / 2, sy = window.innerHeight / 2;
      Object.assign(star.style, { position: 'absolute', width: '60px', height: '60px', left: (sx - 30) + 'px', top: (sy - 30) + 'px' });
      const a = star.animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1.2)', opacity: 1, offset: 0.3 }, { transform: 'translate(' + (sr.left + sr.width / 2 - sx) + 'px,' + (sr.top + sr.height / 2 - sy) + 'px) scale(.4)', opacity: 1 }], { duration: T(DUR.mapStar) + 1, easing: EASE.glide, fill: 'forwards' });
      fly = a;
      await new Promise(r => { a.onfinish = r; setTimeout(r, T(DUR.mapStar + 80) + 30); });
      fly = null;
      star.remove(); if (!live()) return;
      slot.classList.add('on'); Sfx.star();
      slot.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: T(240) + 1, easing: EASE.pop });
      if (cur % 10 === 0) {
        await new Promise(r => setTimeout(r, T(450)));
        if (!live()) return;
        lamps.forEach(l => l.animate([{ transform: 'scale(1)' }, { transform: 'scale(0)' }], { duration: T(300) + 1, fill: 'forwards' }));
        await new Promise(r => setTimeout(r, T(320)));
        lamps.forEach(l => { l.getAnimations().forEach(x => x.cancel()); l.classList.remove('on'); });
        const bs = img('assets/props/ui_star.png', '', I.big);
        bs.animate([{ transform: 'scale(3)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: T(500) + 1, easing: EASE.pop });
        Sfx.complete(); Voice.say('十颗变一颗大星！', { tag: 'ten' });
        await new Promise(r => setTimeout(r, T(600)));
      } else await new Promise(r => setTimeout(r, T(DUR.mapGap)));
    }
    $('#map').removeEventListener('pointerdown', onTap, { capture: true });
    if (!live()) return;
    this.update();
    await this.specials(live);
  },
};

/* ---------------------------------------------------------------- 我的字宝盒: every character and letter; written ones in colour,
   practised ones get flowers (3 = a gold frame); a tap on one opens it for free writing (no stars, any time) */
const Book = {
  tab: 'zh',
  open(tab, focus) {
    MapView.closePanel(true);
    this.tab = tab || this.tab;
    Screens.show('book'); Voice.enter('book');
    this.render(focus);
    if (!focus) Voice.sayNow('我的字宝盒！', { tag: 'map' });
  },
  render(focus) {
    const B = $('#book'), tabs = $('.tabs', B), grid = $('.grid', B), meter = $('.meter', B);
    tabs.innerHTML = '';
    [['zh', '汉字'], ['up', 'ABC'], ['lo', 'abc']].forEach(([k, t]) => {
      const b = el('button', 'tab' + (k === this.tab ? ' on' : ''), tabs); b.textContent = t;
      tapify(b, () => { if (this.tab === k) return; this.tab = k; this.render(); Voice.sayNow(k === 'zh' ? '汉字' : k === 'up' ? '大写字母' : '小写字母', { tag: 'map' }); });
    });
    const nZh = ITEMS.filter(x => x.kind === 'zh' && learned(x.k)).length, nEn = ITEMS.filter(x => x.kind !== 'zh' && learned(x.k)).length;
    meter.innerHTML = '';
    const top = el('div', 'mt', meter); img('assets/props/chest.png', '', top); el('span', '', top, { text: nZh + ' 个字 · ' + nEn + ' 个字母' });
    /* the two seas as bars, one segment an island, filling as its characters and letters are learned (R1-08) */
    Object.keys(ORDER).forEach(w => { const row = el('div', 'bar', meter); ORDER[w].forEach(id => { const its = ITEMS.filter(x => x.isl === id), f = its.filter(x => learned(x.k)).length / its.length, seg = el('i', '', row); seg.style.setProperty('--f', (f * 100).toFixed(0) + '%'); seg.style.setProperty('--c', ISL[id].color); if (f >= 1) seg.classList.add('full'); }); });
    grid.innerHTML = '';
    let focusEl = null;
    ALL_ISL().forEach(id => {
      const its = ITEMS.filter(x => x.isl === id && x.kind === this.tab);
      if (!its.length) return;
      const h = el('h4', '', grid); img('assets/thumbs/' + ISL[id].host + '.png', '', h); el('span', '', h, { text: ISL[id].name });
      its.forEach(it => {
        const on = learned(it.k), lv = (Store.s.learned[it.k] || {}).p || 0;
        const t = el('div', 'tile' + (on ? '' : ' locked') + (lv >= 3 ? ' gold' : ''), grid);
        t.appendChild(it.kind === 'zh' ? Glyph.zh(it.k, 78) : Glyph.en(it.k, 70));
        const pic = it.obj ? img('assets/obj/' + it.obj + '.png', 'pic', t) : (() => { const n = Scene.of(it.k, 60); n.classList.add('pic'); t.appendChild(n); return n; })();
        el('div', 'en', t, { text: it.en || '' });
        if (on) { const fl = el('div', 'fl', t); for (let i = 0; i < 3; i++) el('i', i < lv ? 'on' : '', fl); }
        else { const lk = el('div', 'lk', t); lk.innerHTML = '<svg viewBox="0 0 40 40" width="100%" height="100%"><rect x="9" y="18" width="22" height="17" rx="4" fill="#FFC93C" stroke="#2B2118" stroke-width="3"/><path d="M13 18V13a7 7 0 0 1 14 0v5" fill="none" stroke="#2B2118" stroke-width="3.5"/></svg>'; }
        void pic;
        let sx = 0, sy = 0, moved = false;
        t.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; moved = false; Sfx.touch(); });
        t.addEventListener('pointermove', e => { if (Math.hypot(e.clientX - sx, e.clientY - sy) > 14) moved = true; });
        t.addEventListener('pointerup', () => {
          if (moved) return;
          if (!on) { t.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: T(300) + 1 }); Voice.sayNow('还没学到哦', { tag: 'map' }); return; }
          Sfx.tap(); Practice.start(it);
        });
        if (focus && it.k === focus) focusEl = t;
      });
    });
    if (focusEl) { focusEl.scrollIntoView({ block: 'center' }); const lv = (Store.s.learned[focus] || {}).p || 0; const f = $$('.fl i', focusEl)[Math.min(2, lv - 1)]; if (f) f.animate([{ transform: 'scale(2.4)' }, { transform: 'scale(1)' }], { duration: T(600) + 1, easing: EASE.pop }); }
  },
  close() { Screens.show('map'); Voice.enter('map'); MapView.update(); MapView.after(T(300)); },
};
const Practice = {
  start(it) { Session.start(it.isl, 'practice:' + it.kind, { practice: true, item: { k: it.k, tab: it.kind, it } }); },
};

/* ---------------------------------------------------------------- parent (long press on the gear) */
const Parent = {
  initGear() {
    const g = $('#gear'), ring = $('circle', $('.ring', g));
    let pid = null, sx = 0, sy = 0, t = 0, anim = null;
    const cancel = () => { clearTimeout(t); t = 0; pid = null; g.classList.remove('press'); if (anim) { anim.cancel(); anim = null; } ring.style.strokeDashoffset = 145; };
    g.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation();
      pid = e.pointerId; sx = e.clientX; sy = e.clientY;
      try { g.setPointerCapture(pid); } catch (err) {}
      g.classList.add('press');
      anim = ring.animate([{ strokeDashoffset: 145 }, { strokeDashoffset: 0 }], { duration: 1600, fill: 'forwards' });
      t = setTimeout(() => { cancel(); this.open(); }, 1600);
    });
    g.addEventListener('pointermove', e => { if (e.pointerId === pid && Math.hypot(e.clientX - sx, e.clientY - sy) > 26) cancel(); });
    g.addEventListener('pointerup', e => { if (e.pointerId !== pid) return; const short = !!t; cancel(); if (short) this.toast('家长你好：请按住小齿轮'); });
    g.addEventListener('pointercancel', cancel);
    g.addEventListener('contextmenu', e => e.preventDefault());
  },
  toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(this.tt); this.tt = setTimeout(() => t.classList.remove('on'), 2400); },
  open() { this.panel(); $('#parent').classList.add('on'); },
  close() { $('#parent').classList.remove('on'); $('.sheet', $('#parent')).innerHTML = ''; },
  panel() {
    const sh = $('.sheet', $('#parent'));
    sh.innerHTML = '';
    el('h2', '', sh, { text: '家长面板 · 字字岛' });
    const x = el('button', 'pbtn x', sh, { text: '关闭' }); x.addEventListener('click', () => { this.close(); MapView.update(); });
    el('div', 'mut', sh, { text: '规则：每个小游戏集满 5 颗星（只有自己第一次就对才给星；写字要每一笔都对；第二级提示之后答对不给星）打 ✓；四个都 ✓、而且这个岛的每个字都在两局里自己答对过，插旗、开下一个岛。每个字按遗忘规律复习（1、3、7、14、30、60、120 天），复习题混在每一局里。字宝盒里的字随时可以练，练字不影响星星。' });
    el('h3', '', sh, { text: '学会的字：' + ITEMS.filter(i => i.kind === 'zh' && learned(i.k)).length + ' / ' + ITEMS.filter(i => i.kind === 'zh').length + ' 个汉字，' + ITEMS.filter(i => i.kind !== 'zh' && learned(i.k)).length + ' / ' + ITEMS.filter(i => i.kind !== 'zh').length + ' 个字母' });
    Object.keys(ORDER).forEach(w => {
      el('h3', '', sh, { text: WORLDS_INFO[w].name + (Prog.worldOpen(w) ? '' : '（未开放）') + (WORLDS_INFO[w].partial ? '（其余岛屿制作中）' : '') });
      const t = el('table', '', sh); t.innerHTML = '<tr><th>岛</th><th>开放</th><th>小游戏（✓ 已过 · 星 · 难度）</th><th>字</th></tr>';
      ORDER[w].forEach(id => {
        const ws = Store.w(id), tr = el('tr', '', t), W = ISL[id];
        el('td', '', tr, { text: W.name });
        el('td', '', tr, { text: ws.unlocked ? (Prog.islandDone(id) ? '已插旗' : Prog.gamesDone(id) ? '四关已过，字还没过关' : '开放') : '未开放' });
        el('td', '', tr, { text: W.games.map(g => GAMES[g].title + (Prog.gameDone(id, g) ? ' ✓' : Prog.gameOpen(id, g) ? ' ·' : ' 🔒') + Prog.stars(id, g) + '★ L' + Prog.level(id, g)).join('  ') });
        el('td', '', tr, { text: W.chars.map(c => c.c).concat(W.letters.map(l => l.l)).map(k => k + (learned(k) ? '✓' : '')).join(' ') });
      });
    });
    ParentV2.sections(sh);
    el('h3', '', sh, { text: '声音' });
    const d = Voice.diag();
    el('div', 'mut', sh, { html: '音频：' + d.ctx + '；录音：' + (Bank.set ? Bank.set.size + ' 句' : '加载中') + '<br>听不到声音时：① 调大音量；② 关掉侧边静音开关；③ 回到首页重新点绿色开始按钮。' });
    const tb = el('button', 'pbtn', sh, { text: '测试发声' }); tb.addEventListener('click', () => { Sfx.touch(); Voice.sayNow('我是字字岛！', { tag: 'test' }); Voice.say('Hello!', { tag: 'test' }); });
    const en = el('button', 'pbtn', sh, { text: '英文读音：' + (Store.s.settings.en ? '开' : '关') });
    en.addEventListener('click', () => { Store.s.settings.en = !Store.s.settings.en; Store.save(); en.textContent = '英文读音：' + (Store.s.settings.en ? '开' : '关'); });
    el('div', 'mut', sh, { text: '英文读音：写完一个汉字后再用英文读一遍它（如“山”之后读 mountain）。字母游戏里的英文总会读。' });
    el('h3', '', sh, { text: '离线' });
    const off = el('div', '', sh, { text: '检查中…' });
    (async () => {
      try {
        let n = 0;
        for (const k of await caches.keys()) { if (!k.startsWith('zzi-assets-')) continue; const m = await (await caches.open(k)).match('./__zzi_meta.json'); if (m) n = Math.max(n, Object.keys(await m.json()).length); }
        const ctl = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
        off.textContent = n && ctl ? '已就绪：' + n + ' 个图片与声音已存到本机，断网也能玩。' : '还没准备好：请联网打开，在地图上停留约 1 分钟后再看。';
      } catch (e) { off.textContent = '这个浏览器不能离线使用。'; }
    })();
    el('h3', '', sh, { text: '设置' });
    const ul = el('button', 'pbtn', sh, { text: '全部解锁' });
    ul.addEventListener('click', () => { Store.s.all = true; ALL_ISL().forEach(o => { Store.w(o).unlocked = true; }); Store.save(); ul.textContent = '已全部解锁'; });
    let n = 0;
    const rs = el('button', 'pbtn warn', sh, { text: '清空进度' });
    rs.addEventListener('click', () => { n++; if (n === 1) rs.textContent = '确定清空？再按一次'; else if (n === 2) rs.textContent = '最后确认：清空全部进度'; else { Store.reset(); rs.textContent = '已清空'; MapView.useSet('w1'); MapView.update(); } });
  },
};

/* ---------------------------------------------------------------- finale (every friend of the sea, fireworks, a group photo) */
const Finale = {
  sc: null,
  play(w) {
    this.stop();
    const sc = this.sc = new Scope(APP);
    const F = $('#finale');
    $('.fbg', F).style.backgroundImage = 'url(assets/bg/' + WORLDS_INFO[w].finale + '.jpg)';
    const crowd = $('.crowd', F); crowd.innerHTML = '';
    Screens.show('finale');
    const home = el('button', 'btn', F); home.id = 'fhome';
    Object.assign(home.style, { left: 'calc(14px + var(--sl))', top: 'calc(14px + var(--st))', width: '96px', height: '96px', background: '#FFE08A', zIndex: 5 });
    img('assets/props/ui_home.png', '', home).style.width = '74%';
    tapify(home, () => { this.stop(); Screens.show('map'); MapView.update(); MapView.after(T(500)); });
    sc.add(() => home.remove());
    const vw = window.innerWidth, vh = window.innerHeight;
    const all = Array.from(new Set(ORDER[w].flatMap(id => ISL[id].crew)));
    const rows = [all.slice(0, 9), all.slice(9, 18), all.slice(18)].filter(r => r.length);
    const base = Math.min(vw, vh);
    rows.forEach((row, r) => {
      const h = base * [0.22, 0.26, 0.3][r];
      row.forEach((id, i) => {
        const im = img('assets/chars/' + id + '.png', '', crowd);
        const x = 6 + 88 * (i + 0.5) / row.length, yp = [62, 76, 90][r];
        Object.assign(im.style, { position: 'absolute', height: h + 'px', left: x + '%', top: 'calc(' + yp + '% - ' + h + 'px)', transform: 'translateX(-50%)', filter: 'drop-shadow(0 6px 0 rgba(0,0,0,.25))' });
        sc.anim(im, [{ transform: 'translateX(-50%) translateY(' + vh + 'px)' }, { transform: 'translateX(-50%) translateY(0)' }], { duration: 700, delay: 60 * (i + r * 4), easing: EASE.pop });
        sc.timeout(() => sc.anim(im, [{ transform: 'translateX(-50%) translateY(0)' }, { transform: 'translateX(-50%) translateY(-14px)' }, { transform: 'translateX(-50%) translateY(0)' }], { duration: 520 + (i % 3) * 90, iterations: Infinity, delay: (i * 97) % 400 }), 1600);
      });
    });
    Voice.say(w === 'w2' ? '星光大派对！' : '大家一起庆祝！', { tag: 'finale' });
    Sfx.fanfare();
    this.fireworks(sc);
    sc.timeout(() => { Voice.say('一起拍照，茄子！', { tag: 'finale' }); }, 3500);
    sc.timeout(() => { const fl = $('.flash', F); fl.animate([{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 0 }], { duration: 700 }); Sfx.nz(0, 0.12, 4000, 2000, 1, 0.2); crowd.animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-2deg) scale(.92)' }], { duration: 600, fill: 'forwards', easing: EASE.pop }); crowd.style.outline = '16px solid #fff'; crowd.style.boxShadow = '0 0 0 20px #2B2118'; }, 5200);
  },
  fireworks(sc) {
    const cv = $('canvas', $('#finale')), cx = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr; cx.scale(dpr, dpr);
    let parts = [];
    const cols = ['#FFC93C', '#FF6B5B', '#4FB3FF', '#5CC46E', '#8E6CFF', '#FF9F43', '#FF7FA8'];
    const boom = () => { const x = window.innerWidth * (0.15 + Math.random() * 0.7), y = window.innerHeight * (0.1 + Math.random() * 0.3), c = cols[Math.floor(Math.random() * cols.length)]; for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, v = 2 + Math.random() * 2.5; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 60 + Math.random() * 20, c }); } Sfx.nz(0, 0.3, 900, 200, 0.8, 0.12, 'lowpass'); };
    let alive = true;
    sc.add(() => { alive = false; cx.clearRect(0, 0, cv.width, cv.height); });
    const tick = () => {
      if (!alive) return;
      cx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      parts = parts.filter(p => p.l > 0);
      parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.l--; cx.globalAlpha = Math.max(0, p.l / 80); cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, 3.2, 0, 7); cx.fill(); });
      cx.globalAlpha = 1;
      requestAnimationFrame(tick);
    };
    tick();
    sc.interval(boom, 700);
    boom();
  },
  stop() { if (this.sc) { this.sc.dispose(); this.sc = null; } },
};

/* ---------------------------------------------------------------- entry + boot + test hooks */
const Entry = {
  init() {
    const row = $('.chars', $('#entry'));
    const pick = ['peppa', 'bluey', 'ultraman', 'optimus', 'bumblebee', 'wukong'], xs = [7, 19, 31, 69, 81, 93];
    pick.forEach((id, i) => {
      const im = img('assets/chars/' + id + '.png', '', row);
      im.style.left = xs[i] + '%'; im.style.transform = 'translateX(-50%)';
      im.animate([{ transform: 'translateX(-50%) translateY(0)' }, { transform: 'translateX(-50%) translateY(-10px)' }, { transform: 'translateX(-50%) translateY(0)' }], { duration: 1800 + i * 160, iterations: Infinity, easing: 'ease-in-out' });
    });
    const w = $('.word', $('#entry'));
    const s = svg('svg', { viewBox: '0 0 360 110' }, w);
    const t = svg('text', { x: 180, y: 84, 'text-anchor': 'middle', 'font-size': 84, 'font-weight': 900, fill: '#fff', stroke: '#2B2118', 'stroke-width': 14, 'paint-order': 'stroke fill', 'stroke-linejoin': 'round', 'letter-spacing': 10 }, s);
    t.textContent = '字字岛';
    const play = $('#play');
    play.addEventListener('pointerdown', () => play.classList.add('press'));
    play.addEventListener('pointerup', () => play.classList.remove('press'));
    play.addEventListener('pointercancel', () => play.classList.remove('press'));
    play.addEventListener('click', () => {
      try { Voice.unlock(FIRST_LINE); } catch (e) {}
      Sfx.touch(); Sfx.startMedia(); Bank.init(); Hanzi.load().catch(() => {});
      Sfx.tap();
      $('#home img').src = 'assets/props/ui_home.png';
      $('#bookbtn img').src = 'assets/props/book_icon.png';
      $('.bk img', $('#book')).src = 'assets/props/ui_home.png';
      MapView.build();
      Screens.show('map');
      MapView.enter();
      Boot.later();
    });
    tapify($('#nosound'), () => gesture('sound'));
    tapify($('#bookbtn'), () => Book.open());
    tapify($('.bk', $('#book')), () => Book.close());
  },
};
const Boot = {
  done: false,
  later() {
    if (this.done) return;
    this.done = true;
    ['assets/bg/map_w1.jpg'].concat(ORDER.w1.map(id => 'assets/isl/' + id + '.png')).forEach(u => { const i = new Image(); i.decoding = 'async'; i.src = u; });
    if ('serviceWorker' in navigator && location.protocol !== 'file:' && !/[?&]nosw=1/.test(location.search)) {
      setTimeout(() => { navigator.serviceWorker.register('sw.js').then(reg => SWU.watch(reg)).catch(() => {}); }, 2500);
    }
  },
};
function boot() {
  Store.load();
  Bank.load(FIRST_LINE);
  Prog.check(false);
  if (Store.s.flags.some(w => !flagged(w))) { Store.s.flags = Store.s.flags.filter(flagged); Store.save(); }
  Fx.init();
  Stage.init();
  Input.init();
  Voice.init();
  Entry.init();
  Parent.initGear();
  tapify($('#home'), () => gesture('home'));
  tapify($('#avatar'), () => gesture('relisten'));
  document.body.dataset.scr = 'entry';
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.getRegistration().then(reg => { if (reg) SWU.watch(reg); }).catch(() => {});
  document.addEventListener('visibilitychange', () => { if (document.hidden) { SWU.maybe(); SWU.reloadIfSafe(); } });
  window.__swApply = () => SWU.apply();
  window.addEventListener('load', () => setTimeout(() => Boot.later(), 1500));
  Object.defineProperty(window, '__q', {
    configurable: true,
    get() {
      const st = Session.st; if (!st) return null;
      const g = st.game, snap = g.snap ? g.snap(st) : {};
      return Object.assign({ id: st.id, gen: st.gen, world: st.G.world, game: st.G.id, kind: st.kind, level: st.level, phase: st.phase, hinted: st.hinted, retest: st.retest, err: st.err, ops: st.ops, childOps: st.childOps, submitted: st.submitted, answer: st.q.answer, assists: st.assistT || [], clock: Math.round(Clock.t()), q: JSON.parse(JSON.stringify(st.q, (k, v) => (typeof v === 'function' || (v && v.nodeType)) ? undefined : v)) }, snap);
    },
  });
  window.__state = () => JSON.parse(JSON.stringify(Store.s));
  window.__go = (isl, game, level, opt) => { opt = opt || {}; if (level) opt.level = level; Store.w(isl).unlocked = true; Session.start(isl, game, opt); return true; };
  window.__res = () => {
    let timers = 0, anims = 0, waits = 0, scopes = 0;
    const walk = s => { scopes++; timers += s.timers.size; anims += s.anims.size; waits += s.waits.size; s.children.forEach(walk); };
    walk(APP);
    return { dom: document.getElementsByTagName('*').length, docAnims: document.getAnimations().length, timers, anims, waits, scopes, fx: $('#fx').childElementCount, audio: Sfx.live, voiceQ: Voice.q.length, waiters: Voice.waiters.length };
  };
  window.__ready = true;
}
