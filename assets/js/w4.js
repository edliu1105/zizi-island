/* 字字岛 · 神笔海 (world 4, docs/W4-DESIGN.md): the lazily loaded part - built by tools/build.py from tools/content.py and src/w4/*.js; do not edit. */
'use strict';
const W4D = {"read":[["鱼在水中。",[["river",0.5,0.55,0.94],["fish",0.5,0.5,0.42]],[[["mountain",0.5,0.66,0.6],["fish",0.5,0.24,0.3]],[["river",0.5,0.55,0.94],["bird",0.5,0.5,0.42]],[["tree",0.5,0.66,0.6],["fish",0.5,0.24,0.3]],[["car",0.5,0.66,0.6],["fish",0.5,0.24,0.3]]]],["鸟飞上天。",[["sky",0.5,0.5,0.96],["bird",0.5,0.4,0.42]],[[["soil",0.5,0.76,0.62],["bird",0.5,0.42,0.46]],[["sky",0.5,0.5,0.96],["fish",0.5,0.4,0.42]],[["sky",0.5,0.5,0.96],["cow",0.5,0.4,0.42]],[["river",0.5,0.55,0.94],["bird",0.5,0.5,0.42]]]],["山上有雪。",[["mountain",0.5,0.66,0.6],["snow",0.5,0.24,0.3]],[[["mountain",0.5,0.4,0.6],["snow",0.5,0.84,0.28]],[["mountain",0.5,0.66,0.6],["fire",0.5,0.24,0.3]],[["car",0.5,0.66,0.6],["snow",0.5,0.24,0.3]],[["mountain",0.5,0.66,0.6],["grass",0.5,0.24,0.3]]]],["地上有草。",[["soil",0.5,0.76,0.62],["grass",0.5,0.42,0.46]],[[["sky",0.5,0.5,0.96],["grass",0.5,0.4,0.42]],[["soil",0.5,0.76,0.62],["snow",0.5,0.42,0.46]],[["soil",0.5,0.76,0.62],["fire",0.5,0.42,0.46]],[["soil",0.5,0.76,0.62],["fish",0.5,0.42,0.46]]]],["小虫在草上。",[["grass",0.5,0.66,0.6],["insect",0.5,0.24,0.3]],[[["cup",0.5,0.66,0.6],["insect",0.5,0.24,0.3]],[["grass",0.5,0.66,0.6],["bird",0.5,0.24,0.3]],[["snow",0.5,0.66,0.6],["insect",0.5,0.24,0.3]],[["door",0.5,0.66,0.6],["insect",0.5,0.24,0.3]]]],["牛在左，马在右。",[["cow",0.28,0.58,0.5],["horse",0.72,0.6,0.5]],[[["horse",0.28,0.58,0.5],["cow",0.72,0.6,0.5]],[["cow",0.28,0.58,0.5],["cow",0.72,0.6,0.5]],[["sheep",0.28,0.58,0.5],["horse",0.72,0.6,0.5]],[["cow",0.28,0.58,0.5],["sheep",0.72,0.6,0.5]]]],["我坐下。",[["sit",0.5,0.55,0.8]],[[["stand",0.5,0.55,0.8]],[["walk",0.5,0.55,0.8]],[["talk",0.5,0.55,0.8]],[["listen",0.5,0.55,0.8]]]],["我站在门口。",[["stand",0.32,0.6,0.62],["door",0.74,0.54,0.5]],[[["sit",0.32,0.66,0.5],["door",0.74,0.54,0.5]],[["stand",0.32,0.6,0.62],["car",0.74,0.62,0.44]],[["walk",0.32,0.6,0.62],["door",0.74,0.54,0.5]],[["stand",0.32,0.6,0.62],["mountain",0.74,0.5,0.5]]]],["我去山上。",[["goaway",0.3,0.62,0.6],["mountain",0.72,0.42,0.5]],[[["come",0.3,0.62,0.6],["mountain",0.72,0.42,0.5]],[["goaway",0.3,0.62,0.6],["water",0.72,0.5,0.44]],[["sit",0.5,0.74,0.44],["mountain",0.5,0.34,0.56]],[["look",0.3,0.62,0.6],["mountain",0.72,0.42,0.5]]]],["门开了。",[["door_open",0.5,0.55,0.7]],[[["door",0.5,0.55,0.7]],[["chest_open",0.5,0.55,0.7]],[["umbrella",0.5,0.55,0.7]],[["lamp",0.5,0.55,0.7]]]],["门关了。",[["door",0.5,0.55,0.7]],[[["door_open",0.5,0.55,0.7]],[["chest_shut",0.5,0.55,0.7]],[["umbrella",0.5,0.55,0.7]],[["car",0.5,0.55,0.7]]]],["鸟多，鱼少。",[["bird",0.15,0.35,0.18],["bird",0.39,0.35,0.18],["bird",0.15,0.55,0.18],["bird",0.39,0.55,0.18],["bird",0.15,0.75,0.18],["fish",0.73,0.45,0.24],["fish",0.73,0.65,0.24]],[[["bird",0.27,0.45,0.24],["bird",0.27,0.65,0.24],["fish",0.61,0.35,0.18],["fish",0.85,0.35,0.18],["fish",0.61,0.55,0.18],["fish",0.85,0.55,0.18],["fish",0.61,0.75,0.18]],[["bird",0.15,0.45,0.18],["bird",0.39,0.45,0.18],["bird",0.15,0.65,0.18],["fish",0.61,0.45,0.18],["fish",0.85,0.45,0.18],["fish",0.61,0.65,0.18]],[["bird",0.15,0.35,0.18],["bird",0.39,0.35,0.18],["bird",0.15,0.55,0.18],["bird",0.39,0.55,0.18],["bird",0.15,0.75,0.18],["cow",0.73,0.45,0.24],["cow",0.73,0.65,0.24]],[["bird",0.27,0.55,0.24],["fish",0.73,0.55,0.24]]]],["妹妹有鱼。",[["@bingo",0.3,0.58,0.7],["fish",0.74,0.64,0.38]],[[["@peppa",0.3,0.58,0.7],["fish",0.74,0.64,0.38]],[["@bingo",0.3,0.58,0.7],["bird",0.74,0.64,0.38]],[["@george",0.3,0.58,0.7],["fish",0.74,0.64,0.38]],[["@bingo",0.3,0.58,0.7],["umbrella",0.74,0.64,0.38]]]],["爷爷有车。",[["@grandpa",0.3,0.58,0.7],["car",0.74,0.64,0.38]],[[["@daddy_pig",0.3,0.58,0.7],["car",0.74,0.64,0.38]],[["@grandpa",0.3,0.58,0.7],["umbrella",0.74,0.64,0.38]],[["@george",0.3,0.58,0.7],["car",0.74,0.64,0.38]],[["@grandpa",0.3,0.58,0.7],["horse",0.74,0.64,0.38]]]]],"books":[{"id":"b7","title":"天上地下","after":"ultra4","cover":[["sky",0.5,0.5,0.96],["sun",0.5,0.4,0.42]],"pages":[["天上有日。",[["sky",0.5,0.5,0.96],["sun",0.5,0.4,0.42]]],["天上有月。",[["sky",0.5,0.5,0.96],["moon",0.5,0.4,0.42]]],["天上有云。",[["sky",0.5,0.5,0.96],["cloud",0.5,0.4,0.5]]],["地上有山。",[["grass",0.5,0.82,0.9],["mountain",0.5,0.44,0.64]]],["地上有水。",[["river",0.5,0.55,0.82]]],["山下有金！",[["mountain",0.5,0.4,0.6],["gold",0.5,0.84,0.28]]]]},{"id":"b8","title":"我的头","after":"peppa4","pages":[["这是我的头。",[["head",0.5,0.55,0.7]]],["这是我的耳。",[["ear",0.5,0.55,0.7]]],["这是我的口。",[["mouth",0.5,0.55,0.7]]],["这是我的牙。",[["tooth",0.5,0.55,0.7]]],["这是我的手。",[["hand",0.5,0.55,0.7]]],["这是我的足！",[["foot",0.5,0.55,0.7]]]]},{"id":"b9","title":"开门关门","after":"huluwa4","pages":[["门开了。",[["door_open",0.5,0.55,0.7]]],["牛来了。",[["door_open",0.3,0.55,0.6],["cow",0.74,0.64,0.4]]],["牛多了。",[["cow",0.198,0.393,0.28],["cow",0.5,0.393,0.28],["cow",0.802,0.393,0.28],["cow",0.349,0.707,0.28],["cow",0.651,0.707,0.28]]],["门关了。",[["door",0.5,0.55,0.7]]],["牛去了。",[["door",0.3,0.55,0.6],["cow",0.76,0.7,0.26]]],["牛少了！",[["cow",0.338,0.55,0.3],["cow",0.662,0.55,0.3]]]]},{"id":"b10","title":"一家人","after":"bluey4","pages":[["这是爷爷。",[["@grandpa",0.5,0.58,0.8]]],["这是奶奶。",[["grandma",0.5,0.55,0.8]]],["这是妹妹。",[["@bingo",0.5,0.58,0.8]]],["爷爷坐下。",[["@grandpa",0.5,0.58,0.8]]],["奶奶坐下。",[["grandma",0.5,0.55,0.8]]],["我们一家人！",[["@grandpa",0.18,0.6,0.5],["grandma",0.4,0.6,0.5],["person",0.62,0.64,0.44],["@bingo",0.83,0.68,0.36]]]]}],"scrolls":[{"id":"r1","kind":"rhyme","title":"金木水火土","after":"ultra4","pic":[["sun",0.28,0.3,0.3],["moon",0.72,0.3,0.3],["mountain",0.5,0.7,0.56]],"lines":["一二三四五，","金木水火土。","天地分上下，","日月照今古。"]},{"id":"r2","kind":"rhyme","title":"五官歌","after":"peppa4","pic":[["head",0.5,0.45,0.6],["heart",0.82,0.78,0.26]],"lines":["头，点点头。","耳，听一听。","牙，白又白。","足，走一走。","心，好开心！"]},{"id":"r3","kind":"rhyme","title":"站如松","after":"pj4","pic":[["stand",0.3,0.55,0.56],["sit",0.72,0.6,0.5]],"lines":["站如松，","坐如钟。","行如风，","卧如弓。"]},{"id":"r4","kind":"rhyme","title":"对韵歌","after":"xiyou4","pic":[["cloud",0.25,0.25,0.3],["rain",0.72,0.25,0.3],["snow",0.25,0.7,0.28],["insect",0.72,0.7,0.26]],"lines":["云对雨，","雪对风。","花对树，","鸟对虫。","山清对水秀，","柳绿对桃红。"]},{"id":"r5","kind":"rhyme","title":"大小多少","after":"huluwa4","pic":[["cow",0.3,0.52,0.46],["duck",0.74,0.6,0.3]],"lines":["一个大，","一个小，","一头黄牛一只猫。","一边多，","一边少，","一群鸭子一只鸟。"]},{"id":"r6","kind":"rhyme","title":"影子","after":"paw4","pic":[["walk",0.38,0.55,0.6],["dog",0.74,0.66,0.34]],"lines":["影子在前，","影子在后，","影子常常跟着我，","就像一条小黑狗。","影子在左，","影子在右，","影子常常陪着我，","它是我的好朋友。"]},{"id":"r7","kind":"rhyme","title":"一家人","after":"bluey4","pic":[["@grandpa",0.16,0.6,0.46],["grandma",0.38,0.6,0.46],["@daddy_pig",0.62,0.6,0.46],["@mummy_pig",0.84,0.6,0.46]],"lines":["爷爷奶奶，","爸爸妈妈，","哥哥姐姐，","弟弟妹妹，","我们是一家。"]},{"id":"p1","kind":"poem","title":"咏鹅","after":"pj4","pic":[["river",0.5,0.6,0.9],["goose",0.5,0.46,0.46]],"lines":["鹅，鹅，鹅，","曲项向天歌。","白毛浮绿水，","红掌拨清波。"]},{"id":"p2","kind":"poem","title":"画","after":"huluwa4","pic":[["mountain",0.3,0.4,0.46],["river",0.7,0.66,0.5],["flower",0.22,0.78,0.26],["bird",0.74,0.28,0.24]],"lines":["远看山有色，","近听水无声。","春去花还在，","人来鸟不惊。"]},{"id":"p3","kind":"poem","title":"静夜思","after":"bluey4","pic":[["bed",0.5,0.7,0.6],["moon",0.72,0.24,0.3]],"lines":["床前明月光，","疑是地上霜。","举头望明月，","低头思故乡。"]}],"scrollKind":{"rhyme":"儿歌卷","poem":"古诗卷"},"words":[["cat","cat",1],["hat","hat",1],["bat","bat",1],["mat","mat",1],["rat","rat",1],["fan","fan",1],["pan","pan",1],["van","van",1],["man","man",1],["can","tincan",1],["map","map",1],["cap","cap",1],["pig","pig",1],["wig","wig",1],["fig","fig",0],["bug","insect",1],["rug","rug",1],["mug","mug",1],["jug","jug",0],["mop","mop",1],["top","top",0],["hop","hop",0],["pen","pen",1],["hen","hen",1],["ten","num10",0],["net","net",0],["jet","jet",1],["sun","sun",1],["bun","bun",1],["run","run",0],["box","box",1],["fox","fox",1],["dog","dog",1],["log","log",1],["bed","bed",1]],"sight":["I","a","the","see","my","is","it","in","on","up","go","can","look","me","we","and","you","big","little","down","come","not","one","two","three","red","blue","yellow","here","said","play","at","under","by"],"bridge":[["big","大","big"],["little","小","small"],["up","上","up"],["down","下","down"],["go","去","goaway"],["come","来","come"],["look","看","look"],["I","我",null],["you","你",null],["is","是",null],["not","不",null],["one","一","num1"],["two","二","num2"],["three","三","num3"],["red","红","strawberry"],["blue","蓝","whale"],["yellow","黄","banana"]],"esent":[["I see.",[["look",0.5,0.55,0.8]]],["I can hop.",[["hop",0.5,0.55,0.7]]],["I can run.",[["run",0.5,0.55,0.7]]],["Look up!",[["look",0.4,0.62,0.66],["sun",0.78,0.2,0.3]]],["A big pig.",[["pig",0.5,0.55,0.86]]],["A red hat.",[["hat",0.5,0.55,0.7]]],["Come and play!",[["come",0.5,0.55,0.8]]],["A little rat.",[["rat",0.5,0.64,0.34]]],["I see a cat.",[["look",0.3,0.6,0.6],["cat",0.75,0.62,0.4]]],["The pig is big.",[["pig",0.5,0.55,0.86]]],["The sun is up.",[["mountain",0.5,0.66,0.6],["sun",0.5,0.24,0.3]]],["My hat is red.",[["hat",0.5,0.55,0.7]]],["Look at the hen.",[["hen",0.5,0.55,0.7]]],["The cup is blue.",[["cup",0.5,0.55,0.7]]],["Here is my cap.",[["cap",0.5,0.55,0.7]]],["I see a big jet.",[["look",0.28,0.62,0.56],["jet",0.72,0.34,0.5]]],["A bug is on the rug.",[["rug",0.5,0.66,0.6],["insect",0.5,0.24,0.3]]],["The cat is on the box.",[["box",0.5,0.66,0.6],["cat",0.5,0.24,0.3]]],["I can see a man.",[["look",0.3,0.62,0.56],["man",0.72,0.6,0.5]]],["It is on the box.",[["box",0.5,0.66,0.6],["fox",0.5,0.24,0.3]]],["Is it a hen?",[["hen",0.5,0.55,0.7]]],["The rat is little.",[["rat",0.5,0.64,0.34]]],["A cat can hop.",[["cat",0.5,0.55,0.7]]],["Go, dog, go!",[["dog",0.5,0.55,0.7]]],["Run, man, run!",[["man",0.5,0.55,0.7]]],["Hop, hop, hop!",[["hop",0.5,0.55,0.7]]],["A pig and a hen.",[["pig",0.28,0.58,0.5],["hen",0.72,0.6,0.5]]],["The cat and the dog.",[["cat",0.28,0.58,0.5],["dog",0.72,0.6,0.5]]],["We can play in the sun.",[["sun",0.5,0.55,0.7]]],["My mug is on the mat.",[["mat",0.5,0.66,0.6],["mug",0.5,0.24,0.3]]],["I see three red hats.",[["hat",0.198,0.55,0.28],["hat",0.5,0.55,0.28],["hat",0.802,0.55,0.28]]],["Look, a fox on a box!",[["box",0.5,0.66,0.6],["fox",0.5,0.24,0.3]]],["The hen is not big.",[["hen",0.5,0.64,0.34]]],["Two cats and a dog.",[["cat",0.2,0.6,0.32],["cat",0.45,0.6,0.32],["dog",0.76,0.6,0.38]]],["Come and see my map.",[["map",0.5,0.55,0.7]]],["The jet is up, up, up!",[["jet",0.5,0.55,0.7]]]],"tf":[{"lv":1,"pic":[["pig",0.5,0.55,0.86]],"s":[["A big pig.",1],["I see a pig.",1],["A little pig.",0],["A blue pig.",0]]},{"lv":1,"pic":[["cat",0.5,0.64,0.34]],"s":[["A little cat.",1],["I see a cat.",1],["A big cat.",0],["A red cat.",0]]},{"lv":1,"pic":[["hat",0.5,0.55,0.7]],"s":[["A red hat.",1],["I see a hat.",1],["A blue hat.",0],["A yellow hat.",0]]},{"lv":1,"pic":[["cup",0.5,0.55,0.7]],"s":[["A blue cup.",1],["I see a cup.",1],["A red cup.",0],["A yellow cup.",0]]},{"lv":1,"pic":[["dog",0.5,0.55,0.86]],"s":[["A big dog.",1],["I see a dog.",1],["A little dog.",0],["A big hen.",0]]},{"lv":2,"pic":[["pig",0.5,0.55,0.86]],"s":[["The pig is big.",1],["It is a pig.",1],["The pig is little.",0],["It is a dog.",0]]},{"lv":2,"pic":[["sun",0.5,0.55,0.7]],"s":[["The sun is yellow.",1],["It is the sun.",1],["The sun is blue.",0],["It is a bun.",0]]},{"lv":2,"pic":[["cup",0.5,0.55,0.7]],"s":[["The cup is blue.",1],["It is a cup.",1],["The cup is red.",0],["It is a cap.",0]]},{"lv":2,"pic":[["hen",0.5,0.64,0.34]],"s":[["The hen is little.",1],["It is a hen.",1],["The hen is big.",0],["It is a pen.",0]]},{"lv":3,"pic":[["cat",0.198,0.55,0.28],["cat",0.5,0.55,0.28],["cat",0.802,0.55,0.28]],"s":[["I see three cats.",1],["I see cats.",1],["I see two cats.",0],["I see one cat.",0]]},{"lv":3,"pic":[["hat",0.338,0.55,0.3],["hat",0.662,0.55,0.3]],"s":[["I see two hats.",1],["I see hats.",1],["I see three hats.",0],["I see one hat.",0]]},{"lv":3,"pic":[["dog",0.5,0.55,0.3]],"s":[["I see one dog.",1],["I see a dog.",1],["I see two dogs.",0],["I see three dogs.",0]]},{"lv":3,"pic":[["cup",0.198,0.55,0.28],["cup",0.5,0.55,0.28],["cup",0.802,0.55,0.28]],"s":[["I see three cups.",1],["I see cups.",1],["I see one cup.",0],["I see two cups.",0]]},{"lv":4,"pic":[["cat",0.5,0.64,0.34]],"s":[["The cat is not big.",1],["It is not a dog.",1],["The cat is not little.",0],["It is not a cat.",0]]},{"lv":4,"pic":[["pig",0.5,0.55,0.86]],"s":[["The pig is not little.",1],["It is not a hen.",1],["The pig is not big.",0],["It is not a pig.",0]]},{"lv":4,"pic":[["hat",0.5,0.55,0.7]],"s":[["The hat is not blue.",1],["It is not a cap.",1],["The hat is not red.",0],["It is not a hat.",0]]},{"lv":4,"pic":[["cup",0.5,0.55,0.7]],"s":[["The cup is not red.",1],["It is not a mug.",1],["The cup is not blue.",0],["It is not a cup.",0]]},{"lv":5,"pic":[["box",0.5,0.66,0.6],["cat",0.5,0.24,0.3]],"s":[["The cat is on the box.",1],["The cat is not in the box.",1],["The cat is in the box.",0],["The cat is under the box.",0]]},{"lv":5,"pic":[["cat",0.28,0.58,0.44],["box",0.72,0.6,0.5]],"s":[["The cat is by the box.",1],["The cat is not on the box.",1],["The cat is on the box.",0],["The cat is in the box.",0]]},{"lv":5,"pic":[["bed",0.5,0.66,0.6],["hat",0.5,0.24,0.3]],"s":[["The hat is on the bed.",1],["The hat is not under the bed.",1],["The hat is under the bed.",0],["The hat is in the box.",0]]},{"lv":5,"pic":[["bed",0.5,0.4,0.6],["dog",0.5,0.84,0.28]],"s":[["The dog is under the bed.",1],["The dog is not on the bed.",1],["The dog is on the bed.",0],["The dog is in the box.",0]]}],"placeThings":[["cat","cat"],["dog","dog"],["hat","hat"],["cup","cup"],["bug","insect"]],"placeSpots":[["in","box"],["on","bed"],["on","box"],["on","mat"],["under","bed"],["by","bed"],["by","box"],["by","mat"]],"place":["The cat is in the box.","The cat is on the bed.","The cat is on the box.","The cat is on the mat.","The cat is under the bed.","The cat is by the bed.","The cat is by the box.","The cat is by the mat.","The dog is in the box.","The dog is on the bed.","The dog is on the box.","The dog is on the mat.","The dog is under the bed.","The dog is by the bed.","The dog is by the box.","The dog is by the mat.","The hat is in the box.","The hat is on the bed.","The hat is on the box.","The hat is on the mat.","The hat is under the bed.","The hat is by the bed.","The hat is by the box.","The hat is by the mat.","The cup is in the box.","The cup is on the bed.","The cup is on the box.","The cup is on the mat.","The cup is under the bed.","The cup is by the bed.","The cup is by the box.","The cup is by the mat.","The bug is in the box.","The bug is on the bed.","The bug is on the box.","The bug is on the mat.","The bug is under the bed.","The bug is by the bed.","The bug is by the box.","The bug is by the mat."],"wordsZh":[["天上",""],["地上",""],["天下",""],["地下",""],["山上",""],["山下",""],["上天",""],["大地",""],["土地","soil"],["天地",""],["山川",""],["金鱼","fish"],["大鱼",""],["小鱼",""],["鱼头",""],["小虫","insect"],["草地","grass"],["小草",""],["雪地",""],["大雪","snow"],["小雪",""],["雪山","mountain"],["水草",""],["火山","volcano"],["山水",""],["大火","fire"],["门口",""],["人口",""],["山口",""],["石头","stone"],["木头","log"],["牛头",""],["马头",""],["大头","head"],["手心","hand"],["小心",""],["人心",""],["月牙","moon"],["坐下","sit"],["听说",""],["上下",""],["大小",""],["日月","bright"],["牛马",""],["大人",""],["小人",""],["多少",""],["开关",""],["开门","door_open"],["关门","door"],["大门",""],["小门",""],["左手",""],["右手",""],["左右",""],["前后",""],["爷爷","@grandpa"],["奶奶","grandma"],["妹妹","@bingo"],["下山",""],["上山",""],["对门",""],["不对",""],["对了",""]],"wordsZh3":[["小金鱼","fish"],["大金鱼",""],["大雪山","mountain"],["小雪山",""],["小草地","grass"],["大草地",""],["大火山","volcano"],["小火山",""],["大石头","stone"],["小石头",""],["大木头","log"],["小木头",""]],"sense":[{"pre":"鸟飞","ok":"上天。","no":["上牙。","上米。","上月。","下石中。"],"subj":"bird"},{"pre":"马去","ok":"山上。","no":["天上。","牙上。","耳中。","米中。"],"subj":"horse"},{"pre":"爷爷","ok":"坐下。","no":["坐牙上。","站米上。","坐耳上。","坐月上。"],"subj":"@grandpa"},{"pre":"鱼","ok":"去水中。","no":["去米中。","去山上。","坐车上。","飞上月。"],"subj":"fish"},{"pre":"牛","ok":"站地上。","no":["站天上。","站月上。","站米上。","站牙上。"],"subj":"cow"},{"pre":"奶奶","ok":"坐车上。","no":["坐月上。","站米上。","坐牙上。","坐耳中。"],"subj":"grandma"},{"pre":"羊","ok":"站山上。","no":["站米上。","站月上。","站牙上。","站耳中。"],"subj":"sheep"},{"pre":"小虫","ok":"去草中。","no":["去月上。","去日上。","去金中。","去石中。"],"subj":"insect"},{"pre":"妹妹","ok":"站门口。","no":["站月上。","站米上。","站牙上。","站耳中。"],"subj":"@bingo"},{"pre":"小鸟","ok":"站木上。","no":["站米上。","站月上。","站耳中。","站石中。"],"subj":"bird"},{"pre":"车","ok":"去山下。","no":["去天上。","去月上。","去米中。","去牙中。"],"subj":"car"},{"pre":"小马","ok":"去草地。","no":["去月上。","去米中。","去牙中。","去耳中。"],"subj":"horse"},{"pre":"大牛","ok":"去水中。","no":["飞上天。","去米中。","坐牙上。","站耳上。"],"subj":"cow"},{"pre":"爷爷坐","ok":"车上。","no":["米上。","月上。","牙上。","耳中。"],"subj":"@grandpa"},{"pre":"小鸟飞","ok":"上天。","no":["上牙。","上米。","上月。","下石中。"],"subj":"bird"},{"pre":"小鱼去","ok":"水中。","no":["米中。","天上。","山上。","牙上。"],"subj":"fish"},{"pre":"鱼在","ok":"水中。","no":["天上。","米中。","牙上。","石中。"],"subj":"fish"},{"pre":"牛在","ok":"地上。","no":["天上。","米中。","牙上。","耳中。"],"subj":"cow"},{"pre":"小虫在","ok":"草上。","no":["月上。","金中。","日上。","石中。"],"subj":"insect"},{"pre":"鸟在","ok":"天上。","no":["米中。","牙中。","耳中。","金中。"],"subj":"bird"},{"pre":"门","ok":"开了。","no":["飞了。","说了。","听了。","坐了。"],"subj":"door"},{"pre":"雪是","ok":"白的。","no":["红的。","绿的。","蓝的。","金的。"],"subj":"snow"},{"pre":"爸爸","ok":"喝汤。","no":["喝石头。","喝门。","喝车。","喝伞。"],"subj":"@daddy_pig"},{"pre":"妈妈","ok":"吃饭。","no":["吃石头。","吃门。","吃车。","吃伞。"],"subj":"@mummy_pig"},{"pre":"我","ok":"看书。","no":["喝书。","吃车。","坐牙上。","坐耳中。"],"subj":"look"},{"pre":"兔子","ok":"吃草。","no":["吃车。","吃石头。","吃门。","吃伞。"],"subj":"rabbit"},{"pre":"我坐","ok":"车上。","no":["米上。","月上。","牙上。","耳中。"],"subj":"sit"},{"pre":"小狗","ok":"在地上。","no":["在月上。","在米上。","在牙上。","在耳中。"],"subj":"dog"},{"pre":"弟弟","ok":"在门口。","no":["在月上。","在米中。","在牙中。","在耳上。"],"subj":"@george"},{"pre":"小鸡","ok":"吃米。","no":["吃车。","吃门。","吃伞。","吃灯。"],"subj":"chicken"}],"endPic":{"伞":"umbrella","灯":"lamp","天":"sky","火":"fire","牙":"tooth","耳":"ear","石":"stone","日":"sun","月":"moon","金":"gold","山":"mountain","水":"river","地":"soil","草":"grass","车":"car","门":"door","木":"tree","书":"book","饭":"ricebowl","汤":"soup","米":"rice"},"orderRules":["先横后竖","从上到下","先撇后捺","从左到右","先中间后两边","先外后内","先进去后关门"],"orderPairs":[["十",1,2,"先横后竖",1],["土",1,2,"先横后竖",1],["木",1,2,"先横后竖",1],["耳",1,2,"先横后竖",1],["草",1,2,"先横后竖",1],["地",1,2,"先横后竖",1],["去",1,2,"先横后竖",1],["禾",2,3,"先横后竖",1],["车",3,4,"先横后竖",1],["米",3,4,"先横后竖",1],["手",3,4,"先横后竖",1],["坐",5,6,"先横后竖",1],["林",1,2,"先横后竖",1],["来",4,5,"先横后竖",1],["走",1,2,"先横后竖",1],["在",4,5,"先横后竖",1],["天",1,2,"从上到下",1],["开",1,2,"从上到下",1],["云",1,2,"从上到下",1],["二",1,2,"从上到下",1],["三",2,3,"从上到下",1],["上",2,3,"从上到下",1],["羊",3,4,"从上到下",1],["牛",2,3,"从上到下",1],["手",2,3,"从上到下",1],["关",3,4,"从上到下",1],["耳",4,5,"从上到下",1],["人",1,2,"先撇后捺",2],["大",2,3,"先撇后捺",2],["天",3,4,"先撇后捺",2],["木",3,4,"先撇后捺",2],["禾",4,5,"先撇后捺",2],["米",5,6,"先撇后捺",2],["火",3,4,"先撇后捺",2],["关",5,6,"先撇后捺",2],["足",6,7,"先撇后捺",2],["八",1,2,"先撇后捺",2],["从",3,4,"先撇后捺",2],["走",6,7,"先撇后捺",2],["川",1,2,"从左到右",2],["小",2,3,"从左到右",2],["火",1,2,"从左到右",2],["坐",2,3,"从左到右",2],["林",4,5,"从左到右",2],["从",2,3,"从左到右",2],["小",1,2,"先中间后两边",3],["水",1,2,"先中间后两边",3],["少",1,2,"先中间后两边",3],["山",1,2,"先中间后两边",3],["光",1,2,"先中间后两边",3],["月",2,3,"先外后内",3],["目",2,3,"先外后内",3],["田",2,3,"先外后内",3],["日",2,3,"先外后内",3],["肉",2,3,"先外后内",3],["风",2,3,"先外后内",3],["四",2,3,"先外后内",3],["白",3,4,"先外后内",3],["日",3,4,"先进去后关门",4],["目",4,5,"先进去后关门",4],["田",4,5,"先进去后关门",4],["四",4,5,"先进去后关门",4],["白",4,5,"先进去后关门",4],["牛",2,4,"先横后竖",4],["车",1,4,"先横后竖",4],["羊",3,6,"先横后竖",4],["土",1,3,"从上到下",4],["羊",3,5,"从上到下",4],["耳",1,4,"从上到下",4],["目",3,5,"先进去后关门",4],["田",3,5,"先进去后关门",4],["川",2,3,"从左到右",5],["耳",2,3,"从左到右",5],["草",2,3,"从左到右",5],["心",3,4,"从左到右",5],["坐",1,3,"从左到右",5],["多",1,4,"从上到下",5],["林",1,5,"从左到右",5],["竹",1,4,"从左到右",5],["雪",5,7,"从左到右",5],["雪",5,6,"从上到下",5]],"kind":{"天上":"天日月云雨电雪","地上":"地土山石田草川禾木竹","动物":"牛羊马鸟鱼虫龙兔狗鸡","身体":"口目手耳足头牙心","动作":"坐站飞说听吃喝看走来去","家人":"爸妈哥姐弟爷奶妹"},"kindLine":{"天上":"这是天上的","地上":"这是地上的","动物":"这是动物","身体":"这是身体","动作":"这是动作","家人":"这是家人"},"kindWords":[["金鱼","动物"],["小鸟","动物"],["小虫","动物"],["雪山","地上"],["草地","地上"],["石头","地上"],["大雪","天上"],["月牙","天上"],["手心","身体"],["大头","身体"],["坐下","动作"],["听说","动作"],["爷爷","家人"],["奶奶","家人"],["妹妹","家人"],["爸爸","家人"]],"body":[["听","耳","listen"],["说","口","talk"],["站","足","stand"],["看","目","look"],["吃","口","eat"],["喝","口","drink"],["走","足","walk"]],"opp":["大小","上下","多少","开关","来去","左右","前后","天地"],"oppWords":[["上山","下山"],["开门","关门"],["大门","小门"],["天上","地下"],["左手","右手"]],"look":{"天":"大开","地":"他","土":"上","川":"三小","耳":"目","足":"走是","心":"小","飞":"风","听":"吃","雪":"雨","虫":"中电","少":"小","开":"天关","关":"开天","去":"云","左":"右在","右":"左有石","中":"虫","爷":"爸","奶":"妈","妹":"姐妈","子":"了"},"lookBack":{"大":"天","上":"土","小":"少","风":"飞","雨":"雪","云":"去","在":"左","有":"右","石":"右","了":"子","走":"足","是":"足","目":"耳","爸":"爷","妈":"奶妹","姐":"妹","电":"虫","吃":"听","他":"地"},"holds":{"大":"天","土":"地在坐去","口":"足听中右后","人":"坐金","小":"少","日":"草","雨":"雪","中":"虫","天":"关","女":"奶妹妈姐","田":"鱼"},"samePic":{"川":"水","水":"川"},"motion":{"sky":"up","soil":"hop","ear":"sway","head":"sway","sit":"down","stand":"up","plane":"fly","insect":"fly","check":"grow","chest_open":"grow","chest_shut":"shrink","leftsign":"left","rightsign":"right","front":"grow","back":"shrink","girl":"sway","baby":"sway","earth":"spin","gold":"grow","river":"sway","snow":"down","grass":"sway","goaway":"shrink","heart":"grow","tooth":"hop","foot":"hop","talk":"sway","listen":"sway","grandma":"sway","middle":"hop","many":"hop","few":"hop"},"naiMilk":["奶，牛奶的奶！","milk"],"dict":["bad","bag","ban","bat","bed","beg","bet","bib","bid","big","bin","bit","bog","bop","box","bud","bug","bun","bus","but","cab","can","cap","cat","cob","cod","cog","cop","cot","cub","cup","cut","dad","dam","den","did","dig","dim","din","dip","dog","dot","dug","fad","fan","fat","fed","fen","fig","fin","fit","fix","fog","fox","fun","fur","gap","gas","get","gig","gum","gun","gut","had","ham","has","hat","hen","hid","him","hip","his","hit","hog","hop","hot","hug","hum","hut","jab","jam","jet","jig","job","jog","jot","jug","jut","kid","kin","kit","lab","lad","lag","lap","led","leg","let","lid","lip","lit","log","lot","mad","man","map","mat","men","met","mid","mix","mob","mom","mop","mud","mug","nab","nag","nap","net","nip","nod","not","nun","nut","pad","pal","pan","pat","peg","pen","pet","pig","pin","pit","pod","pop","pot","pub","pug","pun","pup","put","rag","ram","ran","rap","rat","red","rib","rid","rig","rim","rip","rob","rod","rot","rub","rug","rum","run","rut","sad","sag","sap","sat","set","sip","sit","sob","sod","sun","tab","tag","tan","tap","ten","tin","tip","top","tub","tug","van","vat","vet","wag","web","wet","wig","win","wit","yak","yam","yap","yet","zap","zip"],"all":[{"id":"ultra4","name":"天地岛","host":"ultraman","color":"#E23B3B","chars":"天地金土川","write":"天土"},{"id":"peppa4","name":"小医院","host":"peppa","color":"#FF8DB3","chars":"耳足头牙心","write":"耳头"},{"id":"pj4","name":"月光乐园","host":"catboy","color":"#3A5CC0","chars":"坐站飞说听","write":"坐飞"},{"id":"xiyou4","name":"水帘洞","host":"wukong","color":"#F5B324","chars":"对雪虫鱼草","write":"虫对"},{"id":"huluwa4","name":"葫芦洞","host":"gourd2","color":"#46C27A","chars":"多少开关去","write":"开关"},{"id":"paw4","name":"十字路口","host":"chase","color":"#E8554A","chars":"左右中前后","write":"左右"},{"id":"bluey4","name":"大家庭","host":"bluey","color":"#6BB9F2","chars":"爷奶妹女子","write":"女子"}],"have":["ant","apple","baby","back","ball","bamboo","banana","bat","bed","big","bird","book","box","bright","bun","bus","cap","car","cat","check","chest_open","chest_shut","chicken","cloud","come","cow","cup","dino","dog","door","door_open","down","dragon","drink","duck","ear","earth","eat","egg","elephant","eye","fan","few","field","fig","fire","fish","flower","follow","foot","fox","frog","front","fruit","girl","glove","goaway","gold","goose","grandma","grapes","grass","hand","hat","head","heart","hen","hop","horse","house","icecream","insect","jacket","jam","jet","jug","juice","key","kite","lamp","leaf","leftsign","light","lightning","lion","listen","log","look","man","many","map","mat","meat","melon","middle","milk","moon","moonlight","mop","mountain","mouth","mug","net","nose","notebook","nut","orange","owl","pan","pen","person","pig","pinwheel","plane","polarbear","queen","quilt","rabbit","rain","raincoat","rat","rest","rice","ricebowl","riceplant","rightsign","ring","river","rockinghorse","rug","ruler","run","schoolbag","sheep","shirt","sit","sky","small","snow","soil","soup","spoon","stand","star","stone","strawberry","sun","talk","tent","tincan","tooth","top","towel","train","tree","umbrella","unicorn","up","van","vase","volcano","walk","watch","water","web","whale","wig","wind","window","woods","xylophone","yogurt","yoyo","zebra","zip","@bajie","@bandit","@bingo","@bluey","@bumblebee","@captain","@catboy","@chase","@chilli","@daddy_pig","@dragon_horse","@gekko","@george","@gourd1","@gourd2","@gourd3","@gourd4","@gourd5","@gourd6","@gourd7","@grandpa","@hawkeye","@hulk","@ironman","@kaiju1","@kaiju2","@luna_girl","@marshall","@miles","@mummy_pig","@optimus","@owlette","@panther","@peppa","@pj_robot","@rocky","@romeo","@rubble","@ryder","@scorpion","@shaseng","@skye","@snake","@spiderman","@tangseng","@thor","@ultraman","@widow","@wukong","@zero","@zuma"]};
/* ---------------- src/w4/core.js */
/* ================================================================ 字字岛 · 神笔海 (world 4) · core - in the LAZY file assets/js/w4.js
   (tools/build.py: the tables W4D, then this file, ancient.js and one file an island). The island files copy the conventions
   documented in src/w4/README.md: every play is an object (rule, kind0, verb, intro, gen, present, place, onGesture, next,
   reveal, feedback, explain, gestureHint, snap, iconNode) registered with w4Island(id, [find, en, quiz]); the writing game is
   W4X.Write for every island. Nothing here may define a top-level name the first screen already has. */

Object.assign(W4X, {
  D: W4D,
  /* the file has come: the world's tables join the engine's (once) */
  init() {
    W4D.read.forEach(r => { if (!READ.some(x => x[0] === r[0])) READ.push(r); });
    W4D.books.forEach(b => { if (!BOOKS.some(x => x.id === b.id)) BOOKS.push(b); });
    const join = (T, add) => { for (const k in add) { const cur = T[k] || ''; T[k] = cur + Array.from(add[k]).filter(c => !cur.includes(c)).join(''); } };
    join(LOOK, W4D.look); join(LOOK, W4D.lookBack); join(HOLDS, W4D.holds); join(HOLDS, W4D.samePic);      /* SAMEPIC (川 / 水): never offered together, like a holder */
    Object.assign(MOTION, W4D.motion);
    if (!Hanzi.extra) fetch('assets/data/hanzi_extra.json').then(r => (r.ok ? r.json() : null)).then(d => { if (d) Hanzi.extra = d; }).catch(() => {});
    if (Screens.cur === 'map' && !Session.G && MapView.built) MapView.update();
  },

  /* ---------------------------------------------------------------- questions */
  /* the island's characters still to pass first, at most twice a session and never twice in a row (W3R1-02) */
  pick(G, pool, bag) { return needPick(G, pool, bag); },
  /* the answer among the others at a place from a position bag (never always first) */
  put(G, others, x) { return putAt(G, others, x); },
  /* five characters for a "find X" question: levels 1-2 the island's own, 3 look-alikes + one old character, 4 two old, 5 three
     (the engine's optsFor - on 神笔海 poolOf is the child's own known set, §5.3) */
  opts(G, level, answer, n) { return optsFor(G, 'zh', level, n || 5, answer); },
  /* W4X.known(G) (src/w4/boot.js): the characters this child knows here (§5.3); only(): of a set, the known ones */
  only(G, set) { const kn = poolOf(G, 'zh', true); return Array.from(set).filter(k => kn.includes(k)); },
  knowsAll(G, text) { const kn = poolOf(G, 'zh', true); return Array.from(text).every(c => !/[一-鿿]/.test(c) || kn.includes(c)); },
  /* a picture we really have (art not drawn yet is left out of the questions that need it) */
  hasPic(o) { return !!o && (W4D.have.includes(o) || !!OBJ_ALIAS[o]); },
  pic(o, size) { const i = img(OBJURL(o), ''); Object.assign(i.style, { width: size + 'px', height: size + 'px', objectFit: 'contain', pointerEvents: 'none' }); return i; },
  /* the lines every character has (all recorded, tools/voice_lines.py): "这是X" (what he picked), "这个是X" (the right one) */
  thisIs(k) { return '这是' + k; },
  thatIs(k) { return '这个是' + k; },
  /* "read, not said" cards (§5.2): a tap says it - and that question earns no star, nor counts for the memory */
  readCard(st, text, h) { return W3X.readCard(st, text, h); },
  placeRead(st, cx, y) { return W3X.placeRead(st, cx, y); },
  peek(st) { return W3X.peek(st); },
  own(st, k) { return W3X.own(st, k); },
  /* spoken lines a file says through variables: listed once in a call W4X.lines([...]) - tools/voice_lines.py records them */
  lines(a) { return a; },
  /* a test-only gesture: 'wait' = nothing to tap yet (a play that shows its options one after another skips to the next) */
  WAIT: { g: 'wait', p: { id: 'wait' } },
  /* a real minimum wait even in the tests' fast mode (a play whose options come and go must not spin) */
  tick(st, ms) {
    return new Promise(res => { const id = setTimeout(() => { if (!st.scope.dead) res(); }, fast() ? Math.min(ms, 600) : ms); st.scope.add(() => clearTimeout(id)); });
  },
  /* a little round light backing for a play's own icon (W3R1-05: the island panel's game icons) */
  icon(node) { const d = el('div'); Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }); d.appendChild(node); return d; },
  svgIcon(inner, vb) { const d = el('div'); d.innerHTML = '<svg viewBox="' + (vb || '0 0 60 60') + '" width="70%" height="70%">' + inner + '</svg>'; Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }); return d; },

  /* ---------------------------------------------------------------- the explain step (§5.4): beats */
  /* 1 the chosen one: a calm blue dashed ring and its own picture (its line was just said by feedback) */
  exChosen(st, e, k) { if (!e) return; EX.ring(st, e, 'chosen'); if (k != null) EX.picOver(st, e, k, 'chosen'); },
  /* a wordless demonstration is a beat of its own: st.stepDirty marks it for 一步一步 (the parent's tap ends it) */
  async exBeat(st, fn, ms) { if (fn) await fn(); st.stepDirty = true; await EX.wait(st, ms == null ? 600 : ms); },
  /* 3 the right one: a gold ring, its picture, its line(s) */
  async exRight(st, e, k, lines, pic) {
    if (e) { EX.ring(st, e, 'right'); K.hop(st, e, 20); if (pic !== false && k != null) EX.picOver(st, e, pic || k, 'right'); }
    await EX.say(st, lines);
    await EX.wait(st, 300);
  },
});

/* ---------------------------------------------------------------- the base of every 神笔海 play (zGame adds ZBase under it) */
W4X.Base = {
  /* kind0 'find4': a review question in this game is the engine's review card. A play with kind0 'find' instead gets review
     questions in its OWN frame - q = { k, answer, opts } (five characters) and nothing else - and must show them (ultra4's moles do) */
  kind0: 'find4', verb: '找！', boost: 0, props: [],
  /* the factual line for a wrong pick: what the picked one IS - "这是X" (never "wrong") */
  async feedback(st, ans) {
    const e = st.cards && st.cards[st.tapped];
    if (e) { K.wiggle(st, e); if (this.nope) this.nope(st, st.tapped); }
    const line = this.wrongLine ? this.wrongLine(st, ans) : ITEM[ans] && ITEM[ans].kind === 'zh' ? W4X.thisIs(ans) : null;
    if (line) Voice.say(line, { tag: 'wrong' });
    await st.scope.wait(900);
  },
  /* a tap on the read card says it (no star for that question); a tap on a card answers */
  onGesture(st, name, p) {
    if (name === 'tap' && p.id === 'read' && !st.submitted && st.readEl) { W4X.peek(st); return 'ok'; }
    return ZBase.onGesture.call(this, st, name, p);
  },
  async explain(st, ans) { await EX.cards(st, ans, { lines: [W4X.thatIs(st.q.answer)] }); },
};

/* ---------------------------------------------------------------- the writing (§6 写字): 彩虹海's W3Write - the island's two
   characters, and at the third question an old friend: the most due character the child really wrote before */
W4X.Write = Object.assign({}, W3Write);

/* ---------------------------------------------------------------- registering an island: its four games, in the order of
   ISL[id].games (find, write, en, quiz). bgs: the island's backgrounds (new art, or the fallback tools/build.py chose) */
function w4Island(id, plays) {
  const W = ISL[id]; if (!W) return;               /* not live */
  const cast = W.cast, host = cast[0], [find, en, quiz] = plays, bg = W.bgs;
  zGame(Object.assign({}, W4X.Base, find), { id: id + ':find', world: id, bg: bg[0], chars: cast, host, title: '认字', iconNode: find.iconNode || (() => Glyph.zh(W.chars[0].c, 60)) });
  writeGame(Object.assign({}, W4X.Write, { id: id + ':write', world: id, lang: 'zh', bg: bg[1], chars: cast.slice(0, 1), host, title: '写字', intro: '写一写！', iconNode: () => Glyph.zh(W.write[0], 60, '#E8414B'), decor: writeDecor }));
  zGame(Object.assign({}, W4X.Base, { kind0: 'en', verb: 'ABC' }, en), { id: id + ':en', world: id, bg: bg[2], chars: cast.slice(0, 1), host, title: '英文' });
  zGame(Object.assign({}, W4X.Base, { kind0: 'quiz', verb: '想！' }, quiz), { id: id + ':quiz', world: id, bg: bg[3], chars: cast, host, title: '挑战' });
}

/* ---------------------------------------------------------------- 儿歌卷 · 古诗卷 (§4.4.5-6): hanging scrolls on the story shelf;
   one opens after its island's flag; read together, never scored. Known characters black, the others light grey - a tap on any
   says it; the speaker reads it a breath at a time; 拍拍读 reads with a beat on every character (学而思's 说唱) */
Object.assign(W4X, {
  knownChar(c) { return !!ITEM[c] && (learned(c) || Mem.passed(c) || !!(Mem.get(c) && Mem.get(c).b > 0)); },
  scrollItems() {
    return W4D.scrolls.map(s => ({ scroll: s, on: !!ISL[s.after] && (flagged(s.after) || Store.s.all), kind: W4D.scrollKind[s.kind], cover: size => this.scrollCover(s, size) }));
  },
  scrollCover(s, size) {
    const d = el('div', ''); Object.assign(d.style, { position: 'relative', width: size + 'px', height: size + 'px' });
    const r = img('assets/props/scroll.png', '', d); Object.assign(r.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' });
    const sc = Scene.node(s.pic, Math.round(size * 0.5)); Object.assign(sc.style, { position: 'absolute', left: '25%', top: '22%' }); d.appendChild(sc);
    return d;
  },
  showScroll(id) {
    const s = W4D.scrolls.find(x => x.id === id); if (!s) return;
    const ov = el('div', 'storyov', document.body); ov.id = 'scroll4';
    Object.assign(ov.style, { position: 'fixed', inset: 0, zIndex: 60, background: 'linear-gradient(#F7F0DF,#EADFC4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' });
    const sc = new Scope(APP), vw = window.innerWidth, vh = window.innerHeight, n = s.lines.length;
    const close = () => { sc.dispose(); ov.remove(); Voice.hush('leave'); };
    const home = el('button', 'btn', ov); Object.assign(home.style, { position: 'absolute', left: 'calc(14px + var(--sl))', top: 'calc(14px + var(--st))', width: '96px', height: '96px', background: '#FFE08A' }); img('assets/props/ui_home.png', '', home).style.width = '74%'; tapify(home, close);
    const t = el('div', '', ov); t.textContent = '《' + s.title + '》 · ' + W4D.scrollKind[s.kind] + ' · 一起读'; Object.assign(t.style, { font: '800 22px system-ui,sans-serif', color: '#8A6A3A' });
    const picH = Math.round(Math.min(vh * (n > 6 ? 0.2 : 0.26), vw * 0.4)), pic = el('div', '', ov);
    Object.assign(pic.style, { background: '#fff', borderRadius: '20px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.22)', padding: '6px' }); pic.appendChild(Scene.node(s.pic, picH));
    const paper = el('div', '', ov); Object.assign(paper.style, { background: '#FFFBF0', borderRadius: '18px', boxShadow: '0 0 0 4px #9A6433, 0 0 0 9px #F3E3C0', padding: '10px 22px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' });
    const maxLen = Math.max(...s.lines.map(l => Array.from(l).length)), h = Math.max(36, Math.floor(Math.min((vh - picH - 300) / n * 0.92, (vw - 120) / (maxLen + 1))));
    const rows = s.lines.map(line => {
      const row = el('div', '', paper); Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: Math.round(h * 0.04) + 'px', borderRadius: '12px', padding: '0 6px' });
      row._cells = Array.from(line).map(c => {
        if (/[。！？，]/.test(c)) { const p = el('span', '', row); p.textContent = c; Object.assign(p.style, { font: '900 ' + Math.round(h * 0.6) + 'px system-ui,sans-serif', color: INK }); return null; }
        const cell = el('div', '', row); Object.assign(cell.style, { width: h + 'px', height: h + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' });
        cell.appendChild(Glyph.zh(c, h * 0.92, this.knownChar(c) ? INK : '#BDB3A0')); cell.dataset.ch = c;
        tapify(cell, () => { const it = ITEM[c]; Voice.sayNow(it ? it.line : c, { tag: 'story' }); cell.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 300 }); });
        return cell;
      }).filter(Boolean);
      return row;
    });
    const bar = el('div', '', ov); Object.assign(bar.style, { display: 'flex', gap: '28px', marginTop: '6px' });
    const mk = (inner, fn, lbl) => { const b = el('button', 'btn', bar); b.setAttribute('aria-label', lbl); Object.assign(b.style, { position: 'relative', width: '104px', height: '96px', background: '#fff' }); b.innerHTML = inner; tapify(b, fn); return b; };
    let run = 0;
    const read = async beat => {
      const my = ++run; Voice.hush('story');
      for (let i = 0; i < rows.length; i++) {
        if (my !== run || sc.dead) return;
        rows.forEach((r, j) => { r.style.background = j === i ? '#FFE9A8' : ''; });
        Voice.say(s.lines[i], { tag: 'story' });
        if (beat) for (const c of rows[i]._cells) { if (my !== run || sc.dead) return; Sfx.thud(); c.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }], { duration: 260 }); await sc.wait(330); }
        await sc.guard(Voice.afterSay(beat ? 120 : 260));
      }
      if (my === run) rows.forEach(r => { r.style.background = ''; });
    };
    mk(ICONS.speaker || '<svg viewBox="0 0 40 40" width="60%" height="60%"><path d="M6 15h8l9-7v24l-9-7H6z" fill="#2E6FD8" stroke="#2B2118" stroke-width="3"/></svg>', () => read(false), '读一读');
    mk('<svg viewBox="0 0 60 40" width="78%" height="70%"><ellipse cx="30" cy="27" rx="22" ry="9" fill="#E8414B" stroke="#2B2118" stroke-width="3"/><path d="M8 27V17M52 27V17" stroke="#2B2118" stroke-width="3"/><ellipse cx="30" cy="17" rx="22" ry="9" fill="#FFE08A" stroke="#2B2118" stroke-width="3"/><path d="M40 4L33 14M20 4L27 14" stroke="#9A6433" stroke-width="4" stroke-linecap="round"/></svg>', () => read(true), '拍拍读');
    Voice.sayNow(s.title, { tag: 'story' });
    Voice.say(W4D.scrollKind[s.kind], { tag: 'story' });
  },
});

/* ---------------- src/w4/ancient.js */
/* 神笔海 · the ancient forms (甲骨文 / 金文 style) of 古字变今字 (docs/W4-DESIGN.md §6 ①-4). One entry a character: lines in a 100 x 100 box (y down), drawn as ink strokes 9 units wide with round caps and joins, no fills. src: the form it follows. Checked on raw/ancient_sheet.png. */
W4X.ANCIENT = {
  人: { d: ['M40 12 Q58 14 60 38 Q62 62 70 90', 'M59 34 Q44 54 28 76'], src: '甲骨文：侧身站着的人，弯着背，手臂向前垂' },
  口: { d: ['M12 18 L14 54 Q16 82 50 82 Q84 82 86 54 L88 18', 'M14 30 L86 30'], src: '甲骨文：张开的嘴' },
  目: { d: ['M12 50 C 32 18, 68 18, 88 50 C 68 82, 32 82, 12 50 Z', 'M36 50 A14 14 0 1 0 64 50 A14 14 0 1 0 36 50 Z'], src: '甲骨文：横着的一只眼睛，中间是眼珠' },
  手: { d: ['M50 88 Q44 62 50 12', 'M49 46 Q30 40 24 18', 'M49 46 Q70 40 76 18', 'M48 62 Q26 60 14 42', 'M48 62 Q72 60 86 44'], src: '金文：一只手，张开五个手指' },
  日: { d: ['M12 50 A38 38 0 1 1 88 50 A38 38 0 1 1 12 50 Z', 'M46 50 L54 50'], src: '甲骨文：圆圆的太阳，中间一点' },
  月: { d: ['M72 12 C 10 18, 10 82, 72 88', 'M72 12 C 50 32, 50 68, 72 88', 'M35 50 L45 50'], src: '甲骨文：弯弯的月牙，中间一笔' },
  山: { d: ['M12 82 L88 82', 'M12 82 L26 48 L38 68 L50 16 L62 68 L74 48 L88 82'], src: '甲骨文：连在一起的三座山峰' },
  水: { d: ['M44 12 Q70 31 50 50 Q30 69 56 88', 'M22 24 L25 32', 'M24 62 L27 70', 'M76 32 L73 40', 'M78 70 L75 78'], src: '甲骨文：中间是弯弯的流水，两边是水点' },
  火: { d: ['M20 30 Q16 50 26 66 Q36 84 50 84 Q64 84 74 66 Q84 50 80 30', 'M50 84 Q40 62 46 42 Q52 26 48 12', 'M34 70 Q30 56 34 46', 'M66 70 Q70 56 66 46'], src: '甲骨文：往上窜的火苗' },
  田: { d: ['M14 16 L86 16 L86 84 L14 84 Z', 'M50 16 L50 84', 'M14 50 L86 50'], src: '甲骨文：方方的田，中间是田埂' },
  禾: { d: ['M50 88 L50 28 Q48 8 28 20', 'M50 48 L24 32', 'M50 48 L76 32', 'M50 72 L28 88', 'M50 72 L72 88'], src: '甲骨文：一棵禾苗，顶上的穗子垂下来，下面有根' },
  木: { d: ['M50 12 L50 88', 'M50 40 L22 16', 'M50 40 L78 16', 'M50 66 L24 88', 'M50 66 L76 88'], src: '甲骨文：一棵树，上面是树枝，下面是树根' },
  米: { d: ['M12 50 L88 50', 'M50 16 L50 38', 'M50 62 L50 84', 'M26 28 L28 34', 'M74 28 L72 34', 'M26 72 L28 66', 'M74 72 L72 66'], src: '甲骨文：一横隔开，上下是米粒' },
  牛: { d: ['M18 14 Q20 42 50 42 Q80 42 82 14', 'M50 42 L50 88', 'M20 66 L50 54 L80 66'], src: '甲骨文：牛头，两只角向上弯，一横是耳朵' },
  羊: { d: ['M50 36 Q40 12 24 16 Q12 20 20 36', 'M50 36 Q60 12 76 16 Q88 20 80 36', 'M50 36 L50 88', 'M20 62 L50 50 L80 62'], src: '甲骨文：羊头，两只角向下卷' },
  马: { d: ['M56 14 Q36 10 22 18 Q16 24 22 30 Q32 32 42 36', 'M56 14 Q62 42 60 74 L44 74 L42 36', 'M38 21 L39 22', 'M59 24 Q70 18 80 22 M60 36 Q72 30 82 36 M61 48 Q72 44 80 50', 'M43 46 L22 52', 'M44 66 L22 74', 'M58 74 Q68 80 66 88'], src: '甲骨文：竖着画的马：头朝上，大眼睛，右边是鬃毛，左边是腿，下面是尾巴' },
  鸟: { d: ['M14 32 L28 28', 'M28 26 Q36 12 50 16 Q60 20 60 32 Q72 44 88 68', 'M28 36 Q30 58 46 68 Q66 78 88 68', 'M52 40 Q64 52 76 62', 'M42 25 L43 26', 'M46 68 L42 86 M56 72 L54 86', 'M34 88 L62 88'], src: '甲骨文：侧面站着的一只鸟，有尖嘴、翅膀和爪' },
  大: { d: ['M50 12 L50 52', 'M14 44 Q50 28 86 44', 'M50 52 L22 88', 'M50 52 L78 88'], src: '甲骨文：张开手脚站着的大人' },
  小: { d: ['M50 12 L50 56', 'M28 50 L22 86', 'M72 50 L78 86'], src: '甲骨文：三粒小小的沙粒' },
  门: { d: ['M16 88 L16 14 L84 14 L84 88', 'M16 30 L38 30 L38 82 L16 82', 'M84 30 L62 30 L62 82 L84 82'], src: '甲骨文：门框里的两扇门' },
  车: { d: ['M12 64 A14 14 0 1 0 40 64 A14 14 0 1 0 12 64 Z', 'M60 64 A14 14 0 1 0 88 64 A14 14 0 1 0 60 64 Z', 'M12 64 L88 64 M26 50 L26 78 M74 50 L74 78', 'M50 64 L50 20', 'M28 26 Q50 10 72 26'], src: '甲骨文：从上面看的车：两个轮子、一根车轴、一根车辕' },
  雨: { d: ['M12 18 L88 18', 'M28 34 L28 48 M28 66 L28 80', 'M50 18 L50 48 M50 66 L50 80', 'M72 34 L72 48 M72 66 L72 80'], src: '甲骨文：天上（一横）落下雨点' },
  竹: { d: ['M30 12 Q26 50 30 88', 'M30 14 Q14 20 12 56', 'M30 14 Q42 22 44 48', 'M70 12 Q74 50 70 88', 'M70 14 Q58 22 56 48', 'M70 14 Q86 20 88 56'], src: '甲骨文：两根竹枝，竹叶向下垂' },
  龙: { d: ['M16 16 L60 26 L60 42 L20 54', 'M32 21 L28 9 M46 24 L50 11', 'M47 33 L48 34', 'M60 38 Q86 50 76 70 Q66 88 46 86 Q28 84 30 72'], src: '甲骨文：头上有角、张着大嘴、身子弯弯卷起来的龙' },
  鱼: { d: ['M50 12 C 73 25, 73 52, 50 68 C 27 52, 27 25, 50 12 Z', 'M50 68 L35 88 Q50 82 65 88 Z', 'M33 50 L22 60', 'M67 50 L78 60', 'M38 40 L62 40 M50 26 L50 56'], src: '甲骨文：头朝上的一条鱼，身上有鳞，两边有鳍，下面是尾巴' },
  女: { d: ['M60 12 Q50 34 52 56 Q52 72 32 84 L78 84', 'M52 26 L24 56', 'M26 32 L60 62'], src: '甲骨文：跪坐着的女子，两手交叉放在胸前' },
  子: { d: ['M35 28 A15 15 0 1 0 65 28 A15 15 0 1 0 35 28 Z', 'M50 43 L50 76 Q50 88 38 86', 'M18 42 Q28 58 50 56 Q72 58 82 42'], src: '金文：大头的小娃娃，张开两只手' },
  天: { d: ['M38 24 A12 12 0 1 0 62 24 A12 12 0 1 0 38 24 Z', 'M50 36 L50 60', 'M14 48 L86 48', 'M50 60 L24 88', 'M50 60 L76 88'], src: '甲骨文：正面站着的人，头画得大大的' },
  土: { d: ['M14 84 L86 84', 'M50 18 Q26 50 30 68 Q34 84 50 84 Q66 84 70 68 Q74 50 50 18'], src: '甲骨文：地面上的一堆土' },
  川: { d: ['M28 12 Q18 31 28 50 Q38 69 26 88', 'M52 20 Q44 35 52 50 Q60 65 52 80', 'M74 12 Q64 31 74 50 Q84 69 72 88'], src: '金文：弯弯流着的河水' },
  耳: { d: ['M28 16 Q74 8 72 44 Q70 70 50 78 Q40 82 40 88', 'M28 16 L28 74 Q28 84 40 86', 'M40 32 Q58 30 56 46 Q54 58 42 58'], src: '甲骨文：一只耳朵' },
  足: { d: ['M50 12 C 74 12, 74 42, 50 42 C 26 42, 26 12, 50 12 Z', 'M50 42 L50 86', 'M50 62 L72 62', 'M30 60 L30 86', 'M18 86 L84 86'], src: '金文：上面圆圈是膝盖，下面是脚（止）' },
  心: { d: ['M43 22 Q28 6 16 22 Q6 42 28 64 L50 88 L72 64 Q94 42 84 22 Q72 6 57 22', 'M50 38 L50 60'], src: '金文：一颗心' },
  牙: { d: ['M14 34 L14 14 L68 14 L68 68', 'M86 66 L86 86 L32 86 L32 32'], src: '金文：上下两颗大牙交错咬在一起' },
  虫: { d: ['M50 12 L34 38 Q50 46 66 38 Z', 'M50 42 Q66 56 52 68 Q38 79 48 86 Q58 92 70 82'], src: '甲骨文：三角形脑袋的小蛇' }
};

/* ---------------- src/w4/ultra4.js */
/* ================================================================ 神笔海 ① 奥特曼 · 天地岛 (ultra4): 天 地 金 土 川 (docs/W4-DESIGN.md §6 ①)
   认字 「打！」地鼠钻出来 (one-at-a-time) · 写字 天 土 (W4X.Write) · 英文 「变！」变身换字母 (change-one-letter) ·
   挑战 「古！」古字变今字 (ancient-to-modern). THE TEMPLATE of the island files: see src/w4/README.md. */
(() => {
  const L = () => K.L();

  /* ---------------------------------------------------------------- ①-1 认字 「打！」 地鼠钻出来 (go / no-go)
     Five holes; one mole at a time (L4 two, L5 three) comes up holding a sign and goes down again. Tap the one holding X while it
     is up; an empty hole does nothing; a mole with another character is this question's answer (wrong). Not tapping: the moles
     keep coming, X once a round (a bag; levels 1-2: in the first three of a round). Levels: 1 the picture on the task card, up
     3 s, the island's characters; 2 heard only, 2.6 s; 3 look-alikes + one old character, 2.4 s; 4 two moles at a time, two old
     characters; 5 three at a time, three old, 2 s. A random tap is right 1 time in 5. */
  const MOLE_SVG = '<svg viewBox="0 0 120 110" width="100%" height="100%"><ellipse cx="60" cy="74" rx="40" ry="34" fill="#8B5E3C" stroke="#2B2118" stroke-width="5"/><ellipse cx="60" cy="84" rx="24" ry="20" fill="#C99A6B"/>'
    + '<circle cx="46" cy="62" r="6" fill="#2B2118"/><circle cx="74" cy="62" r="6" fill="#2B2118"/><circle cx="48" cy="60" r="2" fill="#fff"/><circle cx="76" cy="60" r="2" fill="#fff"/>'
    + '<ellipse cx="60" cy="74" rx="9" ry="7" fill="#FF8DB3" stroke="#2B2118" stroke-width="3"/><path d="M22 52C14 44 18 34 26 38M98 52C106 44 102 34 94 38" fill="#C99A6B" stroke="#2B2118" stroke-width="4" stroke-linecap="round"/></svg>';
  const HOLES = () => (L() ? [[230, 600], [400, 600], [570, 600], [740, 600], [910, 600]] : [[150, 610], [352, 610], [554, 610], [251, 880], [453, 880]]);
  const MW = 150, MH = 196;
  const Moles = {
    rule: 'one-at-a-time', kind0: 'find', verb: '打！', intro: '地鼠钻出来！', props: ['mole'],
    gen(G, o) {
      const lv = o.level, pool = poolOf(G, 'zh', false), answer = W4X.pick(G, pool), opts = W4X.opts(G, lv, answer, 5), lk = LOOK[answer] || '';
      return { k: [answer, opts.join('')], answer, opts, pic: lv <= 1 ? 1 : 0, many: [1, 1, 1, 1, 2, 3][lv], show: [3000, 3000, 2600, 2400, 2400, 2000][lv], early: lv <= 2 ? 1 : 0,
        look: opts.filter(k => k !== answer && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: what makes a level harder - the picture gone, less time, look-alikes, old characters, more at once */
    hard(q) { return (1 - q.pic) + (3000 - q.show) / 200 + q.look + q.rev * 1.5 + (q.many - 1) * 2; },
    async present(st) {
      const q = st.q, lv = st.level;
      /* a review question in this frame (kind0 'find') comes as { k, answer, opts } only: the level's own settings then */
      if (q.many == null) Object.assign(q, { pic: lv <= 1 ? 1 : 0, many: [1, 1, 1, 1, 2, 3][lv] || 1, show: [3000, 3000, 2600, 2400, 2400, 2000][lv] || 2600, early: lv <= 2 ? 1 : 0 });
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      st.opts = q.opts.slice(); st.up = st.opts.map(() => false); st.at = st.opts.map(() => -1);
      /* the holes: the dark back, a box the mole rises in (it clips it below the rim), the front of the rim on top */
      st.holes = HOLES().map(() => {
        const back = ZX.thing(st, 176, 64, 4, 'item'); back.innerHTML = '<svg viewBox="0 0 176 64" width="100%" height="100%"><ellipse cx="88" cy="32" rx="84" ry="28" fill="#A0703F" stroke="#2B2118" stroke-width="5"/><ellipse cx="88" cy="32" rx="66" ry="18" fill="#3A2614"/></svg>'; back.style.pointerEvents = 'none';
        const box = ZX.thing(st, MW, MH, 5, 'item'); Object.assign(box.style, { overflow: 'hidden', pointerEvents: 'none' });
        const lip = ZX.thing(st, 176, 40, 7, 'item'); lip.innerHTML = '<svg viewBox="0 0 176 40" width="100%" height="100%"><path d="M4 4C10 30 166 30 172 4C172 22 140 38 88 38C36 38 4 22 4 4Z" fill="#A0703F" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/></svg>'; lip.style.pointerEvents = 'none';
        return { back, box, lip };
      });
      st.cards = st.opts.map((k, i) => {
        const d = el('div', 'item'); Object.assign(d.style, { position: 'absolute', left: '0px', top: '0px', width: MW + 'px', height: MH + 'px', visibility: 'hidden', pointerEvents: 'auto' });
        const m = el('div', '', d); Object.assign(m.style, { position: 'absolute', left: '8px', bottom: '-6px', width: (MW - 16) + 'px', height: '122px', pointerEvents: 'none' });
        const im = img('assets/props/mole.png', '', m); Object.assign(im.style, { width: '100%', height: '100%', objectFit: 'contain' }); im.onerror = () => { m.innerHTML = MOLE_SVG; };
        const s = ZX.sign(k, 96); Object.assign(s.style, { left: 'calc(50% - 48px)', top: '2px', background: '#FFF8EC' }); d.appendChild(s);
        K.reg(st, 'card' + i, d, {});
        return d;
      });
      this.place(st);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
      K.say(st, '打' + q.answer + '！');
      this.cycle(st);
    },
    place(st) {
      if (!st.holes) return;
      HOLES().forEach(([x, y], h) => { const H = st.holes[h]; place(H.back, x - 88, y - 32, 176, 64); place(H.box, x - MW / 2, y - MH, MW, MH); place(H.lip, x - 88, y - 6, 176, 40); });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 86 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* one mole up in a hole / down again (it rises inside the hole's box: below the rim it is clipped away) */
    up(st, i, h) {
      const d = st.cards[i]; if (!d || st.up[i]) return;
      st.holes[h].box.appendChild(d); st.up[i] = true; st.at[i] = h; d.style.visibility = '';
      st.scope.anim(d, [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 220, easing: EASE.out, commit: true });
    },
    async down(st, i) {
      const d = st.cards[i]; if (!d || !st.up[i]) return;
      st.up[i] = false;
      await st.scope.anim(d, [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], { duration: 200, easing: EASE.drop, fill: 'forwards' });
      if (!st.up[i]) { d.style.visibility = 'hidden'; d.getAnimations().forEach(a => a.cancel()); }
    },
    /* the moles keep coming until the answer is in: a bag of the five, X once a round */
    async cycle(st) {
      const q = st.q, G = st.G, ai = st.opts.indexOf(q.answer);
      let bag = [];
      const refill = () => { bag = G.rng.shuffle(st.opts.map((_, i) => i)); if (q.early && bag.indexOf(ai) > 2) { bag.splice(bag.indexOf(ai), 1); bag.splice(G.rng.int(0, 2), 0, ai); } };
      await this.hold(st, 900);
      while (Session.alive(st) && !st.submitted && !st.frozen) {
        const pick = [];
        while (pick.length < q.many) { if (!bag.length) refill(); const i = bag.shift(); if (!pick.includes(i)) pick.push(i); }
        const holes = G.rng.shuffle([0, 1, 2, 3, 4]);
        if (st.flashNext && pick.includes(ai)) {      /* the 2nd hint: X's hole flashes gold before X comes up */
          st.flashNext = false; const H = st.holes[holes[pick.indexOf(ai)]].back;
          st.scope.anim(H, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 10px #FFB400) drop-shadow(0 0 18px #FFE14A)' }, { filter: 'none' }], { duration: 700 });
          await this.hold(st, 520);
        }
        pick.forEach((i, j) => this.up(st, i, holes[j]));
        await this.hold(st, q.show);
        if (!Session.alive(st) || st.submitted || st.frozen) return;
        pick.forEach(i => this.down(st, i));
        await this.hold(st, 420);
      }
    },
    /* a pause the tests' 'wait' gesture may cut short */
    hold(st, ms) { return new Promise(res => { st.skip = res; W4X.tick(st, ms).then(res); }); },
    onGesture(st, name, p) {
      if (st.submitted) return false;
      if (name === 'wait') { if (st.skip) st.skip(); return 'free'; }
      if (name !== 'tap') return false;
      const i = K.cardIndex(p.id); if (i < 0 || !st.up[i]) return false;       /* an empty hole: nothing */
      st.frozen = true; st.tapped = i; Sfx.tap(); Session.submit(st, st.opts[i]);
      return 'ok';
    },
    async reveal(st) {
      const i = st.opts.indexOf(st.q.answer), d = st.cards[i], r = d.getBoundingClientRect(), a = Stage.toStage(r.left + r.width / 2, r.top);
      K.hop(st, d, 30); Sfx.thud();
      const ul = st.G.actors.ultraman; if (ul) ul.react('thrust');
      await ZX.alive(st, st.q.answer, a.x, Math.max(120, a.y - 60), 150);
      await this.down(st, i);
      const h = HOLES()[st.at[i] < 0 ? 0 : st.at[i]], star = ZX.thing(st, 80, 80, 8, 'objpop'); ZX.pic('assets/props/ui_star.png', star); place(star, h[0] - 40, h[1] - 60, 80, 80);
      st.scope.anim(star, [{ transform: 'translateY(30px) scale(.2)', opacity: 0 }, { transform: 'translateY(-30px) scale(1.2)', opacity: 1 }, { transform: 'translateY(-20px) scale(1)', opacity: 1 }], { duration: 520, easing: EASE.pop });
      Fx.burst(h[0], h[1] - 40, { n: 14, dist: 90 });
      sayItem(st.q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); Voice.say(W4X.thisIs(ans), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain: 1 his mole stays up, blue, its own picture ("这是地" was just said); 2 all five come up and stay (a beat); 3 X in gold
       with its picture, "这个是天" */
    async explain(st, ans) {
      const iC = st.tapped, iR = st.opts.indexOf(st.q.answer);
      W4X.exChosen(st, st.cards[iC], ans);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => { const used = st.at.filter((h, i) => st.up[i]), free = [0, 1, 2, 3, 4].filter(h => !used.includes(h)); st.opts.forEach((k, i) => { if (!st.up[i]) this.up(st, i, free.shift()); }); }, 650);
      await W4X.exRight(st, st.cards[iR], st.q.answer, [W4X.thatIs(st.q.answer)]);
    },
    gestureHint(st, reteach) {
      if (reteach) { st.cards.forEach((c, i) => { if (st.up[i]) K.hop(st, c, 20); }); return; }
      st.flashNext = true;                         /* real help: X's hole lights before it comes (no star after it) */
      const i = st.opts.indexOf(st.q.answer);
      if (st.up[i]) { st.flashNext = false; st.scope.anim(st.holes[st.at[i]].back, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 10px #FFB400) drop-shadow(0 0 18px #FFE14A)' }, { filter: 'none' }], { duration: 700 }); }
    },
    next(st, strat) {
      if (!st.up) return null;
      const ai = st.opts.indexOf(st.q.answer), i = strat === 'wrong' ? st.opts.findIndex((k, j) => j !== ai && st.up[j]) : (st.up[ai] ? ai : -1);
      if (i < 0) return W4X.WAIT;
      const r = st.cards[i].getBoundingClientRect(), c = Stage.toStage(r.left + r.width / 2, r.top + r.height / 2);      /* a mole sits in its hole's box: where it really is */
      return { g: 'tap', p: { id: 'card' + i }, x: c.x, y: c.y };
    },
    find(st, id) { return id === 'wait' ? st.holes && st.holes[2].back : (st.map && st.map[id]) || null; },
    workEls(st) { return (st.cards || []).filter((c, i) => st.up && st.up[i]); },
    exPrep(st) { st.frozen = true; },
    cleanup(st) { st.frozen = true; },
    snap(st) { return { opts: st.opts || null, up: (st.up || []).filter(Boolean).length, many: st.q.many, show: st.q.show }; },
    iconNode() { const d = el('div'); d.innerHTML = MOLE_SVG; Object.assign(d.style, { width: '80%', height: '80%' }); return d; },
  };

  /* ---------------------------------------------------------------- ①-3 英文 「变！」 变身换字母 (phoneme substitution)
     The changing machine shows a word (cat) and, beside it, the picture of the word to make (hat). Change one letter: level 1
     only the first box changes (tap a letter); from level 2 tap the box to change, then a letter (the question asks both: which
     box AND which letter - a random pair is right 1 time in 15). Levels: 1 -at words, both words said; 2 -at and -an, only the
     word to make said, the box to change is the first; 3 more families (-ap -ug -ig) and look-alike letters among the five
     (b/d, p/q, m/n, h/n); 4 the box to change may be any (cat -> cap); 5 two changes in a row (man -> map -> mop), both right. */
  const DICT = W4D.dict;                     /* real CVC words (tools/content.py DICT4): a made word is said if it is one */
  const FAM = { 1: ['at'], 2: ['at', 'an'], 3: ['at', 'an', 'ap', 'ug', 'ig'] };
  const PAIRS4 = [['cat', 'cap'], ['cap', 'cup'], ['map', 'mop'], ['mop', 'top'], ['bat', 'bag'], ['man', 'map'], ['map', 'mat'], ['run', 'rug'], ['bug', 'bun'], ['rug', 'mug']];
  const CHAINS5 = [['man', 'map', 'mop'], ['cat', 'cap', 'cup'], ['bun', 'bug', 'rug'], ['mat', 'map', 'mop'], ['rat', 'mat', 'map']];
  const LOOKL = { b: 'd', d: 'b', p: 'q', q: 'p', m: 'n', n: 'mh', h: 'n', u: 'n' };
  const CONS = 'bcdfghjklmnprstvwz';
  const picOf = w => { const x = W4D.words.find(v => v[0] === w) || WORDS3.find(v => v[0] === w); return x ? x[1] : null; };
  const W4WORDS = () => Array.from(new Set(W4D.words.map(v => v[0]).concat(WORDS3.map(v => v[0])))).filter(w => W4X.hasPic(picOf(w)));
  const diffAt = (a, b) => [0, 1, 2].filter(i => a[i] !== b[i]);
  const Change = {
    rule: 'change-one-letter', kind0: 'en', verb: '变！', intro: '变身换字母！', softHint: true, props: [],
    /* one step: the letters to choose from (the right one + four), every one making a word we can say or no word at all */
    letters(G, from, to, slot, look) {
      const want = to[slot], vow = 'aeiou'.includes(want), pool = vow ? 'aeiou' : CONS, others = [];
      const add = c => { if (others.length < 4 && c !== want && c !== from[slot] && !others.includes(c)) others.push(c); };
      if (look) (LOOKL[want] || '').split('').forEach(add);
      G.rng.shuffle(pool.split('')).forEach(add);
      if (vow) G.rng.shuffle(CONS.split('')).forEach(add);
      return W4X.put(G, others, want);
    },
    gen(G, o) {
      const lv = o.level, words = W4WORDS(), last = (G.asked || []).slice(-1)[0];
      let steps;
      if (lv <= 3) {
        const fam = FAM[lv], cand = words.filter(w => fam.includes(w.slice(1)));
        const tos = cand.filter(w => w !== last && cand.some(x => x !== w && x.slice(1) === w.slice(1)));
        const to = bagFrom(G, 'to' + lv, tos.length ? tos : cand), from = G.rng.pick(cand.filter(x => x !== to && x.slice(1) === to.slice(1)));
        steps = [{ from, to, slot: 0 }];
      } else if (lv === 4) {
        const ok = PAIRS4.filter(([a, b]) => W4X.hasPic(picOf(b)) && b !== last), [from, to] = bagFrom(G, 'p4', ok.length ? ok : PAIRS4);
        steps = [{ from, to, slot: diffAt(from, to)[0] }];
      } else {
        const ok = CHAINS5.filter(c => c.slice(1).every(w => W4X.hasPic(picOf(w))) && c[2] !== last), c = bagFrom(G, 'c5', ok.length ? ok : CHAINS5);
        steps = [{ from: c[0], to: c[1], slot: diffAt(c[0], c[1])[0] }, { from: c[1], to: c[2], slot: diffAt(c[1], c[2])[0] }];
      }
      steps.forEach(s => { s.opts = this.letters(G, s.from, s.to, s.slot, lv >= 3); });
      const two = steps.length > 1, pickSlot = lv >= 2 ? 1 : 0;
      return { k: steps.map(s => s.from + '>' + s.to + ':' + s.opts.join('')), steps, word: steps[steps.length - 1].to, item: steps[steps.length - 1].to,
        answer: two ? 'all' : steps[0].to[steps[0].slot], seq: two ? steps.map(s => s.to[s.slot]) : null, opts: steps[0].opts,
        pickSlot, saidFrom: lv <= 1 ? 1 : 0, look: steps[0].opts.filter(c => (LOOKL[steps[0].to[steps[0].slot]] || '').includes(c)).length, anySlot: lv >= 4 ? 1 : 0, two: two ? 1 : 0, fams: (FAM[Math.min(3, lv)] || []).length };
    },
    itemOf() { return null; },
    hard(q) { return q.pickSlot * 2 + (1 - q.saidFrom) + q.look + q.anySlot * 2 + q.two * 4 + q.fams * 0.3; },
    async present(st) {
      const q = st.q;
      st.si = 0; st.slot = q.pickSlot ? -1 : 0; st.word = q.steps[0].from;
      const m = st.machine = ZX.thing(st, 480, 210, 5, 'item'); m.style.pointerEvents = 'none';
      m.innerHTML = '<svg viewBox="0 0 480 210" width="100%" height="100%"><rect x="6" y="20" width="468" height="184" rx="34" fill="#E23B3B" stroke="#2B2118" stroke-width="7"/><rect x="26" y="40" width="428" height="144" rx="24" fill="#C9D6E6" stroke="#2B2118" stroke-width="5"/>'
        + '<rect x="200" y="2" width="80" height="26" rx="10" fill="#4FA3E8" stroke="#2B2118" stroke-width="5"/><circle cx="240" cy="15" r="7" fill="#FFE14A" stroke="#2B2118" stroke-width="3"/><circle cx="34" cy="190" r="8" fill="#FFE14A"/><circle cx="446" cy="190" r="8" fill="#FFE14A"/></svg>';
      st.slots = [0, 1, 2].map(i => { const d = ZX.thing(st, 116, 116, 6, 'card'); d.style.background = '#fff'; if (q.pickSlot) K.reg(st, 'slot' + i, d, {}); else if (i > 0) d.style.opacity = 0.55; return d; });
      this.showWord(st);
      st.picEl = ZX.thing(st, 180, 180, 6, 'card'); st.picEl.classList.add('pic'); st.picEl.appendChild(W4X.pic(picOf(q.steps[0].to), 150));
      this.letterCards(st);
      this.place(st);
      K.pop(st, m); K.pop(st, st.picEl, 120);
      this.markSlot(st);
      const s = q.steps[0];
      st.prompt = s.to;
      if (q.saidFrom) { st.lead = s.from; Voice.say(s.from, { tag: 'prompt' }); }
      Voice.say(s.to, { tag: 'prompt' });
    },
    letterCards(st) {
      if (st.cards) st.cards.forEach(c => c.remove());
      const s = st.q.steps[st.si];
      K.cards(st, s.opts.map(c => Glyph.en(c, 92)), s.opts.slice(), Object.assign({ size: 130, gap: 24 }, this.cardSpot()));
    },
    showWord(st) { st.slots.forEach((d, i) => { d.innerHTML = ''; d.appendChild(Glyph.en(st.word[i], 84)); }); },
    markSlot(st) { st.slots.forEach((d, i) => { d.style.boxShadow = i === st.slot ? '0 0 0 5px #2B2118, 0 0 0 12px #FFE14A' : ''; }); },
    cardSpot() { return L() ? { cx: 560, cy: 540 } : { cx: 352, cy: 800, cols: 3 }; },
    place(st) {
      if (!st.machine) return;
      const Lx = L(), mx = Lx ? 200 : 112, my = Lx ? 96 : 300;
      place(st.machine, mx, my, 480, 210);
      st.slots.forEach((d, i) => { if (!d._lift) place(d, mx + 240 - 58 + (i - 1) * 132, my + 66, 116, 116); });
      place(st.picEl, Lx ? 730 : 262, Lx ? 112 : 104, 180, 180);
      K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot()));
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 86 : 80, L() ? 698 : 1016, L() ? 200 : 140); },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted || st.busy) return false;
      const m = /^slot(\d)$/.exec(p.id || '');
      if (m) { st.slot = Number(m[1]); this.markSlot(st); Sfx.tap(); K.hop(st, st.slots[st.slot], 18); return 'ok'; }
      const i = K.cardIndex(p.id); if (i < 0) return false;
      if (st.slot < 0) { st.slots.forEach(d => K.wiggle(st, d)); Voice.sayNow('先点一格！', { tag: 'how' }); return 'free'; }
      st.tapped = i; Sfx.tap();
      this.change(st, st.slot, st.opts[i]);
      return 'ok';
    },
    /* the letter flies into the box, the machine hums, the word changes and is said */
    async change(st, slot, c) {
      const q = st.q, s = q.steps[st.si], card = st.cards[st.opts.indexOf(c)], box = st.slots[slot];
      st.busy = true;
      const b = box.getBoundingClientRect(), r = card.getBoundingClientRect(), A = Stage.toStage(b.left, b.top), B = Stage.toStage(r.left, r.top);
      await K.flyTo(st, card, A.x + (b.width - r.width) / 2 / (Stage.s || 1), A.y + (b.height - r.height) / 2 / (Stage.s || 1), 320, 40, 1);
      if (!Session.alive(st)) return;
      card.style.visibility = 'hidden';
      st.word = st.word.slice(0, slot) + c + st.word.slice(slot + 1); this.showWord(st);
      Sfx.zap(); st.scope.anim(st.machine, [{ transform: 'scale(1)' }, { transform: 'scale(1.04,.96)' }, { transform: 'scale(1)' }], { duration: 300 });
      void B;
      if (st.word !== s.to) { st.made = st.word; Session.submit(st, st.word); return; }
      if (st.si + 1 < q.steps.length) {                  /* the first change of two: said, and the next picture */
        Voice.say(st.word, { tag: 'prompt' }); K.hop(st, st.picEl, 20);
        await st.scope.guard(Voice.afterSay(150));
        if (!Session.alive(st)) return;
        st.si++; st.slot = -1; this.markSlot(st);
        st.picEl.innerHTML = ''; st.picEl.appendChild(W4X.pic(picOf(q.steps[st.si].to), 150)); K.pop(st, st.picEl);
        this.letterCards(st); this.place(st);
        st.prompt = q.steps[st.si].to; Voice.say(st.prompt, { tag: 'prompt' });
        st.busy = false;
        return;
      }
      Session.submit(st, 'ok');
    },
    evaluate(st, ans) { return ans === 'ok'; },
    async reveal(st) {
      K.hop(st, st.picEl, 34); Sfx.reveal(); st.slots.forEach((d, i) => st.scope.timeout(() => K.hop(st, d, 20), 90 * i));
      const ul = st.G.actors.ultraman; if (ul) ul.react('thrust');
      Voice.say(st.q.word + '!', { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the word he made, said - or, made no word, "这个不是词" */
    async feedback(st) { const w = st.made; if (DICT.includes(w)) Voice.say(w, { tag: 'wrong' }); else Voice.say('这个不是词', { tag: 'wrong' }); await st.scope.wait(700); },
    /* explain: 1 the made word in blue (said; its picture when we have one); 2 the box to change and the right letter in gold:
       "换这一个"; 3 the machine makes the right word, said, its picture hops */
    async explain(st) {
      const q = st.q, s = q.steps[st.si], w = st.made, pic = DICT.includes(w) && picOf(w);
      st.cards.forEach(c => { c.style.visibility = ''; c.style.transform = ''; c.getAnimations().forEach(a => a.cancel()); });
      K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot()));      /* the letter he chose back in its row */
      EX.ring(st, st.machine, 'chosen', 4); if (st.cards[st.tapped]) EX.ring(st, st.cards[st.tapped], 'chosen');
      if (pic && W4X.hasPic(pic)) EX.picOver(st, st.machine, W4X.pic(pic, 88), 'chosen', 100);
      await EX.wait(st, 650);
      st.word = s.from; this.showWord(st); st.slot = s.slot; this.markSlot(st);
      const ci = st.opts.indexOf(s.to[s.slot]), card = st.cards[ci];
      EX.ring(st, st.slots[s.slot], 'right', 6); if (card) { EX.ring(st, card, 'right'); K.hop(st, card, 20); }
      await EX.say(st, ['换这一个']);
      await EX.wait(st, 300);
      if (card) {
        const b = st.slots[s.slot].getBoundingClientRect(), r = card.getBoundingClientRect(), A = Stage.toStage(b.left, b.top);
        await K.flyTo(st, card, A.x + (b.width - r.width) / 2 / (Stage.s || 1), A.y + (b.height - r.height) / 2 / (Stage.s || 1), 320, 40, 1);
        card.style.visibility = 'hidden';
      }
      st.word = s.to; this.showWord(st); Sfx.zap(); K.hop(st, st.picEl, 24);
      st.stepDirty = true;
      await EX.say(st, [s.to + '!']);
      await EX.wait(st, 250);
    },
    gestureHint(st, reteach) {
      if (reteach) { st.slots.forEach(d => K.hop(st, d, 16)); return; }
      if (st.hintDone) return; st.hintDone = true;          /* only the question again, slowly (softHint: the star stays) */
      K.hop(st, st.picEl, 22); Voice.say(st.q.steps[st.si].to, { tag: 'hint2' });
    },
    next(st, strat) {
      if (!st.cards || st.busy) return null;
      const s = st.q.steps[st.si], right = strat !== 'wrong';
      if (st.q.pickSlot && st.slot < 0) return { g: 'tap', p: { id: 'slot' + (right ? s.slot : (s.slot + 1) % 3) } };
      const i = right ? st.opts.indexOf(s.to[s.slot]) : st.opts.findIndex(c => c !== s.to[s.slot]);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).concat(st.q.pickSlot ? st.slots || [] : []); },
    snap(st) { return { opts: st.opts || null, si: st.si || 0, slot: st.slot, word: st.word || '' }; },
    iconNode() { const d = el('div'); d.style.display = 'flex'; d.style.alignItems = 'center'; d.appendChild(Glyph.word('cat', 30)); const a = el('div', '', d); a.innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M3 10H15M11 5L16 10L11 15" fill="none" stroke="#E23B3B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'; d.appendChild(Glyph.word('hat', 30)); return d; },
  };

  /* ---------------------------------------------------------------- ①-4 挑战 「古！」 古字变今字 (ancient form -> today's character)
     An ancient form (甲骨文 / 金文 style, src/w4/ancient.js) inked on an open scroll; which of five of today's characters did it
     become? Only characters the child knows (§5.3) are asked. Levels: 1 the thing's picture beside the ancient form, the others
     unlike in meaning and shape; 2 the ancient form alone; 3 look-alikes of today's character among the others (日/目/田, 人/大/天,
     土/上, 川/三); 4 the others of the same kind, their ancient forms alike too (牛: 羊 马 鸟 鱼); 5 two ancient forms side by side,
     a character for each (both right). The ancient form is not said (a picture to read); its 2nd hint draws today's first strokes
     over it (real help: no star). */
  const GROUP = ['牛羊马鸟鱼虫龙兔', '口目手耳足心牙头', '日月山水火川雨土田天地', '禾木米竹草', '人大天女子小'];
  const groupOf = k => GROUP.find(g => g.includes(k)) || '';
  const PICONLY = '马牙女竹';            /* forms a child may not see unaided: asked only with the picture beside them (level 1) */
  const ANC = (k, size, color) => {
    const f = W4X.ANCIENT && W4X.ANCIENT[k]; if (!f) return null;
    const s = svg('svg', { viewBox: '0 0 100 100', width: size, height: size }); s.style.overflow = 'visible';
    f.d.forEach(d => svg('path', { d, fill: 'none', stroke: color || '#2B2118', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s));
    return s;
  };
  const Ancient = {
    rule: 'ancient-to-modern', kind0: 'quiz', verb: '古！', intro: '古字变今字！', props: ['scroll'],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), has = k => !!(W4X.ANCIENT && W4X.ANCIENT[k]) && !!ITEM[k] && !!ITEM[k].obj;
      const ask = kn.filter(k => has(k) && (lv <= 1 || !PICONLY.includes(k))), two = lv >= 5;
      const first = W4X.pick(G, ask, 'anc');      /* the island's characters still to pass first (天 土 川) */
      const seq = [first];
      if (two) seq.push(G.rng.pick(ask.filter(k => k !== first && groupOf(k) !== groupOf(first)) .concat(ask.filter(k => k !== first)).slice(0, 8)));
      const lk = k => (LOOK[k] || '').split('').filter(x => kn.includes(x) && !(HOLDS[k] || '').includes(x));
      const others = [], add = x => { if (others.length < 5 - seq.length && !seq.includes(x) && !others.includes(x) && kn.includes(x) && !seq.some(s => (HOLDS[s] || '').includes(x))) others.push(x); };
      if (lv === 3 || lv === 5) seq.forEach(s => G.rng.shuffle(lk(s)).forEach(add));
      if (lv === 4) seq.forEach(s => G.rng.shuffle(groupOf(s).split('')).forEach(add));
      const unlike = x => !seq.some(s => groupOf(s) === groupOf(x) || lk(s).includes(x));
      G.rng.shuffle(kn.filter(unlike)).forEach(add);
      G.rng.shuffle(kn).forEach(add);
      const opts = W4X.put(G, others.concat(seq.slice(1)), first);
      return { k: [seq.join(''), opts.join('')], seq, answer: two ? 'all' : first, item: first, opts, pic: lv <= 1 ? 1 : 0, two: two ? 1 : 0,
        look: opts.filter(x => !seq.includes(x) && seq.some(s => lk(s).includes(x))).length, same: opts.filter(x => !seq.includes(x) && seq.some(s => groupOf(s) === groupOf(x))).length };
    },
    itemOf(st) { return W4X.own(st, st.q.seq[0]); },
    itemsOf(st) { return st.q.seq.slice(1); },
    hard(q) { return (1 - q.pic) * 2 + q.look * 1.5 + q.same * 1.2 + q.two * 5; },
    async present(st) {
      const q = st.q;
      st.ai = 0;
      st.scrolls = q.seq.map((k, i) => {
        const d = ZX.thing(st, 250, 250, 5, 'item'); d.style.pointerEvents = 'none';
        const bgp = img('assets/props/scroll.png', '', d); Object.assign(bgp.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' });
        const f = el('div', '', d); Object.assign(f.style, { position: 'absolute', left: '22%', top: '20%', width: '56%', height: '56%' }); f.appendChild(ANC(k, '100%'));
        d._f = f; K.pop(st, d, 100 * i);
        return d;
      });
      if (q.pic) { st.picEl = ZX.thing(st, 150, 150, 6, 'card'); st.picEl.classList.add('pic'); st.picEl.appendChild(W4X.pic(ITEM[q.seq[0]].obj, 128)); K.pop(st, st.picEl, 200); }
      K.cards(st, q.opts.map(k => Glyph.zh(k, 100)), q.opts, Object.assign({ size: 140, gap: 26 }, this.cardSpot()));
      this.place(st);
      K.say(st, '这是哪个字？');
    },
    cardSpot() { return L() ? { cx: 560, cy: 555 } : { cx: 352, cy: 790, cols: 3 }; },
    place(st) {
      if (!st.scrolls) return;
      const Lx = L(), n = st.scrolls.length, S = n > 1 ? 230 : 250;
      st.scrolls.forEach((d, i) => { const cx = (Lx ? 520 : 352) + (n > 1 ? (i ? 1 : -1) * (Lx ? 150 : 132) : 0); place(d, cx - S / 2, Lx ? 96 : 210, S, S); });
      if (st.picEl) place(st.picEl, Lx ? 690 : 500, Lx ? 146 : 470, 150, 150);
      K.cardsPlace(st, Object.assign({ gap: 26 }, this.cardSpot()));
      (st.done || []).forEach(([ci, si]) => { const c = st.cards[ci], s = st.scrolls[si]; if (c && s) { const b = box(s); place(c, b.x + b.w / 2 - 55, b.y + b.h - 20, 110, 110); } });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 86 : 80, L() ? 698 : 1016, L() ? 200 : 140); },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || (st.done || []).some(d => d[0] === i)) return false;
      const q = st.q, want = q.seq[st.ai];
      st.tapped = i; Sfx.tap();
      if (q.opts[i] !== want) { Session.submit(st, q.opts[i]); return 'ok'; }
      if (st.ai + 1 < q.seq.length) {                    /* the first of two: it goes under its scroll */
        (st.done = st.done || []).push([i, st.ai]); st.ai++;
        const s = box(st.scrolls[0]), c = st.cards[i]; K.flyTo(st, c, s.x + s.w / 2 - 55, s.y + s.h - 20, 320, 30, 1).then(() => { if (!st.scope.dead) { c.style.width = c.style.height = '110px'; c.style.transform = ''; } });
        Sfx.place(); return 'ok';
      }
      Session.submit(st, q.two ? 'all' : want);
      return 'ok';
    },
    async reveal(st) {
      const q = st.q, k = q.seq[q.seq.length - 1], e = st.cards[q.opts.indexOf(k)];
      K.hop(st, e, 30); Sfx.reveal();
      for (let i = 0; i < st.scrolls.length; i++) { const f = st.scrolls[i]._f; st.scope.anim(f, [{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], { duration: 600 }); }
      const ul = st.G.actors.ultraman; if (ul) ul.react('thrust');
      q.seq.forEach(x => Voice.say(ITEM[x].line, { tag: 'summary' })); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); Voice.say(W4X.thisIs(ans), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain: 1 the chosen card in blue with its own ancient form (and its picture); 2 the scroll's ancient form fades and today's
       character writes itself stroke by stroke over it - "古字变今字" (字从画里来); 3 the right card in gold with its picture */
    async explain(st, ans) {
      const q = st.q, si = Math.min(st.ai || 0, q.seq.length - 1), want = q.seq[si], eC = st.cards[st.tapped], eR = st.cards[q.opts.indexOf(want)], sc = st.scrolls[si];
      if (eC) { EX.ring(st, eC, 'chosen'); const f = ANC(ans, 84, EX_BLUE); EX.picOver(st, eC, f || ans, 'chosen'); }
      await EX.wait(st, 700);
      if (sc) {
        const b = box(sc), cx = b.x + b.w / 2, cy = b.y + b.h * 0.48;
        st.scope.anim(sc._f, [{ opacity: 1 }, { opacity: 0.18 }], { duration: 700, fill: 'forwards' });
        const W = new Writer(st, { kind: 'zh', glyph: want, level: 1, x: cx, y: cy, size: b.w * 0.62, bare: true, z: 36 });
        Voice.say('古字变今字', { tag: 'explain' });
        await W.demo(st, null, true, '#E8414B');
        st.stepDirty = true;
        await EX.wait(st, 300);
      }
      await W4X.exRight(st, eR, want, [W4X.thatIs(want)]);
    },
    /* the 2nd hint (real help): today's first strokes appear faintly over the ancient form */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 18), 100 * i)); return; }
      if (st.hintDone || !st.scrolls) return; st.hintDone = true;
      const want = st.q.seq[st.ai || 0], sc = st.scrolls[st.ai || 0], d = Hanzi.data && Hanzi.data[want]; if (!d || !sc) return;
      const s = svg('svg', { viewBox: '0 0 1024 1024', width: '100%', height: '100%' }), g = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s);
      d.s.slice(0, Math.min(2, d.s.length - 1)).forEach(o => svg('path', { d: o, fill: '#E8414B', opacity: 0.75 }, g));
      const o = el('div', '', sc); Object.assign(o.style, { position: 'absolute', left: '22%', top: '20%', width: '56%', height: '56%', pointerEvents: 'none' }); o.appendChild(s);
      st.scope.anim(o, [{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
    },
    next(st, strat) {
      if (!st.cards) return null;
      const want = st.q.seq[st.ai || 0], used = (st.done || []).map(d => d[0]);
      const i = strat === 'wrong' ? st.q.opts.findIndex((k, j) => k !== want && !used.includes(j)) : st.q.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    snap(st) { return { opts: st.opts || null, step: st.ai || 0 }; },
    iconNode() { const d = el('div'); Object.assign(d.style, { width: '74%', height: '74%' }); d.appendChild(ANC('山', '100%') || Glyph.zh('山', 56)); return d; },
  };

  w4Island('ultra4', [Moles, Change, Ancient]);
})();

/* ---------------- src/w4/peppa4.js */
/* ================================================================ 神笔海 ② 佩奇 · 小医院 (peppa4): 耳 足 头 牙 心 (docs/W4-DESIGN.md §6 ②)
   认字 「摸！」按顺序摸一摸 (two-in-order) · 写字 耳 头 (W4X.Write) · 英文 「找！」谁不是一家 (odd-one-out) ·
   挑战 「笔！」笔顺小老师 (which-stroke-first). The shape of src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  W4X.lines(['每排找一个！']);

  /* ---------------------------------------------------------------- ②-1 认字 「摸！」 按顺序摸一摸 (heard order + reading)
     Peppa the little doctor; five big character cards; a steel tray above them. The characters are said one after another
     ("耳，头"): touch them in that order - each right touch lights its card and its picture flies into the tray (no star for a
     step); the whole order right is the answer; a card out of turn (or another one) ends it. Levels: 1 two of the island's
     characters, the pictures in order on the task card; 2 heard only, said twice; 3 look-alikes (耳/目, 足/走/是, 心/小) and an
     old character among the others; 4 three characters (an old one may be asked), two old ones about; 5 three, said only
     once, three old ones about. A random order is right 1 time in 20 (two) / 60 (three). */
  const TRAY = n => 70 + 118 * n;                  /* the tray's width for n pictures (stage px; 124 high) */
  const trayHTML = n => {
    const w = TRAY(n);
    let s = '<svg viewBox="0 0 ' + w + ' 124" width="100%" height="100%"><path d="M16 30Q16 12 36 12H' + (w - 36) + 'Q' + (w - 16) + ' 12 ' + (w - 16) + ' 30L' + (w - 30) + ' 98Q' + (w - 34) + ' 116 ' + (w - 54) + ' 116H54Q34 116 30 98Z" fill="#D5E1EB" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M40 25H' + (w - 40) + '" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>';
    for (let i = 0; i < n; i++) s += '<circle cx="' + (94 + 118 * i) + '" cy="66" r="42" fill="#EEF4F8" stroke="#8FA3B5" stroke-width="4" stroke-dasharray="10 8"/>';
    return s + '</svg>';
  };
  const lookOf = k => LOOK[k] || '';
  const Touch = {
    rule: 'two-in-order', verb: '摸！', intro: '按顺序摸一摸！', props: [],
    gen(G, o) {
      const lv = o.level, pool = poolOf(G, 'zh', false), n = lv >= 4 ? 3 : 2;
      const first = W4X.pick(G, pool), opts = W4X.opts(G, lv, first, 5), seq = [first];
      /* the rest of the order from the cards: levels 1-3 the island's own, from level 4 an old one too - never a look-alike of
         one asked (that one stays the trap among the others) */
      const like = k => seq.some(s => lookOf(s).includes(k) || lookOf(k).includes(s));
      const add = k => { if (seq.length < n && !seq.includes(k) && !like(k)) seq.push(k); };
      G.rng.shuffle(opts.filter(k => k !== first && (lv >= 4 || pool.includes(k)))).forEach(add);
      G.rng.shuffle(opts.filter(k => k !== first)).forEach(k => { if (seq.length < n && !seq.includes(k)) seq.push(k); });
      return { k: [seq.join(''), opts.join('')], answer: 'all', seq, opts, item: first, n: seq.length, pic: lv <= 1 ? 1 : 0, once: lv >= 5 ? 1 : 0,
        look: opts.filter(k => !seq.includes(k) && seq.some(s => lookOf(s).includes(k) || lookOf(k).includes(s))).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: the pictures gone, look-alikes, old characters, three in the order, said only once */
    hard(q) { return (1 - q.pic) + q.look + q.rev * 0.8 + (q.n - 2) * 2.5 + q.once * 1.5; },
    /* the memory: a wrong order counts against the character that was due when it went wrong */
    itemOf(st) { const s = st.q.seq; return s[st.ok === false ? Math.min(st.ix || 0, s.length - 1) : 0]; },
    itemsOf(st) { return st.q.seq.slice(1); },
    async present(st) {
      const q = st.q;
      for (const k of q.seq) { await ZX.meet(st, k); if (!Session.alive(st)) return; }
      st.ix = 0; st.done = []; st.pics = [];
      st.tray = ZX.thing(st, TRAY(q.n), 124, 5, 'item'); st.tray.innerHTML = trayHTML(q.n);
      K.cards(st, q.opts.map(k => Glyph.zh(k, 104)), q.opts.slice(), Object.assign({ size: 150, gap: 24 }, this.cardSpot()));
      this.place(st);
      K.pop(st, st.tray);
      st.taskEl = K.task(st, q.pic ? q.seq.map(k => [OBJURL(ITEM[k].obj)]) : [['speaker']]);
      st.lead = q.seq.slice(0, -1); st.prompt = q.seq[q.seq.length - 1];      /* the hints and the avatar say the whole order again */
      this.sayOrder(st);
    },
    /* the order, one recorded character after another (no combined sentence); twice, level 5 once. Not awaited: the cards can be
       touched while it is said (a touch hushes it) */
    async sayOrder(st) {
      try {
        const q = st.q;
        for (let t = 0; t < (q.once ? 1 : 2); t++) {
          if (t) { await st.scope.guard(Voice.afterSay(450)); if (!Session.alive(st) || st.ix || st.submitted) return; }
          q.seq.forEach(k => Voice.say(k, { tag: 'prompt' }));
        }
      } catch (e) { /* a prompt never ends a question */ }
    },
    cardSpot() { return L() ? { cx: 572, cy: 455 } : { cx: 352, cy: 770, cols: 3 }; },
    trayAt(st) { const w = TRAY(st.q.n); return { x: (L() ? 572 : 352) - w / 2, y: L() ? 118 : 250, w, h: 124 }; },
    slotAt(st, j) { const t = this.trayAt(st); return { x: t.x + 94 + 118 * j - 44, y: t.y + 66 - 44, w: 88, h: 88 }; },
    place(st) {
      if (!st.tray) return;
      const t = this.trayAt(st); place(st.tray, t.x, t.y, t.w, t.h);
      K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot()));
      st.pics.forEach((p, j) => { if (p && p._in) { const s = this.slotAt(st, j); place(p, s.x, s.y, s.w, s.h); } });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* the place in the order on a touched card: a little numbered badge on its corner */
    badge(st, i, j) {
      const c = st.cards[i]; if (!c) return;
      (c._badge || { remove() {} }).remove();
      const b = c._badge = el('div', '', c); b.textContent = String(j + 1);
      Object.assign(b.style, { position: 'absolute', left: '-14px', top: '-14px', width: '40px', height: '40px', borderRadius: '50%', background: '#FF8DB3', color: '#fff', font: '900 26px system-ui,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 3px #2B2118', pointerEvents: 'none' });
      K.pop(st, b);
    },
    /* a card's picture flies from it into the next place of the tray */
    toTray(st, i, j) {
      const c = box(st.cards[i]), s = this.slotAt(st, j), f = ZX.thing(st, s.w, s.h, 41, 'objpop');
      ZX.pic(OBJURL(ITEM[st.opts[i]].obj), f); place(f, c.x + c.w / 2 - s.w / 2, c.y + c.h / 2 - s.h / 2, s.w, s.h);
      if (st.pics[j]) st.pics[j].remove();
      st.pics[j] = f;
      return K.flyTo(st, f, s.x, s.y, 420, 70, 1).then(() => { f._in = true; });
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || st.done.includes(i)) return false;      /* a card touched already: nothing */
      const q = st.q, k = st.opts[i];
      st.tapped = i; Sfx.tap();
      if (k !== q.seq[st.ix]) { Session.submit(st, k); return 'ok'; }
      st.done.push(i); st.ix++; st.cards[i].classList.add('hi'); K.hop(st, st.cards[i], 20); Sfx.place();
      this.badge(st, i, st.ix - 1); this.toTray(st, i, st.ix - 1);
      if (st.ix >= q.seq.length) Session.submit(st, 'all');
      return 'ok';
    },
    async reveal(st) {
      const a = st.G.actors[this.chars[0]]; if (a) a.react('hop');
      Sfx.reveal(); K.hop(st, st.tray, 16);
      st.pics.forEach((p, j) => st.scope.timeout(() => K.hop(st, p, 28), 150 * j));
      st.q.seq.forEach(k => Voice.say(k, { tag: 'summary' }));
      this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 the card touched out of turn in blue with its picture ("这是目" was just said); 2 Peppa touches them in order, one
       by one: each card in gold, its picture into the tray, the character said */
    async explain(st, ans) {
      const q = st.q, a = st.G.actors[this.chars[0]];
      W4X.exChosen(st, st.cards[st.tapped], ans);
      await EX.wait(st, 800);
      st.pics.forEach(p => p && p.remove()); st.pics = []; st.cards.forEach(c => { c.classList.remove('hi'); if (c._badge) { c._badge.remove(); c._badge = null; } });
      for (let j = 0; j < q.seq.length; j++) {
        const i = st.opts.indexOf(q.seq[j]);
        if (a) a.react('hop');
        EX.ring(st, st.cards[i], 'right'); K.hop(st, st.cards[i], 20);
        this.badge(st, i, j); this.toTray(st, i, j);
        await EX.say(st, [q.seq[j]]);
        await EX.wait(st, 250);
      }
    },
    /* the 2nd hint (real help, no star after it): the card to touch next hops a little */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 18), 110 * i)); return; }
      const i = st.opts.indexOf(st.q.seq[st.ix || 0]); if (i < 0) return;
      K.hop(st, st.cards[i], 16); st.scope.timeout(() => K.hop(st, st.cards[i], 10), 420);
    },
    next(st, strat) {
      if (!st.cards || !st.done) return null;
      const want = st.q.seq[st.ix || 0], i = strat === 'wrong' ? st.opts.findIndex((k, j) => k !== want && !st.done.includes(j)) : st.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).filter((c, i) => !(st.done || []).includes(i)); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() {
      return W4X.svgIcon('<rect x="4" y="12" width="22" height="28" rx="6" fill="#fff" stroke="#2B2118" stroke-width="3"/><text x="15" y="33" text-anchor="middle" font-size="18" font-weight="900" fill="#E8414B" font-family="system-ui,sans-serif">1</text>'
        + '<path d="M28 26H33M31 22L35 26L31 30" fill="none" stroke="#2B2118" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
        + '<rect x="36" y="12" width="22" height="28" rx="6" fill="#fff" stroke="#2B2118" stroke-width="3"/><text x="47" y="33" text-anchor="middle" font-size="18" font-weight="900" fill="#2E6FD8" font-family="system-ui,sans-serif">2</text>'
        + '<path d="M10 50Q30 58 52 50" fill="none" stroke="#FF8DB3" stroke-width="4" stroke-linecap="round"/>');
    },
  };

  /* ---------------------------------------------------------------- ②-3 英文 「找！」 谁不是一家 (the written word family)
     Five word cards, four of one family (the same tail: bug rug mug jug) and one that is not (hen); the words are read, not
     said. Tap the one that is not of the family. Levels: 1 a picture on every card, the odd one differs in vowel and end; 2 no
     pictures; 3 the odd one has the family's vowel, another end (bun); 4 the family's last letter, another vowel (bag); 5 two
     rows, one odd one in each (one of each kind) - both found. George reads them for whoever taps his speaker: that question
     earns no star. A random tap is right 1 time in 5 (two rows: 1 in 25). */
  const EASYW = 'big dig hop pop men ten fun run hit sit bit fit hot pot dot not wet pet sad dad bad mad bag tag rag wag lip hip tip zip red fed hug tug pin win tin bin fog hog jog cut hut nut';
  let FAMS = null;
  const fams = () => {
    if (FAMS) return FAMS;
    const pic = {};
    W4D.words.concat(WORDS3).forEach(([w, o]) => { if (/^[a-z]{3}$/.test(w) && !pic[w] && W4X.hasPic(o)) pic[w] = o; });
    const all = Array.from(new Set(Object.keys(pic).concat(EASYW.split(' ')))).filter(w => /^[a-z]{3}$/.test(w) && W4D.dict.includes(w));
    const by = {}; all.forEach(w => (by[w.slice(1)] = by[w.slice(1)] || []).push(w));
    return (FAMS = { pic, all, by });
  };
  /* the odd one's kind: both letters of the tail differ / only the end (same vowel) / only the vowel (same end) */
  const oddOk = { both: (w, r) => w[1] !== r[0] && w[2] !== r[1], vowel: (w, r) => w[1] === r[0] && w[2] !== r[1], end: (w, r) => w[1] !== r[0] && w[2] === r[1] };
  const GOLDT = '#E39B00';
  const OddOne = {
    rule: 'odd-one-out', kind0: 'en', verb: '找！', intro: '谁不是一家？', props: [],
    row(G, F, kind, pic, used) {
      const words = (pic ? F.all.filter(w => F.pic[w]) : F.all).filter(w => !used.has(w));
      const odds = r => words.filter(w => w.slice(1) !== r && oddOk[kind](w, r));
      const ok = Object.keys(F.by).filter(r => F.by[r].filter(w => words.includes(w)).length >= 4 && odds(r).length && !used.has('-' + r));
      const r = bagFrom(G, 'fam' + kind + (pic ? 'p' : ''), ok), fam = G.rng.shuffle(F.by[r].filter(w => words.includes(w))).slice(0, 4), odd = G.rng.pick(odds(r));
      fam.concat([odd, '-' + r]).forEach(w => used.add(w));
      return { rime: r, fam, odd, kind, opts: W4X.put(G, fam, odd) };
    },
    gen(G, o) {
      const lv = o.level, F = fams(), used = new Set(), pic = lv <= 1;
      const kinds = lv >= 5 ? G.rng.shuffle(['vowel', 'end']) : [lv <= 2 ? 'both' : lv === 3 ? 'vowel' : 'end'];
      const rows = kinds.map(kind => this.row(G, F, kind, pic, used)), two = rows.length > 1;
      return { k: rows.map(r => r.opts.join(',')), rows, opts: [].concat(...rows.map(r => r.opts)), answer: two ? 'all' : rows[0].odd, seq: two ? rows.map(r => r.odd) : null,
        pic: pic ? 1 : 0, two: two ? 1 : 0, vow: rows.filter(r => r.kind === 'vowel').length, end: rows.filter(r => r.kind === 'end').length };
    },
    itemOf() { return null; },
    hard(q) { return (1 - q.pic) + q.vow * 1.5 + q.end * 2 + q.two * 3; },
    build(G) { ZBase.build.call(this, G); if (!G.actors.george) K.actor(G, 'george', 170); },
    decor(G) { this.chars.forEach(id => hideActor(G.actors[id])); const g = G.actors.george; if (g) showActor(g, L() ? 84 : 84, L() ? 698 : 1016, L() ? 170 : 140); },
    wordNode(st, w, cols) { const h = st.q.pic ? 44 : st.q.two ? 50 : 60; return cols ? Glyph.wordC(w, h, cols) : Glyph.word(w, h); },
    async present(st) {
      const q = st.q, F = fams();
      st.found = q.rows.map(() => false); st.row = 0;
      if (q.two) st.panels = q.rows.map(() => { const d = ZX.thing(st, 10, 10, 3, 'item'); Object.assign(d.style, { background: 'rgba(255,253,244,.55)', borderRadius: '30px', boxShadow: '0 0 0 4px rgba(43,33,24,.18)' }); return d; });
      const nodes = q.opts.map(w => {
        const d = el('div', ''); Object.assign(d.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', pointerEvents: 'none' });
        if (q.pic) d.appendChild(W4X.pic(F.pic[w], 80));
        const g = el('div', '', d); g.style.lineHeight = '0'; g.appendChild(this.wordNode(st, w)); d._g = g;
        return d;
      });
      K.cards(st, nodes, q.opts.slice(), Object.assign({ size: q.two ? 124 : 150 }, this.cardSpot(st)));
      /* George's speaker: a tap reads the words to the child (then this question earns no star) */
      const r = st.readEl = el('div', 'card', Stage.el); r.style.position = 'absolute'; st.els.push(r);
      r.innerHTML = ICONS.speaker; Object.assign(r.firstChild.style, { width: '62%', height: '62%' }); r.style.background = '#FFF6D8';
      const tl = el('div', '', r); tl.innerHTML = '<svg viewBox="0 0 30 24" width="30" height="24"><path d="M2 0L28 0L10 22Z" fill="#FFF6D8" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><path d="M3 0H27" stroke="#FFF6D8" stroke-width="5"/></svg>';
      Object.assign(tl.style, { position: 'absolute', left: '34px', bottom: '-22px', width: '30px', height: '24px', pointerEvents: 'none' });      /* George's speech bubble */
      K.reg(st, 'read', r, {});
      this.place(st);
      K.pop(st, r, 200);
      K.say(st, '谁不是一家？');
      if (q.two) Voice.say('每排找一个！', { tag: 'prompt' });
    },
    cardSpot(st) {
      const two = st && st.q && st.q.two;
      if (two) return L() ? { cx: 590, cy: 380, cols: 5, gap: 18, rowGap: 70 } : { cx: 352, cy: 560, cols: 5, gap: 12, rowGap: 70 };
      return L() ? { cx: 588, cy: 420, gap: 22 } : { cx: 352, cy: 620, cols: 3, gap: 26 };
    },
    place(st) {
      if (!st.readEl) return;
      K.cardsPlace(st, this.cardSpot(st));
      place(st.readEl, L() ? 34 : 34, L() ? 400 : 770, 100, 100);
      (st.panels || []).forEach((d, r) => {
        const a = box(st.cards[r * 5]), b = box(st.cards[r * 5 + 4]);
        place(d, a.x - 14, a.y - 14, b.x + b.w - a.x + 28, a.h + 28);
      });
    },
    /* the word on card i again, its tail (letters 2 and 3) in a colour - or plain */
    tail(st, i, color) {
      const c = st.cards[i], g = c && c.firstChild && c.firstChild._g; if (!g) return;
      const w = st.opts[i]; g.innerHTML = ''; g.appendChild(this.wordNode(st, w, color ? [INK, color, color] : null));
    },
    /* a tap on George's speaker: the words one after another (never more than the voice queue holds) - no star now */
    async readOut(st) {
      st.peeked = true; st.noStar = true;
      const my = (st.readN = (st.readN || 0) + 1);
      K.hop(st, st.readEl, 12);
      const g = st.G.actors.george; if (g) g.react('hop');
      try {
        for (let i = 0; i < st.opts.length; i++) {
          if (!Session.alive(st) || st.readN !== my || st.submitted) return;
          K.hop(st, st.cards[i], 14);
          (i ? Voice.say : Voice.sayNow).call(Voice, st.opts[i], { tag: 'peek' });
          await st.scope.guard(Voice.afterSay(120));
        }
      } catch (e) { /* reading out never ends a question */ }
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      if (p.id === 'read') { this.readOut(st); return 'ok'; }
      const i = K.cardIndex(p.id); if (i < 0) return false;
      const q = st.q, r = Math.floor(i / 5); if (st.found[r]) return false;
      const w = st.opts[i];
      st.tapped = i; st.row = r; Sfx.tap();
      if (w !== q.rows[r].odd) { Session.submit(st, w); return 'ok'; }
      st.found[r] = true; st.cards[i].classList.add('hi'); K.hop(st, st.cards[i], 20);
      if (st.found.every(Boolean)) Session.submit(st, q.two ? 'all' : w); else { Sfx.place(); const g = st.G.actors.george; if (g) g.hop(); }
      return 'ok';
    },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      q.rows.forEach(row => { K.hop(st, st.cards[st.opts.indexOf(row.odd)], 30); row.fam.forEach(w => this.tail(st, st.opts.indexOf(w), GOLDT)); });
      const g = st.G.actors.george; if (g) g.cheer();
      q.rows.forEach(row => Voice.say(row.odd + '!', { tag: 'summary' }));
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the word he tapped, said */
    wrongLine(st, ans) { return ans; },
    /* explain: 1 his card in blue, said - its tail and a neighbour's in gold, the same ("rug, bug"); 2 the whole family's tails in
       gold (a beat); 3 the odd one in a gold ring, said ("hen") */
    async explain(st, ans) {
      const q = st.q, row = q.rows[st.row || 0], iC = st.tapped;
      const fi = row.fam.map(w => st.opts.indexOf(w)).filter(i => i !== iC), iM = fi.slice().sort((a, b) => Math.abs(a - iC) - Math.abs(b - iC))[0];
      EX.ring(st, st.cards[iC], 'chosen');
      this.tail(st, iC, GOLDT); if (iM != null) this.tail(st, iM, GOLDT);
      await EX.say(st, [ans, st.opts[iM]]);
      await EX.wait(st, 250);
      await W4X.exBeat(st, () => { fi.forEach((i, j) => { this.tail(st, i, GOLDT); st.scope.timeout(() => K.hop(st, st.cards[i], 14), 90 * j); }); }, 650);
      await W4X.exRight(st, st.cards[st.opts.indexOf(row.odd)], row.odd, [row.odd], false);
    },
    /* the 2nd hint (real help, no star after it): the tails of the family light up together for a moment */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 80 * i)); return; }
      const lit = []; st.q.rows.forEach((row, r) => { if (!st.found[r]) row.fam.forEach(w => lit.push(st.opts.indexOf(w))); });
      lit.forEach(i => this.tail(st, i, GOLDT));
      st.scope.timeout(() => { if (!st.submitted) lit.forEach(i => this.tail(st, i, null)); }, 1700);
    },
    next(st, strat) {
      if (!st.cards || !st.found) return null;
      const r = st.found.indexOf(false); if (r < 0) return null;
      const row = st.q.rows[r], i = strat === 'wrong' ? st.opts.indexOf(row.fam[0]) : st.opts.indexOf(row.odd);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).filter((c, i) => st.found && !st.found[Math.floor(i / 5)]); },
    snap(st) { return { opts: st.opts || null, found: (st.found || []).filter(Boolean).length, peeked: !!st.peeked }; },
    iconNode() {
      const d = el('div'); Object.assign(d.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '0' });
      d.appendChild(Glyph.wordC('rug', 26, [INK, GOLDT, GOLDT])); d.appendChild(Glyph.wordC('hen', 26, ['#9A8F80', '#9A8F80', '#9A8F80']));
      return W4X.icon(d);
    },
  };

  /* ---------------------------------------------------------------- ②-4 挑战 「笔！」 笔顺小老师 (which of two strokes first)
     Two 田字格 (landscape side by side, portrait one above the other), a character the child knows in each, grey, with two of its
     strokes in orange and blue. Under each, two buttons: the orange stroke and the blue one, each in its place. For each
     character tap the stroke written FIRST. Two answers only - so it asks two at once (both right: 1 time in 4 by chance). The
     pairs and their rules are listed by hand (tools/content.py ORDER_PAIRS, GF 0023-2020; the program never guesses a rule).
     Levels: 1 先横后竖 / 从上到下, the two strokes next to each other; 2 + 先撇后捺 / 从左到右; 3 + 先中间后两边 / 先外后内;
     4 + 先进去后关门 and strokes apart (the ones between grey); 5 two strokes of one kind (川's two 竖, 雪's dots): only where they
     are tells. 2nd hint (real help): the brush writes up to the first of the two and waits on it. */
  const ORANGE = '#F28C1E', BLUE = '#2F7FE0', GREYS = '#C6BDAF', FAINT = '#ECE5D8';
  const Strokes = {
    rule: 'which-stroke-first', kind0: 'quiz', verb: '笔！', intro: '先写哪一笔？', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), P = W4D.orderPairs.filter(p => kn.includes(p[0])), top = P.filter(p => p[4] === lv), upto = P.filter(p => p[4] <= lv);
      const A = bagFrom(G, 'pr' + lv, top.length ? top : upto);
      const rest = (lv >= 5 && top.length > 1 ? top : upto).filter(p => p[0] !== A[0]), other = rest.filter(p => p[3] !== A[3]);
      const B = G.rng.pick(other.length ? other : rest.length ? rest : P.filter(p => p[0] !== A[0]));
      const two = G.rng.shuffle([A, B]);
      const pairs = two.map(p => { const fl = PICK(G, 'fl', [0, 1]); return { c: p[0], f: p[1], o: p[2], r: W4D.orderRules.indexOf(p[3]), lv: p[4], col: fl ? [p[2], p[1]] : [p[1], p[2]] }; });
      return { k: pairs.map(p => p.c + p.f + '-' + p.o + ':' + p.col[0]), pairs, answer: 'all', seq: pairs.map(p => p.f), opts: null, asks: pairs.map(p => ({ opts: p.col.slice(), answer: p.f })),
        far: pairs.filter(p => p.o - p.f > 1).length, lvs: pairs.reduce((s, p) => s + p.lv, 0) };
    },
    itemOf() { return null; },
    hard(q) { return q.lvs + q.far * 0.5; },
    async present(st) {
      const q = st.q;
      st.got = q.pairs.map(() => false); st.ask = 0;
      st.grids = q.pairs.map(p => this.grid(st, p));
      const nodes = [], vals = [];
      q.pairs.forEach((p, j) => p.col.forEach((s, c) => { nodes.push(this.strokeNode(p.c, s - 1, c ? BLUE : ORANGE)); vals.push(j + ':' + s); }));
      K.cards(st, nodes, vals, { size: 120 });
      st.cards.forEach((c, i) => { c.style.borderColor = i & 1 ? BLUE : ORANGE; });
      this.place(st);
      st.grids.forEach((g, j) => K.pop(st, g, 120 * j));
      K.say(st, '先写哪一笔？');
    },
    /* a 田字格 with the character in grey, the two strokes in orange and blue */
    grid(st, p) {
      const d = ZX.thing(st, 240, 240, 6, 'item');
      Object.assign(d.style, { background: '#FFFDF6', borderRadius: '10px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.2)' });
      const s = svg('svg', { viewBox: '0 0 1024 1024', width: '100%', height: '100%' }, d);
      svg('rect', { x: 10, y: 10, width: 1004, height: 1004, fill: 'none', stroke: '#E8414B', 'stroke-width': 14 }, s);
      ['M512 20V1004', 'M20 512H1004', 'M20 20L1004 1004', 'M1004 20L20 1004'].forEach((dd, i) => svg('path', { d: dd, stroke: '#E8414B', 'stroke-width': i < 2 ? 6 : 4, 'stroke-dasharray': i < 2 ? '28 20' : '14 24', opacity: i < 2 ? 0.55 : 0.3, fill: 'none' }, s));
      const g = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s), data = Hanzi.data && Hanzi.data[p.c];
      d._paths = data ? data.s.map((o, i) => svg('path', { d: o, fill: i === p.col[0] - 1 ? ORANGE : i === p.col[1] - 1 ? BLUE : GREYS }, g)) : [];
      return d;
    },
    /* a button: the character's other strokes faint, this one in its colour, where it is in the character */
    strokeNode(ch, i, color) {
      const s = svg('svg', { viewBox: '0 0 1024 1024', width: '88%', height: '88%' }), g = svg('g', { transform: 'translate(0,900) scale(1,-1)' }, s), data = Hanzi.data && Hanzi.data[ch];
      if (data) data.s.forEach((o, k) => svg('path', { d: o, fill: k === i ? color : FAINT }, g));
      s.style.pointerEvents = 'none';
      return s;
    },
    spot(j) {
      if (L()) { const cx = j ? 742 : 330; return { g: [cx - 125, 112, 250], b: [[cx - 130, 404], [cx + 10, 404]], bs: 120 }; }
      const y = j ? 548 : 168; return { g: [86, y, 250], b: [[392, y + 65], [536, y + 65]], bs: 120 };
    },
    place(st) {
      if (!st.grids) return;
      st.q.pairs.forEach((p, j) => {
        const S = this.spot(j); place(st.grids[j], S.g[0], S.g[1], S.g[2], S.g[2]);
        [0, 1].forEach(c => { const e = st.cards[2 * j + c]; if (e) place(e, S.b[c][0], S.b[c][1], S.bs, S.bs); });
      });
      if (st.writer) { const b = box(st.grids[st.writer.j]); st.writer.W.place(b.x + b.w / 2, b.y + b.h / 2, b.w); }
    },
    cardSpot() { return {}; },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || i > 3) return false;
      const j = i >> 1, pr = st.q.pairs[j]; if (st.got[j]) return false;
      st.tapped = i; st.ask = j; Sfx.tap();
      if (pr.col[i & 1] !== pr.f) { Session.submit(st, 'later'); return 'ok'; }
      st.got[j] = true; st.cards[i].classList.add('hi'); st.cards[i ^ 1].classList.add('dim'); K.hop(st, st.cards[i], 18); Sfx.place();
      const path = st.grids[j]._paths[pr.f - 1]; if (path) st.scope.anim(path, [{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], { duration: 500 });
      if (st.got.every(Boolean)) Session.submit(st, 'all');
      return 'ok';
    },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      q.pairs.forEach((pr, j) => K.hop(st, st.grids[j], 22));
      const a = st.G.actors[this.chars[0]]; if (a) a.react('hop');
      Array.from(new Set(q.pairs.map(p => p.r))).forEach(r => Voice.say(W4D.orderRules[r], { tag: 'summary' }));
      this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    wrongLine() { return '这一笔后写'; },
    /* a Writer without a grid over a 田字格 (the brush of the explanation and of the 2nd hint) */
    pen(st, j) {
      if (st.writer && st.writer.j === j) return st.writer.W;
      const b = box(st.grids[j]), W = new Writer(st, { kind: 'zh', glyph: st.q.pairs[j].c, level: 1, x: b.x + b.w / 2, y: b.y + b.h / 2, size: b.w, bare: true, z: 36 });
      st.writer = { j, W };
      return W;
    },
    /* explain: 1 the stroke he chose in blue ("这一笔后写" was just said); 2 the brush writes the character to the later of the two,
       stopping at each, the right button in gold: "先写这一笔"; 3 the rule ("先横后竖") */
    async explain(st) {
      const q = st.q, j = st.ask || 0, pr = q.pairs[j], iR = 2 * j + pr.col.indexOf(pr.f);
      W4X.exChosen(st, st.cards[st.tapped], null);
      await EX.wait(st, 450);
      if (st.writer && st.writer.W.el) { st.writer.W.el.remove(); st.writer = null; }
      if (st.hintBrush) st.hintBrush.remove();
      const W = this.pen(st, j), last = Math.max(pr.f, pr.o);
      (st.grids[j]._paths || []).forEach(p => p.setAttribute('opacity', 0.3));
      await W4X.exBeat(st, async () => {
        for (let i = 0; i < last; i++) {
          if (i === pr.f - 1 || i === pr.o - 1) { await this.brush(st, W, i, i === pr.col[0] - 1 ? ORANGE : BLUE); await EX.tick(st, 160); }
          else { W.ink(i, INK, 80); await EX.tick(st, 90); }
        }
      }, 100);
      EX.ring(st, st.cards[iR], 'right'); K.hop(st, st.cards[iR], 18);
      await EX.say(st, ['先写这一笔', W4D.orderRules[pr.r]]);
      await EX.wait(st, 250);
    },
    /* the brush writes one stroke (its ink sweeps along the stroke's centre line, the brush tip with it) */
    async brush(st, W, i, color) {
      const sk = W.strokes[i]; if (!sk) return;
      const dur = clamp(sk.L / W.S * 800, 260, 520), bs = W.box.w * 0.24, br = ZX.thing(st, bs, bs, 37, 'objpop');
      ZX.pic('assets/props/brush.png', br);
      const pts = Geo.resample(sk.med, 10).map(q => W.toStage(q)), at = q => ({ left: (q.x - bs * 0.18) + 'px', top: (q.y - bs * 0.92) + 'px' });
      place(br, pts[0].x - bs * 0.18, pts[0].y - bs * 0.92, bs, bs);
      W.ink(i, color, dur); Sfx.nz(0, dur / 1000, 1400, 900, 0.6, 0.05);
      await st.scope.anim(br, pts.map(at), { duration: dur, easing: 'linear', fill: 'forwards' });
      br.remove();
    },
    /* the 2nd hint (real help, no star after it): on the first character not done, the brush writes the strokes before the two
       and rests at the start of the one written first */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 100 * i)); return; }
      if (st.hintDone) return; st.hintDone = true;
      const j = st.got.indexOf(false); if (j < 0) return;
      const pr = st.q.pairs[j], W = this.pen(st, j);
      for (let i = 0; i < pr.f - 1; i++) W.ink(i, INK, 220);
      const sk = W.strokes[pr.f - 1]; if (!sk) return;
      const p0 = W.toStage(sk.med[0]), bs = W.box.w * 0.24, br = ZX.thing(st, bs, bs, 37, 'objpop'); ZX.pic('assets/props/brush.png', br);
      place(br, p0.x - bs * 0.18, p0.y - bs * 0.92, bs, bs); st.hintBrush = br;
      st.scope.anim(br, [{ transform: 'translateY(-24px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 400 });
    },
    next(st, strat) {
      if (!st.cards || !st.got) return null;
      const j = st.got.indexOf(false); if (j < 0) return null;
      const pr = st.q.pairs[j], c = pr.col.indexOf(pr.f);
      return { g: 'tap', p: { id: 'card' + (2 * j + (strat === 'wrong' ? 1 - c : c)) } };
    },
    workEls(st) { return (st.cards || []).filter((c, i) => st.got && !st.got[i >> 1]); },
    snap(st) { return { opts: st.opts || null, got: (st.got || []).filter(Boolean).length }; },
    iconNode() {
      return W4X.svgIcon('<rect x="6" y="6" width="48" height="48" rx="4" fill="#FFFDF6" stroke="#E8414B" stroke-width="3"/><path d="M30 8V52M8 30H52" stroke="#E8414B" stroke-width="1.5" stroke-dasharray="4 3" opacity=".6"/>'
        + '<path d="M14 28H46" stroke="' + ORANGE + '" stroke-width="7" stroke-linecap="round"/><path d="M30 14V48" stroke="' + BLUE + '" stroke-width="7" stroke-linecap="round"/>');
    },
  };

  w4Island('peppa4', [Touch, OddOne, Strokes]);
})();

/* ---------------- src/w4/pj4.js */
/* ================================================================ 神笔海 ③ 睡衣小英雄 · 月光乐园 (pj4): 坐 站 飞 说 听 (docs/W4-DESIGN.md §6 ③)
   认字 「转！」转转木马 (turn-to-the-mark) · 写字 坐 飞 (W4X.Write) · 英文 「指！」跟读指一指 (point-as-read) ·
   挑战 「用！」用什么来做 (verb-to-body-part). The shape of src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  const mod = (a, n) => ((a % n) + n) % n;

  /* ---------------------------------------------------------------- ③-1 认字 「转！」 转转木马 (the target turns, the mark stays)
     A carousel (seen from the front and a little above): five wooden horses (six at level 5), a character on every horse's
     chest. The golden mark on the ground in front is where one gets on. Turn the carousel - drag it left / right, or the big
     arrow buttons one horse at a time - until the horse of X is at the mark, then press 上车！: the horse at the mark is the
     answer (turning is no answer). Levels: 1 the picture on the task card, X one horse from the mark; 2 heard only, X anywhere;
     3 look-alikes (坐/生, 站/立, 飞/风, 听/吃) and an old character; 4 the signs of the horses at the back are turned away (only the
     three in front can be read: turn to see them), two old characters; 5 six horses, the back ones turned away, two old ones.
     A random press is right 1 time in 5 (6). */
  const HCOL = ['#FF9EC4', '#7FD8C0', '#B7A2F2', '#FFC285', '#86C6F4', '#FFE074'];
  const horseSVG = c => '<svg viewBox="0 0 150 180" width="100%" height="100%" style="overflow:visible">'
    + '<rect x="71" y="0" width="8" height="180" rx="3" fill="#F2C14E" stroke="#2B2118" stroke-width="3"/>'
    + '<path d="M34 100C16 96 8 112 14 130C20 118 28 112 36 110Z" fill="#FFF5C8" stroke="#2B2118" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<path d="M46 124L34 156M60 128L56 160" stroke="#2B2118" stroke-width="15" stroke-linecap="round"/><path d="M46 124L34 156M60 128L56 160" stroke="' + c + '" stroke-width="8" stroke-linecap="round"/>'
    + '<path d="M96 124L116 140L104 156M86 128L90 162" fill="none" stroke="#2B2118" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="M96 124L116 140L104 156M86 128L90 162" fill="none" stroke="' + c + '" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<ellipse cx="72" cy="114" rx="48" ry="25" fill="' + c + '" stroke="#2B2118" stroke-width="4"/>'
    + '<path d="M96 108C98 88 104 72 112 60L130 68C124 82 120 98 116 112Z" fill="' + c + '" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<path d="M106 54C114 40 140 42 144 58C146 68 138 76 126 74L112 72Z" fill="' + c + '" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<path d="M112 52L114 38L124 48Z" fill="' + c + '" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><circle cx="130" cy="57" r="3.5" fill="#2B2118"/>'
    + '<path d="M108 50C98 60 96 76 92 88" fill="none" stroke="#FFF5C8" stroke-width="9" stroke-linecap="round"/>'
    + '<path d="M54 92H88C90 100 84 106 72 106C60 106 52 100 54 92Z" fill="#E8414B" stroke="#2B2118" stroke-width="3"/>'
    + '<circle class="lamp" cx="75" cy="9" r="9" fill="#FFE14A" stroke="#2B2118" stroke-width="3"/></svg>';
  const ARROW = d => '<svg viewBox="0 0 60 60" width="74%" height="74%"><path d="' + (d < 0 ? 'M46 22C36 12 18 14 12 30' : 'M14 22C24 12 42 14 48 30') + '" fill="none" stroke="#2B2118" stroke-width="7" stroke-linecap="round"/>'
    + '<path d="' + (d < 0 ? 'M4 22L12 36L22 24Z' : 'M56 22L48 36L38 24Z') + '" fill="#2B2118" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><circle cx="30" cy="44" r="7" fill="#FFE14A" stroke="#2B2118" stroke-width="3"/></svg>';
  const Carousel = {
    rule: 'turn-to-the-mark', verb: '转！', intro: '转到它就上车！', props: [],
    gen(G, o) {
      const lv = o.level, pool = poolOf(G, 'zh', false), n = lv >= 5 ? 6 : 5, answer = W4X.pick(G, pool);
      const opts = W4X.opts(G, Math.min(lv, 4), answer, n), ai = opts.indexOf(answer), lk = LOOK[answer] || '';
      /* the horse at the mark when it starts: level 1 one horse beside X; then any but X */
      const start = lv <= 1 ? mod(ai + (G.rng() < 0.5 ? 1 : -1), n) : G.rng.pick(opts.map((_, i) => i).filter(i => i !== ai));
      const dist = Math.min(mod(ai - start, n), mod(start - ai, n));
      return { k: [answer, opts.join(''), start], answer, opts, start, n, pic: lv <= 1 ? 1 : 0, hide: lv >= 4 ? 1 : 0, dist,
        look: opts.filter(k => k !== answer && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: the picture gone, look-alikes, old characters, the back signs turned away, six horses, how far to turn */
    hard(q) { return (1 - q.pic) + q.look + q.rev * 0.8 + q.hide * 2 + (q.n - 5) * 1.5 + q.dist * 0.3; },
    geo() {
      return L() ? { cx: 512, cy: 395, Rx: 300, Ry: 130, w: 170, h: 204, wheel: [150, 88, 710, 516], canopy: [92, 144], spot: 534, left: [26, 320], right: [888, 320], go: [866, 560, 140, 120] }
        : { cx: 352, cy: 490, Rx: 212, Ry: 130, w: 170, h: 204, wheel: [40, 186, 624, 518], canopy: [194, 236], spot: 628, left: [100, 728], right: [494, 728], go: [520, 872, 150, 120] };
    },
    async present(st) {
      const q = st.q;
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      st.opts = q.opts.slice(); st.rot = st.rotV = q.start; st.spinN = 0;
      const wh = st.wheel = ZX.thing(st, 10, 10, 10, 'item');
      K.reg(st, 'wheel', wh, { stretch: { axis: 'x', unit: 120 } }); Object.assign(wh.style, { transform: 'none', filter: 'none' });     /* a press does not shrink the whole carousel */
      st.base = el('div', '', wh); st.col = el('div', '', wh); st.roof = el('div', '', wh); st.spot = el('div', '', wh);
      [st.base, st.col, st.roof, st.spot].forEach(e => { Object.assign(e.style, { position: 'absolute', pointerEvents: 'none' }); });
      st.spot.innerHTML = '<svg viewBox="0 0 120 70" width="100%" height="100%"><ellipse cx="60" cy="50" rx="56" ry="16" fill="#FFE14A" opacity=".45"/><path d="M60 6L86 40H70V56H50V40H34Z" fill="#FFC93C" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/></svg>';
      st.scope.anim(st.spot, [{ filter: 'drop-shadow(0 0 4px #FFE14A)' }, { filter: 'drop-shadow(0 0 16px #FFD23C)' }, { filter: 'drop-shadow(0 0 4px #FFE14A)' }], { duration: 1400, iterations: Infinity });
      st.horses = st.opts.map((k, i) => this.horse(st, k, i));
      st.cards = st.horses;                     /* the options (the explain step rings them) - not tap targets: the wheel is */
      const btn = (id, html, cls) => { const b = el('div', 'card ' + (cls || ''), Stage.el); b.style.position = 'absolute'; b.innerHTML = html; st.els.push(b); K.reg(st, id, b, {}); return b; };
      st.btnL = btn('left', ARROW(-1)); st.btnR = btn('right', ARROW(1));
      st.go = btn('go', ''); st.go.style.background = '#FFD23C'; st.go.style.flexDirection = 'row';
      ['上', '车'].forEach(c => st.go.appendChild(Glyph.zh(c, 56)));
      this.place(st);
      [st.btnL, st.btnR, st.go].forEach((b, i) => K.pop(st, b, 100 * i));
      st.taskEl = K.task(st, [q.pic ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
      K.say(st, '哪个是' + q.answer + '？');
    },
    /* a horse: the wooden horse on its pole, the sign on its chest (its front: the character; its back: plain) */
    horse(st, k, i) {
      const d = el('div', '', st.wheel); d.style.position = 'absolute'; d.innerHTML = horseSVG(HCOL[i % HCOL.length]);
      const pole = d._pole = el('div', '', d); Object.assign(pole.style, { position: 'absolute', left: '47.3%', width: '5.4%', background: '#F2C14E', boxShadow: 'inset 0 0 0 2px #2B2118', pointerEvents: 'none' });
      const sg = d._sign = el('div', '', d);
      Object.assign(sg.style, { position: 'absolute', left: '30%', top: '45%', width: '46.7%', height: '38.9%', borderRadius: '50%', background: '#FFFDF4', boxShadow: '0 0 0 3px #2B2118, 0 0 0 7px #F2C14E', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' });
      const g = d._glyph = Glyph.zh(k, 60); g.setAttribute('width', '80%'); g.setAttribute('height', '80%'); sg.appendChild(g);
      d._lamp = d.querySelector('.lamp');
      return d;
    },
    /* the horses where the turn (st.rotV, in horses) puts them: around the ellipse, nearer ones bigger and in front */
    lay(st) {
      if (!st.horses) return;
      const G = this.geo(), n = st.horses.length, [wx, wy] = G.wheel;
      st.horses.forEach((d, i) => {
        let a = (i - st.rotV) * 2 * Math.PI / n; a = Math.atan2(Math.sin(a), Math.cos(a));
        const c = Math.cos(a), s = 0.6 + 0.4 * (1 + c) / 2, w = G.w * s, h = G.h * s, x = G.cx + G.Rx * Math.sin(a), fy = G.cy + G.Ry * c;
        place(d, Math.round(x - w / 2 - wx), Math.round(fy - h - wy), Math.round(w), Math.round(h));
        d.style.zIndex = String(Math.round(100 + 50 * c));
        d.style.filter = c < -0.2 ? 'brightness(.9)' : '';
        const top = fy - h, ph = Math.max(0, top - G.canopy[1] + 4);
        Object.assign(d._pole.style, { top: (-ph / h * 100) + '%', height: (ph / h * 100) + '%' });
        const back = st.q.hide && Math.abs(a) > 1.75;      /* turned away: only the three in front can be read */
        if (back !== d._back) { d._back = back; d._glyph.style.visibility = back ? 'hidden' : ''; d._sign.style.background = back ? 'repeating-linear-gradient(45deg,#E9DCC3 0 8px,#F7EEDC 8px 16px)' : '#FFFDF4'; }
      });
    },
    place(st) {
      if (!st.wheel) return;
      const G = this.geo(), [wx, wy, ww, wh] = G.wheel, P = (e, x, y, w, h) => place(e, Math.round(x - wx), Math.round(y - wy), Math.round(w), Math.round(h));
      place(st.wheel, wx, wy, ww, wh);
      const bw = 2 * (G.Rx + 50), bh = 2 * (G.Ry + 30) + 28, ey = (bh - 28) / 2, ery = ey - 4;
      P(st.base, G.cx - bw / 2, G.cy - G.Ry - 30 + 6, bw, bh); st.base.style.zIndex = 1;
      let stripes = ''; for (let i = 1; i < 12; i++) { const x = bw / 2 + (bw / 2 - 4) * Math.cos(Math.PI * i / 12), y = ey + ery * Math.sin(Math.PI * i / 12); stripes += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'V' + (y + 28).toFixed(1) + '" stroke="#FFF2D0" stroke-width="7"/>'; }
      st.base.innerHTML = '<svg viewBox="0 0 ' + bw + ' ' + bh + '" width="100%" height="100%"><path d="M4 ' + ey + 'A' + (bw / 2 - 4) + ' ' + ery + ' 0 0 0 ' + (bw - 4) + ' ' + ey + 'V' + (ey + 28) + 'A' + (bw / 2 - 4) + ' ' + ery + ' 0 0 1 4 ' + (ey + 28) + 'Z" fill="#C2364B" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>' + stripes
        + '<ellipse cx="' + bw / 2 + '" cy="' + ey + '" rx="' + (bw / 2 - 4) + '" ry="' + ery + '" fill="#F8E2B8" stroke="#2B2118" stroke-width="5"/>'
        + '<ellipse cx="' + bw / 2 + '" cy="' + ey + '" rx="' + (bw / 2 - 40) + '" ry="' + (ery - 22) + '" fill="none" stroke="#E7C98E" stroke-width="6" stroke-dasharray="18 14"/></svg>';
      P(st.col, G.cx - 15, G.canopy[1] - 6, 30, G.cy - G.canopy[1] + 6); Object.assign(st.col.style, { zIndex: 100, background: 'linear-gradient(90deg,#D9A62E,#FFE08A,#D9A62E)', boxShadow: 'inset 0 0 0 3px #2B2118', borderRadius: '6px' });
      const rw = 2 * G.Rx + 140, rh = G.canopy[1] - G.canopy[0] + 22;
      P(st.roof, G.cx - rw / 2, G.canopy[0], rw, rh); st.roof.style.zIndex = 200;
      let sc = ''; const k = 9; for (let i = 0; i < k; i++) sc += '<path d="M' + (8 + i * (rw - 16) / k) + ' ' + (rh - 26) + 'Q' + (8 + (i + 0.5) * (rw - 16) / k) + ' ' + (rh + 2) + ' ' + (8 + (i + 1) * (rw - 16) / k) + ' ' + (rh - 26) + 'Z" fill="' + (i % 2 ? '#FFF2D0' : '#E8414B') + '" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>';
      st.roof.innerHTML = '<svg viewBox="0 0 ' + rw + ' ' + rh + '" width="100%" height="100%" style="overflow:visible"><path d="M' + (rw / 2) + ' 2L' + (rw - 8) + ' ' + (rh - 26) + 'H8Z" fill="#3A5CC0" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>' + sc
        + '<circle cx="' + rw / 2 + '" cy="4" r="9" fill="#FFE14A" stroke="#2B2118" stroke-width="3"/></svg>';
      P(st.spot, G.cx - 55, G.spot, 110, 64); st.spot.style.zIndex = 300;
      place(st.btnL, G.left[0], G.left[1], 110, 110); place(st.btnR, G.right[0], G.right[1], 110, 110);
      place(st.go, G.go[0], G.go[1], G.go[2], G.go[3]);
      this.lay(st);
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    front(st) { return mod(Math.round(st.rot), st.horses.length); },
    /* the carousel turns to st.rot (whole horses): a short glide, a newer turn takes over from where it is */
    spin(st, ms) {
      const from = st.rotV, to = st.rot, my = ++st.spinN, t0 = now(), dur = fast() || st.ff ? 0 : ms;
      return new Promise(res => {
        const step = () => {
          if (st.scope.dead) return;
          if (st.spinN !== my) { res(); return; }
          const k = dur ? Math.min(1, (now() - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
          st.rotV = from + (to - from) * e; this.lay(st);
          if (k < 1) requestAnimationFrame(step); else res();
        };
        step();
      });
    },
    turn(st, d) { st.rot += d; Sfx.tap(); return this.spin(st, 260); },
    onGesture(st, name, p) {
      if (st.submitted || !st.horses) return false;
      if (name === 'stretch' && p.id === 'wheel') { if (p.delta) this.turn(st, -p.delta); return 'ok'; }     /* a drag to the right turns them right */
      if (name !== 'tap') return false;
      if (p.id === 'left') { this.turn(st, 1); return 'ok'; }
      if (p.id === 'right') { this.turn(st, -1); return 'ok'; }
      if (p.id === 'go') { const i = this.front(st); st.tapped = i; K.hop(st, st.go, 14); Session.submit(st, st.opts[i]); return 'ok'; }
      return false;
    },
    async reveal(st) {
      const i = st.opts.indexOf(st.q.answer), h = st.horses[i], r = h.getBoundingClientRect(), a = Stage.toStage(r.left + r.width / 2, r.top);
      Sfx.reveal(); st.scope.anim(h, [{ transform: 'translateY(0)' }, { transform: 'translateY(-26px)' }, { transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }, { transform: 'translateY(0)' }], { duration: 800 });
      const cb = st.G.actors[this.chars[0]]; if (cb) cb.react('hop');
      await ZX.alive(st, st.q.answer, a.x, Math.max(140, a.y - 70), 140);
      sayItem(st.q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 the horse at the mark in blue with its picture ("这是说" was just said); 2 the carousel turns by itself until X is
       at the mark (a beat); 3 X in gold with its picture, "这个是坐" */
    async explain(st, ans) {
      const iC = st.tapped, iR = st.opts.indexOf(st.q.answer);
      const ring = EX.ring(st, st.horses[iC], 'chosen'), pic = EX.picOver(st, st.horses[iC], ans, 'chosen');
      await EX.wait(st, 700);
      [ring, pic].forEach(e => { if (e) st.scope.anim(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' }); });
      await W4X.exBeat(st, async () => {
        const n = st.horses.length, f = this.front(st), d = mod(iR - f, n), steps = d <= n / 2 ? d : d - n;
        st.rot += steps; await this.spin(st, 330 * Math.abs(steps));
      }, 300);
      await W4X.exRight(st, st.horses[iR], st.q.answer, [W4X.thatIs(st.q.answer)]);
    },
    /* the 2nd hint (real help, no star after it): the lamp on X's pole flashes */
    gestureHint(st, reteach) {
      if (!st.horses) return;
      if (reteach) { [st.btnL, st.btnR, st.go].forEach((b, i) => st.scope.timeout(() => K.hop(st, b, 18), 160 * i)); return; }
      const h = st.horses[st.opts.indexOf(st.q.answer)];
      if (h._lamp) h._lamp.setAttribute('fill', '#FFF7B0');
      st.scope.anim(h, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 12px #FFB400) drop-shadow(0 0 22px #FFE14A)' }, { filter: 'none' }], { duration: 700, iterations: 3, fill: 'none' });
    },
    next(st, strat) {
      if (!st.horses) return null;
      const n = st.horses.length, ai = st.opts.indexOf(st.q.answer), f = this.front(st);
      if (strat === 'wrong') return { g: 'tap', p: { id: f !== ai ? 'go' : 'left' } };
      if (f === ai) return { g: 'tap', p: { id: 'go' } };
      return { g: 'tap', p: { id: mod(ai - f, n) <= n / 2 ? 'left' : 'right' } };
    },
    workEls(st) { return [st.btnL, st.btnR, st.go].filter(Boolean); },
    cleanup(st) { st.spinN = (st.spinN || 0) + 1; },
    snap(st) { return { opts: st.opts || null, front: st.horses ? this.front(st) : -1 }; },
    iconNode() {
      return W4X.svgIcon('<path d="M30 4L56 18H4Z" fill="#3A5CC0" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><rect x="28" y="18" width="4" height="30" fill="#F2C14E"/>'
        + '<ellipse cx="30" cy="50" rx="26" ry="7" fill="#F8E2B8" stroke="#2B2118" stroke-width="3"/><circle cx="16" cy="36" r="7" fill="#FF9EC4" stroke="#2B2118" stroke-width="2.5"/><circle cx="44" cy="36" r="7" fill="#7FD8C0" stroke="#2B2118" stroke-width="2.5"/>'
        + '<path d="M30 56L36 60H24Z" fill="#FFC93C" stroke="#2B2118" stroke-width="2"/>', '0 0 60 64');
    },
  };

  /* ---------------------------------------------------------------- ③-3 英文 「指！」 跟读指一指 (one word, one sound: concept of word)
     A short sentence in big words (a picture of it above). Catboy reads it one word at a time and waits: tap the word he just
     said - a little moon lights under it and he reads the next one. All the words in turn is the answer; a wrong word ends it.
     Sentences from ESENT4, every word known (3 words or more). Levels: 1 three words; 2 three or four; 3 four or five with
     look-alike words in them (it / is / in, can / cat, pig / big); 4 a word comes twice (Go, dog, go!) - the second one is the
     one read second; 5 five or six words, read faster. A build: random taps get a 3-word sentence right 1 time in 6 (and
     1 in 27 tapping anywhere). */
  const WORDS = t => t.match(/[A-Za-z]+/g) || [];
  const lw = w => w.toLowerCase();
  const alike = (a, b) => {
    a = lw(a); b = lw(b); if (a === b) return false;
    if (a.length === b.length) return a.split('').filter((c, i) => c !== b[i]).length === 1;
    const [s, l] = a.length < b.length ? [a, b] : [b, a];
    return l.length - s.length === 1 && l.startsWith(s) && s !== 'i';
  };
  const MOON = '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M25 4A16 16 0 1 0 37 27A13 13 0 1 1 25 4Z" fill="#FFE14A" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/></svg>';
  let SENTS = null;
  const sents = () => SENTS || (SENTS = W4D.esent.map(([t, sc]) => {
    const w = WORDS(t), l = w.map(lw);
    return { t, sc, w, n: w.length, rep: new Set(l).size < l.length ? 1 : 0, look: w.some((a, i) => w.some((b, j) => j > i && alike(a, b))) ? 1 : 0 };
  }).filter(s => s.n >= 3));
  const LEVEL_OK = [null, s => s.n === 3 && !s.rep, s => s.n <= 4 && !s.rep, s => s.n >= 4 && s.n <= 5 && s.look && !s.rep, s => s.rep, s => s.n >= 5];
  const Point = {
    rule: 'point-as-read', kind0: 'en', verb: '指！', intro: '跟着读，指一指！', props: [],
    gen(G, o) {
      const lv = o.level, all = sents(), ok = all.filter(LEVEL_OK[lv]), P = ok.length ? ok : all;
      const t = bagFrom(G, 'pt' + lv, P.map(s => s.t)), s = P.find(x => x.t === t);
      return { k: [s.t], text: s.t, words: s.w.slice(), scene: s.sc, answer: 'all', opts: null, build: 1, n: s.n, rep: s.rep, look: s.look, fast: lv >= 5 ? 1 : 0 };
    },
    itemOf() { return null; },
    hard(q) { return (q.n - 3) * 0.8 + q.look * 0.8 + q.rep * 2.5 + q.fast * 2; },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.moons = []; st.lastOk = -1;
      st.picEl = ZX.thing(st, 210, 210, 5, 'card'); st.picEl.classList.add('pic'); st.picEl.style.pointerEvents = 'none';
      st.picEl.appendChild(Scene.node(q.scene, 186));
      st.cards = q.words.map((w, i) => {
        const c = el('div', 'card', Stage.el); c.style.position = 'absolute'; c.style.flexDirection = 'row';
        const g = Glyph.word(w, 62); c.appendChild(g);
        const punct = this.punctAfter(q.text, q.words, i);
        if (punct) { const p = el('span', '', c); p.textContent = punct; Object.assign(p.style, { font: '900 44px system-ui,sans-serif', color: INK, marginLeft: '2px', alignSelf: 'flex-end', marginBottom: '20px', pointerEvents: 'none' }); }
        c._w = Math.max(96, Number(g.getAttribute('width')) + 40 + (punct ? 16 : 0));
        st.els.push(c); K.reg(st, 'card' + i, c, {});
        st.scope.anim(c, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, delay: 60 * i, easing: EASE.pop, fill: 'backwards' });
        return c;
      });
      st.opts = q.words.slice();
      this.place(st);
      K.pop(st, st.picEl);
      this.readNext(st, 300);
    },
    /* the punctuation after word i in the sentence (shown, not a word to point at) */
    punctAfter(t, words, i) {
      let at = 0; for (let j = 0; j <= i; j++) at = t.indexOf(words[j], at) + words[j].length;
      const m = /^[,.!?]+/.exec(t.slice(at)); return m ? m[0] : '';
    },
    /* the words in rows (a big gap between words), each with room for its moon below */
    rows(st) {
      const maxW = L() ? 820 : 600, gap = L() ? 34 : 26, total = st.cards.reduce((s, c) => s + c._w + gap, -gap);
      /* as few rows as fit, as even as can be (never one word left alone on a row) */
      for (let r = Math.max(1, Math.ceil(total / maxW)); ; r++) {
        const aim = total / r, out = [[]];
        let w = 0;
        st.cards.forEach((c, i) => { const cw = c._w; if (w && (w + gap + cw > maxW || (w + gap + cw / 2 > aim && out.length < r))) { out.push([]); w = 0; } out[out.length - 1].push(i); w += (w ? gap : 0) + cw; });
        if (out.length <= r || r > 4) return { rows: out, gap };
      }
    },
    place(st) {
      if (!st.picEl) return;
      const Lx = L(), cx = Lx ? 572 : 352, H = 112, pitch = H + 56, { rows, gap } = this.rows(st), cy = Lx ? 450 : 620, top = cy - (rows.length * pitch - 56) / 2;
      place(st.picEl, cx - 105, Lx ? 88 : 150, 210, 210);
      rows.forEach((r, k) => {
        const tw = r.reduce((s, i) => s + st.cards[i]._w, 0) + gap * (r.length - 1);
        let x = cx - tw / 2;
        r.forEach(i => { place(st.cards[i], Math.round(x), Math.round(top + k * pitch), st.cards[i]._w, H); x += st.cards[i]._w + gap; });
      });
      st.moons.forEach((m, i) => { if (m) this.moonAt(st, m, i); });
    },
    moonAt(st, m, i) { const b = box(st.cards[i]); place(m, b.x + b.w / 2 - 22, b.y + b.h + 6, 44, 44); },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* Catboy reads the word due now (not awaited: the child may point while he speaks) */
    async readNext(st, delay) {
      try {
        if (delay) await st.scope.wait(delay);
        if (!Session.alive(st) || st.submitted) return;
        const w = st.q.words[st.ix]; if (!w) return;
        st.prompt = w; st.lead = null;
        const a = st.G.actors[this.chars[0]]; if (a && !fast()) a.glance(0.6);
        Voice.say(w, { tag: 'prompt' });
      } catch (e) { /* reading never ends a question */ }
    },
    moon(st, i) {
      const m = ZX.thing(st, 44, 44, 41, 'objpop'); m.innerHTML = MOON; st.moons[i] = m; this.moonAt(st, m, i);
      st.scope.anim(m, [{ transform: 'scale(0) rotate(-40deg)' }, { transform: 'scale(1.25) rotate(8deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 360, easing: EASE.pop });
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || i >= st.q.n) return false;
      if (i === st.lastOk && now() - st.lastAt0 < 500) return false;           /* the same finger twice in a row: one tap */
      st.tapped = i; Sfx.tap();
      if (i !== st.ix) { Session.submit(st, st.opts[i]); return 'ok'; }
      st.lastOk = i; st.lastAt0 = now();
      this.moon(st, i); K.hop(st, st.cards[i], 14); st.ix++;
      if (st.ix >= st.q.n) { Session.submit(st, 'all'); return 'ok'; }
      this.readNext(st, st.q.fast ? 120 : 550);
      return 'ok';
    },
    async reveal(st) {
      Sfx.reveal();
      st.moons.forEach((m, i) => st.scope.timeout(() => K.hop(st, m, 18), 110 * i));
      const a = st.G.actors[this.chars[0]]; if (a) a.cheer();
      Voice.say(st.q.text, { tag: 'summary' });
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the word he pointed at, said */
    wrongLine(st) { return st.opts[st.tapped]; },
    /* explain: 1 the word he pointed at in blue ("cat" was just said); 2 the word read just then in gold, said ("can"); 3 the whole
       sentence from the start, a little moon hopping under every word (a beat) */
    async explain(st) {
      const q = st.q, iC = st.tapped, iR = Math.min(st.ix, q.n - 1);
      EX.ring(st, st.cards[iC], 'chosen');
      await EX.wait(st, 600);
      EX.ring(st, st.cards[iR], 'right'); K.hop(st, st.cards[iR], 18);
      await EX.say(st, [q.words[iR]]);
      await EX.wait(st, 200);
      await W4X.exBeat(st, async () => {
        const m = ZX.thing(st, 44, 44, 63, 'objpop'); m.innerHTML = MOON; this.moonAt(st, m, 0);
        Voice.say(q.text, { tag: 'explain' });
        for (let i = 0; i < q.n; i++) {
          const b = box(st.cards[i]); place(m, b.x + b.w / 2 - 22, b.y + b.h + 6, 44, 44);
          st.scope.anim(m, [{ transform: 'translateY(0)' }, { transform: 'translateY(-16px)' }, { transform: 'translateY(0)' }], { duration: 260 });
          await EX.tick(st, 300);
        }
        await st.scope.guard(Voice.afterSay(200));
      }, 200);
    },
    /* the 2nd hint (real help, no star after it): the word read just now flashes */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 14), 90 * i)); return; }
      const c = st.cards[st.ix]; if (!c) return;
      c.classList.add('glow'); K.hop(st, c, 16); st.scope.timeout(() => c.classList.remove('glow'), 1500);
    },
    next(st, strat) {
      if (!st.cards || st.submitted) return null;
      const n = st.q.n, i = strat === 'wrong' ? (st.ix + 1) % n : st.ix;
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).slice(st.ix || 0); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() {
      const d = el('div'); Object.assign(d.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '0' });
      d.appendChild(Glyph.word('see', 44));
      const m = el('div', '', d); m.innerHTML = MOON; Object.assign(m.style, { width: '24px', height: '24px', marginTop: '2px' });
      return W4X.icon(d);
    },
  };

  /* ---------------------------------------------------------------- ③-4 挑战 「用！」 用什么来做 (the action and the part of the body)
     An action card at the top (听 - read, not said: a tap says it, and that question earns no star); five body cards below. Which
     part of the body does it mostly use? (BODY4: 听-耳 说-口 站-足 看-目 吃-口 喝-口 走-足; both characters known.) Levels: 1 the
     action card with the boy doing it, the others not body parts at all; 2 no picture, the others the other body parts (口 目 手
     耳 足); 3 头 牙 心 come in among them; 4 two action cards, one part each (both right); 5 two actions done with the SAME part
     (说 and 吃: 口 twice) where the child knows such a pair, else two parts with all of 头 牙 心 about. A random tap is right
     1 time in 5 (two: 1 in 25). */
  const BODY = '口目手耳足头牙心', BASIC = '口目手耳足', MORE = '头牙心', ACTS = '坐站飞说听吃喝看走来去';
  W4X.lines(['用什么来做？']);
  const Body = {
    rule: 'verb-to-body-part', kind0: 'quiz', verb: '用！', intro: '用什么来做？', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), B = W4D.body.filter(([a, b]) => kn.includes(a) && kn.includes(b)), acts = B.map(x => x[0]), partOf = a => B.find(x => x[0] === a)[1];
      const pairsSame = lv >= 5 ? acts.filter(a => acts.some(b => b !== a && partOf(b) === partOf(a))) : [];
      const first = pairsSame.length ? bagFrom(G, 'same', pairsSame) : W4X.pick(G, acts, 'act');
      const seq = [first];
      if (lv >= 4) {
        const same = acts.filter(a => a !== first && partOf(a) === partOf(first)), diff = acts.filter(a => a !== first && partOf(a) !== partOf(first));
        seq.push(G.rng.pick(lv >= 5 && same.length ? same : diff.length ? diff : acts.filter(a => a !== first)));
      }
      const parts = seq.map(partOf), others = [];
      /* the body characters are the spec's own set (口 耳 目 手 足, then 头 牙 心); any other one never holds an answer (足 holds 口) */
      const add = k => { if (others.length < 5 - new Set(parts).size && !parts.includes(k) && !others.includes(k) && kn.includes(k) && (BODY.includes(k) || !parts.some(p => (HOLDS[p] || '').includes(k)))) others.push(k); };
      if (lv <= 1) G.rng.shuffle(kn.filter(k => !BODY.includes(k) && !ACTS.includes(k) && !parts.some(p => (LOOK[p] || '').includes(k)))).forEach(add);     /* unlike in meaning and in shape */
      else {
        const sw = [0, 0, 0, G.rng.int(1, 2), 2, 3][lv];
        G.rng.shuffle(MORE.split('')).slice(0, sw).forEach(add);
        G.rng.shuffle(BASIC.split('')).forEach(add);
        G.rng.shuffle(MORE.split('')).forEach(add);
      }
      G.rng.shuffle(kn.filter(k => !ACTS.includes(k))).forEach(add);
      const rest = parts.length > 1 && parts[1] !== parts[0] ? others.concat([parts[1]]) : others;
      const opts = W4X.put(G, rest, parts[0]), two = seq.length > 1;
      return { k: [seq.join(''), opts.join('')], acts: seq, parts, item: first, opts, answer: two ? 'all' : parts[0], seq: two ? parts.slice() : null,
        pic: lv <= 1 ? 1 : 0, body: lv >= 2 ? 1 : 0, sw: opts.filter(k => MORE.includes(k) && !parts.includes(k)).length, two: two ? 1 : 0, same: two && parts[0] === parts[1] ? 1 : 0 };
    },
    /* the action read (not heard) is the memory's evidence */
    itemOf(st) { return W4X.own(st, st.q.acts[0]); },
    itemsOf(st) { return st.q.acts.slice(1); },
    hard(q) { return (1 - q.pic) + q.body + q.sw * 0.6 + q.two * 2.5 + q.same * 2; },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.peeked = false; st.done = [];
      st.acts = q.acts.map((a, j) => {
        const d = ZX.thing(st, 10, 10, 7, 'item'); d.style.width = d.style.height = 'auto';
        d.appendChild(Sent.node(a, 120, -1));
        K.reg(st, j ? 'read2' : 'read', d, {});
        return d;
      });
      st.readEl = st.acts[0]; st.readText = q.acts[0];
      if (q.pic) { st.picEl = ZX.thing(st, 150, 150, 6, 'card'); st.picEl.classList.add('pic'); st.picEl.style.pointerEvents = 'none'; st.picEl.appendChild(W4X.pic(this.actPic(q.acts[0]), 128)); }
      K.cards(st, q.opts.map(k => Glyph.zh(k, 100)), q.opts.slice(), Object.assign({ size: 150, gap: 24 }, this.cardSpot()));
      st.think = ZX.thing(st, 86, 70, 6, 'item');
      st.think.innerHTML = '<svg viewBox="0 0 86 70" width="100%" height="100%"><circle cx="12" cy="62" r="5" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><circle cx="22" cy="50" r="7" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><path d="M30 40C20 40 18 24 30 22C30 8 52 4 58 14C70 8 84 18 78 30C86 40 74 50 64 46C58 54 40 52 38 44C34 46 30 44 30 40Z" fill="#fff" stroke="#2B2118" stroke-width="3"/><text x="52" y="38" text-anchor="middle" font-size="24" font-weight="900" fill="#3A5CC0" font-family="system-ui,sans-serif">?</text></svg>';
      this.place(st);
      st.acts.forEach((d, j) => K.pop(st, d, 120 * j));
      if (st.picEl) K.pop(st, st.picEl, 200);
      this.mark(st);
      K.say(st, '用什么来做？');
    },
    actPic(a) { const x = W4D.body.find(b => b[0] === a); return x ? x[2] : null; },
    cardSpot() { return L() ? { cx: 572, cy: 496 } : { cx: 352, cy: 770, cols: 3 }; },
    place(st) {
      if (!st.acts) return;
      const Lx = L(), n = st.acts.length, sc = Stage.s || 1;
      st.acts.forEach((d, j) => {
        const w = d.firstChild.getBoundingClientRect().width / sc, cx = (Lx ? 572 : 352) + (n > 1 ? (j ? 1 : -1) * (Lx ? 150 : 130) : 0) - (st.picEl ? (Lx ? 90 : 80) : 0);
        place(d, Math.round(cx - w / 2), Lx ? 120 : 220); d.style.width = d.style.height = 'auto';
      });
      if (st.picEl) { const b = st.acts[0], w = b.firstChild.getBoundingClientRect().width / sc; place(st.picEl, box(b).x + w + 30, Lx ? 120 : 220, 150, 150); }
      K.cardsPlace(st, Object.assign({ gap: 24 }, this.cardSpot()));
      place(st.think, Lx ? 30 : 30, Lx ? 410 : 776, 86, 70);
      (st.done || []).forEach(([j, i, m]) => { if (m) this.underAct(st, j, m); });
      if (st.hintEl) { const u = this.spotBy(st, st.ix, 120, 120); place(st.hintEl, u.x, u.y, 120, 120); }
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 90 : 80, L() ? 698 : 1016, L() ? 200 : 150); },
    /* two actions: the one to answer now has a gold edge */
    mark(st) { if (st.acts.length < 2) return; st.acts.forEach((d, j) => { d.firstChild.style.boxShadow = j === st.ix ? '0 0 0 4px #2B2118, 0 0 0 10px #FFD23C, 0 8px 0 rgba(43,33,24,.25)' : '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25)'; }); },
    underAct(st, j, m) { const b = st.acts[j].firstChild.getBoundingClientRect(), a = Stage.toStage(b.left + b.width / 2, b.bottom); place(m, a.x - 40, a.y + 8, 80, 80); },
    peek(st, j) {
      st.peeked = true; st.noStar = true;
      const k = st.q.acts[j]; Voice.sayNow(ITEM[k] ? ITEM[k].line : k, { tag: 'peek' }); K.hop(st, st.acts[j], 12);
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      if (p.id === 'read' || p.id === 'read2') { this.peek(st, p.id === 'read' ? 0 : 1); return 'ok'; }
      const i = K.cardIndex(p.id); if (i < 0) return false;
      const q = st.q, want = q.parts[st.ix];
      st.tapped = i; Sfx.tap();
      if (st.opts[i] !== want) { Session.submit(st, st.opts[i]); return 'ok'; }
      if (st.ix + 1 < q.acts.length) {                /* the first of two: a little copy of the part goes under its action */
        const m = ZX.thing(st, 80, 80, 8, 'card'); m.style.pointerEvents = 'none'; m.appendChild(Glyph.zh(want, 60)); m.style.background = '#FFF3C4';
        st.done.push([st.ix, i, m]); this.underAct(st, st.ix, m); K.pop(st, m); K.hop(st, st.cards[i], 16); Sfx.place();
        st.ix++; this.mark(st);
        return 'ok';
      }
      Session.submit(st, q.acts.length > 1 ? 'all' : want);
      return 'ok';
    },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      q.parts.forEach(k => K.hop(st, st.cards[st.opts.indexOf(k)], 28));
      const a = st.G.actors[this.chars[0]]; if (a) a.react('hop');
      q.acts.forEach((x, j) => Voice.say(x + '用' + q.parts[j], { tag: 'summary' }));
      this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 his card in blue with its picture ("这是足" was just said); 2 the action's picture beside its card, and the part it
       uses glowing beside it (a beat); 3 the right card in gold: "听用耳" */
    async explain(st, ans) {
      const q = st.q, j = Math.min(st.ix, q.acts.length - 1), act = q.acts[j], part = q.parts[j], iR = st.opts.indexOf(part);
      W4X.exChosen(st, st.cards[st.tapped], ans);
      await EX.wait(st, 650);
      if (st.hintEl) st.hintEl.remove();
      await W4X.exBeat(st, () => {
        const u = this.spotBy(st, j, 214, 112);
        const ap = ZX.thing(st, 112, 112, 61, 'objpop'); ap.appendChild(W4X.pic(this.actPic(act), 100)); Object.assign(ap.style, { background: '#fff', borderRadius: '20px', boxShadow: '0 0 0 4px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        place(ap, u.x, u.y, 112, 112); K.pop(st, ap);
        const pp = ZX.thing(st, 96, 96, 61, 'objpop'); pp.appendChild(W4X.pic(ITEM[part].obj, 92)); place(pp, u.x + 118, u.y + 8, 96, 96);
        st.scope.anim(pp, [{ transform: 'scale(0)', filter: 'none' }, { transform: 'scale(1.15)', filter: 'drop-shadow(0 0 14px #FFB400)' }, { transform: 'scale(1)', filter: 'drop-shadow(0 0 10px #FFD23C)' }], { duration: 520, delay: 250, fill: 'both' });
      }, 700);
      await W4X.exRight(st, st.cards[iR], part, [act + '用' + part], false);
    },
    /* the 2nd hint (real help, no star after it): the boy doing the action appears beside its card (level 1 has it already) */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.q.pic) { st.noHelp = true; return; }
      if (st.hintEl) return;
      const j = st.ix, u = this.spotBy(st, j, 120, 120);
      const d = st.hintEl = ZX.thing(st, 120, 120, 6, 'card'); d.classList.add('pic'); d.style.pointerEvents = 'none'; d.appendChild(W4X.pic(this.actPic(st.q.acts[j]), 104));
      place(d, u.x, u.y, 120, 120); K.pop(st, d);
    },
    /* room for a w x h group beside action card j (landscape: left of the first, right of the second) or under it (portrait) */
    spotBy(st, j, w, h) {
      const b = st.acts[j].firstChild.getBoundingClientRect(), p = Stage.toStage(b.left, b.top), q2 = Stage.toStage(b.right, b.bottom);
      if (!L()) return { x: clamp((p.x + q2.x) / 2 - w / 2, 8, Stage.W - w - 8), y: q2.y + 10 };
      const y = (p.y + q2.y) / 2 - h / 2, left = p.x - 18 - w, right = q2.x + 18;
      return { x: (j === 0 && left >= 8) || right + w > Stage.W - 8 ? Math.max(8, left) : right, y };
    },
    next(st, strat) {
      if (!st.cards || !st.acts) return null;
      const want = st.q.parts[st.ix], i = strat === 'wrong' ? st.opts.findIndex(k => k !== want) : st.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0, peeked: !!st.peeked }; },
    iconNode() { const d = el('div'); d.style.display = 'flex'; d.style.alignItems = 'center'; d.appendChild(Glyph.zh('听', 36)); const a = el('div', '', d); a.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18"><path d="M3 10H15M11 5L16 10L11 15" fill="none" stroke="#3A5CC0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'; d.appendChild(Glyph.zh('耳', 36)); return W4X.icon(d); },
  };

  w4Island('pj4', [Carousel, Point, Body]);
})();

/* ---------------- src/w4/xiyou4.js */
/* ================================================================ 神笔海 ④ 西游记 · 水帘洞 (xiyou4): 对 雪 虫 鱼 草 (docs/W4-DESIGN.md §6 ④)
   认字 「摘！」摘桃找词 (find-the-word) · 写字 虫 对 (W4X.Write) · 英文 「闪！」火眼金睛 (flash-then-find) ·
   挑战 「归！」送字回家 (sort-by-meaning). Built like the template src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  /* lines said through a variable (tools/voice_lines.py records them): 送字回家 L4's word 小鸟 is in KIND4_WORDS only */
  W4X.lines(['这是小鸟']);
  /* the stage box of an element as it is seen (a card being dragged, a piece inside another element) */
  const vbox = e => { const r = e.getBoundingClientRect(), s = Stage.s || 1, a = Stage.toStage(r.left, r.top); return { x: a.x, y: a.y, w: r.width / s, h: r.height / s }; };
  /* a card let go over its target keeps the finger's offset: it becomes its real place (then it can fly on from there) */
  const settle = e => { if (!e || !e.style.transform) return; const b = box(e), v = vbox(e); e.style.transform = ''; e.getAnimations().forEach(a => a.cancel()); place(e, v.x + v.w / 2 - b.w / 2, v.y + v.h / 2 - b.h / 2); };
  const unmove = e => { if (!e) return; e.style.transform = ''; e.getAnimations().forEach(a => a.cancel()); };
  const R = (G, a) => G.rng.shuffle(a.slice());

  /* ---------------------------------------------------------------- ④-1 认字 「摘！」 摘桃找词 (a word of two characters)
     Five peaches hang in the tree before 水帘洞, each with a word of two characters (level 5: three). Tap the peach with the word
     asked - or drag it into the basket. Right: both characters right and in their order. The island's character still to pass
     comes first (needPick), then a word with it (WORDS_ZH4, only words all of whose characters the child knows, §5.3).
     Levels: 1 the word's picture on the task card (only words with a picture), the others share no character with it; 2 heard
     only; 3 others with one character the same (金鱼 / 大鱼 / 小鱼); 4 the same characters the other way round (天上 / 上天,
     草地 / 地草) too; 5 three characters (小金鱼 / 大金鱼 / 金小鱼). A random peach is right 1 time in 5. */
  const ZH = () => W4D.wordsZh.concat(W4D.wordsZh3);
  const zhPic = w => { const x = ZH().find(v => v[0] === w); return x && x[1] && W4X.hasPic(x[1]) ? x[1] : null; };
  const isWord = w => ZH().some(v => v[0] === w);
  const shares = (a, b) => Array.from(a).some(c => b.includes(c));
  const sameSet = (a, b) => a !== b && a.length === b.length && Array.from(a).sort().join('') === Array.from(b).sort().join('');
  const PW = 158;
  const PEACHES = () => (L() ? [[176, 200], [344, 370], [512, 200], [680, 370], [848, 200]] : [[130, 330], [241, 520], [352, 330], [463, 520], [574, 330]]);
  const BASKET = () => (L() ? [412, 505, 200, 170] : [247, 676, 210, 180]);
  const PEACH_ICON = '<svg viewBox="0 0 60 60" width="100%" height="100%"><path d="M30 16C40 6 54 10 54 26C54 42 42 54 30 54C18 54 6 42 6 26C6 10 20 6 30 16Z" fill="#FFB38A" stroke="#2B2118" stroke-width="3.5"/><path d="M30 18C26 30 28 42 32 52" fill="none" stroke="#E8735B" stroke-width="3" stroke-linecap="round"/><path d="M30 16C30 10 34 5 39 4" fill="none" stroke="#7A5230" stroke-width="3.5" stroke-linecap="round"/><path d="M33 9C40 2 50 4 52 10C45 14 38 13 33 9Z" fill="#5CC46E" stroke="#2B2118" stroke-width="2.5"/></svg>';
  const Peach = {
    rule: 'find-the-word', verb: '摘！', intro: '摘对的桃子！', props: ['peach', 'basket'],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), knows = w => Array.from(w).every(c => kn.includes(c));
      const two = W4D.wordsZh.map(v => v[0]).filter(knows), three = W4D.wordsZh3.map(v => v[0]).filter(knows);
      const mine = poolOf(G, 'zh', false), list = lv >= 5 && three.length ? three : two;
      let ask = lv <= 1 ? list.filter(zhPic) : list;
      if (lv >= 4) { const diff = ask.filter(w => new Set(w).size === w.length); if (diff.length) ask = diff; }      /* 爷爷 has no other order */
      const holders = l => mine.filter(k => l.some(w => w.includes(k)));
      const own = holders(ask).length ? holders(ask) : holders(list);
      let X, word;
      if (own.length) {
        X = W4X.pick(G, own);
        const c = ask.filter(w => w.includes(X));
        word = bagFrom(G, 'fw' + lv + X, c.length ? c : list.filter(w => w.includes(X)));
      } else { word = bagFrom(G, 'fw' + lv, ask.length ? ask : list); X = Array.from(word).find(c => mine.includes(c)) || word[0]; }
      const others = [], add = w => { if (others.length < 4 && w && w !== word && !others.includes(w)) others.push(w); };
      const share = two.filter(w => shares(w, word)), apart = two.filter(w => !shares(w, word));
      if (word.length === 3) {
        const a = Array.from(word);
        R(G, three.filter(w => w !== word && Array.from(w).filter((c, i) => c === a[i]).length === 2)).slice(0, 1).forEach(add);   /* one character not the same: 大金鱼 */
        R(G, [[1, 0, 2], [0, 2, 1]].map(p => p.map(j => a[j]).join(''))).slice(0, 2).forEach(add);                                   /* the order changed: 金小鱼 */
        R(G, three.filter(w => shares(w, word))).forEach(add);
        R(G, three).forEach(add);
      } else if (lv >= 4) { add(Array.from(word).reverse().join('')); R(G, share).slice(0, 1).forEach(add); R(G, apart).forEach(add); }
      else if (lv === 3) { R(G, share).slice(0, 2).forEach(add); R(G, apart).forEach(add); }
      else R(G, apart).forEach(add);
      R(G, two).forEach(add);
      const opts = W4X.put(G, others, word);
      return { k: [word, opts.join('')], answer: word, item: X, opts, pic: lv <= 1 && zhPic(word) ? 1 : 0, three: word.length === 3 ? 1 : 0,
        share: others.filter(w => shares(w, word)).length, rev: others.some(w => sameSet(w, word)) ? 1 : 0 };
    },
    /* tests/w4_levels.js: the picture gone, characters the same, the order turned round, three characters */
    hard(q) { return (1 - q.pic) * 1.5 + Math.min(2, q.share) + q.rev * 1.5 + q.three * 3; },
    itemOf(st) { return st.q.item; },
    /* the other characters of this island in the word read right count too (like 读一读) */
    itemsOf(st) { const mine = poolOf(st.G, 'zh', false); return Array.from(new Set(st.q.answer)).filter(c => c !== st.q.item && mine.includes(c)); },
    label(w) {
      const s = w.length > 2 ? 42 : 60, d = el('div', '');
      Object.assign(d.style, { position: 'absolute', left: '50%', top: '58%', transform: 'translate(-50%,-50%)', display: 'flex', background: 'rgba(255,252,240,.95)', borderRadius: '18px', padding: '2px 6px', boxShadow: '0 0 0 3px #2B2118', pointerEvents: 'none' });
      Array.from(w).forEach(c => d.appendChild(Glyph.zh(c, s)));
      return d;
    },
    async present(st) {
      const q = st.q;
      await ZX.meet(st, q.item);
      if (!Session.alive(st)) return;
      const b = st.basket = ZX.thing(st, 200, 170, 5, 'item'); ZX.pic('assets/props/basket.png', b);
      st.opts = q.opts.slice();
      st.cards = q.opts.map((w, i) => {
        const d = ZX.thing(st, PW, PW, 6, 'item'); ZX.pic('assets/props/peach.png', d); d.appendChild(this.label(w));
        K.reg(st, 'card' + i, d, { drag: true, drops: () => [{ id: 'basket', rect: () => box(st.basket) }] });
        K.pop(st, d, 70 * i);
        return d;
      });
      this.place(st);
      const pic = zhPic(q.answer);
      st.taskEl = K.task(st, [q.pic && pic ? [OBJURL(pic), 'q'] : ['speaker', 'q']]);
      K.say(st, '摘' + q.answer + '！');
    },
    place(st) {
      if (!st.cards) return;
      const P = PEACHES();
      st.cards.forEach((d, i) => { if (!d._in) place(d, P[i][0] - PW / 2, P[i][1] - PW / 2, PW, PW); });
      const B = BASKET(); place(st.basket, B[0], B[1], B[2], B[3]);
      (st.cards || []).forEach(d => { if (d._in) this.inBasket(st, d); });
    },
    inBasket(st, d) { const B = box(st.basket); place(d, B.x + B.w / 2 - PW / 2, B.y + B.h * 0.42 - PW / 2, PW, PW); d.style.transform = 'scale(.62)'; },
    onGesture(st, name, p) {
      if (st.submitted) return false;
      const i = K.cardIndex(p.id);
      if (i < 0 || !(name === 'tap' || (name === 'drop' && p.to === 'basket'))) return false;
      if (name === 'drop') settle(st.cards[i]);
      st.tapped = i; Sfx.tap();
      Session.submit(st, st.opts[i]);
      return 'ok';
    },
    /* the peach goes into the basket, the word is said */
    async reveal(st) {
      const i = st.opts.indexOf(st.q.answer), d = st.cards[i], B = box(st.basket);
      settle(d);
      await K.flyTo(st, d, B.x + B.w / 2 - PW / 2, B.y + B.h * 0.42 - PW / 2, 380, 60, 0.62);
      if (!Session.alive(st)) return;
      d._in = true; Sfx.place(); K.hop(st, st.basket, 16);
      Fx.burst(B.x + B.w / 2, B.y + 30, { n: 14, dist: 90 });
      const wk = st.G.actors.wukong; if (wk) wk.react();
      Voice.say(st.q.answer, { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the word he picked ("这是地上"); a jumbled one (地草) is read character by character */
    async feedback(st, ans) {
      const e = st.cards[st.tapped]; if (e) { unmove(e); this.place(st); K.wiggle(st, e); }
      if (isWord(ans)) Voice.say(W4X.thisIs(ans), { tag: 'wrong' }); else Array.from(ans).forEach(c => Voice.say(c, { tag: 'wrong' }));
      await st.scope.wait(900);
    },
    /* explain: 1 his peach in blue (its picture when the word has one); 2 the two words side by side, character by character:
       the same ones gold, the others blue (a beat); 3 the right peach in gold with its picture: "这是天上" */
    async explain(st, ans) {
      const q = st.q, eC = st.cards[st.tapped], eR = st.cards[st.opts.indexOf(q.answer)], pc = zhPic(ans), pr = zhPic(q.answer);
      W4X.exChosen(st, eC, pc ? W4X.pic(pc, 86) : null);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => this.compare(st, ans, q.answer), 900);
      await W4X.exRight(st, eR, q.answer, [W4X.thisIs(q.answer)], pr ? W4X.pic(pr, 86) : false);
    },
    compare(st, a, b) {
      const s = a.length > 2 || b.length > 2 ? 58 : 66, d = ZX.thing(st, 10, 10, 61, 'item'); d.dataset.ex = 'compare';
      Object.assign(d.style, { width: 'auto', height: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 18px', background: '#FFFDF4', borderRadius: '22px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.2)', pointerEvents: 'none' });
      [a, b].forEach(w => {
        const row = el('div', '', d); Object.assign(row.style, { display: 'flex', gap: '6px' });
        Array.from(w).forEach((c, i) => {
          const same = c === (w === a ? b : a)[i], cell = el('div', '', row);
          Object.assign(cell.style, { width: s + 'px', height: s + 'px', borderRadius: '12px', background: same ? '#FFF1BF' : '#E1ECFA', boxShadow: '0 0 0 3px ' + (same ? EX_GOLD : EX_BLUE) });
          cell.appendChild(Glyph.zh(c, s, same ? '#8A5A00' : '#2E5E9E'));
        });
      });
      const n = Math.max(a.length, b.length), w = n * s + (n - 1) * 6 + 36, B = box(st.basket);
      place(d, Stage.W / 2 - w / 2, L() ? B.y - 20 : B.y - 10); d.style.width = d.style.height = 'auto';
      K.pop(st, d);
    },
    /* the 2nd hint (real help): the word's picture on the task card; a word without one shows its first character there.
       Level 1 has the picture already: nothing more to give (no star lost) */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 18), 90 * i)); return; }
      if (st.hintDone || !st.taskEl) return; st.hintDone = true;
      if (st.q.pic) { st.noHelp = true; return; }
      const it = st.taskEl.querySelector('.it'), pic = zhPic(st.q.answer); if (!it) return;
      let nd;
      if (pic) { nd = img(OBJURL(pic), ''); nd.style.height = '54px'; }
      else { nd = el('div', ''); Object.assign(nd.style, { width: '54px', height: '54px', borderRadius: '12px', background: '#FFF1BF', boxShadow: '0 0 0 3px ' + EX_GOLD }); nd.appendChild(Glyph.zh(st.q.answer[0], 50)); }
      it.replaceChild(nd, it.firstChild); Sfx.sparkle();
      st.scope.anim(nd, [{ transform: 'scale(.3)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 420, easing: EASE.pop });
    },
    next(st, strat) {
      if (!st.cards) return null;
      const i = strat === 'wrong' ? st.opts.findIndex(w => w !== st.q.answer) : st.opts.indexOf(st.q.answer);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    cleanup(st) { (st.cards || []).forEach(d => { d._in = false; }); },
    snap(st) { return { opts: st.opts || null }; },
    iconNode() { const d = el('div'); d.innerHTML = PEACH_ICON; Object.assign(d.style, { width: '78%', height: '78%' }); return d; },
  };

  /* ---------------------------------------------------------------- ④-3 英文 「闪！」 火眼金睛 (a sight word, looked at once)
     Wukong's eyes light up; the golden screen shows an English word for a moment, then a cloud covers it; five word cards come.
     Tap the one that was shown - it is never said before (a word to look at); a right tap says it and a short sentence with it.
     Levels: 1 shown 3 s, the others unlike it (another length, another first letter); 2 2.5 s, the others as long as it; 3 the
     others include words one letter apart (in / it / is, can / cat, me / we); 4 2 s, two words at once (I see) - five pairs; 5
     1.5 s, two words, the same pair the other way round (see I) among them. A random card is right 1 time in 5. */
  const lc = w => (w === 'I' ? 'I' : w.toLowerCase());
  const SIGHT = () => W4D.sight;
  const EPOOL = () => Array.from(new Set(W4D.sight.concat(W4D.words.map(v => v[0]))));
  const oneOff = (a, b) => a.length === b.length && a !== b && Array.from(a).filter((c, i) => c !== b[i]).length === 1;
  const toks = t => t.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean).map(lc);
  const PAIRS = () => {
    if (PAIRS.v) return PAIRS.v;
    const P = EPOOL(), out = [], seen = new Set();
    W4D.esent.forEach(([t]) => { const w = toks(t); for (let i = 0; i + 1 < w.length; i++) { const p = w[i] + ' ' + w[i + 1]; if (P.includes(w[i]) && P.includes(w[i + 1]) && w[i] !== w[i + 1] && !seen.has(p)) { seen.add(p); out.push([p, t]); } } });
    return (PAIRS.v = out);
  };
  const sentOf = (G, w) => { const s = W4D.esent.map(v => v[0]).filter(t => toks(t).includes(w)); return s.length ? G.rng.pick(s) : null; };
  const SCR_W = 420, SCR_H = 200;
  const SCREEN_SVG = '<svg viewBox="0 0 420 200" width="100%" height="100%"><rect x="6" y="22" width="408" height="172" rx="32" fill="#F5B324" stroke="#2B2118" stroke-width="7"/><rect x="28" y="42" width="364" height="132" rx="20" fill="#1F4E58" stroke="#2B2118" stroke-width="5"/>'
    + '<g stroke="#2B2118" stroke-width="4"><path d="M118 26C112 10 126 2 134 10C136 2 152 2 150 14C160 8 168 18 158 26Z" fill="#E8414B"/><path d="M262 26C256 10 270 2 278 10C280 2 296 2 294 14C304 8 312 18 302 26Z" fill="#E8414B"/>'
    + '<ellipse cx="138" cy="28" rx="26" ry="12" fill="#fff"/><ellipse cx="282" cy="28" rx="26" ry="12" fill="#fff"/></g><circle cx="138" cy="28" r="8" fill="#FFB400"/><circle cx="282" cy="28" r="8" fill="#FFB400"/><circle cx="138" cy="28" r="3.5" fill="#2B2118"/><circle cx="282" cy="28" r="3.5" fill="#2B2118"/></svg>';
  const CLOUD_SVG = '<svg viewBox="0 0 400 150" width="100%" height="100%"><path d="M58 140C22 140 6 114 16 92C24 74 44 68 60 74C64 44 94 26 124 34C140 12 174 6 202 22C224 6 260 10 276 36C304 26 338 44 342 74C370 74 392 96 386 118C382 134 366 140 348 140Z" fill="#fff" stroke="#2B2118" stroke-width="6" stroke-linejoin="round"/><path d="M110 112C150 122 250 122 300 108" fill="none" stroke="#C9DDF0" stroke-width="8" stroke-linecap="round"/></svg>';
  /* a word or two as glyphs, as big as fits */
  const enNode = (txt, h, maxW, color) => {
    const ws = txt.split(' '), d = el('div', ''); Object.assign(d.style, { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none' });
    let gs = ws.map(w => Glyph.word(w, h, color)), gap = Math.round(h * 0.42), wd = gs.reduce((a, g) => a + (+g.getAttribute('width')), 0) + gap * (gs.length - 1);
    if (wd > maxW) { const k = maxW / wd; h = Math.floor(h * k); gap = Math.round(h * 0.42); gs = ws.map(w => Glyph.word(w, h, color)); }
    d.style.gap = gap + 'px'; gs.forEach(g => d.appendChild(g));
    return d;
  };
  const Flash = {
    rule: 'flash-then-find', kind0: 'en', verb: '闪！', intro: '火眼金睛看一眼！', softHint: false, props: [],
    gen(G, o) {
      const lv = o.level, P = EPOOL(), last = (G.asked || []).slice(-1)[0];
      if (lv <= 3) {
        let ts = SIGHT().filter(w => w !== last && (lv === 1 || (w.length >= 2 && w.length <= 4)));
        if (lv === 3) ts = ts.filter(w => P.some(x => oneOff(w, x)));
        const t = bagFrom(G, 'fl' + lv, ts), others = [], add = x => { if (others.length < 4 && x !== t && !others.includes(x)) others.push(x); };
        if (lv === 1) R(G, P.filter(x => x.length !== t.length && x[0].toLowerCase() !== t[0].toLowerCase())).forEach(add);
        else {
          if (lv === 3) R(G, P.filter(x => oneOff(t, x))).slice(0, 2).forEach(add);
          R(G, P.filter(x => x.length === t.length && !oneOff(t, x))).forEach(add);
          R(G, P.filter(x => x.length === t.length)).forEach(add);
        }
        R(G, P).forEach(add);
        const opts = W4X.put(G, others, t);
        return { k: [t, opts.join(',')], answer: t, item: t, opts, show: [3000, 3000, 2500, 2500][lv], two: 0, rev: 0, said: sentOf(G, t),
          same: others.filter(x => x.length === t.length).length >= 4 ? 1 : 0, off: others.filter(x => oneOff(t, x)).length };
      }
      const pr = bagFrom(G, 'fp', PAIRS().filter(p => p[0] !== last)), [a, b] = pr[0].split(' '), t = pr[0], others = [];
      const add = x => { if (others.length < 4 && x !== t && !others.includes(x)) others.push(x); };
      if (lv >= 5) add(b + ' ' + a);
      const swap = (w, j) => R(G, P.filter(x => x !== w && x !== (j ? a : b) && (x.length === w.length || Math.abs(x.length - w.length) <= 1)));
      const ch = R(G, [0, 1, 0, 1, 0, 1]);
      ch.forEach((j, n) => { const x = swap(j ? b : a, j)[n]; if (x) add(j ? a + ' ' + x : x + ' ' + b); });
      R(G, PAIRS().map(p => p[0])).forEach(add);
      const opts = W4X.put(G, others, t);
      return { k: [t, opts.join(',')], answer: t, item: t, opts, show: lv >= 5 ? 1500 : 2000, two: 1, rev: others.includes(b + ' ' + a) ? 1 : 0, said: pr[1], same: 1, off: 0 };
    },
    itemOf() { return null; },
    /* tests/w4_levels.js: less time, as long as it, a letter apart, two words, the pair turned round */
    hard(q) { return (3000 - q.show) / 500 + q.same + Math.min(2, q.off) * 1.5 + q.two * 3 + q.rev * 1.5; },
    async present(st) {
      const q = st.q;
      st.shown = false;
      const s = st.screen = ZX.thing(st, SCR_W, SCR_H, 5, 'item'); s.innerHTML = SCREEN_SVG;
      const w = st.wordEl = ZX.thing(st, 340, 110, 6, 'item'); Object.assign(w.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', visibility: 'hidden' });
      w.appendChild(enNode(q.answer, 92, 320, '#FFF4C8'));
      const c = st.cloud = ZX.thing(st, 380, 150, 7, 'item'); c.innerHTML = CLOUD_SVG; c.style.visibility = 'hidden';
      this.cards(st);                                   /* the five cards are there from the start, hidden until the cloud covers the word */
      this.place(st);
      K.pop(st, s);
      K.say(st, '看好了！');
      this.flash(st);
    },
    /* the word shows for its time (the tests' 'wait' cuts it short), the cloud covers it, then the five cards come */
    async flash(st) {
      const q = st.q, wk = st.G.actors.wukong;
      await this.hold(st, fast() ? 300 : 700);
      if (!Session.alive(st) || st.frozen) return;
      if (wk) wk.react('eyes');
      st.wordEl.style.visibility = ''; Sfx.sparkle(); st.shown = true;
      st.scope.anim(st.wordEl, [{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 260, easing: EASE.pop });
      await this.hold(st, q.show);
      if (!Session.alive(st) || st.frozen) return;
      await this.cover(st);
      if (!Session.alive(st) || st.frozen) return;
      st.cardsOn = true;
      st.cards.forEach((d, i) => { d.style.visibility = ''; st.scope.anim(d, [{ transform: 'scale(0) rotate(-8deg)' }, { transform: 'scale(1)' }], { duration: 320, delay: 60 * i, easing: EASE.pop, fill: 'backwards' }); });
      K.say(st, '刚才是哪个？');
    },
    async cover(st) {
      const c = st.cloud; c.style.visibility = ''; Sfx.whoosh(0.3);
      await st.scope.anim(c, [{ transform: 'translateY(-60px) scale(.7)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1 }], { duration: 360, easing: EASE.pop, fill: 'none' });
      st.covered = true;
    },
    cards(st) {
      const q = st.q, two = q.two, cw = this.cw(st);
      st.opts = q.opts.slice();
      st.cards = q.opts.map((t, i) => {
        const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; st.els.push(d);
        d.appendChild(enNode(t, two ? 60 : 68, cw[0] - 30)); d.style.visibility = 'hidden';
        K.reg(st, 'card' + i, d, {});
        return d;
      });
      this.place(st);
    },
    hold(st, ms) { return new Promise(res => { st.skip = res; W4X.tick(st, ms).then(res); }); },
    /* card sizes: one word / two words, landscape / portrait */
    cw(st) { const two = st.q.two; return L() ? (two ? [284, 104] : [164, 118]) : (two ? [300, 104] : [196, 124]); },
    spots(st) {
      const two = st.q.two, [w, h] = this.cw(st), g = 18;
      if (L()) return two ? [[512 - w - g, 366], [512, 366], [512 + w + g, 366], [512 - (w + g) / 2, 366 + h + g], [512 + (w + g) / 2, 366 + h + g]] : [0, 1, 2, 3, 4].map(i => [512 + (i - 2) * (w + 14), 420]);
      return two ? [[352 - (w + g) / 2, 470], [352 + (w + g) / 2, 470], [352 - (w + g) / 2, 470 + h + g], [352 + (w + g) / 2, 470 + h + g], [352, 470 + 2 * (h + g)]]
        : [[352 - w - g, 500], [352, 500], [352 + w + g, 500], [352 - (w + g) / 2, 500 + h + g], [352 + (w + g) / 2, 500 + h + g]];
    },
    place(st) {
      if (!st.screen) return;
      const sx = L() ? 512 - SCR_W / 2 : 352 - SCR_W / 2, sy = L() ? 84 : 176;
      place(st.screen, sx, sy, SCR_W, SCR_H);
      place(st.wordEl, sx + 40, sy + 54, 340, 110);
      place(st.cloud, sx + 20, sy + 34, 380, 150);
      if (st.cards) { const [w, h] = this.cw(st), S = this.spots(st); st.cards.forEach((d, i) => place(d, Math.round(S[i][0] - w / 2), Math.round(S[i][1] - h / 2), w, h)); }
      if (st.diffEl) this.placeDiff(st);
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 96 : 84, L() ? 698 : 1016, L() ? 200 : 150); },
    onGesture(st, name, p) {
      if (st.submitted) return false;
      if (name === 'wait') { if (st.skip) st.skip(); return 'free'; }
      if (name !== 'tap' || !st.cardsOn) return false;
      const i = K.cardIndex(p.id); if (i < 0) return false;
      st.tapped = i; Sfx.tap(); st.frozen = true;
      Session.submit(st, st.opts[i]);
      return 'ok';
    },
    /* the word is said, then a short sentence with it ("see! I see a cat."); two words: their sentence */
    async reveal(st) {
      const q = st.q, e = st.cards[st.opts.indexOf(q.answer)];
      K.hop(st, e, 30); Sfx.reveal();
      this.uncover(st);
      const wk = st.G.actors.wukong; if (wk) wk.react('eyes');
      if (!q.two) Voice.say(q.answer + '!', { tag: 'summary' });
      if (q.said) Voice.say(q.said, { tag: 'summary' });
      this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    uncover(st) { if (st.cloud && st.covered) { st.covered = false; st.scope.anim(st.cloud, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-50px) scale(.8)', opacity: 0 }], { duration: 360, fill: 'forwards' }); } },
    /* the factual line: the word(s) he picked, said */
    wrongLine() { return null; },
    async feedback(st, ans) { const e = st.cards[st.tapped]; if (e) K.wiggle(st, e); String(ans).split(' ').forEach(w => Voice.say(w, { tag: 'wrong' })); await st.scope.wait(900); },
    /* explain: 1 his card in blue; 2 the cloud goes, the word is back - and under it his word, the letters that differ blue (a
       beat); 3 the right card in gold, said */
    async explain(st, ans) {
      const q = st.q, eC = st.cards[st.tapped], eR = st.cards[st.opts.indexOf(q.answer)];
      W4X.exChosen(st, eC, null);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => { this.uncover(st); st.wordEl.style.visibility = ''; this.diff(st, ans); }, 900);
      await W4X.exRight(st, eR, null, q.answer.split(' '), false);
    },
    /* his word under the screen, its letters that are not the shown word's (place by place) in blue */
    diff(st, ans) {
      const t = st.q.answer.split(' '), a = String(ans).split(' '), d = st.diffEl = ZX.thing(st, 10, 10, 61, 'item'); d.dataset.ex = 'diff';
      Object.assign(d.style, { display: 'flex', gap: '26px', alignItems: 'flex-end', padding: '6px 16px', background: '#FFFDF4', borderRadius: '16px', boxShadow: '0 0 0 4px ' + EX_BLUE, pointerEvents: 'none' });
      a.forEach((w, j) => { const r = t[j] || ''; d.appendChild(Glyph.wordC(w, st.q.two ? 44 : 50, Array.from(w).map((c, i) => (c === r[i] ? INK : EX_BLUE)))); });
      this.placeDiff(st); K.pop(st, d);
    },
    /* under the screen (one word, landscape), beside it (two words, landscape), over it (portrait): never on a card */
    placeDiff(st) {
      const d = st.diffEl, s = box(st.screen); d.style.width = d.style.height = 'auto';
      const r = d.getBoundingClientRect(), k = Stage.s || 1, w = r.width / k, h = r.height / k;
      let x = s.x + s.w / 2 - w / 2, y = s.y + s.h + 4;
      if (!L()) y = s.y - h - 6;
      else if (st.q.two) { x = s.x + s.w + 12; y = s.y + s.h / 2 - h / 2; if (x + w > Stage.W - 8) x = s.x - w - 12; }
      place(d, Math.round(x), Math.round(y)); d.style.width = d.style.height = 'auto';
    },
    /* the 2nd hint (real help): the cloud parts and the word shows again for half a second */
    async gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone || !st.covered) return; st.hintDone = true;
      st.cloud.style.visibility = 'hidden'; Sfx.sparkle();
      await W4X.tick(st, 500);
      if (Session.alive(st) && !st.submitted) st.cloud.style.visibility = '';
    },
    next(st, strat) {
      if (!st.cardsOn) return W4X.WAIT;
      const i = strat === 'wrong' ? st.opts.findIndex(w => w !== st.q.answer) : st.opts.indexOf(st.q.answer);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    find(st, id) { return id === 'wait' ? st.screen : (st.map && st.map[id]) || null; },
    workEls(st) { return st.cardsOn ? st.cards : []; },
    cleanup(st) { st.frozen = true; },
    snap(st) { return { opts: st.cardsOn ? st.opts : null, shown: !!st.shown }; },
    iconNode() { const d = el('div'); d.innerHTML = '<svg viewBox="0 0 60 60" width="100%" height="100%"><rect x="4" y="14" width="52" height="36" rx="9" fill="#F5B324" stroke="#2B2118" stroke-width="3.5"/><rect x="10" y="20" width="40" height="24" rx="5" fill="#1F4E58"/><ellipse cx="21" cy="11" rx="7" ry="4" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><ellipse cx="39" cy="11" rx="7" ry="4" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><circle cx="21" cy="11" r="2.4" fill="#FFB400"/><circle cx="39" cy="11" r="2.4" fill="#FFB400"/></svg>'; Object.assign(d.style, { width: '80%', height: '80%' }); d.appendChild(enNode('see', 16, 30, '#FFF4C8')).style.cssText = 'position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);display:flex'; d.style.position = 'relative'; return d; },
  };

  /* ---------------------------------------------------------------- ④-4 挑战 「归！」 送字回家 (sort by meaning)
     Five little houses, a kind of thing on each door: the sky (a cloud), the ground (a hill and grass), animals (paw prints),
     the body (a little person), doing (a runner), the family (three heads: only once the child knows a family character). A card
     in the middle (read, not said: a tap says it and that question earns no star). Drag it into its house, or tap the house.
     Every character has one kind (KIND4); the disputable ones are not asked. Levels: 1 the card's picture beside it; 2 the
     character alone; 3 a character with a look-alike of another kind (日/目, 手/牛, 田/日): read it carefully; 4 a word of two
     characters (金鱼 -> animals, 雪山 -> the ground); 5 two cards, each to its house (both right). Random: 1 in 5 (5: 1 in 20). */
  const KZ = { sky: '天上', ground: '地上', animal: '动物', body: '身体', action: '动作', family: '家人' };
  const KEYS = Object.keys(KZ);
  const kindOf = c => KEYS.find(k => (W4D.kind[KZ[k]] || '').includes(c)) || null;
  const kindOfWord = w => { const x = W4D.kindWords.find(v => v[0] === w); return x ? KEYS.find(k => KZ[k] === x[1]) : kindOf(w); };
  const kindLine = k => W4D.kindLine[KZ[k]];
  const charPic = c => { const o = ITEM[c] && ITEM[c].obj; return o && (o[0] === '@' || W4X.hasPic(o)) ? o : null; };
  const itemPic = t => (t.length === 1 ? charPic(t) : zhPic(t));
  const KIND_ICON = {
    sky: '<circle cx="30" cy="30" r="27" fill="#BFE6FF" stroke="#2B2118" stroke-width="2.5"/><path d="M15 41C9 41 7 35 10 31C12 28 16 27 19 29C20 22 26 18 32 19C38 19 42 23 43 28C48 27 53 31 52 36C52 39 49 41 46 41Z" fill="#fff" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/>',
    ground: '<circle cx="30" cy="30" r="27" fill="#E4F4D2" stroke="#2B2118" stroke-width="2.5"/><path d="M9 44L24 17L33 31L39 23L52 44Z" fill="#9AA4B0" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><path d="M19 26L24 17L29 25Z" fill="#fff"/><path d="M5 44C14 37 46 37 55 44V50C46 56 14 56 5 50Z" fill="#5CC46E" stroke="#2B2118" stroke-width="3"/>',
    animal: '<circle cx="30" cy="30" r="27" fill="#FFE9CC" stroke="#2B2118" stroke-width="2.5"/><g fill="#8B5E3C"><ellipse cx="21" cy="38" rx="7.5" ry="6.5"/><circle cx="13" cy="29" r="3.4"/><circle cx="18" cy="24" r="3.4"/><circle cx="25" cy="24" r="3.4"/><circle cx="29.5" cy="29" r="3.4"/><ellipse cx="40" cy="24" rx="6" ry="5.2"/><circle cx="33.5" cy="17" r="2.7"/><circle cx="37.5" cy="13" r="2.7"/><circle cx="43" cy="13" r="2.7"/><circle cx="46.5" cy="17" r="2.7"/></g>',
    body: '<circle cx="30" cy="30" r="27" fill="#FFE3EA" stroke="#2B2118" stroke-width="2.5"/><circle cx="30" cy="17" r="7" fill="#fff" stroke="#2B2118" stroke-width="3.5"/><path d="M30 25V40M18 31H42M30 40L22 52M30 40L38 52" stroke="#2B2118" stroke-width="4" stroke-linecap="round" fill="none"/>',
    action: '<circle cx="30" cy="30" r="27" fill="#E8E2FF" stroke="#2B2118" stroke-width="2.5"/><circle cx="36" cy="14" r="5.5" fill="#2B2118"/><path d="M34 22L27 35L36 41L31 51M27 35L18 44M32 26L43 31M32 26L21 24" stroke="#2B2118" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    family: '<circle cx="30" cy="30" r="27" fill="#FFF1C4" stroke="#2B2118" stroke-width="2.5"/><g fill="#2B2118"><circle cx="18" cy="20" r="6"/><path d="M9 47C9 31 27 31 27 47Z"/><circle cx="42" cy="20" r="6"/><path d="M33 47C33 31 51 31 51 47Z"/><circle cx="30" cy="32" r="4.5"/><path d="M23.5 49C23.5 38 36.5 38 36.5 49Z"/></g>',
  };
  const HOUSE_COL = { sky: ['#4FA3E8', '#EAF6FF'], ground: ['#3FAE4A', '#F1F8E4'], animal: ['#C8743A', '#FFF3E2'], body: ['#E86A8E', '#FFF0F4'], action: ['#7A5CD6', '#F2EEFF'], family: ['#F59A23', '#FFF7E2'] };
  const houseSvg = k => '<svg viewBox="0 0 170 190" width="100%" height="100%"><path d="M8 84L85 10L162 84Z" fill="' + HOUSE_COL[k][0] + '" stroke="#2B2118" stroke-width="6" stroke-linejoin="round"/>'
    + '<rect x="20" y="78" width="130" height="106" rx="10" fill="' + HOUSE_COL[k][1] + '" stroke="#2B2118" stroke-width="6"/><path d="M36 184V124C36 96 134 96 134 124V184Z" fill="#B07A45" stroke="#2B2118" stroke-width="5"/>'
    + '<g transform="translate(46,102) scale(1.3)">' + KIND_ICON[k] + '</g></svg>';
  const iconSvg = (k, size) => { const d = el('div', ''); d.innerHTML = '<svg viewBox="0 0 60 60" width="' + size + '" height="' + size + '">' + KIND_ICON[k] + '</svg>'; return d.firstChild; };
  const HW = () => (L() ? 168 : 180), HH = () => (L() ? 186 : 198);
  const HOUSES = () => (L() ? [0, 1, 2, 3, 4].map(i => [512 + (i - 2) * 182, 393]) : [[130, 540], [352, 540], [574, 540], [241, 768], [463, 768]]);
  const Sort = {
    rule: 'sort-by-meaning', kind0: 'quiz', verb: '归！', intro: '送字回家！', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), mine = poolOf(G, 'zh', false), chars = kn.filter(c => kindOf(c));
      const fam = chars.some(c => kindOf(c) === 'family');
      const lookOther = c => (LOOK[c] || '').split('').filter(x => kn.includes(x) && kindOf(x) && kindOf(x) !== kindOf(c) && !(HOLDS[c] || '').includes(x));
      let items, kinds;
      const words = lv === 4 ? W4D.kindWords.map(v => v[0]).filter(w => Array.from(w).every(c => kn.includes(c))) : [];
      if (words.length) {
        const own = mine.filter(k => words.some(w => w.includes(k)));
        const X = own.length ? W4X.pick(G, own) : null, c = X ? words.filter(w => w.includes(X)) : words;
        const w = bagFrom(G, 'kw' + (X || ''), c);
        items = [w]; kinds = [kindOfWord(w)];
      } else {
        let pool = lv <= 1 ? chars.filter(charPic) : lv === 3 ? chars.filter(c => lookOther(c).length) : chars;
        if (!pool.length) pool = chars;
        const X = W4X.pick(G, pool);
        items = [X];
        if (lv >= 5) { const Y = G.rng.pick(pool.filter(c => c !== X && kindOf(c) !== kindOf(X)).concat(chars.filter(c => c !== X && kindOf(c) !== kindOf(X))).slice(0, 12)); items.push(Y); }
        kinds = items.map(kindOf);
      }
      const avail = KEYS.filter(k => k !== 'family' || fam || kinds.includes(k));
      const others = R(G, avail.filter(k => !kinds.includes(k))).slice(0, 5 - kinds.length);
      const opts = W4X.put(G, others.concat(kinds.slice(1)), kinds[0]), two = kinds.length > 1;
      const first = Array.from(items[0]).find(c => mine.includes(c)) || Array.from(items[0]).find(c => kindOf(c)) || items[0][0];
      return { k: [items.join(','), opts.join(',')], items, kinds, answer: two ? 'all' : kinds[0], seq: two ? kinds.slice() : null, item: first, opts,
        pic: lv <= 1 && itemPic(items[0]) ? 1 : 0, look: items[0].length === 1 && lookOther(items[0]).length ? 1 : 0, word: items[0].length > 1 ? 1 : 0, two: two ? 1 : 0 };
    },
    /* tests/w4_levels.js: the picture gone, a look-alike of another kind, a word, two cards */
    hard(q) { return (1 - q.pic) * 1.5 + q.look * 1.5 + q.word * 2 + q.two * 4; },
    itemOf(st) { return W4X.own(st, st.q.item); },
    itemsOf(st) { const mine = poolOf(st.G, 'zh', false), q = st.q; return Array.from(new Set(q.items.join(''))).filter(c => c !== q.item && (q.items.length > 1 ? kindOf(c) : mine.includes(c))); },
    readCard(st, t, j) {
      const d = ZX.thing(st, 10, 10, 8, 'card'); d.style.flexDirection = 'row'; d.style.gap = '0px';
      Array.from(t).forEach(c => d.appendChild(Glyph.zh(c, t.length > 1 ? 92 : 112)));
      d._w = t.length > 1 ? 220 : 150; d._h = t.length > 1 ? 140 : 150;
      K.reg(st, j ? 'read1' : 'read', d, { drag: true, drops: () => st.cards.map((c, i) => ({ id: 'card' + i, rect: () => box(c) })) });
      K.pop(st, d, 120 * j);
      return d;
    },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.done = [];
      st.opts = q.opts.slice();
      st.cards = q.opts.map((k, i) => { const d = ZX.thing(st, HW(), HH(), 5, 'item'); d.innerHTML = houseSvg(k); K.reg(st, 'card' + i, d, {}); K.pop(st, d, 60 * i); return d; });
      st.reads = q.items.map((t, j) => this.readCard(st, t, j));
      st.readEl = st.reads[0]; st.readText = q.items[0];
      if (q.pic) st.pics = [this.picCard(st, 0)];
      this.place(st); this.mark(st);
      K.say(st, q.two ? '送它们回家！' : '送它回家！');
    },
    picCard(st, j) {
      const p = itemPic(st.q.items[j]); if (!p) return null;
      const d = ZX.thing(st, 120, 120, 7, 'card'); d.classList.add('pic'); d.style.pointerEvents = 'none'; d.appendChild(W4X.pic(p, 100)); d._j = j; K.pop(st, d, 150);
      return d;
    },
    readSpot(st, j) { const n = st.reads.length, x = (L() ? 512 : 352) + (n > 1 ? (j ? 1 : -1) * (L() ? 120 : 110) : 0); return [x, L() ? 180 : 290]; },
    place(st) {
      if (!st.cards) return;
      const H = HOUSES(), w = HW(), h = HH();
      st.cards.forEach((d, i) => place(d, H[i][0] - w / 2, H[i][1] - h / 2, w, h));
      st.reads.forEach((d, j) => { if (st.done.includes(j)) { this.atHouse(st, j); return; } const [x, y] = this.readSpot(st, j); place(d, x - d._w / 2, y - d._h / 2, d._w, d._h); });
      (st.pics || []).forEach(p => { if (!p) return; const r = box(st.reads[p._j]); place(p, r.x + r.w + 16, r.y + r.h / 2 - 60, 120, 120); });
    },
    /* a card that is home sits small on its house's roof */
    atHouse(st, j) { const d = st.reads[j], hb = box(st.cards[st.opts.indexOf(st.q.kinds[j])]); place(d, hb.x + hb.w / 2 - d._w / 2, hb.y - d._h * 0.5, d._w, d._h); d.style.transform = 'scale(.5)'; },
    mark(st) { st.reads.forEach((d, j) => { d.style.boxShadow = st.reads.length > 1 && j === st.ix && !st.done.includes(j) ? '0 0 0 5px #2B2118, 0 0 0 11px #FFE14A' : ''; }); },
    decor(G) { ZBase.decor.call(this, G); },
    onGesture(st, name, p) {
      if (st.submitted || st.busy) return false;
      const rj = p.id === 'read' ? 0 : p.id === 'read1' ? 1 : -1;
      if (name === 'tap' && rj >= 0) { if (st.done.includes(rj)) return false; st.readEl = st.reads[rj]; st.readText = st.q.items[rj]; W4X.peek(st); return 'ok'; }
      let j = st.ix, i = -1;
      if (name === 'drop' && rj >= 0) { if (st.done.includes(rj)) return false; j = rj; i = K.cardIndex(p.to); settle(st.reads[j]); }
      else if (name === 'tap') i = K.cardIndex(p.id);
      if (i < 0) return false;
      const q = st.q, want = q.kinds[j];
      st.tapped = i; st.cur = j; Sfx.tap();
      if (st.opts[i] !== want) { Session.submit(st, st.opts[i]); return 'ok'; }
      st.done.push(j);
      if (st.done.length < q.items.length) {             /* the first of two goes home; the other one is next */
        st.busy = true; st.ix = q.items.findIndex((_, x) => !st.done.includes(x)); this.mark(st);
        this.goHome(st, j).then(() => { st.busy = false; });
        Sfx.place(); return 'ok';
      }
      Session.submit(st, q.two ? 'all' : want);
      return 'ok';
    },
    async goHome(st, j) {
      const d = st.reads[j], hb = box(st.cards[st.opts.indexOf(st.q.kinds[j])]);
      settle(d); d.style.boxShadow = '';
      (st.pics || []).forEach(p => { if (p && p._j === j) p.style.visibility = 'hidden'; });
      await K.flyTo(st, d, hb.x + hb.w / 2 - d._w / 2, hb.y - d._h * 0.5, 360, 50, 0.5);
      K.hop(st, st.cards[st.opts.indexOf(st.q.kinds[j])], 14);
    },
    async reveal(st) {
      const q = st.q, j = st.cur || 0, e = st.cards[st.opts.indexOf(q.kinds[j])];
      await this.goHome(st, j);
      if (!Session.alive(st)) return;
      Sfx.reveal(); const b = box(e); Fx.burst(b.x + b.w / 2, b.y + 40, { n: 14, dist: 90 });
      const wk = st.G.actors.wukong; if (wk) wk.react();
      Voice.say(kindLine(q.kinds[j]), { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    wrongLine(st) { return W4X.thisIs(st.q.items[st.cur || 0]); },
    async feedback(st) {
      unmove(st.reads[st.cur || 0]); this.place(st); K.wiggle(st, st.cards[st.tapped]);
      Voice.say(this.wrongLine(st), { tag: 'wrong' });
      await st.scope.wait(900);
    },
    /* explain: 1 the house he chose in blue - the card is back out of its door, its picture beside it ("这是牙" was just said);
       2 the card's picture and the right door's sign side by side (a beat); 3 the right house in gold: "这是身体" */
    async explain(st) {
      const q = st.q, j = st.cur || 0, want = q.kinds[j], eC = st.cards[st.tapped], eR = st.cards[st.opts.indexOf(want)], card = st.reads[j], pic = itemPic(q.items[j]);
      (st.pics || []).forEach(p => { if (p) p.style.visibility = 'hidden'; });
      st.reads.forEach((r, x) => { if (x !== j && !st.done.includes(x)) r.style.visibility = 'hidden'; });      /* level 5: the other card steps aside */
      W4X.exChosen(st, eC, null);
      const d = this.pair(st, card, pic);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => this.pairAdd(st, d, want), 850);
      await W4X.exRight(st, eR, want, [kindLine(want)], false);
    },
    /* beside the card, on its free side: first the card's picture (blue), then -> the right door's sign (the panel goes gold) */
    pair(st, card, pic) {
      const c = box(card), busy = (st.cards || []).concat((st.reads || []).filter(r => r !== card && r.style.visibility !== 'hidden')).map(e => vbox(e)).concat(Array.from(Stage.el.querySelectorAll('[data-ex]')).map(e => vbox(e)), [{ x: 0, y: 0, w: 250, h: 108 }, { x: Stage.W - 236, y: 0, w: 236, h: 84 }]);
      const free = r => r.x >= 8 && r.y >= 8 && r.x + r.w <= Stage.W - 8 && r.y + r.h <= Stage.H - 8 && busy.every(b => r.x + r.w + 6 <= b.x || b.x + b.w + 6 <= r.x || r.y + r.h + 6 <= b.y || b.y + b.h + 6 <= r.y);
      let at = null, s = 84;
      for (const size of [84, 64, 52]) {
        const W = 2 * size + 40 + 48, H = size + 18, g = 18;
        at = [[c.x - W - g, c.y + c.h / 2 - H / 2], [c.x + c.w + g, c.y + c.h / 2 - H / 2], [c.x + c.w / 2 - W / 2, c.y + c.h + g], [c.x + c.w / 2 - W / 2, c.y - H - g]].map(([x, y]) => ({ x, y, w: W, h: H })).find(free);
        if (at) { s = size; break; }
      }
      const d = ZX.thing(st, 10, 10, 61, 'item'); d.dataset.ex = 'pic-chosen'; d._s = s;
      Object.assign(d.style, { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: '#FFFDF4', borderRadius: '20px', boxShadow: '0 0 0 4px ' + EX_BLUE + ', 0 6px 0 rgba(43,33,24,.2)', pointerEvents: 'none' });
      if (pic) d.appendChild(W4X.pic(pic, s)); else d.appendChild(Glyph.zh(st.q.items[st.cur || 0][0], s));
      if (!at) at = { x: clamp(c.x + c.w / 2 - (2 * s + 88) / 2, 8, Stage.W - 2 * s - 96), y: c.y + c.h + 12 };
      const left = at.x + at.w <= c.x;               /* left of the card: the picture stays next to the card, the sign comes on the far side */
      d._left = left; place(d, left ? at.x + at.w - s - 28 : at.x, at.y); d.style.width = d.style.height = 'auto';
      st.stepDirty = true; K.pop(st, d);
      return d;
    },
    pairAdd(st, d, want) {
      const s = d._s, eq = el('div', ''); eq.innerHTML = '<svg viewBox="0 0 40 40" width="40" height="40"><path d="M8 20H32M24 12L32 20L24 28" fill="none" stroke="#B07800" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const ic = iconSvg(want, s);
      if (d._left) { eq.firstChild.style.transform = 'scaleX(-1)'; d.insertBefore(eq, d.firstChild); d.insertBefore(ic, d.firstChild); place(d, parseFloat(d.style.left) - s - 50 - 10, parseFloat(d.style.top)); d.style.width = d.style.height = 'auto'; }
      else { d.appendChild(eq); d.appendChild(ic); }
      d.dataset.ex = 'pair'; d.style.boxShadow = '0 0 0 4px ' + EX_GOLD + ', 0 6px 0 rgba(43,33,24,.2)';
      st.scope.anim(ic, [{ transform: 'scale(.3)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 320, easing: EASE.pop });
    },
    /* the 2nd hint (real help): the card's picture beside it; level 1 has it already, a card without a picture gets none */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone || !st.reads) return; st.hintDone = true;
      if (st.q.pic) { st.noHelp = true; return; }
      const p = this.picCard(st, st.ix || 0); if (!p) { st.noHelp = true; return; }
      (st.pics = st.pics || []).push(p); this.place(st); Sfx.sparkle();
    },
    next(st, strat) {
      if (!st.cards || st.busy) return null;
      const q = st.q, want = q.kinds[st.ix || 0], i = strat === 'wrong' ? st.opts.findIndex(k => !q.kinds.includes(k)) : st.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).concat((st.reads || []).filter((_, j) => !(st.done || []).includes(j))); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() { const d = el('div'); d.innerHTML = houseSvg('animal'); Object.assign(d.style, { width: '76%', height: '76%' }); return d; },
  };

  w4Island('xiyou4', [Peach, Flash, Sort]);
})();

/* ---------------- src/w4/huluwa4.js */
/* ================================================================ 神笔海 ⑤ 葫芦娃 · 葫芦洞 (huluwa4): 多 少 开 关 去 (docs/W4-DESIGN.md §6 ⑤)
   认字 「关！」只留一盏灯 (all-but-one) · 写字 开 关 (W4X.Write) · 英文 「配！」中英对对碰 (word-to-character) ·
   挑战 「跷！」跷跷板 (opposite-balance). Built like the template src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  /* lines said through a variable (tools/voice_lines.py records them): the lamps' questions and the explanation's line for
     each of the island's characters */
  W4X.lines(['只留多！', '只留少！', '只留开！', '只留关！', '只留去！',
    '留多和少！', '留多和开！', '留多和关！', '留多和去！', '留少和开！', '留少和关！', '留少和去！', '留开和关！', '留开和去！', '留关和去！',
    '它就是多', '它就是少', '它就是开', '它就是关', '它就是去']);
  const vbox = e => { const r = e.getBoundingClientRect(), s = Stage.s || 1, a = Stage.toStage(r.left, r.top); return { x: a.x, y: a.y, w: r.width / s, h: r.height / s }; };
  const settle = e => { if (!e || !e.style.transform) return; const b = box(e), v = vbox(e); e.style.transform = ''; e.getAnimations().forEach(a => a.cancel()); place(e, v.x + v.w / 2 - b.w / 2, v.y + v.h / 2 - b.h / 2); };
  const unmove = e => { if (!e) return; e.style.transform = ''; e.getAnimations().forEach(a => a.cancel()); };
  const R = (G, a) => G.rng.shuffle(a.slice());
  const charPic = c => { const o = ITEM[c] && ITEM[c].obj; return o && (o[0] === '@' || W4X.hasPic(o)) ? o : null; };
  /* a card of glyphs (characters or English words) */
  const glyphs = (t, h) => { const d = el('div', ''); Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Math.round(h * 0.3) + 'px', pointerEvents: 'none' });
    if (/[A-Za-z]/.test(t)) t.split(' ').forEach(w => d.appendChild(Glyph.word(w, h))); else Array.from(t).forEach(c => d.appendChild(Glyph.zh(c, h))); return d; };
  /* a free spot for an explanation panel (never on a target, a ring's element or the corner buttons) */
  const freeSpot = (st, w, h, cands, avoid) => {
    const busy = (avoid || []).map(e => vbox(e)).concat(Array.from(Stage.el.querySelectorAll('[data-ex]')).map(e => vbox(e)), [{ x: 0, y: 0, w: 250, h: 108 }, { x: Stage.W - 236, y: 0, w: 236, h: 84 }]);
    const ok = r => r.x >= 8 && r.y >= 8 && r.x + r.w <= Stage.W - 8 && r.y + r.h <= Stage.H - 8 && busy.every(b => r.x + r.w + 6 <= b.x || b.x + b.w + 6 <= r.x || r.y + r.h + 6 <= b.y || b.y + b.h + 6 <= r.y);
    return cands.map(([x, y]) => ({ x, y, w, h })).find(ok) || null;
  };
  const panel = (st, nodes, border) => {
    const d = ZX.thing(st, 10, 10, 61, 'item'); d.dataset.ex = 'pair';
    Object.assign(d.style, { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: '#FFFDF4', borderRadius: '20px', boxShadow: '0 0 0 4px ' + (border || EX_GOLD) + ', 0 6px 0 rgba(43,33,24,.2)', pointerEvents: 'none' });
    nodes.forEach((n, i) => { if (i) { const a = el('div', '', d); a.innerHTML = '<svg viewBox="0 0 40 40" width="38" height="38"><path d="M6 20H34M13 12L5 20L13 28M27 12L35 20L27 28" fill="none" stroke="#B07800" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'; } d.appendChild(n); });
    d.style.width = d.style.height = 'auto';         /* its own size (measured before it is placed) */
    return d;
  };
  const picNode = (o, s) => (o ? W4X.pic(o, s) : null);

  /* ---------------------------------------------------------------- ⑤-1 认字 「关！」 只留一盏灯 (every lamp that is NOT X off)
     Five gourd lamps glow in the cave, a character on each. A tap turns a lamp off; turn off every lamp that is not X and leave
     X alight. Turning X off ends the question at once. Every tap is a "this is not X" judgement - each lamp has to be read.
     Levels: 1 X's picture on the task card; 2 heard only; 3 look-alikes (开/关/天, 少/小, 去/云) and an old character; 4 two lamps
     to leave ("留开和关！", three to turn off; two old characters); 5 six lamps, three old characters. Turning lamps off at random
     leaves the right ones alight 1 time in 5 (level 4: 1 in 10, level 5: 1 in 6). */
  const GOURD = 'M75 30C59 30 50 41 50 54C50 65 56 73 62 79C31 89 14 112 14 139C14 176 42 204 75 204C108 204 136 176 136 139C136 112 119 89 88 79C94 73 100 65 100 54C100 41 91 30 75 30Z';
  const lampSvg = on => '<svg viewBox="0 0 150 210" width="100%" height="100%"><path d="M75 0V20" stroke="#5B3A1E" stroke-width="5"/>'
    + '<path d="' + GOURD + '" fill="' + (on ? '#FFD45A' : '#8E877C') + '" stroke="#2B2118" stroke-width="6"/>'
    + '<ellipse cx="75" cy="146" rx="46" ry="44" fill="' + (on ? '#FFF2B0' : '#A39C90') + '"/><ellipse cx="66" cy="50" rx="8" ry="10" fill="' + (on ? '#FFF2B0' : '#A39C90') + '"/>'
    + '<rect x="60" y="16" width="30" height="16" rx="6" fill="#A0522D" stroke="#2B2118" stroke-width="4"/><path d="M90 22C102 12 116 16 118 24C108 30 98 28 90 22Z" fill="#46C27A" stroke="#2B2118" stroke-width="3"/></svg>';
  const LAMP = n => (L() ? (n > 5 ? [136, 196] : [150, 210]) : (n > 5 ? [150, 210] : [160, 224]));
  const LAMPS = n => {
    if (L()) { const [w] = LAMP(n), g = n > 5 ? 16 : 18; return Array.from({ length: n }, (_, i) => [512 + (i - (n - 1) / 2) * (w + g), 342]); }      /* room above for the explanation's pictures */
    return n > 5 ? [[140, 420], [352, 420], [564, 420], [140, 680], [352, 680], [564, 680]] : [[140, 420], [352, 420], [564, 420], [246, 680], [458, 680]];
  };
  const LAMP_ICON = '<svg viewBox="0 0 150 210" width="100%" height="100%"><path d="' + GOURD + '" fill="#FFD45A" stroke="#2B2118" stroke-width="8"/><ellipse cx="75" cy="146" rx="46" ry="44" fill="#FFF2B0"/><rect x="60" y="16" width="30" height="16" rx="6" fill="#A0522D" stroke="#2B2118" stroke-width="5"/></svg>';
  const Lamps = {
    rule: 'all-but-one', verb: '关！', intro: '关灯，只留它！', props: [],
    gen(G, o) {
      const lv = o.level, n = lv >= 5 ? 6 : 5, pool = poolOf(G, 'zh', false), X = W4X.pick(G, pool), opts = W4X.opts(G, lv, X, n);
      let keep = [X];
      if (lv === 4) {                                   /* two to leave alight: an island character already among the five, else one put in */
        const Y = opts.find(k => k !== X && pool.includes(k)) || G.rng.pick(pool.filter(k => k !== X));
        if (!opts.includes(Y)) opts[opts.findIndex(k => k !== X)] = Y;
        keep = [X, Y];                                  /* X first: its place comes from the position bag (balanced) */
      }
      const lk = keep.flatMap(k => (LOOK[k] || '').split(''));
      return { k: [keep.join(''), opts.join('')], answer: keep.length > 1 ? 'all' : X, seq: keep.length > 1 ? keep.slice() : null, item: X, keep, opts, n, pic: lv <= 1 ? 1 : 0,
        look: opts.filter(k => !keep.includes(k) && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: the picture gone, look-alikes, old characters, two to leave, six lamps */
    hard(q) { return (1 - q.pic) + q.look * 0.8 + q.rev * 0.8 + (q.keep.length - 1) * 2 + (q.n - 5) * 2; },
    itemOf(st) { return st.q.item; },
    itemsOf(st) { return st.q.keep.filter(k => k !== st.q.item); },
    /* right: every lamp that is not X is off (the answer is the state of the lamps, not one lamp) */
    evaluate(st, ans) { return ans === 'only-x-alight'; },
    async present(st) {
      const q = st.q;
      for (const k of q.keep) { await ZX.meet(st, k); if (!Session.alive(st)) return; }
      st.opts = q.opts.slice(); st.on = st.opts.map(() => true);
      st.lamps = st.cards = q.opts.map((k, i) => { const d = ZX.thing(st, 150, 210, 6, 'item'); this.draw(st, d, k, true); K.reg(st, 'card' + i, d, {}); K.pop(st, d, 60 * i); return d; });
      this.place(st);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(charPic(q.item) || ITEM[q.item].obj), 'q'] : ['speaker', 'q']]);
      const two = poolOf(st.G, 'zh', false).filter(k => q.keep.includes(k));       /* said in the island's order: 留开和关！ */
      K.say(st, q.keep.length > 1 ? '留' + two[0] + '和' + two[1] + '！' : '只留' + q.item + '！');
    },
    draw(st, d, k, on) {
      d.innerHTML = lampSvg(on);
      const g = el('div', '', d); Object.assign(g.style, { position: 'absolute', left: '50%', top: '69%', transform: 'translate(-50%,-50%)', width: '62%', height: '44%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' });
      const s = Glyph.zh(k, 100, on ? INK : '#5E584F'); s.setAttribute('width', '100%'); s.setAttribute('height', '100%'); g.appendChild(s);
      d.style.filter = on ? 'drop-shadow(0 0 14px rgba(255,200,60,.95)) drop-shadow(0 0 4px rgba(255,236,150,.9))' : 'none';
    },
    setOn(st, i, on) { st.on[i] = on; this.draw(st, st.lamps[i], st.opts[i], on); },
    place(st) {
      if (!st.lamps) return;
      const n = st.lamps.length, [w, h] = LAMP(n), P = LAMPS(n);
      st.lamps.forEach((d, i) => place(d, P[i][0] - w / 2, P[i][1] - h / 2, w, h));
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      const i = K.cardIndex(p.id); if (i < 0 || !st.on || !st.on[i]) return false;
      const q = st.q;
      this.setOn(st, i, false); Sfx.tap();
      st.scope.anim(st.lamps[i], [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0)' }], { duration: 360, fill: 'none' });
      if (q.keep.includes(st.opts[i])) { st.tapped = i; Session.submit(st, st.opts[i]); return 'ok'; }
      if (st.opts.every((k, j) => q.keep.includes(k) || !st.on[j])) Session.submit(st, 'only-x-alight');
      return 'ok';
    },
    /* the lamp(s) left alight shine, the thing comes out of it */
    async reveal(st) {
      const q = st.q, i = st.opts.indexOf(q.keep[0]), e = st.lamps[i], b = box(e);
      q.keep.forEach(k => { const d = st.lamps[st.opts.indexOf(k)]; K.hop(st, d, 26); st.scope.anim(d, [{ filter: d.style.filter }, { filter: 'drop-shadow(0 0 30px rgba(255,214,90,1)) drop-shadow(0 0 8px #fff)' }, { filter: d.style.filter }], { duration: 700 }); });
      Sfx.reveal();
      const h = st.G.actors.gourd2; if (h) h.react();
      await ZX.alive(st, q.item, b.x + b.w / 2, Math.max(120, b.y - 50), 140);
      q.keep.forEach(k => sayItem(k)); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the lamp he turned off - "这个是开" */
    async feedback(st, ans) { const e = st.lamps[st.tapped]; if (e) K.wiggle(st, e); Voice.say(W4X.thatIs(ans), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain (the one he turned off is the right one: no blue ring for it): 1 it lights again, gold, its picture: "它就是开";
       2 the others still alight in blue, each with its picture, go off one by one: "这些要关掉"; 3 only X is alight (a beat) */
    async explain(st, ans) {
      const q = st.q, i = st.tapped, e = st.lamps[i];
      this.setOn(st, i, true);
      await W4X.exRight(st, e, ans, ['它就是' + ans]);
      const rest = st.opts.map((k, j) => j).filter(j => st.on[j] && !q.keep.includes(st.opts[j]));
      rest.forEach(j => { EX.ring(st, st.lamps[j], 'chosen'); EX.picOver(st, st.lamps[j], st.opts[j], 'chosen', 80); });
      await EX.say(st, ['这些要关掉']);
      for (const j of rest) { this.setOn(st, j, false); Sfx.tap(); await EX.tick(st, 110); }
      await W4X.exBeat(st, () => { q.keep.forEach(k => { const j = st.opts.indexOf(k); if (!st.on[j]) this.setOn(st, j, true); if (j !== i) EX.outline(st, st.lamps[j]); }); }, 450);
    },
    /* the 2nd hint (real help): X's light flickers - the star goes */
    gestureHint(st, reteach) {
      if (reteach) { (st.lamps || []).forEach((c, i) => { if (st.on[i]) st.scope.timeout(() => K.hop(st, c, 16), 90 * i); }); return; }
      st.q.keep.forEach(k => { const d = st.lamps[st.opts.indexOf(k)]; if (!d) return; st.scope.anim(d, [{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-8deg) scale(1.08)' }, { transform: 'rotate(7deg) scale(1.08)' }, { transform: 'rotate(-4deg) scale(1.04)' }, { transform: 'rotate(0) scale(1)' }], { duration: 900, fill: 'none' }); });
      Sfx.sparkle();
    },
    next(st, strat) {
      if (!st.lamps) return null;
      const keep = st.q.keep, i = strat === 'wrong' ? st.opts.indexOf(keep[0]) : st.opts.findIndex((k, j) => st.on[j] && !keep.includes(k));
      return i >= 0 ? { g: 'tap', p: { id: 'card' + i } } : null;
    },
    workEls(st) { return (st.lamps || []).filter((_, i) => st.on && st.on[i]); },
    snap(st) { return { opts: st.opts || null, on: (st.on || []).filter(Boolean).length }; },
    iconNode() { const d = el('div'); d.innerHTML = LAMP_ICON; Object.assign(d.style, { width: '62%', height: '80%', filter: 'drop-shadow(0 0 6px rgba(255,200,60,.9))' }); return d; },
  };

  /* ---------------------------------------------------------------- ⑤-3 英文 「配！」 中英对对碰 (an English word = a character)
     An English word on the left (read, not said: a tap says it and that question earns no star), five characters on the right,
     a little wooden bridge between them. Tap the character that means the same - or drag the English card onto it: they meet
     on the bridge. BRIDGE4: both sides known (a child of 晨光海 only has big little up down go here). Levels: 1 the English card
     with its picture, the others unrelated; 2 the word alone; 3 the opposite among the others (big -> 小 too, up -> 下), or a
     number / colour of the same row; 4 the other way round: a character, five English words; 5 two English words, a character
     for each (both right). A random tap is right 1 time in 5 (5: 1 in 20). */
  const BR = () => W4D.bridge;
  const isIt = zh => ['就是', zh].join('');          /* "就是大": one recorded line a pair (BRIDGE4, tools/voice_lines.py) */
  const SAMECL = ['一二三四五六七八九十', '红黄蓝绿白'];
  const oppOf = c => { const p = W4D.opp.find(x => x.includes(c)); return p ? p.replace(c, '') : null; };
  const brPic = en => { const p = BR().find(x => x[0] === en); return p && p[2] && W4X.hasPic(p[2]) ? p[2] : null; };
  const confOf = (c, kn) => { const o = oppOf(c), out = []; if (o) out.push(o); SAMECL.forEach(g => { if (g.includes(c)) Array.from(g).forEach(x => { if (x !== c) out.push(x); }); }); (LOOK[c] || '').split('').forEach(x => out.push(x)); return out.filter(x => kn.includes(x) && !(HOLDS[c] || '').includes(x)); };
  const BRIDGE_SVG = '<svg viewBox="0 0 200 90" width="100%" height="100%"><path d="M4 70C40 18 160 18 196 70" fill="none" stroke="#7A4A22" stroke-width="16" stroke-linecap="round"/><path d="M4 70C40 18 160 18 196 70" fill="none" stroke="#C8874A" stroke-width="9" stroke-linecap="round" stroke-dasharray="14 5"/>'
    + '<path d="M12 46C46 0 154 0 188 46" fill="none" stroke="#7A4A22" stroke-width="5" stroke-linecap="round"/><g stroke="#7A4A22" stroke-width="5" stroke-linecap="round"><path d="M40 45V24M70 34V12M100 30V8M130 34V12M160 45V24"/></g></svg>';
  const Match = {
    rule: 'word-to-character', kind0: 'en', verb: '配！', intro: '英文配汉字！', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), pairs = BR().filter(p => kn.includes(p[1]));
      let pool = lv <= 1 ? pairs.filter(p => brPic(p[0])) : pairs; if (!pool.length) pool = pairs;
      const X = W4X.pick(G, pool.map(p => p[1])), P = pool.find(p => p[1] === X);
      if (lv === 4) {                                     /* the other way round: the character given, five English words */
        const others = [], add = w => { if (others.length < 4 && w !== P[0] && !others.includes(w)) others.push(w); };
        const op = oppOf(X), opEn = op && BR().find(p => p[1] === op);
        if (opEn) add(opEn[0]);
        BR().filter(p => SAMECL.some(g => g.includes(X) && g.includes(p[1]))).forEach(p => add(p[0]));
        R(G, BR().map(p => p[0])).forEach(add);
        const opts = W4X.put(G, others, P[0]);
        return { k: [X, opts.join(',')], given: [X], answer: P[0], item: X, opts, rev: 1, two: 0, pic: 0, conf: others.some(w => { const p = BR().find(x => x[0] === w); return p && confOf(X, BR().map(x => x[1])).includes(p[1]); }) ? 1 : 0 };
      }
      const two = lv >= 5;
      let Q = null;
      if (two) { const cand = pool.filter(p => p[1] !== X && p[1] !== oppOf(X)); Q = cand.length ? G.rng.pick(cand) : pool.find(p => p[1] !== X); }
      const ans = [X].concat(Q ? [Q[1]] : []), others = [], add = c => { if (others.length < 5 - ans.length && !ans.includes(c) && !others.includes(c) && kn.includes(c)) others.push(c); };
      const conf = ans.flatMap(c => confOf(c, kn));
      if (lv >= 3) R(G, conf).slice(0, 1).forEach(add);
      R(G, pairs.map(p => p[1]).filter(c => !conf.includes(c))).forEach(add);
      R(G, kn.filter(c => !conf.includes(c))).forEach(add);
      R(G, kn).forEach(add);
      const opts = W4X.put(G, others.concat(ans.slice(1)), X);
      return { k: [P[0] + (Q ? ',' + Q[0] : ''), opts.join('')], given: [P[0]].concat(Q ? [Q[0]] : []), zh: ans, answer: two ? 'all' : X, seq: two ? ans.slice() : null, item: X, opts,
        rev: 0, two: two ? 1 : 0, pic: lv <= 1 && brPic(P[0]) ? 1 : 0, conf: others.some(c => conf.includes(c)) ? 1 : 0 };
    },
    /* tests/w4_levels.js: the picture gone, a confusable among the others, the other way round, two at once */
    hard(q) { return (1 - q.pic) * 1.5 + q.conf * 1.5 + q.rev * 3 + q.two * 4; },
    itemOf(st) { return W4X.own(st, st.q.item); },
    itemsOf(st) { return (st.q.zh || []).slice(1); },
    enOf(st, j) { const q = st.q; return q.rev ? q.answer : q.given[j]; },
    zhOf(st, j) { const q = st.q; return q.rev ? q.given[0] : q.zh[j]; },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.done = [];
      st.bridge = ZX.thing(st, 200, 90, 4, 'item'); st.bridge.innerHTML = BRIDGE_SVG;
      st.reads = q.given.map((t, j) => {
        const d = ZX.thing(st, 10, 10, 8, 'card'); d.style.flexDirection = 'row'; d.style.gap = '12px';
        d.appendChild(glyphs(t, q.rev ? 104 : 64));
        if (q.pic && !j) { const p = brPic(t); if (p) d.appendChild(W4X.pic(p, 96)); }
        d._t = t;
        K.reg(st, j ? 'read1' : 'read', d, { drag: true, drops: () => st.cards.map((c, i) => ({ id: 'card' + i, rect: () => box(c) })) });
        K.pop(st, d, 120 * j);
        return d;
      });
      st.readEl = st.reads[0]; st.readText = q.given[0];
      st.opts = q.opts.slice();
      st.cards = q.opts.map((t, i) => { const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; st.els.push(d); d.appendChild(glyphs(t, q.rev ? 54 : 100)); K.reg(st, 'card' + i, d, {}); st.scope.anim(d, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, delay: 60 * i, easing: EASE.pop, fill: 'backwards' }); return d; });
      this.place(st); this.mark(st);
      K.say(st, q.rev ? '它是哪个词？' : q.two ? '它们是哪个字？' : '它是哪个字？');
    },
    /* sizes: the given card(s), the options */
    sizes(st) {
      const q = st.q;
      return { gw: q.rev ? 150 : q.pic ? 300 : q.two ? 200 : 230, gh: q.two ? 120 : 150, ow: q.rev ? (L() ? 196 : 200) : 140, oh: q.rev ? 112 : 140 };
    },
    place(st) {
      if (!st.cards) return;
      const q = st.q, S = this.sizes(st), n = st.reads.length, g = 18;
      let gx, gy, bx, by, bw, ocx, ocy;
      if (L()) {
        gx = q.pic ? 180 : 165; gy = 340; ocx = q.rev ? 704 : 690; ocy = 372;      /* room above the options for a picture */
        const cols = 3, gridW = cols * S.ow + (cols - 1) * g, left = ocx - gridW / 2, right = gx + S.gw / 2;
        bw = Math.max(80, left - right - 16); bx = right + 8; by = gy - 20;
      } else {
        gx = 352; gy = 250; ocx = 352; ocy = q.rev ? 700 : 690; bw = 240; bx = 352 - 120; by = gy + S.gh / 2 + (n > 1 ? 4 : 18);
      }
      st.reads.forEach((d, j) => {
        if (st.done.includes(j)) return;
        const x = L() ? gx : gx + (n > 1 ? (j ? 1 : -1) * 120 : 0), y = L() ? gy + (n > 1 ? (j ? 1 : -1) * 92 : 0) : gy;
        place(d, Math.round(x - S.gw / 2), Math.round(y - S.gh / 2), S.gw, S.gh);
      });
      place(st.bridge, Math.round(bx), Math.round(by), Math.round(bw), Math.round(bw * 0.42));
      const rows = [[0, 1, 2], [3, 4]], H = 2 * S.oh + g;
      st.cards.forEach((d, i) => {
        if (d._matched) return;
        const r = i < 3 ? 0 : 1, inRow = rows[r].length, k = rows[r].indexOf(i), W = inRow * S.ow + (inRow - 1) * g;
        place(d, Math.round(ocx - W / 2 + k * (S.ow + g)), Math.round(ocy - H / 2 + r * (S.oh + g)), S.ow, S.oh);
      });
      (st.matchedAt || []).forEach(([i, j]) => this.atRead(st, i, j));
    },
    /* a character matched to the first of two English words sits beside it, small */
    atRead(st, i, j) { const c = st.cards[i], r = box(st.reads[j]); place(c, L() ? r.x + r.w + 10 : r.x + r.w / 2 - 50, L() ? r.y + r.h / 2 - 50 : r.y + r.h + 8, 100, 100); },
    mark(st) { st.reads.forEach((d, j) => { d.style.boxShadow = st.reads.length > 1 && j === st.ix && !st.done.includes(j) ? '0 0 0 5px #2B2118, 0 0 0 11px #FFE14A' : ''; }); },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 86 : 80, L() ? 698 : 1016, L() ? 190 : 150); },
    peek(st, j) {
      const t = st.q.given[j];
      st.readEl = st.reads[j]; st.readText = t;
      if (/[A-Za-z]/.test(t)) { st.peeked = true; st.noStar = true; Voice.sayNow(t, { tag: 'peek' }); K.hop(st, st.reads[j], 12); }
      else W4X.peek(st);
    },
    onGesture(st, name, p) {
      if (st.submitted || st.busy) return false;
      const rj = p.id === 'read' ? 0 : p.id === 'read1' ? 1 : -1;
      if (name === 'tap' && rj >= 0) { if (st.done.includes(rj)) return false; this.peek(st, rj); return 'ok'; }
      let j = st.ix, i = -1;
      if (name === 'drop' && rj >= 0) { if (st.done.includes(rj)) return false; j = rj; i = K.cardIndex(p.to); settle(st.reads[j]); }
      else if (name === 'tap') i = K.cardIndex(p.id);
      if (i < 0 || st.cards[i]._matched) return false;
      const q = st.q, want = q.rev ? q.answer : q.zh[j];
      st.tapped = i; st.cur = j; Sfx.tap();
      if (st.opts[i] !== want) { Session.submit(st, st.opts[i]); return 'ok'; }
      st.done.push(j);
      if (st.done.length < st.reads.length) {               /* the first of two: the character goes beside its word */
        st.busy = true; st.ix = st.reads.findIndex((_, x) => !st.done.includes(x)); this.mark(st);
        const c = st.cards[i]; c._matched = true; (st.matchedAt = st.matchedAt || []).push([i, j]);
        const r = box(st.reads[j]); unmove(st.reads[j]); this.place(st);
        K.flyTo(st, c, L() ? r.x + r.w + 10 : r.x + r.w / 2 - 50, L() ? r.y + r.h / 2 - 50 : r.y + r.h + 8, 340, 40, 1).then(() => { if (!st.scope.dead) { c.style.width = c.style.height = '100px'; c.firstChild.style.transform = 'scale(.7)'; st.busy = false; } });
        Voice.say(this.enOf(st, j), { tag: 'prompt' }); Sfx.place();
        return 'ok';
      }
      Session.submit(st, q.two ? 'all' : want);
      return 'ok';
    },
    /* the two cards meet on the bridge (碰！); the English word is said and "就是大" */
    async reveal(st) {
      const q = st.q, j = st.cur || 0, r = st.reads[j], c = st.cards[st.opts.indexOf(q.rev ? q.answer : q.zh[j])], b = box(st.bridge);
      settle(r);
      const mx = b.x + b.w / 2, my = b.y + b.h * 0.25, rb = box(r), cb = box(c);
      await Promise.all([K.flyTo(st, r, mx - rb.w - 2, my - rb.h / 2, 380, 40, 1), K.flyTo(st, c, mx + 2, my - cb.h / 2, 380, 40, 1)]);
      if (!Session.alive(st)) return;
      Sfx.thud(); Fx.burst(mx, my, { n: 16, dist: 100 });
      st.scope.anim(r, [{ transform: 'translateX(0)' }, { transform: 'translateX(-14px)' }, { transform: 'translateX(0)' }], { duration: 260, fill: 'none' });
      st.scope.anim(c, [{ transform: 'translateX(0)' }, { transform: 'translateX(14px)' }, { transform: 'translateX(0)' }], { duration: 260, fill: 'none' });
      const h = st.G.actors.gourd2; if (h) h.react();
      Voice.say(this.enOf(st, j), { tag: 'summary' }); Voice.say(isIt(this.zhOf(st, j)), { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: what he picked ("这是小"; the other way round: the English word, said) */
    async feedback(st, ans) {
      const r = st.reads[st.cur || 0]; unmove(r); this.place(st);
      const e = st.cards[st.tapped]; if (e) K.wiggle(st, e);
      Voice.say(/[A-Za-z]/.test(ans) ? ans : W4X.thisIs(ans), { tag: 'wrong' });
      await st.scope.wait(900);
    },
    /* explain: 1 his card in blue with its picture; 2 the English word said, its picture and the right character's picture side by
       side (a beat); 3 the right card in gold: the English word, "就是大" */
    async explain(st, ans) {
      const q = st.q, j = st.cur || 0, en = this.enOf(st, j), zh = this.zhOf(st, j), want = q.rev ? q.answer : zh;
      const eC = st.cards[st.tapped], eR = st.cards[st.opts.indexOf(want)];
      st.reads.forEach((r, x) => { if (x !== j && !st.done.includes(x)) r.style.visibility = 'hidden'; });
      const pc = /[A-Za-z]/.test(ans) ? brPic(ans) : charPic(ans);
      W4X.exChosen(st, eC, pc ? W4X.pic(pc, 84) : null);
      await EX.wait(st, 650);
      await EX.say(st, [en]);
      await W4X.exBeat(st, () => this.pair(st, en, zh), 800);
      await W4X.exRight(st, eR, want, [en, isIt(zh)], false);
    },
    /* the English word's picture <-> the character's picture (or the word <-> the character), over the bridge */
    pair(st, en, zh) {
      const pe = brPic(en), pz = charPic(zh), s = 76;
      const d = panel(st, [pe ? picNode(pe, s) : glyphs(en, 52), pz ? picNode(pz, s) : Glyph.zh(zh, s)]);
      const r = vbox(d), b = box(st.bridge), w = r.w, h = r.h;
      const g = box(st.reads[st.cur || 0]), ob = st.cards.filter(c => !c._matched).map(c => box(c)), oy = Math.max(...ob.map(c => c.y + c.h)), ox = (Math.min(...ob.map(c => c.x)) + Math.max(...ob.map(c => c.x + c.w))) / 2;
      const at = freeSpot(st, w, h, [[b.x + b.w / 2 - w / 2, b.y - h - 10], [b.x + b.w / 2 - w / 2, b.y + b.h + 10], [b.x + b.w / 2 - w / 2, b.y + b.h / 2 - h / 2],
        [g.x + g.w / 2 - w / 2, g.y + g.h + 14], [ox - w / 2, oy + 14], [Stage.W / 2 - w / 2, 110]], st.cards.concat(st.reads.filter(x => x.style.visibility !== 'hidden')));
      place(d, at ? at.x : clamp(b.x + b.w / 2 - w / 2, 8, Stage.W - w - 8), at ? at.y : Math.max(110, b.y - h - 10)); d.style.width = d.style.height = 'auto';
      K.pop(st, d);
    },
    /* the 2nd hint (real help): the picture beside the given card; level 1 has it already, a word without one gets none */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone || !st.reads) return; st.hintDone = true;
      const j = st.ix || 0, t = st.q.given[j], p = st.q.rev ? charPic(t) : brPic(t);
      if (st.q.pic || !p) { st.noHelp = true; return; }
      const r = box(st.reads[j]), d = ZX.thing(st, 104, 104, 9, 'card'); d.classList.add('pic'); d.style.pointerEvents = 'none'; d.appendChild(W4X.pic(p, 90));
      place(d, L() ? r.x + r.w / 2 - 52 : r.x + r.w + 12, L() ? r.y - 112 : r.y + r.h / 2 - 52, 104, 104); K.pop(st, d); Sfx.sparkle();
    },
    next(st, strat) {
      if (!st.cards || st.busy) return null;
      const q = st.q, j = st.ix || 0, want = q.rev ? q.answer : q.zh[j];
      const i = strat === 'wrong' ? st.opts.findIndex((t, x) => t !== want && !(q.zh || []).includes(t) && !st.cards[x]._matched) : st.opts.indexOf(want);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).filter(c => !c._matched).concat((st.reads || []).filter((_, j) => !(st.done || []).includes(j))); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() { const d = el('div'); Object.assign(d.style, { display: 'flex', alignItems: 'center', gap: '4px' }); d.appendChild(Glyph.word('big', 28)); const a = el('div', '', d); a.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18"><path d="M3 10H17M7 6L3 10L7 14M13 6L17 10L13 14" fill="none" stroke="#46C27A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'; d.appendChild(Glyph.zh('大', 34)); return d; },
  };

  /* ---------------------------------------------------------------- ⑤-4 挑战 「跷！」 跷跷板 (the opposite balances it)
     A seesaw on the grass: a card on its low end (read, not said: a tap says it - no star for that question), the other end
     empty and up in the air. Put the opposite on it (drag a card onto the empty seat, or tap it: it flies there) - right, and the
     seesaw comes level and the pair is said ("多，少！"). OPP4: both characters known (a child of 晨光海 only: 大小 上下 多少
     开关 天地). Levels: 1 the card's picture, the others unrelated; 2 the card alone; 3 others of the same kind that are not its
     opposite (上: 左 前 中 / 天 地); 4 a look-alike of the answer too (少: 小, 开: 天, 去: 云); 5 words (开门 -> 关门, 上山 ->
     下山), else level 4. A random card is right 1 time in 5. */
  const CLS = ['上下左右前后中', '大小多少', '开关来去走坐站飞', '天地日月山川土'];
  const sameOf = c => { const g = CLS.find(x => x.includes(c)); return g ? Array.from(g).filter(x => x !== c) : []; };
  const zhPic = w => { const x = W4D.wordsZh.find(v => v[0] === w); return x && x[1] && W4X.hasPic(x[1]) ? x[1] : null; };
  const itemPic = t => (t.length === 1 ? charPic(t) : zhPic(t));
  const pairLine = (a, b) => { const p = W4D.opp.find(x => x === a + b || x === b + a), w = W4D.oppWords.find(x => (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a)); const [s, t] = p ? Array.from(p) : w || [a, b]; return s + '，' + t + '！'; };
  const TILT = -11;
  const SEESAW = () => (L() ? { cx: 512, cy: 392, len: 640 } : { cx: 352, cy: 452, len: 600 });
  const Seesaw = {
    rule: 'opposite-balance', kind0: 'quiz', verb: '跷！', intro: '跷跷板，反过来！', props: [],
    gen(G, o) {
      const lv = o.level, kn = W4X.known(G), knows = w => Array.from(w).every(c => kn.includes(c));
      const words = lv >= 5 ? W4D.oppWords.filter(p => knows(p[0]) && knows(p[1])) : [];
      if (words.length) {
        const flat = words.flatMap(p => [[p[0], p[1]], [p[1], p[0]]]), [qw, aw] = bagFrom(G, 'ow', flat);
        const pool2 = W4D.wordsZh.map(v => v[0]).filter(w => knows(w) && w !== qw && w !== aw);
        const others = [], add = w => { if (others.length < 4 && !others.includes(w)) others.push(w); };
        R(G, pool2.filter(w => Array.from(w).some(c => aw.includes(c)))).slice(0, 2).forEach(add);
        R(G, pool2.filter(w => Array.from(w).some(c => qw.includes(c)))).slice(0, 1).forEach(add);
        R(G, pool2).forEach(add);
        const opts = W4X.put(G, others, aw);
        return { k: [qw, opts.join('')], ask: qw, answer: aw, item: Array.from(qw).find(c => poolOf(G, 'zh', false).includes(c)) || qw[0], opts, pic: 0, word: 1,
          same: Math.min(2, others.filter(w => Array.from(w).some(c => aw.includes(c))).length), look: 0 };
      }
      const pairs = W4D.opp.filter(p => knows(p)), chars = Array.from(new Set(pairs.join('')));
      const pool = lv <= 1 ? chars.filter(charPic) : chars;
      const X = W4X.pick(G, pool.length ? pool : chars), A = oppOf(X);
      const bad = x => x === X || x === A || (HOLDS[A] || '').includes(x) || (HOLDS[X] || '').includes(x);
      const same = sameOf(X).concat(sameOf(A)).filter(x => kn.includes(x) && !bad(x));
      const look = (LOOK[A] || '').split('').filter(x => kn.includes(x) && !bad(x));
      const others = [], add = x => { if (others.length < 4 && !bad(x) && !others.includes(x) && kn.includes(x)) others.push(x); };
      if (lv >= 4) R(G, look).slice(0, 1).forEach(add);
      if (lv >= 3) R(G, same).slice(0, 2).forEach(add);
      const far = kn.filter(x => !same.includes(x) && !look.includes(x) && !(LOOK[X] || '').includes(x));
      R(G, far).forEach(add);
      R(G, kn).forEach(add);
      const opts = W4X.put(G, others, A);
      return { k: [X, opts.join('')], ask: X, answer: A, item: X, opts, pic: lv <= 1 && charPic(X) ? 1 : 0, word: 0,
        same: Math.min(2, others.filter(x => same.includes(x)).length), look: others.filter(x => look.includes(x)).length ? 1 : 0 };
    },
    /* tests/w4_levels.js: the picture gone, others of the same kind, a look-alike of the answer, words */
    hard(q) { return (1 - q.pic) * 1.5 + q.same + q.look * 1.5 + q.word * 4; },
    itemOf(st) { return W4X.own(st, st.q.item); },
    itemsOf(st) { const q = st.q; return q.answer.length === 1 ? [q.answer] : Array.from(q.answer).filter(c => poolOf(st.G, 'zh', false).includes(c)); },
    async present(st) {
      const q = st.q, S = SEESAW();
      st.base = ZX.thing(st, 120, 110, 4, 'item'); st.base.innerHTML = '<svg viewBox="0 0 120 110" width="100%" height="100%"><path d="M60 8L112 104H8Z" fill="#A0522D" stroke="#2B2118" stroke-width="7" stroke-linejoin="round"/><circle cx="60" cy="22" r="10" fill="#F5B324" stroke="#2B2118" stroke-width="5"/></svg>';
      const beam = st.beam = ZX.thing(st, S.len, 200, 6, 'item'); beam.style.transformOrigin = '50% 92%'; beam.style.pointerEvents = 'none';
      const plank = el('div', '', beam); Object.assign(plank.style, { position: 'absolute', left: '0px', right: '0px', bottom: '8px', height: '30px', borderRadius: '15px', background: 'linear-gradient(#5CC46E,#3E9E52)', boxShadow: '0 0 0 5px #2B2118' });
      const cw = q.word ? 190 : q.pic ? 250 : 136, ch = q.word ? 130 : 136;
      const card = st.askEl = el('div', 'card', beam); Object.assign(card.style, { position: 'absolute', left: '14px', bottom: '42px', width: cw + 'px', height: ch + 'px', flexDirection: 'row', gap: '10px', pointerEvents: 'auto' });
      card.appendChild(glyphs(q.ask, q.word ? 80 : 104));
      if (q.pic) card.appendChild(W4X.pic(charPic(q.ask), 100));
      K.reg(st, 'read', card, {}); st.readEl = card; st.readText = q.ask;
      const slot = st.slot = el('div', '', beam); Object.assign(slot.style, { position: 'absolute', right: '14px', bottom: '42px', width: (q.word ? 190 : 136) + 'px', height: ch + 'px', borderRadius: '24px', border: '6px dashed #2B2118', background: 'rgba(255,248,214,.75)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' });
      beam.style.transform = 'rotate(' + TILT + 'deg)';
      st.opts = q.opts.slice();
      st.cards = q.opts.map((t, i) => {
        const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; st.els.push(d); d.appendChild(glyphs(t, q.word ? 64 : 92));
        K.reg(st, 'card' + i, d, { drag: true, drops: () => [{ id: 'slot', rect: () => vbox(st.slot) }] });
        st.scope.anim(d, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, delay: 60 * i, easing: EASE.pop, fill: 'backwards' });
        return d;
      });
      this.place(st);
      K.say(st, '反过来是哪个？');
    },
    osize(st) { return st.q.word ? [150, 112] : (L() ? [124, 124] : [132, 132]); },
    place(st) {
      if (!st.beam) return;
      const S = SEESAW(), [w, h] = this.osize(st), g = L() ? 16 : 20;
      place(st.base, S.cx - 60, S.cy - 14, 120, 110);
      place(st.beam, S.cx - S.len / 2, S.cy - 184, S.len, 200);
      if (L()) { const W = 5 * w + 4 * g; st.cards.forEach((d, i) => { if (!d._seated) place(d, Math.round(512 - W / 2 + i * (w + g)), 600 - h / 2, w, h); }); }
      else st.cards.forEach((d, i) => { if (d._seated) return; const r = i < 3 ? 0 : 1, n = r ? 2 : 3, k = r ? i - 3 : i, W = n * w + (n - 1) * g; place(d, Math.round(352 - W / 2 + k * (w + g)), Math.round(650 + r * (h + g)), w, h); });
    },
    decor(G) {
      const Lx = L(), a = G.actors[this.chars[0]], b = G.actors[this.chars[1]];
      this.chars.forEach(id => hideActor(G.actors[id]));
      if (a) showActor(a, Lx ? 86 : 76, Lx ? 698 : 1016, Lx ? 190 : 150);
      if (b) showActor(b, Lx ? 944 : 630, Lx ? 698 : 1016, Lx ? 180 : 150);
    },
    onGesture(st, name, p) {
      if (st.submitted || st.busy) return false;
      if (name === 'tap' && p.id === 'read') { W4X.peek(st); return 'ok'; }
      const i = K.cardIndex(p.id);
      if (i < 0 || !(name === 'tap' || (name === 'drop' && p.to === 'slot'))) return false;
      st.tapped = i; Sfx.tap(); st.busy = true;
      this.seat(st, i, name === 'drop').then(() => { if (Session.alive(st)) Session.submit(st, st.opts[i]); });
      return 'ok';
    },
    /* the card flies onto the empty seat (and stays there: a copy inside the seat, so it moves with the seesaw) */
    async seat(st, i, dropped) {
      const c = st.cards[i], v = vbox(st.slot), b = box(c);
      if (dropped) settle(c);
      await K.flyTo(st, c, v.x + v.w / 2 - b.w / 2, v.y + v.h / 2 - b.h / 2, dropped ? 160 : 340, dropped ? 0 : 50, 1);
      if (st.scope.dead) return;
      c.style.visibility = 'hidden'; c._seated = true;
      st.slot.innerHTML = ''; st.slot.style.border = '5px solid #2B2118'; st.slot.style.background = '#FFFDF6'; st.slot.appendChild(glyphs(st.opts[i], st.q.word ? 80 : 104));
      Sfx.place();
    },
    async level(st) { await st.scope.anim(st.beam, [{ transform: 'rotate(' + TILT + 'deg)' }, { transform: 'rotate(2deg)' }, { transform: 'rotate(0deg)' }], { duration: 700, easing: EASE.glide, commit: true }); },
    /* the seesaw comes level, both cards hop, the pair is said */
    async reveal(st) {
      await this.level(st);
      if (!Session.alive(st)) return;
      Sfx.reveal(); K.hop(st, st.askEl, 22); K.hop(st, st.slot, 22);
      const v = vbox(st.beam); Fx.burst(v.x + v.w / 2, v.y + v.h * 0.5, { n: 16, dist: 120 });
      const h = st.G.actors.gourd2; if (h) h.react();
      Voice.say(pairLine(st.q.ask, st.q.answer), { tag: 'summary' }); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: what he put on ("这是小"); the seesaw wobbles but does not come level */
    async feedback(st, ans) {
      st.scope.anim(st.beam, [{ transform: 'rotate(' + TILT + 'deg)' }, { transform: 'rotate(' + (TILT + 4) + 'deg)' }, { transform: 'rotate(' + TILT + 'deg)' }], { duration: 500, fill: 'none' });
      Voice.say(W4X.thisIs(ans), { tag: 'wrong' });
      await st.scope.wait(900);
    },
    /* explain: 1 the card he put on slides back to its row, in blue with its picture; 2 the asked card's picture and the right
       one's side by side (a beat); 3 the right card in gold flies onto the seat, the seesaw comes level: "多，少！" */
    async explain(st, ans) {
      const q = st.q, i = st.tapped, eC = st.cards[i], eR = st.cards[st.opts.indexOf(q.answer)];
      st.slot.innerHTML = ''; Object.assign(st.slot.style, { border: '6px dashed #2B2118', background: 'rgba(255,248,214,.75)' });
      eC._seated = false; eC.style.visibility = ''; unmove(eC); this.place(st); st.busy = false;
      const pc = itemPic(ans); W4X.exChosen(st, eC, pc ? W4X.pic(pc, 84) : null);
      await EX.wait(st, 650);
      await W4X.exBeat(st, () => this.pair(st), 800);
      EX.ring(st, eR, 'right'); st.stepDirty = true;
      await this.seat(st, st.opts.indexOf(q.answer), false);
      eR.style.visibility = ''; eR._seated = false; this.place(st);
      await this.level(st);
      await EX.say(st, [pairLine(q.ask, q.answer)]);
      await EX.wait(st, 300);
    },
    /* the asked card's picture <-> the answer's picture, above the seesaw */
    pair(st) {
      const q = st.q, pa = itemPic(q.ask), pb = itemPic(q.answer), s = 76;
      const d = panel(st, [pa ? picNode(pa, s) : glyphs(q.ask, 60), pb ? picNode(pb, s) : glyphs(q.answer, 60)]);
      const r = vbox(d), w = r.w, h = r.h, v = vbox(st.beam);
      const at = freeSpot(st, w, h, [[v.x + v.w / 2 - w / 2, v.y - 6], [v.x + v.w / 2 - w / 2, v.y + 20], [v.x + v.w / 2 - w / 2, 112]], st.cards.concat([st.askEl, st.slot]));
      place(d, at ? at.x : v.x + v.w / 2 - w / 2, at ? at.y : Math.max(110, v.y - 6)); d.style.width = d.style.height = 'auto';
      K.pop(st, d);
    },
    /* the 2nd hint (real help): the asked card's picture appears; level 1 has it, a word without one gets none */
    gestureHint(st, reteach) {
      if (reteach) { (st.cards || []).forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone || !st.askEl) return; st.hintDone = true;
      const p = itemPic(st.q.ask); if (st.q.pic || !p) { st.noHelp = true; return; }
      const d = W4X.pic(p, 96); Object.assign(d.style, { position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', width: '96px', height: '96px' });
      st.askEl.appendChild(d); K.pop(st, d); Sfx.sparkle();
    },
    next(st, strat) {
      if (!st.cards || st.busy) return null;
      const i = strat === 'wrong' ? st.opts.findIndex(t => t !== st.q.answer) : st.opts.indexOf(st.q.answer);
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    cleanup(st) { (st.cards || []).forEach(c => { c._seated = false; }); },
    snap(st) { return { opts: st.opts || null }; },
    iconNode() { const d = el('div'); d.innerHTML = '<svg viewBox="0 0 60 60" width="100%" height="100%"><path d="M30 34L40 52H20Z" fill="#A0522D" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><g transform="rotate(-14 30 34)"><rect x="4" y="30" width="52" height="7" rx="3.5" fill="#5CC46E" stroke="#2B2118" stroke-width="2.5"/><rect x="6" y="16" width="13" height="13" rx="3" fill="#fff" stroke="#2B2118" stroke-width="2.5"/><rect x="41" y="16" width="13" height="13" rx="3" fill="#fff" stroke="#2B2118" stroke-width="2.5"/></g></svg>'; Object.assign(d.style, { width: '82%', height: '82%' }); return d; },
  };

  w4Island('huluwa4', [Lamps, Match, Seesaw]);
})();

/* ---------------- src/w4/paw4.js */
/* ================================================================ 神笔海 ⑥ 汪汪队 · 十字路口 (paw4): 左 右 中 前 后 (docs/W4-DESIGN.md §6 ⑥)
   认字 「走！」踩着字走过去 (path-of-the-character) · 写字 左 右 (W4X.Write; GF 0023-2020: 横 first, then 撇) · 英文 「判！」对不对
   (true-or-false) · 挑战 「开！」看路牌开车 (read-and-steer). Built on the template of src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  /* lines said through variables (tools/voice_lines.py records them) */
  W4X.lines(['踩着左走！', '踩着右走！', '踩着中走！', '踩着前走！', '踩着后走！', '点阿奇旁边的砖！',
    '这是左边', '这是右边', '这是前面', '这是后面', '左在这边', '右在这边', '前在这边', '后在这边', '这句不对', '这句是对的', '把警车滑出去！']);
  const GOLD = '#FFB400';
  const glow = (st, e, ms) => { if (e) st.scope.anim(e, [{ filter: 'none' }, { filter: 'drop-shadow(0 0 10px #FFB400) drop-shadow(0 0 18px #FFE14A)' }, { filter: 'none' }], { duration: ms || 800, fill: 'none' }); };

  /* ---------------------------------------------------------------- ⑥-1 认字 「走！」 踩着字走过去
     A board of paving tiles (levels 1-3 4 x 4, levels 4-5 5 x 5), a character on each. Chase waits on his badge left of the board,
     the lookout tower stands in a cell of the right-hand column. The tiles of X make a path from the tile beside Chase to the
     tile beside the tower: tap the tile next to Chase - he hops onto it - then the next ... (or slide a finger along them). Only
     a tile next to Chase can be stepped on (another one: nothing, "点阿奇旁边的砖！"). A tile that is not X ends the try; the last
     X tile beside the tower wins. The path never goes left and never touches itself, so it is the only way. Levels: 1 the
     picture on the task card, a straight path of 3; 2 heard only, 4 tiles with one bend; 3 5 tiles, two bends, look-alikes and an
     old character among the others; 4 5 x 5, 6 tiles, an X dead end beside the path (stepping on it is no mistake: step back);
     5 7 tiles, three bends or more, two dead ends, the others mostly look-alikes. A random walk reaches the tower (measured, 300
     questions a level) about 1 time in 7 at level 1 (at worst 1 in 5), 1 in 20 at level 2, 1 in 70, 1 in 270, 1 in 800 at level 5. */
  const STEPS = [0, 3, 4, 5, 6, 7], SIDE = lv => (lv <= 3 ? 4 : 5);
  const LOOKP = { 左: '右在有石', 右: '左石有在', 中: '虫口巾电', 前: '首', 后: '石右口' };
  const PATHS = {};
  const same = (a, b) => a[0] === b[0] && a[1] === b[1], touch = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
  /* every path of N tiles: from the left column, moves right / up / down (never left), never touching itself, ending beside a
     tower cell of the right column that touches no other tile of it; its bends fit the level */
  function pathsOf(n, N, lv) {
    const key = n + ':' + N + ':' + lv; if (PATHS[key]) return PATHS[key];
    const want = [null, b => b === 0, b => b === 1, b => b === 2, b => b >= 2 && b <= 3, b => b >= 3][lv], out = [], MOVES = [[0, 1], [-1, 0], [1, 0]];
    const walk = (cells, dirs) => {
      if (cells.length === N) {
        const bends = dirs.slice(1).filter((d, i) => d !== dirs[i]).length, e = cells[N - 1];
        if (!want(bends)) return;
        [[e[0], e[1] + 1], [e[0] - 1, e[1]], [e[0] + 1, e[1]]].forEach(t => {
          if (t[1] !== n - 1 || t[0] < 0 || t[0] >= n || cells.some(c => same(c, t)) || cells.slice(0, -1).some(c => touch(c, t))) return;
          out.push({ cells: cells.map(c => c.slice()), tower: t, bends });
        });
        return;
      }
      const last = cells[cells.length - 1];
      MOVES.forEach((m, di) => {
        const c = [last[0] + m[0], last[1] + m[1]];
        if (c[0] < 0 || c[0] >= n || c[1] >= n || cells.some(x => same(x, c)) || cells.slice(0, -1).some(x => touch(x, c))) return;
        cells.push(c); dirs.push(di); walk(cells, dirs); cells.pop(); dirs.pop();
      });
    };
    for (let r = 0; r < n; r++) walk([[r, 0]], []);
    return (PATHS[key] = out);
  }
  /* X tiles beside the path that lead nowhere (levels 4-5): touching one tile of it (not the first, not the last), not the tower,
     not each other */
  function deadEnds(G, n, P, k) {
    const cand = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const d = [r, c]; if (P.cells.some(x => same(x, d)) || same(d, P.tower) || touch(d, P.tower)) continue;
      const at = P.cells.map((x, i) => (touch(x, d) ? i : -1)).filter(i => i >= 0);
      if (at.length === 1 && at[0] > 0 && at[0] < P.cells.length - 1) cand.push(d);
    }
    const out = [];
    G.rng.shuffle(cand).forEach(d => { if (out.length < k && !out.some(x => touch(x, d))) out.push(d); });
    return out;
  }
  const PAD_SVG = '<svg viewBox="0 0 100 40" width="100%" height="100%"><ellipse cx="50" cy="22" rx="46" ry="15" fill="#2E6FD8" stroke="#2B2118" stroke-width="4"/><ellipse cx="50" cy="18" rx="34" ry="9" fill="#FFD23C" stroke="#2B2118" stroke-width="3"/></svg>';
  const TOWER_SVG = '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 4V22" stroke="#2B2118" stroke-width="4" stroke-linecap="round"/><path class="flag" d="M52 5L76 11L52 18Z" fill="#E8554A" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M30 30L50 20L70 30Z" fill="#E8554A" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><rect x="28" y="30" width="44" height="22" rx="6" fill="#7BC8F6" stroke="#2B2118" stroke-width="4"/><path d="M40 52L36 92H64L60 52Z" fill="#F5F0E6" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<rect x="45" y="70" width="10" height="22" rx="3" fill="#2E6FD8" stroke="#2B2118" stroke-width="3"/><circle cx="50" cy="61" r="5" fill="#FFD23C" stroke="#2B2118" stroke-width="2.5"/><path d="M26 94H74" stroke="#2B2118" stroke-width="5" stroke-linecap="round"/></svg>';
  const Path = {
    rule: 'path-of-the-character', verb: '走！', intro: '踩着字走过去！', props: [],
    gen(G, o) {
      const lv = o.level, n = SIDE(lv), N = STEPS[lv], pool = poolOf(G, 'zh', false), answer = W4X.pick(G, pool);
      const all = pathsOf(n, N, lv), P = G.rng.pick(all), dead = lv >= 4 ? deadEnds(G, n, P, lv >= 5 ? 2 : 1) : [];
      const kn = W4X.known(G), holds = HOLDS[answer] || '', opts = W4X.opts(G, lv, answer, 5).filter(k => k !== answer);
      const lookAll = Array.from(LOOKP[answer] || '').concat(Array.from(LOOK[answer] || '')).filter((k, i, a) => a.indexOf(k) === i && k !== answer && ITEM[k] && kn.includes(k) && !holds.includes(k));
      const look = lv >= 5 ? lookAll : [];
      const idx = (r, c) => r * n + c, grid = Array(n * n).fill(null);
      P.cells.concat(dead).forEach(([r, c]) => { grid[idx(r, c)] = answer; });
      grid[idx(P.tower[0], P.tower[1])] = '';
      const others = look.concat(opts.filter(k => !look.includes(k)));
      const onPath = i => P.cells.some(([r, c]) => touch([r, c], [Math.floor(i / n), i % n]));
      const nb = i => { const r = Math.floor(i / n), c = i % n; return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < n && b < n).map(([a, b]) => grid[idx(a, b)]); };
      const used = {};
      G.rng.shuffle(grid.map((_, i) => i)).forEach(i => {
        if (grid[i] !== null) return;
        const pref = (lv >= 5 && onPath(i) && look.length ? look : others).slice(), around = nb(i);
        pref.sort((a, b) => (used[a] || 0) - (used[b] || 0));
        const k = pref.find(x => !around.includes(x)) || pref[0];
        grid[i] = k; used[k] = (used[k] || 0) + 1;
      });
      const board = grid.filter(k => k && k !== answer), dist = Array.from(new Set(board));
      /* a built answer (q.build): the chance that random steps reach the tower - each step one of the tiles beside Chase */
      const X = i => grid[i] === answer, end = idx(P.cells[N - 1][0], P.cells[N - 1][1]), pr = grid.map(() => 0);
      const nbs = i => { const r = Math.floor(i / n), c = i % n; return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < n && b < n && grid[idx(a, b)] !== '').map(([a, b]) => idx(a, b)); };
      for (let it = 0; it < 80; it++) grid.forEach((k, i) => { if (!X(i)) return; if (i === end) { pr[i] = 1; return; } const m = nbs(i); pr[i] = m.reduce((s, j) => s + (X(j) ? pr[j] : 0), 0) / m.length; });
      return { k: [answer, P.cells.map(c => c.join('')).join('.'), grid.join('')], answer, item: answer, n, N, grid, bends: P.bends, build: 1, chance: +pr[idx(P.cells[0][0], P.cells[0][1])].toFixed(4),
        path: P.cells.map(([r, c]) => idx(r, c)), tower: idx(P.tower[0], P.tower[1]), dead: dead.map(([r, c]) => idx(r, c)), pic: lv <= 1 ? 1 : 0,
        look: dist.filter(k => lookAll.includes(k)).length, rev: dist.filter(k => !pool.includes(k)).length };
    },
    /* tests/w4_levels.js: the picture gone, a longer path, more bends, look-alikes and old characters, dead ends, a bigger board */
    hard(q) { return (1 - q.pic) + q.N * 0.6 + q.bends * 0.4 + q.look * 0.5 + q.rev * 0.4 + q.dead.length + (q.n - 4); },
    geo(st) {
      const n = st.q.n, T = n === 4 ? 108 : 96, g = n === 4 ? 10 : 8, S = n * T + (n - 1) * g, Lx = L(), cx = Lx ? 572 : 392, cy = Lx ? 404 : 548;
      return { n, T, g, x0: Math.round(cx - S / 2), y0: Math.round(cy - S / 2) };
    },
    cell(st, i) { const G4 = this.geo(st), r = Math.floor(i / G4.n), c = i % G4.n; return { x: G4.x0 + c * (G4.T + G4.g), y: G4.y0 + r * (G4.T + G4.g), w: G4.T, h: G4.T }; },
    /* where Chase stands: his badge left of the first tile (-1), a tile, or the tower */
    spot(st, at) { if (at >= 0) return this.cell(st, at); const b = this.cell(st, st.q.path[0]), G4 = this.geo(st); return { x: b.x - G4.T - G4.g - 4, y: b.y, w: G4.T, h: G4.T }; },
    async present(st) {
      const q = st.q;
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      st.at = -1;
      const T = q.n === 4 ? 108 : 96;
      st.tiles = q.grid.map((k, i) => {
        if (i === q.tower) return null;
        const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; Object.assign(d.style, { background: '#FFF6E2', borderColor: '#E9D6AE' });
        d.appendChild(Glyph.zh(k, Math.round(T * 0.74))); st.els.push(d);
        return d;
      });
      st.tileEls = st.tiles.filter(Boolean);
      const slide = st.tiles.map((d, i) => (d ? { id: 'tile' + i, rect: () => box(d) } : null)).filter(Boolean);
      st.tiles.forEach((d, i) => { if (d) { K.reg(st, 'tile' + i, d, { slide }); K.pop(st, d, 25 * i); } });
      st.pad = ZX.thing(st, T, 40, 4, 'item'); st.pad.innerHTML = PAD_SVG; st.pad.style.pointerEvents = 'none';
      st.towerEl = ZX.thing(st, T, T, 6, 'item'); st.towerEl.innerHTML = TOWER_SVG; st.towerEl.style.pointerEvents = 'none';
      const a = st.G.actors.chase; if (a) { a.root.style.pointerEvents = 'none'; a.root.style.zIndex = 45; a.face(1); }
      this.place(st);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
      K.say(st, '踩着' + q.answer + '走！');
    },
    place(st) {
      if (!st.tiles) return;
      st.tiles.forEach((d, i) => { if (d) { const b = this.cell(st, i); place(d, b.x, b.y, b.w, b.h); } });
      const t = this.cell(st, st.q.tower); place(st.towerEl, t.x, t.y, t.w, t.h);
      const p = this.spot(st, -1); place(st.pad, p.x, p.y + p.h - 34, p.w, 40);
      this.chaseTo(st, st.won ? st.q.tower : st.at, false);
    },
    /* Chase onto a spot: at once, or with a hop from where he was */
    chaseTo(st, at, hop) {
      const a = st.G.actors.chase; if (!a) return;
      const b = this.spot(st, at), h = Math.round(b.h * 1.02), ox = a.x, oy = a.y;
      if (Math.abs(a.h - h) > 1) a.size(h);
      a.at(b.x + b.w / 2, b.y + b.h - 2);
      a.root.getAnimations().forEach(x => x.cancel());
      if (hop && (ox || oy)) { const dx = ox - a.x, dy = oy - a.y; if (dx) a.face(dx > 0 ? -1 : 1); st.scope.anim(a.root, [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(' + dx / 2 + 'px,' + (dy / 2 - 26) + 'px)' }, { transform: 'translate(0,0)' }], { duration: 220, easing: EASE.glide, fill: 'none' }); }
    },
    decor(G) { const Lx = L(); this.chars.forEach(id => hideActor(G.actors[id])); const r = G.actors.ryder; if (r) showActor(r, Lx ? 940 : 590, Lx ? 698 : 1012, Lx ? 170 : 150); const a = G.actors.chase; if (a) showActor(a, -300, -300, 100); },
    near(st, i) {
      if (st.at < 0) return i === st.q.path[0];
      const n = st.q.n; return touch([Math.floor(i / n), i % n], [Math.floor(st.at / n), st.at % n]);
    },
    sameStep(st, exp, name, p) { return !!(p && exp.p && (p.at || p.id) === exp.p.id); },
    /* a finger sliding over the board (the tiles' slide): a tile counts only once the finger is well inside it - never a corner
       cut. Input says "pass" as the finger comes near a tile; until it is inside, the tile waits (checked every 30 ms) */
    inCore(st, id) {
      const c = Input.cur, pt = c && c.path && c.path[c.path.length - 1], e = st.map && st.map[id];
      if (!pt || !e) return true;
      const b = box(e), m = b.w * 0.14; return pt.x >= b.x + m && pt.x <= b.x + b.w - m && pt.y >= b.y + m && pt.y <= b.y + b.h - m;
    },
    pend(st, id) {
      st.pendId = id;
      if (st.pendT) return;
      st.pendT = st.scope.interval(() => {
        const c = Input.cur, stop = () => { st.scope.clear(st.pendT); st.pendT = 0; st.pendId = null; };
        if (!c || st.submitted || !st.pendId || c.passed[c.passed.length - 1] !== st.pendId) { stop(); return; }
        if (this.inCore(st, st.pendId)) { const k = st.pendId; stop(); this.stepTo(st, k, false); }
      }, 30);
    },
    onGesture(st, name, p) {
      if (st.submitted) return false;
      if (name === 'tap') return this.stepTo(st, p.id, true);
      if (name !== 'pass') return false;
      if (!this.inCore(st, p.at)) { this.pend(st, p.at); return 'free'; }
      st.pendId = null;
      return this.stepTo(st, p.at, false);
    },
    /* one step onto a tile: only one beside Chase; not X ends the try; the last X tile beside the tower wins */
    stepTo(st, id, tap) {
      const m = /^tile(\d+)$/.exec(id || ''); if (!m || st.submitted) return false;
      const i = Number(m[1]), q = st.q;
      if (i === st.at) return 'free';
      if (!this.near(st, i)) {
        if (tap) { K.wiggle(st, st.tiles[i]); if (!st.toldHow || Clock.t() - st.toldHow > 4000) { st.toldHow = Clock.t(); Voice.sayNow('点阿奇旁边的砖！', { tag: 'how' }); } }
        return 'free';
      }
      st.at = i; Sfx.hop(); this.chaseTo(st, i, true);
      if (q.grid[i] !== q.answer) { st.tapped = i; Session.submit(st, q.grid[i]); return 'ok'; }
      if (i === q.path[q.path.length - 1]) { st.won = true; Session.submit(st, q.answer); }
      return 'ok';
    },
    async reveal(st) {
      const q = st.q, t = this.cell(st, q.tower);
      await st.scope.wait(180);
      this.chaseTo(st, q.tower, true); Sfx.reveal();
      const fl = st.towerEl.querySelector('.flag'); if (fl) st.scope.anim(fl, [{ transform: 'skewY(0)' }, { transform: 'skewY(-14deg)' }, { transform: 'skewY(10deg)' }, { transform: 'skewY(0)' }], { duration: 700, fill: 'none' });
      Fx.burst(t.x + t.w / 2, t.y + t.h / 2, { n: 16, dist: 100 });
      const r = st.G.actors.ryder; if (r) r.cheer();
      const G4 = this.geo(st), S = G4.n * G4.T + (G4.n - 1) * G4.g;          /* beside the board, never under a tile */
      await ZX.alive(st, q.answer, L() ? Math.min(Stage.W - 80, G4.x0 + S + 90) : 352, L() ? clamp(t.y + t.h / 2, 160, Stage.H - 160) : Math.min(Stage.H - 90, G4.y0 + S + 95), 150);
      sayItem(q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    async feedback(st, ans) { const e = st.tiles[st.tapped]; if (e) K.wiggle(st, e); Voice.say(W4X.thisIs(ans), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain: 1 the tile he stepped on, blue, its own picture ("这是右" was just said); 2 the whole path of X lights gold and Chase
       walks it from his badge to the tower (a beat); 3 the first X tile in gold with its picture, "这个是左" */
    async explain(st, ans) {
      const q = st.q, eC = st.tiles[st.tapped];
      W4X.exChosen(st, eC, ans);
      await EX.wait(st, 650);
      await W4X.exBeat(st, async () => {
        q.path.forEach(i => { const d = st.tiles[i]; if (d) { d.style.background = '#FFF1B8'; d.style.borderColor = GOLD; } });
        st.at = -1; this.chaseTo(st, -1, true);
        for (const i of q.path) { await EX.tick(st, 170); if (st.scope.dead) return; this.chaseTo(st, i, true); }
        await EX.tick(st, 170); if (!st.scope.dead) this.chaseTo(st, q.tower, true);
      }, 300);
      await W4X.exRight(st, st.tiles[q.path[0]], q.answer, [W4X.thatIs(q.answer)]);
    },
    /* the 2nd hint (real help): the tile Chase should step on next flashes; a re-teach: the tiles beside him hop */
    gestureHint(st, reteach) {
      if (!st.tiles) return;
      const nx = this.next(st, 'right'), i = nx && Number(/\d+/.exec(nx.p.id)[0]);
      if (reteach) { st.tiles.forEach((d, j) => { if (d && this.near(st, j)) K.hop(st, d, 16); }); return; }
      if (i != null && st.tiles[i]) { K.flash(st, [st.tiles[i]]); glow(st, st.tiles[i], 1200); }
    },
    next(st, strat) {
      if (!st.tiles || st.submitted) return null;
      const q = st.q, pi = q.path.indexOf(st.at);
      let i;
      if (strat === 'wrong') {
        if (st.at < 0) i = q.path[0];
        else { const n = q.n; i = q.grid.findIndex((k, j) => j !== q.tower && k !== q.answer && touch([Math.floor(j / n), j % n], [Math.floor(st.at / n), st.at % n])); }
      } else if (st.at >= 0 && pi < 0) {          /* on a dead end: back to the path */
        const n = q.n; i = q.path.find(j => touch([Math.floor(j / n), j % n], [Math.floor(st.at / n), st.at % n]));
      } else i = q.path[pi + 1];
      return i == null || i < 0 ? null : { g: 'tap', p: { id: 'tile' + i } };
    },
    workEls(st) { return (st.tiles || []).filter((d, i) => d && this.near(st, i)); },
    cleanup(st) { const a = st.G.actors.chase; if (a) { a.root.style.pointerEvents = ''; a.root.style.zIndex = ''; } },
    snap(st) { return { at: st.at, n: st.q.n, N: st.q.N, path: st.q.path }; },
    iconNode() { return W4X.svgIcon('<rect x="4" y="34" width="16" height="16" rx="4" fill="#FFF1B8" stroke="#2B2118" stroke-width="2.5"/><rect x="22" y="34" width="16" height="16" rx="4" fill="#FFF1B8" stroke="#2B2118" stroke-width="2.5"/><rect x="22" y="16" width="16" height="16" rx="4" fill="#FFF1B8" stroke="#2B2118" stroke-width="2.5"/><path d="M48 4V24" stroke="#2B2118" stroke-width="2.5"/><path d="M49 5L58 8L49 12Z" fill="#E8554A"/><rect x="40" y="16" width="16" height="16" rx="4" fill="#7BC8F6" stroke="#2B2118" stroke-width="2.5"/>'); },
  };

  /* ---------------------------------------------------------------- English sentences as glyphs (the app's own letters) */
  const PUNCT = { '.': '<circle cx="14" cy="72" r="9"/>', '!': '<rect x="7" y="4" width="14" height="50" rx="7"/><circle cx="14" cy="72" r="9"/>',
    '?': '<path d="M4 22C4 8 34 2 38 20C41 34 22 36 21 52" fill="none" stroke="#2B2118" stroke-width="10" stroke-linecap="round"/><circle cx="21" cy="72" r="8"/>', ',': '<path d="M14 64C24 66 22 84 10 92" fill="none" stroke="#2B2118" stroke-width="9" stroke-linecap="round"/>' };
  const punct = (c, h) => { const w = c === '?' ? 46 : 30, s = svg('svg', { viewBox: '0 -8 ' + w + ' 136', width: Math.round(h * w / 136), height: h, class: 'gly' }); s.innerHTML = '<g fill="#2B2118">' + PUNCT[c] + '</g>'; return s; };
  /* a row of words at letter height h; .w is its width */
  function enRow(text, h) {
    const row = el('div', ''); Object.assign(row.style, { display: 'flex', alignItems: 'flex-end', gap: Math.round(h * 0.3) + 'px', pointerEvents: 'none' });
    let w = 0;
    text.split(' ').forEach((tok, j) => {
      const m = /^([A-Za-z]+)([.,!?]?)$/.exec(tok) || [tok, tok, ''], wd = el('div', '', row); wd.style.display = 'flex'; wd.style.alignItems = 'flex-end';
      const g = Glyph.word(m[1], h); wd.appendChild(g); w += Number(g.getAttribute('width')) + (j ? Math.round(h * 0.3) : 0);
      if (m[2]) { const p = punct(m[2], h); wd.appendChild(p); w += Number(p.getAttribute('width')); }
    });
    row.w = w;
    return row;
  }
  /* a sentence card, its letters as big as fit in maxW (never taller than hMax) */
  function enCard(st, text, hMax, maxW) {
    const probe = enRow(text, 100), h = Math.max(30, Math.min(hMax, Math.floor(100 * (maxW - 36) / probe.w))), row = enRow(text, h);
    const d = ZX.thing(st, 10, 10, 7, 'item');
    Object.assign(d.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.96)', borderRadius: '22px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25)' });
    d.appendChild(row); d._w = row.w + 36; d._h = Math.max(96, Math.round(h * 1.05) + 28);
    return d;
  }

  /* ---------------------------------------------------------------- ⑥-3 英文 「判！」 对不对
     One picture on the lookout's big screen and two English sentences under it (tools/content.py TF4: only words the child has
     met). Each sentence has two buttons: a nodding puppy (it is so) and a shaking puppy (it is not) - no cross, no red. Both
     sentences judged right = right (two asks: a random pair of taps is right 1 time in 4). The sentences are not said (a tap
     on one says it: that question earns no star). Which of "one so / one not", "both so", "both not" comes from a bag. Levels:
     1 a phrase (A big pig.); 2 The X is Y.; 3 how many (I see two cats.); 4 not (The cat is not big.); 5 where (on / in / under /
     by). Its 2nd hint is only the question again: the two sentences are underlined, word by word (softHint: the star stays). */
  const PUP = yes => '<svg viewBox="0 0 100 100" width="86%" height="86%"><g class="head">'
    + '<path d="M22 30C8 30 6 58 18 62C24 52 26 40 30 34Z" fill="#9A6433" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M78 30C92 30 94 58 82 62C76 52 74 40 70 34Z" fill="#9A6433" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<ellipse cx="50" cy="52" rx="30" ry="28" fill="#E8B676" stroke="#2B2118" stroke-width="4"/><ellipse cx="50" cy="64" rx="15" ry="11" fill="#FFF1D8"/>'
    + '<circle cx="39" cy="46" r="5" fill="#2B2118"/><circle cx="61" cy="46" r="5" fill="#2B2118"/><circle cx="40.5" cy="44.5" r="1.6" fill="#fff"/><circle cx="62.5" cy="44.5" r="1.6" fill="#fff"/><ellipse cx="50" cy="58" rx="6" ry="4.5" fill="#2B2118"/>'
    + (yes ? '<path d="M41 66C46 72 54 72 59 66" fill="none" stroke="#2B2118" stroke-width="3.5" stroke-linecap="round"/>' : '<path d="M43 69H57" stroke="#2B2118" stroke-width="3.5" stroke-linecap="round"/>') + '</g>'
    + (yes ? '<path d="M50 6V16M50 86V96" stroke="#3E9E4E" stroke-width="5" stroke-linecap="round"/><path d="M44 12L50 5L56 12M44 90L50 97L56 90" fill="none" stroke="#3E9E4E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M4 44C1 50 1 56 4 62M96 44C99 50 99 56 96 62" fill="none" stroke="#5470B8" stroke-width="5" stroke-linecap="round"/><path d="M11 40C8 48 8 58 11 66M89 40C92 48 92 58 89 66" fill="none" stroke="#5470B8" stroke-width="4" stroke-linecap="round"/>') + '</svg>';
  const kindOf = s => (/\b(on|in|under|by)\b/.test(s) ? 5 : /\bnot\b/.test(s) ? 4 : /\b(one|two|three)\b|[a-z]s[.!?]$/.test(s.replace(/\bis\b|\bthis\b/g, '')) ? 3 : /\bis\b/.test(s) ? 2 : 1);
  const TrueFalse = {
    rule: 'true-or-false', kind0: 'en', verb: '判！', intro: '读一读，对不对？', softHint: true, props: [],
    gen(G, o) {
      const lv = o.level, tf = W4D.tf, list = tf.map((e, i) => i).filter(i => tf[i].lv === lv), pick = bagFrom(G, 'tf' + lv, list.length ? list : tf.map((e, i) => i));
      const e = tf[pick], yes = G.rng.shuffle(e.s.filter(s => s[1])), no = G.rng.shuffle(e.s.filter(s => !s[1])), how = bagFrom(G, 'tfk', ['mix', 'yy', 'nn']);
      const two = how === 'yy' ? yes.slice(0, 2) : how === 'nn' ? no.slice(0, 2) : G.rng.shuffle([yes[0], no[0]]);
      const words = two.map(s => s[0].split(' ').length);
      return { k: [pick, two[0][0], two[1][0]], answer: 'all', seq: two.map(s => (s[1] ? 'y' : 'n')), sents: two.map(s => s[0]), pic: e.pic, how,
        type: Math.max(...two.map(s => kindOf(s[0]))), words: (words[0] + words[1]) / 2 };
    },
    itemOf() { return null; },
    hard(q) { return q.type + q.words * 0.1; },
    async present(st) {
      const q = st.q;
      st.done = [false, false];
      const pc = st.picEl = ZX.thing(st, 250, 250, 6, 'card'); pc.style.pointerEvents = 'none'; pc.appendChild(Scene.node(q.pic, 220)); Object.assign(pc.lastChild.style, { position: 'relative' });
      st.rows = q.sents.map((s, i) => {
        const card = enCard(st, s, 62, L() ? 620 : 640);
        K.reg(st, i ? 'read1' : 'read', card, {});
        const yes = ZX.thing(st, 104, 104, 7, 'card'), no = ZX.thing(st, 104, 104, 7, 'card');
        yes.innerHTML = PUP(true); no.innerHTML = PUP(false);
        const ck = el('div', '', yes); ck.innerHTML = ICONS.check; Object.assign(ck.style, { position: 'absolute', right: '-10px', top: '-10px', width: '38px', height: '38px', borderRadius: '50%', background: '#5CC46E', boxShadow: '0 0 0 3px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }); ck.firstChild.setAttribute('width', '26'); ck.firstChild.setAttribute('height', '26');
        Object.assign(yes.style, { background: '#E2F6E4', borderColor: '#8FD39A' }); Object.assign(no.style, { background: '#E6EBF8', borderColor: '#A9B8DE' });
        Loops.run(yes.firstChild, [{ transform: 'translateY(0)' }, { transform: 'translateY(5px)' }, { transform: 'translateY(0)' }], { duration: 900, easing: 'ease-in-out' });
        Loops.run(no.firstChild, [{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(0)' }], { duration: 1100, easing: 'ease-in-out' });
        K.reg(st, 'y' + i, yes, {}); K.reg(st, 'n' + i, no, {});
        K.pop(st, card, 120 + 160 * i); K.pop(st, yes, 220 + 160 * i); K.pop(st, no, 260 + 160 * i);
        return { card, yes, no, text: s };
      });
      st.readEl = st.rows[0].card; st.readText = q.sents[0];
      st.rights = st.rows.flatMap(r => [r.card, r.yes, r.no]);
      this.place(st);
      K.pop(st, pc);
      st.prompt = '读一读，对不对？';
    },
    /* the picture on the big screen of the lookout (the background), the two rows under it */
    place(st) {
      if (!st.rows) return;
      const Lx = L(), sc = Stage.bgPoint(0.5, 0.29), P = Lx ? 230 : 270;
      place(st.picEl, Math.round(Lx ? 512 - P / 2 : 352 - P / 2), Math.round(clamp(sc.y - P / 2, Lx ? 96 : 150, Lx ? 120 : 260)), P, P);
      const pb = box(st.picEl);
      st.rows.forEach((r, i) => {
        const w = r.card._w, h = r.card._h;
        if (Lx) {
          const total = w + 2 * 104 + 2 * 18, x = Math.round(512 - total / 2), y = Math.round(pb.y + pb.h + 22 + i * (h + 26));
          place(r.card, x, y, w, h); place(r.yes, x + w + 18, y + (h - 104) / 2, 104, 104); place(r.no, x + w + 18 + 104 + 18, y + (h - 104) / 2, 104, 104);
        } else {
          const y = Math.round(pb.y + pb.h + 26 + i * (h + 104 + 52));
          place(r.card, Math.round(352 - w / 2), y, w, h); place(r.yes, 352 - 104 - 20, y + h + 14, 104, 104); place(r.no, 352 + 20, y + h + 14, 104, 104);
        }
      });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 270 : 110, L() ? 330 : 418, L() ? 190 : 160); },
    peekRow(st, i) {
      const r = st.rows[i]; st.peeked = true; st.noStar = true;
      Voice.sayNow(r.text, { tag: 'peek' }); K.hop(st, r.card, 12);
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted || !st.rows) return false;
      if (p.id === 'read' || p.id === 'read1') { this.peekRow(st, p.id === 'read' ? 0 : 1); return 'ok'; }
      const m = /^([yn])([01])$/.exec(p.id || ''); if (!m) return false;
      const i = Number(m[2]), r = st.rows[i]; if (st.done[i]) return false;
      Sfx.tap(); st.tapped = i; st.said = m[1];
      if (m[1] !== st.q.seq[i]) { Session.submit(st, 'r' + i + ':' + m[1]); return 'ok'; }
      st.done[i] = true; const b = m[1] === 'y' ? r.yes : r.no, o = m[1] === 'y' ? r.no : r.yes;
      b.style.boxShadow = '0 0 0 5px #fff, 0 0 0 10px ' + GOLD; o.style.opacity = 0.35; K.hop(st, b, 16); Sfx.place();
      if (st.done.every(Boolean)) Session.submit(st, 'all');
      return 'ok';
    },
    async reveal(st) {
      Sfx.reveal(); K.hop(st, st.picEl, 26);
      st.rows.forEach((r, i) => st.scope.timeout(() => K.hop(st, st.q.seq[i] === 'y' ? r.yes : r.no, 20), 150 * i));
      const a = st.G.actors.chase; if (a) a.react();
      this.cheerAll(st);
      await st.scope.wait(700);
    },
    /* the factual line: the sentence he judged, said */
    async feedback(st) { const r = st.rows[st.tapped]; K.wiggle(st, st.said === 'y' ? r.yes : r.no); Voice.say(r.text, { tag: 'wrong' }); await st.scope.wait(600); },
    /* explain: 1 that sentence in blue (it was just said); 2 the picture lights up - look at it (a beat); 3 the right puppy in gold:
       "这句不对" / "这句是对的" */
    async explain(st) {
      const i = st.tapped, r = st.rows[i], yes = st.q.seq[i] === 'y';
      EX.ring(st, r.card, 'chosen');
      await EX.wait(st, 700);
      await W4X.exBeat(st, () => { st.scope.anim(st.picEl, [{ transform: 'scale(1)', filter: 'none' }, { transform: 'scale(1.08)', filter: 'drop-shadow(0 0 14px #FFE14A)' }, { transform: 'scale(1)', filter: 'none' }], { duration: 900, fill: 'none' }); }, 800);
      await W4X.exRight(st, yes ? r.yes : r.no, null, [yes ? '这句是对的' : '这句不对'], false);
    },
    /* the 2nd hint - the question again, nothing more: each sentence underlined, its words lit one after another, silently */
    gestureHint(st, reteach) {
      if (!st.rows) return;
      if (reteach) { st.rows.forEach((r, i) => st.scope.timeout(() => { K.hop(st, r.yes, 14); K.hop(st, r.no, 14); }, 200 * i)); return; }
      st.rows.forEach((r, i) => {
        if (st.done[i]) return;
        const words = Array.from(r.card.firstChild.children); r.card.style.boxShadow = '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25), inset 0 -8px 0 #FFE14A';
        words.forEach((w, j) => st.scope.timeout(() => st.scope.anim(w, [{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 300, fill: 'none' }), 1300 * i + 260 * j));
      });
    },
    next(st, strat) {
      if (!st.rows || st.submitted) return null;
      const i = st.done.indexOf(false); if (i < 0) return null;
      const right = st.q.seq[i], c = strat === 'wrong' ? (right === 'y' ? 'n' : 'y') : right;
      return { g: 'tap', p: { id: c + i } };
    },
    workEls(st) { return (st.rows || []).flatMap((r, i) => (st.done[i] ? [] : [r.yes, r.no])); },
    snap(st) { return { done: st.done || null, seq: st.q.seq }; },
    iconNode() { const d = el('div'); d.innerHTML = PUP(true); Object.assign(d.style, { width: '82%', height: '82%', display: 'flex', alignItems: 'center', justifyContent: 'center' }); return d; },
  };

  /* ---------------------------------------------------------------- ⑥-4 挑战 「开！」 看路牌开车
     The crossroads seen from above (the background): Chase's police car in the middle, a place at the end of each road (fire
     station, park, lookout, beach: pictures, no words), and a road sign with one character (左 右 前 后; not said - a tap says it
     and that question earns no star). Slide the car the way the sign says - or tap the end of that road. The car's own front is
     前: its left is the screen's left only while it faces up. Two signs, one after the other (two legs; level 5 three), every
     leg right = right. Levels: 1 the car faces up, only 左 右; 2 faces up, 左 右 前 后; 3 it faces down (left and right swap);
     4 it faces left or right; 5 three legs, and after each leg the car faces the way it drove. A random slide is right 1 time in
     16 (level 5: 1 in 64). Its 2nd hint draws a little arrow by the sign (real help: no star). */
  const DIRV = [[0, -1], [1, 0], [0, 1], [-1, 0]], REL = { 前: 0, 右: 1, 后: 2, 左: 3 }, SIDEW = ['前面', '右边', '后面', '左边'], SWIPE = ['up', 'right', 'down', 'left'];
  const PLACES = [
    /* fire station */ '<rect x="10" y="34" width="80" height="56" rx="4" fill="#E8554A" stroke="#2B2118" stroke-width="4"/><path d="M6 36L50 10L94 36Z" fill="#B73A30" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><rect x="26" y="52" width="48" height="38" rx="3" fill="#F5F0E6" stroke="#2B2118" stroke-width="3.5"/><path d="M26 62H74M26 72H74M26 82H74" stroke="#C9BFAE" stroke-width="3"/><circle cx="50" cy="28" r="7" fill="#FFD23C" stroke="#2B2118" stroke-width="3"/>',
    /* park */ '<ellipse cx="50" cy="86" rx="44" ry="10" fill="#7CC36B" stroke="#2B2118" stroke-width="3"/><rect x="45" y="50" width="10" height="36" rx="3" fill="#9A6433" stroke="#2B2118" stroke-width="3"/><circle cx="50" cy="36" r="26" fill="#3FAE4A" stroke="#2B2118" stroke-width="4"/><path d="M14 74H40M16 74V86M38 74V86M12 68H42" stroke="#9A6433" stroke-width="4" stroke-linecap="round"/><path d="M62 74H88M64 74V86M86 74V86M60 68H90" stroke="#9A6433" stroke-width="4" stroke-linecap="round"/>',
    /* lookout */ '<path d="M38 92L42 40H58L62 92Z" fill="#F5F0E6" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><rect x="26" y="20" width="48" height="24" rx="8" fill="#7BC8F6" stroke="#2B2118" stroke-width="4"/><path d="M28 20L50 6L72 20Z" fill="#E8554A" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="60" r="7" fill="#FFD23C" stroke="#2B2118" stroke-width="3"/><path d="M30 92H70" stroke="#2B2118" stroke-width="5" stroke-linecap="round"/>',
    /* beach */ '<path d="M4 60C20 52 30 68 50 60C70 52 80 68 96 60V96H4Z" fill="#4FA3E8" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M4 78C30 70 70 86 96 76V96H4Z" fill="#F3D79A" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M30 36L33 44L42 44L35 50L38 58L30 53L22 58L25 50L18 44L27 44Z" fill="#FF9F5A" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/><path d="M70 30C66 18 84 14 86 26" fill="none" stroke="#2B2118" stroke-width="3"/><circle cx="72" cy="40" r="10" fill="#fff" stroke="#2B2118" stroke-width="3"/><path d="M64 38C70 34 76 36 80 42" stroke="#E8554A" stroke-width="4" fill="none"/>',
  ];
  const CAR_SVG = '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M29 24L15 0H41L38 24Z" fill="#FFF3A0" opacity=".9"/><path d="M71 24L85 0H59L62 24Z" fill="#FFF3A0" opacity=".9"/>'
    + '<rect x="23" y="18" width="54" height="80" rx="16" fill="#F5F7FB" stroke="#2B2118" stroke-width="5"/><rect x="23" y="52" width="54" height="14" fill="#2E6FD8"/>'
    + '<path d="M31 42C31 34 35 31 50 31C65 31 69 34 69 42V46H31Z" fill="#7BC8F6" stroke="#2B2118" stroke-width="3.5" stroke-linejoin="round"/><rect x="33" y="74" width="34" height="14" rx="5" fill="#7BC8F6" stroke="#2B2118" stroke-width="3"/>'
    + '<rect x="33" y="54" width="15" height="10" rx="3" fill="#E8554A" stroke="#2B2118" stroke-width="2.5"/><rect x="52" y="54" width="15" height="10" rx="3" fill="#2E6FD8" stroke="#2B2118" stroke-width="2.5"/>'
    + '<circle cx="33" cy="22" r="5.5" fill="#FFE14A" stroke="#2B2118" stroke-width="2.5"/><circle cx="67" cy="22" r="5.5" fill="#FFE14A" stroke="#2B2118" stroke-width="2.5"/></svg>';
  const ARROW = (c, w) => '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 92V20M24 44L50 14L76 44" fill="none" stroke="#2B2118" stroke-width="' + (w + 8) + '" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 92V20M24 44L50 14L76 44" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const Steer = {
    rule: 'read-and-steer', kind0: 'quiz', verb: '开！', intro: '看路牌，开警车！', props: [],
    gen(G, o) {
      const lv = o.level, legs = lv >= 5 ? 3 : 2, kn = W4X.known(G), set = Array.from('左右前后').slice(0, lv <= 1 ? 2 : 4).filter(k => kn.includes(k));
      const h0 = lv <= 2 ? 0 : lv === 3 ? 2 : lv === 4 ? G.rng.pick([1, 3]) : G.rng.int(0, 3), signs = [], heads = [h0], dirs = [];
      for (let i = 0; i < legs; i++) signs.push(G.rng.pick(set));
      signs.forEach((s, i) => { const d = (heads[i] + REL[s]) % 4; dirs.push(d); if (i + 1 < legs) heads.push(lv >= 5 ? d : h0); });
      return { k: [signs.join(''), heads.join('')], answer: 'all', seq: dirs, asks: dirs.map(d => ({ opts: [0, 1, 2, 3], answer: d })), signs, heads, dirs, legs, item: signs[0], places: G.rng.shuffle([0, 1, 2, 3]),
        h0, fb: signs.filter(s => s === '前' || s === '后').length, turn: lv >= 5 ? 1 : 0 };
    },
    itemOf(st) { return W4X.own(st, st.q.signs[0]); },
    itemsOf(st) { return Array.from(new Set(st.q.signs.slice(1))).filter(k => k !== st.q.signs[0]); },
    /* more legs, the car not facing up (down: left and right swap; sideways), 前 / 后 among the signs, a car that turns */
    hard(q) { return q.legs * 2 + [0, 3, 2, 3][q.h0] + q.fb * 0.5 + q.turn * 3; },
    async present(st) {
      const q = st.q;
      st.leg = 0; st.head = q.heads[0];
      st.zones = [0, 1, 2, 3].map(d => {
        const z = ZX.thing(st, 136, 124, 6, 'card'); Object.assign(z.style, { background: 'rgba(255,255,255,.9)' });
        z.innerHTML = '<svg viewBox="0 0 100 100" width="84%" height="84%">' + PLACES[q.places[d]] + '</svg>';
        K.reg(st, 'road' + d, z, {}); K.pop(st, z, 80 * d);
        return z;
      });
      const car = st.car = ZX.thing(st, 136, 136, 41, 'item'), rot = st.carRot = el('div', '', car);      /* its headlights shine ahead: where it faces is 前 */
      Object.assign(rot.style, { position: 'absolute', inset: 0 }); rot.innerHTML = CAR_SVG;
      K.reg(st, 'car', car, { swipe: SWIPE.slice(), follow: true });
      st.rights = st.zones.concat([car]);
      const pole = st.pole = ZX.thing(st, 14, 90, 5, 'item'); Object.assign(pole.style, { background: '#8A8F99', borderRadius: '6px', boxShadow: '0 0 0 3px #2B2118', pointerEvents: 'none' });
      this.sign(st);
      this.place(st);
    },
    /* the sign of this leg: read, not said */
    sign(st) {
      if (st.readEl) st.readEl.remove();
      const k = st.q.signs[st.leg], d = W4X.readCard(st, k, 96);
      Object.assign(d.firstChild.style, { background: '#FFF8EC', boxShadow: '0 0 0 4px #2B2118, 0 0 0 10px #2E6FD8, 0 8px 0 10px rgba(43,33,24,.2)' });
      if (st.arrowEl) { st.arrowEl.remove(); st.arrowEl = null; }
      K.pop(st, d);
      if (st.pole) this.place(st);
      st.prompt = '看路牌，开警车！';
    },
    geo() {
      const c = Stage.bgPoint(0.5, 0.5), e = Stage.bgPoint(0.62, 0.5), hw = Math.max(100, e.x - c.x), Lx = L();
      return { cx: c.x, cy: c.y, hw, arm: Lx ? [235, 300, 235, 300] : [300, 245, 300, 245] };
    },
    zoneAt(g, d) { const a = g.arm[d]; return { x: g.cx + DIRV[d][0] * a, y: g.cy + DIRV[d][1] * a }; },
    place(st) {
      if (!st.zones) return;
      const g = this.geo();
      st.zones.forEach((z, d) => { const p = this.zoneAt(g, d); place(z, Math.round(p.x - 68), Math.round(clamp(p.y - 62, 8, Stage.H - 132)), 136, 124); });
      if (!st.driving) this.carAt(st, g.cx, g.cy);
      const sx = Math.round(g.cx - g.hw - 74), sy = Math.round(g.cy - g.hw - 96);
      if (st.readEl) { W4X.placeRead(st, sx, Math.max(L() ? 70 : 150, sy - 70)); const r = box(st.readEl); place(st.pole, Math.round(sx - 7), r.y + 100, 14, 70); }
      if (st.arrowEl) this.arrowPlace(st);
    },
    carAt(st, x, y) { st.car.style.transform = ''; place(st.car, Math.round(x - 68), Math.round(y - 68), 136, 136); st.carRot.style.transform = 'rotate(' + st.head * 90 + 'deg)'; },
    decor(G) { this.chars.forEach(id => hideActor(G.actors[id])); const r = G.actors.ryder; if (r) showActor(r, L() ? 920 : 600, L() ? 698 : 1012, L() ? 170 : 150); },
    /* the car drives off towards a road end (it turns that way first); back: it comes back to the middle */
    async drive(st, d, back) {
      const g = this.geo(), car = st.car, p = this.zoneAt(g, d), dx = (p.x - g.cx) * 0.62, dy = (p.y - g.cy) * 0.62;
      car.getAnimations().forEach(a => a.cancel()); car.style.transform = '';
      st.carRot.style.transform = 'rotate(' + d * 90 + 'deg)'; Sfx.whoosh(0.35);
      await st.scope.anim(car, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px)' }], { duration: 520, easing: EASE.glide, fill: 'forwards' });
      if (back && !st.scope.dead) { await st.scope.anim(car, [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(0,0)' }], { duration: 360, easing: EASE.glide, fill: 'forwards' }); car.getAnimations().forEach(a => a.cancel()); }
    },
    onGesture(st, name, p) {
      if (st.submitted || st.busy) return false;
      if (name === 'tap' && p.id === 'read') return W4X.Base.onGesture.call(this, st, name, p);
      let d = -1;
      if (name === 'swipe' && p.id === 'car') d = SWIPE.indexOf(p.dir);
      else if (name === 'tap' && /^road\d$/.test(p.id || '')) d = Number(p.id.slice(4));
      else if (name === 'tap' && p.id === 'car') { K.wiggle(st, st.car); if (!st.toldHow || Clock.t() - st.toldHow > 4000) { st.toldHow = Clock.t(); Voice.sayNow('把警车滑出去！', { tag: 'how' }); } return 'free'; }
      if (d < 0) return false;
      const q = st.q, leg = st.leg;
      st.chose = d; Sfx.tap();
      if (d !== q.dirs[leg]) { st.busy = true; this.drive(st, d, false).then(() => { st.busy = false; }); Session.submit(st, 'leg' + leg + ':' + d); return 'ok'; }
      st.busy = true; st.driving = true;
      this.drive(st, d, false).then(async () => {
        if (st.scope.dead) return;
        K.hop(st, st.zones[d], 20);
        if (leg + 1 >= q.legs) { st.busy = false; Session.submit(st, 'all'); return; }
        await st.scope.wait(250); if (st.scope.dead) return;
        /* the next crossroads: the car comes back to the middle, facing the way it now faces */
        st.leg = leg + 1; st.head = q.heads[st.leg]; st.driving = false;
        const g = this.geo(); st.car.getAnimations().forEach(a => a.cancel()); this.carAt(st, g.cx, g.cy); K.pop(st, st.car);
        this.sign(st); st.busy = false;
      });
      return 'ok';
    },
    async reveal(st) {
      const q = st.q, z = st.zones[q.dirs[q.legs - 1]];
      Sfx.reveal(); K.hop(st, z, 30); glow(st, st.car, 900);
      const r = st.G.actors.ryder; if (r) r.cheer();
      Array.from(new Set(q.signs)).forEach(k => Voice.say(ITEM[k].line, { tag: 'summary' })); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: where the car went, seen from the car - "这是右边" */
    async feedback(st) { const rel = (st.chose - st.head + 4) % 4; K.wiggle(st, st.zones[st.chose]); Voice.say(W4X.thisIs(SIDEW[rel]), { tag: 'wrong' }); await st.scope.wait(900); },
    /* explain: 1 the road he drove to, blue; 2 the car back in the middle, Chase's two paws by its left and right (or its front and
       back) and the right one glows - seen from the car (a beat); 3 a gold arrow the right way, the car drives it: "左在这边" */
    async explain(st) {
      const q = st.q, leg = st.leg, want = q.dirs[leg], k = q.signs[leg], g = this.geo();
      EX.ring(st, st.zones[st.chose], 'chosen');
      await EX.wait(st, 650);
      await W4X.exBeat(st, async () => {
        st.car.getAnimations().forEach(a => a.cancel()); st.driving = false; this.carAt(st, g.cx, g.cy);
        const pair = k === '前' || k === '后' ? [0, 2] : [3, 1];
        pair.forEach(rel => {
          const d = (st.head + rel) % 4, pw = ZX.thing(st, 64, 64, 12, 'item'); pw.innerHTML = ICONS.paw; Object.assign(pw.style, { pointerEvents: 'none', borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 3px #2B2118' });
          pw.firstChild.setAttribute('width', '100%'); pw.firstChild.setAttribute('height', '100%');
          place(pw, Math.round(g.cx + DIRV[d][0] * 108 - 32), Math.round(g.cy + DIRV[d][1] * 108 - 32), 64, 64);
          K.pop(st, pw);
          if (d === want) st.scope.timeout(() => { pw.style.background = '#FFF1B8'; pw.style.boxShadow = '0 0 0 3px #2B2118, 0 0 0 8px ' + GOLD + ', 0 0 22px 8px rgba(255,190,40,.8)'; K.hop(st, pw, 16); }, 420);
        });
      }, 1000);
      const ar = ZX.thing(st, 120, 120, 11, 'item'); ar.innerHTML = ARROW(GOLD, 12); ar.style.pointerEvents = 'none'; ar.style.transform = 'rotate(' + want * 90 + 'deg)';
      place(ar, Math.round(g.cx + DIRV[want][0] * 150 - 60), Math.round(g.cy + DIRV[want][1] * 150 - 60), 120, 120); K.pop(st, ar);
      this.drive(st, want, false);
      await W4X.exRight(st, st.zones[want], null, [k + '在这边'], false);
    },
    arrowPlace(st) { const r = box(st.readEl); place(st.arrowEl, r.x + r.w + 6, r.y + r.h / 2 - 34, 68, 68); },
    /* the 2nd hint (real help): a little arrow by the sign, pointing the way to drive */
    gestureHint(st, reteach) {
      if (!st.car) return;
      if (reteach) { st.scope.anim(st.car, [{ transform: 'translate(0,0)' }, { transform: 'translate(0,-30px)' }, { transform: 'translate(30px,0)' }, { transform: 'translate(0,0)' }], { duration: 900, fill: 'none' }); return; }
      if (st.arrowEl || !st.readEl) return;
      const a = st.arrowEl = ZX.thing(st, 68, 68, 12, 'item'); a.innerHTML = ARROW('#FF8A3C', 12); Object.assign(a.style, { pointerEvents: 'none', transform: 'rotate(' + st.q.dirs[st.leg] * 90 + 'deg)' });
      this.arrowPlace(st); K.pop(st, a);
    },
    next(st, strat) {
      if (!st.car || st.busy || st.submitted) return null;
      const want = st.q.dirs[st.leg], d = strat === 'wrong' ? (want + 1) % 4 : want, c = center(st.car);
      return { g: 'swipe', p: { id: 'car', dir: SWIPE[d] }, to: { x: c.x + DIRV[d][0] * 190, y: c.y + DIRV[d][1] * 190 } };
    },
    workEls(st) { return st.car ? [st.car] : []; },
    snap(st) { return { leg: st.leg || 0, head: st.head, dirs: st.q.dirs }; },
    iconNode() { const d = el('div'); d.innerHTML = CAR_SVG; Object.assign(d.style, { width: '76%', height: '76%' }); return d; },
  };

  w4Island('paw4', [Path, TrueFalse, Steer]);
})();

/* ---------------- src/w4/bluey4.js */
/* ================================================================ 神笔海 ⑦ Bluey · 大家庭 (bluey4): 爷 奶 妹 女 子 (docs/W4-DESIGN.md §6 ⑦)
   认字 「牵！」顺着线找一找 (follow-the-line) · 写字 女 子 (W4X.Write) · 英文 「摆！」照句子摆一摆 (read-and-place) · 挑战 「读！」
   哪句说得通 (sensible-ending). 爷 is 葫芦爷爷 and 妹 is Bingo (the client's own pictures, never redrawn); 奶 is the new grandma.
   Built on the template of src/w4/ultra4.js (src/w4/README.md). */
(() => {
  const L = () => K.L();
  W4X.lines(['谁拉爷风筝？', '谁拉奶风筝？', '谁拉妹风筝？', '谁拉女风筝？', '谁拉子风筝？', '点拉线的人！', '把它拖过去！']);
  const GOLD = '#FFB400';

  /* ---------------------------------------------------------------- ⑦-1 认字 「牵！」 顺着线找一找
     Five kites in the sky, a character on each; five of the family on the grass below - Bluey, Bingo, Bandit, Chilli and 葫芦爷爷
     (the client's pictures) - each holding a string. The strings run from the kites down to the hands and cross. Tap the one who
     holds X's kite (a tap on a kite only says how: "点拉线的人！"). Levels: 1 the strings run straight down, the picture on the
     task card; 2 heard only, X's string crosses one other; 3 every string crosses another, look-alikes and an old character on
     the kites; 4 every string bends twice and they cross more; 5 every string the same colour (1-4: five colours). A random tap
     is right 1 time in 5. Its 2nd hint lights the top of X's string (real help: no star). */
  const HOLD = ['bluey', 'bingo', 'bandit', 'chilli', 'grandpa'];
  const LINE_C = ['#E8554A', '#2E6FD8', '#3FAE4A', '#F59A4A', '#8E6CFF'], SAME_C = '#7A5A3A', KITE_C = ['#FFD23C', '#7BC8F6', '#FF8DB3', '#9BE07A', '#FFB37A'];
  const inversions = kp => { let n = 0; for (let i = 0; i < kp.length; i++) for (let j = i + 1; j < kp.length; j++) if (kp[i] > kp[j]) n++; return n; };
  const crossOf = (kp, i) => kp.filter((x, j) => (j < i && x > kp[i]) || (j > i && x < kp[i])).length;
  /* which kite each holder's string comes from (kp[holder] = kite place) */
  function strings(G, lv, a) {
    const id = [0, 1, 2, 3, 4];
    if (lv <= 1) return id;
    if (lv === 2) { const b = a === 4 ? 3 : a === 0 ? 1 : G.rng() < 0.5 ? a - 1 : a + 1, kp = id.slice(); kp[a] = b; kp[b] = a; return kp; }
    for (let t = 0; t < 600; t++) {
      const kp = G.rng.shuffle(id.slice()), n = inversions(kp);
      if (kp.every((x, i) => crossOf(kp, i) >= 1) && (lv === 3 ? n >= 3 && n <= 5 : n >= 6)) return kp;
    }
    return lv === 3 ? [1, 0, 3, 4, 2] : [3, 4, 1, 0, 2];
  }
  /* the five characters of a level (W4X.opts), every one known to this child (§5.3): 女 cannot have 奶 妹 beside it (they hold it),
     and with too few left the engine's options fall back on any character - those are swapped for known ones */
  function known5(G, lv, answer) {
    const kn = W4X.known(G), holds = HOLDS[answer] || '', o = W4X.opts(G, lv, answer, 5);
    const spare = G.rng.shuffle(kn.filter(k => k !== answer && !o.includes(k) && !holds.includes(k) && ITEM[k] && ITEM[k].kind === 'zh' && !ITEM[k].fw));
    return o.map(k => (k === answer || kn.includes(k) ? k : spare.shift() || k));
  }
  const KITE_SVG = c => '<svg viewBox="0 0 100 130" width="100%" height="100%"><path d="M50 104C46 112 56 116 50 124" fill="none" stroke="#2B2118" stroke-width="3"/><path d="M44 110L50 114L44 118ZM56 116L50 120L56 124Z" fill="#E8554A" stroke="#2B2118" stroke-width="2"/>'
    + '<path d="M50 4L95 50L50 104L5 50Z" fill="' + c + '" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/><path d="M50 4V104M5 50H95" stroke="#2B2118" stroke-width="2.5" opacity=".35"/></svg>';
  /* a string: from the kite's tail to the hand - a soft curve, or (levels 4-5) one that bends twice */
  function curve(P) {
    if (P.length === 2) { const [a, b] = P, d = b[1] - a[1]; return 'M' + a[0] + ' ' + a[1] + 'C' + a[0] + ' ' + (a[1] + d * 0.45) + ' ' + b[0] + ' ' + (b[1] - d * 0.45) + ' ' + b[0] + ' ' + b[1]; }
    let s = 'M' + P[0][0] + ' ' + P[0][1];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || P[i + 1];
      s += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0] + ' ' + p2[1];
    }
    return s;
  }
  const Kites = {
    rule: 'follow-the-line', verb: '牵！', intro: '顺着线找一找！', props: [],
    gen(G, o) {
      const lv = o.level, pool = poolOf(G, 'zh', false), answer = W4X.pick(G, pool), opts = known5(G, lv, answer), a = opts.indexOf(answer), lk = LOOK[answer] || '';
      const kp = strings(G, lv, a), wig = lv >= 4 ? opts.map(() => [G.rng.int(34, 62) * (G.rng() < 0.5 ? -1 : 1), G.rng.int(34, 62) * (G.rng() < 0.5 ? -1 : 1)]) : null;
      return { k: [answer, opts.join(''), kp.join('')], answer, opts, kp, wig, who: G.rng.shuffle(HOLD.slice()), pic: lv <= 1 ? 1 : 0, same: lv >= 5 ? 1 : 0,
        cross: inversions(kp), mine: crossOf(kp, a), look: opts.filter(k => k !== answer && lk.includes(k)).length, rev: opts.filter(k => !pool.includes(k)).length };
    },
    /* the picture gone, crossings (X's own counts double), look-alikes and old characters, strings that bend, one colour for all */
    hard(q) { return (1 - q.pic) + q.cross * 0.3 + q.mine * 0.3 + q.look * 0.5 + q.rev * 0.4 + (q.wig ? 2 : 0) + q.same * 2; },
    geo() {
      return L() ? { kx: 512, ky: 112, kw: 124, kh: 150, kd: 176, hy: 506, hw: 150, hh: 178, hd: 176 }
        : { kx: 352, ky: 232, kw: 112, kh: 136, kd: 134, hy: 756, hw: 126, hh: 170, hd: 134 };
    },
    async present(st) {
      const q = st.q;
      await ZX.meet(st, q.answer);
      if (!Session.alive(st)) return;
      st.opts = q.opts.slice();
      const kites = []; q.kp.forEach((j, i) => { kites[j] = q.opts[i]; });
      st.kiteCh = kites;
      const ly = st.lineSvg = svg('svg', { width: Stage.W, height: Stage.H }); Object.assign(ly.style, { position: 'absolute', left: '0px', top: '0px', zIndex: 41, pointerEvents: 'none', overflow: 'visible' }); Stage.el.appendChild(ly); st.els.push(ly);
      st.lines = q.opts.map((k, i) => { const g = svg('g', {}, ly), c = q.same ? SAME_C : LINE_C[i]; return { g, under: svg('path', { fill: 'none', stroke: '#2B2118', 'stroke-width': 9, 'stroke-linecap': 'round' }, g), top: svg('path', { fill: 'none', stroke: c, 'stroke-width': 5, 'stroke-linecap': 'round' }, g), dot: svg('circle', { r: 7, fill: c, stroke: '#2B2118', 'stroke-width': 3 }, g) }; });
      st.kites = kites.map((k, j) => {
        const d = ZX.thing(st, 120, 150, 7, 'item'); d.innerHTML = KITE_SVG(KITE_C[j]);
        const c = el('div', '', d); Object.assign(c.style, { position: 'absolute', left: '22%', top: '15%', width: '56%', height: '46%', borderRadius: '50%', background: '#FFFDF6', boxShadow: '0 0 0 3px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        c.appendChild(Glyph.zh(k, 52)); d._c = c;
        K.reg(st, 'kite' + j, d, {}); K.pop(st, d, 60 * j);
        return d;
      });
      st.cards = q.who.map((id, i) => {
        const d = el('div', 'card', Stage.el); d.style.position = 'absolute'; Object.assign(d.style, { background: 'rgba(255,253,246,.72)' });
        const im = img('assets/chars/' + id + '.png', '', d); Object.assign(im.style, { width: '88%', height: '88%', objectFit: 'contain', pointerEvents: 'none' });
        st.els.push(d); K.reg(st, 'card' + i, d, {}); K.pop(st, d, 300 + 60 * i);
        return d;
      });
      this.place(st);
      st.taskEl = K.task(st, [q.pic ? [OBJURL(ITEM[q.answer].obj), 'q'] : ['speaker', 'q']]);
      K.say(st, '谁拉' + q.answer + '风筝？');
    },
    /* the points a string passes: the kite's tail, (two bends), the hand */
    pts(st, i, rev) {
      const g = this.geo(), q = st.q, j = q.kp[i], a = [g.kx + (j - 2) * g.kd, g.ky + g.kh - 4], b = [g.kx + (i - 2) * g.hd, g.hy + 6];
      let P = [a, b];
      if (q.wig) { const d = b[1] - a[1]; P = [a, [Math.round(a[0] + (b[0] - a[0]) / 3 + q.wig[i][0]), Math.round(a[1] + d / 3)], [Math.round(a[0] + 2 * (b[0] - a[0]) / 3 + q.wig[i][1]), Math.round(a[1] + 2 * d / 3)], b]; }
      return rev ? P.slice().reverse() : P;
    },
    place(st) {
      if (!st.kites) return;
      const g = this.geo();
      st.kites.forEach((d, j) => place(d, Math.round(g.kx + (j - 2) * g.kd - g.kw / 2), g.ky, g.kw, g.kh));
      st.cards.forEach((d, i) => place(d, Math.round(g.kx + (i - 2) * g.hd - g.hw / 2), g.hy, g.hw, g.hh));
      st.lines.forEach((l, i) => { const P = this.pts(st, i), dd = curve(P); l.under.setAttribute('d', dd); l.top.setAttribute('d', dd); l.dot.setAttribute('cx', P[P.length - 1][0]); l.dot.setAttribute('cy', P[P.length - 1][1]); });
      (st.traces || []).forEach(t => t.redo());
    },
    decor(G) { this.chars.forEach(id => hideActor(G.actors[id])); },
    /* a string lit along its length: gold from the kite down, or blue from the hand up; frac: only its first part */
    trace(st, i, color, up, frac, ms) {
      const p = svg('path', { fill: 'none', stroke: color, 'stroke-width': 11, 'stroke-linecap': 'round', opacity: 0.95 }, st.lineSvg);
      const t = { redo: () => { p.setAttribute('d', curve(this.pts(st, i, up))); const n = p.getTotalLength(); p.style.strokeDasharray = (n * (frac || 1)) + ' ' + (n + 20); } };
      t.redo(); (st.traces = st.traces || []).push(t);
      const n = p.getTotalLength();
      st.scope.anim(p, [{ strokeDashoffset: n * (frac || 1) }, { strokeDashoffset: 0 }], { duration: ms || 700, easing: EASE.glide });
      return p;
    },
    onGesture(st, name, p) {
      if (name !== 'tap' || st.submitted) return false;
      if (/^kite\d$/.test(p.id || '')) { K.wiggle(st, st.map[p.id]); if (!st.toldHow || Clock.t() - st.toldHow > 4000) { st.toldHow = Clock.t(); Voice.sayNow('点拉线的人！', { tag: 'how' }); } return 'free'; }
      const i = K.cardIndex(p.id); if (i < 0) return false;
      st.tapped = i; Sfx.tap(); Session.submit(st, st.opts[i]);
      return 'ok';
    },
    async reveal(st) {
      const q = st.q, i = q.opts.indexOf(q.answer), kt = st.kites[q.kp[i]], b = box(kt);
      this.trace(st, i, GOLD, false, 1, 500);
      K.hop(st, st.cards[i], 26); Sfx.reveal();
      st.scope.anim(kt, [{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(-26px) rotate(-8deg)' }, { transform: 'translateY(0) rotate(0)' }], { duration: 700, fill: 'none' });
      await ZX.alive(st, q.answer, clamp(b.x + b.w / 2 + (b.x > Stage.W / 2 ? -150 : 150), 90, Stage.W - 90), b.y + b.h / 2 + 30, 140);
      sayItem(q.answer); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* explain: 1 the one he tapped in blue, his string lit from his hand up to its kite, that kite's picture ("这是女" was just
       said); 2 X's string lit gold from its kite down (a beat); 3 the one holding it in gold with X's picture: "这个是爷" */
    async explain(st, ans) {
      const q = st.q, iC = st.tapped, iR = q.opts.indexOf(q.answer);
      EX.ring(st, st.cards[iC], 'chosen');
      this.trace(st, iC, EX_BLUE, true, 1, 500);
      await EX.wait(st, 420);
      EX.picOver(st, st.kites[q.kp[iC]], ans, 'chosen', 92);
      await EX.wait(st, 420);
      await W4X.exBeat(st, () => { this.trace(st, iR, GOLD, false, 1, 650); EX.outline(st, st.kites[q.kp[iR]]); }, 750);
      await W4X.exRight(st, st.cards[iR], q.answer, [W4X.thatIs(q.answer)]);
    },
    /* the 2nd hint (real help): the top part of X's string lights up */
    gestureHint(st, reteach) {
      if (!st.cards) return;
      if (reteach) { st.cards.forEach((c, i) => st.scope.timeout(() => K.hop(st, c, 16), 90 * i)); return; }
      if (st.hintDone) return; st.hintDone = true;
      this.trace(st, st.q.opts.indexOf(st.q.answer), GOLD, false, 0.45, 900);
    },
    next(st, strat) {
      if (!st.cards || st.submitted) return null;
      const r = st.opts.indexOf(st.q.answer), i = strat === 'wrong' ? (r + 1 + (st.gen || 0) % 4) % 5 : r;
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return st.cards || []; },
    snap(st) { return { opts: st.opts || null, kp: st.q.kp }; },
    iconNode() { const d = el('div'); d.innerHTML = KITE_SVG('#7BC8F6').replace('</svg>', '<path d="M50 104C60 120 30 126 44 140" fill="none" stroke="#E8554A" stroke-width="4"/></svg>'); Object.assign(d.style, { width: '62%', height: '72%' }); return d; },
  };

  /* ---------------------------------------------------------------- English sentences as glyphs (the app's own letters) */
  const PUNCT = { '.': '<circle cx="14" cy="72" r="9"/>', '!': '<rect x="7" y="4" width="14" height="50" rx="7"/><circle cx="14" cy="72" r="9"/>',
    '?': '<path d="M4 22C4 8 34 2 38 20C41 34 22 36 21 52" fill="none" stroke="#2B2118" stroke-width="10" stroke-linecap="round"/><circle cx="21" cy="72" r="8"/>', ',': '<path d="M14 64C24 66 22 84 10 92" fill="none" stroke="#2B2118" stroke-width="9" stroke-linecap="round"/>' };
  const mark = (c, h) => { const w = c === '?' ? 46 : 30, s = svg('svg', { viewBox: '0 -8 ' + w + ' 136', width: Math.round(h * w / 136), height: h, class: 'gly' }); s.innerHTML = '<g fill="#2B2118">' + PUNCT[c] + '</g>'; return s; };
  function wordsRow(text, h) {
    const row = el('div', ''); Object.assign(row.style, { display: 'flex', alignItems: 'flex-end', gap: Math.round(h * 0.3) + 'px', pointerEvents: 'none' });
    let w = 0; row.words = [];
    text.split(' ').forEach((tok, j) => {
      const m = /^([A-Za-z]+)([.,!?]?)$/.exec(tok) || [tok, tok, ''], wd = el('div', '', row); Object.assign(wd.style, { display: 'flex', alignItems: 'flex-end', position: 'relative' });
      const g = Glyph.word(m[1], h); wd.appendChild(g); w += Number(g.getAttribute('width')) + (j ? Math.round(h * 0.3) : 0);
      if (m[2]) { const p = mark(m[2], h); wd.appendChild(p); w += Number(p.getAttribute('width')); }
      row.words.push(wd);
    });
    row.w = w;
    return row;
  }

  /* ---------------------------------------------------------------- ⑦-3 英文 「摆！」 照句子摆一摆
     Bluey's living room: a bed, an open box and a mat (drawn here, side view: there is room under the bed and inside the box).
     A sentence card (not said: a tap says it, and that question earns no star) - "The cat is on the bed." Drag the thing the
     sentence names to the place it says: in the box, on the bed / the box / the mat, under the bed, by (beside) one of them.
     Levels: 1 on and in only, two things - the sentence's noun shows its little picture; 2 under too, two things, no picture
     (read the noun); 3 by too, three things; 4 the mat as well, five things, eight places; 5 two sentences, two things to place
     (both right). A random drag is right 1 time in 6 at level 1 (two things x three places), 1 in 8, 1 in 18, 1 in 40, at level
     5 about 1 in 640. Its 2nd hint shows the noun's picture under it (real help: no star; at level 1 it is there already). */
  const SPOTS = { 1: ['on:bed', 'in:box', 'on:box'], 2: ['on:bed', 'in:box', 'on:box', 'under:bed'], 3: ['on:bed', 'in:box', 'on:box', 'under:bed', 'by:bed', 'by:box'] };
  SPOTS[4] = SPOTS[5] = SPOTS[3].concat(['on:mat', 'by:mat']);
  const NTHINGS = [0, 2, 2, 3, 5, 5];
  const sentOf = (w, s) => { const [rel, f] = s.split(':'); return 'The ' + w + ' is ' + rel + ' the ' + f + '.'; };
  const BED_SVG = '<svg viewBox="0 0 300 220" width="100%" height="100%" preserveAspectRatio="none"><rect x="4" y="20" width="26" height="200" rx="8" fill="#B5793F" stroke="#2B2118" stroke-width="5"/><rect x="270" y="64" width="26" height="156" rx="8" fill="#B5793F" stroke="#2B2118" stroke-width="5"/>'
    + '<rect x="26" y="88" width="248" height="36" rx="12" fill="#FFFDF6" stroke="#2B2118" stroke-width="5"/><path d="M96 82H264C270 82 274 86 274 92V118C274 124 270 128 264 128H96Z" fill="#6BB9F2" stroke="#2B2118" stroke-width="5" stroke-linejoin="round"/>'
    + '<rect x="36" y="66" width="56" height="28" rx="12" fill="#FFFFFF" stroke="#2B2118" stroke-width="4"/><rect x="20" y="122" width="262" height="14" rx="5" fill="#9A6433" stroke="#2B2118" stroke-width="4"/>'
    + '<path d="M120 100H250M120 112H250" stroke="#4FA3E8" stroke-width="3"/></svg>';
  const BOX_BACK = '<svg viewBox="0 0 160 130" width="100%" height="100%" preserveAspectRatio="none"><path d="M14 52L4 14L58 18L62 56Z" fill="#E3AE68" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M146 52L156 14L102 18L98 56Z" fill="#E3AE68" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/>'
    + '<path d="M12 44H148L152 60H8Z" fill="#7A4E22" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/></svg>';
  const BOX_FRONT = '<svg viewBox="0 0 160 130" width="100%" height="100%" preserveAspectRatio="none"><rect x="8" y="56" width="144" height="72" rx="6" fill="#D99A50" stroke="#2B2118" stroke-width="5"/><rect x="66" y="56" width="28" height="72" fill="#F2D49B" opacity=".8"/><path d="M8 56H152" stroke="#2B2118" stroke-width="5"/></svg>';
  const MAT_SVG = '<svg viewBox="0 0 180 34" width="100%" height="100%" preserveAspectRatio="none"><path d="M18 3H178L162 31H2Z" fill="#5CC46E" stroke="#2B2118" stroke-width="4" stroke-linejoin="round"/><path d="M30 8H168M22 16H160M14 24H152" stroke="#3E9E4E" stroke-width="3"/></svg>';
  const Place = {
    rule: 'read-and-place', kind0: 'en', verb: '摆！', intro: '读一读，摆一摆！', props: [],
    gen(G, o) {
      const lv = o.level, spots = SPOTS[lv], words = W4D.placeThings.map(t => t[0]), two = lv >= 5;
      const w1 = bagFrom(G, 'pw', words), s1 = bagFrom(G, 'ps' + lv, spots), want = [[w1, s1]];
      if (two) { const w2 = G.rng.pick(words.filter(w => w !== w1)), s2 = G.rng.pick(spots.filter(s => s !== s1 && s.split(':')[1] !== s1.split(':')[1])); want.push([w2, s2]); }
      const tray = W4X.put(G, G.rng.shuffle(words.filter(w => !want.some(x => x[0] === w))).slice(0, NTHINGS[lv] - want.length).concat(want.slice(1).map(x => x[0])), w1);
      const n = tray.length * spots.length, chance = two ? (2 / n) * (1 / ((tray.length - 1) * spots.length)) : 1 / n;
      return { k: [want.map(x => x.join('@')).join('+'), tray.join('')], answer: 'ok', build: 1, chance: +chance.toFixed(5), want, tray, spots, mat: lv >= 4 ? 1 : 0, pic: lv <= 1 ? 1 : 0, two: two ? 1 : 0,
        text: want.map(x => sentOf(x[0], x[1])) };
    },
    itemOf() { return null; },
    /* the noun's picture gone, more things to choose from, more places (under, by, the mat), two sentences */
    hard(q) { return (1 - q.pic) + q.tray.length * 0.6 + q.spots.length * 0.3 + q.mat + q.two * 3; },
    /* the room: where the bed, the box and the mat stand (floor F), for this orientation */
    room(st) {
      const mat = st.q.mat;
      if (L()) {
        const F = 516, x0 = mat ? 24 : 150, bed = { x: x0, y: F - 206, w: 280, h: 206 }, box = { x: x0 + 400, y: F - 130, w: 160, h: 130 };
        return { F1: F, F2: F, bed, box, mat: mat ? { x: box.x + 280, y: F - 34, w: 180, h: 34 } : null };
      }
      const F1 = 560, F2 = 790, bed = { x: 70, y: F1 - 206, w: 280, h: 206 }, box = { x: mat ? 40 : 200, y: F2 - 130, w: 160, h: 130 };
      return { F1, F2, bed, box, mat: mat ? { x: box.x + 270, y: F2 - 34, w: 170, h: 34 } : null };
    },
    zone(R, s) {
      const b = R.bed, x = R.box, m = R.mat;
      return { 'on:bed': { x: b.x + 50, y: b.y - 60, w: b.w - 80, h: 130 }, 'under:bed': { x: b.x + 40, y: b.y + 128, w: b.w - 80, h: R.F1 - b.y - 128 }, 'by:bed': { x: b.x + b.w + 5, y: R.F1 - 120, w: 110, h: 120 },
        'in:box': { x: x.x + 10, y: x.y + 40, w: x.w - 20, h: x.h - 40 }, 'on:box': { x: x.x, y: x.y - 100, w: x.w, h: 130 }, 'by:box': { x: x.x + x.w + 5, y: R.F2 - 120, w: 110, h: 120 },
        'on:mat': m && { x: m.x, y: R.F2 - 120, w: m.w, h: 120 }, 'by:mat': m && { x: m.x + m.w + 5, y: R.F2 - 120, w: 100, h: 120 } }[s];
    },
    /* where a thing put there stands: its box (size S) and whether the box's front hides its lower part */
    seat(R, s, S) {
      const b = R.bed, x = R.box, m = R.mat, at = (cx, bottom, z) => ({ x: Math.round(cx - S / 2), y: Math.round(bottom - S), w: S, h: S, z: z || 12 });
      return { 'on:bed': at(b.x + b.w * 0.6, b.y + 84), 'under:bed': at(b.x + b.w / 2, R.F1 - 2), 'by:bed': at(b.x + b.w + 60, R.F1),
        'in:box': at(x.x + x.w / 2, x.y + 98, 7), 'on:box': at(x.x + x.w / 2, x.y + 54), 'by:box': at(x.x + x.w + 60, R.F2),
        'on:mat': m && at(m.x + m.w / 2, R.F2 - 12), 'by:mat': m && at(m.x + m.w + 55, R.F2) }[s];
    },
    async present(st) {
      const q = st.q;
      st.put = {}; st.done = []; st.noHelp = !!q.pic;      /* level 1: the noun's picture is there already - the 2nd hint adds nothing */
      st.bed = ZX.thing(st, 280, 206, 4, 'item'); st.bed.innerHTML = BED_SVG;
      st.boxB = ZX.thing(st, 160, 130, 5, 'item'); st.boxB.innerHTML = BOX_BACK;
      st.boxF = ZX.thing(st, 160, 130, 9, 'item'); st.boxF.innerHTML = BOX_FRONT;
      if (q.mat) { st.matEl = ZX.thing(st, 180, 34, 4, 'item'); const mi = img(OBJURL('mat'), '', st.matEl); Object.assign(mi.style, { width: '100%', height: '100%', objectFit: 'fill' }); mi.onerror = () => { st.matEl.innerHTML = MAT_SVG; }; }
      [st.bed, st.boxB, st.boxF, st.matEl].forEach(e => { if (e) e.style.pointerEvents = 'none'; });
      /* the sentence card: one or two sentences, read (a tap says them) */
      const card = st.readEl = ZX.thing(st, 10, 10, 7, 'item'), maxW = L() ? 760 : 660;
      Object.assign(card.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '50px', background: 'rgba(255,255,255,.96)', borderRadius: '22px', boxShadow: '0 0 0 4px #2B2118, 0 8px 0 rgba(43,33,24,.25)', padding: '12px 18px 50px' });      /* room under the noun for its little picture (level 1, the hint) */
      let h = q.two ? 46 : 60; q.text.forEach(t => { const pr = wordsRow(t, 100); h = Math.min(h, Math.floor(100 * (maxW - 40) / pr.w)); });
      st.rows = q.text.map(t => { const r = wordsRow(t, h); card.appendChild(r); return r; });
      st.nounPics = st.rows.map((r, i) => {
        const p = W4X.pic(W4D.placeThings.find(t => t[0] === q.want[i][0])[1], 46); Object.assign(p.style, { position: 'absolute', left: '50%', top: '100%', marginLeft: '-23px', marginTop: '2px', visibility: q.pic ? '' : 'hidden' });
        r.words[1].appendChild(p); return p;
      });
      card._w = Math.max(...st.rows.map(r => r.w)) + 36; card._h = q.text.length * h + (q.text.length - 1) * 50 + 62;
      K.reg(st, 'read', card, {}); st.readText = q.text.join(' ');
      st.things = q.tray.map((w, i) => {
        const d = ZX.thing(st, 104, 104, 12, 'item'); Object.assign(d.style, { borderRadius: '24px', background: 'rgba(255,253,246,.85)', boxShadow: '0 0 0 3px rgba(43,33,24,.5)' });
        d.appendChild(W4X.pic(W4D.placeThings.find(t => t[0] === w)[1], 88)); d.firstChild.style.margin = '8px';
        K.reg(st, 'thing' + i, d, { drag: true, drops: () => q.spots.map(s => ({ id: s, rect: () => this.zone(this.room(st), s) })) });
        K.pop(st, d, 300 + 70 * i);
        return d;
      });
      st.rights = st.things.slice();
      this.place(st);
      K.pop(st, card);
      st.prompt = '读一读，摆一摆！';
    },
    traySlot(st, i) {
      const n = st.things.length, Lx = L(), gap = 26, w = n * 104 + (n - 1) * gap, x0 = (Lx ? 560 : 352) - w / 2;
      return { x: Math.round(x0 + i * (104 + gap)), y: Lx ? 566 : 866, w: 104, h: 104 };
    },
    place(st) {
      if (!st.things) return;
      const R = this.room(st), Lx = L();
      place(st.bed, R.bed.x, R.bed.y, R.bed.w, R.bed.h); place(st.boxB, R.box.x, R.box.y, R.box.w, R.box.h); place(st.boxF, R.box.x, R.box.y, R.box.w, R.box.h);
      if (st.matEl) place(st.matEl, R.mat.x, R.mat.y, R.mat.w, R.mat.h);
      const c = st.readEl; place(c, Math.round((Lx ? 512 : 352) - c._w / 2), Lx ? 92 : 132, c._w, c._h);
      st.things.forEach((d, i) => {
        d.style.transform = ''; const s = st.put[i];
        if (s) { const b = this.seat(R, s, s === 'under:bed' ? 74 : 86); place(d, b.x, b.y, b.w, b.h); d.style.zIndex = b.z; }
        else { const b = this.traySlot(st, i); place(d, b.x, b.y, b.w, b.h); d.style.zIndex = 12; }
        this.look(d, !!s);
      });
    },
    decor(G) { const a = G.actors[this.chars[0]]; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 96 : 600, L() ? 698 : 560, L() ? 170 : 150); },
    /* a thing put somewhere (it stays there: what he made can be seen) */
    putAt(st, i, s, ms) {
      st.put[i] = s;
      const d = st.things[i], R = this.room(st), b = this.seat(R, s, s === 'under:bed' ? 74 : 86), o = box(d);
      d.getAnimations().forEach(a => a.cancel());
      const t = d.style.transform, m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(t || ''), ox = o.x + (m ? Number(m[1]) : 0), oy = o.y + (m ? Number(m[2]) : 0);
      d.style.transform = ''; place(d, b.x, b.y, b.w, b.h); d.style.zIndex = b.z; this.look(d, true);
      return st.scope.anim(d, [{ transform: 'translate(' + (ox - b.x) + 'px,' + (oy - b.y) + 'px)' }, { transform: 'translate(0,0)' }], { duration: ms || 220, easing: EASE.glide, fill: 'none' });
    },
    /* in the tray a thing sits on a little light tile; put in the room it stands there by itself */
    look(d, put) { Object.assign(d.style, put ? { background: 'none', boxShadow: 'none' } : { background: 'rgba(255,253,246,.85)', boxShadow: '0 0 0 3px rgba(43,33,24,.5)' }); const p = d.firstChild; if (p) { p.style.margin = put ? '0' : '8px'; p.style.width = p.style.height = put ? '100%' : '88px'; } },
    peekCard(st) {
      st.peeked = true; st.noStar = true;
      st.q.text.forEach((t, i) => (i ? Voice.say : Voice.sayNow).call(Voice, t, { tag: 'peek' })); K.hop(st, st.readEl, 12);
    },
    onGesture(st, name, p) {
      if (st.submitted || !st.things) return false;
      if (name === 'tap' && p.id === 'read') { this.peekCard(st); return 'ok'; }
      const m = /^thing(\d)$/.exec(p.id || ''); if (!m) return false;
      const i = Number(m[1]), w = st.q.tray[i];
      if (st.done.includes(i)) return false;
      if (name === 'tap') { K.hop(st, st.things[i], 16); if (!st.toldHow || Clock.t() - st.toldHow > 4000) { st.toldHow = Clock.t(); Voice.sayNow('把它拖过去！', { tag: 'how' }); } return 'free'; }
      if (name !== 'drop' || !st.q.spots.includes(p.to)) return false;
      Sfx.place(); this.putAt(st, i, p.to);
      const k = st.q.want.findIndex((x, j) => !st.done.some(d => st.doneW && st.doneW[d] === j) && x[0] === w && x[1] === p.to);
      if (k < 0) { st.tapped = i; st.made = sentOf(w, p.to); Session.submit(st, 'bad:' + w + ':' + p.to); return 'ok'; }
      st.done.push(i); (st.doneW = st.doneW || {})[i] = k;
      if (st.map[p.id] && st.map[p.id]._spec) st.map[p.id]._spec.disabled = true;
      K.hop(st, st.things[i], 14);
      if (st.done.length === st.q.want.length) Session.submit(st, 'ok');
      return 'ok';
    },
    async reveal(st) {
      Sfx.reveal(); st.done.forEach((i, j) => st.scope.timeout(() => K.hop(st, st.things[i], 24), 160 * j));
      const a = st.G.actors.bluey; if (a) a.react();
      st.q.text.forEach(t => Voice.say(t, { tag: 'summary' })); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: what he made, said - "The dog is on the bed." */
    async feedback(st) { K.wiggle(st, st.things[st.tapped]); Voice.say(st.made, { tag: 'wrong' }); await st.scope.wait(700); },
    /* explain: 1 the thing he put, blue (its sentence was just said); 2 the right thing goes slowly to the right place (a beat);
       3 it in gold, the right sentence said */
    async explain(st) {
      const q = st.q, iC = st.tapped, k = q.want.findIndex((x, j) => !Object.values(st.doneW || {}).includes(j)), [w, s] = q.want[k < 0 ? 0 : k], iR = q.tray.indexOf(w);
      EX.ring(st, st.things[iC], 'chosen');
      await EX.wait(st, 700);
      await W4X.exBeat(st, async () => {
        $$('.exring.chosen', Stage.el).forEach(r => r.remove());
        if (iC !== iR) { delete st.put[iC]; const b = this.traySlot(st, iC), d = st.things[iC]; d.style.zIndex = 12; await K.flyTo(st, d, b.x, b.y, 420, 20, 1); place(d, b.x, b.y, 104, 104); this.look(d, false); }
        await this.putAt(st, iR, s, 900);
      }, 250);
      await W4X.exRight(st, st.things[iR], null, [sentOf(w, s)], false);
    },
    /* the 2nd hint (real help): the noun's little picture under it */
    gestureHint(st, reteach) {
      if (!st.things) return;
      if (reteach) { const i = st.things.findIndex((d, j) => !st.done.includes(j)); if (i >= 0) st.scope.anim(st.things[i], [{ transform: 'translate(0,0)' }, { transform: 'translate(0,-60px)' }, { transform: 'translate(0,0)' }], { duration: 800, fill: 'none' }); return; }
      st.nounPics.forEach(p => { p.style.visibility = ''; K.pop(st, p); });
    },
    next(st, strat) {
      if (!st.things || st.submitted) return null;
      const q = st.q, k = q.want.findIndex((x, j) => !Object.values(st.doneW || {}).includes(j)); if (k < 0) return null;
      const [w, s] = q.want[k], i = q.tray.indexOf(w), to = strat === 'wrong' ? q.spots.find(x => !q.want.some(y => y[1] === x)) : s, z = this.zone(this.room(st), to);
      return { g: 'drop', p: { id: 'thing' + i, to }, to: { x: z.x + z.w / 2, y: z.y + z.h / 2 } };
    },
    workEls(st) { return (st.things || []).filter((d, i) => !st.done.includes(i)); },
    snap(st) { return { put: st.put || null, done: st.done || null, want: st.q.want }; },
    iconNode() { return W4X.svgIcon('<rect x="4" y="30" width="34" height="24" rx="4" fill="#D99A50" stroke="#2B2118" stroke-width="3"/><path d="M8 30L4 18L18 20L20 30ZM34 30L38 18L24 20L22 30Z" fill="#E3AE68" stroke="#2B2118" stroke-width="2.5"/><circle cx="21" cy="22" r="7" fill="#FF8A3C" stroke="#2B2118" stroke-width="2.5"/><path d="M44 18L56 30L44 42" fill="none" stroke="#2B2118" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'); },
  };

  /* ---------------------------------------------------------------- ⑦-4 挑战 「读！」 哪句说得通
     The first half of a sentence on a card (not said: a tap says it, and that question earns no star) and a dashed blank after
     it; five second halves below (tools/content.py SENSE4: one makes sense, four are impossible and funny). Drag one into the
     blank or tap it. Only sentences whose every character this child knows are asked. Levels: 1 the first half with its
     picture, a two-character second half; 2 no picture; 3 second halves of three characters (去水中。); 4 a first half of three
     characters or more (爷爷坐 / 小鸟飞); 5 two first halves, one after the other, each with its own five cards (two asks: a
     shared set of five would let a second sensible sentence count as wrong - 鸟在水中, 马去水中). A random tap is right 1 time in
     5 (level 5: 1 in 25). Its 2nd hint shows the first half's picture (real help; at level 1 it is there already: noHelp). */
  const han = t => Array.from(t).filter(c => /[一-鿿]/.test(c)).length;
  const placeOf = t => { const c = Array.from(t).find(x => W4D.endPic[x]); return c ? W4D.endPic[c] : null; };
  const scene = (subj, end) => { const o = placeOf(end); return o ? [[o, 0.5, 0.62, 0.72], [subj, 0.5, 0.38, 0.46]] : [[subj, 0.5, 0.55, 0.78]]; };
  const Sense = {
    rule: 'sensible-ending', kind0: 'quiz', verb: '读！', intro: '哪句说得通？', props: [],
    gen(G, o) {
      const lv = o.level, S = W4D.sense, ok = S.map((s, i) => i).filter(i => W4X.knowsAll(G, S[i].pre + S[i].ok + S[i].no.join('')));
      const cls = i => (han(S[i].pre) >= 3 ? 4 : han(S[i].ok) >= 3 ? 3 : 1), last = (G.asked || []).slice(-1)[0];
      const of = c => ok.filter(i => (c <= 2 ? cls(i) === 1 || (ok.filter(j => cls(j) === 1).length < 5 && cls(i) === 3) : cls(i) === c));
      const pickOne = (c, not) => { let L1 = of(c).filter(i => !not.includes(i) && S[i].pre + S[i].ok !== last); if (!L1.length) L1 = ok.filter(i => !not.includes(i)); if (!L1.length) L1 = ok; return bagFrom(G, 'sn' + c, L1); };
      if (lv >= 5) {
        const a = pickOne(G.rng.pick([1, 3, 4]), []), b = pickOne(G.rng.pick([1, 3, 4]), [a]);
        const halves = [a, b].map(i => ({ pre: S[i].pre, ok: S[i].ok, subj: S[i].subj, opts: W4X.put(G, S[i].no.slice(), S[i].ok) }));
        return { k: [halves.map(h => h.pre + h.ok).join('+'), halves.map(h => h.opts.join('')).join('+')], answer: 'all', seq: halves.map(h => h.ok), asks: halves.map(h => ({ opts: h.opts, answer: h.ok })),
          halves, item: S[a].pre + S[a].ok, pic: 0, two: 1, eLen: Math.max(han(S[a].ok), han(S[b].ok)), pLen: Math.max(han(S[a].pre), han(S[b].pre)) };
      }
      const i = pickOne(lv <= 2 ? 1 : lv, []), s = S[i], opts = W4X.put(G, s.no.slice(), s.ok);
      return { k: [s.pre, opts.join('')], answer: s.ok, opts, halves: [{ pre: s.pre, ok: s.ok, subj: s.subj, opts }], item: s.pre + s.ok, pic: lv <= 1 ? 1 : 0, two: 0, eLen: han(s.ok), pLen: han(s.pre) };
    },
    itemOf() { return null; },
    /* the picture gone, longer second halves, longer first halves, two at once */
    hard(q) { return (1 - q.pic) + (q.eLen >= 3 ? 1.2 : 0) + (q.pLen >= 3 ? 2.4 : 0) + q.two * 4 + (q.eLen + q.pLen) * 0.05; },
    async present(st) {
      const q = st.q;
      st.ix = 0; st.noHelp = !!q.pic;
      st.halfEls = q.halves.map((h, i) => {
        const card = ZX.thing(st, 10, 10, 7, 'item'); card.style.width = card.style.height = 'auto';
        const row = Sent.node(h.pre, 74, -1); card.appendChild(row);
        const blank = ZX.thing(st, 150, 100, 6, 'item'); Object.assign(blank.style, { border: '5px dashed #2B2118', borderRadius: '18px', background: 'rgba(255,247,214,.92)', pointerEvents: 'none' });
        const pic = ZX.thing(st, 120, 120, 6, 'card'); pic.style.pointerEvents = 'none'; pic.appendChild(W4X.pic(h.subj, 104)); pic.style.visibility = q.pic ? '' : 'hidden';
        K.pop(st, card, 100 * i); K.pop(st, blank, 100 * i + 80);
        return { card, blank, pic };
      });
      this.readFor(st);
      this.cardsFor(st);
      this.place(st);
      st.prompt = '哪句说得通？';
    },
    /* the first half asked now is the read card ("read": a tap says it - no star for this question) */
    readFor(st) {
      st.halfEls.forEach((h, i) => { if (h.card._spec) Input.unbind(h.card); h.card.style.opacity = i === st.ix || i < st.ix ? 1 : 0.55; });
      const h = st.halfEls[st.ix]; K.reg(st, 'read', h.card, {}); st.readEl = h.card; st.readText = st.q.halves[st.ix].pre;
    },
    cardsFor(st) {
      (st.cards || []).forEach(c => { if (!c._in) c.remove(); else Input.unbind(c); });
      const hv = st.q.halves[st.ix], H = 62;
      st.cards = hv.opts.map((t, i) => {
        const c = el('div', 'card', Stage.el); c.style.position = 'absolute'; st.els.push(c);
        const r = Sent.node(t, H, -1); Object.assign(r.style, { background: 'none', boxShadow: 'none', padding: '0' }); c.appendChild(r);
        K.reg(st, 'card' + i, c, { drag: true, drops: () => [{ id: 'blank', rect: () => box(st.halfEls[st.ix].blank) }] });
        K.pop(st, c, 60 * i);
        return c;
      });
      st.cardW = Math.max(150, Math.max(...st.cards.map(c => c.firstChild.offsetWidth)) + 34);
      st.opts = hv.opts.slice();
    },
    rowY(st, i) { const Lx = L(), two = st.q.two; return Lx ? (two ? 96 + i * 124 : 112) : (two ? 150 + i * 140 : 170); },
    place(st) {
      if (!st.halfEls) return;
      const Lx = L(), two = st.q.two;
      st.halfEls.forEach((h, i) => {
        const y = this.rowY(st, i), w = h.card.firstChild.offsetWidth, ht = h.card.firstChild.offsetHeight, bw = Math.max(150, st.cardW || 150);
        const pw = h.pic.style.visibility === 'hidden' && !st.q.pic ? 0 : 136, total = pw + w + 16 + bw, x0 = Math.round((Lx ? 560 : 352) - total / 2);
        place(h.pic, x0, y + (ht - 120) / 2, 120, 120);
        place(h.card, x0 + pw, y); h.card.style.width = h.card.style.height = 'auto';
        place(h.blank, x0 + pw + w + 16, y + (ht - 100) / 2, bw, 100);
        h.blankAt = { x: x0 + pw + w + 16, y: y + (ht - 100) / 2 };
        if (h.filled) place(h.filled, h.blankAt.x, h.blankAt.y, bw, 100);
      });
      const n = st.cards.length, cols = Lx ? 3 : 2, cw = st.cardW, ch = 100, gap = 24, y0 = Lx ? (two ? 370 : 300) : (two ? 470 : 420);
      let k = 0;
      st.cards.forEach((c, i) => {
        if (c._in) return;
        const r = Math.floor(k / cols), inRow = Math.min(cols, n - r * cols), x = (Lx ? 560 : 352) - (inRow * cw + (inRow - 1) * gap) / 2 + (k % cols) * (cw + gap);
        c.style.transform = ''; place(c, Math.round(x), y0 + r * (ch + gap + 6), cw, ch); k++;
      });
    },
    decor(G) { const a = G.actors.bluey; this.chars.forEach(id => hideActor(G.actors[id])); if (a) showActor(a, L() ? 96 : 600, L() ? 698 : 1012, L() ? 180 : 160); },
    /* an ending goes into the blank */
    fill(st, i) {
      const c = st.cards[i], h = st.halfEls[st.ix]; c._in = true; h.filled = c; c.style.transform = ''; c.style.zIndex = 41;
      place(c, h.blankAt.x, h.blankAt.y, st.cardW, 100); K.pop(st, c);
    },
    onGesture(st, name, p) {
      if (st.submitted || !st.cards || st.busy) return false;
      if (name === 'tap' && p.id === 'read') { W4X.peek(st); return 'ok'; }
      if ((name !== 'tap' && name !== 'drop') || (name === 'drop' && p.to !== 'blank')) return false;
      const i = K.cardIndex(p.id); if (i < 0 || st.cards[i]._in) return false;
      const q = st.q, hv = q.halves[st.ix];
      st.tapped = i; Sfx.place(); this.fill(st, i);
      if (st.opts[i] !== hv.ok) { st.made = hv.pre + st.opts[i]; Session.submit(st, st.opts[i]); return 'ok'; }
      if (st.ix + 1 < q.halves.length) {                  /* the first of two: the next first half and its own five cards */
        st.ix++; st.busy = true;                          /* nothing to tap until the new five are in */
        st.scope.timeout(() => { if (st.submitted || st.scope.dead) return; this.readFor(st); this.cardsFor(st); this.place(st); st.busy = false; }, 420);
        return 'ok';
      }
      Session.submit(st, q.two ? 'all' : hv.ok);
      return 'ok';
    },
    async reveal(st) {
      const q = st.q; Sfx.reveal();
      st.halfEls.forEach((h, i) => { if (h.filled) K.hop(st, h.filled, 22); h.pic.innerHTML = ''; h.pic.appendChild(Scene.node(scene(q.halves[i].subj, q.halves[i].ok), 112)); h.pic.style.visibility = ''; K.pop(st, h.pic); });
      this.place(st);
      const a = st.G.actors.bluey; if (a) a.react();
      q.halves.forEach(h => Voice.say(h.pre + h.ok, { tag: 'summary' })); this.cheerAll(st);
      await st.scope.guard(Voice.afterSay(200));
    },
    /* the factual line: the sentence he made, asked back - "鱼在天上？" */
    async feedback(st) { Voice.say(st.made.replace('。', '？'), { tag: 'wrong' }); await st.scope.wait(700); },
    /* explain: 1 his sentence in blue with its funny picture; 2 the right ending goes into the blank, the right picture (a beat);
       3 the right card in gold: "鱼在水中。" */
    async explain(st) {
      const q = st.q, hv = q.halves[st.ix], h = st.halfEls[st.ix], iC = st.tapped, iR = st.opts.indexOf(hv.ok), cC = st.cards[iC], cR = st.cards[iR];
      h.pic.innerHTML = ''; h.pic.appendChild(Scene.node(scene(hv.subj, st.opts[iC]), 112)); h.pic.style.visibility = ''; h.pic.style.boxShadow = '0 0 0 5px ' + EX_BLUE; this.place(st); K.pop(st, h.pic);
      EX.ring(st, cC, 'chosen');
      await EX.wait(st, 750);
      await W4X.exBeat(st, async () => {
        $$('.exring.chosen', Stage.el).forEach(r => r.remove());
        cC._in = false; h.filled = null; this.place(st);
        const b = h.blankAt; cR.style.zIndex = 41; await K.flyTo(st, cR, b.x, b.y, 520, 30, 1); cR._in = true; h.filled = cR; place(cR, b.x, b.y, st.cardW, 100);
        h.pic.innerHTML = ''; h.pic.appendChild(Scene.node(scene(hv.subj, hv.ok), 112)); h.pic.style.boxShadow = ''; K.pop(st, h.pic);
      }, 450);
      await W4X.exRight(st, cR, null, [hv.pre + hv.ok], false);
    },
    /* the 2nd hint (real help, levels 2-5): the first half's picture */
    gestureHint(st, reteach) {
      if (!st.halfEls) return;
      if (reteach) { (st.cards || []).forEach((c, i) => { if (!c._in) st.scope.timeout(() => K.hop(st, c, 16), 90 * i); }); return; }
      const h = st.halfEls[st.ix]; if (h.pic.style.visibility === 'hidden') { h.pic.style.visibility = ''; this.place(st); K.pop(st, h.pic); }
    },
    next(st, strat) {
      if (!st.cards || st.submitted || st.busy) return null;
      const hv = st.q.halves[st.ix], r = st.opts.indexOf(hv.ok), i = strat === 'wrong' ? st.opts.findIndex((t, j) => j !== r && !st.cards[j]._in) : r;
      if (i < 0 || !st.cards[i] || st.cards[i]._in) return null;
      return { g: 'tap', p: { id: 'card' + i } };
    },
    workEls(st) { return (st.cards || []).filter(c => !c._in); },
    snap(st) { return { opts: st.opts || null, ix: st.ix || 0 }; },
    iconNode() { const d = el('div'); d.style.display = 'flex'; d.style.alignItems = 'center'; d.appendChild(Glyph.zh('鱼', 34)); const b = el('div', '', d); Object.assign(b.style, { width: '30px', height: '24px', border: '3px dashed #2B2118', borderRadius: '6px', marginLeft: '3px' }); return d; },
  };

  w4Island('bluey4', [Kites, Place, Sense]);
})();

W4X.loaded();
