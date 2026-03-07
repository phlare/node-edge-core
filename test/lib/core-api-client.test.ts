import { describe, expect, it, vi, beforeEach } from "vitest";
import { CoreApiClient } from "../../src/lib/core-api-client.js";

describe("CoreApiClient", () => {
  const baseUrl = "http://localhost:4000";
  const token = "test-token";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the correct URL with Bearer token", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { status: "ok" } })
    });
    vi.stubGlobal("fetch", mockFetch);

    const client = new CoreApiClient(baseUrl, token);
    await client.getHealth();

    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/healthz`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  });

  it("returns the parsed response on success", async () => {
    const body = { data: { status: "ok" } };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(body)
      })
    );

    const client = new CoreApiClient(baseUrl, token);
    const result = await client.getHealth();

    expect(result).toEqual(body);
  });

  it("throws on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503
      })
    );

    const client = new CoreApiClient(baseUrl, token);

    await expect(client.getHealth()).rejects.toThrow(
      "Core API health check failed: 503"
    );
  });

  it("requires baseUrl and token as constructor args", () => {
    const client = new CoreApiClient(baseUrl, token);
    expect(client).toBeInstanceOf(CoreApiClient);
  });
});
