"use client";

import { motion } from "framer-motion";
import { BookMarked, BookOpen, Cpu, FileText, ListChecks, ShieldCheck, type LucideIcon } from "lucide-react";
import { doctranslate } from "@/data/projects";
import { EASE, viewportOnce } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { trackPointer } from "@/components/sections/ProjectCard";
import { TranslationPipeline } from "./TranslationPipeline";

const highlightIcons: LucideIcon[] = [ShieldCheck, BookMarked, Cpu, ListChecks];

/** Editorial stack of document cards: English source behind, Spanish output in front. Fictional text. */
function DocStack() {
  const cards = [
    { lang: "EN", title: "Quarterly report", lines: [70, 92, 54, 80], rotate: -6, x: -28, y: 10, delay: 0 },
    { lang: "ES", title: "Informe trimestral", lines: [76, 60, 88, 48], rotate: 4, x: 26, y: -6, delay: 0.2 },
  ];
  return (
    <div className="relative mx-auto h-72 w-full max-w-md" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--glow-2),transparent_62%)]" />
      {cards.map((c, i) => (
        <motion.div
          key={c.lang}
          className="absolute top-1/2 left-1/2 w-60 rounded-2xl border border-line-strong bg-surface p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]"
          initial={{ opacity: 0, x: "-50%", y: "-40%", rotate: 0 }}
          whileInView={{ opacity: 1, x: `calc(-50% + ${c.x}px)`, y: `calc(-50% + ${c.y}px)`, rotate: c.rotate }}
          viewport={viewportOnce}
          transition={{ duration: 1.2, delay: 0.3 + c.delay, ease: EASE }}
          style={{ zIndex: i }}
        >
          <div className="flex items-center justify-between">
            <FileText className="size-4 text-accent-2" />
            <span className="rounded bg-accent-2/15 px-1.5 py-0.5 font-mono text-[10px] text-accent-2">{c.lang}</span>
          </div>
          <p className="mt-4 font-display text-base font-semibold text-fg">{c.title}</p>
          <div className="mt-3 grid gap-2">
            {c.lines.map((w, li) =>
              li === 1 ? (
                <span key={li} className="flex items-center gap-1.5">
                  <span className="h-2 w-10 rounded-full bg-muted/30" />
                  <span className="rounded bg-accent/15 px-1.5 font-mono text-[9px] text-accent">[EMAIL_1]</span>
                </span>
              ) : (
                <span key={li} className="h-2 rounded-full bg-muted/25" style={{ width: `${w}%` }} />
              ),
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function DocTranslateCaseStudy() {
  const { links } = doctranslate;
  return (
    <article id="doctranslate" aria-labelledby="doctranslate-title" className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-40 -top-40 -z-10 h-[44rem] bg-[radial-gradient(35%_40%_at_30%_45%,var(--glow-2),transparent_70%)]" />

      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent-2/30 bg-accent-2/5 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-accent-2 uppercase">
              <span className="size-1.5 rounded-full bg-accent-2" aria-hidden="true" />
              Flagship project · 02
            </p>
          </Reveal>
          <div className="mt-5 overflow-hidden pb-2">
            <motion.h3
              id="doctranslate-title"
              className="font-display text-4xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl"
              initial={{ y: "105%" }}
              whileInView={{ y: "0%" }}
              viewport={viewportOnce}
              transition={{ duration: 1.05, ease: EASE }}
            >
              {doctranslate.title}
            </motion.h3>
          </div>
          <Reveal delay={0.12}>
            <p className="font-display text-xl text-accent-2 sm:text-2xl">{doctranslate.subtitle}</p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted">{doctranslate.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
              {doctranslate.stack.map((t) => (
                <li key={t} className="rounded-md border border-line bg-surface-2/70 px-2.5 py-1 font-mono text-[11px] text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.24} className="mt-7 flex flex-wrap gap-3">
            <a href={links.repo} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "!bg-accent-2 px-6 hover:brightness-110")}>
              <GitHubIcon /> Repository
            </a>
            <a href={links.report} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
              <FileText className="size-4" aria-hidden="true" /> Implementation report
            </a>
            <a href={links.manual} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
              <BookOpen className="size-4" aria-hidden="true" /> User manual
            </a>
          </Reveal>
        </div>
        <div className="min-w-0">
          <DocStack />
        </div>
      </div>

      <Reveal className="mt-12">
        <TranslationPipeline />
      </Reveal>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {doctranslate.highlights.map((f, i) => {
          const Icon = highlightIcons[i] ?? FileText;
          return (
            <motion.li
              key={f.title}
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } } }}
              onPointerMove={trackPointer}
              className="card spotlight group p-5 transition-transform duration-500 hover:-translate-y-1"
            >
              <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface-2 text-accent-2 transition-transform duration-500 group-hover:scale-110">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-medium text-fg">{f.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
            </motion.li>
          );
        })}
      </motion.ul>
    </article>
  );
}
