/**
 * SiteTree domain type tests
 *
 * BDD: written before implementation. Importing from site-tree.types.ts causes
 * RED until that module exists.
 */
import { describe, it, expect } from "vitest";
import {
  SITE_TREE_VERSION,
  type SiteTreeConfig,
  type PageMeta,
  type SubsectionDefinition,
  type LandingDefinition,
  type MarkdownPageData,
} from "../src/types/site-tree.types";

// ─── Scenario 0: module exports a version sentinel ────────────────────────────

describe("Scenario 0: site-tree.types module exists and exports a version sentinel", () => {
  it("Given: the module is imported, When: SITE_TREE_VERSION is accessed, Then: it equals 'v1'", () => {
    expect(SITE_TREE_VERSION).toBe("v1");
  });
});

// ─── Scenario 1: PageMeta has required SEO fields ─────────────────────────────

describe("Scenario 1: PageMeta has the required SEO fields", () => {
  it("Given: a well-formed PageMeta, When: accessed, Then: it has path, title, and description", () => {
    const meta: PageMeta = {
      path: "/",
      title: "Home — My Site",
      description: "Welcome to my personal site.",
    };
    expect(meta.path).toBe("/");
    expect(meta.title).toBe("Home — My Site");
    expect(meta.description).toBe("Welcome to my personal site.");
  });
});

// ─── Scenario 2: PageMeta supports optional fields ────────────────────────────

describe("Scenario 2: PageMeta supports optional SEO and LLM fields", () => {
  it("Given: a PageMeta with keywords and llmSummary, When: accessed, Then: both are present", () => {
    const meta: PageMeta = {
      path: "/engineering",
      title: "Engineering",
      description: "My engineering work.",
      keywords: ["TypeScript", "WebGL", "React"],
      llmSummary: "Engineering portfolio with real-time 3D projects.",
    };
    expect(meta.keywords).toEqual(["TypeScript", "WebGL", "React"]);
    expect(meta.llmSummary).toBe(
      "Engineering portfolio with real-time 3D projects.",
    );
  });

  it("Given: a PageMeta with robots directives, When: accessed, Then: disallow and crawlDelay are present", () => {
    const meta: PageMeta = {
      path: "/private",
      title: "Private",
      description: "Not indexed.",
      robots: {
        disallow: ["/private"],
        crawlDelay: 10,
      },
    };
    expect(meta.robots?.disallow).toEqual(["/private"]);
    expect(meta.robots?.crawlDelay).toBe(10);
  });
});

// ─── Scenario 3: LandingDefinition structure ─────────────────────────────────

describe("Scenario 3: LandingDefinition has meta, sections, and optional subsections", () => {
  it("Given: a minimal LandingDefinition, When: accessed, Then: meta.path is '/' and sections is an array", () => {
    const landing: LandingDefinition = {
      meta: { path: "/", title: "Home", description: "Landing page." },
      sections: [],
    };
    expect(landing.meta.path).toBe("/");
    expect(Array.isArray(landing.sections)).toBe(true);
    expect(landing.subsections).toBeUndefined();
  });

  it("Given: a LandingDefinition with subsections, When: accessed, Then: subsections is an array", () => {
    const landing: LandingDefinition = {
      meta: { path: "/", title: "Home", description: "Landing page." },
      sections: [],
      subsections: [],
    };
    expect(Array.isArray(landing.subsections)).toBe(true);
  });
});

// ─── Scenario 4: SubsectionDefinition structure ───────────────────────────────

describe("Scenario 4: SubsectionDefinition has id, meta, and sections", () => {
  it("Given: a SubsectionDefinition for 'engineering', When: accessed, Then: id, meta.path, and sections are present", () => {
    const sub: SubsectionDefinition = {
      id: "engineering",
      meta: {
        path: "/engineering",
        title: "Engineering",
        description: "Software work.",
      },
      sections: [],
    };
    expect(sub.id).toBe("engineering");
    expect(sub.meta.path).toBe("/engineering");
    expect(Array.isArray(sub.sections)).toBe(true);
  });
});

// ─── Scenario 5: SiteTreeConfig has a mandatory landing ──────────────────────

describe("Scenario 5: SiteTreeConfig has a mandatory landing field", () => {
  it("Given: a SiteTreeConfig, When: typed as SiteTreeConfig, Then: landing is accessible and has meta.path '/'", () => {
    const tree: SiteTreeConfig = {
      landing: {
        meta: { path: "/", title: "Home", description: "Landing." },
        sections: [],
      },
    };
    expect(tree.landing).toBeDefined();
    expect(tree.landing.meta.path).toBe("/");
  });

  it("Given: a tree with landing and two subsections, When: accessed, Then: subsections has length 2", () => {
    const tree: SiteTreeConfig = {
      landing: {
        meta: { path: "/", title: "Home", description: "Landing." },
        sections: [],
        subsections: [
          {
            id: "a",
            meta: { path: "/a", title: "A", description: "" },
            sections: [],
          },
          {
            id: "b",
            meta: { path: "/b", title: "B", description: "" },
            sections: [],
          },
        ],
      },
    };
    expect(tree.landing.subsections).toHaveLength(2);
  });
});

// ─── Scenario 6: SubsectionDefinition accepts template "markdown" ──────────────

describe("Scenario 6: SubsectionDefinition accepts template 'markdown'", () => {
  it("Given: a SubsectionDefinition with template 'markdown', When: accessed, Then: template equals 'markdown'", () => {
    const sub: SubsectionDefinition = {
      id: "my-guide",
      meta: { path: "/my-guide", title: "My Guide", description: "A guide." },
      sections: [],
      template: "markdown",
    };
    expect(sub.template).toBe("markdown");
  });
});

// ─── Scenario 7: MarkdownPageData has required contentId and optional layout props ─

describe("Scenario 7: MarkdownPageData has required contentId and optional layout props", () => {
  it("Given: a MarkdownPageData with only contentId, When: accessed, Then: contentId is present", () => {
    const data: MarkdownPageData = {
      contentId: "my-guide",
    };
    expect(data.contentId).toBe("my-guide");
    expect(data.downloadFilename).toBeUndefined();
    expect(data.backLink).toBeUndefined();
    expect(data.nextLink).toBeUndefined();
  });

  it("Given: a MarkdownPageData with all optional props, When: accessed, Then: all fields are present", () => {
    const data: MarkdownPageData = {
      contentId: "my-guide",
      downloadFilename: "my-guide.pdf",
      backLink: { href: "/", label: "Home" },
      nextLink: { href: "/other", label: "Next" },
    };
    expect(data.downloadFilename).toBe("my-guide.pdf");
    expect(data.backLink).toEqual({ href: "/", label: "Home" });
    expect(data.nextLink).toEqual({ href: "/other", label: "Next" });
  });

  it("Given: a SubsectionDefinition with template 'markdown' and MarkdownPageData, When: accessed, Then: templateData.contentId is present", () => {
    const sub: SubsectionDefinition = {
      id: "my-guide",
      meta: { path: "/my-guide", title: "My Guide", description: "A guide." },
      sections: [],
      template: "markdown",
      templateData: { contentId: "my-guide" } satisfies MarkdownPageData,
    };
    const data = sub.templateData as MarkdownPageData;
    expect(data.contentId).toBe("my-guide");
  });
});
