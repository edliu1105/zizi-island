# -*- coding: utf-8 -*-
"""Every sentence the app can say -> raw/voice_lines.json (then tools/voice_bank.py records what is new).
Two sources: the literal sentences in src/*.js (said through Voice.say / sayNow / K.say, the line tables, intro / hi /
praise strings) and the sentences made from data (every character's line, "哪个是X？", letters, words, ...).
Chinese lines must stay within 8 characters (the client's rule). usage: python tools/voice_lines.py"""
import os, re, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import W1, W2, W3, CVC, WORDS2, FW_SENTS, FW_SENTS3, READ, BOOKS, WORDS3
import content as C4
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十']
CNQ = lambda n: '两' if n == 2 else CN[n]
# said through a variable or a ternary the scan does not see
EXTRA = ['庆典开始啦！', '惊喜来啦！', '星光海到啦！', '汉字', '玩得真开心！', '我们去字字岛吧！', 'Hello!']
# the explain step after a wrong answer (docs/OPTIONS-EXPLAIN-SPEC.md): its own short lines (said from arrays / variables)
EXTRA += ['对的是这个', '对的是这张', '看，是这样', '它照镜子啦', '它躺下啦', '它翻跟头啦', '哪张图是它开头？']      # 哪个写对了: a nested ternary the scan misses
EXTRA += ['这是师父']                                                        # 全家福's guest at level 1 who has no kin word (src/w3.js FAM_GUESTS)
EXTRA += ['放不进去']                                                        # 缺了一笔: the chosen stroke does not go into the gap (OX1)


W4FILES = sorted('w4/' + f for f in os.listdir(os.path.join(ROOT, 'src', 'w4')) if f.endswith('.js')) if os.path.isdir(os.path.join(ROOT, 'src', 'w4')) else []


def literals():
    out = set()
    for f in ['app.js', 'games.js', 'games2.js', 'writer.js', 'engine.js', 'v2.js', 'v2b.js', 'w3.js'] + W4FILES:
        s = open(os.path.join(ROOT, 'src', f), encoding='utf-8').read()
        # 神笔海 (src/w4/*.js, README): the lines of an explanation EX.say(st, ['..', '..']) and lines said through variables,
        # listed in W4X.lines(['..', ..])
        for m in re.finditer(r"(?:EX\.say\(st,\s*|W4X\.lines\()\[([^\]]*)\]", s):
            out |= set(re.findall(r"'([^'\\]+)'", m.group(1)))
        for m in re.finditer(r"(?:Voice\.say|Voice\.sayNow|K\.say\(st,|W2X\.say|say)\(\s*'([^'\\]+)'", s):
            out.add(m.group(1))
        for m in re.finditer(r"K\.say\(st,\s*'([^'\\]+)'\)", s):
            out.add(m.group(1))
        for m in re.finditer(r"(?:intro|hi|line|bye|again):\s*'([^'\\]+)'", s):
            out.add(m.group(1))
        for name in ('PRAISE', 'AGAIN', 'CHEER', 'NEXTQ'):
            m = re.search(r'const ' + name + r" = \[([^\]]+)\]", s)
            if m:
                out |= set(re.findall(r"'([^']+)'", m.group(1)))
        m = re.search(r"const SLIP = \{([^}]+)\}", s)
        if m:
            out |= set(re.findall(r":\s*'([^']+)'", m.group(1)))
        m = re.search(r"const STROKE_NAMES = \{(.+?)\n\};", s, re.S)
        if m:
            for v in re.findall(r":\s*'([^']+)'", m.group(1)):
                out |= set(v.split())
        for m in re.finditer(r"praise:\s*\[([^\]]+)\]", s):
            out |= set(re.findall(r"'([^']+)'", m.group(1)))
        for m in re.finditer(r"\['写得真漂亮！'[^\]]*\]", s):
            out |= set(re.findall(r"'([^']+)'", m.group(0)))
        for m in re.finditer(r"'([^'\\]{1,9})'\s*:\s*'([^'\\]{1,9})'", s):     # ternaries like a ? '..' : '..'
            pass
        for m in re.finditer(r"\?\s*'([^'\\]+)'\s*:\s*'([^'\\]+)'", s):
            out |= {m.group(1), m.group(2)}
        for m in re.finditer(r"'([^'\\\n]{2,14}[！？])'", s):            # every spoken-looking literal: openPanel lines, nested ternaries (V2R1-07)
            out.add(m.group(1))
    # drop code-ish strings (css, paths) and words of the parent panel that are only shown
    junk = {'\u5173', '\u5f00', '\u5f00\u653e', '\u5df2\u63d2\u65d7', '\u54ea\u4e2a\u662f', '\u627e\u5230', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'flipY', 'flipX', 'ok', 'rot'}
    return {t for t in out if re.search(r'[\u4e00-\u9fff]', t) and not re.search(r'[#(/（]|rgba|px|assets|四关已过', t) and '+' not in t and t not in junk}


