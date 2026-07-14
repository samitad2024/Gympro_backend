import { AppError } from "@utils/app-error";
import * as expensesRepo from "./expenses.repository";
import { CreateExpenseInput, UpdateExpenseInput } from "./expenses.types";

export async function listExpenses() {
  return expensesRepo.findAllExpenses();
}

export async function getExpenseById(id: number) {
  const expense = await expensesRepo.findExpenseById(id);
  if (!expense) {
    throw new AppError("Expense not found", 404);
  }
  return expense;
}

export async function createExpense(input: CreateExpenseInput) {
  return expensesRepo.createExpense({
    ...input,
    date: new Date(input.date),
  });
}

export async function updateExpense(id: number, input: UpdateExpenseInput) {
  const data: Record<string, unknown> = { ...input };
  if (input.date) {
    data.date = new Date(input.date);
  }
  const expense = await expensesRepo.updateExpense(id, data);
  if (!expense) {
    throw new AppError("Expense not found", 404);
  }
  return expense;
}

export async function deleteExpense(id: number) {
  const expense = await expensesRepo.deleteExpense(id);
  if (!expense) {
    throw new AppError("Expense not found", 404);
  }
  return expense;
}
