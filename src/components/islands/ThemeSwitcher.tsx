import { useState, useEffect, useRef } from 'react';
import { useTheme, useThemeActions } from '../../context/ThemeContext';
import type { ThemeDefinition } from '../../utils/theme.config';
import { THEME_DEFINITIONS } from '../../utils/theme.config';
import {
    StyledWrapper,
    StyledTriggerButton,
    StyledDropdown,
    StyledDropdownHeader,
    StyledDropdownTitle,
    StyledOptionsList,
    StyledOptionButton,
    StyledOptionName,
    StyledOptionDescription,
    StyledDropdownFooter,
    StyledCloseButton,
    StyledErrorBanner,
    StyledErrorText,
} from './ThemeSwitcher.styles';

/**
 * Reads the resolved theme pool from window.__FACHADA_THEME_POOL__, which is
 * set by BaseLayout.astro before React hydrates.
 * Falls back to THEME_DEFINITIONS when the window global is absent (SSR / tests).
 */
function getThemesFromWindow(): Record<string, ThemeDefinition> {
    if (typeof window !== 'undefined' && (window as any).__FACHADA_THEME_POOL__) {
        const pool = (window as any).__FACHADA_THEME_POOL__;
        if (Object.keys(pool).length > 0) return pool;
    }
    return THEME_DEFINITIONS;
}

/**
 * ThemeSwitcher
 *
 * Reads the available themes from window.__FACHADA_THEME_POOL__ (set by
 * BaseLayout.astro before hydration) and renders a dropdown for all of them.
 */
export default function ThemeSwitcher() {
    const availableThemes = getThemesFromWindow();
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { styleTheme } = useTheme();
    const { setStyleTheme } = useThemeActions();

    const handleStyleChange = async (style: string) => {
        try {
            setError(null);
            await setStyleTheme(style);
            setIsOpen(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update theme';
            setError(message);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <StyledWrapper ref={wrapperRef}>
            <StyledTriggerButton
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change theme style"
                aria-expanded={isOpen}
            >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            </StyledTriggerButton>

            {isOpen && (
                <StyledDropdown>
                    <StyledDropdownHeader>
                        <StyledDropdownTitle>Select Style</StyledDropdownTitle>
                    </StyledDropdownHeader>

                    {error && (
                        <StyledErrorBanner>
                            <StyledErrorText>{error}</StyledErrorText>
                        </StyledErrorBanner>
                    )}

                    <StyledOptionsList>
                        {Object.entries(availableThemes).map(([key, theme]) => {
                            const isActive = styleTheme === key;
                            return (
                                <StyledOptionButton
                                    key={key}
                                    $isActive={isActive}
                                    aria-pressed={isActive}
                                    onClick={() => handleStyleChange(key)}
                                >
                                    <StyledOptionName>{theme.name}</StyledOptionName>
                                    <StyledOptionDescription>{theme.description}</StyledOptionDescription>
                                </StyledOptionButton>
                            );
                        })}
                    </StyledOptionsList>

                    <StyledDropdownFooter>
                        <StyledCloseButton onClick={() => setIsOpen(false)}>
                            Close
                        </StyledCloseButton>
                    </StyledDropdownFooter>
                </StyledDropdown>
            )}
        </StyledWrapper>
    );
}

