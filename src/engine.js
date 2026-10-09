/* ==== engine carried over from 点点岛 (kidmath3/index.html, release v0786eda3) - adapted for 字字岛 ==== */

/* ---- from 点点岛: utils, Stand, RNG, Loops, Scope (lines 300-473) ---- */
/* =====================================================================
   点点岛 · single-file app (vanilla JS, zero dependencies)
   ===================================================================== */
/* ---------------------------------------------------------------- core */
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const now = () => performance.now();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const fast = () => !!window.__fast;
const T = ms => (fast() ? 0 : ms);
const EASE = { pop: 'cubic-bezier(.2,.9,.3,1.25)', glide: 'cubic-bezier(.45,0,.2,1)', drop: 'cubic-bezier(.5,0,.9,.4)', out: 'cubic-bezier(.2,.8,.2,1)', lin: 'linear' };
/* §3.10 rhythm, one table. Short feedback (press, pick up, place) 120-200 ms (CSS .12-.16 s); a reveal moment
   (flip / lift / uncover, then the explanation pause) 800-1200 ms; a celebration <= 2.5 s and skippable.
   Counting and moving the objects are math actions: one beat per object, never squeezed into a reveal. */
const DUR = { tap: 160, reveal: 1000, praise: 1500, star: 600, celebrate: 2400, finish: 2000, mapStar: 360, mapGap: 40 };
if (/[?&]fast=1/.test(location.search)) window.__fast = 1;

function el(tag, cls, parent, attrs) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) for (const k in attrs) { if (k === 'style') Object.assign(e.style, attrs[k]); else if (k === 'text') e.textContent = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); }
  if (parent) parent.appendChild(e);
  return e;
}
function img(src, cls, parent) { const i = el('img', cls, parent); i.alt = ''; i.draggable = false; i.decoding = 'async'; i.src = src; return i; }
const SVGNS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs, parent) { const e = document.createElementNS(SVGNS, tag); if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function place(e, x, y, w, h) { e.style.left = x + 'px'; e.style.top = y + 'px'; if (w != null) e.style.width = w + 'px'; if (h != null) e.style.height = h + 'px'; if (e._actorId) Stand.dirty(); }
/* the characters on the stage stand on one ground: the nearer one (feet lower on the screen) is drawn in front of every
   farther one it overlaps (a nearer character is only ever raised, never lowered below what a game put it above).
   Recomputed in the frame after a character was placed. The math things (items) keep the layer their game gave them:
   what is being counted is never pushed behind a character (see tests/depth_audit.py). */
const Stand = {
  due: 0,
  dirty() { if (!this.due) this.due = requestAnimationFrame(() => { this.due = 0; this.sort(); }); },
  sort() {
    if (!Session.G || !Stage.el) return;
    const A = [];
    Array.from(Stage.el.children).forEach((e, i) => {
      if (!e._actorId || e.style.visibility === 'hidden' || e.dataset.z != null) return;
      const b = box(e); if (b.x + b.w < 0 || b.x > Stage.W || b.y + b.h < 0 || b.y > Stage.H) return;   /* where it really stands */
      const z = parseInt(e.style.zIndex, 10);
      A.push({ e, i, b, z: isNaN(z) ? 0 : z, z0: e.style.zIndex });
    });
    const over = (p, q) => { const dx = Math.min(p.x + p.w * 0.86, q.x + q.w * 0.86) - Math.max(p.x + p.w * 0.14, q.x + q.w * 0.14), dy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y); return dx > 0 && dy > 0; };
    const above = (p, q) => (p.z !== q.z ? p.z > q.z : p.i > q.i);
    for (let pass = 0; pass < 6; pass++) {
      let moved = false;
      for (const a of A) for (const b of A) {
        if (a === b || a.b.y + a.b.h <= b.b.y + b.b.h + 6 || !over(a.b, b.b) || above(a, b)) continue;   /* a nearer, drawn behind b */
        a.z = Math.min(30, b.z + 1); moved = true;
      }
      if (!moved) break;
    }
    A.forEach(o => { if (o.z !== (parseInt(o.z0, 10) || 0)) o.e.style.zIndex = String(o.z); });
  },
};
function box(e) { return { x: parseFloat(e.style.left) || 0, y: parseFloat(e.style.top) || 0, w: parseFloat(e.style.width) || 0, h: parseFloat(e.style.height) || 0 }; }
function center(e) { const b = box(e); return { x: b.x + b.w / 2, y: b.y + b.h / 2 }; }

/* seeded RNG (xorshift32): same seed + same payload -> same run */
function RNG(seed) {
  let x = (seed >>> 0) || 0x9E3779B9;
  const r = () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
  r.int = (a, b) => a + Math.floor(r() * (b - a + 1));
  r.pick = arr => arr[Math.floor(r() * arr.length)];
  r.shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  r.chance = p => r() < p;
  return r;
}

/* Scope: every timer / animation / listener belongs to a scope -> one teardown, one fast-forward.
   Cancellation contract: once a scope is dead, every promise it handed out (wait / anim / guard) stays pending
   forever, so an async flow that belonged to it simply stops at its next await - it can never write to the
   stage, speak or record after its question/session is gone. (A fresh pending promise each time: nothing
   keeps it alive, the abandoned flow is garbage-collected.) */
const never = () => new Promise(() => {});
/* endless loops outside any scope (map / panel decorations): a loop whose element has left the page is cancelled on
   sweep (panel close, session end) - a detached element must never keep an animation, or itself, alive */
const Loops = {
  set: new Set(),
  run(e, kf, opt) { let a = null; try { a = e.animate(kf, Object.assign({ iterations: Infinity }, opt)); this.set.add(a); } catch (err) {} return a; },
  sweep() { for (const a of Array.from(this.set)) { const t = a.effect && a.effect.target; if (!t || !t.isConnected) { try { a.cancel(); } catch (err) {} this.set.delete(a); } } },
};
let TSEQ = 0;
class Scope {
  constructor(parent) { this.timers = new Map(); this.anims = new Set(); this.waits = new Set(); this.fns = []; this.dead = false; this.ff = false; this.paused = !!(parent && parent.paused); this.parent = parent || null; this.children = new Set(); if (parent) parent.children.add(this); }
  /* timers: a stable handle -> { id (native), fn, iv, ms, due }; pause() keeps the remainder, resume() re-arms it */
  arm(r, ms) {
    if (r.iv) { r.id = setInterval(() => { if (!this.dead) r.fn(); }, r.ms); r.due = now() + r.ms; }
    else { r.id = setTimeout(() => { this.timers.delete(r.h); if (!this.dead) r.fn(); }, ms); r.due = now() + ms; }
  }
  timeout(fn, ms) { if (this.dead) return 0; const r = { h: ++TSEQ, fn, iv: false }; this.timers.set(r.h, r); if (this.paused) r.left = T(ms); else this.arm(r, T(ms)); return r.h; }
  interval(fn, ms) { if (this.dead) return 0; const r = { h: ++TSEQ, fn, iv: true, ms: Math.max(16, T(ms)) }; this.timers.set(r.h, r); if (!this.paused) this.arm(r); return r.h; }
  clear(h) { const r = this.timers.get(h); if (!r) return; clearTimeout(r.id); clearInterval(r.id); this.timers.delete(h); }
  wait(ms) {
    if (this.dead) return never();
    return new Promise(res => {
      const w = { res: () => { if (!this.dead) res(); } };
      const go = d => { w.id = setTimeout(() => { this.waits.delete(w); w.res(); }, d); w.due = now() + d; };
      this.waits.add(w);
      const d = (this.ff || T(ms) <= 0) ? 0 : T(ms);
      if (this.paused && d > 0) w.left = d; else go(d);
      w.go = go;
    });
  }
  /* backgrounding: everything this scope (and its children) is doing stops where it is, and later goes on from there */
  pause() {
    if (this.dead || this.paused) return;
    this.paused = true; const t = now();
    this.timers.forEach(r => { clearTimeout(r.id); clearInterval(r.id); r.left = Math.max(0, (r.due || t) - t); });
    this.waits.forEach(w => { if (w.id != null) { clearTimeout(w.id); w.left = Math.max(0, (w.due || t) - t); } });
    this.anims.forEach(a => { try { if (a.playState === 'running') { a.pause(); a._pz = true; } } catch (err) {} });
    this.children.forEach(c => c.pause());
  }
  resume() {
    if (this.dead || !this.paused) return;
    this.paused = false;
    this.timers.forEach(r => { if (r.iv) this.arm(r); else this.arm(r, r.left || 0); });
    this.waits.forEach(w => { if (w.left != null && w.go) { w.go(w.left); w.left = null; } });
    this.anims.forEach(a => { try { if (a._pz) { a._pz = false; a.play(); } } catch (err) {} });
    this.children.forEach(c => c.resume());
    const h = this.holds; this.holds = null; if (h) h.forEach(r => r());
  }
  /* resolve with p's value only while this scope is alive (for promises the scope does not own: speech, loaders) */
  guard(p) { if (this.dead) return never(); return Promise.resolve(p).then(v => (this.dead ? never() : this.paused ? this.held().then(() => (this.dead ? never() : v)) : v)); }
  /* R4-C02: speech or a loader may settle while the app is in the background - the flow goes on only after resume() */
  held() { return new Promise(r => { (this.holds || (this.holds = [])).push(r); }); }
  anim(e, kf, opt) {
    if (this.dead) return never();
    if (!e || !e.animate) return Promise.resolve(null);
    const o = typeof opt === 'number' ? { duration: opt } : Object.assign({}, opt || {});
    const quick = this.ff || fast();
    const loop = o.iterations === Infinity;
    o.duration = quick && !loop ? 0 : (o.duration == null ? 300 : o.duration);
    o.delay = quick ? 0 : (o.delay || 0);
    o.fill = o.fill || (loop ? 'none' : 'both');
    o.easing = o.easing || EASE.glide;
    const commit = o.commit; delete o.commit;
    let a;
    try { a = e.animate(kf, o); } catch (err) { return Promise.resolve(null); }
    this.anims.add(a);
    if (this.paused) { try { a.pause(); a._pz = true; } catch (err) {} }
    if (loop) return Promise.resolve(a);
    return a.finished.then(() => {
      this.anims.delete(a);
      if (this.dead) return never();
      if (commit) { try { a.commitStyles(); } catch (err) { /* older WebKit: final keyframe stays via fill */ return a; } try { a.cancel(); } catch (err) {} }
      return a;
    }, () => { this.anims.delete(a); return this.dead ? never() : null; });
  }
  on(t, ev, fn, opt) { t.addEventListener(ev, fn, opt); this.fns.push(() => t.removeEventListener(ev, fn, opt)); }
  add(fn) { this.fns.push(fn); }
  fastForward() {
    this.ff = true;
    for (const a of Array.from(this.anims)) { try { const tm = a.effect && a.effect.getTiming(); if (tm && tm.iterations === Infinity) continue; a.finish(); } catch (err) {} }
    for (const w of Array.from(this.waits)) { clearTimeout(w.id); w.res(); }
    this.waits.clear();
    this.children.forEach(c => c.fastForward());
  }
  dispose() {
    if (this.dead) return;
    this.dead = true;
    this.timers.forEach(r => { clearTimeout(r.id); clearInterval(r.id); });
    this.anims.forEach(a => { try { a.cancel(); } catch (err) {} });
    this.waits.forEach(w => clearTimeout(w.id));          /* never resolved: the owning flow stops here */
    this.waits.clear();
    this.fns.forEach(f => { try { f(); } catch (err) {} });
    Array.from(this.children).forEach(c => c.dispose());
    if (this.parent) this.parent.children.delete(this);
  }
}
const APP = new Scope();

/* ---- from 点点岛: audio: Sfx, speech log, voice bank, Voice (lines 612-1201) ---- */
/* ================================================================ AUDIO
   Sfx     : one WebAudio "marimba" family, synthesized (no files), + ambient beds
   Voice   : narration channel (speechSynthesis) with the iOS/WebKit rules
   Count   : counting channel (pre-generated neural-TTS mp3 via WebAudio), never the synthesizer
   ================================================================ */
