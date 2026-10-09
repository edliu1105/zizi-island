# -*- coding: utf-8 -*-
"""The pictures of the numbers 一 .. 十 (world 3): N apples in neat rows (at most 5 a row, like a ten-frame) - an exact count,
never a generated guess. One kind of thing for every number, so only the count tells them apart.
usage: python tools/compose_numbers.py  ->  assets/obj/num1.png .. num10.png"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = 400


def rows(n):
    if n > 5:
        return [5, n - 5]
    return [n] if n <= 3 else [2, 2] if n == 4 else [3, 2]


def main():
    apple = Image.open(os.path.join(ROOT, 'assets', 'obj', 'apple.png')).convert('RGBA')
    for n in range(1, 11):
        rs = rows(n)
        k = min(0.62 if n == 1 else 0.36, 0.94 / max(rs) / 1.06, 0.9 / len(rs) / 1.08)
        size = int(S * k)
        a = apple.copy(); a.thumbnail((size, size), Image.LANCZOS)
        im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        for r, c in enumerate(rs):
            cy = S * (0.5 + (r - (len(rs) - 1) / 2) * k * 1.12)
            for i in range(c):
                cx = S * (0.5 + (i - (c - 1) / 2) * k * 1.06)
                im.alpha_composite(a, (int(cx - a.width / 2), int(cy - a.height / 2)))
        im.save(os.path.join(ROOT, 'assets', 'obj', 'num%d.png' % n), optimize=True)
    print('num1..num10')


if __name__ == '__main__':
    main()
