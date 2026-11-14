"use client";

import { motion } from "motion/react";
import { cellLabel, type Move } from "@/lib/game";
import { PLAYERS } from "@/lib/players";
import { MarkO, MarkX } from "@/components/marks";

export function MoveLog({ moves }: { moves: readonly Move[] }) {
  const recent = moves
    .map((move, index) => ({ move, number: index + 1 }))
    .reverse();

  return (
    <section className="border border-manila/15 bg-coal/60 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-sm font-semibold tracking-[0.18em] text-paper">
          CASE NOTES
        </h2>
        <span className="font-mono text-[9px] tracking-[0.16em] text-smoke">
          NEWEST FIRST
        </span>
      </div>

      {moves.length === 0 ? (
        <p className="mt-4 font-serif text-sm italic text-smoke">
          No clues filed. The wall&apos;s empty.
        </p>
      ) : (
        <ol
          className="case-scroll mt-3 max-h-56 space-y-1.5 overflow-y-auto pr-1"
          data-testid="move-log"
        >
          {recent.map(({ move, number }) => (
            <motion.li
              key={`${number}-${move.index}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 border-b border-manila/10 pb-1.5 font-mono text-[11px] text-smoke"
            >
              <span className="w-6 text-smoke">
                {String(number).padStart(2, "0")}
              </span>
              <span className="h-3.5 w-3.5 text-paper">
                {move.mark === "X" ? <MarkX /> : <MarkO />}
              </span>
              <span className="w-20 text-paper">{PLAYERS[move.mark].short}</span>
              <span className="ml-auto text-tungsten/80">
                {cellLabel(move.index)}
              </span>
            </motion.li>
          ))}
        </ol>
      )}
    </section>
  );
}
