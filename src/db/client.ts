import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@config/env";
import * as schema from "./schema";

const isLocal =
  env.DATABASE_URL.includes("localhost") ||
  env.DATABASE_URL.includes("127.0.0.1");

const queryClient = postgres(env.DATABASE_URL, {
  ssl: isLocal ? false : "require",
});
export const db = drizzle(queryClient, { schema });
