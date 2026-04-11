# DDD Architecture Plan — Fachada v2

**Date**: 2026-04-10  
**Scope**: Evolve the current Astro/React portfolio into a multi-app, widget-driven, token-based platform per the v2 spec.  
**Status**: Draft — pending implementation

---

## Feasibility Assessment

### Summary

The new requirements are **feasible**. The current codebase already contains the structural primitives needed (profile switching, ThemeContext, token maps, CSS var injection). The delta is bounded: type unification, a widget composition layer, and theme-variant deep merge. No platform replacement is required.

### What Already Exists

| Requirement                     | Current State                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------- |
| Multiple apps from one codebase | `APP` env var + `/src/profiles/` registry — semantically equivalent to profiles |
| Build-time config selection     | `import.meta.env.APP` resolved in `astro.config.mjs`                            |
| Token-based theming             | `ThemeTokens` interface + `CSS_VAR_MAP` in `theme.config.ts`                    |
| `useTheme()` hook               | `ThemeContext.tsx` exposes `activeTokens`                                       |
| Color-mode variants             | `ThemeDefinition.light / .dark` structure                                       |
| Decoupled profile config        | `SiteConfig + ProfileConfig` split already isolates identity from presentation  |

### What Is Missing

| Requirement                                           | Gap                                                                                   | Risk                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| Unified `AppConfig` aggregate                         | Currently split across `SiteConfig` + `ProfileConfig` + `ThemeConfig`; no single root | Low — type merge, no logic change    |
| `themeVariants` + deep merge                          | Only a single active `ThemeStyle` today; no runtime variant overlay                   | Low — additive                       |
| `PageConfig → SectionConfig → WidgetConfig` hierarchy | Sections are hardcoded in `index.astro`; no `WidgetRegistry` or `WidgetRenderer`      | Medium — structural refactor         |
| `AssetResolver` domain service                        | Assets referenced ad-hoc; no theme-aware resolution                                   | Low — additive                       |
| `/apps/` folder structure                             | Lives in `/src/profiles/`; naming and shape differ from spec                          | Low — rename + reshape               |
| i18n via `useTranslation`                             | Not implemented                                                                       | Low — additive, out of critical path |

### Risk Areas

**SPA framing vs Astro MPA**: The spec states "build-time SPA". The current site is a single-route Astro page (`index.astro`) — it is already effectively SPA-like at runtime. No client-side router is needed. Astro's island model satisfies the widget-hydration contract without a framework swap. **No platform migration required.**

**Widget lazy-loading in Astro**: `() => import('./widgets/X')` patterns work in React. In Astro, dynamic islands require `client:load` or `client:visible` on the rendered element. The `WidgetRenderer` must output Astro components (`.astro`) or React islands with explicit hydration directives — not bare dynamic imports. This constrains how the registry is implemented.

**Backward compatibility**: The existing `SiteConfig + ProfileConfig` types are consumed by all section components. Introducing `AppConfig` must preserve the existing shape or update all consumers atomically.

---

## Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────────┐
│  Core (app-agnostic)                                                │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────────┐   │
│  │  AppConfig    │  │  Theme Domain │  │  Widget Domain       │   │
│  │  (aggregate)  │  │  (tokens,     │  │  (registry,          │   │
│  │               │  │   variants,   │  │   renderer,          │   │
│  │               │  │   resolver)   │  │   contracts)         │   │
│  └───────────────┘  └───────────────┘  └──────────────────────┘   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Asset Domain (AssetResolver)                                 │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Apps (config packages — one per deployable identity)               │
│  /apps/default-fachada/    /apps/engineer/    /apps/artist-engineer/ │
│  Each exports: app.config.ts, assets/, translations/               │
└─────────────────────────────────────────────────────────────────────┘
```

### Domain Model

```
AppConfig (Aggregate Root)
├── seo: SEOConfig                     ← value object (identity)
├── languages: LanguageConfig[]        ← value object (i18n)
├── theme: ThemeConfig                 ← value object (base tokens)
│   └── tokens: ThemeTokens
├── themeVariants: Record<string, ThemeOverride>   ← collection
├── activeTheme?: string               ← selector
├── assets: AssetConfig                ← value object
└── page: PageConfig                   ← aggregate
    └── sections: SectionConfig[]
        └── widgets: WidgetConfig[]

