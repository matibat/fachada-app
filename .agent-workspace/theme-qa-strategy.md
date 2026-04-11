# Comprehensive Test Strategy: Theme System with Custom Variants

## Result Summary

The theme system has a **silent validation failure** that prevents custom app variants from being persisted: UI layer builds correct availableThemes with app-specific variant keys, but ThemeContext validation rejects these keys because `ThemeStyle` is a hardcoded union type containing only global themes. This strategy identifies **7 core test layers** covering configuration flow, prop passing, variant validation, localStorage persistence, and display mode filtering. **The specific test that would catch the current bug**: "When user clicks a variant button in variants-only mode, the selected theme must be persisted to localStorage immediately; this fails because validateThemeStyle() rejects the variant key." Coverage targets include 100% validation paths, 95% component prop combinations, and end-to-end integration scenarios with proper assertions bound to user-facing behavior.

---

## Test Layer Architecture

### Configuration Layer

**What to test**: AppConfig.themeVariants structure, themeDisplayMode values, token object shapes, missing/incomplete variants.

**What should fail**:

- AppConfig with null/undefined themeVariants (should default to {})
- Missing required token keys in variant objects
- Invalid themeDisplayMode values (must be 'variants-only', 'mixed', or 'global-only')
- Broken color token strings (non-hex, invalid formats)

**Acceptance Criteria**:

- ✅ AppConfig with themeVariants parses without errors
- ✅ themeDisplayMode defaults to 'mixed' when not specified
- ✅ Variant tokens are read at static config time (no runtime errors)
- ✅ getActiveAppConfig() returns merged config without warnings
- ✅ Empty themeVariants object is handled gracefully (renders no variant buttons, only globals)

**Test Data Factories Needed**:

- Valid AppConfig: artist-engineer style with minimal/warm/bold each containing full token set
- Minimal AppConfig: variants-only mode with single "test-variant" containing accent + bgPrimary only
- Invalid AppConfig: missing tokens, null values, non-hex colors (should be caught or wrapped in error handling)
- Default AppConfig: themeVariants unspecified (should use empty object)

---

### Component Layer — Prop Flow

**What to test**: Props flow correctly through BaseLayout.astro → LayoutWrapper → ThemeSwitcher; component renders correct UI based on props; display mode correctly filters themes.

**What should fail**:

- appThemeVariants prop is undefined but component still renders without crashing
- themeDisplayMode has invalid value (not 'variants-only' | 'mixed' | 'global-only')
- appThemeVariants contains variant with no tokens property
- Empty appThemeVariants passed to variants-only mode (no buttons render)

**Acceptance Criteria**:

- ✅ ThemeSwitcher renders even when appThemeVariants is undefined or empty
- ✅ When themeDisplayMode='variants-only' and appThemeVariants contains {minimal, warm, bold}, exactly 3 option buttons render (not 4 global + 3 variants)
- ✅ When themeDisplayMode='mixed' and appThemeVariants contains 2 variants, dropdown shows 4 global + 2 variant options (6 total)
- ✅ When themeDisplayMode='global-only', only 4 global theme buttons render regardless of appThemeVariants
- ✅ Variant button text is titlecase (e.g., "Minimal", "Warm", "Bold")
- ✅ activeTokens in context match the selected theme's tokens (live assertion)

**Props Must Bind To Interfaces**:

- Do NOT mock useTheme() or useThemeActions() — test real context behavior
- Do NOT mock localStorage directly in component tests — test actual persistence
- Test the prop chain using real React components, not mocked hooks

---

### Integration Layer — End-to-End User Flows

#### Flow 1: Theme Switch Sequence from Click to localStorage

**Given**: themeDisplayMode='variants-only', appThemeVariants contains {minimal, warm, bold}
**When**: User clicks "Minimal" button → setStyleTheme('minimal') called → context updates → DOM applies tokens
**Then**:

- ✅ Context.styleTheme changes to 'minimal' immediately
- ✅ localStorage['themeStyle'] = "minimal" (persisted)
- ✅ document.documentElement.getAttribute('data-theme') === 'minimal'
- ✅ CSS variable --accent is set to minimal's blue (#0EA5E9)

#### Flow 2: Variant Persistence and Restore on Reload

