# 3D web survey: product-first, 2025–26 award winners

Studied 2026-09-29 in headless Chrome with GPU WebGL (Apple M4) at 1440×900, using `scripts/research/survey.mjs`.
For each site the script:
- loaded it and tried its entry gate;
- swept the cursor;
- scrolled in 12 steps with a screenshot at each step;
- recorded the assets it loads (3D models, textures, audio, video), audio-context use and pointer listeners.

Some sites got a manual pass with `rc.mjs`. Screenshots stay local in `docs/research/survey/<site>/`; they're
third-party imagery and gitignored. Sites that block automated browsers, or put a legal/consent gate first (age checks,
"by entering you agree…"), were *not* forced; their published case studies were used instead.

We learn principles; we copy no code, models, imagery, sound or signature designs.

Earlier deep studies (same method, more interaction): `oryzo.md`, `ivress.md`, `lacoste.md`, `shopify.md`, `igloo.md`.

---

## Product and brand sites (priority)

### Cartier: Watches & Wonders (Immersive Garden) · luxury watches
- **Flow:** six self-contained "alcoves", one per watch, scrolled like rooms in a museum. Each alcove has its own
  world and mood:
  - a cream pavilion of arches;
  - a golden chain;
  - nested glowing frames;
  - floating paper sheets;
  - a dark dune;
  - white and gold ribbons;
  - a tree against a moon.
  The product sits dead centre, with its name set in large, thin capitals beneath.
- **Sound:** a bespoke score (with Mooders) run through Web Audio, "a narrative layer, not background".
- **Interaction:** hidden gestures that reward curiosity.
- **Lesson:**
  - Every chapter can have a completely different *mood* if the protagonist and framing stay constant.
  - Note that Cartier's arch-and-alcove architecture is close to our House of Light idea, one more reason to move
    beyond "rooms".
- Studied through the studio's public mirror; cartier.com blocks automated browsers.

### GQ × Audemars Piguet: The Extraordinary Lab (Immersive Garden) · watches (the RD series)
- **Flow:** opens on white-line architectural drawings of the lab over black, with a narrator credit and "Click
  anywhere to enable sound".
- **Structure:** no chapters, but a **continuous cinematic track you move through like a media player**, forwards and
  backwards. Camera, dialogue, environment and animation are all orchestrated on one timeline.
- **Sound:** dialogue and score are part of the interaction system. When you scrub, the audio fades, pauses and
  re-syncs rather than speeding up.
- **Tools:** Theatre.js was used to shape motion curves live. It held 60 fps on older iPhones.
- **Manual pass with sound on:**
  - It opens on a sunset horizon over dark water, with "Skip intro".
  - The narration runs as **word-by-word subtitles** under a speaker credit ("Cam Wolf, GQ's watch expert").
  - The watch sits on a white light-table among sketches and documents, with "+ Click to explore" hotspots.
  - The **scrubber along the bottom is a glowing audio waveform** marked with Roman-numeral chapters (I Audemars
    Piguet DNA · II Design & User Experience · III Innovation).
  - A transparent x-ray view of the watch follows.
- **Lesson:** the closest existing thing to "watching a detailed, technical movie that you control". The waveform
  scrubber and karaoke subtitles are *their* signatures, so we won't reuse them. Blueprint lines
  as the opening image are *theirs*, so our blueprint layer must work differently (see the Lens in the concept).

### Apple: AirPods Pro 3 · consumer tech
- **Flow:** product hero → chromatic sound rings → a "Get the highlights" film strip → "Take a closer look" (a list
  of hotspots with a rotating product) → big spec numbers ("2x more", "4x more") → a **transparent x-ray of the case**
  → silhouettes dancing with the product → feature trios with icons.
- **Other details:** heavy video (17 videos, 46 images); no WebGL canvas. The price and Buy button are always one
  click away.
