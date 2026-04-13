# Fachada Migration Plan — Phase 2

## Overview

Phase 1 extracted `src/` into `@fachada/core` as a separate npm package. Phase 2 refines the architecture to make `@fachada/core` a true framework: flattening imports, moving all Astro definitions into core, and defining a zero-boilerplate template for new apps.

---

## Phase 2A: Flatten Imports

### Goal

Replace all deep-path imports (`@fachada/core/types/app.types`, `@fachada/core/utils/contact`) with a single barrel import (`@fachada/core`).

### Current State

- `@fachada/core/src/index.ts` already re-exports all public types and utilities
- Apps and tests still use deep paths: `import type { AppConfig } from '@fachada/core/types/app.types'`

### Changes Required

**In `@fachada/core/package.json`:**

- Update exports map: simplify `"."` to be the only commonly-used entry point
- Keep sub-paths for advanced users but don't advertise them

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./vite": "./src/vite/fachada-plugin.ts"
  }
}
```

**In all consuming files (apps, fachada root, tests):**

```ts
// OLD
import type { AppConfig } from "@fachada/core/types/app.types";
import { useThemeStore } from "@fachada/core/stores/themeStore";

// NEW
import type { AppConfig } from "@fachada/core";
import { useThemeStore } from "@fachada/core";
```

### Acceptance Criteria

- All imports in `apps/*/` use `@fachada/core` (no sub-paths)
- All imports in `tests/` use `@fachada/core`
- TypeScript compiles with no errors
- All 488+ tests pass

### Effort

~2 hours — mechanical find-and-replace + testing

---

## Phase 2B: Move Astro Code to Core (Via Astro Integration)

### Goal

Remove all `.astro` files and content config from `fachada/src/`, implement them as an Astro Integration in `@fachada/core`, so apps only hold configuration (no Astro boilerplate).

### Current State

`fachada/src/` contains:

- `pages/` (4 `.astro` files: index, [...slug], robots.txt, llm.txt)
- `layouts/`, `templates/`, `components/`, `widgets/` (30+ `.astro` files)
- `content.config.ts` (Astro content integration)
- `styles/*.css` (global stylesheets)

Each is a boilerplate app developers must copy/modify.

### Architecture

**New `@fachada/core` structure:**

```
src/
  astro/                           ← NEW
    integration.ts                 ← Astro Integration factory
    pages/                         ← Move from fachada/src/pages/
    layouts/                       ← Move from fachada/src/layouts/
    templates/                     ← Move from fachada/src/templates/
    components/                    ← Move from fachada/src/components/
    widgets/                       ← Move from fachada/src/widgets/
    content.config.ts              ← Move from fachada/src/content.config.ts
    styles/                        ← Move from fachada/src/styles/
  (existing module files)
```

**New `@fachada/core/src/astro/integration.ts`:**

```ts
import type { AstroIntegration } from "astro";
import { fachadaPlugin } from "../vite/fachada-plugin";

export function fachadaIntegration(): AstroIntegration {
  return {
    name: "@fachada/core",
    hooks: {
      "astro:config:setup": ({ injectRoute, addMiddleware, updateConfig }) => {
        // Inject all routes from core
        injectRoute({
          pattern: "/",
          entrypoint: "@fachada/core/astro/pages/index.astro",
        });
        injectRoute({
          pattern: "/[...slug]",
          entrypoint: "@fachada/core/astro/pages/[...slug].astro",
        });
        injectRoute({
          pattern: "/robots.txt",
          entrypoint: "@fachada/core/astro/pages/robots.txt.ts",
          prerender: true,
        });
        injectRoute({
          pattern: "/llm.txt",
          entrypoint: "@fachada/core/astro/pages/llm.txt.ts",
          prerender: true,
        });

        // Inject CSS
        updateConfig({
          vite: {
            plugins: [fachadaPlugin()],
          },
        });
      },
    },
  };
}
```

**App's `astro.config.mjs` (after migration):**

```ts
import { defineConfig } from "astro/config";
import { fachadaIntegration } from "@fachada/core";

export default defineConfig({
  integrations: [fachadaIntegration()],
});
```

### Files to Move

From `fachada/src/` to `@fachada/core/src/astro/`:

- `pages/index.astro` → `astro/pages/index.astro`
- `pages/[...slug].astro` → `astro/pages/[...slug].astro`
- `pages/robots.txt.ts` → `astro/pages/robots.txt.ts`
- `pages/llm.txt.ts` → `astro/pages/llm.txt.ts`
- `layouts/BaseLayout.astro` → `astro/layouts/BaseLayout.astro`
- `templates/*.astro` (5 files) → `astro/templates/*.astro`
- `components/*.astro` (13 files) → `astro/components/*.astro`
- `widgets/*.astro` (15 files) → `astro/widgets/*.astro`
- `content.config.ts` → `astro/content.config.ts`
- `styles/*.css` (3 files) → `astro/styles/*.css`

### Changes to `fachada/src/`

After migration, delete:

- `src/pages/`
- `src/layouts/`
- `src/templates/`
- `src/components/`
- `src/widgets/` (except TS utilities)
- `src/content.config.ts`
- `src/styles/`
- `src/config.ts` (virtual-module shim — no longer needed at project root)
- `src/profile.config.ts` (same)

Retain only:

- Framework config/types (Vite plugin, types, utils)

### Acceptance Criteria

- `fachada/src/astro/integration.ts` exports `fachadaIntegration()`
- `@fachada/core/package.json` exports `"./astro": "./src/astro/integration.ts"`
- All 3 apps build successfully with new integration: `APP=default-fachada yarn build` ✓
- All tests pass
- No `src/pages/` or `src/layout/` remain in `fachada/`

### Effort

~6–8 hours — move 40+ files, rewrite import paths in moved `.astro` files, implement and test integration hooks

---

## Phase 2C: Create New App Bootstrap Template

### Goal

Enable developers to create a new Fachada app with zero boilerplate by providing a starter template or `create-fachada` CLI tool.

### Option C1: Template Repository (Simpler, Immediate)

Create a new repo: `fachada-template`

```
fachada-template/
  astro.config.mjs
  package.json              ← depends on @fachada/core
  tsconfig.json
  content.config.ts         ← empty, ready to customize
  vite.config.ts
  app.config.ts             ← example with placeholder data
  site.config.ts
  profile.config.ts
  apps/
    my-app/
      blog/
      pages/
      app.config.ts
      site.config.ts
      profile.config.ts
  public/
  README.md
```

**Developer workflow:**

```bash
git clone https://github.com/your-org/fachada-template.git my-new-app
cd my-new-app
yarn install
# Edit app.config.ts, site.config.ts, profile.config.ts
yarn dev
```

### Option C2: Create CLI (More Polished, Later)

A `create-fachada` package:

```bash
npm create fachada@latest my-app
cd my-app
yarn install
yarn dev
```

Scaffolds the same template structure programmatically.

### Recommended: Start with C1 (Template)

- Faster to implement (~2 hours)
- Easier to maintain
- Developers can fork/customize
- Upgrade path to C2 later

### Template Contents

**`package.json`:**

```json
{
  "name": "my-fachada-app",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check && tsc --noEmit"
  },
  "dependencies": {
    "@fachada/core": "^0.1.0",
    "astro": "^6.0.0"
  }
}
```

**`astro.config.mjs`:**

```ts
import { defineConfig } from "astro/config";
import { fachadaIntegration } from "@fachada/core";

export default defineConfig({
  integrations: [fachadaIntegration()],
});
```

**`app.config.ts`:**

```ts
import type { AppConfig } from "@fachada/core";

export const appConfig: AppConfig = {
  seo: {
    site: "https://example.com",
    name: "My App",
    author: "Author Name",
    description: "App description",
    socials: {
      github: "https://github.com/yourname",
    },
    roles: [
      { title: "Product Manager", slug: "pm" },
      { title: "Engineer", slug: "eng" },
    ],
  },
  profile: {
    about: "Your bio",
    skills: [],
    theme: "default",
  },
  siteTree: {
    landing: {
      /* ... */
    },
  },
};
```

### Acceptance Criteria

- Template repo (`fachada-template`) exists and is public
- `README.md` documents setup steps
- Fresh clone + `yarn install && yarn dev` works with no errors
- `yarn build` produces static output

### Effort

~2–3 hours — scaffold template repo, write setup docs

---

## Execution Order

| Phase                     | Duration | Blockers         | Notes                                 |
| ------------------------- | -------- | ---------------- | ------------------------------------- |
| **2A: Flatten imports**   | 2h       | None             | Pure refactor; low risk               |
| **2B: Astro Integration** | 6–8h     | Requires 2A done | Largest change; test thoroughly       |
| **2C: Template**          | 2–3h     | Requires 2B done | Can start in parallel with 2B testing |

**Total:** ~10–13 hours, across ~2–3 days if run sequentially.

---

## Benefits After Phase 2

| Concern                | Before                                      | After                                        |
| ---------------------- | ------------------------------------------- | -------------------------------------------- |
| **Import complexity**  | `@fachada/core/types/profile.types`         | `@fachada/core`                              |
| **App file structure** | Apps hold `.astro` boilerplate (30+ files)  | Apps hold only configs (3 files)             |
| **New app setup**      | Copy entire `fachada/` project, delete apps | Clone `fachada-template`, edit configs       |
| **Framework clarity**  | Ambiguous what's core vs. app               | Clear: core = Astro + routing, apps = config |

---

## Success Criteria (All Phases 2A–2C Complete)

- [ ] All imports use `@fachada/core` (no sub-paths)
- [ ] All `.astro` files in `@fachada/core/src/astro/`
- [ ] `fachada/src/` contains only framework config shims and utils (no Astro)
- [ ] `fachadaIntegration()` exports from `@fachada/core`
- [ ] All 3 existing apps build with new integration
- [ ] `fachada-template` repo exists and is ready to clone
- [ ] New app from template: `yarn install && yarn dev` works
- [ ] All tests pass (488+)
- [ ] No TypeScript errors

---

## Risk Mitigation

- **2A is safe:** Pure find-and-replace; full test coverage
- **2B requires careful testing:** `.astro` file imports have deep relative paths; test each app build
- **2C is isolated:** Template can be tested independently before linking to main docs

**Rollback plan:** All phases are git commits; revert any phase if critical bugs surface.

---

## Next Steps

1. Decide: proceed all three phases, or Phase 2A + 2C (skip full Astro Integration for now)?
2. If proceeding: start with 2A (flatten imports) — done in 2h, unblocks 2B
3. Create tracking issue/ADR in repo documenting this plan
