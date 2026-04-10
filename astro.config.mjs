// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const activeProfile = process.env.PROFILE || "default-fachada";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://fachada.dev",
  integrations: [react(), sitemap(), tailwind({ applyBaseStyles: false })],
  vite: {
    define: {
      // Expose the active profile name to import.meta.env at build time
      "import.meta.env.PROFILE": JSON.stringify(activeProfile),
    },
  },
});
