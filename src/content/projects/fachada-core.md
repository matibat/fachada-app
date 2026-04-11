---
title: "Fachada — Portfolio Framework"
description: "An open-source, config-driven portfolio framework built with Astro 5, TypeScript, and Tailwind CSS v4. Four themes, multi-role support, zero boilerplate."
stack: ["Astro 5", "TypeScript 5", "Tailwind CSS v4", "React", "Vite"]
date: 2026-04-01
featured: true
roles: ["framework"]
liveUrl: "https://fachada.dev"
githubUrl: "https://github.com/fachada/fachada"
coverImage: "/images/project-fachada-core.svg"
---

## Overview

Fachada is a portfolio framework that disappears so your work can speak. A single TypeScript config file wires up your identity, theme, sections, and social links — the rest is automatic.

## Design Philosophy

Most portfolio templates require you to edit dozens of files to change who you are. Fachada inverts that: the framework is the constant, your config is the variable. Fork it, open one file, and you are done.

## Architecture

Built on Astro 5's partial hydration model — zero JavaScript to the browser by default. React islands hydrate only the interactive parts (theme switcher, role explorer). The result is near-instant loads and 100/100 Lighthouse scores.

## What Ships Out of the Box

- **4 visual themes**: Minimalist, Modern Tech, Professional, Vaporwave — switchable at runtime with no page reload
- **Multi-role support**: Show your engineering career and your creative practice on the same URL, with a role explorer that transitions between them
- **Content Collections**: Type-safe Markdown for projects and blog posts, with automatic static path generation
- **Dark mode**: System-aware with manual override, transition-free token swap via CSS custom properties
- **SEO**: Structured data, Open Graph, canonical URLs, sitemap — all automatic from your config
- **Deploy targets**: Firebase Hosting, Vercel, Netlify, Cloudflare Pages — Makefile recipes included

## The Meta Moment

The page you are reading right now was built with Fachada. The theme switcher in the corner, the project cards, the about section — all of it rendered from a config. That is the whole demonstration.
