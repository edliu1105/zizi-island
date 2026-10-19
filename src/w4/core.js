/* ================================================================ 字字岛 · 神笔海 (world 4) · core - in the LAZY file assets/js/w4.js
   (tools/build.py: the tables W4D, then this file, ancient.js and one file an island). The island files copy the conventions
   documented in src/w4/README.md: every play is an object (rule, kind0, verb, intro, gen, present, place, onGesture, next,
   reveal, feedback, explain, gestureHint, snap, iconNode) registered with w4Island(id, [find, en, quiz]); the writing game is
   W4X.Write for every island. Nothing here may define a top-level name the first screen already has. */

Object.assign(W4X, {
  D: W4D,
  /* the file has come: the world's tables join the engine's (once) */
  init() {
    W4D.read.forEach(r => { if (!READ.some(x => x[0] === r[0])) READ.push(r); });
    W4D.books.forEach(b => { if (!BOOKS.some(x => x.id === b.id)) BOOKS.push(b); });
    const join = (T, add) => { for (const k in add) { const cur = T[k] || ''; T[k] = cur + Array.from(add[k]).filter(c => !cur.includes(c)).join(''); } };
    join(LOOK, W4D.look); join(LOOK, W4D.lookBack); join(HOLDS, W4D.holds); join(HOLDS, W4D.samePic);      /* SAMEPIC (川 / 水): never offered together, like a holder */
    Object.assign(MOTION, W4D.motion);
    if (!Hanzi.extra) fetch('assets/data/hanzi_extra.json').then(r => (r.ok ? r.json() : null)).then(d => { if (d) Hanzi.extra = d; }).catch(() => {});
    if (Screens.cur === 'map' && !Session.G && MapView.built) MapView.update();
  },

  /* ---------------------------------------------------------------- questions */
  /* the island's characters still to pass first, at most twice a session and never twice in a row (W3R1-02) */
  pick(G, pool, bag) { return needPick(G, pool, bag); },
  /* the answer among the others at a place from a position bag (never always first) */
  put(G, others, x) { return putAt(G, others, x); },
  /* five characters for a "find X" question: levels 1-2 the island's own, 3 look-alikes + one old character, 4 two old, 5 three
     (the engine's optsFor - on 神笔海 poolOf is the child's own known set, §5.3) */
  opts(G, level, answer, n) { return optsFor(G, 'zh', level, n || 5, answer); },
  /* W4X.known(G) (src/w4/boot.js): the characters this child knows here (§5.3); only(): of a set, the known ones */
  only(G, set) { const kn = poolOf(G, 'zh', true); return Array.from(set).filter(k => kn.includes(k)); },
  knowsAll(G, text) { const kn = poolOf(G, 'zh', true); return Array.from(text).every(c => !/[一-鿿]/.test(c) || kn.includes(c)); },
  /* a picture we really have (art not drawn yet is left out of the questions that need it) */
  hasPic(o) { return !!o && (W4D.have.includes(o) || !!OBJ_ALIAS[o]); },
  pic(o, size) { const i = img(OBJURL(o), ''); Object.assign(i.style, { width: size + 'px', height: size + 'px', objectFit: 'contain', pointerEvents: 'none' }); return i; },
  /* the lines every character has (all recorded, tools/voice_lines.py): "这是X" (what he picked), "这个是X" (the right one) */
  thisIs(k) { return '这是' + k; },
  thatIs(k) { return '这个是' + k; },
  /* "read, not said" cards (§5.2): a tap says it - and that question earns no star, nor counts for the memory */
  readCard(st, text, h) { return W3X.readCard(st, text, h); },
  placeRead(st, cx, y) { return W3X.placeRead(st, cx, y); },
  peek(st) { return W3X.peek(st); },
  own(st, k) { return W3X.own(st, k); },
  /* spoken lines a file says through variables: listed once in a call W4X.lines([...]) - tools/voice_lines.py records them */
  lines(a) { return a; },
  /* a test-only gesture: 'wait' = nothing to tap yet (a play that shows its options one after another skips to the next) */
  WAIT: { g: 'wait', p: { id: 'wait' } },
  /* a real minimum wait even in the tests' fast mode (a play whose options come and go must not spin) */
  tick(st, ms) {
    return new Promise(res => { const id = setTimeout(() => { if (!st.scope.dead) res(); }, fast() ? Math.min(ms, 600) : ms); st.scope.add(() => clearTimeout(id)); });
  },
  /* a little round light backing for a play's own icon (W3R1-05: the island panel's game icons) */
  icon(node) { const d = el('div'); Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }); d.appendChild(node); return d; },
  svgIcon(inner, vb) { const d = el('div'); d.innerHTML = '<svg viewBox="' + (vb || '0 0 60 60') + '" width="70%" height="70%">' + inner + '</svg>'; Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }); return d; },

  /* ---------------------------------------------------------------- the explain step (§5.4): beats */
  /* 1 the chosen one: a calm blue dashed ring and its own picture (its line was just said by feedback) */
  exChosen(st, e, k) { if (!e) return; EX.ring(st, e, 'chosen'); if (k != null) EX.picOver(st, e, k, 'chosen'); },
  /* a wordless demonstration is a beat of its own: st.stepDirty marks it for 一步一步 (the parent's tap ends it) */
  async exBeat(st, fn, ms) { if (fn) await fn(); st.stepDirty = true; await EX.wait(st, ms == null ? 600 : ms); },
  /* 3 the right one: a gold ring, its picture, its line(s) */
  async exRight(st, e, k, lines, pic) {
    if (e) { EX.ring(st, e, 'right'); K.hop(st, e, 20); if (pic !== false && k != null) EX.picOver(st, e, pic || k, 'right'); }
    await EX.say(st, lines);
    await EX.wait(st, 300);
  },
});

