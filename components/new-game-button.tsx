"use client";

export function NewGameButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <button
        type="button"
        data-testid="new-game"
        onClick={onClick}
        className="group inline-flex min-h-12 items-center gap-3 border border-oxblood/70 bg-oxblood px-5 py-3 font-display text-sm font-semibold tracking-[0.18em] text-paper transition hover:bg-[#a13540] active:translate-y-px"
      >
        NEW GAME
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </button>
      <p className="font-mono text-[10px] tracking-[0.16em] text-smoke">
        FRESH CASE · LEDGER KEPT
      </p>
    </div>
  );
}
