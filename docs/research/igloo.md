# igloo.inc — Igloo Inc. (parent company of Pudgy Penguins and others)

Studied 2026-09-28 in headless Chrome with GPU WebGL (Apple M4) at 1440×900 and 390×844 (touch), scrolling
forwards through a full loop, backwards, and interacting (shards, arrows, drag, sound).
Screenshots: `docs/research/igloo/` (local only): `d-*` desktop forward/back, `i-*` interactions, `m-*` phone.

## Concept
A holding company presented as **one continuous piece of weather**. You start at an igloo on a snowy
ridge; the igloo *is* the company (a structure built from blocks = ventures). Scrolling pushes the camera
through the snow into white fog, where each portfolio company floats past as a **carved ice shard** with its
mark pressed into it; then the blocks reassemble into a spinning ring, a portal of light, a pedestal where a
particle creature forms, and finally the igloo rebuilds itself on the ridge — **and the journey loops**.
It's a parent company that never *lists* its companies; it *passes through* them.

## Navigation flow (the key lesson)
- **One camera, one shot.** There are no pages, sections or menus. Scroll (wheel/touch) drives a single camera
  along a path (the bundle has CatmullRom splines and GSAP) through every scene. Nothing cuts: igloo → fog →
  shard 1 → fog → shard 2 → shard 3 → rings → portal → pedestal → igloo.
- **Fog and blur are the transitions.** Between beats the frame dissolves into a soft white-grey haze with
  chromatic fringes and motion blur; the next object condenses out of it. The haze hides loading and makes
  every change feel like travel, not a cut.
- **Infinite and reversible.** Scrolling back plays the film backwards; scrolling past the end rebuilds the igloo
  and starts again. There is no "bottom of the page".
- **Almost no conventional UI.** Top-left wordmark; top-right a tiny manifesto paragraph (only in the first
  scene); bottom-left "Scroll down to discover" + a Sound toggle. Everything else — project labels, dates,
  "click to explore", social links — is *attached to the 3D objects* as thin technical annotations (leader
  lines, coordinates, "PORTFOLIO_CO_01", temperatures) that appear only when the object is in view.
- **Depth on demand.** Clicking a shard darkens the world to dusk and a monospace project brief *types* itself
  in over the dimmed scene, with a Close button. You go deeper without leaving the journey.
- **Contact as an object.** At the end, left/right arrows morph a particle cloud on a pedestal into each social
  network's letterform (LinkedIn → X → Medium …); a bracketed label underneath names it.
- **Weak spot:** there is no way to *jump* — to reach the third company you must scroll through the first two,
  and nothing tells you how much journey is left. This is where we must do better (the five verticals need a
  visible "you are here" and direct jumps).

## Pacing
Roughly 12 beats per loop, each ~2–3 wheel gestures long. Monumental, silent objects alternate with white-out
fog. Big gestures (the igloo exploding into blocks, the light ring flaring) punctuate long calm drifts.

## Loader and intro
A tiny horizontal row of flickering characters on flat grey (a scrambling text loader), then the igloo scene
fades up with blocks settling into place and numbers on them counting — the loader resolves *into* the hero.

## Look
Monochrome cold grey-blue with white light — snow, ice, fog. One material family (frosted ice / snow) keeps
very different scenes coherent. Light blooms on block seams, chromatic aberration on fast moves, film grain.
**Proof that a bright, pale, luminous world can feel premium** (relevant to our palette A).

## Typography
A heavy rounded display wordmark; everything else is small monospace (technical, like instrument read-outs).
All text — including paragraphs — is drawn inside WebGL with MSDF fonts; the DOM contains no readable text.

## Sound
Sound Off by default with a visible toggle; the first click/tap turns it on (a pattern we won't copy — ours
stays off until the toggle is used). Stems: music, wind, room tone, per-scene cues (igloo, shard, particles,
circles, manifesto), UI short/long, enter/leave project. An audio worker processes them.

## How it's built
- Custom engine on three.js r165 + GSAP; code-split `App3D` bundle (~413 KB gzip) plus Draco/Basis workers,
  an EXR worker, a bitmap worker and an MSDF-font worker.
- All textures in **KTX2** (≈12 MB), meshes Draco-compressed (`.drc`), volumetric data as 3D textures
  (`volumes/*_64.ktx2` for the particle creatures), a scroll "data texture".
- Post: bloom, bokeh/DOF, chromatic aberration, SMAA/TAA, film grain.
- No `prefers-reduced-motion` handling found. No DOM text (poor for accessibility and SEO).

## Mobile
The full journey, reframed for portrait; swipe drives the same camera. Same annotations, smaller.

## What makes it feel premium
1. **The company is a place you travel through**, not a page you read.
2. **One continuous shot**, with fog/blur as the only transition device — no cuts, ever.
3. **UI lives on the objects** (annotations) instead of in chrome; the frame stays nearly empty.
4. **One material language** across every scene.
5. **Reversible and looping** — the journey feels like a world, not a document.
6. **Depth on click** (the dusk + typed brief) without leaving the world.

## What we take (and improve)
- Take: the continuous camera journey with haze/blur transitions; annotations attached to objects; one material
  family per world; the reversible timeline; a loader that resolves into the first scene; contact as an object.
- Improve: add a **visible timeline and direct jumps** (Production's reel timeline) so the five verticals are always
  reachable; keep **all text as real HTML**; honour **reduced motion**; keep **sound off until asked**.
- Don't take: the igloo, ice shards, penguins, its annotation styling, monospace sci-fi read-outs or its sound design.
