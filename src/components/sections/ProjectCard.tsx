"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectStatus } from "@/data/projects";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { ProjectVisual } from "./ProjectVisual";

const statusStyles: Record<ProjectStatus, string> = {
  Prototype: "text-accent border-accent/30 bg-accent/10",
  Concept: "text-accent-2 border-accent-2/30 bg-accent-2/10",
  "Hackathon project": "text-warning border-warning/30 bg-warning/10",
  "In progress": "text-accent border-accent/30 bg-accent/10",
  Completed: "text-success border-success/30 bg-success/10",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px]", statusStyles[status])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

/** Updates the --mx/--my custom properties used by the `spotlight` utility. */
export function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

/** Compact card for supporting projects; the whole card opens the detail dialog. */
export function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <article onPointerMove={trackPointer} className="card spotlight group flex h-full flex-col overflow-hidden transition-transform duration-500 hover:-translate-y-1">
      <div className="relative aspect-[16/7] overflow-hidden border-b border-line">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          {project.image ? (
            <Image src={project.image.src} alt={project.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          ) : (
            <ProjectVisual kind={project.visual} />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {project.status ? (
          <div className="mb-3">
            <StatusBadge status={project.status} />
          </div>
        ) : null}
        <h4 className="font-display text-lg font-semibold tracking-tight text-fg">
          {/* Stretched button: the whole card opens the details dialog. */}
          <button
            type="button"
            onClick={onOpen}
            className="text-left after:absolute after:inset-0 after:z-[2] after:content-[''] focus-visible:outline-none [&:focus-visible]:after:rounded-[1.25rem] [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-accent"
            aria-haspopup="dialog"
          >
            {project.title}
          </button>
        </h4>
        <p className="mt-1 text-sm text-accent">{project.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">{project.summary}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tech.map((t) => (
              <li key={t} className="rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
                {t}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors group-hover:text-accent">
            {project.links.repo ? <GitHubIcon className="size-3.5" /> : null}
            Details
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
