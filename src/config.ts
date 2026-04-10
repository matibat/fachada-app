// Site configuration - customize this file to rebrand the template
export const siteConfig = {
  // Basic Info
  name: "Fachada",
  title: "Fachada — Software Engineer",
  description:
    "Software engineer based in Montevideo, Uruguay. Building elegant web experiences with modern technologies.",
  author: "Fachada",

  // URLs
  url: "https://fachada.dev",
  ogImage: "/og-image.png",

  // Social Links
  social: {
    github: "https://github.com/fachada",
    linkedin: "https://linkedin.com/in/fachada",
    twitter: "https://twitter.com/fachada",
    email: "hello@fachada.dev",
  },

  // Location
  location: {
    city: "Montevideo",
    country: "Uruguay",
  },

  // Professional Info
  role: "Software Engineer",
  specialties: ["Web Development", "TypeScript", "Astro", "React"],

  // Analytics (Plausible)
  analytics: {
    plausibleDomain: "fachada.dev",
  },

  // Theme
  theme: {
    defaultMode: "light", // "light" | "dark" | "system"
    colors: {
      primary: "#3b82f6", // blue-500
      secondary: "#8b5cf6", // violet-500
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
