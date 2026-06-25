"use client";

import { motion } from "framer-motion";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { ChangeBadge } from "@/components/ui/Badge";
import { formatUsd, formatNum, formatPrice } from "@/lib/utils";
import type { Token } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Metric = "volume24h" | "marketCap" | "holders" | "rewardsDistributedUsd";

interface Props {
  token: Token;
  rank: 1 | 2 | 3;
  metric: Metric;
}

const MEDAL = ["", "🥇", "🥈", "🥉"] as const;

const RANK_STYLE: Record<number, { ring: string; glow: string; label: string; delay: number; scale: string }> = {
  1: {
    ring: "ring-2 ring-gold/60",
    glow: "glow-gold",
    label: "text-gold",
    delay: 0,
    scale: "scale-105",
  },
  2: {
    ring: "ring-1 ring-border-strong",
    glow: "",
    label: "text-muted",
    delay: 0.05,
    scale: "scale-100",
  },
  3: {
    ring: "ring-1 ring-amber/30",
    glow: "",
    label: "text-amber",
    delay: 0.1,
    scale: "scale-[0.97]",
  },
};

function metricValue(token: Token, metric: Metric): string {
  switch (metric) {
    case "volume24h":
      return formatUsd(token.volume24h);
    case "marketCap":
      return formatUsd(token.marketCap);
    case "holders":
      return formatNum(token.holders);
    case "rewardsDistributedUsd":
      return formatUsd(token.rewardsDistributedUsd);
  }
}

function metricLabel(metric: Metric): string {
  switch (metric) {
    case "volume24h":
      return "Vol 24h";
    case "marketCap":
      return "Market Cap";
    case "holders":
      return "Holders";
    case "rewardsDistributedUsd":
      return "Rewards";
  }
}

export function PodiumCard({ token, rank, metric }: Props) {
  const style = RANK_STYLE[rank];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: style.delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/token/${token.address}`}
        className={cn(
          "glass rounded-2xl p-5 flex flex-col items-center gap-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/30 block",
          style.ring,
          style.glow,
          style.scale,
        )}
      >
        {/* medal + rank */}
        <div className="flex items-center gap-1.5">
          <span className="text-xl leading-none">{MEDAL[rank]}</span>
          <span className={cn("text-xs font-mono font-bold uppercase tracking-widest", style.label)}>
            #{rank}
          </span>
        </div>

        <TokenLogo symbol={token.symbol} gradient={token.logoColor} size={rank === 1 ? 56 : 48} />

        <div>
          <div className="font-bold text-text leading-tight">{token.name}</div>
          <div className="text-xs text-faint font-mono mt-0.5">${token.symbol}</div>
        </div>

        <div className={cn("text-lg font-bold tabular", rank === 1 ? "text-gold" : "text-text")}>
          {metricValue(token, metric)}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-faint">{metricLabel(metric)}</div>

        <div className="w-full pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="tabular text-muted">{formatPrice(token.price)}</span>
          <ChangeBadge value={token.priceChange24h} />
        </div>
      </Link>
    </motion.div>
  );
}
