# Plan: Bootstrap node-edge-core v0.1

## Context

`node-edge-core` is a reusable TypeScript template for edge/integration services (Slack adapters, MCP servers, webhook receivers). It has been partially scaffolded but never installed or run. The existing code has structural issues that prevent testing and diverge from the design docs. This plan brings it to a clean, tested, working v0.1.

## Audit of Existing Code

The scaffold is a reasonable starting point but has these issues:

1. **Side-effect env coupling** — `logger.ts` and `core-api-client.ts` both `import { env }` which triggers `EnvSchema.parse(process.env)` at import time. This means `buildApp()` cannot be used in tests without real env vars set. This is a blocking bug.
2. **Redundant standalone logger** — `src/lib/logger.ts` creates a pino instance, but Fastify already creates its own pino logger. Two loggers = confusion.
3. **`rootDir: "."` in tsconfig** — Makes `dist/` output `dist/src/server.js` instead of `dist/server.js`, so `npm start` would fail.
4. **`"vitest/globals"` in tsconfig types** — But globals aren't enabled in vitest config, and tests use explicit imports. Inconsistent.
5. **All deps pinned to `"latest"`** — Not reproducible.
6. **No eslint or prettier config files** — Scripts exist but will fail.
7. **No error handling** — The docs require a consistent `{ error: { code, message, details } }` envelope, but there's no error handler.
8. **No request logging plugin** — Docs require logging request_id, route, status_code, duration per request.
9. **Request-id plugin uses manual hook** — Should use Fastify's `genReqId` for pino integration.

## Key Design Decisions

- **Keep Zod 4** — Code already uses `z.url()` (Zod 4 API). No reason to downgrade.
- **Delete `src/lib/logger.ts`** — Fastify owns the pino logger via `app.log` / `request.log`. One logger, no ambiguity.
- **Constructor injection everywhere** — `buildApp(opts)` and `CoreApiClient(baseUrl, token)` take explicit args. Only `server.ts` reads `env`. Everything else is testable without env setup.
- **Use Fastify's `genReqId`** — Integrates request IDs into all pino log output automatically.
- **Separate `tsconfig.build.json`** — `rootDir: "src"` for build, `rootDir: "."` for editor/typecheck.
- **ESLint 9 flat config** — `.eslintrc` is deprecated.
- **Explicit vitest imports** — No globals magic.

## Implementation Steps (test-driven)

### Step 0: Foundation (infra, no tests)

- Run `npm install`, pin all dependency versions in package.json
- Create `eslint.config.js` (ESLint 9 flat config with typescript-eslint)
- Add `typescript-eslint` and `@eslint/js` to devDeps
- Create `.prettierrc` (minimal defaults)
- Create `.prettierignore` (dist, node_modules, coverage, package-lock.json)
- Create `tsconfig.build.json` (extends tsconfig.json, rootDir: "src", include only src)
- Fix tsconfig.json: remove `"vitest/globals"` from types
- Update package.json scripts: `build` → `tsc -p tsconfig.build.json`, add `lint:fix`, `format:check`
- **Verify**: `npm run typecheck`, `npm run lint`, `npm run format` all run without errors

### Step 1: Decouple env and delete standalone logger

**Tests first** — `test/config/env.test.ts`:

- EnvSchema.parse succeeds with valid env object
- Defaults PORT to 3001, HOST to "0.0.0.0", LOG_LEVEL to "info"
- Rejects missing CORE_API_BASE_URL
- Rejects empty CORE_API_TOKEN
- Rejects non-URL CORE_API_BASE_URL
- Rejects non-numeric PORT

**Implementation**:

- `src/config/env.ts`: export `EnvSchema` as named export (keep `env` singleton for production)
- Delete `src/lib/logger.ts` entirely
- Refactor `src/app.ts`: `buildApp(opts?: AppOptions)` accepts `{ logLevel?, disableRequestLogging? }`, creates Fastify with inline pino config, no env import
- Update `src/server.ts`: passes `{ logLevel: env.LOG_LEVEL }` to `buildApp()`
- **Verify**: env tests pass, health test passes without env vars

### Step 2: Request-id plugin refactor

**Tests first** — `test/plugins/request-id.test.ts`:

