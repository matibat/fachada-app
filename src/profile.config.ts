/**
 * Profile configuration — loaded from the active app at build time.
 *
 * The active app is selected by the APP environment variable.
 * To add a new app, add an entry to .fachadarc.json.
 */

import { profileConfig } from "virtual:fachada/active-app";

export { profileConfig };

export type {
  ProfileConfig,
  ThemeStyle,
  ColorMode,
} from "@fachada/core";
