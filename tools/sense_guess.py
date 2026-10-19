# -*- coding: utf-8 -*-
"""哪句说得通 (SENSE4, ⑦-4) must be READ (W4R1N-03): a child who does not read the first half - who only looks at the five
endings - must not find the right one much more often than by chance (1 in 5). This plays three such guessers on SENSE4, each
trained on all the OTHER questions (leave one out) and tested on the one left out:
  ending  the ending that was right most often elsewhere (its whole text)
  chars   the ending whose characters were in right endings most often elsewhere (牙 米 月 ... never right: that was the old flaw)
  never   leave out every ending that was never right elsewhere, pick one of the others
  rarest / rare chars   the same two the other way round (the ending right LEAST often elsewhere)
  odd one the ending that shares the fewest characters with the other four
Each must stay <= 30% (tools/check_w4x.py and tests/test_w4open.py run it). Also: every ending's own picture (ENDPIC4), every
character taught, harmless (the endings are read by the reviewers: tools/content.py lists why each wrong one cannot be).
usage: python tools/sense_guess.py"""
import os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
HAN = re.compile(r'[一-鿿]')


def guessers(S):
    """S: [(pre, ok, [no x4])] -> {name: expected share of right guesses}"""
    out = {'ending': 0.0, 'chars': 0.0, 'never': 0.0, 'rarest': 0.0, 'rare chars': 0.0, 'odd one': 0.0}
    for i, (pre, ok, no) in enumerate(S):
        rest = [x for j, x in enumerate(S) if j != i]
        seen, right, cs, cr = {}, {}, {}, {}
        for _, ok2, no2 in rest:
            for e in [ok2] + no2:
                seen[e] = seen.get(e, 0) + 1
                for c in set(HAN.findall(e)):
                    cs[c] = cs.get(c, 0) + 1
            right[ok2] = right.get(ok2, 0) + 1
            for c in set(HAN.findall(ok2)):
                cr[c] = cr.get(c, 0) + 1
        opts = [ok] + no

        def best(score):
            sc = [score(e) for e in opts]
            m = max(sc)
            top = [e for e, s in zip(opts, sc) if abs(s - m) < 1e-12]
            return (1.0 / len(top)) if ok in top else 0.0
        out['ending'] += best(lambda e: (right.get(e, 0) + 0.2) / (seen.get(e, 0) + 1.0))
        out['chars'] += best(lambda e: sum((cr.get(c, 0) + 0.2) / (cs.get(c, 0) + 1.0) for c in HAN.findall(e)) / max(1, len(HAN.findall(e))))
        live = [e for e in opts if right.get(e, 0) > 0] or opts
        out['never'] += (1.0 / len(live)) if ok in live else 0.0
        # the other way round (a wrong ending set chosen to beat the guessers above must not give the right one away)
        out['rarest'] += best(lambda e: -(right.get(e, 0) + 0.2) / (seen.get(e, 0) + 1.0))
        out['rare chars'] += best(lambda e: -sum((cr.get(c, 0) + 0.2) / (cs.get(c, 0) + 1.0) for c in HAN.findall(e)) / max(1, len(HAN.findall(e))))
        # the ending least like the other four (fewest characters shared with them)
        out['odd one'] += best(lambda e: -sum(len(set(HAN.findall(e)) & set(HAN.findall(f))) for f in opts if f != e))
    return {k: v / len(S) for k, v in out.items()}


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    import content as C
    S = [(s['pre'], s['ok'], s['no']) for s in C.SENSE4]
    g = guessers(S)
    print(len(S), 'questions; a guesser that does not read the first half is right:', {k: '%d%%' % round(100 * v) for k, v in g.items()}, '(chance 20%, limit 30%)')
    sys.exit(1 if max(g.values()) > 0.30 else 0)
