/** Absolute site URL for metadata, sitemap and JSON-LD. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/** wa.me chat link for a phone number like "+92 327 8535225" (digits only in the URL). */
export function whatsappLink(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Shared easing curves for Framer Motion (match the CSS tokens). */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOutQuart = [0.76, 0, 0.24, 1] as const;