**Given**: User previously selected and persisted 'warm' theme
**When**: Page reloads
**Then**:

- ✅ localStorage is read correctly
- ✅ ThemeContext initializes with styleTheme='warm'
- ✅ activeTokens contain warm's amber accent (#D97706)
- ✅ UI shows "Warm" as selected (aria-pressed='true')

#### Flow 3: Display Mode Filtering (user-visible outcome)

**Given**: themeDisplayMode changes from 'mixed' to 'variants-only'
**When**: Component re-renders with new displayMode prop
**Then**:

- ✅ Previously visible global theme buttons disappear
- ✅ Only variant buttons remain visible
- ✅ No warnings or errors in console

#### Flow 4: Invalid Stored Theme with Graceful Fallback

**Given**: localStorage['themeStyle'] = "old-variant" but AppConfig has no "old-variant"
**When**: App loads and initializes
**Then**:

- ✅ ThemeContext validation fails on load
- ✅ Fallback occurs to DEFAULT_STYLE_THEME (e.g., 'professional' or first global theme)
- ✅ NOT a random theme (must be deterministic)
- ✅ No partial state (theme is either valid or fully reset to default)

#### Flow 5: Concurrent Theme Switches

**Given**: User rapidly clicks different variant buttons
**When**: Multiple setStyleTheme() calls fire in quick succession
**Then**:

- ✅ Last click wins (FIFO order)
- ✅ Only the final theme is persisted to localStorage
- ✅ No race conditions in state updates
- ✅ localStorage contains exactly one valid theme key

#### Flow 6: Storage Sync Across Tabs

**Given**: App is open in two browser tabs; user selects 'warm' theme in tab 1
**When**: 'storage' event fires in tab 2
**Then**:

- ✅ Tab 2 updates its context.styleTheme to 'warm' without user action
- ✅ activeTokens in tab 2 recompute to warm values
- ✅ UI in tab 2 reflects the switch (button state updates)

---

### Edge Cases

| Edge Case                  | Condition                                                  | Expected Behavior                                                    | Test Assertion                                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| Empty variants             | appThemeVariants = {} with variants-only mode              | Render no variant buttons, show error or message                     | availableThemes.length === 0 OR show placeholder                |
| Missing token              | Variant has accent but missing bgPrimary                   | Either use fallback token or reject variant                          | Fallback is predictable (base theme + override)                 |
| Invalid stored key         | localStorage['themeStyle'] = "nonexistent-theme"           | Fall back to DEFAULT_STYLE_THEME, not random                         | context.styleTheme === DEFAULT_STYLE_THEME                      |
| Concurrent switches        | Click 3 variants in 100ms                                  | Final theme persists, no race condition                              | localStorage has one key, equals final selection                |
| Mode switching             | Switch mode from mixed → variants-only mid-session         | Do NOT reselect theme; if current theme no longer valid, log warning | Display updates, state stays consistent                         |
| Corrupted JSON             | localStorage['themeStyle'] = "not-a-json-string"           | Fallback to default, not crash                                       | context.styleTheme === DEFAULT_STYLE_THEME, no exception thrown |
| Null tokens in variant     | Variant.tokens is null or undefined                        | Treat as empty object {}, use base theme for all keys                | No console errors, fallback to base tokens                      |
| Variant deleted at runtime | AppConfig.themeVariants.minimal is removed between renders | If minimal was selected, fallback on next validation                 | activeTokens do not break, state is valid                       |
| Storage disabled           | localStorage not available (no browser API)                | Graceful degradation, theme stored in memory only                    | Context initializes, no exception on storage calls              |
| Display mode undefined     | themeDisplayMode prop not provided                         | Default to 'mixed' mode                                              | availableThemes contains globals + variants                     |

---

## Test Scenarios (BDD Format)

### Scenario 1: App Variant Button Appears in Switcher When Mode is Variants-Only

**Given**:

- AppConfig.themeDisplayMode = 'variants-only'
- AppConfig.themeVariants = { minimal: { tokens: { accent: "#0EA5E9", ... } } }

**When**: ThemeSwitcher component renders with props appThemeVariants and themeDisplayMode

**Then**:

- availableThemes object includes only 'minimal' (no global themes)
- Button with text "Minimal" is rendered in the dropdown
- Button is clickable (not disabled)
- Assertion: `screen.getByText('Minimal')` exists and is a button element

