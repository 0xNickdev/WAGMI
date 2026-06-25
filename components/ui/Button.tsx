"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Slot } from "./Slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "success";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-gold-bright to-gold text-black font-semibold hover:brightness-110 shadow-[0_8px_30px_-8px_rgba(240,185,11,0.5)]",
  secondary:
    "bg-surface-2 text-text border border-border-strong hover:bg-surface-2/70 hover:border-gold/40",
  ghost: "text-muted hover:text-text hover:bg-surface-2/60",
  outline: "border border-border-strong text-text hover:border-gold/50 hover:bg-surface-2/40",
  danger: "bg-down/15 text-down border border-down/30 hover:bg-down/25",
  success: "bg-up/15 text-up border border-up/30 hover:bg-up/25",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-[10px] gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-13 px-7 text-base rounded-2xl gap-2.5 py-3.5",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 cursor-pointer",
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Render an internal Link (preferred over asChild for navigation —
   *  avoids cloneElement hydration issues across the RSC boundary). */
  href?: string;
  asChild?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  asChild,
  className,
  children,
  ...props
}: ButtonProps) {
  const cls = buttonClasses(variant, size, className);

  if (href) {
    return (
      <Link href={href} className={cls} {...(props as Record<string, unknown>)}>
        {children}
      </Link>
    );
  }

  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cls} {...props}>
      {children}
    </Comp>
  );
}
