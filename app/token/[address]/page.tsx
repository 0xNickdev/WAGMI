import { notFound } from "next/navigation";
import { getToken, getHolders, getActivity, getCandles } from "@/lib/mock";
import { Card, CardHeader, CardBody, CardTitle } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { formatUsd, formatNum, formatPrice, timeAgo } from "@/lib/utils";
import {
  DollarSign,
  BarChart2,
  Droplets,
  TrendingUp,
  Users,
  ArrowRightLeft,
  Layers,
  ShieldAlert,
} from "lucide-react";

import { TokenHeader } from "@/components/token/TokenHeader";
import { GeckoChart } from "@/components/token/GeckoChart";
import { ActivityFeed } from "@/components/token/ActivityFeed";
import { Holders } from "@/components/token/Holders";
import { TradePanel } from "@/components/token/TradePanel";
import { RewardPanel } from "@/components/token/RewardPanel";

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const token = getToken(address);
  if (!token) notFound();

  const holders = getHolders(token);
  const activity = getActivity(token, 30);
  const candles = getCandles(token, 90);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* Header */}
      <TokenHeader token={token} />

      {/* Description */}
      {token.description && (
        <p className="text-sm text-muted max-w-2xl leading-relaxed">{token.description}</p>
      )}

      {/* Two-column layout: main + sticky rail */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── MAIN COLUMN ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* 1. Overview stats grid */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <Stat
                  label="Price"
                  value={formatPrice(token.price)}
                  icon={<DollarSign size={12} />}
                />
                <Stat
                  label="Market Cap"
                  value={formatUsd(token.marketCap)}
                  icon={<BarChart2 size={12} />}
                />
                <Stat
                  label="Liquidity"
                  value={formatUsd(token.liquidity)}
                  icon={<Droplets size={12} />}
                />
                <Stat
                  label="Volume 24h"
                  value={formatUsd(token.volume24h)}
                  icon={<TrendingUp size={12} />}
                />
                <Stat
                  label="FDV"
                  value={formatUsd(token.fdv)}
                  icon={<Layers size={12} />}
                />
                <Stat
                  label="Holders"
                  value={formatNum(token.holders)}
                  icon={<Users size={12} />}
                />
                <Stat
                  label="Txns 24h"
                  value={formatNum(token.txns24h)}
                  icon={<ArrowRightLeft size={12} />}
                />
                {/* Buy/Sell tax */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-faint">
                    <ShieldAlert size={12} />
                    <span className="text-xs font-medium uppercase tracking-wider">Tax</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold tabular">
                    <span className="text-up">{token.buyTax}% buy</span>
                    <span className="text-faint">/</span>
                    <span className="text-down">{token.sellTax}% sell</span>
                  </div>
                  <div className="text-xs text-muted">
                    Created {timeAgo(token.createdAt)} ago
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 2. Live chart */}
          <Card className="overflow-hidden">
            <GeckoChart token={token} candles={candles} />
          </Card>

          {/* 3. Activity feed */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Live Activity</CardTitle>
            </CardHeader>
            <ActivityFeed activity={activity} />
          </Card>

          {/* 4. Holder analytics */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Top Holders</CardTitle>
            </CardHeader>
            <Holders holders={holders} supply={token.supply} />
          </Card>
        </div>

        {/* ── RIGHT RAIL ── */}
        <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-20">
          {/* Trade panel */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Trade</CardTitle>
            </CardHeader>
            <TradePanel token={token} />
          </Card>

          {/* Reward panel */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <RewardPanel token={token} />
          </Card>
        </div>
      </div>
    </div>
  );
}
