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
  /* the parent panel (behind the gear's long press, §10.6): the lesson table and "go there now" */
  parent(sh) {
    el('h3', '', sh, { text: '神笔海（跟着课本）· 上课对照' });
    el('div', 'mut', sh, { text: '神笔海的字和顺序跟的是统编版一年级上册（2024 新版）；每周的形式（汉字儿歌 + 古诗 + 故事书）照学而思小猴语文 L1。下表：课本这一课在神笔海的哪个岛、哪个游戏。拿到真正的学而思课表时，只改这张表的数据。'
      + (WORLDS_INFO.w4.partial ? '（神笔海的岛做好一个上线一个：现在上线 ' + ORDER.w4.length + ' 个，其余在地图上是云。）' : '') });
    const t = el('table', '', sh); t.innerHTML = '<tr><th>统编一上（2024）的课</th><th>神笔海</th></tr>';
    LESSONS4.forEach(([a, b]) => { const tr = el('tr', '', t); el('td', '', tr, { text: a }); el('td', '', tr, { text: b }); });
    const open = this.open(), go = el('button', 'pbtn', sh, { text: open ? '现在就去神笔海' : '神笔海还没开（晨光海七面旗插满后开）' });
    go.dataset.w4go = 1;
    if (!open) go.disabled = true;
    go.addEventListener('click', () => {
      if (!this.open()) return;
      Parent.close();
      if (Session.G) Session.home();
      Screens.show('map'); Voice.enter('map'); MapView.build();
      if (MapView.set === 'w4') { MapView.update(); return; }
      MapView.update(); MapView.sail('w4');
    });
    el('div', 'mut', sh, { text: '“现在就去神笔海”只是带孩子飞过去，不改任何进度。平时每片海地图上同一个位置都有一支发光的毛笔，点它就去神笔海；神笔海中间的月亮门回到来的那片海。' });
  },
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
