# How to measure creativity in a website, and in the flow itself

Written 2026-09-29 for Stage 5 (the new concept). Evidence comes from the 3D survey (`SURVEY-3D.md`), the earlier
studies (`oryzo.md`, `ivress.md`, `lacoste.md`, `shopify.md`, `igloo.md`) and published judging criteria and creativity
research (sources at the bottom).

## 1. What juries actually score
- **Awwwards:**
  - The main score is Design 40 %, Usability 30 %, Creativity 20 %, Content 10 %.
  - At least 18 jurors vote, and the 3 scores furthest from the average are dropped.
  - The separate Developer Award (a score above 7 is needed) judges semantics, animations, accessibility, performance,
    responsiveness and markup.
  - **Lesson:** "creative" sites mostly lose on usability and phones, not on imagination.
- **Studios' own summaries of 2025–26 winners:** the recurring praise is for three things.
  1. **One defended idea.**
  2. **Scene logic over page logic** (sequenced like film, with pacing and breathing room).
  3. **Technical restraint** (heavy effects only where they land).
- **Research on creativity:**
  - Creative work is judged on **novelty** (is it new?), **value** (does it do its job?) and **surprise** (did it break
    what you expected, then make sense?). Surprise is novelty measured against what the visitor *expects*, not against
    everything that exists.
  - The accepted way to rate it is the **Consensual Assessment Technique**: several people who know the field score the
    work independently on a 1–5 scale, then compare.

## 2. The rubric we'll use: 10 dimensions, each scored 0–5
Scores 1–4 cover novelty, value and surprise. Scores 5–9 cover what makes a *flow* unique. Score 10 keeps us honest.

| # | Dimension | Question | A 5 looks like |
|---|---|---|---|
| 1 | **Governing idea** | Can the whole site be said in one sentence, and does every screen serve it? | Oryzo ("launch a coaster like a flagship device"), Why Zero ("draw a zero to enter") |
| 2 | **Novelty of the flow** | Is the *way you move* new: not just scroll-down, but a mechanic that belongs to this brand? | Santioni hold-to-advance, Messenger dive from planet title to street level, Why Zero's drawn gesture as the door |
| 3 | **Surprise, then sense** | How many moments break expectation *and then click into meaning*, and how are they spaced? | igloo's explosion into blocks; Lusion's "glass breaks" moment; AirPods' x-ray of the case |
| 4 | **Value / clarity** | Does the visitor leave knowing what the company does, and could they act (contact, buy)? | AirPods: spectacle *and* every spec findable; Scout Motors: 3D plus a clear configure-and-buy path |
| 5 | **Protagonist and continuity** | Is there one thing you follow the whole way, changing mode instead of cutting? | Hubtown's single stream of light that multiplies; igloo's one camera; Lusion's ribbon threading through the page |
| 6 | **Mode shifts** | How many distinct visual "modes" (beauty, x-ray, blueprint, data, night…) happen inside one world? | Oryzo's thermal and sketch views; AirPods' cutaway; Lando's photo → 3D helmet → hand-drawn scribble |
| 7 | **Interaction as argument** | Does each input *restate the thesis* instead of decorating? | Ivress: hold to push back darkness; Why Zero: draw the zero; Lacoste: play the sport |
| 8 | **Responsiveness density** | How many channels respond (pointer position, speed, click, scroll speed, idle, sound, time, tilt), and do they feel like one physics? | Slosh (fluid cursor with bubbles), Lando (cursor reveals the helmet over the face), Active Theory (everything glitches and reacts) |
| 9 | **Sound as a layer** | Is sound part of the story and synced to the timeline, not wallpaper? | GQ × AP Lab (dialogue and score synced to scrubbing); Cartier (a composed score as a narrative layer); Messenger (spatial audio guides you) |
| 10 | **Craft, access and speed** | Materials, type, 60 fps on a mid-range phone, weight, reduced motion, keyboard, readable HTML | AP Lab held 60 fps on older iPhones; Tracing Art compressed 12 M records into light textures |

