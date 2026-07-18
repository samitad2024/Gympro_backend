import { z } from "zod";
import { isoDateTimeSchema } from "@core/utils/validators";

export const createExpenseSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  description: z.string().min(1).max(255),
  category: z.string().min(1).max(50),
  date: isoDateTimeSchema,
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
