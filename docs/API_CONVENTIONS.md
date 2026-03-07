# API Conventions — Node Edge Core

## General Principles

- JSON in, JSON out
- stable error shape
- health endpoint always available
- request ID attached to each request
- outbound calls to core APIs should be centralized through a client layer

---

## Baseline Endpoints

### GET /healthz

Returns service health.

Response:

{
"data": {
"status": "ok"
}
}

---

## Error Shape

{
"error": {
"code": "string_code",
"message": "Human-readable message",
"details": {}
}
}

---

## Logging Conventions

Every request should log:

- request_id
- route
- status_code
- duration
- integration-specific identifiers when relevant

Examples:

- slack_team_id
- slack_user_id
- external_event_id
- source_url
