export function HowToPlay() {
  return (
    <details className="group border border-manila/15 bg-coal/40 p-3">
      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-sm font-semibold tracking-[0.18em] text-paper [&::-webkit-details-marker]:hidden">
        HOW TO PLAY
        <span
          aria-hidden="true"
          className="text-smoke transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-2 space-y-1.5 font-serif text-xs leading-relaxed text-smoke">
        <p>
          Two players. Nine squares. Take turns; three in a row wins. X goes
          first.
        </p>
        <p>
          <strong className="text-paper">NEW GAME</strong> clears the board and
          keeps the scores.{" "}
          <strong className="text-paper">RESET SCORES</strong> clears the scores,
          not the board.
        </p>
        <p className="font-mono text-[10px] leading-relaxed tracking-[0.12em]">
          KEYBOARD: ARROWS MOVE · ENTER PLAYS · HOME / END JUMP
        </p>
      </div>
    </details>
  );
}

