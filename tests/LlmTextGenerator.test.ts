/**
 * LlmTextGenerator domain service tests
 *
 * BDD: written before implementation. Importing from LlmTextGenerator causes
 * RED until src/site-tree/LlmTextGenerator.ts exists.
 *
 * llm.txt follows the llms.txt specification (https://llmstxt.org):
 *   # Site Name
 *   > Short description
 *   ## Pages
 *   - [Title](path): Description
 */
import { describe, it, expect } from "vitest";
import { generateLlmTxt } from "@fachada/core/site-tree/LlmTextGenerator";
import type { SiteConfig } from "@fachada/core/types/profile.types";
import type { SiteTreeConfig } from "@fachada/core/types/site-tree.types";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const baseSiteConfig: SiteConfig = {
  name: "Test Author",
  title: "Test Author — Engineer",
  description: "A software engineer and digital artist.",
  author: "Test Author",
  url: "https://test.example.com",
  ogImage: "/og.png",
  social: {
    github: "testuser",
    linkedin: "testuser",
    twitter: "testuser",
    email: "test@test.com",
  },
  location: { city: "Test City", country: "Test Country" },
  roles: [],
  primaryRole: "engineer",
  analytics: { plausibleDomain: "" },
};

const baseTree: SiteTreeConfig = {
  landing: {
    meta: {
      path: "/",
      title: "Home",
      description: "Landing page.",
      llmSummary: "Main landing — overview of both engineering and art worlds.",
    },
    sections: [],
  },
};

const treeWithSubsections: SiteTreeConfig = {
  landing: {
    meta: {
      path: "/",
      title: "Home",
      description: "Landing page.",
      llmSummary: "Main landing — overview of both engineering and art worlds.",
    },
    sections: [],
    subsections: [
      {
        id: "engineering",
        meta: {
          path: "/engineering",
          title: "Engineering",
          description: "Software engineering portfolio.",
          llmSummary: "TypeScript, WebGL, and React projects.",
        },
        sections: [],
      },
      {
        id: "art",
        meta: {
          path: "/art",
          title: "Art",
          description: "Digital art portfolio.",
          llmSummary: "Generative systems, 3D sculpture, and GLSL shaders.",
        },
        sections: [],
      },
    ],
  },
};

// ─── Scenario 1: H1 heading with site name ────────────────────────────────────

describe("Scenario 1: Output begins with the site name as an H1 heading", () => {
  it("Given: siteConfig.name = 'Test Author', When: generateLlmTxt, Then: output starts with '# Test Author'", () => {
    const result = generateLlmTxt(baseSiteConfig, baseTree);
    expect(result.startsWith("# Test Author")).toBe(true);
  });
});

// ─── Scenario 2: Site description as blockquote ──────────────────────────────

describe("Scenario 2: Site description appears as a Markdown blockquote", () => {
  it("Given: siteConfig.description = 'A software engineer...', When: generateLlmTxt, Then: output contains '> A software engineer...'", () => {
    const result = generateLlmTxt(baseSiteConfig, baseTree);
    expect(result).toContain("> A software engineer and digital artist.");
  });
});

// ─── Scenario 3: Landing llmSummary in output ────────────────────────────────

describe("Scenario 3: Landing page llmSummary appears in the output", () => {
  it("Given: landing.meta.llmSummary = '...', When: generateLlmTxt, Then: the summary text is present in output", () => {
    const result = generateLlmTxt(baseSiteConfig, baseTree);
    expect(result).toContain(
      "Main landing — overview of both engineering and art worlds.",
    );
  });
});

// ─── Scenario 4: Subsections listed as Markdown links ────────────────────────

describe("Scenario 4: Each subsection appears as a Markdown link with description", () => {
  it("Given: subsection 'Engineering' at '/engineering', When: generateLlmTxt, Then: output contains '[Engineering](/engineering)'", () => {
    const result = generateLlmTxt(baseSiteConfig, treeWithSubsections);
    expect(result).toContain("[Engineering](/engineering)");
  });

  it("Given: subsection 'Art' at '/art', When: generateLlmTxt, Then: output contains '[Art](/art)'", () => {
    const result = generateLlmTxt(baseSiteConfig, treeWithSubsections);
    expect(result).toContain("[Art](/art)");
  });

  it("Given: subsection 'Engineering' with description '...', When: generateLlmTxt, Then: the description is in the output", () => {
    const result = generateLlmTxt(baseSiteConfig, treeWithSubsections);
    expect(result).toContain("Software engineering portfolio.");
  });

  it("Given: subsection 'Art' with description '...', When: generateLlmTxt, Then: the description is in the output", () => {
    const result = generateLlmTxt(baseSiteConfig, treeWithSubsections);
    expect(result).toContain("Digital art portfolio.");
  });
});

// ─── Scenario 5: Landing appears as the first page link ──────────────────────

describe("Scenario 5: Landing page is included as a link to '/'", () => {
  it("Given: landing with title 'Home', When: generateLlmTxt, Then: output contains '[Home](/)'", () => {
    const result = generateLlmTxt(baseSiteConfig, baseTree);
    expect(result).toContain("[Home](/)");
  });
});

// ─── Scenario 6: No subsections — no extra page links ────────────────────────

describe("Scenario 6: With no subsections only the landing link is listed", () => {
  it("Given: landing-only tree, When: generateLlmTxt, Then: output does not contain '/engineering' or '/art'", () => {
    const result = generateLlmTxt(baseSiteConfig, baseTree);
    expect(result).not.toContain("/engineering");
    expect(result).not.toContain("/art");
  });
});

// ─── Scenario 7: Pure function ───────────────────────────────────────────────

describe("Scenario 7: generateLlmTxt is a pure function", () => {
  it("Given: the same inputs, When: called twice, Then: the results are identical strings", () => {
    const r1 = generateLlmTxt(baseSiteConfig, baseTree);
    const r2 = generateLlmTxt(baseSiteConfig, baseTree);
    expect(r1).toBe(r2);
  });

  it("Given: the same inputs with subsections, When: called twice, Then: results are identical", () => {
    const r1 = generateLlmTxt(baseSiteConfig, treeWithSubsections);
    const r2 = generateLlmTxt(baseSiteConfig, treeWithSubsections);
    expect(r1).toBe(r2);
  });
});