- **Lesson:** information-heavy *and* beautiful comes from two things:
  1. alternating spectacle beats with dense, precise spec beats;
  2. revealing the inside (x-ray or cutaway) as a visual event.

### Lando Norris (OFF+BRAND) · personal brand and store · Site of the Year 2025
- **Opening:** a loader of his number with a face masked inside it. Then the **cursor reveals the helmet over his
  face** (a mask that follows the pointer).
- **Flow:**
  - a hand-drawn signature scrawls across the headline;
  - topographic track-contour lines sit in the background;
  - an editorial photo collage;
  - on and off track;
  - a "Helmets Hall of Fame" grid of 3D helmets;
  - a store;
  - partners;
  - a fanned card stack for socials.
- **Tech:** Rive motion files (8), WebGL, Webflow.
- **Lesson:**
  - A *second layer revealed by the cursor* is the most memorable interaction on the site.
  - One accent colour (lime) carries everything.

### Hubtown (Unseen Studio) · Indian real estate developer
- **Opening:** a dotted loader, then the wordmark, then a glowing blue monolith floating over dark water in a valley
  ("We build the future of real estate"), with "click to reveal" on the object.
- **The journey:** scroll dives down into a canyon where **a single river of light** flows. The one stream multiplies
  into many ("We work with a network of experts") and finally lays glowing roads across a night landscape dotted with
  monolith buildings. A side index shows the chapters.
- **Sound:** ambient loop, hover, click, modal-open and a transition sound (7 WAVs).
- **Lesson:**
  - One protagonist (light) that *multiplies* tells "a company plus its network" without a diagram.
  - It's also a relevant Indian-market precedent.

### Primland (Explore) · luxury resort
- **Flow:** an aerial flythrough over photoreal terrain under drifting clouds ("The Blue Ridge Mountains"), leading
  into an explorable map.
- **Sound:** the default is **sound on**, with a quiet "Start without audio" link.
- **Weight:** 26 MB (terrain tiles). We couldn't enter the map in headless mode.
- **Lesson:** sound can be the default when the opt-out is clear and immediate.

### Santioni Spirits · bottled cocktails
- **Flow:** hold-to-advance replaces scrolling. The press creates tension and turns each beat into a small ritual.
- **Sound:** 65 audio clips (a sound for nearly every beat).
- An age gate sits before the experience. We did not click through a legal gate; the rest is from the published
  write-up.
- **Lesson:** a gesture other than scroll can *be* the brand's rhythm.

### Opal Electronics · cameras and consumer electronics
- **Flow:** "the table", a dated founder's letter scrolling over a top-down photo of a table covered in the company's
  prototypes and objects. It ends in a huge dot-matrix wordmark that lights up in patches.
- **Lesson:** a company's history and philosophy told through *one* image-metaphor (the table) plus an honest letter.
  Quiet, confident and memorable.

### Slosh Seltzer (Active Theory, fictional product)
- **Flow:** a bright pink, maximalist entry ("This is the big kids table"), then, per the case study, you pop the can,
  liquid floods the screen and you're at a party: flying fruit, dancing type, pong.
- **Interaction:** the signature is a **fluid cursor with carbonation bubbles**.
- The entry button accepts playful "terms", so it was not clicked; the rest is from the case study.
- **Lesson:** make the cursor *feel like the product*.

### Nothing · consumer tech
- A region/store selector modal blocked the survey. Not studied further.

---

## Studios, games and stories

### Messenger (abeto) · Site of the Year 2025
- **Opening:** a tiny spherical planet whose buildings spell the title, with a "Begin" button and a loader drawn as an
  envelope.
- **Flow:** Begin **dives from the planet down to street level** into a third-person, illustrated game world
  (a delivery messenger in a calm, slightly strange Asian-inspired town). It is multiplayer, with emoji chat.
- **Sound:** a music bed plus per-area ambience (forest, city, factory) and UI sounds.
- **Weight:** 5.6 MB to start.
- **Lesson:**
  - A *scale dive* from an object you can hold to a world you can walk in is a thrilling first ten seconds.
  - The title itself is made of the world.

