# PROJECT MEMORY — The Nine Files

Framework Version: 1.22.1
Current Execution Mode: QUALITY
Project Status: FEATURE_DEVELOPMENT
Lifecycle Stage: 8 — QA, SECURITY, ACCESSIBILITY, AND PERFORMANCE
Owner: Cedrick Alfredo Catimbang (Calfredo)

## What this is

A tic-tac-toe application built for the SUpost / CapM junior React + Next.js
application test. The test asks for three working behaviours on a live Vercel URL:
two players alternate, the result is shown, and New Game resets. Style and personality
are explicitly rewarded.

Concept: **THE NINE FILES** — a noir case wall. Two detectives (Cross and O'Rourke)
claim nine clues. The winning line is drawn in red yarn and a CASE CLOSED stamp lands.
The required behaviours are literal: the cells carry X and O, the buttons say NEW GAME,
and the result text says WINS or DRAW. A solo mode adds THE HOUSE, a deliberately
imperfect minimax opponent, with an X/O side choice and a coin toss.

## Location and deploy

- Local: `EPIC PORTFOLIO INCOMING/tic-tac-toe/` — own git repo; the hub `.gitignore`
  ignores everything outside `docs/`, so this folder is not tracked by the hub.
- Public repo: `github.com/Calfredo23/the-nine-files`
- Live: `https://the-nine-files.vercel.app`

## Constraints

- Stack required by the challenge: React + Next.js. Chosen: Next 16.4.6, React 19.3,
  TypeScript strict, Tailwind v4. Animations are CSS keyframes/transitions plus one
  canvas burst; no animation library.
- Public repo and a public production URL are required for submission.
- No backend, no accounts, no PII, no analytics.
- No copyrighted assets; all art is inline SVG/CSS; fonts are Google Fonts (OFL).
- Accessibility is non-negotiable: keyboard play, focus states, reduced motion,
  announced results, AA contrast.

## Current state

Solo mode, coin toss, and full-restart NEW GAME are implemented. Re-verification passed:
58 unit, 30 e2e, axe 0, typecheck/lint/build clean. Local production server returns 200
with no console errors. Production smoke also returns 200 with no console errors, but
confirms the old two-step setup is still deployed. The feature set is staged, and the
owner authorized the push. Remaining: push, confirm CI/Vercel, then submit.
