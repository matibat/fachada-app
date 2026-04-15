/**
 * Default Skin E2E — fachada-app
 *
 * Verifies that @fachada/core deterministically applies the default skin
 * (CSS custom properties + structural layout CSS) to the app at runtime —
 * without any reliance on the consumer app's Tailwind configuration.
 *
 * BDD Scenario:
 * Given  a visitor opens the fachada-app homepage (minimalist skin)
 * When   the page loads
 * Then   the skin CSS custom properties from core are applied to <html>
 *        AND the navbar structural layout (from core's navbar.css) is applied
 *        AND the footer structural layout (from core's globals.css) is applied
 */

import { test, expect } from "@playwright/test";

test.describe("Default skin applied deterministically from fachada-core", () => {
  test("Given page loads, When default skin is minimalist, Then core CSS custom properties are set on <html>", async ({
    page,
    context,
  }) => {
    // Start from a clean state (no saved user preference)
    await context.clearCookies();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });

    // Collect all expected skin tokens from document.documentElement
    const skinTokens = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        bgPrimary: styles.getPropertyValue("--bg-primary").trim(),
        bgSecondary: styles.getPropertyValue("--bg-secondary").trim(),
        textPrimary: styles.getPropertyValue("--text-primary").trim(),
        textSecondary: styles.getPropertyValue("--text-secondary").trim(),
        accent: styles.getPropertyValue("--accent").trim(),
        border: styles.getPropertyValue("--border").trim(),
        fontBody: styles.getPropertyValue("--font-body").trim(),
        fontHeading: styles.getPropertyValue("--font-heading").trim(),
        contentMaxWidth: styles.getPropertyValue("--content-max-width").trim(),
        dataTheme: document.documentElement.getAttribute("data-theme"),
      };
    });

    // All core skin tokens must be non-empty (deterministically applied by BaseLayout)
    expect(
      skinTokens.bgPrimary,
      "--bg-primary must be set by core skin",
    ).toBeTruthy();
    expect(
      skinTokens.bgSecondary,
      "--bg-secondary must be set by core skin",
    ).toBeTruthy();
    expect(
      skinTokens.textPrimary,
      "--text-primary must be set by core skin",
    ).toBeTruthy();
    expect(
      skinTokens.textSecondary,
      "--text-secondary must be set by core skin",
    ).toBeTruthy();
    expect(skinTokens.accent, "--accent must be set by core skin").toBeTruthy();
    expect(skinTokens.border, "--border must be set by core skin").toBeTruthy();
    expect(
      skinTokens.fontBody,
      "--font-body must be set by core skin",
    ).toBeTruthy();
    expect(
      skinTokens.fontHeading,
      "--font-heading must be set by core skin",
    ).toBeTruthy();
    expect(
      skinTokens.contentMaxWidth,
      "--content-max-width must be set by core skin",
    ).toBeTruthy();

    // Default skin for fachada-app is "minimalist"
    expect(skinTokens.dataTheme, "data-theme must be set to default skin").toBe(
      "minimalist",
    );
  });

  test("Given page loads, When navbar renders, Then structural CSS from core navbar.css is applied (no Tailwind needed)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const navbar = page.locator("header.navbar");
    await expect(navbar).toBeVisible({ timeout: 10000 });

    // Verify .navbar-inner container has semantic layout from navbar.css
    const innerLayout = await page
      .locator("header.navbar .navbar-inner")
      .evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          flexDirection: styles.flexDirection,
          alignItems: styles.alignItems,
          justifyContent: styles.justifyContent,
          width: styles.width,
        };
      });

    // These come from .navbar-inner in navbar.css — not from Tailwind
    expect(innerLayout.display, ".navbar-inner display must be flex").toBe(
      "flex",
    );
    expect(innerLayout.flexDirection, ".navbar-inner must be row").toBe("row");
    expect(innerLayout.alignItems, ".navbar-inner must align center").toBe(
      "center",
    );
    expect(
      innerLayout.justifyContent,
      ".navbar-inner must justify space-between",
    ).toBe("space-between");
  });

  test("Given page loads, When footer renders, Then structural CSS from core globals.css is applied (no Tailwind needed)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const footer = page.locator("footer.footer-wrapper");
    await expect(footer).toBeVisible({ timeout: 10000 });

    // Verify .footer-inner has max-width container from globals.css
    const footerInner = page.locator("footer.footer-wrapper .footer-inner");
    await expect(footerInner).toBeVisible();

    const footerInnerStyles = await footerInner.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        maxWidth: styles.maxWidth,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
      };
    });

    // max-width: 72rem from .footer-inner in globals.css
    expect(
      footerInnerStyles.maxWidth,
      ".footer-inner must have max-width from core CSS",
    ).toBeTruthy();
    expect(footerInnerStyles.maxWidth).not.toBe("none");
  });
});
