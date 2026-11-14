# NEXT TASK

## Task ID

TASK-0031

## Title

THE NINE FILES — tic-tac-toe submission build

## Objective

Build, test, deploy, and package a noir-themed tic-tac-toe app that satisfies the
SUpost / CapM test on a live Vercel URL, and that doubles as a portfolio piece.

## Status

Built and tested. 22 unit, 13 e2e, axe 0, contrast 13/13, Lighthouse desktop
100/100/100/100 and mobile 94/100/100/100. Repo private at
`github.com/Calfredo23/nine-files`. Local preview on `:3210`.

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
8. No secret is committed or read by the session.

## Build order

1. Scaffold, VELLITAXIS state, design contract (`SPECS/DESIGN_PLAN.TIC-TAC-TOE.md`).
2. Pure game logic + unit tests.
3. Board, marks, responsive shell — playable at all widths.
4. Motion pass: pin, monocle, yarn, stamp, flash, sound.
5. Accessibility, reduced motion, keyboard.
6. E2E, axe, screenshots, Lighthouse.
7. Metadata, OG image, 404, README, review pass.
8. Deploy, verify live, submission pack, close-out.

## Do not

- Do not replace X/O with abstract symbols; the reviewer must read the game instantly.
- Do not make the reviewer hunt for New Game.
- Do not let the theme break contrast, focus, or reduced-motion behaviour.
- Do not add an AI opponent in this task; it is a separate scope decision.
