# Progress: building the real home page (v3 "Shot on Location")

Brief: the user's message of 2026-10-01 ("The spatial navigation and the cursor are PERFECT … build the actual website").

## Locked (frozen; never edited)
- **Navigation:** `components/experience/journey.ts`, `useInput.ts`, `stage/CameraRig.tsx`, and in `lib/config.ts`
  everything in `experienceConfig` (holds, travel, wheel/touch/follow/speed/jump/snap, camera, atmosphere, enter dolly,
  parallax); the travel code in `Experience.tsx` (go / enter / leave / the frame's travel block).
- **Ink:** `components/film/ink/*`, `components/film/loop.ts`, `filmConfig.ink`, the ink canvas (layer, blend) and the
  pointer → brush wiring.
- Proof at the end: re-run the baselines below and `git diff <baseline-commit> -- <frozen files>` (empty).

## Baseline (recorded before any site work)
- `docs/research/baseline/nav-baseline.json`: scripted full-route navigation (`scripts/research/nav-record.mjs`):
  47.7 s, 2861 frames, every interval 16.7 ms (max 16.8), work p99 8.4 ms.
- `docs/research/baseline/ink-baseline.json`: the 13-stroke ink test, ink only (`ink-record.mjs --ink-only`).
- `docs/research/baseline/inkhz-baseline.json`: the deterministic ink masks at 30/60/120/144 Hz (`ink-hz.mjs`).

Baseline commit: `79d5ed6` (frozen files as of `164e7d2`, plus the ?tune test hook in Experience.tsx).

## Phases
- [x] 0. Baseline
- [x] 1. Restructure (e302d67): home = the experience, /experience redirects, /film /concepts and old code retired, SEO.
- [x] 2. Content (1134199): every section placed with real HTML, rooms, moments, founders arc, closing + footer,
      Index, act bar, interaction buttons, still version.
- [ ] 3. World art (in progress): real 3D places (Atrium, Studio, Drafting Hall + Lens + Find the angle, Projection
      Hall + Roll, Concourse + streams + Launch, Water Court + stones, Garden + Breathe, Glass Lattice + Spark, Roof +
      monument + moments), one light per place with shadows, the Idea as a ribbon changing form per act.
      Note: the test Mac was on battery (17%); Chrome's battery saver caps headless at 30 fps, so frame-time checks
      need the research Chrome started with --disable-features=BatterySaverModeAvailable (or mains power).
- [ ] 4. Polish per place against DESIGN.md (compositions, phones, dark theme), interactions verified.
- [ ] 5. QA: 1440 / 1366 / 390, light / dark, reduced motion, keyboard, screen reader, still version, Lighthouse,
      final baseline comparison, screenshots, report.
