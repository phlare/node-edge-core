import { buildApp } from "./app.js";
import { EnvSchema } from "./config/env.js";

// Composition root — the only place env vars are read and parsed.
// All other modules receive configuration via constructor/function args.
const env = EnvSchema.parse(process.env);
const app = buildApp({ logLevel: env.LOG_LEVEL });

async function start(): Promise<void> {
  try {
    await app.listen({
      port: env.PORT,
      host: env.HOST
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
