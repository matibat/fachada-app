/**
 * Cross-app isolation tests.
 *
 * Enforces that source files in src/ never directly import from a specific
 * app directory (apps/<name>/**). All app data must flow through the
 * `virtual:fachada/active-app` virtual module provided by the Vite plugin.
 *
 * These tests prevent regressions where a component or widget hard-wires
 * content from one app, causing it to appear incorrectly in another app's build.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(__dirname, "..");
const SRC_DIR = resolve(ROOT, "../fachada-core/src");
const APPS_DIR = join(ROOT, "apps");

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Recursively collects absolute paths of all files under `dir` matching
 * the given extensions.
 */
function collectFiles(
  dir: string,
  extensions: string[],
  results: string[] = [],
): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectFiles(full, extensions, results);
    } else if (extensions.some((ext) => full.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const srcFiles = collectFiles(SRC_DIR, [".ts", ".astro", ".tsx"]);
const appNames = readdirSync(APPS_DIR).filter((e) =>
  statSync(join(APPS_DIR, e)).isDirectory(),
);

// ─── Scenario 1: No src/ file imports directly from an apps/ directory ───────

describe("Scenario 1: src/ files do not directly import from apps/ directories", () => {
  const DIRECT_APPS_IMPORT = /from\s+['"][^'"]*\.\.\/apps\//;
  const RELATIVE_APPS_IMPORT = /from\s+['"][^'"]*apps\/[a-z]/;

  for (const filePath of srcFiles) {
    const relativePath = filePath.replace(ROOT + "/", "");

    it(`${relativePath} does not import from apps/`, () => {
      const content = readFileSync(filePath, "utf-8");
      const hasDirect = DIRECT_APPS_IMPORT.test(content);
      const hasRelative = RELATIVE_APPS_IMPORT.test(content);
      expect(
        hasDirect || hasRelative,
        `${relativePath} contains a direct import from an apps/ directory. ` +
          "All app data must flow through virtual:fachada/active-app.",
      ).toBe(false);
    });
  }
});

// ─── Scenario 2: Header and Footer have no hardcoded app-specific paths ───────

describe("Scenario 2: Header and Footer navigation is config-driven, not hardcoded", () => {
  const HEADER_PATH = join(SRC_DIR, "astro/components/Header.astro");
  const FOOTER_PATH = join(SRC_DIR, "astro/components/Footer.astro");

  it("Header.astro does not hardcode app-specific route paths", () => {
    const content = readFileSync(HEADER_PATH, "utf-8");
    // Static href strings that are app-specific navigation targets are not allowed.
    // The only allowed static href is "/" (home). All others come from siteTree config.
    const hardcodedRoutes = [...content.matchAll(/href="(\/[a-z][^"]+)"/g)]
      .map((m) => m[1])
      .filter((href) => href !== "/" && !href.startsWith("mailto:"));
    expect(hardcodedRoutes).toHaveLength(0);
  });

  it("Footer.astro does not hardcode app-specific route paths", () => {
    const content = readFileSync(FOOTER_PATH, "utf-8");
    const hardcodedRoutes = [...content.matchAll(/href="(\/[a-z][^"]+)"/g)]
      .map((m) => m[1])
      .filter((href) => href !== "/" && !href.startsWith("mailto:"));
    expect(hardcodedRoutes).toHaveLength(0);
  });
});

// ─── Scenario 3: Legacy static profile registry no longer exists ─────────────

describe("Scenario 3: Legacy profiles/index.ts static multi-app registry is deleted", () => {
  it("src/profiles/index.ts does not exist", () => {
    expect(existsSync(join(ROOT, "src/profiles/index.ts"))).toBe(false);
  });

  it("src/profiles/ directory does not exist", () => {
    expect(existsSync(join(ROOT, "src/profiles"))).toBe(false);
  });
});

// ─── Scenario 4: Each app config re-exports profileConfig ────────────────────

describe("Scenario 4: Each app config exports profileConfig for the virtual module", () => {
  for (const appName of appNames) {
    const appConfigPath = join(APPS_DIR, appName, "app.config.ts");

    it(`apps/${appName}/app.config.ts exports profileConfig`, () => {
      if (!existsSync(appConfigPath)) return; // skip apps without app.config.ts
      const content = readFileSync(appConfigPath, "utf-8");
      expect(
        content,
        `apps/${appName}/app.config.ts must re-export profileConfig so it is ` +
          "available via virtual:fachada/active-app",
      ).toMatch(/export\s*\{[^}]*profileConfig[^}]*\}/);
    });
  }
});
