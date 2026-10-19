# 神笔海 (world 4) · how an island is built

The design is `docs/W4-DESIGN.md` (§5 conventions, §6 the 28 games, §11 the technical plan). Island ① 奥特曼·天地岛
(`src/w4/ultra4.js`) is the template: copy its shape.

## Files

| File | What | Who |
|---|---|---|
| `tools/content.py` (`W4`, `NOWRITE4`, `READ4`, `BOOKS4`, `SCROLLS4`, `WORDS4`, `SIGHT4`, `ESENT4`, `TF4`, `PLACE4*`, `WORDS_ZH4*`, `SENSE4`, `ENDPIC4`, `ORDER_PAIRS`, `KIND4*`, `BODY4`, `BRIDGE4`, `OPP4*`, `DICT4`, `LOOK4`, `HOLDS4`, `MOTION4` ...) | all the data of the seven islands | package 0 (island packages only read it; ask package 0 / the orchestrator for a change) |
| `src/w4/boot.js` | FIRST SCREEN (in `index.html`): `W4X.open()`, `W4X.known(G)` (§5.3), the brush entrance, the moon gate, the flag, the parent panel section, `W4Lazy` | package 0 |
| `src/w4/core.js` | LAZY: `W4X.Base`, `W4X.Write`, `w4Island()`, helpers, the scrolls | package 0 |
| `src/w4/ancient.js` | LAZY: `W4X.ANCIENT` (the ancient forms of ①-4) | package 0 |
| `src/w4/<island>.js` | LAZY: the island's three plays (`ultra4`, `peppa4`, `pj4`, `xiyou4`, `huluwa4`, `paw4`, `bluey4`) | its package |
| `tools/w4_live.json` | the islands that are live, e.g. `["ultra4", "peppa4"]` | the orchestrator |
| `tests/test_w4.py`, `tests/w4_levels.js` | the island tests (generic: they find the plays by themselves) | package 0 |

`tools/build.py` makes `assets/js/w4.js` = the tables (`W4D`, from content.py) + `core.js` + `ancient.js` + the files of the
LIVE islands, in island order. An island goes live only when it is in `w4_live.json`, its file exists and passes
`node --check`, and every island before it is live too. `index.html` gets the live islands' data (`ISL`, `ITEMS`,
`ORDER.w4`); islands not live yet are clouds on the map ("新岛还在建哦！").

## An island file

```js
/* ===== 神笔海 ② 佩奇 · 小医院 (peppa4): ... (docs/W4-DESIGN.md §6 ②) */
(() => {                                   // the whole file in one closure: NO top-level names
  const Touch = { rule: 'two-in-order', kind0: 'find', verb: '摸！', intro: '按顺序摸一摸！', gen(G, o) { ... }, ... };
  const OddOne = { rule: 'odd-one-out', ... };
  const Strokes = { rule: 'which-stroke-first', ... };
  w4Island('peppa4', [Touch, OddOne, Strokes]);     // [认字, 英文, 挑战]; 写字 is W4X.Write for every island
})();
```

