"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { SortKey } from "./types";

interface SortOption {
  key: SortKey;
  label: string;
}

const OPTIONS: SortOption[] = [
  { key: "volume",      label: "Volume" },
  { key: "marketCap",   label: "Market Cap" },
  { key: "liquidity",   label: "Liquidity" },
  { key: "holders",     label: "Holders" },
  { key: "priceChange", label: "Change 24h" },
];

interface SortChipsProps {
  active: SortKey;
  direction: "asc" | "desc";
  onChange: (key: SortKey, direction: "asc" | "desc") => void;
}

export function SortChips({ active, direction, onChange }: SortChipsProps) {
  const handleClick = (key: SortKey) => {
    if (key === active) {
      onChange(key, direction === "desc" ? "asc" : "desc");
    } else {
      onChange(key, "desc");
    }
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-faint font-medium uppercase tracking-wider mr-1 shrink-0">Sort</span>
      {OPTIONS.map((opt) => {
        const isActive = opt.key === active;
        return (
          <button
            key={opt.key}
            onClick={() => handleClick(opt.key)}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
              isActive
                ? "bg-gold/15 text-gold border border-gold/30"
                : "bg-surface-2 text-muted border border-border-strong hover:border-gold/25 hover:text-text",
            )}
          >
            {opt.label}
            {isActive && (
              direction === "desc"
                ? <ChevronDown size={11} />
                : <ChevronUp size={11} />
            )}
          </button>
        );
      })}
    </div>
  );
}
