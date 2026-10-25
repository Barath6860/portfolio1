"use client";

import { motion } from "framer-motion";
import { about, profile } from "@/data/profile";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { Terminal } from "@/components/interactive/Terminal";
import { trackPointer } from "./ProjectCard";

function Chips({ items, tone = "accent" }: { items: readonly string[]; tone?: "accent" | "violet" }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t, i) => (
        <motion.li
          key={t}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 * i, ease: EASE }}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-sm",
            tone === "accent" ? "border-accent/25 bg-accent/5 text-fg" : "border-accent-2/30 bg-accent-2/5 text-fg",
          )}
        >
          {t}
        </motion.li>
      ))}
    </ul>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">{label}</p>
      {children}
    </div>
  );
}

/** Developer profile panel: role, background, interests and learning goals stacked in order. */
function ProfilePanel() {
  return (
    <div onPointerMove={trackPointer} className="card spotlight p-6 sm:p-7">
      <div className="flex items-center gap-4">
        <div className="relative grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 font-display text-xl font-semibold text-accent-ink shadow-[0_10px_30px_-10px_var(--glow)]">
          {profile.initials}
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold text-fg">{profile.name}</p>
          <p className="text-sm text-muted">{profile.role}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        <Group label="Programming background">
          <Chips items={about.programming} />
        </Group>
        <Group label="Main interests">
          <Chips items={profile.interests} />
        </Group>
        <Group label="Learning goals">
          <Chips items={about.learningGoals} tone="violet" />
        </Group>
      </div>

      <div className="mt-6 flex gap-2">
        <a href={profile.github.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-sm text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-fg">
          <GitHubIcon /> GitHub
        </a>
        <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-sm text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-fg">
          <LinkedInIcon /> LinkedIn
        </a>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_35%_at_85%_20%,var(--glow-2),transparent)]" />
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="about-title"
          eyebrow="01 · About"
          title={
            <>
              A student developer who <span className="text-gradient">learns by implementing</span>
            </>
          }
        />

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <div className="min-w-0 space-y-6">
            {about.intro.map((p, i) => (
              <Reveal key={p} delay={i * 0.1}>
                <p className="text-base leading-relaxed text-pretty text-muted md:text-lg">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <Terminal />
            </Reveal>
          </div>
          <Reveal delay={0.1} className="min-w-0">
            <ProfilePanel />
          </Reveal>
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="Principles" title="How I think about building software" className="!mb-10" />
          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {about.principles.map((p, i) => (
              <motion.li key={p.title} variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } } }}>
                <div onPointerMove={trackPointer} className="card spotlight group h-full p-5 transition-transform duration-500 hover:-translate-y-1">
                  <span className="font-mono text-xs text-accent">0{i + 1}</span>
                  <span aria-hidden="true" className="mt-3 block h-px w-8 bg-accent/40 transition-all duration-500 group-hover:w-14 group-hover:bg-accent" />
                  <p className="mt-3 font-display font-semibold text-fg">{p.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
