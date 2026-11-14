"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  gameReducer,
  getOutcome,
  INITIAL_GAME,
  place,
  type GameState,
  type Mark,
} from "@/lib/game";
import { coachForMove, resetScoresLine, startLine } from "@/lib/coach";
import { useCoach } from "@/hooks/use-coach";
import { useLedger } from "@/hooks/use-ledger";
import { useSoundPreference } from "@/hooks/use-sound-preference";
import { sound } from "@/lib/sound";
import { Ambient } from "@/components/ambient";
import { CaptainCard } from "@/components/captain-card";
import { CaseBoard } from "@/components/case-board";
import { CaseLedger } from "@/components/case-ledger";
import { DetectiveCard, type DetectiveStatus } from "@/components/detective-card";
import { HowToPlay } from "@/components/how-to-play";
import { MoveLog } from "@/components/move-log";
import { NewGameButton } from "@/components/new-game-button";
import { SoundToggle } from "@/components/sound-toggle";
import { TurnBanner } from "@/components/turn-banner";

function statusFor(mark: Mark, state: GameState): DetectiveStatus {
  if (state.outcome?.kind === "win") {
    return state.outcome.mark === mark ? "WINNER" : "OUT";
  }
  if (state.outcome?.kind === "draw") {
    return "DRAW";
  }
  return state.turn === mark ? "TURN" : "WAITING";
}

function isHighlighted(mark: Mark, state: GameState): boolean {
  if (state.outcome?.kind === "win") {
    return state.outcome.mark === mark;
  }
  return !state.outcome && state.turn === mark;
}

export function CaseFile() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME);
  const { ledger, record, reset: resetLedger } = useLedger();
  const { on: soundOn, toggle: toggleSound } = useSoundPreference();
  const coach = useCoach();
  const resultRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    sound.setMuted(!soundOn);
  }, [soundOn]);

  useEffect(() => {
    if (!state.outcome) {
      return;
    }
    resultRef.current?.focus({ preventScroll: true });
  }, [state.outcome]);

  const handlePlay = (index: number) => {
    if (state.outcome || state.board[index] !== null) {
      return;
    }

    const nextBoard = place(state.board, index, state.turn);
    const outcome = getOutcome(nextBoard);
    coach.say(
      coachForMove(
        state.board,
        index,
        state.turn,
        state.moves.length + state.round * 7 + index,
      ),
    );
    dispatch({ type: "move", index });

    if (outcome) {
      record(outcome);
      sound.play("stamp");
      if (outcome.kind === "win") {
        window.setTimeout(() => sound.play("win"), 180);
        window.setTimeout(() => sound.play("pluck"), 420);
      } else {
        window.setTimeout(() => sound.play("draw"), 220);
      }
      return;
    }

    sound.play(state.turn === "X" ? "pin" : "pluck");
    window.setTimeout(() => sound.play("paper"), 40);
  };

  const handleNewGame = () => {
    dispatch({ type: "reset" });
    coach.say(startLine(state.round + 1));
    sound.play("paper");
  };

  const handleResetLedger = () => {
    resetLedger();
    coach.say(resetScoresLine());
    sound.play("click");
  };

  return (
    <div className="app-shell relative min-h-dvh bg-ink">
      <Ambient />

      <div className="relative z-10 flex min-h-dvh flex-col lg:h-full lg:min-h-0">
        <header className="mx-auto flex w-full max-w-[1320px] shrink-0 flex-col gap-2 px-4 pb-3 pt-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] text-smoke">
              DIVISION 9 · CASE FILE № 003
            </p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h1 className="font-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-bold leading-none tracking-[0.02em] text-paper">
                THE NINE FILES
              </h1>
              <p className="font-serif text-sm italic text-smoke">
                A tic-tac-toe case in nine clues.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="live-dot" aria-hidden="true" />
            <span className="font-mono text-[9px] tracking-[0.22em] text-smoke">
              OPEN
            </span>
            <SoundToggle on={soundOn} onToggle={toggleSound} />
          </div>
        </header>

        <main className="app-main mx-auto grid w-full max-w-[1320px] flex-1 gap-4 px-4 pb-4 pt-1 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)_260px] lg:grid-rows-[auto_minmax(0,1fr)] lg:items-start lg:gap-6 lg:px-8">
          <div className="order-1 lg:col-start-1 lg:row-start-1">
            <CaptainCard message={coach.message} speaking={coach.speaking} />
          </div>

          <aside
            aria-label="The detectives"
            className="order-3 flex min-h-0 flex-col gap-2 lg:col-start-1 lg:row-start-2"
          >
            <p className="font-mono text-[9px] tracking-[0.24em] text-smoke">
              THE DETECTIVES
            </p>
            <DetectiveCard
              mark="X"
              active={isHighlighted("X", state)}
              status={statusFor("X", state)}
            />
            <DetectiveCard
              mark="O"
              active={isHighlighted("O", state)}
              status={statusFor("O", state)}
            />
          </aside>

          <section className="order-2 mx-auto flex min-h-0 w-full max-w-[560px] flex-col lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="board-wrap mx-auto flex w-full flex-col">
              <TurnBanner state={state} resultRef={resultRef} />

              <div className="mt-2">
                <CaseBoard
                  board={state.board}
                  turn={state.turn}
                  outcome={state.outcome}
                  lastMove={state.lastMove}
                  round={state.round}
                  onPlay={handlePlay}
                />
              </div>

              <div className="mt-2">
                <NewGameButton onClick={handleNewGame} />
              </div>
            </div>
          </section>

          <aside
            aria-label="Scores and move history"
            className="order-4 flex min-h-0 flex-col gap-3 lg:col-start-3 lg:row-span-2 lg:row-start-1"
          >
            <CaseLedger ledger={ledger} onReset={handleResetLedger} />
            <MoveLog moves={state.moves} />
            <HowToPlay />
          </aside>
        </main>

        <footer className="mx-auto flex w-full max-w-[1320px] shrink-0 flex-col gap-1 border-t border-manila/10 px-4 py-2 font-mono text-[9px] tracking-[0.14em] text-smoke sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>NEXT.JS 16 · REACT 19 · TAILWIND 4</p>
          <p className="flex gap-5">
            <a
              href="https://github.com/Calfredo23/nine-files"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-paper"
            >
              SOURCE
            </a>
            <a
              href="https://calfredo.is-pinoy.dev"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-paper"
            >
              PORTFOLIO
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
