# Scrubbing the film: which method (measured 2026-10-09)

Test: 16 s of film (temporary clips c01+c02, 1280 × 720, 24 fps, 384 frames) scrubbed in the research Chrome (Apple
M4, GPU) along a scroll-like path: eased runs forwards and back over the whole 16 s, fast flicks, slow drags and
jitter, 16 s of display at 60 Hz (about 960 display frames). Per display frame: the frame asked for vs the frame on
screen. Lab: `scripts/v5/scrub-lab.html` + `scrub-lab.mjs`.

| Method | Size (16 s) | Lag p50 / p95 / max (frames) | Display frames stuck on an old frame |
|---|---|---|---|
| `<video>` all-intra H.264 (keyint 1), `currentTime` seeks | 20.6 MB | 2 / 6–7 / 9 | 31–36 |
| `<video>` short-GOP H.264 (keyint 8), `currentTime` seeks | 9.0 MB | 2 / 6 / 9 | 31–34 |
| JPEG sequence, `createImageBitmap` on demand (decode ≈ 5 ms) | 53 MB (WebP q72: 35 MB) | 0 / 2 / 6 | 2 |
| **WebCodecs, short-GOP raw H.264 (keyint 12, no B-frames), decoded ahead around the playhead** | **6.5 MB** | **0 / 1 / 1** | **2** |

Decision: **WebCodecs on short-GOP H.264**: the most exact scrubbing at about a fifth of the size of an image
sequence. The decoder keeps a window of decoded frames around the playhead (36 frames ahead in the direction of
travel, 18 behind, about 96 cached), one group of frames decoded at a time; the frame on screen is always the nearest
decoded frame, so nothing ever blanks. Browsers without WebCodecs (and reduced motion, and the still version) show the
poster still of the nearest place with the same text.
