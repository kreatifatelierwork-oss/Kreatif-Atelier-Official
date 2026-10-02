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
- [x] 3. World art (e5a998b … 5c947c9): every place built, interactions and rooms verified at 1440
      (scripts/research/xp-interact.mjs), dark theme and 390 screenshots reviewed. GPU 2–8 ms + script ~3 ms per frame
      (scripts/research/gpu-time.mjs).
- [ ] 4. Remaining polish: phone rooms check, the still version (?still test hook), reduced motion pass, 1366×768.
- [ ] 5. QA + proof: Lighthouse (mobile/desktop), keyboard and screen reader pass, final baseline comparison
      (nav-record.mjs + nav-compare.py; ink-record.mjs --ink-only + ink-measure/compare; ink-hz.mjs --out +
      ink-hz-compare.mjs), `git diff 79d5ed6 -- <frozen files>` (only the ?tune hooks), screenshots, report.
      The machine was on battery at 14%: Chrome caps frames at 30 fps then; re-run frame-time checks on mains power.

## Where I stopped (2026-10-02, battery at 3%)
- Done since 5c947c9: forms built in a worker (mobile Lighthouse 95 / 100 / 100 / 100, desktop 96 / 100 / 100 / 100),
  still version (?still), 390 + 1366 checks, keyboard + screen-reader pass (gate now inert-correct), hash follows
  the settled place.
- Proof so far: frozen files byte-identical to 164e7d2 (`git diff 164e7d2 -- journey.ts useInput.ts CameraRig.tsx
  components/film/ink components/film/loop.ts` is empty; experienceConfig and filmConfig.ink hash-identical). Ink
  masks baseline-vs-final match final-vs-final run noise (docs/research/final/inkhz-final*.json).
- NOT valid yet: the navigation recording (docs/research/final/nav-final.json). The Mac was at 3% battery: frames
  capped at 30 fps and script work throttled ×6, so step timings drifted. Re-run on mains power:
  `node scripts/research/nav-record.mjs docs/research/final/nav-final.json --url http://localhost:4174/` then
  `python3 scripts/research/nav-compare.py docs/research/baseline/nav-baseline.json docs/research/final/nav-final.json docs/research/final/nav-compare.png`
  (close any leftover localhost pages in the research Chrome first).
- Still to do: the 13-stroke ink test on / (`ink-record.mjs ours docs/research/final/ink-final --url "http://localhost:4174/?tune" --ink-only`,
  then ink-measure + ink-compare against docs/research/baseline/ink-baseline.json); final screenshots of every place
  at 1440 and 390, light and dark; update CLAUDE.md for the new structure; the report.
