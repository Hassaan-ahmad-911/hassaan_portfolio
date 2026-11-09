# Hassaan Ahmad — Portfolio

Personal portfolio for a full stack developer (Django · Next.js · Flutter · AI).
Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** and **Framer Motion**.

- Monochrome "cross-section" design: every project is shown as a stack of layers (interface → logic → data)
- Load-in sequence, scroll reveals, magnetic buttons, cursor spotlight on cards, animated project filter
- Respects `prefers-reduced-motion`, keyboard accessible, WCAG AA contrast
- SEO: metadata, generated Open Graph image, Person JSON-LD, sitemap and robots.txt

---

## 1. Run it locally

You need **Node.js 20.9 or newer**.

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run build`     | Production build                    |
| `npm run start`     | Serve the production build          |
| `npm run typecheck` | Type-check without building         |

### Environment variables (`.env.local`)

| Variable                   | Required | What it's for                                                                                         |
| -------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_FORMSPREE_ID` | Yes, for the contact form | Your Formspree form ID. Create a free form at [formspree.io](https://formspree.io); the ID is the part after `/f/` in its endpoint. |
| `NEXT_PUBLIC_SITE_URL`     | Recommended | Your public URL, e.g. `https://hassanahmad.vercel.app`. Used for SEO, Open Graph and the sitemap. On Vercel it falls back to the production URL automatically. |

Without a Formspree ID the form still validates, but tells the visitor it isn't connected yet (and shows your email if you've added one).

---

## 2. Edit your content — `data/portfolio.ts`

**All text, links, skills, projects and image paths live in one file:** [`data/portfolio.ts`](data/portfolio.ts).
You never need to touch the components to update the site.

- Any field left as an empty string `""` is **hidden automatically** (e.g. no GitHub link → no GitHub button).
- Search the file for **`TODO`** to find everything that still needs your details.

### Before you deploy — fill these in

| Where in `portfolio.ts`  | Field                                                    |
| ------------------------ | -------------------------------------------------------- |
| `profile`                | `degree`, `university`, `city`                           |
| `contact`                | `email`, `github`, `linkedin`, `upwork`, `cv`            |
| `projects` → Kaleem      | `liveUrl`                                                |
| `projects` → mental health app | `name`, and the `links` (GitHub / demo video / APK) |
| `journey`                | the `when` years                                         |

**CV:** put your PDF at `public/cv.pdf` and set `cv: "/cv.pdf"`.

---

## 3. Add a project

1. Put the screenshot(s) in `public/projects/` — e.g. `public/projects/my-app.jpg`.
   - Website screenshots: landscape, ~1600px wide works well.
   - App screenshots: portrait phone screens (they're shown inside phone frames).
2. In `data/portfolio.ts`, copy one of the objects in the `projects` array and edit it:

```ts
{
  slug: "my-app",                 // URL becomes /work/my-app
  name: "My App",
  kind: "SaaS dashboard",
  status: "live",                 // "live" | "client" | "mobile"
  categories: ["web"],            // used by the filter: "web" | "mobile" | "ai"
  summary: "One or two sentences for the card.",
  tagline: "One line under the title on the detail page.",
  problem: { heading: "…", body: "…" },
  layers: [
    { label: "Interface", items: ["…"] },
    { label: "Logic", items: ["…"] },
    { label: "Data", items: ["…"] },
  ],
  stackNotes: { logic: "Shown on card hover", data: "Shown on card hover" },
  tags: ["Next.js", "Django"],     // chips on the card
  stack: ["Next.js", "Django", "PostgreSQL"],
  role: "Design & full build",
  cover: { src: "/projects/my-app.jpg", alt: "Describe what the screenshot shows" },
  gallery: [],                    // extra screenshots (used for phone-style projects)
  galleryStyle: "browser",        // "browser" for websites, "phone" for mobile apps
  liveUrl: "https://…",           // "" hides the Visit button
  links: [{ label: "GitHub", href: "https://github.com/…" }],
}
```

3. That's it — the card, the filter, the detail page (`/work/my-app`), the sitemap and the "Next case study" link all update automatically.

**Always write a real `alt` text** describing the screenshot — it's read by screen readers and search engines.

### Change your photo

Replace `public/me.jpg` (keep the name, or update `profile.photo.src`). A square or portrait photo around 1000px works best.

---

## 4. Deploy to Vercel

1. Push the project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repository. No settings need changing — Vercel detects Next.js.
3. Under **Environment Variables**, add `NEXT_PUBLIC_FORMSPREE_ID` (and `NEXT_PUBLIC_SITE_URL` once you know your domain).
4. Click **Deploy**.

Every push to `main` redeploys automatically. To use a custom domain, add it under **Project → Settings → Domains** and update `NEXT_PUBLIC_SITE_URL`.

---

## Project structure

```
app/
  layout.tsx            fonts, metadata, Person JSON-LD, header
  page.tsx              home page (sections in order)
  work/[slug]/page.tsx  project case-study pages (static, one per project)
  opengraph-image.tsx   generated social preview image
  sitemap.ts, robots.ts, icon.svg, not-found.tsx
  globals.css           design tokens (colors, fonts, easing) + animations
components/
  Hero, Ticker, About, Skills, Work, ProjectCard, Services, Journey, Contact, ContactForm, Footer, Header
  RevealObserver.tsx    one shared observer that powers all scroll reveals
  MotionProvider.tsx    Framer Motion (lazy-loaded) + reduced-motion setting
  ui/                   buttons, icons, chips, reveal wrapper, titles
data/portfolio.ts       ← all content
lib/site.ts             site URL, class-name helper, easing curves
public/                 me.jpg, projects/*.jpg
```

## Design notes

- **Palette:** near-black `#0A0A0B` → charcoal greys → white. No accent colour; white is the highlight. All text colours pass WCAG AA on every background.
- **Type:** Geist (headings/body), Geist Mono (labels, "drawing notes"), Instrument Serif italic (one emphasised phrase per heading).
- **Motion:** expo-out easing, transform/opacity only. Entrance and scroll reveals are CSS (they paint immediately and cost no JavaScript); Framer Motion handles the interactive parts — magnetic buttons, card spotlight, project filter layout animation, scroll progress, timeline line, mobile menu and form states — and is lazy-loaded.
- **Reduced motion:** with the OS setting on, everything appears in its final state without movement.
