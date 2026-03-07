import { describe, expect, it } from "vitest";
import { buildTestApp } from "../helpers.js";

describe("GET /healthz", () => {
  it("returns 200 with ok status", async () => {
    const app = buildTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/healthz"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      data: {
        status: "ok"
      }
    });
  });

  it("includes x-request-id in response", async () => {
    const app = buildTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/healthz"
    });

    expect(response.headers["x-request-id"]).toBeDefined();
  });

  it("echoes provided x-request-id", async () => {
    const app = buildTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/healthz",
      headers: { "x-request-id": "trace-123" }
    });

    expect(response.headers["x-request-id"]).toBe("trace-123");
  });

  it("returns 404 error envelope for unknown routes", async () => {
    const app = buildTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/nonexistent"
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
        details: {}
      }
    });
  });
});
