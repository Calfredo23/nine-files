import { cn } from "@/lib/cn";

export function Typewriter({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const duration = Math.min(1800, Math.max(600, text.length * 24));

  return (
    <span
      className={cn("bubble-reveal", className)}
      style={{ animationDuration: `${duration}ms` }}
    >
      {text}
    </span>
  );
}
