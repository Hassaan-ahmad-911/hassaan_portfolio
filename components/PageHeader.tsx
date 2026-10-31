import type { ReactNode } from "react";
import { nav, pages, type PageKey } from "@/data/portfolio";
import { cn } from "@/lib/site";

/**
 * Title block for each navigation page: mono index, a big title whose words
 * rise in on load (the last phrase in italic serif), a short intro, and a large
 * outlined page number in the corner. CSS-only animation, so it paints at once.
 */
export function PageHeader({ page, children }: { page: PageKey; children?: ReactNode }) {
  const p = pages[page];
  const index = String(nav.findIndex((n) => n.href === `/${page}`) + 1).padStart(2, "0");
  const words = [
    ...p.lead.split(" ").map((w) => ({ w, serif: false })),
    ...p.emphasis.split(" ").map((w) => ({ w, serif: true })),
  ];

  return (
    <section id="top" aria-labelledby="page-title" className="relative overflow-hidden border-b border-line">
      {/* Decorative page number */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 200"
        className="intro-fade pointer-events-none absolute -right-6 top-6 hidden w-[min(36vw,420px)] md:block"
        style={{ animationDelay: "0.5s" }}
      >
        <text
          x="300"
          y="180"
          textAnchor="end"
          className="fill-transparent stroke-line-4 font-sans"
          strokeWidth="1"
          fontSize="210"
          fontWeight="600"
        >
          {index}
        </text>
      </svg>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-14 pt-16 sm:px-8 md:pb-20 md:pt-24">
        <p className="eyebrow intro-fade" style={{ animationDelay: "0.05s" }}>
          {index} — {p.label}
        </p>
        <h1
          id="page-title"
          className="max-w-[1000px] text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
        >
          <span className="sr-only">
            {p.lead} {p.emphasis}
          </span>
          <span aria-hidden="true" className="flex flex-wrap gap-x-[0.22em]">
            {words.map(({ w, serif }, i) => (
              <span key={i} className="block overflow-hidden pb-[0.1em]">
                <span
                  className={cn("intro-rise", serif && "serif-italic text-white")}
                  style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                >
                  {w}
                </span>
              </span>
            ))}
          </span>
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p
            className="intro-fade-up max-w-[620px] text-lg leading-relaxed text-muted sm:text-xl"
            style={{ animationDelay: "0.35s" }}
          >
            {p.intro}
          </p>
          {children && (
            <div className="intro-fade-up" style={{ animationDelay: "0.45s" }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
