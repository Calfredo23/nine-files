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
          Two players enter their names and toss to decide who gets X and opens,
          or one detective can face the House. Three in a row wins.
        </p>
        <p>
          <strong className="text-paper">NEW GAME</strong> restarts the case from
          the briefing and setup and resets the scoreboard.{" "}
          <strong className="text-paper">RESET SCORES</strong> also keeps the match
          history; clear it from the history dialog.
        </p>
        <p className="font-mono text-[10px] leading-relaxed tracking-[0.12em]">
          KEYBOARD: ARROWS MOVE · ENTER PLAYS · HOME / END JUMP
        </p>
      </div>
    </details>
  );
}

