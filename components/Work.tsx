"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { projects, type ProjectCategory } from "@/data/portfolio";
import { cn, easeOutExpo } from "@/lib/site";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";

type Filter = "all" | ProjectCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "ai", label: "AI" },
];

/** `standalone`: rendered on its own page under a PageHeader, so the in-page heading is dropped. */
export function Work({ standalone = false }: { standalone?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = projects.filter((p) => filter === "all" || p.categories.includes(filter));

  const filterBar = (
    <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          aria-pressed={filter === f.id}
          onClick={() => setFilter(f.id)}
          className={cn(
            "min-h-11 rounded-full border px-4 font-mono text-xs transition-colors duration-300",
            filter === f.id ? "border-fg bg-fg text-ink" : "border-line-3 text-muted hover:border-dim hover:text-fg",
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );

  return (
    <section
      id="work"
      aria-labelledby={standalone ? undefined : "work-h"}
      aria-label={standalone ? "Projects" : undefined}
      className={cn(!standalone && "border-t border-line bg-ink-2")}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-8",
          standalone ? "py-16 md:py-24" : "py-24 md:py-[120px]",
        )}
      >
        {standalone ? (
          <Reveal className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs text-subtle">
              {String(visible.length).padStart(2, "0")} selected projects
            </p>
            {filterBar}
          </Reveal>
        ) : (
          <Reveal>
            <SectionHeading
              index="01"
              label="Selected work"
              id="work-h"
              lead="Selected work,"
              emphasis="built end to end."
              aside={filterBar}
            />
          </Reveal>
        )}

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        </p>

        {/* Equal two-column grid; auto-rows-fr makes every row (and card) the same height. */}
        <m.ul layout className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <m.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                transition={{ duration: 0.6, ease: easeOutExpo, delay: i * 0.06 }}
              >
                {/* Cards in the same row enter one after the other */}
                <Reveal className="h-full" y={48} delay={(i % 2) * 0.15}>
                  <ProjectCard project={p} />
                </Reveal>
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </div>
    </section>
  );
}
