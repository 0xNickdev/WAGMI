"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { EpochRecord } from "@/lib/types";
import { formatUsd } from "@/lib/utils";

interface Props {
  epochs: EpochRecord[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-sm shadow-xl">
      <div className="text-faint text-xs mb-1">Epoch #{label}</div>
      <div className="font-semibold tabular text-gold">{formatUsd(payload[0].value)}</div>
    </div>
  );
}

export function DistributionChart({ epochs }: Props) {
  // oldest to newest
  const data = [...epochs].reverse().map((e) => ({
    id: e.id,
    usdValue: e.usdValue,
    status: e.status,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%">
        <defs>
          <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7ff8f" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#d6ff54" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="activeBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00c805" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#0a8f3c" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="id"
          tick={{ fill: "#6f6a7d", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `#${v}`}
        />
        <YAxis
          tick={{ fill: "#6f6a7d", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          width={42}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="usdValue" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.id}
              fill={entry.status === "active" ? "url(#activeBar)" : "url(#goldBar)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
