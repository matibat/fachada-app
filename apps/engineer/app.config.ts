/**
 * engineer app config — Fachada v2 AppConfig package.
 *
 * Composes the engineer-single-role profile into the AppConfig aggregate.
 */

import { siteConfig } from "../../src/profiles/engineer-single-role/site.config";
import { profileConfig } from "../../src/profiles/engineer-single-role/profile.config";
import type { AppConfig } from "../../src/types/app.types";

export const appConfig: AppConfig = {
  seo: siteConfig,
  theme: profileConfig.theme,
  themeVariants: {},
  assets: {
    ogImage: siteConfig.ogImage,
  },
  page: {
    sections: profileConfig.sections.map((s) => ({ ...s, widgets: [] })),
  },
};
