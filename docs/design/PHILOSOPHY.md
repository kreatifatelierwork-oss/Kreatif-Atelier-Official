# Design philosophy: what "premium" means for Kreatif Atelier

Written 2026-09-30.

**Sources of truth** (all read in full; summarised here, not copied):
- the user's image-to-code SKILL.md;
- taste-skill (every SKILL.md, the README, the laziness research, the example);
- awesome-design-md (all 73 DESIGN.md files skimmed; ten studied in depth: Bugatti, SpaceX, Runway, Ferrari,
  Lamborghini, Apple, BMW M, Nike, Framer, Wired);
- playwright-cli (README and skill references).

**Status:** these sources override earlier design choices where they conflict, except the standing rules (no
logo/mark, no invented facts, copy word for word, accessibility and reduced motion, performance). Where a source
disagrees with a decision the user already made, the conflict is listed in `docs/design/AUDIT.md` and the user's
decision stands until they choose.

---

## 0. User decisions on the conflicts (2026-09-30). These override anything below.
| # | Decision |
|---|---|
| C1 | **Light is the default:** a clean, neutral, luminous light ("Luminous", canvas `#F4F5F7`), never cream-and-brass. Dark "Cinema" is the alternate. Light, accented and vibrant, done with restraint. |
| C2 | No fake readouts. One act bar: the act name plus the real film time. |
| C3 | Punctuation-only changes (comma or colon for long dashes, hyphens in price ranges). Words and prices unchanged. |
| C4 | No TURA edge labels or micro-type. A top bar plus the act bar only. |
| C5 | **Each vertical's colour is vivid and dominant inside its own world** (its light, atmosphere, materials); moving between verticals feels like moving between worlds. Outside its world, gold is the only accent for buttons, links and highlights. One vivid colour per scene, never several competing. |
| C6 | Outfit, Cormorant Garamond, IBM Plex Mono. Manrope retired. |
| C7 | One light source per scene; no halos. |
| C8 | Gold-only edges on the opening flood **and** the ink cursor. |

**Consequences for the rules below:**
- The theme choice in §5 is **Pristine Light Mode** ("Luminous"), with **Deep Dark** as the alternate.
- The colour rule "house colours as markers only" becomes the C5 rule. It stays consistent with the sources' "one
  accent" discipline because the *UI* accent is still only gold, and each scene still has only one dominant hue.

---

## 1. The design read
> **Reading this as:** a brand-film website for a creative holding company in Hyderabad, for founders, brand
> leads, institutions, partners and talent. The language is cinematic and editorial, with one continuous 3D
> scene, and leans toward a small bespoke system (native CSS + React Three Fiber) rather than an off-the-shelf
> design system.

That read puts us between taste-skill's "premium consumer / luxury / brand" preset (7/6/3) and its "agency /
creative" preset (9/8/3). The luxury-automotive and film references in awesome-design-md (Bugatti, SpaceX,
Runway, Ferrari, Lamborghini) are the closest relatives in structure.

## 2. What premium means (the principles we design by)
1. **One subject per screen, and the interface gets out of its way.** Bugatti, Apple, Runway and SpaceX all do
   the same thing: the photograph (for us, the Idea and its world) is the design, and the chrome recedes to near
   invisibility. If anything on screen competes with the subject, it goes.
2. **Restraint is the luxury.** One accent colour, one radius logic, one weight ladder, one register of copy.
   Bugatti has no accent at all. Ferrari uses its red "scarcely". Apple has exactly one shadow. Premium is what
   you *didn't* add.
3. **Typography does the work, not decoration.** Clear scale contrast (a big statement and calm, readable body),
   emphasis from size and weight within one family, never from a random second font dropped into a headline.
   Display type set at modest weights (Bugatti 400, Ferrari and Framer 500, Apple 600): confident, not shouting.
4. **Whitespace (or darkness) is a material.** Generous, even section rhythm (Bugatti 120px, Ferrari 96px,
   Apple 80px). Lamborghini's "darkness as whitespace". Never fill a gap because it is empty.
5. **Real things, not fake complexity.** No fake dashboards, telemetry, version stamps, locale/time strips,
   section numbers, decorative dots or "system" jargon. Information density comes from *real content* set
   beautifully, not from readouts that imitate density.
6. **Image first, then code.** The design is decided in images: large, readable, one per section. They are
   analysed like a specification (text, type scale, spacing, components, colour, layout), and the code is a
   faithful translation. Code does not reinterpret the image, and does not drift.
