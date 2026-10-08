# Kreatif Atelier: the film (shot list for AI video)

The website becomes a scroll-driven film: one continuous camera move made of short clips, each clip flying from one of your reference images to the next. Claude Code then builds the website around the film (text, cursor ink, navigation, company pages).

---

## STEP 1: Clean keyframes (ChatGPT)

Every reference image has text, buttons and lines baked in. The video tool needs clean frames. In ChatGPT, upload each image and paste:

```
Edit this image: remove ALL text, letters, numbers, buttons, top and bottom bars, labels, callout lines, map lines and any drawn graphic lines. Keep the scene, composition, camera angle, lighting and colours exactly the same, and fill the removed areas naturally so it looks like an untouched film frame. Same size.
```

Save each result as `design-refs/keyframes/` + the image's code, e.g. `h03.png`, `a01.png`, `g02.png`.
Needed: H01 to H36, A01 to A06, G01 to G05, V01 to V04, S01 to S04, R01 to R04.
If a frame has no text (some transitions), just copy it in under the new name.

---

## STEP 2: Generate the clips (Kling or Luma)

Use a tool that supports a START frame and an END frame (Kling and Luma Ray both do; Runway currently doesn't). For each clip below: upload the start keyframe and the end keyframe, set 1080p, 16:9, about 8 to 10 seconds, and paste this prompt with the camera move from the table filled in:

```
One single continuous cinematic camera move from the first frame to the last frame: [CAMERA MOVE]. Smooth, steady, slow drone or steadicam motion, no cuts, no fades, no morphing or melting, objects stay solid and real, consistent lighting, photoreal film look, subtle film grain. The ribbon of gold light glides ahead of the camera. No text, no letters, no logos, no people.
```

If a clip morphs or warps, regenerate it, or make the camera move gentler. Download in the highest quality offered, with no watermark (paid plan), and check the plan allows commercial use.

Save to the file name shown.

### Home page (design-refs/film/home/)

| File | Start → End | Camera move |
|---|---|---|
| c01.mp4 | h01 → h02 | glide forward out of the gold mist and descend into an extreme close-up of a wet leaf as a gold drop lands |
| c02.mp4 | h02 → h03 | pull back from the leaf and rise into a misty jungle path between giant roots |
| c03.mp4 | h03 → h04 | glide forward along the path into a clearing with a stream |
| c04.mp4 | h04 → h05 | drift sideways past tree trunks along the stream |
| c05.mp4 | h05 → h06 | push in toward a giant translucent leaf glowing in the light |
| c06.mp4 | h06 → h07 | turn toward a colossal tree and begin rising up its mossy trunk |
| c07.mp4 | h07 → h08 | rise vertically up the trunk through layers of leaves |
| c08.mp4 | h08 → h09 | burst up through the top of the canopy into sunrise sky, leaves scattering past |
| c09.mp4 | h09 → h10 | rise and fly forward above the clouds into golden sunrise |
| c10.mp4 | h10 → h11 | fly low and fast over the sea of clouds |
| c11.mp4 | h11 → h12 | fly toward five mountain peaks rising out of the clouds |
| c12.mp4 | h12 → h13 | climb high above the peaks until the whole world spreads out below like an atlas |
| c13.mp4 | h13 → h14 | dive down out of the sky into a vast desert canyon at dusk |
| c14.mp4 | h14 → h15 | fly along the carved terraces of the canyon |
| c15.mp4 | h15 → h16 | glide down the canyon toward a carved doorway glowing in the cliff |
| c16.mp4 | h16 → h17 | lift out of the canyon and fly into the dark mouth of a cave in the mountainside |
| c17.mp4 | h17 → h18 | move deep into a vast cavern lit magenta, past painted walls |
| c18.mp4 | h18 → h19 | glide through the cavern toward a shaft of light falling on waterfall mist |
| c19.mp4 | h19 → h20 | fly through the mist and out of the cave through a sea arch onto coastal cliffs at sunset |
| c20.mp4 | h20 → h21 | descend from the cliffs and fly low over the sea toward islands joined by bridges of light |
| c21.mp4 | h21 → h22 | dive beneath the water surface into a coral reef |
| c22.mp4 | h22 → h23 | swim up through the reef and break the surface into a misty lake |
| c23.mp4 | h23 → h24 | glide across the still jade lake toward a hot spring at the shore |
| c24.mp4 | h24 → h25 | drift slowly over the lake past floating lanterns |
| c25.mp4 | h25 → h26 | rise up the valley and fly toward a towering blue glacier and into an ice cave |
| c26.mp4 | h26 → h27 | move deep into the cathedral of ice and crystal |
| c27.mp4 | h27 → h28 | fly out of the ice cave onto a glacier under a vast aurora |
| c28.mp4 | h28 → h29 | rise up the mountain to a summit above the clouds at dusk |
| c29.mp4 | h29 → h30 | orbit slowly around the summit looking down at trails |
| c30.mp4 | h30 → h31 | continue the orbit as the light turns to last gold |
| c31.mp4 | h31 → h32 | settle into blue hour on the summit |
| c32.mp4 | h32 → h33 | tilt up into the night sky full of stars |
| c33.mp4 | h33 → h34 | drift across the starry sky |
| c34.mp4 | h34 → h35 | descend from the stars down a mountain trail at night |
| c35.mp4 | h35 → h36 | descend through night into dawn and land in a jungle clearing |

### Portals into the company pages (design-refs/film/portals/)

| File | Start → End | Camera move |
|---|---|---|
| p-aurelius.mp4 | h16 → a01 | fly straight through the glowing carved doorway into a hidden canyon city |
| p-ggp.mp4 | h19 → g01 | fly straight through the curtain of light on the mist into an inner cavern |
| p-valora.mp4 | h22 → v01 | swim through an underwater coral arch and surface among islands |
| p-asraya.mp4 | h25 → s01 | pass through a stone gateway into a hidden misty valley |
| p-rudra.mp4 | h28 → r01 | fly through a glowing ice gate into a crystal cathedral |

### Company pages (design-refs/film/pages/)

| File | Start → End | Camera move |
|---|---|---|
| aurelius-c01.mp4 | a01 → a02 | glide into the canyon city and up toward the great stair |
| aurelius-c02.mp4 | a02 → a05 | rise up the stair and sweep across the canyon past four carved chambers |
| aurelius-c03.mp4 | a05 → a03 | move into a carved hall with six alcoves |
| aurelius-c04.mp4 | a03 → a04 | fly out of the hall and along a cliff face of layered rock |
| aurelius-c05.mp4 | a04 → a06 | rise to the top of the canyon city at night |
| ggp-c01.mp4 | g01 → g02 | glide toward the giant gold zoetrope spinning in the cavern |
| ggp-c02.mp4 | g02 → g03 | move past the zoetrope into a chamber of shadow play |
| ggp-c03.mp4 | g03 → g04 | glide through into chambers of light painting and camera obscura |
| ggp-c04.mp4 | g04 → g05 | move along a long cave gallery |
| valora-c01.mp4 | v01 → v02 | fly low along a bridge of light between two islands |
| valora-c02.mp4 | v02 → v03 | dive beneath the water into the reef |
| valora-c03.mp4 | v03 → v04 | rise from the reef to the last island at sunset |
| asraya-c01.mp4 | s01 → s02 | glide down into terraced hot springs |
| asraya-c02.mp4 | s02 → s03 | move into a cathedral of tall bamboo |
| asraya-c03.mp4 | s03 → s04 | walk up the valley toward a glacier in the distance |
| rudra-c01.mp4 | r01 → r02 | glide deeper into the crystal lattice inside the ice |
| rudra-c02.mp4 | r02 → r03 | fly out onto the glacier under the aurora |
| rudra-c03.mp4 | r03 → r04 | rise to the glacier ridge looking toward a distant summit |

Total: 35 home clips, 5 portals, 18 company-page clips (58 clips).

Tip: generate c01 to c12 first (the jungle to the five peaks) and give those to Claude Code before doing the rest, so you can judge the result early.
