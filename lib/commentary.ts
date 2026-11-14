import { BOARD_SIZE, type GameState } from "@/lib/game";

export type CommentaryMood =
  | "idle"
  | "opening"
  | "mid"
  | "last"
  | "win-x"
  | "win-o"
  | "draw";

export const COMMENTARY: Record<CommentaryMood, readonly string[]> = {
  idle: [
    "Nine squares. X starts.",
    "The board is empty. Pick a square.",
    "Nothing pinned yet. X goes first.",
  ],
  opening: [
    "One card up. The rest is guesswork.",
    "Early moves. Nothing is decided.",
    "A quiet start. It won't stay quiet.",
  ],
  mid: [
    "The pattern is starting to show.",
    "Half the board is claimed. Watch the lines.",
    "A few clues in. Nobody has blinked.",
    "The board is filling up. Look for the third.",
  ],
  last: [
    "One square left. This is the one.",
    "Eight moves down. The last one decides it.",
    "Everything comes down to the last square.",
  ],
  "win-x": [
    "Case closed. Cross takes it.",
    "Three in a row. Cross signs off.",
    "That's the line. Cross closes the file.",
  ],
  "win-o": [
    "Case closed. O'Rourke takes it.",
    "Three in a row. O'Rourke signs off.",
    "That's the line. O'Rourke closes the file.",
  ],
  draw: [
    "No winner. The case goes cold.",
    "A draw. Nobody cracked it.",
    "Nine moves, no line. The file stays open.",
  ],
};

export function moodFor(state: GameState): CommentaryMood {
  if (state.outcome?.kind === "win") {
    return state.outcome.mark === "X" ? "win-x" : "win-o";
  }
  if (state.outcome?.kind === "draw") {
    return "draw";
  }
  const remaining = BOARD_SIZE - state.moves.length;
  if (remaining === 1) {
    return "last";
  }
  if (state.moves.length === 0) {
    return "idle";
  }
  if (state.moves.length < 3) {
    return "opening";
  }
  return "mid";
}

export function commentaryFor(state: GameState): string {
  const pool = COMMENTARY[moodFor(state)];
  const index = (state.moves.length * 7 + state.round * 3) % pool.length;
  return pool[index];
}
