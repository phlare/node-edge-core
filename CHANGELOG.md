# Changelog — node-edge-core

Versioned deliverables tracker for the platform template.

## Source of Truth Docs

- `docs/PRODUCT_BRIEF.md`
- `docs/ARCHITECTURE.md`
- `docs/API_CONVENTIONS.md`
- `docs/DECISIONS.md`
- `docs/PLATFORM_TEMPLATES.md`

---

## v0.1.4 — Dependency updates (2026-04-04)

- [x] eslint 10.1.0 → 10.2.0
- [x] @types/node 25.5.0 → 25.5.2
- [x] typescript 5.9.3 → 6.0.2
- [x] vitest 4.1.0 → 4.1.2
- [x] typescript-eslint 8.57.1 → 8.57.2
- [x] fastify 5.8.2 → 5.8.4

---

## v0.1 — Initial Template

- [x] TypeScript project scaffolded (strict mode, NodeNext, ESM)
- [x] Fastify server with app factory pattern (`buildApp(opts?)`)
- [x] Composition root — only `server.ts` reads env vars
- [x] Zod environment validation (`EnvSchema`) with fail-fast on startup
- [x] `GET /healthz` health check endpoint
- [x] Request ID support (UUID v4 auto-generated or echoed from `x-request-id`)
- [x] Structured request/response logging (request_id, method, url, status_code, duration_ms)
- [x] Error handling with standard envelope (`AppError` → typed response, unknown → 500)
- [x] Not-found handler (404 with error envelope)
- [x] `CoreApiClient` skeleton with constructor injection (no env coupling)
- [x] Vitest test suite — 18 tests across 6 files
- [x] ESLint 9 flat config with typescript-eslint
- [x] Prettier formatting
- [x] GitHub Actions CI (format, lint, typecheck, tests)
- [x] Dependabot for npm deps and GitHub Actions

### v0.1 Summary

- 18 tests passing
- 1 endpoint (`/healthz`)
- Fastify + Zod + Pino stack
- Node 24+ (pinned in `.nvmrc`)
- Constructor injection throughout — all modules testable in isolation
- Standard error envelope across all responses
- MIT licensed
