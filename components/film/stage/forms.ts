/**
 * The Idea's forms: seven procedural point clouds (one per act it will pass through), all fitting a radius ~1.6.
 * Abstract by design — none may read as a logo, crest or monogram, nor as the chart's per-vertical icons.
 */
export const FORM_COUNT = 7;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type P = (i: number, r: () => number, out: Float32Array, o: number) => void;

const gauss = (r: () => number) => {
  const u = Math.max(1e-6, r()), v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

function onSegment(a: number[], b: number[], t: number, j: number, out: Float32Array, o: number) {
  out[o] = a[0] + (b[0] - a[0]) * t + j * 0.02;
  out[o + 1] = a[1] + (b[1] - a[1]) * t + j * 0.02;
  out[o + 2] = a[2] + (b[2] - a[2]) * t;
}

/**
 * The ribbon: a closed band folded twice over itself with one half-twist, so it has a clear top and front and
 * never reads as a ball (approved 2026-10-01: "gold light that never rests as a sphere"). `calm` = the monument's
 * taller, quieter fold. Shared with the solid gold monument mesh, so the light condenses into the same shape.
 */
export function ribbonPoint(u: number, v: number, calm: boolean, out: number[]) {
  const R = calm ? 0.95 : 1.15;
  const lift = calm ? 0.95 : 0.42;
  // Centre line: a loop that rises and dips twice (a fold) and leans forward at the front.
  const cx = Math.cos(u) * R * (1 + 0.18 * Math.cos(2 * u));
  const cz = Math.sin(u) * R * (calm ? 0.78 : 0.62);
  const cy = Math.sin(2 * u) * lift + (calm ? 0.12 * Math.cos(u) : 0.22 * Math.sin(u));
  // Across the band: rotate the cross-section by half a turn over the loop (one half-twist).
  const a = u / 2 + (calm ? 0.35 : 0.9);
  const w = (calm ? 0.42 : 0.34) * v;
  out[0] = cx + Math.cos(a) * w * Math.cos(u);
  out[1] = cy + Math.sin(a) * w;
  out[2] = cz + Math.cos(a) * w * Math.sin(u);
  return out;
}

const tmpPoint = [0, 0, 0];

// 0 — Raw idea: a folded ribbon of light, its edges a little frayed.
const raw: P = (i, r, out, o) => {
  const u = r() * Math.PI * 2, v = r() * 2 - 1;
  ribbonPoint(u, v, false, tmpPoint);
  const fray = Math.abs(v) > 0.86 ? 0.06 : 0.012;
  out[o] = tmpPoint[0] + gauss(r) * fray; out[o + 1] = tmpPoint[1] + gauss(r) * fray; out[o + 2] = tmpPoint[2] + gauss(r) * fray;
};

// 1 — Blueprint: a cube's edges with an inscribed octahedron and a measuring ring.
const cubeEdges: number[][][] = [];
{
  const c = 1.05;
  const v = [-c, c];
  for (const x of v) for (const y of v) { cubeEdges.push([[x, y, -c], [x, y, c]]); }
  for (const x of v) for (const z of v) { cubeEdges.push([[x, -c, z], [x, c, z]]); }
  for (const y of v) for (const z of v) { cubeEdges.push([[-c, y, z], [c, y, z]]); }
  const k = 1.05;
  const oct = [[k, 0, 0], [-k, 0, 0], [0, k, 0], [0, -k, 0], [0, 0, k], [0, 0, -k]];
  for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) if (Math.floor(a / 2) !== Math.floor(b / 2)) cubeEdges.push([oct[a], oct[b]]);
}
const blueprint: P = (i, r, out, o) => {
  if (r() < 0.12) {
    const th = r() * Math.PI * 2, R = 1.55;
    out[o] = Math.cos(th) * R; out[o + 1] = -1.05; out[o + 2] = Math.sin(th) * R;
    return;
  }
  const e = cubeEdges[Math.floor(r() * cubeEdges.length)];
  onSegment(e[0], e[1], r(), gauss(r) * 0.4, out, o);
};

