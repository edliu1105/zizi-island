# -*- coding: utf-8 -*-
"""The composed pictures of world 4 (神笔海, docs/W4-DESIGN.md §8.1): the characters with no single thing of their own are laid
out from existing object pictures - an exact layout, never a generated guess (same idea as tools/compose_numbers.py).
  多 many      the plate (assets/props/plate.png, copied from 点点岛) with 8 cookies (assets/props/cookie.png) piled on it
  少 few       the same plate with 2 cookies
  中 middle    three balls (assets/obj/ball.png) in a row, the middle one in a thick gold ring
  前 front     three ducklings (assets/obj/duck.png) walking right in a row, the front (rightmost) one in the gold ring
  后 back      the same row, the last (leftmost) one in the gold ring
  右 rightsign assets/obj/leftsign.png (our own generated picture, not the client's) mirrored left-right
usage: python tools/compose_w4.py  ->  assets/obj/{many,few,middle,front,back,rightsign}.png (400 px, transparent)"""
import os
from PIL import Image, ImageDraw, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OBJ = os.path.join(ROOT, 'assets', 'obj')
PROPS = os.path.join(ROOT, 'assets', 'props')
S = 400
GOLD = (255, 180, 0, 255)          # #FFB400
EDGE = (150, 96, 0, 255)           # a thin darker rim so the ring reads on white and on light cards


def load(path, h=None, w=None):
    im = Image.open(path).convert('RGBA')
    if h:
        im = im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS)
    elif w:
        im = im.resize((w, max(1, round(im.height * w / im.width))), Image.LANCZOS)
    return im


def put(canvas, im, cx, cy):
    canvas.alpha_composite(im, (int(round(cx - im.width / 2)), int(round(cy - im.height / 2))))


def ring(canvas, cx, cy, rx, ry, width=13):
    """a thick gold ellipse, drawn 4x and scaled down (smooth edge)"""
    k = 4
    big = Image.new('RGBA', (S * k, S * k), (0, 0, 0, 0))
    d = ImageDraw.Draw(big)
    box = [(cx - rx) * k, (cy - ry) * k, (cx + rx) * k, (cy + ry) * k]
    d.ellipse(box, outline=EDGE, width=(width + 4) * k)
    inset = 2 * k
    d.ellipse([box[0] + inset, box[1] + inset, box[2] - inset, box[3] - inset], outline=GOLD, width=width * k)
    canvas.alpha_composite(big.resize((S, S), Image.LANCZOS))


def save(im, name):
    im.save(os.path.join(OBJ, name + '.png'), optimize=True)
    print(name)


def plate_with(n):
    plate = load(os.path.join(PROPS, 'plate.png'), w=360)
    cookie = load(os.path.join(PROPS, 'cookie.png'), w=104 if n > 2 else 128)
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    pcx, pcy = S / 2, S - 12 - plate.height / 2
    put(im, plate, pcx, pcy)
    if n == 2:
        spots = [(pcx - 62, pcy), (pcx + 62, pcy)]
    else:   # 8: a heap - 4 at the bottom, 3 on them, 1 on top
        spots = [(pcx + dx, pcy + 30) for dx in (-108, -36, 36, 108)] + \
                [(pcx + dx, pcy - 32) for dx in (-72, 0, 72)] + [(pcx, pcy - 94)]
    for x, y in spots:
        put(im, cookie, x, y)
    return im


def row(path, ringed, h=150, lean=0):
    thing = load(path, h=h)
    if lean:   # lean forward (to the right) a little: reads as walking that way
        thing = thing.rotate(-lean, resample=Image.BICUBIC, expand=True)
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    step = 130
    xs = [S / 2 - step, S / 2, S / 2 + step]
    cy = S / 2
    # the ring is drawn inwards from its outer box (17 px band): keep a small gap between the thing and the ring
    rx, ry = thing.width / 2 + 24, thing.height / 2 + 24
    for x in xs:
        put(im, thing, x, cy)
    ring(im, xs[ringed], cy, rx, ry)
    return im


def main():
    if os.path.exists(os.path.join(PROPS, 'plate.png')) and os.path.exists(os.path.join(PROPS, 'cookie.png')):
        save(plate_with(8), 'many')
        save(plate_with(2), 'few')
    else:
        print('skip many/few: plate.png / cookie.png not in assets/props')
    save(row(os.path.join(OBJ, 'ball.png'), 1, h=96), 'middle')
    # the duckling in duck.png already turns to the right (beak right, tail left): the row walks to the right, the front one is the rightmost
    save(row(os.path.join(OBJ, 'duck.png'), 2, h=118, lean=8), 'front')
    save(row(os.path.join(OBJ, 'duck.png'), 0, h=118, lean=8), 'back')
    src = os.path.join(OBJ, 'leftsign.png')
    if os.path.exists(src):
        save(ImageOps.mirror(Image.open(src).convert('RGBA')), 'rightsign')
    else:
        print('skip rightsign: assets/obj/leftsign.png not made yet')


if __name__ == '__main__':
    main()
