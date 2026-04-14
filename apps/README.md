# /apps — App Configuration Packages

Each subdirectory is a self-contained **app package**: it composes a `src/profiles/` entry into the canonical `AppConfig` aggregate used by Fachada v2.

**Apps are automatically discovered from the `/apps/` folder.** Each folder with an `app.config.ts` file is automatically registered. For single-app projects you may instead place your app at `app/app.config.ts`. No core code changes are required to add or remove an app.

## Directory layout

```
apps/
├── default-fachada/      # Generic developer portfolio (default)
│   └── app.config.ts
├── artist-engineer/      # Multi-role creative + engineering portfolio
│   └── app.config.ts
```

## What an app config does

`app.config.ts` is the **only** file each package needs. It:

1. Imports `siteConfig` and `profileConfig` from its corresponding `src/profiles/<name>/` directory.
2. Assembles them into an `AppConfig` aggregate root (`src/types/app.types.ts`).
3. Exports the result as `appConfig`.

The file is **pure data** — no domain logic, no conditional imports, no side effects.

## Registration & Defaults

Apps are auto-discovered from the `/apps/` folder by the `vite-plugin-fachada` Vite
plugin (see [src/vite/fachada-plugin.ts](../src/vite/fachadarc.ts)). Any folder
containing an `app.config.ts` file is automatically registered. For single-app projects you may instead place your app at `app/app.config.ts` — the plugin will prefer an explicit `APP` env var and otherwise will use the first discovered app (or the single-app fallback).

## Selecting an app at build time

Set the `APP` environment variable before running `yarn build` or `yarn dev`:

```bash
APP=artist-engineer yarn build
APP=default-fachada yarn dev
```

`APP` is resolved to `import.meta.env.APP` at build time by the plugin.

When `APP` is not set, the plugin uses the discovered default (first discovered app or single-app fallback).

## How it works: vite-plugin-fachada

The plugin creates a virtual Vite module (`virtual:fachada/active-app`) that is resolved at build/test time:

1. Discovers apps from `apps/` and optionally `app/app.config.ts`
2. Resolves the active app name from `APP` → discovered default
3. Generates ES module code that imports the matched `AppConfig`
4. Exports it alongside `AVAILABLE_APPS`

**Core benefit:** `AppLoader.ts` imports only from `virtual:fachada/active-app`. It has zero hardcoded references to any file in `/apps/`.

## Adding a new app

1. Create a profile in `src/profiles/<your-profile>/` with `site.config.ts` and `profile.config.ts`.
2. Create `apps/<your-app>/app.config.ts` following the pattern of any existing app. That's it — the app is automatically discovered and no repo RC is required.

## AppConfig shape (summary)

```ts
interface AppConfig {
  seo: SiteConfig; // identity & SEO metadata
  theme: ThemeConfig; // base theme (style + mode)
  themeVariants: Record<string, ThemeOverride>; // optional token overrides
  assets: AssetConfig; // logical asset references
  siteTree?: SiteTreeConfig; // section hierarchy + per-page SEO (optional)
  page: PageConfig; // section layout & widgets
}
```

Full type definitions: [`src/types/app.types.ts`](../src/types/app.types.ts)

---

## SiteTree: section hierarchy and auto-generated files

An app can declare its full page structure via `siteTree`. When present, it drives automatic generation of `robots.txt` and `llm.txt`.

### Shape

```ts
interface SiteTreeConfig {
  landing: LandingDefinition; // mandatory root page at "/"
}

interface LandingDefinition {
  meta: PageMeta; // SEO metadata (path must be "/")
  sections: SectionRef[]; // visual sections on this page
  subsections?: SubsectionDefinition[]; // optional child pages
}

interface SubsectionDefinition {
  id: string; // unique key used as a route identifier
  meta: PageMeta; // SEO metadata (path must NOT be "/")
  sections: SectionRef[];
}

interface PageMeta {
  path: string; // URL path
  title: string; // <title> tag for this page
  description: string; // meta description
  keywords?: string[]; // SEO keywords
  canonicalUrl?: string; // override canonical URL
  ogImage?: string; // override OG image
  robots?: RobotsConfig; // per-page crawler directives
  llmSummary?: string; // 1–2 sentence summary for AI indexers (llm.txt)
}
```

### What it generates

| File          | Source                            | Behaviour when `siteTree` is absent   |
| ------------- | --------------------------------- | ------------------------------------- |
| `/robots.txt` | `RobotsGenerator` domain service  | Falls back to `Allow: /` + Sitemap    |
| `/llm.txt`    | `LlmTextGenerator` domain service | Falls back to `# Name\n> Description` |

### Example

```ts
siteTree: {
  landing: {
    meta: {
      path: "/",
      title: "Matías Batista — Engineer & Artist",
      description: "Software engineer and digital artist.",
      keywords: ["TypeScript", "WebGL", "generative art"],
      llmSummary: "Landing page presenting both engineering and art identities.",
    },
    sections: [
      { id: "hero",         order: 1, enabled: true },
      { id: "role-explorer", order: 2, enabled: true },
      { id: "contact",      order: 3, enabled: true },
    ],
    subsections: [
      {
        id: "engineering",
        meta: {
          path: "/engineering",
          title: "Matías Batista — Software Engineer",
          description: "TypeScript, WebGL, React, Node.js portfolio.",
          keywords: ["TypeScript engineer", "WebGL developer"],
          llmSummary: "Engineering portfolio with real-time 3D projects.",
        },
        sections: [
          { id: "hero",     order: 1, enabled: true },
          { id: "projects", order: 2, enabled: true },
          { id: "contact",  order: 3, enabled: true },
        ],
      },
    ],
  },
},
```

### Validation

Call `validateSiteTree(appConfig.siteTree)` at build time to catch structural errors:

- Landing path must be exactly `"/"`
- Subsection paths must not be `"/"`
- Subsection paths must be unique
- Subsection IDs must be unique

```ts
import { validateSiteTree } from "src/core/site-tree/SiteTreeValidator";
const result = validateSiteTree(appConfig.siteTree);
if (!result.isValid) throw new Error(result.errors.join("\n"));
```