def data_lines():
    out = set()
    for lst in (W1, W2, W3):
        for d in lst:
            out.add(d['hi'])
            for c, line, obj, en in d['chars']:
                out |= {line, '哪个是' + c + '？', c + '在哪里？'} | ({en} if en else set())
            for l, word, obj in d['letters']:
                out |= {'%s, %s!' % (l.upper(), word), word}
    for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
        out.add(c)
    for w, _ in CVC:
        out.add(w)
    for a, b, _ in WORDS2:
        out |= {a + b + '缺哪个字？', a + b + '！'}
    parts = {'从': ('人', '人'), '休': ('人', '木'), '林': ('木', '木'), '明': ('日', '月')}
    for k, (a, b) in parts.items():
        out |= {a + '加' + b + '是什么？', k + '是' + a + '加什么？'}
    for comp in '木口日月人火田':
        out.add('哪个字里有' + comp + '？')
    out |= set(EXTRA)
    for k, lst in FW_SENTS.items():
        out |= {t for t, _ in lst}
    out |= {r[0] for r in READ}
    for b in BOOKS:
        out.add(b["title"]); out |= {t for t, _ in b["pages"]}
    w = open(os.path.join(ROOT, 'src', 'writer.js'), encoding='utf-8').read()
    for v in re.findall(r":\s*'([^']+)'", re.search(r"const STROKE_NAMES = \{(.+?)\n\};", w, re.S).group(1)):
        out |= {'这是' + nm for nm in v.split()}            # the missing-stroke challenge names what was picked
    for n in range(1, 30):                                   # every flag of the installed seas (21 islands now)
        out.add('插上旗子啦！' if n == 1 else CNQ(n) + '面旗子啦！')
    # world 3, phase 2 (src/w3.js): lines made from data
    out |= {w for w, _, _ in WORDS3}
    for k, lst in FW_SENTS3.items():
        out |= {t for t, _ in lst}
    zh = [c for lst in (W1, W2, W3) for d in lst if not d.get('fw') for c, _, _, _ in d['chars']]
    out |= {'砸碎所有的' + c + '！' for c in zh}                          # 绿巨人 · 砸石头 (its review questions too)
    out |= {'亮了' + CNQ(n) + '盏灯' for n in range(1, 11)}               # 雷神 · 十格灯: what was lit
    for c in '紫棕黑':                                                    # 涂颜色: the pots that are none of the five (levels 1-2)
        out.add('这是' + c + '色')
    for c in '红黄蓝绿白':                                                # 黑豹 · 涂颜色
        out.add('这是' + c + '色')
        for nn in '衣云叶花':
            out |= {c + nn, c + nn + '！'}
    kin = ['爸爸', '妈妈', '哥哥', '姐姐', '弟弟', '爷爷', '妹妹']        # 黑寡妇 · 全家福
    out |= set(kin) | {'这是' + k for k in kin}
    for r in ('他的姐姐', '他的妈妈', '他的爸爸', '他的哥哥', '他的弟弟', '弟弟的姐姐', '弟弟的妈妈', '弟弟的爸爸', '姐姐的弟弟', '弟弟的哥哥', '哥哥的弟弟'):
        out |= {r, r + '！'}
    return out


