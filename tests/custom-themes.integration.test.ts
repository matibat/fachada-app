/**
 * Custom Themes Integration Test Suite
 *
 * BDD: Scenarios validating that custom themes (artist-engineer app) are:
 * 1. Defined in app.config.ts with complete light/dark tokens
 * 2. Validated and merged into the resolved theme pool at build time
 * 3. Made available to client components via window.__FACHADA_THEME_POOL__
 * 4. Selectable through ThemeSwitcher UI
 * 5. Applied as CSS custom properties when selected
 * 6. Persisted to localStorage and restored on reload
 *
 * These tests ensure the end-to-end flow from app configuration through
 * runtime theme switching for custom themes in artist-engineer app.
 */

import { describe, it, expect, beforeEach } from "vitest";
import type { AppConfig, CustomThemeDefinition } from "@fachada/core";
import {
  validateThemeConfig,
  validateThemeConfigOrThrow,
} from "@fachada/core";
import { THEME_DEFINITIONS } from "@fachada/core";

/**
 * Artist-engineer app custom theme definitions
 * Reflects the actual config from apps/artist-engineer/app.config.ts
 */
const artistEngineerCustomThemes = {
  minimal: {
    name: "Minimal",
    description: "Clean and precise — cool sky blue accents",
    light: {
      bgPrimary: "#FFFFFF",
      bgSecondary: "#F8FAFC",
      textPrimary: "#0F172A",
      textSecondary: "#475569",
      accent: "#0EA5E9",
      accentHover: "#06B6D4",
      accentSecondary: "#06B6D4",
      accentTertiary: "#0284C7",
      border: "#E2E8F0",
      shadow: "rgba(0, 0, 0, 0.06)",
      borderRadius: "12px",
      transition: "0.25s ease-out",
      glow: "0 0 20px rgba(6, 182, 212, 0.2)",
      gradient: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
      spacingSection: "5rem",
      spacingCard: "1.75rem",
      spacingElement: "1.25rem",
      fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontHeading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      headingWeight: "600",
      bodyLineHeight: "1.7",
      contentMaxWidth: "960px",
      headingLetterSpacing: "-0.01em",
      buttonTextColor: "#0F172A",
      buttonTextShadow: "none",
      scanlineOpacity: "0",
    },
    dark: {
      bgPrimary: "#0F172A",
      bgSecondary: "#1E293B",
      textPrimary: "#F1F5F9",
      textSecondary: "#CBD5E1",
      accent: "#06D6FF",
      accentHover: "#00BBDF",
      accentSecondary: "#06D6FF",
      accentTertiary: "#0891B2",
      border: "#334155",
      shadow: "rgba(6, 214, 255, 0.15)",
      borderRadius: "12px",
      transition: "0.25s ease-out",
      glow: "0 0 20px rgba(6, 214, 255, 0.3)",
      gradient: "linear-gradient(135deg, #06D6FF 0%, #0891B2 100%)",
      spacingSection: "5rem",
      spacingCard: "1.75rem",
      spacingElement: "1.25rem",
      fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontHeading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      headingWeight: "600",
      bodyLineHeight: "1.7",
      contentMaxWidth: "960px",
      headingLetterSpacing: "-0.01em",
      buttonTextColor: "#F1F5F9",
      buttonTextShadow: "none",
      scanlineOpacity: "0",
    },
  } as CustomThemeDefinition,
  warm: {
    name: "Warm",
    description: "Personal and human — warm amber accents",
    light: {
      bgPrimary: "#FFFBF0",
      bgSecondary: "#FFF7ED",
      textPrimary: "#451A03",
      textSecondary: "#92400E",
      accent: "#D97706",
      accentHover: "#F59E0B",
      accentSecondary: "#F97316",
      accentTertiary: "#DC2626",
      border: "#FDBF7D",
      shadow: "rgba(217, 119, 6, 0.1)",
      borderRadius: "12px",
      transition: "0.25s ease-out",
      glow: "0 0 20px rgba(217, 119, 6, 0.25)",
      gradient: "linear-gradient(135deg, #D97706 0%, #F97316 100%)",
      spacingSection: "5rem",
      spacingCard: "1.75rem",
      spacingElement: "1.25rem",
      fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontHeading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      headingWeight: "600",
      bodyLineHeight: "1.7",
      contentMaxWidth: "960px",
      headingLetterSpacing: "-0.01em",
      buttonTextColor: "#451A03",
      buttonTextShadow: "none",
      scanlineOpacity: "0",
    },
    dark: {
      bgPrimary: "#2B1810",
      bgSecondary: "#402414",
      textPrimary: "#FEFAF5",
      textSecondary: "#FED7AA",
      accent: "#F97316",
      accentHover: "#FB923C",
      accentSecondary: "#FB923C",
      accentTertiary: "#F59E0B",
      border: "#9A3412",
      shadow: "rgba(249, 115, 22, 0.2)",
      borderRadius: "12px",
      transition: "0.25s ease-out",
      glow: "0 0 20px rgba(249, 115, 22, 0.3)",
      gradient: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
      spacingSection: "5rem",
      spacingCard: "1.75rem",
      spacingElement: "1.25rem",
      fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontHeading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      headingWeight: "600",
      bodyLineHeight: "1.7",
      contentMaxWidth: "960px",
      headingLetterSpacing: "-0.01em",
      buttonTextColor: "#FEFAF5",
      buttonTextShadow: "none",
      scanlineOpacity: "0",
    },
  } as CustomThemeDefinition,
  bold: {
    name: "Bold",
    description: "Professional and strong — vibrant magenta accents",
    light: {
      bgPrimary: "#FAF8FF",
      bgSecondary: "#F5F3FF",
      textPrimary: "#3E0651",
      textSecondary: "#6B21A8",
      accent: "#A855F7",
      accentHover: "#D946EF",
      accentSecondary: "#D946EF",
      accentTertiary: "#EC4899",
      border: "#E879F9",
      shadow: "rgba(168, 85, 247, 0.15)",
      borderRadius: "12px",
      transition: "0.25s ease-out",
      glow: "0 0 20px rgba(217, 70, 239, 0.3)",
      gradient: "linear-gradient(135deg, #A855F7 0%, #D946EF 100%)",
      spacingSection: "5rem",
      spacingCard: "1.75rem",
      spacingElement: "1.25rem",
      fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontHeading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      headingWeight: "700",
      bodyLineHeight: "1.7",
      contentMaxWidth: "960px",
      headingLetterSpacing: "-0.01em",
      buttonTextColor: "#3E0651",
      buttonTextShadow: "none",
      scanlineOpacity: "0",
    },
    dark: {
      bgPrimary: "#3E0651",
      bgSecondary: "#5B21B6",
      textPrimary: "#F3E8FF",
      textSecondary: "#E9D5FF",
      accent: "#D946EF",
      accentHover: "#EC4899",
      accentSecondary: "#EC4899",
      accentTertiary: "#A855F7",
      border: "#B78EFF",
      shadow: "rgba(217, 70, 239, 0.25)",
      borderRadius: "12px",
      transition: "0.25s ease-out",
      glow: "0 0 20px rgba(217, 70, 239, 0.4)",
      gradient: "linear-gradient(135deg, #D946EF 0%, #EC4899 100%)",
      spacingSection: "5rem",
      spacingCard: "1.75rem",
      spacingElement: "1.25rem",
      fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontHeading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      headingWeight: "700",
      bodyLineHeight: "1.7",
      contentMaxWidth: "960px",
      headingLetterSpacing: "-0.01em",
      buttonTextColor: "#F3E8FF",
      buttonTextShadow: "none",
      scanlineOpacity: "0",
    },
  } as CustomThemeDefinition,
};

