# Style Guide — Node Edge Core

Coding conventions observed in this codebase. Follow these when contributing.

---

## Project Structure

- `src/` for source, `test/` for tests — test files mirror `src/` layout
- One export per file where practical (`app.ts` → `buildApp`, `errors.ts` → `AppError`)
- `src/server.ts` is the composition root — the only place env vars are read
- Routes live in `src/routes/`, registered in `buildApp()` via `app.register()`

## Imports

**Use `type` imports for type-only imports:**

```typescript
import type { FastifyPluginAsync } from "fastify";
```

**Use `.js` extensions in all import paths** (required by NodeNext module resolution):

```typescript
import { buildApp } from "../src/app.js";
```

**Order:** Node builtins → third-party → local, separated by blank lines:

```typescript
import { randomUUID } from "node:crypto";
import Fastify from "fastify";
import { AppError } from "./lib/errors.js";
```

## TypeScript

- **Strict mode** is on — `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`
- **Prefer `unknown` over `any`** — the codebase has zero `any` usage
- **Use `readonly`** on constructor parameters and properties that should not be reassigned:
  ```typescript
  constructor(
    private readonly baseUrl: string,
    private readonly token: string
  ) {}
  ```
- **Use `interface`** for object shapes that may be extended, **`type`** for unions and utility types:
  ```typescript
  export interface AppOptions {
    logLevel?: string;
  }
  ```
- **Prefix unused parameters with `_`:**
  ```typescript
  app.setNotFoundHandler(async (_request, reply) => { ... });
  ```

## Functions

- **Use `async` consistently** on route handlers and hooks, even for synchronous returns — Fastify expects this
- **Arrow functions** for inline handlers and callbacks
- **Named function declarations** for top-level exports and test helpers:
  ```typescript
  export function buildApp(opts: AppOptions = {}) { ... }
  ```

## Error Handling

**Use `AppError` for expected failure cases:**

```typescript
throw new AppError("PAYMENT_REQUIRED", "Please pay up", 402, { amount: 9.99 });
```

**The error handler in `app.ts` maps errors to the standard envelope:**

- `AppError` → its `statusCode`, `code`, `message`, `details`
- Unknown `Error` → 500 with `INTERNAL_SERVER_ERROR` code and generic message
- Unknown routes → 404 with `NOT_FOUND` code

**Error codes are UPPER_SNAKE_CASE strings:**

```
NOT_FOUND, INTERNAL_SERVER_ERROR, VALIDATION_ERROR
```

## API Response Shape

**Success:**

```json
{ "data": { "status": "ok" } }
```

**Error:**

```json
{
  "error": { "code": "NOT_FOUND", "message": "Route not found", "details": {} }
}
```

Always include `details` (default to `{}` if none).

## Configuration

- **Zod schemas** for environment validation (`src/config/env.ts`)
- **Defaults** for optional values (`PORT`, `HOST`, `LOG_LEVEL`) — required values have no defaults
- **`z.coerce`** for values that arrive as strings from `process.env`:
  ```typescript
  PORT: z.coerce.number().int().positive().default(3001);
  ```
- **Constructor injection** everywhere except `server.ts`:
  ```typescript
  const client = new CoreApiClient(env.CORE_API_BASE_URL, env.CORE_API_TOKEN);
  ```

## Tests

**Framework:** Vitest with explicit imports (no globals):

```typescript
import { describe, expect, it } from "vitest";
```

**Test structure:**

- `describe` blocks group by feature or component
- `it` descriptions read as sentences: `"returns 200 with ok status"`, `"rejects empty CORE_API_TOKEN"`
- No nesting of `describe` blocks

**Route tests use `app.inject()`** (Fastify's built-in HTTP injection):

```typescript
const app = buildTestApp();
const response = await app.inject({ method: "GET", url: "/healthz" });
expect(response.statusCode).toBe(200);
```

**Mocking:**

- Use `vi.stubGlobal("fetch", ...)` for outbound HTTP mocks
- Restore mocks in `beforeEach` with `vi.restoreAllMocks()`
- Keep mocks minimal — only mock what the test needs

**Test helper pattern** — custom app builders for specialized tests:

```typescript
function buildErrorTestApp() {
  const app = buildBaseApp();
  app.get("/throw-generic", async () => {
    throw new Error("boom");
  });
  return app;
}
```

## Formatting

- **Prettier** handles all formatting — do not override with manual style choices
- **Double quotes** for strings (Prettier default)
- **Semicolons** always
- **Trailing commas** in multi-line structures
- Run `npm run format` before committing
