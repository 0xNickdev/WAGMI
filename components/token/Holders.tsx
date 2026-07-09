import type { Holder } from "@/lib/types";
import { shortAddr, formatNum, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface Props {
  holders: Holder[];
  supply: number;
}

export function Holders({ holders, supply }: Props) {
  const sorted = [...holders].sort((a, b) => b.pctOfSupply - a.pctOfSupply);
  const maxPct = sorted[0]?.pctOfSupply ?? 1;

  return (
    <div className="divide-y divide-border/50">
      {/* Column headers */}
      <div className="grid grid-cols-[32px_1fr_100px_120px] gap-3 px-5 py-2 text-[10px] uppercase tracking-wider text-faint">
        <span>#</span>
        <span>Address</span>
        <span className="text-right">Balance</span>
        <span className="text-right">% Supply</span>
      </div>

      {sorted.map((h, i) => (
        <div
          key={h.address}
          className="grid grid-cols-[32px_1fr_100px_120px] gap-3 items-center px-5 py-2.5 hover:bg-surface-2/40 transition-colors group"
        >
          {/* Rank */}
          <span className="text-xs font-mono text-faint text-center">{i + 1}</span>

          {/* Address + label */}
          <div className="flex items-center gap-2 min-w-0">
            <a
              href={`https://explorer.robinhoodchain.io/address/${h.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tabular text-xs font-mono text-muted group-hover:text-gold transition-colors truncate"
            >
              {shortAddr(h.address)}
            </a>
            {h.label && (
              <Badge
                tone={
                  h.label === "Burn"
                    ? "gold"
                    : h.label.includes("Uniswap")
                    ? "cyan"
                    : h.label === "Treasury"
                    ? "violet"
                    : "neutral"
                }
                className="text-[10px] shrink-0"
              >
                {h.label}
              </Badge>
            )}
          </div>

          {/* Balance */}
          <span className="tabular text-xs text-right text-text">
            {formatNum(h.balance, { compact: true })}
          </span>

          {/* % + bar */}
          <div className="flex items-center gap-2 justify-end">
            <div className="flex-1 max-w-[64px] h-1 rounded-full bg-surface-2 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  i === 0
                    ? "bg-gold"
                    : i < 3
                    ? "bg-violet"
                    : "bg-border-strong",
                )}
                style={{ width: `${(h.pctOfSupply / maxPct) * 100}%` }}
              />
            </div>
            <span className="tabular text-xs text-muted w-12 text-right shrink-0">
              {h.pctOfSupply.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}

      <div className="px-5 py-3 text-[11px] text-faint">
        Showing top {sorted.length} holders · {formatNum(supply, { compact: true })} total supply
      </div>
    </div>
  );
}
