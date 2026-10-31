/**
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE.
 *  Edit this file to update the portfolio — no component changes needed.
 *
 *  Empty strings ("") are hidden on the site automatically, so you can
 *  fill fields in whenever you have them. Search for "TODO" to find
 *  everything that still needs your details.
 * ─────────────────────────────────────────────────────────────
 */

/* ---------- Types ---------- */

export type ProjectCategory = "web" | "mobile" | "ai";

export type ProjectStatus = "live" | "client" | "mobile";

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  /** Used in the URL: /work/<slug> */
  slug: string;
  name: string;
  /** Short label shown next to the status badge, e.g. "E-commerce" */
  kind: string;
  status: ProjectStatus;
  /** Filters on the work grid */
  categories: ProjectCategory[];
  /** One or two sentences for the card */
  summary: string;
  /** One-line hook under the title on the detail page */
  tagline: string;
  /** "The problem" paragraph on the detail page */
  problem: { heading: string; body: string };
  /** Features grouped by layer — the site's "cross-section" idea */
  layers: { label: string; items: string[] }[];
  /** Short notes revealed when a card is hovered ("exploded stack") */
  stackNotes: { logic: string; data: string };
  tags: string[];
  stack: string[];
  role: string;
  /** Main image. Website screenshots are landscape; app screenshots are portrait. */
  cover: { src: string; alt: string };
  /** Extra screenshots for the detail page. Use "phone" for app screens. */
  gallery: { src: string; alt: string }[];
  galleryStyle: "browser" | "phone";
  /** The primary "Visit" link. Leave href empty to hide the button. */
  liveUrl: string;
  /** Extra links (GitHub, demo video, APK…). Empty hrefs are hidden. */
  links: ProjectLink[];
};

/* ---------- Profile ---------- */

export const profile = {
  name: "Hassan Ahmad",
  initials: "HA",
  role: "Full Stack Developer",
  /** Shown under your name in the hero */
  pitch:
    "I build complete products, end to end — Django backends, modern web frontends and Flutter apps, with AI wired in where it earns its place.",
  /** The word(s) from the pitch to set in italic serif */
  pitchEmphasis: "end to end",
  available: true,
  availabilityLabel: "Available for work",
  openTo: "Freelance & full-time",
  experience: "3+ years",
  cgpa: "3.5",
  cgpaScale: "4.0",
  degree: "BS Computer Science",
  university: "COMSATS University Islamabad, Sahiwal Campus",
  city: "Okara, Pakistan",
  photo: {
    src: "/me.jpg",
    alt: "Hassan Ahmad in a black blazer and white shirt, seated in an office",
  },
  bio: "I'm a full stack developer who takes products from database schema to the last hover state. Most of my backend work is Python and Django; on the front I build fast, accessible web interfaces, and on mobile I ship with Flutter. Lately I've been adding AI that does real work — retrieval-augmented chatbots and computer vision.",
  aboutHeading: { lead: "I care about the layer you see", emphasis: "and", tail: "the ones you don't." },
  replyTime: "Usually replies within a day",
};

/* ---------- Contact & social links ---------- */
// Leave any value empty ("") to hide it on the site.

export const contact = {
  email: "hassaanahmad911@gmail.com",
  github: "https://github.com/Hassaan-ahmad-911",
  linkedin: "https://www.linkedin.com/in/hassaan-ahmad-4b12b723a",
  upwork: "", // TODO: https://www.upwork.com/freelancers/…
  cv: "", // TODO: link to your CV (e.g. a PDF in /public/cv.pdf → "/cv.pdf")
};

/* ---------- Navigation ---------- */

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Skills", href: "/skills" },
  { label: "Services", href: "/services" },
  { label: "Journey", href: "/journey" },
  { label: "Contact", href: "/contact" },
];

/* ---------- Page headers (one per navigation page) ---------- */
// lead + emphasis form the big title; emphasis is set in italic serif.

export type PageKey = "work" | "skills" | "services" | "journey" | "contact";

export const pages: Record<
  PageKey,
  { label: string; lead: string; emphasis: string; intro: string; description: string }
