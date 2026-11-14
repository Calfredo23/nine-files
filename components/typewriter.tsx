import { cn } from "@/lib/cn";

export function Typewriter({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={cn("typewriter", className)}>
      <span key={text} className="typewriter-chars">
        {Array.from(text).map((char, index) => (
          <span
            key={`${index}-${char}`}
            className="type-char"
            style={{ animationDelay: `${index * 22}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
      <span className="type-cursor" aria-hidden="true">
        ▌
      </span>
    </span>
  );
}
