import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-200 select-none disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-ink shadow-[0_8px_30px_-8px_var(--glow)] hover:bg-accent-strong hover:shadow-[0_10px_40px_-6px_var(--glow)] active:scale-[0.98]",
  secondary:
    "border border-line-strong bg-surface/60 text-fg backdrop-blur hover:border-accent/50 hover:bg-surface-2 active:scale-[0.98]",
  ghost: "text-muted hover:text-fg",
};

export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}
