import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useTheme as useSCTheme } from 'styled-components';
import type { ThemeTokens } from '@fachada/core';
import { THEME_DEFINITIONS } from '@fachada/core';
import { useThemeStore, getThemeStore } from '@fachada/core';
import {
    ThemeProvider,
    useTheme,
    useThemeActions,
    useThemeContext,
} from '@fachada/core';

/**
 * Test component that uses useTheme hook
 */
function ThemeStateComponent() {
    const { colorMode, effectiveColorMode, styleTheme, tokens } = useTheme();
    return (
        <div>
            <div data-testid="color-mode">{colorMode}</div>
            <div data-testid="effective-color-mode">{effectiveColorMode}</div>
            <div data-testid="style-theme">{styleTheme}</div>
            <div data-testid="tokens-accent">{tokens.accent}</div>
            <div data-testid="tokens-bg-primary">{tokens.bgPrimary}</div>
        </div>
    );
}

/**
 * Test component that uses useThemeActions hook
 */
function ThemeActionsComponent() {
    const { setColorMode, setStyleTheme } = useThemeActions();
    return (
        <div>
            <button
                data-testid="set-dark-btn"
                onClick={() => setColorMode('dark')}
            >
                Set Dark
            </button>
            <button
                data-testid="set-light-btn"
                onClick={() => setColorMode('light')}
            >
                Set Light
            </button>
            <button
                data-testid="set-auto-btn"
                onClick={() => setColorMode('auto')}
            >
                Set Auto
            </button>
            <button
                data-testid="set-style-btn"
                onClick={() => setStyleTheme('modern-tech')}
            >
                Set Style
            </button>
        </div>
    );
}

/**
 * Test component that reads the styled-components theme via SC's useTheme
 */
function SCThemeConsumer() {
    const scTheme = useSCTheme() as ThemeTokens;
    return <div data-testid="sc-accent">{scTheme.accent}</div>;
}

/**
 * Test wrapper that renders components inside provider
 */
function TestWrapper({ children }: { children?: ReactNode }) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}

