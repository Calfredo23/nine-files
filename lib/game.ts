export type Mark = "X" | "O";

export type Cell = Mark | null;

export type Board = readonly Cell[];

export type WinLine = readonly [number, number, number];

export type Win = {
  readonly mark: Mark;
  readonly line: WinLine;
};

export type Outcome =
  | { readonly kind: "win"; readonly mark: Mark; readonly line: WinLine }
  | { readonly kind: "draw" };

export type Move = {
  readonly index: number;
  readonly mark: Mark;
};

export const BOARD_SIZE = 9;

export const EMPTY_BOARD: Board = Object.freeze(
  Array<Cell>(BOARD_SIZE).fill(null),
);

export const WIN_LINES: readonly WinLine[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const ROWS = ["A", "B", "C"] as const;

export function cellLabel(index: number): string {
  if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE) {
    throw new RangeError(`Cell ${index} is outside the board`);
  }
  return `${ROWS[Math.floor(index / 3)]}${(index % 3) + 1}`;
}

export function otherMark(mark: Mark): Mark {
  return mark === "X" ? "O" : "X";
}

export function nextMark(moveCount: number): Mark {
  return moveCount % 2 === 0 ? "X" : "O";
}

export function getWinner(board: Board): Win | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark !== null && mark === board[b] && mark === board[c]) {
      return { mark, line };
    }
  }
  return null;
}

export function isFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function getOutcome(board: Board): Outcome | null {
  const win = getWinner(board);
  if (win) {
    return { kind: "win", mark: win.mark, line: win.line };
  }
  return isFull(board) ? { kind: "draw" } : null;
}

export function place(board: Board, index: number, mark: Mark): Board {
  if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE) {
    throw new RangeError(`Cell ${index} is outside the board`);
  }
  if (board[index] !== null) {
    throw new Error(`Cell ${cellLabel(index)} is already claimed`);
  }
  const next = board.slice();
  next[index] = mark;
  return next;
}

export type GameState = {
  readonly moves: readonly Move[];
  readonly board: Board;
  readonly turn: Mark;
  readonly outcome: Outcome | null;
  readonly lastMove: Move | null;
  readonly round: number;
};

export type GameAction =
  | { readonly type: "move"; readonly index: number }
  | { readonly type: "reset" };

export const INITIAL_GAME: GameState = {
  moves: [],
  board: EMPTY_BOARD,
  turn: "X",
  outcome: null,
  lastMove: null,
  round: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "reset") {
    return { ...INITIAL_GAME, round: state.round + 1 };
  }

  if (state.outcome !== null) {
    return state;
  }

  if (
    !Number.isInteger(action.index) ||
    action.index < 0 ||
    action.index >= BOARD_SIZE ||
    state.board[action.index] !== null
  ) {
    return state;
  }

  const board = place(state.board, action.index, state.turn);
  const lastMove: Move = { index: action.index, mark: state.turn };
  const moves = [...state.moves, lastMove];

  return {
    moves,
    board,
    turn: otherMark(state.turn),
    outcome: getOutcome(board),
    lastMove,
    round: state.round,
  };
}
