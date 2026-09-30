# Image prompt pack: "The Making of a Legacy"

Written 2026-09-30 with the **imagegen-frontend-web** skill (desktop sections) and the **imagegen-frontend-mobile**
skill (phone views), for the **image-to-code** workflow.

**How to use it:**
1. Generate every image below in ChatGPT.
2. Save them into `design-refs/` using the file names given.
3. Tell me when they are in. I will then analyse each one (text, type scale, spacing, components, colour, layout)
   before any code is written, and ask for a fresh standalone re-render (never a crop) of anything unreadable.

**What the pack contains:**
- 15 desktop section images;
- 6 desktop detail images;
- 8 phone images.

That is **29 images in total**, one per section, never combined.

**Theme:** the prompts are written for the **recommended Cinema (dark) theme**. If you decide light stays the
default (AUDIT C1), append the **Daylight suffix** (end of this file) to every prompt.

## Tips for ChatGPT
- **Keep everything in one chat** so the look stays consistent. For each image, paste the **Global style block**
  plus that section's prompt.
- **Size:** desktop images at **1536 × 1024 (landscape)**; phone images at **1024 × 1536 (portrait)**.
- **Check the text.** If any text renders wrong or tiny, say "re-render this exact section with the text larger
  and spelled exactly as quoted". Don't crop old images.
- Ask for one image per message. Label each reply with the section number.

---

## GLOBAL STYLE BLOCK (paste before every prompt)

