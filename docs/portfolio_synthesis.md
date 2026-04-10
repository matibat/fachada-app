# Portfolio Website — Project Synthesis

## Overview

A hand-coded personal portfolio website for a software engineer based in Montevideo, Uruguay. The site serves two purposes:

1. **Personal brand** — showcase who you are, what you do, and your projects.
2. **Agency template** — the codebase becomes a reusable base to fork and sell to future clients.

---

## Stack

| Layer         | Choice                                                                            |
| ------------- | --------------------------------------------------------------------------------- |
| Framework     | Astro 5                                                                           |
| UI Components | React (via Astro integration, for interactive islands only)                       |
| Language      | TypeScript (strict mode)                                                          |
| Styling       | Tailwind CSS v4                                                                   |
| Content       | MDX files in `/src/content` — Astro Content Collections (no CMS, managed in code) |
| Animations    | Framer Motion (used only inside React islands)                                    |
| Deployment    | Firebase Hosting                                                                  |
| Analytics     | Plausible (privacy-friendly, no cookie banner needed)                             |
| AI Tooling    | GitHub Copilot                                                                    |

### Why Astro over Next.js

- Ships **zero JavaScript by default** — JS only loads for explicitly interactive components ("islands")
- Purpose-built for content-driven, mostly-static sites — no server setup, no API routes needed
- Built-in Content Collections with type-safe frontmatter (no extra libraries)
- Built-in MDX support, sitemap generation, and image optimization
- Simpler mental model: `.astro` files are just HTML + optional React islands
- Easier to fork and hand off to clients unfamiliar with Next.js conventions

---

## Project Structure

```
my-portfolio/
├── src/
│   ├── content/
│   │   ├── config.ts           # Content Collections schema (type-safe frontmatter)
│   │   ├── projects/           # One .mdx file per project
│   │   └── blog/               # One .mdx file per post
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Root layout: <head>, fonts, global meta
│   │   └── PostLayout.astro    # Layout for blog posts and case studies
│   ├── pages/
│   │   ├── index.astro         # Homepage (all main sections)
│   │   ├── about.astro
│   │   ├── projects/
│   │   │   ├── index.astro     # Projects index
│   │   │   └── [slug].astro    # Individual case study (dynamic route)
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog index
│   │   │   └── [slug].astro    # Individual post
│   │   ├── sitemap.xml.ts      # Auto-generates /sitemap.xml
│   │   └── robots.txt.ts       # Auto-generates /robots.txt
│   ├── components/
│   │   ├── ui/                 # Reusable atoms: Button, Badge, Card (.astro)
│   │   ├── sections/           # Page sections: Hero, About, ProjectCard (.astro)
│   │   └── islands/            # Interactive React components (contact form, theme toggle)
│   └── styles/
│       └── globals.css
├── public/
│   ├── images/
│   └── og-image.png
├── COPILOT.md                  # Copilot context instructions
└── astro.config.ts
```

### The Island Architecture

Most components are `.astro` files — they render to pure HTML at build time, zero JS shipped. The only React "islands" (components with `client:load` or `client:visible`) are things that genuinely need interactivity:

- Contact form
- Dark/light mode toggle
- Any animation that requires scroll detection

---

## Site Pages & Sections

### Homepage (`/`)

Single scrollable page containing:

- **Hero** — name, title, short tagline, CTA buttons (View Work / Contact)
- **About** — short bio, photo, personality
- **Skills** — tech stack displayed as badges
- **Projects** — 3–4 featured projects as cards
- **Experience** — timeline or list of roles
- **Testimonials** (optional, add later)
- **Contact** — form or mailto link + social links

### Projects (`/projects` + `/projects/[slug]`)

- Index: grid of all projects
- Case study: problem → solution → tech stack → outcome + links to live demo / GitHub

### Blog (`/blog` + `/blog/[slug]`)

- Even a few posts per month establishes topical authority and gets the site indexed
- Content lives as `.mdx` files — write in Markdown, renders as React

### About (`/about`)

- Extended bio, values, what you're looking for, downloadable CV

---

## Content Model (Astro Content Collections)

Defined once in `src/content/config.ts` using Astro's `defineCollection` + `z` (Zod) — fully type-safe, validated at build time.

### Project

```ts
const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    coverImage: z.string(),
  }),
});
```

### Blog Post

```ts
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
  }),
});
```

Astro validates frontmatter against these schemas at build time — a typo or missing field breaks the build immediately, not at runtime.

---

## SEO Strategy

### What Astro handles automatically

- **100% static HTML** output by default — crawlers get fully rendered pages, no JS needed
- Built-in **image optimization** via `<Image />` from `astro:assets` (WebP, lazy loading, correct sizing, no layout shift)
- Built-in **sitemap plugin** (`@astrojs/sitemap`) — add to `astro.config.ts`, done
- **Zero JS shipped** unless you explicitly add a client directive — fastest possible Lighthouse score

### What you implement

**Per-page metadata** — pass props to `BaseLayout.astro`:

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout
  title="Your Name — Software Engineer"
  description="Software engineer based in Montevideo..."
  ogImage="/og-image.png"
>
  <!-- page content -->
