# MEASUREMENTS

All values measured in this project, not estimated.

## Tests

- Vitest: 58 passing (6 files: game, coach, bot, players, settings, history parser).
- Playwright: 30 tests across game, intro, setup, mode/solo, quality, and screenshots.
- axe: 0 violations on the opening screen, the win state, the briefing, the setup, the
  solo side step, and the post-match verdict.
- Contrast: 13/13 pairs pass (`scripts/contrast.mjs`).

## Lighthouse 13.6 (production build, localhost)

Measured before the briefing, setup, match-history, and post-match additions; those add
a small amount of markup and localStorage reads. Accessibility, best practices, and SEO
were 100 in every run. The host was also running a second Next dev server, so
performance varied.

| Preset | Performance | A11y | Best practices | SEO |
|---|---|---|---|---|
| Desktop, best run | 99 | 100 | 100 | 100 |
| Desktop, range | 74-99 | 100 | 100 | 100 |
| Mobile, best run | 92 | 100 | 100 | 100 |
| Mobile, range | 74-92 | 100 | 100 | 100 |

Representative metrics (best runs): desktop FCP/LCP 0.2 s, TBT 90 ms, CLS 0; mobile
FCP/LCP 0.8 s, TBT 350 ms, CLS 0.

## Layout

- Desktop 1440x900: board frame 560 px; 1366x768: 488 px; 1280x800: 520 px;
  1024x768: 392 px (column-bound).
- No page scroll at any of those desktop sizes. **NEW GAME** lives in the top-right
  CASE CONTROL panel and is visible without scrolling.
- Mobile 390x844: board 316 px; the page scrolls; NEW GAME is full-width under the
  board.
- The coach is mounted once and grid-placed (left on desktop, above the board on
  mobile), not duplicated.
- Dialogs are native `<dialog>` elements, centered, with the page behind inert: the
  briefing, setup, match history, and post-match verdict.

## Persistence (all localStorage)

| Key | What | Limit |
|---|---|---|
| `nine-files:ledger:v1` | Cross/lead wins, O'Rourke/House wins, draws | - |
| `nine-files:matches:v1` | Finished games: winner, winner name, moves, date | 25 |
| `nine-files:name:v1` | The player's detective name (either side) | 18 chars |
| `nine-files:settings:v1` | Mode (`two`/`single`) and solo side (`X`/`O`) | - |
| `nine-files:intro:v1` | Story briefing seen | - |
| `nine-files:setup:v1` | Full-screen/name/mode/side setup seen | - |
| `nine-files:music:v1` | Music preference | - |
| `nine-files:sound:v1` | Sound preference | - |

## Assets

- Repo screenshots (WebP): 9-59 KB each in `docs/screenshots/`.
- No raster art in the app; all marks, pins, textures, the captain, and the grain are
  CSS/SVG.
- Fonts are self-hosted by `next/font`: Oswald, Source Serif 4, Courier Prime.
- No animation library; CSS keyframes and one canvas burst.
- No audio files; the noir loop and the per-word voice are synthesized with the Web
  Audio API. MUSIC and SFX toggle independently.
