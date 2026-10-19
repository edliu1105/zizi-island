# -*- coding: utf-8 -*-
"""神笔海 ⑨-4 加一笔，变一变 (docs/W4-DESIGN.md §12.5): its tables, worked out from the stroke data - used by tools/build.py
(W4D.add1 / W4D.near1) and checked by tools/check_w4x.py.
  add1   the QUESTIONS: the writing modes' STROKE_FAMILIES['grow'] pairs with exactly one stroke more, as tools/write_pairs.py
         verifies them (A's strokes are in B, in order, same names, same shape) - with the stroke added (its index in B) and
         the writing modes' line ("人加一横变成大！"). Never a second hand-made table.
  near1  every pair that is, or could be taken for, "A + one stroke = B" among ALL the taught characters: the literal ones
         (write_pairs.grow, also those the writing modes did not pick, e.g. 一 -> 厂, 二 -> 上) and those one GF 0023 stroke
         apart by code (小 234 -> 少 2343: its hook goes - not literal, but a parent could say so). The game never offers one of
         these as a wrong box: every question has exactly ONE right box (and the reverse question - B minus one stroke - too)."""
import os, sys, json, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def tables():
    import content as C
    import write_pairs as WP
    so = json.load(open(os.path.join(ROOT, 'tests', 'data', 'stroke_order.json'), encoding='utf-8'))['hanzi']
    chars = [c for c in WP.taught() if WP.ready(c)]
    code = lambda c: (so.get(c) or {}).get('gf', '')
    add1 = []
    for a, b in C.STROKE_FAMILIES['grow']:
        if a in chars and b in chars and len(WP.NAMES[b]) == len(WP.NAMES[a]) + 1:
            r = WP.grow(a, b)
            if r:
                add1.append(dict(a=a, b=b, keep=r['keep'], add=r['add'][0], say=r['say']))
    near = set()
    for a, b in itertools.permutations(chars, 2):
        if len(WP.NAMES[b]) != len(WP.NAMES[a]) + 1:
            continue
        ca, cb = code(a), code(b)
        if (ca and cb and any(cb[:i] + cb[i + 1:] == ca for i in range(len(cb)))) or WP.grow(a, b):
            near.add(a + b)
    near |= {x['a'] + x['b'] for x in add1}
    return add1, sorted(near)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    a, n = tables()
    print(len(a), 'questions:', ' '.join(x['a'] + x['b'] for x in a))
    print(len(n), 'never a wrong box:', ' '.join(n))
