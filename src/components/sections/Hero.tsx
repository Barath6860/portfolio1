"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/lib/utils";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { buttonClass } from "@/components/ui/Button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { RotatingText } from "@/components/interactive/RotatingText";
import { Ambient, SignalWave } from "@/components/visuals/Ambient";
import { BrainNetwork } from "@/components/visuals/BrainNetwork";
import { Orbits } from "@/components/visuals/Orbits";

/*
 * Entrance choreography (CSS, so it plays before hydration):
 * ambient 0ms → status 500 → label 650 → name 760 → headline 960/1100 →
 * descriptor 1280 → text 1400 → CTAs 1540/1640/1740 → visual 900 (draws until ~3.5s)
 */
const at = (ms: number) => ({ animationDelay: `${ms}ms` });

function HeroVisual() {
  const reduce = usePrefersReducedMotion();
  const fine = useFinePointer();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18 });
  const sy = useSpring(py, { stiffness: 40, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-7, 7]);
  const rotateX = useTransform(sy, [-1, 1], [6, -6]);
  const interactive = fine && !reduce;

  return (
    <div
      className="animate-fade-in relative mx-auto w-full max-w-[34rem] [perspective:1200px]"
      style={at(900)}
      onPointerMove={(e) => {
        if (!interactive) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div style={interactive ? { rotateX, rotateY } : undefined} className="relative [transform-style:preserve-3d]">
        <div aria-hidden="true" className="absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_68%)] blur-2xl" />
        <Orbits />
        <BrainNetwork
          immediate
          delay={1}
          title="Abstract animated brain-connectivity network inspired by TrustScan"
        />
      </motion.div>
      <SignalWave className="mt-2 h-10 w-full" />
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-name" className="relative isolate flex min-h-[100svh] items-center overflow-x-clip pt-28 pb-24 lg:pt-24">
      <Ambient />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="min-w-0">
          <p
            className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface/60 py-1.5 pr-4 pl-3 font-mono text-[11px] tracking-[0.16em] text-muted backdrop-blur"
            style={at(500)}
          >
            <span className="relative flex size-2" aria-hidden="true">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-success" />
              <span className="relative size-2 rounded-full bg-success" />
            </span>
            {profile.systemStatus}
          </p>

          <p className="animate-rise mt-8 font-mono text-xs tracking-[0.3em] text-accent" style={at(650)}>
            {profile.label.toUpperCase()}
          </p>

          <h1 id="hero-name" className="mt-4 overflow-hidden pb-2">
            <span
              className="animate-mask-up block font-display text-[2.7rem] leading-[1] font-semibold tracking-[-0.03em] text-fg sm:text-6xl lg:text-7xl"
              style={at(760)}
            >
              {profile.displayName}
            </span>
          </h1>

          <p className="mt-5 font-display text-2xl leading-[1.15] font-medium tracking-tight text-silver sm:text-3xl lg:text-[2.15rem]">
            {profile.headlineLines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <span className={`animate-mask-up block ${i === 1 ? "text-gradient" : ""}`} style={at(960 + i * 140)}>
                  {line}
                </span>
              </span>
            ))}
          </p>

          <p className="animate-rise mt-6 font-mono text-sm text-muted" style={at(1280)}>
            <span className="text-subtle">{"> "}</span>
            <RotatingText items={profile.descriptors} />
          </p>

          <p className="animate-rise mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg" style={at(1400)}>
            {profile.summary}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("projects");
              }}
              className={buttonClass("primary", "animate-rise px-6")}
              style={at(1540)}
            >
              Explore My Work
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href={profile.github.url} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "animate-rise px-6")} style={at(1640)}>
              <GitHubIcon className="size-4" />
              GitHub Profile
            </a>
            <a
              href={profile.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-rise group inline-flex min-h-11 items-center justify-center gap-2 px-3 text-sm text-muted transition-colors hover:text-fg sm:justify-start"
              style={at(1740)}
            >
              <LinkedInIcon className="size-4 transition-colors group-hover:text-accent" />
              Connect on LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <HeroVisual />
        </div>
      </div>

      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("about");
        }}
        className="animate-fade-in absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-subtle transition-colors hover:text-fg md:flex"
        style={at(2400)}
        aria-label="Scroll to About section"
      >
        <span className="flex h-9 w-5 justify-center rounded-full border border-line-strong pt-1.5">
          <span className="animate-scroll-dot size-1 rounded-full bg-accent" />
        </span>
        <ArrowDown className="size-3.5" aria-hidden="true" />
      </a>
    </section>
  );
}
