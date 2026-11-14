"use client";

import type { CoachGrade } from "@/lib/coach";
import { Typewriter } from "@/components/typewriter";
import { cn } from "@/lib/cn";

export type CoachMessage = {
  readonly text: string;
  readonly grade: CoachGrade;
  readonly id: number;
};

const GRADE_DOT: Record<CoachGrade, string> = {
  start: "bg-ink/40",
  best: "bg-brass",
  good: "bg-[#5C6B4A]",
  inaccuracy: "bg-[#A35A2A]",
  mistake: "bg-[#A3402A]",
  blunder: "bg-oxblood",
  win: "bg-brass",
  draw: "bg-[#5C6673]",
};

export function CoachBubble({ message }: { message: CoachMessage }) {
  return (
    <div className="relative min-w-0 flex-1">
      <div
        key={message.id}
        className={cn(
          "coach-bubble coach-pop relative border border-ink/15 bg-manila text-ink",
          "p-2.5 lg:p-3",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[8px] tracking-[0.18em] text-ink/60">
            CASE NOTE
          </p>
          <span
            data-testid="coach-grade"
            className="flex items-center gap-1 font-mono text-[7px] tracking-[0.12em] text-ink/70"
          >
            <span
              aria-hidden="true"
              className={cn("h-1.5 w-1.5 rounded-full", GRADE_DOT[message.grade])}
            />
            {message.grade.toUpperCase()}
          </span>
        </div>
        <p
          data-testid="coach"
          className={cn(
            "mt-1.5 font-serif leading-snug",
            "text-[12px] lg:text-[13px]",
          )}
          aria-live="polite"
        >
          <Typewriter text={message.text} />
        </p>
      </div>
      <span className="coach-tail" aria-hidden="true" />
    </div>
  );
}

