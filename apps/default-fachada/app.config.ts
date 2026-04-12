/**
 * default-fachada app config — Fachada v2 AppConfig package.
 *
 * Composes siteConfig + profileConfig into the canonical AppConfig aggregate.
 * This file is data only — no logic, no domain imports from outside /apps/.
 */

import { siteConfig } from "./site.config";
import { profileConfig } from "./profile.config";
export { profileConfig } from "./profile.config";
import type { AppConfig } from "../../src/types/app.types";
import type { SiteTreeConfig } from "../../src/types/site-tree.types";
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
  siteTree: {
    landing: {
      meta: {
        path: "/",
        title: siteConfig.title,
        description: siteConfig.description,
        keywords: [
          "portfolio framework",
          "Astro portfolio",
          "open source portfolio",
          "config-driven portfolio",
          "fachada framework",
        ],
        llmSummary:
          "Fachada is an open-source portfolio framework built with Astro. " +
          "Config-driven, multi-theme, multi-role. Everything on this page came from a config file.",
      },
      template: "landing",
      sections: [],
      subsections: [
        {
          id: "resources",
          meta: {
            path: "/resources",
            title: "Resources — Build a Fachada App",
            description:
              "Guides and documentation for building your own Fachada portfolio app.",
          },
          template: "hub",
          templateData: {
            cards: [
              {
                title: "Asset Manual",
                description:
                  "Complete checklist of text, images, and branding assets you need before building your app.",
                link: "/resources/asset-manual",
                bullets: [
                  "Brand identity (logo, colors, fonts)",
                  "Site metadata and social links",
                  "Professional roles and bio content",
                  "Project case studies",
                  "Images and media specifications",
                ],
              },
              {
                title: "App Builder Guide",
                description:
                  "Technical step-by-step instructions for creating and deploying a new Fachada app.",
                link: "/resources/app-builder-guide",
                bullets: [
                  "App directory structure setup",
                  "Configuration files (site, profile, app config)",
                  "Content and asset organisation",
                  "Build and deployment",
                  "Testing and verification",
                ],
              },
              {
                title: "Theme & Layout Configuration",
                description:
                  "Customise visual themes, colors, and layout structure for your portfolio.",
                link: "/resources/theme-configuration",
                bullets: [
                  "4 built-in themes with light/dark modes",
                  "Quick theme selection",
                  "Custom color palettes",
                  "Layout and section control",
                  "CSS variables and advanced styling",
                ],
              },
            ],
          },
          sections: [],
        },
        {
          id: "resources-asset-manual",
          meta: {
            path: "/resources/asset-manual",
            title: "Asset Manual — Fachada",
            description:
              "Complete checklist of text, image, and branding assets needed before building a Fachada app.",
          },
          template: "markdown",
          templateData: {
            contentId: "fachada-asset-manual",
            downloadFilename: "fachada-asset-manual.md",
            backLink: { href: "/resources", label: "Back to Resources" },
            nextLink: {
              href: "/resources/app-builder-guide",
              label: "App Builder Guide",
            },
          },
          sections: [],
        },
        {
          id: "resources-app-builder-guide",
          meta: {
            path: "/resources/app-builder-guide",
            title: "App Builder Guide — Fachada",
            description:
              "Step-by-step technical instructions for creating and deploying a new Fachada app.",
          },
          template: "markdown",
          templateData: {
            contentId: "fachada-app-builder-guide",
            downloadFilename: "fachada-app-builder-guide.md",
            backLink: {
              href: "/resources/asset-manual",
              label: "Asset Manual",
            },
            nextLink: {
              href: "/resources/theme-configuration",
              label: "Theme Configuration",
            },
          },
          sections: [],
        },
        {
          id: "resources-theme-configuration",
          meta: {
            path: "/resources/theme-configuration",
            title: "Theme & Layout Configuration — Fachada",
            description:
              "How to configure visual themes, color palettes, and layout variants in a Fachada app.",
          },
          template: "markdown",
          templateData: {
            contentId: "fachada-theme-guide",
            downloadFilename: "fachada-theme-guide.md",
            backLink: {
              href: "/resources/app-builder-guide",
              label: "App Builder Guide",
            },
          },
          sections: [],
        },
      ],
    },
  } satisfies SiteTreeConfig,
  page: {
    sections: profileConfig.sections.map((s) => ({ ...s, widgets: [] })),
  },
};
