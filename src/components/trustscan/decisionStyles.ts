import type { Decision } from "@/data/projects";

/** One colour per trust decision, used consistently across every TrustScan visual. */
export const decisionColor: Record<Decision, string> = {
  trusted: "var(--success)",
  reviewed: "var(--warning)",
  withheld: "var(--danger)",
};