const Sfx = {
  ctx: null, out: null, amb: null, media: null, unlocked: false, primed: false, noise: null, live: 0, log: [],
  ensure() {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { this.note('no-audiocontext'); return null; }
    try { this.ctx = new AC(); } catch (e) { this.note('create-failed', e); return null; }
    const c = this.ctx;
    c.onstatechange = () => { this.unlocked = c.state === 'running'; this.note('state'); };
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    this.out = c.createGain(); this.out.gain.value = 0.9;
    this.out.connect(comp); comp.connect(c.destination);
    this.amb = c.createGain(); this.amb.gain.value = 0; this.amb.connect(this.out);
    const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noise = buf;
    return c;
  },
  /* rule 5: lazily create, resume inside every gesture (until it really runs), one silent frame on the first gesture.
     Every attempt and every rejection is recorded (parent panel shows it); `unlocked` follows the real context state. */
  note(ev, e) {
    this.log.push({ t: Math.round(now() - T0), ev, why: e ? String(e.name || e.message || e).slice(0, 60) : '', state: this.ctx ? this.ctx.state : 'none', media: this.media ? (this.media.paused ? 'paused' : 'playing') : 'none' });
    if (this.log.length > 30) this.log.shift();
  },
  /* a context that stopped producing sound (iOS after an interruption) is replaced; the new one starts in this gesture */
  rebuild() {
    const old = this.ctx;
    this.ctx = null; this.out = null; this.amb = null; this.primed = false; this.broken = false; this.ambNodes = []; this.ambKind = null;
    try { if (old && old.close) old.close(); } catch (e) {}
    Bank.reset();
    this.note('rebuilt');
    return this.ensure();
  },
  touch() {
    if (this.broken || (this.ctx && this.ctx.state === 'closed')) this.rebuild();
    const c = this.ensure();
    if (!c) return;
    if (c.state !== 'running') {
      try { const p = c.resume(); if (p && p.then) p.then(() => { this.unlocked = c.state === 'running'; this.note('resume-ok'); }, e => this.note('resume-rejected', e)); } catch (e) { this.note('resume-threw', e); }
    }
    if (!this.primed) {
      try { const b = c.createBuffer(1, 1, 22050), s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); this.primed = true; this.note('primed'); } catch (e) { this.note('prime-failed', e); }
    }
    this.unlocked = c.state === 'running';
    if (this.media && this.media.paused) { const p = this.media.play(); if (p && p.then) p.then(() => this.note('media-ok'), e => this.note('media-rejected', e)); }
  },
  /* rule 5: a looping silent <audio> promotes the page to a media session (plays through the side mute switch) */
  startMedia() {
    if (this.media) return;
    try {
      const a = new Audio('assets/voice/silence.mp3');
      a.loop = true; a.preload = 'auto'; a.setAttribute('playsinline', ''); a.setAttribute('webkit-playsinline', '');
      this.media = a;
      const p = a.play(); if (p && p.then) p.then(() => this.note('media-ok'), e => this.note('media-rejected', e));
    } catch (e) { this.note('media-failed', e); }
  },
  /* every started source is counted until it ends (soak test: __res().audio must not grow) */
  track(n) { this.live++; n.addEventListener('ended', () => { this.live--; }, { once: true }); return n; },
  /* ducking: the ambient bed steps back while someone speaks or counts */
  duckTo(v) { const c = this.ctx; if (!c || !this.amb) return; const t = c.currentTime, g = this.amb.gain; try { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(v, t + 0.15); } catch (e) {} },
  duck(sec) {
    if (!this.ctx || !this.ambKind) return;
    if (sec > 0) this.duckTo(0.015);
    clearTimeout(this.duckT);
    this.duckT = setTimeout(() => { if (!Voice.busy() && this.ambKind) this.duckTo(0.07); }, Math.max(0, sec || 0) * 1000 + 300);
  },
  t() { return this.ctx ? this.ctx.currentTime : 0; },
  mar(freq, when, vel, dur) {            /* marimba voice: sine + fast-decaying 4th/10th partials */
    const c = this.ctx; if (!c || c.state !== 'running') return;
    const t0 = c.currentTime + (when || 0), v = (vel == null ? 0.5 : vel), d = dur || 0.9;
    const g = c.createGain(); g.connect(this.out);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.32 * v, t0 + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = freq; o1.connect(g);
    const g2 = c.createGain(); g2.connect(this.out);
    g2.gain.setValueAtTime(0.0001, t0); g2.gain.exponentialRampToValueAtTime(0.12 * v, t0 + 0.004); g2.gain.exponentialRampToValueAtTime(0.0001, t0 + d * 0.22);
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 4.0; o2.connect(g2);
    const osc = [o1, o2];
    if (freq * 9.9 < Math.min(18000, c.sampleRate / 2.2)) {        /* the bright "tick" partial, only where it is audible */
      const g3 = c.createGain(); g3.connect(this.out);
      g3.gain.setValueAtTime(0.0001, t0); g3.gain.exponentialRampToValueAtTime(0.05 * v, t0 + 0.002); g3.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06);
      const o3 = c.createOscillator(); o3.type = 'sine'; o3.frequency.value = freq * 9.9; o3.connect(g3); osc.push(o3);
    }
    osc.forEach(o => { this.track(o); o.start(t0); o.stop(t0 + d + 0.05); });
  },
  nz(when, dur, f0, f1, q, vol, type) {  /* filtered noise gesture: splash / whoosh / puff */
    const c = this.ctx; if (!c || c.state !== 'running' || !this.noise) return;
    const t0 = c.currentTime + (when || 0);
    const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type || 'bandpass'; f.Q.value = q || 1.2;
    f.frequency.setValueAtTime(f0, t0); f.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + Math.min(0.03, dur / 3)); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(this.out);
    this.track(s); s.start(t0, Math.random() * 1.5); s.stop(t0 + dur + 0.05);
  },
  sweep(f0, f1, dur, vol, type, when) {
    const c = this.ctx; if (!c || c.state !== 'running') return;
    const t0 = c.currentTime + (when || 0);
    const o = c.createOscillator(); o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.out); this.track(o); o.start(t0); o.stop(t0 + dur + 0.05);
  },
  /* the one family ------------------------------------------------ */
  SCALE: [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98, 1760.0],
  press() { this.mar(1318.5, 0, 0.16, 0.12); },
  tap() { this.mar(987.8, 0, 0.35, 0.25); this.mar(1318.5, 0.03, 0.18, 0.2); },
  /* R3-D03: one rising major scale for 1-20 (C4 ... A6): every count is higher than the one before, also across ten */
  SCALE20: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51, 1396.91, 1567.98, 1760.0],
  count(n) { const i = Math.min(20, Math.max(1, n)) - 1; this.mar(this.SCALE20[i], 0, 0.55, 0.7); },
  place() { this.mar(1568, 0, 0.3, 0.12); this.nz(0, 0.05, 2500, 1800, 3, 0.08); },
  back() { this.mar(784, 0, 0.3, 0.2); this.mar(659, 0.07, 0.25, 0.25); },
  hop() { this.sweep(380, 760, 0.16, 0.08, 'sine'); },
  land() { this.nz(0, 0.12, 400, 120, 0.8, 0.12, 'lowpass'); },
  whoosh(d) { this.nz(0, d || 0.35, 500, 2600, 0.7, 0.07); },
  splash() { this.nz(0, 0.5, 1800, 300, 0.6, 0.28, 'lowpass'); this.nz(0.03, 0.35, 3000, 1200, 1.2, 0.08); },
  pop() { this.sweep(300, 900, 0.07, 0.1, 'triangle'); },
  bubble() { this.sweep(500, 1400, 0.12, 0.08, 'sine'); },
  sparkle() { [2093, 2637, 3136, 3951].forEach((f, i) => this.mar(f, i * 0.05, 0.12, 0.35)); },
  reveal() { this.sweep(420, 1300, 0.45, 0.07, 'triangle'); this.sparkle(); },
  hey() { this.mar(783.99, 0, 0.22, 0.35); this.mar(1046.5, 0.13, 0.2, 0.45); },
  yawn() { this.sweep(520, 230, 1.0, 0.05, 'triangle', 0.1); this.nz(0.05, 0.9, 900, 300, 0.7, 0.035, 'lowpass'); },
  /* four sisters of one marimba figure; never the same one twice in a row */
  CORRECT: [
    [[523.25, 0], [659.25, 0.085], [783.99, 0.17], [1046.5, 0.255]],
    [[587.33, 0], [739.99, 0.08], [880.0, 0.16], [1174.66, 0.26], [1479.98, 0.36]],
    [[783.99, 0], [659.25, 0.09], [783.99, 0.18], [1046.5, 0.27], [1318.51, 0.36]],
    [[523.25, 0], [783.99, 0.1], [659.25, 0.2], [1046.5, 0.3], [1567.98, 0.42]],
  ],
  correct() {
    let i; do { i = Math.floor(Math.random() * this.CORRECT.length); } while (i === this.lastCorrect);
    this.lastCorrect = i;
    this.CORRECT[i].forEach(([f, t], k, a) => this.mar(f, t, k === a.length - 1 ? 0.5 : 0.42, k === a.length - 1 ? 1.2 : 0.8));
  },
  star() { this.mar(1567.98, 0, 0.35, 0.9); this.mar(2093, 0.09, 0.3, 1.1); },
  complete() {
    const seq = [[392, 523.25], [440, 587.33], [493.88, 659.25], [523.25, 783.99, 1046.5]];
    seq.forEach((ch, i) => ch.forEach(f => this.mar(f, i * 0.16, i === 3 ? 0.42 : 0.3, i === 3 ? 1.6 : 0.5)));
  },
  zap() { this.nz(0, 0.25, 6000, 900, 0.9, 0.12, 'highpass'); this.sweep(1600, 200, 0.22, 0.06, 'sawtooth'); },
  thud() { this.sweep(160, 50, 0.25, 0.25, 'sine'); this.nz(0, 0.15, 300, 80, 0.7, 0.15, 'lowpass'); },
  fire() { this.nz(0, 0.45, 900, 300, 0.5, 0.14); },
  boing() { this.sweep(200, 520, 0.18, 0.12, 'sine'); this.sweep(520, 300, 0.2, 0.08, 'sine', 0.18); },
  song() {                                /* short original birthday jingle */
    const m = [[659, .0], [659, .18], [784, .36], [659, .6], [880, .84], [784, 1.08], [659, 1.4], [587, 1.58], [659, 1.76], [784, 2.0], [1047, 2.25]];
    m.forEach(([f, t]) => this.mar(f, t, 0.36, 0.5));
  },
  fanfare() { [[523, 0], [659, .12], [784, .24], [1047, .4], [784, .6], [1047, .72]].forEach(([f, t]) => this.mar(f, t, 0.4, 0.8)); },

  /* ambient beds: very quiet, one per world, stopped when hidden */
  ambNodes: [],
  ambient(kind) {
    this.ambientStop();
    const c = this.ctx; if (!c || !kind) return;
    const nodes = [], A = this.amb, t0 = c.currentTime;
    const noiseBed = (type, freq, q, vol) => {
      const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
      const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      const g = c.createGain(); g.gain.value = vol;
      s.connect(f); f.connect(g); g.connect(A); s.start(t0, Math.random());
      nodes.push(s); return { f, g };
    };
    const lfo = (param, rate, depth, base) => {
      const o = c.createOscillator(); o.frequency.value = rate; const g = c.createGain(); g.gain.value = depth;
      o.connect(g); g.connect(param); param.value = base; o.start(t0); nodes.push(o);
    };
    if (kind === 'rain') noiseBed('highpass', 3500, 0.5, 0.18);
    if (kind === 'wind' || kind === 'falls') { const n = noiseBed('bandpass', 500, 0.6, 0.35); lfo(n.f.frequency, 0.07, 260, 520); lfo(n.g.gain, 0.05, 0.15, 0.3); }
    if (kind === 'falls') noiseBed('bandpass', 1800, 0.5, 0.18);
    if (kind === 'waves') { const n = noiseBed('lowpass', 700, 0.7, 0.3); lfo(n.g.gain, 0.12, 0.25, 0.28); }
    if (kind === 'city') { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 55; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 180; const g = c.createGain(); g.gain.value = 0.08; o.connect(f); f.connect(g); g.connect(A); o.start(t0); nodes.push(o); noiseBed('bandpass', 900, 0.4, 0.05); }
    this.ambNodes = nodes; this.ambKind = kind;
    A.gain.cancelScheduledValues(t0); A.gain.setValueAtTime(A.gain.value, t0); A.gain.linearRampToValueAtTime(0.07, t0 + 1.5);
    if (this.ambTimer) clearInterval(this.ambTimer);
    this.ambTimer = setInterval(() => this.ambSparkle(), 700);
  },
  ambSparkle() {                          /* sparse events: drops, crickets, gulls */
    const c = this.ctx; if (!c || c.state !== 'running' || document.hidden) return;
    const k = this.ambKind, r = Math.random();
    const blip = (f, v, d, w) => { const t = c.currentTime + (w || 0); const o = c.createOscillator(); o.frequency.value = f; const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(this.amb); o.start(t); o.stop(t + d + 0.02); };
    if (k === 'rain' && r < 0.7) blip(1800 + Math.random() * 2400, 0.05, 0.05, Math.random() * 0.5);
    if (k === 'crickets' && r < 0.6) for (let i = 0; i < 4; i++) blip(4300 + Math.random() * 200, 0.03, 0.03, i * 0.06);
    if (k === 'waves' && r < 0.08) { const t = c.currentTime; const o = c.createOscillator(); o.frequency.setValueAtTime(1400, t); o.frequency.exponentialRampToValueAtTime(900, t + 0.25); const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.03, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3); o.connect(g); g.connect(this.amb); o.start(t); o.stop(t + 0.35); }
    if ((k === 'wind' || k === 'falls') && r < 0.1) blip(2600 + Math.random() * 900, 0.02, 0.12);
  },
  ambientStop() {
    const c = this.ctx;
    if (this.ambTimer) { clearInterval(this.ambTimer); this.ambTimer = 0; }
    if (!c) return;
    const t = c.currentTime, A = this.amb, old = this.ambNodes;
    A.gain.cancelScheduledValues(t); A.gain.setValueAtTime(A.gain.value, t); A.gain.linearRampToValueAtTime(0, t + 0.4);
    setTimeout(() => old.forEach(n => { try { n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} }), 500);
    this.ambNodes = []; this.ambKind = null;
  },
};

/* -------------------------------------------------------------- speech log (test hook) */
const T0 = now();
window.__speechLog = [];
let speechSeq = 0;
function slog(ch, text, tag, ev) { const e = { id: ++speechSeq, t: Math.round(now() - T0), text, tag: tag || '', ch, ev: ev || 'speak' }; window.__speechLog.push(e); if (window.__speechLog.length > 4000) window.__speechLog.splice(0, 1000); return e; }

/* who a sentence belongs to: the live question, else the live session, else nobody (map / entry) */
function speechOwner() {
  if (typeof Session === 'undefined') return null;
  const st = Session.st; if (st && Session.alive(st)) return st;
  const G = Session.G; return G && !G.dead ? G : null;
}
function ownerAlive(o) {
  if (!o) return true;
  if (o.scope && o.G) return Session.alive(o);          /* a question */
  return !o.dead && Session.G === o;                     /* a session */
}

/* -------------------------------------------------------------- narration channel
   the ten WebKit rules, where each one lives:
   1 entry click speaks synchronously (unlock)          6 zh voice scoring, refs kept (utter)
   2 ONE cancel path (cancelEngine) + 150 ms gap (pump)  7 late-voice re-say: throttle, context token, own-request confirmation
   3 engine state gates the next speak (pump) + timeouts 8 newest wins: stale owners dropped at enqueue and at speak
   4 resume before every speak and on visibility         9 per-request confirmation, 3 misses -> big retry target
   5 WebAudio + media session unlock (Sfx.touch)         10 counting never through here unless the mp3 path failed (protected) */
/* ================================================================ VOICE BANK
   the sentences as recordings: assets/voice/v/<fnv1a(text)>.mp3, the list of recorded keys in assets/voice/bank.json.
   Decoded clips are kept in a small cache (the newest 40) */
const FIRST_LINE = '我们去字字岛吧！';
const Bank = {
  set: null, bufs: {}, order: [], fails: {}, loading: {},
  key(text) { let h = 0x811c9dc5; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); },
  started: false,
  init() {
    if (this.started) return this.p; this.started = true;
    if (window.__nobank) { this.set = new Set(); return (this.p = Promise.resolve()); }       /* tests of the device-engine path */
    return (this.p = fetch('assets/voice/bank.json').then(r => (r.ok ? r.json() : [])).then(a => { this.set = new Set(a); }).catch(() => { this.set = new Set(); }));
  },
  /* recordings mode: the list is loading or has entries (and Web Audio exists). Then the device engine is never used */
  on() { return !window.__nobank && !!(window.AudioContext || window.webkitAudioContext) && (this.set ? this.set.size > 0 : this.started); },
  reset() { this.bufs = {}; this.order = []; this.loading = {}; },
  has(text) { return !!(text && this.set && this.set.has(this.key(text)) && !this.fails[this.key(text)]); },
  ready(text) { return this.bufs[this.key(text)] || null; },
  keep(k, b) { this.bufs[k] = b; this.order.push(k); while (this.order.length > 40) delete this.bufs[this.order.shift()]; },
  load(text) {
    const k = this.key(text);
    if (this.bufs[k]) return Promise.resolve(this.bufs[k]);
    if (this.fails[k]) return Promise.resolve(null);
    if (this.loading[k]) return this.loading[k];
    const c = Sfx.ensure();
    if (!c) { this.fails[k] = 1; return Promise.resolve(null); }
    const p = fetch('assets/voice/v/' + k + '.mp3').then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.arrayBuffer(); })
      .then(ab => new Promise((res, rej) => { const q = c.decodeAudioData(ab, res, rej); if (q && q.then) q.then(res, rej); }))
      .then(b => { this.keep(k, b); delete this.loading[k]; return b; })
      .catch(() => { this.fails[k] = 1; delete this.loading[k]; return null; });
    this.loading[k] = p;
    return p;
  },
};

