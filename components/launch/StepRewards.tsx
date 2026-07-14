"use client";

import { Field, TextArea, Slider, Segmented } from "./FormPrimitives";
import { cn } from "@/lib/utils";
import type { WizardState, WizardAction } from "./wizardState";
import { TOKENIZED_STOCKS } from "./wizardState";
import { TrendingUp } from "lucide-react";

interface Props {
  state: WizardState;
  dispatch: (a: WizardAction) => void;
  errors: string[];
}

function set(dispatch: Props["dispatch"], field: keyof WizardState, value: WizardState[keyof WizardState]) {
  dispatch({ type: "SET_FIELD", field, value });
}

export function StepRewards({ state, dispatch }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-gold/30 bg-gold/8 px-4 py-3 text-sm text-muted">
        <span className="text-gold font-semibold">Stake to Earn:</span> holders stake your
        token to earn <span className="text-text">tokenized stock rewards</span> — real
        equities on Robinhood Chain. Pick the stock your community earns.
      </div>

      {/* Reward asset selector */}
      <Field label="Reward Asset" required hint="Tokenized stock distributed to stakers.">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {TOKENIZED_STOCKS.map((s) => (
            <button
              key={s.symbol}
              type="button"
              onClick={() => set(dispatch, "rewardStock", s.symbol)}
              className={cn(
                "rounded-xl border px-2 py-3 text-center transition-all",
                state.rewardStock === s.symbol
                  ? "border-gold bg-gold/10 text-text"
                  : "border-border bg-surface-2/50 text-muted hover:border-border-strong",
              )}
            >
              <div className="font-bold text-sm tabular">{s.symbol}</div>
              <div className="text-[10px] text-faint mt-0.5 truncate">{s.name}</div>
            </button>
          ))}
        </div>
      </Field>

      {/* Allocation */}
      <Field
        label="Reward Allocation"
        hint="Share of total supply reserved for staking rewards."
      >
        <div className="flex items-center gap-4">
          <Slider
            value={state.rewardAllocationPct}
            onChange={(v: number) => set(dispatch, "rewardAllocationPct", v)}
            min={1}
            max={30}
            step={1}
            className="flex-1"
          />
          <span className="w-14 text-right font-bold tabular text-gold">
            {state.rewardAllocationPct}%
          </span>
        </div>
      </Field>

      {/* Staking start */}
      <Field label="Staking Starts">
        <Segmented
          options={[
            { value: "0", label: "At launch" },
            { value: "7", label: "+7 days" },
            { value: "30", label: "+30 days" },
          ]}
          value={String(state.stakingStartDays)}
          onChange={(v: string) => set(dispatch, "stakingStartDays", Number(v))}
        />
      </Field>

      {/* Duration */}
      <Field label="Reward Duration" hint="Rewards stream linearly to stakers over this period.">
        <Segmented
          options={[
            { value: "30", label: "30 days" },
            { value: "90", label: "90 days" },
            { value: "180", label: "180 days" },
            { value: "365", label: "1 year" },
          ]}
          value={String(state.rewardDurationDays)}
          onChange={(v: string) => set(dispatch, "rewardDurationDays", Number(v))}
        />
      </Field>

      {/* Description */}
      <Field label="Reward Description" hint="Optional — shown on your token's Stake to Earn panel.">
        <TextArea
          placeholder={`e.g. Stake $${state.symbol || "TOKEN"} and earn ${state.rewardStock} every epoch.`}
          value={state.rewardDescription}
          onChange={(e) => set(dispatch, "rewardDescription", e.target.value)}
          rows={2}
          maxLength={160}
        />
      </Field>

      <p className="flex items-center gap-1.5 text-xs text-faint">
        <TrendingUp size={13} className="text-gold" />
        APY is determined by the allocation, duration, and total staked — shown live on the token page.
      </p>
    </div>
  );
}
