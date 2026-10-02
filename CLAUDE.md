# Kreatif Atelier: "The Making of a Legacy: Shot on Location"

## Design sources of truth (added 2026-09-30, OVERRIDE earlier design choices where they conflict)
These materials define what "premium" means for this project. Read the relevant ones before any design work.
- **Installed skills** (`.claude/skills/`, committed):
  - `image-to-code` (the user's SKILL.md; identical to `image-to-code-skill`): image-first workflow, meaning
    generate or receive design images, analyse them deeply, then build to match them without drifting;
  - `taste-skill` (`design-taste-frontend` v2): brief inference, the three dials, the anti-slop bans (em-dash ban,
    eyebrow rationing, no scroll cues, no locale/time strips, no fake technical labels, no custom cursors) and the
    pre-flight check;
  - `redesign-skill` (the audit protocol), `output-skill` (no half-finished work, no placeholders);
  - `imagegen-frontend-web` / `imagegen-frontend-mobile` (how image prompts are written);
  - `stitch-skill` (the DESIGN.md format);
  - `soft-skill`, `minimalist-skill`, `brutalist-skill`, `gpt-tasteskill` and `brandkit`, used only when their
    direction is chosen. `brandkit` is never used for logo work (see the no-logo rule).
- **Reference library:** `design-sources/` (gitignored). It holds taste-skill-main (README, research/laziness,
  examples), awesome-design-md-main (73 DESIGN.md files; the closest to us are Bugatti, SpaceX, Runway, Ferrari,
  Lamborghini, Apple, BMW M, Nike, Framer and Wired) and playwright-cli-main.
- **Our distillation:**
  - `docs/design/PHILOSOPHY.md` (principles, anti-slop rules, dials, variation-engine choices);
  - `DESIGN.md` at the project root (the design system any agent must build from);
  - `docs/design/AUDIT.md` (what the current build breaks);
  - `docs/design/IMAGE-PROMPTS.md` (image prompts; generated images go in `design-refs/`).
- **Image-first:** no visual section is coded before its reference image exists in `design-refs/` and has been
  analysed (text, type scale, spacing, components, colour, layout). The code follows the image, and gaps are
  filled from DESIGN.md.
- **Precedence:** these sources override earlier design decisions in this file where they conflict, EXCEPT the
  standing rules:
  - no logo, monogram or placeholder mark;
  - no invented facts, clients or stats;
  - copy word for word;
  - accessibility and reduced motion mandatory;
  - the performance targets.
  Conflicts between a source rule and a user decision are listed in `docs/design/AUDIT.md` for the user to decide.
  Until the user decides, the user's decision stands.
- **Visual checks:** use **Playwright CLI** (`playwright-cli`, skill in `.claude/skills/playwright-cli`) for all
  visual checks, screenshots, video recordings and traces, at 1440 and 390, both palettes, and with reduced motion.

## Design decisions (user, 2026-09-30): answers to the audit conflicts C1–C8
- **C1 Theme:** **LIGHT is the default**: a clean, neutral, luminous light, never cream-and-brass. Dark "Cinema" is the
  alternate theme. Light, accented and vibrant, with the restraint the sources demand.
- **C2 Readouts:** no fake readouts at all. One act bar with the act name and the real film time.
- **C3 Punctuation:** punctuation-only changes to ported copy: a comma or colon for long dashes, hyphens in price
  ranges ("₹25-35K"). Every word and every price stays identical.
- **C4 TURA:** no edge labels or tiny microtype. Keep a top bar and the act bar.
- **C5 Vertical colours:** each vertical's colour is **vivid and dominant inside its own world/place** (its light,
  atmosphere and materials), so moving between verticals feels like moving between worlds. **Outside** its world,
  gold is the only accent (buttons, links, highlights). One vivid colour per scene, never several competing.
- **C6 Fonts:** Outfit (display), Cormorant Garamond (voice), IBM Plex Mono (utility). Manrope is retired.
- **C7 Glow:** one light source per scene; no halos on everything.
- **C8 Edges:** the opening flood rim and the ink cursor's edge are **gold only**, no rainbow.

