"use client";

import { motion } from "framer-motion";
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
  return (
    <section className="relative overflow-hidden grid-bg">
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
          Live on BNB Smart Chain
          <span className="text-faint">·</span>
          <span className="text-gold">Zero gatekeeping</span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Launch a token.
          <br />
          <span className="text-gradient-gold">Every trade pays holders.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 text-lg text-muted max-w-2xl mx-auto"
        >
          WAGMII is a permissionless launchpad where every buy and sell feeds a shared
          treasury — and that treasury pays back to the people who hold. No presale, no
          approval, no extraction.
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
            label="Rewards Paid"
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
          Deploy a BEP-20 with auto-LP in under 30 seconds
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
