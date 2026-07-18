"use client";

import { useReducer, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConnectButton } from "@/components/ConnectButton";
import { useWallet } from "@/lib/wallet";
import { cn } from "@/lib/utils";

import { wizardReducer, DEFAULT_STATE, isStepValid, validateStep } from "@/components/launch/wizardState";
import { StepBasicInfo } from "@/components/launch/StepBasicInfo";
import { StepTax } from "@/components/launch/StepTax";
import { StepRewards } from "@/components/launch/StepRewards";
import { LivePreview } from "@/components/launch/LivePreview";
import { SuccessScreen } from "@/components/launch/SuccessScreen";
import { shortAddr } from "@/lib/utils";
import { uploadLogo } from "@/lib/upload";

// ── Step metadata (GreenMoon: details → taxes → stock rewards → launch) ────────
const STEPS = [
  { number: 1, label: "Basic Info", short: "Info" },
  { number: 2, label: "Taxes", short: "Taxes" },
  { number: 3, label: "Stake to Earn Rewards", short: "Rewards" },
  { number: 4, label: "Review & Launch", short: "Launch" },
];

const TOTAL_STEPS = STEPS.length;

// ── Slide animation variants ───────────────────────────────────────────────────
function slideVariants(direction: number) {
  return {
    enter: { x: direction > 0 ? 48 : -48, opacity: 0 },
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      x: direction > 0 ? -48 : 48,
      opacity: 0,
      transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
    },
  };
}

// Fake deployed address for the success simulation
const FAKE_ADDRESS = "0x3f8A9bC1e5D2f4071a9c8E6B3d0F7A5c4b2E1D9";

// ── Review Summary ─────────────────────────────────────────────────────────────
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-text tabular">{value}</span>
    </div>
  );
}

