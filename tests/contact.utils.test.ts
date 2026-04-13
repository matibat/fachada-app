/**
 * contact.utils — unit tests for resolveContactMessage.
 *
 * Priority hierarchy (high → low):
 *   1. messageProp (page-level override)
 *   2. profileDefault (from profileConfig.contactMessage)
 *   3. module fallback string
 */
import { describe, it, expect } from "vitest";
import { resolveContactMessage } from "@fachada/core";

describe("resolveContactMessage", () => {
  describe("Scenario 1: page-level override takes top priority", () => {
    it("returns messageProp when all three sources are defined", () => {
      expect(
        resolveContactMessage("page msg", "profile msg", "fallback msg"),
      ).toBe("page msg");
    });

    it("returns messageProp when profileDefault is undefined", () => {
      expect(resolveContactMessage("page msg", undefined, "fallback")).toBe(
        "page msg",
      );
    });

    it("returns messageProp when fallback is provided and profileDefault is missing", () => {
      expect(
        resolveContactMessage("commission inquiry", undefined, "fallback"),
      ).toBe("commission inquiry");
    });
  });

  describe("Scenario 2: profileDefault used when messageProp is absent", () => {
    it("returns profileDefault when messageProp is undefined", () => {
      expect(resolveContactMessage(undefined, "profile msg", "fallback")).toBe(
        "profile msg",
      );
    });

    it("returns profileDefault when messageProp is explicitly undefined", () => {
      expect(
        resolveContactMessage(undefined, "Available for contracts.", "fb"),
      ).toBe("Available for contracts.");
    });
  });

  describe("Scenario 3: fallback used when both upper sources are absent", () => {
    it("returns custom fallback when messageProp and profileDefault are both undefined", () => {
      expect(
        resolveContactMessage(undefined, undefined, "custom fallback"),
      ).toBe("custom fallback");
    });

    it("returns module default when no arguments supply a message", () => {
      const result = resolveContactMessage(undefined, undefined);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
