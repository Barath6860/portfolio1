"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { EASE, viewportOnce } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { CopyButton } from "@/components/ui/CopyButton";
import { buttonClass } from "@/components/ui/Button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { SignalWave } from "@/components/visuals/Ambient";
import { trackPointer } from "./ProjectCard";

function LinkCard({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={trackPointer}
      className="card spotlight group flex items-center gap-4 p-5 transition-all duration-500 hover:-translate-y-1"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-fg transition-all duration-500 group-hover:scale-105 group-hover:text-accent">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-fg">{label}</span>
        <span className="block truncate font-mono text-xs text-muted">{value}</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

const headline = ["Let's turn the next idea", "into something real."];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden py-28 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_70%,#000_30%,transparent_100%)]" />
        <div className="animate-breathe absolute bottom-0 left-1/2 h-[32rem] w-[64rem] max-w-[200vw] -translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_65%)]" />
        <div className="animate-drift-alt absolute top-10 -left-40 size-[26rem] rounded-full bg-[radial-gradient(circle,var(--glow-2),transparent_65%)]" />
        <SignalWave className="absolute inset-x-0 bottom-24 h-16 w-full opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} className="mx-auto max-w-3xl text-center">
          <motion.p
            className="mb-5 font-mono text-xs tracking-[0.22em] text-accent uppercase"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8 } } }}
          >
            05 · Contact
          </motion.p>
          <h2 id="contact-title" className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-fg sm:text-5xl md:text-6xl">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className={i === 1 ? "text-gradient block" : "block"}
                  variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1.05, delay: 0.1 + i * 0.14, ease: EASE } } }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.4, ease: EASE } } }}
          >
            Have a project, a question about my work or an idea worth building? I&apos;d be glad to hear from you.
          </motion.p>
        </motion.div>

        <Reveal delay={0.15} className="mx-auto mt-12 max-w-3xl">
          <div className="card relative overflow-hidden p-6 sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_65%)]" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">Email</p>
                  <a href={`mailto:${profile.email}`} className="block truncate font-display text-lg text-fg transition-colors hover:text-accent sm:text-xl">
                    {profile.email}
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`mailto:${profile.email}`} className={buttonClass("primary", "px-6")}>
                  <Mail className="size-4" aria-hidden="true" /> Send an email
                </a>
                <CopyButton value={profile.email} label="Copy email" className="min-h-11" />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-4 grid max-w-3xl gap-4 sm:grid-cols-2">
          <Reveal delay={0.2} className="min-w-0">
            <LinkCard href={profile.github.url} icon={<GitHubIcon className="size-5" />} label="GitHub" value={`github.com/${profile.github.username}`} />
          </Reveal>
          <Reveal delay={0.28} className="min-w-0">
            <LinkCard href={profile.linkedin.url} icon={<LinkedInIcon className="size-5" />} label="LinkedIn" value={`linkedin.com/in/${profile.linkedin.handle}`} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
