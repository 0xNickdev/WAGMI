"use client";

import Link from "next/link";
import type { Token } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { TrendingUp, Clock, Lock, LineChart } from "lucide-react";

interface Props {
  token: Token;
}

/* Stake to Earn panel — holders stake the project token to earn
   tokenized stock rewards (real equities on Robinhood Chain). */
export function RewardPanel({ token }: Props) {
  const { reward, rewardsDistributedUsd, rewardStock } = token;
  // APY placeholder until the staking contracts report real numbers
  const apy = 12 + (token.holders % 80);

  return (
    <div className="flex flex-col gap-0">
      <div className="px-4 pt-4 pb-3 border-b border-border text-center">
        <p className="text-[11px] uppercase tracking-wider text-faint mb-1.5 flex items-center justify-center gap-1.5">
          <LineChart size={10} />
          Stake to Earn
        </p>
        <p className="text-2xl font-bold tabular text-gradient-gold">{rewardStock}</p>
        <p className="text-xs text-faint mt-1">Tokenized stock reward</p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-faint">Reward allocation</span>
          <span className="text-sm font-semibold tabular">{5 + (token.holders % 20)}% of supply</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-faint">APY (est.)</span>
          <span className="text-sm font-semibold tabular text-gold">≈ {apy.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-faint">Reward stream</span>
          <span className="text-sm font-semibold">Every block · linear</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="glass rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-faint flex items-center gap-1">
              <TrendingUp size={10} /> Rewards Paid
            </span>
            <span className="tabular text-sm font-semibold text-gold">
              {formatUsd(rewardsDistributedUsd)}
            </span>
          </div>
          <div className="glass rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-faint flex items-center gap-1">
              <Clock size={10} /> Lock-up
            </span>
            <span className="tabular text-sm font-semibold text-text">None</span>
          </div>
        </div>

        <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/8 to-transparent p-3.5 text-center">
          <p className="text-xs font-semibold text-gold mb-0.5">Stake to Earn</p>
          <p className="text-[11px] text-faint leading-relaxed">
            Stake ${token.symbol} and earn {rewardStock} — a real tokenized equity on
            Robinhood Chain. Unstake or claim anytime.
          </p>
        </div>

        <Link
          href="/stake"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold-bright to-gold text-black font-semibold text-sm py-2.5 hover:brightness-110 transition-all"
        >
          <Lock size={14} /> Stake ${token.symbol}
        </Link>
      </div>
    </div>
  );
}
