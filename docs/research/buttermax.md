# buttermax.net: opening sequence and cursor behaviour

Studied 2026-09-30 in headless Chrome with GPU WebGL (Apple M4).

**How it was recorded:**
- Continuous CDP screencasts at 52–59 fps (`scripts/research/screencast.mjs`), frame-by-frame analysis of brightness,
  colour and motion (`scripts/research/analyse-cast.py`), and pixel measurements on the frames.
- Runs:
  - 3 desktop openings at 1440×900: two cold (cache and storage cleared) and one warm reload;
  - 1 phone opening at 390×844 with touch;
  - 4 scripted cursor sessions (desktop): general tests, ink measurement, swap triggers, ink over dark sections.
- Recordings live in `docs/research/buttermax/` (local only, gitignored).

**Purpose:** learn the behaviour and feel. We copy **no** code, shaders, models, images, sounds, text or branding
(their X-shaped mark, their wording and their devices included).

---

## 0. What the site is made of (technique)
- **Shell:** Next.js for the page shell, plus Active Theory's **Hydra** WebGL engine (`assets/js/app.*.js`, a worker
  `hydra-thread.js`). All shaders ship in one file (`assets/shaders/compiled.vs`); tuning values come from a UIL
  parameter file. GSAP and Lenis are bundled.
- **The headline is WebGL text** (MSDF font atlases, `Decagram-*.json`). That's why the cursor's ink can change the
  *text's* colour: text and ink live in the same GPU composite.
- **The cursor ink is a real GPU fluid simulation** (the classic stable-fluids pipeline: advection → divergence →
  pressure solve → gradient subtract, plus splats). Its parameters:
  - velocity grid 128², ink ("dye") texture 512²;
  - 10 pressure iterations;
  - **no vorticity** (curl 0, so the ink flows smoothly rather than swirling);
  - velocity kept at **0.985 per frame**, ink density at **0.95 per frame**;
  - splat radius 30 (simulation units).
  Each splat is a **capsule from the previous pointer position to the current one** with a cubic-out edge, so a fast
  flick draws one continuous stroke, never a dotted trail.
- **The opening transition is a shader** that thresholds a lattice of growing halftone dots (three dot sizes per cell,
  so neighbouring dots merge into wavy diagonal bands). It swaps the "from" scene (dark) for the "to" scene (the page)
  and draws a hue-cycling rainbow band along the mask edge (desktop only). While it runs:
  - the incoming scene **scales from about 0.6 → 1.0 and un-rotates** around a point near the centre;
  - the outgoing scene gets a slight barrel (CRT) bulge.
  Later page transitions start this same dot wave **from the cursor position**; the first load starts from the centre.
- **A post-effect pass** reacts to scroll velocity:
  - a slight zoom;
  - a vertical ripple centred on the pointer's x-position;
  - RGB split;
  - at speed, the frame edges stretch.
- **The 3D devices** swap with a *motion-vector dissolve* (pixel-sorting streaks with iridescent colour).
- **Sound:** none on the home page. Howler is bundled, but no audio file is requested and no audio context is started.

## 1. Opening sequence (beat by beat)
**Timing depends on loading only up to the end of the loader. From "T0" (the first dots of the transition) the
choreography is identical on every run:**

| Run | Loader ends (dark dip) | T0: dots appear / flood starts | Full yellow (peak brightness) | Settled (motion < 0.4) |
|---|---|---|---|---|
| Desktop cold #1 | 4.98 s | 5.44 s | 5.96 s (+0.52) | 7.49 s (+1.53 after peak) |
| Desktop cold #2 | 3.66 s | 4.37 s | 4.87 s (+0.50) | 6.44 s (+1.57) |
| Desktop warm reload | 2.79 s | 3.49 s | 4.00 s (+0.52) | 5.64 s (+1.64) |
| Phone cold (390) | 4.48 s | 5.04 s | 5.59 s (+0.55) | 7.44 s (+1.85) |

