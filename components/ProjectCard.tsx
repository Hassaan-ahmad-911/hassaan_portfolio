"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent } from "react";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/site";
import { ArrowRight, ArrowUpRight } from "./ui/Icons";
import { Chip, StatusBadge } from "./ui/Primitives";

/** Small floating phone frames for app projects. */
function PhoneTrio({ project }: { project: Project }) {
  const shots = project.gallery.length ? project.gallery.slice(0, 3) : [project.cover];
  return (
    <div className="flex h-full items-center justify-center gap-4 bg-[#121214]">
      {shots.map((shot, i) => {
        const middle = shots.length === 3 && i === 1;
        return (
          <div
            key={shot.src + i}
            className={cn(
              "relative shrink-0 animate-float overflow-hidden rounded-[18px] border-4 bg-ink p-[3px]",
              middle ? "h-[180px] w-[90px] border-line-4" : "h-[164px] w-[82px] border-line-3",
            )}
            style={{ animationDelay: `${-i * 1.5}s` }}
          >
            <div className="relative size-full overflow-hidden rounded-[12px]">
              <Image src={shot.src} alt={shot.alt} fill sizes="100px" className="object-cover object-top" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Work card — every card is the same size.
 * - Enters: rises in, a curtain wipes off the screenshot while it settles from a
 *   zoom, then the text follows (CSS, keyed to the surrounding Reveal).
 * - Hover: tilts in 3D toward the cursor, a spotlight follows it, and two
 *   "layer" plates slide out from under the screenshot (the exploded stack).
 */
export function ProjectCard({ project }: { project: Project }) {
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const x = useSpring(mx, { stiffness: 300, damping: 30 });
  const y = useSpring(my, { stiffness: 300, damping: 30 });
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(tiltY, { stiffness: 200, damping: 20 });

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    mx.set(px - 200);
    my.set(py - 200);
    tiltY.set((px / r.width - 0.5) * 8); // max ±4°
    tiltX.set(-(py / r.height - 0.5) * 8);
  }
  function onPointerLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  const href = `/work/${project.slug}`;
  const isPhone = project.galleryStyle === "phone";

  return (
    <m.article
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group relative flex h-full flex-col gap-3.5 overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-[translate,border-color] duration-500 ease-out-expo focus-within:-translate-y-1.5 focus-within:border-line-4 hover:-translate-y-1.5 hover:border-line-4 sm:p-5"
    >
      {/* Spotlight (moved with transform only) */}
      <m.span
        aria-hidden="true"
        style={{ x, y }}
        className="pointer-events-none absolute left-0 top-0 size-[400px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.07),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Exploded stack — fixed height so every card matches */}
      <div className="relative h-[244px] shrink-0">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-[1] flex h-[200px] items-end rounded-[10px] border border-line-2 bg-surface-2 px-3.5 pb-1 font-mono text-[10.5px] text-subtle transition-[translate] duration-700 ease-out-expo group-focus-within:translate-y-10 group-hover:translate-y-10"
        >
          L3 · {isPhone ? "AI" : "DATA"} — {project.stackNotes.data}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-[2] flex h-[200px] items-end rounded-[10px] border border-line-2 bg-[#151517] px-3.5 pb-1 font-mono text-[10.5px] text-subtle transition-[translate] duration-700 ease-out-expo group-focus-within:translate-y-5 group-hover:translate-y-5"
        >
          L2 · LOGIC — {project.stackNotes.logic}
        </div>
        <div className="absolute inset-x-0 top-0 z-[3] h-[200px] overflow-hidden rounded-[10px] border border-line-3 bg-raised transition-[translate] duration-700 ease-out-expo group-focus-within:-translate-y-1 group-hover:-translate-y-1">
          <div className="card-zoom absolute inset-0">
            {isPhone ? (
              <PhoneTrio project={project} />
            ) : (
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                fill
                sizes="(max-width: 768px) 92vw, 620px"
                className="object-cover object-left-top transition-[scale] duration-1000 ease-out-expo group-hover:scale-[1.07]"
              />
            )}
          </div>
          {/* Entrance curtain */}
          <span aria-hidden="true" className="card-curtain absolute inset-0 z-[4] bg-[#1a1a1d]" />
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 z-10 inline-flex translate-y-[170%] items-center gap-2 rounded-full bg-fg/95 px-3.5 py-2 text-[13px] font-medium text-ink transition-[translate] duration-500 ease-out-expo group-focus-within:translate-y-0 group-hover:translate-y-0"
          >
            Case study <ArrowRight size={14} />
          </span>
        </div>
      </div>

      <div className="card-rise flex flex-wrap items-center gap-3" style={{ "--rise": "0.3s" } as CSSProperties}>
        <span className="font-mono text-xs text-subtle">{project.kind}</span>
        <StatusBadge status={project.status} />
      </div>

      <h3
        className="card-rise text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-[28px]"
        style={{ "--rise": "0.38s" } as CSSProperties}
      >
        {/* Stretched link: the whole card opens the case study */}
        <Link
          href={href}
          className="outline-none after:absolute after:inset-0 after:z-[5] after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-fg"
        >
          {project.name}
        </Link>
      </h3>
      <p
        className="card-rise line-clamp-2 text-[15px] leading-relaxed text-muted"
        style={{ "--rise": "0.46s" } as CSSProperties}
      >
        {project.summary}
      </p>

      <div
        className="card-rise mt-auto flex flex-wrap items-center justify-between gap-3 pt-1"
        style={{ "--rise": "0.54s" } as CSSProperties}
      >
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech used">
          {project.tags.slice(0, 3).map((t) => (
            <li key={t}>
              <Chip>{t}</Chip>
            </li>
          ))}
        </ul>
        <div className="relative z-10 flex gap-5">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/l inline-flex min-h-11 items-center gap-1.5 text-sm text-fg-2 hover:text-white"
            >
              Visit live
              <ArrowUpRight
                size={15}
                className="transition-[translate] duration-300 group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5"
              />
              <span className="sr-only">: {project.name} (opens in a new tab)</span>
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center gap-1.5 text-sm text-fg-2" aria-hidden="true">
              Case study <ArrowRight size={15} />
            </span>
          )}
        </div>
      </div>
    </m.article>
  );
}
