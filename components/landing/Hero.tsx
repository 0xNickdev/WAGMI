"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatUsd } from "@/lib/utils";
import { PLATFORM_STATS } from "@/lib/mock";
import { Rocket, BookOpen } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/* Compact, dashboard-style hero (launchhood-like): short pitch + actions,
   the token board right below is the real hero of the page. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute left-1/2 top-[-60%] -translate-x-1/2 w-[70rem] h-[30rem] -z-10 pointer-events-none"
        style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.09), transparent 70%)" }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-14 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
          <div className="max-w-2xl">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs font-medium text-muted mb-4"
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
              className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]"
            >
              Launch a token <span className="text-gradient-gold">in under a minute.</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-3 text-muted max-w-xl"
            >
              Real Uniswap V3 liquidity from block one. Stake to earn tokenized stock
              rewards. Creators keep 40% of every LP fee — forever.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Button href="/launch" size="lg">
                <Rocket size={17} /> Launch Your Token
              </Button>
              <Button href="/docs" variant="outline" size="lg">
                <BookOpen size={16} /> Docs
              </Button>
            </motion.div>
          </div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-px rounded-2xl overflow-hidden glass shrink-0"
          >
            <HeroStat label="Tokens" value={PLATFORM_STATS.tokensLaunched} />
            <HeroStat label="Volume" value={PLATFORM_STATS.totalVolumeUsd} fmt={formatUsd} />
            <HeroStat label="LP Fees Paid" value={PLATFORM_STATS.rewardsDistributedUsd} fmt={formatUsd} highlight />
            <HeroStat label="Traders 24h" value={PLATFORM_STATS.activeTraders24h} />
          </motion.div>
        </div>
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
    <div className="bg-bg-elevated/40 px-5 py-3.5 min-w-[130px]">
      <div className={`text-lg font-bold tabular ${highlight ? "text-gradient-gold" : ""}`}>
        <AnimatedNumber value={value} format={fmt} />
      </div>
      <div className="text-[10px] text-faint mt-0.5 uppercase tracking-wider">{label}</div>
    </div>
  );
}
