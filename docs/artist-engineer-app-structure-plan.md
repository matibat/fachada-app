# artist-engineer App Structure Plan — Marketing & UX Strategy

## Overview

Three interconnected pages designed around the Hook-Meat-CTA pyramid and DDD principles. Each page has a distinct audience, value proposition, and navigation flow.

---

## 1. LANDING PAGE (`/`) — Dual-Identity Presentation

### Purpose

Stop the scroll, prove Matías is credible in both disciplines, and fork traffic to the right subsection.

### Hook (First 2–3 seconds / viewport)

**Visual + copy combo:**

- Hero headline: **"I build software. I make art. Sometimes both."**
- Subheading: "TypeScript engineer + digital artist"
- Two CTAs side-by-side (not stacked): `→ Engineering` | `→ Art`
- No verbose explanation; let the image/design do work here

**Marketing principle applied:** Dual positioning (Authority type — warm audience from social/referral). Immediate clarity on who this is; no ambiguous taglines like "creative technologist."

### Meat (Feature showcase)

**Section structure:**

1. **Featured Projects** (4-tile grid, 2 recent engineering + 2 recent art)
   - Each tile: image + 1-line title + primary skill tag (e.g., "WebGL", "Generative")
   - NO detailed descriptions — just enough to signal quality and range
   - Goal: prove "this person ships real work"

2. **Role Bridge Paragraph** (1 short paragraph, center-aligned, generous whitespace)
   - Text: "Engineering is the constraint I build within. Art is where I let constraints dissolve and see what emerges. Sometimes they meet."
   - Font: smaller than headline, warm gray color
   - Whitespace: 3rem above and below
   - Goal: emotional connection, answer the "why both?" question

3. **Section Navigator Cards** (2 equal cards below, side-by-side)
   - Left: **"Engineering"** — solid icon, clean minimal aesthetic
     - Subheading: "TypeScript · WebGL · React"
     - Micro CTA: "Explore →"
   - Right: **"Art"** — atmospheric icon, softer aesthetic
     - Subheading: "Generative · 3D · Print"
     - Micro CTA: "Explore →"
   - Goal: visual cue for two domains + frictionless navigation

4. **Contact CTA** (visible on scroll, sticky footer or full-width section)
   - Headline: "Let's work on something."
   - Micro-copy: "Whether it's engineering, art, or the weird space between."
   - Button: "Get in touch" → scrolls or routes to contact form

### CTA (Primary)

**Two equal-weight calls-to-action:**

1. `→ Engineering` (button or link card)
2. `→ Art` (button or link card)

**Secondary (on scroll):**

- "Contact me" (sticky footer or mid-screen section)

**Navigation principle applied:** Conversion = routing to subsection + email capture. No "learn more" ambiguity.

### SEO / robots.txt / llm.txt

- Keywords: broad discovery terms (see siteTree in app.config)
- Canonical: landing page is the entry point; both subsections are equally weighted (no noindex)
- llmSummary: "Landing page presenting dual engineering and art identities; routes visitors to discipline-specific portfolios."

### Space & Layout Rules

- Hero section: full viewport (80–100vh), vertical center
- Featured projects: 4-tile grid, 1.5rem gaps, max content width 1200px
- Role bridge: 100vw width, 3rem vertical padding, background subtle gradient
- Section navigator: 2-column equal flex, full width, 2rem gap
- All text: generous line-height (1.7–1.85), readable font size (16–18px body)

---

## 2. ENGINEERING PAGE (`/engineering`) — Technical Depth & Credibility

### Purpose

Appeal to potential clients/recruiters. Show depth, specialisation, process, and real-world impact.

### Hook (First viewport)

**Two-column hero:**

- Left: Headline **"Software Engineer — Depth in WebGL, React, Node.js"**
- Right: 1-2 shot images or video (e.g., live WebGL demo, code editor shot, architecture diagram)
- Subheading: "Real-time systems, open source, full-stack web"

**Marketing principle applied:** Specificity = trust. Not "full-stack developer" (too generic); instead: WebGL + React + Node.js (shows expertise in real domains).

### Meat (Value delivery)

**Section 1: Featured Projects Grid (3-column)**

