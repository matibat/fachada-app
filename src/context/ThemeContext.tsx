'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import type {
    ColorMode,
    ThemeStyle,
    ThemeError,
    ThemeDependencies,
} from '../utils/theme.types';
import type { ThemeTokens } from '../utils/theme.config';
import { getActiveTokens, CSS_VAR_MAP } from '../utils/theme.config';
import {
    validateColorMode,
    validateThemeStyle,
    getSystemPreference,
    readFromStorage,
    writeToStorage,
} from '../utils/theme.utils';

/**
 * Theme context state interface
 */
export interface ThemeContextState {
    /** Current color mode (light/dark/auto) */
    colorMode: ColorMode;

    /** Resolved effective theme (considering auto preference) */
    effectiveColorMode: 'light' | 'dark';

    /** Current style theme */
    styleTheme: ThemeStyle;

    /** Whether client-side initialization has completed */
    isInitialized: boolean;

    /** Sync status with storage */
    syncStatus: 'synced' | 'pending' | 'error';

    /** Last error that occurred during theme operations */
    lastError: ThemeError | null;

    /** Active theme tokens derived from current style and color mode */
    activeTokens: ThemeTokens;
}

/**
 * Actions available through useThemeActions hook
 */
export interface ThemeActions {
    /** Update color mode and persist to storage */
    setColorMode(mode: ColorMode): Promise<void>;

    /** Update style theme and persist to storage */
    setStyleTheme(style: ThemeStyle): Promise<void>;

    /** Manually apply current theme to DOM */
    applyTheme(): Promise<void>;

    /** Clear the last error */
    resetError(): void;
}

/**
 * Theme context type
 */
export interface ThemeContextType extends ThemeContextState, ThemeActions { }

/**
 * Theme context - use with useTheme() or useThemeActions()
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * Storage keys
 */
const STORAGE_KEYS = {
    COLOR_MODE: 'theme',
    STYLE_THEME: 'themeStyle',
} as const;

/**
 * Default values
 */
const DEFAULT_COLOR_MODE: ColorMode = 'auto';
const DEFAULT_STYLE_THEME: ThemeStyle = 'minimalist';

