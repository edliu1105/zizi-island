/* 字字岛 · 神笔海 (world 4, docs/W4-DESIGN.md): the lazily loaded part - built by tools/build.py from tools/content.py and src/w4/*.js; do not edit. */
'use strict';
const W4D = {"read":[["鱼在水中。",[["river",0.5,0.55,0.94],["fish",0.5,0.5,0.42]],[[["mountain",0.5,0.66,0.6],["fish",0.5,0.24,0.3]],[["river",0.5,0.55,0.94],["bird",0.5,0.5,0.42]],[["tree",0.5,0.66,0.6],["fish",0.5,0.24,0.3]],[["car",0.5,0.66,0.6],["fish",0.5,0.24,0.3]]]],["鸟飞上天。",[["sky",0.5,0.5,0.96],["bird",0.5,0.4,0.42]],[[["soil",0.5,0.76,0.62],["bird",0.5,0.42,0.46]],[["sky",0.5,0.5,0.96],["fish",0.5,0.4,0.42]],[["sky",0.5,0.5,0.96],["cow",0.5,0.4,0.42]],[["river",0.5,0.55,0.94],["bird",0.5,0.5,0.42]]]],["山上有雪。",[["mountain",0.5,0.66,0.6],["snow",0.5,0.24,0.3]],[[["mountain",0.5,0.4,0.6],["snow",0.5,0.84,0.28]],[["mountain",0.5,0.66,0.6],["fire",0.5,0.24,0.3]],[["car",0.5,0.66,0.6],["snow",0.5,0.24,0.3]],[["mountain",0.5,0.66,0.6],["grass",0.5,0.24,0.3]]]],["地上有草。",[["soil",0.5,0.76,0.62],["grass",0.5,0.42,0.46]],[[["sky",0.5,0.5,0.96],["grass",0.5,0.4,0.42]],[["soil",0.5,0.76,0.62],["snow",0.5,0.42,0.46]],[["soil",0.5,0.76,0.62],["fire",0.5,0.42,0.46]],[["soil",0.5,0.76,0.62],["fish",0.5,0.42,0.46]]]],["小虫在草上。",[["grass",0.5,0.66,0.6],["insect",0.5,0.24,0.3]],[[["cup",0.5,0.66,0.6],["insect",0.5,0.24,0.3]],[["grass",0.5,0.66,0.6],["bird",0.5,0.24,0.3]],[["snow",0.5,0.66,0.6],["insect",0.5,0.24,0.3]],[["door",0.5,0.66,0.6],["insect",0.5,0.24,0.3]]]],["牛在左，马在右。",[["cow",0.28,0.58,0.5],["horse",0.72,0.6,0.5]],[[["horse",0.28,0.58,0.5],["cow",0.72,0.6,0.5]],[["cow",0.28,0.58,0.5],["cow",0.72,0.6,0.5]],[["sheep",0.28,0.58,0.5],["horse",0.72,0.6,0.5]],[["cow",0.28,0.58,0.5],["sheep",0.72,0.6,0.5]]]],["我坐下。",[["sit",0.5,0.55,0.8]],[[["stand",0.5,0.55,0.8]],[["walk",0.5,0.55,0.8]],[["talk",0.5,0.55,0.8]],[["listen",0.5,0.55,0.8]]]],["我站在门口。",[["stand",0.32,0.6,0.62],["door",0.74,0.54,0.5]],[[["sit",0.32,0.66,0.5],["door",0.74,0.54,0.5]],[["stand",0.32,0.6,0.62],["car",0.74,0.62,0.44]],[["walk",0.32,0.6,0.62],["door",0.74,0.54,0.5]],[["stand",0.32,0.6,0.62],["mountain",0.74,0.5,0.5]]]],["我去山上。",[["goaway",0.3,0.62,0.6],["mountain",0.72,0.42,0.5]],[[["come",0.3,0.62,0.6],["mountain",0.72,0.42,0.5]],[["goaway",0.3,0.62,0.6],["water",0.72,0.5,0.44]],[["sit",0.5,0.74,0.44],["mountain",0.5,0.34,0.56]],[["look",0.3,0.62,0.6],["mountain",0.72,0.42,0.5]]]],["门开了。",[["door_open",0.5,0.55,0.7]],[[["door",0.5,0.55,0.7]],[["chest_open",0.5,0.55,0.7]],[["umbrella",0.5,0.55,0.7]],[["lamp",0.5,0.55,0.7]]]],["门关了。",[["door",0.5,0.55,0.7]],[[["door_open",0.5,0.55,0.7]],[["chest_shut",0.5,0.55,0.7]],[["umbrella",0.5,0.55,0.7]],[["car",0.5,0.55,0.7]]]],["鸟多，鱼少。",[["bird",0.15,0.35,0.18],["bird",0.39,0.35,0.18],["bird",0.15,0.55,0.18],["bird",0.39,0.55,0.18],["bird",0.15,0.75,0.18],["fish",0.73,0.45,0.24],["fish",0.73,0.65,0.24]],[[["bird",0.27,0.45,0.24],["bird",0.27,0.65,0.24],["fish",0.61,0.35,0.18],["fish",0.85,0.35,0.18],["fish",0.61,0.55,0.18],["fish",0.85,0.55,0.18],["fish",0.61,0.75,0.18]],[["bird",0.15,0.45,0.18],["bird",0.39,0.45,0.18],["bird",0.15,0.65,0.18],["fish",0.61,0.45,0.18],["fish",0.85,0.45,0.18],["fish",0.61,0.65,0.18]],[["bird",0.15,0.35,0.18],["bird",0.39,0.35,0.18],["bird",0.15,0.55,0.18],["bird",0.39,0.55,0.18],["bird",0.15,0.75,0.18],["cow",0.73,0.45,0.24],["cow",0.73,0.65,0.24]],[["bird",0.27,0.55,0.24],["fish",0.73,0.55,0.24]]]],["妹妹有鱼。",[["@bingo",0.3,0.58,0.7],["fish",0.74,0.64,0.38]],[[["@peppa",0.3,0.58,0.7],["fish",0.74,0.64,0.38]],[["@bingo",0.3,0.58,0.7],["bird",0.74,0.64,0.38]],[["@george",0.3,0.58,0.7],["fish",0.74,0.64,0.38]],[["@bingo",0.3,0.58,0.7],["umbrella",0.74,0.64,0.38]]]],["爷爷有车。",[["@grandpa",0.3,0.58,0.7],["car",0.74,0.64,0.38]],[[["@daddy_pig",0.3,0.58,0.7],["car",0.74,0.64,0.38]],[["@grandpa",0.3,0.58,0.7],["umbrella",0.74,0.64,0.38]],[["@george",0.3,0.58,0.7],["car",0.74,0.64,0.38]],[["@grandpa",0.3,0.58,0.7],["horse",0.74,0.64,0.38]]]]],"books":[{"id":"b7","title":"天上地下","after":"ultra4","cover":[["sky",0.5,0.5,0.96],["sun",0.5,0.4,0.42]],"pages":[["天上有日。",[["sky",0.5,0.5,0.96],["sun",0.5,0.4,0.42]]],["天上有月。",[["sky",0.5,0.5,0.96],["moon",0.5,0.4,0.42]]],["天上有云。",[["sky",0.5,0.5,0.96],["cloud",0.5,0.4,0.5]]],["地上有山。",[["grass",0.5,0.82,0.9],["mountain",0.5,0.44,0.64]]],["地上有水。",[["river",0.5,0.55,0.82]]],["山下有金！",[["mountain",0.5,0.4,0.6],["gold",0.5,0.84,0.28]]]]},{"id":"b8","title":"我的头","after":"peppa4","pages":[["这是我的头。",[["head",0.5,0.55,0.7]]],["这是我的耳。",[["ear",0.5,0.55,0.7]]],["这是我的口。",[["mouth",0.5,0.55,0.7]]],["这是我的牙。",[["tooth",0.5,0.55,0.7]]],["这是我的手。",[["hand",0.5,0.55,0.7]]],["这是我的足！",[["foot",0.5,0.55,0.7]]]]}],"scrolls":[{"id":"r1","kind":"rhyme","title":"金木水火土","after":"ultra4","pic":[["sun",0.28,0.3,0.3],["moon",0.72,0.3,0.3],["mountain",0.5,0.7,0.56]],"lines":["一二三四五，","金木水火土。","天地分上下，","日月照今古。"]},{"id":"r2","kind":"rhyme","title":"五官歌","after":"peppa4","pic":[["head",0.5,0.45,0.6],["heart",0.82,0.78,0.26]],"lines":["头，点点头。","耳，听一听。","牙，白又白。","足，走一走。","心，好开心！"]}],"scrollKind":{"rhyme":"儿歌卷","poem":"古诗卷"},"words":[["cat","cat",1],["hat","hat",1],["bat","bat",1],["mat","mat",1],["rat","rat",1],["fan","fan",1],["pan","pan",1],["van","van",1],["man","man",1],["can","tincan",1],["map","map",1],["cap","cap",1],["pig","pig",1],["wig","wig",1],["fig","fig",0],["bug","insect",1],["rug","rug",1],["mug","mug",1],["jug","jug",0],["mop","mop",1],["top","top",0],["hop","hop",0],["pen","pen",1],["hen","hen",1],["ten","num10",0],["net","net",0],["jet","jet",1],["sun","sun",1],["bun","bun",1],["run","run",0],["box","box",1],["fox","fox",1],["dog","dog",1],["log","log",1],["bed","bed",1]],"sight":["I","a","the","see","my","is","it","in","on","up","go","can","look","me","we","and","you","big","little","down","come","not","one","two","three","red","blue","yellow","here","said","play","at","under","by"],"bridge":[["big","大","big"],["little","小","small"],["up","上","up"],["down","下","down"],["go","去","goaway"],["come","来","come"],["look","看","look"],["I","我",null],["you","你",null],["is","是",null],["not","不",null],["one","一","num1"],["two","二","num2"],["three","三","num3"],["red","红","strawberry"],["blue","蓝","whale"],["yellow","黄","banana"]],"esent":[["I see.",[["look",0.5,0.55,0.8]]],["I can hop.",[["hop",0.5,0.55,0.7]]],["I can run.",[["run",0.5,0.55,0.7]]],["Look up!",[["look",0.4,0.62,0.66],["sun",0.78,0.2,0.3]]],["A big pig.",[["pig",0.5,0.55,0.86]]],["A red hat.",[["hat",0.5,0.55,0.7]]],["Come and play!",[["come",0.5,0.55,0.8]]],["A little rat.",[["rat",0.5,0.64,0.34]]],["I see a cat.",[["look",0.3,0.6,0.6],["cat",0.75,0.62,0.4]]],["The pig is big.",[["pig",0.5,0.55,0.86]]],["The sun is up.",[["mountain",0.5,0.66,0.6],["sun",0.5,0.24,0.3]]],["My hat is red.",[["hat",0.5,0.55,0.7]]],["Look at the hen.",[["hen",0.5,0.55,0.7]]],["The cup is blue.",[["cup",0.5,0.55,0.7]]],["Here is my cap.",[["cap",0.5,0.55,0.7]]],["I see a big jet.",[["look",0.28,0.62,0.56],["jet",0.72,0.34,0.5]]],["A bug is on the rug.",[["rug",0.5,0.66,0.6],["insect",0.5,0.24,0.3]]],["The cat is on the box.",[["box",0.5,0.66,0.6],["cat",0.5,0.24,0.3]]],["I can see a man.",[["look",0.3,0.62,0.56],["man",0.72,0.6,0.5]]],["It is on the box.",[["box",0.5,0.66,0.6],["fox",0.5,0.24,0.3]]],["Is it a hen?",[["hen",0.5,0.55,0.7]]],["The rat is little.",[["rat",0.5,0.64,0.34]]],["A cat can hop.",[["cat",0.5,0.55,0.7]]],["Go, dog, go!",[["dog",0.5,0.55,0.7]]],["Run, man, run!",[["man",0.5,0.55,0.7]]],["Hop, hop, hop!",[["hop",0.5,0.55,0.7]]],["A pig and a hen.",[["pig",0.28,0.58,0.5],["hen",0.72,0.6,0.5]]],["The cat and the dog.",[["cat",0.28,0.58,0.5],["dog",0.72,0.6,0.5]]],["We can play in the sun.",[["sun",0.5,0.55,0.7]]],["My mug is on the mat.",[["mat",0.5,0.66,0.6],["mug",0.5,0.24,0.3]]],["I see three red hats.",[["hat",0.198,0.55,0.28],["hat",0.5,0.55,0.28],["hat",0.802,0.55,0.28]]],["Look, a fox on a box!",[["box",0.5,0.66,0.6],["fox",0.5,0.24,0.3]]],["The hen is not big.",[["hen",0.5,0.64,0.34]]],["Two cats and a dog.",[["cat",0.2,0.6,0.32],["cat",0.45,0.6,0.32],["dog",0.76,0.6,0.38]]],["Come and see my map.",[["map",0.5,0.55,0.7]]],["The jet is up, up, up!",[["jet",0.5,0.55,0.7]]]],"tf":[{"lv":1,"pic":[["pig",0.5,0.55,0.86]],"s":[["A big pig.",1],["I see a pig.",1],["A little pig.",0],["A blue pig.",0]]},{"lv":1,"pic":[["cat",0.5,0.64,0.34]],"s":[["A little cat.",1],["I see a cat.",1],["A big cat.",0],["A red cat.",0]]},{"lv":1,"pic":[["hat",0.5,0.55,0.7]],"s":[["A red hat.",1],["I see a hat.",1],["A blue hat.",0],["A yellow hat.",0]]},{"lv":1,"pic":[["cup",0.5,0.55,0.7]],"s":[["A blue cup.",1],["I see a cup.",1],["A red cup.",0],["A yellow cup.",0]]},{"lv":1,"pic":[["dog",0.5,0.55,0.86]],"s":[["A big dog.",1],["I see a dog.",1],["A little dog.",0],["A big hen.",0]]},{"lv":2,"pic":[["pig",0.5,0.55,0.86]],"s":[["The pig is big.",1],["It is a pig.",1],["The pig is little.",0],["It is a dog.",0]]},{"lv":2,"pic":[["sun",0.5,0.55,0.7]],"s":[["The sun is yellow.",1],["It is the sun.",1],["The sun is blue.",0],["It is a bun.",0]]},{"lv":2,"pic":[["cup",0.5,0.55,0.7]],"s":[["The cup is blue.",1],["It is a cup.",1],["The cup is red.",0],["It is a cap.",0]]},{"lv":2,"pic":[["hen",0.5,0.64,0.34]],"s":[["The hen is little.",1],["It is a hen.",1],["The hen is big.",0],["It is a pen.",0]]},{"lv":3,"pic":[["cat",0.198,0.55,0.28],["cat",0.5,0.55,0.28],["cat",0.802,0.55,0.28]],"s":[["I see three cats.",1],["I see cats.",1],["I see two cats.",0],["I see one cat.",0]]},{"lv":3,"pic":[["hat",0.338,0.55,0.3],["hat",0.662,0.55,0.3]],"s":[["I see two hats.",1],["I see hats.",1],["I see three hats.",0],["I see one hat.",0]]},{"lv":3,"pic":[["dog",0.5,0.55,0.3]],"s":[["I see one dog.",1],["I see a dog.",1],["I see two dogs.",0],["I see three dogs.",0]]},{"lv":3,"pic":[["cup",0.198,0.55,0.28],["cup",0.5,0.55,0.28],["cup",0.802,0.55,0.28]],"s":[["I see three cups.",1],["I see cups.",1],["I see one cup.",0],["I see two cups.",0]]},{"lv":4,"pic":[["cat",0.5,0.64,0.34]],"s":[["The cat is not big.",1],["It is not a dog.",1],["The cat is not little.",0],["It is not a cat.",0]]},{"lv":4,"pic":[["pig",0.5,0.55,0.86]],"s":[["The pig is not little.",1],["It is not a hen.",1],["The pig is not big.",0],["It is not a pig.",0]]},{"lv":4,"pic":[["hat",0.5,0.55,0.7]],"s":[["The hat is not blue.",1],["It is not a cap.",1],["The hat is not red.",0],["It is not a hat.",0]]},{"lv":4,"pic":[["cup",0.5,0.55,0.7]],"s":[["The cup is not red.",1],["It is not a mug.",1],["The cup is not blue.",0],["It is not a cup.",0]]},{"lv":5,"pic":[["box",0.5,0.66,0.6],["cat",0.5,0.24,0.3]],"s":[["The cat is on the box.",1],["The cat is not in the box.",1],["The cat is in the box.",0],["The cat is under the box.",0]]},{"lv":5,"pic":[["cat",0.28,0.58,0.44],["box",0.72,0.6,0.5]],"s":[["The cat is by the box.",1],["The cat is not on the box.",1],["The cat is on the box.",0],["The cat is in the box.",0]]},{"lv":5,"pic":[["bed",0.5,0.66,0.6],["hat",0.5,0.24,0.3]],"s":[["The hat is on the bed.",1],["The hat is not under the bed.",1],["The hat is under the bed.",0],["The hat is in the box.",0]]},{"lv":5,"pic":[["bed",0.5,0.4,0.6],["dog",0.5,0.84,0.28]],"s":[["The dog is under the bed.",1],["The dog is not on the bed.",1],["The dog is on the bed.",0],["The dog is in the box.",0]]}],"placeThings":[["cat","cat"],["dog","dog"],["hat","hat"],["cup","cup"],["bug","insect"]],"placeSpots":[["in","box"],["on","bed"],["on","box"],["on","mat"],["under","bed"],["by","bed"],["by","box"],["by","mat"]],"place":["The cat is in the box.","The cat is on the bed.","The cat is on the box.","The cat is on the mat.","The cat is under the bed.","The cat is by the bed.","The cat is by the box.","The cat is by the mat.","The dog is in the box.","The dog is on the bed.","The dog is on the box.","The dog is on the mat.","The dog is under the bed.","The dog is by the bed.","The dog is by the box.","The dog is by the mat.","The hat is in the box.","The hat is on the bed.","The hat is on the box.","The hat is on the mat.","The hat is under the bed.","The hat is by the bed.","The hat is by the box.","The hat is by the mat.","The cup is in the box.","The cup is on the bed.","The cup is on the box.","The cup is on the mat.","The cup is under the bed.","The cup is by the bed.","The cup is by the box.","The cup is by the mat.","The bug is in the box.","The bug is on the bed.","The bug is on the box.","The bug is on the mat.","The bug is under the bed.","The bug is by the bed.","The bug is by the box.","The bug is by the mat."],"wordsZh":[["天上",""],["地上",""],["天下",""],["地下",""],["山上",""],["山下",""],["上天",""],["大地",""],["土地","soil"],["天地",""],["山川",""],["金鱼","fish"],["大鱼",""],["小鱼",""],["鱼头",""],["小虫","insect"],["草地","grass"],["小草",""],["雪地",""],["大雪","snow"],["小雪",""],["雪山","mountain"],["水草",""],["火山","volcano"],["山水",""],["大火","fire"],["门口",""],["人口",""],["山口",""],["石头","stone"],["木头","log"],["牛头",""],["马头",""],["大头","head"],["手心","hand"],["小心",""],["人心",""],["月牙","moon"],["坐下","sit"],["听说",""],["上下",""],["大小",""],["日月","bright"],["牛马",""],["大人",""],["小人",""],["多少",""],["开关",""],["开门","door_open"],["关门","door"],["大门",""],["小门",""],["左手",""],["右手",""],["左右",""],["前后",""],["爷爷","@grandpa"],["奶奶","grandma"],["妹妹","@bingo"],["下山",""],["上山",""],["对门",""],["不对",""],["对了",""]],"wordsZh3":[["小金鱼","fish"],["大金鱼",""],["大雪山","mountain"],["小雪山",""],["小草地","grass"],["大草地",""],["大火山","volcano"],["小火山",""],["大石头","stone"],["小石头",""],["大木头","log"],["小木头",""]],"sense":[{"pre":"鸟飞","ok":"上天。","no":["上牙。","上米。","上月。","下石中。"],"subj":"bird"},{"pre":"马去","ok":"山上。","no":["天上。","牙上。","耳中。","米中。"],"subj":"horse"},{"pre":"爷爷","ok":"坐下。","no":["坐牙上。","站米上。","坐耳上。","坐月上。"],"subj":"@grandpa"},{"pre":"鱼","ok":"去水中。","no":["去米中。","去山上。","坐车上。","飞上月。"],"subj":"fish"},{"pre":"牛","ok":"站地上。","no":["站天上。","站月上。","站米上。","站牙上。"],"subj":"cow"},{"pre":"奶奶","ok":"坐车上。","no":["坐月上。","站米上。","坐牙上。","坐耳中。"],"subj":"grandma"},{"pre":"羊","ok":"站山上。","no":["站米上。","站月上。","站牙上。","站耳中。"],"subj":"sheep"},{"pre":"小虫","ok":"去草中。","no":["去月上。","去日上。","去金中。","去石中。"],"subj":"insect"},{"pre":"妹妹","ok":"站门口。","no":["站月上。","站米上。","站牙上。","站耳中。"],"subj":"@bingo"},{"pre":"小鸟","ok":"站木上。","no":["站米上。","站月上。","站耳中。","站石中。"],"subj":"bird"},{"pre":"车","ok":"去山下。","no":["去天上。","去月上。","去米中。","去牙中。"],"subj":"car"},{"pre":"小马","ok":"去草地。","no":["去月上。","去米中。","去牙中。","去耳中。"],"subj":"horse"},{"pre":"大牛","ok":"去水中。","no":["飞上天。","去米中。","坐牙上。","站耳上。"],"subj":"cow"},{"pre":"爷爷坐","ok":"车上。","no":["米上。","月上。","牙上。","耳中。"],"subj":"@grandpa"},{"pre":"小鸟飞","ok":"上天。","no":["上牙。","上米。","上月。","下石中。"],"subj":"bird"},{"pre":"小鱼去","ok":"水中。","no":["米中。","天上。","山上。","牙上。"],"subj":"fish"},{"pre":"鱼在","ok":"水中。","no":["天上。","米中。","牙上。","石中。"],"subj":"fish"},{"pre":"牛在","ok":"地上。","no":["天上。","米中。","牙上。","耳中。"],"subj":"cow"},{"pre":"小虫在","ok":"草上。","no":["月上。","金中。","日上。","石中。"],"subj":"insect"},{"pre":"鸟在","ok":"天上。","no":["米中。","牙中。","耳中。","金中。"],"subj":"bird"},{"pre":"门","ok":"开了。","no":["飞了。","说了。","听了。","坐了。"],"subj":"door"},{"pre":"雪是","ok":"白的。","no":["红的。","绿的。","蓝的。","金的。"],"subj":"snow"},{"pre":"爸爸","ok":"喝汤。","no":["喝石头。","喝门。","喝车。","喝伞。"],"subj":"@daddy_pig"},{"pre":"妈妈","ok":"吃饭。","no":["吃石头。","吃门。","吃车。","吃伞。"],"subj":"@mummy_pig"},{"pre":"我","ok":"看书。","no":["喝书。","吃车。","坐牙上。","坐耳中。"],"subj":"look"},{"pre":"兔子","ok":"吃草。","no":["吃车。","吃石头。","吃门。","吃伞。"],"subj":"rabbit"},{"pre":"我坐","ok":"车上。","no":["米上。","月上。","牙上。","耳中。"],"subj":"sit"},{"pre":"小狗","ok":"在地上。","no":["在月上。","在米上。","在牙上。","在耳中。"],"subj":"dog"},{"pre":"弟弟","ok":"在门口。","no":["在月上。","在米中。","在牙中。","在耳上。"],"subj":"@george"},{"pre":"小鸡","ok":"吃米。","no":["吃车。","吃门。","吃伞。","吃灯。"],"subj":"chicken"}],"endPic":{"伞":"umbrella","灯":"lamp","天":"sky","火":"fire","牙":"tooth","耳":"ear","石":"stone","日":"sun","月":"moon","金":"gold","山":"mountain","水":"river","地":"soil","草":"grass","车":"car","门":"door","木":"tree","书":"book","饭":"ricebowl","汤":"soup","米":"rice"},"orderRules":["先横后竖","从上到下","先撇后捺","从左到右","先中间后两边","先外后内","先进去后关门"],"orderPairs":[["十",1,2,"先横后竖",1],["土",1,2,"先横后竖",1],["木",1,2,"先横后竖",1],["耳",1,2,"先横后竖",1],["草",1,2,"先横后竖",1],["地",1,2,"先横后竖",1],["去",1,2,"先横后竖",1],["禾",2,3,"先横后竖",1],["车",3,4,"先横后竖",1],["米",3,4,"先横后竖",1],["手",3,4,"先横后竖",1],["坐",5,6,"先横后竖",1],["林",1,2,"先横后竖",1],["来",4,5,"先横后竖",1],["走",1,2,"先横后竖",1],["在",4,5,"先横后竖",1],["天",1,2,"从上到下",1],["开",1,2,"从上到下",1],["云",1,2,"从上到下",1],["二",1,2,"从上到下",1],["三",2,3,"从上到下",1],["上",2,3,"从上到下",1],["羊",3,4,"从上到下",1],["牛",2,3,"从上到下",1],["手",2,3,"从上到下",1],["关",3,4,"从上到下",1],["耳",4,5,"从上到下",1],["人",1,2,"先撇后捺",2],["大",2,3,"先撇后捺",2],["天",3,4,"先撇后捺",2],["木",3,4,"先撇后捺",2],["禾",4,5,"先撇后捺",2],["米",5,6,"先撇后捺",2],["火",3,4,"先撇后捺",2],["关",5,6,"先撇后捺",2],["足",6,7,"先撇后捺",2],["八",1,2,"先撇后捺",2],["从",3,4,"先撇后捺",2],["走",6,7,"先撇后捺",2],["川",1,2,"从左到右",2],["小",2,3,"从左到右",2],["火",1,2,"从左到右",2],["坐",2,3,"从左到右",2],["林",4,5,"从左到右",2],["从",2,3,"从左到右",2],["小",1,2,"先中间后两边",3],["水",1,2,"先中间后两边",3],["少",1,2,"先中间后两边",3],["山",1,2,"先中间后两边",3],["光",1,2,"先中间后两边",3],["月",2,3,"先外后内",3],["目",2,3,"先外后内",3],["田",2,3,"先外后内",3],["日",2,3,"先外后内",3],["肉",2,3,"先外后内",3],["风",2,3,"先外后内",3],["四",2,3,"先外后内",3],["白",3,4,"先外后内",3],["日",3,4,"先进去后关门",4],["目",4,5,"先进去后关门",4],["田",4,5,"先进去后关门",4],["四",4,5,"先进去后关门",4],["白",4,5,"先进去后关门",4],["牛",2,4,"先横后竖",4],["车",1,4,"先横后竖",4],["羊",3,6,"先横后竖",4],["土",1,3,"从上到下",4],["羊",3,5,"从上到下",4],["耳",1,4,"从上到下",4],["目",3,5,"先进去后关门",4],["田",3,5,"先进去后关门",4],["川",2,3,"从左到右",5],["耳",2,3,"从左到右",5],["草",2,3,"从左到右",5],["心",3,4,"从左到右",5],["坐",1,3,"从左到右",5],["多",1,4,"从上到下",5],["林",1,5,"从左到右",5],["竹",1,4,"从左到右",5],["雪",5,7,"从左到右",5],["雪",5,6,"从上到下",5]],"kind":{"天上":"天日月云雨电雪","地上":"地土山石田草川禾木竹","动物":"牛羊马鸟鱼虫龙兔狗鸡","身体":"口目手耳足头牙心","动作":"坐站飞说听吃喝看走来去","家人":"爸妈哥姐弟爷奶妹"},"kindLine":{"天上":"这是天上的","地上":"这是地上的","动物":"这是动物","身体":"这是身体","动作":"这是动作","家人":"这是家人"},"kindWords":[["金鱼","动物"],["小鸟","动物"],["小虫","动物"],["雪山","地上"],["草地","地上"],["石头","地上"],["大雪","天上"],["月牙","天上"],["手心","身体"],["大头","身体"],["坐下","动作"],["听说","动作"],["爷爷","家人"],["奶奶","家人"],["妹妹","家人"],["爸爸","家人"]],"body":[["听","耳","listen"],["说","口","talk"],["站","足","stand"],["看","目","look"],["吃","口","eat"],["喝","口","drink"],["走","足","walk"]],"opp":["大小","上下","多少","开关","来去","左右","前后","天地"],"oppWords":[["上山","下山"],["开门","关门"],["大门","小门"],["天上","地下"],["左手","右手"]],"look":{"天":"大开","地":"他","土":"上","川":"三小","耳":"目","足":"走是","心":"小","飞":"风","听":"吃","雪":"雨","虫":"中电","少":"小","开":"天关","关":"开天","去":"云","左":"右在","右":"左有石","中":"虫","爷":"爸","奶":"妈","妹":"姐妈","子":"了"},"lookBack":{"大":"天","上":"土","小":"少","风":"飞","雨":"雪","云":"去","在":"左","有":"右","石":"右","了":"子","走":"足","是":"足","目":"耳","爸":"爷","妈":"奶妹","姐":"妹","电":"虫","吃":"听","他":"地"},"holds":{"大":"天","土":"地在坐去","口":"足听中右后","人":"坐金","小":"少","日":"草","雨":"雪","中":"虫","天":"关","女":"奶妹妈姐","田":"鱼"},"samePic":{"川":"水","水":"川"},"motion":{"sky":"up","soil":"hop","ear":"sway","head":"sway","sit":"down","stand":"up","plane":"fly","insect":"fly","check":"grow","chest_open":"grow","chest_shut":"shrink","leftsign":"left","rightsign":"right","front":"grow","back":"shrink","girl":"sway","baby":"sway","earth":"spin","gold":"grow","river":"sway","snow":"down","grass":"sway","goaway":"shrink","heart":"grow","tooth":"hop","foot":"hop","talk":"sway","listen":"sway","grandma":"sway","middle":"hop","many":"hop","few":"hop"},"naiMilk":["奶，牛奶的奶！","milk"],"dict":["bad","bag","ban","bat","bed","beg","bet","bib","bid","big","bin","bit","bog","bop","box","bud","bug","bun","bus","but","cab","can","cap","cat","cob","cod","cog","cop","cot","cub","cup","cut","dad","dam","den","did","dig","dim","din","dip","dog","dot","dug","fad","fan","fat","fed","fen","fig","fin","fit","fix","fog","fox","fun","fur","gap","gas","get","gig","gum","gun","gut","had","ham","has","hat","hen","hid","him","hip","his","hit","hog","hop","hot","hug","hum","hut","jab","jam","jet","jig","job","jog","jot","jug","jut","kid","kin","kit","lab","lad","lag","lap","led","leg","let","lid","lip","lit","log","lot","mad","man","map","mat","men","met","mid","mix","mob","mom","mop","mud","mug","nab","nag","nap","net","nip","nod","not","nun","nut","pad","pal","pan","pat","peg","pen","pet","pig","pin","pit","pod","pop","pot","pub","pug","pun","pup","put","rag","ram","ran","rap","rat","red","rib","rid","rig","rim","rip","rob","rod","rot","rub","rug","rum","run","rut","sad","sag","sap","sat","set","sip","sit","sob","sod","sun","tab","tag","tan","tap","ten","tin","tip","top","tub","tug","van","vat","vet","wag","web","wet","wig","win","wit","yak","yam","yap","yet","zap","zip"],"all":[{"id":"ultra4","name":"天地岛","host":"ultraman","color":"#E23B3B","chars":"天地金土川","write":"天土"},{"id":"peppa4","name":"小医院","host":"peppa","color":"#FF8DB3","chars":"耳足头牙心","write":"耳头"},{"id":"pj4","name":"月光乐园","host":"catboy","color":"#3A5CC0","chars":"坐站飞说听","write":"坐飞"},{"id":"xiyou4","name":"水帘洞","host":"wukong","color":"#F5B324","chars":"对雪虫鱼草","write":"虫对"},{"id":"huluwa4","name":"葫芦洞","host":"gourd2","color":"#46C27A","chars":"多少开关去","write":"开关"},{"id":"paw4","name":"十字路口","host":"chase","color":"#E8554A","chars":"左右中前后","write":"左右"},{"id":"bluey4","name":"大家庭","host":"bluey","color":"#6BB9F2","chars":"爷奶妹女子","write":"女子"}],"have":["ant","apple","baby","back","ball","bamboo","banana","bat","bed","big","bird","book","box","bright","bun","bus","cap","car","cat","check","chest_open","chest_shut","chicken","cloud","come","cow","cup","dino","dog","door","door_open","down","dragon","drink","duck","ear","earth","eat","egg","elephant","eye","fan","few","field","fig","fire","fish","flower","follow","foot","fox","frog","front","fruit","girl","glove","goaway","gold","goose","grandma","grapes","grass","hand","hat","head","heart","hen","hop","horse","house","icecream","insect","jacket","jam","jet","jug","juice","key","kite","lamp","leaf","leftsign","light","lightning","lion","listen","log","look","man","many","map","mat","meat","melon","middle","milk","moon","moonlight","mop","mountain","mouth","mug","net","nose","notebook","nut","orange","owl","pan","pen","person","pig","pinwheel","plane","polarbear","queen","quilt","rabbit","rain","raincoat","rat","rest","rice","ricebowl","riceplant","rightsign","ring","river","rockinghorse","rug","ruler","run","schoolbag","sheep","shirt","sit","sky","small","snow","soil","soup","spoon","stand","star","stone","strawberry","sun","talk","tent","tincan","tooth","top","towel","train","tree","umbrella","unicorn","up","van","vase","volcano","walk","watch","water","web","whale","wig","wind","window","woods","xylophone","yogurt","yoyo","zebra","zip","@bajie","@bandit","@bingo","@bluey","@bumblebee","@captain","@catboy","@chase","@chilli","@daddy_pig","@dragon_horse","@gekko","@george","@gourd1","@gourd2","@gourd3","@gourd4","@gourd5","@gourd6","@gourd7","@grandpa","@hawkeye","@hulk","@ironman","@kaiju1","@kaiju2","@luna_girl","@marshall","@miles","@mummy_pig","@optimus","@owlette","@panther","@peppa","@pj_robot","@rocky","@romeo","@rubble","@ryder","@scorpion","@shaseng","@skye","@snake","@spiderman","@tangseng","@thor","@ultraman","@widow","@wukong","@zero","@zuma"]};
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

W4X.loaded();
