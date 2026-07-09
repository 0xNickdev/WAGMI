"use client";

import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import { Button } from "./ui/Button";
import { shortAddr } from "@/lib/utils";
import { Wallet, LogOut, Copy, Check, Loader2 } from "lucide-react";

export function ConnectButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const { address, connecting, connect, disconnect, ethBalance } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!address) {
    return (
      <Button size={size} onClick={() => connect()} disabled={connecting}>
        {connecting ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
        {connecting ? (
          "Connecting…"
        ) : (
          <span>
            Connect<span className="hidden sm:inline"> Wallet</span>
          </span>
        )}
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button variant="secondary" size={size} onClick={() => setOpen((o) => !o)}>
        <span className="size-2 rounded-full bg-up live-dot" />
        <span className="tabular">{shortAddr(address)}</span>
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-60 glass-strong rounded-xl p-3 z-50 shadow-2xl">
            <div className="text-xs text-faint">Balance</div>
            <div className="text-lg font-semibold tabular">{ethBalance.toFixed(3)} ETH</div>
            <div className="mt-3 flex flex-col gap-1">
              <button
                className="flex items-center gap-2 text-sm text-muted hover:text-text px-2 py-1.5 rounded-lg hover:bg-surface-2 transition-colors"
                onClick={() => {
                  navigator.clipboard?.writeText(address);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
              >
                {copied ? <Check size={14} className="text-up" /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy address"}
              </button>
              <button
                className="flex items-center gap-2 text-sm text-down hover:bg-down/10 px-2 py-1.5 rounded-lg transition-colors"
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
              >
                <LogOut size={14} />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
