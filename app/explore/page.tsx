import { Compass } from "lucide-react";
import { getTokens } from "@/lib/mock";
import { ExploreClient } from "@/components/explore/ExploreClient";

export const metadata = {
  title: "Explore Tokens — Sketch",
  description:
    "Discover every token on the Sketch launchpad. Filter by trending, new, or top gainers. Search, sort, and find your next trade.",
};

export default function ExplorePage() {
  const total = getTokens().length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
            <Compass size={20} className="text-gold" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Explore <span className="text-gradient-gold">Tokens</span>
          </h1>
        </div>
        <p className="text-muted text-sm sm:text-base mt-1 ml-[52px]">
          Discover, filter, and trade from{" "}
          <span className="text-text font-semibold tabular">{total}</span> tokens
          live on the Sketch launchpad.
        </p>
      </div>

      {/* Interactive client layer */}
      <ExploreClient totalCount={total} />
    </div>
  );
}
