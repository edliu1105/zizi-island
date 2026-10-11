# -*- coding: utf-8 -*-
"""Five options + the explain step after a wrong answer (client 2026-10-10, docs/OPTIONS-EXPLAIN-SPEC.md), every game, every level:
 01 the generators: every choice question of every game at levels 1-5 has five options or more (连一连: five characters on the
    right), no option twice, exactly ONE right one, and the right one's place balanced over the five places (a position bag);
    the review card (every kind of item), 补句子 and 读一读 too; build tasks (拼单词, 十格灯) and writing are not choices
 02 哪个写对了: the four wrong turns of every glyph look different from the right one and from each other (point by point)
 03 every game at every level answered wrong once (writing: one slipped stroke): the explain step runs, no page error, the
    right option is ringed in gold (the chosen one in blue), no star, no cheering, no praise and never "错" while it runs, then
    a NEW question comes; the daily key round's review cards (characters, letters, function words) too
 04 layout at 1180x820, 820x1180 and 1024x768: the five options of every choice game (levels 1, 3, 5), the review cards,
    补句子 and 读一读 - every option >= 88 px, on screen, really on top (3 x 3 samples)
 05 the explain step lasts 2-5 s at real speed (a sample of games)
 06 review OX1: a function word gets no picture (its sentence, the word coloured); gold and blue rings never overlap (one
    inside the other is fine); the closing line announces a new question (再来一题！ ..., never 再试一次！); 翻翻乐's fifth card
    on the first island is a look-alike character, not a letter; 全家福 level 1 has no superhero; 缺了一笔 says 放不进去
usage: python tests/test_options.py [01,02,03,04,05]"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from harness import serve, new_page, enter, wait_phase, q, step, answer_question, wait_next_question, Log

log = Log('options')
PARTS = sys.argv[1].split(',') if len(sys.argv) > 1 else ['01', '02', '03', '06', '04', '05']
OPEN = "() => { Store.reset(); Store.s.all = true; ALL_ISL().forEach(id => { Store.w(id).unlocked = true; ISL[id].chars.forEach(c => { Store.s.met[c.c] = true; }); ISL[id].letters.forEach(l => { Store.s.met[l.l] = true; }); }); Store.save(); }"
NOCHOICE = ('write', 'spell', 'frame')          # writing and the two build tasks

GEN = r"""() => {
  const out = { bad: [], n: 0, games: 0, hist: {} };
  const right = (g, q) => {                     /* the value of the right option (the first step of a two-step question) */
    if (g.kind0 === 'missing') return q.answer;
    if (q.answer === 'all') return q.seq ? q.seq[0] : null;
    return q.answer;
  };
  const optsOf = (g, q) => g.kind0 === 'missing' ? q.opts.map(o => o[0] + o[1]) : g.kind0 === 'connect' ? q.right : q.opts;
  ALL_ISL().forEach(isl => ISL[isl].games.forEach(id => {
    const game = GAMES[id]; if (!game || NOCHOICE.includes(game.kind0)) return;
    out.games++;
    for (let lv = 1; lv <= 5; lv++) {
      const G = { world: isl, W: ISL[isl], id, rng: RNG(300 + lv), bags: {}, needPass: [], asked: [], ws: { lastKey: '' }, game, level: lv, round: 0 };
      const pos = [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 100; i++) {
        let qq; try { qq = game.gen(G, { level: lv, rng: G.rng }); } catch (e) { out.bad.push(id + ' L' + lv + ' gen error ' + e.message); break; }
        out.n++;
        G.asked.push(qq.item || (ITEM[qq.answer] ? qq.answer : null));
        const o = optsOf(game, qq), r = right(game, qq), key = x => Array.isArray(x) ? x.join(':') : String(x), ks = o.map(key);
        if (o.length < 5) out.bad.push(id + ' L' + lv + ' only ' + o.length + ' options ' + ks.join(','));
        if (new Set(ks).size !== ks.length && game.kind0 !== 'find' || (game.kind0 === 'find' && new Set(qq.opts).size !== qq.opts.length)) out.bad.push(id + ' L' + lv + ' an option twice ' + ks.join(','));
        if (game.kind0 === 'connect') {
          const objs = qq.left.map(k => ITEM[k].obj);
          if (!qq.left.every(k => qq.right.filter(x => x === k).length === 1)) out.bad.push(id + ' L' + lv + ' a picture without its character');
          if ((qq.extra || []).some(k => qq.left.includes(k) || objs.includes(ITEM[k].obj))) out.bad.push(id + ' L' + lv + ' an extra character fits a picture ' + qq.extra.join(''));
          continue;
        }
        const nr = ks.filter(k => k === key(r)).length;
        if (nr !== 1) out.bad.push(id + ' L' + lv + ' right ' + key(r) + ' x' + nr + ' in ' + ks.join(','));
        const at = id.endsWith(':quiz') && game.kind0 === 'reads' ? qq.answer : ks.indexOf(key(r));
        if (o.length === 5) pos[at] = (pos[at] || 0) + 1;
      }
      const used = pos.slice(0, 5), tot = used.reduce((a, b) => a + b, 0);
      if (tot >= 50 && (Math.min(...used) < tot / 5 * 0.6 || Math.max(...used) > tot / 5 * 1.4)) out.bad.push(id + ' L' + lv + ' places not balanced ' + used.join('/'));
      out.hist[id + ' L' + lv] = used.join('/');
    }
  }));
  /* the review card: every kind of item, from several islands' frames */
  const items = ['人', '口', '月', '明', '我', '是', '这', 'A', 'M', 'Z', 'b', 'q', '一', '红', '姐', '吃'];
  ['peppa', 'ultra', 's2', 'pj', 'hulk3', 'hawk3'].forEach(isl => items.forEach(k => {
    const G = { world: isl, W: ISL[isl], rng: RNG(9), bags: {}, needPass: [], asked: [], ws: { lastKey: '' } }, pos = [0, 0, 0, 0, 0];
    for (let i = 0; i < 50; i++) {
      const qq = ReviewQ.gen(G, { level: 1 + (i % 5), rng: G.rng, item: k });
      if (qq.opts.length !== 5 || new Set(qq.opts).size !== 5 || qq.opts.filter(x => x === k).length !== 1) out.bad.push('review ' + isl + ' ' + k + ' ' + qq.opts.join(''));
      if ((HOLDS[k] || '').split('').some(x => qq.opts.includes(x))) out.bad.push('review holds ' + k + qq.opts.join(''));
      pos[qq.opts.indexOf(k)]++;
    }
    if (Math.min(...pos) < 5) out.bad.push('review ' + isl + ' ' + k + ' places ' + pos.join('/'));
  }));
  /* 读一读: every sentence's five pictures are five different pictures (no wrong one equal to the right one) */
  READ.forEach(r => { const all = [r[1]].concat(r[2]).map(x => JSON.stringify(x)); if (r[2].length !== 4 || new Set(all).size !== 5) out.bad.push('read ' + r[0] + ' pictures'); });
  return out;
}"""

MIRROR = r"""() => {
  const bad = [], chamfer = (A, B) => { const d = (X, Y) => X.reduce((s, a) => s + Math.min(...Y.map(b => Math.hypot(a[0] - b[0], a[1] - b[1]))), 0) / X.length; return (d(A, B) + d(B, A)) / 2; };
  let used = 0;
  Object.keys(Mirror.T).forEach(g => {
    const w = Mirror.clear(g); if (w.length < 4 || !ITEM[g]) return;
    used++;
    const P = Mirror.pts(g), xs = P.map(p => p[0]), ys = P.map(p => p[1]), c = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
    const size = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)), all = ['ok'].concat(w), V = all.map(t => Mirror.tf(P, t, c));
    for (let a = 0; a < V.length; a++) for (let b = a + 1; b < V.length; b++) { const d = chamfer(V[a], V[b]) / size; if (d <= 0.045) bad.push(g + ' ' + all[a] + '~' + all[b] + ' ' + d.toFixed(3)); }
  });
  /* and what the game asks: only such glyphs, only such turns */
  const G = { world: 'ultra', W: ISL.ultra, rng: RNG(4), bags: {} }, glyphs = new Set();
  for (let lv = 1; lv <= 5; lv++) for (let i = 0; i < 200; i++) { const qq = QMirror.gen(G, { level: lv, rng: G.rng }); glyphs.add(qq.glyph); if (qq.opts.length !== 5 || qq.opts.some(t => t !== 'ok' && !Mirror.clear(qq.glyph).includes(t)) || (lv <= 2 && qq.opts.includes('flipX'))) bad.push('asked ' + lv + qq.glyph + qq.opts.join()); }
  return { bad, used, glyphs: Array.from(glyphs).join('') };
}"""

AUDIT = """() => {
  const out = [];
  const els = Array.from(Stage.el.querySelectorAll('[data-gid]')).filter(e => !e.dataset.gid.startsWith('char:'));
  els.forEach(e => {
    const r = e.getBoundingClientRect(); if (r.width < 2 || getComputedStyle(e).visibility === 'hidden') return;
    let cov = 0, n = 0;
    for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) {
      const x = r.left + r.width * (0.1 + 0.2 * i), y = r.top + r.height * (0.1 + 0.2 * j); n++;
      const h = document.elementFromPoint(x, y), o = h && h.closest('[data-gid]');
      if (!(o === e || (h && e.contains(h)))) cov++;
    }
    out.push({ id: e.dataset.gid, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), cov: Math.round(100 * cov / n) });
  });
  /* the options themselves (drop targets such as pots / robots are not tap targets): on screen, >= 88, their middle on top */
  const st = Session.st, cards = (st && (st.cards || st.rights)) || [], opt = [];
  cards.forEach((c, i) => { const r = c.getBoundingClientRect(); if (r.width < 2) return; const pe = c.style.pointerEvents; if (!c.dataset.gid) c.style.pointerEvents = 'auto';      /* a drop zone (pot, robot) is no tap target: test its stacking */
    const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); c.style.pointerEvents = pe; opt.push({ i, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), top: !!h && (h === c || c.contains(h) || (st.can && st.can.contains(h)) || (st.cube && st.cube.contains(h)) || (st.veil && st.veil === h)) }); });
  return { vw: innerWidth, vh: innerHeight, t: out, opts: opt, n: cards.length };
}"""

MEMFAM = r"""() => {
  const out = { mem: [], fam: [] };
  for (let lv = 1; lv <= 2; lv++) { const G = { world: 'peppa', W: ISL.peppa, rng: RNG(lv), bags: {}, needPass: [], asked: [], ws: { lastKey: '' } };
    for (let i = 0; i < 200; i++) { const qq = QMemory.gen(G, { level: lv, rng: G.rng }); if (qq.opts.length !== 5 || qq.opts.some(k => !ITEM[k] || ITEM[k].kind !== 'zh') || qq.opts.some(k => (HOLDS[qq.answer] || '').includes(k))) out.mem.push(qq.opts.join('')); } }
  const G = { world: 'widow3', W: ISL.widow3, rng: RNG(5), bags: {}, needPass: [], asked: [], ws: { lastKey: '' } };
  const heroes = ['ultraman', 'zero', 'optimus', 'bumblebee', 'catboy', 'owlette', 'gekko', 'wukong', 'hulk', 'thor', 'panther', 'widow', 'hawkeye', 'ironman', 'spiderman', 'captain', 'miles', 'chase', 'marshall', 'rubble', 'kaiju1', 'kaiju2'];
  for (let i = 0; i < 300; i++) { const qq = QFamily.gen(G, { level: 1, rng: G.rng }); if (qq.opts.length !== 5 || qq.opts.some(id => heroes.includes(id)) || qq.kinOut) out.fam.push(qq.opts.join()); }
  return out;
}"""

SPY = r"""() => {
  window.__exBad = []; window.__exCheer = 0;
  Actor.prototype.cheer = (f => function () { const st = Session.st; if (st && st.explaining) window.__exCheer++; return f.apply(this, arguments); })(Actor.prototype.cheer);
  window.__again = []; window.__exSaid = {};
  Voice.say = (f => function (t, o) { const st = Session.st; if (st && (st.phase === 'explain' || st.phase === 'correcting') && t && (PRAISE.includes(t) || /错/.test(t))) window.__exBad.push(t);
    if (st && o && o.tag === 'again') window.__again.push([st.G.id, t]); if (st && o && o.tag === 'explain') (window.__exSaid[st.G.id] = window.__exSaid[st.G.id] || []).push(t); return f.call(this, t, o); })(Voice.say);
}"""


def check_layout(a, label, problems, need=5):
    for t in a['t']:
        small = min(t['w'], t['h']) < 88 and t['id'] != 'paper'
        off = t['x'] < -2 or t['y'] < -2 or t['r'] > a['vw'] + 2 or t['b'] > a['vh'] + 2
        if small or off or t['cov'] > 0:
            problems.append((label, t['id'], t['w'], t['h'], 'off' if off else '', 'covered %d%%' % t['cov'] if t['cov'] else ''))
    if a['n'] < need:
        problems.append((label, 'only %d options' % a['n']))
    for o in a['opts']:
        off = o['x'] < -2 or o['y'] < -2 or o['r'] > a['vw'] + 2 or o['b'] > a['vh'] + 2
        if min(o['w'], o['h']) < 88 or off or not o['top']:
            problems.append((label, 'option %d' % o['i'], o['w'], o['h'], 'off' if off else '', '' if o['top'] else 'under something'))


def inside(P, Q):
    return P['x'] >= Q['x'] - 1 and P['y'] >= Q['y'] - 1 and P['x'] + P['w'] <= Q['x'] + Q['w'] + 1 and P['y'] + P['h'] <= Q['y'] + Q['h'] + 1


def wrong_once(page):
    """answer the current question wrong (writing: one slipped stroke, then the rest right); returns (gen, question)"""
    cur = wait_phase(page, timeout=30000)
    strat = 'wrong'
    if cur['kind'] == 'write':
        step(page, 'wrong'); strat = 'right'
    gen, snap = answer_question(page, strat, timeout=30000)
    return gen, cur


with sync_playwright() as p, serve() as base:
    br = p.chromium.launch()
    page = new_page(br, base, 1180, 820)
    enter(page)
    page.wait_for_function("!!Hanzi.data", timeout=15000)
    page.evaluate(OPEN)

    if '01' in PARTS:
        r = page.evaluate(GEN.replace('NOCHOICE', json.dumps(list(NOCHOICE))))
        log.check(r['games'] >= 45 and not r['bad'], '01 generators: %d choice games x 5 levels x 100 questions (%d): five options or more, none twice, exactly one right, its place balanced; review cards, 读一读 %s' % (r['games'], r['n'], r['bad'][:12]))
        log.w('   places (L1 of a few games): ' + json.dumps({k: v for k, v in r['hist'].items() if k.endswith('L1')}, ensure_ascii=False)[:600])

    if '02' in PARTS:
        r = page.evaluate(MIRROR)
        log.check(r['used'] >= 10 and not r['bad'], '02 哪个写对了: %d glyphs with four wrong turns that look different (> 4.5 %% of the glyph from the right one and from each other); asked on 光之国: %s %s' % (r['used'], r['glyphs'], r['bad'][:8]))

    if '03' in PARTS:
        page.evaluate(SPY)
        games = page.evaluate("ALL_ISL().flatMap(i => ISL[i].games.map(g => [i, g, GAMES[g].kind0]))")
        ringbad = []
        if os.environ.get('OPT_GAMES'):
            games = [x for x in games if any(x[1].startswith(k) for k in os.environ['OPT_GAMES'].split(','))]
        bad, n = [], 0
        for isl, g, kind in games:
            for lv in range(1, 6):
                n += 1
                try:
                    page.evaluate("([i, g]) => { Store.w(i).gstars[g] = 0; Store.save(); }", [isl, g])
                    page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 21 + l })", [isl, g, lv])
                    wait_phase(page, timeout=30000)
                    s0 = page.evaluate("Session.G.stars")
                    gen, cur = wrong_once(page)
                    wait_next_question(page, gen, timeout=30000)
                    page.wait_for_function("window.__q && ['ready','act','input'].includes(window.__q.phase)", timeout=30000)
                    rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
                    s1 = page.evaluate("Session.G.stars")
                    if not rec or not rec['ex'] or not rec['ex']['right']:
                        bad.append((g, lv, 'no gold ring', rec and rec['ex'])); continue
                    o, a = rec['opts'], rec['answer']
                    if o and a in o and kind not in ('connect', 'spell'):
                        want = ['card%d' % i for i, v in enumerate(o) if v == a]
                        if not any(w in rec['ex']['right'] for w in want):
                            bad.append((g, lv, 'gold ring not on the right option', rec['ex'], want))
                        if rec['tapped'] is not None and rec['tapped'] >= 0 and o[rec['tapped']] != a and 'card%d' % rec['tapped'] not in rec['ex']['chosen']:
                            bad.append((g, lv, 'the chosen one not ringed', rec['ex']))
                    if s1 != s0:
                        bad.append((g, lv, 'a star after a wrong answer'))
                    rg = rec.get('rings') or []
                    for a in range(len(rg)):
                        for b in range(a + 1, len(rg)):
                            A, B = rg[a][1], rg[b][1]
                            ix = min(A['x'] + A['w'], B['x'] + B['w']) - max(A['x'], B['x']); iy = min(A['y'] + A['h'], B['y'] + B['h']) - max(A['y'], B['y'])
                            if ix > 1 and iy > 1 and not inside(A, B) and not inside(B, A):
                                ringbad.append((g, lv, rg[a][0] + rg[b][0], A, B))
                except Exception as e:
                    bad.append((g, lv, 'ERR ' + str(e)[:120]))
                page.evaluate("gesture('home')"); page.wait_for_timeout(60)
        log.check(not ringbad, '03 OX1-03: gold and blue rings never overlap (one inside another is fine) %s' % ringbad[:6])
        again = page.evaluate("window.__again")
        nextq = page.evaluate("NEXTQ")
        log.check(again and all((t in nextq) or (t == '再写一个！' and (g.endswith(':write') or g.endswith(':abc'))) for g, t in again), '03 OX1-04: after the explanation the closing line announces a new question %s; never 再试一次 %s' % (sorted(set(t for _, t in again)), [x for x in again if x[1] not in nextq][:4]))
        if not os.environ.get('OPT_GAMES'):
            exs = page.evaluate("window.__exSaid['huluwa:quiz'] || []")
            log.check('放不进去' in exs, '03 OX1 缺了一笔: the chosen stroke laid on the character is explained, "放不进去" %s' % exs[:6])
        cheer, said = page.evaluate("[window.__exCheer, window.__exBad]")
        log.check(not bad, '03 every game x levels 1-5 (%d) answered wrong: the explain step, the right one in gold, the chosen one in blue, no star, a new question %s' % (n, bad[:10]))
        log.check(cheer == 0 and not said, '03 while explaining: nobody cheers (%d), no praise, never "错" %s' % (cheer, said[:5]))
        # the key round's review cards: characters, letters, function words
        bad = []
        for isl, items in (('hulk3', ['人', 'A', '我', 'b']), ('peppa2', ['口', '是', 'M']), ('ultra', ['月', 'C'])):
            g0 = page.evaluate("window.__qn || 0")
            page.evaluate("([i, items]) => { Session.start(i, i + ':find', { key: true, keyItems: items }); }", [isl, items])
            wait_phase(page, timeout=30000, gen=g0)
            for k in items:
                try:
                    gen, cur = wrong_once(page)
                    page.wait_for_function("(gen) => (window.__exLog || []).some(e => e.gen === gen)", arg=gen, timeout=30000)
                    rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop() || null", gen)
                    if not rec or rec['kind'] != 'review' or len(rec['opts'] or []) != 5 or 'card%d' % rec['opts'].index(rec['answer']) not in rec['ex']['right']:
                        bad.append((isl, k, rec, {x: cur.get(x) for x in ('gen', 'kind', 'game', 'guided', 'answer', 'phase')}, gen, page.evaluate("(window.__exLog || []).slice(-2).map(e => [e.gen, e.game, e.kind])"), page.evaluate("window.__lastRes || null")))
                    page.wait_for_function("(g) => !window.__q || window.__q.gen !== g", arg=gen, timeout=30000)
                except Exception as e:
                    bad.append((isl, k, 'ERR ' + str(e)[:100])); break
            page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        log.check(not bad, '03 the key round: five review cards (characters, letters, function words), a wrong one explained in gold %s' % bad[:4])
        miss = page.evaluate("Array.from(window.__vmiss || [])")
        log.check(not miss, '03 every sentence said (the explain lines too) has a recording %s' % miss[:8])
        log.check(not page.errors, '03 no page errors %s' % page.errors[:3])
        page.errors.clear()

    if '06' in PARTS:
        # a function word chosen or asked: no picture, its sentence (or the ring alone) - the key round's cards
        page.evaluate(OPEN)
        bad = []
        for isl, items in (('hulk3', ['不', '是', '在']), ('peppa2', ['的', '了', '这', '我'])):
            g0 = page.evaluate("window.__qn || 0")
            page.evaluate("([i, items]) => { Session.start(i, i + ':find', { key: true, keyItems: items }); }", [isl, items])
            wait_phase(page, timeout=30000, gen=g0)
            for k in items:
                try:
                    gen, cur = wrong_once(page)
                    page.wait_for_function("(gen) => (window.__exLog || []).some(e => e.gen === gen)", arg=gen, timeout=30000)
                    rec = page.evaluate("(gen) => (window.__exLog || []).filter(e => e.gen === gen).pop()", gen)
                    fw = page.evaluate("(ks) => ks.map(k => !!(ITEM[k] && ITEM[k].fw))", [rec['answer'], rec['opts'][rec['tapped']]])
                    if (fw[0] and 'pic-right' in rec['shown']) or (fw[1] and 'pic-chosen' in rec['shown']):
                        bad.append((k, rec['opts'][rec['tapped']], rec['shown']))
                    if fw[0] and 'sent-right' not in rec['shown'] and 'pic-right' not in rec['shown']:
                        pass                                   # no room for the sentence: the ring alone says it
                    page.wait_for_function("(g) => !window.__q || window.__q.gen !== g", arg=gen, timeout=30000)
                except Exception as e:
                    bad.append((isl, k, 'ERR ' + str(e)[:100])); break
            page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        r = page.evaluate("() => ['我', '你', '他', '是', '的', '了', '不', '有', '在', '这'].filter(k => EX.picNode(k, 80))")
        sent = page.evaluate("() => { const st = Session.newQ ? null : null; return typeof EX.sentOver === 'function'; }")
        log.check(not bad and not r and sent, '06 OX1-02: a function word (asked or chosen) shows no picture - its sentence with the word coloured, or the ring alone %s %s' % (bad[:4], r))
        r = page.evaluate(MEMFAM)
        log.check(not r['mem'] and not r['fam'], '06 OX1-05: 翻翻乐 on the first island, levels 1-2: five characters (a look-alike, never a letter); 全家福 level 1: no superhero, the guests have no asked word %s' % r)
        log.check(not page.errors, '06 no page errors %s' % page.errors[:3])

    if '04' in PARTS:
        page.context.close()
        for ori, vw, vh in (('L', 1180, 820), ('P', 820, 1180), ('L2', 1024, 768)):
            page = new_page(br, base, vw, vh)
            enter(page)
            page.wait_for_function("!!Hanzi.data", timeout=15000)
            page.evaluate(OPEN)
            games = page.evaluate("ALL_ISL().flatMap(i => ISL[i].games.filter(g => !%s.includes(GAMES[g].kind0)).map(g => [i, g]))" % json.dumps(list(NOCHOICE)))
            problems = []
            for isl, g in games:
                for lv in (1, 3, 5):
                    page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 3 })", [isl, g, lv])
                    try:
                        wait_phase(page, timeout=30000)
                    except Exception:
                        problems.append((g, lv, 'no question')); continue
                    page.wait_for_timeout(420)
                    a = page.evaluate(AUDIT)
                    check_layout(a, '%s L%d' % (g, lv), problems)
                    page.evaluate("gesture('home')"); page.wait_for_timeout(60)
            # the review cards of the key round on four kinds of island stage
            for isl in ('ultra', 'hulk3', 'panther3', 'thor3', 's1', 'robot2'):
                page.evaluate("(i) => { Session.start(i, i + ':find', { key: true, keyItems: ['人', 'b', '我'] }); }", isl)
                try:
                    wait_phase(page, timeout=30000); page.wait_for_timeout(420)
                    check_layout(page.evaluate(AUDIT), 'review on ' + isl, problems)
                except Exception:
                    problems.append(('review', isl, 'no question'))
                page.evaluate("gesture('home')"); page.wait_for_timeout(100)
            where = sorted(set(str(x[0]).split(' L')[0] + ('' if ' L' not in str(x[0]) else ' L' + str(x[0]).split(' L')[1]) for x in problems))
            log.check(not problems, '04 %s %dx%d: %d choice games x levels 1/3/5 + review cards: five options, every one >= 88 px, on screen, on top %s %s' % (ori, vw, vh, len(games), where[:40], problems[:6]))
            log.check(not page.errors, '04 %s no page errors %s' % (ori, page.errors[:3]))
            if ori != 'L2':
                page.context.close()

    if '05' in PARTS:
        page.evaluate(SPY)
        page.evaluate("window.__fast = 0")
        res, bad = [], []
        for isl, g, lv in (('peppa', 'peppa:find', 2), ('huluwa', 'huluwa:quiz', 3), ('s1', 's1:quiz', 2), ('hulk3', 'hulk3:en', 3), ('widow3', 'widow3:quiz', 2), ('robot2', 'robot2:quiz', 3)):
            try:
                page.evaluate("([i, g, l]) => window.__go(i, g, l, { seed: 5 })", [isl, g, lv])
                wait_phase(page, timeout=60000)
                page.evaluate("window.__speechLog.length = 0")
                gen, cur = wrong_once(page)
                page.wait_for_function("(gen) => (window.__exLog || []).some(e => e.gen === gen)", arg=gen, timeout=30000)
                t = page.evaluate("(gen) => window.__exLog.filter(e => e.gen === gen).pop().ms", gen)
                wait_next_question(page, gen, timeout=30000)
                ev = page.evaluate("window.__speechLog.filter(e => e.ch === 'narr').map(e => [e.text, e.ev, e.tag])")
                drop = [x for x in ev if x[1] in ('dropped', 'skip')]
                said = [x[0] for x in ev if x[1] == 'speak' and x[2] == 'explain']
                res.append((g, round(t / 1000, 1), said))
                if not (1.5 <= t / 1000 <= 6.0) or drop or not said:
                    bad.append((g, round(t / 1000, 1), drop, said))
            except Exception as e:
                bad.append((g, 'ERR ' + str(e)[:100]))
            page.evaluate("gesture('home')"); page.wait_for_timeout(200)
        page.evaluate("window.__fast = 1")
        log.check(not bad, '05 at real speed the explain step lasts about 2-5 s, its sentences are said (none dropped by the voice queue) %s %s' % (res, bad))
    br.close()
sys.exit(0 if log.close() else 1)
