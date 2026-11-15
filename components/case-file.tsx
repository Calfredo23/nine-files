"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  gameReducer,
  getOutcome,
  INITIAL_GAME,
  otherMark,
  place,
  type GameState,
  type Mark,
  type Outcome,
} from "@/lib/game";
import {
  coachForMove,
  postMatchLine,
  resetScoresLine,
  startLine,
  welcomeLine,
} from "@/lib/coach";
import {
  cleanName,
  loadIntroSeen,
  loadSetupSeen,
  saveIntroSeen,
  saveSetupSeen,
} from "@/lib/detective";
import { makeMatchId } from "@/lib/history";
import { chooseBotMove } from "@/lib/bot";
import { playerFor } from "@/lib/players";
import type { GameSettings } from "@/lib/settings";
import { useCoach } from "@/hooks/use-coach";
import { useDetectiveName } from "@/hooks/use-detective-name";
import { useGameSettings } from "@/hooks/use-game-settings";
import { useHistory } from "@/hooks/use-history";
import { useLedger } from "@/hooks/use-ledger";
import { useMusicPreference } from "@/hooks/use-music-preference";
import { useSoundPreference } from "@/hooks/use-sound-preference";
import { writeDetectiveName, writeSettings } from "@/lib/client-store";
import { sound } from "@/lib/sound";
import { Ambient } from "@/components/ambient";
import { CaptainCard } from "@/components/captain-card";
import { CaseBoard } from "@/components/case-board";
import { CaseActionButton } from "@/components/case-action-button";
import { CaseLedger } from "@/components/case-ledger";
import { DetectiveCard, type DetectiveStatus } from "@/components/detective-card";
import { HowToPlay } from "@/components/how-to-play";
import { IntroDialog } from "@/components/intro-dialog";
import { MatchHistoryDialog } from "@/components/match-history-dialog";
import { MoveLog } from "@/components/move-log";
import { MusicToggle } from "@/components/music-toggle";
import { NewGameButton } from "@/components/new-game-button";
import { PostMatchDialog } from "@/components/post-match-dialog";
import { SetupDialog, type SetupMode } from "@/components/setup-dialog";
import { SoundToggle } from "@/components/sound-toggle";
import { TurnBanner } from "@/components/turn-banner";

