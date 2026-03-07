# Node Edge Core

[![CI](https://github.com/phlare/node-edge-core/actions/workflows/ci.yml/badge.svg)](https://github.com/phlare/node-edge-core/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/phlare/node-edge-core)](https://github.com/phlare/node-edge-core/releases/latest)
[![Node](https://img.shields.io/badge/Node-24+-339933)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Reusable TypeScript service template for integration-facing services. This is a generic foundation — it contains no product logic, only service plumbing.

Intended for things like:

- Slack adapters
- MCP servers
- Webhook receivers
- Lightweight integration APIs

## Requirements

- Node 24+ (pinned in `.nvmrc`)

## Local Setup

```bash
# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env

# Run the dev server (hot reload)
npm run dev
```

The service is available at `http://localhost:3001`.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Pre-commit Checks

```bash
# Format, lint, typecheck, and test
npm run format:check && npm run lint && npm run typecheck && npm test
```

## API Endpoints

| Method | Path       | Description  |
| ------ | ---------- | ------------ |
| GET    | `/healthz` | Health check |

## Architecture

- **App factory**: `buildApp(opts?)` creates a configured Fastify instance — testable in isolation
- **Composition root**: `server.ts` is the only file that reads env vars
- **Env validation**: Zod schema with fail-fast on startup
- **Error handling**: `AppError` class → consistent `{ error: { code, message, details } }` envelope
- **Request logging**: Structured pino logs with request_id, method, url, status_code, duration_ms
- **Core API client**: Typed `CoreApiClient` for calling backend services (constructor injection, no env coupling)

See `docs/ARCHITECTURE.md` for detailed design and `docs/DECISIONS.md` for the decision log.

## Configuration

Copy `.env.example` to `.env`. Dev requires:

| Variable            | Default | Description                             |
| ------------------- | ------- | --------------------------------------- |
| `PORT`              | 3001    | HTTP port                               |
| `HOST`              | 0.0.0.0 | Bind address                            |
| `LOG_LEVEL`         | info    | Pino log level                          |
| `CORE_API_BASE_URL` | —       | Backend API URL (required)              |
| `CORE_API_TOKEN`    | —       | Bearer token for backend API (required) |

## Related Templates

This is one of two reusable service templates. They share API conventions and response envelopes but are otherwise independent.

| Template                                                         | Purpose                   | Stack                       |
| ---------------------------------------------------------------- | ------------------------- | --------------------------- |
| [**elixir-api-core**](https://github.com/phlare/elixir-api-core) | Core backend APIs         | Elixir, Phoenix, PostgreSQL |
| **node-edge-core** (this repo)                                   | Edge/integration services | TypeScript, Fastify, Zod    |

Product services are created _from_ these templates and then diverge freely with domain logic. They're designed to work together — an edge service built from node-edge-core can call a backend API built from elixir-api-core via the `CoreApiClient`.

## Project Status

See `CHANGELOG.md` for the versioned task tracker.
