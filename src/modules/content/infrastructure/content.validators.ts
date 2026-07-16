import { z } from "zod";

export const createContentSchema = z.object({
  type: z.enum(["manual", "quote"]),
  title: z.string().min(1).max(200),
  body: z.string().min(1),
});

export const updateContentSchema = createContentSchema.partial();

export const contentIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listContentQuerySchema = z.object({
  type: z.enum(["manual", "quote"]).optional(),
});
