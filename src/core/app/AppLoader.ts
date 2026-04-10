/**
 * AppLoader — infrastructure service.
 *
 * The single place that resolves which AppConfig is active.
 * Core domain has zero knowledge of which app is loaded — it only ever sees
 * the resolved AppConfig returned by this module.
 *
 * Naming conventions:
 *   APP env var (v2)      → "default-fachada" | "engineer" | "artist-engineer"
 *   PROFILE env var (v1)  → "default-fachada" | "engineer-single-role" | "artist-engineer-multi"
 *
 * Legacy PROFILE names are mapped to their v2 equivalents for one release cycle.
 */

import type { AppConfig } from "../../types/app.types";
import { appConfig as defaultFachadaConfig } from "../../../apps/default-fachada/app.config";
import { appConfig as engineerConfig } from "../../../apps/engineer/app.config";
import { appConfig as artistEngineerConfig } from "../../../apps/artist-engineer/app.config";

/** Maps legacy PROFILE environment variable values to v2 APP names. */
const PROFILE_ALIAS: Record<string, string> = {
  "engineer-single-role": "engineer",
  "artist-engineer-multi": "artist-engineer",
};

const APP_REGISTRY: Record<string, AppConfig> = {
  "default-fachada": defaultFachadaConfig,
  engineer: engineerConfig,
  "artist-engineer": artistEngineerConfig,
};

/** Ordered list of all known app identifiers (v2 names only). */
export const AVAILABLE_APPS: readonly string[] = Object.freeze(
  Object.keys(APP_REGISTRY),
);

/**
 * Returns the AppConfig for the given app name.
 * Accepts both v2 ("engineer") and legacy v1 ("engineer-single-role") names.
 * Falls back to "default-fachada" when the name is unknown.
 *
 * @param appName - The app identifier (from APP or PROFILE env var)
 */
export function loadAppConfig(appName: string): AppConfig {
  const resolvedName = PROFILE_ALIAS[appName] ?? appName;
  return APP_REGISTRY[resolvedName] ?? APP_REGISTRY["default-fachada"];
}
