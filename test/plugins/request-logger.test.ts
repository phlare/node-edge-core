import { describe, expect, it } from "vitest";
import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import { Writable } from "node:stream";

function buildLogCapturingApp() {
  const logs: Record<string, unknown>[] = [];

  const stream = new Writable({
    write(chunk, _encoding, callback) {
      try {
        logs.push(JSON.parse(chunk.toString()));
      } catch {
        // ignore non-JSON lines
      }
      callback();
    }
  });

  const app = Fastify({
    logger: { level: "info", stream },
    disableRequestLogging: true,
    genReqId: (req) => req.headers["x-request-id"]?.toString() ?? randomUUID()
  });

  // Inline the same onResponse hook used in buildApp
  app.addHook("onResponse", async (request, reply) => {
    request.log.info(
      {
        request_id: request.id,
        method: request.method,
        url: request.url,
        status_code: reply.statusCode,
        duration_ms: reply.elapsedTime
      },
      "request completed"
    );
  });

  app.get("/ok", async () => ({ data: { status: "ok" } }));
  app.get("/fail", async () => {
    throw new Error("boom");
  });

  return { app, logs };
}

describe("request logger", () => {
  it("logs request_id, method, url, status_code, and duration_ms on success", async () => {
    const { app, logs } = buildLogCapturingApp();

    await app.inject({ method: "GET", url: "/ok" });

    const reqLog = logs.find((l) => l["msg"] === "request completed");
    expect(reqLog).toBeDefined();
    expect(reqLog!["request_id"]).toBeDefined();
    expect(reqLog!["method"]).toBe("GET");
    expect(reqLog!["url"]).toBe("/ok");
    expect(reqLog!["status_code"]).toBe(200);
    expect(typeof reqLog!["duration_ms"]).toBe("number");
  });

  it("logs the same fields on error responses", async () => {
    const { app, logs } = buildLogCapturingApp();

    await app.inject({ method: "GET", url: "/fail" });

    const reqLog = logs.find((l) => l["status_code"] === 500);
    expect(reqLog).toBeDefined();
    expect(reqLog!["request_id"]).toBeDefined();
    expect(reqLog!["method"]).toBe("GET");
    expect(reqLog!["url"]).toBe("/fail");
    expect(typeof reqLog!["duration_ms"]).toBe("number");
  });
});
