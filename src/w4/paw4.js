/* ================================================================ 神笔海 ⑥ 汪汪队 · 十字路口 (paw4): 左 右 中 前 后 (docs/W4-DESIGN.md §6 ⑥)
   认字 「走！」踩着字走过去 (path-of-the-character) · 写字 左 右 (W4X.Write; GF 0023-2020: 横 first, then 撇) · 英文 「判！」对不对
   (true-or-false) · 挑战 「开！」看路牌开车 (read-and-steer). Built on the template of src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  /* lines said through variables (tools/voice_lines.py records them) */
  W4X.lines(['踩着左走！', '踩着右走！', '踩着中走！', '踩着前走！', '踩着后走！', '点阿奇旁边的砖！',
    '这是左边', '这是右边', '这是前面', '这是后面', '左在这边', '右在这边', '前在这边', '后在这边', '这句不对', '这句是对的', '把警车滑出去！']);
  const GOLD = '#FFB400';
  const glow = (st, e, ms) => { if (e) st.scope.anim(e, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 10px #FFB400) drop-shadow(0 0 18px #FFE14A)' }, { filter: 'none' }], { duration: ms || 800, fill: 'none' }); };

  /* ---------------------------------------------------------------- ⑥-1 认字 「走！」 踩着字走过去
     A board of paving tiles (levels 1-3 4 x 4, levels 4-5 5 x 5), a character on each. Chase waits on his badge left of the board,
     the lookout tower stands in a cell of the right-hand column. The tiles of X make a path from the tile beside Chase to the
     tile beside the tower: tap the tile next to Chase - he hops onto it - then the next ... (or slide a finger along them). Only
     a tile next to Chase can be stepped on (another one: nothing, "点阿奇旁边的砖！"). A tile that is not X ends the try; the last
     X tile beside the tower wins. The path never goes left and never touches itself, so it is the only way. Levels: 1 the
     picture on the task card, a straight path of 3; 2 heard only, 4 tiles with one bend; 3 5 tiles, two bends, look-alikes and an
     old character among the others; 4 5 x 5, 6 tiles, an X dead end beside the path (stepping on it is no mistake: step back);
     5 7 tiles, three bends or more, two dead ends, the others mostly look-alikes. A random walk reaches the tower about 1 time in
     9 at level 1, 1 in 30 at level 2, less than 1 in 100 from level 3. */
  const STEPS = [0, 3, 4, 5, 6, 7], SIDE = lv => (lv <= 3 ? 4 : 5);
  const LOOKP = { 左: '右在有石', 右: '左石有在', 中: '虫口巾电', 前: '首', 后: '石右口' };
  const PATHS = {};
  const same = (a, b) => a[0] === b[0] && a[1] === b[1], touch = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
  /* every path of N tiles: from the left column, moves right / up / down (never left), never touching itself, ending beside a
     tower cell of the right column that touches no other tile of it; its bends fit the level */
  function pathsOf(n, N, lv) {
    const key = n + ':' + N + ':' + lv; if (PATHS[key]) return PATHS[key];
    const want = [null, b => b === 0, b => b === 1, b => b === 2, b => b >= 2 && b <= 3, b => b >= 3][lv], out = [], MOVES = [[0, 1], [-1, 0], [1, 0]];
    const walk = (cells, dirs) => {
      if (cells.length === N) {
        const bends = dirs.slice(1).filter((d, i) => d !== dirs[i]).length, e = cells[N - 1];
        if (!want(bends)) return;
        [[e[0], e[1] + 1], [e[0] - 1, e[1]], [e[0] + 1, e[1]]].forEach(t => {
          if (t[1] !== n - 1 || t[0] < 0 || t[0] >= n || cells.some(c => same(c, t)) || cells.slice(0, -1).some(c => touch(c, t))) return;
          out.push({ cells: cells.map(c => c.slice()), tower: t, bends });
        });
        return;
      }
      const last = cells[cells.length - 1];
      MOVES.forEach((m, di) => {
        const c = [last[0] + m[0], last[1] + m[1]];
        if (c[0] < 0 || c[0] >= n || c[1] >= n || cells.some(x => same(x, c)) || cells.slice(0, -1).some(x => touch(x, c))) return;
        cells.push(c); dirs.push(di); walk(cells, dirs); cells.pop(); dirs.pop();
      });
    };
    for (let r = 0; r < n; r++) walk([[r, 0]], []);
    return (PATHS[key] = out);
  }
  /* X tiles beside the path that lead nowhere (levels 4-5): touching one tile of it (not the first, not the last), not the tower,
     not each other */
  function deadEnds(G, n, P, k) {
    const cand = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const d = [r, c]; if (P.cells.some(x => same(x, d)) || same(d, P.tower) || touch(d, P.tower)) continue;
      const at = P.cells.map((x, i) => (touch(x, d) ? i : -1)).filter(i => i >= 0);
      if (at.length === 1 && at[0] > 0 && at[0] < P.cells.length - 1) cand.push(d);
    }
    const out = [];
    G.rng.shuffle(cand).forEach(d => { if (out.length < k && !out.some(x => touch(x, d))) out.push(d); });
    return out;
  }
  const PAD_SVG = '<svg viewBox="0 0 100 40" width="100%" height="100%"><ellipse cx="50" cy="22" rx="46" ry="15" fill="#2E6FD8" stroke="#2B2118" stroke-width="4"/><ellipse cx="50" cy="18" rx="34" ry="9" fill="#FFD23C" stroke="#2B2118" stroke-width="3"/></svg>';
  const TOWER_SVG = '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 4V22" stroke="#2B2118" stroke-width="4" stroke-linecap="round"/><path class="flag" d="M52 5L76 11L52 18Z" fill="#E8554A" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M30 30L50 20L70 30Z" fill="#E8554A" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><rect x="28" y="30" width="44" height="22" rx="6" fill="#7BC8F6" stroke="#2B2118" stroke-width="4"/><path d="M40 52L36 92H64L60 52Z" fill="#F5F0E6" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<rect x="45" y="70" width="10" height="22" rx="3" fill="#2E6FD8" stroke="#2B2118" stroke-width="3"/><circle cx="50" cy="61" r="5" fill="#FFD23C" stroke="#2B2118" stroke-width="2.5"/><path d="M26 94H74" stroke="#2B2118" stroke-width="5" stroke-linecap="round"/></svg>';
  const Path = {
    rule: 'path-of-the-character', verb: '走！', intro: '踩着字走过去！', props: [],
    gen(G, o) {
      const lv = o.level, n = SIDE(lv), N = STEPS[lv], pool = poolOf(G, 'zh', false), answer = W4X.pick(G, pool);
      const all = pathsOf(n, N, lv), P = G.rng.pick(all), dead = lv >= 4 ? deadEnds(G, n, P, lv >= 5 ? 2 : 1) : [];
      const kn = W4X.known(G), holds = HOLDS[answer] || '', opts = W4X.opts(G, lv, answer, 5).filter(k => k !== answer);
      const lookAll = Array.from(LOOKP[answer] || '').concat(Array.from(LOOK[answer] || '')).filter((k, i, a) => a.indexOf(k) === i && k !== answer && ITEM[k] && kn.includes(k) && !holds.includes(k));
      const look = lv >= 5 ? lookAll : [];
      const idx = (r, c) => r * n + c, grid = Array(n * n).fill(null);
      P.cells.concat(dead).forEach(([r, c]) => { grid[idx(r, c)] = answer; });
      grid[idx(P.tower[0], P.tower[1])] = '';
      const others = look.concat(opts.filter(k => !look.includes(k)));
      const onPath = i => P.cells.some(([r, c]) => touch([r, c], [Math.floor(i / n), i % n]));
      const nb = i => { const r = Math.floor(i / n), c = i % n; return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < n && b < n).map(([a, b]) => grid[idx(a, b)]); };
      const used = {};
      G.rng.shuffle(grid.map((_, i) => i)).forEach(i => {
        if (grid[i] !== null) return;
        const pref = (lv >= 5 && onPath(i) && look.length ? look : others).slice(), around = nb(i);
        pref.sort((a, b) => (used[a] || 0) - (used[b] || 0));
        const k = pref.find(x => !around.includes(x)) || pref[0];
        grid[i] = k; used[k] = (used[k] || 0) + 1;
      });
      const board = grid.filter(k => k && k !== answer), dist = Array.from(new Set(board));
      /* a built answer (q.build): the chance that random steps reach the tower - each step one of the tiles beside Chase */
      const X = i => grid[i] === answer, end = idx(P.cells[N - 1][0], P.cells[N - 1][1]), pr = grid.map(() => 0);
      const nbs = i => { const r = Math.floor(i / n), c = i % n; return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < n && b < n && grid[idx(a, b)] !== '').map(([a, b]) => idx(a, b)); };
      for (let it = 0; it < 80; it++) grid.forEach((k, i) => { if (!X(i)) return; if (i === end) { pr[i] = 1; return; } const m = nbs(i); pr[i] = m.reduce((s, j) => s + (X(j) ? pr[j] : 0), 0) / m.length; });
      return { k: [answer, P.cells.map(c => c.join('')).join('.'), grid.join('')], answer, item: answer, n, N, grid, bends: P.bends, build: 1, chance: +pr[idx(P.cells[0][0], P.cells[0][1])].toFixed(4),
        path: P.cells.map(([r, c]) => idx(r, c)), tower: idx(P.tower[0], P.tower[1]), dead: dead.map(([r, c]) => idx(r, c)), pic: lv <= 1 ? 1 : 0,
        look: dist.filter(k => lookAll.includes(k)).length, rev: dist.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: the picture gone, a longer path, more bends, look-alikes and old characters, dead ends, a bigger board */
    hard(q) { return (1 - q.pic) + q.N * 0.6 + q.bends * 0.4 + q.look * 0.5 + q.rev * 0.4 + q.dead.length + (q.n - 4); },
    geo(st) {
      const n = st.q.n, T = n === 4 ? 108 : 96, g = n === 4 ? 10 : 8, S = n * T + (n - 1) * g, Lx = L(), cx = Lx ? 572 : 392, cy = Lx ? 404 : 548;
      return { n, T, g, x0: Math.round(cx - S / 2), y0: Math.round(cy - S / 2) };
    },
    cell(st, i) { const G4 = this.geo(st), r = Math.floor(i / G4.n), c = i % G4.n; return { x: G4.x0 + c * (G4.T + G4.g), y: G4.y0 + r * (G4.T + G4.g), w: G4.T, h: G4.T }; },
    /* where Chase stands: his badge left of the first tile (-1), a tile, or the tower */
    spot(st, at) { if (at >= 0) return this.cell(st, at); const b = this.cell(st, st.q.path[0]), G4 = this.geo(st); return { x: b.x - G4.T - G4.g - 4, y: b.y, w: G4.T, h: G4.T }; },
    async present(st) {
      const q = st.q;
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      st.at = -1;
      const T = q.n === 4 ? 108 : 96;
      st.tiles = q.grid.map((k, i) => {
        if (i === q.tower) return null;
        const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; Object.assign(d.style, { background: '#FFF6E2', borderColor: '#E9D6AE' });
        d.appendChild(Glyph.zh(k, Math.round(T * 0.74))); st.els.push(d);
        return d;
      });
      st.tileEls = st.tiles.filter(Boolean);
      const slide = st.tiles.map((d, i) => (d ? { id: 'tile' + i, rect: () => box(d) } : null)).filter(Boolean);
      st.tiles.forEach((d, i) => { if (d) { K.reg(st, 'tile' + i, d, { slide }); K.pop(st, d, 25 * i); } });
      st.pad = ZX.thing(st, T, 40, 4, 'item'); st.pad.innerHTML = PAD_SVG; st.pad.style.pointerEvents = 'none';
      st.towerEl = ZX.thing(st, T, T, 6, 'item'); st.towerEl.innerHTML = TOWER_SVG; st.towerEl.style.pointerEvents = 'none';
      const a = st.G.actors.chase; if (a) { a.root.style.pointerEvents = 'none'; a.root.style.zIndex = 45; a.face(1); }
      this.place(st);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
      K.say(st, '踩着' + q.answer + '走！');
    },
    place(st) {
      if (!st.tiles) return;
      st.tiles.forEach((d, i) => { if (d) { const b = this.cell(st, i); place(d, b.x, b.y, b.w, b.h); } });
      const t = this.cell(st, st.q.tower); place(st.towerEl, t.x, t.y, t.w, t.h);
      const p = this.spot(st, -1); place(st.pad, p.x, p.y + p.h - 34, p.w, 40);
      this.chaseTo(st, st.won ? st.q.tower : st.at, false);
    },
    /* Chase onto a spot: at once, or with a hop from where he was */
    chaseTo(st, at, hop) {
      const a = st.G.actors.chase; if (!a) return;
      const b = this.spot(st, at), h = Math.round(b.h * 1.02), ox = a.x, oy = a.y;
      if (Math.abs(a.h - h) > 1) a.size(h);
      a.at(b.x + b.w / 2, b.y + b.h - 2);
      a.root.getAnimations().forEach(x => x.cancel());
      if (hop && (ox || oy)) { const dx = ox - a.x, dy = oy - a.y; if (dx) a.face(dx > 0 ? -1 : 1); st.scope.anim(a.root, [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(' + dx / 2 + 'px,' + (dy / 2 - 26) + 'px)' }, { transform: 'translate(0,0)' }], { duration: 220, easing: EASE.glide, fill: 'none' }); }
    },
    decor(G) { const Lx = L(); this.chars.forEach(id => hideActor(G.actors[id])); const r = G.actors.ryder; if (r) showActor(r, Lx ? 940 : 590, Lx ? 698 : 1012, Lx ? 170 : 150); const a = G.actors.chase; if (a) showActor(a, -300, -300, 100); },
    near(st, i) {
      if (st.at < 0) return i === st.q.path[0];
      const n = st.q.n; return touch([Math.floor(i / n), i % n], [Math.floor(st.at / n), st.at % n]);
    },
    sameStep(st, exp, name, p) { return !!(p && exp.p && (p.at || p.id) === exp.p.id); },
    /* a finger sliding over the board (the tiles' slide): a tile counts only once the finger is well inside it - never a corner
       cut. Input says "pass" as the finger comes near a tile; until it is inside, the tile waits (checked every 30 ms) */
    inCore(st, id) {
      const c = Input.cur, pt = c && c.path && c.path[c.path.length - 1], e = st.map && st.map[id];
      if (!pt || !e) return true;
      const b = box(e), m = b.w * 0.14; return pt.x >= b.x + m && pt.x <= b.x + b.w - m && pt.y >= b.y + m && pt.y <= b.y + b.h - m;
    },
    pend(st, id) {
      st.pendId = id;
      if (st.pendT) return;
      st.pendT = st.scope.interval(() => {
        const c = Input.cur, stop = () => { st.scope.clear(st.pendT); st.pendT = 0; st.pendId = null; };
        if (!c || st.submitted || !st.pendId || c.passed[c.passed.length - 1] !== st.pendId) { stop(); return; }
        if (this.inCore(st, st.pendId)) { const k = st.pendId; stop(); this.stepTo(st, k, false); }
      }, 30);
    },
    onGesture(st, name, p) {
      if (st.submitted) return false;
      if (name === 'tap') return this.stepTo(st, p.id, true);
      if (name !== 'pass') return false;
      if (!this.inCore(st, p.at)) { this.pend(st, p.at); return 'free'; }
      st.pendId = null;
      return this.stepTo(st, p.at, false);
    },
    /* one step onto a tile: only one beside Chase; not X ends the try; the last X tile beside the tower wins */
    stepTo(st, id, tap) {
      const m = /^tile(\d+)$/.exec(id || ''); if (!m || st.submitted) return false;
      const i = Number(m[1]), q = st.q;
      if (i === st.at) return 'free';
      if (!this.near(st, i)) {
        if (tap) { K.wiggle(st, st.tiles[i]); if (!st.toldHow || Clock.t() - st.toldHow > 4000) { st.toldHow = Clock.t(); Voice.sayNow('点阿奇旁边的砖！', { tag: 'how' }); } }
        return 'free';
      }
      st.at = i; Sfx.hop(); this.chaseTo(st, i, true);
      if (q.grid[i] !== q.answer) { st.tapped = i; Session.submit(st, q.grid[i]); return 'ok'; }
      if (i === q.path[q.path.length - 1]) { st.won = true; Session.submit(st, q.answer); }
      return 'ok';
    },
    async reveal(st) {
      const q = st.q, t = this.cell(st, q.tower);
      await st.scope.wait(180);
      this.chaseTo(st, q.tower, true); Sfx.reveal();
      const fl = st.towerEl.querySelector('.flag'); if (fl) st.scope.anim(fl, [{ transform: 'skewY(0)' }, { transform: 'skewY(-14deg)' }, { transform: 'skewY(10deg)' }, { transform: 'skewY(0)' }], { duration: 700, fill: 'none' });
      Fx.burst(t.x + t.w / 2, t.y + t.h / 2, { n: 16, dist: 100 });
      const r = st.G.actors.ryder; if (r) r.cheer();
      const G4 = this.geo(st), S = G4.n * G4.T + (G4.n - 1) * G4.g;          /* beside the board, never under a tile */
      await ZX.alive(st, q.answer, L() ? Math.min(Stage.W - 80, G4.x0 + S + 90) : 352, L() ? clamp(t.y + t.h / 2, 160, Stage.H - 160) : Math.min(Stage.H - 90, G4.y0 + S + 95), 150);
      sayItem(q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    async feedback(st, ans) { const e = st.tiles[st.tapped]; if (e) K.wiggle(st, e); Voice.say(W4X.thisIs(ans), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain: 1 the tile he stepped on, blue, its own picture ("这是右" was just said); 2 the whole path of X lights gold and Chase
       walks it from his badge to the tower (a beat); 3 the first X tile in gold with its picture, "这个是左" */
    async explain(st, ans) {
      const q = st.q, eC = st.tiles[st.tapped];
      W4X.exChosen(st, eC, ans);
      await EX.wait(st, 650);
      await W4X.exBeat(st, async () => {
        q.path.forEach(i => { const d = st.tiles[i]; if (d) { d.style.background = '#FFF1B8'; d.style.borderColor = GOLD; } });
        st.at = -1; this.chaseTo(st, -1, true);
        for (const i of q.path) { await EX.tick(st, 170); if (st.scope.dead) return; this.chaseTo(st, i, true); }
        await EX.tick(st, 170); if (!st.scope.dead) this.chaseTo(st, q.tower, true);
      }, 300);
      await W4X.exRight(st, st.tiles[q.path[0]], q.answer, [W4X.thatIs(q.answer)]);
    },
    /* the 2nd hint (real help): the tile Chase should step on next flashes; a re-teach: the tiles beside him hop */
    gestureHint(st, reteach) {
      if (!st.tiles) return;
      const nx = this.next(st, 'right'), i = nx && Number(/\d+/.exec(nx.p.id)[0]);
      if (reteach) { st.tiles.forEach((d, j) => { if (d && this.near(st, j)) K.hop(st, d, 16); }); return; }
      if (i != null && st.tiles[i]) { K.flash(st, [st.tiles[i]]); glow(st, st.tiles[i], 1200); }
    },
    next(st, strat) {
      if (!st.tiles || st.submitted) return null;
      const q = st.q, pi = q.path.indexOf(st.at);
      let i;
      if (strat === 'wrong') {
        if (st.at < 0) i = q.path[0];
        else { const n = q.n; i = q.grid.findIndex((k, j) => j !== q.tower && k !== q.answer && touch([Math.floor(j / n), j % n], [Math.floor(st.at / n), st.at % n])); }
      } else if (st.at >= 0 && pi < 0) {          /* on a dead end: back to the path */
        const n = q.n; i = q.path.find(j => touch([Math.floor(j / n), j % n], [Math.floor(st.at / n), st.at % n]));
      } else i = q.path[pi + 1];
      return i == null || i < 0 ? null : { g: 'tap', p: { id: 'tile' + i } };
    },
    workEls(st) { return (st.tiles || []).filter((d, i) => d && this.near(st, i)); },
    cleanup(st) { const a = st.G.actors.chase; if (a) { a.root.style.pointerEvents = ''; a.root.style.zIndex = ''; } },
    snap(st) { return { at: st.at, n: st.q.n, N: st.q.N, path: st.q.path }; },
    iconNode() { return W4X.svgIcon('<rect x="4" y="34" width="16" height="16" rx="4" fill="#FFF1B8" stroke="#2B2118" stroke-width="2.5"/><rect x="22" y="34" width="16" height="16" rx="4" fill="#FFF1B8" stroke="#2B2118" stroke-width="2.5"/><rect x="22" y="16" width="16" height="16" rx="4" fill="#FFF1B8" stroke="#2B2118" stroke-width="2.5"/><path d="M48 4V24" stroke="#2B2118" stroke-width="2.5"/><path d="M49 5L58 8L49 12Z" fill="#E8554A"/><rect x="40" y="16" width="16" height="16" rx="4" fill="#7BC8F6" stroke="#2B2118" stroke-width="2.5"/>'); },
  };

  /* ---------------------------------------------------------------- English sentences as glyphs (the app's own letters) */
  const PUNCT = { '.': '<circle cx="14" cy="72" r="9"/>', '!': '<rect x="7" y="4" width="14" height="50" rx="7"/><circle cx="14" cy="72" r="9"/>',
    '?': '<path d="M4 22C4 8 34 2 38 20C41 34 22 36 21 52" fill="none" stroke="#2B2118" stroke-width="10" stroke-linecap="round"/><circle cx="21" cy="72" r="8"/>', ',': '<path d="M14 64C24 66 22 84 10 92" fill="none" stroke="#2B2118" stroke-width="9" stroke-linecap="round"/>' };
  const punct = (c, h) => { const w = c === '?' ? 46 : 30, s = svg('svg', { viewBox: '0 -8 ' + w + ' 136', width: Math.round(h * w / 136), height: h, class: 'gly' }); s.innerHTML = '<g fill="#2B2118">' + PUNCT[c] + '</g>'; return s; };
  /* a row of words at letter height h; .w is its width */
  function enRow(text, h) {
    const row = el('div', ''); Object.assign(row.style, { display: 'flex', alignItems: 'flex-end', gap: Math.round(h * 0.3) + 'px', pointerEvents: 'none' });
    let w = 0;
    text.split(' ').forEach((tok, j) => {
      const m = /^([A-Za-z]+)([.,!?]?)$/.exec(tok) || [tok, tok, ''], wd = el('div', '', row); wd.style.display = 'flex'; wd.style.alignItems = 'flex-end';
      const g = Glyph.word(m[1], h); wd.appendChild(g); w += Number(g.getAttribute('width')) + (j ? Math.round(h * 0.3) : 0);
      if (m[2]) { const p = punct(m[2], h); wd.appendChild(p); w += Number(p.getAttribute('width')); }
    });
    row.w = w;
    return row;
  }
  /* a sentence card, its letters as big as fit in maxW (never taller than hMax) */
  function enCard(st, text, hMax, maxW) {
    const probe = enRow(text, 100), h = Math.max(30, Math.min(hMax, Math.floor(100 * (maxW - 36) / probe.w))), row = enRow(text, h);
    const d = ZX.thing(st, 10, 10, 7, 'item');
    Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.96)', borderRadius: '22px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25)' });
    d.appendChild(row); d._w = row.w + 36; d._h = Math.max(96, Math.round(h * 1.05) + 28);
    return d;
  }

  /* ---------------------------------------------------------------- ⑥-3 英文 「判！」 对不对
     One picture on the lookout's big screen and two English sentences under it (tools/content.py TF4: only words the child has
     met). Each sentence has two buttons: a nodding puppy (it is so) and a shaking puppy (it is not) - no cross, no red. Both
     sentences judged right = right (two asks: a random pair of taps is right 1 time in 4). The sentences are not said (a tap
     on one says it: that question earns no star). Which of "one so / one not", "both so", "both not" comes from a bag. Levels:
     1 a phrase (A big pig.); 2 The X is Y.; 3 how many (I see two cats.); 4 not (The cat is not big.); 5 where (on / in / under /
     by). Its 2nd hint is only the question again: the two sentences are underlined, word by word (softHint: the star stays). */
  const PUP = yes => '<svg viewBox="0 0 100 100" width="86%" height="86%"><g class="head">'
    + '<path d="M22 30C8 30 6 58 18 62C24 52 26 40 30 34Z" fill="#9A6433" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M78 30C92 30 94 58 82 62C76 52 74 40 70 34Z" fill="#9A6433" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<ellipse cx="50" cy="52" rx="30" ry="28" fill="#E8B676" stroke="#2B2118" stroke-width="4"/><ellipse cx="50" cy="64" rx="15" ry="11" fill="#FFF1D8"/>'
    + '<circle cx="39" cy="46" r="5" fill="#2B2118"/><circle cx="61" cy="46" r="5" fill="#2B2118"/><circle cx="40.5" cy="44.5" r="1.6" fill="#fff"/><circle cx="62.5" cy="44.5" r="1.6" fill="#fff"/><ellipse cx="50" cy="58" rx="6" ry="4.5" fill="#2B2118"/>'
    + (yes ? '<path d="M41 66C46 72 54 72 59 66" fill="none" stroke="#2B2118" stroke-width="3.5" stroke-linecap="round"/>' : '<path d="M43 69H57" stroke="#2B2118" stroke-width="3.5" stroke-linecap="round"/>') + '</g>'
    + (yes ? '<path d="M50 6V16M50 86V96" stroke="#3E9E4E" stroke-width="5" stroke-linecap="round"/><path d="M44 12L50 5L56 12M44 90L50 97L56 90" fill="none" stroke="#3E9E4E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M4 44C1 50 1 56 4 62M96 44C99 50 99 56 96 62" fill="none" stroke="#5470B8" stroke-width="5" stroke-linecap="round"/><path d="M11 40C8 48 8 58 11 66M89 40C92 48 92 58 89 66" fill="none" stroke="#5470B8" stroke-width="4" stroke-linecap="round"/>') + '</svg>';
  const kindOf = s => (/\b(on|in|under|by)\b/.test(s) ? 5 : /\bnot\b/.test(s) ? 4 : /\b(one|two|three)\b|[a-z]s[.!?]$/.test(s.replace(/\bis\b|\bthis\b/g, '')) ? 3 : /\bis\b/.test(s) ? 2 : 1);
  const TrueFalse = {
    rule: 'true-or-false', kind0: 'en', verb: '判！', intro: '读一读，对不对？', softHint: true, props: [],
    gen(G, o) {
      const lv = o.level, tf = W4D.tf, list = tf.map((e, i) => i).filter(i => tf[i].lv === lv), pick = bagFrom(G, 'tf' + lv, list.length ? list : tf.map((e, i) => i));
      const e = tf[pick], yes = G.rng.shuffle(e.s.filter(s => s[1])), no = G.rng.shuffle(e.s.filter(s => !s[1])), how = bagFrom(G, 'tfk', ['mix', 'yy', 'nn']);
      const two = how === 'yy' ? yes.slice(0, 2) : how === 'nn' ? no.slice(0, 2) : G.rng.shuffle([yes[0], no[0]]);
      const words = two.map(s => s[0].split(' ').length);
      return { k: [pick, two[0][0], two[1][0]], answer: 'all', seq: two.map(s => (s[1] ? 'y' : 'n')), sents: two.map(s => s[0]), pic: e.pic, how,
        type: Math.max(...two.map(s => kindOf(s[0]))), words: (words[0] + words[1]) / 2 };
    },
    itemOf() { return null; },
    hard(q) { return q.type + q.words * 0.1; },
    async present(st) {
      const q = st.q;
      st.done = [false, false];
      const pc = st.picEl = ZX.thing(st, 250, 250, 6, 'card'); pc.style.pointerEvents = 'none'; pc.appendChild(Scene.node(q.pic, 220)); Object.assign(pc.lastChild.style, { position: 'relative' });
      st.rows = q.sents.map((s, i) => {
        const card = enCard(st, s, 62, L() ? 620 : 640);
        K.reg(st, i ? 'read1' : 'read', card, {});
        const yes = ZX.thing(st, 104, 104, 7, 'card'), no = ZX.thing(st, 104, 104, 7, 'card');
        yes.innerHTML = PUP(true); no.innerHTML = PUP(false);
        const ck = el('div', '', yes); ck.innerHTML = ICONS.check; Object.assign(ck.style, { position: 'absolute', right: '-10px', top: '-10px', width: '38px', height: '38px', borderRadius: '50%', background: '#5CC46E', boxShadow: '0 0 0 3px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }); ck.firstChild.setAttribute('width', '26'); ck.firstChild.setAttribute('height', '26');
        Object.assign(yes.style, { background: '#E2F6E4', borderColor: '#8FD39A' }); Object.assign(no.style, { background: '#E6EBF8', borderColor: '#A9B8DE' });
        Loops.run(yes.firstChild, [{ transform: 'translateY(0)' }, { transform: 'translateY(5px)' }, { transform: 'translateY(0)' }], { duration: 900, easing: 'ease-in-out' });
        Loops.run(no.firstChild, [{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(0)' }], { duration: 1100, easing: 'ease-in-out' });
        K.reg(st, 'y' + i, yes, {}); K.reg(st, 'n' + i, no, {});
        K.pop(st, card, 120 + 160 * i); K.pop(st, yes, 220 + 160 * i); K.pop(st, no, 260 + 160 * i);
        return { card, yes, no, text: s };
      });
      st.readEl = st.rows[0].card; st.readText = q.sents[0];
      st.rights = st.rows.flatMap(r => [r.card, r.yes, r.no]);
      this.place(st);
      K.pop(st, pc);
      st.prompt = '读一读，对不对？';
    },
    /* the picture on the big screen of the lookout (the background), the two rows under it */
    place(st) {
      if (!st.rows) return;
      const Lx = L(), sc = Stage.bgPoint(0.5, 0.29), P = Lx ? 230 : 270;
      place(st.picEl, Math.round(Lx ? 512 - P / 2 : 352 - P / 2), Math.round(clamp(sc.y - P / 2, Lx ? 96 : 150, Lx ? 120 : 260)), P, P);
      const pb = box(st.picEl);
      st.rows.forEach((r, i) => {
        const w = r.card._w, h = r.card._h;
        if (Lx) {
          const total = w + 2 * 104 + 2 * 18, x = Math.round(512 - total / 2), y = Math.round(pb.y + pb.h + 22 + i * (h + 26));
          place(r.card, x, y, w, h); place(r.yes, x + w + 18, y + (h - 104) / 2, 104, 104); place(r.no, x + w + 18 + 104 + 18, y + (h - 104) / 2, 104, 104);
        } else {
          const y = Math.round(pb.y + pb.h + 26 + i * (h + 104 + 52));
          place(r.card, Math.round(352 - w / 2), y, w, h); place(r.yes, 352 - 104 - 20, y + h + 14, 104, 104); place(r.no, 352 + 20, y + h + 14, 104, 104);
        }
      });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 270 : 110, L() ? 330 : 418, L() ? 190 : 160); },
    peekRow(st, i) {
      const r = st.rows[i]; st.peeked = true; st.noStar = true;
      Voice.sayNow(r.text, { tag: 'peek' }); K.hop(st, r.card, 12);
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted || !st.rows) return false;
      if (p.id === 'read' || p.id === 'read1') { this.peekRow(st, p.id === 'read' ? 0 : 1); return 'ok'; }
      const m = /^([yn])([01])$/.exec(p.id || ''); if (!m) return false;
      const i = Number(m[2]), r = st.rows[i]; if (st.done[i]) return false;
      Sfx.tap(); st.tapped = i; st.said = m[1];
      if (m[1] !== st.q.seq[i]) { Session.submit(st, 'r' + i + ':' + m[1]); return 'ok'; }
      st.done[i] = true; const b = m[1] === 'y' ? r.yes : r.no, o = m[1] === 'y' ? r.no : r.yes;
      b.style.boxShadow = '0 0 0 5px #fff, 0 0 0 10px ' + GOLD; o.style.opacity = 0.35; K.hop(st, b, 16); Sfx.place();
      if (st.done.every(Boolean)) Session.submit(st, 'all');
      return 'ok';
    },
    async reveal(st) {
      Sfx.reveal(); K.hop(st, st.picEl, 26);
      st.rows.forEach((r, i) => st.scope.timeout(() => K.hop(st, st.q.seq[i] === 'y' ? r.yes : r.no, 20), 150 * i));
      const a = st.G.actors.chase; if (a) a.react();
      this.cheerAll(st);
      await st.scope.wait(700);
    },
    /* the factual line: the sentence he judged, said */
    async feedback(st) { const r = st.rows[st.tapped]; K.wiggle(st, st.said === 'y' ? r.yes : r.no); Voice.say(r.text, { tag: 'wrong' }); await st.scope.wait(600); },
    /* explain: 1 that sentence in blue (it was just said); 2 the picture lights up - look at it (a beat); 3 the right puppy in gold:
       "这句不对" / "这句是对的" */
    async explain(st) {
      const i = st.tapped, r = st.rows[i], yes = st.q.seq[i] === 'y';
      EX.ring(st, r.card, 'chosen');
      await EX.wait(st, 700);
      await W4X.exBeat(st, () => { st.scope.anim(st.picEl, [{ transform: 'scale(1)', filter: 'none' }, { transform: 'scale(1.08)', filter: 'drop-shadow(0 0 14px #FFE14A)' }, { transform: 'scale(1)', filter: 'none' }], { duration: 900, fill: 'none' }); }, 800);
      await W4X.exRight(st, yes ? r.yes : r.no, null, [yes ? '这句是对的' : '这句不对'], false);
    },
    /* the 2nd hint - the question again, nothing more: each sentence underlined, its words lit one after another, silently */
    gestureHint(st, reteach) {
      if (!st.rows) return;
      if (reteach) { st.rows.forEach((r, i) => st.scope.timeout(() => { K.hop(st, r.yes, 14); K.hop(st, r.no, 14); }, 200 * i)); return; }
      st.rows.forEach((r, i) => {
        if (st.done[i]) return;
        const words = Array.from(r.card.firstChild.children); r.card.style.boxShadow = '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25), inset 0 -8px 0 #FFE14A';
        words.forEach((w, j) => st.scope.timeout(() => st.scope.anim(w, [{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 300, fill: 'none' }), 1300 * i + 260 * j));
      });
    },
    next(st, strat) {
      if (!st.rows || st.submitted) return null;
      const i = st.done.indexOf(false); if (i < 0) return null;
      const right = st.q.seq[i], c = strat === 'wrong' ? (right === 'y' ? 'n' : 'y') : right;
      return { g: 'tap', p: { id: c + i } };
    },
    workEls(st) { return (st.rows || []).flatMap((r, i) => (st.done[i] ? [] : [r.yes, r.no])); },
    snap(st) { return { done: st.done || null, seq: st.q.seq }; },
    iconNode() { const d = el('div'); d.innerHTML = PUP(true); Object.assign(d.style, { width: '82%', height: '82%', display: 'flex', alignItems: 'center', justifyContent: 'center' }); return d; },
  };

  /* ---------------------------------------------------------------- ⑥-4 挑战 「开！」 看路牌开车
     The crossroads seen from above (the background): Chase's police car in the middle, a place at the end of each road (fire
     station, park, lookout, beach: pictures, no words), and a road sign with one character (左 右 前 后; not said - a tap says it
     and that question earns no star). Slide the car the way the sign says - or tap the end of that road. The car's own front is
     前: its left is the screen's left only while it faces up. Two signs, one after the other (two legs; level 5 three), every
     leg right = right. Levels: 1 the car faces up, only 左 右; 2 faces up, 左 右 前 后; 3 it faces down (left and right swap);
     4 it faces left or right; 5 three legs, and after each leg the car faces the way it drove. A random slide is right 1 time in
     16 (level 5: 1 in 64). Its 2nd hint draws a little arrow by the sign (real help: no star). */
  const DIRV = [[0, -1], [1, 0], [0, 1], [-1, 0]], REL = { 前: 0, 右: 1, 后: 2, 左: 3 }, SIDEW = ['前面', '右边', '后面', '左边'], SWIPE = ['up', 'right', 'down', 'left'];
  const PLACES = [
    /* fire station */ '<rect x="10" y="34" width="80" height="56" rx="4" fill="#E8554A" stroke="#2B2118" stroke-width="4"/><path d="M6 36L50 10L94 36Z" fill="#B73A30" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><rect x="26" y="52" width="48" height="38" rx="3" fill="#F5F0E6" stroke="#2B2118" stroke-width="3.5"/><path d="M26 62H74M26 72H74M26 82H74" stroke="#C9BFAE" stroke-width="3"/><circle cx="50" cy="28" r="7" fill="#FFD23C" stroke="#2B2118" stroke-width="3"/>',
    /* park */ '<ellipse cx="50" cy="86" rx="44" ry="10" fill="#7CC36B" stroke="#2B2118" stroke-width="3"/><rect x="45" y="50" width="10" height="36" rx="3" fill="#9A6433" stroke="#2B2118" stroke-width="3"/><circle cx="50" cy="36" r="26" fill="#3FAE4A" stroke="#2B2118" stroke-width="4"/><path d="M14 74H40M16 74V86M38 74V86M12 68H42" stroke="#9A6433" stroke-width="4" stroke-linecap="round"/><path d="M62 74H88M64 74V86M86 74V86M60 68H90" stroke="#9A6433" stroke-width="4" stroke-linecap="round"/>',
    /* lookout */ '<path d="M38 92L42 40H58L62 92Z" fill="#F5F0E6" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><rect x="26" y="20" width="48" height="24" rx="8" fill="#7BC8F6" stroke="#2B2118" stroke-width="4"/><path d="M28 20L50 6L72 20Z" fill="#E8554A" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="60" r="7" fill="#FFD23C" stroke="#2B2118" stroke-width="3"/><path d="M30 92H70" stroke="#2B2118" stroke-width="5" stroke-linecap="round"/>',
    /* beach */ '<path d="M4 60C20 52 30 68 50 60C70 52 80 68 96 60V96H4Z" fill="#4FA3E8" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M4 78C30 70 70 86 96 76V96H4Z" fill="#F3D79A" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M30 36L33 44L42 44L35 50L38 58L30 53L22 58L25 50L18 44L27 44Z" fill="#FF9F5A" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><path d="M70 30C66 18 84 14 86 26" fill="none" stroke="#2B2118" stroke-width="3"/><circle cx="72" cy="40" r="10" fill="#fff" stroke="#2B2118" stroke-width="3"/><path d="M64 38C70 34 76 36 80 42" stroke="#E8554A" stroke-width="4" fill="none"/>',
  ];
  const CAR_SVG = '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M29 24L15 0H41L38 24Z" fill="#FFF3A0" opacity=".9"/><path d="M71 24L85 0H59L62 24Z" fill="#FFF3A0" opacity=".9"/>'
    + '<rect x="23" y="18" width="54" height="80" rx="16" fill="#F5F7FB" stroke="#2B2118" stroke-width="5"/><rect x="23" y="52" width="54" height="14" fill="#2E6FD8"/>'
    + '<path d="M31 42C31 34 35 31 50 31C65 31 69 34 69 42V46H31Z" fill="#7BC8F6" stroke="#2B2118" stroke-width="3.5" stroke-linejoin="round"/><rect x="33" y="74" width="34" height="14" rx="5" fill="#7BC8F6" stroke="#2B2118" stroke-width="3"/>'
    + '<rect x="33" y="54" width="15" height="10" rx="3" fill="#E8554A" stroke="#2B2118" stroke-width="2.5"/><rect x="52" y="54" width="15" height="10" rx="3" fill="#2E6FD8" stroke="#2B2118" stroke-width="2.5"/>'
    + '<circle cx="33" cy="22" r="5.5" fill="#FFE14A" stroke="#2B2118" stroke-width="2.5"/><circle cx="67" cy="22" r="5.5" fill="#FFE14A" stroke="#2B2118" stroke-width="2.5"/></svg>';
  const ARROW = (c, w) => '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 92V20M24 44L50 14L76 44" fill="none" stroke="#2B2118" stroke-width="' + (w + 8) + '" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 92V20M24 44L50 14L76 44" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const Steer = {
    rule: 'read-and-steer', kind0: 'quiz', verb: '开！', intro: '看路牌，开警车！', props: [],
    gen(G, o) {
      const lv = o.level, legs = lv >= 5 ? 3 : 2, kn = W4X.known(G), set = Array.from('左右前后').slice(0, lv <= 1 ? 2 : 4).filter(k => kn.includes(k));
      const h0 = lv <= 2 ? 0 : lv === 3 ? 2 : lv === 4 ? G.rng.pick([1, 3]) : G.rng.int(0, 3), signs = [], heads = [h0], dirs = [];
      for (let i = 0; i < legs; i++) signs.push(G.rng.pick(set));
      signs.forEach((s, i) => { const d = (heads[i] + REL[s]) % 4; dirs.push(d); if (i + 1 < legs) heads.push(lv >= 5 ? d : h0); });
      return { k: [signs.join(''), heads.join('')], answer: 'all', seq: dirs, asks: dirs.map(d => ({ opts: [0, 1, 2, 3], answer: d })), signs, heads, dirs, legs, item: signs[0], places: G.rng.shuffle([0, 1, 2, 3]),
        h0, fb: signs.filter(s => s === '前' || s === '后').length, turn: lv >= 5 ? 1 : 0 };
    },
    itemOf(st) { return W4X.own(st, st.q.signs[0]); },
    itemsOf(st) { return Array.from(new Set(st.q.signs.slice(1))).filter(k => k !== st.q.signs[0]); },
    /* more legs, the car not facing up (down: left and right swap; sideways), 前 / 后 among the signs, a car that turns */
    hard(q) { return q.legs * 2 + [0, 3, 2, 3][q.h0] + q.fb * 0.5 + q.turn * 3; },
    async present(st) {
      const q = st.q;
      st.leg = 0; st.head = q.heads[0];
      st.zones = [0, 1, 2, 3].map(d => {
        const z = ZX.thing(st, 136, 124, 6, 'card'); Object.assign(z.style, { background: 'rgba(255,255,255,.9)' });
        z.innerHTML = '<svg viewBox="0 0 100 100" width="84%" height="84%">' + PLACES[q.places[d]] + '</svg>';
        K.reg(st, 'road' + d, z, {}); K.pop(st, z, 80 * d);
        return z;
      });
      const car = st.car = ZX.thing(st, 136, 136, 41, 'item'), rot = st.carRot = el('div', '', car);      /* its headlights shine ahead: where it faces is 前 */
      Object.assign(rot.style, { position: 'absolute', inset: 0 }); rot.innerHTML = CAR_SVG;
      K.reg(st, 'car', car, { swipe: SWIPE.slice(), follow: true });
      st.rights = st.zones.concat([car]);
      const pole = st.pole = ZX.thing(st, 14, 90, 5, 'item'); Object.assign(pole.style, { background: '#8A8F99', borderRadius: '6px', boxShadow: '0 0 0 3px #2B2118', pointerEvents: 'none' });
      this.sign(st);
      this.place(st);
    },
    /* the sign of this leg: read, not said */
    sign(st) {
      if (st.readEl) st.readEl.remove();
      const k = st.q.signs[st.leg], d = W4X.readCard(st, k, 96);
      Object.assign(d.firstChild.style, { background: '#FFF8EC', boxShadow: '0 0 0 4px #2B2118, 0 0 0 10px #2E6FD8, 0 8px 0 10px rgba(43,33,24,.2)' });
      if (st.arrowEl) { st.arrowEl.remove(); st.arrowEl = null; }
      K.pop(st, d);
      if (st.pole) this.place(st);
      st.prompt = '看路牌，开警车！';
    },
    geo() {
      const c = Stage.bgPoint(0.5, 0.5), e = Stage.bgPoint(0.62, 0.5), hw = Math.max(100, e.x - c.x), Lx = L();
      return { cx: c.x, cy: c.y, hw, arm: Lx ? [235, 300, 235, 300] : [300, 245, 300, 245] };
    },
    zoneAt(g, d) { const a = g.arm[d]; return { x: g.cx + DIRV[d][0] * a, y: g.cy + DIRV[d][1] * a }; },
    place(st) {
      if (!st.zones) return;
      const g = this.geo();
      st.zones.forEach((z, d) => { const p = this.zoneAt(g, d); place(z, Math.round(p.x - 68), Math.round(clamp(p.y - 62, 8, Stage.H - 132)), 136, 124); });
      if (!st.driving) this.carAt(st, g.cx, g.cy);
      const sx = Math.round(g.cx - g.hw - 74), sy = Math.round(g.cy - g.hw - 96);
      if (st.readEl) { W4X.placeRead(st, sx, Math.max(L() ? 70 : 150, sy - 70)); const r = box(st.readEl); place(st.pole, Math.round(sx - 7), r.y + 100, 14, 70); }
      if (st.arrowEl) this.arrowPlace(st);
    },
    carAt(st, x, y) { st.car.style.transform = ''; place(st.car, Math.round(x - 68), Math.round(y - 68), 136, 136); st.carRot.style.transform = 'rotate(' + st.head * 90 + 'deg)'; },
    decor(G) { this.chars.forEach(id => hideActor(G.actors[id])); const r = G.actors.ryder; if (r) showActor(r, L() ? 920 : 600, L() ? 698 : 1012, L() ? 170 : 150); },
    /* the car drives off towards a road end (it turns that way first); back: it comes back to the middle */
    async drive(st, d, back) {
      const g = this.geo(), car = st.car, p = this.zoneAt(g, d), dx = (p.x - g.cx) * 0.62, dy = (p.y - g.cy) * 0.62;
      car.getAnimations().forEach(a => a.cancel()); car.style.transform = '';
      st.carRot.style.transform = 'rotate(' + d * 90 + 'deg)'; Sfx.whoosh(0.35);
      await st.scope.anim(car, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px)' }], { duration: 520, easing: EASE.glide, fill: 'forwards' });
      if (back && !st.scope.dead) { await st.scope.anim(car, [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(0,0)' }], { duration: 360, easing: EASE.glide, fill: 'forwards' }); car.getAnimations().forEach(a => a.cancel()); }
    },
    onGesture(st, name, p) {
      if (st.submitted || st.busy) return false;
      if (name === 'tap' && p.id === 'read') return W4X.Base.onGesture.call(this, st, name, p);
      let d = -1;
      if (name === 'swipe' && p.id === 'car') d = SWIPE.indexOf(p.dir);
      else if (name === 'tap' && /^road\d$/.test(p.id || '')) d = Number(p.id.slice(4));
      else if (name === 'tap' && p.id === 'car') { K.wiggle(st, st.car); if (!st.toldHow || Clock.t() - st.toldHow > 4000) { st.toldHow = Clock.t(); Voice.sayNow('把警车滑出去！', { tag: 'how' }); } return 'free'; }
      if (d < 0) return false;
      const q = st.q, leg = st.leg;
      st.chose = d; Sfx.tap();
      if (d !== q.dirs[leg]) { st.busy = true; this.drive(st, d, false).then(() => { st.busy = false; }); Session.submit(st, 'leg' + leg + ':' + d); return 'ok'; }
      st.busy = true; st.driving = true;
      this.drive(st, d, false).then(async () => {
        if (st.scope.dead) return;
        K.hop(st, st.zones[d], 20);
        if (leg + 1 >= q.legs) { st.busy = false; Session.submit(st, 'all'); return; }
        await st.scope.wait(250); if (st.scope.dead) return;
        /* the next crossroads: the car comes back to the middle, facing the way it now faces */
        st.leg = leg + 1; st.head = q.heads[st.leg]; st.driving = false;
        const g = this.geo(); st.car.getAnimations().forEach(a => a.cancel()); this.carAt(st, g.cx, g.cy); K.pop(st, st.car);
        this.sign(st); st.busy = false;
      });
      return 'ok';
    },
    async reveal(st) {
      const q = st.q, z = st.zones[q.dirs[q.legs - 1]];
      Sfx.reveal(); K.hop(st, z, 30); glow(st, st.car, 900);
      const r = st.G.actors.ryder; if (r) r.cheer();
      Array.from(new Set(q.signs)).forEach(k => Voice.say(ITEM[k].line, { tag: 'summary' })); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: where the car went, seen from the car - "这是右边" */
    async feedback(st) { const rel = (st.chose - st.head + 4) % 4; K.wiggle(st, st.zones[st.chose]); Voice.say(W4X.thisIs(SIDEW[rel]), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain: 1 the road he drove to, blue; 2 the car back in the middle, Chase's two paws by its left and right (or its front and
       back) and the right one glows - seen from the car (a beat); 3 a gold arrow the right way, the car drives it: "左在这边" */
    async explain(st) {
      const q = st.q, leg = st.leg, want = q.dirs[leg], k = q.signs[leg], g = this.geo();
      EX.ring(st, st.zones[st.chose], 'chosen');
      await EX.wait(st, 650);
      await W4X.exBeat(st, async () => {
        st.car.getAnimations().forEach(a => a.cancel()); st.driving = false; this.carAt(st, g.cx, g.cy);
        const pair = k === '前' || k === '后' ? [0, 2] : [3, 1];
        pair.forEach(rel => {
          const d = (st.head + rel) % 4, pw = ZX.thing(st, 64, 64, 12, 'item'); pw.innerHTML = ICONS.paw; Object.assign(pw.style, { pointerEvents: 'none', borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 3px #2B2118' });
          pw.firstChild.setAttribute('width', '100%'); pw.firstChild.setAttribute('height', '100%');
          place(pw, Math.round(g.cx + DIRV[d][0] * 108 - 32), Math.round(g.cy + DIRV[d][1] * 108 - 32), 64, 64);
          K.pop(st, pw);
          if (d === want) st.scope.timeout(() => { pw.style.background = '#FFF1B8'; pw.style.boxShadow = '0 0 0 3px #2B2118, 0 0 0 8px ' + GOLD + ', 0 0 22px 8px rgba(255,190,40,.8)'; K.hop(st, pw, 16); }, 420);
        });
      }, 1000);
      const ar = ZX.thing(st, 120, 120, 11, 'item'); ar.innerHTML = ARROW(GOLD, 12); ar.style.pointerEvents = 'none'; ar.style.transform = 'rotate(' + want * 90 + 'deg)';
      place(ar, Math.round(g.cx + DIRV[want][0] * 150 - 60), Math.round(g.cy + DIRV[want][1] * 150 - 60), 120, 120); K.pop(st, ar);
      this.drive(st, want, false);
      await W4X.exRight(st, st.zones[want], null, [k + '在这边'], false);
    },
    arrowPlace(st) { const r = box(st.readEl); place(st.arrowEl, r.x + r.w + 6, r.y + r.h / 2 - 34, 68, 68); },
    /* the 2nd hint (real help): a little arrow by the sign, pointing the way to drive */
    gestureHint(st, reteach) {
      if (!st.car) return;
      if (reteach) { st.scope.anim(st.car, [{ transform: 'translate(0,0)' }, { transform: 'translate(0,-30px)' }, { transform: 'translate(30px,0)' }, { transform: 'translate(0,0)' }], { duration: 900, fill: 'none' }); return; }
      if (st.arrowEl || !st.readEl) return;
      const a = st.arrowEl = ZX.thing(st, 68, 68, 12, 'item'); a.innerHTML = ARROW('#FF8A3C', 12); Object.assign(a.style, { pointerEvents: 'none', transform: 'rotate(' + st.q.dirs[st.leg] * 90 + 'deg)' });
      this.arrowPlace(st); K.pop(st, a);
    },
    next(st, strat) {
      if (!st.car || st.busy || st.submitted) return null;
      const want = st.q.dirs[st.leg], d = strat === 'wrong' ? (want + 1) % 4 : want, c = center(st.car);
      return { g: 'swipe', p: { id: 'car', dir: SWIPE[d] }, to: { x: c.x + DIRV[d][0] * 190, y: c.y + DIRV[d][1] * 190 } };
    },
    workEls(st) { return st.car ? [st.car] : []; },
    snap(st) { return { leg: st.leg || 0, head: st.head, dirs: st.q.dirs }; },
    iconNode() { const d = el('div'); d.innerHTML = CAR_SVG; Object.assign(d.style, { width: '76%', height: '76%' }); return d; },
  };

  w4Island('paw4', [Path, TrueFalse, Steer]);
})();
