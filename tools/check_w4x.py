# -*- coding: utf-8 -*-
"""Checks of the data of 神笔海 ⑧ 复仇者·英雄训练场 and ⑨ 变形金刚·汽车人工厂 (docs/W4-DESIGN.md §12) - run before a review and by
tests/test_w4open.py (part 30). Every rule of §12 that a script can decide:
  SENT8    the character to find is in its sentence exactly once; 5-8 characters; every character taught somewhere; the word
           holds it; at least 15 sentences use only 晨光海 + 神笔海 characters (and ⑧'s own)
  STORY8   3 or 4 cards of <= 8 characters; every link has its reason (why[i]: sentence i can only happen after sentence i-1),
           so the links make a chain and the story has exactly ONE order (counted: the orders the links allow); a picture a card;
           at least 8 stories with only 晨光海 + 神笔海 (+ ⑧) characters; no two stories alike
  BEATS8   the syllables spell the word; 1-4 beats; every picture there (or one of the new pictures of §12.4)
  ESENT9   every word known (WORDS3 / WORDS4 / SIGHT4 / SIGHT9, a plural s); 3-5 words and an end mark; level 5's extra card known,
           not in the sentence
  add1     ⑨-4's pairs = STROKE_FAMILIES['grow'] with one stroke more: LITERALLY A + one stroke = B in the data - B's GF 0023 code
           minus one stroke is A's code, the stroke names agree, the shapes fit (tools/write_pairs.py); and the table is complete:
           every such pair among all the taught characters is in it (so the game can offer exactly one right box)
  lines    every spoken data line of ⑧⑨ <= 8 characters (punctuation is not a character)
usage: python tools/check_w4x.py        (exit 1 on a failure)"""
import os, sys, json, re, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding='utf-8')
import content as C

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HAN = re.compile(r'[一-鿿]')
han = lambda s: [c for c in s if HAN.match(c)]
fails, notes = [], []


def bad(msg):
    fails.append(msg)


taught = set(c[0] for _, _, d in C.islands() for c in d['chars'])
ids4 = [d['id'] for d in C.W4]
w1 = set(c[0] for d in C.W1 for c in d['chars'])
base8 = w1 | set(c[0] for d in C.W4[:ids4.index('avengers4') + 1] for c in d['chars'])     # 晨光海 + 神笔海 ①-⑧
NEW = '好力出王高变能工厂路'
NEWART = {'thumbsup', 'mouseout', 'crown', 'tower', 'toolbox', 'factory', 'road', 'yellowcar', 'jump', 'change'}
have = lambda o: o[0] == '@' and os.path.exists(os.path.join(ROOT, 'assets', 'chars', o[1:] + '.png')) or os.path.exists(os.path.join(ROOT, 'assets', 'obj', o + '.png')) or o in NEWART


def scene_ok(sc, where):
    for t in sc:
        if not have(t[0]):
            bad('%s: no picture %s' % (where, t[0]))

# ---------------------------------------------------------------- the two islands
for iid, chars, write in (('avengers4', '好力出王高', '好力'), ('robot4', '变能工厂路', '工厂')):
    d = next((x for x in C.W4 if x['id'] == iid), None)
    if not d:
        bad('W4 has no ' + iid); continue
    if ''.join(c[0] for c in d['chars']) != chars or d['write'] != write:
        bad('%s: characters %s / write %s' % (iid, ''.join(c[0] for c in d['chars']), d['write']))
    for c, line, obj, en in d['chars']:
        if len(han(line)) > 8 or not line.startswith(c):
            bad('%s: line %s' % (iid, line))
    for k in (C.CASTS4, C.AMB4, C.SKIN4):
        if iid not in k:
            bad('%s: missing in a table' % iid)
    for p in d['crew'] + C.CASTS4[iid]:
        if not os.path.exists(os.path.join(ROOT, 'assets', 'chars', p + '.png')):
            bad('%s: no client picture %s' % (iid, p))
if [x for x in NEW if x in C.W4 and False]:
    pass
if sorted(c for c in '出王高变能路' if c in C.NOWRITE4) != sorted('出王高变能路') or any(c in C.NOWRITE4 for c in '好力工厂'):
    bad('NOWRITE4: 出王高变能路 read only, 好力工厂 written')
dup = [c for c in NEW if sum(1 for _, _, d in C.islands() for x in d['chars'] if x[0] == c) != 1]
if dup:
    bad('the new characters are not new: %s' % dup)
for k, v in list(C.LOOK4.items()) + list(C.LOOK4_BACK.items()):
    if (k in NEW or set(v) & set(NEW)) and set(v) & set(C.HOLDS4.get(k, '')):
        bad('LOOK4 and HOLDS4 both hold %s for %s' % (set(v) & set(C.HOLDS4.get(k, '')), k))

