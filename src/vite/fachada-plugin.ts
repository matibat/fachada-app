/**
 * vite-plugin-fachada — build-time app selection via .fachadarc.json.
 *
 * Provides the virtual module `virtual:fachada/active-app` which exports:
 *   - `appConfig`     — the build-time-selected AppConfig
 *   - `AVAILABLE_APPS` — frozen array of all app names from .fachadarc.json
 *
 * The active app is resolved in priority order:
 *   1. `activeApp` argument passed to `fachadaPlugin()`
 *   2. `APP` environment variable
 *   3. `defaultApp` field from .fachadarc.json
 *
 * Usage: APP=app-name yarn dev
 *        APP=app-name yarn build
 *
 * Adding a new app: create `apps/<name>/app.config.ts`, add one entry to
 * `.fachadarc.json`. No changes to core code required.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FachadaRc {
  /** App name used when APP / PROFILE env vars are absent. */
  defaultApp: string;
  /** Registry: app name → path relative to project root. */
  apps: Record<string, string>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function readFachadarc(cwd: string = process.cwd()): FachadaRc {
  const path = resolve(cwd, ".fachadarc.json");
  return JSON.parse(readFileSync(path, "utf-8")) as FachadaRc;
}

/**
 * Resolves an app name to a registered app from the registry.
 * Returns defaultApp if the name is not found.
 */
export function resolveAppName(rawName: string, fachadarc: FachadaRc): string {
  return rawName in fachadarc.apps ? rawName : fachadarc.defaultApp;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

const VIRTUAL_ID = "virtual:fachada/active-app";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

/**
 * Returns a Vite plugin that resolves `virtual:fachada/active-app`.
 *
 * @param activeApp - Override the active app name. When omitted the plugin
 *                    reads APP / PROFILE env vars at load time.
 * @param cwd       - Project root. Defaults to `process.cwd()`.
 */
export function fachadaPlugin(activeApp?: string, cwd: string = process.cwd()) {
  return {
    name: "vite-plugin-fachada",
    resolveId(id: string) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id: string) {
      if (id !== RESOLVED_ID) return;

      const fachadarc = readFachadarc(cwd);
      const rawName = activeApp ?? process.env.APP ?? fachadarc.defaultApp;
      const appName = resolveAppName(rawName, fachadarc);
      const appRelPath = fachadarc.apps[appName];
      const absPath = resolve(cwd, appRelPath);
      const availableApps = JSON.stringify(Object.keys(fachadarc.apps));

      return [
        `export { appConfig } from ${JSON.stringify(absPath)};`,
        `export const AVAILABLE_APPS = Object.freeze(${availableApps});`,
      ].join("\n");
    },
  };
}
