import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { contact, profile } from "@/data/portfolio";
import { cn, whatsappLink } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { Briefcase, Download, Github, Linkedin, Whatsapp } from "./ui/Icons";
import { PulseDot } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import { DrawUnderline } from "./ui/DrawUnderline";

type Social = { label: string; href: string; icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>; download?: boolean };

/** `standalone`: rendered on its own page under a PageHeader, so the big in-page heading is dropped. */
export function Contact({ standalone = false }: { standalone?: boolean }) {
  const socials: Social[] = (
    [
      {
        label: "WhatsApp",
        href: contact.whatsapp ? whatsappLink(contact.whatsapp, contact.whatsappMessage) : "",
        icon: Whatsapp,
      },
      { label: "GitHub", href: contact.github, icon: Github },
      { label: "LinkedIn", href: contact.linkedin, icon: Linkedin },
      { label: "Upwork", href: contact.upwork, icon: Briefcase },
      { label: "Download CV", href: contact.cv, icon: Download, download: true },
    ] satisfies Social[]
  ).filter((s) => s.href);

  return (
    <section
      id="contact"
      aria-labelledby={standalone ? undefined : "contact-h"}
      aria-label={standalone ? "Contact details and form" : undefined}
      className={cn(!standalone && "border-t border-line")}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-col gap-14 px-4 pb-24 sm:px-8 md:gap-16",
          standalone ? "pt-16 md:pt-24" : "pt-24 md:pt-[120px]",
        )}
      >
        {!standalone && (
          <Reveal
            as="h2"
            id="contact-h"
            className="max-w-[1100px] text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
          >
            Have a product in mind?{" "}
            <span className="serif-italic relative inline-block font-normal text-white">
              Let&apos;s build it.
              <DrawUnderline />
            </span>
          </Reveal>
        )}

        <div className="flex flex-wrap gap-12 md:gap-16">
          <Reveal className="flex min-w-0 flex-[1_1_320px] flex-col gap-7">
            <div className="flex items-center gap-4">
              <span className="relative inline-block">
                <Image
                  src={profile.photo.src}
                  alt=""
                  width={64}
                  height={64}
                  className="size-16 rounded-full border border-line-4 object-cover object-[50%_25%] grayscale"
                />
                {profile.available && (
                  <PulseDot className="absolute bottom-0.5 right-0.5 size-2.5 outline-[3px] outline-ink" />
                )}
              </span>
              <div>
                <p className="text-[17px] font-medium">{profile.name}</p>
                <p className="mt-1 font-mono text-xs text-muted">{profile.replyTime}</p>
              </div>
            </div>

            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="relative self-start break-all pb-1.5 text-[clamp(1.25rem,2.4vw,1.625rem)] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-fg after:transition-transform after:duration-500 after:ease-out-expo hover:after:origin-left hover:after:scale-x-100"
              >
                {contact.email}
              </a>
            )}
            {contact.whatsapp && (
              <a
                href={`tel:${contact.whatsapp.replace(/\s/g, "")}`}
                className="-mt-3 inline-flex self-start font-mono text-sm text-muted hover:text-white"
              >
                {contact.whatsapp}
              </a>
            )}

            {socials.length > 0 && (
              <ul className="grid grid-cols-2 gap-2.5">
                {socials.map(({ label, href, icon: Icon, download }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(download ? { download: "" } : { target: "_blank", rel: "noopener noreferrer" })}
                      className="group relative isolate flex min-h-[52px] items-center gap-2.5 overflow-hidden rounded-[10px] border border-line-4 px-4 text-sm transition-colors duration-300 before:absolute before:inset-0 before:-z-10 before:translate-y-full before:bg-fg before:transition-transform before:duration-500 before:ease-out-expo hover:border-fg hover:text-ink hover:before:translate-y-0"
                    >
                      <Icon size={18} />
                      {label}
                      {!download && <span className="sr-only">(opens in a new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
