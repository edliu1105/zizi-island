# -*- coding: utf-8 -*-
"""Screenshots of everything outside the games: entry, map (both seas), an island panel, the treasure book (empty and
with learned characters), practice, the finale - both orientations -> tests/logs/screens/<ori>_<name>.png"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs', 'screens')
os.makedirs(OUT, exist_ok=True)
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    for ori, vw, vh in (('L', 1180, 820), ('P', 820, 1180)):
        page = new_page(br, base, vw, vh)
        shot = lambda n: page.screenshot(path=os.path.join(OUT, '%s_%s.png' % (ori, n)))
        page.wait_for_timeout(600); shot('entry')
        enter(page); page.wait_for_timeout(1200); shot('map')
        page.evaluate("MapView.openPanel('peppa')"); page.wait_for_timeout(900); shot('panel')
        page.evaluate("MapView.closePanel(true); Book.open()"); page.wait_for_timeout(700); shot('book_empty')
        page.evaluate("() => { ['人','口','目','手','日','月'].forEach((k, i) => { Store.learn(k); for (let j = 0; j < i; j++) Store.learn(k, 'p'); }); ['A','B','C'].forEach(k => Store.learn(k)); Book.render(); }")
        page.wait_for_timeout(500); shot('book')
        page.evaluate("Book.tab = 'up'; Book.render()"); page.wait_for_timeout(400); shot('book_abc')
        page.evaluate("Practice.start(ITEM['手'])"); wait_phase(page, timeout=20000); page.wait_for_timeout(500); shot('practice')
        page.evaluate("gesture('home')"); page.wait_for_timeout(700)
        page.evaluate("() => { Book.close(); ORDER.w1.forEach(id => { const ws = Store.w(id); ws.unlocked = true; ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); ws.stars = 20; }); Prog.check(false); Store.save(); MapView.useSet('w1'); MapView.update(); }")
        page.wait_for_timeout(600); shot('map_done')
        page.evaluate("Finale.play('w1')"); page.wait_for_timeout(6000); shot('finale')
        page.evaluate("Finale.stop(); Screens.show('map'); Store.s.fin.w1 = 'seen'; Store.s.gate2 = true; MapView.useSet('w2'); MapView.update()"); page.wait_for_timeout(900); shot('map_w2')
        print(ori, 'errors', page.errors[:4])
        page.context.close()
    br.close()
