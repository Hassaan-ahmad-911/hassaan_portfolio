import type { MetadataRoute } from "next";
import { nav, projects } from "@/data/portfolio";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...nav.map((item) => ({
      url: `${siteUrl}${item.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...projects.map((p) => ({
      url: `${siteUrl}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