- Each project card:
  - Screenshot/video
  - Title (action-verb + output, e.g., "Built a real-time 3D viewer with ThreeJS")
  - Tech stack: inline badges (e.g., `TypeScript` `WebGL` `React`)
  - Single-line description (avoid paragraphs)
  - Link: "View project" or "Live demo" if applicable
- Sorting: newest/most impressive first
- Goal: portfolio proof; each project has "wow" factor visible in 3 seconds

**Section 2: Skills Breakdown (3 subsections)**

- **Languages & Runtime**
  - TypeScript, JavaScript, GLSL, SQL, WebAssembly
  - Format: tag cloud or organized list
- **Frontend & Rendering**
  - WebGL, Three.js, React, Astro, Tailwind CSS
- **Backend & Data**
  - Node.js, PostgreSQL, Redis, Docker, Vercel
- Format: organized columns, clear hierarchy (primary skill first)
- Goal: at-a-glance credibility; no wall of text

**Section 3: Process / Perspective (optional rich media)**

- Headline: "How I approach engineering"
- 2–3 short sentence philosophy (e.g., "Performance first. Real-time systems over CRUD. Constraints drive creativity.")
- Optional: 30-second video or animation showing workflow/process
- Goal: differentiate from generic engineers; show thinking

### CTA (Primary)

**"Available for contracts in [specialities]. Let's build something."**

- Button: "Email me" → mailto: or contact form with pre-filled subject
- Alternative micro-CTA on each project: "View code" (GitHub link)

### SEO / robots.txt

- Keywords: intent-based ("TypeScript engineer for hire", "WebGL developer", "React portfolio")
- Canonical: `/engineering`
- Meta description: "Software engineering portfolio: TypeScript, WebGL, React, Node.js projects"
- llmSummary: "Engineering portfolio showcasing expertise in real-time 3D systems and full-stack development"

### Space & Layout Rules

- Hero: 60vh, two-column (50/50 or 40/60 image-heavy)
- Projects grid: 3 columns on desktop, 1 on mobile, 1.5rem gap
- Skills: 3 columns, 1rem gap between items, subtle background panels for each subsection
- Generous padding between sections: 4–5rem vertical

---

## 3. ART PAGE (`/art`) — Emotional & Conceptual

### Purpose

Appeal to collectors, collaborators, and other artists. Show vision, not just output.

### Hook (First viewport)

**Atmospheric full-bleed image + text overlay:**

- Headline (centered, large, serif or striking font): **"Generative Systems, 3D Sculpture, Algorithmic Print"**
- Subheading: "Art where emergence and intention meet"
- Background: one beautiful art piece or generative animation loop
- Text overlay: semi-transparent, readable on image

**Marketing principle applied:** Emotional hook (not functional like engineering). Story-first, list-second.

### Meat (Inspiration + credibility)

**Section 1: Artist Statement**

- 2–3 short paragraphs (not a wall of text)
- Answer: "What is your work about? Why this medium? What drives it?"
- Example: "My work explores the liminal space between algorithmic intention and emergent outcome. I use generative systems, 3D sculpture, and large-format archival printing to find beauty in constraint and impermanence."
- Goal: establish artistic vision and differentiate from generative art spam

**Section 2: Gallery Grid (2 or 3 columns, masonry layout acceptable)**

- Each piece:
  - High-quality image (full-bleed, beautiful crop)
  - Title + year
  - Medium: "Algorithmic print on archival paper, 120cm × 80cm" or "Blender + GLSL, video, 4K"
  - Brief caption OR hidden on hover (your choice: atmospheric vs. informative)
- Sorting: by series or emotional narrative arc (not just chronological)
- Goal: let the work speak; gallery-like experience

**Section 3: Methods / Process**

- Headline: "Creative Code + Tools"
- List or cards:
  - **3D & Motion**: Blender, Houdini, Cinema 4D, After Effects
  - **Generative Code**: GLSL, p5.js, TouchDesigner, Processing
  - **Output**: Archival Print, WebGL Installation, Generative Video
- Format: icon + label cards or minimal list
- Goal: signal technical rigor to artists; credibility to collectors

