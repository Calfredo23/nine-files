"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  width: number;
  height: number;
  color: string;
};

const COLORS = ["#D8C39A", "#EFE6D2", "#8E2B33", "#B99E70", "#6F4A2D"];

export function PaperBurst({ trigger }: { trigger: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (trigger === "none") {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) {
      return;
    }
    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.scale(dpr, dpr);

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const particles: Particle[] = Array.from({ length: 44 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 180 + Math.random() * 420;
      return {
        x: cx + (Math.random() - 0.5) * rect.width * 0.18,
        y: cy + (Math.random() - 0.5) * rect.height * 0.18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 140,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 12,
        width: 4 + Math.random() * 7,
        height: 3 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });

    let raf = 0;
    let last = performance.now();
    const start = last;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const elapsed = (now - start) / 1000;
      ctx.clearRect(0, 0, rect.width, rect.height);
      const alpha = Math.max(0, 1 - elapsed / 1.5);

      for (const particle of particles) {
        particle.vy += 900 * dt;
        particle.vx *= 0.985;
        particle.vy *= 0.99;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.angle += particle.spin * dt;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle);
        ctx.fillStyle = particle.color;
        ctx.fillRect(
          -particle.width / 2,
          -particle.height / 2,
          particle.width,
          particle.height,
        );
        ctx.restore();
      }

      if (elapsed < 1.5) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, rect.width, rect.height);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40"
    />
  );
}
