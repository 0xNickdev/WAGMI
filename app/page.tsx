import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Sparkline } from "@/components/ui/Sparkline";
import {
  Rocket, Lock, TrendingUp, Landmark, Layers, LineChart, Sprout,
  ArrowRight, Wallet, Activity, PieChart, Eye, Clock,
} from "lucide-react";

/* Sketch Money landing — premium fintech (Stripe/Linear/Robinhood tone).
   No public metrics: the hero dashboard is an illustrative mockup. */

function spark(seed: number, up = true): number[] {
  const pts: number[] = [];
  let v = 100;
  for (let i = 0; i < 24; i++) {
    v += Math.sin(seed * 7 + i * 1.7) * 2.4 + (up ? 0.9 : -0.7);
    pts.push(v);
  }
  return pts;
}

const STOCKS = [
  { name: "Apple", ticker: "AAPL", price: "$243.18", up: true },
  { name: "Microsoft", ticker: "MSFT", price: "$512.44", up: true },
  { name: "NVIDIA", ticker: "NVDA", price: "$184.92", up: true },
  { name: "Tesla", ticker: "TSLA", price: "$421.07", up: false },
  { name: "Amazon", ticker: "AMZN", price: "$228.63", up: true },
  { name: "Meta", ticker: "META", price: "$714.30", up: true },
  { name: "Netflix", ticker: "NFLX", price: "$1,092.55", up: false },
  { name: "Coinbase", ticker: "COIN", price: "$318.76", up: true },
  { name: "AMD", ticker: "AMD", price: "$162.39", up: true },
  { name: "Alphabet", ticker: "GOOGL", price: "$196.81", up: true },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute left-1/2 top-[-30%] -translate-x-1/2 w-[80rem] h-[36rem] -z-10 pointer-events-none"
          style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.08), transparent 70%)" }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs font-medium text-muted mb-6">
              <span className="size-1.5 rounded-full bg-up live-dot" />
              Live on Robinhood Chain
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.06] max-w-4xl mx-auto">
              The On-Chain <span className="text-gradient-gold">Capital Layer</span> for
              Robinhood Chain.
            </h1>
            <p className="mt-5 text-lg text-muted max-w-2xl mx-auto">
              Launch tokens, build communities, stake Sketch, and earn tokenized stock rewards.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button href="/launch" size="lg">
                <Rocket size={17} /> Launch App
              </Button>
              <Button href="#ecosystem" variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Dashboard mockup — illustrative, no real data */}
        <Reveal y={36}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
            <div className="relative glass-strong rounded-3xl border-gradient-gold p-3 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Treasury Portfolio */}
                <Panel title="Treasury Portfolio" icon={<Landmark size={12} />} className="sm:row-span-2">
                  <div className="flex items-center justify-center py-3">
                    <svg width="128" height="128" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="48" fill="none" stroke="var(--surface-2)" strokeWidth="14" />
                      <circle cx="64" cy="64" r="48" fill="none" stroke="var(--gold)" strokeWidth="14" strokeDasharray="150 302" strokeLinecap="round" transform="rotate(-90 64 64)" />
                      <circle cx="64" cy="64" r="48" fill="none" stroke="var(--cyan)" strokeWidth="14" strokeDasharray="80 302" strokeDashoffset="-160" strokeLinecap="round" transform="rotate(-90 64 64)" />
                      <circle cx="64" cy="64" r="48" fill="none" stroke="var(--violet)" strokeWidth="14" strokeDasharray="50 302" strokeDashoffset="-250" strokeLinecap="round" transform="rotate(-90 64 64)" />
                    </svg>
                  </div>
                  <MockRow label="Tokenized equities" dot="var(--gold)" />
                  <MockRow label="Stablecoins" dot="var(--cyan)" />
                  <MockRow label="ETH" dot="var(--violet)" />
                </Panel>

                {/* Staking Overview */}
                <Panel title="Staking Overview" icon={<Lock size={12} />}>
                  <div className="flex items-end gap-1.5 h-16 pt-2">
                    {[38, 52, 44, 60, 55, 72, 66, 84, 78, 92].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gold/70" style={{ height: `${h}%`, opacity: 0.35 + i * 0.06 }} />
                    ))}
                  </div>
                  <div className="mt-2 h-2 w-2/3 rounded bg-surface-2" />
                </Panel>

                {/* Stock Rewards */}
                <Panel title="Stock Rewards" icon={<LineChart size={12} />}>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["AAPL", "NVDA", "TSLA", "SPCX", "MSFT"].map((t) => (
                      <span key={t} className="rounded-md bg-gold/10 border border-gold/25 text-gold px-2 py-1 text-[10px] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded bg-surface-2" />
                    <div className="h-2 w-3/4 rounded bg-surface-2" />
                  </div>
                </Panel>

                {/* Watchlist */}
                <Panel title="Watchlist" icon={<Eye size={12} />}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                      <div className="size-5 rounded-full bg-surface-2" />
                      <div className="h-2 w-16 rounded bg-surface-2" />
                      <div className="ml-auto">
                        <Sparkline data={spark(i, i !== 2)} width={52} height={16} strokeWidth={1.4} />
                      </div>
                    </div>
                  ))}
                </Panel>

                {/* Market Activity */}
                <Panel title="Market Activity" icon={<Activity size={12} />}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5">
                      <span className={`size-1.5 rounded-full ${i % 2 ? "bg-down" : "bg-up"}`} />
                      <div className="h-2 rounded bg-surface-2" style={{ width: `${80 - i * 12}%` }} />
                    </div>
                  ))}
                </Panel>

                {/* Recent Launches */}
                <Panel title="Recent Launches" icon={<Rocket size={12} />}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                      <div className="size-5 rounded-full" style={{ background: `linear-gradient(135deg, var(--gold), var(--${i === 1 ? "cyan" : i === 2 ? "violet" : "up"}))`, opacity: 0.7 }} />
                      <div className="h-2 w-20 rounded bg-surface-2" />
                      <span className="ml-auto text-[9px] uppercase tracking-wider text-gold">Live</span>
                    </div>
                  ))}
                </Panel>

                {/* Portfolio Allocation */}
                <Panel title="Portfolio Allocation" icon={<PieChart size={12} />}>
                  <div className="h-3 rounded-full overflow-hidden flex mt-2">
                    <div className="bg-gold/80" style={{ width: "44%" }} />
                    <div className="bg-cyan/70" style={{ width: "26%" }} />
                    <div className="bg-violet/70" style={{ width: "18%" }} />
                    <div className="bg-surface-2" style={{ width: "12%" }} />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-5/6 rounded bg-surface-2" />
                    <div className="h-2 w-2/3 rounded bg-surface-2" />
                  </div>
                </Panel>

                {/* Pending Distributions */}
                <Panel title="Pending Distributions" icon={<Clock size={12} />}>
                  {[64, 38].map((w, i) => (
                    <div key={i} className="py-1.5">
                      <div className="flex justify-between mb-1">
                        <div className="h-2 w-14 rounded bg-surface-2" />
                        <div className="h-2 w-8 rounded bg-gold/30" />
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                        <div className="h-full rounded-full bg-gold/70" style={{ width: `${w}%` }} />
                      </div>
                    </div>
                  ))}
                </Panel>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Live Markets ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Live Markets</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Tokenized Stocks on Robinhood Chain
            </h2>
            <p className="mt-3 text-muted">
              Real equities, on-chain. These are the assets stakers earn — not another
              inflationary platform token.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {STOCKS.map((s, i) => (
            <Reveal key={s.ticker} delay={(i % 5) * 0.05} className="h-full">
              <div className="glass card-shine rounded-2xl p-4 h-full hover:border-gold/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="grid place-items-center size-8 rounded-full bg-surface-2 text-[10px] font-bold text-gold">
                    {s.ticker.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{s.name}</div>
                    <div className="text-[10px] font-mono text-faint">{s.ticker}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className="tabular text-sm font-semibold">{s.price}</span>
                  <Sparkline data={spark(i + 3, s.up)} width={64} height={22} strokeWidth={1.5} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How Sketch Works ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-10">
            How Sketch <span className="text-gradient-gold">works</span>
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Rocket, title: "Launch",
              body: "Launch your token in minutes using the Sketch launch infrastructure. Permissionless deployment with configurable token settings.",
            },
            {
              icon: Lock, title: "Stake",
              body: "Stake tokens to participate in the ecosystem and receive tokenized stock rewards.",
            },
            {
              icon: TrendingUp, title: "Earn",
              body: "As the ecosystem grows, staking participants receive rewards sourced from supported tokenized stocks on Robinhood Chain.",
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08} className="h-full">
              <div className="glass rounded-2xl p-8 h-full hover:border-gold/30 hover:-translate-y-0.5 transition-all">
                <div className="grid place-items-center size-12 rounded-xl bg-gold/10 text-gold mb-5">
                  <c.icon size={22} />
                </div>
                <h3 className="text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-muted leading-relaxed">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Ecosystem ── */}
      <section id="ecosystem" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 scroll-mt-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Ecosystem</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              More than a launchpad
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal className="h-full">
            <FeatureCard icon={Layers} title="Open Launchpad" body="Deploy projects on Robinhood Chain.">
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted">
                {["Simple deployment", "Launch management", "Token taxes", "Fast creation"].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-gold" /> {x}
                  </li>
                ))}
              </ul>
            </FeatureCard>
          </Reveal>
          <Reveal delay={0.07} className="h-full">
            <FeatureCard icon={Landmark} title="Treasury" body="The ecosystem treasury supports long-term growth through diversified on-chain assets and strategic allocations." />
          </Reveal>
          <Reveal delay={0.07} className="h-full">
            <FeatureCard icon={LineChart} title="Tokenized Stock Rewards" body="Rather than rewarding inflationary platform tokens, Sketch distributes supported tokenized stock rewards to eligible stakers." />
          </Reveal>
          <Reveal delay={0.14} className="h-full">
            <FeatureCard icon={Sprout} title="Startup Capital" body="Over time, Sketch will identify high-quality projects from the ecosystem for additional exposure and ecosystem support." />
          </Reveal>
        </div>
      </section>

      {/* ── Why Sketch ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-10">
            Why <span className="text-gradient-gold">Sketch?</span>
          </h2>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Launch projects easily",
            "Stake to earn stock rewards",
            "Built for Robinhood Chain",
            "Treasury-backed ecosystem",
            "Open launch infrastructure",
            "Community-first growth",
          ].map((x, i) => (
            <Reveal key={x} delay={(i % 3) * 0.06}>
              <div className="glass rounded-xl px-5 py-4 flex items-center gap-3 hover:border-gold/30 transition-colors">
                <span className="grid place-items-center size-7 rounded-lg bg-gold/10 text-gold shrink-0">
                  <ArrowRight size={14} />
                </span>
                <span className="font-medium">{x}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Staking ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <Reveal>
          <div className="relative glass-strong rounded-3xl border-gradient-gold p-8 sm:p-12 overflow-hidden">
            <div className="absolute -top-24 -right-24 size-80 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="relative grid gap-10 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Staking</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                  Stake Once. <span className="text-gradient-gold">Earn Beyond Crypto.</span>
                </h2>
                <p className="mt-4 text-muted max-w-md leading-relaxed">
                  Staking Sketch gives you access to tokenized stock reward distributions —
                  real equities like AAPL, NVDA and TSLA — while supporting the long-term
                  growth of the ecosystem.
                </p>
                <div className="mt-7">
                  <Button href="/stake" size="lg">
                    <Lock size={16} /> Open Staking <ArrowRight size={16} />
                  </Button>
                </div>
              </div>

              {/* Staking interface mockup */}
              <div className="glass rounded-2xl p-5 max-w-sm w-full mx-auto">
                <div className="flex items-center justify-between text-xs text-faint mb-3">
                  <span className="uppercase tracking-wider">Stake Sketch</span>
                  <span className="inline-flex items-center gap-1 text-gold"><TrendingUp size={12} /> APY</span>
                </div>
                <div className="rounded-xl border border-border bg-surface-2/60 px-4 py-3 flex items-center justify-between">
                  <div className="h-3 w-20 rounded bg-surface-2" />
                  <span className="text-xs font-bold text-gold">MAX</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-gradient-to-b from-gold-bright to-gold py-2.5 text-center text-sm font-semibold text-black">Stake</div>
                  <div className="rounded-lg border border-border py-2.5 text-center text-sm text-muted">Claim</div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {["AAPL", "NVDA"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <span className="rounded-md bg-gold/10 border border-gold/25 text-gold px-1.5 py-0.5 text-[10px] font-mono">{t}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                        <div className="h-full bg-gold/70 rounded-full" style={{ width: t === "AAPL" ? "70%" : "45%" }} />
                      </div>
                      <Wallet size={12} className="text-faint" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">FAQ</h2>
        </Reveal>
        <Reveal>
          <div className="space-y-3">
            <Faq q="What is Sketch Money?">
              Sketch Money is the on-chain capital layer for Robinhood Chain: open token
              launch infrastructure, an ecosystem treasury, and staking that pays rewards in
              tokenized stocks instead of inflationary platform tokens.
            </Faq>
            <Faq q="How do tokenized stock rewards work?">
              Supported tokenized equities on Robinhood Chain (AAPL, NVDA, TSLA and more) are
              distributed to eligible stakers. Rewards stream linearly and can be claimed at
              any time.
            </Faq>
            <Faq q="How do I launch a project?">
              Connect a wallet, fill in the token details, configure optional taxes and
              rewards, and click Launch. Deployment is permissionless and takes minutes.
            </Faq>
            <Faq q="What is Sketch staking?">
              Staking Sketch (or supported project tokens) makes you eligible for tokenized
              stock reward distributions while supporting ecosystem growth. No lock-ups —
              unstake anytime.
            </Faq>
            <Faq q="What is the ecosystem treasury?">
              A diversified on-chain treasury that supports long-term ecosystem growth
              through strategic allocations across tokenized equities, stablecoins and ETH.
            </Faq>
            <Faq q="How does Sketch support startups?">
              Over time, Sketch identifies high-quality projects launched through the
              platform for additional exposure and ecosystem support — startup capital,
              on-chain.
            </Faq>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Panel({ title, icon, className, children }: {
  title: string; icon: React.ReactNode; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={`glass rounded-2xl p-4 ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-faint mb-2">
        <span className="text-gold">{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

function MockRow({ label, dot }: { label: string; dot: string }) {
  return (
    <div className="flex items-center gap-2 py-1 text-xs text-muted">
      <span className="size-2 rounded-full" style={{ background: dot }} />
      {label}
      <div className="ml-auto h-2 w-10 rounded bg-surface-2" />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, body, children }: {
  icon: React.ComponentType<{ size?: number }>; title: string; body: string; children?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-7 h-full hover:border-gold/30 transition-colors">
      <div className="grid place-items-center size-11 rounded-xl bg-gold/10 text-gold mb-4">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted leading-relaxed">{body}</p>
      {children}
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="glass rounded-xl px-5 py-4 group">
      <summary className="cursor-pointer font-semibold list-none flex items-center justify-between">
        {q}
        <span className="text-gold transition-transform group-open:rotate-45 text-lg leading-none">+</span>
      </summary>
      <div className="mt-3 text-sm text-muted leading-relaxed">{children}</div>
    </details>
  );
}
