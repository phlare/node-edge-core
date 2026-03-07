import type { FastifyPluginAsync } from "fastify";
import { randomUUID } from "node:crypto";

export const requestIdPlugin: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", async (request, reply) => {
    const requestId =
      request.headers["x-request-id"]?.toString() ?? randomUUID();

    request.headers["x-request-id"] = requestId;
    reply.header("x-request-id", requestId);
  });
};