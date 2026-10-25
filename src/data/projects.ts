/**
 * Project content. Visual components read from here — edit text, links and
 * figures in this file only.
 *
 * - Every TrustScan figure is copied from the repository's README.md /
 *   RESULTS.md and labelled with the evaluation it belongs to.
 * - Links are only set when the destination has been verified.
 */

const TS_REPO = "https://github.com/Barath6860/TrustScan";
const DT_REPO = "https://github.com/Barath6860/DocTranslator";

export type Decision = "trusted" | "reviewed" | "withheld";

export const trustscan = {
  title: "TrustScan",
  subtitle: "Bias-Aware fMRI Quality Assessment",
  description:
    "A rule-based research screening system for resting-state fMRI. It decides whether a scan's measurements are reliable enough to display, explains every decision, and audits who gets excluded when results are withheld.",
  badges: ["Rule-based symbolic AI", "No machine learning", "Research prototype", "Python · Streamlit"],
  links: {
    repo: TS_REPO,
    readme: `${TS_REPO}/blob/main/README.md`,
    results: `${TS_REPO}/blob/main/RESULTS.md`,
  },
  pipeline: [
    { id: "input", title: "fMRI input", short: "NIfTI / ABIDE scans" },
    { id: "regions", title: "Region signals", short: "116 AAL regions" },
    { id: "measurements", title: "Measurements", short: "QC, motion, coverage, shift" },
    { id: "rules", title: "Rule engine", short: "Forward-chaining IF–THEN" },
    { id: "decision", title: "Trust decision", short: "3 explainable outcomes" },
    { id: "audit", title: "Bias audit", short: "ASD vs control gap" },
  ],
  decisions: {
    trusted: { label: "Trusted", meaning: "Every reliability rule passes." },
    reviewed: { label: "Reviewed", meaning: "Shown with explicit warnings." },
    withheld: { label: "Withheld", meaning: "Expert review required." },
  } satisfies Record<Decision, { label: string; meaning: string }>,

  /** RESULTS.md — leave-one-site-out pooled (each site judged against the other 19). */
  loso: {
    context: "Leave-one-site-out · 20 sites · n = 1,035",
    policies: [
      { name: "Motion-only (FD > 0.2 mm)", coverage: 85.5, gap: 8.8 },
      { name: "TrustScan rules", coverage: 97.6, gap: 0.3, highlight: true },
    ],
  },

  /** RESULTS.md — held-out evaluation set (n = 207). A separate measurement. */
  heldOut: {
    context: "Held-out set · n = 207 · separate evaluation",
    distribution: [
      { key: "trusted" as Decision, label: "Trusted", value: 73.4 },
      { key: "reviewed" as Decision, label: "Reviewed", value: 24.2 },
      { key: "withheld" as Decision, label: "Withheld", value: 2.4 },
    ],
    asdWithheld: 2.0,
    controlWithheld: 2.9,
    gap: 0.9,
  },

  note: "Research prototype on ABIDE-I data. It evaluates scan reliability — it does not diagnose or predict autism, and it is not clinically validated.",
} as const;

export const doctranslate = {
  title: "DocTranslate Enterprise",
  subtitle: "Privacy-Aware Document Translation",
  description:
    "A Flask application for translating business documents while masking personal data, enforcing terminology and keeping batch work visible.",
  stack: ["Python", "Flask", "MySQL", "spaCy", "pypdf", "python-docx"],
  links: {
    repo: DT_REPO,
    report: `${DT_REPO}/blob/main/IMPLEMENTATION_REPORT.md`,
    manual: `${DT_REPO}/blob/main/USER_MANUAL.md`,
  },
  pipeline: [
    { id: "upload", title: "Upload", detail: "DOCX, XLSX, XLS, PDF, TXT, CSV" },
    { id: "detect", title: "Detect", detail: "Names, emails, phones, IDs" },
    { id: "mask", title: "Mask PII", detail: "Swap in placeholders" },
    { id: "translate", title: "Translate", detail: "Only masked text is sent" },
    { id: "restore", title: "Restore", detail: "Map originals back" },
    { id: "export", title: "Export", detail: "Same format out" },
  ],
  highlights: [
    { title: "PII masking", body: "Sensitive values become placeholders before translation." },
    { title: "Glossary control", body: "Brand and do-not-translate terms stay intact." },
    { title: "Four engines", body: "Google, DeepL, Azure or LibreTranslate, when configured." },
    { title: "Batch & audit", body: "Queued jobs, notifications, history and audit logs." },
  ],
} as const;

/* ------------------------------------------------------------------------ */
/* Secondary projects                                                       */
/* ------------------------------------------------------------------------ */

export type ProjectStatus = "Concept" | "Prototype" | "Hackathon project" | "In progress" | "Completed";
export type ProjectVisualKind = "lifeledger" | "forecast";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  /** Omitted when the project's state hasn't been confirmed. */
  status?: ProjectStatus;
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  /** false when the stack still needs confirming against the implementation. */
  techConfirmed: boolean;
  links: { repo: string | null; demo: string | null };
  image?: { src: string; alt: string };
  visual: ProjectVisualKind;
};

export const secondaryProjects: Project[] = [
  {
    slug: "lifeledger",
    title: "LifeLedger",
    subtitle: "Personal Life & Goal Management",
    summary: "A personal dashboard concept for organising goals, managing tasks and keeping everyday activities structured.",
    status: "Concept",
    problem: "Goals, tasks and daily routines tend to scatter across notes, apps and memory, which makes progress hard to see.",
    solution: "LifeLedger brings them into one dashboard with simple goal and task management and a clear overview.",
    features: ["Goal organisation", "Task management", "Structured daily activities", "Clear dashboard overview"],
    tech: ["HTML", "CSS", "JavaScript"],
    techConfirmed: false,
    links: { repo: null, demo: null },
    visual: "lifeledger",
  },
  {
    slug: "spare-parts-forecasting",
    title: "Spare Parts Demand Forecasting",
    subtitle: "SARIMA Time-Series Forecasting",
    summary: "Estimates spare-parts demand from historical data using a SARIMA time-series model.",
    problem: "Spare-parts demand changes over time with trends and seasonal patterns, so simple averages make poor stocking guides.",
    solution:
      "The project prepares historical demand as a time series, examines its trend and seasonality, and fits a SARIMA model to estimate future demand.",
    features: ["Data preparation of historical demand", "Trend and seasonality analysis", "SARIMA demand prediction"],
    tech: ["Python", "SARIMA"],
    techConfirmed: true,
    links: { repo: null, demo: null },
    visual: "forecast",
  },
];
