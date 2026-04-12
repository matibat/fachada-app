# APP Environment Variable Reference

## Overview

Use the `APP` environment variable to select which app/portfolio to build or develop:

```bash
APP=app-name yarn dev
APP=app-name yarn build
```

## Available Apps

Register all apps in `.fachadarc.json`:

```json
{
  "defaultApp": "default-fachada",
  "apps": {
    "default-fachada": "apps/default-fachada/app.config.ts",
    "engineer": "apps/engineer/app.config.ts",
    "artist-engineer": "apps/artist-engineer/app.config.ts"
  }
}
```

### Default App

**`default-fachada`** — Used when `APP` is not set

```bash
yarn dev          # Uses default-fachada
yarn build        # Uses default-fachada
```

### All Available Apps

| App Name          | Description                                     | Location                             |
| ----------------- | ----------------------------------------------- | ------------------------------------ |
| `default-fachada` | Generic developer portfolio framework showcase  | `apps/default-fachada/app.config.ts` |
| `engineer`        | Backend engineer role (restricted theme)        | Not currently in `.fachadarc.json`   |
| `artist-engineer` | Multi-role portfolio: engineer + digital artist | `apps/artist-engineer/app.config.ts` |

## Usage Examples

```bash
# Use default app
yarn dev

# Use specific app
APP=artist-engineer yarn dev
APP=artist-engineer yarn build

# Use another app
APP=default-fachada yarn build
```

## Custom Themes in Artist-Engineer App

The `artist-engineer` app includes 3 custom themes:

- **minimal** — Cool sky blue accents (#0EA5E9)
- **warm** — Amber/orange accents (#D97706)
- **bold** — Vibrant magenta accents (#A855F7)

To verify they're loaded:

```bash
APP=artist-engineer yarn dev
# Open browser console:
# window.__FACHADA_THEME_POOL__
# Should show: {minimal: {...}, warm: {...}, bold: {...}}
```

## Removing PROFILE (Legacy)

As of this update, **only `APP` is supported**. The legacy `PROFILE` environment variable has been removed:

❌ REMOVED:

```bash
PROFILE=artist-engineer-multi yarn dev
```

✅ USE INSTEAD:

```bash
APP=artist-engineer yarn dev
```

## Adding a New App

1. Create `apps/your-app/app.config.ts`
2. Create profile configs in `src/profiles/your-app/`
3. Add entry to `.fachadarc.json`
4. Run: `APP=your-app yarn dev`

See [README.md](../README.md#-creating-new-apps) for full instructions.

---

## Section Tree and Auto-generated Files

Apps can declare a `siteTree` in their `AppConfig` to define the full page hierarchy and SEO metadata for each page. When present, the framework automatically generates `robots.txt` and `llm.txt` from this data.

### Enabling siteTree

Add the `siteTree` field to your `app.config.ts`:

```ts
export const appConfig: AppConfig = {
  seo: siteConfig,
  theme: profileConfig.theme,
  // ...
  siteTree: {
    landing: {
      meta: {
        path: "/",
        title: "My Site — Engineer",
        description: "Personal portfolio.",
        keywords: ["TypeScript", "React", "portfolio"],
        llmSummary: "Landing page with featured projects and contact.",
      },
      sections: [
        { id: "hero", order: 1, enabled: true },
        { id: "projects", order: 2, enabled: true },
        { id: "contact", order: 3, enabled: true },
      ],
      subsections: [
        {
          id: "engineering",
          meta: {
            path: "/engineering",
            title: "Engineering Portfolio",
            description: "TypeScript and React projects.",
            keywords: ["TypeScript engineer", "React developer"],
            llmSummary: "Engineering projects showcase.",
          },
          sections: [
            { id: "hero", order: 1, enabled: true },
            { id: "projects", order: 2, enabled: true },
          ],
        },
      ],
    },
  },
  page: {
    sections: profileConfig.sections.map((s) => ({ ...s, widgets: [] })),
  },
};
```

### Generated files

| URL           | Generator          | Description                                                                                                              |
| ------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `/robots.txt` | `RobotsGenerator`  | Lists `Allow:` directives for all pages. `Disallow:` and `Crawl-delay:` driven by per-page `robots` config.              |
| `/llm.txt`    | `LlmTextGenerator` | Markdown document following [llms.txt spec](https://llmstxt.org) — site name, description, and page list for AI context. |

When `siteTree` is absent, both files fall back to minimal defaults.

### artist-engineer app sections

The `artist-engineer` app is the reference implementation:

| Path           | Title                       | Purpose                                                                    |
| -------------- | --------------------------- | -------------------------------------------------------------------------- |
| `/`            | Landing                     | Dual-identity presentation; routes visitors to engineering or art section  |
| `/engineering` | Software Engineer           | Technical portfolio: TypeScript, WebGL, React, Node.js projects and skills |
| `/art`         | Digital Art & Creative Code | Art portfolio: generative systems, 3D sculpture, GLSL shaders              |

Each subsection carries targeted SEO keywords and an `llmSummary` so AI assistants can accurately describe the site content.
