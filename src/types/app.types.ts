/**
 * AppConfig aggregate — DDD v2 canonical type definitions.
 *
 * AppConfig is the aggregate root for the entire application.
 * All other types in this file are value objects or nested aggregates.
 *
 * Backward compatibility: SiteConfig + ProfileConfig remain in profile.types.ts
 * as the existing components still consume them directly. AppConfig composes them
 * by structural subtyping — no import from /apps/ or external context allowed.
 */

import type { ThemeConfig, ThemeTokens } from "../utils/theme.config";
import type { SiteConfig, PageSectionConfig } from "./profile.types";

/** Sentinel value — used by tests to confirm the module loaded correctly. */
export const APP_CONFIG_VERSION = "v2" as const;

// ─── Widget Domain ────────────────────────────────────────────────────────────

/**
 * WidgetConfig — identifies a concrete widget component and its initialisation
 * props. `type` maps to a key in WidgetRegistry; `props` is passed as-is.
 */
export interface WidgetConfig {
  /** Registry key that identifies the component, e.g. "HeroWidget" */
  type: string;
  /** Arbitrary initialisation data forwarded to the widget as props */
  props?: Record<string, unknown>;
}

/**
 * SectionConfig — extends the existing PageSectionConfig with a widgets list.
 * Adding `widgets` here preserves backward-compat with existing sections config.
 */
export interface SectionConfig extends PageSectionConfig {
  /** Ordered list of widgets to render inside this section */
  widgets: WidgetConfig[];
}

/**
 * PageConfig — top-level page composition descriptor.
 */
export interface PageConfig {
  sections: SectionConfig[];
}

// ─── Theme Domain ─────────────────────────────────────────────────────────────

/**
 * ThemeOverride — a partial token overlay applied on top of a base ThemeConfig.
 * Used as values in AppConfig.themeVariants.
 */
export interface ThemeOverride {
  /** Sparse token map; missing keys fall back to the base theme tokens */
  tokens?: Partial<ThemeTokens>;
}

// ─── Asset Domain ─────────────────────────────────────────────────────────────

/**
 * AssetConfig — theme-aware asset references keyed by logical name.
 * Each entry may be a plain string (default) or a variant map.
 */
export interface AssetConfig {
  ogImage: string;
  [key: string]: string | Record<string, string>;
}

// ─── AppConfig Aggregate Root ─────────────────────────────────────────────────

/**
 * AppConfig — aggregate root for Fachada v2.
 *
 * `seo` reuses SiteConfig to preserve backward compatibility with all existing
 * components that already consume that shape.
 */
export interface AppConfig {
  /** Identity and SEO metadata (maps to current SiteConfig) */
  seo: SiteConfig;
  /** Base theme configuration */
  theme: ThemeConfig;
  /** Named partial token overlays; keys match the activeTheme selector */
  themeVariants: Record<string, ThemeOverride>;
  /** Active theme variant key — selects from themeVariants */
  activeTheme?: string;
  /** Asset references, optionally with per-variant overrides */
  assets: AssetConfig;
  /** Page composition hierarchy */
  page: PageConfig;
}
