# Fachada Portfolio — Action Plan

**Project**: Personal portfolio website (Astro 5, TypeScript, Tailwind CSS v4)  
**Goal**: Development and Testing  
**Status**: Active

---

## Phase 1: Setup & Infrastructure

| Task                                 | Status        | Owner | Notes                                    |
| ------------------------------------ | ------------- | ----- | ---------------------------------------- |
| Verify project structure & tooling   | `not-started` | Dev   | `make help`, `npm list`, Firebase config |
| Review Astro config & Tailwind setup | `not-started` | Dev   | `astro.config.mjs`, `tailwind.config.ts` |
| Confirm Firebase project & auth      | `not-started` | Dev   | `.firebaserc`, `firebase.json`           |
| Set up GitHub Actions CI/CD          | `not-started` | Dev   | Preview channels, live deploy pipeline   |

---

## Phase 2: Core Implementation

| Task                                        | Status        | Owner | Notes                                      |
| ------------------------------------------- | ------------- | ----- | ------------------------------------------ |
| Implement BaseLayout.astro                  | `not-started` | Dev   | Head, meta tags, OG image, JSON-LD support |
| Build page components (Hero, About, Skills) | `not-started` | Dev   | Use `.astro` format, Tailwind styling      |
| Set up Content Collections schema           | `not-started` | Dev   | Projects + Blog in `src/content/config.ts` |
| Create project case study template          | `not-started` | Dev   | Dynamic route `[slug].astro`               |
| Create blog post template                   | `not-started` | Dev   | Dynamic route `[slug].astro`               |
| Implement contact form island               | `not-started` | Dev   | React component, form validation           |
| Dark/light mode toggle island               | `not-started` | Dev   | React component, theme persistence         |

---

## Phase 3: Content & SEO

| Task                                 | Status        | Owner   | Notes                                   |
| ------------------------------------ | ------------- | ------- | --------------------------------------- |
| Write 3–5 seed projects              | `not-started` | Content | MDX in `src/content/projects/`          |
| Write 2–3 seed blog posts            | `not-started` | Content | MDX in `src/content/blog/`              |
| Add JSON-LD StructuredData component | `not-started` | Dev     | Person, Article, BreadcrumbList schemas |
| Set up sitemap & robots.txt          | `not-started` | Dev     | Auto-generated, Firebase rewrites       |
| Verify Open Graph image              | `not-started` | QA      | ogimage.png 1200×630px, render test     |

---

## Phase 4: Testing

| Task                                   | Status        | Owner | Notes                                |
| -------------------------------------- | ------------- | ----- | ------------------------------------ |
| Unit tests: utilities & helpers        | `not-started` | QA    | Jest, > 80% coverage                 |
| Integration tests: Content Collections | `not-started` | QA    | Schema validation, MDX parsing       |
| E2E tests: critical user journeys      | `not-started` | QA    | Contact form, navigation, dark mode  |
| Lighthouse audit                       | `not-started` | QA    | Performance, SEO, Accessibility ≥ 95 |
| Core Web Vitals check                  | `not-started` | QA    | LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms   |
| Schema markup validation               | `not-started` | QA    | Google Rich Results Test             |

---

## Phase 5: Pre-Launch

| Task                                           | Status        | Owner | Notes                                   |
| ---------------------------------------------- | ------------- | ----- | --------------------------------------- |
| Test all links & form submissions              | `not-started` | QA    | No broken hrefs, form delivers to email |
| Test responsive design (mobile/tablet/desktop) | `not-started` | QA    | Breakpoints: 640px, 1024px, 1280px      |
| Verify 404 page & Firebase rewrites            | `not-started` | QA    | Fire rewrites to `/404.html`            |
| Set custom domain in Firebase                  | `not-started` | Infra | HTTPS active, www redirect handled      |
| Submit sitemap to Google Search Console        | `not-started` | Infra | Verify ownership, monitor indexing      |
| Set up analytics (Plausible)                   | `not-started` | Infra | Tracking code, test event logging       |
| QA sign-off                                    | `pending`     | QA    | All tests pass, no critical findings    |

---

## Phase 6: Launch & Deploy

| Task                                 | Status        | Owner     | Notes                                      |
| ------------------------------------ | ------------- | --------- | ------------------------------------------ |
| Final build & staging test           | `not-started` | Dev       | `astro build`, preview on Firebase staging |
| Deploy to Firebase live              | `not-started` | Infra     | `firebase deploy`, monitor CI/CD           |
| Monitor Core Web Vitals & Lighthouse | `not-started` | Infra     | PageSpeed Insights on live URL             |
| Launch announcement                  | `not-started` | Marketing | Twitter, LinkedIn, email                   |

---

## Dependencies & Checkpoints

```
Phase 1 (Setup) → Phase 2 (Implementation) → Phase 3 (Content & SEO)
                                               ↓
Phase 4 (Testing) → Phase 5 (Pre-Launch) → Phase 6 (Launch)
```

**Checkpoint 1**: Phase 1 complete → tooling verified, no blockers  
**Checkpoint 2**: Phase 2 complete → all core components built, E2E testable  
**Checkpoint 3**: Phase 4 complete → coverage ≥ 80%, Lighthouse ≥ 95  
**Checkpoint 4**: Phase 5 complete → QA sign-off, zero critical findings  
**Checkpoint 5**: Phase 6 complete → live, monitoring active

---

## Key Deliverables

- ✅ Astro project fully built, zero TypeScript errors
- ✅ Jest test suite with > 80% coverage
- ✅ Passing E2E tests for user journeys
- ✅ Lighthouse score ≥ 95 + passing Core Web Vitals
- ✅ Firebase deployed, custom domain, HTTPS active
- ✅ Sitemap indexed, schema markup validated
- ✅ 5+ projects + 3+ blog posts published

---

## References

- [Portfolio Synthesis](./portfolio_synthesis.md)
- [Astro Docs](https://docs.astro.build)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
