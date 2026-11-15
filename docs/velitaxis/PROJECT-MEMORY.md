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

Concept: **THE NINE FILES** — a noir case wall. Two named detectives claim nine clues,
or a solo player takes on the House. The winning line is drawn in red yarn and a CASE
CLOSED stamp lands. The required behaviours are literal: the cells carry X and O, the
buttons say NEW GAME, and the result text says WINS or DRAW. In two-player mode both names
are collected and a coin toss assigns X and the opening move; blank names become Secret
Detective 1 and 2. A solo mode adds THE HOUSE, a deliberately imperfect minimax opponent,
with an X/O side choice and a coin toss.

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
- No game backend, accounts, or custom PII collection. Vercel Web Analytics is integrated
  for aggregate traffic metrics; vendor docs state no cookies and no personal identifiers.
- No copyrighted assets; all art is inline SVG/CSS; fonts are Google Fonts (OFL).
- Accessibility is non-negotiable: keyboard play, focus states, reduced motion,
  announced results, AA contrast.

## Current state

Solo mode, coin toss, full-restart NEW GAME, the Case Control icon rail, production
analytics, and the CALFREDO footer are live. Commit `60c9ded` is pushed to `main`.
Two-player setup now collects both names and tosses to assign X and the first move;
blank names become Secret Detective 1/2. Local verification: 61 unit and 31 e2e pass;
this feature is unpushed. Vercel Analytics is production-only and was verified by a live
`POST /view` returning HTTP 200. Remaining: push the two-player update, then submit.
