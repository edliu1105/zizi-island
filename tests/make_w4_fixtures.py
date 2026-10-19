# -*- coding: utf-8 -*-
"""The old saves of tests/test_w4open.py, made ONCE by the app as it was before 神笔海 (index.html of the last release, given
as index_pre_w4.html next to index.html: `git show <release>:index.html > index_pre_w4.html`) and written in the parent
panel's "导出存档" format (Report.export) to tests/fixtures/save_*.txt:
  save_w1part  晨光海 half done (4 flags)          save_w1done  晨光海 just finished (7 flags, its festival seen)
  save_w2      in 星光海 (晨光海 done, 9 of 星光海's islands open)   save_w3  in 彩虹海 (星光海 done, 3 彩虹海 flags)
Real saves exported by the parent go into tests/fixtures/ as save_real_*.txt; the test reads them too.
usage: python tests/make_w4_fixtures.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['KM_PAGE'] = 'index_pre_w4.html'
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter

HERE = os.path.dirname(os.path.abspath(__file__))
MAKE = r"""(kind) => {
  Store.reset(); const S = Store.s, d = DAY();
  const done = (id, n) => { const ws = Store.w(id); ws.unlocked = true; ws.visits = 6; ws.sessions = 6; ISL[id].games.forEach(g => { ws.gstars[g] = 5 + (n || 0); }); ws.stars = ISL[id].games.length * (5 + (n || 0)); ws.played = ISL[id].games.slice();
    ISL[id].chars.forEach((c, j) => { if (!NOWRITE.includes(c.c)) S.learned[c.c] = { w: 2, p: j % 2 }; const m = Mem.touch(c.c); m.pass = ['s1', 's2']; m.b = 3; m.due = d + 2 + j; m.n = 4; m.ok = 3; S.met[c.c] = true; });
    ISL[id].letters.forEach(l => { S.learned[l.l] = { w: 1, p: 0 }; const m = Mem.touch(l.l); m.pass = ['s1', 's2']; m.b = 2; m.due = d + 4; S.met[l.l] = true; }); };
  const some = id => { const ws = Store.w(id); ws.unlocked = true; ws.visits = 2; ws.sessions = 2; const g = ISL[id].games; ws.gstars[g[0]] = 5; ws.gstars[g[1]] = 3; ws.stars = 8; ws.played = g.slice(0, 2); };
  const w1 = ORDER.w1, w2 = ORDER.w2, w3 = ORDER.w3;
  if (kind === 'w1part') { w1.slice(0, 4).forEach(id => done(id)); some(w1[4]); }
  if (kind === 'w1done') { w1.forEach(id => done(id, 1)); S.fin.w1 = 'seen'; }
  if (kind === 'w2') { w1.forEach(id => done(id, 2)); S.fin.w1 = 'seen'; S.gate2 = true; S.w2seen = true; w2.slice(0, 5).forEach(id => done(id)); some(w2[5]); S.mapSet = 'w2'; }
  if (kind === 'w3') { w1.concat(w2).forEach(id => done(id, 1)); S.fin.w1 = S.fin.w2 = 'seen'; S.gate2 = S.gate3 = S.w2seen = S.w3seen = true; w3.slice(0, 3).forEach(id => done(id)); some(w3[3]); S.mapSet = 'w3'; S.settings.ex = 'step'; }
  Prog.check(false);
  S.flags = ALL_ISL().filter(id => flagged(id));
  S.album = { n: Math.min(CARDS.length, S.flags.length + 3), src: [] }; S.flagDays = S.flags.map((_, i) => d - 40 + i);
  S.key = { day: d - 1, got: 3, short: false }; S.lastG = [S.flags.slice(-1)[0] || 'peppa', ISL[S.flags.slice(-1)[0] || 'peppa'].games[0]];
  Store.save();
  return Report.export();
}"""
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    os.makedirs(os.path.join(HERE, 'fixtures'), exist_ok=True)
    for kind in ('w1part', 'w1done', 'w2', 'w3'):
        txt = page.evaluate(MAKE, kind)
        open(os.path.join(HERE, 'fixtures', 'save_%s.txt' % kind), 'w', encoding='utf-8').write(txt + '\n')
        print(kind, len(txt))
    br.close()
