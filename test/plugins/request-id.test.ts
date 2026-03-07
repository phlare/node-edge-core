import { describe, expect, it } from "vitest";
import { buildTestApp } from "../helpers.js";

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("request-id plugin", () => {
  it("generates a UUID v4 request id when none provided", async () => {
    const app = buildTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/healthz"
    });

    const requestId = response.headers["x-request-id"];
    expect(requestId).toBeDefined();
    expect(requestId).toMatch(UUID_V4_REGEX);
  });

  it("echoes back a provided x-request-id", async () => {
    const app = buildTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/healthz",
      headers: { "x-request-id": "my-custom-id-123" }
    });

    expect(response.headers["x-request-id"]).toBe("my-custom-id-123");
  });
});
