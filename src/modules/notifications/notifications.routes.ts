import { Router } from "express";
import { validateRequest } from "@middleware/validate-request";
import {
  createNotificationSchema,
  notificationIdParamSchema,
  updateNotificationSchema,
} from "./notifications.validators";
import * as notificationsController from "./notifications.controller";

const router = Router();

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List scheduled notifications
 *     responses:
 *       200:
 *         description: List of scheduled notifications
 */
router.get("/", notificationsController.listNotifications);

/**
 * @openapi
 * /api/notifications/{id}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get a scheduled notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification details
 */
router.get(
  "/:id",
  validateRequest({ params: notificationIdParamSchema }),
  notificationsController.getNotification
);

/**
 * @openapi
 * /api/notifications:
 *   post:
 *     tags: [Notifications]
 *     summary: Schedule a new notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, body, scheduledAt]
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Notification scheduled
 */
router.post(
  "/",
  validateRequest({ body: createNotificationSchema }),
  notificationsController.createNotification
);

/**
 * @openapi
 * /api/notifications/{id}:
 *   put:
 *     tags: [Notifications]
 *     summary: Update a scheduled notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification updated
 */
router.put(
  "/:id",
  validateRequest({
    params: notificationIdParamSchema,
    body: updateNotificationSchema,
  }),
  notificationsController.updateNotification
);

/**
 * @openapi
 * /api/notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a scheduled notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification deleted
 */
router.delete(
  "/:id",
  validateRequest({ params: notificationIdParamSchema }),
  notificationsController.deleteNotification
);

export default router;
