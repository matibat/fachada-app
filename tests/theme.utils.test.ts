import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  validateColorMode,
  validateThemeStyle,
  getSystemPreference,
  readFromStorage,
  writeToStorage,
} from "@fachada/core";
import type {
  ColorMode,
  ThemeStyle,
  ThemeDependencies,
} from "@fachada/core";

/**
 * BDD Test Suite: Theme Utilities
 * Tests cover error handling for 5+ edge cases as required
 */

describe("Theme Utilities", () => {
  let mockStorage: Record<string, string>;
  let storage: Storage;
  let mockDocument: Document;
  let mockWindow: ThemeDependencies["window"];

  beforeEach(() => {
    // Mock localStorage implementation
    mockStorage = {};
    storage = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        mockStorage = {};
      },
      length: Object.keys(mockStorage).length,
      key: (index: number) => Object.keys(mockStorage)[index] ?? null,
    };

    // Mock document implementation
    mockDocument = {
      documentElement: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
          toggle: vi.fn(),
          contains: vi.fn(() => false),
        } as any,
      },
    } as any;

    // Mock window.matchMedia
    mockWindow = {
      matchMedia: vi.fn(
        (query: string) =>
          ({
            matches: query === "(prefers-color-scheme: dark)",
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as MediaQueryList,
      ),
    };
  });

  // ============================================================================
  // BEHAVIOR 1: Theme value validation accepts 'light'/'dark'/'auto'
  // ============================================================================
  describe("validateColorMode", () => {
    it("[RED] should reject invalid color modes", () => {
      const result = validateColorMode("invalid");
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("INVALID_THEME");
    });

    it('[GREEN] should accept "light" as valid', () => {
      const result = validateColorMode("light");
      expect(result.success).toBe(true);
      expect(result.value).toBe("light");
    });

    it('[GREEN] should accept "dark" as valid', () => {
      const result = validateColorMode("dark");
      expect(result.success).toBe(true);
      expect(result.value).toBe("dark");
    });

    it('[GREEN] should accept "auto" as valid', () => {
      const result = validateColorMode("auto");
      expect(result.success).toBe(true);
      expect(result.value).toBe("auto");
    });

    it("[GREEN] should reject null, undefined, and non-strings", () => {
      expect(validateColorMode(null).success).toBe(false);
      expect(validateColorMode(undefined).success).toBe(false);
      expect(validateColorMode(123).success).toBe(false);
      expect(validateColorMode({}).success).toBe(false);
    });
  });

  // ============================================================================
  // BEHAVIOR 2: Theme style validation accepts valid styles
  // ============================================================================
  describe("validateThemeStyle", () => {
    it("[RED] should reject invalid style themes", () => {
      const result = validateThemeStyle("invalid-style");
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("INVALID_STYLE");
    });

    it('[GREEN] should accept "minimalist" as valid', () => {
      const result = validateThemeStyle("minimalist");
      expect(result.success).toBe(true);
      expect(result.value).toBe("minimalist");
    });

    it("[GREEN] should accept all valid theme styles", () => {
      const validStyles: ThemeStyle[] = [
        "minimalist",
        "modern-tech",
        "professional",
        "vaporwave",
      ];
      validStyles.forEach((style) => {
        const result = validateThemeStyle(style);
        expect(result.success).toBe(true);
        expect(result.value).toBe(style);
      });
    });
  });

  // ============================================================================
  // BEHAVIOR 3: System preference detection reads matchMedia
  // ============================================================================
  describe("getSystemPreference", () => {
    it("[RED] should return default when matchMedia is unavailable", () => {
      const result = getSystemPreference({
        window: { matchMedia: undefined },
      });
      expect(result.success).toBe(true);
      expect(result.value).toBe("light"); // Should default to light
    });

    it("[GREEN] should detect dark mode preference", () => {
      mockWindow.matchMedia = vi.fn(
        (query: string) =>
          ({
            matches: query === "(prefers-color-scheme: dark)",
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as MediaQueryList,
      );

      const result = getSystemPreference({ window: mockWindow });
      expect(result.success).toBe(true);
      expect(result.value).toBe("dark");
    });

    it("[GREEN] should detect light mode preference", () => {
      mockWindow.matchMedia = vi.fn(
        () =>
          ({
            matches: false, // no dark mode
            media: "(prefers-color-scheme: dark)",
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as MediaQueryList,
      );

      const result = getSystemPreference({ window: mockWindow });
      expect(result.success).toBe(true);
      expect(result.value).toBe("light");
    });

    it("[GREEN] should handle matchMedia throwing error", () => {
      mockWindow.matchMedia = vi.fn(() => {
        throw new Error("matchMedia not available");
      });

      const result = getSystemPreference({ window: mockWindow });
      expect(result.success).toBe(true);
      expect(result.value).toBe("light"); // Should default gracefully
    });

    it("[RED] should return failure when no window available", () => {
      const result = getSystemPreference({ window: undefined });
      expect(result.success).toBe(true);
      expect(result.value).toBe("light"); // Graceful default
    });
  });

  // ============================================================================
  // BEHAVIOR 4: localStorage read - parse JSON, return value or default, catch errors
  // ============================================================================
  describe("readFromStorage", () => {
    it("[RED] should handle JSON parse errors", () => {
      mockStorage["theme"] = "invalid json {{{";
      const result = readFromStorage(
        { storage: storage as any },
        "theme",
        "light",
      );
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("STORAGE_JSON_PARSE_ERROR");
      expect(result.value).toBe("light"); // Returns default value
    });

    it("[GREEN] should return stored value if valid JSON", () => {
      mockStorage["savedTheme"] = JSON.stringify("dark");
      const result = readFromStorage(
        { storage: storage as any },
        "savedTheme",
        "light",
      );
      expect(result.success).toBe(true);
      expect(result.value).toBe("dark");
    });

    it("[GREEN] should return default value if key not found", () => {
      const result = readFromStorage(
        { storage: storage as any },
        "nonexistent",
        "light",
      );
      expect(result.success).toBe(true);
      expect(result.value).toBe("light");
    });

    it("[RED] should handle storage unavailable gracefully", () => {
      const result = readFromStorage({}, "theme", "light");
      expect(result.success).toBe(true);
      expect(result.value).toBe("light"); // Returns default when storage unavailable
    });

    it("[RED] should handle storage quota exceeded", () => {
      const limitedStorage: Storage = {
        getItem: vi.fn(() => {
          throw new Error("QuotaExceededError");
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(() => null),
      } as any;

      const result = readFromStorage(
        { storage: limitedStorage },
        "theme",
        "light",
      );
      expect(result.success).toBe(false);
      expect(result.value).toBe("light");
      expect(result.error?.code).toBe("STORAGE_QUOTA_EXCEEDED");
    });
  });

  // ============================================================================
  // BEHAVIOR 5: localStorage write - stringify, write, return success boolean
  // ============================================================================
  describe("writeToStorage", () => {
    it("[RED] should return false if storage unavailable", () => {
      const result = writeToStorage({}, "theme", "dark");
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("STORAGE_UNAVAILABLE");
    });

    it("[GREEN] should successfully write to storage", () => {
      const result = writeToStorage(
        { storage: storage as any },
        "theme",
        "dark",
      );
      expect(result.success).toBe(true);
      expect(mockStorage["theme"]).toBe(JSON.stringify("dark"));
    });

    it("[GREEN] should handle storage quota exceeded", () => {
      const limitedStorage: Storage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {
          throw new Error("QuotaExceededError");
        }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(() => null),
      } as any;

      const result = writeToStorage(
        { storage: limitedStorage },
        "theme",
        "dark",
      );
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("STORAGE_QUOTA_EXCEEDED");
    });

    it("[GREEN] should handle generic storage errors", () => {
      const faultyStorage: Storage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {
          throw new Error("Generic storage error");
        }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(() => null),
      } as any;

      const result = writeToStorage(
        { storage: faultyStorage },
        "theme",
        "dark",
      );
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("UNKNOWN_ERROR");
    });
  });
});
