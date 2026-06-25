"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { formatUsd, formatNum } from "@/lib/utils";

/** Serializable format presets so server components can use this client
 *  component without passing a function across the boundary. */
type Preset = "usd" | "compactUsd" | "number" | "compact";

const PRESETS: Record<Preset, (n: number) => string> = {
  usd: (n) => formatUsd(n),
  compactUsd: (n) => formatUsd(n, { compact: true }),
  number: (n) => formatNum(n),
  compact: (n) => formatNum(n, { compact: true }),
};

interface Props {
  value: number;
  format?: (n: number) => string;
  preset?: Preset;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, format, preset, duration = 1.4, className }: Props) {
  const fmt = format ?? (preset ? PRESETS[preset] : undefined);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const controls = animate(0, value, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setDisplay(v),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {fmt ? fmt(display) : Math.round(display).toLocaleString()}
    </span>
  );
}
