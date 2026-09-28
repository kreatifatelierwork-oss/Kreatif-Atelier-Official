# Lacoste — Ace Breaker (members-play.lacoste.com/ace-breaker-rg)

Studied 2026-09-28 in headless Chrome with GPU WebGL at 1440×813 and 390×844 (touch). Played three full
rounds on desktop (53, 70 and 48 points; the idle game scores ~41) using a screen-watching auto-player that
steered the racket with real mouse input, plus a touch session on the phone.
Screenshots: `docs/research/lacoste/` — `d-*` flow, `play-*` gameplay, `round-*-result`, `m-*` phone.
On the phone a consent dialog appeared; I chose "Disagree and close".

## Concept
Brick-breaker (Breakout/Arkanoid) re-skinned as a Roland-Garros moment: a clay court seen from the player's
end, a green slab racket, a tennis ball, and walls of Lacoste-green bricks at the far baseline. Tennis
vocabulary names everything ("Ace Breaker", "Power shot", "Smash", "Defensive wall"). It's a **brand
activation with a funnel**: the result screen's primary action is *Register to become a member*.

## Flow and navigation
Loader → title → bonus primer → countdown → play → result (Register / Retry). A hamburger menu and the
crocodile mark are the only chrome. Pause button in-game. No scrolling anywhere — it's an app, not a page.

## Loader
The loader is a **miniature of the game**: a glowing tennis ball bouncing on a light bar over deep green.
You learn the mechanic before you've seen the game.

## Title and primer
- Title over a blurred, dimmed render of the stadium: "LACOSTE" in a sharp serif, "ACE BREAKER" in a big yellow
  grotesk, a small motion icon (ball deflecting off a bar), a yellow pill PLAY button.
- "6 bonuses to boost your game": six dashed-ring icons (Defensive wall, Multiball, Smash, Heavy ball,
  Racket XL, Power shot) — a one-screen tutorial that builds anticipation.

## Gameplay feel
- 3-2-1 countdown with "Click & hold to move". The racket follows the pointer only while held — a
  deliberate, tactile control that also works identically with a thumb.
- A glowing ring on the clay marks the hold point; the ball throws a soft light on the court; bricks flash
  white on impact and pop out.
- Power-ups announce themselves with a wide label that sweeps across the court (RACKET XL, DEFENSIVE WALL) and
  change the scene (the racket widens; glowing lines guard the baseline).
- Losing a life floods the whole court **red** for a beat — unmistakable feedback without text.
- HUD: three ball icons for lives, a big score counter. Rounds last ~30–45 s — short enough to retry.
- Result: "YOUR SCORE / 41 PTS" between hairlines, *Register to become a member* (outline) and *Retry* (yellow).

## How it's built
- Vue app + three.js r156 (custom bundle, ~150 KB), no physics library — hand-rolled collisions.
- One 1 MB Draco-compressed GLB stadium; large PBR clay textures (colour, normal, roughness, height),
  a 9.7 MB roughness map for the stands (heavy); an SDF texture for crisp crocodile/wordmark rendering.
- Real-time shadows are used heavily (the string "shadow" appears 400+ times in the renderer bundle).
- Instanced meshes for bricks and balls (multiball).
- Sound: an ambient crowd loop (`ambLoop.m4a`) and one audio sprite sheet for all hit/bonus effects.
- No `prefers-reduced-motion` handling found.

## Typography and colour
Lacoste green (deep, almost black) and clay orange with a single electric yellow for everything
interactive (PLAY, START, RETRY, score, ball). Serif for the house name, clean grotesk for the game.
Colour discipline makes the yellow read as "you can touch this".

## Mobile adaptation
Same game; the camera moves closer so the court fills a portrait screen; touch-and-drag controls the racket;
the primer becomes a 3×2 grid. Loading is noticeably slower on the phone profile.

## What makes it feel premium
1. **One mechanic everyone already knows**, dressed in the brand's world so completely it feels new.
2. **Juice**: light, flashes, sweeping labels, the red flood — every action has visible consequence.
3. **Tactile control** (click & hold) that's identical on mouse and touch.
4. **Short rounds + instant retry** — the "one more go" loop.
5. **The game has a job** (membership sign-up) but never nags; the CTA only appears when you've finished.
6. **Colour discipline**: one accent colour marks every interactive thing.

## Relevance for Kreatif Atelier
A playable mechanic can *demonstrate* the agency (e.g. building a brand, aiming a campaign, lighting up
a story) the way this one demonstrates tennis — as long as rounds are short, the controls are one-gesture,
and the end screen turns play into the contact CTA.
