---
title: "Portfolio Template System"
description: "Astro-based portfolio template with Tailwind CSS v4, designed to be forked and customized for clients with minimal configuration."
stack: ["Astro", "TypeScript", "Tailwind CSS", "React"]
date: 2026-04-01
featured: true
coverImage: "/images/project-portfolio.svg"
---

## Overview

A reusable portfolio template system built with Astro 5 and Tailwind CSS v4, designed for both personal use and as a foundation for client projects.

## Problem

Creating custom portfolio sites for clients was time-consuming, with each project starting from scratch. Needed a flexible template that could be quickly customized while maintaining quality and best practices.

## Solution

Built a comprehensive portfolio template with:

- Configuration-driven design (single config file to rebrand)
- Content Collections for type-safe content management
- Zero JavaScript by default (Astro islands for interactivity)
- Built-in SEO optimization and performance
- Firebase deployment ready

## Technical Approach

The template uses Astro's partial hydration to ship minimal JavaScript, achieving 100 Lighthouse scores while maintaining rich interactivity where needed. Content is managed through MDX files with validated frontmatter schemas.

## Key Features

- One-file configuration for complete rebranding
- Automatic sitemap and robots.txt generation
- JSON-LD structured data implementation
- Dark mode support with system preference detection
- Responsive design with mobile-first approach

## Results

- 100/100 Lighthouse scores across all categories
- Sub-2s time to interactive
- Reduced client site setup time by 80%
- Successfully deployed for 3 client projects
