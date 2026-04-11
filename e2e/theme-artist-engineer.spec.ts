/**
 * Theme E2E — artist-engineer app custom theme switching.
 *
 * The artist-engineer app ships three fully custom themes (Minimal, Warm, Bold)
 * that replace the global theme pool entirely. This suite asserts that the
 * theme picker can load each of them at runtime, not just the default one.
 *
 * BDD scenarios
 *
 * Scenario 1 — Minimal → Warm
 * Given  the artist-engineer app is open with the default Minimal custom theme
 * When   the user selects the Warm theme from the style picker
 * Then   the data-theme attribute changes to "warm" and CSS tokens update
 *
 * Scenario 2 — Minimal → Bold
 * Given  the artist-engineer app is open with the default Minimal custom theme
 * When   the user selects the Bold theme from the style picker
 * Then   the data-theme attribute changes to "bold" and CSS tokens update
 */

import { test, expect } from "@playwright/test";

test("Given default Minimal custom theme, When user switches to Warm, Then data-theme and CSS tokens update", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  const bgBefore = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-primary")
      .trim(),
  );
  const themeBefore = await page.locator("html").getAttribute("data-theme");
  expect(themeBefore).toBe("minimal");

  // Open the style picker and choose Warm
  await page.getByRole("button", { name: /change theme style/i }).click();
  await page.locator("button", { hasText: "Warm" }).first().click();

  // data-theme must reflect the new custom theme key
  await expect(page.locator("html")).toHaveAttribute("data-theme", "warm");
  expect(themeBefore).not.toBe("warm");

  // At least one CSS custom property must differ
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

test("Given default Minimal custom theme, When user switches to Bold, Then data-theme and CSS tokens update", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  const bgBefore = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-primary")
      .trim(),
  );
  const themeBefore = await page.locator("html").getAttribute("data-theme");
  expect(themeBefore).toBe("minimal");

  // Open the style picker and choose Bold
  await page.getByRole("button", { name: /change theme style/i }).click();
  await page.locator("button", { hasText: "Bold" }).first().click();

  // data-theme must reflect the new custom theme key
  await expect(page.locator("html")).toHaveAttribute("data-theme", "bold");
  expect(themeBefore).not.toBe("bold");

  // At least one CSS custom property must differ
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
