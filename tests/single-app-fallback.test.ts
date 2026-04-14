import { describe, it, expect } from "vitest";
import { readFachadarc, resolveAppName } from "@fachada/core/vite/fachada-plugin";

describe("Single-app layout fallback", () => {
  it("exposes 'app' when app/app.config.ts exists", () => {
    const fachadarc = readFachadarc(process.cwd());
    expect(Object.keys(fachadarc.apps).length).toBeGreaterThan(0);
    expect(fachadarc.apps).toHaveProperty("app");
  });

  it("resolveAppName falls back to defaultApp when unknown", () => {
    const fachadarc = readFachadarc(process.cwd());
    const resolved = resolveAppName("nonexistent-app", fachadarc);
    expect(resolved).toBe(fachadarc.defaultApp);
  });
});
