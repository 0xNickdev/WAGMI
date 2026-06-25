import { SearchX } from "lucide-react";

export function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center">
        <SearchX size={28} className="text-faint" />
      </div>
      <div>
        <p className="font-semibold text-text">No tokens found</p>
        <p className="text-sm text-muted mt-1">
          No results for{" "}
          <span className="text-gold font-mono">&ldquo;{query}&rdquo;</span>.
          Try a different name or symbol.
        </p>
      </div>
    </div>
  );
}
