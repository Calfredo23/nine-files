"use client";

import { useEffect, useRef, useState } from "react";
import type { Ledger } from "@/lib/storage";
import { cn } from "@/lib/cn";

const ROWS = [
  { key: "cross", label: "CROSS", tone: "text-paper" },
  { key: "orourke", label: "O'ROURKE", tone: "text-paper" },
  { key: "cold", label: "DRAWS", tone: "text-smoke" },
] as const;

export function CaseLedger({
  ledger,
  onReset,
}: {
  ledger: Ledger;
  onReset: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true);
      timer.current = window.setTimeout(() => setConfirming(false), 3000);
      return;
    }
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    setConfirming(false);
    onReset();
  };

  return (
    <section className="border border-manila/15 bg-coal/60 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-sm font-semibold tracking-[0.18em] text-paper">
          SCOREBOARD
        </h2>
        <button
          type="button"
          data-testid="reset-ledger"
          onClick={handleReset}
          aria-label={
            confirming
              ? "Confirm reset scores and match history"
              : "Reset scores and match history"
          }
          className="font-mono text-[9px] tracking-[0.16em] text-smoke underline-offset-4 hover:text-paper hover:underline"
        >
          {confirming ? "CONFIRM RESET" : "RESET SCORES"}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {ROWS.map((row) => {
          const value = ledger[row.key];
          return (
            <div key={row.key} className="border-t border-manila/15 pt-2">
              <p className="font-mono text-[9px] tracking-[0.18em] text-smoke">
                {row.label}
              </p>
              <p
                key={`${row.key}-${value}`}
                data-testid={`ledger-${row.key}`}
                className={cn(
                  "tally font-display text-2xl font-semibold tracking-[0.04em]",
                  row.tone,
                )}
              >
                {String(value).padStart(2, "0")}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-2 font-mono text-[9px] tracking-[0.14em] text-smoke">
        SAVED IN THIS BROWSER
      </p>
    </section>
  );
}
