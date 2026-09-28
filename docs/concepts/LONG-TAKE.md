# Concept 4 — THE LONG TAKE (Orrery × Production)

*"One vision, five worlds, filmed in a single unbroken shot."*

Prototype: **`/concepts?concept=4&palette=a`** (light) · **`&palette=b`** (glow). Screenshot sheets in this folder:
`palette-a-1440.png`, `palette-b-1440.png`, `palette-a-390.png`, `palette-b-390.png`, `reduced-motion.png`.
Structure and copy come from `content/verticals.ts` (the new chart, transcribed exactly). New UI wording is
flagged PROPOSED in `content/concepts.ts` → `longTake`.

## The idea, in plain words
Kreatif Atelier is a radiant **core** — a small orrery of five coloured rings around a sun of light — and its five
verticals are **worlds** placed around it on a golden ring, each with its own signature colour and its own sculpture.
The whole site is **one continuous camera shot** (a "long take", the film term for an uncut shot): it pulls back out of
the core's light, then travels out to each world in turn, lingers there, breathes out into coloured haze, and flies on to
the next. At the end it rises high above the orrery to show all five worlds connected by light, and hands you to
*Our ecosystem serves*, *Impact* and contact.

| World | Colour | Original sculpture (not a logo) | Why |
|---|---|---|---|
| Core — Kreatif Atelier | warm gold / pearl | a sun of light inside five thin coloured orbit rings | the holding company holding its verticals in orbit |
| Aurelius | royal indigo | a rising spiral of slabs round a gold axis | "Builds brands that lead and last" — structure that climbs |
| Valora | sunrise coral | an arch that assembles tile by tile | "Bridges education with real-world opportunities" |
| Golden Guardian Productions | cinema magenta | an iris aperture that opens with a beam of light | stories, visuals, the lens |
| Rudra Yugen | electric cyan | a glowing lattice around a glass core | innovation, R&D, futures |
| Asraya | fresh jade | a balanced cairn over slow ripples | balance, wellbeing |

## Navigation flow
- **Loader** — a gold ring draws itself on a luminous page; the five worlds light up on it as loading progresses;
  *Begin*. The ring is literally the orbit you're about to enter.
- **Opening** — the camera starts inside the core's light and pulls back; the orrery appears with the worlds strung
  along its horizon; the title card: **KREATIF ATELIER**, "Ideas | People | Impact", and the two chart lines.
- **Travel** — scroll / swipe / arrow keys play the film forward and back. Between worlds the camera swings out on a wide
  arc and the frame dissolves into haze of the *next* world's colour (fog + depth-of-field + text dissolving), then the next
  world condenses out of it. No cuts. Stop scrolling and it gently settles on the nearest world.
- **Inside a world** — one focal point: the sculpture. The name is set huge over its base (TURA headline), the tagline
  is the microtype above, the value line the caption below, and the four "what we do" items float as labels attached to
  the sculpture (igloo-style annotations, but real HTML). Neighbouring worlds recede into the world's colour.
- **Always know where you are** — the bottom edge is a film **reel timeline**: seven colour-coded reels
  (00 Core · 01–05 the verticals · 06 Ecosystem) with a playhead, "Reel 02 / 06 — Valora" and a running timecode.
  Click any reel and the camera *travels* there through the worlds in between (reduced motion: it cuts).
- **Jump anywhere** — top-right *Verticals* opens a frosted-glass menu listing every reel with its colour and tagline.
  Keys 0–6 jump directly.
- **Frame (TURA)** — *KREATIF / ATELIER* in type top-left, *Verticals* and *Contact* top-right, "Ideas | People | Impact"
  on the left edge, a SCROLL cue on the right edge, the timeline as the section index along the bottom.

