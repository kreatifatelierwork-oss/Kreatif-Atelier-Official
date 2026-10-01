// Scripted cursor paths for the ink comparison (buttermax.net vs our /film). Both sites get the SAME paths, speeds and
// timings. Coordinates are CSS px at a 1440 × 900 viewport. Each stroke is sampled at 240 Hz (a fast gaming mouse is
// 500–1000 Hz; 240 keeps CDP dispatch honest), then the pointer rests so drift and fade can be measured.
//
// Regions chosen to be empty on both sites: the lower-left corner (x 0–420, y 470–808), moving right to left so the drift after a stop has room: buttermax draws its product in front of the ink from x ≈ 430 and
// its cookie banner covers y ≥ 810. "text" and "object" strokes
// deliberately cross the headline (top-left) and the centre object.

const HZ = 240;

function line(x0, y0, x1, y1, ms) {
  const n = Math.max(2, Math.round((ms / 1000) * HZ));
  return Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return { dt: ms / n, x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u };
  });
}
function circle(cx, cy, r, ms, turns = 1, start = Math.PI) {
  const n = Math.max(8, Math.round((ms / 1000) * HZ));
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = start + (i / n) * turns * Math.PI * 2;
    return { dt: ms / n, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
}
function zigzag(x0, y, x1, amp, zigs, ms) {
  const n = Math.max(8, Math.round((ms / 1000) * HZ));
  return Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    const tri = 1 - 4 * Math.abs(((u * zigs) % 1) - 0.5); // triangle wave -1..1
    return { dt: ms / n, x: x0 + (x1 - x0) * u, y: y + tri * amp };
  });
}
function jitter(cx, cy, px, ms, seed = 7) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1;
  const n = Math.round((ms / 1000) * 60);
  return Array.from({ length: n }, () => ({ dt: ms / n, x: cx + rnd() * px, y: cy + rnd() * px }));
}

/** The test suite: named strokes with a jump-to start, the path, and a rest afterwards (ms). */
export const STROKES = [
  { name: "slow-line", start: [400, 700], path: line(400, 700, 160, 700, 757), rest: 2600, note: "317 px/s" },
  { name: "medium-line", start: [400, 640], path: line(400, 640, 160, 640, 240), rest: 2600, note: "1000 px/s" },
  { name: "fast-flick", start: [400, 760], path: line(400, 760, 160, 760, 70), rest: 2600, note: "3450 px/s" },
  { name: "very-fast-flick", start: [400, 680], path: line(400, 680, 160, 680, 35), rest: 2600, note: "6900 px/s" },
  { name: "circle", start: [130, 690], path: circle(230, 690, 100, 900), rest: 2600, note: "r 100, 0.9 s" },
  { name: "zigzag", start: [400, 690], path: zigzag(400, 690, 160, 60, 5, 560), rest: 2600, note: "5 zigs, 0.56 s" },
  { name: "stop-dead", start: [400, 700], path: line(400, 700, 220, 700, 122), rest: 3000, note: "1470 px/s then still" },
  { name: "jitter", start: [230, 700], path: jitter(230, 700, 4, 1500), rest: 2000, note: "±4 px for 1.5 s" },
  { name: "long-sweep", start: [40, 470], path: line(40, 470, 1400, 470, 1200), rest: 2600, note: "full width through the object" },
  { name: "over-text", start: [100, 110], path: line(100, 110, 820, 150, 800), rest: 2600, note: "across the headline" },
  { name: "over-object", start: [600, 470], path: circle(720, 470, 120, 1000), rest: 2600, note: "circle over the object" },
  { name: "edge-left", start: [300, 700], path: line(300, 700, 2, 700, 140), rest: 2600, note: "fast into the left edge" },
  { name: "edge-right-top", start: [1100, 300], path: line(1100, 300, 1438, 40, 200), rest: 2600, note: "fast into the top-right corner" },
];

/** Flatten to a timed schedule: [{ t, x, y, stroke }] with t in ms from the first event. */
export function schedule(lead = 1500, only = null) {
  const out = [];
  let t = 0;
  const marks = [];
  for (const s of STROKES.filter((k) => !only || only.includes(k.name))) {
    // Jump to the start (a pointer teleport draws on some sites, so the jump happens during a quiet gap and is
    // followed by a 250 ms settle before the stroke begins).
    out.push({ t, x: s.start[0], y: s.start[1], stroke: s.name, jump: true });
    t += lead;
    marks.push({ name: s.name, start: t, note: s.note });
    for (const p of s.path) { t += p.dt; out.push({ t, x: p.x, y: p.y, stroke: s.name }); }
    marks[marks.length - 1].end = t;
    t += s.rest;
  }
  return { events: out, marks, total: t };
}
