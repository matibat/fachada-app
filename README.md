# Fachada Portfolio Template

A modern, SEO-optimized portfolio template built with Astro 6, React, and Tailwind CSS. Features **4 visual themes**, dark mode, comprehensive testing, and automated deployment.

## ✨ Features

- 🚀 **Astro 6** - Lightning-fast static site generation with island architecture
- ⚛️ **React Islands** - Interactive components where needed (ThemeToggle, ThemeSwitcher)
- 🎨 **4 Theme Styles** - Minimalista, Modern Tech, Profesional, Vaporwave
- 🌈 **Tailwind CSS v3** - Utility-first styling with CSS custom properties
- 🌙 **Light/Dark Mode** - Toggle with localStorage persistence, system preference support
- 🎯 **Configurable Themes** - Lock themes or let users choose via widget
- 🧪 **Vitest + Testing Library** - Comprehensive test coverage (15+ tests)
- 📊 **SEO Optimized** - Meta tags, OG images, JSON-LD structured data, sitemap, robots.txt
- 📝 **Content Collections** - Type-safe blog posts and projects with Astro v6 glob loaders
- 🔄 **CI/CD** - GitHub Actions for automated testing and GitHub Pages deployment
- ⚙️ **Configuration-Driven** - Rebrand from a single config file
- 🏗️ **Makefile Automation** - Common tasks automated (dev, build, test, deploy)

## 🎨 Theme System

Choose from 4 carefully designed visual styles:

- **Minimalista** - Clean, professional, timeless elegance
- **Modern Tech** - Futuristic with glow effects and gradients
- **Profesional** - Corporate modern with structured layout
- **Vaporwave** - Retro-futuristic 80s/90s aesthetic

Each theme supports both light and dark modes. See [docs/THEME-CONFIGURATION.md](docs/THEME-CONFIGURATION.md) for full details.

### Quick Theme Setup

Edit your app's `profile.config.ts` (located in `apps/default-fachada/`):

```typescript
export const profileConfig = {
  theme: {
    style: "minimalista", // Your chosen theme
    defaultMode: "system", // 'light' | 'dark' | 'system'
    enableStyleSwitcher: true, // Let users switch themes
    enableModeToggle: true, // Show light/dark toggle
  },
};
```

## 🚀 Quick Start

```bash
# Install dependencies
make install
# or: yarn install

# Start development server
make dev
# or: yarn dev

# Run tests
make test
# or: yarn test

# Build for production
make build
# or: yarn build
```

Visit `http://localhost:4321` to see your site.

## 📁 Project Structure

```text
/
├── astro.config.mjs              # Astro config — uses fachadaIntegration()
├── package.json
├── apps/
│   └── default-fachada/          # Demo portfolio
│       ├── app.config.ts         # AppConfig — seo + siteTree
│       ├── site.config.ts        # SiteConfig — SEO metadata
│       ├── profile.config.ts     # ProfileConfig — theme, about, skills
│       ├── blog/                 # Markdown blog posts
│       └── pages/                # Markdown landing page content
├── public/                       # Static assets (favicons, og-image, images/)
├── tests/                        # Vitest unit tests (526 passing)
└── docs/                         # Documentation
```

> All Astro routes, layouts, components, and widgets are provided by `@fachada/core`.

## ⚙️ Configuration

### Rebrand the Template

Edit `apps/your-app-name/app.config.ts` to customize your portfolio:

```typescript
import type { AppConfig } from "@fachada/core";

export const appConfig: AppConfig = {
  seo: {
    site: "https://your-domain.dev",
    name: "Your Name",
    author: "Your Name",
    description: "Your professional tagline or description",
    socials: {
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      email: "your@email.dev",
    },
    roles: [
      {
        id: "engineer",
        title: "Software Engineer",
        specialties: ["TypeScript", "React"],
        featured: true,
      },
    ],
  },
  siteTree: {
    landing: {
      sections: [
        { id: "hero", enabled: true, order: 1 },
        { id: "about", enabled: true, order: 2 },
        { id: "skills", enabled: true, order: 3 },
        { id: "projects", enabled: true, order: 4 },
        { id: "contact", enabled: true, order: 5 },
      ],
    },
  },
};
```

## 📋 Customization

Edit the default app configuration in `apps/default-fachada/` to customize your portfolio:

### App Configuration

