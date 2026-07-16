import { Router } from "express";
import { validateRequest } from "@middleware/validate-request";
import {
  createPlanSchema,
  planIdParamSchema,
  updatePlanSchema,
} from "./plans.validators";
import * as plansController from "./plans.controller";

const router = Router();

/**
 * @openapi
 * /api/plans:
 *   get:
 *     tags: [Plans]
 *     summary: List all membership plans
 *     responses:
 *       200:
 *         description: List of plans
 */
router.get("/", plansController.listPlans);

/**
 * @openapi
 * /api/plans/{id}:
 *   get:
 *     tags: [Plans]
 *     summary: Get a plan by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan details
 *       404:
 *         description: Plan not found
 */
router.get(
  "/:id",
  validateRequest({ params: planIdParamSchema }),
  plansController.getPlan
);

/**
 * @openapi
 * /api/plans:
 *   post:
 *     tags: [Plans]
 *     summary: Create a membership plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, durationDays, price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Monthly Plan"
 *               durationDays:
 *                 type: integer
 *                 minimum: 1
 *                 example: 30
 *               price:
 *                 type: string
 *                 example: "500.00"
 *     responses:
 *       201:
 *         description: Plan created
 */
router.post(
  "/",
  validateRequest({ body: createPlanSchema }),
  plansController.createPlan
);

/**
 * @openapi
 * /api/plans/{id}:
 *   put:
 *     tags: [Plans]
 *     summary: Update a membership plan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               durationDays:
 *                 type: integer
 *               price:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plan updated
 *       404:
 *         description: Plan not found
 */
router.put(
  "/:id",
  validateRequest({ params: planIdParamSchema, body: updatePlanSchema }),
  plansController.updatePlan
);

/**
 * @openapi
 * /api/plans/{id}:
 *   delete:
 *     tags: [Plans]
 *     summary: Delete a membership plan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan deleted
 *       404:
 *         description: Plan not found
 */
router.delete(
  "/:id",
  validateRequest({ params: planIdParamSchema }),
  plansController.deletePlan
);

export default router;
