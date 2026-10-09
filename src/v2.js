/* ================================================================ 字字岛 v2 (docs/PLAN-v2.md, agreed by Opus 5.5, Codex GPT-6
   Astra and Fable 5.1): the map is the syllabus (fixed order, the child's own speed); every character and letter has its own
   memory (7 boxes); review is mixed into every game; the function words come from sentences; story books; a daily key that
   opens the next hero card; a parent who checks without screens. Nothing here caps the day or stops new islands. */

/* ---------------------------------------------------------------- days and memory */
const DAY = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
const IV = [0, 1, 3, 7, 14, 30, 60, 120];                     /* box 1..7 -> days to the next test */
const Mem = {
  get(k) { return Store.s.mem[k] || null; },
  touch(k) {
    const d = DAY(); let m = Store.s.mem[k];
    if (!m) { m = Store.s.mem[k] = { b: 0, due: 0, last: d, up: -1, seen: d, pass: [], n: 0, ok: 0 }; if (ITEM[k] && ITEM[k].kind === 'zh') Mem.today().newK++; }
    return m;
  },
  /* one answer about an item. how: 'ok' (the child's own first try, no help), 'help' (right after the 2nd hint), 'wrong'.
     Only an independent first try on a due (or overdue) day moves a box up - at most once a day; a wrong answer or one
     after the 2nd hint moves it two boxes down (never below 1) and brings it back tomorrow (A.5) */
  answer(k, how, sid) {
    if (!k || !ITEM[k]) return;
    const d = DAY(), m = this.touch(k), gap = d - m.last, wasDue = m.b > 0 && d >= m.due;
    m.n++;
    if (how === 'ok') {
      m.ok++;
      if (sid && !m.pass.includes(sid)) { m.pass.push(sid); if (m.pass.length > 4) m.pass.shift(); }
      if (m.b === 0) { m.b = 1; m.due = d + 1; m.up = d; }
      else if (wasDue && m.up !== d) { m.b = Math.min(7, m.b + 1); m.due = d + IV[m.b]; m.up = d; }
    } else if (m.b > 0) { m.b = Math.max(1, m.b - 2); m.due = d + 1; }
    /* retention evidence: the first test of a due item since it was last met (a real gap, counted once) */
    if (wasDue && gap >= 1 && m.evd !== d) { m.evd = d; const ev = Store.s.ev; ev.push([gap, how === 'ok' ? 1 : 0, d]); if (ev.length > 400) ev.splice(0, ev.length - 400); }
    m.last = d;
    Store.save();
  },
  /* the parent's check: only ever lowers (A.18) */
  parentNo(k) { const m = this.touch(k), d = DAY(); m.b = Math.max(1, Math.min(m.b || 1, 1)); m.due = d + 1; Store.save(); },
  passed(k) { const m = this.get(k); return !!m && m.pass.length >= 2; },
  state(k) {
    const m = this.get(k), d = DAY();
    if (!m) return 'none';
    if (m.b >= 1 && d - m.due > 30) return 'stale';
    if (m.b >= 4) return 'known';
    if (m.b >= 1) return 'learning';
    return 'seen';
  },
  due(kind) { const d = DAY(); return Object.keys(Store.s.mem).filter(k => { const m = Store.s.mem[k]; return m.b > 0 && m.due <= d && ITEM[k] && (!kind || kind(ITEM[k])); }).sort((a, b) => Store.s.mem[a].due - Store.s.mem[b].due); },
  overdue() { const d = DAY(); return Object.keys(Store.s.mem).filter(k => { const m = Store.s.mem[k]; return m.b > 0 && m.due < d && ITEM[k] && ITEM[k].kind === 'zh'; }).length; },
  today() { const d = DAY(), D = Store.s.days; if (!D[d]) { D[d] = { ms: 0, newK: 0, q: 0, keyGo: 0, keyEnd: 0, asked: 0 }; const old = Object.keys(D).map(Number).sort((a, b) => a - b); while (old.length > 60) delete D[old.shift()]; } return D[d]; },
  /* retention over a gap band: [rate, n] (A.21) */
  keep(lo, hi) { const e = Store.s.ev.filter(x => x[0] >= lo && x[0] <= hi); return [e.length ? e.filter(x => x[1]).length / e.length : 0, e.length]; },
  brake() { const [r, n] = this.keep(7, 13); return this.overdue() > 12 || this.today().newK > 8 || (n >= 20 && r < 0.8); },
};

/* ---------------------------------------------------------------- pictures: an object, or a little composed scene */
const Scene = {
  node(spec, size) {
    const d = el('div', 'scene'); Object.assign(d.style, { position: 'relative', width: size + 'px', height: size + 'px' });
    spec.forEach(([o, x, y, k, f]) => { const s = size * k, i = img(OBJURL(o), '', d); Object.assign(i.style, { position: 'absolute', width: s + 'px', height: s + 'px', left: (x * size - s / 2) + 'px', top: (y * size - s / 2) + 'px', objectFit: 'contain', pointerEvents: 'none' }); if (f) i.style.filter = f; });      /* f: a CSS filter (a red bird for a distractor) */
    return d;
  },
  /* the picture of an item: its object, or (a function word) the scene of its first sentence */
  of(k, size) { const it = ITEM[k]; if (it && it.obj) { const i = img(OBJURL(it.obj), ''); Object.assign(i.style, { width: size + 'px', height: size + 'px', objectFit: 'contain' }); return i; } const s = FW_SENTS[k]; return s ? this.node(s[0][1], size) : Glyph.any(k, size * 0.8); },
};
/* a sentence as a row of glyphs (the missing one a dashed box); every glyph a tap target when asked for */
const Sent = {
  node(text, h, blankAt, onTap) {
    const row = el('div', 'sent'); Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: Math.round(h * 0.06) + 'px', background: 'rgba(255,255,255,.94)', borderRadius: '22px', padding: '10px 18px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25)' });
    Array.from(text).forEach((c, i) => {
      if (/[。！？，]/.test(c)) { const p = el('span', '', row); p.textContent = c; Object.assign(p.style, { font: '900 ' + Math.round(h * 0.7) + 'px system-ui,sans-serif', color: INK }); return; }
      const cell = el('div', '', row); Object.assign(cell.style, { position: 'relative', width: h + 'px', height: h + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center' });
      if (i === blankAt) { Object.assign(cell.style, { border: '5px dashed #2B2118', borderRadius: '14px', background: '#FFF7D6' }); cell.dataset.blank = '1'; }
      else { cell.appendChild(Glyph.zh(c, h * 0.92)); if (onTap) { cell.dataset.ch = c; cell.style.cursor = 'pointer'; } }
    });
    return row;
  },
};

