import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useThemeStore } from '../src/stores/themeStore';
import { THEME_DEFINITIONS } from '../src/utils/theme.config';
import { resolveWidgetLayout } from '../src/core/widgets/resolveWidgetLayout';
import type { AppThemes } from '../src/types/app.types';
import type { WidgetLayoutConfig } from '../src/types/layout.types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseAppThemes: AppThemes = {
  globals: ['minimalist', 'modern-tech'],
  default: 'minimalist',
};

const testThemeLayouts: Record<string, WidgetLayoutConfig> = {
  minimalist: { skills: 'grid-3', hero: 'centered' },
  'modern-tech': { skills: 'list', hero: 'split' },
};

const INITIAL_DATA = {
  tokens: THEME_DEFINITIONS['minimalist'].light,
  styleTheme: 'minimalist',
  colorMode: 'auto' as const,
  effectiveColorMode: 'light' as const,
  availableThemes: [] as string[],
  customThemePool: {} as Record<string, unknown>,
  themeLayoutsMap: undefined,
};

// ─── Setup / Teardown ────────────────────────────────────────────────────────

describe('themeLayouts', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    useThemeStore.setState(INITIAL_DATA as any);

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

    document.documentElement.style.cssText = '';
    delete (window as any).__FACHADA_THEME_POOL__;
    delete (window as any).__FACHADA_THEME_LAYOUTS__;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ─── B1: initFromEnvironment stores themeLayouts ──────────────────────────

  describe('B1: initFromEnvironment stores themeLayouts in the store', () => {
    it('stores themeLayouts in themeLayoutsMap state field when provided', () => {
      // Given: a theme layouts map
      // When: initFromEnvironment is called with themeLayouts
      useThemeStore.getState().initFromEnvironment(baseAppThemes, undefined, testThemeLayouts);
      // Then: themeLayoutsMap is set in store state
      expect(useThemeStore.getState().themeLayoutsMap).toEqual(testThemeLayouts);
    });

    it('themeLayoutsMap is undefined when no themeLayouts passed', () => {
      // Given: no themeLayouts
      // When: initFromEnvironment is called without themeLayouts
      useThemeStore.getState().initFromEnvironment(baseAppThemes);
      // Then: themeLayoutsMap is undefined
      expect(useThemeStore.getState().themeLayoutsMap).toBeUndefined();
    });
  });

  // ─── B2: getActiveThemeLayout returns layout for active theme ─────────────

  describe('B2: getActiveThemeLayout returns WidgetLayoutConfig for current styleTheme', () => {
    it('returns layout for the active styleTheme (minimalist)', () => {
      // Given: themeLayouts set and styleTheme is 'minimalist'
      useThemeStore.getState().initFromEnvironment(baseAppThemes, undefined, testThemeLayouts);
      // When: getActiveThemeLayout is called
      const layout = useThemeStore.getState().getActiveThemeLayout();
      // Then: returns the minimalist layout
      expect(layout).toEqual({ skills: 'grid-3', hero: 'centered' });
    });

    it('returns different layout when styleTheme is modern-tech', () => {
      // Given: localStorage override to 'modern-tech'
      localStorageMock['themeStyle'] = JSON.stringify('modern-tech');
      useThemeStore.getState().initFromEnvironment(baseAppThemes, undefined, testThemeLayouts);
      // When: getActiveThemeLayout is called
      const layout = useThemeStore.getState().getActiveThemeLayout();
      // Then: returns the modern-tech layout
      expect(layout).toEqual({ skills: 'list', hero: 'split' });
    });
  });

  // ─── B3: getActiveThemeLayout returns undefined for unknown theme ────────

  describe('B3: getActiveThemeLayout returns undefined when no layout for active theme', () => {
    it('returns undefined when themeLayoutsMap is not set', () => {
      // Given: no themeLayouts
      useThemeStore.getState().initFromEnvironment(baseAppThemes);
      // When: getActiveThemeLayout is called
      const layout = useThemeStore.getState().getActiveThemeLayout();
      // Then: undefined
      expect(layout).toBeUndefined();
    });

    it('returns undefined for a theme not present in themeLayouts', () => {
      // Given: styleTheme is 'professional' but layouts only cover minimalist/modern-tech
      useThemeStore.setState({ styleTheme: 'professional', themeLayoutsMap: testThemeLayouts } as any);
      // When: getActiveThemeLayout is called
      const layout = useThemeStore.getState().getActiveThemeLayout();
      // Then: undefined fallback
      expect(layout).toBeUndefined();
    });
  });

  // ─── B3b: getActiveThemeLayout reflects setStyleTheme update ────────────────

  describe('B3b: getActiveThemeLayout reflects setStyleTheme update', () => {
    it('getActiveThemeLayout returns the new layout after setStyleTheme', () => {
      // Given: themeLayouts from artist-engineer covering minimal, warm, bold
      const artistThemeLayouts: Record<string, WidgetLayoutConfig> = {
        minimal: { hero: 'split', skills: 'grid-3', projects: 'grid-2' },
        warm: { hero: 'centered', skills: 'list', projects: 'list' },
        bold: { hero: 'split', skills: 'grid-2', projects: 'grid-3' },
      };
      useThemeStore.getState().initFromEnvironment(baseAppThemes, undefined, artistThemeLayouts);

      // When: styleTheme changes to 'warm'
      // setStyleTheme always applies the new styleTheme in the store even when the theme
      // is not in the built-in pool (tokens fall back to minimalist — that's acceptable here)
      useThemeStore.getState().setStyleTheme('warm');

      // Then: getActiveThemeLayout returns the warm layout (regression sentinel:
      // this test would fail if setStyleTheme stopped updating styleTheme in the store)
      const layout = useThemeStore.getState().getActiveThemeLayout();
      expect(layout).toEqual({ hero: 'centered', skills: 'list', projects: 'list' });
    });
  });

  // ─── B9: resolveWidgetLayout falls back to section default for partial config ─

  describe('B9: resolveWidgetLayout falls back to section default when widget key is missing', () => {
    it('resolveWidgetLayout falls back to section default when widget key is missing', () => {
      // Given: a themeLayouts map where 'warm' only defines 'hero' (not 'skills' or 'projects')
      const partialLayouts: Record<string, WidgetLayoutConfig> = {
        warm: { hero: 'centered' },
      };

      // When: resolving 'skills' for 'warm' — the key is absent from the warm entry
      const result = resolveWidgetLayout('skills', 'grid-3', partialLayouts, 'warm');

      // Then: falls back to the section default ('grid-3'), not undefined
      expect(result).toBe('grid-3');
    });
  });
});
