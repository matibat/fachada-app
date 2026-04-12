# Fachada Theme & Layout Configuration Guide

**Purpose**: How to configure custom themes, layouts, and visual settings for your Fachada app.

---

## Theme System Overview

Fachada includes 4 built-in visual themes, each with light and dark modes:

| Theme           | Vibe                               | Best For                              |
| --------------- | ---------------------------------- | ------------------------------------- |
| **Minimalista** | Clean, professional, restrained    | Corporate, traditional portfolios     |
| **Modern Tech** | Futuristic, energetic, neon        | Startups, developers, tech-focused    |
| **Profesional** | Corporate, structured, trustworthy | Consultants, freelancers, agencies    |
| **Vaporwave**   | Retro, playful, high-contrast      | Designers, artists, creative profiles |

---

## Quick Start: Setting Your Theme

Edit `src/profiles/{your-app-name}/profile.config.ts`:

```typescript
export const profileConfig: ProfileConfig = {
  theme: {
    style: "minimalista", // Your chosen theme
    defaultMode: "system", // light | dark | system (user preference)
    enableStyleSwitcher: true, // Show theme selector widget
    enableModeToggle: true, // Show light/dark toggle
  },
  // ... rest of config
};
```

### Option 1: Single Theme (Locked)

Force all visitors to use one specific theme:

```typescript
theme: {
  style: "modern-tech",
  defaultMode: "light",           // Lock to light mode (no toggle)
  enableStyleSwitcher: false,      // Hide theme selector
  enableModeToggle: false,         // Hide light/dark toggle
},
```

**Use when**: You want a consistent brand experience (corporate profile).

### Option 2: Multi-Theme with User Choice

Allow visitors to pick their preferred theme and mode:

```typescript
theme: {
  style: "minimalista",           // Default for first-time visitors
  defaultMode: "system",          // Respect OS preference
  enableStyleSwitcher: true,      // Show theme selector
  enableModeToggle: true,         // Show light/dark toggle
},
```

**Use when**: You want flexibility and user control.

---

## Theme Details & Palettes

### Minimalista

**Vibe**: Elegant, professional, timeless  
**Best for**: Developers, designers, corporate portfolios

**Light Mode Palette**:

- Background: `#FFFFFF` (white)
- Secondary: `#F8FAFC` (light gray)
- Text primary: `#111827` (dark charcoal)
- Text secondary: `#6B7280` (medium gray)
- Accent: `#3B82F6` (gentle blue)
- Border: `#E5E7EB` (light border)

**Dark Mode Palette**:

- Background: `#111827` (dark charcoal)
- Secondary: `#1F2937` (dark gray)
- Text primary: `#F3F4F6` (near white)
- Text secondary: `#D1D5DB` (light gray)
- Accent: `#60A5FA` (lighter blue)
- Border: `#374151` (dark border)

**Characteristics**:

- Generous spacing and padding
- Subtle shadows (no strong glow)
- Simple, readable typography
- Minimal animation (professional feel)
- High contrast for accessibility

---

### Modern Tech

**Vibe**: Futuristic, dynamic, high-energy  
**Best for**: Startups, developers, tech-forward portfolios

**Light Mode Palette**:

- Background: `#0F172A` (very dark blue)
- Secondary: `#1E293B` (dark blue-gray)
- Text primary: `#F1F5F9` (almost white)
- Text secondary: `#CBD5E1` (light gray)
- Accent: `#06B6D4` (bright cyan)
- Accent 2: `#7C3AED` (vibrant violet)
- Glow: `rgba(6, 182, 212, 0.5)` (cyan glow)

**Dark Mode Palette**:

- Background: `#0B0E27` (darker navy)
- Secondary: `#111630` (very dark)
- Text primary: `#F0F9FF` (bright white)
- Text secondary: `#CBD5E1` (light blue-gray)
- Accent: `#00F0FF` (electric cyan)
- Accent 2: `#A78BFA` (soft purple)
- Glow: `rgba(0, 240, 255, 0.8)` (intense cyan glow)

**Characteristics**:

- Glowing hover effects and accents
- Gradient backgrounds and text
- Smooth animations and transitions
- Dynamic color shifts
- High contrast, bold typography
- Neon vibes in both modes

---

### Profesional

**Vibe**: Corporate modern, calm, structured  
**Best for**: Consultants, agencies, enterprises

**Light Mode Palette**:

