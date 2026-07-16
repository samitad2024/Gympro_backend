import { defineConfig } from "drizzle-kit";
import { env } from "./src/core/config/env";

export default defineConfig({
  schema: "./src/core/database/schema/index.ts",
  out: "./src/core/database/migrations",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
});
