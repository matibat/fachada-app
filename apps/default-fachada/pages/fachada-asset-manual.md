---
title: "Fachada App: Asset & Content Manual"
description: "Complete checklist of text, image, and branding assets needed before building a Fachada app."
apps: ["default-fachada"]
path: "/resources/asset-manual"
downloadFilename: "fachada-asset-manual.md"
backLink:
  href: "/resources"
  label: "Back to Resources"
nextLink:
  href: "/resources/app-builder-guide"
  label: "App Builder Guide"
---

# Fachada App: Asset & Content Manual

**Purpose**: Checklist of all text, image, and branding assets needed before building a new Fachada app instance.

---

## Brand Identity Assets

### Logo & Mark

- **Logo (full)**: SVG vector, dark and light variants
- **Logo mark** (icon/symbol only): SVG, square format, favicon-ready
- **Favicon set**:
  - `favicon.ico` (32×32)
  - `favicon-16x16.png`
  - `favicon-32x32.png`
  - `apple-touch-icon.png` (180×180)
  - SVG version for modern browsers

### Color Palette (hex values)

- `primary`: Main brand color (e.g., `#3B82F6`)
- `accent`: Secondary highlight (e.g., `#7C3AED`)
- `neutral-100`: Lightest neutral (e.g., `#F8FAFC`)
- `neutral-900`: Darkest neutral (e.g., `#111827`)
- `text`: Default text color (inherit from theme)
- All 4 theme palettes (minimalista, modern-tech, profesional, vaporwave)

### Typography

- **Heading font**: Name + weights required (e.g., "Inter 600, 700, 800")
- **UI font**: Name + weights (e.g., "Inter 400, 500, 600")
- **Monospace font** (optional): For code blocks (e.g., "Fira Code")

---

## Site Metadata

- **Site title**: ≤60 characters (e.g., "Jane Smith — Full-Stack Engineer")
- **Site description**: 150–160 characters (e.g., "Building performant web experiences with TypeScript, React, and Astro. Portfolio & case studies.")
- **Author name**: Legal or display name
- **Production URL**: Full domain (e.g., `https://janesmith.dev`)
- **Contact email**: Primary email address

---

## Social & URLs

- `social.github`: Full GitHub profile URL
- `social.linkedin`: Full LinkedIn profile URL
- `social.twitter`: Full Twitter/X profile URL (or empty)
- `social.email`: Contact email address (can match author email)
- `location.city`: City name (e.g., "San Francisco")
- `location.country`: Country name (e.g., "USA")

---

## Professional Roles

For each professional identity (required: at least 1):

### Single Role (Simple Portfolio)

- **Role ID**: Slug (e.g., `engineer`, `designer`)
- **Role title**: Display name (e.g., "Software Engineer")
- **Specialties**: List of 3–5 key skills (e.g., `["TypeScript", "React", "WebGL"]`)
- **Featured**: Boolean (shows in hero)
- **Description**: 1-line teaser for role cards (e.g., "Building fast web experiences")
- **About paragraphs**: 3 paragraphs
  - **Paragraph 1**: Professional summary (2–3 sentences)
  - **Paragraph 2**: Key work areas & approach (2–3 sentences)
  - **Paragraph 3**: Personal touch / call-to-action (2 sentences)
- **Skills categories**: List of skill categories
  - **Example category**: `{ name: "Frontend", skills: ["React", "TypeScript", "CSS"] }`
  - Provide 3–5 categories with 4–6 skills each

### Multi-Role (E.g., Engineer + Artist)

For each role, provide:

- Role ID, title, specialties, featured flag (same as above)
- **Role-specific description**: 1-line teaser
- **Role-specific about**: 3 paragraphs (unique to that role)
- **Role-specific skills**: Categories and lists unique to that role
- **Optional role image**: Avatar or role-related graphic (square, 600×600 px recommended)

---

## Homepage / Hero Content

- **Hero headline**: 1 short, compelling sentence (e.g., "Productive engineering. Thoughtful design.")
- **Hero subheading**: 1–2 lines (e.g., "Full-stack TypeScript specialist. Building resilient systems for startups.")
- **Primary CTA label**: Button text (e.g., "View My Work")
- **Primary CTA link**: Anchor to section (e.g., `#projects`)
- **Secondary CTA label** (optional): (e.g., "Get in touch")
- **Secondary CTA link** (optional): Email or contact form link

---

## Project Case Studies

For each project (minimum 3 for production launch):

- **Project title**: Name of project (e.g., "Real-time Dashboard")
- **Project slug**: URL-safe ID (e.g., `real-time-dashboard`)
- **Date**: Publication date (e.g., `2026-03-01`)
- **Tags**: Technology stack as tags (e.g., `["TypeScript", "React", "WebSocket"]`)
- **Summary**: 1–2 sentences describing the project (e.g., "A real-time analytics dashboard cutting latency by 60%.")
- **Challenge**: 2–3 sentences on the problem (e.g., "The legacy dashboard was polling every 5s, causing stale data...")
- **Approach**: 2–3 sentences on your solution (e.g., "Implemented WebSocket subscriptions with React Suspense...")
- **Impact**: Metrics or outcomes (e.g., "Reduced latency to 100ms. Achieved 95+ Lighthouse score.")
- **Tech stack**: List of technologies used
- **Live URL** (optional): Link to deployed project
- **Source URL** (optional): GitHub repo link
- **Hero image**: 1200×630 px minimum, or 1200 px wide (landscape/hero). Provide 1–3 images total.
  - **Naming**: `project-{slug}-hero.{ext}`
  - **Format**: WebP preferred, JPEG/PNG acceptable. Compressed (<300 KB ideal).
  - **Alt text**: "Screenshot of {project name} dashboard showing {key feature}"