const Voice = {
  synth: ('speechSynthesis' in window) ? window.speechSynthesis : null,
  voices: [], zh: [], voice: null,
  q: [], cur: null, refs: [], waiters: [],
  lastReqAt: -1e9, lastCancelAt: -1e9, localDoneAt: 0, reqSeq: 0, lastText: '',
  engineActive: false,          /* the engine was seen speaking||pending while one of our requests was current */
  firstConfirmed: false,        /* the FIRST sentence itself was confirmed (activity seen while it was the current request) */
  first: null, resayWant: null, resayAt: -1e9, resayT: 0,
  ctx: { gen: 0, name: 'entry' },
  fails: 0, oks: 0, silent: false,
  pumpTimer: 0, dogTimer: 0, dogBusy: 0, busySince: 0, recoverAt: -1e9,
  init() {
    const s = this.synth;
    if (s) {
      this.loadVoices();
      try { s.addEventListener('voiceschanged', () => this.onVoicesChanged()); } catch (e) { s.onvoiceschanged = () => this.onVoicesChanged(); }
      /* rule 10: watchdog - the engine claims busy while nothing of ours is running -> reset through the one cancel path */
      this.dogTimer = setInterval(() => {
        if (document.hidden) { this.dogBusy = 0; return; }
        const busy = s.speaking || s.pending;
        if (!busy || this.cur) { this.dogBusy = 0; return; }
        if (!this.dogBusy) this.dogBusy = now();
        if (now() - this.dogBusy >= 2400 && now() - this.localDoneAt >= 2400) { this.dogBusy = 0; this.cancelEngine('watchdog'); }
      }, 1200);
    }
    /* rule 4 + background protocol: the app clock stops, gestures are dropped, audio resumes on return */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        Clock.hide(); Input.abort();
        if (Session.G && !Session.G.dead) Session.G.scope.pause();          /* the mathematics waits for the child */
        if (Sfx.ctx && Sfx.ctx.state === 'running') { try { Sfx.ctx.suspend(); } catch (e) {} }
        return;
      }
      Clock.show();
      if (Session.G && !Session.G.dead) Session.G.scope.resume();
      if (s) { try { s.resume(); } catch (e) {} }
      if (Sfx.ctx) { const p = Sfx.ctx.resume && Sfx.ctx.resume(); if (p && p.catch) p.catch(e => Sfx.note('resume-rejected', e)); }
      if (Sfx.media && Sfx.media.paused && Sfx.primed) { const p = Sfx.media.play(); if (p && p.catch) p.catch(e => Sfx.note('media-rejected', e)); }
    });
  },
  /* rule 6: zh voices, zh-CN first, Enhanced/Premium/增强 first, Ting-Ting/婷婷, Xiaoxiao */
  score(v) {
    let sc = 0; const n = (v.name || '') + ' ' + (v.voiceURI || ''), l = (v.lang || '').toLowerCase().replace('_', '-');
    if (l === 'zh-cn' || l === 'cmn-hans-cn') sc += 50; else if (l.startsWith('zh-hans') || l.startsWith('cmn')) sc += 35; else if (l.startsWith('zh')) sc += 10;
    if (/enhanced|premium|增强|高品质|neural|natural/i.test(n)) sc += 100;
    if (/ting-?ting|婷婷|xiaoxiao|晓晓|yaoyao|huihui|lili|li-mu/i.test(n)) sc += 20;
    if (v.localService) sc += 3;
    return sc;
  },
  loadVoices() {
    const s = this.synth; if (!s) return;
    let vs = [];
    try { vs = s.getVoices() || []; } catch (e) { vs = []; }
    this.voices = vs;
    this.zh = vs.filter(v => /^(zh|cmn)/i.test(v.lang || '')).sort((a, b) => this.score(b) - this.score(a));
    const pref = Store.s && Store.s.settings.voiceURI;
    this.voice = (pref && this.zh.find(v => v.voiceURI === pref)) || this.zh[0] || null;
  },
  voiceKey() { return this.voice ? this.voice.voiceURI : 'default'; },
  onVoicesChanged() {
    const before = this.voiceKey();
    this.loadVoices();
    const f = this.first;
    if (f && !f.respoken && this.voice && f.voiceKey !== this.voiceKey() && before !== this.voiceKey()) this.wantResay('voiceschanged');
  },
  /* rule 7: a re-say of the first sentence is only a wish; it is re-checked until allowed or no longer valid */
  enter(name) { this.ctx = { gen: this.ctx.gen + 1, name }; this.resayWant = null; clearTimeout(this.resayT); },
  canInterject() {
    const s = this.synth;
    if (!s) return false;
    if (s.speaking || s.pending || this.cur || this.q.length) return false;     /* engine or queue busy -> wait */
    if (now() - this.lastReqAt < 1500) return false;                             /* never talk over a fresh request */
    if (now() - this.resayAt < 3000) return false;                               /* throttle */
    return true;
  },
  wantResay(why) { const f = this.first; if (!f || f.respoken) return; this.resayWant = { why }; this.tryResay(); },
  tryResay() {
    clearTimeout(this.resayT);
    const w = this.resayWant, f = this.first;
    if (!w || !f || f.respoken) { this.resayWant = null; return; }
    if (this.ctx.gen !== f.ctx || now() - f.at > 12000) { this.resayWant = null; return; }   /* the child moved on / too late */
    if (!this.canInterject()) { this.resayT = setTimeout(() => this.tryResay(), 400); return; }
    this.resayWant = null; f.respoken = true; this.resayAt = now();
    this.say(f.text, { tag: 'resay:' + w.why, owner: null, ctx: f.ctx });
  },
  /* rule 1: called synchronously inside the entry button's click handler - no cancel in front of it (rule 2) */
  unlock(text) {
    this.enter('map');
    const s = this.synth;
    const c = !window.__nobank && Sfx.ensure();
    if (c) {                                      /* recordings: the device engine is not touched at all (iOS audio session) */
      Bank.init();
      try { c.resume(); } catch (e) {}
      const rec = Bank.ready(text), item = { id: ++this.reqSeq, text, tag: 'first', resolve: () => {}, done: false, owner: null };
      this.first = { item, text, at: now(), ctx: this.ctx.gen, voiceKey: this.voiceKey(), respoken: true };
      this.firstConfirmed = true; this.lastText = text;
      if (rec) this.playClip(item, rec);         /* starts in this gesture; sounds as soon as the audio runs */
      else this.say(text, { tag: 'first', owner: null });
      return;
    }
    const item = { id: ++this.reqSeq, text, tag: 'first', resolve: () => {}, done: false, owner: null };
    this.first = { item, text, at: now(), ctx: this.ctx.gen, voiceKey: this.voiceKey(), respoken: false };
    this.lastText = text;
    if (!s) { slog('narr', text, 'first', 'nosynth'); this.setSilent(true); return; }
    try { s.resume(); } catch (e) {}
    this.speakNow(item);                         /* synchronous, no setTimeout */
    setTimeout(() => { if (!this.firstConfirmed) this.wantResay('silent'); }, 1600);
  },
  utter(text) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; u.rate = 0.9; u.pitch = 1.08; u.volume = 1;
    if (this.voice) { try { u.voice = this.voice; } catch (e) { /* a voice object the engine rejects: fall back to lang */ } }
    this.refs.push(u); if (this.refs.length > 24) this.refs.shift();   /* keep refs: GC would drop onend */
    return u;
  },
  /* the one place that hands an utterance to the engine */
  speakNow(item) {
    const s = this.synth;
    item.t0 = now();
    this.cur = item;
    this.lastReqAt = now();
    slog('narr', item.text, item.tag, 'speak');
    const u = this.utter(item.text);
    this.bindEnd(item, u);
    Sfx.duck(1 + item.text.length * 0.3);
    try { s.speak(u); } catch (e) { item.finish('error'); return; }
    item.pt0 = setTimeout(() => this.probe(item), T(120) || 10);
    item.pt = setTimeout(() => this.probe(item), T(450) || 20);
    item.pt2 = setTimeout(() => this.probe(item), T(1100) || 40);
  },
  /* rule 3/7: the engine's state confirms only the request that is current right now */
  probe(item) {
    const s = this.synth; if (!s || item.done || this.cur !== item) return;
    if (s.speaking || s.pending) {
      item.heard = true; this.engineActive = true;
      if (this.first && this.first.item === item) this.firstConfirmed = true;
    }
  },
  bindEnd(item, u, dur) {
    const finish = (why) => {
      if (item.done) return;
      if (item.clip) { try { item.clip.onended = null; item.clip.stop(); } catch (e) {} item.clip = null; }
      if (why === 'end') this.probe(item);           /* a last look before the request closes */
      item.done = true; clearTimeout(item.to); clearTimeout(item.pt0); clearTimeout(item.pt); clearTimeout(item.pt2);
      if (this.cur === item) { this.cur = null; this.localDoneAt = now(); }
      if (why !== 'cancel') slog('narr', item.text, item.tag, why === 'end' ? 'end' : why);
      this.account(item, why);
      item.resolve(why || 'end');
      if (!this.q.length) Sfx.duck(0);
      this.schedulePump(90);          /* 90 ms breath between sentences */
      this.checkWaiters();
      if (this.resayWant) this.tryResay();
    };
    item.finish = finish;
    if (u) {
      u.onstart = () => this.probe(item);          /* rule 3: an event only makes us LOOK at the engine's state */
      u.onend = () => finish('end');
      u.onerror = (e) => finish(e && /interrupt|cancel/i.test(e.error || '') ? 'cancel' : 'error');
    }
    /* rule 3: every flow that depends on the end has a timeout fallback */
    const lim = fast() ? 40 : dur ? dur * 1000 + 900 : Math.max(2500, item.text.length * 380);
    item.to = setTimeout(() => finish('timeout'), lim);
  },
  /* rule 9: per request - confirmed, or a miss; three misses in a row -> the big retry target appears */
  account(item, why) {
    if (!this.synth || fast() || why === 'cancel') return;
    /* success = the engine's state was seen speaking for THIS request (never an event alone); an 'end' without that is
       a miss like a timeout or an error (R3-I01) */
    if (item.heard) { this.fails = 0; this.oks++; this.engineActive = true; if (this.silent) this.setSilent(false); }
    else if (why === 'timeout' || why === 'error' || why === 'end') { this.fails++; if (this.fails >= 3) this.setSilent(true); }
  },
  setSilent(on) {
    this.silent = on;
    document.documentElement.classList.toggle('nosound', on);
    slog('narr', '', on ? 'silent-on' : 'silent-off', 'state');
  },
  /* the returned promise settles only while its owner is alive: code awaiting a sentence of a question that is gone
     simply stops there (same contract as Scope) */
  say(text, opt) {
    opt = opt || {};
    const owner = opt.owner !== undefined ? opt.owner : speechOwner();
    if (Bank.has(text)) Bank.load(text);                  /* decoded while the queue still talks */
    return new Promise(res0 => {
      const resolve = v => { if (ownerAlive(owner)) res0(v); };
      if (!text) { resolve('empty'); return; }
      if (!ownerAlive(owner)) { slog('narr', text, opt.tag, 'stale'); return; }      /* rule 8 at enqueue */
      const item = { id: ++this.reqSeq, text, tag: opt.tag || '', resolve, done: false, owner, prot: !!opt.prot, ctx: opt.ctx != null ? opt.ctx : null };
      if (!opt.prot) this.lastText = text;
      if (opt.latest) {
        /* a newer counting word supersedes an older one, queued or speaking; it goes to the head of the line */
        this.q = this.q.filter(d => { if (d.prot) { d.done = true; d.resolve('superseded'); return false; } return true; });
        if (this.cur && this.cur.prot) { const c = this.cur; this.cur = null; this.localDoneAt = now(); c.finish('cancel'); this.cancelEngine('count'); }
        this.q.unshift(item);
      } else {
        this.q.push(item);
        const plain = this.q.filter(d => !d.prot);
        if (plain.length > 3) plain.slice(0, plain.length - 3).forEach(d => { d.done = true; slog('narr', d.text, d.tag, 'dropped'); d.resolve('dropped'); this.q.splice(this.q.indexOf(d), 1); });
      }
      this.schedulePump(0);
    });
  },
  /* rule 2: the ONLY call to speechSynthesis.cancel(); every cancel starts the 150 ms no-speak window */
  cancelEngine(reason) {
    const s = this.synth; if (!s) return;
    try { s.cancel(); } catch (e) {}
    this.lastCancelAt = now();
    slog('narr', '', reason || 'cancel', 'cancel');
  },
  /* rule 2 + 8: one safe interrupt; only the newest request survives. Protected counting words survive a child's
     tap / submit (the counting channel is never cut by input); `keep` spares a sentence with that tag (the summary on skip). */
  hush(reason, keep) {
    const hard = reason === 'leave';
    const spare = d => !hard && ((d.prot && reason !== 'ff') || (keep && d.tag === keep));
    const kept = [];
    this.q.splice(0).forEach(d => { if (spare(d)) kept.push(d); else { d.done = true; d.resolve('cancel'); } });
    this.q = kept;
    const c = this.cur, s = this.synth;
    if (c && !spare(c)) { this.cur = null; this.localDoneAt = now(); c.finish && c.finish('cancel'); this.cancelEngine(reason || 'hush'); }
    else if (!c && s && (s.speaking || s.pending)) this.cancelEngine(reason || 'hush');
    this.checkWaiters();
  },
  sayNow(text, opt) { this.hush('now'); return this.say(text, opt); },
  /* R4-I01: a newer number took the MP3 channel - an older synthesized number must not sound after it */
  dropTag(tag) {
    this.q = this.q.filter(d => { if (d.tag !== tag) return true; d.done = true; d.resolve('cancel'); return false; });
    const c = this.cur;
    if (c && c.tag === tag) { this.cur = null; this.localDoneAt = now(); c.finish && c.finish('cancel'); this.cancelEngine('count'); }
    this.checkWaiters();
  },
  /* the child taps the big "no sound" target: resume, and if the engine is idle speak synchronously in this gesture */
  retry(text) {
    const s = this.synth;
    Sfx.touch();
    text = text || this.lastText || '你好！';
    if (!s) { slog('narr', text, 'retry', 'nosynth'); return; }
    try { s.resume(); } catch (e) {}
    this.fails = Math.min(this.fails, 2);
    if (this.cur || s.speaking || s.pending || now() - this.lastCancelAt < 150) { this.sayNow(text, { tag: 'retry', owner: null }); return; }
    this.speakNow({ id: ++this.reqSeq, text, tag: 'retry', resolve: () => {}, done: false, owner: null });
  },
  schedulePump(ms) { if (this.pumpTimer) return; this.pumpTimer = setTimeout(() => { this.pumpTimer = 0; this.pump(); }, fast() ? 0 : ms); },
  pump() {
    if (this.cur) return;
    const stale = d => !ownerAlive(d.owner) || (d.ctx != null && d.ctx !== this.ctx.gen);
    while (this.q.length && stale(this.q[0])) { const d = this.q.shift(); d.done = true; d.resolve('stale'); slog('narr', d.text, d.tag, 'stale'); }   /* rule 8 at speak */
    if (!this.q.length) { this.checkWaiters(); return; }
    const gap = 150 - (now() - this.lastCancelAt);
    if (gap > 0) { this.schedulePump(gap + 5); return; }
    const head = this.q[0];
    if (Bank.on()) {
      if (!head.waitT) head.waitT = now();
      const waited = now() - head.waitT, limit = fast() ? 600 : 1500;
      if (!Bank.set) { if (waited < limit) { this.schedulePump(40); return; } }        /* the list is still loading */
      else if (Bank.has(head.text)) {
        const c = Sfx.ensure(), b = Bank.ready(head.text);
        if (b && c && c.state === 'running') { this.playClip(this.q.shift(), b); return; }
        if (!head.loadAsked) { head.loadAsked = true; Bank.load(head.text).then(() => this.schedulePump(0)); }
        if (c && c.state !== 'running' && !head.resumeAsked) { head.resumeAsked = true; try { const r = c.resume(); if (r && r.then) r.then(() => this.schedulePump(0), () => {}); } catch (e) {} }
        if (waited < limit) { this.schedulePump(40); return; }
      } else if (head.text) (window.__vmiss || (window.__vmiss = new Set())).add(head.text);   /* a sentence without a recording */
      /* recordings mode: never the device engine (it switches the iOS audio session) - the sentence is let go quietly */
      const d = this.q.shift(); d.done = true; slog('narr', d.text, d.tag, 'skip'); d.resolve('skip');
      this.schedulePump(0); this.checkWaiters();
      return;
    }
    const s = this.synth;
    if (!s) {                          /* no engine: keep the page rhythm without sound */
      const item = this.q.shift();
      this.cur = item; item.t0 = now();
      slog('narr', item.text, item.tag, 'nosynth');
      item.finish = (why) => { if (item.done) return; item.done = true; clearTimeout(item.to); if (this.cur === item) { this.cur = null; this.localDoneAt = now(); } item.resolve(why || 'nosynth'); this.schedulePump(90); this.checkWaiters(); };
      item.to = setTimeout(() => item.finish('nosynth'), fast() ? 0 : Math.min(1800, 300 + item.text.length * 170));
      return;
    }
    /* rule 3: our last request may have timed out locally while the engine is still talking -> wait for the engine,
       and if it stays busy, recover through the one cancel path; right after a recovery the engine's flag is not trusted */
    if ((s.speaking || s.pending) && now() - this.recoverAt > 2000) {
      if (!this.busySince) this.busySince = now();
      if (now() - this.busySince < (fast() ? 30 : 1200)) { this.schedulePump(fast() ? 5 : 150); return; }
      this.busySince = 0; this.recoverAt = now();
      this.cancelEngine('recover');
      this.schedulePump(160); return;
    }
    this.busySince = 0;
    try { s.resume(); } catch (e) {}   /* rule 4: resume before every speak */
    this.speakNow(this.q.shift());
  },
  /* a recorded sentence: the same request life as a spoken one (cur, end, timeout, cancel) */
  playClip(item, buf) {
    const c = Sfx.ctx;
    item.t0 = now(); this.cur = item; this.lastReqAt = now();
    slog('narr', item.text, item.tag, 'speak');
    const s = c.createBufferSource(); s.buffer = buf;
    const g = c.createGain(); g.gain.value = 1.0; s.connect(g); g.connect(c.destination);
    Sfx.track(s);
    item.clip = s; item.heard = true; item.rec = true;
    this.bindEnd(item, null, buf.duration);
    s.onended = () => item.finish && item.finish('end');
    Sfx.duck(buf.duration + 0.3);
    try { s.start(); } catch (e) { item.finish('error'); return; }
    const t0 = c.currentTime;
    if (!fast()) setTimeout(() => { if (this.cur === item && c === Sfx.ctx && c.state === 'running' && c.currentTime === t0) { Sfx.note('clock-stalled'); Sfx.broken = true; item.finish('stalled'); } }, 450);
  },
  busy() { return !!(this.cur || this.q.length); },
  /* afterSay(minMs): resolves when narration is idle AND at least minMs passed */
  afterSay(minMs) {
    const t0 = now(), min = T(minMs || 0), owner = speechOwner();
    return new Promise(res0 => { const res = () => { if (ownerAlive(owner)) res0(); }; this.waiters.push({ res, t0, min }); this.checkWaiters(); });
  },
  checkWaiters() {
    if (this.busy()) return;
    const keep = [];
    for (const w of this.waiters) {
      const left = w.min - (now() - w.t0);
      if (left <= 0) w.res(); else { keep.push(w); setTimeout(() => this.checkWaiters(), left + 2); }
    }
    this.waiters = keep;
  },
  diag() {
    const s = this.synth;
    return {
      supported: !!s, voices: this.voices.length, zh: this.zh.map(v => v.name + ' (' + v.lang + ')' + (v.localService ? '' : ' ☁')),
      selected: this.voice ? this.voice.name + ' (' + this.voice.lang + ')' : '系统默认',
      engineActive: this.engineActive, firstConfirmed: this.firstConfirmed, fails: this.fails, oks: this.oks, silent: this.silent,
      speaking: s ? s.speaking : false, pending: s ? s.pending : false,
      ctx: Sfx.ctx ? Sfx.ctx.state : 'none', audioLog: Sfx.log.slice(-8),
    };
  },
};