**Objective checks** sit alongside the 0–5 scores, so the scores aren't only taste:
- the number of input channels that respond;
- surprise beats per minute, and the longest stretch with none;
- the share of real content that exists as HTML text;
- first-load weight;
- Lighthouse on mobile;
- whether the site works with sound off, with motion reduced, and with keyboard only.

**Process:**
- You, your team and I each score blind, 0–5 per dimension, then compare. That's the Consensual Assessment
  Technique in practice.
- We score the concept on paper first, then the prototype, then the build.
- A dimension where the three of us disagree by 2 or more points gets discussed before building further.

## 2b. Measuring the uniqueness of the *flow* specifically
Three quick tests, usable on any site and on our own concept.

1. **Verb fingerprint.** Write down the visitor's verbs, one per beat.
   - Most sites read *scroll → read → scroll → click*.
   - Oryzo: *scroll → watch → laugh → read*.
   - Why Zero: *draw → watch → unlock → hold*.
   - Measure the number of **distinct verbs**, the **share that isn't scroll or click**, and whether each verb
     **means** something in the story (it counts only if it does).
2. **Screenshot test.** Take one frame from each beat and shuffle them. Can a stranger put them back in order and
   tell them apart? Distinct *modes* inside one world pass; a repeating template fails.
3. **Retell test.** After one visit, ask someone to retell the site in three sentences. A unique flow is retold as a
   *story* ("first you…, then it…, and at the end…"). A generic one is retold as a *list* ("they have services,
   founders, contact").

## 3. What the survey says, in numbers
From the 3D sites studied in headless Chrome with WebGL on (details in `SURVEY-3D.md`):
- **Scale of the survey:** 31 sites reached; 24 of them render WebGL.
- **Sound is now normal at this level.**
  - 13 of the 31 load an audio kit (about half of the WebGL sites): Lusion, Hubtown, Messenger, Why Zero, Sleep Well,
    Santioni, paodao, Primland, Montfort, GQ × AP, Slosh, Floema and DeepSee.
  - The kits share a pattern:
    - an ambient loop per stage (Hubtown `ambient-loop`; Why Zero `amb_stage1`, `amb_stage2-3`; Messenger `forest`,
      `city`, `factory`);
    - UI sounds (`hover`, `click`, `focus`, `modal-open`);
    - one-off narrative events (Lusion `glass_broken`, Why Zero `tunnel` and `glass-shatter`);
    - sometimes **voice-over narration** (Sleep Well ships spoken lines as separate clips).
  - Primland makes sound the default and offers "Start without audio".
- **A custom-cursor "trick" is less common than cursor-*driven* scenes.** Only Why Zero hid the system cursor
  (`cursor: none`), and only for its drawing gate. The pointer instead drives the world: Slosh's fluid, Lando's helmet reveal,
  Opal's dot-matrix torch, and Hubtown's and David Whyte's reveals.
- **Gates are part of the ritual:** Why Zero's "Draw a zero", Santioni's "Experience" and age check, Primland's
  "Explore the map / Start without audio", Messenger's "Begin" (then a loader drawn as an envelope), and Lusion's
  000→100 counter.

## Sources
- [Awwwards evaluation system](https://www.awwwards.com/about-evaluation/)
- [Award-winning web design: judging criteria decoded (Utsubo)](https://www.utsubo.com/blog/award-winning-website-design-guide)
- [Awwwards judging criteria: how scoring works (Hon Tran)](https://www.hontran.dev/blog/awwwards-judging-criteria)
- [Immersive website examples: a curated breakdown (Metabole)](https://metabole.studio/en/blog/immersive-website-examples)
- [Storytelling websites guide (Utsubo)](https://www.utsubo.com/blog/immersive-storytelling-websites-guide)
- [Creativity, surprise & design (Design Society)](https://www.designsociety.org/download-publication/32464/creativity_surprise_design_an_introduction_and_investigation)
- [Computational models of surprise in evaluating creative design (Maher et al.)](https://www.computationalcreativity.net/iccc2013/download/iccc2013-maher-brady-fisher.pdf)
- [Consensual Assessment Technique overview](https://www.sciencedirect.com/topics/psychology/consensual-assessment-technique)
