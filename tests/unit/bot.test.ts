import { describe, expect, it } from "vitest";
import {
  BOT_MISTAKE_RATE,
  bestMoves,
  chooseBotMove,
  legalMoves,
} from "../../lib/bot";
import { EMPTY_BOARD, place, type Board, type Mark } from "../../lib/game";

function boardWith(entries: ReadonlyArray<readonly [number, Mark]>): Board {
  let board = EMPTY_BOARD;
  for (const [index, mark] of entries) {
    board = place(board, index, mark);
  }
  return board;
}

describe("bot moves", () => {
  it("lists legal moves without mutating the board", () => {
    const board = boardWith([
      [0, "X"],
      [4, "O"],
    ]);
    expect(legalMoves(board)).toEqual([1, 2, 3, 5, 6, 7, 8]);
    expect(board[0]).toBe("X");
  });

  it("takes a winning move when it is focused", () => {
    const board = boardWith([
      [0, "X"],
      [1, "X"],
      [3, "O"],
      [4, "O"],
    ]);
    expect(bestMoves(board, "X")).toEqual([2]);
    expect(chooseBotMove(board, "X", () => 0.99)).toBe(2);
  });

  it("blocks the only line when it is focused", () => {
    const board = boardWith([
      [0, "X"],
      [1, "X"],
      [4, "O"],
    ]);
    expect(chooseBotMove(board, "O", () => 0.99)).toBe(2);
  });

  it("can miss the best move at the mistake rate", () => {
    const board = boardWith([
      [0, "X"],
      [1, "X"],
      [3, "O"],
      [4, "O"],
    ]);
    const values = [0, 0];
    const move = chooseBotMove(board, "X", () => values.shift() ?? 0);
    expect(move).not.toBe(2);
  });

  it("keeps a perfect move when the roll is above the mistake rate", () => {
    const board = boardWith([
      [0, "X"],
      [1, "X"],
      [3, "O"],
      [4, "O"],
    ]);
    const move = chooseBotMove(board, "X", () => BOT_MISTAKE_RATE + 0.01);
    expect(move).toBe(2);
  });

  it("returns null on a full board", () => {
    const board = boardWith([
      [0, "X"],
      [1, "O"],
      [2, "X"],
      [3, "X"],
      [4, "O"],
      [5, "O"],
      [6, "O"],
      [7, "X"],
      [8, "X"],
    ]);
    expect(legalMoves(board)).toEqual([]);
    expect(chooseBotMove(board, "O")).toBeNull();
  });

  it("never returns an occupied square", () => {
    const board = boardWith([
      [0, "X"],
      [4, "O"],
      [8, "X"],
    ]);
    for (let roll = 0; roll < 20; roll += 1) {
      const move = chooseBotMove(board, "O", () => roll / 20);
      expect(move).not.toBeNull();
      expect(board[move as number]).toBeNull();
    }
  });
});
