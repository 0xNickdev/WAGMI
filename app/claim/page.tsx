"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/lib/wallet";
import { getClaimable, getTreasury } from "@/lib/mock";
import { formatUsd, formatNum, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { EpochCountdown } from "@/components/EpochCountdown";
import { ConnectButton } from "@/components/ConnectButton";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Wallet,
  Gift,
  CheckCircle2,
  Loader2,
  Lock,
  Coins,
  BarChart3,
  Users,
} from "lucide-react";
import type { ClaimablePosition } from "@/lib/types";

// ── How-it-works teaser steps shown when wallet is not connected ──
const HOW_STEPS = [
  {
    icon: <Coins size={20} className="text-gold" />,
    title: "Hold eligible tokens",
    body: "Each token sets a minimum balance threshold. Hold above it for the full epoch window.",
  },
  {
    icon: <BarChart3 size={20} className="text-violet" />,
    title: "Epoch closes & snapshot",
    body: "Every ~24h the protocol snapshots eligible holders and calculates their pro-rata share of tax revenue.",
  },
  {
    icon: <Gift size={20} className="text-up" />,
    title: "Claim your ETH rewards",
    body: "Connect your wallet, hit Claim All, and ETH lands in your account — no staking, no lock-ups.",
  },
  {
    icon: <Users size={20} className="text-cyan" />,
    title: "Compound or cash out",
    body: "Use rewards to buy more tokens, boost your share, and earn more next epoch. The flywheel is real.",
  },
];

// ── Disconnected hero ──
function DisconnectedView() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative glass-strong rounded-3xl p-10 sm:p-16 text-center overflow-hidden border-gradient-gold grid-bg"
      >
        {/* ambient glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-80 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-5 glass rounded-full px-4 py-1.5">
            <Gift size={15} />
            Epoch #{getTreasury().currentEpoch} is live
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Claim your share of
            <br />
            <span className="text-gradient-gold">protocol revenue</span>
          </h1>

          <p className="mt-5 text-muted text-lg max-w-xl mx-auto leading-relaxed">
            Every trade on Sketch funds the treasury. Eligible token holders receive ETH distributions
            every epoch — automatically, transparently, on-chain.
          </p>

          <div className="mt-8">
            <ConnectButton size="lg" />
          </div>

          <p className="mt-4 text-xs text-faint">No lock-ups. Connect and claim in seconds.</p>
        </div>
      </motion.div>

      {/* How it works */}
      <div className="mt-16">
        <SectionHeader
          title="How distributions work"
          subtitle="Transparent revenue-sharing baked into every trade"
          icon={<BarChart3 className="text-gold" size={22} />}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="h-full">
                <CardBody className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="glass rounded-lg p-2">{step.icon}</div>
                    <span className="text-xs font-mono text-faint">0{i + 1}</span>
                  </div>
                  <div className="font-semibold text-text">{step.title}</div>
                  <p className="text-sm text-muted leading-relaxed">{step.body}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Single claimable position row ──
