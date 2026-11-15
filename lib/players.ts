import type { Mark } from "@/lib/game";
import { DEFAULT_SETTINGS, type GameSettings } from "@/lib/settings";

export type Player = {
  readonly mark: Mark;
  readonly name: string;
  readonly short: string;
  readonly plain: string;
  readonly badge: string;
  readonly division: string;
  readonly bot: boolean;
};
export const PLAYERS: Record<Mark, Player> = {
  X: {
    mark: "X",
    name: "DET. CROSS",
    short: "CROSS",
    plain: "Cross",
    badge: "X-01",
    division: "DIVISION 9",
    bot: false,
  },
  O: {
    mark: "O",
    name: "DET. O'ROURKE",
    short: "O'ROURKE",
    plain: "O'Rourke",
    badge: "O-02",
    division: "DIVISION 9",
    bot: false,
  },
};

function houseFor(mark: Mark): Player {
  return {
    mark,
    name: "THE HOUSE",
    short: "THE HOUSE",
    plain: "The House",
    badge: "CPU",
    division: "AUTOMATED",
    bot: true,
  };
}

function namedFor(
  mark: Mark,
  detectiveName: string | null | undefined,
  fallbackName: string,
): Player {
  const name = detectiveName?.trim() || fallbackName;
  if (!name) {
    return PLAYERS[mark];
  }
  return {
    mark,
    name: `DET. ${name.toUpperCase()}`,
    short: name.toUpperCase(),
    plain: name,
    badge: PLAYERS[mark].badge,
    division: PLAYERS[mark].division,
    bot: false,
  };
}

export function playerFor(
  mark: Mark,
  settings: GameSettings = DEFAULT_SETTINGS,
  detectiveName?: string | null,
): Player {
  if (settings.mode === "single" && mark !== settings.userMark) {
    return houseFor(mark);
  }
  if (settings.mode === "two") {
    const isPlayerOne = mark === settings.userMark;
    return namedFor(
      mark,
      isPlayerOne ? detectiveName : settings.playerTwoName,
      isPlayerOne ? "Secret Detective 1" : "Secret Detective 2",
    );
  }
  return namedFor(mark, detectiveName, "Secret Detective");
}
