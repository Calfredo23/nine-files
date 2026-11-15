import type { Outcome } from "@/lib/game";
import { playerFor } from "@/lib/players";
import { useDetectiveName } from "@/hooks/use-detective-name";
import { useGameSettings } from "@/hooks/use-game-settings";
import { cn } from "@/lib/cn";

export function CaseStamp({ outcome }: { outcome: Outcome }) {
  const detectiveName = useDetectiveName();
  const settings = useGameSettings();
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
            ? playerFor(outcome.mark, settings, detectiveName).short
            : ""}
      </small>
    </div>
  );
}
