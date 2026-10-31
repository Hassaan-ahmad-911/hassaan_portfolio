"use client";

import { AnimatePresence, m, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, profile } from "@/data/portfolio";
import { cn, easeOutExpo } from "@/lib/site";
import { Close, Menu } from "./ui/Icons";
import { MagneticButton } from "./ui/MagneticButton";
import { PulseDot } from "./ui/Primitives";

/** A nav item is active on its own page and on any page below it (e.g. /work/kammer). */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  // Close the menu whenever the page changes.
  useEffect(() => setOpen(false), [pathname]);

  // Close on Escape, lock page scroll and move focus into the menu while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-[10px] border border-line-4 font-mono text-[13px] font-medium"
          >
            {profile.initials}
          </span>
          <span className="sr-only text-[15px] font-medium sm:not-sr-only">{profile.name}</span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-3 text-sm transition-colors hover:text-fg after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:bg-fg after:transition-transform after:duration-500 after:ease-out-expo",
                    active
                      ? "text-fg after:scale-x-100"
                      : "text-muted after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          {profile.available && (
            <span className="hidden items-center gap-2.5 font-mono text-xs text-muted md:inline-flex">
              <PulseDot />
              {profile.availabilityLabel}
            </span>
          )}
          <MagneticButton href="/contact" className="hidden min-h-11 px-[18px] text-sm sm:inline-flex">
            Let&apos;s talk
          </MagneticButton>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-[10px] border border-line-4 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <m.span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-fg"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-4.25rem)] border-b border-line bg-ink px-4 pb-10 pt-6 lg:hidden"
          >
            <ul className="flex flex-col">
              {nav.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: easeOutExpo }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-16 items-center justify-between border-b border-line-2 text-3xl font-medium tracking-tight",
                        active ? "text-fg" : "text-fg-2",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {active && <span aria-hidden="true" className="size-2 rounded-full bg-fg" />}
                        {item.label}
                      </span>
                      <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                    </Link>
                  </m.li>
                );
              })}
            </ul>
            {profile.available && (
              <p className="mt-8 inline-flex items-center gap-2.5 font-mono text-xs text-muted">
                <PulseDot />
                {profile.availabilityLabel}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
