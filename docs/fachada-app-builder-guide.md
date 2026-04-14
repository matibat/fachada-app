# Fachada App Builder Guide

**Purpose**: End-to-end reference for creating a new Fachada app in the current architecture.

---

## Prerequisites

Ensure Fachada is installed and running:

```bash
yarn install
yarn test
```

You will need Node.js 22+ and Yarn 4+.

---

## Step 1: Create the App Directory

```bash
mkdir -p apps/your-app-name/blog
mkdir -p apps/your-app-name/pages
```

Replace `your-app-name` with a URL-safe slug (e.g., `jane-smith`, `acme-studio`).

---

## Step 2: Create `app.config.ts`

Create `apps/your-app-name/app.config.ts`:

```typescript
import type { AppConfig } from "@fachada/core";

export const appConfig: AppConfig = {
  seo: {
    site: "https://your-domain.dev",
    name: "Your Name",
    author: "Your Name",
    description: "Your professional tagline or bio summary.",
    socials: {
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      email: "your@email.dev",
    },
    roles: [
      {
        id: "engineer",
        title: "Software Engineer",
        specialties: ["TypeScript", "React", "Node.js"],
        featured: true,
      },
    ],
  },
  siteTree: {
    landing: {
      sections: [
        { id: "hero", enabled: true, order: 1 },
        { id: "about", enabled: true, order: 2 },
        { id: "skills", enabled: true, order: 3 },
        { id: "projects", enabled: true, order: 4 },
        { id: "contact", enabled: true, order: 5 },
      ],
    },
  },
};
```

**`seo` fields:**

| Field         | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `site`        | Canonical URL — used for sitemaps and OG tags                    |
| `name`        | Display name shown in the header and title                       |
| `author`      | Meta author tag                                                  |
| `description` | Default page description and OG description                      |
| `socials`     | Links for footer and contact section                             |
| `roles`       | Role definitions; the first `featured: true` role is the default |

**`siteTree.landing.sections`** — controls which sections render:

| `id`       | Widget                                 |
| ---------- | -------------------------------------- |
| `hero`     | Hero banner with name, role, and CTAs  |
| `about`    | About text from `profile.config.ts`    |
| `skills`   | Skills list from `profile.config.ts`   |
| `projects` | Pulls from `apps/your-app-name/pages/` |
| `contact`  | Contact message and social links       |

---

## Step 3: Create `site.config.ts`

Create `apps/your-app-name/site.config.ts`:

```typescript
import type { SiteConfig } from "@fachada/core";

export const siteConfig: SiteConfig = {
  site: "https://your-domain.dev",
  name: "Your Name",
  author: "Your Name",
  description: "Your professional tagline or description",
  socials: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    email: "your@email.dev",
  },
  roles: [
    {
      id: "engineer",
      title: "Software Engineer",
      specialties: ["TypeScript", "React"],
      featured: true,
    },
  ],
};
```

> If you define `seo` inline in `app.config.ts`, `site.config.ts` is optional.

---

## Step 4: Create `profile.config.ts`

Create `apps/your-app-name/profile.config.ts`:

```typescript
import type { ProfileConfig } from "@fachada/core";

export const profileConfig: ProfileConfig = {
  about: "Your professional bio. This appears in the About section.",
  skills: [
    {
      name: "Languages",
      skills: ["TypeScript", "JavaScript", "Python"],
    },
    {
      name: "Frontend",
      skills: ["React", "Astro", "Tailwind CSS"],
    },
    {
      name: "Backend",
      skills: ["Node.js", "PostgreSQL", "Redis"],
    },
  ],
  sections: [
    { id: "hero", enabled: true, order: 1 },
    { id: "about", enabled: true, order: 2 },
    { id: "skills", enabled: true, order: 3 },
    { id: "projects", enabled: true, order: 4 },
    { id: "contact", enabled: true, order: 5 },
  ],
  contactMessage: "I'd love to hear about your project. Reach out!",
  theme: {
    style: "minimalista", // minimalista | modern-tech | profesional | vaporwave
    defaultMode: "system", // light | dark | system
  },
};
```

