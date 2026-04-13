/**
 * WidgetLayoutResolution — unit tests for themeLayouts resolution precedence.
 *
 * Covers the BDD behaviors required by task P-08:
 *   B1: themeLayouts entry for active theme + widget takes precedence over section.layout
 *   B2: falls back to section.layout when themeLayouts has no entry for the active theme
 *   B3: falls back to section.layout when themeLayouts is undefined
 */
import { describe, it, expect } from "vitest";
import { resolveWidgetLayout } from "@fachada/core/widgets/resolveWidgetLayout";

describe("Scenario 5: resolveWidgetLayout — themeLayouts resolution precedence", () => {
  // ── B1 ──────────────────────────────────────────────────────────────────────
  describe("B1: themeLayouts layout takes precedence over section.layout", () => {
    it("Given: themeLayouts defines 'split' for minimal/hero, When: activeTheme='minimal', Then: returns 'split' (not section.layout 'centered')", () => {
      const result = resolveWidgetLayout(
        "hero",
        "centered",
        { minimal: { hero: "split" } },
        "minimal",
      );
      expect(result).toBe("split");
    });

    it("Given: themeLayouts defines 'list' for warm/skills, When: activeTheme='warm', section.layout='grid-3', Then: returns 'list'", () => {
      const result = resolveWidgetLayout(
        "skills",
        "grid-3",
        { warm: { skills: "list" } },
        "warm",
      );
      expect(result).toBe("list");
    });
  });

  // ── B2 ──────────────────────────────────────────────────────────────────────
  describe("B2: falls back to section.layout when no entry for the active theme", () => {
    it("Given: themeLayouts only has 'minimal', When: activeTheme='vaporwave', Then: returns section.layout 'centered'", () => {
      const result = resolveWidgetLayout(
        "hero",
        "centered",
        { minimal: { hero: "split" } },
        "vaporwave",
      );
      expect(result).toBe("centered");
    });

    it("Given: themeLayouts only has 'minimal', When: activeTheme=undefined, Then: returns section.layout 'card'", () => {
      const result = resolveWidgetLayout(
        "about",
        "card",
        { minimal: { about: "plain" } },
        undefined,
      );
      expect(result).toBe("card");
    });
  });

  // ── B3 ──────────────────────────────────────────────────────────────────────
  describe("B3: falls back when themeLayouts is undefined", () => {
    it("Given: themeLayouts is undefined, When: any activeTheme, Then: returns section.layout", () => {
      const result = resolveWidgetLayout(
        "hero",
        "centered",
        undefined,
        "minimal",
      );
      expect(result).toBe("centered");
    });

    it("Given: themeLayouts is undefined and section.layout is undefined, Then: returns undefined", () => {
      const result = resolveWidgetLayout(
        "hero",
        undefined,
        undefined,
        "minimal",
      );
      expect(result).toBeUndefined();
    });
  });
});
