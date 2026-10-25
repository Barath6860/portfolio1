"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { scrollToSection } from "@/lib/utils";

/** Thin reading-progress bar plus a back-to-top button. */
export function ScrollUI() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [showTop, setShowTop] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setShowTop(y > 700));

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-gradient-to-r from-accent to-accent-2"
        style={{ scaleX }}
      />
      <AnimatePresence>
        {showTop ? (
          <motion.button
            type="button"
            onClick={() => scrollToSection("home")}
            aria-label="Back to top"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            className="fixed right-5 bottom-5 z-40 inline-flex size-11 items-center justify-center rounded-full border border-line-strong bg-surface/80 text-muted shadow-lg backdrop-blur transition-colors hover:border-accent/50 hover:text-accent sm:right-8 sm:bottom-8"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </>
  );
}