**Section 4: Commissions / Collaboration**

- Headline: "Open to commissions and creative tech collaborations"
- Micro-copy: "Whether you're looking for generative art, large-format print, or a custom installation—let's talk."
- CTA: "Email me your project"

### CTA (Primary)

**"Commission / Collaborate — Get in touch"**

- Button: "Email me" → contact form with subject pre-filled ("Commission Inquiry" or "Collaboration")
- Optional secondary: "View on [Instagram](link)" (social proof for galleries/collectors)

### SEO / robots.txt

- Keywords: niche ("generative art prints", "GLSL shader art", "algorithmic 3D sculpture", "creative code")
- Canonical: `/art`
- Meta description: "Digital art and generative systems: algorithms, 3D sculpture, archival prints"
- llmSummary: "Digital art portfolio showcasing generative systems, 3D sculpture, and GLSL experiments; open to commissions"

### Space & Layout Rules

- Hero: full viewport (100vh), image-heavy, text overlay centered
- Artist statement: narrow column (max 600px), centered, 1.8 line-height, generous margins
- Gallery: masonry 2–3 columns, 2rem gap, images scale responsively
- Process section: icon + label cards, 1.5rem gap
- Vertical padding between sections: 5–6rem (more generous than engineering for contemplative feel)

---

## Navigation & Interconnectedness

### Primary Flows

1. **Landing → Engineering**: Top-level "Engineering" CTA or side navigation
2. **Landing → Art**: Top-level "Art" CTA or side navigation
3. **Engineering ↔ Art**: Footer link or sticky header showing both sections ("← Back to selections" or breadcrumb)

### Header / Navigation Bar (persistent across all pages)

- Left: Logo / Name "Matías Batista"
- Center: Role toggle (if theme-switcher style):
  - `[Engineering]` | `[Art]` | `[Both]` (radio buttons or toggle)
  - Clicking switches; color/theme adjusts per section
- Right: Contact CTA ("Email me" or envelope icon)
- On mobile: hamburger menu, same structure

### Footer (consistent across all pages)

- Left: Social links (GitHub, LinkedIn, Twitter/X)
- Center: "© 2026" or copyright
- Right: "Privacy" link if applicable, or quick section links (`← Engineering` | `← Art`)
- Contact: email or form CTA

### Breadcrumb / Context Trail

- Landing: none
- Engineering: `Matías Batista / Engineering` or just `Engineering`
- Art: `Matías Batista / Art` or just `Art`
- Purpose: mobile-friendly context when scrolled far down

---

## Information Hierarchy & Digestibility

### Pyramid per page (most important at top, refine below)

**Landing:**

1. Dual identity (headline + image)
2. Featured work (4 tiles, visual proof)
3. Section fork (two CTAs)
4. Contact invite (secondary)

**Engineering:**

1. Speciality + hook (WebGL + React + Node)
2. Projects (proof of work)
3. Skills (credibility audit)
4. Contact (conversion)

**Art:**

1. Vision + aesthetics (artist statement)
2. Gallery (emotional engagement)
3. Process (technical credibility)
4. Commission (conversion)

### Typography Hierarchy

- Page headline (h1): 2.5–3.5rem, bold/extrabold
- Section headline (h2): 1.75–2rem, semibold
- Subsection headline (h3): 1.25–1.5rem, medium
- Body text: 1rem (16px), line-height 1.7–1.8
- Small text (captions, meta): 0.875rem, gray-500

### Color & Contrast (per active theme)

- Maintain 4.5:1 WCAG AA contrast minimum
- Section backgrounds: subtle alternation (bgPrimary / bgSecondary)
- Accent colors: used sparingly for CTAs and highlights
- Links: underlined or colored per section theme

---

## SEO Optimization

### Landing (`/`)

- `<title>`: "Matías Batista — Engineer & Artist"
- `<meta name="description">`: "Software engineer and digital artist. TypeScript, WebGL, React & generative art, 3D sculpture."
- Keywords: broad discovery + dual positioning
- Schema: Person + Portfolio

### Engineering (`/engineering`)

