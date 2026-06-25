import { cn } from "@/lib/utils";

export function ListHeader() {
  return (
    <div className="grid grid-cols-[auto_1.6fr_1fr_1fr_1fr_1fr_auto] items-center gap-3 px-4 py-2 rounded-xl bg-surface-2/50 border border-border mb-1">
      <span className="w-6" />
      <span className="text-xs font-semibold uppercase tracking-wider text-faint">Token</span>
      <span className="text-xs font-semibold uppercase tracking-wider text-faint text-right">Price</span>
      <span className="text-xs font-semibold uppercase tracking-wider text-faint text-right">24h %</span>
      <span className={cn("hidden sm:block text-xs font-semibold uppercase tracking-wider text-faint text-right")}>
        Volume
      </span>
      <span className={cn("hidden md:block text-xs font-semibold uppercase tracking-wider text-faint text-right")}>
        Mkt Cap
      </span>
      <span className={cn("hidden lg:block text-xs font-semibold uppercase tracking-wider text-faint text-right w-[88px]")}>
        Chart
      </span>
    </div>
  );
}
