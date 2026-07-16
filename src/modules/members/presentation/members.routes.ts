import { Router } from "express";
import { validateRequest } from "@core/middleware/validate-request";
import {
  confirmMemberSchema,
  createMemberSchema,
  listMembersQuerySchema,
  memberIdParamSchema,
  updateMemberSchema,
} from "../infrastructure/members.validators";
import * as membersController from "./members.controller";

const router = Router();

/**
 * @openapi
 * /api/members:
 *   get:
 *     tags: [Members]
 *     summary: List all members
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, expired]
 *     responses:
 *       200:
 *         description: List of members
 */
router.get(
  "/",
  validateRequest({ query: listMembersQuerySchema }),
  membersController.listMembers
);

/**
 * @openapi
 * /api/members/pending:
 *   get:
 *     tags: [Members]
 *     summary: List pending members awaiting payment confirmation
 *     responses:
 *       200:
 *         description: Pending members queue
 */
router.get("/pending", membersController.listPendingMembers);

/**
 * @openapi
 * /api/members/{id}:
 *   get:
 *     tags: [Members]
 *     summary: Get a member by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member details
 *       404:
 *         description: Member not found
 */
router.get(
  "/:id",
  validateRequest({ params: memberIdParamSchema }),
  membersController.getMember
);

/**
 * @openapi
 * /api/members:
 *   post:
 *     tags: [Members]
 *     summary: Register a new member (status = pending)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, planId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               planId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               fcmToken:
 *                 type: string
 *                 example: ""
 *     responses:
 *       201:
 *         description: Member registered with pending status
 */
router.post(
  "/",
  validateRequest({ body: createMemberSchema }),
  membersController.createMember
);

/**
 * @openapi
 * /api/members/{id}:
 *   put:
 *     tags: [Members]
 *     summary: Update a member
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
 *               phone:
 *                 type: string
 *               planId:
 *                 type: integer
 *               fcmToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated
 */
router.put(
  "/:id",
  validateRequest({ params: memberIdParamSchema, body: updateMemberSchema }),
  membersController.updateMember
);

/**
 * @openapi
 * /api/members/{id}/confirm:
 *   patch:
 *     tags: [Members]
 *     summary: Confirm payment and activate a pending member
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
 *             required: [amount, methodLabel]
 *             properties:
 *               amount:
 *                 type: string
 *                 example: "500.00"
 *               methodLabel:
 *                 type: string
 *                 example: "Cash"
 *     responses:
 *       200:
 *         description: Member activated and payment logged
 */
router.patch(
  "/:id/confirm",
  validateRequest({ params: memberIdParamSchema, body: confirmMemberSchema }),
  membersController.confirmMember
);

/**
 * @openapi
 * /api/members/{id}:
 *   delete:
 *     tags: [Members]
 *     summary: Delete a member
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member deleted
 */
router.delete(
  "/:id",
  validateRequest({ params: memberIdParamSchema }),
  membersController.deleteMember
);

export default router;
