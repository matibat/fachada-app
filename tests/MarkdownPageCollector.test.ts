/**
 * MarkdownPageCollector domain service tests
 *
 * BDD: written before implementation. Importing from MarkdownPageCollector
 * causes RED until src/site-tree/MarkdownPageCollector.ts exists.
 *
 * No imports from astro:content — the service receives already-fetched entries.
 */
import { describe, it, expect } from "vitest";
import {
  collectMarkdownPages,
  type CollectionEntry,
  type CollectedPagesResult,
} from "../src/site-tree/MarkdownPageCollector";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

function makeEntry(
  id: string,
  overrides: Partial<CollectionEntry["data"]> = {},
): CollectionEntry {
  return {
    id,
    data: {
      title: "Test Page",
      description: "A test page.",
      apps: ["default-fachada"],
      ...overrides,
    },
  };
}

const noExistingPaths = new Set<string>();

// ─── Scenario 1: Matching app ─────────────────────────────────────────────────

describe("Scenario 1: Matching app — entry with apps matching activeApp returns one page", () => {
  it(
    "Given an entry with apps: ['default-fachada'] and activeApp 'default-fachada', " +
      "When collectMarkdownPages is called, " +
      "Then result.pages contains one SubsectionDefinition with template 'markdown', correct meta, and templateData.contentId = entry.id",
    () => {
      const entry = makeEntry("about", {
        apps: ["default-fachada"],
        path: "/about",
      });
      const result: CollectedPagesResult = collectMarkdownPages(
        [entry],
        "default-fachada",
        noExistingPaths,
      );

      expect(result.pages).toHaveLength(1);
      const page = result.pages[0];
      expect(page.template).toBe("markdown");
      expect(page.meta.path).toBe("/about");
      expect(page.meta.title).toBe("Test Page");
      expect(page.meta.description).toBe("A test page.");
      expect(page.templateData).toMatchObject({ contentId: "about" });
      expect(result.skipped).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    },
  );
});

// ─── Scenario 2: Wildcard apps ────────────────────────────────────────────────

describe('Scenario 2: Wildcard apps — entry with apps: "*" is included for any activeApp', () => {
  it(
    'Given an entry with apps: "*" and activeApp "any-app", ' +
      "When collectMarkdownPages is called, " +
      "Then result.pages contains one page",
    () => {
      const entry = makeEntry("wildcard-page", {
        apps: "*",
        path: "/wildcard-page",
      });
      const result = collectMarkdownPages([entry], "any-app", noExistingPaths);

      expect(result.pages).toHaveLength(1);
      expect(result.skipped).toHaveLength(0);
    },
  );
});

// ─── Scenario 3: Wrong app ────────────────────────────────────────────────────

describe("Scenario 3: Wrong app — entry whose apps does not include activeApp is skipped", () => {
  it(
    "Given an entry with apps: ['other-app'] and activeApp 'default-fachada', " +
      "When collectMarkdownPages is called, " +
      "Then result.pages is empty and result.skipped contains the entry id",
    () => {
      const entry = makeEntry("foreign", { apps: ["other-app"] });
      const result = collectMarkdownPages(
        [entry],
        "default-fachada",
        noExistingPaths,
      );

      expect(result.pages).toHaveLength(0);
      expect(result.skipped.some((s) => s.id === "foreign")).toBe(true);
    },
  );
});

// ─── Scenario 4: Path collision ───────────────────────────────────────────────

describe("Scenario 4: Path collision — entry whose resolved path collides with existingPaths is added to errors", () => {
  it(
    "Given an entry with path '/about' and existingPaths containing '/about', " +
      "When collectMarkdownPages is called, " +
      "Then result.pages is empty and result.errors contains the entry id",
    () => {
      const entry = makeEntry("about", {
        apps: ["default-fachada"],
        path: "/about",
      });
      const existing = new Set(["/about"]);
      const result = collectMarkdownPages([entry], "default-fachada", existing);

      expect(result.pages).toHaveLength(0);
      expect(result.errors.some((e) => e.id === "about")).toBe(true);
      expect(result.skipped).toHaveLength(0);
    },
  );
});

// ─── Scenario 5: Path "/" skipped ─────────────────────────────────────────────

