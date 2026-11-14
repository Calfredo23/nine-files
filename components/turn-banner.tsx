"use client";

import type { RefObject } from "react";
import type { GameState } from "@/lib/game";
import { PLAYERS } from "@/lib/players";
import { cn } from "@/lib/cn";

export function TurnBanner({
  state,
  resultRef,
}: {
  state: GameState;
  resultRef: RefObject<HTMLHeadingElement | null>;
}) {
  const done = state.outcome !== null;
  const win = state.outcome?.kind === "win" ? state.outcome : null;
  const player = PLAYERS[state.turn];

  const resultText = win
    ? `${PLAYERS[win.mark].short} WINS — CASE CLOSED`
    : "DRAW — COLD CASE";

  const resultSub = win
    ? win.mark === "X"
      ? "Three in a row. Cross takes the case."
      : "Three in a row. O'Rourke takes the case."
    : "Nine moves, no line. The case goes cold.";

  const announcement = win
    ? `${PLAYERS[win.mark].short} wins.`
    : done
      ? "It's a draw."
      : `${player.name}'s turn.`;

  return (
    <div className="flex min-h-[78px] flex-col gap-1 border-b border-manila/15 pb-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[9px] tracking-[0.24em] text-smoke">
          {done ? "RESULT" : "TURN"}
        </p>
        <p className="font-mono text-[9px] tracking-[0.18em] text-smoke">
          MOVE {String(state.moves.length).padStart(2, "0")} / 09
        </p>
      </div>

      {done ? (
        <>
          <h2
            ref={resultRef}
            tabIndex={-1}
            data-testid="result"
            className={cn(
              "font-display text-xl font-semibold tracking-[0.04em] outline-none focus:outline-none sm:text-2xl",
              win ? "text-paper" : "text-smoke",
            )}
          >
            {resultText}
          </h2>
          <p className="font-serif text-xs italic text-smoke">{resultSub}</p>
        </>
      ) : (
        <>
          <p
            data-testid="turn-label"
            className="font-display text-xl font-semibold tracking-[0.08em] text-paper sm:text-2xl"
          >
            {player.short}&apos;S TURN
          </p>
          <p className="font-serif text-xs italic text-smoke">
            Three in a row wins. X goes first.
          </p>
        </>
      )}

      <div className="mt-auto h-px w-full bg-manila/10">
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
