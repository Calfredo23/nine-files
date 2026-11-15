export type Ledger = {
  readonly cross: number;
  readonly orourke: number;
  readonly cold: number;
};

export const EMPTY_LEDGER: Ledger = Object.freeze({
  cross: 0,
  orourke: 0,
  cold: 0,
});

const LEDGER_KEY = "nine-files:ledger:v1";
const SOUND_KEY = "nine-files:sound:v1";
const MUSIC_KEY = "nine-files:music:v1";
const MAX_COUNT = 1_000_000;

function isCount(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= MAX_COUNT
  );
}

export function loadLedger(): Ledger {
  if (typeof window === "undefined") {
    return EMPTY_LEDGER;
  }
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY);
    if (!raw) {
      return EMPTY_LEDGER;
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return EMPTY_LEDGER;
    }
    const record = parsed as Record<string, unknown>;
    if (
      !isCount(record.cross) ||
      !isCount(record.orourke) ||
      !isCount(record.cold)
    ) {
      return EMPTY_LEDGER;
    }
    return {
      cross: record.cross,
      orourke: record.orourke,
      cold: record.cold,
    };
  } catch {
    return EMPTY_LEDGER;
  }
}

export function saveLedger(ledger: Ledger): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
  } catch {
    // Storage can be unavailable; the in-memory ledger still works.
  }
}

export function loadSound(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

export function saveSound(on: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    // Storage can be unavailable; the preference still holds for this visit.
  }
}

export function loadMusic(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  try {
    return window.localStorage.getItem(MUSIC_KEY) !== "off";
  } catch {
    return true;
  }
}

export function saveMusic(on: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(MUSIC_KEY, on ? "on" : "off");
  } catch {
    // Storage can be unavailable; the preference still holds for this visit.
  }
}
