/**
 * Theme configuration — single source of truth for all visual theme definitions.
 * Each theme defines light and dark token sets that ThemeProvider applies as CSS custom properties.
 */

export type ThemeStyle =
  | "minimalist"
  | "modern-tech"
  | "professional"
  | "vaporwave";
export type ColorMode = "light" | "dark" | "auto";

export interface ThemeTokens {
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  accentSecondary?: string;
  accentTertiary?: string;
  border: string;
  shadow: string;
  borderRadius: string;
  transition: string;
  glow: string;
  gradient: string;
  spacingSection: string;
  spacingCard: string;
  spacingElement: string;
}

export interface ThemeDefinition {
  name: string;
  description: string;
  light: ThemeTokens;
  dark: ThemeTokens;
}

/** Maps ThemeTokens keys to CSS custom property names. */
export const CSS_VAR_MAP: Record<keyof ThemeTokens, string> = {
  bgPrimary: "--bg-primary",
  bgSecondary: "--bg-secondary",
  textPrimary: "--text-primary",
  textSecondary: "--text-secondary",
  accent: "--accent",
  accentHover: "--accent-hover",
  accentSecondary: "--accent-secondary",
  accentTertiary: "--accent-tertiary",
  border: "--border",
  shadow: "--shadow",
  borderRadius: "--border-radius",
  transition: "--transition",
  glow: "--glow",
  gradient: "--gradient",
  spacingSection: "--spacing-section",
  spacingCard: "--spacing-card",
  spacingElement: "--spacing-element",
};

export const THEME_DEFINITIONS: Record<ThemeStyle, ThemeDefinition> = {
  minimalist: {
    name: "Minimalist",
    description: "Maximum simplicity, generous whitespace, content-first",
    light: {
      bgPrimary: "#ffffff",
      bgSecondary: "#f8f9fa",
      textPrimary: "#111111",
      textSecondary: "#666666",
      accent: "#6b7280",
      accentHover: "#4b5563",
      border: "#e5e7eb",
      shadow: "rgba(0, 0, 0, 0.05)",
      borderRadius: "0.5rem",
      transition: "0.2s ease",
      glow: "none",
      gradient: "none",
      spacingSection: "8rem",
      spacingCard: "2rem",
      spacingElement: "1.5rem",
    },
    dark: {
      bgPrimary: "#0a0a0a",
      bgSecondary: "#111111",
      textPrimary: "#eeeeee",
      textSecondary: "#999999",
      accent: "#9ca3af",
      accentHover: "#d1d5db",
      border: "#1f2937",
      shadow: "rgba(255, 255, 255, 0.05)",
      borderRadius: "0.5rem",
      transition: "0.2s ease",
      glow: "none",
      gradient: "none",
      spacingSection: "8rem",
      spacingCard: "2rem",
      spacingElement: "1.5rem",
    },
  },

  "modern-tech": {
    name: "Modern Tech",
    description: "Futuristic and dynamic with an advanced-technology feel",
    light: {
      bgPrimary: "#ffffff",
      bgSecondary: "#f9fafb",
      textPrimary: "#0f0f0f",
      textSecondary: "#6b7280",
      accent: "#3b82f6",
      accentHover: "#2563eb",
      accentSecondary: "#8b5cf6",
      border: "#e5e7eb",
      shadow: "rgba(59, 130, 246, 0.1)",
      borderRadius: "0.75rem",
      transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      glow: "0 0 20px rgba(59, 130, 246, 0.3)",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      spacingSection: "6rem",
      spacingCard: "1.5rem",
      spacingElement: "1rem",
    },
    dark: {
      bgPrimary: "#0f0f0f",
      bgSecondary: "#1a1a1a",
      textPrimary: "#f9fafb",
      textSecondary: "#9ca3af",
      accent: "#00f5ff",
      accentHover: "#00d9e8",
      accentSecondary: "#ff00aa",
      accentTertiary: "#39ff14",
      border: "#2d2d2d",
      shadow: "rgba(0, 245, 255, 0.2)",
      borderRadius: "0.75rem",
      transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      glow: "0 0 30px rgba(0, 245, 255, 0.4)",
      gradient: "linear-gradient(135deg, #00f5ff 0%, #ff00aa 100%)",
      spacingSection: "6rem",
      spacingCard: "1.5rem",
      spacingElement: "1rem",
    },
  },

  professional: {
    name: "Professional",
    description: "Corporate yet modern — clean, structured, and trustworthy",
    light: {
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      textPrimary: "#222222",
      textSecondary: "#64748b",
      accent: "#0055ff",
      accentHover: "#0044cc",
      accentSecondary: "#00aa77",
      border: "#e2e8f0",
      shadow: "rgba(0, 0, 0, 0.08)",
      borderRadius: "0.5rem",
      transition: "0.25s ease-out",
      glow: "none",
      gradient: "none",
      spacingSection: "5rem",
      spacingCard: "1.75rem",
      spacingElement: "1.25rem",
    },
    dark: {
      bgPrimary: "#0f172a",
      bgSecondary: "#1e293b",
      textPrimary: "#f1f5f9",
      textSecondary: "#94a3b8",
      accent: "#3b82f6",
      accentHover: "#60a5fa",
      accentSecondary: "#10b981",
      border: "#334155",
      shadow: "rgba(59, 130, 246, 0.15)",
      borderRadius: "0.5rem",
      transition: "0.25s ease-out",
      glow: "none",
      gradient: "none",
      spacingSection: "5rem",
      spacingCard: "1.75rem",
      spacingElement: "1.25rem",
    },
  },

  vaporwave: {
    name: "Vaporwave",
    description:
      "Retro-futuristic 80s/90s nostalgia with a cyber-Japanese aesthetic",
    light: {
      bgPrimary: "#ffd6e8",
      bgSecondary: "#d4f1f4",
      textPrimary: "#2d1b4e",
      textSecondary: "#6b4d8a",
      accent: "#ff00ff",
      accentHover: "#cc00cc",
      accentSecondary: "#00ffff",
      accentTertiary: "#ffff00",
      border: "#b794f4",
      shadow: "rgba(255, 0, 255, 0.2)",
      borderRadius: "1rem",
      transition: "0.35s ease-in-out",
      glow: "0 0 40px rgba(255, 0, 255, 0.5)",
      gradient:
        "linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)",
      spacingSection: "6rem",
      spacingCard: "2rem",
      spacingElement: "1.5rem",
    },
    dark: {
      bgPrimary: "#1a0033",
      bgSecondary: "#2d0052",
      textPrimary: "#ffd6e8",
      textSecondary: "#d4a5f9",
      accent: "#ff00ff",
      accentHover: "#ff4dff",
      accentSecondary: "#00ffff",
      accentTertiary: "#ffff00",
      border: "#6b2e8a",
      shadow: "rgba(255, 0, 255, 0.3)",
      borderRadius: "1rem",
      transition: "0.35s ease-in-out",
      glow: "0 0 50px rgba(255, 0, 255, 0.6)",
      gradient:
        "linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)",
      spacingSection: "6rem",
      spacingCard: "2rem",
      spacingElement: "1.5rem",
    },
  },
};

export const THEME_STYLES = Object.keys(THEME_DEFINITIONS) as ThemeStyle[];

/** Returns the active token set for a given style and effective color mode. */
export function getActiveTokens(
  styleTheme: ThemeStyle,
  effectiveColorMode: "light" | "dark",
): ThemeTokens {
  return THEME_DEFINITIONS[styleTheme][effectiveColorMode];
}
