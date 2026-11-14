# Notes for the reviewer

**Concept:** a noir case wall. X and O are two detectives claiming nine clues. Three
in a row is drawn in red yarn, and a CASE CLOSED label lands on the board.

**Built with:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Motion.
Everything runs in the browser; scores are stored in `localStorage`.

**Worth trying:** finish a game to see the yarn and the label, press New Game to
confirm the scores stay, and play a few moves with the arrow keys and Enter.
`prefers-reduced-motion` removes the shake, flash, and particles.

The required behaviours are literal: cells show X and O, the button says **NEW GAME**,
and the result says **WINS** or **DRAW**.
