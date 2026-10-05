# Kreatif Atelier: "One Take Across the World" (v5)

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
  **Amended 2026-10-05:** in-world headlines and title cards use the classical serif (Cormorant Garamond 500) as in
  the v5 reference images; Outfit stays for UI, buttons and text "written in light"; Plex Mono for diagram labels.
- **C7 Glow:** one light source per scene; no halos on everything.
- **C8 Edges:** the opening flood rim and the ink cursor's edge are **gold only**, no rainbow.

## v5 decisions (user, 2026-10-05)
- **Real 3D worlds:** places are built as 3D environments the camera moves THROUGH, primarily Gaussian-splat worlds
  from World Labs Marble (`design-refs/worlds/wNN-*.spz`, rendered with Spark), stitched into one journey at physical
  thresholds (canopy break, cave mouth, water surface, ice wall) with fog, light and real 3D foreground covering each
  handover. Until a world arrives, its place uses the depth-mesh fallback (plates displaced by Depth Anything depth).
  Never flat image cards.
- **Text stays:** no blur-in / blur-out on text. Text appears early, stays fully visible while its place is in view
  and while travelling past it, leaves only when the place is well behind; Watch holds allow reading it twice;
  entrances are a clean reveal (wipe). Text on screen at every point of the route.
- **Company pages:** same formula on all five; persistent canvas; each ends with Enquire, "Next" and "Back to the
  Atlas". Valora, Rudra Yugen and Asraya offering paragraphs are PROPOSED (`content/companies.ts`).
- **Phones:** M01–M06 were never made; phone views are composed from the desktop references.
- **Order and checkpoint:** text fix + page shells, then Spark + streaming/stitching + fallback, then worlds as they
  arrive (w01–w03 first). STOP at the checkpoint when chapters 1–4 run on splat worlds w01–w03: link, short screen
  recording, side-by-side sheets vs references, frame times on mains power.

## What this project is
The website for **Kreatif Atelier, a creative holding company** ("Ideas | People | Impact"), its beliefs, how it
works and what it makes possible, with its five verticals as lands inside that bigger story.
- **The site** (v5, on `redesign-v2`): `docs/concepts/WORLD-PLAN.md` "One Take Across the World". The home page (`/`)
  is one uncut camera move through twelve chapters (jungle, climb, clouds, five peaks, the five lands, summit, night
  sky, return); the five company pages (`/aurelius`, `/golden-guardian-productions`, `/valora`, `/asraya`,
  `/rudra-yugen`) are journeys through each land. `/experience` only forwards to `/`.
- **References:** `design-refs/` (gitignored): home/ H01–H36, pages/ A/G/V/S/R, graphics/ X01–X10, plates/ P01–P18;
  analysed in `docs/design/REFS-ANALYSIS.md`. Splat worlds go in `design-refs/worlds/`.
- **Retired** (in git history only): v3 "Shot on Location" (rooms), the Long Take orrery, `/film`, `/concepts`.
- **Decisions** are collected in `docs/DECISIONS-SO-FAR.md`; build log and proofs in `docs/PROGRESS.md`.
- `main` holds the old build and stays untouched.

## LOCKED by the user (2026-10-01): never change without asking first
- **Spatial navigation:** how the camera travels, its smoothness, the scroll / swipe / arrow key / Watch feel, the
  settling on places, the transitions and the timing. Files: `components/experience/journey.ts`, `useInput.ts`,
  `stage/CameraRig.tsx`, `lib/config.ts` → `experienceFeel` (all of it), and the travel code in `Experience.tsx`
  (go / enter / leave and the frame's travel block). The per-place route data (holds, camera, anchors, colours,
  atmosphere) is separate (user decision 2026-10-05): `lib/route-data.ts` (home) and
  `components/experience/journeys/*` (company pages); only that data changes for a new route, never the engine.
- **The ink cursor:** shape, push, fade, tail, gold edge, brush lag, touch behaviour. Files:
  `components/film/ink/*`, `components/film/loop.ts`, `lib/config.ts` → `filmConfig.ink`, the ink canvas layer and
  the pointer → brush wiring.
