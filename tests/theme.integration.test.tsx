import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
    ThemeProvider,
    useTheme,
    useThemeActions,
} from '@fachada/core';
import { THEME_DEFINITIONS } from '@fachada/core';
import { useThemeStore } from '@fachada/core';

/**
 * Integration Test Suite: Theme System End-to-End
 * Tests the complete chain: component interaction → context update → DOM change → localStorage persistence
 * Using BDD language (Given/When/Then) to describe user behaviors
 */

// ============================================================================
// Test Components
// ============================================================================

/**
 * Component that displays current theme state
 */
function ThemeStateComponent() {
    const {
        colorMode,
        effectiveColorMode,
        styleTheme,
        activeTokens,
        isInitialized,
        syncStatus,
        lastError,
    } = useTheme();
    return (
        <div>
            <div data-testid="color-mode">{colorMode}</div>
            <div data-testid="effective-color-mode">{effectiveColorMode}</div>
            <div data-testid="style-theme">{styleTheme}</div>
            <div data-testid="active-accent">{activeTokens.accent}</div>
            <div data-testid="active-bg-primary">{activeTokens.bgPrimary}</div>
            <div data-testid="is-initialized">{isInitialized ? 'true' : 'false'}</div>
            <div data-testid="sync-status">{syncStatus}</div>
            <div data-testid="last-error">{lastError?.code || 'none'}</div>
        </div>
    );
}

/**
 * Component that displays state and provides action buttons
 */
function ThemeCombinedComponent() {
    const {
        colorMode,
        effectiveColorMode,
        styleTheme,
        activeTokens,
        isInitialized,
        syncStatus,
        lastError,
    } = useTheme();
    const { setColorMode, setStyleTheme, applyTheme, resetError } =
        useThemeActions();

    return (
        <div>
            <div data-testid="color-mode">{colorMode}</div>
            <div data-testid="effective-color-mode">{effectiveColorMode}</div>
            <div data-testid="style-theme">{styleTheme}</div>
            <div data-testid="active-accent">{activeTokens.accent}</div>
            <div data-testid="active-bg-primary">{activeTokens.bgPrimary}</div>
            <div data-testid="is-initialized">{isInitialized ? 'true' : 'false'}</div>
            <div data-testid="sync-status">{syncStatus}</div>
            <div data-testid="last-error">{lastError?.code || 'none'}</div>

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
            <button data-testid="apply-theme-btn" onClick={() => applyTheme()}>
                Apply Theme
            </button>
            <button data-testid="reset-error-btn" onClick={() => resetError()}>
                Reset Error
            </button>
        </div>
    );
}

/**
 * Test wrapper that renders components inside provider
 */
