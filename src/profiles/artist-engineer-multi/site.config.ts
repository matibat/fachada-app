/**
 * Artist-engineer multi-role site configuration.
 * Demonstrates a multi-role portfolio where someone is both
 * a software engineer and a digital artist.
 */

import type { SiteConfig } from "../../types/profile.types";

export const siteConfig: SiteConfig = {
  name: "Matías Batista",
  title: "Matías Batista — Engineer & Digital Artist",
  description:
    "Full-stack engineer and digital artist. I build scalable web applications and create immersive 3D experiences at the intersection of code and art.",
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
      specialties: ["TypeScript", "React", "WebGL", "Three.js", "Node.js"],
      featured: true,
      description:
        "Building performant web applications and real-time 3D experiences.",
      about: {
        paragraphs: [
          "On the engineering side, I specialize in real-time web graphics with Three.js and WebGL — building the full-stack systems that bring complex visualizations to life in the browser.",
          "I approach software as a craft: readable code, tight feedback loops, and systems that hold up at scale. TypeScript, React, and Node.js are my daily tools; WebAssembly and GLSL are the ones that get me out of bed.",
          "I've shipped production systems for creative studios and startups, usually at the intersection of performance and visual fidelity — where the compiler and the renderer have to agree.",
        ],
      },
      skills: [
        {
          name: "Languages & Runtimes",
          skills: [
            "TypeScript",
            "JavaScript",
            "Node.js",
            "GLSL",
            "WebAssembly",
          ],
        },
        {
          name: "Frontend & 3D",
          skills: ["React", "Three.js", "WebGL", "Astro", "Tailwind CSS"],
        },
        {
          name: "Backend & Infra",
          skills: [
            "PostgreSQL",
            "Redis",
            "Docker",
            "Vercel",
            "Cloudflare Workers",
          ],
        },
      ],
    },
    {
      id: "artist",
      title: "Digital Artist",
      specialties: [
        "3D Modeling",
        "Animation",
        "Generative Art",
        "Creative Coding",
      ],
      featured: true,
      description:
        "Creating immersive 3D worlds and generative experiences at the edge of code and art.",
      about: {
        paragraphs: [
          "My art practice lives in the space between algorithm and intuition — I write code the way a painter mixes colours, iterating until something unexpected appears that I couldn't have planned.",
          "I create generative sculptures, animated installations, and interactive pieces using Blender, Cinema 4D, and custom GLSL shaders. The output might be a looping video, a real-time web experience, or a physical print from a parametric model.",
          "I'm drawn to impermanence: pieces that look different every time they run, systems that evolve over hours, outputs that can never be exactly reproduced. Technology as a collaborator, not just a tool.",
        ],
      },
      skills: [
        {
          name: "3D & Motion",
          skills: [
            "Blender",
            "Cinema 4D",
            "Houdini",
            "After Effects",
            "DaVinci Resolve",
          ],
        },
        {
          name: "Creative Code",
          skills: ["GLSL", "p5.js", "TouchDesigner", "Processing", "Hydra"],
        },
        {
          name: "Output & Print",
          skills: [
            "Substance Painter",
            "Octane Render",
            "Figma",
            "Photoshop",
            "Lightroom",
          ],
        },
      ],
    },
  ],
  primaryRole: "engineer",
  analytics: {
    plausibleDomain: "sorakenji.dev",
  },
};
