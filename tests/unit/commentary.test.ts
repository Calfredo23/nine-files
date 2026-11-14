import { describe, expect, it } from "vitest";
import {
  COMMENTARY,
  commentaryFor,
  moodFor,
  type CommentaryMood,
} from "../../lib/commentary";
import { INITIAL_GAME, gameReducer, type GameState } from "../../lib/game";

function play(state: GameState, indexes: readonly number[]): GameState {
  return indexes.reduce(
    (current, index) => gameReducer(current, { type: "move", index }),
    state,
  );
}

describe("commentary pools", () => {
  it("has a non-empty pool for every mood", () => {
    for (const pool of Object.values(COMMENTARY)) {
      expect(pool.length).toBeGreaterThan(0);
    }
  });

  it("does not repeat the same line on consecutive opening moves", () => {
    const afterOne = play(INITIAL_GAME, [0]);
    const afterTwo = play(afterOne, [1]);
    expect(commentaryFor(afterOne)).not.toBe(commentaryFor(afterTwo));
  });

  it("returns a line from the correct pool", () => {
    const moods: ReadonlyArray<readonly [GameState, CommentaryMood]> = [
      [INITIAL_GAME, "idle"],
      [play(INITIAL_GAME, [0]), "opening"],
      [play(INITIAL_GAME, [0, 4, 1, 5]), "mid"],
      [play(INITIAL_GAME, [0, 1, 2, 4, 3, 5, 7, 6]), "last"],
      [play(INITIAL_GAME, [0, 3, 1, 4, 2]), "win-x"],
      [play(INITIAL_GAME, [0, 1, 2, 4, 3, 7]), "win-o"],
      [play(INITIAL_GAME, [0, 1, 2, 4, 3, 5, 7, 6, 8]), "draw"],
    ];

    for (const [state, mood] of moods) {
      expect(moodFor(state)).toBe(mood);
      expect(COMMENTARY[mood]).toContain(commentaryFor(state));
    }
  });
});
