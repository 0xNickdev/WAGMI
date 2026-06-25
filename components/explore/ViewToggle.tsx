"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "./types";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-0.5 p-1 bg-surface rounded-lg border border-border">
      <button
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150",
          mode === "grid"
            ? "bg-gold/15 text-gold"
            : "text-faint hover:text-text",
        )}
      >
        <LayoutGrid size={15} />
      </button>
      <button
        onClick={() => onChange("list")}
        aria-label="List view"
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150",
          mode === "list"
            ? "bg-gold/15 text-gold"
            : "text-faint hover:text-text",
        )}
      >
        <List size={15} />
      </button>
    </div>
  );
}
