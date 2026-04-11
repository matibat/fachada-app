/**
 * Site configuration — loaded from the active app profile.
 *
 * The active app is selected by the APP environment variable at build time.
 * Example: APP=artist-engineer yarn build
 *
 * To add a new app, see src/profiles/index.ts.
 */

import { activeProfile } from "./profiles/index";

export const siteConfig = activeProfile.siteConfig;

export type { SiteConfig } from "./types/profile.types";
