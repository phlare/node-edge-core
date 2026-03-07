# Claude Task: Bootstrap node-edge-core

Read the design docs in `/docs` and implement the initial `node-edge-core` template accordingly.

## Docs to treat as source of truth

- docs/PRODUCT_BRIEF.md
- docs/ARCHITECTURE.md
- docs/API_CONVENTIONS.md
- docs/DECISIONS.md
- docs/PLATFORM_TEMPLATES.md

## Goal

Build a reusable TypeScript template for thin integration and edge services.

This template is intended for things like:

- Slack adapters
- MCP servers
- webhook receivers
- lightweight integration APIs

It should provide the generic plumbing needed for those services while containing no business-specific logic.

---

# Deliverables (v0.1)

1. TypeScript project scaffolded and runnable
2. Fastify server with a `/healthz` endpoint
3. Environment validation at startup using Zod
4. Structured logging using Pino
5. Request ID support
6. Typed `CoreApiClient` skeleton for calling a core backend API
7. Baseline test setup using Vitest
8. Baseline scripts for:
   - dev
   - build
   - test
   - typecheck
   - lint
   - format
9. `.env.example`
10. Clean initial file structure

---

# Suggested file structure

src/
app.ts
server.ts
config/
env.ts
lib/
logger.ts
core-api-client.ts
plugins/
request-id.ts
routes/
health.ts

test/
health.test.ts

---

# Technical preferences

Use:

- Node 20+
- TypeScript in strict mode
- Fastify
- Zod
- Pino
- Vitest
- tsx for local development

---

# Constraints

- Keep this repository template-only
- Do not add product-specific routes or domain logic
- Do not add persistence or business data models
- Do not add Slack-specific, MCP-specific, or Tiny Inbox-specific behavior yet
- Keep adapters thin and reusable

---

# Architecture principles

This service is an **edge/integration template**.

Responsibilities:

- receive webhooks or API requests
- normalize payloads
- call a core API
- return integration-safe responses

Non-responsibilities:

- business logic
- persistent product data
- domain ownership

Those belong in a core backend service.

---

# API conventions

Success response:

{
"data": {
"status": "ok"
}
}

Error response:

{
"error": {
"code": "string_code",
"message": "Human-readable message",
"details": {}
}
}

---

# Implementation order

1. Scaffold project files
2. Set up TypeScript config and scripts
3. Create Fastify app factory
4. Add `/healthz`
5. Add env validation
6. Add logger
7. Add request ID plugin
8. Add `CoreApiClient`
9. Add test for `/healthz`
10. Ensure all scripts run successfully

---

# Definition of done

- `npm install` works
- `npm run test` passes
- `npm run typecheck` passes
- `npm run dev` starts the server
- `GET /healthz` returns expected JSON
- Template remains generic and reusable
