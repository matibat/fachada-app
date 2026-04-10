/**
 * Default Fachada profile configuration — theme, content, and section settings.
 */

import type { ProfileConfig } from "../../types/profile.types";

export const profileConfig: ProfileConfig = {
  theme: {
    style: "minimalist",
    defaultMode: "system",
    enableStyleSwitcher: true,
    enableModeToggle: true,
  },
  about: {
    paragraphs: [
      "I'm a software engineer based in Montevideo, Uruguay, passionate about building elegant web experiences with modern technologies.",
      "I specialize in TypeScript, React, and modern web frameworks like Astro, creating performant, accessible, and user-friendly applications.",
      "When I'm not coding, you can find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.",
    ],
  },
  skills: [
    {
      name: "Languages",
      skills: ["TypeScript", "JavaScript", "Python", "HTML", "CSS"],
    },
    {
      name: "Frameworks & Libraries",
      skills: ["Astro", "React", "Next.js", "Tailwind CSS", "Node.js"],
    },
    {
      name: "Tools & Platforms",
      skills: ["Git", "Firebase", "Vercel", "Docker", "GitHub Actions"],
    },
  ],
  sections: [
    { id: "hero", enabled: true, order: 1 },
    { id: "about", enabled: true, order: 2 },
    { id: "skills", enabled: true, order: 3 },
    {
      id: "projects",
      enabled: true,
      order: 4,
      requiresContent: "projects",
    },
    { id: "contact", enabled: true, order: 5 },
  ],
  contactMessage:
    "I'm always interested in hearing about new projects and opportunities.",
};
