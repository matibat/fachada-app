---
title: "Fachada Theme System"
description: "A CSS custom property–based theme engine with four distinct visual languages, runtime switching, and zero flash-of-unstyled-content. Token override maps ready for brand extension."
stack: ["CSS Custom Properties", "TypeScript", "Styled Components", "React"]
date: 2026-03-15
featured: true
roles: ["framework"]
liveUrl: "https://fachada.dev"
githubUrl: "https://github.com/fachada/fachada"
coverImage: "/images/project-fachada-themes.svg"
---

## Overview

The Fachada theme system lets you switch between four complete visual identities at runtime — no page reload, no flash. It is the part of Fachada visitors notice immediately, and it is built to be both extensible and invisible.

## Four Visual Languages

**Minimalist** — editorial and honest: Playfair Display serifs, ink-on-paper contrast, whitespace as content. Every decoration is either load-bearing or gone.

**Modern Tech** — bold and digital: gradient headings clipped to text, glowing accent borders, 48px grid background on the hero. The aesthetic of precision work made visible.

**Professional** — structured and credible: numbered section headings via `data-index`, elevated cards with accent hover borders, Space Grotesk at confident weight.

**Vaporwave** — retro and maximalist: neon text-shadow glows, gradient card borders, Exo 2 at maximum weight. The loudest option, for those who want to be heard first.

## Under the Hood

Themes are pure TypeScript objects: `Record<ThemeStyle, { light: ThemeTokens; dark: ThemeTokens }>`. At startup a small inline script reads the saved preference from `localStorage` and synchronously writes all CSS custom properties to `<html>` before the first paint — eliminating FOUC entirely.

Styled-components server-renders using the same token values, producing identical class names on server and client and eliminating the hydration mismatch that plagues most SSR theme systems.

## Token Override System

App configs can supply named `themeVariants` — partial token overlay maps keyed by a variant identifier. The `ThemeResolver` domain service merges the base theme tokens with the active variant's overrides, allowing brand-specific colour extensions without forking the theme definitions themselves.

## Try It

Hit the theme switcher widget in the bottom-right corner of this page. All four themes are live right now.