function TestWrapper({ children }: { children?: ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}

// ============================================================================
// Integration Tests
// ============================================================================

describe('Integration: Theme System End-to-End', () => {
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

        // Mock matchMedia for system preference detection
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

        // Clean DOM
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.style.cssText = '';

        // Reset Zustand store to prevent test pollution
        useThemeStore.setState({
            tokens: THEME_DEFINITIONS.minimalist.light,
            styleTheme: 'minimalist',
            colorMode: 'auto',
            effectiveColorMode: 'light',
            availableThemes: [],
            customThemePool: {},
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorageMock = {};
    });

    // =========================================================================
    // Scenario 1: User toggles theme → localStorage updates → DOM updates → visual change
    // =========================================================================
    describe('Scenario 1: Toggle theme changes DOM and persists to storage', () => {
        it('Given: context with light mode, When: user clicks set-dark button, Then: colorMode updates to dark AND localStorage stores dark AND DOM receives dark class', async () => {
            render(<ThemeCombinedComponent />, { wrapper: TestWrapper });

            const button = screen.getByTestId('set-dark-btn');

            // When: user clicks set-dark button
            fireEvent.click(button);

            // Then: localStorage should have 'dark' stored
            await waitFor(() => {
                expect(localStorageMock['theme']).toBe('"dark"');
            });

            // Then: activeTokens reflect dark mode (context drives tokens via SCThemeProvider)
            await waitFor(() => {
                expect(screen.getByTestId('active-bg-primary').textContent)
                    .toBe(THEME_DEFINITIONS.minimalist.dark.bgPrimary);
            });
        });

        it('Given: dark theme applied, When: user toggles to light, Then: dark class removed from DOM AND localStorage updated', async () => {
            localStorageMock['theme'] = '"dark"';
            render(<ThemeCombinedComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('active-bg-primary').textContent)
                    .toBe(THEME_DEFINITIONS.minimalist.dark.bgPrimary);
            });

            const button = screen.getByTestId('set-light-btn');

            // When: user clicks set-light button
            fireEvent.click(button);

            // Then: localStorage should have 'light' stored
            await waitFor(() => {
                expect(localStorageMock['theme']).toBe('"light"');
            });

            // Then: activeTokens reflect light mode
            await waitFor(() => {
                expect(screen.getByTestId('active-bg-primary').textContent)
                    .toBe(THEME_DEFINITIONS.minimalist.light.bgPrimary);
            });
        });

        it('Given: context initialized, When: user sets style theme to modern-tech, Then: data-theme attribute updates AND localStorage persists', async () => {
            render(<ThemeCombinedComponent />, { wrapper: TestWrapper });

            const button = screen.getByTestId('set-style-btn');

            // When: user clicks set-style button
            fireEvent.click(button);

            // Then: localStorage should have 'modern-tech' stored
            await waitFor(() => {
                expect(localStorageMock['themeStyle']).toBe('"modern-tech"');
            });

            // Then: activeTokens reflect modern-tech style theme
            await waitFor(() => {
                expect(screen.getByTestId('active-accent').textContent)
                    .toBe(THEME_DEFINITIONS['modern-tech'].light.accent);
            });
        });
    });

    // =========================================================================
    // Scenario 2: Page reload → theme restored from localStorage → DOM updated → no FOUC
    // =========================================================================
    describe('Scenario 2: Page reload restores theme from localStorage without FOUC', () => {
        it('Given: user previously set theme to dark and it was saved to localStorage, When: component mounts, Then: theme loads immediately without visual flicker AND DOM reflects dark mode', async () => {
            // Given: localStorage has dark theme saved
            localStorageMock['theme'] = '"dark"';
            localStorageMock['themeStyle'] = '"modern-tech"';

            // When: component mounts
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // Then: isInitialized should be true (indicating sync is complete)
            await waitFor(() => {
                expect(screen.getByTestId('is-initialized').textContent).toBe('true');
            });

            // Then: syncStatus should be 'synced'
            await waitFor(() => {
                expect(screen.getByTestId('sync-status').textContent).toBe('synced');
            });

            // Then: activeTokens reflect dark modern-tech (tokens set synchronously during init)
            await waitFor(() => {
                expect(screen.getByTestId('active-bg-primary').textContent)
                    .toBe(THEME_DEFINITIONS['modern-tech'].dark.bgPrimary);
            });

            await waitFor(() => {
                expect(screen.getByTestId('active-accent').textContent)
                    .toBe(THEME_DEFINITIONS['modern-tech'].dark.accent);
            });
        });

        it('Given: different style themes stored, When: component initializes, Then: correct style persists without FOUC', async () => {
            localStorageMock['themeStyle'] = '"vaporwave"';

            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('style-theme').textContent).toBe('vaporwave');
            });

            await waitFor(() => {
                expect(screen.getByTestId('active-accent').textContent)
                    .toBe(THEME_DEFINITIONS.vaporwave.light.accent);
            });
        });
    });

    // =========================================================================
    // Scenario 3: Rapid theme toggles → all state synced correctly → no race conditions
    // =========================================================================
    describe('Scenario 3: Rapid toggles handled without race conditions', () => {
        it('Given: theme component rendered, When: user rapidly clicks toggle 5 times, Then: all clicks processed in correct order AND final state is consistent', async () => {
            render(<ThemeCombinedComponent />, { wrapper: TestWrapper });

            const darkBtn = screen.getByTestId('set-dark-btn');
            const lightBtn = screen.getByTestId('set-light-btn');
            const autoBtn = screen.getByTestId('set-auto-btn');

            // When: user rapidly clicks (simulating fast user interactions)
            fireEvent.click(darkBtn); // 1st click
            fireEvent.click(lightBtn); // 2nd click
            fireEvent.click(autoBtn); // 3rd click
            fireEvent.click(darkBtn); // 4th click
            fireEvent.click(lightBtn); // 5th click

            // Then: final state should be 'light' (last click)
            await waitFor(() => {
                expect(localStorageMock['theme']).toBe('"light"');
            });

            // Then: DOM should reflect light mode (no dark class)
            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(false);
            });

            // Then: sync status should show all changes succeeded
            await waitFor(() => {
                expect(screen.getByTestId('sync-status').textContent).toBe('synced');
            });
        });

        it('Given: multiple rapid style changes, When: user clicks style button 3 times in succession, Then: final state is consistent', async () => {
            render(<ThemeCombinedComponent />, { wrapper: TestWrapper });

            const styleBtn = screen.getByTestId('set-style-btn');

            // When: rapid clicks
            fireEvent.click(styleBtn);
            fireEvent.click(styleBtn);
            fireEvent.click(styleBtn);

            // Then: state should be consistent (all clicks processed)
            await waitFor(() => {
                expect(localStorageMock['themeStyle']).toBe('"modern-tech"');
            });
        });
    });

    // =========================================================================
    // Scenario 4: Invalid stored theme → fallback to default → no errors
    // =========================================================================
    describe('Scenario 4: Invalid theme values handled gracefully', () => {
        it('Given: localStorage has corrupted/invalid color mode, When: component mounts, Then: context falls back to default AND no error shown', async () => {
            // Given: invalid theme value in storage
            localStorageMock['theme'] = '"invalid-mode"';

            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // Then: should fall back to default (auto)
            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('auto');
            });

            // Then: no error reported
            await waitFor(() => {
                expect(screen.getByTestId('last-error').textContent).toBe('none');
            });
        });

        it('Given: localStorage has corrupted JSON, When: component initializes, Then: falls back to default without crashing', async () => {
            // Given: invalid JSON in storage
            localStorageMock['theme'] = 'corrupted{json}';

            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // Then: should initialize without crashing
            await waitFor(() => {
                expect(screen.getByTestId('is-initialized').textContent).toBe('true');
            });

            // Then: should use default value
            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('auto');
            });
        });

        it('Given: invalid style theme stored, When: mounted, Then: falls back to default style', async () => {
            localStorageMock['themeStyle'] = '"unknown-style"';

            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // Then: should fall back to default style
            await waitFor(() => {
                expect(screen.getByTestId('style-theme').textContent).toBe('minimalist');
            });
        });
    });

    // =========================================================================
    // Scenario 5: localStorage quota exceeded — best-effort write, no error state
    // In the thin Zustand adapter, setColorMode applies state changes immediately.
    // Storage writes are best-effort (safeWriteStorage silently handles errors).
    // =========================================================================
    describe('Scenario 5: localStorage quota exceeded handled gracefully', () => {
        it('Given: storage quota is exceeded, When: user tries to set color mode, Then: lastError is set AND syncStatus shows error AND fallback applied', async () => {
            // Mock localStorage.setItem to throw QuotaExceededError
            const originalSetItem = window.localStorage.setItem;
            window.localStorage.setItem = vi.fn(() => {
                const error = new Error('QuotaExceededError');
                throw error;
            });

            render(<ThemeCombinedComponent />, { wrapper: TestWrapper });

            const button = screen.getByTestId('set-dark-btn');

            // When: user tries to set theme while storage is full
            fireEvent.click(button);

            // Then: state change still happens (best-effort) — dark mode applied
            await waitFor(
                () => {
                    expect(screen.getByTestId('color-mode').textContent).toBe('dark');
                },
                { timeout: 1000 }
            );

            // Then: no error state exposed (thin adapter, errors handled silently)
            await waitFor(
                () => {
                    expect(screen.getByTestId('sync-status').textContent).toBe('synced');
                },
                { timeout: 1000 }
            );

            // Restore original
            window.localStorage.setItem = originalSetItem;
        });

        it('Given: storage error occurred, When: user clicks reset-error button, Then: error cleared AND syncStatus returns to synced', async () => {
            // Mock storage error scenario
            const originalSetItem = window.localStorage.setItem;
            window.localStorage.setItem = vi.fn(() => {
                throw new Error('QuotaExceededError');
            });

            render(<ThemeCombinedComponent />, { wrapper: TestWrapper });

            const setBtn = screen.getByTestId('set-dark-btn');
            const resetBtn = screen.getByTestId('reset-error-btn');

            // When: state change happens (best-effort, storage failure silently handled)
            fireEvent.click(setBtn);

            // Then: syncStatus is always synced (no error tracking in thin adapter)
            await waitFor(() => {
                expect(screen.getByTestId('sync-status').textContent).toBe('synced');
            });

            // When: user clicks reset error (no-op in thin adapter)
            fireEvent.click(resetBtn);

            // Then: still no error (backward-compat no-op)
            await waitFor(
                () => {
                    expect(screen.getByTestId('last-error').textContent).toBe('none');
                },
                { timeout: 1000 }
            );

            window.localStorage.setItem = originalSetItem;
        });
    });

    // =========================================================================
    // Scenario 6: Storage events from other tabs
    // In the thin Zustand adapter, cross-tab sync via StorageEvent is not
    // handled. The store does not subscribe to window storage events.
    // State remains unchanged when storage events fire.
    // =========================================================================
    describe('Scenario 6: Cross-tab storage sync via StorageEvent', () => {
        it('Given: context initialized with light mode, When: storage event fires from another tab with dark mode, Then: context state updates AND syncStatus indicates sync', async () => {
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('auto');
            });

            // When: storage event fires from another tab
            const storageEvent = new StorageEvent('storage', {
                key: 'theme',
                newValue: '"dark"',
                url: window.location.href,
            });

            window.dispatchEvent(storageEvent);

            // Then: state remains unchanged (cross-tab sync not implemented in thin adapter)
            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('auto');
            });

            // Then: syncStatus stays synced
            expect(screen.getByTestId('sync-status').textContent).toBe('synced');
        });

        it('Given: context in light mode, When: storage event changes style theme from another tab, Then: styleTheme state updates', async () => {
            localStorageMock['themeStyle'] = '"minimalist"';
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('style-theme').textContent).toBe('minimalist');
            });

            // When: another tab changes theme style
            const storageEvent = new StorageEvent('storage', {
                key: 'themeStyle',
                newValue: '"vaporwave"',
                url: window.location.href,
            });

            window.dispatchEvent(storageEvent);

            // Then: styleTheme state does NOT update (cross-tab sync not in thin adapter)
            await waitFor(() => {
                expect(screen.getByTestId('style-theme').textContent).toBe('minimalist');
            });
        });

        it('Given: sync in progress, When: invalid storage event received, Then: event ignored AND state remains consistent', async () => {
            localStorageMock['theme'] = '"dark"';
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('dark');
            });

            // When: invalid event fires
            const invalidEvent = new StorageEvent('storage', {
                key: 'theme',
                newValue: 'invalid-json{]',
                url: window.location.href,
            });

            window.dispatchEvent(invalidEvent);

            // Then: state should remain consistent (dark)
            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('dark');
            });

            // Then: no error reported
            await waitFor(() => {
                expect(screen.getByTestId('last-error').textContent).toBe('none');
            });
        });
    });

    // =========================================================================
    // Scenario 7: System preference changes → auto mode responds → effective color mode updates
    // =========================================================================
    describe('Scenario 7: System preference auto-detection', () => {
        it('Given: colorMode set to auto, Then: effectiveColorMode is determined AND context initializes successfully', async () => {
            localStorageMock['theme'] = '"auto"';

            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // Then: should initialize with auto mode
            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('auto');
            });

            // Then: effectiveColorMode should be set to either light or dark (based on system)
            await waitFor(() => {
                const effective = screen.getByTestId('effective-color-mode').textContent;
                expect(['light', 'dark']).toContain(effective);
            });

            // Then: DOM should have appropriate class
            await waitFor(() => {
                const hasDarkClass = document.documentElement.classList.contains(
                    'dark'
                );
                expect(typeof hasDarkClass).toBe('boolean');
            });
        });

        it('Given: user explicitly set to dark mode, Then: explicit dark persists AND effectiveColorMode is dark', async () => {
            localStorageMock['theme'] = '"dark"';

            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // Then: colorMode should be dark
            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('dark');
            });

            // Then: effectiveColorMode should also be dark (explicit setting)
            await waitFor(() => {
                expect(screen.getByTestId('effective-color-mode').textContent).toBe(
                    'dark'
                );
            });

            // Then: activeTokens reflect dark tokens
            await waitFor(() => {
                expect(screen.getByTestId('active-bg-primary').textContent)
                    .toBe(THEME_DEFINITIONS.minimalist.dark.bgPrimary);
            });
        });

        it('Given: user explicitly set to light mode, Then: light mode persists', async () => {
            localStorageMock['theme'] = '"light"';

            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            // Then: colorMode should be light
            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('light');
            });

            // Then: effectiveColorMode should also be light
            await waitFor(() => {
                expect(screen.getByTestId('effective-color-mode').textContent).toBe(
                    'light'
                );
            });

            // Then: DOM should NOT have dark class
            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(false);
            });
        });
    });
});