/* ---------------------------------------------------------------- the review question (a card question about one item):
   "老朋友来了！" - asked by this island's host on this island's background, never in an old scene (A.6) */
const ReviewQ = Object.assign({}, ZBase, {
  id: 'review', kind0: 'review', verb: '找！', chars: [], review: true,
  gen(G, o) {
    const k = o.item, kind = ITEM[k].kind, lv = clamp(o.level || 2, 1, 5), n = lv <= 2 ? 3 : 4;
    const known = ITEMS.filter(x => x.kind === kind && x.k !== k && (Mem.get(x.k) || learned(x.k))).map(x => x.k);
    const look = ((kind === 'zh' ? LOOK : LOOKEN)[k] || '').split('').filter(x => known.includes(x) && !(HOLDS[k] || '').includes(x));
    const pool = known.filter(x => !(HOLDS[k] || '').includes(x));
    const pickFrom = G.rng.shuffle(look).concat(G.rng.shuffle(pool));
    let others = pickFrom.filter((x, i) => pickFrom.indexOf(x) === i).slice(0, n - 1);
    if (others.length < n - 1) { const more = G.rng.shuffle(ITEMS.filter(x => x.kind === kind && x.k !== k && !others.includes(x.k)).map(x => x.k)); others = others.concat(more.slice(0, n - 1 - others.length)); }
    const opts = G.rng.shuffle(others); opts.splice(G.rng.int(0, opts.length), 0, k);
    return { k: ['rv', k, opts.join('')], answer: k, opts };
  },
  itemOf(st) { return st.q.answer; },
  async present(st) {
    const q = st.q, G = st.G, L = K.L();
    if (st.missQ) Voice.say('再来一个！', { tag: 'prompt' }); else if (!G.rvSaid && !G.key) { G.rvSaid = true; Voice.say('老朋友来了！', { tag: 'prompt' }); }
    K.cards(st, q.opts.map(k => Glyph.any(k, 110)), q.opts, Object.assign({ size: 160, gap: 30 }, L ? { cx: 560, cy: 470 } : { cx: 352, cy: 700 }));
    st.taskEl = K.task(st, [['speaker', 'q']]);
    if (isEn(q.answer)) { st.prompt = '找字母'; st.tail = [ITEM[q.answer].say]; Voice.say('找字母', { tag: 'prompt' }); Voice.say(ITEM[q.answer].say, { tag: 'prompt' }); }
    else K.say(st, '哪个是' + q.answer + '？');
  },
  place(st) { const L = K.L(); K.cardsPlace(st, Object.assign({ gap: 30 }, L ? { cx: 560, cy: 470 } : { cx: 352, cy: 700 })); },
  relayoutQ(st) { this.place(st); },
  async reveal(st) { const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 30); Sfx.reveal(); sayItem(st.q.answer); await st.scope.guard(Voice.afterSay(200)); },
  gestureHint(st) {
    if (st.picShown || !st.taskEl) return; st.picShown = true;
    /* a function word has no picture of its own (its sentence's scene is a thing - 了 = a fire - and that thing can be an option): its sentence is said (V2R2-03) */
    if (ITEM[st.q.answer] && ITEM[st.q.answer].fw && FW_SENTS[st.q.answer]) { Voice.say(FW_SENTS[st.q.answer][0][0], { tag: 'prompt' }); return; }
    const it = st.taskEl.querySelector('.it'); const p = Scene.of(st.q.answer, 54); it.replaceChild(p, it.firstChild); Sfx.sparkle();
  },
});

/* ---------------------------------------------------------------- 补句子 (the sentence islands' 认字): the host says the whole
   sentence; the card shows it with the function word missing; pick it (3 or 4 function words / look-alikes) */
