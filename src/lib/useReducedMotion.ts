"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

/**
 * True when the visitor prefers reduced motion. The server snapshot is `true`,
 * so purely decorative motion (signals, parallax) only starts after hydration.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => true);
}

/** True on devices with a precise pointer (mouse / trackpad) — used to gate pointer parallax. */
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia("(pointer: fine)");
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}
