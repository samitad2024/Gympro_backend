import { Router } from "express";
import { validateRequest } from "@middleware/validate-request";
import {
  contentIdParamSchema,
  createContentSchema,
  listContentQuerySchema,
  updateContentSchema,
} from "./content.validators";
import * as contentController from "./content.controller";

const router = Router();

/**
 * @openapi
 * /api/content:
 *   get:
 *     tags: [Content]
 *     summary: List content (manuals and quotes)
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [manual, quote]
 *     responses:
 *       200:
 *         description: List of content items
 */
router.get(
  "/",
  validateRequest({ query: listContentQuerySchema }),
  contentController.listContent
);

/**
 * @openapi
 * /api/content/daily-quote:
 *   get:
 *     tags: [Content]
 *     summary: Get today's daily quote
 *     responses:
 *       200:
 *         description: Daily quote
 */
router.get("/daily-quote", contentController.getDailyQuote);

/**
 * @openapi
 * /api/content/{id}:
 *   get:
 *     tags: [Content]
 *     summary: Get content by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content details
 */
router.get(
  "/:id",
  validateRequest({ params: contentIdParamSchema }),
  contentController.getContent
);

/**
 * @openapi
 * /api/content:
 *   post:
 *     tags: [Content]
 *     summary: Create content (manual or quote)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, title, body]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [manual, quote]
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Content created
 */
router.post(
  "/",
  validateRequest({ body: createContentSchema }),
  contentController.createContent
);

/**
 * @openapi
 * /api/content/{id}:
 *   put:
 *     tags: [Content]
 *     summary: Update content
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content updated
 */
router.put(
  "/:id",
  validateRequest({ params: contentIdParamSchema, body: updateContentSchema }),
  contentController.updateContent
);

/**
 * @openapi
 * /api/content/{id}:
 *   delete:
 *     tags: [Content]
 *     summary: Delete content
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content deleted
 */
router.delete(
  "/:id",
  validateRequest({ params: contentIdParamSchema }),
  contentController.deleteContent
);

export default router;
