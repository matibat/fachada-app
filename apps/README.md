# /apps — App Configuration Packages

Each subdirectory is a self-contained **app package**: it composes a `src/profiles/` entry into the canonical `AppConfig` aggregate used by Fachada v2.

**The single source of truth for app registration is [`.fachadarc.json`](../.fachadarc.json)** at the project root. No core code changes are required to add or remove an app.

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

## Registration: .fachadarc.json

The `.fachadarc.json` file at the project root registers all available apps:

```json
{
  "defaultApp": "default-fachada",
  "apps": {
    "default-fachada": "apps/default-fachada/app.config.ts",
    "artist-engineer": "apps/artist-engineer/app.config.ts"
  }
}
```

- **`defaultApp`** — the fallback app name when the `APP` env var is not set
- **`apps`** — map of app name → path (relative to project root)

This registry is read at build/test time by the **vite-plugin-fachada** Vite plugin (see [src/vite/fachada-plugin.ts](../src/vite/fachada-plugin.ts)).

## Selecting an app at build time

Set the `APP` environment variable before running `yarn build` or `yarn dev`:

```bash
APP=artist-engineer yarn build
APP=default-fachada yarn dev
```

`APP` is resolved to `import.meta.env.APP` at build time by the plugin.

When `APP` is not set, the `defaultApp` from `.fachadarc.json` is used.

## How it works: vite-plugin-fachada

The plugin creates a virtual Vite module (`virtual:fachada/active-app`) that is resolved at build/test time:

1. Reads `.fachadarc.json` from the project root
2. Resolves the active app name from `APP` → `defaultApp`
3. Generates ES module code that imports the matched `AppConfig`
4. Exports it alongside `AVAILABLE_APPS`

**Core benefit:** `AppLoader.ts` imports only from `virtual:fachada/active-app`. It has zero hardcoded references to any file in `/apps/`.

## Adding a new app

1. Create a profile in `src/profiles/<your-profile>/` with `site.config.ts` and `profile.config.ts`.
2. Create `apps/<your-app>/app.config.ts` following the pattern of any existing app.
3. Add **one line** to `.fachadarc.json` under the `apps` object:
   ```json
   "your-app": "apps/your-app/app.config.ts"
   ```

That's it. No changes to `AppLoader.ts`, no build config edits, no code coupling. The plugin automatically discovers it.

## AppConfig shape (summary)

```ts
interface AppConfig {
  seo: SiteConfig; // identity & SEO metadata
  theme: ThemeConfig; // base theme (style + mode)
  themeVariants: Record<string, ThemeOverride>; // optional token overrides
  assets: AssetConfig; // logical asset references
  page: PageConfig; // section layout & widgets
}
```

Full type definitions: [`src/types/app.types.ts`](../src/types/app.types.ts)
