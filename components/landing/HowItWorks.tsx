import { ClipboardList, ShoppingCart, Rocket, ArrowLeftRight, Zap } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Fill in the details",
    body: "Name, symbol, logo, description. Optionally set buy/sell taxes and socials. Supply is fixed at 1B — no minting, ever.",
    tone: "text-gold",
  },
  {
    icon: ShoppingCart,
    title: "Buy first (optional)",
    body: "Deploy the token and buy your own allocation before anyone else — then flip the switch when you're ready.",
    tone: "text-cyan",
  },
  {
    icon: Rocket,
    title: "Click Launch",
    body: "We deploy the ERC20, initialize a Uniswap V3 pool, and seed initial liquidity in one transaction.",
    tone: "text-violet",
  },
  {
    icon: ArrowLeftRight,
    title: "Trading is live",
    body: "No presale, no bonding curve, no migration wait. LP fees split automatically between you and the protocol.",
    tone: "text-up",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">How It Works</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            As simple as it gets
          </h2>
          <p className="mt-3 text-muted">
            Fill in the token details, optionally buy first, click Launch — your token is
            live and trading on Uniswap V3 immediately.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.09} className="h-full">
            <div className="relative glass rounded-2xl p-6 h-full group hover:border-gold/30 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`grid place-items-center size-11 rounded-xl bg-surface-2 ${s.tone}`}>
                  <s.icon size={22} />
                </div>
                <span className="text-4xl font-bold text-border-strong tabular">{i + 1}</span>
              </div>
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-faint">
          <Zap size={15} className="text-gold" />
          Fixed 1B supply · No minting · No vesting · No blacklist · No pause · No governance
        </div>
      </Reveal>
    </section>
  );
}
