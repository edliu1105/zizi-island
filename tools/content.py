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
    dict(id='b3', title='十本书', after='thor3', pages=[
        ('我有一本书。', withn('book', 1)), ('你有三本书。', withn('book', 3)), ('他有五本书。', withn('book', 5)),
        ('这是七本书。', many('book', 7)), ('八本书在床上。', [('bed', .5, .7, .78)] + [(o, x, round(y - .16, 3), round(k * .7, 3)) for o, x, y, k in many('book', 8)]),
        ('我有十本书！', withn('book', 10))]),
    dict(id='b4', title='红车白云', after='panther3', pages=[
        ('车是红的。', alone('car')), ('鸟是蓝的。', alone('bird')), ('叶是绿的。', alone('leaf')),
        ('鸡是黄的。', alone('chicken')), ('云是白的。', alone('cloud')), ('花是红的！', tint(alone('flower'), 'hue-rotate(-24deg) saturate(1.8)'))]),
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
