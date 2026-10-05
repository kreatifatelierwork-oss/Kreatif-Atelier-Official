# Reference analysis: "One Take Across the World" (v5)

Source: `design-refs/` (87 images from `docs/design/IMAGE-PROMPTS-v5.md`, analysed 2026-10-05 at 1400 px wide).
How to read an entry: **Frame** (composition, camera, layers), **Light** (one source, colour, atmosphere, depth of
field), **Text** (what, where, treatment, scale as a share of frame height at 1440 × 810), **Leads to** (how it hands
over to the next frame), **Drift** (what does not match the prompt or our rules, and what we do instead), **Build**
(how we make it).

Scale notes: the desktop frames are 1672 × 941 (16:9) except H01–H09 (1536 × 1024, 3:2). Percentages are of frame
height, so they translate directly to `vh`.

---

## 0. The check (Step 1)

| Group | Expected | Present | Notes |
|---|---|---|---|
| home/ H01–H36 | 36 | 36 | names exact |
| pages/ A01–A06, G01–G05, V01–V04, S01–S04, R01–R04 | 23 | 23 | names exact |
| graphics/ X01–X10 | 10 | 10 | names exact |
| plates/ P01–P18 | 18 | 18 | names exact; P02, P06, P11, P18 have real alpha |
| mobile/ M01–M06 | 6 | **0** | **missing**: the folder is empty |

All 87 files open and decode. No misnamed files. Findings that matter for the build (details in each entry):

1. **People in frame.** The SETUP says no people. Every company-page frame and H34/H35 has a backpacker in the
   foreground; GGP frames have crowds; S02 has a bather (face and shoulders). We do not build people. The figure's
   job in the composition (scale, a dark foreground silhouette on the left third) is taken by foreground rock,
   foliage or a lantern post.
2. **Emblems on banners and doors.** GGP banners carry a winged-beast crest, Asraya and Rudra Yugen banners carry a
   winged ring crest, Aurelius banners and doors carry an eight-point star medallion. These read as logos and break
   the no-logo rule. Banners are built plain (cloth, fringe, a thin gold border) or replaced by the ✦ motif only.
3. **Third-party logos.** A03 shows Instagram, YouTube, X and LinkedIn marks in the Social Media alcove. Never built;
   the alcove holds an abstract object.
4. **Invented copy** (text the images made up, none of it ours): A03 field-guide text and features, A04 tier bullets,
   G03 "Stories that turn brands into movements.", V02 "We build bridges between talent and opportunity…", S02
   "Restorative journeys…", R02 "A convergence of people, technology and ideas…", X01 body line, X10 field-guide
   text. The site uses only real copy from `content/*.ts`; the Valora / Rudra Yugen / Asraya paragraphs are drafted
   as PROPOSED, descriptive only.
5. **Typeface drift.** The SETUP asked for a geometric sans for headlines; every image sets in-world headlines in a
   high-contrast classical serif (close to Cormorant Garamond Medium, sometimes Trajan-like caps). See "Shared rules
   → Type" for how we handle it.
6. **Minor:** S01 act bar reads "00:00" (prompt "00:04"); the act bar times are ours anyway (real film time).

None of the 87 is so far off its prompt that it cannot be used as a reference.

---

## Shared visual rules (from all 87)

### Frame and camera
- **Lens:** wide (about 24–28 mm full-frame feel), camera at or slightly above eye height of the subject, horizon in
  the upper third on landscapes (y ≈ 30–42%), lower third on sky frames (y ≈ 60–75%).
- **Three layers, always:** a dark, soft, out-of-focus foreground framing one or both lower corners (rock, leaves,
  coral, snow, a lantern post); a sharp, lit midground subject; a hazy background that fades to the light colour.
  The foreground takes 15–30% of the frame and is the darkest value.
- **Depth of field:** the foreground is blurred heavily (bokeh), the subject is sharp, the far background is softened
  by haze more than by blur.
- **Every frame shows the way on:** a lit path, the gold route line, a bridge, a stair, a portal, or a glow on the
  horizon in the direction of the next chapter.

### Light
- **One key light per frame**, low and warm (sun at the horizon, a portal glow, the monument). Its colour is the
  land's colour mixed with gold. Shadows are deep and cool.
- **Volumetric rays** from the key through the haze; small warm practicals (lanterns) are the only other lights and
  never compete.
- **Atmosphere:** heavy aerial perspective. Distant layers lift toward the light colour. Mist sits in valleys.
- **Grain:** subtle film grain over everything. **Glow:** gold text and lines bloom softly (a 6–12 px halo at 1440).

