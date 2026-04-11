/**
 * default-fachada app config — Fachada v2 AppConfig package.
 *
 * Composes siteConfig + profileConfig into the canonical AppConfig aggregate.
 * This file is data only — no logic, no domain imports from outside /apps/.
 */

import { siteConfig } from "../../src/profiles/default-fachada/site.config";
import { profileConfig } from "../../src/profiles/default-fachada/profile.config";
import type { AppConfig } from "../../src/types/app.types";

export const appConfig: AppConfig = {
  seo: siteConfig,
  theme: profileConfig.theme,
  themes: {
    globals: ["minimalist", "modern-tech", "professional", "vaporwave"],
    default: "minimalist",
  },
  themeVariants: {},
  assets: {
    ogImage: siteConfig.ogImage,
  },
  page: {
    sections: profileConfig.sections.map((s) => ({ ...s, widgets: [] })),
  },
};
