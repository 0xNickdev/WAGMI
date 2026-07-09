"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTokens } from "@/lib/mock";
import { formatUsd, formatNum, formatPrice, cn } from "@/lib/utils";
import { SectionHeader } from "@/components/SectionHeader";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { ChangeBadge } from "@/components/ui/Badge";
import { Sparkline } from "@/components/ui/Sparkline";
import { PodiumCard } from "@/components/dashboard/PodiumCard";
import { Trophy, TrendingUp, BarChart3, Users, Gift } from "lucide-react";
import Link from "next/link";
import type { Token } from "@/lib/types";

type Metric = "volume24h" | "marketCap" | "holders" | "rewardsDistributedUsd";

const TABS: { key: Metric; label: string; icon: React.ReactNode; format: (t: Token) => string }[] = [
  {
    key: "volume24h",
    label: "Volume 24h",
    icon: <BarChart3 size={14} />,
    format: (t) => formatUsd(t.volume24h),
  },
  {
    key: "marketCap",
    label: "Market Cap",
    icon: <TrendingUp size={14} />,
    format: (t) => formatUsd(t.marketCap),
  },
  {
    key: "holders",
    label: "Holders",
    icon: <Users size={14} />,
    format: (t) => formatNum(t.holders),
  },
  {
    key: "rewardsDistributedUsd",
    label: "Rewards",
    icon: <Gift size={14} />,
    format: (t) => formatUsd(t.rewardsDistributedUsd),
  },
];

const MEDAL_TEXT = ["", "text-gold glow-gold", "text-muted", "text-amber"];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg leading-none">🥇</span>;
  if (rank === 2) return <span className="text-lg leading-none">🥈</span>;
  if (rank === 3) return <span className="text-lg leading-none">🥉</span>;
  return (
    <span className="text-sm font-mono text-faint w-6 text-center">{rank}</span>
  );
}

function LeaderboardRow({
  token,
  rank,
  metricValue,
  delay,
}: {
  token: Token;
  rank: number;
  metricValue: string;
  delay: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/token/${token.address}`}
        className={cn(
          "grid items-center gap-3 px-4 py-3 rounded-xl transition-colors group",
          "grid-cols-[28px_1fr_auto_auto_auto_auto]",
          "sm:grid-cols-[28px_1.8fr_1fr_1fr_1fr_100px]",
          rank <= 3
            ? "hover:bg-gold/5 hover:border-gold/20 border border-transparent"
            : "hover:bg-surface-2/60",
          rank === 1 && "glow-gold bg-gold/5 border border-gold/20",
        )}
      >
        {/* rank */}
        <div className="flex items-center justify-center">
          <RankBadge rank={rank} />
        </div>

        {/* token info */}
        <div className="flex items-center gap-3 min-w-0">
          <TokenLogo symbol={token.symbol} gradient={token.logoColor} src={token.logoUrl} size={rank === 1 ? 40 : 34} />
          <div className="min-w-0">
            <div
              className={cn(
                "font-semibold truncate transition-colors group-hover:text-gold",
                rank <= 3 && MEDAL_TEXT[rank],
              )}
            >
              {token.name}
            </div>
            <div className="text-xs text-faint font-mono">${token.symbol}</div>
          </div>
        </div>

        {/* active metric — always visible */}
        <div className={cn("text-right tabular font-bold", rank === 1 ? "text-gold text-base" : "text-sm text-text")}>
          {metricValue}
        </div>

        {/* price */}
        <div className="hidden sm:block text-right tabular text-sm text-muted">
          {formatPrice(token.price)}
        </div>

        {/* 24h change */}
        <div className="hidden sm:flex justify-end">
          <ChangeBadge value={token.priceChange24h} />
        </div>

        {/* sparkline */}
        <div className="hidden sm:flex justify-end">
          <Sparkline data={token.sparkline} width={88} height={28} strokeWidth={1.5} />
        </div>
      </Link>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [activeMetric, setActiveMetric] = useState<Metric>("volume24h");
  const allTokens = getTokens();

  const sorted = useMemo(
    () => [...allTokens].sort((a, b) => b[activeMetric] - a[activeMetric]),
    [allTokens, activeMetric],
  );

  const [top1, top2, top3, ...rest] = sorted;
  const activeTab = TABS.find((t) => t.key === activeMetric)!;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* header */}
      <SectionHeader
        title="Leaderboard"
        subtitle="Top tokens ranked by the metrics that matter"
        icon={<Trophy className="text-gold" size={22} />}
      />

      {/* metric tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveMetric(tab.key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              activeMetric === tab.key
                ? "bg-gold/15 text-gold border border-gold/30"
                : "glass text-muted hover:text-text hover:border-border-strong",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* podium — top 3 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMetric}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          {/* reorder: silver, gold, bronze for visual podium effect */}
          <div className="grid gap-4 grid-cols-3 items-end">
            <div className="mt-6">
              {top2 && <PodiumCard token={top2} rank={2} metric={activeMetric} />}
            </div>
            <div>
              {top1 && <PodiumCard token={top1} rank={1} metric={activeMetric} />}
            </div>
            <div className="mt-10">
              {top3 && <PodiumCard token={top3} rank={3} metric={activeMetric} />}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* full ranked list */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* table header */}
        <div className="grid items-center gap-3 px-4 py-2.5 border-b border-border grid-cols-[28px_1fr_auto_auto_auto_auto] sm:grid-cols-[28px_1.8fr_1fr_1fr_1fr_100px]">
          <div />
          <div className="text-xs uppercase tracking-wider text-faint">Token</div>
          <div className="text-right text-xs uppercase tracking-wider text-gold font-medium">
            {activeTab.label}
          </div>
          <div className="hidden sm:block text-right text-xs uppercase tracking-wider text-faint">Price</div>
          <div className="hidden sm:block text-right text-xs uppercase tracking-wider text-faint">24h</div>
          <div className="hidden sm:block text-right text-xs uppercase tracking-wider text-faint">Chart</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMetric + "-list"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="divide-y divide-border/40 p-2"
          >
            {sorted.map((token, i) => (
              <LeaderboardRow
                key={token.address}
                token={token}
                rank={i + 1}
                metricValue={activeTab.format(token)}
                delay={Math.min(i * 0.03, 0.3)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
