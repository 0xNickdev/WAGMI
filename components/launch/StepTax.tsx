"use client";

import { AlertTriangle } from "lucide-react";
import { Slider } from "./FormPrimitives";
import { formatNum } from "@/lib/utils";
import type { WizardState, WizardAction } from "./wizardState";

interface Props {
  state: WizardState;
  dispatch: (a: WizardAction) => void;
  errors: string[];
}

function set(dispatch: Props["dispatch"], field: keyof WizardState, value: WizardState[keyof WizardState]) {
  dispatch({ type: "SET_FIELD", field, value });
}

const SAMPLE_BNB = 1;
const BNB_PRICE_USD = 600;

export function StepTax({ state, dispatch }: Props) {
  const totalTax = state.buyTax + state.sellTax;
  const warnHigh = totalTax > 12;

  const buyTaxAmount = SAMPLE_BNB * (state.buyTax / 100);
  const sellTaxAmount = SAMPLE_BNB * (state.sellTax / 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Warning */}
      {warnHigh && (
        <div className="flex items-start gap-3 rounded-xl border border-amber/30 bg-amber/8 px-4 py-3">
          <AlertTriangle size={16} className="text-amber mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber">High combined tax ({totalTax}%)</p>
            <p className="text-xs text-amber/80 mt-0.5">
              Traders are likely to avoid tokens with combined tax above 12%. Consider keeping
              buy + sell tax under 10% for better traction.
            </p>
          </div>
        </div>
      )}

      {/* Buy Tax */}
      <div className="glass rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text">Buy Tax</p>
            <p className="text-xs text-faint mt-0.5">Charged on every purchase</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold tabular text-up">{state.buyTax.toFixed(1)}</span>
            <span className="text-muted text-sm">%</span>
          </div>
        </div>
        <Slider
          value={state.buyTax}
          onChange={(v) => set(dispatch, "buyTax", v)}
          min={0}
          max={10}
          step={0.5}
          accentColor="#2ee6a6"
        />
        <div className="flex justify-between text-xs text-faint">
          <span>0% (none)</span>
          <span>10% (max)</span>
        </div>

        {/* Sample calc */}
        <div className="rounded-lg bg-surface-2 border border-border px-3 py-2.5 flex items-center justify-between">
          <span className="text-xs text-faint">
            On a {SAMPLE_BNB} BNB buy
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-down tabular">
              -{buyTaxAmount.toFixed(4)} BNB
            </span>
            <span className="text-xs text-faint tabular">
              ≈ ${formatNum(buyTaxAmount * BNB_PRICE_USD)}
            </span>
          </div>
        </div>
      </div>

      {/* Sell Tax */}
      <div className="glass rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text">Sell Tax</p>
            <p className="text-xs text-faint mt-0.5">Charged on every sale</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold tabular text-down">{state.sellTax.toFixed(1)}</span>
            <span className="text-muted text-sm">%</span>
          </div>
        </div>
        <Slider
          value={state.sellTax}
          onChange={(v) => set(dispatch, "sellTax", v)}
          min={0}
          max={10}
          step={0.5}
          accentColor="#ff5470"
        />
        <div className="flex justify-between text-xs text-faint">
          <span>0% (none)</span>
          <span>10% (max)</span>
        </div>

        <div className="rounded-lg bg-surface-2 border border-border px-3 py-2.5 flex items-center justify-between">
          <span className="text-xs text-faint">
            On a {SAMPLE_BNB} BNB sell
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-down tabular">
              -{sellTaxAmount.toFixed(4)} BNB
            </span>
            <span className="text-xs text-faint tabular">
              ≈ ${formatNum(sellTaxAmount * BNB_PRICE_USD)}
            </span>
          </div>
        </div>
      </div>

      {/* Combined summary */}
      <div className="glass-strong rounded-xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-faint uppercase tracking-wider">Combined Tax</p>
          <p className={`text-xl font-bold tabular mt-0.5 ${warnHigh ? "text-amber" : "text-text"}`}>
            {totalTax.toFixed(1)}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-faint uppercase tracking-wider">Tax goes to</p>
          <p className="text-sm font-medium text-gold mt-0.5">Reward pool + LP</p>
        </div>
      </div>
    </div>
  );
}
