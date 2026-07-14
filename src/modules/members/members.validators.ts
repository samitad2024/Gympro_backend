import { z } from "zod";

export const createMemberSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(1).max(30),
  planId: z.coerce.number().int().positive(),
  fcmToken: z.string().max(255).optional(),
});

export const updateMemberSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().min(1).max(30).optional(),
  planId: z.coerce.number().int().positive().optional(),
  fcmToken: z.string().max(255).optional(),
});

export const confirmMemberSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  methodLabel: z.string().min(1).max(50),
});

export const memberIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listMembersQuerySchema = z.object({
  status: z.enum(["pending", "active", "expired"]).optional(),
});
