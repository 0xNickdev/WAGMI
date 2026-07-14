export type RewardAsset = "ETH" | "SAME_TOKEN" | "EXTERNAL";
export type RewardFrequency = "20m" | "1h" | "6h" | "24h";

export interface TokenSocials {
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

export interface RewardConfig {
  burnPct: number;
  devPct: number;
  holderPct: number;
  frequency: RewardFrequency;
  asset: RewardAsset;
  externalAddress?: string;
}

export interface Holder {
  address: string;
  balance: number;
  pctOfSupply: number;
  isContract?: boolean;
  label?: string;
}

export type TradeSide = "buy" | "sell";

export interface Activity {
  id: string;
  type: "buy" | "sell" | "reward" | "burn";
  wallet: string;
  amountToken: number;
  amountUsd: number;
  price?: number;
  ts: number;
  txHash: string;
}

export interface Candle {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export interface Token {
  address: string;
  name: string;
  symbol: string;
  description: string;
  logoColor: string; // gradient seed
  logoUrl?: string; // permanent ipfs:// or https URL of the uploaded logo
  socials: TokenSocials;

  createdAt: number;
  creator: string;
  poolAddress?: string; // Uniswap V3 pool (set by indexer; enables GeckoTerminal embed)
  rewardStock: string; // tokenized stock stakers earn (Stake to Earn)

  price: number;
  priceChange24h: number;
  priceChange1h: number;
  marketCap: number;
  liquidity: number;
  volume24h: number;
  fdv: number;
  supply: number;
  holders: number;
  txns24h: number;

  buyTax: number;
  sellTax: number;
  reward: RewardConfig;

  trendingScore: number;
  rewardsDistributedUsd: number;
  nextDistributionAt: number;

  sparkline: number[];
}

export interface TreasuryStats {
  tvlUsd: number;
  ethHeld: number;
  usdtHeld: number;
  usdcHeld: number;
  totalDistributedUsd: number;
  nextEpochAt: number;
  currentEpoch: number;
  epochs: EpochRecord[];
}

export interface EpochRecord {
  id: number;
  closedAt: number;
  ethTotal: number;
  stableTotal: number;
  usdValue: number;
  eligibleHolders: number;
  status: "finalized" | "pending" | "active";
}

export interface ClaimablePosition {
  token: Token;
  epochId: number;
  amountBnb: number;
  amountUsd: number;
  eligible: boolean;
  reason?: string;
}
