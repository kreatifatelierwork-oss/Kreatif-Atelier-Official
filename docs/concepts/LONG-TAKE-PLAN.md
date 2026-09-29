# The Long Take — build plan

> **Stage 5 (2026-09-29): proposal.** The user asked for a bigger story than "a holding company and its verticals".
> After a 30-site 3D survey (`docs/research/SURVEY-3D.md`) and a creativity rubric (`docs/research/CREATIVITY.md`),
> the proposal is **"The Making of a Legacy"** (`docs/concepts/THE-MAKING-OF.md`). It is not built. Stages 3–4 below
> are kept for reference. The House of Light etc. (Stage 4) is superseded if the proposal is approved; note that
> Cartier's Watches & Wonders already uses an alcove/rooms structure close to it.

- **Stage 4 (this section, 2026-09-29):** the world is open again. The brief is to drop the solar-system/orbital idea
  unless it can be genuinely stunning as a place, and to rethink everything around the new world: reels, navigation and
  interactions.
- **Status: PLAN ONLY.** Nothing gets built until the world is chosen.
- **Stage 3 (below):** the orrery build that is live on `redesign-v2` today.

---

# Stage 4 — Choosing the world

## What carries over whichever world wins
These are infrastructure, not look, so they stay. They're all built, tested and scoring well
(Lighthouse local: mobile 93/100/100/100, desktop 100×4).
- **Shell:** the server-rendered HTML shell (every real word is HTML, with a full outline for screen readers and SEO)
  and the deferred 3D stage, which mounts on Begin while the loader only prefetches.
- **Behaviour:** reduced motion, keyboard control and the CSS fallback for weak devices.
- **Assets and switches:** the HDRI for reflections, the founder cut-outs, and `?palette=a|b`.

Everything else is open: the environment, the route, the chapters, the navigation device, and each vertical's place
and interaction.

**Content constraints for any world:**
- All copy comes from `content/verticals.ts`, and new UI wording is flagged PROPOSED.
- No logo, monogram or "KA" mark.
- None of the chart's icons may appear, even disguised: no column (Aurelius), no swan (Valora), no clapperboard (GGP),
  no flame (Rudra Yugen), no lotus (Asraya).

---

## Idea 1 — The House of Light *(recommended)*

**The world:**
- "Atelier" means studio, so the company becomes one: an impossible, sunlit building of pale plaster standing alone
  in a soft landscape.
- **Colour is the light itself.** Each vertical is a room where one coloured light floods smooth curved walls, stairs
  and water, in the spirit of colour-field architecture. The inspiration is the general language (walls of colour,
  skylights, light as material), not any specific existing building or artwork.
- The walls stay calm off-white or clay. Light pours through tinted skylights and slots, and colour bleeds through
  doorways into the next room, so you always glimpse where you're going.
- It is light, radiant and vivid without any "space" or "tech" clichés.

**The route:** a single walk through the building, one continuous camera with no cuts. The transitions are
**thresholds**: each doorway is a wall of the next room's coloured light. You walk into the glow, it floods the
screen, the text dissolves, and you come out inside the next room. Doorways also hide loading, so each room can
stream in as you approach.

