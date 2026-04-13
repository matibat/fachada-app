// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { fachadaPlugin } from "@fachada/core/vite/fachada-plugin";

// APP environment variable selects the active app at build time.
// Defaults to 'default-fachada' if not set.
const activeApp = process.env.APP || "default-fachada";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://matibat.github.io",
  base: process.env.BASE_URL || "/",
  integrations: [react(), sitemap(), tailwind({ applyBaseStyles: false })],
  vite: {
    plugins: [fachadaPlugin(activeApp)],
    define: {
      // Expose the active app name to import.meta.env at build time
      "import.meta.env.APP": JSON.stringify(activeApp),
    },
  },
});