---

### Scenario 2: App Variant is Persisted When Selected ← **THIS CATCHES THE CURRENT BUG**

**Given**:

- AppConfig.themeDisplayMode = 'variants-only'
- AppConfig.themeVariants = { minimal: { tokens: { accent: "#0EA5E9", ... } } }
- ThemeSwitcher renders inside ThemeProvider
- localStorage is initially empty

**When**: User clicks the "Minimal" button in dropdown

**Then**:

- ✅ Immediately: Context.styleTheme changes to 'minimal'
- ✅ Immediately: activeTokens.accent === "#0EA5E9"
- ✅ Within 100ms: localStorage.getItem('themeStyle') === '"minimal"'
- ✅ Dropdown closes
- ✅ **Assertion (this fails with current code)**:
  ```typescript
  await waitFor(
    () => {
      expect(localStorage.getItem("themeStyle")).toBe('"minimal"');
    },
    { timeout: 500 },
  );
  ```
- ✅ **Why this catches the bug**: Current code calls validateThemeStyle('minimal'), which checks if 'minimal' is in THEME_STYLES ([minimalist, modern-tech, professional, vaporwave]). 'minimal' is NOT in this list, so validation fails and setStyleTheme returns early without calling writeToStorage(). localStorage is never updated. Test fails.

---

### Scenario 3: Display Mode Controls What Themes are Visible

**Given**:

- appThemeVariants = { minimal: {...}, warm: {...}, bold: {...} }

**When**: ThemeSwitcher component renders with:

- Test 3a: themeDisplayMode = 'variants-only'
- Test 3b: themeDisplayMode = 'global-only'
- Test 3c: themeDisplayMode = 'mixed'

**Then**:

- Test 3a: Only 3 buttons render ("Minimal", "Warm", "Bold") — no global themes
- Test 3b: Only 4 buttons render ("Minimalist", "Modern Tech", "Professional", "Vaporwave") — no variants
- Test 3c: 7 buttons render (4 global + 3 variants)
- Assertion: `screen.getAllByRole('button').length` matches expected count for each mode

---

### Scenario 4: Invalid Stored Theme Falls Back to Default Without Breaking

**Given**:

- localStorage.setItem('themeStyle', '"invalid-old-theme"')
- AppConfig defines NO variant called "invalid-old-theme"

**When**: App loads and ThemeProvider initializes

**Then**:

- ✅ ThemeContext.styleTheme is set to DEFAULT_STYLE_THEME (not 'invalid-old-theme')
- ✅ No console errors or exceptions
- ✅ activeTokens are computed from DEFAULT_STYLE_THEME (not empty/broken)
- ✅ UI renders without errors
- ✅ Assertion: `context.styleTheme === DEFAULT_STYLE_THEME` AND `context.syncStatus !== 'error'`

---

### Scenario 5: Variant Tokens Override Base Theme Tokens

**Given**:

- Minimal variant has { accent: "#0EA5E9" }
- Base theme (global) has { accent: "#anything-else" }

**When**: User selects 'minimal' and component queries useTheme().activeTokens

**Then**:

- ✅ activeTokens.accent === "#0EA5E9" (variant wins)
- ✅ CSS variable `--accent` on document.documentElement === "#0EA5E9"
- ✅ No fallback to base theme

---

### Scenario 6: Display Mode Change Does Not Reselect Theme

**Given**:

- Current theme is 'professional' (global)
- themeDisplayMode changes from 'mixed' to 'global-only'

**When**: Component re-renders with new displayMode prop

**Then**:

- ✅ Context.styleTheme stays 'professional' (not reset)
- ✅ availableThemes no longer includes any app variants
- ✅ 'professional' button still renders and is still selected
- ✅ No warnings about theme no longer being available

---

### Scenario 7: Empty Variants with Variants-Only Mode Handles Gracefully

**Given**:

- AppConfig.themeVariants = {} (empty object)
- themeDisplayMode = 'variants-only'

**When**: ThemeSwitcher renders

**Then**:

- ✅ availableThemes is empty object
- ✅ No buttons render (or placeholder message appears)
- ✅ No crashes or exceptions
- ✅ User sees clear indication that no themes are available

---

