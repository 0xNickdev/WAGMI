"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@/lib/wallet";
import { ConnectButton } from "@/components/ConnectButton";
import { Button } from "@/components/ui/Button";
import { cn, formatPrice, formatNum, formatPct } from "@/lib/utils";
import type { Token } from "@/lib/types";
import { ChevronDown, Check, Loader2, AlertTriangle } from "lucide-react";

interface Props {
  token: Token;
}

type Side = "buy" | "sell";

export function TradePanel({ token }: Props) {
  const { address, bnbBalance, connecting } = useWallet();
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const tax = side === "buy" ? token.buyTax : token.sellTax;
  const bnbPrice = 620; // mock BNB/USD

  // Derived estimates
  const amountNum = parseFloat(amount) || 0;
  const usdValue = side === "buy" ? amountNum * bnbPrice : (amountNum * token.price);
  const taxAmount = usdValue * (tax / 100);
  const netUsd = usdValue - taxAmount;
  const tokensOut = side === "buy" ? netUsd / token.price : 0;
  const bnbOut = side === "sell" ? netUsd / bnbPrice : 0;
  const priceImpact = Math.min(usdValue / (token.liquidity || 1) * 100, 99);
  const minReceived = side === "buy"
    ? tokensOut * 0.995
    : bnbOut * 0.995;

  const maxAmount = side === "buy" ? bnbBalance : undefined;

  const handleMax = useCallback(() => {
    if (side === "buy") setAmount(bnbBalance.toFixed(4));
  }, [side, bnbBalance]);

  const handleTrade = useCallback(async () => {
    if (!amountNum || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setConfirmed(true);
    setAmount("");
    setTimeout(() => setConfirmed(false), 3000);
  }, [amountNum, loading]);

  const inputLabel = side === "buy" ? "BNB" : token.symbol;
  const outputLabel = side === "buy" ? token.symbol : "BNB";

  const isInsufficient =
    side === "buy" && amountNum > bnbBalance && amountNum > 0;
  const canTrade = address && amountNum > 0 && !isInsufficient;

  return (
    <div className="flex flex-col gap-0">
      {/* Buy / Sell tab */}
      <div className="flex rounded-xl overflow-hidden border border-border-strong m-4 mb-0">
        {(["buy", "sell"] as Side[]).map((s) => (
          <button
            key={s}
            onClick={() => { setSide(s); setAmount(""); setConfirmed(false); }}
            className={cn(
              "flex-1 py-2.5 text-sm font-semibold transition-all capitalize",
              side === s
                ? s === "buy"
                  ? "bg-up/20 text-up"
                  : "bg-down/20 text-down"
                : "text-faint hover:text-text",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Amount input */}
        <div className="glass rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-faint">
            <span>You {side === "buy" ? "spend" : "sell"}</span>
            {side === "buy" && (
              <span className="tabular">
                Balance: <span className="text-muted">{bnbBalance.toFixed(3)} BNB</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setConfirmed(false); }}
              className="flex-1 bg-transparent text-xl font-semibold tabular text-text placeholder:text-faint outline-none min-w-0"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              {maxAmount !== undefined && (
                <button
                  onClick={handleMax}
                  className="text-[10px] font-bold text-gold bg-gold/10 hover:bg-gold/20 px-2 py-0.5 rounded-md transition-colors"
                >
                  MAX
                </button>
              )}
              <div className="flex items-center gap-1 bg-surface-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold">
                <span className="text-text">{inputLabel}</span>
                <ChevronDown size={12} className="text-faint" />
              </div>
            </div>
          </div>
          {amountNum > 0 && (
            <div className="text-xs text-faint tabular">≈ ${usdValue.toFixed(2)}</div>
          )}
        </div>

        {/* Estimated output */}
        {amountNum > 0 && (
          <div className="glass rounded-xl p-3 flex flex-col gap-1.5">
            <div className="text-xs text-faint">You receive (estimated)</div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold tabular text-text">
                {side === "buy"
                  ? formatNum(tokensOut, { compact: tokensOut > 1e6 })
                  : bnbOut.toFixed(5)}
              </span>
              <span className="text-sm font-semibold text-muted">{outputLabel}</span>
            </div>
          </div>
        )}

        {/* Trade details */}
        {amountNum > 0 && (
          <div className="glass rounded-xl p-3 flex flex-col gap-2 text-xs">
            <Row label={`Tax (${tax}%)`} value={`$${taxAmount.toFixed(3)}`} className="text-muted" />
            <Row
              label="Price impact"
              value={formatPct(priceImpact)}
              className={priceImpact > 5 ? "text-down" : priceImpact > 2 ? "text-amber" : "text-up"}
            />
            <Row
              label="Min received"
              value={
                side === "buy"
                  ? `${formatNum(minReceived, { compact: minReceived > 1e6 })} ${token.symbol}`
                  : `${minReceived.toFixed(5)} BNB`
              }
              className="text-muted"
            />
            <div className="pt-1 border-t border-border">
              <Row label="Rate" value={`1 BNB = ${formatNum(1 / token.price / bnbPrice * 1e0)} ${token.symbol}`} className="text-muted" />
            </div>
          </div>
        )}

        {/* Insufficient balance warning */}
        {isInsufficient && (
          <div className="flex items-center gap-2 bg-down/10 border border-down/25 rounded-xl px-3 py-2.5 text-xs text-down">
            <AlertTriangle size={13} />
            Insufficient BNB balance
          </div>
        )}

        {/* Action button */}
        {!address ? (
          <ConnectButton size="lg" />
        ) : confirmed ? (
          <div className="flex items-center justify-center gap-2 h-13 rounded-xl bg-up/15 border border-up/30 text-up font-semibold text-sm">
            <Check size={16} />
            {side === "buy" ? "Bought" : "Sold"} successfully
          </div>
        ) : (
          <Button
            variant={side === "buy" ? "success" : "danger"}
            size="lg"
            className="w-full"
            disabled={!canTrade || loading || connecting}
            onClick={handleTrade}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Confirming…</>
            ) : (
              `${side === "buy" ? "Buy" : "Sell"} ${token.symbol}`
            )}
          </Button>
        )}

        <p className="text-[10px] text-faint text-center leading-relaxed">
          Simulated trade · BNB Chain · WAGMII Router v2
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-faint">{label}</span>
      <span className={cn("tabular font-medium", className)}>{value}</span>
    </div>
  );
}
