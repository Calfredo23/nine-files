import type { Outcome } from "@/lib/game";
import { PLAYERS } from "@/lib/players";
import { cn } from "@/lib/cn";

export function CaseStamp({ outcome }: { outcome: Outcome }) {
  const isDraw = outcome.kind === "draw";

  return (
    <div
      data-testid="stamp"
      aria-hidden="true"
      className={cn("case-stamp", isDraw ? "case-stamp-cold" : "case-stamp-closed")}
    >
      <span>{isDraw ? "COLD CASE" : "CASE CLOSED"}</span>
      <small>
        {isDraw
          ? "NO ANSWER"
          : outcome.kind === "win"
            ? PLAYERS[outcome.mark].short
            : ""}
      </small>
    </div>
  );
}
