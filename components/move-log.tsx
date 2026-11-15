"use client";

import { cellLabel, type Move } from "@/lib/game";
import { playerFor } from "@/lib/players";
import { useDetectiveName } from "@/hooks/use-detective-name";
import { useGameSettings } from "@/hooks/use-game-settings";
import { MarkO, MarkX } from "@/components/marks";

export function MoveLog({ moves }: { moves: readonly Move[] }) {
  const detectiveName = useDetectiveName();
  const settings = useGameSettings();
  const recent = moves
    .map((move, index) => ({ move, number: index + 1 }))
    .reverse();

  return (
    <section className="border border-manila/15 bg-coal/60 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-sm font-semibold tracking-[0.18em] text-paper">
          MOVE HISTORY
        </h2>
        <span className="font-mono text-[9px] tracking-[0.16em] text-smoke">
          NEWEST FIRST
        </span>
      </div>

      {moves.length === 0 ? (
        <p className="mt-4 font-serif text-sm italic text-smoke">
          No moves yet.
        </p>
      ) : (
        <ol
          className="case-scroll mt-3 max-h-[232px] space-y-1.5 overflow-y-auto pr-1"
          data-testid="move-log"
        >
          {recent.map(({ move, number }) => (
            <li
              key={`${number}-${move.index}`}
              className="move-in flex items-center gap-2 border-b border-manila/10 pb-1.5 font-mono text-[11px] text-smoke"
            >
              <span className="w-6 text-smoke">
                {String(number).padStart(2, "0")}
              </span>
              <span className="h-3.5 w-3.5 text-paper">
                {move.mark === "X" ? <MarkX /> : <MarkO />}
              </span>
              <span className="w-20 truncate text-paper">
                {playerFor(move.mark, settings, detectiveName).short}
              </span>
              <span className="ml-auto text-tungsten/80">
                {cellLabel(move.index)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
