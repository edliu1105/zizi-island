# -*- coding: utf-8 -*-
"""行 has two sounds and the voice picked the wrong one (client 2026-11-01: 你能行的 was said 你能航的). tools/voice_bank.py
gives the voice 形 (xing) instead where the line means it (SOUNDS), the key stays the line.
 01 every line the app says with 行 in it is given 形 or 航 - a new line with 行 has to say which (行 alone, a tap on it in
    站如松, is its own first sound xing)
 02 the sound is the one the line means: 你能行的 and 行如风 xing
 03 every line SOUNDS changes is recorded
usage: python tests/test_sounds.py"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'tools'))
from harness import ROOT, Log
from voice_bank import spoken, key

log = Log('sounds')
lines = json.load(open(os.path.join(ROOT, 'raw', 'voice_lines.json'), encoding='utf-8'))
both = [t for t in lines if '行' in t and t != '行']
left = [t for t in both if '行' in spoken(t)]
log.check(both and not left, '01 %d lines with 行, each given 形 or 航 %s' % (len(both), left))
want = {'你能行的！': '你能形的！', '行如风，': '形如风，'}
bad = ['%s -> %s' % (t, spoken(t)) for t, s in want.items() if spoken(t) != s]
missing = [t for t in want if t not in lines]
log.check(not bad and not missing, '02 xing where the line means it %s %s' % (bad, missing))
bank = set(json.load(open(os.path.join(ROOT, 'assets', 'voice', 'bank.json'), encoding='utf-8')))
gone = [t for t in lines if spoken(t) != t and (key(t) not in bank or not os.path.exists(os.path.join(ROOT, 'assets', 'voice', 'v', key(t) + '.mp3')))]
log.check(not gone, '03 the %d lines it changes are recorded %s' % (sum(1 for t in lines if spoken(t) != t), gone))
sys.exit(0 if log.close() else 1)