# ---------------------------------------------------------------- SENT8
sents = C.SENT8
nbase = 0
for k, s, w in sents:
    cs = han(s)
    if cs.count(k) != 1:
        bad('SENT8 %s: %s is in it %d times' % (s, k, cs.count(k)))
    if not 5 <= len(cs) <= 8:
        bad('SENT8 %s: %d characters' % (s, len(cs)))
    miss = [c for c in cs if c not in taught]
    if miss:
        bad('SENT8 %s: not taught %s' % (s, miss))
    if w and (k not in w or w not in s or len(w) != 2):
        bad('SENT8 %s: word %s' % (s, w))
    nbase += all(c in base8 for c in cs)
per = {c: sum(1 for k, _, _ in sents if k == c) for c in '好力出王高'}
if len(sents) < 38 or nbase < 15 or min(per.values()) < 6:
    bad('SENT8: %d sentences, %d only 晨光海 + 神笔海, per character %s' % (len(sents), nbase, per))
notes.append('SENT8 %d sentences (%d only 晨光海 + 神笔海 + ⑧), per character %s, with the word (level 5) %d' % (len(sents), nbase, per, sum(1 for x in sents if x[2])))

# ---------------------------------------------------------------- STORY8


def orders(n, edges):
    """how many orders of n sentences keep every link (a before b): the stories' uniqueness, counted"""
    return sum(1 for p in itertools.permutations(range(n)) if all(p.index(a) < p.index(b) for a, b in edges))


nbase = 0
seen = set()
for st in C.STORY8:
    s, why, pic = st['s'], st['why'], st['pic']
    tag = '/'.join(s)
    if not 3 <= len(s) <= 4 or len(why) != len(s) or len(pic) != len(s):
        bad('STORY8 %s: %d cards, %d reasons, %d pictures' % (tag, len(s), len(why), len(pic))); continue
    edges = [(i - 1, i) for i in range(1, len(s)) if why[i].strip()]
    if why[0] or orders(len(s), edges) != 1:
        bad('STORY8 %s: %d possible orders' % (tag, orders(len(s), edges)))
    for t in s:
        cs = han(t)
        if len(cs) > 8 or [c for c in cs if c not in taught]:
            bad('STORY8 %s: card %s' % (tag, t))
    if len(set(s)) != len(s) or tag in seen:
        bad('STORY8 %s: a card twice / the story twice' % tag)
    seen.add(tag)
    for i, sc in enumerate(pic):
        scene_ok(sc, 'STORY8 ' + s[i])
    nbase += all(c in base8 for t in s for c in han(t))
n3, n4, think = sum(len(x['s']) == 3 for x in C.STORY8), sum(len(x['s']) == 4 for x in C.STORY8), sum(x['think'] for x in C.STORY8)
if len(C.STORY8) < 20 or nbase < 8 or n4 < 5:
    bad('STORY8: %d stories, %d only 晨光海 + 神笔海, %d of four' % (len(C.STORY8), nbase, n4))
notes.append('STORY8 %d stories (%d of three, %d of four, %d to think out), %d only 晨光海 + 神笔海 + ⑧, each exactly one order' % (len(C.STORY8), n3, n4, think, nbase))

# ---------------------------------------------------------------- BEATS8, SIGHT9, ESENT9
beats = {}
for w, p, syl in C.BEATS8:
    n = len(syl.split('-'))
    if syl.replace('-', '') != w or not 1 <= n <= 4:
        bad('BEATS8 %s: %s' % (w, syl))
    if not have(p):
        bad('BEATS8 %s: no picture %s' % (w, p))
    beats[n] = beats.get(n, 0) + 1
for ph, syl, sc in C.BEATS8_PHRASES:
    if syl.replace('-', '') != ph.replace(' ', '') or not 2 <= len(syl.split('-')) <= 4:
        bad('BEATS8_PHRASES %s: %s' % (ph, syl))
    scene_ok(sc, 'BEATS8_PHRASES ' + ph)
notes.append('BEATS8 %d words by beats %s; %d phrases' % (len(C.BEATS8), dict(sorted(beats.items())), len(C.BEATS8_PHRASES)))
known_en = set(w for w, _, _ in C.WORDS3) | set(w for w, _, _ in C.WORDS4) | set(C.SIGHT4) | set(C.SIGHT9)
kn = lambda w: w in known_en or w.lower() in known_en or (w.endswith('s') and w[:-1].lower() in known_en)
lens = {}
for t, sc, extra in C.ESENT9:
    words = re.findall(r"[A-Za-z]+", t)
    if not re.match(r"^[A-Z][A-Za-z ]*[.!?]$", t) or not 3 <= len(words) <= 5 or [w for w in words if not kn(w)]:
        bad('ESENT9 %s: %s' % (t, [w for w in words if not kn(w)]))
    if len(words) == 5 and (not extra or not kn(extra) or extra.lower() in [w.lower() for w in words]):
        bad('ESENT9 %s: extra card %r' % (t, extra))
    if len(set(w.lower() for w in words)) != len(words):
        bad('ESENT9 %s: a word twice (two cards alike: two orders)' % t)
    scene_ok(sc, 'ESENT9 ' + t)
    lens[len(words)] = lens.get(len(words), 0) + 1
if len(C.ESENT9) < 28 or min(lens.get(n, 0) for n in (3, 4, 5)) < 6:
    bad('ESENT9: %d sentences %s' % (len(C.ESENT9), lens))
