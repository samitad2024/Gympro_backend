import { expenses } from "@db/schema";

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

export type CreateExpenseInput = {
  amount: string;
  description: string;
  category: string;
  date: string;
};

export type UpdateExpenseInput = Partial<CreateExpenseInput>;
