"use client";

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

  return (
    <article
      data-testid={`detective-${mark}`}
      data-active={active}
      className={cn(
        "relative flex items-center gap-3 border bg-coal/70 p-2.5 transition-transform duration-300 ease-out motion-reduce:transition-none",
        active
          ? "-translate-y-1 border-tungsten/50 shadow-[0_0_32px_-10px_rgba(227,164,75,.45)]"
          : "border-manila/15",
      )}
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center border",
          active ? "border-tungsten/40 bg-ink/60" : "border-manila/20 bg-ink/40",
        )}
        aria-hidden="true"
      >
        <span className="h-6 w-6 text-paper">
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
    </article>
  );
}
