# Synthesis — what makes these four sites feel expensive, and what we take from them

Sources: `oryzo.md`, `ivress.md`, `lacoste.md`, `shopify.md` (all studied 2026-09-28 at 1440 and 390, with
WebGL on, interactions played). We learn principles and techniques — we copy no code, models, images,
sounds, copy or signature designs.

---

## Part 1 — Principles (why they feel premium)

1. **The site is the proof.** Oryzo never says "we're great at 3D product storytelling" — it *does* it to a
   coaster, then says so in one line at the end. Lacoste doesn't explain the brand's sport, it lets you play it.
   An agency site should demonstrate strategy, story and craft in the way it behaves.

2. **One idea, fully committed.** Each site has a single governing idea (an absurd AI coaster; light versus
   darkness; brick-breaker on clay; "Everywhere"). Every screen, colour, sound and interaction serves it.
   Nothing is there "because 3D is cool".

3. **Continuity over sections.** A persistent protagonist — Oryzo's coaster, Ivress's traveller, Lacoste's
   ball — carries you from beat to beat. You follow a *thing*, not a page. When the world changes, it
   changes *mode* (Oryzo's thermal/sketch/macro views; Ivress's dark→gold→cream) rather than cutting to a
   new layout.

4. **Ritual at the threshold.** A loader that is itself a piece of the world (vector construction lines,
   a shadow creature, a bouncing ball), then a deliberate *start* (Ivress's "click to start", Lacoste's PLAY).
   The first seconds set the tone and justify the wait.

5. **Chapters you can name.** Ivress's `01 / 09 PROLOGUE`, Shopify's ten chapters and floating pill: people
   relax when they know where they are and how much is left. Naming chapters also makes the story quotable.

6. **Pacing: arrive, hold, leave.** Every beat gets space. Loud moments (a flash, a colour flood, a giant word)
   alternate with quiet ones (a dark title card, one line of text). Restraint is what makes the loud moments land.

7. **Interactions that *mean* something.** Ivress's *hold to push back the darkness* is the story's climax, not
   a toy. Lacoste's click-and-hold racket is the sport. A good interaction is the metaphor made tactile.

8. **Juice and consequence.** Lacoste: every hit flashes, every bonus sweeps a label, losing a life floods the
   court red. Feedback is immediate, physical and wordless.

9. **Material honesty.** Real-feeling light, texture and depth (cork grain, clay, fog, bokeh) make even an
   absurd idea credible. Cheap-looking materials break the spell instantly.

10. **Colour as meaning.** Ivress: gold appears only where light/courage is. Lacoste: yellow = "you can touch
    this". Shopify: colour lives only in the art, UI stays neutral. Few colours, each with a job.

11. **Typography with scale contrast.** Enormous words against tiny, calm body text; one or two families;
    headlines that interact with the 3D (objects pass through letters, words catch bloom).

12. **Humour and confidence.** Oryzo's jokes land because they are delivered deadpan with total production
    value. Nobody over-explains.

13. **Sound as space.** Ivress's music stems, particle chimes, whoosh loops and a shared reverb place you
    somewhere. Optional, but when on it doubles the immersion.

14. **Wayfinding at scale.** Shopify makes 150+ items explorable with an index in the hero, one rhythm per
    chapter, a persistent "you are here" control and jump links.

15. **Performance is designed, not patched.** Baked lighting, splats, compressed textures, per-chapter
    streaming, video instead of live 3D where it's only spectacle, DPR caps on phones. And the loader buys time.

**Where all four fall short (our chance to be better):** none honours `prefers-reduced-motion`; Ivress
downloads ~50 MB; Oryzo and Ivress hide real content inside canvas/scroll mechanics; Lacoste's textures are
wasteful (a 9.7 MB roughness PNG). We can match the craft while being accessible, lighter and fully readable.

**Layout principles from the TURA reference** (`tura-layout.md`, `reference-tura.jpg` — layout only, colours ignored):

