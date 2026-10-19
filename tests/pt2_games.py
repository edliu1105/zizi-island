# -*- coding: utf-8 -*-
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter
with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    r = page.evaluate("ALL_ISL().flatMap(i => ISL[i].games.map(g => [i, ISL[i].name, g, GAMES[g].title, GAMES[g].kind0, GAMES[g].lang || '', !!GAMES[g].explain, ISL[i].base + (GAMES[g].boost || 0)]))")
    for x in r: print(json.dumps(x, ensure_ascii=False))
    print(len(r))
    print(page.evaluate("Object.keys(Store.s.settings)"), page.evaluate("Bank.set ? Bank.set.size : null"), page.evaluate("['再看一看！','看，是这样','下一题！','对的是这个'].map(t => [t, Bank.has(t)])"))
    br.close()
