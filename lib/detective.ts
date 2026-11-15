export const INTRO_KEY = "nine-files:intro:v1";
export const SETUP_KEY = "nine-files:setup:v1";
export const NAME_KEY = "nine-files:name:v1";
export const NAME_LIMIT = 18;

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

function write(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable; the state still holds for this visit.
  }
}

export function cleanName(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, NAME_LIMIT);
}

export function loadIntroSeen(): boolean {
  return read(INTRO_KEY) === "seen";
}

export function saveIntroSeen(): void {
  write(INTRO_KEY, "seen");
}

export function loadSetupSeen(): boolean {
  return read(SETUP_KEY) === "seen";
}

export function saveSetupSeen(): void {
  write(SETUP_KEY, "seen");
}

export function loadDetectiveName(): string {
  return cleanName(read(NAME_KEY) ?? "");
}

export function saveDetectiveName(name: string): void {
  write(NAME_KEY, cleanName(name));
}
