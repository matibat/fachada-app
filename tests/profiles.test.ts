/**
 * Profile config structural tests.
 *
 * Validates that each app's profileConfig satisfies the ProfileConfig schema:
 * proper theme settings, non-empty about/skills content, and valid sections.
 *
 * Previously these tests used the legacy getProfile() registry. That registry
 * is gone; each app now exports profileConfig directly from its app.config.ts,
 * and it is available at build time via virtual:fachada/active-app.
 */
import { describe, it, expect } from "vitest";
import type { ProfileConfig, SiteConfig } from "@fachada/core";
import {
  appConfig as defaultFachadaAppConfig,
  profileConfig as defaultFachadaProfile,
} from "../apps/default-fachada/app.config";
import {
  appConfig as artistEngineerAppConfig,
  profileConfig as artistEngineerProfile,
} from "../apps/artist-engineer/app.config";

function assertValidSiteConfig(site: SiteConfig) {
  expect(site.name).toBeDefined();
  expect(site.title).toBeDefined();
  expect(site.description).toBeDefined();
  expect(site.url).toBeDefined();
  expect(() => new URL(site.url)).not.toThrow();
  expect(Array.isArray(site.roles)).toBe(true);
  expect(site.roles.length).toBeGreaterThan(0);
  expect(site.primaryRole).toBeDefined();
  expect(site.roles.some((r) => r.id === site.primaryRole)).toBe(true);
  expect(site.social.email).toBeDefined();
  expect(site.location.city).toBeDefined();
  expect(site.location.country).toBeDefined();
}

function assertValidProfileConfig(profile: ProfileConfig) {
  expect(profile.theme.style).toBeDefined();
  expect(["light", "dark", "auto", "system"]).toContain(
    profile.theme.defaultMode,
  );
  expect(typeof profile.theme.enableStyleSwitcher).toBe("boolean");
  expect(typeof profile.theme.enableModeToggle).toBe("boolean");

  expect(Array.isArray(profile.about.paragraphs)).toBe(true);
  expect(profile.about.paragraphs).toHaveLength(3);
  for (const para of profile.about.paragraphs) {
    expect(typeof para).toBe("string");
    expect(para.length).toBeGreaterThan(0);
  }

  expect(Array.isArray(profile.skills)).toBe(true);
  expect(profile.skills.length).toBeGreaterThan(0);
  for (const category of profile.skills) {
    expect(category.name).toBeDefined();
    expect(Array.isArray(category.skills)).toBe(true);
    expect(category.skills.length).toBeGreaterThan(0);
  }

  expect(Array.isArray(profile.sections)).toBe(true);
  for (const section of profile.sections) {
    expect(section.id).toBeDefined();
    expect(typeof section.enabled).toBe("boolean");
    expect(typeof section.order).toBe("number");
  }
}

// ─── default-fachada ─────────────────────────────────────────────────────────

describe("default-fachada profile", () => {
  it("loads a valid SiteConfig", () => {
    assertValidSiteConfig(defaultFachadaAppConfig.seo);
  });

  it("loads a valid ProfileConfig", () => {
    assertValidProfileConfig(defaultFachadaProfile);
  });

  it("is a single-role profile", () => {
    expect(defaultFachadaAppConfig.seo.roles).toHaveLength(1);
    expect(defaultFachadaAppConfig.seo.roles[0].id).toBe("framework");
  });

  it("has theme switcher and mode toggle enabled", () => {
    expect(defaultFachadaProfile.theme.enableStyleSwitcher).toBe(true);
    expect(defaultFachadaProfile.theme.enableModeToggle).toBe(true);
  });

  it("has a contact message defined", () => {
    expect(typeof defaultFachadaProfile.contactMessage).toBe("string");
    expect((defaultFachadaProfile.contactMessage ?? "").length).toBeGreaterThan(
      0,
    );
  });

  it("does not have multiRoleDisplay (single role)", () => {
    expect(defaultFachadaProfile.multiRoleDisplay).toBeUndefined();
  });
});

// ─── artist-engineer profile ─────────────────────────────────────────────────

describe("artist-engineer profile", () => {
  it("loads a valid SiteConfig", () => {
    assertValidSiteConfig(artistEngineerAppConfig.seo);
  });

  it("loads a valid ProfileConfig", () => {
    assertValidProfileConfig(artistEngineerProfile);
  });

  it("is a multi-role profile", () => {
    expect(artistEngineerAppConfig.seo.roles.length).toBeGreaterThan(1);
  });
});
