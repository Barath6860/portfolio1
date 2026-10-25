"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Menu, Search, X } from "lucide-react";
import { navItems, profile, projectAnchors, type SectionId } from "@/data/profile";
import { openCommandPalette } from "@/lib/events";
import { useModal } from "@/lib/useModal";
import { afterNextPaint, cn, scrollToSection } from "@/lib/utils";
import { ThemeToggle } from "@/components/interactive/ThemeToggle";
import { GitHubIcon } from "@/components/ui/BrandIcons";

/** Sections without their own nav item highlight their nearest parent. */
const navAlias: Partial<Record<SectionId, SectionId>> = Object.fromEntries(projectAnchors.map((id) => [id, "projects"]));

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("home");
  useEffect(() => {
    const ids: SectionId[] = [...navItems.map((n) => n.id), ...projectAnchors];
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            setActive(navAlias[id] ?? id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return active;
}

function useScrolled(threshold = 16) {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("scroll", cb, { passive: true });
      return () => window.removeEventListener("scroll", cb);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}

function useIsMac() {
  return useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => false,
  );
}

export function Navbar() {
  const active = useActiveSection();
  const scrolled = useScrolled();
  const isMac = useIsMac();
  const [menuOpen, setMenuOpen] = useState(false);
  // The trap spans the whole header so the menu toggle stays reachable.
  const headerRef = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useModal(menuOpen, headerRef, closeMenu);

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setMenuOpen(false);
    // Let the mobile menu release its scroll lock before scrolling.
    afterNextPaint(() => scrollToSection(id));
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuOpen ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-accent px-4 py-2 text-sm text-accent-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-6">
        <ul className="mx-auto hidden items-center gap-1 rounded-full border border-line bg-surface/50 p-1 backdrop-blur md:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className="relative">
                {isActive ? (
                  <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-accent/12 ring-1 ring-accent/30" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                ) : null}
                <a
                  href={`#${item.id}`}
                  onClick={(e) => go(e, item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn("relative block rounded-full px-3.5 py-1.5 text-sm transition-colors", isActive ? "text-fg" : "text-muted hover:text-fg")}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            onClick={openCommandPalette}
            className="hidden h-10 items-center gap-2 rounded-full border border-line pr-2 pl-3.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg lg:inline-flex"
            aria-label="Open command palette"
          >
            <Search className="size-4" aria-hidden="true" />
            <span>Search</span>
            <kbd className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <button
            type="button"
            onClick={openCommandPalette}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg lg:hidden"
            aria-label="Open command palette"
          >
            <Command className="size-4" aria-hidden="true" />
          </button>
          <ThemeToggle />
          <a
            href={profile.github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
            className="hidden size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg sm:inline-flex"
          >
            <GitHubIcon />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg md:hidden"
          >
            {menuOpen ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <ul className="grid gap-1 px-5 py-4">
              {navItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    aria-current={active === item.id ? "location" : undefined}
                    data-autofocus={i === 0 ? true : undefined}
                    className={cn(
                      "flex min-h-12 items-center justify-between rounded-xl px-4 text-base transition-colors",
                      active === item.id ? "bg-accent/10 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
                    )}
                  >
                    {item.label}
                    <span className="font-mono text-xs text-subtle">0{i}</span>
                  </a>
                </li>
              ))}
              <li className="mt-2 border-t border-line pt-3">
                <a
                  href={profile.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base text-muted hover:bg-surface-2 hover:text-fg"
                >
                  <GitHubIcon /> GitHub
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
