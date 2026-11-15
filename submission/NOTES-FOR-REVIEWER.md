# Notes for the reviewer

**Concept:** a noir case wall. X and O are two detectives claiming nine clues, or you can
take the case solo against the House. Three in a row is drawn in red yarn, and a CASE
CLOSED label lands on the board.

**Built with:** Next.js 16, React 19, TypeScript, and Tailwind CSS 4. CSS animations, one
canvas burst, no animation library. Everything runs in the browser; scores, match
history, the detective name, and mode/side live in `localStorage`.

**First visit:** Capt. Hale gives a three-beat case briefing, then a short setup
recommends full screen (**F11**, or **Ctrl+Cmd+F** on Mac), asks for your detective name,
and offers **TWO PLAYERS** or **SINGLE PLAYER**. In solo, pick **X**, pick **O**, or toss
the coin. The name and side follow you into the cards, banner, result, stamp, scoreboard,
and coach. You can replay the briefing from **BRIEFING** and edit the name from **EDIT
NAME**.

**The House:** the solo opponent is local. It uses the same minimax values as the coach,
waits about 700 ms, shows **THINKING**, and locks the board while it moves. It plays the
best move most of the time with a deliberate 15% chance to slip, so a careful player can
create a fork and win.

**The coach:** Capt. Hale watches from the corner and grades every move (best, good,
inaccuracy, mistake, blunder, win, draw) with the reason. The grade comes from a full
minimax evaluation, not a random line. The subtitle reveals word by word while he talks.

**The verdict:** 1.6 s after a match, the captain takes over the screen. He names the
winner and offers **CONTINUE** after your win, **TRY AGAIN** after a loss, or **ONE MORE**
after a draw. That primary button starts a quick rematch with the same mode and side.
**STAY ON THE BOARD** closes it; **RESET SCORES** clears the scoreboard and match log from
there (the scoreboard has its own visible reset too).

**NEW GAME:** the top-right button restarts the full experience: briefing, full-screen
prompt, name, mode, side. Scores and history stay unless you use **RESET SCORES**.

**Sound:** a procedural noir loop (no audio files) and a soft per-word voice under the
captain's subtitles, plus pin, paper, stamp, win, draw, and coin cues. **MUSIC** and
**SFX** are separate toggles in the header and both persist. Browsers require a gesture,
so audio starts on the first click or key press.

**Saved history:** every finished game is recorded in the browser. Open **MATCH HISTORY**
in the CASE CONTROL panel to see the last 25 results with the winner's name and move list.

**Worth trying:** finish a game to see the yarn and the label, start a solo case and toss
the coin, press **NEW GAME** in the top-right panel to see the full restart, open **MATCH
HISTORY**, play a few moves with the arrow keys and Enter, and resize to desktop to confirm
the whole game fits one screen. `prefers-reduced-motion` removes the shake, flash,
particles, captain motion, subtitle reveal, coin flip, and cursor.

The required behaviours are literal: cells show X and O, the button says **NEW GAME**, and
the result says **WINS** or **DRAW**.