## What this project is
The website for **Kreatif Atelier, a creative holding company** ("Ideas | People | Impact"), its beliefs, how it
works and what it makes possible, with its five verticals as chapters inside that bigger story.
- **The site** (built 2026-10-02, on `redesign-v2`) is v3 "Shot on Location" (`docs/concepts/THE-MAKING-OF-v3.md`, approved): one
  continuous camera through a world that is still being made, eleven places on one route, a buttermax-style opening
  and the fluid ink cursor. It is the home page (`/`). `/experience` only forwards to `/`.
- **Retired** (in git history only): the Long Take orrery, `/film` (the opening + ink checkpoint) and `/concepts`.
- **Decisions** are collected in `docs/DECISIONS-SO-FAR.md`; build log and proofs in `docs/PROGRESS.md`.
- `main` holds the old build and stays untouched.

## LOCKED by the user (2026-10-01): never change without asking first
- **Spatial navigation:** how the camera travels, its smoothness, the scroll / swipe / arrow key / Watch feel, the
  settling on places, the transitions and the timing. Files: `components/experience/journey.ts`, `useInput.ts`,
  `stage/CameraRig.tsx`, `lib/config.ts` → `experienceConfig` (all of it), and the travel code in `Experience.tsx`
  (go / enter / leave and the frame's travel block).
- **The ink cursor:** shape, push, fade, tail, gold edge, brush lag, touch behaviour. Files:
  `components/film/ink/*`, `components/film/loop.ts`, `lib/config.ts` → `filmConfig.ink`, the ink canvas layer and
  the pointer → brush wiring.
- If a feature would need either to change, stop and ask. Proof tools: `scripts/research/nav-record.mjs` +
  `nav-compare.py`, `ink-record.mjs --ink-only` + `ink-measure.py`, `ink-hz.mjs --out` + `ink-hz-compare.mjs`,
  against `docs/research/baseline/*.json`.

## The structure (source of truth: `content/verticals.ts`, transcribed exactly from the company chart)
- **Kreatif Atelier:** a creative holding company.
  - Lines: "A creative holding ecosystem for a better tomorrow." "Multiple verticals. One vision. Exponential
    impact." "Disciplines today. A brighter tomorrow."
  - Also: the vision, the pillars (Creativity · Education · Production · Wellbeing · Technology), "Our ecosystem
    serves" and "Impact".
- **The five verticals** (name, tagline, signature colour):
  1. **Aurelius**: Brands. Strategy. Growth. Royal indigo `#3D4BFF`.
  2. **Valora**: People. Skills. Opportunities. Sunrise coral `#FF6A3D`.
  3. **Golden Guardian Productions**: Stories. Visuals. Impact. Cinema magenta `#E8307F`.
  4. **Rudra Yugen**: Innovation. Culture. Futures. Electric cyan `#0FB5E4`.
  5. **Asraya**: People. Balance. Wellbeing. Fresh jade `#23C27C`.
- **Live-site content still in use, word for word:** about and philosophy, the six services, pricing (exactly as
  is), the founders (with cut-outs), why us, process, industries and contact.
- **Where each section lives on the route** (`components/experience/route.ts`): Atrium (title) → Studio Floor (about,
  the four About panels as rooms) → Aurelius's Drafting Hall (the agency line, Our Services with all six services,
  Engagement Models) → Golden Guardian's Projection Hall (Creative Production) → the Concourse (services overview,
  How We Work, industries) → Valora's Water Court → Asraya's Garden Court → Rudra Yugen's Glass Lattice → the Roof
  (the holding company; moments for Vision, Pillars, Our ecosystem serves, Impact) → the Gallery (founders arc, Why
  Kreatif Atelier) → the closing scene (the audit CTA, contact, footer). Links: `/#<place>`, `/#<place>/<room>` and
  aliases (`/#founders`, `/#pricing`, `/#services`, `/#pillars` …).

## Visual direction
Follow `DESIGN.md` and `docs/design/PHILOSOPHY.md`, as amended by the decisions above.
- **Palette:** luminous neutral light by default and Cinema dark as the alternate. Gold is the only UI accent;
  vertical colours are dominant inside their own worlds (C5).
- **Type:** three roles, never mixed in one line.
- **Imagery:** one subject per scene, one light source per scene, no fake UI, no labels on imagery.
- **Lighting:** the Poly Haven "Photo Studio 01" HDRI (`public/hdri/`) is a reflection environment only, never
  visible.