---

## Step 5: Register the app (no RC required)

You generally do not need a repository RC file. Apps are automatically discovered from the `apps/` directory. The active app is chosen in priority order: `APP` env var → first discovered app → single-app at `app/app.config.ts`.

---

## Step 6: Add Content

### Blog Posts

Create `.md` files in `apps/your-app-name/blog/`:

```markdown
---
title: "My First Post"
description: "Post excerpt shown in listings."
date: 2026-04-13
tags: ["Development", "Tutorial"]
---

Your blog post content here...
```

### Pages

Create `.md` files in `apps/your-app-name/pages/` for the landing page `siteTree`:

```markdown
---
title: "Featured Project"
description: "Short description"
date: 2026-03-15
tags: ["TypeScript", "React"]
---

## Challenge

Describe the problem you solved...

## Approach

Explain your solution...

## Impact

- Metric 1: X% improvement
- Live at [URL]
```

---

## Step 7: Add Assets

Place static assets in `public/`:

```
public/
├── og-image.png              # 1200×630 — Open Graph image
├── favicon.ico               # 32×32
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png      # 180×180
└── images/
    └── ...
```

---

## Step 8: Run Locally

```bash
APP=your-app-name yarn dev
```

Open `http://localhost:4321`.

### Sanity Checks

- [ ] All sections render (hero, about, skills, projects, contact)
- [ ] Theme switcher and light/dark toggle work (if enabled in `profile.config.ts`)
- [ ] All images load
- [ ] Social links work
- [ ] No TypeScript errors (`yarn tsc --noEmit`)

---

## Step 9: Build for Production

```bash
APP=your-app-name yarn build
```

Verify output:

```bash
echo $?   # should be 0
ls -la dist/
```

---

## Step 10: Run Tests

```bash
yarn test
```

---

## How `@fachada/core` Provides Everything

There are no Astro files in the project root `src/`. The `fachadaIntegration()` registered in `astro.config.mjs` injects all routes, layouts, components, and widgets:

```js
// astro.config.mjs
import { fachadaIntegration } from "@fachada/core/astro";

export default defineConfig({
  integrations: [
    fachadaIntegration(),
    react(),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
  ],
});
```

> `fachadaIntegration` is imported from `@fachada/core/astro` (not the main barrel) to avoid triggering virtual module resolution at config load time.

Routes injected automatically:

- `/` — Landing page
- `/[...slug]` — Dynamic pages
- `/404` — Not found
- `/blog` — Blog index
- `/blog/[slug]` — Blog post
- `/projects` — Projects index
- `/projects/[slug]` — Project detail
- `/robots.txt`
- `/llm.txt`

---

## Troubleshooting

### App not building

```bash
# Clear cache and reinstall
rm -rf .astro dist node_modules
yarn install
APP=your-app-name yarn build
```

### Images not loading

- Verify images are in `public/images/`
- Image paths in markdown frontmatter should be `/images/filename.ext` (absolute from `public/`)
- File names are case-sensitive

### TypeScript errors

```bash
yarn tsc --noEmit
```

Common issues:

- `ProfileConfig.about` is a `string`, not an object with `paragraphs`
- Theme `style` must be one of: `minimalista`, `modern-tech`, `profesional`, `vaporwave`
- All imports should use `import type { X } from "@fachada/core"`

### Theme not applying

- Verify `theme.style` is one of the four valid values above
- Clear localStorage: `window.localStorage.clear()`
- Hard-reload the page

---

## Reference

- [Theme Configuration](./THEME-CONFIGURATION.md) — Custom themes & colors
- [APP-REFERENCE.md](./APP-REFERENCE.md) — Full AppConfig and ProfileConfig type reference
- [Main README](../README.md)