### Lusion (studio site)
- **Opening:** a 000→100 counter becomes an "L".
- **Flow:**
  - a physics toy of 3D jacks that you push with the cursor;
  - "Bold Ideas, Brought to Life";
  - a liquid-distorted "Play Reel";
  - a work grid;
  - "Where Creative Ideas Become Immersive Experiences";
  - an astronaut flying down a glitching data corridor.
  A single cyan ribbon threads across sections.
- **Sound:** a full kit of generic, cinematic, hover, click, focus and page sounds, plus a `glass_broken` event.
- **Lesson:** a thread that crosses every section gives a long page continuity. Sound kits are organised by
  *role* (ambient, UI, narrative event).

### Active Theory (studio site, v6)
- **Flow:** a glass ring falls through a dark garden of glowing particles and becomes "Creative Digital Experiences"
  in glitch type. Then a **crystalline spine** rises, with project cards (video textures) orbiting it.
- **Other details:** type decodes with glitches; a side filter asks "What are you looking for?" (Websites /
  Installations / XR / Multiplayer / Games).
- **Lesson:** a portfolio as a physical structure you travel up. Decoding type reads as "technical".

### Why Zero · career platform
- **Opening:** the gate is **"Draw a zero"**. You literally draw a circle to enter. Then a hand made of terrain rises
  from icy water, and the story progresses as unlocked stages with an XP counter.
- **Sound:** a big kit (`amb_stage1`, `amb_stage2-3`, whoosh, tunnel, glass-shatter, hold-button, money-burn).
- **Lesson:** the entry gesture *is* the thesis. Game mechanics (unlocks, XP) can reinforce a message.

### Sleep Well Creatives · sleep guide
- **Look:** a strict two-colour world (ultramarine and cream), with an illustrated figure crossing dunes, hypnotic
  tunnels and pulse waveforms.
- **Recharge badge:** a small "Recharge" badge follows the cursor through every scene.
- **Sound:** ships **voice-over lines** as separate clips ("your body won't rest", "mind logoff"…) plus a healing
  loop.
- **Lesson:**
  - Narration turns a site into a film.
  - A two-colour discipline makes an illustrated world feel designed, not decorated.

### paodao (Where Worlds Take Shape) · developer portfolio
- **Flow:** the loader shows a little walking figure with rotating tips. Then comes a miniature diorama with depth of
  field and a "Travel" button that takes you to the next world.
- **Lesson:** loaders can teach the rules ("talk to travellers", "retrace your steps").

### Iventions · events agency
- **Flow:** a bold editorial agency site with a moving colour wedge, a photo card that flips as you scroll, huge type,
  a client-name list and numbered services.
- **Lesson:** not every award is 3D. Rhythm and type can carry an agency site. Their client list is real, which we
  must never fake.

### Bruno Simon (portfolio)
- A WebGPU driving world that loaded but crashed our headless GPU. Known from its history: you *drive* through the
  portfolio.
- **Lesson:** the navigation mechanic *is* the personality.

---

## Holding companies, B2B and information-dense stories

### Montfort (Immersive Garden) · commodity trading and investment group (a holding company with divisions)
- **Flow:** a mountain above a sea of cloud (wordmark). Scrolling descends *through* the cloud, and each division is
  introduced by a tanker emerging from mist:
  - Trading ("Operating efficiently by leading with innovation");
  - Capital;
  - Maritime;
  - Energy.
  It continues to a dark globe with office markers ("over 15 global offices") and ends in a sunlit forest for
  ethics and compliance.
- **Lesson:**
  - The closest precedent to our brief *and* its trap. It is beautiful and continuous, but the story is still
    "here are our divisions".
  - Weather as the transition is lovely. We should do the opposite on story: make the divisions *serve* a bigger plot.

