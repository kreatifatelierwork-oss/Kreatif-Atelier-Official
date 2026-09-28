# Kreatif Atelier — three creative concepts (Stage 2)

Built from the research in `docs/research/` (see `SYNTHESIS.md`). Prototypes of each opening moment
(loader → intro → first transition) are live at **`/concepts?concept=1`**, **`2`** and **`3`**
(run `pnpm build && pnpm start`, then open `http://localhost:3000/concepts/?concept=1`).
Screenshots: contact sheets `docs/concepts/concept-1-orrery.png`, `concept-2-production.png`,
`concept-3-golden-thread.png` and `concepts-phone.png` (raw captures, incl. reduced motion, in `docs/concepts/shots/`, kept local).

All three keep: every word of real copy as HTML text, the mailto CTA, prices as-is, no logo or mark of any kind,
full keyboard and reduced-motion support, and a lighter fallback for weak devices. New wording used in the
prototypes (chapter names, prompts like "Set it in motion") is marked PROPOSED in `content/concepts.ts` and
needs your approval before anything ships.

---

## Concept 1 — THE ORRERY
*"A great agency is a system: strategy at the centre, everything else in precise orbit around it."*

**The world.** A monumental clockwork orrery of polished gold and black glass, floating in a dark observatory.
It assembles itself while the site loads — ring by ring, each locking into place — and a small sun at its
centre ignites when you *set it in motion*. Everything Kreatif Atelier does is mounted on its rings.

**Navigation — the object is the menu.** Drag to turn the whole instrument; scroll to "wind" it (the rings
advance like clockwork); click any body and the camera flies to it while the rest of the mechanism falls
out of focus, and its story opens in a glass panel. A compact index (bottom-left) lists every ring and body,
so anyone — keyboard, screen reader, or in a hurry — can jump anywhere in one click. "Back to the orrery"
(or Esc) returns you to the wide view.

**Where the content lives.**
| Content | On the orrery |
|---|---|
| Brand line / Who we are | The sun at the centre ("Where Strategy Meets Story") |
| Six services | Ring I, *The Craft* — six gold and obsidian spheres |
| Four divisions | Ring II, *The Houses* — four larger worlds, each its own material (gold, dark glass, cream, crimson glass) |
| Five process steps | Ring III, *The Way* — five small markers you can follow in order |
| Thirteen industries | Engraved around the outer rim, turning slowly |
| Three engagement tiers | Three counterweights of increasing size hanging below the instrument |
| Four founders | The four arms that hold the rings — "the hands that built it" — each opening a portrait panel |
| Six reasons (Why us) | Six engraved plates on the base |
| Contact | Revealed by the alignment game (below) |

**Visual language.** Obsidian, polished and brushed gold, deep navy void; engraved serif numerals and tick marks;
warm key light, cool rim, studio reflections; strong **depth-of-field focus pulls** whenever you choose a body
(the prototype does this); a soft sun halo with bloom. Cursor: a ✦ that grows over bodies; drag shows a rotate cursor.
Sound (off by default): the soft ticking of the mechanism, a mechanical click when a ring locks, a low hum from the sun.

**Wow moment.** The loader — the instrument literally builds itself from falling rings — and the ignition of the sun.

**Playful mechanic — "Alignment".** Near the end the rings drift out of line. Drag each ring until its gap lines up;
when all three align, a beam from the sun passes through and lands on the contact card: *strategy aligned, story
unlocked* (proposed line). Short, tactile, and it *is* the pitch (strategy = alignment).

**Phones.** The orrery is seen from slightly above so it fits a portrait screen; one-finger drag turns it, pinch zooms,
tap a body; panels become bottom sheets; the index becomes a swipe-up drawer.
**Reduced motion.** No assembly animation, no idle turning, camera cuts instead of flying, focus blur fades in instantly.

**Trade-offs.** Effort: **large** (camera choreography, ten kinds of object, panel system). Performance risk: **medium**
(depth of field and reflections are expensive; phones get a cheaper blur). Content risk: some visitors may feel the
content is "hidden in orbit" — the index and a guided "tour" scroll mitigate it. Most "3D spectacle" of the three.

---

## Concept 2 — THE PRODUCTION
*"Kreatif Atelier makes films, campaigns and stories — so the site is its own film."*

**The world.** A private screening. A film leader counts down in gold while the site loads; you press *Roll film*;
a projector beam cuts through the dark with dust drifting in it, cinematic letterbox bars slide in, and the opening
titles appear: *A Kreatif Atelier Production* → "Where Strategy Meets Story. Where Story Becomes Legacy."

**Navigation — a film editor's timeline.** The site plays as five reels. Scrolling plays the film forward (and back);
a timeline in the bottom letterbox bar shows all five reels with a playhead and a running timecode; click any reel to
jump. Each reel is a sequence of "shots" the camera moves through.

