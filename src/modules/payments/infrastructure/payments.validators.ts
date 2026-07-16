import { z } from "zod";

export const createPaymentSchema = z.object({
  memberId: z.coerce.number().int().positive(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  methodLabel: z.string().min(1).max(50),
  date: z.string().datetime().optional(),
});

export const paymentIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listPaymentsQuerySchema = z.object({
  memberId: z.coerce.number().int().positive().optional(),
});
