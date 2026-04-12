# Fachada Portfolio Template

A modern, SEO-optimized portfolio template built with Astro 6, React, and Tailwind CSS. Features **4 visual themes**, dark mode, comprehensive testing, and automated deployment. **App-extensible**: Create entirely new SPAs for different people with configuration alone.

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
- 🔄 **CI/CD** - GitHub Actions for automated testing and Firebase deployment
- ⚙️ **Configuration-Driven** - Rebrand from a single config file
- 🏗️ **Makefile Automation** - Common tasks automated (dev, build, test, deploy)
- 👥 **Multi-App Support** - Create entirely new SPAs for different people by extending apps

## 🎨 Theme System

Choose from 4 carefully designed visual styles:

- **Minimalista** - Clean, professional, timeless elegance
- **Modern Tech** - Futuristic with glow effects and gradients
- **Profesional** - Corporate modern with structured layout
- **Vaporwave** - Retro-futuristic 80s/90s aesthetic

Each theme supports both light and dark modes. See [docs/THEME-CONFIGURATION.md](docs/THEME-CONFIGURATION.md) for full details.

### Quick Theme Setup

Edit your app's `profile.config.ts` (located in `apps/your-app/`):

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

# Build for production (default app)
make build
# or: yarn build

# Build with a specific app
APP=engineer yarn build
APP=artist-engineer yarn build
```

Visit `http://localhost:4321` to see your site.

## 📁 Project Structure

```text
/
├── docs/
│   ├── THEME-CONFIGURATION.md     # Theme system documentation
│   └── PROFILE-EXTENSIBILITY.md  # Profile architecture guide
├── public/                         # Static assets (images, favicons)
├── src/
│   ├── components/
│   │   ├── islands/               # React interactive islands
│   │   │   ├── ThemeToggle.tsx    # Light/dark mode toggle
│   │   │   ├── ThemeSwitcher.tsx  # Visual style switcher
│   │   │   └── LayoutWrapper.tsx  # Root provider (conditional widget rendering)
│   │   ├── sections/              # Homepage sections
│   │   │   ├── Hero.astro
│   │   │   ├── About.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Projects.astro
│   │   │   └── Contact.astro
│   │   └── ui/                    # Reusable UI components
│   ├── content/
│   │   ├── projects/              # Project case studies (.md)
│   │   └── blog/                  # Blog posts (.md)
│   ├── profiles/
│   │   └── index.ts               # backward-compatibility shim
│   ├── types/
│   │   └── profile.types.ts       # All profile TypeScript interfaces
│   ├── layouts/
│   │   └── BaseLayout.astro       # Root layout with SEO
│   ├── pages/
│   │   ├── index.astro            # Homepage (profile-driven section rendering)
│   │   └── ...
│   ├── utils/
│   │   └── theme.config.ts        # Theme token definitions
│   ├── config.ts                  # Re-exports active profile's siteConfig
│   └── profile.config.ts          # Re-exports active profile's profileConfig
├── apps/
│   ├── default-fachada/           # Default developer portfolio
│   ├── artist-engineer/           # Multi-role: engineer + digital artist
│   └── engineer-single-role/      # Backend engineer locked to modern-tech theme
├── tests/
│   ├── profiles.test.ts           # Profile loading and multi-role tests
│   ├── config.test.ts             # Site config contract tests
│   └── Theme*.test.tsx            # Theme system tests
├── astro.config.mjs               # Astro configuration
└── package.json
```

├── vitest.config.ts # Test configuration
├── firebase.json # Firebase Hosting config
├── Makefile # Development automation
└── package.json

````

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
````

## 📋 Creating New Apps

This template is designed to be **app-extensible**. Changing the active app at build time produces a completely different SPA — different name, bio, skills, theme settings, and visible sections.

### Quick App Creation (Legacy Profile Setup)

1. **Create a profile directory**:

   ```bash
   mkdir -p src/profiles/your-name
   ```

2. **Create `src/profiles/your-name/site.config.ts`**:

   ```typescript
   import type { SiteConfig } from "../../types/profile.types";

   export const siteConfig: SiteConfig = {
     name: "Your Name",
     title: "Your Name — Your Role",
     description: "Your professional description",
     author: "Your Name",
     url: "https://your-domain.dev",
     ogImage: "/og-image.png",
     social: {
       github: "https://github.com/yourusername",
       linkedin: "https://linkedin.com/in/yourusername",
       twitter: "https://twitter.com/yourusername",
       email: "your@email.dev",
     },
     location: { city: "Your City", country: "Your Country" },
     roles: [
       {
         id: "engineer",
         title: "Software Engineer",
         specialties: ["TypeScript", "React"],
         featured: true,
       },
     ],
     primaryRole: "engineer",
     analytics: { plausibleDomain: "your-domain.dev" },
   };
   ```

3. **Create `src/profiles/your-name/profile.config.ts`**:

   ```typescript
   import type { ProfileConfig } from "../../types/profile.types";

   export const profileConfig: ProfileConfig = {
     theme: {
       style: "minimalist", // minimalist | modern-tech | professional | vaporwave
       defaultMode: "system", // light | dark | system
       enableStyleSwitcher: true, // show/hide theme switcher widget
       enableModeToggle: true, // show/hide light/dark toggle widget
     },
     about: {
       paragraphs: [
         "Your first bio paragraph.",
         "Your second bio paragraph.",
         "Your third bio paragraph.",
       ],
     },
     skills: [
       { name: "Category 1", skills: ["Tech A", "Tech B", "Tech C"] },
       { name: "Category 2", skills: ["Tech D", "Tech E", "Tech F"] },
     ],
     sections: [
       { id: "hero", enabled: true, order: 1 },
       { id: "about", enabled: true, order: 2 },
       { id: "skills", enabled: true, order: 3 },
       { id: "projects", enabled: true, order: 4, requiresContent: "projects" },
       { id: "contact", enabled: true, order: 5 },
     ],
     contactMessage: "Your contact section message.",
   };
   ```

