import { bestValue, valueFor } from "@/lib/coach";
import {
  BOARD_SIZE,
  otherMark,
  place,
  type Board,
  type Mark,
} from "@/lib/game";

const CELLS = Array.from({ length: BOARD_SIZE }, (_, index) => index);

export const BOT_MISTAKE_RATE = 0.15;

export function legalMoves(board: Board): number[] {
  return CELLS.filter((index) => board[index] === null);
}

export function bestMoves(board: Board, mark: Mark): number[] {
  const moves = legalMoves(board);
  if (moves.length === 0) {
    return [];
  }
  const best = bestValue(board, mark);
  return moves.filter(
    (index) =>
      valueFor(place(board, index, mark), otherMark(mark), mark) === best,
  );
}

export function chooseBotMove(
  board: Board,
  mark: Mark,
  random: () => number = Math.random,
): number | null {
  const moves = legalMoves(board);
  if (moves.length === 0) {
    return null;
  }

  const perfect = bestMoves(board, mark);

  if (random() < BOT_MISTAKE_RATE) {
    const imperfect = moves.filter((index) => !perfect.includes(index));
    if (imperfect.length > 0) {
      return imperfect[Math.floor(random() * imperfect.length)];
    }
  }

  return perfect[Math.floor(random() * perfect.length)];
}
