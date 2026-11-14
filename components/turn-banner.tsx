"use client";

import type { GameState } from "@/lib/game";
import { PLAYERS } from "@/lib/players";
import { commentaryFor } from "@/lib/commentary";
import { Typewriter } from "@/components/typewriter";
import { cn } from "@/lib/cn";

export function TurnBanner({ state }: { state: GameState }) {
  const player = PLAYERS[state.turn];
  const done = state.outcome !== null;
  const label = done
    ? state.outcome?.kind === "win"
      ? `${PLAYERS[state.outcome.mark].short} WINS`
      : "DRAW"
    : `${player.short}'S TURN`;

  const announcement = done
    ? state.outcome?.kind === "win"
      ? `${PLAYERS[state.outcome.mark].short} wins.`
      : "It's a draw."
    : `${player.name}'s turn.`;

  return (
    <div className="flex flex-col gap-1.5 border-b border-manila/15 pb-2.5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] tracking-[0.24em] text-smoke">
          {done ? "RESULT" : "TURN"}
        </p>
        <p className="font-mono text-[10px] tracking-[0.18em] text-smoke">
          MOVE {String(state.moves.length).padStart(2, "0")} / 09
        </p>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <p
          data-testid="turn-label"
          className={cn(
            "font-display text-2xl font-semibold tracking-[0.08em] transition-colors sm:text-3xl",
            done ? "text-ember" : "text-paper",
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            done ? "bg-oxblood" : "bg-tungsten",
          )}
          aria-hidden="true"
        />
      </div>

      <p className="min-h-[2.2em] font-serif text-sm italic leading-snug text-smoke">
        <Typewriter text={commentaryFor(state)} />
      </p>

      <div className="h-px w-full bg-manila/10">
        <div
          className="h-px bg-tungsten/60 transition-[width] duration-500"
          style={{ width: `${(state.moves.length / 9) * 100}%` }}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
