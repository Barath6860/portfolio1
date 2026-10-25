"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Download, FileUp, Languages, RotateCcw, ScanSearch, ShieldCheck, type LucideIcon } from "lucide-react";
import { doctranslate } from "@/data/projects";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  upload: FileUp,
  detect: ScanSearch,
  mask: ShieldCheck,
  translate: Languages,
  restore: RotateCcw,
  export: Download,
};

/** What the travelling document card shows after each stage. Fictional sample values. */
const docState = [
  { lines: ["Contact Ms. Priya Raman", "priya.raman@example.com"], tag: "EN · source" },
  { lines: ["Contact ⟨Ms. Priya Raman⟩", "⟨priya.raman@example.com⟩"], tag: "2 values found" },
  { lines: ["Contact [NAME_1]", "[EMAIL_1]"], tag: "masked" },
  { lines: ["Contacte a [NAME_1]", "[EMAIL_1]"], tag: "ES · engine output" },
  { lines: ["Contacte a Ms. Priya Raman", "priya.raman@example.com"], tag: "restored" },
  { lines: ["Contacte a Ms. Priya Raman", "priya.raman@example.com"], tag: ".docx ready" },
];

/** Upload → Detect → Mask PII → Translate → Restore → Export, with a document card moving through it. */
export function TranslationPipeline() {
  const steps = doctranslate.pipeline;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const reduce = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % steps.length), 2200);
    return () => window.clearInterval(t);
  }, [inView, reduce, steps.length]);

  const pct = (step / (steps.length - 1)) * 100;
  const doc = docState[step];

  return (
    <div ref={ref} className="card relative overflow-hidden p-6 sm:p-8">
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-50" />

      {/* Travelling document (desktop) */}
      <div className="relative mb-10 hidden h-28 md:block" aria-hidden="true">
        <div className="absolute top-1/2 right-[8%] left-[8%] h-px -translate-y-1/2 bg-line-strong">
          <motion.div className="h-full origin-left bg-gradient-to-r from-accent-2 to-accent" animate={{ scaleX: step / (steps.length - 1) }} transition={{ duration: 1, ease: EASE }} />
        </div>
        <div className="absolute inset-y-0 right-[8%] left-[8%]">
          <motion.div className="absolute top-1/2 w-52 -translate-x-1/2 -translate-y-1/2" animate={{ left: `${pct}%` }} transition={{ duration: 1.1, ease: EASE }}>
            <div className="rounded-xl border border-line-strong bg-surface p-3 shadow-[0_18px_40px_-18px_var(--glow-2)]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-wider text-subtle uppercase">document</span>
                <motion.span key={doc.tag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded bg-accent-2/15 px-1.5 py-0.5 font-mono text-[9px] text-accent-2">
                  {doc.tag}
                </motion.span>
              </div>
              {doc.lines.map((l, i) => (
                <motion.p key={`${step}-${i}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }} className="mt-1.5 truncate font-mono text-[11px] text-fg/90">
                  {l}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <ol className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {steps.map((s, i) => {
          const Icon = icons[s.id] ?? FileUp;
          const current = i === step;
          const done = i < step;
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1 + i * 0.12, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex h-full w-full flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all duration-500",
                  current ? "border-accent-2/50 bg-accent-2/10" : done ? "border-line bg-surface/60" : "border-line bg-surface/30 hover:border-line-strong",
                )}
              >
                <span className="flex w-full items-center justify-between">
                  <Icon className={cn("size-4 transition-colors", current ? "text-accent-2" : done ? "text-accent" : "text-subtle")} aria-hidden="true" />
                  <span className="font-mono text-[10px] text-subtle">0{i + 1}</span>
                </span>
                <span className={cn("text-sm font-medium", current ? "text-fg" : "text-muted")}>{s.title}</span>
                <span className="text-[11px] leading-snug text-subtle">{s.detail}</span>
              </button>
            </motion.li>
          );
        })}
      </ol>
      <p className="relative mt-5 font-mono text-[10px] text-subtle">Animated illustration of the workflow · sample values are fictional</p>
    </div>
  );
}
