# Architecture — Node Edge Core

Node Edge Core is a thin integration-service template.

Its purpose is to receive input from external systems, normalize it, and call a core API.

It should not become the source of truth for business logic or persistent product data.

---

## Responsibilities

- receive webhooks or HTTP requests
- validate external signatures if needed
- normalize payloads
- call a core API
- return success/failure responses
- log request and integration context

---

## Typical Use Cases

- Slack shortcut receiver
- MCP tool server
- webhook receiver
- browser-adjacent helper service

---

## Core Components

### HTTP Server
Provides API routes and health endpoints.

### Env Validation
Validates required configuration on startup.

### Logging
Structured logs with request ID support.

### Core API Client
Reusable typed client for calling backend APIs such as tiny-inbox-api.

### Error Handling
Consistent error responses and integration-safe failure handling.

---

## Boundary Principle

This template is for edge services only.

Business rules, persistence, and domain ownership belong in the core backend.

Adapters should remain thin and disposable.