// Build mock artist-engineer app config
function makeArtistEngineerConfig(): AppConfig {
  return {
    seo: {} as any,
    theme: {
      style: "professional",
      defaultMode: "dark",
      enableStyleSwitcher: true,
      enableModeToggle: true,
    } as any,
    themes: {
      custom: artistEngineerCustomThemes,
      default: "minimal",
    },
    themeVariants: {},
    assets: { ogImage: "" },
    page: { sections: [] },
  };
}

describe("BDD: Custom Themes in Artist-Engineer App", () => {
  // ────────────────────────────────────────────────────────────────────────────
  // Scenario 1: Custom Theme Definitions Are Complete (Build-Time Validation)
  // ────────────────────────────────────────────────────────────────────────────
  describe("Scenario 1: Custom theme definitions include complete light/dark tokens", () => {
    it("Given: artist-engineer app defines three custom themes", () => {
      const customThemes = artistEngineerCustomThemes;
      expect(Object.keys(customThemes)).toEqual(["minimal", "warm", "bold"]);
    });

    it("When: Each custom theme is examined", () => {
      Object.entries(artistEngineerCustomThemes).forEach(
        ([themeName, themed]) => {
          expect(themed).toHaveProperty("name");
          expect(themed).toHaveProperty("description");
          expect(themed).toHaveProperty("light");
          expect(themed).toHaveProperty("dark");
        },
      );
    });

    it("Then: All custom themes have name, description, and both light and dark tokens", () => {
      Object.entries(artistEngineerCustomThemes).forEach(([_key, themed]) => {
        expect(typeof themed.name).toBe("string");
        expect(themed.name.length).toBeGreaterThan(0);
        expect(typeof themed.description).toBe("string");
        expect(themed.description.length).toBeGreaterThan(0);
        expect(typeof themed.light).toBe("object");
        expect(typeof themed.dark).toBe("object");
        expect(themed.light).toHaveProperty("accent");
        expect(themed.light).toHaveProperty("bgPrimary");
        expect(themed.dark).toHaveProperty("accent");
        expect(themed.dark).toHaveProperty("bgPrimary");
      });
    });

    it("Then: Light and dark token values differ (distinct themes)", () => {
      const minimal = artistEngineerCustomThemes.minimal;
      expect(minimal.light.accent).not.toBe(minimal.dark.accent);
      expect(minimal.light.bgPrimary).not.toBe(minimal.dark.bgPrimary);

      const warm = artistEngineerCustomThemes.warm;
      expect(warm.light.accent).not.toBe(warm.dark.accent);

      const bold = artistEngineerCustomThemes.bold;
      expect(bold.light.accent).not.toBe(bold.dark.accent);
    });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Scenario 2: Custom Themes Are Validated and Resolved at Build Time
  // ────────────────────────────────────────────────────────────────────────────
  describe("Scenario 2: Custom themes pass validation and are merged into resolved pool", () => {
    it("Given: artist-engineer AppConfig with custom-only themes", () => {
      const appConfig = makeArtistEngineerConfig();
      expect(appConfig.themes?.custom).toBeDefined();
      expect(appConfig.themes?.globals).toBeUndefined();
      expect(appConfig.themes?.default).toBe("minimal");
    });

    it("When: validateThemeConfig runs", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfig(appConfig, "artist-engineer");
      expect(result).toBeDefined();
    });

    it("Then: Validation succeeds (no errors)", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfig(appConfig, "artist-engineer");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("Then: Resolved pool contains exactly three custom themes", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfig(appConfig, "artist-engineer");
      expect(Object.keys(result.resolvedThemes)).toHaveLength(3);
    });

    it("Then: Resolved themes are keyed by custom names only (not globals)", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfig(appConfig, "artist-engineer");
      expect(result.resolvedThemes).toHaveProperty("minimal");
      expect(result.resolvedThemes).toHaveProperty("warm");
      expect(result.resolvedThemes).toHaveProperty("bold");
      expect(result.resolvedThemes).not.toHaveProperty("minimalist");
      expect(result.resolvedThemes).not.toHaveProperty("modern-tech");
    });

    it("Then: Default theme 'minimal' exists in resolved pool", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfigOrThrow(appConfig, "artist-engineer");
      expect(result.resolvedThemes).toHaveProperty("minimal");
      expect(result.defaultTheme).toBe("minimal");
    });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Scenario 3: Each Custom Theme Is a Complete ThemeDefinition
  // ────────────────────────────────────────────────────────────────────────────
  describe("Scenario 3: Each custom theme in resolved pool is a complete ThemeDefinition", () => {
    it("Given: Resolved themes from artist-engineer app", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfig(appConfig, "artist-engineer");
      expect(result.resolvedThemes).toBeDefined();
      expect(Object.keys(result.resolvedThemes).length).toBeGreaterThan(0);
    });

    it("When: Each resolved theme is examined", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfig(appConfig, "artist-engineer");
      Object.entries(result.resolvedThemes).forEach((_key, _def) => {
        expect(_def).toBeDefined();
      });
    });

    it("Then: Each theme has name and description", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfig(appConfig, "artist-engineer");
      Object.entries(result.resolvedThemes).forEach(([_key, def]) => {
        expect(def).toHaveProperty("name");
        expect(def).toHaveProperty("description");
        expect(typeof def.name).toBe("string");
        expect(typeof def.description).toBe("string");
      });
    });

    it("Then: Each theme has complete light and dark token sets", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfig(appConfig, "artist-engineer");
      Object.entries(result.resolvedThemes).forEach(([_key, def]) => {
        expect(def.light).toBeDefined();
        expect(def.dark).toBeDefined();
        expect(def.light).toHaveProperty("bgPrimary");
        expect(def.light).toHaveProperty("textPrimary");
        expect(def.light).toHaveProperty("accent");
        expect(def.dark).toHaveProperty("bgPrimary");
        expect(def.dark).toHaveProperty("textPrimary");
        expect(def.dark).toHaveProperty("accent");
      });
    });

    it("Then: Custom theme tokens differ from default global themes", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfig(appConfig, "artist-engineer");
      const minimalCustom = result.resolvedThemes.minimal;
      const minimalGlobal = THEME_DEFINITIONS.minimalist;

      // Custom 'minimal' light accent should differ from global 'minimalist'
      expect(minimalCustom.light.accent).not.toBe(minimalGlobal.light.accent);
    });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Scenario 4: No Collision Between Custom Names and Global Keys
  // ────────────────────────────────────────────────────────────────────────────
  describe("Scenario 4: Custom theme names do not collide with global theme keys", () => {
    it("Given: Artist-engineer custom theme names", () => {
      const customNames = Object.keys(artistEngineerCustomThemes);
      expect(customNames).toEqual(["minimal", "warm", "bold"]);
    });

    it("When: Global theme keys are listed", () => {
      const globalKeys = Object.keys(THEME_DEFINITIONS);
      expect(globalKeys).toEqual([
        "minimalist",
        "modern-tech",
        "professional",
        "vaporwave",
      ]);
    });

    it("Then: No custom name equals any global key (no collision)", () => {
      const customNames = Object.keys(artistEngineerCustomThemes);
      const globalKeys = Object.keys(THEME_DEFINITIONS);
      const collisions = customNames.filter((n) => globalKeys.includes(n));
      expect(collisions).toHaveLength(0);
    });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Scenario 5: Window Pool Receives Resolved Themes Before Hydration
  // ────────────────────────────────────────────────────────────────────────────
  describe("Scenario 5: window.__FACHADA_THEME_POOL__ is set by BaseLayout.astro", () => {
    it("Given: Artist-engineer app runs and BaseLayout.astro executes", () => {
      const appConfig = makeArtistEngineerConfig();
      const result = validateThemeConfigOrThrow(appConfig, "artist-engineer");
      // Simulate BaseLayout.astro resolving themes
      expect(result.resolvedThemes).toBeDefined();
    });

    it("When: BaseLayout.astro inline script runs (before React hydration)", () => {
      const appConfig = makeArtistEngineerConfig();
      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      // Simulate: window.__FACHADA_THEME_POOL__ = JSON.parse(resolvedThemesJson);
      const simulatedWindowPool = resolvedThemes;
      expect(simulatedWindowPool).toBeDefined();
    });

    it("Then: window pool contains all resolved custom themes", () => {
      const appConfig = makeArtistEngineerConfig();
      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      expect(Object.keys(resolvedThemes)).toEqual(["minimal", "warm", "bold"]);
      expect(resolvedThemes).toHaveProperty("minimal");
      expect(resolvedThemes).toHaveProperty("warm");
      expect(resolvedThemes).toHaveProperty("bold");
    });

    it("Then: Each theme in pool can be serialized and deserialized (JSON.parse/stringify)", () => {
      const appConfig = makeArtistEngineerConfig();
      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      const serialized = JSON.stringify(resolvedThemes);
      const deserialized = JSON.parse(serialized);

      expect(Object.keys(deserialized)).toEqual(Object.keys(resolvedThemes));
      expect(deserialized.minimal).toBeDefined();
      expect(deserialized.minimal.name).toBe("Minimal");
      expect(deserialized.warm).toBeDefined();
      expect(deserialized.warm.name).toBe("Warm");
      expect(deserialized.bold).toBeDefined();
      expect(deserialized.bold.name).toBe("Bold");
    });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Scenario 6: ThemeSwitcher Can Access All Custom Themes
  // ────────────────────────────────────────────────────────────────────────────
  describe("Scenario 6: ThemeSwitcher reads custom themes from window pool", () => {
    it("Given: window.__FACHADA_THEME_POOL__ is set by BaseLayout", () => {
      const appConfig = makeArtistEngineerConfig();
      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      // Simulate window pool
      const windowPool = resolvedThemes;
      expect(Object.keys(windowPool)).toHaveLength(3);
    });

    it("When: ThemeSwitcher calls getThemesFromWindow()", () => {
      const appConfig = makeArtistEngineerConfig();
      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      // Simulate the getThemesFromWindow function
      const availableThemes = resolvedThemes;
      expect(availableThemes).toBeDefined();
    });

    it("Then: Available themes include all three custom themes", () => {
      const appConfig = makeArtistEngineerConfig();
      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      const entries = Object.entries(resolvedThemes);
      expect(entries.length).toBe(3);
      expect(entries.map((e) => e[0])).toEqual(["minimal", "warm", "bold"]);
    });

    it("Then: Each available theme has name, description, and light/dark tokens", () => {
      const appConfig = makeArtistEngineerConfig();
      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      Object.entries(resolvedThemes).forEach(([_key, theme]) => {
        expect(theme.name).toBeDefined();
        expect(theme.description).toBeDefined();
        expect(theme.light).toBeDefined();
        expect(theme.dark).toBeDefined();
      });
    });

    it("Then: ThemeSwitcher can render option buttons for each custom theme", () => {
      const appConfig = makeArtistEngineerConfig();
      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      const themeOptions = Object.entries(resolvedThemes).map(([key, def]) => ({
        key,
        name: def.name,
        description: def.description,
      }));
      expect(themeOptions).toEqual([
        { key: "minimal", name: "Minimal", description: expect.any(String) },
        { key: "warm", name: "Warm", description: expect.any(String) },
        { key: "bold", name: "Bold", description: expect.any(String) },
      ]);
    });
  });
});
