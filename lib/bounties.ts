/* WAGMI Bounty — real-life task marketplace (pump.fun-bounty style).
   Deterministic seeded mock data; stands in for the indexer/API. */

const BNB_USD = 620;

export type BountyStatus = "live" | "paid" | "expired";

export interface Bounty {
  id: string;
  title: string;
  summary: string;
  emoji: string;
  gradient: string; // "c1,c2"
  rewardUsd: number;
  winners: number;
  creator: string;
  creatorAvatar: string; // gradient seed
  submissions: number;
  status: BountyStatus;
  createdAt: number;
  expiresAt: number;
  deliverables: string[];
  category: string;
  featured?: boolean;
}

export interface Earner {
  handle: string;
  avatar: string;
  earnedUsd: number;
}

export interface Creator {
  handle: string;
  avatar: string;
  postedUsd: number;
  bounties: number;
}

export interface Submission {
  id: string;
  bountyId: string;
  handle: string;
  avatar: string;
  note: string;
  ts: number;
  status: "pending" | "won" | "rejected";
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const GRADS = [
  "#f0b90b,#ff9d2e",
  "#8b5cf6,#22d3ee",
  "#2ee6a6,#12996b",
  "#ff5470,#ff9d2e",
  "#22d3ee,#8b5cf6",
  "#ffd34e,#f0b90b",
  "#ff6ec7,#8b5cf6",
  "#2ee6a6,#22d3ee",
];

const SEED: Omit<Bounty, "id" | "gradient" | "creatorAvatar" | "createdAt" | "expiresAt" | "status" | "submissions" | "rewardUsd" | "winners">[] = [
  {
    title: "Shave WAGMI into your head",
    summary: "Get a fresh haircut with WAGMI shaved or dyed into the back of your head. Walk around a busy street for the video.",
    emoji: "💈",
    creator: "0xDegenBarber",
    deliverables: ["Clear photo of the WAGMI cut", "10s video walking in public", "Post on X tagging @wagmii"],
    category: "IRL",
    featured: true,
  },
  {
    title: "WAGMI sign at a landmark",
    summary: "Hold a WAGMI sign in front of a recognizable landmark in your city. Bonus for crowds in frame.",
    emoji: "🪧",
    creator: "0xTravelApe",
    deliverables: ["Photo with landmark clearly visible", "Sign must read 'WAGMII.money'"],
    category: "IRL",
  },
  {
    title: "Tattoo the WAGMII logo",
    summary: "Real (or high-quality temporary) WAGMII logo tattoo. Show the studio and the fresh ink.",
    emoji: "🖋️",
    creator: "0xInkLord",
    deliverables: ["Video at the tattoo studio", "Close-up of finished tattoo", "Receipt / proof of session"],
    category: "IRL",
    featured: true,
  },
  {
    title: "Order 'one WAGMI please' at a drive-thru",
    summary: "Roll up to any fast-food drive-thru and order exactly 'one WAGMI please'. Capture their reaction.",
    emoji: "🍔",
    creator: "0xPrankCat",
    deliverables: ["Unedited drive-thru clip", "Audio must be clear"],
    category: "Prank",
  },
  {
    title: "Best WAGMI meme (original)",
    summary: "Create an original WAGMII meme. Must be your own art, no reposts. Top 3 split the reward.",
    emoji: "🎨",
    creator: "0xMemeWizard",
    deliverables: ["Original image (no watermark theft)", "Posted on X with #WAGMII"],
    category: "Content",
  },
  {
    title: "WAGMI chant at a sports game",
    summary: "Start a 'WAGMI! WAGMI!' chant at any live sports event. The louder the section, the better.",
    emoji: "📣",
    creator: "0xUltraFan",
    deliverables: ["Video with crowd audible", "Geotag or ticket stub"],
    category: "IRL",
  },
  {
    title: "Skywriting / drone show: WAGMI",
    summary: "Arrange skywriting or a drone light show spelling WAGMI. High effort, high reward.",
    emoji: "✈️",
    creator: "0xWhaleVision",
    deliverables: ["Wide video of the sky display", "Behind-the-scenes proof of booking"],
    category: "IRL",
    featured: true,
  },
  {
    title: "Cook a WAGMI-shaped dish",
    summary: "Bake or plate food spelling WAGMI. Pancakes, latte art, pizza — chef's choice.",
    emoji: "🥞",
    creator: "0xChefBonk",
    deliverables: ["Photo of the finished dish", "Short making-of clip"],
    category: "Content",
  },
  {
    title: "WAGMI graffiti (legal wall)",
    summary: "Spray WAGMII on a legal graffiti wall. Tag the location. No vandalism — legal spots only.",
    emoji: "🧴",
    creator: "0xStreetArt",
    deliverables: ["Timelapse of the piece", "Proof the wall is legal", "Final photo"],
    category: "IRL",
  },
  {
    title: "Thread: why WAGMII flips the launchpad game",
    summary: "Write a banger X thread explaining the WAGMII revenue-share flywheel. Min 6 posts.",
    emoji: "🧵",
    creator: "0xCryptoScribe",
    deliverables: ["Link to live thread", "Min 6 posts, accurate info"],
    category: "Content",
  },
  {
    title: "WAGMI flash mob",
    summary: "Organize 5+ people for a 30s WAGMI flash mob in a public square.",
    emoji: "🕺",
    creator: "0xHypeMachine",
    deliverables: ["Single continuous video", "5+ participants visible"],
    category: "IRL",
    featured: true,
  },
  {
    title: "Custom WAGMI car wrap photo",
    summary: "Wrap (or decal) WAGMII on your car and park it somewhere iconic.",
    emoji: "🏎️",
    creator: "0xGarageGod",
    deliverables: ["Photo of wrapped car", "Sign visible from 5m"],
    category: "IRL",
  },
];

let _bounties: Bounty[] | null = null;
export function getBounties(): Bounty[] {
  if (_bounties) return _bounties;
  _bounties = SEED.map((b, i) => {
    const rng = mulberry32(hash(b.title) + i * 7919);
    const ageH = Math.floor(rng() * 120) + 1;
    const roll = rng();
    const status: BountyStatus = roll > 0.82 ? "paid" : roll > 0.72 ? "expired" : "live";
    return {
      ...b,
      id: "b" + (i + 1),
      gradient: GRADS[i % GRADS.length],
      creatorAvatar: GRADS[(i + 3) % GRADS.length],
      rewardUsd: Math.round((rng() * 1400 + 40) * (b.featured ? 2.2 : 1)),
      winners: rng() > 0.6 ? Math.floor(rng() * 3) + 2 : 1,
      submissions: Math.floor(rng() * 90) + (status === "live" ? 1 : 5),
      status,
      createdAt: Date.now() - ageH * 3600_000,
      expiresAt: Date.now() + Math.floor(rng() * 6 + 1) * 86400_000,
    };
  }).sort((a, b) => b.rewardUsd + b.submissions * 5 - (a.rewardUsd + a.submissions * 5));
  return _bounties;
}

export function getBounty(id: string) {
  return getBounties().find((b) => b.id === id);
}

export function bnbOf(usd: number) {
  return usd / BNB_USD;
}

export function getBountyStats() {
  const all = getBounties();
  return {
    live: all.filter((b) => b.status === "live").length * 23 + 12,
    totalRewardsUsd: all.reduce((s, b) => s + b.rewardUsd, 0) * 18 + 220_000,
    submissions: all.reduce((s, b) => s + b.submissions, 0) * 14 + 1725,
    paidOutUsd: 500_000 + all.filter((b) => b.status === "paid").reduce((s, b) => s + b.rewardUsd, 0) * 12,
  };
}

const HANDLES = ["swordcoiner", "battler", "shenry", "degenmax", "apegrease", "bilyu", "inkjet", "frenwhale", "cryptojen", "moonmuse"];
export function getTopEarners(): Earner[] {
  const rng = mulberry32(99);
  return HANDLES.slice(0, 5)
    .map((h, i) => ({ handle: h, avatar: GRADS[i % GRADS.length], earnedUsd: Math.round((50000 - i * 8000) * (0.7 + rng() * 0.6)) }))
    .sort((a, b) => b.earnedUsd - a.earnedUsd);
}
export function getTopCreators(): Creator[] {
  const rng = mulberry32(7);
  return HANDLES.slice(3, 8)
    .map((h, i) => ({ handle: h, avatar: GRADS[(i + 2) % GRADS.length], postedUsd: Math.round((40000 - i * 6000) * (0.7 + rng() * 0.6)), bounties: Math.floor(rng() * 20) + 3 }))
    .sort((a, b) => b.postedUsd - a.postedUsd);
}

export function getSubmissions(bountyId: string): Submission[] {
  const rng = mulberry32(hash(bountyId) + 5);
  const n = Math.floor(rng() * 5) + 3;
  const notes = [
    "Done! posted on X, link in proof 🔥",
    "Took me 3 takes but nailed it wagmi",
    "full video attached, crowd went wild",
    "legal wall confirmed, timelapse included",
    "fresh cut 💈 walked the whole block",
    "behind the scenes + final shot attached",
  ];
  let ts = Date.now();
  return Array.from({ length: n }, (_, i) => {
    ts -= Math.floor(rng() * 7200_000) + 600_000;
    const roll = rng();
    return {
      id: bountyId + "-s" + i,
      bountyId,
      handle: HANDLES[Math.floor(rng() * HANDLES.length)] + Math.floor(rng() * 90),
      avatar: GRADS[Math.floor(rng() * GRADS.length)],
      note: notes[i % notes.length],
      ts,
      status: roll > 0.85 ? "won" : roll > 0.75 ? "rejected" : "pending",
    } as Submission;
  });
}
