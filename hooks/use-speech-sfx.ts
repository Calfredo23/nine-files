"use client";

import { useEffect } from "react";
import { sound } from "@/lib/sound";

export function useSpeechSfx(text: string, active: boolean) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const count = Math.min(words, 26);
    const timers = Array.from({ length: count }, (_, index) =>
      window.setTimeout(() => sound.play("voice"), index * 52 + 40),
    );

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [text, active]);
}
