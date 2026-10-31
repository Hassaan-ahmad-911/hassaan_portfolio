"use client";

import { m, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { journey } from "@/data/portfolio";
import { cn } from "@/lib/site";
import { PulseDot, SectionHeading } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";

/** `standalone`: rendered on its own page under a PageHeader, so the in-page heading is dropped. */
export function Journey({ standalone = false }: { standalone?: boolean }) {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 24, restDelta: 0.001 });
  const items = journey.filter((j) => j.title);

  return (
    <section
      id="journey"
      aria-labelledby={standalone ? undefined : "journey-h"}
      aria-label={standalone ? "Timeline" : undefined}
      className={cn(!standalone && "border-t border-line bg-ink-2")}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-wrap gap-12 px-4 sm:px-8 md:gap-16",
          standalone ? "py-16 md:py-24" : "py-24 md:py-[120px]",
        )}
      >
        {!standalone && (
          <Reveal className="min-w-0 flex-[1_1_320px]">
            <SectionHeading index="06" label="Journey" id="journey-h" lead="From first commit" emphasis="to client work." />
          </Reveal>
        )}

        <div ref={listRef} className={cn("relative min-w-0 flex-[999_1_560px] pl-9", standalone && "max-w-3xl")}>
          {/* Track + the line that draws as you scroll */}
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-line-2" />
          <m.span aria-hidden="true" style={{ scaleY }} className="absolute inset-y-0 left-0 w-px origin-top bg-muted" />

          <ol className="flex flex-col gap-11">
            {items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.05} className="relative">
                {item.current ? (
                  <PulseDot className="absolute -left-[42px] top-1 size-3" />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute -left-[41px] top-1.5 size-[11px] rounded-full border border-subtle bg-ink-2"
                  />
                )}
                <p className="font-mono text-xs text-subtle">{[item.when, item.tag].filter(Boolean).join(" · ")}</p>
                <h3 className="mt-1.5 text-[22px] font-medium leading-snug">{item.title}</h3>
                {item.body && <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>}
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
