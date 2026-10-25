"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Lock, X } from "lucide-react";
import type { Project } from "@/data/projects";
import { profile } from "@/data/profile";
import { useModal } from "@/lib/useModal";
import { buttonClass } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { ProjectVisual } from "@/components/sections/ProjectVisual";
import { StatusBadge } from "@/components/sections/ProjectCard";

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useModal(true, dialogRef, onClose);
  const titleId = `project-${project.slug}-title`;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-bg/75 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="card relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden !rounded-b-none border-line-strong !bg-none !bg-surface sm:max-h-[88vh] sm:!rounded-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          data-autofocus
          className="absolute top-3 right-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface/80 text-muted backdrop-blur transition-colors hover:text-fg"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          <div className="relative aspect-[16/7] w-full overflow-hidden border-b border-line">
            {project.image ? (
              <Image src={project.image.src} alt={project.image.alt} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
            ) : (
              <ProjectVisual kind={project.visual} />
            )}
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            <header>
              {project.status ? (
                <div className="mb-3">
                  <StatusBadge status={project.status} />
                </div>
              ) : null}
              <h3 id={titleId} className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {project.title}
              </h3>
              <p className="mt-1 text-accent">{project.subtitle}</p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2">
              <Block title="The problem">{project.problem}</Block>
              <Block title="What it does">{project.solution}</Block>
            </div>

            <div>
              <BlockTitle>Key features</BlockTitle>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div>
                <BlockTitle>Technologies</BlockTitle>
                {project.tech.length > 0 ? (
                  <>
                    <ul className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <li key={t} className="rounded-md border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-fg">
                          {t}
                        </li>
                      ))}
                    </ul>
                    {!project.techConfirmed ? (
                      <p className="mt-2 text-xs text-subtle">Stack listed for reference — pending confirmation.</p>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-subtle">Tech stack details will be added once confirmed.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap">
              {project.links.repo ? (
                <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
                  <GitHubIcon className="size-4" /> View source
                </a>
              ) : (
                <p className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dashed border-line-strong px-5 text-sm text-subtle">
                  <Lock className="size-4" aria-hidden="true" /> Repository not public yet
                </p>
              )}
              {project.links.demo ? (
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
                  Live demo <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              ) : (
                <p className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dashed border-line-strong px-5 text-sm text-subtle">
                  No live demo yet
                </p>
              )}
              {!project.links.repo ? (
                <a
                  href={profile.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm text-accent hover:underline sm:ml-auto"
                >
                  Browse my public GitHub <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BlockTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-3 font-mono text-xs tracking-[0.18em] text-subtle uppercase">{children}</h4>;
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <BlockTitle>{title}</BlockTitle>
      <p className="text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}
