# Theme Variant Debug Report: Artist-Engineer App Showing Vaporwave Instead of Custom Variants

## Result Summary

The artist-engineer app's custom theme variants (minimal, warm, bold) are configured correctly in AppConfig and build proper UI buttons in ThemeSwitcher, but **clicking a custom variant fails silently** because the theme validation system only recognizes global themes from THEME_DEFINITIONS, not app-specific variants. When a variant is clicked, validation rejects it as invalid, `setStyleTheme()` returns early without updating state or localStorage, and the previously loaded theme (often vaporwave) persists. The bug is a **validation and resolver architecture mismatch**: the UI layer (ThemeSwitcher) builds themes from custom variants, but the data layer (ThemeContext/ThemeResolver) validates against and resolves from global THEME_DEFINITIONS only.

---

## Diagnosis Chain

### Step 1: Configuration Check

**Status**: ✅ CORRECT

AppConfig defines three custom theme variants with full token objects and sets `themeDisplayMode: 'variants-only'`:

**File**: [apps/artist-engineer/app.config.ts](apps/artist-engineer/app.config.ts#L14-L50)

```typescript
export const appConfig: AppConfig = {
  seo: siteConfig,
  theme: profileConfig.theme,
  themeDisplayMode: "variants-only",
  themeVariants: {
    minimal: {
      tokens: {
        accent: "#0EA5E9", // cool sky blue
        accentHover: "#06B6D4", // into cyan
        accentSecondary: "#06B6D4", // cyan for secondary accents
        accentTertiary: "#0284C7", // slightly darker blue
        glow: "0 0 20px rgba(6, 182, 212, 0.2)",
        gradient: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
        shadow: "rgba(0, 0, 0, 0.08)",
        borderRadius: "12px",
      } as any,
    } as ThemeOverride,
    warm: {
      /* ... amber-based tokens ... */
    },
    bold: {
      /* ... purple-based tokens ... */
    },
  },
  // ...
};
```

**Verify**: Each variant contains a `tokens` object with a complete set of theme properties. ✅ PASSED

---

### Step 2: Prop Tracing

**Status**: ✅ CORRECT FLOW TO COMPONENT

The configuration and display mode flow correctly through the component hierarchy:

**BaseLayout.astro** → **LayoutWrapper** → **ThemeSwitcher**

1. **BaseLayout.astro** [L25-29](src/layouts/BaseLayout.astro#L25-L29):

   ```typescript
   const { theme } = profileConfig;
   const appConfig = getActiveAppConfig();
   const appThemeVariants = appConfig.themeVariants || {};
   // ...
   <LayoutWrapper
     enableStyleSwitcher={theme.enableStyleSwitcher}
     appThemeVariants={appThemeVariants}
     themeDisplayMode={appConfig.themeDisplayMode}
   >
   ```

   Props correctly extracted and passed. ✅

2. **LayoutWrapper.tsx** [](src/components/islands/LayoutWrapper.tsx#L17-L25):

   ```typescript
   export default function LayoutWrapper({
     children,
     appThemeVariants = {},
     themeDisplayMode = 'mixed'
   }: LayoutWrapperProps) {
     return (
       <ThemeProvider>
         {children}
         {enableStyleSwitcher && <ThemeSwitcher appThemeVariants={appThemeVariants} themeDisplayMode={themeDisplayMode} />}
       </ThemeProvider>
     );
   ```

   Props correctly forwarded. ✅

3. **ThemeSwitcher receives props intact**. ✅

---

### Step 3: Runtime Object State

**Status**: ⚠️ PARTIAL — builds correctly, but breaks on click

ThemeSwitcher **correctly builds** availableThemes object from appThemeVariants when `themeDisplayMode === 'variants-only'`:

**File**: [src/components/islands/ThemeSwitcher.tsx](src/components/islands/ThemeSwitcher.tsx#L31-L49)

```typescript
let availableThemes: Record<string, any> = {};

if (themeDisplayMode === "variants-only") {
  // Show only app-specific variants
  availableThemes = Object.fromEntries(
    Object.entries(appThemeVariants).map(([name, variant]) => [
      name,
      {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} theme`,
        light: variant.tokens || {},
        dark: variant.tokens || {},
      },
    ]),
  );
}
```

**Expected runtime object** (when themeDisplayMode is 'variants-only'):

```javascript
{
  minimal: {
    name: "Minimal",
    description: "Minimal theme",
    light: { accent: "#0EA5E9", ... },
    dark: { accent: "#0EA5E9", ... }
  },
  warm: {
    name: "Warm",
    description: "Warm theme",
    light: { accent: "#D97706", ... },
    dark: { accent: "#D97706", ... }
  },
  bold: {
    name: "Bold",
    description: "Bold theme",
    light: { accent: "#A855F7", ... },
    dark: { accent: "#A855F7", ... }
  }
}
```

**Status**: ✅ This object builds correctly. Dropdown renders 3 buttons: "Minimal", "Warm", "Bold".

---

### Step 4: Token Application — WHERE THE CHAIN BREAKS ❌

**Status**: 🔴 **THIS IS THE BUG**

When user clicks "Minimal" button in ThemeSwitcher, the following happens:

**User Action**: Click "Minimal" button
[src/components/islands/ThemeSwitcher.tsx#L89-93]

```typescript
const handleStyleChange = async (style: ThemeStyle) => {
  try {
    setError(null);
    await setStyleTheme(style); // <-- Calls setStyleTheme('minimal')
    setIsOpen(false);
  } catch (err) {
    /* ... */
  }
};
```

**ThemeContext.setStyleTheme()** is called with `'minimal'`:
[src/context/ThemeContext.tsx#L333-365]

```typescript
const setStyleTheme = useCallback(
  async (style: ThemeStyle): Promise<void> => {
    const validation = validateThemeStyle(style); // <-- Validates 'minimal'
    if (!validation.success) {
      setState((prev) => ({
        ...prev,
        lastError: validation.error || null,
        syncStatus: "error",
      }));
      return; // <-- RETURNS EARLY, THEME NOT UPDATED
    }
    // ... token computation happens here but never reached ...
  },
  [getDeps],
);
```

**validateThemeStyle()** checks if `'minimal'` is in THEME_STYLES:
[src/utils/theme.utils.ts#L28-41]

```typescript
export function validateThemeStyle(
  value: unknown,
): ThemeOperationResult<ThemeStyle> {
  if (isValidThemeStyle(value)) {
    return { success: true, value };
  }

  return {
    success: false,
    error: new ThemeErrorClass(
      "INVALID_STYLE",
      `Invalid theme style: ${String(value)}. Expected one of: ${THEME_STYLES.join(", ")}.`,
    ),
  };
}
```

**isValidThemeStyle()** checks if value is in THEME_STYLES:
[src/utils/theme.types.ts#L77]

```typescript
export function isValidThemeStyle(value: unknown): value is ThemeStyle {
  return THEME_STYLES.includes(value as ThemeStyle);
}
```

**THEME_STYLES is derived from THEME_DEFINITIONS, which only contains global themes:**
[src/utils/theme.config.ts#L408]

```typescript
export const THEME_STYLES = Object.keys(THEME_DEFINITIONS) as ThemeStyle[];
```

**Definition of ThemeStyle type (hardcoded, NOT dynamic):**
[src/utils/theme.config.ts#L5-9]

```typescript
export type ThemeStyle =
  | "minimalist"
  | "modern-tech"
  | "professional"
  | "vaporwave";
