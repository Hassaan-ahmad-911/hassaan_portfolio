import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BrowserBar, Chip, hostOf, StatusBadge } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { RisingTitle } from "@/components/ui/RisingTitle";
import { profile, projects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

/** Inline animation delay for the CSS intro classes. */
const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — case study`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${profile.name}`,
      description: project.summary,
      url: `/work/${project.slug}`,
      images: [{ url: project.cover.src, alt: project.cover.alt }],
    },
  };
}

/** Cover image with the exploded-stack hover: the shot lifts, layer plates slide out below. */
function Cover({ project }: { project: Project }) {
  if (project.galleryStyle === "phone") {
    const shots = project.gallery.length ? project.gallery : [project.cover];
    return (
      <div
        role="region"
        aria-label="App screenshots"
        tabIndex={0}
        className="mx-auto flex max-w-[900px] snap-x snap-mandatory items-end gap-5 overflow-x-auto px-4 pb-6 pt-8 md:justify-center md:gap-8 md:overflow-visible md:px-8"
      >
        {shots.map((shot, i) => (
          <div
            key={shot.src + i}
            className={cn("intro-fade-up shrink-0 snap-center", i === 1 && "md:-translate-y-6")}
            style={delay(0.3 + i * 0.1)}
          >
            <PhoneFrame src={shot.src} alt={shot.alt} large={i === 1} preload={i === 1} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 sm:px-8">
      <div className="intro-fade-up" style={delay(0.4)}>
        <figure className="group relative m-0 pb-14">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-14 top-0 z-[1] flex items-end rounded-xl border border-line-2 bg-surface-2 px-4 pb-1.5 font-mono text-[11px] text-subtle transition-[translate] duration-700 ease-out-expo group-hover:translate-y-[52px]"
          >
            L3 · DATA — {project.stackNotes.data}
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-14 top-0 z-[2] flex items-end rounded-xl border border-line-2 bg-[#151517] px-4 pb-1.5 font-mono text-[11px] text-subtle transition-[translate] duration-700 ease-out-expo group-hover:translate-y-[26px]"
          >
            L2 · LOGIC — {project.stackNotes.logic}
          </div>
          <div className="relative z-[3] overflow-hidden rounded-xl border border-line-3 bg-raised transition-[translate] duration-700 ease-out-expo group-hover:-translate-y-1.5">
            <BrowserBar url={hostOf(project.liveUrl)} />
            <div className="relative h-[240px] overflow-hidden sm:h-[380px]">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                fill
                preload
                sizes="(max-width: 900px) 92vw, 840px"
                className="object-cover object-left-top transition-[scale] duration-1000 ease-out-expo group-hover:scale-[1.04]"
              />
            </div>
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 text-center font-mono text-[11px] text-subtle">
            <span className="hidden sm:inline">Hover to explode the stack</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

function PhoneFrame({ src, alt, large, preload }: { src: string; alt: string; large?: boolean; preload?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[34px] border-[6px] bg-ink p-1 transition-[translate] duration-700 ease-out-expo hover:-translate-y-2",
        large ? "h-[480px] w-[240px] border-line-4" : "h-[440px] w-[220px] border-line-3",
      )}
    >
      <div className="relative size-full overflow-hidden rounded-[26px]">
        <Image src={src} alt={alt} fill preload={preload} sizes="240px" className="object-cover object-top" />
      </div>
    </div>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const extraLinks = project.links.filter((l) => l.href);

  return (
    <div id="top">
      <div className="border-b border-line">
        <nav aria-label="Breadcrumb" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-2 sm:px-8">
          <Link href="/work" className="group inline-flex min-h-11 items-center gap-2.5 text-sm text-muted hover:text-fg">
            <ArrowLeft size={16} className="transition-[translate] duration-500 ease-out-expo group-hover:-translate-x-1" />
            All work
          </Link>
          <ol className="flex gap-2 font-mono text-xs text-subtle">
            <li>
              <Link href="/" className="hover:text-fg">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/work" className="hover:text-fg">
                Work
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">
              {project.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Title block */}
      <section aria-labelledby="p-title" className="mx-auto flex max-w-7xl flex-col gap-9 px-4 pb-14 pt-16 sm:px-8 md:pt-20">
        <div className="intro-fade flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-subtle">Case study 0{index + 1}</span>
          <StatusBadge status={project.status} />
          <span className="font-mono text-xs text-subtle">{project.kind}</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-10">
          <RisingTitle
            id="p-title"
            text={project.name}
            className="max-w-[900px] text-[clamp(3.25rem,9vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]"
          />
          <p className="intro-fade-up max-w-[460px] text-xl font-light leading-normal text-fg-2" style={delay(0.2)}>
            {project.tagline}
          </p>
        </div>
        <dl
          className="intro-fade-up grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] border-t border-line-2"
          style={delay(0.3)}
        >
          <div className="pr-5 pt-4">
            <dt className="eyebrow">Role</dt>
            <dd className="mt-2">{project.role}</dd>
          </div>
          <div className="pr-5 pt-4">
            <dt className="eyebrow">Type</dt>
            <dd className="mt-2">{project.kind}</dd>
          </div>
          <div className="pr-5 pt-4">
            <dt className="eyebrow">Stack</dt>
            <dd className="mt-2">{project.tags.join(" · ")}</dd>
          </div>
          {(project.liveUrl || extraLinks.length > 0) && (
            <div className="pr-5 pt-4">
              <dt className="eyebrow">Links</dt>
              <dd className="mt-2 flex flex-wrap gap-2.5">
                {project.liveUrl && (
                  <MagneticButton href={project.liveUrl} external className="min-h-11 px-[18px] text-sm">
                    Visit live <ArrowUpRight size={14} />
                  </MagneticButton>
                )}
                {extraLinks.map((l) => (
                  <MagneticButton key={l.label} href={l.href} external variant="ghost" className="min-h-11 px-[18px] text-sm">
                    {l.label} <ArrowUpRight size={14} />
                  </MagneticButton>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <Cover project={project} />

      {/* Problem */}
      <section aria-labelledby="p-problem" className="mx-auto flex max-w-7xl flex-wrap gap-8 px-4 pt-24 sm:px-8 md:gap-16 md:pt-[120px]">
        <Reveal as="p" className="eyebrow flex-[1_1_240px]">
          The problem
        </Reveal>
        <div className="flex min-w-0 flex-[999_1_620px] flex-col gap-6">
          <Reveal as="h2" id="p-problem" className="text-[clamp(1.875rem,3.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em]">
            {project.problem.heading}
          </Reveal>
          <Reveal as="p" delay={0.1} className="max-w-[680px] text-lg leading-[1.65] text-muted">
            {project.problem.body}
          </Reveal>
        </div>
      </section>

      {/* Features by layer */}
      <section aria-labelledby="p-built" className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-24 sm:px-8 md:pt-[120px]">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="p-built" className="text-[clamp(1.875rem,3.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em]">
            What I built, <span className="serif-italic">layer by layer.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {project.layers.map((layer, i) => (
            <Reveal
              as="article"
              key={layer.label}
              delay={i * 0.1}
              className={cn(
                "group flex flex-col gap-[18px] rounded-[14px] border p-7 transition-[translate,border-color,background-color] duration-500 ease-out-expo hover:-translate-y-2 hover:border-dim hover:bg-[#141416]",
                i === 0 ? "border-line-3 bg-surface-2" : "border-line-2 bg-surface",
              )}
            >
              <h3 className="font-mono text-xs uppercase text-fg-2">
                L{i + 1} · {layer.label}
              </h3>
              <ul className="flex flex-col gap-3 text-[15px] leading-normal text-muted transition-colors group-hover:text-fg-2">
                {layer.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="font-mono text-subtle">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section aria-labelledby="p-stack" className="mx-auto flex max-w-7xl flex-wrap gap-8 px-4 pt-24 sm:px-8 md:gap-16 md:pt-[120px]">
        <Reveal as="h2" id="p-stack" className="eyebrow flex-[1_1_240px] font-normal">
          Stack
        </Reveal>
        <Reveal className="flex min-w-0 flex-[999_1_620px] flex-wrap gap-2.5">
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </Reveal>
      </section>

      {/* Next project */}
      <section aria-label="Next project" className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-8 md:pt-[120px]">
        <Reveal>
          <Link
            href={`/work/${next.slug}`}
            className="group relative isolate flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-2xl border border-line-2 bg-surface p-7 transition-colors duration-500 before:absolute before:inset-0 before:-z-10 before:translate-y-full before:bg-fg before:transition-transform before:duration-700 before:ease-out-expo hover:border-fg hover:before:translate-y-0 sm:p-10"
          >
            <span className="flex flex-col gap-2.5">
              <span className="eyebrow transition-colors duration-500 group-hover:text-ink">Next case study</span>
              <span className="text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em] transition-colors duration-500 group-hover:text-ink">
                {next.name}
              </span>
            </span>
            <span className="grid size-16 place-items-center rounded-full bg-fg text-ink transition duration-500 ease-out-expo group-hover:-rotate-45 group-hover:bg-ink group-hover:text-fg">
              <ArrowRight size={24} />
            </span>
          </Link>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
