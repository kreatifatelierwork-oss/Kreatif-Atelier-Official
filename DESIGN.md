---
version: 1.0-draft
name: Kreatif-Atelier-The-Making-of-a-Legacy
description: A brand-film website for a creative holding company. One continuous, scrubbable 3D film in which a single gold Idea changes form across seven acts, framed by near-invisible chrome. Ink canvas, one gold accent, five house colours used only as identity markers, a strict three-role type trinity (Outfit display, Cormorant Garamond voice, IBM Plex Mono utility), sharp media and pill actions, generous darkness, heavy damped motion. No logo, no mark, no fake technical labels.

colors:
  # Theme "Cinema" (dark). Recommended default; see AUDIT C1.
  canvas: "#0B0F1A"
  canvas-deep: "#070A12"
  surface: "#121726"
  surface-raised: "#18203A"
  hairline: "rgba(243, 235, 221, 0.14)"
  hairline-strong: "rgba(243, 235, 221, 0.28)"
  ink-on-dark: "#F3EBDD"
  body-on-dark: "#D9D3C7"
  muted-on-dark: "#9D9AA3"
  primary: "#C9A45C"
  primary-bright: "#E8C98A"
  primary-pressed: "#B38E45"
  on-primary: "#0B0F1A"
  focus: "#E8C98A"
  # Theme "Daylight" (light alternate). Neutral porcelain, never cream; gold is decoration only on light.
  daylight-canvas: "#EFEFEC"
  daylight-surface: "#E6E6E2"
  daylight-ink: "#0B0F1A"
  daylight-body: "#2A2E38"
  daylight-muted: "#55565E"
  daylight-hairline: "rgba(11, 15, 26, 0.12)"
  daylight-primary-fill: "#0B0F1A"
  daylight-on-primary: "#EFEFEC"
  # House identity markers (never CTA, never text, never UI background).
  house-aurelius: "#3D4BFF"
  house-valora: "#FF6A3D"
  house-ggp: "#E8307F"
  house-rudra-yugen: "#0FB5E4"
  house-asraya: "#23C27C"
  # Founder portrait mount (the only light surface on the dark theme, like a print on a wall).
  mount: "#E4E1DA"

typography:
  display-hero:
    fontFamily: "Outfit, Manrope, system-ui, sans-serif"
    fontSize: 112px
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: -0.035em
  display-lg:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.03em
  display-md:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.02em
  title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.01em
  body:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  voice-lg:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: 34px
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.22
    letterSpacing: -0.005em
  voice-md:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.12em
    textTransform: uppercase
  button:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0.14em
    textTransform: uppercase
  timecode:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.04em
    fontVariantNumeric: tabular-nums

rounded:
  none: 0px
  pill: 999px
  full: 50%

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
  huge: 96px
  section: 128px
  gutter-desktop: 64px
  gutter-phone: 20px

components:
  top-bar:
    backgroundColor: transparent
    textColor: "{colors.ink-on-dark}"
    height: 64px
  wordmark-text:
    typography: "{typography.title}"
    textColor: "{colors.ink-on-dark}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: 52px
    padding: 0 30px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink-on-dark}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: 52px
    padding: 0 30px
  button-icon:
    backgroundColor: transparent
    border: "1px solid {colors.hairline-strong}"
    rounded: "{rounded.full}"
    size: 44px
  text-link:
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body}"
    textDecoration: "underline 1px, offset 4px"
  act-scrubber:
    backgroundColor: transparent
    typography: "{typography.timecode}"
    height: 56px
  act-caption:
    maxWidth: 34ch
  lens:
    size: 220px
    border: "1px solid {colors.hairline-strong}"
    rounded: "{rounded.full}"
  house-slice:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    height: 560px
    identityEdge: 3px
  industries-marquee:
    typography: "{typography.display-lg}"
    textColor: "{colors.ink-on-dark}"
  founder-polaroid:
    backgroundColor: "{colors.mount}"
    rounded: "{rounded.none}"
    aspectRatio: "3 / 4"
    padding: 14px 14px 56px
  credit-block:
    typography: "{typography.display-md}"
  menu-overlay:
    backgroundColor: "{colors.canvas-deep}"
  sound-toggle:
    backgroundColor: transparent
    border: "1px solid {colors.hairline-strong}"
    rounded: "{rounded.pill}"
    typography: "{typography.label}"
    height: 40px
---

# Design System: Kreatif Atelier, "The Making of a Legacy"