`w4Island` registers `<id>:find`, `<id>:write`, `<id>:en`, `<id>:quiz` on top of `W4X.Base` (and the engine's `ZBase`),
with the island's friends (`ISL[id].cast`, host first) and backgrounds (`ISL[id].bgs`: new art or its fallback).

### A play: the members

| Member | |
|---|---|
| `rule` | its own rule, unique in the whole app (`tests/test_w4.py` 05) |
| (review) | a review question (an old character due) in a 认字 game: with the default `kind0` it is the engine's review card. Only a play that sets `kind0: 'find'` gets review questions in its own frame: `st.q = { k, answer, opts }` (five characters, no other field) - its `present` must cope (ultra4's moles fill in the level's settings) |
| `kind0`, `verb`, `intro` | kind (`find` / `en` / `quiz`), the banner word ("打！"), the intro line (<= 8 characters, spoken) |
| `gen(G, o)` | the question `{ k, answer, opts, item?, seq?, ...features }` from `o.level` 1-5. `k` decides "the same question". Use `poolOf(G, 'zh', false)` (the island's characters), `W4X.pick(G, pool)` (still-to-pass first, at most twice), `W4X.opts(G, level, answer, 5)` (the 认字 options by level), `W4X.known(G)` / `W4X.only(G, set)` / `W4X.knowsAll(G, text)` (§5.3: only what this child knows), `W4X.put(G, others, answer)` (the answer's place from a position bag), `W4D.*` (the tables). FIVE options (or more), exactly one right; a question with 2-3 possible answers asks two at once (TWO-ASK): `answer: 'all'`, `seq: [right of ask 1, right of ask 2]` - with five shared `opts` (seq[0] among them once), or with buttons of its own per ask: `opts: null`, `asks: [{ opts, answer }, ...]` (exactly one right each) and/or `chance` (random taps get every ask right) <= 1/4. A BUILD question (done step by step, e.g. the words of a sentence tapped in order): `build: 1`, `opts: null`, `words` (the steps) and/or `chance` <= 0.2 (without `chance`: 1/n! - at least 3 steps). Checked by `tests/test_options.py` 01 / 04 and `tests/w4_levels.js` |
| `hard(q)` | a number made of what makes this level harder (picture gone, look-alikes, old characters, more at once, less time ...): its mean over 300 questions must RISE at every level (`tests/w4_levels.js`) |
| `present(st)` | builds the question on `Stage` (`ZX.thing`, `K.cards`, `K.task`, `K.reg(st, 'card' + i, el, {})` for every tap target); says the question with `K.say(st, '...')` (sets `st.prompt` for the hints); `ZX.meet(st, k)` first for a character met for the first time (认字) |
| `place(st)` | positions for BOTH orientations (`K.L()` true = landscape; stage 1024 x 704 / 704 x 1024); every tap target >= 88 px (cards 130-170), on screen, on top - 1180x820, 820x1180, 1024x768 (`test_w4` 04) |
| `decor(G)` | where the friends stand (out of the way of the targets) |
| `onGesture(st, name, p)` | `tap` / `drop` / ...: `Session.submit(st, value)` once; `st.tapped = i` for the explanation; return `'ok'` (an answer step), `'free'` (no step), `false` (ignored) |
| `evaluate(st, ans)` | default `ans === st.q.answer` |
| `reveal(st)` | the right answer's little show (then the engine praises); `this.cheerAll(st)` |
| `feedback(st, ans)` | the ONE factual line: what he picked - `W4X.thisIs(k)` ("这是X") - never "错", no red, no fail sound |
| `explain(st, ans)` | 2-5 s, in beats (§5.4): 1 `W4X.exChosen(st, el, k)` (blue ring + its picture) then `await EX.wait(st, 650)`; 2 a demonstration: `await W4X.exBeat(st, () => {...})` (a wordless beat: it sets `st.stepDirty`); 3 `await W4X.exRight(st, el, k, [W4X.thatIs(k)])` (gold ring, picture, line). Every `EX.wait` / `EX.say` is a beat in 一步一步 mode; a function word / place word has no picture: pass `pic` `false` |
| `gestureHint(st, reteach)` | the 2nd hint: real help (no star after it: nothing to set) or only the question again (`softHint: true` on the play: the star stays). `reteach`: only show how to play |
| `next(st, strat)` | for the tests: the next gesture of a right (`'right'`) or wrong (`'wrong'`) answer, e.g. `{ g: 'tap', p: { id: 'card2' } }`; `W4X.WAIT` when there is nothing to tap yet (a play whose options come and go: its `onGesture` takes `'wait'` and moves on) |
| (state) | keep a play's own state on `st` under names of its own - NEVER `st.step` (the engine's 一步一步 flag: `EX.wait` / `EX.say` pause on it), nor `st.stepDirty` / `stepEls` / `ff` / `ex` / `phase` / `submitted` / `explaining` |
| `snap(st)`, `workEls(st)`, `iconNode()` | test snapshot; what the hints make glow; the island panel's icon (on a light round backing) |
| `itemOf(st)` / `itemsOf(st)` | the memory: the character asked about (`W4X.own(st, k)` when a card was read aloud: no evidence) |

"Read, not said" cards (§5.2): `W4X.readCard(st, text, h)` + `W4X.placeRead(st, cx, y)`; `W4X.Base.onGesture` already
makes a tap on it say it (`W4X.peek`: that question earns no star, `test_w4` 07).

Teach mode (教一教), the explain setting (关 / 自动 / 一步一步), the hints, the stars, the memory and review are the engine's:
a play gets them by following the members above.

## Voice

Every Chinese line <= 8 characters and recorded (`Edge TTS`, `tools/voice_bank.py`).
* Lines from the DATA (characters, words, sentences, books, scrolls, "这是X", "这个是X", "哪个是X？", "摘X！", the sense
  sentences ...) are already listed by `tools/voice_lines.py` (`w4_lines()`), for all seven islands.
* Lines in a play's code are found when written as literals in `Voice.say('…')`, `Voice.sayNow('…')`, `K.say(st, '…')`,
  `EX.say(st, ['…', '…'])`, `intro: '…'`, or a literal ending in ！/？. A line said through a variable: list it once in
  `W4X.lines(['…', '…'])` at the top of the file.
