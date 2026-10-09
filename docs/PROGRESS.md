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

## Finished (2026-10-03, on mains power; browser verified at 16.7 ms frames on a blank page first)
- **Navigation vs baseline** (`docs/research/final/nav-final.json`, chart `nav-compare.png`): every scripted step lands
  at the same moment (within 10 ms); route position differs by 0.004 place on average (max 0.15 during a fast move,
  from ~10 ms event timing). Frames: 2864, all 16.7 ms, none over 20 ms.
- **Ink vs baseline** (`ink-final.json`, sheet `ink-baseline-vs-final.png`): fade curves identical to within a few
  percent; width, slide distance and edge sharpness the same; first-ink within one or two capture frames. Ink masks
  (`inkhz-final*.json`): baseline-vs-final differences equal final-vs-final run noise. Frozen files byte-identical.
- **Drawing frame times** with the full world visible: 3703 frames ×2 runs, all 16.7 ms, none over 20 ms. Phone
  (390, touch, CPU 4× slower): 1761 frames, none over 20 ms.
- **Lighthouse:** mobile 95 / 100 / 100 / 100, desktop 96 / 100 / 100 / 100 (Performance / Accessibility / Best
  Practices / SEO).
- **Screenshots:** `docs/research/final/sheet-*.png` (places and rooms, 1440 and 390, light and dark).
- Wording approved by the user 2026-10-03 (title, description, Credits / Post-credits, screen-reader labels).

## v5 (2026-10-05): data/feel split, step 1 (current place data moved unchanged)
- `lib/config.ts` keeps only the locked feel as `experienceFeel`; the per-place lists (holdSeconds, camera, anchors,
  colour, atmosphere) moved unchanged to `lib/route-data.ts`; `lib/experience.ts` merges them as `experienceConfig`.
  Readers (incl. locked journey.ts, CameraRig.tsx, useInput.ts) changed only their import line.
- Proof against the fresh baseline (`docs/research/baseline-v5/`, recorded on AC power):
  - engine trace (`scripts/research/engine-trace.mjs`, 11 scripted inputs, fixed 60 Hz): IDENTICAL.
  - browser nav: mean |Δs| 0.013 / 0.015 places over two runs; same-code cross-session noise is 0.027 (v3 baseline vs
    v5 baseline), run-to-run in one session 0.003. All frames 16.7 ms (0 over 20 ms).
  - ink 13 strokes: rim, fade curves, drift match within noise; ink-hz IoU slow 0.998-0.999, flick 0.93-1.00,
    circle 0.992-0.999 (same range as baseline-vs-v3).
- Next: step 2 replaces route-data.ts with the v5 12-chapter route.

## v5 chapters 1–4 (2026-10-05): built, NOT yet at checkpoint quality
- Commits: 7811f08 (chapters 1–4 world + text system) + this one (phone layout fixes).
- Engine trace vs baseline-v5: IDENTICAL. Locked files changed only in their import line (journey.ts, useInput.ts,
  CameraRig.tsx); ink and loop untouched.
- Still to do before the checkpoint report:
  - H07/H08 canopy still stylised;
  - H13 atlas is a stylised relief;
  - phone pillar labels are small;
  - side-by-side sheets vs references at 1440/390;
  - frame times on AC power (the Mac is on battery now);
  - browser nav + ink re-run.
- Tools: `node scripts/v5/shots.mjs <dir> [--mobile] --places 0,1,…` and `scripts/v5/probe.mjs`. Needs `pnpm build`,
  `pnpm dlx serve@14 out -l 4174` and the research Chrome on 9555.

## v5 feedback round (2026-10-05): step (a) done
- Text stays: no fades or blur on DOM text; a wipe reveal from 0.72 places before a hold to 0.62 after; Watch holds
  long enough to read each place twice (scripts/v5/hold-times.mjs). Text is on screen at every point of the route.
- Five company pages: /aurelius, /golden-guardian-productions, /valora, /asraya, /rudra-yugen (app/[company]),
  each with its own title, description, share image and JSON-LD; sitemap updated. The experience moved into the
  layout, so the canvas persists across pages (verified: same canvas element after crossing).
- Journeys: components/experience/journeys/{home,companies,index}.ts; route.ts holds the active journey as live
  bindings (the locked engine reads LAST/X unchanged). Engine trace still IDENTICAL.
- Portal crossing: the world pushes on, the next world's haze rises, the page changes, the haze clears at the start.
- PROPOSED copy waiting for approval: content/companies.ts (offering paragraphs for Valora, Asraya, Rudra Yugen;
  chapter names; the Enquire subject) and content/pages.ts (company page titles and descriptions).
- Next: step (b) Spark + streaming/stitching + depth-mesh fallback.

