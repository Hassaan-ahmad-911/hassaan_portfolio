import type { ComponentType, SVGProps } from "react";
import { services } from "@/data/portfolio";
import { cn } from "@/lib/site";
import { ArrowRight, Globe, Layers, ScanFace, Smartphone } from "./ui/Icons";
import { SectionHeading } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";

const icons: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>[] = [Layers, Smartphone, ScanFace, Globe];

/** `standalone`: rendered on its own page under a PageHeader, so the in-page heading is dropped. */
export function Services({ standalone = false }: { standalone?: boolean }) {
  return (
    <section
      id="services"
      aria-labelledby={standalone ? undefined : "services-h"}
      aria-label={standalone ? "Services" : undefined}
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
            <SectionHeading index="05" label="Services" id="services-h" lead="What I can build" emphasis="for you." />
          </Reveal>
        )}

        <ul className="border-t border-line-2">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 0.06}
                className="group relative isolate flex flex-wrap items-start gap-x-10 gap-y-4 overflow-hidden border-b border-line-2 px-2 py-8 before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-[#121214] before:transition-transform before:duration-500 before:ease-out-expo hover:before:origin-top hover:before:scale-y-100 sm:px-6"
              >
                <span className="w-10 pt-3 font-mono text-xs text-subtle transition-colors group-hover:text-white">
                  0{i + 1}
                </span>
                <Icon size={28} className="mt-2 text-muted transition-colors group-hover:text-white" />
                <div className="min-w-0 flex-[999_1_340px]">
                  <h3 className="text-[clamp(1.5rem,2.6vw,2rem)] font-medium tracking-[-0.02em] transition-[translate] duration-500 ease-out-expo group-hover:translate-x-3">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 max-w-[560px] text-base leading-relaxed text-muted">{s.body}</p>
                </div>
                <p className="flex-[1_1_200px] font-mono text-xs leading-[1.9] text-subtle">
                  {s.meta.map((m) => (
                    <span key={m} className="block">
                      {m}
                    </span>
                  ))}
                </p>
                <ArrowRight
                  size={28}
                  strokeWidth={1.5}
                  className="mt-2 hidden text-dim transition duration-500 ease-out-expo group-hover:-rotate-45 group-hover:text-white sm:block"
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
