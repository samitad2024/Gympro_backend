import { app } from "./app";
import { env } from "@config/env";
import { ensureOwnerExists } from "@modules/auth/auth.service";

async function start() {
  await ensureOwnerExists();
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Swagger docs at http://localhost:${env.PORT}/api-docs`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
