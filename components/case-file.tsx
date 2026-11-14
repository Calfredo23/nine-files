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
import { useLedger } from "@/hooks/use-ledger";
import { useSoundPreference } from "@/hooks/use-sound-preference";
import { sound } from "@/lib/sound";
import { Ambient } from "@/components/ambient";
import { CaseBoard } from "@/components/case-board";
import { CaseLedger } from "@/components/case-ledger";
import { DetectiveCard, type DetectiveStatus } from "@/components/detective-card";
import { HowToPlay } from "@/components/how-to-play";
import { MoveLog } from "@/components/move-log";
import { NewGameButton } from "@/components/new-game-button";
import { ResultBar } from "@/components/result-bar";
import { SoundToggle } from "@/components/sound-toggle";
import { TurnBanner } from "@/components/turn-banner";

function statusFor(mark: Mark, state: GameState): DetectiveStatus {
  if (state.outcome?.kind === "win") {
    return state.outcome.mark === mark ? "LEAD" : "STANDBY";
  }
  if (state.outcome?.kind === "draw") {
    return "UNSOLVED";
  }
  return state.turn === mark ? "FILING" : "STANDBY";
}

export function CaseFile() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME);
  const { ledger, record, reset: resetLedger } = useLedger();
  const { on: soundOn, toggle: toggleSound } = useSoundPreference();
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
    sound.play("paper");
  };

  const handleResetLedger = () => {
    resetLedger();
    sound.play("click");
  };

  return (
    <div className="relative min-h-dvh">
      <Ambient />

      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 pb-6 pt-7 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-smoke">
              DIVISION 9 · CASE FILE № 003
            </p>
            <h1 className="mt-1 font-display text-[clamp(2.6rem,7vw,4.6rem)] font-bold leading-[0.9] tracking-[0.02em] text-paper">
              THE NINE FILES
            </h1>
            <p className="mt-2 max-w-md font-serif text-sm italic text-smoke">
              A tic-tac-toe case in nine clues. Two detectives. One wall.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="live-dot" aria-hidden="true" />
            <span className="font-mono text-[9px] tracking-[0.22em] text-smoke">
              LIVE
            </span>
            <SoundToggle on={soundOn} onToggle={toggleSound} />
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 pb-16 pt-2 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)_minmax(0,1fr)] lg:items-start lg:gap-8 lg:px-8">
          <div className="order-2 flex flex-col gap-3 lg:order-1">
            <p className="font-mono text-[10px] tracking-[0.24em] text-smoke">
              THE DETECTIVES
            </p>
            <DetectiveCard
              mark="X"
              active={!state.outcome && state.turn === "X"}
              status={statusFor("X", state)}
            />
            <DetectiveCard
              mark="O"
              active={!state.outcome && state.turn === "O"}
              status={statusFor("O", state)}
            />

            <div className="border border-manila/15 bg-coal/40 p-4">
              <p className="font-mono text-[10px] tracking-[0.24em] text-smoke">
                THE CASE
              </p>
              <p className="mt-2 font-serif text-sm leading-relaxed text-smoke">
                Nine clues pinned to one wall. Two detectives. Three in a row
                and the file closes.
              </p>
            </div>
          </div>

          <div className="order-1 mx-auto flex w-full max-w-[560px] flex-col lg:order-2">
            <TurnBanner state={state} />

            <div className="mt-4">
              <CaseBoard
                board={state.board}
                turn={state.turn}
                outcome={state.outcome}
                lastMove={state.lastMove}
                round={state.round}
                onPlay={handlePlay}
              />
            </div>

            {state.outcome ? (
              <ResultBar outcome={state.outcome} resultRef={resultRef} />
            ) : null}

            <NewGameButton onClick={handleNewGame} />

            <p className="mt-3 font-serif text-sm italic text-smoke">
              Take turns. Three in a row cracks it.
            </p>
          </div>

          <div className="order-3 flex flex-col gap-3">
            <CaseLedger ledger={ledger} onReset={handleResetLedger} />
            <MoveLog moves={state.moves} />
            <HowToPlay />
          </div>
        </main>

        <footer className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 border-t border-manila/10 px-4 py-6 font-mono text-[9px] tracking-[0.14em] text-smoke sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
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
              CALFREDO
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
