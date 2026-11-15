import { describe, expect, it } from "vitest";
import { MATCH_LIMIT, parseMatches, type MatchRecord } from "../../lib/history";

function record(overrides: Partial<MatchRecord> = {}): MatchRecord {
  return {
    id: "match-1",
    winner: "X",
    moves: [
      { index: 0, mark: "X" },
      { index: 3, mark: "O" },
      { index: 1, mark: "X" },
      { index: 4, mark: "O" },
      { index: 2, mark: "X" },
    ],
    finishedAt: 1_700_000_000_000,
    round: 0,
    ...overrides,
  };
}

describe("parseMatches", () => {
  it("keeps a valid record", () => {
    const parsed = parseMatches([record()]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].winner).toBe("X");
    expect(parsed[0].moves).toHaveLength(5);
  });

  it("accepts a draw", () => {
    const parsed = parseMatches([record({ winner: "draw" })]);
    expect(parsed[0].winner).toBe("draw");
  });

  it("drops malformed records without throwing", () => {
    const parsed = parseMatches([
      record(),
      null,
      "nope",
      { ...record(), winner: "Q" },
      { ...record(), moves: [{ index: 9, mark: "X" }] },
      { ...record(), finishedAt: 0 },
    ]);
    expect(parsed).toHaveLength(1);
  });

  it("returns an empty list for a non-array", () => {
    expect(parseMatches({})).toEqual([]);
    expect(parseMatches(null)).toEqual([]);
  });

  it("caps the history", () => {
    const entries = Array.from({ length: MATCH_LIMIT + 5 }, (_, index) =>
      record({ id: `match-${index}` }),
    );
    expect(parseMatches(entries)).toHaveLength(MATCH_LIMIT);
  });
});
