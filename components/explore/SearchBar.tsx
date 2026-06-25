"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        size={16}
        className="absolute left-3.5 text-faint pointer-events-none"
        aria-hidden
      />
      <input
        type="text"
        placeholder="Search by name or symbol…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-11 pl-10 pr-10 rounded-xl text-sm",
          "bg-surface border border-border-strong",
          "text-text placeholder:text-faint",
          "focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50",
          "transition-all duration-200",
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 text-faint hover:text-text transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
