# PROJECT MEMORY — The Nine Files

Framework Version: 1.22.1
Current Execution Mode: QUALITY
Project Status: NEW_PROJECT
Lifecycle Stage: 6 — IMPLEMENTATION (design contract at 4)
Owner: Cedrick Alfredo Catimbang (Calfredo)

## What this is

A tic-tac-toe application built for the SUpost / CapM junior React + Next.js
application test. The test asks for three working behaviours on a live Vercel URL:
two players alternate, the result is shown, and New Game resets. Style and personality
are explicitly rewarded.

Concept: **THE NINE FILES** — a noir case wall. Two detectives (Cross and O'Rourke)
claim nine clues. The winning line is drawn in red yarn and a CASE CLOSED stamp lands.
The required behaviours are literal: the cells carry X and O, the buttons say NEW GAME,
and the result text says WINS or DRAW.

## Location and deploy

- Local: `EPIC PORTFOLIO INCOMING/tic-tac-toe/` — own git repo; the hub `.gitignore`
  ignores everything outside `docs/`, so this folder is not tracked by the hub.
- Public repo: `github.com/Calfredo23/nine-files`
- Live: pending the Vercel deploy; intended `nine-files.vercel.app` (fallback
  `tic-tac-toe-calfredo.vercel.app`)

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

TASK-0031 built and tested: 36 unit, 18 e2e, axe 0, single-screen desktop, Capt. Hale
briefing and move coach, right-side CASE CONTROL, and a persisted 25-match history.
Deploy pending owner review. See `NEXT-TASK.md` and `TASKS.md`.
