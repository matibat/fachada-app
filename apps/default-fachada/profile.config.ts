/**
 * Fachada project profile configuration.
 * Minimalist is the honest choice: the framework speaks through its architecture, not decoration.
 * Style switcher is on — hit the corner widget to see what Fachada can look like in each theme.
 */

import type { ProfileConfig } from "@fachada/core";

export const profileConfig: ProfileConfig = {
  theme: {
    style: "minimalist",
    defaultMode: "system",
    enableStyleSwitcher: true,
    enableModeToggle: true,
  },
  about: {
    paragraphs: [
      "You are looking at Fachada. Not a demo — the thing itself. Every heading, colour, spacing rule, and section on this page emerged from a single TypeScript config file. The framework compiles your identity directly into the HTML.",
      "At build time, Fachada reads your site.config and profile.config, resolves them against the active theme tokens, and emits a static site with typed content schemas, SEO structures, and a real-time theme switcher. Hit the corner widget: you are swapping token sets at runtime — the page rerenders in your browser without reloading.",
      "The architecture is separation of concerns: config is pure data; themes are TypeScript objects mapping semantic names to token values; widgets pull from config and token stores and compose them into HTML. Fork the repo, edit one config file, and ship a portfolio that is authentically yours.",
    ],
  },
  skills: [
    {
      name: "Built With",
      skills: ["Astro 5", "TypeScript 5", "Tailwind CSS v4", "React Islands"],
    },
    {
      name: "Ships With",
      skills: [
        "4 Visual Themes",
        "Multi-Role Support",
        "Dark Mode",
        "SEO & Structured Data",
      ],
    },
    {
      name: "Deploy To",
      skills: ["Firebase Hosting", "Vercel", "Netlify", "Cloudflare Pages"],
    },
  ],
  sections: [
    { id: "hero", enabled: true, order: 1 },
    { id: "about", enabled: true, order: 2 },
    { id: "skills", enabled: true, order: 3 },
    { id: "projects", enabled: true, order: 4, requiresContent: "projects" },
    { id: "contact", enabled: true, order: 5 },
  ],
  contactMessage:
    "Want to use Fachada for your portfolio? Fork the repo and you are one config file away from shipping. Contributions and feedback are very welcome.",
};
