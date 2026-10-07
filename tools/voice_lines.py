# -*- coding: utf-8 -*-
"""Every sentence the app can say -> raw/voice_lines.json (then tools/voice_bank.py records what is new).
Two sources: the literal sentences in src/*.js (said through Voice.say / sayNow / K.say, the line tables, intro / hi /
praise strings) and the sentences made from data (every character's line, "哪个是X？", letters, words, ...).
Chinese lines must stay within 8 characters (the client's rule). usage: python tools/voice_lines.py"""
import os, re, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import W1, W2, CVC, WORDS2
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十']
CNQ = lambda n: '两' if n == 2 else CN[n]
# said through a variable or a ternary the scan does not see
EXTRA = ['庆典开始啦！', '惊喜来啦！', '星光海到啦！', '汉字', '玩得真开心！', '我们去字字岛吧！', 'Hello!']


def literals():
    out = set()
    for f in ('app.js', 'games.js', 'games2.js', 'writer.js', 'engine.js'):
        s = open(os.path.join(ROOT, 'src', f), encoding='utf-8').read()
        for m in re.finditer(r"(?:Voice\.say|Voice\.sayNow|K\.say\(st,|W2X\.say|say)\(\s*'([^'\\]+)'", s):
            out.add(m.group(1))
        for m in re.finditer(r"K\.say\(st,\s*'([^'\\]+)'\)", s):
            out.add(m.group(1))
        for m in re.finditer(r"(?:intro|hi|line|bye):\s*'([^'\\]+)'", s):
            out.add(m.group(1))
        for name in ('PRAISE', 'AGAIN', 'CHEER'):
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
    # drop code-ish strings (css, paths) and words of the parent panel that are only shown
    junk = {'\u5173', '\u5f00', '\u5f00\u653e', '\u5df2\u63d2\u65d7', '\u54ea\u4e2a\u662f', '\u627e\u5230', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'flipY', 'flipX', 'ok', 'rot'}
    return {t for t in out if re.search(r'[\u4e00-\u9fff]', t) and not re.search(r'[#(/]|rgba|px|assets', t) and '+' not in t and t not in junk}


def data_lines():
    out = set()
    for lst in (W1, W2):
        for d in lst:
            out.add(d['hi'])
            for c, line, obj, en in d['chars']:
                out |= {line, '哪个是' + c + '？', c + '在哪里？', en}
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
    w = open(os.path.join(ROOT, 'src', 'writer.js'), encoding='utf-8').read()
    for v in re.findall(r":\s*'([^']+)'", re.search(r"const STROKE_NAMES = \{(.+?)\n\};", w, re.S).group(1)):
        out |= {'这是' + nm for nm in v.split()}            # the missing-stroke challenge names what was picked
    for n in range(1, 15):
        out.add('插上旗子啦！' if n == 1 else CNQ(n) + '面旗子啦！')
    return out


def main():
    lines = sorted(t for t in (literals() | data_lines()) if t)
    long_zh = [t for t in lines if re.search(r'[\u4e00-\u9fff]', t) and len(t) > 8]
    json.dump(lines, open(os.path.join(ROOT, 'raw', 'voice_lines.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(len(lines), 'lines;', sum(1 for t in lines if not re.search(r'[\u4e00-\u9fff]', t)), 'English')
    print('longer than 8:', long_zh)


if __name__ == '__main__':
    main()
