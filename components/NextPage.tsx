import Link from "next/link";
import { nav } from "@/data/portfolio";
import { ArrowRight } from "./ui/Icons";
import { Reveal } from "./ui/Reveal";

/** Large "next page" link at the bottom of each navigation page — walks the nav in order. */
export function NextPage({ current }: { current: string }) {
  const i = nav.findIndex((n) => n.href === current);
  const next = nav[(i + 1) % nav.length];

  return (
    <section aria-label="Next page" className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
      <Reveal>
        <Link
          href={next.href}
          className="group relative isolate flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-2xl border border-line-2 bg-surface p-7 transition-colors duration-500 before:absolute before:inset-0 before:-z-10 before:translate-y-full before:bg-fg before:transition-transform before:duration-700 before:ease-out-expo hover:border-fg hover:before:translate-y-0 sm:p-10"
        >
          <span className="flex flex-col gap-2.5">
            <span className="eyebrow transition-colors duration-500 group-hover:text-ink">Next page</span>
            <span className="text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em] transition-colors duration-500 group-hover:text-ink">
              {next.label}
            </span>
          </span>
          <span className="grid size-16 place-items-center rounded-full bg-fg text-ink transition duration-500 ease-out-expo group-hover:-rotate-45 group-hover:bg-ink group-hover:text-fg">
            <ArrowRight size={24} />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
