"use client";

import { useEffect, useRef, useState } from "react";
import { Captain } from "@/components/captain";
import { MarkO, MarkX } from "@/components/marks";
import { useDialog } from "@/hooks/use-dialog";
import { useSpeechSfx } from "@/hooks/use-speech-sfx";
import { cleanName } from "@/lib/detective";
import type { Mark } from "@/lib/game";
import type { GameMode, GameSettings } from "@/lib/settings";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/cn";

export type SetupMode = "setup" | "edit";

const SINGLE_PLAYER_STEPS = 4;
const TWO_PLAYER_STEPS = 5;

function stepTitle(
  mode: SetupMode,
  step: number,
  fullscreenStep: boolean,
  choice: GameMode,
): string {
  if (mode === "edit") {
    return "DETECTIVE NAME";
  }
  if (fullscreenStep) {
    return "FULL SCREEN";
  }
  if (step === 1) {
    return "YOUR NAME";
  }
  if (step === 2) {
    return "GAME MODE";
  }
  if (step === 3) {
    return choice === "two" ? "PLAYER TWO" : "YOUR SIDE";
  }
  return "COIN TOSS";
}

export function SetupDialog({
  open,
  mode,
  initialName,
  initialSettings,
  onSave,
  onCancel,
}: {
  open: boolean;
  mode: SetupMode;
  initialName: string;
  initialSettings: GameSettings;
  onSave: (name: string, settings: GameSettings) => void;
  onCancel: () => void;
}) {
  const dialogRef = useDialog(open);
  const saved = useRef(false);
  const tossTimer = useRef<number | null>(null);
  const [step, setStep] = useState(mode === "edit" ? 1 : 0);
  const [name, setName] = useState(initialName);
  const [playerTwoName, setPlayerTwoName] = useState(
    initialSettings.playerTwoName ?? "",
  );
  const [choice, setChoice] = useState<GameMode>(initialSettings.mode);
  const [side, setSide] = useState<Mark>(initialSettings.userMark);
  const [tossing, setTossing] = useState(false);
  const [tossed, setTossed] = useState(false);

  const fullscreenStep = mode === "setup" && step === 0;
  const modeStep = mode === "setup" && step === 2;
  const sideStep = mode === "setup" && choice === "single" && step === 3;
  const playerTwoNameStep =
    mode === "setup" && choice === "two" && step === 3;
  const twoPlayerCoinStep =
    mode === "setup" && choice === "two" && step === 4;
  const totalSteps =
    choice === "two" ? TWO_PLAYER_STEPS : SINGLE_PLAYER_STEPS;
  const playerOneDisplayName =
    cleanName(name) ||
    (choice === "two" ? "Secret Detective 1" : "Secret Detective");
  const playerTwoDisplayName = cleanName(playerTwoName) || "Secret Detective 2";

  useSpeechSfx(
    fullscreenStep
      ? "The case wall is built for a full screen. Press F11 for the best view."
      : modeStep
        ? "One detective against the House, or two players at the table?"
        : playerTwoNameStep
          ? "What should I call player two?"
          : twoPlayerCoinStep
            ? "The coin decides who gets X and the first move."
        : sideStep
          ? "X or O, detective. Pick a side, or toss for it."
          : "What should I call you, detective?",
    open,
  );

  useEffect(() => {
    return () => {
      if (tossTimer.current) {
        window.clearTimeout(tossTimer.current);
      }
    };
  }, []);

  const save = () => {
    if (saved.current) {
      return;
    }
    saved.current = true;
    const finalSettings: GameSettings =
      mode === "edit"
        ? initialSettings
        : choice === "single"
          ? { ...initialSettings, mode: "single", userMark: side }
          : {
              ...initialSettings,
              mode: "two",
              userMark: side,
              playerTwoName: cleanName(playerTwoName),
            };
    onSave(cleanName(name), finalSettings);
  };

  const close = () => {
    if (mode === "edit") {
      onCancel();
      return;
    }
    save();
  };

  const primary = () => {
    if (mode === "edit" || sideStep) {
      save();
      return;
    }
    if (twoPlayerCoinStep) {
      if (tossed) {
        save();
      }
      return;
    }
    if (step === 3 && choice === "two") {
      setStep(4);
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toss = () => {
    if (tossing) {
      return;
    }
    const result: Mark = Math.random() < 0.5 ? "X" : "O";
    setTossing(true);
    setTossed(false);
    sound.play("coin");
    if (tossTimer.current) {
      window.clearTimeout(tossTimer.current);
    }
    tossTimer.current = window.setTimeout(() => {
      setSide(result);
      setTossed(true);
      setTossing(false);
      sound.play("pin");
      tossTimer.current = null;
    }, 900);
  };

  const requestFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // F11 is the fallback.
    }
  };

  const primaryLabel =
    mode === "edit"
      ? "SAVE NAME"
      : fullscreenStep
        ? "NEXT"
        : sideStep || twoPlayerCoinStep
          ? "START THE CASE"
          : "NEXT";

  return (
    <dialog
      ref={dialogRef}
      data-testid="setup-dialog"
      aria-labelledby="setup-title"
      className="case-dialog"
      onClose={close}
      onCancel={(event) => {
        if (mode === "setup") {
          event.preventDefault();
          back();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          if (mode === "edit") {
            close();
          } else {
            back();
          }
        }
      }}
    >
      <div className="case-dialog-panel relative max-h-[90dvh] overflow-y-auto border border-manila/20 bg-coal p-4 text-paper shadow-[0_50px_90px_-40px_rgba(0,0,0,.95)] sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-manila/15 pb-2">
          <div>
            <p className="font-mono text-[9px] tracking-[0.24em] text-smoke">
              {mode === "edit" ? "CASE LEAD" : "BEFORE YOU START"}
            </p>
            <h2
              id="setup-title"
              className="mt-0.5 font-display text-lg font-semibold tracking-[0.14em] text-paper sm:text-xl"
            >
              {stepTitle(mode, step, fullscreenStep, choice)}
            </h2>
          </div>
          <p className="font-mono text-[9px] tracking-[0.2em] text-smoke">
            {mode === "edit"
              ? "NAME"
              : `${String(step + 1).padStart(2, "0")} / ${String(totalSteps).padStart(2, "0")}`}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-3">
          <div className="w-[76px] shrink-0 overflow-hidden rounded-sm border border-manila/25 bg-ink/70 sm:w-[112px]">
            <Captain speaking />
            <div className="border-t border-manila/15 px-1 py-1 text-center">
              <p className="font-display text-[8px] font-semibold tracking-[0.1em] text-paper sm:text-[10px]">
                CAPT. HALE
              </p>
              <p className="font-mono text-[6px] tracking-[0.12em] text-smoke sm:text-[7px]">
                SUPERVISOR
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1 bg-manila p-4 text-ink">
            <p className="font-mono text-[8px] tracking-[0.18em] text-ink/60">
              CAPT. HALE
            </p>

            {fullscreenStep ? (
              <div className="mt-2 font-serif text-[15px] leading-relaxed sm:text-base">
                <p>
                  The case wall is built for a full screen. Press{" "}
                  <kbd className="rounded border border-ink/30 bg-ink/10 px-1.5 py-0.5 font-mono text-[11px]">
                    F11
                  </kbd>{" "}
                  (Windows) or{" "}
                  <kbd className="rounded border border-ink/30 bg-ink/10 px-1 py-0.5 font-mono text-[10px]">
                    Ctrl
                  </kbd>
                  {" + "}
                  <kbd className="rounded border border-ink/30 bg-ink/10 px-1 py-0.5 font-mono text-[10px]">
                    Cmd
                  </kbd>
                  {" + "}
                  <kbd className="rounded border border-ink/30 bg-ink/10 px-1 py-0.5 font-mono text-[10px]">
                    F
                  </kbd>{" "}
                  (Mac) for the best view. You can start without it.
                </p>
              </div>
            ) : modeStep ? (
              <div className="mt-2">
                <p className="font-serif text-[15px] leading-relaxed sm:text-base">
                  How is the case staffed tonight?
                </p>
                <div
                  role="radiogroup"
                  aria-label="Game mode"
                  className="mt-3 grid gap-2"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={choice === "two"}
                    data-testid="setup-mode-two"
                    onClick={() => setChoice("two")}
                    className={cn(
                      "min-h-11 border px-3 py-2 text-left transition",
                      choice === "two"
                        ? "border-oxblood bg-oxblood/10"
                        : "border-ink/25 bg-paper/40 hover:border-ink/50",
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-sm font-semibold tracking-[0.14em]">
                        TWO PLAYERS
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.16em] text-ink/55">
                        {choice === "two" ? "SELECTED" : "SELECT"}
                      </span>
                    </span>
                    <span className="mt-0.5 block font-serif text-[12px] leading-snug text-ink/70">
                      Name both players. The toss assigns X and the first move.
                    </span>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={choice === "single"}
                    data-testid="setup-mode-single"
                    onClick={() => setChoice("single")}
                    className={cn(
                      "min-h-11 border px-3 py-2 text-left transition",
                      choice === "single"
                        ? "border-oxblood bg-oxblood/10"
                        : "border-ink/25 bg-paper/40 hover:border-ink/50",
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-sm font-semibold tracking-[0.14em]">
                        SINGLE PLAYER
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.16em] text-ink/55">
                        {choice === "single" ? "SELECTED" : "SELECT"}
                      </span>
                    </span>
                    <span className="mt-0.5 block font-serif text-[12px] leading-snug text-ink/70">
                      You against the House. Pick a side, or toss for it.
                    </span>
                  </button>
                </div>
              </div>
            ) : twoPlayerCoinStep ? (
              <div className="mt-2">
                <p className="font-serif text-[15px] leading-relaxed sm:text-base">
                  One toss decides who gets X and the first move.
                </p>

                <div className="mt-3 flex items-center gap-3 border border-ink/20 bg-paper/50 p-2">
                  <div className="coin-stage shrink-0" aria-hidden="true">
                    <span className={cn("coin-token", tossing && "coin-toss")}>
                      {tossing ? "?" : tossed ? (side === "X" ? "1" : "2") : "?"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      data-testid="coin-result"
                      aria-live="polite"
                      className="font-serif text-[13px] leading-snug text-ink"
                    >
                      {tossing
                        ? "The coin is in the air."
                        : tossed
                          ? side === "X"
                            ? `${playerOneDisplayName} gets X and opens. ${playerTwoDisplayName} takes O.`
                            : `${playerTwoDisplayName} gets X and opens. ${playerOneDisplayName} takes O.`
                          : "Toss to decide who opens as X."}
                    </p>
                    <button
                      type="button"
                      data-testid="setup-toss"
                      onClick={toss}
                      disabled={tossing}
                      className="mt-1 min-h-9 border border-ink/30 px-2 py-1 font-mono text-[9px] tracking-[0.16em] text-ink transition hover:border-oxblood hover:text-oxblood disabled:opacity-60"
                    >
                      {tossing
                        ? "TOSSING…"
                        : tossed
                          ? "TOSS AGAIN"
                          : "TOSS THE COIN"}
                    </button>
                  </div>
                </div>

                <p className="mt-2 font-serif text-[11px] leading-snug text-ink/65">
                  X always opens; the coin decides which player gets it.
                </p>
              </div>
            ) : sideStep ? (
              <div className="mt-2">
                <p className="font-serif text-[15px] leading-relaxed sm:text-base">
                  X opens the case. Take it, take O, or let the coin decide.
                </p>

                <div
                  role="radiogroup"
                  aria-label="Your side"
                  className="mt-3 grid grid-cols-2 gap-2"
                >
                  {(["X", "O"] as const).map((mark) => (
                    <button
                      key={mark}
                      type="button"
                      role="radio"
                      aria-checked={!tossing && side === mark}
                      data-testid={`setup-side-${mark}`}
                      disabled={tossing}
                      onClick={() => {
                        setSide(mark);
                        setTossed(false);
                      }}
                      className={cn(
                        "min-h-11 border p-2 text-center transition disabled:opacity-60",
                        !tossing && side === mark
                          ? "border-oxblood bg-oxblood/10"
                          : "border-ink/25 bg-paper/40 hover:border-ink/50",
                      )}
                    >
                      <span className="mx-auto block h-8 w-8 text-ink">
                        {mark === "X" ? <MarkX /> : <MarkO />}
                      </span>
                      <span className="mt-1 block font-display text-xs font-semibold tracking-[0.16em]">
                        PLAY {mark}
                      </span>
                      <span className="block font-mono text-[8px] tracking-[0.12em] text-ink/55">
                        {mark === "X" ? "FIRST MOVE" : "SECOND MOVE"}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3 border border-ink/20 bg-paper/50 p-2">
                  <div className="coin-stage shrink-0" aria-hidden="true">
                    <span
                      className={cn(
                        "coin-token",
                        tossing && "coin-toss",
                      )}
                    >
                      {tossing ? "?" : side}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      data-testid="coin-result"
                      aria-live="polite"
                      className="font-serif text-[13px] leading-snug text-ink"
                    >
                      {tossing
                        ? "The coin is in the air."
                        : tossed
                          ? `The coin lands on ${side}. You play ${side}.`
                          : "The House takes the other side."}
                    </p>
                    <button
                      type="button"
                      data-testid="setup-toss"
                      onClick={toss}
                      disabled={tossing}
                      className="mt-1 min-h-9 border border-ink/30 px-2 py-1 font-mono text-[9px] tracking-[0.16em] text-ink transition hover:border-oxblood hover:text-oxblood disabled:opacity-60"
                    >
                      {tossing ? "TOSSING…" : "TOSS A COIN"}
                    </button>
                  </div>
                </div>

                <p className="mt-2 font-serif text-[11px] leading-snug text-ink/65">
                  {side === "X"
                    ? "You move first. The House answers as O."
                    : "The House opens as X. You answer as O."}
                </p>
              </div>
            ) : (
              <form
                className="mt-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  primary();
                }}
              >
                <label
                  htmlFor={playerTwoNameStep ? "player-two-name" : "detective-name"}
                  className="font-serif text-[15px] leading-relaxed sm:text-base"
                >
                  {playerTwoNameStep
                    ? "What should I call player two?"
                    : "What should I call you, detective?"}
                </label>
                <input
                  id={playerTwoNameStep ? "player-two-name" : "detective-name"}
                  data-testid={
                    playerTwoNameStep ? "player-two-name" : "detective-name"
                  }
                  value={playerTwoNameStep ? playerTwoName : name}
                  onChange={(event) =>
                    playerTwoNameStep
                      ? setPlayerTwoName(event.target.value)
                      : setName(event.target.value)
                  }
                  maxLength={18}
                  autoFocus
                  autoComplete="off"
                  placeholder={
                    playerTwoNameStep ? "Player two's name" : "Your name"
                  }
                  className="mt-2 w-full border border-ink/25 bg-paper px-3 py-2 font-serif text-base text-ink outline-none placeholder:text-ink/35 focus:border-oxblood"
                  aria-describedby={
                    playerTwoNameStep ? "player-two-name-hint" : "detective-name-hint"
                  }
                />
                <p
                  id={
                    playerTwoNameStep ? "player-two-name-hint" : "detective-name-hint"
                  }
                  className="mt-2 font-serif text-[12px] leading-snug text-ink/70"
                >
                  {playerTwoNameStep
                    ? "Leave this blank for Secret Detective 2. The coin toss decides who gets X."
                    : "Leave this blank for Secret Detective. In two-player mode it becomes Secret Detective 1."}
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-manila/15 pt-3">
          <div className="flex items-center gap-2">
            {mode === "edit" ? (
              <button
                type="button"
                data-testid="setup-cancel"
                onClick={onCancel}
                className="min-h-11 border border-manila/25 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-smoke transition hover:border-manila/50 hover:text-paper"
              >
                CANCEL
              </button>
            ) : fullscreenStep ? (
              <button
                type="button"
                data-testid="setup-fullscreen"
                onClick={requestFullScreen}
                className="min-h-11 border border-manila/25 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-smoke transition hover:border-manila/50 hover:text-paper"
              >
                GO FULL SCREEN
              </button>
            ) : (
              <button
                type="button"
                data-testid="setup-back"
                onClick={back}
                className="min-h-11 border border-manila/25 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-smoke transition hover:border-manila/50 hover:text-paper"
              >
                BACK
              </button>
            )}
          </div>

          <button
            type="button"
            data-testid={
              mode !== "edit" &&
              (fullscreenStep || step === 1 || modeStep || playerTwoNameStep)
                ? "setup-next"
                : "setup-start"
            }
            onClick={primary}
            disabled={twoPlayerCoinStep && !tossed}
            className="min-h-11 border border-oxblood/70 bg-oxblood px-4 py-2 font-display text-xs font-semibold tracking-[0.16em] text-paper transition hover:bg-[#a13540] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
