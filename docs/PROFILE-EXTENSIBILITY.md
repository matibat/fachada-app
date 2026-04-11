# Profile Extensibility Architecture

**Status**: Implemented  
**Scope**: Making Fachada fully configurable for multi-profession profiles  
**Goal**: Load a new profile and have a brand new SPA for someone else without modifying core code

---

## Current State

### What Is Implemented

- ✅ App system with 2 registered apps (`default-fachada`, `artist-engineer`)
- ✅ Type-safe profile interfaces in `src/types/profile.types.ts`
- ✅ App registry and active app selection via `APP` env var
- ✅ About and Skills content driven by profile config (no hardcoded text)
- ✅ Contact message driven by profile config
- ✅ Hero section supports multi-role display (shows all featured roles in overline)
- ✅ `enableStyleSwitcher` and `enableModeToggle` actually control widget visibility
- ✅ Sections render conditionally based on `sections[]` in profileConfig
- ✅ Sections can require content collections to exist before rendering
- ✅ `siteConfig.roles[]` with `primaryRole` replaces single `role` string
- ✅ **Multi-role storytelling pattern**: `role-explorer` inline section with card selection + dynamic about/skills per role
- ✅ Each `Role` can carry its own `about` paragraphs and `skills` categories for the explorer
- ✅ Full test coverage: 142 tests, 100% pass rate

---

## Architecture Overview

### Profile Selection Flow

```
APP env var at build time
   ↓
astro.config.mjs (sets import.meta.env.APP)
   ↓
src/profiles/index.ts (getProfile() → PROFILES[name])
   ↓
src/config.ts (re-exports activeProfile.siteConfig)
src/profile.config.ts (re-exports activeProfile.profileConfig)
   ↓
All components: Hero, About, Skills, Contact, RoleExplorer, index.astro
```

### Profile Directory Structure

```
src/profiles/
├── index.ts                         # Registry: AVAILABLE_PROFILES (app names)
├── default-fachada/
│   ├── site.config.ts               # Name, URL, social, roles
│   └── profile.config.ts            # Theme, about text, skills, sections
└── artist-engineer-multi/
    ├── site.config.ts               # Two roles, each with role.about + role.skills
    └── profile.config.ts            # Sections: hero, role-explorer, projects, contact
```

---

## Type System

All profile types are in `src/types/profile.types.ts`:

```typescript
interface Role {
  id: string;
  title: string;
  specialties: string[];
  featured: boolean;
  description?: string; // Short teaser shown on the role card
  about?: AboutContent; // Role-specific bio (3 paragraphs), shown in RoleExplorer
  skills?: SkillCategory[]; // Role-specific skill table, shown in RoleExplorer
}

interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  roles: Role[]; // All professional identities
  primaryRole: string; // ID of default role
  social: { github; linkedin; twitter; email };
  location: { city; country };
  analytics: { plausibleDomain };
  ogImage: string;
}

interface ProfileConfig {
  theme: ThemeConfig; // Style, mode, widget flags
  about: AboutContent; // 3 bio paragraphs (used for single-role About section)
  skills: SkillCategory[]; // Skill table data (used for single-role Skills section)
  sections: PageSectionConfig[]; // Which sections to render and in what order
  contactMessage?: string;
  multiRoleDisplay?: MultiRoleDisplayConfig;
}

interface MultiRoleDisplayConfig {
  style: "storytelling" | "tabs" | "combined";
  // "storytelling" — inline RoleExplorer section with card selection (implemented)
  // "tabs" / "combined" — future strategies
}

interface PageSectionConfig {
  id: string;
  enabled: boolean;
  order: number;
  requiresRole?: string[]; // Only show if a matching role exists
  requiresContent?: "projects" | "blog"; // Only show if collection non-empty
}
```

---

## Creating a New Profile

### Step 1: Create the directory

```bash
mkdir -p src/profiles/your-name
```

### Step 2: Create `site.config.ts`

```typescript
import type { SiteConfig } from "../../types/profile.types";

export const siteConfig: SiteConfig = {
  name: "Your Name",
  title: "Your Name — Your Role",
  description: "...",
  author: "Your Name",
  url: "https://your-domain.dev",
  ogImage: "/og-image.png",
  social: {
    github: "https://github.com/yourhandle",
    linkedin: "https://linkedin.com/in/yourhandle",
    twitter: "https://twitter.com/yourhandle",
    email: "you@example.dev",
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

### Step 3: Create `profile.config.ts`

```typescript
import type { ProfileConfig } from "../../types/profile.types";

