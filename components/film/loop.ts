/**
 * The film's one animation loop. Everything that draws per frame (the 3D stage, the ink, the opening choreography)
 * subscribes here, so both canvases update in the same requestAnimationFrame and present together.
 * Lower `order` runs first (the stage renders before the ink reads the Idea's footprint).
 *
 * Frame timing is kept in preallocated rings for the frame-time checks (read by scripts/research via
 * `window.__filmLoop` when the page is opened with `?tune`).
 */

export type Tick = (now: number, dt: number) => void;

type Entry = { fn: Tick; order: number };

const entries: Entry[] = [];
let raf = 0;
let last = 0;

const RING = 8192;
export const loopStats = {
  /** ms between consecutive frames, and ms of script work inside each frame. */
  interval: new Float32Array(RING),
  work: new Float32Array(RING),
  n: 0,
};

function frame(now: number) {
  const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
  const i = loopStats.n % RING;
  loopStats.interval[i] = last ? now - last : 0;
  last = now;
  for (let k = 0; k < entries.length; k++) entries[k].fn(now, dt);
  loopStats.work[i] = performance.now() - now;
  loopStats.n++;
  raf = requestAnimationFrame(frame);
}

/** Run `fn(now, dt)` every frame until the returned function is called. `now` is the rAF timestamp (ms). */
export function onFrame(fn: Tick, order = 0) {
  entries.push({ fn, order });
  entries.sort((a, b) => a.order - b.order);
  if (!raf) {
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  return () => {
    const i = entries.findIndex((e) => e.fn === fn);
    if (i >= 0) entries.splice(i, 1);
    if (!entries.length && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
