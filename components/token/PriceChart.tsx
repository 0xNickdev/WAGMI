"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { Candle } from "@/lib/types";
import { formatPrice, formatUsd, cn } from "@/lib/utils";

interface Props {
  candles: Candle[];
  symbol: string;
}

type TF = "1H" | "4H" | "1D";

function formatTime(ts: number, tf: TF): string {
  const d = new Date(ts);
  if (tf === "1D") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

interface ChartPoint {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  label: string;
}

// Aggregate candles for 4H / 1D views
function aggregate(candles: Candle[], bucketSize: number): Candle[] {
  if (bucketSize <= 1) return candles;
  const out: Candle[] = [];
  for (let i = 0; i < candles.length; i += bucketSize) {
    const slice = candles.slice(i, i + bucketSize);
    if (!slice.length) continue;
    out.push({
      t: slice[0].t,
      o: slice[0].o,
      h: Math.max(...slice.map((c) => c.h)),
      l: Math.min(...slice.map((c) => c.l)),
      c: slice[slice.length - 1].c,
      v: slice.reduce((s, c) => s + c.v, 0),
    });
  }
  return out;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isUp = d.c >= d.o;
  return (
    <div className="glass-strong rounded-xl px-3 py-2.5 text-xs shadow-2xl min-w-[160px]">
      <div className="text-faint mb-1.5 text-[11px]">{new Date(d.t).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        <span className="text-faint">Open</span>
        <span className="tabular text-text text-right">{formatPrice(d.o)}</span>
        <span className="text-faint">High</span>
        <span className="tabular text-up text-right">{formatPrice(d.h)}</span>
        <span className="text-faint">Low</span>
        <span className="tabular text-down text-right">{formatPrice(d.l)}</span>
        <span className="text-faint">Close</span>
        <span className={cn("tabular text-right font-semibold", isUp ? "text-up" : "text-down")}>{formatPrice(d.c)}</span>
        <span className="text-faint">Volume</span>
        <span className="tabular text-muted text-right">{formatUsd(d.v)}</span>
      </div>
    </div>
  );
}

export function PriceChart({ candles, symbol }: Props) {
  const [tf, setTf] = useState<TF>("1H");

  const data: ChartPoint[] = useMemo(() => {
    const bucketMap: Record<TF, number> = { "1H": 1, "4H": 4, "1D": 24 };
    const agg = aggregate(candles, bucketMap[tf]);
    return agg.map((c) => ({ ...c, label: formatTime(c.t, tf) }));
  }, [candles, tf]);

  const prices = data.map((d) => d.c);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const lastClose = data[data.length - 1]?.c ?? 0;
  const firstClose = data[0]?.c ?? 0;
  const chartUp = lastClose >= firstClose;

  const priceColor = chartUp ? "var(--up)" : "var(--down)";
  const gradId = chartUp ? "areaUp" : "areaDown";

  return (
    <div className="flex flex-col gap-0">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-up shrink-0 live-dot" />
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            ${symbol} / USD
          </span>
          <span className="text-xs text-faint">LIVE</span>
        </div>
        <div className="flex items-center gap-1">
          {(["1H", "4H", "1D"] as TF[]).map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                tf === t
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "text-faint hover:text-text hover:bg-surface-2/60",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Area price chart */}
      <div className="px-1 pt-3" style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={priceColor} stopOpacity={0.22} />
                <stop offset="85%" stopColor={priceColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--text-faint)", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fill: "var(--text-faint)", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              width={72}
              tickFormatter={(v: number) => formatPrice(v)}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
            <ReferenceLine
              y={lastClose}
              stroke={priceColor}
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="c"
              stroke={priceColor}
              strokeWidth={1.5}
              fill={`url(#${gradId})`}
              dot={false}
              activeDot={{ r: 3, fill: priceColor, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume bar sub-chart */}
      <div className="px-1 pb-1" style={{ height: 64 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
            <YAxis hide domain={[0, "auto"]} />
            <Tooltip content={() => null} cursor={false} />
            <Bar
              dataKey="v"
              fill={chartUp ? "rgba(46,230,166,0.25)" : "rgba(255,84,112,0.25)"}
              radius={[2, 2, 0, 0]}
              maxBarSize={12}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
