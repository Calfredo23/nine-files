import {
  WIN_LINES,
  cellLabel,
  getOutcome,
  otherMark,
  place,
  type Board,
  type Mark,
  type WinLine,
} from "@/lib/game";
import { PLAYERS } from "@/lib/players";

export type CoachGrade =
  | "start"
  | "best"
  | "good"
  | "inaccuracy"
  | "mistake"
  | "blunder"
  | "win"
  | "draw";

export type CoachLine = {
  readonly text: string;
  readonly grade: CoachGrade;
};

const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
const CORNERS = new Set([0, 2, 6, 8]);
const cache = new Map<string, number>();

function cacheKey(board: Board, toMove: Mark, me: Mark): string {
  return `${board.map((cell) => cell ?? "-").join("")}:${toMove}:${me}`;
}

export function valueFor(board: Board, toMove: Mark, me: Mark): number {
  const outcome = getOutcome(board);
  if (outcome?.kind === "win") {
    return outcome.mark === me ? 1 : -1;
  }
  if (outcome?.kind === "draw") {
    return 0;
  }

  const key = cacheKey(board, toMove, me);
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const empty = CELLS.filter((index) => board[index] === null);
  const values = empty.map((index) =>
    valueFor(place(board, index, toMove), otherMark(toMove), me),
  );
  const value =
    toMove === me ? Math.max(...values) : Math.min(...values);
  cache.set(key, value);
  return value;
}

export function bestValue(board: Board, mark: Mark): number {
  const empty = CELLS.filter((index) => board[index] === null);
  return Math.max(
    ...empty.map((index) =>
      valueFor(place(board, index, mark), otherMark(mark), mark),
    ),
  );
}

export function threatCells(board: Board, mark: Mark): number[] {
  const cells = new Set<number>();
  for (const line of WIN_LINES) {
    const marks = line.filter((index) => board[index] === mark).length;
    const empty = line.filter((index) => board[index] === null);
    if (marks === 2 && empty.length === 1) {
      cells.add(empty[0]);
    }
  }
  return [...cells];
}

export function winningMove(board: Board, mark: Mark): number | null {
  const threats = threatCells(board, mark);
  return threats.length > 0 ? threats[0] : null;
}

export function isFork(board: Board, mark: Mark): boolean {
  return threatCells(board, mark).length >= 2;
}

export function lineName(line: WinLine): string {
  switch (line.join("")) {
    case "012":
      return "the top row";
    case "345":
      return "the middle row";
    case "678":
      return "the bottom row";
    case "036":
      return "the left column";
    case "147":
      return "the middle column";
    case "258":
      return "the right column";
    case "048":
      return "the main diagonal";
    case "246":
      return "the other diagonal";
    default:
      return "that line";
  }
}

function threatLineName(board: Board, mark: Mark): string | null {
  for (const line of WIN_LINES) {
    const marks = line.filter((index) => board[index] === mark).length;
    const empty = line.filter((index) => board[index] === null);
    if (marks === 2 && empty.length === 1) {
      return lineName(line);
    }
  }
  return null;
}

function pick<T>(pool: readonly T[], seed: number): T {
  return pool[Math.abs(seed) % pool.length];
}

export function startLine(seed = 0): CoachLine {
  return {
    grade: "start",
    text: pick(
      [
        "X starts. The center is a good first move.",
        "New case. X has the first move.",
        "Nine squares. X opens.",
      ],
      seed,
    ),
  };
}

export function resetScoresLine(): CoachLine {
  return {
    grade: "start",
    text: "Scores reset. The board stays.",
  };
}

