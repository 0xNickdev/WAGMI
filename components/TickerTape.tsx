import Link from "next/link";
import { getTrending } from "@/lib/mock";
import { formatPrice } from "@/lib/utils";

export function TickerTape() {
  const tokens = getTrending(14);

  return (
    <div className="marquee relative overflow-hidden border-y border-border bg-bg-elevated/50">
      <div className="marquee-track flex w-max items-center">
        {[false, true].map((clone) => (
          <div
            key={clone ? "b" : "a"}
            aria-hidden={clone}
            className="flex items-center gap-8 py-2.5 pl-8"
          >
            {tokens.map((t) => (
              <Link
                key={t.address}
                href={`/token/${t.address}`}
                tabIndex={clone ? -1 : undefined}
                className="flex items-center gap-2 text-xs shrink-0 hover:opacity-80 transition-opacity"
              >
                <span className="font-mono font-medium text-muted">${t.symbol}</span>
                <span className="tabular text-faint">{formatPrice(t.price)}</span>
                <span className={`tabular ${t.priceChange24h >= 0 ? "text-up" : "text-down"}`}>
                  {t.priceChange24h >= 0 ? "▲" : "▼"} {Math.abs(t.priceChange24h).toFixed(1)}%
                </span>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent pointer-events-none" />
    </div>
  );
}
