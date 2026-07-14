"use client";

import { useMemo, useState } from "react";
import type { Token } from "@/lib/types";
import { TokenCard } from "@/components/TokenCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Flame, Sparkles, TrendingUp, BarChart3, Plus } from "lucide-react";

const TABS = [
  { id: "trending", label: "Trending", icon: Flame },
  { id: "new", label: "New", icon: Sparkles },
  { id: "movers", label: "Movers", icon: TrendingUp },
  { id: "mcap", label: "Market cap", icon: BarChart3 },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SORTERS: Record<TabId, (a: Token, b: Token) => number> = {
  trending: (a, b) => b.trendingScore - a.trendingScore,
  new: (a, b) => b.createdAt - a.createdAt,
  movers: (a, b) => b.priceChange24h - a.priceChange24h,
  mcap: (a, b) => b.marketCap - a.marketCap,
};

export function HomeTokenBoard({ tokens }: { tokens: Token[] }) {
  const [tab, setTab] = useState<TabId>("trending");
  const shown = useMemo(
    () => [...tokens].sort(SORTERS[tab]).slice(0, 12),
    [tokens, tab],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center gap-1 glass rounded-xl p-1 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                tab === t.id
                  ? "bg-gold text-black"
                  : "text-muted hover:text-text hover:bg-surface-2/60",
              )}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button href="/launch" size="md" className="shrink-0">
          <Plus size={16} /> Create coin
        </Button>
      </div>

      <div key={tab} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((t, i) => (
          <TokenCard key={t.address} token={t} rank={tab === "trending" ? i : undefined} />
        ))}
      </div>
    </section>
  );
}
