import { describe, expect, it } from "vitest";
import {
  bestValue,
  coachForMove,
  isFork,
  lineName,
  postMatchLine,
  threatCells,
  valueFor,
  welcomeLine,
  winningMove,
} from "../../lib/coach";
import {
  EMPTY_BOARD,
  INITIAL_GAME,
  WIN_LINES,
  gameReducer,
  place,
  type Board,
  type Mark,
} from "../../lib/game";

function boardWith(entries: ReadonlyArray<readonly [number, Mark]>): Board {
  let board = EMPTY_BOARD;
  for (const [index, mark] of entries) {
    board = place(board, index, mark);
  }
  return board;
}

describe("minimax values", () => {
  it("sees a forced win", () => {
    const board = boardWith([
      [0, "X"],
      [1, "X"],
      [3, "O"],
      [4, "O"],
    ]);
    expect(bestValue(board, "X")).toBe(1);
    expect(valueFor(place(board, 2, "X"), "O", "X")).toBe(1);
  });

  it("sees a lost position", () => {
    const board = boardWith([
      [0, "O"],
      [2, "O"],
      [4, "O"],
      [1, "X"],
      [3, "X"],
    ]);
    expect(bestValue(board, "X")).toBe(-1);
    expect(valueFor(place(board, 5, "X"), "O", "X")).toBe(-1);
  });
});

describe("threats", () => {
  it("finds the empty square in a live line", () => {
    const board = boardWith([
      [0, "O"],
      [1, "O"],
      [4, "X"],
    ]);
    expect(threatCells(board, "O")).toEqual([2]);
    expect(winningMove(board, "O")).toBe(2);
  });

  it("recognises a fork", () => {
    const board = boardWith([
      [0, "X"],
      [4, "X"],
      [6, "X"],
    ]);
    expect(isFork(board, "X")).toBe(true);
  });

  it("names every line", () => {
    const names = WIN_LINES.map((line) => lineName(line));
    expect(names).toContain("the top row");
    expect(names).toContain("the middle row");
    expect(names).toContain("the bottom row");
    expect(names).toContain("the left column");
    expect(names).toContain("the middle column");
    expect(names).toContain("the right column");
    expect(names).toContain("the main diagonal");
    expect(names).toContain("the other diagonal");
  });
});

describe("coachForMove", () => {
  it("praises a win", () => {
    const board = boardWith([
      [0, "X"],
      [1, "X"],
      [3, "O"],
      [4, "O"],
    ]);
    const line = coachForMove(board, 2, "X", 0);
    expect(line.grade).toBe("win");
    expect(line.text).toMatch(/line|case|Three/i);
  });

  it("praises a necessary block", () => {
    const board = boardWith([
      [0, "O"],
      [1, "O"],
      [4, "X"],
    ]);
    const line = coachForMove(board, 2, "X", 0);
    expect(line.grade).toBe("best");
    expect(line.text).toMatch(/block/i);
    expect(line.text).toMatch(/top row/i);
  });

  it("calls out a blunder that ignores a live line", () => {
    const board = boardWith([
      [0, "O"],
      [1, "O"],
      [4, "X"],
    ]);
    const line = coachForMove(board, 8, "X", 0);
    expect(line.grade).toBe("blunder");
    expect(line.text).toMatch(/top row|wins next/i);
  });

  it("praises a fork", () => {
    const board = boardWith([
      [0, "X"],
      [4, "X"],
      [1, "O"],
      [5, "O"],
    ]);
    const line = coachForMove(board, 6, "X", 0);
    expect(line.grade).toBe("best");
    expect(line.text).toMatch(/fork/i);
  });

  it("prefers the centre", () => {
    const line = coachForMove(EMPTY_BOARD, 4, "X", 0);
    expect(line.grade).toBe("good");
    expect(line.text).toMatch(/center/i);
  });

  it("flags a slow edge", () => {
    const line = coachForMove(EMPTY_BOARD, 1, "X", 0);
    expect(line.grade).toBe("inaccuracy");
    expect(line.text).toMatch(/edge|slow/i);
  });

  it("recognises a draw", () => {
    const sequence = [0, 1, 2, 4, 3, 5, 7, 6] as const;
    const state = sequence.reduce(
      (current, index) => gameReducer(current, { type: "move", index }),
      INITIAL_GAME,
    );
    const line = coachForMove(state.board, 8, "X", 0);
    expect(line.grade).toBe("draw");
    expect(line.text).toMatch(/draw|winner|game/i);
  });
});

describe("postMatchLine", () => {
  it("compliments the user's win by name", () => {
    const line = postMatchLine({ kind: "win", mark: "X", line: [0, 1, 2] }, "Mara");
    expect(line.grade).toBe("win");
    expect(line.text).toContain("Mara");
    expect(line.text).toMatch(/nicely|Case closed/i);
  });

  it("asks for a rematch after O'Rourke wins", () => {
    const line = postMatchLine({ kind: "win", mark: "O", line: [0, 1, 2] }, "Mara");
    expect(line.grade).toBe("loss");
    expect(line.text).toContain("O'Rourke");
    expect(line.text).toMatch(/run it back/i);
  });

  it("offers another round after a draw", () => {
    const line = postMatchLine({ kind: "draw" }, "Mara");
    expect(line.grade).toBe("draw");
    expect(line.text).toMatch(/One more/i);
    expect(line.text).toContain("Mara");
  });

  it("welcomes the named detective", () => {
    const line = welcomeLine("Mara");
    expect(line.text).toContain("Mara");
    expect(line.grade).toBe("start");
  });
});
