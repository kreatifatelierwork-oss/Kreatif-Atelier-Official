# The Long Take — Stage 3 build plan

Approved direction (2026-09-29): **The Long Take** (Orrery × Production), promoted to the home page on `redesign-v2`.
Palettes switchable with `?palette=a|b` (A = light, default). No sound, no video in this build.
Concept background: `LONG-TAKE.md`. Research: `docs/research/` (igloo, TURA, SYNTHESIS).

## 1. Structure — eight reels, one continuous take
The timeline gains a closing reel so the finale stops crowding the timeline:

| Reel | Name | Camera | Text (all from `content/verticals.ts` unless noted) | Interaction |
|---|---|---|---|---|
| — | Loader | — | "Setting the scene · %" | **Begin** |
| 00 | **Core** | pull back out of the core's light → the orrery seen low, worlds strung along its horizon | eyebrow: Ideas \| People \| Impact · headline: Kreatif Atelier · caption: A creative holding ecosystem for a better tomorrow. · pillars as a microtype row | **Drag to turn** the orrery |
| 01 | **Aurelius** (indigo) | swing out → hold in front of the spiral of slabs | tagline · name · value; 4 annotations | **Hold to raise** — the spiral climbs; value line lights |
| 02 | **Valora** (coral) | swing out → the arch, gap in the middle | 〃 | **Tap to bridge** — each press flies tiles into the arch; when it closes a light runs across |
| 03 | **Golden Guardian Productions** (magenta) | swing out → the aperture (scaled to fit), a projection screen of abstract light behind it | 〃 | **Hold to roll** — the iris opens, the "projection" runs (procedural; a video can be dropped in via config) |
| 04 | **Rudra Yugen** (cyan) | swing out → the lattice around a glass core | 〃 | **Tap to spark** (and pointer hover) — pulses light up nodes; all lit = complete |
| 05 | **Asraya** (jade) | swing out → the cairn over ripples | 〃 | **Hold to breathe** — the stones lift apart and ripples slow while held; three breaths complete it |
| 06 | **Ecosystem** | rise high above: all five worlds joined by light | eyebrow row: Our ecosystem serves · … · headline: Multiple verticals. One vision. Exponential impact. · caption row: Impact · … | — |
| 07 | **Contact** | descend back into the warm core — the take ends where it began | eyebrow: Vision · headline: Disciplines today. A brighter tomorrow. · the vision sentence · email pill · **Meet the founders** | founders panel (glass, fanned carousel of cut-out portraits + bios) |

**Transitions** (every one, both directions): the camera leaves on a wide high arc; fog, depth-of-field and a haze of the
*next* world's colour rise mid-flight; text dissolves (blur + fade) out and the next reel's text resolves in; the world
condenses out of the haze. Reel jumps travel the same path at speed (reduced motion: cut with a crossfade).

## 2. Navigation
Scroll / swipe / ↑↓ ←→ / PageUp·Down travel; 0–7 jump; settle-to-nearest-reel after input stops; bottom **reel timeline**
(8 colour segments, playhead, "Reel 03 / 07 — Name", timecode) — click to travel; top-right **Verticals** (jump menu) and
**Contact** (mailto); left edge motto, right edge Scroll cue; top-left *KREATIF / ATELIER* in type (never a mark).

## 3. Look
- Palettes: **A** pearl/pale tinted skies, vivid glossy sculptures, neutral tone mapping, white frosted glass (default);
  **B** deep world hues lit by glowing sculptures, AgX, smoked glass.
- Lighting: Poly Haven *Photo Studio 01* HDRI as **environment only** (never visible), softened by a low-res
  environment render, plus Lightformer highlights; intensity higher in A, lower in B; 1K version on phones.
- Type: Outfit (geometric sans) for world names/headlines, Manrope microtype/body, Cormorant italic for the vision.

## 4. Phones, accessibility, fallback
- Phones: swipe; wider lens; DPR ≤ 1.5; no DOF; annotations become a list; timeline = colour bar; interactions are
  thumb-sized pills; everything reachable.
- Reduced motion: cuts + crossfades, still sculptures, holds become single presses, no haze/DOF animation.
- Keyboard: all controls are buttons; interactions work with Space/Enter (hold = hold key); visible focus; Esc closes
  panels; menus trap focus by making the rest inert.
- Screen readers & SEO: the full structure is server-rendered HTML (headings, lists) — the canvas is decoration.
- Weak devices (no WebGL / software GL): **fallback mode** — same reels, text, timeline and navigation over
  CSS-painted world colours and a soft glow instead of 3D.

## 5. Build phases and "done"
| Phase | Scope | Done when |
|---|---|---|
| 1 | Plan + CLAUDE.md rewrite | this file + new CLAUDE.md committed |
| 2 | Assets: HDRI environment (2K/1K), founder cut-outs attempt | environment visible in reflections only; cut-outs judged; ASSETS.md updated |
| 3 | Promote to home: `components/longtake/*`, SSR text shell + lazy stage, 8 reels, fallback mode, `/concepts` kept (noindex) | home = Long Take; build/lint/types clean; fallback renders without WebGL |
| 4 | All five worlds + interactions; GGP fit + procedural projection; core drag | each world holds as well as Aurelius; every interaction works by mouse, touch, keyboard, reduced motion |
| 5 | Ecosystem + Contact reels, founders panel, transition/timeline/menu polish | no crowding at 1440/390; forwards/backwards smooth; no text over sculptures' focal area |
| 6 | QA: phones, reduced motion, keyboard, screen reader outline, Lighthouse, screenshots | mobile Performance ≥ 70, Accessibility ≥ 95, SEO 100; screenshots of every reel in both palettes at 1440/390 |
