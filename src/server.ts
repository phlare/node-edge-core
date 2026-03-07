import { buildApp } from "./app.js";
import { env } from "./config/env.js";

const app = buildApp();

async function start(): Promise<void> {
  try {
    await app.listen({
      port: env.PORT,
      host: env.HOST
    });

    app.log.info(`node-edge-core listening on ${env.HOST}:${env.PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();