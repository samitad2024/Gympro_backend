import { Router } from "express";
import { validateRequest } from "@middleware/validate-request";
import {
  createExpenseSchema,
  expenseIdParamSchema,
  updateExpenseSchema,
} from "./expenses.validators";
import * as expensesController from "./expenses.controller";

const router = Router();

/**
 * @openapi
 * /api/expenses:
 *   get:
 *     tags: [Expenses]
 *     summary: List all expenses
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get("/", expensesController.listExpenses);

/**
 * @openapi
 * /api/expenses/{id}:
 *   get:
 *     tags: [Expenses]
 *     summary: Get an expense by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense details
 */
router.get(
  "/:id",
  validateRequest({ params: expenseIdParamSchema }),
  expensesController.getExpense
);

/**
 * @openapi
 * /api/expenses:
 *   post:
 *     tags: [Expenses]
 *     summary: Log a new expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, description, category, date]
 *             properties:
 *               amount:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Expense created
 */
router.post(
  "/",
  validateRequest({ body: createExpenseSchema }),
  expensesController.createExpense
);

/**
 * @openapi
 * /api/expenses/{id}:
 *   put:
 *     tags: [Expenses]
 *     summary: Update an expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense updated
 */
router.put(
  "/:id",
  validateRequest({ params: expenseIdParamSchema, body: updateExpenseSchema }),
  expensesController.updateExpense
);

/**
 * @openapi
 * /api/expenses/{id}:
 *   delete:
 *     tags: [Expenses]
 *     summary: Delete an expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense deleted
 */
router.delete(
  "/:id",
  validateRequest({ params: expenseIdParamSchema }),
  expensesController.deleteExpense
);

export default router;
