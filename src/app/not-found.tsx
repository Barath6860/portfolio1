import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { profile } from "@/data/profile";
import { buttonClass } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/BrandIcons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden px-5 py-20">
      <div aria-hidden="true" className="bg-grid mask-fade-b absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute top-1/4 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_65%)] blur-2xl" />

      <div className="w-full max-w-xl">
        <div className="card overflow-hidden !rounded-2xl font-mono text-sm">
          <div className="flex items-center gap-1.5 border-b border-line bg-surface-2/70 px-4 py-3" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="space-y-2 p-5 leading-relaxed">
            <p>
              <span className="text-success">barath</span>
              <span className="text-subtle">:~$</span> cd ./this-page
            </p>
            <p className="text-warning">bash: cd: ./this-page: No such file or directory</p>
            <p className="text-muted">Exit code 404 — the page you&apos;re looking for doesn&apos;t exist or has moved.</p>
            <p>
              <span className="text-success">barath</span>
              <span className="text-subtle">:~$</span> <span className="animate-caret inline-block h-4 w-2 translate-y-0.5 bg-accent" />
            </p>
          </div>
        </div>

        <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Page <span className="text-gradient">not found.</span>
        </h1>
        <p className="mt-4 text-muted">Let&apos;s get you back to something that works.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={buttonClass("primary")}>
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
          </Link>
          <a href={profile.github.url} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
            <GitHubIcon /> View GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