---

## Blog Posts (Optional)

For each blog post:

- **Title**: Post headline
- **Date**: Publication date (e.g., `2026-03-15`)
- **Tags**: Relevant topics (e.g., `["TypeScript", "Performance"]`)
- **Summary**: 1-sentence teaser
- **Slug**: URL-safe ID
- **Hero image**: 1200×630 px or 1200 px wide (optional but recommended)
- **Body**: Markdown content (3–10 paragraphs)

---

## Images & Media Assets

### Profile Photo

- **Format**: JPG or PNG, square preferred (1:1 aspect)
- **Size**: 600×600 or 1200×1200 px
- **Quality**: Professional, well-lit, neutral background preferred
- **Naming**: `profile.jpg` or `profile.png`
- **Location**: `public/images/profile.{ext}`

### Project Screenshots/Images

- **Format**: WebP (preferred) or optimized JPEG/PNG
- **Minimum width**: 1200 px (landscape)
- **Aspect ratio**: 16:9 recommended (but flexible)
- **Quality**: Compressed; each ideally <300 KB
- **Per project**: 1–3 images minimum
  - Hero image (main screenshot)
  - Detail shot (close-up or specific feature)
  - Contextual shot (in-use, optional)
- **Naming**: `project-{slug}-{purpose}.{ext}` (e.g., `project-dashboard-hero.webp`)
- **Alt text**: Descriptive, 10–20 words, mention subject and context
- **Location**: `public/images/`

### OG Image (Social Media Preview)

- **Size**: 1200×630 px (fixed)
- **Format**: PNG or JPG
- **Content**: Your name/brand + headline + optional branding graphic
- **Quality**: High contrast, readable at small sizes
- **Naming**: `og-image.png`
- **Location**: `public/og-image.png`

### Branding Graphics (Optional)

- **Texture or pattern backgrounds** (if used in theme)
- **Decorative shapes or illustrations** (if part of design)
- **Format**: SVG (vector) preferred or high-res PNG

---

## SEO & LLM Context

### Per-Page Meta

- **Page title** (≤60 chars): SEO title tag (e.g., "Jane Smith — Full-Stack Engineer")
- **Meta description** (150–160 chars): Search result description
- **Keywords**: 5–10 relevant terms (e.g., `TypeScript`, `React`, `WebGL`, `fullstack`)

### LLM Summaries

For each major page section (for AI context):

- **Landing page**: "Overview of professional identity, featured projects, and call-to-contact" (20–30 words)
- **Projects page**: "Portfolio of case studies showcasing technical architecture and impact" (15–25 words)
- **About page** (if separate): "Professional biography, experience, and approach"
- **Engineering subsection** (if multi-role): "Software engineering projects and technical specialties"
- **Art subsection** (if multi-role): "Creative/artistic portfolio and approach"

---

## Contact & Messaging

- **Contact CTA message**: 1–2 sentences encouraging visitors to reach out (e.g., "Interested in collaborating? I'm always open to interesting projects and conversations.")
- **Contact email**: Email to display/link (e.g., `hello@janesmith.dev`)
- **Social media follow message** (optional): Encouragement to connect (e.g., "Follow me on GitHub for open-source work.")

---

## Theme Configuration

- **Theme style**: One of `minimalista`, `modern-tech`, `profesional`, `vaporwave`
- **Default mode**: One of `light`, `dark`, `system`
- **Enable style switcher**: Boolean (show theme selector widget to users?)
- **Enable mode toggle**: Boolean (show light/dark toggle to users?)

### Optional Custom Theme

If using custom theme colors:

- **Custom primary color**: Hex value (e.g., `#0EA5E9`)
- **Custom accent color**: Hex value (e.g., `#D97706`)
- **Custom accent-2** (if using 3+ colors)

---

## Section Configuration

- **Sections to display**: List of enabled sections in order
  - Hero (always enabled)
  - About (enabled if single-role profile)
  - Skills (enabled if single-role profile)
  - Role Explorer (enabled if multi-role profile)
  - Projects (enabled if project content exists)
  - Blog (optional, enabled if using blog)
  - Contact (always enabled by default)

---

## Checklist

- [ ] Brand identity (logo, colors, fonts)
- [ ] Site metadata (title, description, author, URL)
- [ ] Social URLs and contact info
- [ ] 1+ professional role with 3 paragraphs + skills
- [ ] Hero headline and CTA copy
- [ ] 3+ project case studies with images
- [ ] OG image (1200×630)
- [ ] Profile photo (optional)
- [ ] Favicons
- [ ] Theme choice (style + mode + widget flags)
- [ ] Blog posts (optional)
- [ ] Contact message

---

## Asset Delivery Format

Provide all assets in a single folder structure:

```
fachada-assets/
├── branding/
│   ├── logo.svg
│   ├── logo-mark.svg
│   └── favicon-set/
├── colors.json              # hex palette
├── typography.json          # font names + weights
├── content.json             # all text: site meta + roles + projects
├── images/
│   ├── profile.jpg
│   ├── og-image.png
│   ├── project-{slug}-hero.webp
│   └── ...
├── projects/                # (optional) per-project folders with details
└── README.md                # delivery notes

```

---

**Ready to proceed?** Provide all assets above, and your Fachada app will be ready to build! 🚀
