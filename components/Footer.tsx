import Link from "next/link";
import { Logo } from "./Logo";

const COLS = [
  {
    title: "Protocol",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Launch Token", href: "/launch" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Treasury", href: "/treasury" },
    ],
  },
  {
    title: "Earn",
    links: [
      { label: "Claim Rewards", href: "/claim" },
      { label: "How It Works", href: "/#how" },
      { label: "Trending", href: "/explore" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "X (Twitter)", href: "#" },
      { label: "Telegram", href: "#" },
      { label: "Discord", href: "#" },
      { label: "Docs", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-bold text-lg">
              WAG<span className="text-gradient-gold">MII</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted max-w-xs">
            Permissionless revenue-share token launchpad on BNB Smart Chain. Trade, earn, repeat.
          </p>
          <p className="mt-4 text-xs text-faint">wagmii.money · BNB Smart Chain</p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-text mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-faint">
          <span>© {new Date().getFullYear()} WAGMII Protocol. All trades carry risk.</span>
          <span>Built for degens, owned by the community.</span>
        </div>
      </div>
    </footer>
  );
}
