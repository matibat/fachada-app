import { describe, it, expect } from "vitest";
import { siteConfig } from "../src/config";

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

  it("should have role and specialties", () => {
    expect(siteConfig.role).toBeDefined();
    expect(Array.isArray(siteConfig.specialties)).toBe(true);
    expect(siteConfig.specialties.length).toBeGreaterThan(0);
  });
});
