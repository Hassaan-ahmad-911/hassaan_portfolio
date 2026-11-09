import { contact } from "@/data/portfolio";
import { whatsappLink } from "@/lib/site";
import { Whatsapp } from "./ui/Icons";

/**
 * Floating "chat on WhatsApp" button, fixed to the bottom-right of every page.
 * Fades in after the intro; a soft ring pulses to draw the eye, and a label
 * slides out on hover/focus. Hidden entirely if no number is set.
 */
export function WhatsAppButton() {
  if (!contact.whatsapp) return null;

  return (
    <a
      href={whatsappLink(contact.whatsapp, contact.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp: ${contact.whatsapp} (opens in a new tab)`}
      className="intro-fade group fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-fg text-ink shadow-[0_10px_30px_rgba(0,0,0,0.55)] transition-[scale] duration-300 ease-out-expo hover:scale-110 sm:bottom-6 sm:right-6"
      style={{ animationDelay: "1.6s" }}
    >
      {/* Pulsing ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-[wa-ring_2.4s_ease-out_infinite] rounded-full border border-fg/60"
      />
      <Whatsapp size={28} />
      {/* Label that slides out on hover / keyboard focus */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 translate-x-2 whitespace-nowrap rounded-full border border-line-4 bg-ink px-3.5 py-2 font-mono text-xs text-fg opacity-0 transition-[opacity,translate] duration-300 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        Chat on WhatsApp
      </span>
    </a>
  );
}
