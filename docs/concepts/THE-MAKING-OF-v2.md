# "The Making of a Legacy", v2: redesigned to the design sources of truth

- **Status:** PROPOSAL, 2026-09-30. Nothing is built until approved.
- **Basis:** the approved concept (`THE-MAKING-OF.md`), the buttermax opening and cursor (checkpoint 1, `/film`)
  and `docs/DECISIONS-SO-FAR.md`, re-designed through `docs/design/PHILOSOPHY.md` and `DESIGN.md`.
- **Note:** the "unified-idea proposal" message the brief refers to did not arrive in this session. If it held
  extra goals, please re-send them.
- **Assumption:** this proposal is written for the **recommended** conflict resolutions in `docs/design/AUDIT.md`
  (Cinema theme default, no telemetry HUD, punctuation-only copy fixes, house colours as markers). Each place that
  depends on a pending decision is marked (C#).

---

## 1. What stays the same
- **The story:** an idea becomes a legacy. It is a film in seven acts, with credits and a post-credits scene. The
  holding company is the reveal, not the premise. Every live-site section and the company chart appear as plot
  points.
- **The protagonist:** one gold Idea, the only lit thing on screen, changing form act by act and ending as a solid
  gold monument.
- **Navigation:** scroll, swipe or drag scrubs the film forwards and back. **Watch** plays it hands-free, and
  **Direct** gives you the controls. Arrow keys step through acts, and J, K and L work like a film editor's
  shuttle.
- **The opening:** the buttermax rhythm, beat for beat:
  1. The ✦ builds.
  2. The gate asks "Enter with sound / Enter in silence".
  3. A short dip.
  4. The halftone flood.
  5. The Idea rises.
  6. The title reveals.
  7. Everything settles.
- **The cursor:** the buttermax behaviour. A fluid ink inverts whatever it covers, and the Idea turns to face you
  with weight. Each act gives the pointer one extra role built on that same system.
- **The sound:** a generated score, silent until chosen, with a mute toggle always visible.

## 2. What changes because of the design sources
| Before | Now | Why (source) |
|---|---|---|
| Light pearl + brass default | **Cinema:** ink `#0B0F1A` + gold `#C9A45C` (the brand's original palette); Daylight as the alternate (C1) | The cream + brass default is banned; film references are dark (taste-skill §4.2) |
| HUD telemetry (FPS, particles, cursor XY, local time, form counter) | **Removed.** One act scrubber with the act name + real film timecode (C2) | Fake technical labels are the #1 AI tell (image-to-code §17) |
| "Kreatif" sans + "Atelier" serif | "Kreatif Atelier" wholly in Outfit 500 | No mixed-family emphasis (taste-skill §4.1) |
| Four fonts | Three roles: Outfit display, Cormorant voice, Plex Mono utility (C6) | Too many font moods (image-to-code §29) |
| Idea as a sphere of dots | Idea as a **folded ribbon of light** with a clear front and top: abstract, directional, never a mark | "Floating blobs / spheres" slop (imagegen-web §8) |
| Labels and pills floating on the scene | Captions **beside** the subject in one off-grid block; nothing on the image | No labels overlaid on images (taste-skill §9.F) |
| Five house colours as backgrounds and UI | House colours as **identity markers only** (C5) | One accent (taste-skill §4.2) |
| Bloom and halos | **One light:** the Idea's own glow; no other glow (C7) | No outer glows (taste-skill §9.A) |
| Rainbow flood rim | Gold rim (C8) | No rainbow gradients (imagegen-web §13) |
| Numbered reels, vertical edge text, scroll cues | Names only; top bar + scrubber only | taste-skill §9.F |

## 3. The film, scene by scene
Each scene below is one poster frame. Each lists:
- the **composition anchor** (a different one per scene, per imagegen-web);
- the **background mode**;
- the **exact copy** shown (all word for word from content files, except items marked PROPOSED);
- the **pointer role**.

Every scene has a reference image prompt in `docs/design/IMAGE-PROMPTS.md`.

### 00. Gate
- **Anchor:** stacked centre.
- **Background:** Canvas Deep solid.
- **Copy:**
  - the ✦, building from gold points;
  - **"Enter with sound"** (primary) and **"Enter in silence"** (ghost).
- **Pointer:** a plain pointer; no ink yet.

### 01. Title
- **Anchor:** bottom-left text over a full-bleed image.
- **Background:** the film. The Idea is large, upper-right of centre, as a raw ribbon of light.
- **Copy:**
  - "Kreatif Atelier" (display-hero);
  - "Where Strategy Meets Story. / Where Story Becomes Legacy." (voice, two lines);
  - **Watch** (primary) and **Direct** (ghost).
- **Pointer:** the ink begins here, and the Idea turns to face you.

### 02. Act I · Idea
- **Anchor:** low-right caption.
- **Background:** raw light. The Idea is restless and reacts to every movement.
- **Copy:**
  - "Idea" (act title);
  - "We build brands that actually move people." (voice-lg);
  - "Great creative work is not decoration: it is a business tool." (voice-md; punctuation per C3).
- **Pointer:** stirs the Idea. The ink trail pushes its light.

### 03. Act II · Strategy (Aurelius)
- **Anchor:** high-right caption. The Idea sits left.
- **Background:** blueprint mode. The Idea is drawn as fine cream construction lines, with dimension marks and
  section cuts, on ink.
- **Copy:**
  - "Strategy" (act title);
  - "Aurelius" (display-md);
  - "Brands / Strategy / Growth" (stacked);
  - "Builds brands that lead and last." (voice);
  - "Discovery & Audit" and "Strategy & Positioning" (body, as two named steps, not numbered);
  - "Brand Strategy & Identity" (body).
- **Pointer:** **the Lens.** A 220px circle shows the finished gold render *through* the blueprint. Phone: hold
  to look.

### 04. Act III · Story (Golden Guardian Productions)
- **Anchor:** low-left caption.
- **Background:** cinema mode. The blueprint gets rendered: warm projected light, and the Idea becomes the
  surface of a moving picture.
- **Copy:**
  - "Story";
  - "Golden Guardian Productions";
  - "Stories / Visuals / Impact";
  - "Creates powerful stories that inspire and influence.";
  - "Creative Development";
  - "Creative Production" and "Creative Direction & Campaigns".
- **Pointer:** **Roll** (ghost button, PROPOSED label). Holding it runs the projection; moving the pointer pulls
  focus.

### 05. Act IV · Movement
- **Anchor:** top-left lead, with the marquee across the bottom third.
- **Background:** flow map. The Idea bursts into streams that run outward.
- **Copy:**
  - "Movement";
  - "Sector-fluid. Results-focused.";
  - "Execution & Publishing" and "Review & Optimize";
  - "Social Media Management", "Performance Marketing" and "Public Relations & Media";
  - the **industries marquee** (all 13).
- **Pointer:** **Launch** (PROPOSED). Each click sends a wave through the streams, and the pointer steers them.

### 06. Act V · People (Valora + Asraya)
- **Anchor:** centred low. The constellations fill the frame.
- **Background:** constellations of light shaped like groups of people (abstract, no faces).
- **Copy:**
  - "People";
  - "Valora", "People / Skills / Opportunities" and "Bridges education with real-world opportunities.";
  - "Asraya", "People / Balance / Wellbeing" and "Enables people to live healthier, more meaningful lives.";
  - "Our ecosystem serves" followed by the six groups set as a stacked list.
- **Pointer:** **Breathe** (PROPOSED). Holding makes the crowd breathe with you; three breaths complete it.

### 07. Act VI · Futures (Rudra Yugen)
- **Anchor:** right-third caption. The lattice is on the left two-thirds.
- **Background:** the lattice, with signals travelling along it.
- **Copy:**
  - "Futures";
  - "Rudra Yugen";
  - "Innovation / Culture / Futures";
  - "Builds what's next at the intersection of creativity and technology.".
- **Pointer:** **Spark** (PROPOSED). Tapping or hovering sends signals through the lattice.

### 08. Act VII · Legacy
- **Anchor:** centred statement, low. The monument stands centre.
- **Background:** the **material switch** (the second-read moment). For six acts the Idea has been light; here it
  condenses into one solid, polished gold form, the only solid object in the film.
- **Copy:**
  - "Legacy";
  - "Multiple verticals. One vision. Exponential impact." (display-lg);
  - "Disciplines today. A brighter tomorrow." (voice).
- **Pointer:** drag to turn the monument.

### 09. The Houses
- **Anchor:** full-width component.
- **Background:** solid surface slices on ink.
- **Copy:** the five houses as a **hover-accordion**. Each opens to show its tagline (stacked words), the four
  "what we do" items and its value line. A 3px house-colour edge on each slice.
- **Pointer:** hover or focus widens a slice.

### 10. Vision and Impact
- **Anchor:** left-third caption with the right two-thirds visual.
- **Background:** the monument, dimmed.
- **Copy:**
  - "Vision" (label) followed by the vision sentence (voice-lg);
  - "Impact" (label) followed by the six outcomes as a stacked list.

### 11. Credits: the founders
- **Anchor:** off-grid editorial.
- **Background:** ink.
- **Copy:**
  - "A Kreatif Atelier film";
  - the **polaroid arc** of the four founders (cut-outs on prints). The selected one shows name, role and bio.
- **Pointer:** hover or focus lifts a print.

### 12. Credits: the work
- **Anchor:** stacked centre (the credits roll).
- **Copy:** in credits order:
  1. the houses as departments, each with its "what we do";
  2. the six services by name;
  3. the five process steps by name;
  4. "Hyderabad".

### 13. Credits: formats
- **Anchor:** stacked centre.
- **Copy:**
  - three credit blocks for Starter, Growth and Brand Partner, with prices exactly as live (punctuation per C3);
  - "Most Popular" as gold text above Growth;
  - the features and the note for each tier.

### 14. Post-credits
- **Anchor:** mini minimalist, centred.
- **Background:** Canvas Deep. The single ✦ returns, waiting (a callback to the gate).
- **Copy:**
  - "Ready to build something *worth remembering?*" (Outfit, with italic emphasis in the same family);
  - "Every great brand started with a single conversation. We offer a complimentary 30-minute brand audit call:
    no obligation, no pitch deck. Just honest strategy." (punctuation per C3);
  - **"Schedule Your Free Brand Audit ✦"** (primary, mailto);
  - "hello@kreatifatelier.com" and "@kreatifatelier" as plain text.
- **Pointer:** bringing the pointer to the ✦ makes it bloom gently. The primary button is the focal point.

### Chrome (every scene after the gate)
- **Top bar** (64px): "Kreatif Atelier" (text), then the sound toggle and **Index** on the right.
- **Act scrubber** (56px, bottom): one hairline with eight ticks, the current act name and the real timecode.
- **Index overlay:** the acts by name, Watch / Direct, and the contact action.

## 4. Design system summary
Full detail is in `DESIGN.md`.
- **Dials:** VARIANCE 7 · MOTION 8 · DENSITY 3.
- **Variation engine:**
  - theme: Deep Dark (C1);
  - background: full-bleed cinematic imagery;
  - type: editorial serif + sans (a trinity);
  - hero: massive image-first with restrained text;
  - sections: poster-like stacked storytelling.
- **Signature components:** off-grid editorial layout · hover-accordion slices (the houses) · infinite marquee (the
  industries) · turning polaroid arc (the founders).
- **Motion cues:** pinned narrative · cinematic fade-through.

## 5. How it gets built (after approval)
1. **Images first.** You generate the prompt pack (`docs/design/IMAGE-PROMPTS.md`) into `design-refs/`.
2. **Analysis.** For each image I write an extraction note (text, type scale, spacing, components, colour,
   layout, unclear details) in `docs/design/analysis/`, and ask for a regenerated detail image where something is
   unreadable.
3. **Build in phases, committing after each:**
   1. the chrome + title rebuilt to the new system (the /film checkpoint updated);
   2. acts I–III;
   3. acts IV–VII;
   4. the houses, credits and post-credits;
   5. QA: Playwright CLI at 1440 and 390, both themes, reduced motion, keyboard and Lighthouse.
4. **Fidelity rule.** Every frame is compared side by side with its reference image. Drift gets fixed, not
   explained.

## 6. New wording in this proposal (PROPOSED, needs your approval)
- **Pointer-role button labels:** "Roll" · "Launch" · "Breathe" · "Spark". Phone Lens hint: "Hold to look".
- **Chrome:** "Index" (menu) · "Sound on" / "Sound off".
- Everything else is existing copy or already approved.
