"use client";

export function MusicToggle({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      data-testid="music-toggle"
      aria-pressed={on}
      aria-label={on ? "Mute music — MUSIC on" : "Play music — MUSIC off"}
      onClick={onToggle}
      className="inline-flex min-h-11 items-center gap-2 border border-manila/20 px-3 py-2 font-mono text-[9px] tracking-[0.16em] text-smoke transition hover:border-tungsten/50 hover:text-paper"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18V5l11-2v11" />
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="17.5" cy="16" r="2.5" />
        {on ? null : <path d="m3 3 18 18" />}
      </svg>
      MUSIC {on ? "ON" : "OFF"}
    </button>
  );
}
