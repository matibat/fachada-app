/**
 * Engineer single-role profile configuration.
 * Theme switcher is DISABLED — locked to modern-tech dark.
 * Mode toggle is enabled so users can switch dark/light.
 */

import type { ProfileConfig } from "../../types/profile.types";

export const profileConfig: ProfileConfig = {
  theme: {
    style: "modern-tech",
    defaultMode: "dark",
    enableStyleSwitcher: false,
    enableModeToggle: true,
  },
  about: {
    paragraphs: [
      "Backend engineer specializing in distributed systems and cloud infrastructure. I build the invisible systems that make everything fast, reliable, and scalable.",
      "Passionate about systems design, observability, and performance optimization. I work primarily with Go and Rust, deploying on Kubernetes across multi-cloud environments.",
      "Outside of work, I contribute to open source infrastructure tooling and write about distributed systems patterns on my blog.",
    ],
  },
  skills: [
    {
      name: "Backend",
      skills: ["Go", "Rust", "Node.js", "gRPC", "REST APIs"],
    },
    {
      name: "Infrastructure",
      skills: ["Kubernetes", "Docker", "Terraform", "AWS", "GCP"],
    },
    {
      name: "Databases",
      skills: [
        "PostgreSQL",
        "Redis",
        "CockroachDB",
        "Elasticsearch",
        "Cassandra",
      ],
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
    "Open to backend engineering roles and interesting distributed systems problems.",
};