function PositionRow({
  pos,
  onClaim,
  claimed,
  claiming,
}: {
  pos: ClaimablePosition;
  onClaim: (epochId: number, symbol: string) => void;
  claimed: boolean;
  claiming: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors",
        pos.eligible ? "hover:bg-surface-2/50" : "opacity-50",
        claimed && "opacity-40",
      )}
    >
      <TokenLogo symbol={pos.token.symbol} gradient={pos.token.logoColor} src={pos.token.logoUrl} size={40} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold truncate">{pos.token.name}</span>
          <span className="text-xs font-mono text-faint">${pos.token.symbol}</span>
        </div>
        <div className="text-xs text-faint mt-0.5">Epoch #{pos.epochId}</div>
      </div>

      <div className="text-right hidden sm:block">
        {pos.eligible ? (
          <>
            <div className="tabular font-semibold text-gold">{formatUsd(pos.amountUsd)}</div>
            <div className="text-xs text-faint tabular">{pos.amountBnb.toFixed(4)} ETH</div>
          </>
        ) : (
          <div className="text-xs text-muted max-w-[140px] text-right leading-tight">{pos.reason}</div>
        )}
      </div>

      <div className="shrink-0">
        {claimed ? (
          <span className="inline-flex items-center gap-1 text-xs text-up font-medium">
            <CheckCircle2 size={14} /> Claimed
          </span>
        ) : pos.eligible ? (
          <Button
            size="sm"
            variant="primary"
            disabled={claiming}
            onClick={() => onClaim(pos.epochId, pos.token.symbol)}
          >
            {claiming ? <Loader2 size={13} className="animate-spin" /> : <Gift size={13} />}
            Claim
          </Button>
        ) : (
          <Badge tone="neutral">
            <Lock size={10} /> Ineligible
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

// ── Connected view ──
function ConnectedView() {
  const treasury = getTreasury();
  const initialPositions = getClaimable(true);

  const [positions, setPositions] = useState<ClaimablePosition[]>(initialPositions);
  const [claimedKeys, setClaimedKeys] = useState<Set<string>>(new Set());
  const [claimingKey, setClaimingKey] = useState<string | null>(null);
  const [claimAllLoading, setClaimAllLoading] = useState(false);
  const [allClaimed, setAllClaimed] = useState(false);

  const totalClaimable = positions
    .filter((p) => p.eligible && !claimedKeys.has(`${p.epochId}-${p.token.symbol}`))
    .reduce((s, p) => s + p.amountUsd, 0);

  const totalBnb = positions
    .filter((p) => p.eligible && !claimedKeys.has(`${p.epochId}-${p.token.symbol}`))
    .reduce((s, p) => s + p.amountBnb, 0);

  const eligibleCount = positions.filter(
    (p) => p.eligible && !claimedKeys.has(`${p.epochId}-${p.token.symbol}`),
  ).length;

  async function handleClaim(epochId: number, symbol: string) {
    const key = `${epochId}-${symbol}`;
    setClaimingKey(key);
    await new Promise((r) => setTimeout(r, 900));
    setClaimedKeys((prev) => new Set([...prev, key]));
    setClaimingKey(null);
  }

  async function handleClaimAll() {
    setClaimAllLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const allKeys = positions
      .filter((p) => p.eligible)
      .map((p) => `${p.epochId}-${p.token.symbol}`);
    setClaimedKeys(new Set(allKeys));
    setClaimAllLoading(false);
    setAllClaimed(true);
  }

  const isEmpty = eligibleCount === 0 && !claimAllLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* page title */}
      <SectionHeader
        title="Claim Rewards"
        subtitle="Your pending protocol revenue distributions"
        icon={<Gift className="text-gold" size={22} />}
      />

      {/* summary + epoch */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* total claimable */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card glow={!isEmpty && totalClaimable > 0} className="h-full">
            <CardBody className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-faint mb-1">Total Claimable</div>
                {allClaimed || isEmpty ? (
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 size={28} className="text-up" />
                    <div>
                      <div className="text-2xl font-bold text-up">All claimed!</div>
                      <div className="text-sm text-muted mt-0.5">Nothing pending right now.</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl font-bold tabular text-gradient-gold">
                      <AnimatedNumber value={totalClaimable} format={(n) => formatUsd(n)} />
                    </div>
                    <div className="text-sm text-muted tabular mt-1">
                      ≈ {totalBnb.toFixed(4)} ETH
                    </div>
                  </>
                )}
              </div>
              {!allClaimed && !isEmpty && (
                <Button
                  size="lg"
                  variant="primary"
                  disabled={claimAllLoading || eligibleCount === 0}
                  onClick={handleClaimAll}
                  className="shrink-0"
                >
                  {claimAllLoading ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Gift size={17} />
                  )}
                  {claimAllLoading ? "Claiming…" : "Claim All"}
                </Button>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* epoch countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
        >
          <Card className="h-full">
            <CardBody className="flex flex-col items-center justify-center gap-3 text-center">
              <CardTitle>Next Epoch</CardTitle>
              <div className="text-xs text-faint">
                #{treasury.currentEpoch} → #{treasury.currentEpoch + 1}
              </div>
              <EpochCountdown target={treasury.nextEpochAt} size="md" />
              <div className="text-xs text-muted">
                {formatNum(
                  positions.filter((p) => p.eligible).length,
                )}{" "}
                eligible positions this epoch
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* positions list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Positions</CardTitle>
            <Badge tone={eligibleCount > 0 ? "gold" : "neutral"}>
              {eligibleCount} claimable
            </Badge>
          </div>
        </CardHeader>

        <div className="divide-y divide-border/50">
          <AnimatePresence>
            {positions.map((pos) => {
              const key = `${pos.epochId}-${pos.token.symbol}`;
              return (
                <PositionRow
                  key={key}
                  pos={pos}
                  onClaim={handleClaim}
                  claimed={claimedKeys.has(key)}
                  claiming={claimingKey === key}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* empty state */}
        {positions.length === 0 && (
          <CardBody className="text-center py-14">
            <Wallet size={36} className="text-faint mx-auto mb-3" />
            <div className="font-semibold text-muted">No positions found</div>
            <p className="text-sm text-faint mt-1 max-w-xs mx-auto">
              Hold tokens on Sketch for a full epoch window to become eligible for rewards.
            </p>
          </CardBody>
        )}
      </Card>
    </div>
  );
}

// ── Page ──
export default function ClaimPage() {
  const { address } = useWallet();

  return address ? <ConnectedView /> : <DisconnectedView />;
}