- **Symbols:** sculptures and symbols are original, procedural and abstract. They must never read as logos. Never
  reproduce the chart's monogram or its per-vertical icons (column, swan, clapperboard, flame, lotus).

## Tech stack (do not swap without asking)
- Next.js (App Router, TypeScript), `output: 'export'` (static), webpack build
- React Three Fiber + drei + @react-three/postprocessing; one `<Canvas>` for the whole experience, lazy-loaded
- Framer Motion for DOM transitions; Tailwind + CSS variables; zustand where shared state is needed
- pnpm

## Architecture rules
- Home = `app/page.tsx` → `components/experience/Experience.tsx`. The DOM shell (all real text in `Captions`, rooms in
  `RoomPanel`, the act bar, the Index, the founders arc) is server-rendered; the 3D stage
  (`components/experience/stage/*`) is `dynamic(..., { ssr: false })` and mounts only after the gate.
- Everything behind the gate is `inert` until the film is live; then focus moves to the title.
- The route position `s` (0 = Atrium … 10 = closing scene, in `rtRef`) is the single source of truth; camera,
  atmosphere, captions, act bar and the world read it. Per-frame values go through refs, never React state. One
  shared animation loop (`components/film/loop.ts`): the R3F canvas (`frameloop="never"`) is advanced first, then
  the ink and the shell.
- Places are components in `stage/places/*` composed around the fixed camera path; thing positions in
  `stage/layout.ts`; the one light per place in `stage/Light.tsx` and `stage/look.ts`; world interactions share
  state through `components/experience/actions.ts`.
- All copy in `content/*.ts`; site UI labels in `content/experience.ts`; C3 punctuation is applied at render (`c3`).
- The Idea's point-cloud forms are built in a Web Worker (`components/film/stage/forms.worker.ts`): never move that
  work back onto the main thread (it cost 1.5 s of blocking on mobile).
- Weak devices / no WebGL 2 get the still version (`is-still`, preview with `?still`). `?tune` exposes test hooks.

## Non-negotiables
- **No logo, crest, emblem, monogram or "KA" mark anywhere**, and no placeholder for one. Brand presence = the words
  "KREATIF ATELIER" in type and the ✦ motif. Favicon: gold ✦ on navy.
- Don't invent facts, clients, stats, testimonials or services. New wording must be shown to the user before it ships
  (flag it PROPOSED in content files).
- Mailto CTA stays (`hello@kreatifatelier.com`, subject "Free Brand Audit Request"). Social URLs stay empty until given.
- All real copy is real HTML text (never only in the canvas). Accessibility ≥ 95, SEO 100, mobile Performance ≥ 70.
- `prefers-reduced-motion`: cuts + crossfades, still sculptures, holds become presses. Keyboard reachable, visible focus.
- Phones: DPR ≤ 1.5, no depth of field, simplified effects, touch versions of every interaction.
- Weak devices / no WebGL: the still version with the same places, text and navigation.
- Commercially licensed assets only, logged in `docs/ASSETS.md`. Sound: a generated score only, silent until the visitor
  chooses "Enter with sound", with a mute toggle always visible. No video yet.

## Workflow rules for Claude
- Work in phases; after each: `pnpm build`, fix type/lint errors, check at 1440 and 390 (headless Chrome with WebGL via
  Playwright CLI; the older `scripts/research/*.mjs` CDP scripts remain for frame-accurate screencasts), commit with a clear message.
- Tunables go in `lib/config.ts`. Keep components small.

## Commands
- `pnpm dev` — local dev at http://localhost:3000
- `pnpm build` — static export to `/out` (runs `next build --webpack`; keep webpack for now)
- `pnpm lint` · `pnpm typecheck`
- `pnpm start` — serve `/out` locally with compression (use this for Lighthouse)
- `pnpm images <dir>` — rebuild founder portraits from PNGs in `<dir>`
- `node scripts/research/xp-check.mjs <outDir> [--w 390 --h 844 --touch] [--dark] [--reduced] [--still]` — screenshot
  every place (needs the research Chrome on port 9555 and `pnpm start`-style server on 4174)
- `node scripts/research/xp-interact.mjs <outDir> [...]` — every interaction and room; `xp-keyboard.mjs` — keyboard
  and screen-reader pass; `gpu-time.mjs` — GPU and script time per frame at each place
- Frame-time checks need mains power: on low battery Chrome caps headless at 30 fps (check a blank page first).