| Chapter | Place | What you see | Interaction (the metaphor made tactile) |
|---|---|---|---|
| Loader + opening | Outside, dawn | The building's silhouette on a pale horizon; one door glows gold. Begin → walk to the door | — |
| 00 · Kreatif Atelier | **The Atrium** | Round, tall, a sky-oculus above; one shaft of white-gold light hits the floor. Around the wall, five doorways, each glowing its vertical's colour: *one light, five colours*. Headline Kreatif Atelier, motto, pillars | **Move the sun:** drag, and the shaft sweeps round the floor. Whichever doorway it touches brightens and says its name |
| 01 · Aurelius (indigo) | **The Stair Hall** | An indigo hall of broken stair flights floating at odd angles, going nowhere (no columns anywhere) | **Find the angle:** drag to turn your view. At the right perspective the flights line up into one continuous stair up to a high window, and light runs up it. *Strategy is seeing the right perspective; growth is the climb* |
| 02 · Valora (coral) | **The Water Court** | A coral-lit indoor pool. On one side a quiet study alcove, on the far side an open arch to a bright world outside | **Draw the bridge:** drag a path across the water, and stepping stones rise along it (tap-per-stone on phones and keyboard). When they reach the arch, the outside floods in. *Bridging education to real-world opportunity* |
| 03 · Golden Guardian Productions (magenta) | **The Camera Obscura** | A dark, velvet-magenta room with a tiny aperture in one wall | **Open the aperture:** hold, and the pinhole widens. The bright world outside projects, upside down and moving, across the whole back wall; then drag to pull focus. A procedural projection for now; a real film can drop in later. *Making stories and visuals from light* |
| 04 · Rudra Yugen (cyan) | **The Glass Room** | Dozens of suspended glass panes on threads; cyan light passes through and paints moving patterns on the walls | **Tune the light:** tap or hover to turn panes. When enough align, a hidden pattern resolves across the walls, a "discovery" moment. *Experiment → invention* |
| 05 · Asraya (jade) | **The Garden Court** | Open to the sky: a still pool, smooth stones, soft jade light and slow ripples, the one room with no roof | **Breathe:** hold to breathe in and release to breathe out. The water stills, the light slows and the reflection sharpens. Three breaths complete it (kept from Stage 3 because it's the most meaningful) |
| 06 · Ecosystem | **Above the house** | Rise up through the atrium's oculus as the roof fades to glass. From above, the plan: five coloured rooms around the round atrium with light flowing between them, so the org chart becomes architecture. Serves / Multiple verticals. One vision. Exponential impact. / Impact | — |
| 07 · Contact | **The Atrium at golden hour** | Back down into the atrium, now warm gold. The four founders hang as framed portraits on the curved wall (the cut-outs on pearl mounts), a gallery | Choose a portrait to read the bio. Email is the "door" out |

**Navigation (new):**
- The film timeline is replaced by a **floor plan**, a tiny architectural plan of the house in the bottom frame.
  - It shows the round atrium, five coloured rooms and a "you are here" dot.
  - Click a room to walk there; the route flies through the doorways at speed.
- Chapters are named "Room 03 / 05 — The Camera Obscura" (PROPOSED wording).
- Unchanged: scroll or swipe to walk, arrows and 0–7 to jump, Esc to close, and the TURA frame (wordmark in type
  top-left, Verticals / Contact top-right, motto left edge, Scroll cue right edge).

**Palettes:** A = **Day** (sunlit plaster, saturated coloured light, the default); B = **Night** (dark rooms where the
coloured light is the only light, glowing and cinematic).

**Why it wins:**
- It is *their name* made into a place.
- It is premium and architectural rather than playful-cute, and colour-as-light matches the approved "light, radiant,
  vibrant" direction exactly.
- Rooms give clear, nameable chapters, and each interaction is a real metaphor for its vertical.
- It is distinct from every site in the research set (Oryzo, Ivress, Lacoste, Shopify, igloo).
- Technically it is kind: mostly simple rounded geometry, fog and light, cheap on phones. The cost goes into lighting
  quality, not polygons.

**Risks:**
- Architecture only looks expensive with convincing light. That means soft shadows and bounce light
  (pre-computed ambient occlusion baked into the geometry, a light shaft done as volumetric fog, a gentle bloom).
  This is the main craft effort.
- The Stair Hall alignment needs careful tuning so it feels magical rather than fiddly.

**Assets:** all procedural. Optionally one CC0 plaster/concrete texture set from Poly Haven or ambientCG, logged in
ASSETS.md.

---

## Idea 2 — The Paper Atelier (a pop-up book)

**The world:**
- A vast pop-up book lying open in soft window light. You are tiny, travelling across its pages.
- Heavy cotton paper, letterpress type, cut layers with real depth of field, and colour glowing *through* the paper
  like light behind washi.
- Sophisticated rather than childish: think fine stationery, not a nursery.

**The route:** the book opens on Begin, and every chapter is a spread. The transition is the **page turn**: a huge
sheet sweeps past the camera (a natural wipe, no hard cut) and the next spread folds up out of the page.

**Each vertical's place:**
- **Aurelius:** layered paper terraces and towers that fold up higher and higher. *Pull the tab* to raise them.
- **Valora:** a paper river between two banks; *pull the tab* and a folded bridge concertinas across.
- **Golden Guardian Productions:** a paper theatre with a backlit screen; *hold to light the lamp* and a shadow-play
  story runs.
- **Rudra Yugen:** an origami tessellation that *folds itself* into a crystal form when tapped.
- **Asraya:** a paper garden pond with floating lanterns; *breathe* and the lanterns rise.
- **Ecosystem:** pull back to see the whole book with its spreads fanned open.
- **Contact:** the last page, a letter. The founders are paper cut-out portraits (the cut-outs suit this world
  perfectly).

**Navigation:** coloured index tabs along the book's edge, one per vertical.

**Strengths:** very tactile and charming, the founder cut-outs fit naturally, and it is cheap to render (flat folding
planes).

**Risks:**
- It can read as children's or wedding stationery unless the paper craft is exquisite.
- It is closer in spirit to Ivress's storybook.

---

## Idea 3 — The Prism Flats (a landscape of light)

**The world:**
- A limitless white salt flat at dawn under a pearl sky, the ground thinly wet like a mirror.
- At its centre stands a tall faceted crystal (deliberately *not* a triangular prism, to avoid the famous album-cover
  image).
- One beam of white light falls from the sky into the crystal and splits into **five coloured beams** that run across
  the land to five places on the horizon. It is the chart's "multiple verticals, one vision" as a single image.

**The route:** you ride the light. The camera follows each beam out to its place and swings along the horizon to the
next. The transition is **flying through the beam**, a flare of the next colour.

**Each vertical's place:**
- **Aurelius:** the indigo beam climbs terraced glass steps into a tower of light. *Drag the sun higher* to make it
  climb.
- **Valora:** the coral beam reaches a canyon's edge; *hold* and it hardens into a bridge of light to the far side.
- **Golden Guardian Productions:** the magenta beam passes through a giant lens and projects moving images onto a
  standing wall of mist, a cinema in the open air.
- **Rudra Yugen:** the cyan beam enters a forest of crystal shards and refracts into a web; *tap shards* to redirect
  the light.
- **Asraya:** the jade beam comes to rest in a still lake and becomes reflection; *breathe*.
- **Ecosystem:** rise high to see the five coloured rays drawn across the white land.
- **Contact:** dusk; the beams return and recombine in the crystal as gold.

**Navigation:** a compass or horizon strip showing the five beams, with your heading marked.

**Strengths:**
- The strongest single metaphor of the three.
- Pure light and glass: very radiant.

**Risks:**
- Open landscapes look empty or "screensaver" without top-tier materials.
- Real glass refraction is expensive on phones (it would be faked).
- The prism-and-spectrum image is a well-worn one.

---

## Idea 4 — Morning Dew (worlds inside drops of water)

**The world:**
- Macro scale at sunrise. You are a few millimetres tall, gliding along a single silk thread strung between blades of
  grass. Everything beyond is soft gold and green bokeh.
- Strung along the thread are dewdrops, each catching the sunrise, and **every drop holds a whole world**. It plays
  with scale the way Oryzo's macro views do, but as a place rather than a product shot.

**The core:** the largest drop, glowing gold, is Kreatif Atelier. The opening: the first ray of sun touches the thread,
and the drops light up one by one along it.

**The route:** along the thread from drop to drop. The transition is the **dive**: the camera plunges into the next
drop, the world bends through its lens (curved horizon, rainbow fringe at the edge), and you surface *inside* that
vertical's world. Leaving is the reverse: out through the skin of the drop and back onto the glittering thread.

**Inside each drop (all use real optics of water, which makes the interactions feel natural):**
- **Aurelius (indigo):** inside, a dusk-indigo world where crystal terraces grow upward in a spiral. *Hold to grow*:
  the spire climbs toward the top of the drop and catches the sun.
- **Valora (coral):** two coral droplets sit apart on the thread. *Drag one toward the other*; as they touch, surface
  tension snaps them into one. Bridging made physical, and a genuinely satisfying moment.
- **Golden Guardian Productions (magenta):** a real drop is a lens that projects an inverted image. *Hold to focus*: the
  drop throws a moving magenta picture onto the leaf behind it, a cinema made by a drop of water. A film can drop in
  later.
- **Rudra Yugen (cyan):** the drop is super-cooled. *Tap to seed* it, and frost crystals branch out in fractal lattices
  until the whole drop becomes a cyan ice jewel. Invention spreading from one spark; frost, not flame.
- **Asraya (jade):** a drop resting on a broad leaf, trembling with ripples. *Breathe*: each breath calms the surface
  until it becomes a perfect mirror of the sky.

**Ecosystem:** pull all the way back. The thread crosses the meadow with the five coloured drops and a thousand tiny
ones, and sunlight runs along it connecting them all. The thread *is* the ecosystem.

**Contact:** sun fully up, everything gold. The founders appear as round, lens-like portraits in drops, and the email
is on the core drop.

**Navigation:** the thread itself. A fine line along the bottom of the frame carries five coloured beads, with a bead
of light for "you are here". Click a bead to glide there.

**Palettes:** A = sunrise meadow (pale gold, green bokeh); B = moonlit, with the drops glowing from within.

**Strengths:**
- The most visually spectacular of all five ideas: bokeh, refraction and sunrise are instantly beautiful.
- Endlessly surprising scale shifts.
- Every interaction is real physics (merging, focusing, freezing, stilling).
- Wholly original as a company journey.

**Risks:**
- Nature macro only works with very good light and focus. On phones the depth of field is faked with bokeh sprites,
  which is cheap.
- The drop refraction is a lightweight screen distortion, not true glass.
- It must avoid reading as a spider web: a single thread, no web pattern, no creatures.
- It could lean "nature documentary" if the worlds inside the drops aren't stylised enough.

---

## Idea 5 — The Glassworks (one molten idea, five vessels)

**The world:**
- A vast, bright glass studio: white walls, tall north windows, sunbeams with drifting dust, and at one end the mouth
  of a furnace glowing like a small sun.
- Here the company's own motto becomes the story: **Ideas** (molten glass, glowing and unformed), **People** (the
  craft that shapes it), **Impact** (the finished object that catches light).
