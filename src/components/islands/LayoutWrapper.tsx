import { ThemeProvider } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import ThemeSwitcher from './ThemeSwitcher';
import type { ReactNode } from 'react';

interface LayoutWrapperProps {
    children: ReactNode;
    enableModeToggle?: boolean;
    enableStyleSwitcher?: boolean;
}

/**
 * LayoutWrapper
 * Root-level React island that provides a single ThemeProvider for the entire page.
 * ThemeToggle and ThemeSwitcher are rendered inside the same provider so they share
 * context state without cross-tab storage sync.
 */
export default function LayoutWrapper({ children, enableModeToggle, enableStyleSwitcher }: LayoutWrapperProps) {
    return (
        <ThemeProvider>
            {children}
            {enableModeToggle && <ThemeToggle />}
            {enableStyleSwitcher && <ThemeSwitcher />}
        </ThemeProvider>
    );
}

