import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "yarn dev --port 5432",
      url: "http://localhost:5432",
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: "APP=artist-engineer yarn dev --port 5433",
      url: "http://localhost:5433",
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
  projects: [
    {
      name: "default-fachada-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5432" },
      testMatch: ["**/theme.spec.ts", "**/default-skin.spec.ts"],
    },
    {
      name: "default-fachada-firefox",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:5432" },
      testMatch: ["**/theme.spec.ts", "**/default-skin.spec.ts"],
    },
    {
      name: "artist-engineer-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5433" },
      testMatch: "**/theme-artist-engineer.spec.ts",
    },
  ],
});
