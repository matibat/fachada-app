import { test, expect, type Page, type BrowserContext } from "@playwright/test";

async function clearAndOpen(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
}

async function selectTheme(page: Page, name: string) {
  await page.getByRole("button", { name: /change theme style/i }).click();
  await page.locator("button", { hasText: name }).first().click();
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

test.describe("Theme Integration E2E", () => {
  test("Given two tabs in same context, When tab 1 updates theme and mode, Then tab 2 syncs data-theme and dark class", async ({
    context,
  }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await clearAndOpen(page1);
    await page2.goto("/");
    await page2.waitForLoadState("networkidle");

    await selectTheme(page1, "Modern Tech");
    await page1.getByRole("button", { name: /current mode/i }).click();

    const html2 = page2.locator("html");

    await expect
      .poll(async () => html2.getAttribute("data-theme"))
      .toBe("modern-tech");
    await expect
      .poll(async () => html2.evaluate((el) => el.classList.contains("dark")))
      .toBe(true);

    const accent2 = await page2.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim(),
    );
    expect(accent2).toBe("#00f5ff");

    await page1.close();
    await page2.close();
  });

  test("Given persisted vaporwave dark settings before navigation, When page loads, Then first paint already uses persisted mode and style tokens", async ({
    browser,
  }) => {
    const isolatedContext: BrowserContext = await browser.newContext();
    await isolatedContext.addInitScript(() => {
      localStorage.setItem("theme", JSON.stringify("dark"));
      localStorage.setItem("themeStyle", JSON.stringify("vaporwave"));
    });

    const page = await isolatedContext.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "vaporwave");
    await expect
      .poll(async () => html.evaluate((el) => el.classList.contains("dark")))
      .toBe(true);

    await expect
      .poll(async () =>
        page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--bg-primary")
            .trim(),
        ),
      )
      .toBe("#1a0033");
    await expect
      .poll(async () =>
        page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--accent")
            .trim(),
        ),
      )
      .toBe("#ff00ff");

    const expectedAccentColor = await resolvedColorFromVar(page, "--accent");
    await expect
      .poll(async () =>
        page
          .locator(".hero-primary-cta")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      )
      .toBe(expectedAccentColor);

    await isolatedContext.close();
  });
});