16. **One idea per screen.** Full-screen views, each with a single focal point and ~70 % negative space.
17. **Macro / micro type.** A huge, heavy, centred headline (~16× the microtype) with tiny, wide-tracked uppercase
    microtype placed on an asymmetric diagonal around it — eyebrow above-left, caption below-right.
18. **A constant frame of edge furniture.** Wordmark (in type) top-left, two tiny links top-right, social stack on
    the left edge, a vertical "SCROLL" cue on the right edge, and a section index (`.01 .02 .03`) sitting outside
    the content — the frame never changes, only the stage does.
19. **Depth by blur and dimming.** A fanned, perspective carousel: sharp centre card, recessed, dimmed and blurred
    neighbours, the title overlapping the card's edge.
20. **Light that places things.** A soft spotlight glow behind the focal point and deep, soft shadows under anything
    that floats (panels, buttons, forms).

**Journey principles from igloo.inc** (`igloo.md`):

21. **A company as a place.** A holding company doesn't list its ventures — the visitor travels *through* them in one world.
22. **One continuous shot.** A single camera on a spline carries every scene; nothing hard-cuts.
23. **Haze is the transition.** Fog, bloom, blur and a little chromatic fringe dissolve one scene into the next and hide loading.
24. **UI on the objects.** Labels and actions are annotations attached to the 3D thing they describe; the frame stays near-empty.
25. **Reversible (and even looping) time.** Scrolling back plays the film backwards; the journey feels like a world, not a document.
26. **Its gap is our opportunity:** igloo has no timeline and no way to jump — we pair its continuous journey with a
    visible reel timeline and direct jumps, keep text as real HTML, and honour reduced motion.

---

## Part 2 — Techniques worth adapting (and how we'd build them)

