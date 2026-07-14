import { Router } from "express";
import { validateRequest } from "@middleware/validate-request";
import { monthlyReportQuerySchema } from "./reports.validators";
import * as reportsController from "./reports.controller";

const router = Router();

/**
 * @openapi
 * /api/reports/monthly:
 *   get:
 *     tags: [Reports]
 *     summary: Get monthly income/expense summary
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-07"
 *     responses:
 *       200:
 *         description: Monthly report with income, expenses, and net profit
 */
router.get(
  "/monthly",
  validateRequest({ query: monthlyReportQuerySchema }),
  reportsController.getMonthlyReport
);

export default router;
