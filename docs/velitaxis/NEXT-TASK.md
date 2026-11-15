# NEXT TASK

## Task ID

TASK-0031

## Title

THE NINE FILES — tic-tac-toe submission build

## Objective

Build, test, deploy, and package a noir-themed tic-tac-toe app that satisfies the
SUpost / CapM test on a live Vercel URL, and that doubles as a portfolio piece.

## Status

Ready to submit after the owner's Vercel deploy. 40 unit, 24 e2e (green on Ubuntu CI),
axe 0, contrast 13/13. Repo is public; README and screenshots are current; audio defaults
on. Local preview on `:3210`.

## Next action

1. Owner reviews the local build and the copy.
2. `npx vercel --prod` (owner completes the login), then add the live URL to the README.
3. Make the repo public and submit the form with screenshots and the optional demo.

## Acceptance criteria

1. Live production URL: two players alternate; win and draw are shown; NEW GAME resets.
2. Scoreboard counts wins and draws and survives a reload.
3. 360 / 768 / 1440 layouts have no horizontal scroll and 44px tap targets.
4. Keyboard-only play works; axe reports zero violations; contrast is measured.
5. `typecheck`, `lint`, `test`, `build`, and Playwright e2e all pass.
6. Public GitHub repo with README, screenshots, and CI badge.
7. Submission assets: desktop/tablet/mobile screenshots, win screenshot, reviewer notes,
   optional demo script.
8. Desktop fits without page scroll at 1440×900, 1366×768, 1280×800, and 1024×768;
   New Game is always visible.
9. Capt. Hale grades each move and the note is announced; the captain animates while
   the note reveals.
10. No secret is committed or read by the session.

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
- Do not add an AI opponent in this task; it is a separate scope decision.
