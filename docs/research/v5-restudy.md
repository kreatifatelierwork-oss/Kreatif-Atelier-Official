# Re-study for v5: igloo.inc and oryzo.ai (2026-10-06)

Focus (from the v5 brief): environment density, flying THROUGH foreground layers, how long text stays on screen,
Oryzo's callouts and graphical text. Earlier notes: `igloo.md`, `oryzo.md` (concept, navigation, loaders).

Method: headless Chrome with GPU WebGL at 1440 × 900, scrolling at a fixed pace (100 px of wheel every 160 ms),
recording every step which text is in the viewport and readable (opacity > 0.6 along its ancestors), plus a frame every
1,000 px (`scripts/research/text-dwell.mjs`, `scripts/research/contact-sheet.mjs`). Oryzo: 52,000 px. Igloo: 40,000 px
(about three loops). Consent banners were declined or absent; no gates were passed. Frames stay local (gitignored).

## How long text stays

| | Oryzo (DOM text, measured) | Igloo (WebGL text, read from frames) | Ours (v5 now) |
|---|---|---|---|
| A headline or line, readable | median **1,300 px**, p10 400, p90 2,400 | annotations about **1,000 px** (one frame), the manifesto only in the first scene | **≈ 1,200 px** fully visible (0.72 place before to 0.62 after, at 900 px per place), plus wipes |
| Points of the scroll with no text | none | many (white-out fog between beats) | none (each place's text overlaps its neighbours') |
| How text arrives | slide/mask in with the scene; big words partly hidden by the object, then revealed (the "it's wearable" word behind the coaster) | typed in, monospace, attached to the object | wipe in, anchored in the world |

Readings:
- Oryzo gives each joke **its own screen**: a line stays readable for about 1.5 viewports of scroll, and the dense
  scenes (the magazine cover, the specification sheet) stay pinned for 2,000–2,400 px. Our window is in the same range;
  for the dense places (Why us, the services hall, the strata, the credits) we should keep their holds long (done: the
  read-twice holds) and, if they still feel quick, widen `TEXT.after` for list items only.
- Igloo's text is decoration (coordinates, IDs). It is short-lived because nothing needs reading. We carry real
  content, so we follow Oryzo's timing, not Igloo's.

## Density and flying through layers

- **Igloo** is sparse: one monumental object per beat in white fog, the next condenses out of the haze. Density comes
  from the *fog layers and particle snow* the camera moves through, plus objects that pass very close to the lens
  (shards, blocks) and are cut by the frame edge. Every handover is a white-out: the fog thickens to near-solid, the
  scene changes inside it, then it clears. The igloo explodes into blocks that fly past the camera, so the transition
  itself is something you fly through.
- **Oryzo** is a set of pinned scenes, mostly photographic plates and 3D product shots (with splat props on the desk).
  Its sense of depth comes from **macro moves** (the camera dives into the cork texture, the bark cracks open and the
  camera passes between the halves) rather than from travelling through a space.
- **Implication for us:** our splat worlds give the space Igloo fakes with fog, but the handovers should borrow
  Igloo's rule: the threshold element must fill most of the frame for a moment (a near-solid wall of leaves, rock, water
  or ice right at the lens) so the world swap happens behind it. Our `Threshold` props are sized for that; when the
  worlds arrive, check that each handover reaches near-full cover for at least 0.1 place.
- Things passing close to the lens are what sell "through". Igloo does it every beat. We have foreground cards
  (leaves, bamboo, rock) at holds; with the splat worlds, add 3D props on the route itself between holds (a branch, a
  stalactite, coral) that cross the frame at 1–3 m.

## Oryzo's callouts and graphical text

- **Callouts:** a thin line from a precise point on the object to a short label, a small monospace caption below,
  aligned to a strict grid (the specification sheet, the "Grip-locked antislip" diagram). Lines are 1 px, the dot at
  the object is small and solid, labels never overlap the object. Our X01 callouts match; keep the label clear of the
  object and keep one bend.
- **Graphical text:** words used as objects: a word larger than the screen sliding past ("it's wearable",
  "sustainability"), a word partly hidden behind the product then revealed, a magazine cover as a full layout, an
  ancient-pottery "Legacy Support" lineup with museum captions. The giant word is always one word, set tight, with
  the object overlapping it.
- **Implication for us:** our giant-type treatment (H18 "STORIES" behind the pillars) is the right register; use it
  once per land at most, with the land's subject overlapping the word. The museum-caption style (object, small mono
  caption under it) suits the GGP showreel frames and the Aurelius strata.

## Actions taken
- Kept the text lifetime as built (it already matches Oryzo's median); dense places get the read-twice holds.
- Thresholds: to be checked for near-full cover once the splat worlds are in (noted for the w01–w03 stitching).
- Route props passing close to the lens: to add per world during stitching.
