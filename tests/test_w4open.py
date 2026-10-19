# -*- coding: utf-8 -*-
"""神笔海 opens (docs/W4-DESIGN.md §10, §11.5): nothing the child has is locked or lost.
 01 four old saves (made by the app before 神笔海, the parent's "导出存档" format: tests/fixtures/save_*.txt, see
    tests/make_w4_fixtures.py; real exported saves save_real_*.txt are read too): after the update every island, ✓, star, flag,
    memory box, card and setting is as it was; the gate ring of the three seas is as it was; when 晨光海 is done (just done /
    in 星光海 / in 彩虹海) the first map flies to 神笔海 by itself, ONCE, and comes back through the moon gate to the sea it left
 02 晨光海 not done: no brush, 神笔海 cannot be opened
 03 the brush on the three seas at eight screen sizes: 110 px, on screen, on top, clear of every island, the gate and the corner
    buttons; it flies to 神笔海; the moon gate goes back to the sea it came from
 04 islands not live yet are clouds that say "新岛还在建哦！" and never open; only live islands exist in the data
 05 the festival: once every island of the (complete) sea has its flag - the temple fair and 神笔海's own finale
 06 the parent panel (behind the gear): 神笔海's section, the lesson table, "现在就去神笔海" flies there; 全部解锁 opens it
 07 the red dot: 神笔海 open with plenty of islands still to flag -> no dot
 08 the first-screen budget (index.html <= 640,000 B, gzip <= 180,000 B); w4.js in the offline list; an island of 神笔海 opened
    before w4.js has come waits for it (its buttons spin) and then plays
 09 Store.validate runs before w4.js: the stars of 神笔海's games are kept
usage: python tests/test_w4open.py"""
import os, sys, json, glob, gzip, re, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, Log, ROOT

HERE = os.path.dirname(os.path.abspath(__file__))
log = Log('w4open')
SAVES = {os.path.basename(f)[5:-4]: open(f, encoding='utf-8').read().strip() for f in sorted(glob.glob(os.path.join(HERE, 'fixtures', 'save_*.txt')))}
LOAD = "(t) => { const o = JSON.parse(decodeURIComponent(escape(atob(t.trim())))); localStorage.setItem('zzi.v1', JSON.stringify(o)); return o; }"
SNAP = """() => { const S = Store.s, ids = ORDER.w1.concat(ORDER.w2, ORDER.w3);
  return { isl: ids.map(id => [id, S.worlds[id].unlocked, JSON.stringify(S.worlds[id].gstars), S.worlds[id].stars, !!S.worlds[id].pok]), flags: S.flags.slice(),
    learned: JSON.stringify(S.learned), mem: Object.keys(S.mem).sort().map(k => k + S.mem[k].b + ':' + S.mem[k].pass.length).join(','), album: S.album.n, fin: [S.fin.w1, S.fin.w2, S.fin.w3],
    gates: [S.gate2, S.w2seen, S.gate3, S.w3seen], ex: S.settings.ex, key: S.key.got }; }"""
CORNERS = ['#chestbtn', '#storybtn', '#bookbtn', '#gear']


def fresh(br, base, vw=1180, vh=820, save=None, route=None):
    pg = new_page(br, base, vw, vh)
    if route:
        pg.route('**/assets/js/w4.js*', route)
    if save is not None:
        pg.evaluate(LOAD, save)
        pg.reload(); pg.wait_for_function('window.__ready === true', timeout=20000)
    return pg


