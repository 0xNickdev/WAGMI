import { getTreasury } from "@/lib/mock";
import { formatUsd, formatNum } from "@/lib/utils";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { EpochCountdown } from "@/components/EpochCountdown";
import { SectionHeader } from "@/components/SectionHeader";
import { TreasuryDonut } from "@/components/dashboard/TreasuryDonut";
import { DistributionChart } from "@/components/dashboard/DistributionChart";
import { EpochTable } from "@/components/dashboard/EpochTable";
import { Landmark, TrendingUp, Coins, CalendarClock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Treasury — WAGMII",
  description: "Protocol treasury stats, asset breakdown, and epoch distribution history.",
};

export default function TreasuryPage() {
  const t = getTreasury();

  const bnbUsd = t.bnbHeld * 620;
  const slices = [
    { label: "BNB", value: bnbUsd, color: "#f0b90b" },
    { label: "USDT", value: t.usdtHeld, color: "#2ee6a6" },
    { label: "USDC", value: t.usdcHeld, color: "#22d3ee" },
  ];

  const activeEpoch = t.epochs.find((e) => e.status === "active");
  const avgDistribution =
    t.epochs.filter((e) => e.status === "finalized").reduce((s, e) => s + e.usdValue, 0) /
    Math.max(1, t.epochs.filter((e) => e.status === "finalized").length);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* ── Page header ── */}
      <SectionHeader
        title="Protocol Treasury"
        subtitle="On-chain revenue accumulation and holder distribution engine"
        icon={<Landmark className="text-gold" size={22} />}
      />

      {/* ── Hero stats row ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* TVL */}
        <div className="relative glass-strong rounded-2xl p-5 border-gradient-gold overflow-hidden lg:col-span-1">
          <div className="absolute -top-16 -right-16 size-40 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-faint mb-2">
              <Coins size={13} /> Treasury TVL
            </div>
            <div className="text-3xl font-bold tabular text-gradient-gold">
              <AnimatedNumber value={t.tvlUsd} preset="usd" />
            </div>
            <div className="text-xs text-muted mt-1">
              {t.bnbHeld.toFixed(2)} BNB · {formatUsd(t.usdtHeld)} USDT · {formatUsd(t.usdcHeld)} USDC
            </div>
          </div>
        </div>

        {/* Total distributed */}
        <Card>
          <CardBody>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-faint mb-2">
              <TrendingUp size={13} className="text-up" /> Total Distributed
            </div>
            <div className="text-2xl font-bold tabular text-up">
              <AnimatedNumber value={t.totalDistributedUsd} preset="usd" />
            </div>
            <div className="text-xs text-muted mt-1">All-time to holders</div>
          </CardBody>
        </Card>

        {/* Current epoch */}
        <Card>
          <CardBody>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-faint mb-2">
              <CalendarClock size={13} className="text-violet" /> Current Epoch
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular">#{t.currentEpoch}</span>
              <Badge tone="up">Active</Badge>
            </div>
            <div className="text-xs text-muted mt-1">
              Avg distribution {formatUsd(avgDistribution)}
            </div>
          </CardBody>
        </Card>

        {/* Next epoch countdown */}
        <Card>
          <CardBody className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-xs uppercase tracking-wider text-faint">Next Epoch In</div>
            <EpochCountdown target={t.nextEpochAt} size="sm" />
            {activeEpoch && (
              <div className="text-xs text-muted">
                {formatNum(activeEpoch.eligibleHolders)} eligible holders
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* ── Asset breakdown + distribution chart ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] mb-8">
        {/* Donut */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Breakdown</CardTitle>
          </CardHeader>
          <CardBody className="pt-4">
            <TreasuryDonut slices={slices} />
          </CardBody>
        </Card>

        {/* Bar chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Distribution History</CardTitle>
              <Badge tone="gold">Last {t.epochs.length} epochs</Badge>
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <DistributionChart epochs={t.epochs} />
          </CardBody>
        </Card>
      </div>

      {/* ── Epoch history table ── */}
      <Card className="mb-10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Epoch History</CardTitle>
            <span className="text-xs text-faint tabular">{t.epochs.length} epochs shown</span>
          </div>
        </CardHeader>
        <EpochTable epochs={t.epochs} />
      </Card>

      {/* ── CTA ── */}
      <div className="relative glass-strong rounded-3xl p-8 sm:p-10 text-center overflow-hidden grid-bg">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-64 rounded-full bg-gold/8 blur-3xl pointer-events-none" />
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Eligible holders earn every epoch
          </h2>
          <p className="text-muted mt-2 max-w-md mx-auto text-sm">
            Connect your wallet to see your claimable positions and receive your share of protocol revenue.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button href="/claim" size="lg">
                Claim Rewards <ArrowRight size={16} />
              </Button>
            <Button href="/leaderboard" variant="outline" size="lg">View Leaderboard</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
