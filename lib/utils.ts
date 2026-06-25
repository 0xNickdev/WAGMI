import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

/** 1234567 -> $1.23M */
export function formatUsd(n: number, opts?: { compact?: boolean }): string {
  if (!isFinite(n)) return "$0";
  if (opts?.compact ?? Math.abs(n) >= 10000) return "$" + COMPACT.format(n);
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1 ? 6 : 2,
  });
}

export function formatNum(n: number, opts?: { compact?: boolean }): string {
  if (!isFinite(n)) return "0";
  if (opts?.compact ?? Math.abs(n) >= 10000) return COMPACT.format(n);
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function formatPct(n: number, withSign = true): string {
  const sign = withSign && n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

/** 0x1234...abcd */
export function shortAddr(addr: string, size = 4): string {
  if (!addr) return "";
  return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}

export function formatPrice(n: number): string {
  if (n === 0) return "$0.00";
  if (n < 0.00001) return "$" + n.toExponential(2);
  if (n < 1) return "$" + n.toFixed(6);
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
