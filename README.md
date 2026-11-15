<div align="center">

# THE NINE FILES

**A noir tic-tac-toe case in nine clues.**

Two players. Nine cards. One wall.

[**Play the live game**](https://nine-files.vercel.app) · [Source](https://github.com/Calfredo23/the-nine-files)

[![CI](https://github.com/Calfredo23/the-nine-files/actions/workflows/ci.yml/badge.svg)](https://github.com/Calfredo23/the-nine-files/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087EA4?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-8E2B33)](LICENSE)

<img src="docs/screenshots/desktop-win.webp" alt="The Nine Files — a noir tic-tac-toe case wall with the winning line drawn in red yarn and a taped CASE CLOSED label" width="100%" />

</div>

## Overview

The Nine Files is a two-player tic-tac-toe game dressed as a detective's case wall.
Cross and O'Rourke claim nine pinned cards; three in a row closes the case. A captain
watching from the corner grades every move, the winning line is drawn in red yarn, and a
taped verdict lands on the board.

It was built for the **SUpost / CapM junior React + Next.js application test**. The test
asks for a working two-player game on a public Vercel URL. This is the version I
submitted.

The required behaviours come first and are literal:

- Two players alternate. **X** goes first, then **O**.
- The result is announced: **CROSS WINS — CASE CLOSED**, **O'ROURKE WINS — CASE CLOSED**,
  or **DRAW — COLD CASE**.
- **NEW GAME** starts a fresh board.
- The scoreboard counts wins and draws and survives a reload.

The theme never hides the rules: the cells show X and O, the primary button says NEW
GAME, and the result says WINS or DRAW.

## Features

| | |
|---|---|
| **First-visit briefing** | Capt. Hale sets up the case in three beats. Skippable, replayable. |
| **Full-screen setup** | A pre-game prompt recommends F11 (or Ctrl+Cmd+F) and asks for your detective name. |
| **Personalized side** | Your name becomes the X detective: card, turn banner, result, stamp, and coach. |
| **Move coach** | Every move is graded best / good / inaccuracy / mistake / blunder using minimax plus threat and fork detection. |
| **Post-match verdict** | 1.6 s after the result, the captain takes over with CONTINUE, TRY AGAIN, ONE MORE, STAY ON THE BOARD, and RESET SCORES. |
| **Saved history** | The last 25 finished games persist in the browser with winner, move list, and date. |
| **Scoreboard reset** | A visible, two-step reset that clears the counts and the match log. |
| **Sound** | A procedural noir loop and a soft per-word voice. MUSIC and SFX toggle independently and default on. |
| **Desktop fit** | The whole game fits one screen at 1440×900, 1366×768, 1280×800, and 1024×768 with no page scroll. |
| **Accessibility** | Keyboard play, focus management, native dialogs, reduced-motion support, measured contrast. |

## Screenshots

| Case briefing | Full-screen and detective name |
|---|---|
| ![Case briefing](docs/screenshots/intro.webp) | ![Full-screen and name setup](docs/screenshots/setup.webp) |

| Post-match verdict | Match history |
|---|---|
| ![Post-match verdict](docs/screenshots/desktop-post-match.webp) | ![Match history](docs/screenshots/desktop-history.webp) |

| Desktop board | Tablet |
|---|---|
| ![Desktop board](docs/screenshots/desktop-board.webp) | ![Tablet mid-game](docs/screenshots/tablet-midgame.webp) |

| Mobile | Mobile win |
|---|---|
| ![Mobile board](docs/screenshots/mobile-board.webp) | ![Mobile win](docs/screenshots/mobile-win.webp) |

## How it plays

1. Read the briefing, then enter a detective name. X is your side; O'Rourke takes the
   other.
2. Take turns claiming cards. Three in a row — across, down, or diagonally — closes the
   case.
3. The turn banner shows whose move it is. The move history lists every clue.
4. After the result, the captain offers CONTINUE after your win, TRY AGAIN after a loss,
   or ONE MORE after a draw.
5. **NEW GAME** is always in the top-right CASE CONTROL panel. The ledger keeps the
   scores and the last 25 matches.

## The coach

Capt. Hale is not a random line generator. Every move is evaluated with minimax values
plus immediate threat detection, so the grade reflects the position:

- **Best** — the move holds a forced win, blocks a live line, creates a fork, or is the
  only move that draws.
- **Good** — a sound centre, corner, or neutral move that keeps the position level.
- **Inaccuracy** — an edge that does less than the centre.
- **Mistake** — a better move was available, often a missed win.
- **Blunder** — the move loses the position or leaves a winning line open.

The note reveals word by word while the captain animates. After the result he speaks
again on the verdict screen.

## Sound

The score is a procedural noir loop: Am7 / Dm7 / E7 pads, an upright-style bass, brushed
noise, a sparse bell, and faint vinyl ticks. Capt. Hale's subtitles get a soft per-word
voice blip. There are no audio files; everything is synthesized with the Web Audio API.

**MUSIC** and **SFX** are independent toggles in the header, both on by default and both
persisted. Browsers block audio until a user gesture, so the loop and voice start on the
first click, tap, or key press.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.4 (App Router, static page) |
| UI | React 19.3, TypeScript strict |
| Styling | Tailwind CSS 4 with a small custom token layer |
| Motion | CSS keyframes and transitions; one canvas paper burst |
| Audio | Web Audio API synthesis; no audio files |
| Tests | Vitest, Playwright, axe-core |
| Hosting | Vercel |

No backend, no database, no accounts, no analytics, no cookies.

## Quick start

```bash
git clone https://github.com/Calfredo23/the-nine-files.git
cd nine-files
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click once on the page so the
browser permits audio.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright, axe, and screenshot capture |
| `npm run verify` | typecheck + lint + unit + build |

The Playwright suite builds and serves the production app on port 3211.

## How it works

- **Pure game logic** lives in `lib/game.ts`: board type, win lines, outcome detection,
  and a tested reducer.
- **The coach** lives in `lib/coach.ts`: minimax values, immediate threats, forks, and
  move grades.
- **Persistence** is localStorage through `useSyncExternalStore`: ledger, 25-match
  history, detective name, briefing/setup flags, music, and SFX. There is no server.
- **Dialogs** are native `<dialog>` elements for the briefing, setup, match history, and
  post-match verdict; the browser supplies the focus trap and inert background.
- **Animation** is CSS; the paper burst is the only canvas.
- **Audio** is a small scheduler in `lib/sound.ts` using oscillators, filtered noise, and
  gain envelopes.

## Quality

| Gate | Result |
|---|---|
| Unit tests (Vitest) | **40 passing** |
| E2E (Playwright) | **24 passing** on Ubuntu CI — game, briefing, setup/name, history, coach, post-match, reset, audio toggles, axe, no-scroll desktop, screenshots |
| Accessibility | **0 axe violations** on the opening screen, win, briefing, setup, and post-match verdict |
| Contrast | every measured pair passes WCAG AA (`scripts/contrast.mjs`) |
| Lighthouse | 100 accessibility, best practices, and SEO; performance 74–99 desktop and 74–92 mobile across repeated runs on a busy host |
| Desktop fit | no page scroll at 1440×900, 1366×768, 1280×800, or 1024×768 |

The Lighthouse numbers were measured before the briefing, setup, history, and
post-match additions; those add a small amount of markup and localStorage reads. The
axe and Playwright gates run on every push.

## Accessibility

- The board is a real ARIA grid: arrows move focus, Home/End jump, and Enter or Space
  plays.
- Turns and the result are announced; focus moves to the result when the game ends.
- The briefing, setup, history, and verdict are native dialogs with focus traps, Escape
  to close, and an inert page behind.
- Focus rings are visible, tap targets are at least 44px, and the layout fits 360, 390,
  768, and 1440 widths.
- Reduced motion removes shake, flash, particles, grain drift, rain, lamp flicker,
  captain motion, subtitle reveal, and the blinking cursor.
- X and O differ by shape and material, not only colour.
- Music and SFX are separate labelled toggles; nothing autoplays before a gesture.

## Deployment

The app is a static Next.js page, deployed on Vercel.

```bash
npx vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` to the production URL if it differs from
`https://nine-files.vercel.app`; it feeds the canonical URL and the OG image metadata.

## Project structure

```text
app/                    layout, page, metadata, OG image, icon, 404
components/             board, cells, marks, yarn, stamp, captain, coach, dialogs, ledger
hooks/                  coach, history, detective name, music/SFX preferences, speech
lib/                    game logic, minimax coach, history, storage, Web Audio, stores
tests/unit/             Vitest
tests/e2e/              Playwright, axe, screenshot capture
scripts/                contrast measurement, WebP optimisation
docs/velitaxis/         build state, design contract, measurements
submission/             reviewer notes and demo script
```

## Notes and limits

- **No AI opponent.** The brief asks for two players; the board stays two-player. The
  coach is analysis, not an opponent: it grades moves and never plays one.
- **Local data only.** Scores, history, name, and preferences live in localStorage. No
  account, no leaderboard, no personal data leaves the browser.
- **No third-party art or audio.** Textures, cards, pins, the monocle, and the captain
  are CSS or SVG. The music and voice are synthesized.
- **The screenshots are generated by the Playwright suite** from the production build.
- **Audio requires a gesture.** Browsers block autoplay; the first click starts the
  score. MUSIC and SFX can be turned off at any time.

## License

[MIT](LICENSE) © Cedrick Alfredo Catimbang
