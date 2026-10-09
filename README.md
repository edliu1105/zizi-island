# 字字岛 · ZiZi Island

给 4 岁孩子的 iPad 认字写字 app（PWA，离线可用）。网址：<https://edliu1105.github.io/zizi-island/>

- **认汉字**：从象形字（人口目手、日月云木、山水火石……）开始，第二世界学虚词、生活用品和合体字，第三世界学数字、颜色、家人和动作，能读真正的句子和故事书。
- **写汉字**：在田字格里按笔顺写。毛笔示范，绿点和箭头带路，写完字会"活过来"。
- **学字母**：大写 A–Z、小写 a–z，在四线三格里写，每个字母配一个常用东西的英文单词；第三世界玩三个字母的单词：押韵、补元音、首字母、自己读、我看见。
- **进度**：三个世界、21 个岛、84 个小游戏。每个游戏 5 颗星，4 个游戏插一面旗，7 面旗开下一个世界。
- **字宝盒**：学会的字和字母都收在这里，随时可以再写。

## 文件

| 位置 | 内容 |
|---|---|
| `index.html` | 应用本体，由 `tools/build.py` 拼成 |
| `src/` | 源代码：引擎（继承点点岛）、字母、写字、应用层、游戏（`games.js` 第一世界、`games2.js` 第二世界、`v2.js` 句子岛和记忆复习、`w3.js` 彩虹海的 5 个英雄岛） |
| `assets/` | 图片、语音，以及笔顺数据 `data/hanzi.json`（Arphic 公共许可，见 `assets/data/LICENSE-hanzi.txt`） |
| `tools/content.py` | 全部内容的唯一来源：岛、字、字母、单词、录音句子、要生成的图 |
| `docs/DESIGN.md` | 设计与理由 |
| `docs/DELIVERY.md` | 交付说明 |

## 构建与测试

```bash
python tools/build.py
```

```bash
python tools/voice_lines.py
```

```bash
python tools/voice_bank.py
```

```bash
python tools/gen_sw_list.py
```

```bash
python tests/test_core.py
```

```bash
python tests/test_pointer.py
```

```bash
python tests/test_layout.py
```

```bash
python tests/test_voiceflow.py
```
