"use client";

import { cn } from "@/lib/utils";
import type { TabKey } from "./types";

interface Tab {
  key: TabKey;
  label: string;
  icon?: React.ReactNode;
}

interface TabBarProps {
  tabs: Tab[];
  active: TabKey;
  onChange: (key: TabKey) => void;
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div
      role="tablist"
      className="relative flex items-center gap-1 p-1 bg-surface rounded-xl border border-border"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "text-black bg-gradient-to-b from-gold-bright to-gold shadow-[0_4px_16px_-4px_rgba(16,185,129,0.55)]"
                : "text-muted hover:text-text hover:bg-surface-2/70",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
