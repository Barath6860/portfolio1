"use client";

import { motion } from "framer-motion";
import { skillCategories, type Skill, type SkillCategory } from "@/data/skills";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechIcon, techColor } from "@/components/ui/TechIcon";
import { trackPointer } from "./ProjectCard";

function SkillChip({ skill, learning }: { skill: Skill; learning: boolean }) {
  return (
    <li
      tabIndex={0}
      className="group/chip relative flex items-center gap-2.5 rounded-xl border border-line bg-surface-2/50 py-2 pr-3.5 pl-2 text-sm text-fg transition-all duration-300 outline-none hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--chip)_50%,transparent)] hover:bg-surface-2 focus-visible:border-accent/60"
      style={{ "--chip": techColor(skill.icon) } as React.CSSProperties}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface transition-transform duration-300 group-hover/chip:scale-110">
        <TechIcon name={skill.icon} className="size-4" />
      </span>
      {skill.name}
      {learning ? <span className="sr-only"> (currently learning)</span> : null}
      {/* Hover / focus description */}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 translate-y-1 rounded-lg border border-line-strong bg-surface px-3 py-2 text-xs leading-relaxed text-muted opacity-0 shadow-xl transition-all duration-300 group-hover/chip:translate-y-0 group-hover/chip:opacity-100 group-focus-visible/chip:translate-y-0 group-focus-visible/chip:opacity-100"
      >
        {skill.description}
      </span>
    </li>
  );
}

function CategoryCard({ category }: { category: SkillCategory }) {
  const learning = category.id === "learning";
  return (
    <div
      onPointerMove={trackPointer}
      className={cn(
        "card spotlight h-full p-5 sm:p-6",
        learning && "border-dashed !border-accent-2/40 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-2)_7%,var(--surface)),var(--surface))]",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-fg">{category.label}</h3>
        <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase", learning ? "border-accent-2/40 text-accent-2" : "border-line text-subtle")}>
          {learning ? "Exploring" : "Using"}
        </span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {category.skills.map((s) => (
          <SkillChip key={`${category.id}-${s.name}`} skill={s} learning={learning} />
        ))}
      </ul>
    </div>
  );
}

const span: Record<string, string> = { learning: "lg:col-span-2" };

export function TechArsenal() {
  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative overflow-x-clip py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-96 bg-[radial-gradient(50%_50%_at_50%_50%,var(--glow-2),transparent)]" />
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="expertise-title"
          eyebrow="02 · Expertise"
          title={
            <>
              Tools I build with — <span className="text-gradient">and what&apos;s next</span>
            </>
          }
          description="Grouped by how I use them, with what I'm still exploring clearly marked. Hover a skill for details."
          className="!mb-10"
        />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {skillCategories.map((c) => (
            <motion.div
              key={c.id}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } } }}
              className={cn("min-w-0", span[c.id])}
            >
              <CategoryCard category={c} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
