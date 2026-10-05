/**
 * Per-place route data (index = place): Watch hold, camera hold, room anchors, vivid colour, atmosphere.
 * Split out of lib/config.ts experienceConfig unchanged (2026-10-05) so a new route can replace the places without
 * touching the locked feel constants in experienceFeel.
 */
export const routeData = {
  /** Film-time per place (s): how long Watch holds there, then how long the passage to the next one takes. */
  holdSeconds: [14, 40, 48, 44, 40, 34, 34, 34, 40, 50, 30],
  /** Camera holds: position and look target per place (index = place). */
  camera: [
    { pos: [0, 1.7, 9], look: [0, 1.6, 0] }, // Atrium
    { pos: [0, 1.7, -22], look: [0, 1.4, -40] }, // Studio Floor
    { pos: [-6, 1.6, -70], look: [-12, 4, -88] }, // Drafting Hall (Aurelius)
    { pos: [-30, 1.7, -112], look: [-30, 2.5, -140] }, // Projection Hall (GGP)
    { pos: [-6, 2.2, -168], look: [18, 1.5, -190] }, // Concourse
    { pos: [30, 1.4, -206], look: [42, 1.2, -228] }, // Water Court (Valora)
    { pos: [58, 1.6, -246], look: [64, 1.0, -266] }, // Garden Court (Asraya)
    { pos: [64, 1.8, -296], look: [64, 8, -318] }, // Glass Lattice (Rudra Yugen)
    { pos: [24, 70, -60], look: [10, 0, -150] }, // Roof (above the whole Atelier)
    { pos: [0, 1.7, 6], look: [-9, 2.2, -2] }, // Gallery (the Atrium's curved wall)
    { pos: [0, 1.7, 10], look: [0, 1.2, 0] }, // Post-credits (the Atrium at dusk)
  ] as { pos: [number, number, number]; look: [number, number, number] }[],
  /** Where each place's room geometry is centred. */
  anchors: [
    [0, 0, 0], [0, 0, -40], [-12, 0, -86], [-30, 0, -140], [12, 0, -186], [42, 0, -228], [64, 0, -266], [64, 0, -318],
    [0, 0, 0], [0, 0, 0], [0, 0, 0],
  ] as [number, number, number][],
  /** A place's "vivid colour" (C5) or null for neutral places (gold is the accent there). */
  colour: [null, null, "#3D4BFF", "#E8307F", null, "#FF6A3D", "#23C27C", "#0FB5E4", null, null, null] as (string | null)[],
  /** Atmosphere (background + fog) per place, light and dark (DESIGN.md world atmospheres). */
  atmosphere: {
    light: ["#F4F5F7", "#F4F5F7", "#E7E9FF", "#FDE7F0", "#F4F5F7", "#FFEDE6", "#E2F7ED", "#E1F6FD", "#F1EEE6", "#F4F1EA", "#D9DEE7"],
    dark: ["#0B0F1A", "#0B0F1A", "#0A0E3A", "#2A0717", "#0B0F1A", "#2A0F07", "#042419", "#04202B", "#14110B", "#120F0A", "#070A12"],
  },
} as const;
