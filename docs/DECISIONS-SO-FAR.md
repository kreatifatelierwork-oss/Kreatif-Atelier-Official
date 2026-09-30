# Decisions so far

The single list of what the user has decided, in force as of 2026-09-30. Newer decisions override older ones.
Items marked **OPEN** are waiting for the user.

## Standing rules (never overridden)
- **No logo, crest, emblem, monogram, "KA" mark or placeholder** anywhere: not in the nav, loader, 3D scene, footer
  or favicon. Brand presence is the words "Kreatif Atelier" set in type, plus the ✦ motif. The favicon is a gold ✦
  on navy.
- **Don't invent facts, clients, stats, testimonials or services.** New wording is shown to the user before it
  ships, marked PROPOSED in content files.
- **Ported copy stays word for word** (live site and company chart). Punctuation: see OPEN C3.
- **Accessibility and reduced motion are mandatory:** keyboard reachable, visible focus, real HTML text (never
  only in the canvas).
- **Performance:** mobile Lighthouse Performance ≥ 70 (currently 93 on /film), Accessibility ≥ 95, SEO 100.
- **Assets:** commercially licensed only, logged in `docs/ASSETS.md`.
- **Mailto CTA:** `hello@kreatifatelier.com`, subject "Free Brand Audit Request". Social URLs stay empty until
  given; "@kreatifatelier" shows as plain text.
- **Pricing:** prices exactly as on the live site (₹25–35K / ₹55–75K / ₹1–1.5L). No "Enquire" button.
- **Commits:** commit after each phase. `main` holds the old build and stays untouched; redesign work is on
  `redesign-v2`.
- **Reference sites:** don't copy their code, models, imagery, sound or signature designs.
- **Workflow:** work in phases, propose before big changes, stop at checkpoints.

## Direction
- **2026-09-29:** a full creative redesign on `redesign-v2`, researching Oryzo, Ivress, Lacoste, Shopify Editions,
  igloo.inc, the TURA layout reference and a 31-site 3D survey.
- **2026-09-29:** "The Long Take" (orrery) became the home page. It was then superseded by the request for a
  bigger story than "a holding company with verticals".
- **2026-09-30:** **"The Making of a Legacy" approved** (docs/concepts/THE-MAKING-OF.md), with these answers:
  1. **Sound:** a generated score, silent until "Enter with sound", with a mute toggle always visible. No
     voiceover for now.
  2. **New wording approved for now:** the act names (Idea, Strategy, Story, Movement, People, Futures,
     Legacy); "Enter with sound / Enter in silence"; "Watch / Direct"; "A Kreatif Atelier film".
  3. **Pricing:** the tiers appear in the credits with prices exactly as they are.
  4. **Extra font:** IBM Plex Mono for technical readouts.
  5. **Palettes:** keep both, **light as the default**. See OPEN C1.
- **2026-09-30:** **buttermax.net** is the reference for the **opening sequence** (beat for beat in structure,
  timing and feel) and for the **cursor behaviour after the opening** (colour change + object movement). Our own
  implementation and visuals; the sound gate may sit in the rhythm. Phones get an equally good touch version;
  reduced motion gets a calm version. Checkpoint 1 is built at `/film/` (commit 6e75291).
- **2026-09-30:** **design sources of truth adopted:** the image-to-code SKILL.md, taste-skill,
  awesome-design-md and playwright-cli. They override earlier design choices where they conflict, except the
  standing rules. **Image-first from now on:** images are generated (by the user in ChatGPT, from
  `docs/design/IMAGE-PROMPTS.md`) into `design-refs/`, analysed, and then implemented. Playwright CLI is used for
  all visual checks.
- **2026-09-30:** **don't build anything new** until the user approves the design philosophy, the conflicts and the
  revised proposal.

## Earlier decisions still in force (from the first build, where not superseded)
- **Domain:** `https://kreatifatelier.com` for metadata. Hosting is decided later.
- **Founding year:** no "Est." line until confirmed. The footer year comes from the current date.
- **Founder photos:** the four portraits. Transparent cut-outs were made and work cleanly on light mounts; the
  originals are kept.
- **Stack:** Next.js static export, React Three Fiber / drei / postprocessing, Tailwind, pnpm, webpack build.

## OPEN: waiting for the user
- **C1–C9:** the design conflicts in `docs/design/AUDIT.md` §4 (theme default, the HUD, punctuation, the TURA
  furniture, house colours, fonts, glow, the flood rim).
- **The "unified-idea proposal" message:** referred to by the user on 2026-09-30, but **not received in this
  session.** The revised proposal (`docs/concepts/THE-MAKING-OF-v2.md`) is therefore based on "The Making of a
  Legacy" plus the buttermax checkpoint. If that message had further goals, they need re-sending.
- **Engagement Models:** keep the prices, or replace them with "Custom quote" (earlier open item).
- **/concepts:** delete before launch (recommended).
