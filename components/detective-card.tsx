"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Mark } from "@/lib/game";
import { PLAYERS } from "@/lib/players";
import { MarkO, MarkX } from "@/components/marks";
import { cn } from "@/lib/cn";

export type DetectiveStatus = "TURN" | "WAITING" | "WINNER" | "DRAW" | "OUT";

export function DetectiveCard({
  mark,
  active,
  status,
}: {
  mark: Mark;
  active: boolean;
  status: DetectiveStatus;
}) {
  const player = PLAYERS[mark];
  const reduced = useReducedMotion();

  return (
    <motion.article
      data-testid={`detective-${mark}`}
      data-active={active}
      animate={reduced ? undefined : { y: active ? -4 : 0 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={cn(
        "relative flex items-center gap-3 border bg-coal/70 p-3",
        active
          ? "border-tungsten/50 shadow-[0_0_32px_-10px_rgba(227,164,75,.45)]"
          : "border-manila/15",
      )}
    >
      <span
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center border",
          active
            ? "border-tungsten/40 bg-ink/60"
            : "border-manila/20 bg-ink/40",
        )}
        aria-hidden="true"
      >
        <span className="h-7 w-7 text-paper">
          {mark === "X" ? <MarkX /> : <MarkO />}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold tracking-[0.14em] text-paper">
          {player.name}
        </p>
        <p className="font-mono text-[10px] tracking-[0.16em] text-smoke">
          BADGE {player.badge} · {player.division}
        </p>
      </div>

      <span
        className={cn(
          "flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em]",
          active ? "text-tungsten" : "text-smoke",
        )}
      >
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            active ? "bg-tungsten" : "bg-smoke/40",
          )}
          aria-hidden="true"
        />
        {status}
      </span>
    </motion.article>
  );
}
