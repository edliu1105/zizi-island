# -*- coding: utf-8 -*-
"""Stroke data of every character the app writes or shows (Make Me a Hanzi via the hanzi-writer-data package:
outlines + medians, 1024 box, y up). Arphic Public License - see assets/data/LICENSE-hanzi.txt.
usage: python tools/fetch_hanzi.py  ->  raw/hanzi/<char>.json + assets/data/hanzi.json (only what the app uses)"""
import os, sys, json, urllib.request, urllib.parse, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import islands, WORDS2, SCROLLS4, BOOKS4, SCROLL_KIND
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'raw', 'hanzi'); os.makedirs(RAW, exist_ok=True)
chars = []
for _, _, d in islands():
    chars += [c[0] for c in d['chars']]
for a, b, _ in WORDS2:
    chars += [a, b]
chars = list(dict.fromkeys(chars))
# 神笔海's scrolls and books also SHOW characters not taught yet (light grey, read together, §4.4): their outlines only, in a
# file of their own (assets/data/hanzi_extra.json) - never written, so never in hanzi.json (tests/test_strokes.py checks that one)
show = ''.join(t for s in SCROLLS4 for t in [s['title']] + s['lines']) + ''.join(SCROLL_KIND.values()) + ''.join(b['title'] + ''.join(t for t, _ in b['pages']) for b in BOOKS4)
extra = [c for c in dict.fromkeys(show) if '一' <= c <= '鿿' and c not in chars]


def get(ch):
    p = os.path.join(RAW, ch + '.json')
    if not os.path.exists(p):
        url = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/' + urllib.parse.quote(ch) + '.json'
        for k in range(3):
            try:
                data = urllib.request.urlopen(url, timeout=20).read(); open(p, 'wb').write(data); break
            except Exception as e:
                print('retry', ch, e); time.sleep(2)
    return json.load(open(p, encoding='utf-8'))


out = {}
for ch in chars:
    d = get(ch)
    out[ch] = {'s': d['strokes'], 'm': d['medians']}
os.makedirs(os.path.join(ROOT, 'assets', 'data'), exist_ok=True)
js = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
open(os.path.join(ROOT, 'assets', 'data', 'hanzi.json'), 'w', encoding='utf-8').write(js)
print(len(out), 'characters,', len(js) // 1024, 'KB', ''.join(chars))
ex = {ch: {'s': get(ch)['strokes']} for ch in extra}
jx = json.dumps(ex, ensure_ascii=False, separators=(',', ':'))
open(os.path.join(ROOT, 'assets', 'data', 'hanzi_extra.json'), 'w', encoding='utf-8').write(jx)
print(len(ex), 'characters only shown (hanzi_extra.json),', len(jx) // 1024, 'KB', ''.join(extra))
print('strokes', {c: len(out[c]['s']) for c in chars})
# the order of the data is checked against 《通用规范汉字笔顺规范》GF 0023-2020 (docs/DESIGN.md 笔顺标准): a new character needs
# its entry in tests/data/stroke_order.json - its GF code and page, read from the standard, and the data's order checked
# stroke by stroke against the standard's 跟随式 (tests/test_strokes.py fails without it and prints a draft entry)
table = json.load(open(os.path.join(ROOT, 'tests', 'data', 'stroke_order.json'), encoding='utf-8'))['hanzi']
new = [c for c in chars if c not in table]
bad = [c for c in chars if c in table and len(table[c]['gf']) != len(out[c]['s'])]
if new:
    print('NOT YET CHECKED against GF 0023-2020 (add to tests/data/stroke_order.json):', ''.join(new))
if bad:
    print('STROKE COUNT differs from GF 0023-2020 - check these before using them:', ''.join(bad))
