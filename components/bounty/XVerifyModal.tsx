"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, Check } from "lucide-react";

function XLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Mock X (Twitter) OAuth — simulates the "Authorize app" screen. */
export function XVerifyModal({
  open,
  onClose,
  onVerified,
  purpose = "verify your identity before posting",
}: {
  open: boolean;
  onClose: () => void;
  onVerified: (handle: string) => void;
  purpose?: string;
}) {
  const [phase, setPhase] = useState<"ask" | "loading" | "done">("ask");
  if (!open) return null;

  const authorize = () => {
    setPhase("loading");
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => {
        onVerified("@wagmii_degen");
        setPhase("ask");
      }, 900);
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={phase === "ask" ? onClose : undefined} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white text-black shadow-2xl p-7 text-center">
        <div className="flex justify-center text-black mb-5">
          <XLogo size={28} />
        </div>

        {phase === "done" ? (
          <div className="py-6">
            <div className="mx-auto grid place-items-center size-14 rounded-full bg-green-100 mb-3">
              <Check size={28} className="text-green-600" />
            </div>
            <p className="font-semibold">X account connected</p>
            <p className="text-sm text-gray-500">@wagmii_degen verified</p>
          </div>
        ) : (
          <>
            <div className="mx-auto size-12 rounded-xl bg-black grid place-items-center mb-4">
              <span className="text-gold font-black text-lg">W</span>
            </div>
            <h3 className="text-lg font-bold leading-tight">
              WAGMII Connect wants to access your X account
            </h3>
            <p className="mt-2 text-sm text-gray-500">Connect your X to {purpose}.</p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-left">
              <span className="size-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">WAGMII Degen</div>
                <div className="text-xs text-gray-500 truncate">@wagmii_degen</div>
              </div>
            </div>

            <button
              onClick={authorize}
              disabled={phase === "loading"}
              className="mt-5 w-full rounded-full bg-black text-white font-semibold py-3 hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {phase === "loading" ? <Loader2 size={16} className="animate-spin" /> : null}
              {phase === "loading" ? "Authorizing…" : "Authorize app"}
            </button>
            <button onClick={onClose} className="mt-3 text-sm font-medium text-rose-500 hover:underline">
              Cancel
            </button>
            <p className="mt-4 text-[11px] text-gray-400">
              This is a simulated verification step for the demo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