/* ---------------------------------------------------------------- the base of every 神笔海 play (zGame adds ZBase under it) */
W4X.Base = {
  /* kind0 'find4': a review question in this game is the engine's review card. A play with kind0 'find' instead gets review
     questions in its OWN frame - q = { k, answer, opts } (five characters) and nothing else - and must show them (ultra4's moles do) */
  kind0: 'find4', verb: '找！', boost: 0, props: [],
  /* the factual line for a wrong pick: what the picked one IS - "这是X" (never "wrong") */
  async feedback(st, ans) {
    const e = st.cards && st.cards[st.tapped];
    if (e) { K.wiggle(st, e); if (this.nope) this.nope(st, st.tapped); }
    const line = this.wrongLine ? this.wrongLine(st, ans) : ITEM[ans] && ITEM[ans].kind === 'zh' ? W4X.thisIs(ans) : null;
    if (line) Voice.say(line, { tag: 'wrong' });
    await st.scope.wait(900);
  },
  /* a tap on the read card says it (no star for that question); a tap on a card answers */
  onGesture(st, name, p) {
    if (name === 'tap' && p.id === 'read' && !st.submitted && st.readEl) { W4X.peek(st); return 'ok'; }
    return ZBase.onGesture.call(this, st, name, p);
  },
  async explain(st, ans) { await EX.cards(st, ans, { lines: [W4X.thatIs(st.q.answer)] }); },
};

/* ---------------------------------------------------------------- the writing (§6 写字): 彩虹海's W3Write - the island's two
   characters, and at the third question an old friend: the most due character the child really wrote before */
W4X.Write = Object.assign({}, W3Write);

/* ---------------------------------------------------------------- registering an island: its four games, in the order of
   ISL[id].games (find, write, en, quiz). bgs: the island's backgrounds (new art, or the fallback tools/build.py chose) */
function w4Island(id, plays) {
  const W = ISL[id]; if (!W) return;               /* not live */
  const cast = W.cast, host = cast[0], [find, en, quiz] = plays, bg = W.bgs;
  zGame(Object.assign({}, W4X.Base, find), { id: id + ':find', world: id, bg: bg[0], chars: cast, host, title: '认字', iconNode: find.iconNode || (() => Glyph.zh(W.chars[0].c, 60)) });
  writeGame(Object.assign({}, W4X.Write, { id: id + ':write', world: id, lang: 'zh', bg: bg[1], chars: cast.slice(0, 1), host, title: '写字', intro: '写一写！', iconNode: () => Glyph.zh(W.write[0], 60, '#E8414B'), decor: writeDecor }));
  zGame(Object.assign({}, W4X.Base, { kind0: 'en', verb: 'ABC' }, en), { id: id + ':en', world: id, bg: bg[2], chars: cast.slice(0, 1), host, title: '英文' });
  zGame(Object.assign({}, W4X.Base, { kind0: 'quiz', verb: '想！' }, quiz), { id: id + ':quiz', world: id, bg: bg[3], chars: cast, host, title: '挑战' });
}

/* ---------------------------------------------------------------- 儿歌卷 · 古诗卷 (§4.4.5-6): hanging scrolls on the story shelf;
   one opens after its island's flag; read together, never scored. Known characters black, the others light grey - a tap on any
   says it; the speaker reads it a breath at a time; 拍拍读 reads with a beat on every character (学而思's 说唱) */