- Background: `#FFFFFF` (white)
- Secondary: `#F9FAFB` (off-white)
- Text primary: `#0F172A` (navy)
- Text secondary: `#475569` (slate gray)
- Accent: `#0369A1` (professional blue)
- Accent 2: `#10B981` (calm green)
- Border: `#E2E8F0` (light blue-gray)

**Dark Mode Palette**:

- Background: `#0F172A` (navy)
- Secondary: `#1E293B` (slate)
- Text primary: `#F1F5F9` (off-white)
- Text secondary: `#CBD5E1` (light gray)
- Accent: `#38BDF8` (lighter blue)
- Accent 2: `#6EE7B7` (bright green)
- Border: `#334155` (medium slate)

**Characteristics**:

- Structured grid layouts
- Clear typographic hierarchy
- Balanced spacing (not minimal, not excessive)
- Restrained animations
- Professional color palette
- Trust-building design

---

### Vaporwave

**Vibe**: Retro-futuristic, playful, artistic  
**Best for**: Designers, artists, creative profiles

**Light Mode Palette**:

- Background: `#FFF5FF` (light pink)
- Secondary: `#FFE9F3` (pale magenta)
- Text primary: `#4A1A4D` (deep purple)
- Text secondary: `#8B5A8C` (medium purple)
- Accent: `#FF66B2` (hot pink)
- Accent 2: `#00D1FF` (electric cyan)
- Gradient: `linear-gradient(135deg, #FF66B2, #00D1FF)`

**Dark Mode Palette**:

- Background: `#1A0033` (deep purple)
- Secondary: `#330066` (darker purple)
- Text primary: `#FFB3E6` (light pink)
- Text secondary: `#FF99DD` (bright magenta)
- Accent: `#FF00FF` (magenta)
- Accent 2: `#00FFFF` (cyan)
- Glow: `rgba(255, 102, 178, 0.6)` (pink glow)

**Characteristics**:

- Layered gradients (pink, cyan, purple)
- Strong glowing effects
- Playful typography (varying sizes/weights)
- Retro 80s/90s nostalgia
- High color saturation
- Energetic animations

---

## Customizing an Existing Theme

To modify an existing theme (e.g., change accent colors), edit `src/styles/themes.css`:

```css
/* Add a custom color override */
[data-theme="minimalista"] {
  --accent: #ff6b6b; /* Red instead of blue */
  --accent-hover: #ff5252;
}

[data-theme="minimalista"].dark {
  --accent: #ff8b8b;
  --accent-hover: #ffb3b3;
}
```

Then test locally:

```bash
APP={your-app-name} yarn dev
```

Visit the site and verify the new accent color applies.

---

## Creating a Custom Theme

### Step 1: Define Theme Colors

Add your theme to `src/styles/themes.css`:

```css
[data-theme="my-custom-theme"] {
  --bg-primary: #fffbf7;
  --bg-secondary: #fff4e6;
  --text-primary: #2c1810;
  --text-secondary: #6b5344;
  --accent: #e8854d;
  --accent-hover: #d97335;
  --border: #e8d5c9;
  --shadow: rgba(0, 0, 0, 0.05);
  --spacing-section: 6rem;
  --spacing-card: 1.5rem;
  --border-radius: 0.5rem;
  --transition: all 0.3s ease;
}

[data-theme="my-custom-theme"].dark {
  --bg-primary: #2c1810;
  --bg-secondary: #4a2f1e;
  --text-primary: #fff4e6;
  --text-secondary: #e8d5c9;
  --accent: #ffb88d;
  --accent-hover: #ffca9b;
  --border: #6b5344;
  --shadow: rgba(255, 255, 255, 0.05);
}
```

### Step 2: Update Type Definitions

Edit `src/types/profile.types.ts`:

```typescript
export type ThemeStyle =
  | "minimalista"
  | "modern-tech"
  | "profesional"
  | "vaporwave"
  | "my-custom-theme"; // Add your theme
```

### Step 3: Register in Theme Metadata

Add your theme to the available themes (in profile.config.ts or theme registry):

```typescript
export const themeMetadata = {
  minimalista: { name: "Minimalista", description: "Clean and professional" },
  "modern-tech": {
    name: "Modern Tech",
    description: "Futuristic and energetic",
  },
  profesional: { name: "Profesional", description: "Corporate and calm" },
  vaporwave: { name: "Vaporwave", description: "Retro and playful" },
  "my-custom-theme": {
    name: "My Theme",
    description: "Custom theme description",
  },
};
```

### Step 4: Use in Profile Config

