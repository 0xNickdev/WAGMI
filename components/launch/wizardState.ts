"use client";

import type { RewardAsset, RewardFrequency } from "@/lib/types";

export interface WizardState {
  // Step 1 – Basic Info
  name: string;
  symbol: string;
  description: string;
  logoFile: File | null;
  logoPreviewUrl: string | null;
  gradientSeed: string;
  website: string;
  twitter: string;
  telegram: string;

  // Supply is fixed in GreenMoon V1 (1B, no minting) — kept for preview components
  customSupply: boolean;
  supply: number;

  // Step 2 – Tax
  buyTax: number;
  sellTax: number;

  // Step 3 – Stake to Earn rewards (tokenized stocks)
  rewardStock: string;
  rewardAllocationPct: number;
  stakingStartDays: number;
  rewardDurationDays: number;
  rewardDescription: string;

  // Step 4 – Launch (optional creator buy before public trading)
  buyBeforeLaunch: boolean;
  creatorBuyEth: number;

  // Step 4 – Reward Allocation
  burnEnabled: boolean;
  burnPct: number;
  devAddress: string;
  devPct: number;

  // Step 5 – Reward Config
  frequency: RewardFrequency;
  rewardAsset: RewardAsset;
  externalAddress: string;
}

export const GRADIENTS = [
  "#10b981,#6ee7b7",
  "#8b5cf6,#22d3ee",
  "#00c805,#22d3ee",
  "#ff5000,#6ee7b7",
  "#10b981,#8b5cf6",
  "#22d3ee,#00c805",
];

export const DEFAULT_STATE: WizardState = {
  name: "",
  symbol: "",
  description: "",
  logoFile: null,
  logoPreviewUrl: null,
  gradientSeed: GRADIENTS[0],
  website: "",
  twitter: "",
  telegram: "",

  customSupply: false,
  supply: 1_000_000_000,

  buyTax: 3,
  sellTax: 5,

  rewardStock: "SPCX",
  rewardAllocationPct: 5,
  stakingStartDays: 0,
  rewardDurationDays: 90,
  rewardDescription: "",

  buyBeforeLaunch: false,
  creatorBuyEth: 0.5,

  burnEnabled: false,
  burnPct: 0,
  devAddress: "",
  devPct: 10,

  frequency: "1h",
  rewardAsset: "ETH",
  externalAddress: "",
};

// Tokenized stocks available as staking rewards on Robinhood Chain
export const TOKENIZED_STOCKS = [
  { symbol: "SPCX", name: "SpaceX" },
  { symbol: "AAPL", name: "Apple" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "NVDA", name: "Nvidia" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "SPY", name: "S&P 500" },
] as const;

export type WizardAction =
  | { type: "SET_FIELD"; field: keyof WizardState; value: WizardState[keyof WizardState] }
  | { type: "SET_LOGO"; file: File; url: string }
  | { type: "CLEAR_LOGO" };

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOGO":
      return { ...state, logoFile: action.file, logoPreviewUrl: action.url };
    case "CLEAR_LOGO":
      return { ...state, logoFile: null, logoPreviewUrl: null };
    default:
      return state;
  }
}

// Per-step validation (GreenMoon: 1 Basic Info · 2 Taxes · 3 Rewards · 4 Launch)
export function validateStep(step: number, s: WizardState): string[] {
  const errs: string[] = [];
  if (step === 1) {
    if (!s.name.trim()) errs.push("Token name is required.");
    if (!s.symbol.trim()) errs.push("Token symbol is required.");
  }
  if (step === 2) {
    if (s.buyTax > 10) errs.push("Buy tax cannot exceed 10%.");
    if (s.sellTax > 10) errs.push("Sell tax cannot exceed 10%.");
  }
  if (step === 3) {
    if (!s.rewardStock) errs.push("Select a tokenized stock reward asset.");
    if (s.rewardAllocationPct < 1 || s.rewardAllocationPct > 30)
      errs.push("Reward allocation must be between 1% and 30%.");
  }
  if (step === 4) {
    if (s.buyBeforeLaunch && s.creatorBuyEth <= 0)
      errs.push("Enter the ETH amount for your pre-launch buy.");
  }
  return errs;
}

export function isStepValid(step: number, s: WizardState): boolean {
  return validateStep(step, s).length === 0;
}
