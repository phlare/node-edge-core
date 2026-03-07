import { describe, expect, it } from "vitest";
import { buildTestApp as buildBaseApp } from "../helpers.js";
import { AppError } from "../../src/lib/errors.js";

function buildErrorTestApp() {
  const app = buildBaseApp();

  app.get("/throw-generic", async () => {
    throw new Error("something unexpected");
  });

  app.get("/throw-app-error", async () => {
    throw new AppError("PAYMENT_REQUIRED", "Please pay up", 402, {
      amount: 9.99
    });
  });

  return app;
}

describe("error handler", () => {
  it("returns 404 with error envelope for unknown routes", async () => {
    const app = buildErrorTestApp();
    const response = await app.inject({ method: "GET", url: "/nope" });

    expect(response.statusCode).toBe(404);
    const body = response.json();
    expect(body.error.code).toBe("NOT_FOUND");
    expect(body.error.message).toBeDefined();
    expect(body.error.details).toEqual({});
  });

  it("returns 500 with error envelope for generic errors", async () => {
    const app = buildErrorTestApp();
    const response = await app.inject({ method: "GET", url: "/throw-generic" });

    expect(response.statusCode).toBe(500);
    const body = response.json();
    expect(body.error.code).toBe("INTERNAL_SERVER_ERROR");
    expect(body.error.message).toBeDefined();
    expect(body.error.details).toEqual({});
  });

  it("returns specified status code for AppError", async () => {
    const app = buildErrorTestApp();
    const response = await app.inject({
      method: "GET",
      url: "/throw-app-error"
    });

    expect(response.statusCode).toBe(402);
    const body = response.json();
    expect(body.error.code).toBe("PAYMENT_REQUIRED");
    expect(body.error.message).toBe("Please pay up");
    expect(body.error.details).toEqual({ amount: 9.99 });
  });

  it("includes x-request-id on error responses", async () => {
    const app = buildErrorTestApp();
    const response = await app.inject({ method: "GET", url: "/nope" });

    expect(response.headers["x-request-id"]).toBeDefined();
  });
});