### Scenario 8: Variant with Missing Required Tokens Uses Base Theme Fallback

**Given**:

- Variant "minimal" has tokens = { accent: "#0EA5E9" } (only accent, missing bgPrimary, text, etc.)
- Base theme has all required tokens

**When**: User selects 'minimal'

**Then**:

- ✅ activeTokens.accent === "#0EA5E9" (variant override)
- ✅ activeTokens.bgPrimary === base.bgPrimary (fallback to base)
- ✅ No undefined values in activeTokens
- ✅ Assertion: All keys in activeTokens are defined strings

---

### Scenario 9: Theme Persistence Survives Page Reload (E2E with Playwright)

**Given**:

- User navigates to artist-engineer app
- ThemeSwitcher is visible
- appThemeVariants contains minimal/warm/bold
- themeDisplayMode = 'variants-only'

**When**:

- User clicks "Warm" theme button
- User closes browser tab / reloads page

**Then**:

- ✅ On reload, context initializes with styleTheme='warm'
- ✅ Warm button shows as selected (aria-pressed='true')
- ✅ CSS variable --accent is set to warm's amber (#D97706)
- ✅ Assertion (Playwright): `page.locator('[aria-pressed="true"]').innerHTML` contains "Warm"

---

### Scenario 10: Theme Validation Accepts Custom Variant Keys When Variants-Only is Enabled

**Given**:

- appThemeVariants = { minimal: {...} }
- ThemeSwitcher knows themeDisplayMode = 'variants-only'

**When**: setStyleTheme('minimal') is called

**Then**:

- ✅ validateThemeStyle('minimal') should return success (NOT fail)
- ✅ Context state updates with styleTheme='minimal'
- ✅ localStorage is written
- **This is the core fix needed**: Validation must accept variant keys dynamically, not hardcode them

---

## Test Scenarios Summary Table

| Scenario | Mode        | Given                          | Action           | Expected               | Would Catch Bug? |
| -------- | ----------- | ------------------------------ | ---------------- | ---------------------- | ---------------- |
| 1        | Unit        | variants-only, 3 variants      | render           | 3 buttons appear       | No               |
| 2        | Integration | variants-only, 1 variant       | click variant    | localStorage updated   | **YES** ❌       |
| 3        | Unit        | mixed/variants/global modes    | render with each | correct filters        | No               |
| 4        | Integration | invalid stored theme           | app load         | fallback to default    | No (related)     |
| 5        | Unit        | variant override tokens        | select variant   | variant tokens used    | No               |
| 6        | Integration | mode switches mid-session      | change mode      | theme not reset        | No               |
| 7        | Unit        | empty variants + variants-only | render           | no crash               | No               |
| 8        | Unit        | partial variant tokens         | select           | base fallback          | No               |
| 9        | E2E         | fresh app + variants           | select & reload  | persists across reload | **YES** ❌       |
| 10       | Unit        | custom variant key             | validate         | accept variant key     | **YES** ❌       |

---

## Test Data Factories

### Factory 1: Valid AppConfig with Full Variants

```typescript
// Valid: Artist-Engineer style with 3 complete variants
export const validArtistEngineerConfig: AppConfig = {
  seo: {
    /* ... */
  },
  theme: { enableStyleSwitcher: true, style: "professional" },
  themeDisplayMode: "variants-only",
  themeVariants: {
    minimal: {
      tokens: {
        accent: "#0EA5E9",
        accentHover: "#06B6D4",
        accentSecondary: "#06B6D4",
        accentTertiary: "#0284C7",
        glow: "0 0 20px rgba(6, 182, 212, 0.2)",
        gradient: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
        shadow: "rgba(0, 0, 0, 0.08)",
        borderRadius: "12px",
        bgPrimary: "#FFFFFF",
        bgSecondary: "#F8FAFC",
        text: "#0F172A",
        textMuted: "#64748B",
      },
    },
    warm: {
      tokens: {
        accent: "#D97706",
        accentHover: "#F59E0B",
        accentSecondary: "#F97316",
        accentTertiary: "#DC2626",
        glow: "0 0 20px rgba(217, 119, 6, 0.15)",
        gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
        shadow: "rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        bgPrimary: "#FFFBF0",
        bgSecondary: "#FEF3C7",
        text: "#78350F",
        textMuted: "#92400E",
      },
    },
    bold: {
      tokens: {
        accent: "#A855F7",
        accentHover: "#D946EF",
        accentSecondary: "#D946EF",
        accentTertiary: "#E879F9",
        glow: "0 0 30px rgba(168, 85, 247, 0.25)",
        gradient: "linear-gradient(135deg, #A855F7 0%, #D946EF 100%)",
        shadow: "rgba(0, 0, 0, 0.15)",
        borderRadius: "8px",
        bgPrimary: "#FAF5FF",
        bgSecondary: "#F3E8FF",
        text: "#581C87",
        textMuted: "#7C3AED",
      },
    },
  },
  assets: { ogImage: "..." },
  page: { sections: [] },
};
```

