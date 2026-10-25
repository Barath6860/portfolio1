"use client";

import { useId, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";
import { edges, nodes, outline, VIEW } from "./network";

type Props = {
  className?: string;
  /** Seconds before the drawing sequence starts. */
  delay?: number;
  /** Start drawing on mount (hero) instead of when scrolled into view. */
  immediate?: boolean;
  /** Fine technical labels around the network. */
  labels?: string[];
  title: string;
};

/** Edges along which small signal pulses travel (indices into `edges`). */
const SIGNAL_EDGES = [2, 9, 15, 23, 31, 38, 44];

const LABEL_POSITIONS = [
  { x: 14, y: 38, anchor: "start" },
  { x: 586, y: 38, anchor: "end" },
  { x: 14, y: 470, anchor: "start" },
  { x: 586, y: 470, anchor: "end" },
] as const;

/**
 * Abstract resting-state connectivity network: the outline and connections
 * draw themselves in, hub nodes pulse slowly and a few signals travel along
 * the paths. Decorative — it depicts no real subject or result.
 */
export function BrainNetwork({ className, delay = 0, immediate = false, labels = [], title }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = usePrefersReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const active = immediate || inView;
  const state = active ? "show" : "hidden";

  const draw = (d: number, duration = 2.2) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { pathLength: { duration, delay: delay + d, ease: EASE }, opacity: { duration: 0.6, delay: delay + d } } },
  });

  return (
    <svg ref={ref} viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className={cn("h-auto w-full overflow-visible", className)} role="img" aria-label={title}>
      <defs>
        <linearGradient id={`edge${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
        <radialGradient id={`halo${uid}`}>
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`field${uid}`} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="var(--accent-2)" stopOpacity="0.16" />
          <stop offset="0.6" stopColor="var(--accent)" stopOpacity="0.05" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Slowly breathing background field */}
      <ellipse cx="300" cy="244" rx="290" ry="230" fill={`url(#field${uid})`} className="animate-breathe" />

      {/* Outline + sulci */}
      <g fill="none" strokeLinecap="round">
        {[outline.left, outline.right].map((d, i) => (
          <motion.path key={d} d={d} stroke="var(--silver)" strokeOpacity="0.35" strokeWidth="1.2" variants={draw(i * 0.1, 2.6)} initial="hidden" animate={state} />
        ))}
        <motion.path d={outline.fissure} stroke="var(--silver)" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="3 6" variants={draw(0.4, 2)} initial="hidden" animate={state} />
        {outline.sulci.map((d, i) => (
          <motion.path key={d} d={d} stroke="var(--silver)" strokeOpacity="0.12" strokeWidth="1" variants={draw(0.6 + i * 0.08, 1.8)} initial="hidden" animate={state} />
        ))}
      </g>

      {/* Connections */}
      <g fill="none" strokeLinecap="round">
        {edges.map((e, i) => (
          <motion.path
            key={e.d}
            d={e.d}
            stroke={`url(#edge${uid})`}
            strokeWidth={e.long ? 0.9 : 1.1}
            strokeOpacity={e.long ? 0.28 : 0.42}
            variants={draw(0.9 + i * 0.025, 1.6)}
            initial="hidden"
            animate={state}
          />
        ))}
      </g>

      {/* Travelling signals — decorative, so skipped for reduced motion */}
      {!reduce && active
        ? SIGNAL_EDGES.filter((i) => edges[i]).map((i, k) => (
            <circle key={i} r="2.4" fill="var(--accent-strong)" opacity="0.9">
              <animateMotion dur={`${5 + (k % 3) * 1.6}s`} begin={`${delay + 2.4 + k * 0.7}s`} repeatCount="indefinite" path={edges[i].d} />
            </circle>
          ))
        : null}

      {/* Nodes */}
      <g>
        {nodes.map((n, i) => (
          <motion.g
            key={`${n.x}-${n.y}`}
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: delay + 0.7 + i * 0.03 }}
          >
            {n.hub ? (
              <>
                <circle cx={n.x} cy={n.y} r="14" fill={`url(#halo${uid})`} className="animate-node-pulse" style={{ animationDelay: `${(i % 5) * 0.9}s` }} />
                <circle cx={n.x} cy={n.y} r="4" fill="var(--accent)" />
              </>
            ) : (
              <circle cx={n.x} cy={n.y} r="2.6" fill={n.side === "l" ? "var(--accent)" : "var(--accent-2)"} fillOpacity="0.85" />
            )}
          </motion.g>
        ))}
      </g>

      {/* Fine technical labels */}
      {labels.slice(0, LABEL_POSITIONS.length).map((label, i) => {
        const p = LABEL_POSITIONS[i];
        return (
          <motion.text
            key={label}
            x={p.x}
            y={p.y}
            textAnchor={p.anchor}
            fill="var(--subtle)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2 }}
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: delay + 1.6 + i * 0.15 }}
          >
            {label}
          </motion.text>
        );
      })}
    </svg>
  );
}
