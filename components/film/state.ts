/**
 * Mutable per-frame state shared by the film's DOM shell, the ink overlay and the 3D stage.
 * Plain objects (not React state): written by input handlers / render loops, read in rAF and useFrame.
 */

export type Trail = { x: number; y: number; vx: number; vy: number; t: number };

export type FilmState = {
  pointer: {
    /** CSS px, and px/s. `active` is false until the first move (and after leaving the window). */
    x: number;
    y: number;
    px: number;
    py: number;
    vx: number;
    vy: number;
    speed: number;
    active: boolean;
    touch: boolean;
    /** Moved since the ink last consumed it (the ink draws a capsule from (px,py) to (x,y)). */
    dirty: boolean;
    lastMove: number;
    /** A short history for the Idea's particles to be pushed by (newest first). */
    trail: Trail[];
  };
  /** The Idea's footprint on screen (CSS px), published by the stage each frame; used for the ink hole and hover. */
  idea: { cx: number; cy: number; r: number; visible: boolean; hovered: boolean };
  /** Requests from the shell to the stage. */
  requests: { swap: number; pulse: number };
  /** Live readouts for the HUD. */
  stats: { fps: number; particles: number; form: number };
};

export const TRAIL = 8;

export function createFilmState(): FilmState {
  return {
    pointer: {
      x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, speed: 0,
      active: false, touch: false, dirty: false, lastMove: 0,
      trail: Array.from({ length: TRAIL }, () => ({ x: -1e4, y: -1e4, vx: 0, vy: 0, t: -1e4 })),
    },
    idea: { cx: -1e4, cy: -1e4, r: 0, visible: false, hovered: false },
    requests: { swap: 0, pulse: 0 },
    stats: { fps: 60, particles: 0, form: 0 },
  };
}

/** Record a pointer sample (CSS px, ms). Velocity is smoothed so single noisy events don't spike it. */
export function notePointer(s: FilmState, x: number, y: number, now: number, touch: boolean, fresh = false) {
  const p = s.pointer;
  // A new finger starts a new stroke (a mouse jump still draws along the jump, as the reference does).
  if (!p.active || fresh) {
    p.px = x; p.py = y; p.x = x; p.y = y; p.vx = 0; p.vy = 0;
    if (fresh) { p.dirty = false; p.lastMove = now; }
  }
  const dt = Math.max(1, now - p.lastMove) / 1000;
  const k = Math.min(1, dt / 0.05);
  p.vx += ((x - p.x) / dt - p.vx) * k;
  p.vy += ((y - p.y) / dt - p.vy) * k;
  p.speed = Math.hypot(p.vx, p.vy);
  if (!p.dirty) { p.px = p.x; p.py = p.y; }
  p.x = x; p.y = y;
  p.dirty = true;
  p.active = true;
  p.touch = touch;
  p.lastMove = now;
  const last = p.trail[0];
  if (now - last.t > 40 || Math.hypot(x - last.x, y - last.y) > 60) {
    p.trail.pop();
    p.trail.unshift({ x, y, vx: p.vx, vy: p.vy, t: now });
  } else {
    last.x = x; last.y = y; last.vx = p.vx; last.vy = p.vy;
  }
}
