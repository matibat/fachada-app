/**
 * artist-engineer app config — Fachada v2 AppConfig package.
 *
 * Imports the artist-engineer profile configs (site + profile).
 * Adds 3 custom themes: minimal (clean/cool), warm (personal/human), bold (professional/strong).
 * Default theme: minimal
 *
 * Custom themes extend the global theme pool and are validated at build time for:
 * - Name collisions (custom theme name cannot override a global theme)
 * - defaultTheme existence (must be in the merged pool)
 * - Complete light/dark token sets (not partial overlays)
 */

import { siteConfig } from "./site.config";
import { profileConfig } from "./profile.config";
import type {
  AppConfig,
  CustomThemeDefinition,
  SiteTreeConfig,
} from "../../src/types/app.types";
import type { WidgetLayoutConfig } from "../../src/types/layout.types";

export const appConfig: AppConfig = {
  seo: siteConfig,
  theme: profileConfig.theme,
  themes: {
    custom: {
      minimal: {
        name: "Minimal",
        description: "Clean and precise — cool sky blue accents",
        light: {
          bgPrimary: "#FFFFFF",
          bgSecondary: "#F8FAFC",
          textPrimary: "#0F172A",
          textSecondary: "#475569",
          accent: "#0EA5E9",
          accentHover: "#06B6D4",
          accentSecondary: "#06B6D4",
          accentTertiary: "#0284C7",
          border: "#E2E8F0",
          shadow: "rgba(0, 0, 0, 0.06)",
          borderRadius: "12px",
          transition: "0.25s ease-out",
          glow: "0 0 20px rgba(6, 182, 212, 0.2)",
          gradient: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
          spacingSection: "5rem",
          spacingCard: "1.75rem",
          spacingElement: "1.25rem",
          fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontHeading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontMono: "'JetBrains Mono', monospace",
          headingWeight: "600",
          bodyLineHeight: "1.7",
          contentMaxWidth: "960px",
          headingLetterSpacing: "-0.01em",
          buttonTextColor: "#0F172A",
          buttonTextShadow: "none",
          scanlineOpacity: "0",
        },
        dark: {
          bgPrimary: "#0F172A",
          bgSecondary: "#1E293B",
          textPrimary: "#F1F5F9",
          textSecondary: "#CBD5E1",
          accent: "#06D6FF",
          accentHover: "#00BBDF",
          accentSecondary: "#06D6FF",
          accentTertiary: "#0891B2",
          border: "#334155",
          shadow: "rgba(6, 214, 255, 0.15)",
          borderRadius: "12px",
          transition: "0.25s ease-out",
          glow: "0 0 20px rgba(6, 214, 255, 0.3)",
          gradient: "linear-gradient(135deg, #06D6FF 0%, #0891B2 100%)",
          spacingSection: "5rem",
          spacingCard: "1.75rem",
          spacingElement: "1.25rem",
          fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontHeading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontMono: "'JetBrains Mono', monospace",
          headingWeight: "600",
          bodyLineHeight: "1.7",
          contentMaxWidth: "960px",
          headingLetterSpacing: "-0.01em",
          buttonTextColor: "#F1F5F9",
          buttonTextShadow: "none",
          scanlineOpacity: "0",
        },
      } as CustomThemeDefinition,
      warm: {
        name: "Warm",
        description: "Personal and human — warm amber accents",
        light: {
          bgPrimary: "#FFFBF0",
          bgSecondary: "#FFF7ED",
          textPrimary: "#451A03",
          textSecondary: "#92400E",
          accent: "#D97706",
          accentHover: "#F59E0B",
          accentSecondary: "#F97316",
          accentTertiary: "#DC2626",
          border: "#FDBF7D",
          shadow: "rgba(217, 119, 6, 0.1)",
          borderRadius: "16px",
          transition: "0.25s ease-out",
          glow: "0 0 20px rgba(217, 119, 6, 0.15)",
          gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
          spacingSection: "5rem",
          spacingCard: "1.75rem",
          spacingElement: "1.25rem",
          fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontHeading: "'Playfair Display', 'Georgia', serif",
          fontMono: "'JetBrains Mono', monospace",
          headingWeight: "600",
          bodyLineHeight: "1.85",
          contentMaxWidth: "960px",
          headingLetterSpacing: "-0.01em",
          buttonTextColor: "#451A03",
          buttonTextShadow: "none",
          scanlineOpacity: "0",
        },
        dark: {
          bgPrimary: "#2F1601",
          bgSecondary: "#422006",
          textPrimary: "#FED7AA",
          textSecondary: "#FDBA74",
          accent: "#F97316",
          accentHover: "#FB923C",
          accentSecondary: "#FCA5A5",
          accentTertiary: "#FCA5A5",
          border: "#D97706",
          shadow: "rgba(249, 115, 22, 0.15)",
          borderRadius: "16px",
          transition: "0.25s ease-out",
          glow: "0 0 20px rgba(249, 115, 22, 0.25)",
          gradient: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
          spacingSection: "5rem",
          spacingCard: "1.75rem",
          spacingElement: "1.25rem",
          fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontHeading: "'Playfair Display', 'Georgia', serif",
          fontMono: "'JetBrains Mono', monospace",
          headingWeight: "600",
          bodyLineHeight: "1.85",
          contentMaxWidth: "960px",
          headingLetterSpacing: "-0.01em",
          buttonTextColor: "#FED7AA",
          buttonTextShadow: "none",
          scanlineOpacity: "0",
        },
      } as CustomThemeDefinition,
      bold: {
        name: "Bold",
        description: "Professional and strong — vibrant purple accents",
        light: {
          bgPrimary: "#FAFAFA",
          bgSecondary: "#F4F4F5",
          textPrimary: "#1F2937",
          textSecondary: "#4B5563",
          accent: "#A855F7",
          accentHover: "#D946EF",
          accentSecondary: "#D946EF",
          accentTertiary: "#C084FC",
          border: "#D8BFD8",
          shadow: "rgba(168, 85, 247, 0.12)",
          borderRadius: "8px",
          transition: "0.25s ease-out",
          glow: "0 0 30px rgba(168, 85, 247, 0.2)",
          gradient: "linear-gradient(135deg, #A855F7 0%, #D946EF 100%)",
          spacingSection: "5rem",
          spacingCard: "1.75rem",
          spacingElement: "1.25rem",
          fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontHeading: "'Space Grotesk', 'Inter', sans-serif",
          fontMono: "'JetBrains Mono', monospace",
          headingWeight: "700",
          bodyLineHeight: "1.7",
          contentMaxWidth: "960px",
          headingLetterSpacing: "-0.02em",
          buttonTextColor: "#1F2937",
          buttonTextShadow: "none",
          scanlineOpacity: "0",
        },
        dark: {
          bgPrimary: "#1E1E1E",
          bgSecondary: "#2D2D2D",
          textPrimary: "#F5F5F5",
          textSecondary: "#E0E0E0",
          accent: "#D946EF",
          accentHover: "#F472B6",
          accentSecondary: "#E879F9",
          accentTertiary: "#C084FC",
          border: "#6B21A8",
          shadow: "rgba(217, 70, 239, 0.2)",
          borderRadius: "8px",
          transition: "0.25s ease-out",
          glow: "0 0 30px rgba(217, 70, 239, 0.3)",
          gradient: "linear-gradient(135deg, #D946EF 0%, #F472B6 100%)",
          spacingSection: "5rem",
          spacingCard: "1.75rem",
          spacingElement: "1.25rem",
          fontBody: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontHeading: "'Space Grotesk', 'Inter', sans-serif",
          fontMono: "'JetBrains Mono', monospace",
          headingWeight: "700",
          bodyLineHeight: "1.7",
          contentMaxWidth: "960px",
          headingLetterSpacing: "-0.02em",
          buttonTextColor: "#F5F5F5",
          buttonTextShadow: "none",
          scanlineOpacity: "0",
        },
      } as CustomThemeDefinition,
    },
    default: "minimal",
  },
  themeLayouts: {
    /*
     * minimal — clean, cool, sans-serif (Inter): the engineer's precision.
     * Landing uses a split hero with 2-col projects and grid-3 skills.
     * Subsection pages (engineering/art) have their own inline layouts and
     * are not controlled by themeLayouts; these settings apply to the landing
     * page LayoutWrapper only.
     */
    minimal: {
      hero: "split",
      skills: "grid-3",
      projects: "grid-3",
    } satisfies WidgetLayoutConfig,
    /*
     * warm — personal, human, serif (Playfair Display): the artist's silence.
     * Landing shifts to a centred hero; projects shown as a vertical list
     * so images breathe. Skills as a narrative list mirrors the contemplative tone.
     */
    warm: {
      hero: "centered",
      skills: "list",
      projects: "grid-2",
    } satisfies WidgetLayoutConfig,
    /*
     * bold — professional, strong, Space Grotesk: sharp and structured.
     * Split hero for authority. 3-col projects grid for density. 2-col skills
     * for clean panel pairings.
     */
    bold: {
      hero: "split",
      skills: "grid-2",
      projects: "grid-3",
    } satisfies WidgetLayoutConfig,
  },
  themeVariants: {},
  assets: {
    ogImage: siteConfig.ogImage,
  },
  siteTree: {
    landing: {
      meta: {
        path: "/",
        title: `${siteConfig.name} — Engineer & Artist`,
        description:
          "Software engineer and digital artist. TypeScript, WebGL, React by day — generative art, 3D sculpture, creative code by night.",
        keywords: [
          "software engineer digital artist",
          "TypeScript developer",
          "WebGL engineer",
          "React portfolio",
          "generative art",
          "creative code",
        ],
        llmSummary:
          `${siteConfig.name} is a software engineer and digital artist. ` +
          "The landing page presents both professional identities with featured work from engineering and art, " +
          "and links to dedicated sections for each discipline.",
      },
      sections: [
        { id: "hero", order: 1, enabled: true },
        { id: "role-explorer", order: 2, enabled: true },
        { id: "projects", order: 3, enabled: true },
        { id: "contact", order: 4, enabled: true },
      ],
      subsections: [
        {
          id: "engineering",
          meta: {
            path: "/engineering",
            title: `${siteConfig.name} — Software Engineer`,
            description:
              "Software engineering portfolio: real-time 3D web systems, TypeScript, WebGL, React, Node.js, and open source projects.",
            keywords: [
              "software engineer for hire",
              "TypeScript engineer",
              "WebGL developer",
              "React Node.js portfolio",
              "full-stack engineer",
              "real-time 3D web",
            ],
            llmSummary:
              `${siteConfig.name}'s engineering portfolio. ` +
              "Specialises in TypeScript, WebGL, React, and Node.js. " +
              "Showcases real-time 3D web systems, backend architecture, and open source work. " +
              "Available for engineering contracts.",
          },
          sections: [
            { id: "hero", order: 1, enabled: true },
            { id: "projects", order: 2, enabled: true },
            { id: "skills", order: 3, enabled: true },
            { id: "contact", order: 4, enabled: true },
          ],
        },
        {
          id: "art",
          meta: {
            path: "/art",
            title: `${siteConfig.name} — Digital Art & Creative Code`,
            description:
              "Digital art and creative code portfolio: generative systems, 3D sculpture, GLSL shaders, and large-format archival prints.",
            keywords: [
              "generative art",
              "creative code artwork",
              "3D digital sculpture",
              "algorithmic art prints",
              "GLSL shader art",
              "Blender digital art",
            ],
            llmSummary:
              `${siteConfig.name}'s art and creative code portfolio. ` +
              "Works include generative systems, 3D sculpture (Blender, Houdini), GLSL shader experiments, " +
              "and large-format archival prints. Open to commissions and creative technology collaborations.",
          },
          sections: [
            { id: "hero", order: 1, enabled: true },
            { id: "projects", order: 2, enabled: true },
            { id: "skills", order: 3, enabled: true },
            { id: "contact", order: 4, enabled: true },
          ],
        },
      ],
    },
  } satisfies SiteTreeConfig,
  page: {
    sections: profileConfig.sections.map((s) => ({ ...s, widgets: [] })),
  },
};
