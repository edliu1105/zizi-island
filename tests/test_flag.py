# -*- coding: utf-8 -*-
"""Four ✓ but no flag ("再玩一局插旗子！", client 2026-10-24: 花果山 kept saying it and never planted the flag)
 01 every game of an island can plant it: four games done, none of the island's characters passed; one game played alone,
    all right -> the flag within 3 sessions (写字母 / 英文 / 连线 / 补一笔 / 送字回家 ask the characters with a card)
 02 连线 counts: the characters joined right at the first try are a pass (it recorded nothing before)
 03 an old character missed before does not take the round of a character still to pass (it waits for the next session)
 04 the parent panel names the characters still to pass
usage: python tests/test_flag.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, step, q, Log

log = Log('flag')
PH = ('act', 'ready', 'input', 'pairing')

def play(page, isl, game, limit=800):
    page.evaluate("([i, g]) => window.__go(i, g, 0, {})", [isl, game])
    page.wait_for_function("window.__q && ['ready','act','input','pairing'].includes(window.__q.phase)", timeout=30000)
    for _ in range(limit):
        if page.evaluate("!Session.G"):
            break
        cur = q(page)
        if not cur or cur['phase'] not in PH:
            page.wait_for_timeout(20); continue
        if step(page, 'right') is None:
            page.wait_for_timeout(20)
    page.wait_for_function("!Session.G", timeout=30000)
    page.wait_for_timeout(150)

RESET = """([i, realistic]) => { const ws = Store.w(i), d = DAY(); ws.unlocked = true; ISL[i].games.forEach(g => ws.gstars[g] = realistic ? 14 : 5);
  delete ws.pok; delete ws.skip; ISL[i].chars.forEach(c => delete Store.s.mem[c.c]); Store.s.missNext = [];
  if (realistic) { ['人','口','目','手','日','月','云','木','山','水','火','石','田','禾','米','瓜'].forEach(k => Store.s.mem[k] = { b: 2, due: d - 1, last: d - 3, up: d - 3, seen: d - 20, pass: ['a','b'], n: 5, ok: 4 });
    ISL[i].chars.forEach(c => Store.s.mem[c.c] = { b: 1, due: d, last: d - 1, up: d - 1, seen: d - 5, pass: [], n: 6, ok: 3 }); Store.s.missNext = ['马', '水']; }
  Store.save(); }"""
PASSES = "(i) => ISL[i].chars.map(c => (Store.s.mem[c.c] || {pass: []}).pass.length)"

with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.evaluate("Store.s.all = true; Store.save()")
    # 01 every game alone plants the flag (world 1, a 5-character island of world 3, 神笔海 with 对 that 摘桃找词 cannot ask)
    for isl in ('xiyou', 'huluwa', 'hulk3', 'xiyou4'):
        for g in page.evaluate("(i) => ISL[i].games", isl):
            page.evaluate(RESET, [isl, False])
            n = None
            for s in range(3):
                play(page, isl, g)
                if page.evaluate("(i) => Prog.islandDone(i)", isl):
                    n = s + 1
                    break
            log.check(n is not None, '01 %s alone, all right: the flag after %s sessions (passes %s)' % (g, n, page.evaluate(PASSES, isl)))
    # 02 连线: one session, all right -> every one of 花果山's characters joined counts once
    page.evaluate(RESET, ['xiyou', False])
    play(page, 'xiyou', 'xiyou:quiz')
    log.check(all(x == 1 for x in page.evaluate(PASSES, 'xiyou')), '02 连线 counts the characters joined right: %s' % page.evaluate(PASSES, 'xiyou'))
    # 03 a lived-in save (old characters due, 马 and 水 missed last time): one find session asks all four of 花果山's characters
    page.evaluate(RESET, ['xiyou', True])
    play(page, 'xiyou', 'xiyou:find')
    log.check(all(x == 1 for x in page.evaluate(PASSES, 'xiyou')), '03 a lived-in save: the missed cards fit around them, all four characters asked and passed once %s; missNext %s' % (page.evaluate(PASSES, 'xiyou'), page.evaluate("Store.s.missNext")))
    # 04 the parent panel names what is missing
    page.evaluate(RESET, ['xiyou', False])
    page.evaluate("Store.s.mem['牛'] = { b: 1, due: 0, last: 0, up: -1, seen: 0, pass: ['x'], n: 1, ok: 1 }; Store.save()")
    page.evaluate("Parent.open ? Parent.open() : null")
    page.wait_for_timeout(400)
    txt = page.evaluate("document.body.innerText")
    log.check('还差这几个字各在两局里自己答对：牛 1/2、羊 0/2、马 0/2、鸟 0/2' in txt, '04 the parent panel: "还差这几个字各在两局里自己答对：牛 1/2、羊 0/2、马 0/2、鸟 0/2"')
    log.check(not page.errors, 'no page errors %s' % page.errors[:3])
    br.close()
sys.exit(0 if log.close() else 1)
