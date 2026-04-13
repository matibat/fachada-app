/**
 * Visual tests — Simulated page that exercises every major section component.
 * Verifies that switching the style theme AND the dark flag produces measurably
 * different token values for all theme combinations.
 *
 * Strategy: ThemeProvider propagates tokens via SCThemeProvider (styled-components).
 * getCSSVar() is NOT used — React no longer sets CSS custom properties on the DOM.
 * A ThemeConsumer reads useTheme().activeTokens and exposes values in data-testid
 * divs (as text content). This is reliable in happy-dom without CSS cascade.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ThemeProvider, useTheme, useThemeActions } from '@fachada/core';
import { THEME_DEFINITIONS } from '@fachada/core';
import { useThemeStore } from '@fachada/core';

// ============================================================================
// ThemeConsumer — reads activeTokens from context and exposes as text content
// ============================================================================

function ThemeConsumer() {
    const { activeTokens, isInitialized } = useTheme();
    return (
        <div data-testid="theme-consumer">
            <div data-testid="ctx-is-initialized">{isInitialized ? 'true' : 'false'}</div>
            <div data-testid="ctx-accent">{activeTokens.accent}</div>
            <div data-testid="ctx-bg-primary">{activeTokens.bgPrimary}</div>
            <div data-testid="ctx-text-primary">{activeTokens.textPrimary}</div>
            <div data-testid="ctx-bg-secondary">{activeTokens.bgSecondary}</div>
            <div data-testid="ctx-text-secondary">{activeTokens.textSecondary}</div>
            <div data-testid="ctx-border-radius">{activeTokens.borderRadius}</div>
        </div>
    );
}

// ============================================================================
// Simulated page — mirrors the visual structure of the real portfolio sections.
// Each section renders at least one element whose colour is driven by the
// active token set so we can assert it changes when the theme changes.
// ============================================================================

function HeroSection() {
    const { activeTokens } = useTheme();
    return (
        <section
            data-testid="hero-section"
            style={{ backgroundColor: activeTokens.bgPrimary }}
        >
            <h1
                data-testid="hero-title"
                style={{ color: activeTokens.textPrimary }}
            >
                Hero Title
            </h1>
            <span
                data-testid="hero-accent"
                style={{ color: activeTokens.accent }}
            >
                Accent Text
            </span>
        </section>
    );
}

function AboutSection() {
    const { activeTokens } = useTheme();
    return (
        <section
            data-testid="about-section"
            style={{ backgroundColor: activeTokens.bgSecondary }}
        >
            <p
                data-testid="about-text"
                style={{ color: activeTokens.textSecondary }}
            >
                About content
            </p>
        </section>
    );
}

function SkillsSection() {
    const { activeTokens } = useTheme();
    return (
        <section
            data-testid="skills-section"
            style={{ backgroundColor: activeTokens.bgPrimary }}
        >
            <span
                data-testid="skill-badge"
                style={{
                    backgroundColor: activeTokens.accent,
                    borderRadius: activeTokens.borderRadius,
                }}
            >
                TypeScript
            </span>
        </section>
    );
}

function ContactSection() {
    const { activeTokens } = useTheme();
    return (
        <section data-testid="contact-section">
            <a
                data-testid="contact-link"
                href="mailto:hi@example.com"
                style={{ color: activeTokens.accent }}
            >
                hello@example.com
            </a>
        </section>
    );
}

function ThemeControls() {
    const { setStyleTheme, setColorMode } = useThemeActions();
    return (
        <div data-testid="theme-controls">
            <button data-testid="set-minimalist" onClick={() => setStyleTheme('minimalist')}>Minimalist</button>
            <button data-testid="set-modern-tech" onClick={() => setStyleTheme('modern-tech')}>Modern Tech</button>
            <button data-testid="set-professional" onClick={() => setStyleTheme('professional')}>Professional</button>
            <button data-testid="set-vaporwave" onClick={() => setStyleTheme('vaporwave')}>Vaporwave</button>
            <button data-testid="set-light" onClick={() => setColorMode('light')}>Light</button>
            <button data-testid="set-dark" onClick={() => setColorMode('dark')}>Dark</button>
        </div>
    );
}

/** Full simulated page with all sections, theme consumer, and theme controls. */
function SimulatedPage() {
    return (
        <>
            <ThemeConsumer />
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ContactSection />
            <ThemeControls />
        </>
    );
}