| # | Technique | Seen in | How we'd build it (our stack: Next static export, R3F/three, GSAP, Lenis) |
|---|---|---|---|
| 1 | **Loader that is part of the world** + real percentage | Oryzo, Ivress, Lacoste | DOM/SVG drawing driven by `THREE.LoadingManager` progress + a compile-shaders stage; resolves *into* the first scene (no cut). Text content is already in the HTML underneath. |
| 2 | **Deliberate start ("Enter")** that also unlocks audio | Ivress, Lacoste | A single focusable button; on press: `AudioContext.resume()`, reveal transition, Lenis start. Keyboard: Enter/Space. Skippable; never blocks reading (content below is live HTML). |
| 3 | **Persistent protagonist** carried across chapters | Oryzo, Ivress | One scene graph; a hero object whose pose/material/state is keyframed per chapter in `lib/config.ts` and interpolated from scroll progress (our existing store). |
| 4 | **Chapter HUD**: name + big `03 / 07` counter + progress | Ivress | DOM overlay bound to `activeSection`; counter digits roll (SplitText); a thin progress line = progress within chapter. |
| 5 | **Persistent jump control** (pill / index) | Shopify | Fixed pill button showing the current chapter; opens an accessible listbox dialog of all chapters; `lenis.scrollTo`. Also an index on the opening screen. |
| 6 | **Virtual timeline scroll** (wheel/swipe drives a timeline, not a page) | Ivress | Keep native page scroll for accessibility/SEO but *pin* one full-screen stage and map scroll to a GSAP master timeline; chapters are labels on it. Keyboard (PageDown/arrows) and the jump control map to labels. |
| 7 | **Mode changes of one world** (same scene, different "look") | Oryzo (thermal/sketch), Ivress (grey→gold) | Per-chapter uniform sets on shared materials: `uMode` blends between PBR gold, line-art/blueprint shader, silhouette, x-ray. Cheap: no new geometry. |
| 8 | **Hold-to-reveal** interaction (press and hold) | Ivress, Lacoste | Pointer/touch/keyboard (Space held) → a 0–1 "charge" value with easing; drives a radial mask in a full-screen pass and reveals DOM copy; releasing decays it. Screen-reader equivalent: a plain button that toggles the revealed text. |
| 9 | **Depth-of-field focus pulls** between layers | Oryzo | `@react-three/postprocessing` DepthOfField with animated `focusDistance` per beat; on phones a cheaper fake (blur plane / CSS `backdrop-filter` on DOM panels). |
| 10 | **Frosted-glass panels over 3D** | Oryzo | DOM panels with `backdrop-filter: blur()` on desktop; a pre-blurred low-res render-target texture behind panels on mobile/Safari if needed. |
| 11 | **Big type that lives in the scene** (objects pass through words, words catch light) | Oryzo | HTML headline for accessibility + a matching troika/SDF text mesh in 3D (aria-hidden) that the camera flies through; or HTML over canvas with the 3D object's depth-sorted occluder mask. |
| 12 | **Full-screen flash / colour-flood transitions** | Ivress, Lacoste | Post-processing "flash" pass (exposure spike to white/gold, then settle), or a DOM overlay with mix-blend; short (400–700 ms), used sparingly. |
| 13 | **Particles that form shapes** (constellations, dust, trails) | Ivress | GPU points with two target attributes (A→B morph by uniform), curl-noise drift; counts by quality tier. |
| 14 | **Juice on every action** | Lacoste | Hit flashes, camera shake (tiny), sweeping labels, haptics (`navigator.vibrate` where allowed), sound ticks; all disabled in reduced motion. |
| 15 | **A short playable mechanic with a CTA end screen** | Lacoste | One-gesture game (≤45 s), R3F scene, simple collision math (no physics lib), score → result card whose primary action is our CTA (mailto) and secondary "Play again". |
| 16 | **Live UI demos instead of screenshots** | Shopify | Scripted DOM mini-demos (typing, toggles) — for us: "watch a brief become a campaign" micro-animation inside a service chapter. |
| 17 | **Split-letter / rolling text transitions** | Shopify, Ivress | GSAP SplitText (already in the project) with masked lines and per-character rolls for counters and chapter names. |
| 18 | **Optional sound design with a visible toggle** | Ivress | Howler.js or WebAudio: one ambient bed, 4–6 SFX (hover tick, reveal whoosh, chime), one shared reverb; off by default; toggle shows an animated waveform; remembers preference. |
| 19 | **Designed performance** | Oryzo, Ivress, Shopify | Procedural geometry and baked light where possible; KTX2 textures; per-chapter lazy loading; video for spectacle-only moments; DPR cap 1.5 on phones; `PerformanceMonitor` tiering; a static fallback. |
| 20 | **An ending that pays off** (reframe or loop) | Oryzo, Ivress | A final beat that turns the journey into the pitch ("if we can do this for…") or into something the visitor keeps. |
| 21 | **Edge-furniture frame + section index** | TURA | One fixed `Frame` component: stacked wordmark (type only), two links, social stack, vertical SCROLL cue, `.01/.02/.03` index; constant insets from `lib/config.ts`; mobile rearrangement. |
| 22 | **Macro/micro headline composition** | TURA | A `Headline` component: centred heavy headline + absolutely positioned eyebrow (≈ 23 % in from the left, above) and caption (from the centre line, below); fluid sizes with `clamp()`. |
| 23 | **Fanned blur-depth carousel** | TURA | CSS 3D (perspective + `rotateY`) with `filter: blur() brightness()` on side cards, title overlapping the centre card, keyboard/swipe/click navigation, `aria-roledescription="carousel"`. |
| 24 | **Spotlight glow + floating shadows** | TURA | Radial-gradient light layer (or additive sprite in 3D) behind the focal point; `0 40px 80px -20px` soft shadows on floating panels. |
| 25 | **Continuous camera journey** | igloo | One Catmull-Rom camera path through all worlds; scroll/timeline maps to path distance; each world owns a segment; `lookAt` path is a second spline. |
| 26 | **Haze transitions** | igloo | A full-screen haze pass (fog colour + depth-of-field + bloom lift) keyed to "between worlds" progress, so worlds condense out of luminous mist. |
| 27 | **Object annotations** | igloo | DOM labels projected onto 3D anchors (real HTML, positioned per frame via refs) with thin leader lines; fade by distance. |
| 28 | **Reel timeline + jumps over a continuous journey** | igloo + Production | The Production timeline (reels, playhead, timecode) drives the same path; clicking a reel eases the camera along the path to that world instead of cutting. |

