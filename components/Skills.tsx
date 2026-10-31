import Link from "next/link";
import { projects, skills } from "@/data/portfolio";
import { cn } from "@/lib/site";
import { Chip, SectionHeading } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";

/** Indents each layer a little more than the one above, like strata — flattened on small screens. */
const indent = ["", "md:ml-6", "md:ml-12", "md:ml-[72px]", "md:ml-24"];

/** `standalone`: rendered on its own page under a PageHeader, so the in-page heading is dropped. */
export function Skills({ standalone = false }: { standalone?: boolean }) {
  return (
    <section
      id="skills"
      aria-labelledby={standalone ? undefined : "skills-h"}
      aria-label={standalone ? "Skills by layer" : undefined}
      className={cn(!standalone && "border-t border-line")}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-8",
          standalone ? "py-16 md:py-24" : "py-24 md:py-[120px]",
        )}
      >
        {!standalone && (
          <Reveal>
            <SectionHeading
              index="03"
              label="Skills"
              id="skills-h"
              lead="The stack,"
              emphasis="in cross-section."
              aside={
                <p className="max-w-[380px] text-[15px] leading-relaxed text-muted">
                  Five layers, top to bottom. Hover one to pull it out of the stack.
                </p>
              }
            />
          </Reveal>
        )}

        <ol className="flex flex-col gap-2.5">
          {skills.map((s, i) => {
            const used = s.usedIn
              .map((slug) => projects.find((p) => p.slug === slug))
              .filter((p): p is (typeof projects)[number] => Boolean(p));
            return (
              <Reveal
                as="li"
                key={s.group}
                delay={i * 0.06}
                className={cn(
                  "group flex flex-wrap items-center gap-x-7 gap-y-4 rounded-[10px] border p-5 transition-[translate,border-color,background-color] duration-500 ease-out-expo hover:translate-x-3.5 hover:border-dim hover:bg-[#151517] sm:px-[26px] sm:py-[22px]",
                  i === 0 ? "border-line-3 bg-surface-2" : "border-line-2 bg-surface",
                  i === skills.length - 1 && "border-dashed bg-transparent",
                  indent[i],
                )}
              >
                <span className="w-11 font-mono text-xs text-subtle transition-colors group-hover:text-white">{s.layer}</span>
                <h3 className="w-36 text-xl font-medium">{s.group}</h3>
                <ul className="flex flex-[1_1_360px] flex-wrap gap-2" aria-label={`${s.group} skills`}>
                  {s.items.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
                <p className="font-mono text-xs text-subtle">
                  <span aria-hidden="true">→ </span>
                  <span className="sr-only">Used in: </span>
                  {used.length === 0
                    ? "everything"
                    : used.map((p, j) => (
                        <span key={p.slug}>
                          {j > 0 && " · "}
                          <Link href={`/work/${p.slug}`} className="text-muted underline-offset-4 hover:text-white hover:underline">
                            {p.name}
                          </Link>
                        </span>
                      ))}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
