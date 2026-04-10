import { describe, it, expect } from "vitest";

/**
 * Truncates a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

describe("Utility Functions", () => {
  describe("truncate", () => {
    it("should not truncate short strings", () => {
      expect(truncate("Hello", 10)).toBe("Hello");
    });

    it("should truncate long strings", () => {
      expect(truncate("Hello World", 8)).toBe("Hello...");
    });

    it("should handle exact length matches", () => {
      expect(truncate("Hello", 5)).toBe("Hello");
    });

    it("should handle empty strings", () => {
      expect(truncate("", 5)).toBe("");
    });
  });

  describe("formatDate", () => {
    it("should format dates correctly", () => {
      const date = new Date("2026-04-09");
      const formatted = formatDate(date);
      expect(formatted).toContain("2026");
      expect(formatted).toContain("April");
    });

    it("should handle different dates", () => {
      const janDate = new Date(2026, 0, 1); // January is month 0
      const decDate = new Date(2026, 11, 31); // December is month 11

      const formatted1 = formatDate(janDate);
      const formatted2 = formatDate(decDate);

      expect(formatted1).toContain("January");
      expect(formatted2).toContain("December");
    });
  });
});
