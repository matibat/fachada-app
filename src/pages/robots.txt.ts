import { siteConfig } from "../config";
import { getActiveAppConfig } from "../core/app/AppLoader";
import { generateRobotsTxt } from "../core/site-tree/RobotsGenerator";

export async function GET() {
  const appConfig = getActiveAppConfig();

  const robotsTxt = appConfig.siteTree
    ? generateRobotsTxt(appConfig.siteTree, siteConfig.url)
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap-index.xml", siteConfig.url).href}`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