- `<title>`: "Matías Batista — Software Engineer | TypeScript, WebGL, React"
- `<meta name="description">`: "Portfolio: real-time 3D systems, full-stack development, TypeScript, WebGL, React."
- Keywords: intent-based (for recruiter/client search)
- Schema: Person + Project (for each featured project)

### Art (`/art`)

- `<title>`: "Matías Batista — Digital Art | Generative Systems, 3D Sculpture"
- `<meta name="description">`: "Generative art, algorithmic prints, 3D sculpture. Available for commissions and creative collaboration."
- Keywords: niche (for collectors/artists)
- Schema: Person + CreativeWork (for each piece)

### Shared

- Canonical URLs: each page has its own (no duplicates)
- robots.txt: Allow `/` and both subsections; disallow any /admin or /drafts
- llm.txt: auto-generated from siteTree (shows structure to AI assistants)
- Open Graph: og:image per page (different for landing, engineering, art)
- Sitemap: auto-generated, includes all three pages + update frequency

---

## Responsive Design & Mobile

### Desktop (1200px+)

- All 2–3 column layouts as specified
- Hero sections: side-by-side images + text
- Sticky header with full nav

### Tablet (768px–1199px)

- 2-column becomes 1–2 column (project grid → 2 columns)
- Hero might stack vertically if image-heavy
- Navigation might collapse to hamburger

### Mobile (< 768px)

- Single column for all grids
- Hero: full vertical stack
- Typography: scale down slightly (h1 → 2rem, body → 0.95rem)
- Touch targets: 44px minimum for buttons
- Collapsible sections if needed

---

## Marketing Principles Applied

| Principle                 | Implementation                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **Clear value prop**      | Landing headline: "I build software. I make art." No fluff.                         |
| **Audience segmentation** | Two subsections; each optimized for a different buyer (recruiter vs. collector).    |
| **Hook-Meat-CTA**         | Every page: immediate hook, proof/value in meat, single CTA.                        |
| **Social proof**          | Featured projects + process visibility. Real output visible in 3 seconds.           |
| **Trust signals**         | Specific tech stack, featured work, artist statement, process transparency.         |
| **Information scarcity**  | Less copy, more visual. Each section answers one question, then exits.              |
| **SEO intent**            | Keywords aligned to buyer intent (engineering: "for hire"; art: "commission").      |
| **Friction reduction**    | One CTA per page. Email contact or form with pre-filled context. No dead ends.      |
| **Emotional + rational**  | Engineering page: credibility-first (rational). Art page: vision-first (emotional). |

---

## Summary: Acceptance Criteria Coverage

✅ **Pages are interconnected and intuitive navigation**

- Header shows both sections; footer links between them
- Landing acts as hub; subsections are peer- level
- Breadcrumbs on mobile for context

✅ **Smart usage of spaces**

- Generous vertical rhythm: 4–6rem between sections
- Whitespace frames content (role bridge, artist statement)
- Font sizes scale; line-heights are readable (1.7+)

✅ **Smart information distribution and easily digestible**

- Pyramid hierarchy: most important first
- Single section = one value unit (not info overload)
- Visual proof before text (gallery, projects grid)
- Micro-copy where details matter; omit where they don't

✅ **Optimized for Google search**

- Unique titles + descriptions per page
- Intent-matched keywords (recruiter vs. collector)
- Schema markup (Person, Project, CreativeWork)
- Clean URLs + canonical tags
- Sitemaps + robots.txt auto-generated

✅ **Marketing principles nicely applied**

- Hook-Meat-CTA on every page
- Audience-specific CTAs (contact available for both, but framed differently)
- Social proof via portfolio
- Emotional resonance on art page; credibility on engineering
- Friction-free path to action (one CTA, clear outcome)

---

## Next Steps (Ready for Implementation)

When ready, we will:

1. Update landing page UI: hero refactor, featured work grid, role bridge, section navigator
2. Create `/engineering` page view with project grid + skills breakdown
3. Create `/art` page view with gallery + artist statement
4. Update header/footer navigation to support three-page routing
5. Update Astro routes to handle `/engineering` and `/art` pages
6. Verify SEO metadata is correctly applied per siteTree config
7. Test responsive design across breakpoints
8. Verify all CTAs flow to contact form with correct context
