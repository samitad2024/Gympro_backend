import { z } from "zod";

export const isoDateTimeSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date/time (e.g. 2026-07-17T00:00:00Z)",
  });

export const monthQuerySchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format")
  .refine((value) => {
    const month = Number(value.split("-")[1]);
    return month >= 1 && month <= 12;
  }, "Month must be between 01 and 12");