```typescript
export const profileConfig: ProfileConfig = {
  theme: {
    style: "my-custom-theme",
    defaultMode: "system",
    enableStyleSwitcher: true,
    enableModeToggle: true,
  },
  // ...
};
```

### Step 5: Test

```bash
APP={your-app-name} yarn dev
```

Verify your theme applies and looks correct in both light and dark modes.

---

## CSS Variables Available

All themes expose these variables for custom components:

```css
/* Colors */
--bg-primary              /* Main background */
--bg-secondary            /* Secondary background (cards, sections) */
--text-primary            /* Main text color */
--text-secondary          /* Secondary text (muted) */
--accent                  /* Primary accent color */
--accent-hover            /* Hover state for accent */
--accent-2                /* Secondary accent (if defined) */
--border                  /* Border and divider color */
--shadow                  /* Shadow color/opacity */

/* Spacing */
--spacing-section         /* Between sections (e.g., 6rem) */
--spacing-card            /* Inside cards/components (e.g., 1.5rem) */

/* Effects */
--border-radius           /* Rounded corners (e.g., 0.5rem) */
--transition              /* Transition timing (e.g., all 0.3s ease) */
--glow                    /* Glow effect rgba (if using Modern Tech/Vaporwave) */
--gradient                /* Gradient string (if applicable) */
```

### Using CSS Variables in Components

```astro
---
// In an Astro component
---

<div class="my-custom-component">
  <h2>Hello</h2>
  <p>Text here</p>
</div>

<style>
  .my-custom-component {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    padding: var(--spacing-card);
    transition: var(--transition);
  }

  .my-custom-component h2 {
    color: var(--accent);
  }

  .my-custom-component:hover {
    background: var(--bg-primary);
    color: var(--accent-hover);
  }
</style>
```

---

## Layout Customization

### Controlling Sections

Edit `profile.config.ts` to show/hide and reorder sections:

```typescript
sections: [
  { id: "hero", enabled: true, order: 1 },
  { id: "about", enabled: true, order: 2 },
  { id: "skills", enabled: false, order: 3 },    // Hidden
  { id: "projects", enabled: true, order: 4 },
  { id: "contact", enabled: true, order: 5 },
],
```

### Multi-Role Layout (Role Explorer)

For profiles with multiple roles, use the `role-explorer` section:

```typescript
sections: [
  { id: "hero", enabled: true, order: 1 },
  { id: "role-explorer", enabled: true, order: 2 },  // Interactive role selector
  { id: "projects", enabled: true, order: 3 },
  { id: "contact", enabled: true, order: 4 },
],
```

This renders an interactive card-based UI where visitors select a role, and the About/Skills content updates dynamically.

---

## Advanced: Custom CSS Overrides

For project-specific styling, create `src/styles/custom.css` and import it in `src/layouts/BaseLayout.astro`:

```css
/* Custom overrides for your app */
body {
  --custom-spacing: 2rem;
}

.hero-section {
  padding: calc(var(--spacing-section) * 2);
}

@media (max-width: 768px) {
  .hero-section {
    padding: var(--spacing-section);
  }
}
```

---

## Troubleshooting

### Colors not applying

- [ ] Verify `[data-theme="..."]` selector matches your theme name
- [ ] Check for typos in CSS variable names (must start with `--`)
- [ ] Clear browser cache and localStorage: `localStorage.clear()`
- [ ] Restart dev server: `Ctrl+C` then `yarn dev`

### Theme switcher not showing

- [ ] Confirm `enableStyleSwitcher: true` in profile.config.ts
- [ ] Check browser console for JS errors
- [ ] Verify `src/components/islands/ThemeSwitcher.tsx` exists

### Light/dark toggle not working

- [ ] Confirm `enableModeToggle: true` in profile.config.ts
- [ ] Check localStorage for `theme` key: `localStorage.getItem('theme')`
- [ ] Verify `src/components/islands/ThemeToggle.tsx` exists

---

## Reference

- [Theme Details](#theme-details--palettes) — Full color palettes and descriptions
- [CSS Variables](#css-variables-available) — All available design tokens
- [PROFILE-EXTENSIBILITY.md](./PROFILE-EXTENSIBILITY.md) — Multi-role and section configuration
- [App Builder Guide](./fachada-app-builder-guide.md) — Complete app creation steps

---

**Ready to theme?** Set your theme in profile.config.ts, run `yarn dev`, and watch your portfolio come to life! 🎨
