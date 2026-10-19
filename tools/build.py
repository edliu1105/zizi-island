# -*- coding: utf-8 -*-
"""Assemble index.html: src/head.html + one <script> with the data (generated from tools/content.py), 点点岛's engine,
the letters, the writer, the app layer and the games. Zero dependencies in the page; this script only concatenates.
World 4 (神笔海, docs/W4-DESIGN.md §11): its first-screen part (the live islands' data, src/w4/boot.js) goes into index.html;
its plays and big tables into the lazily loaded assets/js/w4.js (src/w4/core.js + ancient.js + one file an island). Only the
islands listed in tools/w4_live.json are built in, in order, and only when their file passes `node --check`; the others are
clouds on the map ("新岛还在建哦！").
usage: python tools/build.py   [--live=ultra4,peppa4  --tag=p0  --stub=avengers4]
  --live: these islands instead of tools/w4_live.json; --tag: write index_<tag>.html + assets/js/w4_<tag>.js instead (a test
  snapshot that other work in the same tree cannot change: KM_PAGE=index_<tag>.html bash tests/run_all.sh)"""
import os, sys, json, re, hashlib, subprocess, shutil, gzip
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import (W1, W2, W3, CVC, WORDS2, FW_SENTS, FW_SENTS3, READ, BOOKS, WORDS3, NOWRITE3,
                     W4, NOWRITE4, CASTS4, AMB4, SKIN4, FALLBACK4, READ4, BOOKS4, SCROLLS4, SCROLL_KIND, WORDS4, SIGHT4, BRIDGE4, ESENT4,
                     TF4, PLACE4_THINGS, PLACE4_SPOTS, PLACE4, WORDS_ZH4, WORDS_ZH4_3, SENSE4, ENDPIC4, ORDER_RULES, ORDER_PAIRS, KIND4,
                     KIND4_LINE, KIND4_WORDS, BODY4, OPP4, OPP4_WORDS, LESSONS4, LOOK4, LOOK4_BACK, HOLDS4, SAMEPIC4, MOTION4, NAI_MILK, OBJ, DICT4,
                     SENT8, STORY8, BEATS8, BEATS8_PHRASES, SIGHT9, ESENT9, LESSONS4_89)
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
W4SRC = os.path.join(SRC, 'w4')
SKIN = {'s': 'avengers', 'peppa': 'peppa', 'bluey': 'bluey', 'huluwa': 'huluwa', 'paw': 'paw', 'xiyou': 'xiyou', 'ultra': 'avengers', 'robot': 'avengers', 'pj': 'avengers'}
AMB = {'s': 'city', 'peppa': 'rain', 'bluey': 'crickets', 'huluwa': 'wind', 'paw': 'waves', 'xiyou': 'falls', 'ultra': 'city', 'robot': 'city', 'pj': 'crickets',
       'hulk3': 'wind', 'thor3': 'rain', 'panther3': 'falls', 'widow3': 'city', 'hawk3': 'crickets'}
EN_SAY = {c: c for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'}
SLOTS4 = ['find', 'write', 'en', 'quiz']          # the game ids of a 神笔海 island: <id>:find / :write / :en / :quiz
BGSLOT4 = ['find', 'write', 'abc', 'quiz']        # ... and their backgrounds: <id>_find / _write / _abc / _quiz
j = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':'))


def letter_line(L, word):
    return '%s, %s!' % (L.upper() if L.isupper() else L.upper(), word)


def have(rel):
    """an art file of the app ('isl/ultra4' -> assets/isl/ultra4.png, 'bg/x' -> .jpg)"""
    ext = '.jpg' if rel.startswith('bg/') else '.png'
    return os.path.exists(os.path.join(ROOT, 'assets', rel + ext))


def art(rel):
    """the picture to use: the new one, or its fallback (docs/W4-DESIGN.md §8.3) while the new one is not there"""
    return rel if have(rel) else FALLBACK4.get(rel, rel)