### Factory 2: Minimal AppConfig with Single Variant

```typescript
export const minimalVariantConfig: AppConfig = {
  theme: { enableStyleSwitcher: true, style: "professional" },
  themeDisplayMode: "variants-only",
  themeVariants: {
    test: {
      tokens: {
        accent: "#FF0000",
        bgPrimary: "#FFFFFF",
        text: "#000000",
      },
    },
  },
};
```

### Factory 3: Invalid AppConfig Shapes (Test Error Handling)

```typescript
// Invalid: null tokens
export const nullTokensConfig: AppConfig = {
  theme: { enableStyleSwitcher: true, style: "professional" },
  themeDisplayMode: "variants-only",
  themeVariants: {
    broken: { tokens: null }, // Should error or be wrapped
  },
};

// Invalid: missing variant object
export const missingVariantConfig: AppConfig = {
  theme: { enableStyleSwitcher: true, style: "professional" },
  themeDisplayMode: "variants-only",
  themeVariants: {
    broken: undefined, // Should error or gracefully skip
  },
};

// Invalid: bad display mode
export const badModeConfig: AppConfig = {
  theme: { enableStyleSwitcher: true, style: "professional" },
  themeDisplayMode: "invalid-mode" as any,
  themeVariants: {},
};
```

### Factory 4: localStorage Scenarios for Persistence Tests

```typescript
// Scenario A: Valid variant key in storage
export const localStorageVariantValid = {
  themeStyle: '"minimal"',
  colorMode: '"auto"',
};

// Scenario B: Invalid (nonexistent) variant key
export const localStorageVariantInvalid = {
  themeStyle: '"old-deleted-variant"',
  colorMode: '"auto"',
};

// Scenario C: Corrupted JSON
export const localStorageCorrupted = {
  themeStyle: "not-a-json-string",
  colorMode: "light", // Missing quotes
};

// Scenario D: Empty storage (fresh user)
export const localStorageEmpty = {};
```

---

## Coverage Targets by Layer

### Configuration Layer: 100%

- All paths that read AppConfig must be tested
- Every valid themeDisplayMode value tested
- Every token field in every variant tested
- Edge cases: null/undefined variants, empty objects, missing displayMode

**Target**: 100% statement coverage for config parsing and defaulting logic

### Component Layer (Prop Passing): 95%

- All combinations of appThemeVariants + themeDisplayMode
- availableThemes object generation logic (all 3 modes)
- Button rendering for each theme option
- No mocking of hooks — use real context

**Target**: 95% statement coverage, 100% branch coverage for display mode filtering (all 3 modes require separate branches)

### Theme Validation: 100%

- **CRITICAL**: validateThemeStyle() must accept both:
  - Global theme keys (minimalist, modern-tech, professional, vaporwave)
  - App variant keys (minimal, warm, bold, or any custom name)
- All validation paths must be tested
- Fallback logic when validation fails

**Target**: 100% branch/line coverage for isValidThemeStyle(), validateThemeStyle(), and any dynamic variant checking

### localStorage Persistence: 95%

- Write path: setStyleTheme() → writeToStorage()
- Read path: ThemeProvider init → readFromStorage()
- Corrupt data handling
- Cross-tab storage events
- Storage API unavailable (graceful degradation)

**Target**: 95% coverage (100% if not testing browser storage plugin unavailability)

### Display Mode Filtering: 100%

- Each of 3 modes ('variants-only', 'mixed', 'global-only') must execute distinct code paths
- availableThemes object structure for each mode
- Edge case: mode switch at runtime (does NOT reselect theme)

