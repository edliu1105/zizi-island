# -*- coding: utf-8 -*-
"""字字岛 content - the one source of truth for the islands, their characters / letters / words, the voice lines that
belong to them and the object pictures to generate. Used by tools/build_data.py (assets/js/data.js), tools/art_batches.py
and tools/voice_lines.py.  See docs/DESIGN.md §2."""

# ---------------------------------------------------------------- the islands
# chars: (character, the line that names it (<= 8 chars), object id, english word for it)
# letters: (letter, key word, object id)
W1 = [
    dict(id='peppa', name='佩奇的家', host='peppa', crew=['peppa', 'george', 'mummy_pig', 'daddy_pig'], color='#FF8DB3', color2='#9A6433', hi='佩奇来啦！',
         chars=[('人', '人，大人的人！', 'person', 'person'), ('口', '口，开口的口！', 'mouth', 'mouth'), ('目', '目，眼睛就是目！', 'eye', 'eye'), ('手', '手，小手的手！', 'hand', 'hand')],
         letters=[('A', 'apple', 'apple'), ('B', 'ball', 'ball'), ('C', 'cat', 'cat'), ('D', 'dog', 'dog')]),
    dict(id='bluey', name='Bluey 的后院', host='bluey', crew=['bluey', 'bingo', 'bandit', 'chilli'], color='#6BB9F2', color2='#F59A4A', hi='一起玩吧！',
         chars=[('日', '日，太阳就是日！', 'sun', 'sun'), ('月', '月，月亮的月！', 'moon', 'moon'), ('云', '云，白云的云！', 'cloud', 'cloud'), ('木', '木，树木的木！', 'tree', 'tree')],
         letters=[('E', 'egg', 'egg'), ('F', 'fish', 'fish'), ('G', 'grapes', 'grapes'), ('H', 'hat', 'hat')]),
    dict(id='huluwa', name='葫芦山', host='gourd1', crew=['gourd1', 'gourd4', 'gourd5', 'grandpa'], color='#46C27A', color2='#E0473A', hi='葫芦娃来啦！',
         chars=[('山', '山，高山的山！', 'mountain', 'mountain'), ('水', '水，喝水的水！', 'water', 'water'), ('火', '火，火苗的火！', 'fire', 'fire'), ('石', '石，石头的石！', 'stone', 'stone')],
         letters=[('I', 'ice cream', 'icecream'), ('J', 'juice', 'juice'), ('K', 'kite', 'kite'), ('L', 'lion', 'lion')]),
    dict(id='paw', name='冒险湾农场', host='ryder', crew=['ryder', 'chase', 'marshall', 'rubble'], color='#E8554A', color2='#2E6FD8', hi='汪汪队，出发！',
         chars=[('田', '田，田地的田！', 'field', 'field'), ('禾', '禾，禾苗的禾！', 'riceplant', 'rice plant'), ('米', '米，大米的米！', 'rice', 'rice'), ('瓜', '瓜，西瓜的瓜！', 'melon', 'melon')],
         letters=[('M', 'moon', 'moon'), ('N', 'nose', 'nose'), ('O', 'orange', 'orange'), ('P', 'pig', 'pig')]),
    dict(id='xiyou', name='花果山', host='wukong', crew=['wukong', 'bajie', 'shaseng', 'tangseng'], color='#F5B324', color2='#D63B2F', hi='俺老孙来也！',
         chars=[('牛', '牛，小牛的牛！', 'cow', 'cow'), ('羊', '羊，小羊的羊！', 'sheep', 'sheep'), ('马', '马，小马的马！', 'horse', 'horse'), ('鸟', '鸟，小鸟的鸟！', 'bird', 'bird')],
         letters=[('Q', 'queen', 'queen'), ('R', 'rabbit', 'rabbit'), ('S', 'sun', 'sun'), ('T', 'tree', 'tree')]),
    dict(id='ultra', name='光之国', host='ultraman', crew=['ultraman'], color='#E23B3B', color2='#9AA7B8', hi='奥特曼来啦！',
         chars=[('大', '大，大小的大！', 'big', 'big'), ('小', '小，大小的小！', 'small', 'small'), ('上', '上，上面的上！', 'up', 'up'), ('下', '下，下面的下！', 'down', 'down')],
         letters=[('U', 'umbrella', 'umbrella'), ('V', 'van', 'van'), ('W', 'watch', 'watch')]),
    dict(id='robot', name='汽车人基地', host='optimus', crew=['optimus', 'bumblebee'], color='#2E6FD8', color2='#E8413A', hi='汽车人，出发！',
         chars=[('车', '车，汽车的车！', 'car', 'car'), ('门', '门，大门的门！', 'door', 'door'), ('灯', '灯，电灯的灯！', 'lamp', 'lamp'), ('伞', '伞，雨伞的伞！', 'umbrella', 'umbrella')],
         letters=[('X', 'xylophone', 'xylophone'), ('Y', 'yo-yo', 'yoyo'), ('Z', 'zebra', 'zebra')]),
]
W2 = [
    # the two sentence islands (v2): the function words come from sentences ("字从句里来"), no object pictures
    dict(id='s1', name='钢铁侠大厦', host='ironman', crew=['ironman', 'spiderman', 'hulk', 'thor'], color='#D63B2F', color2='#F5B324', hi='复仇者集合！', base=2, fw=True,
         chars=[('我', '我，我们的我！', None, 'I'), ('你', '你，你好的你！', None, 'you'), ('他', '他，他们的他！', None, 'he'), ('是', '是，就是的是！', None, 'is'), ('的', '的，我的的！', None, '')],
         letters=[]),
    dict(id='s2', name='美国队长岛', host='captain', crew=['captain', 'miles', 'panther', 'widow'], color='#2E6FD8', color2='#E8413A', hi='美国队长来啦！', base=2, fw=True,
         chars=[('了', '了，好了的了！', None, ''), ('不', '不，不要的不！', None, 'no'), ('有', '有，没有的有！', None, 'have'), ('在', '在，现在的在！', None, 'at'), ('这', '这，这个的这！', None, 'this')],
         letters=[]),
    dict(id='peppa2', base=2, name='小学堂', host='peppa', crew=['peppa', 'george'], color='#FF8DB3', color2='#5CC46E', hi='去学堂啦！',
         chars=[('书', '书，看书的书！', 'book', 'book'), ('本', '本，本子的本！', 'notebook', 'notebook'), ('尺', '尺，尺子的尺！', 'ruler', 'ruler'), ('包', '包，书包的包！', 'schoolbag', 'bag')],
         letters=[('a', 'ant', 'ant'), ('b', 'bus', 'bus'), ('c', 'cup', 'cup'), ('d', 'duck', 'duck')]),
    dict(id='bluey2', base=2, name='卧室', host='bluey', crew=['bluey', 'bingo'], color='#6BB9F2', color2='#FFC93C', hi='到我家来玩！',
         chars=[('床', '床，小床的床！', 'bed', 'bed'), ('衣', '衣，衣服的衣！', 'shirt', 'clothes'), ('巾', '巾，毛巾的巾！', 'towel', 'towel'), ('杯', '杯，杯子的杯！', 'cup', 'cup')],
         letters=[('e', 'elephant', 'elephant'), ('f', 'frog', 'frog'), ('g', 'glove', 'glove'), ('h', 'house', 'house')]),
    dict(id='pj', base=2, name='夜空', host='catboy', crew=['catboy', 'owlette', 'gekko'], color='#3A5CC0', color2='#5CC46E', hi='睡衣小英雄！',
         chars=[('风', '风，大风的风！', 'wind', 'wind'), ('雨', '雨，下雨的雨！', 'rain', 'rain'), ('电', '电，闪电的电！', 'lightning', 'lightning'), ('光', '光，阳光的光！', 'light', 'light')],
         letters=[('i', 'insect', 'insect'), ('j', 'jacket', 'jacket'), ('k', 'key', 'key'), ('l', 'leaf', 'leaf')]),
    dict(id='ultra2', base=3, name='合体基地', host='zero', crew=['zero'], color='#2E6FD8', color2='#E23B3B', hi='合体出发！',
         chars=[('从', '从，跟从的从！', 'follow', 'follow'), ('休', '休，休息的休！', 'rest', 'rest'), ('林', '林，树林的林！', 'woods', 'woods'), ('明', '明，明亮的明！', 'bright', 'bright')],
         letters=[('m', 'milk', 'milk'), ('n', 'nut', 'nut'), ('o', 'owl', 'owl'), ('p', 'pen', 'pen')]),
    dict(id='huluwa2', base=3, name='百花园', host='gourd7', crew=['gourd7', 'gourd2', 'gourd3'], color='#46C27A', color2='#FF7FA8', hi='花儿开啦！',
         chars=[('花', '花，花朵的花！', 'flower', 'flower'), ('叶', '叶，树叶的叶！', 'leaf', 'leaf'), ('果', '果，水果的果！', 'fruit', 'fruit'), ('竹', '竹，竹子的竹！', 'bamboo', 'bamboo')],
         letters=[('q', 'quilt', 'quilt'), ('r', 'ring', 'ring'), ('s', 'star', 'star'), ('t', 'tent', 'tent')]),
]
# world 3 (彩虹海): it opens with world 2's last two islands; its other islands come in phase 2 (docs/PLAN-v2.md)
W3 = [
    dict(id='xiyou2', base=3, name='天宫', host='wukong', crew=['wukong', 'dragon_horse'], color='#F5B324', color2='#8E6CFF', hi='上天宫喽！',
         chars=[('龙', '龙，小龙的龙！', 'dragon', 'dragon'), ('兔', '兔，兔子的兔！', 'rabbit', 'rabbit'), ('狗', '狗，小狗的狗！', 'dog', 'dog'), ('鸡', '鸡，小鸡的鸡！', 'chicken', 'chicken')],
         letters=[('u', 'unicorn', 'unicorn'), ('v', 'vase', 'vase'), ('w', 'window', 'window')]),
    dict(id='robot2', base=3, name='能量站', host='bumblebee', crew=['bumblebee', 'optimus'], color='#FFC93C', color2='#2B2118', hi='补充能量！',
         chars=[('饭', '饭，吃饭的饭！', 'ricebowl', 'rice'), ('汤', '汤，喝汤的汤！', 'soup', 'soup'), ('肉', '肉，吃肉的肉！', 'meat', 'meat'), ('勺', '勺，勺子的勺！', 'spoon', 'spoon')],
         letters=[('x', 'fox', 'fox'), ('y', 'yogurt', 'yogurt'), ('z', 'zip', 'zip')]),
    # phase 2 (docs/PLAN-v2.md A.2: numbers, colours, family, actions - what lets the child read real sentences). From W3 on an
    # island writes 2 of its characters (+ one old friend); the other three are read (NOWRITE3, src/w3.js). The English slot is
    # words now (all 52 letters are done). Numbers: N apples (tools/compose_numbers.py); family: the client's own pictures
    # ('@' = assets/chars, used as they are); colours and actions: generated (tools/w3_batches.py).
    dict(id='hulk3', base=2, name='绿巨人山谷', host='hulk', crew=['hulk', 'ironman', 'spiderman'], color='#5CB85C', color2='#7B4FA0', hi='绿巨人来啦！',
         chars=[('一', '一，一个的一！', 'num1', 'one'), ('二', '二，一二的二！', 'num2', 'two'), ('三', '三，三个的三！', 'num3', 'three'), ('四', '四，四个的四！', 'num4', 'four'), ('五', '五，五个的五！', 'num5', 'five')],
         letters=[]),
    dict(id='thor3', base=2, name='雷神云岛', host='thor', crew=['thor', 'captain', 'miles'], color='#3A6FD0', color2='#D63B2F', hi='雷神来啦！',
         chars=[('六', '六，六个的六！', 'num6', 'six'), ('七', '七，七个的七！', 'num7', 'seven'), ('八', '八，八个的八！', 'num8', 'eight'), ('九', '九，九个的九！', 'num9', 'nine'), ('十', '十，十个的十！', 'num10', 'ten')],
         letters=[]),
    dict(id='panther3', base=2, name='黑豹丛林', host='panther', crew=['panther', 'miles', 'zero'], color='#6A4FB5', color2='#2B2118', hi='黑豹来啦！',
         chars=[('红', '红，红色的红！', 'strawberry', 'red'), ('黄', '黄，黄色的黄！', 'banana', 'yellow'), ('蓝', '蓝，蓝色的蓝！', 'whale', 'blue'), ('绿', '绿，绿色的绿！', 'dino', 'green'), ('白', '白，白色的白！', 'polarbear', 'white')],
         letters=[]),
    dict(id='widow3', base=2, name='特工基地', host='widow', crew=['widow', 'daddy_pig', 'mummy_pig', 'peppa', 'george'], color='#C8323C', color2='#2B2118', hi='特工出发！',
         chars=[('爸', '爸，爸爸的爸！', '@daddy_pig', 'daddy'), ('妈', '妈，妈妈的妈！', '@mummy_pig', 'mummy'), ('哥', '哥，哥哥的哥！', '@gourd1', 'big brother'), ('姐', '姐，姐姐的姐！', '@peppa', 'big sister'), ('弟', '弟，弟弟的弟！', '@george', 'little brother')],
         letters=[]),
    dict(id='hawk3', base=2, name='鹰眼射箭场', host='hawkeye', crew=['hawkeye', 'bluey', 'bingo'], color='#8E6CFF', color2='#2B2118', hi='鹰眼来啦！',
         chars=[('吃', '吃，吃饭的吃！', 'eat', 'eat'), ('喝', '喝，喝水的喝！', 'drink', 'drink'), ('看', '看，看书的看！', 'look', 'look'), ('走', '走，走路的走！', 'walk', 'walk'), ('来', '来，过来的来！', 'come', 'come')],
         letters=[]),
]
# the characters of phase 2 that are read, not written (W3 writes 2 an island; A.4)
NOWRITE3 = '三四五六七九黄蓝绿爸哥姐吃喝看'
WORLDS = [('w1', '晨光海', W1), ('w2', '星光海', W2), ('w3', '彩虹海', W3)]