## Storyboard (full build)
| Reel | Scene | Text | Interaction |
|---|---|---|---|
| Loader | ring draws, worlds light up | "Setting the scene · %" | Begin |
| 00 Core | pull back from the light; orrery horizon | name, motto, the two lines; vision + pillars (full build) | drag to turn the orrery (full build) |
| 01 Aurelius | spiral of slabs | tagline · name · value; 4 annotations | **Hold to raise** — the spiral climbs; the value line lights up *(prototype)* |
| 02 Valora | arch assembles as you arrive *(prototype)* | 〃 | tap tiles to complete the bridge (full build) |
| 03 Golden Guardian Productions | iris opens with a beam | 〃 | drag to focus / open the aperture (full build) |
| 04 Rudra Yugen | lattice + glass core | 〃 | draw a path between nodes to light it (full build) |
| 05 Asraya | cairn over ripples | 〃 | hold to breathe — ripples slow with your breath (full build) |
| 06 Ecosystem | rise high; all five worlds joined by light | "Disciplines today. A brighter tomorrow.", Our ecosystem serves, Impact, contact | — |

## Palettes (switch with `?palette=a|b`)
- **A · Light** — pale luminous bases (warm pearl for the core; soft periwinkle, blush, rose, sky, mint for the worlds),
  vivid saturated sculptures, gold as the connecting metal, clean neutral tone mapping, frosted white glass.
- **B · Glow** — deep, rich bases of each world's own hue (midnight indigo, ember, plum, deep teal, forest) lit by glowing
  emissive sculptures, bloom, a warmer filmic grade, smoked glass.
Both keep the blur, depth of field and glass, but bright: haze of colour instead of darkness.

## Phones and reduced motion (both built in the prototype)
- **Phones**: swipe drives the take; wider lens and pulled-back camera; the four items become a list under the name; the
  timeline becomes a colour bar with the current reel name and timecode; *Verticals* opens the same jump menu.
- **Reduced motion**: no flights, haze or drifting — reel changes cut with a short crossfade; sculptures hold still;
  *Hold to raise* becomes a single press.
- The whole structure is also present as plain HTML (hidden visually) for screen readers and search.

## What we took from igloo.inc (and what we didn't)
- **Took**: the company as a place you travel through; one continuous camera path; haze/blur as the only transition;
  labels attached to objects instead of chrome; reversible time (scroll back = play back); a loader that resolves into
  the first scene; a near-empty frame.
- **Did better**: a visible timeline + direct jumps (igloo has none); real HTML text (igloo draws all text in WebGL);
  reduced-motion support; sound stays off until asked.
- **Didn't take**: its igloo, ice shards, characters, monospace read-outs, grey palette, sound design or any code/assets.

## Honest trade-offs
- **Effort: large.** Five bespoke sculptures, camera choreography, two palettes and per-world interactions.
- **Performance risk: medium.** Depth of field and glass are the expensive parts; phones already drop DOF in the
  prototype. Everything is procedural (no model downloads), which keeps the page light.
- **Content fit: strong.** The chart's structure (five verticals × tagline, four offerings, value line) maps one-to-one
  onto the worlds; services, pricing, founders and process can live inside the relevant worlds later (e.g. founders in
  the core, Aurelius hosting the old services).

## Assets that would lift it (none required — procedural stand-ins are in place)
| For | Asset & why | Where (search / filters) | Format → folder | Meanwhile |
|---|---|---|---|---|
| All worlds | **Soft studio HDRI** for richer, brighter reflections on the glossy sculptures | Poly Haven → HDRIs → Studio, e.g. "studio small 03", "photo studio loft hall" (CC0) | 1K `.hdr` → `public/env/` | light panels (current) |
| Sound (optional) | **Ambient pad per world + soft "whoosh" for travel + UI ticks**; off by default, visible toggle | Freesound filtered to *CC0*: "ambient pad", "air whoosh soft", "ui tick"; or Pixabay Music "ambient light" (Pixabay licence) | OGG/MP3, pads ≤ 400 KB, SFX ≤ 60 KB → `public/audio/` | silent |
| Golden Guardian Productions | **Real footage** (showreel clips) to play through the aperture's beam | your own archive | MP4 H.264 720p ≤ 10 s → `public/media/ggp/` | beam of light |
| Founders (when placed) | **Transparent cut-out portraits** | remove.bg on the originals | PNG with alpha ≥ 1200 px → `founders-cutout/` | current photos |
| Typography (optional) | a geometric sans with more character for the world names | Fontshare (ITF FFL, free commercial): "Satoshi", "Clash Display"; Google Fonts (OFL): "Outfit" (current) | WOFF2 → `next/font/local` | Outfit + Manrope + Cormorant |
Any asset used gets logged in `docs/ASSETS.md` with source and licence.
