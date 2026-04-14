---
title: "Fachada App Builder Guide"
description: "Step-by-step technical instructions for creating and deploying a new Fachada app instance."
apps: ["default-fachada"]
path: "/resources/app-builder-guide"
downloadFilename: "fachada-app-builder-guide.md"
backLink:
  href: "/resources/asset-manual"
  label: "Asset Manual"
nextLink:
  href: "/resources/theme-configuration"
  label: "Theme Configuration"
---

# Fachada App Builder Guide

**Purpose**: Step-by-step technical instructions for creating and deploying a new Fachada app instance.

---

## Prerequisites

Ensure Fachada is installed and running:

```bash
# Install dependencies
make install

# Verify the setup
make test
```

See [SETUP-SUMMARY.md](./SETUP-SUMMARY.md) for complete setup instructions.

---

## Part 1: Gather Assets

Before coding, collect all required assets using [Fachada Asset Manual](./fachada-asset-manual.md).

**Minimum set**:

- Brand metadata (name, URL, social links)
- 1 professional role with bio and skills
- 3 project case studies with images
- OG image (1200×630)
- Favicons

---

## Part 2: Create the App Directory

Create a new app in the `apps/` folder:

```bash
mkdir -p apps/{your-app-name}
mkdir -p src/profiles/{your-app-name}
```

Replace `{your-app-name}` with a slug (e.g., `jane-smith`, `acme-studio`).

---

## Part 3: Create Site Configuration

Create `src/profiles/{your-app-name}/site.config.ts`:

```typescript
import type { SiteConfig } from "../../types/profile.types";

export const siteConfig: SiteConfig = {
  name: "Your Name",
  title: "Your Name — Your Role",
  description: "Your professional tagline or description",
  author: "Your Name",
  url: "https://your-domain.dev",
  ogImage: "/og-image.png",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername", // leave empty if not using
    email: "your@email.dev",
  },
  location: {
    city: "Your City",
    country: "Your Country",
  },
  roles: [
    {
      id: "engineer",
      title: "Software Engineer",
      specialties: ["TypeScript", "React", "WebGL"],
      featured: true,
      description: "Short teaser shown on role card (if multi-role)",
      about: {
        paragraphs: [
          "Your first bio paragraph.",
          "Your second bio paragraph.",
          "Your third bio paragraph.",
        ],
      },
      skills: [
        {
          name: "Languages",
          skills: ["TypeScript", "JavaScript", "Python"],
        },
        {
          name: "Frontend",
          skills: ["React", "Astro", "CSS"],
        },
      ],
    },
    // Add additional roles here if using multi-role profile
  ],
  primaryRole: "engineer", // ID of the default role
  analytics: {
    plausibleDomain: "your-domain.dev",
  },
};
```

---

## Part 4: Create Profile Configuration

Create `src/profiles/{your-app-name}/profile.config.ts`:

```typescript
import type { ProfileConfig } from "../../types/profile.types";

export const profileConfig: ProfileConfig = {
  theme: {
    style: "minimalista", // minimalista | modern-tech | profesional | vaporwave
    defaultMode: "system", // light | dark | system
    enableStyleSwitcher: true, // show/hide theme selector
    enableModeToggle: true, // show/hide light/dark toggle
  },
  about: {
    paragraphs: [
      "First bio paragraph.",
      "Second bio paragraph.",
      "Third bio paragraph.",
    ],
  },
  skills: [
    {
      name: "Category 1",
      skills: ["Skill A", "Skill B", "Skill C"],
    },
    {
      name: "Category 2",
      skills: ["Skill D", "Skill E", "Skill F"],
    },
  ],
  sections: [
    { id: "hero", enabled: true, order: 1 },
    { id: "about", enabled: true, order: 2 },
    { id: "skills", enabled: true, order: 3 },
    {
      id: "projects",
      enabled: true,
      order: 4,
      requiresContent: "projects",
    },
    { id: "contact", enabled: true, order: 5 },
  ],
  contactMessage: "I'd love to hear about your project. Reach out!",
};
```

---

## Part 5: Create App Config

Create `apps/{your-app-name}/app.config.ts`:

```typescript
import { siteConfig } from "../../src/profiles/{your-app-name}/site.config";
import { profileConfig } from "../../src/profiles/{your-app-name}/profile.config";
import type { AppConfig } from "../../src/types/app.types";

export const appConfig: AppConfig = {
  seo: siteConfig,
  theme: profileConfig.theme,
  themes: {
    globals: ["minimalista", "modern-tech", "profesional", "vaporwave"],
    default: profileConfig.theme.style,
  },
  assets: {
    ogImage: siteConfig.ogImage,
  },
  page: {
    sections: profileConfig.sections.map((s) => ({
      ...s,
      widgets: [],
    })),
  },
};
```

---

## Part 6: Register the App