// 2 — Story: a ring (the lens) around a luminous disc (the screen).
const story: P = (i, r, out, o) => {
  const th = r() * Math.PI * 2;
  if (r() < 0.55) {
    const R = 1.35 + gauss(r) * 0.035, t = gauss(r) * 0.05;
    out[o] = Math.cos(th) * R; out[o + 1] = Math.sin(th) * R; out[o + 2] = t;
  } else {
    const R = Math.sqrt(r()) * 1.15;
    out[o] = Math.cos(th) * R; out[o + 1] = Math.sin(th) * R; out[o + 2] = -0.25 + gauss(r) * 0.03;
  }
};

// 3 — Movement: six streams spiralling outward.
const movement: P = (i, r, out, o) => {
  const k = Math.floor(r() * 6), t = r();
  const a = (k / 6) * Math.PI * 2 + t * 3.2;
  const R = 0.15 + t * 1.45;
  out[o] = Math.cos(a) * R + gauss(r) * 0.03;
  out[o + 1] = Math.sin(a) * R * 0.62 + gauss(r) * 0.03;
  out[o + 2] = (t - 0.5) * 1.1 + gauss(r) * 0.03;
};

// 4 — People: constellations of small clusters, loosely joined.
const clusters = Array.from({ length: 11 }, (_, k) => {
  const a = (k / 11) * Math.PI * 2 + (k % 2) * 0.3;
  const R = k === 0 ? 0 : 0.8 + (k % 3) * 0.28;
  return [Math.cos(a) * R, Math.sin(a) * R * 0.8, ((k * 37) % 7) / 7 - 0.5];
});
const people: P = (i, r, out, o) => {
  const c = clusters[Math.floor(r() * clusters.length)];
  if (r() < 0.2) {
    const d = clusters[Math.floor(r() * clusters.length)];
    onSegment(c, d, r(), 0, out, o);
    return;
  }
  out[o] = c[0] + gauss(r) * 0.11; out[o + 1] = c[1] + gauss(r) * 0.11; out[o + 2] = c[2] + gauss(r) * 0.11;
};

// 5 — Futures: an icosahedral lattice (nodes and edges).
const ico = (() => {
  const t = (1 + Math.sqrt(5)) / 2, s = 1.3 / Math.sqrt(1 + t * t);
  const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((p) => p.map((q) => q * s));
  const edges: number[][][] = [];
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) {
    const d = Math.hypot(v[a][0] - v[b][0], v[a][1] - v[b][1], v[a][2] - v[b][2]);
    if (d < 1.3 * 1.1) edges.push([v[a], v[b]]);
  }
  return { v, edges };
})();
const futures: P = (i, r, out, o) => {
  if (r() < 0.3) {
    const c = ico.v[Math.floor(r() * 12)];
    out[o] = c[0] + gauss(r) * 0.05; out[o + 1] = c[1] + gauss(r) * 0.05; out[o + 2] = c[2] + gauss(r) * 0.05;
    return;
  }
  const e = ico.edges[Math.floor(r() * ico.edges.length)];
  onSegment(e[0], e[1], r(), gauss(r) * 0.3, out, o);
};

// 6 — Monument: the ribbon's calm fold, dense (it becomes solid gold at the Roof).
const monument: P = (i, r, out, o) => {
  ribbonPoint(r() * Math.PI * 2, r() * 2 - 1, true, tmpPoint);
  out[o] = tmpPoint[0]; out[o + 1] = tmpPoint[1]; out[o + 2] = tmpPoint[2];
};

const FORMS: P[] = [raw, blueprint, story, movement, people, futures, monument];

const cache = new Map<number, { forms: Float32Array[]; rand: Float32Array }>();

/** Build (and cache) ahead of time — called in idle time while the gate is shown. */
export function prewarmForms(count: number) { buildForms(count); }

/** All forms for `count` points, plus per-point randoms (x: size, y: delay, z: house 0–4, w: phase). */
export function buildForms(count: number) {
  const hit = cache.get(count);
  if (hit) return hit;
  const forms = FORMS.map((f, k) => {
    const r = rng(1000 + k * 7919);
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) f(i, r, out, i * 3);
    return out;
  });
  const r = rng(42);
  const rand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    rand[i * 4] = r();
    rand[i * 4 + 1] = r();
    rand[i * 4 + 2] = Math.floor(r() * 5);
    rand[i * 4 + 3] = r();
  }
  const built = { forms, rand };
  cache.set(count, built);
  return built;
}
