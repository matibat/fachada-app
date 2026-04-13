import { describe, it, expect } from "vitest";
import { appConfig } from "virtual:fachada/active-app";

const siteConfig = appConfig.seo;

describe("Site Configuration", () => {
  it("should have required fields", () => {
    expect(siteConfig.name).toBeDefined();
    expect(siteConfig.title).toBeDefined();
    expect(siteConfig.description).toBeDefined();
    expect(siteConfig.url).toBeDefined();
  });

  it("should have valid URL", () => {
    expect(() => new URL(siteConfig.url)).not.toThrow();
  });

  it("should have social links", () => {
    expect(siteConfig.social).toBeDefined();
    expect(siteConfig.social.email).toBeDefined();
  });

  it("should have valid email format", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(siteConfig.social.email)).toBe(true);
  });

  it("should have location information", () => {
    expect(siteConfig.location.city).toBeDefined();
    expect(siteConfig.location.country).toBeDefined();
  });

  it("should have roles with at least one entry and a valid primaryRole", () => {
    expect(Array.isArray(siteConfig.roles)).toBe(true);
    expect(siteConfig.roles.length).toBeGreaterThan(0);
    expect(siteConfig.primaryRole).toBeDefined();
    expect(siteConfig.roles.some((r) => r.id === siteConfig.primaryRole)).toBe(
      true,
    );
  });

  it("each role should have required fields", () => {
    for (const role of siteConfig.roles) {
      expect(role.id).toBeDefined();
      expect(role.title).toBeDefined();
      expect(Array.isArray(role.specialties)).toBe(true);
      expect(typeof role.featured).toBe("boolean");
    }
  });
});
