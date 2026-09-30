# Film checkpoint 1: opening sequence and base cursor

- **Built:** 2026-09-30, on `redesign-v2`.
- **Preview:** `/film/` (noindex; the home page is unchanged until you approve).
- **Reference:** `docs/research/buttermax.md`.

**Side-by-side sheets** (local only, because they contain buttermax.net frames): `docs/concepts/film-checkpoint/`.
Each compares matching moments from continuous screencasts, aligned on the start of the flood (T0).

| Sheet | Shows |
|---|---|
| `opening-1440.jpg` | Opening at 1440 px, both sites |
| `opening-390.jpg` | Opening at 390 px, both sites |
| `cursor-1440.jpg` | The same scripted cursor moves on both sites |
| `touch-390.jpg` | The same scripted touches on both sites |
| `palette-b-opening.jpg` | Our dark palette only |
| `reduced-motion.jpg` | Our reduced-motion version only |

## The opening, beat by beat (ours)

| Beat | Time | What happens (ours) |
|---|---|---|
| Glyph | 0–1.8 s | On near-black, four gold points whirl, gather into one, split to four tips and bridge into the ✦ (liquid "metaball" join) |
| Gate | from 1.9 s | "Enter with sound" / "Enter in silence" appear under the ✦ and wait |
| Dip | on choice, 0.35 s fade + 0.15 s hold | The glyph fades to near-black. The 3D stage starts compiling behind it, and the flood waits for its first frames (cap 3.5 s) |
| Flood (T0) | 0–0.75 s | Halftone dots appear at the centre, tinted in the five houses' colours. They swell, bridge along slanted rows into wavy bands and flood the screen with the page colour, while the page zooms forward from 0.6× and straightens from −6°. Palette B floods through gold first, then settles to ink-blue |
| Idea rises | +0.72 s, 0.4 s | The gold particle Idea gathers from below as a multi-coloured ghost and condenses into its form |
| Signature | +1.07 s, 0.85 s | "Atelier" is written on in italic serif after the bold "Kreatif" |
| HUD and settle | +1.9 s | Fine-print readouts fade in; everything eases to rest |
| Sound | with sound only | A soft swell under the flood, plucks as the signature writes, then a pad that follows the cursor |

## The cursor (after the opening)
- **Ink:** a GPU fluid, our own stable-fluids solver.
  - Strokes are capsules from the last pointer position to the current one, with no swirl.
  - The flow keeps moving after you stop; the ink fades in about 1.1 s (matched to the reference's measured 1.13 s).
  - It is drawn with a hard edge and a thin rim in the five houses' colours while it moves.
  - The ink **inverts whatever it covers**: pearl becomes deep ink, dark letters become light (palette B works the
    other way round).
  - It passes *behind* the Idea.
- **The Idea:** it looks at the cursor, ±20° yaw and ±10° pitch, with a two-stage follow (a quick first move, then a
  heavy 0.65 s tail). The cursor's recent motion nudges its particles.
  - **Hovering onto it** changes its form with a 0.9 s dissolve and a glass chime. There are seven forms, one per
    act; the cooldown is 4 s.
  - **Clicking it** makes it pulse.
- **Touch:** fingers paint the same ink. Tapping the Idea changes its form. The page doesn't pan (it's one screen
  for now).
- **Reduced motion:**
  - no flood (the gate simply clears) and no page zoom;
  - the signature appears instantly;
  - the ink is small, faint and slow, with no colour rim;
  - the Idea barely turns (±3°), and form changes are quick fades without the streak.
- **Sound:** a generated score. It is silent unless "Enter with sound" is chosen, and a mute toggle is always
  visible. The pad's filter follows the cursor's height and its stereo pan follows left/right; speed adds shimmer. It
  fades when the tab is hidden.

## Lighthouse (local, `/film/`)
| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Mobile | 93 | 100 | 100 | 66 |
| Desktop | 100 | 100 | 100 | 66 |

SEO is 66 only because the preview route is deliberately `noindex`; it returns to 100 when it becomes the home page.
Mobile TBT is 80 ms, LCP 3.1 s, CLS 0 and the page weight 329 KiB.
