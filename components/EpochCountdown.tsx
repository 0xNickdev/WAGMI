"use client";

import { useCountdown } from "./useCountdown";
import { cn } from "@/lib/utils";

export function EpochCountdown({
  target,
  className,
  size = "md",
}: {
  target: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const c = useCountdown(target);
  const units = [
    { v: c.days, l: "D", show: c.days > 0 },
    { v: c.hours, l: "H", show: true },
    { v: c.minutes, l: "M", show: true },
    { v: c.seconds, l: "S", show: true },
  ].filter((u) => u.show);

  const box =
    size === "lg" ? "min-w-14 py-2.5 text-2xl" : size === "sm" ? "min-w-9 py-1 text-base" : "min-w-12 py-2 text-xl";

  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      {units.map((u, i) => (
        <div key={u.l} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center">
            <div className={cn("glass rounded-lg px-2 font-bold tabular text-text", box)} suppressHydrationWarning>
              {c.mounted ? String(u.v).padStart(2, "0") : "––"}
            </div>
            <span className="text-[10px] text-faint mt-1">{u.l}</span>
          </div>
          {i < units.length - 1 && <span className="text-faint font-bold -mt-4">:</span>}
        </div>
      ))}
    </div>
  );
}
