"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { secondaryProjects } from "@/data/projects";
import { onOpenProject } from "@/lib/events";
import { EASE, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectModal } from "@/components/interactive/ProjectModal";
import { TrustScanCaseStudy } from "@/components/trustscan/TrustScanCaseStudy";
import { DocTranslateCaseStudy } from "@/components/doctranslate/DocTranslateCaseStudy";
import { ProjectCard } from "./ProjectCard";

function Divider() {
  return (
    <motion.div
      aria-hidden="true"
      className="my-20 h-px origin-center bg-gradient-to-r from-transparent via-line-strong to-transparent md:my-24"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 1.6, ease: EASE }}
    />
  );
}

function MoreProjects() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const close = useCallback(() => setOpenSlug(null), []);
  useEffect(() => onOpenProject(setOpenSlug), []);
  const open = secondaryProjects.find((p) => p.slug === openSlug) ?? null;

  return (
    <div id="more-projects">
      <SectionHeading
        eyebrow="More projects"
        title="Supporting work"
        description="Smaller projects in productivity and time-series forecasting."
        className="!mb-10"
      />
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="grid gap-6 md:grid-cols-2"
      >
        {secondaryProjects.map((p) => (
          <motion.li key={p.slug} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } } }}>
            <ProjectCard project={p} onOpen={() => setOpenSlug(p.slug)} />
          </motion.li>
        ))}
      </motion.ul>
      <AnimatePresence>{open ? <ProjectModal key={open.slug} project={open} onClose={close} /> : null}</AnimatePresence>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative overflow-x-clip py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="projects-title"
          eyebrow="03 · Selected work"
          title={
            <>
              Engineering stories, <span className="text-gradient">told through real projects</span>
            </>
          }
          description="Two flagship builds — a rule-based research system and a privacy-aware document app — plus supporting work."
        />
        <TrustScanCaseStudy />
        <Divider />
        <DocTranslateCaseStudy />
        <Divider />
        <MoreProjects />
      </div>
    </section>
  );
}