**Target**: 100% branch coverage (each mode is separate if-block)

### Integration Layer: 90%

- Full user flow: component render → user click → validation → state update → DOM update → localStorage write
- Reset/fallback flows
- Cross-tab synchronization

**Target**: 90% coverage of user-facing flows

### BDD Scenarios: 100%

All 10 scenarios from "Test Scenarios (BDD)" section must have corresponding tests

---

## Current Gaps in Test Coverage

### Tests That Exist (in `/tests/`)

1. ✅ **ThemeSwitcher.test.tsx**: Tests for 4 global themes, button rendering, dropdown open/close, localStorage persistence
2. ✅ **ThemeContext.test.tsx**: Tests for state initialization, color mode switching, activation
3. ✅ **theme.integration.test.tsx**: Tests for end-to-end flows with global themes
4. ✅ **ThemeResolver.test.ts**: Tests theme resolution logic
5. ✅ **theme.utils.test.ts**: Tests utility functions
6. ✅ **theme.visual.test.tsx**: Visual regression tests (if present)

### **Tests That Are MISSING (The Gaps)**

1. ❌ **No tests for appThemeVariants prop\***
   - ThemeSwitcher never receives appThemeVariants in mock data
   - No test for variants-only mode
   - No test for mixed mode with both global + variant options
2. ❌ **No tests for custom variant persistence**
   - Current tests only verify 'professional', 'vaporwave', etc. persist
   - No test for 'minimal', 'warm', 'bold' variant persistence
   - The bug lives in this gap: clicking a variant button leaves no evidence in localStorage

3. ❌ **No tests for display mode filtering**
   - availableThemes object is never tested for correctness
   - No assertion on "when variants-only, only show variants"
   - No assertion on "when global-only, hide variants"

4. ❌ **No tests for invalid variant handling**
   - No test for corrupted variant data
   - No test for variant with missing tokens
   - No test for runtime variant removal

5. ❌ **No tests for validation of custom variant keys**
   - validateThemeStyle() is never called with 'minimal', 'warm', 'bold'
   - No test verifies that custom keys fail validation (which is the root cause)
   - No test verifies that custom keys should pass validation when variants-only is enabled

6. ❌ **No Playwright E2E tests for variant persistence across reload**
   - Integration tests use happy-dom (in-memory)
   - No real browser reload to test localStorage persistence
   - The bug is most visible in E2E: click variant → reload → variant is gone

7. ❌ **No tests for graceful fallback when stored variant becomes invalid**
   - No test for "variant existed when user selected it, but was removed from config"
   - No test for theme becoming unavailable during session

8. ❌ **No tests for prop flow through component hierarchy**
   - BaseLayout.astro → LayoutWrapper → ThemeSwitcher
   - Props should be traceable end-to-end
   - No integration test with Astro components

### **Root Cause of Gap**

The artist-engineer app's custom variants were added **after** the test suite was written. The tests hardcode the 4 global themes for simplicity and never exercise the `appThemeVariants` prop or `themeDisplayMode` configuration. This is a **false negative**: tests pass, but app functionality fails silently at runtime. This is why the bug was not caught.

---

## Specific Test That Would Have Caught This Bug

### Test Case: Custom Variant Persists to localStorage

(This test **FAILS** with current code and **PASSES** after fixing the validation layer)

