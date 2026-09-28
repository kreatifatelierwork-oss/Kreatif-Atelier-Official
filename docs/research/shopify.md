# Shopify Editions — Spring '26 (shopify.com/editions/spring2026)

Studied 2026-09-28 in headless Chrome at 1440×813 and 390×844. Screenshots in `docs/research/shopify/`
(`d-*` desktop scroll, `i-*` interactions, `m-*` phone).

## Concept
A seasonal release note for 150+ product updates, turned into an editorial *event*. Theme word: "Everywhere".
Art direction: dreamy, pointillist/impressionist particle landscapes and light phenomena (a spring forest
rendered as coloured specks, auroras, vortices, crystal light) — the season and the idea of commerce
dissolving into every surface.

## How it makes a huge amount of content feel explorable
1. **Ten named chapters** (Agentic, Sidekick, Online, Retail, Marketing, Operations, Shop app, Payments,
   Finance, Developer) with a **table of contents right in the hero** — you choose your path from second one.
2. **A strict, repeating rhythm per chapter**: full-bleed art film + giant chapter word → one headline
   feature with a framed product demo → dense grid of update cards (3 columns: small media, title, two lines).
   The rhythm makes 150 items predictable, so you can skim.
3. **Hierarchy by size, not decoration**: one hero feature per chapter gets a big stage; the rest are
   equal, quiet cards. Links inside card text lead deeper.
4. **A floating chapter pill** bottom-centre always names where you are; the label rolls letter-by-letter
   when the chapter changes; click it for a list of all ten to jump anywhere. "Back to navigation" links
   at chapter ends.
5. **Live UI demos, not screenshots**: framed product UIs animate (a chat types "Perfect, add it to my cart",
   buttons like "Add product / Split payment" trigger scripted demos).
6. **Art as chapter breath**: each chapter opener is a different artwork, so the long scroll never feels
   repetitive even though the layout is.
7. **Small delights**: the "Everywhere" word wrapped around a rotating 3D ring in the hero; an "Everywhere Cap"
   merch easter egg; split-letter text reveals.

## Loader and intro
A faint cloud of twinkling dots on black → the pointillist forest video fades up with the 3D word-ring and
the lede "150+ updates to sell, shop, and build everywhere" beside the ten-chapter index.

## How it's built
- Shopify Hydrogen/Oxygen (React/Remix), ~750 KB JS across ~90 chunks (lazy).
- **Mostly video, not live WebGL**: chapter art is streamed 720p MP4, with lightweight WebP posters
  (`*-mobile-optimized.webp`). three.js core is lazy-loaded for the 3D text ring only (a single canvas).
- Fonts: one grotesk family (Shopify's own), 3 WOFF2 files.
- Analytics/marketing pixels load too (Facebook) — the cost of a corporate page.

## Typography and colour
One clean grotesk at a few sizes: enormous chapter words (thin, white, on art), mid headlines, small card text.
Black UI chrome; colour comes only from the art. Links are underlined — plain, confident, readable.

## Motion character
Calm. Art videos loop softly; text reveals are short; the only continuous motion is the hero ring and the
videos. The restraint lets the density of content stay legible.

## Blur and depth
The art itself is the depth: bokeh, streaks and particle haze. UI stays crisp on top — a strong contrast
between dreamy background and sharp information.

## Mobile adaptation
Single column; the chapter index sits under the hero; the chapter pill becomes the hamburger menu + section
headers; art films become shorter chapter banners; demos scale down. The 3D word-ring is kept.

## What makes it feel premium
1. **Editorial confidence at scale** — a clear structure lets them be dense without being overwhelming.
2. **A theme word and an art direction** applied consistently across ten very different chapters.
3. **Always-available wayfinding** (index in the hero, chapter pill, back-to-navigation).
4. **Show, don't tell** — animated product demos inside the story.
5. **Cheap-to-run spectacle** — video instead of live 3D, so it's fast everywhere.

## Relevance for Kreatif Atelier
Our content is smaller but *varied* (six services, three tiers, four founders, four divisions, six reasons,
five steps, thirteen industries). The Editions lessons apply directly: a visible index of chapters, a repeating
per-chapter rhythm, one hero moment per chapter, a persistent "you are here" control, and art (not layout)
providing variety.
