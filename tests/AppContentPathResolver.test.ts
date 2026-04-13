/**
 * BDD: AppContentPathResolver pure function
 *
 * Behavior: Given an appName and contentType, resolveAppContentPath returns
 * the correct relative path for use as an Astro glob() base.
 */
import { describe, it, expect } from "vitest";
import { resolveAppContentPath } from "@fachada/core/content/AppContentPathResolver";

describe("resolveAppContentPath", () => {
  describe("Behavior 1: default-fachada app with pages contentType", () => {
    it(
      "Given appName 'default-fachada' and contentType 'pages', " +
        "When resolveAppContentPath is called, " +
        "Then it returns './apps/default-fachada/pages'",
      () => {
        const result = resolveAppContentPath("default-fachada", "pages");
        expect(result).toBe("./apps/default-fachada/pages");
      },
    );
  });

  describe("Behavior 2: artist-engineer app with blog contentType", () => {
    it(
      "Given appName 'artist-engineer' and contentType 'blog', " +
        "When resolveAppContentPath is called, " +
        "Then it returns './apps/artist-engineer/blog'",
      () => {
        const result = resolveAppContentPath("artist-engineer", "blog");
        expect(result).toBe("./apps/artist-engineer/blog");
      },
    );
  });

  describe("Behavior 3: my-app with pages contentType", () => {
    it(
      "Given appName 'my-app' and contentType 'pages', " +
        "When resolveAppContentPath is called, " +
        "Then it returns './apps/my-app/pages'",
      () => {
        const result = resolveAppContentPath("my-app", "pages");
        expect(result).toBe("./apps/my-app/pages");
      },
    );
  });

  describe("Behavior 4: my-app with blog contentType", () => {
    it(
      "Given appName 'my-app' and contentType 'blog', " +
        "When resolveAppContentPath is called, " +
        "Then it returns './apps/my-app/blog'",
      () => {
        const result = resolveAppContentPath("my-app", "blog");
        expect(result).toBe("./apps/my-app/blog");
      },
    );
  });
});
