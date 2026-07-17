import { z } from "zod";
import "dotenv/config";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    DATABASE_URL: z.string().min(1),
    PORT: z.coerce.number().default(4000),
    JWT_SECRET: z.string().min(1),
    OWNER_EMAIL: z.string().email(),
    OWNER_PASSWORD: z.string().min(6),
    CORS_ORIGIN: z.string().default("*"),
    API_PUBLIC_URL: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === "production" && data.JWT_SECRET.length < 32) {
      ctx.addIssue({
        code: "custom",
        message: "JWT_SECRET must be at least 32 characters in production",
        path: ["JWT_SECRET"],
      });
    }
  });

export const env = envSchema.parse(process.env);

export function getCorsOrigins(): string[] | boolean {
  if (env.CORS_ORIGIN === "*") {
    return true;
  }
  return env.CORS_ORIGIN.split(",").map((origin) => origin.trim());
}
