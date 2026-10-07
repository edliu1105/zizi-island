# -*- coding: utf-8 -*-
"""Stroke data of every character the app writes or shows (Make Me a Hanzi via the hanzi-writer-data package:
outlines + medians, 1024 box, y up). Arphic Public License - see assets/data/LICENSE-hanzi.txt.
usage: python tools/fetch_hanzi.py  ->  raw/hanzi/<char>.json + assets/data/hanzi.json (only what the app uses)"""
import os, sys, json, urllib.request, urllib.parse, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import islands, WORDS2
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'raw', 'hanzi'); os.makedirs(RAW, exist_ok=True)
chars = []
for _, _, d in islands():
    chars += [c[0] for c in d['chars']]
for a, b, _ in WORDS2:
    chars += [a, b]
chars = list(dict.fromkeys(chars))
out = {}
for ch in chars:
    p = os.path.join(RAW, ch + '.json')
    if not os.path.exists(p):
        url = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/' + urllib.parse.quote(ch) + '.json'
        for k in range(3):
            try:
                data = urllib.request.urlopen(url, timeout=20).read(); open(p, 'wb').write(data); break
            except Exception as e:
                print('retry', ch, e); time.sleep(2)
    d = json.load(open(p, encoding='utf-8'))
    out[ch] = {'s': d['strokes'], 'm': d['medians']}
os.makedirs(os.path.join(ROOT, 'assets', 'data'), exist_ok=True)
js = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
open(os.path.join(ROOT, 'assets', 'data', 'hanzi.json'), 'w', encoding='utf-8').write(js)
print(len(out), 'characters,', len(js) // 1024, 'KB', ''.join(chars))
print('strokes', {c: len(out[c]['s']) for c in chars})
