import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { useTheme as useSCTheme } from 'styled-components';
import { useThemeStore } from '@fachada/core';
import { THEME_DEFINITIONS } from '@fachada/core';
import type { ThemeTokens } from '@fachada/core';
import { LayoutWrapper } from '@fachada/core';

// ─── Shared setup ─────────────────────────────────────────────────────────────

const INITIAL_DATA = {
    tokens: THEME_DEFINITIONS['minimalist'].light,
    styleTheme: 'minimalist',
    colorMode: 'auto' as const,
    effectiveColorMode: 'light' as const,
    availableThemes: [] as string[],
    customThemePool: {} as Record<string, unknown>,
};

beforeEach(() => {
    useThemeStore.setState(INITIAL_DATA as any);
    delete (window as any).__FACHADA_THEME_POOL__;
    localStorage.clear();
    document.documentElement.style.cssText = '';

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
});

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

// ─── B1: LayoutWrapper calls initFromEnvironment on mount ─────────────────────

describe('B1: LayoutWrapper calls initFromEnvironment on mount with appThemes', () => {
    it('calls initFromEnvironment with an appThemes object containing the defaultTheme on first mount', async () => {
        // Given: store has availableThemes already set (so ThemeProvider fallback does NOT fire)
        useThemeStore.setState({ availableThemes: ['minimalist'] } as any);

        // And: initFromEnvironment is replaced with a spy
        const initSpy = vi.fn();
        useThemeStore.setState({ initFromEnvironment: initSpy } as any);

        // When: LayoutWrapper mounts with defaultTheme='minimalist'
        render(
            <LayoutWrapper defaultTheme="minimalist">
                <div />
            </LayoutWrapper>
        );

        // Then: initFromEnvironment was called by LayoutWrapper's own useEffect
        await waitFor(() => {
            expect(initSpy).toHaveBeenCalled();
        });

        // And: called with an appThemes object whose default is 'minimalist'
        expect(initSpy).toHaveBeenCalledWith(
            expect.objectContaining({ default: 'minimalist' }),
            undefined,
            undefined,
        );
    });

    it('passes the appThemes globals list to initFromEnvironment', async () => {
        // Given: store has availableThemes already set (so ThemeProvider fallback does NOT fire)
        useThemeStore.setState({ availableThemes: ['minimalist'] } as any);

        const initSpy = vi.fn();
        useThemeStore.setState({ initFromEnvironment: initSpy } as any);

        // When: LayoutWrapper mounts
        render(
            <LayoutWrapper defaultTheme="minimalist">
                <div />
            </LayoutWrapper>
        );

        // Then: globals array includes built-in theme names
        await waitFor(() => {
            expect(initSpy).toHaveBeenCalled();
        });
        const [appThemesArg] = initSpy.mock.calls[0];
        expect(Array.isArray(appThemesArg.globals)).toBe(true);
        expect(appThemesArg.globals.length).toBeGreaterThan(0);
    });
});

// ─── B2: Children render inside SC ThemeProvider context ──────────────────────

function SCTokenConsumer() {
    const theme = useSCTheme() as ThemeTokens;
    return <div data-testid="sc-accent">{theme.accent ?? 'none'}</div>;
}

describe('B2: children render inside SC ThemeProvider context after LayoutWrapper is mounted', () => {
    it('renders children so they can access the SC theme context', () => {
        // Given/When: LayoutWrapper mounts with a SC-context consumer child
        const { getByTestId } = render(
            <LayoutWrapper defaultTheme="minimalist">
                <SCTokenConsumer />
            </LayoutWrapper>
        );

        // Then: child rendered and SC theme provided a non-empty accent token
        const el = getByTestId('sc-accent');
        expect(el.textContent).not.toBe('');
        expect(el.textContent).not.toBe('none');
    });

    it('renders arbitrary children inside the provider wrapper', () => {
        // Given/When: LayoutWrapper mounts with a plain child node
        const { getByTestId } = render(
            <LayoutWrapper defaultTheme="minimalist">
                <span data-testid="child-node">hello</span>
            </LayoutWrapper>
        );

        // Then: child is present in the DOM
        expect(getByTestId('child-node').textContent).toBe('hello');
    });
});

// ─── appThemeGlobals prop ──────────────────────────────────────────────────────

describe('appThemeGlobals prop', () => {
    it('passes empty globals to initFromEnvironment when appThemeGlobals is []', async () => {
        // Given: store has availableThemes set (so ThemeProvider fallback does NOT fire)
        useThemeStore.setState({ availableThemes: ['minimalist'] } as any);

        // And: initFromEnvironment is replaced with a spy
        const initSpy = vi.fn();
        useThemeStore.setState({ initFromEnvironment: initSpy } as any);

        // When: LayoutWrapper mounts with appThemeGlobals=[]
        render(
            <LayoutWrapper defaultTheme="minimalist" appThemeGlobals={[]}>
                <div />
            </LayoutWrapper>
        );

        // Then: initFromEnvironment was called by LayoutWrapper's own useEffect
        await waitFor(() => {
            expect(initSpy).toHaveBeenCalled();
        });

        // And: called with globals: [] (F2 fix: appThemeGlobals ?? [] forwarded correctly)
        expect(initSpy.mock.calls[0][0]).toEqual(
            expect.objectContaining({ globals: [] })
        );
    });
});

// ─── F4-missing: themeLayouts forwarded as third arg ──────────────────────────

describe('F4-missing: themeLayouts forwarded as third argument to initFromEnvironment', () => {
    it('passes themeLayouts as third argument to initFromEnvironment', async () => {
        // Given: store has availableThemes set (so ThemeProvider fallback does NOT fire)
        useThemeStore.setState({ availableThemes: ['minimalist'] } as any);

        const initSpy = vi.fn();
        useThemeStore.setState({ initFromEnvironment: initSpy } as any);

        const expectedLayouts = {
            minimal: { hero: 'split', skills: 'grid-3' },
            warm: { hero: 'centered', skills: 'list' },
        };

        // Set themeLayouts on window — the mechanism LayoutWrapper uses to receive layouts
        (window as any).__FACHADA_THEME_LAYOUTS__ = expectedLayouts;

        // When: LayoutWrapper mounts
        render(
            <LayoutWrapper defaultTheme="minimalist">
                <div />
            </LayoutWrapper>
        );

        // Then: initFromEnvironment was called with the themeLayouts object as its third argument
        await waitFor(() => {
            expect(initSpy).toHaveBeenCalled();
        });

        expect(initSpy.mock.calls[0][2]).toEqual(expectedLayouts);
    });
});
