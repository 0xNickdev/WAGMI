"use client";

import { TokenLogo } from "@/components/ui/TokenLogo";
import { Badge } from "@/components/ui/Badge";
import { formatNum } from "@/lib/utils";
import type { WizardState } from "./wizardState";
import type { RewardFrequency, RewardAsset } from "@/lib/types";

interface Props {
  state: WizardState;
  currentStep: number;
}

const FREQ_LABEL: Record<RewardFrequency, string> = {
  "20m": "Every 20 min",
  "1h": "Every hour",
  "6h": "Every 6 hours",
  "24h": "Daily",
};

const ASSET_LABEL: Record<RewardAsset, string> = {
  ETH: "ETH",
  SAME_TOKEN: "Same token",
  EXTERNAL: "External ERC-20",
};

export function LivePreview({ state, currentStep }: Props) {
  const effectiveBurn = state.burnEnabled ? state.burnPct : 0;
  const holderPct = Math.max(0, 100 - effectiveBurn - state.devPct);
  const totalTax = state.buyTax + state.sellTax;

  const displaySymbol = state.symbol || "???";
  const displayName = state.name || "Your Token";

  return (
    <div className="flex flex-col gap-4">
      {/* Token identity card */}
      <div className="glass-strong rounded-2xl p-5 flex flex-col gap-4 border-gradient-gold">
        <div className="flex items-center gap-3">
          {state.logoPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={state.logoPreviewUrl}
              alt="Token logo"
              className="size-12 rounded-full object-cover ring-2 ring-border-strong shrink-0"
            />
          ) : (
            <TokenLogo symbol={displaySymbol} gradient={state.gradientSeed} size={48} />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-text truncate">{displayName}</span>
              {displaySymbol !== "???" && (
                <Badge tone="gold">${displaySymbol}</Badge>
              )}
            </div>
            {state.description && (
              <p className="text-xs text-faint mt-1 line-clamp-2">{state.description}</p>
            )}
          </div>
        </div>

        {/* Supply */}
        {currentStep >= 2 && (
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-xs text-faint">Total Supply</span>
            <span className="text-sm font-semibold tabular text-text">
              {formatNum(state.supply)}
            </span>
          </div>
        )}

        {/* Tax */}
        {currentStep >= 3 && (
          <div className="grid grid-cols-2 gap-2 py-2 border-t border-border">
            <div className="rounded-lg bg-up/8 border border-up/20 px-3 py-2 text-center">
              <div className="text-xs text-faint">Buy Tax</div>
              <div className="text-sm font-bold tabular text-up mt-0.5">
                {state.buyTax.toFixed(1)}%
              </div>
            </div>
            <div className="rounded-lg bg-down/8 border border-down/20 px-3 py-2 text-center">
              <div className="text-xs text-faint">Sell Tax</div>
              <div className="text-sm font-bold tabular text-down mt-0.5">
                {state.sellTax.toFixed(1)}%
              </div>
            </div>
            {totalTax > 12 && (
              <div className="col-span-2 text-xs text-amber text-center">
                Combined tax {totalTax.toFixed(1)}% — consider lowering
              </div>
            )}
          </div>
        )}

        {/* Reward split bar */}
        {currentStep >= 4 && (
          <div className="flex flex-col gap-2 py-2 border-t border-border">
            <p className="text-xs text-faint">Reward Split</p>
            <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
              {effectiveBurn > 0 && (
                <div className="bg-amber transition-all duration-500" style={{ width: `${effectiveBurn}%` }} />
              )}
              {state.devPct > 0 && (
                <div className="bg-violet transition-all duration-500" style={{ width: `${state.devPct}%` }} />
              )}
              <div className="bg-gold transition-all duration-500" style={{ width: `${holderPct}%` }} />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {effectiveBurn > 0 && (
                <span className="text-xs text-amber tabular">🔥 {effectiveBurn}% burn</span>
              )}
              {state.devPct > 0 && (
                <span className="text-xs text-violet tabular">{state.devPct}% dev</span>
              )}
              <span className="text-xs text-gold tabular">{holderPct}% holders</span>
            </div>
          </div>
        )}

        {/* Reward config */}
        {currentStep >= 5 && (
          <div className="flex flex-col gap-1.5 py-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-faint">Frequency</span>
              <span className="text-xs font-medium text-cyan">{FREQ_LABEL[state.frequency]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-faint">Reward Asset</span>
              <span className="text-xs font-medium text-gold">{ASSET_LABEL[state.rewardAsset]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Social links preview */}
      {currentStep >= 1 && (state.website || state.twitter || state.telegram) && (
        <div className="glass rounded-xl p-4 flex flex-wrap gap-2">
          {state.website && (
            <a
              href={state.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-faint hover:text-gold transition-colors"
            >
              Website
            </a>
          )}
          {state.twitter && (
            <span className="text-xs text-faint">·</span>
          )}
          {state.twitter && (
            <span className="text-xs text-muted">{state.twitter}</span>
          )}
          {state.telegram && (
            <span className="text-xs text-faint">·</span>
          )}
          {state.telegram && (
            <span className="text-xs text-muted">{state.telegram}</span>
          )}
        </div>
      )}

      {/* Deploy estimate */}
      <div className="glass rounded-xl p-4 flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">Deploy Estimate</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-faint">Contract deploy</span>
          <span className="text-xs tabular text-text">~0.02 ETH</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-faint">Auto-LP seed</span>
          <span className="text-xs tabular text-text">~0.1 ETH</span>
        </div>
        <div className="h-px bg-border my-1" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text">Total</span>
          <span className="text-xs font-bold tabular text-gold">~0.12 ETH</span>
        </div>
      </div>
    </div>
  );
}
