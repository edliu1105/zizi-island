# -*- coding: utf-8 -*-
"""字字岛 v2 (docs/PLAN-v2.md): the two sentence islands (hosts: Iron Man, Captain America) with the backgrounds of
their four games, and the map of the third sea. Same pipeline and style rules as tools/art_batches.py.
usage: python tools/v2_batches.py  ->  batches/v2_*.md + batches/index_v2.tsv"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from art_batches import BG, ISL, write_batch, chunks

ITEMS = [
    ('raw/islands/s1.png', ISL + 'a small modern superhero tower with red and gold walls and a glowing round light on top (no letters, no logos), a little landing pad with a soft glow, a palm tree'),
    ('raw/islands/s2.png', ISL + 'a small round plaza shaped like a big round shield with red, white and blue rings and one white star in the middle, a short flagpole with a plain blue pennant (no writing), a few round green trees'),
    ('raw/bg/s1_find.jpg'.replace('.jpg', '.png'), 'a bright high-tech superhero lab in red and gold: glowing round lights in the ceiling, big windows showing a city skyline far behind, empty workbenches at the far sides, a plain smooth light floor in the whole lower half, ' + BG),
    ('raw/bg/s1_write.png', 'a quiet superhero study at the top of a tower: a huge round window with a sunset city far behind, a low red sofa at the far left, a plain smooth floor in the whole lower half, ' + BG),
    ('raw/bg/s1_abc.png', 'a rooftop landing pad at sunset: a soft glowing circle painted on the floor (no letters), city towers small and far behind, pink and orange sky, plain flat rooftop floor in the whole lower half, ' + BG),
    ('raw/bg/s1_quiz.png', 'a superhero workshop: three empty armour display stands at the far back, tool racks at the far sides, blue light strips, a plain smooth light floor in the whole lower half, ' + BG),
    ('raw/bg/s2_find.png', 'a sunny city park with brick houses far behind, round green trees at the far sides, a few small red, white and blue pennants on a string (no writing), plain flat lawn in the whole lower half, ' + BG),
    ('raw/bg/s2_write.png', 'a cosy hero training room: a wooden floor, a climbing rope and soft mats at the far sides, big windows with blue sky, a plain empty floor area in the middle and lower half, ' + BG),
    ('raw/bg/s2_abc.png', 'a city rooftop at night: tall buildings with warm lit windows far behind, a big moon, a water tower at the far right, plain flat rooftop floor in the whole lower half, ' + BG),
    ('raw/bg/s2_quiz.png', 'an outdoor hero obstacle course on a sunny day: low hurdles and tyres at the far sides, a blue sky with soft clouds, plain flat green field in the whole lower half, ' + BG),
    ('raw/bg/map_w3.png', 'a huge calm sea seen from high above under a soft rainbow sky: pastel pink, lavender and mint reflections on gentle waves, a big faint rainbow arching across the far top, a few tiny sailboats with rainbow sails far away, the middle is open water, no islands, no land, no buildings, ' + BG.replace('NO characters, NO people, NO animals', 'no islands, no people')),
]


def main():
    lines = []
    isl, rest = ITEMS[:2], ITEMS[2:]
    lines.append(write_batch('v2_isl', ['ironman', 'peppa'], isl))
    for j, ch in chunks(rest, 3):
        lines.append(write_batch('v2_bg_%d' % j, ['ironman', 'peppa'], ch))
    open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'batches', 'index_v2.tsv'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    print(len(lines), 'batches', len(ITEMS), 'images')


if __name__ == '__main__':
    main()
