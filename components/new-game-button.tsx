"use client";

import { cn } from "@/lib/cn";

export function NewGameButton({
  onClick,
  block = false,
  testId = "new-game",
}: {
  onClick: () => void;
  block?: boolean;
  testId?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        block && "flex-col items-stretch",
      )}
    >
      <button
        type="button"
        data-testid={testId}
        onClick={onClick}
        className={cn(
          "group inline-flex min-h-12 items-center gap-3 border border-oxblood/70 bg-oxblood px-5 py-3 font-display text-sm font-semibold tracking-[0.18em] text-paper transition hover:bg-[#a13540] active:translate-y-px",
          block && "w-full justify-between",
        )}
      >
        NEW GAME
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </button>
      <p
        className={cn(
          "font-mono text-[10px] tracking-[0.16em] text-smoke",
          block && "text-center",
        )}
      >
        NEW BOARD · SCORES KEPT
      </p>
    </div>
  );
}
