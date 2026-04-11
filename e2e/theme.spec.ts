/**
 * Theme E2E — default-fachada app global theme switching.
 *
 * Asserts that switching between the built-in global themes (minimalist,
 * modern-tech, professional, vaporwave) updates the page visually.
 * Persistence, cross-tab sync, and token correctness are covered at the
 * integration level (tests/theme.integration.test.tsx).
 *
 * BDD scenario
 * Given  a visitor opens the default-fachada portfolio (minimalist theme)
 * When   they select the Modern Tech theme from the style picker
 * Then   the data-theme attribute and CSS custom properties update
 */

import { test, expect } from "@playwright/test";

test("Given default theme, When user switches to Modern Tech, Then visual style and attribute change", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  // Snapshot baseline visual token before switching
  const bgBefore = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-primary")
      .trim(),
  );
  const themeBefore = await page.locator("html").getAttribute("data-theme");

  // Open the style switcher and select "Modern Tech"
  await page.getByRole("button", { name: /change theme style/i }).click();
  await page.locator("button", { hasText: "Modern Tech" }).first().click();

  // data-theme attribute must reflect the new selection
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "modern-tech",
  );
  expect(themeBefore).not.toBe("modern-tech");

  // At least one CSS custom property visible to the user must differ
  await expect
    .poll(async () =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--bg-primary")
          .trim(),
      ),
    )
    .not.toBe(bgBefore);
});
