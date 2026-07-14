import { Request, Response } from "express";
import { asyncHandler } from "@utils/async-handler";
import { sendSuccess } from "@utils/api-response";
import * as plansService from "./plans.service";

export const listPlans = asyncHandler(async (_req: Request, res: Response) => {
  const plans = await plansService.listPlans();
  sendSuccess(res, plans);
});

export const getPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await plansService.getPlanById(req.params.id as unknown as number);
  sendSuccess(res, plan);
});

export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await plansService.createPlan(req.body);
  sendSuccess(res, plan, 201);
});

export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await plansService.updatePlan(
    req.params.id as unknown as number,
    req.body
  );
  sendSuccess(res, plan);
});

export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await plansService.deletePlan(req.params.id as unknown as number);
  sendSuccess(res, plan);
});