def w4_lines():
    """神笔海 (docs/W4-DESIGN.md §11.4): every line its data makes - for all seven islands at once, so an island's lines are
    recorded before it goes live"""
    out = set()
    zh_all = [c for lst in (W1, W2, W3, C4.W4) for d in lst for c, _, _, _ in d['chars']]
    for d in C4.W4:
        out.add(d['hi'])
        for c, line, obj, en in d['chars']:
            out |= {line, '哪个是' + c + '？', c + '在哪里？', '这是' + c, '这个是' + c} | ({en} if en else set())
    out.add(C4.NAI_MILK[0])
    for c in zh_all:                                   # every character alone (②-1 says them one after another; taps)
        out |= {c, '这是' + c, '这个是' + c}
    out |= {'打' + c + '！' for c in zh_all}             # ① 地鼠 (kind0 'find'): its own characters and every one a review can ask
    eng = set(w for w, _, _ in C4.WORDS4) | set(C4.SIGHT4) | set(C4.DICT4) | set(w for w, _, _ in WORDS3)
    out |= eng | {w + '!' for w in eng}
    for t, _ in C4.ESENT4:
        out.add(t); out |= set(re.findall(r"[A-Za-z]+", t))
    for d in C4.TF4:
        for t, _ in d['s']:
            out.add(t); out |= set(re.findall(r"[A-Za-z]+", t))
    out |= set(C4.PLACE4)
    for t in C4.PLACE4:
        out |= set(re.findall(r"[A-Za-z]+", t))
    for w, _ in C4.WORDS_ZH4 + C4.WORDS_ZH4_3:
        out |= {w, '摘' + w + '！', '这是' + w}
    for s in C4.SENSE4:
        out.add(s['pre'])                                # the first half is a card to read: a tap says it
        out.add(s['pre'] + s['ok'])
        out |= {s['pre'] + x.replace('。', '？') for x in s['no']}
    out |= set(C4.KIND4_LINE.values()) | set(C4.KIND4)
    out |= {a + '用' + b for a, b, _ in C4.BODY4}
    out |= {'就是' + z for _, z, _ in C4.BRIDGE4}
    out |= {a + '，' + b + '！' for a, b in C4.OPP4} | {a + '，' + b + '！' for a, b in C4.OPP4_WORDS}
    out |= set(C4.ORDER_RULES) | {'这一笔后写', '先写这一笔', '先写哪一笔？'}
    out |= {r[0] for r in C4.READ4}
    for b in C4.BOOKS4:
        out.add(b['title']); out |= {t for t, _ in b['pages']}
    show = ''
    for s in C4.SCROLLS4:
        out.add(s['title']); out |= set(s['lines']); show += s['title'] + ''.join(s['lines'])
    out |= set(C4.SCROLL_KIND.values())
    for b in C4.BOOKS4:
        show += b['title'] + ''.join(t for t, _ in b['pages'])
    out |= {c for c in show if re.match(r'[一-鿿]', c)}     # a tap on any character of a scroll / book says it
    # the map and the gate (§11.4)
    out |= {'新世界开啦！', '神笔海到啦！', '去神笔海！', '回到星光海！', '回到彩虹海！', '回到晨光海！', '神笔大庙会！', '新岛还在建哦！', '等一下哦'}
    return out


def main():
    lines = sorted(t for t in (literals() | data_lines() | w4_lines()) if t)
    long_zh = [t for t in lines if re.search(r'[\u4e00-\u9fff]', t) and len(t) > 8]
    json.dump(lines, open(os.path.join(ROOT, 'raw', 'voice_lines.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(len(lines), 'lines;', sum(1 for t in lines if not re.search(r'[\u4e00-\u9fff]', t)), 'English')
    print('longer than 8:', long_zh)


if __name__ == '__main__':
    main()