def check_js(path):
    """node --check: a file that does not parse is left out (and its island does not go live)"""
    node = shutil.which('node')
    if not node:
        return True
    r = subprocess.run([node, '--check', path], capture_output=True, text=True)
    if r.returncode:
        print('NODE --check FAILED', os.path.relpath(path, ROOT), (r.stderr or '')[:600])
    return r.returncode == 0


ARGS = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
# --stub=avengers4,robot4 (a TEST snapshot only, with --tag): these islands are in the data (map, saves, finale) although their
# play files are not built in - tests/test_w4open.py checks ⑧ ⑨'s map and old saves before their games exist
STUB = set(ARGS.get('stub', '').split(',')) - {''} if 'tag' in ARGS else set()


def live_islands():
    """tools/w4_live.json, in the islands' order; an island only with its src/w4/<id>.js present and parsing, and only after
    every island before it (they open one after another, §10.8)"""
    try:
        want = ARGS['live'].split(',') if 'live' in ARGS else json.load(open(os.path.join(ROOT, 'tools', 'w4_live.json'), encoding='utf-8'))
    except Exception:
        want = []
    out = []
    for d in W4:
        f = os.path.join(W4SRC, d['id'] + '.js')
        if d['id'] not in want:
            break
        if d['id'] in STUB:
            out.append(d['id']); continue
        if not os.path.exists(f) or not check_js(f):
            print('NOT LIVE (src/w4/%s.js missing or broken)' % d['id'])
            break
        out.append(d['id'])
    if [x for x in want if x not in out]:
        print('w4_live.json asks for', want, '-> live:', out)
    return out


