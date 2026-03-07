import Fastify, { type FastifyInstance } from "fastify";
import { logger } from "./lib/logger.js";
import { requestIdPlugin } from "./plugins/request-id.js";
import { healthRoutes } from "./routes/health.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger
  });

  app.register(requestIdPlugin);
  app.register(healthRoutes);

  return app;
}