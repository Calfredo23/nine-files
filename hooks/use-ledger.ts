"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Outcome } from "@/lib/game";
import {
  getLedgerSnapshot,
  getServerLedgerSnapshot,
  subscribeLedger,
  writeLedger,
} from "@/lib/client-store";
import { EMPTY_LEDGER, type Ledger } from "@/lib/storage";

export function useLedger() {
  const ledger = useSyncExternalStore(
    subscribeLedger,
    getLedgerSnapshot,
    getServerLedgerSnapshot,
  );

  const record = useCallback((outcome: Outcome) => {
    const current = getLedgerSnapshot();
    const next: Ledger =
      outcome.kind === "draw"
        ? { ...current, cold: current.cold + 1 }
        : outcome.mark === "X"
          ? { ...current, cross: current.cross + 1 }
          : { ...current, orourke: current.orourke + 1 };
    writeLedger(next);
  }, []);

  const reset = useCallback(() => {
    writeLedger(EMPTY_LEDGER);
  }, []);

  return { ledger, record, reset };
}
