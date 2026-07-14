import { Router } from "express";
import { validateRequest } from "@middleware/validate-request";
import {
  createPaymentSchema,
  listPaymentsQuerySchema,
  paymentIdParamSchema,
} from "./payments.validators";
import * as paymentsController from "./payments.controller";

const router = Router();

/**
 * @openapi
 * /api/payments:
 *   get:
 *     tags: [Payments]
 *     summary: List all payments
 *     parameters:
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get(
  "/",
  validateRequest({ query: listPaymentsQuerySchema }),
  paymentsController.listPayments
);

/**
 * @openapi
 * /api/payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get a payment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment details
 */
router.get(
  "/:id",
  validateRequest({ params: paymentIdParamSchema }),
  paymentsController.getPayment
);

/**
 * @openapi
 * /api/payments:
 *   post:
 *     tags: [Payments]
 *     summary: Manually add a payment for an active member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [memberId, amount, methodLabel]
 *             properties:
 *               memberId:
 *                 type: integer
 *               amount:
 *                 type: string
 *               methodLabel:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Payment created
 */
router.post(
  "/",
  validateRequest({ body: createPaymentSchema }),
  paymentsController.createPayment
);

export default router;
