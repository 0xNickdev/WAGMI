"use client";

import { useMemo, useState } from "react";
import type { Bounty } from "@/lib/bounties";
import { getBounties, getBountyStats } from "@/lib/bounties";
import { GraffitiTitle } from "@/components/bounty/GraffitiTitle";
import { BountyCard } from "@/components/bounty/BountyCard";
import { BountySidebar } from "@/components/bounty/BountySidebar";
import { CreateBountyModal } from "@/components/bounty/CreateBountyModal";
import { BountyDetailModal } from "@/components/bounty/BountyDetailModal";
import { Button } from "@/components/ui/Button";
import { formatUsd, cn } from "@/lib/utils";
import { Plus, Search, Radio, Coins, Send, BadgeDollarSign } from "lucide-react";

const TABS = ["Trending", "Bounties", "Submissions"] as const;
type Tab = (typeof TABS)[number];

export default function BountyPage() {
  const all = getBounties();
  const stats = getBountyStats();
  const [tab, setTab] = useState<Tab>("Trending");
  const [q, setQ] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [active, setActive] = useState<Bounty | null>(null);

  const list = useMemo(() => {
    let l = [...all];
    if (tab === "Bounties") l = l.sort((a, b) => b.createdAt - a.createdAt);
    if (tab === "Submissions") l = l.sort((a, b) => b.submissions - a.submissions);
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((b) => b.title.toLowerCase().includes(s) || b.summary.toLowerCase().includes(s) || b.category.toLowerCase().includes(s));
    }
    return l;
  }, [all, tab, q]);

  const topReward = [...all].sort((a, b) => b.rewardUsd - a.rewardUsd);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl glass-strong p-7 sm:p-10 grid-bg mb-8">
        <div className="absolute -top-20 -right-10 size-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <GraffitiTitle />
            <p className="mt-4 max-w-xl text-muted">
              Post real-life tasks, fund them in ETH, and pay out the degens who actually do them.
              Shave WAGMI into your head, tag a landmark, start a flash mob — submit proof, get paid.
            </p>
          </div>
          <Button size="lg" onClick={() => setCreateOpen(true)} className="shrink-0">
            <Plus size={18} /> Create Bounty
          </Button>
        </div>

        {/* Stats */}
        <div className="relative mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat icon={<Radio size={15} className="text-up" />} label="Live Bounties" value={stats.live.toLocaleString()} />
          <Stat icon={<Coins size={15} className="text-gold" />} label="Total Rewards" value={formatUsd(stats.totalRewardsUsd)} />
          <Stat icon={<Send size={15} className="text-cyan" />} label="Submissions" value={stats.submissions.toLocaleString()} />
          <Stat icon={<BadgeDollarSign size={15} className="text-violet" />} label="Paid Out" value={formatUsd(stats.paidOutUsd)} />
        </div>
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex gap-1 glass rounded-xl p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", tab === t ? "bg-gold text-black" : "text-muted hover:text-text")}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bounties…"
            className="w-full rounded-xl bg-surface-2 border border-border-strong pl-9 pr-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold/50 placeholder:text-faint"
          />
        </div>
      </div>

      {/* Grid + sidebar */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div>
          {list.length ? (
            <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
              {list.map((b) => (
                <BountyCard key={b.id} bounty={b} onOpen={setActive} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-16 text-center text-muted">
              No bounties match “{q}”. Try another search or{" "}
              <button onClick={() => setCreateOpen(true)} className="text-gold hover:underline">create one</button>.
            </div>
          )}
        </div>
        <BountySidebar topReward={topReward} onOpen={setActive} />
      </div>

      <CreateBountyModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <BountyDetailModal bounty={active} onClose={() => setActive(null)} />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-faint text-xs uppercase tracking-wider">
        {icon} {label}
      </div>
      <div className="mt-1 text-xl font-bold tabular">{value}</div>
    </div>
  );
}
