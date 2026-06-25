"use client";

import type { Bounty } from "@/lib/bounties";
import { getTopEarners, getTopCreators } from "@/lib/bounties";
import { formatUsd } from "@/lib/utils";
import { Trophy, Flame, Crown } from "lucide-react";

function Avatar({ seed, size = 24 }: { seed: string; size?: number }) {
  const [a, b] = seed.split(",");
  return <span className="rounded-full shrink-0" style={{ width: size, height: size, background: `linear-gradient(135deg, ${a}, ${b})` }} />;
}

export function BountySidebar({ topReward, onOpen }: { topReward: Bounty[]; onOpen: (b: Bounty) => void }) {
  const earners = getTopEarners();
  const creators = getTopCreators();

  return (
    <aside className="space-y-4">
      <div className="glass rounded-2xl p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted mb-3">
          <Flame size={14} className="text-amber" /> Highest Reward
        </h3>
        <div className="space-y-1">
          {topReward.slice(0, 4).map((b) => (
            <button key={b.id} onClick={() => onOpen(b)} className="w-full flex items-center gap-2.5 rounded-lg p-2 hover:bg-surface-2/60 transition-colors text-left">
              <span className="text-xl shrink-0">{b.emoji}</span>
              <span className="flex-1 min-w-0 text-sm truncate">{b.title}</span>
              <span className="text-sm font-semibold tabular text-gradient-gold shrink-0">{formatUsd(b.rewardUsd)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted mb-3">
          <Trophy size={14} className="text-gold" /> Top Earners
        </h3>
        <div className="space-y-1">
          {earners.map((e, i) => (
            <div key={e.handle} className="flex items-center gap-2.5 rounded-lg p-2">
              <span className="w-4 text-xs font-mono text-faint">{i + 1}</span>
              <Avatar seed={e.avatar} />
              <span className="flex-1 min-w-0 text-sm truncate">@{e.handle}</span>
              <span className="text-sm font-semibold tabular text-up shrink-0">{formatUsd(e.earnedUsd)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted mb-3">
          <Crown size={14} className="text-violet" /> Top Creators
        </h3>
        <div className="space-y-1">
          {creators.map((c, i) => (
            <div key={c.handle} className="flex items-center gap-2.5 rounded-lg p-2">
              <span className="w-4 text-xs font-mono text-faint">{i + 1}</span>
              <Avatar seed={c.avatar} />
              <span className="flex-1 min-w-0 text-sm truncate">@{c.handle}</span>
              <span className="text-sm font-semibold tabular text-muted shrink-0">{formatUsd(c.postedUsd)}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
