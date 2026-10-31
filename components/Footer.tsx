import { profile } from "@/data/portfolio";
import { ArrowUp } from "./ui/Icons";
import { Reveal } from "./ui/Reveal";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 pt-8 sm:px-8">
        <p className="font-mono text-xs text-subtle">
          © {new Date().getFullYear()} {profile.name} · Built with Next.js, deployed on Vercel
        </p>
        <a
          href="#top"
          className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs text-muted hover:text-white"
        >
          Back to top
          <ArrowUp size={14} className="transition-[translate] duration-500 ease-out-expo group-hover:-translate-y-1" />
        </a>
      </div>
      {/* Oversized outlined name — decorative, drawn as SVG so it always fits the width */}
      <Reveal y={60} className="mx-auto mt-4 max-w-7xl px-4 sm:px-8">
        <svg viewBox="0 0 1000 150" className="block w-full" aria-hidden="true">
          <text
            x="500"
            y="128"
            textAnchor="middle"
            textLength="990"
            lengthAdjust="spacingAndGlyphs"
            className="fill-transparent stroke-line-4 font-sans"
            strokeWidth="1"
            fontSize="164"
            fontWeight="600"
          >
            {profile.name.toUpperCase()}
          </text>
        </svg>
      </Reveal>
    </footer>
  );
}
