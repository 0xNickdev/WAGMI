"use client";

import type { Token } from "@/lib/types";
import { EpochCountdown } from "@/components/EpochCountdown";
import { formatUsd, formatPct } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Flame, Users, Cpu, TrendingUp, Clock, Coins } from "lucide-react";

interface Props {
  token: Token;
}

const FREQ_LABEL: Record<string, string> = {
  "20m": "Every 20 min",
  "1h":  "Every hour",
  "6h":  "Every 6 hours",
  "24h": "Every 24 hours",
};

const ASSET_META: Record<string, { label: string; color: string }> = {
  BNB:        { label: "BNB",        color: "text-gold" },
  SAME_TOKEN: { label: "Same Token", color: "text-cyan" },
  EXTERNAL:   { label: "External",   color: "text-violet" },
};

interface SliceProps {
  pct: number;
  color: string;
  label: string;
  icon: React.ReactNode;
}

function DonutSlice({ slices }: { slices: SliceProps[] }) {
  const r = 36;
  const cx = 48;
  const cy = 48;
  const circumference = 2 * Math.PI * r;
  const total = slices.reduce((s, sl) => s + sl.pct, 0) || 1;

  let offset = 0;
  const arcs = slices
    .filter((sl) => sl.pct > 0)
    .map((sl) => {
      const dashLen = (sl.pct / total) * circumference;
      const gap = circumference - dashLen;
      const rotation = (offset / total) * 360 - 90;
      offset += sl.pct;
      return { ...sl, dashLen, gap, rotation };
    });

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
        <svg width={96} height={96} viewBox="0 0 96 96">
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={10} />
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={10}
              strokeDasharray={`${arc.dashLen} ${arc.gap}`}
              strokeDashoffset={0}
              strokeLinecap="butt"
              transform={`rotate(${arc.rotation} ${cx} ${cy})`}
              style={{ transition: "stroke-dasharray 0.4s ease" }}
            />
          ))}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Coins size={18} className="text-gold" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 flex-1">
        {slices.filter((s) => s.pct > 0).map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="size-2 rounded-full shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-xs text-muted flex-1">{s.label}</span>
            <span className="tabular text-xs font-semibold text-text">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RewardPanel({ token }: Props) {
  const { reward, rewardsDistributedUsd, nextDistributionAt } = token;
  const assetMeta = ASSET_META[reward.asset] ?? { label: reward.asset, color: "text-gold" };

  const lastDistributed = rewardsDistributedUsd * 0.035;

  const slices: SliceProps[] = [
    {
      pct:   reward.holderPct,
      color: "var(--up)",
      label: "Holders",
      icon:  <Users size={10} />,
    },
    {
      pct:   reward.burnPct,
      color: "var(--gold)",
      label: "Burn",
      icon:  <Flame size={10} />,
    },
    {
      pct:   reward.devPct,
      color: "var(--violet)",
      label: "Dev / Treasury",
      icon:  <Cpu size={10} />,
    },
  ];

  return (
    <div className="flex flex-col gap-0">
      {/* Next distribution countdown */}
      <div className="px-4 pt-4 pb-3 border-b border-border text-center">
        <p className="text-[11px] uppercase tracking-wider text-faint mb-2 flex items-center justify-center gap-1.5">
          <Clock size={10} />
          Next Distribution
        </p>
        <EpochCountdown target={nextDistributionAt} size="md" />
        <p className="text-xs text-faint mt-1.5">{FREQ_LABEL[reward.frequency] ?? reward.frequency}</p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Reward asset */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-faint">Reward asset</span>
          <span className={cn("text-sm font-semibold", assetMeta.color)}>
            {assetMeta.label}
          </span>
        </div>

        {/* Split donut */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-faint mb-2.5">Revenue split</p>
          <DonutSlice slices={slices} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="glass rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-faint flex items-center gap-1">
              <TrendingUp size={10} /> Total Paid
            </span>
            <span className="tabular text-sm font-semibold text-gold">
              {formatUsd(rewardsDistributedUsd)}
            </span>
          </div>
          <div className="glass rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-faint flex items-center gap-1">
              <Clock size={10} /> Last Round
            </span>
            <span className="tabular text-sm font-semibold text-text">
              {formatUsd(lastDistributed)}
            </span>
          </div>
        </div>

        {/* Holder share callout */}
        <div className="rounded-xl border border-up/25 bg-up/8 p-3 text-center">
          <p className="text-[11px] text-faint mb-0.5">Your share per 1M tokens held</p>
          <p className="text-sm font-semibold text-up tabular">
            ≈ {formatUsd((rewardsDistributedUsd * (reward.holderPct / 100)) / (token.supply / 1_000_000) * 0.035)}
            <span className="text-xs text-faint font-normal"> / round</span>
          </p>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/8 to-transparent p-3.5 text-center">
          <p className="text-xs font-semibold text-gold mb-0.5">Hold to Earn</p>
          <p className="text-[11px] text-faint leading-relaxed">
            Hold {token.symbol} and automatically receive {assetMeta.label} rewards every {FREQ_LABEL[reward.frequency]?.toLowerCase() ?? reward.frequency}. No staking required.
          </p>
        </div>

        {/* Holder split detail */}
        <div className="flex flex-col gap-1.5">
          {slices.filter((s) => s.pct > 0).map((s, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                <span className="text-faint">{s.label}</span>
              </div>
              <span className="tabular font-medium text-text">{formatPct(s.pct, false)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
