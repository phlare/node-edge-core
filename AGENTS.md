This is a TypeScript edge service template built with Fastify. There are no frontend, HTML, or browser UI components.

## Project guidelines

- Only `src/server.ts` reads environment variables — all other modules receive config via constructor/function arguments
- Use the `buildTestApp()` helper from `test/helpers.ts` for all test setup — never instantiate Fastify directly in tests
- All routes are JSON API endpoints. `GET /healthz` is the baseline health check
- All API errors use the standard envelope: `{ "error": { "code": "...", "message": "...", "details": {} } }`
- All success responses use: `{ "data": { ... } }`
- Use `AppError` from `src/lib/errors.ts` for throwing typed errors — never throw plain `Error` for expected failure cases
- Outbound calls to core APIs go through `CoreApiClient` — never use `fetch` directly for backend calls

## TypeScript guidelines

- Strict mode is enabled (`strict: true` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`)
- Use `type` imports for type-only imports: `import type { FastifyPluginAsync } from "fastify"`
- Use `.js` extensions in import paths (required by NodeNext module resolution)
- Use `readonly` on constructor parameters and properties that should not be reassigned
- Prefix unused parameters with `_` (configured in ESLint)
- Prefer `unknown` over `any` — the codebase has zero `any` usage
- Use `interface` for object shapes that may be extended, `type` for unions/intersections/utility types

## Testing guidelines

- Use Vitest with explicit imports (`import { describe, it, expect } from "vitest"`) — no globals
- Test files mirror the `src/` directory structure under `test/`
- Mock `fetch` at the test level for `CoreApiClient` tests — do not use external HTTP mocking libraries
- Use `app.inject()` for route testing (Fastify's built-in light HTTP injection)
- Clean up any mocks with `vi.restoreAllMocks()` in `afterEach`

## Formatting and linting

- Use `npm run precommit` when you are done with all changes and fix any pending issues
- Prettier handles formatting (run `npm run format`)
- ESLint 9 flat config with `typescript-eslint` (run `npm run lint`)
- CI checks `format:check` and `lint`
