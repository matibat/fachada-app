/**
 * Profile registry — maps profile names to their config modules.
 *
 * To add a new profile:
 * 1. Create src/profiles/<name>/site.config.ts
 * 2. Create src/profiles/<name>/profile.config.ts
 * 3. Add an entry to PROFILES below
 * 4. Build with: APP=<name> yarn build
 */

import type { ProfileConfig, SiteConfig } from "../types/profile.types";

import { siteConfig as fachadaSite } from "../../apps/default-fachada/site.config";
import { profileConfig as fachadaProfile } from "../../apps/default-fachada/profile.config";

import { siteConfig as artistEngineerSite } from "../../apps/artist-engineer/site.config";
import { profileConfig as artistEngineerProfile } from "../../apps/artist-engineer/profile.config";

import { siteConfig as engineerSingleRoleSite } from "../../apps/engineer-single-role/site.config";
import { profileConfig as engineerSingleRoleProfile } from "../../apps/engineer-single-role/profile.config";

export interface LoadedProfile {
  siteConfig: SiteConfig;
  profileConfig: ProfileConfig;
}

const PROFILES: Record<string, LoadedProfile> = {
  "default-fachada": {
    siteConfig: fachadaSite,
    profileConfig: fachadaProfile,
  },
  "artist-engineer": {
    siteConfig: artistEngineerSite,
    profileConfig: artistEngineerProfile,
  },
  "engineer-single-role": {
    siteConfig: engineerSingleRoleSite,
    profileConfig: engineerSingleRoleProfile,
  },
};

export const AVAILABLE_PROFILES = Object.keys(PROFILES);

/**
 * Returns the loaded profile for the given name.
 * Falls back to "default-fachada" if the name is not found.
 */
export function getProfile(name: string): LoadedProfile {
  return PROFILES[name] ?? PROFILES["default-fachada"];
}

/** The active app, selected via the APP env var at build time. */
const ACTIVE_APP_NAME = (import.meta.env.APP as string) || "default-fachada";

export const activeProfile = getProfile(ACTIVE_APP_NAME);
