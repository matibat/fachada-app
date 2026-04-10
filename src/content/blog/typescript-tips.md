---
title: "TypeScript Tips for Better DX"
description: "Practical TypeScript patterns that improve developer experience and catch bugs before they reach production."
date: 2026-01-10
tags: ["TypeScript", "Developer Experience", "Best Practices"]
---

## Beyond Basic Types

TypeScript's real power comes from its advanced type system features that make invalid states unrepresentable.

## Discriminated Unions

Instead of nullable fields that lead to bugs:

```typescript
// ❌ Unclear what combination of fields is valid
interface ApiResponse {
  data?: User;
  error?: string;
  loading: boolean;
}
```

Use discriminated unions:

```typescript
// ✅ Each state is explicit
type ApiResponse =
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: string };
```

Now the compiler prevents accessing `data` without checking status.

## Branded Types

Prevent mixing up similar primitive types:

```typescript
type UserId = string & { readonly __brand: "UserId" };
type ProjectId = string & { readonly __brand: "ProjectId" };

function getUser(id: UserId) {
  /**/
}

getUser("user-123"); // ❌ Error
getUser("user-123" as UserId); // ✅ OK
```

## Const Assertions

Make objects and arrays deeply readonly:

```typescript
const config = {
  api: "https://api.example.com",
  timeout: 5000,
} as const;

type Config = typeof config;
// { readonly api: "https://api.example.com"; readonly timeout: 5000 }

config.api = "other"; // ❌ Error
```

## Template Literal Types

Type-safe route builders:

```typescript
type Route = `/users/${string}` | `/projects/${string}` | "/";

function navigate(route: Route) {
  /**/
}

navigate("/users/123"); // ✅ OK
navigate("/invalid"); // ❌ Error
```

## Utility Types for Transformations

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Public API response (no password)
type PublicUser = Omit<User, "password">;

// Form data (no ID yet)
type UserForm = Omit<User, "id">;

// Partial update payload
type UserUpdate = Partial<Omit<User, "id">>;
```

## Key Lessons

1. **Make invalid states unrepresentable** with discriminated unions
2. **Use branded types** to prevent mixing similar primitives
3. **Leverage const assertions** for immutable config
4. **Template literal types** for type-safe string patterns
5. **Utility types** to derive types and maintain DRY

TypeScript's type system is a design tool. Use it to encode your domain logic and let the compiler catch mistakes.
