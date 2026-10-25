/**
 * Deterministic geometry for the abstract brain-connectivity network.
 * Computed once at module load with a seeded PRNG, so server and client
 * render identical markup.
 */

export type Node = { x: number; y: number; hub: boolean; side: "l" | "r" };
export type Edge = { d: string; a: number; b: number; long: boolean };

export const VIEW = { w: 600, h: 480 } as const;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

function buildNodes(): Node[] {
  const rand = mulberry32(116);
  const nodes: Node[] = [];
  const perSide = 22;
  for (const side of ["l", "r"] as const) {
    const cx = side === "l" ? 196 : 404;
    let placed = 0;
    let guard = 0;
    while (placed < perSide && guard++ < 4000) {
      const angle = rand() * Math.PI * 2;
      const radius = Math.sqrt(rand());
      const x = cx + Math.cos(angle) * radius * 112;
      const y = 244 + Math.sin(angle) * radius * 168;
      // Keep clear of the central fissure and away from other nodes.
      if (side === "l" ? x > 284 : x < 316) continue;
      if (nodes.some((n) => Math.hypot(n.x - x, n.y - y) < 34)) continue;
      nodes.push({ x: round(x), y: round(y), hub: rand() < 0.2, side });
      placed++;
    }
  }
  return nodes;
}

function curve(a: Node, b: Node, bend: number): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  return `M${a.x} ${a.y}Q${round(cx)} ${round(cy)} ${b.x} ${b.y}`;
}

function buildEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = [];
  const seen = new Set<string>();
  const add = (a: number, b: number, long: boolean) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ a, b, long, d: curve(nodes[a], nodes[b], long ? -0.22 : 0.12) });
  };
  // Local connections: each node to its three nearest same-hemisphere neighbours.
  nodes.forEach((n, i) => {
    nodes
      .map((m, j) => ({ j, dist: j === i || m.side !== n.side ? Infinity : Math.hypot(m.x - n.x, m.y - n.y) }))
      .sort((p, q) => p.dist - q.dist)
      .slice(0, 3)
      .forEach(({ j }) => add(i, j, false));
  });
  // Long-range, inter-hemispheric connections between roughly mirrored nodes.
  const left = nodes.map((n, i) => ({ n, i })).filter((p) => p.n.side === "l");
  const right = nodes.map((n, i) => ({ n, i })).filter((p) => p.n.side === "r");
  left
    .filter((_, k) => k % 3 === 0)
    .forEach(({ n, i }) => {
      const mirror = right.reduce((best, cur) =>
        Math.hypot(cur.n.x - (600 - n.x), cur.n.y - n.y) < Math.hypot(best.n.x - (600 - n.x), best.n.y - n.y) ? cur : best,
      );
      add(i, mirror.i, true);
    });
  return edges;
}

export const nodes = buildNodes();
export const edges = buildEdges(nodes);

/** Stylised top-down brain outline: two hemispheres and a few faint sulci. */
export const outline = {
  left: "M296 42C232 30 152 52 104 104C58 154 50 226 62 290C74 356 112 408 168 432C214 452 262 452 296 438",
  right: "M304 42C368 30 448 52 496 104C542 154 550 226 538 290C526 356 488 408 432 432C386 452 338 452 304 438",
  fissure: "M300 50C296 150 304 300 300 432",
  sulci: [
    "M118 150C160 136 206 150 240 132",
    "M84 250C130 236 170 258 222 242",
    "M112 352C156 332 204 354 252 334",
    "M482 150C440 136 394 150 360 132",
    "M516 250C470 236 430 258 378 242",
    "M488 352C444 332 396 354 348 334",
  ],
} as const;
