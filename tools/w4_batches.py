# -*- coding: utf-8 -*-
"""字字岛 world 4 - 神笔海 (docs/W4-DESIGN.md §3, §6 「场景」, §8): the ink-wash sea map, the seven islands, the moon gate, the
magic-brush entrance, the temple-fair island, the finale scene, the 28 game backgrounds, the object pictures of the 25 new
characters that get a drawn picture (§8.1), the 14 new English word pictures (§8.2) and the mole prop.
Same pipeline and style rules as tools/art_batches.py and tools/w3_batches.py (Codex ImageGen, tools/run_batches.sh, then
tools/process_art.py --only=<new names>). A game background never shows the things its game asks about (§6, §8.3).
The poem picture goose (《咏鹅》) is drawn with the objects. The boy pictures (坐 站 说 听 去 头, run) are the same generic boy as look.png / walk.png (raw/refs/person.png as the reference);
the girl, grandma, baby and man are NEW people drawn in that boy's style. 开 / 关 are the same chest (assets/props/chest.png as
the reference), door_open is the same door as assets/obj/door.png. Nothing of the client's character pictures is drawn.
The composed pictures (多 少 中 前 后 右) are not generated: tools/compose_w4.py lays them out.
usage: python tools/w4_batches.py  ->  batches/w4_*.md + batches/index_w4.tsv;  bash tools/run_batches.sh batches/index_w4.tsv 6
       python tools/w4_batches.py --redo=name,name  ->  batches/index_w4redo.tsv (delete those raw files first)"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from art_batches import BG, ISL, PROP, chunks, HEADER, FOOTER

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BD = os.path.join(ROOT, 'batches')
PEP = 'simple flat shapes like a preschool TV cartoon, '
# the English games show word pictures on top: their backgrounds hold no everyday things that could be one of the words
NOEN = (', no sun, no moon, no animals, no everyday objects (no hats, caps, cups, mugs, jugs, rugs, mats, nets, beds, boxes, pans, fans, '
        'maps, mops, buns, cans or wigs), no letters anywhere')
FLOOR = ', a plain flat empty ground in the whole lower half with nothing on it'

# ---------------------------------------------------------------- the 28 game backgrounds: find / write / abc / quiz
BGS = {
    'ultra4': ['a wide empty flat plain on a shining alien planet just outside a futuristic city of light: slim glowing crystal towers small and far away on the horizon, pale lavender mountains far behind, a blue and violet sky with a few faint stars, the whole lower half a smooth plain flat light blue-grey ground with nothing on it, no holes, no craters, no rocks, no animals, no plants',
               'a calm quiet crystal terrace of a city of light at twilight: a few slim glowing crystal towers only at the far left and far right edges, a soft blue and lavender sky, a plain smooth pale floor, a big empty calm area in the whole middle',
               'inside a bright futuristic laboratory of a city of light: smooth white and pale blue walls with soft glowing light strips, tall glass capsules only at the far sides, the walls completely blank, a plain smooth floor' + FLOOR + NOEN + ', no screens with writing, no symbols',
               'inside a treasure vault of a city of light: smooth silver-blue crystal walls, a few EMPTY glass display shelves and empty round pedestals only along the far left and far right sides, soft glowing light from the ceiling, a plain smooth floor' + FLOOR + ', nothing on the shelves, no treasures, no writing, no symbols, no pictures'],
    'peppa4': [PEP + 'a little clinic waiting room: plain pastel mint walls, a row of three small chairs along the far left wall, a window with a blue sky at the far right, a plain light floor' + FLOOR + ', the walls are completely plain: no posters, no charts, no pictures, no writing, no body pictures, no toys',
               PEP + 'a quiet little doctor room: soft pastel pink walls, a small potted plant at the far left, a small window at the far right, a plain light floor, a big empty calm wall area in the whole middle, no posters, no charts, no writing',
               PEP + 'a grassy lawn and a little winding dirt path in front of a small yellow house with a red roof on top of a round green hill far behind, a light blue sky' + FLOOR + NOEN,
               PEP + 'a child desk seen from the front: a plain light wooden desk top across the whole lower part with one blank white sheet of paper lying on it, a plain pastel wall behind with nothing on it, no pictures, no writing, no pencils, no books, no toys'],
    'pj4': ['a funfair at night: strings of small glowing lanterns along the very top edge, a big Ferris wheel small and far behind at the left, colourful striped tents only at the far sides, a deep blue night sky with a round moon at the top right, a wide plain flat empty paved square in the whole middle and lower half, no carousel, no merry-go-round, no horses, no rides in the middle, no people',
            'a quiet night sky above a sleeping funfair: a deep blue sky with a few small stars and a round moon at the top right, the dark low outlines of tents and a Ferris wheel only along the bottom edge, a big calm empty sky in the whole middle',
            'inside a round superhero headquarters at night: one big EMPTY blank light-blue screen on the back wall, round windows showing the starry night sky at the sides, soft blue glowing lights, a plain floor' + NOEN + ', nothing on the screen, no writing',
            'a training room inside a round superhero headquarters at night: deep blue walls with soft glowing light strips, completely plain walls, a plain soft padded floor' + FLOOR + ', no pictures on the walls, no posters, no screens, no equipment in the middle'],
    'xiyou4': ['in front of the Water Curtain Cave: ONE huge old peach tree in the middle with its thick trunk at the centre and its very wide leafy green crown filling the WHOLE upper half of the picture from the left edge to the right edge, only green leaves on it (NO peaches, NO fruit, NO blossoms, no flowers), below and behind it at the left a waterfall pouring like a curtain over a cave mouth, mossy rocks at the far sides, a plain flat grassy ground in the lower half, no baskets, no animals',   # v2: the crown must hold the 5 peaches the game hangs anywhere along the top
               'a quiet pool below a waterfall on a lush green mountain: a thin waterfall at the far right, mossy rocks and ferns at the far sides, soft mist, a calm empty middle, no animals',
               'the top of a green mountain peak: one big smooth grey boulder at the far left, a wide open blue sky with soft white clouds, a plain flat grassy mountain top in the lower half' + NOEN,
               'a plain flat grassy meadow at the foot of a lush green Chinese mountain: the mountain with a thin waterfall far behind, a few trees at the far sides' + FLOOR + ', no houses, no huts, no buildings, no animals'],
    'huluwa4': ['inside a big friendly mountain cave: rough brown and grey rock walls, soft daylight coming from a round cave opening far at the back, a few green gourd-vine leaves hanging only at the top corners, a plain smooth stone floor' + FLOOR + ', the cave walls are bare: no lamps, no lanterns, no torches, no lights on the walls, no gourds, no crystals',
                'a quiet mountain slope in front of a cave closed by a big round stone door at the far left, green gourd-vine leaves along the top edge (leaves only, no gourds), misty green mountains far behind, a big calm empty middle',
                'a little clear stream running along the bottom at the foot of a green Chinese mountain: soft grassy banks, misty mountains far behind, willow branches at the far sides, plain flat grass in the middle, no bridge' + NOEN,
                'a gentle green grassy slope on a mountain: green gourd-vine leaves along the top edge (leaves only, no gourds), misty mountains far behind' + FLOOR + ', no seesaw, no playground, no objects, no animals'],
    'paw4': ['a sunny town square by the sea: small colourful houses and a tall lookout tower small and far behind, blue sea at the far right, a blue sky, the whole lower half a plain smooth flat pale ground with nothing on it, no paving pattern, no tiles, no lines, no vehicles, no animals, no signs',
             'a quiet seaside road at sunset: a calm sea and a lookout tower small and far away at the right, a low green hill at the left, a big calm empty sky in the whole middle, no traffic signs, no vehicles',
             'inside a lookout tower: one big EMPTY blank light-blue screen on the back wall, big windows at the sides showing a bay and a blue sky, red and blue panels at the sides, a plain floor' + NOEN + ', nothing on the screen, no writing',
             'a crossroads seen straight from above like a map: two plain grey roads crossing in the middle of the picture and reaching all four edges, plain green grass corners with a few small round trees near the corners, completely plain grey asphalt with NO markings at all: no arrows, no lines, no zebra crossings, no writing, no cars, no vehicles, no people, no buildings'],
    'bluey4': ['a grassy hill behind a blue timber house: the house small at the bottom left corner, a gum tree at the far right, a huge open clear blue sky in the whole upper two thirds that is completely empty (no kites, no birds, no clouds), a plain green grassy hilltop along the bottom, no people, no animals',
               'a quiet backyard in soft afternoon light: a gum tree at the far left, a low wooden fence far at the back, a calm pale sky, a plain lawn, a big calm empty middle',
               'an empty bright family living room with NO furniture at all: plain light walls, two big windows on the back wall showing a garden, a plain light wooden floor in the whole lower half, no bed, no box, no rug, no mat, no carpet, no couch, no table, no toys, no animals, no letters, no pictures on the walls',
               'a sunny backyard: one big plain empty red-and-white checked picnic blanket spread flat across the lower middle on a green lawn, a gum tree at the far side, a blue sky, nothing on the blanket: no food, no basket, no cups, no plates, no animals, no people'],
}
GAMES = ['find', 'write', 'abc', 'quiz']
REFS = {'ultra4': 'ironman', 'peppa4': 'peppa', 'pj4': 'ironman', 'xiyou4': 'wukong', 'huluwa4': 'gourd4', 'paw4': 'chase', 'bluey4': 'bluey'}
FINALE = ('finale_w4', 'a Chinese temple fair at dusk: strings of red paper lanterns across the top, a small red stage with a long colourful Chinese dragon-dance dragon resting on its poles far at the back left, a little candied-hawthorn stall with red sugar-coated fruit skewers far at the back right, a warm orange and purple dusk sky, a wide plain flat empty stage in the whole lower half, no people, no writing on anything, no signs, no banners with writing')

# ---------------------------------------------------------------- the ink-wash map (its own style: not the cartoon BG string)
MAP = ('raw/bg/map_w4.png',
       'a traditional Chinese ink-wash painting of a wide calm sea painted on cream rice paper, seen from high above: pale celadon grey-green water with a few soft '
       'ink-brush wave strokes, very pale grey ink mountains far away only along the very top edge, a small clump of green bamboo at the bottom left corner edge, a '
       'small pine tree on a rock at the bottom right corner edge, three or four small plain red seal-stamp marks near the corners (solid vermilion squares and circles '
       'with only a simple border, absolutely NO characters, NO symbols inside them), the whole middle and all the rest is calm open water with nothing on it, no '
       'islands, no boats, no birds, no people, no text, no calligraphy, no writing, no characters, gentle soft brush texture, full-bleed OPAQUE square painting up '
       'to all four edges, no border, no frame, no vignette')
MAP_HEADER = HEADER.replace(
    'The attached images are STYLE REFERENCES ONLY (character stickers of the same app). Match their line weight, bold dark outline, soft cel shading, saturation and overall chibi picture-book look, so the new picture looks drawn by the same artist.',
    'There is no reference image for this picture: it is painted in its own style, Chinese ink wash on rice paper, as the prompt says.')

# ---------------------------------------------------------------- islands, the moon gate, the brush entrance, the temple-fair island
ISLANDS = {
    'ultra4': 'the island looks like a tiny silver-blue planet surface of a city of light: shining slim crystal towers with glowing tips, a round glowing landing pad that is completely plain with no markings, smooth silver paths, a few small glowing crystals',
    'peppa4': 'a small cute clinic cottage with pink walls, a red roof and a round blank white sign board on the roof (completely plain: no cross, no symbols, no writing), a green lawn with a little path, a few flowers and a small bench',
    'pj4': 'a night funfair: a little colourful carousel with a striped roof, strings of glowing paper lanterns on poles, a tiny Ferris wheel, deep-blue evening colours with warm glowing lights, the little patch of sea around it dark blue at night',
    'xiyou4': 'a rocky green mountain with a waterfall pouring like a curtain over a dark cave mouth, a peach tree with pink peaches beside it, mossy rocks and ferns',
    'huluwa4': 'a small green mountain with a cave closed by a big round stone door, thick climbing gourd vines with big green leaves and a few small colourful gourds over the rocks',
    'paw4': 'a little crossroads of two short plain roads (no markings) with small traffic lights at the corners, a tall red, white and blue lookout tower with a round top, a few round trees',
    'bluey4': 'a grassy hill with a blue timber house on stilts with a veranda, a gum tree, a colourful kite flying high above the hill on a long string',
    'gate4': 'a round Chinese garden moon gate: a short white plastered wall with a grey curved tiled roof along its top and a perfect big circular opening in the middle, soft glowing sea-blue light shining inside the circle, standing on a small rocky islet with a little pine tree',
    # v2: tip up read as a torch -> the brush stands on its pointed tip in the inkstone, the tip glowing gold
    'brush4': 'a giant Chinese calligraphy brush standing upright on its pointed bristle tip in the middle of a small black stone inkstone: a long bamboo-coloured handle pointing up with a little red tassel loop at its top end, the tapered soft bristle tip at the bottom shining bright GOLD with golden glowing light and sparkles around it, the inkstone sitting on a tiny rocky islet with a little pine tree',
    'fest4': 'a temple-fair island: strings of red paper lanterns on poles, a small red stage with a colourful Chinese dragon-dance dragon resting on it, a little candied-hawthorn stall with red fruit skewers, red and gold colours, no writing on anything, no signs, no people',
}

# ---------------------------------------------------------------- objects (§8.1, §8.2): one thing on white, PROP style
OBJ = {
    # 天: no sun, cloud or bird (日 云 鸟)
    'sky': 'a rounded-square picture patch of a wide clear blue sky above a low gentle green grassy hillside along its bottom, one tiny red diamond kite with a short tail very far away high in the sky, NO sun, NO clouds, NO birds, NO trees',
    # 地: not like the sun (yellow)
    'earth': 'the cartoon planet Earth as a round globe: blue oceans and green continents, a cute happy smiling face, no rays, no sun, no stars',
    # 金: not grey (石)
    'gold': 'a small pile of shiny golden nuggets with one smooth golden bar lying in front, bright gold yellow with white sparkles, no coins, no stamps or symbols on the bar',
    # 土: not a green pointed peak (山)
    'soil': 'a small low rounded heap of dark brown garden soil with a small garden trowel (a little shovel with a wooden handle) stuck in it, no plants, no sprouts, no grass',
    # 川: no mountains (山), not a splash (水)
    'river': 'a rounded-square picture patch seen straight from above like a map: a blue river winding in gentle S-curves from the top to the bottom between two green grassy banks, no mountains, no trees, no water splash, no boats',
    'tooth': 'one big white cartoon tooth with a cute happy smiling face and two little rounded roots, a small blue toothbrush leaning next to it',
    'heart': 'one shiny red love heart shape with a white glossy highlight',
    # 飞: no bird (鸟)
    'plane': 'a small cute red and white propeller aeroplane flying to the right, slightly tilted upwards, a curly white smoke trail line behind it, no birds, no clouds',
    'check': 'one big bright green tick mark inside a round green stamp ring, the inside of the ring white, like a teacher approval stamp, no writing, no letters, no stars',
    # 雪: no snowman (人)
    'snow': 'one big pale-blue six-armed snowflake crystal with a darker blue outline in the middle, several small light blue snowflakes floating around it, no snowman, no people',
    # 草: no flowers (花)
    'grass': 'one lush clump of green grass blades of different heights, fresh green, NO flowers, no buds, no soil heap',
    # 左 (右 is the same picture mirrored by tools/compose_w4.py)
    'leftsign': 'a wooden signpost: one short wooden post in the ground with ONE big wooden board shaped like an arrow pointing clearly to the LEFT, the board completely plain wood with nothing written on it, no letters, no symbols, no other boards',
    # English words (§8.2)
    'mat': 'a small rectangular green woven doormat seen from slightly above, lying flat, a plain woven texture with a darker green border, no writing',
    'rat': 'a cute grey rat with a long pink tail, big round ears and a pink nose, standing on four legs seen from the side',
    'cap': 'a blue baseball cap with a curved peak seen from the side-front, plain with no logo, no letters',
    'wig': 'a big bright curly orange party wig sitting on a plain white wig stand (a simple smooth white head shape with NO face)',
    'fig': 'one whole ripe purple fig fruit and next to it one fig cut in half showing its pink seedy inside',
    'rug': 'a soft round rug with colourful rainbow stripes in rings and little fringe tassels around its edge, seen from slightly above, lying flat',
    'mug': 'a big chunky red ceramic mug with white polka dots and a big round handle, full of hot cocoa with a little steam',
    'jug': 'a blue ceramic water jug (pitcher) with a pouring spout and a big handle, side view',
    'hop': 'a cute light brown bunny in the middle of a big hop: all four feet up in the air, ears flying back, a curved dotted jump arc behind it showing the hop',
    'hen': 'a plump brown hen with a red comb and wattle standing on two yellow legs, side view',
    'net': 'a butterfly net: a long wooden handle with a round hoop and a white mesh net bag, no butterfly',
    # 《咏鹅》 (the poem scroll): clearly a goose, not a duck
    'goose': 'a white goose floating on a small patch of calm blue water, side view: a long gracefully curved S-shaped neck held high, a bright orange beak with the knob at its base, white feathers with soft grey shading on the wings, orange webbed feet paddling just under the water, clearly a big goose and NOT a duck',
}
# body parts in the style of the existing nose / hand stickers
BODY = {
    'ear': 'one cartoon human ear on its own seen from the side: skin coloured with soft pink inner shading, a close-up body part with no head, no face and no hair, drawn exactly like the reference nose and hand stickers',
    'foot': 'one bare cartoon child foot with the ankle and a little of the lower leg kicking a small black-and-white football: the foot is big and the main subject, the ball smaller at its toes, skin coloured like the reference stickers, no shoe, no sock',
}
KID = ('the same cute generic preschool boy as in the reference pictures (messy brown hair, big brown eyes, yellow hooded jacket over a white t-shirt, '
       'blue shorts, red sneakers), ')
ACT = {
    'head': 'only the HEAD of ' + KID.replace('(messy brown hair, big brown eyes, yellow hooded jacket over a white t-shirt, blue shorts, red sneakers)', '(messy brown hair, big brown eyes)') + 'front view, a big happy smile, no neck, no body, no shoulders, no clothes',
    'sit': KID + 'full body, sitting upright on a small round wooden stool facing us, both hands resting on his knees, feet on the ground, a calm smile, not waving',
    'stand': KID + 'full body, standing up straight facing us like a soldier: heels and feet together, both arms straight down by his sides, a proud smile, not waving, not walking',
    'talk': KID + 'full body, standing and talking: mouth wide open as if speaking, one hand open at his chest, beside his head a white round speech bubble that contains ONLY three dark dots (no letters, no words)',
    'listen': KID + 'full body, standing and listening carefully: one hand cupped behind his ear, eyes looking to the side, a few small floating music notes coming towards his ear',
    # v2: v1 faced us (read as 来): the back must face the viewer
    'goaway': KID + 'full body, seen from BEHIND: we see his BACK, the back of his yellow jacket and a small red backpack worn on his back, he is walking AWAY from us towards the top of the picture, one foot lifted with the sole of the red sneaker showing, his head turned to the side over his shoulder so we see his face only in profile, one arm raised high waving goodbye',
    'run': KID + 'full body, running fast to the right seen from the side: leaning forward, arms pumping, both feet off the ground, speed lines behind him',
}
NEWP = {
    'girl': 'a cute generic little girl (NOT the boy): two pigtails with red hair bows, brown hair, a yellow and orange dress, white socks and red shoes, full body, standing and waving one hand with a big smile',
    'grandma': 'a cute generic cartoon grandma: grey hair in a round bun, round glasses, a kind smile, a soft purple cardigan over a light blouse, a long skirt, full body, standing',
    'baby': 'a cute chubby baby sitting on the floor in a white nappy, a little tuft of brown hair, holding up a colourful baby rattle in one hand and laughing',
    'man': 'a friendly generic grown-up man: short brown hair, a blue shirt with rolled sleeves, jeans and brown shoes, full body, standing and smiling with one hand waving',
}
CHEST = 'the SAME treasure chest as in the reference picture (same wood, same golden trim and corners, same shape and size, same viewing angle), '
REFOBJ = [
    ('w4_chest', 'assets/props/chest.png', 'The reference picture shows a treasure chest of the app: draw that SAME chest (same design, colours and angle) as the prompt says.',
     [('chest_shut', CHEST + 'with its lid CLOSED and a small golden padlock hanging on the front clasp, no light'),
      ('chest_open', CHEST + 'with its lid wide OPEN and warm golden light shining out from inside, nothing visible inside but the light')]),
    ('w4_door', 'assets/obj/door.png', 'The reference picture shows a front door of the app: draw that SAME door (same wood, same arched top, same little window and knob) as the prompt says.',
     [('door_open', 'the SAME wooden front door as in the reference picture standing in its door frame, swung wide OPEN to one side so that the doorway shows bright warm light inside, front view')]),
]
PROPS = {
    'mole': 'a cute friendly little cartoon mole popping up, only its upper body, front view: soft grey-brown fur, a big pink nose, tiny happy eyes, both little pink paws raised high above its head as if lifting something (the paws hold nothing), the body ends in a straight soft edge at the bottom, no soil, no hole, no ground',
}

ACT_HEADER = HEADER.replace('NEVER draw the reference characters, and never draw people or characters unless the prompt explicitly asks for one.',
                            'The reference pictures show the generic boy of the app: draw that SAME boy (same face, hair, clothes) doing what the prompt says. Draw no other people or characters.')
NEWP_HEADER = HEADER.replace('NEVER draw the reference characters, and never draw people or characters unless the prompt explicitly asks for one.',
                             'The reference picture shows the generic boy of the app: draw a NEW, DIFFERENT person (as the prompt says, NOT the boy) in exactly the same art style (same line weight, same face and eye style, same shading). Draw no other people, no known cartoon characters.')
BODY_HEADER = HEADER.replace('NEVER draw the reference characters, and never draw people or characters unless the prompt explicitly asks for one.',
                             'The reference pictures show body-part stickers of the app (a nose, a hand): draw the new body part in exactly the same style and skin colour. Draw no people, no faces, no characters.')


def write_custom(bid, header, refs, items):
    body = [header]
    for k, (t, p) in enumerate(items, 1):
        body.append('Image %d\nTarget path: %s\nPrompt: %s\n' % (k, t, p))
    body.append(FOOTER)
    open(os.path.join(BD, bid + '.md'), 'w', encoding='utf-8').write('\n'.join(body))
    return '%s\t%s\t%s' % (bid, ','.join(refs), ','.join(t for t, _ in items))


def batches():
    """every batch as (id, header, reference images, [(target, prompt)])"""
    R = lambda *names: ['raw/refs/%s.png' % n for n in names]
    out = [('w4_map', MAP_HEADER, [], [MAP])]
    # backgrounds first (the biggest paintings), two per batch
    for iid, four in BGS.items():
        items = [('raw/bg/%s_%s.png' % (iid, g), four[k] + ', ' + BG) for k, g in enumerate(GAMES)]
        for j, ch in chunks(items, 2):
            out.append(('w4_bg_%s_%d' % (iid, j), HEADER, R(REFS[iid], 'bluey' if REFS[iid] == 'peppa' else 'peppa'), ch))
    out.append(('w4_finale', HEADER, R('wukong', 'peppa'), [('raw/bg/%s.png' % FINALE[0], FINALE[1] + ', ' + BG)]))
    isl = [('raw/islands/%s.png' % i, ISL + p) for i, p in ISLANDS.items()]
    for j, ch in chunks(isl, 3):
        out.append(('w4_isl_%d' % j, HEADER, R('ironman', 'peppa'), ch))
    objs = [('raw/obj/%s.png' % o, d + ', ' + PROP) for o, d in OBJ.items()]
    for j, ch in chunks(objs, 3):
        out.append(('w4_obj_%d' % j, HEADER, R('peppa', 'chase'), ch))
    out.append(('w4_body', BODY_HEADER, ['assets/obj/nose.png', 'assets/obj/hand.png'], [('raw/obj/%s.png' % o, d + ', ' + PROP) for o, d in BODY.items()]))
    acts = [('raw/obj/%s.png' % o, d + ', ' + PROP) for o, d in ACT.items()]
    for j, ch in chunks(acts, 3):
        out.append(('w4_act_%d' % j, ACT_HEADER, ['raw/refs/person.png', 'assets/obj/look.png'], ch))
    newp = [('raw/obj/%s.png' % o, d + ', ' + PROP) for o, d in NEWP.items()]
    for j, ch in chunks(newp, 2):
        out.append(('w4_people_%d' % j, NEWP_HEADER, ['raw/refs/person.png'], ch))
    for bid, ref, note, items in REFOBJ:
        hdr = HEADER.replace('NEVER draw the reference characters, and never draw people or characters unless the prompt explicitly asks for one.', note + ' Draw no people or characters.')
        out.append((bid, hdr, [ref], [('raw/obj/%s.png' % o, d + ', ' + PROP) for o, d in items]))
    out.append(('w4_props', HEADER, R('peppa', 'wukong'), [('raw/props/%s.png' % o, d + ', ' + PROP) for o, d in PROPS.items()]))
    return out


def main(redo):
    os.makedirs(BD, exist_ok=True)
    allb = batches()
    if redo:
        # a picture rejected by eye: one batch per picture, same header / references / (updated) prompt -> index_w4redo.tsv
        # (delete the raw file first: run_batches.sh skips targets that exist)
        lines = []
        for bid, hdr, refs, items in allb:
            for t, p in items:
                if os.path.basename(t)[:-4] in redo:
                    lines.append(write_custom('w4_redo_' + os.path.basename(t)[:-4], hdr, refs, [(t, p)]))
        open(os.path.join(BD, 'index_w4redo.tsv'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
        print(len(lines), 'redo batches')
        return
    lines = [write_custom(bid, hdr, refs, items) for bid, hdr, refs, items in allb]
    open(os.path.join(BD, 'index_w4.tsv'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    print(len(lines), 'batches', sum(len(b[3]) for b in allb), 'images')


if __name__ == '__main__':
    main(set(sys.argv[1][7:].split(',')) if len(sys.argv) > 1 and sys.argv[1].startswith('--redo=') else set())
