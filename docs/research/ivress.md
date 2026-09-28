# Ivress — brand.ivress.co.jp ("Spin a Tale / 紡ぐ物語")

Studied 2026-09-28 in headless Chrome with GPU WebGL (Apple M4) at 1440×813 and 390×844 (touch).
Screenshots: `docs/research/ivress/` — `d-*` desktop chapters, `m-*` phone, `i-*` the hold interaction.

## Concept and story
A corporate brand story told as a wordless fairy tale. A small traveller carrying light walks through
"a world that rejects light", meets a nameless shadow creature, gives it courage, and they journey to a
castle of transformation. The shadows multiply; together they push on; at the castle they realise the
answer is gratitude; the nameless one becomes a guide for others — and the story loops forever.
**Darkness and light are the whole visual and emotional language.** The company's values (courage,
companionship, growth through adversity, gratitude) are never listed — they're *lived* by the characters.

## Navigation model
- A single full-screen WebGL stage. Scroll is **virtual**: the page barely moves; wheel and swipe input
  advance a timeline through nine named chapters — Prologue, Encounter, Power, Oath, Bond, Trial, Expansion,
  Spiral, Ivress.
- Chapter name top-left, a big editorial counter bottom-left (`01 / 09`), the story line set **vertically**
  (tategaki) on the right, "Scroll to continue" bottom-right. Within a chapter, scroll scrubs the camera.
- Top bar: brand mark centre, SOUND toggle (animated waveform) and EN language switch right.
- The story **loops**: after the final chapter the vortex collapses and you're back at the Prologue —
  the ending *is* the brand line ("this story is spun without end").
- No menu, no section jumps — deliberately linear. Corporate links live on the last chapter.

## Pacing
Nine chapters, each roughly three scroll "beats": arrive (flash or fade), hold (a tableau with a line of
story), transition (light floods or darkness swallows). Loud transitions — full-white flash, cream-light
flood, black-out — reset the eye between chapters. The one interactive beat (Trial) sits two-thirds in,
exactly where a story's climax belongs.

## Loader and intro
1. Pure black, a tiny shadow creature with glowing eyes centre-screen, a percentage counter. The loader
   *introduces a character* instead of showing a bar.
2. One line of text on black: "This is a world that rejects light."
3. Title card over a dark, moonlit painted castle bridge: "A BRAND SITE BY IVRESS" in a tall condensed
   display face, and a round **CLICK TO START** button (TAP TO BEGIN on phones). Hovering it makes the
   distant doorway glow brighter — the scene responds before you commit.
4. Click → the title dissolves, the traveller starts walking, music begins. The click is both a dramatic
   threshold and the user gesture browsers require before audio can play.

## Notable beats and how they're likely built
| Beat | What happens | Likely technique |
|---|---|---|
| Prologue | Traveller with a lantern crosses a castle bridge | Baked-lighting GLB scene (`scene1.glb`), painterly textures, fog sprite |
| Encounter | White flash; silhouette traveller with a glowing ribbon scarf offers a light orb to a shadow creature | Silhouette characters, emissive ribbon, bloom (UnrealBloom), full-screen flash transition |
| Power / Oath | Blue particle constellations fill the sky, forming shapes | Instanced point particles morphing between shapes |
| Bond | Grey landscape; a golden trail arcs towards a distant castle | Particle trail along a curve, strong value contrast (grey world, gold path) |
| **Trial (interactive)** | Hundreds of glowing eyes. **Hold** the button: a circle of light grows from the press point, the dark scene inverts to pale grey and a hidden golden message appears; release and the dark returns | Screen-space radial mask driven by hold time; alternate lighting pass; DOM text fades in |
| Expansion | A golden castle blazes on a hill, particles radiating like a sunrise | Gold particles + light shafts + bloom |
| Spiral | A molten orange vortex swallows the scene | Swirl/distortion shader over the rendered scene |
| Ivress | The vortex shrinks into an orb floating in a nebula with planets; brand mark over the orb; corporate links | The whole world contained in a sphere — a "snow globe" ending |

## Typography
A tall, ultra-condensed display serif/sans for chapter names and the counter (very editorial, cinematic
title-card feel), a delicate Japanese mincho for the vertical story lines, tiny tracked caps for UI.
Adobe Fonts (Ryumin, Ryo Gothic) via Typekit.

## Colour
Near-black and cold moonlit blue for the "world without light"; warm gold/amber for light, hope and the
castle; one flood of pale cream at the Trial climax; molten orange for the Spiral. Colour is narrative:
gold appears only where light (courage) is present. **Very close to Kreatif Atelier's navy-and-gold — a
proof that the palette can carry drama when it's used as meaning, not decoration.**

## Motion character
Slow, weighty, filmic. Long camera pushes, silhouettes in profile like shadow puppetry, particle drifts.
Transitions are big and decisive (flash to white, black-out). Very few simultaneous motions.

## Blur and depth
Fog layers and depth haze separate planes; bloom turns every light source into a soft halo; the nebula
ending uses soft depth. Blur here is atmosphere more than lens.

## Sound (a major part of the experience)
Howler.js with: three music stems (`part_01..03`) that change across chapter groups; ambient chime loops
for particles; whoosh loops (likely tied to scroll speed); tiny UI in/out ticks; a convolution
**impulse response** so every sound sits in the same reverberant space. A visible SOUND toggle with an
animated waveform. Silence is used too.

## Cursor
Default cursor over the page; over the hold target it becomes a small black "hole" while light spreads
around it.

## Mobile adaptation
The full 3D story on phones, recomposed for portrait: chapter name moves bottom-left, vertical text stays
right, "TAP TO BEGIN" / "TAP TO INTERACT". Swipe drives the same virtual timeline.

## Performance tricks (and costs)
- three.js r182, GSAP + ScrollTrigger, Lenis, Howler, UnrealBloom; Astro static site.
- Baked lighting (EXR lightmaps), KTX2/Basis GPU textures, Draco-compressed GLBs, scene files streamed per
  chapter. Still heavy: ~47 MB of GLB overall, ~6 MB of EXR — the loader screen buys time for it.
- No `prefers-reduced-motion` handling was found — a gap we must not copy.

## What makes it feel premium
1. **A metaphor that *is* the brand** (light vs darkness) carried by every image, colour, sound and the
   one interaction.
2. **Ritual at the threshold** — loader character → one line on black → title card → deliberate click.
3. **Chapters with names and a counter** — you always know where you are in the story, like a film.
4. **The interaction means something**: holding to push back darkness is the story's climax, not a toy.
5. **Sound design** that places you in a space.
6. **Restraint in text** — one line per chapter.
7. **An ending that loops** into the beginning.
