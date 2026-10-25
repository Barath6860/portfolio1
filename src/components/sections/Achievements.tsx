"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, BadgeCheck, ExternalLink, Trophy } from "lucide-react";
import { achievements, certifications } from "@/data/achievements";
import { profile } from "@/data/profile";
import { EASE, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { LinkedInIcon } from "@/components/ui/BrandIcons";
import { trackPointer } from "./ProjectCard";

const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };

function Certifications() {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Certifications"
    >
      {certifications.map((c) => (
        <motion.li key={`${c.issuer}-${c.title}`} variants={item}>
          <div onPointerMove={trackPointer} className="card spotlight group flex h-full flex-col p-5 transition-transform duration-500 hover:-translate-y-1">
            <span className="grid size-10 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent transition-transform duration-500 group-hover:scale-110">
              <BadgeCheck className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-medium text-fg">{c.title}</p>
            <p className="mt-1 text-sm text-muted">
              {c.issuer}
              {c.date ? <span className="text-subtle"> · {c.date}</span> : null}
            </p>
            {c.skills?.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <li key={s} className="rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted">
                    {s}
                  </li>
                ))}
              </ul>
            ) : null}
            {c.credentialUrl ? (
              <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs text-accent hover:underline">
                Show credential <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function AchievementList() {
  return (
    <motion.ol
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Achievements"
    >
      {achievements.map((a) => (
        <motion.li key={a.title} variants={item}>
          <div onPointerMove={trackPointer} className="card spotlight group flex h-full flex-col overflow-hidden transition-transform duration-500 hover:-translate-y-1">
            {a.image ? (
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={a.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                {a.badge ? (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-bg/70 px-2.5 py-1 font-mono text-[10px] tracking-wider text-warning uppercase backdrop-blur">
                    <Trophy className="size-3" aria-hidden="true" />
                    {a.badge}
                  </span>
                ) : null}
              </div>
            ) : null}
            <div className="min-w-0 p-5 pt-3">
              <p className="font-display text-base font-semibold text-fg">{a.title}</p>
              <p className="mt-0.5 text-sm text-muted">
                {a.context}
                {a.date ? <span className="text-subtle"> · {a.date}</span> : null}
              </p>
              {a.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{a.description}</p> : null}
              {a.url ? (
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent hover:underline">
                  View <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}

export function Achievements() {
  const empty = certifications.length === 0 && achievements.length === 0;

  return (
    <section id="achievements" aria-labelledby="achievements-title" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="achievements-title"
          eyebrow="04 · Achievements"
          title={
            certifications.length > 0 ? (
              <>
                Certifications & <span className="text-gradient">achievements</span>
              </>
            ) : (
              <>
                Hackathons & <span className="text-gradient">achievements</span>
              </>
            )
          }
          className="!mb-10"
        />

        {empty ? (
          <Reveal>
            <div className="card relative flex flex-col items-start gap-6 overflow-hidden p-6 sm:flex-row sm:items-center sm:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-[radial-gradient(circle,var(--glow-2),transparent_65%)]" />
              <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent shadow-[0_0_40px_-8px_var(--glow)]">
                <Award className="size-7" aria-hidden="true" />
              </span>
              <div className="relative flex-1">
                <p className="font-display text-lg font-semibold text-fg">My verified certifications live on LinkedIn</p>
                <p className="mt-1 text-sm text-muted">Credentials, courses and recognitions — each with its issuer and verification details.</p>
              </div>
              <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "relative px-6")}>
                <LinkedInIcon /> View on LinkedIn
              </a>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-10">
            {certifications.length > 0 ? <Certifications /> : null}
            {achievements.length > 0 ? <AchievementList /> : null}
            <a
              href={profile.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="-mt-4 inline-flex items-center gap-2 justify-self-start text-sm text-muted transition-colors hover:text-accent"
            >
              <LinkedInIcon /> More on LinkedIn <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
