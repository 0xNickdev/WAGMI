import { cn } from "@/lib/utils";
import { formatPct } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { HTMLAttributes } from "react";

type Tone = "gold" | "up" | "down" | "neutral" | "violet" | "cyan";

const tones: Record<Tone, string> = {
  gold: "bg-gold/12 text-gold border-gold/25",
  up: "bg-up/12 text-up border-up/25",
  down: "bg-down/12 text-down border-down/25",
  neutral: "bg-surface-2 text-muted border-border-strong",
  violet: "bg-violet/12 text-violet border-violet/25",
  cyan: "bg-cyan/12 text-cyan border-cyan/25",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function ChangeBadge({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular",
        up ? "bg-up/12 text-up" : "bg-down/12 text-down",
        className,
      )}
    >
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {formatPct(Math.abs(value), false)}
    </span>
  );
}
