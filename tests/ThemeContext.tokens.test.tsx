/**
 * Phase 1 remaining — ThemeContext.tokens field
 *
 * BDD: verifies that useTheme() exposes a `tokens` field
 * (DDD v2 alias for activeTokens). RED until ThemeContextState gains `tokens`.
 */
import { describe, it, expect } from "vitest";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, useTheme } from "../src/context/ThemeContext";
import { THEME_DEFINITIONS } from "../src/utils/theme.config";

function TokensConsumer() {
    const state = useTheme();
    return (
        <div>
            <span data-testid="tokens-defined">{state.tokens ? "yes" : "no"}</span>
            <span data-testid="tokens-accent">{state.tokens?.accent ?? "missing"}</span>
            <span data-testid="active-tokens-accent">{state.activeTokens?.accent ?? "missing"}</span>
        </div>
    );
}

// ─── Scenario 1: tokens field is present and non-null ────────────────────────

describe("Scenario 1: useTheme() exposes a tokens field", () => {
    it("Given: ThemeProvider, When: useTheme() is called, Then: tokens is defined", async () => {
        const { getByTestId } = render(
            React.createElement(ThemeProvider, null,
                React.createElement(TokensConsumer)
            )
        );

        await waitFor(() => {
            expect(getByTestId("tokens-defined").textContent).toBe("yes");
        });
    });
});

// ─── Scenario 2: tokens equals activeTokens ──────────────────────────────────

describe("Scenario 2: tokens is identical to activeTokens", () => {
    it("Given: default ThemeProvider (minimalist/light), When: initialized, Then: tokens.accent equals activeTokens.accent", async () => {
        const { getByTestId } = render(
            React.createElement(ThemeProvider, null,
                React.createElement(TokensConsumer)
            )
        );

        await waitFor(() => {
            const tokensAccent = getByTestId("tokens-accent").textContent;
            const activeAccent = getByTestId("active-tokens-accent").textContent;
            expect(tokensAccent).toBe(activeAccent);
            expect(tokensAccent).not.toBe("missing");
        });
    });

    it("Given: default style is minimalist, When: no storage override, Then: tokens.accent equals minimalist light accent", async () => {
        const expected = THEME_DEFINITIONS.minimalist.light.accent;

        const { getByTestId } = render(
            React.createElement(ThemeProvider, null,
                React.createElement(TokensConsumer)
            )
        );

        await waitFor(() => {
            expect(getByTestId("tokens-accent").textContent).toBe(expected);
        });
    });
});

// ─── Scenario 3: tokens updates when styleTheme changes ──────────────────────

describe("Scenario 3: tokens updates together with activeTokens when style changes", () => {
    function ThemeChanger() {
        const state = useTheme();
        const { setStyleTheme } = { setStyleTheme: (s: string) => { } };
        return (
            <div>
                <span data-testid="tokens-same-as-active">
                    {JSON.stringify(state.tokens) === JSON.stringify(state.activeTokens)
                        ? "true"
                        : "false"}
                </span>
            </div>
        );
    }

    it("Given: ThemeProvider, When: tokens and activeTokens read simultaneously, Then: they are deeply equal", async () => {
        const { getByTestId } = render(
            React.createElement(ThemeProvider, null,
                React.createElement(ThemeChanger)
            )
        );

        await waitFor(() => {
            expect(getByTestId("tokens-same-as-active").textContent).toBe("true");
        });
    });
});
