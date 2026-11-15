# NEXT TASK

## Task ID

TASK-0031

## Title

THE NINE FILES — tic-tac-toe submission build

## Objective

Build, test, deploy, and package a noir-themed tic-tac-toe app that satisfies the
SUpost / CapM test on a live Vercel URL, and that doubles as a portfolio piece.

## Status

Vercel production is live at `https://the-nine-files.vercel.app`. Repo is public at
`https://github.com/Calfredo23/the-nine-files`. Commit `9938e7c` is pushed to `main`;
GitHub CI passes, and live smoke verified the CALFREDO footer and an Analytics `POST
/view` returning HTTP 200. Owner reports Web Analytics enabled on Hobby. README, reviewer
notes, demo script, and refreshed screenshots are published.

## Next action

1. Submit the form with the live URL, refreshed screenshots, and optional demo.

## Acceptance criteria

1. Live production URL: two players alternate; win and draw are shown; NEW GAME resets.
2. Solo works on either side: THE HOUSE moves, the board locks while it thinks, and the
   player can win.
3. The coin toss picks a side, animates, and plays a dedicated SFX.
4. NEW GAME restarts from briefing, full-screen prompt, name, mode, and side; RESET
   SCORES clears the ledger and match history.
5. Scoreboard counts wins and draws and survives a reload.
6. 360 / 768 / 1440 layouts have no horizontal scroll and 44px tap targets.
7. Keyboard-only play works; axe reports zero violations; contrast is measured.
8. `typecheck`, `lint`, `test`, `build`, and Playwright e2e all pass.
9. Public GitHub repo with README, screenshots, and CI badge.
10. Submission assets: desktop/tablet/mobile screenshots, win and solo screenshots,
    reviewer notes, optional demo script.
11. Desktop fits without page scroll at 1440×900, 1366×768, 1280×800, and 1024×768;
    New Game is always visible.
12. Capt. Hale grades each move and the note is announced; the captain animates while
    the note reveals.
13. No secret is committed or read by the session.

## Build order

1. Scaffold, VELLITAXIS state, design contract (`SPECS/DESIGN_PLAN.TIC-TAC-TOE.md`).
2. Pure game logic + unit tests.
3. Board, marks, responsive shell — playable at all widths.
4. Animation pass: pin, monocle, yarn, stamp, flash, sound.
5. Accessibility, reduced motion, keyboard.
6. E2E, axe, screenshots, Lighthouse.
7. Metadata, OG image, 404, README, review pass.
8. Deploy, verify live, submission pack, close-out.

## Do not

- Do not replace X/O with abstract symbols; the reviewer must read the game instantly.
- Do not make the reviewer hunt for New Game.
- Do not let the theme break contrast, focus, or reduced-motion behaviour.
- Do not let solo mode displace the required local two-player path; mode defaults to it.
