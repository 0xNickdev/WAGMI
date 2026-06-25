export type TabKey = "trending" | "new" | "gainers";
export type SortKey = "volume" | "marketCap" | "liquidity" | "holders" | "priceChange";
export type ViewMode = "grid" | "list";

export interface QuickFilter {
  id: string;
  label: string;
}
