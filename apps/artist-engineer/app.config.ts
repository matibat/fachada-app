import { appConfig as base } from "../../app/app.config";
import { profileConfig } from "../../app/profile.config";
export { profileConfig } from "../../app/profile.config";

// Create an artist-engineer variant derived from the default app config.
export const appConfig = {
  ...base,
  siteTree: {
    ...base.siteTree,
    landing: {
      ...base.siteTree.landing,
      // Ensure the landing page declares the common sections expected by tests
      sections: base.page?.sections?.map((s) => ({ id: s.id })) ?? [],
      subsections: [
        {
          id: "engineering",
          meta: {
            path: "/engineering",
            title: "Engineering — Projects & Case Studies",
            description: "Engineering work and case studies",
            keywords: ["engineering", "software", "systems"],
            llmSummary:
              "Engineering projects showcasing scalable systems and TypeScript architecture.",
          },
          template: "projects",
          templateData: {},
          sections: [
            { id: "hero" },
            { id: "projects" },
            { id: "skills" },
            { id: "contact" },
          ],
        },
        {
          id: "art",
          meta: {
            path: "/art",
            title: "Art — Creative Works",
            description: "Artistic practice and creative portfolio",
            keywords: ["art", "digital", "illustration"],
            llmSummary:
              "Creative portfolio with digital art and generative pieces.",
          },
          template: "gallery",
          templateData: {},
          sections: [
            { id: "hero" },
            { id: "projects" },
            { id: "skills" },
            { id: "contact" },
          ],
        },
      ],
    },
  },
  // Ensure artist-engineer declares multiple roles (engineer + artist)
  seo: {
    ...base.seo,
    roles: [
      ...(base.seo?.roles ?? []),
      { id: "engineer", name: "Engineer" },
      { id: "artist", name: "Artist" },
    ],
    primaryRole: base.seo?.primaryRole ?? "engineer",
  },
  // Provide custom theme entries and required themeLayouts for tests
  themes: {
    ...base.themes,
    custom: {
      minimal: {},
      warm: {},
      bold: {},
    },
  },
  themeLayouts: {
    ...base.themeLayouts,
    minimal: { hero: "centered", skills: "grid-3", projects: "list" },
    warm: { hero: "split", skills: "list", projects: "card" },
    bold: { hero: "full-bleed", skills: "grid-2", projects: "masonry" },
  },
};
