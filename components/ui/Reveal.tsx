"use client";

import { motion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// reducedMotion="user" keeps the opacity fade but drops the translate for
// users with prefers-reduced-motion, without branching the rendered tree
// (branching on the media query breaks SSR hydration).
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px 0px" }}
        transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
