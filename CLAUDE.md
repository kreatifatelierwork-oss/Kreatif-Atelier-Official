# Kreatif Atelier — "The Long Take"

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
- **The current direction** is proposed in `docs/concepts/THE-MAKING-OF-v3.md` (one unified idea: the film *is* a world
  you travel through). It is not built until approved.
- **Decisions** are collected in `docs/DECISIONS-SO-FAR.md`.
- **Built so far on `redesign-v2`:**
  - the home page is still "The Long Take" (orrery, superseded);
  - `/film` holds the opening sequence + cursor checkpoint.
- `main` holds the old build and stays untouched.

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
- Home = `app/page.tsx` → `components/longtake/*`. The DOM shell (all real text, headings, timeline, menus) is
  server-rendered; the 3D stage is `dynamic(..., { ssr: false })`.
- The stage mounts only on Begin (it compiles behind the opening white-out). Before that the loader only
  prefetches the 1K HDRI with real byte progress. This is what keeps mobile Lighthouse ≥ 90; don't mount it earlier.
- The timeline position `s` (0–7, a ref) is the single source of truth; the camera, colours, haze and text read it.
  Never read `window.scrollY` in `useFrame`. Per-frame values go through refs, not React state.
- Camera path, world placement, colours, speeds, interaction timings: `lib/config.ts` (`longTakeConfig`) and
  `components/longtake/journey.ts`. All copy in `content/*.ts` (UI labels in `content/concepts.ts` → `longTake`).
- `/concepts` keeps the earlier prototypes (noindex) for reference.

## Non-negotiables
- **No logo, crest, emblem, monogram or "KA" mark anywhere**, and no placeholder for one. Brand presence = the words
  "KREATIF ATELIER" in type and the ✦ motif. Favicon: gold ✦ on navy.
- Don't invent facts, clients, stats, testimonials or services. New wording must be shown to the user before it ships
  (flag it PROPOSED in content files).
- Mailto CTA stays (`hello@kreatifatelier.com`, subject "Free Brand Audit Request"). Social URLs stay empty until given.
- All real copy is real HTML text (never only in the canvas). Accessibility ≥ 95, SEO 100, mobile Performance ≥ 70.
- `prefers-reduced-motion`: cuts + crossfades, still sculptures, holds become presses. Keyboard reachable, visible focus.
- Phones: DPR ≤ 1.5, no depth of field, simplified effects, touch versions of every interaction.
- Weak devices / no WebGL: CSS fallback with the same reels, text and navigation.
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
- `node scripts/research/capture-longtake.mjs <baseUrl> <outDir>` — screenshot every reel, both palettes, 1440/390
