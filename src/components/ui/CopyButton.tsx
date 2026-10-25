"use client";

import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { copyText, cn } from "@/lib/utils";

type State = "idle" | "copied" | "failed";

export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(t);
  }, [state]);

  const Icon = state === "copied" ? Check : state === "failed" ? X : Copy;
  const text = state === "copied" ? "Copied!" : state === "failed" ? "Copy failed" : label;

  return (
    <button
      type="button"
      onClick={async () => setState((await copyText(value)) ? "copied" : "failed")}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium transition-colors hover:border-accent/60 hover:text-fg",
        state === "copied" ? "text-success" : state === "failed" ? "text-danger" : "text-muted",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span aria-live="polite">{text}</span>
    </button>
  );
}
