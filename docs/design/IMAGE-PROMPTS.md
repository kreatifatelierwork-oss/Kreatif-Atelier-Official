# Image prompt pack v3: "The Making of a Legacy: Shot on Location"

Rewritten 2026-10-01 for the v3 proposal (`docs/concepts/THE-MAKING-OF-v3.md`). It replaces the v2 pack: the scenes
changed, so no v2 prompt is reused. Written with the **imagegen-frontend-web** skill (desktop) and the
**imagegen-frontend-mobile** skill (phone), for the **image-to-code** workflow.

**v3 was approved on 2026-10-01.** Start with the **first-slice set** below. The rest can follow later.

## FIRST SLICE: generate these first (16 images)
The first build covers the opening, the Atrium, the Studio Floor and Aurelius's Drafting Hall with its Enter room
and the Lens, plus the act bar and the Index. In this order:
1. **P02** The Atrium · and **P02 dark**.
2. **P03** The Studio Floor · and **P03 dark**.
3. **P04** The Drafting Hall (drawing + Lens) · and **P04 dark**.
4. **P05** The Drafting Hall, built.
5. **D1** The Enter room · **D2** The Index · **D3** Chrome close-up · **D4** The threshold.
6. **P00** The Gate · **P01** The flood opening.
7. Phone: **M02** Atrium · **M03** Drafting Hall · **M09** Index.

P00 and P01 matter least: the opening already exists at `/film` and is matched to buttermax. Their job is to
confirm the look.

**How to use it:**
1. In ChatGPT, keep everything in **one chat** so the look stays consistent.
2. For each image, paste the **Shared style block**, then that image's prompt. For the dark theme, also paste the
   **Dark add-on** at the end.
3. Save each image into `design-refs/` with the file name given. Dark versions get `-dark` before `.png`.
4. Tell me when they are in. I analyse each one (text, type scale, spacing, components, colour, layout) before any
   code, and ask for a fresh standalone re-render (never a crop) of anything unreadable.

**What the pack contains:**
- 15 desktop place images;
- 6 desktop detail images;
- 10 phone images.

That is **31 images**, one per message, never combined. Light (the default) is required. Dark versions are wanted for
P02, P04, P06, P09, P11 and P14 at least.

**Sizes:**
- desktop at **1536 × 1024** (landscape);
- phone at **1024 × 1536** (portrait).

**If text comes out wrong or tiny,** say "re-render this exact image with the text larger and spelled exactly as
quoted".

---

## SHARED STYLE BLOCK (paste before every prompt)

