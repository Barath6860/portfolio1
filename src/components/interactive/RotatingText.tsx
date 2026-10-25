"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function RotatingText({ items, interval = 2800 }: { items: readonly string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || items.length < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => window.clearInterval(t);
  }, [items.length, interval, reduce]);

  return (
    <span className="relative inline-grid h-[1.5em] overflow-hidden align-bottom">
      {/* Screen readers get the full list once instead of constant announcements. */}
      <span className="sr-only">{items.join(". ")}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={items[index]}
          aria-hidden="true"
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
