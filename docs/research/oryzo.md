# Oryzo — oryzo.ai (by Lusion)

Studied 2026-09-28 in headless Chrome with GPU WebGL (Apple M4 / ANGLE Metal) at 1440×813 and 390×844 (touch, DPR 3).
Screenshots: `docs/research/oryzo/` — `d-*` desktop scroll sequence, `m-*` phone sequence, `i-*` interaction tests.

## Concept and story
A fake "AI-powered" luxury cork coaster, sold with the full ceremony of a flagship product launch. It is a
parody of AI-product marketing ("Powered by AI*" with an Adobe Illustrator footnote, "Runs on RTX 3090",
"Legacy Support" shown on ancient Greek pottery, a spoof model card and research paper for "ORYZO-1").
The payoff line at the end reframes the whole thing as the studio's portfolio: *we caught your attention
with a non-existent product — if we can sell a coaster, imagine what we can do for your brand.*
**The site is the pitch.** Every scene demonstrates craft instead of describing it.

## Navigation model
- One very long page (≈51,500 px on desktop) of pinned, full-screen "scenes" driven by scroll.
- A tiny top-right text nav (Intro / Features / Product / Contact) jumps to anchors; on phones it collapses
  to a "• MENU" pill. A vertical "ORYZO-1 MODEL" tab rides the right edge.
- A thin progress bar on the right edge (the white sliver in every frame) shows position.
- "Scroll to continue" cue at the bottom of nearly every scene — confident, not fussy.
- No custom cursor; the system cursor is used. Interaction happens on the objects/buttons themselves.

## Pacing
Roughly 30 distinct beats. Each gets about one viewport of scroll to *arrive*, a moment to *hold*, and
a transition to *leave*. Loud beats (the rainbow "Powered by AI" glow, the giant "it's wearable" word,
the bark cracking open) alternate with quiet ones (a dark title card, a macro texture). Nothing is
rushed; the humour lands because each joke gets its own screen.

## Loader and intro
- Olive-green screen; a coaster outline is *drawn in construction lines* like a vector tool — bezier handles,
  guides, anchor points — and the ring fills like a pie chart as assets load. The loader *is* the brand
  motif (design-tool craft) rather than a spinner.
- Resolves straight into the hero: a photoreal top-down desk (cutting mat, pencil, paperclip, craft knife)
  with the coaster, a huge rounded-grotesk wordmark, a frosted-glass info card, a small video "PLAY" tile.

## Notable scenes and how they're likely built
| Beat | What happens | Likely technique |
|---|---|---|
| Hero desk | Photoreal still-life with shallow depth of field (blurred pencil) | Baked-light textures (`hero/BASE.webp`) on simple geometry + Gaussian-splat props (`splats/props.sog`), bokeh DOF pass |
| "Isn't just a coaster" | The coaster lifts off the desk and flips in space on dark brown | Same 3D coaster object, scroll-scrubbed rotation; the *one persistent object* carries you between scenes |
| "Powered by AI*" | A 3D hand holds the coaster; screen edges bloom with a rainbow "AI glow" | Hand model (`models/hand.buf`), full-screen edge-glow shader as parody |
| "So portable, it's wearable" | Coaster sits inside an Illustrator-style artboard with selection handles; giant word slides past; frame morphs into a photo | DOM frame + WebGL; the selection box resizes into a media card — design-tool motif again |
| Wearable gallery | Horizontal strip of photos/videos of people wearing coasters, advancing with scroll | Scroll-scrubbed horizontal track, MP4 tiles |
| "RISE" magazine cover | A parody magazine cover zooms into a full 3D desk scene | Card → full-bleed camera move into the same 3D world |
| Features | Frosted glass side panel with copy; the 3D desk behind switches *render modes*: normal → thermal-camera false colour → top-down → technical line sketches | One scene, many shader "looks"; the blur panel is rendered in WebGL (`u_blurTexture`, `u_blurRect`) |
| Wordmark | Construction circles resolve into the wordmark, the O's being coasters | Vector line animation |
| "Smart flip encryption" | Coaster with a *Decode message* button | Small playful toy inside a scene |
| Macro | Camera dollies into the cork rim, then into bark; a crack splits to reveal "sustainability" | Macro texture/height maps, a bark model, DOF; a *physical* reveal instead of a fade |
| Dark → light | Palette flips to warm cream with dappled leaf shadows | Gobo/leaf-shadow overlay; a change of day as a chapter break |
| Product | "Choose your own ORYZO" (Oryzo / Pro / Pro Max) with a comparison table and a spinning coaster | Configurator pattern, used for the joke |
| Close | Coffee beans tumbling in the dark behind the payoff line + footer | Particle/instanced beans with DOF |

## Typography
A rounded, heavy geometric grotesk in all-caps for headlines, set enormous (the wordmark and single words
fill the width); a small, tight sans for body copy; small caps-style labels. Very few sizes, very high contrast
between them. Headlines often *interact* with 3D (the coaster passes through letters, a word is lit by bloom).

## Colour
Dark roasted brown (not black) as the base, cork orange as the accent, cream text. Deliberate single moments
of loud colour (the rainbow AI glow, the red wearable photo, the thermal false-colour) — each is a joke or a
reveal, so the loudness is earned. A late switch to cream-on-light feels like daylight arriving.

## Motion character
Heavy, eased, cinematic. Objects move with weight (slow in, slow out); camera moves are long and continuous.
Text arrives with SplitText-style line/character reveals and blur-to-sharp fades. Restraint: most frames have
one thing moving.

## Blur and depth
Used everywhere and always with meaning: shallow depth of field on the desk (focus on the product), bokeh
parameters tuned per scene (the bundle exposes `bokehAmount`, `bokehFNumber`, `bokehFocusDistance`,
`bokehFocalLength`), frosted-glass panels over the 3D (WebGL blur of the scene behind the panel rectangle),
blur-out transitions between feature copy, motion blur on the camera.

## Sound
None found (no audio files; the only AudioContext code belongs to the Rive runtime).

## Cursor
System cursor. The bundle has a "screen paint distortion" parameter, but no visible effect showed in testing.

## Mobile adaptation
The same 3D world on phones, not a stripped fallback: canvas at DPR 1.5 (585×1266 for a 390 px viewport),
scenes recomposed vertically, horizontal galleries become one framed card at a time, feature copy moves to a
glass card at the bottom, nav becomes a "MENU" pill. Scroll is native touch.

## Performance tricks
- Lighting is **baked into textures** (diffuse/height maps) instead of computed live.
- **Gaussian splats** for photoreal props and reflections (`.sog`, decoded in a web worker).
- Models in a compact custom binary format (`.buf`), textures in WebP/AVIF, one 297 KB (gzip) JS bundle
  (custom engine + GSAP + SplitText + Rive).
- Heavy media (MP4s, splats) streamed per scene; ~25 MB total over the whole journey but the hero needs a fraction.
- No `prefers-reduced-motion` handling was found — a gap we must not copy.

## What makes it feel premium
1. **One idea, fully committed** (the absurd AI coaster) and a payoff that reframes it as proof of skill.
2. **One persistent hero object** that carries you through every scene — continuity instead of sections.
3. **A recurring craft motif** (vector construction lines, artboards, selection handles) from loader to finale.
4. **Photoreal material honesty** (cork texture, shallow DOF, real light) makes the joke credible.
5. **Pacing** — every beat gets its own screen and a breath.
6. **Humour with confidence** — no over-explaining.
7. **Mode changes of the same world** (thermal, sketch, macro, day/night) instead of new pages.
