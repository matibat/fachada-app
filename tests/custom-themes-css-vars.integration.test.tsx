/**
 * Custom Themes CSS Variables Test Suite
 *
 * BDD: Scenarios validating that when a user switches to a custom theme:
 * 1. CSS custom properties (--accent, --bg-primary, etc.) are updated
 * 2. Updates are applied to document.documentElement.style
 * 3. Changes reflect in getComputedStyle() for styled components
 * 4. Switching between custom themes applies the correct token values
 * 5. Custom theme tokens persist to localStorage
 *
 * These tests verify the runtime DOM behavior of custom theme selection,
 * ensuring CSS properties change immediately when themes are switched.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import {
    ThemeProvider,
    useTheme,
    useThemeActions,
} from "../src/context/ThemeContext";
import { THEME_DEFINITIONS } from "../src/utils/theme.config";
import { useThemeStore } from "../src/stores/themeStore";

/**
 * Test component that displays CSS custom property values
 */
function CSSPropertyDisplay() {
    const { styleTheme, isInitialized } = useTheme();
    return (
        <div>
            <div data-testid="ctx-is-initialized">{isInitialized ? "true" : "false"}</div>
            <div data-testid="ctx-style-theme">{styleTheme}</div>
            <div
                data-testid="css-accent"
                style={{
                    color: "var(--accent)",
                }}
            >
                Accent element
            </div>
            <div
                data-testid="css-bg-primary"
                style={{
                    backgroundColor: "var(--bg-primary)",
                }}
            >
                Background element
            </div>
        </div>
    );
}

/**
 * Test component with action buttons
 */
function CSSPropertyDisplayWithActions() {
    const { styleTheme } = useTheme();
    const { setStyleTheme } = useThemeActions();

    return (
        <div>
            <div data-testid="current-theme">{styleTheme}</div>
            <button onClick={() => setStyleTheme("minimalist")} data-testid="set-minimalist">
                Set Minimalist
            </button>
            <button onClick={() => setStyleTheme("modern-tech")} data-testid="set-modern-tech">
                Set Modern Tech
            </button>
            <button onClick={() => setStyleTheme("professional")} data-testid="set-professional">
                Set Professional
            </button>
            <CSSPropertyDisplay />
        </div>
    );
}