function statusFor(
  mark: Mark,
  state: GameState,
  botMark: Mark | null,
): DetectiveStatus {
  if (state.outcome?.kind === "win") {
    return state.outcome.mark === mark ? "WINNER" : "OUT";
  }
  if (state.outcome?.kind === "draw") {
    return "DRAW";
  }
  if (state.turn === mark) {
    return mark === botMark ? "THINKING" : "TURN";
  }
  return "WAITING";
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
  const { matches, add: addMatch, clear: clearHistory } = useHistory();
  const { on: soundOn, toggle: toggleSound } = useSoundPreference();
  const { on: musicOn, toggle: toggleMusic } = useMusicPreference();
  const coach = useCoach();
  const coachSay = coach.say;
  const detectiveName = useDetectiveName();
  const settings = useGameSettings();
  const resultRef = useRef<HTMLHeadingElement | null>(null);
  const postMatchTimer = useRef<number | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [postMatch, setPostMatch] = useState<Outcome | null>(null);
  const [setupSeen, setSetupSeen] = useState(() => loadSetupSeen());
  const [restartPending, setRestartPending] = useState(false);
  const [introOpen, setIntroOpen] = useState(() => !loadIntroSeen());
  const [setupOpen, setSetupOpen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return loadIntroSeen() && !loadSetupSeen();
  });
  const [setupMode, setSetupMode] = useState<SetupMode>("setup");
  const [setupKey, setSetupKey] = useState(0);

  const isSingle = settings.mode === "single";
  const botMark: Mark | null = isSingle ? otherMark(settings.userMark) : null;
  const isBotTurn =
    botMark !== null && state.outcome === null && state.turn === botMark;

  const openSetup = (mode: SetupMode) => {
    setSetupMode(mode);
    setSetupKey((current) => current + 1);
    setSetupOpen(true);
  };

  const cancelPostMatch = useCallback(() => {
    if (postMatchTimer.current) {
      window.clearTimeout(postMatchTimer.current);
      postMatchTimer.current = null;
    }
  }, []);

  const closeIntro = () => {
    saveIntroSeen();
    setIntroOpen(false);
    if (restartPending) {
      setRestartPending(false);
      openSetup("setup");
    } else if (!setupSeen) {
      openSetup("setup");
    }
  };

  const handleSaveSetup = (value: string, nextSettings: GameSettings) => {
    const name = cleanName(value) || "Detective";
    writeDetectiveName(name);
    writeSettings(nextSettings);
    saveSetupSeen();
    setSetupSeen(true);
    setSetupOpen(false);
    setRestartPending(false);

    if (setupMode === "setup") {
      cancelPostMatch();
      setPostMatch(null);
      dispatch({ type: "reset" });
      coachSay(welcomeLine(name, nextSettings));
      sound.play("paper");
      return;
    }

    coachSay({ grade: "start", text: `Name updated. ${name} is on the file.` });
  };

  useEffect(() => {
    return () => {
      if (postMatchTimer.current) {
        window.clearTimeout(postMatchTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    sound.setMuted(!soundOn);
  }, [soundOn]);

  useEffect(() => {
    if (!state.outcome) {
      return;
    }
    resultRef.current?.focus({ preventScroll: true });
  }, [state.outcome]);

  const handlePlay = useCallback(
    (index: number, fromBot = false) => {
      if (state.outcome || state.board[index] !== null) {
        return;
      }

      const botTurn = botMark !== null && state.turn === botMark;
      if (botTurn !== fromBot) {
        return;
      }

      const nextBoard = place(state.board, index, state.turn);
      const outcome = getOutcome(nextBoard);
      coachSay(
        coachForMove(
          state.board,
          index,
          state.turn,
          state.moves.length + state.round * 7 + index,
          settings,
          detectiveName,
        ),
      );
      dispatch({ type: "move", index });

      if (outcome) {
        record(outcome);
        addMatch({
          id: makeMatchId(),
          winner: outcome.kind === "win" ? outcome.mark : "draw",
          winnerName:
            outcome.kind === "win"
              ? playerFor(outcome.mark, settings, detectiveName).short
              : undefined,
          moves: [...state.moves, { index, mark: state.turn }],
          finishedAt: Date.now(),
          round: state.round,
        });
        sound.play("stamp");
        cancelPostMatch();
        postMatchTimer.current = window.setTimeout(() => {
          coachSay(postMatchLine(outcome, settings, detectiveName));
          setPostMatch(outcome);
          postMatchTimer.current = null;
        }, 1600);
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
    },
    [
      state,
      botMark,
      settings,
      detectiveName,
      coachSay,
      record,
      addMatch,
      cancelPostMatch,
    ],
  );

  useEffect(() => {
    if (!isBotTurn || botMark === null) {
      return;
    }
    const timer = window.setTimeout(() => {
      const index = chooseBotMove(state.board, botMark);
      if (index !== null) {
        handlePlay(index, true);
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [isBotTurn, botMark, state.board, handlePlay]);

  const handleRematch = () => {
    cancelPostMatch();
    setPostMatch(null);
    dispatch({ type: "reset" });
    coachSay(startLine(state.round + 1, settings));
    sound.play("paper");
  };

  const handleRestart = () => {
    cancelPostMatch();
    setPostMatch(null);
    dispatch({ type: "reset" });
    setRestartPending(true);
    setIntroOpen(true);
    sound.play("paper");
  };

  const handleResetLedger = () => {
    cancelPostMatch();
    resetLedger();
    clearHistory();
    coachSay(resetScoresLine());
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
            <MusicToggle on={musicOn} onToggle={toggleMusic} />
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
              status={statusFor("X", state, botMark)}
            />
            <DetectiveCard
              mark="O"
              active={isHighlighted("O", state)}
              status={statusFor("O", state, botMark)}
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
                  locked={isBotTurn}
                  onPlay={handlePlay}
                />
              </div>

              <div className="mt-2 lg:hidden">
                <NewGameButton
                  onClick={handleRestart}
                  testId="new-game-mobile"
                  block
                />
              </div>
            </div>
          </section>

          <aside
            aria-label="Case controls and scores"
            className="order-4 flex min-h-0 flex-col gap-2 lg:col-start-3 lg:row-span-2 lg:row-start-1"
          >
            <div className="border border-manila/15 bg-coal/60 p-3">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-sm font-semibold tracking-[0.18em] text-paper">
                  CASE CONTROL
                </h2>
                <p className="font-mono text-[9px] tracking-[0.14em] text-smoke">
                  {String(matches.length).padStart(2, "0")} SAVED
                </p>
              </div>
              <p
                data-testid="mode-label"
                className="mt-1 font-mono text-[9px] tracking-[0.16em] text-tungsten/80"
              >
                {isSingle
                  ? `SINGLE · YOU ${settings.userMark}`
                  : "TWO PLAYERS · LOCAL"}
              </p>
              <div className="mt-2 hidden lg:block">
                <NewGameButton onClick={handleRestart} block />
              </div>
              <div
                role="group"
                aria-label="Case tools"
                className="mt-2 grid grid-cols-3 gap-1.5"
              >
                <CaseActionButton
                  icon="briefing"
                  label="BRIEFING"
                  testId="open-briefing"
                  onClick={() => setIntroOpen(true)}
                />
                <CaseActionButton
                  icon="history"
                  label="MATCH HISTORY"
                  testId="open-history"
                  onClick={() => setHistoryOpen(true)}
                />
                <CaseActionButton
                  icon="identity"
                  label="EDIT NAME"
                  testId="open-setup"
                  onClick={() => openSetup("edit")}
                />
              </div>
            </div>

            <CaseLedger ledger={ledger} onReset={handleResetLedger} />
            <MoveLog moves={state.moves} />
            <HowToPlay />
          </aside>
        </main>

        <footer className="mx-auto flex w-full max-w-[1320px] shrink-0 flex-col gap-1 border-t border-manila/10 px-4 py-2 font-mono text-[9px] tracking-[0.14em] text-smoke sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <span>NEXT.JS 16 · REACT 19 · TAILWIND 4</span>
            <span>VERCEL ANALYTICS · AGGREGATED · NO COOKIES</span>
          </p>
          <p className="flex gap-5">
            <a
              href="https://github.com/Calfredo23/the-nine-files"
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

      <IntroDialog open={introOpen} onClose={closeIntro} />
      {postMatch ? (
        <PostMatchDialog
          outcome={postMatch}
          onContinue={handleRematch}
          onStay={() => setPostMatch(null)}
          onReset={handleResetLedger}
        />
      ) : null}
      <SetupDialog
        key={setupKey}
        open={setupOpen}
        mode={setupMode}
        initialName={detectiveName}
        initialSettings={settings}
        onSave={handleSaveSetup}
        onCancel={() => setSetupOpen(false)}
      />
      <MatchHistoryDialog
        open={historyOpen}
        matches={matches}
        onClose={() => setHistoryOpen(false)}
        onClear={clearHistory}
      />
    </div>
  );
}
