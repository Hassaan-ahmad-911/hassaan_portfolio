import { ticker } from "@/data/portfolio";
import { cn } from "@/lib/site";

/** Endless strip of technologies. Decorative — the same skills are listed properly in the Skills section. */
export function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <div aria-hidden="true" className="group mask-fade-x overflow-hidden border-y border-line py-5 sm:py-6">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap text-3xl font-medium tracking-[-0.03em] group-hover:[animation-play-state:paused] sm:gap-11 sm:text-[44px]">
        {items.map((item, i) => (
          <span key={i} className={cn(i % 2 === 1 && "text-outline")}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
