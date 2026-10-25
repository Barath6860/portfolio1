"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { profile, navItems, projectAnchors } from "@/data/profile";
import { skillCategories } from "@/data/skills";
import { doctranslate, secondaryProjects, trustscan } from "@/data/projects";
import { openProject } from "@/lib/events";
import { toggleTheme } from "@/lib/theme";
import { cn, openExternal, scrollToSection } from "@/lib/utils";

/*
 * A simulated terminal. Every command maps to a pure function in `commands`
 * below — nothing is evaluated, executed or sent to a server.
 */

type Entry = { id: number; kind: "input" | "output"; content: ReactNode };
type Result = ReactNode | { clear: true };

type Command = {
  description: string;
  usage?: string;
  hidden?: boolean;
  run: (args: string[]) => Result;
};

const Accent = ({ children }: { children: ReactNode }) => <span className="text-accent">{children}</span>;
const Dim = ({ children }: { children: ReactNode }) => <span className="text-subtle">{children}</span>;
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
    {children}
  </a>
);

const sectionIds = [...navItems.map((n) => n.id), ...projectAnchors] as string[];

function openLink(url: string, label: string): ReactNode {
  openExternal(url);
  return (
    <span>
      Opening {label} in a new tab… If nothing happened, use this link: <Ext href={url}>{url}</Ext>
    </span>
  );
}

