# -*- coding: utf-8 -*-
"""Every generated picture into the app's assets: backgrounds (1280 + a 160 thumb), maps, the finale scenes; islands,
objects and props cut out of their white ground (objects / props get the gloss matte); the new characters cut out at
496 px high + a round-avatar thumbnail; the app icon in all sizes. A contact sheet per group -> raw/sheet_<group>.jpg
usage: python tools/process_art.py [group ...]   (groups: bg obj props islands chars icon)  [--only name,name]"""
import os, sys, glob
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cutout import cutout
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'assets'); R = os.path.join(ROOT, 'raw')
NO_MATTE = {'egg', 'cloud', 'sheep', 'rice', 'ricebowl', 'spoon', 'towel', 'milk', 'book', 'notebook', 'scroll', 'unicorn', 'cow', 'zebra', 'yogurt',
            'tent', 'tile', 'block', 'card', 'stone_tablet', 'bed', 'quilt', 'house', 'window', 'satchel', 'soup', 'lamp', 'light', 'bus', 'mouth', 'eye'}


def save_png(im, path, maxs):
    if max(im.size) > maxs:
        k = maxs / max(im.size); im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    im.quantize(colors=256, method=Image.FASTOCTREE, dither=Image.NONE).save(path, optimize=True)
    return im.size


def _sat(x):
    mx = x.max(-1); mn = x.min(-1)
    return np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-6), 0), mx


