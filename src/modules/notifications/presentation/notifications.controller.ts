import { Request, Response } from "express";
import { asyncHandler } from "@core/utils/async-handler";
import { sendSuccess } from "@core/utils/api-response";
import * as notificationsService from "../application/notifications.service";

export const listNotifications = asyncHandler(
  async (_req: Request, res: Response) => {
    const items = await notificationsService.listNotifications();
    sendSuccess(res, items);
  }
);

export const getNotification = asyncHandler(async (req: Request, res: Response) => {
  const item = await notificationsService.getNotificationById(Number(req.params.id));
  sendSuccess(res, item);
});

export const createNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const item = await notificationsService.createNotification(req.body);
    sendSuccess(res, item, 201);
  }
);

export const updateNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const item = await notificationsService.updateNotification(
      Number(req.params.id),
      req.body
    );
    sendSuccess(res, item);
  }
);

export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const item = await notificationsService.deleteNotification(Number(req.params.id));
    sendSuccess(res, item);
  }
);
