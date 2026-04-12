/**
 * page-scaffold — DDD scaffold compliance tests for artist-engineer app.
 *
 * Verifies that the siteTree in app.config declares the correct sections
 * per page and that each subsection has the required SEO metadata.
 *
 * These tests guard against scaffold regression: accidentally removing required
 * sections or making engineering/art pages structurally identical.
 */
import { describe, it, expect } from "vitest";
import { appConfig } from "../apps/artist-engineer/app.config";

const landing = appConfig.siteTree?.landing;
const engineering = landing?.subsections?.find((s) => s.id === "engineering");
const art = landing?.subsections?.find((s) => s.id === "art");

const landingSectionIds = landing?.sections.map((s) => s.id) ?? [];
const engSectionIds = engineering?.sections.map((s) => s.id) ?? [];
const artSectionIds = art?.sections.map((s) => s.id) ?? [];

// ── Landing page ──────────────────────────────────────────────────────────────

describe("Landing page scaffold", () => {
  it("has a hero section", () => {
    expect(landingSectionIds).toContain("hero");
  });

  it("has a projects section", () => {
    expect(landingSectionIds).toContain("projects");
  });

  it("has a contact section", () => {
    expect(landingSectionIds).toContain("contact");
  });

  it("has both subsections: engineering and art", () => {
    const ids = landing?.subsections?.map((s) => s.id) ?? [];
    expect(ids).toContain("engineering");
    expect(ids).toContain("art");
  });
});

// ── Engineering subsection ────────────────────────────────────────────────────

describe("Engineering subsection scaffold", () => {
  it("exists in the siteTree", () => {
    expect(engineering).toBeDefined();
  });

  it("has path /engineering", () => {
    expect(engineering?.meta.path).toBe("/engineering");
  });

  it("has hero, projects, skills, and contact sections", () => {
    expect(engSectionIds).toContain("hero");
    expect(engSectionIds).toContain("projects");
    expect(engSectionIds).toContain("skills");
    expect(engSectionIds).toContain("contact");
  });

  it("has a non-empty SEO title", () => {
    expect(engineering?.meta.title).toBeTruthy();
  });

  it("has engineering-intent keywords (recruiter / client audience)", () => {
    const keywords = engineering?.meta.keywords ?? [];
    const hasEngineeringIntent = keywords.some(
      (k) => k.includes("engineer") || k.includes("developer") || k.includes("TypeScript"),
    );
    expect(hasEngineeringIntent).toBe(true);
  });
});

// ── Art subsection ────────────────────────────────────────────────────────────

describe("Art subsection scaffold", () => {
  it("exists in the siteTree", () => {
    expect(art).toBeDefined();
  });

  it("has path /art", () => {
    expect(art?.meta.path).toBe("/art");
  });

  it("has hero, projects, skills, and contact sections", () => {
    expect(artSectionIds).toContain("hero");
    expect(artSectionIds).toContain("projects");
    expect(artSectionIds).toContain("skills");
    expect(artSectionIds).toContain("contact");
  });

  it("has a non-empty SEO title", () => {
    expect(art?.meta.title).toBeTruthy();
  });

  it("has art-niche keywords (collector / collaborator audience)", () => {
    const keywords = art?.meta.keywords ?? [];
    const hasArtIntent = keywords.some(
      (k) =>
        k.includes("art") ||
        k.includes("generative") ||
        k.includes("sculpture"),
    );
    expect(hasArtIntent).toBe(true);
  });
});

// ── Page differentiation — no structural duplication ─────────────────────────

describe("Page differentiation", () => {
  it("engineering and art have different SEO titles", () => {
    expect(engineering?.meta.title).not.toBe(art?.meta.title);
  });

  it("engineering and art have different meta descriptions", () => {
    expect(engineering?.meta.description).not.toBe(art?.meta.description);
  });

  it("engineering and art have zero keyword overlap (different audiences)", () => {
    const engKeywords = new Set(engineering?.meta.keywords ?? []);
    const artKeywords = art?.meta.keywords ?? [];
    const overlap = artKeywords.filter((k) => engKeywords.has(k));
    expect(overlap).toHaveLength(0);
  });

  it("engineering and art have different llm summaries", () => {
    expect(engineering?.meta.llmSummary).not.toBe(art?.meta.llmSummary);
  });
});

// ── Theme layout model ────────────────────────────────────────────────────────

describe("Theme layouts are defined for all custom themes", () => {
  const layouts = appConfig.themeLayouts ?? {};
  const customThemeNames = Object.keys(appConfig.themes?.custom ?? {});

  it("every custom theme has a themeLayouts entry", () => {
    for (const name of customThemeNames) {
      expect(layouts).toHaveProperty(name);
    }
  });

  it("minimal theme specifies hero, skills, and projects layouts", () => {
    const minimal = layouts["minimal"];
    expect(minimal).toBeDefined();
    expect(minimal?.hero).toBeDefined();
    expect(minimal?.skills).toBeDefined();
    expect(minimal?.projects).toBeDefined();
  });

  it("warm theme specifies hero, skills, and projects layouts", () => {
    const warm = layouts["warm"];
    expect(warm).toBeDefined();
    expect(warm?.hero).toBeDefined();
    expect(warm?.skills).toBeDefined();
    expect(warm?.projects).toBeDefined();
  });

  it("bold theme specifies hero, skills, and projects layouts", () => {
    const bold = layouts["bold"];
    expect(bold).toBeDefined();
    expect(bold?.hero).toBeDefined();
    expect(bold?.skills).toBeDefined();
    expect(bold?.projects).toBeDefined();
  });
});