- If a feature would need either to change, stop and ask. Proof tools: `scripts/research/nav-record.mjs` +
  `nav-compare.py`, `ink-record.mjs --ink-only` + `ink-measure.py`, `ink-hz.mjs --out` + `ink-hz-compare.mjs`,
  against `docs/research/baseline-v5/*.json` (recorded 2026-10-05 on mains power), plus the route-independent
  `scripts/research/engine-trace.mjs` (must report IDENTICAL against `baseline-v5/engine-baseline.json`).

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
- **Where each section lives** (`components/experience/journeys/home.ts`): The Seed (title, H02 line, positioning,
  the four About panels as field-guide callouts, Where We Operate map) → The Climb (philosophy quote up the trunk,
  Ideas | People | Impact, 5 Verticals / ∞ Creative Vision) → Above the Canopy (the holding company, Vision) → The
  Five Peaks (pillars, the atlas) → Aurelius (six services, portal) → Golden Guardian Productions → Valora → Asraya →
  Rudra Yugen (each: name, tagline, offerings, value, portal) → The Summit (tomorrow line, serves, impact, why us) →
  The Night Sky (founders as credits, industries star chart, process) → Return (contact). Company pages:
  `journeys/companies.ts` (Aurelius also carries the agency line, services, engagement models, process, industries;
  GGP the Creative Production service and showreel frames). Links: `/#<place>`, `/#<place>/<room>`, aliases.

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
- `app/layout.tsx` renders `components/experience/Experience.tsx` once for every page, so the canvas persists across
  page changes; each page (`app/page.tsx`, `app/[company]/page.tsx`) adds its metadata and JSON-LD only. The journey
  is chosen from the path (`journeyFor`, `setJourney` in `components/experience/route.ts`: live bindings, so the
  locked engine reads the active journey's `LAST` and route data unchanged). Portal links call `cross()`
  (`threshold.ts`): the world pushes on, the next world's haze rises, the page changes.
- All real text is server-rendered HTML in `Scenes.tsx` / `SceneItems.tsx` (items: card, head, voice, callouts, pins,
  numerals, arc, list, button, onward, closing), anchored to world points (`stage/layout.ts` `anchorFor`, onto
  collider surfaces when a splat world's collider is loaded) and projected every frame. Text drawn in 3D (troika)
  keeps a visually hidden DOM copy. Field-guide pages: `FieldGuide.tsx`.
- The 3D stage (`components/experience/stage/*`) is `dynamic(..., { ssr: false })` and mounts after the gate.
  Worlds: splat worlds (`stage/Splats.tsx`, manifest `lib/worlds.ts`, files from `scripts/v5/worlds.mjs`) stream in
  two places ahead and unload two behind; until a world arrives, `Backdrop` → `DepthPlate` dioramas; hand-built sets
  in `stage/sets/*` add 3D foreground and the in-world text; `Threshold.tsx` covers splat-world handovers.
- Everything behind the gate is `inert` until the film is live; then focus moves to the title.
- The route position `s` (in `rtRef`) is the single source of truth; per-frame values go through refs, never React
  state. One shared animation loop (`components/film/loop.ts`): the R3F canvas (`frameloop="never"`) is advanced
  first, then the ink and the shell.
- All copy in `content/*.ts`; v5 UI labels in `content/journey.ts`, company page copy in `content/companies.ts`,
  `content/pages.ts`; C3 punctuation is applied at render (`c3`).
- Weak devices / no WebGL 2 get the still version (`is-still`, preview with `?still`). `?tune` exposes test hooks;
  `?author` is the free-fly route-authoring camera; `?splat=test` shows the pipeline test splat world.

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
- v5: `node scripts/v5/shots.mjs <dir> [--path /aurelius] [--places 0,1.5,3] [--mobile] [--q splat=test]` (screens
  at holds), `scripts/v5/sheets.mjs <shots> <out>` (side by side with the references), `scripts/v5/probe.mjs '<js>'`,
  `scripts/v5/plates.mjs` (plates → WebP), `scripts/v5/depth.py` (depth maps; needs an onnxruntime venv and the
  Depth Anything V2 Small ONNX), `scripts/v5/worlds.mjs` (splat worlds in), `scripts/v5/hold-times.mjs`
- `node scripts/research/xp-check.mjs <outDir> [--w 390 --h 844 --touch] [--dark] [--reduced] [--still]` — screenshot
  every place (needs the research Chrome on port 9555 and `pnpm start`-style server on 4174)
- `node scripts/research/xp-interact.mjs <outDir> [...]` — every interaction and room; `xp-keyboard.mjs` — keyboard
  and screen-reader pass; `gpu-time.mjs` — GPU and script time per frame at each place
- Frame-time checks need mains power: on low battery Chrome caps headless at 30 fps (check a blank page first).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
