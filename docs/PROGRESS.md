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

## Phases
- [x] 0. Baseline
