"use client";

import { MotionConfig } from "framer-motion";

/** Framer Motion follows the visitor's reduced-motion preference everywhere. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