- It's an atelier in the oldest sense, a workshop of makers.

**The core:** a single gather of molten gold glass on the end of a long pipe: the idea, Kreatif Atelier.

**The route:** the camera follows the glowing gather from station to station. It is divided, and each part becomes one
vertical's vessel in its colour.
- **The transition is heat:** the frame passes through shimmering heat haze and the orange glow of molten glass, then
  cools into the next colour.
- No hands or people are shown (they'd be uncanny). The tools move on their own, like a studio at work.

**Each vertical is a technique:**
- **Aurelius (indigo), blowing:** *hold to blow*; the indigo vessel swells and rises into a tall twisting spiral, and
  drag turns the pipe to set the twist. Growth, built to last.
- **Valora (coral), pulling cane:** *drag across the gap*; a coral glass cane stretches from one stand to the other
  into a long glowing bridge.
- **Golden Guardian Productions (magenta), the lens:** *hold* to blow a magenta bubble thin and perfect. It becomes a
  lens that gathers the window's sunlight and projects a moving image on the white wall.
- **Rudra Yugen (cyan), cutting:** *tap to cut* facets into a cyan block. Every cut throws new refractions around the
  room until it blazes like a crystal.
- **Asraya (jade), the bowl:** *breathe*; the jade bowl opens slowly on the turning pipe and settles, filled with still
  water.

**Ecosystem (the hero image):** the five finished vessels stand in the tall window. Sunlight streams through them and
paints five colours across the white floor, overlapping at the centre into warm white-gold: "Multiple verticals. One
vision."

**Contact:** back at the furnace, glowing again, a fresh gather waiting. The founders' portraits hang in the studio.

**Navigation:** a rail of five colour chips along the bottom frame, one per vessel, filling in as each is made. They
are deliberately not vessel silhouettes, so nothing reads as an icon.

**Palettes:** A = the daylight studio; B = night, lit only by the furnace and the glowing glass.

**Strengths:**
- The strongest brand story: it dramatises "Ideas | People | Impact" literally.
- Material honesty (molten glow, real coloured glass, sunbeams) and a stunning finale image.
- Each interaction *is* the craft.

**Risks:**
- Convincing glass is the hardest material here. On phones it's faked with reflections, rim light and thickness
  tinting.
- The studio needs a restrained, stylised look, or it drifts toward realism and gets expensive.
- It overlaps with the House of Light in being "the atelier as a place", so choose one of the two.

---

## Comparing the five
| | Most striking visual | Story fit | Build risk | Phone cost |
|---|---|---|---|---|
| 1 House of Light | coloured light flooding plaster rooms | "Atelier" = the studio; one light, five colours | medium (lighting craft) | low |
| 2 Paper Atelier | backlit paper spreads folding up | charming, founders fit best | low | very low |
| 3 Prism Flats | one beam split across a white desert | strongest metaphor | medium–high | medium |
| 4 Morning Dew | worlds inside sunrise dewdrops | ecosystem as a single thread | medium | medium |
| 5 Glassworks | five vessels painting the floor with light | "Ideas \| People \| Impact" made literal | high (glass) | medium |

---

## Recommendation
**Idea 1, The House of Light** (after ideas 4 and 5 were added, it remains the pick for ownability and reliability; Morning Dew is the most spectacular and Glassworks the best brand story). It is the most ownable (it *is* an atelier), the most premium, the most distinctive
next to the research sites, and the most reliable to build at quality and speed on phones.

If you pick it, the build goes in phases, committing after each:
1. **Grey-box walk:** the house, route, doorway transitions and floor-plan nav.
2. **Light and materials:** lighting, materials and palettes Day/Night.
3. **Rooms:** the five rooms and their interactions.
4. **Finale:** Atrium, Ecosystem (rise through the oculus) and Contact gallery.
5. **QA:** phones, reduced motion, keyboard and Lighthouse.

---

# Stage 3 — the orrery build (current `redesign-v2`)

Approved direction (2026-09-29): **The Long Take** (Orrery × Production), promoted to the home page on `redesign-v2`.
Palettes switchable with `?palette=a|b` (A = light, default). No sound, no video in this build.
Concept background: `LONG-TAKE.md`. Research: `docs/research/` (igloo, TURA, SYNTHESIS).

## 1. Structure — eight reels, one continuous take
The timeline gains a closing reel so the finale stops crowding the timeline:

| Reel | Name | Camera | Text (all from `content/verticals.ts` unless noted) | Interaction |
|---|---|---|---|---|
| — | Loader | — | "Setting the scene · %" | **Begin** |
| 00 | **Core** | pull back out of the core's light → the orrery seen low, worlds strung along its horizon | eyebrow: Ideas \| People \| Impact · headline: Kreatif Atelier · caption: A creative holding ecosystem for a better tomorrow. · pillars as a microtype row | **Drag to turn** the orrery |
| 01 | **Aurelius** (indigo) | swing out → hold in front of the spiral of slabs | tagline · name · value; 4 annotations | **Hold to raise** — the spiral climbs; value line lights |
| 02 | **Valora** (coral) | swing out → the arch, gap in the middle | 〃 | **Tap to bridge** — each press flies tiles into the arch; when it closes a light runs across |
| 03 | **Golden Guardian Productions** (magenta) | swing out → the aperture (scaled to fit), a projection screen of abstract light behind it | 〃 | **Hold to roll** — the iris opens, the "projection" runs (procedural; a video can be dropped in via config) |
| 04 | **Rudra Yugen** (cyan) | swing out → the lattice around a glass core | 〃 | **Tap to spark** (and pointer hover) — pulses light up nodes; all lit = complete |
| 05 | **Asraya** (jade) | swing out → the cairn over ripples | 〃 | **Hold to breathe** — the stones lift apart and ripples slow while held; three breaths complete it |
| 06 | **Ecosystem** | rise high above: all five worlds joined by light | eyebrow row: Our ecosystem serves · … · headline: Multiple verticals. One vision. Exponential impact. · caption row: Impact · … | — |
| 07 | **Contact** | descend back into the warm core — the take ends where it began | eyebrow: Vision · headline: Disciplines today. A brighter tomorrow. · the vision sentence · email pill · **Meet the founders** | founders panel (glass, fanned carousel of cut-out portraits + bios) |

**Transitions** (every one, both directions): the camera leaves on a wide high arc; fog, depth-of-field and a haze of the
*next* world's colour rise mid-flight; text dissolves (blur + fade) out and the next reel's text resolves in; the world
condenses out of the haze. Reel jumps travel the same path at speed (reduced motion: cut with a crossfade).

## 2. Navigation
Scroll / swipe / ↑↓ ←→ / PageUp·Down travel; 0–7 jump; settle-to-nearest-reel after input stops; bottom **reel timeline**
(8 colour segments, playhead, "Reel 03 / 07 — Name", timecode) — click to travel; top-right **Verticals** (jump menu) and
**Contact** (mailto); left edge motto, right edge Scroll cue; top-left *KREATIF / ATELIER* in type (never a mark).

## 3. Look
- Palettes: **A** pearl/pale tinted skies, vivid glossy sculptures, neutral tone mapping, white frosted glass (default);
  **B** deep world hues lit by glowing sculptures, AgX, smoked glass.
- Lighting: Poly Haven *Photo Studio 01* HDRI as **environment only** (never visible), softened by a low-res
  environment render, plus Lightformer highlights; intensity higher in A, lower in B; 1K version on phones.
- Type: Outfit (geometric sans) for world names/headlines, Manrope microtype/body, Cormorant italic for the vision.

## 4. Phones, accessibility, fallback
- Phones: swipe; wider lens; DPR ≤ 1.5; no DOF; annotations become a list; timeline = colour bar; interactions are
  thumb-sized pills; everything reachable.
- Reduced motion: cuts + crossfades, still sculptures, holds become single presses, no haze/DOF animation.
- Keyboard: all controls are buttons; interactions work with Space/Enter (hold = hold key); visible focus; Esc closes
  panels; menus trap focus by making the rest inert.
- Screen readers & SEO: the full structure is server-rendered HTML (headings, lists) — the canvas is decoration.
- Weak devices (no WebGL / software GL): **fallback mode** — same reels, text, timeline and navigation over
  CSS-painted world colours and a soft glow instead of 3D.

## 5. Build phases and "done"
| Phase | Scope | Done when |
|---|---|---|
| 1 | Plan + CLAUDE.md rewrite | this file + new CLAUDE.md committed |
| 2 | Assets: HDRI environment (2K/1K), founder cut-outs attempt | environment visible in reflections only; cut-outs judged; ASSETS.md updated |
| 3 | Promote to home: `components/longtake/*`, SSR text shell + lazy stage, 8 reels, fallback mode, `/concepts` kept (noindex) | home = Long Take; build/lint/types clean; fallback renders without WebGL |
| 4 | All five worlds + interactions; GGP fit + procedural projection; core drag | each world holds as well as Aurelius; every interaction works by mouse, touch, keyboard, reduced motion |
| 5 | Ecosystem + Contact reels, founders panel, transition/timeline/menu polish | no crowding at 1440/390; forwards/backwards smooth; no text over sculptures' focal area |
| 6 | QA: phones, reduced motion, keyboard, screen reader outline, Lighthouse, screenshots | mobile Performance ≥ 70, Accessibility ≥ 95, SEO 100; screenshots of every reel in both palettes at 1440/390 |
