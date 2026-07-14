import { Request, Response } from "express";
import { asyncHandler } from "@utils/async-handler";
import { sendSuccess } from "@utils/api-response";
import * as expensesService from "./expenses.service";

export const listExpenses = asyncHandler(async (_req: Request, res: Response) => {
  const expenses = await expensesService.listExpenses();
  sendSuccess(res, expenses);
});

export const getExpense = asyncHandler(async (req: Request, res: Response) => {
  const expense = await expensesService.getExpenseById(Number(req.params.id));
  sendSuccess(res, expense);
});

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const expense = await expensesService.createExpense(req.body);
  sendSuccess(res, expense, 201);
});

export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const expense = await expensesService.updateExpense(Number(req.params.id), req.body);
  sendSuccess(res, expense);
});

export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const expense = await expensesService.deleteExpense(Number(req.params.id));
  sendSuccess(res, expense);
});
