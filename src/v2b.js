/* ================================================================ 字字岛 v2, part 2: the map's corners and the parent panel */

/* ---------------------------------------------------------------- map: the chest (daily key / hero cards), the story books, the
   parent's red dot. Corners: chest top right, books top left (portrait islands sit a little lower to leave them free) */
const MapV2 = {
  ensure() {
    if ($('#chestbtn')) return;
    const st = el('style', '', document.head); st.textContent = '#gear.dot::after{content:"";position:absolute;right:12px;top:12px;width:22px;height:22px;border-radius:50%;background:#E8414B;box-shadow:0 0 0 3px #fff}';
    const mk = (id, src, css, fn, lbl) => { const b = el('button', 'btn', $('#map')); b.id = id; b.setAttribute('aria-label', lbl); Object.assign(b.style, Object.assign({ position: 'absolute', width: '104px', height: '104px', background: '#FFF3C4', borderRadius: '28px', zIndex: 12 }, css)); const i = img(src, '', b); Object.assign(i.style, { width: '84%', height: '84%', objectFit: 'contain' }); tapify(b, fn); return b; };
    mk('chestbtn', 'assets/props/chest.png', { right: 'calc(14px + var(--sr))', top: 'calc(14px + var(--st))' }, () => { MapView.closePanel(true); if (Keys.avail()) Keys.start(); else Keys.album(); }, '英雄卡');
    mk('storybtn', 'assets/obj/book.png', { left: 'calc(14px + var(--sl))', top: 'calc(14px + var(--st))' }, () => { MapView.closePanel(true); Books.shelf(); }, '故事书');
  },
  update() {
    this.ensure();
    const c = $('#chestbtn'), on = Keys.avail();
    if (on && !c._pulse) c._pulse = c.animate([{ transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,201,60,0)' }, { transform: 'scale(1.08)', boxShadow: '0 0 0 12px rgba(255,201,60,.85)' }, { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,201,60,0)' }], { duration: 1400, iterations: Infinity });
    if (!on && c._pulse) { c._pulse.cancel(); c._pulse = null; }
    $('#storybtn').style.display = Books.open().length ? '' : 'none';
    $('#gear').classList.toggle('dot', Supply.low());
  },
  /* the first map of the day: a word and a wiggle at the chest */
  hello() {
    const D = Mem.today();
    if (!Keys.avail() || D.hello || fast()) return;
    D.hello = 1;
    setTimeout(() => { if (Screens.cur !== 'map' || Session.G || MapView.panel) return; Voice.say('找回老朋友！', { tag: 'map' }); const b = $('#chestbtn'); if (b) b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(0)' }], { duration: 600, iterations: 2 }); }, T(2600));
  },
};
MAPPOS.port[0][1] += 5; MAPPOS.port[1][1] += 5; MAPPOS.port[2][1] += 5;

/* ---------------------------------------------------------------- parent panel, v2 */
const ParentV2 = {
  sections(sh) {
    const S = Store.s, its = ITEMS.filter(i => i.isl), zh = its.filter(i => i.kind === 'zh'), en = its.filter(i => i.kind !== 'zh'), cnt = (arr, s) => arr.filter(i => Mem.state(i.k) === s).length;
    const [r7, n7] = Mem.keep(7, 13), [r30, n30] = Mem.keep(30, 59), pct = (r, n) => n ? Math.round(r * 100) + '%（' + Math.round(r * n) + '/' + n + '）' : '样本不足';
    if (Supply.low()) el('div', 'mut', sh, { html: '<b style="color:#E8414B">● 新内容快用完了</b>：请点下面的“复制进度报告”，发给 Claude（Opus 5.5），让它做下一个世界。' });
    el('h3', '', sh, { text: '记得牢不牢（只给家长看）' });
    const t = el('table', '', sh);
    t.innerHTML = '<tr><th></th><th>认识<br><small>隔 7 天还对</small></th><th>学习中</th><th>见过</th><th>待复测<br><small>逾期 30 天</small></th></tr>'
      + '<tr><td>汉字</td><td>' + cnt(zh, 'known') + '</td><td>' + cnt(zh, 'learning') + '</td><td>' + cnt(zh, 'seen') + '</td><td>' + cnt(zh, 'stale') + '</td></tr>'
      + '<tr><td>字母</td><td>' + cnt(en, 'known') + '</td><td>' + cnt(en, 'learning') + '</td><td>' + cnt(en, 'seen') + '</td><td>' + cnt(en, 'stale') + '</td></tr>';
    el('div', 'mut', sh, { text: '今天到期 ' + Mem.due().length + ' 个，逾期 ' + Mem.overdue() + ' 个。7 天保持率 ' + pct(r7, n7) + '；30 天保持率 ' + pct(r30, n30) + '（目标 85% 以上；样本不到 20 时只显示、不报警）。' });
    el('div', 'mut', sh, { text: '对照一年级上册（认 300 个字）：已经“认识” ' + cnt(zh, 'known') + ' 个。目前装好的字一共 ' + zh.length + ' 个，后面的世界会接着加。' });
    /* early signals (A.21) */
    const sig = [], d = DAY(), days = [d, d - 1, d - 2].map(x => S.days[x]).filter(Boolean), quits = days.reduce((a, x) => a + Math.max(0, x.keyGo - x.keyEnd), 0);
    if (quits >= 2) { if (!S.key.short) { S.key.short = true; Store.save(); } sig.push('三天里钥匙题中途退出 ' + quits + ' 次：钥匙题已自动缩到 3 道。'); }
    const slow = S.flags.slice(-2).filter(id => Store.w(id).sessions > 14);
    if (slow.length === 2) sig.push('最近两个岛都玩了很多局才插旗：可能题目偏难，请告诉 Claude。');
    const ch = S.checks.slice(-2);
    if (ch.length === 2 && n7 >= 20 && ch.every(c => c.n && c.yes / c.n < r7 - 0.2)) sig.push('连续两周“考一考”的认得率比 app 里低 20 个百分点以上：请告诉 Claude 检查题目是不是露了答案。');
    if (S.stat.wfDown) sig.push('写字降到描红级 / 改成认读共 ' + S.stat.wfDown + ' 次（只在当时那个岛有效）。');
    el('h3', '', sh, { text: '早期信号' });
    el('div', 'mut', sh, { html: sig.length ? sig.map(x => '• ' + x).join('<br>') : '暂时没有。' });
    el('h3', '', sh, { text: '每周“考一考”（约 5 分钟，不要给孩子看图、不要读出来）' });
    el('div', 'mut', sh, { text: '指着字问“这是什么字？”，按孩子的表现点。点“不认得”的字会回到第一箱、明天再复习；点“认得”不会加分，也不给星。' });
    const go = el('button', 'pbtn', sh, { text: '开始考一考' }); go.addEventListener('click', () => this.check());
    el('h3', '', sh, { text: '进度报告 · 存档' });
    const rep = el('button', 'pbtn', sh, { text: '复制进度报告' });
    const box = el('textarea', '', sh); Object.assign(box.style, { width: '100%', height: '120px', display: 'none', fontSize: '14px' });
    rep.addEventListener('click', () => { box.style.display = ''; box.value = Report.text(); box.select(); try { navigator.clipboard.writeText(box.value); rep.textContent = '已复制，可以直接粘贴给 Claude'; } catch (e) { rep.textContent = '请长按下面的文字全选复制'; } });
    const ex = el('button', 'pbtn', sh, { text: '导出存档' }), im = el('button', 'pbtn', sh, { text: '恢复存档' });
    ex.addEventListener('click', () => { box.style.display = ''; box.value = Report.export(); box.select(); try { navigator.clipboard.writeText(box.value); ex.textContent = '存档已复制'; } catch (e) {} });
    im.addEventListener('click', () => { if (box.style.display === 'none' || !box.value) { box.style.display = ''; box.value = ''; box.placeholder = '把导出的存档粘贴到这里，再按一次“恢复存档”'; return; } try { Report.import(box.value); im.textContent = '已恢复'; MapView.update(); } catch (e) { im.textContent = '这段文字不是存档'; } });
    el('h3', '', sh, { text: '时长和写字' });
    const mins = el('button', 'pbtn', sh, { text: '' }), opts = [15, 20, 30, 10, 0];
    const lab = () => { mins.textContent = '“停船还是继续”：' + (S.settings.mins ? '玩到 ' + S.settings.mins + ' 分钟时问一次' : '关'); };
    lab(); mins.addEventListener('click', () => { S.settings.mins = opts[(opts.indexOf(S.settings.mins) + 1) % opts.length]; Store.save(); lab(); });
    const wg = el('button', 'pbtn', sh, { text: '' }), lab2 = () => { wg.textContent = '写字不挡开岛：' + (S.settings.wgate ? '开（写字一格按认字题计）' : '关'); };
    lab2(); wg.addEventListener('click', () => { S.settings.wgate = !S.settings.wgate; Store.save(); lab2(); });
    el('div', 'mut', sh, { text: '“停船还是继续”只是一个提醒，孩子点继续就照常玩，没有上限。写字吃力时 app 会自己先降到描红，再换成认字题（只在那一个岛）。' });
  },
  /* the weekly check: up to 8 characters (the due and the weak first) and one sentence, big, no picture, no sound */
  check() {
    const S = Store.s, d = DAY(), pool = ITEMS.filter(i => i.kind === 'zh' && Mem.get(i.k) && Mem.get(i.k).b > 0).map(i => i.k);
    const rate = k => { const m = Mem.get(k); return m.n ? m.ok / m.n : 1; };
    const pick = Mem.due(it => it.kind === 'zh').concat(pool.sort((a, b) => rate(a) - rate(b))).filter((k, i, a) => a.indexOf(k) === i).slice(0, 8);
    const known = ITEMS.filter(x => x.kind === 'zh' && Mem.get(x.k)).map(x => x.k), sent = READ.find(r => Array.from(r[0]).every(c => /[。！？，]/.test(c) || known.includes(c)));
    const list = pick.map(k => ({ k })).concat(sent ? [{ s: sent[0] }] : []);
    if (!list.length) { Parent.toast('还没有学过的字可以考'); return; }
    const res = { day: d, n: 0, yes: 0, no: [], sent: null };
    let i = 0;
    const ov = el('div', '', document.body); ov.id = 'pcheck'; Object.assign(ov.style, { position: 'fixed', inset: 0, zIndex: 90, background: '#FFFDF6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px' });
    const show = () => {
      ov.innerHTML = '';
      if (i >= list.length) {
        S.checks.push(res); Store.save();
        const t = el('div', '', ov); t.textContent = '考完了：认得 ' + res.yes + ' / ' + res.n + (res.no.length ? '；不认得的 ' + res.no.join('') + ' 明天会复习' : '');
        Object.assign(t.style, { font: '700 26px system-ui,sans-serif', color: INK, padding: '0 30px', textAlign: 'center' });
        const b = el('button', 'pbtn', ov, { text: '回到家长面板' }); b.addEventListener('click', () => { ov.remove(); Parent.open(); });
        return;
      }
      const x = list[i], top = el('div', '', ov);
      top.appendChild(x.k ? Glyph.zh(x.k, 260) : Sent.node(x.s, 90, -1));
      const row = el('div', '', ov); Object.assign(row.style, { display: 'flex', gap: '20px' });
      const b = (t, f) => { const bt = el('button', 'pbtn', row, { text: t }); bt.style.fontSize = '24px'; bt.addEventListener('click', () => { f(); i++; show(); }); };
      b(x.k ? '认得' : '读对了', () => { if (x.k) { res.n++; res.yes++; } else res.sent = 1; });
      b(x.k ? '不认得' : '没读对', () => { if (x.k) { res.n++; res.no.push(x.k); Mem.parentNo(x.k); } else res.sent = 0; });
      b('没测', () => {});
      const q = el('button', 'pbtn', ov, { text: '结束' }); q.addEventListener('click', () => { i = list.length; show(); });
    };
    Parent.close(); show();
  },
};
