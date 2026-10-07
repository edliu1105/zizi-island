# -*- coding: utf-8 -*-
"""Every picture of 字字岛 as Codex ImageGen batches (3 images each): the 56 game backgrounds (one per mini-game), the two
sea maps, 18 islands, the finale scenes, ~107 objects (one per character / word), the game props and the new characters.
Same pipeline as 点点岛 (tools/run_batches.sh): squares 1024x1024, things on pure white (cut out by tools/process_art.py).
usage: python tools/art_batches.py [group...]   ->  batches/<id>.md + batches/index_<group>.tsv"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import W1, W2, OBJ, all_objects

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BD = os.path.join(ROOT, 'batches')

HEADER = """You are an asset-generation worker for a picture-book app that teaches a 4-year-old to read and write (a private family app).
Use the built-in image_gen tool (imagegen skill, default built-in mode). For EACH image below make ONE separate image_gen call (never use n>1), square 1024x1024.
After each generation, copy the generated PNG from $CODEX_HOME/generated_images/... to the exact target path in this workspace (create the folder if needed; overwrite if it exists).
Do not modify any other files, do not write code, do not create extra images.

The attached images are STYLE REFERENCES ONLY (character stickers of the same app). Match their line weight, bold dark outline, soft cel shading, saturation and overall chibi picture-book look, so the new picture looks drawn by the same artist.
NEVER draw the reference characters, and never draw people or characters unless the prompt explicitly asks for one.
NEVER put any text, letters, numbers, Chinese characters or signs with writing in the picture.
"""
FOOTER = "\nWhen all images are saved, print exactly one line per image: SAVED <target path>\n"
PROP = ("cute chibi 2D cartoon sticker illustration for a toddler learning app, bold clean uniform dark outlines, flat vibrant saturated colors "
        "with soft cel shading, rounded child-safe shapes, high-quality children picture-book style, the object fills about 85% of the frame and is "
        "centered with a small even margin, SOLID PURE WHITE background (#FFFFFF), no ground shadow, no gradient background, no text, no letters, no watermark, no border, no frame")
BG = ("bright cheerful 2D cartoon background illustration for a toddler learning app, flat vibrant saturated colors with soft cel shading, clean simple "
      "shapes, children picture-book style, wide open uncluttered composition with plenty of calm empty space in the middle so that cards and characters "
      "can be placed on top later, full-bleed OPAQUE painting up to all four edges, no vignette, no border, no text, no letters, no signs with writing, "
      "NO characters, NO people, NO animals")
ISL = ("a small round cartoon island in a calm turquoise sea seen from a slightly high angle, a sandy beach rim, cute chibi 2D cartoon style, bold dark "
       "outline, flat vibrant colors with soft cel shading, the island fills about 80% of the frame, SOLID PURE WHITE background (#FFFFFF) around the "
       "island and its little patch of sea, no text, no people, no characters: ")
CHAR = ("as a cute chibi toddler-show character, full body standing, big head small body, cute chibi 2D cartoon sticker illustration, bold clean "
        "uniform dark outlines, flat vibrant colors with soft cel shading, the whole character fills about 85% of the frame, centered, SOLID PURE WHITE "
        "background (#FFFFFF), no ground shadow, no text, no letters, no watermark, no border")

REFS = {'peppa': 'peppa', 'bluey': 'bluey', 'huluwa': 'gourd4', 'paw': 'chase', 'xiyou': 'wukong', 'ultra': 'ironman', 'robot': 'ironman'}

# ---------------------------------------------------------------- the 56 game backgrounds: find / write / abc / quiz
PEP = 'simple flat shapes like a preschool TV cartoon, '
BGS = {
    'peppa': ['a country lane at the foot of a round green hill after rain, a small yellow house with a red roof on top of the hill far behind, light blue sky, the whole lower half is a plain flat green lawn with nothing on it, ' + PEP,
              'a cosy playroom with pastel pink walls, a sunny window, a small toy shelf at the far left, a plain light wooden floor, ' + PEP,
              'a sunny back garden on a round green hill, a washing line between two short posts at the far right, soft clouds, plain flat lawn, ' + PEP,
              'a cosy children bedroom with two small beds at the far sides, a round pale rug on the floor, a window with blue sky, ' + PEP],
    'bluey': ['a sunny Australian backyard: a blue timber house with a veranda at the far left, a tall gum tree at the far right, a wide open blue sky in the whole upper half, plain green lawn at the bottom',
              'the veranda of a blue timber house in warm afternoon light, potted plants at the sides, a plain wooden deck floor',
              'a shady corner of a backyard under a gum tree, a hammock at the far side, dappled sunlight, plain green lawn',
              'a bright family living room with a big comfy couch far at the back and colourful cushions, a plain soft rug'],
    'huluwa': ['a mountain slope in China with a thick green gourd vine winding across the top edge with leaves only (no gourds), misty green mountains far behind, plain flat earth ground in the lower half',
               'a simple Chinese country cottage yard with a low wooden fence and a stone path, misty green mountains far behind, plain flat ground',
               'a quiet bamboo grove beside a small clear stream, soft sunlight, plain flat grass',
               'inside a friendly bright mountain cave with soft glowing blue crystals at the far sides, a sunny cave opening at the back, plain smooth stone floor'],
    'paw': ['a farm field: rich brown ploughed soil in the whole lower half with nothing growing, a red barn and a windmill far behind, sunny blue sky',
            'inside a bright farm barn: hay bales at the sides, a big open door at the back showing green fields, a plain wooden floor',
            'a sunny bay: a tall lookout tower on a green hill far behind, calm blue sea at the right, plain flat lawn in front',
            'a sunny farm yard with a wooden fence, a green tractor at the far side, plain flat dirt yard'],
    'xiyou': ['the Flower Fruit Mountain of the Monkey King: lush green mountain with a waterfall far behind, peach trees at the far sides, a gentle grassy slope, plain flat grass in the lower half',
              'the Water Curtain Cave: a waterfall like a curtain in front of a cave, mossy rocks and green vines at the sides, plain flat stone ground',
              'a peaceful Chinese mountain path with a small pavilion far behind, pine trees, soft clouds, plain flat ground',
              'an ancient Chinese temple courtyard: red pillars and curved golden roofs far behind, a bronze incense burner at the far side, plain stone floor'],
    'ultra': ['a futuristic shining city of light in outer space: tall glowing crystal towers far behind, a blue and purple sky with stars, a wide plain flat silver plaza in the lower half',
              'a training ground for giant heroes at sunset: rocky hills far behind, a few boulders at the far sides, plain flat sandy ground',
              'a seaside city park in daytime: tall buildings small and far behind, blue sea, plain flat grassy ground',
              'a space base control room: big round windows showing stars and a blue planet, glowing panels at the sides, plain smooth floor'],
    'robot': ['a wide empty parking lot in front of a futuristic robot base: white painted parking lines on grey ground in the lower half, blue sky, a big hangar far behind',
              'inside a high-tech robot repair workshop: big tools, cables and screens at the sides, warm lights, plain smooth floor',
              'a desert road through red rock canyons far behind, blue sky, plain flat sandy ground',
              'a city street at night with colourful neon-lit shop fronts far behind (no writing), plain flat road'],
    'peppa2': ['a bright playgroup classroom: small tables and chairs pushed to the sides, colourful paintings on the wall (no writing), a plain floor, ' + PEP,
               'a playgroup classroom with a big empty green chalkboard on the back wall, a plain floor, ' + PEP,
               'a school playground with a small slide at the far side and a tree, plain soft ground, ' + PEP,
               'a cosy reading corner with low bookshelves at the sides (book spines without writing), a soft rug, plain floor, ' + PEP],
    'bluey2': ['a child bedroom: a bunk bed at the far left, a toy box at the far right, a window with curtains at the back, a plain soft carpet in the middle',
               'a cosy reading nook with a window seat and big cushions, warm lamp light, plain floor',
               'a bright family bathroom with a bathtub at the far side, light blue tiles, a plain floor',
               'a family kitchen with a breakfast table far at the back, a fruit bowl, plain floor'],
    'pj': ['a calm night sky over a quiet little town: deep blue sky with a big round moon at the upper right, very few small stars, dark rooftops along the bottom edge',
           'a cosy night garden under a big moon: fireflies, flowers at the sides, a plain dark-green lawn',
           'inside a superhero headquarters at night: round deep-blue walls, soft glowing panels, a big round window with the moon, plain floor',
           'a night rooftop with a small telescope at the far side, the moon and a few stars, plain flat rooftop'],
    'ultra2': ['a high-tech fusion laboratory: tall glowing capsules at the far sides, blue light strips, a plain smooth floor',
               'a launch pad at sunset with a big rocket far behind, plain flat ground',
               'a peaceful green alien planet with two moons in a pink sky, smooth hills, plain flat ground',
               'a crystal chamber with floating soft light orbs, pale crystal walls at the sides, a plain floor'],
    'huluwa2': ['a flower garden: a stone path and a low bamboo fence, empty flower beds of brown soil along the bottom (no flowers yet), sunny sky',
                'a pavilion in a Chinese garden by a lotus pond, willow branches at the sides, a plain stone floor',
                'a green bamboo forest with soft beams of light, a plain flat ground',
                'a Chinese garden with a round moon gate in a white wall far behind, plum blossoms, a plain stone floor'],
    'xiyou2': ['high in heaven above the clouds: a golden palace small and far behind, a wide open bright sky, a soft sea of clouds along the bottom',
               'a jade palace hall: red pillars at the sides, golden light, a plain pale jade floor',
               'the heavenly peach garden: pink blossom trees at the sides, golden railings, a plain soft cloud floor',
               'the moon palace: a huge pale moon behind a small silver palace, osmanthus tree at the side, a plain silver floor'],
    'robot2': ['a futuristic energy station: glowing cyan pipes and tanks at the far sides, a plain metal floor',
               'a robot cafeteria with tall metal tables at the far sides, warm lights, plain floor',
               'a highway on a long bridge at sunset, mountains far behind, a plain road',
               'a race track with empty grandstands far behind, chequered flags (no writing), plain asphalt'],
}
GAMES = ['find', 'write', 'abc', 'quiz']

# ---------------------------------------------------------------- the maps, islands, finales
MAPS = [('map_w1', 'a huge calm turquoise sea seen from high above in the bright morning: gentle sparkling waves, a soft golden sunrise glow from the top left corner, a few tiny white sailboats far away, the middle is open water, no islands, no land, no buildings'),
        ('map_w2', 'a huge calm sea at night seen from high above: deep blue water with sparkling star reflections, a big pale moon reflection, gentle glowing waves, a few tiny lantern boats far away, no islands, no land, no buildings')]
ISLANDS = {
    'peppa': 'a little yellow house with a red roof on a round green hill, a muddy puddle beside it, a washing line',
    'bluey': 'a blue timber house on stilts with a veranda, a tall gum tree, a small green lawn',
    'huluwa': 'a tall green mountain peak with a big curly gourd vine carrying seven small gourds in rainbow colours, a tiny stone pavilion',
    'paw': 'a red barn, a windmill and a small green vegetable field',
    'xiyou': 'the Flower Fruit Mountain with a small waterfall, peach trees with pink peaches, a cave',
    'ultra': 'a shining tall crystal tower of light with a glowing blue top, silver futuristic houses',
    'robot': 'a futuristic robot base with a big garage door, a landing pad and a radio dish',
    'peppa2': 'a small school house with a bell tower, a little playground with a slide',
    'bluey2': 'a cosy family house with a warmly lit window, a garden with a trampoline',
    'pj': 'a round blue headquarters tower with a big moon window, glowing at dusk',
    'ultra2': 'a white domed laboratory with glowing blue capsules and a small rocket',
    'huluwa2': 'a flower garden full of colourful flowers, a red Chinese pavilion and a small pond',
    'xiyou2': 'a red and gold heavenly palace with curved golden roofs standing on soft clouds',
    'robot2': 'a futuristic energy station with tall glowing cyan towers and pipes',
    'gate1': 'a round golden stone ring magic gate with swirling purple and blue light inside, standing on a small round rocky island',
    'gate2': 'a round silver stone ring magic gate with swirling blue and white starlight inside, standing on a small round rocky island',
    'fest1': 'a festival stage with colourful bunting, paper lanterns and balloons, a small red carpet',
    'fest2': 'a starlight stage with a glowing arch of stars, lanterns and a small fireworks launcher',
}
FINALES = [('finale_w1', 'a festive beach party at golden sunset: a big stage with colourful bunting, lanterns and balloons far at the back, fireworks in the sky, a wide plain flat sandy stage area in the whole lower half'),
           ('finale_w2', 'a starlight festival at night: a glowing arch of stars far at the back, colourful fireworks, paper lanterns on strings, a wide plain flat stage in the whole lower half')]

# ---------------------------------------------------------------- new characters (style refs: the client's stickers)
CHARS = [('zero', 'Ultraman Zero (the young Ultra hero: blue and red armoured body with silver lines, two silver blade crests on the head, big yellow-white glowing eyes, a blue color timer on the chest) ' + CHAR + ', a brave pose with one fist up'),
         ('kaiju1', 'a small cute friendly green baby monster with little round horns, a round belly and tiny wings, smiling, holding up both hands (an original design, not any known monster), ' + CHAR),
         ('kaiju2', 'a small cute friendly purple baby dinosaur-like monster with spikes on its back and big eyes, smiling, holding up both hands (an original design, not any known monster), ' + CHAR)]

# ---------------------------------------------------------------- game props
PROPS = {
    'puddle': 'a flat muddy brown puddle seen from slightly above, an oval with a lighter rim',
    'balloon': 'one shiny red party balloon with a short curly white string',
    'gourd': 'one green bottle gourd with a little stem and one leaf',
    'mound': 'a small round mound of brown soil with a tiny green sprout on top',
    'bush': 'a big round leafy green bush',
    'parkcar': 'a small toy-like yellow car seen from the front-side, friendly headlight eyes, no writing',
    'card': 'an empty rectangular playing card back with a pink and white pattern of little hearts, rounded corners',
    'block': 'one empty wooden toy block seen from the front, a plain cream square face with a coloured border',
    'badge': 'an empty round golden badge with a blue rim and a little bone shape at the top',
    'stone_tablet': 'an empty flat grey stone tablet with a rounded top, smooth face',
    'scroll': 'an open blank paper scroll with wooden rollers, cream paper with nothing written',
    'satchel': 'an open red school backpack seen from the front with the top flap open',
    'pillow': 'a fluffy blue pillow',
    'toybox': 'a small wooden toy box with the lid closed',
    'flowerpot': 'an empty terracotta flower pot full of dark soil, nothing growing',
    'can': 'a green watering can',
    'jindou': 'a golden swirly magic cloud (the somersault cloud of the Monkey King)',
    'cube': 'a glowing cyan energy cube with light edges',
    'tile': 'one empty wooden letter tile, cream square face, no letter',
    'brush': 'a Chinese writing brush with a bamboo handle and a black tip',
    'pencil': 'a yellow pencil with a pink eraser',
    'chest': 'a small treasure chest, wooden with golden trim, the lid open with golden light coming out',
    'book_icon': 'a big friendly red story book with golden corners, closed, a golden star on the cover',
    'lantern': 'a red Chinese paper lantern with a golden tassel',
    'rocket': 'a cute small red and white toy rocket',
}
ICON = ('app_icon', 'a cheerful app icon: a small round green island in a turquoise sea with a giant red Chinese writing brush and a big yellow pencil crossed over it, golden sparkles, bright sky, full-bleed square artwork, no text, no letters')


def write_batch(bid, refs, items):
    body = [HEADER]
    targets = []
    for k, (target, prompt) in enumerate(items, 1):
        targets.append(target)
        body.append('Image %d\nTarget path: %s\nPrompt: %s\n' % (k, target, prompt))
    body.append(FOOTER)
    with open(os.path.join(BD, bid + '.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(body))
    return '%s\t%s\t%s' % (bid, ','.join('raw/refs/%s.png' % r for r in refs), ','.join(targets))


def chunks(lst, n):
    for i in range(0, len(lst), n):
        yield i // n, lst[i:i + n]


def groups():
    out = {}
    # backgrounds per island (4 each -> 2 batches of 2: they are big paintings)
    lines = []
    for isl in W1 + W2:
        iid = isl['id']; base = iid.rstrip('2') if iid not in ('pj',) else 'paw'
        ref = REFS.get(iid.rstrip('2'), 'peppa')
        items = [('raw/bg/%s_%s.png' % (iid, g), BGS[iid][k] + ', ' + BG) for k, g in enumerate(GAMES)]
        for j, ch in chunks(items, 2):
            lines.append(write_batch('bg_%s_%d' % (iid, j), [ref, 'peppa'], ch))
    out['bg'] = lines
    # maps, islands, finales, icon
    items = [('raw/bg/%s.png' % m, p + ', ' + BG.replace('NO characters, NO people, NO animals', 'no islands, no people')) for m, p in MAPS]
    items += [('raw/bg/%s.png' % m, p + ', ' + BG) for m, p in FINALES]
    items += [('raw/islands/%s.png' % i, ISL + p) for i, p in ISLANDS.items()]
    items += [('raw/icon/%s.png' % ICON[0], ICON[1])]
    out['world'] = [write_batch('world_%02d' % j, ['peppa', 'wukong'], ch) for j, ch in chunks(items, 3)]
    # objects
    objs = all_objects()
    items = [('raw/obj/%s.png' % o, OBJ[o] + ', ' + PROP) for o in objs]
    out['obj'] = [write_batch('obj_%02d' % j, ['peppa', 'chase'], ch) for j, ch in chunks(items, 3)]
    # props + characters
    items = [('raw/props/%s.png' % p, d + ', ' + PROP) for p, d in PROPS.items()]
    out['props'] = [write_batch('props_%02d' % j, ['peppa', 'wukong'], ch) for j, ch in chunks(items, 3)]
    items = [('raw/chars/%s.png' % c, d) for c, d in CHARS]
    out['chars'] = [write_batch('chars_%02d' % j, ['peppa', 'ironman'], ch) for j, ch in chunks(items, 3)]
    return out


if __name__ == '__main__':
    os.makedirs(BD, exist_ok=True)
    want = sys.argv[1:]
    g = groups()
    allines = []
    for name, lines in g.items():
        if want and name not in want:
            continue
        with open(os.path.join(BD, 'index_%s.tsv' % name), 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')
        allines += lines
        print(name, len(lines), 'batches')
    with open(os.path.join(BD, 'index_all.tsv'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(allines) + '\n')
    print('all', len(allines))
