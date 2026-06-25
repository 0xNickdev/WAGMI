"use client";

import { Coins } from "lucide-react";
import { Field, TextField, Toggle } from "./FormPrimitives";
import { formatNum } from "@/lib/utils";
import { clamp } from "@/lib/utils";
import type { WizardState, WizardAction } from "./wizardState";

interface Props {
  state: WizardState;
  dispatch: (a: WizardAction) => void;
  errors: string[];
}

function set(dispatch: Props["dispatch"], field: keyof WizardState, value: WizardState[keyof WizardState]) {
  dispatch({ type: "SET_FIELD", field, value });
}

const PRESETS = [10_000_000, 100_000_000, 500_000_000, 1_000_000_000];

export function StepSupply({ state, dispatch, errors }: Props) {
  const supplyError = errors.find((e) => e.includes("Supply") || e.includes("supply"));

  function handleSupplyInput(raw: string) {
    const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
    if (isNaN(n)) {
      set(dispatch, "supply", 0);
    } else {
      set(dispatch, "supply", clamp(n, 0, 1_000_000_000));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Default notice */}
      <div className="glass rounded-xl p-4 flex items-start gap-3">
        <Coins size={18} className="text-gold mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-text">Default Supply</p>
          <p className="text-xs text-muted mt-0.5">
            The standard starting supply is{" "}
            <span className="text-gold font-semibold tabular">100,000,000</span> tokens.
            You can customize it below — more supply means a lower price per token at launch.
          </p>
        </div>
      </div>

      {/* Toggle */}
      <Toggle
        checked={state.customSupply}
        onChange={(v) => {
          set(dispatch, "customSupply", v);
          if (!v) set(dispatch, "supply", 100_000_000);
        }}
        label="Customize supply"
        description="Set a custom token supply between 1M and 1B."
      />

      {state.customSupply && (
        <div className="flex flex-col gap-4 pl-0">
          {/* Preset pills */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set(dispatch, "supply", p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                  state.supply === p
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-border-strong bg-surface-2 text-muted hover:border-gold/40 hover:text-text"
                }`}
              >
                {formatNum(p)}
              </button>
            ))}
          </div>

          <Field
            label="Total Supply"
            error={supplyError}
            hint="Min 1,000,000 · Max 1,000,000,000"
          >
            <TextField
              value={state.supply === 0 ? "" : state.supply.toLocaleString("en-US")}
              onChange={(e) => handleSupplyInput(e.target.value)}
              placeholder="100,000,000"
              error={!!supplyError}
              suffix="tokens"
              inputMode="numeric"
            />
          </Field>
        </div>
      )}

      {/* Live preview card */}
      <div className="glass-strong rounded-xl p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">Circulating Supply Preview</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold tabular text-gradient-gold">
            {formatNum(state.supply)}
          </span>
          <span className="text-muted pb-0.5">{state.symbol || "TOKENS"}</span>
        </div>
        <p className="text-xs text-faint">
          100% circulating at launch — no team vesting, no locked supply. Pure.
        </p>

        {/* Visual bar showing full distribution */}
        <div className="h-2 rounded-full bg-gold/20 overflow-hidden mt-1">
          <div className="h-full bg-gradient-to-r from-gold-bright to-gold rounded-full w-full" />
        </div>
        <div className="flex justify-between text-xs text-faint">
          <span>Public (100%)</span>
          <span className="tabular">{formatNum(state.supply)}</span>
        </div>
      </div>
    </div>
  );
}