/* ---- from 点点岛: stage + input (lines 1269-1486) ---- */
/* ================================================================ STAGE
   logical stage 1024x704 (landscape) / 704x1024 (portrait), contain-scaled (scale >= 1 on every iPad)
   background: square image, cover-scaled to the viewport; bgPoint() maps image anchors -> stage coords
   ================================================================ */
const Stage = {
  W: 1024, H: 704, portrait: false, s: 1, ox: 0, oy: 0,
  el: null, bg: null, onRelayout: null,
  init() {
    this.el = $('#stage'); this.bg = $('#gbg');
    this.fit(true);
    let t = 0;
    const re = () => { clearTimeout(t); t = setTimeout(() => this.fit(false), 60); };
    window.addEventListener('resize', re);
    window.addEventListener('orientationchange', re);
  },
  fit(first) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const was = this.portrait;
    this.vw = vw; this.vh = vh;
    this.portrait = vh > vw * 1.02;
    this.W = this.portrait ? 704 : 1024; this.H = this.portrait ? 1024 : 704;
    this.s = Math.min(vw / this.W, vh / this.H);
    this.ox = (vw - this.W * this.s) / 2; this.oy = (vh - this.H * this.s) / 2;
    const st = this.el.style;
    st.width = this.W + 'px'; st.height = this.H + 'px';
    st.transform = 'translate(' + this.ox + 'px,' + this.oy + 'px) scale(' + this.s + ')';
    if (!first && this.onRelayout) this.onRelayout(was !== this.portrait);
    if (!first && typeof MapView !== 'undefined') MapView.layout();
  },
  toStage(cx, cy) { return { x: (cx - this.ox) / this.s, y: (cy - this.oy) / this.s }; },
  toScreen(x, y) { return { x: this.ox + x * this.s, y: this.oy + y * this.s }; },
  /* square background drawn with background-size:cover on the full viewport */
  bgPoint(u, v) {
    const D = Math.max(this.vw, this.vh), x0 = (this.vw - D) / 2, y0 = (this.vh - D) / 2;
    return this.toStage(x0 + u * D, y0 + v * D);
  },
};

/* ================================================================ INPUT
   four adapters (+ hold): station tap / region sweep / quantized rotation / corridor (drag, flick)
   every real gesture becomes one call:  __gesture(name, payload)  -- tests use the same entry
   ================================================================ */
const Input = {
  cur: null, fails: 0, enabled: true,
  init() {
    const root = $('#game');
    root.addEventListener('pointerdown', e => this.down(e));
    window.addEventListener('pointermove', e => this.move(e), { passive: false });
    window.addEventListener('pointerup', e => this.up(e));
    window.addEventListener('pointercancel', e => this.cancel(e));
    ['contextmenu', 'gesturestart', 'gesturechange', 'dblclick', 'selectstart'].forEach(ev => document.addEventListener(ev, e => e.preventDefault(), { passive: false }));
    document.addEventListener('touchmove', e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
    let lastEnd = 0;
    document.addEventListener('touchend', e => { const t = Date.now(); if (t - lastEnd < 320) e.preventDefault(); lastEnd = t; }, { passive: false });
  },
  bind(e, spec) { e.classList.add('tgt'); e._spec = spec; e.dataset.gid = spec.id; return e; },
  unbind(e) { if (e) { delete e._spec; delete e.dataset.gid; e.classList.remove('tgt'); } },
  pt(e) { return Stage.toStage(e.clientX, e.clientY); },
  down(e) {
    Sfx.touch();
    const t = e.target.closest ? e.target.closest('[data-gid]') : null;
    if (this.cur) return;                                    /* one finger at a time */
    if (!t || !t._spec) {
      if (e.target.closest && e.target.closest('#ff')) { gesture('skip', {}); }
      return;
    }
    const spec = t._spec;
    if (spec.disabled) return;
    const p = this.pt(e);
    this.cur = { el: t, spec, id: spec.id, pid: e.pointerId, x0: p.x, y0: p.y, x: p.x, y: p.y, t0: now(), path: [p], moved: false, rot: null, acc: 0, units: 0, passed: [], rev: 0, lastDx: 0, holdT: 0, done: false };
    try { t.setPointerCapture(e.pointerId); } catch (err) {}
    t.classList.add('press');
    Sfx.press();
    if (spec.hold) {
      const c = this.cur;
      c.holdT = setTimeout(() => { if (this.cur === c && !c.moved) { c.done = true; t.classList.remove('press'); if (spec.onHoldEnd) spec.onHoldEnd(true); gesture('hold', { id: spec.id }); } }, T(spec.hold));
      if (spec.onHoldStart) spec.onHoldStart();
    }
    if (spec.slide) this.slideStep(p);
    if (spec.draw) spec.draw.start(p);                       /* writing: the ink follows the finger from the first touch */
    if (e.cancelable) e.preventDefault();
  },
  move(e) {
    const c = this.cur; if (!c || e.pointerId !== c.pid) return;
    const p = this.pt(e), sp = c.spec;
    const dx = p.x - c.x0, dy = p.y - c.y0;
    if (!c.moved && Math.hypot(dx, dy) > 10) { c.moved = true; if (sp.hold && !sp.holdMoveOk) { clearTimeout(c.holdT); if (sp.onHoldEnd) sp.onHoldEnd(false); } }
    c.path.push(p); if (c.path.length > 400) c.path.splice(1, 1);
    if (sp.drag && c.moved) {
      c.el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.08) rotate(' + clamp(dx * 0.04, -8, 8) + 'deg)';
      if (c.z0 === undefined) c.z0 = c.el.style.zIndex;        /* its own layer, given back on release */
      c.el.style.zIndex = 45;
      if (sp.onDragMove) sp.onDragMove(p);
    }
    if (sp.rotate) {
      const RS = typeof sp.rotate === 'function' ? sp.rotate() : sp.rotate;
      const cx = RS.cx, cy = RS.cy;
      const a = Math.atan2(p.y - cy, p.x - cx);
      if (c.rot != null) { let d = a - c.rot; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; c.acc += d; }
      c.rot = a;
      const step = (RS.step || 60) * Math.PI / 180;
      while (c.acc >= step) { c.acc -= step; c.emitted = true; gesture('rotate', { id: sp.id, dir: 1 }); }
      while (c.acc <= -step) { c.acc += step; c.emitted = true; gesture('rotate', { id: sp.id, dir: -1 }); }
    }
    if (sp.stretch) {
      const SS = typeof sp.stretch === 'function' ? sp.stretch() : sp.stretch;
      const ax = SS.axis === 'y' ? -dy : dx;
      const u = Math.floor((ax + SS.unit * 0.5) / SS.unit);
      if (u !== c.units) { c.emitted = true; gesture('stretch', { id: sp.id, delta: u - c.units }); c.units = u; }
    }
    if (sp.rub) {
      const ddx = p.x - c.x; if (Math.abs(ddx) > 6) { if (c.lastDx && Math.sign(ddx) !== Math.sign(c.lastDx)) c.rev++; c.lastDx = ddx; }
      if (!c.done && (c.rev >= 2 || this.pathLen(c.path) > 160)) { c.done = true; c.el.classList.remove('press'); gesture('rub', { id: sp.id }); }
    }
    if (sp.slide) this.slideStep(p);
    if (sp.draw) sp.draw.move(p);
    c.x = p.x; c.y = p.y;
    if (e.cancelable) e.preventDefault();
  },
  slideStep(p) {
    const c = this.cur, sp = c.spec;
    let hit = null, bd = 1e9;   /* nearest station whose widened corridor contains the finger */
    sp.slide.forEach(s => { const b = s.rect(); if (p.x >= b.x - b.w * 0.25 && p.x <= b.x + b.w * 1.25 && p.y >= b.y - b.h * 0.25 && p.y <= b.y + b.h * 1.25) { const d = Math.hypot(p.x - b.x - b.w / 2, p.y - b.y - b.h / 2); if (d < bd) { bd = d; hit = s; } } });
    if (hit && c.passed[c.passed.length - 1] !== hit.id) { c.passed.push(hit.id); gesture('pass', { id: sp.id, at: hit.id }); }
  },
  pathLen(path) { let L = 0; for (let i = 1; i < path.length; i++) L += Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y); return L; },
  within(e, p, k) {
    const b = e._box ? e._box() : box(e);
    const mx = b.w * (k - 1) / 2, my = b.h * (k - 1) / 2;
    return p.x >= b.x - mx && p.x <= b.x + b.w + mx && p.y >= b.y - my && p.y <= b.y + b.h + my;
  },
  up(e) {
    const c = this.cur; if (!c || e.pointerId !== c.pid) return;
    this.cur = null;
    const sp = c.spec, t = c.el, p = this.pt(e);
    clearTimeout(c.holdT);
    t.classList.remove('press');
    try { t.releasePointerCapture(e.pointerId); } catch (err) {}
    if (c.done) return;
    if (sp.draw) { c.path.push(p); sp.draw.end(); gesture('stroke', { id: sp.id, pts: c.path.map(q => [Math.round(q.x * 10) / 10, Math.round(q.y * 10) / 10]) }); return; }   /* one written stroke */
    if (sp.hold && !c.moved) { if (sp.onHoldEnd) sp.onHoldEnd(false); if (sp.tapOk) return this.emitTap(sp); return; }
    if (sp.slide) { const last = c.passed[c.passed.length - 1]; if (last) { gesture('pick', { id: sp.id, at: last }); return; } }
    if (sp.drag && c.moved) {
      const drop = this.findDrop(sp, p);
      if (drop) { t.style.zIndex = c.z0 || ''; gesture('drop', { id: sp.id, to: drop }); this.fails = 0; }
      else { this.snapBack(t, c.z0); this.fail(); }
      if (sp.onDragEnd) sp.onDragEnd(!!drop);
      return;
    }
    if (sp.arc && c.moved) { if (this.isArc(c.path)) { gesture('arc', { id: sp.id }); this.fails = 0; } else this.fail(); return; }
    if ((sp.swipe || sp.flick) && c.moved) {
      const dx = p.x - c.x0, dy = p.y - c.y0, L = Math.hypot(dx, dy);
      if (L < 30) { this.fail(); return; }
      const ang = Math.atan2(dy, dx) * 180 / Math.PI;
      if (sp.swipe) {
        const dirs = { right: 0, down: 90, left: 180, up: -90 };
        const d = Object.keys(dirs).find(k => Math.abs(((ang - dirs[k] + 540) % 360) - 180) <= 35);
        if (d && sp.swipe.includes(d)) { gesture('swipe', { id: sp.id, dir: d }); this.fails = 0; } else this.fail();
      } else {
        const tg = (typeof sp.flick === 'function' ? sp.flick(p, c) : sp.flick).find(f => { const cc = f.center(); const ta = Math.atan2(cc.y - c.y0, cc.x - c.x0) * 180 / Math.PI; return Math.abs(((ang - ta + 540) % 360) - 180) <= 35; });
        if (tg) { gesture('drop', { id: sp.id, to: tg.id }); this.fails = 0; } else this.fail();
      }
      return;
    }
    if (sp.sweep && c.moved) {
      const ids = [];
      sp.sweep().forEach(r => { if (c.path.some(q => { const b = r.rect(); return q.x >= b.x - b.w * 0.25 && q.x <= b.x + b.w * 1.25 && q.y >= b.y - b.h * 0.25 && q.y <= b.y + b.h * 1.25; })) ids.push(r.id); });
      if (ids.length) { gesture('sweep', { id: sp.id, ids }); this.fails = 0; } else this.fail();
      return;
    }
    if (sp.rotate || sp.stretch) {
      if (sp.onRelease) sp.onRelease();
      if (!c.emitted && (!c.moved || this.within(t, p, 1.5))) this.emitTap(sp);   /* nothing turned / stretched: it was a tap */
      return;
    }
    if (!c.moved || this.within(t, p, 1.5)) this.emitTap(sp);
  },
  emitTap(sp) { if (sp.tap === false) return; gesture('tap', { id: sp.id }); this.fails = 0; },
  cancel(e) {
    const c = this.cur; if (!c || e.pointerId !== c.pid) return;
    this.cur = null; clearTimeout(c.holdT);
    c.el.classList.remove('press');
    if (c.spec.drag && c.moved) this.snapBack(c.el, c.z0);
    if (c.spec.hold && c.spec.onHoldEnd) c.spec.onHoldEnd(false);
    if (c.spec.draw) c.spec.draw.cancel();
  },
  /* rotation / exit / teardown: drop any gesture in flight, objects spring home */
  abort() {
    const c = this.cur; if (!c) return;
    this.cur = null; clearTimeout(c.holdT);
    try { c.el.releasePointerCapture(c.pid); } catch (err) {}
    c.el.classList.remove('press');
    if (c.spec.drag && c.moved) this.snapBack(c.el, c.z0);
    if (c.spec.hold && c.spec.onHoldEnd) c.spec.onHoldEnd(false);
    if (c.spec.draw) c.spec.draw.cancel();
  },
  findDrop(sp, p) {
    const drops = typeof sp.drops === 'function' ? sp.drops() : (sp.drops || []);
    let best = null, bd = 1e9;
    drops.forEach(d => {
      const b = d.rect(); const mx = b.w * 0.25, my = b.h * 0.25;
      if (p.x >= b.x - mx && p.x <= b.x + b.w + mx && p.y >= b.y - my && p.y <= b.y + b.h + my) {
        const dd = Math.hypot(p.x - (b.x + b.w / 2), p.y - (b.y + b.h / 2));
        if (dd < bd) { bd = dd; best = d.id; }
      }
    });
    return best;
  },
  snapBack(t, z0) {
    const a = t.animate([{ transform: t.style.transform || 'none' }, { transform: 'none' }], { duration: T(260), easing: EASE.pop });
    t.style.transform = ''; t.style.zIndex = z0 || '';
    a.onfinish = () => {};
  },
  isArc(path) {
    if (path.length < 4) return false;
    const a = path[0], b = path[path.length - 1], L = Math.hypot(b.x - a.x, b.y - a.y);
    if (L < 40) return false;
    let hmax = 0;
    path.forEach(q => { const h = Math.abs((b.x - a.x) * (a.y - q.y) - (a.x - q.x) * (b.y - a.y)) / L; if (h > hmax) hmax = h; });
    return hmax >= 22;
  },
  fail() { this.fails++; if (this.fails >= 2) { this.fails = 0; if (typeof Session !== 'undefined') Session.reteach(); } },
};