// ── Stepper ────────────────────────────────────────────────────────────────────
function Stepper({
  current,
  completed,
}: {
  current: number;
  completed: Set<number>;
}) {
  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((step, idx) => {
        const done = completed.has(step.number);
        const active = current === step.number;
        const accessible = done || active;
        return (
          <div key={step.number} className="flex items-center flex-1 min-w-0">
            {/* Node */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                  done
                    ? "border-gold bg-gold text-black"
                    : active
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-border-strong bg-surface-2 text-faint",
                )}
              >
                {done ? <Check size={13} strokeWidth={3} /> : step.number}
              </div>
              <span
                className={cn(
                  "hidden sm:block text-xs font-medium whitespace-nowrap transition-colors duration-300",
                  accessible ? "text-text" : "text-faint",
                )}
              >
                {step.short}
              </span>
            </div>

            {/* Connector (not after last) */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1 sm:mx-2 transition-colors duration-500">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    completed.has(step.number) ? "bg-gold/60" : "bg-border-strong",
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function LaunchPage() {
  const { address } = useWallet();
  const [state, dispatch] = useReducer(wizardReducer, DEFAULT_STATE);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [showErrors, setShowErrors] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const errors = showErrors ? validateStep(step, state) : [];
  const valid = isStepValid(step, state);

  const goNext = useCallback(() => {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setCompleted((prev) => new Set([...prev, step]));
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, [valid, step]);

  const goBack = useCallback(() => {
    setShowErrors(false);
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  async function handleDeploy() {
    if (!valid) { setShowErrors(true); return; }
    setDeploying(true);
    // Pin the logo to IPFS so it stays retrievable forever; the returned
    // ipfs:// URI goes into the token metadata on the real deploy call.
    const logoUri = state.logoFile ? await uploadLogo(state.logoFile) : null;
    console.info("Token logo pinned:", logoUri ?? "(pinning not configured)");
    await new Promise((r) => setTimeout(r, 1800));
    setDeploying(false);
    setDeployed(true);
  }

  function handleLaunchAnother() {
    setDeployed(false);
    setStep(1);
    setDirection(1);
    setCompleted(new Set());
    setShowErrors(false);
    // Reset state via a SET_FIELD on name to trigger re-render with defaults
    dispatch({ type: "SET_FIELD", field: "name", value: "" });
    dispatch({ type: "SET_FIELD", field: "symbol", value: "" });
    dispatch({ type: "SET_FIELD", field: "description", value: "" });
    dispatch({ type: "CLEAR_LOGO" });
    dispatch({ type: "SET_FIELD", field: "website", value: "" });
    dispatch({ type: "SET_FIELD", field: "twitter", value: "" });
    dispatch({ type: "SET_FIELD", field: "telegram", value: "" });
    dispatch({ type: "SET_FIELD", field: "supply", value: 1_000_000_000 });
    dispatch({ type: "SET_FIELD", field: "customSupply", value: false });
    dispatch({ type: "SET_FIELD", field: "buyTax", value: 3 });
    dispatch({ type: "SET_FIELD", field: "sellTax", value: 5 });
    dispatch({ type: "SET_FIELD", field: "buyBeforeLaunch", value: false });
    dispatch({ type: "SET_FIELD", field: "creatorBuyEth", value: 0.5 });
    dispatch({ type: "SET_FIELD", field: "rewardStock", value: "SPCX" });
    dispatch({ type: "SET_FIELD", field: "rewardAllocationPct", value: 5 });
    dispatch({ type: "SET_FIELD", field: "stakingStartDays", value: 0 });
    dispatch({ type: "SET_FIELD", field: "rewardDurationDays", value: 90 });
    dispatch({ type: "SET_FIELD", field: "rewardDescription", value: "" });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      {/* Page header */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs font-medium text-muted mb-4">
          <span className="size-1.5 rounded-full bg-gold live-dot" />
          Robinhood Chain · Permissionless Deploy
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Launch Your <span className="text-gradient-gold">Token</span>
        </h1>
        <p className="text-muted mt-2">
          Four quick steps. Fixed 1B supply, straight to Uniswap V3 — trading starts immediately.
        </p>
      </div>

      {/* Success screen replaces wizard when deployed */}
      {deployed ? (
        <div className="glass-strong rounded-3xl p-6 sm:p-10 max-w-lg mx-auto">
          <SuccessScreen
            state={state}
            contractAddress={FAKE_ADDRESS}
            onLaunchAnother={handleLaunchAnother}
          />
        </div>
      ) : (
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          {/* ── LEFT: Wizard ── */}
          <div className="flex flex-col gap-6 min-w-0">
            {/* Stepper */}
            <div className="glass rounded-2xl p-4 sm:p-5">
              <Stepper current={step} completed={completed} />
            </div>

            {/* Step content */}
            <div className="glass rounded-2xl overflow-hidden">
              {/* Step header */}
              <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-faint uppercase tracking-wider">
                      Step {step} of {TOTAL_STEPS}
                    </p>
                    <h2 className="text-xl font-bold text-text mt-0.5">
                      {STEPS[step - 1].label}
                    </h2>
                  </div>
                  {/* Progress ring placeholder */}
                  <div className="relative size-10 shrink-0">
                    <svg className="size-10 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="var(--surface-2)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15" fill="none"
                        stroke="var(--gold)" strokeWidth="3"
                        strokeDasharray={`${(step / TOTAL_STEPS) * 94.2} 94.2`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular text-gold">
                      {step}/{TOTAL_STEPS}
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated step body */}
              <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants(direction)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="px-5 sm:px-7 py-6"
                  >
                    {/* Global errors banner */}
                    {showErrors && errors.length > 0 && (
                      <div className="mb-5 rounded-xl border border-down/30 bg-down/8 px-4 py-3">
                        <ul className="flex flex-col gap-1">
                          {errors.map((e, i) => (
                            <li key={i} className="text-sm text-down">
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step === 1 && (
                      <StepBasicInfo state={state} dispatch={dispatch} errors={errors} />
                    )}
                    {step === 2 && (
                      <StepTax state={state} dispatch={dispatch} errors={errors} />
                    )}
                    {step === 3 && (
                      <StepRewards state={state} dispatch={dispatch} errors={errors} />
                    )}
                    {step === 4 && (
                      <>
                        {/* Buy Before Launch */}
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({ type: "SET_FIELD", field: "buyBeforeLaunch", value: !state.buyBeforeLaunch })
                          }
                          className={cn(
                            "w-full text-left rounded-xl border p-4 transition-colors",
                            state.buyBeforeLaunch
                              ? "border-gold/50 bg-gold/8"
                              : "border-border hover:border-border-strong",
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm">Buy before launch</p>
                              <p className="text-xs text-muted mt-0.5">
                                Deploy first and buy your own allocation before trading opens to the public.
                              </p>
                            </div>
                            <span
                              className={cn(
                                "relative shrink-0 w-10 h-6 rounded-full transition-colors",
                                state.buyBeforeLaunch ? "bg-gold" : "bg-surface-2",
                              )}
                            >
                              <span
                                className={cn(
                                  "absolute top-1 size-4 rounded-full bg-bg transition-all",
                                  state.buyBeforeLaunch ? "left-5" : "left-1",
                                )}
                              />
                            </span>
                          </div>
                        </button>
                        {state.buyBeforeLaunch && (
                          <div className="mt-3 flex items-center gap-3">
                            <label className="text-sm text-muted shrink-0">Creator buy</label>
                            <input
                              type="number"
                              min={0}
                              step={0.1}
                              value={state.creatorBuyEth}
                              onChange={(e) =>
                                dispatch({ type: "SET_FIELD", field: "creatorBuyEth", value: Number(e.target.value) })
                              }
                              className="w-28 rounded-lg bg-surface-2 border border-border px-3 py-2 text-sm tabular focus:border-gold outline-none"
                            />
                            <span className="text-sm text-muted">ETH</span>
                          </div>
                        )}

                        {/* Review summary */}
                        <div className="mt-6 glass-strong rounded-xl p-5 flex flex-col gap-0">
                          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                            Review &amp; Confirm
                          </p>
                          <ReviewRow label="Token Name" value={state.name || "—"} />
                          <ReviewRow label="Symbol" value={state.symbol ? `$${state.symbol}` : "—"} />
                          <ReviewRow label="Supply" value="1,000,000,000 (fixed)" />
                          <ReviewRow label="Buy Tax" value={`${state.buyTax.toFixed(1)}%`} />
                          <ReviewRow label="Sell Tax" value={`${state.sellTax.toFixed(1)}%`} />
                          <ReviewRow label="Reward Asset" value={`${state.rewardStock} (tokenized stock)`} />
                          <ReviewRow label="Reward Allocation" value={`${state.rewardAllocationPct}% of supply`} />
                          <ReviewRow
                            label="Staking"
                            value={`${state.stakingStartDays === 0 ? "At launch" : `+${state.stakingStartDays}d`} · ${state.rewardDurationDays}d duration`}
                          />
                          <ReviewRow
                            label="Buy Before Launch"
                            value={state.buyBeforeLaunch ? `${state.creatorBuyEth} ETH` : "Off"}
                          />
                          <ReviewRow label="Creator Wallet" value={address ? shortAddr(address) : "Connect wallet"} />
                          <ReviewRow label="Pool" value="Uniswap V3" />
                        </div>
                        <p className="mt-4 text-xs text-faint">
                          Creator wallet receives 40% of all LP fees your token generates (60% funds the protocol treasury), plus future tax distributions and rewards.
                        </p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation footer */}
              <div className="px-5 sm:px-7 py-5 border-t border-border flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={goBack}
                  disabled={step === 1}
                  className="gap-1.5"
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>

                <div className="flex items-center gap-3">
                  {step < TOTAL_STEPS ? (
                    <Button
                      size="md"
                      onClick={goNext}
                      disabled={!valid && showErrors}
                      className="gap-1.5"
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  ) : address ? (
                    <Button
                      size="lg"
                      onClick={handleDeploy}
                      disabled={deploying}
                      className="gap-2 min-w-[160px]"
                    >
                      {deploying ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Launching…
                        </>
                      ) : (
                        <>
                          <Rocket size={16} />
                          Launch Token
                        </>
                      )}
                    </Button>
                  ) : (
                    <ConnectButton size="lg" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sticky Live Preview ── */}
          <div className="hidden lg:block lg:sticky lg:top-24">
            <div className="mb-3 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-up live-dot" />
              <p className="text-xs font-semibold text-faint uppercase tracking-wider">Live Preview</p>
            </div>
            <LivePreview state={state} currentStep={step} />
          </div>
        </div>
      )}
    </div>
  );
}