export const profileConfig: ProfileConfig = {
  theme: {
    style: "minimalist",
    defaultMode: "system",
    enableStyleSwitcher: true,
    enableModeToggle: true,
  },
  about: {
    paragraphs: [
      "First paragraph of your bio.",
      "Second paragraph, e.g. technical focus.",
      "Third paragraph, personal touch or interests.",
    ],
  },
  skills: [
    { name: "Category A", skills: ["Skill 1", "Skill 2", "Skill 3"] },
    { name: "Category B", skills: ["Skill 4", "Skill 5", "Skill 6"] },
  ],
  sections: [
    { id: "hero", enabled: true, order: 1 },
    { id: "about", enabled: true, order: 2 },
    { id: "skills", enabled: true, order: 3 },
    { id: "projects", enabled: true, order: 4, requiresContent: "projects" },
    { id: "contact", enabled: true, order: 5 },
  ],
  contactMessage: "I'd love to hear from you.",
};
```

### Step 4: Register in `src/profiles/index.ts`

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

### Step 5: Build

```bash
APP=your-name yarn build    # Production build
APP=your-name yarn dev      # Development server
```

---

## Multi-Role Profile — Storytelling Pattern

For someone who works across multiple disciplines (e.g. an engineer who is also an artist), the **storytelling pattern** renders an inline `RoleExplorer` section instead of separate About/Skills sections. The visitor sees a brief generic hero, then land on a "What I Do" section with role cards — clicking a card reveals that role's bio and skills.

### How it works

1. **Hero** shows all featured roles in the overline (e.g. "Software Engineer & Digital Artist") with a generic description from `siteConfig.description`.
2. **RoleExplorer section** (`id: "role-explorer"`) renders as a React island. It shows one card per role; the active card is highlighted.
3. Clicking a card swaps the About text and Skills grid below to that role's content, driven entirely by `role.about` and `role.skills`.

### `site.config.ts` for a multi-role profile

```typescript
roles: [
  {
    id: "engineer",
    title: "Software Engineer",
    specialties: ["TypeScript", "React", "WebGL"],
    featured: true,
    description: "Short teaser shown on the role card.",
    about: {
      paragraphs: [
        "First bio paragraph specific to the engineer role.",
        "Second paragraph.",
        "Third paragraph.",
      ],
    },
    skills: [
      { name: "Languages", skills: ["TypeScript", "Node.js", "GLSL"] },
      { name: "Frontend",  skills: ["React", "Three.js", "Astro"] },
    ],
  },
  {
    id: "artist",
    title: "Digital Artist",
    specialties: ["3D Modeling", "Generative Art"],
    featured: true,
    description: "Short teaser shown on the artist role card.",
    about: {
      paragraphs: [
        "First bio paragraph specific to the artist role.",
        "Second paragraph.",
        "Third paragraph.",
      ],
    },
    skills: [
      { name: "3D & Motion", skills: ["Blender", "Cinema 4D", "Houdini"] },
      { name: "Creative Code", skills: ["p5.js", "GLSL", "TouchDesigner"] },
    ],
  },
],
primaryRole: "engineer",
```

### `profile.config.ts` for a multi-role profile

```typescript
// Top-level about/skills act as a schema-required fallback; the explorer uses role-level content
about: { paragraphs: ["Generic para 1.", "Generic para 2.", "Generic para 3."] },
skills: [{ name: "Overview", skills: ["TypeScript", "Blender"] }],

sections: [
  { id: "hero",          enabled: true, order: 1 },
  { id: "role-explorer", enabled: true, order: 2 },   // ← replaces about + skills
  { id: "projects",      enabled: true, order: 3, requiresContent: "projects" },
  { id: "contact",       enabled: true, order: 4 },
],
multiRoleDisplay: {
  style: "storytelling",
},
```

---

## Configurable Widget Examples

### Lock the theme for a professional profile

```typescript
theme: {
  style: "professional",
  defaultMode: "light",
  enableStyleSwitcher: false,  // ← No style switcher shown
  enableModeToggle: true,
}
```

### Minimal dark-only portfolio

```typescript
theme: {
  style: "modern-tech",
  defaultMode: "dark",
  enableStyleSwitcher: false,
  enableModeToggle: false,   // ← No controls at all — theme is locked
}
```

---

## Known Gaps & Future Work

1. **Content per profile**: Currently all profiles share the same `src/content/` folder. Add per-profile content directories to fully isolate projects/blog.
2. **Role-tagged content**: Projects and blog posts could be tagged with a role ID so the `RoleExplorer` automatically filters projects to the active role.
3. **Multi-role display strategies**: `"tabs"` and `"combined"` are defined in the type but not yet implemented. Only `"storytelling"` is live.
4. **Analytics**: Each profile uses its own `plausibleDomain` but analytics is only active in production builds.
5. **i18n**: Profile-level language and locale are not yet supported.

---

## Architecture Overview

### Profile Selection Flow

```
APP env var at build time
   ↓
astro.config.mjs (sets import.meta.env.APP)
   ↓
src/profiles/index.ts (getProfile() → PROFILES[name])
   ↓
src/config.ts (re-exports activeProfile.siteConfig)
src/profile.config.ts (re-exports activeProfile.profileConfig)
   ↓
