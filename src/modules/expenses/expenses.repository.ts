import { eq } from "drizzle-orm";
import { db } from "@db/client";
import { expenses } from "@db/schema";
import { NewExpense } from "./expenses.types";

export async function findAllExpenses() {
  return db.select().from(expenses).orderBy(expenses.date);
}

export async function findExpenseById(id: number) {
  const [expense] = await db
    .select()
    .from(expenses)
    .where(eq(expenses.id, id));
  return expense ?? null;
}

export async function createExpense(data: NewExpense) {
  const [expense] = await db.insert(expenses).values(data).returning();
  return expense;
}

export async function updateExpense(id: number, data: Partial<NewExpense>) {
  const [expense] = await db
    .update(expenses)
    .set(data)
    .where(eq(expenses.id, id))
    .returning();
  return expense ?? null;
}

export async function deleteExpense(id: number) {
  const [expense] = await db
    .delete(expenses)
    .where(eq(expenses.id, id))
    .returning();
  return expense ?? null;
}
