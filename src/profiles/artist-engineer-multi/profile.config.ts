/**
 * Artist-engineer multi-role profile configuration.
 *
 * Base theme: minimalist dark — unexpected for a creative profile, intentionally so.
 * The restraint is the statement: the content does the work, not the decoration.
 *
 * Two-theme concept:
 *   Minimalist (dark) → the artist's deliberate silence: off-white on near-black,
 *     generous whitespace, serif typography. Organic, honest, timeless.
 *   Modern Tech → the engineer's precision: gradient headings, grid background,
 *     glow accents. Structured, digital, sharp.
 *
 * Style switcher is on. The role explorer guides you to try each theme with its role.
 */

import type { ProfileConfig } from "../../types/profile.types";

export const profileConfig: ProfileConfig = {
  theme: {
    style: "professional",
    defaultMode: "dark",
    enableStyleSwitcher: true,
    enableModeToggle: true,
  },
  about: {
    paragraphs: [
      "I am a software engineer and digital artist. I write systems that handle a hundred thousand requests and pieces that take three minutes to look at. The two practices are not as different as they sound.",
      "During the day I build real-time web graphics and the distributed systems behind them: TypeScript, WebGL, Node.js, PostgreSQL, deployed at scale. After hours I make generative 3D sculptures, colour field prints, and interactive installations — sometimes using the same GLSL code.",
      "Use the role switcher to go deeper into either world. Try the theme switcher in the corner: three modern variants — Minimal (clean, cool), Warm (personal, human), Bold (professional, strong). Each one is the same person and work, seen through a different lens.",
    ],
  },
  skills: [
    {
      name: "Engineering",
      skills: ["TypeScript", "React", "WebGL", "Three.js", "Node.js"],
    },
    {
      name: "Art & Creative Code",
      skills: ["Blender", "Cinema 4D", "GLSL", "p5.js", "Generative Systems"],
    },
    {
      name: "Shared Craft",
      skills: ["Git", "Figma", "TouchDesigner", "Substance Painter", "Houdini"],
    },
  ],
  sections: [
    { id: "hero", enabled: true, order: 1 },
    { id: "role-explorer", enabled: true, order: 2 },
    { id: "projects", enabled: true, order: 3, requiresContent: "projects" },
    { id: "contact", enabled: true, order: 4 },
  ],
  contactMessage:
    "Available for engineering contracts, creative technology collaborations, and commissioned art. Let us make something together.",
  multiRoleDisplay: {
    style: "storytelling",
  },
};
