"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Check, ExternalLink, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { shortAddr } from "@/lib/utils";
import type { WizardState } from "./wizardState";

interface Props {
  state: WizardState;
  contractAddress: string;
  onLaunchAnother: () => void;
}

// Simple deterministic confetti dots
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.sin(i * 1.37) * 50 + 50,
  color: i % 4 === 0 ? "#d6ff54" : i % 4 === 1 ? "#8b5cf6" : i % 4 === 2 ? "#00c805" : "#aef136",
  size: 6 + (i % 5) * 2,
  delay: (i * 0.07) % 0.8,
  duration: 1.2 + (i % 5) * 0.3,
}));

export function SuccessScreen({ state, contractAddress, onLaunchAnother }: Props) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tiny delay so AnimatePresence mount is clean
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  function copyAddress() {
    navigator.clipboard?.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displaySymbol = state.symbol || "TKN";
  const displayName = state.name || "Your Token";

  return (
    <div className="relative flex flex-col items-center text-center gap-6 py-8 overflow-hidden">
      {/* Confetti burst */}
      {visible && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {CONFETTI.map((c) => (
            <motion.div
              key={c.id}
              className="absolute rounded-sm"
              style={{
                left: `${c.x}%`,
                top: "30%",
                width: c.size,
                height: c.size,
                background: c.color,
              }}
              initial={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              animate={{
                y: [-20, -120 - c.id * 3],
                opacity: [1, 1, 0],
                rotate: [0, 180 + c.id * 20],
                scale: [1, 0.6],
              }}
              transition={{
                duration: c.duration,
                delay: c.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Check icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative"
      >
        <div className="size-24 rounded-full bg-up/15 flex items-center justify-center glow-up">
          <CheckCircle size={48} className="text-up" />
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-3xl font-bold text-text">Token Deployed!</h2>
        <p className="text-muted max-w-sm">
          <span className="text-gradient-gold font-semibold">${displaySymbol}</span> is live on
          Robinhood Chain. Auto-LP has been seeded on Uniswap.
        </p>
      </motion.div>

      {/* Token card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm glass-strong rounded-2xl p-5 flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          {state.logoPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={state.logoPreviewUrl}
              alt="logo"
              className="size-12 rounded-full object-cover ring-2 ring-up/30"
            />
          ) : (
            <TokenLogo symbol={displaySymbol} gradient={state.gradientSeed} size={48} />
          )}
          <div className="text-left">
            <div className="font-bold text-text">{displayName}</div>
            <div className="text-sm text-gold">${displaySymbol}</div>
          </div>
        </div>

        {/* Contract address */}
        <div className="rounded-xl bg-surface-2 border border-border-strong p-3 flex items-center gap-2">
          <div className="flex-1 text-left">
            <p className="text-xs text-faint mb-0.5">Contract Address</p>
            <p className="text-xs font-mono text-text tabular">{shortAddr(contractAddress, 8)}</p>
          </div>
          <button
            onClick={copyAddress}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border border-border-strong bg-surface hover:border-gold/40 hover:text-gold transition-colors"
          >
            {copied ? <Check size={12} className="text-up" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Uniswap notice */}
        <div className="flex items-center gap-2 rounded-lg bg-up/8 border border-up/20 px-3 py-2">
          <div className="size-2 rounded-full bg-up live-dot shrink-0" />
          <p className="text-xs text-up">Auto-LP created on Uniswap — trading is live</p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <Button href="/explore" size="lg" className="flex-1">
            <ExternalLink size={16} />
            View Token
          </Button>
        <Button variant="outline" size="lg" className="flex-1" onClick={onLaunchAnother}>
          <Rocket size={16} />
          Launch Another
        </Button>
      </motion.div>
    </div>
  );
}
