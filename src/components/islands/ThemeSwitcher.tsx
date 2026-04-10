import { useState, useEffect, useRef } from 'react';
import { THEME_DEFINITIONS, THEME_STYLES, type ThemeStyle } from '../../utils/theme.config';
import { useTheme, useThemeActions } from '../../context/ThemeContext';
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

export default function ThemeSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { styleTheme } = useTheme();
    const { setStyleTheme } = useThemeActions();

    const handleStyleChange = async (style: ThemeStyle) => {
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
                        {THEME_STYLES.map((style) => {
                            const meta = THEME_DEFINITIONS[style];
                            const isActive = styleTheme === style;

                            return (
                                <StyledOptionButton
                                    key={style}
                                    $isActive={isActive}
                                    aria-pressed={isActive}
                                    onClick={() => handleStyleChange(style)}
                                >
                                    <StyledOptionName>{meta.name}</StyledOptionName>
                                    <StyledOptionDescription>{meta.description}</StyledOptionDescription>
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