```

**THEME_STYLES actual value at runtime**:

```javascript
["minimalist", "modern-tech", "professional", "vaporwave"];
```

**Validation Result**:

```javascript
isValidThemeStyle("minimal"); // 'minimal' NOT in THEME_STYLES
// Returns: false
// Error: "Invalid theme style: minimal. Expected one of: minimalist, modern-tech, professional, vaporwave."
```

**Consequence**:

- ✅ Validates "minimalist", "modern-tech", "professional", "vaporwave" (global themes)
- ❌ Rejects "minimal", "warm", "bold" (app-specific custom variants)
- ✅ setStyleTheme() returns early at line 345 without calling computeTokens() or writeToStorage()
- 📦 **No state update** → theme remains at previous value
- 📦 **No localStorage update** → previously stored theme persists on reload

---

### Step 5: Storage Check

**Status**: 🟡 **BLOCKED ON STEP 4**

Since setStyleTheme() returns early when validation fails, the custom theme is never written to localStorage.

However, if a previous session stored 'vaporwave' or another global theme, it persists:

```javascript
// What gets stored in localStorage when user clicks 'Minimal'
localStorage.getItem("themeStyle");
// Returns: (no change from previous value)
// If previous session had: "vaporwave" → stays "vaporwave"
// If no previous session: defaults to profileConfig.theme.style = "professional"
```

**Expected (but never happens)**:

```javascript
localStorage.setItem("themeStyle", '"minimal"');
```

**Actual**: Theme is not stored because validation fails.

---

## Root Cause Analysis

The theme system architecture assumes all valid themes are global and defined in `THEME_DEFINITIONS`. The validation layer (`validateThemeStyle`, `isValidThemeStyle`, `THEME_STYLES`) hard-codes the union type `ThemeStyle = "minimalist" | "modern-tech" | "professional" | "vaporwave"` and validates against only these four keys.

However, when `themeDisplayMode: 'variants-only'` and custom `appThemeVariants` are provided, the **UI layer (ThemeSwitcher)** correctly builds a dropdown with custom variant keys (minimal, warm, bold) and calls `setStyleTheme()` with these keys. But the **data layer (ThemeContext + ThemeResolver)** rejects them because:

1. The `ThemeStyle` type is a hardcoded union that doesn't include custom variants
2. `isValidThemeStyle()` only accepts keys from the hardcoded `THEME_STYLES` array
3. The custom variant names never reach the resolver
4. No error feedback is shown to the user—validation just silently fails
5. The user sees a UI with three clickable buttons ("Minimal", "Warm", "Bold") that don't work
6. Previously stored themes (like vaporwave) persist because localStorage is never updated
7. Result: **custom variants are unreachable; the app defaults to or persists whatever global theme was previously loaded**

This is a **type system and validation mismatch**. The front-end UI and back-end validation are not aligned on what constitutes a valid theme when custom variants are in use.

---

## Recommendation

**Fix required**: Decouple `ThemeStyle` type and validation from static `THEME_DEFINITIONS`. Accept custom variant keys as valid when `themeDisplayMode` enables variants. Specifically:

1. Pass `appThemeVariants` keys through the entire call chain: `setStyleTheme()` → `validateThemeStyle()` → `isValidThemeStyle()`
2. **Or** dynamically extend `ThemeStyle` union to include custom variant keys (requires type system changes)
3. **Or** change validation to accept any string as a valid theme when operating in variants-only or mixed mode, and let ThemeResolver return a fallback if the theme is not found
4. Pass `appThemeVariants` to `ThemeResolver` so it can merge custom tokens on top of base theme
5. Add error UI to show validation failures (e.g., toast or error banner in ThemeSwitcher)
6. **Do NOT silently fail**—if a theme is invalid, communicate this to the user

**Minimal fix**: Modify [src/context/ThemeContext.tsx](src/context/ThemeContext.tsx) `ThemeProvider` to accept `appThemeVariants` as a prop, pass them to `validateThemeStyle()` and `computeTokens()`, allowing custom variant keys to bypass validation and be resolved by a variant-aware resolver.

---

## QA Coverage Assessment

**Current test coverage**: Zero. The test suite in [tests/ThemeSwitcher.test.tsx](tests/ThemeSwitcher.test.tsx) only tests global themes (minimalist, modern-tech, professional, vaporwave)—4 themes rendered from `THEME_DEFINITIONS`, no tests for `themeDisplayMode: 'variants-only'`, no tests for `appThemeVariants` prop, no tests for custom variant buttons, no tests for theme switching with variants-only mode. The test suite does not catch this bug because the bug only manifests when app provides custom variants in variants-only mode, which is not tested.

**What automated QA would catch this**:

1. **Integration test**: Render ThemeSwitcher with `themeDisplayMode='variants-only'` and 3 custom `appThemeVariants`, click each variant button, assert that the theme is updated in ThemeContext state and localStorage
2. **Snapshot test**: Verify availableThemes object renders the correct keys (minimal, warm, bold) when variants-only mode is active
3. **End-to-end test** (Playwright): Load the page, open theme switcher dropdown, verify 3 custom buttons exist, click "Minimal", verify CSS variables update (e.g., --accent changes to the minimal blue), reload page, assert theme persists
4. **Type safety test**: Use TypeScript strict mode to verify that custom variant keys are accepted by validation/resolver functions under variants-only mode

This bug should have been caught by a basic integration test that provides custom variants and verifies they can be selected and persisted.

---

## Implementation Files Involved

| File                                                                                 | Issue                                                                                                      |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| [apps/artist-engineer/app.config.ts](apps/artist-engineer/app.config.ts)             | ✅ Correctly defines custom variants                                                                       |
| [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro)                         | ✅ Correctly passes props to LayoutWrapper                                                                 |
| [src/components/islands/LayoutWrapper.tsx](src/components/islands/LayoutWrapper.tsx) | ✅ Correctly forwards props to ThemeSwitcher                                                               |
| [src/components/islands/ThemeSwitcher.tsx](src/components/islands/ThemeSwitcher.tsx) | ✅ Correctly builds availableThemes, ❌ calls setStyleTheme with custom key that fails validation          |
| [src/context/ThemeContext.tsx](src/context/ThemeContext.tsx)                         | ❌ Does not accept appThemeVariants; validation rejects custom keys; no error feedback                     |
| [src/utils/theme.utils.ts](src/utils/theme.utils.ts)                                 | ❌ `validateThemeStyle()` only validates against global THEME_STYLES; does not accept custom variants      |
| [src/utils/theme.types.ts](src/utils/theme.types.ts)                                 | ❌ `isValidThemeStyle()` checks against hardcoded THEME_STYLES; no mechanism for dynamic variant extension |
| [src/utils/theme.config.ts](src/utils/theme.config.ts)                               | ⚠️ `ThemeStyle` type is hardcoded union; `THEME_STYLES` derived from global THEME_DEFINITIONS only         |
| [src/core/theme/ThemeResolver.ts](src/core/theme/ThemeResolver.ts)                   | ❌ Does not accept appThemeVariants; resolveTheme() only looks up from THEME_DEFINITIONS                   |
| Tests: [tests/ThemeSwitcher.test.tsx](tests/ThemeSwitcher.test.tsx)                  | ❌ No tests for custom variants; no tests for variants-only mode                                           |
