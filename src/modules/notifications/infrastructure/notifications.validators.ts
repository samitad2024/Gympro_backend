import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(500),
  scheduledAt: z.string().datetime(),
  isActive: z.boolean().optional(),
});

export const updateNotificationSchema = createNotificationSchema.partial();

export const notificationIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
