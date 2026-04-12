---
title: "Markdown-Driven Pages — Author's Guide"
description: "How to create and publish content pages using Markdown files in your Fachada app, without touching any TypeScript config."
apps: ["default-fachada"]
path: "/resources/markdown-pages"
keywords:
  - markdown pages
  - content collection
  - fachada authoring
  - frontmatter
  - page generation
llmSummary: "Step-by-step guide to authoring content-collection Markdown pages in Fachada. Covers file placement, required frontmatter, optional fields, app targeting, and cross-linking between pages."
downloadFilename: "markdown-pages-guide.md"
nextLink:
  href: "/resources/markdown-pages-reference"
  label: "Frontmatter Field Reference"
---

# Markdown-Driven Pages — Author's Guide

Fachada lets you publish pages entirely from Markdown files — no TypeScript config changes required. Drop a `.md` file into `src/content/pages/`, fill in the frontmatter, and the build system registers it as a first-class page with SEO metadata, navigation links, and optional download support.

---

## How It Works

Pages in `src/content/pages/` are loaded by Astro's content collection system using a Zod schema defined in `src/content/pages.schema.ts`. At build time:

1. Every `.md` file in that directory is validated against the schema.
2. The `MarkdownPageCollector` domain service reads each entry and checks whether it targets the active app (via the `apps` field).
3. Matching pages are merged into the app's `SiteTreeConfig` as additional subsections.
4. A `MarkdownPage` template renders each page with full `BaseLayout` wrapping — including header, footer, OG meta, and canonical URL.

This means markdown pages get the same SEO treatment as any TypeScript-declared page, including `robots.txt` and `llm.txt` registration.

---

## File Placement

All pages go in:

```
src/content/pages/
```

The filename becomes the collection entry ID (slug). It does **not** automatically determine the URL path — the `path` frontmatter field controls routing. If `path` is omitted, the system falls back to `/pages/{filename-without-extension}`.

**Example**:
- File: `src/content/pages/my-feature-overview.md`
- With `path: "/resources/my-feature"` → served at `/resources/my-feature`
- Without `path` → served at `/pages/my-feature-overview`

Use explicit `path` values whenever you need the URL to match an existing resource hierarchy or a specific SEO target.

---

## Required Frontmatter

Every page must declare these three fields:

```yaml
---
title: "My Page Title"
description: "A 1–2 sentence summary of this page, used in meta tags and link previews."
apps: ["default-fachada"]
---
```

| Field | Type | Purpose |
|---|---|---|
| `title` | `string` | Page `<title>` tag and heading |
| `description` | `string` | Meta description, OG description |
| `apps` | `string[]` or `"*"` | Which apps should include this page |

### The `apps` field

Use an array of app names to target specific apps:

```yaml
apps: ["default-fachada"]
```

Use `"*"` to make a page available to all apps built from this codebase:

```yaml
apps: "*"
```

App-specific content should always use the array form. Cross-app shared documentation (e.g., contributing guides) can use `"*"`.

---

## Writing Content

After the closing `---` of the frontmatter, write standard Markdown. Fachada renders it with full prose styling using the `MarkdownPage` template.

Use headings, lists, tables, and fenced code blocks freely:

```markdown
## Installation

Run the following to scaffold a new app:

\`\`\`bash
make new-app APP=my-portfolio
\`\`\`
```

There is no length restriction beyond the 250-line guideline for maintainability. For longer documents (technical references, full manuals), consider splitting into multiple linked pages and using `backLink` / `nextLink` to create a reading sequence.

---

## Building and Testing

After adding a file, verify it compiles:

```bash
APP=default-fachada yarn build
```

To preview in development:

```bash
APP=default-fachada yarn dev
```

The new page will appear at the path you declared in frontmatter. If `path` is omitted, visit `/pages/{your-filename}`.

---

## Next Steps

Continue to the [Frontmatter Field Reference](/resources/markdown-pages-reference) to see every optional field documented with examples.
