/**
 * Phase 2 — WidgetRegistry domain service tests
 *
 * BDD: written before implementation. Import of createWidgetRegistry causes RED
 * until src/widgets/WidgetRegistry.ts exists.
 *
 * WidgetRegistry maps widget type strings to component factories.
 * It is the only place in the codebase that names concrete widget components.
 */
import { describe, it, expect, vi } from "vitest";
import { createWidgetRegistry } from "@fachada/core";

// ─── Shared fixture — minimal component stub ──────────────────────────────────

const MockHeroWidget = vi.fn();
const MockAboutWidget = vi.fn();

// ─── Scenario 1: registry resolves registered widget type ─────────────────────

describe("Scenario 1: registry resolves a registered widget type", () => {
  it("Given: a registry with HeroWidget registered, When: I resolve 'HeroWidget', Then: I get back the registered component", () => {
    const registry = createWidgetRegistry({
      HeroWidget: MockHeroWidget,
    });

    const resolved = registry.resolve("HeroWidget");
    expect(resolved).toBe(MockHeroWidget);
  });

  it("Given: multiple widgets registered, When: I resolve each by type, Then: each returns the correct component", () => {
    const registry = createWidgetRegistry({
      HeroWidget: MockHeroWidget,
      AboutWidget: MockAboutWidget,
    });

    expect(registry.resolve("HeroWidget")).toBe(MockHeroWidget);
    expect(registry.resolve("AboutWidget")).toBe(MockAboutWidget);
  });
});

// ─── Scenario 2: resolving an unknown type returns undefined ──────────────────

describe("Scenario 2: resolving an unregistered type returns undefined without throwing", () => {
  it("Given: a registry without 'ContactWidget', When: I resolve 'ContactWidget', Then: it returns undefined", () => {
    const registry = createWidgetRegistry({ HeroWidget: MockHeroWidget });

    const resolved = registry.resolve("ContactWidget");
    expect(resolved).toBeUndefined();
  });

  it("Given: an empty registry, When: I resolve any type, Then: it returns undefined", () => {
    const registry = createWidgetRegistry({});

    expect(registry.resolve("AnyWidget")).toBeUndefined();
  });
});

// ─── Scenario 3: registry has a read-only list of registered type keys ────────

describe("Scenario 3: registry exposes the list of registered type keys", () => {
  it("Given: a registry with two widgets, When: I access types, Then: it contains both keys", () => {
    const registry = createWidgetRegistry({
      HeroWidget: MockHeroWidget,
      AboutWidget: MockAboutWidget,
    });

    expect(registry.types).toContain("HeroWidget");
    expect(registry.types).toContain("AboutWidget");
    expect(registry.types).toHaveLength(2);
  });

  it("Given: an empty registry, When: I access types, Then: it is an empty array", () => {
    const registry = createWidgetRegistry({});
    expect(registry.types).toHaveLength(0);
  });
});

// ─── Scenario 4: registry is immutable after creation ────────────────────────

describe("Scenario 4: registry does not allow mutation after creation", () => {
  it("Given: a created registry, When: I try to register a new key at runtime, Then: types list is unchanged", () => {
    const registry = createWidgetRegistry({ HeroWidget: MockHeroWidget });
    const initialLength = registry.types.length;

    // Attempt to mutate the types array (should have no effect on the registry)
    (registry.types as string[]).push("Injected");

    expect(registry.types).toHaveLength(initialLength);
  });
});

// ─── Scenario 5: registry.has checks presence correctly ──────────────────────

describe("Scenario 5: registry.has returns true for registered and false for unregistered types", () => {
  it("Given: HeroWidget is registered, When: has('HeroWidget'), Then: returns true", () => {
    const registry = createWidgetRegistry({ HeroWidget: MockHeroWidget });
    expect(registry.has("HeroWidget")).toBe(true);
  });

  it("Given: ContactWidget is not registered, When: has('ContactWidget'), Then: returns false", () => {
    const registry = createWidgetRegistry({ HeroWidget: MockHeroWidget });
    expect(registry.has("ContactWidget")).toBe(false);
  });
});