def data_js(live4):
    order, isl, items, extra_caps, seen = {'w1': [], 'w2': [], 'w3': [], 'w4': []}, {}, [], [], set()
    w4live = [d for d in W4 if d['id'] in live4]
    for wid, lst in (('w1', W1), ('w2', W2), ('w3', W3), ('w4', w4live)):
        for i, d in enumerate(lst):
            iid = d['id']; root = iid.rstrip('2').rstrip('12') if iid in ('s1', 's2') else iid.rstrip('2')
            base = d.get('base') or ((1 if i < 4 else 2) if wid == 'w1' else (2 if i < 3 else 3))
            order[wid].append(iid)
            rec = dict(id=iid, w=wid, i=i, name=d['name'], host=d['host'], crew=d['crew'], color=d['color'], color2=d['color2'], hi=d['hi'], base=base, fw=bool(d.get('fw')),
                       skin=SKIN4[iid] if wid == 'w4' else SKIN.get(root, 'avengers'), amb=AMB4[iid] if wid == 'w4' else AMB.get(root, 'city'),
                       chars=[dict(c=c, line=line, obj=obj, en=en) for c, line, obj, en in d['chars']],
                       letters=[dict(l=l, word=word, obj=obj) for l, word, obj in d['letters']], games=[])
            if wid == 'w4':
                # the games' ids are on the first screen: Store.validate keeps their stars before the lazy file has come (§11.1)
                rec['games'] = ['%s:%s' % (iid, s) for s in SLOTS4]
                rec['cast'] = CASTS4[iid]
                rec['write'] = d['write']
                rec['img'] = art('isl/' + iid).split('/')[-1]
                fb = FALLBACK4.get(iid, ())
                rec['bgs'] = [('%s_%s' % (iid, s)) if have('bg/%s_%s' % (iid, s)) else fb[k] for k, s in enumerate(BGSLOT4)]
            isl[iid] = rec
            for c, line, obj, en in d['chars']:
                items.append(dict(k=c, kind='zh', isl=iid, obj=obj, line=line, en=en or None, word=en, fw=bool(d.get('fw'))))
                seen.add(c)
            for l, word, obj in d['letters']:
                items.append(dict(k=l, kind='up' if l.isupper() else 'lo', isl=iid, obj=obj, line=letter_line(l, word), word=word, say=EN_SAY[l.upper()], en=None))
                seen.add(l)
    # every capital has a name to say even before its island (a lower-case letter is said by its capital's name)
    extra_caps = [c for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' if c not in seen]
    info = {'w1': dict(name='晨光海', map='map_w1', gate='gate1', fest='fest1', finale='finale_w1'),
            'w2': dict(name='星光海', map='map_w2', gate='gate2', fest='fest2', finale='finale_w2'),
            'w3': dict(name='彩虹海', map='map_w3', gate='gate3', fest='fest3', finale='finale_w3'),
            'w4': dict(name='神笔海', map=art('bg/map_w4').split('/')[-1], mapInk=0 if have('bg/map_w4') else 1,
                       gate=art('isl/gate4').split('/')[-1], gateInk=0 if have('isl/gate4') else 1, fest=art('isl/fest4').split('/')[-1],
                       finale=art('bg/finale_w4').split('/')[-1], brush='assets/' + art('isl/brush4') + '.png', brushNew=1 if have('isl/brush4') else 0,
                       # partial: one of the FIRST SEVEN islands not live yet (the temple-fair island waits). ⑧ ⑨ (§12.9) coming later
                       # are clouds with their hosts' shadows (soon), and the temple fair a child already has stays (never taken away)
                       partial=any(d['id'] not in live4 for d in W4[:7]), total=len(W4), soon=[d['host'] for d in W4 if d['id'] not in live4])}
    # pictures of the live islands' characters not drawn yet: their fallback (§8.1), else reported
    alias = {}
    for d in w4live:
        for c, line, obj, en in d['chars']:
            if obj and obj[0] != '@' and not have('obj/' + obj):
                fb = FALLBACK4.get('obj/' + obj)
                if fb:
                    alias[obj] = '../' + fb
                print('PICTURE MISSING', 'obj/' + obj, ('-> ' + fb) if fb else '(no fallback)')
    out = ['/* ================================================================ DATA (generated by tools/build.py from tools/content.py) */',
           'const ORDER = ' + j(order) + ';', 'const WORLDS_INFO = ' + j(info) + ';', 'const ISL = ' + j({k: {x: y for x, y in v.items() if x not in ('chars', 'letters')} for k, v in isl.items()}) + ';',
           'const ITEMS = ' + j(items) + ';',
           '/* the characters and letters of an island, in order: from ITEMS (the same data, not twice on the first screen) */',
           "Object.values(ISL).forEach(W => { W.chars = []; W.letters = []; }); ITEMS.forEach(x => { const W = ISL[x.isl]; if (!W) return; if (x.kind === 'zh') W.chars.push({ c: x.k, line: x.line, obj: x.obj, en: x.word }); else W.letters.push({ l: x.k, word: x.word, obj: x.obj }); });",
           '/* every item by its key (the same objects as ITEMS) + a capital for every letter without an island of its own */',
           'const ITEM = (() => { const o = {}; ITEMS.forEach(x => { o[x.k] = x; }); ' + j(extra_caps) + ".forEach(c => { o[c] = { k: c, kind: 'up', isl: '', obj: '', line: c, word: '', say: c, en: null }; }); return o; })();",
           'const OBJ_ALIAS = ' + j(alias) + ';',
           'const CVC_WORDS = ' + j(CVC) + ';', 'const CVC_OBJ = ' + j({w: o for w, o in CVC}) + ';',
           'const WORDS2_LIST = ' + j(WORDS2) + ';', 'const WORDS2_OBJ = ' + j({a + b: o for a, b, o in WORDS2}) + ';',
           'const FW_SENTS = ' + j(FW_SENTS) + ';', 'const FW_SENTS3 = ' + j(FW_SENTS3) + ';', 'const WORDS3 = ' + j(WORDS3) + ';',
           'const NOWRITE3 = ' + j(NOWRITE3) + ';', 'const NOWRITE4 = ' + j(NOWRITE4) + ';',
           'const READ = ' + j(READ) + ';', 'const BOOKS = ' + j(BOOKS) + ';',
           'const META = ' + meta_js() + ';']
    return '\n'.join(out)


def w4_tables(live4):
    """the big tables of world 4 (lazy, §11.1). Books and scrolls only of live islands (each opens after its island's flag)"""
    lv = set(live4)
    chars = os.path.join(ROOT, 'assets', 'chars')
    import w4x_data
    add1, near1 = w4x_data.tables()
    D = dict(
        read=READ4, books=[b for b in BOOKS4 if b['after'] in lv], scrolls=[s for s in SCROLLS4 if s['after'] in lv], scrollKind=SCROLL_KIND,
        words=WORDS4, sight=SIGHT4, bridge=BRIDGE4, esent=ESENT4, tf=TF4, placeThings=PLACE4_THINGS, placeSpots=PLACE4_SPOTS, place=PLACE4,
        wordsZh=WORDS_ZH4, wordsZh3=WORDS_ZH4_3, sense=SENSE4, endPic=ENDPIC4, orderRules=ORDER_RULES, orderPairs=ORDER_PAIRS, kind=KIND4,
        kindLine=KIND4_LINE, kindWords=KIND4_WORDS, body=BODY4, opp=OPP4, oppWords=OPP4_WORDS, look=LOOK4, lookBack=LOOK4_BACK, holds=HOLDS4,
        samePic=SAMEPIC4, motion=MOTION4, naiMilk=NAI_MILK, dict=DICT4,
        # ⑧ ⑨ (§12.5): 圈字, 排故事, 拍节拍, 拼句子 and 加一笔 (add1: the questions; near1: every one-stroke pair - never a wrong box)
        lessons=LESSONS4 + [r[:2] for r in LESSONS4_89 if r[2] in lv],      # the parent panel's table (W4R1N-06: lazy, not on the first screen)
        sent8=SENT8, story8=STORY8, beats8=BEATS8, beats8ph=BEATS8_PHRASES, sight9=SIGHT9, esent9=ESENT9, add1=add1, near1=near1,
        all=[dict(id=d['id'], name=d['name'], host=d['host'], color=d['color'], chars=''.join(c[0] for c in d['chars']), write=d['write']) for d in W4],
        have=sorted(o for o in OBJ if have('obj/' + o)) + ['@' + f[:-4] for f in sorted(os.listdir(chars)) if f.endswith('.png')],
    )
    return 'const W4D = ' + j(D) + ';'


def build_w4(live4):
    """assets/js/w4.js: the tables, src/w4/core.js, ancient.js and the live islands' files, in order"""
    parts = ['/* 字字岛 · 神笔海 (world 4, docs/W4-DESIGN.md): the lazily loaded part - built by tools/build.py from tools/content.py and src/w4/*.js; do not edit. */',
             "'use strict';", w4_tables(live4)]
    for f in ['core.js', 'ancient.js'] + [i + '.js' for i in live4 if i not in STUB]:
        p = os.path.join(W4SRC, f)
        if not os.path.exists(p):
            print('W4: missing src/w4/' + f); continue
        parts.append('/* ---------------- src/w4/%s */' % f)
        parts.append(open(p, encoding='utf-8').read())
    parts.append('W4X.loaded();')
    js = '\n'.join(parts) + '\n'
    os.makedirs(os.path.join(ROOT, 'assets', 'js'), exist_ok=True)
    out = os.path.join(ROOT, 'assets', 'js', 'w4%s.js' % ('_' + ARGS['tag'] if 'tag' in ARGS else ''))
    open(out, 'w', encoding='utf-8', newline='\n').write(js)
    ok = check_js(out)
    b = js.encode('utf-8')
    print(os.path.relpath(out, ROOT).replace(os.sep, '/'), len(b), 'bytes,', len(gzip.compress(b, 9)), 'gzip; live:', live4 or 'none', '' if ok else 'BROKEN')
    return hashlib.sha1(b).hexdigest()[:10]


def build_wm():
    """assets/js/wm.js: the writing modes (src/wm.js, docs/WRITE-MODES.md) with the character families of STROKE_FAMILIES, each
    one checked on the stroke data by tools/write_pairs.py (a pair that is not literally true stops the build)"""
    import write_pairs
    f = write_pairs.families()
    if f['bad']:          # never blocks the build: such a pair is left out, and tests/test_writemodes.py fails until it is fixed
        print('WARNING STROKE_FAMILIES: not literally true on the stroke data, left out: %s (python tools/write_pairs.py)' % f['bad'])
    fam = {'grow': [{k: x[k] for k in ('a', 'b', 'keep', 'add', 'say', 'diff')} for x in f['grow']],
           'part': [{k: x[k] for k in ('b', 'a', 'c', 'cut', 'say')} for x in f['part']]}
    js = '\n'.join(['/* 字字岛 · the writing modes (docs/WRITE-MODES.md): the lazily loaded part - built by tools/build.py from src/wm.js and the families of tools/write_pairs.py; do not edit. */',
                    "'use strict';", 'const WFAM = ' + j(fam) + ';', open(os.path.join(SRC, 'wm.js'), encoding='utf-8').read(), 'WM.loaded();']) + '\n'
    out = os.path.join(ROOT, 'assets', 'js', 'wm%s.js' % ('_' + ARGS['tag'] if 'tag' in ARGS else ''))
    open(out, 'w', encoding='utf-8', newline='\n').write(js)
    ok = check_js(out)
    b = js.encode('utf-8')
    print(os.path.relpath(out, ROOT).replace(os.sep, '/'), len(b), 'bytes,', len(gzip.compress(b, 9)), 'gzip;', len(fam['grow']), 'grow,', len(fam['part']), 'part', '' if ok else 'BROKEN')
    return hashlib.sha1(b).hexdigest()[:10]


def meta_js():
    """the client's characters: their measured eyes (点点岛 META); the new ones: their size only (no blinking lids)"""
    src = open(r'D:\ClaudeCode\kidmath3\index.html', encoding='utf-8').read()
    m = re.search(r'const META = (\{.*?\});\n', src)
    meta = json.loads(m.group(1))
    cdir = os.path.join(ROOT, 'assets', 'chars')
    for f in sorted(os.listdir(cdir)):
        k = f[:-4]
        if f.endswith('.png') and k not in meta:
            w, h = Image.open(os.path.join(cdir, f)).size
            meta[k] = [round(w * 496 / h), 496, []]
    return json.dumps(meta, separators=(',', ':'))


def main():
    live4 = live_islands()
    ver4 = build_w4(live4)
    verwm = build_wm()
    tag = '_' + ARGS['tag'] if 'tag' in ARGS else ''
    head = open(os.path.join(SRC, 'head.html'), encoding='utf-8').read()
    parts = [data_js(live4), 'const W4JS = ' + j('assets/js/w4%s.js?v=' % tag + ver4) + ';', 'const WMJS = ' + j('assets/js/wm%s.js?v=' % tag + verwm) + ';'] + [open(os.path.join(SRC, f), encoding='utf-8').read() for f in
                                                                                                ('engine.js', 'letters.js', 'writer.js', 'app.js', 'w4/boot.js', 'games.js', 'games2.js', 'v2.js', 'v2b.js', 'w3.js')]
    js = "'use strict';\n" + '\n'.join(parts) + '\nboot();\n'
    # the page without the sources' whole-line comments (tools/jsstrip.py; W4R1N-06) - only if it still parses
    import jsstrip, tempfile
    small, nc = jsstrip.strip(js)
    fd, tmp = tempfile.mkstemp(suffix='.js', prefix='first_screen_')
    with os.fdopen(fd, 'w', encoding='utf-8', newline='\n') as f:
        f.write(small)
    ok = check_js(tmp)
    if ok:
        print('first screen:', nc, 'whole-line comments dropped,', len(js) - len(small), 'bytes')
        js = small
        os.remove(tmp)
    else:
        print('COMMENT STRIPPING BROKE THE SCRIPT: the page keeps its comments (the stripped script: %s)' % tmp)
    html = head + '<script>\n' + js + '</script>\n</body>\n</html>\n'
    name = 'index%s.html' % tag
    open(os.path.join(ROOT, name), 'w', encoding='utf-8', newline='\n').write(html)
    b = html.encode('utf-8')
    print(name, len(b), 'bytes,', len(gzip.compress(b, 9)), 'gzip (first-screen budget 640000 / 180000, docs/W4-DESIGN.md §11.1)')


if __name__ == '__main__':
    main()
