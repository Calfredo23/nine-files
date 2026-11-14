"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export function Captain({
  speaking,
  className,
}: {
  speaking: boolean;
  className?: string;
}) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const glow = `captain-glow-${id}`;
  const coat = `captain-coat-${id}`;
  const hat = `captain-hat-${id}`;

  return (
    <svg
      viewBox="0 0 120 140"
      aria-hidden="true"
      focusable="false"
      className={cn("captain block w-full", speaking && "captain-speaking", className)}
    >
      <defs>
        <radialGradient id={glow} cx=".5" cy=".34" r=".68">
          <stop offset="0" stopColor="#E3A44B" stopOpacity=".32" />
          <stop offset="1" stopColor="#E3A44B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={coat} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2D22" />
          <stop offset="1" stopColor="#1C1510" />
        </linearGradient>
        <linearGradient id={hat} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B2E22" />
          <stop offset="1" stopColor="#241C16" />
        </linearGradient>
      </defs>

      <rect width="120" height="140" fill="#14100D" />
      <circle cx="60" cy="48" r="46" fill={`url(#${glow})`} />

      <g>
        <path
          d="M6 140 C10 112 32 96 60 96 C88 96 110 112 114 140 Z"
          fill={`url(#${coat})`}
        />
        <path d="M40 100 L60 122 L48 140 L24 140 Z" fill="#241C16" />
        <path d="M80 100 L60 122 L72 140 L96 140 Z" fill="#241C16" />
        <path d="M52 96 L60 112 L68 96 Z" fill="#EFE6D2" />
        <path d="M58 100 L60 112 L62 100 L65 128 L60 136 L55 128 Z" fill="#8E2B33" />
        <rect x="52" y="78" width="16" height="22" rx="5" fill="#C79A72" />
      </g>

      <g className="captain-head">
        <path
          d="M38 48 C38 28 48 18 60 18 C72 18 82 28 82 48 L82 64 C82 78 72 86 60 86 C48 86 38 78 38 64 Z"
          fill="#D2A67C"
        />
        <ellipse cx="37" cy="57" rx="4" ry="6" fill="#C79A72" />
        <ellipse cx="83" cy="57" rx="4" ry="6" fill="#C79A72" />
        <ellipse cx="60" cy="34" rx="39" ry="8" fill="#241C16" />
        <path
          d="M34 34 C34 14 44 6 60 6 C76 6 86 14 86 34 Z"
          fill={`url(#${hat})`}
        />
        <path d="M34 30 L86 30 L86 36 L34 36 Z" fill="#8E2B33" />
        <path
          d="M44 12 Q60 8 76 12"
          stroke="#4A3A2C"
          strokeWidth="2"
          fill="none"
          opacity=".6"
        />
        <path
          className="captain-brow"
          d="M43 44 Q50 40 57 44"
          stroke="#2A1D14"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="captain-brow"
          d="M63 44 Q70 40 77 44"
          stroke="#2A1D14"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse
          className="captain-eye"
          cx="50"
          cy="52"
          rx="4"
          ry="3.2"
          fill="#14100D"
        />
        <ellipse
          className="captain-eye"
          cx="70"
          cy="52"
          rx="4"
          ry="3.2"
          fill="#14100D"
        />
        <circle cx="51.2" cy="51" r="1" fill="#EFE6D2" opacity=".8" />
        <circle cx="71.2" cy="51" r="1" fill="#EFE6D2" opacity=".8" />
        <path d="M60 52 L56 63 Q60 66 64 63 Z" fill="#B9865E" />
        <path
          d="M49 68 Q60 63 71 68 Q66 73 60 70 Q54 73 49 68 Z"
          fill="#3A2A1E"
        />
        <ellipse
          className="captain-mouth"
          cx="60"
          cy="75"
          rx="6.5"
          ry="1.8"
          fill="#3A1A18"
        />
        <path d="M41 62 L44 64" stroke="#B9865E" strokeWidth="1" opacity=".6" />
        <path d="M79 62 L76 64" stroke="#B9865E" strokeWidth="1" opacity=".6" />
        <path
          d="M40 84 Q60 92 80 84"
          stroke="#B9865E"
          strokeWidth="1"
          fill="none"
          opacity=".3"
        />
      </g>

      <g className="captain-mug">
        <path d="M88 112 h16 v12 a8 8 0 0 1 -16 0 Z" fill="#EFE6D2" />
        <path
          d="M104 115 q8 0 8 6 q0 6 -8 6"
          fill="none"
          stroke="#EFE6D2"
          strokeWidth="2.4"
        />
        <path
          d="M92 110 q2 -5 0 -8 M98 110 q2 -5 0 -8"
          stroke="#EFE6D2"
          strokeWidth="1.4"
          opacity=".45"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M86 118 q8 4 20 0"
          stroke="#B99E70"
          strokeWidth="1"
          fill="none"
          opacity=".5"
        />
        <path d="M84 120 q-6 4 -2 10 q4 4 8 0" fill="#D2A67C" />
      </g>
    </svg>
  );
}