### Text in the world
- **Headline:** classical serif, warm cream (#F6E7C8-ish) with a soft gold glow, sentence case, 6–9% of frame height
  (≈ 50–75 px at 1440). Centred on its subject or set in the empty sky third.
- **Ornament rule:** under almost every headline: thin gold line, a small gold diamond-star, thin gold line
  (total ≈ 24–34% of frame width).
- **Narration:** italic serif, cream, 2.6–3.2% of height (≈ 22–26 px), two lines, centred, under the ornament.
- **Callout (Oryzo):** gold ring (12–16 px) on the object, a 1 px gold leader that bends once at 45° or 90°, a small
  circular icon medallion (optional) and a label in serif at ≈ 2.4–2.8% height. Our version drops icons (no fake UI;
  pictograms read as stock).
- **Labels on diagrams:** monospace, ≈ 1.6–1.8% height, cream, a hairline under the label that runs from the leader.
- **Material type:** carved (deep V-cut, raking light on edges), mist (wisps, mirrored in water), ice (refracted,
  doubled, cyan edge light), light (glowing strokes in haze). One material per land.
- **Readability:** text always sits on the darkest or flattest area of the frame (sky, mist, shadowed rock), never on
  busy midground detail, and has a local darkening behind it (a soft radial vignette, never a box).

### UI chrome (identical in every "with UI" frame)
- **Top bar:** "KREATIF ATELIER" in tracked capitals, gold, ≈ 14 px, left 40 px, centre at y = 24 px. "Index" and
  "Sound" right, cream, ≈ 15 px, 60 px apart. A full-width hairline (1 px, cream ≈ 80%) at y ≈ 50 px.
- **Act bar:** a hairline at ≈ 92% of height from x ≈ 18% to the right margin; chapter name (serif, cream, ≈ 16 px)
  and the time (monospace, muted, ≈ 14 px) centred under it.
- **Journey trail:** a fine gold line rising from the bottom-left corner like an elevation profile, joining the act
  bar's hairline; a small bright dot on the hairline marks where you are. The trail is the route so far.
- **Buttons:** primary = a gold pill (gradient gold, dark serif label, ✦ after the label, ≈ 60 px tall at 1440,
  soft outer glow). Secondary = a dark translucent pill with a gold hairline border and an arrow. Stacked on the
  right third, 12–14 px apart.

### Colour per land (dominant inside its world, gold outside)
Jungle: deep greens, dawn gold. Sky/peaks: gold and peach on cream clouds. Aurelius: sandstone amber under indigo
dusk (#2B2F7A sky, #3D4BFF accents in portal light). GGP: magenta #E8307F light on dark rock, amber lanterns.
Valora: coral #FF6A3D sky over teal water. Asraya: jade #23C27C water, cream mist. Rudra Yugen: cyan #0FB5E4 ice and
aurora. Summit and night: gold on navy.

### Type decision
The images set in-world headlines in a classical serif, while C6 names Outfit for display. The build uses
**Cormorant Garamond 500–600** for in-world headlines and titles, because the images are the visual source of
truth for v5. Outfit is kept for UI labels and buttons, and IBM Plex Mono for diagram labels and time. One CSS
variable switches the in-world headline face, so if the user prefers Outfit it is a one-line change. This is listed
for the user's decision at the checkpoint.

---

## A. Home journey

Chapter 1–2 frames (H01–H09) are 3:2. On a 16:9 screen they are cropped top and bottom, so their compositions are
read from the middle 84% of their height.

### H01 · home/h01-flood-to-jungle.png: the flood clears into the jungle
- **Frame:** low, near the forest floor (camera ≈ 0.6 m), looking along a rocky stream that runs from the bottom-
  centre into the depth. Foreground: huge out-of-focus leaves fill the left 35% and the bottom-left corner. Midground:
  ferns, mossy boulders right of the stream (x 60–85%, y 62–82%). Background: tall trunks left, a misty valley with
  karst cliffs and a waterfall right (x 75–90%, y 10–35%), birds.
- **Light:** the sun behind the trees at x 40%, y 18%, a hot white-gold core with rays fanning down-right; warm mist
  over the stream. Deep green shadows.
- **Text:** none in the world (the gate's title has just gone). UI only. Act bar "The Seed 00:04".
- **The Idea:** a long, thin, glowing gold ribbon (x 37–72%, y 40–56%) threading through the midground toward the
  stream, its tail fading toward the light.
- **Leads to:** the stream leads the eye down the valley; the ribbon dips toward the leaf of H02.
- **Drift:** none. The gold flood itself is not visible (the frame is the moment after).
- **Build:** the locked gold flood dissolves onto this view. P01 as the far layer (valley, rays), a mid layer of
  trunks (P01 slice), 3D foreground leaves (instanced cards with the P02 leaf alpha) that the camera moves past,
  the stream as a reflective strip with drifting particles; volumetric rays as a screen-space god-ray pass from one
  light position.

### H02 · home/h02-seed-macro.png: the drop of gold on the leaf
- **Frame:** macro. A huge wet leaf fills the bottom 60% diagonally (from bottom-left to the right edge, rising to
  y 40%). A gold drop falls from the tip of a leaf above (x 50%, y 0–42%) and splashes at x 47%, y 60%; the splash
  becomes a gold ribbon that sweeps right and up to x 78%, y 30–55%. Background: a soft green-gold bokeh forest.
- **Light:** backlight from the top-right (rays through the trunks at x 85%), the drop itself glowing. Very shallow
  depth of field: only the drop, the splash and the near droplets are sharp.
- **Text:** narration in italic serif, cream with a faint glow, three lines, left-aligned at x 59%, y 22–36%, each
  line ≈ 4.5% of height ("Every great brand / started with a single / conversation."). It floats in the empty dark
  space right of the drop.
- **Leads to:** the ribbon's sweep points right and back into the forest: H03's path.
- **Copy:** "Every great brand started with a single conversation." is the first sentence of the contact body in
  `site.ts`. Used here word for word as an excerpt (the full line returns in chapter 12).
- **Build:** the leaf as a 3D plane with a wet leaf material (normal + roughness, droplets as small refractive
  spheres); the drop and splash as a short particle burst in gold; bokeh as a blurred P01 slice plus instanced bright
  discs; depth of field strong (desktop only; phones get a pre-blurred background).

### H03 · home/h03-jungle-title.png: "Kreatif Atelier" written in light
- **Frame:** a jungle path along the stream between enormous buttress roots that frame the left 30% and right 25%;
  hanging vines; a misty gap at the centre (x 30–70%) opens to sunlit trees and waterfalls. Camera ≈ 1 m, looking
  slightly up.
- **Light:** the sun high-centre behind the mist (x 55%, y 10%), warm haze filling the gap. The ribbon on the stream
  bottom-centre is the brightest object.
- **Text:** "Kreatif Atelier" in a light, geometric sans (Outfit-like) glowing gold, written across the mist at x
  33–67%, y 30–37%, ≈ 7.5% height, slightly rotated (≈ 3°) as if the camera is banking; below it the italic serif
  line "A creative holding ecosystem for a better tomorrow." (≈ 2.6%), also tilted, cream. Both sit in the mist
  (lower contrast at the edges), not on top of it.
- **Leads to:** the ribbon runs from the bottom-right up the stream into the gap: the path continues ahead.
- **Build:** this is the home's h1. The title is real DOM text, positioned with a 3D transform that matches the mist
  plane (perspective + rotateY/rotateZ from the camera), with a glow and a mist mask (CSS mask from a noise texture
  so the letter edges dissolve). The canvas renders the same words as a soft emissive card behind for the in-world
  light spill.

### H04 · home/h04-jungle-tagline.png: "Where Strategy Meets Story."
- **Frame:** a clearing with a stream and cascades; light rays from top-right (x 75%) through a canopy gap; a big
  vine trunk in the foreground at x 30% cuts through the text; leaves bottom-left, very soft.
- **Text:** two lines in the geometric sans, gold glow, ≈ 6% height each, set in perspective (receding to the right
  and down), x 22–72%, y 27–50%. The foreground vine passes in front of "Where" (twice), so the type is IN the scene.
- **Leads to:** the ribbon coils up out of the stream (x 37–60%, y 55–80%): it is about to rise (the climb).
- **Copy:** "Where Strategy Meets Story. Where Story Becomes Legacy." from `site.ts` hero, word for word.
- **Build:** the text card in 3D at depth, with a 3D vine (a tube) between it and the camera so it occludes the type
  as the camera passes; DOM text for screen readers carries the same words (the canvas text is decorative there, or
  the DOM text is placed exactly over it with the vine masked over in the canvas: see "Text system").

### H05 · home/h05-field-guide.png: four callouts pinned to trees
- **Frame:** along the stream path, two huge trunks left (x 0–30%) and right (x 78–100%), the stream and ribbon
  winding from the bottom-right into a misty waterfall gap (x 55–70%, y 20–40%). Foreground left: soft bokeh foliage.
- **Text:** four callouts, each a gold ring pinned on a trunk + a bent leader (45° then horizontal) + a heading in
  the geometric sans (≈ 3.2% near, 2.2% far) with a hairline + two body lines in monospace (≈ 1.6%). Sizes and
  sharpness fall off with depth: "What We Are" nearest and largest (x 24–39%, y 18–29%), "Where We Operate" (x 48–
  60%, y 32–39%), "Who We Work With" (x 74–85%, y 26–33%), "Our Philosophy" (x 84–97%, y 45–53%).
- **Drift:** the body lines are invented. We use the real About panels from `about.ts`: the heading on the callout
  and the panel's text in an anchored field-guide note that opens beside it when it is the nearest (the full text is
  too long for two lines).
- **Leads to:** the ribbon runs forward along the stream.
- **Build:** this is the callout system (X01) in its first use: world anchors on 3D trunks, DOM labels projected each
  frame, sizes scaled by depth, a blur/opacity falloff for far ones.

### H06 · home/h06-operate-map.png: "Where We Operate" on a giant leaf
- **Frame:** a giant translucent leaf in the foreground, tilted, filling x 0–63%, y 5–95%, backlit so its veins glow
  gold; the stream and ribbon recede on the right; rays from top-right.
- **Text:** heading "Where We Operate" in the geometric sans, gold glow, ≈ 6% height, x 61–89%, y 34–41%, with a
  hairline under it. Five map pins on the leaf (gold ring with a vertical drop line to a glowing dot), each labelled
  in the sans (≈ 2.4%): Secunderabad (top), Banjara Hills, Jubilee Hills, HITEC City, Gachibowli.
- **Drift:** in H06 the pins form a column; X05 places them like a real map (Gachibowli and HITEC City west,
  Secunderabad north-east). We follow X05's geography: west to east as on a map of Hyderabad.
- **Leads to:** the stream bends right; next is the climb up the tree.
- **Build:** a 3D leaf plane with a translucency (thin-surface) shader and an emissive vein texture (procedural:
  Voronoi veins + a gold contour pattern); pins as world anchors; labels as DOM.

### H07 · home/h07-climb-trunk.png: the philosophy spirals up the trunk
- **Frame:** a worm's-eye view straight up a colossal moss-covered trunk (centre, x 35–80%); the canopy and sky
  above; vines hanging; orchids and red bromeliads on the bark; birds top-right. Foreground: very soft leaves
  bottom-left.
- **Light:** sun from top-right (x 80%, y 15%), rays down across the trunk.
- **Text:** the quote in italic-less serif (Cormorant-like roman), gold, on four bands that wrap around the trunk,
  each band edged with a glowing gold line, ≈ 5.5% height for the lower bands and smaller as they rise (perspective).
  "We believe / the most powerful brands / are built at the intersection / of strategy and story."
- **Copy:** the quote in `about.ts` is "We believe the most powerful brands are built at the intersection of
  strategy and story. We bring both, and we bring them together without compromise." H07 shows only the first
  sentence. We run the full quote (both sentences, word for word) up the spiral: it is longer, so the spiral has more
  turns, which suits a longer climb.
- **Leads to:** the spiral and the ribbon disappear upward into the canopy.
- **Build:** the trunk as a tall 3D cylinder (bark texture from P17, moss), the text as a curved text strip
  (troika-three-text along a helix, or a canvas-text texture mapped on a helical ribbon mesh) that the camera rises
  past; the real quote is DOM text too (screen readers and search), shown flat when reduced motion is on.

### H08 · home/h08-canopy-layers.png: Ideas, People, Impact
- **Frame:** looking up and forward across three tiers of canopy, each a raised mound of crowns separated by cloud
  layers, receding to the top centre; the sun at x 70%, y 12%; the ribbon winds up through the three tiers.
- **Text:** "Ideas" on the nearest tier (≈ 13% height, x 30–58%, y 58–75%), "People" mid (≈ 7%, x 43–63%, y 37–
  44%), "Impact" far (≈ 5.5%, x 53–71%, y 16–22%), all in the geometric sans, gold, lit as if the letters are made of
  sunlight in the leaves. Each word lies on its tier (in perspective).
- **Copy:** `holding.motto` ["Ideas", "People", "Impact"].
- **Build:** three canopy planes (P03 slices) stacked in depth with cloud cards between them; each word as an
  emissive text mesh lying in its tier; the camera rises through them in order.

### H09 · home/h09-canopy-break.png: 5 Verticals, ∞ Creative Vision
- **Frame:** just above the canopy at sunrise, the sun on the horizon at the centre (x 52%, y 48%); the forest roof
  below to the horizon with mist rivers; leaves scatter past the lens (foreground, blurred, all edges).
- **Text:** two giant glyphs made of glowing cloud-light: "5" (x 29–40%, y 14–35%) and "∞" (x 54–79%, y 18–35%),
  ≈ 22% height, separated by a thin vertical gold rule at x 49%; captions under each in serif (≈ 5%): "Verticals",
  "Creative Vision", each with an ornament rule.
- **Copy:** "∞ Creative Vision" is the live site's hero stat; "5 Verticals" is the plan's wording (WORLD-PLAN.md),
  matching the five verticals on the chart. Both approved in the plan.
- **Leads to:** the open sky: the clouds of H10.
- **Build:** the glyphs as text meshes with a cloud-light shader (fbm noise inside the letter, bright rim), set in the
  sky; leaf particles (instanced cards) streaming past the camera as it breaks out.

### H10 · home/h10-clouds-holding.png: above the canopy, "A creative holding company."
- **Frame:** at the edge of the canopy (dark leaves and a cliff in the bottom-left 30%), looking out over a sea of
  cloud with forested karst islands; the sun on the horizon at x 51%, y 48%; the ribbon winds from the foreground
  toward the sun (x 30–55%, y 55–78%).
- **Light:** sunrise, gold-white sun, peach clouds, blue-grey sky at the top; the foreground in silhouette.
- **Text:** "Kreatif Atelier" in a large serif (≈ 12% height) centred at y 14–27%; "A creative holding company."
  (serif ≈ 4.5%) under it; ornament rule; "Multiple verticals. One vision. Exponential impact." in a tracked serif
  (≈ 2.6%) at y 38%. All cream with a soft glow, set in the sky.
- **Copy:** `holding.descriptor` is "A creative holding company" (no full stop); H10 adds one. We render the
  descriptor as written in `verticals.ts` and add no punctuation.
- **Leads to:** the ribbon flies to the sun; the peaks of H12 rise from this cloud sea.
- **Build:** P04 cloud sea as the far plate (wide 2.5:1, so the camera can pan); 3D cloud cards (soft sprites) in
  the near and mid depth that the camera flies over and through; the title as DOM text in the sky band.

### H11 · home/h11-vision-sky.png: the Vision across the sky
- **Frame:** low over the cloud sea; the sun at x 60%, y 50%; the ribbon draws a huge elliptical loop across the
  sky (x 3–99%, y 18–42%) and then curls down toward the sun.
- **Text:** "Vision" label (serif ≈ 2.6%) with an ornament under it at the top-centre of the loop; the vision
  sentence in a serif (≈ 3.6%), cream-gold, set ALONG the loop (curving with it) in two arcs.
- **Copy:** `holding.vision`, word for word.
- **Build:** the loop as a 3D ribbon (the Idea itself drawing it), the sentence as text on a curve: DOM SVG
  `<textPath>` over the canvas, projected from the 3D loop's points each frame (so it moves with parallax), plus a
  flat accessible copy.

### H12 · home/h12-five-peaks.png: "Five pillars."
- **Frame:** five peaks rise from the cloud sea in a row across the frame (summits at x 13, 32, 50, 70, 89%, y
  40–45%; the middle one tallest); the sun behind and right of the centre peak (x 57%, y 39%); a dark rocky
  foreground bottom 15%; faint gold contour lines drift over the clouds lower right.
- **Text:** heading "Five pillars." (serif ≈ 8.5%) centred at y 11–20%. Each summit has a ring, a vertical hairline
  up, a small dot and a horizontal hairline under the name (serif ≈ 3%): Creativity, Education, Production,
  Wellbeing, Technology. The labels form a gentle arc (the middle one highest).
- **Copy:** pillar names from `holding.pillars`. "Five pillars." is wording from the prompt pack (not in the content
  files); listed for approval.
- **Leads to:** the camera rises above the peaks for the atlas.
- **Build:** the five peaks as 3D displaced cones (procedural ridged noise, snow by slope and height, the rock
  texture tinted warm), sunk into cloud cards; labels as world anchors at the summits; contour lines as an SVG
  overlay pattern that drifts during the transition.

### H13 · home/h13-atlas.png: the atlas of the five lands
- **Frame:** a high oblique view (≈ 35° down) over the world like a relief map: indigo mountains top-left (Aurelius),
  magenta peaks top-centre (GGP), coral cliffs and sea right (Valora), jade lake and waterfall bottom-left (Asraya),
  blue glacier bottom-right (Rudra Yugen); clouds around the edges and the far horizon; the sun top-right.
- **Text:** each land has a ring on the ground, a vertical hairline up, and its name in serif (≈ 3%). The gold route
  is a glowing line on the ground joining all five.
- **Leads to:** the route's first leg descends toward Aurelius (top-left): chapter 5.
- **Order:** WORLD-PLAN's route order is Aurelius → GGP → Valora → Asraya → Rudra Yugen; the route in H13 follows
  that order (Aurelius, GGP, Valora, then down to Rudra Yugen and back left to Asraya is drawn as a loop; we draw it
  in plan order).
- **Build:** a terrain mesh (low-poly heightfield with five coloured zones by vertex colour + a painted texture),
  the route as a tube along a spline on the terrain, labels as anchors. One vivid colour per land; outside the lands,
  greens and gold.

### H14 · home/h14-aurelius-canyon.png: "Aurelius" carved in the canyon wall
- **Frame:** descending beside a huge sandstone cliff (right 60%) carved into a terraced city of stairs, arcades and
  banners; the canyon and river recede left to a sunset (sun x 20%, y 35%); a bridge crosses at y 70%.
- **Light:** golden hour turning indigo: warm horizon left, indigo sky top; the carved letters lit from within/edge;
  countless lantern practicals; a brazier at bottom-right.
- **Text:** "Aurelius" carved in the cliff (serif ≈ 13%, x 61–88%, y 16–33%) with glowing edges; "Brands. Strategy.
  Growth." carved under it (≈ 5%).
- **Drift:** banners with star medallions.
- **Build:** P05 canyon as far plate, a 3D cliff plane with the carved-type shader (X02), P06 rock foreground.

### H15 · home/h15-aurelius-callouts.png: four offerings as callouts on monuments
- **Frame:** flying along the terraces; the city climbs to the right; four lit monuments on the terraces (x 33, 47,
  67, 86%); river canyon and a crescent moon left.
- **Text:** four labels (serif ≈ 2.8%) with a vertical hairline and a dot down to each monument; narration
  "Builds brands that lead and last." italic (≈ 5%) at the bottom centre (y 78%).
- **Drift:** the monuments are figurative (a winged creature relief, a classical bust); built as abstract forms.

### H16 · home/h16-aurelius-portal.png: the portal, "Enter Aurelius"
- **Frame:** a carved arched doorway in the cliff (x 50–68%) glowing indigo inside, stairs up to it; a carved panel
  on the right (x 76–94%) with the six services as a list separated by small diamond rules; the gold route on the
  floor leads in. Left: the canyon at dusk.
- **Text/UI:** the six service names carved in the panel (serif ≈ 2.8%, rotated slightly by perspective); a quiet
  pill button "Enter Aurelius ›" (dark fill, gold hairline) beside the door at x 63–74%, y 51–56%.
- **Copy:** the six service titles from `services.ts`, word for word; "Enter Aurelius" (UI wording from the plan).
- **Build:** the portal as a 3D arch with an emissive inner plane (indigo); the button is a real link to /aurelius.

### H17 · home/h17-desert-to-cave.png: from the desert night into the cave mouth
- **Frame:** a cliff road (bottom-centre) curving right into a vast cave mouth (x 50–90%, y 10–60%) glowing magenta
  inside with a city within; colossal guardian statues either side of the mouth; the indigo canyon behind on the
  left. The gold route runs along the road into the mouth.
- **Text:** none (transition frame), act bar only.
- **Drift:** the statues are armoured figures (people); built without them (the mouth is framed by rock pillars).
- **Build:** the physical transition: the camera flies into a cave-mouth tunnel mesh; inside, the light colour
  crossfades from indigo to magenta as the light source changes (no screen fade).

### H18 · home/h18-cave-stories.png: "STORIES" behind the pillars
- **Frame:** inside the cavern: a painted rock wall on the left (gold-pink line paintings of a deer, an archer,
  riders, small figures), a river path and lit ledges bottom; giant letters "STORIES" stand in the middle distance
  (x 54–85%, y 43–68%) partly behind rock pillars and banners; a waterfall and arches right.
- **Light:** magenta from within the rock and the waterfall; small warm flames.
- **Text:** "Golden Guardian Productions" serif ≈ 6% at y 19% centred; "Stories. Visuals. Impact." tracked serif
  ≈ 3%; "STORIES" as giant 3D carved capitals (≈ 30% height) occluded by foreground rocks and banners.
- **Drift:** the wall paintings include human figures (an archer, riders). Ours are abstract animal and sign
  motifs only, original; small figures in the scene are left out.
- **Build:** giant type as 3D extruded text (or a text plane with depth) placed behind pillar meshes; the wall
  paintings as an emissive line texture that animates frame by frame as the camera passes (flipbook from the camera
  position, not time).

### H19 · home/h19-cave-projection.png: the projection on the waterfall mist
- **Frame:** a light shaft from a roof opening (x 60–70%, y 0–10%) falls onto a broad waterfall curtain (x 50–80%),
  which shows projected moving pictures; painted walls and banners left; robed figures left; a still pool below.
- **Text:** the four offerings as title-card lines stacked on the projection (serif ≈ 3%, each with an ornament
  rule); narration "Creates powerful stories that inspire and influence." italic ≈ 3.2% at y 75%; a quiet pill
  "Enter Golden Guardian Productions ›" at y 81%.
- **Drift:** the projected pictures show people (film crew, couples) and the scene has robed figures. Our
  projection shows abstract light pictures (moving shapes) only.
- **Build:** the waterfall as a scrolling translucent sheet with a projected animated texture; the four title lines
  as DOM cards over the projection, revealed one by one with camera progress.

### H20 · home/h20-cave-to-coast.png: out through a sea arch to the coral coast
- **Frame:** from inside the cave mouth (dark rock framing the top-left, left and right edges: a natural vignette),
  looking out at towering coastal cliffs with a city, waterfalls into the sea, sea stacks and an arch (x 84–97%);
  the sun on the horizon at x 81%, y 37%; the route runs along a ledge on the left. A last magenta glow on the far
  left wall (the cave behind).
- **Text:** none (transition).
- **Build:** the cave-mouth frame is a 3D rock ring the camera flies through; the light source swaps from the cave's
  magenta to the coral sun as the mouth passes the camera.

### H21 · home/h21-valora-islands.png: "Valora" reflected on the water
- **Frame:** an archipelago of small islands with palaces joined by arched bridges of light; floating lanterns on the
  water; a sailing boat; the sun on the horizon at x 76%, y 15%.
- **Text:** "Valora" serif ≈ 13% at x 40–68%, y 50–66%, lying ON the water surface (slight perspective) with its
  reflection below; "People. Skills. Opportunities." tracked serif ≈ 3.5% under it, reflected too.
- **Build:** the text on a water plane: render the text into the reflection pass with a ripple distortion.

### H22 · home/h22-valora-reef.png: the reef, four lanterns
- **Frame:** underwater: sunken arches and ruins in the middle distance, coral foreground both sides, a fish school
  forming two arches across the frame (y 15–40%), rays from the surface top-right, a turtle.
- **Text:** the four offerings as lanterns (cream paper glowing warm) with a pictogram and the name (serif ≈ 2.4%);
  narration italic ≈ 3.2% at y 71%; ornament; the pill "Enter Valora ›" at y 79%.
- **Drift:** pictograms on the lanterns (we drop them).
- **Build:** P09 reef plate + 3D coral cards foreground + caustics overlay; lanterns as small emissive 3D boxes with
  DOM labels projected onto them.

### H23 · home/h23-reef-to-lake.png: breaking the surface into the jade lake
- **Frame:** a split over/under shot: the waterline at y 72%; below, jade water with rocks and rays; above, a still
  lake to karst peaks with pagodas, waterfalls and mist; bamboo frames the top-left and right; a lantern right.
- **Light:** the sun at x 70%, y 16%, soft and warm through mist; jade below.
- **Text:** none (transition).
- **Build:** the camera rises through a water-surface plane (refraction below, droplets on the "lens" as it breaks
  through: a short screen-space droplet pass); one shared lake plane continues into H24.

### H24 · home/h24-asraya-lake.png: "Asraya" written in the mist, mirrored in the lake
- **Frame:** a hot spring in the foreground (x 10–65%, y 66–100%) with a balanced stone stack (x 21–28%, y 55–68%),
  a pavilion and bamboo left; the still lake behind, karst peaks, the sun at x 71%, y 20%.
- **Text:** "Asraya" in a jade-white serif ≈ 11% at x 43–65%, y 35–46%, softly glowing as if made of mist; ornament;
  "People. Balance. Wellbeing." ≈ 3.5%; both mirrored in the lake (x 43–65%, y 57–68%).
- **Build:** mist type (X03) over the lake plane, reflection pass.

### H25 · home/h25-asraya-lanterns.png: four floating lanterns, the stone gateway
- **Frame:** four paper lanterns floating on the lake in the near-middle distance (x 18–93%, y 45–66%); a stone
  gateway at the far shore (x 48–62%, y 22–45%) glowing; water lilies in the foreground corners; small lanterns
  everywhere on the water.
- **Text:** the four offering names on the lanterns (serif ≈ 2.4–2.8%) with small leaf/lotus engravings (decorative
  plant drawings, fine; no pictograms). Narration italic ≈ 3.2% at y 72%; pill "Enter Asraya ›" at y 80%.
- **Build:** four lantern meshes (box with an emissive paper shader) bobbing on the lake; labels as DOM.

### H26 · home/h26-lake-to-ice.png: up to the glacier, into the ice cave
- **Frame:** a snowy rock slope (foreground bottom 25%) climbing to a huge ice-cave mouth (x 40–100%, y 0–60%)
  glowing cyan inside; the valley of mist and lakes behind on the left with the sun at x 9%, y 30%.
- **Text:** none (transition).
- **Build:** the camera climbs the slope and enters the cave mesh; the key light swaps from warm sun to the cave's
  cyan.

### H27 · home/h27-rudra-ice.png: "Rudra Yugen" frozen in the crystal
- **Frame:** a cathedral of ice: a cluster of huge clear crystals in the centre (x 30–70%, y 10–65%), ice arches both
  sides, a frozen pool in the foreground reflecting everything; a light shaft from the top.
- **Text:** "Rudra Yugen" in ice type (X04) ≈ 9% inside the central crystal at y 40–48%; ornament;
  "Innovation. Culture. Futures." ≈ 3.5%; reflected in the pool. Four callouts with bent leaders from crystal facets
  to labels (serif ≈ 2.4%), with pictogram medallions (dropped in our build).
- **Build:** crystals as low-poly 3D prisms with a refractive/transmission material (desktop) or a fresnel fake
  (phones); text inside via the ice-type shader; DOM callouts.

### H28 · home/h28-rudra-aurora.png: the aurora, the ice gate
- **Frame:** out of the ice onto a glacier plateau above the clouds; a cyan aurora overhead resolving into fine
  constellation lines (dots joined by thin lines); an ice gate glowing cyan at x 72–80%, y 30–60%; ice cliffs left.
- **Text:** narration italic ≈ 3.2% at y 69–73% (two lines); pill "Enter Rudra Yugen ›" at y 80%.
- **Build:** P13 tinted toward #0FB5E4 as the far layer; the line network as GL lines in the sky; the gate a 3D arch.

### H29 · home/h29-summit-monument.png: the monument, "Disciplines today. A brighter tomorrow."
- **Frame:** a rocky summit (bottom-centre) with a round plinth holding the polished gold folded-ribbon monument
  (x 47–57%, y 46–68%); below, all five lands across the cloud sea joined by the gold route (coral coast left,
  cyan glacier right); the sun at x 13%, y 21%.
- **Text:** two lines in serif ≈ 8% at y 14–29%, centred; ornament.
- **Build:** the Idea's ribbon geometry made solid (metal material, HDRI reflections); the lands as the atlas
  terrain from H13 at dusk.

### H30 · home/h30-summit-serves.png: "Our ecosystem serves"
- **Frame:** high above the summit; six glowing trails run from the monument down the mountain to six settlements.
- **Text:** heading serif ≈ 7% at y 16%; six labels (serif ≈ 2.4%) each with a ring and a pictogram medallion
  (dropped) at the trail ends.
- **Copy:** `serves` and `holding.labels.serves`, word for word.
- **Build:** trails as tubes along terrain splines, drawn progressively; DOM labels at the ends.

### H31 · home/h31-summit-impact.png: "Impact", six beams
- **Frame:** the same summit; six straight gold beams radiate from the monument to markers on six settlements.
- **Text:** heading "Impact" serif ≈ 9%; six labels (serif ≈ 2.4%) with a vertical beam marker; pictograms dropped.
- **Copy:** `impact`, word for word.

### H32 · home/h32-why-us.png: "What makes us different." as a field journal
- **Frame:** blue hour; the monument at left; an open journal (two pages, aged paper, brass corners) floating right
  (x 40–90%, y 22–70%) with six notes, each with a hand-drawn engraving (compass, gears, chart, a Charminar-like
  building, bulb, globe).
- **Text:** heading serif ≈ 7%; six note titles in serif ≈ 2.4%.
- **Drift:** a hiker (removed); the Charminar engraving (left out). The real Why Us points (title + text) from
  `why.ts` are set in the journal.
- **Build:** X10's field-guide panel in its two-page form.

### H33 · home/h33-credits.png: "Built by leaders who dare to create."
- **Frame:** night above the clouds; the monument small at lower-left; the five lands lit below; Milky Way.
- **Text:** heading serif ≈ 7%; four empty portrait frames (warm-grey paper inserts, thin gold frames with a small
  diamond at the bottom) at y 26–53%, each with name (serif ≈ 2.4%) and title (≈ 1.9%), ornament.
- **Copy:** names and card titles from `founders.ts` word for word.
- **Build:** credits roll upward with camera progress (DOM); frames are blank paper inserts ready for photos.

### H34 · home/h34-industries-stars.png: "Sector-fluid. Results-focused."
- **Frame:** night sky over the cloud sea from the summit; the Milky Way crosses diagonally from top-centre to
  upper-right. Horizon at 62%. Foreground: summit rock and snow, bottom 20%, with the gold monument on its plinth at
  far left (x 12–22%). Midground: the five lands as glowing cities on islands in the cloud, joined by the gold route
  (y 68–90%), cyan glacier city at the right.
- **Light:** the setting sun at the horizon far left (x 8%), warm, and the stars; the monument glows. Navy and gold.
- **Text:** headline serif cream with glow, centred at y 15%, ≈ 7% height; ornament rule below. Thirteen stars
  (bright gold four-point flares with a ring) joined by thin gold lines into one constellation across y 18–58%,
  each labelled in monospace (≈ 1.7%) with a hairline under the label. Labels sit to the side of the star with a
  short leader, never over the line.
- **Leads to:** the route below runs right and down toward H35's descent.
- **Drift:** a hiker at left (removed). Constellation order is decorative; the 13 names match `industries.ts`
  exactly.
- **Build:** P15 night sky as the far plate; the constellation as real 3D points + lines in the sky dome (so it
  parallaxes very slightly); labels as DOM text projected from the star positions; the cloud cities reuse the atlas
  layer from H13 at night.

### H35 · home/h35-process-trail.png: "Our process is built for speed."
- **Frame:** descending the mountain at night. Left 45%: a lantern-lit snowy trail in the foreground going down and
  right. Right: the cloud sea and the lit lands far below; cyan glacier glow at x 88%.
- **Light:** lanterns along the trail (warm), starlight; the monument sits at the top-left corner (x 5%, y 30%).
- **Text:** headline centred at y 16%, ≈ 7%; a gold elevation-profile line starts at the monument and runs right
  across y 33–52%, falling and rising gently, ending in an arrow at the right margin. Five waypoints (ring + dot)
  with labels in serif above (≈ 2.4%) and a small icon medallion above each label; a short dashed tick links label
  to waypoint.
- **Leads to:** the profile's arrow points right/down toward the dawn (H36).
- **Drift:** the hiker; pictogram icons (we drop them, labels only); serif labels where X08 uses monospace. We follow
  X08's monospace for the waypoint labels (diagram text) and keep the step titles in serif in the DOM list.
- **Build:** the profile as an SVG/line in screen space anchored to the world (it scrolls with the descent), drawn
  progressively by camera progress; waypoints light as you pass them.

### H36 · home/h36-return-dawn.png: "Ready to build something worth remembering?"
- **Frame:** a ruined stone plinth (round, stepped) in a jungle clearing at dawn, left-centre; the small gold ribbon
  floats above it (x 30%, y 37–55%). A giant tree frames the left edge; foreground leaves bottom-right. Background:
  a valley with a city at sunrise (Hyderabad-like skyline with the Charminar at x 88%).
- **Light:** the sun low at x 35%, y 27%, warm peach; mist in the valley.
- **Text:** headline right-aligned block centred at x 72%, y 23–31%, two lines, ≈ 7.5% each; ornament rule; the gold
  pill button "Schedule Your Free Brand Audit ✦" at y 45% (≈ 8% tall, 33% wide); email and location lines with
  small line icons (≈ 2.2%); a tiny gold contour outline of Hyderabad with a pin and "Hyderabad" label (x 66–84%,
  y 64–82%). Footer "© 2026 Kreatif Atelier" bottom-right on the act-bar line.
- **Leads to:** the end; the ribbon rests where H01 began.
- **Drift:** the Charminar is a real landmark; acceptable as a distant silhouette but we leave it out (the
  contour map already locates Hyderabad, and a detailed monument would be a second subject).
- **Build:** P16 dawn clearing as the far plate, P02 leaves as the foreground; the plinth as a simple 3D stepped
  cylinder with the stone texture from P17; the map as an SVG of a stylised outline (not a real boundary trace,
  labelled "Hyderabad" only).

---

## B. Company pages

### A01 · pages/aurelius-01-portal.png: "Aurelius", arrival through the doors
- **Frame:** looking out through a pair of huge carved doors that frame the left and right 22% (glowing amber
  carving). Beyond, the hidden canyon city at indigo dusk: tiered palaces, waterfalls, an aqueduct bridge, a lake.
  Vanishing point centre, y 48%.
- **Light:** indigo dusk sky with a sunset band low left; the city lit by countless warm lanterns; the door carving
  glows from within. Fog at the base of the waterfalls.
- **Text:** "Aurelius" carved/embossed metallic gold serif with a ✦ dot on the i, centred at y 22%, ≈ 13% height;
  ornament rule under it.
- **Leads to:** the stair in A02.
- **Drift:** the eight-point medallions on the doors (emblem-like). Built as abstract geometric carving (concentric
  arcs and lines), no medallion.
- **Build:** doors as two 3D slabs with an emissive carved-groove texture, opening as the camera passes (the "world
  transition"); the city is P05 plus a city layer.

### A02 · pages/aurelius-02-arrival.png: Brands. Strategy. Growth.
- **Frame:** a monumental stair rising from the bottom-centre to an arched gate; a carved wall on the left with the
  tagline; cliffs and palaces to the right with waterfalls.
- **Light:** warm lanterns and the gate's glow; indigo sky top-right.
- **Text:** "Brands. / Strategy. / Growth." carved into the wall (three lines, ≈ 8% each, cream glow, left at x 18%,
  y 15–50%). Narration "Builds brands that lead and last." italic, ≈ 5.5% height, at x 60–83%, y 41–50%; ornament
  rule; the agency paragraph in serif ≈ 2.4% with a gold vertical bar on its left (anchored narration).
- **Leads to:** the ribbon leads up the stair to the gate.
- **Drift:** hiker; banners with star medallions.
- **Build:** the stair as a strip of 3D steps; wall text as embedded type on a wall plane; the paragraph anchored
  beside the stair.

### A03 · pages/aurelius-03-services.png: the six alcoves
- **Frame:** a long arcaded hall receding to the right, six tall arches each holding a glowing object; a field-guide
  page on a lectern at left (x 8–39%, y 40–75%); a bridge and waterfalls lower right.
- **Light:** warm; each alcove has its own glow (allowed: practicals of one colour).
- **Text:** the six service names in serif above their objects (≈ 2.4–3%), centred in each arch. The page: two
  columns, heading in serif, "What It Is" and "How It Works" with small list items with icons.
- **Drift:** the Social Media alcove shows third-party logos; the page text is invented; icons.
- **Build:** alcoves in 3D (arches as instanced geometry), each holding an abstract object (an armillary, a cluster
  of tiles, a rising bar form, a lens, a horn shape, a compass rose; all original, simple, no logos). The field-guide
  page uses X10's look with the real "What It Is" / "How It Works" / features from `services.ts`.

### A04 · pages/aurelius-04-strata.png: "Choose your creative partnership."
- **Frame:** the cliff on the right 62% as three stacked strata slabs: cream limestone (Starter), red sandstone
  (Growth), dark schist (Brand Partner); each band glows gold along its edge. Canyon city in the background left.
- **Text:** headline left (x 6–27%, y 14–34%, three lines, ≈ 6.5%), ornament, gold "Enquire ✦" pill. On each band:
  name (serif ≈ 4.5%), price (serif ≈ 3.5%), "per month" (≈ 1.8%), a "Most Popular" gold tag on Growth, then four
  bullets with icons in a column at x 60–85%, and an engraved sketch at the far right.
- **Drift:** the bullets are invented and the engravings are decorative scenes. We use the real tier items and
  "Most Popular" from `engagement.ts`; no engravings (one subject).
- **Build:** three 3D slabs with the P17 sandstone texture tinted per band; text as DOM anchored to each band
  (field-guide layout on the rock face, high contrast).

### A05 · pages/aurelius-05-offerings.png: four chambers
- **Frame:** a sweeping side-on shot of four carved chambers along a cliff, each with a lantern and a carved name;
  aqueduct and waterfalls right; dusk band far right.
- **Text:** the four offering names carved in serif, ≈ 4.5%, centred above each chamber's object, small ornament.
- **Drift:** statues of people (figures) and a bust; built without figurative statues (abstract objects only).
- **Build:** this is the per-offering chapter layout for Aurelius: the camera visits each chamber in turn.

### A06 · pages/aurelius-06-exit.png: onward
- **Frame:** high terrace at night overlooking the city; the gold route winds from the centre to a distant mountain
  with a magenta glowing cave (x 85%, y 18%). Crescent moon.
- **Text/UI:** three stacked buttons right (x 69–97%, y 53–80%): "Next: Golden Guardian Productions →" (outline),
  "← Back to the Atlas" (outline), "Enquire ✦" (gold pill).
- **Build:** the exit layout for every company page: route to the next land's glow, three buttons.

### G01 · pages/ggp-01-portal.png: inside the cavern, the giant zoetrope
- **Frame:** a vast magenta cavern; a gold drum-shaped zoetrope (x 55–78%, y 12–60%) on a waterfall-ringed plinth;
  winged statues either side; a light shaft from the roof; a waterfall on the left with a projected winged horse.
- **Light:** magenta from above and behind, amber from the zoetrope; mist.
- **Text:** "Golden Guardian Productions" serif cream glow, two lines at x 12–45%, y 19–35%, ≈ 7.5%; ornament.
- **Drift:** the crest banner, winged statues (literal fantasy creatures; we keep the scene abstract).
- **Build:** the zoetrope as a 3D cylinder with a scrolling frame texture made of simple gold line drawings
  (abstract shapes, original), the projected shape on the mist as an animated sprite.

### G02 · pages/ggp-02-zoetrope.png: Film & Video Production
- **Frame:** close to the drum, which fills the right 60%; its panels show gold line drawings (a horse, a mountain, a
  face, a tree, a ship). Cinema cameras on tripods at right.
- **Text:** chamber title serif ≈ 7.5% at x 17–40%, y 23–36%; ornament; narration italic ≈ 3.2%.
- **Drift:** the face panel (a person); cameras are fine but busy. Our panels use abstract gold line forms only.

### G03 · pages/ggp-03-shadowplay.png: Branded Content
- **Frame:** a single brazier flame (x 28%, y 60%) throws giant shadow shapes across a sweeping rock wall that fills
  the right 65%: silhouettes of a woman's head, birds, a mountain, a bridge.
- **Text:** title serif ≈ 7.5% at x 18–34%; ornament; italic line (invented copy; replaced).
- **Build:** a flame light + a large wall plane; shadow shapes as animated silhouettes (abstract, no faces).

### G04 · pages/ggp-04-lightpainting.png: Live Events / Creative IP Development
- **Frame:** split screen: left, an arena with swirling light-painting trails over a stage and a crowd; right, a
  camera-obscura room with a projector throwing an inverted city onto the wall.
- **Text:** both titles serif ≈ 6%, each centred over its half.
- **Drift:** crowds and a person. Built as two adjacent chambers without people.

### G05 · pages/ggp-05-reel.png: Creative Production, the showreel
- **Frame:** a long gallery wall facing the camera with four empty frames (warm-grey paper inserts) under arched
  name plates; a magenta waterfall opening at left; a carpet leading in.
- **Text:** "Creative Production" serif ≈ 7% centred at y 20%; four feature names with small icons (≈ 2%); two
  outline buttons right.
- **Build:** this is exactly the "empty frames with blank paper inserts" requirement. The four names are the real
  Creative Production features from `services.ts`.

### V01 · pages/valora-01-portal.png: "Valora", surfacing
- **Frame:** a split over/under-water shot: the waterline at y 55%; above, an archipelago with palaces, waterfalls
  and bridges at coral sunset; below, a reef with an arch and fish.
- **Text:** "Valora" serif cream glow centred at y 18%, ≈ 11%; ornament.
- **Build:** the waterline split is a strong transition device: a 3D water plane the camera rises through.

### V02 · pages/valora-02-islands.png: Student Capability Ecosystem / Industry Connect
- **Frame:** flying low along a lit bridge that curves from bottom-left to the right; islands with palaces left and
  right; sailboats.
- **Text:** two labels each with an icon medallion, ornament and a vertical leader dropping to its landmark; a
  two-line italic narration between them with a vertical gold rule.
- **Drift:** invented narration; banners with star medallions.

### V03 · pages/valora-03-reef.png: Mentorship & Placement / Global Opportunities
- **Frame:** underwater; a fish school forms an arch over a sandy path to a sunken city; coral both sides; rays.
- **Text:** two callouts with ring icons and bent leaders down to coral structures; centred italic narration
  "Bridges education with real-world opportunities." (≈ 3%).
- **Build:** the fish arch as an instanced boid-like ribbon of small fish sprites following a curve.

### V04 · pages/valora-04-exit.png: onward to Asraya
- **Frame:** terrace with a colonnade at left; a long bridge of light leads to a misty jade valley with a glowing
  gateway (x 80%, y 25%).
- **UI:** "Enquire →" (gold outline, filled), "Next: Asraya →", "← Back to the Atlas" stacked right.

### S01 · pages/asraya-01-portal.png: "Asraya", through the gateway
- **Frame:** through a stone gateway (pillars left and right 20%), a hidden valley of karst peaks, terraced pools,
  pagodas, mist.
- **Text:** "Asraya" in grey-green carved/mist serif, centred y 30%, ≈ 9%; ornament.
- **Drift:** crest banners; act bar 00:00.

### S02 · pages/asraya-02-springs.png: Wellness Experiences / Retreats & Programs
- **Frame:** terraced hot-spring pools stepping down from left to right, steam; pagoda left; jade river and bridge
  right.
- **Text:** two labels with lotus/leaf medallions, ornament, vertical leader to a terrace; italic narration (invented).
- **Drift:** a bather (person) in the foreground pool.

### S03 · pages/asraya-03-bamboo.png: Mindfulness & Lifestyle Tools / Community Spaces
- **Frame:** a cathedral of bamboo; stepping stones across a stream to a woven bamboo arch structure; lanterns.
- **Text:** two callouts with medallions and bent leaders; narration "Enables people to live healthier, more
  meaningful lives." centred (≈ 3%).

### S04 · pages/asraya-04-exit.png: onward to Rudra Yugen
- **Frame:** a stone stair up a hillside with banners; a towering blue glacier with a glowing gate (x 76%, y 22%).
- **UI:** the three stacked buttons right.

### R01 · pages/rudra-01-portal.png: "Rudra Yugen", the frozen cathedral
- **Frame:** a cathedral of ice: crystal pillars, waterfalls, bridges; a glowing gate at the vanishing point.
- **Text:** "Rudra Yugen" in ice (cyan-white, refracted), centred y 22–35%, two lines ≈ 9%.

### R02 · pages/rudra-02-lattice.png: Emerging Tech & AI / R&D and Innovation Labs
- **Frame:** a huge vertical crystal lattice with spiral ramps in the centre; crystal clusters left and right.
- **Text:** two callouts with medallions and bent leaders; centred italic narration (invented copy).

### R03 · pages/rudra-03-aurora.png: Cultural Projects / Strategic Ventures
- **Frame:** a glacier under an aurora; the aurora resolves into fine geometric lines (a star, circles, a vertical
  axis); an ice sculpture (a seated figure) left and crystal towers with orbit rings right; an ice city at the
  vanishing point.
- **Text:** two callouts; narration "Builds what's next at the intersection of creativity and technology."
- **Drift:** the figurative ice sculpture; built as an abstract crystal form.

### R04 · pages/rudra-04-exit.png: onward to Aurelius (and the summit)
- **Frame:** a ridge of snow and blue crystal at left; the gold route climbs across peaks to a gold spired summit
  city with a ring (x 68%, y 10–25%).
- **UI:** the three stacked buttons right.

---

## C. Graphic treatments (the exact look of each)

### X01 · graphics/x01-callout-style.png: callout
Three variants on a blurred jungle: a ring (14 px outer, 6 px dot) on the object; a 1 px gold leader that runs at 45°
then horizontal (left- and right-pointing) or straight up (vertical); a mono index "01" (≈ 1.6%) with a short rule
under it; the label in a medium geometric sans (≈ 2.6%, cream); two body lines in sans (≈ 1.9%, cream 75%). Note:
**this sheet uses the sans** (Outfit-like) for callout labels, unlike the frames. We follow X01 for callouts (sans
label, mono index) since it is the dedicated style sheet. The body line is invented; ours uses real copy.

### X02 · graphics/x02-carved-type.png: carved type
A bold old-style serif cut deep into sandstone with a V-groove; raking warm light from upper left catches the top
edges; sand collected in the grooves; the stone has pits and cracks. Build: a carved-text shader on the wall plane
(a normal map generated from an SDF of the text, plus ambient occlusion in the groove), lit by the scene's one key.

### X03 · graphics/x03-mist-type.png: mist type
A flowing serif made of glowing smoke wisps over a still jade lake, mirrored in the water with ripples. Build: SDF
text rendered as a soft emissive field displaced by curl noise, plus a reflection pass on the lake plane.

### X04 · graphics/x04-ice-type.png: ice type
A serif frozen inside a cracked ice block: the letters have bright refracted edges, a doubled offset, crack lines
crossing them. Build: SDF text with a chromatic split edge highlight, behind an ice slab with crack normal map.

### X05 · graphics/x05-contour-map.png: contour map on a leaf
A translucent backlit leaf whose veins double as gold map lines; five glowing points with mono labels and bent
leaders; heading "Where We Operate" in a tracked serif with a short rule. Build: a 3D leaf plane with a
translucency shader; the five points as world anchors with DOM labels.

### X06 · graphics/x06-star-chart.png: star chart
An antique celestial atlas redrawn in fine gold: concentric circles, dashed meridians, small planet engravings at
the corners, one constellation of 13 four-point stars joined by thin lines; mono labels with a dot-leader. Build:
an SVG layer in the sky dome (circles and meridians at 10–15% opacity) plus the constellation.

### X07 · graphics/x07-strata.png: strata
A real cliff cross-section: cream limestone, red sandstone, black schist; gold wavy lines at the boundaries; a
ring on each band with a leader to the label "Starter" (serif ≈ 3.5%), a hairline, then "₹25-35K per month" in
mono (≈ 2%). Build: as A04 but with X07's labelling (serif name, mono price).

### X08 · graphics/x08-elevation.png: elevation profile
One fine gold line tracing a mountain ridge silhouette with five waypoint rings and mono labels on straight
vertical ticks. Build: the profile follows the real ridge in the scene (the line is the terrain's skyline).

### X09 · graphics/x09-title-card.png: film title card
Black letterbox bars (≈ 7% top and bottom) over a blurred magenta cave; centred title in a tracked serif (≈ 6%),
ornament rule, "Chapter Six" in tracked small caps serif (≈ 2.8%). Build: the chapter-opening overlay. Note: we
write the chapter number as words ("Chapter Six") as in the card; this is new UI wording and is listed for approval.

### X10 · graphics/x10-field-guide.png: field-guide page
A torn-edge sheet of dark paper/slate leaning in front of a canyon: mono index "01" top-left; title serif ≈ 9%;
"What It Is" and "How It Works" in tracked serif with mono body; a hand-drawn gold engraving (a route over a
mountain) top-right with a compass; four feature columns at the bottom with line icons, divided by hairlines.
Build: a DOM panel with a paper texture background (not frosted glass), unfolding with a 3D hinge transform; real
copy from `services.ts`; no icons; one engraving per service drawn as a simple SVG route.

---

## D. Plates (building material)

| Plate | What it is | Use |
|---|---|---|
| P01 jungle-bg | karst jungle valley at dawn, sun top-right, god rays, mist layers | far layer for ch. 1 and 12; split into 3 depth slices by luminance/mask |
| P02 jungle-fg (alpha) | monstera, ferns, vines framing left/right/bottom, wet | the near layer the camera flies through in ch. 1–2, 12 |
| P03 canopy | sea of crowns at sunrise, mist | ch. 2 top / ch. 3 below the camera |
| P04 cloud-sea | wide 2.5:1 cloud sea, sun left, distant peaks | ch. 3–4 far layer (wide, good for panning) |
| P05 desert-canyon | carved terraces and stairs at dusk, sun right | ch. 5 far layer |
| P06 desert-fg (alpha) | sandstone outcrops and blowing sand, left/right | ch. 5 near layer |
| P07 cave | magenta cave with paintings, roof shaft, waterfall | ch. 6 far layer |
| P08 coast | archipelago at coral sunset from above | ch. 7 far layer |
| P09 reef | reef with rays and fish | ch. 7 underwater |
| P10 jade-lake | still lake, bamboo, karst, hot spring | ch. 8 far layer |
| P11 bamboo-fg (alpha) | bamboo stalks left/right | ch. 8 near layer |
| P12 ice-cave | cyan ice cave with crystals | ch. 9 far layer |
| P13 aurora | glacier under a green-cyan aurora | ch. 9 exit (tint the aurora toward cyan #0FB5E4) |
| P14 summit | snow ridge over the cloud sea at dusk | ch. 10 |
| P15 night-sky | Milky Way over clouds, dark | ch. 11 |
| P16 dawn-clearing | jungle clearing at dawn, open centre | ch. 12 |
| P17 textures | sandstone, ice, mossy bark, rippled sand (2 × 2) | tiling materials for 3D surfaces (bark for the climb) |
| P18 idea-ribbon (alpha) | three gold ribbon forms | look reference for the Idea's material (gold, translucent, glowing edges); not used as a sprite |

Plate quality: all are ≈ 1670 px wide. Shown full-screen at 1440 (DPR 2 = 2880 px) they would look soft, so they are
always used behind haze and depth of field, split into depth slices that parallax, and never as the sharp subject.
The sharp subject in every frame is real-time (text, the Idea, 3D foreground, particles, light).
