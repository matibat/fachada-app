/**
 * Profile system tests — validates profile loading, schema conformance,
 * and multi-role support.
 */
import { describe, it, expect } from "vitest";
import { getProfile, AVAILABLE_PROFILES } from "../src/profiles/index";
import type { ProfileConfig, SiteConfig } from "../src/types/profile.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  // Theme block
  expect(profile.theme.style).toBeDefined();
  expect(["light", "dark", "auto", "system"]).toContain(
    profile.theme.defaultMode,
  );
  expect(typeof profile.theme.enableStyleSwitcher).toBe("boolean");
  expect(typeof profile.theme.enableModeToggle).toBe("boolean");

  // About block
  expect(Array.isArray(profile.about.paragraphs)).toBe(true);
  expect(profile.about.paragraphs).toHaveLength(3);
  for (const para of profile.about.paragraphs) {
    expect(typeof para).toBe("string");
    expect(para.length).toBeGreaterThan(0);
  }

  // Skills block
  expect(Array.isArray(profile.skills)).toBe(true);
  expect(profile.skills.length).toBeGreaterThan(0);
  for (const category of profile.skills) {
    expect(category.name).toBeDefined();
    expect(Array.isArray(category.skills)).toBe(true);
    expect(category.skills.length).toBeGreaterThan(0);
  }

  // Sections block
  expect(Array.isArray(profile.sections)).toBe(true);
  for (const section of profile.sections) {
    expect(section.id).toBeDefined();
    expect(typeof section.enabled).toBe("boolean");
    expect(typeof section.order).toBe("number");
  }
}

// ─── Profile Registry ─────────────────────────────────────────────────────────

describe("Profile Registry", () => {
  it("should list all available profiles", () => {
    expect(AVAILABLE_PROFILES).toContain("default-fachada");
    expect(AVAILABLE_PROFILES).toContain("engineer-single-role");
    expect(AVAILABLE_PROFILES).toContain("artist-engineer-multi");
  });

  it("should fall back to default-fachada for unknown profile name", () => {
    const result = getProfile("does-not-exist");
    expect(result.siteConfig.name).toBe("Fachada");
  });
});

// ─── default-fachada profile ──────────────────────────────────────────────────

describe("default-fachada profile", () => {
  const { siteConfig, profileConfig } = getProfile("default-fachada");

  it("loads a valid SiteConfig", () => {
    assertValidSiteConfig(siteConfig);
  });

  it("loads a valid ProfileConfig", () => {
    assertValidProfileConfig(profileConfig);
  });

  it("is a single-role profile", () => {
    expect(siteConfig.roles).toHaveLength(1);
    expect(siteConfig.roles[0].id).toBe("engineer");
  });

  it("has theme switcher and mode toggle enabled", () => {
    expect(profileConfig.theme.enableStyleSwitcher).toBe(true);
    expect(profileConfig.theme.enableModeToggle).toBe(true);
  });

  it("has a contact message defined", () => {
    expect(typeof profileConfig.contactMessage).toBe("string");
    expect((profileConfig.contactMessage ?? "").length).toBeGreaterThan(0);
  });

  it("does not have multiRoleDisplay (single role)", () => {
    expect(profileConfig.multiRoleDisplay).toBeUndefined();
  });
});

// ─── engineer-single-role profile ────────────────────────────────────────────

describe("engineer-single-role profile", () => {
  const { siteConfig, profileConfig } = getProfile("engineer-single-role");

  it("loads a valid SiteConfig", () => {
    assertValidSiteConfig(siteConfig);
  });

  it("loads a valid ProfileConfig", () => {
    assertValidProfileConfig(profileConfig);
  });

  it("is a single-role profile", () => {
    expect(siteConfig.roles).toHaveLength(1);
  });

  it("has style switcher DISABLED", () => {
    // Given: engineer profile locks the theme
    // When: enableStyleSwitcher is read
    // Then: it is false so users cannot change the visual style
    expect(profileConfig.theme.enableStyleSwitcher).toBe(false);
  });

  it("has mode toggle enabled", () => {
    expect(profileConfig.theme.enableModeToggle).toBe(true);
  });

  it("uses modern-tech theme style", () => {
    expect(profileConfig.theme.style).toBe("modern-tech");
  });

  it("defaults to dark mode", () => {
    expect(profileConfig.theme.defaultMode).toBe("dark");
  });

  it("does not have multiRoleDisplay", () => {
    expect(profileConfig.multiRoleDisplay).toBeUndefined();
  });
});

// ─── artist-engineer-multi profile ───────────────────────────────────────────

describe("artist-engineer-multi profile", () => {
  const { siteConfig, profileConfig } = getProfile("artist-engineer-multi");

  it("loads a valid SiteConfig", () => {
    assertValidSiteConfig(siteConfig);
  });

  it("loads a valid ProfileConfig", () => {
    assertValidProfileConfig(profileConfig);
  });

  it("is a multi-role profile with engineer and artist roles", () => {
    expect(siteConfig.roles.length).toBeGreaterThanOrEqual(2);
    const roleIds = siteConfig.roles.map((r) => r.id);
    expect(roleIds).toContain("engineer");
    expect(roleIds).toContain("artist");
  });

  it("has both roles marked as featured", () => {
    const featured = siteConfig.roles.filter((r) => r.featured);
    expect(featured.length).toBeGreaterThanOrEqual(2);
  });

  it("has multiRoleDisplay configured with storytelling style", () => {
    expect(profileConfig.multiRoleDisplay).toBeDefined();
    expect(profileConfig.multiRoleDisplay?.style).toBe("storytelling");
  });

  it("each role has its own about paragraphs and skills for the explorer", () => {
    for (const role of siteConfig.roles) {
      expect(role.about).toBeDefined();
      expect(role.about?.paragraphs).toHaveLength(3);
      expect(role.skills).toBeDefined();
      expect((role.skills ?? []).length).toBeGreaterThan(0);
    }
  });

  it("sections config uses role-explorer instead of separate about/skills", () => {
    const ids = profileConfig.sections.map((s) => s.id);
    expect(ids).toContain("role-explorer");
    expect(ids).not.toContain("about");
    expect(ids).not.toContain("skills");
  });

  it("has style switcher enabled", () => {
    expect(profileConfig.theme.enableStyleSwitcher).toBe(true);
  });

  it("has a contact message tailored to multi-role work", () => {
    expect(typeof profileConfig.contactMessage).toBe("string");
    expect((profileConfig.contactMessage ?? "").length).toBeGreaterThan(0);
  });
});

// ─── Section Visibility Logic ─────────────────────────────────────────────────

describe("Section configuration", () => {
  it("all profiles have a hero section enabled", () => {
    for (const name of AVAILABLE_PROFILES) {
      const { profileConfig } = getProfile(name);
      const hero = profileConfig.sections.find((s) => s.id === "hero");
      expect(hero).toBeDefined();
      expect(hero?.enabled).toBe(true);
    }
  });

  it("all profiles have unique section orders", () => {
    for (const name of AVAILABLE_PROFILES) {
      const { profileConfig } = getProfile(name);
      const orders = profileConfig.sections.map((s) => s.order);
      const uniqueOrders = new Set(orders);
      expect(uniqueOrders.size).toBe(orders.length);
    }
  });

  it("sections with requiresContent reference valid content types", () => {
    const validTypes = new Set(["projects", "blog"]);
    for (const name of AVAILABLE_PROFILES) {
      const { profileConfig } = getProfile(name);
      for (const section of profileConfig.sections) {
        if (section.requiresContent) {
          expect(validTypes.has(section.requiresContent)).toBe(true);
        }
      }
    }
  });
});