**Where the content lives.**
| Reel (proposed names) | Content |
|---|---|
| 01 · The Brief | Who we are — the camera dollies through the headline set in giant gold type (prototype), then the four pillars as intertitles and the philosophy quote as a line of dialogue |
| 02 · The Craft | Six services as six "shots", each a different set built from light and gold (e.g. a blueprint grid for strategy, a cascade of frames for social, a camera rig for production); click a shot for the full "director's notes" (service detail) |
| 03 · The Crew | Founders as opening credits ("Founder & CEO — Gourish Girish Pillai" …) with portraits in the beam; the four divisions as the studios behind the film, in type |
| 04 · The Cut | Process as an edit timeline (five clips in order), why-us as the director's commentary, engagement tiers as three ticket stubs (prices as-is) |
| 05 · The Premiere | Industries as marquee lights; contact: "Your story, next." with the audit CTA |

**Visual language.** Black, warm projector gold and cream; 2.39:1 letterbox; film grain (already site-wide);
anamorphic light streaks; **rack-focus** transitions between foreground type and background sets (the prototype
blurs the type wall, pulls it sharp as you approach, then passes through it); intertitles in the serif.
Cursor: a small viewfinder frame; over interactive shots it becomes a play ▶. Sound (off by default): projector
purr, a soft film-leader tick in the countdown, a quiet score.

**Wow moment.** Pressing *Roll film* — the beam ignites through the dust and the letterbox closes in.

**Playful mechanic — "Frame the shot".** In The Craft, a viewfinder appears over a busy scene; drag it to frame the
subject on the rule-of-thirds lines; a perfect frame "prints" a polaroid-style still of that service. Teaches our eye
for composition in ten seconds.

**Phones.** The film becomes vertical **Reels** (fitting, given the social-media service): swipe up to advance shots,
the timeline becomes segmented story bars at the top, the letterbox becomes a thin frame.
**Reduced motion.** "Script mode": each reel shows as still frames with its intertitles; no flicker, grain motion or dolly.

