# Kreatif Atelier — "The Long Take"

## What this project is
The website for **Kreatif Atelier, a creative holding company** ("Ideas | People | Impact") and its five verticals.
It is built as **The Long Take**: one continuous, cinematic 3D camera shot through a luminous orrery. The holding
company is the radiant **core**; the five verticals are **worlds** on a golden ring around it, each with its own
signature colour and sculpture. The site plays like a film in **eight reels** with a timeline, and every reel is
reachable directly.

Branch: all redesign work lives on **`redesign-v2`**. `main` holds the previous (superseded) build — leave it untouched.
Build plan: `docs/concepts/LONG-TAKE-PLAN.md`. Concept: `docs/concepts/LONG-TAKE.md`. Research: `docs/research/`.

## The structure (source of truth: `content/verticals.ts`, transcribed exactly from the company chart)
- **Kreatif Atelier** — a creative holding company. "A creative holding ecosystem for a better tomorrow."
  "Multiple verticals. One vision. Exponential impact." "Disciplines today. A brighter tomorrow."
  Vision, pillars (Creativity · Education · Production · Wellbeing · Technology), "Our ecosystem serves", "Impact".
- Five verticals (name — tagline — signature colour — sculpture):
  1. **Aurelius** — Brands. Strategy. Growth. — royal indigo — a rising spiral of slabs
  2. **Valora** — People. Skills. Opportunities. — sunrise coral — an arch built from many tiles (a bridge)
  3. **Golden Guardian Productions** — Stories. Visuals. Impact. — cinema magenta — an iris aperture + projection
  4. **Rudra Yugen** — Innovation. Culture. Futures. — electric cyan — a glowing lattice around a glass core
  5. **Asraya** — People. Balance. Wellbeing. — fresh jade — a balanced cairn over ripples
- The old "four divisions" (incl. Zenith Chapter) are gone. Old services/pricing/process are not part of the journey.

## The journey (reels)
00 Core → 01 Aurelius → 02 Valora → 03 Golden Guardian Productions → 04 Rudra Yugen → 05 Asraya → 06 Ecosystem → 07 Contact.
Each vertical reel: name huge (headline), tagline as microtype eyebrow, value line as caption, the four "what we do"
items as labels attached to the sculpture, and one playful interaction (raise / bridge / roll / spark / breathe).
Transitions: the camera swings out on a wide arc through haze of the next world's colour (fog + depth of field +
text dissolving). **No hard cuts** except in reduced motion.

## Visual direction
- **Light, radiant, vibrant.** Two palettes, `?palette=a|b`: **A (default)** pale luminous skies tinted by each world,
  vivid glossy sculptures; **B** deep world hues lit by glowing colour. Gold = the connecting metal/light (ring, core,
  accents), not the whole palette. Colours live in `lib/config.ts` → `longTakeConfig.worlds`.
- Blur, depth of field, frosted glass and bloom — always bright (colour haze), never moody darkness.
- Lighting: Poly Haven "Photo Studio 01" HDRI (`public/hdri/`) as **reflection environment only, never visible**, plus
  Lightformer highlights. 1K version for phones.
- Layout language (from the TURA reference): framed edge furniture (KREATIF / ATELIER in type top-left, two links
  top-right, motto on the left edge, Scroll cue on the right edge, reel timeline as the section index along the bottom),
  one focal point per screen, huge headline + tiny wide-tracked microtype.
- Type: Outfit (headlines), Manrope (microtype/body), Cormorant Garamond italic (statements). All self-hosted.
- Sculptures are original, procedural, abstract. They must never read as logos. Do not reproduce the chart's monogram
  or its per-vertical icons (column, swan, clapperboard, flame, lotus).

## Tech stack (do not swap without asking)
- Next.js (App Router, TypeScript), `output: 'export'` (static), webpack build
- React Three Fiber + drei + @react-three/postprocessing; one `<Canvas>` for the whole experience, lazy-loaded
- Framer Motion for DOM transitions; Tailwind + CSS variables; zustand where shared state is needed
- pnpm

## Architecture rules
- Home = `app/page.tsx` → `components/longtake/*`. The DOM shell (all real text, headings, timeline, menus) is
  server-rendered; the 3D stage is `dynamic(..., { ssr: false })`.
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
- Commercially licensed assets only, logged in `docs/ASSETS.md`. No sound or video in the current build.

## Workflow rules for Claude
- Work in phases; after each: `pnpm build`, fix type/lint errors, check at 1440 and 390 (headless Chrome with WebGL via
  `scripts/research/rc.mjs` / `capture-longtake.mjs`), commit with a clear message.
- Tunables go in `lib/config.ts`. Keep components small.

## Commands
- `pnpm dev` — local dev at http://localhost:3000
- `pnpm build` — static export to `/out` (runs `next build --webpack`; keep webpack for now)
- `pnpm lint` · `pnpm typecheck`
- `pnpm start` — serve `/out` locally with compression (use this for Lighthouse)
- `pnpm images <dir>` — rebuild founder portraits from PNGs in `<dir>`
- `node scripts/research/capture-longtake.mjs <baseUrl> <outDir>` — screenshot every reel, both palettes, 1440/390
