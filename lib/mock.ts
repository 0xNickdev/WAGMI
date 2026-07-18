import type {
  Token,
  Holder,
  Activity,
  Candle,
  TreasuryStats,
  EpochRecord,
  ClaimablePosition,
} from "./types";

/* ------------------------------------------------------------------ *
 * Deterministic, seeded mock data. Same output on server & client
 * (no hydration mismatch). Stands in for the indexer / REST API.
 * ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hexAddr(rng: () => number): string {
  const chars = "0123456789abcdef";
  let a = "0x";
  for (let i = 0; i < 40; i++) a += chars[Math.floor(rng() * 16)];
  return a;
}

const NAMES: [string, string][] = [
  ["Moon Rabbit", "MRBT"],
  ["Degen Pepe", "DPEPE"],
  ["Golden Bonk", "GBONK"],
  ["Moon Inu", "MINU"],
  ["Bull Run AI", "BRAI"],
  ["Hood Cat", "HCAT"],
  ["Liquid Gold", "LGOLD"],
  ["Based Frog", "BFROG"],
  ["Neon Shiba", "NSHIB"],
  ["Turbo Bull", "TURBO"],
  ["Diamond Paws", "DPAW"],
  ["Yield Yeti", "YETI"],
  ["Rocket Doge", "RDOGE"],
  ["Solar Flare", "FLARE"],
  ["Cyber Koi", "KOI"],
  ["Apex Ape", "AAPE"],
  ["Velvet Bull", "VBULL"],
  ["Quantum Cat", "QCAT"],
  ["Hyper Hodl", "HODL"],
  ["Mega Mango", "MANGO"],
  ["Stellar Sloth", "SLOTH"],
  ["Volt Viper", "VOLT"],
  ["Echo Eagle", "EAGLE"],
  ["Prism Panda", "PANDA"],
];

const GRADIENTS = [
  "#10b981,#6ee7b7",
  "#8b5cf6,#22d3ee",
  "#00c805,#0a8f3c",
  "#ff5000,#6ee7b7",
  "#22d3ee,#8b5cf6",
  "#34d399,#10b981",
  "#ff6ec7,#8b5cf6",
  "#00c805,#22d3ee",
];

const DESCRIPTIONS = [
  "Community-owned meme with a revenue-share engine baked into every trade.",
  "Permissionless launch on Robinhood Chain. Taxes flow straight to holders.",
  "The people's coin. No team allocation, no presale, pure degen energy.",
  "Auto-LP, auto-rewards, auto-moon. Hold and earn from the flywheel.",
  "Every buy and sell feeds the treasury. Holders claim their share each epoch.",
];

function genSparkline(rng: () => number, trend: number): number[] {
  const pts: number[] = [];
  let v = 100;
  for (let i = 0; i < 32; i++) {
    v += (rng() - 0.5 + trend * 0.12) * 6;
    v = Math.max(20, v);
    pts.push(Number(v.toFixed(2)));
  }
  return pts;
}

function buildToken(i: number): Token {
  const [name, symbol] = NAMES[i % NAMES.length];
  const rng = mulberry32(hashStr(symbol) + i * 7919);
  const address = hexAddr(rng);
  const trend = rng() > 0.42 ? 1 : -1;
  const priceChange24h = Number((trend > 0 ? rng() * 260 + 1 : -(rng() * 55 + 2)).toFixed(2));
  const price = Number((rng() * 0.012 + 0.0000004).toFixed(8));
  const supply = 1_000_000_000; // Sketch V1: fixed supply, no minting
  const marketCap = price * supply * (rng() * 4 + 0.5);
  const liquidity = marketCap * (rng() * 0.25 + 0.08);
  const volume24h = marketCap * (rng() * 1.4 + 0.05);
  const ageHours = Math.floor(rng() * 720) + 1;

  const burnPct = rng() > 0.5 ? Math.floor(rng() * 30) : 0;
  const devPct = Math.floor(rng() * 20);
  const holderPct = 100 - burnPct - devPct;
  const freqs = ["20m", "1h", "6h", "24h"] as const;
  const assets = ["ETH", "SAME_TOKEN", "EXTERNAL"] as const;
  const stocks = ["SPCX", "AAPL", "TSLA", "NVDA", "MSFT", "SPY"] as const;

  return {
    address,
    name,
    symbol,
    description: DESCRIPTIONS[i % DESCRIPTIONS.length],
    logoColor: GRADIENTS[i % GRADIENTS.length],
    socials: {
      website: "https://sketch.money",
      twitter: "https://x.com/sketch",
      telegram: "https://t.me/sketch",
      discord: rng() > 0.5 ? "https://discord.gg/sketch" : undefined,
    },
    createdAt: Date.now() - ageHours * 3600_000,
    creator: hexAddr(rng),
    price,
    priceChange24h,
    priceChange1h: Number(((rng() * 40 - 18)).toFixed(2)),
    marketCap,
    liquidity,
    volume24h,
    fdv: price * supply,
    supply,
    holders: Math.floor(rng() * 9000) + 40,
    txns24h: Math.floor(rng() * 12000) + 30,
    buyTax: Math.floor(rng() * 6) + 1,
    sellTax: Math.floor(rng() * 7) + 1,
    reward: {
      burnPct,
      devPct,
      holderPct,
      frequency: freqs[Math.floor(rng() * freqs.length)],
      asset: assets[Math.floor(rng() * assets.length)],
    },
    rewardStock: stocks[Math.floor(rng() * stocks.length)],
    trendingScore: Number((volume24h / 1000 + (priceChange24h > 0 ? priceChange24h : 0) * 50).toFixed(0)),
    rewardsDistributedUsd: marketCap * (rng() * 0.03),
    nextDistributionAt: Date.now() + Math.floor(rng() * 3600_000) + 60_000,
    sparkline: genSparkline(rng, trend),
  };
}

let _tokens: Token[] | null = null;
export function getTokens(): Token[] {
  if (_tokens) return _tokens;
  _tokens = NAMES.map((_, i) => buildToken(i)).sort((a, b) => b.trendingScore - a.trendingScore);
  return _tokens;
}

export function getToken(address: string): Token | undefined {
  return getTokens().find((t) => t.address.toLowerCase() === address.toLowerCase());
}

export function getTrending(n = 8): Token[] {
  return [...getTokens()].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, n);
}

export function getNewTokens(n = 8): Token[] {
  return [...getTokens()].sort((a, b) => b.createdAt - a.createdAt).slice(0, n);
}

export function getGainers(n = 8): Token[] {
  return [...getTokens()].sort((a, b) => b.priceChange24h - a.priceChange24h).slice(0, n);
}

export function getHolders(token: Token): Holder[] {
  const rng = mulberry32(hashStr(token.address) + 13);
  const labels = ["Uniswap LP", "Treasury", "Burn", "Whale", "", "", "", ""];
  let remaining = 62;
  const out: Holder[] = [];
  for (let i = 0; i < 20; i++) {
    const pct = i === 0 ? 18 + rng() * 8 : Math.max(0.3, (remaining / (20 - i)) * (0.4 + rng()));
    remaining = Math.max(2, remaining - pct);
    const label = i < 4 ? labels[i] : "";
    out.push({
      address: hexAddr(rng),
      balance: (token.supply * pct) / 100,
      pctOfSupply: Number(pct.toFixed(2)),
      isContract: i < 3,
      label: label || undefined,
    });
  }
  return out.sort((a, b) => b.pctOfSupply - a.pctOfSupply);
}

export function getActivity(token: Token, n = 30): Activity[] {
  const rng = mulberry32(hashStr(token.address) + 99);
  const out: Activity[] = [];
  let ts = Date.now();
  for (let i = 0; i < n; i++) {
    ts -= Math.floor(rng() * 240_000) + 4000;
    const roll = rng();
    let type: Activity["type"] = roll > 0.55 ? "buy" : "sell";
    if (roll > 0.94) type = "reward";
    else if (roll > 0.9) type = "burn";
    const amountUsd = rng() * 8000 + 20;
    out.push({
      id: `${token.address}-${i}`,
      type,
      wallet: hexAddr(rng),
      amountToken: amountUsd / token.price,
      amountUsd,
      price: token.price * (1 + (rng() - 0.5) * 0.04),
      ts,
      txHash: hexAddr(rng),
    });
  }
  return out;
}

export function getCandles(token: Token, count = 90): Candle[] {
  const rng = mulberry32(hashStr(token.address) + 7);
  const out: Candle[] = [];
  let price = token.price * (1 - token.priceChange24h / 100 / 4);
  let t = Date.now() - count * 3600_000;
  for (let i = 0; i < count; i++) {
    const o = price;
    const drift = (rng() - 0.48) * 0.06;
    const c = Math.max(price * 0.0001, o * (1 + drift));
    const h = Math.max(o, c) * (1 + rng() * 0.03);
    const l = Math.min(o, c) * (1 - rng() * 0.03);
    out.push({
      t,
      o,
      h,
      l,
      c,
      v: token.volume24h / count * (0.4 + rng() * 1.6),
    });
    price = c;
    t += 3600_000;
  }
  return out;
}

export function getTreasury(): TreasuryStats {
  const tokens = getTokens();
  const tvlUsd = tokens.reduce((s, t) => s + t.rewardsDistributedUsd, 0) * 1.8 + 1_240_000;
  const rng = mulberry32(424242);
  const epochs: EpochRecord[] = [];
  let t = Date.now();
  for (let i = 0; i < 14; i++) {
    t -= 86_400_000;
    const usd = 18_000 + rng() * 90_000;
    epochs.push({
      id: 142 - i,
      closedAt: t,
      ethTotal: usd / 3200,
      stableTotal: usd * 0.35,
      usdValue: usd,
      eligibleHolders: Math.floor(rng() * 5000) + 800,
      status: i === 0 ? "active" : "finalized",
    });
  }
  return {
    tvlUsd,
    ethHeld: tvlUsd * 0.55 / 3200,
    usdtHeld: tvlUsd * 0.28,
    usdcHeld: tvlUsd * 0.17,
    totalDistributedUsd: epochs.reduce((s, e) => s + e.usdValue, 0) + 2_100_000,
    nextEpochAt: Date.now() + 6 * 3600_000 + 1_800_000,
    currentEpoch: 143,
    epochs,
  };
}

export function getClaimable(connected: boolean): ClaimablePosition[] {
  if (!connected) return [];
  const tokens = getTrending(6);
  const rng = mulberry32(31337);
  return tokens.map((token, i) => {
    const eligible = rng() > 0.3;
    const amountUsd = eligible ? rng() * 480 + 12 : 0;
    return {
      token,
      epochId: 142,
      amountBnb: amountUsd / 3200,
      amountUsd,
      eligible,
      reason: eligible
        ? undefined
        : i % 2 === 0
          ? "Below 500,000 token threshold"
          : "Held under minimum duration",
    };
  });
}

export const PLATFORM_STATS = {
  tokensLaunched: 1284,
  totalVolumeUsd: 48_200_000,
  treasuryTvlUsd: 1_240_000,
  rewardsDistributedUsd: 3_340_000,
  activeTraders24h: 9120,
};
