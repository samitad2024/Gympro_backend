import { Request, Response } from "express";
import { asyncHandler } from "@utils/async-handler";
import { sendSuccess } from "@utils/api-response";
import * as reportsService from "./reports.service";

export const getMonthlyReport = asyncHandler(async (req: Request, res: Response) => {
  const month = req.query.month as string;
  const report = await reportsService.getMonthlyReport(month);
  sendSuccess(res, report);
});
