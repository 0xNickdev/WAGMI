"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatUsd } from "@/lib/utils";
import { PLATFORM_STATS } from "@/lib/mock";
import { Rocket, Compass, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 700], [0, 140]);
  const glowOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  return (
    <section className="relative overflow-hidden grid-bg">
      <motion.div
        aria-hidden
        style={{ y: glowY, opacity: glowOpacity }}
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        <div
          className="absolute left-1/2 top-[-28%] -translate-x-1/2 w-[84rem] h-[46rem]"
          style={{ background: "radial-gradient(closest-side, rgba(214,255,84,0.10), transparent 70%)" }}
        />
        <div
          className="absolute left-[-8%] top-[30%] size-[26rem]"
          style={{ background: "radial-gradient(closest-side, rgba(0,200,5,0.06), transparent 70%)" }}
        />
        <div
          className="absolute right-[-6%] top-[10%] size-[24rem]"
          style={{ background: "radial-gradient(closest-side, rgba(157,199,44,0.09), transparent 70%)" }}
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-bg" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs font-medium text-muted mb-7"
        >
          <span className="size-1.5 rounded-full bg-up live-dot" />
          Live on Robinhood Chain
          <span className="text-faint">·</span>
          <span className="text-gold">No bonding curves</span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Launch a token
          <br />
          <span className="text-gradient-gold">in under a minute.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 text-lg text-muted max-w-2xl mx-auto"
        >
          No bonding curves. No graduation. Real Uniswap V3 liquidity from block one.
          Moonshill is a dead-simple ERC20 launchpad on Robinhood Chain — fixed 1B supply,
          launch in under a minute, trading starts immediately.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button href="/launch" size="lg" className="w-full sm:w-auto">
              <Rocket size={18} />
              Launch Your Token
            </Button>
          <Button href="/explore" variant="outline" size="lg" className="w-full sm:w-auto">
              <Compass size={18} />
              Explore Tokens
            </Button>
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden glass max-w-4xl mx-auto"
        >
          <HeroStat label="Tokens Launched" value={PLATFORM_STATS.tokensLaunched} />
          <HeroStat
            label="Total Volume"
            value={PLATFORM_STATS.totalVolumeUsd}
            fmt={(n) => formatUsd(n)}
          />
          <HeroStat
            label="LP Fees Earned"
            value={PLATFORM_STATS.rewardsDistributedUsd}
            fmt={(n) => formatUsd(n)}
            highlight
          />
          <HeroStat label="Traders 24h" value={PLATFORM_STATS.activeTraders24h} />
        </motion.div>

        <motion.p
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-faint"
        >
          <Zap size={13} className="text-gold" />
          Creators earn 40% of every LP fee their token generates — forever
        </motion.p>
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value,
  fmt,
  highlight,
}: {
  label: string;
  value: number;
  fmt?: (n: number) => string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-bg-elevated/40 p-5">
      <div className={`text-2xl sm:text-3xl font-bold tabular ${highlight ? "text-gradient-gold" : ""}`}>
        <AnimatedNumber value={value} format={fmt} />
      </div>
      <div className="text-xs text-faint mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}
