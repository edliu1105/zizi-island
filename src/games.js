/* ================================================================ 字字岛 · the games
   Every island: 1 认字 (find the character: a different play on every island), 2 写字 (田字格), 3 写字母 (四线三格),
   4 挑战 (a reasoning test, different on every island). Stars as in 点点岛: only the child's own first try. */
const LOOK = { 一: '二三', 二: '一三', 三: '二一', 八: '人', 十: '七', 七: '十', 白: '日目', 来: '米', 妈: '姐', 姐: '妈', 吃: '喝', 喝: '吃', 红: '绿', 绿: '红', 日: '目田月口白', 目: '日田', 田: '日目口', 口: '日田', 人: '大从', 大: '人', 木: '禾米本', 禾: '木米', 米: '木禾', 牛: '手', 手: '牛', 马: '鸟', 鸟: '马', 上: '下', 下: '上', 月: '日明', 本: '木', 林: '木休', 从: '人', 休: '林', 明: '日月', 风: '电', 电: '田日', 包: '勺', 勺: '包', 兔: '龙', 杯: '林', 床: '林', 叶: '口', 果: '田', 车: '牛', 门: '口', 衣: '农', 巾: '中', 光: '火', 火: '光' };
const LOOKEN = { E: 'F', F: 'E', M: 'NW', N: 'M', O: 'QC', Q: 'O', P: 'RB', R: 'P', B: 'PD', U: 'V', V: 'U', b: 'd', d: 'b', p: 'q', q: 'p', m: 'n', n: 'm', i: 'j', j: 'i', u: 'n', w: 'v', C: 'G', G: 'C', I: 'L', L: 'I' };
const PICK = (G, name, items) => bagPick(G, name, items);
/* a bag over a list that may change between picks: what is in the bag but not in the list waits; nothing left refills it */
function bagFrom(G, name, items) {
  const b = G.bags[name] || (G.bags[name] = []);
  let i = b.findIndex(k => items.includes(k));
  if (i < 0) { b.length = 0; b.push(...G.rng.shuffle(items)); i = 0; }
  return b.splice(i, 1)[0];
}
/* the island's characters still to pass come first (V2R1-02) - but one of them at most twice in a session and never twice
   in a row; the other rounds take the island's other characters (W3R1-02: a session is never one character five times) */
function needPick(G, pool, bag) {
  const asked = G.asked || [], last = asked[asked.length - 1], times = k => asked.filter(x => x === k).length;
  const need = (G.needPass || []).filter(k => pool.includes(k) && k !== last && times(k) < 2);
  if (need.length) { const m = Math.min(...need.map(times)); return bagFrom(G, 'need', need.filter(k => times(k) === m)); }
  const done2 = k => (G.needPass || []).includes(k) && times(k) >= 2, rest = pool.filter(k => k !== last && !done2(k)), rest2 = pool.filter(k => k !== last);
  return bagFrom(G, bag || 'ans', rest.length ? rest : rest2.length ? rest2 : pool);
}
/* characters read but not written: the plan writes none over 8 strokes in the first two worlds (A.4) - 是 has 9 */
const NOWRITE = ['是'].concat(NOWRITE3.split(''));      /* world 3 writes 2 characters an island; the others are read (A.4) */
/* characters that hold another one inside (明 holds 月): never a look-alike option for it */
const HOLDS = { 月: '明', 日: '明喝', 木: '林休本果杯床', 人: '从休', 口: '叶吃喝哥', 火: '灯', 田: '果', 目: '看', 马: '妈' };
/* the characters / letters the child can be asked about here (this island + the islands before it, for review) */
function poolOf(G, kind, review) {
  const isl = G.W, mine = kind === 'zh' ? isl.chars.map(c => c.c) : isl.letters.map(l => l.l);
  if (!review) return mine;
  const before = ALL_ISL().slice(0, ALL_ISL().indexOf(G.world)).map(id => ISL[id]);
  const old = before.flatMap(w => kind === 'zh' ? w.chars.map(c => c.c) : w.letters.map(l => l.l)).filter(k => kind === 'zh' || /[a-z]/.test(k) === /[a-z]/.test(mine[0]));
  return mine.concat(old);
}
/* answer + options: the answer from a bag (every one of the island's items once before any comes again), the others
   look-alikes first (level >= 3), then the island's own, then review; the answer's place from a position bag.
   Five options at every level (client 2026-10-10, docs/OPTIONS-EXPLAIN-SPEC.md), so the levels rise by WHAT the four others
   are: levels 1-2 the island's own; level 3 the look-alikes and one old character (from an earlier island), level 4 two,
   level 5 three. Where the child knows fewer than five (the very first island has four characters), a look-alike not met
   yet comes in, then any other one of the kind - never one that holds the answer (明 for 月) */
function optsFor(G, kind, level, n, answer) {
  const own = poolOf(G, kind, false), rev = poolOf(G, kind, true).filter(k => !own.includes(k));
  const known = poolOf(G, kind, true), holds = HOLDS[answer] || '', same = k => ITEM[k] && (kind === 'zh' ? ITEM[k].kind === 'zh' : ITEM[k].kind === ITEM[answer].kind && !!ITEM[k].isl);
  const lookAll = ((kind === 'zh' ? LOOK : LOOKEN)[answer] || '').split('').filter(k => same(k) && !holds.includes(k));
  const look = lookAll.filter(k => known.includes(k));      /* R2-04 */
  const cand = [];
  if (level >= 3) look.forEach(k => cand.push(k));
  /* old characters among them (DESIGN §3) - also on islands with enough characters of their own (W3R1-01): level 3 one (an
     old look-alike counts), level 4 two, level 5 three */
  if (level >= 3) { const have = cand.filter(k => rev.includes(k)).length; G.rng.shuffle(rev.filter(k => !holds.includes(k) && k !== answer && !cand.includes(k))).slice(0, Math.max(0, level - 2 - have)).forEach(k => cand.push(k)); }
  G.rng.shuffle(own).forEach(k => cand.push(k));
  if (level >= 4 || cand.length < n + 1) G.rng.shuffle(rev).forEach(k => cand.push(k));
  lookAll.forEach(k => cand.push(k));
  G.rng.shuffle(ITEMS.filter(x => same(x.k) && !x.fw === !(ITEM[answer] && ITEM[answer].fw)).map(x => x.k)).forEach(k => cand.push(k));
  const others = cand.filter((k, i) => k !== answer && cand.indexOf(k) === i && !holds.includes(k)).slice(0, n - 1);
  const pos = PICK(G, 'pos' + n, Array.from({ length: n }, (_, i) => i));
  const out = G.rng.shuffle(others); out.splice(Math.min(pos, out.length), 0, answer);
  return out;
}
/* the answer's place among n options from a position bag (every place once before any comes again) */
function putAt(G, others, answer) { const n = others.length + 1, pos = PICK(G, 'pos' + n, Array.from({ length: n }, (_, i) => i)), out = G.rng.shuffle(others.slice()); out.splice(Math.min(pos, out.length), 0, answer); return out; }
const isEn = k => /^[A-Za-z]$/.test(k);
const sayItem = (k, opt) => { const it = ITEM[k]; Voice.say(it.line, Object.assign({ tag: 'summary' }, opt || {})); if (it.en && Store.s.settings.en) Voice.say(it.en, { tag: 'summary' }); };