1. **`apps/default-fachada/app.config.ts`** — Define SEO metadata and roles:

   ```typescript
   import type { AppConfig } from "@fachada/core";

   export const appConfig: AppConfig = {
     seo: {
       site: "https://your-domain.dev",
       name: "Your Name",
       author: "Your Name",
       description: "Your professional description",
       socials: {
         github: "https://github.com/yourusername",
         linkedin: "https://linkedin.com/in/yourusername",
         email: "your@email.dev",
       },
       roles: [
         {
           id: "engineer",
           title: "Software Engineer",
           specialties: ["TypeScript", "React"],
           featured: true,
         },
       ],
     },
     siteTree: {
       landing: {
         sections: [
           { id: "hero", enabled: true, order: 1 },
           { id: "about", enabled: true, order: 2 },
           { id: "skills", enabled: true, order: 3 },
           { id: "projects", enabled: true, order: 4 },
           { id: "contact", enabled: true, order: 5 },
         ],
       },
     },
   };
   ```

2. **`apps/default-fachada/profile.config.ts`** — Theme and content settings:

   ```typescript
   import type { ProfileConfig } from "@fachada/core";

   export const profileConfig: ProfileConfig = {
     about: "Your professional bio.",
     skills: [{ name: "Category 1", skills: ["Tech A", "Tech B", "Tech C"] }],
     sections: [
       { id: "hero", enabled: true, order: 1 },
       { id: "about", enabled: true, order: 2 },
       { id: "skills", enabled: true, order: 3 },
       { id: "projects", enabled: true, order: 4 },
       { id: "contact", enabled: true, order: 5 },
     ],
     contactMessage: "I'd love to hear about your project.",
     theme: {
       style: "minimalista",
       defaultMode: "system",
     },
   };
   ```

### Add Content

**Pages** — Create `.md` files in `apps/default-fachada/pages/`:

```markdown
---
title: "Project Name"
description: "Short description"
date: 2026-04-13
tags: ["React", "TypeScript", "Tailwind"]
---

Your page content here...
```

**Blog Posts** — Create `.md` files in `apps/default-fachada/blog/`:

```markdown
---
title: "Blog Post Title"
description: "Post excerpt"
date: 2026-04-13
tags: ["Development", "Tutorial"]
---

Your blog post content here...
```

## 🧞 Commands

Use Make commands for common tasks:

```bash
make help              # Show all available commands
make dev               # Start dev server
make build             # Build for production
make test              # Run tests once
make test-watch        # Run tests in watch mode
make test-ui           # Open Vitest UI
make preview           # Preview production build
make clean             # Remove build artifacts
```

Or use yarn directly:

```bash
yarn dev          # Development server
yarn build        # Production build
yarn test         # Run tests
yarn preview      # Preview build
```

### Deployment

The static build (`dist/`) is automatically deployed to **GitHub Pages** on every push to `main` via GitHub Actions.

**Access your site at**: `https://<username>.github.io/<repo>`

To deploy to other platforms, you can also manually deploy the `dist/` directory to:

- **Vercel**: Connect GitHub repo, set build command to `yarn build`
- **Netlify**: Connect GitHub repo, set publish directory to `dist`
- **Cloudflare Pages**: Connect GitHub repo, build command `yarn build`

## 🧪 Testing

Tests are located in `tests/` and run with Vitest:

```bash
# Run tests once
make test

# Watch mode
make test-watch

# UI mode
make test-ui

# Coverage report
yarn test --coverage
```

**Current Coverage:**

- 15 tests across 3 files
- Config validation (6 tests)
- Component tests (3 tests)
- Utility tests (6 tests)

## 🎨 Styling

### Tailwind CSS

Customize in `tailwind.config.mjs`:

```javascript
theme: {
  extend: {
    colors: {
      // Add your brand colors
    },
  },
}
```

### Dark Mode

The site includes a dark mode toggle with:

- System preference detection
- localStorage persistence
- FOUC (Flash of Unstyled Content) prevention
- Smooth transitions

## 📈 SEO Features

- ✅ Meta tags (title, description, OG, Twitter Card)
- ✅ Canonical URLs
- ✅ JSON-LD structured data (Person, Article schemas)
- ✅ Automatic sitemap generation
- ✅ robots.txt
- ✅ Semantic HTML
- ✅ Image optimization ready

## 🔧 Development

### Prerequisites

- Node.js 22+ (or 18+)
- Yarn 4+ (uses Plug'n'Play)

### Environment Setup

```bash
# Clone repository
git clone <your-repo>
cd fachada

# Install dependencies
yarn install

# Start development
yarn dev
```

### Adding Dependencies

```bash
yarn add <package>
yarn add -D <dev-package>
```

## 📝 License

MIT License - feel free to use this template for your portfolio!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `make test`
5. Build: `make build`
6. Submit a pull request

## 💡 Tips

- **Images**: Place in `public/` for static assets or use Astro's Image component for optimization
- **Fonts**: Load via CDN in `BaseLayout.astro` or use `@fontsource` packages
- **Analytics**: Configure in `apps/default-fachada/app.config.ts`
- **Performance**: Run Lighthouse audits (`yarn preview` then test in Chrome DevTools)

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)
