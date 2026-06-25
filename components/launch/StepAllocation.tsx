"use client";

import { Toggle, Slider, Field, TextField } from "./FormPrimitives";
import { clamp } from "@/lib/utils";
import type { WizardState, WizardAction } from "./wizardState";

interface Props {
  state: WizardState;
  dispatch: (a: WizardAction) => void;
  errors: string[];
}

function set(d: Props["dispatch"], field: keyof WizardState, value: WizardState[keyof WizardState]) {
  d({ type: "SET_FIELD", field, value });
}

export function StepAllocation({ state, dispatch, errors }: Props) {
  const effectiveBurn = state.burnEnabled ? state.burnPct : 0;
  const holderPct = Math.max(0, 100 - effectiveBurn - state.devPct);
  const overAllocated = effectiveBurn + state.devPct > 100;

  const devAddressError = errors.find((e) => e.includes("Dev wallet"));
  const overAllocError = errors.find((e) => e.includes("exceed 100"));

  return (
    <div className="flex flex-col gap-6">
      {overAllocError && (
        <div className="rounded-xl border border-down/30 bg-down/8 px-4 py-3 text-sm text-down">
          {overAllocError}
        </div>
      )}

      {/* Burn allocation */}
      <div className="glass rounded-xl p-5 flex flex-col gap-4">
        <Toggle
          checked={state.burnEnabled}
          onChange={(v) => {
            set(dispatch, "burnEnabled", v);
            if (!v) set(dispatch, "burnPct", 0);
          }}
          label="Burn Allocation"
          description="A portion of every reward epoch is permanently burned, reducing supply over time."
        />
        {state.burnEnabled && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Burn percentage</span>
              <span className="text-xl font-bold tabular text-amber">{effectiveBurn.toFixed(0)}%</span>
            </div>
            <Slider
              value={effectiveBurn}
              onChange={(v) =>
                set(dispatch, "burnPct", clamp(v, 0, Math.max(0, 100 - state.devPct)))
              }
              min={0}
              max={100}
              step={1}
              accentColor="#ff9d2e"
            />
            <div className="flex justify-between text-xs text-faint">
              <span>0%</span>
              <span>100%</span>
            </div>
          </>
        )}
      </div>

      {/* Dev allocation */}
      <div className="glass rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text">Dev Wallet Allocation</p>
            <p className="text-xs text-faint mt-0.5">Sent to your wallet each epoch</p>
          </div>
          <span className="text-xl font-bold tabular text-violet">{state.devPct.toFixed(0)}%</span>
        </div>
        <Slider
          value={state.devPct}
          onChange={(v) =>
            set(dispatch, "devPct", clamp(v, 0, Math.max(0, 100 - effectiveBurn)))
          }
          min={0}
          max={50}
          step={1}
          accentColor="#8b5cf6"
        />
        <div className="flex justify-between text-xs text-faint">
          <span>0%</span>
          <span>50%</span>
        </div>
        {state.devPct > 0 && (
          <Field label="Dev Wallet Address" error={devAddressError} required>
            <TextField
              placeholder="0x..."
              value={state.devAddress}
              onChange={(e) => set(dispatch, "devAddress", e.target.value)}
              error={!!devAddressError}
              className="font-mono text-xs"
            />
          </Field>
        )}
      </div>

      {/* Visual split bar */}
      <div className="glass-strong rounded-xl p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">Reward Split</p>

        {/* Bar */}
        <div className="flex h-4 rounded-full overflow-hidden gap-px">
          {effectiveBurn > 0 && (
            <div
              className="bg-amber transition-all duration-300"
              style={{ width: `${effectiveBurn}%` }}
              title={`Burn: ${effectiveBurn}%`}
            />
          )}
          {state.devPct > 0 && (
            <div
              className="bg-violet transition-all duration-300"
              style={{ width: `${state.devPct}%` }}
              title={`Dev: ${state.devPct}%`}
            />
          )}
          <div
            className={`transition-all duration-300 ${overAllocated ? "bg-down/40" : "bg-gold"}`}
            style={{ width: `${Math.max(0, holderPct)}%` }}
            title={`Holders: ${holderPct}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {effectiveBurn > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="size-2.5 rounded-sm bg-amber" />
              <span className="text-muted">Burn</span>
              <span className="font-semibold tabular text-amber">{effectiveBurn}%</span>
            </div>
          )}
          {state.devPct > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="size-2.5 rounded-sm bg-violet" />
              <span className="text-muted">Dev</span>
              <span className="font-semibold tabular text-violet">{state.devPct}%</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`size-2.5 rounded-sm ${overAllocated ? "bg-down/40" : "bg-gold"}`} />
            <span className="text-muted">Holders</span>
            <span className={`font-semibold tabular ${overAllocated ? "text-down" : "text-gold"}`}>
              {Math.max(0, holderPct)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
