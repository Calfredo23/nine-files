import type { Mark } from "@/lib/game";

export type GameMode = "single" | "two";

export type GameSettings = {
  readonly mode: GameMode;
  // The solo player's mark, or Player 1's mark when two people play.
  readonly userMark: Mark;
  readonly playerTwoName?: string;
};

export const DEFAULT_SETTINGS: GameSettings = Object.freeze({
  mode: "two",
  userMark: "X",
  playerTwoName: "",
});

export const SETTINGS_KEY = "nine-files:settings:v1";

export function parseSettings(value: unknown): GameSettings {
  if (typeof value !== "object" || value === null) {
    return DEFAULT_SETTINGS;
  }
  const record = value as Record<string, unknown>;
  const mode: GameMode =
    record.mode === "single" || record.mode === "two" ? record.mode : "two";
  const userMark: Mark =
    record.userMark === "X" || record.userMark === "O" ? record.userMark : "X";
  const playerTwoName =
    typeof record.playerTwoName === "string"
      ? record.playerTwoName.replace(/\s+/g, " ").trim().slice(0, 18)
      : "";
  return { mode, userMark, playerTwoName };
}

export function loadSettings(): GameSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    return parseSettings(JSON.parse(raw) as unknown);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable; the session still uses the chosen mode.
  }
}
