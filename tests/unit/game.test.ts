import { describe, expect, it } from "vitest";
import {
  BOARD_SIZE,
  EMPTY_BOARD,
  INITIAL_GAME,
  WIN_LINES,
  cellLabel,
  gameReducer,
  getOutcome,
  getWinner,
  isFull,
  nextMark,
  otherMark,
  place,
  type Board,
  type GameState,
  type Mark,
} from "../../lib/game";

function boardWith(entries: ReadonlyArray<readonly [number, Mark]>): Board {
  const next = [...EMPTY_BOARD];
  for (const [index, mark] of entries) {
    next[index] = mark;
  }
  return next;
}

function play(state: GameState, indexes: readonly number[]): GameState {
  return indexes.reduce(
    (current, index) => gameReducer(current, { type: "move", index }),
    state,
  );
}

const DRAW_SEQUENCE = [0, 1, 2, 4, 3, 5, 7, 6, 8] as const;
const X_WIN_SEQUENCE = [0, 3, 1, 4, 2] as const;

describe("cellLabel", () => {
  it("maps all nine cells to row letters and column numbers", () => {
    expect(Array.from({ length: BOARD_SIZE }, (_, i) => cellLabel(i))).toEqual([
      "A1",
      "A2",
      "A3",
      "B1",
      "B2",
      "B3",
      "C1",
      "C2",
      "C3",
    ]);
  });

  it("rejects indexes outside the board", () => {
    expect(() => cellLabel(-1)).toThrow(RangeError);
    expect(() => cellLabel(9)).toThrow(RangeError);
  });
});

describe("nextMark / otherMark", () => {
  it("starts with X and alternates", () => {
    expect(nextMark(0)).toBe("X");
    expect(nextMark(1)).toBe("O");
    expect(nextMark(8)).toBe("X");
    expect(otherMark("X")).toBe("O");
    expect(otherMark("O")).toBe("X");
  });
});

describe("getWinner", () => {
  it("detects every winning line", () => {
    for (const line of WIN_LINES) {
      const board = boardWith(line.map((index) => [index, "X"] as const));
      const win = getWinner(board);
      expect(win?.mark).toBe("X");
      expect(win?.line).toEqual(line);
    }
  });

  it("detects O wins", () => {
    const board = boardWith([
      [0, "O"],
      [4, "O"],
      [8, "O"],
    ]);
    expect(getWinner(board)?.mark).toBe("O");
  });

  it("returns null for an empty or partial board", () => {
    expect(getWinner(EMPTY_BOARD)).toBeNull();
    expect(
      getWinner(
        boardWith([
          [0, "X"],
          [1, "X"],
          [4, "O"],
        ]),
      ),
    ).toBeNull();
  });

  it("does not treat a mixed line as a win", () => {
    const board = boardWith([
      [0, "X"],
      [1, "O"],
      [2, "X"],
    ]);
    expect(getWinner(board)).toBeNull();
  });
});

describe("isFull / getOutcome", () => {
  it("recognises a full board with no winner as a draw", () => {
    const board = boardWith(
      DRAW_SEQUENCE.map((index, turn) => [
        index,
        turn % 2 === 0 ? "X" : "O",
      ] as const),
    );
    expect(isFull(board)).toBe(true);
    expect(getWinner(board)).toBeNull();
    expect(getOutcome(board)).toEqual({ kind: "draw" });
  });

  it("prefers a win over a draw when both are true", () => {
    const board = boardWith([
      [0, "X"],
      [1, "X"],
      [2, "X"],
      [3, "O"],
      [4, "O"],
      [5, "O"],
      [6, "X"],
      [7, "X"],
      [8, "O"],
    ]);
    expect(isFull(board)).toBe(true);
    expect(getOutcome(board)?.kind).toBe("win");
  });

  it("returns null while the board is open", () => {
    expect(getOutcome(EMPTY_BOARD)).toBeNull();
    expect(getOutcome(boardWith([[0, "X"]]))).toBeNull();
  });
});

describe("place", () => {
  it("returns a new board and leaves the original untouched", () => {
    const next = place(EMPTY_BOARD, 4, "X");
    expect(next[4]).toBe("X");
    expect(EMPTY_BOARD[4]).toBeNull();
    expect(next).not.toBe(EMPTY_BOARD);
  });

  it("rejects an occupied cell", () => {
    const board = place(EMPTY_BOARD, 4, "X");
    expect(() => place(board, 4, "O")).toThrow(/already claimed/);
  });

  it("rejects indexes outside the board", () => {
    expect(() => place(EMPTY_BOARD, -1, "X")).toThrow(RangeError);
    expect(() => place(EMPTY_BOARD, 9, "X")).toThrow(RangeError);
  });
});

describe("gameReducer", () => {
  it("starts with an empty board and Cross to file", () => {
    expect(INITIAL_GAME.board).toBe(EMPTY_BOARD);
    expect(INITIAL_GAME.turn).toBe("X");
    expect(INITIAL_GAME.outcome).toBeNull();
    expect(INITIAL_GAME.moves).toHaveLength(0);
  });

  it("alternates players and records moves", () => {
    const afterOne = gameReducer(INITIAL_GAME, { type: "move", index: 0 });
    expect(afterOne.turn).toBe("O");
    expect(afterOne.moves).toEqual([{ index: 0, mark: "X" }]);
    expect(afterOne.lastMove).toEqual({ index: 0, mark: "X" });

    const afterTwo = gameReducer(afterOne, { type: "move", index: 4 });
    expect(afterTwo.turn).toBe("X");
    expect(afterTwo.moves).toEqual([
      { index: 0, mark: "X" },
      { index: 4, mark: "O" },
    ]);
  });

  it("ignores an occupied cell", () => {
    const state = play(INITIAL_GAME, [0]);
    expect(gameReducer(state, { type: "move", index: 0 })).toBe(state);
  });

  it("ignores moves after the case is closed", () => {
    const won = play(INITIAL_GAME, X_WIN_SEQUENCE);
    expect(won.outcome).toEqual({ kind: "win", mark: "X", line: [0, 1, 2] });
    expect(gameReducer(won, { type: "move", index: 8 })).toBe(won);
  });

  it("detects a draw", () => {
    const drawn = play(INITIAL_GAME, DRAW_SEQUENCE);
    expect(drawn.outcome).toEqual({ kind: "draw" });
    expect(drawn.moves).toHaveLength(9);
  });

  it("resets the board and keeps the round counter moving", () => {
    const won = play(INITIAL_GAME, X_WIN_SEQUENCE);
    const reset = gameReducer(won, { type: "reset" });
    expect(reset.board).toBe(EMPTY_BOARD);
    expect(reset.turn).toBe("X");
    expect(reset.outcome).toBeNull();
    expect(reset.moves).toHaveLength(0);
    expect(reset.round).toBe(1);
  });
});