describe('ThemeContext', () => {
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        // Mock localStorage
        localStorageMock = {};
        const localStorageApi = {
            getItem: (key: string) => localStorageMock[key] || null,
            setItem: (key: string, value: string) => {
                localStorageMock[key] = value.toString();
            },
            removeItem: (key: string) => {
                delete localStorageMock[key];
            },
            clear: () => {
                localStorageMock = {};
            },
            length: 0,
            key: (index: number) => Object.keys(localStorageMock)[index] || null,
        };

        Object.defineProperty(window, 'localStorage', {
            value: localStorageApi,
            writable: true,
        });

        // Mock matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches: query.includes('dark') ? false : true,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        // Clear any existing classes/attributes on document element
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('data-theme');
        // Initialize Zustand store from current localStorage mock
        getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorageMock = {};
    });

    describe('Behavior 1: Initialize theme state from environment', () => {
        it('should initialize with default values when localStorage is empty', () => {
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            expect(screen.getByTestId('color-mode').textContent).toBe('auto');
            expect(screen.getByTestId('style-theme').textContent).toBe('minimalist');
        });

        it('should load color mode from localStorage', () => {
            localStorageMock['theme'] = '"dark"';
            getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            expect(screen.getByTestId('color-mode').textContent).toBe('dark');
        });

        it('should load style theme from localStorage', () => {
            localStorageMock['themeStyle'] = '"modern-tech"';
            getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            expect(screen.getByTestId('style-theme').textContent).toBe('modern-tech');
        });

        it('should resolve auto mode to system preference on init', () => {
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

            localStorageMock['theme'] = '"auto"';
            getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            expect(screen.getByTestId('effective-color-mode').textContent).toBe('dark');
        });

        it('should set tokens matching the stored colorMode and styleTheme on initialization', () => {
            localStorageMock['theme'] = '"dark"';
            localStorageMock['themeStyle'] = '"modern-tech"';
            getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });

            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // dark modern-tech accent is #00D4FF, bgPrimary is #080C10
            expect(screen.getByTestId('tokens-accent').textContent).toBe('#00D4FF');
            expect(screen.getByTestId('tokens-bg-primary').textContent).toBe('#080C10');
        });
    });

    describe('Behavior 2: setColorMode updates state and storage', () => {
        it('should update state when setColorMode is called with dark', async () => {
            render(<ThemeActionsComponent />, { wrapper: TestWrapper });

            const button = screen.getByTestId('set-dark-btn');
            fireEvent.click(button);

            await waitFor(() => {
                expect(localStorageMock['theme']).toEqual('"dark"');
            });
        });

        it('should persist light mode to localStorage', async () => {
            render(<ThemeActionsComponent />, { wrapper: TestWrapper });
            fireEvent.click(screen.getByTestId('set-light-btn'));

            await waitFor(() => {
                expect(localStorageMock['theme']).toBe('"light"');
            });
        });

        it('should persist auto mode to localStorage', async () => {
            render(<ThemeActionsComponent />, { wrapper: TestWrapper });
            fireEvent.click(screen.getByTestId('set-auto-btn'));

            await waitFor(() => {
                expect(localStorageMock['theme']).toBe('"auto"');
            });
        });

        it('should update effective color mode when auto is selected with dark preference', async () => {
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

            render(
                <div>
                    <ThemeActionsComponent />
                    <ThemeStateComponent />
                </div>,
                { wrapper: TestWrapper }
            );

            fireEvent.click(screen.getByTestId('set-auto-btn'));

            await waitFor(() => {
                expect(screen.getByTestId('effective-color-mode').textContent).toBe('dark');
            });
        });
    });

    describe('Behavior 3: setStyleTheme updates state and storage', () => {
        it('should persist style theme to localStorage', async () => {
            render(<ThemeActionsComponent />, { wrapper: TestWrapper });
            fireEvent.click(screen.getByTestId('set-style-btn'));

            await waitFor(() => {
                expect(localStorageMock['themeStyle']).toBe('"modern-tech"');
            });
        });

        it('should update tokens to reflect the new style theme', async () => {
            render(
                <div>
                    <ThemeActionsComponent />
                    <ThemeStateComponent />
                </div>,
                { wrapper: TestWrapper }
            );

            fireEvent.click(screen.getByTestId('set-style-btn')); // sets to modern-tech

            await waitFor(() => {
                // light mode modern-tech accent is #0095C8
                expect(screen.getByTestId('tokens-accent').textContent).toBe('#0095C8');
            });
        });
    });

    describe('Behavior 4: tokens reflect colorMode and styleTheme changes', () => {
        it('should produce dark tokens when color mode is dark', () => {
            localStorageMock['theme'] = '"dark"';
            getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            expect(screen.getByTestId('effective-color-mode').textContent).toBe('dark');
            // minimalist dark accent is #F0EFE8
            expect(screen.getByTestId('tokens-accent').textContent).toBe('#F0EFE8');
        });

        it('should switch to light tokens when color mode changes to light', async () => {
            render(
                <div>
                    <ThemeActionsComponent />
                    <ThemeStateComponent />
                </div>,
                { wrapper: TestWrapper }
            );

            fireEvent.click(screen.getByTestId('set-dark-btn'));

            await waitFor(() => {
                expect(screen.getByTestId('effective-color-mode').textContent).toBe('dark');
            });

            fireEvent.click(screen.getByTestId('set-light-btn'));

            await waitFor(() => {
                expect(screen.getByTestId('effective-color-mode').textContent).toBe('light');
                // minimalist light accent is #141414
                expect(screen.getByTestId('tokens-accent').textContent).toBe('#141414');
            });
        });

        it('should set tokens matching the loaded style theme', () => {
            localStorageMock['themeStyle'] = '"professional"';
            getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // professional light accent is #0055FF
            expect(screen.getByTestId('tokens-accent').textContent).toBe('#0055FF');
        });
    });

    describe('Behavior 5: Error handling for invalid values', () => {
        it('should handle invalid color mode gracefully', () => {
            localStorageMock['theme'] = '"invalid"';
            getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // Should fall back to default
            expect(screen.getByTestId('color-mode').textContent).toBe('auto');
        });

        it('should handle invalid style theme gracefully', () => {
            localStorageMock['themeStyle'] = '"invalid"';
            getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // Should fall back to default
            expect(screen.getByTestId('style-theme').textContent).toBe('minimalist');
        });
    });

    describe('Behavior 6: SCThemeProvider propagates tokens as SC theme', () => {
        it('should provide tokens as the styled-components theme', () => {
            localStorageMock['themeStyle'] = '"modern-tech"';
            getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });

            render(
                <div>
                    <ThemeStateComponent />
                    <SCThemeConsumer />
                </div>,
                { wrapper: TestWrapper }
            );

            // SC theme accent must match context tokens accent
            expect(screen.getByTestId('sc-accent').textContent).toBe(
                screen.getByTestId('tokens-accent').textContent
            );
        });

        it('should update styled-components theme when style changes', async () => {
            render(
                <div>
                    <ThemeActionsComponent />
                    <SCThemeConsumer />
                </div>,
                { wrapper: TestWrapper }
            );

            // Initially minimalist light: #141414
            expect(screen.getByTestId('sc-accent').textContent).toBe('#141414');

            fireEvent.click(screen.getByTestId('set-style-btn')); // sets modern-tech

            await waitFor(() => {
                // modern-tech light: #0095C8
                expect(screen.getByTestId('sc-accent').textContent).toBe('#0095C8');
            });
        });
    });
});