### Terminal Industries (REJOUICE) · logistics software · Site of the Month
- **Flow:** a cinematic hero (a truck in silhouette at sunset). "Explore product" then drops you into a **working
  demo of the product itself**, the "Yard Operating System": modules (Gate Automation, Asset Inventory, Shipment
  Management, Insights & Analytics, ISR Compliance, Security & Fraud) with tables, statuses and charts. It is all
  clearly labelled **"Demonstration data"**.
- **Lesson:**
  - Information-heavy can be *usable*: let people touch the machinery.
  - Label demo data honestly. For us: show only real content and the visitor's own live data.

### Getty: Tracing Art (Resn) · museum research tool · Site of the Month
- **Flow:** a cloud of hundreds of artworks settles. One painting (a 1669 still life) stays **fixed at the centre**
  while a **year scrubber** runs along the bottom (1669 → 1700 → 1864 → 1936 → 1944…). The captions tell its
  ownership history, and the artworks around it change with each era. It ends by zooming into a handwritten dealer's
  ledger.
- **Other details:** three chapters with an expandable progress index. 12 M records are compressed into light GPU
  textures.
- **Lesson:**
  - One protagonist held still while *time and context* change around it.
  - Dense, scholarly data made cinematic by a timeline scrubber and captions.
  - This is the structural model for our "film clock".

### Zentry (Resn) · gaming / AI platform
- **Flow:**
  - a glitch mark, then a wireframe point-cloud flower bursting between the giant condensed words
    "REDEFINE … REALITY";
  - a skewed clip-path panel with a mesh hand reaching for a glowing orb ("Human life powers AI…");
  - product cards;
  - a vertical list of principles;
  - "Zentry at a glance": big stat posters (24B+, 500K+, 970GB+, $20M+);
  - partners.
- **Type:** monospace microtype throughout.
- **Lesson:** huge condensed type plus monospace reads instantly as "technical". Stats as posters are powerful, but
  ours must be *true* (we have no client stats to show; we can show real counts from our own content).

## More product, property and brand sites

### Scout Motors · electric off-road vehicles · E-commerce of the Year 2025
- **Flow:**
  - a cinematic video hero ("Scouts always come back.");
  - "An off-road icon reborn";
  - a black-and-white archive of the original vehicle ("The one that started it all");
  - **archival photo cards orbiting the words "American From Day One"**;
  - grainy film stills of owners;
  - a night drive;
  - "The Scout In All Of Us".
  Reserve and configure are always one click away.
- **Lesson:** heritage told as a film. Spectacle never blocks the path to buy.

