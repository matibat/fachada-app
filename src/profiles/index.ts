/**
 * Profile registry — maps profile names to their config modules.
 *
 * To add a new profile:
 * 1. Create src/profiles/<name>/site.config.ts
 * 2. Create src/profiles/<name>/profile.config.ts
 * 3. Add an entry to PROFILES below
 * 4. Build with: PROFILE=<name> yarn build
 */

import type { ProfileConfig, SiteConfig } from "../types/profile.types";

import { siteConfig as fachadaSite } from "./default-fachada/site.config";
import { profileConfig as fachadaProfile } from "./default-fachada/profile.config";

import { siteConfig as engineerSite } from "./engineer-single-role/site.config";
import { profileConfig as engineerProfile } from "./engineer-single-role/profile.config";

import { siteConfig as artistEngineerSite } from "./artist-engineer-multi/site.config";
import { profileConfig as artistEngineerProfile } from "./artist-engineer-multi/profile.config";

export interface LoadedProfile {
  siteConfig: SiteConfig;
  profileConfig: ProfileConfig;
}

const PROFILES: Record<string, LoadedProfile> = {
  "default-fachada": {
    siteConfig: fachadaSite,
    profileConfig: fachadaProfile,
  },
  "engineer-single-role": {
    siteConfig: engineerSite,
    profileConfig: engineerProfile,
  },
  "artist-engineer-multi": {
    siteConfig: artistEngineerSite,
    profileConfig: artistEngineerProfile,
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

/** The active profile, selected via the PROFILE env var at build time. */
const ACTIVE_PROFILE_NAME =
  (import.meta.env.PROFILE as string) || "default-fachada";

export const activeProfile = getProfile(ACTIVE_PROFILE_NAME);
