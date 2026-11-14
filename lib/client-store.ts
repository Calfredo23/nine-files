import {
  EMPTY_LEDGER,
  loadLedger,
  loadSound,
  saveLedger,
  saveSound,
  type Ledger,
} from "@/lib/storage";

const LEDGER_EVENT = "nine-files:ledger-changed";
const SOUND_EVENT = "nine-files:sound-changed";
const LEDGER_KEY = "nine-files:ledger:v1";

let ledgerCache: { raw: string | null; value: Ledger } | null = null;

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
