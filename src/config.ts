/**
 * Site configuration — loaded from the active app at build time.
 *
 * The active app is selected by the `APP` environment variable. Apps are
 * auto-discovered from `/apps/` and the plugin also supports a single-app
 * convention at `app/app.config.ts`. You can optionally set `defaultApp` in
 * `.fachadarc.json` for multi-app projects.
 */

import { appConfig } from "virtual:fachada/active-app";

export const siteConfig = appConfig.seo;

export type { SiteConfig } from "@fachada/core";
