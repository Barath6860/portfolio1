import {
  siC,
  siCss,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siNumpy,
  siOpenjdk,
  siPandas,
  siPython,
  siScikitlearn,
  siStreamlit,
  type SimpleIcon,
} from "simple-icons";
import { BarChart3, Binary, Code2, GitFork, Network, type LucideIcon } from "lucide-react";
import type { SkillIconKey } from "@/data/skills";

/*
 * Brand logos come from Simple Icons. Java (OpenJDK mark used instead) and
 * VS Code are not distributed by Simple Icons for trademark reasons, so VS Code
 * and the learning topics use Lucide glyphs.
 */
const brandIcons: Partial<Record<SkillIconKey, SimpleIcon>> = {
  python: siPython,
  java: siOpenjdk,
  c: siC,
  javascript: siJavascript,
  html: siHtml5,
  css: siCss,
  numpy: siNumpy,
  pandas: siPandas,
  sklearn: siScikitlearn,
  streamlit: siStreamlit,
  git: siGit,
  github: siGithub,
};

const glyphIcons: Partial<Record<SkillIconKey, { icon: LucideIcon; color: string }>> = {
  vscode: { icon: Code2, color: "#3b9fe6" },
  dsa: { icon: Binary, color: "var(--accent)" },
  symbolic: { icon: GitFork, color: "var(--accent-2)" },
  data: { icon: BarChart3, color: "var(--teal)" },
  architecture: { icon: Network, color: "var(--accent)" },
};

/** Very dark brand colours are swapped for the foreground colour so they stay visible on dark surfaces. */
function isTooDark(hex: string): boolean {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 70;
}

export function techColor(key: SkillIconKey): string {
  const brand = brandIcons[key];
  if (brand) return isTooDark(brand.hex) ? "var(--fg)" : `#${brand.hex}`;
  return glyphIcons[key]?.color ?? "var(--accent)";
}

export function TechIcon({ name, className = "size-6" }: { name: SkillIconKey; className?: string }) {
  const brand = brandIcons[name];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill={techColor(name)} aria-hidden="true" focusable="false">
        <path d={brand.path} />
      </svg>
    );
  }
  const glyph = glyphIcons[name];
  if (!glyph) return null;
  const Icon = glyph.icon;
  return <Icon className={className} style={{ color: glyph.color }} strokeWidth={1.75} aria-hidden="true" />;
}
