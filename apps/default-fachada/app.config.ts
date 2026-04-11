/**
 * default-fachada app config — Fachada v2 AppConfig package.
 *
 * Composes siteConfig + profileConfig into the canonical AppConfig aggregate.
 * This file is data only — no logic, no domain imports from outside /apps/.
 */

import { siteConfig } from "./site.config";
import { profileConfig } from "./profile.config";
import type { AppConfig } from "../../src/types/app.types";
import type { WidgetLayoutConfig } from "../../src/types/layout.types";

export const appConfig: AppConfig = {
  seo: siteConfig,
  theme: profileConfig.theme,
  themes: {
    globals: ["minimalist", "modern-tech", "professional", "vaporwave"],
    default: "minimalist",
  },
  themeVariants: {},
  themeLayouts: {
    minimalist: {
      hero: "centered",
      skills: "grid-3",
      about: "card",
    } satisfies WidgetLayoutConfig,
    "modern-tech": {
      hero: "split",
      skills: "list",
      about: "plain",
    } satisfies WidgetLayoutConfig,
  },
  assets: {
    ogImage: siteConfig.ogImage,
  },
  page: {
    sections: profileConfig.sections.map((s) => ({ ...s, widgets: [] })),
  },
};
