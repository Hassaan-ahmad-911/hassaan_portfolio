import type { ReactNode } from "react";
import type { ProjectStatus } from "@/data/portfolio";
import { cn } from "@/lib/site";

/** White dot with a soft expanding ring — used for "available" and "live". */
export function PulseDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        // Positioned so the ring can sit on top; callers may pass their own `absolute` placement.
        !className?.includes("absolute") && "relative",
        "inline-block size-2 shrink-0 rounded-full bg-white after:absolute after:inset-0 after:animate-pulse-ring after:rounded-full after:bg-white",
        className,
      )}
    />
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border border-line-3 bg-surface-2 px-3 py-1.5 font-mono text-xs text-fg-2 transition duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-dim hover:text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  client: "Client work",
  mobile: "Mobile · AI",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line-4 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-fg">
      {status === "live" && <PulseDot className="size-1.5" />}
      {statusLabel[status]}
    </span>
  );
}

/** Section intro: mono index label, big heading with an italic-serif tail, optional aside. */
export function SectionHeading({
  index,
  label,
  id,
  lead,
  emphasis,
  aside,
}: {
  index: string;
  label: string;
  id: string;
  lead: string;
  emphasis: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="flex flex-col gap-4">
        <p className="eyebrow">
          {index} — {label}
        </p>
        <h2 id={id} className="text-[clamp(2.125rem,4.2vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
          {lead} <span className="serif-italic">{emphasis}</span>
        </h2>
      </div>
      {aside}
    </div>
  );
}

/** Minimal browser chrome around a website screenshot. */
export function BrowserBar({ url }: { url: string }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-line-2 bg-[#141416] px-3.5 py-2.5">
      <span className="size-2.5 rounded-full bg-line-4" />
      <span className="size-2.5 rounded-full bg-line-4" />
      <span className="size-2.5 rounded-full bg-line-4" />
      {url && <span className="ml-3 truncate font-mono text-[11px] text-subtle">{url}</span>}
    </div>
  );
}

export function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}
