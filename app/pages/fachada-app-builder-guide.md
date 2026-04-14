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

Create a new app in the `app/` folder:

```bash
mkdir -p app/{your-app-name}
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
      description: "Short teaser shown on role cards (if multi-role)",
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
  ],
  primaryRole: "engineer", // ID of the default role
  analytics: {
    plausibleDomain: "your-domain.dev",
  },
};
```