Object.assign(W4X, {
  knownChar(c) { return !!ITEM[c] && (learned(c) || Mem.passed(c) || !!(Mem.get(c) && Mem.get(c).b > 0)); },
  scrollItems() {
    return W4D.scrolls.map(s => ({ scroll: s, on: !!ISL[s.after] && (flagged(s.after) || Store.s.all), kind: W4D.scrollKind[s.kind], cover: size => this.scrollCover(s, size) }));
  },
  scrollCover(s, size) {
    const d = el('div', ''); Object.assign(d.style, { position: 'relative', width: size + 'px', height: size + 'px' });
    const r = img('assets/props/scroll.png', '', d); Object.assign(r.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' });
    const sc = Scene.node(s.pic, Math.round(size * 0.5)); Object.assign(sc.style, { position: 'absolute', left: '25%', top: '22%' }); d.appendChild(sc);
    return d;
  },
  showScroll(id) {
    const s = W4D.scrolls.find(x => x.id === id); if (!s) return;
    const ov = el('div', 'storyov', document.body); ov.id = 'scroll4';
    Object.assign(ov.style, { position: 'fixed', inset: 0, zIndex: 60, background: 'linear-gradient(#F7F0DF,#EADFC4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' });
    const sc = new Scope(APP), vw = window.innerWidth, vh = window.innerHeight, n = s.lines.length;
    const close = () => { sc.dispose(); ov.remove(); Voice.hush('leave'); };
    const home = el('button', 'btn', ov); Object.assign(home.style, { position: 'absolute', left: 'calc(14px + var(--sl))', top: 'calc(14px + var(--st))', width: '96px', height: '96px', background: '#FFE08A' }); img('assets/props/ui_home.png', '', home).style.width = '74%'; tapify(home, close);
    const t = el('div', '', ov); t.textContent = '《' + s.title + '》 · ' + W4D.scrollKind[s.kind] + ' · 一起读'; Object.assign(t.style, { font: '800 22px system-ui,sans-serif', color: '#8A6A3A' });
    const picH = Math.round(Math.min(vh * (n > 6 ? 0.2 : 0.26), vw * 0.4)), pic = el('div', '', ov);
    Object.assign(pic.style, { background: '#fff', borderRadius: '20px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.22)', padding: '6px' }); pic.appendChild(Scene.node(s.pic, picH));
    const paper = el('div', '', ov); Object.assign(paper.style, { background: '#FFFBF0', borderRadius: '18px', boxShadow: '0 0 0 4px #9A6433, 0 0 0 9px #F3E3C0', padding: '10px 22px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' });
    const maxLen = Math.max(...s.lines.map(l => Array.from(l).length)), h = Math.max(36, Math.floor(Math.min((vh - picH - 300) / n * 0.92, (vw - 120) / (maxLen + 1))));
    const rows = s.lines.map(line => {
      const row = el('div', '', paper); Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: Math.round(h * 0.04) + 'px', borderRadius: '12px', padding: '0 6px' });
      row._cells = Array.from(line).map(c => {
        if (/[。！？，]/.test(c)) { const p = el('span', '', row); p.textContent = c; Object.assign(p.style, { font: '900 ' + Math.round(h * 0.6) + 'px system-ui,sans-serif', color: INK }); return null; }
        const cell = el('div', '', row); Object.assign(cell.style, { width: h + 'px', height: h + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' });
        cell.appendChild(Glyph.zh(c, h * 0.92, this.knownChar(c) ? INK : '#BDB3A0')); cell.dataset.ch = c;
        tapify(cell, () => { const it = ITEM[c]; Voice.sayNow(it ? it.line : c, { tag: 'story' }); cell.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 300 }); });
        return cell;
      }).filter(Boolean);
      return row;
    });
    const bar = el('div', '', ov); Object.assign(bar.style, { display: 'flex', gap: '28px', marginTop: '6px' });
    const mk = (inner, fn, lbl) => { const b = el('button', 'btn', bar); b.setAttribute('aria-label', lbl); Object.assign(b.style, { position: 'relative', width: '104px', height: '96px', background: '#fff' }); b.innerHTML = inner; tapify(b, fn); return b; };
    let run = 0;
    const read = async beat => {
      const my = ++run; Voice.hush('story');
      for (let i = 0; i < rows.length; i++) {
        if (my !== run || sc.dead) return;
        rows.forEach((r, j) => { r.style.background = j === i ? '#FFE9A8' : ''; });
        Voice.say(s.lines[i], { tag: 'story' });
        if (beat) for (const c of rows[i]._cells) { if (my !== run || sc.dead) return; Sfx.thud(); c.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }], { duration: 260 }); await sc.wait(330); }
        await sc.guard(Voice.afterSay(beat ? 120 : 260));
      }
      if (my === run) rows.forEach(r => { r.style.background = ''; });
    };
    mk(ICONS.speaker || '<svg viewBox="0 0 40 40" width="60%" height="60%"><path d="M6 15h8l9-7v24l-9-7H6z" fill="#2E6FD8" stroke="#2B2118" stroke-width="3"/></svg>', () => read(false), '读一读');
    mk('<svg viewBox="0 0 60 40" width="78%" height="70%"><ellipse cx="30" cy="27" rx="22" ry="9" fill="#E8414B" stroke="#2B2118" stroke-width="3"/><path d="M8 27V17M52 27V17" stroke="#2B2118" stroke-width="3"/><ellipse cx="30" cy="17" rx="22" ry="9" fill="#FFE08A" stroke="#2B2118" stroke-width="3"/><path d="M40 4L33 14M20 4L27 14" stroke="#9A6433" stroke-width="4" stroke-linecap="round"/></svg>', () => read(true), '拍拍读');
    Voice.sayNow(s.title, { tag: 'story' });
    Voice.say(W4D.scrollKind[s.kind], { tag: 'story' });
  },
});