**From buttermax.net** (`buttermax.md`, 2026-09-30; adopted as the model for our opening and base cursor):

27. **An opening in three movements: glyph → dip → flood.**
    1. A small loader glyph forms and holds.
    2. It fades into a short, near-black dip.
    3. A halftone-dot bloom grows from the centre, merges into bands and floods the screen with the page colour (0.5 s).
    Meanwhile the page zooms forward from about 0.6 scale and un-rotates. Then the hero object rises and materialises
    (0.35 s) and a word is hand-written on (0.85 s). The whole reveal from the first dots to rest takes about 2 s, the
    same on every load; only the loader stretches with network time.
28. **The cursor is a fluid, not a pointer graphic.**
    - A real GPU fluid (capsule splats from the previous to the current position, no swirl, a long velocity tail,
      fast ink fade, hard-edged display) paints ink that is pushed in the direction of travel, keeps drifting after
      you stop, and is gone about 1 s later.
    - The system cursor stays visible.
    - **Colour is the reward:** where the ink covers the headline the letters flip colour (black → white), fringed
      with a thin rainbow; over media the same ink becomes a greyscale halftone lens.
29. **The hero object looks at you with weight.** A quick 0.25 s first move, then a 1.5–2 s damped settle, with no
    overshoot. Hovering onto the object swaps it with a dissolve, and clicking it changes what it shows.
30. **One fluid, many effects.** The same ink mask drives different treatments per layer (paint on the background,
    inversion on type, a lens on media). That's how the site stays one consistent system.

---

## Part 3 — What NOT to do

- **Don't clone signatures.** No design-tool construction-line loader (Oryzo), no silhouette fairy tale with a
  lantern traveller or loop-back ending (Ivress), no brick-breaker (Lacoste), no pointillist art films or
  rolling word-ring (Shopify). We take the *principles* behind them.
- **No "AI gradient blob"**, neon, or random shiny spheres. Every 3D element must carry meaning for Kreatif Atelier.
- **Don't hide real content in the canvas.** All copy stays real HTML (SEO, screen readers, translation, search).
- **Don't gate reading behind interaction.** "Enter" is a moment, not a wall: a skip link and the full text must be
  reachable immediately; games and holds are optional flourishes.
- **Don't scroll-jack without a way out.** If we map scroll to a timeline, keyboard, jump control and native
  scrollbar must still work; no infinite loops that trap people.
- **Don't ship 50 MB.** Budget: first meaningful view under ~1.5 MB on phones; stream later chapters.
- **Don't let effects fight the text.** Blur/bloom/flash never under body copy; contrast ≥ 4.5:1 always.
- **Don't autoplay sound** or surprise people with it; off by default, visible toggle, remembered.
- **Don't make phones an afterthought.** Every mechanic needs a thumb version (tap/hold/swipe) designed as
  carefully as the mouse version; DPR 1.5 cap, fewer particles, cheaper post.
- **Don't ignore reduced motion.** None of the four references handle it; we will: static compositions,
  instant chapter changes, no parallax/flash/shake, holds become taps.
- **No gimmick without a job.** If an interaction doesn't sell strategy, story or craft, cut it.
- **No logo / crest / monogram / "KA" mark** anywhere — brand presence through type, gold and the ✦.