# three-letter words to spell / read in world 2 (objects that have a picture)
# (only consonant-vowel-consonant words: egg, ant and owl left the list - docs/PLAN-v2.md A.5)
CVC = [('cat', 'cat'), ('dog', 'dog'), ('sun', 'sun'), ('bus', 'bus'), ('cup', 'cup'), ('pen', 'pen'), ('bed', 'bed'), ('hat', 'hat'),
       ('box', 'box'), ('pig', 'pig'), ('fox', 'fox'), ('bag', 'schoolbag'), ('nut', 'nut')]
# the English words of world 3's islands: every one a CVC word with a picture and a recording. 'clear': a 4-year-old names the
# picture with this very word (used where the child must name it silently: I spy, reading); the others are always said aloud
WORDS3 = [('cat', 'cat', 1), ('dog', 'dog', 1), ('sun', 'sun', 1), ('bus', 'bus', 1), ('cup', 'cup', 1), ('pen', 'pen', 1), ('bed', 'bed', 1),
          ('hat', 'hat', 1), ('box', 'box', 1), ('pig', 'pig', 1), ('fox', 'fox', 1), ('van', 'van', 1), ('bat', 'bat', 1), ('fan', 'fan', 1),
          ('pan', 'pan', 1), ('map', 'map', 1), ('mop', 'mop', 1), ('web', 'web', 1), ('jam', 'jam', 1), ('log', 'log', 1),
          ('bag', 'schoolbag', 0), ('nut', 'nut', 0), ('zip', 'zip', 0), ('top', 'top', 0)]

# two-character words for the night island's challenge (first, second, picture)
WORDS2 = [('火', '车', 'train'), ('雨', '伞', 'umbrella'), ('电', '灯', 'lamp'), ('月', '光', 'moonlight'), ('大', '门', 'door'), ('风', '车', 'pinwheel'),
          ('木', '马', 'rockinghorse'), ('大', '米', 'rice'), ('小', '鸟', 'bird'), ('大', '山', 'mountain'), ('火', '山', 'volcano'), ('雨', '衣', 'raincoat')]

