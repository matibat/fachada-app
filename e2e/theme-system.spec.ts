import { test, expect, type Page } from "@playwright/test";

async function openThemeSwitcher(page: Page) {
  await page.getByRole("button", { name: /change theme style/i }).click();
}

async function pickTheme(page: Page, themeName: string) {
  await openThemeSwitcher(page);
  await page.locator("button", { hasText: themeName }).first().click();
}

async function resolvedColorFromVar(page: Page, cssVarName: string) {
  return page.evaluate((varName) => {
    const probe = document.createElement("div");
    probe.style.backgroundColor = `var(${varName})`;
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  }, cssVarName);
}

test.describe("Theme System E2E", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
  });

  test("Given default theme, When user selects Modern Tech, Then html attribute, token, and CTA button color update", async ({
    page,
  }) => {
    await pickTheme(page, "Modern Tech");

    const htmlTag = page.locator("html");
    await expect(htmlTag).toHaveAttribute("data-theme", "modern-tech");

    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim(),
    );
    expect(accent).toBe("#3b82f6");

    const expectedAccentColor = await resolvedColorFromVar(page, "--accent");
    await expect
      .poll(async () =>
        page
          .locator(".hero-primary-cta")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      )
      .toBe(expectedAccentColor);
  });

  test("Given default theme, When user selects Vaporwave, Then skills container background changes to Vaporwave token value", async ({
    page,
  }) => {
    const skills = page.locator('[data-testid="skills-section"]');
    const before = await skills.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );

    await pickTheme(page, "Vaporwave");

    const after = await skills.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );

    expect(after).not.toBe(before);
    expect(after).toBe("rgb(212, 241, 244)");
  });

  test("Given light mode, When toggle is clicked twice, Then app switches dark then back to light with visual updates", async ({
    page,
  }) => {
    const toggle = page.getByRole("button", { name: /current mode/i });
    const htmlTag = page.locator("html");

    await toggle.click();

    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem("theme")))
      .toBe('"dark"');
    await expect
      .poll(async () => htmlTag.evaluate((el) => el.classList.contains("dark")))
      .toBe(true);

    await expect
      .poll(async () =>
        page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--bg-primary")
            .trim(),
        ),
      )
      .toBe("#0a0a0a");

    await toggle.click();

    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem("theme")))
      .toBe('"light"');
    await expect
      .poll(async () => htmlTag.evaluate((el) => el.classList.contains("dark")))
      .toBe(false);

    await expect
      .poll(async () =>
        page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--bg-primary")
            .trim(),
        ),
      )
      .toBe("#ffffff");
  });

  test("Given professional dark selection, When page reloads, Then mode and style persist and contact section keeps expected background", async ({
    page,
  }) => {
    await pickTheme(page, "Professional");
    await page.getByRole("button", { name: /current mode/i }).click();

    await page.reload({ waitUntil: "domcontentloaded" });

    const htmlTag = page.locator("html");
    await expect(htmlTag).toHaveAttribute("data-theme", "professional");
    await expect
      .poll(async () => htmlTag.evaluate((el) => el.classList.contains("dark")))
      .toBe(true);

    await expect
      .poll(async () =>
        page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--bg-secondary")
            .trim(),
        ),
      )
      .toBe("#1e293b");

    const expectedSecondaryColor = await resolvedColorFromVar(
      page,
      "--bg-secondary",
    );
    await expect
      .poll(async () =>
        page
          .locator('[data-testid="contact-section"]')
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      )
      .toBe(expectedSecondaryColor);
  });
});
