"use client";

import { m } from "framer-motion";
import { easeOutExpo } from "@/lib/site";

/** A 2px line that draws itself left-to-right when it scrolls into view. */
export function DrawUnderline() {
  return (
    <m.span
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-fg"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.3 }}
    />
  );
}
