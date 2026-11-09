import { profile } from "@/data/portfolio";
import { Reveal } from "./ui/Reveal";

const str = (s: string) => <span className="text-[#d4d4d8]">&quot;{s}&quot;</span>;

/** The "portfolio.ts" code card — a developer's take on an intro card. */
function CodeCard() {
  const lines = [
    <>
      <span className="text-subtle">export const</span> <span className="text-white">profile</span> = {"{"}
    </>,
    <>
      {"  "}name: {str(profile.name)},
    </>,
    <>
      {"  "}role: {str(profile.role)},
    </>,
    <>
      {"  "}stack: [{str("Django")}, {str("Next.js")}, {str("Flutter")}],
    </>,
    <>
      {"  "}ai: [{str("RAG")}, {str("Computer Vision")}],
    </>,
    <>
      {"  "}experience: {str(profile.experience)},
    </>,
    <>
      {"  "}projects: {str(profile.projectsCount)},
    </>,
    <>
      {"  "}available: <span className="text-white">{String(profile.available)}</span>,
      <span aria-hidden="true" className="ml-1.5 inline-block h-[13px] w-[7px] animate-blink bg-muted align-[-2px]" />
    </>,
    <>{"};"}</>,
  ];

  return (
    <figure className="m-0 overflow-hidden rounded-xl border border-line-2 bg-surface">
      <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-line-3" />
          <span className="size-2.5 rounded-full bg-line-3" />
          <span className="size-2.5 rounded-full bg-line-3" />
        </span>
        <figcaption className="font-mono text-[11px] text-subtle">data/portfolio.ts</figcaption>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.85] text-muted">
        <code>
          {lines.map((line, i) => (
            <Reveal key={i} as="span" className="block whitespace-pre" y={10} delay={0.15 + i * 0.07}>
              {line}
            </Reveal>
          ))}
        </code>
      </pre>
    </figure>
  );
}

export function About() {
  const facts = [
    { label: "Experience", value: profile.experience },
    { label: "Projects", value: profile.projectsCount },
    { label: "Education", value: profile.degree, sub: profile.university },
    { label: "Based in", value: profile.city },
  ].filter((f) => f.value);

  return (
    <section id="about" aria-labelledby="about-h" className="bg-ink-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-start gap-12 px-4 py-24 sm:px-8 md:gap-16 md:py-[120px]">
        <Reveal className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
          <p className="eyebrow">02 — About</p>
          <CodeCard />
        </Reveal>

        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-9">
          <Reveal as="h2" id="about-h" className="text-[clamp(2.125rem,4.2vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
            {profile.aboutHeading.lead} <span className="serif-italic text-white">{profile.aboutHeading.emphasis}</span>{" "}
            <span className="text-subtle">{profile.aboutHeading.tail}</span>
          </Reveal>
          <Reveal as="p" delay={0.1} className="max-w-[680px] text-lg leading-[1.65] text-muted">
            {profile.bio}
          </Reveal>
          <Reveal
            as="dl"
            delay={0.2}
            className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px overflow-hidden rounded-[10px] border border-line bg-line"
          >
            {facts.map((f) => (
              <div key={f.label} className="bg-ink-2 p-[22px]">
                <dt className="eyebrow">{f.label}</dt>
                <dd className="mt-2 text-base leading-snug">
                  {f.value}
                  {f.sub && (
                    <>
                      <br />
                      <span className="text-muted">{f.sub}</span>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