WidgetRegistry (Domain Service)
WidgetRenderer (Application Service)
AssetResolver (Domain Service)
ThemeResolver (Domain Service — deepMerge strategy)
```

---

## Implementation Phases

### Phase 0 — DDD Type Foundations

**Goal**: Define the canonical `AppConfig` aggregate and all supporting value-object types. No production code changes.

**Deliverables**:

- `src/types/app.types.ts` — `AppConfig`, `PageConfig`, `SectionConfig`, `WidgetConfig`, `ThemeOverride`, `AssetConfig`
- Update `src/types/profile.types.ts` — keep existing types as aliases where possible for backward compatibility

**Acceptance criteria**:

- `AppConfig` compiles with no errors
- All registered app profiles (`default-fachada`, `artist-engineer`) satisfy `AppConfig` by structural subtyping or explicit cast
- No existing component imports break

**DDD notes**:

- `AppConfig` is the aggregate root; all other types are value objects or nested aggregates
- `ThemeTokens` shape must extend current `ThemeTokens` (not replace) to avoid regressions — the new spec's `color / spacing / typography` groups map to subsets of the existing flat token map

---

### Phase 1 — Theme Domain: Tokens + Variants

**Goal**: Replace the current `ThemeStyle`-keyed lookup with a `base + variants deepMerge` resolution strategy.

**Deliverables**:

- `src/core/theme/ThemeResolver.ts` — `resolveTheme(base, variants, activeVariant): ThemeTokens`
- Update `ThemeContext.tsx` — use `ThemeResolver` instead of direct index lookup
- Update `useTheme()` return shape to include `{ tokens }` alongside existing state
- Existing `ThemeStyle` enum preserved as the default variant key convention

**Acceptance criteria**:

- `resolveTheme(base, { dark: override }, 'dark')` returns deep-merged token set
- `useTheme().tokens` is identical to `activeTokens` for all existing themes
- `themeVariants[activeTheme]` override applies without full re-render
- All existing tests pass; coverage ≥ 80%

**DDD notes**:

- `ThemeResolver` is a pure domain service (no side effects, no React)
- `ThemeOverride = Partial<ThemeConfig>` — partial deep merge, not replacement
- The variant key (`activeTheme`) is a value in `AppConfig`, not a runtime enum

---

### Phase 2 — Widget Domain: Registry + Renderer

**Goal**: Extract existing sections into widgets and introduce a `WidgetRegistry` + `WidgetRenderer` that drives page composition from `PageConfig`.

**Deliverables**:

- `src/core/widgets/WidgetRegistry.ts` — typed registry mapping `type → component`
- `src/core/widgets/WidgetRenderer.astro` — iterates `SectionConfig.widgets[]`, resolves and renders each
- `src/widgets/` — existing 6 sections (`Hero`, `About`, `Skills`, `Projects`, `Contact`, `RoleExplorer`) moved here as widgets, unchanged in implementation
- Update `src/pages/index.astro` — replace hardcoded section list with `WidgetRenderer` driven by `appConfig.page`

**Acceptance criteria**:

- Adding a new widget requires only: create component in `src/widgets/`, register in `WidgetRegistry`
- Page order and visibility are fully controlled by `AppConfig.page.sections`
- All existing sections render identically (no visual regression)
- Unknown widget `type` renders nothing and logs a warning — no runtime crash
- E2E tests pass for all primary user journeys

**DDD notes**:

- `WidgetRegistry` is a domain service: it maps type strings to component factories
- `WidgetRenderer` is an application service: it orchestrates domain services (registry + theme + assets) to produce UI
- Individual widgets are domain entities — they receive resolved tokens via `useTheme()`, never raw config props
- Astro constraint: dynamic hydration requires `client:visible` on React widgets; `.astro` widgets hydrate at build time. Registry must distinguish between these two kinds

---

### Phase 3 — Asset Domain: AssetResolver

**Goal**: Introduce a theme-aware `AssetResolver` that centralises all asset lookups.

**Deliverables**:

- `src/core/assets/AssetResolver.ts` — `resolveAsset(key, assets, activeVariant): string`
- Update `AppConfig.assets` in all existing app configs
- Replace ad-hoc `ogImage` and image refs with `resolveAsset` calls

**Acceptance criteria**:

- `resolveAsset('logo', assets, 'dark')` returns `assets.logo.dark ?? assets.logo.default`
- `resolveAsset('logo', assets, undefined)` returns `assets.logo.default`
- Missing key returns `undefined` without throwing
- All image references in existing templates still resolve correctly

**DDD notes**:

- `AssetResolver` is a pure domain service
- Asset variants use the same `activeTheme` key as theme variants — single selector in `AppConfig`

---

### Phase 4 — App Structure Migration

**Goal**: Move app config packages from `/src/profiles/` to `/apps/` and align with the `app.config.ts` export convention.

**Deliverables**:

- `/apps/default-fachada/app.config.ts`
- `/apps/engineer/app.config.ts`
- `/apps/artist-engineer/app.config.ts`
- Update `src/core/app/AppLoader.ts` — replaces `src/profiles/index.ts`; reads `APP` env var
- Update `astro.config.mjs` — `APP` env var replaces `PROFILE` (removed; no backward compatibility)
- Update `README.md` build instructions

**Acceptance criteria**:

- `APP=engineer yarn build` produces engineer app; `APP=default-fachada yarn build` produces default
- Existing CI/CD pipeline passes without modification (requires APP env var update)

**DDD notes**:

- Each `/apps/app-X/` is a config package, not a bounded context — it is data, not logic
- `AppLoader` is an infrastructure concern (env resolution + registry lookup)
- The Core domain has zero knowledge of which app is active — it only sees the resolved `AppConfig`

---

### Phase 5 — i18n (Deferred)

**Goal**: Add `useTranslation` hook and app-scoped translation files.

**Deliverables**:

- `src/core/i18n/useTranslation.ts`
- `/apps/*/translations/` folders

**Acceptance criteria**: `useTranslation('hero.title')` returns the correct string for the active app's language config.

**DDD notes**: i18n is a cross-cutting concern, not a bounded context. Keep it as a thin adapter over translation files; avoid coupling to theme or widget domains.

---

## Dependency Graph

```
Phase 0 (types)
    └── Phase 1 (theme domain)
    └── Phase 2 (widget domain)       ← depends on Phase 0 + Phase 1
    └── Phase 3 (asset domain)        ← depends on Phase 0
Phase 1 + Phase 2 + Phase 3
    └── Phase 4 (app structure)       ← depends on all domains being stable
Phase 4
    └── Phase 5 (i18n)               ← additive, no blocking dependencies
```

Phases 1, 2, and 3 have no inter-dependencies and can proceed in parallel after Phase 0.

---

## Invariants (must hold at all times)

1. **No widget reads raw `AppConfig` directly** — only resolved tokens from `useTheme()` and explicit props from `WidgetConfig.props`
2. **Core has no import from `/apps/`** — the dependency arrow is one-way
3. **`ThemeResolver` is a pure function** — given the same inputs it always returns the same tokens
4. **`WidgetRegistry` is the only place that names concrete widget components** — nothing else imports widgets by name
5. **`activeTheme` selector is a string key** — never an imported enum value from an app config

---

## Open Questions

| #   | Question                                                                                        | Impact                  | Resolution                                                                                        |
| --- | ----------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Should `AppConfig.seo` replace the current `SiteConfig` identity fields (name, author, social)? | Phase 0 type shape      | Keep `SiteConfig` as a named sub-object inside `AppConfig` for clarity; do not flatten            |
| 2   | Should `WidgetRenderer` be `.astro` or React?                                                   | Phase 2 hydration model | `.astro` — only widgets that need interactivity declare `client:*`; the renderer itself is static |
| 3   | Does `activeTheme` need to be runtime-switchable (query param) or build-time only?              | Phase 1 ThemeContext    | Build-time default; runtime override via query param is additive and deferred to Phase 1b         |
| 4   | Do all 6 existing sections become widgets immediately, or incrementally?                        | Phase 2 scope           | All 6 in Phase 2; the old import list in `index.astro` is the rollback point                      |
