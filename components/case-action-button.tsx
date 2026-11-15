"use client";

export type CaseActionIcon = "briefing" | "history" | "identity";

function CaseActionGlyph({ kind }: { kind: CaseActionIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="h-4 w-4"
    >
      {kind === "briefing" ? (
        <>
          <path d="M7 3.5h7l4 4v13H7z" />
          <path d="M14 3.5v4h4M9.5 12h6M9.5 15.5h6" />
        </>
      ) : null}
      {kind === "history" ? (
        <>
          <circle cx="12" cy="12" r="8.25" />
          <path d="M12 7v5l3.25 2" />
        </>
      ) : null}
      {kind === "identity" ? (
        <>
          <rect x="4" y="4.5" width="16" height="15" rx="1.5" />
          <circle cx="9.5" cy="10" r="2.1" />
          <path d="M6.8 16c.7-1.4 1.6-2 2.7-2s2 .6 2.7 2M14.5 9h3M14.5 12h3M14.5 15h2" />
        </>
      ) : null}
    </svg>
  );
}

export function CaseActionButton({
  icon,
  label,
  testId,
  onClick,
}: {
  icon: CaseActionIcon;
  label: string;
  testId: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-haspopup="dialog"
      onClick={onClick}
      className="group flex min-h-14 min-w-0 flex-col items-center justify-center gap-1.5 border border-manila/15 bg-ink/35 px-1.5 py-1.5 text-smoke transition-colors hover:border-tungsten/45 hover:bg-ink/70 hover:text-paper active:translate-y-px focus-visible:z-10"
    >
      <span className="text-manila/75 transition-colors group-hover:text-tungsten">
        <CaseActionGlyph kind={icon} />
      </span>
      <span className="text-balance text-center font-mono text-[9px] leading-[1.05] tracking-[0.08em]">
        {label}
      </span>
    </button>
  );
}
