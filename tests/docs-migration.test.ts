/**
 * BDD: docs migration — template:"document" → template:"markdown"
 *
 * Verifies the structural migration of the three resource pages in the
 * default-fachada app config from the legacy "document" template to the
 * content-collection "markdown" template.
 */
import { describe, it, expect } from "vitest";
import { appConfig } from "../apps/default-fachada/app.config";
import type { MarkdownPageData } from "@fachada/core/types/site-tree.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function allSubsections() {
  return appConfig.siteTree.landing.subsections ?? [];
}

// ─── Behavior: no subsection uses template "document" ─────────────────────────

describe("Behavior: no subsection in default-fachada uses template 'document'", () => {
  it(
    "Given the default-fachada app config, " +
      "When all subsections are inspected, " +
      "Then none has template equal to 'document'",
    () => {
      const subsections = allSubsections();
      const documentTemplates = subsections.filter(
        (s) => s.template === "document",
      );
      expect(documentTemplates).toHaveLength(0);
    },
  );
});

// ─── Behavior: all three resource pages use template "markdown" ───────────────

describe("Behavior: the three resource pages use template 'markdown' with contentId", () => {
  const resourceIds = [
    "resources-asset-manual",
    "resources-app-builder-guide",
    "resources-theme-configuration",
  ] as const;

  for (const id of resourceIds) {
    describe(`Subsection '${id}'`, () => {
      it(
        `Given the default-fachada app config, ` +
          `When subsection '${id}' is inspected, ` +
          `Then its template is 'markdown'`,
        () => {
          const sub = allSubsections().find((s) => s.id === id);
          expect(sub).toBeDefined();
          expect(sub!.template).toBe("markdown");
        },
      );

      it(
        `Given the default-fachada app config, ` +
          `When subsection '${id}' templateData is inspected, ` +
          `Then contentId is a non-empty string`,
        () => {
          const sub = allSubsections().find((s) => s.id === id);
          expect(sub).toBeDefined();
          const data = sub!.templateData as MarkdownPageData;
          expect(typeof data.contentId).toBe("string");
          expect(data.contentId.length).toBeGreaterThan(0);
        },
      );
    });
  }

  it(
    "Given the default-fachada app config, " +
      "When all three resource subsections' contentIds are collected, " +
      "Then they match the expected page slugs",
    () => {
      const expected: Record<string, string> = {
        "resources-asset-manual": "fachada-asset-manual",
        "resources-app-builder-guide": "fachada-app-builder-guide",
        "resources-theme-configuration": "fachada-theme-guide",
      };

      for (const [id, expectedSlug] of Object.entries(expected)) {
        const sub = allSubsections().find((s) => s.id === id);
        expect(sub, `subsection '${id}' not found`).toBeDefined();
        const data = sub!.templateData as MarkdownPageData;
        expect(data.contentId, `contentId for '${id}'`).toBe(expectedSlug);
      }
    },
  );
});

// ─── Behavior: navigation links are preserved after migration ─────────────────

describe("Behavior: navigation links (backLink/nextLink) are preserved in templateData after migration", () => {
  it(
    "Given the default-fachada app config, " +
      "When resources-asset-manual templateData is inspected, " +
      "Then backLink and nextLink are intact",
    () => {
      const sub = allSubsections().find(
        (s) => s.id === "resources-asset-manual",
      );
      expect(sub).toBeDefined();
      const data = sub!.templateData as MarkdownPageData;
      expect(data.backLink).toEqual({
        href: "/resources",
        label: "Back to Resources",
      });
      expect(data.nextLink).toEqual({
        href: "/resources/app-builder-guide",
        label: "App Builder Guide",
      });
    },
  );

  it(
    "Given the default-fachada app config, " +
      "When resources-theme-configuration templateData is inspected, " +
      "Then backLink is intact and nextLink is absent",
    () => {
      const sub = allSubsections().find(
        (s) => s.id === "resources-theme-configuration",
      );
      expect(sub).toBeDefined();
      const data = sub!.templateData as MarkdownPageData;
      expect(data.backLink).toEqual({
        href: "/resources/app-builder-guide",
        label: "App Builder Guide",
      });
      expect(data.nextLink).toBeUndefined();
    },
  );
});
