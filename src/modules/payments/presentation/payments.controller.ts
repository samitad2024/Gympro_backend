import { Request, Response } from "express";
import { asyncHandler } from "@core/utils/async-handler";
import { sendSuccess } from "@core/utils/api-response";
import * as paymentsService from "../application/payments.service";

export const listPayments = asyncHandler(async (req: Request, res: Response) => {
  const memberId = req.query.memberId
    ? Number(req.query.memberId)
    : undefined;
  const payments = await paymentsService.listPayments(memberId);
  sendSuccess(res, payments);
});

export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentsService.getPaymentById(Number(req.params.id));
  sendSuccess(res, payment);
});

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentsService.createManualPayment(req.body);
  sendSuccess(res, payment, 201);
});
