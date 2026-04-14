/**
 * Site configuration — loaded from the active app at build time.
 *
 * The active app is selected by the APP environment variable.
 * To add a new app, add an entry to .fachadarc.json.
 */

import { appConfig } from "virtual:fachada/active-app";

export const siteConfig = appConfig.seo;

export type { SiteConfig } from "@fachada/core";
