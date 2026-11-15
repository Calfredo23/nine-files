"use client";

import { useState } from "react";
import { Captain } from "@/components/captain";
import { CoachBubble } from "@/components/coach-bubble";
import { useDialog } from "@/hooks/use-dialog";
import { useDetectiveName } from "@/hooks/use-detective-name";
import { useGameSettings } from "@/hooks/use-game-settings";
import { postMatchLine } from "@/lib/coach";
import { playerFor } from "@/lib/players";
import type { Outcome } from "@/lib/game";
import { cn } from "@/lib/cn";

export function PostMatchDialog({
  outcome,
  onContinue,
  onStay,
  onReset,
}: {
  outcome: Outcome;
  onContinue: () => void;
  onStay: () => void;
  onReset: () => void;
}) {
  const dialogRef = useDialog(true);
  const detectiveName = useDetectiveName();
  const settings = useGameSettings();
  const [confirming, setConfirming] = useState(false);

  const winner =
    outcome.kind === "win"
      ? playerFor(outcome.mark, settings, detectiveName)
      : null;
  const userMark = settings.userMark;
  const userWon = outcome.kind === "win" && outcome.mark === userMark;
  const resultText = winner
    ? `${winner.short} WINS — CASE CLOSED`
    : "DRAW — COLD CASE";
  const note = postMatchLine(outcome, settings, detectiveName);
  const primary = userWon
    ? "CONTINUE"
    : outcome.kind === "draw"
      ? "ONE MORE"
      : "TRY AGAIN";
  const standing =
    outcome.kind === "draw"
      ? "DRAW"
      : userWon
        ? "YOUR WIN"
        : settings.mode === "single"
          ? "THE HOUSE"
          : winner?.short ?? "WINNER";

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    onReset();
  };

  return (
    <dialog
      ref={dialogRef}
      data-testid="post-match-dialog"
      aria-labelledby="post-match-title"
      className="case-dialog"
      onClose={onStay}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onStay();
        }
      }}
    >
      <div className="case-dialog-panel relative max-h-[90dvh] overflow-y-auto border border-manila/20 bg-coal p-4 text-paper shadow-[0_50px_90px_-40px_rgba(0,0,0,.95)] sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-manila/15 pb-2">
          <div>
            <p className="font-mono text-[9px] tracking-[0.24em] text-smoke">
              THE VERDICT
            </p>
            <h2
              id="post-match-title"
              className={cn(
                "mt-0.5 font-display text-lg font-semibold tracking-[0.14em] sm:text-xl",
                userWon ? "text-paper" : "text-smoke",
              )}
            >
              {outcome.kind === "draw" ? "COLD CASE" : "CASE CLOSED"}
            </h2>
          </div>
          <p className="font-mono text-[9px] tracking-[0.2em] text-smoke">
            {standing}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-3">
          <div className="w-[76px] shrink-0 overflow-hidden rounded-sm border border-manila/25 bg-ink/70 sm:w-[112px]">
            <Captain speaking />
            <div className="border-t border-manila/15 px-1 py-1 text-center">
              <p className="font-display text-[8px] font-semibold tracking-[0.1em] text-paper sm:text-[10px]">
                CAPT. HALE
              </p>
              <p className="font-mono text-[6px] tracking-[0.12em] text-smoke sm:text-[7px]">
                SUPERVISOR
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold tracking-[0.04em] text-paper sm:text-lg">
              {resultText}
            </p>
            <div data-testid="post-match-note" className="mt-2">
              <CoachBubble
                message={{ text: note.text, grade: note.grade, id: 1 }}
                speaking
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-manila/15 pt-3">
          <button
            type="button"
            data-testid="post-match-reset"
            onClick={handleReset}
            aria-label={
              confirming ? "Confirm reset scores" : "Reset scores and history"
            }
            className="min-h-11 border border-manila/20 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-smoke transition hover:border-manila/50 hover:text-paper"
          >
            {confirming ? "CONFIRM RESET" : "RESET SCORES"}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="post-match-stay"
              onClick={onStay}
              className="min-h-11 border border-manila/25 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-smoke transition hover:border-manila/50 hover:text-paper"
            >
              STAY ON THE BOARD
            </button>
            <button
              type="button"
              data-testid="post-match-primary"
              onClick={onContinue}
              autoFocus
              className="min-h-11 border border-oxblood/70 bg-oxblood px-4 py-2 font-display text-xs font-semibold tracking-[0.16em] text-paper transition hover:bg-[#a13540] active:translate-y-px"
            >
              {primary}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
