import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useThemeStore, getThemeStore } from '@fachada/core';
import { THEME_DEFINITIONS } from '@fachada/core';
import type { AppThemes } from '@fachada/core';

// ─── Shared test fixtures ─────────────────────────────────────────────────────

const minimalAppThemes: AppThemes = {
  globals: ['minimalist', 'modern-tech'],
  default: 'minimalist',
};

/** Baseline data-only state (actions remain from the store) */
const INITIAL_DATA = {
  tokens: THEME_DEFINITIONS['minimalist'].light,
  styleTheme: 'minimalist',
  colorMode: 'auto' as const,
  effectiveColorMode: 'light' as const,
  availableThemes: [] as string[],
  customThemePool: {} as Record<string, unknown>,
};

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

describe('themeStore', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Reset store data fields to defaults (actions are preserved by Zustand merge)
    useThemeStore.setState(INITIAL_DATA as any);

    // Mock localStorage
    localStorageMock = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key] ?? null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value;
        },
        removeItem: (key: string) => {
          delete localStorageMock[key];
        },
        clear: () => {
          localStorageMock = {};
        },
        length: 0,
        key: (i: number) => Object.keys(localStorageMock)[i] ?? null,
      },
      writable: true,
    });

    // Mock matchMedia — returns light by default
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Clear document CSS vars
    document.documentElement.style.cssText = '';

    // Clear any window theme pool
    delete (window as any).__FACHADA_THEME_POOL__;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ─── B1: initFromEnvironment resolves tokens and writes CSS vars ──────────────

  describe('B1: initFromEnvironment resolves tokens and writes CSS vars to document.documentElement', () => {
    it('resolves default theme tokens and writes --bg-primary to the document root', () => {
      // Given: a fresh store and no persisted state
      // When: initFromEnvironment is called with minimalAppThemes
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // Then: tokens are resolved from 'minimalist' light
      const state = useThemeStore.getState();
      expect(state.tokens).toBeDefined();
      expect(state.styleTheme).toBe('minimalist');
      expect(state.tokens.bgPrimary).toBe(THEME_DEFINITIONS['minimalist'].light.bgPrimary);

      // And: the CSS var is written to the document root
      const bgPrimary = document.documentElement.style.getPropertyValue('--bg-primary');
      expect(bgPrimary).toBe(THEME_DEFINITIONS['minimalist'].light.bgPrimary);
    });

    it('sets availableThemes from appThemes.globals', () => {
      // Given: appThemes with two globals
      // When: initFromEnvironment is called
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // Then: availableThemes contains both globals
      const state = useThemeStore.getState();
      expect(state.availableThemes).toContain('minimalist');
      expect(state.availableThemes).toContain('modern-tech');
    });
  });

  // ─── B2: setStyleTheme updates styleTheme and CSS vars ───────────────────────

  describe('B2: setStyleTheme updates styleTheme, re-resolves tokens, writes CSS vars', () => {
    it('updates styleTheme to modern-tech and writes its light-mode --bg-primary', () => {
      // Given: store initialized with minimalist
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // When: setStyleTheme called with 'modern-tech'
      getThemeStore().setStyleTheme('modern-tech');

      // Then: styleTheme is updated in state
      const state = useThemeStore.getState();
      expect(state.styleTheme).toBe('modern-tech');

      // And: tokens match modern-tech light
      const expectedBg = THEME_DEFINITIONS['modern-tech'].light.bgPrimary;
      expect(state.tokens.bgPrimary).toBe(expectedBg);

      // And: CSS var is updated on the document root
      const cssVar = document.documentElement.style.getPropertyValue('--bg-primary');
      expect(cssVar).toBe(expectedBg);
    });
  });

  // ─── B3: setColorMode updates colorMode and effectiveColorMode ───────────────

  describe('B3: setColorMode updates colorMode, effectiveColorMode, and resolves tokens', () => {
    it('switches to dark mode, resolves dark tokens, and writes dark CSS vars', () => {
      // Given: store initialized in light mode
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // When: setColorMode called with 'dark'
      getThemeStore().setColorMode('dark');

      // Then: colorMode and effectiveColorMode are updated
      const state = useThemeStore.getState();
      expect(state.colorMode).toBe('dark');
      expect(state.effectiveColorMode).toBe('dark');

      // And: tokens use minimalist dark
      const expectedBg = THEME_DEFINITIONS['minimalist'].dark.bgPrimary;
      expect(state.tokens.bgPrimary).toBe(expectedBg);

      // And: CSS var reflects dark token
      const cssVar = document.documentElement.style.getPropertyValue('--bg-primary');
      expect(cssVar).toBe(expectedBg);
    });

    it('resolves auto mode to dark when matchMedia reports dark preference', () => {
      // Given: matchMedia says dark
      vi.mocked(window.matchMedia).mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      getThemeStore().initFromEnvironment(minimalAppThemes);

      // When: setColorMode called with 'auto'
      getThemeStore().setColorMode('auto');

      // Then: effectiveColorMode resolves to dark
      const state = useThemeStore.getState();
      expect(state.colorMode).toBe('auto');
      expect(state.effectiveColorMode).toBe('dark');
    });
  });

  // ─── B4: localStorage persistence round-trip ─────────────────────────────────

  describe('B4: styleTheme and colorMode are persisted to localStorage and restored on init', () => {
    it('persists styleTheme to localStorage when setStyleTheme is called', () => {
      // Given: initialized store
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // When: setStyleTheme is called
      getThemeStore().setStyleTheme('modern-tech');

      // Then: the value is JSON-stringified in localStorage
      expect(localStorageMock['themeStyle']).toBe('"modern-tech"');
    });

    it('persists colorMode to localStorage when setColorMode is called', () => {
      // Given: initialized store
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // When: setColorMode is called
      getThemeStore().setColorMode('dark');

      // Then: the value is JSON-stringified in localStorage
      expect(localStorageMock['theme']).toBe('"dark"');
    });

    it('restores styleTheme from localStorage on initFromEnvironment', () => {
      // Given: persisted styleTheme in localStorage
      localStorageMock['themeStyle'] = '"modern-tech"';

      // When: initFromEnvironment is called
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // Then: styleTheme is restored from storage
      expect(useThemeStore.getState().styleTheme).toBe('modern-tech');
    });

    it('restores colorMode from localStorage on initFromEnvironment', () => {
      // Given: persisted dark colorMode in localStorage
      localStorageMock['theme'] = '"dark"';

      // When: initFromEnvironment is called
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // Then: colorMode and effectiveColorMode are restored
      const state = useThemeStore.getState();
      expect(state.colorMode).toBe('dark');
      expect(state.effectiveColorMode).toBe('dark');
    });

    it('ignores unknown styleTheme values from localStorage', () => {
      // Given: invalid value in localStorage
      localStorageMock['themeStyle'] = '"not-a-real-theme"';

      // When: initFromEnvironment is called
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // Then: default theme is used
      expect(useThemeStore.getState().styleTheme).toBe('minimalist');
    });
  });

  // ─── B5: reads window.__FACHADA_THEME_POOL__ ─────────────────────────────────

  describe('B5: initFromEnvironment reads window.__FACHADA_THEME_POOL__', () => {
    it('includes custom themes from window.__FACHADA_THEME_POOL__ in availableThemes and customThemePool', () => {
      // Given: a custom theme pool set on window
      const customPool = {
        'custom-theme': {
          name: 'Custom Theme',
          description: 'A test custom theme',
          light: { ...THEME_DEFINITIONS.minimalist.light, bgPrimary: '#CUSTOM01' },
          dark: { ...THEME_DEFINITIONS.minimalist.dark, bgPrimary: '#CUSTOM02' },
        },
      };
      (window as any).__FACHADA_THEME_POOL__ = customPool;

      // When: initFromEnvironment is called (custom-theme NOT in appThemes.globals)
      getThemeStore().initFromEnvironment({ globals: ['minimalist'], default: 'minimalist' });

      // Then: custom-theme is available
      const state = useThemeStore.getState();
      expect(state.availableThemes).toContain('custom-theme');
      expect(state.customThemePool['custom-theme']).toBeDefined();
    });

    it('allows switching to a custom theme from the window pool', () => {
      // Given: custom theme with distinctive bgPrimary
      const customBg = '#WINDOWPOOL1';
      (window as any).__FACHADA_THEME_POOL__ = {
        'window-custom': {
          name: 'Window Custom',
          description: 'From window pool',
          light: { ...THEME_DEFINITIONS.minimalist.light, bgPrimary: customBg },
          dark: { ...THEME_DEFINITIONS.minimalist.dark },
        },
      };

      getThemeStore().initFromEnvironment({ globals: ['minimalist'], default: 'minimalist' });

      // When: we switch to the window pool theme
      getThemeStore().setStyleTheme('window-custom');

      // Then: tokens use the window pool's light bgPrimary
      expect(useThemeStore.getState().tokens.bgPrimary).toBe(customBg);
    });
  });

  // ─── B6: SSR safety ──────────────────────────────────────────────────────────

  describe('B6: Store is SSR-safe — initFromEnvironment is a no-op when typeof window === undefined', () => {
    it('does not update state when window is undefined', () => {
      // Given: store at default state, window removed to simulate SSR
      const styleThemeBefore = useThemeStore.getState().styleTheme;
      const availableThemesBefore = useThemeStore.getState().availableThemes.length;

      const savedWindow = globalThis.window;
      // @ts-expect-error — intentionally removing window to simulate SSR
      delete globalThis.window;

      try {
        // When: initFromEnvironment is called without window
        useThemeStore.getState().initFromEnvironment(minimalAppThemes);
      } finally {
        // Restore window so subsequent tests work
        // @ts-expect-error — restoring window after SSR simulation
        globalThis.window = savedWindow;
      }

      // Then: store state is unchanged
      const state = useThemeStore.getState();
      expect(state.styleTheme).toBe(styleThemeBefore);
      expect(state.availableThemes.length).toBe(availableThemesBefore);
    });
  });

  // ─── getThemeStore accessor ───────────────────────────────────────────────────

  describe('getThemeStore() accessor', () => {
    it('returns the current store state and actions for use outside React', () => {
      // Given: initialized store
      getThemeStore().initFromEnvironment(minimalAppThemes);

      // When: getThemeStore() is called outside a React component
      const state = getThemeStore();

      // Then: state fields are accessible
      expect(typeof state.styleTheme).toBe('string');
      expect(typeof state.setStyleTheme).toBe('function');
      expect(typeof state.setColorMode).toBe('function');
      expect(typeof state.initFromEnvironment).toBe('function');
    });
  });

  // ─── B8: re-init overwrites themeLayoutsMap ───────────────────────────────────

  describe('B8: re-init overwrites themeLayoutsMap with new value', () => {
    it('re-init overwrites themeLayoutsMap with new value', () => {
      // Given: first init with a layouts map
      const firstLayouts = { minimal: { hero: 'split' } };
      getThemeStore().initFromEnvironment(
        { default: 'minimalist', globals: ['minimalist'] },
        undefined,
        firstLayouts,
      );
      expect(useThemeStore.getState().themeLayoutsMap).toEqual(firstLayouts);

      // When: second init with a completely different layouts map
      const secondLayouts = { warm: { hero: 'centered' } };
      getThemeStore().initFromEnvironment(
        { default: 'minimalist', globals: ['minimalist'] },
        undefined,
        secondLayouts,
      );

      // Then: themeLayoutsMap is the second value (second call wins)
      expect(useThemeStore.getState().themeLayoutsMap).toEqual(secondLayouts);

      // And: getActiveThemeLayout with styleTheme='warm' returns the warm entry
      useThemeStore.setState({ styleTheme: 'warm' } as any);
      expect(useThemeStore.getState().getActiveThemeLayout()).toEqual({ hero: 'centered' });
    });
  });

  // ─── B10: deduplicates availableThemes when custom key collides with global key ─

  describe('B10: deduplicates availableThemes when custom key collides with global key', () => {
    it('deduplicates availableThemes when custom key collides with global key', () => {
      // Given: globals includes 'minimalist' AND custom pool also provides a 'minimalist' key
      // (This can happen when a project re-exports a built-in theme under the same name.)
      const collisionPool = {
        // custom version wins in the render pool (customThemePool overrides THEME_DEFINITIONS)
        minimalist: THEME_DEFINITIONS['minimalist'],
      };

      // When: initFromEnvironment with overlapping key between globals and customThemePool
      getThemeStore().initFromEnvironment(
        { default: 'minimalist', globals: ['minimalist'] },
        collisionPool,
      );

      // Then: 'minimalist' appears exactly once in availableThemes (Set deduplication)
      const { availableThemes } = useThemeStore.getState();
      const count = availableThemes.filter((t) => t === 'minimalist').length;
      expect(count).toBe(1);
    });
  });
});
