/**
 * Personal details used across the site — every section, social button,
 * metadata entry and contact action reads from here.
 */

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export const profile = {
  name: "Barath Raj S P",
  displayName: "BARATH RAJ S P",
  firstName: "Barath",
  initials: "BR",
  label: "Computer Science Engineering",
  role: "Computer Science Engineering Student",
  subRole: "Aspiring Software Developer",
  headline: "Building software with clarity, trust, and purpose.",
  headlineLines: ["Building software with", "clarity, trust, and purpose."],
  summary:
    "I'm a Computer Science Engineering student who enjoys building practical applications, exploring intelligent systems, and turning technical ideas into usable software.",
  descriptors: [
    "Software Development",
    "Building Trust-Aware Systems",
    "Privacy-Aware Applications",
    "Data & Problem-Solving",
    "Learning Through Projects",
  ],
  interests: [
    "Software engineering",
    "Artificial intelligence",
    "Symbolic AI & expert systems",
    "Data Structures & Algorithms",
    "Data analysis",
    "Automation & practical problem-solving",
  ],
  philosophy: "Understand. Build. Explain. Improve.",

  /** Decorative status label in the hero — not a claim about live infrastructure. */
  systemStatus: "SYSTEM STATUS: INITIALIZED",

  email: "spbarathraj@gmail.com",
  github: {
    username: "Barath6860",
    url: "https://github.com/Barath6860",
  },
  linkedin: {
    handle: "barathraj-sp-b629b4331",
    url: "https://www.linkedin.com/in/barathraj-sp-b629b4331/",
  },

  /** Canonical site URL for metadata, sitemap and Open Graph. Set NEXT_PUBLIC_SITE_URL once deployed. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: profile.github.url, handle: `@${profile.github.username}` },
  { label: "LinkedIn", href: profile.linkedin.url, handle: `in/${profile.linkedin.handle}` },
];

export const about = {
  intro: [
    "I'm a Computer Science Engineering student who learns by implementing. I like taking a technical idea — a research question, a messy workflow, a data problem — and turning it into software that someone can actually use and understand.",
    "My strongest projects sit where software engineering meets intelligent systems: a rule-based expert system that audits fairness in fMRI quality decisions, and a privacy-aware document translation application. Both taught me that how a system explains itself matters as much as what it computes.",
  ],
  programming: ["Python", "Java", "C", "JavaScript"],
  focusAreas: ["Software engineering", "Symbolic AI & expert systems", "Data analysis"],
  learningGoals: ["Data Structures & Algorithms", "Software architecture", "Explainable, trustworthy systems"],
  principles: [
    { title: "Understand the problem.", body: "Before choosing tools, get clear on who the software is for and what would actually help them." },
    { title: "Build practical solutions.", body: "Prefer a working, well-scoped version over an impressive idea that never runs." },
    { title: "Make decisions explainable.", body: "When software decides something, it should be able to say which rule or value led there." },
    { title: "Protect data where appropriate.", body: "Treat personal and sensitive information carefully — mask it, minimise it, and don't send it where it isn't needed." },
    { title: "Test and improve.", body: "Check behaviour at the edges, measure honestly, and keep iterating on what the results show." },
  ],
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "expertise", label: "Expertise" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

/** Sub-sections inside Projects that can be navigated to directly. */
export const projectAnchors = ["trustscan", "doctranslate", "more-projects"] as const;

export type SectionId = (typeof navItems)[number]["id"] | (typeof projectAnchors)[number];