* Island agents do NOT run `voice_bank.py`: run `python tools/voice_lines.py`, and tell the orchestrator the new lines
  (`raw/voice_lines.json`); the orchestrator records them. `test_w4` 11 lists every line said without a recording.

## Build, test one island

```
python tools/build.py                       # index.html + assets/js/w4.js (your island only if it is in tools/w4_live.json)
W4_ONLY=peppa4 python tests/test_w4.py      # one island (W4_PARTS=01,04 for some parts)
```
To try an island before it is live, add its id to `tools/w4_live.json` locally (the islands before it must be live too).
Several agents share one working tree: `python tools/build.py --live=ultra4,peppa4 --tag=a` writes a private snapshot
(`index_a.html` + `assets/js/w4_a.js`, never released) that nobody else's build overwrites; test it with
`KM_PAGE=index_a.html W4_ONLY=peppa4 python tests/test_w4.py` (every suite honours `KM_PAGE`). Delete the snapshot afterwards.
Before an island goes live: `test_w4` for it, `tests/test_options.py`, `tests/test_layout.py`, `tests/test_w4open.py` and
`bash tests/run_all.sh` pass; its lines are recorded; its backgrounds are new or checked fallbacks.

## ⑧ 复仇者·英雄训练场 (`avengers4`) and ⑨ 变形金刚·汽车人工厂 (`robot4`) - docs/W4-DESIGN.md §12

New since the seven islands (package 0 of ⑧⑨, 2026-10-19). Everything else above holds unchanged.

**Files.** `src/w4/avengers4.js` (package ⑧: 圈字 `char-in-sentence`, 拍节拍 `count-the-beats`, 排故事 `story-order`) and
`src/w4/robot4.js` (package ⑨: 跟住它 `track-after-transform`, 拼句子 `build-the-sentence`, 加一笔 `add-one-stroke`), each
`w4Island(id, [find, en, quiz, wx])`. Not in `tools/w4_live.json` until the island is done: try it with
`python tools/build.py --live=ultra4,peppa4,pj4,xiyou4,huluwa4,paw4,bluey4,avengers4 --tag=a8` (⑨ also needs `avengers4`).

**`wx` (optional, 4th):** members laid over `W4X.Write` for that island's 写字 only - the finishing shows of §12.5 (好: 女 and 子
apart then together, the thumbs-up hops; 力: Hulk flexes; 工: the toolbox; 厂: the gear turns). E.g.
`{ async reveal(st) { await WriteBase.reveal.call(this, st); if (st.q.answer === '好') { ... } } }`. Never edit `W4X.Write`
(the writing modes own it).

**Data** (`tools/content.py`, the ⑧⑨ block; in the lazy file as `W4D.*`; package 0 changes it, the islands only read):

