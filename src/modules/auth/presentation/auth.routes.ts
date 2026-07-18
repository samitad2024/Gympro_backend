import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validateRequest } from "@core/middleware/validate-request";
import { memberLoginSchema, ownerLoginSchema } from "../infrastructure/auth.validators";
import * as authController from "./auth.controller";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
  },
});

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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  "/owner/login",
  authLimiter,
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post(
  "/member/login",
  authLimiter,
  validateRequest({ body: memberLoginSchema }),
  authController.memberLogin
);

export default router;
