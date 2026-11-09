import type { CSSProperties } from "react";
import { ParticlePortrait } from "./ParticlePortrait";
import { profile } from "@/data/portfolio";
import { ArrowDown, ArrowRight } from "./ui/Icons";
import { MagneticButton } from "./ui/MagneticButton";

/** Inline style for an animation delay in seconds. */
const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/** Splits a word into letters that rise from behind a mask, one after another (CSS only). */
function RisingLine({ text, delay, accent }: { text: string; delay: number; accent?: string }) {
  const letters = [...text];
  return (
    <span className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
      {letters.map((ch, i) => (
        <span key={i} className="intro-rise" style={d(delay + i * 0.035)}>
          {ch === " " ? " " : ch}
        </span>
      ))}
      {accent && (
        <span className="intro-rise text-dim" style={d(delay + letters.length * 0.035 + 0.04)}>
          {accent}
        </span>
      )}
    </span>
  );
}

function Pitch() {
  const [before, after] = profile.pitch.split(profile.pitchEmphasis);
  if (after === undefined) return <>{profile.pitch}</>;
  return (
    <>
      {before}
      <span className="serif-italic text-[1.15em] text-white">{profile.pitchEmphasis}</span>
      {after}
    </>
  );
}

export function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden">
      {/* The particle canvas is portalled in here so dots can start anywhere in the hero */}
      <div id="hero-particles" aria-hidden="true" className="pointer-events-none absolute inset-0" />

      {/* 12-column grid lines that draw down on load */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto hidden max-w-7xl grid-cols-12 gap-x-6 px-8 md:grid"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="intro-draw-y block border-l border-[#141417] last:border-r" style={d(i * 0.05)} />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-wrap items-end gap-14 px-4 pb-16 pt-14 sm:px-8 md:gap-16 md:pb-[72px] md:pt-24">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-8">
          <p className="eyebrow intro-fade" style={d(0.2)}>
            {profile.role}
            <span aria-hidden="true" className="ml-1.5 inline-block h-[13px] w-[7px] animate-blink bg-muted align-[-2px]" />
          </p>

          <h1 className="text-[clamp(4.5rem,11vw,10.25rem)] font-semibold leading-[0.88] tracking-[-0.045em]">
            <span className="sr-only">{profile.name}</span>
            <RisingLine text={first} delay={0.1} />
            <RisingLine text={last} delay={0.25} accent="." />
          </h1>

          <p
            className="intro-fade-up max-w-[620px] text-[clamp(1.2rem,2.1vw,1.625rem)] font-light leading-[1.4] text-fg-2"
            style={d(0.4)}
          >
            <Pitch />
          </p>

          <div className="intro-fade-up flex flex-wrap items-center gap-3.5" style={d(0.5)}>
            <MagneticButton href="#work">
              View work
              <ArrowDown className="transition-[translate] duration-500 ease-out-expo group-hover:translate-y-0.5" />
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Contact
              <ArrowRight className="transition-[translate] duration-500 ease-out-expo group-hover:translate-x-1" />
            </MagneticButton>
          </div>

          <dl className="intro-fade-up mt-2 flex max-w-md flex-wrap gap-x-12 border-t border-line" style={d(0.6)}>
            {profile.experience && (
              <div className="pt-[18px]">
                <dt className="eyebrow">Experience</dt>
                <dd className="mt-1.5 text-[28px] font-medium tracking-tight">{profile.experience}</dd>
              </div>
            )}
            {profile.projectsCount && (
              <div className="pt-[18px]">
                <dt className="eyebrow">Projects</dt>
                <dd className="mt-1.5 text-[28px] font-medium tracking-tight">{profile.projectsCount}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Particle portrait: dots fly in from the whole hero and assemble into the photo */}
        <figure className="relative m-0 w-full max-w-[460px] flex-[1_1_400px] pb-16">
          <ParticlePortrait />

          {/* Rotating "open to work" badge — its circular text is the link's name */}
          <a
            href="#contact"
            className="intro-fade absolute -left-4 -top-10 z-20 grid size-[104px] place-items-center rounded-full border border-line-3 bg-ink transition-[scale] duration-500 ease-out-expo hover:scale-105 sm:-left-12 sm:size-[116px]"
            style={d(1.05)}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-1 animate-spin-slow" role="img" aria-label="Open to work · Full stack · AI">
              <defs>
                <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-muted font-mono" fontSize="8.4" letterSpacing="2.1" aria-hidden="true">
                <textPath href="#badge-circle">OPEN TO WORK · FULL STACK · AI · </textPath>
              </text>
            </svg>
            <span className="sr-only"> — go to the contact form</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>

          {profile.city && (
            <figcaption
              className="intro-fade absolute -top-9 right-0 text-right font-mono text-[11px] leading-relaxed text-subtle"
              style={d(1.1)}
            >
              {profile.name}
              <br />
              {profile.city} · Remote OK
            </figcaption>
          )}
        </figure>
      </div>

      <div className="intro-fade mx-auto hidden max-w-7xl items-center gap-3.5 px-8 pb-10 md:flex" aria-hidden="true" style={d(1.2)}>
        <span className="block h-14 overflow-hidden">
          <span className="block h-14 w-px animate-scroll-cue bg-muted" />
        </span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-subtle">SCROLL</span>
      </div>
    </section>
  );
}
