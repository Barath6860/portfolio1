"use client";

import { motion } from "framer-motion";
import { Activity, BookOpen, Brain, FileBarChart2, FileInput, GitBranch, Info, Scale, ShieldCheck, type LucideIcon } from "lucide-react";
import { trustscan } from "@/data/projects";
import { EASE, viewportOnce } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { buttonClass } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { BrainNetwork } from "@/components/visuals/BrainNetwork";
import { trackPointer } from "@/components/sections/ProjectCard";
import { decisionColor } from "./decisionStyles";

const stageIcons: Record<string, LucideIcon> = {
  input: FileInput,
  regions: Brain,
  measurements: Activity,
  rules: GitBranch,
  decision: ShieldCheck,
  audit: Scale,
};

function Bar({ value, max, color, delay }: { value: number; max: number; color: string; delay: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
      <motion.div
        className="h-full origin-left rounded-full"
        style={{ width: `${(value / max) * 100}%`, background: color }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.2, delay, ease: EASE }}
      />
    </div>
  );
}

function Pipeline() {
  return (
    <motion.ol initial="hidden" whileInView="show" viewport={viewportOnce} className="relative grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-6" aria-label="TrustScan pipeline">
      <motion.span
        aria-hidden="true"
        className="absolute top-6 right-[8%] left-[8%] hidden h-px origin-left bg-gradient-to-r from-accent via-accent-2 to-accent lg:block"
        variants={{ hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: 1, opacity: 0.45, transition: { duration: 1.6, ease: EASE } } }}
      />
      {trustscan.pipeline.map((s, i) => {
        const Icon = stageIcons[s.id] ?? Activity;
        return (
          <motion.li
            key={s.id}
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15 + i * 0.12, ease: EASE } } }}
            className="group relative flex flex-col items-center text-center"
          >
            <span className="relative grid size-12 place-items-center rounded-2xl border border-line-strong bg-surface text-muted transition-all duration-500 group-hover:-translate-y-1 group-hover:border-accent/60 group-hover:text-accent group-hover:shadow-[0_0_30px_-6px_var(--glow)]">
              <Icon className="size-5" aria-hidden="true" />
              <span className="absolute -top-1.5 -right-1.5 grid size-[18px] place-items-center rounded-full border border-line bg-bg font-mono text-[9px] text-subtle">{i + 1}</span>
            </span>
            <span className="mt-3 text-sm font-medium text-fg">{s.title}</span>
            <span className="mt-0.5 font-mono text-[10px] leading-snug text-subtle">{s.short}</span>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

function OutcomesCard() {
  return (
    <div onPointerMove={trackPointer} className="card spotlight h-full p-6">
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Three outcomes</p>
      <ul className="mt-5 grid gap-3">
        {(Object.keys(trustscan.decisions) as Array<keyof typeof trustscan.decisions>).map((k) => (
          <li key={k} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 p-3 transition-colors duration-300 hover:border-line-strong">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: decisionColor[k], boxShadow: `0 0 12px ${decisionColor[k]}` }} aria-hidden="true" />
            <span className="w-20 shrink-0 text-sm font-medium text-fg">{trustscan.decisions[k].label}</span>
            <span className="text-xs text-muted">{trustscan.decisions[k].meaning}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-subtle">Fixed IF–THEN rules: the highest triggered outcome wins, and every decision lists the rules that fired.</p>
    </div>
  );
}

function LosoCard() {
  const { loso } = trustscan;
  return (
    <figure onPointerMove={trackPointer} className="card spotlight h-full p-6">
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Coverage vs fairness</p>
      <p className="mt-1 text-xs text-muted">{loso.context}</p>
      {(["coverage", "gap"] as const).map((metric, mi) => (
        <div key={metric} className="mt-5">
          <p className="mb-2.5 text-xs text-fg">{metric === "coverage" ? "Scans released · higher is better" : "ASD vs control deferral gap · lower is better"}</p>
          <div className="grid gap-2.5">
            {loso.policies.map((p, i) => {
              const ts = "highlight" in p && p.highlight;
              return (
                <div key={p.name} className="grid gap-1">
                  <div className="flex justify-between gap-2 text-[11px]">
                    <span className={ts ? "text-fg" : "text-muted"}>{p.name}</span>
                    <AnimatedNumber value={p[metric]} suffix="%" className="font-mono text-fg" />
                  </div>
                  <Bar
                    value={p[metric]}
                    max={metric === "coverage" ? 100 : 10}
                    color={ts ? "var(--accent)" : metric === "gap" ? "var(--warning)" : "var(--silver)"}
                    delay={0.2 + mi * 0.3 + i * 0.15}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <figcaption className="mt-4 text-[11px] text-subtle">Source: RESULTS.md</figcaption>
    </figure>
  );
}

function HeldOutCard() {
  const { heldOut } = trustscan;
  // Left edge of each stacked segment = sum of the segments before it.
  const lefts = heldOut.distribution.map((_, i) => heldOut.distribution.slice(0, i).reduce((sum, d) => sum + d.value, 0));
  return (
    <figure onPointerMove={trackPointer} className="card spotlight h-full p-6">
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent-2 uppercase">Held-out results</p>
      <p className="mt-1 text-xs text-muted">{heldOut.context}</p>
      <div className="relative mt-5 h-3 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={heldOut.distribution.map((d) => `${d.label} ${d.value}%`).join(", ")}>
        {heldOut.distribution.map((d, i) => (
          <motion.div
            key={d.key}
            className="absolute inset-y-0 origin-left"
            style={{ left: `${lefts[i]}%`, width: `${d.value}%`, background: decisionColor[d.key] }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.45, ease: EASE }}
          />
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2">
        {heldOut.distribution.map((d) => (
          <div key={d.key}>
            <dt className="flex items-center gap-1.5 font-mono text-[10px] text-subtle uppercase">
              <span className="size-1.5 rounded-full" style={{ background: decisionColor[d.key] }} aria-hidden="true" />
              {d.label}
            </dt>
            <dd className="mt-1 font-display text-xl font-semibold text-fg">
              <AnimatedNumber value={d.value} suffix="%" />
            </dd>
          </div>
        ))}
      </dl>
      <dl className="mt-5 grid gap-1.5 border-t border-line pt-4 text-xs">
        <div className="flex justify-between">
          <dt className="text-muted">ASD / control withheld</dt>
          <dd className="font-mono text-fg">
            {heldOut.asdWithheld.toFixed(1)}% / {heldOut.controlWithheld.toFixed(1)}%
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-medium text-fg">Deferral gap</dt>
          <dd className="font-mono text-accent">
            <AnimatedNumber value={heldOut.gap} suffix="%" />
          </dd>
        </div>
      </dl>
    </figure>
  );
}

export function TrustScanCaseStudy() {
  const { links } = trustscan;
  return (
    <article id="trustscan" aria-labelledby="trustscan-title" className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-40 -top-40 -z-10 h-[46rem] bg-[radial-gradient(32%_38%_at_68%_45%,var(--glow-2),transparent_70%),radial-gradient(28%_32%_at_28%_30%,var(--glow),transparent_70%)]" />

      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              Flagship project · 01
            </p>
          </Reveal>
          <div className="mt-5 overflow-hidden pb-2">
            <motion.h3
              id="trustscan-title"
              className="font-display text-5xl font-semibold tracking-[-0.03em] text-fg sm:text-6xl"
              initial={{ y: "105%" }}
              whileInView={{ y: "0%" }}
              viewport={viewportOnce}
              transition={{ duration: 1.05, ease: EASE }}
            >
              {trustscan.title}
            </motion.h3>
          </div>
          <Reveal delay={0.12}>
            <p className="font-display text-xl text-gradient sm:text-2xl">{trustscan.subtitle}</p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted">{trustscan.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Project characteristics">
              {trustscan.badges.map((b) => (
                <li key={b} className="rounded-full border border-line-strong bg-surface/60 px-3 py-1 font-mono text-[11px] text-muted">
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.24} className="mt-7 flex flex-wrap gap-3">
            <a href={links.repo} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "px-6")}>
              <GitHubIcon /> Source code
            </a>
            <a href={links.readme} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
              <BookOpen className="size-4" aria-hidden="true" /> Methodology
            </a>
            <a href={links.results} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
              <FileBarChart2 className="size-4" aria-hidden="true" /> Results
            </a>
          </Reveal>
        </div>

        <Reveal variant="mask" delay={0.1} className="min-w-0">
          <div className="card relative overflow-hidden !rounded-3xl border-line-strong p-4 sm:p-6">
            <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
            <BrainNetwork delay={0.3} className="relative" title="Abstract resting-state connectivity network illustrating region-to-region connections" />
          </div>
        </Reveal>
      </div>

      <div className="mt-16">
        <Pipeline />
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        <Reveal className="min-w-0">
          <OutcomesCard />
        </Reveal>
        <Reveal delay={0.1} className="min-w-0">
          <LosoCard />
        </Reveal>
        <Reveal delay={0.2} className="min-w-0">
          <HeldOutCard />
        </Reveal>
      </div>

      <Reveal className="mt-5">
        <p className="flex items-start gap-2.5 rounded-xl border border-line bg-surface/40 px-4 py-3 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          {trustscan.note}
        </p>
      </Reveal>
    </article>
  );
}
