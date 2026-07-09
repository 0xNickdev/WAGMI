import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TokenCard } from "@/components/TokenCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TickerTape } from "@/components/TickerTape";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getTrending, getNewTokens } from "@/lib/mock";
import { Flame, Sparkles, History, Rocket } from "lucide-react";

export default function HomePage() {
  const trending = getTrending(8);
  const byAge = getNewTokens(12);
  const fresh = byAge.slice(0, 4);
  const recent = byAge.slice(4, 12);

  return (
    <>
      <Hero />

      <TickerTape />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <Reveal>
          <SectionHeader
            title="Trending Now"
            subtitle="Ranked by volume, traders, and price action"
            icon={<Flame className="text-amber" size={24} />}
            href="/explore"
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((t, i) => (
            <Reveal key={t.address} delay={(i % 4) * 0.07} className="h-full">
              <TokenCard token={t} rank={i} />
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <Reveal>
          <SectionHeader
            title="New Launches"
            subtitle="The newest tokens to hit the platform"
            icon={<Sparkles className="text-cyan" size={24} />}
            href="/explore"
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fresh.map((t, i) => (
            <Reveal key={t.address} delay={(i % 4) * 0.07} className="h-full">
              <TokenCard token={t} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <Reveal>
          <SectionHeader
            title="Recently Launched"
            subtitle="Live and trading on Uniswap V3"
            icon={<History className="text-violet" size={24} />}
            href="/explore"
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((t, i) => (
            <Reveal key={t.address} delay={(i % 4) * 0.07} className="h-full">
              <TokenCard token={t} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <Reveal>
          <div className="relative glass-strong rounded-3xl p-8 sm:p-16 text-center overflow-hidden grid-bg">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 -z-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                Ready to <span className="text-gradient-gold">go up?</span>
              </h2>
              <p className="mt-4 text-muted max-w-xl mx-auto">
                Launch a token in under a minute. No presale, no bonding curve, no waiting —
                straight onto Uniswap V3, trading from block one.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <Button href="/launch" size="lg">
                  <Rocket size={18} /> Launch Your Token
                </Button>
                <Button href="/explore" variant="outline" size="lg">Browse Tokens</Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
