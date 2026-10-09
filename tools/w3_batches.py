# -*- coding: utf-8 -*-
"""字字岛 phase 2: the rest of world 3 (彩虹海) - five hero islands (Hulk, Thor, Black Panther, Black Widow, Hawkeye),
the 20 backgrounds of their games, the festival island, the rainbow gate, the finale scene, the object pictures of the new
characters (colours, actions), the new English CVC words and the game props. Same pipeline and style rules as
tools/art_batches.py (Codex ImageGen, tools/run_batches.sh, then tools/process_art.py).
The number pictures (一 .. 十) are not generated: tools/compose_numbers.py lays out N apples (an exact count).
The family words use the client's own character pictures as they are (爸 daddy_pig, 妈 mummy_pig, 哥 gourd1, 姐 peppa,
弟 george) - nothing of them is drawn again.
usage: python tools/w3_batches.py  ->  batches/w3_*.md + batches/index_w3.tsv"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from art_batches import BG, ISL, PROP, write_batch, chunks, HEADER, FOOTER

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BD = os.path.join(ROOT, 'batches')
NOEN = ', no sun, no moon, no animals, no everyday objects (no hats, cups, boxes, bags, pens, beds, fans, pans, maps, mops, jars or logs)'

ISLANDS = {
    'hulk3': 'a rocky canyon island with big round grey boulders, a pile of cracked rocks, green grass patches and a small waterfall',
    'thor3': 'a windswept cliff island with a small Nordic wooden longhouse with a curved roof, a glowing rainbow bridge starting from the cliff edge, a small dark storm cloud with tiny lightning above the house',
    'panther3': 'a lush jungle island with a tall mountain of glowing purple crystals, big jungle trees and round stepping stones across a little river',
    'widow3': 'a secret spy base island: a small modern bunker in a green hill with a round hatch door, a radar dish and a lookout tower, red and black colours',
    'hawk3': 'an archery range island: two round red-white-yellow archery target boards on wooden stands, a small purple tent and a few trees',
    'fest3': 'a rainbow festival stage with a big rainbow arch, colourful pennant flags (no writing), balloons and paper lanterns',
    'gate3': 'a round stone ring magic gate with swirling rainbow light inside, standing on a small round rocky island',
}
BGS = {
    'hulk3': ['a rocky canyon at midday: tall red-brown cliffs far behind, a few small cacti at the far sides, a wide plain flat sandy canyon floor in the whole lower half, no rocks or boulders in the middle',
              'a quiet canyon camp at sunset: a small purple tent at the far left, a ring of stones (unlit) at the far right, a plain flat sandy ground in the middle and lower half',
              'a sunny green meadow at the foot of rocky mountains far behind, a small stream at the far right, a plain flat grassy ground in the lower half' + NOEN,
              'inside a big friendly cave gym: rough stone walls at the far sides, warm torchlight, a plain flat stone floor in the whole lower half, no loose objects'],
    'thor3': ['a wide open dramatic sky above a calm sea: a band of dark blue-grey clouds only along the very top edge, a clear open pale sky in the whole middle, a low rocky Nordic cliff along the bottom edge, no clouds in the middle',
              'inside a cosy Nordic wooden hall: carved wooden pillars at the sides, warm fire light, plain round wooden shields on the walls (no symbols), a plain wooden floor in the middle and lower half',
              'a glowing rainbow bridge across a starry evening sky far behind, a golden palace small and far away, a plain flat golden floor in the lower half' + NOEN,
              'a Nordic mountain village at dusk: small wooden houses far behind, pine trees at the far sides, a plain flat snowy ground in the whole lower half, no lights or lamps in the middle'],
    'panther3': ['a lush jungle river gorge: big green trees and vines at the far sides, a misty waterfall far behind, a calm wide river along the whole bottom, no stones or platforms in the river',
                 'a calm jungle clearing with soft sunbeams, giant leaves at the far sides, a plain flat mossy ground in the middle and lower half',
                 'a futuristic African city with tall rounded towers and green roof gardens far behind, a plain flat plaza floor in the lower half' + NOEN,
                 'an art room in a big jungle tree house: wooden walls, big windows with a jungle view, a plain wooden floor in the whole lower half, no paint, no paint pots, no pictures'],
    'widow3': ['a dark secret spy room at night: softly glowing computer screens at the far sides (no writing), deep blue shadows, a plain dark floor in the whole lower half',
               'a tidy spy headquarters: a long desk with glowing screens (no writing) at the far left, a big window with a city at night far behind, a plain smooth floor in the middle and lower half',
               'a secret underground tunnel with round glowing lamps along the walls, a plain smooth floor in the lower half' + NOEN,
               'a cosy empty family living room: a long sofa far at the back, a soft round rug, a big plain empty frame on the wall (blank, nothing inside), a plain floor in the lower half, no people, no photos'],
    'hawk3': ['an outdoor archery field on a sunny day: a wooden fence and round trees far behind, a plain flat lawn in the whole lower half, no archery targets, no arrows',
              'a quiet forest cabin porch: wooden railings at the sides, an empty wooden rack at the far side, a plain wooden floor in the middle and lower half',
              'a high treetop lookout platform above a forest, distant blue hills, a plain wooden platform floor in the lower half' + NOEN,
              'a sunny park path: round trees far behind, an empty bench at the far right, a plain flat ground in the whole lower half, no food, no cups, no books'],
}
GAMES = ['find', 'write', 'abc', 'quiz']
FINALE = ('finale_w3', 'a rainbow festival on a beach at sunset: a giant rainbow arch far at the back, colourful balloons and kites in the sky, paper lanterns on strings, a wide plain flat stage in the whole lower half')

KID = ('the same cute generic preschool boy as in the reference picture (messy brown hair, big brown eyes, yellow hooded jacket over a white t-shirt, '
       'blue shorts, red sneakers), full body, ')
OBJ = {
    # colours: one thing of that colour that is not itself a character the child knows (no flower, sun, car, leaf, cloud ...)
    'strawberry': 'one big ripe RED strawberry with a small green leaf top, clearly red',
    'banana': 'one bright YELLOW banana, clearly yellow',
    'whale': 'a cute friendly BLUE whale with a small water spout, clearly blue',
    'dino': 'a cute friendly GREEN baby dinosaur toy standing, clearly green all over',
    'polarbear': 'a cute WHITE polar bear cub sitting, clearly white fur with a light grey outline shading',
    # new English CVC words
    'bat': 'a cute friendly little black bat animal with open wings',
    'fan': 'a small electric desk fan with blue blades',
    'pan': 'a black frying pan with a handle, empty',
    'map': 'a treasure map on old paper with a dotted path, a red cross and little hills (no writing)',
    'mop': 'a cleaning mop with a wooden handle and a grey string head',
    'top': 'a colourful wooden spinning top toy',
    'web': 'a round spider web, grey threads (no spider)',
    'jam': 'a glass jar of red strawberry jam with a checked cloth lid (no label writing)',
    'log': 'a short wooden log lying on its side, showing tree rings',
}
ACT = {
    'eat': KID + 'sitting and happily eating noodles from a small bowl with a spoon, mouth open on the spoon',
    'drink': KID + 'standing and drinking a glass of water, head tipped back a little, the glass at his mouth',
    'look': KID + 'looking through a pair of toy binoculars, standing',
    'walk': KID + 'walking to the right seen from the side, one leg forward mid-stride, arms swinging',
    'come': KID + 'standing facing us and beckoning with one hand, palm up, curling his fingers as if saying come here, friendly smile',
}
PROPS = {
    'boulder': 'one big round grey boulder with a few cracks, a flat smooth front face',
    'stormcloud': 'one dark blue-grey storm cloud, round and puffy, a tiny yellow spark at its bottom',
    'platform': 'one round stone pillar platform with a flat mossy top, seen from the front, jungle vines on its side',
    'torch': 'a yellow flashlight torch seen from the side, pointing up-right, switched on with a small beam',
    'target': 'one round archery target board with red, white and yellow rings on a small wooden tripod stand, seen from the front',
}
ACT_HEADER = HEADER.replace('NEVER draw the reference characters, and never draw people or characters unless the prompt explicitly asks for one.',
                            'The reference picture shows the generic boy of the app: draw that SAME boy (same face, hair, clothes) doing what the prompt says. Draw no other people or characters.')


def write_act(bid, items):
    body = [ACT_HEADER]
    for k, (t, p) in enumerate(items, 1):
        body.append('Image %d\nTarget path: %s\nPrompt: %s\n' % (k, t, p))
    body.append(FOOTER)
    open(os.path.join(BD, bid + '.md'), 'w', encoding='utf-8').write('\n'.join(body))
    return '%s\t%s\t%s' % (bid, 'raw/refs/person.png', ','.join(t for t, _ in items))


def main():
    os.makedirs(BD, exist_ok=True)
    lines = []
    isl = [('raw/islands/%s.png' % i, ISL + p) for i, p in ISLANDS.items()]
    for j, ch in chunks(isl, 3):
        lines.append(write_batch('w3_isl_%d' % j, ['ironman', 'peppa'], ch))
    for iid, four in BGS.items():
        items = [('raw/bg/%s_%s.png' % (iid, g), four[k] + ', ' + BG) for k, g in enumerate(GAMES)]
        for j, ch in chunks(items, 2):
            lines.append(write_batch('w3_bg_%s_%d' % (iid, j), ['ironman', 'peppa'], ch))
    lines.append(write_batch('w3_finale', ['ironman', 'peppa'], [('raw/bg/%s.png' % FINALE[0], FINALE[1] + ', ' + BG)]))
    objs = [('raw/obj/%s.png' % o, d + ', ' + PROP) for o, d in OBJ.items()]
    for j, ch in chunks(objs, 3):
        lines.append(write_batch('w3_obj_%d' % j, ['peppa', 'chase'], ch))
    acts = [('raw/obj/%s.png' % o, d + ', ' + PROP) for o, d in ACT.items()]
    for j, ch in chunks(acts, 3):
        lines.append(write_act('w3_act_%d' % j, ch))
    props = [('raw/props/%s.png' % o, d + ', ' + PROP) for o, d in PROPS.items()]
    for j, ch in chunks(props, 3):
        lines.append(write_batch('w3_props_%d' % j, ['peppa', 'wukong'], ch))
    open(os.path.join(BD, 'index_w3.tsv'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    print(len(lines), 'batches', len(isl) + 20 + 1 + len(objs) + len(acts) + len(props), 'images')


if __name__ == '__main__':
    main()
