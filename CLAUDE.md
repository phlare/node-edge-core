# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript edge service template for integration-facing services (Slack adapters, MCP servers, webhook receivers). This is a reusable foundation — it contains no product logic, only service plumbing. Node 24+ (pinned in `.nvmrc`).

## Workflows

- Commit workflow: `.claude/instructions/commit_workflow.md`
- Dependabot PR merging: `.claude/instructions/dependabot_workflow.md`
- CI/CD setup: `.claude/instructions/ci_cd.md`

## Commands

```bash
# Install dependencies
npm install

# Development server (hot reload)
npm run dev

# Build
npm run build

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check   # used in CI

# Pre-commit checks (format, lint, typecheck, tests)
npm run precommit
```

## Architecture

### Composition Root

`src/server.ts` is the only file that reads environment variables. Everything else receives configuration via constructor/function arguments, making all modules independently testable.

### App Factory

`src/app.ts` exports `buildApp(opts?)` — a Fastify instance factory. Tests call `buildApp({ logLevel: "silent" })` via the `buildTestApp()` helper in `test/helpers.ts`.

### Core Components

- **`src/config/env.ts`** — Zod schema for environment validation. Exports `EnvSchema` (for testing) and `Env` type. Validates `PORT`, `HOST`, `LOG_LEVEL`, `CORE_API_BASE_URL`, `CORE_API_TOKEN`.
- **`src/lib/errors.ts`** — `AppError` class with `code`, `message`, `statusCode`, `details`. Used by the error handler to produce consistent error envelopes.
- **`src/lib/core-api-client.ts`** — `CoreApiClient` class for calling backend APIs. Constructor injection (baseUrl, token) — no env dependency.
- **`src/routes/health.ts`** — `GET /healthz` health check endpoint.

### Request Pipeline (in `app.ts`)

1. **`genReqId`** — Uses `x-request-id` from request header or generates UUID v4
2. **`onRequest` hook** — Sets `x-request-id` response header
3. **`onResponse` hook** — Structured request/response logging (request_id, method, url, status_code, duration_ms)
4. **Error handler** — `AppError` → typed envelope; unknown errors → 500 with generic message
5. **Not-found handler** — 404 with standard error envelope

### Error Format

All API errors use a stable envelope:

```json
{ "error": { "code": "...", "message": "...", "details": {} } }
```

Success responses use:

```json
{ "data": { ... } }
```

## Testing

- 18 tests across 6 test files
- Uses Vitest with explicit imports (no globals)
- `buildTestApp()` helper in `test/helpers.ts` creates a silent Fastify instance
- `CoreApiClient` tests mock global `fetch`
- Test file structure mirrors `src/` layout

## Configuration

Dev requires a `.env` file (see `.env.example`):

| Variable            | Default | Description                             |
| ------------------- | ------- | --------------------------------------- |
| `PORT`              | 3001    | HTTP port                               |
| `HOST`              | 0.0.0.0 | Bind address                            |
| `LOG_LEVEL`         | info    | Pino log level                          |
| `CORE_API_BASE_URL` | —       | Backend API URL (required)              |
| `CORE_API_TOKEN`    | —       | Bearer token for backend API (required) |

## Current Status

v0.1 complete. See `CHANGELOG.md` for the versioned task tracker.
