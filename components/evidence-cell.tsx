"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { cellLabel, type Mark } from "@/lib/game";
import { PLAYERS } from "@/lib/players";
import { MarkO, MarkX } from "@/components/marks";
import { Pushpin } from "@/components/pushpin";

const TILTS = [-1.4, 0.9, -0.5, 1.2, -0.8, 0.6, -1.1, 0.4, -0.7];

export function EvidenceCell({
  index,
  mark,
  turn,
  disabled,
  isLast,
  onPlay,
  onFocus,
  onKeyDown,
  tabIndex,
  buttonRef,
}: {
  index: number;
  mark: Mark | null;
  turn: Mark;
  disabled: boolean;
  isLast: boolean;
  onPlay: (index: number) => void;
  onFocus: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  tabIndex: number;
  buttonRef: (node: HTMLButtonElement | null) => void;
}) {
  const label = cellLabel(index);
  const occupant = mark ? PLAYERS[mark].name : null;

  return (
    <button
      ref={buttonRef}
      type="button"
      role="gridcell"
      data-testid={`cell-${index}`}
      data-label={label}
      data-mark={mark ?? ""}
      aria-label={`${label}, ${occupant ? `claimed by ${occupant}` : "empty"}`}
      aria-disabled={disabled || mark !== null}
      tabIndex={tabIndex}
      onClick={() => onPlay(index)}
      onFocus={() => onFocus(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
      className="evidence-card"
      style={{ "--tilt": `${TILTS[index]}deg` } as CSSProperties}
    >
      <span className="absolute left-1.5 top-1 font-mono text-[9px] leading-none tracking-[0.18em] text-ink/70">
        {label}
      </span>

      <span className="absolute left-1/2 top-1 -translate-x-1/2">
        <Pushpin brass={mark === "O"} idle={mark === null} />
      </span>

      {mark ? (
        <span
          key={`${mark}-${index}`}
          className="mark-in absolute inset-[18%] flex items-center justify-center text-ink"
        >
          {mark === "X" ? <MarkX /> : <MarkO />}
        </span>
      ) : null}

      {!mark && !disabled ? (
        <span className="mark-ghost pointer-events-none absolute inset-[18%] flex items-center justify-center text-ink">
          {turn === "X" ? <MarkX /> : <MarkO />}
        </span>
      ) : null}

      {isLast ? (
        <span
          className="absolute inset-x-3 bottom-1.5 h-px bg-tungsten/50"
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}