**Beat timeline** (desktop cold #2; times from navigation, T0 = 4.19 s when the first dots show):

| Time | Beat | What happens | Motion / easing | Colour and light |
|---|---|---|---|---|
| 0.00–0.50 | Blank | Browser white, then the page's near-black `#101010` | cut | — |
| ~1.20 | Loader wakes | A tiny cluster of yellow dots spins at the exact centre | quick spin | yellow on `#101010` |
| 1.70–2.20 | Loader breath | The dots gather into one small dot and hold | ease-in-out | — |
| 2.70 | Loader opens | The dot splits into four dots that slide out to the corners of an X | ease-out, ~0.4 s | — |
| 3.20 | Loader forms | The four dots **bridge into a single glyph**, liquid, like metaballs joining | ease-out | full yellow |
| 3.20 → load done | Loader holds | Holds until assets are ready (0–2 s depending on network) | still | — |
| 3.69–4.05 | **Dark dip** | The glyph fades to nothing | linear fade ~0.35 s | the screen is at its darkest (lum ≈ 14/255) |
| 4.19 (T0) | **Dots** | A small circular patch of halftone dots appears at the centre, **cyan/violet/pink rimmed** | appears ~0.1 s | chromatic rims |
| T0+0.11 | Frame | Top nav appears as thin yellow outline pills; the small centre emblem appears | fade | outline only |
| T0+0.12 → +0.35 | **Bloom** | The dot patch expands radially; dots swell; diagonal neighbours **merge into wavy yellow bands** with hue-cycling rainbow edges | accelerating (ease-in) | brightness climbs fast |
| T0+0.47 | Flood | ~70 % yellow; black is now the *holes* between bands | fastest moment | — |
| T0+0.60 | **Full yellow** | Yellow everywhere with a lattice of shrinking black dots. The headline's first word sits in the page, already visible, having zoomed forward (scale 0.6→1) and un-rotated during the flood | ease-out | peak brightness, lum ≈ 190 |
| T0+0.72 | Clean | The black dots shrink to nothing; the cookie bar slides up at the bottom | ease-out | — |
| T0+0.72 → +1.07 | **Object rises** | The 3D device rises from below the fold, rotating into place. It starts as a translucent iridescent ghost and **materialises** into solid metal and glass | ease-out, ~0.35 s, tiny settle | iridescent → true material |
| T0+1.07 → +1.92 | **Signature** | The second word is **hand-written on stroke by stroke** in a script face, left to right | ~0.85 s, ease-in-out | solid black |
| T0+1.9 → +3.1 | Settle | Everything eases to rest; the device keeps a slow idle float; its screen starts playing project clips | long ease-out | — |
| after | Handover | The interactive state is already live: the cursor paints and the device tilts. No prompt, no gate, no sound choice | — | — |

**Notes:**
- There is **no gate or button**: the opening plays straight into the interactive state. The only "rhythm" pause is
  the dark dip after the loader, about 0.15–0.5 s of near-black before the flood. It works like the silence before a
  downbeat.
- The flood is **0.5 s**, the object rise **0.35 s** and the signature **0.85 s**, overlapping slightly. The whole
  reveal from T0 to settled takes about **2 s**.
- **Phone:** the same beats, but the dots are plain yellow (no rainbow rims, because the shader disables them on
  mobile), the headline is set smaller and slightly tilted, and the flood takes 0.55 s.
- **Warm reload:** only the loader shortens; everything after T0 is identical.

## 2. Cursor behaviour spec (after the opening)
There is **no custom cursor element**: the system cursor stays visible and everything happens in WebGL. Two systems
respond to the pointer, the **ink** and the **object**.

### 2a. Ink (the fluid)
- **Look over the hero:**
  - The ink is **solid near-black on the yellow**, with a *hard* edge, like thick paint or wet tar rather than smoke.
  - While moving, the edge carries a **thin rainbow rim** of chromatic aberration.
  - Where the ink passes over the headline, the **letters flip to white** with the same rainbow fringe.
  - The object (device) is drawn *in front of* the ink, so ink disappears behind it.
- **Look over media (dark project sections):** the ink becomes a **lens**. Inside the blob the picture is shown as a
  grainy, dithered grey halftone and slightly refracted, so the same fluid becomes a different effect per layer.
- **Size:** a slow stroke (340 px in 0.5 s) makes a blob about **170–200 px tall** at 1440 px width. The ink is wider
  than the cursor path and *swells* where the pointer lingers or turns. A small wiggle in one place makes a blob about
  150 px wide.
- **Direction and inertia:** the ink is **pushed in the direction of travel**. It bulges ahead of the pointer, trails
  a thin tail and throws **satellite droplets** ahead on sudden starts. When the pointer stops, the ink **keeps
  drifting** in the last direction for about 100–250 px while thinning.
- **Speed:**
  - Slow movement gives fat, round blobs.
  - A fast flick (340 px in 80 ms) gives one long, continuous torpedo shape of similar area, never dots. The capsule
    splats guarantee continuity.
  - Teleports (leaving the window, or jumping) draw a straight stroke along the jump.
- **Fade** (measured on ink area):
  - After a slow stroke, the area peaks about 0.25 s after the pointer stops and then shrinks steadily to zero in
    about 0.8 s. **Total life after the last movement is about 1.05 s.**
  - After a fast flick, the area peaks 0.2 s after release, then shrinks over about 0.7 s; a thin remnant may
    linger for a couple of seconds.
- **Holding still:** no new ink. Existing ink drifts away and dissolves, and the hero is clean again within about
  1 s.
- **Circles:** overlapping strokes merge into one wet shape with white specular streaks along the edges; the headline
  flips colour wherever the loop passes.
- **Edges and corners:** ink draws right up to the screen edge; nothing special happens there.
- **Leaving and re-entering:** nothing on leave. Re-entering far away draws a stroke from the last position (a jump).
- **Click, click-and-drag:** no special burst; dragging behaves exactly like moving.
- **Scrolling while moving:** the ink keeps painting in screen space. The whole frame gets the scroll-velocity warp
  (slight zoom, a vertical ripple around the pointer's x-position, RGB split).

### 2b. The object (the 3D device)
- **Look-at:** the device rotates to **face the pointer**: yaw about ±20° across the screen, pitch about ±10°. The
  response is two-stage: **a quick first move within about 0.25 s, then a long, heavy ease into place over about
  1.5–2 s**. No visible overshoot or jitter. It feels weighty and damped, "buttery".
- **Hover = swap:** moving the pointer *onto* the device swaps it for the next model with about a **0.9 s dissolve**
  (the old model breaks into sorted pixel streaks with iridescent cyan/rainbow colour; the new one resolves out of
  them). Leaving the device, fast movement elsewhere, or idling does **not** swap it.
- **Click on the device:** its screen jumps to the next project clip. A click elsewhere does nothing.

### 2c. Touch (phone)
- Taps and swipes paint ink exactly like the mouse (blob at the touch, pushed along the swipe).
- Tapping the device swaps it (there's no hover on touch).
- A vertical swipe scrolls the page, with the same velocity warp.
- There is no custom cursor and no tilt-to-follow without a finger down.

### 2d. The feel, in one line
Heavy, wet, damped and continuous. Nothing snaps and nothing jitters. Every response has a long, soft tail (ink about
1 s, object about 2 s). The one sharp thing is colour: black ink and white letters flip instantly at a hard edge,
fringed with a thin rainbow.

## 3. What this means for us (summary; details in `SYNTHESIS.md` and the build notes)
- **Opening:** loader glyph → dark dip → halftone-dot bloom from the centre → flood to the page colour, with the page
  zooming forward → hero object rises and materialises → a word is hand-written on → settle. Our version uses
  **our** glyph (✦, the brand motif, not a logo), **our** colours (pearl/gold, or ink/gold) and **our** words.
- **Cursor:** a real GPU fluid (capsule splats, no curl, long velocity tail, faster ink fade, hard-edged display) that
  paints ink behind the hero object and **inverts the colour of the headline** where it passes. The hero object
  looks-at the pointer with a two-stage damped response. The act-specific roles (Lens, launch, breathe) build on top
  of the same fluid.
