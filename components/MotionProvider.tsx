"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * - LazyMotion keeps Framer Motion's first-load JS tiny; animation features
 *   load in the background. Components must use `m.*` instead of `motion.*`.
 * - reducedMotion="user" turns off transform/layout animations for visitors
 *   who prefer reduced motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
