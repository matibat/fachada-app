/**
 * cross-island-reactivity.test.tsx — B7
 *
 * Validates that multiple independent React component instances (simulating
 * separate Astro islands) share state via the Zustand module-level singleton.
 *
 * IMPORTANT: The real Zustand store is used here — do NOT mock zustand.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useThemeStore } from '@fachada/core/stores/themeStore';
import { THEME_DEFINITIONS } from '@fachada/core/utils/theme.config';

// ─── Shared reset ─────────────────────────────────────────────────────────────

const INITIAL_DATA = {
    tokens: THEME_DEFINITIONS['minimalist'].light,
    styleTheme: 'minimalist',
    colorMode: 'auto' as const,
    effectiveColorMode: 'light' as const,
    availableThemes: [] as string[],
    customThemePool: {} as Record<string, unknown>,
    themeLayoutsMap: undefined,
};

beforeEach(() => {
    useThemeStore.setState(INITIAL_DATA as any);

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

    // Initialize with built-in themes so setStyleTheme has a valid render pool
    useThemeStore.getState().initFromEnvironment({
        default: 'minimalist',
        globals: ['minimalist', 'modern-tech'],
    });
});

afterEach(() => {
    vi.clearAllMocks();
});

// ─── Component that reads styleTheme from the Zustand store ───────────────────

function ThemeDisplay({ id }: { id: string }) {
    const styleTheme = useThemeStore((s) => s.styleTheme);
    return <div data-testid={`theme-display-${id}`}>{styleTheme}</div>;
}

// ─── B7: cross-island Zustand store reactivity ───────────────────────────────

describe('B7: cross-island Zustand store reactivity', () => {
    it('two isolated components share Zustand store state', () => {
        // Given: two independent React component instances each reading styleTheme
        render(<ThemeDisplay id="a" />);
        render(<ThemeDisplay id="b" />);

        // Sanity: both show the initial theme
        expect(screen.getByTestId('theme-display-a').textContent).toBe('minimalist');
        expect(screen.getByTestId('theme-display-b').textContent).toBe('minimalist');

        // When: setStyleTheme is called from outside both components
        // (simulating a third island or event handler updating shared state)
        act(() => {
            useThemeStore.getState().setStyleTheme('modern-tech');
        });

        // Then: BOTH component instances reflect the new styleTheme via the module singleton
        expect(screen.getByTestId('theme-display-a').textContent).toBe('modern-tech');
        expect(screen.getByTestId('theme-display-b').textContent).toBe('modern-tech');
    });
});
