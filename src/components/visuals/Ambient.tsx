"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

/* Deterministic particle field (no Math.random during render). */
const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 928.371 + n * 12.9898) * 43758.5453) % 1 + 1) % 1;
  return {
    left: `${Math.round(r(1) * 1000) / 10}%`,
    top: `${Math.round((30 + r(2) * 65) * 10) / 10}%`,
    size: r(3) > 0.75 ? 3 : 2,
    dur: `${Math.round(14 + r(4) * 10)}s`,
    delay: `${-Math.round(r(5) * 20)}s`,
    dx: `${Math.round((r(6) - 0.5) * 60)}px`,
    opacity: Math.round((0.25 + r(7) * 0.45) * 100) / 100,
    violet: r(8) > 0.6,
  };
});

/**
 * Layered ambient background: grid with a slow light sweep, drifting cyan /
 * violet orbs, floating particles and faint contour lines. Layers move at a
 * fraction of scroll speed for gentle depth (disabled for reduced motion).
 */
export function Ambient({ className, particles = true, contours = true }: { className?: string; particles?: boolean; contours?: boolean }) {
  const reduce = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const slow = useTransform(scrollY, [0, 1000], [0, 180]);
  const slower = useTransform(scrollY, [0, 1000], [0, 90]);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div className="animate-fade-in absolute inset-0">
        <motion.div style={reduce ? undefined : { y: slower }} className="absolute inset-0">
          <div className="bg-grid mask-fade-b absolute inset-0" />
          <div className="mask-fade-b absolute inset-0 overflow-hidden">
            <div className="animate-grid-sweep absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--accent)_7%,transparent)] to-transparent" />
          </div>
        </motion.div>

        <motion.div style={reduce ? undefined : { y: slow }} className="absolute inset-0">
          <div className="animate-drift absolute -top-48 left-[4%] size-[40rem] rounded-full bg-[radial-gradient(circle,var(--glow),transparent_62%)]" />
          <div className="animate-drift-alt absolute top-[18%] -right-48 size-[36rem] rounded-full bg-[radial-gradient(circle,var(--glow-2),transparent_62%)]" />
        </motion.div>

        {contours ? (
          <svg className="absolute inset-0 size-full opacity-[0.5]" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M-50 ${560 + i * 34}C200 ${500 + i * 30} 420 ${640 + i * 26} 700 ${560 + i * 30}S1100 ${520 + i * 32} 1260 ${580 + i * 30}`}
                fill="none"
                stroke="var(--line-strong)"
                strokeWidth="1"
                opacity={0.5 - i * 0.08}
              />
            ))}
          </svg>
        ) : null}

        {particles
          ? PARTICLES.map((p, i) => (
              <span
                key={i}
                className="animate-particle absolute rounded-full"
                style={
                  {
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size,
                    background: p.violet ? "var(--accent-2)" : "var(--accent)",
                    "--p-dur": p.dur,
                    "--p-delay": p.delay,
                    "--p-dx": p.dx,
                    "--p-opacity": p.opacity,
                  } as React.CSSProperties
                }
              />
            ))
          : null}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}

/** Two slowly scrolling signal waves (path is doubled so the loop is seamless). */
export function SignalWave({ className }: { className?: string }) {
  const wave = (amp: number, len: number, y: number) => {
    let d = `M0 ${y}`;
    for (let x = 0; x < 1200; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
    return d;
  };
  return (
    <svg aria-hidden="true" viewBox="0 0 600 60" preserveAspectRatio="none" className={cn("overflow-hidden", className)}>
      <g className="animate-wave">
        <path d={wave(14, 120, 30)} fill="none" stroke="var(--accent)" strokeOpacity="0.55" strokeWidth="1.2" />
        <path d={wave(8, 80, 34)} fill="none" stroke="var(--accent-2)" strokeOpacity="0.4" strokeWidth="1" />
      </g>
    </svg>
  );
}
