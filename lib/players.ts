import type { Mark } from "@/lib/game";

export type Player = {
  readonly mark: Mark;
  readonly name: string;
  readonly short: string;
  readonly plain: string;
  readonly badge: string;
  readonly division: string;
};

export const PLAYERS: Record<Mark, Player> = {
  X: {
    mark: "X",
    name: "DET. CROSS",
    short: "CROSS",
    plain: "Cross",
    badge: "X-01",
    division: "DIVISION 9",
  },
  O: {
    mark: "O",
    name: "DET. O'ROURKE",
    short: "O'ROURKE",
    plain: "O'Rourke",
    badge: "O-02",
    division: "DIVISION 9",
  },
};

export function playerFor(mark: Mark, detectiveName?: string | null): Player {
  if (mark === "O") {
    return PLAYERS.O;
  }
  const name = detectiveName?.trim();
  if (!name) {
    return PLAYERS.X;
  }
  return {
    mark: "X",
    name: `DET. ${name.toUpperCase()}`,
    short: name.toUpperCase(),
    plain: name,
    badge: "X-01",
    division: "DIVISION 9",
  };
}
