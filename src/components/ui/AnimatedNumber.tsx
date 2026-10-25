"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
};

/**
 * Counts up to `value` the first time it scrolls into view. The real value is
 * rendered on the server and for reduced motion, so it is never wrong or empty.
 */
export function AnimatedNumber({ value, decimals = 1, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the exact final value. */}
      <span aria-hidden="true">
        {display.toFixed(decimals)}
        {suffix}
      </span>
      <span className="sr-only">
        {value.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}
