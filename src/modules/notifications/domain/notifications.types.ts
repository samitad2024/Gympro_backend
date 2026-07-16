import { notificationsSchedule } from "@core/database/schema";

export type NotificationSchedule = typeof notificationsSchedule.$inferSelect;
export type NewNotificationSchedule = typeof notificationsSchedule.$inferInsert;

export type CreateNotificationInput = {
  title: string;
  body: string;
  scheduledAt: string;
  isActive?: boolean;
};

export type UpdateNotificationInput = Partial<CreateNotificationInput>;
