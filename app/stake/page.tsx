"use client";

import { useMemo, useState } from "react";
import { getTokens } from "@/lib/mock";
import { useWallet } from "@/lib/wallet";
import { ConnectButton } from "@/components/ConnectButton";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { formatNum, cn } from "@/lib/utils";
import { Landmark, TrendingUp, Lock, Gift, ChevronDown } from "lucide-react";

/* Stake & Earn — stake project tokens, earn tokenized stock rewards.
   Balances/actions are simulated until the staking contracts ship. */

function seededBalance(address: string) {
  let h = 0;
  for (const c of address) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h % 900_000) + 100_000; // 100k–1M tokens
}

export default function StakePage() {
  const { address } = useWallet();
  const tokens = useMemo(() => getTokens(), []);
  const [selected, setSelected] = useState(tokens[0]);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [staked, setStaked] = useState<Record<string, number>>({});
  const [pending, setPending] = useState<Record<string, number>>({});

  const walletBalance = address ? seededBalance(selected.address) : 0;
  const stakedBalance = staked[selected.address] ?? 0;
  const pendingReward = pending[selected.address] ?? 0;
  const apy = 12 + (seededBalance(selected.address) % 8000) / 100; // APY placeholder
  const stock = selected.rewardStock;

  function stake() {
    const n = Math.min(Number(amount) || 0, walletBalance - stakedBalance);
    if (n <= 0) return;
    setStaked((s) => ({ ...s, [selected.address]: (s[selected.address] ?? 0) + n }));
    setPending((p) => ({ ...p, [selected.address]: (p[selected.address] ?? 0) + n * 0.0001 }));
    setAmount("");
  }
  function unstake() {
    setStaked((s) => ({ ...s, [selected.address]: 0 }));
    setAmount("");
  }
  function claim() {
    setPending((p) => ({ ...p, [selected.address]: 0 }));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
      <Reveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs font-medium text-muted mb-4">
            <Landmark size={13} className="text-gold" />
            Stake to Earn
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Stake tokens, earn <span className="text-gradient-gold">tokenized stocks</span>
          </h1>
          <p className="text-muted mt-2 max-w-xl">
            Stake project tokens to earn real tokenized equities on Robinhood Chain —
            {" "}{stock}, AAPL, TSLA and more. Rewards stream every block; claim anytime.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
          {/* Staking card */}
          <div className="glass-strong rounded-2xl p-6">
            {/* Token selector */}
            <label className="text-xs uppercase tracking-wider text-faint">Project token</label>
            <div className="relative mt-2">
              <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface-2/50 px-4 py-3 hover:border-border-strong transition-colors"
              >
                <TokenLogo symbol={selected.symbol} gradient={selected.logoColor} src={selected.logoUrl} size={32} />
                <span className="font-semibold">{selected.name}</span>
                <span className="font-mono text-xs text-faint">${selected.symbol}</span>
                <ChevronDown size={16} className="ml-auto text-faint" />
              </button>
              {open && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                  <div className="absolute z-50 mt-2 w-full max-h-72 overflow-y-auto glass-strong rounded-xl p-2 shadow-2xl">
                    {tokens.map((t) => (
                      <button
                        key={t.address}
                        onClick={() => { setSelected(t); setOpen(false); setAmount(""); }}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-surface-2 transition-colors",
                          t.address === selected.address && "bg-surface-2",
                        )}
                      >
                        <TokenLogo symbol={t.symbol} gradient={t.logoColor} src={t.logoUrl} size={26} />
                        <span className="text-sm font-medium">{t.name}</span>
                        <span className="ml-auto text-xs text-gold tabular">earn {t.rewardStock}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Amount */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-faint mb-1.5">
                <span>Amount to stake</span>
                <span className="tabular">
                  Wallet: {formatNum(Math.max(0, walletBalance - stakedBalance))} ${selected.symbol}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2/50 px-4 py-3 focus-within:border-gold transition-colors">
                <input
                  type="number"
                  min={0}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent outline-none tabular text-lg"
                />
                <button
                  className="text-xs font-bold text-gold hover:brightness-110"
                  onClick={() => setAmount(String(Math.max(0, walletBalance - stakedBalance)))}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {address ? (
                <>
                  <Button onClick={stake} size="md" className="w-full">
                    <Lock size={15} /> Stake
                  </Button>
                  <Button onClick={unstake} variant="outline" size="md" className="w-full" disabled={stakedBalance <= 0}>
                    Unstake
                  </Button>
                  <Button onClick={claim} variant="secondary" size="md" className="w-full" disabled={pendingReward <= 0}>
                    <Gift size={15} /> Claim {stock}
                  </Button>
                </>
              ) : (
                <div className="sm:col-span-3"><ConnectButton size="lg" /></div>
              )}
            </div>
            <p className="mt-4 text-xs text-faint">
              Simulated staking · contracts ship with Sketch V1 · unstake anytime, no lock-up
            </p>
          </div>

          {/* Position panel */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-faint">Your position</span>
              <span className="inline-flex items-center gap-1 text-xs text-gold">
                <TrendingUp size={13} /> APY ≈ {apy.toFixed(1)}%
              </span>
            </div>
            <div className="mt-4 space-y-4">
              <Row label="Staked" value={`${formatNum(stakedBalance)} $${selected.symbol}`} />
              <Row label="Pending rewards" value={`${pendingReward.toFixed(4)} ${stock}`} highlight={pendingReward > 0} />
              <Row label="Reward asset" value={`${stock} — tokenized stock`} />
              <Row label="Reward stream" value="Every block, linear" />
            </div>
            <div className="mt-6 pt-5 border-t border-border text-xs text-muted leading-relaxed">
              {selected.name} allocated {5 + (selected.holders % 20)}% of supply to Stake to Earn.
              Rewards are paid in {stock} — a real tokenized equity on Robinhood Chain.
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted">{label}</span>
      <span className={cn("text-sm font-semibold tabular", highlight && "text-gold")}>{value}</span>
    </div>
  );
}