/* ---------------------------------------------------------------- shared scene helpers */
const ZX = {
  thing(st, w, h, z, cls) { const d = el('div', cls || 'item', Stage.el); d.style.position = 'absolute'; d.style.zIndex = z || 5; place(d, 0, 0, w, h); st.els.push(d); return d; },
  pic(src, parent) { const i = img(src, '', parent); Object.assign(i.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }); return i; },
  /* a glyph on a little sign / sticker */
  sign(k, size, cls) { const s = el('div', 'sign ' + (cls || '')); Object.assign(s.style, { position: 'absolute', width: size + 'px', height: size + 'px' }); s.appendChild(Glyph.any(k, size * 0.8)); return s; },
  /* the object a character / letter names, popping out of a point (stage), with its own little motion */
  async alive(st, k, x, y, size) {
    const it = ITEM[k], d = this.thing(st, size, size, 32, 'objpop');
    if (it.obj) this.pic(OBJURL(it.obj), d); else d.appendChild(Scene.node(FW_SENTS[k][0][1], size));
    place(d, x - size / 2, y - size / 2, size, size);
    Sfx.sparkle(); Fx.burst(x, y, { n: 14, dist: 110 });
    await st.scope.anim(d, [{ transform: 'scale(.1) translateY(30px)', opacity: 0 }, { transform: 'scale(1.18) translateY(-20px)', opacity: 1, offset: 0.55 }, { transform: 'scale(1) translateY(0)', opacity: 1 }], { duration: 560, easing: EASE.pop });
    const mo = MOTION[it.obj] || (it.obj ? 'hop' : 'grow');
    const kf = {
      hop: [{ transform: 'translateY(0)' }, { transform: 'translateY(-34px)' }, { transform: 'translateY(0)' }, { transform: 'translateY(-16px)' }, { transform: 'translateY(0)' }],
      swim: [{ transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(-40px) rotate(-8deg)' }, { transform: 'translateX(40px) rotate(8deg)' }, { transform: 'translateX(0) rotate(0)' }],
      fly: [{ transform: 'translate(0,0) rotate(0)' }, { transform: 'translate(30px,-60px) rotate(10deg)' }, { transform: 'translate(-20px,-30px) rotate(-6deg)' }, { transform: 'translate(0,0) rotate(0)' }],
      rise: [{ transform: 'translateY(30px) scale(.9)' }, { transform: 'translateY(-30px) scale(1.08)' }, { transform: 'translateY(0) scale(1)' }],
      sway: [{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(9deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(0)' }],
      grow: [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(.95)' }, { transform: 'scale(1)' }],
      shrink: [{ transform: 'scale(1)' }, { transform: 'scale(.55)' }, { transform: 'scale(.55)' }, { transform: 'scale(1)' }],
      flicker: [{ transform: 'scale(1,1)' }, { transform: 'scale(.92,1.12)' }, { transform: 'scale(1.06,.94)' }, { transform: 'scale(.95,1.08)' }, { transform: 'scale(1,1)' }],
      drive: [{ transform: 'translateX(0)' }, { transform: 'translateX(60px)' }, { transform: 'translateX(-20px)' }, { transform: 'translateX(0)' }],
      spin: [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }],
      up: [{ transform: 'translateY(0)' }, { transform: 'translateY(-90px)' }, { transform: 'translateY(0)' }],
      down: [{ transform: 'translateY(0)' }, { transform: 'translateY(70px)' }, { transform: 'translateY(0)' }],
    }[mo];
    if (mo === 'swim' || mo === 'fly') Sfx.whoosh(0.4); else if (mo === 'flicker') Sfx.fire(); else if (mo === 'drive') Sfx.boing(); else Sfx.hop();
    await st.scope.anim(d, kf, { duration: mo === 'spin' ? 800 : 900, easing: EASE.glide });
    return d;
  },
  /* "字从画里来": the first time a character / letter is met - the thing, then the glyph writes itself over it */
  async meet(st, k) {
    if (ITEM[k] && ITEM[k].fw) return this.meetFw(st, k);
    if (Store.s.met[k]) return;
    Store.s.met[k] = true; Store.save();
    const it = ITEM[k], L = K.L(), sz = L ? 330 : 380, x = Stage.W / 2, y = L ? Stage.H * 0.5 : Stage.H * 0.46, sc = st.scope;
    const veil = this.thing(st, Stage.W, Stage.H, 34, ''); Object.assign(veil.style, { background: 'rgba(255,248,236,.86)' });
    place(veil, 0, 0, Stage.W, Stage.H);
    const pic = this.thing(st, sz, sz, 35, 'objpop'); this.pic(OBJURL(it.obj), pic); place(pic, x - sz / 2, y - sz / 2, sz, sz);
    sc.anim(veil, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    await sc.anim(pic, [{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, easing: EASE.pop });
    Voice.say(isEn(k) ? '看，它变成字母！' : '看，它变成字！', { tag: 'meet' });
    await sc.wait(700);
    /* the brush writes it over the picture, stroke by stroke in its order (R1-09) */
    sc.anim(pic, [{ opacity: 1 }, { opacity: 0.28 }], { duration: 900, fill: 'forwards' });
    const W = new Writer(st, { kind: isEn(k) ? 'en' : 'zh', glyph: k, level: 1, x, y, size: sz * (isEn(k) ? 1.05 : 0.95), bare: true, z: 36 });
    const box = W.el;
    await W.demo(st, null, true, '#E8414B');
    if (sc.dead) return;
    sayItem(k, { tag: 'meet' });
    await sc.guard(Voice.afterSay(400));
    await sc.wait(300);
    sc.anim(veil, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
    sc.anim(box, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.3)', opacity: 0 }], { duration: 320, fill: 'forwards' });
    await sc.anim(pic, [{ transform: 'scale(1)', opacity: 0.28 }, { transform: 'scale(.3)', opacity: 0 }], { duration: 320, fill: 'forwards' });
    veil.remove(); box.remove(); pic.remove();
    return true;
  },
};
const MOTION = { whale: 'swim', bat: 'fly', walk: 'drive', fan: 'spin', top: 'spin', strawberry: 'grow', banana: 'sway', fish: 'swim', bird: 'fly', sun: 'rise', moon: 'rise', fire: 'flicker', water: 'sway', tree: 'sway', riceplant: 'sway', car: 'drive', van: 'drive', bus: 'drive', train: 'drive', big: 'grow', small: 'shrink', up: 'up', down: 'down', wind: 'spin', pinwheel: 'spin', ball: 'hop', kite: 'fly', dragon: 'fly', owl: 'fly', light: 'flicker', lamp: 'flicker', lightning: 'flicker', insect: 'fly', frog: 'hop', rabbit: 'hop', cloud: 'sway', rain: 'down', flower: 'grow', leaf: 'sway' };

/* ---------------------------------------------------------------- the explain step after a wrong answer (docs/OPTIONS-EXPLAIN-SPEC.md,
   client 2026-10-10). Session.runQ calls game.explain(st, ans) after the factual line (feedback): 1 the chosen one for what it
   is - a calm blue ring and its picture / its word / what it shows; 2 the right one in a GOLD ring and why it is right (its
   picture, its sentence, the word's first letter, the rhyme ending ...). No cheering, no praise, no red, never "wrong";
   about 2-5 s, a tap skips it. st.ex records what was ringed (the tests look at it). */
const EX_GOLD = '#FFB400', EX_BLUE = '#5B9BE0';
const EX = {
  idOf(st, e) {
    if (!e) return null;
    if (e.dataset && e.dataset.gid) return e.dataset.gid;
    for (const k in (st.map || {})) if (st.map[k] === e) return k;
    const i = (st.cards || []).indexOf(e); if (i >= 0) return 'card' + i;
    return (e.dataset && e.dataset.ex) || 'el';
  },
  /* the stage box of an element: its own place, or (a piece inside another element) from the screen */
  rect(e) {
    if (e.parentNode === Stage.el && e.style.left && /px$/.test(e.style.width) && /px$/.test(e.style.height) && !/scale|rotate/.test(e.style.transform || '')) return box(e);
    const r = e.getBoundingClientRect(), s = Stage.s || 1, a = Stage.toStage(r.left, r.top);
    return { x: a.x, y: a.y, w: r.width / s, h: r.height / s };
  },
  /* a ring round an element: 'right' gold (solid, glowing), 'chosen' a calm blue dashed one - never red */
  /* the options around an element (whatever this game calls them) and the question's task card */
  near(st, e) { return [].concat(st.cards || [], st.rights || [], st.lefts || [], st.tileEls || [], st.lamps || [], st.taskEl ? [st.taskEl] : []).filter(o => o && o !== e && o.isConnected); },
  /* the gap between two stage boxes (negative when they overlap) */
  gap(a, b) {
    const dx = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w)), dy = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h));
    return dx >= 0 && dy >= 0 ? Math.hypot(dx, dy) : Math.max(dx, dy);
  },
  /* a ring round an element: 'right' gold (solid, glowing), 'chosen' a calm blue dashed one - never red. Its outset is at most
     half the gap to the nearest other option (OX1-03: rings of neighbours never overlap); with no room it is drawn inside the
     element's edge. The blue ring lies above the gold one, so it is always seen */
  ring(st, e, role, pad) {
    if (!e || st.scope.dead) return null;
    st.stepDirty = true;
    const b = this.rect(e), want = pad == null ? 12 : pad, side = { l: want, r: want, t: want, b: want };
    /* every neighbour limits the side that faces it to half the gap (minus 2): two rings always stop short of their midline.
       Side by side: the facing sides; diagonal: the axis with the larger gap is enough; boxes that overlap (scene pictures
       with see-through corners): the axis that overlaps least, drawn inside the edge there */
    this.near(st, e).forEach(o => {
      const q = this.rect(o), dx = Math.max(q.x - (b.x + b.w), b.x - (q.x + q.w)), dy = Math.max(q.y - (b.y + b.h), b.y - (q.y + q.h));
      const axis = dx >= 0 && dy >= 0 ? (dx >= dy ? 'x' : 'y') : dx >= 0 ? 'x' : dy >= 0 ? 'y' : (dx >= dy ? 'x' : 'y');
      const lim = Math.floor((axis === 'x' ? dx : dy) / 2) - 2;
      if (axis === 'x') { if (q.x + q.w / 2 > b.x + b.w / 2) side.r = Math.min(side.r, lim); else side.l = Math.min(side.l, lim); }
      else if (q.y + q.h / 2 > b.y + b.h / 2) side.b = Math.min(side.b, lim); else side.t = Math.min(side.t, lim);
    });
    for (const k in side) if (side[k] < 2) side[k] = Math.min(side[k], -5);          /* no room: inside the edge */
    const tight = Math.min(side.l, side.r, side.t, side.b) < 8, r = el('div', 'exring ' + role, Stage.el);
    Object.assign(r.style, { position: 'absolute', zIndex: role === 'right' ? 60 : 62, pointerEvents: 'none', borderRadius: '28px', boxSizing: 'border-box',
      border: role === 'right' ? (tight ? '6px' : '8px') + ' solid ' + EX_GOLD : '6px dashed ' + EX_BLUE,
      boxShadow: role === 'right' ? (tight ? '0 0 0 2px #fff, 0 0 10px 2px rgba(255,190,40,.8)' : '0 0 0 4px #fff, 0 0 26px 8px rgba(255,190,40,.85)') : '0 0 0 3px rgba(255,255,255,.95)' });
    place(r, b.x - side.l, b.y - side.t, Math.max(24, b.w + side.l + side.r), Math.max(24, b.h + side.t + side.b));
    st.els.push(r);
    const ex = st.ex || (st.ex = { right: [], chosen: [] }); ex[role].push(this.idOf(st, e));
    st.scope.anim(r, [{ transform: 'scale(1.25)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300, easing: EASE.pop });
    if (role === 'right') Sfx.sparkle();
    return r;
  },
  /* a gold outline on the element itself (several right ones side by side, e.g. the rocks of 砸石头: no rings to overlap) */
  outline(st, e) {
    if (!e || st.scope.dead) return;
    st.stepDirty = true;
    e.style.filter = 'drop-shadow(0 0 3px ' + EX_GOLD + ') drop-shadow(0 0 3px ' + EX_GOLD + ') drop-shadow(0 0 8px rgba(255,190,40,.9))';
    const ex = st.ex || (st.ex = { right: [], chosen: [] }); ex.right.push(this.idOf(st, e));
  },
  /* the picture of an item (a character's thing, a letter's word, an English word), or null. A function word has NO picture: its
     sentence's scene would be taken for its meaning (不 -> a sheep, OX1-02); sentOver shows its sentence instead */
  picNode(k, size) {
    const it = ITEM[k];
    if (it && it.obj) return Glyph.obj(it.obj);
    if (it && it.fw) return null;
    const w = (typeof WORDS3 !== 'undefined' && WORDS3.find(x => x[0] === k)) || null, o = w ? w[1] : (typeof CVC_OBJ !== 'undefined' && CVC_OBJ[k]);
    return o ? Glyph.obj(o) : null;
  },
  /* that picture on a little white card over (or under) an element */
  picOver(st, e, k, role, size) {
    if (typeof k === 'string' && ITEM[k] && ITEM[k].fw) return this.sentOver(st, e, k, role);
    size = size || 104;
    const nd = typeof k === 'string' ? this.picNode(k, size * 0.86) : k; if (!nd || !e) return null;
    st.stepDirty = true;
    const b = this.rect(e), d = ZX.thing(st, size, size, 61, 'objpop');
    Object.assign(d.style, { background: '#fff', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
      boxShadow: '0 0 0 4px ' + (role === 'right' ? EX_GOLD : EX_BLUE) + ', 0 6px 0 rgba(43,33,24,.2)' });
    if (nd.tagName === 'IMG') Object.assign(nd.style, { width: '86%', height: '86%' });
    d.appendChild(nd); d.dataset.ex = 'pic-' + role;
    /* above it when there is room under the top bar and no other option there; otherwise on its top-right corner (never nearer
       another option) */
    const up = { x: b.x + b.w / 2 - size / 2, y: b.y - size - 18, w: size, h: size }, hit = r => r.x < up.x + up.w && up.x < r.x + r.w && r.y < up.y + up.h && up.y < r.y + r.h;
    const above = up.y > 96 && !(st.cards || []).concat(st.rights || [], st.lefts || [], st.taskEl ? [st.taskEl] : []).some(c => c !== e && c.isConnected && hit(this.rect(c)));
    if (!above) { size = Math.round(size * 0.8); place(d, clamp(b.x + b.w - size * 0.6, 8, Stage.W - size - 8), Math.max(8, b.y - size * 0.3), size, size); }
    else place(d, clamp(b.x + b.w / 2 - size / 2, 8, Stage.W - size - 8), b.y - size - 18, size, size);
    K.pop(st, d);
    return d;
  },
  /* a function word in its first sentence, the word itself coloured (blue: the chosen one, gold: the right one), over or under
     the element where it touches no other option - or nothing at all (the ring alone says it) */
  sentOver(st, e, k, role) {
    const t = FW_SENTS[k] && FW_SENTS[k][0][0]; if (!t || !e) return null;
    st.stepDirty = true;
    const h = 44, row = Sent.node(t, h, -1, true), col = role === 'right' ? '#B07800' : EX_BLUE;
    $$('[data-ch]', row).forEach(c => { const me = c.dataset.ch === k; delete c.dataset.ch; c.style.cursor = ''; if (me) { c.innerHTML = ''; c.appendChild(Glyph.zh(k, h * 0.92, col)); Object.assign(c.style, { background: role === 'right' ? '#FFF3C4' : '#E4EEFA', borderRadius: '10px' }); } });
    Object.assign(row.style, { padding: '4px 12px', borderRadius: '16px', boxShadow: '0 0 0 4px ' + (role === 'right' ? EX_GOLD : EX_BLUE) + ', 0 6px 0 rgba(43,33,24,.2)' });
    const d = ZX.thing(st, 10, 10, 61, 'item'); d.style.width = d.style.height = 'auto'; d.style.pointerEvents = 'none'; d.dataset.ex = 'sent-' + role; d.appendChild(row);
    const sc = Stage.s || 1, rr = row.getBoundingClientRect(), w = rr.width / sc, hh = rr.height / sc, b = this.rect(e), others = this.near(st, e).map(o => this.rect(o));
    const spots = [b.y - hh - 14, b.y + b.h + 14].map(y => ({ x: clamp(b.x + b.w / 2 - w / 2, 6, Stage.W - w - 6), y, w, h: hh }));
    const at = spots.find(q => q.y >= 96 && q.y + q.h <= Stage.H - 4 && others.every(o => this.gap(q, o) > 2));
    if (!at) { d.remove(); return null; }
    place(d, at.x, at.y); d.style.width = d.style.height = 'auto';
    K.pop(st, d);
    return d;
  },
  /* a word written under an element with some letters coloured (the first letter, the rhyme ending, the letters that differ) */
  wordUnder(st, e, w, color, idx, h) {
    h = h || 58; st.stepDirty = true;
    const cols = Array.isArray(color) ? color : w.split('').map((c, i) => (idx.includes(i) ? color : INK)), b = this.rect(e), g = Glyph.wordC(w, h, cols);
    if (Array.isArray(color)) color = EX_GOLD;
    const d = ZX.thing(st, 10, 10, 61, 'item'); d.style.width = d.style.height = 'auto';
    Object.assign(d.style, { background: '#FFFDF4', borderRadius: '14px', padding: '2px 8px', boxShadow: '0 0 0 3px ' + color, pointerEvents: 'none' });
    d.appendChild(g); d.dataset.ex = 'word';
    const gw = g.getAttribute('width') * 1 + 16, below = b.y + b.h + h + 18 < Stage.H;
    place(d, clamp(b.x + b.w / 2 - gw / 2, 6, Stage.W - gw - 6), below ? b.y + b.h + 8 : b.y - h - 14);
    d.style.width = d.style.height = 'auto';
    K.pop(st, d);
    return d;
  },
  async wait(st, ms) { if (!st.ff) await st.scope.wait(ms); if (st.step) await Step.pause(st); },      /* PT1-P2: the time first, then the beat ends */
  tick(st, ms) { return st.ff ? Promise.resolve() : st.scope.wait(ms); },      /* inside one demonstration (a counting run): never a stop */
  /* one or two short lines (each recorded, <= 8 characters), then the step waits for them */
  async say(st, lines) {
    lines = [].concat(lines).filter(Boolean).slice(0, 2);
    if (st.step && !st.ff) { for (let i = 0; i < lines.length; i++) { if (i) await Step.pause(st, true); if (st.ff) break; Voice.say(lines[i], { tag: 'explain' }); await st.scope.guard(Voice.afterSay(250)); st.stepDirty = true; } return; }      /* step by step: a tap after each line */
    lines.forEach(l => Voice.say(l, { tag: 'explain' })); await st.scope.guard(Voice.afterSay(250));
  },
  /* the common card question: the chosen card (blue ring, its picture), the right card (gold ring, its picture), its line */
  async cards(st, ans, o) {
    o = o || {};
    const opts = st.opts || [], right = o.right != null ? o.right : st.q.answer, iR = opts.indexOf(right);
    const iC = st.tapped != null && st.tapped >= 0 ? st.tapped : opts.indexOf(ans), eC = st.cards && st.cards[iC], eR = st.cards && st.cards[iR];
    if (eC && iC !== iR) { this.ring(st, eC, 'chosen'); if (o.pics !== false) this.picOver(st, eC, o.picOf ? o.picOf(opts[iC]) : opts[iC], 'chosen'); }
    if (o.chosen) await o.chosen(st, eC, iC);
    await this.wait(st, o.gap == null ? 650 : o.gap);
    if (eR && o.move) await o.move(st, eR, iR);             /* the right one goes where it belongs (the gap, the blank ...) */
    if (eR) { this.ring(st, eR, 'right'); if (!o.move) K.hop(st, eR, 22); if (o.pics !== false && o.rightPic !== false) this.picOver(st, eR, o.picOf ? o.picOf(right) : right, 'right'); }
    if (o.why) await o.why(st, eR, iR);
    await this.say(st, o.lines || ['对的是这个', ITEM[right] ? (isEn(right) ? ITEM[right].say : ITEM[right].line) : null]);
    await this.wait(st, 300);
  },
};

/* ---------------------------------------------------------------- the base of every game here */
const ZBase = {
  boost: 0,
  decor(G) {
    const L = K.L(), cast = this.chars;
    cast.forEach((id, i) => {
      const a = G.actors[id];
      if (i === 0) showActor(a, L ? 96 : 76, L ? 698 : 1016, L ? 200 : 160);
      else if (i === 1) showActor(a, L ? 930 : 630, L ? 698 : 1016, L ? 190 : 150);
      else hideActor(a);
    });
  },
  build(G) { this.chars.forEach(id => K.actor(G, id, 180)); },
  layout(G) { this.decor(G); const st = Session.st && Session.st.G === G ? Session.st : null; if (st && st.q) this.place(st); },
  relayoutQ(st) { this.layout(st.G); },
  place() {},
  workEls(st) { return st.cards || []; },
  snap(st) { return { opts: st.opts || null }; },
  key(q) { return this.id + ':' + JSON.stringify(q.k); },
  icon() { const d = el('div'); d.style.width = d.style.height = '100%'; d.appendChild(this.iconNode ? this.iconNode() : Glyph.zh('口', 60)); return d; },
  cheerAll(st) { if (st.explaining) return; this.chars.slice(0, 2).forEach(id => { const a = st.G.actors[id]; if (a && a.x > 0) a.cheer(); }); },     /* no cheering after a wrong answer (spec rule 2) */
  async explain(st, ans) { await EX.cards(st, ans); },
  next(st, strat) { return K.cardNext(st, strat); },
  onGesture(st, name, p) {
    if (name !== 'tap' || st.picked) return false;
    const i = K.cardIndex(p.id); if (i < 0) return false;
    st.picked = true; st.tapped = i; Sfx.tap();
    Session.submit(st, st.opts[i]);
    return 'ok';
  },
  /* the factual line for a wrong pick: what the picked one IS (never "wrong"), never the answer */
  async feedback(st, ans) {
    const e = st.cards && st.cards[st.tapped];
    if (e) { K.wiggle(st, e); if (this.nope) this.nope(st, st.tapped); }
    if (ans != null && ITEM[ans]) Voice.say(ITEM[ans].line, { tag: 'wrong' });
    await st.scope.wait(900);
  },
};
function showActor(a, x, y, h) { if (!a) return; if (h) a.size(h); a.at(x, y); a.root.style.visibility = ''; }
function hideActor(a) { if (a) a.at(-600, -600); }
function zGame(rule, spec) {
  const g = defGame(Object.assign({}, ZBase, rule, spec));
  g.props = (rule.props || []).concat(spec.props || []);
  return g;
}

/* ---------------------------------------------------------------- 认字: one "find the character" frame, many plays.
   A play gives: targets(st) - the elements that carry the options (registered as card0..), place(st), win(st, i), nope(st, i) */
const FindBase = {
  kind0: 'find', verb: '找！',
  gen(G, o) {
    const lv = o.level, n = 5;                 /* five at every level (client 2026-10-10) */
    const lang = this.lang || 'zh', pool = poolOf(G, lang, false), answer = needPick(G, pool);      /* still to pass first, at most twice (W3R1-02) */
    const opts = optsFor(G, lang, lv, n, answer), lk = (lang === 'zh' ? LOOK : LOOKEN)[answer] || '';
    /* what the level is made of: the picture on the card (L1), look-alikes and an old character (L3), two (L4), three (L5) */
    return { k: [answer, opts.join('')], answer, opts, pic: lv <= 1, look: opts.filter(k => k !== answer && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
  },
  async present(st) {
    const q = st.q, G = st.G;
    await ZX.meet(st, q.answer);
    if (!Session.alive(st)) return;
    st.opts = q.opts.slice();
    this.targets(st);
    this.place(st);
    /* the task card: level 1 shows the thing to find; from level 2 it is heard - and its picture comes as the second
       hint (10 s stuck): the question said completely, never the answer (R1-04) */
    st.taskEl = K.task(st, [st.level <= 1 ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
    K.say(st, (isEn(q.answer) ? '找到' : '哪个是') + q.answer + (isEn(q.answer) ? '！' : '？'));
    if (isEn(q.answer)) { st.prompt = '找字母'; st.tail = [ITEM[q.answer].say]; Voice.say(ITEM[q.answer].say, { tag: 'prompt' }); }
  },
  async reveal(st) {
    const i = st.opts.indexOf(st.q.answer);
    await this.win(st, i);
    sayItem(st.q.answer);
    this.cheerAll(st);
    await st.scope.guard(Voice.afterSay(200));
  },
  /* after a wrong one (spec rule 2): its thing over the chosen sign (the factual line just named it), then the right sign in a
     gold ring with ITS thing - the play's own show (a jump, a pop, a robot) stays for the right answers */
  async explain(st, ans) { if (this.exPrep) this.exPrep(st); await EX.cards(st, ans); },
  workEls(st) { return st.cards || []; },
  gestureHint(st, reteach) {
    if (reteach) { (this.workEls ? this.workEls(st) : []).forEach((e, i) => st.scope.timeout(() => K.hop(st, e, 22), 120 * i)); return; }     /* how to play only (W3R2-01) */
    if (st.level <= 1) { st.noHelp = true; return; }                      /* the card shows the picture already: nothing is given (W3R2-02) */
    if (st.picShown || !st.taskEl) return;
    st.picShown = true;
    const it = st.taskEl.querySelector('.it'), im = img(OBJURL(ITEM[st.q.answer].obj), '');
    im.style.height = '54px'; it.replaceChild(im, it.firstChild);
    st.scope.anim(im, [{ transform: 'scale(.2)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 420, easing: EASE.pop });
    Sfx.sparkle();
  },
};
function findGame(play, spec) { return zGame(Object.assign({}, FindBase, play), spec); }

/* row / grid places for n targets inside a rect */
function spots(n, r, cols) {
  cols = cols || n;
  const rows = Math.ceil(n / cols), out = [];
  for (let i = 0; i < n; i++) { const c = i % cols, rr = Math.floor(i / cols), inRow = Math.min(cols, n - rr * cols); out.push({ x: r.x + r.w * (c + 0.5 + (cols - inRow) / 2) / cols, y: r.y + r.h * (rr + 0.5) / rows }); }
  return out;
}

/* 佩奇 · 泥坑跳跳: the right puddle - Peppa jumps in */
const PlayPuddle = {
  intro: '跳进对的泥坑！', props: ['puddle'],
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 220, 200, 6, 'item');
      ZX.pic('assets/props/puddle.png', d).style.top = '40%';
      const s = ZX.sign(k, 110); Object.assign(s.style, { left: '25%', top: '-4%' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 80 * i);
      return d;
    });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 160, y: 300, w: 700, h: n > 3 ? 330 : 220 } : { x: 60, y: 300, w: 584, h: n > 3 ? 520 : 300 };
    const sz = n > 4 ? 170 : 200, cols = L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 3 ? 2 : n);
    spots(n, r, cols).forEach((p, i) => place(st.cards[i], p.x - sz * 0.55, p.y - sz / 2, sz * 1.1, sz));
  },
  async win(st, i) {
    const a = st.G.actors.peppa, e = st.cards[i], b = box(e);
    if (a) { await a.moveTo(b.x + b.w / 2, b.y + b.h * 0.92, 520, 120); }
    Sfx.splash(); Fx.burst(b.x + b.w / 2, b.y + b.h * 0.8, { n: 18, colors: ['#9A6433', '#C98E5B', '#7A4A1C'], dist: 120, fall: true });
    if (a) a.react('hop');
    await st.scope.wait(400);
  },
};
/* Bluey · 气球: the balloon with the right character pops into its thing */
const PlayBalloon = {
  intro: '点对的气球！', props: ['balloon'],
  targets(st) {
    const hues = [0, 190, 95, 40, 270];
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 170, 230, 6, 'item');
      const b = ZX.pic('assets/props/balloon.png', d); b.style.filter = 'hue-rotate(' + hues[i % 5] + 'deg)';
      const s = ZX.sign(k, 96); Object.assign(s.style, { left: '22%', top: '14%', borderRadius: '50%' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {});
      st.scope.anim(d, [{ transform: 'translateY(420px)' }, { transform: 'translateY(0)' }], { duration: 900, delay: 120 * i, easing: EASE.out, fill: 'backwards' });
      Loops.run(d, [{ transform: 'translateY(0) rotate(-2deg)' }, { transform: 'translateY(-12px) rotate(2deg)' }, { transform: 'translateY(0) rotate(-2deg)' }], { duration: 2200 + i * 200 });
      return d;
    });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 170, y: 130, w: 690, h: n > 3 ? 400 : 300 } : { x: 70, y: 260, w: 564, h: n > 3 ? 520 : 340 };
    const cols = L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 4 ? 3 : n > 3 ? 2 : n);          /* five balloons in portrait: 3 + 2, strings clear */
    spots(n, r, cols).forEach((p, i) => place(st.cards[i], p.x - 85, p.y - 115, 170, 230));
  },
  async win(st, i) {
    const e = st.cards[i], b = box(e);
    Sfx.pop(); Fx.burst(b.x + b.w / 2, b.y + b.h * 0.35, { n: 20, dist: 140 });
    e.style.visibility = 'hidden';
    await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y + b.h * 0.4, 170);
  },
};
/* 葫芦娃 · 葫芦藤: the right gourd opens and a gourd brother jumps out */
const BRO_OF = { 火: 'gourd4', 水: 'gourd5', 山: 'gourd1', 石: 'gourd3' };
const PlayGourd = {
  intro: '摘对的葫芦！', props: ['gourd'],
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 170, 210, 6, 'item');
      ZX.pic('assets/props/gourd.png', d);
      const s = ZX.sign(k, 84); Object.assign(s.style, { left: '25%', top: '42%', borderRadius: '50%' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 90 * i);
      Loops.run(d, [{ transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(-3deg)' }], { duration: 2600 + i * 240 });
      return d;
    });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 150, y: 120, w: 720, h: n > 3 ? 420 : 260 } : { x: 60, y: 250, w: 584, h: n > 3 ? 560 : 320 };
    const cols = L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 4 ? 3 : n > 3 ? 2 : n);          /* five gourds in portrait: 3 + 2 */
    spots(n, r, cols).forEach((p, i) => place(st.cards[i], p.x - 85, p.y - 105, 170, 210));
  },
  async win(st, i) {
    const e = st.cards[i], b = box(e), bro = BRO_OF[st.q.answer] || PICK(st.G, 'bro', ['gourd2', 'gourd6', 'gourd7']);
    Sfx.pop(); e.style.visibility = 'hidden';
    Fx.burst(b.x + b.w / 2, b.y + b.h / 2, { n: 16, colors: ['#5CC46E', '#FFC93C', '#FF6B5B'], dist: 120 });
    const d = ZX.thing(st, 170, 230, 31, 'objpop'); ZX.pic('assets/chars/' + bro + '.png', d); place(d, b.x, b.y - 30, 170, 230);
    await st.scope.anim(d, [{ transform: 'scale(.2) translateY(60px)', opacity: 0 }, { transform: 'scale(1.1) translateY(-30px)', opacity: 1, offset: 0.6 }, { transform: 'scale(1) translateY(0)', opacity: 1 }], { duration: 600, easing: EASE.pop });
    const kind = (CHARS[bro] || [])[1];
    if (kind === 'fire') { Sfx.fire(); Fx.burst(b.x + b.w, b.y + 60, { n: 16, colors: ['#FF8A3C', '#FFD34D', '#FF5B3C'], dist: 90 }); }
    else if (kind === 'water') { Sfx.splash(); Fx.burst(b.x + b.w, b.y + 60, { n: 16, colors: ['#7FD3FF', '#4FB3FF', '#FFFFFF'], dist: 90, fall: true }); }
    else Sfx.sparkle();
    await ZX.alive(st, st.q.answer, b.x + b.w / 2 + (b.x > Stage.W / 2 ? -150 : 150), b.y + b.h / 2, 150);
  },
};
/* 汪汪队 · 收庄稼: the right mound - the crop springs up */
const PlayMound = {
  intro: '挖对的土堆！', props: ['mound'],
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 200, 190, 6, 'item');
      ZX.pic('assets/props/mound.png', d).style.top = '30%';
      const s = ZX.sign(k, 92); Object.assign(s.style, { left: '27%', top: '0%' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 90 * i);
      return d;
    });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 160, y: 330, w: 700, h: n > 3 ? 320 : 210 } : { x: n > 4 ? 40 : 60, y: 340, w: n > 4 ? 624 : 584, h: n > 3 ? 520 : 300 };
    const cols = L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 4 ? 3 : n > 3 ? 2 : n);          /* five in portrait: 3 + 2 */
    spots(n, r, cols).forEach((p, i) => place(st.cards[i], p.x - 100, p.y - 95, 200, 190));
  },
  async win(st, i) {
    const e = st.cards[i], b = box(e);
    Sfx.thud(); Fx.burst(b.x + b.w / 2, b.y + b.h * 0.7, { n: 14, colors: ['#9A6433', '#C98E5B'], dist: 90 });
    const a = st.G.actors.chase || st.G.actors.rubble; if (a) a.react();
    await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y + b.h * 0.25, 170);
  },
};
/* 西游 · 躲猫猫: an animal hides behind each bush; the right bush - out it jumps (a wrong one shows who it really is) */
const PlayBush = {
  intro: '谁躲在草丛里？', props: ['bush'],
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 210, 200, 6, 'item');
      ZX.pic('assets/props/bush.png', d);
      const s = ZX.sign(k, 92); Object.assign(s.style, { left: '28%', top: '24%' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 90 * i);
      return d;
    });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 160, y: 300, w: 700, h: n > 3 ? 340 : 230 } : { x: n > 4 ? 40 : 60, y: 330, w: n > 4 ? 624 : 584, h: n > 3 ? 540 : 300 };
    const cols = L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 4 ? 3 : n > 3 ? 2 : n), k = !L && n > 4 ? 0.92 : 1;      /* five in portrait: 3 + 2 */
    spots(n, r, cols).forEach((p, i) => place(st.cards[i], p.x - 105 * k, p.y - 100 * k, 210 * k, 200 * k));
  },
  peek(st, i) {
    const e = st.cards[i], b = box(e), k = st.opts[i];
    const d = ZX.thing(st, 130, 130, 5, 'objpop'); ZX.pic(OBJURL(ITEM[k].obj), d); place(d, b.x + b.w / 2 - 65, b.y - 40, 130, 130);
    return st.scope.anim(d, [{ transform: 'translateY(90px)' }, { transform: 'translateY(0)' }], { duration: 400, easing: EASE.pop });
  },
  nope(st, i) { Sfx.whoosh(0.2); this.peek(st, i); },
  async win(st, i) { Sfx.whoosh(0.3); const e = st.cards[i], b = box(e); e.style.visibility = 'hidden'; await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y + b.h / 2, 190); },
};
/* 奥特曼 · 光线: little monsters hold the signs; the right one - Ultraman's light turns it into stars */
const PlayBeam = {
  intro: '奥特曼发光线！', props: [],
  targets(st) {
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 170, 220, 6, 'item');
      ZX.pic('assets/chars/' + (i % 2 ? 'kaiju2' : 'kaiju1') + '.png', d);
      const s = ZX.sign(k, 92); Object.assign(s.style, { left: '23%', top: '-18%' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 90 * i);
      Loops.run(d, [{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 1300 + i * 160 });
      return d;
    });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 300, y: 200, w: 620, h: n > 3 ? 380 : 260 } : { x: 70, y: 300, w: 564, h: n > 3 ? 500 : 300 };
    const cols = L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 4 ? 3 : n > 3 ? 2 : n);          /* five in portrait: 3 + 2 */
    spots(n, r, cols).forEach((p, i) => place(st.cards[i], p.x - 85, p.y - 90, 170, 220));
  },
  decor(G) { const L = K.L(), a = G.actors.ultraman; if (a) showActor(a, L ? 130 : 110, L ? 690 : 1016, L ? 300 : 230); },
  async win(st, i) {
    const e = st.cards[i], b = box(e), a = st.G.actors.ultraman;
    if (a) a.react('thrust');
    const s = K.lines(st), x0 = a ? a.x + a.w * 0.3 : 100, y0 = a ? a.y - a.h * 0.62 : 400;
    const l = svg('line', { x1: x0, y1: y0, x2: x0, y2: y0, stroke: '#7FE4FF', 'stroke-width': 18, 'stroke-linecap': 'round' }, s);
    svg('line', { x1: x0, y1: y0, x2: x0, y2: y0, stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round' }, s);
    Sfx.zap();
    const tx = b.x + b.w / 2, ty = b.y + b.h / 2;
    s.querySelectorAll('line').forEach(q => st.scope.anim(q, [{ x2: x0, y2: y0 }, { x2: tx, y2: ty }], { duration: 300, fill: 'forwards' }));
    s.querySelectorAll('line').forEach(q => { q.setAttribute('x2', tx); q.setAttribute('y2', ty); });
    await st.scope.wait(320);
    Fx.burst(tx, ty, { n: 24, colors: ['#FFE14A', '#FFFFFF', '#7FE4FF'], dist: 140 });
    await st.scope.anim(e, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.2) rotate(180deg)', opacity: 0 }], { duration: 420, fill: 'forwards' });
    s.remove(); void l;
    await ZX.alive(st, st.q.answer, tx, ty, 160);
  },
};
/* 变形金刚 · 停车场: cars with number plates; the right car transforms into a robot */
const PlayPark = {
  intro: '找对的小汽车！', props: ['parkcar'],
  targets(st) {
    const hues = [0, 150, 200, 280, 330];
    st.cards = st.opts.map((k, i) => {
      const d = ZX.thing(st, 210, 190, 6, 'item');
      const c = ZX.pic('assets/props/parkcar.png', d); c.style.filter = 'hue-rotate(' + hues[i % 5] + 'deg)';
      const s = ZX.sign(k, 84); Object.assign(s.style, { left: '30%', top: '62%', borderRadius: '10px' }); d.appendChild(s);
      K.reg(st, 'card' + i, d, {});
      st.scope.anim(d, [{ transform: 'translateX(' + (K.L() ? 900 : 700) + 'px)' }, { transform: 'translateX(0)' }], { duration: 800, delay: 150 * i, easing: EASE.out, fill: 'backwards' });
      return d;
    });
  },
  place(st) {
    const L = K.L(), n = st.cards.length, r = L ? { x: 150, y: 300, w: 720, h: n > 3 ? 330 : 220 } : { x: 60, y: 320, w: 584, h: n > 3 ? 540 : 300 };
    const cols = L ? (n > 3 ? Math.ceil(n / 2) : n) : (n > 4 ? 3 : n > 3 ? 2 : n);          /* five cars in portrait: 3 + 2, apart (R3-06) */
    const cw = Math.min(210, Math.floor(r.w / cols) - 14), ch = Math.round(cw * 190 / 210);     /* three in a portrait row: smaller, apart (R3-06) */
    spots(n, r, cols).forEach((p, i) => place(st.cards[i], p.x - cw / 2, p.y - ch / 2, cw, ch));
  },
  nope(st) { Sfx.mar(392, 0, 0.4, 0.2); Sfx.mar(392, 0.25, 0.4, 0.2); },
  async win(st, i) {
    const e = st.cards[i], b = box(e);
    Sfx.whoosh(0.4); Sfx.zap();
    await st.scope.anim(e, [{ transform: 'scale(1) rotate(0)' }, { transform: 'scale(.4) rotate(-200deg)', opacity: 0 }], { duration: 420, fill: 'forwards' });
    const d = ZX.thing(st, 190, 240, 31, 'objpop'); ZX.pic('assets/chars/bumblebee.png', d); place(d, b.x + 10, b.y - 60, 190, 240);
    Fx.burst(b.x + b.w / 2, b.y + b.h / 2, { n: 20, colors: ['#FFC93C', '#2B2118', '#7FE4FF'], dist: 140 });
    await st.scope.anim(d, [{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1.1)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)', opacity: 1 }], { duration: 520, easing: EASE.pop });
    await ZX.alive(st, st.q.answer, b.x + b.w / 2 + (b.x > Stage.W / 2 ? -170 : 170), b.y + b.h / 2, 150);
  },
};

/* ---------------------------------------------------------------- 写字 / 写字母: the writing frame + the thing it names */
const WriteBase = {
  kind0: 'write', verb: '写！',
  gen(G, o) {
    /* still to pass first, but never the character just asked again and one at most twice (W3R1-02) */
    const pool = poolOf(G, this.lang, false).filter(k => !NOWRITE.includes(k)), answer = needPick(G, pool);
    return { k: [answer], answer };
  },
  geo(st) {
    const L = K.L(), en = this.lang !== 'zh';
    return L ? { x: en ? 600 : 610, y: 390, size: en ? 470 : 500, ox: 214, oy: 360, os: 230 } : { x: 352, y: 610, size: en ? 520 : 560, ox: 352, oy: 236, os: 190 };
  },
  async present(st) {
    const q = st.q, G = st.G, k = q.answer, it = ITEM[k], g = this.geo(st);
    st.prompt = it.line; st.noPraise = true;
    let met = false;                                     /* a letter is first met here: the apple, then the A */
    if (!G.practice) { met = await ZX.meet(st, k); if (!Session.alive(st)) return; }
    const pic = st.pic = ZX.thing(st, g.os, g.os, 8, 'objpop'); if (it.obj) ZX.pic(OBJURL(it.obj), pic); else pic.appendChild(Scene.node(FW_SENTS[k][0][1], g.os)); place(pic, g.ox - g.os / 2, g.oy - g.os / 2, g.os, g.os);
    K.pop(st, pic);
    const lv = G.practice ? 1 : st.level;
    const W = st.w = new Writer(st, { kind: this.lang === 'zh' ? 'zh' : 'en', glyph: k, level: lv, x: g.x, y: g.y, size: g.size });
    if (G.practice) W.free = true;
    K.pop(st, W.el);
    if (!met) Voice.say(it.line, { tag: 'prompt' });       /* just said by the meeting: straight on to the brush (R3-04) */
    if (isEn(k)) st.prompt = it.line;
    /* the first time (or level 1, or practice): the brush shows the whole character / letter first */
    if (lv <= 1 || !learned(k)) {
      await st.scope.guard(Voice.afterSay(150));
      Voice.say('看我写一遍', { tag: 'prompt' });
      await W.demo(st);
      if (!Session.alive(st)) return;
      Voice.say('该你写啦！', { tag: 'prompt' });
    }
    W.armed = true;
    st.phase = 'ready';
  },
  place(st) { if (!st.w) return; const g = this.geo(st); st.w.place(g.x, g.y, g.size); if (st.pic) place(st.pic, g.ox - g.os / 2, g.oy - g.os / 2, g.os, g.os); },
  onGesture(st, name, p) {
    if (name !== 'stroke' || p.id !== 'paper' || !st.w || st.w.done) return false;
    const r = st.w.stroke(p.pts || []);
    if (!r) return false;
    if (r.ok) {
      Sfx.place(); Sfx.mar(Sfx.SCALE[Math.min(9, st.w.k)], 0, 0.3, 0.4);
      if (this.lang === 'zh' && r.name) Voice.sayNow(r.name, { tag: 'stroke' });
      if (r.done) { st.ok2 = !st.w.slips; this.finished(st); }
    } else {
      const sa = st.slipAt || (st.slipAt = []); if (!sa.includes(st.w.k)) sa.push(st.w.k);
      Voice.sayNow(SLIP[r.why] || SLIP.shape, { tag: 'slip' });
      if (st.level >= 4 || st.w.slips >= 2) { st.w.demo(st, st.w.k); }
    }
    return 'ok';
  },
  async finished(st) {
    const k = st.q.answer, c = st.w.center();
    if (!st.G.teach) { Store.learn(k, st.G.practice ? 'p' : 'w'); if (st.G.practice && !learned(k)) Store.learn(k, 'w'); }      /* 教一教: no learned() evidence */
    st.w.el.animate([{ filter: 'none' }, { filter: 'drop-shadow(0 0 22px #FFD93C)' }, { filter: 'none' }], { duration: T(900) + 1 });
    await st.scope.wait(350);
    Voice.hush('done');
    st.alivePic = await ZX.alive(st, k, c.x, c.y - (K.L() ? 40 : 60), K.L() ? 210 : 230);
    sayItem(k);
    await st.scope.guard(Voice.afterSay(200));
    Session.submit(st, st.ok2 ? 'clean' : 'slips');
  },
  evaluate(st, ans) { return ans === 'clean' || st.G.practice; },
  async reveal(st) { this.cheerAll(st); if (st.G.practice) { Voice.say(PICKP(), { tag: 'praise' }); } },
  again: '再写一个！',
  async feedback(st) { Voice.say('下次每笔都写对', { tag: 'wrong' }); await st.scope.wait(600); },
  /* the explain step for writing: the paper in a gold ring and the stroke(s) that slipped written once more by the brush, in
     gold (the character itself is already finished on the paper) */
  async explain(st) {
    if (!st.w) return;
    if (st.alivePic) st.scope.anim(st.alivePic, [{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });      /* the paper in view again */
    EX.ring(st, st.w.el, 'right', 4);
    const ks = (st.slipAt || []).slice(0, 2);
    if (st.step && ks.length) {               /* step by step (PT1-P4): 1 the paper and which stroke, 2 the brush writes it, for each */
      for (const k of ks) {
        if (st.ff || st.scope.dead) break;
        const sk = st.w.strokes[k], p0 = sk && st.w.toStage(sk.med[0]), dot = p0 ? ZX.thing(st, 44, 44, 61, 'item') : null;      /* where that stroke starts */
        if (dot) { Object.assign(dot.style, { borderRadius: '50%', background: EX_GOLD, boxShadow: '0 0 0 4px #fff, 0 0 14px 4px rgba(255,190,40,.8)', pointerEvents: 'none' }); dot.dataset.ex = 'stroke'; place(dot, p0.x - 22, p0.y - 22, 44, 44); K.pop(st, dot); }
        await EX.say(st, ['再看一看！']); await EX.wait(st, 200);
        if (dot) dot.remove();
        Voice.say('看，是这样', { tag: 'explain' }); await st.w.demo(st, k, false, EX_GOLD); st.stepDirty = true; await EX.wait(st, 200);
      }
      return;
    }
    if (ks.length) { Voice.say('看，是这样', { tag: 'explain' }); for (const k of ks) { if (st.ff || st.scope.dead) break; await st.w.demo(st, k, false, EX_GOLD); } }
    await st.scope.guard(Voice.afterSay(200));
  },
  next(st, strat) { if (!st.w || st.w.done) return null; const pts = st.w.expected(strat === 'wrong'); return pts ? { g: 'stroke', p: { id: 'paper', pts } } : null; },
  gestureHint(st) { if (st.w && !st.w.done && !st.w.paused) st.w.demo(st, st.w.k); },
  workEls(st) { return st.w ? [st.w.el] : []; },
  snap(st) { return { k: st.w ? st.w.k : 0, total: st.w ? st.w.strokes.length : 0, slips: st.w ? st.w.slips : 0 }; },
};
const PICKP = () => ['写得真漂亮！', '真好看！', '写得真好！'][Math.floor(Math.random() * 3)];
function writeGame(spec) { return zGame(WriteBase, spec); }

/* ---------------------------------------------------------------- 挑战 (reasoning tests) */
/* 佩奇 · 翻翻乐: look, they turn over, where is ...? */
const QMemory = {
  kind0: 'memory', verb: '记！', intro: '记住它们！', props: ['card'],
  gen(G, o) {
    const lv = o.level, n = lv <= 4 ? 5 : 6;                 /* five cards (client 2026-10-10); six at level 5 as before */
    const pool = poolOf(G, 'zh', lv >= 4).concat(lv >= 3 ? poolOf(G, 'up', false) : []);
    const answer = needPick(G, poolOf(G, 'zh', false));
    /* the first island has four characters: a look-alike of the answer (or of another card) makes up the five at levels 1-2, as in
       认字 - never one that holds the answer, never a letter among characters (OX1-05) */
    const holds = HOLDS[answer] || '', lk = k => (LOOK[k] || '').split('').filter(x => ITEM[x] && ITEM[x].kind === 'zh' && !pool.includes(x) && !holds.includes(x));
    const more = lk(answer).concat(G.rng.shuffle(pool.flatMap(lk)), G.rng.shuffle(poolOf(G, 'up', false).filter(k => !pool.includes(k)))).filter((k, i, a) => a.indexOf(k) === i);
    const others = G.rng.shuffle(pool.filter(k => k !== answer)).concat(more).slice(0, n - 1);
    return { k: [answer, others.join('')], answer, opts: putAt(G, others, answer), show: lv <= 2 ? 3800 : lv <= 4 ? 3200 : 2600 };
  },
  async present(st) {
    const q = st.q;
    st.opts = q.opts.slice();
    st.cards = q.opts.map((k, i) => {
      const d = ZX.thing(st, 150, 190, 6, 'card');
      d.style.display = 'flex'; d.style.alignItems = 'center'; d.style.justifyContent = 'center'; d.style.perspective = '400px';
      const f = el('div', '', d); f.appendChild(Glyph.any(k, 120)); f.style.pointerEvents = 'none';
      const back = img('assets/props/card.png', '', d); Object.assign(back.style, { position: 'absolute', inset: '-4px', width: 'calc(100% + 8px)', height: 'calc(100% + 8px)', objectFit: 'fill', borderRadius: '24px', opacity: 0, pointerEvents: 'none' });
      d._back = back; d._face = f;
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 70 * i);
      return d;
    });
    this.place(st);
    K.task(st, [['eye', 'q']]);
    K.say(st, '记住它们！');
    await st.scope.wait(q.show);
    if (!Session.alive(st)) return;
    Sfx.whoosh(0.3);
    st.cards.forEach((d, i) => { st.scope.timeout(() => { d._back.style.opacity = 1; d._face.style.opacity = 0; st.scope.anim(d, [{ transform: 'rotateY(0)' }, { transform: 'rotateY(90deg)' }, { transform: 'rotateY(0)' }], { duration: 360 }); }, 90 * i); });
    await st.scope.wait(600);
    K.say(st, q.answer + '在哪里？');
  },
  place(st) {
    if (!st.cards) return;
    const L = K.L(), n = st.cards.length, cols = L ? (n > 4 ? 3 : n) : (n > 3 ? 2 : n), r = L ? { x: 170, y: 150, w: 690, h: n > 4 ? 440 : 280 } : { x: 70, y: 280, w: 564, h: n > 4 ? 580 : n > 3 ? 560 : 300 };
    spots(n, r, cols).forEach((p, i) => place(st.cards[i], p.x - 75, p.y - 95, 150, 190));
  },
  async reveal(st) {
    const e = st.cards[st.opts.indexOf(st.q.answer)];
    e.style.perspective = 'none';                       /* Chrome does not repaint a face shown again under a 3D perspective */
    e._back.style.opacity = 0; e._face.style.opacity = 1;
    st.scope.anim(e, [{ transform: 'rotateY(90deg) scale(1)' }, { transform: 'rotateY(0) scale(1.12)' }, { transform: 'scale(1)' }], { duration: 420 });
    Sfx.reveal(); sayItem(st.q.answer); this.cheerAll(st);
    await st.scope.guard(Voice.afterSay(200));
  },
  async feedback(st, ans) {
    const e = st.cards[st.tapped];
    if (e) { e.style.perspective = 'none'; e._back.style.opacity = 0; e._face.style.opacity = 1; K.wiggle(st, e); }
    if (ITEM[ans]) Voice.say(ITEM[ans].line, { tag: 'wrong' });
    await st.scope.wait(1100);
  },
  /* explain: the turned-up card in blue with its picture; the right card turns over in a gold ring, with its picture */
  async explain(st, ans) {
    await EX.cards(st, ans, { gap: 400, why: async (st2, e) => { if (!e) return; e.style.perspective = 'none'; e._back.style.opacity = 0; e._face.style.opacity = 1; st.scope.anim(e, [{ transform: 'rotateY(90deg)' }, { transform: 'rotateY(0)' }], { duration: 360 }); } });
  },
  workEls(st) { return st.cards || []; },
  iconNode() { return Glyph.zh('口', 56); },
};
/* Bluey · 字母排队: the alphabet train - who is missing? */
const QOrder = {
  kind0: 'order', verb: '排！', intro: '字母排排队！', props: ['block'],
  lower: false,
  gen(G, o) {
    const lv = o.level, abc = this.lower ? 'abcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const known = poolOf(G, this.lower ? 'lo' : 'up', true), last = Math.max(...known.map(k => abc.indexOf(k)));
    const len = lv <= 2 ? 4 : 5, start = G.rng.int(0, Math.max(0, last - len + 1)), seq = abc.slice(start, start + len).split('');
    const gap = lv <= 1 ? len - 1 : G.rng.int(1, len - 1), answer = seq[gap];
    const i0 = abc.indexOf(answer), near = [1, -1, 2, -2, 3, -3, 4, -4].map(d => abc[i0 + d]).filter(k => k && ITEM[k]).slice(0, 4);
    return { k: [seq.join(''), gap], seq, gap, answer, opts: putAt(G, near, answer) };      /* five: the four nearest letters (client 2026-10-10) */
  },
  async present(st) {
    const q = st.q, L = K.L(), n = q.seq.length, bs = L ? 120 : 112, gap = 14, total = n * bs + (n - 1) * gap, x0 = Stage.W / 2 - total / 2, y = L ? 210 : 330;
    st.blocks = q.seq.map((k, i) => {
      const d = ZX.thing(st, bs, bs, 6, 'item'); ZX.pic('assets/props/block.png', d);
      if (i !== q.gap) { const g = Glyph.en(k, bs * 0.7); Object.assign(g.style, { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }); d.appendChild(g); }
      else { d.style.opacity = 0.55; const qm = el('div', '', d); qm.innerHTML = ICONS.q; Object.assign(qm.style, { position: 'absolute', left: '25%', top: '25%', width: '50%', height: '50%' }); }
      place(d, x0 + i * (bs + gap), y, bs, bs); K.pop(st, d, 60 * i);
      return d;
    });
    K.cards(st, q.opts.map(k => Glyph.en(k, 100)), q.opts, Object.assign({ size: 140, gap: 26 }, this.cardSpot()));
    K.say(st, '排队缺了谁？');
  },
  cardSpot() { return K.L() ? { cx: 512, cy: 470, size: 140, gap: 26 } : { cx: 352, cy: 720 }; },
  place(st) {
    if (!st.blocks) return;
    const L = K.L(), n = st.blocks.length, bs = L ? 120 : 112, gap = 14, total = n * bs + (n - 1) * gap, x0 = Stage.W / 2 - total / 2, y = L ? 210 : 330;
    st.blocks.forEach((d, i) => place(d, x0 + i * (bs + gap), y, bs, bs));
    K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot()));
  },
  /* explain: the chosen letter in blue; the right one in gold flies into the gap, and the train's letters hop in order */
  async explain(st, ans) {
    await EX.cards(st, ans, { pics: false, lines: [ITEM[st.q.answer].say],
      move: async (st2, card) => { const b = st.blocks[st.q.gap], bb = box(b), cb = box(card); await K.flyTo(st, card, bb.x + (bb.w - cb.w) / 2, bb.y + (bb.h - cb.h) / 2, 380, 50, bb.w / cb.w); b.style.opacity = 1; },
      why: async () => { for (let i = 0; i < st.blocks.length && !st.ff; i++) { K.hop(st, st.blocks[i], 16); await EX.tick(st, 110); } st.stepDirty = true; } });
  },
  async reveal(st) {
    const q = st.q, card = st.cards[st.opts.indexOf(q.answer)], b = st.blocks[q.gap];
    const bb = box(b), cb = box(card);
    await K.flyTo(st, card, bb.x + (bb.w - cb.w) / 2, bb.y + (bb.h - cb.h) / 2, 420, 60, bb.w / cb.w);
    b.style.opacity = 1; Sfx.place(); this.cheerAll(st);
    Voice.say(ITEM[q.answer].say, { tag: 'summary' });
    await st.scope.guard(Voice.afterSay(200));
  },
  iconNode() { return Glyph.en(this.lower ? 'b' : 'B', 60); },
};
/* 葫芦娃 · 缺了一笔: which stroke makes it whole? The other strokes on offer have other names (not a second 撇 for a
   missing 撇) and come from other characters; every stroke is drawn at its real size and place in a little 田字格, so
   where it goes and how long it is can be seen. The gap is outlined only at levels 1-2 (R1-02, R1-10) */
