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
  discord: string;

  // Step 2 – Supply
  customSupply: boolean;
  supply: number;

  // Step 3 – Tax
  buyTax: number;
  sellTax: number;

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
  "#f0b90b,#ff9d2e",
  "#8b5cf6,#22d3ee",
  "#2ee6a6,#22d3ee",
  "#ff5470,#ff9d2e",
  "#f0b90b,#8b5cf6",
  "#22d3ee,#2ee6a6",
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
  discord: "",

  customSupply: false,
  supply: 100_000_000,

  buyTax: 3,
  sellTax: 5,

  burnEnabled: false,
  burnPct: 0,
  devAddress: "",
  devPct: 10,

  frequency: "1h",
  rewardAsset: "BNB",
  externalAddress: "",
};

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

// Per-step validation
export function validateStep(step: number, s: WizardState): string[] {
  const errs: string[] = [];
  if (step === 1) {
    if (!s.name.trim()) errs.push("Token name is required.");
    if (!s.symbol.trim()) errs.push("Token symbol is required.");
  }
  if (step === 2) {
    if (s.supply < 1_000_000) errs.push("Supply must be at least 1,000,000.");
    if (s.supply > 1_000_000_000) errs.push("Supply cannot exceed 1,000,000,000.");
  }
  if (step === 3) {
    if (s.buyTax > 10) errs.push("Buy tax cannot exceed 10%.");
    if (s.sellTax > 10) errs.push("Sell tax cannot exceed 10%.");
  }
  if (step === 4) {
    const totalAlloc = (s.burnEnabled ? s.burnPct : 0) + s.devPct;
    if (totalAlloc > 100) errs.push("Burn + Dev allocation cannot exceed 100%.");
    if (s.devPct > 0 && !s.devAddress.trim()) errs.push("Dev wallet address is required when dev allocation > 0%.");
  }
  if (step === 5) {
    if (s.rewardAsset === "EXTERNAL" && !s.externalAddress.trim())
      errs.push("External token contract address is required.");
  }
  return errs;
}

export function isStepValid(step: number, s: WizardState): boolean {
  return validateStep(step, s).length === 0;
}
