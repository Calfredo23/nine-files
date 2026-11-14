"use client";

import { motion, useReducedMotion } from "motion/react";
import type { WinLine } from "@/lib/game";

type Point = { x: number; y: number };

function center(index: number): Point {
  return { x: (index % 3) + 0.5, y: Math.floor(index / 3) + 0.5 };
}

function yarnPath(line: WinLine): string {
  const points = line.map(center);
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const sag = 0.1;
    const mx = (from.x + to.x) / 2 + nx * sag;
    const my = (from.y + to.y) / 2 + ny * sag;
    path += ` Q ${mx} ${my} ${to.x} ${to.y}`;
  }

  return path;
}

export function YarnLine({ line }: { line: WinLine }) {
  const reduced = useReducedMotion();
  const path = yarnPath(line);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
      viewBox="0 0 3 3"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="rgba(0,0,0,.32)"
        strokeWidth={6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        transform="translate(0 .035)"
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#A8323B"
        strokeWidth={5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 1 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.6, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,.45))" }}
      />
      {line.map((index) => {
        const point = center(index);
        return (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={0.05}
            fill="#8E2B33"
          />
        );
      })}
    </svg>
  );
}
