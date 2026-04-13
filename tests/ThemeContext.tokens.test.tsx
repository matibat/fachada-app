/**
 * Phase 1 remaining — ThemeContext.tokens field
 *
 * BDD: verifies that useTheme() exposes a `tokens` field from Zustand store.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, useTheme } from "@fachada/core/context/ThemeContext";
import { THEME_DEFINITIONS } from "@fachada/core/utils/theme.config";
import { getThemeStore } from "@fachada/core/stores/themeStore";

function TokensConsumer() {
    const state = useTheme();
    return (
        <div>
            <span data-testid="tokens-defined">{state.tokens ? "yes" : "no"}</span>
            <span data-testid="tokens-accent">{state.tokens?.accent ?? "missing"}</span>
        </div>
    );
}

beforeEach(() => {
    getThemeStore().initFromEnvironment({ default: 'minimalist', globals: Object.keys(THEME_DEFINITIONS) });
});

// ─── Scenario 1: tokens field is present and non-null ────────────────────────

describe("Scenario 1: useTheme() exposes a tokens field", () => {
    it("Given: ThemeProvider, When: useTheme() is called, Then: tokens is defined", () => {
        const { getByTestId } = render(
            React.createElement(ThemeProvider, null,
                React.createElement(TokensConsumer)
            )
        );

        expect(getByTestId("tokens-defined").textContent).toBe("yes");
    });
});

// ─── Scenario 2: tokens has the correct values from Zustand store ─────────────────

describe("Scenario 2: tokens has correct values from the Zustand store", () => {
    it("Given: default ThemeProvider (minimalist/light), When: initialized, Then: tokens.accent is non-empty", () => {
        const { getByTestId } = render(
            React.createElement(ThemeProvider, null,
                React.createElement(TokensConsumer)
            )
        );

        expect(getByTestId("tokens-accent").textContent).not.toBe("missing");
        expect(getByTestId("tokens-accent").textContent.length).toBeGreaterThan(0);
    });

    it("Given: default style is minimalist, When: no storage override, Then: tokens.accent equals minimalist light accent", () => {
        const expected = THEME_DEFINITIONS.minimalist.light.accent;

        const { getByTestId } = render(
            React.createElement(ThemeProvider, null,
                React.createElement(TokensConsumer)
            )
        );

        expect(getByTestId("tokens-accent").textContent).toBe(expected);
    });
});

// ─── Scenario 3: tokens are defined and accessible ─────────────────────────────────

describe("Scenario 3: tokens are accessible from useTheme()", () => {
    it("Given: ThemeProvider, When: tokens are read, Then: tokens object is defined", () => {
        const { getByTestId } = render(
            React.createElement(ThemeProvider, null,
                React.createElement(TokensConsumer)
            )
        );

        expect(getByTestId("tokens-defined").textContent).toBe("yes");
        expect(getByTestId("tokens-accent").textContent).not.toBe("missing");
    });
});