7. **Motion must mean something.** Every animation must answer "what does this communicate?": hierarchy,
   story, feedback or state change. Motion is heavy and damped (the buttermax feel), never decorative loops.
   Reduced motion gets a calm, complete, beautiful version.
8. **The first screen is calm and legible on a small laptop.** A headline of at most 2 lines, subtext of at
   most 20 words, one clear action, one focal point. No pills, stats, badges or micro-labels in the hero.
9. **Flat, open layouts; boxes only when they earn it.** No cards inside cards, no giant rounded wrappers, no
   stacked glass. Separate things with space, hairlines or a change of surface.
10. **Completeness is part of taste.** The laziness research is blunt: models (and teams) under-deliver when a
    task feels large. Every image gets generated, every section gets built, every state (loading, empty, error,
    reduced motion, phone) gets designed. No placeholders.

## 3. Anti-slop rules we enforce (the checklist)
Each rule names the source it comes from.

**Copy and typography**
- Zero em-dashes (—) and no en-dash (–) used as a separator anywhere visible. *(taste-skill §9.G)*
  - Conflict: the live-site copy contains em-dashes and the price ranges use en-dashes. See AUDIT C3.
- No mixed-family emphasis inside one headline (a serif word dropped into a sans headline). Emphasise with italic
  or weight of the *same* family. *(taste-skill §4.1)*
- Italic display words with descenders (y g j p q) get line-height ≥ 1.1 plus a bottom reserve.
  *(taste-skill §4.1)*
- Eyebrows: at most 1 per 3 sections, and never section numbers ("01 · …", "Reel 03 / 07").
  *(taste-skill §4.7, §9.F; gpt-taste)*
- The middle dot (·) at most once per line. *(taste-skill §9.F)*
- No text smaller than a comfortably readable size (body ≥ 16px; captions ≥ 13px desktop / 12px phone; nothing
  decorative below that). *(image-to-code §17; imagegen-mobile §29)*
- Plain, specific words. No "elevate / seamless / unleash / next-gen". *(all sources)*

**Layout**
- The hero fits the viewport with at most 4 text elements and 2 CTAs. No scroll cue. *(taste-skill §4.7, §9.F)*
- No vertical rotated edge text, no decorative crosshair or hairline grids, no floating corner paragraphs.
  *(taste-skill §9.F)*
- No pills or labels overlaid on imagery. Captions sit beside or below. *(taste-skill §9.F)*
- No boxes in boxes, no giant rounded section containers. *(image-to-code §16)*
- At most one marquee per page. No three equal cards. No layout family repeated. *(taste-skill §4.7, §5)*
- Nav on one line, at most 80px tall. *(taste-skill §4.7)*

**Colour and surface**
- One interactive accent (gold), locked across the page and all UI chrome. Each vertical's colour is vivid and
  dominant only inside its own world, with one vivid colour per scene (user decision C5; compatible with
  taste-skill §4.2 because the UI accent never changes).
- No warm-cream + brass + espresso "premium-consumer" default palette. *(taste-skill §4.2)*
- No neon or outer glows, no generic bloom, no halo sprites, no glass stacked without reason, no rainbow or mesh
  gradients, no pure #000 or #fff. *(taste-skill §9.A; imagegen-web §13)*
- One page theme (Luminous by default). Sections do not flip between light and dark. *(taste-skill §4.11)*
- One light source per scene; no halos (C7). Gold-only edges on the flood and the ink (C8).

**Components and behaviour**
- No custom cursor replacing the system pointer. (Our fluid ink keeps the system cursor, so it complies; it is an
  effect, not a cursor.) *(taste-skill §9.A)*
- No fake technical readouts (FPS, particle counts, cursor XY, "Hyderabad 13:31 IST"). *(image-to-code §17;
  taste-skill §9.F)*
- One label per intent (only one "contact" wording on the page). Full states: loading, empty, error,
  reduced motion. *(taste-skill §4.5)*
- No `window.addEventListener('scroll')`. Animate transform and opacity only. Grain on fixed layers only.
  *(taste-skill §5.D, §6)*

## 4. Dial settings for this site

**taste-skill dials**

| Dial | Setting | Why |
|---|---|---|
| DESIGN_VARIANCE | **7** | Cinematic and editorial asymmetry (captions off-grid, the subject off-centre), but each frame stays calm and legible. Pure 9–10 "artsy chaos" would fight the film's clarity and the copy-heavy acts. |
| MOTION_INTENSITY | **8** | The site *is* a film with a live scene and a fluid cursor; motion carries the story. It stops short of 10 because motion must stay motivated, and reduced motion must be a first-class version. |
| VISUAL_DENSITY | **3** | Gallery-airy. One statement per screen; the dense real content (services, process, pricing) is paced across acts and the credits instead of crammed. |

