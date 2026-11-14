# MEASUREMENTS

All values measured in this project, not estimated.

## Tests

- Vitest: 22 passing (2 files).
- Playwright: 13 passing (game, quality, screenshots).
- axe: 0 violations, opening screen and win state.
- Contrast: 13/13 pairs pass (`scripts/contrast.mjs`).

## Lighthouse 13.6 (production build, localhost)

| Preset | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 99 | 100 | 100 | 100 |
| Mobile | 91 | 100 | 100 | 100 |

Metrics:

| Metric | Desktop | Mobile |
|---|---|---|
| FCP | 0.3 s | 0.9 s |
| LCP | 0.3 s | 0.9 s |
| TBT | 100 ms | 390 ms |
| CLS | 0 | 0 |
| Speed Index | 1.0 s | 2.2 s |

## Layout

- Desktop board: 510×510 at 1440×900; cells ~164px.
- Mobile board: 316×316 at 390×844; cells ~100px.
- No horizontal scroll at 360, 390, 768, or 1440.

## Assets

- Repo screenshots (WebP): 35–63 KB each in `docs/screenshots/`.
- No raster art in the app; all marks, pins, textures, and grain are CSS/SVG.
- Fonts are self-hosted by `next/font`: Oswald, Source Serif 4, Courier Prime.
