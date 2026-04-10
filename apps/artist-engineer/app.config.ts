/**
 * artist-engineer app config — Fachada v2 AppConfig package.
 *
 * Composes the artist-engineer-multi profile into the AppConfig aggregate.
 */

import { siteConfig } from "../../src/profiles/artist-engineer-multi/site.config";
import { profileConfig } from "../../src/profiles/artist-engineer-multi/profile.config";
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
