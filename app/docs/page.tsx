import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CHAIN } from "@/lib/chain";
import { CREATOR_FEE_PCT, PLATFORM_FEE_PCT, POOL_FEE } from "@/lib/protocol";
import { Rocket, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Docs — Sketch",
  description:
    "Everything about launching and trading tokens on Sketch: launch mechanics, tokenomics, fees, creator rewards, and Robinhood Chain setup.",
};

const TOC = [
  ["intro", "Introduction"],
  ["quickstart", "Quick Start"],
  ["mechanics", "Launch Mechanics"],
  ["tokenomics", "Tokenomics"],
  ["taxes", "Buy / Sell Taxes"],
  ["buy-before-launch", "Buy Before Launch"],
  ["fees", "Fees & Creator Rewards"],
  ["staking", "Stake to Earn"],
  ["network", "Robinhood Chain Setup"],
  ["logos", "Token Logos & Metadata"],
  ["security", "Security"],
  ["roadmap", "Roadmap (V2)"],
  ["faq", "FAQ"],
] as const;

const POOL_FEE_PCT = `${POOL_FEE * 100}%`;

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <Reveal>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs font-medium text-muted mb-4">
            <BookOpen size={13} className="text-gold" />
            Sketch Documentation
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            How Sketch <span className="text-gradient-gold">works</span>
          </h1>
          <p className="text-muted mt-3 max-w-2xl">
            Everything you need to launch, trade, and earn on Sketch — the simple ERC20
            launchpad on Robinhood Chain. No bonding curves, no graduation, real Uniswap V3
            liquidity from block one.
          </p>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10 items-start">
        {/* TOC */}
        <nav className="hidden lg:block sticky top-24 glass rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-faint mb-3">On this page</p>
          <ul className="space-y-1.5">
            {TOC.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-sm text-muted hover:text-gold transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0 space-y-12 [&_h2]:scroll-mt-24">
          <Section id="intro" title="Introduction">
            <p>
              Sketch is a permissionless ERC20 launchpad on{" "}
              <strong>Robinhood Chain</strong>. The goal: let anyone launch a token in under a
              minute without bonding curves, presales, or complicated tokenomics. Every token
              launches directly onto <strong>Uniswap V3</strong> and starts trading immediately.
            </p>
            <p>
              Where bonding-curve launchpads make buyers wait for a &ldquo;graduation&rdquo;
              threshold before real liquidity exists, Sketch seeds a real Uniswap V3 pool in
              the launch transaction itself. There is no incubation phase, no migration wait, and
              no point where early buyers are stuck in a synthetic market.
            </p>
            <ul>
              <li>Fixed supply of 1,000,000,000 tokens — every token, no exceptions</li>
              <li>Standard ERC20 — no minting, no vesting, no blacklist, no pause, no governance</li>
              <li>Launch directly to Uniswap V3 — trading starts the moment you launch</li>
              <li>Creators earn {CREATOR_FEE_PCT} of all LP fees their token generates, forever</li>
            </ul>
          </Section>

          <Section id="quickstart" title="Quick Start">
            <ol>
              <li>
                <strong>Connect your wallet.</strong> Any EVM wallet works (MetaMask, Rabby,
                Coinbase Wallet). Sketch adds Robinhood Chain to your wallet automatically.
              </li>
              <li>
                <strong>Fill in the details.</strong> Token name, symbol, logo, and description.
                Website, X, and Telegram are optional. Optionally set buy/sell taxes.
              </li>
              <li>
                <strong>Click Launch.</strong> One transaction deploys the ERC20, initializes the
                Uniswap V3 pool, and seeds liquidity. Your token page goes live and trading starts
                immediately.
              </li>
            </ol>
            <p>
              Optional: enable <Link href="#buy-before-launch">Buy Before Launch</Link> to buy
              your own allocation before trading opens to the public.
            </p>
          </Section>

          <Section id="mechanics" title="Launch Mechanics">
            <p>Under the hood a launch is a single atomic flow:</p>
            <ol>
              <li>Deploy the ERC20 contract (fixed 1B supply minted to the pool)</li>
              <li>Initialize a Uniswap V3 pool at the {POOL_FEE_PCT} fee tier</li>
              <li>Add initial liquidity using the Robinhood Chain launch pattern</li>
              <li>Publish the token page</li>
              <li>Trading begins immediately</li>
            </ol>
            <p>
              There is <strong>no presale, no bonding curve, and no migration waiting period</strong>.
              The pool that exists at launch is the pool the token trades in forever — the LP
              position is owned by the protocol, which is what makes automatic fee sharing possible.
            </p>
          </Section>

          <Section id="tokenomics" title="Tokenomics">
            <p>Every Sketch token follows the same rules. This is a feature, not a limitation —
            traders never need to audit supply games:</p>
            <ul>
              <li><strong>Fixed supply:</strong> 1,000,000,000 tokens, minted once at launch</li>
              <li><strong>No minting:</strong> the supply can never increase</li>
              <li><strong>No vesting:</strong> no locked team allocations that cliff-dump later</li>
              <li><strong>No blacklist:</strong> no one can freeze your tokens</li>
              <li><strong>No pause:</strong> trading cannot be halted</li>
              <li><strong>No governance:</strong> no vote can change the rules above</li>
            </ul>
          </Section>

          <Section id="taxes" title="Buy / Sell Taxes">
            <p>
              Creators may optionally set a <strong>buy tax</strong> and a{" "}
              <strong>sell tax</strong>, each capped at <strong>10%</strong> (enforced on-chain).
              Taxes are visible on every token page next to the market stats, so traders always
              know what they are paying.
            </p>
            <p>
              Tax revenue currently accrues to the creator wallet. Configurable tax distribution
              (and creator tax updates) ship in V2.
            </p>
          </Section>

          <Section id="buy-before-launch" title="Buy Before Launch">
            <p>
              Creators can optionally buy their own allocation before public trading opens:
            </p>
            <ol>
              <li>Deploy the token</li>
              <li>Creator buys with ETH (amount chosen in the wizard)</li>
              <li>Creator clicks <strong>Launch</strong></li>
              <li>Token becomes publicly tradable</li>
            </ol>
            <p>
              This is transparent: the creator buy happens at the launch price through the same
              pool as everyone else, and the creator wallet is public on the token page.
            </p>
          </Section>

          <Section id="fees" title="Fees & Creator Rewards">
            <p>
              Launching is <strong>free</strong> — you pay only network gas. Sketch earns from
              trading, and shares that revenue with creators:
            </p>
            <ul>
              <li>Every pool is created at the <strong>{POOL_FEE_PCT} Uniswap V3 fee tier</strong></li>
              <li>LP fees are collected by the protocol (it owns the LP position)</li>
              <li>
                Fees split automatically: <strong>{CREATOR_FEE_PCT} to the creator</strong>,{" "}
                <strong>{PLATFORM_FEE_PCT} to the Sketch treasury</strong>
              </li>
            </ul>
            <p>
              Worked example: your token does <strong>$1,000,000</strong> in volume →{" "}
              <strong>$10,000</strong> in pool fees → <strong>$4,000 to you</strong>, $6,000 to the
              protocol. Unlike bonding-curve launchpads, this is not limited to a pre-graduation
              phase — creators earn on <em>all</em> volume, for the life of the token. Track your
              earnings on your <strong>creator profile</strong> page.
            </p>
          </Section>

          <Section id="staking" title="Stake to Earn">
            <p>
              Sketch rewards are not airdropped automatically — holders{" "}
              <strong>stake project tokens to earn tokenized stock rewards</strong>: real
              equities on Robinhood Chain such as AAPL, TSLA, NVDA, MSFT, and SPY.
            </p>
            <ul>
              <li>
                <strong>Creators choose the reward:</strong> at launch, every project selects a
                tokenized stock, an allocation (1–30% of supply), a staking start, and a reward
                duration.
              </li>
              <li>
                <strong>Rewards stream linearly:</strong> your share accrues every block in
                proportion to your stake.
              </li>
              <li>
                <strong>No lock-up:</strong> unstake or claim at any time from the{" "}
                <Link href="/stake">Stake &amp; Earn</Link> page.
              </li>
              <li>
                <strong>APY is dynamic:</strong> determined by the allocation, duration, and
                total amount staked — shown live on each token page.
              </li>
            </ul>
          </Section>

          <Section id="network" title="Robinhood Chain Setup">
            <p>
              Sketch runs on Robinhood Chain mainnet. Connecting your wallet on Sketch adds
              the network automatically; to add it manually:
            </p>
            <div className="not-prose glass rounded-xl overflow-hidden my-4">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Network name", CHAIN.name],
                    ["Chain ID", String(CHAIN.id)],
                    ["RPC URL", CHAIN.rpcUrl],
                    ["Currency", CHAIN.currency.symbol],
                    ["Block explorer", CHAIN.explorerUrl],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 text-muted whitespace-nowrap">{k}</td>
                      <td className="px-4 py-2.5 font-mono text-xs break-all">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Gas is paid in ETH. Bridge assets to Robinhood Chain using the official bridge at{" "}
              <a href="https://robinhood.com/chain" target="_blank" rel="noopener noreferrer">
                robinhood.com/chain
              </a>.
            </p>
          </Section>

          <Section id="logos" title="Token Logos & Metadata">
            <p>
              Token logos are pinned to <strong>IPFS</strong> at launch — content-addressed,
              permanent storage that doesn&rsquo;t depend on any single server. Your logo renders
              on the token page, explore cards, and every list forever. If an image is ever slow
              or unreachable, the UI falls back to a generated avatar so tokens always stay
              recognizable.
            </p>
            <p>
              Formats: PNG, JPG, SVG, or WebP up to 1&nbsp;MB. Square images look best (they are
              displayed as circles).
            </p>
          </Section>

          <Section id="security" title="Security">
            <ul>
              <li>
                <strong>Non-custodial:</strong> Sketch never holds your funds. Trades and
                launches execute directly from your wallet.
              </li>
              <li>
                <strong>We never ask for seed phrases or private keys</strong> — anyone who does is
                scamming you.
              </li>
              <li>
                <strong>Immutable token rules:</strong> no minting, no blacklist, no pause — the
                token contract cannot be changed after launch.
              </li>
              <li>
                <strong>All trades carry risk.</strong> Meme tokens are volatile; never trade more
                than you can afford to lose. Token contents are community-created — do your own
                research.
              </li>
            </ul>
            <p>
              Sketch is an independent, community-operated protocol. It is not affiliated with
              Robinhood Markets, Inc. or any brokerage.
            </p>
          </Section>

          <Section id="roadmap" title="Roadmap (V2)">
            <p>Deliberately not in V1 — shipping fast beats shipping everything:</p>
            <ul>
              <li>LP locker</li>
              <li>Vesting</li>
              <li>Boosted staking multipliers</li>
              <li>Creator tax updates &amp; tax distribution config</li>
              <li>Airdrops</li>
              <li>Analytics dashboard</li>
              <li>Advanced token management</li>
            </ul>
          </Section>

          <Section id="faq" title="FAQ">
            <Faq q="How much does it cost to launch?">
              Nothing beyond gas. Sketch takes no launch fee — revenue comes from the{" "}
              {POOL_FEE_PCT} pool fee tier, split {CREATOR_FEE_PCT}/{PLATFORM_FEE_PCT} between
              creator and treasury.
            </Faq>
            <Faq q="Can I change my token after launch?">
              No. Supply, taxes above the cap, and contract behavior are immutable. Creator tax
              updates are planned for V2.
            </Faq>
            <Faq q="When does trading start?">
              The same block your launch transaction confirms. There is no graduation threshold and
              no waiting period.
            </Faq>
            <Faq q="How do I claim my creator fees?">
              LP fees accrue automatically to the fee splitter. Your creator profile shows earnings
              per token; claiming is one transaction from the wallet that launched the token.
            </Faq>
            <Faq q="Is the team allocation possible?">
              Use Buy Before Launch — buy your allocation with ETH at the launch price through the
              public pool. Transparent and visible to everyone.
            </Faq>
          </Section>

          <Reveal>
            <div className="glass-strong rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold">Ready to launch?</h2>
              <p className="text-muted mt-2">Three steps. Under a minute. Live on Uniswap V3.</p>
              <div className="mt-5 flex justify-center">
                <Button href="/launch" size="lg">
                  <Rocket size={18} /> Launch Your Token
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section id={id}>
        <h2 className="text-2xl font-bold tracking-tight mb-4">{title}</h2>
        <div className="prose-docs space-y-4 text-muted leading-relaxed [&_strong]:text-text [&_a]:text-gold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="glass rounded-xl px-5 py-4 group">
      <summary className="cursor-pointer font-semibold text-text list-none flex items-center justify-between">
        {q}
        <span className="text-gold transition-transform group-open:rotate-45 text-lg leading-none">+</span>
      </summary>
      <div className="mt-3 text-sm text-muted leading-relaxed">{children}</div>
    </details>
  );
}
