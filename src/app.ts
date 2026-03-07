import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import { AppError } from "./lib/errors.js";
import { healthRoutes } from "./routes/health.js";

export interface AppOptions {
  logLevel?: string;
}

export function buildApp(opts: AppOptions = {}) {
  const app = Fastify({
    logger: {
      level: opts.logLevel ?? "info"
    },
    disableRequestLogging: true,
    genReqId: (req) => req.headers["x-request-id"]?.toString() ?? randomUUID()
  });

  // Set x-request-id response header from Fastify's request.id.
  // Inlined here (not a separate plugin) so it applies to all routes
  // regardless of plugin encapsulation scope.
  app.addHook("onRequest", async (request, reply) => {
    reply.header("x-request-id", request.id);
  });

  // Structured request/response logging
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

  app.setErrorHandler(async (error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        details: {}
      }
    });
  });

  app.setNotFoundHandler(async (_request, reply) => {
    return reply.status(404).send({
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
        details: {}
      }
    });
  });

  app.register(healthRoutes);

  return app;
}