> = {
  work: {
    label: "Work",
    lead: "Selected",
    emphasis: "work.",
    intro: "Two live demos, a real client site and an AI-powered mobile app — each one shown layer by layer.",
    description: "Case studies: KAMMER e-commerce, HOT BUN restaurant ordering, Kaleem Overseas (Django) and a Flutter mental health app with AI.",
  },
  skills: {
    label: "Skills",
    lead: "The stack,",
    emphasis: "in cross-section.",
    intro: "Five layers I work across, from the interface down to the data and AI — and the projects that use each one.",
    description: "Frontend, mobile, backend, AI and tooling skills: Next.js, React, Flutter, Python, Django, RAG and computer vision.",
  },
  services: {
    label: "Services",
    lead: "What I can build",
    emphasis: "for you.",
    intro: "From a fast business website to a full product with a mobile app and AI features — designed, built and deployed by one developer.",
    description: "Full stack web apps, Flutter mobile apps, AI features like RAG chatbots and computer vision, and business websites.",
  },
  journey: {
    label: "Journey",
    lead: "From first commit",
    emphasis: "to client work.",
    intro: "Three-plus years of building — from university projects to live sites for real clients.",
    description: "Education and project timeline: BS Computer Science at COMSATS, client work and shipped projects.",
  },
  contact: {
    label: "Contact",
    lead: "Let's build",
    emphasis: "something.",
    intro: "Tell me what you're building and when you need it. I usually reply within a day.",
    description: "Hire Hassan Ahmad for freelance or full-time work — web apps, Flutter apps and AI features.",
  },
};

/* ---------- Skills (the five-layer "stack") ---------- */

export const skills = [
  {
    layer: "L1",
    group: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML & CSS"],
    usedIn: ["kammer", "hot-bun"],
  },
  {
    layer: "L2",
    group: "Mobile",
    items: ["Flutter", "Dart", "Camera & on-device ML"],
    usedIn: ["mental-health-app"],
  },
  {
    layer: "L3",
    group: "Backend",
    items: ["Python", "Django", "REST APIs", "SQL databases", "Auth & admin"],
    usedIn: ["kaleem-overseas"],
  },
  {
    layer: "L4",
    group: "AI",
    items: ["RAG chatbots", "LLM APIs", "Embeddings", "Computer vision", "Emotion detection"],
    usedIn: ["mental-health-app"],
  },
  {
    layer: "L5",
    group: "Tools",
    items: ["Git & GitHub", "Vercel", "VS Code", "Figma", "Postman"],
    usedIn: [],
  },
];

/** The scrolling strip under the hero */
export const ticker = [
  "Python",
  "Django",
  "Next.js",
  "TypeScript",
  "Flutter",
  "RAG",
  "Computer Vision",
  "Tailwind",
  "Framer Motion",
  "REST APIs",
];

/* ---------- Projects ---------- */
// Add a project by copying one object below. Put its images in /public/projects/.

