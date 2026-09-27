# Kreatif Atelier — 3D Website Rebuild

## What this project is
A full redesign of https://kreatifatelier.com as an immersive, scroll-driven 3D website.
The current site is a single long page. We keep its content and information architecture,
but rebuild the experience from scratch: one persistent WebGL scene that choreographs with
scroll, a custom interactive cursor, and editorial typography on top.

Brand line: **Bold · Radiant · Timeless.**
Positioning: "Where Strategy Meets Story. Where Story Becomes Legacy."
Full-spectrum creative agency, Hyderabad. Four divisions. Six service pillars.

## Tech stack (do not swap without asking)
- Next.js (App Router, TypeScript), `output: 'export'` so it deploys as static files anywhere
- React Three Fiber + @react-three/drei + @react-three/postprocessing for 3D
- GSAP + ScrollTrigger for scroll choreography (use `@gsap/react` `useGSAP`)
- Lenis for smooth scrolling, synced to GSAP's ticker
- Tailwind CSS for layout; CSS variables for brand tokens
- Framer Motion only for small DOM UI transitions (modals, menus) — not for scroll
- pnpm as package manager

## Architecture rules
- ONE `<Canvas>` for the whole site, fixed behind the DOM (`position: fixed; inset: 0; z-index: 0`).
  Sections are normal DOM on top. Do not mount a Canvas per section.
- Scroll progress is the single source of truth: a small store (zustand) holds
  `progress` (0–1 for the page) and `activeSection`. 3D objects read from it in `useFrame`.
  Never read `window.scrollY` inside `useFrame`.
- Each section has a matching "scene state" (camera position/target, object poses, colors).
  Scene transitions are interpolated between states, not hard-cut.
- Lazy-load the Canvas (`dynamic(() => import(...), { ssr: false })`) and show a
  branded loader until assets are ready.
- All geometry is procedural or from `/public/models` (glTF + Draco/Meshopt). No random CDN assets.
- Keep components small: `components/three/*`, `components/sections/*`, `components/cursor/*`,
  `lib/scroll/*`, `content/*.ts` (all copy lives in content files, not in JSX).

## Design direction
- Palette (tokens in `app/globals.css`):
  - `--ink` deep navy-black `#0B0F1A` (background)
  - `--navy` `#14213D`
  - `--gold` `#C9A45C` (primary accent), `--gold-bright` `#E8C98A`
  - `--bronze` `#8C6A3F`
  - `--cream` `#F3EBDD` (text on dark)
  - `--crimson` `#7A1E2B` (rare accent only)
- Materials: brushed/liquid gold, dark glass, subtle film grain. Lighting is moody and
  cinematic — one warm key light, a cool rim, environment map for reflections.
- Typography: a high-contrast serif display face for headlines (e.g. "Cormorant Garamond" or
  "Playfair Display") + a clean grotesk for body/UI (e.g. "Inter" or "Manrope"). Load via
  `next/font`. Italic serif for the emphasised half of headlines (current site does this:
  "We build brands that *actually move people.*").
- The ✦ star glyph is a brand motif — reuse it for section markers and cursor states.
- Feel: premium, heraldic, cinematic. Not neon, not cyberpunk, not generic "AI gradient blob".

## Signature 3D ideas (the scene storyboard)
1. Hero — an abstract liquid-gold sculpture (a flowing, slowly morphing ribbon/knot form
   with noise displacement) floating in dark space, reacting to cursor position. Gold dust
   particles drift around it. It is NOT a logo, crest, emblem or monogram.
2. About — sculpture dissolves into particles that re-form as a field; camera drifts forward.
3. Services ("Six pillars of creative power") — six literal gold/obsidian pillars rise
   from the floor; camera tracks past them as you scroll; hovering a service card lights
   its pillar. Click opens the service detail overlay.
4. Engagement models — three stacked glass tiers (Starter / Growth / Brand Partner).
5. Founders — four portrait cards in DOM with subtle 3D tilt; 3D scene calms down here.
6. Ecosystem — four orbiting spheres (one per division: Kreatif Atelier, Golden Guardian
   Productions, Zenith Chapter, Asraya) around a central core; scroll rotates the orbit so
   each division comes to the front in turn. Label them with full names as plain text.
7. Process — a glowing gold path/ribbon the camera travels along, five waypoints = five steps.
8. Industries — a slow 3D ring/marquee of industry names.
9. Contact — scene resolves back to the gold sculpture, brighter; CTA is the focal point.

