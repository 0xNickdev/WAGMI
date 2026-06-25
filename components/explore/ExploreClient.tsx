"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, TrendingUp } from "lucide-react";
import { getTrending, getNewTokens, getGainers, getTokens } from "@/lib/mock";
import { TokenCard, TokenRow } from "@/components/TokenCard";
import { TabBar } from "./TabBar";
import { SearchBar } from "./SearchBar";
import { SortChips } from "./SortChips";
import { ViewToggle } from "./ViewToggle";
import { QuickFilters } from "./QuickFilters";
import { ListHeader } from "./ListHeader";
import { EmptyState } from "./EmptyState";
import type { TabKey, SortKey, ViewMode } from "./types";
import type { QuickFilterId } from "./QuickFilters";
import type { Token } from "@/lib/types";

const TABS = [
  { key: "trending" as TabKey, label: "Trending",    icon: <Flame size={14} /> },
  { key: "new"      as TabKey, label: "New",         icon: <Sparkles size={14} /> },
  { key: "gainers"  as TabKey, label: "Top Gainers", icon: <TrendingUp size={14} /> },
];

const ALL = getTokens();
const TRENDING = getTrending(ALL.length);
const NEW      = getNewTokens(ALL.length);
const GAINERS  = getGainers(ALL.length);

function baseTokens(tab: TabKey): Token[] {
  if (tab === "trending") return TRENDING;
  if (tab === "new")      return NEW;
  return GAINERS;
}

function applySort(tokens: Token[], key: SortKey, dir: "asc" | "desc"): Token[] {
  const sign = dir === "desc" ? -1 : 1;
  return [...tokens].sort((a, b) => {
    let av = 0, bv = 0;
    if (key === "volume")      { av = a.volume24h;      bv = b.volume24h; }
    if (key === "marketCap")   { av = a.marketCap;      bv = b.marketCap; }
    if (key === "liquidity")   { av = a.liquidity;      bv = b.liquidity; }
    if (key === "holders")     { av = a.holders;        bv = b.holders; }
    if (key === "priceChange") { av = a.priceChange24h; bv = b.priceChange24h; }
    return (bv - av) * sign;
  });
}

function applyFilters(tokens: Token[], active: Set<QuickFilterId>): Token[] {
  if (!active.size) return tokens;
  return tokens.filter((t) => {
    if (active.has("low-tax")        && (t.buyTax > 5 || t.sellTax > 5)) return false;
    if (active.has("high-liquidity") && t.liquidity < 50_000)             return false;
    if (active.has("new-24h")        && Date.now() - t.createdAt > 86_400_000) return false;
    if (active.has("high-volume")    && t.volume24h < 100_000)            return false;
    return true;
  });
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.04, duration: 0.28, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

const ROW_VARIANTS = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.03, duration: 0.22, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export function ExploreClient({ totalCount }: { totalCount: number }) {
  const [tab,       setTab]       = useState<TabKey>("trending");
  const [query,     setQuery]     = useState("");
  const [sortKey,   setSortKey]   = useState<SortKey>("volume");
  const [sortDir,   setSortDir]   = useState<"asc" | "desc">("desc");
  const [view,      setView]      = useState<ViewMode>("grid");
  const [qFilters,  setQFilters]  = useState<Set<QuickFilterId>>(new Set());

  const handleSortChange = (key: SortKey, dir: "asc" | "desc") => {
    setSortKey(key);
    setSortDir(dir);
  };

  const handleFilterToggle = (id: QuickFilterId) => {
    setQFilters((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const tokens = useMemo(() => {
    const base = baseTokens(tab);
    const searched = query.trim()
      ? base.filter(
          (t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.symbol.toLowerCase().includes(query.toLowerCase()),
        )
      : base;
    const filtered = applyFilters(searched, qFilters);
    return applySort(filtered, sortKey, sortDir);
  }, [tab, query, sortKey, sortDir, qFilters]);

  return (
    <div className="space-y-6">
      {/* Controls row */}
      <div className="glass rounded-2xl p-4 space-y-4">
        {/* Top row: tabs + view toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <TabBar tabs={TABS} active={tab} onChange={setTab} />
          <div className="flex-1" />
          <ViewToggle mode={view} onChange={setView} />
        </div>

        {/* Search */}
        <SearchBar value={query} onChange={setQuery} />

        {/* Sort chips */}
        <SortChips active={sortKey} direction={sortDir} onChange={handleSortChange} />

        {/* Quick filters */}
        <QuickFilters active={qFilters} onToggle={handleFilterToggle} />
      </div>

      {/* Results meta */}
      <div className="flex items-center justify-between text-sm text-muted px-1">
        <span>
          Showing{" "}
          <span className="text-text font-semibold tabular">{tokens.length}</span>
          {" "}of{" "}
          <span className="tabular">{totalCount}</span> tokens
        </span>
        {qFilters.size > 0 && (
          <button
            onClick={() => setQFilters(new Set())}
            className="text-xs text-gold hover:text-gold-bright transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Token grid / list */}
      {tokens.length === 0 ? (
        <EmptyState query={query} />
      ) : view === "grid" ? (
        <motion.div
          key={`${tab}-${query}-${sortKey}-${sortDir}-${[...qFilters].join()}-grid`}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {tokens.map((token, i) => (
              <motion.div
                key={token.address}
                custom={i}
                variants={CARD_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <TokenCard token={token} rank={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-3 pb-2">
            <ListHeader />
          </div>
          <div className="divide-y divide-border/50 px-3 pb-3">
            <AnimatePresence mode="popLayout">
              {tokens.map((token, i) => (
                <motion.div
                  key={token.address}
                  custom={i}
                  variants={ROW_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <TokenRow token={token} rank={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