</BaseLayout>
```

`BaseLayout.astro` renders all `<meta>`, Open Graph, and Twitter Card tags in one place.

**Sitemap** — add `@astrojs/sitemap` to `astro.config.ts`, configure priority per route. Auto-generates `/sitemap.xml` at build time.

**robots.txt** — static file in `/public/robots.txt` or a `robots.txt.ts` endpoint.

**Schema Markup (JSON-LD)** — a reusable `<StructuredData />` Astro component that accepts a typed object and outputs `<script type="application/ld+json">`:

- `Person` schema on homepage (name, jobTitle, sameAs: GitHub + LinkedIn)
- `Article` schema on blog posts
- `BreadcrumbList` on project case studies

**Open Graph image** — a single `/public/og-image.png` (1200×630px) to start.

**Google Search Console** — verify site and submit sitemap on launch.

### Performance targets

- Lighthouse score: 100 across Performance, SEO, Accessibility, Best Practices
- Core Web Vitals: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms
- Use `loading="eager"` on hero image, `loading="lazy"` on everything else (Astro's `<Image />` handles this)
- Dark/light mode via Tailwind `dark:` classes + a minimal theme toggle island

---

## Accessibility & Other Details

- Semantic HTML throughout (`<main>`, `<article>`, `<section>`, `<nav>`, proper heading hierarchy)
- One `<h1>` per page only
- ARIA labels on interactive elements
- `rel="noopener noreferrer"` on all external links
- Custom `src/pages/404.astro` page
- Mobile-first responsive design
- Astro's `<Image />` handles `loading="lazy"` and explicit `width`/`height` automatically (prevents CLS)
- i18n-ready structure (even if launching in English only)

---

## GitHub Copilot Usage

Create a `COPILOT.md` at the project root with this context:

```
- Framework: Astro 5
- UI components: React (only for interactive islands with client: directives)
- Language: TypeScript strict mode
- Styling: Tailwind CSS v4
- Content: Astro Content Collections in /src/content — no CMS
- Schema defined in src/content/config.ts using Zod
- Default to .astro components — only use React when interactivity is required
- Follow WCAG 2.1 AA accessibility standards
- JSON-LD structured data via a reusable <StructuredData /> Astro component
- Deployment target: Firebase Hosting (fully static output)
```

Best used for:

- Zod schemas in `content/config.ts` (describe a content type, it writes the schema)
- `.astro` component boilerplate (frontmatter + template)
- Tailwind class composition (describe the layout in a comment, it fills classes)
- JSON-LD schema objects (comment the type, it generates the object)
- Repetitive page/section patterns (write one, extrapolate the rest)
- `sitemap` config in `astro.config.ts`
- Firebase Hosting config (`firebase.json`, `.firebaserc`)

---

## Agency Reuse Strategy

The personal site is built to be **forkable**. When taking on a client:

1. Fork the repo
2. Swap content in `/src/content` MDX files
3. Update design tokens in `tailwind.config.ts` (colors, fonts, spacing)
4. Update metadata defaults in `BaseLayout.astro` (brand name, domain, OG image)
5. Replace logo, favicon, and `/public/images`
6. Remove or add sections as needed in `src/pages/index.astro`
7. Update Firebase project target in `.firebaserc`

Components in `components/ui/` and `components/sections/` are client-agnostic from the start — no hardcoded personal data leaks into the component layer. All personal content lives only in MDX files and `BaseLayout.astro`.

---

## Deployment & Infrastructure

| Concern           | Solution                                                             |
| ----------------- | -------------------------------------------------------------------- |
| Hosting           | Firebase Hosting (free Spark plan)                                   |
| Build output      | `astro build` → static files in `/dist`                              |
| Deploy command    | `firebase deploy` (or via GitHub Actions CI)                         |
| Preview channels  | Firebase Hosting preview channels — one URL per branch/PR            |
| Domain            | Connect custom domain in Firebase Hosting console                    |
| HTTPS             | Automatic on Firebase Hosting                                        |
| CDN               | Firebase global CDN (included)                                       |
| Analytics         | Plausible (self-hosted or cloud, privacy-friendly, no cookie banner) |
| Uptime monitoring | UptimeRobot free tier                                                |

### Firebase config files

Two files needed at the project root:

**`firebase.json`**

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/404.html" }]
  }
}
```

**`.firebaserc`**

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### CI/CD with GitHub Actions

On every push to `main`: build Astro → deploy to Firebase live channel.
On every PR: build Astro → deploy to Firebase preview channel → post URL as PR comment.

---

## Launch Checklist

- [ ] `astro build` produces clean `/dist` output with no errors
- [ ] Firebase Hosting connected, custom domain configured, HTTPS active
- [ ] `www` → apex (or vice versa) redirect configured consistently
- [ ] GitHub Actions CI/CD working — preview channel on PR, live deploy on `main`
- [ ] Google Search Console verified, sitemap submitted (`/sitemap.xml`)
- [ ] Lighthouse audit: all scores 100 (run on Firebase preview URL)
- [ ] Core Web Vitals passing on mobile and desktop (PageSpeed Insights)
- [ ] Open Graph image renders correctly (test with [opengraph.xyz](https://www.opengraph.xyz))
- [ ] All links working, no broken hrefs
- [ ] 404 page in place and Firebase rewrite rule pointing to it
- [ ] Contact form tested end-to-end
- [ ] Analytics (Plausible) receiving data
- [ ] Schema markup validated with Google Rich Results Test
- [ ] At least 2–3 blog posts published before launch (for indexing)
- [ ] CV/resume PDF linked or downloadable
