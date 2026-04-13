/**
 * StaticPathBuilder — BDD integration smoke tests
 *
 * Verifies that buildMergedStaticPaths calls collectMarkdownPages with the
 * correct existingPaths Set derived from config-declared subsections, and that
 * the merged result covers both config-declared and MD-discovered pages.
 *
 * No Astro virtual module imports — all data is injected as plain arguments.
 * collectMarkdownPages is mocked so the spy can assert the exact call args.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted before imports; mock is in effect when StaticPathBuilder
// is first required/imported.
vi.mock("@fachada/core/site-tree/MarkdownPageCollector", () => ({
  collectMarkdownPages: vi
    .fn()
    .mockReturnValue({ pages: [], skipped: [], errors: [] }),
}));

import { buildMergedStaticPaths } from "@fachada/core";
import { collectMarkdownPages } from "@fachada/core/site-tree/MarkdownPageCollector";
import type { SubsectionDefinition } from "@fachada/core";
import type { CollectionEntry } from "@fachada/core/site-tree/MarkdownPageCollector";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

function makeConfigSubsection(path: string, id?: string): SubsectionDefinition {
  return {
    id: id ?? path.replace(/^\//, ""),
    meta: { path, title: "Title", description: "Description." },
    sections: [],
  };
}

function makeEntry(id: string, path: string): CollectionEntry {
  return {
    id,
    data: {
      title: "MD Page",
      description: "A markdown page.",
      apps: ["default-fachada"],
      path,
    },
  };
}

// ─── Scenario 1: existingPaths is derived from config-declared subsections ────

describe(
  "Scenario 1: buildMergedStaticPaths passes existingPaths derived from config subsections " +
    "to collectMarkdownPages",
  () => {
    beforeEach(() => {
      vi.mocked(collectMarkdownPages).mockClear();
    });

    it(
      "Given: config subsections at '/engineering' and '/art', " +
        "When: buildMergedStaticPaths is called, " +
        "Then: collectMarkdownPages receives existingPaths = Set(['/engineering', '/art'])",
      () => {
        const configSubsections = [
          makeConfigSubsection("/engineering"),
          makeConfigSubsection("/art"),
        ];
        const entries: CollectionEntry[] = [];

        buildMergedStaticPaths(configSubsections, entries, "default-fachada");

        expect(collectMarkdownPages).toHaveBeenCalledOnce();
        const [, , calledPaths] = vi.mocked(collectMarkdownPages).mock.calls[0];
        expect(calledPaths).toBeInstanceOf(Set);
        expect((calledPaths as Set<string>).has("/engineering")).toBe(true);
        expect((calledPaths as Set<string>).has("/art")).toBe(true);
        expect((calledPaths as Set<string>).size).toBe(2);
      },
    );

    it(
      "Given: no config subsections, " +
        "When: buildMergedStaticPaths is called, " +
        "Then: collectMarkdownPages receives an empty existingPaths Set",
      () => {
        buildMergedStaticPaths([], [], "default-fachada");

        expect(collectMarkdownPages).toHaveBeenCalledOnce();
        const [, , calledPaths] = vi.mocked(collectMarkdownPages).mock.calls[0];
        expect((calledPaths as Set<string>).size).toBe(0);
      },
    );

    it(
      "Given: config subsections, " +
        "When: buildMergedStaticPaths is called, " +
        "Then: collectMarkdownPages receives the entries and appName as first two args",
      () => {
        const entries = [makeEntry("about", "/about")];
        buildMergedStaticPaths([], entries, "artist-engineer");

        const [calledEntries, calledAppName] =
          vi.mocked(collectMarkdownPages).mock.calls[0];
        expect(calledEntries).toBe(entries);
        expect(calledAppName).toBe("artist-engineer");
      },
    );
  },
);

// ─── Scenario 2: Merged paths include both config-declared and MD-discovered ──

describe("Scenario 2: merged result includes slugs from config-declared subsections AND MD-discovered pages", () => {
  beforeEach(() => {
    vi.mocked(collectMarkdownPages).mockClear();
  });

  it(
    "Given: config has '/engineering' subsection and mock returns one MD page at '/about', " +
      "When: buildMergedStaticPaths is called, " +
      "Then: result slugs include 'engineering' (config) and 'about' (MD)",
    () => {
      // Mock returns one discovered MD page at /about
      vi.mocked(collectMarkdownPages).mockReturnValueOnce({
        pages: [
          {
            id: "about",
            meta: {
              path: "/about",
              title: "MD Page",
              description: "A markdown page.",
            },
            sections: [],
            template: "markdown",
            templateData: { contentId: "about" },
          },
        ],
        skipped: [],
        errors: [],
      });

      const configSubsections = [makeConfigSubsection("/engineering")];
      const entries = [makeEntry("about", "/about")];

      const paths = buildMergedStaticPaths(
        configSubsections,
        entries,
        "default-fachada",
      );

      const slugs = paths.map((p) => p.params.slug);
      expect(slugs).toContain("engineering");
      expect(slugs).toContain("about");
    },
  );
});

// ─── Scenario 3: Config-declared paths take precedence over MD pages ──────────

describe("Scenario 3: MD page whose path collides with a config-declared path is excluded (config wins)", () => {
  it(
    "Given: config has '/engineering' subsection and a pages entry also at '/engineering', " +
      "When: buildMergedStaticPaths is called (mocked collectMarkdownPages returns no pages), " +
      "Then: result contains exactly one 'engineering' slug from config",
    () => {
      vi.mocked(collectMarkdownPages).mockReturnValueOnce({
        pages: [],
        skipped: [],
        errors: [
          {
            id: "engineering-md",
            reason: 'path "/engineering" already registered',
          },
        ],
      });

      const configSubsections = [makeConfigSubsection("/engineering")];
      const collidingEntry = makeEntry("engineering-md", "/engineering");

      const paths = buildMergedStaticPaths(
        configSubsections,
        [collidingEntry],
        "default-fachada",
      );

      const slugs = paths.map((p) => p.params.slug);
      expect(slugs.filter((s) => s === "engineering")).toHaveLength(1);
    },
  );
});
