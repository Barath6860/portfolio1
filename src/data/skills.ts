/**
 * Technologies shown in the Expertise section.
 * `icon` is a key from `src/components/ui/TechIcon.tsx`.
 * No proficiency percentages — groups separate what I use from what I'm exploring.
 */

export type SkillCategoryId = "programming" | "web" | "data" | "tools" | "learning";

export type SkillIconKey =
  | "python"
  | "java"
  | "c"
  | "javascript"
  | "html"
  | "css"
  | "numpy"
  | "pandas"
  | "sklearn"
  | "streamlit"
  | "git"
  | "github"
  | "vscode"
  | "dsa"
  | "symbolic"
  | "data"
  | "architecture";

export type Skill = {
  name: string;
  icon: SkillIconKey;
  description: string;
};

export type SkillCategory = {
  id: SkillCategoryId;
  label: string;
  blurb: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    blurb: "Languages I write projects and coursework in.",
    skills: [
      { name: "Python", icon: "python", description: "Data processing, scientific scripts and application backends — TrustScan and DocTranslate are both Python." },
      { name: "Java", icon: "java", description: "Object-oriented programming and algorithm practice." },
      { name: "C", icon: "c", description: "Fundamentals: memory, pointers and how programs execute." },
      { name: "JavaScript", icon: "javascript", description: "Interactive behaviour in browser-based interfaces." },
    ],
  },
  {
    id: "web",
    label: "Web Fundamentals",
    blurb: "The building blocks of the interfaces I make.",
    skills: [
      { name: "HTML", icon: "html", description: "Semantic, accessible page structure." },
      { name: "CSS", icon: "css", description: "Layout, responsive design and visual styling." },
      { name: "JavaScript", icon: "javascript", description: "DOM interaction and client-side logic." },
    ],
  },
  {
    id: "data",
    label: "Data & Scientific Computing",
    blurb: "Python tooling for analysis, statistics and data apps.",
    skills: [
      { name: "NumPy", icon: "numpy", description: "Array computing — the numerical core of TrustScan's measurements." },
      { name: "Pandas", icon: "pandas", description: "Cleaning, joining and summarising tabular data." },
      { name: "scikit-learn", icon: "sklearn", description: "Classic ML models and evaluation workflows." },
      { name: "Streamlit", icon: "streamlit", description: "Interactive data dashboards in Python — TrustScan's UI." },
    ],
  },
  {
    id: "tools",
    label: "Development Tools",
    blurb: "The workflow around the code.",
    skills: [
      { name: "Git", icon: "git", description: "Version control, branching and history." },
      { name: "GitHub", icon: "github", description: "Hosting, documenting and sharing projects." },
      { name: "VS Code", icon: "vscode", description: "Everyday editor and debugger." },
    ],
  },
  {
    id: "learning",
    label: "Current Learning",
    blurb: "Areas I'm actively exploring — not claiming mastery.",
    skills: [
      { name: "Symbolic AI & expert systems", icon: "symbolic", description: "Rule bases, forward chaining and explanation traces." },
      { name: "Data Structures & Algorithms", icon: "dsa", description: "Regular problem-solving practice." },
      { name: "Data analysis", icon: "data", description: "Asking better questions of data and reporting results honestly." },
      { name: "Software engineering", icon: "architecture", description: "Structuring, testing and maintaining larger codebases." },
    ],
  },
];
