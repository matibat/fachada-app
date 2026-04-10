/**
 * Phase 2 — filterSections domain service tests
 *
 * BDD: written before implementation. Import of filterSections causes RED until
 * src/core/widgets/filterSections.ts exists.
 *
 * filterSections is a pure function that replicates the section-filtering and
 * sorting logic currently embedded in src/pages/index.astro — making it testable.
 */
import { describe, it, expect } from "vitest";
import { filterSections } from "../src/core/widgets/filterSections";
import type { PageSectionConfig } from "../src/types/profile.types";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const allEnabledSections: PageSectionConfig[] = [
  { id: "hero", enabled: true, order: 1 },
  { id: "about", enabled: true, order: 2 },
  { id: "skills", enabled: true, order: 3 },
  { id: "projects", enabled: true, order: 4, requiresContent: "projects" },
  { id: "contact", enabled: true, order: 5 },
];

const baseContext = {
  projectsCount: 3,
  blogCount: 0,
  availableRoles: ["engineer"],
};

// ─── Scenario 1: only enabled sections are returned ──────────────────────────

describe("Scenario 1: filterSections excludes disabled sections", () => {
  it("Given: hero is disabled, When: filtered, Then: 'hero' is not in result", () => {
    const sections: PageSectionConfig[] = [
      { id: "hero", enabled: false, order: 1 },
      { id: "about", enabled: true, order: 2 },
    ];
    const result = filterSections(sections, baseContext);
    expect(result).not.toContain("hero");
    expect(result).toContain("about");
  });

  it("Given: all sections disabled, When: filtered, Then: result is empty", () => {
    const sections: PageSectionConfig[] = allEnabledSections.map((s) => ({
      ...s,
      enabled: false,
    }));
    expect(filterSections(sections, baseContext)).toHaveLength(0);
  });
});

// ─── Scenario 2: requiresContent filtering ────────────────────────────────────

describe("Scenario 2: filterSections excludes requiresContent sections when the collection is empty", () => {
  it("Given: projects section requiresContent='projects', When: projectsCount=0, Then: 'projects' is excluded", () => {
    const result = filterSections(allEnabledSections, {
      ...baseContext,
      projectsCount: 0,
    });
    expect(result).not.toContain("projects");
  });

  it("Given: projects section requiresContent='projects', When: projectsCount>0, Then: 'projects' is included", () => {
    const result = filterSections(allEnabledSections, {
      ...baseContext,
      projectsCount: 1,
    });
    expect(result).toContain("projects");
  });

  it("Given: blog section requiresContent='blog', When: blogCount=0, Then: the blog section is excluded", () => {
    const sections: PageSectionConfig[] = [
      { id: "blog", enabled: true, order: 1, requiresContent: "blog" },
    ];
    const result = filterSections(sections, { ...baseContext, blogCount: 0 });
    expect(result).not.toContain("blog");
  });

  it("Given: blog section requiresContent='blog', When: blogCount>0, Then: the blog section is included", () => {
    const sections: PageSectionConfig[] = [
      { id: "blog", enabled: true, order: 1, requiresContent: "blog" },
    ];
    const result = filterSections(sections, { ...baseContext, blogCount: 2 });
    expect(result).toContain("blog");
  });
});

// ─── Scenario 3: requiresRole filtering ──────────────────────────────────────

describe("Scenario 3: filterSections excludes requiresRole sections when no matching role is available", () => {
  it("Given: section requiresRole=['artist'], When: availableRoles=['engineer'], Then: section is excluded", () => {
    const sections: PageSectionConfig[] = [
      {
        id: "role-explorer",
        enabled: true,
        order: 2,
        requiresRole: ["artist"],
      },
    ];
    const result = filterSections(sections, {
      ...baseContext,
      availableRoles: ["engineer"],
    });
    expect(result).not.toContain("role-explorer");
  });

  it("Given: section requiresRole=['engineer','artist'], When: availableRoles=['engineer'], Then: section is included", () => {
    const sections: PageSectionConfig[] = [
      {
        id: "role-explorer",
        enabled: true,
        order: 2,
        requiresRole: ["engineer", "artist"],
      },
    ];
    const result = filterSections(sections, {
      ...baseContext,
      availableRoles: ["engineer"],
    });
    expect(result).toContain("role-explorer");
  });

  it("Given: section has no requiresRole, When: filtered, Then: section is always included", () => {
    const sections: PageSectionConfig[] = [
      { id: "hero", enabled: true, order: 1 },
    ];
    const result = filterSections(sections, {
      ...baseContext,
      availableRoles: [],
    });
    expect(result).toContain("hero");
  });
});

// ─── Scenario 4: sections are sorted by order ────────────────────────────────

describe("Scenario 4: filterSections returns section IDs sorted ascending by order", () => {
  it("Given: sections defined in reverse order, When: filtered, Then: IDs are in ascending order", () => {
    const scrambled: PageSectionConfig[] = [
      { id: "contact", enabled: true, order: 5 },
      { id: "hero", enabled: true, order: 1 },
      { id: "about", enabled: true, order: 2 },
    ];
    expect(filterSections(scrambled, baseContext)).toEqual([
      "hero",
      "about",
      "contact",
    ]);
  });

  it("Given: two sections at the same order, When: filtered, Then: both appear in result", () => {
    const sections: PageSectionConfig[] = [
      { id: "a", enabled: true, order: 1 },
      { id: "b", enabled: true, order: 1 },
    ];
    const result = filterSections(sections, baseContext);
    expect(result).toContain("a");
    expect(result).toContain("b");
  });
});

// ─── Scenario 5: returns string array of IDs ─────────────────────────────────

describe("Scenario 5: filterSections returns an array of string section IDs", () => {
  it("Given: all default-fachada enabled sections with projects, When: filtered, Then: returns all 5 ids", () => {
    const result = filterSections(allEnabledSections, baseContext);
    expect(result).toEqual(["hero", "about", "skills", "projects", "contact"]);
  });

  it("Given: empty sections array, When: filtered, Then: returns empty array", () => {
    expect(filterSections([], baseContext)).toEqual([]);
  });
});

// ─── Scenario 6: filterSections is pure ──────────────────────────────────────

describe("Scenario 6: filterSections is a pure function", () => {
  it("Given: the same inputs, When: called twice, Then: produces the same output", () => {
    const r1 = filterSections(allEnabledSections, baseContext);
    const r2 = filterSections(allEnabledSections, baseContext);
    expect(r1).toEqual(r2);
  });

  it("Given: the same inputs, When: called twice, Then: produces different array references", () => {
    const r1 = filterSections(allEnabledSections, baseContext);
    const r2 = filterSections(allEnabledSections, baseContext);
    expect(r1).not.toBe(r2);
  });
});
