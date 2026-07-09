"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ipfsToHttp } from "@/lib/upload";

interface Props {
  symbol: string;
  gradient: string; // "color1,color2"
  src?: string; // uploaded logo (ipfs:// or https://); falls back to gradient initials
  size?: number;
  className?: string;
}

/* Token logo. Uploaded images always render when available; any missing or
   broken image falls back to the gradient-initials avatar so a token is
   never shown without a visual. */
export function TokenLogo({ symbol, gradient, src, size = 40, className }: Props) {
  const [failed, setFailed] = useState(false);
  const [c1, c2] = gradient.split(",");
  const url = src && !failed ? ipfsToHttp(src) : null;

  return (
    <div
      className={cn("relative flex items-center justify-center rounded-full font-bold text-black shrink-0 overflow-hidden", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        boxShadow: `0 4px 14px -4px ${c1}66`,
      }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={`${symbol} logo`}
          width={size}
          height={size}
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        symbol.slice(0, 2)
      )}
      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
    </div>
  );
}
