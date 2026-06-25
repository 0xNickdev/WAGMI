import { Rocket, ArrowLeftRight, Landmark, HandCoins, RefreshCw } from "lucide-react";

const STEPS = [
  {
    icon: Rocket,
    title: "Launch",
    body: "Deploy a BEP-20 token with configurable taxes. Auto-LP on PancakeSwap. No approval.",
    tone: "text-gold",
  },
  {
    icon: ArrowLeftRight,
    title: "Trade",
    body: "Every buy and sell applies a protocol tax that routes on-chain to the treasury.",
    tone: "text-cyan",
  },
  {
    icon: Landmark,
    title: "Accumulate",
    body: "The treasury converts tax revenue into blue-chip assets — BNB, USDT, USDC.",
    tone: "text-violet",
  },
  {
    icon: HandCoins,
    title: "Distribute",
    body: "Each epoch, eligible holders claim their pro-rata share. Gas-efficient Merkle claims.",
    tone: "text-up",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">The Flywheel</span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
          A self-sustaining revenue loop
        </h2>
        <p className="mt-3 text-muted">
          More trading volume means more treasury revenue means larger distributions. Success
          and participant rewards move together.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative glass rounded-2xl p-6 group hover:border-gold/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`grid place-items-center size-11 rounded-xl bg-surface-2 ${s.tone}`}>
                <s.icon size={22} />
              </div>
              <span className="text-4xl font-bold text-border-strong tabular">{i + 1}</span>
            </div>
            <h3 className="font-semibold text-lg">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-faint">
        <RefreshCw size={15} className="text-gold" />
        More incentive to trade and hold → more tax revenue → bigger payouts
      </div>
    </section>
  );
}
