"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatUsd } from "@/lib/utils";

interface Slice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  slices: Slice[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Slice }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-sm shadow-xl">
      <div className="font-semibold" style={{ color: d.color }}>{d.label}</div>
      <div className="tabular text-text">{formatUsd(d.value)}</div>
    </div>
  );
}

export function TreasuryDonut({ slices }: Props) {
  const total = slices.reduce((s, x) => s + x.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={3}
              strokeWidth={0}
            >
              {slices.map((s) => (
                <Cell key={s.label} fill={s.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-wider text-faint">TVL</span>
          <span className="text-sm font-bold tabular text-gold">{formatUsd(total, { compact: true })}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {slices.map((s) => {
          const pct = (s.value / total) * 100;
          return (
            <div key={s.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <span className="size-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  {s.label}
                </span>
                <span className="tabular text-text font-medium">{formatUsd(s.value)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: s.color }}
                />
              </div>
              <div className="text-xs text-faint text-right tabular">{pct.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
