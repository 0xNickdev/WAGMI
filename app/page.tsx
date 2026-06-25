import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TreasuryTeaser } from "@/components/landing/TreasuryTeaser";
import { TokenCard } from "@/components/TokenCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/Button";
import { getTrending, getNewTokens } from "@/lib/mock";
import { Flame, Sparkles, Rocket } from "lucide-react";

export default function HomePage() {
  const trending = getTrending(8);
  const fresh = getNewTokens(4);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <SectionHeader
          title="Trending Now"
          subtitle="Ranked by volume, traders, and price action"
          icon={<Flame className="text-amber" size={24} />}
          href="/explore"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((t, i) => (
            <TokenCard key={t.address} token={t} rank={i} />
          ))}
        </div>
      </section>

      <HowItWorks />

      <TreasuryTeaser />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <SectionHeader
          title="Fresh Launches"
          subtitle="The newest tokens to hit the platform"
          icon={<Sparkles className="text-cyan" size={24} />}
          href="/explore"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fresh.map((t) => (
            <TokenCard key={t.address} token={t} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="relative glass-strong rounded-3xl p-10 sm:p-16 text-center overflow-hidden grid-bg">
          <div className="absolute inset-0 -z-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to <span className="text-gradient-gold">go up?</span>
            </h2>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              Launch a token in under 30 seconds. No approval, no whitelist, no gatekeeping.
              The community owns it from block one.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Button href="/launch" size="lg">
                  <Rocket size={18} /> Launch Your Token
                </Button>
              <Button href="/explore" variant="outline" size="lg">Browse Tokens</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
