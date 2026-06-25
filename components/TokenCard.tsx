import Link from "next/link";
import type { Token } from "@/lib/types";
import { TokenLogo } from "./ui/TokenLogo";
import { Sparkline } from "./ui/Sparkline";
import { ChangeBadge } from "./ui/Badge";
import { formatPrice, formatUsd, timeAgo, cn } from "@/lib/utils";
import { Flame, Users } from "lucide-react";

export function TokenCard({ token, rank }: { token: Token; rank?: number }) {
  return (
    <Link
      href={`/token/${token.address}`}
      className="group glass rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:border-gold/40 hover:-translate-y-0.5 hover:glow-gold"
    >
      <div className="flex items-center gap-3">
        <TokenLogo symbol={token.symbol} gradient={token.logoColor} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold truncate">{token.name}</span>
            {rank != null && rank < 3 && <Flame size={13} className="text-amber shrink-0" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-faint">
            <span className="font-mono">${token.symbol}</span>
            <span>·</span>
            <span>{timeAgo(token.createdAt)} ago</span>
          </div>
        </div>
        {rank != null && (
          <span className="text-xs font-mono text-faint bg-surface-2 rounded-md px-1.5 py-0.5">
            #{rank + 1}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-semibold tabular">{formatPrice(token.price)}</div>
          <ChangeBadge value={token.priceChange24h} />
        </div>
        <Sparkline data={token.sparkline} width={96} height={36} />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
        <Mini label="MCap" value={formatUsd(token.marketCap)} />
        <Mini label="Vol 24h" value={formatUsd(token.volume24h)} />
        <Mini label="Holders" value={token.holders.toLocaleString()} icon={<Users size={10} />} />
      </div>
    </Link>
  );
}

function Mini({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-faint flex items-center justify-center gap-0.5">
        {icon}
        {label}
      </span>
      <span className="text-xs font-medium tabular">{value}</span>
    </div>
  );
}

export function TokenRow({ token, rank }: { token: Token; rank: number }) {
  return (
    <Link
      href={`/token/${token.address}`}
      className="grid grid-cols-[auto_1.6fr_1fr_1fr_1fr_1fr_auto] items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-2/60 transition-colors group"
    >
      <span className="w-6 text-center text-sm font-mono text-faint">{rank + 1}</span>
      <div className="flex items-center gap-3 min-w-0">
        <TokenLogo symbol={token.symbol} gradient={token.logoColor} size={36} />
        <div className="min-w-0">
          <div className="font-medium truncate group-hover:text-gold transition-colors">{token.name}</div>
          <div className="text-xs text-faint font-mono">${token.symbol}</div>
        </div>
      </div>
      <div className="text-right tabular text-sm">{formatPrice(token.price)}</div>
      <div className="text-right">
        <ChangeBadge value={token.priceChange24h} />
      </div>
      <div className="hidden sm:block text-right tabular text-sm text-muted">{formatUsd(token.volume24h)}</div>
      <div className="hidden md:block text-right tabular text-sm text-muted">{formatUsd(token.marketCap)}</div>
      <div className={cn("hidden lg:block w-[88px] justify-self-end")}>
        <Sparkline data={token.sparkline} width={88} height={28} strokeWidth={1.5} />
      </div>
    </Link>
  );
}
