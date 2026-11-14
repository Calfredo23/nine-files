"use client";

import { motion } from "motion/react";
import type { RefObject } from "react";
import type { Outcome } from "@/lib/game";
import { PLAYERS } from "@/lib/players";
import { cn } from "@/lib/cn";

export function ResultBar({
  outcome,
  resultRef,
}: {
  outcome: Outcome;
  resultRef: RefObject<HTMLHeadingElement | null>;
}) {
  const isWin = outcome.kind === "win";
  const text = isWin
    ? `${PLAYERS[outcome.mark].short} WINS — CASE CLOSED`
    : "DRAW — COLD CASE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mt-4 border border-manila/20 bg-coal/80 p-4"
    >
      <p className="font-mono text-[10px] tracking-[0.24em] text-smoke">
        {isWin ? "VERDICT" : "DEAD END"}
      </p>
      <h2
        ref={resultRef}
        tabIndex={-1}
        data-testid="result"
        className={cn(
          "mt-1 font-display text-2xl font-semibold tracking-[0.06em] outline-none focus:outline-none sm:text-3xl",
          isWin ? "text-paper" : "text-smoke",
        )}
      >
        {text}
      </h2>
      <p className="mt-1 font-serif text-sm italic text-smoke">
        {isWin
          ? outcome.mark === "X"
            ? "The yarn doesn't lie. Cross gets the collar."
            : "O'Rourke saw it first. The wall agrees."
          : "Nine clues, no answers. File it under tomorrow."}
      </p>
    </motion.div>
  );
}