**image-to-code dials**

| Dial | Setting | Why |
|---|---|---|
| DESIGN_VARIANCE | 7 | As above. |
| VISUAL_DENSITY | 3 | As above. |
| ART_DIRECTION | 8 | A bold statement (a film about an idea), executed with control. |
| IMPLEMENTATION_CLARITY | 9 | The references must be buildable: real type, real spacing, no mood-art. |
| IMAGE_USAGE_PRIORITY | 9 | The Idea and its world are the image in every frame. |
| SPACING_GENEROSITY | 9 | Darkness and space are materials. |
| ANALYSIS_PRECISION | 10 | Every reference image is analysed like a spec before coding. |
| IMAGE_GENERATION_EAGERNESS | 10 | One image per scene plus detail and phone images: 29 prompts in the pack. |
| UI_SIMPLICITY_DISCIPLINE | 10 | The previous builds' biggest weakness was micro-UI clutter. Maximum discipline. |

**imagegen-frontend-web extras**
- **Hero scale:** Giant Statement.
- **Narrative spine:** Stage / spotlight (performer and audience, with the visitor cast).
- **Second-read moment:** a single material switch, where the Idea turns from light into solid gold at Legacy.

## 5. Choices from the combinatorial variation engine
| Category | Choice | Why |
|---|---|---|
| Theme paradigm | **Pristine Light Mode, "Luminous"** (user decision C1), with **Deep Dark "Cinema"** as the alternate | Light, accented and vibrant as the user wants, kept neutral and luminous (no cream or brass) so it stays premium; the vertical worlds bring the vivid colour (C5). |
| Background character | **Full-bleed cinematic imagery** | The live 3D scene is our photography: every frame is a full-bleed render. |
| Typography character | **Editorial serif + sans**, as a strict three-role trinity (after Bugatti) | See below. |
| Hero architecture | **Massive image-first hero with restrained text** | The Idea is the hero image; the title sits low-left like Ferrari's "headline floats over the bottom of the photograph". |
| Section system | **Poster-like stacked storytelling** | Seven acts, each a poster frame with one statement. |
| Motion cue 1 | **Pinned narrative section energy** | The film is one pinned, scrubbable timeline. |
| Motion cue 2 | **Cinematic fade-through energy** | Act changes happen as fade-throughs and mode shifts, never hard cuts. |

**The four signature components**
1. **Off-grid editorial layout:** each act's spoken line sits off-grid against the scene (a caption block
   anchored low-left, low-right or high-right as the composition needs).
2. **Hover-accordion slice layout:** the five houses at Legacy, as five tall slices; hovering or focusing one
   widens it to reveal what it does. Each slice carries its house colour as a thin identity edge only.
3. **Infinite brand marquee strip:** the 13 industries in Act IV (Movement), set large in the display face. The
   only marquee on the page.
4. **Turning polaroid arc:** the four founders in the credits, as cut-out portraits on pearl mounts, fanned on an
   arc; choosing one brings it forward with the bio beside it.

**Typography trinity** (roles never blur)
- **Display (Outfit, weights 400–500, sentence case, tight tracking):** act titles, headlines and the house
  names. Outfit is on taste-skill's recommended list. It is never set heavy: no 800 weight and no shouting
  uppercase.
- **Voice (Cormorant Garamond, 400 and italic):** the film's spoken lines, quotes, the vision and long-form bios.
  The serif is justified by the brand's heritage register ("Bold · Radiant · Timeless", "Atelier") and by its
  role as the narrator's voice (subtitles), exactly as Bugatti uses a serif for its reading voice. It never
  appears inside a sans headline.
- **Utility (IBM Plex Mono, 400–500, uppercase with tracking):** buttons, the act scrubber, the timecode and
  captions. Real functional labels only. Plex Mono is the documented substitute for Bugatti Monospace.
- Manrope retires; its utility role moves to Plex Mono and its body role to Cormorant or Outfit. This reduces
  font moods from four to three. See AUDIT C6.

## 6. What stays from our earlier work (compatible with the sources)
- The film structure ("The Making of a Legacy"), the gate with the sound choice, the buttermax-rhythm opening
  and the fluid-ink cursor (system cursor kept).
- The Idea as the single protagonist.
- Real HTML text, the reduced-motion version, keyboard control, the phone versions, and the deferred 3D.
- Gold as the brand's one accent. The brand has always named gold (the original tokens, "Golden Guardian"), so
  this is the articulated exception taste-skill allows. The *cream background* around it is what goes.
