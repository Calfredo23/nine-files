"use client";

export function SoundToggle({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      data-testid="sound-toggle"
      aria-pressed={on}
      aria-label={on ? "Mute sound — SFX on" : "Enable sound — SFX off"}
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
        <path d="M4 9v6h4l5 4V5L8 9H4Z" />
        {on ? (
          <>
            <path d="M16 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 6a8.5 8.5 0 0 1 0 12" opacity=".5" />
          </>
        ) : (
          <path d="m17 9 5 6M22 9l-5 6" />
        )}
      </svg>
      SFX {on ? "ON" : "OFF"}
    </button>
  );
}
