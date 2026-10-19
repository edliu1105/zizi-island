# -*- coding: utf-8 -*-
"""The character families of the writing modes (docs/WRITE-MODES.md) - checked against the stroke data, never by hand.
The table is STROKE_FAMILIES in tools/content.py; this script proves every pair in it from assets/data/hanzi.json (the
centre lines) and STROKE_NAMES (src/writer.js), and gives the stroke indices the app needs:
  grow (A, B)    B has 1 or 2 strokes more than A, and A's strokes are in B in A's order (an order-keeping map), each of the
                 SAME stroke name, and each the same shape: A and those strokes of B, each set drawn into a unit square, lie on
                 each other (five points along every stroke: mean <= 16, worst <= 26 hundredths of the square).
  part (B, A, C) B's first strokes are A's and the rest are C's, each block the shape of that character (the same test, each
                 block in its own box - a 偏旁 is squeezed into its half: mean <= 22, worst <= 30); a left / top part may write
                 its last 捺 as 点 or 横 as 提 (木 in 林, 女 in 好), as GF 0023-2020 does.
families() is what tools/build.py puts into assets/js/wm.js and what 神笔海's "add one stroke" quiz reuses; the lines it
makes (say / diff) are recorded by tools/voice_lines.py - every one within 8 characters.
usage: python tools/write_pairs.py           the table, checked (exit 1 if a pair in the app is not literally true)
       python tools/write_pairs.py --search  every literal grow / part pair among the taught characters (for choosing)"""
import os, re, sys, json, itertools, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import content
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
H = json.load(open(os.path.join(ROOT, 'assets', 'data', 'hanzi.json'), encoding='utf-8'))
WJS = open(os.path.join(ROOT, 'src', 'writer.js'), encoding='utf-8').read()
NAMES = {k: v.split() for k, v in re.findall(r"(\S):\s*'([^']+)'", re.search(r"const STROKE_NAMES = \{(.+?)\n\};", WJS, re.S).group(1))}
VAR = {('捺', '点'), ('横', '提')}                 # a part's stroke as written inside another character
SHORT = set('横竖撇点捺提')                        # a single stroke named in a line: "人加一横变成大！"
MEAN, WORST, VMAX = 16, 26, 30
PMEAN, PWORST = 22, 30                 # a part is drawn narrower / flatter as a 偏旁 (女 in 好): a little more room


def taught():
    out = []
    for _, _, d in content.islands():
        out += [c[0] for c in d['chars']]
    return list(dict.fromkeys(out))


def ready(c):
    return c in H and c in NAMES and len(NAMES[c]) == len(H[c]['m'])


def meds(c):
    return [[(x, 900 - y) for x, y in m] for m in H[c]['m']]