# ---------------------------------------------------------------- sentences (v2, docs/PLAN-v2.md A.3): the function words
# come from sentences. A scene = things placed on a card: (object, centre x, centre y, size), fractions of the card.
def alone(o, k=.7): return [(o, .5, .55, k)]
def big(o): return [(o, .5, .55, .86)]
def small(o): return [(o, .5, .64, .34)]
def on(x, y): return [(y, .5, .66, .6), (x, .5, .24, .3)]
def under(x, y): return [(y, .5, .4, .6), (x, .5, .84, .28)]
def withp(o): return [('person', .3, .55, .68), (o, .72, .68, .42)]
def pair(a, b, ka=.5, kb=.5): return [(a, .28, .58, ka), (b, .72, .6, kb)]
def tint(spec, f): return [t[:4] + (f,) for t in spec]          # a 5th field: a CSS filter (a red bird for a distractor ...)
def many(o, n, k=None):
    """n of one thing in neat rows (up to 5 a row), filling the card - an exact count to read a number from"""
    rows = [min(5, n - 5 * r) for r in range((n + 4) // 5)] if n > 5 else ([n] if n <= 3 else [2, 2] if n == 4 else [3, 2])
    k = k or min(.3, .84 / max(rows), .8 / len(rows) / 1.05)
    return [(o, round(.5 + (i - (c - 1) / 2) * k * 1.08, 3), round(.55 + (r - (len(rows) - 1) / 2) * k * 1.12, 3), round(k, 3)) for r, c in enumerate(rows) for i in range(c)]
def withn(o, n): return many(o, n) if n > 5 else [('person', .2, .56, .6)] + [(x, round(.36 + .64 * xx, 3), y, round(kk * .64, 3)) for x, xx, y, kk in many(o, n)]
def who(c, o=None, ko=.38): return [('@' + c, .3 if o else .5, .58, .7 if o else .8)] + ([(o, .74, .64, ko)] if o else [])

# 补句子: the host says the whole sentence; the card shows it with the function word missing (may hold characters not
# taught yet - it is heard). Three sentences for every function word.
FW_SENTS = {
    '我': [('我的车。', withp('car')), ('我有伞。', withp('umbrella')), ('我在山上。', on('person', 'mountain'))],
    '你': [('你的伞。', withp('umbrella')), ('你有马。', withp('horse')), ('你在门口。', pair('person', 'door', .62, .62))],
    '他': [('他的马。', withp('horse')), ('他的牛。', withp('cow')), ('他在木下。', under('person', 'tree'))],
    '是': [('这是月。', alone('moon')), ('马是大的。', big('horse')), ('牛是小的。', small('cow'))],
    '的': [('我的车。', withp('car')), ('你的伞。', withp('umbrella')), ('他的牛。', withp('cow'))],
    '了': [('火大了。', big('fire')), ('羊大了。', big('sheep')), ('月上山了。', on('moon', 'mountain'))],
    '不': [('羊不大。', small('sheep')), ('鸟不在木上。', under('bird', 'tree')), ('这不是马。', alone('cow'))],
    '有': [('山上有羊。', on('sheep', 'mountain')), ('我有伞。', withp('umbrella')), ('木上有鸟。', on('bird', 'tree'))],
    '在': [('鸟在木上。', on('bird', 'tree')), ('羊在山上。', on('sheep', 'mountain')), ('我在山上。', on('person', 'mountain'))],
    '这': [('这是月。', alone('moon')), ('这是我的车。', withp('car')), ('这不是马。', alone('cow'))],
}
# phase 2: more sentences for 补句子 with the new characters (QFill takes one only once all its other characters are known)
FW_SENTS3 = {
    '我': [('我有三本书。', withn('book', 3))], '有': [('姐姐有伞。', who('peppa', 'umbrella'))], '是': [('车是红的。', alone('car'))],
    '的': [('我的衣是黄的。', withp('shirt'))], '在': [('弟弟在木下。', under('@george', 'tree'))], '不': [('鸟不是红的。', alone('bird'))],
}
# 读一读: read silently (every character already taught), tap the picture it says; the two others differ only in a
# relation or one thing (上 / 下, 大 / 小, which thing)
READ = [
    ('马是大的。', big('horse'), [small('horse'), big('cow')]),
    ('牛是小的。', small('cow'), [big('cow'), small('horse')]),
    ('我的车。', withp('car'), [withp('umbrella'), withp('lamp')]),
    ('他的伞。', withp('umbrella'), [withp('car'), withp('door')]),
    ('鸟不大。', small('bird'), [big('bird'), small('horse')]),
    ('这是月。', alone('moon'), [alone('sun'), alone('cloud')]),
    ('火大了。', big('fire'), [small('fire'), big('water')]),
    ('鸟在木上。', on('bird', 'tree'), [under('bird', 'tree'), on('bird', 'car')]),
    ('羊在山上。', on('sheep', 'mountain'), [under('sheep', 'mountain'), on('cow', 'mountain')]),
    ('木上有鸟。', on('bird', 'tree'), [alone('tree'), under('bird', 'tree')]),
    ('羊不大。', small('sheep'), [big('sheep'), small('cow')]),
    ('伞在车上。', on('umbrella', 'car'), [under('umbrella', 'car'), on('umbrella', 'door')]),
    ('日在山上。', on('sun', 'mountain'), [under('sun', 'mountain'), on('moon', 'mountain')]),
    ('我有伞。', withp('umbrella'), [withp('car'), alone('umbrella')]),
    ('这是我的车。', withp('car'), [withp('lamp'), withp('horse')]),
    ('马在门下。', under('horse', 'door'), [on('horse', 'door'), under('cow', 'door')]),
    ('马是我的。', withp('horse'), [withp('cow'), withp('car')]),
    ('你的门。', withp('door'), [withp('lamp'), withp('umbrella')]),
    ('他的牛。', withp('cow'), [withp('horse'), withp('sheep')]),
    ('羊是大的。', big('sheep'), [small('sheep'), big('horse')]),
    ('鸟是小的。', small('bird'), [big('bird'), small('cow')]),
    ('我的灯。', withp('lamp'), [withp('door'), withp('car')]),
    # phase 2: numbers, colours, family, actions (a sentence comes only once all its characters are known - QReadS filters)
    ('我有一本书。', withn('book', 1), [withn('book', 2), withn('cup', 1)]),
    ('我有三本书。', withn('book', 3), [withn('book', 4), withn('cup', 3)]),
    ('他有五杯水。', withn('cup', 5), [withn('cup', 4), withn('book', 5)]),
    ('这是八本书。', many('book', 8), [many('book', 6), many('cup', 8)]),
    ('我有十本书。', withn('book', 10), [withn('book', 7), withn('cup', 10)]),
    ('车是红的。', alone('car'), [tint(alone('car'), 'hue-rotate(205deg)'), tint(alone('car'), 'hue-rotate(105deg) saturate(1.2)')]),
    ('鸟是蓝的。', alone('bird'), [tint(alone('bird'), 'hue-rotate(150deg) saturate(1.4)'), alone('chicken')]),
    ('叶是绿的。', alone('leaf'), [tint(alone('leaf'), 'hue-rotate(-70deg) saturate(1.4)'), tint(alone('leaf'), 'hue-rotate(-115deg) saturate(1.6)')]),
    ('这是白兔。', alone('rabbit'), [tint(alone('rabbit'), 'sepia(1) saturate(2.6) brightness(.72)'), alone('dog')]),
    ('我的衣是黄的。', withp('shirt'), [tint(withp('shirt'), 'hue-rotate(175deg)'), tint(withp('shirt'), 'hue-rotate(-50deg) saturate(1.6)')]),
    ('这是我妈妈。', who('mummy_pig'), [who('daddy_pig'), who('peppa')]),
    ('爸爸有车。', who('daddy_pig', 'car'), [who('mummy_pig', 'car'), who('daddy_pig', 'umbrella')]),
    ('姐姐有伞。', who('peppa', 'umbrella'), [who('george', 'umbrella'), who('peppa', 'car')]),
    ('弟弟在木下。', under('@george', 'tree'), [under('@peppa', 'tree'), under('@george', 'door')]),
    ('弟弟吃饭。', who('george', 'ricebowl'), [who('george', 'soup'), who('peppa', 'ricebowl')]),
    ('妈妈喝汤。', who('mummy_pig', 'soup'), [who('mummy_pig', 'ricebowl'), who('daddy_pig', 'soup')]),
    ('哥哥看书。', who('gourd1', 'book'), [who('gourd1', 'meat'), who('george', 'book')]),
    ('我喝水。', alone('drink', .8), [alone('eat', .8), alone('look', .8)]),
    ('我吃饭。', alone('eat', .8), [alone('drink', .8), alone('walk', .8)]),
    ('我走了。', alone('walk', .8), [alone('come', .8), alone('look', .8)]),
    ('你来！', alone('come', .8), [alone('walk', .8), alone('eat', .8)]),
    ('我看月。', [('look', .32, .6, .62), ('moon', .76, .3, .36)], [[('look', .32, .6, .62), ('sun', .76, .3, .36)], [('eat', .32, .6, .62), ('moon', .76, .3, .36)]]),
]
# 读一读 with five pictures (client 2026-10-10, docs/OPTIONS-EXPLAIN-SPEC.md): two more wrong pictures for every sentence, each
# clearly NOT what it says (another thing, the other relation, another count / colour / person) - never a second right one: no
# other family's 妈妈 / 爸爸 / 姐姐 / 弟弟, no colour next to the asked one (orange for 红), no car alone for 我的车
READ_MORE = {
    '马是大的。': [small('cow'), big('sheep')],
    '牛是小的。': [big('horse'), small('sheep')],
    '我的车。': [withp('door'), withp('cow')],
    '他的伞。': [withp('lamp'), withp('horse')],
    '鸟不大。': [big('cow'), small('sheep')],
    '这是月。': [alone('tree'), alone('mountain')],
    '火大了。': [small('water'), big('tree')],
    '鸟在木上。': [on('sheep', 'tree'), under('bird', 'car')],
    '羊在山上。': [on('sheep', 'tree'), under('cow', 'mountain')],
    '木上有鸟。': [on('bird', 'car'), on('sheep', 'tree')],
    '羊不大。': [big('horse'), small('bird')],
    '伞在车上。': [on('lamp', 'car'), under('umbrella', 'door')],
    '日在山上。': [on('sun', 'tree'), under('moon', 'mountain')],
    '我有伞。': [withp('lamp'), withp('horse')],
    '这是我的车。': [withp('door'), withp('umbrella')],
    '马在门下。': [under('horse', 'tree'), on('cow', 'door')],
    '马是我的。': [withp('sheep'), withp('umbrella')],
    '你的门。': [withp('car'), withp('horse')],
    '他的牛。': [withp('car'), withp('lamp')],
    '羊是大的。': [big('cow'), small('horse')],
    '鸟是小的。': [small('sheep'), big('horse')],
    '我的灯。': [withp('umbrella'), withp('cow')],
    '我有一本书。': [withn('book', 3), withn('cup', 2)],
    '我有三本书。': [withn('book', 2), withn('book', 5)],
    '他有五杯水。': [withn('cup', 3), withn('book', 4)],
    '这是八本书。': [many('book', 7), many('book', 9)],
    '我有十本书。': [withn('book', 9), withn('book', 8)],
    '车是红的。': [tint(alone('car'), 'hue-rotate(60deg) saturate(1.4)'), alone('van')],
    '鸟是蓝的。': [tint(alone('bird'), 'hue-rotate(-100deg) saturate(1.4)'), alone('whale')],
    '叶是绿的。': [tint(alone('leaf'), 'hue-rotate(120deg) saturate(1.3)'), alone('dino')],
    '这是白兔。': [alone('polarbear'), tint(alone('rabbit'), 'sepia(1) hue-rotate(180deg) saturate(3) brightness(.8)')],
    '我的衣是黄的。': [withp('banana'), tint(withp('shirt'), 'hue-rotate(100deg) saturate(1.4)')],
    '这是我妈妈。': [who('george'), who('gourd1')],
    '爸爸有车。': [who('peppa', 'car'), who('daddy_pig', 'book')],
    '姐姐有伞。': [who('mummy_pig', 'umbrella'), who('peppa', 'book')],
    '弟弟在木下。': [on('@george', 'tree'), under('@mummy_pig', 'tree')],
    '弟弟吃饭。': [who('george', 'book'), who('daddy_pig', 'ricebowl')],
    '妈妈喝汤。': [who('peppa', 'soup'), who('mummy_pig', 'meat')],
    '哥哥看书。': [who('gourd1', 'soup'), who('peppa', 'book')],
    '我喝水。': [alone('walk', .8), alone('come', .8)],
    '我吃饭。': [alone('look', .8), alone('come', .8)],
    '我走了。': [alone('eat', .8), alone('drink', .8)],
    '你来！': [alone('look', .8), alone('drink', .8)],
    '我看月。': [[('look', .32, .6, .62), ('cloud', .76, .3, .36)], [('walk', .32, .6, .62), ('moon', .76, .3, .36)]],
}
READ = [(t, r, w + READ_MORE[t]) for t, r, w in READ]
# story books: six pages, one sentence (<= 8 characters) and one picture a page, only characters taught before they open
BOOKS = [
    dict(id='b1', title='小马的车', after='s1', pages=[
        ('我是小马。', small('horse')), ('我的车大。', [('horse', .26, .62, .4), ('car', .68, .62, .62)]),
        ('你是小牛。', small('cow')), ('你的车小。', [('cow', .3, .58, .5), ('car', .72, .74, .3)]),
        ('他是大牛。', big('cow')), ('他的车大！', [('cow', .26, .6, .5), ('car', .7, .66, .56)])]),
    dict(id='b2', title='山上有羊', after='s2', pages=[
        ('这是木。', alone('tree')), ('木上有鸟。', on('bird', 'tree')), ('鸟不大。', small('bird')),
        ('这是山。', alone('mountain')), ('山上有羊。', on('sheep', 'mountain')), ('月在山上了。', on('moon', 'mountain'))]),
    # phase 2: one book after each of four hero islands of the rainbow sea
    dict(id='b3', title='十本书', after='thor3', cover=big('book'), pages=[
        ('我有一本书。', withn('book', 1)), ('你有三本书。', withn('book', 3)), ('他有五本书。', withn('book', 5)),
        ('这是七本书。', many('book', 7)), ('八本书在床上。', [('bed', .5, .7, .78)] + [(o, x, round(y - .16, 3), round(k * .7, 3)) for o, x, y, k in many('book', 8)]),
        ('我有十本书！', withn('book', 10))]),
    dict(id='b4', title='红车白云', after='panther3', pages=[
        ('车是红的。', alone('car')), ('鸟是蓝的。', alone('bird')), ('叶是绿的。', alone('leaf')),
        ('鸡是黄的。', alone('chicken')), ('云是白的。', alone('cloud')), ('伞是红的！', alone('umbrella'))]),
    dict(id='b5', title='我的爸爸妈妈', after='widow3', pages=[
        ('这是爸爸。', who('daddy_pig')), ('这是妈妈。', who('mummy_pig')), ('这是姐姐。', who('peppa')),
        ('这是弟弟。', who('george')), ('姐姐有伞。', who('peppa', 'umbrella')), ('弟弟有车！', who('george', 'car'))]),
    dict(id='b6', title='来吃饭', after='hawk3', pages=[
        ('妈妈来了。', who('mummy_pig')), ('弟弟吃饭。', who('george', 'ricebowl')), ('姐姐喝汤。', who('peppa', 'soup')),
        ('爸爸吃肉。', who('daddy_pig', 'meat')), ('哥哥看书。', who('gourd1', 'book')), ('你来吃饭！', [('come', .32, .58, .7), ('ricebowl', .74, .66, .38)])]),
]

# ---------------------------------------------------------------- the object pictures (white background, cut out later)
S = 'a '
OBJ = {
    # world 1 · chinese
    'person': 'a cheerful little child standing and waving, simple and friendly (a generic cartoon kid, not any known character)',
    'mouth': 'a big friendly smiling cartoon mouth with red lips and white teeth, shown alone',
    'eye': 'one big friendly cartoon eye with long eyelashes and a sparkle, shown alone',
    'hand': 'one open cartoon child hand, palm forward, five fingers spread, shown alone',
    'sun': 'a bright round cartoon sun with short rays and a happy face',
    'moon': 'a yellow crescent moon with a sleepy smiling face',
    'cloud': 'a fluffy white cartoon cloud with a soft blue shadow',
    'tree': 'a round green leafy tree with a brown trunk',
    'mountain': 'three green mountain peaks, the middle one tallest, with white snow caps',
    'water': 'a splash of clear blue water with a few round droplets',
    'fire': 'a lively orange and yellow cartoon flame',
    'stone': 'a round grey stone with a few darker speckles',
    'field': 'a square green farm field seen from slightly above, divided into four plots by two crossing dirt paths',
    'riceplant': 'a young green rice plant with a drooping golden ear of grain',
    'rice': 'a small heap of white rice grains in a little blue bowl',
    'melon': 'a big round green watermelon with dark green stripes and a short stem',
    'cow': 'a cute black and white cow with small horns',
    'sheep': 'a fluffy white sheep with curly wool and a black face',
    'horse': 'a cute brown horse with a dark mane, standing',
    'bird': 'a cute little blue bird with a yellow beak, wings open',
    'big': 'a very big round red ball',
    'small': 'a very small round red ball',
    'up': 'a red balloon flying up with a thick upward arrow beside it',
    'down': 'a green parachute with a little box floating down with a thick downward arrow beside it',
    'car': 'a cute small red car seen from the side',
    'door': 'a closed wooden front door with a round brass knob and a small window',
    'lamp': 'a desk lamp switched on with warm yellow light',
    'umbrella': 'an open red and white striped umbrella',
    # world 1 · english
    'apple': 'a shiny red apple with a green leaf', 'ball': 'a colorful beach ball', 'cat': 'a cute orange tabby cat sitting',
    'dog': 'a cute brown puppy dog sitting (a generic puppy, not any known character)', 'egg': 'a white egg', 'fish': 'a cute orange fish',
    'grapes': 'a bunch of purple grapes with a green leaf', 'hat': 'a red sun hat with a ribbon', 'icecream': 'an ice cream cone with two scoops, pink and white',
    'juice': 'a glass of orange juice with a straw', 'kite': 'a diamond-shaped colorful kite with a ribbon tail', 'lion': 'a cute friendly lion with a big mane',
    'nose': 'a cute cartoon nose, shown alone', 'orange': 'a round orange fruit with a leaf', 'pig': 'a cute pink pig standing (a generic farm pig, not any known character)',
    'queen': 'a friendly cartoon queen with a golden crown and a red cape (a generic queen)', 'rabbit': 'a cute white rabbit with long ears',
    'van': 'a cute small blue van seen from the side', 'watch': 'a child wrist watch with a round face and a red strap', 'xylophone': 'a toy xylophone with rainbow colored bars and two mallets',
    'yoyo': 'a red yo-yo with a string', 'zebra': 'a cute zebra with black and white stripes',
    # world 2 · chinese
    'book': 'an open picture book', 'notebook': 'a closed blue exercise notebook with a white label', 'ruler': 'a yellow ruler with measuring marks (no numbers)',
    'schoolbag': 'a red school backpack', 'bed': 'a small cosy bed with a blue blanket and a pillow', 'shirt': 'a child t-shirt, yellow with a star',
    'towel': 'a folded fluffy pink towel', 'cup': 'a blue cup with a handle', 'wind': 'a colorful paper pinwheel spinning with swirling wind lines and two flying leaves',
    'rain': 'a grey rain cloud with blue raindrops falling', 'lightning': 'a yellow lightning bolt from a dark cloud', 'light': 'a glowing light bulb with shining rays',
    'follow': 'two little children walking one behind the other in a line', 'rest': 'a child sitting and resting with the back against a tree',
    'woods': 'two green trees standing side by side', 'bright': 'a sun and a crescent moon side by side shining brightly',
    'flower': 'a pink flower with a green stem and two leaves', 'leaf': 'a green leaf', 'fruit': 'a small pile of fruit: an apple, a pear and an orange',
    'bamboo': 'green bamboo stalks with leaves', 'dragon': 'a cute friendly Chinese dragon, red and gold', 'chicken': 'a cute yellow hen',
    'ricebowl': 'a bowl of steaming white rice with chopsticks', 'soup': 'a bowl of hot soup with steam', 'meat': 'a cartoon drumstick of meat',
    'spoon': 'a white porcelain Chinese soup spoon',
    # world 2 · english
    'ant': 'a cute little red ant', 'bus': 'a yellow school bus seen from the side', 'duck': 'a cute yellow duck', 'elephant': 'a cute grey elephant',
    'frog': 'a cute green frog sitting', 'glove': 'one red woolly glove', 'house': 'a small house with a red roof and a door', 'insect': 'a cute ladybird insect',
    'jacket': 'a blue zip-up child jacket', 'key': 'a golden key', 'milk': 'a carton of milk with a glass of milk', 'nut': 'a brown walnut',
    'owl': 'a cute brown owl with big eyes', 'pen': 'a blue pen', 'quilt': 'a folded patchwork quilt', 'ring': 'a golden ring with a pink gem',
    'star': 'a yellow star with a smile', 'tent': 'a small orange camping tent', 'unicorn': 'a cute white unicorn with a rainbow mane',
    'vase': 'a blue vase with flowers', 'window': 'a house window with blue frames and curtains', 'fox': 'a cute orange fox',
    'yogurt': 'a cup of strawberry yogurt with a spoon', 'zip': 'a big metal zipper on blue cloth, half open', 'box': 'a closed brown cardboard box',
    'train': 'a cute red toy train engine', 'moonlight': 'a crescent moon shining soft light on a little house', 'pinwheel': 'a colorful paper pinwheel on a stick',
    'rockinghorse': 'a wooden rocking horse toy', 'volcano': 'a cartoon volcano with orange lava on top', 'raincoat': 'a yellow child raincoat',
}
# world 3, phase 2: generated by tools/w3_batches.py (its prompts are the source); the numbers are composed
# (tools/compose_numbers.py) and the family words use the client's pictures (assets/chars, '@')
for _o in 'strawberry banana whale dino polarbear eat drink look walk come bat fan pan map mop top web jam log'.split():
    OBJ.setdefault(_o, 'see tools/w3_batches.py')

# ================================================================ world 4 · 神笔海 (docs/W4-DESIGN.md): following the 2024
# 统编一上 order (学而思 L1's weekly form). Package 0 writes ALL of its data here once; the island files (src/w4/<id>.js)
# only read it. tools/build.py puts the islands that are live (tools/w4_live.json) on the first screen and the big tables
# into the lazily loaded assets/js/w4.js (W4D).
W4 = [
    dict(id='ultra4', name='天地岛', host='ultraman', crew=['ultraman', 'zero', 'kaiju1'], color='#E23B3B', color2='#4FA3E8', hi='守护天和地！', base=2, write='天土',
         chars=[('天', '天，天空的天！', 'sky', 'sky'), ('地', '地，地球的地！', 'earth', 'earth'), ('金', '金，金子的金！', 'gold', 'gold'), ('土', '土，泥土的土！', 'soil', 'soil'), ('川', '川，山川的川！', 'river', 'river')], letters=[]),
    dict(id='peppa4', name='小医院', host='peppa', crew=['peppa', 'george', 'mummy_pig', 'daddy_pig'], color='#FF8DB3', color2='#7BC8F6', hi='佩奇看医生！', base=2, write='耳头',
         chars=[('耳', '耳，耳朵的耳！', 'ear', 'ear'), ('足', '足，足球的足！', 'foot', 'foot'), ('头', '头，大头的头！', 'head', 'head'), ('牙', '牙，牙齿的牙！', 'tooth', 'tooth'), ('心', '心，爱心的心！', 'heart', 'heart')], letters=[]),
    dict(id='pj4', name='月光乐园', host='catboy', crew=['catboy', 'owlette', 'gekko'], color='#3A5CC0', color2='#FFD23C', hi='月光下出发！', base=2, write='坐飞',
         chars=[('坐', '坐，坐下的坐！', 'sit', 'sit'), ('站', '站，站好的站！', 'stand', 'stand'), ('飞', '飞，飞机的飞！', 'plane', 'fly'), ('说', '说，说话的说！', 'talk', 'talk'), ('听', '听，听歌的听！', 'listen', 'listen')], letters=[]),
    dict(id='xiyou4', name='水帘洞', host='wukong', crew=['wukong', 'tangseng', 'bajie', 'shaseng'], color='#F5B324', color2='#3FAE9A', hi='水帘洞见！', base=2, write='虫对',
         chars=[('对', '对，做对的对！', 'check', 'correct'), ('雪', '雪，下雪的雪！', 'snow', 'snow'), ('虫', '虫，小虫的虫！', 'insect', 'bug'), ('鱼', '鱼，小鱼的鱼！', 'fish', 'fish'), ('草', '草，小草的草！', 'grass', 'grass')], letters=[]),
    dict(id='huluwa4', name='葫芦洞', host='gourd2', crew=['gourd2', 'grandpa', 'gourd3', 'gourd6'], color='#46C27A', color2='#A0522D', hi='葫芦洞开啦！', base=2, write='开关',
         chars=[('多', '多，多少的多！', 'many', 'many'), ('少', '少，多少的少！', 'few', 'few'), ('开', '开，打开的开！', 'chest_open', 'open'), ('关', '关，关上的关！', 'chest_shut', 'shut'), ('去', '去，出去的去！', 'goaway', 'go')], letters=[]),
    dict(id='paw4', name='十字路口', host='chase', crew=['chase', 'ryder', 'marshall', 'rubble'], color='#E8554A', color2='#2E6FD8', hi='路口出动！', base=2, write='左右',
         chars=[('左', '左，左边的左！', 'leftsign', 'left'), ('右', '右，右边的右！', 'rightsign', 'right'), ('中', '中，中间的中！', 'middle', 'middle'), ('前', '前，前面的前！', 'front', 'front'), ('后', '后，后面的后！', 'back', 'back')], letters=[]),
    dict(id='bluey4', name='大家庭', host='bluey', crew=['bluey', 'bingo', 'bandit', 'chilli'], color='#6BB9F2', color2='#F59A4A', hi='全家都来啦！', base=2, write='女子',
         chars=[('爷', '爷，爷爷的爷！', '@grandpa', 'grandpa'), ('奶', '奶，奶奶的奶！', 'grandma', 'grandma'), ('妹', '妹，妹妹的妹！', '@bingo', 'little sister'), ('女', '女，女孩的女！', 'girl', 'girl'), ('子', '子，孩子的子！', 'baby', 'child')], letters=[]),
]
# §4.1: read, not written (the island writes its two `write` characters; the other three are read, as in 彩虹海)
NOWRITE4 = '地金川足牙心站说听雪鱼草多少去中前后爷奶妹'
# the grandma picture may be swapped for milk by the parent (§13.5): both lines are recorded, the data picks one
NAI_MILK = ('奶，牛奶的奶！', 'milk')
# §3.3: the four slots' games, their friends on the stage (host first) and the sounds of the island
CASTS4 = {'ultra4': ['ultraman', 'zero'], 'peppa4': ['peppa', 'george'], 'pj4': ['catboy', 'owlette'], 'xiyou4': ['wukong', 'tangseng'],
          'huluwa4': ['gourd2', 'grandpa'], 'paw4': ['chase', 'ryder'], 'bluey4': ['bluey', 'bingo']}
AMB4 = {'ultra4': 'city', 'peppa4': 'rain', 'pj4': 'crickets', 'xiyou4': 'falls', 'huluwa4': 'wind', 'paw4': 'city', 'bluey4': 'crickets'}
SKIN4 = {'ultra4': 'avengers', 'peppa4': 'peppa', 'pj4': 'avengers', 'xiyou4': 'xiyou', 'huluwa4': 'huluwa', 'paw4': 'paw', 'bluey4': 'bluey'}
# §8.3: the fallback of every picture (used by tools/build.py while the new one is not there yet)
FALLBACK4 = {
    'bg/map_w4': 'bg/map_w3', 'isl/gate4': 'isl/gate3', 'isl/brush4': 'props/brush', 'isl/fest4': 'isl/fest1', 'bg/finale_w4': 'bg/finale_w1',
    'isl/ultra4': 'isl/ultra', 'isl/peppa4': 'isl/peppa2', 'isl/pj4': 'isl/pj', 'isl/xiyou4': 'isl/xiyou', 'isl/huluwa4': 'isl/huluwa2', 'isl/paw4': 'isl/paw', 'isl/bluey4': 'isl/bluey2',
    'ultra4': ('hulk3_find', 'ultra_write', 'ultra2_abc', 'ultra2_quiz'), 'peppa4': ('peppa2_find', 'peppa2_write', 'peppa2_abc', 'peppa2_quiz'),
    'pj4': ('pj_find', 'pj_write', 'pj_abc', 'pj_quiz'), 'xiyou4': ('xiyou_find', 'xiyou_write', 'xiyou_abc', 'xiyou_quiz'),
    'huluwa4': ('huluwa2_find', 'huluwa2_write', 'huluwa2_abc', 'huluwa2_quiz'), 'paw4': ('paw_find', 'paw_write', 'paw_abc', 'paw_quiz'),
    'bluey4': ('bluey2_find', 'bluey2_write', 'bluey2_abc', 'bluey2_quiz'),
    'obj/soil': 'props/mound',
}


# ---------------------------------------------------------------- scenes of world 4 (§4.4): sky / water / ground / two groups
def sky(o, k=.42): return [('sky', .5, .5, .96), (o, .5, .4, k)]
def water(o, k=.42): return [('river', .5, .55, .94), (o, .5, .5, k)]
def ground(o, k=.46): return [('soil', .5, .76, .62), (o, .5, .42, k)]
def split(a, na, b, nb):
    """na of a on the left half, nb of b on the right half (鸟多，鱼少)"""
    def half(o, n, x0):
        cols = 2 if n > 2 else 1; rows = (n + cols - 1) // cols; k = .18 if n > 2 else .24
        return [(o, round(x0 + (.12 if cols > 1 else 0) * (1 if i % cols else -1) * (cols > 1), 3), round(.55 + (i // cols - (rows - 1) / 2) * .2, 3), k) for i in range(n)]
    return half(a, na, .27) + half(b, nb, .73)


# 读一读 (§4.4.1): 14 new sentences, the right picture and four that are clearly NOT it (one relation or one thing differs)
READ4 = [
    ('鱼在水中。', water('fish'), [on('fish', 'mountain'), water('bird'), on('fish', 'tree'), on('fish', 'car')]),
    ('鸟飞上天。', sky('bird'), [ground('bird'), sky('fish'), sky('cow'), water('bird')]),
    ('山上有雪。', on('snow', 'mountain'), [under('snow', 'mountain'), on('fire', 'mountain'), on('snow', 'car'), on('grass', 'mountain')]),
    ('地上有草。', ground('grass'), [sky('grass'), ground('snow'), ground('fire'), ground('fish')]),
    ('小虫在草上。', on('insect', 'grass'), [on('insect', 'cup'), on('bird', 'grass'), on('insect', 'snow'), on('insect', 'door')]),
    ('牛在左，马在右。', pair('cow', 'horse'), [pair('horse', 'cow'), pair('cow', 'cow'), pair('sheep', 'horse'), pair('cow', 'sheep')]),
    ('我坐下。', alone('sit', .8), [alone('stand', .8), alone('walk', .8), alone('talk', .8), alone('listen', .8)]),
    ('我站在门口。', [('stand', .32, .6, .62), ('door', .74, .54, .5)], [[('sit', .32, .66, .5), ('door', .74, .54, .5)], [('stand', .32, .6, .62), ('car', .74, .62, .44)],
                                                                   [('walk', .32, .6, .62), ('door', .74, .54, .5)], [('stand', .32, .6, .62), ('mountain', .74, .5, .5)]]),
    ('我去山上。', [('goaway', .3, .62, .6), ('mountain', .72, .42, .5)], [[('come', .3, .62, .6), ('mountain', .72, .42, .5)], [('goaway', .3, .62, .6), ('water', .72, .5, .44)],
                                                                      [('sit', .5, .74, .44), ('mountain', .5, .34, .56)], [('look', .3, .62, .6), ('mountain', .72, .42, .5)]]),
    ('门开了。', alone('door_open'), [alone('door'), alone('chest_open'), alone('umbrella'), alone('lamp')]),
    ('门关了。', alone('door'), [alone('door_open'), alone('chest_shut'), alone('umbrella'), alone('car')]),
    ('鸟多，鱼少。', split('bird', 5, 'fish', 2), [split('bird', 2, 'fish', 5), split('bird', 3, 'fish', 3), split('bird', 5, 'cow', 2), split('bird', 1, 'fish', 1)]),
    ('妹妹有鱼。', who('bingo', 'fish'), [who('peppa', 'fish'), who('bingo', 'bird'), who('george', 'fish'), who('bingo', 'umbrella')]),
    ('爷爷有车。', who('grandpa', 'car'), [who('daddy_pig', 'car'), who('grandpa', 'umbrella'), who('george', 'car'), who('grandpa', 'horse')]),
]
# story books (§4.4.4): 自己读 / 一起读 is worked out from the characters the child knows (Books.self, src/v2.js)
BOOKS4 = [
    dict(id='b7', title='天上地下', after='ultra4', cover=sky('sun'), pages=[
        ('天上有日。', sky('sun')), ('天上有月。', sky('moon')), ('天上有云。', sky('cloud', .5)),
        ('地上有山。', [('grass', .5, .82, .9), ('mountain', .5, .44, .64)]), ('地上有水。', alone('river', .82)), ('山下有金！', under('gold', 'mountain'))]),
    dict(id='b8', title='我的头', after='peppa4', pages=[      # (not 小医院: 医 院 are not taught - the book could never be 自己读)
        ('这是我的头。', alone('head')), ('这是我的耳。', alone('ear')), ('这是我的口。', alone('mouth')),
        ('这是我的牙。', alone('tooth')), ('这是我的手。', alone('hand')), ('这是我的足！', alone('foot'))]),
    dict(id='b9', title='开门关门', after='huluwa4', pages=[
        ('门开了。', alone('door_open')), ('牛来了。', [('door_open', .3, .55, .6), ('cow', .74, .64, .4)]), ('牛多了。', many('cow', 5)),
        ('门关了。', alone('door')), ('牛去了。', [('door', .3, .55, .6), ('cow', .76, .7, .26)]), ('牛少了！', many('cow', 2))]),
    dict(id='b10', title='一家人', after='bluey4', pages=[
        ('这是爷爷。', who('grandpa')), ('这是奶奶。', alone('grandma', .8)), ('这是妹妹。', who('bingo')),
        ('爷爷坐下。', [('@grandpa', .5, .58, .8)]), ('奶奶坐下。', alone('grandma', .8)),
        ('我们一家人！', [('@grandpa', .18, .6, .5), ('grandma', .4, .6, .5), ('person', .62, .64, .44), ('@bingo', .83, .68, .36)])]),
]
# 儿歌卷 7 (one an island, after its flag) + 古诗卷 3 (after ③ ⑤ ⑦): read together, never scored. A line of the scroll is a
# breath (said as one recording, <= 8 characters); the picture is composed from things the app already has
SCROLLS4 = [
    dict(id='r1', kind='rhyme', title='金木水火土', after='ultra4', pic=[('sun', .28, .3, .3), ('moon', .72, .3, .3), ('mountain', .5, .7, .56)],
         lines=['一二三四五，', '金木水火土。', '天地分上下，', '日月照今古。']),
    dict(id='r2', kind='rhyme', title='五官歌', after='peppa4', pic=[('head', .5, .45, .6), ('heart', .82, .78, .26)],
         lines=['头，点点头。', '耳，听一听。', '牙，白又白。', '足，走一走。', '心，好开心！']),
    dict(id='r3', kind='rhyme', title='站如松', after='pj4', pic=[('stand', .3, .55, .56), ('sit', .72, .6, .5)],
         lines=['站如松，', '坐如钟。', '行如风，', '卧如弓。']),
    dict(id='r4', kind='rhyme', title='对韵歌', after='xiyou4', pic=[('cloud', .25, .25, .3), ('rain', .72, .25, .3), ('snow', .25, .7, .28), ('insect', .72, .7, .26)],
         lines=['云对雨，', '雪对风。', '花对树，', '鸟对虫。', '山清对水秀，', '柳绿对桃红。']),
    dict(id='r5', kind='rhyme', title='大小多少', after='huluwa4', pic=[('cow', .3, .52, .46), ('duck', .74, .6, .3)],
         lines=['一个大，', '一个小，', '一头黄牛一只猫。', '一边多，', '一边少，', '一群鸭子一只鸟。']),
    dict(id='r6', kind='rhyme', title='影子', after='paw4', pic=[('walk', .38, .55, .6), ('dog', .74, .66, .34)],
         lines=['影子在前，', '影子在后，', '影子常常跟着我，', '就像一条小黑狗。', '影子在左，', '影子在右，', '影子常常陪着我，', '它是我的好朋友。']),
    dict(id='r7', kind='rhyme', title='一家人', after='bluey4', pic=[('@grandpa', .16, .6, .46), ('grandma', .38, .6, .46), ('@daddy_pig', .62, .6, .46), ('@mummy_pig', .84, .6, .46)],
         lines=['爷爷奶奶，', '爸爸妈妈，', '哥哥姐姐，', '弟弟妹妹，', '我们是一家。']),
    dict(id='p1', kind='poem', title='咏鹅', after='pj4', pic=[('river', .5, .6, .9), ('goose', .5, .46, .46)],
         lines=['鹅，鹅，鹅，', '曲项向天歌。', '白毛浮绿水，', '红掌拨清波。']),
    dict(id='p2', kind='poem', title='画', after='huluwa4', pic=[('mountain', .3, .4, .46), ('river', .7, .66, .5), ('flower', .22, .78, .26), ('bird', .74, .28, .24)],
         lines=['远看山有色，', '近听水无声。', '春去花还在，', '人来鸟不惊。']),
    dict(id='p3', kind='poem', title='静夜思', after='bluey4', pic=[('bed', .5, .7, .6), ('moon', .72, .24, .3)],
         lines=['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。']),
]
SCROLL_KIND = {'rhyme': '儿歌卷', 'poem': '古诗卷'}

# ---------------------------------------------------------------- English (§4.3, plan A.5): word families, sight words, sentences
# (word, picture, clear): clear = a 4-year-old names the picture with this very word (used where the word is read silently)
# (bun: the picture is a Chinese 包子, can: a tin with a blank label - only where the word is said, W4R1N-10)
WORDS4 = [('cat', 'cat', 1), ('hat', 'hat', 1), ('bat', 'bat', 1), ('mat', 'mat', 1), ('rat', 'rat', 1),
          ('fan', 'fan', 1), ('pan', 'pan', 1), ('van', 'van', 1), ('man', 'man', 1), ('can', 'tincan', 0),
          ('map', 'map', 1), ('cap', 'cap', 1), ('pig', 'pig', 1), ('wig', 'wig', 1), ('fig', 'fig', 0),
          ('bug', 'insect', 1), ('rug', 'rug', 1), ('mug', 'mug', 1), ('jug', 'jug', 0),
          ('mop', 'mop', 1), ('top', 'top', 0), ('hop', 'hop', 0), ('pen', 'pen', 1), ('hen', 'hen', 1), ('ten', 'num10', 0),
          ('net', 'net', 0), ('jet', 'jet', 1), ('sun', 'sun', 1), ('bun', 'bun', 0), ('run', 'run', 0),
          ('box', 'box', 1), ('fox', 'fox', 1), ('dog', 'dog', 1), ('log', 'log', 1), ('bed', 'bed', 1)]
# real consonant-vowel-consonant words (变身换字母: a word the child makes is said when it is one; otherwise "这个不是词")
DICT4 = ('bad bag ban bat bed beg bet bib bid big bin bit bog bop box bud bug bun bus but cab can cap cat cob cod cog cop cot cub cup cut dad dam den did dig dim din dip dog dot dug fad fan fat fed fen fig fin fit fix '
         'fog fox fun fur gap gas get gig gum gun gut had ham has hat hen hid him hip his hit hog hop hot hug hum hut jab jam jet jig job jog jot jug jut kid kin kit lab lad lag lap led leg let lid lip lit log lot mad man map mat '
         'men met mid mix mob mom mop mud mug nab nag nap net nip nod not nun nut pad pal pan pat peg pen pet pig pin pit pod pop pot pub pug pun pup put rag ram ran rap rat red rib rid rig rim rip rob rod rot rub rug rum run rut '
         'sad sag sap sat set sip sit sob sod sun tab tag tan tap ten tin tip top tub tug van vat vet wag web wet wig win wit yak yam yap yet zap zip').split()
# Dolch pre-primer sight words (+ at, under, by: the design's own games read them - ③-3 a / at, ⑦-3 under / by)
SIGHT4 = ('I a the see my is it in on up go can look me we and you big little down come not one two three red blue yellow here said play'
          ' at under by').split()
# 中英对对碰 (§6 ⑤-3): the sight words that mean a character the child knows, and a picture for level 1
BRIDGE4 = [('big', '大', 'big'), ('little', '小', 'small'), ('up', '上', 'up'), ('down', '下', 'down'), ('go', '去', 'goaway'), ('come', '来', 'come'),
           ('look', '看', 'look'), ('I', '我', None), ('you', '你', None), ('is', '是', None), ('not', '不', None), ('one', '一', 'num1'),
           ('two', '二', 'num2'), ('three', '三', 'num3'), ('red', '红', 'strawberry'), ('blue', '蓝', 'whale'), ('yellow', '黄', 'banana')]
# sentences to read (point-as-read ③-3; flash words ④-3): <= 6 words, every word known (WORDS3 / WORDS4 / SIGHT4, a plural s)
ESENT4 = [
    ('I see.', alone('look', .8)), ('I can hop.', alone('hop')), ('I can run.', alone('run')), ('Look up!', [('look', .4, .62, .66), ('sun', .78, .2, .3)]),
    ('A big pig.', big('pig')), ('A red hat.', alone('hat')), ('Come and play!', alone('come', .8)), ('A little rat.', small('rat')),
    ('I see a cat.', [('look', .3, .6, .6), ('cat', .75, .62, .4)]), ('The pig is big.', big('pig')), ('The sun is up.', on('sun', 'mountain')),
    ('My hat is red.', alone('hat')), ('Look at the hen.', alone('hen')), ('The cup is blue.', alone('cup')), ('Here is my cap.', alone('cap')),
    ('I see a big jet.', [('look', .28, .62, .56), ('jet', .72, .34, .5)]), ('A bug is on the rug.', on('insect', 'rug')),
    ('The cat is on the box.', on('cat', 'box')), ('I can see a man.', [('look', .3, .62, .56), ('man', .72, .6, .5)]),
    ('It is on the box.', on('fox', 'box')), ('Is it a hen?', alone('hen')), ('The rat is little.', small('rat')),
    ('A cat can hop.', alone('cat')), ('Go, dog, go!', alone('dog')), ('Run, man, run!', alone('man')), ('Hop, hop, hop!', alone('hop')),
    ('A pig and a hen.', pair('pig', 'hen')), ('The cat and the dog.', pair('cat', 'dog')), ('We can play in the sun.', alone('sun')),
    ('My mug is on the mat.', on('mug', 'mat')), ('I see three red hats.', many('hat', 3)), ('Look, a fox on a box!', on('fox', 'box')),
    ('The hen is not big.', small('hen')), ('Two cats and a dog.', [('cat', .2, .6, .32), ('cat', .45, .6, .32), ('dog', .76, .6, .38)]),
    ('Come and see my map.', alone('map')), ('The jet is up, up, up!', alone('jet')),
]
# 对不对 (§6 ⑥-3): one picture, statements true (1) or not (0); lv: 1 a phrase, 2 the X is Y, 3 how many, 4 not, 5 where
TF4 = [
    dict(lv=1, pic=big('pig'), s=[('A big pig.', 1), ('I see a pig.', 1), ('A little pig.', 0), ('A blue pig.', 0)]),
    dict(lv=1, pic=small('cat'), s=[('A little cat.', 1), ('I see a cat.', 1), ('A big cat.', 0), ('A red cat.', 0)]),
    dict(lv=1, pic=alone('hat'), s=[('A red hat.', 1), ('I see a hat.', 1), ('A blue hat.', 0), ('A yellow hat.', 0)]),
    dict(lv=1, pic=alone('cup'), s=[('A blue cup.', 1), ('I see a cup.', 1), ('A red cup.', 0), ('A yellow cup.', 0)]),
    dict(lv=1, pic=big('dog'), s=[('A big dog.', 1), ('I see a dog.', 1), ('A little dog.', 0), ('A big hen.', 0)]),
    dict(lv=2, pic=big('pig'), s=[('The pig is big.', 1), ('It is a pig.', 1), ('The pig is little.', 0), ('It is a dog.', 0)]),
    dict(lv=2, pic=alone('sun'), s=[('The sun is yellow.', 1), ('It is the sun.', 1), ('The sun is blue.', 0), ('It is a bun.', 0)]),
    dict(lv=2, pic=alone('cup'), s=[('The cup is blue.', 1), ('It is a cup.', 1), ('The cup is red.', 0), ('It is a cap.', 0)]),
    dict(lv=2, pic=small('hen'), s=[('The hen is little.', 1), ('It is a hen.', 1), ('The hen is big.', 0), ('It is a pen.', 0)]),
    dict(lv=3, pic=many('cat', 3), s=[('I see three cats.', 1), ('I see cats.', 1), ('I see two cats.', 0), ('I see one cat.', 0)]),
    dict(lv=3, pic=many('hat', 2), s=[('I see two hats.', 1), ('I see hats.', 1), ('I see three hats.', 0), ('I see one hat.', 0)]),
    dict(lv=3, pic=many('dog', 1), s=[('I see one dog.', 1), ('I see a dog.', 1), ('I see two dogs.', 0), ('I see three dogs.', 0)]),
    dict(lv=3, pic=many('cup', 3), s=[('I see three cups.', 1), ('I see cups.', 1), ('I see one cup.', 0), ('I see two cups.', 0)]),
    dict(lv=4, pic=small('cat'), s=[('The cat is not big.', 1), ('It is not a dog.', 1), ('The cat is not little.', 0), ('It is not a cat.', 0)]),
    dict(lv=4, pic=big('pig'), s=[('The pig is not little.', 1), ('It is not a hen.', 1), ('The pig is not big.', 0), ('It is not a pig.', 0)]),
    dict(lv=4, pic=alone('hat'), s=[('The hat is not blue.', 1), ('It is not a cap.', 1), ('The hat is not red.', 0), ('It is not a hat.', 0)]),
    dict(lv=4, pic=alone('cup'), s=[('The cup is not red.', 1), ('It is not a mug.', 1), ('The cup is not blue.', 0), ('It is not a cup.', 0)]),
    dict(lv=5, pic=on('cat', 'box'), s=[('The cat is on the box.', 1), ('The cat is not in the box.', 1), ('The cat is in the box.', 0), ('The cat is under the box.', 0)]),
    dict(lv=5, pic=pair('cat', 'box', .44, .5), s=[('The cat is by the box.', 1), ('The cat is not on the box.', 1), ('The cat is on the box.', 0), ('The cat is in the box.', 0)]),
    dict(lv=5, pic=on('hat', 'bed'), s=[('The hat is on the bed.', 1), ('The hat is not under the bed.', 1), ('The hat is under the bed.', 0), ('The hat is in the box.', 0)]),
    dict(lv=5, pic=under('dog', 'bed'), s=[('The dog is under the bed.', 1), ('The dog is not on the bed.', 1), ('The dog is on the bed.', 0), ('The dog is in the box.', 0)]),
]
# 照句子摆一摆 (§6 ⑦-3): five things, three places, four relations; every place a thing can really be put
PLACE4_THINGS = [('cat', 'cat'), ('dog', 'dog'), ('hat', 'hat'), ('cup', 'cup'), ('bug', 'insect')]
PLACE4_SPOTS = [('in', 'box'), ('on', 'bed'), ('on', 'box'), ('on', 'mat'), ('under', 'bed'), ('by', 'bed'), ('by', 'box'), ('by', 'mat')]
PLACE4 = ['The %s is %s the %s.' % (t, p, s) for t, _ in PLACE4_THINGS for p, s in PLACE4_SPOTS]

# ---------------------------------------------------------------- Chinese words, sentences and relations of the challenges
# 摘桃找词 (§6 ④-1): real words; (word, picture or '') - level 1 asks only words with a picture
WORDS_ZH4 = [('天上', ''), ('地上', ''), ('天下', ''), ('地下', ''), ('山上', ''), ('山下', ''), ('上天', ''), ('大地', ''), ('土地', 'soil'), ('天地', ''), ('山川', ''),
             ('金鱼', 'fish'), ('大鱼', ''), ('小鱼', ''), ('鱼头', ''), ('小虫', 'insect'), ('草地', 'grass'), ('小草', ''), ('雪地', ''), ('大雪', 'snow'), ('小雪', ''), ('雪山', 'mountain'), ('水草', ''),
             ('火山', 'volcano'), ('山水', ''), ('大火', 'fire'), ('门口', ''), ('石头', 'stone'), ('木头', 'log'), ('牛头', ''), ('马头', ''), ('大头', 'head'),
             ('手心', 'hand'), ('小心', ''), ('月牙', 'moon'), ('坐下', 'sit'), ('听说', ''),
             ('上下', ''), ('大小', ''), ('日月', 'bright'), ('大人', ''), ('多少', ''), ('开关', ''), ('开门', 'door_open'), ('关门', 'door'),
             ('大门', ''), ('小门', ''), ('左手', ''), ('右手', ''), ('左右', ''), ('前后', ''), ('爷爷', '@grandpa'), ('奶奶', 'grandma'), ('妹妹', '@bingo'), ('下山', ''), ('上山', ''),
             ('不对', ''), ('对了', 'check')]      # (W4R1N-09: 人口 山口 小人 人心 牛马 对门 out - not words a 4-year-old pictures)
# level 5: three characters (the others differ in one character or the order)
WORDS_ZH4_3 = [('小金鱼', 'fish'), ('大金鱼', ''), ('大雪山', 'mountain'), ('小雪山', ''), ('小草地', 'grass'), ('大草地', ''), ('大火山', 'volcano'), ('小火山', ''),
               ('大石头', 'stone'), ('小石头', ''), ('大木头', 'log'), ('小木头', '')]
# 哪句说得通 (§6 ⑦-4): a first half, the ending that makes sense, four that cannot be (funny and harmless - never fire, danger,
# illness or death, never true in some season; package C's review 2026-10-18). W4R1N-03 (2026-10-19): the four wrong endings are
# no longer a fixed set of odd places (牙上 米中 月上 ...: a child could answer without reading the first half). Every wrong
# ending is now one that is RIGHT for another subject (吃草 for a cow, 下雨 for the sky, 在开车 for a father, 去水中 for a fish ...),
# chosen from what is CERTAINLY impossible for this subject (a fish cannot sit in a car, a cow does not read, the moon does not
# drink), and balanced so that a child who reads only the endings is right about 1 time in 5 (tools/sense_guess.py: six guessers,
# each <= 30%, now <= 22%). 站云上 / 坐伞上 / 关门 are the only endings right for no one. subj: the first half's picture; ENDPIC4: the
# place of an ending (the funny picture of a wrong one is composed: that place, the subject on it)
SENSE4 = [
    # only 晨光海 + 神笔海 characters
    dict(pre='鱼', ok='下水。', no=['上山。', '下雪。', '开车。', '关门。'], subj='fish'),
    dict(pre='天', ok='下雪。', no=['开车。', '关门。', '上山。', '下水。'], subj='sky'),
    dict(pre='羊', ok='上山。', no=['开车。', '开门。', '关门。', '下雪。'], subj='sheep'),
    dict(pre='鱼', ok='去水中。', no=['站地上。', '去田中。', '站木上。', '去草地。'], subj='fish'),
    dict(pre='牛', ok='去田中。', no=['坐车上。', '飞上天。', '坐伞上。', '站木上。'], subj='cow'),
    dict(pre='马', ok='去山上。', no=['坐石上。', '飞上天。', '站云上。', '坐车上。'], subj='horse'),
    dict(pre='车', ok='去山上。', no=['在看书。', '站木上。', '在杯中。', '坐床上。'], subj='car'),
    dict(pre='小金鱼', ok='去水中。', no=['去草地。', '去山上。', '站门口。', '站地上。'], subj='fish'),
    dict(pre='门', ok='关上。', no=['下雪。', '上山。', '开车。', '坐下。'], subj='door'),
    dict(pre='牛', ok='站地上。', no=['坐石上。', '站云上。', '站木上。', '坐车上。'], subj='cow'),
    dict(pre='马', ok='去草地。', no=['坐车上。', '坐石上。', '站木上。', '飞上天。'], subj='horse'),
    # with 星光海 / 彩虹海 characters (asked only once known): level 1-2, two-character endings
    dict(pre='牛', ok='吃草。', no=['下雨。', '开车。', '看书。', '喝汤。'], subj='cow'),
    dict(pre='兔子', ok='吃草。', no=['喝汤。', '关门。', '下雪。', '看书。'], subj='rabbit'),
    dict(pre='马', ok='喝水。', no=['下雨。', '下雪。', '看书。', '喝汤。'], subj='horse'),
    dict(pre='小狗', ok='喝水。', no=['下雪。', '开车。', '下雨。', '看书。'], subj='dog'),
    dict(pre='小鸡', ok='吃米。', no=['关门。', '下雨。', '开车。', '看书。'], subj='chicken'),
    dict(pre='小鸟', ok='吃虫。', no=['下雪。', '开车。', '关门。', '喝汤。'], subj='bird'),
    dict(pre='我', ok='看书。', no=['开车。', '下雨。', '吃虫。', '吃草。'], subj='look'),
    dict(pre='爸爸', ok='开车。', no=['吃草。', '下雨。', '吃虫。', '下雪。'], subj='@daddy_pig'),
    dict(pre='妈妈', ok='吃饭。', no=['下雨。', '吃草。', '吃虫。', '下雪。'], subj='@mummy_pig'),
    dict(pre='奶奶', ok='喝汤。', no=['吃草。', '下雨。', '下雪。', '吃虫。'], subj='grandma'),
    dict(pre='天', ok='下雨。', no=['吃米。', '上山。', '关门。', '下水。'], subj='sky'),
    dict(pre='妹妹', ok='开门。', no=['下雨。', '下雪。', '吃草。', '开车。'], subj='@bingo'),
    dict(pre='爷爷', ok='坐下。', no=['下雨。', '吃虫。', '吃草。', '下雪。'], subj='@grandpa'),
    # three-character endings (level 3)
    dict(pre='小鸟', ok='飞上天。', no=['在喝汤。', '站云上。', '在开车。', '在看书。'], subj='bird'),
    dict(pre='妹妹', ok='坐车上。', no=['站云上。', '在杯中。', '在吃草。', '在开车。'], subj='@bingo'),
    dict(pre='牛', ok='在吃草。', no=['在杯中。', '飞上天。', '在开车。', '在看书。'], subj='cow'),
    dict(pre='小狗', ok='站门口。', no=['飞上天。', '站云上。', '在看书。', '在开车。'], subj='dog'),
    dict(pre='爸爸', ok='在开车。', no=['在杯中。', '坐伞上。', '站云上。', '在吃草。'], subj='@daddy_pig'),
    dict(pre='羊', ok='去草地。', no=['站木上。', '坐车上。', '飞上天。', '站云上。'], subj='sheep'),
    dict(pre='爷爷', ok='在看书。', no=['站云上。', '在吃草。', '在杯中。', '坐伞上。'], subj='@grandpa'),
    dict(pre='水', ok='在杯中。', no=['站木上。', '在看书。', '去山上。', '在吃草。'], subj='water'),
    dict(pre='月', ok='在天上。', no=['坐车上。', '在喝水。', '在开车。', '去田中。'], subj='moon'),
    dict(pre='奶奶', ok='在喝汤。', no=['在杯中。', '在吃草。', '站云上。', '坐伞上。'], subj='grandma'),
    dict(pre='我', ok='坐石上。', no=['站云上。', '在开车。', '坐伞上。', '在杯中。'], subj='sit'),
    # three-character first halves (level 4)
    dict(pre='小虫', ok='站木上。', no=['在看书。', '站云上。', '在开车。', '在喝汤。'], subj='insect'),
    dict(pre='小白兔', ok='去草地。', no=['站木上。', '站云上。', '飞上天。', '在喝汤。'], subj='rabbit'),
    dict(pre='小黄狗', ok='在喝水。', no=['飞上天。', '在看书。', '在开车。', '站云上。'], subj='dog'),
    dict(pre='小妹妹', ok='坐床上。', no=['站云上。', '坐伞上。', '在吃草。', '在开车。'], subj='@bingo'),
    dict(pre='大黄牛', ok='在吃草。', no=['站木上。', '在喝汤。', '在开车。', '坐车上。'], subj='cow'),
    dict(pre='小金鱼', ok='在杯中。', no=['站木上。', '在看书。', '在开车。', '去山上。'], subj='fish'),
]
ENDPIC4 = {'杯': 'cup', '床': 'bed', '雨': 'rain', '雪': 'snow', '虫': 'insect', '云': 'cloud', '田': 'field', '伞': 'umbrella', '灯': 'lamp', '天': 'sky', '火': 'fire', '牙': 'tooth', '耳': 'ear', '石': 'stone', '日': 'sun', '月': 'moon', '金': 'gold', '山': 'mountain', '水': 'river',
           '地': 'soil', '草': 'grass', '车': 'car', '门': 'door', '木': 'tree', '书': 'book', '饭': 'ricebowl', '汤': 'soup', '米': 'rice'}
# 笔顺小老师 (§6 ②-4): (character, the stroke written first, the other one (1-based, GF 0023-2020 order), the rule, the level it
# comes in). Checked against tests/data/stroke_order.json (codes and where each stroke starts) by tests/test_w4.py
ORDER_RULES = ['先横后竖', '从上到下', '先撇后捺', '从左到右', '先中间后两边', '先外后内', '先进去后关门']
ORDER_PAIRS = [
    ('十', 1, 2, '先横后竖', 1), ('土', 1, 2, '先横后竖', 1), ('木', 1, 2, '先横后竖', 1), ('耳', 1, 2, '先横后竖', 1), ('草', 1, 2, '先横后竖', 1), ('地', 1, 2, '先横后竖', 1),
    ('去', 1, 2, '先横后竖', 1), ('禾', 2, 3, '先横后竖', 1), ('车', 3, 4, '先横后竖', 1), ('米', 3, 4, '先横后竖', 1), ('手', 3, 4, '先横后竖', 1), ('坐', 5, 6, '先横后竖', 1),
    ('林', 1, 2, '先横后竖', 1), ('来', 4, 5, '先横后竖', 1), ('走', 1, 2, '先横后竖', 1), ('在', 4, 5, '先横后竖', 1),
    ('天', 1, 2, '从上到下', 1), ('开', 1, 2, '从上到下', 1), ('云', 1, 2, '从上到下', 1), ('二', 1, 2, '从上到下', 1), ('三', 2, 3, '从上到下', 1), ('上', 2, 3, '从上到下', 1),
    ('羊', 3, 4, '从上到下', 1), ('牛', 2, 3, '从上到下', 1), ('手', 2, 3, '从上到下', 1), ('关', 3, 4, '从上到下', 1), ('耳', 4, 5, '从上到下', 1),
    ('人', 1, 2, '先撇后捺', 2), ('大', 2, 3, '先撇后捺', 2), ('天', 3, 4, '先撇后捺', 2), ('木', 3, 4, '先撇后捺', 2), ('禾', 4, 5, '先撇后捺', 2), ('米', 5, 6, '先撇后捺', 2),
    ('火', 3, 4, '先撇后捺', 2), ('关', 5, 6, '先撇后捺', 2), ('足', 6, 7, '先撇后捺', 2), ('八', 1, 2, '先撇后捺', 2), ('从', 3, 4, '先撇后捺', 2), ('走', 6, 7, '先撇后捺', 2),
    ('川', 1, 2, '从左到右', 2), ('小', 2, 3, '从左到右', 2), ('火', 1, 2, '从左到右', 2), ('坐', 2, 3, '从左到右', 2), ('林', 4, 5, '从左到右', 2), ('从', 2, 3, '从左到右', 2),
    ('小', 1, 2, '先中间后两边', 3), ('水', 1, 2, '先中间后两边', 3), ('少', 1, 2, '先中间后两边', 3), ('山', 1, 2, '先中间后两边', 3), ('光', 1, 2, '先中间后两边', 3),
    ('月', 2, 3, '先外后内', 3), ('目', 2, 3, '先外后内', 3), ('田', 2, 3, '先外后内', 3), ('日', 2, 3, '先外后内', 3), ('肉', 2, 3, '先外后内', 3), ('风', 2, 3, '先外后内', 3),
    ('四', 2, 3, '先外后内', 3), ('白', 3, 4, '先外后内', 3),
    ('日', 3, 4, '先进去后关门', 4), ('目', 4, 5, '先进去后关门', 4), ('田', 4, 5, '先进去后关门', 4), ('四', 4, 5, '先进去后关门', 4), ('白', 4, 5, '先进去后关门', 4),
    ('牛', 2, 4, '先横后竖', 4), ('车', 1, 4, '先横后竖', 4), ('羊', 3, 6, '先横后竖', 4), ('土', 1, 3, '从上到下', 4), ('羊', 3, 5, '从上到下', 4), ('耳', 1, 4, '从上到下', 4),
    ('目', 3, 5, '先进去后关门', 4), ('田', 3, 5, '先进去后关门', 4),
    ('川', 2, 3, '从左到右', 5), ('耳', 2, 3, '从左到右', 5), ('草', 2, 3, '从左到右', 5), ('心', 3, 4, '从左到右', 5), ('坐', 1, 3, '从左到右', 5), ('多', 1, 4, '从上到下', 5),
    ('林', 1, 5, '从左到右', 5), ('竹', 1, 4, '从左到右', 5), ('雪', 5, 7, '从左到右', 5), ('雪', 5, 6, '从上到下', 5),
]
# 送字回家 (§6 ④-4): one kind a character (the disputable ones are left out)
KIND4 = {'天上': '天日月云雨电雪', '地上': '地土山石田草川禾木竹', '动物': '牛羊马鸟鱼虫龙兔狗鸡', '身体': '口目手耳足头牙心', '动作': '坐站飞说听吃喝看走来去', '家人': '爸妈哥姐弟爷奶妹'}
KIND4_LINE = {'天上': '这是天上的', '地上': '这是地上的', '动物': '这是动物', '身体': '这是身体', '动作': '这是动作', '家人': '这是家人'}
KIND4_WORDS = [('金鱼', '动物'), ('小鸟', '动物'), ('小虫', '动物'), ('雪山', '地上'), ('草地', '地上'), ('石头', '地上'), ('大雪', '天上'), ('月牙', '天上'),
               ('手心', '身体'), ('大头', '身体'), ('坐下', '动作'), ('听说', '动作'), ('爷爷', '家人'), ('奶奶', '家人'), ('妹妹', '家人'), ('爸爸', '家人')]
# 用什么来做 (§6 ③-4): the action and the part of the body it is done with; the picture of the action (levels 1 / hint)
BODY4 = [('听', '耳', 'listen'), ('说', '口', 'talk'), ('站', '足', 'stand'), ('看', '目', 'look'), ('吃', '口', 'eat'), ('喝', '口', 'drink'), ('走', '足', 'walk')]
# 跷跷板 (§6 ⑤-4): opposites (both characters known), and the words of level 5
OPP4 = ['大小', '上下', '多少', '开关', '来去', '左右', '前后', '天地']
OPP4_WORDS = [('上山', '下山'), ('开门', '关门'), ('大门', '小门'), ('天上', '地下'), ('左手', '右手')]
# the parent panel's 上课对照 (§1.6): 统编一上 (2024) lesson -> 神笔海 (only data: a real 学而思 syllabus replaces it)
LESSONS4 = [
    ('识字 1 天地人', '① 天 地'), ('识字 2 金木水火土', '① 金 土；① 儿歌卷《金木水火土》'), ('识字 3 口耳目手足、站如松', '② 耳 足；③ 站 坐；③ 儿歌卷《站如松》'),
    ('识字 4 日月山川（图配古字）', '① 川；① 挑战"古字变今字"'), ('语文园地一 书写提示、《咏鹅》', '② 挑战"笔顺小老师"；古诗卷《咏鹅》'),
    ('语文园地二《画》（旧版识字 6）', '③ 听；古诗卷《画》'), ('第三单元 鱼鸭乌鸦', '④ 鱼'), ('第四单元 开雪夜色美、蓝云草原、去年', '⑤ 开 去；④ 雪 草'),
    ('第五单元 秋天、雪地里的小画家、四季', '③ 飞 说；② 牙'), ('语文园地五 男女关正反先后', '⑦ 女；⑤ 关；⑥ 后'), ('识字 5 对韵歌', '④ 对 虫；④ 儿歌卷《对韵歌》'),
    ('识字 6 日月明', '② 心；① 金'), ('识字 7 小书包 / 旧版 大小多少', '⑤ 少 多；⑤ 儿歌卷《大小多少》；⑤ 挑战"跷跷板"'), ('识字 8 升国旗', '⑥ 中'),
    ('课文 影子', '⑥ 前 左 右；⑥ 儿歌卷《影子》；⑥ 挑战"看路牌开车"'), ('课文 两件宝', '② 头'), ('语文园地七 爷奶叔姐妹', '⑦ 爷 奶 妹；⑦ 儿歌卷《一家人》'),
    ('字词句子', '⑦ 子'),
]
# §9.3: look-alikes (only known ones are ever offered), characters that hold the answer, and pairs too close in meaning
LOOK4 = {'天': '大开', '地': '他', '土': '上', '川': '三小', '耳': '目', '足': '走是', '心': '小', '飞': '风', '听': '吃', '雪': '雨', '虫': '中电', '少': '小',
         '开': '天关', '关': '开天', '去': '云', '左': '右在', '右': '左有石', '中': '虫', '爷': '爸', '奶': '妈', '妹': '姐妈', '子': '了'}
LOOK4_BACK = {'大': '天', '上': '土', '小': '少', '风': '飞', '雨': '雪', '云': '去', '在': '左', '有': '右', '石': '右', '了': '子', '走': '足', '是': '足', '目': '耳',
              '爸': '爷', '妈': '奶妹', '姐': '妹', '电': '虫', '吃': '听', '他': '地'}
HOLDS4 = {'大': '天', '土': '地在坐去', '口': '足听中右后', '人': '坐金', '小': '少', '日': '草', '雨': '雪', '中': '虫', '天': '关', '女': '奶妹妈姐', '田': '鱼'}
SAMEPIC4 = {'川': '水', '水': '川'}
# what the new characters do when they come alive after writing (§6 写字): kinds of src/games.js ZX.alive
# (each checked against its meaning, 2026-10-18: 左 slides left, 右 right; 前 comes towards the child, 后 and 去 go away; 坐 goes down,
# 站 stands up; 开 opens big, 关 closes small; 雪 falls; 天 rises)
MOTION4 = {'sky': 'up', 'soil': 'hop', 'ear': 'sway', 'head': 'sway', 'sit': 'down', 'stand': 'up', 'plane': 'fly', 'insect': 'fly', 'check': 'grow',
           'chest_open': 'grow', 'chest_shut': 'shrink', 'leftsign': 'left', 'rightsign': 'right', 'front': 'grow', 'back': 'shrink', 'girl': 'sway', 'baby': 'sway',
           'earth': 'spin', 'gold': 'grow', 'river': 'sway', 'snow': 'down', 'grass': 'sway', 'goaway': 'shrink', 'heart': 'grow', 'tooth': 'hop', 'foot': 'hop',
           'talk': 'sway', 'listen': 'sway', 'grandma': 'sway', 'middle': 'hop', 'many': 'hop', 'few': 'hop'}
for _o in ('sky earth gold soil river ear foot head tooth heart sit stand plane talk listen check snow grass chest_open chest_shut goaway leftsign grandma girl baby '
           'mat rat man cap wig fig rug mug jug hop hen net run door_open goose mole').split():
    OBJ.setdefault(_o, 'see tools/w4_batches.py')
for _o in 'many few middle front back rightsign tincan jet bun'.split():
    OBJ.setdefault(_o, 'composed by tools/compose_w4.py / copied from 点点岛')

# ================================================================ 神笔海 ⑧ 复仇者·英雄训练场 and ⑨ 变形金刚·汽车人工厂 (docs/W4-DESIGN.md
# §12, client 2026-10-19: every world has all nine character families). Package 0 of ⑧⑨ writes ALL their data here; the island
# files (src/w4/avengers4.js, robot4.js) only read it (W4D, tools/build.py). Checked by tools/check_w4x.py (one order a story,
# the stroke families, only taught characters, <= 8 characters a card / line).
W4 += [
    dict(id='avengers4', name='英雄训练场', host='spiderman', crew=['spiderman', 'miles', 'ironman', 'hulk'], color='#D63B2F', color2='#2E6FD8', hi='蜘蛛侠来啦！', base=2, write='好力',
         chars=[('好', '好，你好的好！', 'thumbsup', 'good'), ('力', '力，大力的力！', '@hulk', 'strong'), ('出', '出，出来的出！', 'mouseout', 'out'),
                ('王', '王，国王的王！', 'crown', 'king'), ('高', '高，高楼的高！', 'tower', 'tall')], letters=[]),
    dict(id='robot4', name='汽车人工厂', host='optimus', crew=['optimus', 'bumblebee'], color='#FFC93C', color2='#2E6FD8', hi='变形，出发！', base=2, write='工厂',
         chars=[('变', '变，变形的变！', 'change', 'change'), ('能', '能，能量的能！', 'cube', 'energy'), ('工', '工，工具的工！', 'toolbox', 'tool'),
                ('厂', '厂，工厂的厂！', 'factory', 'factory'), ('路', '路，马路的路！', 'road', 'road')], letters=[]),
]
NOWRITE4 += '出王高变能路'                     # §12.3: read, not written (⑧ writes 好 力, ⑨ 工 厂)
CASTS4.update({'avengers4': ['spiderman', 'hulk'], 'robot4': ['optimus', 'bumblebee']})
AMB4.update({'avengers4': 'city', 'robot4': 'city'})
SKIN4.update({'avengers4': 'avengers', 'robot4': 'avengers'})
FALLBACK4.update({'isl/avengers4': 'isl/s1', 'isl/robot4': 'isl/robot',
                  'avengers4': ('s1_find', 's1_write', 's2_abc', 's2_quiz'), 'robot4': ('robot_find', 'robot_write', 'robot2_abc', 'robot2_quiz')})
# §12.3: look-alikes (only known ones are ever offered), the characters that hold the answer, pictures too close
LOOK4.update({'王': '土三玉', '工': '土干', '厂': '广', '力': '九', '出': '山', '好': '女妈', '路': '跳', '变': '亦'})
LOOK4['土'] += '工'                            # (土 -> 王 is a holder below: 王 = 土 + 横, never offered for 土)
LOOK4_BACK.update({'三': '王', '九': '力', '山': '出'})
HOLDS4['女'] += '好'; HOLDS4['口'] += '高路'; HOLDS4['土'] += '王'
HOLDS4.update({'子': '好', '工': '左红', '足': '路', '月': '能'})      # (足 路, 月 能, 工 红: the design is silent - the same rule)
SAMEPIC4.update({'变': '车', '车': '变', '好': '手', '手': '好'})       # the 变 picture has a little car in it; 好 is a hand (thumbs up)
MOTION4.update({'thumbsup': 'hop', 'mouseout': 'up', 'crown': 'grow', 'tower': 'up', 'change': 'spin', 'cube': 'grow', 'toolbox': 'hop', 'factory': 'grow', 'road': 'sway'})
for _o in 'thumbsup mouseout crown tower toolbox factory road yellowcar jump'.split():
    OBJ.setdefault(_o, 'see tools/w4_batches.py')
for _o in 'change cube pumpkin turtle carrot watermelon helicopter donut tomato sandwich'.split():
    OBJ.setdefault(_o, 'composed by tools/compose_w4.py (change) / copied from 点点岛 or assets/props (the rest)')

# ⑧-1 圈字 (char-in-sentence, §12.5): (the character to find, the sentence, the two-character word it is in or ''). The character
# is in its sentence exactly once; any other character that is in a sentence once may be asked there too (a review). A sentence
# is asked only when the child knows all its characters (W4X.knowsAll); 5-8 characters (punctuation is not a character)
SENT8 = [
    ('王', '王坐车去山上。', ''), ('王', '王说：开大门！', ''), ('王', '王去土山上。', ''), ('王', '大王坐下，牛去田中。', '大王'),
    ('王', '大王出门，去土山上。', '大王'), ('王', '大王坐车上山。', '大王'), ('王', '王有三头牛。', ''), ('王', '王坐在土地上。', ''),
    ('出', '鱼出水，鸟上天。', ''), ('出', '牛出门，去田中。', '出门'), ('出', '爷爷出门去山上。', '出门'), ('出', '妹妹出门去山上。', '出门'),
    ('出', '车出大门，上山去。', ''), ('出', '小马出门了。', '出门'), ('出', '日出，山上白了。', '日出'), ('出', '王出门，去山中。', '出门'),
    ('出', '小草出土了。', ''),
    ('高', '山好高！鸟飞上天。', ''), ('高', '高山上有雪。', '高山'), ('高', '天好高，山好大。', ''), ('高', '鸟飞上高山。', '高山'),
    ('高', '爷爷站高山上。', '高山'), ('高', '大马高，小马小。', ''), ('高', '王坐在高山上。', '高山'),
    ('好', '天好大，山高。', ''), ('好', '好大力！王坐下。', ''), ('好', '女子去山上，好高！', ''), ('好', '田中牛马好多。', ''),
    ('好', '妈妈说：你好！', '你好'), ('好', '女子说：你好，大王！', '你好'), ('好', '妹妹坐好，车开了。', '坐好'), ('好', '下雪了，好大的雪！', ''),
    ('力', '好大力！王坐下。', '大力'), ('力', '大牛好有力！', '有力'), ('力', '大力王坐车上山。', '大力'), ('力', '小马有力，去山上。', '有力'),
    ('力', '爷爷力大，开大门。', ''), ('力', '九头牛好有力！', '有力'), ('力', '力大的牛去田中。', ''), ('力', '大力王出门了。', '大力'),
]


# ⑧-4 故事排排队 (story-order, §12.5): every story has ONE possible order - each sentence can only happen after the one before
# it (`why` says why, checked one by one at the review); a little picture a sentence (level 1's strip, the explanation).
# think: the link has to be thought out (level 3 / 5); 3 or 4 sentences (levels 1-3 / 4-5). Asked only when every character
# is known; <= 8 characters a card. tools/check_w4x.py: the links make a chain (exactly one order), the characters, the lengths
def opened(o): return [('door_open', .62, .52, .6), (o, .26, .62, .46)]            # X 开门: beside the open door
def goes_out(o): return [('door_open', .24, .5, .5), (o, .72, .64, .44)]          # X 出门: out, walking away from it
def at_field(o): return [('field', .5, .64, .86), (o, .5, .46, .42)]
def at_grass(o): return [('grass', .5, .72, .66), (o, .5, .42, .44)]
def by_car(o): return [(o, .28, .6, .48), ('car', .72, .66, .42)]
def car_up(): return [('mountain', .62, .42, .62), ('car', .26, .74, .34)]
STORY8 = [
    # only 晨光海 + 神笔海 characters (+ ⑧'s own)
    dict(s=['门开。', '牛出门。', '牛去田中。'], pic=[alone('door_open'), goes_out('cow'), at_field('cow')],
         why=['', '门开了，牛才能出门', '出了门，牛才能去田里'], think=0),
    dict(s=['爷爷开门。', '爷爷出门。', '爷爷去山上。'], pic=[opened('@grandpa'), goes_out('@grandpa'), on('@grandpa', 'mountain')],
         why=['', '门开了才能出门', '出了门才能去山上'], think=0),
    dict(s=['妹妹开门。', '妹妹出门。', '妹妹去草地。'], pic=[opened('@bingo'), goes_out('@bingo'), at_grass('@bingo')],
         why=['', '门开了才能出门', '出了门才能去草地'], think=0),
    dict(s=['奶奶开门。', '奶奶出门。', '奶奶坐上车。'], pic=[opened('grandma'), goes_out('grandma'), by_car('grandma')],
         why=['', '门开了才能出门', '车在门外：出了门才能坐上车'], think=0),
    dict(s=['爷爷出门。', '爷爷坐上车。', '爷爷坐车去山上。'], pic=[goes_out('@grandpa'), by_car('@grandpa'), car_up()],
         why=['', '车在门外：出了门才能坐上车', '坐上车才能坐车去山上'], think=0),
    dict(s=['妹妹说：开门！', '门开。', '妹妹出门。'], pic=[[('@bingo', .28, .6, .5), ('door', .7, .52, .6)], alone('door_open'), goes_out('@bingo')],
         why=['', '她说了"开门"，门才开（门开着时不用说）', '门开了才能出门'], think=1),
    dict(s=['爷爷开大门。', '车出大门。', '车去山下。'], pic=[opened('@grandpa'), goes_out('car'), under('car', 'mountain')],
         why=['', '大门开了，车才能出大门', '出了大门，车才能去山下'], think=1),
    dict(s=['奶奶开门。', '小马出门。', '小马去草地。'], pic=[opened('grandma'), goes_out('horse'), at_grass('horse')],
         why=['', '奶奶开了门，小马才能出门', '出了门才能去草地'], think=1),
    dict(s=['爷爷开门。', '爷爷出门。', '爷爷坐上车。', '爷爷坐车去山上。'], pic=[opened('@grandpa'), goes_out('@grandpa'), by_car('@grandpa'), car_up()],
         why=['', '门开了才能出门', '车在门外：出了门才能坐上车', '坐上车才能坐车去山上'], think=0),
    dict(s=['妹妹开门。', '妹妹出门。', '妹妹坐上车。', '妹妹坐车去草地。'], pic=[opened('@bingo'), goes_out('@bingo'), by_car('@bingo'), [('grass', .7, .74, .5), ('car', .32, .66, .4)]],
         why=['', '门开了才能出门', '车在门外：出了门才能坐上车', '坐上车才能坐车去草地'], think=0),
    dict(s=['妹妹说：开门！', '门开。', '妹妹出门。', '妹妹去山上。'], pic=[[('@bingo', .28, .6, .5), ('door', .7, .52, .6)], alone('door_open'), goes_out('@bingo'), on('@bingo', 'mountain')],
         why=['', '她说了"开门"，门才开', '门开了才能出门', '出了门才能去山上'], think=1),
    dict(s=['妹妹说：开门！', '爷爷开门。', '妹妹出门。', '妹妹去草地。'], pic=[[('@bingo', .28, .6, .5), ('door', .7, .52, .6)], opened('@grandpa'), goes_out('@bingo'), at_grass('@bingo')],
         why=['', '妹妹说了，爷爷才去开门', '门开了妹妹才能出门', '出了门才能去草地'], think=1),
    # with characters of 星光海 / 彩虹海 (asked only once the child knows them)
    dict(s=['天下雪了。', '山上白了。', '我去看雪山。'], pic=[alone('snow'), on('snow', 'mountain'), [('look', .3, .62, .56), ('mountain', .72, .44, .5), ('snow', .72, .2, .2)]],
         why=['', '下了雪，山上才白', '山上白了，才有雪山可看'], think=1),
    dict(s=['云来了。', '下雨了。', '地上有水了。'], pic=[alone('cloud'), alone('rain'), alone('water')],
         why=['', '云来了才下雨', '下了雨，地上才有水'], think=1),
    dict(s=['我下床。', '我开门。', '我出门。'], pic=[[('bed', .36, .62, .62), ('stand', .8, .6, .5)], opened('stand'), goes_out('walk')],
         why=['', '下了床才能去开门', '门开了才能出门'], think=0),
    dict(s=['门开了。', '小狗出门了。', '小狗在草地上。'], pic=[alone('door_open'), goes_out('dog'), at_grass('dog')],
         why=['', '门开了小狗才能出门', '出了门才能到草地上'], think=0),
    dict(s=['杯中有水。', '我喝水。', '杯中的水少了。'], pic=[alone('cup'), alone('drink'), small('cup')],
         why=['', '杯中有水才能喝', '喝了水，水才少'], think=1),
    dict(s=['饭来了。', '我吃饭。', '饭少了。'], pic=[alone('ricebowl'), alone('eat'), small('ricebowl')],
         why=['', '饭来了才能吃', '吃了饭，饭才少'], think=1),
    dict(s=['鸟来了。', '鸟在木头上。', '鸟飞走了。'], pic=[sky('bird'), on('bird', 'log'), [('log', .5, .74, .5), ('bird', .8, .2, .2)]],
         why=['', '鸟来了才能在木头上', '在木头上才能从那里飞走'], think=1),
    dict(s=['爸爸开车门。', '我坐上车。', '车开走了。'], pic=[by_car('@daddy_pig'), by_car('sit'), [('car', .78, .62, .3)]],
         why=['', '车门开了我才能坐上车', '我坐上了车，车才开走（车走了就坐不上了）'], think=1),
    dict(s=['我开门。', '我出门。', '我坐上车。', '车开走了。'], pic=[opened('stand'), goes_out('walk'), by_car('sit'), [('car', .78, .62, .3)]],
         why=['', '门开了才能出门', '车在门外：出了门才能坐上车', '我坐上了车，车才开走'], think=0),
    dict(s=['我下床。', '我开门。', '我出门。', '我去山上。'], pic=[[('bed', .36, .62, .62), ('stand', .8, .6, .5)], opened('stand'), goes_out('walk'), on('walk', 'mountain')],
         why=['', '下了床才能去开门', '门开了才能出门', '出了门才能去山上'], think=0),
    dict(s=['天下雪了。', '山上白了。', '我出门看雪山。', '我去雪山上。'], pic=[alone('snow'), on('snow', 'mountain'), [('look', .3, .62, .56), ('mountain', .72, .44, .5), ('snow', .72, .2, .2)], on('walk', 'mountain')],
         why=['', '下了雪，山上才白', '山上白了才有雪山看', '出了门才能去雪山上（在山上就不用再出门）'], think=1),
    dict(s=['妈妈说：下床了！', '我下床。', '我开门。', '我出门。'], pic=[[('@mummy_pig', .28, .58, .56), ('bed', .72, .64, .5)], [('bed', .36, .62, .62), ('stand', .8, .6, .5)], opened('stand'), goes_out('walk')],
         why=['', '妈妈叫了，我才下床', '下了床才能去开门', '门开了才能出门'], think=1),
]

# ⑧-3 拍拍节拍 (count-the-beats, §12.5, RF.K.2b): every word has a picture and two recordings - normal, and slow ('~' + word:
# tools/voice_bank.py records a line that begins with '~' at a slow rate, without the '~'). (word, picture, syllables)
BEATS8 = [(w, p, s) for w, p, s in [
    ('cat', 'cat', 'cat'), ('dog', 'dog', 'dog'), ('sun', 'sun', 'sun'), ('bus', 'bus', 'bus'), ('cup', 'cup', 'cup'), ('hat', 'hat', 'hat'),
    ('box', 'box', 'box'), ('pig', 'pig', 'pig'), ('fox', 'fox', 'fox'), ('bat', 'bat', 'bat'), ('fan', 'fan', 'fan'), ('map', 'map', 'map'),
    ('bug', 'insect', 'bug'), ('jet', 'jet', 'jet'), ('egg', 'egg', 'egg'), ('ball', 'ball', 'ball'), ('kite', 'kite', 'kite'), ('fish', 'fish', 'fish'),
    ('juice', 'juice', 'juice'),
    ('apple', 'apple', 'ap-ple'), ('rabbit', 'rabbit', 'rab-bit'), ('zebra', 'zebra', 'ze-bra'), ('lion', 'lion', 'li-on'), ('orange', 'orange', 'or-ange'),
    ('window', 'window', 'win-dow'), ('jacket', 'jacket', 'jack-et'), ('insect', 'insect', 'in-sect'), ('yogurt', 'yogurt', 'yo-gurt'),
    ('pumpkin', 'pumpkin', 'pump-kin'), ('turtle', 'turtle', 'tur-tle'), ('carrot', 'carrot', 'car-rot'), ('donut', 'donut', 'do-nut'),
    ('sandwich', 'sandwich', 'sand-wich'),
    ('banana', 'banana', 'ba-na-na'), ('elephant', 'elephant', 'el-e-phant'), ('umbrella', 'umbrella', 'um-brel-la'), ('unicorn', 'unicorn', 'u-ni-corn'),
    ('strawberry', 'strawberry', 'straw-ber-ry'), ('xylophone', 'xylophone', 'xy-lo-phone'), ('tomato', 'tomato', 'to-ma-to'),
    ('watermelon', 'watermelon', 'wa-ter-mel-on'), ('helicopter', 'helicopter', 'hel-i-cop-ter')]]
# level 5: two words (the picture shows the colour / the size): (phrase, syllables, picture)
BEATS8_PHRASES = [
    ('big banana', 'big-ba-na-na', big('banana')), ('red apple', 'red-ap-ple', alone('apple')), ('little cat', 'lit-tle-cat', small('cat')),
    ('big dog', 'big-dog', big('dog')), ('yellow bus', 'yel-low-bus', alone('bus')), ('blue cup', 'blue-cup', alone('cup')),
    ('little fish', 'lit-tle-fish', small('fish')), ('big elephant', 'big-el-e-phant', big('elephant')), ('little rabbit', 'lit-tle-rab-bit', small('rabbit')),
    ('big pumpkin', 'big-pump-kin', big('pumpkin')), ('red strawberry', 'red-straw-ber-ry', alone('strawberry')), ('little pig', 'lit-tle-pig', small('pig')),
    ('red tomato', 'red-to-ma-to', alone('tomato')), ('big lion', 'big-li-on', big('lion')), ('little turtle', 'lit-tle-tur-tle', small('turtle')),
]
# §12.7: the new sight words (Dolch pre-primer words not met yet)
SIGHT9 = 'jump help to find make funny where away'.split()
# ⑨-3 拼出一句话 (build-the-sentence, §12.5): known words only (WORDS3 / WORDS4 / SIGHT4 / SIGHT9, a plural s), ONE possible order
# (no two nouns that could swap - "the cat is on the box" / "the box is on the cat" is left out; the end mark is the last cell,
# fixed, so a question order is never a statement); (sentence, picture, extra): extra = level 5's card that belongs nowhere
# (it cannot take the place of any word: never "a" for "the", never "little" for "big")
ESENT9 = [
    ('I can run.', alone('run'), ''), ('I can jump.', alone('jump'), ''), ('We can play.', pair('jump', 'girl', .56, .56), ''),
    ('You can jump.', alone('jump'), ''), ('Look at me!', alone('stand'), ''), ('Help me up!', pair('sit', 'man', .5, .6), ''),
    ('I see you.', pair('look', 'girl', .56, .56), ''), ('Help the dog!', alone('dog'), ''), ('Find the bug.', [('look', .3, .6, .56), ('insect', .76, .7, .22)], ''),
    ('Make a hat.', alone('hat'), ''),
    ('I see the sun.', [('look', .3, .62, .56), ('sun', .78, .2, .3)], ''), ('The sun is up.', on('sun', 'mountain'), ''), ('The man can jump.', alone('man'), ''),
    ('My dog can jump.', alone('dog'), ''), ('I go to bed.', pair('walk', 'bed', .56, .5), ''), ('Find my blue cap.', alone('cap'), ''),
    ('Look at the jet.', [('look', .3, .62, .56), ('jet', .72, .3, .44)], ''), ('The fox is funny.', alone('fox'), ''), ('Where is my mug?', under('mug', 'bed'), ''),
    ('I can help you.', pair('stand', 'girl', .56, .56), ''), ('My cat can jump.', alone('cat'), ''), ('I see two cats.', many('cat', 2), ''),
    ('The cup is blue.', alone('cup'), ''),
    ('It is a big box.', big('box'), 'run'), ('I can see a jet.', [('look', .28, .62, .56), ('jet', .72, .34, .5)], 'up'),
    ('I can find the cat.', [('look', .3, .62, .56), ('cat', .75, .64, .36)], 'is'), ('We can make a map.', pair('stand', 'map', .56, .44), 'red'),
    ('Where is the red hat?', under('hat', 'bed'), 'can'), ('Look at the funny pig.', alone('pig'), 'is'), ('The funny dog can run.', alone('dog'), 'at'),
    ('The man can help me.', pair('man', 'sit', .6, .5), 'big'), ('The hen can run away.', alone('hen'), 'to'), ('Where is the funny cat?', under('cat', 'bed'), 'run'),
    ('I can find my hat.', [('look', .3, .62, .56), ('hat', .75, .66, .34)], 'is'), ('The big dog can jump.', big('dog'), 'at'),
    ('I see a big dog.', [('look', .28, .62, .5), ('dog', .72, .6, .56)], 'can'),
]
# ⑨-4 加一笔，变一变 (add-one-stroke): the pairs are the writing modes' STROKE_FAMILIES['grow'] with ONE stroke more (below; the
# stroke indices come from tools/write_pairs.py into W4D.add1 at build time) - never a second table. Every B an A can become
# is in it, so the game offers exactly one of them.
# 读一读 (§12.8): six more sentences, asked once their characters are known
READ4 += [
    ('王坐下。', [('sit', .5, .62, .7), ('crown', .5, .19, .22)], [[('stand', .5, .6, .7), ('crown', .5, .17, .22)], alone('sit'), alone('crown'), [('sit', .5, .62, .7), ('hat', .5, .2, .22)]]),
    ('鱼出水。', [('water', .5, .78, .56), ('fish', .5, .32, .42)], [water('fish'), sky('bird'), [('water', .5, .78, .56), ('duck', .5, .4, .4)], ground('fish')]),
    ('山好高。', alone('mountain', .92), [small('mountain'), alone('river'), alone('field'), alone('stone')]),
    ('车上路。', [('road', .5, .6, .92), ('car', .5, .5, .32)], [[('road', .5, .6, .92), ('cow', .5, .5, .32)], [('grass', .5, .7, .8), ('car', .5, .46, .32)], [('field', .5, .62, .9), ('car', .5, .5, .32)], alone('road', .9)]),
    ('车出厂。', [('factory', .3, .5, .56), ('car', .76, .68, .34)], [[('factory', .3, .5, .56), ('cow', .76, .68, .34)], [('house', .3, .5, .56), ('car', .76, .68, .34)], alone('factory'), goes_out('car')]),
    ('牛有力。', [('cow', .34, .6, .52), ('log', .76, .7, .4)], [[('sheep', .34, .6, .5), ('log', .76, .7, .4)], [('dog', .34, .62, .48), ('log', .76, .7, .4)], alone('fish'), [('bird', .34, .5, .36), ('log', .76, .7, .4)]]),
]
# 儿歌卷 (§12.8): one an island, after its flag; read together
SCROLLS4 += [
    dict(id='r8', kind='rhyme', title='好朋友', after='avengers4', pic=[('@spiderman', .3, .55, .5), ('@hulk', .72, .58, .56)],
         lines=['我有大力，', '你会高飞。', '大家一起，', '好朋友！']),
    dict(id='r9', kind='rhyme', title='小汽车', after='robot4', pic=[('factory', .3, .46, .48), ('car', .72, .68, .36)],
         lines=['工厂里，', '变变变。', '小汽车，', '上马路。', '嘀嘀嘀，', '出发喽！']),
]
# the parent panel's 上课对照: four more rows - tools/build.py adds them once ⑧ / ⑨ is live (the island is the third field)
LESSONS4_89 = [('第二单元 大马路土', '⑨ 路', 'robot4'), ('语文园地六 工厂', '⑨ 工 厂；⑨ 儿歌卷《小汽车》', 'robot4'),
               ('第七单元 影子 / 两件宝', '⑧ 好；⑨ 能；⑧ 儿歌卷《好朋友》', 'avengers4'), ('第八单元', '⑧ 出 高', 'avengers4')]
WORLDS.append(('w4', '神笔海', W4))

# ---------------------------------------------------------------- the character families (docs/WRITE-MODES.md, client 2026-10-18:
# "use the characters he knows to teach new ones"). Chosen for a 4-year-old's "aha", and every one checked against the stroke
# data by tools/write_pairs.py (tests/test_writemodes.py): never true by hand.
#   grow (A, B): B is A plus one or two strokes - all of A's strokes are in B, in A's order, each of the same stroke name and the
#                same shape (人 + 横 = 大; 口 + 横 = 日). The writing mode 加一笔变新字 and 像不像 (日 / 目) use them.
#   part (B, A, C): B's strokes are A's, then C's, each block the shape of that character; a left part may write its last 捺 as
#                a 点 (木 in 林), as the standard does. The writing mode 部件拼字 uses them.
# A pair whose characters are not in the app yet waits ("pending" in the script) and is checked the day they come.
# 小 -> 少 is NOT one: 小 begins with 竖钩, 少 with 竖 (the hook goes) - not literally 小 plus strokes.
STROKE_FAMILIES = {
    'grow': [('一', '二'), ('二', '三'), ('一', '十'), ('十', '土'), ('二', '土'), ('人', '大'), ('大', '天'), ('人', '火'), ('人', '从'),
             ('天', '关'), ('口', '日'), ('日', '目'), ('日', '田'), ('口', '田'), ('日', '白'), ('日', '电'), ('口', '中'), ('中', '虫'),
             ('口', '石'), ('口', '右'), ('口', '四'), ('口', '叶'), ('十', '木'), ('木', '本'), ('木', '禾'), ('木', '米'), ('米', '来'),
             ('木', '休'), ('了', '子'), ('下', '不'), ('左', '在'), ('土', '去'), ('云', '去'), ('勺', '鸟'), ('鸟', '鸡'), ('二', '开'),
             ('三', '王'), ('土', '王'), ('工', '王'), ('二', '工')],
    'part': [('明', '日', '月'), ('林', '木', '木'), ('从', '人', '人'), ('杯', '木', '不'), ('叶', '口', '十'), ('果', '日', '木'),
             ('木', '十', '人'), ('天', '二', '人'), ('的', '白', '勺'), ('妈', '女', '马'), ('坐', '从', '土'), ('好', '女', '子')],
}

LETTER_NAME = {c: c for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'}


def islands():
    for wid, wname, isl in WORLDS:
        for i, d in enumerate(isl):
            yield wid, i, d


def all_objects():
    out = []
    for _, _, d in islands():
        for c in d['chars']:
            if c[2] and c[2][0] != '@' and not c[2].startswith('num'): out.append(c[2])
        for l in d['letters']:
            out.append(l[2])
    out += [o for _, o in CVC] + [w[2] for w in WORDS2]
    seen, res = set(), []
    for o in out:
        if o not in seen:
            seen.add(o); res.append(o)
    return res


if __name__ == '__main__':
    objs = all_objects()
    miss = [o for o in objs if o not in OBJ]
    print('objects', len(objs), 'missing descriptions', miss)
    lines = [c[1] for _, _, d in islands() for c in d['chars']]
    print('longest naming line', max(len(x) for x in lines), [x for x in lines if len(x) > 8])
