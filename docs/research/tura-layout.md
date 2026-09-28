# "TURA" landing page — layout study

Reference: `docs/research/reference-tura.jpg` (a 3-screen landing-page presentation, typeface Cera CY).
Studied for **placement, composition, type scale and visual appeal only — its grey colour scheme is ignored.**
Measured from the image (each screen ≈ 503 × 264 px, aspect ≈ 1.9:1) and converted to a **1440 × 757**
desktop viewport (× ≈ 2.86). Numbers are approximate — they describe proportions, not a spec to copy.

## 1. The system in one sentence
Every screen is a **framed stage**: a thin band of "edge furniture" at a constant inset holds navigation and
wayfinding, and the centre holds **exactly one focal element** with a huge, heavy headline and a few pieces of
tiny, wide-tracked microtype orbiting it asymmetrically. Depth comes from a soft spotlight behind the focal point
and deep, soft shadows under anything that floats.

## 2. Frame, grid and margins
| Element | Position (1440 wide) | As a share |
|---|---|---|
| Outer inset (all edge furniture) | ≈ 50 px left/top, ≈ 70 px right/bottom | 3.5–5 % of width |
| Wordmark block (stacked, 2 lines) | top-left at the inset; ≈ 43 px tall | — |
| Two nav links | top-right, on the wordmark's cap line; ≈ 76 px apart | — |
| Social icons | left edge, vertical stack, ≈ 36 px apart, bottom-aligned to the bottom inset | — |
| "SCROLL" label + thin line | right edge, vertical, bottom-aligned; line ≈ 30 px | — |
| Section index `.01 .02 .03` | **outside** the frame, bottom-left, under the social stack | — |

- Content uses a centred single column (screens .01, .02) or a **two-column split** (screen .03) whose two
  headings sit on **the same baseline**.
- The frame never changes between screens; only the centre changes. That constancy is what makes three very
  different screens feel like one product.
- Roughly **65–75 % of every screen is empty.** Negative space is the main material.

## 3. Type scale
| Role | Size at 1440 | Weight / case / tracking | Ratio to microtype |
|---|---|---|---|
| Hero headline ("TURA") | cap ≈ 123 px → font ≈ 175 px (≈ 12 vw) | Bold, caps, ≈ +0.02 em | ≈ 16 : 1 |
| Screen title ("KEET CAFE", "CONTACT") | font ≈ 50–72 px | Bold, caps, +0.06–0.08 em (wider as it gets smaller) | ≈ 5–7 : 1 |
| Microtype (eyebrow, caption, nav, labels) | ≈ 10–11 px | Regular/Medium, caps, **+0.22–0.3 em** | 1 |
| Body (paragraphs) | ≈ 11–12 px, line-height ≈ 2.4 | Regular, sentence case, centred | — |

- Two sizes do almost all the work: **enormous** and **tiny**. Mid sizes are rare, which is why it feels decisive.
- Tracking scales inversely with size: tight on the giant headline, very wide on microtype.
- Body copy is set small with generous leading and a short measure (≈ 46 % of the width), always centred under
  its title — it reads as a caption to the image, not as an article.

## 4. The asymmetric microtype around a centred headline
- Headline is centred horizontally and sits on the vertical centre of the screen.
- **Eyebrow** ("I AM") sits above the headline, **indented ≈ 23 % into the headline's width from its left edge**,
  ≈ 47 px above the caps.
- **Caption** ("A JUNIOR / WEB DESIGNER", two lines) sits below the headline, **starting at its centre line**,
  ≈ 50 px below the baseline.
- The eyebrow and caption form a diagonal (upper-left → lower-right) that crosses the symmetric headline. That
  single diagonal adds movement without breaking the calm.

## 5. Screen .02 — the fanned depth carousel
- **Centre card:** ≈ 400 × 360 px (≈ 28 % of width, 44 % of height), top at ≈ 16 % of the height, sharp, full brightness.
- **Side cards:** about **70 % of the centre card's width but nearly its full height** → they are *rotated in
  perspective* toward the centre (a gentle coverflow), not just scaled. They sit slightly lower than the centre
  card and with a small gap (≈ 22 px) — no overlap.
- **Depth treatment:** side cards are dimmed (≈ 40–50 % brightness) and blurred (the right one strongly, ≈ 6–8 px)
  — a depth-of-field cue that says "not now" without hiding them.
- **Title overlaps the centre card's bottom edge** by about a third of its cap height — it ties the image and the
  words into one object. Then a 2-line centred paragraph, then a small dark **pill button** with its own drop shadow.
- Vertical rhythm: cards 16–60 %, title 60–68 %, paragraph 74–80 %, button 86–92 %.

## 6. Screen .03 — split contact
- Left column: title, 4-line centred paragraph, then three bold label / value pairs at a regular rhythm (≈ 82 px).
- Right: a **raised form card** (≈ 39 % of width, 71 % of height) that floats on a deep, soft shadow, slightly
  darker than the stage; **underline-only inputs** (placeholder as label), ≈ 72 px apart; a pill button centred
  at the bottom with its own shadow.

## 7. Light, glow and shadow — how they're built
- **Spotlight:** a large, soft radial gradient centred at the top-middle (brightness at top-centre ≈ 2× the corners)
  plus a second, smaller glow behind the focal point. It pulls the eye to the centre and makes the flat colour feel
  lit. Build: a CSS `radial-gradient(ellipse at 50% 20%, …)` layer, or a blurred light "blob"; in our 3D scenes,
  the same glow as a soft additive sprite behind the focal object.
- **Floating panels:** very large, very soft, low-opacity shadows offset downward (≈ `0 40px 80px -20px` at
  60–80 % black) — no hard edges, so things *hover* rather than sit.
- **Headline shadow:** the giant word casts a soft shadow down and to the right, lifting it off the backdrop.
- **The screens themselves** float on the page with the same soft shadow — the "framed stage" idea is literal.

## 8. Why it feels premium
1. **Discipline** — one focal point, one frame, two type sizes, one alignment idea per screen.
2. **Negative space as luxury** — most of the screen is deliberately empty.
3. **Extreme scale contrast** makes the headline feel monumental and the microtype feel precise.
4. **Consistent edge furniture** reads like the margin notes of a well-set book: always there, never loud.
5. **Soft, directional light** (spotlight + floating shadows) turns flat panels into objects.
6. **A confident geometric sans** in heavy caps — clean, modern, slightly architectural.

## 9. How we adapt it (and what we don't take)
- Take: the frame and edge furniture, the section index outside the content, the macro/micro type system with the
  asymmetric eyebrow/caption diagonal, one focal point per screen, spotlight glows, floating shadows, the fanned
  blur-depth carousel, the split contact with a floating underline form.
- Don't take: its colours (we keep ink, gold, cream), its monogram (we set **KREATIF / ATELIER** in plain type, never
  a mark), its placeholder copy, or its exact dimensions.
- On phones: the frame shrinks to ≈ 20 px, the social stack becomes a short horizontal row at the bottom-left, the
  index moves beside it, "SCROLL" stays on the right edge but shorter, and the headline stacks onto two lines.
