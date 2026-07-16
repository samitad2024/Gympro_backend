import { Router } from "express";
import { validateRequest } from "@core/middleware/validate-request";
import { memberLoginSchema, ownerLoginSchema } from "../infrastructure/auth.validators";
import * as authController from "./auth.controller";

const router = Router();

/**
 * @openapi
 * /api/auth/owner/login:
 *   post:
 *     tags: [Auth]
 *     summary: Owner login (returns JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token for dashboard access
 */
router.post(
  "/owner/login",
  validateRequest({ body: ownerLoginSchema }),
  authController.ownerLogin
);

/**
 * @openapi
 * /api/auth/member/login:
 *   post:
 *     tags: [Auth]
 *     summary: Member login by phone (returns JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token and member profile
 */
router.post(
  "/member/login",
  validateRequest({ body: memberLoginSchema }),
  authController.memberLogin
);

export default router;
