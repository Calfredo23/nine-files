"use client";

import { useRef, useState } from "react";
import { Captain } from "@/components/captain";
import { useDialog } from "@/hooks/use-dialog";
import { cleanName } from "@/lib/detective";

export type SetupMode = "setup" | "edit";

export function SetupDialog({
  open,
  mode,
  initialName,
  onSave,
  onCancel,
}: {
  open: boolean;
  mode: SetupMode;
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const dialogRef = useDialog(open);
  const saved = useRef(false);
  const [step, setStep] = useState(mode === "edit" ? 1 : 0);
  const [name, setName] = useState(initialName);

  const fullscreenStep = mode === "setup" && step === 0;

  const save = () => {
    if (saved.current) {
      return;
    }
    saved.current = true;
    onSave(cleanName(name) || "Detective");
  };

  const close = () => {
    if (mode === "edit") {
      onCancel();
      return;
    }
    save();
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

  return (
    <dialog
      ref={dialogRef}
      data-testid="setup-dialog"
      aria-labelledby="setup-title"
      className="case-dialog"
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          close();
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
              {fullscreenStep
                ? "FULL SCREEN"
                : mode === "edit"
                  ? "DETECTIVE NAME"
                  : "YOUR NAME"}
            </h2>
          </div>
          <p className="font-mono text-[9px] tracking-[0.2em] text-smoke">
            {mode === "edit" ? "NAME" : fullscreenStep ? "01 / 02" : "02 / 02"}
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
            ) : (
              <form
                className="mt-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  save();
                }}
              >
                <label
                  htmlFor="detective-name"
                  className="font-serif text-[15px] leading-relaxed sm:text-base"
                >
                  What should I call you, detective?
                </label>
                <input
                  id="detective-name"
                  data-testid="detective-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={18}
                  autoFocus
                  autoComplete="off"
                  placeholder="Your name"
                  className="mt-2 w-full border border-ink/25 bg-paper px-3 py-2 font-serif text-base text-ink outline-none placeholder:text-ink/35 focus:border-oxblood"
                  aria-describedby="detective-name-hint"
                />
                <p
                  id="detective-name-hint"
                  className="mt-2 font-serif text-[12px] leading-snug text-ink/70"
                >
                  X is your side. O&apos;Rourke takes the other. The captain will
                  use this name.
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
                onClick={() => setStep(0)}
                className="min-h-11 border border-manila/25 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-smoke transition hover:border-manila/50 hover:text-paper"
              >
                BACK
              </button>
            )}
          </div>

          <button
            type="button"
            data-testid={fullscreenStep ? "setup-next" : "setup-start"}
            onClick={() => {
              if (fullscreenStep) {
                setStep(1);
              } else {
                save();
              }
            }}
            className="min-h-11 border border-oxblood/70 bg-oxblood px-4 py-2 font-display text-xs font-semibold tracking-[0.16em] text-paper transition hover:bg-[#a13540] active:translate-y-px"
          >
            {fullscreenStep
              ? "NEXT"
              : mode === "edit"
                ? "SAVE NAME"
                : "START THE CASE"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
