/* ================================================================ 字字岛 · 神笔海 (world 4, docs/W4-DESIGN.md) - the FIRST-SCREEN part
   (in index.html; everything else of the world is in the lazily loaded assets/js/w4.js, built from src/w4/core.js, ancient.js
   and one file an island by tools/build.py). Here: when the world opens (§10.2), which characters count as known on its
   islands (§5.3), the brush entrance on every other sea's map and the one-time flight there (§10.3-10.4), the moon gate back,
   the hanging-scroll flag, the parent panel's section (§10.6) and the loader of the lazy file (§11.1). */

const W4X = {
  /* §10.2: 晨光海 done (or 星光海 reached, or opened before, or the parent opened everything) - the same rule for old saves and
     new players; sticky (Prog.check writes Store.s.w4). Only when at least one of its islands is live */
  open() {
    const S = Store.s;
    return !!S && ORDER.w4.length > 0 && (S.all || S.w4 || S.w2seen || S.gate2 || Prog.worldDone('w1'));
  },
  /* §5.3: what a 神笔海 island may ask about and offer - its own characters, 晨光海's, the earlier 神笔海 islands' and every
     character the child has really met (in memory, or written) - never 星光海 / 彩虹海 characters he has not seen */
  known(G) {
    const out = G.W.chars.map(c => c.c), add = k => { if (!out.includes(k)) out.push(k); }, at = ORDER.w4.indexOf(G.world);
    ORDER.w1.forEach(id => ISL[id].chars.forEach(c => add(c.c)));
    ORDER.w4.slice(0, Math.max(0, at)).forEach(id => ISL[id].chars.forEach(c => add(c.c)));
    ITEMS.forEach(x => { if (x.kind === 'zh' && (Mem.get(x.k) || learned(x.k))) add(x.k); });
    return out;
  },
  title(g) { return { find: '认字', write: '写字', en: '英文', quiz: '挑战' }[String(g).split(':')[1]] || ''; },
  /* the flag of 神笔海: a hanging scroll - two wooden rods, the island's colour, its second colour low left, the host in the
     middle, a little brush on top of the pole (§3.2) */
  flag(W) {
    const ink = '#2B2118', rod = '#9A6433';
    const sv = '<rect x="2" y="1" width="36" height="5" rx="2.5" fill="' + rod + '" stroke="' + ink + '" stroke-width="2.2"/>'
      + '<rect x="5" y="5" width="30" height="48" fill="' + W.color + '" stroke="' + ink + '" stroke-width="2.4"/><path d="M6.2 40H17V51.8H6.2Z" fill="' + W.color2 + '"/>'
      + '<rect x="2" y="52" width="36" height="5" rx="2.5" fill="' + rod + '" stroke="' + ink + '" stroke-width="2.2"/>';
    return '<div class="cloth" style="width:40px;height:58px"><svg viewBox="0 0 40 58">' + sv + '</svg>'
      + '<img src="assets/thumbs/' + W.host + '.png" alt="" style="left:6px;top:13px"></div>'
      + '<svg class="finial" viewBox="0 0 24 24"><path d="M12 1V12" stroke="' + rod + '" stroke-width="3.2" stroke-linecap="round"/><path d="M12 11C7.5 14 8.5 20 12 23C15.5 20 16.5 14 12 11Z" fill="' + ink + '" stroke="' + ink + '" stroke-width="1.5"/></svg>';
  },
  /* the map: the brush glows wherever it is; the lazy file starts coming once the world is open and the map is up */
  mapUpdate(MV) {
    /* the world opened while the map was up (晨光海's last flag): the map is drawn again once, now with its brush */
    if (MV.set !== 'w4' && !MV.isl.brush && !MV.panel && !MV.sailing && !MV.rebuilding && this.open()) {
      MV.rebuilding = true; $('#islands').innerHTML = ''; MV.isl = {}; MV.built = false; Loops.sweep(); MV.build(); MV.rebuilding = false; return;
    }
    const B = MV.isl.brush; if (B) { B.d.classList.remove('locked'); B.glow.style.opacity = 1; }
    const nw = !!B && this.fresh();      /* a new 神笔海 island: the brush's gold ring pulses (§12.9) */
    if (B && !!B.nw !== nw) { B.nw = nw; B.glow.style.boxShadow = nw ? '0 0 0 7px #FFC93C' : ''; if (nw) Loops.run(B.glow, [{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }, { transform: 'scale(1)' }], { duration: 1100 }); }
    if (this.open() && !W4Lazy.loaded && !W4Lazy.p && !W4Lazy.later) W4Lazy.later = setTimeout(() => { W4Lazy.later = 0; W4Lazy.load(); }, fast() ? 0 : 1500);
  },
  /* §10.4: once, the first time the map comes up after the world opened (everything else on the map has been shown first): the
     brush grows out of its inkstone and glows, "新世界开啦！", and the ink carries the child over; the first island's cloud
     then flies away on 神笔海's map. Never inside a game: only the map calls it */
  async firstFlight(MV, live) {
    const B = MV.isl.brush; if (!B) return;
    B.glow.style.opacity = 1;
    B.land.animate([{ transform: 'translate(-50%,-50%) scale(.2) rotate(-20deg)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1.3) rotate(6deg)', opacity: 1, offset: 0.7 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }], { duration: T(900) + 1, easing: EASE.pop });
    B.glow.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1.5)', opacity: 1 }, { transform: 'scale(1)', opacity: 1 }], { duration: T(1300) + 1 });
    Sfx.fanfare(); Voice.say('新世界开啦！', { tag: 'unlock' });
    await new Promise(r => setTimeout(r, T(900) + T(1200)));
    if (!live()) return;
    const first = ORDER.w4[0], ws = first && Store.w(first);
    if (ws && !flagged(first) && !ws.stars) { ws.unlocked = true; ws.justOpened = true; Store.save(); }
    await MV.sail('w4');
  },
  /* the sailor's line: to 神笔海 / back from it through the moon gate (§10.3) */
  sailLine(from, to, first) {
    if (to === 'w4') return first ? '神笔海到啦！' : '去神笔海！';
    if (from === 'w4') return { w1: '回到晨光海！', w2: '回到星光海！', w3: '回到彩虹海！' }[to] || null;
    return null;
  },
  /* a game button of an island whose file is still coming: a little spinner */
  spinner() {
    const d = el('div'); d.innerHTML = '<svg viewBox="0 0 40 40" width="56%" height="56%"><circle cx="20" cy="20" r="14" fill="none" stroke="rgba(43,33,24,.18)" stroke-width="6"/><path d="M20 6A14 14 0 0 1 34 20" fill="none" stroke="#2B2118" stroke-width="6" stroke-linecap="round"/></svg>';
    Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' });
    Loops.run(d.firstChild, [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 900 });
    return d;
  },
  /* the parent panel (behind the gear's long press, §10.6): its section comes with the lazy file (core.js parent2: the lesson
     table and "go there now") - nothing of it on the first screen (W4R1N-06) */
  parent(sh) {
    const box = el('div', '', sh); el('h3', '', box, { text: '神笔海（跟着课本）· 上课对照' });
    W4Lazy.load().then(ok => { if (box.isConnected) { if (ok) this.parent2(box); else el('div', 'mut', box, { text: '等一下再打开看看。' }); } });
  },
  /* ⑧ ⑨ (§12.9): an island waits for its cloud show; once after the update a flagged ⑦ opens ⑧ with that show (Store.s.w4x:
     1 done, 2 the brush has said its line); the brush's line and the finale's encore are in core.js (news) */
  fresh() { return ORDER.w4.some(id => Store.w(id).justOpened); },
  migrate() {
    const S = Store.s, i = ORDER.w4.indexOf('avengers4'), ws = i > 0 && Store.w(ORDER.w4[i]);
    if (S.w4x || !ws) return;
    S.w4x = 1; if (flagged(ORDER.w4[i - 1]) && !ws.unlocked) ws.unlocked = ws.justOpened = true;
    Store.save();
  },
  async news(MV, live) { return ((MV.set !== 'w4' && MV.isl.brush && this.fresh() && Store.s.w4x === 1) || (MV.set === 'w4' && Store.s.fin.w4x === 'due')) && await W4Lazy.load() && live() && this.news2(MV, live); },
  /* the end of assets/js/w4.js calls this: the file is in (core.js adds W4X.init) */
  loaded() { if (W4Lazy.loaded) return; W4Lazy.loaded = true; if (this.init) this.init(); },
};

