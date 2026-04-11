import { ThemeProvider } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import ThemeSwitcher from './ThemeSwitcher';
import type { ReactNode } from 'react';

interface ThemeVariantDef {
    tokens?: Record<string, any>;
}

interface LayoutWrapperProps {
    children: ReactNode;
    enableModeToggle?: boolean;
    enableStyleSwitcher?: boolean;
    appThemeVariants?: Record<string, ThemeVariantDef>;
    /** Default theme to load when no stored preference */
    defaultTheme?: string;
}

/**
 * LayoutWrapper
 * Root-level React island that provides a single ThemeProvider for the entire page.
 * ThemeToggle and ThemeSwitcher are rendered inside the same provider so they share
 * context state without cross-tab storage sync.
 * 
 * Note: availableThemes are accessed from window.__FACHADA_THEME_POOL__ which is set
 * by BaseLayout.astro before React hydrates, ensuring custom themes are available.
 */
export default function LayoutWrapper({
    children,
    enableModeToggle,
    enableStyleSwitcher,
    appThemeVariants = {},
    defaultTheme = 'minimalist',
}: LayoutWrapperProps) {
    return (
        <ThemeProvider defaultTheme={defaultTheme}>
            {children}
            {enableModeToggle && <ThemeToggle />}
            {enableStyleSwitcher && <ThemeSwitcher />}
        </ThemeProvider>
    );
}

