# Decisions so far

The one list of what has been decided for the Kreatif Atelier website, in force as of **2026-10-01** (updated after
the user's answers that day).

- **Sources:**
  - the conversations with the user (2026-09-28 to 2026-10-01);
  - `CLAUDE.md`;
  - `docs/concepts/*` and `docs/research/*`;
  - `docs/design/PHILOSOPHY.md`, `DESIGN.md` and `docs/design/AUDIT.md`;
  - the git log on `redesign-v2`.
- **Precedence:** newer decisions override older ones. The standing rules are never overridden.
- **Marks:**
  - **CONTRADICTION** marks two sources that disagree, with the resolution in force (or the question it raises).
  - **OPEN** marks items waiting for the user.

---

## 1. Standing rules (never overridden)
- **No logo, crest, emblem, monogram, "KA" mark or placeholder** anywhere: nav, loader, 3D scene, footer or favicon.
  - Brand presence is the words "Kreatif Atelier" set in type, plus the ✦ motif.
  - The favicon is a gold ✦ on navy.
  - The company chart's KA monogram and its per-vertical icons (column, swan, clapperboard, flame, lotus) are never
    reproduced.
  - Every sculpture or symbol is original, procedural, abstract and must not read as a logo.
- **Don't invent facts, clients, stats, testimonials or services.** New wording is shown to the user before it ships,
  marked PROPOSED in content files.
- **Copy word for word** from the live site and the company chart. Punctuation only may change (C3): a comma or colon
  for a long dash, and hyphens in price ranges.
- **Pricing exactly as is:** Starter ₹25-35K, Growth ₹55-75K, Brand Partner ₹1-1.5L per month. No "Enquire"
  button.
- **Contact:**
  - the mailto CTA goes to `hello@kreatifatelier.com` with the subject "Free Brand Audit Request";
  - social URLs stay empty until given, and "@kreatifatelier" shows as plain text.
- **Accessibility and reduced motion are mandatory:**
  - all real copy is real HTML text, never only in a canvas;
  - every control is keyboard reachable, with visible focus;
  - `prefers-reduced-motion` gets cuts, crossfades and still forms; holds become presses.
- **Performance:** mobile Lighthouse Performance ≥ 70 (/film is at 93), Accessibility ≥ 95, SEO 100.
- **Phones and weak devices:**
  - phones: DPR ≤ 1.5, no depth of field, simplified effects, and a touch version of every interaction;
  - no WebGL: a CSS fallback with the same text and navigation.
- **Assets:** commercially licensed only, logged in `docs/ASSETS.md`.
- **Reference sites:** never copy their code, models, imagery, sound or signature designs. We study behaviour and
  build our own.
- **Branches and commits:** all work on `redesign-v2`; `main` stays untouched. Commit after each phase.
- **Workflow:**
  - propose before big changes and stop at checkpoints;
  - **don't build v3 until the user approves it**;
  - follow output-skill: no half-finished work or placeholder code.
- **Privacy on reference sites:** decline or leave cookie banners (never accept), and don't click through legal or
  age gates.

## 2. The company and its content (what the site must say)
- **Kreatif Atelier is a creative holding company,** "Ideas | People | Impact".
  - Lines from the chart: "A creative holding ecosystem for a better tomorrow." · "Multiple verticals. One vision.
    Exponential impact." · "Disciplines today. A brighter tomorrow."
  - Also from the chart: the Vision sentence, the five Pillars (Creativity · Education · Production · Wellbeing ·
    Technology), "Our ecosystem serves" (six groups) and "Impact" (six outcomes).
  - Source: `content/verticals.ts`, transcribed exactly from the chart on 2026-09-28.
- **The five verticals** (name, tagline, four "what we do" items, one value line each), each with a signature colour:
  1. **Aurelius**: Brands. Strategy. Growth. Royal indigo `#3D4BFF`.
  2. **Valora**: People. Skills. Opportunities. Sunrise coral `#FF6A3D`.
  3. **Golden Guardian Productions**: Stories. Visuals. Impact. Cinema magenta `#E8307F`.
  4. **Rudra Yugen**: Innovation. Culture. Futures. Electric cyan `#0FB5E4`.
  5. **Asraya**: People. Balance. Wellbeing. Fresh jade `#23C27C`.
- **The old "four divisions" are gone,** including Zenith Chapter (2026-09-28).
- **Live-site content still in use, word for word** (all in `content/*.ts`):
  - **About / philosophy** (`about.ts`): "We build brands that actually move people.", the intro, the four pillar
    cards and the philosophy quote.
  - **The six services** (`services.ts`): card blurbs, taglines, "What it is / How it works" and the four features
    each.
  - **Pricing** (`engagement.ts`): the three tiers with features and notes, "Most Popular" on Growth.
  - **The four founders** (`founders.ts`): names, roles and bios, with the transparent cut-outs of their portraits.
  - **Why us** (`why.ts`, six points), **process** (`process.ts`, five steps) and **industries** (`industries.ts`, 13).
  - **Contact** (`site.ts`): "Ready to build something worth remembering?", the audit-call paragraph, "Schedule
    Your Free Brand Audit ✦", Hyderabad & Secunderabad, the email and the handle.
- **Earlier decisions still in force:**
  - **Domain:** `https://kreatifatelier.com` for metadata; hosting is decided later.
  - **Dates:** no "Est." line until the founding year is confirmed; the footer year comes from the current date.
- **CONTRADICTION (resolved 2026-10-01, "the chart wins"):** live-site copy that describes the old structure is removed,
  or "four" becomes "five" where a number is needed.
  - Why us #06 now reads "With five specialized divisions, …".
  - The hero stat is now "5 Verticals".
  - The old ecosystem section (`content/ecosystem.ts`, Zenith Chapter) is marked superseded, kept only for the
    `/concepts` prototypes and never used in v3.
  - **Note:** Why us #06's capability list ("production, PR, education, and social impact") is unchanged, word for
    word. Say if it should change.
- **CONTRADICTION (resolved 2026-10-01):** Kreatif Atelier is **"a creative holding company"** (chart wording). The
  old About intro ("Kreatif Atelier is a full-spectrum creative agency…") **moves inside Aurelius**.

## 3. How the direction evolved (oldest first)
| Date | Decision | Status |
|---|---|---|
| 2026-09-28 | Rebuild the one-page site as a 3D Next.js experience; copy and order kept | Superseded |
| 2026-09-28 | Stage 2: three concepts (1 The Orrery, 2 The Production, 3 The Golden Thread). The user chose **"a MIX of Concept 1 (The Orrery) and Concept 2 (The Production)"** | Lives on (see §4) |
| 2026-09-28 | The mix became **"The Long Take"**: a luminous orrery filmed as one continuous camera shot in eight reels. Built as the current home page | Superseded; still on `redesign-v2` |
| 2026-09-28 | The TURA layout reference: framed edge furniture, motto on the edge, scroll cue, microtype | Dropped by C4 |
| 2026-09-28 | "Light, radiant, vibrant"; palettes A (light) and B (deep) | Refined by C1 |
| 2026-09-29 | "The world does NOT have to be space, planets or anything orbital." Five world ideas sketched (House of Light, Paper Atelier, Prism Flats, Morning Dew, Glassworks). **The user liked the House of Light** and asked for more ideas at least as creative | Lives on (see §4) |
| 2026-09-29 | "All of these ideas are centred on the holding company." The story must be bigger, like a detailed, information-rich film that responds to cursor and sound. Research of 3D sites and how to measure creative flow (`SURVEY-3D.md`, `CREATIVITY.md`) | In force |
| 2026-09-30 | **"The Making of a Legacy" approved:** a film in which an idea becomes a legacy. Answers: generated score, silent until chosen, mute toggle, no voiceover; act names and gate wording approved; pricing in the credits; IBM Plex Mono; both palettes, light default | In force (story frame) |
| 2026-09-30 | **buttermax.net** is the reference for the opening sequence (beat for beat) and the cursor. Checkpoint 1 built at `/film` (6e75291) | In force |
| 2026-09-30 | **Design sources of truth adopted:** image-to-code, taste-skill, awesome-design-md, playwright-cli. They override earlier design choices except the standing rules. Image-first from now on | In force |
| 2026-09-30 | **C1–C8 answered** (see §6) | In force |
| 2026-10-01 | **The unified idea brief** (this list's points §4–§5). The cursor ink is rebuilt to match buttermax | In force |
| 2026-10-01 | **v3 "Shot on Location" approved** with all its new wording. The concept pair confirmed as Orrery × Production. The ink gets one more pass on the tail shape only, then is accepted. **Build plan:** one complete vertical slice at `/experience` (opening, Atrium, Studio Floor, Aurelius's Drafting Hall with its Enter room and the Lens, the act bar and the Index), image-first, the rest blocked out. The home page stays untouched | In force |
| 2026-10-01 | **Build the real site:** the experience becomes the home page with every section; navigation and ink are LOCKED (never changed without asking). Why us #06 rewritten by the user | In force |
| 2026-10-03 | **Wording approved:** the page title "Kreatif Atelier: a creative holding company in Hyderabad", the search description, "Credits" and "Post-credits", the screen-reader labels. The site is built (see `docs/PROGRESS.md`) | In force |

## 4. The two concepts that were combined, and what the user liked
The combination the user chose (2026-09-28) was **The Orrery × The Production** (confirmed by the user 2026-10-01). The House of Light (2026-09-29) is the
world idea the user liked afterwards. All three are carried into v3. What each contributed:
- **From The Orrery:**
  - the company as one central, radiant thing with its verticals around it, each a *world* with its own colour,
    material and abstract form;
  - **the object is the menu:** you navigate by going to a thing, not by clicking a list;
  - focus pulls: whatever you choose comes sharp while the rest falls soft.
- **From The Production:**
  - the site plays like a film: an opening sequence, acts or reels as chapters, a timeline with real time you can
    scrub or jump along;
  - one continuous camera with no hard cuts, transitions as rack focus and colour haze;
  - you always know where you are and can jump anywhere.
- **From The House of Light:**
  - "Atelier" means studio, so the company becomes a *place*;
  - each vertical is a room flooded by its own coloured light, and colour bleeds through doorways so you glimpse
    where you're going;
  - thresholds instead of cuts;
  - each room's interaction is a real metaphor for that vertical;
  - a floor plan as the "you are here" map.
- **CONTRADICTION (resolved 2026-09-29 and 2026-10-01):** the Orrery's orbiting worlds and planet zooms against "not a
  solar system, not zooming into planets". What survives is the Orrery's *logic* (a centre, five distinct worlds, the
  object as the menu), not its orbits.
- **CONTRADICTION (resolved 2026-10-01):** "The Making of a Legacy" v2 was a pinned scroll of poster scenes, against
  "not a pinned scroll of posters" in the unified brief. The variation-engine choices "poster-like stacked
  storytelling" and "pinned narrative" in `PHILOSOPHY.md` / `DESIGN.md` are therefore replaced by environmental travel
  in v3, and both files need that update when v3 is approved.

## 5. The unified idea brief (2026-10-01): requirements for v3
1. **The site is not only about the holding company.** The verticals are chapters inside a bigger story: what
   Kreatif Atelier believes, how it works and what it makes possible. Avoid the "here are our divisions" trap.
2. **The opening** is the buttermax sequence:
   1. the ✦ forms from liquid dots;
   2. the sound gate;
   3. the gold flood;
   4. the rise;
   5. a hand-written word.
3. **The cursor:** the fixed buttermax ink is the base everywhere. The Lens and per-act roles sit on top of it.
4. **Environmental navigation:** one continuous 3D world you travel *through*.
   - It is not a solar system, not zooming into planets and not a pinned scroll of posters.
   - Places connect through passages and reveals. Each vertical's place is its own world in its vivid colour (C5).
   - Offerings are interactive things in the scene, not little buttons.
   - "Enter" goes deeper into a sub-space and back out.
   - The act bar and "Index" reach any section in one or two clicks.
5. **Storytelling:** "The Making of a Legacy". Acts, Watch / Direct, credits, a post-credits scene, and a generated
   score that stays silent until chosen.
6. **The look** per C1–C8 and `DESIGN.md`.
7. **All content word for word** (§2).
8. **The standing rules** (§1).

## 6. Design decisions C1–C8 (2026-09-30)
| | Decision |
|---|---|
| C1 Theme | **Light is the default:** a clean, neutral, luminous light (`#F4F5F7`), never cream-and-brass. Dark "Cinema" is the alternate |
| C2 Readouts | No fake readouts. **One act bar** with the act (place) name and the real film time |
| C3 Punctuation | Punctuation-only changes to ported copy (comma or colon for long dashes, hyphens in price ranges) |
| C4 TURA | No edge labels or tiny microtype. A top bar and the act bar only |
| C5 Vertical colours | **Vivid and dominant inside the vertical's own world** (its light, atmosphere and materials). Outside it, gold is the only accent for buttons, links and highlights. One vivid colour per scene |
| C6 Fonts | Outfit (display), Cormorant Garamond (voice), IBM Plex Mono (utility). Manrope retired |
| C7 Glow | One light source per scene; no halos |
| C8 Edges | The flood rim and the ink's edge are **gold only**, no rainbow |

Built so far for these decisions (2026-10-01): `/film` uses the Luminous light palette, the act bar (Act 00 · Title ·
film time), a gold flood rim and a gold ink edge, and the Idea's particles pass through gold tones only.

## 7. Things already built on `redesign-v2`
- **Home page:** "The Long Take" (orrery). Superseded and to be replaced by v3 when approved.
- **`/film`:** the opening and cursor checkpoint.
  - The ✦ glyph build, the gate, the dip, the halftone flood, the rise and the written signature, all fitted to
    buttermax's measured timings.
  - The generated score.
  - **The ink, rebuilt 2026-10-01:** matched to buttermax with identical scripted strokes. It runs on a fixed timestep,
    reads every pointer sample, and shares one animation loop with the 3D. It passes behind the Idea and has a gold
    edge.
- **`/concepts`:** the Stage 2 prototypes (noindex). Recommended for deletion before launch.

## 8. Contradictions between the design sources and the user's wishes (resolution in force)
- **No custom cursors (taste-skill) vs the ink cursor.** The user's wish stands. The system cursor stays visible and
  the ink is an effect, not a replacement cursor.
- **One accent colour (taste-skill) vs five vertical colours.** C5 resolves it: one vivid colour per place, gold
  outside.
- **No mixed type families in one line (DESIGN.md) vs the opening's hand-written word.** The hand-written *Atelier*
  sits on its own line under the wordmark (approved 2026-10-01).
- **"Floating spheres" slop (imagegen-web) vs the Idea as a sphere of particles on `/film`.** The Idea is gold light
  that changes form and never rests as a sphere (approved 2026-10-01).
- **"No scroll cues" vs the Long Take's Scroll label.** Resolved by C4.
- **No sound (old CLAUDE.md) vs the approved generated score.** Resolved (2026-09-30).

## 9. OPEN: waiting for the user
- **The first-slice images** (16, listed at the top of `docs/design/IMAGE-PROMPTS.md`) into `design-refs/`. Then the
  slice is built to match them.
- **Why us #06's capability list** (see §2): keep it word for word, or change it?
- **/concepts:** delete before launch (recommended).
