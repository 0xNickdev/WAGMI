"use client";

import type { Bounty } from "@/lib/bounties";
import { bnbOf } from "@/lib/bounties";
import { formatUsd, timeAgo, cn } from "@/lib/utils";
import { Users, Clock, Trophy, Play } from "lucide-react";

const statusMap = {
  live: { label: "Live", cls: "bg-up/15 text-up border-up/30" },
  paid: { label: "Paid", cls: "bg-gold/15 text-gold border-gold/30" },
  expired: { label: "Expired", cls: "bg-surface-2 text-faint border-border-strong" },
};

export function BountyCard({ bounty, onOpen }: { bounty: Bounty; onOpen: (b: Bounty) => void }) {
  const [c1, c2] = bounty.gradient.split(",");
  const s = statusMap[bounty.status];
  return (
    <button
      onClick={() => onOpen(bounty)}
      className="group text-left w-full glass rounded-2xl overflow-hidden transition-all duration-200 hover:border-gold/40 hover:-translate-y-0.5 hover:glow-gold break-inside-avoid mb-4"
    >
      {/* Cover */}
      <div
        className="relative h-36 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${c1}22, ${c2}22), radial-gradient(circle at 30% 30%, ${c1}33, transparent 60%)` }}
      >
        <span className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">{bounty.emoji}</span>
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", s.cls)}>{s.label}</span>
          {bounty.featured && (
            <span className="rounded-full border border-violet/30 bg-violet/15 text-violet px-2 py-0.5 text-[11px] font-semibold">Featured</span>
          )}
        </div>
        <div className="absolute bottom-2.5 right-2.5 grid place-items-center size-9 rounded-full bg-black/50 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={15} className="text-white fill-white ml-0.5" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-gold transition-colors">{bounty.title}</h3>
        <p className="mt-1 text-xs text-muted line-clamp-2">{bounty.summary}</p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-lg font-bold tabular text-gradient-gold">{formatUsd(bounty.rewardUsd)}</div>
            <div className="text-[11px] text-faint tabular">{bnbOf(bounty.rewardUsd).toFixed(3)} BNB</div>
          </div>
          {bounty.winners > 1 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
              <Trophy size={12} className="text-gold" /> {bounty.winners} winners
            </span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px] text-faint">
          <span className="inline-flex items-center gap-1 truncate max-w-[55%]">
            <span className="size-4 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${bounty.creatorAvatar.split(",")[0]}, ${bounty.creatorAvatar.split(",")[1]})` }} />
            <span className="truncate">{bounty.creator}</span>
          </span>
          <span className="inline-flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-0.5"><Users size={11} /> {bounty.submissions}</span>
            <span className="inline-flex items-center gap-0.5"><Clock size={11} /> {timeAgo(bounty.createdAt)}</span>
          </span>
        </div>
      </div>
    </button>
  );
}