function TestProvider({ children }: { children: ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}

// ============================================================================
// Tests
// ============================================================================

describe('Visual: theme token changes apply to all page sections', () => {
    let localStorageMock: Record<string, string>;

    beforeEach(() => {
        localStorageMock = {};
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: (k: string) => localStorageMock[k] ?? null,
                setItem: (k: string, v: string) => { localStorageMock[k] = v; },
                removeItem: (k: string) => { delete localStorageMock[k]; },
                clear: () => { localStorageMock = {}; },
                length: 0,
                key: (i: number) => Object.keys(localStorageMock)[i] ?? null,
            },
            writable: true,
        });

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
                dispatchEvent: vi.fn(),
            })),
        });

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
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.removeAttribute('style');
    });

    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    // -------------------------------------------------------------------------
    // Scenario A: Switching between style themes changes visual properties
    // -------------------------------------------------------------------------
    describe('Scenario A: Style theme switch changes accent & background on all sections', () => {
        it('Given: minimalist theme, When: switch to modern-tech, Then: accent and bg-primary are different on all sections', async () => {
            render(<SimulatedPage />, { wrapper: TestProvider });

            // Wait for initialization via ThemeConsumer
            await waitFor(() => {
                expect(screen.getByTestId('ctx-is-initialized').textContent).toBe('true');
            });

            const minimalistAccent = screen.getByTestId('ctx-accent').textContent;
            const minimalistBg = screen.getByTestId('ctx-bg-primary').textContent;

            // Switch to modern-tech
            fireEvent.click(screen.getByTestId('set-modern-tech'));

            await waitFor(() => {
                expect(screen.getByTestId('ctx-accent').textContent).not.toBe(minimalistAccent);
            });

            const modernTechAccent = screen.getByTestId('ctx-accent').textContent;
            const modernTechBg = screen.getByTestId('ctx-bg-primary').textContent;

            // Accent colors are different between themes
            expect(modernTechAccent).not.toBe(minimalistAccent);

            // Verify the actual expected values from config
            expect(minimalistAccent).toBe(THEME_DEFINITIONS.minimalist.light.accent);
            expect(modernTechAccent).toBe(THEME_DEFINITIONS['modern-tech'].light.accent);

            // All section components share the same activeTokens — verified via bg-primary
            expect(modernTechBg).toBe(THEME_DEFINITIONS['modern-tech'].light.bgPrimary);
            expect(minimalistBg).toBe(THEME_DEFINITIONS.minimalist.light.bgPrimary);
        });

        it('Given: any theme, When: switching through all 4 themes, Then: accent changes each time', async () => {
            render(<SimulatedPage />, { wrapper: TestProvider });

            await waitFor(() => {
                expect(screen.getByTestId('ctx-is-initialized').textContent).toBe('true');
            });

            const accents: string[] = [];

            for (const [btnId, style] of [
                ['set-minimalist', 'minimalist'],
                ['set-modern-tech', 'modern-tech'],
                ['set-professional', 'professional'],
                ['set-vaporwave', 'vaporwave'],
            ] as const) {
                fireEvent.click(screen.getByTestId(btnId));
                await waitFor(() => {
                    const accent = screen.getByTestId('ctx-accent').textContent;
                    expect(accent).toBe(THEME_DEFINITIONS[style].light.accent);
                });
                accents.push(screen.getByTestId('ctx-accent').textContent ?? '');
            }

            // All 4 distinct themes produce different accent values
            const uniqueAccents = new Set(accents);
            expect(uniqueAccents.size).toBe(4);
        });

        it('Given: minimalist theme, When: switch to vaporwave, Then: border-radius layout property also changes', async () => {
            render(<SimulatedPage />, { wrapper: TestProvider });

            await waitFor(() => {
                expect(screen.getByTestId('ctx-is-initialized').textContent).toBe('true');
            });

            const minimalistRadius = screen.getByTestId('ctx-border-radius').textContent;
            fireEvent.click(screen.getByTestId('set-vaporwave'));

            await waitFor(() => {
                expect(screen.getByTestId('ctx-border-radius').textContent).not.toBe(minimalistRadius);
            });

            expect(THEME_DEFINITIONS.vaporwave.light.borderRadius).not.toBe(
                THEME_DEFINITIONS.minimalist.light.borderRadius
            );
            expect(screen.getByTestId('ctx-border-radius').textContent)
                .toBe(THEME_DEFINITIONS.vaporwave.light.borderRadius);
        });
    });

    // -------------------------------------------------------------------------
    // Scenario B: Dark mode toggle changes colors on all sections
    // -------------------------------------------------------------------------
    describe('Scenario B: Dark mode changes text and background on all sections', () => {
        it('Given: minimalist light theme, When: toggle dark mode, Then: bg-primary and text-primary change on all sections', async () => {
            render(<SimulatedPage />, { wrapper: TestProvider });

            await waitFor(() => {
                expect(screen.getByTestId('ctx-is-initialized').textContent).toBe('true');
            });

            const lightBg = screen.getByTestId('ctx-bg-primary').textContent;
            const lightText = screen.getByTestId('ctx-text-primary').textContent;

            fireEvent.click(screen.getByTestId('set-dark'));

            await waitFor(() => {
                expect(screen.getByTestId('ctx-bg-primary').textContent).not.toBe(lightBg);
            });

            const darkBg = screen.getByTestId('ctx-bg-primary').textContent;
            const darkText = screen.getByTestId('ctx-text-primary').textContent;

            expect(darkBg).not.toBe(lightBg);
            expect(darkText).not.toBe(lightText);

            expect(darkBg).toBe(THEME_DEFINITIONS.minimalist.dark.bgPrimary);
            expect(darkText).toBe(THEME_DEFINITIONS.minimalist.dark.textPrimary);

            // Verify secondary tokens also updated
            expect(screen.getByTestId('ctx-bg-secondary').textContent)
                .toBe(THEME_DEFINITIONS.minimalist.dark.bgSecondary);
            expect(screen.getByTestId('ctx-text-secondary').textContent)
                .toBe(THEME_DEFINITIONS.minimalist.dark.textSecondary);
        });

        it('Given: modern-tech dark theme, When: switch back to light, Then: all section colors revert', async () => {
            render(<SimulatedPage />, { wrapper: TestProvider });

            await waitFor(() => {
                expect(screen.getByTestId('ctx-is-initialized').textContent).toBe('true');
            });

            // Go dark
            fireEvent.click(screen.getByTestId('set-modern-tech'));
            fireEvent.click(screen.getByTestId('set-dark'));

            await waitFor(() => {
                expect(screen.getByTestId('ctx-accent').textContent)
                    .toBe(THEME_DEFINITIONS['modern-tech'].dark.accent);
            });

            const darkAccent = screen.getByTestId('ctx-accent').textContent;

            // Back to light
            fireEvent.click(screen.getByTestId('set-light'));

            await waitFor(() => {
                expect(screen.getByTestId('ctx-accent').textContent).not.toBe(darkAccent);
            });

            expect(screen.getByTestId('ctx-accent').textContent)
                .toBe(THEME_DEFINITIONS['modern-tech'].light.accent);
        });
    });

    // -------------------------------------------------------------------------
    // Scenario C: Combined style + dark change
    // -------------------------------------------------------------------------
    describe('Scenario C: Style + dark flag combined produces unique visual state per combination', () => {
        it('Given: minimalist light, When: switch to vaporwave dark, Then: at least accent and bg differ from initial', async () => {
            render(<SimulatedPage />, { wrapper: TestProvider });

            await waitFor(() => {
                expect(screen.getByTestId('ctx-is-initialized').textContent).toBe('true');
            });

            const initialAccent = screen.getByTestId('ctx-accent').textContent;
            const initialBg = screen.getByTestId('ctx-bg-primary').textContent;

            fireEvent.click(screen.getByTestId('set-vaporwave'));
            fireEvent.click(screen.getByTestId('set-dark'));

            await waitFor(() => {
                expect(screen.getByTestId('ctx-accent').textContent)
                    .toBe(THEME_DEFINITIONS.vaporwave.dark.accent);
            });

            expect(screen.getByTestId('ctx-accent').textContent).not.toBe(initialAccent);
            expect(screen.getByTestId('ctx-bg-primary').textContent).not.toBe(initialBg);
        });

        it('Given: context exposes activeTokens, When: theme changes, Then: activeTokens match THEME_DEFINITIONS expected values', async () => {
            render(<SimulatedPage />, { wrapper: TestProvider });

            await waitFor(() => {
                expect(screen.getByTestId('ctx-is-initialized').textContent).toBe('true');
            });

            // Initial state: minimalist light
            expect(screen.getByTestId('ctx-accent').textContent)
                .toBe(THEME_DEFINITIONS.minimalist.light.accent);
            expect(screen.getByTestId('ctx-bg-primary').textContent)
                .toBe(THEME_DEFINITIONS.minimalist.light.bgPrimary);

            // Switch theme
            fireEvent.click(screen.getByTestId('set-modern-tech'));

            await waitFor(() => {
                expect(screen.getByTestId('ctx-accent').textContent)
                    .toBe(THEME_DEFINITIONS['modern-tech'].light.accent);
            });

            // After switch: context tokens match THEME_DEFINITIONS
            expect(screen.getByTestId('ctx-accent').textContent)
                .toBe(THEME_DEFINITIONS['modern-tech'].light.accent);
            expect(screen.getByTestId('ctx-bg-primary').textContent)
                .toBe(THEME_DEFINITIONS['modern-tech'].light.bgPrimary);
        });
    });
});
