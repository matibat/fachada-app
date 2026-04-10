/**
 * Phase 3 — AssetResolver domain service tests
 *
 * BDD: written before implementation. Import of resolveAsset causes RED until
 * src/core/assets/AssetResolver.ts exists.
 *
 * AssetResolver is a pure domain service: theme-aware asset lookups with
 * variant fallback, no side effects, no throws.
 */
import { describe, it, expect } from "vitest";
import { resolveAsset } from "../src/core/assets/AssetResolver";
import type { AssetConfig } from "../src/types/app.types";

// ─── Scenario 1: resolves plain string asset with no variant ─────────────────

describe("Scenario 1: resolveAsset returns a plain string asset", () => {
  it("Given: ogImage is a plain string, When: no activeVariant, Then: returns the string", () => {
    const assets: AssetConfig = { ogImage: "/og-image.png" };
    expect(resolveAsset("ogImage", assets, undefined)).toBe("/og-image.png");
  });

  it("Given: ogImage is a plain string, When: activeVariant='dark', Then: returns the string (no variant map)", () => {
    const assets: AssetConfig = { ogImage: "/og-image.png" };
    expect(resolveAsset("ogImage", assets, "dark")).toBe("/og-image.png");
  });
});

// ─── Scenario 2: resolves variant-map asset with matching variant ─────────────

describe("Scenario 2: resolveAsset picks the variant-specific value from a map", () => {
  it("Given: logo has dark and default variants, When: activeVariant='dark', Then: returns dark value", () => {
    const assets: AssetConfig = {
      ogImage: "/og.png",
      logo: { default: "/logo-light.svg", dark: "/logo-dark.svg" },
    };

    expect(resolveAsset("logo", assets, "dark")).toBe("/logo-dark.svg");
  });

  it("Given: logo has dark and default variants, When: activeVariant='light', Then: returns default value", () => {
    const assets: AssetConfig = {
      ogImage: "/og.png",
      logo: { default: "/logo-light.svg", dark: "/logo-dark.svg" },
    };

    expect(resolveAsset("logo", assets, "light")).toBe("/logo-light.svg");
  });
});

// ─── Scenario 3: falls back to default when variant not in map ───────────────

describe("Scenario 3: resolveAsset falls back to default when variant is absent from the map", () => {
  it("Given: logo map has only default, When: activeVariant='vaporwave', Then: returns default", () => {
    const assets: AssetConfig = {
      ogImage: "/og.png",
      logo: { default: "/logo.svg" },
    };

    expect(resolveAsset("logo", assets, "vaporwave")).toBe("/logo.svg");
  });

  it("Given: logo map has dark but no default, When: activeVariant='light', Then: returns undefined", () => {
    const assets: AssetConfig = {
      ogImage: "/og.png",
      logo: { dark: "/logo-dark.svg" },
    };

    expect(resolveAsset("logo", assets, "light")).toBeUndefined();
  });
});

// ─── Scenario 4: missing key returns undefined without throwing ───────────────

describe("Scenario 4: resolveAsset returns undefined for a missing key", () => {
  it("Given: assets without 'banner', When: I resolve 'banner', Then: returns undefined", () => {
    const assets: AssetConfig = { ogImage: "/og.png" };
    expect(resolveAsset("banner", assets, undefined)).toBeUndefined();
  });

  it("Given: assets without 'banner', When: activeVariant='dark', Then: still returns undefined without throwing", () => {
    const assets: AssetConfig = { ogImage: "/og.png" };
    expect(() => resolveAsset("banner", assets, "dark")).not.toThrow();
    expect(resolveAsset("banner", assets, "dark")).toBeUndefined();
  });
});

// ─── Scenario 5: AssetResolver is pure ───────────────────────────────────────

describe("Scenario 5: resolveAsset is a pure function", () => {
  it("Given: the same inputs, When: called twice, Then: returns the same value", () => {
    const assets: AssetConfig = {
      ogImage: "/og.png",
      logo: { default: "/logo.svg", dark: "/logo-dark.svg" },
    };

    const r1 = resolveAsset("logo", assets, "dark");
    const r2 = resolveAsset("logo", assets, "dark");

    expect(r1).toBe(r2);
  });

  it("Given: different activeVariant, When: called, Then: returns different values", () => {
    const assets: AssetConfig = {
      ogImage: "/og.png",
      logo: { default: "/logo.svg", dark: "/logo-dark.svg" },
    };

    expect(resolveAsset("logo", assets, "dark")).not.toBe(
      resolveAsset("logo", assets, "light"),
    );
  });
});
