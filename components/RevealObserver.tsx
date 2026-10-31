"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Watches every [data-reveal] element and marks it shown when it scrolls into view.
 * After the transition finishes it's marked done, which hands transitions back to
 * the element's own hover styles.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])");

    const show = (el: HTMLElement) => {
      if (el.dataset.shown !== undefined) return;
      el.dataset.shown = "";
      const delay = parseFloat(getComputedStyle(el).getPropertyValue("--reveal-delay")) || 0;
      window.setTimeout(() => {
        el.dataset.done = "";
      }, 1000 + delay * 1000);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const scan = () => pending().forEach((el) => io.observe(el));
    scan();

    // Pick up elements added later (project filter, route changes).
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    // Anything still hidden when the visitor reaches the very bottom gets shown.
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) pending().forEach(show);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
