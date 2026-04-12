---
title: "Why I Chose Astro for My Portfolio"
description: "An exploration of why Astro's island architecture makes it perfect for content-driven sites that prioritize performance and SEO."
date: 2026-03-20
tags: ["Astro", "Web Development", "Performance"]
---

## The Search for the Perfect Framework

After building portfolios and marketing sites with Next.js, Gatsby, and vanilla HTML, I kept encountering the same problem: **shipping too much JavaScript**.

## The JavaScript Problem

Modern frameworks are amazing for building applications, but they come with overhead:

- Next.js ships the entire React runtime for pages that are mostly static
- Even simple interactive elements require hydration
- Time to Interactive suffers even when First Contentful Paint is fast

## Enter Astro

Astro's island architecture solves this elegantly:

```astro
---
import HeavyInteractiveComponent from './HeavyComponent.jsx';
---

<div>
  <!-- Static HTML, zero JS -->
  <header>...</header>

  <!-- Interactive island, JS only here -->
  <HeavyInteractiveComponent client:visible />

  <!-- Back to static -->
  <footer>...</footer>
</div>
```

## Real-World Results

My portfolio achieves:

- 100/100 Lighthouse scores
- 1.2s Time to Interactive
- < 50KB total JavaScript (only for theme toggle and contact form)

## When NOT to Use Astro

Astro isn't right for everything. If your site is highly interactive throughout (dashboards, social media, etc.), a full framework like Next.js or SvelteKit makes more sense.

But for portfolios, blogs, marketing sites, and documentation? Astro is unbeatable.

## Conclusion

The best framework is the one that matches your use case. For mostly-static, content-driven sites that need occasional interactivity, Astro's island architecture is the perfect fit.