const QFill = {
  kind0: 'fill', verb: '补！', intro: '把字补上！', props: [], softHint: true,
  decor(G) { if (!K.L()) { this.chars.forEach(id => hideActor(G.actors[id])); return; } ZBase.decor.call(this, G); },
  gen(G, o) {
    const lv = o.level, pool = poolOf(G, 'zh', false), answer = needPick(G, pool);      /* still to pass first, at most twice (W3R1-02) */
    const kn = knownZh(G), more = (FW_SENTS3[answer] || []).filter(x => Array.from(x[0]).every(c => /[。！？，]/.test(c) || c === answer || kn.includes(c)));      /* phase 2: once its other characters are known */
    const s = !Store.s.met[answer] ? FW_SENTS[answer][0] : G.rng.pick(FW_SENTS[answer].concat(more)), n = lv <= 2 ? 3 : 4;
    const fws = ITEMS.filter(x => x.fw && x.k !== answer && (x.isl === G.world || Store.s.mem[x.k] || ISL[x.isl].i < G.W.i && ISL[x.isl].w === G.W.w)).map(x => x.k);
    const others = G.rng.shuffle(fws.filter(k => !s[0].includes(k))).slice(0, n - 1);
    const opts = G.rng.shuffle(others); opts.splice(G.rng.int(0, opts.length), 0, answer);
    return { k: [answer, s[0], opts.join('')], answer, text: s[0], scene: s[1], blank: s[0].indexOf(answer), opts };
  },
  itemOf(st) { return st.q.answer; },
  async present(st) {
    const q = st.q, L = K.L();
    const met = await ZX.meetFw(st, q.answer);
    if (!Session.alive(st)) return;
    const pic = st.pic = ZX.thing(st, 300, 300, 6, 'objpop'); Object.assign(pic.style, { background: '#fff', borderRadius: '26px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25)' }); pic.appendChild(Scene.node(q.scene, 300));
    const row = st.row = ZX.thing(st, 10, 10, 7, ''); row.style.width = row.style.height = 'auto'; row.appendChild(Sent.node(q.text, L ? 92 : 84, q.blank));
    K.cards(st, q.opts.map(k => Glyph.zh(k, 104)), q.opts, Object.assign({ size: 150, gap: 30 }, this.cardSpot()));
    this.place(st);
    K.pop(st, pic); K.pop(st, row, 120);
    st.prompt = q.text; if (!met) Voice.say(q.text, { tag: 'prompt' });
  },
  cardSpot() { return K.L() ? { cx: 600, cy: 590 } : { cx: 352, cy: 900 }; },
  place(st) {
    const L = K.L();
    if (st.pic) place(st.pic, L ? 250 : 202, L ? 40 : 150, 300, 300);
    if (st.row) { const r = st.row.firstChild.getBoundingClientRect(), s = Stage.scale || 1, w = r.width / s; place(st.row, Math.round((L ? 600 : 352) - w / 2), L ? 360 : 500); st.row.style.width = 'auto'; st.row.style.height = 'auto'; }
    K.cardsPlace(st, Object.assign({ gap: 30 }, this.cardSpot()));
  },
  async reveal(st) {
    const e = st.cards[st.opts.indexOf(st.q.answer)]; K.hop(st, e, 30); Sfx.reveal();
    const b = st.row && st.row.querySelector('[data-blank]'); if (b) { b.style.border = '0'; b.style.background = '#FFF3C4'; b.appendChild(Glyph.zh(st.q.answer, b.offsetWidth * 0.92 || 80)); }
    Voice.say(st.q.text, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200));
  },
  gestureHint(st) { if (st.hintDone) return; st.hintDone = true; Voice.say(st.q.text, { tag: 'prompt' }); if (st.row) K.hop(st, st.row, 16); },
};

/* ---------------------------------------------------------------- 读一读: read silently, tap the picture it says. The sentence is
   never read first (that would be listening); a tap on a character says it, but that question then gives no star (A.3) */
const QReadS = {
  kind0: 'reads', verb: '读！', intro: '读一读！', props: [], softHint: true,
  gen(G, o) {
    const known = G.knownZh || knownZh(G), ok = READ.filter(r => Array.from(r[0]).every(c => /[。！？，]/.test(c) || known.includes(c)));
    const r = PICK(G, 'read', ok.length ? ok : READ.slice(0, 3));
    const opts = [0, 1, 2], order = G.rng.shuffle(opts.slice());
    return { k: ['rd', r[0], order.join('')], answer: order.indexOf(0), text: r[0], scenes: order.map(i => i === 0 ? r[1] : r[2][i - 1]), opts: [0, 1, 2] };
  },
  itemOf() { return null; },
  itemsOf(st) { const own = st.G.W ? st.G.W.chars.map(c => c.c) : []; return Array.from(st.q.text).filter((c, i, a) => own.includes(c) && a.indexOf(c) === i); },
  async present(st) {
    const q = st.q, L = K.L(), size = L ? 230 : 200;
    st.peeked = false;
    const row = st.row = ZX.thing(st, 10, 10, 7, ''); row.style.width = row.style.height = 'auto';
    row.appendChild(Sent.node(q.text, L ? 96 : 88, -1, true));
    $$('[data-ch]', row).forEach((cell, i) => { K.reg(st, 'ch' + i, cell, {}); cell.dataset.gid = 'ch' + i; cell.style.pointerEvents = 'auto'; });     /* the row is a picture (no taps), its characters are targets */
    st.cards = q.scenes.map((sc, i) => { const d = ZX.thing(st, size, size, 6, 'card'); d.appendChild(Scene.node(sc, size)); K.reg(st, 'card' + i, d, {}); K.pop(st, d, 80 * i); return d; });
    st.opts = q.opts.slice();
    this.place(st); K.pop(st, row);
    st.taskEl = K.task(st, [['eye', 'q']]);
    st.prompt = '读一读！'; if (!st.G.rdSaid && st.G.game.kind0 !== 'reads') { st.G.rdSaid = true; Voice.say('读一读！', { tag: 'prompt' }); }
  },
  onGesture(st, name, p) {
    if (name !== 'tap') return false;
    if (/^ch\d+$/.test(p.id || '')) { const cell = st.map[p.id]; if (cell) { st.peeked = true; st.noStar = true; Voice.sayNow(ITEM[cell.dataset.ch] ? ITEM[cell.dataset.ch].line : cell.dataset.ch, { tag: 'peek' }); K.hop(st, cell, 10); } return 'ok'; }
    return ZBase.onGesture.call(this, st, name, p);
  },
  place(st) {
    const L = K.L(), size = L ? 230 : 210, n = st.cards ? st.cards.length : 3;
    if (st.row) { const r = st.row.firstChild.getBoundingClientRect(), s = Stage.scale || 1, w = r.width / s; place(st.row, Math.round((L ? 560 : 352) - w / 2), L ? 120 : 250); st.row.style.width = 'auto'; st.row.style.height = 'auto'; }
    /* landscape: one row of three; portrait: two, and one centred below */
    (st.cards || []).forEach((c, i) => {
      if (L) place(c, 560 - (n * size + (n - 1) * 30) / 2 + i * (size + 30), 330, size, size);
      else place(c, i === 2 ? 352 - size / 2 : (i === 0 ? 352 - size - 14 : 352 + 14), i === 2 ? 410 + size + 26 : 410, size, size);
    });
  },
  relayoutQ(st) { this.place(st); },
  async reveal(st) { const e = st.cards[st.q.answer]; K.hop(st, e, 30); Sfx.reveal(); Voice.say(st.q.text, { tag: 'summary' }); this.cheerAll(st); await st.scope.guard(Voice.afterSay(200)); },
  async feedback(st) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); await st.scope.wait(700); },
  gestureHint(st) {
    if (st.hintDone || !st.row) return; st.hintDone = true;
    $$('[data-ch]', st.row).forEach(cell => K.hop(st, cell, 10));
    Voice.say('可以点字听听！', { tag: 'prompt' });
  },
};
function knownZh(G) { return poolOf(G, 'zh', true).concat(ITEMS.filter(x => x.kind === 'zh' && (Mem.get(x.k) || learned(x.k))).map(x => x.k)); }