// BDD: Validated Zustand migration behaviors
describe('BDD: Zustand migration behaviors', () => {
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        localStorageMock = {};
        const api = {
            getItem: (key: string) => localStorageMock[key] || null,
            setItem: (key: string, value: string) => { localStorageMock[key] = value.toString(); },
            removeItem: (key: string) => { delete localStorageMock[key]; },
            clear: () => { localStorageMock = {}; },
            length: 0,
            key: (index: number) => Object.keys(localStorageMock)[index] || null,
        };
        Object.defineProperty(window, 'localStorage', { value: api, writable: true });
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
        getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('[B1] Given: Zustand store has modern-tech dark tokens, When: useTheme() called, Then: tokens come from Zustand', () => {
        useThemeStore.setState({
            tokens: THEME_DEFINITIONS['modern-tech'].dark,
            styleTheme: 'modern-tech',
            colorMode: 'dark',
            effectiveColorMode: 'dark',
        });
        function Probe() {
            const { tokens } = useTheme();
            return <span data-testid="b1-tokens-accent">{tokens?.accent ?? 'none'}</span>;
        }
        render(<Probe />, { wrapper: TestWrapper });
        expect(screen.getByTestId('b1-tokens-accent').textContent).toBe(THEME_DEFINITIONS['modern-tech'].dark.accent);
    });

    it('[B2] When useThemeActions().setStyleTheme() is called, Zustand store state is updated', () => {
        function Actions() {
            const { setStyleTheme } = useThemeActions();
            return <button onClick={() => setStyleTheme('modern-tech')}>Change</button>;
        }
        render(<Actions />, { wrapper: TestWrapper });
        expect(getThemeStore().styleTheme).toBe('minimalist');
        fireEvent.click(screen.getByText('Change'));
        expect(getThemeStore().styleTheme).toBe('modern-tech');
    });

    it('[B3] ThemeProvider wraps children in SCThemeProvider with active tokens', () => {
        localStorageMock['themeStyle'] = '"professional"';
        getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
        function Consumer() {
            const scTheme = useSCTheme() as ThemeTokens;
            return <span data-testid="b3-sc-accent">{scTheme.accent}</span>;
        }
        render(<Consumer />, { wrapper: TestWrapper });
        expect(screen.getByTestId('b3-sc-accent').textContent).toBe('#0055FF');
    });
});

// ─── B5: ThemeProvider no-op guard on second mount ────────────────────────────

describe('B5: ThemeProvider no-op guard on second mount', () => {
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        localStorageMock = {};
        const api = {
            getItem: (key: string) => localStorageMock[key] || null,
            setItem: (key: string, value: string) => { localStorageMock[key] = value.toString(); },
            removeItem: (key: string) => { delete localStorageMock[key]; },
            clear: () => { localStorageMock = {}; },
            length: 0,
            key: (index: number) => Object.keys(localStorageMock)[index] || null,
        };
        Object.defineProperty(window, 'localStorage', { value: api, writable: true });
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
        // Start with empty availableThemes so the first ThemeProvider mount triggers init
        useThemeStore.setState({ availableThemes: [] } as any);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('ThemeProvider does not re-initialize when store is already populated', async () => {
        // Given: store has empty availableThemes; capture real init and wrap with a spy
        const realInit = useThemeStore.getState().initFromEnvironment;
        const initSpy = vi.fn((...args: Parameters<typeof realInit>) => (realInit as Function)(...args));
        useThemeStore.setState({ initFromEnvironment: initSpy } as any);

        // When: ThemeProvider is mounted for the first time
        const { unmount } = render(<ThemeProvider><div /></ThemeProvider>);

        // Then: initFromEnvironment is called exactly once (availableThemes was empty)
        await waitFor(() => {
            expect(initSpy).toHaveBeenCalledTimes(1);
        });

        // When: unmounted and remounted (simulating a re-render / island remount)
        unmount();
        render(<ThemeProvider><div /></ThemeProvider>);

        // Allow any pending effects to flush
        await waitFor(() => {
            // No additional call expected; waiting ensures effects have had a chance to fire
            expect(initSpy).toHaveBeenCalledTimes(1);
        });

        // Then: initFromEnvironment was called exactly ONCE across both mounts
        expect(initSpy).toHaveBeenCalledTimes(1);
    });
});

// ─── B6: useTheme returns backward-compat fields ──────────────────────────────

describe('B6: useTheme returns backward-compat fields', () => {
    beforeEach(() => {
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
        getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('useTheme returns backward-compat fields', () => {
        let capturedResult: ReturnType<typeof useTheme> | null = null;

        function CompatConsumer() {
            capturedResult = useTheme();
            return null;
        }

        render(<CompatConsumer />, { wrapper: TestWrapper });

        expect(capturedResult).not.toBeNull();
        // activeTokens is an alias for tokens (backward compat)
        expect(capturedResult!.activeTokens).toEqual(capturedResult!.tokens);
        // isInitialized is always true — Zustand store is a module-level singleton
        expect(capturedResult!.isInitialized).toBe(true);
        // syncStatus is always 'synced' (deprecated compat field)
        expect(capturedResult!.syncStatus).toBe('synced');
        // lastError is always null (deprecated compat field)
        expect(capturedResult!.lastError).toBeNull();
    });
});
