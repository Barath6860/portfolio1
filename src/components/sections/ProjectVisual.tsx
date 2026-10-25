import { useId } from "react";
import type { ProjectVisualKind as Kind } from "@/data/projects";

/*
 * Original illustrations used when a project has no screenshot.
 * They depict each project's idea — they are not product screenshots and
 * deliberately contain no figures or metrics.
 */

const W = 400;
const H = 175;

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id={`glow${uid}`} gradientUnits="userSpaceOnUse" cx={W * 0.3} cy={H * 0.1} r={W * 0.9}>
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
          <stop offset="55%" stopColor="var(--accent-2)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--line)" strokeWidth="1" />
        </pattern>
      </defs>
      {/* Backdrop extends past the viewBox so letterboxed areas stay filled at any aspect ratio. */}
      <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="var(--surface-2)" />
      <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#grid${uid})`} />
      <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#glow${uid})`} />
      {children}
    </svg>
  );
}

const mono = { fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: 1 } as const;

function LifeLedger() {
  return (
    <Frame label="Illustration: a personal dashboard with goals and a task checklist">
      <g transform="translate(40 22)">
        <rect width="320" height="134" rx="10" fill="var(--surface)" stroke="var(--line-strong)" />
        <rect width="64" height="134" rx="10" fill="var(--surface-2)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="12" y={18 + i * 18} width={i === 0 ? 40 : 32} height="6" rx="3" fill={i === 0 ? "var(--accent)" : "var(--muted)"} fillOpacity={i === 0 ? 0.8 : 0.35} />
        ))}
        <text x="80" y="22" fill="var(--subtle)" style={mono}>TODAY</text>
        {[true, true, false, false].map((done, i) => (
          <g key={i} transform={`translate(80 ${34 + i * 22})`}>
            <rect width="12" height="12" rx="3" fill={done ? "var(--accent)" : "none"} stroke={done ? "var(--accent)" : "var(--line-strong)"} />
            {done ? <path d="M3 6.5l2 2 4-5" fill="none" stroke="var(--accent-ink)" strokeWidth="1.6" /> : null}
            <rect x="20" y="3" width={[90, 70, 100, 60][i]} height="6" rx="3" fill="var(--muted)" fillOpacity={done ? 0.2 : 0.4} />
          </g>
        ))}
        <text x="232" y="22" fill="var(--subtle)" style={mono}>GOALS</text>
        <g transform="translate(262 66)">
          <circle r="26" fill="none" stroke="var(--line-strong)" strokeWidth="6" />
          <circle r="26" fill="none" stroke="var(--accent-2)" strokeWidth="6" strokeDasharray="100 200" strokeLinecap="round" transform="rotate(-90)" />
          <circle r="14" fill="none" stroke="var(--accent)" strokeOpacity="0.6" strokeWidth="4" strokeDasharray="50 100" strokeLinecap="round" transform="rotate(-90)" />
        </g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={232 + i * 10} y={118 - [10, 16, 8, 20, 14, 18, 12][i]} width="6" height={[10, 16, 8, 20, 14, 18, 12][i]} rx="2" fill="var(--accent)" fillOpacity="0.5" />
        ))}
      </g>
    </Frame>
  );
}

function Forecast() {
  const history = [96, 88, 100, 78, 84, 70, 90, 82, 94, 74, 80, 66, 84, 76];
  const step = 16;
  const x0 = 40;
  const pts = history.map((y, i) => `${x0 + i * step},${y + 20}`).join(" ");
  const lastX = x0 + (history.length - 1) * step;
  const fc = [70, 82, 64, 78, 60, 74, 58, 72];
  const fpts = [`${lastX},${history[history.length - 1] + 20}`, ...fc.map((y, i) => `${lastX + (i + 1) * step},${y + 20}`)].join(" ");
  const upper = fc.map((y, i) => `${lastX + (i + 1) * step},${y + 20 - 6 - i * 2}`);
  const lower = fc.map((y, i) => `${lastX + (i + 1) * step},${y + 20 + 6 + i * 2}`).reverse();
  return (
    <Frame label="Illustration: historical demand line continuing into a dashed seasonal forecast with an uncertainty band">
      <path d={`M${x0} 150H372M${x0} 30V150`} stroke="var(--line-strong)" />
      <polygon points={[`${lastX},${history[history.length - 1] + 20}`, ...upper, ...lower].join(" ")} fill="var(--accent-2)" fillOpacity="0.15" />
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
      <polyline points={fpts} fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeDasharray="5 4" strokeLinejoin="round" />
      <path d={`M${lastX} 30V150`} stroke="var(--subtle)" strokeDasharray="2 3" />
      <text x={x0 + 4} y="26" fill="var(--subtle)" style={mono}>DEMAND</text>
      <text x={lastX - 6} y="162" textAnchor="end" fill="var(--accent)" style={mono}>HISTORY</text>
      <text x={lastX + 6} y="162" fill="var(--accent-2)" style={mono}>FORECAST · SARIMA</text>
    </Frame>
  );
}

const visuals: Record<Kind, () => React.ReactElement> = {
  lifeledger: LifeLedger,
  forecast: Forecast,
};

export function ProjectVisual({ kind }: { kind: Kind }) {
  const Visual = visuals[kind];
  return <Visual />;
}