Sources of truth: `docs/design/PHILOSOPHY.md` (why), `.claude/skills/` (taste-skill, image-to-code, stitch-skill),
`design-sources/awesome-design-md-main` (Bugatti, SpaceX, Runway, Ferrari, Lamborghini, Apple, BMW M, Nike, Framer,
Wired). Reference images, once generated, live in `design-refs/` and outrank this file on layout detail. This file
outranks guesswork.

**Dials:** taste-skill VARIANCE 7 · MOTION 8 · DENSITY 3. image-to-code ART_DIRECTION 8,
IMPLEMENTATION_CLARITY 9, SPACING_GENEROSITY 9, UI_SIMPLICITY_DISCIPLINE 10.

## 1. Visual Theme & Atmosphere
A screening room. The page is an ink-dark field (`{colors.canvas}` #0B0F1A, the brand's original ink) with one
subject lit in gold: **the Idea**, a single form made of light that changes shape act by act and finally becomes
solid gold. Everything else is quiet: cream type set with restraint, hairlines, a thin act scrubber, darkness as
whitespace. It should feel like the opening titles of a well-made documentary and the calm of a gallery (Bugatti's
austerity, Runway's cinema, Apple's reverence for the object), never like a tech dashboard.

- **Density: gallery-airy (3).** One statement per screen.
- **Variance: offset-asymmetric (7).** The subject is often off-centre and captions sit off-grid, but every frame
  is legible and composed.
- **Motion: cinematic (8).** Heavy, damped, motivated. Nothing loops for show.

**Brand presence** is typographic only: the words "Kreatif Atelier" set in the display face, and the ✦ glyph as the
single motif (gate, section separators in the marquee, the CTA). There is no logo, crest, monogram or mark of any
kind, and no placeholder for one.

## 2. Color Palette & Roles

### Theme Cinema (dark), recommended default
| Token | Hex | Role |
|---|---|---|
| Canvas Ink | `#0B0F1A` | The page floor and the film's darkness. Never pure black. |
| Canvas Deep | `#070A12` | Menu overlay, gate backdrop, the dip before the flood. |
| Surface | `#121726` | House slices, the rare raised surface. No shadow; the step in tone is the elevation. |
| Surface Raised | `#18203A` | The expanded house slice, the pressed state of dark controls. |
| Cream Ink | `#F3EBDD` | Headlines and primary text (≈15:1 on canvas). |
| Body Cream | `#D9D3C7` | Running text. |
| Muted | `#9D9AA3` | Secondary text, captions, the timecode (≥ 7:1 on canvas). |
| Hairline | `rgba(243,235,221,0.14)` | The only divider. 1px. |
| Hairline Strong | `rgba(243,235,221,0.28)` | Ghost button borders, the lens ring, focusable outlines. |
| **Gold** | `#C9A45C` | **The one accent.** Primary button fill, the active act on the scrubber, the ✦, focus on the Idea. Never on body text blocks. |
| Gold Bright | `#E8C98A` | Focus ring, hover on gold, the Idea's highlights in the render. |
| Gold Pressed | `#B38E45` | Pressed primary. |

### Theme Daylight (light), the alternate
| Token | Hex | Role |
|---|---|---|
| Porcelain | `#EFEFEC` | Canvas. Neutral, very slightly warm. **Never** the banned cream/paper family (#F5F1EA, #F3EDE2…). |
| Porcelain Shade | `#E6E6E2` | Raised surface. |
| Ink | `#0B0F1A` | Headlines and the primary button fill (with Porcelain text). |
| Body | `#2A2E38` / Muted `#55565E` | Text ladder (Muted ≥ 7:1). |
| Gold | `#C9A45C` | **Decoration only on light**: the Idea, the ✦, the active scrubber tick. Never text, never a button fill (fails contrast). |

### House identity markers (both themes)
| House | Hex |
|---|---|
| Aurelius | `#3D4BFF` |
| Valora | `#FF6A3D` |
| Golden Guardian Productions | `#E8307F` |
| Rudra Yugen | `#0FB5E4` |
| Asraya | `#23C27C` |

These are the approved house colours, used like BMW M's tricolour: only as a **3px identity edge** on a house
slice, as the tint of that house's light inside the 3D scene while its act plays, and as a thin tick on the
scrubber for that act. Never a CTA, never text, never a section background, never together as a rainbow.

### Banned
- The warm cream + brass + espresso default palette.
- Purple/blue AI gradients.
- Neon or outer glows on UI.
- Rainbow or mesh gradients.
- Pure `#000000` / `#FFFFFF`.
- A second accent colour.
- Light/dark section flips within one page.

## 3. Typography Rules
**Three faces, three roles, never blurred** (after Bugatti's display / text / mono trinity):

| Role | Face | Where | Never |
|---|---|---|---|
| **Display** | Outfit, 400–500 | Title card, act titles, house names, credit names, marquee | Weight 700+, uppercase shouting, mixed with serif in one line |
| **Voice** | Cormorant Garamond, 400 roman and italic | The film's spoken lines (subtitles), quotes, the vision, founder bios | Inside a sans headline, on buttons, below 19px |
| **Utility** | IBM Plex Mono, 400–500, uppercase, tracked | Buttons, the act scrubber, timecode, form labels, short captions | Paragraphs, decorative "data" |

**Scale** (desktop → phone, via `clamp()`)

| Token | Desktop | Phone | Spec |
|---|---|---|---|
| display-hero | 112px | 52px | Outfit 500, lh 0.95, -0.035em |
| display-lg | 72px | 40px | Outfit 500, lh 1.0, -0.03em |
| display-md | 44px | 30px | Outfit 500, lh 1.05, -0.02em |
| title | 24px | 20px | Outfit 500, lh 1.25 |
| body | 17px | 16px | Outfit 400, lh 1.55, max 62ch |
| voice-lg | 34px | 24px | Cormorant 400 italic, lh 1.22 |
| voice-md | 22px | 19px | Cormorant 400, lh 1.5, max 58ch |
| label | 13px | 12px | Plex Mono 500, uppercase, 0.12em |
| button | 14px | 14px | Plex Mono 500, uppercase, 0.14em |
| timecode | 13px | 12px | Plex Mono 400, tabular numbers |

**Rules**
- Hierarchy comes from size, then weight within a family, then colour, never from mixing families inside a line.
  Emphasis inside a headline uses Outfit italic or Outfit 400 vs 500, not a Cormorant word.
- Headlines at most 2 lines on desktop and 3 on phone. If they would wrap further, reduce the size, not the words
  (copy is word for word).
- Italic Cormorant with descenders: line-height ≥ 1.1 plus 0.1em bottom reserve.
- Eyebrows: at most 1 per 3 sections, never numbered.
- No `·` more than once per line. Brand lines like "Bold · Radiant · Timeless" are set as three stacked words.
- Minimum sizes: body 16px, captions 13px on desktop / 12px on phone. No decorative micro-text.

## 4. Component Stylings

**Top bar.** 64px tall, transparent over the film. Left: "Kreatif Atelier" as text (title, cream). Right: the
sound toggle and one menu button ("Index", ghost pill). One line, nothing else. No contact duplicate (the single
contact action lives in the post-credits scene and the Index).

**Buttons**
- **Primary:** gold fill, ink text, pill, 52px tall, 30px side padding, Plex Mono 14 uppercase. Hover: Gold
  Bright. Press: `scale(0.97)` for 120ms. Focus: 2px Gold Bright ring, 3px offset. At most one primary per
  viewport.
- **Ghost:** transparent, 1px Hairline Strong, cream label; the secondary action. Hover: the border becomes cream.
- **Icon:** 44px circle, ghost style; close, mute, previous and next act.
- **Text link:** cream, underline with a 4px offset.
- **CTA labels:** 3 words where possible, and never wrapping at desktop. The one exception is the live site's CTA
  "Schedule Your Free Brand Audit", kept word for word; it fits on one line at ≥ 360px.

**Gate.** Canvas Deep. The ✦ built from gathering gold points, about 120px, centred. Below, 32px apart: primary
"Enter with sound" and ghost "Enter in silence". Nothing else on screen.

**Act caption (the off-grid editorial block).**
- Contents: the act title (display-lg) with, 20px below, the spoken line (voice-lg), and optionally one body
  line. Max width 34ch.
- It is anchored per act (low-left, low-right, high-right) so it never covers the Idea.
- It is not a box: no background, no border, just type on the film.

**Act scrubber.**
- Placement: bottom edge, 56px tall, 64px side gutters. It is the single navigation and progress device.
- Track: one 1px hairline line, with eight evenly spaced ticks (Title and seven acts). The current act's tick is
  Gold, and a house act's tick shows its house colour only while that act plays.
- Labels: the current act's name sits above the playhead. The real film timecode sits at the right end. There
  are no other labels.
- Behaviour: drag or click to seek, and the arrow keys step through acts.
- Phone: the same, with only the act name and a thinner track.

**The Lens.**
- A 220px circle following the pointer, with a 1px Hairline Strong ring and no glow, fill or shadow.
- Inside it the blueprint layer of the same frame shows.
- Phone: press and hold opens it under the thumb, 180px.

**House slice (hover-accordion).**
- Five full-height slices on Surface, 560px tall, sharp corners, 1px Hairline between them.
- Collapsed, each shows the house name set vertically-stacked (not rotated): the words in display-md, stacked
  word per line.
- Hover or focus widens a slice from 1fr to 3fr over 500ms and reveals, in order:
  - the tagline as three stacked words;
  - the four "what we do" items (body);
  - the value line (voice-md).
- A 3px identity edge in the house colour runs along the slice's left side.
- Phone: a vertical stack of five rows; tapping one expands it.

**Industries marquee.**
- The 13 industries in display-lg Outfit 400, cream at 90%, separated by a ✦ in Gold at 60%.
- It drifts at 28px/s, and scroll velocity adds speed.
- It is the only marquee on the page. It pauses on hover and focus, and under reduced motion it becomes a static
  wrapped list.

**Founder polaroid arc.**
- Four real cut-out portraits on Mount-coloured prints: 3:4, 14px side and top borders, 56px bottom border.
- The prints are fanned on a gentle arc (−9°, −3°, 3°, 9°) with 24px overlap.
- Selecting a print (hover, focus or tap) brings it upright and forward over 600ms. The name (title), role (label)
  and bio (voice-md) appear beside it.
- The single soft shadow in the system sits under the prints: `0 30px 60px -24px rgba(0,0,0,0.55)`.

**Credit block.**
- The credits roll is centred columns on canvas:
  - the role label in Plex Mono;
  - names in display-md;
  - houses credited like departments, with their "what we do" as body lines.
- Pricing tiers appear as three credit blocks, with the prices exactly as on the live site. Each block has:
  - tier name (title);
  - price (display-md);
  - period (label);
  - features (body);
  - note (voice-md).
- "Most Popular" is plain Gold label text above the Growth tier. It is not a pill.

**Post-credits scene.**
- The ✦ returns, small, and above it the headline "Ready to build something worth remembering?" (display-lg,
  emphasis via Outfit italic on "worth remembering?").
- Below: one body line of the live copy, the primary button "Schedule Your Free Brand Audit ✦" (mailto) and the
  email as a text link.
- @kreatifatelier appears as plain text.

**Index (menu overlay).**
- A full-screen Canvas Deep overlay listing the acts in display-md with their names, plus "Watch" and "Direct"
  mode switches and the contact action.
- Esc closes it, focus is trapped, and it returns focus on close.

**Sound toggle.** A ghost pill, 40px tall, labelled "Sound on" or "Sound off". Five 2px bars show the real audio
level. It is always visible once the gate has been passed.

**States.**
- Loading is the gate itself, with no spinner.
- Errors: if WebGL is unavailable, the film falls back to a still-frame version with the same captions and
  scrubber. Mailto has no error state.
- Empty states: none exist.

## 5. Layout Principles
- **Grid:** 12 columns, max 1440px, 64px gutters on desktop and 20px on phone. The film canvas is full-bleed.
  Type sits on the grid; captions may sit off-grid by design.
- **Rhythm:** each act is one viewport-scale "poster". Inside non-film sections (credits), the section gap is
  128px desktop / 80px phone.
- **The subject rule:** nothing overlaps the Idea's silhouette. Captions and controls keep at least 48px clear of
  it.
- **Hero (title card), in four elements:**
  - "Kreatif Atelier" (display-hero) sits low-left over the film.
  - One line of subtext: "Where Strategy Meets Story. Where Story Becomes Legacy.", set as two lines in voice-lg.
  - Primary "Watch" and ghost "Direct".
  - Nothing else: no eyebrow, no stats, no pills.
- **Layout families across the page:**
  1. image-first title;
  2. off-grid caption acts;
  3. a full-width marquee;
  4. a hover-accordion;
  5. a polaroid arc;
  6. a credits column;
  7. a centred closing.
  No family repeats.
- **Phone:** everything collapses to one column, captions sit in the lower third, the Idea is framed in the upper
  60%, and touch targets are ≥ 44px.

## 6. Depth & Elevation
- **Flat by default.** Elevation comes from a step in surface tone (Canvas → Surface → Surface Raised), never
  from shadows on UI.
- **One shadow:** under the founder prints.
- **One light:** the Idea. Its glow is part of the rendered object (bloom limited to the Idea's own pixels). There
  are no halos, no glow on UI, and no bloom on type or controls.
- **No glassmorphism.** Overlays are solid Canvas Deep.
- **Grain:** an optional 3% fixed, pointer-events-none film grain over the whole canvas (never on scrolling
  layers).

## 7. Imagery
- **The Idea** is the photography. There is one continuous 3D scene, rendered like studio product photography
  (Apple's reverence) under cinema lighting (Runway). Its modes:

  | Act | Mode |
  |---|---|
  | I Idea | Raw light |
  | II Strategy | Blueprint lines in cream |
  | III Story | Warm projected light |
  | IV Movement | Flowing streams |
  | V People | Constellations |
  | VI Futures | Lattice |
  | VII Legacy | Solid gold monument |

- **Founders:** the real cut-out portraits (`/public/images/founders/*-cutout.webp`) on prints. Never stock
  people, never AI-generated faces.
- No stock photography, no illustrations, no icons beyond a single icon family for utility (close, sound, arrows):
  Phosphor Light at a 1.5px stroke.
- Media frames are sharp-cornered (0px), with no labels overlaid on images.

## 8. Motion & Interaction
- **Curves:**
  - reveal: `cubic-bezier(0.22, 1, 0.36, 1)`, 700ms;
  - fade-through: `cubic-bezier(0.65, 0, 0.35, 1)`, 900ms;
  - hover: 250ms;
  - press: 120ms.
- **Opening** (after the buttermax measurements): glyph build 1.8s → gate → 0.35s dip + 0.15s hold → halftone
  flood about 0.75s to clean (the page zooms 0.6→1 and straightens) → the Idea rises at +0.72s over 0.4s →
  the title reveals at +1.07s over 0.85s → settle.
- **Cursor:** the system cursor stays visible. The fluid ink (GPU stable-fluids: velocity keep 0.985 per frame,
  ink keep 0.955, capsule splats, no curl) inverts what it covers and passes behind the Idea.
- **The Idea's look-at:**
  - range ±20° yaw, ±10° pitch;
  - two-stage follow (fast share 0.55 at τ 0.09s, slow τ 0.65s);
  - hovering onto it changes its form (0.9s dissolve, 4s cooldown).
- **Acts:** scrubbing never speeds the score up. Each act transition is a fade-through and a change of mode, not a
  camera cut.
- **Reduced motion:** no flood, zoom, parallax or marquee drift. The ink becomes faint, small and slow. The Idea
  turns at most ±3°. Acts change by crossfade, and holds become single presses.
- **Sound:** silent until "Enter with sound". A mute toggle is always visible. The score fades when the tab is
  hidden.
- **Banned:** `window.addEventListener('scroll')`, animating layout properties, perpetual decorative loops, and
  magnetic or bouncing gimmicks on text.

## 9. Responsive Behavior
| Width | Changes |
|---|---|
| ≥ 1440 | Full layout; the Idea about 42vh tall |
| 1024–1439 | display-hero about 88px; captions narrow to 30ch |
| 768–1023 | display-hero about 72px; house slices 2 + 3 rows |
| < 768 | One column; display-hero 52px; captions in the lower third; the scrubber shows the act name only; house slices become a vertical accordion; the polaroid arc becomes a swipeable row; lens on press-and-hold; ≥ 44px targets; DPR ≤ 1.5 |

Test viewports: 375, 390, 768, 1024, 1440, in both themes and with reduced motion.

## 10. Do's and Don'ts
### Do
- Let the Idea be the only lit thing on screen. Everything else recedes.
- Use gold only for the one primary action and the active state.
- Keep headlines at 1–2 lines, Outfit 500, tight, sentence case.
- Give each act one caption block and one statement.
- Build every scene from its reference image in `design-refs/`, analysed before coding.
- Ship every state: phone, reduced motion, keyboard, WebGL-off.

### Don't
- Don't add a logo, crest, monogram, "KA" mark or placeholder for one.
- Don't use em-dashes or en-dash separators in visible text.
- Don't add telemetry or fake data: FPS, particle counts, cursor XY, local time, version numbers.
- Don't number sections, don't rotate text vertically, and don't add scroll cues.
- Don't overlay pills or labels on the imagery. Don't nest boxes. Don't stack glass.
- Don't mix Cormorant into an Outfit headline.
- Don't use a house colour as a CTA, text colour or background.
- Don't glow UI, add halos, or apply bloom beyond the Idea itself.
- Don't flip the theme between sections.
- Don't invent facts, clients or stats, or rewrite the ported copy.

## 11. Agent Prompt Guide
- **Building a scene:**
  1. Open its reference image in `design-refs/`.
  2. Write the analysis (text, type scale, spacing, components, colour, layout) in the PR or commit.
  3. Build to match, filling gaps from this file.
- **Checks before shipping:** the taste-skill pre-flight (em-dash sweep, eyebrow count, theme lock, one accent,
  hero discipline), then Playwright CLI screenshots at 1440 and 390, both themes, and reduced motion.
- **When a reference image and this file disagree on layout detail,** follow the image and update this file. When
  they disagree on a rule in §10, follow §10.
