import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeSwitcher from '../src/components/islands/ThemeSwitcher';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { THEME_DEFINITIONS } from '../src/utils/theme.config';

function ThemeSwitcherWithProvider() {
    return (
        <ThemeProvider>
            <ThemeSwitcher />
        </ThemeProvider>
    );
}

describe('ThemeSwitcher Component', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(() => ({
                matches: false,
                media: '',
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            })),
        });
    });

    it('should render theme switcher button', () => {
        render(<ThemeSwitcherWithProvider />);
        const button = screen.getByRole('button', { name: /change theme style/i });
        expect(button).toBeDefined();
    });

    it('should open dropdown when clicked', async () => {
        render(<ThemeSwitcherWithProvider />);
        const button = screen.getByRole('button', { name: /change theme style/i });
        fireEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText(/Select Style/i)).toBeDefined();
        });
    });

    it('should display all 4 theme options in dropdown', async () => {
        render(<ThemeSwitcherWithProvider />);
        fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));
        await waitFor(() => {
            expect(screen.getByText('Minimalist')).toBeDefined();
            expect(screen.getByText('Modern Tech')).toBeDefined();
            expect(screen.getByText('Professional')).toBeDefined();
            expect(screen.getByText('Vaporwave')).toBeDefined();
        });
    });

    it('should close dropdown after selecting a theme', async () => {
        render(<ThemeSwitcherWithProvider />);
        fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));

        await waitFor(() => {
            expect(screen.getByText('Modern Tech')).toBeDefined();
        });

        fireEvent.click(screen.getByText('Modern Tech'));

        await waitFor(() => {
            expect(screen.queryByText(/Select Style/i)).toBeNull();
        });
    });

    it('should persist theme to localStorage', async () => {
        render(<ThemeSwitcherWithProvider />);
        const toggleBtn = screen.getByRole('button', { name: /change theme style/i });
        fireEvent.click(toggleBtn);

        await waitFor(() => {
            const professionalBtn = screen.getByText('Professional');
            fireEvent.click(professionalBtn);
        });

        await waitFor(() => {
            const stored = localStorage.getItem('themeStyle');
            expect(JSON.parse(stored || '')).toBe('professional');
        });
    });

    it('should show active state for theme restored from localStorage', async () => {
        localStorage.setItem('themeStyle', JSON.stringify('vaporwave'));
        render(<ThemeSwitcherWithProvider />);
        fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));

        await waitFor(() => {
            const vaporwaveBtn = screen.getByText('Vaporwave').closest('button');
            expect(vaporwaveBtn?.getAttribute('aria-pressed')).toBe('true');
        });
    });

    it('should handle missing localStorage gracefully', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
        render(<ThemeSwitcherWithProvider />);
        const button = screen.getByRole('button', { name: /change theme style/i });
        expect(button).toBeDefined();
    });

    it('should handle corrupted localStorage data gracefully', () => {
        localStorage.setItem('themeStyle', 'not-a-json-string');
        render(<ThemeSwitcherWithProvider />);
        const button = screen.getByRole('button', { name: /change theme style/i });
        expect(button).toBeDefined();
    });

    it('should close dropdown when clicking outside', async () => {
        render(
            <div>
                <ThemeSwitcherWithProvider />
                <div data-testid="outside">Outside element</div>
            </div>
        );
        fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));

        await waitFor(() => {
            expect(screen.getByText(/Select Style/i)).toBeDefined();
        });

        fireEvent.mouseDown(screen.getByTestId('outside'));

        await waitFor(() => {
            expect(screen.queryByText(/Select Style/i)).toBeNull();
        });
    });

    it('should close dropdown on Escape key', async () => {
        render(<ThemeSwitcherWithProvider />);
        fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));

        await waitFor(() => {
            expect(screen.getByText(/Select Style/i)).toBeDefined();
        });

        fireEvent.keyDown(document, { key: 'Escape' });

        await waitFor(() => {
            expect(screen.queryByText(/Select Style/i)).toBeNull();
        });
    });

    // ────────────────────────────────────────────────────────────────────────
    // BDD: activeTokens reflect style theme selection
    // A ThemeConsumer reads useTheme().activeTokens and exposes in data-testid
    // divs. Assertions compare against THEME_DEFINITIONS expected values.
    // ────────────────────────────────────────────────────────────────────────
    describe('Behavior: activeTokens reflect style theme selection', () => {
        function TokenDisplay() {
            const { activeTokens } = useTheme();
            return (
                <>
                    <div data-testid="active-tokens-accent">{activeTokens.accent}</div>
                    <div data-testid="active-tokens-bg-primary">{activeTokens.bgPrimary}</div>
                </>
            );
        }

        function ThemeSwitcherWithConsumer() {
            return (
                <ThemeProvider>
                    <ThemeSwitcher />
                    <TokenDisplay />
                </ThemeProvider>
            );
        }

        it('Given: ThemeSwitcher rendered in minimalist theme, When: user clicks Professional option, Then: activeTokens.accent = THEME_DEFINITIONS.professional.light.accent', async () => {
            render(<ThemeSwitcherWithConsumer />);

            // Open dropdown
            fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));

            await waitFor(() => {
                expect(screen.getByText('Professional')).toBeDefined();
            });

            // Click Professional
            fireEvent.click(screen.getByText('Professional'));

            await waitFor(() => {
                expect(screen.getByTestId('active-tokens-accent').textContent)
                    .toBe(THEME_DEFINITIONS.professional.light.accent);
            });
        });

        it('Given: ThemeSwitcher, When: switched to modern-tech then to vaporwave, Then: activeTokens changes to vaporwave values', async () => {
            render(<ThemeSwitcherWithConsumer />);

            // Switch to modern-tech first
            fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));
            await waitFor(() => expect(screen.getByText('Modern Tech')).toBeDefined());
            fireEvent.click(screen.getByText('Modern Tech'));

            await waitFor(() => {
                expect(screen.getByTestId('active-tokens-accent').textContent)
                    .toBe(THEME_DEFINITIONS['modern-tech'].light.accent);
            });

            // Now switch to vaporwave
            fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));
            await waitFor(() => expect(screen.getByText('Vaporwave')).toBeDefined());
            fireEvent.click(screen.getByText('Vaporwave'));

            await waitFor(() => {
                expect(screen.getByTestId('active-tokens-accent').textContent)
                    .toBe(THEME_DEFINITIONS.vaporwave.light.accent);
            });
        });
    });

    // ────────────────────────────────────────────────────────────────────────
    // BDD: CSS custom properties on document.documentElement must change when
    // a new style theme is selected through ThemeSwitcher.  These tests bind
    // to the CSS variable contract rather than internal React state, so they
    // will be RED until ThemeProvider writes CSS vars on every token update.
    // ────────────────────────────────────────────────────────────────────────
    describe('Behavior: CSS custom properties reflect style theme selection', () => {
        it('Given: default minimalist theme, When: select modern-tech, Then: --accent CSS var becomes modern-tech light accent', async () => {
            render(<ThemeSwitcherWithProvider />);

            fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));
            await waitFor(() => expect(screen.getByText('Modern Tech')).toBeDefined());
            fireEvent.click(screen.getByText('Modern Tech'));

            await waitFor(() => {
                expect(document.documentElement.style.getPropertyValue('--accent'))
                    .toBe(THEME_DEFINITIONS['modern-tech'].light.accent);
            });
        });

        it('Given: default theme, When: select vaporwave, Then: --border-radius CSS var changes to vaporwave value', async () => {
            render(<ThemeSwitcherWithProvider />);

            fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));
            await waitFor(() => expect(screen.getByText('Vaporwave')).toBeDefined());
            fireEvent.click(screen.getByText('Vaporwave'));

            await waitFor(() => {
                expect(document.documentElement.style.getPropertyValue('--border-radius'))
                    .toBe(THEME_DEFINITIONS.vaporwave.light.borderRadius);
            });
        });

        it('Given: modern-tech selected, When: switch to professional, Then: --accent CSS var updates to professional light accent', async () => {
            render(<ThemeSwitcherWithProvider />);

            // Select modern-tech first
            fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));
            await waitFor(() => expect(screen.getByText('Modern Tech')).toBeDefined());
            fireEvent.click(screen.getByText('Modern Tech'));
            await waitFor(() => {
                expect(document.documentElement.style.getPropertyValue('--accent'))
                    .toBe(THEME_DEFINITIONS['modern-tech'].light.accent);
            });

            // Then switch to professional
            fireEvent.click(screen.getByRole('button', { name: /change theme style/i }));
            await waitFor(() => expect(screen.getByText('Professional')).toBeDefined());
            fireEvent.click(screen.getByText('Professional'));

            await waitFor(() => {
                expect(document.documentElement.style.getPropertyValue('--accent'))
                    .toBe(THEME_DEFINITIONS.professional.light.accent);
            });
        });

        it('Given: ThemeSwitcher mounted with no stored style, Then: --bg-primary CSS var is minimalist light bgPrimary', async () => {
            render(<ThemeSwitcherWithProvider />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /change theme style/i })).toBeDefined();
            });

            expect(document.documentElement.style.getPropertyValue('--bg-primary'))
                .toBe(THEME_DEFINITIONS.minimalist.light.bgPrimary);
        });
    });
});
