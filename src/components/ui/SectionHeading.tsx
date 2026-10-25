"use client";

import { motion } from "framer-motion";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
};

/** Eyebrow line draws in, the heading rises out of a mask, the description fades up. */
export function SectionHeading({ eyebrow, title, description, id, align = "left", className }: Props) {
  const center = align === "center";
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={cn("mb-12 max-w-2xl md:mb-16", center && "mx-auto text-center", className)}
    >
      <p className={cn("mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-accent uppercase", center && "justify-center")}>
        <motion.span
          aria-hidden="true"
          className="h-px w-10 origin-left bg-gradient-to-r from-transparent to-accent"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } } }}
        />
        <motion.span variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8, delay: 0.15 } } }}>{eyebrow}</motion.span>
      </p>
      <div className="overflow-hidden pb-1">
        <motion.h2
          id={id}
          className="font-display text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl md:text-5xl"
          variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1, delay: 0.1, ease: EASE } } }}
        >
          {title}
        </motion.h2>
      </div>
      {description ? (
        <motion.p
          className="mt-5 text-base leading-relaxed text-pretty text-muted md:text-lg"
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.3, ease: EASE } } }}
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
