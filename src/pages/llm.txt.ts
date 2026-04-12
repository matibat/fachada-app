/**
 * /llm.txt — AI-readable site description.
 *
 * Follows the llms.txt specification (https://llmstxt.org).
 * Generated from AppConfig.siteTree when present; falls back to a minimal
 * representation using SiteConfig identity and description.
 */
import { siteConfig } from "../config";
import { getActiveAppConfig } from "../core/app/AppLoader";
import { generateLlmTxt } from "../core/site-tree/LlmTextGenerator";

export async function GET() {
  const appConfig = getActiveAppConfig();

  const llmTxt = appConfig.siteTree
    ? generateLlmTxt(siteConfig, appConfig.siteTree)
    : `# ${siteConfig.name}\n\n> ${siteConfig.description}`;

  return new Response(llmTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
