import {
  EMPTY_LEDGER,
  loadLedger,
  loadSound,
  saveLedger,
  saveSound,
  type Ledger,
} from "@/lib/storage";
import {
  MATCHES_KEY,
  MATCH_LIMIT,
  loadMatches,
  saveMatches,
  type MatchRecord,
} from "@/lib/history";

const LEDGER_EVENT = "nine-files:ledger-changed";
const SOUND_EVENT = "nine-files:sound-changed";
const MATCHES_EVENT = "nine-files:matches-changed";
const LEDGER_KEY = "nine-files:ledger:v1";
const EMPTY_MATCHES: MatchRecord[] = [];

let ledgerCache: { raw: string | null; value: Ledger } | null = null;
let matchCache: { raw: string | null; value: MatchRecord[] } | null = null;

function read(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getLedgerSnapshot(): Ledger {
  if (typeof window === "undefined") {
    return EMPTY_LEDGER;
  }
  const raw = read(LEDGER_KEY);
  if (ledgerCache && ledgerCache.raw === raw) {
    return ledgerCache.value;
  }
  const value = loadLedger();
  ledgerCache = { raw, value };
  return value;
}

export function getServerLedgerSnapshot(): Ledger {
  return EMPTY_LEDGER;
}

export function subscribeLedger(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(LEDGER_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(LEDGER_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function writeLedger(next: Ledger): void {
  saveLedger(next);
  ledgerCache = { raw: JSON.stringify(next), value: next };
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LEDGER_EVENT));
  }
}

export function getSoundSnapshot(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return loadSound();
}

export function getServerSoundSnapshot(): boolean {
  return true;
}

export function subscribeSound(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(SOUND_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(SOUND_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function writeSound(next: boolean): void {
  saveSound(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SOUND_EVENT));
  }
}

export function getMatchesSnapshot(): MatchRecord[] {
  if (typeof window === "undefined") {
    return EMPTY_MATCHES;
  }
  const raw = read(MATCHES_KEY);
  if (matchCache && matchCache.raw === raw) {
    return matchCache.value;
  }
  const value = loadMatches();
  matchCache = { raw, value };
  return value;
}

export function getServerMatchesSnapshot(): MatchRecord[] {
  return EMPTY_MATCHES;
}

export function subscribeMatches(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(MATCHES_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(MATCHES_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function writeMatches(next: readonly MatchRecord[]): void {
  saveMatches(next);
  const value = next.slice(0, MATCH_LIMIT);
  matchCache = { raw: JSON.stringify(value), value: [...value] };
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(MATCHES_EVENT));
  }
}
