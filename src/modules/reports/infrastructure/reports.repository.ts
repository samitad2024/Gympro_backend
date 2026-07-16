import { and, gte, lt, sql } from "drizzle-orm";
import { db } from "@core/database/client";
import { payments, expenses } from "@core/database/schema";

function getMonthRange(month: string) {
  const [year, monthNum] = month.split("-").map(Number);
  const start = new Date(year, monthNum - 1, 1);
  const end = new Date(year, monthNum, 1);
  return { start, end };
}

export async function getMonthlyAggregates(month: string) {
  const { start, end } = getMonthRange(month);

  const [incomeResult] = await db
    .select({
      total: sql<string>`coalesce(sum(${payments.amount}), 0)`,
      count: sql<number>`count(*)::int`,
    })
    .from(payments)
    .where(and(gte(payments.date, start), lt(payments.date, end)));

  const [expenseResult] = await db
    .select({
      total: sql<string>`coalesce(sum(${expenses.amount}), 0)`,
      count: sql<number>`count(*)::int`,
    })
    .from(expenses)
    .where(and(gte(expenses.date, start), lt(expenses.date, end)));

  return {
    totalIncome: incomeResult?.total ?? "0",
    totalExpenses: expenseResult?.total ?? "0",
    paymentCount: incomeResult?.count ?? 0,
    expenseCount: expenseResult?.count ?? 0,
  };
}