**Trade-offs.** Effort: **very large** (five reels × several bespoke sets; it's closest to making an actual film).
Performance risk: **medium**. Creative risk: film leaders and projector beams are familiar tropes — it only
feels premium with real craft in every set. It becomes much stronger with **real footage/stills from Golden
Guardian Productions and campaign work**, which we don't have yet.

---

## Concept 3 — THE GOLDEN THREAD
*"Strategy and story are one continuous thread — and a story drawn with care becomes a legacy."*

**The world.** A single slab of black stone, lit by one raking light, into which a thread of gold is inlaid — inspired
by *Bidri*, the Deccan craft (from Bidar, near Hyderabad) of inlaying precious metal into blackened alloy. The
visitor **pulls the thread**: it follows your cursor or finger with real weight, and everywhere it passes it is
pressed permanently into the stone. The whole site is one continuous line.

**Navigation — follow the thread.** The loader draws the thread toward a spark; you *hold* to pick it up (the
loader's line is pressed into the stone — continuity from the first second). Scrolling moves you along the
thread's route through ten "knots" (chapters). As the thread reaches each knot it **engraves** that chapter's
words in gold (the prototype engraves the two brand lines). A slim route map on the right shows all ten knots;
click any knot and the thread races there. Your own drawing is free and optional; the route is always there.

**Where the content lives.**
| Knot (proposed names) | Content, engraved into the stone |
|---|---|
| Spark | The brand lines, engraved as the thread passes (prototype) |
| Who we are | Four inlaid lozenges (What we are / Where / Who / Philosophy) + the quote engraved in italic |
| Six pillars | Six inlaid medallions, each with a line-drawn glyph; tap to open the full service detail |
| Partnerships | Three bands of increasingly rich inlay pattern — Starter / Growth / Brand Partner (prices as-is) |
| Visionaries | Four portrait "windows" cut into the stone; portraits revealed behind glass |
| Ecosystem | Four interlocking gold rings — the thread weaves through each division |
| Why us | Six short engraved lines |
| Process | Five stitches along the thread |
| Industries | A border frieze of thirteen names running around the slab |
| Legacy | The contact CTA — and your keepsake (below) |

**Visual language.** Black stone (not flat black: a real relief that the moving light rakes across — prototype), liquid
gold inlay with a bright edge highlight, cream engraved type, the ✦ as the thread's spark, a single deep-lapis accent
for the divisions. Blur is used sparingly: the stone outside the current knot drops into a soft focus; panels are dark
frosted glass. Cursor: the thread *is* the cursor on desktop. Sound (off by default): a soft metallic "draw" whisper
while the thread moves, a small chime when a knot engraves.

**Wow moment.** Holding to pick up the thread — the whole loader line is pressed into the stone and the thread comes
alive in your hand.

**Playful mechanic — "Your legacy".** Everything you draw during the visit is kept. At the final knot, your journey
becomes a unique gold-on-black inlay composition (the route + your own marks + where you lingered), shown full-screen
beside the CTA: *"Every visit leaves a different inlay. Here is yours."* (proposed). Download it as a wallpaper — a
keepsake that literally turns *story into legacy*. The prototype already shows it forming (bottom-left thumbnail).
Optional mini-challenge per service: trace its glyph quickly for a spark burst.

**Phones.** Arguably its best medium: the finger draws; swipe to follow the thread; the route map becomes a slim bar;
the stone is one lightweight shader (no heavy models).
**Reduced motion.** The thread is drawn instantly at each knot, the light stays still, no physics; holding becomes a tap.

**Trade-offs.** Effort: **medium** (mostly one shader, line drawing and typography; content chapters are layout
rather than bespoke 3D sets). Performance risk: **low** — the lightest of the three, best for phones and Lighthouse.
Creative risk: less "big 3D object" spectacle than the Orrery; the craft has to come from light, material and motion.
Free drawing over text can hurt legibility — in the full build text areas sit on a darker veil and the thread
glides around them. Most original and most specific to Kreatif Atelier (Hyderabad craft + the brand line itself).

---

## Recommendation

**Concept 3 — The Golden Thread**, enriched with a few sculptural 3D moments (e.g. the six services as gold relief
medallions that rise out of the stone, the four division rings in real 3D that the thread weaves through).

Why:
1. **It's ours.** It grows from the brand line ("Story Becomes Legacy"), from Hyderabad's own metal-inlay craft,
   and from the gold-on-dark palette — no other agency site could be this one.
2. **It's the most original way of moving through a site**: you don't scroll past content, you *draw* your way
   through it, and the site remembers you.
3. **The payoff is the pitch.** Leaving with your own inlay is a memorable, shareable demonstration of what the agency
   does: turn a story into something that lasts.
4. **It's the most honest on phones** (drawing is native to touch) and the lightest to run — the 70+ mobile
   Lighthouse target is realistic.
5. **Lowest build risk** of the three, so more of the effort can go into polish.

If you'd rather lead with maximum 3D spectacle, **Concept 1 (The Orrery)** is the strongest alternative — its
assembly and focus-pull moments are already the most "Awwwards" in the prototypes. Concept 2 is the most
cinematic but the heaviest to build well, and it needs real footage we don't have.

---

## Assets that would make each concept better (ask list)

Nothing below is required to continue — each has a procedural stand-in already. Licences must allow commercial use;
every asset used gets logged in `docs/ASSETS.md`.

| For | Asset & why | Where to get it (search / filters) | Format → path | Meanwhile |
|---|---|---|---|---|
| All | **Founder cut-outs** — transparent portraits sit on dark stone/glass far better than white-background photos | Original photos → remove.bg (or Photoshop "Remove background"); avoid AI "enhancers" that change faces | PNG with alpha, ≥1200 px tall → `founders-cutout/` (then `pnpm images founders-cutout`) | Current graded photos |
| 1 | **Studio HDRI** for richer metal reflections | Poly Haven → HDRIs → Studio: "studio small 09", "brown photostudio 02" (CC0) | 1K + 2K `.hdr` → `public/env/` | Procedural light panels (already used) |
| 1 | **Brushed-metal texture** for ring faces | ambientCG → search "Metal brushed" (CC0), e.g. Metal009 | 1K JPG colour + normal + roughness → `public/textures/metal-brushed/` | Procedural noise |
| 2 | **Real footage / stills** of Kreatif Atelier & Golden Guardian Productions work (showreel, campaign stills, BTS) | Your own archive (you hold the rights) | MP4 H.264 1080p ≤ 20 s clips, WebP stills 1920 px → `public/media/` | Abstract light sets |
| 2 | **Projector loop + leader tick + ambient score** | Freesound (filter licence: CC0) "film projector loop", "film leader beep"; Pixabay Music "cinematic ambient" (Pixabay licence permits commercial use) | MP3/OGG ≤ 150 KB each, score ≤ 1.5 MB → `public/audio/` | Silent |
| 3 | **Black stone texture set** (granite/basalt/slate) for close-ups | ambientCG "Rock" / "Marble" black variants, Poly Haven textures "rock face", "black granite" (CC0) | 2K JPG colour + normal + roughness → `public/textures/stone/` | Procedural stone shader (prototype) |
| 3 | **Bidri reference photos** (art direction only, not shipped) | Museum open collections (e.g. search "Bidriware" on Wikimedia Commons, V&A collections) | Any → `docs/reference/` (not deployed) | Built from memory of the craft |
| 3 | **Draw / engrave sounds** | Freesound CC0 "metal scrape soft", "chime small", "ink pen" | MP3/OGG ≤ 80 KB → `public/audio/` | Silent |
| Any | **A display face with more ceremony** (optional) for chapter titles | Fontshare (free for commercial use): "Boska", "Zodiak"; or keep Cormorant | WOFF2 → self-hosted via `next/font/local` | Cormorant Garamond |
