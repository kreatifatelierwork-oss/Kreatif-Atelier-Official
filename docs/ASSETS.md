# Asset log

Every third-party asset used in the site, with its source and licence. Only licences that allow
commercial use (CC0, CC-BY with attribution, OFL for fonts, or explicit commercial licences).

| Asset | File(s) | Source | Licence | Notes |
|---|---|---|---|---|
| Cormorant Garamond (variable) | `node_modules/@fontsource-variable/cormorant-garamond` | Google Fonts via Fontsource | SIL OFL 1.1 | Display serif |
| Manrope (variable) | `node_modules/@fontsource-variable/manrope` | Google Fonts via Fontsource | SIL OFL 1.1 | Body / UI |
| Outfit (variable + 700 WOFF) — headline sans test | `node_modules/@fontsource-variable/outfit`, `public/fonts/outfit-700.woff` | Google Fonts via Fontsource | SIL OFL 1.1 | Free stand-in for Cera (geometric sans) in the `?type=sans` test |
| Cormorant Garamond 500 / 400 italic WOFF (3D text) | `public/fonts/cormorant-garamond-*.woff` | Google Fonts via Fontsource | SIL OFL 1.1 | For troika 3D text (needs WOFF, not WOFF2) |
| Photo Studio 01 HDRI (2K original + 1K derivative) | `public/hdri/photo_studio_01_2k.hdr`, `public/hdri/photo_studio_01_1k.hdr` | Poly Haven — https://polyhaven.com/a/photo_studio_01 (added by the client) | CC0 | Reflection/lighting environment only (never shown as background). 1K made with `scripts/hdr-downsample.py` for phones |
| Founder cut-outs | `public/images/founders/*-cutout.webp` (masters: `assets/founders-cutout/*.png`) | Derived from the client-owned portraits with `scripts/cutout-founders.py` (no third-party model) | Client-owned | Transparent backgrounds; shown on pearl portrait cards |
| Founder portraits | `public/images/founders/*.webp` | kreatifatelier.com (client-owned) | Client-owned | Resized with `pnpm images` |

_No third-party 3D models, textures, sounds or video are used. No audio or video in the current build._
