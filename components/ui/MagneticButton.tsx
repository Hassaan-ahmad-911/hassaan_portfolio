"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/site";

type Variant = "solid" | "ghost";

const base =
  "group relative isolate inline-flex min-h-[52px] items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 text-[15px] font-medium transition-colors duration-300 before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:transition-transform before:duration-500 before:ease-out-expo";

const variants: Record<Variant, string> = {
  solid: "bg-fg text-ink before:scale-0 before:bg-white hover:before:scale-105",
  ghost:
    "border border-line-4 text-fg before:translate-y-full before:bg-fg hover:border-fg hover:text-ink hover:before:translate-y-0",
};

export function buttonClasses(variant: Variant = "solid", className?: string) {
  return cn(base, variants[variant], className);
}

type MagneticProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** How strongly the button follows the pointer (0–1) */
  strength?: number;
} & (
  | { href: string; external?: boolean; type?: never; disabled?: never }
  | { href?: undefined; external?: never; type?: "button" | "submit"; disabled?: boolean }
);

/** A button or link that leans toward the mouse pointer. Static for touch and reduced motion. */
export function MagneticButton({ children, className, variant = "solid", strength = 0.3, ...rest }: MagneticProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength * 1.3);
  }
  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  const shared = {
    className: buttonClasses(variant, className),
    style: { x: sx, y: sy },
    onPointerMove,
    onPointerLeave,
  };

  if (rest.href !== undefined) {
    return (
      <m.a
        href={rest.href}
        {...(rest.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...shared}
      >
        {children}
        {rest.external && <span className="sr-only">(opens in a new tab)</span>}
      </m.a>
    );
  }

  return (
    <m.button type={rest.type ?? "button"} disabled={rest.disabled} {...shared}>
      {children}
    </m.button>
  );
}