/**
 * ThemeProvider component
 * Initializes theme from localStorage, handles storage events, and provides context
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
    const [state, setState] = useState<ThemeContextState>({
        colorMode: DEFAULT_COLOR_MODE,
        effectiveColorMode: 'light',
        styleTheme: DEFAULT_STYLE_THEME,
        isInitialized: false,
        syncStatus: 'pending',
        lastError: null,
        activeTokens: getActiveTokens(DEFAULT_STYLE_THEME, 'light'),
    });

    /**
     * Get theme dependencies from browser APIs
     */
    const getDeps = useCallback((): ThemeDependencies => {
        return {
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
            window: typeof window !== 'undefined' ? window : undefined,
        };
    }, []);

    /**
     * Resolve effective color mode (handle auto preference)
     */
    const resolveEffectiveColorMode = useCallback(
        (colorMode: ColorMode): 'light' | 'dark' => {
            if (colorMode === 'auto') {
                const deps = getDeps();
                const result = getSystemPreference(deps);
                if (result.success && result.value) {
                    return result.value;
                }
                return 'light'; // Default fallback
            }
            return colorMode as 'light' | 'dark';
        },
        [getDeps]
    );

    /**
     * Initialize theme on client mount
     * Reads from localStorage and computes activeTokens — no DOM mutations.
     */
    useEffect(() => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return;
        }

        const deps = getDeps();

        // Read theme from storage
        const colorModeResult = readFromStorage<ColorMode>(
            deps,
            STORAGE_KEYS.COLOR_MODE,
            DEFAULT_COLOR_MODE
        );
        const styleThemeResult = readFromStorage<ThemeStyle>(
            deps,
            STORAGE_KEYS.STYLE_THEME,
            DEFAULT_STYLE_THEME
        );

        let colorMode = colorModeResult.value || DEFAULT_COLOR_MODE;
        let styleTheme = styleThemeResult.value || DEFAULT_STYLE_THEME;

        // Validate loaded values
        const colorModeValidation = validateColorMode(colorMode);
        if (!colorModeValidation.success) {
            colorMode = DEFAULT_COLOR_MODE;
        }

        const styleValidation = validateThemeStyle(styleTheme);
        if (!styleValidation.success) {
            styleTheme = DEFAULT_STYLE_THEME;
        }

        const effectiveColorMode = resolveEffectiveColorMode(colorMode);
        const activeTokens = getActiveTokens(styleTheme, effectiveColorMode);

        setState((prev) => ({
            ...prev,
            colorMode,
            styleTheme,
            effectiveColorMode,
            isInitialized: true,
            syncStatus: 'synced',
            lastError: !colorModeResult.success ? colorModeResult.error || null : null,
            activeTokens,
        }));
    }, [getDeps, resolveEffectiveColorMode]);

    /**
     * Listen for storage events from other tabs/windows
     */
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === STORAGE_KEYS.COLOR_MODE) {
                try {
                    const newColorMode = JSON.parse(event.newValue || DEFAULT_COLOR_MODE);
                    const validation = validateColorMode(newColorMode);
                    if (validation.success) {
                        const effectiveColorMode = resolveEffectiveColorMode(newColorMode);
                        setState((prev) => ({
                            ...prev,
                            colorMode: newColorMode,
                            effectiveColorMode,
                            activeTokens: getActiveTokens(prev.styleTheme, effectiveColorMode),
                            syncStatus: 'synced',
                        }));
                    }
                } catch (_error) {
                    // Ignore parse errors
                }
            }

            if (event.key === STORAGE_KEYS.STYLE_THEME) {
                try {
                    const newStyleTheme = JSON.parse(event.newValue || DEFAULT_STYLE_THEME);
                    const validation = validateThemeStyle(newStyleTheme);
                    if (validation.success) {
                        setState((prev) => ({
                            ...prev,
                            styleTheme: newStyleTheme,
                            activeTokens: getActiveTokens(newStyleTheme, prev.effectiveColorMode),
                            syncStatus: 'synced',
                        }));
                    }
                } catch (_error) {
                    // Ignore parse errors
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [resolveEffectiveColorMode]);

    /**
     * Mirror theme state to the root element so both token-based styling and
     * any legacy selectors stay in sync with context updates.
     */
    useEffect(() => {
        if (typeof document === 'undefined') return;

        const root = document.documentElement;
        root.setAttribute('data-theme', state.styleTheme);
        root.classList.toggle('dark', state.effectiveColorMode === 'dark');
        root.style.colorScheme = state.effectiveColorMode;

        (Object.keys(CSS_VAR_MAP) as (keyof ThemeTokens)[]).forEach((key) => {
            const value = state.activeTokens[key];
            if (value !== undefined) {
                root.style.setProperty(CSS_VAR_MAP[key], value);
            }
        });
    }, [state.activeTokens, state.styleTheme, state.effectiveColorMode]);

    /**
     * Set color mode action
     */
    const setColorMode = useCallback(
        async (mode: ColorMode): Promise<void> => {
            const validation = validateColorMode(mode);
            if (!validation.success) {
                setState((prev) => ({
                    ...prev,
                    lastError: validation.error || null,
                    syncStatus: 'error',
                }));
                return;
            }

            const deps = getDeps();
            const storageResult = writeToStorage(deps, STORAGE_KEYS.COLOR_MODE, mode);

            if (!storageResult.success) {
                setState((prev) => ({
                    ...prev,
                    lastError: storageResult.error || null,
                    syncStatus: 'error',
                }));
                return;
            }

            const effectiveColorMode = resolveEffectiveColorMode(mode);
            setState((prev) => ({
                ...prev,
                colorMode: mode,
                effectiveColorMode,
                activeTokens: getActiveTokens(prev.styleTheme, effectiveColorMode),
                lastError: null,
                syncStatus: 'synced',
            }));
        },
        [getDeps, resolveEffectiveColorMode]
    );

    /**
     * Set style theme action
     */
    const setStyleTheme = useCallback(
        async (style: ThemeStyle): Promise<void> => {
            const validation = validateThemeStyle(style);
            if (!validation.success) {
                setState((prev) => ({
                    ...prev,
                    lastError: validation.error || null,
                    syncStatus: 'error',
                }));
                return;
            }

            const deps = getDeps();
            const storageResult = writeToStorage(deps, STORAGE_KEYS.STYLE_THEME, style);

            if (!storageResult.success) {
                setState((prev) => ({
                    ...prev,
                    lastError: storageResult.error || null,
                    syncStatus: 'error',
                }));
                return;
            }

            setState((prev) => ({
                ...prev,
                styleTheme: style,
                activeTokens: getActiveTokens(style, prev.effectiveColorMode),
                lastError: null,
                syncStatus: 'synced',
            }));
        },
        [getDeps]
    );

    /**
     * No-op kept for API compatibility.
     * Theme is now propagated exclusively through SCThemeProvider; no DOM mutations.
     */
    const applyTheme = useCallback(async (): Promise<void> => {
        setState((prev) => ({ ...prev, syncStatus: 'synced' }));
    }, []);

    /**
     * Reset error state
     */
    const resetError = useCallback((): void => {
        setState((prev) => ({
            ...prev,
            lastError: null,
        }));
    }, []);

    // Build context value
    const value: ThemeContextType = {
        ...state,
        setColorMode,
        setStyleTheme,
        applyTheme,
        resetError,
    };

    return (
        <ThemeContext.Provider value={value}>
            <SCThemeProvider theme={state.activeTokens}>
                {children}
            </SCThemeProvider>
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access theme state
 * Returns current theme state (colorMode, styleTheme, isInitialized, etc.)
 *
 * @returns Current theme state
 * @throws Error if used outside ThemeProvider
 *
 * @example
 * function MyComponent() {
 *   const { colorMode, styleTheme, isInitialized } = useTheme();
 *   return <div>Color mode: {colorMode}</div>;
 * }
 */
export function useTheme(): ThemeContextState {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }

    return {
        colorMode: context.colorMode,
        effectiveColorMode: context.effectiveColorMode,
        styleTheme: context.styleTheme,
        isInitialized: context.isInitialized,
        syncStatus: context.syncStatus,
        lastError: context.lastError,
        activeTokens: context.activeTokens,
    };
}

/**
 * Hook to access theme actions
 * Returns functions to update theme state
 *
 * @returns Theme action functions
 * @throws Error if used outside ThemeProvider
 *
 * @example
 * function MyComponent() {
 *   const { setColorMode } = useThemeActions();
 *   return (
 *     <button onClick={() => setColorMode('dark')}>
 *       Switch to dark mode
 *     </button>
 *   );
 * }
 */
export function useThemeActions(): ThemeActions {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeActions must be used within ThemeProvider');
    }

    return {
        setColorMode: context.setColorMode,
        setStyleTheme: context.setStyleTheme,
        applyTheme: context.applyTheme,
        resetError: context.resetError,
    };
}

/**
 * Combined hook for both state and actions
 * Convenience hook when you need both state and actions
 *
 * @returns Theme context value (state + actions)
 * @throws Error if used outside ThemeProvider
 *
 * @example
 * function MyComponent() {
 *   const { colorMode, setColorMode } = useThemeContext();
 *   return (
 *     <div>
 *       Current: {colorMode}
 *       <button onClick={() => setColorMode('dark')}>Change</button>
 *     </div>
 *   );
 * }
 */
export function useThemeContext(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within ThemeProvider');
    }
    return context;
}
