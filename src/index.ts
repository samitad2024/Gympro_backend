import { app } from "./app";
import { env } from "@core/config/env";
import { closeDatabase } from "@core/database/client";
import { ensureOwnerExists } from "@modules/auth/application/auth.service";
import { expireMembers } from "@modules/members/application/members.service";

const EXPIRY_INTERVAL_MS = 60 * 60 * 1000;

async function start() {
  await ensureOwnerExists();
  await expireMembers();

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Swagger docs at http://localhost:${env.PORT}/api-docs`);
    console.log(`OpenAPI JSON at http://localhost:${env.PORT}/api-docs.json`);
  });

  const expiryTimer = setInterval(() => {
    expireMembers().catch((err) => {
      console.error("Member expiry job failed:", err);
    });
  }, EXPIRY_INTERVAL_MS);

  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    clearInterval(expiryTimer);
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
