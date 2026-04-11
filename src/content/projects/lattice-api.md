---
title: "Lattice — Type-Safe API Layer"
description: "A zero-codegen TypeScript library that derives validated, self-documenting fetch clients directly from pure types. No schema language, no JSON definitions, no drift."
stack: ["TypeScript", "Node.js", "Zod", "OpenAPI 3.1", "Vitest"]
date: 2026-01-12
featured: true
roles: ["engineer"]
githubUrl: "https://github.com/matiasbatista/lattice"
coverImage: "/images/project-lattice.svg"
---

## Overview

Lattice is a TypeScript library for describing an API's shape as plain types, then deriving validated, fully-typed fetch clients from those types at build time — no schema language, no JSON definition files, no generation step.

## The Problem

OpenAPI is powerful but expensive: it introduces a second language, a generation step, and a perpetual drift risk between the schema and the types the compiler actually sees. Existing solutions (tRPC, ts-rest) require a runtime framework on both sides.

Lattice is different: it is a library, not a framework. It adds one build step and zero runtime kilobytes to the browser bundle.

## The Solution

Lattice uses conditional types and template literal types to infer route parameters, request body shapes, and response types directly from a TypeScript interface. The result is a fetch client that is:

- **Fully typed** with no additional type annotations at the call site
- **Validated** at request and response boundaries using Zod schemas derived from the interface at compile time
- **Documented** automatically as an OpenAPI 3.1 spec with no separate definition file

## Key Technical Decisions

**No runtime reflection.** All inference happens at compile time. The library adds zero kilobytes to a browser bundle.

**Covariant response types.** Response types narrow correctly under a union discriminant — `if (res.kind === "error")` gives you the error subtype without a cast.

**Opt-in validation.** By default, Lattice trusts that your server returns what it claims. Validation schemas can be enabled per-route for boundary-sensitive paths only.

## Results

- 40% reduction in type-assertion comments in consuming codebases
- API surface fully self-documenting via generated OpenAPI 3.1 spec
- Zero production incidents related to API contract drift in six months of production use
- Adopted by three internal teams without modification
