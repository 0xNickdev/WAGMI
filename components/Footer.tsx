import Link from "next/link";
import { Logo } from "./Logo";

const COLS = [
  {
    title: "Launchpad",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Launch Token", href: "/launch" },
      { label: "Trending", href: "/explore" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "How It Works", href: "/#how" },
      { label: "Docs", href: "#" },
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
              MOON<span className="text-gradient-gold">SHILL</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted max-w-xs">
            Simple ERC20 launchpad on Robinhood Chain. Fixed supply, no presales,
            no bonding curves — straight to Uniswap V3.
          </p>
          <p className="mt-4 text-xs text-faint">moonshill.money · Robinhood Chain</p>
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
          <span>© {new Date().getFullYear()} Moonshill Protocol. All trades carry risk.</span>
          <span>Built for degens, owned by the community.</span>
        </div>
      </div>
    </footer>
  );
}
