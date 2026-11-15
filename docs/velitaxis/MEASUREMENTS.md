# MEASUREMENTS

All values measured in this project, not estimated.

## Tests

- Vitest: 40 passing (3 files: game, coach, history parser).
- Playwright: 21 tests across game, intro, setup, quality, and screenshots.
- axe: 0 violations on the opening screen, the win state, the briefing, and the setup.
- Contrast: 13/13 pairs pass (`scripts/contrast.mjs`).

## Lighthouse 13.6 (production build, localhost)

Measured before the briefing, setup, and match-history additions; those add a small
amount of markup and localStorage reads. Accessibility, best practices, and SEO were
100 in every run. The host was also running a second Next dev server, so performance
varied.

| Preset | Performance | A11y | Best practices | SEO |
|---|---|---|---|---|
| Desktop, best run | 99 | 100 | 100 | 100 |
| Desktop, range | 74–99 | 100 | 100 | 100 |
| Mobile, best run | 92 | 100 | 100 | 100 |
| Mobile, range | 74–92 | 100 | 100 | 100 |

Representative metrics (best runs): desktop FCP/LCP 0.2 s, TBT 90 ms, CLS 0; mobile
FCP/LCP 0.8 s, TBT 350 ms, CLS 0.

## Layout

- Desktop 1440×900: board frame 560 px; 1366×768: 488 px; 1280×800: 520 px;
  1024×768: 392 px (column-bound).
- No page scroll at any of those desktop sizes. **NEW GAME** lives in the top-right
  CASE CONTROL panel and is visible without scrolling.
- Mobile 390×844: board 316 px; the page scrolls; NEW GAME is full-width under the
  board.
- The coach is mounted once and grid-placed (left on desktop, above the board on
  mobile), not duplicated.
- Dialogs are native `<dialog>` elements, centered, with the page behind inert.

## Persistence (all localStorage)

| Key | What | Limit |
|---|---|---|
| `nine-files:ledger:v1` | Cross/lead wins, O'Rourke wins, draws | — |
| `nine-files:matches:v1` | Finished games: winner, moves, date | 25 |
| `nine-files:name:v1` | The player's detective name (X side) | 18 chars |
| `nine-files:intro:v1` | Story briefing seen | — |
| `nine-files:setup:v1` | Full-screen/name setup seen | — |
| `nine-files:sound:v1` | Sound preference | — |

## Assets

- Repo screenshots (WebP): 9–56 KB each in `docs/screenshots/`.
- No raster art in the app; all marks, pins, textures, the captain, and the grain are
  CSS/SVG.
- Fonts are self-hosted by `next/font`: Oswald, Source Serif 4, Courier Prime.
- No animation library; CSS keyframes and one canvas burst.
