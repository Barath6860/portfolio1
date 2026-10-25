export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Smoothly scroll to a section by id and move focus there for keyboard users. */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

  // Content above can change height mid-scroll (e.g. lazy-loaded images).
  // Once the smooth scroll settles, snap precisely onto the target.
  if (!reduce && "onscrollend" in window) {
    const realign = () => {
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (Math.abs(el.getBoundingClientRect().top - offset) > 4) el.scrollIntoView({ behavior: "auto", block: "start" });
    };
    window.addEventListener("scrollend", realign, { once: true });
    // If no scroll happens (already in place), don't leave the listener armed.
    window.setTimeout(() => window.removeEventListener("scrollend", realign), 2000);
  }
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  history.replaceState(null, "", id === "home" ? window.location.pathname : `#${id}`);
}

/**
 * Runs `fn` after the next frame has painted. Used after closing an overlay:
 * a smooth scroll started in the same frame the scroll lock is lifted can be
 * silently dropped because the viewport still counts as non-scrollable.
 */
export function afterNextPaint(fn: () => void): void {
  window.requestAnimationFrame(() => window.requestAnimationFrame(fn));
}

export function openExternal(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers without the async clipboard API.
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
