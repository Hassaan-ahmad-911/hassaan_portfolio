import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/MotionProvider";
import { RevealObserver } from "@/components/RevealObserver";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contact, profile, seo } from "@/data/portfolio";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
// Only Geist is preloaded; the mono and serif accents swap in a moment later.
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.title, template: `%s — ${profile.name}` },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: profile.name,
    title: seo.title,
    description: seo.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

function PersonJsonLd() {
  const sameAs = [contact.github, contact.linkedin, contact.upwork].filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: siteUrl,
    image: `${siteUrl}${profile.photo.src}`,
    description: seo.description,
    knowsAbout: ["Python", "Django", "Next.js", "React", "TypeScript", "Flutter", "RAG", "Computer vision"],
    ...(sameAs.length && { sameAs }),
    ...(contact.email && { email: `mailto:${contact.email}` }),
    ...(contact.whatsapp && { telephone: contact.whatsapp.replace(/\s/g, "") }),
    ...(profile.university && { alumniOf: { "@type": "CollegeOrUniversity", name: profile.university } }),
    ...(profile.city && { address: { "@type": "PostalAddress", addressLocality: profile.city } }),
  };
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be a raw string; "<" is escaped so content can't close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Lets CSS hide scroll-reveal content only when JS can reveal it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-fg px-4 py-3 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <PersonJsonLd />
        <RevealObserver />
        <MotionProvider>
          <Header />
          <main id="main" className="overflow-x-clip">
            {children}
          </main>
          <WhatsAppButton />
        </MotionProvider>
      </body>
    </html>
  );
}