def _blur(x, r):
    if x.ndim == 3:
        return np.dstack([_blur(x[..., i], r) for i in range(x.shape[-1])])
    return np.asarray(Image.fromarray(np.clip(x * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255


def matte(im, white=0.4):
    """the gloss matte of 点点岛: glossy near-white highlights inside strong colour take the colour around them"""
    a = np.asarray(im.convert('RGBA')).astype(np.float32) / 255
    rgb, al = a[..., :3], a[..., 3]
    Rr = max(im.size) / 1100.0
    s, v = _sat(rgb)
    ink = (v < 0.3) & (al > 0.3)
    inkd = np.asarray(Image.fromarray((ink * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(int(9 * Rr) | 1))) > 0
    cand = (s < 0.4) & (v > 0.78) & (al > 0.5)
    valid = ((~cand) & (~ink) & (al > 0.5)).astype(np.float32)
    num = _blur(rgb * valid[..., None], 28 * Rr); den = _blur(valid, 28 * Rr)[..., None]
    fill = np.clip(num / np.maximum(den, 1e-3), 0, 1)
    fs, _ = _sat(fill)
    m = cand * np.clip((fs - 0.38) / 0.2, 0, 1) * (~inkd) * (den[..., 0] > 0.05)
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(2 * Rr))).astype(np.float32) / 255
    tint = fill * (1 - white) + white
    out = rgb * (1 - m[..., None]) + tint * m[..., None]
    return Image.fromarray((np.clip(np.dstack([out, al]), 0, 1) * 255).astype(np.uint8), 'RGBA')


def on_white(src):
    im = Image.open(src)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        if min(im.getpixel((2, 2))[3], im.getpixel((im.width - 3, im.height - 3))[3]) < 128:
            w = Image.new('RGBA', im.size, (255, 255, 255, 255)); w.alpha_composite(im)
            fixed = os.path.join(R, 'cut', os.path.basename(src)[:-4] + '_white.png'); w.convert('RGB').save(fixed); return fixed
    return src


def sheet(name, tiles):
    if not tiles:
        return
    cols = 10; S = 160; rows = (len(tiles) + cols - 1) // cols
    sh = Image.new('RGB', (cols * S, rows * S), (200, 228, 255))
    for i, (n, im) in enumerate(tiles):
        t = im.copy(); t.thumbnail((S - 8, S - 8))
        bg = Image.new('RGBA', (S, S), (200, 228, 255, 255)); bg.alpha_composite(t.convert('RGBA'), ((S - t.width) // 2, (S - t.height) // 2))
        sh.paste(bg.convert('RGB'), ((i % cols) * S, (i // cols) * S))
    sh.save(os.path.join(R, 'sheet_%s.jpg' % name), quality=82)


def run(groups, only):
    os.makedirs(os.path.join(R, 'cut'), exist_ok=True)
    for d in ('bg', 'bgthumb', 'obj', 'props', 'isl', 'chars', 'thumbs'):
        os.makedirs(os.path.join(A, d), exist_ok=True)
    want = lambda n: not only or n in only
    if 'bg' in groups:
        tiles = []
        for f in sorted(glob.glob(os.path.join(R, 'bg', '*.png'))):
            n = os.path.basename(f)[:-4]
            if not want(n):
                continue
            im = Image.open(f).convert('RGB').resize((1280, 1280), Image.LANCZOS)
            im.save(os.path.join(A, 'bg', n + '.jpg'), quality=78, optimize=True, progressive=True)
            if not n.startswith('map_'):
                im.resize((160, 160), Image.LANCZOS).save(os.path.join(A, 'bgthumb', n + '.jpg'), quality=55, optimize=True)
            tiles.append((n, im))
        sheet('bg', tiles); print('bg', len(tiles))
    for grp, sub, out, maxs in (('obj', 'obj', 'obj', 400), ('props', 'props', 'props', 420), ('islands', 'islands', 'isl', 512)):
        if grp not in groups:
            continue
        tiles = []
        for f in sorted(glob.glob(os.path.join(R, sub, '*.png'))):
            n = os.path.basename(f)[:-4]
            if not want(n):
                continue
            cut = os.path.join(R, 'cut', sub + '_' + n + '.png')
            try:
                cutout(on_white(f), cut)
            except SystemExit as e:
                print('CUT FAIL', n, e); continue
            im = Image.open(cut).convert('RGBA')
            if grp != 'islands' and n not in NO_MATTE:
                im = matte(im, 0.4)
            save_png(im, os.path.join(A, out, n + '.png'), maxs)
            tiles.append((n, im))
        sheet(grp, tiles); print(grp, len(tiles))
    if 'chars' in groups:
        tiles = []
        for f in sorted(glob.glob(os.path.join(R, 'chars', '*.png'))):
            n = os.path.basename(f)[:-4]
            if not want(n):
                continue
            cut = os.path.join(R, 'cut', 'char_' + n + '.png')
            cutout(on_white(f), cut)
            im = Image.open(cut).convert('RGBA')
            k = 496 / im.height; im = im.resize((round(im.width * k), 496), Image.LANCZOS)
            im.save(os.path.join(A, 'chars', n + '.png'), optimize=True)
            w, h = im.size; s = int(min(w, h * 0.5)); x0 = (w - s) // 2
            th = im.crop((x0, int(h * 0.02), x0 + s, int(h * 0.02) + s)).resize((160, 160), Image.LANCZOS)
            th.save(os.path.join(A, 'thumbs', n + '.png'), optimize=True)
            tiles.append((n, im))
        sheet('chars', tiles); print('chars', len(tiles))
    if 'icon' in groups:
        src = os.path.join(R, 'icon', 'app_icon.png')
        if os.path.exists(src):
            im = Image.open(src).convert('RGB')
            im.resize((512, 512), Image.LANCZOS).save(os.path.join(A, 'logo.jpg'), quality=86)
            for s in (180, 192, 512):
                im.resize((s, s), Image.LANCZOS).save(os.path.join(A, 'icon-%d.png' % s), optimize=True)
            m = Image.new('RGB', (512, 512), (255, 244, 214)); m.paste(im.resize((410, 410), Image.LANCZOS), (51, 51)); m.save(os.path.join(A, 'icon-maskable-512.png'), optimize=True)
            print('icon ok')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--only')]
    only = set()
    for a in sys.argv[1:]:
        if a.startswith('--only='):
            only = set(a[7:].split(','))
    run(args or ['bg', 'obj', 'props', 'islands', 'chars', 'icon'], only)
