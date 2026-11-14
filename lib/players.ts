import type { Mark } from "@/lib/game";

export type Player = {
  readonly mark: Mark;
  readonly name: string;
  readonly short: string;
  readonly badge: string;
  readonly division: string;
};

export const PLAYERS: Record<Mark, Player> = {
  X: {
    mark: "X",
    name: "DET. CROSS",
    short: "CROSS",
    badge: "X-01",
    division: "DIVISION 9",
  },
  O: {
    mark: "O",
    name: "DET. O'ROURKE",
    short: "O'ROURKE",
    badge: "O-02",
    division: "DIVISION 9",
  },
};
