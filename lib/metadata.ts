import type { Metadata } from "next";
import { pages, profile, type PageKey } from "@/data/portfolio";

/** Title, description, canonical URL and Open Graph for a navigation page. */
export function pageMetadata(key: PageKey): Metadata {
  const p = pages[key];
  const path = `/${key}`;
  return {
    title: p.label,
    description: p.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${p.label} — ${profile.name}`,
      description: p.description,
      url: path,
    },
  };
}