> A premium website design reference, rendered as a flat, full-bleed website screen with no browser window and no
> device frame. It is part of one consistent set for a brand-film website called "Kreatif Atelier".
>
> **World:** a dark screening room. The page background is deep ink blue-black (#0B0F1A) with subtle 3% film grain.
> The only lit object is **"the Idea"**, an abstract sculptural form made of fine gold light (#C9A45C with highlights
> #E8C98A), rendered like high-end studio product photography under cinema lighting, with soft falloff and shallow
> depth of field. The Idea is abstract: never a logo, emblem, letter, monogram, crest or symbol.
>
> **Typography:**
> - Headlines: a clean geometric sans (like Outfit) at medium weight, sentence case, tight letter-spacing, cream
>   #F3EBDD.
> - Spoken lines and quotes: an elegant old-style serif (like Cormorant Garamond), often italic, cream.
> - Buttons and small functional labels: a monospaced sans (like IBM Plex Mono), uppercase with wide tracking.
>
> **Colour:** one accent only, gold #C9A45C, used for the primary button and the active state. Muted text is
> #9D9AA3; hairline dividers are 1px cream at 14% opacity.
>
> **Shapes:** images and panels have sharp square corners; buttons are pills.
>
> **Space:** very generous, calm, gallery-like. One focal point. Text readable at normal viewing size.
>
> **Strictly avoid:**
> - any logo, emblem, monogram, crest, badge or "KA" letters;
> - glowing UI and neon;
> - purple or rainbow gradients;
> - glassmorphism panels;
> - pills or labels placed on top of the imagery;
> - fake data, numbers, charts or dashboards;
> - section numbers;
> - vertical rotated text;
> - "scroll" hints;
> - em-dashes;
> - any text other than the exact text quoted below. Spell it exactly.

---

## DESKTOP SECTIONS (1536 × 1024, landscape)

### Section 1 of 15: Gate · `design-refs/web/S00-gate.png`
- **Composition:** stacked centre.
- **Background:** solid, darker ink (#070A12), nothing else on screen.
- **Centre:** a four-pointed star "✦" about 110px tall, drawn in gold (#E8C98A), as if just formed from a few
  gathering points of light. A faint trace of 3–4 tiny gold points is still drifting into it.
- **Below it, 40px apart, side by side:**
  - a gold pill button with dark text "ENTER WITH SOUND";
  - a transparent pill button with a thin cream outline and cream text "ENTER IN SILENCE".
- Both buttons are the same height (about 52px), in monospaced uppercase.
- Nothing else. Around 80% of the frame is empty darkness.

### Section 2 of 15: Opening flood (transition frame) · `design-refs/web/S01-flood.png`
- **Composition:** image-as-canvas.
- **Scene:** the moment the dark gate dissolves into the page. A halftone lattice of dots grows from the centre of
  the screen. Near the centre, the dots have swollen and bridged into slanted, wavy diagonal bands that open onto
  the page beneath: deep ink with a large gold form of light. Towards the edges, the dots are still small and
  separate.
- **Colour:** each band edge carries a thin gold rim only. The outer areas are near-black.
- **Text:** none.
- **Style:** graphic, crisp, a print-halftone feel, cinematic. No other elements.

### Section 3 of 15: Title card (hero) · `design-refs/web/S02-title.png`
- **Composition:** bottom-left text over a full-bleed image.
- **Hero scale:** Giant Statement.
- **Background:** ink. Upper-right of centre floats the Idea in its first form: a large folded ribbon of fine gold
  light filaments, like a single loop of silk made of light, with a clear front and top. It takes about 45% of
  the frame height and is softly lit, with fine particles at its edges.
- **Lower-left, left margin 64px, from the top of the text block down:**
  1. the headline "Kreatif Atelier" in huge geometric sans, medium weight, cream, tight tracking, one line, about
     110px tall;
  2. 24px below, two lines of elegant serif italic in cream, about 32px: "Where Strategy Meets Story." / "Where
     Story Becomes Legacy.";
  3. 36px below, two pill buttons side by side: a gold pill "WATCH" (dark text) and a thin-outline pill "DIRECT".
- **Top bar, 64px tall, transparent:**
  - left: the words "Kreatif Atelier" in small sans, about 18px, cream;
  - right: a thin-outline pill "SOUND OFF" with five tiny vertical bars, and a thin-outline pill "INDEX".
- **Bottom edge, 56px:** one thin hairline across the width with 8 small evenly spaced tick marks. The first tick
  is gold. Above the first tick: the word "Title" in small monospaced. At the far right: a small monospaced
  timecode "00:00:04:12".
- Nothing else: no eyebrow, stats or extra labels.

### Section 4 of 15: Act I · Idea · `design-refs/web/S03-idea.png`
- **Composition:** low-right caption, subject left.
- **Background:** ink.
- **Subject:** the Idea, left of centre: the gold ribbon of light, now restless, with fine threads of light pulled
  out towards the lower right as if something just moved past it.
- **Text block, lower-right, right margin 64px, max width about 520px, left-aligned inside:**
  1. "Idea" in large geometric sans, about 72px, cream;
  2. 20px below, "We build brands that actually move people." in serif italic, about 34px, cream;
  3. 16px below, "Great creative work is not decoration: it is a business tool." in serif roman, about 22px, muted
     cream.
- **Top bar** as in Section 3.
- **Bottom scrubber** as in Section 3, with the second tick gold, "Idea" above it and timecode "00:00:31:08".

### Section 5 of 15: Act II · Strategy (Aurelius) · `design-refs/web/S04-strategy.png`
- **Composition:** high-right caption, subject left.
- **Background:** ink.
- **Subject (left half):** the Idea redrawn as a precise architectural blueprint in fine cream lines at 60%
  opacity. It has the same ribbon form, with construction lines, one faint dimension line with arrowheads, a
  circular section cut and a faint square grid behind it. A few lines in the blueprint are tinted royal indigo
  (#3D4BFF) as a thin identity accent.
- **The Lens:** a crisp circle about 220px across, outlined in a 1px cream line, sits over part of the blueprint.
  Inside it the same part of the form appears fully rendered in solid gold light, as if seen through a lens.
- **Text block, upper-right, right margin 64px, top about 180px:**
  1. "Strategy" in geometric sans, about 72px, cream;
  2. 16px below, "Aurelius" in geometric sans, about 44px, cream;
  3. 12px below, three stacked words in monospaced uppercase, muted: "BRANDS" / "STRATEGY" / "GROWTH";
  4. 20px below, "Builds brands that lead and last." in serif italic, about 30px;
  5. 20px below, a thin hairline, then two small sans lines in muted cream: "Discovery & Audit" and "Strategy &
     Positioning";
  6. below them, "Brand Strategy & Identity" in the same small sans.
- **Top bar** as in Section 3.
- **Scrubber:** the third tick is indigo, "Strategy" above it, timecode "00:01:02:16".

### Section 6 of 15: Act III · Story (Golden Guardian Productions) · `design-refs/web/S05-story.png`
- **Composition:** low-left caption, subject right.
- **Background:** ink, warmed by projected light.
- **Subject (right two-thirds):** the Idea is no longer lines. It has been rendered into a luminous surface that
  works as a projection screen: a curved sheet of warm gold light on which a soft, abstract moving image flickers
  (warm film grain, gentle magenta (#E8307F) light leaks at its edge as the house identity tint). A cone of
  projector light falls onto it from the upper left, with dust in the beam. It is cinematic and quiet.
- **Text block, lower-left, left margin 64px, max width about 540px:**
  1. "Story" in geometric sans, about 72px;
  2. 16px below, "Golden Guardian Productions" in geometric sans, about 40px, on one line;
  3. 12px below, stacked monospaced uppercase: "STORIES" / "VISUALS" / "IMPACT";
  4. 20px below, "Creates powerful stories that inspire and influence." in serif italic, about 30px;
  5. 20px below, a thin-outline pill button "ROLL".
- **Top bar** as in Section 3.
- **Scrubber:** the fourth tick is magenta, "Story" above it, timecode "00:01:44:02".

### Section 7 of 15: Act IV · Movement · `design-refs/web/S06-movement.png`
- **Composition:** top-left lead, marquee along the lower third.
- **Background:** ink.
- **Subject (centre-right):** the gold Idea bursting outward into many fine streams of gold light that flow
  towards the right edge of the frame, like a river delta seen from above, full of motion.
- **Top-left, margin 64px, top 140px:**
  1. "Movement" in geometric sans, about 72px;
  2. 16px below, "Sector-fluid. Results-focused." in serif italic, about 34px;
  3. 24px below, three short lines of small sans in muted cream: "Social Media Management" / "Performance
     Marketing" / "Public Relations & Media".
- **Across the lower third, full width, one line** of large geometric sans (about 60px, cream at 90%) running
  off both edges, with a small gold "✦" between the items: "D2C & E-commerce ✦ Funded Startups ✦ F&B & Restaurants
  ✦ Healthcare & Wellness ✦ Real Estate ✦ Education & EdTech".
- Below the marquee, a thin-outline pill button "LAUNCH".
- **Top bar** as in Section 3.
- **Scrubber:** the fifth tick is gold, "Movement" above it, timecode "00:02:20:11".

### Section 8 of 15: Act V · People (Valora and Asraya) · `design-refs/web/S07-people.png`
- **Composition:** centred low.
- **Background:** ink.
- **Subject (upper 60% of the frame):** small clusters of gold light points form loose constellations, suggestive
  of groups of people gathering: abstract, with no faces or figures drawn. Thin lines of light connect some
  clusters.
  - On the left side of the constellation field, soft coral (#FF6A3D) light tints a pair of clusters joined by a
    bridge of light.
  - On the right side, soft jade (#23C27C) light tints a calm, still cluster.
- **Lower half: a centred two-column text area, 120px between columns.**
  - **Left column:**
    1. "Valora" in geometric sans, about 44px;
    2. stacked monospaced uppercase: "PEOPLE" / "SKILLS" / "OPPORTUNITIES";
    3. "Bridges education with real-world opportunities." in serif italic, about 26px.
  - **Right column:**
    1. "Asraya" in geometric sans, about 44px;
    2. "PEOPLE" / "BALANCE" / "WELLBEING";
    3. "Enables people to live healthier, more meaningful lives." in serif italic, about 26px.
- Above both columns, centred: "People" in geometric sans, about 72px.
- **Top bar** as in Section 3.
- **Scrubber:** the sixth tick shows a coral half and a jade half, "People" above it, timecode "00:03:01:20".

### Section 9 of 15: Act VI · Futures (Rudra Yugen) · `design-refs/web/S08-futures.png`
- **Composition:** right-third caption, visual on the left two-thirds.
- **Background:** ink.
- **Subject (left two-thirds):** a vast three-dimensional lattice of fine gold lines and nodes receding into
  depth, like a crystal or neural structure. Bright signals of electric cyan (#0FB5E4) light travel along a few of
  its edges; the rest stays gold and calm. Crisp, precise, deep perspective.
- **Right third, right margin 64px, vertically centred:**
  1. "Futures" in geometric sans, about 72px;
  2. "Rudra Yugen" in geometric sans, about 44px;
  3. stacked monospaced uppercase: "INNOVATION" / "CULTURE" / "FUTURES";
  4. "Builds what's next at the intersection of creativity and technology." in serif italic, about 28px, over 3
     lines;
  5. a thin-outline pill "SPARK".
- **Top bar** as in Section 3.
- **Scrubber:** the seventh tick is cyan, "Futures" above it, timecode "00:03:38:05".

### Section 10 of 15: Act VII · Legacy · `design-refs/web/S09-legacy.png`
- **Composition:** centred statement, low.
- **Background:** ink.
- **The second-read moment:** for the first time the Idea is SOLID. In the centre stands a monumental abstract form
  of polished solid gold: the same folded ribbon shape now cast in metal, smooth and heavy. It rests on a dark
  reflective floor that shows a soft reflection, lit by one warm key light and a cool rim light, like a museum
  sculpture. It is the only solid object in the whole film, and it must not resemble a logo or letter.
- **Lower part, centred:**
  1. "Multiple verticals. One vision. Exponential impact." in geometric sans, about 64px, cream, over two lines;
  2. 20px below, "Disciplines today. A brighter tomorrow." in serif italic, about 30px, muted cream.
- **Top bar** as in Section 3.
- **Scrubber:** the eighth tick is gold, "Legacy" above it, timecode "00:04:10:00".

### Section 11 of 15: The Houses (hover-accordion slices) · `design-refs/web/S10-houses.png`
- **Composition:** a full-width component on a solid ink section.
- **Top-left, margin 64px:** "The Houses" is NOT shown. Instead, place a single line of small monospaced uppercase
  muted text, "A CREATIVE HOLDING COMPANY", as the only eyebrow.
- **Below:** five tall vertical slices side by side, spanning the width with 64px side margins. Each slice has a
  slightly lighter dark surface (#121726), sharp corners and a 1px hairline between slices, and is about 560px
  tall.
- **Four collapsed slices** each show a house name in geometric sans, about 36px, stacked word per line and set
  horizontally (not rotated), near the bottom: "Aurelius", "Valora", "Rudra Yugen", "Asraya". Each slice has a 3px
  vertical colour edge on its left side in its house colour: indigo #3D4BFF, coral #FF6A3D, cyan #0FB5E4, jade
  #23C27C.
- **The third slice is EXPANDED** (about three times wider) for "Golden Guardian Productions", with a 3px magenta
  (#E8307F) edge. It shows, from the top:
  1. the name in geometric sans, about 40px;
  2. stacked monospaced "STORIES" / "VISUALS" / "IMPACT";
  3. a hairline;
  4. four sans lines: "Film & Video Production", "Branded Content", "Live Events", "Creative IP Development";
  5. at the bottom, "Creates powerful stories that inspire and influence." in serif italic, about 26px.
- Calm, flat and precise. No shadows or icons.

### Section 12 of 15: Vision and Impact · `design-refs/web/S11-vision.png`
- **Composition:** left-third caption, right two-thirds visual.
- **Background:** ink.
- **Right two-thirds:** the solid gold monument from Section 10, seen closer and dimmed, partly out of frame on
  the right, with a soft reflection.
- **Left third, margin 64px:**
  1. a small monospaced uppercase label "VISION";
  2. 16px below, "To build an interdisciplinary ecosystem that creates meaningful opportunities, cultural value
     and long-term impact through creativity, education, production and innovation." in serif italic, about
     28px, cream, over about 6 lines;
  3. 48px below, the label "IMPACT";
  4. below it, six lines of geometric sans, about 24px, cream: "Skilled Talent" / "Stronger Brands" / "Meaningful
     Content" / "Innovative Solutions" / "Healthier Lives" / "A Brighter Tomorrow".

### Section 13 of 15: Credits, the founders · `design-refs/web/S12-founders.png`
- **Composition:** off-grid editorial.
- **Background:** ink.
- **Upper-left, margin 64px:** small monospaced uppercase muted "A KREATIF ATELIER FILM".
- **Centre-left:** four portrait prints fanned in a gentle arc and overlapping by about 24px. Each is a
  light-stone print (#E4E1DA) with a thin border and a deeper bottom border, like polaroids. Each print holds a
  photographic cut-out portrait of a person in formal dark clothing on the light background.
  - The prints are rotated −9°, −3°, 3° and 9°, with a soft shadow beneath.
  - The second print is lifted forward and upright (selected).
  - **Use neutral placeholder silhouettes for the faces.** The real founder photos will be placed in code.
- **Right of the arc, max width 440px:**
  1. "Rohan Yadav" in geometric sans, about 32px;
  2. "CO-FOUNDER & COO" in monospaced uppercase, muted;
  3. 16px below, "Rohan is the operational backbone of Kreatif Atelier, the force that translates creative vision
     into flawless execution." in serif, about 22px.

### Section 14 of 15: Credits, the work and the formats · `design-refs/web/S13-credits.png`
- **Composition:** stacked centre, like a film's end-credits roll.
- **Background:** ink. Text only, no imagery.
- **Centred columns, top to bottom:**
  1. a small monospaced uppercase label "SERVICES" above six lines of geometric sans, about 26px: "Brand Strategy &
     Identity", "Social Media Management", "Performance Marketing", "Creative Production", "Public Relations &
     Media", "Creative Direction & Campaigns";
  2. 64px below, three credit blocks side by side with 96px between them and no boxes or borders:
     - "Starter" / "₹25-35K" / "PER MONTH" / "Social media management" / "12 posts / month";
     - "MOST POPULAR" in small gold monospaced, above "Growth" / "₹55-75K" / "PER MONTH" / "Social media (2
       platforms)" / "Performance ads management";
     - "Brand Partner" / "₹1-1.5L" / "PER MONTH" / "Full-stack creative direction" / "Strategy + creative +
       production".
- In each block, the tier name is about 28px sans, the price about 44px sans, "PER MONTH" is monospaced muted and
  the features are 18px sans muted.

### Section 15 of 15: Post-credits (the CTA) · `design-refs/web/S14-contact.png`
- **Composition:** mini minimalist, centred.
- **Background:** the darkest ink (#070A12).
- **Centred:**
  1. a small gold "✦", about 40px;
  2. 40px below it, "Ready to build something worth remembering?" in geometric sans, about 64px, cream, over two
     lines, with "worth remembering?" in the same sans in italic;
  3. 24px below, "Every great brand started with a single conversation." in serif italic, about 26px, muted
     cream;
  4. 36px below, one gold pill button with dark text "SCHEDULE YOUR FREE BRAND AUDIT ✦";
  5. 24px below, "hello@kreatifatelier.com" in small sans with a thin underline, and beneath it "@kreatifatelier"
     in small sans, muted.
- The top bar is present.
- The bottom scrubber is complete: all ticks passed, and "Credits" appears as the act name.

---

## DESKTOP DETAIL IMAGES (1536 × 1024), for extraction precision

### Detail 1: the chrome (top bar and scrubber, close up) · `design-refs/web/D1-chrome.png`
- A close, larger render of just the top 120px and the bottom 120px of the Section 4 design, stacked with a band
  of plain ink between them, so the type and spacing are easy to read.
- **Top:** "Kreatif Atelier" at left, then the "SOUND ON" pill with five level bars and the "INDEX" pill at right.
- **Bottom:** the hairline with 8 ticks (the second tick gold), "Idea" above the playhead and "00:00:31:08" at
  the right.
- Show exact paddings and generous size.

### Detail 2: buttons and type specimen · `design-refs/web/D2-specimen.png`
- A design-system specimen sheet on ink, with generous spacing. Everything left-aligned in rows:
  1. "Kreatif Atelier" in the headline sans at 110px;
  2. "Strategy" at 72px;
  3. "Aurelius" at 44px;
  4. "Brand Strategy & Identity" at 24px;
  5. a body line in 17px sans, "Every great brand started with a single conversation.";
  6. a serif italic line at 34px, "We build brands that actually move people.";
  7. a monospaced uppercase label line, "DISCOVERY & AUDIT".
- Then a row of buttons: gold pill "WATCH", outline pill "DIRECT", outline pill "SOUND OFF", and a circular
  outline icon button with a thin "×".
- Include no labels naming the styles.

### Detail 3: the Lens, close up · `design-refs/web/D3-lens.png`
- A close-up of the blueprint Idea from Section 5, filling the frame. The fine cream construction lines, a
  dimension line and a section cut are clearly visible.
- The Lens circle (1px cream ring) sits at the centre, about 380px across in this crop, with the fully rendered
  gold form inside.
- No text.

### Detail 4: one house slice expanded, close up · `design-refs/web/D4-house-slice.png`
- A close, large render of the expanded "Golden Guardian Productions" slice from Section 11, with its neighbours'
  3px colour edges visible at the sides.
- All of its text is large and exactly as in Section 11.

### Detail 5: the founder print, close up · `design-refs/web/D5-print.png`
- A close render of one polaroid print from Section 13, upright, with its thin border, deeper bottom border and
  soft shadow, next to the name, role and bio text from Section 13 at large size.
- The portrait area is a neutral placeholder silhouette.

### Detail 6: one pricing credit block, close up · `design-refs/web/D6-credit-block.png`
- A close render of the "Growth" credit block from Section 14 at large size, with all of its lines:
  - "MOST POPULAR" / "Growth" / "₹55-75K" / "PER MONTH";
  - "Social media (2 platforms)" / "Performance ads management" / "1 brand video / month" / "Copywriting &
    design" / "Bi-weekly strategy calls" / "Detailed analytics";
  - "Ideal for growing brands ready to invest in multi-channel presence." in serif italic.
- No box around it.

---

## PHONE VIEWS (1024 × 1536, portrait)

**Mobile add-on block** (paste after the Global style block for every phone image):

> Show the website screen inside a clean, minimal modern iPhone mockup with a thin dark frame, centred with equal
> margins on a plain dark-grey canvas. The phone screen content is the main focus; the frame must not dominate.
> Respect the status bar and home indicator areas. All text on the phone screen is comfortably readable, with no
> tiny text. It is a single column, with side margins of about 20px (scaled).

### Phone 1 of 8: Gate · `design-refs/mobile/M01-gate.png`
- The phone screen is darkest ink.
- The gold "✦" sits a little above the middle.
- Below it, stacked full-width pills 12px apart: gold "ENTER WITH SOUND" and outline "ENTER IN SILENCE".
- Nothing else.

### Phone 2 of 8: Title card · `design-refs/mobile/M02-title.png`
- **Upper 55% of the screen:** the gold ribbon Idea, large.
- **Below it:**
  1. "Kreatif Atelier" in geometric sans, about 52px, over two lines ("Kreatif" / "Atelier");
  2. "Where Strategy Meets Story." / "Where Story Becomes Legacy." in serif italic, about 22px;
  3. two stacked full-width pills: gold "WATCH" and outline "DIRECT".
- **Top bar:** "Kreatif Atelier" small at left, and a small outline "INDEX" pill plus a small sound pill at right.
- **Bottom:** a thin scrubber line with only "Title" in small monospaced.

### Phone 3 of 8: Act II Strategy with the Lens · `design-refs/mobile/M03-strategy.png`
- **Upper 55%:** the blueprint Idea (fine cream lines), with the Lens circle open under a thumb, showing solid gold
  inside.
- **Lower area:**
  1. "Strategy" (about 40px);
  2. "Aurelius" (about 30px);
  3. stacked "BRANDS" / "STRATEGY" / "GROWTH" in monospaced;
  4. "Builds brands that lead and last." in serif italic, about 22px;
  5. a small muted sans line, "Hold to look".
- **Bottom:** the scrubber with "Strategy".

### Phone 4 of 8: Act IV Movement · `design-refs/mobile/M04-movement.png`
- **Upper half:** the gold streams flowing outward.
- **Below:**
  1. "Movement" (about 40px);
  2. "Sector-fluid. Results-focused." in serif italic (about 22px);
  3. one marquee line of large sans (about 34px) running off both edges: "Real Estate ✦ Hospitality ✦ FMCG ✦
     Automotive", with a gold ✦;
  4. an outline pill "LAUNCH".
- **Bottom:** the scrubber with "Movement".

### Phone 5 of 8: The Houses (vertical accordion) · `design-refs/mobile/M05-houses.png`
- Five stacked full-width rows on a slightly lighter dark surface, sharp corners, hairlines between them, each with
  a 3px house-colour edge on the left.
- Four rows are collapsed, showing just the name (about 26px): "Aurelius", "Valora", "Rudra Yugen", "Asraya".
- "Golden Guardian Productions" is expanded, showing:
  1. stacked "STORIES" / "VISUALS" / "IMPACT";
  2. "Film & Video Production", "Branded Content", "Live Events", "Creative IP Development";
  3. "Creates powerful stories that inspire and influence." in serif italic.

### Phone 6 of 8: Founders · `design-refs/mobile/M06-founders.png`
- A small monospaced "A KREATIF ATELIER FILM" at the top.
- A horizontal row of polaroid prints (light-stone mounts with neutral placeholder silhouettes). The first print
  is upright and fully visible; the next peeks in from the right edge.
- Below:
  1. "Gourish Girish Pillai" (about 26px);
  2. "FOUNDER & CEO" in monospaced;
  3. "The architect of Kreatif Atelier's vision, Gourish brings a rare combination of entrepreneurial acuity and
     creative instinct." in serif (about 19px).

### Phone 7 of 8: Post-credits CTA · `design-refs/mobile/M07-contact.png`
- Darkest ink, everything centred:
  1. a small gold ✦;
  2. "Ready to build something worth remembering?" (about 36px, over three lines, with "worth remembering?" in
     italic sans);
  3. "Every great brand started with a single conversation." in serif italic;
  4. a full-width gold pill "SCHEDULE YOUR FREE BRAND AUDIT ✦", allowed to wrap onto two lines at this width;
  5. "hello@kreatifatelier.com";
  6. "@kreatifatelier".

### Phone 8 of 8: Index overlay (menu) · `design-refs/mobile/M08-index.png`
- A solid darkest-ink overlay.
- At top right, a circular outline close button with a thin "×".
- A list of large geometric sans items (about 34px), left-aligned, with generous spacing: "Title", "Idea",
  "Strategy", "Story", "Movement", "People", "Futures", "Legacy", "Credits". "Strategy" is in gold (current).
- Below the list:
  - two pills side by side: outline "WATCH" and gold "DIRECT";
  - a text link "hello@kreatifatelier.com".

---

## Daylight suffix (use only if light stays the default, AUDIT C1)
> **Theme override:** instead of the dark room, use a calm neutral porcelain background (#EFEFEC, not cream or
> beige) with ink text (#0B0F1A) and muted text #55565E. The Idea stays gold light, lit like a studio object on a
> pale seamless background with soft shadows. The primary button is an ink pill with porcelain text (not gold).
> Hairlines are ink at 12% opacity. Everything else is identical.

## After generation
- **Drop the images into** `design-refs/web/` and `design-refs/mobile/` with exactly these names.
- **For each image I will:**
  1. write an analysis note in `docs/design/analysis/<name>.md` covering the visible text, type scale relationships,
     spacing, components, colours (sampled), layout grid and anything unclear;
  2. request a fresh standalone re-render (never a crop) of any detail that is unreadable;
  3. only then implement, and compare side by side before calling a section done.
- **The founder portraits:** the images use placeholder silhouettes on purpose. The code uses the real cut-outs.
