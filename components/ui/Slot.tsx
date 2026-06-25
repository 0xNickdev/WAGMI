"use client";

import { cloneElement, isValidElement, type ReactNode, type HTMLAttributes } from "react";

/** Minimal Radix-style Slot: merges props onto a single child element. */
export function Slot({ children, ...props }: HTMLAttributes<HTMLElement> & { children?: ReactNode }) {
  if (isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return cloneElement(child, {
      ...props,
      ...child.props,
      className: [props.className, (child.props as { className?: string }).className]
        .filter(Boolean)
        .join(" "),
    });
  }
  return null;
}
