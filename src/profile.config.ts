/** Profile configuration — controls which theme is active and which widgets are enabled. */

import type { ThemeStyle, ColorMode } from "./utils/theme.config";

export type { ThemeStyle, ColorMode };

export interface ProfileConfig {
  theme: {
    /** Visual style — controls colors, spacing, and effects. */
    style: ThemeStyle;
    /** Default color mode on first visit. */
    defaultMode: ColorMode | "system";
    /** Show the theme style switcher widget. */
    enableStyleSwitcher: boolean;
    /** Show the dark/light mode toggle. */
    enableModeToggle: boolean;
  };
}

export const profileConfig: ProfileConfig = {
  theme: {
    style: "minimalist",
    defaultMode: "system",
    enableStyleSwitcher: true,
    enableModeToggle: true,
  },
} as const;