def to_map(pg):
    pg.click('#play')
    pg.wait_for_function("document.querySelector('#map').classList.contains('on')", timeout=10000)


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    live = None

    # 01 the old saves
    for name, txt in SAVES.items():
        pg = fresh(br, base, save=txt)
        live = live or pg.evaluate("ORDER.w4.slice()")
        before = pg.evaluate("(t) => { const o = JSON.parse(decodeURIComponent(escape(atob(t.trim())))); return o; }", txt)
        b = pg.evaluate("""(o) => { const ids = ORDER.w1.concat(ORDER.w2, ORDER.w3);
          return { isl: ids.map(id => { const w = o.worlds[id] || {}; return [id, w.unlocked === true || id === ORDER.w1[0], JSON.stringify(w.gstars || {}), w.stars || 0, !!w.pok]; }), flags: o.flags.slice(),
            learned: JSON.stringify(o.learned), mem: Object.keys(o.mem).sort().map(k => k + o.mem[k].b + ':' + o.mem[k].pass.length).join(','), album: o.album.n, fin: [o.fin.w1, o.fin.w2, o.fin.w3],
            gates: [!!o.gate2, !!o.w2seen, !!o.gate3, !!o.w3seen], ex: o.settings.ex, key: o.key.got }; }""", before)
        a0 = pg.evaluate(SNAP)
        opens = pg.evaluate("W4X.open()")
        set0 = before.get('mapSet', 'w1')
        to_map(pg)
        flew = False
        if name != 'w1part':
            # what was due on the map is shown first (晨光海 just done: its gold gate, "惊喜来啦！"); the flight comes after it -
            # on this map, or the next time the map comes up (§10.4)
            for k in range(2):
                try:
                    pg.wait_for_function("MapView.set === 'w4' && Store.s.w4seen && !MapView.sailing", timeout=15000)
                    flew = True; break
                except Exception:
                    flew = False
                    pg.evaluate("() => { MapView.closePanel(true); MapView.after(10); }")
        pg.wait_for_timeout(600)
        a1 = pg.evaluate(SNAP)
        st = pg.evaluate("({ seen: Store.s.w4seen, from: Store.s.w4from, w4: Store.s.w4, set: MapView.set, first: ORDER.w4[0] && Store.w(ORDER.w4[0]).unlocked })")
        ok_same = a0 == b and all(a1[k] == b[k] for k in ('isl', 'learned', 'album', 'fin', 'ex', 'key')) and set(b['flags']) <= set(a1['flags']) and all(x or not y for x, y in zip(a1['gates'], b['gates']))      # a gate may only open (晨光海 done: its gold gate)
        diff = {k: (str(b[k])[:80], str(a0[k])[:80]) for k in b if a0.get(k) != b[k]}
        if name == 'w1part':
            log.check(ok_same and not opens and not st['w4'] and st['set'] == 'w1', '01 %s: everything as it was %s; 神笔海 not open yet (晨光海 not done) %s' % (name, diff, st))
        else:
            back = pg.evaluate("() => { MapView.tapIsland('gate'); return true; }")
            try:
                pg.wait_for_function("(s) => MapView.set === s && !MapView.sailing", arg=set0, timeout=15000)
                came = True
            except Exception:
                came = False
            pg.wait_for_timeout(400)
            ring = pg.evaluate("() => { const out = {}; ['w1', 'w2', 'w3'].filter(w => Prog.worldOpen(w)).forEach(w => { MapView.useSet(w); out[w] = MapView.gateTo(); }); MapView.useSet('" + set0 + "'); return out; }")
            want_ring = {'w1': 'w2', 'w2': 'w3' if b['gates'][2] else 'w1', 'w3': 'w1'}
            pg.evaluate("() => { MapView.after(10); }"); pg.wait_for_timeout(1500)
            again = pg.evaluate("MapView.set")
            log.check(ok_same and opens and flew and st['seen'] and st['from'] == set0 and st['first'] and came and all(ring[w] == want_ring[w] for w in ring) and again == set0,
                      '01 %s: everything as it was %s; the first map flew to 神笔海 by itself (from %s) %s, the moon gate brought it back %s, only once (%s); gate ring %s' % (name, diff, set0, st, came, again, ring))
        log.check(not pg.errors, '01 %s no page errors %s' % (name, pg.errors[:3]))
        pg.context.close()

    # 02 晨光海 not done: no brush, no way in
    pg = fresh(br, base, save=SAVES['w1part']); to_map(pg); pg.wait_for_timeout(500)
    r = pg.evaluate("() => { MapView.useSet('w4'); return { set: MapView.set, brush: !!MapView.isl.brush, dom: !!document.querySelector('.isl.brush'), open: Prog.worldOpen('w4') }; }")
    log.check(r == {'set': 'w1', 'brush': False, 'dom': False, 'open': False}, '02 晨光海 not done: no brush on the map, 神笔海 cannot be opened %s' % r)
    pg.context.close()

    # 03 the brush: three seas, eight sizes
    probs = []
    for vw, vh in ((1180, 820), (1024, 768), (1194, 834), (1366, 1024), (820, 1180), (768, 1024), (834, 1194), (1024, 1366)):
        pg = fresh(br, base, vw, vh, save=SAVES['w3'])
        pg.evaluate("() => { Store.s.w4seen = true; Store.save(); }")
        to_map(pg); pg.wait_for_timeout(400)
        for w in ('w1', 'w2', 'w3'):
            a = pg.evaluate("""(w) => { MapView.closePanel(true); MapView.useSet(w); MapView.update(); const B = MapView.isl.brush; if (!B) return null;
              const R = e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
              const h = R(B.hit), c = document.elementFromPoint((h.x + h.r) / 2, (h.y + h.b) / 2);
              const others = Object.keys(MapView.isl).filter(k => k !== 'brush').map(k => [k, R(MapView.isl[k].hit)]).concat(%s.map(s => [s, document.querySelector(s)]).filter(x => x[1] && x[1].offsetParent !== null).map(x => [x[0], R(x[1])]));
              const gap = (A, B2) => Math.max(B2.x - A.r, A.x - B2.r, B2.y - A.b, A.y - B2.b);
              return { h, top: !!c && B.hit.contains(c) || c === B.hit, vw: innerWidth, vh: innerHeight, near: others.map(([k, o]) => [k, Math.round(gap(h, o))]).filter(x => x[1] < 4) }; }""" % json.dumps(CORNERS), w)
            if not a:
                probs.append((vw, vh, w, 'no brush')); continue
            h = a['h']
            if min(h['w'], h['h']) < 88 or h['x'] < 0 or h['y'] < 0 or h['r'] > a['vw'] or h['b'] > a['vh'] or not a['top'] or a['near']:
                probs.append((vw, vh, w, round(h['w']), a['top'], a['near']))
        pg.context.close()
    log.check(not probs, '03 the brush on 晨光海, 星光海, 彩虹海 at eight sizes: 110 px, on screen, on top, clear of islands, gate and corner buttons %s' % probs[:8])
    pg = fresh(br, base, save=SAVES['w2'])
    pg.evaluate("() => { Store.s.w4seen = true; Store.save(); }"); to_map(pg); pg.wait_for_timeout(400)
    b = pg.evaluate("() => { const r = MapView.isl.brush.hit.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }")
    pg.mouse.click(b[0], b[1])
    try:
        pg.wait_for_function("MapView.set === 'w4' && !MapView.sailing", timeout=15000); there = True
    except Exception:
        there = False
    g = pg.evaluate("() => { const r = MapView.isl.gate.hit.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, !MapView.isl.brush]; }")
    pg.mouse.click(g[0], g[1])
    try:
        pg.wait_for_function("MapView.set === 'w2' && !MapView.sailing", timeout=15000); home = True
    except Exception:
        home = False
    log.check(there and g[2] and home, '03 a real tap on the brush flies to 神笔海 (no brush there), a real tap on its moon gate back to 星光海 %s %s' % (there, home))
    pg.context.close()

    # 04 islands not live: clouds, "新岛还在建哦！"
    pg = fresh(br, base, save=SAVES['w1done'])
    pg.evaluate("() => { Store.s.w4seen = true; Store.save(); }"); to_map(pg); pg.wait_for_timeout(300)
    r = pg.evaluate("""() => { MapView.useSet('w4'); MapView.update(); window.__s = []; const f = Voice.sayNow; Voice.sayNow = function (t, o) { window.__s.push(t); return f.call(this, t, o); };
      const soon = Object.keys(MapView.isl).filter(k => /^soon/.test(k)); if (soon.length) MapView.tapIsland(soon[0]);
      return { live: ORDER.w4.slice(), soon: soon.length, said: window.__s.slice(), locked: soon.every(k => MapView.isl[k].d.classList.contains('locked')), data: Object.keys(ISL).filter(k => ISL[k].w === 'w4'), partial: !!WORLDS_INFO.w4.partial, panel: !!MapView.panel }; }""")
    want_soon = 7 - len(r['live'])
    log.check(r['soon'] == want_soon and (not want_soon or ('新岛还在建哦！' in r['said'] and r['locked'] and not r['panel'])) and r['data'] == r['live'] and r['partial'] == (want_soon > 0),
              '04 %d live, %d clouds that say "新岛还在建哦！" and never open; only live islands in the data %s' % (len(r['live']), r['soon'], r))
    pg.context.close()

    # 05 the festival and the finale (the sea made complete for the test)
    pg = fresh(br, base, save=SAVES['w1done'])
    pg.evaluate("() => { Store.s.w4seen = true; Store.save(); }"); to_map(pg); pg.wait_for_timeout(300)
    pg.evaluate("""() => { WORLDS_INFO.w4.partial = false; ORDER.w4.forEach(id => { const ws = Store.w(id); ws.unlocked = true; ws.pok = true; ISL[id].games.forEach(g => { ws.gstars[g] = 5; }); });
      Prog.check(false); Store.save(); MapView.closePanel(true); MapView.built = false; document.getElementById('islands').innerHTML = ''; MapView.isl = {}; MapView.set = 'w4'; MapView.build(); MapView.after(10); }""")
    try:
        pg.wait_for_function("Screens.cur === 'finale'", timeout=40000)
        fin = pg.evaluate("() => ({ bg: getComputedStyle(document.querySelector('#finale .fbg')).backgroundImage, crowd: document.querySelectorAll('#finale .crowd img').length, fin: Store.s.fin.w4, flags: ORDER.w4.every(id => Store.s.flags.includes(id)), fest: !!MapView.isl.fest })")
    except Exception as e:
        fin = {'err': str(e)[:100]}
    log.check('finale_w4' in fin.get('bg', '') and fin.get('crowd', 0) >= 3 and fin.get('fin') == 'seen' and fin.get('flags') and fin.get('fest'),
              '05 every flag of 神笔海 -> the temple fair island opens and 神笔海\'s own finale plays %s' % fin)
    pg.context.close()

    # 06 the parent panel
    pg = fresh(br, base, save=SAVES['w1done'])
    pg.evaluate("() => { Store.s.w4seen = true; Store.save(); }"); to_map(pg); pg.wait_for_timeout(300)
    r = pg.evaluate("""() => { Parent.open(); const sh = document.querySelector('#parent .sheet'), h = Array.from(sh.querySelectorAll('h3')).map(e => e.textContent);
      const rows = Array.from(sh.querySelectorAll('table')).find(t => /统编一上/.test(t.textContent)); const go = sh.querySelector('[data-w4go]');
      return { h: h.filter(x => /神笔海/.test(x)), rows: rows ? rows.querySelectorAll('tr').length - 1 : 0, go: !!go && !go.disabled, lessons: LESSONS4.length }; }""")
    pg.evaluate("() => document.querySelector('#parent .sheet [data-w4go]').click()")
    try:
        pg.wait_for_function("MapView.set === 'w4' && !MapView.sailing && !document.querySelector('#parent').classList.contains('on')", timeout=15000); flew = True
    except Exception:
        flew = False
    log.check(len(r['h']) >= 2 and r['rows'] == r['lessons'] and r['go'] and flew, '06 the parent panel: 神笔海\'s section and lesson table (%d rows), "现在就去神笔海" flies there %s %s' % (r['rows'], r, flew))
    pg.context.close()
    pg = fresh(br, base); to_map(pg)
    r = pg.evaluate("() => { const a = Prog.worldOpen('w4'); Parent.open(); const b = Array.from(document.querySelectorAll('#parent .pbtn')).find(x => x.textContent === '全部解锁'); b.click(); Parent.close(); Prog.check(false); return [a, Prog.worldOpen('w4'), ORDER.w4.every(id => Store.w(id).unlocked)]; }")
    log.check(r == [False, True, True], '06 a new save: 神笔海 closed; 全部解锁 opens it and its islands %s' % r)
    pg.context.close()

    # 07 the red dot
    pg = fresh(br, base, save=SAVES['w2'])
    pg.evaluate("() => { Store.s.w4seen = true; Store.save(); }"); to_map(pg); pg.wait_for_timeout(400)
    r = pg.evaluate("() => ({ open: W4X.open(), low: Supply.low(), dot: document.querySelector('#gear').classList.contains('dot'), left: ALL_ISL().filter(id => !flagged(id)).length })")
    log.check(r['open'] and not r['low'] and not r['dot'], '07 神笔海 open, %d islands still to flag: no red dot %s' % (r['left'], r))
    pg.context.close()

    # 08 budget, offline list, an island opened before its file has come
    html = open(os.path.join(ROOT, os.environ.get('KM_PAGE', 'index.html')), 'rb').read()
    gz = len(gzip.compress(html, 9))
    log.check(len(html) <= 640000 and gz <= 180000, '08 the first screen: index.html %d bytes (<= 640,000), gzip %d (<= 180,000)' % (len(html), gz))
    sw = open(os.path.join(ROOT, 'sw.js'), encoding='utf-8').read()
    tracked = subprocess.run(['git', 'ls-files', 'assets/js/w4.js'], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    if tracked:
        log.check('./assets/js/w4.js' in sw and './assets/data/hanzi_extra.json' in sw, '08 assets/js/w4.js and hanzi_extra.json are in the offline list (sw.js)')
    else:
        log.warn('08 assets/js/w4.js is not in git yet: at the release `git add assets` then `python tools/gen_sw_list.py` puts it in the offline list')
    held = []                                  # w4.js is held back until the panel has been looked at
    pg = fresh(br, base, save=SAVES['w1done'], route=lambda route: held.append(route))
    pg.evaluate("() => { Store.s.w4seen = true; Store.s.mapSet = 'w4'; Store.save(); }")
    pg.reload(); pg.wait_for_function('window.__ready === true', timeout=20000)
    to_map(pg)
    first = pg.evaluate("ORDER.w4[0]")
    pg.wait_for_timeout(300)
    r1 = pg.evaluate("(id) => { MapView.openPanel(id); return { loaded: W4Lazy.loaded, spin: document.querySelectorAll('[data-game]').length, icons: !!GAMES[ISL[id].games[0]] }; }", first)
    pg.evaluate("(id) => { Session.start(id, ISL[id].games[0], { level: 2, seed: 3 }); }", first)
    pg.wait_for_timeout(300)
    for r_ in held:
        r_.continue_()
    try:
        pg.wait_for_function("window.__q && ['ready','act','input'].includes(window.__q.phase)", timeout=30000); played = True
    except Exception:
        played = False
    log.check(not r1['loaded'] and r1['spin'] == 4 and not r1['icons'] and played and not pg.errors, '08 an island of 神笔海 opened before w4.js came: its four buttons wait (spinning), then the game plays %s %s %s' % (r1, played, pg.errors[:2]))
    pg.context.close()

    # 09 validate before w4.js: the stars stay
    pg = fresh(br, base, save=SAVES['w1done'], route=lambda route: route.abort())
    first = pg.evaluate("ORDER.w4[0]")
    pg.evaluate("(id) => { const o = JSON.parse(localStorage.getItem('zzi.v1')); o.worlds[id] = { unlocked: true, gstars: { [id + ':find']: 3, [id + ':write']: 5 }, played: [id + ':find'], visits: 2, sessions: 2, stars: 8, story: 0 }; localStorage.setItem('zzi.v1', JSON.stringify(o)); }", first)
    pg.reload(); pg.wait_for_function('window.__ready === true', timeout=20000)
    r = pg.evaluate("(id) => ({ loaded: W4Lazy.loaded, gs: Store.s.worlds[id].gstars, played: Store.s.worlds[id].played })", first)
    log.check(not r['loaded'] and r['gs'].get(first + ':find') == 3 and r['gs'].get(first + ':write') == 5 and r['played'] == [first + ':find'], '09 Store.validate before w4.js (even when it cannot come): 神笔海\'s stars are kept %s' % r)
    pg.context.close()
    br.close()
sys.exit(0 if log.close() else 1)
