import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { HomeTokenBoard } from "@/components/HomeTokenBoard";
import { TickerTape } from "@/components/TickerTape";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getTokens } from "@/lib/mock";
import { Rocket } from "lucide-react";

export default function HomePage() {
  const tokens = getTokens();

  return (
    <>
      <TickerTape />

      <Hero />

      <HomeTokenBoard tokens={tokens} />

      <HowItWorks />

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
