/**
 * unbati app config — Fachada v2 AppConfig.
 *
 * Custom theme: "unbati" — dark studio aesthetic, warm earthy accents.
 * Two roles: Pintor (Painter) and Tatuador (Tattoo Artist).
 * Primary contact: WhatsApp (no email-button CTA).
 */

import { siteConfig } from "./site.config";
import { profileConfig } from "./profile.config";
export { profileConfig } from "./profile.config";
import type {
  AppConfig,
  CustomThemeDefinition,
  SiteTreeConfig,
} from "@fachada/core/types/app.types";
import type { WidgetLayoutConfig } from "@fachada/core/types/layout.types";

export const appConfig: AppConfig = {
  seo: siteConfig,
  theme: profileConfig.theme,
  themes: {
    globals: [],
    custom: {
      unbati: {
        name: "UnBati",
        description:
          "Artistic and intimate — dark studio aesthetic with warm earthy accents",
        light: {
          bgPrimary: "#F9F7F3",
          bgSecondary: "#FFFFFF",
          textPrimary: "#0A0F1C",
          textSecondary: "#5A6370",
          accent: "#E2B38D",
          accentHover: "#D4A174",
          accentSecondary: "#A3BFFA",
          border: "#E8E3D8",
          shadow: "rgba(10, 15, 28, 0.06)",
          borderRadius: "0.375rem",
          transition: "0.3s ease",
          glow: "none",
          gradient: "linear-gradient(135deg, #E2B38D 0%, #A3BFFA 100%)",
          spacingSection: "7rem",
          spacingCard: "2rem",
          spacingElement: "1.5rem",
          fontBody: "'Inter', 'Satoshi', 'Helvetica Neue', Arial, sans-serif",
          fontHeading: "'Playfair Display', 'Cinzel', 'Georgia', serif",
          fontMono: "'JetBrains Mono', 'Courier New', monospace",
          headingWeight: "400",
          bodyLineHeight: "1.8",
          contentMaxWidth: "900px",
          headingLetterSpacing: "-0.015em",
          buttonTextColor: "#0A0F1C",
          buttonTextShadow: "none",
          scanlineOpacity: "0",
        },
        dark: {
          bgPrimary: "#0A0F1C",
          bgSecondary: "#0F172A",
          textPrimary: "#E2E8F0",
          textSecondary: "#A8B2C1",
          accent: "#E2B38D",
          accentHover: "#F2C4A4",
          accentSecondary: "#A3BFFA",
          accentTertiary: "#9FB5FF",
          border: "#1A2642",
          shadow: "rgba(226, 179, 141, 0.08)",
          borderRadius: "0.375rem",
          transition: "0.3s ease",
          glow: "0 0 15px rgba(226, 179, 141, 0.15)",
          gradient: "linear-gradient(135deg, #E2B38D 0%, #A3BFFA 100%)",
          spacingSection: "7rem",
          spacingCard: "2rem",
          spacingElement: "1.5rem",
          fontBody: "'Inter', 'Satoshi', 'Helvetica Neue', Arial, sans-serif",
          fontHeading: "'Playfair Display', 'Cinzel', 'Georgia', serif",
          fontMono: "'JetBrains Mono', 'Courier New', monospace",
          headingWeight: "400",
          bodyLineHeight: "1.8",
          contentMaxWidth: "900px",
          headingLetterSpacing: "-0.015em",
          buttonTextColor: "inherit",
          buttonTextShadow: "none",
          scanlineOpacity: "0",
        },
      } satisfies CustomThemeDefinition,
    },
    default: "unbati",
  },
  themeVariants: {},
  themeLayouts: {
    unbati: {
      hero: "centered",
      skills: "grid-3",
      about: "card",
      contact: "centered",
    } satisfies WidgetLayoutConfig,
  },
  assets: {
    ogImage: siteConfig.ogImage,
  },
  siteTree: {
    landing: {
      meta: {
        path: "/",
        title: siteConfig.title,
        description: siteConfig.description,
        keywords: [
          "pintor uruguayo",
          "tatuador Maldonado",
          "cuadros Uruguay",
          "tatuajes personalizados",
          "UnBati",
          "Henrys Batista",
          "pintura acrílico Uruguay",
        ],
        llmSummary:
          "UnBati es la marca de Henrys Batista, artista plástico y tatuador uruguayo. " +
          "Pinta paisajes del interior y la costa de Uruguay. Tatúa de forma personalizada en Maldonado. " +
          "Más de 15 años de trayectoria.",
      },
      template: "landing",
      templateData: {
        hook: "Pintura. Tatuaje. Alma uruguaya.",
        subheading:
          "Desde Young hasta Maldonado. Paisajes que cuentan historias y tatuajes que se llevan en la piel.",
        ctaHeading: "¿Tenés algo en mente?",
        ctaMessage: "Escribime por WhatsApp. Respondo rápido y sin rollos.",
        ctaLabel: "Escribime",
      },
      sections: [
        { id: "hero", order: 1, enabled: true },
        { id: "role-explorer", order: 2, enabled: true },
        { id: "contact", order: 3, enabled: true },
      ],
      subsections: [
        {
          id: "pinturas",
          meta: {
            path: "/pinturas",
            title: "UnBati — Pinturas y obra plástica",
            description:
              "Pinturas de paisajes uruguayos en acrílico, óleo y aerografía. Cuadros listos para colgar con barniz protector. Envíos a todo Uruguay.",
            keywords: [
              "pintor Young Uruguay",
              "cuadros paisajes uruguayos",
              "pintura acrílico Uruguay",
              "cuadros rurales Uruguay",
              "comprar cuadros Uruguay",
              "UnBati pinturas",
            ],
            llmSummary:
              "Galería de pinturas de UnBati (Henrys Batista). " +
              "Obras en acrílico, óleo y aerografía con temáticas de paisajes del campo y la costa uruguaya. " +
              "Envíos a todo Uruguay. Trabajos por encargo disponibles.",
          },
          template: "role",
          templateData: {
            roleId: "pinturas",
            heroStyle: "atmospheric",
            showBreadcrumb: true,
            contactLayout: "centered",
            scrollCta: "↓ Ver las obras",
            galleryLabel: "Obras",
            skillsLabel: "Técnicas",
            bioLabel: "Mi proceso",
            contactMessage:
              "¿Te gusta una obra o querés algo por encargo? Escribime por WhatsApp.",
          },
          sections: [
            { id: "hero", order: 1, enabled: true },
            { id: "skills", order: 2, enabled: true },
            { id: "contact", order: 3, enabled: true },
          ],
        },
        {
          id: "tatuajes",
          meta: {
            path: "/tatuajes",
            title: "UnBati — La Tatuajería · Maldonado",
            description:
              "Tatuajes personalizados en Maldonado. Black & grey, retratos, coberturas. Diseño directo en piel. Todo material descartable. Higiene máxima.",
            keywords: [
              "tatuador Maldonado",
              "tatuajes personalizados Uruguay",
              "black grey Maldonado",
              "tatuador retratos Uruguay",
              "tatuajes Punta del Este",
              "UnBati tatuajes",
            ],
            llmSummary:
              "UnBati tatúa de forma personalizada en Maldonado, Uruguay. " +
              "Especialidad en black & grey, retratos y coberturas. " +
              "Diseño directo en piel, sin plantillas genéricas. Material descartable e higiene certificada.",
          },
          template: "role",
          templateData: {
            roleId: "tatuajes",
            heroStyle: "split",
            showBreadcrumb: true,
            contactLayout: "split",
            galleryLabel: "Trabajos",
            skillsLabel: "Especialidades",
            bioLabel: "Cómo trabajo",
            contactMessage:
              "Traé tu idea y la hacemos realidad. Escribime por WhatsApp para coordinar tu turno.",
          },
          sections: [
            { id: "hero", order: 1, enabled: true },
            { id: "skills", order: 2, enabled: true },
            { id: "contact", order: 3, enabled: true },
          ],
        },
      ],
    },
  } satisfies SiteTreeConfig,
  page: {
    sections: profileConfig.sections.map((s) => ({ ...s, widgets: [] })),
  },
};
