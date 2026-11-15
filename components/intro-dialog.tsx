"use client";

import { useState } from "react";
import { Captain } from "@/components/captain";
import { Typewriter } from "@/components/typewriter";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/cn";

const BEATS = [
  "Evening. Captain Hale, ninth floor. You're the new lead on the Halver case, and the whole board is watching.",
  "Nine cards came in tonight. Cross and O'Rourke are working the same wall, and neither one trusts the other.",
  "Pin three in a row and the file closes. Let it slip and it goes cold. New Game opens a fresh board; the record stays.",
] as const;

export function IntroDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useDialog(open);
  const [beat, setBeat] = useState(0);
  const last = beat === BEATS.length - 1;

  const finish = () => {
    setBeat(0);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      data-testid="intro-dialog"
      aria-labelledby="intro-title"
      className="case-dialog"
      onClose={finish}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          finish();
        }
      }}
    >
      <div className="case-dialog-panel relative max-h-[90dvh] overflow-y-auto border border-manila/20 bg-coal p-4 text-paper shadow-[0_50px_90px_-40px_rgba(0,0,0,.95)] sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-manila/15 pb-2">
          <div>
            <p className="font-mono text-[9px] tracking-[0.24em] text-smoke">
              NINTH FLOOR · HALVER CASE
            </p>
            <h2
              id="intro-title"
              className="mt-0.5 font-display text-lg font-semibold tracking-[0.14em] text-paper sm:text-xl"
            >
              CASE BRIEFING
            </h2>
          </div>
          <p className="font-mono text-[9px] tracking-[0.2em] text-smoke">
            {String(beat + 1).padStart(2, "0")} / 03
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

          <div className="min-w-0 flex-1 bg-manila p-4 text-ink">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[8px] tracking-[0.18em] text-ink/60">
                CAPT. HALE
              </p>
              <span className="font-mono text-[7px] tracking-[0.12em] text-ink/60">
                CASE NOTE
              </span>
            </div>
            <p
              className="mt-2 font-serif text-[15px] leading-relaxed sm:text-base"
              aria-live="polite"
            >
              <Typewriter key={beat} text={BEATS[beat]} speaking />
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-manila/15 pt-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-testid="intro-skip"
              onClick={finish}
              className="min-h-11 border border-manila/25 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-smoke transition hover:border-manila/50 hover:text-paper"
            >
              SKIP
            </button>
            <div className="flex gap-1.5" aria-hidden="true">
              {BEATS.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    index === beat ? "bg-tungsten" : "bg-manila/25",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {beat > 0 ? (
              <button
                type="button"
                data-testid="intro-back"
                onClick={() => setBeat((current) => Math.max(0, current - 1))}
                className="min-h-11 border border-manila/25 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-smoke transition hover:border-manila/50 hover:text-paper"
              >
                BACK
              </button>
            ) : null}
            <button
              type="button"
              data-testid={last ? "intro-begin" : "intro-next"}
              onClick={() => {
                if (last) {
                  finish();
                } else {
                  setBeat((current) => current + 1);
                }
              }}
              className="min-h-11 border border-oxblood/70 bg-oxblood px-4 py-2 font-display text-xs font-semibold tracking-[0.16em] text-paper transition hover:bg-[#a13540] active:translate-y-px"
            >
              {last ? "CONTINUE" : "NEXT"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
