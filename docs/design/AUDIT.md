# Design audit: current build vs the design sources of truth

- **Audited:** 2026-09-30.
- **Protocol:** redesign-skill (Scan → Diagnose → Fix), with the taste-skill pre-flight check and the image-to-code
  clarity check.
- **Evidence:** Playwright CLI screenshots at 1440 and 390 (`docs/design/audit-shots/`, local only; script
  `scripts/research/audit-shots.js`) plus a code scan.

**Surfaces audited:**
- **Home** (`/`): The Long Take, the orrery build currently live on `redesign-v2`.
- **/film:** checkpoint 1 of "The Making of a Legacy" (gate, opening, title card, ink cursor, HUD).
- **/concepts:** prototypes 1–4 (noindex).

**How to read this:**
- Every finding has what's wrong, which source says so, and the fix.
- Findings marked **CONFLICT** break a rule the sources set but follow a decision you made. They are collected in
  §4 with a recommendation each. **You decide those.** Until you do, your decision stands.
- The status line of each finding says **home**, **film** or **concepts** (where it occurs).

---

## 1. Scan
| Item | Current state |
|---|---|
| Stack | Next.js static export, React Three Fiber, Tailwind v4 + CSS layers, Framer Motion (home), raw WebGL2 (film ink) |
| Fonts | Outfit, Manrope, Cormorant Garamond, IBM Plex Mono: four families |
| Palettes | A: pearl `#F3EDE2`–`#F7F3EC` + brass/gold `#A8812F` + navy ink; B: deep ink + gold; home adds 5 house colours + 8 per-world pastel skies |
| Dial reading of the current home | VARIANCE ≈ 6, MOTION ≈ 8, DENSITY ≈ 6 (the frame furniture makes it busier than its content) |

## 2. Diagnose: findings

### A. Typography
1. **Tiny microtype everywhere.** home, film, concepts
   - **What's wrong:** labels at 8.3–9.6px (`text-[0.52rem]`–`[0.6rem]`) across the timeline, frame, annotations,
     jump menu and founders panel. The film HUD is 10px mono.
   - **Source:** image-to-code §17 "tiny labels"; imagegen-mobile §29 "text must never feel too small"; stitch
     "body minimum 14px".
   - **Fix:** minimum 13px desktop / 12px phone for labels, 16px body. Remove most labels instead of enlarging
     them (see B).
2. **Mixed-family emphasis in the headline.** film
   - **What's wrong:** "Kreatif" (Outfit 800) + "Atelier" (Cormorant italic).
   - **Source:** taste-skill §4.1 emphasis rule ("Do NOT inject a random serif word into a sans headline… amateur").
   - **Fix:** set "Kreatif Atelier" wholly in Outfit 500. If emphasis is wanted, use Outfit italic on the same
     family. Cormorant keeps its own role (the voice lines).
3. **Screaming display weight.** home, film
   - **What's wrong:** Outfit 800–900 uppercase "KREATIF ATELIER", "GOLDEN GUARDIAN PRODUCTIONS".
   - **Source:** taste-skill §9.B "no oversized H1s that scream"; Bugatti 400, Ferrari/Framer 500, Apple 600 display
     weights.
   - **Fix:** Outfit 500, sentence case, -0.03em tracking.
4. **Four font families** (Outfit, Manrope, Cormorant, Plex Mono). home, film
   - **Source:** image-to-code §29 "too many font moods"; one register per page (taste-skill §4.9).
   - **Fix:** three strict roles (Outfit display, Cormorant voice, Plex Mono utility). Retire Manrope. **CONFLICT
     C6.**
5. **Lazy all-caps with wide tracking on nearly every small string.** home, film, concepts
   - **Source:** image-to-code §29 "lazy all-caps everywhere"; redesign-skill "all-caps subheaders everywhere".
   - **Fix:** uppercase only for Plex Mono utility labels (buttons, scrubber). Captions in sentence case.
