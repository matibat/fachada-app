import { defineConfig } from "vitest/config";
import path from "path";
import { fachadaPlugin } from "../fachada-core/src/vite/fachada-plugin";

export default defineConfig({
  plugins: [fachadaPlugin()],
  resolve: {
    alias: {
      "@fachada/core": path.resolve("/Users/mati/workspace/fachada-core/src"),
    },
  },
  test: {
    environment: "happy-dom",
    exclude: ["node_modules", "dist", ".astro", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".astro/",
        "dist/",
        "**/*.config.*",
        "**/*.d.ts",
        ".pnp.cjs",
        ".pnp.loader.mjs",
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
    globals: true,
  },
});
