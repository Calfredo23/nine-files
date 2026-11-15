import type { Mark, Move } from "@/lib/game";

export type MatchWinner = Mark | "draw";

export type MatchRecord = {
  readonly id: string;
  readonly winner: MatchWinner;
  readonly moves: readonly Move[];
  readonly finishedAt: number;
  readonly round: number;
};

export const MATCHES_KEY = "nine-files:matches:v1";
export const MATCH_LIMIT = 25;

function isMove(value: unknown): value is Move {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const move = value as Record<string, unknown>;
  return (
    typeof move.index === "number" &&
    Number.isInteger(move.index) &&
    move.index >= 0 &&
    move.index < 9 &&
    (move.mark === "X" || move.mark === "O")
  );
}

export function parseMatches(value: unknown): MatchRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const matches: MatchRecord[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }
    const record = entry as Record<string, unknown>;
    if (
      typeof record.id !== "string" ||
      record.id.length === 0 ||
      record.id.length > 80
    ) {
      continue;
    }
    if (
      record.winner !== "X" &&
      record.winner !== "O" &&
      record.winner !== "draw"
    ) {
      continue;
    }
    if (
      !Array.isArray(record.moves) ||
      record.moves.length > 9 ||
      !record.moves.every(isMove)
    ) {
      continue;
    }
    if (
      typeof record.finishedAt !== "number" ||
      !Number.isFinite(record.finishedAt) ||
      record.finishedAt <= 0
    ) {
      continue;
    }
    if (
      typeof record.round !== "number" ||
      !Number.isInteger(record.round) ||
      record.round < 0
    ) {
      continue;
    }

    matches.push({
      id: record.id,
      winner: record.winner as MatchWinner,
      moves: (record.moves as Move[]).map((move) => ({
        index: move.index,
        mark: move.mark,
      })),
      finishedAt: record.finishedAt,
      round: record.round,
    });

    if (matches.length >= MATCH_LIMIT) {
      break;
    }
  }

  return matches;
}

export function loadMatches(): MatchRecord[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(MATCHES_KEY);
    if (!raw) {
      return [];
    }
    return parseMatches(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

export function saveMatches(matches: readonly MatchRecord[]): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(
      MATCHES_KEY,
      JSON.stringify(matches.slice(0, MATCH_LIMIT)),
    );
  } catch {
    // Storage can be unavailable; the in-memory history still works.
  }
}

export function makeMatchId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