/* "字从句里来": a function word met for the first time - its sentence and picture, then the word lights up and is said */
ZX.meetFw = async function (st, k) {
  if (Store.s.met[k] || !FW_SENTS[k]) return;
  Store.s.met[k] = true; Store.save();
  const L = K.L(), sc = st.scope, s = FW_SENTS[k][0], x = Stage.W / 2, y = L ? Stage.H * 0.42 : Stage.H * 0.4;
  const veil = this.thing(st, Stage.W, Stage.H, 34, ''); Object.assign(veil.style, { background: 'rgba(255,248,236,.9)' }); place(veil, 0, 0, Stage.W, Stage.H);
  const pic = this.thing(st, 320, 320, 35, 'objpop'); pic.appendChild(Scene.node(s[1], 320)); place(pic, x - 160, y - 300, 320, 320);
  const row = this.thing(st, 10, 10, 36, ''); row.style.width = row.style.height = 'auto'; row.appendChild(Sent.node(s[0], 96, -1)); place(row, 0, y + 40);
  const w = row.firstChild.getBoundingClientRect().width / (Stage.scale || 1); place(row, x - w / 2, y + 40); row.style.width = row.style.height = 'auto';
  sc.anim(veil, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
  await sc.anim(pic, [{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, easing: EASE.pop });
  Voice.say(s[0], { tag: 'meet' });
  await sc.guard(Voice.afterSay(300));
  if (sc.dead) return;
  const cells = Array.from(row.firstChild.children).filter(c => c.firstChild && c.firstChild.tagName);
  const i = Array.from(s[0]).filter(c => !/[。！？，]/.test(c)).indexOf(k), cell = cells[i];
  if (cell) { cell.style.background = '#FFE08A'; cell.style.borderRadius = '14px'; cell.style.boxShadow = '0 0 0 5px #FF9F43'; sc.anim(cell, [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 700, easing: EASE.pop }); }
  Sfx.sparkle(); sayItem(k, { tag: 'meet' });
  await sc.guard(Voice.afterSay(400)); await sc.wait(300);
  sc.anim(veil, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
  await sc.anim(row, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
  veil.remove(); pic.remove(); row.remove();
  return true;
};

/* ---------------------------------------------------------------- the sentence islands' four games */
const CASTS2 = { s1: ['ironman', 'spiderman'], s2: ['captain', 'miles'] };
['s1', 's2'].forEach(id => {
  const W = ISL[id], cast = CASTS2[id], host = cast[0], first = W.chars[0].c;
  zGame(QFill, { id: id + ':find', world: id, bg: id + '_find', chars: cast, host, title: '补句子', iconNode: () => Glyph.zh(first, 60) });
  writeGame({ id: id + ':write', world: id, lang: 'zh', bg: id + '_write', chars: cast.slice(0, 1), host, title: '写字', intro: '写一写！', iconNode: () => Glyph.zh(first, 60, '#E8414B'), decor: writeDecor });
  /* no new letters here: the capitals of world 1 come back as old friends, the most due first */
  writeGame({ id: id + ':abc', world: id, lang: 'up', bg: id + '_abc', chars: cast.slice(0, 1), host, title: '写字母', verb: 'ABC', intro: '写字母啦！', iconNode: () => Glyph.en('A', 60, '#2E6FD8'), decor: writeDecor,
    gen(G) { const ups = ITEMS.filter(x => x.kind === 'up' && x.isl).map(x => x.k), due = Mem.due(it => it.kind === 'up').filter(k => !(G.used || []).includes(k)); const k = due[0] || PICK(G, 'up', ups); (G.used = G.used || []).push(k); return { k: [k], answer: k }; } });
  zGame(QReadS, { id: id + ':quiz', world: id, bg: id + '_quiz', chars: cast, host, title: '读一读', boost: 0, iconNode: () => { const d = el('div'); d.innerHTML = ICONS.eye; const s = d.firstChild; s.setAttribute('width', '80%'); s.setAttribute('height', '80%'); Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }); return d; } });
  W.games = [id + ':find', id + ':write', id + ':abc', id + ':quiz'];
});

/* ---------------------------------------------------------------- the review planner: how many review questions a session gets
   and which (A.7-A.9): 1-2 by what is due, 3 while the brake is on; never filler from items not due; the missed queue
   asks a wrong item again 2 questions later in another form */
const Review = {
  plan(G) {
    if (G.practice || G.key || (G.game && G.game.ownReview)) return { pos: [] };      /* world 3's writing plans its own old friend */
    const due = Mem.due().length;
    let n = due === 0 ? 0 : due <= 3 ? 1 : 2;
    if (Mem.brake() && due) n = Math.min(3, due);
    n = Math.min(n, Math.max(0, (G.rounds || 5) - (G.needPass || []).length));
    return { pos: [1, 3, 4].slice(0, n) };
  },
  fits(G, k) {
    const it = ITEM[k], g = G.game;
    if (g.kind0 === 'write') return g.lang === 'zh' ? it.kind === 'zh' && !NOWRITE.includes(k) : it.kind === g.lang;
    return true;
  },
  /* the question for this round, or null (an island question) */
  slot(G) {
    if (G.practice) return null;
    if (G.key) { const k = (G.keyItems || [])[G.round]; return k ? { k, form: 'card' } : null; }
    const g = G.game, used = G.rvUsed || (G.rvUsed = []);
    if (G.wfMode === 2) { const form = G.round % 2 ? 'trace' : 'card', its = G.W.chars.map(c => c.c).filter(c => form === 'card' || !NOWRITE.includes(c)), need = its.filter(k => !used.includes(k)); const k = need[0] || G.rng.pick(its); used.push(k); return { k, form, wf: true }; }
    const miss = (G.miss || []).find(m => m.at <= G.round && !m.done);
    if (miss && g.kind0 !== 'write') { miss.done = true; return { k: miss.k, form: 'card', miss: true }; }
    if (!G.rv || !G.rv.pos.includes(G.round)) return null;
    const cand = Mem.due().filter(k => !used.includes(k) && this.fits(G, k) && !poolOf(G, ITEM[k].kind === 'zh' ? 'zh' : 'en', false).includes(k));
    const k = cand[0]; if (!k) return null;
    used.push(k);
    if (g.kind0 === 'write') return { k, form: 'write' };
    if (g.kind0 === 'find' && ITEM[k].kind === 'zh' && !ITEM[k].fw && g.lang !== 'up') return { k, form: 'find' };
    /* after the sentence islands, a challenge game's first review slot is a sentence to read (A.3) */
    if (!G.rdUsed && g.kind0 !== 'find' && G.rv.pos.length >= 2 && G.round === G.rv.pos[1] && ALL_ISL().indexOf(G.world) > ALL_ISL().indexOf('s2') && ALL_ISL().indexOf(G.world) % 2 === 0) { G.rdUsed = true; used.pop(); return { k: null, form: 'read' }; }
    return { k, form: 'card' };
  },
  /* the game's own question as a frame for a review question: whatever its draw took from the bags (the island's
     characters still to pass), the session's seen keys and the last key all go back (V2R2-01) */
  frame(G) {
    const bags = {}, B = G.bags || {}; Object.keys(B).forEach(n => { bags[n] = B[n].slice(); });
    const seen = G.seenKeys ? new Set(G.seenKeys) : null, last = G.ws.lastKey, asked = (G.asked || []).slice();
    const st = Session.newQ(G, {});
    G.bags = bags; if (seen) G.seenKeys = seen; else delete G.seenKeys; G.ws.lastKey = last; G.asked = asked;
    return st;
  },
  /* a question state for a review slot (the game's own frame where it fits; otherwise the review card) */
  newQ(G, rv) {
    const S = Session;
    if (rv.k || rv.form === 'read') (G.asked || (G.asked = [])).push(rv.k || null);       /* frame() put back what the frame asked */
    if (rv.form === 'find' || rv.form === 'write' || rv.form === 'trace') {
      const st = this.frame(G);
      if (rv.form === 'find') { const opts = optsFor(G, 'zh', G.level, st.q.opts.length, rv.k); st.q = { k: [rv.k, opts.join('')], answer: rv.k, opts }; }
      else st.q = { k: [rv.k], answer: rv.k };
      st.review = true;
      if (rv.form === 'trace') { st.level = 1; st.noStar = true; st.wf = true; st.tracing = true; }          /* tracing practice: no star, no pass, no box (A.4) */
      return st;
    }
    /* built like every game (GameBase + ZBase): evaluate, cleanup, the card taps */
    const game = Object.assign(Object.create(GameBase), ZBase, rv.form === 'read' ? QReadS : ReviewQ, { chars: G.game.chars, host: G.game.host, id: rv.form === 'read' ? 'read' : 'review' });
    const st = this.frame(G);
    st.game = game; st.kind = game.kind0; st.review = true; st.wf = !!rv.wf; st.missQ = !!rv.miss;
    st.q = game.gen(G, { level: G.level, rng: G.rng, item: rv.k });
    return st;
  },
};

/* ---------------------------------------------------------------- the writing fallback (A.4): three characters in a row
   without their star on this island -> the tracing level (full demo, start dot, arrows: built-in guides, not help);
   three more there -> this game's remaining stars come from reading tasks about the same characters. This island only. */
const WriteFallback = {
  start(G) {
    if (G.practice || G.game.kind0 !== 'write' || G.game.lang !== 'zh') return;
    const wf = G.ws.wf || (G.ws.wf = { s: 0, m: 0 });
    if (Store.s.settings.wgate) { G.wfMode = 2; return; }
    G.wfMode = wf.m;
    if (wf.m >= 1) G.level = 1;
  },
  after(G, st, res) {
    if (G.practice || G.game.kind0 !== 'write' || G.game.lang !== 'zh' || st.review && !st.wf) return;
    const wf = G.ws.wf || (G.ws.wf = { s: 0, m: 0 });
    if (st.wf) return;
    if (res === 'ok' && !helped(st)) { wf.s = 0; Store.s.stat.clean++; }
    else if (res === 'ok') { wf.s++; }
    else if (res === 'wrong') { wf.s++; if (wf.s >= 3 && wf.m < 2) { wf.m++; wf.s = 0; Store.s.stat.wfDown++; if (wf.m === 1) G.level = 1; else G.wfMode = 2; } }
    Store.save();
  },
};

/* ---------------------------------------------------------------- story books: one after each sentence island; six pages, one
   sentence each; a tap on a character says it, the speaker reads the page (bedtime: read it to a parent) */
const Books = {
  open() { return BOOKS.filter(b => flagged(b.after) || Store.s.all); },
  show(id) {
    const b = BOOKS.find(x => x.id === id); if (!b) return;
    let pg = 0;
    const ov = el('div', 'storyov', document.body); ov.id = 'story';
    Object.assign(ov.style, { position: 'fixed', inset: 0, zIndex: 60, background: 'linear-gradient(#FFF6E2,#FFE9C2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px' });
    const page = el('div', '', ov), bar = el('div', '', ov);
    Object.assign(bar.style, { display: 'flex', gap: '28px', alignItems: 'center' });
    const mk = (icon, fn, lbl) => { const bt = el('button', 'btn', bar); bt.setAttribute('aria-label', lbl); Object.assign(bt.style, { position: 'relative', width: '96px', height: '96px', background: '#fff' }); bt.innerHTML = icon; tapify(bt, fn); return bt; };
    const close = () => { ov.remove(); Voice.hush('leave'); };
    const home = el('button', 'btn', ov); Object.assign(home.style, { position: 'absolute', left: 'calc(14px + var(--sl))', top: 'calc(14px + var(--st))', width: '96px', height: '96px', background: '#FFE08A' }); img('assets/props/ui_home.png', '', home).style.width = '74%'; tapify(home, close);
    const render = () => {
      page.innerHTML = '';
      const [text, sc] = b.pages[pg], vw = window.innerWidth, vh = window.innerHeight, S = Math.min(vw * 0.8, vh * 0.5);
      const t = el('div', '', page); t.textContent = b.title + ' · ' + (pg + 1) + ' / ' + b.pages.length; Object.assign(t.style, { font: '800 22px system-ui,sans-serif', color: '#8A6A3A', textAlign: 'center', marginBottom: '8px' });
      const card = el('div', '', page); Object.assign(card.style, { background: '#fff', borderRadius: '28px', boxShadow: '0 0 0 5px #2B2118, 0 10px 0 rgba(43,33,24,.25)', padding: '10px', display: 'flex', justifyContent: 'center' }); card.appendChild(Scene.node(sc, S));
      const row = Sent.node(text, Math.min(96, vw / (text.length + 2)), -1, true); row.style.margin = '22px auto 0'; row.style.width = 'fit-content'; page.appendChild(row);
      $$('[data-ch]', row).forEach(c => tapify(c, () => { const it = ITEM[c.dataset.ch]; Voice.sayNow(it ? it.line : c.dataset.ch, { tag: 'story' }); c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 300 }); }));
    };
    mk('<svg viewBox="0 0 40 40" width="60%" height="60%"><path d="M26 6L12 20L26 34" fill="none" stroke="#2B2118" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>', () => { if (pg > 0) { pg--; render(); } }, '上一页');
    mk(ICONS.speaker || '<svg viewBox="0 0 40 40" width="60%" height="60%"><path d="M6 15h8l9-7v24l-9-7H6z" fill="#2E6FD8" stroke="#2B2118" stroke-width="3"/></svg>', () => Voice.sayNow(b.pages[pg][0], { tag: 'story' }), '读这一页');
    mk('<svg viewBox="0 0 40 40" width="60%" height="60%"><path d="M14 6L28 20L14 34" fill="none" stroke="#2B2118" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>', () => { if (pg < b.pages.length - 1) { pg++; render(); } else close(); }, '下一页');
    render();
    Voice.sayNow(b.title, { tag: 'story' });
  },
  shelf() {
    const list = this.open();
    const ov = el('div', '', document.body); ov.id = 'shelf';
    Object.assign(ov.style, { position: 'fixed', inset: 0, zIndex: 55, background: 'rgba(12,44,74,.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '36px', flexWrap: 'wrap' });
    tapify(ov, () => ov.remove(), { silent: true });
    BOOKS.forEach(b => {
      const on = list.includes(b), c = el('div', 'btn', ov);
      Object.assign(c.style, { position: 'relative', width: '220px', height: '260px', background: on ? '#FFF6E2' : 'rgba(255,255,255,.4)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' });
      const sc = Scene.node(b.cover || b.pages[0][1], 150); if (!on) sc.style.filter = 'grayscale(1) brightness(.6)'; c.appendChild(sc);
      const t = el('div', '', c); t.textContent = b.title; Object.assign(t.style, { font: '900 30px system-ui,sans-serif', color: INK });
      tapify(c, () => { if (!on) { Voice.sayNow('插了旗就能读', { tag: 'map' }); return; } ov.remove(); this.show(b.id); });
    });
    Voice.sayNow('故事书', { tag: 'map' });
  },
};

/* ---------------------------------------------------------------- the daily key and the hero cards (A.13): the first visit of
   a day: "找回老朋友" (up to 5 due items, ~2 min; skippable; none due -> the key at once) -> the key opens the next card of
   one fixed order. A flag also turns one card. No chance, no streak, nothing lost by missing a day. */
const CARDS = ['ultraman', 'optimus', 'ironman', 'spiderman', 'captain', 'bumblebee', 'zero', 'hulk', 'thor', 'wukong', 'panther', 'miles',
  'gourd1', 'gourd2', 'gourd3', 'gourd4', 'gourd5', 'gourd6', 'gourd7', 'catboy', 'owlette', 'gekko', 'widow', 'hawkeye',
  'chase', 'marshall', 'rubble', 'ryder', 'bajie', 'shaseng', 'dragon_horse', 'peppa', 'george', 'bluey', 'bingo', 'kaiju1'];
const Keys = {
  avail() { const k = Store.s.key; return k.day !== DAY(); },
  /* the key round: the most overdue items first (A.13); a long break -> the first day back is free */
  start() {
    { const S = Store.s, d = DAY(), quits = [d, d - 1, d - 2].map(x => S.days[x]).filter(Boolean).reduce((a, x) => a + Math.max(0, x.keyGo - x.keyEnd), 0); if (quits >= 2 && !S.key.short) { S.key.short = true; Store.save(); } }     /* V2R3-03 */
    /* the characters first, letters after (the key is for 认字 first, V2R3-06) - each group most overdue first */
    const all = Mem.due(), due = all.filter(k => ITEM[k] && ITEM[k].kind === 'zh').concat(all.filter(k => !ITEM[k] || ITEM[k].kind !== 'zh'));
    const k = Store.s.key, n = Math.min(Store.s.key.short ? 3 : 5, due.length), gap = Store.s.lastDay ? DAY() - Store.s.lastDay : 0;
    if (!n || gap > 7) { this.grant('free'); return; }
    const isl = MapView.recommend && ISL[MapView.recommend()] ? MapView.recommend() : ORDER.w1[0];
    const id = isl + ':find';
    Mem.today().keyGo++; Store.save();
    Session.start(isl, id, { key: true, keyItems: due.slice(0, n) });
    void k;
  },
  grant(why) {
    const k = Store.s.key; k.day = DAY(); k.got = (k.got || 0) + 1; Store.save();
    this.turn('key');
    void why;
  },
  /* one more card (key / flag); shows it */
  turn(src) {
    const a = Store.s.album;
    /* all 36 out: the key opens the album; a flag says so (V2R2-08) */
    if (a.n >= CARDS.length) { if (!fast() && src === 'key') this.album(); else if (src === 'flag') Voice.say('卡册满啦！', { tag: 'card' }); return Promise.resolve(); }
    a.n++; a.src.push(src); Store.save();
    return this.reveal(CARDS[a.n - 1]);
  },
  reveal(id) {
    const ov = el('div', '', document.body);
    Object.assign(ov.style, { position: 'fixed', inset: 0, zIndex: 70, background: 'radial-gradient(circle,#FFF6C8 0%,#FFC93C 45%,#E8862E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' });
    const c = el('div', '', ov); Object.assign(c.style, { width: '300px', height: '400px', borderRadius: '28px', background: '#fff', boxShadow: '0 0 0 6px #2B2118, 0 0 0 16px #FFE08A, 0 20px 50px rgba(0,0,0,.35)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' });
    const im = img('assets/chars/' + id + '.png', '', c); Object.assign(im.style, { height: '92%', objectFit: 'contain' });
    c.animate([{ transform: 'rotateY(90deg) scale(.4)' }, { transform: 'rotateY(0) scale(1.08)', offset: 0.7 }, { transform: 'rotateY(0) scale(1)' }], { duration: T(900) + 1, easing: EASE.pop });
    Sfx.fanfare(); Fx.confetti(40); Voice.sayNow('新朋友来啦！', { tag: 'card' });
    /* resolves when the card is gone (V2R2-02: the flag waits for it, so the next island opens in plain view) */
    return new Promise(res => {
      const off = () => { if (ov.isConnected) { ov.remove(); MapView.update(); } res(); };
      tapify(ov, off);
      setTimeout(off, T(3600) + 200);
    });
  },
  album() {
    const ov = el('div', '', document.body); ov.id = 'album';
    Object.assign(ov.style, { position: 'fixed', inset: 0, zIndex: 55, background: 'linear-gradient(#2B3E8C,#4B2F9E)', overflowY: 'auto', padding: '110px 20px 40px', boxSizing: 'border-box' });
    const home = el('button', 'btn', ov); Object.assign(home.style, { position: 'fixed', left: 'calc(14px + var(--sl))', top: 'calc(14px + var(--st))', width: '96px', height: '96px', background: '#FFE08A' }); img('assets/props/ui_home.png', '', home).style.width = '74%'; tapify(home, () => ov.remove());
    if (this.avail()) {
      const go = el('button', 'btn', ov); Object.assign(go.style, { position: 'fixed', right: 'calc(14px + var(--sr))', top: 'calc(14px + var(--st))', width: '140px', height: '96px', background: '#5CC46E' });
      img('assets/props/chest.png', '', go).style.height = '80%';
      tapify(go, () => { ov.remove(); this.start(); });
      go.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 1200, iterations: Infinity });
    }
    const grid = el('div', '', ov); Object.assign(grid.style, { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '16px', maxWidth: '980px', margin: '0 auto' });
    const n = Store.s.album.n;
    CARDS.forEach((id, i) => {
      const c = el('div', '', grid); Object.assign(c.style, { height: '160px', borderRadius: '18px', background: i < n ? '#fff' : 'rgba(255,255,255,.18)', boxShadow: '0 0 0 3px #2B2118', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', position: 'relative' });
      if (i <= n) { const im = img('assets/chars/' + id + '.png', '', c); Object.assign(im.style, { height: '90%', objectFit: 'contain', filter: i < n ? '' : 'brightness(0) opacity(.55)' }); }
      else { const q = el('div', '', c); q.textContent = '?'; Object.assign(q.style, { font: '900 64px system-ui,sans-serif', color: 'rgba(255,255,255,.5)', alignSelf: 'center' }); }
    });
    Voice.sayNow(this.avail() ? '找回老朋友！' : '我的英雄卡！', { tag: 'map' });
  },
};

/* ---------------------------------------------------------------- "停船还是继续": after about 15 minutes today (A.16) -
   a ritual, not a gate: continuing works exactly as before */
const StopGo = {
  maybe() {
    const mins = Store.s.settings.mins, D = Mem.today();
    if (!mins || D.asked || D.ms < mins * 60000 || fast()) return false;
    D.asked = 1; Store.save();
    const ov = el('div', '', $('#map'));
    Object.assign(ov.style, { position: 'absolute', inset: 0, zIndex: 45, background: 'rgba(12,44,74,.66)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px' });
    const host = ISL[MapView.recommend()] ? ISL[MapView.recommend()].host : 'peppa';
    const h = img('assets/chars/' + host + '.png', '', ov); h.style.height = '260px';
    const mk = (svg, fn) => { const b = el('button', 'btn', ov); Object.assign(b.style, { position: 'relative', width: '170px', height: '170px', background: '#fff' }); b.innerHTML = svg; tapify(b, fn); return b; };
    mk('<svg viewBox="0 0 60 60" width="80%" height="80%"><path d="M8 40h44l-6 10H14z" fill="#E8862E" stroke="#2B2118" stroke-width="3"/><path d="M30 8v30M30 10l16 24H30" fill="#fff" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/></svg>', () => { ov.remove(); Voice.sayNow('明天见！', { tag: 'map' }); });
    mk('<svg viewBox="0 0 60 60" width="70%" height="70%"><path d="M18 10L48 30L18 50Z" fill="#5CC46E" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/></svg>', () => { ov.remove(); MapView.after(T(300)); });
    Voice.sayNow('停船还是继续？', { tag: 'map' });
    return true;
  },
};

/* ---------------------------------------------------------------- the progress report for Opus, the save's export / import */
const Report = {
  text() {
    const S = Store.s, d = DAY(), st = k => Mem.state(k), zh = ITEMS.filter(i => i.kind === 'zh');
    const cnt = s => ITEMS.filter(i => st(i.k) === s).map(i => i.k).join('');
    const weak = Object.keys(S.mem).filter(k => S.mem[k].n >= 2 && S.mem[k].ok / S.mem[k].n < 0.6).join('');
    const days = Object.keys(S.days).map(Number).filter(x => x > d - 7).map(x => Math.round(S.days[x].ms / 60000) + '分').join(' ');
    const [r7, n7] = Mem.keep(7, 13), [r30, n30] = Mem.keep(30, 59);
    const where = ALL_ISL().filter(id => Store.w(id).unlocked).slice(-1)[0];
    return ['字字岛进度报告（' + new Date().toLocaleDateString() + '，版本 ' + (window.__ver || document.lastModified || '') + '）',
      '位置：' + (where ? ISL[where].name + '（' + WORLDS_INFO[ISL[where].w].name + '）' : '-') + '；旗子 ' + S.flags.length + ' 面；已装世界 ' + Object.keys(ORDER).length + ' 个',
      '认识（隔 7 天还对）：' + cnt('known'), '学习中：' + cnt('learning'), '见过：' + cnt('seen'), '待复测：' + cnt('stale'),
      '老忘的：' + (weak || '无'), '今天到期：' + Mem.due().length + '；逾期：' + Mem.overdue(),
      '7 天保持率：' + (n7 ? Math.round(r7 * 100) + '%（' + n7 + ' 次）' : '样本不足') + '；30 天：' + (n30 ? Math.round(r30 * 100) + '%（' + n30 + ' 次）' : '样本不足'),
      '最近 7 天每天时长：' + (days || '-'), '汉字共 ' + zh.length + ' 个，字母 52 个；写字降级 ' + S.stat.wfDown + ' 次'].join('\n');
  },
  export() { return btoa(unescape(encodeURIComponent(JSON.stringify(Store.s)))); },
  import(txt) { const o = JSON.parse(decodeURIComponent(escape(atob(txt.trim())))); Store.s = Store.validate(o); Store.save(); },
};
/* the parent's red dot: the child has reached the last installed world, or less than 14 days of new islands left at the
   pace of the last week (A.22) */
const Supply = {
  low() {
    const last = Object.keys(ORDER).slice(-1)[0];
    if (ORDER[last].some(id => Store.w(id).unlocked)) return true;
    const d = DAY(), recent = (Store.s.flagDays || []).filter(x => x > d - 7).length, left = ALL_ISL().filter(id => !flagged(id)).length;
    return recent > 0 && left / (recent / 7) < 14;
  },
};
