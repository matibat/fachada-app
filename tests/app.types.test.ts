/**
 * Phase 0 — AppConfig aggregate type tests
 *
 * BDD: tests are written against the expected API before implementation.
 * The value import of APP_CONFIG_VERSION ensures RED until app.types.ts exists.
 */
import { describe, it, expect } from "vitest";
import {
  APP_CONFIG_VERSION,
  type AppConfig,
  type PageConfig,
  type SectionConfig,
  type ThemeOverride,
  type AssetConfig,
} from "../src/types/app.types";
import { siteConfig } from "../src/profiles/default-fachada/site.config";
import { profileConfig } from "../src/profiles/default-fachada/profile.config";
import type { ThemeTokens } from "../src/utils/theme.config";

// ─── Scenario 0: module is loadable ──────────────────────────────────────────

describe("Scenario 0: app.types module exists and exports a version sentinel", () => {
  it("Given: the module is imported, When: APP_CONFIG_VERSION is accessed, Then: it is 'v2'", () => {
    expect(APP_CONFIG_VERSION).toBe("v2");
  });
});

// ─── Scenario 1: AppConfig aggregate has the canonical top-level shape ────────

describe("Scenario 1: AppConfig aggregate has the canonical top-level shape", () => {
  it("Given: a well-formed object, When: typed as AppConfig, Then: it has seo, theme, themeVariants, assets, and page fields", () => {
    const config: AppConfig = {
      seo: {
        name: siteConfig.name,
        title: siteConfig.title,
        description: siteConfig.description,
        author: siteConfig.author,
        url: siteConfig.url,
        ogImage: siteConfig.ogImage,
        social: siteConfig.social,
        location: siteConfig.location,
        roles: siteConfig.roles,
        primaryRole: siteConfig.primaryRole,
        analytics: siteConfig.analytics,
      },
      theme: profileConfig.theme,
      themeVariants: {},
      assets: { ogImage: siteConfig.ogImage },
      page: {
        sections: [],
      },
    };

    expect(config.seo.name).toBe(siteConfig.name);
    expect(config.theme.style).toBe(profileConfig.theme.style);
    expect(config.themeVariants).toBeDefined();
    expect(config.assets).toBeDefined();
    expect(Array.isArray(config.page.sections)).toBe(true);
  });
});

// ─── Scenario 2: PageConfig contains an ordered list of SectionConfigs ───────

describe("Scenario 2: PageConfig contains an ordered list of SectionConfigs", () => {
  it("Given: a PageConfig, When: I access sections, Then: it is SectionConfig[]", () => {
    const page: PageConfig = {
      sections: [
        { id: "hero", enabled: true, order: 1, widgets: [] },
        { id: "about", enabled: true, order: 2, widgets: [] },
      ],
    };

    expect(page.sections).toHaveLength(2);
    expect(page.sections[0].id).toBe("hero");
    expect(page.sections[1].id).toBe("about");
  });
});

// ─── Scenario 3: SectionConfig carries a widgets array ───────────────────────

describe("Scenario 3: SectionConfig carries a widgets array", () => {
  it("Given: a SectionConfig, When: I access widgets, Then: each item is a WidgetConfig with type and props", () => {
    const section: SectionConfig = {
      id: "hero",
      enabled: true,
      order: 1,
      widgets: [{ type: "HeroWidget", props: { headline: "Hello" } }],
    };

    expect(section.widgets).toHaveLength(1);
    expect(section.widgets[0].type).toBe("HeroWidget");
    expect(section.widgets[0].props).toEqual({ headline: "Hello" });
  });

  it("Given: a SectionConfig, When: widgets is empty, Then: no error", () => {
    const section: SectionConfig = {
      id: "about",
      enabled: false,
      order: 2,
      widgets: [],
    };
    expect(section.widgets).toHaveLength(0);
  });
});

// ─── Scenario 4: ThemeOverride is a partial overlay of ThemeTokens ───────────

describe("Scenario 4: ThemeOverride is a partial overlay of ThemeTokens", () => {
  it("Given: a ThemeOverride with only some token keys, When: used as overlay, Then: it compiles and partially defines tokens", () => {
    const override: ThemeOverride = {
      tokens: {
        accent: "#ff00ff",
        bgPrimary: "#0a0a0a",
      } as Partial<ThemeTokens>,
    };

    expect(override.tokens?.accent).toBe("#ff00ff");
    expect(override.tokens?.bgPrimary).toBe("#0a0a0a");
    expect(override.tokens?.textPrimary).toBeUndefined();
  });

  it("Given: an empty ThemeOverride, When: used as overlay, Then: it is valid", () => {
    const override: ThemeOverride = {};
    expect(override).toBeDefined();
  });
});

// ─── Scenario 5: AssetConfig holds the default ogImage ───────────────────────

describe("Scenario 5: AssetConfig holds asset references by key", () => {
  it("Given: an AssetConfig, When: I access ogImage, Then: it is a string path", () => {
    const assets: AssetConfig = {
      ogImage: "/og-image.png",
    };
    expect(assets.ogImage).toBe("/og-image.png");
  });

  it("Given: an AssetConfig without optional fields, When: constructed, Then: only ogImage is required", () => {
    const assets: AssetConfig = { ogImage: "/fallback.png" };
    expect(typeof assets.ogImage).toBe("string");
  });
});

// ─── Scenario 6: Existing profiles satisfy AppConfig by structural subtyping ──

describe("Scenario 6: Existing profile data maps to AppConfig without data loss", () => {
  it("Given: default-fachada siteConfig + profileConfig, When: shaped into AppConfig, Then: all existing fields are preserved", () => {
    const config: AppConfig = {
      seo: {
        name: siteConfig.name,
        title: siteConfig.title,
        description: siteConfig.description,
        author: siteConfig.author,
        url: siteConfig.url,
        ogImage: siteConfig.ogImage,
        social: siteConfig.social,
        location: siteConfig.location,
        roles: siteConfig.roles,
        primaryRole: siteConfig.primaryRole,
        analytics: siteConfig.analytics,
      },
      theme: profileConfig.theme,
      themeVariants: {},
      assets: { ogImage: siteConfig.ogImage },
      page: {
        sections: profileConfig.sections.map((s) => ({
          ...s,
          widgets: [],
        })),
      },
    };

    expect(config.seo.name).toBe("Fachada");
    expect(config.seo.social.github).toBeDefined();
    expect(config.seo.roles).toHaveLength(siteConfig.roles.length);
    expect(config.page.sections).toHaveLength(profileConfig.sections.length);
    expect(config.page.sections.every((s) => Array.isArray(s.widgets))).toBe(
      true,
    );
  });
});
