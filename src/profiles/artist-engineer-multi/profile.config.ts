/**
 * Artist-engineer multi-role profile configuration.
 * Both style switcher and mode toggle are enabled.
 * Shows role switcher widget with tabs display.
 */

import type { ProfileConfig } from "../../types/profile.types";

export const profileConfig: ProfileConfig = {
  theme: {
    style: "vaporwave",
    defaultMode: "dark",
    enableStyleSwitcher: true,
    enableModeToggle: true,
  },
  about: {
    paragraphs: [
      "I'm a software engineer and digital artist exploring the intersection of code and creativity — building tools by day, making worlds by night.",
      "On the engineering side I specialize in real-time web graphics with Three.js and WebGL, and build the full-stack systems that power them. On the art side I create generative 3D sculptures, animations, and interactive installations.",
      "I believe technology is a canvas and code is a medium. Every project is a chance to make something that didn't exist before.",
    ],
  },
  skills: [
    {
      name: "Engineering",
      skills: ["TypeScript", "React", "WebGL", "Three.js", "Node.js"],
    },
    {
      name: "3D & Design",
      skills: [
        "Blender",
        "Cinema 4D",
        "3D Modeling",
        "Animation",
        "Generative Art",
      ],
    },
    {
      name: "Tools",
      skills: ["Git", "Figma", "Substance Painter", "TouchDesigner", "GLSL"],
    },
  ],
  sections: [
    { id: "hero", enabled: true, order: 1 },
    { id: "role-explorer", enabled: true, order: 2 },
    { id: "projects", enabled: true, order: 3, requiresContent: "projects" },
    { id: "contact", enabled: true, order: 4 },
  ],
  contactMessage:
    "Interested in creative tech collaborations, commissions, and engineering contracts.",
  multiRoleDisplay: {
    style: "storytelling",
  },
};