```typescript
describe('Regression Test: Custom App Variants', () => {
  it('Scenario 2: When user clicks app variant button, theme is persisted to localStorage', async () => {
    // GIVEN: artist-engineer app with variants-only mode and 3 custom variants
    const appConfig: AppConfig = {
      theme: { enableStyleSwitcher: true, style: 'professional' },
      themeDisplayMode: 'variants-only',
      themeVariants: {
        minimal: {
          tokens: {
            accent: "#0EA5E9",
            accentHover: "#06B6D4",
            // ... full token set (simplified for brevity)
          },
        },
        warm: {
          tokens: {
            accent: "#D97706",
            // ... full token set
          },
        },
        bold: {
          tokens: {
            accent: "#A855F7",
            // ... full token set
          },
        },
      },
    };

    // Clear storage for clean slate
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');

    // Render ThemeSwitcher with props from app config
    render(
      <ThemeProvider>
        <ThemeSwitcher
          appThemeVariants={appConfig.themeVariants}
          themeDisplayMode={appConfig.themeDisplayMode}
        />
      </ThemeProvider>
    );

    // WHEN: User opens the theme switcher dropdown
    const toggleButton = screen.getByRole('button', {
      name: /change theme style/i,
    });
    fireEvent.click(toggleButton);

    // WHEN: User clicks the "Minimal" variant button
    await waitFor(() => {
      expect(screen.getByText('Minimal')).toBeDefined();
    });
    fireEvent.click(screen.getByText('Minimal'));

    // THEN: Verify theme is immediately persisted to localStorage
    // *** This assertion FAILS with current code ***
    // *** Because validateThemeStyle('minimal') rejects it (not in hardcoded THEME_STYLES) ***
    await waitFor(
      () => {
        const stored = localStorage.getItem('themeStyle');
        expect(stored).toBe('"minimal"');
      },
      { timeout: 500 }
    );

    // THEN: Verify dropdown closes
    expect(screen.queryByText(/Select Style/i)).toBeNull();

    // THEN: Verify context reflects the theme change
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      ),
    });
    await waitFor(() => {
      expect(result.current.styleTheme).toBe('minimal');
    });

    // THEN: Verify CSS variable is set on document root
    const cssValue = document
      .documentElement
      .style
      .getPropertyValue('--accent')
      .trim();
    expect(cssValue).toBe('#0EA5E9');
  });

  it('E2E: Variant persists across page reload (Playwright)', async ({ page }) => {
    // GIVEN: Artist-Engineer app is loaded
    await page.goto('http://localhost:3000/artist-engineer');

    // WHEN: User selects "Warm" theme from variants-only switcher
    const themeButton = page.getByRole('button', {
      name: /change theme style/i,
    });
    await themeButton.click();
    await page.locator(':text("Warm")').click();

    // WHEN: User reloads the page
    await page.reload();

    // THEN: Warm theme is still selected (persisted across reload)
    // *** This fails with current code ***
    // *** Because 'warm' is rejected by validation on init, fallback to default ***
    const selectedButton = await page
      .locator('button[aria-pressed="true"]')
      .textContent();
    expect(selectedButton).toContain('Warm');

    // THEN: CSS variable reflects warm accent
    const accentColor = await page.locator('html').evaluate(el => {
      return getComputedStyle(el).getPropertyValue('--accent');
    });
    expect(accentColor.trim()).toBe('#D97706');
  });
});
```

### Why This Test Catches the Bug

1. **Test Input**: appThemeVariants contains 'minimal', 'warm', 'bold' (custom keys)
2. **User Action**: Click "Minimal" button
3. **Expected Storage**: localStorage['themeStyle'] = '"minimal"'
4. **Actual (Buggy) Behavior**:
   - ThemeSwitcher calls setStyleTheme('minimal')
   - ThemeContext.setStyleTheme() calls validateThemeStyle('minimal')
   - validateThemeStyle() checks if 'minimal' is in THEME_STYLES
   - THEME_STYLES = ['minimalist', 'modern-tech', 'professional', 'vaporwave']
   - 'minimal' NOT in list → validation fails
   - setStyleTheme() returns early without calling writeToStorage()
   - localStorage is NEVER updated
   - **Test assertion fails**: expected '"minimal"' but got nothing (null or previous value)

5. **Why It's Silent**: No console error, no exception thrown, ThemeSwitcher displays the buttons and accepts clicks, but nothing happens internally

---

## Test Execution Plan

### Phase 1: Setup (1 sprint)

- [ ] Create `/tests/theme-variants.spec.ts` for variant-specific tests
- [ ] Create `/tests/theme-variants.integration.spec.tsx` for integration tests
- [ ] Add mock AppConfig factory to `/tests/__fixtures__/theme-fixtures.ts`
- [ ] Update vitest setup to ensure happy-dom supports CSS variables

### Phase 2: Unit Tests (1-2 sprints)

- [ ] Write Scenario 1-8 unit tests
- [ ] Test availableThemes object generation for each display mode
- [ ] Test prop passing through component hierarchy
- [ ] Mock localStorage for persistence tests

### Phase 3: Integration Tests (1-2 sprints)