/* the lazy file (§11.1): asked for once the map is up (the world open), and by an island panel / a game of 神笔海; three tries,
   then "等一下哦" - the other seas never wait for it. Offline it comes from the service worker's cache like every asset */
const W4Lazy = {
  loaded: false, p: null, later: 0,
  get ready() { return this.load(); },
  load() {
    if (this.loaded) return Promise.resolve(true);
    if (!ORDER.w4.length) return Promise.resolve(false);
    if (this.p) return this.p;
    this.p = new Promise(res => {
      const once = n => {
        const s = document.createElement('script'); s.src = W4JS; s.async = true;
        s.onload = () => { if (this.loaded) res(true); else { this.p = null; res(false); } };
        s.onerror = () => { s.remove(); if (n < 2) setTimeout(() => once(n + 1), 700 * (n + 1)); else { this.p = null; res(false); } };
        document.head.appendChild(s);
      };
      once(0);
    });
    return this.p;
  },
};

/* the brush on every other sea's map, the same place always: in the open sea between the gate and the islands on its right
   (landscape) / below it (portrait); measured clear of every island, gate and corner button at eight screen sizes (§10.3) */
MAPPOS.land.brush = [68, 49];
MAPPOS.port.brush = [50, 64];
/* 神笔海's nine places, islands at 0.85 (§12.9; tests/test_w4open.py measures them at eight sizes) */
const MAPPOS4 = {
  land: { 0: [8, 42], 1: [22, 16], 2: [41, 16], 3: [59, 16], 4: [78, 15], 5: [92, 41], 6: [90, 72], 7: [71, 74], 8: [47, 75], fest: [22, 71], gate: [50, 46] },      /* ① ⑥ 1% lower than §12.9: at 1024 x 768 a lantern grazed the next island */
  port: { 0: [12, 25], 1: [47, 15], 2: [74, 25], 3: [84, 50], 4: [88, 79], 5: [63, 80], 6: [37, 81], 7: [12, 78], 8: [18, 51], fest: [54, 61], gate: [50, 44] },
};
