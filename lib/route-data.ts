/**
 * Per-place route data (index = place): Watch hold, camera hold, room anchors, vivid colour, atmosphere.
 * v5 "One Take Across the World" (docs/concepts/WORLD-PLAN.md): one place per home reference frame (H01–H36, see
 * docs/design/REFS-ANALYSIS.md), twelve chapters. The locked feel (travel, wheel, follow, cap, jump, settle) lives in
 * lib/config.ts experienceFeel and is not touched by the route.
 *
 * World units are metres. The camera flies -z along the route; the chapters change altitude physically: the jungle
 * floor (y≈1), up the trunk (y 8→70), over the cloud sea (y≈80), the atlas from high above (y≈210), down into the
 * canyon, through the cave, over and under the sea, up the glacier, onto the summit and the night sky, and down to
 * the dawn clearing.
 */
type V3 = [number, number, number];

/** The per-place lists one journey supplies to the engine. */
export type RouteData = {
  holdSeconds: number[];
  camera: { pos: V3; look: V3 }[];
  anchors: V3[];
  colour: (string | null)[];
  atmosphere: { light: string[]; dark: string[] };
};

export const routeData: RouteData = {
  /** Film-time per place (s): how long Watch holds there; the passage to the next takes experienceFeel.travelSeconds.
   *  Set so the act bar reads about the times in the reference frames (H01 00:04 … H36 06:55). */
  holdSeconds: [
    // Long enough to read everything at the place twice (~3.3 words/s, plus 2 s for the frame; user decision
    // 2026-10-05). Counted from route.ts; recount with node scripts/v5/hold-times.mjs when copy changes.
    6, 7, 8, 7, 9, 9, // 1 The Seed
    20, 6, 6, // 2 The Climb
    12, 15, // 3 Above the Canopy
    9, 7, // 4 The Five Peaks
    6, 12, 15, // 5 Aurelius
    6, 6, 16, // 6 Golden Guardian Productions
    6, 6, 12, // 7 Valora
    6, 6, 15, // 8 Asraya
    6, 12, 10, // 9 Rudra Yugen
    7, 8, 10, 95, // 10 The Summit
    20, 23, 60, // 11 The Night Sky
    30, // 12 Return
  ],
  /** Camera holds: position and look target per place (index = place). */
  camera: [
    // 1 The Seed: the jungle floor at dawn, along the stream.
    { pos: [0, 1.0, 0], look: [1.5, 2.6, -40] }, // H01 the flood clears
    { pos: [1.2, 0.85, -12], look: [1.6, 0.45, -16] }, // H02 the drop on the leaf (macro)
    { pos: [0, 1.25, -26], look: [0, 3.2, -60] }, // H03 Kreatif Atelier in the mist
    { pos: [-1.2, 1.2, -44], look: [1.8, 3.0, -72] }, // H04 Where Strategy Meets Story
    { pos: [0, 1.4, -62], look: [0.5, 3.2, -92] }, // H05 the four field-guide callouts
    { pos: [1.8, 1.5, -78], look: [-2.2, 2.0, -86] }, // H06 the map on the giant leaf
    // 2 The Climb: up the colossal tree at (0, 0, -100).
    { pos: [0.5, 9, -91.5], look: [0, 42, -100] }, // H07 the quote spirals up the trunk
    { pos: [6, 58, -100], look: [3, 64, -150] }, // H08 Ideas, People, Impact (at the canopy top, tiers rising ahead)
    { pos: [4, 80, -116], look: [0, 80, -218] }, // H09 out of the canopy: 5 and ∞ (open sky; the rig's long fog)
    // 3 Above the Canopy: the cloud sea at sunrise.
    { pos: [0, 82, -150], look: [0, 86, -320] }, // H10 a creative holding company
    { pos: [0, 78, -196], look: [12, 88, -340] }, // H11 the Vision across the sky
    // 4 The Five Peaks.
    { pos: [0, 88, -246], look: [0, 96, -380] }, // H12 Five pillars
    { pos: [0, 230, -420], look: [0, 0, -610] }, // H13 the atlas from high above (beyond the peaks)
    // 5 Aurelius: the desert canyon at dusk.
    { pos: [-20, 46, -430], look: [-46, 34, -500] }, // H14 Aurelius carved in the wall
    { pos: [-34, 26, -478], look: [-60, 24, -530] }, // H15 the four offerings
    { pos: [-48, 13, -522], look: [-58, 15, -560] }, // H16 the portal
    // 6 Golden Guardian Productions: the cave of stories.
    { pos: [-58, 12, -584], look: [-60, 14, -650] }, // H17 into the cave mouth
    { pos: [-60, 10, -650], look: [-50, 13, -705] }, // H18 STORIES
    { pos: [-52, 8, -700], look: [-40, 15, -745] }, // H19 the projection on the mist
    // 7 Valora: the coral coast and the reef.
    { pos: [-40, 12, -760], look: [-18, 6, -870] }, // H20 out through the sea arch
    { pos: [-20, 16, -822], look: [0, 0, -905] }, // H21 Valora on the water
    { pos: [-2, -6, -882], look: [10, -9, -935] }, // H22 the reef
    // 8 Asraya: the jade lake.
    { pos: [10, 0.6, -942], look: [20, 8, -1020] }, // H23 breaking the surface
    { pos: [20, 2.5, -990], look: [30, 8, -1060] }, // H24 Asraya in the mist
    { pos: [30, 2, -1030], look: [40, 3, -1090] }, // H25 the lanterns and the gateway
    // 9 Rudra Yugen: the glacier and the aurora.
    { pos: [40, 18, -1088], look: [52, 28, -1150] }, // H26 up to the ice cave
    { pos: [52, 26, -1142], look: [56, 30, -1192] }, // H27 Rudra Yugen in the ice
    { pos: [56, 30, -1190], look: [62, 58, -1290] }, // H28 the aurora and the ice gate
    // 10 The Summit.
    { pos: [60, 142, -1238], look: [60, 124, -1300] }, // H29 the monument
    { pos: [60, 182, -1252], look: [60, 104, -1318] }, // H30 Our ecosystem serves
    { pos: [62, 172, -1262], look: [60, 112, -1310] }, // H31 Impact
    { pos: [56, 150, -1276], look: [70, 150, -1320] }, // H32 What makes us different
    // 11 The Night Sky.
    { pos: [60, 160, -1296], look: [60, 190, -1400] }, // H33 the credits
    { pos: [60, 168, -1318], look: [60, 222, -1420] }, // H34 the star chart
    { pos: [60, 122, -1340], look: [80, 100, -1420] }, // H35 the trail down
    // 12 Return: the dawn clearing.
    { pos: [70, 2, -1420], look: [72, 4, -1480] }, // H36 the closing scene
  ] as { pos: V3; look: V3 }[],
  /** Where each place's set is centred (its look target). */
  anchors: [] as V3[],
  /** A place's vivid colour (C5): dominant inside its company's land; null outside (gold is the accent there). */
  colour: [
    null, null, null, null, null, null, null, null, null, null, null, null, null,
    "#3D4BFF", "#3D4BFF", "#3D4BFF",
    "#E8307F", "#E8307F", "#E8307F",
    "#FF6A3D", "#FF6A3D", "#FF6A3D",
    "#23C27C", "#23C27C", "#23C27C",
    "#0FB5E4", "#0FB5E4", "#0FB5E4",
    null, null, null, null, null, null, null, null,
  ] as (string | null)[],
  /** Atmosphere (background + the passage haze) per place: the light each world is lit by. Light = the day grade
   *  (default), dark = the Cinema night grade. */
  atmosphere: {
    light: [
      "#8A7A4E", "#6E6644", "#8C7C50", "#88784C", "#85764B", "#80734A",
      "#E7E8D2", "#F1E6C8", "#F6DDB4",
      "#F5D9AE", "#F3D2A8",
      "#F1CDA4", "#E9D4B8",
      "#4B4C8F", "#3A3D82", "#33367A",
      "#3A1430", "#4A1036", "#561444",
      "#F2A07C", "#F39A7A", "#2E8C93",
      "#CFE4D4", "#D4E7DA", "#D8E8DA",
      "#B9E3EE", "#9EDCEB", "#16465A",
      "#E8B08F", "#E2A88B", "#D99C88", "#5D6A9A",
      "#16204A", "#121A40", "#141C40",
      "#F5DDB8",
    ],
    dark: [
      "#0F1A10", "#0C160D", "#101A10", "#0F190F", "#0E180E", "#0D170D",
      "#121A12", "#1A1A12", "#1C1610",
      "#1E150E", "#1C130D",
      "#1A120C", "#14100C",
      "#0C0D2E", "#0A0B28", "#090A24",
      "#16050F", "#1C0513", "#200617",
      "#24100A", "#200E0A", "#06171A",
      "#071A12", "#081C14", "#081C14",
      "#06161D", "#051720", "#041016",
      "#1A100C", "#180F0C", "#160E0C", "#0C0F1C",
      "#070A18", "#060915", "#070A16",
      "#1A1510",
    ],
  },
};
// Chapters 5 onward lie beyond the atlas: shift them along the route (the lands are below the atlas view).
for (let k = 13; k < routeData.camera.length; k++) {
  routeData.camera[k].pos[2] -= 200;
  routeData.camera[k].look[2] -= 200;
}
routeData.anchors = routeData.camera.map((c) => c.look);