6. **The middle dot used as the default separator.** home, film, concepts
   - **Examples:** "Brands · Strategy · Growth", "Bold · Radiant · Timeless", "Creativity · Education · …", the
     "serves" and "impact" rows (5–6 dots per line).
   - **Source:** taste-skill §9.F "middle-dot rationed, max 1 per line".
   - **Fix:** set such lists as stacked words, or columns.

### B. Fake technical labels, clutter, micro-UI
7. **The film HUD is a telemetry panel.** film
   - **What's wrong:** "ACT 00 / 07 — TITLE", "FORM 01 / 07 — RAW IDEA", "CURSOR X 0000 · Y 0000 · 0000 PX/S",
     "FPS 60 · PARTICLES 36,000", "HYDERABAD 13:31:14 IST", "TC 00:00:03:23".
   - **Source:**
     - image-to-code §17 (fake control labels, pseudo-system markers, meaningless metadata rows);
     - taste-skill §9.F (locale/time strips banned for 99% of briefs; version-like strings);
     - DESIGN.md §10.
   - **Fix:** drop the telemetry (cursor, FPS, particles, local time, form counter). Keep one functional device,
     the act scrubber with the act name and the real film timecode. **CONFLICT C2.**
8. **Section-number labels.** home
   - **What's wrong:** "REEL 03 / 07", "01 / 05 — …", the numbered annotations "01 Brand Strategy & Identity" and
     numbered menu rows.
   - **Source:** taste-skill §9.F "no section-number eyebrows", "no 01 / 4 pagination"; gpt-taste meta-label ban.
   - **Fix:** name things; don't number them. **CONFLICT C4** (TURA section index).
9. **Pills and labels overlaid on the 3D imagery.** home
   - **What's wrong:** the "what we do" annotations floating around each sculpture, and the "HOLD TO RAISE" style
     pills on the scene.
   - **Source:** taste-skill §9.F "no pills/labels overlaid on images"; image-to-code §17 "unnecessary pills".
   - **Fix:** put "what we do" in the caption block or the house slice, beside the subject and not on it.
     Interactions get one ghost button in the caption block, not a pill floating on the scene.
10. **Vertical rotated edge text and a scroll cue.** home, concepts
    - **What's wrong:** the motto set vertically on the left edge; an animated "Scroll" line on the right edge; the
      "Scroll to travel ↓ · Drag to turn ↔" hint.
    - **Source:** taste-skill §9.F ("no vertical rotated text", "scroll cues are banned"); stitch "no filler UI
      text".
    - **Fix:** remove all three. Interactions are taught by the scene itself and by the one button. **CONFLICT
      C4.**
11. **Too many elements in the hero.** home
    - **What's wrong:** the core reel shows eyebrow + headline + caption + pillars row + hint row + frame labels
      + timeline + timecode, which is more than 4 text elements.
    - **Source:** taste-skill §4.7 "hero stack discipline (max 4 text elements)"; image-to-code §14.
    - **Fix:** headline, one subtext, two actions. Nothing else.
12. **Decorative data strips.** home
    - **What's wrong:** "OUR ECOSYSTEM SERVES · STUDENTS · PROFESSIONALS · …" and the "IMPACT · …" rows as
      microtype strips above and below the headline.
    - **Source:** taste-skill §9.F "decoration text strip"; §4.9 "long lists need a different component".
    - **Fix:** give "serves" and "impact" their own composed moment (large, stacked, one list per screen).
13. **The timeline carries too much.** home
    - **What's wrong:** 8 coloured segments, 8 labels, a reel counter and a timecode in 9px type.
    - **Source:** image-to-code §17; taste-skill §9.F (dots and colours only when semantic).
    - **Fix:** the DESIGN.md act scrubber: one hairline, ticks, the current act name and one timecode.
14. **Loader micro-meta.** home
    - **What's wrong:** "SETTING THE SCENE · 100%" with a ring of five coloured dots.
    - **Source:** taste-skill §9.F (decorative dots; micro-meta).
    - **Fix:** the ✦ gate replaces the loader. There is no percentage.
