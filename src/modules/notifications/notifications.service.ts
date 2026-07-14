import { AppError } from "@utils/app-error";
import * as notificationsRepo from "./notifications.repository";
import {
  CreateNotificationInput,
  UpdateNotificationInput,
} from "./notifications.types";

export async function listNotifications() {
  return notificationsRepo.findAllNotifications();
}

export async function getNotificationById(id: number) {
  const item = await notificationsRepo.findNotificationById(id);
  if (!item) {
    throw new AppError("Notification not found", 404);
  }
  return item;
}

export async function createNotification(input: CreateNotificationInput) {
  return notificationsRepo.createNotification({
    ...input,
    scheduledAt: new Date(input.scheduledAt),
  });
}

export async function updateNotification(
  id: number,
  input: UpdateNotificationInput
) {
  const data: Record<string, unknown> = { ...input };
  if (input.scheduledAt) {
    data.scheduledAt = new Date(input.scheduledAt);
  }
  const item = await notificationsRepo.updateNotification(id, data);
  if (!item) {
    throw new AppError("Notification not found", 404);
  }
  return item;
}

export async function deleteNotification(id: number) {
  const item = await notificationsRepo.deleteNotification(id);
  if (!item) {
    throw new AppError("Notification not found", 404);
  }
  return item;
}
