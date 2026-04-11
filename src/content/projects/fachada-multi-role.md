---
title: "Fachada Multi-Role System"
description: "A first-class multi-role portfolio architecture — show your engineering career and creative practice on the same URL with a role explorer that transitions cleanly between both worlds."
stack: ["React", "TypeScript", "Astro", "CSS Custom Properties"]
date: 2026-02-20
featured: true
roles: ["framework"]
liveUrl: "https://fachada.dev"
githubUrl: "https://github.com/fachada/fachada"
coverImage: "/images/project-fachada-roles.svg"
---

## Overview

Most portfolio frameworks are built for one identity. Fachada is built for the reality that many people's best work spans more than one discipline. The multi-role system makes that duality a feature, not a workaround.

## The Problem It Solves

A software engineer who also does generative art faces a structural UX problem: showing both to the right audience without either looking like an afterthought. Separate sites mean split SEO and split maintenance. A single tab-based toggle buries half of who you are.

## Fachada's Approach

The `SiteConfig.roles` array defines each identity — its title, specialties, featured status, per-role bio, and per-role skill categories. The `RoleExplorer` component renders a card-based selector that transitions smoothly between role contexts: bio, skills, and filtered projects all update in place.

## Filtered Projects

Projects are tagged by role in their Markdown frontmatter: `roles: ["engineer"]`, `roles: ["artist"]`, or untagged for universal display. The `Projects` widget filters the content collection automatically against the active role context — you see only what is relevant for the role you are exploring.

## Configuration

```typescript
roles: [
  {
    id: "engineer",
    title: "Software Engineer",
    specialties: ["TypeScript", "WebGL", "React"],
    featured: true,
    about: { paragraphs: ["...", "...", "..."] },
    skills: [{ name: "Frontend", skills: ["React", "Astro"] }],
  },
  {
    id: "artist",
    title: "Digital Artist",
    specialties: ["Generative Art", "3D", "GLSL"],
    featured: true,
    about: { paragraphs: ["...", "...", "..."] },
    skills: [{ name: "Tools", skills: ["Blender", "p5.js"] }],
  },
];
```

That is the entire setup. The `RoleExplorer` renders from these types automatically.

## The artist-engineer demo

The `artist-engineer` app in this repo demonstrates the full multi-role capability with a genuine dual identity. Visit it to see what the system looks like when the content is as strong as the architecture.
