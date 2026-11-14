"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export function MarkX({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={cn("block h-full w-full", className)}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path
          d="M30 28 70 72"
          strokeWidth="12"
          opacity=".14"
          transform="translate(1.6 1.8)"
        />
        <path
          d="M70 28 30 72"
          strokeWidth="12"
          opacity=".14"
          transform="translate(1.6 1.8)"
        />
        <path d="M30 28 70 72" strokeWidth="9" />
        <path d="M70 28 30 72" strokeWidth="9" />
      </g>
      <g fill="currentColor" opacity=".18">
        <circle cx="26" cy="21" r="1.6" />
        <circle cx="76" cy="77" r="1.2" />
        <circle cx="79" cy="22" r="1.1" />
      </g>
    </svg>
  );
}

export function MarkO({ className }: { className?: string }) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const ring = `ring-${id}`;
  const glass = `glass-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={cn("block h-full w-full", className)}
    >
      <defs>
        <linearGradient id={ring} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F0D6A3" />
          <stop offset=".42" stopColor="#B08D57" />
          <stop offset=".72" stopColor="#7A5B34" />
          <stop offset="1" stopColor="#D9B77B" />
        </linearGradient>
        <radialGradient id={glass} cx=".34" cy=".28" r=".85">
          <stop offset="0" stopColor="#FFF8E7" stopOpacity=".26" />
          <stop offset=".5" stopColor="#2A2118" stopOpacity=".18" />
          <stop offset="1" stopColor="#0B0C0E" stopOpacity=".38" />
        </radialGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="29"
        fill={`url(#${glass})`}
        stroke={`url(#${ring})`}
        strokeWidth="10"
      />
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#6E522F"
        strokeWidth="1.4"
        opacity=".55"
      />
      <path
        d="M32 39 A20 20 0 0 1 51 30"
        fill="none"
        stroke="#FFFBEF"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity=".6"
      />
      <path
        d="M65 63 A19 19 0 0 1 55 70"
        fill="none"
        stroke="#FFFBEF"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity=".22"
      />
    </svg>
  );
}
