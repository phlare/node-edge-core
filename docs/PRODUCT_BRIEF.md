# Node Edge Core — Product Brief

## Purpose

Node Edge Core is a reusable TypeScript service template for integration-facing applications.

It provides:

- strict TypeScript setup
- HTTP server foundation
- environment validation
- structured logging
- request IDs
- health endpoint
- typed client for calling core APIs
- test and lint baseline

It intentionally contains no business-specific logic.

---

## Goals

- accelerate new integration service setup
- standardize edge-service patterns
- keep adapters thin and replaceable
- provide a reliable base for Slack, MCP, webhook, and browser-adjacent services

---

## Non-Goals

- domain-specific workflows
- persistent business data storage
- product-specific UI
- heavy auth/account logic that belongs in a core API

---

## Intended Usage

Future services will use this repository as a template and then add integration-specific behavior on top.

Examples:

- tiny-inbox-slack
- tiny-inbox-mcp
- future browser extension backend or webhook services

---

## Success Criteria

- service starts locally with minimal setup
- environment variables are validated at startup
- logs are structured and readable
- request IDs propagate through requests
- health endpoint is available
- outbound calls to core APIs are typed and consistent