All components: Hero, About, Skills, Contact, index.astro
```

### Profile Directory Structure

```
src/profiles/
├── index.ts                         # Registry: AVAILABLE_PROFILES (app names)
├── default-fachada/
│   ├── site.config.ts               # Name, URL, social, roles
│   └── profile.config.ts            # Theme, about text, skills, sections
└── artist-engineer-multi/
    ├── site.config.ts               # Two roles: engineer + artist
    └── profile.config.ts            # Sections: hero, role-explorer, projects, contact
```

---

## Type System

interface SiteConfig {
name: string;
title: string;
description: string;
url: string;
roles: Role[]; // All professional identities
primaryRole: string; // ID of default role
social: { github; linkedin; twitter; email };
location: { city; country };
analytics: { plausibleDomain };
ogImage: string;
}

interface ProfileConfig {
theme: ThemeConfig; // Style, mode, widget flags
about: AboutContent; // 3 bio paragraphs
skills: SkillCategory[]; // Skill table data
sections: PageSectionConfig[]; // Which sections to render and in what order
contactMessage?: string;
multiRoleDisplay?: MultiRoleDisplayConfig;
}

interface PageSectionConfig {
id: string;
enabled: boolean;
order: number;
requiresRole?: string[]; // Only show if primaryRole matches
requiresContent?: "projects" | "blog"; // Only show if collection non-empty
}

````

---

## Creating a New Profile

### Step 1: Create the directory

```bash
mkdir -p src/profiles/your-name
````

### Step 2: Create `site.config.ts`

```typescript
import type { SiteConfig } from "../../types/profile.types";

export const siteConfig: SiteConfig = {
  name: "Your Name",
  title: "Your Name — Your Role",
  description: "...",
  author: "Your Name",
  url: "https://your-domain.dev",
  ogImage: "/og-image.png",
  social: {
    github: "https://github.com/yourhandle",
    linkedin: "https://linkedin.com/in/yourhandle",
    twitter: "https://twitter.com/yourhandle",
    email: "you@example.dev",
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

### Step 3: Create `profile.config.ts`

```typescript
import type { ProfileConfig } from "../../types/profile.types";

export const profileConfig: ProfileConfig = {
  theme: {
    style: "minimalist",
    defaultMode: "system",
    enableStyleSwitcher: true,
    enableModeToggle: true,
  },
  about: {
    paragraphs: [
      "First paragraph of your bio.",
      "Second paragraph, e.g. technical focus.",
      "Third paragraph, personal touch or interests.",
    ],
  },
  skills: [
    { name: "Category A", skills: ["Skill 1", "Skill 2", "Skill 3"] },
    { name: "Category B", skills: ["Skill 4", "Skill 5", "Skill 6"] },
  ],
  sections: [
    { id: "hero", enabled: true, order: 1 },
    { id: "about", enabled: true, order: 2 },
    { id: "skills", enabled: true, order: 3 },
    { id: "projects", enabled: true, order: 4, requiresContent: "projects" },
    { id: "contact", enabled: true, order: 5 },
  ],
  contactMessage: "I'd love to hear from you.",
};
```

### Step 4: Register in `src/profiles/index.ts`

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

### Step 5: Build

```bash
APP=your-name yarn build    # Production build
APP=your-name yarn dev      # Development server
```

---

## Multi-Role Profile Example

For an artist who is also an engineer, add multiple entries to `roles` and configure `multiRoleDisplay`:

### `site.config.ts`

```typescript
roles: [
  {
    id: "engineer",
    title: "Software Engineer",
    specialties: ["TypeScript", "React", "WebGL"],
    featured: true,
    description: "Building performant web applications",
  },
  {
    id: "artist",
    title: "Digital Artist",
    specialties: ["3D Modeling", "Animation", "Generative Art"],
    featured: true,
    description: "Creating immersive digital experiences",
  },
],
primaryRole: "engineer",
```

### `profile.config.ts`

```typescript
multiRoleDisplay: {
  style: "tabs",            // How to display the role switcher UI
  showRoleSwitcher: true,   // Render the switcher widget
},
```

The Hero section automatically shows all featured roles joined by `&` when more than one role is present.

---

## Configurable Widget Examples

### Lock the theme for a professional profile

```typescript
// profile.config.ts
theme: {
  style: "professional",
  defaultMode: "light",
  enableStyleSwitcher: false,  // ← No style switcher shown
  enableModeToggle: true,      // ← Users can still toggle dark/light
}
```

### Minimal dark-only portfolio

```typescript
theme: {
  style: "modern-tech",
  defaultMode: "dark",
  enableStyleSwitcher: false,
  enableModeToggle: false,   // ← No controls at all — theme is locked
}
```

---

## Known Gaps & Future Work

1. **Content per profile**: Currently all profiles share the same `src/content/` folder. Add per-profile content directories to fully isolate projects/blog.
2. **Role-tagged content**: Projects and blog posts could be tagged with a role ID for filtered display.
3. **Analytics**: Each profile uses its own `plausibleDomain` but analytics is only active in production builds.
4. **i18n**: Profile-level language and locale are not yet supported.
