import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useTheme as useSCTheme } from 'styled-components';
import type { ThemeTokens } from '../src/utils/theme.config';
import {
    ThemeProvider,
    useTheme,
    useThemeActions,
    useThemeContext,
} from '../src/context/ThemeContext';

/**
 * Test component that uses useTheme hook
 */
function ThemeStateComponent() {
    const { colorMode, effectiveColorMode, styleTheme, activeTokens, isInitialized, syncStatus, lastError } = useTheme();
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
 * Test component that uses useThemeActions hook
 */
function ThemeActionsComponent() {
    const { setColorMode, setStyleTheme, applyTheme, resetError } = useThemeActions();
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
            <button
                data-testid="apply-theme-btn"
                onClick={() => applyTheme()}
            >
                Apply Theme
            </button>
            <button
                data-testid="reset-error-btn"
                onClick={() => resetError()}
            >
                Reset Error
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
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorageMock = {};
    });

    describe('Behavior 1: Initialize theme on mount', () => {
        it('should initialize with default values when localStorage is empty', async () => {
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('is-initialized').textContent).toBe('true');
            });

            expect(screen.getByTestId('color-mode').textContent).toBe('auto');
            expect(screen.getByTestId('style-theme').textContent).toBe('minimalist');
        });

        it('should load color mode from localStorage', async () => {
            localStorageMock['theme'] = '"dark"';
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('color-mode').textContent).toBe('dark');
            });
        });

        it('should load style theme from localStorage', async () => {
            localStorageMock['themeStyle'] = '"modern-tech"';
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('style-theme').textContent).toBe('modern-tech');
            });
        });

        it('should resolve auto mode to system preference on init', async () => {
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
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('effective-color-mode').textContent).toBe('dark');
            });
        });

        it('should set activeTokens matching the stored colorMode and styleTheme on initialization', async () => {
            localStorageMock['theme'] = '"dark"';
            localStorageMock['themeStyle'] = '"modern-tech"';

            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('is-initialized').textContent).toBe('true');
            });

            // dark modern-tech accent is #00D4FF, bgPrimary is #080C10
            expect(screen.getByTestId('active-accent').textContent).toBe('#00D4FF');
            expect(screen.getByTestId('active-bg-primary').textContent).toBe('#080C10');
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

        it('should update effective color mode when auto is selected', async () => {
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

            const { rerender } = render(
                <div>
                    <ThemeActionsComponent />
                    <ThemeStateComponent />
                </div>,
                { wrapper: TestWrapper }
            );

            fireEvent.click(screen.getByTestId('set-auto-btn'));

            await waitFor(() => {
                rerender(
                    <div>
                        <ThemeActionsComponent />
                        <ThemeStateComponent />
                    </div>
                );
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

        it('should update activeTokens to reflect the new style theme', async () => {
            render(
                <div>
                    <ThemeActionsComponent />
                    <ThemeStateComponent />
                </div>,
                { wrapper: TestWrapper }
            );

            await waitFor(() => {
                expect(screen.getByTestId('is-initialized').textContent).toBe('true');
            });

            fireEvent.click(screen.getByTestId('set-style-btn')); // sets to modern-tech

            await waitFor(() => {
                // light mode modern-tech accent is #0095C8
                expect(screen.getByTestId('active-accent').textContent).toBe('#0095C8');
            });
        });
    });

    describe('Behavior 4: activeTokens reflect colorMode and styleTheme changes', () => {
        it('should produce dark activeTokens when color mode is dark', async () => {
            localStorageMock['theme'] = '"dark"';
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('effective-color-mode').textContent).toBe('dark');
            });

            // minimalist dark accent is #F0EFE8
            expect(screen.getByTestId('active-accent').textContent).toBe('#F0EFE8');
        });

        it('should switch to light activeTokens when color mode changes to light', async () => {
            render(
                <div>
                    <ThemeActionsComponent />
                    <ThemeStateComponent />
                </div>,
                { wrapper: TestWrapper }
            );

            await waitFor(() => {
                expect(screen.getByTestId('is-initialized').textContent).toBe('true');
            });

            fireEvent.click(screen.getByTestId('set-dark-btn'));

            await waitFor(() => {
                expect(screen.getByTestId('effective-color-mode').textContent).toBe('dark');
            });

            fireEvent.click(screen.getByTestId('set-light-btn'));

            await waitFor(() => {
                expect(screen.getByTestId('effective-color-mode').textContent).toBe('light');
                // minimalist light accent is #141414
                expect(screen.getByTestId('active-accent').textContent).toBe('#141414');
            });
        });

        it('should set activeTokens matching the loaded style theme', async () => {
            localStorageMock['themeStyle'] = '"professional"';
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('is-initialized').textContent).toBe('true');
            });

            // professional light accent is #0055FF
            expect(screen.getByTestId('active-accent').textContent).toBe('#0055FF');
        });
    });

    describe('Behavior 8: SCThemeProvider propagates activeTokens as theme', () => {
        it('should provide activeTokens as the styled-components theme', async () => {
            localStorageMock['themeStyle'] = '"modern-tech"';

            render(
                <div>
                    <ThemeStateComponent />
                    <SCThemeConsumer />
                </div>,
                { wrapper: TestWrapper }
            );

            await waitFor(() => {
                expect(screen.getByTestId('is-initialized').textContent).toBe('true');
            });

            // SC theme accent must match context activeTokens accent
            await waitFor(() => {
                expect(screen.getByTestId('sc-accent').textContent).toBe(
                    screen.getByTestId('active-accent').textContent
                );
            });
        });

        it('should update styled-components theme when style changes', async () => {
            render(
                <div>
                    <ThemeActionsComponent />
                    <SCThemeConsumer />
                </div>,
                { wrapper: TestWrapper }
            );

            await waitFor(() => {
                // Initially minimalist light: #141414
                expect(screen.getByTestId('sc-accent').textContent).toBe('#141414');
            });

            fireEvent.click(screen.getByTestId('set-style-btn')); // sets modern-tech

            await waitFor(() => {
                // modern-tech light: #0095C8
                expect(screen.getByTestId('sc-accent').textContent).toBe('#0095C8');
            });
        });
    });

    describe('Behavior 5: Error handling for invalid values', () => {
        it('should handle invalid color mode gracefully', async () => {
            localStorageMock['theme'] = '"invalid"';
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                // Should fall back to default
                expect(screen.getByTestId('color-mode').textContent).toBe('auto');
            });
        });

        it('should handle invalid style theme gracefully', async () => {
            localStorageMock['themeStyle'] = '"invalid"';
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                // Should fall back to default
                expect(screen.getByTestId('style-theme').textContent).toBe('minimalist');
            });
        });
    });

    describe('Behavior 6: Hook usage validation', () => {
        it('useTheme should throw error when used outside provider', () => {
            function BadComponent() {
                useTheme();
                return null;
            }

            expect(() => {
                render(<BadComponent />);
            }).toThrow('useTheme must be used within ThemeProvider');
        });

        it('useThemeActions should throw error when used outside provider', () => {
            function BadComponent() {
                useThemeActions();
                return null;
            }

            expect(() => {
                render(<BadComponent />);
            }).toThrow('useThemeActions must be used within ThemeProvider');
        });

        it('useThemeContext should throw error when used outside provider', () => {
            function BadComponent() {
                useThemeContext();
                return null;
            }

            expect(() => {
                render(<BadComponent />);
            }).toThrow('useThemeContext must be used within ThemeProvider');
        });
    });

    describe('Behavior 7: Sync status tracking', () => {
        it('should start with synced sync status', async () => {
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('sync-status').textContent).toBe('synced');
            });
        });

        it('should be initialized after mount', async () => {
            render(<ThemeStateComponent />, { wrapper: TestWrapper });

            await waitFor(() => {
                expect(screen.getByTestId('is-initialized').textContent).toBe('true');
            });
        });
    });
});
