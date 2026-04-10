/**
 * Site configuration — loaded from the active profile.
 *
 * The active profile is selected by the PROFILE environment variable at build time.
 * Example: PROFILE=engineer-single-role yarn build
 *
 * To add a new profile, see src/profiles/index.ts.
 */

import { activeProfile } from "./profiles/index";

export const siteConfig = activeProfile.siteConfig;

export type { SiteConfig } from "./types/profile.types";