- [ ] Write Scenario 9 (persistence across reload)
- [ ] Write Scenario 10 (validation accepts variant keys)
- [ ] Test full user flow: render → click → update → localStorage
- [ ] Test cross-tab storage events
- [ ] Test error handling and fallback

### Phase 4: E2E Tests with Playwright (1 sprint)

- [ ] Write Playwright tests for variant selection and persistence
- [ ] Test real browser reload (not happy-dom in-memory)
- [ ] Verify CSS variables update in real DOM

### Phase 5: Fix Implementation (concurrent with testing)

- [ ] Modify validation layer to accept custom variant keys dynamically
- [ ] Pass appThemeVariants through ThemeContext
- [ ] Update ThemeResolver to merge custom tokens
- [ ] Run all tests to verify fix

### Phase 6: Regression Prevention (1 sprint)

- [ ] Add all 10 scenarios to CI/CD pipeline
- [ ] Set coverage requirements: 100% on validation layer, 95% on component layer
- [ ] Document test maintenance (how to add new variants)
- [ ] Add pre-commit hook to prevent regression

---

## Implementation Checklist for Test Infrastructure

- [ ] Import and configure happy-dom CSS variable support in vitest.config.ts
- [ ] Create test fixture factory: `createAppConfigWithVariants()`
- [ ] Create test fixture factory: `createLocalStorageScenario()`
- [ ] Mock localStorage at test root with helpers for common scenarios
- [ ] Mock document.documentElement for CSS variable assertions
- [ ] Mock matchMedia for color mode tests
- [ ] Add test helpers for waiting on async validation
- [ ] Add helper: `expectLocalStorageTheme(expected: string)`
- [ ] Add helper: `expectContextTheme(expected: ThemeStyle)`
- [ ] Add helper: `expectCSSVariable(varName: string, value: string)`

---

## Risk Assessment

### Critical Risks (Must Fix Before This Strategy Can Pass)

1. **Hardcoded ThemeStyle Union Type**:
   - **Risk**: Type system blocks custom variant keys at compile time
   - **Impact**: Custom keys will always fail validation
   - **Mitigation**: Make ThemeStyle dynamic (pass variants to validation layer) or use any for variant mode

2. **Silent Validation Failure**:
   - **Risk**: No error message when validation fails, just silent fallback
   - **Impact**: Tests must wait for storage updates, which never come
   - **Mitigation**: Add error tracking in context; show error UI in ThemeSwitcher

3. **No Variant Support in ThemeResolver**:
   - **Risk**: ThemeResolver only knows about global THEME_DEFINITIONS
   - **Impact**: Even if validation passes, theme resolution fails
   - **Mitigation**: Pass appThemeVariants to ThemeResolver, merge tokens dynamically

### Medium Risks

4. **Test Documentation**: Developers must understand why tests focus on persistence.md localStorage checks rather than UI changes
5. **Storage API Mocking**: happy-dom may not fully support localStorage; tests may need to mock more carefully

---

## Acceptance Criteria Checklist for Strategy Implementation

- [ ] **Configuration Layer Tests Exist**: All AppConfig shapes tested (valid, invalid, edge cases)
- [ ] **Component Layer Tests Exist**: All 3 display modes tested, prop combinations coverage 95%+
- [ ] **Integration Layer Tests Exist**: Full user flow from click to localStorage, variant persistence, fallback behavior
- [ ] **Edge Cases Documented**: All 12 edge cases have corresponding test scenarios
- [ ] **10 BDD Scenarios Written**: Each scenario includes Given/When/Then, specific assertions, and test data
- [ ] **Regression Test for Bug**: Specific test that would fail with current code but pass after fix
- [ ] **Test Data Factories**: Reusable factories for AppConfig, localStorage scenarios, invalid data
- [ ] **Coverage Targets Met**: Config 100%, validation 100%, component 95%, persistence 95%, display mode 100%, integration 90%
- [ ] **Current Gaps Identified**: Report explicitly lists what tests exist and what is missing
- [ ] **No Mock Leakage**: Tests do NOT mock useTheme/useThemeActions where real behavior matters
- [ ] **CI/CD Integration Ready**: Test suite can run in CI environment (no browser-specific APIs)
- [ ] **Documentation Complete**: Every test scenario has clear purpose and maintenance instructions