## v5 feedback round: step (b) done (2026-10-05)
- Spark 2.3.1 (`@sparkjsdev/spark`), loaded only when a splat world is in use. `components/experience/stage/Splats.tsx`:
  one SparkRenderer (phones: lodSplatScale 0.5), `SplatWorld` streams in two places ahead and is disposed two places
  behind; `.rad` files stream LoD pages (`paged`), `.spz` builds LoD in a worker. Spark's own depth of field over
  splats (the post-process depth of field can't see them: no depth writes).
- `lib/worlds.ts`: the w01–w17 manifest (journey, places, transform, threshold); `scripts/v5/worlds.mjs` brings
  design-refs/worlds/*.spz (+ -collider.glb) into public/v5/worlds and lib/worlds.files.json. `.rad` conversion
  needs Spark's Rust build-lod tool: set SPARK_REPO to a built Spark checkout (Rust is not installed on this Mac).
- Pipeline proven with a test splat world (`?splat=test`): the jungle plate + depth as 586k Gaussian splats written by
  `scripts/v5/test-splat.mjs` (own SPZ encoder), loaded and rendered by Spark on the route.
- Thresholds (`stage/Threshold.tsx`): leaf ring, rock ring, water surface, ice ring, cloud banks at each splat world's
  handover. Colliders: text anchors raycast onto the world's collider surface when one is loaded (`stage/layout.ts`).
- Depth-mesh fallback (`stage/DepthPlate.tsx`): Depth Anything V2 Small depth maps (`scripts/v5/depth.py`, ONNX, CPU)
  for every plate; plates become deep displaced dioramas until each splat arrives.
- `?author`: free-fly camera over the same engine (WASD/RF, drag to look, P logs a route-data pose, Esc returns);
  `__worlds.set(id, {position, rotation, scale})` places a splat world live.
- Engine trace: IDENTICAL. Disk: deleted old v3 ink-tuning frame captures and .next/cache (≈2.4 GB) when free space
  fell to 4 GB.
- Next: step (c) — waiting for design-refs/worlds/w01-w03 from World Labs Marble.

## 2026-10-06: while waiting for the worlds
- CLAUDE.md rewritten for v5 (decisions of 2026-10-05, structure, architecture, commands); asset log updated.
- Re-study of igloo.inc and oryzo.ai (`docs/research/v5-restudy.md`): Oryzo keeps a line readable for a median
  1,300 px of scroll (p90 2,400); ours ≈ 1,200 px fully visible plus wipes, with read-twice Watch holds. Handover rule
  taken from Igloo: the threshold must cover nearly the whole frame for a moment; add route props that pass at 1–3 m.
- Depth fallback fixes: plate edges dissolve into the sky; the sky above each plate's horizon stays far (no cloud
  ceiling over H11/H12); cloud floor for the peaks; the H08 words no longer leak into H09.
- Still waiting: design-refs/worlds/w01–w03 (then `node scripts/v5/worlds.mjs`, place, stitch, author, checkpoint).

## 2026-10-09: the film rebuild (user's NEW APPROACH)
- Step 1 done: `docs/AUDIT-v5.md` (recorded full scrolls of home + all company pages at 1440 wheel and 390 touch;
  contact sheets in `docs/audit-v5/`, videos local). Must-not-repeat checklist at its end.
- Shot list saved: `docs/design/FILM-SHOTLIST.md`.
- Scrub method measured (`docs/research/film-scrub.md`): WebCodecs on short-GOP raw H.264 with look-ahead decoding
  beats `<video>` seeking and image sequences (lag p95 1 frame, 2 stalls, ~1/5 the size of a sequence).
- Pipeline `scripts/v5/film.mjs`: encodes each clip (desktop 1440×810, phone 608×1080 centre crop, keyint 12, no
  B-frames), frame indexes, poster stills of every keyframe, seam check (last frame vs next first frame),
  `lib/film.files.json`. Film media in `public/v5/film/` is generated and gitignored (upload with the site).
  ffmpeg comes from `ffmpeg-static` (binary fetched with curl; its install script is blocked by pnpm).
- Player `components/cinema/engine.ts` + `Film.tsx`: place → keyframe mapping per journey (`journey.film.places`);
  the locked engine's `s` drives the playhead; nearest decoded frame always drawn (never blank); keyframe-first decode
  on fast moves; posters where no clip yet, for reduced motion and the still version (no WebCodecs / weak device).
- Text layer `components/cinema/TextLayer.tsx`: one page of blocks moving over the film at scroll speed, pinned at each
  place, never overlapping, no fades/blur, no lines; serif headlines + one body style.
- Retired from the build (in git history): the 3D stage, splats, dioramas, plates, procedural sets, the 3D fonts, the
  world tools. `stage/CameraRig.tsx` (locked) and `stage/layout.ts` stay in the repo, unmounted.
- Testing with TEMPORARY clips c01–c12 (`scripts/v5/temp-clips.mjs`, from the reference frames with their baked
  text: the live text therefore doubles them; the user's clean clips will not). Seams 0.7/255 (encoding noise).
- Engine trace IDENTICAL; locked files changed only in their import line since v3.
- Step 5 crossing done: a portal link on the home film plays the page's portal clip in real time on its own canvas
  (`components/cinema/portal.ts`) while the page changes underneath on the persistent canvas; it lifts once the new
  page's film has drawn its first keyframe (= the portal's last frame). Tested with a temporary p-aurelius
  (`scripts/research/portal-check.mjs`): page changed at once, portal ~4 s, handover clean, no errors. Pages without a
  portal clip, Next and Back to the Atlas keep the haze crossing; reduced motion cuts.
- Not yet done for the checkpoint: phone and reduced-motion passes,
  and the recorded round trip with frame-time stats ON MAINS POWER (on battery at 23% the harness crawls; in-page
  the loop ran 60 fps with no long tasks). Then the user's c01–c12.
