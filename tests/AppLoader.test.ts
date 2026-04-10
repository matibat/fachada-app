/**
 * Phase 4 — AppLoader domain service tests
 *
 * BDD: written before implementation. Import of loadAppConfig causes RED until
 * src/core/app/AppLoader.ts exists.
 *
 * AppLoader resolves the active AppConfig by app name (from the APP env var or
 * PROFILE legacy env var). Tests use the direct function, not env var routing.
 */
import { describe, it, expect } from "vitest";
import { AVAILABLE_APPS, loadAppConfig } from "../src/core/app/AppLoader";
import type { AppConfig } from "../src/types/app.types";

// ─── Scenario 1: loadAppConfig returns a valid AppConfig for known names ──────

describe("Scenario 1: loadAppConfig returns a valid AppConfig for each known app", () => {
  it("Given: app name 'default-fachada', When: loadAppConfig, Then: returns config with seo.name defined", () => {
    const config = loadAppConfig("default-fachada");
    expect(config.seo.name).toBeDefined();
    expect(config.seo.url).toBeDefined();
    expect(config.theme.style).toBeDefined();
    expect(config.page).toBeDefined();
    expect(Array.isArray(config.page.sections)).toBe(true);
  });

  it("Given: app name 'engineer', When: loadAppConfig, Then: returns config with seo.name defined", () => {
    const config = loadAppConfig("engineer");
    expect(config.seo.name).toBeDefined();
    expect(config.theme.style).toBe("modern-tech");
  });

  it("Given: app name 'artist-engineer', When: loadAppConfig, Then: returns config for the multi-role profile", () => {
    const config = loadAppConfig("artist-engineer");
    expect(config.seo.name).toBeDefined();
    expect(config.seo.roles.length).toBeGreaterThan(1);
  });
});

// ─── Scenario 2: fallback to default for unknown app names ───────────────────

describe("Scenario 2: loadAppConfig falls back to default-fachada for unknown names", () => {
  it("Given: an unknown app name, When: loadAppConfig, Then: returns default-fachada config", () => {
    const defaultConfig = loadAppConfig("default-fachada");
    const unknownConfig = loadAppConfig("does-not-exist");
    expect(unknownConfig.seo.name).toBe(defaultConfig.seo.name);
  });

  it("Given: empty string as app name, When: loadAppConfig, Then: returns default config", () => {
    const config = loadAppConfig("");
    expect(config.seo.name).toBeDefined();
  });
});

// ─── Scenario 3: AppConfig satisfies all structural invariants ────────────────

describe("Scenario 3: each loaded AppConfig satisfies the AppConfig aggregate structure", () => {
  const apps = ["default-fachada", "engineer", "artist-engineer"];

  for (const appName of apps) {
    it(`Given: app '${appName}', When: loaded, Then: satisfies AppConfig structure`, () => {
      const config: AppConfig = loadAppConfig(appName);

      // seo
      expect(typeof config.seo.name).toBe("string");
      expect(typeof config.seo.url).toBe("string");
      expect(() => new URL(config.seo.url)).not.toThrow();
      expect(Array.isArray(config.seo.roles)).toBe(true);
      expect(config.seo.roles.length).toBeGreaterThan(0);

      // theme
      expect(config.theme.style).toBeDefined();

      // themeVariants
      expect(typeof config.themeVariants).toBe("object");

      // assets
      expect(typeof config.assets.ogImage).toBe("string");

      // page
      expect(Array.isArray(config.page.sections)).toBe(true);
      for (const section of config.page.sections) {
        expect(typeof section.id).toBe("string");
        expect(typeof section.enabled).toBe("boolean");
        expect(typeof section.order).toBe("number");
        expect(Array.isArray(section.widgets)).toBe(true);
      }
    });
  }
});

// ─── Scenario 4: AVAILABLE_APPS lists all three app names ────────────────────

describe("Scenario 4: AVAILABLE_APPS exports the full list of known app identifiers", () => {
  it("Given: AVAILABLE_APPS, When: inspected, Then: contains all three app names", () => {
    expect(AVAILABLE_APPS).toContain("default-fachada");
    expect(AVAILABLE_APPS).toContain("engineer");
    expect(AVAILABLE_APPS).toContain("artist-engineer");
    expect(AVAILABLE_APPS).toHaveLength(3);
  });
});

// ─── Scenario 5: PROFILE legacy name aliases are supported ───────────────────

describe("Scenario 5: legacy PROFILE names are treated as valid aliases", () => {
  it("Given: legacy name 'engineer-single-role', When: loadAppConfig, Then: returns engineer config", () => {
    const config = loadAppConfig("engineer-single-role");
    expect(config.theme.style).toBe("modern-tech");
  });

  it("Given: legacy name 'artist-engineer-multi', When: loadAppConfig, Then: returns artist-engineer config", () => {
    const config = loadAppConfig("artist-engineer-multi");
    expect(config.seo.roles.length).toBeGreaterThan(1);
  });
});