notes.append('ESENT9 %d sentences by words %s' % (len(C.ESENT9), dict(sorted(lens.items()))))
for w in C.SIGHT9:
    if w in C.SIGHT4:
        bad('SIGHT9 %s is already in SIGHT4' % w)

# ---------------------------------------------------------------- ⑨-4: the +1 families, literally
SO = json.load(open(os.path.join(ROOT, 'tests', 'data', 'stroke_order.json'), encoding='utf-8'))['hanzi']
try:
    import write_pairs as WP
except Exception as e:      # the writing modes' checker: it needs every taught character's stroke data and names
    WP = None
    bad('tools/write_pairs.py does not load: %s' % e)


def one_less(a, b):
    """B's GF code with one stroke left out is A's code (and the names agree the same way)"""
    ca, cb = SO.get(a, {}).get('gf'), SO.get(b, {}).get('gf')
    if not ca or not cb or len(cb) != len(ca) + 1:
        return False
    return any(cb[:i] + cb[i + 1:] == ca for i in range(len(cb)))


import w4x_data
A1, NEAR = w4x_data.tables()
add1 = [(x['a'], x['b']) for x in A1]
for a, b in add1:
    if not one_less(a, b):
        bad('add1 %s -> %s: not one GF stroke more' % (a, b))
if WP:
    for x in A1:
        r = WP.grow(x['a'], x['b'])
        if not r or r['add'] != [x['add']]:
            bad('add1 %s -> %s: the stroke data does not show it (tools/write_pairs.py)' % (x['a'], x['b']))
    # complete: every literal +1 among the taught characters is a question or never a wrong box (NEAR) - one right box
    ch = [c for c in WP.taught() if WP.ready(c)]
    for a, b in itertools.permutations(ch, 2):
        if len(WP.NAMES[b]) == len(WP.NAMES[a]) + 1 and WP.grow(a, b) and a + b not in NEAR:
            bad('add1: %s -> %s is literally one stroke more but could be offered as a wrong box' % (a, b))
design = [('人', '大'), ('大', '天'), ('口', '日'), ('口', '中'), ('日', '目'), ('日', '田'), ('日', '白'), ('木', '禾'), ('木', '本'), ('了', '子'),
          ('土', '王'), ('一', '二'), ('二', '三'), ('一', '十'), ('十', '土'), ('二', '工'), ('米', '来')]      # §12.5 (小 -> 少 is not literal)
for p in design:
    if p not in add1:
        bad('add1: the design pair %s -> %s is missing' % p)
base9 = w1 | set(c[0] for d in C.W4 for c in d['chars'])
nb = [a + b for a, b in add1 if a in base9 and b in base9]
notes.append('add1 %d questions (A -> its B: %s); with only 晨光海 + 神笔海: %d %s; never a wrong box (all one-stroke pairs) %d: %s' % (
    len(add1), {a: ''.join(b for x, b in add1 if x == a) for a in dict.fromkeys(a for a, _ in add1)}, len(nb), ' '.join(nb), len(NEAR), ' '.join(NEAR)))

# ---------------------------------------------------------------- SENSE4 (⑦-4, W4R1N-03): read the first half, or no better than chance
import sense_guess
g = sense_guess.guessers([(x['pre'], x['ok'], x['no']) for x in C.SENSE4])
if max(g.values()) > 0.30:
    bad('SENSE4: a child who does not read the first half guesses right %s (limit 30%%)' % {k: round(v, 2) for k, v in g.items()})
for x in C.SENSE4:
    t = x['pre'] + x['ok'] + ''.join(x['no'])
    if [c for c in han(t) if c not in taught] or len(set(x['no'] + [x['ok']])) != 5 or max(len(han(x['pre'] + e)) for e in [x['ok']] + x['no']) > 8 or not have(x['subj']):
        bad('SENSE4 %s%s: characters / five different endings / <= 8 / picture' % (x['pre'], x['ok']))
notes.append('SENSE4 %d questions; guessing without reading the first half: %s' % (len(C.SENSE4), {k: '%d%%' % round(100 * v) for k, v in g.items()}))

# ---------------------------------------------------------------- lines and cards
for t in [s for _, s, _ in sents] + [x for st in C.STORY8 for x in st['s']] + [r[0] for r in C.READ4] + [l for s in C.SCROLLS4 for l in s['lines']] + \
         [a + '加一笔是' + b for a, b in add1] + [b + '减一笔是' + a for a, b in add1] + ['圈' + c + '！' for c in NEW]:
    if len(han(t)) > 8:
        bad('longer than 8 characters: ' + t)
for r in C.READ4[-6:]:
    if len(r[2]) != 4:
        bad('READ4 %s: %d wrong pictures' % (r[0], len(r[2])))
    for sc in [r[1]] + r[2]:
        scene_ok(sc, 'READ4 ' + r[0])

for n in notes:
    print(n)
print('\n'.join('FAIL ' + f for f in fails) if fails else 'ALL OK')
sys.exit(1 if fails else 0)