15. **A dev-tool toolbar ships on the concept pages.** concepts
    - **What's wrong:** the "1 2 3 4 · The Orrery · Serif Sans · Replay intro" pill bar.
    - **Source:** image-to-code §17.
    - **Fix:** delete `/concepts` before launch (it is noindex and served its purpose).

### C. Colour and surface
16. **The banned premium-consumer palette.** home, film
    - **What's wrong:** palette A is warm cream `#F3EDE2`–`#F7F3EC` + brass `#A8812F` + espresso-navy ink.
    - **Source:** taste-skill §4.2 "premium-consumer palette ban (second-most-recurring AI-tell)".
    - **Fix:** DESIGN.md "Cinema" (ink `#0B0F1A` + gold `#C9A45C`, the brand's original tokens) as the default, and
      "Daylight" (neutral porcelain `#EFEFEC`, gold only as decoration) as the alternate. **CONFLICT C1 (decided: Luminous light default).**
17. **Six accents plus pastel skies.** home
    - **What's wrong:** gold + 5 house colours, used as backgrounds, text tints, buttons and timeline segments;
      each world floods the page with its own pastel sky.
    - **Source:** taste-skill §4.2 "max 1 accent", "colour consistency lock", §4.11 "page theme lock";
      imagegen-web "palette discipline".
    - **Fix:**
      - Gold is the only UI accent.
      - House colours become identity markers only (a 3px edge, the tint of that house's light in the scene,
        its scrubber tick), after BMW M's tricolour and HashiCorp's product colours.
      - The sky stays the single theme canvas.
      - **CONFLICT C5.**
18. **Generic glow and bloom.** home, film
    - **What's wrong:** Bloom post-processing on the whole scene, a halo sprite on the core, additive glow in
      palette B, emissive rings.
    - **Source:** taste-skill §9.A "no neon/outer glows"; image-to-code §29 "too many glowing edges"; Bugatti,
      Ferrari, Lamborghini ("no glows").
    - **Fix:** one light, the Idea itself. Bloom limited to its own pixels; no halos, no glow on UI. **CONFLICT
      C7.**
19. **Glassmorphism panels.** home
    - **What's wrong:** `.lt-glass` frosted panels for the jump menu and founders.
    - **Source:** image-to-code §29 "glassmorphism stacked without reason"; soft-skill (blur only on fixed
      elements); Bugatti/Apple (solid surfaces).
    - **Fix:** a solid Canvas Deep overlay.
20. **The rainbow flood rim and rainbow ink rim.** film
    - **What's wrong:** the five house colours cycling along the halftone edge and the ink edge.
    - **Source:** imagegen-web §13 "banned: rainbow / mesh blob gradients"; taste-skill §4.2.
    - **Fix:** a gold-only rim, or no rim. **CONFLICT C8** (it matches the buttermax reference you asked for).
21. **Gradient text utility.** legacy CSS
    - **What's wrong:** `.gold-text` gradient clip in globals.css (old home).
    - **Source:** taste-skill §9.A "no excessive gradient text".
    - **Fix:** remove it with the old components (see G).

### D. Layout and hierarchy
22. **The TURA "edge furniture" frame on every screen.** home, concepts
    - **What's wrong:** a frame of wordmark + 2 links + vertical motto + scroll cue + section index + timecode.
    - **Source:** taste-skill §9.F (decoration strips, vertical text, scroll cues, floating corner text);
      image-to-code §15–17.
    - **Fix:** the top bar (wordmark text, sound, Index) plus the bottom scrubber, nothing else. **CONFLICT C4.**
23. **Captions compete with the subject.** home
    - **What's wrong:** the headline sits in the lower-middle while annotations surround the sculpture and the
      timeline and frame press in, so there are several focal points.
    - **Source:** image-to-code §14 "strong single focal point".
    - **Fix:** the subject rule (48px clear of the Idea); one caption block per act.
24. **Boxes in the founders panel.** home
    - **What's wrong:** four bordered cards inside a glass panel inside the page, and the bio in a further block.
    - **Source:** image-to-code §16 "anti-nested-box".
    - **Fix:** the polaroid arc (prints on the canvas, no container).
25. **The Idea's first form reads as a generic particle blob.** film
    - **What's wrong:** a sphere of gold dots.
    - **Source:** imagegen-web "floating spheres / blobs"; taste-skill §0.D "AI gradient blob".
    - **Fix:** give the raw Idea a characterful, directional form (a folded ribbon of light with a clear top and
      front) that is still abstract and never a mark. Decide it in the image pack (Scene 03).

### E. Copy
26. **Em-dashes and en-dash separators in visible text.** home, film, meta
    - **Where:**
      - page title "Kreatif Atelier — Ideas | People | Impact";
      - UI strings "Reel 03 / 07 — Name", "Act 00 / 07 — Title";
      - founder bios ("…of Kreatif Atelier — the force that…");
      - the contact body ("…brand audit call — no obligation…");
      - service copy;
      - price ranges "₹25–35K".
    - **Source:** taste-skill §9.G "zero em-dashes… non-negotiable".
    - **Fix:** UI strings and meta are ours to fix now. Live-site copy: **CONFLICT C3.**
27. **Two labels for one intent.** home
    - **What's wrong:** "Contact" in the nav, the email pill and the handle.
    - **Source:** taste-skill §4.5 "no duplicate CTA intent".
    - **Fix:** one contact action, "Schedule Your Free Brand Audit ✦", in the post-credits scene and the Index. The
      email appears as plain text.

### F. Behaviour and states
28. **The custom-cursor ban.** film. **No violation:** the system cursor stays visible, and the fluid ink is an
    effect, not a cursor replacement (taste-skill §9.A targets pointer replacement). Keep it, and keep it disabled
    for touch and calm under reduced motion.
29. **Interaction pills teach by instruction** ("Hold to raise", "Tap to spark"). home
    - **Source:** stitch "no filler UI text"; imagegen "interaction implied".
    - **Fix:** one ghost button in the caption block whose label is the action verb, plus affordance in the scene
      (the Idea reacts on hover). This is acceptable as an interactive control, but it must not float on the
      scene.
30. **Reduced motion and keyboard.** home, film. **Pass.** Keep them.

### G. Code quality (redesign-skill)
31. **Dead design code.** repo
    - **What's wrong:** the old home's sections (`components/sections/*`), `.gold-text`, `.panel`, `.eyebrow` and
      the Lenis CSS import remain unused.
    - **Source:** redesign-skill "remove dead code".
    - **Fix:** delete them in the rebuild phase (after your approval).
32. **Arbitrary text sizes.** home
    - **What's wrong:** 12 different `text-[0.xxrem]` values.
    - **Source:** redesign-skill "hardcoded values"; stitch "tokens".
    - **Fix:** use the DESIGN.md type tokens only.

---

## 3. Fix priority (redesign-skill order), once conflicts are decided
1. **Type:** three roles, the new scale, no mixed-family headline, no micro-text.
2. **Colour:** the Cinema/Daylight tokens, gold as the one accent, house colours as markers, no glow/glass.
3. **Clutter removal:** the HUD telemetry, frame furniture, numbering, overlaid pills, dots and scroll cues.
4. **Layout:** the hero discipline, one caption per act, the subject rule.
5. **Components:** the scrubber, the house slices, the polaroid arc, the credit blocks and the Index.
6. **States:** phone, reduced motion, WebGL-off still frames.
7. **Polish:** the spacing rhythm, and the copy self-audit (em-dash sweep).

---

## 4. CONFLICTS (decided by the user on 2026-09-30; see PHILOSOPHY.md §0)

Decisions:
- C1: light default (Luminous, neutral).
- C2: agreed.
- C3: agreed.
- C4: agreed.
- C5: vertical colours vivid and dominant inside their own world, gold outside.
- C6: agreed.
- C7: agreed.
- C8: agreed, and the ink edge is gold too.

The original analysis is kept below for the record.
Each conflict: your earlier decision → what the sources say → my recommendation.

| # | Your earlier decision | Sources say | Recommendation |
|---|---|---|---|
| **C1** | Palettes: keep both, **light (pearl + gold) as default** | The warm cream + brass default is banned (taste-skill §4.2). Every film-grade reference is dark. One theme per page. | **Change:** make **Cinema (ink `#0B0F1A` + gold)** the default, which is your original brand palette from day one. Keep **Daylight** as the alternate (via system preference or a toggle), redefined as neutral porcelain `#EFEFEC` with gold used only decoratively. Drop the cream. |
| **C2** | The film's "technologically information-heavy" HUD readouts (approved in the concept) | Fake telemetry, locale/time strips and meaningless metadata are the top AI tells (image-to-code §17, taste-skill §9.F) | **Drop** cursor XY, FPS, particle count, form counter and Hyderabad time. **Keep** the act name + real film timecode in the scrubber. Deliver "information-heavy" through **real content set large** (the process, services, houses, pricing credits), which is honest density. |
| **C3** | Content word for word (includes the live site's em-dashes and "₹25–35K" en-dashes) | Zero em-dashes and no en-dash separators, "non-negotiable" (taste-skill §9.G) | **Change punctuation only, never words:** replace each "—" with the punctuation it stands for (comma, colon or full stop), and set price ranges with a hyphen ("₹25-35K"). Every word and every price stays identical. Your standing rule stays in force if you prefer the dashes. |
| **C4** | The TURA layout: edge furniture (vertical motto, scroll cue, section index), tiny wide-tracked microtype | Vertical rotated text, scroll cues, section numbering, decoration strips and tiny labels are all banned (taste-skill §9.F, image-to-code §17) | **Drop** the TURA furniture. **Keep** its best idea (one focal point, huge headline vs quiet support) using DESIGN.md's top bar + scrubber. |
| **C5** | Each vertical's signature colour, shown vividly (backgrounds, text, timeline, skies) | One accent. Colour consistency lock. One page theme (taste-skill §4.2, §4.11). | **Keep the five colours as identity markers only:** a 3px edge on the house slice, the tint of that house's light in the 3D scene during its act, and its scrubber tick. Never CTAs, text, UI or backgrounds. Gold is the only UI accent. |
| **C6** | Fonts: Outfit + Manrope + Cormorant (+ Plex Mono approved) | Too many font moods; serif only with a reason; no mixed-family headlines (taste-skill §4.1, image-to-code §29) | **Three roles:** Outfit display, Cormorant for the voice (justified as the narrator's subtitles + "Timeless" heritage), Plex Mono for utility. **Retire Manrope.** Never mix Cormorant into a headline. |
| **C7** | Bloom, glow and glossy light in the 3D (both palettes, earlier directions) | No neon or outer glows, no generic bloom, no halos (taste-skill §9.A; Bugatti, Ferrari, Lamborghini) | **Keep one light:** the Idea glows because it *is* light (bloom limited to its pixels). Drop the halos, glow on everything else and emissive rings. |
| **C8** | Match buttermax's opening, including its rainbow-rimmed halftone flood (the rim uses the five house colours) | Rainbow / mesh gradients banned (imagegen-web §13) | **Change the rim to gold only** (the flood itself stays beat for beat), or remove the rim. |
| **C9** | The approved concept's act structure used a HUD-heavy "film UI" look (timecode, form counters) | See C2 | Covered by C2. The structure (acts, credits, post-credits) is fully compatible and stays. |

**Things the sources ask for that need no decision** (consistent with your rules): real HTML text, reduced motion,
keyboard support, no logo, no invented facts, image-first workflow, deleting `/concepts` before launch, removing
dead code.
