"use client";

import { useState } from "react";
import type { Activity } from "@/lib/types";
import { explorerTxUrl } from "@/lib/chain";
import { formatUsd, formatNum, shortAddr, timeAgo, cn } from "@/lib/utils";
import { ExternalLink, TrendingUp, TrendingDown, Flame, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  activity: Activity[];
}

const TYPE_META = {
  buy:    { label: "Buy",    icon: TrendingUp,   pill: "bg-up/12 text-up border-up/25",     row: "hover:bg-up/5" },
  sell:   { label: "Sell",   icon: TrendingDown, pill: "bg-down/12 text-down border-down/25", row: "hover:bg-down/5" },
  reward: { label: "Reward", icon: Gift,          pill: "bg-gold/12 text-gold border-gold/25", row: "hover:bg-gold/5" },
  burn:   { label: "Burn",   icon: Flame,         pill: "bg-amber/12 text-amber border-amber/25", row: "hover:bg-surface-2/60" },
} as const;

const FILTERS = ["All", "Buy", "Sell", "Reward", "Burn"] as const;
type Filter = typeof FILTERS[number];

export function ActivityFeed({ activity }: Props) {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = filter === "All"
    ? activity
    : activity.filter((a) => a.type === filter.toLowerCase());

  return (
    <div className="flex flex-col">
      {/* Filter pills */}
      <div className="flex items-center gap-1.5 px-5 py-3 border-b border-border overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-full border transition-all whitespace-nowrap",
              filter === f
                ? "bg-gold/15 text-gold border-gold/30"
                : "border-border text-faint hover:text-text hover:border-border-strong",
            )}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-faint shrink-0">{visible.length} txns</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[80px_1fr_100px_90px_56px_28px] gap-2 px-5 py-2 text-[10px] uppercase tracking-wider text-faint border-b border-border">
        <span>Type</span>
        <span>Wallet</span>
        <span className="text-right">Amount</span>
        <span className="text-right">USD</span>
        <span className="text-right">Time</span>
        <span />
      </div>

      {/* Rows */}
      <div className="max-h-[420px] overflow-y-auto no-scrollbar divide-y divide-border/50">
        <AnimatePresence initial={false}>
          {visible.map((a) => {
            const meta = TYPE_META[a.type];
            const Icon = meta.icon;
            return (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "grid grid-cols-[80px_1fr_100px_90px_56px_28px] gap-2 items-center px-5 py-2.5 transition-colors",
                  meta.row,
                )}
              >
                {/* Type pill */}
                <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold w-fit", meta.pill)}>
                  <Icon size={10} />
                  {meta.label}
                </span>

                {/* Wallet */}
                <span className="tabular text-xs text-muted font-mono">
                  {shortAddr(a.wallet)}
                </span>

                {/* Token amount */}
                <span className="tabular text-xs text-right text-text">
                  {formatNum(a.amountToken, { compact: true })}
                </span>

                {/* USD */}
                <span className="tabular text-xs text-right text-muted">
                  {formatUsd(a.amountUsd)}
                </span>

                {/* Time */}
                <span suppressHydrationWarning className="text-xs text-right text-faint">{timeAgo(a.ts)}</span>

                {/* Tx link */}
                <a
                  href={explorerTxUrl(a.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-faint hover:text-gold transition-colors flex justify-center"
                  aria-label="View transaction"
                >
                  <ExternalLink size={12} />
                </a>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
