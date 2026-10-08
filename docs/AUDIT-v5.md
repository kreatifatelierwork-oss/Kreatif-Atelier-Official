# Audit of the v5 build (2026-10-09), before the film rebuild

What was recorded: a full forward scroll through the home page and all five company pages, at 1440 × 810 (wheel) and
390 × 844 (touch swipes), as video (`docs/audit-v5/*.mp4`, local only, about 63 MB; re-record with
`scripts/research/scroll-record.mjs`). Contact sheets taken from those videos are committed in `docs/audit-v5/`:
`travel-home-1440-01…08.jpg` (every 0.5 s of the home scroll), `travel-home-390-01…03.jpg`,
`travel-<company>-1440.jpg` / `-390.jpg`.

Verdict: it does not hold up. The world reads as a set of flat pictures and procedural props moving against each
other, not a place. Text arrives broken, overlaps, and is cut by geometry. Lines and graphic furniture add noise
instead of meaning. The phone version is worse: the ink paints a large shape down the middle of every swipe and
covers the text. The list below is what the film rebuild must not repeat.

## 1. The world is not a world
- **Pasted-image look.** The depth dioramas are still photographs on a surface. At every hold they look right; in
  between they shear, stretch and tear (`travel-home-1440-02`, frames 4 and 9: the canopy plate folds into a floating
  sheet; `-03` frame 1: the atlas terrain shows through a canyon plate; `-07`/`-08`: vertical "curtain" smears of
  the summit plate).
- **Rectangles in the world.** Foreground cut-outs and plates show their rectangular edges against the sky
  (`travel-home-1440-01` frame 5: a grey slab behind "Kreatif Atelier"; `-04` frame 8: a framed bamboo panel;
  `-05`: square sky patches in the Asraya and Rudra frames).
- **Procedural props look like a game from 2005.** Cone mountains, blob rocks, flat-shaded crown cards and the leaf
  shader read as CG placeholders next to the painted plates (`-02` frame 9, the atlas; `-03` frames 1–2, the canyon's
  black spikes; the "Five Peaks").
- **No real transitions.** Every change of world is a crossfade between two pictures with geometry fighting in the
  middle (`-03` frame 5 → 6: canyon to cave; `-04` frame 4: reef to lake; `-05` frame 4: ice to summit). Nothing is
  flown through.
- **Colour and light jump.** The jungle is murky brown-green; the next frame is a blown-out peach sky; the summit is
  smeared orange. No single grade holds the film together.
- **The gold ribbon** is a scribble that kinks, doubles back and floats off at random angles (`-01` frame 2, `-02`
  frame 6, `-03` frame 2). It reads as a glitch, not a guide.

## 2. Text
- **Text cut by the world.** 3D-drawn words are sliced by trunks and vines ("Where Strateg / Where Sto", `-01`
  frames 5–6), cut off at the frame edge ("Kre", `-01` frame 5; "Disciplines today. A brighte", `-07` frame 4).
- **Overlapping blocks.** Neighbouring places' text sits on top of each other while travelling: "Kreatif Atelier"
  over "5 Verticals ∞ Creative Vision" (`-02` frame 4), "Five pillars." over the Vision ellipse over "The Five Peaks"
  card (`-02` frame 7), "Our ecosystem serves" over "Impact" with both label sets interleaved (`-07` frame 7),
  "Built by leaders…" over "The Night Sky" card (`-08` frame 1), the industries list colliding with the founders
  (`-08` frame 2).
- **Text pops and wipes.** Items wipe in at different moments, so a headline appears before its subtitle, a pin
  label before its pin; at speed, blocks flash past half-revealed ("Chapter Eleven" under "The Night Sky").
- **Unreadable small type.** Pin labels, mono labels and the field notes are tiny, low-contrast, and float over busy
  imagery (the pillars' labels, the atlas labels, the industries list, the process columns on the night sky).
- **Too many sizes and faces in one frame.** Serif headline, italic narration, sans labels, mono captions, buttons:
  often five treatments at once.
- **Phone:** headlines break into one word per line, columns overflow the screen (`travel-home-390-02`: process
  steps and why-us notes running off both edges), and the closing block sits under the act bar.

## 3. Lines and furniture
- **Leader lines** zig-zag from rings to labels and cross other text (`-01` frame 7, `-05` frame 2).
- **The vision ellipse** is a thin gold oval drawn across the clouds and the peaks (`-02` frames 6–7).
- **Pins** (ring + tick + hairline) clutter the peaks, the atlas, serves and impact.
- **The journey trail** (bottom left) is a wobbly gold line that means nothing to a visitor.
- **The ornament rules** (line ✦ line) under every heading, the strata bands' borders, the journal card's shadowed
  box (`-07` frame 9) and the Five Peaks title card's dark plate (`-01` frame 5) add boxes and lines everywhere.
- **The act bar** hairline plus the top bar hairline frame the picture like a template.

## 4. Motion and feel
- At a normal scroll pace the scene is never still long enough to read: as soon as a place settles, the next
  passage starts tearing the world apart.
- The empty passages between holds show the worst of the world (shearing plates, props popping in), so the eye
  is drawn to the faults.
- The title cards (letterbox bars and a dark plate) appear mid-travel over unrelated imagery.
- **Phone:** the cursor ink (locked) draws a large difference-blended shape along every swipe, right through the
  text column (`travel-home-390-01/02`, `travel-valora-390`). This is the single most visible fault on phones. The ink
  is locked, so this needs the user's decision (for example: ink off while swiping on touch, or ink under the text
  layer). Not changed here.

## 5. Company pages
- Each page is one plate with a few props; most of the scroll shows the same blurred picture behind the closing
  buttons (`travel-aurelius-1440`: 8 of 12 frames are the identical "Onward" view).
- The strata (pricing) are three translucent boxes with tiny body text; the industries are a mono bullet list in the
  sky; the services are six labels on stalks.
- The crossing from a portal is a haze over a zoom of the old frame; the arrival is a different photograph.

## 6. What the film rebuild must guarantee (the checklist)
1. One continuous picture: no plates, no props, no geometry; the frame is always a finished film frame.
2. No frame ever jumps, flashes, blanks or tears, forwards or backwards; seams frame-identical.
3. Text is a separate page layer that moves at scroll speed; never cut by the picture, never overlapping another
   block, never blurred or faded; one block on screen at a time (two only while one leaves and the next arrives, and
   never on top of each other).
4. Two type treatments per screen at most (serif headline + one body style); readable size and contrast on phones,
   with a soft gradient where the picture is bright.
5. No connector or decorative lines, no ornament rules, no boxes around text, no trail; one minimal progress
   indicator and the act bar.
6. Phone layouts written for the phone (no overflowing columns, no word-per-line headlines).
7. Company pages carry their full content as designed text over their own film, not one repeated frame.
8. Reduced motion: still keyframes with the same text, no scrubbing.
