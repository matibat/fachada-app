/**
 * engineer-single-role app config — Fachada v2 AppConfig package.
 *
 * Minimal AppConfig for a backend engineer single-role portfolio.
 * Theme switcher is disabled; locked to modern-tech.
 */

import { siteConfig } from "./site.config";
import { profileConfig } from "./profile.config";
export { profileConfig } from "./profile.config";
import type { AppConfig } from "../../src/types/app.types";

export const appConfig: AppConfig = {
  seo: siteConfig,
  theme: profileConfig.theme,
  themes: {
    globals: ["modern-tech"],
    default: "modern-tech",
  },
  themeVariants: {},
  assets: {
    ogImage: siteConfig.ogImage,
  },
  page: {
    sections: profileConfig.sections.map((s) => ({ ...s, widgets: [] })),
  },
};
