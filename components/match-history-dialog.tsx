"use client";

import { useState } from "react";
import { cellLabel } from "@/lib/game";
import { PLAYERS } from "@/lib/players";
import { type MatchRecord } from "@/lib/history";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/cn";
function formatDate(value: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(value);
  } catch {
    return "";
  }
}

export function MatchHistoryDialog({
  open,
  matches,
  onClose,
  onClear,
}: {
  open: boolean;
  matches: readonly MatchRecord[];
  onClose: () => void;
  onClear: () => void;
}) {
  const dialogRef = useDialog(open);
  const [confirming, setConfirming] = useState(false);

  const close = () => {
    setConfirming(false);
    onClose();
  };

  const clear = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    onClear();
  };

  return (
    <dialog
      ref={dialogRef}
      data-testid="history-dialog"
      aria-labelledby="history-title"
      className="case-dialog"
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
    >
      <div className="case-dialog-panel relative max-h-[90dvh] overflow-y-auto border border-manila/20 bg-coal p-4 text-paper shadow-[0_50px_90px_-40px_rgba(0,0,0,.95)] sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-manila/15 pb-2">
          <div>
            <p className="font-mono text-[9px] tracking-[0.24em] text-smoke">
              SAVED IN THIS BROWSER
            </p>
            <h2
              id="history-title"
              className="mt-0.5 font-display text-lg font-semibold tracking-[0.14em] text-paper sm:text-xl"
            >
              MATCH HISTORY
            </h2>
          </div>
          <p className="font-mono text-[9px] tracking-[0.2em] text-smoke">
            {String(matches.length).padStart(2, "0")} SAVED
          </p>
        </div>

        {matches.length === 0 ? (
          <p className="mt-5 font-serif text-sm italic text-smoke">
            No finished cases yet. Finish one and it will be recorded here.
          </p>
        ) : (
          <ol className="case-scroll mt-3 max-h-[55dvh] space-y-1 overflow-y-auto pr-1">
            {matches.map((match) => (
              <li
                key={match.id}
                data-testid="history-row"
                className="border-b border-manila/10 py-2"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className={cn(
                      "font-display text-sm font-semibold tracking-[0.1em]",
                      match.winner === "draw" ? "text-smoke" : "text-paper",
                    )}
                  >
                    {match.winner === "draw"
                      ? "DRAW — COLD CASE"
                      : `${match.winnerName ?? PLAYERS[match.winner].short} WINS`}
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.12em] text-smoke">
                    {formatDate(match.finishedAt)}
                  </p>
                </div>
                <p className="mt-0.5 font-mono text-[9px] tracking-[0.1em] text-smoke">
                  {match.moves.length} moves ·{" "}
                  {match.moves.map((move) => cellLabel(move.index)).join(" · ")}
                </p>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-manila/15 pt-3">
          <button
            type="button"
            data-testid="history-clear"
            onClick={clear}
            aria-label={
              confirming ? "Confirm clear match history" : "Clear match history"
            }
            className="min-h-11 font-mono text-[10px] tracking-[0.16em] text-smoke underline-offset-4 transition hover:text-paper hover:underline"
          >
            {confirming ? "CONFIRM CLEAR" : "CLEAR HISTORY"}
          </button>
          <button
            type="button"
            data-testid="history-close"
            onClick={close}
            className="min-h-11 border border-manila/25 px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-paper transition hover:border-manila/50"
          >
            CLOSE
          </button>
        </div>
      </div>
    </dialog>
  );
}
