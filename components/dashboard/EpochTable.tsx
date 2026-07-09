"use client";

import type { EpochRecord } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { formatUsd, formatNum } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  epochs: EpochRecord[];
}

function statusTone(s: EpochRecord["status"]): "gold" | "up" | "neutral" {
  if (s === "active") return "up";
  if (s === "pending") return "gold";
  return "neutral";
}

function fmtDate(ms: number) {
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function EpochTable({ epochs }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 px-4 text-left text-xs uppercase tracking-wider text-faint font-medium">Epoch</th>
            <th className="py-3 px-4 text-left text-xs uppercase tracking-wider text-faint font-medium hidden sm:table-cell">Date</th>
            <th className="py-3 px-4 text-right text-xs uppercase tracking-wider text-faint font-medium">Distributed</th>
            <th className="py-3 px-4 text-right text-xs uppercase tracking-wider text-faint font-medium hidden md:table-cell">ETH</th>
            <th className="py-3 px-4 text-right text-xs uppercase tracking-wider text-faint font-medium hidden md:table-cell">Stables</th>
            <th className="py-3 px-4 text-right text-xs uppercase tracking-wider text-faint font-medium hidden lg:table-cell">Holders</th>
            <th className="py-3 px-4 text-right text-xs uppercase tracking-wider text-faint font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {epochs.map((e, i) => (
            <tr
              key={e.id}
              className={cn(
                "border-b border-border/50 transition-colors hover:bg-surface-2/40",
                e.status === "active" && "bg-up/5",
              )}
            >
              <td className="py-3 px-4 font-mono font-semibold text-text">
                <span className={cn(e.status === "active" && "text-up")}>#{e.id}</span>
                {i === 0 && (
                  <span className="ml-2 text-[10px] uppercase tracking-wider text-up opacity-70">Live</span>
                )}
              </td>
              <td className="py-3 px-4 text-muted hidden sm:table-cell">{fmtDate(e.closedAt)}</td>
              <td className="py-3 px-4 text-right tabular font-semibold text-gold">{formatUsd(e.usdValue)}</td>
              <td className="py-3 px-4 text-right tabular text-muted hidden md:table-cell">
                {e.ethTotal.toFixed(2)} ETH
              </td>
              <td className="py-3 px-4 text-right tabular text-muted hidden md:table-cell">
                {formatUsd(e.stableTotal)}
              </td>
              <td className="py-3 px-4 text-right tabular text-muted hidden lg:table-cell">
                {formatNum(e.eligibleHolders)}
              </td>
              <td className="py-3 px-4 text-right">
                <Badge tone={statusTone(e.status)} className="capitalize">
                  {e.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
