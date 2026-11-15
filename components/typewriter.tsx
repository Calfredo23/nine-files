"use client";

import { cn } from "@/lib/cn";
import { useSpeechSfx } from "@/hooks/use-speech-sfx";

export function Typewriter({
  text,
  className,
  speaking = false,
}: {
  text: string;
  className?: string;
  speaking?: boolean;
}) {
  const tokens = text.split(/(\s+)/).filter((part) => part.length > 0);
  const wordCount = tokens.filter((part) => !/^\s+$/.test(part)).length;
  const cursorDelay = Math.max(0, wordCount - 1) * 52 + 420;

  useSpeechSfx(text, speaking);

  return (
    <span className={cn("subtitle", className)}>
      {tokens.map((token, position) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={`s-${position}`} className="whitespace-pre">
              {token}
            </span>
          );
        }
        const wordIndex = tokens
          .slice(0, position)
          .filter((part) => !/^\s+$/.test(part)).length;
        return (
          <span
            key={`w-${position}-${wordIndex}`}
            className="subtitle-word"
            style={{ animationDelay: `${wordIndex * 52}ms` }}
          >
            {token}
          </span>
        );
      })}
      {speaking ? (
        <span
          aria-hidden="true"
          className="subtitle-cursor"
          style={{ animationDelay: `${cursorDelay}ms` }}
        />
      ) : null}
    </span>
  );
}