### Kriss.ai · AI assistant for healthcare
- **Flow:** "Hi, I'm Kriss." floats over a pastel **cutaway dollhouse clinic**. The camera travels room to room
  (Patient Consultation, Administration, Treatment & Surgery, Post-Operative Care, Doctors' Office, Front Desk), and
  each room carries a feature card with three benefits.
- **Lesson:**
  - Features mapped to rooms of a building make a clear, friendly tour.
  - It's also a second precedent (after Cartier) showing that "rooms" is already a known structure, another reason
    the House of Light is not our most original option.

### iyO · screenless "computers you can talk to"
- **Flow:** the whole site is manifesto lines in soft, glowing, blurred type over a grainy field of shapes that pulse
  like sound waves ("join our simple cause…", "attention is their target…", "look up and be here").
- **Lesson:** when the product is voice, the *typography behaves like sound*. The medium matches the message.

### Microsoft AI · AI models
- **Flow:**
  - "Humanist Superintelligence" in a warm serif over a soft coral field;
  - an illustrated crowd;
  - model cards with small hand-made icons;
  - an "Our Values" list where **a hand-drawn pen line loops and circles the active value** as you scroll, then
    ticks the last one.
  It has an Accessibility Mode toggle.
- **Lesson:**
  - A *hand-drawn annotation that travels* makes dense lists feel human.
  - A visible accessibility mode.

### Shopify Editions: Winter '26 "The Renaissance Edition" · 150+ product updates
- **Look:** Renaissance-style paintings remixed with modern objects (skateboards, shopping bags, laptops) carry a
  vast product release.
- **Details:**
  - a persistent chapter index in the left rail;
  - one painting **dissolves into a constellation of particles**;
  - swash italic serif headings;
  - product UI floating inside painted scenes;
  - torn-paper transitions.
- **Lesson:** one art-direction idea can carry an enormous amount of information if the index is always visible.

### ERA Residence (The First The Last) · Mediterranean residences
- **Flow:**
  - an **arch-shaped window** loader opening onto the pool;
  - a huge condensed serif with an italic script ("Estepona");
  - circular mask transitions;
  - a **route line with real drive times** (Gibraltar, Estepona, Marbella, Málaga airport);
  - editorial pages.
- **Lesson:** information (distances) drawn as a beautiful line. Mask shapes as transitions.

### Floema · outdoor furniture
- Floating product cut-outs in the hero, then full-bleed landscapes with products in place. A cookie wall covered most
  captures (we don't accept consent banners), so this one is only lightly studied.

### David Whyte Experience (Immersive Garden) · poet
- **Flow:** watercolour landscapes that paint themselves in as the cursor moves, with lines of poetry as captions
  ("You start with a painter's hand…"). The experience then flows straight into a subscription offer ($75/year) and
  FAQ.
- **Lesson:** a poetic experience can lead *directly* into a commercial ask without breaking tone.

### Not reachable
- **Navigate (Resn):** SSL error.
- **DeepSee Commerce:** its "Start the experience" gate wasn't triggered. Known from write-ups as a scroll-driven
  underwater descent.

---

## Cross-site patterns (what the best ones share)
1. **The gate is a ritual, and often the thesis.** Why Zero makes you *draw* a zero; Messenger dives from a title
   planet to the street; AP and Primland ask about sound; Lusion counts to 100. The first 10 seconds teach how the
   site behaves.
2. **One protagonist, many modes.**
   - Protagonists: Hubtown's light stream, Tracing Art's painting, igloo's camera, Lusion's ribbon, Oryzo's coaster.
   - The world changes *mode* (x-ray, blueprint, night, data) instead of cutting to a new layout.
3. **Scale dives:** planet → street (Messenger), mountain → sea → globe → forest (Montfort), monolith → canyon
   (Hubtown). Changing scale is the most cinematic transition there is.
4. **A timeline you can scrub:** AP's waveform, Tracing Art's years, Shopify's index. The film-like sites give you
   a playhead.
5. **Sound as a system:** kits organised by role (ambient per stage, UI, narrative events, voice-over). Sound follows
   scrubbing (AP). Sound is on by default with a clear opt-out (Primland), or asked for at the gate (AP).
6. **The cursor reveals a second layer:** Lando's helmet, Hubtown's geometry, David Whyte's watercolour, Opal's
   dot-matrix, Microsoft AI's pen line. It is the most memorable interaction class of the survey.
7. **Information made beautiful:**
   - spec posters (Apple, Zentry);
   - working demos with honestly labelled data (Terminal);
   - captions over a constant subject (Tracing Art);
   - route lines with real distances (ERA);
   - monospace microtype (Zentry, Active Theory).
8. **Honesty:** real client names (Iventions), labelled demo data (Terminal). We have no client roster or stats to
   show, so our numbers must be counts from our own content and the visitor's own live data.
9. **Performance tactics:**
   - video where it's only spectacle (Apple, Active Theory's video textures);
   - compressed GPU textures (KTX2) and compressed meshes (Draco/Meshopt decoders appear as WASM on most 3D sites);
   - Rive for 2D motion (Lando).
10. **What nobody does:**
    - reduced-motion support was absent everywhere we looked;
    - few offer a hands-free "Watch" mode (AP comes closest);
    - many hide their real content inside the canvas;
    - none casts the *visitor* as a character whose role changes through the story.
    That's our space.