| `W4D.` | content.py | What |
|---|---|---|
| `sent8` | `SENT8` | ⑧-1: `[k, sentence, word]` x 40 - k is in it exactly once; `word` = the two-character word holding k (level 5) or `''`. Any character that is in a sentence once may be asked there (a review). Ask a sentence only when `W4X.knowsAll(G, s)`. Look-alikes: `LOOK[k]` (joined at init) |
| `story8` | `STORY8` | ⑧-4: `{ s: [3-4 cards], pic: [a scene a card], why: ['', reason, ...], think: 0/1 }` x 24 - exactly ONE order (each card can only happen after the one before; `tools/check_w4x.py` counts the orders). `think` = levels 3 / 5. Ask a story only when every card is known |
| `beats8` | `BEATS8` | ⑧-3: `[word, picture, 'ba-na-na']` x 42 (1-4 beats); `beats8ph`: `[phrase, 'big-ba-na-na', scene]` x 15 (level 5) |
| `esent9` | `ESENT9` | ⑨-3: `[sentence, scene, extra]` x 36 (3-5 words, one possible order; the end mark is the last, fixed cell); `extra` = level 5's card that fits no slot. `sight9`: the 8 new sight words |
| `add1` | (from `STROKE_FAMILIES`) | ⑨-4's questions: `{ a, b, keep, add, say }` - B = A + the stroke `add` (an index into B's strokes: the gold stroke of the explanation, the dashed line of the 2nd hint); `keep` = where A's strokes are in B; `say` = the writing modes' line (人加一横变成大！) |
| `near1` | (computed) | `['AB', ...]` every pair that is - or could be taken for - "A + one stroke = B" among ALL taught characters: never offer B' with `near1.includes(a + B')` as a wrong box (nor A' with `near1.includes(A' + b)` in the reverse question). That makes exactly one right box |
| `read` / `scrolls` | `READ4` / `SCROLLS4` | + 6 sentences (王坐下。…), + 《好朋友》 (r8, after `avengers4`), 《小汽车》 (r9, after `robot4`) |

Pictures: 好 `thumbsup`, 力 `@hulk`, 出 `mouseout`, 王 `crown`, 高 `tower`, 变 `change` (composed: a yellow car -> Bumblebee),
能 `cube`, 工 `toolbox`, 厂 `factory`, 路 `road`; also `yellowcar`, `jump`, and from 点点岛 `pumpkin turtle carrot watermelon
helicopter donut tomato sandwich`. Backgrounds `avengers4_find/_write/_abc/_quiz`, `robot4_*` (each empty where its game draws).
`SAMEPIC`: 变 / 车 and 好 / 手 are never offered together; `HOLDS`: 女 子 -> 好, 工 -> 左 红, 口 -> 高 路, 土 -> 王, 足 -> 路, 月 -> 能.

**`W4X.slots(st, o)`** (core.js) - the cards-into-slots of ⑧-4 and ⑨-3, the same for both. The play draws the board, the
slots and the cards (`ZX.thing`); the helper registers the cards (`card0`...) and moves them:
* tap a card below: it flies into the first empty slot; tap a card in a slot: back down; drag: into any slot (a card already
  there goes back down; dropped elsewhere it springs back); HOLD a card 0.65 s: `o.hear(i)` (say it; that question earns no
  star - "卡不念"); every slot full: `o.full(order)` (`order[s]` = the card in slot s): submit it.
* `const S = st.slots = W4X.slots(st, { cards, n, slot: s => ({x, y, w, h}), tray: i => ({x, y, w, h}), full(order) {...}, hear(i) {...}, look(i, s) {...} })`
  (stage px, current orientation; `look`: restyle a card in a slot `s >= 0` / below `-1`).
* `place(st)`: `S.layout()`; `onGesture`: `const r = S.gesture(name, p); if (r) return r;`; explain: `await S.back(i, ms)`,
  `await S.put(i, s, ms)`; `next(st, strat)`: `return S.next(want, strat)` (`want[s]` = the right card of slot s).
* Hand it in as a BUILD question (`build: 1`, `opts: null`, `chance` = 1/n!; with an extra card 1/(6·5·4·3·2)).

**Lines recorded by package 0** (`tools/voice_lines.py` `w4x_lines()`): 圈X！, 找X！, X在哪辆车里？ for every character; the 40
sentences; the story cards; every beat word and phrase, and the same slowly: `Voice.say('~' + word)` (the '~' is not said);
the ESENT9 sentences and their words (as written and lower case); "A加一笔是B" / "B减一笔是A" for every `add1` pair and its
`say`; 神笔海有新岛！ / 大家都到齐啦！. Your own literals (拍了两下, 这一句在后面, 变形！ ...) are found in your file as before:
run `python tools/voice_lines.py` and send the new lines to the orchestrator.

**Map** (package 0): 神笔海 has nine places (`MAPPOS4`, islands at 0.85); ⑧⑨ not live are clouds with Spider-Man's /
Optimus's shadow ("新岛还在建哦！"); the temple fair stays (`partial` looks at the first seven only). Old saves: ⑦ flagged ->
⑧ opens with its cloud show (`Store.s.w4x`), the brush on other seas says "神笔海有新岛！" once; `fin.w4x`: the finale once
more with the new friends for a child who saw it before ⑧⑨.

**Also new (review W4R1N, 2026-10-19):**
* `W4X.picWords(list)` - of WORDS3 / WORDS4 entries `[word, picture, clear]` only those whose picture a 4-year-old names by
  that word (clear = 1). A play that shows a word's picture WITHOUT saying it must take its words from here (bun = 包子).
* The parent panel's 神笔海 section is lazy (`W4X.parent2` in core.js, the lesson table `W4D.lessons`); nothing of it on the
  first screen.
* `tools/build.py` drops the whole-line `/* */` comments of the FIRST-SCREEN script (`tools/jsstrip.py`, only if the result
  passes `node --check`); the sources keep them, the lazy files too.
* `tools/voice_lines.py` also finds the lines in an array given to any call (`W4X.exRight(st, e, k, ['...'])`, `EX.cards(...,
  { lines: [...] })`).
* Data checks: `python tools/check_w4x.py` (⑧⑨'s tables, SENSE4's "guess without reading" baseline via `tools/sense_guess.py`).
