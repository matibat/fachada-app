import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import ThemeToggle from '@fachada/core/components/islands/ThemeToggle';
import { useTheme, useThemeActions } from '@fachada/core/context/ThemeContext';
import { THEME_DEFINITIONS } from '@fachada/core/utils/theme.config';
import { useThemeStore, getThemeStore } from '@fachada/core/stores/themeStore';

const mockAppThemes = { default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) };

// Helper renders ThemeToggle without a ThemeProvider wrapper;
// state is managed via Zustand store initialized in beforeEach.
function ThemeToggleWithProvider() {
    return <ThemeToggle />;
}

describe('ThemeToggle Component', () => {
    beforeEach(() => {
        // Clear localStorage and reset DOM
        localStorage.clear();
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
        // Mock matchMedia for system preference detection
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: query === '(prefers-color-scheme: dark)' ? false : false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
        getThemeStore().initFromEnvironment(mockAppThemes);
    });

    afterEach(() => {
        cleanup();
    });

    it('should render toggle button', () => {
        render(<ThemeToggleWithProvider />);
        const button = screen.getByRole('button');
        expect(button).toBeDefined();
    });

    it('should display light mode icon initially', async () => {
        render(<ThemeToggleWithProvider />);

        // Wait for context initialization
        await waitFor(() => {
            const svgs = screen.getByRole('button').querySelectorAll('svg');
            expect(svgs.length).toBe(1);
        });
    });

    it('should toggle color modes as light ↔ dark when clicked', async () => {
        render(<ThemeToggleWithProvider />);
        const button = screen.getByRole('button');

        // Initial state - starts in auto with effective light
        await waitFor(() => {
            const label = button.getAttribute('aria-label');
            expect(label).toContain('Current mode: auto');
        }, { timeout: 1000 });

        // First click: auto(effective light) → dark
        fireEvent.click(button);
        await waitFor(() => {
            expect(localStorage.getItem('theme')).toBe('"dark"');
        }, { timeout: 2000 });

        // Second click: dark → light
        fireEvent.click(button);
        await waitFor(() => {
            expect(localStorage.getItem('theme')).toBe('"light"');
        }, { timeout: 2000 });
    });

    it('should have accessible aria-label with current and next mode', async () => {
        render(<ThemeToggleWithProvider />);
        const button = screen.getByRole('button');

        await waitFor(() => {
            const label = button.getAttribute('aria-label');
            expect(label).toContain('Current mode:');
            expect(label).toContain('Switch to');
        }, { timeout: 1000 });
    });

    it('should update aria-label when mode changes', async () => {
        render(<ThemeToggleWithProvider />);
        const button = screen.getByRole('button');

        // Initial state should show auto with resolved mode
        await waitFor(() => {
            const label = button.getAttribute('aria-label');
            expect(label).toContain('Current mode: auto');
        }, { timeout: 1000 });

        // Click to change to dark mode
        fireEvent.click(button);
        await waitFor(() => {
            const label = button.getAttribute('aria-label');
            expect(label).toContain('Current mode: dark');
        }, { timeout: 2000 });
    });

    it('should show dark mode icon when in dark mode', async () => {
        localStorage.setItem('theme', '"dark"');
        render(<ThemeToggleWithProvider />);

        await waitFor(() => {
            // Dark mode should show sun icon
            const button = screen.getByRole('button');
            const paths = button.querySelectorAll('path');
            expect(paths.length).toBeGreaterThan(0);
        }, { timeout: 1000 });
    });

    it('should display effective color mode when in auto mode', async () => {
        localStorage.setItem('theme', '"auto"');
        render(<ThemeToggleWithProvider />);

        await waitFor(() => {
            // Should render without error and show a mode icon
            const button = screen.getByRole('button');
            expect(button).toBeDefined();
            const label = button.getAttribute('aria-label');
            expect(label).toContain('Current mode: auto');
        }, { timeout: 1000 });
    });

    // ────────────────────────────────────────────────────────────────────────
    // BDD: clicking the toggle must apply the new color mode to the page
    // Theme is propagated via SCThemeProvider (props.theme), not DOM class
    // mutation.  We verify the behavior contract via aria-label + localStorage.
    // ────────────────────────────────────────────────────────────────────────
    describe('Behavior: clicking toggle applies color mode to the page', () => {
        it('Given: mode is light, When: toggle clicked (→ dark), Then: color mode becomes dark', async () => {
            localStorage.setItem('theme', JSON.stringify('light'));
            getThemeStore().initFromEnvironment(mockAppThemes);
            render(<ThemeToggleWithProvider />);

            const button = screen.getByRole('button');
            await waitFor(() => {
                expect(button.getAttribute('aria-label')).toContain('Current mode: light');
            });

            fireEvent.click(button); // light → dark

            await waitFor(() => {
                expect(button.getAttribute('aria-label')).toContain('Current mode: dark');
            });
            expect(localStorage.getItem('theme')).toBe('"dark"');
        });

        it('Given: mode is dark, When: toggle clicked (→ light), Then: color mode becomes light', async () => {
            localStorage.setItem('theme', JSON.stringify('dark'));
            getThemeStore().initFromEnvironment(mockAppThemes);
            render(<ThemeToggleWithProvider />);

            const button = screen.getByRole('button');
            await waitFor(() => {
                expect(button.getAttribute('aria-label')).toContain('Current mode: dark');
            });

            fireEvent.click(button); // dark → light

            await waitFor(() => {
                expect(button.getAttribute('aria-label')).toContain('Current mode: light');
            });
            expect(localStorage.getItem('theme')).toBe('"light"');
        });
    });

    // ────────────────────────────────────────────────────────────────────────
    // BDD: activeTokens reflect theme switches
    // A ThemeConsumer reads useTheme().activeTokens and displays values in
    // data-testid divs. Assertions compare against THEME_DEFINITIONS expected values.
    // ────────────────────────────────────────────────────────────────────────
    describe('Behavior: activeTokens reflect theme switches', () => {
        function ThemeConsumer() {
            const { activeTokens } = useTheme();
            return (
                <>
                    <div data-testid="active-tokens-accent">{activeTokens.accent}</div>
                    <div data-testid="active-tokens-bg-primary">{activeTokens.bgPrimary}</div>
                </>
            );
        }

        function ThemeActionButtons() {
            const { setColorMode, setStyleTheme } = useThemeActions();
            return (
                <>
                    <button data-testid="action-set-dark" onClick={() => setColorMode('dark')}>Dark</button>
                    <button data-testid="action-set-light" onClick={() => setColorMode('light')}>Light</button>
                    <button data-testid="action-set-modern-tech" onClick={() => setStyleTheme('modern-tech')}>Modern Tech</button>
                </>
            );
        }

        function ToggleWithConsumer() {
            return (
                <>
                    <ThemeToggle />
                    <ThemeConsumer />
                    <ThemeActionButtons />
                </>
            );
        }

        it('Given: ThemeToggle in minimalist light, When: setColorMode("dark") called, Then: activeTokens.bgPrimary matches THEME_DEFINITIONS.minimalist.dark.bgPrimary', async () => {
            render(<ToggleWithConsumer />);

            await waitFor(() => {
                expect(screen.getByTestId('active-tokens-bg-primary')).toBeDefined();
            });

            fireEvent.click(screen.getByTestId('action-set-dark'));

            await waitFor(() => {
                expect(screen.getByTestId('active-tokens-bg-primary').textContent)
                    .toBe(THEME_DEFINITIONS.minimalist.dark.bgPrimary);
            });
        });

        it('Given: ThemeToggle, When: setStyleTheme("modern-tech") called, Then: activeTokens.accent matches THEME_DEFINITIONS["modern-tech"].light.accent', async () => {
            render(<ToggleWithConsumer />);

            await waitFor(() => {
                expect(screen.getByTestId('active-tokens-accent')).toBeDefined();
            });

            fireEvent.click(screen.getByTestId('action-set-modern-tech'));

            await waitFor(() => {
                expect(screen.getByTestId('active-tokens-accent').textContent)
                    .toBe(THEME_DEFINITIONS['modern-tech'].light.accent);
            });
        });
    });

    // ────────────────────────────────────────────────────────────────────────
    // BDD: CSS custom properties on document.documentElement must change when
    // color mode or style theme changes.  This is the contract that styled
    // components rely on to apply the correct visual style to every element
    // on the page.  If ThemeProvider never writes CSS vars, all the following
    // tests will be RED — they assert the *observable* output, not just
    // internal React state.
    // ────────────────────────────────────────────────────────────────────────
    describe('Behavior: CSS custom properties reflect color-mode changes', () => {
        it('Given: ThemeToggle initialized with no stored preference, When: provider mounts, Then: --bg-primary CSS var is minimalist light bgPrimary', async () => {
            render(<ThemeToggleWithProvider />);

            await waitFor(() => {
                expect(screen.getByRole('button').getAttribute('aria-label')).toContain('auto');
            });

            expect(document.documentElement.style.getPropertyValue('--bg-primary'))
                .toBe(THEME_DEFINITIONS.minimalist.light.bgPrimary);
        });

        it('Given: ThemeToggle in auto mode, When: click switches to dark, Then: --bg-primary becomes minimalist dark value', async () => {
            render(<ThemeToggleWithProvider />);
            const button = screen.getByRole('button');

            // auto(effective light) → dark
            fireEvent.click(button);
            await waitFor(() =>
                expect(button.getAttribute('aria-label')).toContain('Current mode: dark'),
            );

            expect(document.documentElement.style.getPropertyValue('--bg-primary'))
                .toBe(THEME_DEFINITIONS.minimalist.dark.bgPrimary);
        });

        it('Given: dark mode stored in localStorage, When: ThemeToggle mounts, Then: --bg-secondary CSS var is minimalist dark bgSecondary', async () => {
            localStorage.setItem('theme', JSON.stringify('dark'));
            getThemeStore().initFromEnvironment(mockAppThemes);
            render(<ThemeToggleWithProvider />);

            await waitFor(() =>
                expect(screen.getByRole('button').getAttribute('aria-label')).toContain('Current mode: dark'),
            );

            expect(document.documentElement.style.getPropertyValue('--bg-secondary'))
                .toBe(THEME_DEFINITIONS.minimalist.dark.bgSecondary);
        });

        it('Given: ThemeToggle in dark mode, When: switch to light, Then: --text-primary CSS var reverts to light theme value', async () => {
            localStorage.setItem('theme', JSON.stringify('dark'));
            getThemeStore().initFromEnvironment(mockAppThemes);
            render(<ThemeToggleWithProvider />);
            const button = screen.getByRole('button');

            await waitFor(() => expect(button.getAttribute('aria-label')).toContain('dark'));

            // dark → light
            fireEvent.click(button);
            await waitFor(() => expect(button.getAttribute('aria-label')).toContain('light'));

            expect(document.documentElement.style.getPropertyValue('--text-primary'))
                .toBe(THEME_DEFINITIONS.minimalist.light.textPrimary);
        });
    });
});
