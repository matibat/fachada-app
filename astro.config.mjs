// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// APP (v2) takes precedence; PROFILE (v1) is kept for backward compatibility
const activeApp = process.env.APP || process.env.PROFILE || "default-fachada";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://fachada.dev",
  integrations: [react(), sitemap(), tailwind({ applyBaseStyles: false })],
  vite: {
    define: {
      // Expose the active app name to import.meta.env at build time
      "import.meta.env.APP": JSON.stringify(activeApp),
      // Backward compat: PROFILE still resolves to the active app name
      "import.meta.env.PROFILE": JSON.stringify(activeApp),
    },
  },
});