export const projects: Project[] = [
  {
    slug: "kammer",
    name: "KAMMER",
    kind: "E-commerce",
    status: "live",
    categories: ["web"],
    summary:
      "Clothing store with search, size & price filters, a bag drawer with promo codes, test-card checkout, and a staff dashboard for stock and orders.",
    tagline: "A clothing store that reads like a lookbook but shops like a real store — with a staff dashboard behind it.",
    problem: {
      heading: "Small labels want the feel of a magazine, and the checkout of a real shop.",
      body: "Most small-brand stores pick one: a beautiful lookbook that's hard to buy from, or a generic template that sells but says nothing about the clothes. KAMMER puts both in one build — plus the back office a small team needs to keep stock and orders in sync. The brand is fictional; the shop works end to end.",
    },
    layers: [
      {
        label: "Interface",
        items: [
          "Editorial hero, lookbook carousel and \"shop the look\"",
          "Search overlay with recent and popular searches",
          "Size and price filters, sort, and an \"only my size\" view",
          "Per-product fit notes and size guide",
          "Bag drawer with free-shipping progress",
        ],
      },
      {
        label: "Logic",
        items: [
          "Promo codes and shipping calculated in the bag",
          "Test-card checkout with card validation",
          "Stock-aware cart: sold-out sizes block checkout",
          "Schema-validated forms with Zod",
          "Bag and wishlist state with Zustand",
        ],
      },
      {
        label: "Data & admin",
        items: [
          "Staff sign-in with demo credentials",
          "Revenue chart, average order value, recent orders",
          "Manage products, stock and orders",
          "Changes show in the shop straight away",
          "Runs fully in the browser — no data leaves it",
        ],
      },
    ],
    stackNotes: { logic: "App Router · Zustand · Zod", data: "Browser storage · demo admin" },
    tags: ["Next.js", "TypeScript", "Zustand", "Zod"],
    stack: ["Next.js App Router", "TypeScript", "Zustand", "Zod", "Browser storage", "Vercel"],
    role: "Design & full build",
    cover: {
      src: "/projects/kammer.jpg",
      alt: "KAMMER homepage with the headline Clothes worth keeping and a grid of clothing photos",
    },
    gallery: [],
    galleryStyle: "browser",
    liveUrl: "https://kammer-two.vercel.app/",
    links: [],
  },
  {
    slug: "hot-bun",
    name: "HOT BUN",
    kind: "Restaurant ordering",
    status: "live",
    categories: ["web"],
    summary: "Pickup & delivery ordering, live order status, booth booking and a staff dashboard.",
    tagline: "Direct ordering for a smash-burger joint — no third-party delivery app in the middle.",
    problem: {
      heading: "Delivery apps take a cut of every order, and the restaurant loses the customer.",
      body: "HOT BUN lets a restaurant take orders and bookings on its own site: customers order for pickup or delivery, watch the order move through the kitchen, and book a booth — while staff see orders and bookings in one dashboard. The restaurant is fictional; payments run in test mode.",
    },
    layers: [
      {
        label: "Interface",
        items: [
          "Menu with categories, search and dietary filters",
          "Pickup or delivery ordering with fees shown up front",
          "Booth booking: date, party size and seating choice",
          "Intro sequence and a bold, sticker-style visual system",
        ],
      },
      {
        label: "Logic",
        items: [
          "Order tracking: Received → On the grill → Ready",
          "Test-mode card checkout with validation",
          "Booking codes and a downloadable calendar invite",
          "Schema-validated forms with Zod",
        ],
      },
      {
        label: "Data & admin",
        items: [
          "Staff dashboard: orders and revenue per hour",
          "Tonight's bookings and the latest orders",
          "One-click reset of the demo data",
        ],
      },
    ],
    stackNotes: { logic: "Cart · order status · bookings", data: "Browser storage · staff view" },
    tags: ["Next.js", "TypeScript", "Zod"],
    stack: ["Next.js App Router", "TypeScript", "Zustand", "Zod", "Vercel"],
    role: "Design & full build",
    cover: {
      src: "/projects/hotbun.jpg",
      alt: "HOT BUN homepage with the headline Smashed. Stacked. Sauced. next to a double cheeseburger",
    },
    gallery: [],
    galleryStyle: "browser",
    liveUrl: "https://hot-bun.vercel.app/",
    links: [],
  },
  {
    slug: "kaleem-overseas",
    name: "Kaleem Overseas Consultants",
    kind: "Visa consultancy",
    status: "client",
    categories: ["web"],
    summary:
      "Live site for a real visa consultancy: visa services, tour packages, client stories, appointment booking and WhatsApp contact — built with Python & Django.",
    tagline: "A real client's front door — built to turn visitors into booked appointments.",
    problem: {
      heading: "A consultancy's clients decide in minutes whether to trust them.",
      body: "Kaleem Overseas Consultants needed a site that explains their visa and travel services clearly, shows they're a real, reachable office, and makes booking an appointment the obvious next step. I built and deployed it with Python and Django.",
    },
    layers: [
      {
        label: "Interface",
        items: [
          "Hero with clear calls to action: Book Appointment and Our Services",
          "Pages for About, Services, Visa, Tour Packages, Stories and Contact",
          "Contact bar with phone, email and both office locations",
          "Floating WhatsApp button and social links",
        ],
      },
      // TODO: add backend details you want to highlight (forms, admin, database…)
      {
        label: "Logic",
        items: ["Server-rendered Django views and templates", "Page routing for every service and visa type"],
      },
      {
        label: "Deploy",
        items: ["Deployed live and in use by the client"],
      },
    ],
    stackNotes: { logic: "Django views · templates", data: "Deployed for a real client" },
    tags: ["Python", "Django"],
    stack: ["Python", "Django", "HTML & CSS", "JavaScript"],
    role: "Full build & deployment",
    cover: {
      src: "/projects/kaleem.jpg",
      alt: "Kaleem Overseas Consultants homepage with the headline Your Dream, Our Guidance and a Book Appointment button",
    },
    gallery: [],
    galleryStyle: "browser",
    liveUrl: "", // TODO: the live Kaleem Overseas URL
    links: [],
  },
  {
    slug: "mental-health-app",
    name: "Mental health app", // TODO: replace with the app's name
    kind: "Mental health",
    status: "mobile",
    categories: ["mobile", "ai"],
    summary:
      "Flutter app with a RAG-based AI chat, facial emotion detection, mood logging with streaks, guided practices, a journal and mood insights — in light and dark themes.",
    tagline: "A calm place to check in with your mood, talk things through, and spot patterns over time.",
    problem: {
      heading: "Most mood apps log feelings. Few help you understand them.",
      body: "This app pairs everyday check-ins with two AI features: a support chatbot that answers from a knowledge base using retrieval-augmented generation, and emotion detection that reads facial expressions through the camera. Insights then turn the log into patterns you can actually see.",
    },
    layers: [
      {
        label: "Interface",
        items: [
          "Home check-in: \"How are you feeling today?\" with one-tap mood logging",
          "Five-tab navigation: Home, Mood, AI Chat, Journal, Settings",
          "Light and dark themes",
          "Suggested guided practices, like a 12-minute sleep wind-down",
        ],
      },
      {
        label: "Logic",
        items: [
          "Day streaks and calm-minute tracking",
          "Insights by week, month and 3 months",
          "Mood chart and most-logged moods",
          "Journal entries",
        ],
      },
      {
        label: "AI",
        items: ["RAG-based support chatbot", "Emotion detection through facial recognition"],
      },
    ],
    stackNotes: { logic: "Flutter · camera pipeline", data: "RAG retrieval · emotion model" },
    tags: ["Flutter", "RAG", "Computer vision"],
    stack: ["Flutter", "Dart", "RAG", "LLM API", "Computer vision"],
    role: "Design & full build",
    cover: {
      src: "/projects/app-1.jpg",
      alt: "App home screen in dark theme asking How are you feeling today, with a Log mood button",
    },
    gallery: [
      { src: "/projects/app-2.jpg", alt: "App home screen in light theme with streak, calm minutes and a suggested sleep wind-down" },
      { src: "/projects/app-1.jpg", alt: "App home screen in dark theme asking How are you feeling today" },
      { src: "/projects/app-3.jpg", alt: "Insights screen with a three-month mood chart and the most logged moods" },
    ],
    galleryStyle: "phone",
    liveUrl: "",
    links: [
      { label: "GitHub", href: "" }, // TODO
      { label: "Demo video", href: "" }, // TODO
      { label: "Download APK", href: "" }, // TODO
    ],
  },
];

