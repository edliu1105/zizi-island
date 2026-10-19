# -*- coding: utf-8 -*-
"""The first screen without its whole-line /* */ comments (W4R1N-06, the orchestrator 2026-10-19: about 28 KB gzip of the
180 KB budget). Only the BUILT page drops them - src/ keeps every comment. tools/build.py calls strip(); the result must pass
`node --check` or the page keeps its comments.
A small tokenizer finds the comments: it knows '' and "" strings, template literals with their ${...} code (nested), regular
expression literals (a / after an operator, a bracket or a keyword such as return) and // comments, so a "/*" inside any of
them is never taken for a comment. A comment is dropped only when nothing but spaces is before it on its first line and after
it on its last line; a line inside a template literal is never touched (a comment there is text, not a comment).
usage: python tools/jsstrip.py file.js   (prints what it would drop)"""
import re, sys

KW = {'return', 'typeof', 'case', 'in', 'of', 'new', 'delete', 'void', 'throw', 'instanceof', 'yield', 'await', 'else', 'do'}
REGEX_AFTER = set('(,=:[!&|?{};+-*%<>~^') | {'', 'kw'}
WORD = re.compile(r'[A-Za-z0-9_$\u0080-￿]')


def spans(js):
    """(start, end) of every /* */ comment that is code-level (not inside a string, template literal or regular expression)"""
    out, i, n = [], 0, len(js)
    stack, prev = [], ''          # stack: '`' inside a template literal's text, '$' inside its ${ } code, '{' a brace in that code
    while i < n:
        c = js[i]
        if stack and stack[-1] == '`':
            if c == '\\':
                i += 2
            elif c == '`':
                stack.pop(); prev = ')'; i += 1
            elif js.startswith('${', i):
                stack.append('$'); prev = '('; i += 2
            else:
                i += 1
            continue
        if c in ' \t\r\n':
            i += 1
        elif js.startswith('/*', i):
            e = js.find('*/', i + 2)
            e = n if e < 0 else e + 2
            out.append((i, e)); i = e
        elif js.startswith('//', i):
            e = js.find('\n', i)
            i = n if e < 0 else e
        elif c in '\'"':
            k = i + 1
            while k < n and js[k] != c and js[k] != '\n':
                k += 2 if js[k] == '\\' else 1
            i = k + 1; prev = ')'
        elif c == '`':
            stack.append('`'); i += 1
        elif c == '/' and prev in REGEX_AFTER:
            k, cls = i + 1, False
            while k < n and js[k] != '\n':
                if js[k] == '\\':
                    k += 2; continue
                if js[k] == '[':
                    cls = True
                elif js[k] == ']':
                    cls = False
                elif js[k] == '/' and not cls:
                    break
                k += 1
            k += 1
            while k < n and js[k].isalpha():
                k += 1
            i = k; prev = ')'
        elif c == '{':
            if stack:
                stack.append('{')
            prev = '{'; i += 1
        elif c == '}':
            if stack and stack[-1] == '{':
                stack.pop(); prev = '}'
            elif stack and stack[-1] == '$':
                stack.pop()                                  # back into the template literal's text
            else:
                prev = '}'
            i += 1
        elif WORD.match(c):
            k = i
            while k < n and WORD.match(js[k]):
                k += 1
            prev = 'kw' if js[i:k] in KW else ')'
            i = k
        else:
            prev = ')' if c in ')].' and c != '.' else c
            if c == '.':
                prev = '.'
            i += 1
    return out


def strip(js):
    """js without its whole-line comments, and the number of comments dropped"""
    parts, last, dropped = [], 0, 0
    for a, e in spans(js):
        ls = js.rfind('\n', 0, a) + 1
        le = js.find('\n', e)
        le = len(js) if le < 0 else le
        if ls < last or js[ls:a].strip() or js[e:le].strip():
            continue
        cut = js[ls:min(len(js), le + 1)]
        assert re.fullmatch(r'[ \t]*/\*.*?\*/[ \t\r]*\n?', cut, re.S) and cut.count('*/') == 1, cut[:120]
        parts.append(js[last:ls]); last = min(len(js), le + 1); dropped += 1
    parts.append(js[last:])
    return ''.join(parts), dropped


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    src = open(sys.argv[1], encoding='utf-8').read()
    out, d = strip(src)
    print(d, 'comments,', len(src) - len(out), 'bytes')
