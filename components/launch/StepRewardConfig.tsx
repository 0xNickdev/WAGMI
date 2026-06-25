"use client";

import { Clock, Coins, Repeat, ExternalLink } from "lucide-react";
import { Segmented, Field, TextField } from "./FormPrimitives";
import type { WizardState, WizardAction } from "./wizardState";
import type { RewardFrequency, RewardAsset } from "@/lib/types";

interface Props {
  state: WizardState;
  dispatch: (a: WizardAction) => void;
  errors: string[];
}

function set(d: Props["dispatch"], field: keyof WizardState, value: WizardState[keyof WizardState]) {
  d({ type: "SET_FIELD", field, value });
}

const FREQ_OPTIONS: { value: RewardFrequency; label: string }[] = [
  { value: "20m", label: "20 min" },
  { value: "1h", label: "1 hour" },
  { value: "6h", label: "6 hours" },
  { value: "24h", label: "24 hours" },
];

const FREQ_DESCRIPTION: Record<RewardFrequency, string> = {
  "20m": "Very frequent payouts — higher gas overhead per epoch.",
  "1h": "Balanced frequency. Recommended for most tokens.",
  "6h": "Lower gas cost, smoother reward accumulation.",
  "24h": "Daily payouts — minimal gas, great for long-term holders.",
};

const ASSET_OPTIONS: { value: RewardAsset; label: string; icon: typeof Coins; description: string }[] = [
  {
    value: "BNB",
    label: "BNB (native)",
    icon: Coins,
    description: "Holders receive BNB directly. No swap needed — lowest friction.",
  },
  {
    value: "SAME_TOKEN",
    label: "Same Token",
    icon: Repeat,
    description: "Rewards auto-compound back into the same token, increasing holder balances.",
  },
  {
    value: "EXTERNAL",
    label: "External BEP-20",
    icon: ExternalLink,
    description: "Distribute a different BEP-20 token (USDT, CAKE, etc.) as rewards.",
  },
];

export function StepRewardConfig({ state, dispatch, errors }: Props) {
  const extError = errors.find((e) => e.includes("External"));

  return (
    <div className="flex flex-col gap-6">
      {/* Frequency */}
      <div className="glass rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gold" />
          <p className="text-sm font-semibold text-text">Distribution Frequency</p>
        </div>
        <Segmented<RewardFrequency>
          options={FREQ_OPTIONS}
          value={state.frequency}
          onChange={(v) => set(dispatch, "frequency", v)}
        />
        <p className="text-xs text-faint">{FREQ_DESCRIPTION[state.frequency]}</p>
      </div>

      {/* Reward asset */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-text">Reward Asset</p>
        <div className="flex flex-col gap-2">
          {ASSET_OPTIONS.map(({ value, label, icon: Icon, description }) => {
            const active = state.rewardAsset === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => set(dispatch, "rewardAsset", value)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
                  active
                    ? "border-gold/50 bg-gold/8 glow-gold"
                    : "border-border-strong bg-surface-2/50 hover:border-gold/30 hover:bg-surface-2"
                }`}
              >
                <div
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
                    active ? "bg-gold/20" : "bg-surface-2"
                  }`}
                >
                  <Icon size={15} className={active ? "text-gold" : "text-muted"} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${active ? "text-gold" : "text-text"}`}>
                    {label}
                  </div>
                  <div className="text-xs text-faint mt-0.5">{description}</div>
                </div>
                <div
                  className={`mt-1 size-4 shrink-0 rounded-full border-2 transition-colors ${
                    active ? "border-gold bg-gold" : "border-border-strong bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* External address input */}
      {state.rewardAsset === "EXTERNAL" && (
        <Field
          label="External Token Contract Address"
          required
          error={extError}
          hint="Must be a valid BEP-20 contract on BNB Smart Chain."
        >
          <TextField
            placeholder="0x..."
            value={state.externalAddress}
            onChange={(e) => set(dispatch, "externalAddress", e.target.value)}
            error={!!extError}
            className="font-mono text-xs"
          />
        </Field>
      )}
    </div>
  );
}