/* ---- from 点点岛: actors (lines 1488-1559) ---- */
/* ================================================================ ACTORS (the client's stickers, never redrawn) */
const REACT = {
  hop: [{ transform: 'translateY(0)' }, { transform: 'translateY(-16%) scale(1.03,.97)' }, { transform: 'translateY(0) scale(1.06,.92)' }, { transform: 'translateY(0)' }],
  spin: [{ transform: 'scaleX(1)' }, { transform: 'scaleX(-1)' }, { transform: 'scaleX(1)' }],
  flip: [{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(-26%) rotate(-180deg)' }, { transform: 'translateY(0) rotate(-360deg)' }],
  belly: [{ transform: 'scale(1,1)' }, { transform: 'scale(1.12,.9)' }, { transform: 'scale(.94,1.06)' }, { transform: 'scale(1.05,.96)' }, { transform: 'scale(1,1)' }],
  sway: [{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(0)' }],
  nod: [{ transform: 'rotate(0)' }, { transform: 'rotate(5deg) translateY(2%)' }, { transform: 'rotate(0)' }, { transform: 'rotate(5deg) translateY(2%)' }, { transform: 'rotate(0)' }],
  squash: [{ transform: 'scale(1,1)' }, { transform: 'scale(1.15,.82)' }, { transform: 'scale(.95,1.08)' }, { transform: 'scale(1,1)' }],
  rear: [{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg) translateY(-4%)' }, { transform: 'rotate(0)' }],
  pounce: [{ transform: 'translate(0,0) scale(1,1)' }, { transform: 'translate(0,4%) scale(1.08,.88)' }, { transform: 'translate(8%,-22%) rotate(8deg)' }, { transform: 'translate(0,0)' }],
  thrust: [{ transform: 'translateY(0)' }, { transform: 'translateY(-22%)' }, { transform: 'translateY(-18%)' }, { transform: 'translateY(0)' }],
};
const KIND2ANIM = { hop: 'hop', dino: 'hop', belly: 'belly', twirl: 'spin', dance: 'sway', spin: 'spin', silly: 'squash', laugh: 'hop', lift: 'hop', eyes: 'nod', steel: 'squash', fire: 'nod', water: 'nod', vanish: 'hop', glow: 'hop', nod: 'nod', sway: 'sway', pinch: 'squash', thumbs: 'hop', salute: 'nod', tumble: 'flip', flip: 'flip', wag: 'sway', splash: 'hop', stomp: 'squash', bow: 'nod', rear: 'rear', thrust: 'thrust', shield: 'hop', zap: 'hop', smash: 'squash', aim: 'nod', hang: 'hop', blink: 'hop', pounce: 'pounce' };

class Actor {
  constructor(id, parent, h, scope) {
    this.id = id; this.scope = scope || APP;
    const m = META[id] || [400, 500, []];
    this.h = h; this.w = Math.round(h * m[0] / m[1]);
    this.root = el('div', 'actor', parent);
    this.root._actorId = id;
    this.root.style.width = this.w + 'px'; this.root.style.height = this.h + 'px';
    el('div', 'shadow', this.root);
    this.body = el('div', 'body', this.root);
    this.body.style.animationDelay = (-Math.random() * 3).toFixed(2) + 's';
    this.img = img('assets/chars/' + id + '.png', 'spr', this.body);
    this.lids = (m[2] || []).map(([x, y, rx, ry, c]) => {
      const d = el('div', 'lid', this.body);
      Object.assign(d.style, { left: ((x - rx) * 100) + '%', top: ((y - ry) * 100) + '%', width: (rx * 200) + '%', height: (ry * 200) + '%', background: c });
      return d;
    });
    this.x = 0; this.y = 0; this.facing = 1;
    if (this.lids.length) this.blinkLoop();
    this.root._box = () => ({ x: this.x - this.w / 2, y: this.y - this.h, w: this.w, h: this.h });
  }
  blinkLoop() {
    const go = () => { if (this.dead) return; this.root.classList.add('blink'); this.scope.timeout(() => { this.root.classList.remove('blink'); if (Math.random() < 0.18) { this.scope.timeout(() => { this.root.classList.add('blink'); this.scope.timeout(() => this.root.classList.remove('blink'), 190); }, 240); } }, 190); this.scope.timeout(go, 2400 + Math.random() * 3600); };
    this.scope.timeout(go, 800 + Math.random() * 3000);
  }
  at(x, y) { this.x = x; this.y = y; place(this.root, Math.round(x - this.w / 2), Math.round(y - this.h), this.w, this.h); this.root.style.setProperty('--hx', Math.max(10, Math.ceil((88 - this.w) / 2) + 1) + 'px'); return this; }
  size(h) { this.h = h; this.w = Math.round(h * (META[this.id] || [4, 5])[0] / (META[this.id] || [4, 5])[1]); return this.at(this.x, this.y); }
  face(d) { this.facing = d; this.img.style.transform = d < 0 ? 'scaleX(-1)' : ''; return this; }
  async moveTo(x, y, dur, arc) {
    const dx = x - this.x, dy = y - this.y;
    const kf = arc ? [{ transform: 'translate(0,0)' }, { transform: 'translate(' + dx / 2 + 'px,' + (dy / 2 - arc) + 'px) rotate(' + (dx > 0 ? 6 : -6) + 'deg)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px)' }]
      : [{ transform: 'translate(0,0)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px)' }];
    await this.scope.anim(this.root, kf, { duration: dur == null ? 500 : dur, easing: arc ? EASE.glide : EASE.out });
    if (this.dead) return;
    this.root.getAnimations().forEach(a => { try { a.cancel(); } catch (e) {} });
    this.at(x, y);
  }
  react(kind) {
    const k = kind || (CHARS[this.id] || [])[1] || 'hop';
    const a = KIND2ANIM[k] || 'hop';
    this.scope.anim(this.body, REACT[a], { duration: a === 'flip' ? 700 : 560, easing: EASE.glide, fill: 'none' });
    Fx.charEffect(this, k);
    return this;
  }
  hop() { this.scope.anim(this.body, REACT.hop, { duration: 460, fill: 'none' }); return this; }
  cheer() { this.scope.anim(this.body, REACT.hop, { duration: 420, iterations: 2, fill: 'none' }); return this; }
  lookAt(x, y) { const d = x < this.x ? -1 : 1, up = y != null && y < this.y - this.h ? -3 : 0; this.scope.anim(this.body, [{ transform: 'translate(0,0) rotate(0)' }, { transform: 'translate(' + (d * 4) + '%,' + up + '%) rotate(' + (d * 7) + 'deg)', offset: 0.25 }, { transform: 'translate(' + (d * 4) + '%,' + up + '%) rotate(' + (d * 7) + 'deg)', offset: 0.75 }, { transform: 'translate(0,0) rotate(0)' }], { duration: 1100, easing: EASE.glide, fill: 'none' }); return this; }
  /* §3.10 idle life. glance: leans towards the child (k < 1 = a small one); wave: a call; yawn: a big slow stretch */
  glance(k) { k = k || 1; const f = 'translateY(' + (-2.5 * k) + '%) scale(' + (1 + 0.045 * k) + ')'; this.scope.anim(this.body, [{ transform: 'translateY(0) scale(1)' }, { transform: f, offset: 0.3 }, { transform: f, offset: 0.7 }, { transform: 'translateY(0) scale(1)' }], { duration: 1000, easing: EASE.glide, fill: 'none' }); return this; }
  wave() { this.scope.anim(this.body, [{ transform: 'rotate(0) translateY(0)' }, { transform: 'rotate(-8deg) translateY(-4%)', offset: 0.18 }, { transform: 'rotate(8deg) translateY(-4%)', offset: 0.42 }, { transform: 'rotate(-8deg) translateY(-4%)', offset: 0.66 }, { transform: 'rotate(0) translateY(0)' }], { duration: 850, easing: 'ease-in-out', fill: 'none' }); return this; }
  yawn() {
    this.scope.anim(this.body, [{ transform: 'scale(1,1) rotate(0)' }, { transform: 'scale(.96,1.09) rotate(-3deg)', offset: 0.45 }, { transform: 'scale(.96,1.09) rotate(-3deg)', offset: 0.65 }, { transform: 'scale(1.04,.95) rotate(0)', offset: 0.85 }, { transform: 'scale(1,1) rotate(0)' }], { duration: 1250, easing: EASE.glide, fill: 'none' });
    Fx.zz(this.x + this.w * 0.22, this.y - this.h * 0.92);
    return this;
  }
  destroy() { this.dead = true; this.root.remove(); }
}

/* ---- from 点点岛: icons (lines 1711-1727) ---- */
const ICONS = {
  check: '<svg viewBox="0 0 40 40"><path d="M8 21 L17 30 L33 11" fill="none" stroke="#2B2118" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 21 L17 30 L33 11" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  flame: '<svg viewBox="0 0 40 40"><path d="M20 4C24 12 31 15 31 25C31 32 26 37 20 37C14 37 9 32 9 25C9 19 13 16 15 11C17 16 18 17 20 18C21 13 20 8 20 4Z" fill="#FF8A3C" stroke="#2B2118" stroke-width="3.5" stroke-linejoin="round"/><path d="M20 22C23 26 25 27 25 30C25 33 23 35 20 35C17 35 15 33 15 30C15 27 18 25 20 22Z" fill="#FFE06A"/></svg>',
  bell: '<svg viewBox="0 0 40 40"><path d="M6 30H34C34 20 28 13 20 13C12 13 6 20 6 30Z" fill="#E8EEF5" stroke="#2B2118" stroke-width="3.5" stroke-linejoin="round"/><rect x="4" y="30" width="32" height="6" rx="3" fill="#6B7A8C" stroke="#2B2118" stroke-width="3"/><circle cx="20" cy="10" r="3.5" fill="#fff" stroke="#2B2118" stroke-width="3"/></svg>',
  puddle: '<svg viewBox="0 0 40 40"><ellipse cx="20" cy="28" rx="16" ry="8" fill="#9A6433" stroke="#2B2118" stroke-width="3.5"/><path d="M11 18l-3-6M20 16v-8M29 18l3-6" stroke="#9A6433" stroke-width="4" stroke-linecap="round"/><ellipse cx="15" cy="26" rx="4" ry="1.6" fill="#C98E5B"/></svg>',
  thumb: '<svg viewBox="0 0 40 40"><path d="M9 18H15V34H9Z" fill="#FFC93C" stroke="#2B2118" stroke-width="3.2" stroke-linejoin="round"/><path d="M15 18L21 6C24 6 25 9 24 12L23 17H31C34 17 35 20 34 23L31 32C30 34 29 34 27 34H15Z" fill="#FFE08A" stroke="#2B2118" stroke-width="3.2" stroke-linejoin="round"/></svg>',
  gong: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#F5B324" stroke="#2B2118" stroke-width="3.5"/><circle cx="20" cy="20" r="6" fill="#FFE08A" stroke="#2B2118" stroke-width="2.5"/></svg>',
  torch: '<svg viewBox="0 0 40 40"><rect x="17" y="18" width="6" height="18" rx="2" fill="#9A6433" stroke="#2B2118" stroke-width="3"/><path d="M20 4C23 9 27 11 27 16C27 20 24 22 20 22C16 22 13 20 13 16C13 12 17 10 20 4Z" fill="#FF8A3C" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/></svg>',
  paw: '<svg viewBox="0 0 40 40"><ellipse cx="20" cy="26" rx="9" ry="8" fill="#fff" stroke="#2B2118" stroke-width="3.2"/><circle cx="10" cy="16" r="4" fill="#fff" stroke="#2B2118" stroke-width="3"/><circle cx="16" cy="10" r="4" fill="#fff" stroke="#2B2118" stroke-width="3"/><circle cx="24" cy="10" r="4" fill="#fff" stroke="#2B2118" stroke-width="3"/><circle cx="30" cy="16" r="4" fill="#fff" stroke="#2B2118" stroke-width="3"/></svg>',
  fist: '<svg viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="20" rx="7" fill="#8AC540" stroke="#2B2118" stroke-width="3.5"/><path d="M14 12v8M20 12v8M26 12v8" stroke="#2B2118" stroke-width="2.5"/></svg>',
  arrowR: '<svg viewBox="0 0 34 34"><path d="M5 17H24M17 9L26 17L17 25" fill="none" stroke="#2B2118" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  eye: '<svg viewBox="0 0 40 40"><path d="M3 20C9 10 31 10 37 20C31 30 9 30 3 20Z" fill="#fff" stroke="#2B2118" stroke-width="3.2"/><circle cx="20" cy="20" r="6" fill="#2B2118"/></svg>',
  q: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#FFC93C" stroke="#2B2118" stroke-width="3.5"/><path d="M15 15C15 11 18 9 20.5 9C24 9 26 11 26 14C26 18 21 19 21 23" fill="none" stroke="#2B2118" stroke-width="4" stroke-linecap="round"/><circle cx="21" cy="29" r="2.6" fill="#2B2118"/></svg>',
  eq: '<svg viewBox="0 0 40 40"><rect x="7" y="12" width="26" height="6" rx="3" fill="#2B2118"/><rect x="7" y="23" width="26" height="6" rx="3" fill="#2B2118"/></svg>',
  hand: '<svg viewBox="0 0 64 64"><path d="M22 34V11C22 7 28 7 28 11V29L28 24C28 20 34 20 34 24V30L34 26C34 22 40 22 40 26V32L40 29C40 25 46 25 46 29V42C46 52 40 58 32 58H29C23 58 20 55 17 50L10 39C8 35 12 32 15 35L22 42" fill="#fff" stroke="#2B2118" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  speaker: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#FFC93C" stroke="#2B2118" stroke-width="2" stroke-linejoin="round"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#2B2118" stroke-width="2" stroke-linecap="round"/></svg>',
};

/* ---- from 点点岛: fx + hand (lines 1729-1842) ---- */
/* ================================================================ FX (celebration layer, screen coords) */
const Fx = {
  layer: null,
  init() { this.layer = $('#fx'); },
  burst(x, y, opt) {                      /* stage coords in, screen out */
    opt = opt || {};
    const p = opt.screen ? { x, y } : Stage.toScreen(x, y);
    const n = opt.n || 10, cols = opt.colors || ['#FFC93C', '#FF6B5B', '#4FB3FF', '#5CC46E', '#8E6CFF', '#FF9F43'];
    for (let i = 0; i < n; i++) {
      const d = el('div', 'spark', this.layer);
      const sz = (opt.size || 12) * (0.6 + Math.random() * 0.8);
      Object.assign(d.style, { left: p.x + 'px', top: p.y + 'px', width: sz + 'px', height: sz + 'px', background: cols[i % cols.length], borderRadius: opt.square ? '3px' : '50%', boxShadow: '0 0 0 2px #2B2118' });
      const a = Math.random() * Math.PI * 2, dist = (opt.dist || 90) * (0.5 + Math.random() * 0.8);
      const an = d.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 }, { transform: 'translate(' + (Math.cos(a) * dist - sz / 2) + 'px,' + (Math.sin(a) * dist - sz / 2 + (opt.fall ? 60 : 0)) + 'px) scale(1) rotate(' + (Math.random() * 360) + 'deg)', opacity: 0 }], { duration: T(opt.dur || 700) + 1, easing: EASE.out, fill: 'forwards' });
      an.onfinish = () => d.remove();
    }
  },
  confetti(n, sc) {                       /* sc: the question it celebrates - its end fades what is still falling */
    const W = window.innerWidth;
    for (let i = 0; i < (n || 40); i++) {
      const d = el('div', 'spark', this.layer);
      if (sc) sc.add(() => { if (d.isConnected) d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }).onfinish = () => d.remove(); });
      const c = ['#FFC93C', '#FF6B5B', '#4FB3FF', '#5CC46E', '#8E6CFF', '#FF9F43', '#FF7FA8'][i % 7];
      Object.assign(d.style, { left: (Math.random() * W) + 'px', top: '-20px', width: '12px', height: '16px', background: c, borderRadius: '3px', boxShadow: '0 0 0 2px #2B2118' });
      const an = d.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(' + (window.innerHeight + 60) + 'px) rotate(' + (360 + Math.random() * 720) + 'deg) translateX(' + (Math.random() * 120 - 60) + 'px)' }], { duration: T(1600 + Math.random() * 1200) + 1, delay: T(Math.random() * 500), easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'forwards' });
      an.onfinish = () => d.remove();
    }
  },
  /* character-specific outside effects; the sticker itself is never altered */
  charEffect(a, kind) {
    const b = a.root._box(), cx = b.x + b.w / 2, top = b.y;
    const eye = (META[a.id] && META[a.id][2] && META[a.id][2][0]) ? { x: b.x + META[a.id][2][0][0] * b.w, y: b.y + META[a.id][2][0][1] * b.h } : { x: cx, y: top + b.h * 0.3 };
    const mouth = { x: eye.x + b.w * 0.08, y: eye.y + b.h * 0.12 };
    switch (kind) {
      case 'fire': Sfx.fire(); this.burst(mouth.x + 40, mouth.y, { n: 12, colors: ['#FF8A3C', '#FFD34D', '#FF5B3C'], dist: 70 }); break;
      case 'water': case 'splash': Sfx.splash(); this.burst(mouth.x + 30, mouth.y, { n: 12, colors: ['#7FD3FF', '#4FB3FF', '#FFFFFF'], dist: 70, fall: true }); break;
      case 'zap': Sfx.zap(); this.bolt(cx, top - 20); break;
      case 'smash': case 'stomp': Sfx.thud(); this.shake(); this.burst(cx, b.y + b.h, { n: 10, colors: ['#C9B08A', '#E8D7B5'], dist: 60 }); break;
      case 'dino': Sfx.boing(); this.bubble(a, '🦖'); break;
      case 'belly': Sfx.boing(); break;
      case 'thrust': Sfx.whoosh(0.5); this.burst(cx, b.y + b.h, { n: 14, colors: ['#FFD34D', '#FF8A3C', '#FFFFFF'], dist: 50, fall: true }); break;
      case 'shield': Sfx.whoosh(0.4); this.disc(cx, top + b.h * 0.4); break;
      case 'vanish': case 'blink': Sfx.sparkle(); a.scope.anim(a.body, [{ opacity: 1 }, { opacity: 0.15 }, { opacity: 0.15 }, { opacity: 1 }], { duration: 900, fill: 'none' }); break;
      case 'glow': case 'eyes': case 'steel': Sfx.sparkle(); this.burst(cx, top + b.h * 0.35, { n: 12, colors: ['#FFFFFF', '#FFE06A', '#C9A7FF'], dist: 80 }); break;
      case 'flip': case 'tumble': Sfx.whoosh(0.3); break;
      case 'aim': Sfx.whoosh(0.25); this.arrow(cx, top + b.h * 0.45); break;
      case 'hang': Sfx.whoosh(0.3); break;
      default: Sfx.tap(); this.burst(cx, top + 10, { n: 6, dist: 50 });
    }
  },
  bubble(a, glyph) {
    const b = a.root._box(), p = Stage.toScreen(b.x + b.w * 0.8, b.y + 10);
    const d = el('div', '', this.layer);
    Object.assign(d.style, { left: p.x + 'px', top: p.y + 'px', width: '64px', height: '64px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 3px #2B2118', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' });
    d.textContent = glyph;
    const an = d.animate([{ transform: 'translate(-50%,-50%) scale(0)' }, { transform: 'translate(-50%,-90%) scale(1)', offset: 0.3 }, { transform: 'translate(-50%,-90%) scale(1)', offset: 0.8 }, { transform: 'translate(-50%,-110%) scale(.6)', opacity: 0 }], { duration: T(1100) + 1, easing: EASE.out, fill: 'forwards' });
    an.onfinish = () => d.remove();
  },
  bolt(x, y) {
    const p = Stage.toScreen(x, y);
    const s = svg('svg', { viewBox: '0 0 60 120', width: 60, height: 120 }, this.layer);
    Object.assign(s.style, { position: 'absolute', left: (p.x - 30) + 'px', top: (p.y - 110) + 'px' });
    svg('path', { d: 'M34 2 L10 64 L28 64 L18 118 L52 44 L32 44 L46 2 Z', fill: '#FFE14A', stroke: '#2B2118', 'stroke-width': 4, 'stroke-linejoin': 'round' }, s);
    const an = s.animate([{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 0.4, offset: 0.3 }, { opacity: 1, offset: 0.45 }, { opacity: 0 }], { duration: T(700) + 1, fill: 'forwards' });
    an.onfinish = () => s.remove();
  },
  disc(x, y) {
    const p = Stage.toScreen(x, y);
    const s = svg('svg', { viewBox: '0 0 60 60', width: 60, height: 60 }, this.layer);
    Object.assign(s.style, { position: 'absolute', left: (p.x - 30) + 'px', top: (p.y - 30) + 'px' });
    [28, 21, 14].forEach((r, i) => svg('circle', { cx: 30, cy: 30, r, fill: ['#E23B3B', '#FFFFFF', '#E23B3B'][i], stroke: '#2B2118', 'stroke-width': 3 }, s));
    svg('circle', { cx: 30, cy: 30, r: 8, fill: '#2E6FD8', stroke: '#2B2118', 'stroke-width': 2.5 }, s);
    const an = s.animate([{ transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(180px) rotate(360deg)', offset: 0.5 }, { transform: 'translateX(0) rotate(720deg)' }], { duration: T(900) + 1, easing: EASE.glide, fill: 'forwards' });
    an.onfinish = () => s.remove();
  },
  arrow(x, y) {
    const p = Stage.toScreen(x, y);
    const s = svg('svg', { viewBox: '0 0 90 20', width: 90, height: 20 }, this.layer);
    Object.assign(s.style, { position: 'absolute', left: p.x + 'px', top: (p.y - 10) + 'px' });
    svg('path', { d: 'M4 10H74', stroke: '#2B2118', 'stroke-width': 4, 'stroke-linecap': 'round' }, s);
    svg('path', { d: 'M70 3L86 10L70 17Z', fill: '#8E6CFF', stroke: '#2B2118', 'stroke-width': 3, 'stroke-linejoin': 'round' }, s);
    const an = s.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(320px)', opacity: 0 }], { duration: T(600) + 1, easing: EASE.out, fill: 'forwards' });
    an.onfinish = () => s.remove();
  },
  zz(x, y) {
    const p = Stage.toScreen(x, y);
    [0, 1].forEach(i => {
      const sz = 40 - i * 12;
      const s = svg('svg', { viewBox: '0 0 20 20', width: sz, height: sz }, this.layer);
      Object.assign(s.style, { position: 'absolute', left: (p.x + i * 20) + 'px', top: (p.y - i * 18) + 'px', opacity: 0 });
      svg('path', { d: 'M4 4H16L4 16H16', fill: 'none', stroke: '#2B2118', 'stroke-width': 5.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
      svg('path', { d: 'M4 4H16L4 16H16', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
      const an = s.animate([{ transform: 'translate(0,0) scale(.4)', opacity: 0 }, { transform: 'translate(8px,-18px) scale(1)', opacity: 1, offset: 0.3 }, { transform: 'translate(12px,-30px) scale(1)', opacity: 1, offset: 0.7 }, { transform: 'translate(18px,-52px) scale(1)', opacity: 0 }], { duration: T(1500) + 1, delay: T(i * 260), easing: EASE.out, fill: 'both' });
      an.onfinish = () => s.remove();
    });
  },
  shake() { const g = $('#stage'); g.animate([{ translate: '0 0' }, { translate: '-6px 3px' }, { translate: '5px -4px' }, { translate: '-3px 2px' }, { translate: '0 0' }], { duration: T(360) + 1 }); },
};

/* ================================================================ GHOST HAND (demos & hints; never answers by itself) */
const Hand = {
  el: null, busy: 0,
  make() { if (!this.el) { this.el = el('div', 'hand', $('#stage')); this.el.innerHTML = ICONS.hand; this.el.style.opacity = 0; } else if (!this.el.isConnected) $('#stage').appendChild(this.el); return this.el; },
  async go(scope, x, y, dur) { const h = this.make(); h.style.opacity = 1; await scope.anim(h, [{ left: h.style.left || (x + 'px'), top: h.style.top || (y + 'px') }, { left: (x - 22) + 'px', top: (y - 6) + 'px' }], { duration: dur || 450, easing: EASE.glide, commit: true }); h.style.left = (x - 22) + 'px'; h.style.top = (y - 6) + 'px'; },
  async tap(scope, x, y) { const h = this.make(); await this.go(scope, x, y); await scope.anim(h, [{ transform: 'scale(1)' }, { transform: 'scale(.82)' }, { transform: 'scale(1)' }], { duration: 300, fill: 'none' }); },
  async hold(scope, x, y, ms) { const h = this.make(); await this.go(scope, x, y); await scope.anim(h, [{ transform: 'scale(1)' }, { transform: 'scale(.84)', offset: 0.15 }, { transform: 'scale(.84)', offset: 0.85 }, { transform: 'scale(1)' }], { duration: ms || 900, fill: 'none' }); },
  async drag(scope, x0, y0, x1, y1, dur) { await this.go(scope, x0, y0); const h = this.make(); await scope.anim(h, [{ transform: 'scale(.84)' }, { transform: 'scale(.84)' }], { duration: 120 }); await scope.anim(h, [{ left: (x0 - 22) + 'px', top: (y0 - 6) + 'px' }, { left: (x1 - 22) + 'px', top: (y1 - 6) + 'px' }], { duration: dur || 700, easing: EASE.glide, commit: true }); h.style.left = (x1 - 22) + 'px'; h.style.top = (y1 - 6) + 'px'; h.style.transform = ''; },
  async arc(scope, x0, y0, x1, y1) { await this.go(scope, x0, y0); const h = this.make(); const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 90; await scope.anim(h, [{ left: (x0 - 22) + 'px', top: (y0 - 6) + 'px' }, { left: (mx - 22) + 'px', top: (my - 6) + 'px' }, { left: (x1 - 22) + 'px', top: (y1 - 6) + 'px' }], { duration: 800, easing: EASE.glide, commit: true }); h.style.left = (x1 - 22) + 'px'; h.style.top = (y1 - 6) + 'px'; },
  async rub(scope, x, y) { await this.go(scope, x, y); const h = this.make(); await scope.anim(h, [{ left: (x - 62) + 'px' }, { left: (x + 18) + 'px' }, { left: (x - 62) + 'px' }, { left: (x + 18) + 'px' }, { left: (x - 22) + 'px' }], { duration: 900, commit: true }); },
  async circle(scope, x, y, r) { await this.go(scope, x + r, y); const h = this.make(); const kf = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI * 2; kf.push({ left: (x + Math.cos(a) * r - 22) + 'px', top: (y + Math.sin(a) * r - 6) + 'px' }); } await scope.anim(h, kf, { duration: 1100, commit: true }); },
  hide(scope) { if (!this.el) return; const h = this.el; (scope || APP).anim(h, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, commit: true }).then(() => { h.style.opacity = 0; }); },
  done() { this.busy = Math.max(0, this.busy - 1); },
  kill() { this.busy = 0; if (this.el) { this.el.getAnimations().forEach(a => a.cancel()); this.el.style.opacity = 0; } },
};

/* ---- from 点点岛: bags (lines 1937-1977) ---- */
/* bags: balanced sequences that defeat fixed-position / fixed-rank / fixed-meaning strategies */
function bagPick(G, name, items) {
  const b = G.bags[name] || (G.bags[name] = []);
  if (!b.length) b.push(...G.rng.shuffle(items));
  return b.shift();
}
/* three numeric options for answer cards; rank of the correct value balanced by the size bag */
/* The RANK of the correct value among the three (smallest / middle / largest) is dealt from a bag, restricted to the
   ranks this value allows inside [lo, hi]; a rank that does not fit stays in the bag for a later question. So "always
   the smallest / middle / largest card" is right about one time in three over any stretch - also at the range ends. */
function numOptions(G, n, lo, hi) {
  lo = lo == null ? 1 : lo; hi = hi == null ? 20 : hi;
  const ok = { min: n + 2 <= hi, mid: n - 1 >= lo && n + 1 <= hi, max: n - 2 >= lo };
  if (G.wantRank) {
    /* Session.genQ dealt this question's rank; if this answer cannot take it, the question is drawn again */
    let r = G.wantRank;
    if (!ok[r]) { G.rankMiss = true; const f = ['min', 'mid', 'max'].filter(x => ok[x]); r = f.length ? f[Math.floor(G.rng() * f.length)] : 'mid'; }
    const set = r === 'min' ? [n, n + 1, n + 2] : r === 'mid' ? [n - 1, n, n + 1] : [n - 2, n - 1, n];
    return placeOptions(G, set, n);
  }
  const b = G.bags.rank || (G.bags.rank = []);
  if (!b.length) b.push(...G.rng.shuffle(['min', 'mid', 'max']));
  let i = b.findIndex(r => ok[r]), r;
  if (i >= 0) { r = b[i]; b.splice(i, 1); }
  else {
    const fresh = G.rng.shuffle(['min', 'mid', 'max']), j = fresh.findIndex(x => ok[x]);
    r = j >= 0 ? fresh.splice(j, 1)[0] : 'mid';
    b.push(...fresh);
  }
  const set = r === 'min' ? [n, n + 1, n + 2] : r === 'mid' ? [n - 1, n, n + 1] : [n - 2, n - 1, n];
  return placeOptions(G, set, n);
}
/* positions balanced by the position bag */
function placeOptions(G, vals, correct) {
  const pos = bagPick(G, 'pos', [0, 1, 2]);
  const others = G.rng.shuffle(vals.filter(v => v !== correct));
  const out = [];
  let k = 0;
  for (let i = 0; i < vals.length; i++) out.push(i === pos ? correct : others[k++]);
  return out;
}

/* ---- from 点点岛: screens + loader (lines 1979-2022) ---- */
/* ================================================================ SCREENS */
const Screens = {
  cur: 'entry',
  show(id) {
    if (this.cur === id) return;
    const prev = $('#' + this.cur), next = $('#' + id);
    next.classList.add('on');
    document.body.dataset.scr = id;
    next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T(320), easing: EASE.glide });
    if (id === 'map' || id === 'entry') setTimeout(() => SWU.reloadIfSafe(), 2600);     /* after the star show (R4-F01) */
    if (prev && prev !== next) { prev.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T(320), easing: EASE.glide }); setTimeout(() => { if (Screens.cur !== prev.id) prev.classList.remove('on'); }, T(330) + 10); }
    this.cur = id;
  },
};

/* ================================================================ LOADER (world waiting screen: the runner) */
const Loader = {
  urls(G) {
    const g = G.game, set = new Set();
    set.add('assets/bg/' + (G.bg || g.bg) + '.jpg');
    (g.props || []).forEach(p => set.add('assets/props/' + p + '.png'));
    (g.chars || []).forEach(c => set.add('assets/chars/' + c + '.png'));
    return Array.from(set);
  },
  load(url) { return new Promise(res => { const i = new Image(); i.onload = () => { if (i.decode) i.decode().then(res, res); else res(); }; i.onerror = () => res(); i.src = url; }); },
  async run(G) {
    const urls = this.urls(G);
    const all = Promise.all(urls.map(u => this.load(u)));
    const quick = await Promise.race([all.then(() => true), new Promise(r => setTimeout(() => r(false), 250))]);
    if (quick || fast()) return;
    const L = $('#load');
    L.style.setProperty('--world', G.W.color);
    L.style.background = G.W.color;
    const r = $('.runner', L), im = $('img', r);
    im.src = 'assets/chars/' + (G.W.runner || G.W.host) + '.png';
    Screens.show('load');
    const t0 = now();
    const run = r.animate([{ left: '-15%' }, { left: '115%' }], { duration: 2600, iterations: Infinity });
    const dust = setInterval(() => { const d = el('div', 'dust', L); const rb = r.getBoundingClientRect(); d.style.left = (rb.left + rb.width * 0.3) + 'px'; d.style.top = (rb.bottom - 20) + 'px'; const a = d.animate([{ transform: 'scale(.4)', opacity: 0.9 }, { transform: 'scale(1.6) translate(-20px,-10px)', opacity: 0 }], { duration: 600 }); a.onfinish = () => d.remove(); }, 180);
    await Promise.race([all, new Promise(r2 => setTimeout(r2, 6000))]);
    const left = 700 - (now() - t0); if (left > 0) await new Promise(r2 => setTimeout(r2, left));
    clearInterval(dust); run.cancel();
  },
};

/* ---- from 点点岛: hints + gesture + tapify (lines 2473-2630) ---- */
/* ================================================================ HINTS
   one clock (Clock.t, paused in the background) and absolute deadlines from the child's last own action:
   5 s the host leans towards the child and says the question again (then the work glows) · 10 s the host waves,
   then the gesture (how to act, never the answer) · 15 s a kind word + the question · then now and then again, waiting
   as long as it takes. CLIENT RULE: the helper never does a step, never shows the answer, and a star is only ever
   earned by the child's own right answer.
   One thing at a time: a cue first, its hint only after it and only if the child has not acted meanwhile.
   Before the first hint (the child is thinking) a friend now and then glances at the child - never the host.
   Every one of them marks the question as assisted (it can never count as mastery evidence). */
const AGAIN = ['再想一想！', '再试一次！', '你可以的，再来！'];
const CHEER = ['慢慢想，不着急', '你能行的！', '再看一看！', '我们等你哦！'];
const Hints = {
  arm(st) { this.reset(st); st.hintTimer = st.scope.interval(() => this.tick(st), 100); },
  disarm(st) { if (st && st.hintTimer) { st.scope.clear(st.hintTimer); st.hintTimer = 0; } },
  reset(st) { st.idleFrom = Clock.t(); st.hintLv = 0; st.nextAuto = 0; st.autoDue = 0; },
  touch(st) { this.reset(st); },
  mark(st, why) { st.assists.push(why + (st.phase === 'act' ? '@act' : '')); st.assistT = st.assistT || []; st.assistT.push([why, Math.round(Clock.t())]); if (st.phase !== 'act' || st.actMath) st.hinted = true; },
  tick(st) {
    if (!Session.alive(st) || !['act', 'ready', 'input'].includes(st.phase) || (st.demo && !st.childTook)) return;
    const t = Clock.t();
    if (st.hintLv === 0 && (Voice.busy() || Hand.busy)) { st.idleFrom = t; return; }   /* the ladder starts after the question was said */
    if (Hand.busy) return;
    const idle = (t - st.idleFrom) / HS();
    if (st.hintLv < 1) {
      if (idle < 5000) { this.life(st, t, idle); return; }
      st.hintLv = 1; this.mark(st, 'hint1');
      const h = Session.host(st.G); if (h && !fast()) h.glance();
      if (st.lead && st.prompt) [].concat(st.lead).forEach(l => Voice.say(l, { tag: 'hint1' }));
      Voice.say(st.prompt || st.game.intro, { tag: 'hint1' });
      this.retap();
      st.scope.timeout(() => { if (st.hintLv === 1) this.glow(st); }, 450 * HS());
      return;
    }
    if (st.hintLv < 2) { if (idle >= 10000) { st.hintLv = 2; this.mark(st, 'hint2'); this.cue(st, 'wave', 2, () => { if (st.game.gestureHint) st.game.gestureHint(st, false); }); } return; }
    if (st.hintLv < 3) { if (idle >= 15000) { st.hintLv = 3; this.mark(st, 'hint3'); this.cue(st, 'wave', 3, () => this.cheerUp(st)); } return; }
    /* client rule: the helper never does a step and never points at the answer - a kind word and the question again
       now and then (30 s, then every 20-45 s), and wait as long as it takes */
    const due = st.nextAuto || (st.idleFrom + 30000 * HS());
    if (t < due || Voice.busy()) return;
    st.cheers = (st.cheers || 0) + 1;
    st.nextAuto = t + (15000 + 5000 * Math.min(st.cheers, 6)) * HS();
    this.cheerUp(st);
  },
  cheerUp(st) {
    const h = Session.host(st.G); if (h && !fast()) h.wave();
    const leads = st.lead && st.prompt ? [].concat(st.lead) : [];
    if (leads.length < 2) Voice.say(CHEER[(st.cheers || 0) % CHEER.length], { tag: 'cheer' });     /* the queue keeps three: a two-sentence rule goes without the kind word */
    leads.forEach(l => Voice.say(l, { tag: 'hint1' }));
    Voice.say(st.prompt || st.game.intro, { tag: 'hint1' });
    this.retap();
    st.scope.timeout(() => { if (Session.alive(st)) this.glow(st); }, 900 * HS());
  },
  glow(st) { (st.game.workEls ? st.game.workEls(st) : []).forEach(e => { e.classList.add('glow'); st.scope.timeout(() => e.classList.remove('glow'), 1400); }); },
  /* the child is thinking: now and then ONE friend (never the host) glances at the child - peripheral life, not a call */
  life(st, t, idle) {
    if (!st.glanceAt) st.glanceAt = t + 3500 * HS();                 /* the first glance ~3.5 s into the thinking */
    if (st.guided || fast() || idle < 2500 || Voice.busy() || t < st.glanceAt) return;
    st.glanceAt = t + (8000 + Math.random() * 6000) * HS();
    const G = st.G, host = Session.host(G);
    const pool = Object.values(G.actors || {}).filter(a => a !== host && !a.math && !a.dead && a.x > 40 && a.x < Stage.W - 40);
    if (pool.length) pool[Math.floor(Math.random() * pool.length)].glance(0.6);
  },
  /* the host's own cue (wave / yawn) comes first and alone; the hint it introduces follows when it is over */
  cue(st, kind, lv, then) {
    const go = () => { if (Session.alive(st) && st.hintLv === lv && ['act', 'ready', 'input'].includes(st.phase)) then(); };
    const h = Session.host(st.G);
    if (!h || fast()) { go(); return; }
    if (kind === 'wave') { h.wave(); Sfx.hey(); } else { h.yawn(); Sfx.yawn(); }
    st.scope.timeout(go, (kind === 'wave' ? 850 : 1250) * HS());
  },
  /* the task card's example taps again together with the repeated question */
  retap() { $$('.task .goal .tap').forEach(e => { e.style.animation = 'none'; void e.getBoundingClientRect(); e.style.animation = ''; }); },
  point(st, step) { const t = this.target(st, step); if (!t) return; Hand.busy++; Hand.tap(st.scope, t.x, t.y).then(() => { Hand.done(); }); },
  target(st, step) { if (step.x != null) return { x: step.x, y: step.y }; const e = st.game.find ? st.game.find(st, step.p.id) : null; return e ? center(e) : null; },
  async showStep(st, step) {
    const t = this.target(st, step); if (!t) return;
    Hand.busy++;
    try {
      if (step.g === 'drop' && step.to) await Hand.drag(st.scope, t.x, t.y, step.to.x, step.to.y);
      else if (step.g === 'hold') await Hand.hold(st.scope, t.x, t.y, 700);
      else await Hand.tap(st.scope, t.x, t.y);
    } finally { Hand.done(); }
  },
};

/* ================================================================ the single gesture entry (real pointers + tests) */
function gesture(name, p, meta) {
  p = p || {};
  const system = !!(meta && meta.system);
  if (name === 'skip') { Session.fastForward(); return 'ff'; }
  if (name === 'home') { Session.home(); return 'home'; }
  if (name === 'relisten') { Session.relisten(); return 'relisten'; }
  if (name === 'sound') { Voice.retry(); return 'sound'; }
  const st = Session.st;
  if (name === 'tap' && typeof p.id === 'string' && p.id.startsWith('char:')) {
    const G = Session.G; const a = G && G.actors[p.id.slice(5)]; if (a) a.react();
    if (!(st && !st.scope.dead && st.game.onCharTap && ['act', 'ready', 'input'].includes(st.phase) && st.game.onCharTap(st, p.id.slice(5)))) return 'char';
  }
  if (!st || st.scope.dead) return 'noq';
  if (!['act', 'ready', 'input', 'pairing'].includes(st.phase)) return 'busy';
  if (st.guided && !system) {
    const exp = st.game.next(st, 'right');
    if (exp && !st.game.sameStep(st, exp, name, p)) { const e = st.game.find && st.game.find(st, p.id); if (e) e.classList.add('wiggle'), setTimeout(() => e.classList.remove('wiggle'), 450); return 'guided-ignored'; }
  }
  if (st.submitted && K.cardIndex(p.id) >= 0) return 'ignored';          /* the answer is in: cards are inert */
  if (!system && name !== 'pass') Voice.hush('input');   /* a child's input: narration yields (the counting channel never does) */
  let r = st.game.onGesture(st, name, p);
  if (r && typeof r.then === 'function') { r.catch(e => Session.crash(e)); r = 'ok'; }   /* an async step: its errors end the question */
  if (r === false || r === undefined) return 'ignored';
  if (r !== 'free') st.ops++;
  const e = st.game.find && p.id ? st.game.find(st, p.to || p.id) : null;
  if (e && e.isConnected) st.lastAt = center(e);
  if (!system) {
    st.childOps++;
    Hints.touch(st);
    if (Hand.busy && !(st.demo && !st.childTook)) Hand.kill();         /* R4-U02: the helper's hand goes at once */
    const db = st.doneBtn; if (db && db.classList.contains('ready')) { db.style.animation = 'none'; void db.offsetWidth; db.style.animation = ''; }
    if (st.demo && !st.childTook) { st.childTook = true; Hand.kill(); }
  }
  if (st.phase === 'ready') st.phase = 'input';
  if (st.guided && !system) { const nx = st.game.next(st, 'right'); if (nx && !st.submitted) Hints.point(st, nx); }
  return 'ok';
}
window.__gesture = (n, p) => gesture(n, p);
/* an error nobody awaits (a timer, an un-awaited async step) must not leave a question stuck without cards or hints */
window.addEventListener('unhandledrejection', ev => { const m = String((ev.reason && ev.reason.message) || ev.reason || ''); if (/ServiceWorker|serviceWorker/.test(m)) { ev.preventDefault(); return; } if (Session.crash(ev.reason)) ev.preventDefault(); });
window.addEventListener('error', ev => { if (ev.error && Session.st) Session.crash(ev.error); });
window.__next = (strategy) => {
  const st = Session.st; if (!st || st.scope.dead || !['act', 'ready', 'input', 'pairing'].includes(st.phase)) return null;
  const s = st.game.next(st, strategy || 'right'); if (!s) return null;
  const at = Hints.target(st, s);
  return { g: s.g, p: s.p, at: at ? Stage.toScreen(at.x, at.y) : null, to: s.to ? Stage.toScreen(s.to.x, s.to.y) : null };
};


/* ================================================================ small tap helper for chrome (map, HUD, panels) */
function tapify(e, fn, opt) {
  opt = opt || {};
  let pid = null, sx = 0, sy = 0;
  e.style.touchAction = 'none';
  e.addEventListener('pointerdown', ev => {
    Sfx.touch();
    pid = ev.pointerId; sx = ev.clientX; sy = ev.clientY;
    try { e.setPointerCapture(pid); } catch (err) {}
    e.classList.add('press');
    if (!opt.silent) Sfx.press();
    ev.stopPropagation();
  });
  e.addEventListener('pointerup', ev => {
    if (ev.pointerId !== pid) return;
    pid = null; e.classList.remove('press');
    const r = e.getBoundingClientRect(), mx = r.width * 0.25, my = r.height * 0.25;
    if (ev.clientX >= r.left - mx && ev.clientX <= r.right + mx && ev.clientY >= r.top - my && ev.clientY <= r.bottom + my) fn(ev);
    ev.stopPropagation();
  });
  e.addEventListener('pointercancel', () => { pid = null; e.classList.remove('press'); });
  return e;
}

/* ---- from 点点岛: story (lines 3237-3323) ---- */
/* ================================================================ STORY (D05: coming back is worth it)
   3rd visit of a world: the host brings a present - a flower that is planted on the island (map)
   5th visit: the friends line up and welcome the child one by one - a second flower
   10th visit: the host gets a hat and keeps wearing it; the island flies a little pennant
   each chapter plays once; what it leaves behind stays (Store: ws.story) */
const FLOWER_SVG = c => '<svg viewBox="0 0 60 60" width="100%" height="100%"><path d="M30 34V58" stroke="#3E8E3E" stroke-width="5" stroke-linecap="round"/><path d="M30 50C22 44 14 46 12 50C18 54 26 54 30 50Z" fill="#5CC46E" stroke="#2B2118" stroke-width="2.5"/><g stroke="#2B2118" stroke-width="3"><circle cx="30" cy="12" r="9" fill="' + c + '"/><circle cx="42" cy="21" r="9" fill="' + c + '"/><circle cx="38" cy="35" r="9" fill="' + c + '"/><circle cx="22" cy="35" r="9" fill="' + c + '"/><circle cx="18" cy="21" r="9" fill="' + c + '"/><circle cx="30" cy="24" r="7.5" fill="#FFC93C"/></g></svg>';
const GIFT_SVG = '<svg viewBox="0 0 80 80" width="100%" height="100%"><rect x="12" y="34" width="56" height="38" rx="5" fill="#FF6B5B" stroke="#2B2118" stroke-width="4"/><rect x="36" y="34" width="8" height="38" fill="#FFC93C" stroke="#2B2118" stroke-width="3"/><g class="lid"><rect x="8" y="24" width="64" height="14" rx="5" fill="#FF8A7A" stroke="#2B2118" stroke-width="4"/><rect x="36" y="24" width="8" height="14" fill="#FFC93C" stroke="#2B2118" stroke-width="3"/><path d="M40 24C30 6 16 12 26 23M40 24C50 6 64 12 54 23" fill="#FFC93C" stroke="#2B2118" stroke-width="3"/></g></svg>';
const PENNANT_SVG = '<svg viewBox="0 0 40 60" width="100%" height="100%"><path d="M8 4V58" stroke="#2B2118" stroke-width="4" stroke-linecap="round"/><path d="M10 6L36 14L10 24Z" fill="#FFC93C" stroke="#2B2118" stroke-width="3" stroke-linejoin="round"/></svg>';
const Story = {
  chapter(v) { return v >= 10 ? 3 : v >= 5 ? 2 : v >= 3 ? 1 : 0; },
  host(G) { const h = G.actors[G.game.host || G.W.host]; return h && !h.math ? h : Object.values(G.actors).find(a => !a.math) || null; },
  intro(G) {
    const ws = G.ws, ch = this.chapter(ws.visits);
    const host = this.host(G);
    if ((ws.story || 0) >= 3 && host) this.wearHat(host);                   /* what a chapter gave stays */
    if (ch <= (ws.story || 0) || fast()) return { line: null };
    ws.story = ch; Store.save();
    if (ch === 1) return { line: '又见面啦！', play: () => this.gift(G, host) };
    if (ch === 2) return { line: '排好队，欢迎你！', play: () => this.lineup(G) };
    return { line: '你来了十次啦！', play: () => this.hat(G, host) };
  },
  async gift(G, host) {
    const sc = G.scope;
    const x = host ? clamp(host.x + (host.x < Stage.W / 2 ? 150 : -150), 120, Stage.W - 120) : Stage.W / 2, y = host ? host.y - 70 : Stage.H * 0.6;
    const g = el('div', '', Stage.el); g.innerHTML = GIFT_SVG; place(g, x - 60, y - 60, 120, 120); g.style.zIndex = 25;
    sc.add(() => g.remove());
    Sfx.whoosh(0.3);
    await sc.anim(g, [{ transform: 'translateY(-420px) rotate(-12deg)' }, { transform: 'translateY(0) rotate(0)' }], { duration: 520, easing: EASE.drop });
    Sfx.land(); if (host) { host.lookAt(x, y); host.react(); }
    await sc.wait(350);
    const lid = g.querySelector('.lid');
    sc.anim(lid, [{ transform: 'translate(0,0) rotate(0)' }, { transform: 'translate(6px,-34px) rotate(18deg)' }], { duration: 300, easing: EASE.pop, fill: 'forwards' });
    const f = el('div', '', Stage.el); f.innerHTML = FLOWER_SVG('#FF7FA8'); place(f, x - 40, y - 70, 80, 80); f.style.zIndex = 26;
    sc.add(() => f.remove());
    Sfx.sparkle(); Voice.say('送你一朵小花！', { tag: 'story', owner: G });
    await sc.anim(f, [{ transform: 'scale(0) translateY(40px)' }, { transform: 'scale(1.25) translateY(-30px)' }, { transform: 'scale(1) translateY(-30px)' }], { duration: 600, easing: EASE.pop });
    Fx.burst(x, y - 60, { n: 14, dist: 90 });
    await sc.wait(900);
    const a = $('#avatar').getBoundingClientRect(), s0 = Stage.toStage(a.left + a.width / 2, a.top + a.height / 2);
    await sc.anim(f, [{ transform: 'translate(0,-30px) scale(1)' }, { transform: 'translate(' + (s0.x - x) + 'px,' + (s0.y - y + 40) + 'px) scale(.3)', opacity: 0.2 }], { duration: 700, easing: EASE.glide, fill: 'forwards' });
    f.remove();
    await sc.anim(g, [{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });
    g.remove();
  },
  async lineup(G) {
    const sc = G.scope;
    const list = Object.values(G.actors).filter(a => !a.math && a.x > 0 && a.x < Stage.W).sort((a, b) => a.x - b.x);
    if (!list.length) return;
    /* they walk into ONE welcome line in front of the child (then back to their places) */
    const home = list.map(a => ({ x: a.x, y: a.y })), gap = Math.min(150, (Stage.W - 160) / Math.max(1, list.length - 1));
    const y = Stage.H * (K.L() ? 0.86 : 0.8), x0 = Stage.W / 2 - gap * (list.length - 1) / 2;
    await Promise.all(list.map((a, i) => sc.wait(i * 120).then(() => a.moveTo(x0 + i * gap, y, 620, 50))));
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      sc.anim(a.body, REACT.hop, { duration: 420, fill: 'none' });
      Sfx.mar(Sfx.SCALE[Math.min(i, 9)], 0, 0.4, 0.5);
      await sc.wait(230);
    }
    list.forEach(a => a.cheer());
    Fx.confetti(24);
    await sc.wait(700);
    await Promise.all(list.map((a, i) => a.moveTo(home[i].x, home[i].y, 520, 30)));
  },
  async hat(G, host) {
    if (!host) return;
    const sc = G.scope;
    const hat = this.wearHat(host);
    Sfx.whoosh(0.3);
    await sc.anim(hat, [{ transform: 'translateY(-300px) rotate(-30deg)', opacity: 0 }, { transform: 'translateY(0) rotate(0)', opacity: 1 }], { duration: 650, easing: EASE.pop });
    Sfx.boing(); host.react();
    await sc.wait(600);
  },
  wearHat(host) {
    let hat = host.root.querySelector('.hat');
    if (!hat) { hat = img('assets/props/hat.png', 'hat', host.root); Object.assign(hat.style, { width: '34%', left: '33%', top: '-16%' }); }
    return hat;
  },
  /* the map shows what the chapters left behind */
  mapDeco(I, ws) {
    const n = ws.story || 0;
    if (I.deco._n === n) return;
    I.deco._n = n; I.deco.innerHTML = '';
    if (n >= 1) el('div', 'fl', I.deco).innerHTML = FLOWER_SVG('#FF7FA8');
    if (n >= 2) el('div', 'fl', I.deco).innerHTML = FLOWER_SVG('#8E6CFF');
    if (n >= 3) el('div', 'pen', I.deco).innerHTML = PENNANT_SVG;
  },
};

/* ---- from 点点岛: swu (lines 3375-3396) ---- */
/* R3-F02: a new release (page + assets as ONE version) is installed in the background by the service worker and then
   WAITS; the switch happens only at a safe moment - on the entry screen or while the app is in the background -
   by letting the waiting worker take over and reloading at once. A running game never gets a newer page's assets. */
const SWU = {
  reg: null, switching: false,
  watch(reg) {
    if (!reg || this.reg === reg) return;
    this.reg = reg;
    reg.addEventListener('updatefound', () => { const w = reg.installing; if (w) w.addEventListener('statechange', () => { if (w.state === 'installed') this.maybe(); }); });
    /* the first install claiming a page that had no worker is NOT a version switch (same release as this page) */
    this.hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (this.switching) { location.reload(); return; } if (this.hadController) { this.stale = true; this.reloadIfSafe(); } this.hadController = true; });
    try { const u = reg.update(); if (u && u.catch) u.catch(() => {}); } catch (e) {}      /* an update check that fails (offline) is nobody's error */
    this.maybe();
  },
  safe() { return Screens.cur === 'entry' || document.hidden; },
  maybe() { if (this.reg && this.reg.waiting && navigator.serviceWorker.controller && this.safe()) this.apply(); },
  apply() { if (!this.reg || !this.reg.waiting || this.switching) return false; this.switching = true; this.reg.waiting.postMessage('skip'); return true; },
  /* R4-F01: another page of this app switched the version - this page reloads at ITS next safe moment (entry, the map
     between sessions, or hidden), so an old page never keeps asking the new worker for pictures */
  reloadIfSafe() { if (this.stale && (Screens.cur === 'entry' || (Screens.cur === 'map' && !Session.G) || document.hidden)) location.reload(); },
};

/* ---- from 点点岛: game base + K (lines 3555-3792) ---- */
/* ================================================================ GAME BASE + KITS */
const GAMES = {};
const GameBase = {
  kinds() { return [this.kind0]; },
  key(q) { return this.id + ':' + JSON.stringify(q.k); },
  build() {}, layout() {}, relayoutQ() {}, unbuild() {},
  present() {}, onGesture() { return false; },
  evaluate(st, ans) { return ans === st.q.answer; },
  reveal() {}, feedback() {}, correct() {}, cleanup() {},
  next() { return null; },
  sameStep(st, exp, name, p) { return !!(p && exp.p && p.id === exp.p.id); },
  find(st, id) { return (st.map && st.map[id]) || (st.G.els && st.G.els[id]) || null; },
  gestureHint() {}, workEls() { return []; },
  snap() { return {}; },
};
function defGame(spec) { const g = Object.assign(Object.create(GameBase), spec); GAMES[g.id] = g; return g; }

const K = {
  L() { return !Stage.portrait; },
  actor(G, id, h) {
    const a = new Actor(id, Stage.el, h, G.scope);
    G.actors[id] = a;
    Input.bind(a.root, { id: 'char:' + id });
    return a;
  },
  item(parent, src, w, h, cls) {
    const d = el('div', 'item ' + (cls || ''), parent || Stage.el);
    place(d, 0, 0, w, h);
    if (src) img(src, '', d);
    return d;
  },
  /* bindings made for a question are undone when it ends (persistent scene pieces never keep a stale id) */
  reg(st, id, e, spec) { st.map = st.map || {}; st.map[id] = e; if (spec) { Input.bind(e, Object.assign({ id }, spec)); (st.bound || (st.bound = [])).push(e); } return e; },
  /* answer cards: one node per option (a character, a letter, a picture), all the same size */
  cards(st, nodes, vals, opt) {
    opt = opt || {};
    const W = Stage.W, H = Stage.H, gap = opt.gap || 34;
    /* the row always fits the stage width (portrait has 704): cards shrink, never below 110 */
    const size = Math.max(110, Math.min(opt.size || 150, Math.floor((W - 36 - (nodes.length - 1) * gap) / nodes.length)));
    const total = nodes.length * size + (nodes.length - 1) * gap;
    st.cardSize = opt.size || 150;
    const cx = opt.cx != null ? opt.cx : W / 2, cy = opt.cy != null ? opt.cy : H - size / 2 - 24;
    const cards = nodes.map((nd, i) => {
      const c = el('div', 'card ' + (opt.cls || ''), Stage.el);
      c.style.position = 'absolute';
      if (nd) c.appendChild(nd);
      place(c, Math.round(cx - total / 2 + i * (size + gap)), Math.round(cy - size / 2), size, size);
      this.reg(st, 'card' + i, c, {});
      st.els.push(c);
      st.scope.anim(c, [{ transform: 'scale(0) rotate(-8deg)' }, { transform: 'scale(1)' }], { duration: 320, delay: 60 * i, easing: EASE.pop, fill: 'backwards' });
      return c;
    });
    st.cards = cards; st.opts = vals;
    return cards;
  },
  cardsPlace(st, opt) {
    if (!st.cards) return;
    opt = opt || {};
    const gap = opt.gap || 34, n = st.cards.length, size = Math.max(110, Math.min(st.cardSize || parseFloat(st.cards[0].style.width), Math.floor((Stage.W - 36 - (n - 1) * gap) / n)));
    const total = n * size + (n - 1) * gap;
    const cx = opt.cx != null ? opt.cx : Stage.W / 2, cy = opt.cy != null ? opt.cy : Stage.H - size / 2 - 24;
    st.cards.forEach((c, i) => place(c, Math.round(cx - total / 2 + i * (size + gap)), Math.round(cy - size / 2), size, size));
  },
  cardIndex(id) { return /^card\d$/.test(id || '') ? Number(id.slice(4)) : -1; },
  /* generic next() for card questions: right / wrong / pos:k / rand */
  cardNext(st, strat) {
    if (!st.cards) return null;
    const vals = st.opts, ans = st.q.answer;
    let i = vals.indexOf(ans);
    if (strat === 'wrong') i = vals.findIndex(v => v !== ans);
    else if (/^pos:\d$/.test(strat)) i = Number(strat.slice(4));
    else if (strat && strat.startsWith('rand')) i = Math.floor(Math.random() * vals.length);
    return { g: 'tap', p: { id: 'card' + i } };
  },
  task(st, parts, y) {
    const t = el('div', 'task', Stage.el);
    t._y = y;
    t.style.top = (y != null ? y : (this.L() ? 14 : 116)) + 'px';
    parts.forEach((p, i) => {
      if (i) { const a = el('div', 'arw', t); a.innerHTML = ICONS.arrowR; }
      const it = el('div', 'it', t);
      (Array.isArray(p) ? p : [p]).forEach(q => {
        if (typeof q === 'string') {
          if (ICONS[q]) { const s = el('span', '', it); s.innerHTML = ICONS[q]; s.firstChild.setAttribute('width', 48); s.firstChild.setAttribute('height', 48); }
          else { const im = img(q, '', it); im.style.height = '54px'; }
        }
        else if (q && q.node) { q.node.style.position = 'relative'; it.appendChild(q.node); }
      });
    });
    st.els.push(t);
    st.scope.anim(t, [{ transform: 'translateX(-50%) translateY(-30px)', opacity: 0 }, { transform: 'translateX(-50%) translateY(0)', opacity: 1 }], { duration: 300, easing: EASE.pop });
    return t;
  },
  done(st, icon, x, y, size) {
    size = size || 110;
    const b = UI.doneBtn(icon, size);
    Stage.el.appendChild(b); b.style.position = 'absolute';
    b._done = { size, x, y };
    this.placeDone(b);
    st.els.push(b);
    st.scope.anim(b, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, easing: EASE.pop });
    return b;
  },
  placeDone(b) {
    const L = this.L(), d = b._done;
    place(b, d.x != null ? d.x : Stage.W - d.size - (L ? 22 : 28), d.y != null ? d.y : Stage.H - d.size - (L ? 22 : 30));
  },
  /* rotation: the question's chrome follows the new orientation (games re-place their own pieces in relayoutQ) */
  relayoutChrome(st) {
    const L = this.L();
    st.els.forEach(e => {
      if (!e.isConnected) return;
      if (e.classList.contains('task')) e.style.top = (e._y != null ? e._y : (L ? 14 : 116)) + 'px';
      if (e._done) this.placeDone(e);
    });
    if (st.cards && st.cards.length) this.cardsPlace(st, st.game.cardSpot ? st.game.cardSpot(st) : {});
  },
  ring(st, rects, pad, color) {
    if (!rects.length) return null;
    const x0 = Math.min(...rects.map(r => r.x)) - (pad || 16), y0 = Math.min(...rects.map(r => r.y)) - (pad || 16);
    const x1 = Math.max(...rects.map(r => r.x + r.w)) + (pad || 16), y1 = Math.max(...rects.map(r => r.y + r.h)) + (pad || 16);
    const r = el('div', 'ringo', Stage.el);
    r.style.position = 'absolute';
    if (color) r.style.borderColor = color;
    place(r, x0, y0, x1 - x0, y1 - y0);
    st.els.push(r);
    st.scope.anim(r, [{ transform: 'scale(1.3)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 360, easing: EASE.pop });
    return r;
  },
  lines(st) {
    const s = svg('svg', { class: 'lines', width: Stage.W, height: Stage.H }, Stage.el);
    s.style.position = 'absolute'; s.style.left = '0px'; s.style.top = '0px'; s.style.zIndex = 20;
    st.els.push(s);
    return s;
  },
  async link(st, s, a, b, color) {
    const l = svg('line', { x1: a.x, y1: a.y, x2: a.x, y2: a.y, stroke: color || '#2B2118', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '2 12' }, s);
    const t0 = now(), dur = T(260);
    await new Promise(res => { const step = () => { if (st.scope.dead) return res(); const k = dur ? Math.min(1, (now() - t0) / dur) : 1; l.setAttribute('x2', a.x + (b.x - a.x) * k); l.setAttribute('y2', a.y + (b.y - a.y) * k); if (k < 1 && !st.ff) requestAnimationFrame(step); else { l.setAttribute('x2', b.x); l.setAttribute('y2', b.y); res(); } }; step(); });
    return l;
  },
  flash(st, els) { els.forEach(e => { e.classList.remove('yellowflash'); void e.offsetWidth; e.classList.add('yellowflash'); st.scope.timeout(() => e.classList.remove('yellowflash'), 1600); }); },
  async flyTo(st, e, x, y, dur, arc, scale) {
    const b = box(e);
    const dx = x - b.x, dy = y - b.y;
    const kf = [{ transform: 'translate(0,0) scale(1)' }];
    if (arc) kf.push({ transform: 'translate(' + dx / 2 + 'px,' + (dy / 2 - arc) + 'px) scale(' + ((1 + (scale || 1)) / 2) + ')' });
    kf.push({ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + (scale || 1) + ')' });
    await st.scope.anim(e, kf, { duration: dur || 420, easing: EASE.glide });
    if (st.scope.dead) return;
    e.getAnimations().forEach(a => a.cancel());
    e.style.transform = scale && scale !== 1 ? 'scale(' + scale + ')' : '';
    place(e, x, y);
  },
  pop(st, e, delay) { return st.scope.anim(e, [{ transform: 'scale(0)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 300, delay: delay || 0, easing: EASE.pop, fill: 'backwards' }); },
  hop(st, e, h) { return st.scope.anim(e, [{ transform: 'translateY(0)' }, { transform: 'translateY(' + (-(h || 24)) + 'px)' }, { transform: 'translateY(0)' }], { duration: 300, easing: EASE.glide, fill: 'none' }); },
  wiggle(st, e) { return st.scope.anim(e, [{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(9deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(0)' }], { duration: 420, fill: 'none' }); },
  /* non-overlapping random points in a rect */
  scatter(rng, n, rect, minD) {
    const pts = [];
    for (let tries = 0; pts.length < n && tries < 4000; tries++) {
      const p = { x: rect.x + rng() * rect.w, y: rect.y + rng() * rect.h };
      if (pts.every(q => Math.hypot(q.x - p.x, q.y - p.y) >= minD)) pts.push(p);
      if (tries > 3000) minD *= 0.9;
    }
    return pts;
  },
  /* n distinct cells of a cols x rows grid (normalised centres, jittered inside the cell): with cells >= object + 20 px
     the objects never touch and keep the 20 px gap between tap targets, in any orientation */
  cells(rng, n, cols, rows, jit) {
    const all = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) all.push([c, r]);
    return rng.shuffle(all).slice(0, n).map(([c, r]) => [(c + 0.5 + (rng() - 0.5) * (jit || 0)) / cols, (r + 0.5 + (rng() - 0.5) * (jit || 0)) / rows]);
  },
  norm(pts, rect) { return pts.map(p => [(p.x - rect.x) / rect.w, (p.y - rect.y) / rect.h]); },
  say(st, text, tag) { st.prompt = text; return Voice.say(text, { tag: tag || 'prompt' }); },
};
