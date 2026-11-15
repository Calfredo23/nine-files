# Notes for the reviewer

**Concept:** a noir case wall. X and O are two detectives claiming nine clues. Three
in a row is drawn in red yarn, and a CASE CLOSED label lands on the board.

**Built with:** Next.js 16, React 19, TypeScript, and Tailwind CSS 4. CSS animations,
one canvas burst, no animation library. Everything runs in the browser; scores, match
history, and the detective name are stored in `localStorage`.

**First visit:** Capt. Hale gives a three-beat case briefing, then a short setup
recommends full screen (**F11**, or **Ctrl+Cmd+F** on Mac) and asks for your detective
name. That name becomes the X side. You can replay the briefing from **BRIEFING** and
edit the name from **EDIT NAME**.

**The coach:** Capt. Hale watches from the corner and grades every move (best, good,
inaccuracy, mistake, blunder, win, draw) with the reason. The grade comes from a full
minimax evaluation, not a random line. The subtitle reveals word by word while he
talks; after the match he speaks again, naming the winner and either complimenting the
win or asking for a rematch.

**Saved history:** every finished game is recorded in the browser. Open **MATCH
HISTORY** in the CASE CONTROL panel to see the last 25 results and move lists.

**Worth trying:** finish a game to see the yarn and the label, press **NEW GAME** in the
top-right panel, open **MATCH HISTORY**, play a few moves with the arrow keys and Enter,
and resize to desktop to confirm the whole game fits one screen.
`prefers-reduced-motion` removes the shake, flash, particles, captain motion, subtitle
reveal, and cursor.

The required behaviours are literal: cells show X and O, the button says **NEW GAME**,
and the result says **WINS** or **DRAW**.
