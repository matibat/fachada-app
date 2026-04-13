/**
 * Phase 1 — ThemeResolver domain service tests
 *
 * BDD: written before implementation. Import of resolveTheme causes RED until
 * src/theme/ThemeResolver.ts exists.
 *
 * ThemeResolver is a pure function: same inputs always return same outputs.
 * No React, no side effects.
 */
import { describe, it, expect } from "vitest";
import { resolveTheme } from "@fachada/core/theme/ThemeResolver";
import { THEME_DEFINITIONS } from "@fachada/core/utils/theme.config";
import type { ThemeConfig } from "@fachada/core/types/profile.types";
import type { ThemeOverride } from "@fachada/core/types/app.types";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const baseConfig: ThemeConfig = {
  style: "minimalist",
  defaultMode: "light",
  enableStyleSwitcher: true,
  enableModeToggle: true,
};

const baseTokens = THEME_DEFINITIONS["minimalist"].light;

// ─── Scenario 1: no active variant → returns base tokens unchanged ────────────

describe("Scenario 1: resolveTheme with no active variant returns base tokens", () => {
  it("Given: base minimalist/light config, When: no activeVariant, Then: tokens equal THEME_DEFINITIONS minimalist.light", () => {
    const result = resolveTheme(baseConfig, {}, undefined);
    expect(result).toEqual(baseTokens);
  });

  it("Given: base config with empty variants map, When: activeVariant is undefined, Then: tokens are base tokens", () => {
    const result = resolveTheme(baseConfig, {});
    expect(result.bgPrimary).toBe(baseTokens.bgPrimary);
    expect(result.accent).toBe(baseTokens.accent);
  });
});

// ─── Scenario 2: active variant deep-merges override tokens ──────────────────

describe("Scenario 2: resolveTheme applies override tokens on top of base", () => {
  it("Given: a 'custom' variant overriding accent only, When: activeVariant='custom', Then: accent is overridden and other tokens are unchanged", () => {
    const variants: Record<string, ThemeOverride> = {
      custom: { tokens: { accent: "#ff00ff" } },
    };

    const result = resolveTheme(baseConfig, variants, "custom");

    expect(result.accent).toBe("#ff00ff");
    expect(result.bgPrimary).toBe(baseTokens.bgPrimary);
    expect(result.textPrimary).toBe(baseTokens.textPrimary);
  });

  it("Given: a 'dark' variant overriding bgPrimary and textPrimary, When: activeVariant='dark', Then: both overridden tokens are applied", () => {
    const variants: Record<string, ThemeOverride> = {
      dark: {
        tokens: {
          bgPrimary: "#000000",
          textPrimary: "#ffffff",
        },
      },
    };

    const result = resolveTheme(baseConfig, variants, "dark");

    expect(result.bgPrimary).toBe("#000000");
    expect(result.textPrimary).toBe("#ffffff");
    expect(result.accent).toBe(baseTokens.accent);
  });

  it("Given: an override with all tokens replaced, When: applied, Then: all tokens are from override", () => {
    const fullOverride = { ...baseTokens, accent: "#abcdef" };
    const variants: Record<string, ThemeOverride> = {
      full: { tokens: fullOverride },
    };

    const result = resolveTheme(baseConfig, variants, "full");

    expect(result.accent).toBe("#abcdef");
  });
});

// ─── Scenario 3: unknown active variant → falls back to base tokens ───────────

describe("Scenario 3: resolveTheme falls back to base when activeVariant is not in variants", () => {
  it("Given: variants map without the requested key, When: activeVariant='nonexistent', Then: returns base tokens", () => {
    const result = resolveTheme(
      baseConfig,
      { other: { tokens: { accent: "#ff0000" } } },
      "nonexistent",
    );

    expect(result).toEqual(baseTokens);
  });
});

// ─── Scenario 4: variant with undefined tokens → treated as empty override ────

describe("Scenario 4: variant with no tokens field is a no-op overlay", () => {
  it("Given: a variant object with no tokens field, When: applied, Then: returns base tokens unchanged", () => {
    const variants: Record<string, ThemeOverride> = {
      empty: {},
    };

    const result = resolveTheme(baseConfig, variants, "empty");

    expect(result).toEqual(baseTokens);
  });
});

// ─── Scenario 5: ThemeResolver is pure — same inputs produce same outputs ─────

describe("Scenario 5: resolveTheme is a pure function", () => {
  it("Given: the same inputs, When: called twice, Then: both results are deeply equal", () => {
    const variants: Record<string, ThemeOverride> = {
      v: { tokens: { accent: "#123456" } },
    };

    const result1 = resolveTheme(baseConfig, variants, "v");
    const result2 = resolveTheme(baseConfig, variants, "v");

    expect(result1).toEqual(result2);
  });

  it("Given: the same inputs, When: called twice, Then: the results are different object references (not cached mutable state)", () => {
    const variants: Record<string, ThemeOverride> = {
      v: { tokens: { accent: "#abcdef" } },
    };

    const result1 = resolveTheme(baseConfig, variants, "v");
    const result2 = resolveTheme(baseConfig, variants, "v");

    expect(result1).not.toBe(result2);
  });
});

// ─── Scenario 6: works with all four ThemeStyle values ───────────────────────

describe("Scenario 6: resolveTheme works with every ThemeStyle", () => {
  const styles = [
    "minimalist",
    "modern-tech",
    "professional",
    "vaporwave",
  ] as const;

  for (const style of styles) {
    it(`Given: base style '${style}' in light mode, When: no variant, Then: returns that style's light tokens`, () => {
      const config: ThemeConfig = {
        style,
        defaultMode: "light",
        enableStyleSwitcher: false,
        enableModeToggle: false,
      };

      const result = resolveTheme(config, {});
      expect(result).toEqual(THEME_DEFINITIONS[style].light);
    });
  }
});

// ─── Scenario 7: defaultMode 'dark' selects dark base tokens ─────────────────

describe("Scenario 7: defaultMode 'dark' selects dark base tokens", () => {
  it("Given: base config with defaultMode='dark', When: no activeVariant, Then: returns dark tokens", () => {
    const darkConfig: ThemeConfig = {
      style: "minimalist",
      defaultMode: "dark",
      enableStyleSwitcher: false,
      enableModeToggle: false,
    };

    const result = resolveTheme(darkConfig, {});
    expect(result).toEqual(THEME_DEFINITIONS["minimalist"].dark);
  });

  it("Given: defaultMode='system', When: no activeVariant, Then: returns light tokens as default fallback", () => {
    const systemConfig: ThemeConfig = {
      style: "minimalist",
      defaultMode: "system",
      enableStyleSwitcher: false,
      enableModeToggle: false,
    };

    const result = resolveTheme(systemConfig, {});
    expect(result).toEqual(THEME_DEFINITIONS["minimalist"].light);
  });
});
