"use client";

import { useState } from "react";
import type { Token } from "@/lib/types";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { ChangeBadge, Badge } from "@/components/ui/Badge";
import { formatPrice, formatPct, shortAddr } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Globe, AtSign, Send, MessageCircle, Copy, Check, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  token: Token;
}

export function TokenHeader({ token }: Props) {
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    navigator.clipboard?.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const priceUp = token.priceChange24h >= 0;
  const price1hUp = token.priceChange1h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 sm:gap-0"
    >
      {/* Top row: logo + name + socials */}
      <div className="flex flex-wrap items-start gap-4">
        <TokenLogo symbol={token.symbol} gradient={token.logoColor} src={token.logoUrl} size={56} className="shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Name + verified badge */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-text leading-none">
              {token.name}
            </h1>
            <span className="font-mono text-lg text-faint leading-none">${token.symbol}</span>
            <Badge tone="gold" className="flex items-center gap-1">
              <ShieldCheck size={10} />
              Verified Moonshill token
            </Badge>
          </div>

          {/* Contract address + copy */}
          <div className="flex items-center gap-1.5">
            <span className="tabular text-xs text-faint font-mono">{shortAddr(token.address, 6)}</span>
            <button
              onClick={copyAddress}
              className="text-faint hover:text-gold transition-colors"
              aria-label="Copy contract address"
            >
              {copied
                ? <Check size={12} className="text-up" />
                : <Copy size={12} />}
            </button>
            <span className="text-faint text-xs">·</span>
            <a
              href={`/creator/${token.creator}`}
              className="text-xs text-muted hover:text-gold transition-colors"
            >
              by <span className="font-mono">{shortAddr(token.creator)}</span>
            </a>
          </div>
        </div>

        {/* Social icons — right-aligned on larger screens */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {token.socials.website && (
            <SocialLink href={token.socials.website} label="Website">
              <Globe size={15} />
            </SocialLink>
          )}
          {token.socials.twitter && (
            <SocialLink href={token.socials.twitter} label="Twitter / X">
              <AtSign size={15} />
            </SocialLink>
          )}
          {token.socials.telegram && (
            <SocialLink href={token.socials.telegram} label="Telegram">
              <Send size={15} />
            </SocialLink>
          )}
          {token.socials.discord && (
            <SocialLink href={token.socials.discord} label="Discord">
              <MessageCircle size={15} />
            </SocialLink>
          )}
        </div>
      </div>

      {/* Price row */}
      <div className="flex flex-wrap items-end gap-3 mt-2">
        <div className={cn("text-4xl font-bold tabular leading-none", priceUp ? "text-text" : "text-text")}>
          {formatPrice(token.price)}
        </div>
        <div className="flex items-center gap-2 mb-0.5">
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-wider text-faint">24h</span>
            <ChangeBadge value={token.priceChange24h} className="text-sm px-2 py-1" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-wider text-faint">1h</span>
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-sm font-semibold tabular",
                price1hUp ? "bg-up/12 text-up" : "bg-down/12 text-down",
              )}
            >
              {price1hUp ? "+" : ""}{formatPct(token.priceChange1h)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center size-8 rounded-lg glass text-faint hover:text-gold hover:border-gold/30 transition-all"
    >
      {children}
    </a>
  );
}
