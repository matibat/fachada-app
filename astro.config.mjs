// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { fachadaIntegration } from "@fachada/core/astro";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://matibat.github.io",
  base: process.env.BASE_URL || "/",
  integrations: [fachadaIntegration(), react(), sitemap(), tailwind({ applyBaseStyles: false })],
});
