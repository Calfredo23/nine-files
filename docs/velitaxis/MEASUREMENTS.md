# MEASUREMENTS

All values measured in this project, not estimated.

## Tests

- Vitest: 31 passing (3 files).
- Playwright: 15 passing (game, quality, screenshots).
- axe: 0 violations, opening screen and win state.
- Contrast: 13/13 pairs pass (`scripts/contrast.mjs`).

## Lighthouse 13.6 (production build, localhost)

The host was also running a second Next dev server and a browser, so performance
varied run to run. Accessibility, best practices, and SEO were 100 in every run.

| Preset | Performance | A11y | Best practices | SEO |
|---|---|---|---|---|
| Desktop, best run | 99 | 100 | 100 | 100 |
| Desktop, range | 74–99 | 100 | 100 | 100 |
| Mobile, best run | 92 | 100 | 100 | 100 |
| Mobile, range | 74–92 | 100 | 100 | 100 |

Representative metrics (best runs):

| Metric | Desktop | Mobile |
|---|---|---|
| FCP | 0.2 s | 0.8 s |
| LCP | 0.2 s | 0.8 s |
| TBT | 90 ms | 350 ms |
| CLS | 0 | 0 |

The lower runs tracked host CPU contention, not a code regression: the same build
produced 99/92 in quiet runs and 74/74 while the other server was busy.

## Layout

- Desktop board: 510px grid at 1440×900, 388px at 1366×768, 420px at 1280×800,
  342px at 1024×768.
- No page scroll at any of those desktop sizes. New Game's bottom edge was 799px,
  677px, 709px, and inside 768px respectively.
- Mobile board: 316px at 390×844; the page scrolls by design.
- The coach is mounted once and placed in the grid (left on desktop, above the board
  on mobile), not duplicated.

## Assets

- Repo screenshots (WebP): 32–54 KB each in `docs/screenshots/`.
- No raster art in the app; all marks, pins, textures, the captain, and the grain are
  CSS/SVG.
- Fonts are self-hosted by `next/font`: Oswald, Source Serif 4, Courier Prime.
- No animation library; CSS keyframes and one canvas burst.
