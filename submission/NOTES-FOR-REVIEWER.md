# Notes for the reviewer

**Concept:** a noir case wall. X and O are two detectives claiming nine clues; the
winning line is literal red yarn, and a taped CASE CLOSED label lands on the board.

**Built with:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4,
and Motion. No backend, no accounts, no analytics. The scoreboard uses `localStorage`.

**Worth trying:** play a full game to see the yarn and the stamp, press New Game to
confirm the ledger survives, and use the arrow keys + Enter to play without a mouse.
`prefers-reduced-motion` removes the shake, flash, and particles.

The required behaviours are literal: cells show X and O, the button says **NEW GAME**,
and the result says **WINS** or **DRAW**.
