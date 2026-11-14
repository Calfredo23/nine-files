export function HowToPlay() {
  return (
    <details className="group border border-manila/15 bg-coal/40 p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-sm font-semibold tracking-[0.18em] text-paper [&::-webkit-details-marker]:hidden">
        HOW TO PLAY
        <span
          aria-hidden="true"
          className="text-smoke transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-3 space-y-2 font-serif text-sm leading-relaxed text-smoke">
        <p>
          Two detectives. Nine clues. Take turns; three in a row cracks the
          case.
        </p>
        <p>
          <strong className="text-paper">NEW GAME</strong> opens a fresh board
          and keeps the ledger.{" "}
          <strong className="text-paper">SHRED LEDGER</strong> wipes the scores,
          not the board.
        </p>
        <p className="font-mono text-[10px] leading-relaxed tracking-[0.12em]">
          KEYBOARD: ARROWS MOVE · ENTER FILES · HOME / END JUMP
        </p>
      </div>
    </details>
  );
}