> A premium website design reference, rendered as a flat, full-bleed website screen with no browser window and no
> device frame. It is one frame from a single continuous film-like website for "Kreatif Atelier", a creative holding
> company.
>
> **World:**
> - The website is one continuous place you travel through: a luminous building-landscape called the Atelier, made
>   of pale plaster, smooth stone, still water and clear glass.
> - It is still being made. Parts of each place are drawn as fine lines of light, and parts are already built as real
>   material.
> - It is rendered like high-end architectural photography: soft natural light, baked soft shadows, gentle depth of
>   field.
> - Simple curved forms, no clutter, no people.
>
> **The Idea:** an abstract form of fine gold light (#C9A45C, highlights #DDB978) that we follow through the film.
> It is never a ball, logo, letter, emblem, crest, monogram or symbol.
>
> **Light theme (default):**
> - neutral luminous light: page and walls #F4F5F7, deeper surfaces #E9EBEF, text ink #0B0F1A, muted text #5A5E6A;
> - never cream, beige or brass.
>
> **Colour rule:**
> - each place has at most ONE vivid colour, used as its light, atmosphere and material tint;
> - outside the vertical worlds, the only accent is gold #C9A45C (buttons, active states, the ✦);
> - exactly one light source per place, and no glow halos.
>
> **Typography:**
> - headlines in a clean geometric sans (like Outfit), medium weight, sentence case, tight letter-spacing, ink
>   #0B0F1A;
> - spoken lines in an elegant old-style serif italic (like Cormorant Garamond);
> - small functional labels and buttons in a monospaced sans (like IBM Plex Mono), uppercase, wide tracking;
> - never mix two of these in one line.
>
> **Chrome on every screen after the gate:**
> - a quiet top bar: "Kreatif Atelier" in the sans at top left; "SOUND OFF" and "INDEX" in small mono at top right;
> - at the bottom, a thin hairline act bar with small evenly spaced ticks (the current tick gold), the act name in
>   small mono on the left and the time in small mono on the right.
>
> **Layout:**
> - captions sit BESIDE the subject in one calm off-grid text block, never on top of the imagery;
> - very generous space, one focal point, text readable at normal size;
> - sharp square corners on panels, pill-shaped buttons.
>
> **Strictly avoid:**
> - any logo, emblem, monogram, crest, badge or "KA" letters;
> - columns, swans, clapperboards, flames or lotus flowers;
> - planets, orbits or space;
> - neon, glowing UI, glassmorphism, purple or rainbow gradients;
> - labels or pills on the imagery;
> - fake data, numbers, charts or readouts;
> - section numbers, vertical rotated text, "scroll" hints, em-dashes;
> - any text other than the exact text quoted. Spell it exactly.

## DARK ADD-ON (paste after the prompt for the dark version)

> **Dark theme "Cinema":**
> - The same place at night. Surfaces are deep ink #0B0F1A to #121726. Headline and body text are warm cream #F3EBDD,
>   muted text #9D9AA3, hairlines in cream at 14%.
> - The place's own light (its one vivid colour, or gold where it has none) is the ONLY light, falling across dark
>   matte materials, cinematic and calm.
> - Keep the composition, text and layout identical to the light version.

---

## DESKTOP PLACES (1536 × 1024)

### P00 · The Gate · `design-refs/web/P00-gate.png`
- **Note:** this frame is dark in both themes, so no dark add-on is needed.
- **Composition:** stacked centre on solid deep ink #070A12.
- **Centre:** a four-pointed star "✦" about 110px tall in gold #DDB978, as if it has just pooled together from
  drops of liquid gold. Three or four tiny gold droplets are still drifting into it.
- **Below it, 40px apart, side by side:**
  - a gold pill button with dark text "ENTER WITH SOUND";
  - a transparent pill button with a thin cream outline and cream text "ENTER IN SILENCE".
- **Nothing else:** no top bar or act bar yet.

### P01 · The flood opening · `design-refs/web/P01-flood.png`
- **What it shows:** the moment the screen opens, frozen mid-transition.
- **The flood:** a slanted halftone lattice of round dots spreads from the centre. Through the dots you see a bright,
  pale, sky-lit round hall. Between the dots there is deep ink #0B0F1A. Each opened dot has a thin gold rim
  (#C9A45C), gold only.
- **Proportions:** about half the screen has opened, with the dots larger and merged near the centre and smaller
  towards the corners.
- **No text, no chrome.**

### P02 · The Atrium, Title · `design-refs/web/P02-atrium.png`
- **Composition:** massive image-first. Text block at lower left; the subject upper-right of centre.
- **Scene:**
  - a tall, round, pale plaster hall open to the sky through a round oculus;
  - one shaft of white daylight falls onto the floor, where the gold Idea hovers above a shallow well of light, made
    of fine gold light strands like a folded ribbon;
  - ahead, a tall passage in the curved wall glows softly gold.
- **Text (lower left):**
  - headline, very large: "Kreatif Atelier";
  - directly beneath it, on its own line: "Atelier" in a flowing hand-written serif italic, as if just written;
  - "Where Strategy Meets Story." and "Where Story Becomes Legacy." on two lines in the serif italic;
  - small mono: "BOLD · RADIANT · TIMELESS";
  - a gold pill button "WATCH" and a transparent outlined pill "DIRECT".
- **Act bar:** "ACT 00 · TITLE · THE ATRIUM" left, "00:08" right.

### P03 · The Studio Floor, Act I · Idea · `design-refs/web/P03-studio-floor.png`
- **Composition:** a wide floor receding into depth. Text at upper right.
- **Scene:**
  - a vast, pale working floor with long low tables and four tall standing panels spaced across it;
  - two panels are already solid plaster, two are still drawn as fine dark lines on the air;
  - the gold Idea is restless and scattered in the middle distance, like gold light caught mid-swirl;
  - far away at the end of the floor, a tall doorway is filled with royal indigo light (#3D4BFF). It is the only
    colour in the scene apart from gold.
- **Text (upper right):**
  - small mono "IDEA";
  - headline: "We build brands that actually move people.";
  - a serif italic quote: "We believe the most powerful brands are built at the intersection of strategy and story.
    We bring both, and we bring them together without compromise."
- **Panel captions** (small, beside the panels on the floor plane, not on them): "What We Are" · "Where We Operate" ·
  "Who We Work With" · "Our Philosophy".
- **Act bar:** "ACT I · IDEA · THE STUDIO FLOOR" left, "01:12" right.

### P04 · The Drafting Hall, Aurelius (drawing + Lens) · `design-refs/web/P04-aurelius-drawing.png`
- **Composition:** a tall hall seen from low. Text block at the right third.
- **Colour:** everything is ROYAL INDIGO. Indigo light pours from one tall narrow window, and the air is a soft
  indigo haze (#3D4BFF, deep shades #1C2380, pale tint #E7E9FF on lit plaster). No other colour except a tiny touch
  of gold.
- **Scene:**
  - the hall is still a drawing: floating stair flights at odd angles, drawn as fine indigo construction lines in
    the air, going nowhere;
  - in the lower-left there is one soft-edged round area about 260px wide, like a liquid window, where the same stairs
    appear BUILT, in solid indigo-lit plaster (the cursor's lens);
  - a long drafting table in the foreground holds four small abstract plaster models (a folded plane, a stepped
    block, a curved shell, an open frame).
  - No columns anywhere.
- **Text (right third):**
  - small mono "STRATEGY";
  - headline: "Aurelius";
  - stacked on three lines: "Brands" / "Strategy" / "Growth";
  - serif italic: "Builds brands that lead and last.";
  - a short body paragraph: "Kreatif Atelier is a full-spectrum creative agency operating at the intersection of
    strategy, storytelling, and execution, built for brands that want more than good-looking content.";
  - a short list in body text: "Brand Strategy & Identity", "Marketing & Communication", "Creative Consulting",
    "Business Advisory";
  - two small named steps in mono: "DISCOVERY & AUDIT" and "STRATEGY & POSITIONING";
  - a small outlined pill: "FIND THE ANGLE".
- **Act bar:** "ACT II · STRATEGY · THE DRAFTING HALL" left, "02:14" right.

### P05 · The Drafting Hall, built · `design-refs/web/P05-aurelius-built.png`
- **Composition:** the same hall, now from the angle where everything lines up. Text at lower left.
- **Scene:**
  - the broken stair flights have aligned into one continuous stair rising to the tall window;
  - the whole hall is now solid, smooth plaster washed in deep and pale royal indigo light (#3D4BFF);
  - the light runs up the stair to the window;
  - the gold Idea climbs the stair as a thin ribbon of gold light;
  - beyond the window, a faint magenta glow hints at the next place (just a soft wash, no objects).
- **Text (lower left):** headline "Aurelius"; serif italic "Builds brands that lead and last."
- **Act bar:** "ACT II · STRATEGY · THE DRAFTING HALL" left, "02:51" right.

### P06 · The Projection Hall, Golden Guardian Productions · `design-refs/web/P06-ggp.png`
- **Composition:** a deep, long hall in central perspective. Text block at lower left.
- **Colour:** everything is CINEMA MAGENTA (#E8307F, deep shade #6E0E37, pale tint #FDE7F0 on plaster).
- **Scene:**
  - one small round aperture in the far wall shoots a single beam of light down the hall;
  - the beam projects a large, soft, abstract moving image across the back wall: blurred shapes of light, like a
    film frame out of focus, in magenta and gold;
  - four empty frames hang along the right wall, each holding a softer abstract image;
  - no clapperboards, cameras or film-reel icons.
- **Text (lower left):**
  - small mono "STORY";
  - headline: "Golden Guardian Productions";
  - stacked: "Stories" / "Visuals" / "Impact";
  - serif italic: "Creates powerful stories that inspire and influence.";
  - list: "Film & Video Production", "Branded Content", "Live Events", "Creative IP Development";
  - a small mono step "CREATIVE DEVELOPMENT";
  - a gold-outlined pill "ROLL".
- **Act bar:** "ACT III · STORY · THE PROJECTION HALL" left, "03:40" right.

### P07 · The Concourse, Act IV · Movement · `design-refs/web/P07-concourse.png`
- **Composition:** a very wide, bright, open concourse of pale stone under a high diffuse ceiling. Text top left.
- **Colour:** neutral and luminous. The only colour is gold.
- **Scene:**
  - the gold Idea has burst into thousands of thin gold streams that sweep across the floor;
  - the streams pour out through a long row of thirteen tall identical openings along the far wall;
  - one wave of brighter gold travels through the streams.
- **Text (top left):**
  - small mono "MOVEMENT";
  - headline: "Sector-fluid. Results-focused.";
  - two small mono steps: "EXECUTION & PUBLISHING" and "REVIEW & OPTIMIZE";
  - three short lines: "Social Media Management", "Performance Marketing", "Public Relations & Media";
  - a gold pill "LAUNCH".
- **Industries marquee:** a single line of text crosses the lower third of the screen in the sans at about 40px, in
  ink, with gold ✦ between names (as page text, not on the stones): "D2C & E-commerce ✦ Funded Startups ✦ F&B &
  Restaurants ✦ Healthcare & Wellness ✦ Real Estate ✦ Education & EdTech ✦ Fashion & Lifestyle".
- **Act bar:** "ACT IV · MOVEMENT · THE CONCOURSE" left, "04:55" right.

### P08 · The Water Court, Valora · `design-refs/web/P08-valora.png`
- **Composition:** a low view across still water. Text at the right third.
- **Colour:** everything is SUNRISE CORAL (#FF6A3D, deep shade #8A2A10, pale tint #FFEDE6 on plaster and water).
- **Scene:**
  - an indoor court of still water, with a quiet study alcove with a bench on the near left;
  - on the far side, a tall open arch blazes with coral light from outside;
  - a path of smooth round stepping stones has risen out of the water, curving from the near edge to the arch;
  - the four stones nearest the arch are slightly larger and lit;
  - the gold Idea crosses the stones as a thin ribbon of light;
  - no swans or birds.
- **Text (right third):**
  - small mono "PEOPLE";
  - headline: "Valora";
  - stacked: "People" / "Skills" / "Opportunities";
  - serif italic: "Bridges education with real-world opportunities.";
  - list: "Student Capability Ecosystem", "Industry Connect", "Mentorship & Placement", "Global Opportunities";
  - a small outlined pill "LAY A STONE".
- **Act bar:** "ACT V · PEOPLE · THE WATER COURT" left, "05:48" right.

### P09 · The Garden Court, Asraya · `design-refs/web/P09-asraya.png`
- **Composition:** a calm, symmetrical view across a still pool. Text centred low.
- **Colour:** everything is FRESH JADE (#23C27C, deep shade #0C5A37, pale tint #E2F7ED).
- **Scene:**
  - a garden court with no roof, open to a soft green-white sky;
  - a perfectly still round pool reflects the sky;
  - four smooth stones sit around its edge, and slow concentric ripples spread from the centre;
  - in the reflection, faint thin lines of a glass lattice that is not in the garden (a hint of the next place);
  - no lotus, no flowers.
- **Text (centred low):**
  - small mono "PEOPLE";
  - headline: "Asraya";
  - stacked: "People" / "Balance" / "Wellbeing";
  - serif italic: "Enables people to live healthier, more meaningful lives.";
  - list in one row: "Wellness Experiences", "Retreats & Programs", "Mindfulness & Lifestyle Tools", "Community
    Spaces";
  - a small outlined pill "BREATHE".
- **Act bar:** "ACT V · PEOPLE · THE GARDEN COURT" left, "06:30" right.

### P10 · The Glass Lattice, Rudra Yugen · `design-refs/web/P10-rudra-yugen.png`
- **Composition:** a tall void seen from inside. Text at the left third.
- **Colour:** everything is ELECTRIC CYAN (#0FB5E4, deep shade #064A5E, pale tint #E1F6FD).
- **Scene:**
  - hundreds of thin rectangular glass panes hang on fine threads at different angles in a tall pale void;
  - one cyan beam enters from above and splits through the glass, painting crisp moving bands of cyan light across
    the curved walls;
  - in the centre, a group of panes has aligned and a clean geometric pattern of light resolves on the far wall;
  - no flames, no circuit boards, no robots.
- **Text (left third):**
  - small mono "FUTURES";
  - headline: "Rudra Yugen";
  - stacked: "Innovation" / "Culture" / "Futures";
  - serif italic: "Builds what's next at the intersection of creativity and technology.";
  - list: "Emerging Tech & AI", "Cultural Projects", "R&D and Innovation Labs", "Strategic Ventures";
  - a small outlined pill "SPARK".
- **Act bar:** "ACT VI · FUTURES · THE GLASS LATTICE" left, "07:22" right.

### P11 · The Roof, Act VII · Legacy · `design-refs/web/P11-roof.png`
- **Composition:** a high aerial view. Text at the left third; the monument right of centre.
- **Scene:**
  - from high above at a low warm sun, you see the whole Atelier below: a round, sky-lit atrium at the centre and
    five distinct places around it, each glowing softly in its own colour far below (indigo, magenta, coral, jade,
    cyan);
  - they are small and distant, so no colour dominates;
  - a single thin gold line traces the route through all of them;
  - right of centre, on the roof terrace, stands **one solid, polished gold abstract form** (a calm folded shape, the
    only solid gold object in the film), lit by the low sun;
  - not a planet, not a solar system.
- **Text (left third):**
  - headline: "Multiple verticals. One vision. Exponential impact.";
  - serif italic: "Disciplines today. A brighter tomorrow.";
  - small mono label "IMPACT" above a stacked list: "Skilled Talent", "Stronger Brands", "Meaningful Content",
    "Innovative Solutions", "Healthier Lives", "A Brighter Tomorrow".
- **Act bar:** "ACT VII · LEGACY · THE ROOF" left, "08:10" right.

### P12 · The Gallery, credits and founders · `design-refs/web/P12-gallery-founders.png`
- **Composition:** off-grid editorial on a curved pale wall at golden hour. Text at upper left.
- **Light:** one warm golden-hour shaft across the wall. Neutral otherwise, with gold accents.
- **Scene:**
  - four portrait prints hang in a gentle arc on the curved wall;
  - each print is a cut-out photo of a person in formal clothes on a pale mount;
  - the faces are softly out of focus, because real photos replace them;
  - the second print is lifted slightly forward.
- **Text:**
  - small mono at the top left: "A KREATIF ATELIER FILM";
  - beside the lifted print, in the sans: "Rohan Yadav", and in small mono below: "CO-FOUNDER & COO";
  - the other three names in small type under their prints: "Gourish Girish Pillai" / "Anwesha Mulge" /
    "Aritra Ghoshal".
- **Act bar:** "CREDITS · THE GALLERY" left, "09:02" right.

### P13 · The Gallery, credits and formats (pricing) · `design-refs/web/P13-gallery-formats.png`
- **Composition:** stacked centre, like film credits rolling up a pale wall.
- **Content:** three credit blocks in a row, each with a name in the sans, the price in large sans, "per month" in
  small mono, then its features in small type.
  - **"Starter"**: "₹25-35K". Features: "Social media management", "12 posts / month", "Basic content creation",
    "Monthly analytics report", "1 platform focus".
  - **"Growth"**: "₹55-75K", with a small gold mono label "MOST POPULAR" above the name. Features: "Social media (2
    platforms)", "Performance ads management", "1 brand video / month", "Copywriting & design", "Bi-weekly strategy
    calls", "Detailed analytics".
  - **"Brand Partner"**: "₹1-1.5L". Features: "Full-stack creative direction", "Strategy + creative + production",
    "PR & media campaigns", "2–4 videos / month", "Dedicated account team", "Weekly reporting".
- **Heading:** small mono "FORMATS" above the blocks.
- **Act bar:** "CREDITS · THE GALLERY" left, "09:40" right.

### P14 · Post-credits, the Atrium at dusk · `design-refs/web/P14-post-credits.png`
- **Composition:** mini minimalist, centred.
- **Scene:**
  - the round sky-lit hall at dusk, the walls in soft blue-grey shadow;
  - in the middle of the floor, one small gold "✦" hovers where the Idea first rose;
  - a gentle gold light comes from it, and nothing else glows.
- **Text (centred, below the ✦):**
  - headline: "Ready to build something worth remembering?" (the words "worth remembering?" in the same sans, italic);
  - body: "Every great brand started with a single conversation. We offer a complimentary 30-minute brand audit call:
    no obligation, no pitch deck. Just honest strategy.";
  - a gold pill button "SCHEDULE YOUR FREE BRAND AUDIT ✦";
  - small mono below: "HELLO@KREATIFATELIER.COM · @KREATIFATELIER".
- **Act bar:** "POST-CREDITS · THE ATRIUM" left, "10:05" right.

---

## DESKTOP DETAILS (1536 × 1024)

### D1 · An Enter room: a service · `design-refs/web/D1-enter-room.png`
- **Scene:** a small, quiet indigo-lit alcove off the Drafting Hall. One abstract plaster model sits on a plinth on
  the left.
- **Panel:** on the right, a clean pale panel with square corners and generous padding:
  - small mono "BRAND STRATEGY & IDENTITY";
  - headline "Building brands that matter, in markets that are crowded.";
  - small mono "WHAT IT IS" over the body: "Brand Strategy & Identity is the foundational layer of all great
    marketing. At Kreatif Atelier, we don't just design logos: we architect complete brand universes.";
  - four feature names in a 2 × 2 grid: "Brand Audit", "Positioning Strategy", "Visual Identity System", "Brand
    Guidelines";
  - a transparent outlined pill "BACK".

### D2 · The Index (floor plan) · `design-refs/web/D2-index.png`
- **Panel:** a full-screen overlay on #F4F5F7.
- **Plan:** a fine architectural line floor plan of the Atelier:
  - a round atrium at the centre;
  - the studio floor, the concourse and the gallery around it;
  - five rooms, each with a small solid dot of its colour: indigo, magenta, coral, jade, cyan;
  - a gold "you are here" dot in the Drafting Hall.
- **Names** in small mono beside each room: "THE ATRIUM", "THE STUDIO FLOOR", "AURELIUS", "GOLDEN GUARDIAN
  PRODUCTIONS", "THE CONCOURSE", "VALORA", "ASRAYA", "RUDRA YUGEN", "THE ROOF", "THE GALLERY".
- **Right column** of plain links in the sans: "Formats", "Founders", "Contact".
- **Top right:** "CLOSE" in mono.

### D3 · Chrome close-up · `design-refs/web/D3-chrome.png`
- **What it shows:** only the bottom 240px and top 120px of a light screen, the middle left plain #F4F5F7.
- **Top bar:** "Kreatif Atelier" in the sans at the left; "SOUND OFF" and "INDEX" in mono at the right, with a gold
  focus ring around "INDEX".
- **Bottom act bar:**
  - a hairline with 12 ticks, the 4th tick gold;
  - "ACT II · STRATEGY · THE DRAFTING HALL" in mono at the left, "02:14" at the right.
- Readable at large size.

### D4 · A threshold (passage) · `design-refs/web/D4-threshold.png`
- **Scene:** walking through a tall doorway from the pale Studio Floor into Aurelius's world. The doorway is filled
  with dense royal indigo haze (#3D4BFF) that is starting to flood the frame from the centre outward.
- **Text:** the Studio Floor's caption text at the left is dissolving: soft and half-transparent, slightly blurred.
- **Act bar:** in mid-change, "ACT II · STRATEGY · THE DRAFTING HALL".

### D5 · The ink cursor · `design-refs/web/D5-ink.png`
- **Scene:** a close-up of a light page area with part of the headline "We build brands that" in large ink sans.
- **The ink:** a liquid, smooth-edged blob about 160px tall, shaped like a teardrop moving left with a pointed tail
  trailing right, crosses the letters.
  - Where it covers the page it is near-black.
  - Where it covers the letters, they turn pale.
  - The blob has a crisp edge with a thin 1-2px gold outline.
- **The cursor:** a small standard arrow cursor sits at the front of the blob.

### D6 · A founder print · `design-refs/web/D6-founder-print.png`
- **Subject:** one portrait print on a pale mount, hanging on the gallery wall in golden-hour light. It is a cut-out
  photo of a person in a dark formal jacket, the face softly out of focus (a real photo replaces it).
- **Text beside it:**
  - "Gourish Girish Pillai" in the sans;
  - "FOUNDER & CEO" in small mono;
  - body: "The architect of Kreatif Atelier's vision, Gourish brings a rare combination of entrepreneurial acuity and
    creative instinct.";
  - a transparent pill "BACK".

---

## PHONE VIEWS (1024 × 1536, portrait)
Each phone image shows **a 390 × 844 phone screen** filling the frame, with no device hardware.
- **Layout:** the subject in the upper two-thirds; the caption block in the lower third; a slim top bar ("Kreatif
  Atelier" left, "INDEX" right) and a slim act bar at the bottom.
- **Size:** all text at least 16px equivalent.

### M01 · Gate · `design-refs/mobile/M01-gate.png`
- **Background:** deep ink #070A12.
- **Centre:** the gold "✦" pooling from liquid drops.
- **Buttons:** stacked full-width pills, "ENTER WITH SOUND" (gold) above "ENTER IN SILENCE" (outlined cream).

### M02 · The Atrium · `design-refs/mobile/M02-atrium.png`
- **Subject (upper two-thirds):** the tall pale round hall from below, with the sky oculus at the top and the gold
  Idea above the light well.
- **Text (below):** "Kreatif Atelier"; "Atelier" hand-written on its own line; "Where Strategy Meets Story. Where
  Story Becomes Legacy."
- **Buttons:** "WATCH" (gold pill) and "DIRECT" (outlined), side by side.
- **Act bar:** "ACT 00 · TITLE", "00:08".

### M03 · The Drafting Hall, Aurelius · `design-refs/mobile/M03-aurelius.png`
- **Subject:** the indigo hall of floating drawn stairs, with one round liquid lens showing the built version.
- **Text:** "Aurelius"; "Brands / Strategy / Growth"; "Builds brands that lead and last."
- **Button:** a pill "FIND THE ANGLE".
- **Act bar:** "ACT II · STRATEGY".

### M04 · The Projection Hall, Golden Guardian Productions · `design-refs/mobile/M04-ggp.png`
- **Subject:** the magenta hall with the beam and the soft projection on the back wall.
- **Text:** "Golden Guardian Productions"; "Stories / Visuals / Impact"; "Creates powerful stories that inspire and
  influence."
- **Button:** a pill "HOLD TO ROLL".
- **Act bar:** "ACT III · STORY".

### M05 · The Water Court, Valora · `design-refs/mobile/M05-valora.png`
- **Subject:** the coral court with the stepping-stone path to the blazing arch.
- **Text:** "Valora"; "People / Skills / Opportunities"; "Bridges education with real-world opportunities."
- **Button:** a pill "LAY A STONE".
- **Act bar:** "ACT V · PEOPLE".

### M06 · The Garden Court, Asraya · `design-refs/mobile/M06-asraya.png`
- **Subject:** the jade pool open to the sky, with ripples.
- **Text:** "Asraya"; "People / Balance / Wellbeing"; "Enables people to live healthier, more meaningful lives."
- **Button:** a large round outlined button "HOLD TO BREATHE".
- **Act bar:** "ACT V · PEOPLE".

### M07 · The Glass Lattice, Rudra Yugen · `design-refs/mobile/M07-rudra-yugen.png`
- **Subject:** the cyan void of hanging glass panes and split beams.
- **Text:** "Rudra Yugen"; "Innovation / Culture / Futures"; "Builds what's next at the intersection of creativity and
  technology."
- **Button:** a pill "TAP TO SPARK".
- **Act bar:** "ACT VI · FUTURES".

### M08 · The Roof · `design-refs/mobile/M08-roof.png`
- **Subject:** the aerial view of the atrium and five small coloured places joined by a gold line, with the solid
  gold form in the foreground.
- **Text:** "Multiple verticals. One vision. Exponential impact." and "Disciplines today. A brighter tomorrow."
- **Act bar:** "ACT VII · LEGACY".

### M09 · The Index (floor plan) · `design-refs/mobile/M09-index.png`
- **Plan:** a full-screen overlay with the line floor plan fitted to the top half, coloured dots on the five rooms,
  and the gold "you are here" dot.
- **Below it:** a list of place names in the sans: "The Atrium", "The Studio Floor", "Aurelius", "Golden Guardian
  Productions", "The Concourse", "Valora", "Asraya", "Rudra Yugen", "The Roof", "The Gallery", "Contact".
- **Top right:** "CLOSE".

### M10 · Post-credits · `design-refs/mobile/M10-post-credits.png`
- **Subject:** the dusk atrium with the small gold "✦" in the upper half.
- **Text:**
  - "Ready to build something worth remembering?";
  - "Every great brand started with a single conversation.";
  - a full-width gold pill "SCHEDULE YOUR FREE BRAND AUDIT ✦";
  - "hello@kreatifatelier.com" in small mono.