describe('Scenario 5: Path "/" skipped — entry with data.path "/" is added to skipped', () => {
  it(
    'Given an entry with path: "/" and a matching activeApp, ' +
      "When collectMarkdownPages is called, " +
      "Then result.pages is empty and result.skipped contains the entry id",
    () => {
      const entry = makeEntry("root-collision", {
        apps: ["default-fachada"],
        path: "/",
      });
      const result = collectMarkdownPages(
        [entry],
        "default-fachada",
        noExistingPaths,
      );

      expect(result.pages).toHaveLength(0);
      expect(result.skipped.some((s) => s.id === "root-collision")).toBe(true);
    },
  );
});

// ─── Scenario 6: Default path from id ─────────────────────────────────────────

describe("Scenario 6: Default path from id — entry with no data.path resolves to '/{id}'", () => {
  it(
    "Given an entry with id 'about' and no data.path, " +
      "When collectMarkdownPages is called, " +
      "Then result.pages[0].meta.path is '/about'",
    () => {
      const entry = makeEntry("about", { apps: ["default-fachada"] });
      // no path field — omit it
      delete (entry.data as { path?: string }).path;
      const result = collectMarkdownPages(
        [entry],
        "default-fachada",
        noExistingPaths,
      );

      expect(result.pages).toHaveLength(1);
      expect(result.pages[0].meta.path).toBe("/about");
    },
  );
});

// ─── Scenario 7: Optional meta fields preserved ───────────────────────────────

describe("Scenario 7: Optional meta fields — keywords, llmSummary, ogImage map into meta", () => {
  it(
    "Given an entry with keywords, llmSummary, and ogImage, " +
      "When collectMarkdownPages is called, " +
      "Then result.pages[0].meta carries all three fields correctly",
    () => {
      const entry = makeEntry("rich-meta", {
        apps: ["default-fachada"],
        path: "/rich-meta",
        keywords: ["astro", "markdown"],
        llmSummary: "A summary for LLMs.",
        ogImage: "/images/og.png",
      });
      const result = collectMarkdownPages(
        [entry],
        "default-fachada",
        noExistingPaths,
      );

      expect(result.pages).toHaveLength(1);
      const meta = result.pages[0].meta;
      expect(meta.keywords).toEqual(["astro", "markdown"]);
      expect(meta.llmSummary).toBe("A summary for LLMs.");
      expect(meta.ogImage).toBe("/images/og.png");
    },
  );
});

// ─── Scenario 8: Optional MarkdownPageData fields preserved ──────────────────

describe("Scenario 8: Optional MarkdownPageData fields — downloadFilename, backLink, nextLink map into templateData", () => {
  it(
    "Given an entry with downloadFilename, backLink, and nextLink, " +
      "When collectMarkdownPages is called, " +
      "Then result.pages[0].templateData carries all three fields correctly",
    () => {
      const entry = makeEntry("rich-template", {
        apps: ["default-fachada"],
        path: "/rich-template",
        downloadFilename: "guide.pdf",
        backLink: { href: "/prev", label: "Previous" },
        nextLink: { href: "/next", label: "Next" },
      });
      const result = collectMarkdownPages(
        [entry],
        "default-fachada",
        noExistingPaths,
      );

      expect(result.pages).toHaveLength(1);
      const td = result.pages[0].templateData as {
        contentId: string;
        downloadFilename?: string;
        backLink?: { href: string; label: string };
        nextLink?: { href: string; label: string };
      };
      expect(td.contentId).toBe("rich-template");
      expect(td.downloadFilename).toBe("guide.pdf");
      expect(td.backLink).toEqual({ href: "/prev", label: "Previous" });
      expect(td.nextLink).toEqual({ href: "/next", label: "Next" });
    },
  );
});

// ─── Scenario 9: No apps field — schema default "*" matches any activeApp ─────

function makeEntryNoApps(id: string): CollectionEntry {
  return {
    id,
    data: {
      title: "No Apps Field Page",
      description: "A page without explicit apps.",
      apps: "*", // schema default — as if no apps field was set in frontmatter
    },
  };
}

describe('Scenario 9: No apps field — entry with no apps field (schema default "*") is included for any activeApp', () => {
  it(
    'Given an entry whose apps field was omitted in frontmatter (schema fills in "*") and activeApp is any value, ' +
      "When collectMarkdownPages is called, " +
      "Then result.pages contains the entry",
    () => {
      const entry = makeEntryNoApps("no-apps-page");
      const result = collectMarkdownPages(
        [entry],
        "any-random-app",
        noExistingPaths,
      );

      expect(result.pages).toHaveLength(1);
      expect(result.skipped).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    },
  );
});
