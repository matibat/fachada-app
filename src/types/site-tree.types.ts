/**
 * SiteTree domain type definitions — Fachada v2
 *
 * SiteTreeConfig is a value object that describes the full page hierarchy of a
 * deployed app. It contains a mandatory landing page and optional subsections,
 * each with their own SEO metadata and widget composition.
 *
 * Downstream consumers:
 *   - RobotsGenerator  → robots.txt
 *   - LlmTextGenerator → llm.txt
 *   - SiteTreeValidator → build-time validation
 *   - Astro routes     → dynamic page generation
 */

/** Sentinel value — used by tests to confirm the module loaded correctly. */
export const SITE_TREE_VERSION = "v1" as const;

// ─── Robots Domain ────────────────────────────────────────────────────────────

/**
 * RobotsConfig — per-page crawler directives.
 * Omitting this field means: respect global defaults (allow all).
 */
export interface RobotsConfig {
  /** Paths to allow (defaults to implicit allow-all if omitted). */
  allow?: string[];
  /** Paths to disallow for all crawlers. */
  disallow?: string[];
  /** Crawl delay in seconds to request from polite crawlers. */
  crawlDelay?: number;
}

// ─── Page Metadata ────────────────────────────────────────────────────────────

/**
 * PageMeta — SEO and discovery metadata for a single page in the site tree.
 *
 * Every page in the tree (landing or subsection) must carry this shape so that
 * robots.txt, llm.txt, and <head> meta tags can be generated automatically.
 */
export interface PageMeta {
  /** URL path for this page. Landing must be "/". Subsections must start with "/". */
  path: string;
  /** Page-specific <title> tag content. */
  title: string;
  /** Meta description — used for <meta name="description"> and llm.txt. */
  description: string;
  /** Optional keyword list for SEO and structured data. */
  keywords?: string[];
  /** Override canonical URL (defaults to siteConfig.url + path). */
  canonicalUrl?: string;
  /** Override OG image for this page (defaults to AppConfig.assets.ogImage). */
  ogImage?: string;
  /** Per-page crawler directives written into robots.txt. */
  robots?: RobotsConfig;
  /**
   * Human-readable summary for AI indexers (llm.txt).
   * Should describe what a visitor finds on this page in 1–2 sentences.
   */
  llmSummary?: string;
}

// ─── Section Composition (shared by landing and subsections) ──────────────────

/**
 * SectionRef — lightweight reference to a visual section (widget block) placed
 * on a page. The full SectionConfig (with widgets) lives in AppConfig.page;
 * SiteTree only declares which sections appear in the routing hierarchy.
 *
 * Keeping this minimal prevents tight coupling between routing and widget config.
 */
export interface SectionRef {
  /** Matches a SectionConfig.id in AppConfig.page.sections. */
  id: string;
  /** Order of this section on the page (ascending). */
  order: number;
  /** Whether this section is rendered. Useful for toggling without removal. */
  enabled: boolean;
}

// ─── Tree Nodes ───────────────────────────────────────────────────────────────

/**
 * SubsectionDefinition — a non-root page in the site tree.
 * Corresponds to a route generated under a distinct URL path.
 */
export interface SubsectionDefinition {
  /** Unique identifier — used as a route key and for cross-references. */
  id: string;
  /** SEO and discovery metadata for this page. Path must NOT be "/". */
  meta: PageMeta;
  /** Ordered visual sections rendered on this subsection's page. */
  sections: SectionRef[];
}

/**
 * LandingDefinition — the mandatory root page of the site tree.
 * Always served at path "/".
 */
export interface LandingDefinition {
  /** SEO and discovery metadata. meta.path MUST be "/". */
  meta: PageMeta;
  /** Ordered visual sections rendered on the landing page. */
  sections: SectionRef[];
  /** Optional child pages accessible from the landing. */
  subsections?: SubsectionDefinition[];
}

// ─── Aggregate Root ───────────────────────────────────────────────────────────

/**
 * SiteTreeConfig — aggregate root for site structure and SEO configuration.
 *
 * Added to AppConfig as an optional field (backward-compatible).
 * When present, it overrides robots.txt and llm.txt generation logic and
 * enables multi-page routing for declared subsections.
 */
export interface SiteTreeConfig {
  /** Mandatory landing page at "/". */
  landing: LandingDefinition;
}
