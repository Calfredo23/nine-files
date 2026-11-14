"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Outcome } from "@/lib/game";
import { PLAYERS } from "@/lib/players";
import { cn } from "@/lib/cn";

export function CaseStamp({ outcome }: { outcome: Outcome }) {
  const reduced = useReducedMotion();
  const isDraw = outcome.kind === "draw";

  return (
    <motion.div
      data-testid="stamp"
      aria-hidden="true"
      className={cn(
        "case-stamp",
        isDraw ? "case-stamp-cold" : "case-stamp-closed",
      )}
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, scale: 2.6, rotate: -24 }
      }
      animate={{ opacity: 1, scale: 1, rotate: -11 }}
      transition={
        reduced
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 520, damping: 22, mass: 0.7 }
      }
    >
      <span>{isDraw ? "COLD CASE" : "CASE CLOSED"}</span>
      <small>
        {isDraw
          ? "NO ANSWER"
          : outcome.kind === "win"
            ? PLAYERS[outcome.mark].short
            : ""}
      </small>
    </motion.div>
  );
}