const commands: Record<string, Command> = {
  help: {
    description: "List available commands",
    run: () => (
      <div className="grid gap-1">
        <span>Available commands:</span>
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
          {Object.entries(commands)
            .filter(([, c]) => !c.hidden)
            .map(([name, c]) => (
              <span key={name} className="contents">
                <Accent>{c.usage ?? name}</Accent>
                <Dim>{c.description}</Dim>
              </span>
            ))}
        </div>
        <Dim>Tip: ↑/↓ browse history · Tab autocompletes · Ctrl+L clears</Dim>
      </div>
    ),
  },
  whoami: {
    description: "Who I am",
    run: () => (
      <div className="grid gap-1">
        <span>
          <Accent>{profile.name}</Accent> — {profile.role}, {profile.subRole.toLowerCase()}.
        </span>
        <span className="text-muted">{profile.summary}</span>
      </div>
    ),
  },
  about: { description: "Jump to the About section", hidden: true, run: () => (scrollToSection("about"), <span>Scrolling to about…</span>) },
  projects: {
    description: "List my projects",
    run: () => (
      <div className="grid gap-1">
        <span>
          <Dim>[flagship]</Dim> <Accent>TrustScan</Accent> <Dim>— {trustscan.subtitle}</Dim>
        </span>
        <span>
          <Dim>[flagship]</Dim> <Accent>DocTranslate Enterprise</Accent> <Dim>— {doctranslate.subtitle}</Dim>
        </span>
        {secondaryProjects.map((p, i) => (
          <span key={p.slug}>
            <Dim>[{i + 1}]</Dim> <Accent>{p.title}</Accent> <Dim>— {p.subtitle}</Dim>
          </span>
        ))}
        <Dim>Run &quot;trustscan&quot;, &quot;doctranslator&quot; or &quot;open &lt;n&gt;&quot;.</Dim>
      </div>
    ),
  },
  skills: {
    description: "Technologies I use and am learning",
    run: () => (
      <div className="grid gap-1">
        {skillCategories.map((c) => (
          <span key={c.id}>
            <Accent>{c.label.padEnd(28, " ")}</Accent>
            <span className={c.id === "learning" ? "text-accent-2" : undefined}>{c.skills.map((s) => s.name).join(" · ")}</span>
          </span>
        ))}
      </div>
    ),
  },
  trustscan: {
    description: "Flagship: rule-based fMRI trust system",
    run: () => {
      scrollToSection("trustscan");
      return (
        <div className="grid gap-1">
          <span>
            <Accent>TrustScan</Accent> — {trustscan.subtitle}
          </span>
          <span className="text-muted">Rule-based symbolic AI · no machine learning · does not diagnose autism.</span>
          <span className="text-muted">Leave-one-site-out (n = 1,035): coverage 97.6%, ASD vs control deferral gap 0.3%.</span>
          <span>
            Source: <Ext href={trustscan.links.repo}>{trustscan.links.repo.replace("https://", "")}</Ext>
          </span>
        </div>
      );
    },
  },
  doctranslator: {
    description: "Flagship: privacy-aware document translation",
    run: () => {
      scrollToSection("doctranslate");
      return (
        <div className="grid gap-1">
          <span>
            <Accent>DocTranslate Enterprise</Accent> — {doctranslate.subtitle}
          </span>
          <span className="text-muted">Python / Flask · PII masking with placeholders · glossary rules · batch workflows.</span>
          <span>
            Source: <Ext href={doctranslate.links.repo}>{doctranslate.links.repo.replace("https://", "")}</Ext>
          </span>
        </div>
      );
    },
  },
  open: {
    description: "Open a supporting project",
    usage: "open <n>",
    run: ([arg]) => {
      const project = secondaryProjects[Number(arg) - 1];
      if (!project) return <span className="text-danger">Usage: open &lt;1-{secondaryProjects.length}&gt;. Run &quot;projects&quot; to see the list.</span>;
      openProject(project.slug);
      return <span>Opening {project.title}…</span>;
    },
  },
  github: { description: "Open my GitHub profile", run: () => openLink(profile.github.url, "GitHub") },
  linkedin: { description: "Open my LinkedIn profile", run: () => openLink(profile.linkedin.url, "LinkedIn") },
  email: {
    description: "Show my email address",
    run: () => (
      <span>
        <a className="text-accent underline underline-offset-4" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>{" "}
        <Dim>— click to compose, or run &quot;goto contact&quot;</Dim>
      </span>
    ),
  },
  goto: {
    description: "Scroll to a section",
    usage: "goto <section>",
    run: ([arg]) => {
      const id = arg?.toLowerCase();
      if (!id || !sectionIds.includes(id)) {
        return <span>Usage: goto &lt;{sectionIds.join(" | ")}&gt;</span>;
      }
      scrollToSection(id);
      return <span>Scrolling to {id}…</span>;
    },
  },
  theme: {
    description: "Toggle light / dark theme",
    run: () => {
      toggleTheme();
      return <span>Theme switched to {document.documentElement.dataset.theme}.</span>;
    },
  },
  clear: { description: "Clear the terminal", run: () => ({ clear: true }) },
  sudo: {
    description: "",
    hidden: true,
    run: () => <span>Nice try 🙂 This is a simulated portfolio terminal — there&apos;s no real shell behind it.</span>,
  },
};

const commandNames = Object.keys(commands);

function distance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

function suggest(name: string): string | null {
  let best: string | null = null;
  let bestScore = Infinity;
  for (const c of commandNames) {
    const d = distance(name, c);
    if (d < bestScore) {
      bestScore = d;
      best = c;
    }
  }
  return bestScore <= 2 ? best : null;
}

const intro: Array<[string, string]> = [
  ["whoami", profile.name],
  ["role", `${profile.role} · ${profile.subRole}`],
  ["flagship", "TrustScan · DocTranslate Enterprise"],
  ["philosophy", profile.philosophy],
];

const quickCommands = ["help", "whoami", "projects", "trustscan", "skills", "email", "clear"];

function Prompt() {
  return (
    <span className="shrink-0 select-none" aria-hidden="true">
      <span className="text-success">barath</span>
      <span className="text-subtle">:~$</span>{" "}
    </span>
  );
}