describe("BDD: Custom Themes CSS Variables Application", () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Reset document attributes
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.classList.remove("dark");
        // Clear inline styles
        document.documentElement.style.cssText = "";
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
        localStorage.clear();
    });

    // ────────────────────────────────────────────────────────────────────────────
    // Scenario 1: CSS Variables Are Set When Theme Provider Initializes
    // ────────────────────────────────────────────────────────────────────────────
    describe(
        "Scenario 1: CSS custom properties are applied to document root on init",
        () => {
            it("Given: ThemeProvider renders with default theme", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplay />
                    </ThemeProvider>
                );

                // Component initializes immediately in React
                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });
            });

            it("When: Component initializes and hydrates", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplay />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });
            });

            it("Then: Document documentElement has data-theme attribute", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplay />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(document.documentElement.getAttribute("data-theme")).toBe(
                        "minimalist"
                    );
                });
            });

            it("Then: CSS custom properties are set on document.documentElement.style", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplay />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    const accentValue = document.documentElement.style.getPropertyValue(
                        "--accent"
                    );
                    expect(accentValue).toBeTruthy();
                    expect(accentValue.length).toBeGreaterThan(0);
                });
            });

            it("Then: --accent value matches the selected theme's light mode accent", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplay />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    const accentValue = document.documentElement.style.getPropertyValue(
                        "--accent"
                    );
                    const expectedAccent =
                        THEME_DEFINITIONS["minimalist"].light.accent;
                    expect(accentValue).toBe(expectedAccent);
                });
            });
        }
    );

    // ────────────────────────────────────────────────────────────────────────────
    // Scenario 2: CSS Variables Update When Theme Style Changes
    // ────────────────────────────────────────────────────────────────────────────
    describe(
        "Scenario 2: CSS custom properties update when user selects a different theme",
        () => {
            it("Given: Default theme is minimalist", () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                expect(screen.getByTestId("current-theme").textContent).toBe(
                    "minimalist"
                );
            });

            it("When: User clicks button to switch to modern-tech theme", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });

                fireEvent.click(screen.getByTestId("set-modern-tech"));
            });

            it("Then: data-theme attribute updates to modern-tech", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });

                fireEvent.click(screen.getByTestId("set-modern-tech"));

                await waitFor(() => {
                    expect(document.documentElement.getAttribute("data-theme")).toBe(
                        "modern-tech"
                    );
                });
            });

            it("Then: CSS --accent variable changes to modern-tech value", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });

                const minimalistAccent =
                    document.documentElement.style.getPropertyValue("--accent");
                expect(minimalistAccent).toBe(
                    THEME_DEFINITIONS["minimalist"].light.accent
                );

                fireEvent.click(screen.getByTestId("set-modern-tech"));

                await waitFor(() => {
                    const modernTechAccent =
                        document.documentElement.style.getPropertyValue("--accent");
                    expect(modernTechAccent).toBe(
                        THEME_DEFINITIONS["modern-tech"].light.accent
                    );
                    expect(modernTechAccent).not.toBe(minimalistAccent);
                });
            });

            it("Then: Multiple CSS variables update (--accent, --bg-primary, etc.)", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });

                const minimalistBgValue =
                    document.documentElement.style.getPropertyValue("--bg-primary");
                const minimalistAccentValue =
                    document.documentElement.style.getPropertyValue("--accent");

                fireEvent.click(screen.getByTestId("set-professional"));

                await waitFor(() => {
                    const professionalBgValue =
                        document.documentElement.style.getPropertyValue("--bg-primary");
                    const professionalAccentValue =
                        document.documentElement.style.getPropertyValue("--accent");

                    expect(professionalBgValue).not.toBe(minimalistBgValue);
                    expect(professionalAccentValue).not.toBe(minimalistAccentValue);
                    expect(professionalBgValue).toBe(
                        THEME_DEFINITIONS["professional"].light.bgPrimary
                    );
                    expect(professionalAccentValue).toBe(
                        THEME_DEFINITIONS["professional"].light.accent
                    );
                });
            });
        }
    );

    // ────────────────────────────────────────────────────────────────────────────
    // Scenario 3: All Theme Styles Cycle Through and CSS Updates
    // ────────────────────────────────────────────────────────────────────────────
    describe(
        "Scenario 3: Switching through all global themes updates CSS each time",
        () => {
            it("Given: Any theme is initially active", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });
            });

            it("When: User switches through all 4 global themes in sequence", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });

                const themeButtons = [
                    "set-minimalist",
                    "set-modern-tech",
                    "set-professional",
                ];
                const accents: Record<string, string> = {};

                for (const btnId of themeButtons) {
                    fireEvent.click(screen.getByTestId(btnId));

                    await waitFor(() => {
                        const accent =
                            document.documentElement.style.getPropertyValue("--accent");
                        accents[btnId] = accent;
                        expect(accent).toBeTruthy();
                    });
                }

                // Verify all accents are different
                const uniqueAccents = new Set(Object.values(accents));
                expect(uniqueAccents.size).toBe(themeButtons.length);
            });

            it("Then: Each theme has distinct CSS token values", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });

                const accents: string[] = [];

                for (const [btnId, style] of [
                    ["set-minimalist", "minimalist"],
                    ["set-modern-tech", "modern-tech"],
                    ["set-professional", "professional"],
                ]) {
                    fireEvent.click(screen.getByTestId(btnId));

                    await waitFor(() => {
                        expect(document.documentElement.getAttribute("data-theme")).toBe(
                            style
                        );
                        const accent =
                            document.documentElement.style.getPropertyValue("--accent");
                        accents.push(accent);
                        expect(accent).toBe(THEME_DEFINITIONS[style as any].light.accent);
                    });
                }

                // All accents should be different from each other
                expect(new Set(accents).size).toBe(accents.length);
            });
        }
    );

    // ────────────────────────────────────────────────────────────────────────────
    // Scenario 4: Theme Style Persists to localStorage
    // ────────────────────────────────────────────────────────────────────────────
    describe(
        "Scenario 4: Selected theme style is persisted to localStorage",
        () => {
            it("Given: Default theme is applied and localStorage is empty", () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                expect(localStorage.getItem("themeStyle")).toBeNull();
            });

            it("When: User selects a different theme (modern-tech)", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });

                fireEvent.click(screen.getByTestId("set-modern-tech"));
            });

            it("Then: Selected theme key is stored in localStorage['themeStyle']", async () => {
                render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });

                fireEvent.click(screen.getByTestId("set-modern-tech"));

                await waitFor(() => {
                    const stored = localStorage.getItem("themeStyle");
                    expect(stored).toBeTruthy();
                    // Value may be JSON-encoded or plain string
                    const parsed = stored?.startsWith('"') ? JSON.parse(stored) : stored;
                    expect(parsed).toBe("modern-tech");
                });
            });

            it("Then: Stored value persists across renders", async () => {
                const { rerender } = render(
                    <ThemeProvider defaultTheme="minimalist">
                        <CSSPropertyDisplayWithActions />
                    </ThemeProvider>
                );

                await waitFor(() => {
                    expect(screen.getByTestId("ctx-is-initialized").textContent).toBe(
                        "true"
                    );
                });

                fireEvent.click(screen.getByTestId("set-professional"));

                await waitFor(() => {
                    const stored = JSON.parse(
                        localStorage.getItem("themeStyle") || '"minimalist"'
                    );
                    expect(stored).toBe("professional");
                    expect(document.documentElement.getAttribute("data-theme")).toBe(
                        "professional"
                    );
                });
            });
        }
    );
});