No repository RC is required. Apps are auto-discovered from `apps/`. The active app is chosen by `APP` → first discovered app → single-app at `app/app.config.ts`.

---

## Part 7: Add Content

### Projects

Create project files in `src/content/projects/` with this frontmatter:

```markdown
---
title: "Project Title"
date: "2026-03-15"
tags: ["TypeScript", "React", "Node.js"]
slug: "project-slug"
images:
  - "/images/project-slug-hero.webp"
  - "/images/project-slug-detail.webp"
---

## Challenge

Describe the problem you solved...

## Approach

Explain your solution...

## Impact

- Metric 1: X% improvement
- Metric 2: Live at [URL]
- GitHub: [link]

## Tech Stack

- Frontend: React, TypeScript
- Backend: Node.js, PostgreSQL
- Deployment: Vercel
```

Create at least 3 project files.

### Blog Posts (Optional)

Create blog files in `src/content/blog/` using the same frontmatter structure.

---

## Part 8: Add Images & Assets

### Directory Structure

```
public/
├── og-image.png              # 1200×630, your OG image
├── favicon.ico               # 32×32
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png      # 180×180
└── images/
    ├── profile.jpg           # (optional) profile photo
    ├── project-slug-hero.webp
    ├── project-slug-detail.webp
    └── ...
```

**Copy your assets:**

```bash
cp {your-assets}/og-image.png public/
cp {your-assets}/favicon* public/
cp {your-assets}/images/* public/images/
```

---

## Part 9: Verify the Build

Develop locally:

```bash
APP={your-app-name} yarn dev
```

Open `http://localhost:4321` and verify all content displays correctly.

### Sanity Checks

- [ ] All sections render (hero, about, skills, projects, contact)
- [ ] Theme switcher works (if enabled)
- [ ] Light/dark toggle works (if enabled)
- [ ] All project images load
- [ ] Social links work
- [ ] Contact email link opens correctly
- [ ] No TypeScript errors

---

## Part 10: Build for Production

Run the full build:

```bash
APP={your-app-name} yarn build
```

Verify output:

```bash
# Check for errors
echo $?  # should be 0

# Verify dist/ was created
ls -la dist/
```

---

## Part 11: Run Tests

Ensure all tests pass:

```bash
make test
```

Expected output:

```
✓ 15+ tests passing
✓ No TypeScript errors
```

---

## Part 12: Deploy

### Firebase Hosting

```bash
# Setup (first time only)
firebase init hosting

# Deploy
APP={your-app-name} yarn build
firebase deploy --only hosting
```

### Alternative Platforms

**Vercel**:

```bash
vercel deploy
```

**Netlify**:

```bash
netlify deploy --prod --dir=dist
```

See [SETUP-SUMMARY.md](./SETUP-SUMMARY.md) for detailed deployment steps.

---

## Part 13: Post-Launch

Once deployed:

1. **Verify URL**: Visit your production site
2. **Lighthouse audit**: Run Chrome DevTools Lighthouse (target 90+ all categories)
3. **Search Console**: Submit sitemap to Google
4. **Analytics**: Verify tracking code is firing
5. **Social**: Share OG preview on LinkedIn, Twitter, etc.

See [PRE-LAUNCH-CHECKLIST.md](./PRE-LAUNCH-CHECKLIST.md) for the full pre-launch checklist.

---

## Troubleshooting

### App not building

```bash
# Clear cache
rm -rf .astro dist node_modules

# Reinstall
make install

# Retry
APP={your-app-name} yarn build
```

### Images not loading

- Verify images are in `public/images/`
- Check image paths in frontmatter (should be `/images/...`)
- Verify image filenames match exactly (case-sensitive!)

### TypeScript errors

```bash
# Check types
yarn tsc --noEmit

# Fix:
# - Match all type interfaces in src/types/profile.types.ts
# - Ensure site.config.ts and profile.config.ts export correct types
```

### Theme not applying

- Verify `theme.style` is one of: `minimalista`, `modern-tech`, `profesional`, `vaporwave`
- Check browser console for errors
- Clear localStorage: `window.localStorage.clear()`

---

## Next: Customization

Once your app is live, you can:

- Add custom **themes** (see [THEME-CONFIGURATION.md](./THEME-CONFIGURATION.md))
- Add new **sections** (modify `sections[]` in profile.config.ts)
- Add **role-specific content** (see [PROFILE-EXTENSIBILITY.md](./PROFILE-EXTENSIBILITY.md))
- Add **blog posts** to `src/content/blog/`

---

## Reference

- [Asset Manual](./fachada-asset-manual.md) — What assets you need
- [Theme Configuration](./THEME-CONFIGURATION.md) — Custom themes & colors
- [Profile Extensibility](./PROFILE-EXTENSIBILITY.md) — Multi-role setup
- [Pre-Launch Checklist](./PRE-LAUNCH-CHECKLIST.md) — Verification steps

**Need help?** Check the [main README.md](../README.md) or run `make help`.