export function Terminal({ className }: { className?: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  function run(raw: string) {
    const trimmed = raw.trim();
    const make = (kind: Entry["kind"], content: ReactNode): Entry => ({ id: nextId.current++, kind, content });

    if (!trimmed) {
      setEntries((prev) => [...prev, make("input", "")]);
      return;
    }

    setHistory((prev) => (prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed].slice(-50)));
    setHistoryIndex(null);

    const [name, ...args] = trimmed.split(/\s+/);
    const command = commands[name.toLowerCase()];

    if (!command) {
      const hint = suggest(name.toLowerCase());
      setEntries((prev) => [
        ...prev,
        make("input", trimmed),
        make(
          "output",
          <span>
            <span className="text-warning">command not found: {name}</span>
            <span className="text-muted">
              {" "}— this is a portfolio terminal with a small set of commands.{" "}
              {hint ? <>Did you mean <Accent>{hint}</Accent>? </> : null}
              Type <Accent>help</Accent> to see them.
            </span>
          </span>,
        ),
      ]);
      return;
    }

    const result = command.run(args);
    if (result && typeof result === "object" && "clear" in result) {
      setEntries([]);
      setShowIntro(false);
      return;
    }
    setEntries((prev) => [...prev, make("input", trimmed), make("output", result as ReactNode)]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      e.preventDefault();
      const idx = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      if (historyIndex === null) return;
      e.preventDefault();
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "Tab" && input.trim()) {
      const matches = commandNames.filter((c) => !commands[c].hidden && c.startsWith(input.trim().toLowerCase()));
      if (matches.length === 1) {
        e.preventDefault();
        setInput(`${matches[0]} `);
      }
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
      setShowIntro(false);
    }
  }

  return (
    <div
      className={cn(
        "card relative flex flex-col overflow-hidden !rounded-2xl border-line-strong font-mono text-[13px] leading-relaxed shadow-[0_30px_80px_-30px_var(--glow)]",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-surface-2/70 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="flex-1 truncate text-center text-xs text-subtle">barath: ~</p>
        <span className="hidden rounded-full border border-line px-2 py-0.5 text-[10px] tracking-wider text-subtle uppercase sm:inline">
          simulated
        </span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="h-72 overflow-y-auto overscroll-contain px-4 py-4 sm:h-80"
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
        }}
      >
        {showIntro ? (
          <div className="mb-3 grid gap-2">
            {intro.map(([cmd, out], i) => (
              <motion.div
                key={cmd}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.35, duration: 0.35 }}
              >
                <div className="flex">
                  <Prompt />
                  <span>{cmd}</span>
                </div>
                <div className="text-muted">{out}</div>
              </motion.div>
            ))}
            <motion.p
              className="text-subtle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + intro.length * 0.35 }}
            >
              Type <Accent>help</Accent> to explore. Try <Accent>trustscan</Accent> or <Accent>projects</Accent>.
            </motion.p>
          </div>
        ) : null}

        {entries.map((entry) =>
          entry.kind === "input" ? (
            <div key={entry.id} className="mt-2 flex break-all">
              <Prompt />
              <span>{entry.content}</span>
            </div>
          ) : (
            <div key={entry.id} className="mb-1 break-words whitespace-pre-wrap text-fg/90">
              {entry.content}
            </div>
          ),
        )}

        <div className="mt-2 flex items-center">
          <label htmlFor={inputId}>
            <Prompt />
            <span className="sr-only">Terminal command</span>
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="type a command…"
            className="min-w-0 flex-1 bg-transparent text-base text-fg caret-accent outline-none placeholder:text-subtle/70 focus-visible:outline-none sm:text-[13px]"
          />
        </div>
      </div>

      {/* Quick commands — handy on touch devices */}
      <div className="flex gap-2 overflow-x-auto border-t border-line bg-surface-2/40 px-3 py-2.5 [scrollbar-width:none]">
        {quickCommands.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              run(c);
              // Avoid popping the on-screen keyboard on touch devices.
              if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
            }}
            className="min-h-8 shrink-0 rounded-md border border-line px-2.5 text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
