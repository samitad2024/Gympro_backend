import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(1),
  OWNER_EMAIL: z.string().email(),
  OWNER_PASSWORD: z.string().min(6),
});

export const env = envSchema.parse(process.env);
