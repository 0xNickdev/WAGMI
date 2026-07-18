"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ConnectButton } from "./ConnectButton";
import { Button } from "./ui/Button";
import { Logo } from "./Logo";
import { Menu, X, Rocket } from "lucide-react";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/stake", label: "Stake & Earn" },
  { href: "/#how", label: "How It Works" },
  { href: "/docs", label: "Docs" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong border-b border-border" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo size={30} />
            <span className="font-bold text-lg tracking-tight">
              SKETCH<span className="text-gradient-gold">&nbsp;MONEY</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active ? "text-gold bg-gold/10" : "text-muted hover:text-text hover:bg-surface-2/60",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/launch" variant="primary" size="sm" className="hidden sm:inline-flex">
              <Rocket size={15} />
              Launch Token
            </Button>
          <ConnectButton size="sm" />
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-2 text-muted"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass-strong border-t border-border px-4 py-3 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium",
                pathname.startsWith(l.href) ? "text-gold bg-gold/10" : "text-muted",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Button href="/launch" variant="primary" size="md" className="mt-2">
              <Rocket size={16} /> Launch Token
            </Button>
        </div>
      )}
    </header>
  );
}