export function coachForMove(
  before: Board,
  index: number,
  mark: Mark,
  seed = 0,
): CoachLine {
  const after = place(before, index, mark);
  const outcome = getOutcome(after);
  const player = PLAYERS[mark].plain;
  const opponent = PLAYERS[otherMark(mark)].plain;
  const isCentre = index === 4;
  const isCorner = CORNERS.has(index);

  if (outcome?.kind === "win") {
    return {
      grade: "win",
      text: pick(
        [
          "That's the line. Case closed.",
          "Three in a row. Nicely done.",
          `${player} closes the case.`,
        ],
        seed,
      ),
    };
  }

  if (outcome?.kind === "draw") {
    return {
      grade: "draw",
      text: pick(
        [
          "No line either way. That's the game.",
          "A draw. Nobody cracked it.",
          "Nine moves, no winner.",
        ],
        seed,
      ),
    };
  }

  const best = bestValue(before, mark);
  const played = valueFor(after, otherMark(mark), mark);

  if (best === -1) {
    return {
      grade: "good",
      text: `${player} is already lost here. Play it out.`,
    };
  }

  const blockedLine = threatLineName(before, otherMark(mark));
  const blocked =
    blockedLine !== null &&
    threatCells(before, otherMark(mark)).includes(index);
  const liveLine = threatLineName(after, mark);
  const fork = isFork(after, mark);
  const opponentLine = threatLineName(after, otherMark(mark));
  const opponentFork = isFork(after, otherMark(mark));
  const missedWin = winningMove(before, mark);

  if (played < best) {
    if (played === -1) {
      if (opponentFork) {
        return {
          grade: "blunder",
          text: `${player} opens two lines. ${opponent} can't be stopped.`,
        };
      }
      if (opponentLine) {
        return {
          grade: "blunder",
          text: `${player} leaves ${opponentLine} open. ${opponent} wins next.`,
        };
      }
      return {
        grade: "blunder",
        text: `${player} loses the position. That one hurts.`,
      };
    }

    if (best === 1 && missedWin !== null) {
      return {
        grade: "mistake",
        text: `${player} had the win at ${cellLabel(missedWin)}. This lets ${opponent} back in.`,
      };
    }

    return {
      grade: "mistake",
      text: `${player} had a better square. This one gives ground.`,
    };
  }

  if (best === 1) {
    if (fork) {
      return {
        grade: "best",
        text: `${player} creates a fork. Two threats, one move.`,
      };
    }
    if (liveLine) {
      return {
        grade: "best",
        text: `${player} makes a threat. ${liveLine} is live.`,
      };
    }
    return {
      grade: "best",
      text: "Best move. The win is still there.",
    };
  }

  if (blocked) {
    return {
      grade: "best",
      text: `${player} blocks ${blockedLine}. Necessary.`,
    };
  }

  if (fork) {
    return {
      grade: "best",
      text: `${player} creates a fork. Two threats at once.`,
    };
  }

  if (liveLine) {
    return {
      grade: "best",
      text: `${player} makes a threat. ${liveLine} is live.`,
    };
  }

  if (best === 0) {
    const drawingMoves = CELLS.filter(
      (cell) =>
        before[cell] === null &&
        valueFor(place(before, cell, mark), otherMark(mark), mark) === 0,
    );
    if (drawingMoves.length === 1) {
      return {
        grade: "best",
        text: `Only move that holds. ${cellLabel(index)} is the one.`,
      };
    }
  }

  if (isCentre) {
    return {
      grade: "good",
      text: pick(
        [
          "Center. It gives you the most lines.",
          `${player} takes the center. Good start.`,
          "The center is the best square on the board.",
        ],
        seed,
      ),
    };
  }

  if (isCorner) {
    return {
      grade: "good",
      text: pick(
        [
          "Corner. Corners make more forks than edges.",
          `${player} takes a corner. Good.`,
          "Corners give you two lines from the start.",
        ],
        seed,
      ),
    };
  }

  return {
    grade: "inaccuracy",
    text: pick(
      [
        "The edge is playable, but it does less.",
        `${player} takes an edge. Not losing, just slow.`,
        "Fine. The center would have done more.",
      ],
      seed,
    ),
  };
}

