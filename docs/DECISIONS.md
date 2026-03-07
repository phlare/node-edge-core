# Decision Log — Node Edge Core

## 001 — TypeScript-first edge template

This template is built in TypeScript because most targeted integrations have strong TS ecosystem support.

## 002 — Edge services stay thin

Business logic belongs in the core API, not in edge adapters.

## 003 — Strict typing by default

Strict TypeScript settings are enabled to reduce adapter drift and integration bugs.

## 004 — Env validation at startup

Misconfiguration should fail fast rather than causing runtime surprises.

## 005 — Shared outbound API client

Calls to core APIs should go through a single typed client layer for consistency and reuse.
