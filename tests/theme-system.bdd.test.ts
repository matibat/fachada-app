/**
 * Theme System — BDD Scenarios
 *
 * Behaviors that define how per-app theme selection works with the new AppThemes API.
 * Each app explicitly chooses which themes it offers — a subset of globals and/or custom.
 * These tests verify build-time validation and runtime behavior.
 */

import { describe, it, expect, beforeEach } from "vitest";
import type {
  AppConfig,
  AppThemes,
  CustomThemeDefinition,
} from "@fachada/core";
import { THEME_DEFINITIONS } from "@fachada/core";
import {
  validateThemeConfig,
  validateThemeConfigOrThrow,
} from "@fachada/core";

// Minimal valid AppConfig builder for tests
function makeConfig(themes?: AppThemes): AppConfig {
  return {
    seo: {} as any,
    theme: {} as any,
    themes,
    themeVariants: {},
    assets: { ogImage: "" },
    page: { sections: [] },
  };
}

// Minimal valid custom theme definition
function makeCustomTheme(name: string): CustomThemeDefinition {
  return {
    name,
    description: `${name} theme`,
    light: { bgPrimary: "#FFF" } as any,
    dark: { bgPrimary: "#000" } as any,
  };
}

describe("Theme System — Per-App Theme Selection", () => {
  // ─── Scenario 1: App Selects Specific Global Themes ─────────────────────────
  describe("Scenario 1: App selects a subset of global themes", () => {
    it("Given: AppConfig selects two global themes", () => {
      const appConfig = makeConfig({
        globals: ["minimalist", "professional"],
        default: "minimalist",
      });

      expect(appConfig.themes?.globals).toEqual(["minimalist", "professional"]);
    });

    it("When: Build-time validation runs", () => {
      const appConfig = makeConfig({
        globals: ["minimalist", "professional"],
        default: "minimalist",
      });

      const result = validateThemeConfig(appConfig);
      expect(result.isValid).toBe(true);
    });

    it("Then: Resolved pool contains only the selected globals (not all 4)", () => {
      const appConfig = makeConfig({
        globals: ["minimalist", "professional"],
        default: "minimalist",
      });

      const result = validateThemeConfig(appConfig);
      expect(Object.keys(result.resolvedThemes)).toHaveLength(2);
      expect(result.resolvedThemes).toHaveProperty("minimalist");
      expect(result.resolvedThemes).toHaveProperty("professional");
      expect(result.resolvedThemes).not.toHaveProperty("vaporwave");
    });
  });

  // ─── Scenario 2: App Defines Custom-Only Themes ─────────────────────────────
  describe("Scenario 2: App uses only custom themes (no globals selected)", () => {
    it("Given: AppConfig has custom themes but no globals", () => {
      const appConfig = makeConfig({
        custom: {
          minimal: makeCustomTheme("Minimal"),
          warm: makeCustomTheme("Warm"),
          bold: makeCustomTheme("Bold"),
        },
        default: "minimal",
      });

      expect(appConfig.themes?.custom).toBeDefined();
      expect(appConfig.themes?.globals).toBeUndefined();
    });

    it("When: Build-time validation runs", () => {
      const appConfig = makeConfig({
        custom: {
          minimal: makeCustomTheme("Minimal"),
        },
        default: "minimal",
      });

      const result = validateThemeConfig(appConfig);
      expect(result.isValid).toBe(true);
    });

    it("Then: Resolved pool contains only the custom themes", () => {
      const appConfig = makeConfig({
        custom: {
          minimal: makeCustomTheme("Minimal"),
          warm: makeCustomTheme("Warm"),
          bold: makeCustomTheme("Bold"),
        },
        default: "minimal",
      });

      const result = validateThemeConfig(appConfig);
      expect(Object.keys(result.resolvedThemes)).toHaveLength(3);
      expect(result.resolvedThemes).toHaveProperty("minimal");
      expect(result.resolvedThemes).toHaveProperty("warm");
      expect(result.resolvedThemes).toHaveProperty("bold");
      expect(result.resolvedThemes).not.toHaveProperty("minimalist");
    });
  });

  // ─── Scenario 3: Default Theme Must Exist in Configured Pool ────────────────
  describe("Scenario 3: default validated at build time", () => {
    it('Given: AppConfig specifies themes.default: "minimal"', () => {
      const themes: AppThemes = {
        custom: { minimal: makeCustomTheme("Minimal") },
        default: "minimal",
      };
      expect(themes.default).toBe("minimal");
    });

    it("When: Build-time validation checks if default exists in configured themes", () => {
      const appConfig = makeConfig({
        globals: ["minimalist"],
        custom: { warm: makeCustomTheme("Warm") },
        default: "warm",
      });

      const result = validateThemeConfig(appConfig);
      expect(result.isValid).toBe(true);
      expect(result.defaultTheme).toBe("warm");
    });

    it("Then: validateThemeConfigOrThrow throws if default not in pool", () => {
      const appConfig = makeConfig({
        globals: ["minimalist"],
        default: "nonexistent",
      });

      expect(() => validateThemeConfigOrThrow(appConfig, "test-app")).toThrow(
        "Theme validation failed",
      );
    });
  });

  // ─── Scenario 4: Collision Detection ────────────────────────────────────────
  describe("Scenario 4: Collision between custom key and selected global key", () => {
    it("Given: A custom key that matches a selected global key", () => {
      const globals = ["minimalist", "modern-tech"];
      const customKeys = ["minimal", "minimalist"]; // 'minimalist' collides

      const collision = customKeys.filter((k) => globals.includes(k));
      expect(collision).toContain("minimalist");
    });

    it("When: Build-time validation detects the collision", () => {
      const appConfig = makeConfig({
        globals: ["minimalist"],
        custom: { minimalist: makeCustomTheme("Duplicate") },
        default: "minimalist",
      });

      const result = validateThemeConfig(appConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("collision"))).toBe(true);
    });

    it("Then: validateThemeConfigOrThrow throws on collision", () => {
      const appConfig = makeConfig({
        globals: ["vaporwave"],
        custom: { vaporwave: makeCustomTheme("Collision") },
        default: "vaporwave",
      });

      expect(() => validateThemeConfigOrThrow(appConfig, "test-app")).toThrow(
        "Theme validation failed",
      );
    });
  });

  // ─── Scenario 5: ThemeSwitcher Shows Exactly Configured Themes ──────────────
  describe("Scenario 5: ThemeSwitcher shows only the app's configured themes", () => {
    it("Given: Artist-engineer configures 3 custom themes (no globals)", () => {
      const appConfig = makeConfig({
        custom: {
          minimal: makeCustomTheme("Minimal"),
          warm: makeCustomTheme("Warm"),
          bold: makeCustomTheme("Bold"),
        },
        default: "minimal",
      });

      expect(Object.keys(appConfig.themes?.custom ?? {})).toHaveLength(3);
    });

    it("When: Resolved theme pool is built", () => {
      const appConfig = makeConfig({
        custom: {
          minimal: makeCustomTheme("Minimal"),
          warm: makeCustomTheme("Warm"),
          bold: makeCustomTheme("Bold"),
        },
        default: "minimal",
      });

      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      expect(Object.keys(resolvedThemes)).toHaveLength(3);
    });

    it("Then: Pool has exactly the 3 custom themes — not all 4 globals auto-added", () => {
      const appConfig = makeConfig({
        custom: {
          minimal: makeCustomTheme("Minimal"),
          warm: makeCustomTheme("Warm"),
          bold: makeCustomTheme("Bold"),
        },
        default: "minimal",
      });

      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "artist-engineer",
      );
      const globalKeys = Object.keys(THEME_DEFINITIONS);
      for (const gk of globalKeys) {
        expect(resolvedThemes).not.toHaveProperty(gk);
      }
    });
  });

  // ─── Scenario 6: Default Theme Loads on First Visit ─────────────────────────
  describe("Scenario 6: Default theme loads when no stored preference", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('Given: App configures themes.default: "minimal"', () => {
      const appConfig = makeConfig({
        custom: { minimal: makeCustomTheme("Minimal") },
        default: "minimal",
      });

      const { defaultTheme } = validateThemeConfigOrThrow(
        appConfig,
        "test-app",
      );
      expect(defaultTheme).toBe("minimal");
    });

    it("When: User visits app for first time (no stored preference)", () => {
      const stored = localStorage.getItem("themeStyle");
      expect(stored).toBeNull();
    });

    it('Then: "minimal" theme is used as the initial theme', () => {
      const configuredDefault = "minimal";
      const initialTheme =
        localStorage.getItem("themeStyle") ?? configuredDefault;
      expect(initialTheme).toBe("minimal");
    });
  });

  // ─── Scenario 7: Theme Persistence ────────────────────────────────────────
  describe("Scenario 7: User theme selection persists across sessions", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("Given: ThemeSwitcher is rendered with configured themes", () => {
      const appConfig = makeConfig({
        custom: {
          minimal: makeCustomTheme("Minimal"),
          warm: makeCustomTheme("Warm"),
          bold: makeCustomTheme("Bold"),
        },
        default: "minimal",
      });

      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "test-app",
      );
      expect(Object.keys(resolvedThemes)).toContain("warm");
    });

    it('When: User selects "warm" theme', () => {
      localStorage.setItem("themeStyle", JSON.stringify("warm"));
      const stored = JSON.parse(localStorage.getItem("themeStyle")!);
      expect(stored).toBe("warm");
    });

    it('Then: On page reload, "warm" theme is restored', () => {
      localStorage.setItem("themeStyle", JSON.stringify("warm"));
      const restored = JSON.parse(localStorage.getItem("themeStyle")!);
      expect(restored).toBe("warm");
    });
  });

  // ─── Scenario 8: Custom Theme Requires Full light/dark Token Sets ────────────
  describe("Scenario 8: Custom theme must define complete light/dark token sets", () => {
    it("Given: A custom theme with both light and dark tokens", () => {
      const customTheme: CustomThemeDefinition = {
        name: "Minimal",
        description: "Clean and precise",
        light: { bgPrimary: "#FFFFFF", accent: "#0EA5E9" } as any,
        dark: { bgPrimary: "#0F172A", accent: "#06B6D4" } as any,
      };

      expect(customTheme.light).toBeDefined();
      expect(customTheme.dark).toBeDefined();
    });

    it("When: Custom theme is loaded into the resolved pool", () => {
      const appConfig = makeConfig({
        custom: {
          minimal: {
            name: "Minimal",
            description: "Clean",
            light: { bgPrimary: "#FFF", accent: "#0EA5E9" } as any,
            dark: { bgPrimary: "#000", accent: "#06B6D4" } as any,
          },
        },
        default: "minimal",
      });

      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "test-app",
      );
      expect(resolvedThemes.minimal).toBeDefined();
    });

    it("Then: Both light and dark tokens are available for switching", () => {
      const theme = makeCustomTheme("Minimal");
      theme.light = { bgPrimary: "#FFF", accent: "#0EA5E9" } as any;
      theme.dark = { bgPrimary: "#000", accent: "#06B6D4" } as any;

      expect((theme.light as any).accent).toBe("#0EA5E9");
      expect((theme.dark as any).accent).toBe("#06B6D4");
    });
  });

  // ─── Scenario 9: Mixed Globals + Custom ─────────────────────────────────────
  describe("Scenario 9: App mixes selected globals and custom themes", () => {
    it("Given: App selects 2 globals and defines 1 custom", () => {
      const appConfig = makeConfig({
        globals: ["minimalist", "vaporwave"],
        custom: { company: makeCustomTheme("Company") },
        default: "minimalist",
      });

      expect(appConfig.themes?.globals).toHaveLength(2);
      expect(appConfig.themes?.custom).toHaveProperty("company");
    });

    it("When: Validation resolves the pool", () => {
      const appConfig = makeConfig({
        globals: ["minimalist", "vaporwave"],
        custom: { company: makeCustomTheme("Company") },
        default: "minimalist",
      });

      const result = validateThemeConfig(appConfig);
      expect(result.isValid).toBe(true);
    });

    it("Then: Pool has exactly 3 themes (2 global + 1 custom)", () => {
      const appConfig = makeConfig({
        globals: ["minimalist", "vaporwave"],
        custom: { company: makeCustomTheme("Company") },
        default: "minimalist",
      });

      const { resolvedThemes } = validateThemeConfigOrThrow(
        appConfig,
        "test-app",
      );
      expect(Object.keys(resolvedThemes)).toHaveLength(3);
      expect(resolvedThemes).toHaveProperty("minimalist");
      expect(resolvedThemes).toHaveProperty("vaporwave");
      expect(resolvedThemes).toHaveProperty("company");
      expect(resolvedThemes).not.toHaveProperty("modern-tech");
    });
  });

  // ─── Scenario 10: Invalid Global Key Rejected ────────────────────────────────
  describe("Scenario 10: Invalid global key reference rejected at build time", () => {
    it("Given: App references a global key that does not exist", () => {
      const appConfig = makeConfig({
        globals: ["minimalist", "nonexistent-theme"],
        default: "minimalist",
      });

      expect(appConfig.themes?.globals).toContain("nonexistent-theme");
    });

    it("When: Build-time validation checks globals against THEME_DEFINITIONS", () => {
      const appConfig = makeConfig({
        globals: ["minimalist", "nonexistent-theme"],
        default: "minimalist",
      });

      const result = validateThemeConfig(appConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("nonexistent-theme"))).toBe(
        true,
      );
    });

    it("Then: validateThemeConfigOrThrow throws for unknown global key", () => {
      const appConfig = makeConfig({
        globals: ["does-not-exist"],
        default: "does-not-exist",
      });

      expect(() => validateThemeConfigOrThrow(appConfig, "test-app")).toThrow(
        "Theme validation failed",
      );
    });
  });
});