4. **Register the app in `src/profiles/index.ts`** (legacy shim):

   ```typescript
   import { siteConfig as yourNameSite } from "./your-name/site.config";
   import { profileConfig as yourNameProfile } from "./your-name/profile.config";

   const PROFILES: Record<string, LoadedProfile> = {
     // ... existing profiles ...
     "your-name": {
       siteConfig: yourNameSite,
       profileConfig: yourNameProfile,
     },
   };
   ```

## 📋 Creating New Apps

This template is designed to be **app-extensible**. Each app produces a completely different SPA with its own content and style.

### Quick App Creation

1. **Create an app directory**:

   ```bash
   mkdir -p apps/your-app/
   ```

2. **Create profile config files** in `src/profiles/your-app/`:

   Create `src/profiles/your-app/site.config.ts`:

   ```typescript
   import type { SiteConfig } from "../../types/profile.types";

   export const siteConfig: SiteConfig = {
     name: "Your Name",
     title: "Your Name — Your Role",
     description: "Your professional description",
     author: "Your Name",
     url: "https://your-domain.dev",
     ogImage: "/og-image.png",
     social: {
       github: "https://github.com/yourusername",
       linkedin: "https://linkedin.com/in/yourusername",
       twitter: "https://twitter.com/yourusername",
       email: "your@email.dev",
     },
     location: { city: "Your City", country: "Your Country" },
     roles: [
       {
         id: "engineer",
         title: "Software Engineer",
         specialties: ["TypeScript", "React"],
         featured: true,
       },
     ],
     primaryRole: "engineer",
     analytics: { plausibleDomain: "your-domain.dev" },
   };
   ```

   Create `src/profiles/your-app/profile.config.ts`:

   ```typescript
   import type { ProfileConfig } from "../../types/profile.types";

   export const profileConfig: ProfileConfig = {
     theme: {
       style: "minimalist", // minimalist | modern-tech | professional | vaporwave
       defaultMode: "system", // light | dark | system
       enableStyleSwitcher: true,
       enableModeToggle: true,
     },
     about: {
       paragraphs: [
         "Your first bio paragraph.",
         "Your second bio paragraph.",
         "Your third bio paragraph.",
       ],
     },
     skills: [{ name: "Category 1", skills: ["Tech A", "Tech B", "Tech C"] }],
     sections: [
       { id: "hero", enabled: true, order: 1 },
       { id: "about", enabled: true, order: 2 },
       { id: "skills", enabled: true, order: 3 },
       { id: "projects", enabled: true, order: 4, requiresContent: "projects" },
       { id: "contact", enabled: true, order: 5 },
     ],
   };
   ```

3. **Create `apps/your-app/app.config.ts`**:

   ```typescript
   import { siteConfig } from "../../src/profiles/your-app/site.config";
   import { profileConfig } from "../../src/profiles/your-app/profile.config";
   import type { AppConfig } from "../../src/types/app.types";

   export const appConfig: AppConfig = {
     seo: siteConfig,
     theme: profileConfig.theme,
     themes: {
       globals: ["minimalist", "modern-tech", "professional", "vaporwave"],
       default: "minimalist",
     },
     themeVariants: {},
     assets: {
       ogImage: siteConfig.ogImage,
     },
     page: {
       sections: profileConfig.sections.map((s) => ({ ...s, widgets: [] })),
     },
   };
   ```

4. **Register the app in `.fachadarc.json`**:

   ```json
   {
     "defaultApp": "default-fachada",
     "apps": {
       "default-fachada": "apps/default-fachada/app.config.ts",
       "your-app": "apps/your-app/app.config.ts"
     }
   }
   ```

5. **Build or dev with your app**:
   ```bash
   APP=your-app yarn dev
   APP=your-app yarn build
   ```

### Included Example Apps

| App               | Description                                    | Theme Widget | Mode Toggle |
| ----------------- | ---------------------------------------------- | ------------ | ----------- |
| `default-fachada` | Default single-role engineer portfolio         | ✅ Enabled   | ✅ Enabled  |
| `engineer`        | Backend engineer — locked to modern-tech theme | ❌ Disabled  | ✅ Enabled  |
| `artist-engineer` | Multi-role: engineer + digital artist          | ✅ Enabled   | ✅ Enabled  |

### Multi-Role Portfolios (Artist + Engineer, etc.)

To represent someone with multiple professional identities, add multiple entries to `roles`:

```typescript
roles: [
  {
    id: "engineer",
    title: "Software Engineer",
    specialties: ["TypeScript", "React", "WebGL"],
    featured: true,
  },
  {
    id: "artist",
    title: "Digital Artist",
    specialties: ["3D Modeling", "Animation", "Generative Art"],
    featured: true,
  },
],
primaryRole: "engineer",
```

And enable the role switcher:

```typescript
// in profile.config.ts
multiRoleDisplay: {
  style: "tabs",
  showRoleSwitcher: true,
},
```

See [docs/PROFILE-EXTENSIBILITY.md](docs/PROFILE-EXTENSIBILITY.md) for the full architecture guide.

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
