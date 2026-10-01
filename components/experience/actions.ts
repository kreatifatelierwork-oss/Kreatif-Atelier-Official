/**
 * The one interaction in each world, shared between its DOM control (a ghost button in the caption block, keyboard
 * and touch friendly) and the scene that answers it. Plain mutable state read in useFrame; nothing here re-renders.
 */

export const interaction = {
  /** Aurelius: how far the stair flights have turned into line (0..1); 1 = the hall builds itself. */
  angle: 0,
  angleHeld: false,
  /** How far the Drafting Hall has built itself (0..1), written by the scene (the Lens hides when it is built). */
  built: 0,
  /** Golden Guardian Productions: the aperture is held open; how open it is (0..1). */
  rollHeld: false,
  roll: 0,
  /** The Concourse: times (ms) of recent launches; each sends a wave through the streams. */
  launches: [] as number[],
  /** Valora: stones laid across the water (0..STONES). */
  stones: 0,
  /** Asraya: breathing in (held), the breath (0..1), and breaths completed. */
  breathHeld: false,
  breath: 0,
  breaths: 0,
  /** Rudra Yugen: sparks sent (each turns more panes into line); the time of the last one. */
  sparks: 0,
  sparkAt: -1e9,
  /** The Lens in the Drafting Hall: pointer position in CSS px (null = no pointer). */
  lens: null as null | { x: number; y: number },
};

export const STONES = 8;
export const BREATHS = 3;
export const SPARKS = 9;

export function launch(now: number) {
  interaction.launches.push(now);
  if (interaction.launches.length > 6) interaction.launches.shift();
}

export function layStone() {
  interaction.stones = Math.min(STONES, interaction.stones + 1);
}

export function spark(now: number) {
  interaction.sparks = Math.min(SPARKS, interaction.sparks + 1);
  interaction.sparkAt = now;
}