def resample(p, n):
    if len(p) < 2:
        return [p[0]] * n
    L = [0.0]
    for a, b in zip(p, p[1:]):
        L.append(L[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    T, out, j = L[-1] or 1.0, [], 0
    for i in range(n):
        t = T * i / (n - 1)
        while j < len(p) - 2 and L[j + 1] < t:
            j += 1
        u = min(1.0, max(0.0, (t - L[j]) / ((L[j + 1] - L[j]) or 1.0)))
        out.append((p[j][0] + (p[j + 1][0] - p[j][0]) * u, p[j][1] + (p[j + 1][1] - p[j][1]) * u))
    return out


def bbox(strokes):
    xs = [x for s in strokes for x, _ in s]; ys = [y for s in strokes for _, y in s]
    return min(xs), min(ys), max(xs), max(ys)


def fit(a_strokes, b_strokes):
    """each set drawn into a unit square (its own box, per axis): for every stroke the mean distance of five points along it
    (start, quarters, end), in hundredths. 楷书 draws a part a little longer or shorter inside another character (口's 横折
    ends higher than 日's), so the skeleton is compared - where each stroke starts, runs and ends"""
    ax0, ay0, ax1, ay1 = bbox(a_strokes); bx0, by0, bx1, by1 = bbox(b_strokes)
    aw, ah, bw, bh = max(ax1 - ax0, 80), max(ay1 - ay0, 80), max(bx1 - bx0, 80), max(by1 - by0, 80)
    d = []
    for sa, sb in zip(a_strokes, b_strokes):
        pa = [((x - ax0) / aw, (y - ay0) / ah) for x, y in resample(sa, 5)]
        pb = [((x - bx0) / bw, (y - by0) / bh) for x, y in resample(sb, 5)]
        d.append(100 * sum(math.hypot(p[0] - q[0], p[1] - q[1]) for p, q in zip(pa, pb)) / 5)
    return d


def grow(A, B):
    """the best order-keeping map of A's strokes onto B's with the same names; None if there is none that fits"""
    na, nb, ma, mb = NAMES[A], NAMES[B], meds(A), meds(B)
    if not 1 <= len(nb) - len(na) <= 2:
        return None
    best = None
    for keep in itertools.combinations(range(len(nb)), len(na)):
        if any(na[i] != nb[k] for i, k in enumerate(keep)):
            continue
        d = fit(ma, [mb[k] for k in keep])
        score = (sum(d) / len(d), max(d))
        if best is None or score < best[0]:
            best = (score, list(keep))
    if not best or best[0][0] > MEAN or best[0][1] > WORST:
        return None
    keep = best[1]
    add = [k for k in range(len(nb)) if k not in keep]
    return dict(a=A, b=B, keep=keep, add=add, fit=[round(best[0][0], 1), round(best[0][1], 1)], say=say_grow(A, B, add), diff=say_diff(A, B, add))


def part(B, A, C):
    na, nc, nb = NAMES[A], NAMES[C], NAMES[B]
    if len(na) + len(nc) != len(nb):
        return None
    var = [i for i, (x, y) in enumerate(zip(na + nc, nb)) if x != y]
    if any((x, y) not in VAR for x, y in zip(na + nc, nb) if x != y):
        return None
    mb, cut = meds(B), len(na)
    da, dc = fit(meds(A), mb[:cut]), fit(meds(C), mb[cut:])
    for d, off in ((da, 0), (dc, cut)):
        plain = [x for i, x in enumerate(d) if i + off not in var]
        if plain and (sum(plain) / len(plain) > PMEAN or max(plain) > PWORST):
            return None
        if any(x > VMAX for i, x in enumerate(d) if i + off in var):
            return None
    return dict(b=B, a=A, c=C, cut=cut, var=var, fit=[round(sum(da) / len(da), 1), round(sum(dc) / len(dc), 1)], say=A + '加' + C + '变成' + B + '！')


def added(B, add):
    n = NAMES[B]
    if len(add) == 1:
        return '一' + n[add[0]] if n[add[0]] in SHORT else '一笔'
    return '两笔'


def say_grow(A, B, add):
    return A + '加' + added(B, add) + '变成' + B + '！'          # 人加一横变成大！ (8)


def say_diff(A, B, add):
    return B + '比' + A + '多' + added(B, add)                    # 目比日多一横 (6)


def families():
    """the table checked: {'grow': [...], 'part': [...], 'pending': [...], 'bad': [...]} - pending: a character of the pair is
    not in the app (or has no stroke data) yet; bad: in the app, and not literally true"""
    t = set(taught())
    out = {'grow': [], 'part': [], 'pending': [], 'bad': []}
    for A, B in content.STROKE_FAMILIES['grow']:
        if not all(c in t and ready(c) for c in (A, B)):
            out['pending'].append(A + '>' + B); continue
        r = grow(A, B)
        (out['grow'].append(r) if r else out['bad'].append(A + '>' + B))
    for B, A, C in content.STROKE_FAMILIES['part']:
        if not all(c in t and ready(c) for c in (A, B, C)):
            out['pending'].append(B + '=' + A + '+' + C); continue
        r = part(B, A, C)
        (out['part'].append(r) if r else out['bad'].append(B + '=' + A + '+' + C))
    return out


def lines():
    f = families()
    return {x['say'] for x in f['grow']} | {x['diff'] for x in f['grow']} | {x['say'] for x in f['part']}


def search():
    chars = [c for c in taught() if ready(c)]
    g = [r for A, B in itertools.permutations(chars, 2) for r in [grow(A, B)] if r]
    p = [r for B in chars for A in chars for C in chars if A != B and C != B for r in [part(B, A, C)] if r]
    return g, p


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    if '--search' in sys.argv:
        g, p = search()
        for x in sorted(g, key=lambda x: (x['b'], x['fit'])):
            print('grow %s -> %s  +%s %s  fit %s' % (x['a'], x['b'], ''.join(NAMES[x['b']][k] for k in x['add']), x['add'], x['fit']))
        for x in p:
            print('part %s = %s + %s  fit %s var %s' % (x['b'], x['a'], x['c'], x['fit'], x['var']))
        sys.exit(0)
    f = families()
    for x in f['grow']:
        print('grow %s -> %s  keep %s add %s  fit %s  "%s" / "%s"' % (x['a'], x['b'], x['keep'], x['add'], x['fit'], x['say'], x['diff']))
    for x in f['part']:
        print('part %s = %s + %s  cut %d var %s  fit %s  "%s"' % (x['b'], x['a'], x['c'], x['cut'], x['var'], x['fit'], x['say']))
    print('grow %d, part %d, pending %s, NOT TRUE %s' % (len(f['grow']), len(f['part']), f['pending'], f['bad']))
    long = [s for s in lines() if len(s) > 8]
    if long:
        print('LINES LONGER THAN 8:', long)
    sys.exit(1 if f['bad'] or long else 0)
