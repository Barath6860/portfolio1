import type { Transition, Variants } from "framer-motion";

/** One easing curve for the whole site: long, soft deceleration — never bouncy. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  quick: 0.35,
  base: 0.8,
  slow: 1.05,
} as const;

export const STAGGER = 0.09;

export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;

export const transition = (delay = 0, duration: number = DURATION.base): Transition => ({ duration, delay, ease: EASE });

/** Fade + restrained upward movement. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: transition(delay) }),
};

/** Clean clip-path reveal for visuals and project imagery. */
export const maskReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0 round 1.25rem)", opacity: 0.4 },
  show: (delay: number = 0) => ({
    clipPath: "inset(0 0 0% 0 round 1.25rem)",
    opacity: 1,
    transition: { duration: DURATION.slow, delay, ease: EASE },
  }),
};

/** Parent that staggers its children's `show` state. */
export const staggerParent = (stagger: number = STAGGER, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Child used inside a stagger parent. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: transition(0, DURATION.base) },
};
