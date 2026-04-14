/**
 * page-scaffold — DDD scaffold compliance tests for default-fachada app.
 *
 * Verifies that the siteTree in app.config declares the correct sections
 * per page and that each subsection has the required SEO metadata.
 *
 * These tests guard against scaffold regression: accidentally removing required
 * sections or making landing page structure invalid.
 */
import { describe, it, expect } from "vitest";
import { appConfig } from "../app/app.config";

const landing = appConfig.siteTree?.landing;
const resources = landing?.subsections?.find((s) => s.id === "resources");
const assetManual = landing?.subsections?.find(
  (s) => s.id === "resources-asset-manual",
);
const appBuilderGuide = landing?.subsections?.find(
  (s) => s.id === "resources-app-builder-guide",
);

describe("Landing page scaffold", () => {
  it("has a landing page defined", () => {
    expect(landing).toBeDefined();
    expect(landing?.meta).toBeDefined();
  });

  it("has subsections for resources", () => {
    const ids = landing?.subsections?.map((s) => s.id) ?? [];
    expect(ids).toContain("resources");
  });
});

describe("Resources subsection", () => {
  it("exists in the siteTree", () => {
    expect(resources).toBeDefined();
  });

  it("has path /resources", () => {
    expect(resources?.meta.path).toBe("/resources");
  });

  it("has template hub", () => {
    expect(resources?.template).toBe("hub");
  });
});

describe("Asset Manual subsection", () => {
  it("exists in the siteTree", () => {
    expect(assetManual).toBeDefined();
  });

  it("has path /resources/asset-manual", () => {
    expect(assetManual?.meta.path).toBe("/resources/asset-manual");
  });

  it("uses markdown template", () => {
    expect(assetManual?.template).toBe("markdown");
  });
});

describe("App Builder Guide", () => {
  it("exists in the siteTree", () => {
    expect(appBuilderGuide).toBeDefined();
  });

  it("has path /resources/app-builder-guide", () => {
    expect(appBuilderGuide?.meta.path).toBe("/resources/app-builder-guide");
  });

  it("uses markdown template", () => {
    expect(appBuilderGuide?.template).toBe("markdown");
  });
});

describe("Theme layouts", () => {
  const layouts = appConfig.themeLayouts ?? {};

  it("has theme layouts defined", () => {
    expect(Object.keys(layouts).length).toBeGreaterThan(0);
  });

  it("minimalist theme is defined", () => {
    expect(layouts["minimalist"]).toBeDefined();
  });
});
