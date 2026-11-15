"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getMatchesSnapshot,
  getServerMatchesSnapshot,
  subscribeMatches,
  writeMatches,
} from "@/lib/client-store";
import { MATCH_LIMIT, type MatchRecord } from "@/lib/history";

export function useHistory() {
  const matches = useSyncExternalStore(
    subscribeMatches,
    getMatchesSnapshot,
    getServerMatchesSnapshot,
  );

  const add = useCallback((match: MatchRecord) => {
    const next = [match, ...getMatchesSnapshot()].slice(0, MATCH_LIMIT);
    writeMatches(next);
  }, []);

  const clear = useCallback(() => {
    writeMatches([]);
  }, []);

  return { matches, add, clear };
}