/* ---------- Services ---------- */

export const services = [
  {
    title: "Full stack web apps",
    body: "Dashboards, stores, booking and ordering systems — database, API and interface built as one piece.",
    meta: ["Django · Next.js", "Auth · Admin · Payments"],
  },
  {
    title: "Flutter mobile apps",
    body: "One codebase for Android and iOS, with camera, offline storage and your backend connected.",
    meta: ["Flutter · Dart", "Android · iOS"],
  },
  {
    title: "AI features",
    body: "Chatbots that answer from your own documents, and computer vision that reads faces, objects or scenes.",
    meta: ["RAG · Embeddings", "Computer vision"],
  },
  {
    title: "Business websites",
    body: "Fast, search-friendly sites with enquiry forms and an admin your team can update without a developer.",
    meta: ["SEO · Forms · CMS", "Deployment"],
  },
];

/* ---------- Journey (timeline) ---------- */
// Items with an empty title are hidden.

export const journey = [
  {
    when: "", // TODO: year you started
    tag: "Education",
    title: profile.degree && profile.university ? `Started ${profile.degree} at ${profile.university}` : "",
    body: "",
  },
  {
    when: "", // TODO: year
    tag: "Client project",
    title: "Kaleem Overseas Consultants",
    body: "First real client — a Django site built and deployed live.",
  },
  {
    when: "", // TODO: year
    tag: "Mobile + AI",
    title: "Mental health app — Flutter, RAG, computer vision",
    body: "",
  },
  {
    when: "2026",
    tag: "Web",
    title: "KAMMER and HOT BUN shipped on Vercel",
    body: "",
  },
  {
    when: "Now",
    tag: "",
    title: `CGPA ${profile.cgpa} — open to freelance & full-time`,
    body: "",
    current: true,
  },
];

/* ---------- Contact form options ---------- */

export const contactNeeds = ["Web app", "Mobile app", "AI feature", "Website", "Full-time role"];

/* ---------- SEO ---------- */

export const seo = {
  title: "Hassan Ahmad — Full Stack Developer",
  description:
    "Full stack developer with 3+ years of experience building Django backends, Next.js frontends, Flutter apps and AI features like RAG chatbots and computer vision. Available for freelance and full-time work.",
  keywords: [
    "Hassan Ahmad",
    "full stack developer",
    "Django developer",
    "Next.js developer",
    "Flutter developer",
    "RAG chatbot",
    "computer vision",
    "freelance developer",
  ],
};
