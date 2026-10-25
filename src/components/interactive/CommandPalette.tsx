"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AtSign, CornerDownLeft, FolderGit2, Hash, Mail, Moon, Search, Sun } from "lucide-react";
import { navItems, profile } from "@/data/profile";
import { secondaryProjects } from "@/data/projects";
import { onOpenCommandPalette, openProject } from "@/lib/events";
import { toggleTheme, useTheme } from "@/lib/theme";
import { useModal } from "@/lib/useModal";
import { afterNextPaint, cn, copyText, openExternal, scrollToSection } from "@/lib/utils";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";

type Item = {
  id: string;
  group: "Navigate" | "Projects" | "Links" | "Actions";
  label: string;
  hint?: string;
  keywords?: string;
  icon: React.ReactNode;
  perform: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const theme = useTheme();
  const listId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useModal(open, dialogRef, close);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    const off = onOpenCommandPalette(() => setOpen(true));
    return () => {
      window.removeEventListener("keydown", onKey);
      off();
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 2200);
    return () => window.clearTimeout(t);
  }, [notice]);

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [
      ...navItems.map((n) => ({
        id: `nav-${n.id}`,
        group: "Navigate" as const,
        label: n.id === "home" ? "Go to Home" : n.id === "expertise" ? "Show Skills" : `Go to ${n.label}`,
        hint: `#${n.id}`,
        keywords: `go section scroll ${n.label} ${n.id === "expertise" ? "skills tech arsenal" : ""}`,
        icon: <Hash className="size-4" />,
        perform: () => scrollToSection(n.id),
      })),
      {
        id: "project-trustscan",
        group: "Projects",
        label: "Open TrustScan",
        hint: "Flagship · 01",
        keywords: "fmri rule based expert system bias audit case study",
        icon: <FolderGit2 className="size-4" />,
        perform: () => scrollToSection("trustscan"),
      },
      {
        id: "project-doctranslate",
        group: "Projects",
        label: "Open DocTranslator",
        hint: "Flagship · 02",
        keywords: "doctranslate enterprise translation pii case study",
        icon: <FolderGit2 className="size-4" />,
        perform: () => scrollToSection("doctranslate"),
      },
      ...secondaryProjects.map((p) => ({
        id: `project-${p.slug}`,
        group: "Projects" as const,
        label: p.title,
        hint: p.subtitle,
        keywords: "project details",
        icon: <FolderGit2 className="size-4" />,
        perform: () => openProject(p.slug),
      })),
      {
        id: "link-github",
        group: "Links",
        label: "Open GitHub",
        hint: `@${profile.github.username}`,
        keywords: "code repositories source profile",
        icon: <GitHubIcon className="size-4" />,
        perform: () => openExternal(profile.github.url),
      },
      {
        id: "link-linkedin",
        group: "Links",
        label: "Open LinkedIn",
        hint: "LinkedIn profile",
        keywords: "connect network",
        icon: <LinkedInIcon className="size-4" />,
        perform: () => openExternal(profile.linkedin.url),
      },
      {
        id: "action-contact",
        group: "Actions",
        label: "Contact Barath",
        hint: profile.email,
        keywords: "email mail message",
        icon: <Mail className="size-4" />,
        perform: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "action-email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        keywords: "contact mail clipboard",
        icon: <AtSign className="size-4" />,
        perform: async () => {
          const ok = await copyText(profile.email);
          setNotice(ok ? "Email copied to clipboard" : "Couldn't copy — try selecting it manually");
        },
      },
      {
        id: "action-theme",
        group: "Actions",
        label: "Toggle Theme",
        hint: theme === "dark" ? "Switch to light" : "Switch to dark",
        keywords: "theme mode appearance light dark",
        icon: theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />,
        perform: toggleTheme,
      },
    ];
    return list;
  }, [theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const terms = q.split(/\s+/);
    return items.filter((item) => {
      const haystack = `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [items, query]);

  const activeIndex = Math.min(active, Math.max(filtered.length - 1, 0));

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function execute(item: Item) {
    close();
    // Let the dialog release its scroll lock and return focus first.
    afterNextPaint(() => item.perform());
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((activeIndex + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((activeIndex - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) execute(item);
    }
  }

  let lastGroup: string | null = null;

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={close} aria-hidden="true" />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="card relative w-full max-w-xl overflow-hidden border-line-strong !bg-none !bg-surface shadow-2xl"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search className="size-4 shrink-0 text-subtle" aria-hidden="true" />
                <input
                  data-autofocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search sections, projects, links…"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={filtered[activeIndex] ? `${listId}-${filtered[activeIndex].id}` : undefined}
                  aria-label="Search commands"
                  className="h-14 min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-subtle focus-visible:outline-none"
                />
                <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-subtle sm:inline">ESC</kbd>
              </div>

              <ul ref={listRef} id={listId} role="listbox" aria-label="Commands" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <li className="px-3 py-10 text-center text-sm text-muted">
                    No results for &ldquo;{query}&rdquo;. Try &ldquo;projects&rdquo; or &ldquo;github&rdquo;.
                  </li>
                ) : (
                  filtered.map((item, i) => {
                    const showGroup = item.group !== lastGroup;
                    lastGroup = item.group;
                    return (
                      <li key={item.id} role="presentation">
                        {showGroup ? (
                          <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-[0.18em] text-subtle uppercase" aria-hidden="true">
                            {item.group}
                          </p>
                        ) : null}
                        <div
                          id={`${listId}-${item.id}`}
                          role="option"
                          aria-selected={i === activeIndex}
                          data-index={i}
                          onMouseMove={() => i !== activeIndex && setActive(i)}
                          onClick={() => execute(item)}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                            i === activeIndex ? "bg-accent/10 text-fg" : "text-muted",
                          )}
                        >
                          <span className={cn("shrink-0", i === activeIndex ? "text-accent" : "text-subtle")} aria-hidden="true">
                            {item.icon}
                          </span>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.hint ? <span className="hidden truncate font-mono text-xs text-subtle sm:inline">{item.hint}</span> : null}
                          {i === activeIndex ? (
                            <CornerDownLeft className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                          ) : (
                            <ArrowRight className="size-3.5 shrink-0 opacity-0" aria-hidden="true" />
                          )}
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>

              <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 font-mono text-[11px] text-subtle">
                <span>↑↓ navigate · ↵ select</span>
                <span className="hidden sm:inline">Ctrl / ⌘ + K to toggle</span>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
        <AnimatePresence>
          {notice ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="rounded-full border border-line-strong bg-surface px-4 py-2 text-sm text-fg shadow-xl"
            >
              {notice}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
