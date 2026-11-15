"use client";

import { Captain } from "@/components/captain";
import { CoachBubble, type CoachMessage } from "@/components/coach-bubble";

export function CaptainCard({
  message,
  speaking,
}: {
  message: CoachMessage;
  speaking: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <div className="w-[72px] shrink-0 overflow-hidden rounded-sm border border-manila/25 bg-ink/60 sm:w-[88px] lg:w-[104px]">
        <Captain speaking={speaking} />
        <div className="border-t border-manila/15 px-1 py-1 text-center">
          <p className="font-display text-[8px] font-semibold tracking-[0.1em] text-paper sm:text-[9px] lg:text-[10px]">
            CAPT. HALE
          </p>
          <p className="font-mono text-[6px] tracking-[0.12em] text-smoke sm:text-[7px]">
            SUPERVISOR
          </p>
        </div>
      </div>
      <CoachBubble message={message} speaking={speaking} />
    </div>
  );
}
