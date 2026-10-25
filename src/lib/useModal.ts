"use client";

import { useLayoutEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let lockCount = 0;

/**
 * Shared modal behaviour: locks background scroll, traps Tab focus inside
 * `containerRef`, closes on Escape and restores focus to the opener.
 *
 * A layout effect so the scroll lock is released synchronously on close —
 * otherwise a smooth scroll started right after closing can be cancelled
 * when the lock is lifted mid-scroll.
 */
export function useModal(open: boolean, containerRef: RefObject<HTMLElement | null>, onClose: () => void) {
  useLayoutEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;

    if (lockCount === 0) {
      body.style.overflow = "hidden";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    lockCount++;

    const focusFirst = window.requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container || container.contains(document.activeElement)) return;
      const preferred = container.querySelector<HTMLElement>("[data-autofocus]");
      (preferred ?? container.querySelector<HTMLElement>(FOCUSABLE) ?? container).focus();
    });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;
      const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFirst);
      document.removeEventListener("keydown", onKeyDown);
      lockCount--;
      if (lockCount === 0) {
        body.style.overflow = "";
        body.style.paddingRight = "";
      }
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, containerRef, onClose]);
}
