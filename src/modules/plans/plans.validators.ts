import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(1).max(120),
  durationDays: z.coerce.number().int().positive(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export const updatePlanSchema = createPlanSchema.partial();

export const planIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
