/**
 * Profile configuration — loaded from the active app at build time.
 *
 * The active app is selected by the `APP` environment variable. Apps are
 * auto-discovered from `/apps/` and a single-app layout at `app/app.config.ts`
 * is also supported. You may optionally provide `defaultApp` in
 * `.fachadarc.json` for multi-app projects.
 */

import { profileConfig } from "virtual:fachada/active-app";

export { profileConfig };

export type { ProfileConfig, ThemeStyle, ColorMode } from "@fachada/core";