- Response includes auto-generated x-request-id when request has none
- Response echoes provided x-request-id
- Auto-generated ID matches UUID v4 format

**Implementation**:

- Move request ID generation to Fastify's `genReqId` option in `buildApp()`
- Simplify plugin to only set the response header from `request.id`
- **Verify**: request-id tests pass

### Step 3: Error handling

**Tests first** — `test/lib/errors.test.ts`:

- AppError construction with code, message, statusCode, details
- Defaults: statusCode 500, details {}
- Is instance of Error

**Tests first** — `test/plugins/error-handler.test.ts`:

- Unknown route → 404 with `{ error: { code: "NOT_FOUND", ... } }`
- Generic Error throw → 500 with `{ error: { code: "INTERNAL_SERVER_ERROR", ... } }`
- AppError throw → specified status code with correct envelope
- Validation error → 400 with `{ error: { code: "VALIDATION_ERROR", details: { issues } } }`
- Error responses include x-request-id

**Implementation**:

- Create `src/lib/errors.ts`: `AppError` class (code, message, statusCode, details)
- Create `src/plugins/error-handler.ts`: Fastify `setErrorHandler` + `setNotFoundHandler`
- Register in `buildApp()`
- **Verify**: all error tests pass

### Step 4: Request logging

**Tests first** — `test/plugins/request-logger.test.ts`:

- Successful request logs entry with request_id, method, url, status_code, duration_ms
- Failed request also logs these fields

**Implementation**:

- Create `src/plugins/request-logger.ts`: `onResponse` hook logging structured summary
- Register in `buildApp()`
- **Verify**: request logger tests pass

### Step 5: CoreApiClient refactor

**Tests first** — `test/lib/core-api-client.test.ts`:

- getHealth() calls correct URL with Bearer token
- getHealth() throws on non-ok response
- Constructor requires baseUrl and token (no env defaults)
- Adds Content-Type and Authorization headers

**Implementation**:

- Remove `import { env }` from core-api-client.ts
- Make constructor args mandatory (no defaults)
- Add generic `private request<T>(method, path, body?)` skeleton
- In `server.ts`, instantiate with `new CoreApiClient(env.CORE_API_BASE_URL, env.CORE_API_TOKEN)`
- **Verify**: all client tests pass with mocked fetch

### Step 6: Expand health and integration tests

**Tests** — `test/routes/health.test.ts` (move from `test/health.test.ts`):

- GET /healthz returns 200 with correct body
- Response includes x-request-id header
- Echoes provided x-request-id
- GET /unknown returns 404 error envelope

**Implementation**:

- Move test file, mirror src structure
- Create `test/helpers.ts` with `buildTestApp()` (calls `buildApp({ logLevel: "silent" })`)
- Update all tests to use `buildTestApp()`
- **Verify**: all tests pass with clean output

### Step 7: Polish and verify

- Run `npm run format` on all files
- Run `npm run lint:fix`
- Verify all scripts: dev, build, start, test, typecheck, lint, format
- Verify `npm run build && npm start` works
- Update .env.example if any vars changed
- Ensure .gitignore covers everything needed

## Final File Structure

```
src/
  app.ts                    # buildApp(opts?) factory
  server.ts                 # composition root: reads env, starts server
  config/
    env.ts                  # EnvSchema + env singleton
  lib/
    errors.ts               # AppError class
    core-api-client.ts      # CoreApiClient (no env dependency)
  plugins/
    request-id.ts           # x-request-id response header
    error-handler.ts        # error envelope + 404 handler
    request-logger.ts       # structured request/response logging
  routes/
    health.ts               # GET /healthz
test/
  helpers.ts                # buildTestApp utility
  config/
    env.test.ts
  lib/
    errors.test.ts
    core-api-client.test.ts
  plugins/
    request-id.test.ts
    error-handler.test.ts
    request-logger.test.ts
  routes/
    health.test.ts
```

Deleted: `src/lib/logger.ts`

## Verification

After all steps:

1. `npm test` — all tests pass
2. `npm run typecheck` — no type errors
3. `npm run lint` — no lint errors
4. `npm run build && npm start` — server starts, GET /healthz returns expected response
5. `npm run dev` — hot-reload works
