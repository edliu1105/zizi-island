/* W3R1-01: how hard each new game is at levels 1-5, measured on its own generated questions (tests/test_w3new.py 10).
   For every game a few features of a question (more choices, look-alikes, old characters, traps, two steps ...); averaged over
   many questions per level. A level must be no easier than the one below in any feature and clearly harder in one. */
(() => {
  const N = 60, out = {};
  const F = {
    find: q => [q.pic ? 0 : 1, q.look ? 1 : 0, q.rev ? 1 : 0, q.opts.length],
    'hulk3:find': q => [q.copies], 'thor3:find': q => [q.moving], 'panther3:find': q => [q.stroop], 'widow3:find': q => [q.dark], 'hawk3:find': q => [],
    'hulk3:en': q => [q.opts.length, q.allit, q.vow], 'thor3:en': q => [q.opts.length, q.quiet], 'panther3:en': q => [q.opts.length, q.look ? 1 : 0, q.quiet],
    'widow3:en': q => [q.opts.length, q.near], 'hawk3:en': q => [q.opts.length, q.trap, q.look],
    'hulk3:quiz': q => [q.opts.length, q.scatter, q.near ? 1 : 0, q.groups], 'thor3:quiz': q => [q.help ? 0 : 1, q.range, q.scatter, q.mess],
    'panther3:quiz': q => [q.opts.length, q.noun, q.two], 'widow3:quiz': q => [q.rel, q.extra, q.trap], 'hawk3:quiz': q => [q.opts.length, q.len],
  };
  ['hulk3', 'thor3', 'panther3', 'widow3', 'hawk3'].forEach(isl => ['find', 'en', 'quiz'].forEach(slot => {
    const g = isl + ':' + slot, game = GAMES[g], lv = [];
    for (let l = 1; l <= 5; l++) {
      const G = { world: isl, W: ISL[isl], rng: RNG(100 + l), bags: {}, needPass: [], asked: [], ws: { lastKey: '' }, game, level: l }, sum = [];
      for (let i = 0; i < N; i++) {
        const q = game.gen(G, { level: l, rng: G.rng }), f = (slot === 'find' ? F.find(q) : []).concat(F[g](q));
        f.forEach((v, j) => { sum[j] = (sum[j] || 0) + Number(v || 0); });
        G.asked.push(q.item || (ITEM[q.answer] ? q.answer : null));
      }
      lv.push(sum.map(v => Math.round(100 * v / N) / 100));
    }
    const steps = [];
    for (let l = 1; l < 5; l++) {
      const a = lv[l - 1], b = lv[l], easier = a.some((v, j) => b[j] < v - 0.15), harder = a.some((v, j) => b[j] >= v + 0.3);
      steps.push(!easier && harder);
    }
    out[g] = { ok: steps.every(Boolean), lv, steps };
  }));
  return out;
})()
