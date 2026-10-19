/* 神笔海: every play is harder at every level (client: "L1-L5 一级比一级难", docs/W4-DESIGN.md §5.2). Each play scores its own
   question with hard(q) (src/w4/README.md: a number made of what its level changes - the picture gone, look-alikes, old
   characters, more at once, less time, longer words, crossings ...); here 300 questions a level, the mean must rise at every step.
   Also: five options (or more) with exactly one right one, or the two-ask form (q.seq). Evaluated in the page by tests/test_w4.py
   (window.__W4ONLY: the islands to look at). Returns { game: { lv: [means], ok, opts: [problems] } } */
(() => {
  const out = {}, only = window.__W4ONLY || ORDER.w4;
  only.filter(id => ORDER.w4.includes(id)).forEach(isl => ISL[isl].games.forEach(id => {
    const game = GAMES[id]; if (!game || game.kind0 === 'write') return;
    const means = [], probs = [];
    for (let lv = 1; lv <= 5; lv++) {
      const G = { world: isl, W: ISL[isl], id, rng: RNG(700 + lv), bags: {}, needPass: [], asked: [], ws: { lastKey: '' }, game, level: lv, round: 0 };
      let sum = 0, n = 0;
      for (let i = 0; i < 300; i++) {
        let q; try { q = game.gen(G, { level: lv, rng: G.rng }); } catch (e) { probs.push('L' + lv + ' gen error ' + e.message); break; }
        G.asked.push(q.item || (ITEM[q.answer] ? q.answer : null));
        if (typeof game.hard === 'function') { sum += game.hard(q); n++; }
        const two = q.answer === 'all' && Array.isArray(q.seq) && !Array.isArray(q.opts) && !q.build;
        if (two || q.build) {      /* the two-ask form with its own buttons, the build form (the same rules as tests/test_options.py 01) */
          const fact = m => (m <= 1 ? 1 : m * fact(m - 1)), steps = (Array.isArray(q.words) ? q.words : Array.isArray(q.seq) ? q.seq : []).length;
          let ch = typeof q.chance === 'number' ? q.chance : two ? (Array.isArray(q.asks) ? q.asks.reduce((m, a) => m / Math.max(1, (a.opts || []).length), 1) : Math.pow(0.5, q.seq.length)) : (steps ? 1 / fact(steps) : 1);
          if (two && Array.isArray(q.asks)) q.asks.forEach((a, j) => { if ((a.opts || []).filter(x => String(x) === String(a.answer)).length !== 1) probs.push('L' + lv + ' ask ' + j + ' not exactly one right'); });
          if (two && !(ch <= 0.25 + 1e-9)) probs.push('L' + lv + ' two-ask: random right ' + ch.toFixed(3) + ' > 1/4');
          if (q.build && !(ch <= 0.2 + 1e-9)) probs.push('L' + lv + ' build: random right ' + ch.toFixed(3) + ' > 0.2');
        } else if (Array.isArray(q.opts)) {
          const right = q.answer === 'all' ? (q.seq || [])[0] : q.answer, key = x => (Array.isArray(x) ? x.join(':') : String(x)), ks = q.opts.map(key);
          if (q.opts.length < 5) probs.push('L' + lv + ' only ' + q.opts.length + ' options');
          if (new Set(ks).size !== ks.length) probs.push('L' + lv + ' an option twice ' + ks.join(','));
          if (right != null && ks.filter(k => k === key(right)).length !== 1) probs.push('L' + lv + ' right ' + key(right) + ' not once in ' + ks.join(','));
        }
      }
      means.push(n ? +(sum / n).toFixed(3) : null);
    }
    const ok = means.every(m => m != null) && means.every((m, i) => i === 0 || m > means[i - 1]);
    out[id] = { lv: means, ok, opts: Array.from(new Set(probs)).slice(0, 6) };
  }));
  return out;
})()
