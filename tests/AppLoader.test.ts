/**
 * AppLoader + fachada-plugin integration tests.
 *
 * AppLoader no longer hardcodes any app imports. It delegates entirely to the
 * `virtual:fachada/active-app` module which is resolved at build/test time by
 * vite-plugin-fachada reading `.fachadarc.json`.
 *
 * vitest.config.ts registers the plugin with no activeApp override, so the
 * active app defaults to APP env var → PROFILE env var → .fachadarc defaultApp
 * ("default-fachada" unless overridden).
 *
 * App config structural invariants are tested by importing each app config
 * file directly — not via AppLoader — so they remain independent of which app
 * is currently active.
 */
import { describe, it, expect } from "vitest";
import { getActiveAppConfig, AVAILABLE_APPS } from "../src/core/app/AppLoader";
import { readFachadarc, resolveAppName } from "../src/vite/fachada-plugin";
import type { AppConfig } from "../src/types/app.types";

// Direct imports for structural invariant tests — independent of active app
import { appConfig as defaultFachadaConfig } from "../apps/default-fachada/app.config";
import { appConfig as artistEngineerConfig } from "../apps/artist-engineer/app.config";

// ─── Scenario 1: getActiveAppConfig returns a valid AppConfig ─────────────────

describe("Scenario 1: getActiveAppConfig returns the build-time-selected AppConfig", () => {
  it("When: called, Then: returns an AppConfig with required fields", () => {
    const config = getActiveAppConfig();
    expect(config.seo.name).toBeDefined();
    expect(config.seo.url).toBeDefined();
    expect(config.theme.style).toBeDefined();
    expect(Array.isArray(config.page.sections)).toBe(true);
  });

  it("When: called twice, Then: returns the same reference (stable)", () => {
    expect(getActiveAppConfig()).toBe(getActiveAppConfig());
  });
});

// ─── Scenario 2: AVAILABLE_APPS reflects .fachadarc.json registry ─────────────

describe("Scenario 2: AVAILABLE_APPS reflects the .fachadarc.json registry", () => {
  it("contains all app names registered in .fachadarc.json", () => {
    const fachadarc = readFachadarc();
    const registeredApps = Object.keys(fachadarc.apps);
    for (const name of registeredApps) {
      expect(AVAILABLE_APPS).toContain(name);
    }
  });

  it("is frozen (read-only)", () => {
    expect(() => (AVAILABLE_APPS as string[]).push("hack")).toThrow();
  });

  it("contains at least one app", () => {
    expect(AVAILABLE_APPS.length).toBeGreaterThan(0);
  });
});

// ─── Scenario 3: resolveAppName handles app name resolution ────────────────

describe("Scenario 3: resolveAppName resolves registered app names", () => {
  const fachadarc = readFachadarc();

  it("resolves a registered app name unchanged", () => {
    expect(resolveAppName("artist-engineer", fachadarc)).toBe(
      "artist-engineer",
    );
  });

  it("passes through another registered v2 app name unchanged", () => {
    expect(resolveAppName("default-fachada", fachadarc)).toBe(
      "default-fachada",
    );
  });

  it("falls back to defaultApp for unknown names (including legacy PROFILE names)", () => {
    // Legacy names like 'artist-engineer-multi' are no longer mapped
    expect(resolveAppName("artist-engineer-multi", fachadarc)).toBe(
      fachadarc.defaultApp,
    );
  });
});

// ─── Scenario 4: structural invariants for each registered app config ─────────

describe("Scenario 4: each app config satisfies the AppConfig aggregate structure", () => {
  const cases: [string, AppConfig][] = [
    ["default-fachada", defaultFachadaConfig],
    ["artist-engineer", artistEngineerConfig],
  ];

  for (const [appName, config] of cases) {
    describe(`app '${appName}'`, () => {
      it("seo: name, url, and roles are valid", () => {
        expect(typeof config.seo.name).toBe("string");
        expect(typeof config.seo.url).toBe("string");
        expect(() => new URL(config.seo.url)).not.toThrow();
        expect(Array.isArray(config.seo.roles)).toBe(true);
        expect(config.seo.roles.length).toBeGreaterThan(0);
      });

      it("theme.style is defined", () => {
        expect(config.theme.style).toBeDefined();
      });

      it("themeVariants is an object", () => {
        expect(typeof config.themeVariants).toBe("object");
      });

      it("assets.ogImage is a string", () => {
        expect(typeof config.assets.ogImage).toBe("string");
      });

      it("page.sections is a non-empty array", () => {
        expect(Array.isArray(config.page.sections)).toBe(true);
        expect(config.page.sections.length).toBeGreaterThan(0);
      });
    });
  }
});
