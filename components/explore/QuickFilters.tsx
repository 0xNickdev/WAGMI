"use client";

import { cn } from "@/lib/utils";

export type QuickFilterId = "low-tax" | "high-liquidity" | "new-24h" | "high-volume";

interface FilterDef {
  id: QuickFilterId;
  label: string;
}

const FILTERS: FilterDef[] = [
  { id: "low-tax",        label: "Low Tax ≤5%" },
  { id: "high-liquidity", label: "High Liquidity" },
  { id: "new-24h",        label: "New <24h" },
  { id: "high-volume",    label: "High Volume" },
];

interface QuickFiltersProps {
  active: Set<QuickFilterId>;
  onToggle: (id: QuickFilterId) => void;
}

export function QuickFilters({ active, onToggle }: QuickFiltersProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-faint font-medium uppercase tracking-wider mr-1 shrink-0">Filter</span>
      {FILTERS.map((f) => {
        const on = active.has(f.id);
        return (
          <button
            key={f.id}
            onClick={() => onToggle(f.id)}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
              on
                ? "bg-violet/15 text-violet border border-violet/30"
                : "bg-surface-2 text-muted border border-border-strong hover:border-violet/25 hover:text-text",
            )}
          >
            {on && <span className="w-1.5 h-1.5 rounded-full bg-violet shrink-0" />}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
