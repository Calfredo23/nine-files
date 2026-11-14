import { cn } from "@/lib/cn";

export function Pushpin({
  brass = false,
  idle = false,
  className,
}: {
  brass?: boolean;
  idle?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("pin", brass && "pin-brass", idle && "pin-idle", className)}
    />
  );
}
