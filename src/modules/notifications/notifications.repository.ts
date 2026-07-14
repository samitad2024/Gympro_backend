import { eq } from "drizzle-orm";
import { db } from "@db/client";
import { notificationsSchedule } from "@db/schema";
import { NewNotificationSchedule } from "./notifications.types";

export async function findAllNotifications() {
  return db
    .select()
    .from(notificationsSchedule)
    .orderBy(notificationsSchedule.scheduledAt);
}

export async function findNotificationById(id: number) {
  const [item] = await db
    .select()
    .from(notificationsSchedule)
    .where(eq(notificationsSchedule.id, id));
  return item ?? null;
}

export async function createNotification(data: NewNotificationSchedule) {
  const [item] = await db
    .insert(notificationsSchedule)
    .values(data)
    .returning();
  return item;
}

export async function updateNotification(
  id: number,
  data: Partial<NewNotificationSchedule>
) {
  const [item] = await db
    .update(notificationsSchedule)
    .set(data)
    .where(eq(notificationsSchedule.id, id))
    .returning();
  return item ?? null;
}

export async function deleteNotification(id: number) {
  const [item] = await db
    .delete(notificationsSchedule)
    .where(eq(notificationsSchedule.id, id))
    .returning();
  return item ?? null;
}
