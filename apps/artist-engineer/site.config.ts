/**
 * Artist-engineer multi-role site configuration.
 * A single person existing across two disciplines:
 * code as infrastructure and code as medium.
 */

import type { SiteConfig } from "@fachada/core/types/profile.types";

export const siteConfig: SiteConfig = {
  name: "Matías Batista",
  title: "Matías Batista — Engineer & Artist",
  description:
    "Software engineer and digital artist. I build systems that scale and pieces that stop you. The separation between the two is thinner than you think.",
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
      title: "Software Engineer",
      specialties: ["TypeScript", "WebGL", "React", "Node.js", "GLSL"],
      featured: true,
      description:
        "Real-time systems, web graphics, and the infrastructure that makes both fast and honest.",
      about: {
        paragraphs: [
          "Engineering, to me, is the discipline of constraint. Every millisecond budget, every memory limit, every API contract is a creative boundary — and working inside it precisely is its own art form.",
          "I build real-time 3D systems in WebGL and Three.js, architect the Node.js and PostgreSQL backends that feed them, and write the TypeScript that holds it together. I care about readable code, tight feedback loops, and systems that explain themselves at a glance.",
          "The work I am proudest of lives at the edge of what the browser can do: procedural geometry, custom GLSL shaders, sub-16ms render budgets reached not by luck but by method. Switch the theme to Modern Tech to see the engineering aesthetic.",
        ],
      },
      skills: [
        {
          name: "Languages",
          skills: ["TypeScript", "JavaScript", "GLSL", "WebAssembly", "SQL"],
        },
        {
          name: "Rendering & Frontend",
          skills: ["WebGL", "Three.js", "React", "Astro", "Tailwind CSS"],
        },
        {
          name: "Backend & Data",
          skills: ["Node.js", "PostgreSQL", "Redis", "Docker", "Vercel"],
        },
      ],
    },
    {
      id: "artist",
      title: "Digital Artist",
      specialties: [
        "Generative Art",
        "3D Sculpture",
        "Creative Code",
        "Large-Format Print",
      ],
      featured: true,
      description:
        "Generative systems, 3D sculpture, and code that arrives somewhere it was never told to go.",
      about: {
        paragraphs: [
          "My art practice starts where the algorithm runs out of intention. I write code the way a sculptor works clay — iterating past what I planned until something unexpected arrives that is better than anything I designed.",
          "The output varies: large-format archival prints from generative colour fields, real-time WebGL installations seeded by live data, animated 3D sculptures rendered in Blender and Houdini. The medium is always code; the result always something that cannot be replicated exactly.",
          "I am drawn to impermanence and emergence: pieces that mutate under time or input, outputs that document a conversation between intention and entropy. Stay in the Minimalist theme here — the silence is intentional.",
        ],
      },
      skills: [
        {
          name: "3D & Motion",
          skills: [
            "Blender",
            "Houdini",
            "Cinema 4D",
            "After Effects",
            "DaVinci Resolve",
          ],
        },
        {
          name: "Creative Code",
          skills: ["GLSL", "p5.js", "TouchDesigner", "Processing", "Hydra"],
        },
        {
          name: "Output",
          skills: [
            "Archival Print",
            "WebGL Installation",
            "Generative Video",
            "Substance Painter",
          ],
        },
      ],
    },
  ],
  primaryRole: "engineer",
  analytics: {
    plausibleDomain: "matiasbatista.dev",
  },
};
