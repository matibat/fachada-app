# Fachada Portfolio Template

A modern, SEO-optimized portfolio template built with Astro 6, React, and Tailwind CSS. Features dark mode, comprehensive testing, and automated deployment.

## ✨ Features

- 🚀 **Astro 6** - Lightning-fast static site generation with island architecture
- ⚛️ **React Islands** - Interactive components where needed (ThemeToggle)
- 🎨 **Tailwind CSS v3** - Utility-first styling with dark mode support
- 🧪 **Vitest + Testing Library** - Comprehensive test coverage (15+ tests)
- 📊 **SEO Optimized** - Meta tags, OG images, JSON-LD structured data, sitemap, robots.txt
- 🌙 **Dark Mode** - Toggle with localStorage persistence
- 📝 **Content Collections** - Type-safe blog posts and projects with Astro v6 glob loaders
- 🔄 **CI/CD** - GitHub Actions for automated testing and Firebase deployment
- ⚙️ **Configuration-Driven** - Rebrand from a single config file
- 🏗️ **Makefile Automation** - Common tasks automated (dev, build, test, deploy)

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
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
├── public/                     # Static assets (images, favicons)
├── src/
│   ├── components/
│   │   ├── islands/
│   │   │   └── ThemeToggle.tsx # React island for dark mode
│   │   ├── sections/          # Homepage sections
│   │   │   ├── Hero.astro
│   │   │   ├── About.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Projects.astro
│   │   │   └── Contact.astro
│   │   └── ui/                # Reusable UI components
│   │       ├── Button.astro
│   │       ├── Badge.astro
│   │       └── Card.astro
│   ├── content/
│   │   ├── projects/          # Project case studies (.md)
│   │   └── blog/              # Blog posts (.md)
│   ├── layouts/
│   │   └── BaseLayout.astro   # Root layout with SEO
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── projects/
│   │   │   ├── index.astro    # Projects listing
│   │   │   └── [slug].astro   # Dynamic project pages
│   │   ├── blog/
│   │   │   ├── index.astro    # Blog listing
│   │   │   └── [slug].astro   # Dynamic blog posts
│   │   ├── 404.astro          # Custom 404 page
│   │   └── robots.txt.ts      # Dynamic robots.txt
│   ├── utils/
│   │   └── date.ts            # Date formatting utilities
│   ├── config.ts              # **Site configuration**
│   └── content.config.ts      # Content collections schema
├── tests/                      # Vitest tests
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind CSS configuration
├── vitest.config.ts           # Test configuration
├── firebase.json              # Firebase Hosting config
├── Makefile                   # Development automation
└── package.json
```

## ⚙️ Configuration

### Rebrand the Template

Edit `src/config.ts` to customize your portfolio:

```typescript
export const siteConfig = {
  name: "Your Name",
  title: "Your Name | Portfolio",
  description: "Your tagline or description",
  url: "https://yoursite.com",
  ogImage: "/og-image.png",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://x.com/yourusername",
    email: "you@example.com",
  },
  theme: {
    primaryColor: "#3b82f6", // Customize your brand color
    accentColor: "#8b5cf6",
  },
  analytics: {
    provider: "plausible", // or "google"
    plausibleDomain: "yoursite.com",
  },
} as const;
```

### Add Content

**Projects** - Create `.md` files in `src/content/projects/`:

```markdown
---
title: "Project Name"
description: "Short description"
date: 2024-01-15
tags: ["React", "TypeScript", "Tailwind"]
featured: true
liveUrl: "https://project.com"
githubUrl: "https://github.com/you/project"
---

Your project case study content here...
```

**Blog Posts** - Create `.md` files in `src/content/blog/`:

```markdown
---
title: "Blog Post Title"
description: "Post excerpt"
date: 2024-01-15
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
make firebase-deploy   # Deploy to Firebase
make firebase-preview  # Preview Firebase hosting
```

Or use yarn directly:

```bash
yarn dev          # Development server
yarn build        # Production build
yarn test         # Run tests
yarn preview      # Preview build
```

## 🚢 Deployment

### Firebase Hosting

#### 1. Setup Firebase Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (already configured)
# Update .firebaserc with your project ID
```

#### 2. Configure GitHub Secrets

For automated deployments, add to your GitHub repository:

1. Go to **Settings > Secrets and variables > Actions**
2. Add `FIREBASE_SERVICE_ACCOUNT`:
   ```bash
   # Generate service account key
   firebase projects:list
   # Visit Firebase Console > Project Settings > Service Accounts
   # Generate new private key and copy the JSON
   ```

#### 3. Deploy

```bash
# Manual deployment
make firebase-deploy

# Or using Firebase CLI
firebase deploy
```

GitHub Actions will automatically:

- Run tests on all PRs
- Deploy previews for PRs
- Deploy to production on pushes to `main`

### Other Platforms

The static build (`dist/`) can be deployed to:

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
- **Analytics**: Configure in `src/config.ts` (supports Plausible and Google Analytics)
- **Performance**: Run Lighthouse audits (`yarn preview` then test in Chrome DevTools)

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)
