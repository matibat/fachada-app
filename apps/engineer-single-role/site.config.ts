/**
 * Engineer single-role site configuration.
 * Demonstrates a clean single-role portfolio for a backend engineer.
 * Theme switching is disabled — the modern-tech theme is locked.
 */

import type { SiteConfig } from "@fachada/core";

export const siteConfig: SiteConfig = {
  name: "Matías Batista",
  title: "Matías Batista — Backend Engineer",
  description:
    "Backend engineer specializing in distributed systems and cloud infrastructure. Building the invisible systems that make everything work.",
  author: "Matías Batista",
  url: "https://matiasbatista.dev",
  ogImage: "/og-image.png",
  social: {
    github: "https://github.com/matiasbatista",
    linkedin: "https://linkedin.com/in/matiasbatista",
    twitter: "https://twitter.com/matiasbatista",
    email: "matias@matiasbatista.dev",
  },
  location: {
    city: "Montevideo",
    country: "Uruguay",
  },
  roles: [
    {
      id: "engineer",
      title: "Backend Engineer",
      specialties: [
        "Distributed Systems",
        "Go",
        "Rust",
        "Kubernetes",
        "PostgreSQL",
      ],
      featured: true,
      description:
        "Building robust, scalable backend systems with a focus on reliability and performance",
    },
  ],
  primaryRole: "engineer",
  analytics: {
    plausibleDomain: "alexrivera.dev",
  },
};
