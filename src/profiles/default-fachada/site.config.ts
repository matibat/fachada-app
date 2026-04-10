/**
 * Default Fachada site configuration.
 * This is the default portfolio profile for Fachada.
 */

import type { SiteConfig } from "../../types/profile.types";

export const siteConfig: SiteConfig = {
  name: "Fachada",
  title: "Fachada — Software Engineer",
  description:
    "Software engineer based in Montevideo, Uruguay. Building elegant web experiences with modern technologies.",
  author: "Fachada",
  url: "https://fachada.dev",
  ogImage: "/og-image.png",
  social: {
    github: "https://github.com/fachada",
    linkedin: "https://linkedin.com/in/fachada",
    twitter: "https://twitter.com/fachada",
    email: "hello@fachada.dev",
  },
  location: {
    city: "Montevideo",
    country: "Uruguay",
  },
  roles: [
    {
      id: "engineer",
      title: "Software Engineer",
      specialties: ["Web Development", "TypeScript", "Astro", "React"],
      featured: true,
      description:
        "Full-stack engineer focused on building elegant web experiences",
    },
  ],
  primaryRole: "engineer",
  analytics: {
    plausibleDomain: "fachada.dev",
  },
};
