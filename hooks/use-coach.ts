"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { startLine, type CoachLine } from "@/lib/coach";

export type CoachMessage = CoachLine & { readonly id: number };

export function useCoach() {
  const counter = useRef(0);
  const timer = useRef<number | null>(null);
  const [message, setMessage] = useState<CoachMessage>(() => ({
    ...startLine(),
    id: 0,
  }));
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  const say = useCallback((line: CoachLine) => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    counter.current += 1;
    setMessage({ ...line, id: counter.current });
    setSpeaking(true);
    timer.current = window.setTimeout(
      () => setSpeaking(false),
      Math.min(4600, line.text.length * 26 + 1200),
    );
  }, []);

  return { message, speaking, say };
}
