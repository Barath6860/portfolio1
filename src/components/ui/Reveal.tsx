"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, maskReveal, viewportOnce } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & {
  delay?: number;
  /** "up": fade with a slight rise (default). "mask": clip-path reveal for visuals. */
  variant?: "up" | "mask";
};

/** Reveals content the first time it enters the viewport. Reduced motion is handled by MotionConfig. */
export function Reveal({ delay = 0, variant = "up", children, ...rest }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      custom={delay}
      variants={variant === "mask" ? maskReveal : fadeUp}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
