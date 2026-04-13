/**
 * SiteTreeValidator domain service tests
 *
 * BDD: written before implementation. Importing from SiteTreeValidator causes
 * RED until src/site-tree/SiteTreeValidator.ts exists.
 */
import { describe, it, expect } from "vitest";
import { validateSiteTree } from "@fachada/core";
import type { SiteTreeConfig } from "@fachada/core";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const minimalValidTree: SiteTreeConfig = {
  landing: {
    meta: { path: "/", title: "Home", description: "Landing page." },
    sections: [],
  },
};

const treeWithSubsections: SiteTreeConfig = {
  landing: {
    meta: { path: "/", title: "Home", description: "Landing page." },
    sections: [],
    subsections: [
      {
        id: "engineering",
        meta: {
          path: "/engineering",
          title: "Engineering",
          description: "Tech work.",
        },
        sections: [],
      },
      {
        id: "art",
        meta: { path: "/art", title: "Art", description: "Creative work." },
        sections: [],
      },
    ],
  },
};

// ─── Scenario 1: Valid tree with only landing passes ─────────────────────────

describe("Scenario 1: A valid tree with only a landing page passes validation", () => {
  it("Given: landing with path '/', When: validated, Then: isValid is true and errors is empty", () => {
    const result = validateSiteTree(minimalValidTree);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ─── Scenario 2: Valid tree with subsections passes ───────────────────────────

describe("Scenario 2: A valid tree with unique subsections passes validation", () => {
  it("Given: landing '/' with subsections '/engineering' and '/art', When: validated, Then: isValid is true", () => {
    const result = validateSiteTree(treeWithSubsections);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ─── Scenario 3: Landing path must be "/" ─────────────────────────────────────

describe("Scenario 3: Landing page path must be exactly '/'", () => {
  it("Given: landing with path '/home', When: validated, Then: isValid is false with a path error mentioning '/'", () => {
    const tree: SiteTreeConfig = {
      landing: {
        meta: { path: "/home", title: "Home", description: "..." },
        sections: [],
      },
    };
    const result = validateSiteTree(tree);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("/"))).toBe(true);
  });

  it("Given: landing with empty path, When: validated, Then: isValid is false", () => {
    const tree: SiteTreeConfig = {
      landing: {
        meta: { path: "", title: "Home", description: "..." },
        sections: [],
      },
    };
    const result = validateSiteTree(tree);
    expect(result.isValid).toBe(false);
  });
});

// ─── Scenario 4: Subsection paths must be unique ─────────────────────────────

describe("Scenario 4: Subsection paths must be unique across the tree", () => {
  it("Given: two subsections with the same path '/same', When: validated, Then: isValid is false with a duplicate-path error", () => {
    const tree: SiteTreeConfig = {
      landing: {
        meta: { path: "/", title: "Home", description: "" },
        sections: [],
        subsections: [
          {
            id: "a",
            meta: { path: "/same", title: "A", description: "" },
            sections: [],
          },
          {
            id: "b",
            meta: { path: "/same", title: "B", description: "" },
            sections: [],
          },
        ],
      },
    };
    const result = validateSiteTree(tree);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("/same"))).toBe(true);
  });
});

// ─── Scenario 5: Subsection IDs must be unique ───────────────────────────────

describe("Scenario 5: Subsection IDs must be unique", () => {
  it("Given: two subsections with the same id 'dup', When: validated, Then: isValid is false mentioning the duplicate id", () => {
    const tree: SiteTreeConfig = {
      landing: {
        meta: { path: "/", title: "Home", description: "" },
        sections: [],
        subsections: [
          {
            id: "dup",
            meta: { path: "/a", title: "A", description: "" },
            sections: [],
          },
          {
            id: "dup",
            meta: { path: "/b", title: "B", description: "" },
            sections: [],
          },
        ],
      },
    };
    const result = validateSiteTree(tree);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("dup"))).toBe(true);
  });
});

// ─── Scenario 6: Subsection path must not be "/" ─────────────────────────────

describe("Scenario 6: Subsection path must not conflict with landing ('/')", () => {
  it("Given: a subsection with path '/', When: validated, Then: isValid is false", () => {
    const tree: SiteTreeConfig = {
      landing: {
        meta: { path: "/", title: "Home", description: "" },
        sections: [],
        subsections: [
          {
            id: "root-conflict",
            meta: { path: "/", title: "Root", description: "" },
            sections: [],
          },
        ],
      },
    };
    const result = validateSiteTree(tree);
    expect(result.isValid).toBe(false);
  });
});

// ─── Scenario 7: Validation result is stable and pure ────────────────────────

describe("Scenario 7: validateSiteTree is a pure function", () => {
  it("Given: the same valid input, When: called twice, Then: results are deeply equal", () => {
    const r1 = validateSiteTree(minimalValidTree);
    const r2 = validateSiteTree(minimalValidTree);
    expect(r1).toEqual(r2);
  });

  it("Given: the same valid input, When: called twice, Then: results are different object references", () => {
    const r1 = validateSiteTree(minimalValidTree);
    const r2 = validateSiteTree(minimalValidTree);
    expect(r1).not.toBe(r2);
  });

  it("Given: the same invalid input, When: called twice, Then: error arrays are deeply equal", () => {
    const badTree: SiteTreeConfig = {
      landing: {
        meta: { path: "/wrong", title: "", description: "" },
        sections: [],
      },
    };
    const r1 = validateSiteTree(badTree);
    const r2 = validateSiteTree(badTree);
    expect(r1.errors).toEqual(r2.errors);
  });
});
