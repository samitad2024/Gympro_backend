import { Request, Response } from "express";
import { asyncHandler } from "@core/utils/async-handler";
import { sendSuccess } from "@core/utils/api-response";
import * as authService from "../application/auth.service";

export const ownerLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.ownerLogin(req.body);
  sendSuccess(res, result);
});

export const memberLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.memberLogin(req.body);
  sendSuccess(res, result);
});
