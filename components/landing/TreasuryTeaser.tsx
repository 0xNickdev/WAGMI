import { getTreasury } from "@/lib/mock";
import { formatUsd } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EpochCountdown } from "@/components/EpochCountdown";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, Landmark } from "lucide-react";

export function TreasuryTeaser() {
  const t = getTreasury();
  const split = [
    { label: "ETH", value: t.ethHeld * 3200, color: "#10b981" },
    { label: "USDT", value: t.usdtHeld, color: "#00c805" },
    { label: "USDC", value: t.usdcHeld, color: "#22d3ee" },
  ];
  const total = split.reduce((s, x) => s + x.value, 0);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <Reveal>
      <div className="relative glass-strong rounded-3xl p-6 sm:p-10 overflow-hidden border-gradient-gold">
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-3">
              <Landmark size={16} /> Protocol Treasury
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {formatUsd(t.tvlUsd)} <span className="text-muted text-2xl font-medium">working for holders</span>
            </h2>
            <p className="mt-3 text-muted max-w-md">
              Tax revenue from every token accumulates here and is redistributed to eligible
              holders each epoch. Transparent, on-chain, and yours to claim.
            </p>

            <div className="mt-6 space-y-3 max-w-md">
              <div className="h-3 rounded-full overflow-hidden flex bg-surface-2">
                {split.map((s) => (
                  <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                {split.map((s) => (
                  <span key={s.label} className="inline-flex items-center gap-1.5 text-muted">
                    <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                    {s.label} <span className="text-text font-medium tabular">{formatUsd(s.value)}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/claim">
                  Claim Rewards <ArrowRight size={16} />
                </Button>
              <Button href="/treasury" variant="outline">View Treasury</Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-xs uppercase tracking-wider text-faint">Next Distribution Epoch</div>
            <EpochCountdown target={t.nextEpochAt} className="mt-3" />
            <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-xs text-faint">Total Distributed</div>
                <div className="text-lg font-semibold tabular text-up">{formatUsd(t.totalDistributedUsd)}</div>
              </div>
              <div>
                <div className="text-xs text-faint">Current Epoch</div>
                <div className="text-lg font-semibold tabular">#{t.currentEpoch}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}