const QMissing = {
  kind0: 'missing', verb: '补！', intro: '少了一笔！', props: [],
  gen(G, o) {
    const lv = o.level, answer = needPick(G, poolOf(G, 'zh', lv >= 4));
    const names = (STROKE_NAMES[answer] || '').split(' '), n = names.length, miss = G.rng.int(0, n - 1), want = names[miss];
    const pool = G.rng.shuffle(poolOf(G, 'zh', true).filter(k => k !== answer)), fo = [], used = new Set([want]);
    for (const k of pool) {
      const nm = (STROKE_NAMES[k] || '').split(' '), cand = G.rng.shuffle(nm.map((x, i) => [x, i])).find(([x]) => !used.has(x));
      if (cand) { used.add(cand[0]); fo.push([k, cand[1]]); }
      if (fo.length >= 4) break;               /* five strokes to choose from (client 2026-10-10) */
    }
    const opts = putAt(G, fo, [answer, miss]);
    return { k: [answer, miss], answer: answer + miss, ch: answer, miss, opts, outline: lv <= 2 };
  },
  async present(st) {
    const q = st.q;
    const big = st.big = ZX.thing(st, 330, 330, 6, 'paper tzg');
    const s = svg('svg', { viewBox: '0 0 1024 1024', width: '100%', height: '100%' }, big);
    svg('rect', { x: 8, y: 8, width: 1008, height: 1008, fill: 'none', stroke: '#E8414B', 'stroke-width': 12 }, s);
    svg('path', { d: 'M512 20V1004M20 512H1004', stroke: '#E8414B', 'stroke-width': 5, 'stroke-dasharray': '26 18', opacity: 0.5, fill: 'none' }, s);
    const g = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s);
    Hanzi.data[q.ch].s.forEach((o, i) => { const p = svg('path', { d: o, fill: i === q.miss ? 'none' : INK, stroke: i === q.miss && q.outline ? '#E8414B' : 'none', 'stroke-width': 10, 'stroke-dasharray': '30 22' }, g); if (i === q.miss) st.gap = p; });
    const pic = st.pic = ZX.thing(st, 150, 150, 6, 'objpop'); ZX.pic(OBJURL(ITEM[q.ch].obj), pic);
    st.opts = q.opts.map(o => o[0] + o[1]);
    K.cards(st, q.opts.map(([c, k]) => {
      const sv = svg('svg', { viewBox: '0 0 1024 1024', width: 124, height: 124, class: 'gly' });
      svg('path', { d: 'M512 30V994M30 512H994', stroke: '#E8414B', 'stroke-width': 8, 'stroke-dasharray': '30 24', opacity: 0.35, fill: 'none' }, sv);
      svg('path', { d: Hanzi.data[c].s[k], fill: INK, transform: 'translate(0,900) scale(1,-1)' }, sv);
      return sv;
    }), st.opts, Object.assign({ size: 150, gap: 28 }, this.cardSpot()));
    this.place(st);
    st.lead = ITEM[q.ch].line;
    Voice.say(st.lead, { tag: 'prompt' });
    K.say(st, '少了哪一笔？');
  },
  cardSpot() { return K.L() ? { cx: 600, cy: 580, size: 130, gap: 22 } : { cx: 352, cy: 780 }; },
  decor(G) { const L = K.L(), a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L ? 96 : 76, L ? 698 : 1016, L ? 190 : 140); },      /* one friend: five cards keep clear (R2-07) */
  place(st) {
    if (!st.big) return;
    const L = K.L();
    place(st.big, L ? 470 : 187, L ? 100 : 250, 330, 330);
    place(st.pic, L ? 270 : 40, L ? 190 : 120, 150, 150);
    K.cardsPlace(st, Object.assign({ gap: 28 }, this.cardSpot()));
  },
  async reveal(st) {
    const card = st.cards[st.opts.indexOf(st.q.answer)], bb = box(st.big), cb = box(card);
    await K.flyTo(st, card, bb.x + (bb.w - cb.w) / 2, bb.y + (bb.h - cb.h) / 2, 420, 50, bb.w / cb.w);
    card.style.opacity = 0; st.gap.setAttribute('fill', '#E8414B'); st.gap.setAttribute('stroke', 'none');
    Sfx.reveal(); this.cheerAll(st);
    sayItem(st.q.ch);
    await st.scope.guard(Voice.afterSay(200));
  },
  async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); const o = st.q.opts[st.tapped], nm = o && (STROKE_NAMES[o[0]] || '').split(' ')[o[1]]; Voice.say(nm ? '这是' + nm : '放上去不对哦', { tag: 'wrong' }); await st.scope.wait(900); },
  /* explain: the chosen stroke is laid on the character in blue, where it really sits - it does not fill the gap; then it goes
     back and the right one flies in, in gold, and the gap is filled */
  async explain(st, ans) {
    const q = st.q, card = st.cards[st.tapped], bb = box(st.big);
    await EX.cards(st, ans, { pics: false, gap: 250, lines: ['对的是这个', ITEM[q.ch].line],
      chosen: async (st2, e) => {
        if (!e) return;
        const cb = box(e), p = e.querySelector('path:last-child'); if (p) p.setAttribute('fill', EX_BLUE);
        const look = [e.style.background, e.style.boxShadow, e.style.borderColor];
        e.style.zIndex = 62; e.style.background = 'transparent'; e.style.boxShadow = 'none'; e.style.borderColor = 'transparent';
        await K.flyTo(st, e, bb.x + (bb.w - cb.w) / 2, bb.y + (bb.h - cb.h) / 2, 380, 40, bb.w / cb.w);
        Voice.say('放不进去', { tag: 'explain' });              /* it sits where it belongs in its own character - not in the gap */
        await EX.wait(st, 650);
        await K.flyTo(st, e, cb.x, cb.y, 320, 30, 1);
        [e.style.background, e.style.boxShadow, e.style.borderColor] = look; e.style.zIndex = '';
      },
      move: async (st2, e) => { const cb = box(e); await K.flyTo(st, e, bb.x + (bb.w - cb.w) / 2, bb.y + (bb.h - cb.h) / 2, 380, 50, bb.w / cb.w); e.style.opacity = 0; st.gap.setAttribute('fill', EX_GOLD); st.gap.setAttribute('stroke', 'none'); },
    });
    void card;
  },
  iconNode() { return Glyph.zh('山', 56, '#46C27A'); },
};
/* 汪汪队 · 听音找字母: the pup badges - which one did you hear? */
const QHear = {
  kind0: 'hear', verb: '听！', intro: '听字母！', props: ['badge'],
  gen(G, o) {
    const lv = o.level, kind = this.lower ? 'lo' : 'up', answer = PICK(G, 'ans', poolOf(G, kind, lv >= 3)), n = 5;      /* five (client 2026-10-10) */
    return { k: [answer, n], answer, opts: optsFor(G, kind, lv, n, answer) };
  },
  async present(st) {
    const q = st.q;
    st.opts = q.opts.slice();
    st.cards = q.opts.map((k, i) => {
      const d = ZX.thing(st, 170, 170, 6, 'item'); ZX.pic('assets/props/badge.png', d);
      const g = Glyph.en(k, 96); Object.assign(g.style, { position: 'absolute', left: '50%', top: '54%', transform: 'translate(-50%,-50%)' }); d.appendChild(g);
      K.reg(st, 'card' + i, d, {}); K.pop(st, d, 80 * i);
      return d;
    });
    this.place(st);
    K.task(st, [['speaker', 'q']]);
    st.prompt = '找字母'; st.tail = [ITEM[q.answer].say];
    Voice.say('找字母', { tag: 'prompt' }); Voice.say(ITEM[q.answer].say, { tag: 'prompt' });
  },
  place(st) {
    if (!st.cards) return;
    const L = K.L(), n = st.cards.length, cols = n > 4 ? 3 : L ? n : (n > 3 ? 2 : n), r = L ? (n > 4 ? { x: 170, y: 140, w: 690, h: 420 } : { x: 170, y: 250, w: 690, h: 260 }) : (n > 4 ? { x: 52, y: 300, w: 600, h: 440 } : { x: 70, y: 330, w: 564, h: n > 3 ? 480 : 300 });
    spots(n, r, cols).forEach((p, i) => place(st.cards[i], p.x - 85, p.y - 85, 170, 170));
  },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 40); Sfx.reveal(); const b = box(e); await ZX.alive(st, st.q.answer, b.x + b.w / 2, b.y - 70, 130); Voice.say(ITEM[st.q.answer].line, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); if (ITEM[ans]) Voice.say(ITEM[ans].say, { tag: 'wrong' }); await st.scope.wait(900); },
  async explain(st, ans) { await EX.cards(st, ans, { lines: ['对的是这个', ITEM[st.q.answer].line] }); },
  iconNode() { return Glyph.en('M', 60); },
};
/* 西游 · 连一连: each picture to its character (a picture, then its character; every pair right) */
const QConnect = {
  kind0: 'connect', verb: '连！', intro: '连一连！', props: [],
  gen(G, o) {
    const lv = o.level, n = lv <= 1 ? 2 : lv <= 3 ? 3 : 4;
    const pool = poolOf(G, 'zh', lv >= 3), pick = G.rng.shuffle(poolOf(G, 'zh', false)).slice(0, Math.min(n, 4));
    while (pick.length < n) { const k = G.rng.pick(pool); if (!pick.includes(k)) pick.push(k); }
    /* five characters to choose from on the right at every level (client 2026-10-10): the pictures' own and others - look-alikes
       of them first - that belong to no picture here (a picture never has two characters that fit it) */
    const objs = new Set(pick.map(k => ITEM[k].obj)), ok = k => !pick.includes(k) && !objs.has(ITEM[k].obj);
    const look = G.rng.shuffle(pick.flatMap(k => (LOOK[k] || '').split('')).filter(k => ITEM[k] && poolOf(G, 'zh', true).includes(k) && ok(k)));
    const extra = look.concat(G.rng.shuffle(poolOf(G, 'zh', true).filter(ok))).filter((k, i, a) => a.indexOf(k) === i).slice(0, 5 - n);
    const right = G.rng.shuffle(pick.concat(extra));
    return { k: [pick.join(''), right.join('')], left: pick, right, extra, answer: 'all' };
  },
  async present(st) {
    const q = st.q;
    st.pairs = {}; st.sel = null;
    st.lefts = q.left.map((k, i) => { const d = ZX.thing(st, 130, 130, 6, 'card pic'); d.appendChild(Glyph.obj(ITEM[k].obj)); K.reg(st, 'L' + i, d, {}); K.pop(st, d, 70 * i); return d; });
    st.rights = q.right.map((k, i) => { const d = ZX.thing(st, 130, 130, 6, 'card'); d.appendChild(Glyph.zh(k, 104)); K.reg(st, 'R' + i, d, {}); K.pop(st, d, 70 * i + 200); return d; });
    st.svgL = K.lines(st);
    this.place(st);
    K.say(st, '连一连！');
  },
  place(st) {
    if (!st.lefts) return;
    const L = K.L(), n = st.lefts.length, m = st.rights.length, span = L ? 580 : 668, y0 = L ? 108 : 180;
    const h = span / n, rs = Math.min(130, Math.floor((span - (m - 1) * (L ? 16 : 22)) / m)), rh = (span - rs) / Math.max(1, m - 1);
    st.lefts.forEach((d, i) => place(d, L ? 230 : 90, y0 + i * h + (h - 130) / 2, 130, 130));
    st.rights.forEach((d, i) => place(d, (L ? 664 : 484) + (130 - rs) / 2, y0 + i * rh, rs, rs));
    this.redraw(st);
  },
  redraw(st) { if (!st.svgL) return; st.svgL.innerHTML = ''; Object.keys(st.pairs).forEach(li => { const a = box(st.lefts[li]), b = box(st.rights[st.pairs[li]]); svg('line', { x1: a.x + a.w, y1: a.y + a.h / 2, x2: b.x, y2: b.y + b.h / 2, stroke: '#2E6FD8', 'stroke-width': 10, 'stroke-linecap': 'round' }, st.svgL); }); },
  onGesture(st, name, p) {
    if (name !== 'tap' || st.submitted) return false;
    const m = /^([LR])(\d)$/.exec(p.id || ''); if (!m) return false;
    const side = m[1], i = Number(m[2]), q = st.q;
    if (side === 'L') { if (st.pairs[i] != null) return false; st.sel = i; st.lefts.forEach((d, j) => d.classList.toggle('hi', j === i)); Sfx.tap(); return 'ok'; }
    if (st.sel == null) { K.wiggle(st, st.rights[i]); Voice.sayNow('先点一张图', { tag: 'hint' }); return 'ok'; }
    if (Object.values(st.pairs).includes(i)) return false;
    const ok = q.left[st.sel] === q.right[i];
    if (!ok) { st.tapped = i; st.wrongPair = [st.sel, i]; Session.submit(st, 'bad'); return 'ok'; }
    st.pairs[st.sel] = i; st.lefts[st.sel].classList.remove('hi'); st.sel = null; Sfx.place(); this.redraw(st);
    sayItem(q.right[i]);
    if (Object.keys(st.pairs).length === q.left.length) Session.submit(st, 'all');
    return 'ok';
  },
  async reveal(st) { Sfx.reveal(); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  async feedback(st) { const [l, r] = st.wrongPair; K.wiggle(st, st.rights[r]); Voice.say(ITEM[st.q.right[r]].line, { tag: 'wrong' }); st.lefts[l].classList.remove('hi'); await st.scope.wait(900); },
  /* explain: the chosen character in blue with its own picture; the picture's own character in gold, joined by a gold line */
  async explain(st) {
    const [l, r] = st.wrongPair, k = st.q.left[l], ri = st.q.right.indexOf(k), eC = st.rights[r], eR = st.rights[ri], eL = st.lefts[l];
    EX.ring(st, eC, 'chosen', 8); EX.picOver(st, eC, st.q.right[r], 'chosen', 92);
    await EX.wait(st, 650);
    const a = box(eL), b = box(eR);
    svg('line', { x1: a.x + a.w, y1: a.y + a.h / 2, x2: b.x, y2: b.y + b.h / 2, stroke: EX_GOLD, 'stroke-width': 12, 'stroke-linecap': 'round' }, st.svgL);
    EX.ring(st, eL, 'right', 8); EX.ring(st, eR, 'right', 8);
    await EX.say(st, ['对的是这个', ITEM[k].line]);
    await EX.wait(st, 300);
  },
  next(st, strat) {
    const q = st.q;
    if (st.sel == null) { const li = q.left.findIndex((_, i) => st.pairs[i] == null); return li < 0 ? null : { g: 'tap', p: { id: 'L' + li } }; }
    const want = q.right.indexOf(q.left[st.sel]);
    const ri = strat === 'wrong' ? q.right.findIndex((k, i) => i !== want && !Object.values(st.pairs).includes(i)) : want;
    return { g: 'tap', p: { id: 'R' + ri } };
  },
  workEls(st) { return (st.lefts || []).concat(st.rights || []); },
  snap(st) { return { pairs: Object.keys(st.pairs || {}).length }; },
  iconNode() { return Glyph.zh('马', 56); },
};
/* 奥特曼 · 哪个写对了: one is right, the others mirrored / upside down / turned round. A wrong one must LOOK different:
   every variant is compared point by point with the right one and with the others (B upside down is still B, S turned
   round is still S - such a variant is never offered); glyphs turn about their own centre (R1-01, R1-07) */
const Mirror = {
  /* which turns of a glyph clearly look wrong (and unlike each other) - checked by eye, glyph by glyph (R2-01):
     symmetric ones keep only the turn that changes them (A upside down; B, C, D, E mirrored); letters whose turned shape
     is another real letter (M W N P U and the small letters) and characters like 上 / 下 / 车 / 米 are not in the table */
  /* five cards (client 2026-10-10): four wrong ones are needed, so a glyph is asked only when it has four turns that all look
     different - lying on its side (r90 / r270) added to the turns checked by eye; measured point by point (> 4.5 % of the glyph
     apart, tests/test_options.py). Symmetric glyphs (A B C D E K S T V Y Z 羊 火) have only three different turns and are not
     asked any more */
  T: { A: 'flipY', B: 'flipX', C: 'flipX', D: 'flipX', E: 'flipX', F: 'flipX flipY rot r90 r270', G: 'flipX flipY rot r90 r270', J: 'flipX flipY rot r90 r270', K: 'flipX', L: 'flipX flipY rot r90 r270',
       Q: 'flipX flipY rot r90 r270', R: 'flipX flipY rot r90 r270', S: 'flipX', T: 'flipY', V: 'flipY', Y: 'flipY', Z: 'flipX',
       月: 'flipX flipY rot r90 r270', 手: 'flipX flipY r90 r270', 牛: 'flipX flipY rot r90 r270', 石: 'flipX flipY rot r90 r270', 马: 'flipX flipY rot r90 r270', 鸟: 'flipX flipY rot r90 r270', 门: 'flipX flipY rot r90 r270', 灯: 'flipX flipY rot r90 r270', 禾: 'flipX flipY r90 r270', 火: 'flipY', 羊: 'flipY' },
  wrongs(k) { return (this.T[k] || '').split(' ').filter(Boolean); },
  /* the table's turns that REALLY look different from the right one and from each other with the glyph as it is drawn now
     (measured point by point, > 4.5 % of the glyph apart; the letters' shapes follow the writing standard and may change) */
  seen: {},
  clear(k) {
    if (this.seen[k]) return this.seen[k];
    const w = this.wrongs(k); let P;
    try { P = this.pts(k); } catch (e) { return []; }
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]), c = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
    const size = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
    const d = (X, Y) => X.reduce((s, a) => s + Math.min(...Y.map(b => Math.hypot(a[0] - b[0], a[1] - b[1]))), 0) / X.length, far = (A, B) => (d(A, B) + d(B, A)) / 2 / size > 0.045;
    const keep = [['ok', P]];
    w.forEach(t => { const V = this.tf(P, t, c); if (keep.every(([, Q]) => far(V, Q))) keep.push([t, V]); });
    return (this.seen[k] = keep.slice(1).map(x => x[0]));
  },
  css: { ok: '', flipX: 'scaleX(-1)', flipY: 'scaleY(-1)', rot: 'rotate(180deg)', r90: 'rotate(90deg)', r270: 'rotate(-90deg)' },
  pts(k) {
    if (isEn(k)) return LETTERS[k].flatMap(st => Geo.resample(st, 14));
    return Hanzi.data[k].m.flatMap(m => Geo.resample(m.map(([x, y]) => [x, 900 - y]), 14));
  },
  tf(P, t, c) { return P.map(([x, y]) => t === 'flipX' ? [2 * c[0] - x, y] : t === 'flipY' ? [x, 2 * c[1] - y] : t === 'rot' ? [2 * c[0] - x, 2 * c[1] - y] : t === 'r90' ? [c[0] - (y - c[1]), c[1] + (x - c[0])] : t === 'r270' ? [c[0] + (y - c[1]), c[1] - (x - c[0])] : [x, y]); },
};
const QMirror = {
  kind0: 'mirror', verb: '看！', intro: '哪个写对了？', props: [],
  /* five cards: four wrong ones at every level (client 2026-10-10). Levels 1-2: the plain turns (upside down, round, lying on
     its side); from level 3 the mirror image (the hard one) is always among them */
  gen(G, o) {
    const lv = o.level, n = 4, easy = lv <= 2, turns = k => Mirror.clear(k).filter(t => !easy || t !== 'flipX');
    const pool = poolOf(G, 'up', true).concat(poolOf(G, 'zh', true)).filter(k => turns(k).length >= n);
    const glyph = PICK(G, 'g' + lv, pool.length ? pool : ['R', 'F', 'G']), t = turns(glyph);
    const wr = (easy || !t.includes('flipX') ? G.rng.shuffle(t) : ['flipX'].concat(G.rng.shuffle(t.filter(x => x !== 'flipX')))).slice(0, n);
    return { k: [glyph, wr.join()], answer: 'ok', glyph, opts: putAt(G, wr, 'ok'), mirror: wr.includes('flipX') ? 1 : 0 };
  },
  async present(st) {
    const q = st.q, tf = Mirror.css;
    K.cards(st, q.opts.map(t => { const g = Glyph.fit(q.glyph, 120); g.style.transform = tf[t]; return g; }), q.opts, Object.assign({ size: 150, gap: 24 }, this.cardSpot()));
    const it = ITEM[q.glyph];
    if (it.obj) K.task(st, [[OBJURL(it.obj), 'q']]);
    st.lead = isEn(q.glyph) ? it.say : it.line;           /* which one it is about (an A? the 手?) */
    Voice.say(st.lead, { tag: 'prompt' });
    K.say(st, '哪个写对了？');
  },
  cardSpot() { return K.L() ? { cx: 560, cy: 336, cols: 3, size: 150, gap: 24 } : { cx: 352, cy: 580, cols: 3, size: 150, gap: 24 }; },
  place(st) { K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot())); },
  decor(G) { const L = K.L(), a = G.actors.ultraman; if (a) showActor(a, L ? 120 : 600, L ? 690 : 1016, L ? 280 : 200); },
  async reveal(st) { const e = st.cards[st.opts.indexOf('ok')]; K.hop(st, e, 30); Sfx.reveal(); sayItem(st.q.glyph); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); Voice.say(ans === 'flipX' ? '它照镜子啦' : ans === 'r90' || ans === 'r270' ? '它躺下啦' : '它翻跟头啦', { tag: 'wrong' }); await st.scope.wait(900); },
  /* explain: the chosen one (blue ring) turns back the right way round before the child's eyes - it was the same glyph, turned;
     then the right one in a gold ring */
  async explain(st, ans) {
    const q = st.q;
    await EX.cards(st, ans, { pics: false, lines: ['对的是这个', isEn(q.glyph) ? ITEM[q.glyph].say : ITEM[q.glyph].line],
      chosen: async (st2, e) => {
        const g = e && e.querySelector('svg'); if (!g) return;
        await EX.wait(st, 350);
        await st.scope.anim(g, [{ transform: Mirror.css[ans] || 'none' }, { transform: 'none' }], { duration: 650, easing: EASE.glide });      /* turned the right way it is the same glyph */
        g.style.transform = 'none'; st.stepDirty = true; await EX.wait(st, 500); g.style.transform = Mirror.css[ans] || '';      /* turned back: its own beat */
      } });
  },
  iconNode() { const d = el('div'); d.style.display = 'flex'; const a = Glyph.en('R', 44), b = Glyph.en('R', 44); b.style.transform = 'scaleX(-1)'; d.appendChild(a); d.appendChild(b); return d; },
};
/* 变形金刚 · 听英文找东西: which thing did you hear? */
const QListen = {
  kind0: 'listen', verb: '听！', intro: '听英文找东西！', props: [],
  gen(G, o) {
    const lv = o.level, kind = this.lower ? 'lo' : 'up', pool = poolOf(G, kind, true), own = poolOf(G, kind, false), n = 5;      /* five pictures (client 2026-10-10) */
    const answer = PICK(G, 'ans', own);
    /* levels 3+: the island's own words first among the others (the newest, the most alike to the ear) */
    const near = lv >= 3 ? G.rng.shuffle(own.filter(k => k !== answer)) : [], others = near.concat(G.rng.shuffle(pool.filter(k => k !== answer && !near.includes(k)))).filter(k => ITEM[k].obj !== ITEM[answer].obj).slice(0, n - 1);
    return { k: [answer, others.join('')], answer, opts: putAt(G, others, answer) };
  },
  async present(st) {
    const q = st.q;
    K.cards(st, q.opts.map(k => Glyph.obj(ITEM[k].obj)), q.opts, Object.assign({ size: 170, gap: 30, cls: 'pic' }, this.cardSpot()));
    K.task(st, [['speaker', 'q']]);
    st.prompt = ITEM[q.answer].word; st.lead = '听英文';
    Voice.say('听英文', { tag: 'prompt' }); Voice.say(ITEM[q.answer].word, { tag: 'prompt' });
  },
  cardSpot() { return K.L() ? { cx: 512, cy: 400 } : { cx: 352, cy: 560 }; },
  place(st) { K.cardsPlace(st, Object.assign({ gap: 30 }, this.cardSpot())); },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 30); Sfx.reveal(); Voice.say(ITEM[st.q.answer].line, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); if (ITEM[ans]) Voice.say(ITEM[ans].word, { tag: 'wrong' }); await st.scope.wait(900); },
  /* explain: the chosen picture (its word was just said) in blue, the heard one in gold with its letter and word */
  async explain(st, ans) { const a = st.q.answer; await EX.cards(st, ans, { pics: false, lines: ['对的是这张', ITEM[a].word], why: async (st2, e) => { if (e) EX.picOver(st, e, Glyph.en(a, 80), 'right', 96); } }); },
  iconNode() { const d = el('div'); d.innerHTML = ICONS.speaker; d.firstChild.setAttribute('width', 60); d.firstChild.setAttribute('height', 60); return d; },
};