## Cursor
- Custom cursor: small dot + trailing ring (lerped). Hidden on touch devices.
- States: default, hover-link (ring grows), hover-3D (✦ star), dragging, text (thin bar).
- Magnetic pull on primary buttons.
- Click = gold ripple ring in DOM + a shockwave/impulse sent into the 3D scene
  (particles push away from the click point, raycast from cursor into the scene;
  the nearest object reacts — pillars ring, sculpture pulses, orbit spheres wobble).

## Non-negotiables
- `prefers-reduced-motion`: disable scroll-scrubbed camera moves and particle bursts,
  keep a static but still beautiful hero render. Lenis off.
- Mobile: DPR capped at 1.5, particle counts reduced ~70%, postprocessing simplified,
  custom cursor disabled. Must hold ~60fps on a mid-range Android.
- Use `drei`'s `PerformanceMonitor` / `AdaptiveDpr` to degrade gracefully.
- Lighthouse targets on the deployed build: Performance ≥ 80 mobile, Accessibility ≥ 95,
  SEO 100. All copy is real HTML text (never baked into the canvas).
- Every interactive element is keyboard-reachable with visible focus styles.
- No layout shift from fonts or the canvas.

## Content
- Source of truth for copy: the current live site https://kreatifatelier.com. Port all
  copy into `content/*.ts`. Do not invent services, clients, stats, or testimonials.
- Founder photos: `https://kreatifatelier.com/images/Gourish_Formal1.png`,
  `Rohan_Formal1.png`, `Anwesha_Formal.png`, `Aritra_Formal1.png` → save into
  `/public/images/founders/` and serve with `next/image` (unoptimized for static export).
- Contact: hello@kreatifatelier.com · @kreatifatelier (Instagram, LinkedIn).

## Open decisions (ask before changing)
- Engagement Models section shows prices (₹25–35K / ₹55–75K / ₹1–1.5L). Keep as-is for now;
  the team may replace with "Custom quote".
- Founding year is inconsistent (site says Est. 2024, footer © 2025). Footer year should be
  generated from the current date; leave "Est." line out until confirmed.

### Decided (2026-09-27)
- Build plan approved: `~/.claude/plans/pasted-content-id-dce5-read-claude-md-polished-crystal.md`
  (storyboard, scroll pipeline, impulse system, phases, content appendix).
- Why Us (between Ecosystem and Process) 3D transition: the orbits flatten into concentric
  gold rings and the outer ring unspools into the Process ribbon.
- Fonts: Cormorant Garamond (headings/display, italic for emphasis) + Manrope (body/UI).
  Playfair Display, Cinzel and Outfit from the live site are dropped.
- Social: show "@kreatifatelier" as plain text. `content/site.ts` holds `instagramUrl` and
  `linkedinUrl` as empty strings; when a URL is filled in, the matching handle/label renders
  as a link automatically. No `#` placeholder links.
- CTA "Schedule Your Free Brand Audit ✦" → `mailto:hello@kreatifatelier.com` with subject
  "Free Brand Audit Request".
- Pricing cards: prices exactly as on the live site. No "Enquire" button.
- Domain: `https://kreatifatelier.com` for metadataBase, canonical and sitemap. Hosting is
  decided later — do not set up deployment.
- Nav: keep the live items as-is (About, Services, Founders, Ecosystem, Process, Work With Us).
- Ported copy stays word for word. Do not rewrite or "improve" it.
- Monograms from the live site (nav "KA", division badges KA/GGP/ZC/AS) are removed; full
  names in type plus ✦ only.

## No logo — hard rule
- The logo/crest does NOT appear anywhere on the site: not in the nav, hero, 3D scene,
  loader, footer or favicon. Do not create a placeholder logo, emblem, monogram, shield or
  "KA" mark of any kind.
- Brand presence comes from typography (the words "KREATIF ATELIER" set in the display
  serif) and the ✦ motif. The favicon is a gold ✦ on navy.

## Workflow rules for Claude
- Work in phases. At the end of each phase: run `pnpm build`, fix all type/lint errors,
  summarise what changed, and list anything that needs my eyes.
- Commit after each working phase with a clear message.
- Before a big change, propose the plan first; don't rewrite working systems unasked.
- When unsure about a visual choice, build it behind a constant in `lib/config.ts` so it's
  easy to tweak (speeds, colors, particle counts, camera keyframes).
- Check the result in a real browser (Playwright MCP if available) at 1440px and 390px wide
  and look for jank, overlap, and unreadable text before calling a phase done.

## Commands
- `pnpm dev` — local dev at http://localhost:3000
- `pnpm build` — static export to `/out`
- `pnpm lint`
