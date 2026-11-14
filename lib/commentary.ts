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
    "The city's quiet. Too quiet.",
    "Nine clues on the wall. Nobody's talking yet.",
    "A fresh case. The lamp's still warm.",
  ],
  opening: [
    "The first clue is always a lie.",
    "Somebody's nervous. Good.",
    "The wall's filling up. So is the story.",
    "A quiet start. It never stays quiet.",
  ],
  mid: [
    "Three clues in. The picture's getting ugly.",
    "The pattern's there. Nobody wants to see it.",
    "Somewhere, a suspect checks the time.",
    "Half the wall's covered. Half the truth isn't.",
  ],
  last: [
    "One cell left. Somebody's lying.",
    "Nine clues, one empty pin. Make it count.",
    "The room goes quiet. The last card waits.",
  ],
  "win-x": [
    "CASE CLOSED. Cross gets the collar.",
    "The yarn doesn't lie. Cross takes it.",
    "Three in a row. Cross signs the report.",
  ],
  "win-o": [
    "CASE CLOSED. O'Rourke takes the glory.",
    "O'Rourke saw it first. The wall agrees.",
    "Three in a row. O'Rourke closes the file.",
  ],
  draw: [
    "COLD CASE. Nine clues, no answers.",
    "A perfect dead end. File it under tomorrow.",
    "Nobody blinked. Nobody won.",
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
