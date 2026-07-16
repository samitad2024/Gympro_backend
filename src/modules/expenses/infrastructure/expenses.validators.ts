import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  description: z.string().min(1).max(255),
  category: z.string().min(1).max(50),
  date: z.string().datetime(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
