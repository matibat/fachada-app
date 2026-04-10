# Theme Configuration Guide

## Overview

The Fachada template now supports multiple visual themes and configurable features:

- **4 Visual Styles**: Minimalista, Modern Tech, Profesional, Vaporwave
- **Light/Dark Modes**: Each style supports both light and dark color modes
- **Configurable Widgets**: Enable/disable theme switcher and mode toggle independently

## Quick Start

### 1. Configure Your Profile

Edit `src/profile.config.ts` to customize your instance:

```typescript
export const profileConfig: ProfileConfig = {
  theme: {
    style: "minimalista", // Choose: 'minimalista' | 'modern-tech' | 'profesional' | 'vaporwave'
    defaultMode: "system", // Choose: 'light' | 'dark' | 'system'
    enableStyleSwitcher: true, // Show theme style selector widget
    enableModeToggle: true, // Show light/dark mode toggle
  },
};
```

### 2. Build Your Site

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Theme Styles

### Minimalista

- **Vibe**: Elegante, profesional, atemporal
- **Colors**: Blanco/negro con acentos sutiles en gris azulado
- **Spacing**: Márgenes y padding generosos
- **Effects**: Minimal, sin decoraciones innecesarias
- **Best For**: Portfolio profesional, desarrollo de software

### Modern Tech

- **Vibe**: Futurista, dinámico, tecnología avanzada
- **Colors**: Azul eléctrico, violeta, cyan neón (modo oscuro)
- **Spacing**: Energético y dinámico
- **Effects**: Glow effects, gradientes, hover animations
- **Best For**: Desarrolladores, perfiles tech, startups

### Profesional

- **Vibe**: Corporativo moderno, limpio y estructurado
- **Colors**: Azul marino, verde profesional
- **Spacing**: Balanceado y bien estructurado
- **Effects**: Sutiles y profesionales
- **Best For**: Freelancers, consultores, empresas

### Vaporwave

- **Vibe**: Retro-futurista, artístico, nostálgico 80s/90s
- **Colors**: Rosa, cyan, magenta, amarillo
- **Spacing**: Variado, artístico
- **Effects**: Glow intenso, gradientes sunset, efectos retro
- **Best For**: Diseñadores, artistas, perfiles creativos

## Configuration Options

### Theme Style (`style`)

Sets the visual aesthetic of the entire site.

```typescript
style: "minimalista" | "modern-tech" | "profesional" | "vaporwave";
```

### Default Mode (`defaultMode`)

Sets the initial color mode preference for new visitors:

- `'light'`: Always start in light mode
- `'dark'`: Always start in dark mode
- `'system'`: Follow user's OS preference

```typescript
defaultMode: "light" | "dark" | "system";
```

### Enable Style Switcher (`enableStyleSwitcher`)

Shows/hides the widget that allows users to change between the 4 visual styles:

```typescript
enableStyleSwitcher: true; // Show the style switcher widget
enableStyleSwitcher: false; // Hide it (users can't change style)
```

### Enable Mode Toggle (`enableModeToggle`)

Shows/hides the widget that toggles between light and dark modes:

```typescript
enableModeToggle: true; // Show the light/dark toggle
enableModeToggle: false; // Hide it (users can't toggle modes)
```

## Build Variants

### Single Theme Build (Locked)

For production sites where you want to lock a specific theme:

```typescript
// src/profile.config.ts
export const profileConfig: ProfileConfig = {
  theme: {
    style: "profesional",
    defaultMode: "light",
    enableStyleSwitcher: false, // Lock the style
    enableModeToggle: true, // Still allow light/dark
  },
};
```

### Multi-Theme Build (User Choice)

For instances where users should be able to choose their preferred style:

```typescript
// src/profile.config.ts
export const profileConfig: ProfileConfig = {
  theme: {
    style: "minimalista", // Default style
    defaultMode: "system",
    enableStyleSwitcher: true, // Users can switch styles
    enableModeToggle: true, // Users can toggle light/dark
  },
};
```

## CSS Variables

Each theme exposes CSS custom properties that you can use in your components:

```css
/* Available in all themes */
--bg-primary        /* Main background color */
--bg-secondary      /* Secondary background (cards, sections) */
--text-primary      /* Main text color */
--text-secondary    /* Secondary text color */
--accent            /* Primary accent color */
--accent-hover      /* Accent hover state */
--border            /* Border color */
--shadow            /* Shadow color/opacity */

/* Spacing */
--spacing-section   /* Section spacing */
--spacing-card      /* Card padding */
--spacing-element   /* Element spacing */

/* Effects */
--border-radius     /* Border radius */
--transition        /* Transition timing */
--glow              /* Glow effect (Modern Tech, Vaporwave) */
--gradient          /* Gradient (Modern Tech, Vaporwave) */
```

### Usage in Components

```astro
<div class="card">
  <h2 class="text-primary">Hello World</h2>
  <p class="text-secondary">This uses theme variables</p>
  <button class="btn-accent">Click me</button>
</div>
```

Or with custom CSS:

```css
.my-custom-element {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  transition: all var(--transition);
}
```

## Widget Positioning

Both widgets are positioned fixed on the page:

- **Mode Toggle** (light/dark): Bottom-right corner (6 units from edges)
- **Style Switcher**: Above the mode toggle (24 units from bottom)

To customize positioning, edit the components:

- `src/components/islands/ThemeToggle.tsx`
- `src/components/islands/ThemeSwitcher.tsx`

## Customization

### Adding a New Theme Style

1. Add the new style to the type in `src/profile.config.ts`:

   ```typescript
   export type ThemeStyle =
     | "minimalista"
     | "modern-tech"
     | "profesional"
     | "vaporwave"
     | "your-new-theme";
   ```

2. Add CSS variables in `src/styles/themes.css`:

   ```css
   [data-theme="your-new-theme"] {
     --bg-primary: #...;
     --text-primary: #...;
     /* ... etc */
   }

   [data-theme="your-new-theme"].dark {
     /* Dark mode variants */
   }
   ```

3. Add metadata in `src/profile.config.ts`:
   ```typescript
   export const themeMetadata = {
     // ... existing themes
     "your-new-theme": {
       name: "Your Theme Name",
       description: "Theme description",
     },
   };
   ```

## User Preferences

User theme preferences are stored in localStorage:

- `themeStyle`: The selected visual style ('minimalista', etc.)
- `theme`: The selected color mode ('light' or 'dark')

These persist across page reloads and sessions.

## Migration from Previous Version

If upgrading from a version without theme support:

1. Install the new files (profile.config.ts, themes.css, ThemeSwitcher.tsx)
2. Update BaseLayout.astro imports
3. Choose your default theme in profile.config.ts
4. Test with `npm run dev`
5. Rebuild with `npm run build`

Users' existing light/dark preferences will be preserved.
