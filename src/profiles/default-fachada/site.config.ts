/**
 * Fachada project site configuration.
 * The default-fachada app IS Fachada itself — a self-describing portfolio framework.
 * This page demonstrates what Fachada can do by literally being the thing it builds.
 */

import type { SiteConfig } from "../../types/profile.types";

export const siteConfig: SiteConfig = {
  name: "Fachada",
  title: "Fachada — Build your portfolio, your way",
  description:
    "An open-source portfolio framework built with Astro. Config-driven, multi-theme, multi-role. Everything on this page came from a single config file.",
  author: "Fachada",
  url: "https://fachada.dev",
  ogImage: "/og-image.png",
  social: {
    github: "https://github.com/fachada/fachada",
    linkedin: "https://linkedin.com/company/fachada-dev",
    twitter: "https://twitter.com/fachada_dev",
    email: "hello@fachada.dev",
  },
  location: {
    city: "Open Source",
    country: "Internet",
  },
  roles: [
    {
      id: "framework",
      title: "Portfolio Framework",
      specialties: [
        "Astro",
        "TypeScript",
        "Config-Driven",
        "Multi-Theme",
        "Open Source",
      ],
      featured: true,
      description:
        "A portfolio framework that renders itself — every pixel on this page was composed from a config file.",
    },
  ],
  primaryRole: "framework",
  analytics: {
    plausibleDomain: "fachada.dev",
  },
};
