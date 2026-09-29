import { longTakeConfig as L } from "@/lib/config";

/**
 * Live state of the five world interactions and the core's drag-to-turn. One mutable object shared by the DOM
 * (buttons, pointer) and the scene (useFrame) through a ref — updated per frame, never through React state.
 */
export type PlayState = {
  /** Button / key currently held (for the hold interactions). */
  holding: boolean;
  /** 01 Aurelius — 0 → 1 while held. */
  raise: number;
  /** 02 Valora — bridge completeness 0 → 1 (taps). */
  bridge: number;
  /** Time (s, scene clock) of the last tap, for the arrival flourish. */
  bridgeTapAt: number;
  /** 03 GGP — iris openness 0 → 1, film time, total rolled seconds. */
  roll: number;
  filmTime: number;
  rolled: number;
  /** 04 Rudra Yugen — per-node light 0 → 1, sparks fired, time of the last spark. */
  nodes: Float32Array;
  sparks: number;
  sparkAt: number;
  /** 05 Asraya — breath 0 (exhaled) → 1 (inhaled); completed breaths; whether this breath has peaked. */
  breath: number;
  breaths: number;
  peaked: boolean;
  /** 00 Core — orrery yaw from dragging (radians). */
  yaw: number;
  yawTarget: number;
};

export const NODE_COUNT = 42;

export const createPlay = (): PlayState => ({
  holding: false,
  raise: 0,
  bridge: 0,
  bridgeTapAt: -10,
  roll: 0,
  filmTime: 0,
  rolled: 0,
  nodes: new Float32Array(NODE_COUNT),
  sparks: 0,
  sparkAt: -10,
  breath: 0,
  breaths: 0,
  peaked: false,
  yaw: 0,
  yawTarget: 0,
});

/** Completion 0–1 of each vertical's interaction (index 1–5). */
export function completion(p: PlayState, world: number): number {
  switch (world) {
    case 1: return p.raise;
    case 2: return p.bridge;
    case 3: return Math.min(1, p.rolled / L.play.rollSeconds);
    case 4: {
      let lit = 0;
      for (let i = 0; i < p.nodes.length; i++) if (p.nodes[i] > 0.5) lit++;
      return Math.min(1, lit / (p.nodes.length * 0.8));
    }
    case 5: return Math.min(1, p.breaths / L.play.breathsToBalance);
    default: return 0;
  }
}

/** Advance the hold-driven interactions for the active world (called every frame from the DOM loop). */
export function stepPlay(p: PlayState, world: number, dt: number) {
  const P = L.play;
  if (world === 1) {
    if (p.holding) p.raise = Math.min(1, p.raise + dt / P.raiseSeconds);
    else if (p.raise < 1) p.raise = Math.max(0, p.raise - dt * 0.6);
  }
  if (world === 3) {
    const want = p.holding ? 1 : p.rolled >= P.rollSeconds ? 0.55 : 0.12;
    p.roll += (want - p.roll) * Math.min(1, dt * (p.holding ? 2.5 : 1.2));
    if (p.holding) { p.filmTime += dt; p.rolled += dt; }
    else if (p.rolled >= P.rollSeconds) p.filmTime += dt * 0.35; // once rolled, the film keeps idling
  }
  if (world === 5) {
    if (p.holding) {
      p.breath = Math.min(1, p.breath + dt / P.breathSeconds);
      if (p.breath > 0.8) p.peaked = true;
    } else {
      p.breath = Math.max(0, p.breath - dt / (P.breathSeconds * 0.9));
      if (p.peaked && p.breath < 0.25) { p.breaths += 1; p.peaked = false; }
    }
  }
}

/** Instant versions for keyboard clicks / reduced motion. */
export function completeWorld(p: PlayState, world: number) {
  if (world === 1) p.raise = 1;
  if (world === 2) p.bridge = 1;
  if (world === 3) { p.rolled = L.play.rollSeconds; p.roll = 0.55; }
  if (world === 4) { p.nodes.fill(1); p.sparks = L.play.sparksToLight; }
  if (world === 5) { p.breaths = L.play.breathsToBalance; p.breath = 0; }
}

export function tapBridge(p: PlayState, now: number) {
  p.bridge = Math.min(1, p.bridge + 1 / L.play.bridgeTaps);
  p.bridgeTapAt = now;
}

/** A spark lights a random chain of nodes (the scene animates the pulse). */
export function spark(p: PlayState, now: number) {
  p.sparks += 1;
  p.sparkAt = now;
  const want = Math.ceil(p.nodes.length / L.play.sparksToLight) + 1;
  let lit = 0;
  for (let tries = 0; tries < 200 && lit < want; tries++) {
    const i = Math.floor(Math.random() * p.nodes.length);
    if (p.nodes[i] < 0.5) { p.nodes[i] = 1; lit++; }
  }
  if (p.sparks >= L.play.sparksToLight) p.nodes.fill(1);
}
