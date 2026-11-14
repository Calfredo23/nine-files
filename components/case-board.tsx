"use client";

import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useRef, useState } from "react";
import {
  BOARD_SIZE,
  type Board,
  type Mark,
  type Move,
  type Outcome,
} from "@/lib/game";
import { EvidenceCell } from "@/components/evidence-cell";
import { YarnLine } from "@/components/yarn-line";
import { CaseStamp } from "@/components/case-stamp";
import { PaperBurst } from "@/components/paper-burst";
import { cn } from "@/lib/cn";

export function CaseBoard({
  board,
  turn,
  outcome,
  lastMove,
  round,
  onPlay,
}: {
  board: Board;
  turn: Mark;
  outcome: Outcome | null;
  lastMove: Move | null;
  round: number;
  onPlay: (index: number) => void;
}) {
  const [focusIndex, setFocusIndex] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const disabled = outcome !== null;

  const moveFocus = (index: number) => {
    setFocusIndex(index);
    refs.current[index]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    let next: number | null = null;

    if (event.key === "ArrowLeft") {
      next = row * 3 + Math.max(0, col - 1);
    } else if (event.key === "ArrowRight") {
      next = row * 3 + Math.min(2, col + 1);
    } else if (event.key === "ArrowUp") {
      next = Math.max(0, row - 1) * 3 + col;
    } else if (event.key === "ArrowDown") {
      next = Math.min(2, row + 1) * 3 + col;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = BOARD_SIZE - 1;
    }

    if (next !== null) {
      event.preventDefault();
      moveFocus(next);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--spot-x",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--spot-y",
      `${event.clientY - rect.top}px`,
    );
  };

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "case-frame",
          outcome?.kind === "win" && "case-shake",
        )}
      >
        <span className="bracket tl" aria-hidden="true" />
        <span className="bracket tr" aria-hidden="true" />
        <span className="bracket bl" aria-hidden="true" />
        <span className="bracket br" aria-hidden="true" />

        <div
          onPointerMove={handlePointerMove}
          className="cork relative overflow-hidden rounded-[2px] p-2 sm:p-3"
          style={
            {
              "--spot-x": "50%",
              "--spot-y": "40%",
            } as CSSProperties
          }
        >
          <span
            className="spotlight pointer-events-none absolute inset-0"
            aria-hidden="true"
          />

          <div
            role="grid"
            aria-label="Case board, three by three"
            aria-rowcount={3}
            aria-colcount={3}
            className="relative z-10 grid gap-2"
          >
            {[0, 1, 2].map((row) => (
              <div role="row" key={row} className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((col) => {
                  const index = row * 3 + col;
                  return (
                    <EvidenceCell
                      key={index}
                      index={index}
                      mark={board[index]}
                      turn={turn}
                      disabled={disabled}
                      isLast={lastMove?.index === index}
                      onPlay={onPlay}
                      onFocus={setFocusIndex}
                      onKeyDown={handleKeyDown}
                      tabIndex={focusIndex === index ? 0 : -1}
                      buttonRef={(node) => {
                        refs.current[index] = node;
                      }}
                    />
                  );
                })}
              </div>
            ))}

            {outcome?.kind === "win" ? <YarnLine line={outcome.line} /> : null}
          </div>

          {outcome ? (
            <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
              <CaseStamp outcome={outcome} />
            </div>
          ) : null}

          {outcome?.kind === "win" ? (
            <span
              key={`flash-${round}`}
              aria-hidden="true"
              className="flash pointer-events-none absolute inset-0 z-40"
            />
          ) : null}

          <PaperBurst trigger={outcome?.kind === "win" ? `win-${round}` : "none"} />
        </div>
      </div>
    </div>
  );
}

