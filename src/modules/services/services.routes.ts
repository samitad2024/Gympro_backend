import { Router } from "express";
import { validateRequest } from "@middleware/validate-request";
import {
  createServiceSchema,
  listServicesQuerySchema,
  serviceIdParamSchema,
  updateServiceSchema,
} from "./services.validators";
import * as servicesController from "./services.controller";

const router = Router();

/**
 * @openapi
 * /api/services:
 *   get:
 *     tags: [Services]
 *     summary: List gym services
 *     parameters:
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of services
 */
router.get(
  "/",
  validateRequest({ query: listServicesQuerySchema }),
  servicesController.listServices
);

/**
 * @openapi
 * /api/services/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Get a service by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Service details
 */
router.get(
  "/:id",
  validateRequest({ params: serviceIdParamSchema }),
  servicesController.getService
);

/**
 * @openapi
 * /api/services:
 *   post:
 *     tags: [Services]
 *     summary: Create a service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Service created
 */
router.post(
  "/",
  validateRequest({ body: createServiceSchema }),
  servicesController.createService
);

/**
 * @openapi
 * /api/services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Update a service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Service updated
 */
router.put(
  "/:id",
  validateRequest({ params: serviceIdParamSchema, body: updateServiceSchema }),
  servicesController.updateService
);

/**
 * @openapi
 * /api/services/{id}:
 *   delete:
 *     tags: [Services]
 *     summary: Delete a service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.delete(
  "/:id",
  validateRequest({ params: serviceIdParamSchema }),
  servicesController.deleteService
);

export default router;
