"use client";

import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/** Tilted orbit paths around the network (centre 300,244 in the network's 600×480 space). */
const ORBITS = [
  { rx: 292, ry: 86, tilt: -16, color: "var(--accent)", dur: 11, dots: 2 },
  { rx: 262, ry: 64, tilt: 22, color: "var(--accent-2)", dur: 14, dots: 1 },
];

function ellipsePath(rx: number, ry: number) {
  return `M${300 - rx} 244a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0`;
}

/**
 * Decorative layer behind the hero network: a slow radar-like light sweep and
 * two tilted orbit rings with glowing dots travelling along them.
 */
export function Orbits() {
  const reduce = usePrefersReducedMotion();
  return (
    <div aria-hidden="true" className="animate-fade-in pointer-events-none absolute inset-0" style={{ animationDelay: "1600ms" }}>
      {/* Radar sweep, masked to a soft circle */}
      <div className="absolute inset-[6%] overflow-hidden rounded-full [mask-image:radial-gradient(circle,#000_35%,transparent_70%)]">
        <div className="absolute inset-0 animate-[spin_16s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,color-mix(in_srgb,var(--accent)_22%,transparent)_40deg,transparent_80deg)]" />
      </div>

      <svg viewBox="0 0 600 480" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <filter id="orbit-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {ORBITS.map((o) => {
          const d = ellipsePath(o.rx, o.ry);
          return (
            <g key={o.rx} transform={`rotate(${o.tilt} 300 244)`}>
              <path d={d} fill="none" stroke={o.color} strokeOpacity="0.4" strokeWidth="1.1" strokeDasharray="2 6" />
              {!reduce
                ? Array.from({ length: o.dots }, (_, i) => (
                    <g key={i}>
                      <circle r="7" fill={o.color} opacity="0.5" filter="url(#orbit-glow)">
                        <animateMotion dur={`${o.dur}s`} begin={`${-(o.dur / o.dots) * i}s`} repeatCount="indefinite" path={d} />
                      </circle>
                      <circle r="2.6" fill={o.color}>
                        <animateMotion dur={`${o.dur}s`} begin={`${-(o.dur / o.dots) * i}s`} repeatCount="indefinite" path={d} />
                      </circle>
                    </g>
                  ))
                : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
